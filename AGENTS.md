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
    home/
      HeroSection.tsx
      QuoteSection.tsx
      ArticlesSection.tsx
      FAQSection.tsx
      ResourcesSection.tsx
      BottomCTA.tsx
    calculator/
      SalaryCalculator.tsx
      SalaryInsights.tsx
lib/
  tax.ts
  salary-history.ts
```

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
