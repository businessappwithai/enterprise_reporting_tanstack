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

# Database (PostgreSQL — all databases)
bun scripts/rebuild-db.ts                  # full schema rebuild (drops + recreates all tables)
bun src/lib/db/seeds/001_initial_data.ts   # seed sample data + Sakila data source
bun scripts/init-postgres.ts              # init PostgreSQL user DBs with pgvector tables

# Background jobs
bun src/lib/jobs/worker-runner.ts         # start background jobs worker

# E2E tests (start dev server first — webServer config is commented out in playwright.config.ts)
playwright test                             # all tests
playwright test --headed                    # visible browser
playwright test --ui                        # Playwright UI
playwright test e2e/sql-editor.spec.ts      # single spec file
bun run test:setup && playwright test       # setup test data then run all
```

## Architecture

### Framework and Runtime

TanStack Start v1 (`@tanstack/react-start` ^1.167.65) with file-based routing. Requires Bun ≥ 1.3.0. Dev server runs on port 4050. Linting and formatting use Biome (not ESLint/Prettier).

### Two-Database Architecture

**Config DB (PostgreSQL)** — `src/lib/db/kysely-db.ts`, re-exported from `src/lib/db/config.ts`:

```ts
import { getDb } from "@/lib/db/config";
```

- Connection via `DATABASE_URL` env var (preferred), or individual `POSTGRES_HOST/PORT/DB/USER/PASSWORD` vars
- `getDb()` is synchronous; bootstraps schema on first call via `bootstrapSchema()` — idempotent (`CREATE TABLE IF NOT EXISTS`), safe to run every boot
- Stores: users, roles, data_sources, saved_queries, report_definitions, chart_definitions, dashboard_layouts, dashboard_widgets, jobs, audit_log, logs, filter_definitions, nl_query_context, schema instructions, help_articles, ds_roles, ds_user_roles, ds_entity_permissions
- The `Database` interface in `src/lib/db/kysely-db.ts` is the authoritative type for all config DB tables
- **Knowledge graph** (`ers_knowledge` database, same postgres instance): Apache AGE property graph for NL query context; accessed via `GRAPH_DATABASE_URL`

**User Data Sources** — `src/lib/db/connection-manager.ts`:

```ts
import { getConnection } from "@/lib/db/connection-manager";
const kysely = await getConnection(dataSource);  // Kysely<any>
```

- Returns a Kysely instance for the user's external database
- Supported `client_type` values: `pg`, `mysql`, `mssql`
- Connection configs stored AES-256-GCM encrypted (`ENCRYPTION_KEY` env var) in MariaDB
- Connections pooled by data source ID and health-checked before reuse

### Route Structure

File-based routing under `src/routes/`:

```
src/routes/
├── __root.tsx     # Root layout: ThemeProvider → TanStackDBWrapper → DuckDBProvider → QueryClientProvider
├── _authed.tsx    # Auth guard: reads session_token cookie, redirects to /login if absent/invalid
├── _authed/       # Protected pages: dashboard, sql-editor, nl-query, charts, dashboards, admin, ...
├── api/           # API routes using server.handlers pattern
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

Newer server functions wrap logic in `withErrorHandler()` from `src/lib/server-fns/with-error-handler.ts` for audit logging and consistent error wrapping. Older ones return `{ success: boolean, data?: T, error?: string }` directly.

### Auth

- JWT signed with `AUTH_SECRET` env var, stored in `session_token` HttpOnly cookie
- `verifySession(token)` in `src/lib/auth/session.ts` returns `Session | null`
- In server fns (`src/server-fns/`): `import { requireAuth } from "@/lib/auth/middleware"` then `const session = await requireAuth()`
- In API route handlers (`src/routes/api/`): manually extract cookie and call `verifySession(token)`
- `_authed.tsx` runs session check in `beforeLoad` and injects `{ session }` into route context via `Route.useRouteContext()`

### NL Query Pipeline

`/_authed/nl-query/` → CopilotKit sidebar → `/api/copilotkit` → Mastra AI server → llama.cpp → pgvector RAG

1. CopilotKit sidebar (`@copilotkit/react-ui`) proxies to `MASTRA_URL` via `/api/copilotkit`
2. SQL generation: `src/lib/nlquery/mastra-connector.ts` or `src/lib/nlquery/llama-translator.ts`
3. LLM server: OpenAI-compatible at `LLAMA_REASONING_URL` or `AI_NL2SQL_BASE_URL` (default `http://localhost:8080/v1`)
4. RAG context from `src/lib/mastra/rag-store.ts`: `nl_query_embeddings` + `nl_schema_embeddings` pgvector tables in the user's PostgreSQL DB
5. Full pipeline: `src/lib/mastra/nl-query-pipeline.ts` — schema fetch → LLM SQL generation → SQL AST validation → RBAC check → execute
6. Embedding server: `LLAMA_EMBEDDING_URL` / `AI_EMBEDDING_BASE_URL`; falls back to hash-based embeddings when unavailable
7. Embedding dimension: 384 — changing requires re-ingesting all embeddings

### RBAC

Two-layer access control, both in MariaDB:

1. **System-level**: `roles` + `user_roles`. Permission strings: `resource:action` (e.g. `data_source:view`, `nl_query:*`, `*:*`). Helper: `src/lib/permissions/permissions.ts`
2. **Data-source-level**: `ds_roles`, `ds_user_roles`, `ds_entity_permissions`. Per-table/column access per data source per role. Helper: `src/lib/permissions/ds-rbac.ts`. SQL validated against these before execution via `src/lib/mastra/sql-parser.ts`

### TanStack DB (client-side state)

`src/lib/tanstack-db/collections.ts` — local in-memory `@tanstack/db` collections (no server sync configured):
`activeFiltersCollection`, `chartDraftCollection`, `dashboardStateCollection`, `queryHistoryCollection`, `reportsCollection`, `chartsCollection`, `dashboardsCollection`

### Feature Flags

`src/lib/feature-flags.ts` reads `NEXT_PUBLIC_*` env vars:
- `NEXT_PUBLIC_WASM_ENABLED` — DuckDB WASM in-browser SQL
- `NEXT_PUBLIC_ECHARTS_ENABLED` — ECharts alternative to Recharts
- `NEXT_PUBLIC_CROSSFILTER_ENABLED` — cross-widget dashboard filtering

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
MASTRA_URL=http://127.0.0.1:8000        # Mastra AI server
LLAMA_REASONING_URL=http://localhost:8080  # llama.cpp NL→SQL (appends /v1)
AI_NL2SQL_BASE_URL=                     # Full base URL override (includes /v1)
AI_NL2SQL_MODEL=                        # NL→SQL model name
LLAMA_EMBEDDING_URL=http://localhost:8080  # Embedding server
AI_EMBEDDING_BASE_URL=                  # Full embedding URL override
LLAMA_STT_URL=http://localhost:8081     # Speech-to-text
LLAMA_TTS_URL=http://localhost:8083     # Text-to-speech
```

**Optional:**
```
DATABASE_URL=              # Replace MariaDB with PostgreSQL for the config DB
REDIS_URL=                 # Redis for BullMQ job queues
TRIGGER_API_URL=           # Trigger.dev (falls back to built-in cron runner)
SMTP_HOST/PORT/USER/PASS/SECURE  # Email settings
LOG_LEVEL=info             # Pino log level
BULL_BOARD_USER/PASSWORD   # Bull Board UI credentials
```

## Default Credentials

Auto-created by `bootstrapSchema()` on first startup (only inserts when no users exist):
- `admin@admin.com` / `admin` — full administrator
- `nlquery@nlquery.com` / `nlquery` — NL query role only

Running `bun run db:seed` also adds `analyst@example.com` / `analyst123` with a sample Sakila data source.

## E2E Tests

Playwright tests in `e2e/`. The dev server must be running on port 4050 before running tests (the `webServer` config in `playwright.config.ts` is commented out). Auth state is set up once by `e2e/global-setup.ts` and cached in `auth.json`. Tests run serially (1 worker) to prevent session interference.

## EML Language System

`language/` and `llmtext/` contain the Enterprise Reporting Modeling Language (EML) system — a Mermaid-based language for describing an application as ERD + business rules + workflows, then generating a complete TanStack Start + MariaDB/Kysely application from that description.

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

```bash
# Validate a model
bun language/cli/eml.ts validate model.mmd

# Inspect parsed model summary
bun language/cli/eml.ts info model.mmd

# Generate application (targets this repo's stack by default)
bun language/cli/eml.ts generate model.mmd --out ./generated

# Available stacks: tanstack-nestjs (default), node-rest
bun language/cli/eml.ts generate model.mmd --stack tanstack-nestjs --out ./generated

# Auto-fix checker warnings before generating
bun language/checker.ts model.mmd   # check
bun language/fixer.ts model.mmd     # fix in-place
```

### Generated output (tanstack-nestjs stack)

```
generated/
├── src/
│   ├── server-fns/<entity>.ts         # createServerFn with .inputValidator()
│   ├── routes/_authed/<entity>/
│   │   ├── index.tsx                  # List page (TanStack Table + shadcn/ui)
│   │   └── $id.tsx                    # Detail/edit page
│   └── lib/db/
│       ├── kysely-db.ts               # Kysely Database interface extension
│       └── migrations/                # MariaDB CREATE TABLE migrations
└── README.md
```

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
