FROM caddy:2.8-alpine

COPY dist /srv/website/dist
COPY Caddyfile /etc/caddy/Caddyfile

ARG RHINESTONE_API_KEY
ENV RHINESTONE_API_KEY=${RHINESTONE_API_KEY}

ENV PORT=80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:${PORT}/ || exit 1