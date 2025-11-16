# Build stage
FROM oven/bun:1.3.1-alpine AS builder

WORKDIR /build

# Copy workspace root files (context is repository root)
COPY package.json bun.lock ./
COPY tsconfig.base.json ./
COPY middleware/package.json middleware/
COPY indexer/package.json indexer/
COPY website/package.json website/

# Install all dependencies with production optimizations
RUN bun install --frozen-lockfile --production=false

# Copy source code (including contracts for middleware build)
COPY middleware middleware/
COPY indexer indexer/
COPY website website/
COPY contracts contracts/

# Build middleware first (dependency)
WORKDIR /build/middleware
RUN bun run build

# Build indexer (website dependency - @puppet-copy/sql)
WORKDIR /build/indexer
RUN bun run build

# Build website with production optimizations
WORKDIR /build/website

# Website environment variables - safe to commit
# These values are embedded into the client-side bundle and are publicly visible
ENV VITE__WC_PROJECT_ID=50f28392d528ed7a266e5bd92c22598a \
    VITE__WC_RPC_URL_42161_1=wss://lb.drpc.org/arbitrum/AsErNuerhkLUk8s5X8ojBS8_1aO7cxUR8IbmIgaNGuYu \
    VITE__WC_RPC_URL_42161_2=wss://arbitrum-one-rpc.publicnode.com \
    VITE__INDEXR_ENDPOINT=https://api.puppet.tech/sql

RUN bun run build

# Production stage - use Caddy for serving
FROM caddy:2-alpine

# Caddy already runs as non-root user (uid 1001)
# Copy built website with correct ownership
COPY --from=builder --chown=caddy:caddy /build/website/dist /srv/website/dist

# Copy Caddyfile (Caddy needs read access)
COPY --from=builder --chown=caddy:caddy /build/website/Caddyfile /etc/caddy/Caddyfile

# Set PORT environment variable default
ENV PORT=80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1

# Caddy automatically serves using the Caddyfile
# No CMD needed as base image handles it