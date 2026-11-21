<p align="center">
  <img src="public/logo.png" alt="Tax Calculator" width="360">
</p>

<h1 align="center">Pakistan Salary &amp; Income Tax Calculator</h1>

<p align="center">
  Type your monthly salary and see your tax and take-home pay in seconds.<br>
  Free, private and runs entirely in your browser.
</p>

## What it does

- **Single year** – one fiscal year, one monthly salary. Shows annual and monthly tax, net income, tax still due, a comparison with another year, and insights (where your salary goes, every fiscal year side by side, tax band by band).
- **Multi-year** – add several salary periods (raise, new job, mid-month change). Each period is split at 30 June, every fiscal year is taxed with its own rates, and you get totals plus a tax vs take-home chart.
- **Download PDF** – a proper PDF report (not a print dialog) with the figures, bands and the link to reopen them.
- **Copy shareable link** – the link contains the inputs, so whoever opens it sees exactly what you saw.
- **Works offline** – open the site once with internet and it keeps working without it (calculator, charts, PDF, shared links). Installable from the browser menu ("Add to Home screen"). See [Offline mode](#offline-mode).
- **Fiscal years:** 2020–21 to 2026–27 (multi-year: 1 Jul 2024 – 30 Jun 2027).
- **Private:** nothing is sent to a server. Numbers in a shared link only exist in that link.

> General estimate only. It excludes special reliefs, tax credits, other income and super tax, and is not tax advice.

## Tech

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Recharts (charts) · `@react-pdf/renderer` (PDF, loaded only when you click Download) · Tailwind CSS v4 base + hand-written CSS · self-hosted Inter and Space Grotesk fonts.

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
```

| Command | What it does |
|---|---|
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | ESLint |
| `pnpm test` | Unit tests for the tax engine, salary history, number formatting and share links |

## Project layout

```
app/
  layout.tsx, page.tsx, multi-year-calculator/page.tsx
  opengraph-image.tsx, robots.ts, sitemap.ts, manifest.ts, icon.png
  components/
    calculator/   SingleYearCalculator, MultiYearCalculator, charts (Recharts),
                  ui (shared pieces + copy link/PDF hooks), pdf/reports (PDF), calculator.css
    layout/       Header, Footer, Logo, NavLinks, OfflineSupport (offline notice + service worker registration)
    sections/     Hero, FaqSection, HowItWorks, ResourcesSection
    seo/          JsonLd
lib/
  tax.ts, salary-history.ts   ← the calculation engine (do not change casually)
  share.ts                    ← shareable-link encode / decode + validation
  format.ts                   ← live thousands-separator inputs
  site.ts, faqs.ts, seo.ts    ← SEO settings, FAQ text, metadata + JSON-LD builders
public/sw.js                  ← service worker for offline mode
design-ref/                   ← approved design boards, logo and design tokens
tests/
```

## How the shareable link works

`Copy shareable link` writes the current inputs into the query string, for example
`/?fy=2025&sal=200000&cmp=2024&ins=1&tab=comparison` or
`/multi-year-calculator?p=2024-07-01_2025-06-30_150000_0_0&p=…`.
When the page opens it reads, validates (`lib/share.ts`) and restores that state, including the open
Insights tab. Invalid or hand-edited links are ignored. The canonical URL is always the clean page.

## Deploy (Cloudflare Workers)

The site is deployed to Cloudflare Workers with [OpenNext](https://opennext.js.org/cloudflare).

| Setting (Workers Builds in the Cloudflare dashboard) | Value |
| --- | --- |
| Build command | `pnpm run build` |
| Deploy command | `pnpm run deploy` |
| Environment variable | `NEXT_PUBLIC_SITE_URL` = your domain, e.g. `https://findtaxcalculator.com` |

Do not use a plain `npx wrangler deploy` as the deploy command. Test the Worker locally with `pnpm preview`.

## Offline mode

The calculators run fully in the browser, so a small service worker (`public/sw.js`) saves the pages, scripts, styles and fonts on the device the first time the site is opened online.

- Pages: network first (3 s limit), saved copy when offline. New deploys show up as soon as the device is online.
- `/_next/static/*`: saved copy first (file names contain a hash, so they never go stale).
- Shared links open offline too: the saved page is reused and the numbers come from the link.
- A small "You are offline" notice appears while the connection is down. The PDF code is loaded in the background once, so Download PDF works offline later.
- Registered in production builds only (`next dev` is unaffected). Test with `pnpm build && pnpm start`, open the site, then switch DevTools → Network → Offline.
- **Adding a new page?** Add its path to `PAGES` in `public/sw.js`. Changed `sw.js` heavily? Bump `CACHE_VERSION`.

## SEO

All SEO settings live in [`lib/site.ts`](lib/site.ts) and [`lib/faqs.ts`](lib/faqs.ts).
See **[SEO.md](SEO.md)** for what to edit and a launch checklist.

## Design

The approved design is in [`design-ref/`](design-ref/README.md) (boards, logo, colours, fonts, spacing).

## Contributing

Run `pnpm typecheck && pnpm lint && pnpm test` before opening a pull request. Calculation changes
must come with tests in `tests/`.
