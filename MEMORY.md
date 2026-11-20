# Project Memory & Knowledge Base: TaxCalculato

## Project Overview
Single-page Pakistan Salary & Income Tax Calculator website recreated faithfully in Next.js 16 (App Router) based on the latest Figma export design.

## Core Design Decisions
- **Visual Accuracy**: Maintained exact Figma styling including dark green backdrop (`#0f3d2e`), crisp typography using DM Sans, bespoke cards, subtle borders (`#c4d2c2`), and custom interactive widgets.
- **Single-Page Scope**: All components rendered on the main homepage (`app/page.tsx`) without extra routes or pages.
- **Interactive Islands**:
  - `Header`: Mobile dropdown drawer navigation, accessible toggle button, desktop horizontal links.
  - `HeroSection`: Houses the main H1 and the `SalaryCalculator`.
  - `SalaryCalculator`: Tabbed interface for "Single Year" and "Multi-Year" calculation, comparison with previous fiscal years, and toggleable "Salary Insights".
  - `SalaryInsights`: 3 sub-tabs ("Overview", "Fiscal year comparison", "Tax bands"), reactive cash flow chart, Rs. 100 retention bar, and detailed rate tables.
  - `QuoteSection`: Atmospheric quote callout with large background quotation marks.
  - `ArticlesSection`: 3 curated tax guide cards with modal reader dialogs (`<dialog>` HTML element with backdrop blur).
  - `FAQSection`: Accessible accordion with rotate indicator and aria-expanded attributes.
  - `ResourcesSection`: Links to official FBR, Iris, and Pakistan Code portals.
  - `BottomCTA`: Direct consultation action prompt.
  - `Footer`: Semantic footer with copyright, navigation links, disclaimer, and back-to-calculator anchor.

## Calculation Engine
- **Tax Rules**: Supports Pakistan Finance Act fiscal years 2024–25, 2025–26, and 2026–27.
- **Surcharges**: Surcharge of 10% (FY24) and 9% (FY25) on income over Rs. 10M; 0% surcharge for FY26.
- **Multi-Year History**: Handles fractional year intervals, custom salary periods, recurring monthly allowances/deductions, and one-off bonuses (either fixed amount or multiple of salary) mapped to their specific payout months.
- **Privacy**: 100% in-browser client calculation without transmitting user financial data.

## Known Solutions & Conventions
- Run Node directly (`node node_modules/...`) to avoid PowerShell execution policy blocks for global wrappers on Windows.
- Next.js 16 Turbopack handles `@tailwindcss/turbopack` CSS loading without requiring external PostCSS files.
- **tsconfig.json `exclude`** must list `"Income Tax Calculator Homepage"` and `".figma-ref"` to prevent TypeScript from scanning the reference folder (which has Vite-specific dependencies not installed in Next.js).
- `allowImportingTsExtensions: true` required in `tsconfig.json` because `lib/salary-history.ts` imports `lib/tax.ts` with its `.ts` extension (required for Node.js ESM test runner with `--experimental-strip-types`).
- `"type": "module"` in `package.json` required for Node.js ESM test runner to find `salary-history.test.ts` without `MODULE_TYPELESS_PACKAGE_JSON` warning.
- **Never use `new Date()`** in server components under Next.js 16 `cacheComponents: true` — it causes a prerender crash. Hardcode year values instead.
- **Never export non-component values** (arrays, constants) from `'use client'` files consumed by server components — it triggers serialization errors. Keep them in plain `.ts` files.
- The reference folder `Income Tax Calculator Homepage/` is a Vite project — do NOT copy its `vite.config.ts`, `tsconfig.json`, or `package.json` into the Next.js project.
- **Turbopack Preflight Reset**: In Next.js 16 App Router, `@tailwindcss/turbopack` does not automatically emit the full CSS box-sizing and body margin resets. Explicitly declare `*, *::before, *::after { box-sizing: border-box; }`, `body { margin: 0; padding: 0; overflow-x: clip; }`, and `button { background: transparent; border: 0; padding: 0; font: inherit; color: inherit; }` in `@layer base` in `app/globals.css`. Without this, `body` inherits browser default 8px margin (causing header gap and horizontal overflow), and `width: 100%` elements calculate with `content-box`.
- **Do not apply `100vw` or `max-w-screen` to `<body>` or `<html>`**: `100vw` includes scrollbar width and causes horizontal overflow.
- **Use standard `<img>` in `ArticlesSection.tsx`**: Next.js `<Image>` generates internal wrappers and inline styles that conflict with custom aspect ratio, `.article-image-button img` hover transforms, and dialog cropping. Standard `<img>` preserves pixel-perfect Figma styling.
- **FAQ Accordion Spacing & Row Height**:
  - **Root Cause of Excessive Height**: In Tailwind v4 / Turbopack, browser user-agent stylesheets apply default margins (`margin-block-start: 1em; margin-block-end: 1em;` ~32px total) to `<h3>` elements unless explicitly reset. Because each FAQ trigger was wrapped in `<h3><button>...</button></h3>` without a `.faq-item h3` reset rule, an invisible ~192px of default browser margin was injected across the 6 items, ballooning row heights to ~90px regardless of inner button padding.
  - **The Fix**: Explicitly reset `.faq-item h3 { margin: 0; padding: 0; font-size: inherit; font-weight: inherit; line-height: inherit; }` and `.faq-item p { margin: 0; }` in both `FAQSection.tsx` and `app/globals.css`.
  - **Dimensions**: Set `.faq-item h3 > button { padding: 18px 0; min-height: 58px; }` (collapsed row height: ~58px, exactly within the 56–64px target), `.faq-item.expanded h3 > button { padding: 18px 0 10px; }`, `.faq-item p { padding: 0 28px 18px 0; line-height: 1.75; }`, and `.faq-list { padding: 4px 24px; }`.
  - Both collapsed and expanded states are visually balanced, vertically centered with the plus/close icon, and the accordion container height aligns proportionally with the left-side FAQ intro section.

## CSS Architecture
- All CSS lives in `app/globals.css` (~3,045 lines). It merges all three reference CSS files:
  1. `src/index.css` → base layout, typography, header, hero, quote, articles, FAQ, resources, CTA, footer
  2. `src/salary-calculator.css` → SalaryCalculator component styles
  3. `src/salary-insights.css` → SalaryInsights component styles
- DM Sans font is imported via `@import url("https://fonts.googleapis.com/css2?family=DM+Sans:...")` at the top of `globals.css` (not via Next.js `next/font`).
- Components use **original CSS class names** (`.salary-tool`, `.hero-centered`, etc.) — NOT Tailwind utility classes in JSX.
- Tailwind CSS v4 is loaded via `@import "tailwindcss"` in `globals.css` and uses `@tailwindcss/turbopack` loader.

## Component Architecture
```
app/
  components/
    layout/
      Header.tsx             ('use client' — useState for mobile menu)
      Footer.tsx             (Server Component)
      Logo.tsx               (Server Component — SVG brand mark)
      nav.ts                 (plain TS — nav array, shared by Header + Footer)
      ScrollReveal.tsx       ('use client' — IntersectionObserver reveal)
    home/
      HeroSection.tsx        (Server Component)
      QuoteSection.tsx       (Server Component)
      ArticlesSection.tsx    ('use client' — dialog state)
      FAQSection.tsx         ('use client' — accordion state)
      ResourcesSection.tsx   (Server Component)
      BottomCTA.tsx          (Server Component)
    calculator/
      SalaryCalculator.tsx      ('use client' — backward-compatible wrapper for HeroSection)
      SingleYearCalculator.tsx  ('use client' — new Figma Single Year UI & insights)
      MultiYearCalculator.tsx   ('use client' — new Figma Multi-Year salary history UI)
      SalaryInsights.tsx        ('use client' — legacy insights component retained)
      calculator.css            (Modular CSS styling for Single & Multi-Year calculators)
    multi-year/
      MultiYearHeroSection.tsx  (Server Component — dedicated hero for multi-year page)
      MultiYearFAQSection.tsx   ('use client' — 6 dedicated Multi-Year FAQ items)
  multi-year-calculator/
    page.tsx                 (Dedicated Multi-Year Calculator page)
lib/
  tax.ts                     (pure TS calculation engine, FY 2020-21 through 2026-27)
  salary-history.ts          (multi-year calculation engine with proration & bonus mapping)
```

## Routes Architecture & Navigation
- **Homepage (`/`)**: Hosts the Single Year Calculator. Clicking the "Multi-Year" tab seamlessly links to `/multi-year-calculator`.
- **Multi-Year Page (`/multi-year-calculator`)**: Hosts the dedicated Multi-Year Calculator. Clicking the "Single Year" tab navigates back to `/#calculator`. Also features dedicated Multi-Year FAQs, official resources, and consultation CTA.
- Header and Footer are centrally mounted in `app/layout.tsx` and automatically serve both routes without duplication.

## New Calculator Design Tokens & Reference
- References: `design.md` and `TaxCalculato.com – Single Year and Multi-Year.html`.
- Colors:
  - Forest / Hero: `#0F3D2E`
  - Cream / Page Background: `#F6F4EE`
  - Mint / Card Accent: `#E3F5EC`
  - Tax Accent / Contrast: `#C4705A` / `#A3452E`
  - Card & Tile Borders: `#DDE3DF` / `#AEB9B2`
  - Accent Green: `#08794D` / `#008857`
- Typography: DM Sans with weights 400 to 750.
- Layout width: 1040px max width centered container (`.calc-card`).

## Calculator Behavioral State Rules
- **Initial Salary State**:
  - Single Year: Initial `salary: ""` (empty). Placeholder: `"Enter your Salary"`.
  - Multi-Year: Initial 1 empty period with `salary: ""` (empty). Placeholder: `"Enter your monthly salary"`.
- **Results Visibility**:
  - Single Year: Hidden until user enters valid positive salary (`monthlySalary > 0 && !isAboveMax`). When hidden, `.calc-body.no-results` centers the input details column.
  - Multi-Year: Hidden until user clicks "Calculate Taxes →". Editing period inputs immediately invalidates stale results.
- **Insights Visibility**:
  - Single Year: Hidden by default (`insightsOpen: false`). "Show Insights" reveals full-width section spanning both columns; toggles to "Hide Insights".
  - Multi-Year: Visible by default after calculation (`insightsOpen: true`). User can click "Hide insights" to collapse only the insights section while keeping hero and gross/net cards visible.
- **Chart Interactivity**:
  - Monthly Cash Flow chart displays actual monthly PKR amounts for Gross, Tax, and Net.
  - Interactive tooltip displays category name, exact PKR amount (`currency()`), and % of gross income on hover/tap.
- **Layout Overflow Constraints**:
  - Full-width insights section (`calc-insights-section: grid-column: 1 / -1`) prevents column squeezing and container blowout.
  - All tables wrapped in `.calc-table-wrap` with horizontal scroll capability, preventing page-wide scroll.
  - Headers configured with `white-space: normal; line-height: 1.35;` to prevent header text from expanding table width artificially.

## Reference Folder
- Location: `h:\On-going Projects\TaxCalculato\Income Tax Calculator Homepage\`
- This is the Vite/React project extracted from the Figma ZIP export.
- **READ-ONLY** — do not modify any files inside it.
- Key reference files: `src/App.tsx`, `src/index.css`, `src/SalaryCalculator.tsx`, `src/salary-calculator.css`, `src/SalaryInsights.tsx`, `src/salary-insights.css`, `src/tax.ts`, `src/salary-history.ts`
- New reference files: `design.md` and `TaxCalculato.com – Single Year and Multi-Year.html` in project root.


## Multi-Year Calculator Reset & Layout Fixes
- **Factory Function Pattern**: `createDefaultPeriods()` produces fresh object and array references on initial state and on reset. This prevents reference sharing or stale state mutation issues during Reset actions.
- **Layout Grid Sizing**: `.calc-body` uses `grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)` (with `1fr` at max-width: 720px) rather than `repeat(auto-fit, minmax(320px, 1fr))`, ensuring that the 2-column layout shrinks flexibly without overflowing the calculator container on mid-width viewports.


## Results Overflow & Live Number Formatting (Phase 17)
- **Multi-Year Results Overflow Root Causes & Fix**:
  - Global `min-width: 500px` on `.calc-table` caused the 4-column Multi-Year table inside the ~472px right-hand column to blow out parent layout. Scoped `min-width: 500px` to `.calc-insights-section .calc-table`, while `.calc-col .calc-table` uses `width: 100%; min-width: 100%;` with compact padding.
  - Added `min-width: 0; width: 100%; max-width: 100%; box-sizing: border-box;` on all result containers (`.calc-col`, `.calc-result-col`, `.calc-hero-card`, `.calc-mint-card`, `.calc-tile`, `.calc-tile-result`).
  - Added `word-break: break-word; overflow-wrap: anywhere;` to `.calc-hero-val` and `.calc-stat-val` to prevent large currency numbers (e.g., Rs. 50,000,000) from forcing container width expansion.
  - Set `@media (max-width: 900px)` on `.calc-body` to stack columns naturally on tablet and mobile viewports, while preserving 2-column desktop balance.
- **Live Comma Number Formatting (`lib/format.ts`)**:
  - Uses `formatWithCommas()` to format numbers with thousands separators live as the user types (e.g. 1000 → 1,000, 1000000 → 1,000,000).
  - Uses `cleanNumber()` to strip commas before calculation, preventing `NaN` and preserving mathematical precision.
  - Tracks non-comma characters before cursor in `calculateNewCursor()` and updates selection via `requestAnimationFrame`, preventing cursor jumping during typing, editing in the middle, or pasting.
  - Handles Backspace across commas in `handleFormattedInputKeyDown()` to prevent cursor trapping.
  - Allows empty input without forcing zero; Reset clears all formatted inputs completely.
