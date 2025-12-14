FROM caddy:2.8-alpine

COPY website/dist /srv/website/dist
COPY website/Caddyfile /etc/caddy/Caddyfile

ENV PORT=80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:${PORT}/ || exit 1