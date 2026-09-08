# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
bun --bun vite dev            # dev server at http://localhost:4050
bun --bun vite build          # production build
bun .output/server/index.mjs  # serve production build

# Code quality (Biome, not ESLint/Prettier)
biome lint src                # lint check
biome lint src --write        # lint + auto-fix
biome format src --write      # format files
biome format src --check      # format check (used in precommit)
tsc --noEmit                  # type check
bun run precommit             # lint + typecheck + format:check

# Database (PostgreSQL — config DB and knowledge graph)
bun scripts/rebuild-db.ts                  # full schema rebuild (drops + recreates all tables)
bun src/lib/db/seeds/001_initial_data.ts   # seed sample data + Sakila data source
bun scripts/init-postgres.ts               # init PostgreSQL user DBs with pgvector tables

# Knowledge graph (Apache AGE)
bun scripts/sync-knowledge-graph.ts       # bootstrap AGE + sync schema + import llmtext

# Background jobs (Trigger.dev tasks, or built-in cron fallback)
bun src/lib/jobs/worker-runner.ts         # start background jobs worker

# E2E tests (start dev server first — webServer config is commented out in playwright.config.ts)
playwright test                             # all tests
playwright test --headed                    # visible browser
playwright test --ui                        # Playwright UI
playwright test e2e/sql-editor.spec.ts      # single spec file
playwright test e2e/sql-editor.spec.ts -g "saves a query"   # single test by name
bun run test:setup && playwright test       # setup test data then run all
```

## Architecture

### Framework and Runtime

TanStack Start v1 (`@tanstack/react-start` ^1.167.65) with file-based routing. Requires Bun ≥ 1.3.0. Dev server runs on port 4050. Linting and formatting use Biome (not ESLint/Prettier).

### Two-Database Architecture

**Config DB (PostgreSQL only)** — `src/lib/db/kysely-db.ts`, re-exported from `src/lib/db/config.ts`:

```ts
import { getDb } from "@/lib/db/config";
```

- Connection via `DATABASE_URL`, else assembled from `POSTGRES_HOST/PORT/DB/USER/PASSWORD` (or `PGHOST`/`PGPORT`/… ), defaulting to `localhost:5432/enterprise_config` as user `enterprise`
- `getDb()` is synchronous; bootstraps schema on first call via `bootstrapSchema()` in `src/lib/db/bootstrap.ts` — idempotent (`CREATE TABLE IF NOT EXISTS`), safe to run every boot
- Stores everything: users, roles, user_roles, resource_permissions, data_sources, saved_queries, report_definitions, chart_definitions, dashboard_layouts, dashboard_widgets, job_definitions, job_executions, audit_log, logs, email_templates, filter_definitions, report_filters, chart_filters, ds_roles, ds_user_roles, ds_entity_permissions, schema_table_instructions, schema_field_instructions, nl_query_context, nl_query_role_stats, nl_query_feedback, help_articles
- The `Database` interface in `src/lib/db/kysely-db.ts` is the authoritative type for all config DB tables — add a table there and in `bootstrap.ts` together
- **Knowledge graph** (`ers_knowledge` database): Apache AGE property graph for NL query context; separate pool in `src/lib/graph/client.ts` via `GRAPH_DATABASE_URL`

There is no MariaDB or SQLite anywhere in the running system, despite what several files under `docs/` still claim (see **Stale documentation** below).

**User Data Sources** — `src/lib/db/connection-manager.ts`:

```ts
import { getConnection } from "@/lib/db/connection-manager";
const kysely = await getConnection(dataSource);  // Kysely<any>
```

- Returns a Kysely instance for the user's external database
- Supported `client_type` values: `pg`, `mysql`, `mssql`
- Connection configs stored AES-256-GCM encrypted (`ENCRYPTION_KEY` env var) in the config DB's `data_sources` table; decrypted via `src/lib/security/encryption.ts`
- Connections pooled by data source ID and health-checked before reuse
- Hostnames are resolved to IPv4 explicitly (`resolveIPv4`) because Docker DNS returns IPv6 first and that path fails against Neon pooler endpoints — keep `ssl.servername` set when changing this

### Route Structure

File-based routing under `src/routes/`:

```
src/routes/
├── __root.tsx     # ThemeProvider → TanStackDBWrapper → DuckDBProvider → TooltipProvider → QueryClientProvider
├── _authed.tsx    # Auth guard: reads session_token cookie, redirects to /login if absent/invalid
├── _authed/       # Protected pages: dashboard, sql-editor, nl-query, charts, dashboards, reports,
│                  #   data-sources, datasets, metadata, filters, jobs, monitoring, queue-management,
│                  #   trigger-board, logs, system-logs, settings, admin, users, roles, permissions
├── api/           # API routes using server.handlers pattern
├── share/         # Public (unauthenticated) share links: chart, dashboard, report
├── login.tsx      # Public login page
└── index.tsx      # Root redirect
```

API routes pattern:

```ts
export const Route = createFileRoute("/api/some-path")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        return json({ ... }, { status: 200 });
      },
    },
  },
});
```

`src/routeTree.gen.ts` is generated — never edit it by hand.

### Server Functions — Critical Conventions

Server functions live in `src/server-fns/`. The TanStack Start Vite plugin only recognizes `.inputValidator()` — using `.validator()` causes a runtime crash because the Vite plugin preserves unknown method names verbatim in the client bundle.

```ts
// Correct: use .inputValidator() not .validator()
export const myFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data: { id } }) => { ... });

// Client call MUST pass { data: ... } wrapper when inputValidator is used:
const result = await myFn({ data: { id: "abc" } });

// Without inputValidator, no wrapper needed:
export const otherFn = createServerFn({ method: "GET" }).handler(async () => { ... });
await otherFn();
```

Newer server functions wrap logic in `withErrorHandler()` from `src/lib/server-fns/with-error-handler.ts`, which audit-logs failures and normalizes errors into `ServerFunctionError` subclasses (`ValidationError` 422, `UnauthorizedError` 401, `NotFoundError` 404). Older ones return `{ success: boolean, data?: T, error?: string }` directly.

### Auth

- JWT signed with `AUTH_SECRET` env var, stored in `session_token` HttpOnly cookie
- `verifySession(token)` in `src/lib/auth/session.ts` returns `Session | null`
- In server fns (`src/server-fns/`): `import { requireAuth } from "@/lib/auth/middleware"` then `const session = await requireAuth()`
- In API route handlers (`src/routes/api/`): manually extract cookie and call `verifySession(token)`
- `_authed.tsx` runs session check in `beforeLoad` and injects `{ session }` into route context via `Route.useRouteContext()`

### NL Query Pipeline

`/_authed/nl-query/` → CopilotKit sidebar → `/api/copilotkit` → Mastra AI server → llama.cpp → pgvector RAG

1. CopilotKit sidebar (`@copilotkit/react-ui`) proxies to `MASTRA_URL` (default `http://localhost:4111`) via `/api/copilotkit`
2. SQL generation: `src/lib/nlquery/mastra-connector.ts` or `src/lib/nlquery/llama-translator.ts`
3. LLM server: OpenAI-compatible at `LLAMA_REASONING_URL` or `AI_NL2SQL_BASE_URL`
4. RAG context from `src/lib/mastra/rag-store.ts`: `nl_query_embeddings` + `nl_schema_embeddings` pgvector tables in the user's PostgreSQL DB
5. Full pipeline: `src/lib/mastra/nl-query-pipeline.ts` — schema fetch → LLM SQL generation → SQL AST validation → RBAC check → execute
6. Agent/tool orchestration variant: `src/lib/adk/pipeline.ts` (+ `intent-classifier.ts`, `tools/`) calls the same Mastra server
7. Embedding server: `LLAMA_EMBEDDING_URL` / `AI_EMBEDDING_BASE_URL`; falls back to hash-based embeddings when unavailable
8. Embedding dimension: 384 — changing requires re-ingesting all embeddings

### RBAC

Two layers, both stored in the config DB (PostgreSQL):

1. **System-level**: `roles` + `user_roles`. Permission strings: `resource:action` (e.g. `data_source:view`, `nl_query:*`, `*:*`). Helpers in `src/lib/permissions/permissions.ts` — `hasPermission`, `hasResourceAccess`, `filterAccessibleResources`, `requirePermission`
2. **Data-source-level**: `ds_roles`, `ds_user_roles`, `ds_entity_permissions`. Per-table/column access per data source per role. Helpers in `src/lib/permissions/ds-rbac.ts` — `checkEntityAccess`, `getUserAccessibleEntities`. Generated SQL is parsed by `src/lib/mastra/sql-parser.ts` and validated against these before execution

### Background Jobs — Trigger.dev, not BullMQ

Job processing runs on **Trigger.dev** (`@trigger.dev/sdk`), configured in `trigger.config.ts` (project `enterprise-reporting`, tasks discovered under `./src/lib/jobs`).

- Task definitions: `src/lib/jobs/trigger-tasks.ts` — `report:generate`, `data:export`, `email:batch`, `scheduled:refresh`, plus monitoring evaluation
- Enqueue via `src/lib/jobs/trigger-queue.ts`; the actual work lives in `src/lib/jobs/workers/`
- `src/lib/jobs/worker-runner.ts` picks the backend: Trigger.dev when `TRIGGER_API_URL` is set, otherwise it starts the built-in on-premise cron runner (`src/lib/monitoring/monitoring-scheduler.ts`), a pure-Bun interval loop that polls `monitoring_rules` every minute
- **BullMQ is gone.** `src/lib/queue/` — the dead legacy tree that imported `bullmq` and `ioredis`, neither of which was ever in `package.json` — has been deleted, along with the Bull Board routes it backed. Job payload types now live beside their consumers in `src/lib/jobs/types.ts`, and the workers take their payload directly rather than a BullMQ `Job` wrapper. `/bull-board` is `/trigger-board`

### Other Subsystems

- **DuckDB WASM** (`src/lib/duckdb/`, `DuckDBProvider` in the root layout): in-browser SQL over query results, gated by `NEXT_PUBLIC_WASM_ENABLED`; progressive loading in `src/lib/wasm/`
- **Knowledge graph** (`src/lib/graph/`): Apache AGE schema sync + graph RAG for NL context
- **Metadata layer** (`src/lib/metadata/`): entity/field definitions, sync from live data source schemas, and metadata-level permissions
- **OpenKB** (`src/lib/openkb/`): knowledge-base client + embedding service for help content
- **Export** (`src/lib/export/`): CSV, Excel via `exceljs`, PDF via `jspdf` + `jspdf-autotable`
- **Logging** (`src/lib/logging/`): Pino; logs are also persisted to the config DB `logs` table

### TanStack DB (client-side state)

`src/lib/tanstack-db/collections.ts` — local in-memory `@tanstack/db` collections (no server sync configured):
`activeFiltersCollection`, `chartDraftCollection`, `dashboardStateCollection`, `queryHistoryCollection`, `reportsCollection`, `chartsCollection`, `dashboardsCollection`

### Feature Flags

`src/lib/feature-flags.ts` reads `NEXT_PUBLIC_*` env vars (naming is a leftover; this is not Next.js):
- `NEXT_PUBLIC_WASM_ENABLED` — DuckDB WASM in-browser SQL
- `NEXT_PUBLIC_ECHARTS_ENABLED` — ECharts alternative to Recharts
- `NEXT_PUBLIC_CROSSFILTER_ENABLED` — cross-widget dashboard filtering
- `NEXT_PUBLIC_OFFLINE_ENABLED` — IndexedDB offline caching
- `NEXT_PUBLIC_PROGRESSIVE_ENABLED` — progressive loading for large datasets

## Environment Variables

**Required:**
```
AUTH_SECRET=           # JWT signing key (≥32 chars)
ENCRYPTION_KEY=        # AES-256-GCM key (64 hex chars) for data source connection configs
DATABASE_URL=postgresql://enterprise:password@localhost:5432/enterprise_config
GRAPH_DATABASE_URL=postgresql://enterprise:password@localhost:5432/ers_knowledge
```

**AI / NL Query (optional, needed for NL features):**
```
MASTRA_URL=http://localhost:4111           # Mastra AI server
LLAMA_REASONING_URL=http://localhost:8080  # llama.cpp NL→SQL (appends /v1)
AI_NL2SQL_BASE_URL=                        # Full base URL override (includes /v1)
AI_NL2SQL_MODEL=                           # NL→SQL model name
LLAMA_EMBEDDING_URL=http://localhost:8080  # Embedding server
AI_EMBEDDING_BASE_URL=                     # Full embedding URL override
LLAMA_STT_URL=http://localhost:8081        # Speech-to-text
LLAMA_TTS_URL=http://localhost:8083        # Text-to-speech
```

**Optional:**
```
TRIGGER_API_URL=           # Trigger.dev server; unset falls back to the built-in cron runner
TRIGGER_API_KEY=
WORKER_CONCURRENCY=5
SMTP_HOST/PORT/USER/PASS/SECURE  # Email settings
LOG_LEVEL=info             # Pino log level
DEFAULT_PAGE_SIZE / MAX_PAGE_SIZE / DATA_TABLE_PAGE_SIZE / EXPORT_PAGE_SIZE
```

`.env.example` documents this full set; copy it to `.env` to start.

**Server-side pagination is mandatory.** Every data query must apply `LIMIT`/`OFFSET` at the database level; never fetch a full table and paginate on the client.

## Default Credentials

Auto-created by `bootstrapSchema()` on first startup (only inserts when no users exist):
- `admin@admin.com` / `admin` — full administrator
- `nlquery@nlquery.com` / `nlquery` — NL query role only

Running `bun run db:seed` also adds `analyst@example.com` / `analyst123` with a sample Sakila data source.

## E2E Tests

Playwright tests in `e2e/`. The dev server must be running on port 4050 before running tests (the `webServer` config in `playwright.config.ts` is commented out). Auth state is set up once by `e2e/global-setup.ts` and cached in `auth.json`, then reused via `storageState`. Tests run serially (1 worker, `fullyParallel: false`) to prevent session interference. Override the target with `BASE_URL`.

## `bun run typecheck` passes — keep it that way

`tsconfig.json` includes `**/*.ts`, so `typecheck` — and therefore `precommit` —
covers `language/`, `scripts/`, `e2e/` and `tests/` as well as `src/`. It now
reports **zero** errors.

It did not always. The backlog was 678 errors across ~140 files, and it was
invisible: a single unescaped backtick in `language/cli/src/generate/app.ts`
made that file unparseable, and one parse error makes `tsc` report *that alone*
and stop — so `typecheck` printed exactly one error and exited 2, which reads
far more like a small local problem than a backlog. Fixing the parse error is
what surfaced the rest.

Two habits are worth keeping from that:

- **A low error count is not automatically good news.** If the number collapses
  after an edit, check for a parse error stopping `tsc` early rather than
  assuming you fixed something.
- **Most of those 678 were real defects, not type noise** — Kysely called with
  Knex's API, `.where(column, value)` without an operator, server functions
  reading their payload off the ctx, inserts omitting a NOT NULL primary key,
  columns and hooks that never existed. Treat a new error as a bug report.

`language/**` uses explicit `.ts` import specifiers, which Bun resolves and
`tsc` rejects (TS5097) unless `allowImportingTsExtensions` is set — it is, in
`tsconfig.json`, and it needs the `noEmit` that is already there.

## `bun run precommit` passes too — including across a build

`precommit` is `lint && typecheck && format:check`, and all three are clean.
Getting the last one there took a config change rather than a reformat, and the
reason is worth keeping:

**`src/routeTree.gen.ts` is written by the TanStack router generator on every
`vite build`, in a shape Biome's formatter disagrees with.** Formatting it makes
`format:check` pass exactly until the next build regenerates it — so a tree can
pass the check, build, and fail it again with nothing modified and nothing in
`git status`. That is why `biome.json` now excludes the file from the formatter
(`formatter.includes`), alongside the lint overrides it already had. Do not
reformat it by hand; the generator wins.

Two Biome details that cost time here:

- **`format` without `--write` *is* the check.** There is no `--check` flag in
  Biome v2 — `package.json`'s `format:check` used to pass it and Biome ignored
  the whole invocation, so the check reported success without running.
- **`organizeImports` is an assist, not a lint rule or a formatter rule.**
  `biome check --write` applies it and touches ~190 files; neither `lint`,
  `format:check` nor `precommit` asks for it. Reach for `biome format --write`
  or `biome lint --only=<rule> --write`, never a bare `check --write`.

Where a lint rule is genuinely wrong for the code, the suppression carries a
reason: index keys on a query-result preview table whose rows have no id,
`dangerouslySetInnerHTML` for the pre-paint theme script and for help articles
already through `DOMPurify.sanitize`. Everything else was fixed rather than
silenced.

## CI

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`.
Before it existed — which was until recently — nothing on GitHub checked
anything here, and `precommit` passing was only ever true of whichever tree
someone last ran it in.

| Job | What it runs |
|---|---|
| **Lint, types and format** | `bun install --frozen-lockfile`, then `lint`, `typecheck` and `format:check` as three separate steps — the parts of `precommit`, split so a failure names itself |
| **Build** | `bun --bun vite build`, then `format:check` *again*, then an assertion that the build left no tracked file modified |

**The second `format:check` is the point of the build job.** The two sides of
the build catch different mistakes: dropping the `routeTree.gen.ts` formatter
exclusion on its own turns the first job red, because the committed file is in
generator form — but dropping it *and* formatting the file by hand, which is the
tempting fix and the one that looks like it worked, leaves the first job green.
Only the post-build check sees the generator put the file back.

Two things it deliberately does not do. There is **no `paths:` filter**:
`tsconfig.json` includes `**/*.ts`, so typecheck covers `language/`, `scripts/`,
`e2e/` and `tests/` too, and any filter narrow enough to be useful would leave
one of them unguarded — a skipped path-filtered run also reports no status at
all, which makes a job awkward to require later. And it **does not run the
Playwright suite**: that needs a dev server on 4050, a PostgreSQL config
database and a cached signed-in session, and `playwright.config.ts` has its
`webServer` commented out, so it starts nothing itself.

Bun is pinned to `1.3.11` there; `package.json` asks only for `>=1.3.0`.

## Stale documentation

Most files under `docs/` predate the migrations to PostgreSQL and Trigger.dev and describe SQLite/MariaDB, BullMQ + Redis, Bull Board, and OpenAI-based NL query. `docs/README.md` and this file are current; verify anything else in `docs/` against source before trusting it.

The same applies to the Docker Compose files: `docker-compose.yml` is current (PostgreSQL via `apache/age:PG16`, `DATABASE_URL`/`GRAPH_DATABASE_URL`), while `docker-compose.dev.yml`, `docker-compose.local.yml`, and `docker-compose.remote.yml` still start a MariaDB container and pass `MARIADB_*` to the app, which ignores them.

## EML Language System

`language/` and `llmtext/` contain the Enterprise Reporting Modeling Language (EML) system — a Mermaid-based language for describing an application as ERD + business rules + workflows, then generating a complete TanStack Start + Kysely application from that description.

Every EML document is valid, renderable Mermaid (`erDiagram`, `flowchart`, `stateDiagram-v2`). EML is a semantic superset: it assigns generator meaning to standard Mermaid syntax and to `%%` directive comments.

### Key files

- `language/erdwithai-language.json` — canonical machine-readable language definition (grammar, directives, validation rules)
- `language/checker.ts` — validates an `.mmd` file against the language definition
- `language/fixer.ts` — auto-repairs fixable checker diagnostics in-place
- `language/index.ts` — programmatic API (`loadLanguageDefinition`, `parseEml`, `validateModel`)
- `language/rag.ts` — RAG indexing for EML-aware LLM completions
- `language/cli/eml.ts` — CLI entry point (run with Bun)
- `language/examples/` — sample EML models (`minimal.eml.mmd`, `ecommerce.eml.mmd`, `helpdesk.eml.mmd`, `crm.eml.mmd`)
- `llmtext/llms-full.txt` — full application context spec for LLMs (architecture, conventions, patterns)

### CLI usage

Input is `-i/--input` or the first positional argument; output is `-o/--output`.
There is no `--out`.

```bash
# Validate a model
bun language/cli/eml.ts validate -i model.mmd

# Inspect parsed model summary
bun language/cli/eml.ts info -i model.mmd

# Generate application (enterprise-reporting is the default stack)
bun language/cli/eml.ts generate -i model.mmd -o ./generated

# Generate the dependency-free Node REST app instead
bun language/cli/eml.ts generate -i model.mmd -o ./generated --stack node-rest

# Auto-fix checker warnings before generating
bun language/checker.ts model.mmd   # check — also writes model.mmd.error beside it
bun language/fixer.ts model.mmd     # fix in-place
```

**The two stacks are `enterprise-reporting` (default) and `node-rest`.** There is
no `tanstack-nestjs` target here — that one belongs to `app-with-ai-tanstack`, and
passing it is rejected with `Unsupported stack`. `tanstack` and `tanstack-start`
are accepted as *aliases for `enterprise-reporting`*, which is the likeliest way
to think you got a NestJS stack and not notice.

`enterprise-reporting` emits code to paste into this repository; `node-rest`
emits a standalone `node:http` app over a JSON file, with no install step.

### Generated output (enterprise-reporting stack)

```
generated/
├── src/
│   ├── server-fns/<entity>.ts         # createServerFn with .inputValidator()
│   ├── routes/_authed/<entity>/
│   │   ├── index.tsx                  # List page (TanStack Table + shadcn/ui)
│   │   └── $id.tsx                    # Detail/edit page
│   └── lib/db/migrations/<ts>_create_tables.ts   # PostgreSQL DDL via sql``
├── rules/<rule>.jdm.json              # one GoRules JDM graph per %%rule flow
├── KYSELY_TYPES.md                    # Database-interface snippet to paste in
└── README.md
```

It writes a `KYSELY_TYPES.md` snippet, **not** a `kysely-db.ts` — you paste the
snippet into the `Database` interface in `src/lib/db/kysely-db.ts` yourself.

### The CLI vendors two modules from app-with-ai-tanstack

`language/cli/src/vendor/` holds copies of that repository's
`packages/web/src/lib/{jdm-converter,mermaid-flowchart-parser}.ts`, so a `%%rule`
flow compiles to the same JDM graph on both sides. They used to be imported
across the repository boundary as `../../../../packages/web/...`, which resolves
nowhere here — this repository has no `packages/` directory at all. Because
`cli.ts` imports the JDM emitter *statically*, that dangling path took down every
command, `validate` and `info` included, neither of which emits JDM. Both files
are dependency-free; re-copy them rather than editing them by hand.

## Repo-local Claude configuration

- `.claude/mcpServers.json` registers two MCP servers: `tanstack-start` (project structure/routes/server-fns/schema introspection, `bun .claude/mcp/tanstack-start-mcp.ts`) and `tanstack` (official TanStack docs search)
- `.claude/skills/bunjs-runtime.md` and `.claude/skills/tanstackstart-testing.md` hold Bun runtime and TanStack Start testing conventions

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
