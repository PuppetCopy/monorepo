# Build Caddy with rate limiting module
FROM caddy:2.8-builder-alpine AS builder

RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    xcaddy build \
    --with github.com/mholt/caddy-ratelimit

# Production stage
FROM caddy:2.8-alpine

# Copy custom Caddy binary with rate limiting
COPY --from=builder /usr/bin/caddy /usr/bin/caddy

# Copy pre-built website files
COPY dist /srv/website/dist
COPY Caddyfile /etc/caddy/Caddyfile

# RHINESTONE_API_KEY is baked in during build
ARG RHINESTONE_API_KEY
ENV RHINESTONE_API_KEY=${RHINESTONE_API_KEY}

ENV PORT=80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1