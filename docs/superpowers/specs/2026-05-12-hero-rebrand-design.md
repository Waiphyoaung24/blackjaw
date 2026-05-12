# Hero Rebrand — Satisfy-style, Brand-True

**Date:** 2026-05-12
**Scope:** `apps/web/components/blackjaw/HeroSlideshow.astro` only.
**Reference:** Satisfy "DESERT RATS" hero (screenshot, 2026-05-12).

## Goal

Re-compose the homepage hero to match the Satisfy reference layout (centered heading, eyebrow below, pill CTA, single underline indicator) while honoring Blackjaw brand tokens from `DESIGN.md` / `.impeccable.md`.

## Layout

- Section height unchanged: `500px` mobile, `546px` desktop. Full-bleed background photo.
- Gradient overlay: softer top→bottom dark wash (lighter than current `from-black/50`) for legibility without muddying the image.
- Content stack **vertically centered** (replaces current `bottom-16` anchor):
  1. **Heading** — display font, white, uppercase, weight 700 (not 900), tracking `0.04em`, size `48px` / `lg:88px`, soft text-shadow `0 2px 12px rgba(0,0,0,.5)`.
  2. **Eyebrow** — white, uppercase, `11px`, tracking `0.3em`, weight 500, ~`14px` above-margin from heading.
  3. **CTA** — yellow pill: `bg-bj-primary` (`#f7bd02`), label `#282828` ("SHOP"), `rounded-full`, `px-10 py-3`, `11px` tracking `0.2em`, weight 700, **min-height 48px** (brand touch-target rule). `mt-6`.

## Slides (carousel preserved, 5s interval)

| #   | Heading  | Eyebrow              |
| --- | -------- | -------------------- |
| 1   | RESTOCK  | BITE THROUGH LIMITS  |
| 2   | NEW DROP | THE JAWS NEVER BREAK |
| 3   | RESTOCK  | BACK IN STOCK        |

## Indicator

Replace 3 dots with a single thin underline: `40px × 2px` white bar centered ~`24px` from bottom. Opacity tied to active-slide state (active = `bg-white`, inactive slides hide their bar). Simplest: one bar that just sits there (since all slides look identical at indicator level) — but to preserve "current slide" affordance, keep one bar per slide with same fade logic the dots used.

## Removed

- Floating white circular scroll-down chevron (`<div class="relative flex justify-center -mt-6 ...">` block below the section). Not in reference; competes with CTA.

## Untouched

- Carousel JS interval logic, image asset paths, `data-blackjaw-hero` root hook, section background `bg-black`.
- Selector names update only where necessary (dots → underline bars).

## Brand compliance

- One voltage: yellow only on CTA. ✓
- Ink (`#282828`) on yellow, never white. ✓
- Modest type weight (700, not 900). ✓
- Touch target ≥ 48px. ✓
- No glassmorphism, no dual-color CTA. ✓
