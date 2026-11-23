// ─────────────────────────────────────────────────────────────────────────────
//  SEO & SITE SETTINGS — the one file the person doing SEO needs to edit.
//
//  • Site name, domain, language, social handles  → `site`
//  • Title / description / H1 / keywords per page → `pages`
//  • FAQ questions & answers (also feed the FAQ rich result) → lib/faqs.ts
//  • Step-by-step guide                           → SEO.md
//
//  Everything below is read by: <head> metadata (app/layout.tsx + each page),
//  canonical URLs, sitemap.xml, robots.txt, JSON-LD structured data, the social
//  share image (opengraph-image.tsx) and the web manifest. Change it here once
//  and it changes everywhere.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  /** Brand name shown in titles, structured data and the share image. */
  name: "Tax Calculator",
  /** Short name used by the web manifest / home-screen icon. */
  shortName: "Tax Calculator",
  /**
   * Production domain with no trailing slash. Can be overridden with the
   * NEXT_PUBLIC_SITE_URL environment variable (e.g. for a staging site).
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://taxcalculato.com").replace(/\/+$/, ""),
  /** Language of the content (html lang attribute + structured data). */
  language: "en",
  /** OpenGraph locale. */
  locale: "en_PK",
  /** Country the content is about. */
  country: "Pakistan",
  /** Theme colour used by the browser UI and the web manifest. */
  themeColor: "#0F6B4C",
  /** Optional: X/Twitter handle without the @ (leave "" if none). */
  twitterHandle: "",
  /** Optional: social profile URLs, listed in the Organization structured data. */
  sameAs: [] as string[],
  /**
   * Search Console / Bing verification codes. Prefer setting these as
   * environment variables so they are not committed:
   *   GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION
   */
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION ?? "",
    bing: process.env.BING_SITE_VERIFICATION ?? "",
  },
  /** Fiscal years covered — used in descriptions and structured data. */
  fiscalYearsCovered: "FY 2020–21 to FY 2026–27",
  /**
   * Last verified update date for tax rates and calculator logic.
   * Format: D MMMM YYYY. Update manually only after verified tax schedule changes.
   */
  taxRatesLastUpdated: "14 November 2026",
  /**
   * Last reviewed date for official resources links and government portals.
   * Update manually only when links and authority records are checked.
   */
  officialResourcesLastReviewed: "14 November 2026",
} as const;

export type PageKey = "home" | "multiYear";

export type PageSeo = {
  /** URL path, starting with "/". */
  path: string;
  /** <title> — the site name is added automatically ("… | Tax Calculator"). Keep the total ≤ 60 characters. */
  title: string;
  /** Meta description — aim for 140–160 characters. */
  description: string;
  /** Visible <h1>. */
  h1: string;
  /** Short text under the H1. */
  lead: string;
  /** Title for social cards (defaults to `title`). */
  socialTitle?: string;
  /** Text printed on the social share image. */
  socialImageText: string;
  /** Keywords (Google ignores the tag, but Bing and internal search use it). */
  keywords: string[];
  /** Sitemap hints. Update `lastModified` whenever the page content changes. */
  sitemap: { priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly"; lastModified: string };
  /** Label used in the main navigation and breadcrumbs. */
  navLabel: string;
  /** What the tool does, for WebApplication structured data. */
  appDescription: string;
};

export const pages: Record<PageKey, PageSeo> = {
  home: {
    path: "/",
    title: "Pakistan Salary Tax Calculator 2026–27",
    description:
      "Free Pakistan salary tax calculator. Enter your monthly salary to see income tax, take-home pay and tax slabs for FY 2020–21 to 2026–27. Private and instant.",
    h1: "Pakistan Salary & Income Tax Calculator",
    lead: "Type your monthly salary. See your tax and your take-home pay in seconds.",
    socialImageText: "See your tax and take-home pay in seconds",
    keywords: [
      "Pakistan salary tax calculator",
      "income tax calculator Pakistan",
      "salary tax 2026-27",
      "FBR tax slabs",
      "take home salary Pakistan",
      "monthly tax calculator",
    ],
    sitemap: { priority: 1, changeFrequency: "monthly", lastModified: "2026-11-21" },
    navLabel: "Salary tax",
    appDescription:
      "Calculates Pakistan salaried-person income tax, monthly and annual take-home pay, tax slabs and year-to-year comparison.",
  },
  multiYear: {
    path: "/multi-year-calculator",
    title: "Multi-Year Salary Tax Calculator Pakistan",
    description:
      "Changed jobs or got a raise? Add each salary period and get your Pakistan income tax per fiscal year, with mid-month changes and totals. Free and private.",
    h1: "Pakistan Multi-Year Income Tax Calculator",
    lead: "Salary changed or new job? Add each period and see your tax for every fiscal year.",
    socialImageText: "Tax across several salaries and fiscal years",
    keywords: [
      "multi year salary tax calculator Pakistan",
      "salary increment tax calculator",
      "income tax with job change Pakistan",
      "fiscal year tax calculator",
      "salary history tax",
    ],
    sitemap: { priority: 0.9, changeFrequency: "monthly", lastModified: "2026-11-21" },
    navLabel: "Multi-year",
    appDescription:
      "Calculates Pakistan salary income tax across several salary periods, splitting each period by fiscal year and adding up gross, tax and net income.",
  },
};

/** Absolute URL for a path on this site. */
export const absoluteUrl = (path: string) => `${site.url}${path === "/" ? "" : path}`;

/** Full <title> text including the site name (used in social cards and the JSON-LD name). */
export const fullTitle = (page: PageSeo) => `${page.title} | ${site.name}`;
