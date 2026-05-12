# BLACKJAW Landing — Yellow Voltage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a single yellow voltage (`#f7bd02`) onto the BLACKJAW landing page's primary CTAs and cart badge, using additive design tokens that don't touch shadcn.

**Architecture:** Add Blackjaw-namespaced CSS variables (`--color-bj-primary`, `--color-ink`) to `apps/web` globals; reference them via Tailwind v4 `@theme inline` so utilities like `bg-bj-primary` and `text-ink` resolve. Apply utility swaps to 6 components and the announcement bar. No JS, no new dependencies, no tests (pure visual change — verified by running the dev server).

**Tech Stack:** Astro 5, Tailwind CSS v4, Bun. Files are `.astro` and `.css`.

**Spec:** `docs/superpowers/specs/2026-05-12-blackjaw-landing-yellow-voltage-design.md`

---

## Task 1: Add Blackjaw design tokens

**Files:**

- Modify: `apps/web/styles/globals.css` (append to second `:root` block near EOF)
- Modify: `apps/web/tailwind.config.css` (append inside `@theme inline { ... }`)

- [ ] **Step 1: Add CSS variables to `globals.css`**

Open `apps/web/styles/globals.css`. The file has two `:root` blocks — find the **second** one (the one preceded by the comment `BLACKJAW storefront design tokens.`, currently containing `--color-surface-alt`, `--font-display`, `--font-sans`). Append four new variables so the block becomes:

```css
:root {
  --color-surface-alt: #efefef;
  --font-display:
    Montserrat, "GT Standard M", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Nunito Sans", ui-sans-serif, system-ui, sans-serif;
  --color-ink: #282828;
  --color-bj-primary: #f7bd02;
  --color-bj-primary-active: #d9a300;
  --color-bj-primary-disabled: #fde79a;
}
```

- [ ] **Step 2: Map the variables into Tailwind's theme**

Open `apps/web/tailwind.config.css`. Inside the `@theme inline { ... }` block, after the last `--color-sidebar-ring: var(--ring);` line (just before the closing `}`), append:

```css
/* BLACKJAW brand tokens */
--color-ink: var(--color-ink);
--color-bj-primary: var(--color-bj-primary);
--color-bj-primary-active: var(--color-bj-primary-active);
--color-bj-primary-disabled: var(--color-bj-primary-disabled);
```

- [ ] **Step 3: Verify Tailwind resolves the new utilities**

Run the dev server and check the build emits the new color classes. From repo root:

```bash
bun web:dev
```

Wait for `Local http://localhost:4321/` (or 4322/4323). The page should still render unchanged (no consumers yet). If the console shows no Tailwind/Astro errors, tokens are wired. Stop the server with Ctrl-C.

- [ ] **Step 4: Commit**

```bash
git add apps/web/styles/globals.css apps/web/tailwind.config.css
git commit -m "feat(web): add Blackjaw brand tokens (yellow voltage, ink)"
```

---

## Task 2: Yellow CTA on Hero slideshow

**Files:**

- Modify: `apps/web/components/blackjaw/HeroSlideshow.astro` (line 19, the `<a>` slide CTA)

- [ ] **Step 1: Swap the hero slide CTA**

Open `apps/web/components/blackjaw/HeroSlideshow.astro`. Find this line:

```astro
<a href={s.href} class="mt-6 inline-flex items-center justify-center bg-black text-white rounded-full px-10 py-3 text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-white hover:text-black transition-colors">{s.cta}</a>
```

Replace with:

```astro
<a href={s.href} class="mt-6 inline-flex items-center justify-center bg-bj-primary text-ink rounded-full px-10 py-3 text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-bj-primary-active transition-colors">{s.cta}</a>
```

(Change: `bg-black text-white` → `bg-bj-primary text-ink`; `hover:bg-white hover:text-black` → `hover:bg-bj-primary-active`.)

- [ ] **Step 2: Commit**

```bash
git add apps/web/components/blackjaw/HeroSlideshow.astro
git commit -m "feat(web): yellow hero CTA on Blackjaw landing"
```

---

## Task 3: Yellow "SEE ALL →" button on Featured Collections

**Files:**

- Modify: `apps/web/components/blackjaw/FeaturedCollections.astro` (line 13)

- [ ] **Step 1: Swap the SEE ALL button**

Open `apps/web/components/blackjaw/FeaturedCollections.astro`. Find:

```astro
<a href="#" class="inline-flex items-center gap-2 border border-black rounded-full px-10 py-3 text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-black hover:text-white transition-colors">SEE ALL →</a>
```

Replace with:

```astro
<a href="#" class="inline-flex items-center gap-2 border border-ink rounded-full px-10 py-3 text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-bj-primary hover:text-ink hover:border-bj-primary transition-colors">SEE ALL →</a>
```

(Changes: `border-black` → `border-ink`; `hover:bg-black hover:text-white` → `hover:bg-bj-primary hover:text-ink hover:border-bj-primary`. Default state is still outlined with ink; hover fills yellow.)

- [ ] **Step 2: Commit**

```bash
git add apps/web/components/blackjaw/FeaturedCollections.astro
git commit -m "feat(web): yellow hover on Featured Collections SEE ALL"
```

---

## Task 4: Yellow "VIEW PRODUCTS" pill on Collection List

**Files:**

- Modify: `apps/web/components/blackjaw/CollectionList.astro` (line 19)

- [ ] **Step 1: Swap the VIEW PRODUCTS pill**

Open `apps/web/components/blackjaw/CollectionList.astro`. Find:

```astro
<span class="inline-flex bg-black text-white rounded-full px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase font-bold">VIEW PRODUCTS</span>
```

Replace with:

```astro
<span class="inline-flex bg-bj-primary text-ink rounded-full px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase font-bold">VIEW PRODUCTS</span>
```

(Change: `bg-black text-white` → `bg-bj-primary text-ink`.)

- [ ] **Step 2: Commit**

```bash
git add apps/web/components/blackjaw/CollectionList.astro
git commit -m "feat(web): yellow VIEW PRODUCTS pills on Collection List"
```

---

## Task 5: Yellow "SUBSCRIBE" in Footer

**Files:**

- Modify: `apps/web/components/blackjaw/Footer.astro` (line 14, Subscribe button only — App Store / Google Play buttons stay black)

- [ ] **Step 1: Swap the Subscribe button**

Open `apps/web/components/blackjaw/Footer.astro`. Find:

```astro
<button class="bg-black text-white rounded-full px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-bold hover:opacity-80">SUBSCRIBE</button>
```

Replace with:

```astro
<button class="bg-bj-primary text-ink rounded-full px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-bj-primary-active transition-colors">SUBSCRIBE</button>
```

(Changes: `bg-black text-white` → `bg-bj-primary text-ink`; `hover:opacity-80` → `hover:bg-bj-primary-active transition-colors` so hover darkens to active yellow instead of fading.)

**Do not** change the App Store / Google Play buttons (lines ~38–39). They stay `bg-black text-white` — secondary CTAs, kept dark for hierarchy under Subscribe.

- [ ] **Step 2: Commit**

```bash
git add apps/web/components/blackjaw/Footer.astro
git commit -m "feat(web): yellow Subscribe button in Footer"
```

---

## Task 6: Yellow cart badge + ink wordmark in Header

**Files:**

- Modify: `apps/web/components/blackjaw/Header.astro` (lines ~29, ~45)

- [ ] **Step 1: Swap the cart count badge**

Open `apps/web/components/blackjaw/Header.astro`. Find the cart badge `<span>` (currently around line 45):

```astro
<span class="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center">0</span>
```

Replace with:

```astro
<span class="absolute -top-0.5 -right-0.5 bg-bj-primary text-ink text-[9px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center">0</span>
```

- [ ] **Step 2: Swap the wordmark color to ink**

In the same file, find the BLACKJAW wordmark `<a>` (currently around line 29):

```astro
<a
  href="/"
  class="wordmark absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[26px] sm:text-[30px] lg:text-[34px] font-black text-black leading-none whitespace-nowrap"
  style="letter-spacing:.24em;"
>BLACKJAW</a>
```

Replace with:

```astro
<a
  href="/"
  class="wordmark absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[26px] sm:text-[30px] lg:text-[34px] font-black text-ink leading-none whitespace-nowrap"
  style="letter-spacing:.24em;"
>BLACKJAW</a>
```

(Change: `text-black` → `text-ink`. Everything else stays — heavy Montserrat 900 is preserved per the BLACKJAW wordmark exception.)

- [ ] **Step 3: Commit**

```bash
git add apps/web/components/blackjaw/Header.astro
git commit -m "feat(web): yellow cart badge, ink wordmark in Header"
```

---

## Task 7: Ink announcement bar

**Files:**

- Modify: `apps/web/components/blackjaw/AnnouncementBar.astro` (line 3)

- [ ] **Step 1: Swap bg-black → bg-ink**

Open `apps/web/components/blackjaw/AnnouncementBar.astro`. Find:

```astro
<div class="w-full h-[42px] flex items-center justify-center bg-black text-white text-[11px] tracking-[0.18em] uppercase font-[family-name:var(--font-sans)]">
  FREE SHIPPING ON ORDERS OVER $75 USD
</div>
```

Replace with:

```astro
<div class="w-full h-[42px] flex items-center justify-center bg-ink text-white text-[11px] tracking-[0.18em] uppercase font-[family-name:var(--font-sans)]">
  FREE SHIPPING ON ORDERS OVER $75 USD
</div>
```

(Change: `bg-black` → `bg-ink`. The dark surface now uses the token instead of pure black.)

- [ ] **Step 2: Commit**

```bash
git add apps/web/components/blackjaw/AnnouncementBar.astro
git commit -m "feat(web): announcement bar uses ink token"
```

---

## Task 8: Update `.impeccable.md` heavy-display exception

**Files:**

- Modify: `.impeccable.md` (root of repo)

- [ ] **Step 1: Add exception note to Design Principle #3**

Open `.impeccable.md`. Find Design Principle #3:

```markdown
3. **Modest type, loud photography.** Display weights stay at 500–700 and never feel like they're shouting. Visual hierarchy comes from images and whitespace.
```

Replace with:

```markdown
3. **Modest type, loud photography.** Display weights stay at 500–700 and never feel like they're shouting. Visual hierarchy comes from images and whitespace. _Exception: the BLACKJAW wordmark and full-bleed hero headings retain heavy display weight (Montserrat 800–900) as a brand signature — body, section headings, captions, and nav stay 500–700._
```

- [ ] **Step 2: Commit**

```bash
git add .impeccable.md
git commit -m "docs: BLACKJAW wordmark exception to modest-type principle"
```

---

## Task 9: Visual verification

**Files:** None (verification only)

- [ ] **Step 1: Start the dev server**

From the repo root:

```bash
bun web:dev
```

Wait for `Local http://localhost:4321/` (or next free port).

- [ ] **Step 2: Open the landing page**

Open the URL shown in the terminal in a browser.

- [ ] **Step 3: Verify each yellow moment**

Scroll through the page and confirm:

- **Header cart icon** — count badge "0" is a small yellow `#f7bd02` circle with dark `#282828` text.
- **Header wordmark** — "BLACKJAW" rendered in ink `#282828` (visually near-identical to black but technically softer).
- **Announcement bar** — dark band still reads "FREE SHIPPING ON ORDERS OVER $75 USD" with white text on `#282828` ink (not pure black).
- **Hero slide CTA** — "SHOP NOW" pill is yellow with ink text. Hover darkens to `#d9a300` (no text-color flip).
- **Featured "SEE ALL →"** — outlined button with ink border. On hover the button fills yellow and label/border swap to ink/yellow.
- **Collection list "VIEW PRODUCTS"** pills (4 tiles) — yellow with ink text.
- **Footer "SUBSCRIBE"** — yellow with ink text. Hover darkens to `#d9a300`.
- **Footer App Store / Google Play** — unchanged (still black, secondary).
- **Product card "NEW LAUNCH"** badge — unchanged (still ink/black tag, not yellow).

- [ ] **Step 4: Confirm no regressions on other pages**

In the same browser, navigate to:

- `http://localhost:4321/about`
- `http://localhost:4321/pricing`
- `http://localhost:4321/features`

These pages should look exactly as they did before (they don't use the blackjaw components).

- [ ] **Step 5: Confirm no `apps/app` regression (if running)**

If `apps/app` was running in another tab, refresh it. Buttons / inputs that use shadcn's `bg-primary` (near-black) should be unchanged — we didn't touch `--primary`.

- [ ] **Step 6: Stop the dev server**

Ctrl-C in the dev server terminal.

---

## Summary

| Task | File(s)                              | Edit count        |
| ---- | ------------------------------------ | ----------------- |
| 1    | `globals.css`, `tailwind.config.css` | 2 blocks appended |
| 2    | `HeroSlideshow.astro`                | 1 line            |
| 3    | `FeaturedCollections.astro`          | 1 line            |
| 4    | `CollectionList.astro`               | 1 line            |
| 5    | `Footer.astro`                       | 1 line            |
| 6    | `Header.astro`                       | 2 lines           |
| 7    | `AnnouncementBar.astro`              | 1 line            |
| 8    | `.impeccable.md`                     | 1 line            |
| 9    | (verification)                       | 0                 |

8 commits, 9 files, ~12 line edits. No tests required — pure visual change verified by dev-server inspection.
