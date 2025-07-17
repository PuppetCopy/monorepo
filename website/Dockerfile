FROM oven/bun:alpine AS build

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

WORKDIR /app

# Create simplified package.json for website-only build  
RUN echo '{"name":"website-build","private":true,"workspaces":["website","middleware","indexer"]}' > package.json

# Copy only package files first for better caching
COPY bun.lock ./
COPY middleware/package.json middleware/
COPY website/package.json website/
COPY indexer/package.json indexer/

# Install dependencies (cached if package files don't change)
RUN bun install

# Copy all source code
COPY tsconfig.base.json tsconfig.json ./
COPY middleware/ middleware/
COPY website/ website/
COPY indexer/ indexer/

# Build middleware first (website depends on it)
WORKDIR /app/middleware
RUN bun run build

# Build website
WORKDIR /app/website
RUN bun run build

FROM caddy:alpine

WORKDIR /app

COPY website/Caddyfile ./
RUN caddy fmt Caddyfile --overwrite

COPY --from=build /app/website/dist ./dist

CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]