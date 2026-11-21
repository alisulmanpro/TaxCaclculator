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
    layout/      Header, Footer, Logo, NavLinks, OfflineSupport
    sections/    Hero, FaqSection, HowItWorks, ResourcesSection
    seo/         JsonLd
lib/  tax.ts, salary-history.ts, format.ts, share.ts, site.ts, faqs.ts, seo.ts, og.tsx
tests/
```

## Routes
- `/`: Single Year calculator. `/multi-year-calculator`: Multi-Year calculator. The mode tabs are real links.
- Both pages are statically prerendered. Calculator state is client-side only.

## Calculator Behavioral & Visibility Rules
- **Initial salary state:** both calculators start with an empty salary (`""`). No fake salaries. Placeholders: single `"Enter your Salary"`, multi `"Enter your monthly salary"`.
- **Single year:** results (hero figure, table, comparison banner, stats, insights) are hidden until a valid positive salary (≤ Rs. 1,000,000,000) is entered; the result column shows an empty-state panel. Results update live. Insights are hidden by default (`insightsOpen: false`); the Show/Hide button lives in the Insights header.
- **Multi-year:** starts with exactly one empty period. Calculation needs "Calculate taxes". Results hidden until calculated; editing any input marks results stale and hides them. Insights are visible by default after calculation.
- **Shared links (`lib/share.ts`):** "Copy shareable link" encodes the on-screen state in the query string; opening a link restores it (multi-year recalculates automatically from the restored periods). Decoding validates every value. Reset clears the query string. The canonical URL is always the clean path.
- **PDF:** generated client-side from numbers already computed by the calculators. The PDF code never calculates tax.
- **Charts:** Recharts, fed from the engine results; each chart has an `aria-label` summary and a table/legend with the same numbers.
- Tables are wrapped in `.table-scroll` / `.rtable-scroll` (horizontal scroll on mobile, no page-wide overflow).

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
