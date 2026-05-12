# BLACKJAW landing — yellow voltage rebrand

**Date:** 2026-05-12
**Scope:** `apps/web` — `pages/index.astro`, its components, and `apps/web` global CSS tokens. No changes to `apps/app`, `pages/about|pricing|features`, or shadcn theme tokens.

## Goal

Introduce a single warm yellow voltage (`#f7bd02`) into the BLACKJAW landing page following the project's new design system (`.impeccable.md` / `DESIGN.md` — white canvas, ink `#282828`, yellow accent, ink-on-yellow CTA labels). Keep the streetwear content, heavy wordmark, and existing layout — only the action surfaces and ink token change.

## Decisions (from brainstorming)

1. **Brand/copy:** Keep BLACKJAW streetwear voice. No content rewrite.
2. **Display type:** Allow heavy display (Montserrat 800–900) for the BLACKJAW wordmark and full-bleed hero headings — exception to the "modest type" principle. Body and section headings remain modest.
3. **Yellow placement:** Approach A — yellow only on primary CTAs and the cart badge. ~5 yellow moments per scroll. Voltage used scarcely.
4. **Token strategy:** Add Blackjaw tokens (`--color-bj-primary`, `--color-ink`, etc.) additively. Do **not** touch shadcn's `--primary` / `--primary-foreground` — `apps/app` shadcn components depend on them and the goal is no cross-app regression.

## Token changes

### `apps/web/styles/globals.css`

Append to the existing `:root` block (the second `:root` block at the bottom, after the BLACKJAW storefront comment):

```css
--color-ink: #282828;
--color-bj-primary: #f7bd02;
--color-bj-primary-active: #d9a300;
--color-bj-primary-disabled: #fde79a;
```

### `apps/web/tailwind.config.css`

Inside `@theme inline { ... }`, append:

```css
--color-ink: var(--color-ink);
--color-bj-primary: var(--color-bj-primary);
--color-bj-primary-active: var(--color-bj-primary-active);
--color-bj-primary-disabled: var(--color-bj-primary-disabled);
```

This makes utilities available: `bg-bj-primary`, `bg-bj-primary-active`, `text-ink`, `border-ink`, etc.

## Component changes

All component paths are under `apps/web/components/blackjaw/`.

### `HeroSlideshow.astro`

Slide CTA pill — line ~19:

- Old: `bg-black text-white ... hover:bg-white hover:text-black`
- New: `bg-bj-primary text-ink ... hover:bg-bj-primary-active`

No other changes. The bottom scroll-down circle stays white.

### `FeaturedCollections.astro`

"SEE ALL →" button — line ~13:

- Old: `border border-black ... hover:bg-black hover:text-white`
- New: `border border-ink ... hover:bg-bj-primary hover:text-ink hover:border-bj-primary`

### `CollectionList.astro`

"VIEW PRODUCTS" pill — line ~19:

- Old: `bg-black text-white`
- New: `bg-bj-primary text-ink`

### `Footer.astro`

"SUBSCRIBE" button — line ~14:

- Old: `bg-black text-white ... hover:opacity-80`
- New: `bg-bj-primary text-ink ... hover:bg-bj-primary-active`

App Store / Google Play buttons (lines 38–39) stay `bg-black text-white` — they are secondary CTAs, keeping them black preserves visual hierarchy under "Subscribe."

### `Header.astro`

Cart count badge — line ~45:

- Old: `bg-black text-white`
- New: `bg-bj-primary text-ink`

Wordmark, icons, nav links, and top utility bar stay unchanged.

### `AnnouncementBar.astro`

**No change.** Stays `bg-black text-white`. Acts as a contrast band that sets up the white canvas + yellow CTA below.

### `ProductCard.astro`

**No change.** The "NEW LAUNCH" badge stays ink (black) — keeping it secondary avoids diluting the yellow voltage.

### `BlackjawLayout.astro`

**No change.** Already `bg-white`.

## Ink swap (selective)

Pure black is acceptable in Tailwind utilities on text and hairlines (`text-black`, `border-black/10`) — visually indistinguishable from `#282828` at small sizes, and a blanket swap creates churn without visible gain.

Surface-level swaps only:

- `Header.astro` wordmark color (currently `text-black` on a 26–34px heavy lockup) — swap to `text-ink` so the brand mark uses our token.
- `Header.astro` nav links color — leave `text-black` (small, mixes with non-token utility classes).
- `AnnouncementBar.astro` background — swap `bg-black` → `bg-ink` so the strongest dark surface uses our token.

Total ink-token swaps: 2.

## `.impeccable.md` principle update

In `.impeccable.md`, Design Principle #3 ("Modest type, loud photography"), add an exception line:

> _Exception: the BLACKJAW wordmark and full-bleed hero headings retain heavy display weight (Montserrat 800–900) as a brand signature. Body, section headings, captions, and nav stay 500–700._

## Verification

After implementation:

1. `bun web:dev` → open `http://localhost:4321` (or 4322/4323 if previous dev servers held the port).
2. **Visual check** — scroll the index page:
   - Hero "SHOP NOW" pill: yellow `#f7bd02` background, ink `#282828` label, hover darkens to `#d9a300`.
   - FeaturedCollections "SEE ALL →": ink border, on hover fills yellow with ink text.
   - CollectionList: each "VIEW PRODUCTS" pill is yellow with ink label.
   - Footer "SUBSCRIBE": yellow with ink label, hover darkens.
   - Header cart badge: small yellow circle with ink "0".
3. **Contrast check** — ink `#282828` on yellow `#f7bd02` measures ~8.2:1 (well above WCAG AA 4.5:1 for body, AAA for large).
4. **No regression check** — open `/about`, `/pricing`, `/features` — same as before (they don't use blackjaw components or new tokens).
5. **No `apps/app` regression** — open the app worker if running; shadcn components there should be unchanged (we didn't touch `--primary`).

## Out of scope

- Content / copy rewrites
- Pricing, features, about pages
- Font swaps
- Image asset replacements
- shadcn theme tokens (`--primary`, `--primary-foreground`, etc.) in `globals.css` — keeping them ensures `apps/app` is unaffected
- `BlackjawLayout.astro` body class, head links, fonts
- The `.dark` mode block — landing is light-only

## Files changed (final count)

- `apps/web/styles/globals.css` — append 4 CSS variables to existing `:root`
- `apps/web/tailwind.config.css` — append 4 theme mappings inside `@theme inline`
- `apps/web/components/blackjaw/HeroSlideshow.astro` — 1 line edit (CTA classes)
- `apps/web/components/blackjaw/FeaturedCollections.astro` — 1 line edit
- `apps/web/components/blackjaw/CollectionList.astro` — 1 line edit
- `apps/web/components/blackjaw/Footer.astro` — 1 line edit (Subscribe)
- `apps/web/components/blackjaw/Header.astro` — 2 line edits (wordmark color, cart badge)
- `apps/web/components/blackjaw/AnnouncementBar.astro` — 1 line edit (bg-black → bg-ink)
- `.impeccable.md` — append exception line to Principle #3

Total: 9 files, ~12 line edits.
