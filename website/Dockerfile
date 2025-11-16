# Build stage
FROM oven/bun:1.3.1-alpine AS builder

WORKDIR /build

# Copy package files for better layer caching
COPY package.json bun.lock tsconfig.base.json ./
COPY middleware/package.json middleware/
COPY indexer/package.json indexer/
COPY website/package.json website/
# Satisfy workspace requirements
RUN mkdir sequencer && echo '{"name":"@puppet-copy/sequencer","version":"1.0.0","private":true}' > sequencer/package.json

# Install dependencies (ignore optional scripts)
RUN bun install --ignore-scripts

# Copy source code
COPY middleware middleware/
COPY indexer indexer/
COPY website website/
COPY contracts contracts/

# Build dependencies
RUN cd middleware && bun run build && \
    cd ../indexer && bun run build

# Build website
WORKDIR /build/website

# Website environment variables - safe to commit
# These values are embedded into the client-side bundle and are publicly visible
ENV VITE__WC_PROJECT_ID=50f28392d528ed7a266e5bd92c22598a \
    VITE__WC_RPC_URL_42161_1=wss://lb.drpc.org/arbitrum/AsErNuerhkLUk8s5X8ojBS8_1aO7cxUR8IbmIgaNGuYu \
    VITE__WC_RPC_URL_42161_2=wss://arbitrum-one-rpc.publicnode.com \
    VITE__INDEXR_ENDPOINT=/api/sql

RUN bun run build

# Production stage
FROM caddy:2.8-alpine

COPY --from=builder --chown=caddy:caddy /build/website/dist /srv/website/dist
COPY --from=builder --chown=caddy:caddy /build/website/Caddyfile /etc/caddy/Caddyfile

ENV PORT=80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1