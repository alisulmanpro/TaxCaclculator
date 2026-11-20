<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Development Instructions for TaxCalculato

## Project Architecture & Tech Stack
- Framework: Next.js 16.4.6 (App Router with Turbopack, React 19.3.0)
- Styling: Tailwind CSS v4 (`@tailwindcss/turbopack`) + modular CSS variables & classes
- Typography: DM Sans loaded via Google Fonts
- Calculations: Standalone TypeScript modules in `lib/` (`tax.ts`, `salary-history.ts`)
- Client Components: Only interactive UI elements (`SalaryCalculator`, `SalaryInsights`, `ArticlesSection`, `FAQSection`, `Header`)

## Component Organization
```
app/
  components/
    layout/
      Header.tsx
      Footer.tsx
      ScrollReveal.tsx
    home/
      HeroSection.tsx
      QuoteSection.tsx
      ArticlesSection.tsx
      FAQSection.tsx
      ResourcesSection.tsx
      BottomCTA.tsx
    calculator/
      SalaryCalculator.tsx
      SingleYearCalculator.tsx
      MultiYearCalculator.tsx
      SalaryInsights.tsx
      calculator.css
    multi-year/
      MultiYearHeroSection.tsx
      MultiYearFAQSection.tsx
  multi-year-calculator/
    page.tsx
lib/
  tax.ts
  salary-history.ts
```

## Routes Architecture
- `/`: Main homepage with Single Year Calculator UI (Multi-Year tab navigates to `/multi-year-calculator`).
- `/multi-year-calculator`: Dedicated Multi-Year Calculator page with Multi-Year Calculator UI (Single Year tab navigates back to `/#calculator`), dedicated Multi-Year FAQ accordion, official resources, and consultation CTA.
- Calculation engine: `lib/tax.ts` (supports FY 2020-21 through 2026-27 with benchmark verification) and `lib/salary-history.ts` (multi-period proration, bonus month mapping, FBR boundary validation).

## Calculator Behavioral & Visibility Rules
- **Initial Salary State**: Both calculators start with an empty salary input (`salary: ""`). No hardcoded or fake salaries.
  - Single Year Placeholder: `"Enter your Salary"`.
  - Multi-Year Placeholder: `"Enter your monthly salary"`.
- **Single Year Visibility**:
  - Initially shows ONLY inputs; calculated results (Hero card, Breakdown cards, Comparison strip, Stat tiles, Insights) are completely hidden until a valid positive salary is entered.
  - Insights are HIDDEN by default (`insightsOpen: false`).
  - "Show Insights" button reveals full-width insights section below the 2 columns; button toggles to "Hide Insights" without clearing inputs.
- **Multi-Year Visibility**:
  - Starts with exactly ONE empty period.
  - Calculation does NOT run automatically. Requires clicking "Calculate Taxes →".
  - Results are hidden until calculation.
  - Insights are VISIBLE by default after calculation; user can click "Hide insights" to collapse only the insights portion while keeping primary results visible.
  - Modifying any period input after calculation immediately marks results as stale/outdated and hides them until "Calculate Taxes →" is clicked again.
- **Interactive Monthly Cash Flow Chart**:
  - Uses actual monthly values (Gross, Tax, Net Take-Home).
  - Hover/tap interactivity showing dynamic tooltip with category label, formatted PKR amount, and % of gross income.
- **Fiscal Comparison & Tax Bands Layout**:
  - Full-width insights section (`calc-insights-section`) prevents container blowout.
  - Tables wrapped in `.calc-table-wrap` with horizontal scrolling fallback on mobile, preventing page-wide horizontal scroll.

## Styling Rules
- Exact match to Figma export reference.
- Theme color emerald-600 (`#008857`) and primary dark green background (`#0f3d2e`).
- DM Sans font family with font weights from 400 to 750.
- Preserved responsive media queries matching breakpoint thresholds (1050px, 760px, 540px, 480px, 360px).

## Security Requirements
- Safe input sanitization, bounds checking for numeric fields (0 to Rs. 1,000,000,000).
- Strict HTTP security headers configured in `next.config.ts` (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy).
- No external unverified scripts or sensitive key leakages; client-only calculation privacy.
- Rel attributes for external links (`target="_blank" rel="noreferrer noopener"`).

## Technical SEO Requirements
- Metadata configured in `app/layout.tsx` (Open Graph, Twitter Card, title, description).
- Structured JSON-LD Data for WebSite & WebPage schema.
- Accessible heading hierarchy (H1 in Hero, H2 for major sections, H3 for cards/faqs).
- Robots.txt (`app/robots.ts`) and Sitemap (`app/sitemap.ts`).

## Development and Verification Commands
- Type check: `node node_modules/typescript/bin/tsc --noEmit`
- Next.js Build: `node node_modules/next/dist/bin/next build`
- Dev Server: `node node_modules/next/dist/bin/next dev`

- Formatting unit tests: `node --experimental-strip-types tests/format.test.ts`

## Numeric Input Formatting Rules
- All salary and financial amount input fields must use thousands separator formatting live as user types via `lib/format.ts`.
- Values are parsed to clean numeric numbers before calculation; calculations never receive raw formatted strings.
- Cursor positions are preserved during live typing and editing via `calculateNewCursor` and `requestAnimationFrame`.
- Empty input state (`""`) is preserved and never converted into zero.
- Reset must clear all formatted salary and amount fields completely.
