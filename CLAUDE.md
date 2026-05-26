# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ MANDATORY: Bun Runtime ONLY

**CRITICAL: This project uses ONLY Bun runtime across the entire application.**

### Commands
- ✅ `bun run dev` - Start development server
- ✅ `bun run build` - Production build
- ✅ `bun install` - Install dependencies
- ✅ `bun run start` - Start production server
- ✅ `bun <script>` - Run any package.json script

### Module Usage
- ✅ ALWAYS use `bun:*` modules (bun:test, etc.)
- ✅ Database MUST use PGLite (in-process PostgreSQL) via Kysely
- ✅ Configuration database uses PGLite for unified data storage
- ✅ Leverage Bun's built-in APIs for maximum performance

### Why PGLite
PGLite is an in-process PostgreSQL database that provides:
- ✅ Full SQL compatibility and ACID transactions
- ✅ Persistent file-based storage (survives application restarts)
- ✅ Instant commits - data written to disk immediately (no buffering)
- ✅ No external database dependencies
- ✅ Enterprise-grade reliability and durability

Using PGLite across all data layers ensures consistency, leverages PostgreSQL's powerful query capabilities, and guarantees data safety with instant persistence.

## Project Overview - Enterprise Reporting System

Enterprise Reporting and Dashboard System built with **TanStack Start** (full-stack React), **Bun runtime**, **PGLite** (in-process PostgreSQL via Kysely) for persistent data storage, **TanStack DB** for reactive client-side collections, and **shadcn/ui**. Provides data visualization, SQL querying, role-based access control, job scheduling, and multi-format export capabilities.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Bun >= 1.3.0 |
| Framework | TanStack Start 1.167+ (Vite-based, full-stack React) |
| Routing | TanStack Router (file-based, type-safe) |
| Language | TypeScript (strict mode, ES2022 target) |
| UI Components | shadcn/ui (Radix UI + Tailwind CSS 3) |
| State/Data | TanStack Query v5, TanStack Table v8, TanStack Form v1 |
| Reactive DB | TanStack DB v0.6 (client-side collections, PostgreSQL sync) |
| Database | PGLite (in-process PostgreSQL via Kysely) - persistent file-based |
| Auth | Custom JWT (jose) with HTTP-only cookies |
| Charts | Recharts, ECharts |
| Job Queue | Trigger.dev (Cloud-based job processing with local Mastra.ai API) |
| AI/NL Query | OpenAI (via @ai-sdk/openai), CopilotKit |
| Testing | Playwright (E2E only) |
| Styling | Tailwind CSS with CSS variables (HSL color system) |
| Deployment | Docker (Bun Alpine), Nginx reverse proxy |

## Quick Reference Commands

```bash
# Development
bun run dev              # Start Vite dev server on port 4050
bun run build            # Production build (.output/)
bun run start            # Start production server

# Quality checks
bun run lint             # ESLint
bun run lint:fix         # ESLint with auto-fix
bun run typecheck        # TypeScript type checking (tsc --noEmit)
bun run format           # Prettier formatting
bun run format:check     # Check formatting without writing
bun run precommit        # lint + typecheck + format:check
bun run build:check      # lint + typecheck + build

# Database
bun run db:migrate       # Run pending migrations
# db:migrate:make removed (use scripts/rebuild-db.ts for schema changes)
bun run db:seed          # Run seed files
# db:rollback: use scripts/rebuild-db.ts to recreate schema
bun run db:sample        # Seed sample data (src/lib/db/sample-data/seed.ts)

# Testing (Playwright E2E)
bun run test:e2e         # Run all E2E tests
bun run test:e2e:headed  # Run with browser visible
bun run test:e2e:debug   # Run in debug mode
bun run test:e2e:ui      # Interactive Playwright UI
bun run test:e2e:all     # Setup data + run E2E tests
bun run test:ci          # Full CI pipeline: lint + typecheck + setup + e2e

# Individual test suites
bun run test:app         # e2e/app.spec.ts
bun run test:dashboard   # e2e/dashboards.spec.ts
bun run test:sql         # e2e/sql-editor.spec.ts
bun run test:reports     # e2e/reports.spec.ts
bun run test:charts      # e2e/charts.spec.ts
bun run test:granular-permissions  # e2e/granular-permissions.spec.ts

# Background services (Trigger.dev)
bun run jobs:worker      # Initialize trigger.dev tasks (background job processing)

# Docker
./rebuild.sh             # Rebuild Docker containers
./rebuildDocker.sh       # Full Docker rebuild script
./start.sh               # Start services
./stop.sh                # Stop services
```

## Project Structure

```
enterprise-reporting-system/
├── src/
│   ├── routes/                       # TanStack Router file-based routes
│   │   ├── __root.tsx                # Root layout (layout + error boundary)
│   │   ├── index.tsx                 # Home/login redirect
│   │   ├── login.tsx                 # Login page
│   │   ├── _authed.tsx               # Auth guard layout (requires session)
│   │   ├── _authed/                  # Authenticated routes
│   │   │   ├── dashboard.tsx         # Dashboard home
│   │   │   ├── sql-editor.tsx        # SQL editor page
│   │   │   ├── bull-board.tsx        # Job queue monitoring UI
│   │   │   ├── reports/
│   │   │   │   ├── index.tsx         # Reports list
│   │   │   │   └── $id/
│   │   │   │       └── editor.tsx    # Report editor
│   │   │   ├── charts/               # Chart management (future)
│   │   │   ├── dashboards/           # Dashboard management (future)
│   │   │   └── data-sources/         # Data source config (future)
│   │   ├── api/                      # API routes (REST endpoints)
│   │   │   ├── reports.ts            # Reports CRUD
│   │   │   ├── charts.ts             # Charts CRUD
│   │   │   ├── dashboards.ts         # Dashboards CRUD
│   │   │   ├── sql/
│   │   │   │   ├── execute.ts        # SQL execution
│   │   │   │   ├── validate.ts       # SQL validation
│   │   │   │   └── schema.$id.ts     # Schema introspection
│   │   │   ├── filters.ts            # Filter management
│   │   │   ├── queries.ts            # Saved queries
│   │   │   └── jobs.ts               # Job management
│   │   └── share/                    # Public share routes (no auth)
│   │       ├── chart/$id.tsx         # Public chart viewer
│   │       ├── dashboard/$id.tsx     # Public dashboard viewer
│   │       └── report/$id.tsx        # Public report viewer
│   │
│   ├── server-fns/                   # Server functions (RPC/createServerFn)
│   │   ├── auth.ts                   # Auth operations (login, logout, refresh)
│   │   ├── reports.ts                # Reports RPC (type-safe)
│   │   ├── sql.ts                    # SQL operations (execute, validate, schema)
│   │   ├── charts.ts                 # Charts RPC (future)
│   │   └── queries.ts                # Saved queries RPC (future)
│   │   │   ├── queries/              # Saved queries
│   │   │   ├── settings/             # App settings (email config)
│   │   │   ├── email-templates/      # Email template management
│   │   │   └── bull-board/           # BullMQ dashboard
│   │   ├── admin/                    # Admin panel
│   │   │   ├── users/                # User management
│   │   │   ├── roles/                # Role management
│   │   │   └── permissions/          # Permission management
│   │   └── api/                      # API routes (see API section below)
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives (button, dialog, select, etc.)
│   │   ├── charts/                   # Chart-specific components
│   │   ├── dashboard/                # Dashboard builder components
│   │   ├── reporting/                # Report components (DataTable, etc.)
│   │   ├── sql-editor/               # SQL editor components
│   │   ├── metadata/                 # Metadata entity components
│   │   ├── nl-query/                 # NL query components
│   │   ├── layout/                   # Layout components (sidebar, navigation)
│   │   ├── email/                    # Email template components
│   │   ├── jobs/                     # Job monitoring components
│   │   └── errors/                   # Error boundary components
│   ├── lib/
│   │   ├── db/                       # Database layer
│   │   │   ├── config.ts             # Kysely connection (getDb(), getConfigDB())

│   │   │   ├── connection-manager.ts # Connection management
│   │   │   ├── kysely-db.ts          # PGLite + Kysely configuration
│   │   │   ├── migrations/           # PGLite migrations (timestamped .ts files)
│   │   │   ├── seeds/                # Seed data (001_initial_data.ts)
│   │   │   └── sample-data/          # Sample schema and seed scripts
│   │   ├── auth/                     # Authentication (JWT session, RBAC)
│   │   │   ├── session.ts            # JWT session management
│   │   │   └── rbac.ts               # Role-based access control
│   │   ├── permissions/              # Permission system
│   │   │   ├── permissions.ts        # Permission definitions and checks
│   │   │   └── ds-rbac.ts            # Data source RBAC
│   │   ├── security/                 # Security utilities
│   │   │   ├── encryption.ts         # AES-256-GCM encryption for credentials
│   │   │   └── audit.ts              # Audit logging
│   │   ├── sql/                      # SQL utilities
│   │   │   ├── validator.ts          # SQL query validation
│   │   │   ├── schema-introspection.ts # Database schema discovery
│   │   │   └── __tests__/            # SQL validator tests
│   │   ├── reports/                  # Report engine
│   │   │   └── filter-to-sql.ts      # Filter-to-SQL conversion
│   │   ├── jobs/                     # Job processing
│   │   │   ├── queue.ts              # BullMQ queue config
│   │   │   ├── worker-runner.ts      # Worker process entry point
│   │   │   └── workers/              # Job workers (export, report, email-batch)
│   │   ├── queue/                    # Queue management
│   │   │   ├── config.ts             # Queue configuration
│   │   │   ├── queue-manager.ts      # Queue manager
│   │   │   ├── bull-board.ts         # Bull Board UI integration
│   │   │   ├── index.ts              # Queue exports
│   │   │   └── types.ts              # Queue type definitions
│   │   ├── email/                    # Email service
│   │   │   └── email-service.ts      # Nodemailer SMTP integration
│   │   ├── metadata/                 # Metadata services
│   │   │   ├── entity-service.ts     # Entity CRUD
│   │   │   ├── field-service.ts      # Field management
│   │   │   ├── data-service.ts       # Data operations
│   │   │   ├── permissions.ts        # Entity permissions
│   │   │   └── sync-service.ts       # Sync operations
│   │   ├── config/                   # App configuration
│   │   │   └── pagination.ts         # Server-side pagination config
│   │   ├── api/                      # API client utilities
│   │   │   └── nl-query-client.ts    # NL query API client
│   │   ├── mastra/                   # Mastra AI agent integration
│   │   ├── hooks/                    # Server-side hooks
│   │   ├── errors/                   # Error handling utilities
│   │   ├── utils.ts                  # General utilities (cn(), etc.)
│   │   └── notifications.ts          # Notification system
│   ├── hooks/                        # React hooks
│   │   └── metadata/                 # Metadata-related hooks
│   ├── types/
│   │   ├── api.ts                    # API type definitions
│   │   └── database.ts               # Database type definitions
│   └── styles/
│       └── globals.css               # Global styles + Tailwind + CSS variables
├── e2e/                              # Playwright E2E tests
│   ├── *.spec.ts                     # Test files
│   ├── test-auth.ts                  # Auth helper for tests
│   ├── helpers/                      # Test helper utilities
│   │   ├── test-helpers.ts           # Main test helpers
│   │   └── test-helpers-improved.ts  # Enhanced helpers
│   └── fixtures/                     # Test fixtures
│       └── auth.fixture.ts           # Auth fixture
├── tests/                            # Additional tests
│   ├── setup-data.ts                 # Test data setup script
│   └── api/                          # API test utilities
├── scripts/                          # Utility scripts
│   ├── init-db.ts                    # Database initialization
│   ├── run-migrations.ts             # Migration runner
│   ├── create-admin.ts               # Admin user creation
│   ├── seed-sakila-analytics.ts      # Sakila demo data seeder
│   └── deploy-*.sh                   # Deployment scripts
├── data/                             # PGLite database directory (persistent)
├── docs/                             # Project documentation
├── nginx/                            # Nginx config (reverse proxy)
├── .claude/                          # Claude Code configuration
│   ├── settings.json                 # Plugin settings
│   └── skills/                       # Claude skills documentation
├── playwright.config.ts              # Playwright configuration
├── vite.config.ts                    # Vite + TanStack Start configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
├── docker-compose.yml                # Docker Compose (Nginx + Redis + App)
├── Dockerfile                        # Multi-stage Bun Alpine build
└── components.json                   # shadcn/ui configuration
```

## TanStack Start Architecture

### Server Functions (RPC) - Best Practice

Use **server functions** with `createServerFn` for type-safe client-server communication instead of REST APIs where possible:

```typescript
// src/server-fns/reports.ts
import { createServerFn } from '@tanstack/react-start'
import { requireAuth } from '@/lib/auth/middleware'

export const listReports = createServerFn({
  method: 'GET',
}).handler(async (input: { page?: number; pageSize?: number }) => {
  const session = await requireAuth()
  // Automatically type-safe serialization, no manual JSON
  // Called from client as: await listReports({ page: 0, pageSize: 20 })
})
```

**Benefits over REST:**
- Automatic type inference (input/output types)
- No manual JSON serialization/deserialization
- Full TypeScript support across client-server boundary
- Code splitting by the TanStack Start plugin
- Cleaner error handling with thrown errors serializing to client

### API Routes (REST) - Legacy Compatibility

Keep REST routes under `src/routes/api/` for:
- External API access (webhooks, third-party integrations)
- Non-browser clients (mobile apps, CLI tools)
- Gradual migration from REST to RPC

Both patterns coexist during migration.

### Server Functions vs REST Routes

| Aspect | Server Functions (RPC) | REST Routes |
|--------|------------------------|------------|
| Type safety | ✅ Full end-to-end | ⚠️ Manual typing needed |
| Serialization | ✅ Automatic | ⚠️ Manual JSON.stringify |
| Code splitting | ✅ Plugin handles | ⚠️ Not optimized |
| DX | ✅ Excellent | ⚠️ More boilerplate |
| External access | ❌ Client only | ✅ Any HTTP client |
| Data mutation | ✅ POST/PUT/DELETE | ✅ POST/PUT/DELETE |

### Authentication

- **JWT-based**: Custom session management with jose library
- **Session token**: Stored in HTTP-only cookie `session_token`
- **Server functions**: Use `requireAuth()` from `src/lib/auth/middleware.ts`
- **RBAC**: Defined in `src/lib/auth/rbac.ts`
- **Permissions**: Stored with user roles, checked in server functions

```typescript
// Enforce auth in any server function
const session = await requireAuth() // Throws if not authenticated
const { user } = session // Type-safe access to user data
```

### Routing with TanStack Router

File-based routing follows the `src/routes/` directory structure:

```
src/routes/
├── __root.tsx           # Root route (layout, providers)
├── index.tsx            # "/" route
├── login.tsx            # "/login" route
├── _authed.tsx          # Auth guard layout (requires session)
├── _authed/
│   ├── dashboard.tsx    # "/dashboard" (authenticated)
│   └── reports/
│       └── $id/
│           └── editor.tsx  # "/reports/$id/editor" (authenticated)
└── api/
    ├── reports.ts       # "/api/reports" (REST endpoint)
    └── sql/
        └── execute.ts   # "/api/sql/execute" (REST endpoint)
```

### Path Aliases

Use `@/*` to import from `src/*`:
```typescript
import { getDb } from '@/lib/db/config'
import { Button } from '@/components/ui/button'
import { requireAuth } from '@/lib/auth/middleware'
```

### Database Access

- **Kysely**: All database queries use Kysely (type-safe SQL query builder)
- **Instance**: Get via `getDb()` from `@/lib/db/config`
- **Database**: PGLite (in-process PostgreSQL) with persistent file-based storage at `./data/`
- **Persistence**: Instant commits - all data written to disk immediately (ACID guaranteed)
- **Durability**: Data survives application restarts, crashes, and system reboots
- **Migrations**: `src/lib/db/migrations/YYYYMMDDHHMMSS_description.ts`
- **Querying**: Always use LIMIT/OFFSET for server-side pagination
- **Configuration**: Unified persistent storage using PGLite for both main and config data

### Component Patterns

- **UI primitives**: shadcn/ui in `src/components/ui/` - add via `npx shadcn@latest add`
- **Feature components**: Organized by domain (charts, dashboard, reporting)
- **Forms**: Use TanStack Form v1 (not react-hook-form)
- **Styling**: Tailwind utilities + `cn()` from `@/lib/utils`
- **Data tables**: TanStack Table with server-side pagination (critical)

### Server-Side Pagination (Critical Rule)

**All data queries MUST use server-side pagination.** Never fetch all data and paginate client-side. Key config values:
- `DEFAULT_PAGE_SIZE=50`
- `MAX_PAGE_SIZE=1000`
- `DATA_TABLE_PAGE_SIZE=100`
- Pagination config in `src/lib/config/pagination.ts`

### Error Handling

- `ErrorBoundary` component wraps the app (`src/components/errors/error-boundary`)
- API routes should return proper HTTP status codes with JSON error bodies
- Encryption errors should include debug context

### Security Conventions

- Credentials encrypted with AES-256-GCM (`src/lib/security/encryption.ts`)
- SQL queries validated before execution (`src/lib/sql/validator.ts`)
- Audit logging for sensitive operations (`src/lib/security/audit.ts`)
- Data source RBAC for entity-level access control (`src/lib/permissions/ds-rbac.ts`)

### TypeScript

- Strict mode enabled
- `@typescript-eslint/no-unused-vars`: error (prefix unused args with `_`)
- `@typescript-eslint/no-explicit-any`: warn
- Types defined in `src/types/api.ts` and `src/types/database.ts`
- Path alias `@/*` maps to `./src/*`

### Linting

Biome linter (replaces ESLint + Prettier). Run with:
```bash
bun run lint       # Check
bun run lint:fix   # Auto-fix
```

### Formatting

Biome formatter for `src/**/*.{ts,tsx,js,jsx,json,css,md}`:
```bash
bun run format        # Write
bun run format:check  # Check only
```

## Testing

### E2E Tests (Playwright)

- Test directory: `e2e/`
- Config: `playwright.config.ts`
- Browser: Chromium only
- Workers: 1 (serial execution to prevent session interference)
- Tests run against a live server (default base URL: `http://localhost:4050`, override with `BASE_URL` env var for deployed testing)
- Auth helper: `e2e/test-auth.ts` - caches auth cookies
- Test helpers: `e2e/helpers/test-helpers.ts`
- Fixtures: `e2e/fixtures/auth.fixture.ts`
- Screenshot on failure, trace on first retry

### Running Tests

```bash
# Setup test data first
bun run test:setup

# Then run tests
bun run test:e2e

# Or combined
bun run test:e2e:all
```

### Test Batches

Tests can be run in batches using `@batch1` through `@batch6` grep tags:
```bash
bun run test:phase1   # Tests tagged @batch1
bun run test:batches  # All batches sequentially
```

## Database Migrations

Database management with Kysely:

```bash
# Create a new migration
bun run db:migrate:make -- my_migration_name

# Run pending migrations
bun run db:migrate

# Rollback last batch
bun run db:rollback
```

Migrations live in `src/lib/db/migrations/` and follow the pattern:
`YYYYMMDDHHMMSS_description.ts`

## Background Jobs with Trigger.dev

This application uses **Trigger.dev** for reliable background job processing, replacing the previous BullMQ + Redis setup. Trigger.dev provides cloud-native job orchestration while supporting local development via Mastra.ai server API endpoints.

### Job Types

The system processes the following background jobs:

- **report:generate** - Generate reports (CSV, XLSX, PDF formats)
- **data:export** - Export query results to files
- **email:batch** - Send batch emails with attachments
- **scheduled:refresh** - Scheduled data refresh for reports/charts/dashboards
- **chart:render** - Render chart images (PNG, SVG)

### Task Definitions

Tasks are defined in `src/lib/jobs/trigger-tasks.ts`:
- `reportGenerationTask` - Report generation with error handling
- `dataExportTask` - Data export with format handling
- `emailBatchTask` - Email delivery with template support
- `scheduledRefreshTask` - Scheduled content refresh

### Local Development Setup

1. **Configure Local Mastra.ai API:**
   ```bash
   # Set environment variables
   export TRIGGER_API_URL=http://localhost:3030  # Local Mastra.ai server
   export TRIGGER_API_KEY=your-api-key           # Mastra.ai API key
   ```

2. **Start Mastra.ai Local Server** (if using self-hosted):
   ```bash
   mastra dev
   ```

3. **Jobs are automatically processed** when triggered via:
   - `addJob()` - Submit immediate job
   - `addScheduledJob()` - Schedule recurring job (cron)

### Configuration

- **Config file:** `trigger.config.ts`
- **Default concurrency:** 5 workers (set via `WORKER_CONCURRENCY` env var)
- **Retries:** 3 attempts with exponential backoff
- **Job retention:** 24 hours for completed, 7 days for failed

### Monitoring & Debugging

- **Trigger.dev Dashboard:** https://dashboard.trigger.dev (for cloud deployments)
- **Local Logs:** Printed to console during development
- **Job Status:** Check via API or dashboard

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `TRIGGER_API_KEY` | API key for Trigger.dev or Mastra.ai |
| `TRIGGER_API_URL` | Base URL for Trigger.dev or local Mastra.ai (`http://localhost:3030`) |
| `WORKER_CONCURRENCY` | Number of concurrent job workers (default: 5) |

### Important Notes

- ✅ NO Redis required - Trigger.dev handles persistent job storage
- ✅ Local development uses Mastra.ai server API endpoints
- ✅ Tasks defined in TypeScript with full type safety
- ✅ Automatic retries and error handling built-in
- ⚠️ Job definitions must be exported from `trigger-tasks.ts`

## Docker & Deployment

### Docker Build

Multi-stage build using `oven/bun:1.3-alpine`:
1. **Builder stage**: Install deps, compile migrations/seeds, init DB, build with Vite
2. **Runner stage**: Copy `.output/` + dependencies + migrations + DB

### Services (docker-compose.yml)

- **nginx**: Reverse proxy with SSL (Let's Encrypt via certbot)
- **app**: Main application (port 3000 internal)
- **Note:** Redis is no longer required (Trigger.dev handles job processing)

### Key Environment Variables

| Variable | Purpose |
|----------|---------|
| `DATA_DIR` | PGLite database directory path (default: `./data`) |
| `CONFIG_DB_PATH` | Configuration database path (default: `./config.db`) |
| `AUTH_SECRET` | JWT session secret (min 32 chars) |
| `ENCRYPTION_KEY` | AES-256 key for credential encryption |
| `OPENAI_API_KEY` | OpenAI API key for NL query feature |
| `TRIGGER_API_KEY` | Trigger.dev or Mastra.ai API key |
| `TRIGGER_API_URL` | Trigger.dev base URL or local Mastra.ai (`http://localhost:3030`) |
| `WORKER_CONCURRENCY` | Job worker concurrency (default: 5) |
| `DEFAULT_PAGE_SIZE` | Default pagination size (50) |
| `MAX_PAGE_SIZE` | Max allowed page size (1000) |

## Common Development Patterns

### Adding a New Page

1. Create file under `src/routes/_authed/your-feature/index.tsx`
2. Export a `Route` using `createFileRoute("/_authed/your-feature/")({})`
3. Place interactive components in `src/components/your-feature/`

### Adding a New API Route

1. Create `src/routes/api/your-route.ts`
2. Export a `Route` using `createAPIFileRoute("/api/your-route")({...})`
3. Define `GET`, `POST`, `PUT`, `DELETE` handlers as needed
4. Use `getDb()` for database access
5. Check permissions via RBAC utilities

### Adding a UI Component

For shadcn/ui primitives:
```bash
npx shadcn@latest add component-name
```

For custom components, place in the appropriate `src/components/` subdirectory.

### Adding a Database Migration

```bash
bun run db:migrate:make -- descriptive_name
# Edit the new file in src/lib/db/migrations/
bun run db:migrate
```

## Pre-commit Checklist

Before committing, run:
```bash
bun run precommit   # lint + typecheck + format:check
```

Or the full build check:
```bash
bun run build:check  # lint + typecheck + build
```

## Natural Language Query (NL Query) - Mastra.ai + Ollama Setup

The NL Query feature enables users to ask questions in plain English and receive SQL queries that can be executed against the database. It uses **Mastra.ai** for orchestration and **local Ollama** with the **sqlcoder:7b** model for SQL generation.

### Quick Start

**1. Install and Run Ollama**

```bash
# Download Ollama from https://ollama.ai
# Or if already installed, start the service
ollama serve

# In another terminal, pull the sqlcoder:7b model
ollama pull sqlcoder:7b

# Verify it's loaded
ollama list
# Should show: sqlcoder:7b   latest
```

**2. Configure Environment Variables**

Create or update your `.env.local` file:
```bash
# NL Query - Ollama Configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=sqlcoder:7b

# Optional: Mastra.ai Server (for orchestration)
MASTRA_URL=http://localhost:4111
```

**3. Start the Application**

```bash
bun run dev
```

**4. Test the NL Query Feature**

1. Navigate to: http://localhost:4050/_authed/nl-query
2. Ensure you're logged in (admin@admin.com / admin)
3. Enter a natural language question: "Show me total patients by gender"
4. Click "Generate SQL"
5. Review the generated SQL
6. Click "Execute Query" to run it

### Architecture

The NL Query system works as follows:

```
User Question
    ↓
NL Query Page (/src/routes/_authed/nl-query/index.tsx)
    ↓
CopilotKit API (/src/routes/api/copilotkit.ts)
    ↓
Mastra.ai Translator (/src/lib/nlquery/mastra-ollama-translator.ts)
    ↓
Database Schema (/api/nl-query/schema) ← Uses information_schema
    ↓
Ollama sqlcoder:7b Model (http://localhost:11434)
    ↓
SQL Query Generation
    ↓
SQL Validation & Execution
    ↓
Results displayed to user
```

### Components

1. **NL Query Frontend Page** (`/_authed/nl-query`)
   - User input for natural language questions
   - Data source detection
   - SQL display and explanation
   - Query execution interface

2. **Schema Endpoint** (`/api/nl-query/schema`)
   - Queries PostgreSQL information_schema
   - Returns table and column metadata
   - Provides complete database structure to Ollama

3. **CopilotKit Endpoint** (`/api/copilotkit`)
   - Handles NL→SQL translation requests
   - Routes to Mastra.ai Ollama translator
   - Returns: SQL, explanation, warnings

4. **Mastra.ai Translator** (`/lib/nlquery/mastra-ollama-translator.ts`)
   - Connects to local Ollama on port 11434
   - Uses sqlcoder:7b model for SQL generation
   - Validates generated SQL
   - Refines SQL if validation fails

### Example Questions

Try these questions to test the system:

1. **Simple aggregation**: "Count patients by gender"
2. **Multi-table join**: "Show admissions with patient names"
3. **Date filtering**: "Patients admitted in the last 30 days"
4. **Complex statistics**: "Average length of stay by department"

### Troubleshooting

**"Ollama not available" error:**
- Ensure Ollama is running: `ollama serve`
- Check Ollama URL: http://localhost:11434/api/tags should return 200 OK
- Verify model is loaded: `ollama list` should show sqlcoder:7b

**"No HMS data source found" error:**
- Go to Data Sources page
- Create a data source named "HMS" connecting to hospital_management_system PostgreSQL database
- Ensure the user has access to the data source

**"Schema endpoint returns no tables" error:**
- Verify PostgreSQL is running and accessible
- Check that hospital_management_system database exists
- Confirm tables exist in public schema: `\dt` in psql

**Ollama slow/timeout:**
- First query is slower (model loading)
- Subsequent queries are faster (model cached in memory)
- Increase timeout if needed in mastra-ollama-translator.ts

### Configuration

| Setting | Default | Purpose |
|---------|---------|---------|
| OLLAMA_URL | http://localhost:11434 | Ollama service endpoint |
| OLLAMA_MODEL | sqlcoder:7b | Model for SQL generation |
| MASTRA_URL | http://localhost:4111 | Optional: Mastra.ai orchestration |
| Schema timeout | 30s | Timeout for schema retrieval |
| SQL generation timeout | 30s | Timeout for Ollama SQL generation |

### Performance Notes

- **First query**: ~5-10 seconds (model loading into memory)
- **Subsequent queries**: 1-3 seconds (model cached)
- **Large schemas**: May take longer with 30+ tables
- **Model**: sqlcoder:7b requires ~4GB RAM (7B parameters)

### Important

⚠️ **Required for local development:**
- Ollama must be running (`ollama serve`)
- sqlcoder:7b model must be loaded (`ollama pull sqlcoder:7b`)
- PostgreSQL hospital_management_system database must exist
- User must be authenticated and have data source access

## Gstack Integration

For web browsing and site testing, use the **`/browse` skill** from gstack. Never use `mcp__claude-in-chrome__*` tools.

### Installing Gstack

Gstack is included as a git submodule. To set it up:

```bash
# First time setup - initialize and update submodules
git submodule update --init --recursive

# Then run the setup script
bash .claude/setup-gstack.sh
```

This clones and builds gstack in `~/.claude/skills/gstack`. It's a one-time setup per machine.

**For new team members:** Simply run the above commands after cloning the repository.

### Available Gstack Skills

- `/office-hours` - Schedule and manage office hour sessions
- `/plan-ceo-review` - Plan CEO review structure
- `/plan-eng-review` - Plan engineering review
- `/plan-design-review` - Plan design review
- `/design-consultation` - Get design feedback
- `/design-shotgun` - Rapid design iteration
- `/design-html` - Generate and test HTML designs
- `/review` - Code review
- `/ship` - Prepare for shipping
- `/land-and-deploy` - Deploy to production
- `/canary` - Canary deployment testing
- `/benchmark` - Performance benchmarking
- `/browse` - **Primary skill for web browsing and site testing** - navigate pages, interact with elements, verify state, take screenshots
- `/connect-chrome` - Connect to Chrome browser
- `/qa` - Full QA testing workflow
- `/qa-only` - QA testing only
- `/design-review` - Design review process
- `/setup-browser-cookies` - Setup browser authentication
- `/setup-deploy` - Setup deployment pipeline
- `/setup-gbrain` - Setup G-Brain integration
- `/retro` - Retrospective planning
- `/investigate` - Investigation workflow
- `/document-release` - Document release notes
- `/codex` - Code documentation
- `/cso` - Chief Security Officer review
- `/autoplan` - Automatic planning
- `/plan-devex-review` - Plan developer experience review
- `/devex-review` - Developer experience review
- `/careful` - Careful review mode
- `/freeze` - Freeze changes
- `/guard` - Guard against changes
- `/unfreeze` - Unfreeze changes
- `/gstack-upgrade` - Upgrade gstack
- `/learn` - Learning resources

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
