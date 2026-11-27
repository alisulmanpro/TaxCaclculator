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
5. `<ExploreCalculatorsSection />` (Inline Explore Calculators section)
6. `<ResourcesSection />` (Background: `#022641`)
7. `<QuranReflection />` (Surah Ibrahim 14:7)
8. `<Footer />`

## Section Flow on Multi-Year Calculator Page (`app/multi-year-calculator/page.tsx`)
1. `<Hero><MultiYearCalculator /></Hero>`
2. `<CalculationMethodSection />` (Tagline: `"CALCULATION METHOD"`, 3 step cards: `01` Split Each Period at 30 June, `02` Count the Days Worked, `03` Calculate Tax for Each Fiscal Year).
3. `<FaqSection />` (Tagline: `"COMMON QUESTIONS"`, 10 multi-year questions covering salary changes, job switches, actual working days, 30 June boundary, progressive tax slabs).
4. `<ExploreCalculatorsSection />` (Inline Explore Calculators section)
5. `<ResourcesSection />` (Tagline: `"OFFICIAL TAX REFERENCES"`, Title: `"Official Pakistan Tax Resources"`, Lead: `"Access official government resources and FBR publications..."`, Background: `#022641`).
6. `<QuranReflection />` (Tagline: `"A REFLECTION"`, Surah Al-Ma'idah 5:1 `يَا أَيُّهَا الَّذِينَ آمَنُوا أَوْفُوا بِالْعُقُودِ`, Translation: `"O you who have believed, fulfill all contracts and obligations."`).
7. `<Footer />`

## Footer Architecture (FindTaxCalculator.com)
- **Design Layout:** 4 columns following Primary Reference Image 1 on deep brand dark green (`var(--forest)`):
  1. **Column 1 (Brand & Newsletter):** Logo on white rounded chip, brand description, "Subscribe to Tax Updates" newsletter form with instant client feedback, and calculation disclaimer.
  2. **Column 2 (Tax Guides):** Green circular bullets preceding links: Income Tax Slabs & System (`/tax-guides/income-tax-slabs`), Tax Deductions & Credits (`/tax-guides/tax-deductions-and-credits`), Filing Your Tax Return (`/tax-guides/filing-your-tax-return`), FBR Website (`https://www.fbr.gov.pk/`), IRIS Portal (`https://iris.fbr.gov.pk/`).
  3. **Column 3 (Useful Links):** Green circular bullets preceding links: About Us (`/about`), Contact Us (`/contact`), FAQs (`/#faqs`), Blog (`/blog`), Terms of Use (`/terms-of-use`), Privacy Policy (`/privacy-policy`), Income Tax Slabs (`/#tax-slabs`).
  4. **Column 4 (Contact Us):** Green labels with clean values: Location (Pakistan), Email (`contact@findtaxcalculator.com`, mailto link), Service Area (All Pakistan Provinces), Support (Online Contact Form `/contact`).
- **Bottom Bar:** Subtle horizontal divider, dynamic copyright year (`© {new Date().getFullYear()} FindTaxCalculator.com. All rights reserved.`), and `"Designed with ❤️ in Pakistan"`.
- **All Routes:** Functional, accessible, and statically prerendered with 0 broken links.

## Motion & Accessibility Rules
- Scroll animations use lightweight one-shot `ScrollObserver.tsx` (`IntersectionObserver`).
- Strictly no continuous `animation-timeline: view()` or scroll-linked opacity calculations (prevents bottom-of-screen content fading).
- Elements are revealed once and stay 100% visible permanently.
- Full support for `prefers-reduced-motion: reduce`.
