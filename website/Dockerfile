# Production stage - Simple and focused
FROM caddy:2.8-alpine

# Copy pre-built website files
COPY dist /srv/website/dist
COPY Caddyfile /etc/caddy/Caddyfile

# RHINESTONE_API_KEY is baked in during build
ARG RHINESTONE_API_KEY
ENV RHINESTONE_API_KEY=${RHINESTONE_API_KEY}

ENV PORT=80

# Simple health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:${PORT}/ || exit 1