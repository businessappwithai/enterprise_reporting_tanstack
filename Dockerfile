# ==========================================
# Enterprise Reporting System
# Production Dockerfile - Bun + TanStack Start + MariaDB
# ==========================================

# Build stage - Pure Bun
FROM oven/bun:1.3-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Copy package files and source
COPY package.json bun.lock ./
COPY . .

# Install dependencies with Bun (frozen lockfile)
RUN bun install --frozen-lockfile && bun pm cache rm

# Build application with TanStack Start
RUN bun run build

# Production stage - Runtime only
FROM oven/bun:1.3-alpine

WORKDIR /app

# Install runtime dependencies (curl for health checks, ca-certs for HTTPS)
RUN apk add --no-cache \
    curl \
    ca-certificates

# Create non-root user for security
RUN adduser --system --uid 1001 bunuser || true && \
    addgroup -g 1001 bunuser || true && \
    adduser bunuser bunuser 2>/dev/null || true

# Copy package files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock

# Copy built application (TanStack Start output structure)
COPY --from=builder --chown=bunuser:bunuser /app/dist ./dist
COPY --from=builder --chown=bunuser:bunuser /app/public ./public
COPY --from=builder --chown=bunuser:bunuser /app/node_modules ./node_modules

# Copy database migration scripts (needed for runtime initialization)
COPY --chown=bunuser:bunuser scripts ./scripts
COPY --chown=bunuser:bunuser src/lib/db ./src/lib/db

# Create required directories with correct permissions
RUN mkdir -p /app/data /app/logs && \
    chown -R bunuser:bunuser /app/data /app/logs

# Expose application port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production \
    PORT=3000 \
    MARIADB_HOST=mariadb \
    MARIADB_PORT=3306 \
    MARIADB_DATABASE=enterprise_config \
    MARIADB_USER=enterprise

# Switch to non-root user
USER bunuser

# Health check (wait for MariaDB initialization)
HEALTHCHECK --interval=10s --timeout=5s --start-period=45s --retries=10 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["bun", "run", "dist/server/server.js"]
