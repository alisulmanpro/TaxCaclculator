<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Development Instructions for Tax Calculator

## Project Architecture & Tech Stack
- Framework: Next.js 16.4.6 (App Router, Turbopack; Cache Components is off because Cloudflare/OpenNext does not support it yet), React 19.3.0, TypeScript.
- Styling: Tailwind CSS v4 base + hand-written CSS using design tokens (CSS variables): `app/globals.css` (all pages), `app/calculator-theme.css` and `app/components/calculator/calculator.css` (the two calculator pages).
- Fonts: self-hosted in `app/fonts/` via `next/font/local` (no request to Google). Inter everywhere; Space Grotesk headings on the non-calculator pages only; Amiri for the Quran verse.
- Charts: Recharts (`app/components/calculator/charts.tsx`). PDF: `@react-pdf/renderer`, loaded with `import()` only when "Download PDF" is clicked (`calculator/pdf/reports.tsx`).
- Calculations: standalone TypeScript modules in `lib/` (`tax.ts`, `salary-history.ts`). **Do not change tax logic without tests.**
- Design reference: the two calculator pages follow "Calculator Pages Design" below. Other pages follow `design-ref/` (read `design-ref/README.md`).

## Component Organization
```
app/
  layout.tsx, page.tsx, not-found.tsx, robots.ts, sitemap.ts, manifest.ts, opengraph-image.tsx
  multi-year-calculator/page.tsx (+ opengraph-image.tsx)
  about/page.tsx, contact/page.tsx, blog/page.tsx, terms-of-use/page.tsx, privacy-policy/page.tsx
  tax-guides/
    income-tax-slabs/page.tsx, tax-deductions-and-credits/page.tsx, filing-your-tax-return/page.tsx
  components/
    calculator/  SingleYearCalculator, MultiYearCalculator, charts, ui, pdf/reports, calculator.css
    layout/      Header, Footer, CalculatorFooter, RouteSwitch, CurrentYear, Logo, NavLinks, OfflineSupport, ScrollObserver
    sections/    Hero, SectionHeader, SectionNav, FaqSection, HowItWorks, CalculationMethodSection, ResourcesSection, QuranReflection, CommonSalariesSection, TaxSlabsSection, ExploreCalculatorsSection, PlaceholderPage
    seo/         JsonLd
    sitemap/     SitemapBrowser, QrDialog, icons, sitemap.css
lib/  tax.ts, salary-history.ts, format.ts, share.ts, site.ts, content.ts, faqs.ts, seo.ts, og.tsx, tools-directory.ts
tests/
```

## Routes
- `/`: Single Year calculator. `/multi-year-calculator`: Multi-Year calculator. The mode tabs are real links.
- `/about`, `/contact`, `/blog`, `/terms-of-use`, `/privacy-policy`: Informational & legal pages.
- `/tax-guides/income-tax-slabs`, `/tax-guides/tax-deductions-and-credits`, `/tax-guides/filing-your-tax-return`: Tax guide pages.
- `/sitemap`: visitor sitemap (WordPress-style Pages / Posts). Data: `getContentGroups()` in `lib/content.ts` (pages from `lib/site.ts`, posts from `posts` there). **The Posts tab is only rendered when `posts` is not empty.** Each entry: Open, Copy link, QR dialog (`qrcode` package, made in the browser; copy image / download PNG / copy link). `app/sitemap.ts` (sitemap.xml) reads the same data. New page → add to `PAGES` in `public/sw.js` for offline use.
- All pages are statically prerendered. Calculator state is client-side only.

## Calculator Behavioral & Visibility Rules
- **Initial salary state:** both calculators start with an empty salary (`""`). No fake salaries. Placeholders: single `"Enter your Salary"`, multi `"Enter your monthly salary"`.
- **Single year:** results (hero figure, table, comparison banner, stats, insights) are hidden until a valid positive salary (≤ Rs. 1,000,000,000) is entered; the result column shows an empty-state panel. Results update live. Insights are hidden by default (`insightsOpen: false`); the Show/Hide button lives in the Insights header.
- **Multi-year:** starts with exactly one empty period. Calculation needs "Calculate taxes". Results hidden until calculated; editing any input marks results stale and hides them. Insights are visible by default after calculation.
- **Shared links (`lib/share.ts`):** "Copy shareable link" encodes the on-screen state in the query string; opening a link restores it (multi-year recalculates automatically from the restored periods). Decoding validates every value. Reset clears the query string. The canonical URL is always the clean path.
- **PDF:** generated client-side from numbers already computed by the calculators. The PDF code never calculates tax.
- **Charts:** Recharts, fed from the engine results; each chart has an `aria-label` summary and a table/legend with the same numbers.
- Tables are wrapped in `.table-scroll` / `.rtable-scroll` (horizontal scroll on mobile, no page-wide overflow).

## Calculator Pages Design (`/` and `/multi-year-calculator`)
- **Scope:** only these two routes use this design. Do not let it reach other pages: global CSS stays loaded after client-side navigation, so every rule in `app/calculator-theme.css` is scoped to `.fx-theme` (the page's `<main>`), `.fx-chrome` (header wrapper), the footer's `.fx-` classes, or `body:has(> main.fx-theme)`.
- **Header / footer:** the root layout uses `RouteSwitch` to show the themed header and `CalculatorFooter` on these routes, and the original `Header` / `Footer` elsewhere. `CalculatorFooter` has no newsletter or email form; list only links and contact details that exist (`lib/site.ts`).
- **Colors:** green `#0F5C45`, orange `#F28C28` (decoration only; orange text uses `#965000`), soft background `#F4F7F5`, light green surface `#EAF3EE`, text `#24352E`, secondary `#64746C` family, borders `#DCE7E0`. Tax figures orange, take-home green, always with a text label. Footer is dark green.
- **Layout:** `.fx-wrap` (1120px) for every block; sections are `.fx-section` with alternating tints; `SectionHeader` for headings (side rail from 1000px with `.fx-split`).
- **Type:** Inter only. Sentence-level hierarchy via `.fx-title` / `.fx-lead`; inputs at least 52px high.
- **Motion:** one hero entrance, one reveal per section (`.scroll-reveal` on the section's wrapper, not on each card), short hover/open transitions. All inside `prefers-reduced-motion: no-preference`.

## Section A & B: Tax on Common Salaries & Income Tax Slabs Sections
- **Placement:** Homepage (`app/page.tsx`) directly below the Hero / SingleYearCalculator and before `FaqSection`.
- **Section A (`CommonSalariesSection.tsx`):** H2 `Tax on Common Salaries, FY 2026–27`; 4 columns (`Monthly salary`, `Tax a month`, `Take-home a month`, `Tax a year`); tinted header, right-aligned numbers, sticky first column on phones. Server Component, 0 client JavaScript.
- **Section B (`TaxSlabsSection.tsx`):** H2 `Income Tax Slabs in Pakistan`; 2 columns (`Annual Taxable Income`, `Tax`); solid green header, zebra rows; fiscal-year `<select>` for all years in `lib/tax.ts` (small client component).
- The two tables stay visibly different from each other while sharing the theme.

## Trust Indicators & Verification Date Management
- **Central Configuration:** All verification and trust dates are strictly maintained in `lib/site.ts`:
  - `site.taxRatesLastUpdated`: Last verified date for tax calculation rules and rates (e.g. `"14 November 2026"`).
  - `site.officialResourcesLastReviewed`: Last reviewed date for official government links and portals (e.g. `"14 November 2026"`).
- **Date Accuracy Rule:** Dates must NEVER be automatically generated (no `Date.now()`, no `new Date()`, no build/deployment time auto-stamps). They must reflect actual human/agent verification activity against official FBR sources.
- **Hero Update Bar (`Hero.tsx`):**
  - Trust block with an orange left border: `"Updated for FY 2026–2027 FBR tax slabs"`, `"Last updated: [site.taxRatesLastUpdated]"`, and the free/private note.
- **Official Resources Badge (`ResourcesSection.tsx`):**
  - Displays `"Last reviewed: [site.officialResourcesLastReviewed]"` under the section heading.

## Official Resources Section Styling
- Light themed section (see "Calculator Pages Design"); white cards. Card text and URLs come from `ResourcesSection.tsx`.

## FAQ Section Architecture & Accessibility
- **Structure:** H2 section heading with semantic H3 headings (`.faq-question-heading`) wrapping each accordion trigger. Styling lives in `app/calculator-theme.css` (one card per question, green border on the open card).
- **Accessibility:** Trigger uses `<button type="button" className="faq-trigger">` with `aria-expanded`, `aria-controls={panelId}`, and unique `id`. Panel uses `role="region"` with `aria-labelledby`. Full keyboard navigation (Tab, Enter, Space) with visible focus ring.
- **Single-expand model:** One question expanded at a time. Clicking an open question closes it; clicking another question expands it while collapsing the previous one.
- **+ / − State indicator:** Right-aligned responsive SVG inside a styled circle badge (`.faq-icon-wrapper`). Vertical bar rotates and scales to 0 when expanded, transitioning smoothly between `+` and `−`.
- **Transitions:** Pure CSS grid transition (`grid-template-rows: 0fr -> 1fr`) with `var(--ease-out)`, avoiding layout shifts, external libraries, and JavaScript height calculations. Fully respects `prefers-reduced-motion: reduce`.

## Multi-Year Calculator Page Content Sections Architecture
- **Placement:** Multi-Year Calculator page (`app/multi-year-calculator/page.tsx`) beneath `Hero` / `MultiYearCalculator`.
- **Flow & Order:**
  1. `<Hero><MultiYearCalculator /></Hero>`
  2. `<CalculationMethodSection />`
  3. `<FaqSection badge="COMMON QUESTIONS" ... />`
  4. `<ResourcesSection tagline="OFFICIAL TAX REFERENCES" ... />`
  5. `<QuranReflection tagline="A REFLECTION" ... />`
- **Section 1: Calculation Method (`CalculationMethodSection.tsx`):**
  - Eyebrow pill: `"CALCULATION METHOD"` with calculator icon.
  - Heading (H2): `"How salary tax is calculated across multiple fiscal years"`.
  - 3 educational cards with step numbers `01`, `02`, `03`:
    - `01`: Split Each Period at 30 June (Pakistan fiscal-year boundary).
    - `02`: Count the Days Worked (actual calendar days and prorated daily rates for mid-month changes).
    - `03`: Calculate Tax for Each Fiscal Year (aggregation of annual taxable income and applying respective year's progressive tax slabs).
- **Section 2: Multi-Year FAQ (`FaqSection.tsx`):**
  - Eyebrow badge: `"COMMON QUESTIONS"`.
  - Heading (H2): `"Frequently Asked Questions About Multi-Year Salary Tax"`.
  - Content: 10 multi-year specific FAQs (`multiYearFaqs` in `lib/faqs.ts`) feeding both accordion UI and `FAQPage` JSON-LD schema.
- **Section 3: Official Resources (`ResourcesSection.tsx`):**
  - Eyebrow: `"OFFICIAL TAX REFERENCES"`.
  - Heading (H2): `"Official Pakistan Tax Resources"`.
  - Lead: `"Access official government resources and FBR publications to verify tax slabs, income tax rules, and relevant tax information."`.
  - Shows the `"Last reviewed: [site.officialResourcesLastReviewed]"` indicator.
- **Section 4: Quranic Ayah (`QuranReflection.tsx`):**
  - Eyebrow pill: `"A REFLECTION"`.
  - Ayah: Surah Al-Ma'idah (5:1) in Arabic (`يَا أَيُّهَا الَّذِينَ آمَنُوا أَوْفُوا بِالْعُقُودِ`).
  - English translation: `"O you who have believed, fulfill all contracts and obligations."`.
  - Citation: `"Surah Al-Ma'idah • 5:1"`. Theme of financial integrity, contracts, and fulfilling civic/employment obligations.

## Quran Reflection Section Architecture
- **Placement:** Homepage (`app/page.tsx`) immediately below `ResourcesSection` and before the footer, set on `var(--page)` background.
- **Content:** Surah Ibrahim (14:7) in Arabic (`لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ`) with `dir="rtl"` and `lang="ar"`, English translation ("If you are grateful, I will surely increase you."), and attribution badge (`Surah Ibrahim • 14:7`).
- **Typography & Styling:** dark green card. Arabic uses self-hosted Amiri (`app/fonts/`, OFL licence beside it) through `next/font/local` with `preload: false`, with local Arabic fallbacks; bold, generous line-height for diacritics.

## Section Spacing & Visual Rhythm
- Calculator pages: set by `.fx-section` in `app/calculator-theme.css` (smaller padding from 760px down). Adjacent sections alternate between the soft background and the light green surface.

## Reusable Explore Calculators Section Architecture
- **Placement & Flow:** Embedded inline immediately after `FaqSection` on BOTH existing calculator pages (`app/page.tsx` and `app/multi-year-calculator/page.tsx`). No standalone tools directory page or route exists.
- **Data Configuration:** `lib/tools-directory.ts` provides a typed, scalable schema (`CalculatorTool`, `ToolCategory`).
- **Initial Category:** Exactly 1 category (`SALARY & INCOME`) with SVG wallet icon.
- **Dynamic Count Badge:** Category header renders dynamic count badge (`${count} ${count === 1 ? "Calculator" : "Calculators"}`) displaying `2 Calculators`.
- **Calculators Displayed (2 active tools):**
  1. `Salary Tax Calculator` (Description: `"Calculate your Pakistan salary income tax and take-home pay."`, Destination: `/`).
  2. `Multi-Year Income Tax Calculator` (Description: `"Calculate your salary tax across multiple fiscal years, including salary changes and job transitions."`, Destination: `/multi-year-calculator`).
- **Visual Design:** themed section with a category header (dot, icon, title, count badge) and tool cards in 2 columns on desktop, 1 on mobile.

## Deployment (Cloudflare Workers via OpenNext)
- `pnpm run build` runs `opennextjs-cloudflare build` (which runs a plain `next build` first, see `buildCommand` in `open-next.config.ts`; `pnpm build:next` = plain Next build only). Then `pnpm run deploy` or `npx wrangler deploy` uploads it. The deploy step needs the `.open-next` folder from the build.
- Config: `wrangler.jsonc` (Worker name `taxcaclculator`), `open-next.config.ts`, `public/_headers` (headers for static files; keep in sync with `next.config.ts`).
- `pnpm-workspace.yaml` `allowBuilds` must allow `esbuild` and `workerd`, or pnpm blocks their install scripts.
- Local check: `pnpm preview` (runs the Worker in workerd).
- Worker size: the free plan allows 3 MiB gzip. `@react-pdf` (~4 MB) is kept out of the server bundle with `turbopack.resolveAlias` (`pdf-reports` → real file in the browser, `lib/pdf-reports-server-stub.ts` on the server). Always import the PDF code as `import("pdf-reports")`. Check the size with `npx wrangler deploy --dry-run` ("Total Upload ... gzip").
- Don't re-enable `cacheComponents` / `partialPrefetching` without checking Cloudflare support: pages returned HTTP 500 on Workers.
- No `fs`/file reads at runtime (no file system on Workers). The OG logo is embedded in `lib/og-logo.ts`.

## Offline Mode
- `public/sw.js` (service worker) + `app/components/layout/OfflineSupport.tsx` (registration in production, PDF chunk warm-up, offline notice). Mounted in `app/layout.tsx`.
- Pages are network-first with a saved fallback matched by path (query strings ignored, so shared links work offline). `/_next/static/*` is cache-first. RSC/data requests and other origins are not touched.
- New page → add its path to `PAGES` in `public/sw.js`. Keep `/sw.js` headers in `next.config.ts` (no-cache).
- Never cache calculation results or user input in the service worker.

## Motion (animations)
- One-shot scroll reveal for `.scroll-reveal` elements, triggered by `ScrollObserver.tsx` (`IntersectionObserver`) and styled in `app/globals.css`.
- Strictly no continuous scroll-linked opacity binding or `animation-timeline: view()`: prevents bottom-of-screen content fading. Once an element enters the viewport, it transitions in once and remains fully visible permanently.
- Above-the-fold content is immediately marked revealed on initial render to prevent blank flashes.
- Time-based animations use `backwards` fill (not `both`), so hover `transform`s keep working afterwards.
- Results/insights animate when they mount, not on every keystroke (they update in place). Charts use `animationDuration={450}`.
- Everything sits inside `@media (prefers-reduced-motion: no-preference)`. Users with reduced motion preferences get immediate, still layouts.

## Styling Rules
- Calculator pages: see "Calculator Pages Design". Other pages: follow `design-ref/` (green `#0F6B4C`, forest `#0B3D2E`, amber `#B7791F`; tokens in `app/globals.css`). Logo, OG images, PDF and `theme-color` still use these older colors.
- Breakpoints used: 1000px, 760px, 600px, 540px, 480px, 400px, 360px. No horizontal page scroll at 360px on the calculator pages.
- Inputs are at least 52px high, body text at least 16px, visible focus ring.

## Security Requirements
- Bounds checking for numeric fields (0 to Rs. 1,000,000,000), also when decoding shared links.
- HTTP security headers in `next.config.ts`.
- No external scripts; client-only calculation privacy.
- External links use `target="_blank" rel="noreferrer noopener"`.
- JSON-LD is serialised with `<` escaped (`app/components/seo/JsonLd.tsx`).

## SEO
- All SEO text/settings: `lib/site.ts` and `lib/faqs.ts`. Builders: `lib/seo.ts`. Guide: `SEO.md`.
- Per page: title, description, canonical, Open Graph/Twitter, JSON-LD (WebPage, WebApplication, FAQPage, BreadcrumbList). Site-wide: Organization + WebSite, robots, sitemap, manifest, icons.
- One H1 per page (Hero), H2 for sections, H3 for cards/FAQ items.

## Numeric Input Formatting Rules
- All amount inputs use live thousands separators via `lib/format.ts` (`MoneyInput` in `calculator/ui.tsx`).
- Values are cleaned to numbers before calculation; calculations never receive formatted strings.
- Cursor position is preserved while typing. Empty input stays empty (never becomes 0). Reset clears all fields.

## Verification Commands
- Type check: `node node_modules/typescript/bin/tsc --noEmit` (or `pnpm typecheck`)
- Lint: `pnpm lint`
- Tests: `pnpm test`
- Build: `pnpm run build` (OpenNext/Cloudflare) or `pnpm build:next` (plain Next build)
- Dev server: `node node_modules/next/dist/bin/next dev`
