<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Development Instructions for Tax Calculator

## Project Architecture & Tech Stack
- Framework: Next.js 16.4.6 (App Router, Turbopack; Cache Components is off because Cloudflare/OpenNext does not support it yet), React 19.3.0, TypeScript.
- Styling: Tailwind CSS v4 base + hand-written CSS (`app/globals.css`, `app/components/calculator/calculator.css`) using design tokens (CSS variables).
- Fonts: self-hosted Inter + Space Grotesk in `app/fonts/` via `next/font/local` (no request to Google).
- Charts: Recharts (`app/components/calculator/charts.tsx`). PDF: `@react-pdf/renderer`, loaded with `import()` only when "Download PDF" is clicked (`calculator/pdf/reports.tsx`).
- Calculations: standalone TypeScript modules in `lib/` (`tax.ts`, `salary-history.ts`). **Do not change tax logic without tests.**
- Design reference: `design-ref/` (read `design-ref/README.md`). The UI follows these boards.

## Component Organization
```
app/
  layout.tsx, page.tsx, not-found.tsx, robots.ts, sitemap.ts, manifest.ts, opengraph-image.tsx
  multi-year-calculator/page.tsx (+ opengraph-image.tsx)
  components/
    calculator/  SingleYearCalculator, MultiYearCalculator, charts, ui, pdf/reports, calculator.css
    layout/      Header, Footer, Logo, NavLinks, OfflineSupport, ScrollObserver
    sections/    Hero, FaqSection, HowItWorks, ResourcesSection, QuranReflection, CommonSalariesSection, TaxSlabsSection
    seo/         JsonLd
    sitemap/     SitemapBrowser, QrDialog, icons, sitemap.css
lib/  tax.ts, salary-history.ts, format.ts, share.ts, site.ts, content.ts, faqs.ts, seo.ts, og.tsx
tests/
```

## Routes
- `/`: Single Year calculator. `/multi-year-calculator`: Multi-Year calculator. The mode tabs are real links.
- Both pages are statically prerendered. Calculator state is client-side only.
- `/sitemap`: visitor sitemap (WordPress-style Pages / Posts). Data: `getContentGroups()` in `lib/content.ts` (pages from `lib/site.ts`, posts from `posts` there). **The Posts tab is only rendered when `posts` is not empty.** Each entry: Open, Copy link, QR dialog (`qrcode` package, made in the browser; copy image / download PNG / copy link). `app/sitemap.ts` (sitemap.xml) reads the same data. New page → add to `PAGES` in `public/sw.js` for offline use.

## Calculator Behavioral & Visibility Rules
- **Initial salary state:** both calculators start with an empty salary (`""`). No fake salaries. Placeholders: single `"Enter your Salary"`, multi `"Enter your monthly salary"`.
- **Single year:** results (hero figure, table, comparison banner, stats, insights) are hidden until a valid positive salary (≤ Rs. 1,000,000,000) is entered; the result column shows an empty-state panel. Results update live. Insights are hidden by default (`insightsOpen: false`); the Show/Hide button lives in the Insights header.
- **Multi-year:** starts with exactly one empty period. Calculation needs "Calculate taxes". Results hidden until calculated; editing any input marks results stale and hides them. Insights are visible by default after calculation.
- **Shared links (`lib/share.ts`):** "Copy shareable link" encodes the on-screen state in the query string; opening a link restores it (multi-year recalculates automatically from the restored periods). Decoding validates every value. Reset clears the query string. The canonical URL is always the clean path.
- **PDF:** generated client-side from numbers already computed by the calculators. The PDF code never calculates tax.
- **Charts:** Recharts, fed from the engine results; each chart has an `aria-label` summary and a table/legend with the same numbers.
- Tables are wrapped in `.table-scroll` / `.rtable-scroll` (horizontal scroll on mobile, no page-wide overflow).

## Section A & B: Tax on Common Salaries & Income Tax Slabs Sections
- **Placement:** Homepage (`app/page.tsx`) directly below the Hero / SingleYearCalculator and before `FaqSection`.
- **Theme & Surfaces:** Deep brand forest (`var(--forest)` / `#0b3d2e`) section backgrounds with white rounded data cards (`var(--radius-card, 24px)`), matching reference boards.
- **Subtle Visual Differentiation:** The two tables are intentionally styled with subtle design differences so they do not look copy-pasted while maintaining the same color palette and typography:
  - **Section A (`CommonSalariesSection.tsx`):**
    - Title (H2): `Tax on Common Salaries, FY 2026–27`
    - Pill badge: `Salary tax at a glance`
    - Design: Quick reference benchmark matrix with 4 data columns (`Monthly salary`, `Tax a month`, `Take-home a month`, `Tax a year`).
    - Header: Mint wash background (`var(--mint-wash)`) with forest title text.
    - Rows: Uniform white backdrop with hover tint (`#fafdfb`).
    - Value Colors: `Tax a month` and `Tax a year` values in accessible red (`#b91c1c`), `Take-home a month` in brand green (`var(--green)`), `Monthly salary` in dark neutral (`var(--ink)`).
    - Server Component: 100% static server render, 0 client JavaScript.
  - **Section B (`TaxSlabsSection.tsx`):**
    - Title (H2): `Income Tax Slabs in Pakistan`
    - Pill badge: `FBR salary tax slabs`
    - Design: Statutory schedule / calculation rules matrix with 2 columns (`Annual Taxable Income`, `Tax`).
    - Topbar: Enclosed in a styled control bar (`background: #f8faf9; border: 1px solid var(--line-soft); border-radius: 12px;`) housing the fiscal year `<select>`.
    - Header: Subtle slate-tinted header (`background: #f3f6f4; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 2px solid var(--line)`).
    - Rows: Subtle alternating zebra striping (`tbody tr:nth-child(even)` `#fafcfb`, `odd` `#ffffff`, hover `#edf5f0`).
    - Cells: `.cell-slab-range` in bold ink, `.cell-slab-tax` in readable dark neutral.
    - Interactivity: Lightweight client component with interactive fiscal year dropdown supporting all years from `lib/tax.ts`.

## Trust Indicators & Verification Date Management
- **Central Configuration:** All verification and trust dates are strictly maintained in `lib/site.ts`:
  - `site.taxRatesLastUpdated`: Last verified date for tax calculation rules and rates (e.g. `"14 November 2026"`).
  - `site.officialResourcesLastReviewed`: Last reviewed date for official government links and portals (e.g. `"14 November 2026"`).
- **Date Accuracy Rule:** Dates must NEVER be automatically generated (no `Date.now()`, no `new Date()`, no build/deployment time auto-stamps). They must reflect actual human/agent verification activity against official FBR sources.
- **Hero Update Bar (`Hero.tsx`):**
  - Displays a compact status pill: `"Updated for FY 2026–2027 FBR tax slabs"` with a green indicator dot.
  - Displays `"Last updated: [site.taxRatesLastUpdated]"`.
- **Official Resources Badge (`ResourcesSection.tsx`):**
  - Displays `"Last reviewed: [site.officialResourcesLastReviewed]"` alongside the section eyebrow on the `#022641` background with high WCAG AAA contrast.

## Official Resources Section Styling
- **Background:** Exactly `#022641` (dark navy blue) as required.
- **Typography & Contrast:** Eyebrow set to `var(--light-green)`, section title set to `#ffffff`, lead text set to `#b8cde0` for WCAG AAA contrast against `#022641`.
- **Card Design:** Resource cards preserve `#fbfcfb` card background, dark ink text, green links, and official FBR/Iris icons without modifying their structure or URLs.

## FAQ Section Architecture & Accessibility
- **Structure:** Clean, balanced container (`.faq-container`, max-width 860px) centered on `var(--page)` background, naturally blending with the page flow without a disconnected white block.
- **Hierarchy:** H2 for FAQ section heading (`.faq-title`), and semantic H3 headings (`.faq-question-heading`) wrapping each accordion trigger button.
- **Colors & Styling:** Questions display in standard ink color (`var(--ink)`) by default and remain in ink when expanded (`.faq-trigger[aria-expanded="true"]`). The expandable answer content container uses a subtle theme-appropriate green wash (`var(--mint-wash)`) with high-contrast text (`var(--ink-2)` / `#33453d`) and a clean separator border (`var(--line-soft)`).
- **Card Design:** Each question is an individual, distinct card (`.faq-item`, white background for trigger, mint wash for answer, `border: 1px solid var(--line)`, `border-radius: 16px`) with controlled spacing (`gap: 14px`). Open cards receive a `var(--green)` border accent.
- **Accessibility:** Trigger uses `<button type="button" className="faq-trigger">` with `aria-expanded`, `aria-controls={panelId}`, and unique `id`. Panel uses `role="region"` with `aria-labelledby`. Full keyboard navigation (Tab, Enter, Space) with visible focus ring.
- **Single-expand model:** One question expanded at a time. Clicking an open question closes it; clicking another question expands it while collapsing the previous one.
- **+ / − State indicator:** Right-aligned responsive SVG inside a styled circle badge (`.faq-icon-wrapper`). Vertical bar rotates and scales to 0 when expanded, transitioning smoothly between `+` and `−`.
- **Transitions:** Pure CSS grid transition (`grid-template-rows: 0fr -> 1fr`) with `var(--ease-out)`, avoiding layout shifts, external libraries, and JavaScript height calculations. Fully respects `prefers-reduced-motion: reduce`.

## Quran Reflection Section Architecture
- **Placement:** Homepage (`app/page.tsx`) immediately below `ResourcesSection` and before the footer, set on `var(--page)` background.
- **Content:** Surah Ibrahim (14:7) in Arabic (`لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ`) with `dir="rtl"` and `lang="ar"`, English translation ("If you are grateful, I will surely increase you."), and attribution badge (`Surah Ibrahim • 14:7`).
- **Typography & Styling:** Minimal solid dark forest card (`--forest` / `#0b3d2e`, max-width 1100px, compact padding 36px 56px 32px), subtle `--forest-line` border, single white text color (`#ffffff`) for Arabic, translation, and citation badge. No upper decorative icon or complex gradient overlays. Arabic typography uses Amiri via `@font-face` with local system Arabic fallbacks (`Traditional Arabic`, `Scheherazade New`, `Amiri Quran`, `Noto Naskh Arabic`), bold weight 700, and 2.1 line-height for proper diacritic clearance.
- **Responsiveness & Motion:** Fluid typography with `clamp()`, responsive padding down to 360px, scroll-reveal support via `@supports (animation-timeline: view())` respecting `prefers-reduced-motion`.

## Section Spacing & Visual Rhythm
- **Rhythm:** Standardized 56px–64px top/bottom padding across consecutive sections (`.calc-wrap` bottom 64px, `.tax-article-section` padding 56px–64px, `.section-faq` padding 56px–64px, `.resources-inner` padding 60px, `.quran-reflection` padding 56px–64px).
- **Transitions:** Subtle `border-top: 1px solid var(--line-soft)` between same-background sections ensures clean visual definition without harsh contrasts. Responsive adjustments reduce padding smoothly on mobile (40px–48px).

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
- Lightweight one-shot scroll transitions triggered by `ScrollObserver.tsx` (using `IntersectionObserver`) and styled in `app/globals.css`.
- Strictly no continuous scroll-linked opacity binding or `animation-timeline: view()`: prevents bottom-of-screen content fading. Once an element enters the viewport, it transitions in once and remains fully visible permanently.
- Above-the-fold content is immediately marked revealed on initial render to prevent blank flashes.
- Time-based animations use `backwards` fill (not `both`), so hover `transform`s keep working afterwards.
- Results/insights animate when they mount, not on every keystroke (they update in place). Charts use `animationDuration={450}`.
- Everything sits inside `@media (prefers-reduced-motion: no-preference)`. Users with reduced motion preferences get immediate, still layouts.

## Styling Rules
- Follow `design-ref/`: primary green `#0F6B4C`, forest `#0B3D2E`, amber `#B7791F` for tax. Tokens are CSS variables in `app/globals.css`.
- Breakpoints used: 1050px, 760px, 540px, 480px, 360px. No horizontal page scroll at 360px.
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
