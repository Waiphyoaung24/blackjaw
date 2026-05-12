# UgcGallery — Masonry layout integration

Date: 2026-05-12
Surface: `apps/web` marketing site
Component to integrate: React Bits **Masonry** (JS + CSS variant, GSAP-powered)

## Goal

Replace the current 1-large + 6-small grid inside `apps/web/components/blackjaw/UgcGallery.astro` with a responsive masonry layout. The section frame (heading "How Our Friends Wear Blackjaw", "Add yours to the thread" CTA — desktop and mobile, "Load More" button) stays unchanged. Only the image grid swaps.

## Why

- Today's grid is static and visually similar to FeaturedCollections. A masonry rhythm reads more clearly as user-generated content and breaks up the page's geometric repetition.
- React Bits' Masonry is already engineered (responsive columns via `matchMedia`, `ResizeObserver` for width changes, GSAP entrance and hover transitions). Porting to vanilla Astro would be ~3× the surface area for no user-visible gain.
- React 19, `@astrojs/react` 4.4, and `gsap` 3.15 are already installed in `apps/web/package.json`. No new dependencies.

## Scope

- **In scope:** Replace the inner grid (lines 32–64 of `UgcGallery.astro`). Add `Masonry.jsx` + `Masonry.css` under `apps/web/components/blackjaw/masonry/`. Adapt the component for brand tokens, native link semantics, and the UGC camera badge.
- **Out of scope:** New image assets, Instagram API wiring, reduced-motion handling, SSR fallback grid for JS-disabled clients, Load More pagination logic.

## Architecture

`UgcGallery.astro` stays as a server-rendered Astro component for SEO/HTML stability of the heading and CTAs. The image grid becomes a React island hydrated with `client:visible` — hydration is deferred until the section scrolls into view, so it doesn't tax initial paint.

```
UgcGallery.astro  (Astro, SSR)
├── <h2>                     (unchanged)
├── desktop "Add yours" CTA  (unchanged)
├── <Masonry client:visible> (React island — NEW)
│     └── Masonry.jsx + Masonry.css
├── mobile "Add yours" CTA   (unchanged)
└── "Load More" button       (unchanged)
```

## Files

### New

- `apps/web/components/blackjaw/masonry/Masonry.jsx`
- `apps/web/components/blackjaw/masonry/Masonry.css`

### Modified

- `apps/web/components/blackjaw/UgcGallery.astro`

## Component source: deviations from upstream React Bits

The component is copied from the React Bits spec with three deliberate changes.

1. **Native link semantics.** Upstream renders `<div onClick={() => window.open(item.url, '_blank', 'noopener')}>`. We render an `<a>` instead so keyboard users and screen readers get real link semantics:

   ```jsx
   <a
     key={item.id}
     data-key={item.id}
     className="item-wrapper"
     href={item.url}
     target="_blank"
     rel="noopener noreferrer"
     aria-label={item.alt}
     onMouseEnter={(e) => handleMouseEnter(e, item)}
     onMouseLeave={(e) => handleMouseLeave(e, item)}
   >
   ```

   The `window.open` call and the `onClick` handler are deleted. Since the tile renders the image as a CSS `background-image` (not an `<img>`), the `alt` from the item is wired through `aria-label` on the `<a>` so screen readers announce the image's content.

2. **UGC camera badge** inside `.item-img`, matching the existing tiles (lines 43–45 and 59–61 of `UgcGallery.astro`):

   ```jsx
   <span className="camera-badge" aria-hidden="true">
     <svg
       width="13"
       height="13"
       viewBox="0 0 24 24"
       fill="none"
       stroke="white"
       stroke-width="2"
       stroke-linecap="round"
       stroke-linejoin="round"
     >
       <rect x="3" y="3" width="18" height="18" rx="5" />
       <circle cx="12" cy="12" r="4" />
       <circle cx="17.5" cy="6.5" r="1" fill="white" />
     </svg>
   </span>
   ```

3. **Brand alignment in CSS.** Upstream uses fixed `border-radius: 10px` and a custom drop shadow. We align to project conventions:
   - `.item-img` `border-radius` → `var(--radius-xl)` (~14 px in `apps/web/tailwind.config.css`, matches `rounded-xl` on sibling tiles).
   - `.item-img` `box-shadow` → literal `0 8px 22px rgba(0,0,0,.10)`, matching the existing UGC CTA shadow (`UgcGallery.astro:22`). `DESIGN.md` calls for a single `--shadow-card` token, but it is not yet defined in `globals.css`; introducing it is out of scope for this change and would touch unrelated components.
   - `.item-wrapper` `padding: 6px` stays (acts as the gap, comparable to `gap-3` / `gap-4` on today's grid).

All other logic — `useMedia` for columns, `useMeasure` for container width, `gsap.fromTo` on first paint, `gsap.to` on subsequent layout changes, `preloadImages` before animating — is identical to upstream.

## Props

```jsx
<Masonry
  items={items}
  ease="power3.out"
  duration={0.6}
  stagger={0.05}
  animateFrom="bottom"
  scaleOnHover={true}
  hoverScale={1.04}
  blurToFocus={true}
  colorShiftOnHover={false}
  client:visible
/>
```

`hoverScale={1.04}` is the only non-default value, overriding upstream's `0.95`. Reason: the rest of the site (FeaturedCollections, the existing UgcGallery tiles) zooms images UP on hover with `scale-[1.04]`. Shrinking would feel inconsistent.

## Item set

Eight items, drawn entirely from existing `apps/web/public/blackjaw/` assets. The brand hero shot (`product-4339-primary.jpg`) is used twice to anchor two columns — no new images required.

| id  | img path                               | height | role           |
| --- | -------------------------------------- | ------ | -------------- |
| u1  | `/blackjaw/product-4339-primary.jpg`   | 900    | tall anchor    |
| u2  | `/blackjaw/product-4016-primary.jpg`   | 700    | mid            |
| u3  | `/blackjaw/hero-2-desktop.jpg`         | 600    | mid-short      |
| u4  | `/blackjaw/product-4339-secondary.jpg` | 800    | tall           |
| u5  | `/blackjaw/product-4016-secondary.jpg` | 550    | short          |
| u6  | `/blackjaw/hero-3-desktop.jpg`         | 700    | mid            |
| u7  | `/blackjaw/hero-1-desktop.jpg`         | 850    | tall           |
| u8  | `/blackjaw/product-4339-primary.jpg`   | 600    | short, balance |

Each item also carries `url: "#"` (placeholder, matching today's `href="#"`) and an `alt` field used as the link's accessible name.

The component internally halves heights (`child.height / 2`), so these render at 275–450 px tall — close to the rhythm in the reference screenshot.

## Responsive behavior

Inherited from the upstream component:

| viewport  | columns |
| --------- | ------- |
| ≥ 1500 px | 5       |
| ≥ 1000 px | 4       |
| ≥ 600 px  | 3       |
| ≥ 400 px  | 2       |
| < 400 px  | 1       |

This is a behavior change vs. today's 2-col (mobile) / 5-col (`sm+`) grid. The new ramp is smoother (2 → 3 → 4 → 5).

## `UgcGallery.astro` edit

In the frontmatter, replace the `large` and `small` constants with:

```astro
---
import Masonry from "./masonry/Masonry.jsx";

const items = [
  { id: "u1", img: "/blackjaw/product-4339-primary.jpg",   url: "#", height: 900, alt: "Athlete wearing Blackjaw compression tee" },
  { id: "u2", img: "/blackjaw/product-4016-primary.jpg",   url: "#", height: 700, alt: "Blackjaw athlete" },
  { id: "u3", img: "/blackjaw/hero-2-desktop.jpg",         url: "#", height: 600, alt: "Blackjaw athlete" },
  { id: "u4", img: "/blackjaw/product-4339-secondary.jpg", url: "#", height: 800, alt: "Blackjaw athlete" },
  { id: "u5", img: "/blackjaw/product-4016-secondary.jpg", url: "#", height: 550, alt: "Blackjaw athlete" },
  { id: "u6", img: "/blackjaw/hero-3-desktop.jpg",         url: "#", height: 700, alt: "Blackjaw athlete" },
  { id: "u7", img: "/blackjaw/hero-1-desktop.jpg",         url: "#", height: 850, alt: "Blackjaw athlete" },
  { id: "u8", img: "/blackjaw/product-4339-primary.jpg",   url: "#", height: 600, alt: "Athlete wearing Blackjaw compression tee" },
];
---
```

In the template, replace the entire `<div class="grid grid-cols-2 …">…</div>` block (current lines 32–64) with:

```astro
<div class="min-h-[600px]">
  <Masonry items={items} hoverScale={1.04} client:visible />
</div>
```

The `min-h-[600px]` reserves vertical space so the page doesn't visibly jump when GSAP positions items after hydration. Once columns settle, the wrapper expands to fit.

## Risks and trade-offs

- **No-JS rendering:** The section is empty without JS. Acceptable because other site features (PreLoader, Header scroll states) already require JS.
- **CLS:** Mitigated by the wrapper `min-h-[600px]`. The exact final height depends on viewport width × column count; this floor covers the worst case (1-column mobile shows ~6 items above the fold) and is conservative for desktop.
- **GSAP hover conflicts with native `<a>` focus styles:** None expected — GSAP animates `scale`, not focus rings. Browsers will still draw a focus outline on the `<a>` when tabbed to.
- **`hoverScale={1.04}` direction reversal:** Upstream's `0.95` is a documented design choice. Going to `1.04` reads as "zoom in" instead of "press down." Verified against sibling sections; consistent.

## Acceptance criteria

1. On viewports ≥ 1000 px, the section renders 4 masonry columns. On 600–999 px, 3 columns. Below 400 px, 1 column.
2. Items fade and slide up from below on first scroll into view (`animateFrom="bottom"`), staggered by 50 ms each, with blur-to-focus transition.
3. Hover on a tile scales it to 1.04× with `power2.out` easing over 300 ms.
4. Each tile is a focusable `<a>` opening its URL in a new tab, with `aria-label` set to the item's alt text. Tabbing through the section reaches all 8 tiles in order.
5. The camera badge appears in the bottom-right of each tile.
6. The section heading, both "Add yours to the thread" CTAs, and the "Load More" button render unchanged.
7. No console errors; no layout jump after hydration (wrapper `min-h` holds).

## Future work (not in this spec)

- Replace `url: "#"` with real Instagram permalinks once they're sourced.
- Add `prefers-reduced-motion: reduce` gate to skip the entrance animation and disable `scaleOnHover`.
- Wire "Load More" to append items to the `items` array. Today it's a static CTA.
