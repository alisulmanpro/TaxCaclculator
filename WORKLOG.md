# Worklog - TaxCalculato Implementation

## Phase 1: Project & Reference Inspection
- Inspected existing Next.js project structure, package.json (Next.js 16.4.6, React 19.3.0, Tailwind CSS 4.3.3).
- Inspected the reference Figma export archive `Income Tax Calculator Homepage.zip`.
- Extracted reference to temporary reference directory `.figma-ref/`.
- Thoroughly analyzed reference files:
  - `src/App.tsx`, `src/index.css`
  - `src/SalaryCalculator.tsx`, `src/salary-calculator.css`
  - `src/SalaryInsights.tsx`, `src/salary-insights.css`
  - `src/tax.ts`, `src/salary-history.ts`
  - `public/images/` and assets

## Phase 2: Asset Migration
- Copied image assets (`tax-planning.jpg`, `calculator.jpg`, `filing.jpg`, `justice.jpg`) into `public/images/`.
- Copied `favicon.png` into `public/`.

## Phase 3: Core Logic & Module Setup
- Created `lib/tax.ts` replicating Pakistan tax rules, brackets, progressive rates, and surcharge calculations for FY 2024–25 through 2026–27.
- Created `lib/salary-history.ts` supporting multi-period salary calculation, date validation (01 Jul 2024 to 30 Jun 2027), bonus month mapping, and take-home deductions.

## Phase 4: UI Component Architecture
- Created `app/components/layout/Header.tsx` (header brand, nav links, consultation button, responsive drawer).
- Created `app/components/layout/Footer.tsx` (brand, quick links, copyright, legal disclaimer).
- Created `app/components/calculator/SalaryCalculator.tsx` (Single-Year & Multi-Year modes, real-time comparisons, breakdown cards, accessible keyboard navigation).
- Created `app/components/calculator/SalaryInsights.tsx` (Overview cashflow chart, Rs. 100 retention bar, FY comparison grid, progressive tax bands table).
- Created `app/components/home/HeroSection.tsx` (eyebrow, typography, calculator region).
- Created `app/components/home/QuoteSection.tsx` (curated quote and design element).
- Created `app/components/home/ArticlesSection.tsx` (guides cards with modal reader dialogs).
- Created `app/components/home/FAQSection.tsx` (accordion with full accessibility).
- Created `app/components/home/ResourcesSection.tsx` (verified official government resource cards).
- Created `app/components/home/BottomCTA.tsx` (consultation banner).

## Phase 5: Homepage Page & Layout Assembly
- Replaced `app/page.tsx` with all 6 home sections in precise sequential order.
- Updated `app/layout.tsx` with complete SEO metadata, Open Graph, Twitter cards, and JSON-LD structured data schema.
- Integrated complete CSS system into `app/globals.css` including DM Sans font import, Tailwind CSS v4 variables, full desktop, laptop, tablet, and mobile breakpoints (3,067 lines).
- Created `app/sitemap.ts` and `app/robots.ts`.
- Configured security headers in `next.config.ts`.

## Phase 6: Testing & Quality Assurance
- Executed TypeScript check (`node node_modules/typescript/bin/tsc --noEmit`): **Passed with 0 errors**.
- Triggered Next.js production build (`node node_modules/next/dist/bin/next build`): **Build SUCCESS (exit 0)**.
- All 4 routes prerendered as static content: `/`, `/_not-found`, `/robots.txt`, `/sitemap.xml`.

### Bugs Discovered & Fixed During Phase 6
| Error | Root Cause | Fix |
|-------|------------|-----|
| Turbopack CSS panic | `turbopack.rules` in `next.config.ts` caused `@tailwindcss/turbopack` to panic | Removed entire `turbopack` key |
| `nav.map is not a function` on `/_not-found` | Exporting `nav` array from `'use client'` Header (used by server Footer) | Moved `nav` to `nav.ts`, Logo to `Logo.tsx` |
| `new Date()` prerender error | Next.js 16 `cacheComponents: true` forbids `new Date()` in server components | Hardcoded `"2026"` in Footer; hardcoded ISO string in sitemap |
| EPERM mkdir on `/_not-found` | Stale `.next` dir lock | Re-ran the build; transient issue |
| `@theme` unknown at rule warning | Turbopack/PostCSS doesn't recognize Tailwind v4 `@theme` | Removed `@theme` block; not needed |

## Phase 7: Module Resolution Fix (Session 2)
- **Problem:** `tsc --noEmit` was failing with TS5097 on `.ts` extension imports in `lib/salary-history.ts` and `tests/salary-history.test.ts`.
- **Root cause:** `tsconfig.json` uses `moduleResolution: bundler` without `allowImportingTsExtensions: true`. Meanwhile, the Node.js ESM test runner requires `.ts` extensions.
- **Fix applied:**
  1. Added `"allowImportingTsExtensions": true` to `tsconfig.json`.
  2. Added `"type": "module"` to `package.json` (eliminates `MODULE_TYPELESS_PACKAGE_JSON` warning).
  3. Restored `.ts` extensions in `lib/salary-history.ts` and `tests/salary-history.test.ts`.
- **Verification:**
  - `tsc --noEmit` → **0 errors** ✅
  - `node --experimental-strip-types tests/tax.test.mjs` → **8/8 passed, 0 warnings** ✅
  - `node --experimental-strip-types tests/salary-history.test.ts` → **12/12 passed, 0 warnings** ✅
  - `node node_modules/next/dist/bin/next build` (Turbopack) → **exit 0** ✅

## Phase 8: Reference Re-verification & tsconfig Fix (Session 3)

### TypeScript Scope Fix
- **Problem:** `tsc --noEmit` was picking up `Income Tax Calculator Homepage/vite.config.ts` from the reference folder and reporting 25+ errors (missing `vite`, `@vitejs/plugin-react` modules, implicit `any` types).
- **Root cause:** `tsconfig.json` `exclude` only listed `node_modules`; the reference folder was inside the project root so it was picked up by the `**/*.ts` glob.
- **Fix:** Added `"Income Tax Calculator Homepage"` and `".figma-ref"` to the `exclude` array in `tsconfig.json`.
- **Verification:** `tsc --noEmit` → **0 errors** ✅

### Full QA Results (Session 3)
| Check | Result |
|-------|--------|
| `tsc --noEmit` | ✅ 0 errors |
| `node --experimental-strip-types tests/tax.test.mjs` | ✅ 8/8 passed |
| `node --experimental-strip-types tests/salary-history.test.ts` | ✅ 12/12 passed |
| `node node_modules/next/dist/bin/next build` | ✅ exit 0, 4 routes prerendered |
| Dev server | ✅ Running at `http://localhost:3000` (PID 1720) |

### Reference Component Cross-Check (Session 3)
All components verified against `Income Tax Calculator Homepage/src/App.tsx`:

| Component | Match Status |
|-----------|-------------|
| `Header.tsx` | ✅ Exact match |
| `Footer.tsx` | ✅ Exact match (copyright hardcoded to 2026) |
| `Logo.tsx` | ✅ Exact match |
| `nav.ts` | ✅ Exact match |
| `HeroSection.tsx` | ✅ Exact match |
| `QuoteSection.tsx` | ✅ Exact match |
| `ArticlesSection.tsx` | ✅ Exact match (uses Next.js `<Image>` with identical classes) |
| `FAQSection.tsx` | ✅ Exact match (openFaq initial=0) |
| `ResourcesSection.tsx` | ✅ Exact match (added `noopener` per security rules) |
| `BottomCTA.tsx` | ✅ Exact match |
| `SalaryCalculator.tsx` | ✅ Identical to reference (confirmed) |
| `SalaryInsights.tsx` | ✅ Identical to reference (confirmed) |
| `lib/tax.ts` | ✅ Identical to reference |
| `lib/salary-history.ts` | ✅ Identical to reference (`.ts` extension on import) |
| `globals.css` (3,045 lines) | ✅ All 3 reference CSS files merged |

## Phase 9: Targeted 5-Section UI Fixes (Session 4)

### 1. Root Cause Analysis & Base Preflight Fix
- **Identified Root Cause:** Turbopack in Next.js 16 did not emit full Tailwind CSS preflight defaults.
  - Browser default `body { margin: 8px; }` caused an 8px perimeter gap around the white header, pushing the navbar down and creating a green gap above and beside it.
  - Absence of global `*, *::before, *::after { box-sizing: border-box; }` caused elements with `width: 100%` and padding (e.g. `.header.container`, `.salary-tool input`, `.article-card`, `.faq-list`) to compute with `content-box`, adding padding to width and causing horizontal overflow beyond the viewport.
  - Conflicting utility classes on `<html>` (`h-full`) and `<body>` (`min-h-full max-w-screen flex flex-col`) in `app/layout.tsx` forced `max-width: 100vw`, which included vertical scrollbar width and triggered horizontal scrolling.
  - Native browser button styles affected unstyled `<button>` tags (FAQ accordion triggers, calculator tabs, image buttons).

### 2. Implementation of Targeted Fixes
- **Issue 1 (Salary Calculator):**
  - Restored `box-sizing: border-box` so all `width: 100%` inputs, select fields, breakdown cards, and comparison cards compute their padding within their column boundaries.
  - Reset button defaults (`background: transparent; border: 0; padding: 0;`) so `.salary-tabs` buttons and action links render cleanly.
  - Verified exact match of `SalaryCalculator.tsx` and `SalaryInsights.tsx` against Figma source.
- **Issue 2 (Body Background & Horizontal Overflow):**
  - Removed `h-full`, `max-w-screen`, and `flex flex-col` from `app/layout.tsx`.
  - Added explicit `margin: 0; padding: 0; overflow-x: clip;` to `body` in `app/globals.css`.
  - Background `#0f3d2e` now extends cleanly to 100% of viewport width without horizontal scrollbars at 1440px, 1280px, 768px, and 390px.
- **Issue 3 (Navbar & Top Header Alignment):**
  - Removed top margin on body so `.header` aligns flush with the top of the viewport (`top: 0`).
  - Added `position: relative` to `.header` so that mobile dropdown `.navigation.is-open` aligns accurately below the header.
  - Full-width white background spanning 100% of the viewport width.
- **Issue 4 (Articles Section Cards):**
  - Replaced Next.js `<Image>` component with native `<img>` elements in `ArticlesSection.tsx` to match Figma export DOM and CSS rules (`.article-image-button img` hover scale and aspect ratio).
  - Preserved 3-card grid layout and modal reader dialog.
- **Issue 5 (FAQ Section — Highest Priority):**
  - Restored 2-column grid layout (`0.8fr 1.3fr`) with left-side intro and right-side FAQ accordion container.
  - Fixed accordion button resetting so questions display without browser default button styling, borders, or backgrounds.
  - Accurate question dimensions, rotate indicator (`transform: rotate(45deg)` on expanded), answer panel typography, and border separators.
  - Preserved typography, curly apostrophes, and full accessibility attributes (`aria-expanded`, `aria-controls`, `hidden`).

### 3. Verification Results
| Check | Result |
|-------|--------|
| `tsc --noEmit` | ✅ 0 errors |
| `tests/tax.test.mjs` | ✅ 8/8 passed |
| `tests/salary-history.test.ts` | ✅ 12/12 passed |
| `next build` (Turbopack) | ✅ exit 0, all static routes prerendered |
| Local server check | ✅ HTTP 200, clean HTML and compiled CSS |

## Phase 10: FAQ Section Spacing & Compactness Correction (Session 5)

### Problem Addressed
- The vertical gaps between FAQ question items were too tall, causing the right-hand accordion container to exceed the visual height of the left-hand intro section.
- Unnecessary vertical padding (`21px 0` on every question trigger) contributed ~252px of blank button padding alone across 6 questions.

### Changes Implemented
1. **Reduced question row padding:** Adjusted `.faq-item h3 > button` padding from `21px 0` down to `13px 0`, eliminating excessive gaps while maintaining comfortable tap targets.
2. **Refined expanded question spacing:** Added `.faq-item.expanded h3 > button` padding of `13px 0 8px` to bring the active question cleanly close to its answer.
3. **Optimized answer panel padding:** Reduced `.faq-item p` padding from `0 28px 23px 0` to `0 28px 14px 0` for a compact, balanced reading flow.
4. **Tightened container padding:** Reduced `.faq-list` top/bottom padding from `8px 24px` to `6px 24px`.
5. **Mobile & tablet responsive adjustments:**
   - At `<= 760px`: Adjusted question button padding to `11px 0` (`11px 0 7px` expanded) and answer padding to `0 20px 12px 0`.
   - At `<= 480px`: Adjusted question button padding to `11px 0` (`11px 0 7px` expanded) and answer padding to `0 16px 12px 0`.
6. **Implementation Location:** Applied scoped adjustments in `app/components/home/FAQSection.tsx` and in `app/globals.css` under the FAQ section without modifying any global, layout, or calculator styles.
7. **Preservation:** Maintained all original border separators (`#e6e8e1`), accordion container background (`#f7f8f5`), rotate indicator (`transform: rotate(45deg)` on expanded), emerald active color (`#008857`), accessibility attributes, and content typography.

### Verification Results
| Check | Result |
|-------|--------|
| `tsc --noEmit` | ✅ 0 errors |
| `tests/tax.test.mjs` | ✅ 8/8 passed |
| `tests/salary-history.test.ts` | ✅ 12/12 passed |
| `next build` (Turbopack) | ✅ exit 0, all 4 static routes prerendered |
| Dev server check (`localhost:3000`) | ✅ HTTP 200, compact FAQ spacing verified in rendered HTML |

## Phase 11: FAQ Accordion Excessive Height & Heading Margin Reset Fix (Session 6)

### 1. Root Cause Analysis
- **Problem Reported:** The FAQ accordion questions remained excessively tall and the container appeared stretched even after previous button padding adjustments.
- **Underlying Root Cause Discovered:**
  - In `app/globals.css`, sections like `.form-title h3`, `.article-card h3`, and `.salary-tool h3` had explicit `margin: 0` resets.
  - The FAQ section lacked any `.faq-item h3` rule.
  - User-agent default stylesheet applied `margin-block-start: 1em` and `margin-block-end: 1em` (~16px top + 16px bottom = **32px per question**) directly onto the `<h3>` wrapper around each button. Across 6 FAQ items, this added ~192px of unwanted vertical space that was completely immune to button padding reductions.
  - `<p>` inside the answer panel similarly had unreset browser margins.

### 2. Solutions Applied
1. **Explicit `<h3>` and `<p>` Margin Resets:**
   - Added `.faq-item h3 { margin: 0 !important; padding: 0 !important; font-size: inherit; font-weight: inherit; line-height: inherit; }` in both `FAQSection.tsx` and `app/globals.css`.
   - Added `.faq-item p { margin: 0 !important; }` to prevent answer paragraph margin leakage.
2. **Standardized Collapsed Row Dimensions:**
   - Configured `.faq-item h3 > button` with `padding: 18px 0 !important; min-height: 58px; font-size: 13px; font-weight: 500; line-height: 1.4; display: flex; align-items: center; justify-content: space-between;`.
   - Resulting collapsed row height: 18px (top) + ~18px (text) + 18px (bottom) + 1px border = **~55–59px**, exactly within the user-requested **56–64px** target.
3. **Vertically Centered Elements:**
   - Question text and the 23×23px plus/close icon span are strictly centered vertically via `align-items: center`.
4. **Refined Expanded & Answer Dimensions:**
   - `.faq-item.expanded h3 > button`: `padding: 18px 0 10px !important; color: #008857;` with smooth 45deg rotation on plus icon.
   - `.faq-item p`: `font-size: 12px; line-height: 1.75; color: #8c9383; padding: 0 28px 18px 0 !important;`.
   - `.faq-list`: `padding: 4px 24px; border-radius: 16px; background: #f7f8f5;`.
5. **Responsive Consistency:**
   - `<= 760px`: `min-height: 52px; padding: 15px 0; font-size: 11px;`
   - `<= 480px`: `min-height: 52px; padding: 15px 0; font-size: 12px;`

### 3. Full Verification Results
| Check | Result |
|-------|--------|
| `tsc --noEmit` | ✅ 0 errors |
| `tests/tax.test.mjs` | ✅ 8/8 passed |
| `tests/salary-history.test.ts` | ✅ 12/12 passed |
| `next build` (Turbopack) | ✅ exit 0, all static routes prerendered |
| Hot Reload / Dev Server | ✅ Active at `http://localhost:3000` (PID 12856) |

## Current Status
- ✅ **FAQ accordion spacing & height fully resolved and verified.**
- ✅ **All QA gates passing:** TypeScript (0 errors), unit tests (20/20), production build (exit 0).
- ✅ **Dev server** running at `http://localhost:3000`.

## Phase 12: Subtle Premium Animations (Session 7)

### Overview
Added lightweight CSS/IntersectionObserver animations throughout the homepage without changing any layout, colors, spacing, typography, or calculator logic.

### New Files
- `app/components/layout/ScrollReveal.tsx` — Reusable `'use client'` wrapper using `IntersectionObserver`. Adds `.reveal-on-scroll` class (opacity 0, translateY 13px), fires `.reveal-visible` once per element as it enters the viewport. Includes `prefers-reduced-motion` and no-JS (`@media scripting: none`) fallbacks.

### Modified Files

#### `app/page.tsx`
- Imported `ScrollReveal`.
- Wrapped all sections below the hero (`QuoteSection`, `ArticlesSection`, `FAQSection`, `ResourcesSection`, `BottomCTA`) in `<ScrollReveal>`.

#### `app/components/home/HeroSection.tsx`
- Added `hero-anim hero-anim-N` classes to each hero element for staggered CSS entrance animations:
  - Eyebrow: `hero-anim-1` — fade-in, 500ms, 80ms delay
  - H1: `hero-anim-2` — fade-up, 600ms, 200ms delay
  - Paragraph: `hero-anim-3` — fade-up, 550ms, 340ms delay
  - Calculator container: `hero-anim-4` — fade-up, 600ms, 460ms delay

#### `app/components/home/FAQSection.tsx`
- Replaced `hidden` attribute (instant show/hide) with CSS grid-row transition (`grid-template-rows: 0fr → 1fr`).
- Added inner `.faq-answer-inner { overflow: hidden }` wrapper for the grid trick to work correctly.
- Smooth 320ms `cubic-bezier(0.4, 0, 0.2, 1)` expand/collapse on every answer panel.
- Icon rotation transition upgraded to `0.3s cubic-bezier(0.4, 0, 0.2, 1)`.
- Icon span now transitions background and color on expand (`#e8f5ed` / `#008857`).
- Button color transition: `0.22s ease`.
- Preserved all ARIA attributes (`aria-expanded`, `aria-controls`, `aria-hidden`).

#### `app/globals.css` — `/* ===================== Animations ===================== */` block added before Responsive section
- `@keyframes hero-fade-up` and `@keyframes hero-fade-in`.
- `.hero-anim`, `.hero-anim-1` through `.hero-anim-4` — staggered entrance classes, `animation-fill-mode: both`.
- `.reveal-on-scroll` / `.reveal-on-scroll.reveal-visible` — scroll-reveal base styles.
- `@media (scripting: none)` — no-JS fallback shows content immediately.
- `@media (prefers-reduced-motion: reduce)` — disables all animation/transition for accessibility.
- Article card: `transition: transform 0.22s ease, box-shadow 0.22s ease`; hover: `-3px lift, shadow`.
- Article image: scale reduced from 1.05 → 1.02; transition tightened to 0.25s.
- Article diagonal icon: subtle `translate(2px, -2px)` on card hover.
- Resource card: `transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease`; hover: `-3px lift, shadow`.
- `.button`: `transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease`; hover adds `box-shadow`.
- `.button-black:hover` → `#2a2e28` (subtle darkening).
- `.text-link svg` → `transition: transform 0.2s ease`; hover nudges arrow `+3px`.
- `.navigation a` → underline pseudo-element that expands `width: 0 → 100%` on hover.

### Performance notes
- All animations use `transform` and `opacity` only (compositor-layer properties; no layout triggers).
- No continuous/infinite animations.
- No animation library dependencies added.
- IntersectionObserver fires once per element (`observer.unobserve(el)` immediately after).

### Verification Results
| Check | Result |
|-------|--------|
| `tsc --noEmit` | ✅ 0 errors |
| `tests/tax.test.mjs` | ✅ 8/8 passed |
| `tests/salary-history.test.ts` | ✅ 12/12 passed |
| `next build` (Turbopack) | ✅ exit 0, 4 static routes prerendered |
| Dev server | ✅ Running at `http://localhost:3000` |
