# Project Memory & Architecture Context

## Project Overview
- **Name:** Pakistan Salary & Income Tax Calculator
- **Stack:** Next.js 16.4.6 (App Router, Turbopack), React 19.3.0, TypeScript, Tailwind CSS v4 + Vanilla CSS Design Tokens (`app/globals.css`).
- **Target Deployment:** Cloudflare Workers via OpenNext (`opennextjs-cloudflare`).

## Trust Indicators & Verification Dates
- **Central Storage:** Configured solely in `lib/site.ts`:
  - `site.taxRatesLastUpdated`: e.g. `"14 November 2026"` (Homepage Hero tax year update).
  - `site.officialResourcesLastReviewed`: e.g. `"14 November 2026"` (Official Resources section review indicator).
- **Integrity Rule:** Verification dates must NEVER be auto-generated at build, runtime, or deployment. They must remain static strings updated manually only when actual verification against official FBR sources has taken place.
- **Hero Presentation:** Displays `"Updated for FY 2026–2027 FBR tax slabs"` and `"Last updated: [site.taxRatesLastUpdated]"` in a subtle, non-intrusive metadata row below the lead paragraph.
- **Official Resources Presentation:** Displays `"Last reviewed: [site.officialResourcesLastReviewed]"` alongside the eyebrow badge with high WCAG AAA contrast over the `#022641` background.

## Tax Slab Tables Styling Conventions & Differentiation
The two homepage tax sections on `var(--forest)` background are intentionally differentiated to prevent a repetitive / copy-pasted look:

1. **Tax on Common Salaries, FY 2026–27 (`CommonSalariesSection.tsx`):**
   - Purpose: Quick reference financial benchmark table.
   - Layout: 4 columns (`Monthly salary`, `Tax a month`, `Take-home a month`, `Tax a year`).
   - Card / Headers: Standard white card (`.tax-card`) with mint-wash header background (`var(--mint-wash)`).
   - Rows: Clean white rows with soft green hover tint (`#fafdfb`).
   - Value Colors: Red (`#b91c1c`) for monthly and yearly tax amounts; Green (`var(--green)`) for monthly take-home pay; Dark neutral (`var(--ink)`) for monthly salary.
   - Component: 100% static Server Component.

2. **Income Tax Slabs in Pakistan (`TaxSlabsSection.tsx`):**
   - Purpose: Progressive statutory slab schedule with interactive fiscal year selector.
   - Layout: 2 columns (`Annual Taxable Income`, `Tax`).
   - Card: Control bar topbar (`.tax-card-topbar` styled with `#f8faf9` background, rounded borders, and clean select dropdown).
   - Headers: Subtle slate-tinted header (`#f3f6f4`), uppercase tracking (`letter-spacing: 0.04em`), and 2px border accent.
   - Rows: Subtle alternating zebra striping (`#ffffff` and `#fafcfb`, hover `#edf5f0`).
   - Cells: `.cell-slab-range` in bold ink, `.cell-slab-tax` in clean neutral text.
   - Component: Interactive Client Component supporting all fiscal years (`FISCAL_YEARS`).

## Section Flow on Homepage (`app/page.tsx`)
1. `<Hero><SingleYearCalculator /></Hero>`
2. `<CommonSalariesSection />`
3. `<TaxSlabsSection />`
4. `<FaqSection />`
5. `<ResourcesSection />` (Background: `#022641`)
6. `<QuranReflection />`
7. `<Footer />`

## Motion & Accessibility Rules
- Scroll animations use lightweight one-shot `ScrollObserver.tsx` (`IntersectionObserver`).
- Strictly no continuous `animation-timeline: view()` or scroll-linked opacity calculations (prevents bottom-of-screen content fading).
- Elements are revealed once and stay 100% visible permanently.
- Full support for `prefers-reduced-motion: reduce`.
