# Dockerfile for the BLACKJAW marketing (Astro static) site
# Build from the monorepo root:
#   docker build --tag web:latest -f ./apps/web/Dockerfile .
#
# Dokploy: Build Type = Dockerfile, Dockerfile path = apps/web/Dockerfile,
# Build Context = . (repo root), Container Port = 3000.

FROM oven/bun:1 AS build

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile
RUN bun --filter @repo/web build

# ---------- Runtime ----------
FROM oven/bun:1-slim AS runtime

WORKDIR /app

COPY --from=build /app/apps/web/dist ./dist

ENV PORT=3000
EXPOSE 3000

# Serve the static dist folder with a zero-config static server
CMD ["bunx", "--bun", "serve", "-s", "dist", "-l", "3000"]
