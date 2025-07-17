FROM oven/bun:alpine AS build

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

WORKDIR /app

# Create simplified package.json for website-only build  
RUN echo '{"name":"website-build","private":true,"workspaces":["website","middleware","indexer"]}' > package.json

# Copy lockfile and package files
COPY bun.lock ./
COPY middleware/package.json middleware/
COPY website/package.json website/
COPY indexer/package.json indexer/

# Install dependencies
RUN bun install

# Copy source code
COPY middleware/ middleware/
COPY website/ website/
COPY indexer/ indexer/

# Build website
WORKDIR /app/website
RUN bun run build

FROM caddy:alpine

WORKDIR /app

COPY website/Caddyfile ./
RUN caddy fmt Caddyfile --overwrite

COPY --from=build /app/website/dist ./dist

CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]