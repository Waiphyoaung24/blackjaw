# Dockerfile for the BLACKJAW marketing (Astro static) site
# Build from the monorepo root so workspace packages resolve:
#   docker build --tag web:latest -f ./apps/web/Dockerfile .
#
# Dokploy: set Build Type = Dockerfile, Dockerfile path = apps/web/Dockerfile,
# Build Context = . (repo root), and expose port 80.

# ---------- Builder stage ----------
FROM oven/bun:1 AS build

WORKDIR /app

# Copy lockfile + root manifest first for better layer caching
COPY package.json bun.lock ./
COPY tsconfig.json ./

# Copy workspace manifests needed to resolve workspace:* deps
COPY apps/web/package.json ./apps/web/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json

# Install all workspace deps (needs dev deps for astro/vite build)
RUN bun install --frozen-lockfile

# Copy the rest of the sources required to build the web app
COPY packages ./packages
COPY apps/web ./apps/web

# Build the static site (output: apps/web/dist)
RUN bun --filter @repo/web build

# ---------- Runtime stage ----------
FROM nginx:alpine AS runtime

COPY apps/web/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
