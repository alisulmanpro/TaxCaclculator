# SEO guide

Everything an SEO person normally needs is in **one file: [`lib/site.ts`](lib/site.ts)**
(and the FAQ text in [`lib/faqs.ts`](lib/faqs.ts)). You do not need to touch React code.

## What to edit, and where

| I want to change… | Edit this |
|---|---|
| Page `<title>`, meta description, H1, intro line, keywords | `pages.home` / `pages.multiYear` in `lib/site.ts` |
| Text printed on the social share image | `socialImageText` in `lib/site.ts` |
| Site name, domain, language, locale, theme colour | `site` in `lib/site.ts` |
| Social profile URLs (go into the Organization schema) | `site.sameAs` |
| Twitter/X handle | `site.twitterHandle` |
| FAQ questions and answers (page **and** FAQ rich result) | `lib/faqs.ts` |
| Sitemap priority / change frequency / last modified | `pages.*.sitemap` in `lib/site.ts` |
| Add a new page to the sitemap, nav and schema | add it to `pages` in `lib/site.ts`, then create `app/<path>/page.tsx` that calls `pageMetadata("key")` and `pageJsonLd("key", faqs)` (copy `app/multi-year-calculator/page.tsx`) |
| Google Search Console / Bing verification | set the environment variables `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` |
| Production domain (e.g. staging vs live) | set `NEXT_PUBLIC_SITE_URL` (default `https://taxcalculato.com`) |

Update `lastModified` in `pages.*.sitemap` whenever you change a page's content.

## What is already set up

- **Titles and descriptions** per page, with the site name added automatically (`Title | Tax Calculator`).
- **Canonical URL** on every page. Shared calculator links (`/?fy=2025&sal=200000…`) all point to the clean page as canonical, so they never create duplicate-content problems.
- **robots.txt** (`/robots.txt`) allows everything and lists the sitemap. **sitemap.xml** (`/sitemap.xml`) is generated from `pages`.
- **Open Graph and Twitter cards** with a generated 1200×630 share image per page (`/opengraph-image`), built from the logo and your `socialImageText`.
- **Structured data (JSON-LD):** `Organization` + `WebSite` on every page; `WebPage`, `WebApplication` (free, FinanceApplication), `FAQPage` and (on sub pages) `BreadcrumbList` per page. All text comes from `lib/site.ts` / `lib/faqs.ts`.
- **Crawlable FAQ:** the FAQ uses native `<details>` elements, so every answer is in the HTML without JavaScript.
- **Accessibility and page experience:** one H1 per page, logical H2/H3, skip link, `lang`, visible focus, labelled form fields, self-hosted fonts (no third-party font request), responsive layout, images with `alt` and fixed width/height (no layout shift).
- **Icons and manifest:** `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`, `/manifest.webmanifest`.
- **Security headers** in `next.config.ts` (nosniff, frame deny, referrer policy, permissions policy).
- **404 page** is `noindex`.

## Checklist after the site is live

1. Add the site to **Google Search Console** and **Bing Webmaster Tools** (use the verification env vars above) and submit `https://<domain>/sitemap.xml`.
2. Test a page with Google's [Rich Results Test](https://search.google.com/test/rich-results) (FAQ + WebApplication should be detected) and the [Schema Markup Validator](https://validator.schema.org/).
3. Share a link in WhatsApp / Facebook / X and check the card (title, description, image).
4. Run PageSpeed Insights for mobile and fix anything it lists.

## Ideas for more traffic (content, not code)

- A **Tax slabs** page per fiscal year ("Pakistan salary tax slabs 2025-26"). The numbers already exist in `lib/tax.ts`.
- Guides: "How to calculate salary tax in Pakistan", "Tax on bonus", "What changed in FY 2026-27".
- Internal links from guides to the two calculators.
