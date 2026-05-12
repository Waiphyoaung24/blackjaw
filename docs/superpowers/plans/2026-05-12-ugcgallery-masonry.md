# UgcGallery Masonry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 1-large + 6-small image grid inside `apps/web/components/blackjaw/UgcGallery.astro` with a React Bits Masonry component, hydrated as an Astro island. The surrounding section frame (heading, both "Add yours to the thread" CTAs, "Load More" button) stays untouched.

**Architecture:** Two new files under `apps/web/components/blackjaw/masonry/` (`Masonry.jsx` + `Masonry.css`) hold the React component with three deviations from the upstream React Bits source: native `<a>` wrapper with `aria-label` for accessibility, UGC camera badge inside each tile, and `border-radius` aligned to the project's `--radius-xl` token. The component is then rendered inside `UgcGallery.astro` with `client:visible`, so hydration is deferred until the section scrolls into view.

**Tech Stack:** Astro 5 (`apps/web`), `@astrojs/react` 4.4, React 19, GSAP 3.15 (all already in `apps/web/package.json`). Tailwind v4 for the wrapper. Bun for scripts. Husky + lint-staged pre-commit hook runs `bunx prettier --check`.

**Spec reference:** `docs/superpowers/specs/2026-05-12-ugcgallery-masonry-design.md` (commits `7dceb0a`, `a6a4349`).

**Pre-commit note:** This repo's pre-commit hook runs `bunx prettier --check --ignore-unknown` against staged files. Before each `git add ... && git commit`, run `bunx prettier --write <files>` on the staged files so the hook doesn't block.

---

## File Structure

- **Create** `apps/web/components/blackjaw/masonry/Masonry.css` — component styles. Border-radius via `var(--radius-xl)`, box-shadow as the literal `0 8px 22px rgba(0,0,0,.10)` matching the existing UGC CTA shadow at `UgcGallery.astro:22`. The `.camera-badge` rule lives here too.
- **Create** `apps/web/components/blackjaw/masonry/Masonry.jsx` — React component. Same logic as upstream React Bits Masonry (responsive columns via `matchMedia`, container width via `ResizeObserver`, image preload, GSAP `fromTo` on mount, GSAP `to` on width change, hover scale). Three deviations: `<a>` wrapper with `href`/`target`/`rel`/`aria-label` instead of `<div onClick>`, camera badge SVG inside `.item-img`, and `import './Masonry.css'` at the top.
- **Modify** `apps/web/components/blackjaw/UgcGallery.astro` — frontmatter replaces the `large`/`small` constants with an `items` array and imports `Masonry`. Template replaces the `<div class="grid grid-cols-2 …">…</div>` block (current lines 32–64) with a `<div class="min-h-[600px]"><Masonry items={items} hoverScale={1.04} client:visible /></div>`.

UgcGallery is mounted in `apps/web/pages/index.astro` — that's the only place the section renders, so the dev server URL for verification is `http://localhost:4321/`.

---

## Task 1: Add Masonry.css (brand-aligned styles)

**Files:**

- Create: `apps/web/components/blackjaw/masonry/Masonry.css`

- [ ] **Step 1: Create the CSS file**

Write `apps/web/components/blackjaw/masonry/Masonry.css` with this exact content:

```css
.list {
  position: relative;
  width: 100%;
  height: 100%;
}

.item-wrapper {
  position: absolute;
  will-change: transform, width, height, opacity;
  padding: 6px;
  cursor: pointer;
  top: 0;
  left: 0;
  display: block;
  text-decoration: none;
  color: inherit;
}

.item-wrapper > .item-img {
  position: relative;
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 100%;
  text-transform: uppercase;
  font-size: 10px;
  line-height: 10px;
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.item-wrapper .camera-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
```

Notes:

- The four extra declarations on `.item-wrapper` (`display: block`, `text-decoration: none`, `color: inherit`) reset the link element so it renders identically to the upstream `<div>` and inherits no underline or color from the surrounding heading text.
- `overflow: hidden` on `.item-img` clips the future hover-scale so the corners stay rounded during the GSAP `scale: 1.04` animation.
- `box-shadow` uses the literal value from `UgcGallery.astro:22`. Spec line 92 explains why we don't introduce a `--shadow-card` token in this change.

- [ ] **Step 2: Format and commit**

```bash
bunx prettier --write apps/web/components/blackjaw/masonry/Masonry.css
git add apps/web/components/blackjaw/masonry/Masonry.css
git commit -m "feat(web): add Masonry.css with brand-aligned tile styles"
```

Expected: commit succeeds; pre-commit prettier check passes.

---

## Task 2: Add Masonry.jsx component

**Files:**

- Create: `apps/web/components/blackjaw/masonry/Masonry.jsx`

- [ ] **Step 1: Create the JSX file**

Write `apps/web/components/blackjaw/masonry/Masonry.jsx` with this exact content:

```jsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

import "./Masonry.css";

const useMedia = (queries, values, defaultValue) => {
  const get = () =>
    values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue;

  const [value, setValue] = useState(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach((q) => matchMedia(q).addEventListener("change", handler));
    return () =>
      queries.forEach((q) =>
        matchMedia(q).removeEventListener("change", handler),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries]);

  return value;
};

const useMeasure = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
};

const preloadImages = async (urls) => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        }),
    ),
  );
};

const CameraIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="white" />
  </svg>
);

const Masonry = ({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 1.04,
  blurToFocus = true,
  colorShiftOnHover = false,
}) => {
  const columns = useMedia(
    [
      "(min-width:1500px)",
      "(min-width:1000px)",
      "(min-width:600px)",
      "(min-width:400px)",
    ],
    [5, 4, 3, 2],
    1,
  );

  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);

  const getInitialPosition = (item) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;

    if (animateFrom === "random") {
      const directions = ["top", "bottom", "left", "right"];
      direction = directions[Math.floor(Math.random() * directions.length)];
    }

    switch (direction) {
      case "top":
        return { x: item.x, y: -200 };
      case "bottom":
        return { x: item.x, y: window.innerHeight + 200 };
      case "left":
        return { x: -200, y: item.y };
      case "right":
        return { x: window.innerWidth + 200, y: item.y };
      case "center":
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    preloadImages(items.map((i) => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const grid = useMemo(() => {
    if (!width) return [];

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const height = child.height / 2;
      const y = colHeights[col];

      colHeights[col] += height;

      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      };

      if (!hasMounted.current) {
        const initialPos = getInitialPosition(item, index);
        const initialState = {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: "blur(10px)" }),
        };

        gsap.fromTo(selector, initialState, {
          opacity: 1,
          ...animationProps,
          ...(blurToFocus && { filter: "blur(0px)" }),
          duration: 0.8,
          ease: "power3.out",
          delay: index * stagger,
        });
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration: duration,
          ease: ease,
          overwrite: "auto",
        });
      }
    });

    hasMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (e, item) => {
    const element = e.currentTarget;
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: hoverScale,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay");
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.3,
          duration: 0.3,
        });
      }
    }
  };

  const handleMouseLeave = (e, item) => {
    const element = e.currentTarget;
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay");
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
        });
      }
    }
  };

  return (
    <div ref={containerRef} className="list">
      {grid.map((item) => {
        return (
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
            <div
              className="item-img"
              style={{ backgroundImage: `url(${item.img})` }}
            >
              <span className="camera-badge">
                <CameraIcon />
              </span>
              {colorShiftOnHover && (
                <div
                  className="color-overlay"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(45deg, rgba(255,0,150,0.5), rgba(0,150,255,0.5))",
                    opacity: 0,
                    pointerEvents: "none",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default Masonry;
```

Notes vs. upstream React Bits source:

1. Default `hoverScale` is `1.04` (not `0.95`) — matches the spec's hover style decision.
2. Outer element is `<a>` with `href`, `target="_blank"`, `rel="noopener noreferrer"`, `aria-label={item.alt}`. The upstream `onClick={() => window.open(...)}` is removed; browsers handle the click natively. Since the image is a CSS `background-image`, screen readers can't read it — `aria-label` provides the accessible name instead.
3. New `<CameraIcon />` component and `<span className="camera-badge">` render the UGC badge inside each tile. The badge is purely decorative (`aria-hidden="true"` on the SVG) and `pointer-events: none` in CSS so it doesn't intercept hover.
4. The `useEffect` cleanup function for `useMedia` now uses explicit braces so the return statement isn't implicit (avoids ambiguity with the comma-separated forEach result).

- [ ] **Step 2: Astro type check**

```bash
bun --cwd apps/web check
```

Expected: passes. The component is `.jsx` (not `.tsx`), so Astro check should ignore it unless it's actually imported by a checked file — and Task 3 hasn't wired it in yet. If it surfaces errors about `react/jsx-runtime` or similar, stop and read the error before continuing.

- [ ] **Step 3: Format and commit**

```bash
bunx prettier --write apps/web/components/blackjaw/masonry/Masonry.jsx
git add apps/web/components/blackjaw/masonry/Masonry.jsx
git commit -m "feat(web): add Masonry React component with brand-aligned hover and a11y"
```

Expected: commit succeeds.

---

## Task 3: Wire Masonry into UgcGallery.astro

**Files:**

- Modify: `apps/web/components/blackjaw/UgcGallery.astro` (frontmatter lines 1–14, template lines 32–64)

- [ ] **Step 1: Replace the frontmatter**

Open `apps/web/components/blackjaw/UgcGallery.astro`. Replace lines 1–14 (the `---` frontmatter block that defines `large` and `small`) with:

```astro
---
import Masonry from "./masonry/Masonry.jsx";

const items = [
  {
    id: "u1",
    img: "/blackjaw/product-4339-primary.jpg",
    url: "#",
    height: 900,
    alt: "Athlete wearing Blackjaw compression tee",
  },
  {
    id: "u2",
    img: "/blackjaw/product-4016-primary.jpg",
    url: "#",
    height: 700,
    alt: "Blackjaw athlete",
  },
  {
    id: "u3",
    img: "/blackjaw/hero-2-desktop.jpg",
    url: "#",
    height: 600,
    alt: "Blackjaw athlete",
  },
  {
    id: "u4",
    img: "/blackjaw/product-4339-secondary.jpg",
    url: "#",
    height: 800,
    alt: "Blackjaw athlete",
  },
  {
    id: "u5",
    img: "/blackjaw/product-4016-secondary.jpg",
    url: "#",
    height: 550,
    alt: "Blackjaw athlete",
  },
  {
    id: "u6",
    img: "/blackjaw/hero-3-desktop.jpg",
    url: "#",
    height: 700,
    alt: "Blackjaw athlete",
  },
  {
    id: "u7",
    img: "/blackjaw/hero-1-desktop.jpg",
    url: "#",
    height: 850,
    alt: "Blackjaw athlete",
  },
  {
    id: "u8",
    img: "/blackjaw/product-4339-primary.jpg",
    url: "#",
    height: 600,
    alt: "Athlete wearing Blackjaw compression tee",
  },
];
---
```

- [ ] **Step 2: Replace the grid block in the template**

In the same file, locate the block that begins with `<div class="grid grid-cols-2 sm:grid-cols-5 …">` and ends at the closing `</div>` for that grid (originally lines 32–64). Replace the entire block — opening `<div>`, the large `<a>`, the `{small.map(...)}` block, and the closing `</div>` — with a single line:

```astro
  <div class="min-h-[600px]">
    <Masonry items={items} hoverScale={1.04} client:visible />
  </div>
```

The `min-h-[600px]` reserves vertical space so the page doesn't jump when GSAP positions items after hydration. Leave everything else in the section (`<section>`, heading, both CTAs, "Load More" button) exactly as-is.

- [ ] **Step 3: Astro type check**

```bash
bun --cwd apps/web check
```

Expected: passes. If `Masonry` import resolution complains, double-check the relative path is `./masonry/Masonry.jsx` (with the extension) and that the file exists.

- [ ] **Step 4: Format and commit**

```bash
bunx prettier --write apps/web/components/blackjaw/UgcGallery.astro
git add apps/web/components/blackjaw/UgcGallery.astro
git commit -m "feat(web): replace UgcGallery grid with Masonry island"
```

Expected: commit succeeds.

---

## Task 4: Build verification

**Files:** none modified in this task.

- [ ] **Step 1: Production build**

```bash
bun --cwd apps/web build
```

Expected: build completes successfully. The static output (`apps/web/dist/`) should contain hashed JS bundles for the React island and a CSS bundle including the Masonry styles. If the build fails, read the first error — common causes:

- `Cannot resolve module './Masonry.css'` from inside `Masonry.jsx` → check the CSS file path and casing.
- `useLayoutEffect does nothing on the server` warning is benign and can be ignored (only the island JS runs in the client, and `client:visible` ensures hydration order).
- A TypeScript error in `UgcGallery.astro` about the `Masonry` import → re-run `bun --cwd apps/web check` to surface the exact line.

- [ ] **Step 2: No-op if build is clean**

If the build passes, no commit is needed — nothing changed in this task. Move on.

If the build fails and required code changes, fix them, then commit with a message like `fix(web): <what you fixed> in masonry build`.

---

## Task 5: Manual visual verification

**Files:** none modified.

- [ ] **Step 1: Start the dev server**

```bash
bun --cwd apps/web dev
```

Expected: the server starts on `http://localhost:4321/`.

- [ ] **Step 2: Open the page**

Open `http://localhost:4321/` in a browser at desktop width (≥ 1000 px). Scroll to the "How Our Friends Wear Blackjaw" section.

- [ ] **Step 3: Walk through acceptance criteria**

Tick off each item from the spec ("Acceptance criteria" section of `docs/superpowers/specs/2026-05-12-ugcgallery-masonry-design.md`):

1. At viewport width ≥ 1000 px, the masonry renders **4 columns**. Resize the window narrower: at 600–999 px, **3 columns**; below 400 px, **1 column**.
2. When the section first scrolls into view, items **fade and slide up** from below with a blur-to-focus effect, staggered ~50 ms each.
3. Hover any tile → it scales to **1.04×** smoothly over ~300 ms. Mouse out → returns to 1×.
4. Tab through the section. Each of the 8 tiles is focusable in DOM order; pressing Enter opens `#` in a new tab. The browser shows the tile's `alt` text as the link's accessible name (verify via DevTools Accessibility tab).
5. The **camera badge** (small circular icon with camera glyph) renders in the bottom-right of every tile.
6. **Heading**, both "Add yours to the thread" CTAs (desktop pill above, mobile pill below), and the **"Load More"** outline button all render unchanged from before.
7. Browser console is clean — no React or GSAP errors. No visible layout jump after hydration (the `min-h-[600px]` wrapper holds height).

- [ ] **Step 4: Mobile check**

In DevTools, switch to a mobile preset (e.g., iPhone 14 — 390 px wide). Verify:

- Masonry renders 2 columns (since 390 < 400, will actually be 1 col — that's expected per spec).
- Heading text doesn't wrap awkwardly.
- Mobile "Add yours to the thread" CTA shows below the masonry.

- [ ] **Step 5: Stop the dev server**

Kill the dev process (`Ctrl+C` or kill the background shell).

- [ ] **Step 6: Optional final commit**

If any tweaks were necessary during verification (e.g., adjusted heights, fixed a console warning), commit them now. Otherwise this task closes with no commit.

---

## Done

After Task 5, the masonry integration is live in the section and matches the spec's acceptance criteria. Three new commits land in the branch (Tasks 1, 2, 3), plus any optional fixes from Tasks 4/5.
