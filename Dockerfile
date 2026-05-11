# ==========================================
# Enterprise Reporting System
# Production Dockerfile - Powered by Bun
# ==========================================

# Build stage - Pure Bun, no Node.js
FROM oven/bun:1.3-alpine AS builder

WORKDIR /app

# Install build dependencies for SQLite native module
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    sqlite-dev

# Copy package files and application files
COPY package.json bun.lock ./
COPY . .

# Install dependencies with Bun
RUN bun install --frozen-lockfile --no-verify && \
    bun pm cache rm

# Initialize database during build using Kysely + bun:sqlite
# This creates the database schema that will be copied to the runner
RUN bun run /app/scripts/rebuild-db.ts

# Build application
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PRIVATE_SKIP_FONT_OPTIMIZATION=1
RUN bun run build

# Production stage
FROM oven/bun:1.3-alpine AS runner

WORKDIR /app

# Install runtime dependencies (bun:sqlite is built-in, no need for better-sqlite3)
RUN apk add --no-cache \
    wget \
    openssl \
    sqlite \
    su-exec

# Create non-root user for security
RUN adduser --system --uid 1001 bunuser || true && \
    addgroup -g 1001 bunuser || true && \
    adduser bunuser bunuser || true

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock

# Copy built application
COPY --from=builder --chown=bunuser:bunuser /app/.next/standalone ./
COPY --from=builder --chown=bunuser:bunuser /app/.next/static ./.next/static

# Copy all dependencies from builder
COPY --from=builder --chown=bunuser:bunuser /app/node_modules ./node_modules

# Copy initialized database from builder (schema created during build)
COPY --from=builder --chown=bunuser:bunuser /app/data/config.sqlite /app/data/config.sqlite

# Copy entrypoint script
COPY --from=builder --chown=bunuser:bunuser /app/docker-entrypoint.sh /app/docker-entrypoint.sh

# Create required directories with correct permissions
RUN mkdir -p /app/data /app/job-outputs /app/uploads /app/logs /app/data/uploads && \
    chown -R bunuser:bunuser /app/data /app/job-outputs /app/uploads /app/logs && \
    chmod +x /app/docker-entrypoint.sh

# Copy Sakila demo database (if exists)
COPY data/uploads/sakila.db /app/data/uploads/sakila.db

# Expose application port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# Use entrypoint script to handle database initialization
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1
