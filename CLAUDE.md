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

---

## Rebrand Context

Active rebrand of the marketing surface — targets are `apps/web` and
`apps/app`. Per-app file paths discovered as work begins; the brand,
skill, and design-token guidance below applies to both.

## Skills

Project-local skills live in `.claude/skills/`. Always invoke via the `Skill` tool — never read the SKILL.md files manually.

### Always-on

- **karpathy-guidelines** (`.claude/skills/karpathy-guidelines/SKILL.md`) — Andrej Karpathy's coding discipline. Apply on every coding task.

### Animation (GSAP)

Installed via the `gsap-skills` plugin (GreenSock). Invoke through the `Skill` tool when animation work is involved.

- `gsap-core` — tweens, eases, basic API
- `gsap-timeline` — sequencing multiple animations
- `gsap-scrolltrigger` — scroll-driven animations
- `gsap-plugins` — Flip, Draggable, MotionPath, SplitText, etc.
- `gsap-react` — `useGSAP` hook and React integration
- `gsap-frameworks` — framework hookups (Astro, Next.js, Vue, Svelte)
- `gsap-performance` — `will-change`, batching, reduced-motion
- `gsap-utils` — utility methods

### Design & Frontend Work

Whenever the task involves **UI design, visual styling, layout, components, theming, or frontend polish**, the following skills are available locally in `.claude/skills/`. Invoke via the `Skill` tool — do not read SKILL.md files manually.

- `frontend-design` — distinctive, production-grade frontend interfaces (default starting point)
- `tailwind-design-system` / `tailwind-patterns` — Tailwind v4 conventions
- `web-design-guidelines` / `frontend-dev-guidelines` — general web craft
- `ui-skills` / `ui-ux-pro-max` / `ui-ux-designer` — broader UX guidance
- `theme-factory` / `radix-ui-design-system` — design tokens / component systems
- `react-patterns` / `react-best-practices` / `react-ui-patterns` — React component work
- `scroll-experience` / `interactive-portfolio` / `threejs-*` — motion / 3D (GSAP via the `gsap-skills` plugin)
- `accessibility-compliance-accessibility-audit` / `wcag-audit-patterns` — a11y
- `web-performance-optimization` — Lighthouse / Core Web Vitals
- `clone-website` / `redesign-skill` / `taste-skill` / `design-md` — research & taste passes
- `brand-guidelines-anthropic` / `brand-guidelines-community` — brand reference

Invoke the relevant skill before generating design code, then apply its guidance to this project.

## Design Context

Source of truth: `.impeccable.md` (project root) and `DESIGN.md` (Blackjaw tokens). All new UI work follows the black + white + yellow brand below.

### Users

Buyers, distributors, and partners evaluating Red Horse Industries — a Myanmar manufacturing, distribution, and nourishment group. Job-to-be-done: _trust assessment in under 30 seconds._ Mobile-first in-region; desktop for international due diligence.

### Brand Personality

**Generous, trustworthy, human.** Warm, confident, plainspoken — the calm assurance of a category-leading consumer brand, not the cold authority of a holding-company PDF.

### Aesthetic Direction (black + white + yellow)

- **Canvas:** `#ffffff`. No paper, no grain.
- **Voltage:** One yellow — `#f7bd02` — for primary CTAs and the brand mark only.
- **Ink:** `#282828` (never pure `#000`). Body `#3f3f3f`. Muted `#6a6a6a`. Hairline `#dddddd`.
- **On-primary:** CTA labels render in **ink (`#282828`)**, never white — white-on-yellow fails contrast.
- **Type:** Modest weights (500–700 display, 400 body). Photography carries hierarchy.
- **Shape ladder:** `--radius-xs/sm/md/lg/xl/full` (4/8/14/20/32/9999). No bespoke radii.
- **Elevation:** Single shadow tier — `--shadow-card`. Flat otherwise.

**Anti-references:** editorial magazine layouts, heavy serif at hero scale, paper/grain backgrounds, glassmorphism nav over photo, dual-color CTA systems, pure `#000`, white text on yellow.

### Design Principles

1. **One voltage.** Yellow `#f7bd02` carries primary CTA + brand mark. Two different yellows on screen means one is wrong.
2. **Ink on yellow, never white.** Primary CTA labels are `#282828`. White-on-yellow fails contrast.
3. **Modest type, loud photography.** Display weight 500–700, never shouting.
4. **Soft, never sharp.** Every interactive element rounded. The body grid is the only hard edge.
5. **One shadow tier or none.** Depth = white-on-white + rounded clipping, not stacked elevation.
6. **Touch targets non-negotiable.** Primary ≥ 48px, secondary ≥ 44px — applies to nav and footer links too.
7. **Snap to tokens.** Radii, spacing, colors all reference `DESIGN.md` tokens. No bespoke per-component values.
