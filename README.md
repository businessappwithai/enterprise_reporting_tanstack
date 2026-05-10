# Enterprise Reporting and Dashboard System

A production-ready enterprise reporting system built with **TanStack Start**, **Bun runtime**, **SQLite**, **BullMQ**, and **shadcn/ui**. Provides real-time data visualization, SQL querying, role-based access control, job scheduling, and multi-format export capabilities.

## 🚀 Key Features

### Core Reporting Engine
- **TanStack Table** - Headless data grid with server-side pagination, sorting, and filtering
- **Knex.js** - SQL query builder for dynamic, secure data access
- **Application-Level RLS** - Row-level security at application layer
- **Advanced Filtering** - Dynamic query builder with multiple operators
- **SQL Validation** - Query validation to prevent injection and ensure correctness

### Data Visualization
- **Recharts Integration** - Professional charts (Bar, Line, Pie, Area)
- **Interactive Dashboards** - Drag-and-drop dashboard builder with React Grid Layout
- **Customizable Widgets** - Multiple visualization types per dashboard
- **Responsive Design** - Mobile-optimized interfaces

### Export & Delivery
- **CSV Export** - Fast, formatted CSV generation
- **Excel Export** - Professional spreadsheets with formatting
- **PDF Export** - Publication-ready PDF documents
- **Email Delivery** - SMTP-based report distribution
- **Job Queue** - BullMQ-powered asynchronous processing with Redis backend
- **Scheduled Reports** - Cron-based automated generation and delivery

### Enterprise Features
- **Role-Based Access Control (RBAC)** - Fine-grained permissions at resource level
- **Audit Logging** - Complete audit trail for exports and email delivery
- **User Management** - Admin panel for users, roles, and permissions
- **Metadata Management** - Dynamic entity and field management
- **Natural Language Queries** - AI-powered SQL generation with OpenAI + CopilotKit
- **Session Management** - Secure JWT-based authentication with HTTP-only cookies

## 📋 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Bun >= 1.3.0 |
| **Framework** | TanStack Start 1.167+ (Vite-based, full-stack React) |
| **Language** | TypeScript (strict mode, ES2022 target) |
| **UI Library** | shadcn/ui (Radix UI + Tailwind CSS 3) |
| **State Management** | TanStack Query v5 + TanStack Table v8 + TanStack Form v1 |
| **Database** | SQLite (via better-sqlite3 + Knex.js) |
| **Authentication** | Custom JWT with jose + HTTP-only cookies |
| **Charts** | Recharts, ECharts |
| **Job Queue** | BullMQ + Redis (ioredis) |
| **AI/NL Query** | OpenAI (via @ai-sdk/openai) + CopilotKit |
| **Export Formats** | ExcelJS, PDFKit, PapaParse |
| **Email** | Nodemailer (SMTP) |
| **Testing** | Playwright (E2E only) |
| **Styling** | Tailwind CSS with CSS variables (HSL color system) |
| **Deployment** | Docker (Bun Alpine), Nginx reverse proxy |

## 🛠️ Installation

### Prerequisites
- **Bun** >= 1.3.0
- **Redis** (for BullMQ job queue)
- **SMTP Server** (for email delivery - optional but recommended)

### Setup Steps

1. **Clone and Install**
```bash
git clone <repository>
cd enterprise_reporting_tanstack
bun install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Setup Database**
```bash
# Run migrations (creates SQLite database)
bun run db:migrate

# Seed sample data
bun run db:sample
```

4. **Start Services**
```bash
# Terminal 1: Development server (port 4050)
bun run dev

# Terminal 2: BullMQ worker (in separate terminal)
bun run jobs:worker
```

5. **Access Application**
- Application: `http://localhost:4050`
- Default credentials: `admin@admin.com` / `admin`

## 📁 Project Structure

See [CLAUDE.md](CLAUDE.md) for detailed project structure and architecture.

Key directories:
- `src/routes/` - TanStack Router file-based routes (pages and API)
- `src/server-fns/` - Server functions (RPC endpoints)
- `src/components/` - React components (UI, features, layouts)
- `src/lib/` - Core libraries (database, auth, permissions, jobs, security)
- `src/lib/db/` - Database layer (Knex migrations, seeds, connection)
- `e2e/` - Playwright E2E test suite
- `docs/` - Detailed documentation

## 🔒 Security Features

### SQL Injection Prevention
- Column name whitelisting
- Parameterized queries via Knex.js
- Operator validation
- Query parsing and sanitization

### Authentication & Authorization
- Custom JWT-based authentication with jose library
- Bcrypt password hashing (10 rounds)
- Role-based access control (RBAC)
- Resource-level permissions
- Session management with HTTP-only cookies

### Data Protection
- AES-256-GCM encryption for data source credentials
- Audit logging for sensitive operations
- Application-level row-level security

## 📊 Database Schema

**Single Database Approach**: All configuration and business data in SQLite

### Core Tables
- `users` - User accounts and authentication
- `roles` - Role definitions with permission sets
- `user_roles` - User-role associations
- `resource_permissions` - Resource-level access control
- `data_sources` - External database connections
- `audit_log` - Audit trail for all sensitive operations

### Data Management Tables
- `report_definitions` - Report configurations
- `chart_definitions` - Chart configurations
- `dashboard_layouts` - Dashboard layouts and widgets
- `saved_queries` - SQL query templates
- `email_templates` - Email template definitions

### Job Management Tables
- `job_definitions` - Job queue definitions
- `job_executions` - Job execution history

## 🔄 Job Queue Architecture

**BullMQ + Redis** for reliable asynchronous job processing:

### Job Types
- `export` - Generate data exports (CSV, Excel, PDF)
- `report` - Generate scheduled reports
- `email-batch` - Send batch emails

### Features
- Automatic retry with exponential backoff
- Job status tracking and monitoring
- Persistent queue with Redis backend
- Bull Board UI for monitoring (`/bull-board`)

## 📧 Email Configuration

### SMTP Setup
Supports any SMTP provider (Gmail, SendGrid, AWS SES, etc.)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Email Features
- Professional HTML templates
- Branded headers and footers
- Responsive design
- Attachment support

## 🎨 Dashboard Builder

### Features
- Drag-and-drop widget placement
- Resize widgets
- Multiple widget types (Table, Chart, Metric)
- Layout persistence
- User-specific dashboards

## 🔧 Common Commands

### Development
```bash
bun run dev              # Start dev server on port 4050
bun run build            # Production build
bun run start            # Start production server
```

### Quality Checks
```bash
bun run lint             # ESLint
bun run lint:fix         # ESLint with auto-fix
bun run typecheck        # TypeScript type checking
bun run format           # Prettier formatting
bun run precommit        # lint + typecheck + format:check
```

### Database
```bash
bun run db:migrate       # Run pending migrations
bun run db:migrate:make  # Create new migration
bun run db:seed          # Run seeds
bun run db:rollback      # Rollback last migration
bun run db:sample        # Seed sample data
```

### Testing
```bash
bun run test:setup       # Setup test data
bun run test:e2e         # Run E2E tests
bun run test:e2e:ui      # Run with Playwright UI
bun run test:ci          # Full CI pipeline
```

### Background Services
```bash
bun run jobs:worker      # Start BullMQ worker
```

See [CLAUDE.md](CLAUDE.md) for complete command reference.

## 🚦 Performance Optimizations

- **Server-Side Pagination**: All data queries use LIMIT/OFFSET at database level
- **Query Optimization**: Indexed columns, efficient joins, parameterized queries
- **Caching**: TanStack Query automatic caching and stale-while-revalidate
- **Lazy Loading**: Components and data loaded on demand
- **Virtual Scrolling**: Optional virtual scrolling for large datasets

## 📈 Testing

**Playwright E2E Test Suite** with phased test execution:

```bash
# Run all tests
bun run test:e2e

# Run specific phase
bun run test:phase1      # Authentication
bun run test:phase2      # Dashboards
bun run test:phase3      # SQL Editor Basic
bun run test:phase4      # SQL Editor Advanced
bun run test:phase5      # Reports
bun run test:phase6      # Charts
```

Tests run against live dev server on `http://localhost:4050`.

See [docs/TESTING.md](docs/TESTING.md) and [e2e/SETUP.md](e2e/SETUP.md) for detailed test documentation.

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Developer guide for Claude Code instances
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Technical architecture and design decisions
- **[docs/TESTING.md](docs/TESTING.md)** - Testing guide and test organization
- **[e2e/SETUP.md](e2e/SETUP.md)** - E2E test setup and troubleshooting
- **[docs/DEPLOY.md](docs/DEPLOY.md)** - Deployment guide for production
- **[docs/FEATURES.md](docs/FEATURES.md)** - Feature descriptions and capabilities

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t enterprise-reporting .
```

### Docker Services (via docker-compose.yml)
- **Nginx** - Reverse proxy with SSL support
- **Redis** - Job queue backend
- **App** - TanStack Start application

### Environment Variables
Key variables for deployment:
- `AUTH_SECRET` - JWT secret for token signing (min 32 chars)
- `DATABASE_PATH` - SQLite database file path
- `REDIS_URL` - Redis connection URL
- `ENCRYPTION_KEY` - AES-256 encryption key for credentials
- `OPENAI_API_KEY` - OpenAI API key for NL queries
- `DEFAULT_PAGE_SIZE` - Server-side pagination size (default: 50)
- `MAX_PAGE_SIZE` - Max allowed page size (default: 1000)

See [docs/DEPLOY.md](docs/DEPLOY.md) for complete deployment guide.

## 🤝 Contributing

For local development:
1. Read [CLAUDE.md](CLAUDE.md) for project conventions
2. Run `bun run precommit` before committing
3. Ensure tests pass with `bun run test:e2e`
4. Follow existing code patterns and TypeScript strict mode

## 📄 License

Copyright © 2024-2025 Enterprise Reporting System
All rights reserved.

## 🆘 Support & Troubleshooting

### Common Issues

**Tests fail with authentication error**
```bash
bun run db:migrate
bun run db:sample
```

**Port 4050 already in use**
```bash
lsof -ti:4050 | xargs kill -9
```

**Database locked error**
- Ensure only one BullMQ worker is running
- Check that dev server isn't running twice

For detailed troubleshooting, see [e2e/SETUP.md](e2e/SETUP.md).

---

**Built with precision for enterprise-grade reporting needs.**
