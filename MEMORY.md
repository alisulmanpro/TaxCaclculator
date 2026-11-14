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
      Header.tsx      ('use client' — useState for mobile menu)
      Footer.tsx      (Server Component)
      Logo.tsx        (Server Component — SVG brand mark)
      nav.ts          (plain TS — nav array, shared by Header + Footer)
    home/
      HeroSection.tsx      (Server Component)
      QuoteSection.tsx     (Server Component)
      ArticlesSection.tsx  ('use client' — dialog state)
      FAQSection.tsx       ('use client' — accordion state)
      ResourcesSection.tsx (Server Component)
      BottomCTA.tsx        (Server Component)
    calculator/
      SalaryCalculator.tsx  ('use client')
      SalaryInsights.tsx    ('use client')
lib/
  tax.ts              (pure TS calculation engine)
  salary-history.ts   (multi-year calculation engine)
```

## Reference Folder
- Location: `h:\On-going Projects\TaxCalculato\Income Tax Calculator Homepage\`
- This is the Vite/React project extracted from the Figma ZIP export.
- **READ-ONLY** — do not modify any files inside it.
- Key reference files: `src/App.tsx`, `src/index.css`, `src/SalaryCalculator.tsx`, `src/salary-calculator.css`, `src/SalaryInsights.tsx`, `src/salary-insights.css`, `src/tax.ts`, `src/salary-history.ts`
- Old reference: `.figma-ref/` — from initial extraction, can be removed.

