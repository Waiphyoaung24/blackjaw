@AGENTS.md

## Claude-Specific Guidance

- Use `/plan` for multi-file or architectural changes.
- Prefer slash commands from `.claude/commands/` when available.

## Deployment Checkpoint — `apps/web` on Dokploy + Cloudflare Tunnel

Working setup as of 2026-04-25.

### Build

- Dockerfile lives at repo root: `Dockerfile.web` (NOT inside `apps/web/`).
  Dokploy otherwise infers `apps/web/` as the build context and workspace
  packages (`@repo/ui`, `@repo/typescript-config`) fail to resolve.
- Multi-stage: `oven/bun:1` builds, `oven/bun:1-slim` serves `dist/`
  via `bunx --bun serve -s dist -l 3088`.
- Root `.dockerignore` excludes `**/node_modules`, `**/dist`, `**/.astro`,
  `**/.wrangler`, `.git`, `docs`, etc.

### Dokploy app settings

- Provider: GitHub `Waiphyoaung24/blackjaw`, branch `main`
- Build Type: **Dockerfile**
- Dockerfile Path: `Dockerfile.web`
- Docker Context Path: `.` (repo root)
- Ports: Published `3088` → Target `3088`, mode HOST, TCP
- Autodeploy: on (webhook on push to `main`)

### Cloudflare Tunnel (port forwarding, no open VPS ports)

Traffic path: browser → Cloudflare edge → `cloudflared` on VPS (outbound
tunnel) → `localhost:3088` → Dokploy container.

1. CF dashboard → Zero Trust → Networks → Tunnels → create `dokploy-blackjaw`,
   copy the tunnel token.
2. Add public hostname in the same UI: service `http://localhost:3088`.
   CF creates the DNS CNAME automatically.
3. Run cloudflared on the VPS with host networking so `localhost:3088`
   resolves to the Dokploy-published port:

   ```bash
   docker run -d --name cloudflared --restart unless-stopped \
     --network host cloudflare/cloudflared:latest \
     tunnel --no-autoupdate run --token <TOKEN>
   ```

For multi-hostname setups, switch to `~/.cloudflared/config.yml` with an
`ingress:` list and a final `service: http_status:404` catch-all.

### Don't

- Don't add `vite.server.allowedHosts` to `astro.config.mjs` for ngrok —
  removed on purpose; we use Cloudflare Tunnel instead.
- Don't put the web Dockerfile inside `apps/web/` unless Dokploy's Docker
  Context Path is explicitly set to `.`.
