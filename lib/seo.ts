// Builders for page <head> metadata and JSON-LD structured data.
// All text comes from lib/site.ts and lib/faqs.ts — edit those, not this file.
import type { Metadata } from "next";
import { absoluteUrl, fullTitle, pages, site, type CalculatorKey, type PageKey } from "./site";
import type { Faq } from "./faqs";

/** Metadata for one page (title, description, canonical, social cards). */
export function pageMetadata(key: PageKey): Metadata {
  const page = pages[key];
  const url = absoluteUrl(page.path);
  const socialTitle = page.socialTitle ?? fullTitle(page);
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    // The canonical is always the clean URL. Shared links (…?fy=2025&sal=…) therefore
    // never compete with the real page in search results.
    alternates: { canonical: page.path },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      locale: site.locale,
      title: socialTitle,
      description: page.description,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: page.description,
      ...(site.twitterHandle ? { site: `@${site.twitterHandle}`, creator: `@${site.twitterHandle}` } : {}),
    },
  };
}

const ids = {
  org: `${site.url}/#organization`,
  website: `${site.url}/#website`,
};

/** Organization + WebSite. Rendered once, in the root layout. */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ids.org,
        name: site.name,
        url: site.url,
        logo: { "@type": "ImageObject", url: `${site.url}/logo.png`, width: 720, height: 247 },
        ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: site.url,
        name: site.name,
        inLanguage: site.language,
        publisher: { "@id": ids.org },
      },
    ],
  };
}

/** WebApplication (+ optional FAQPage and BreadcrumbList) for a calculator page. */
export function pageJsonLd(key: CalculatorKey, faqs: Faq[]) {
  const page = pages[key];
  const url = absoluteUrl(page.path);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      inLanguage: site.language,
      isPartOf: { "@id": ids.website },
      about: { "@type": "Thing", name: "Pakistan salaried-person income tax" },
    },
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: page.h1,
      url,
      description: page.appDescription ?? page.description,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any (runs in the browser)",
      browserRequirements: "Requires JavaScript",
      inLanguage: site.language,
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "PKR" },
      areaServed: { "@type": "Country", name: site.country },
      publisher: { "@id": ids.org },
      mainEntityOfPage: { "@id": `${url}#webpage` },
    },
  ];

  if (faqs.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  if (key !== "home") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: pages.home.navLabel, item: absoluteUrl(pages.home.path) },
        { "@type": "ListItem", position: 2, name: page.navLabel, item: url },
      ],
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/** WebPage + BreadcrumbList for a plain information page (for example the sitemap). */
export function infoPageJsonLd(key: Exclude<PageKey, CalculatorKey>) {
  const page = pages[key];
  const url = absoluteUrl(page.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: site.language,
        isPartOf: { "@id": ids.website },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: pages.home.navLabel, item: absoluteUrl(pages.home.path) },
          { "@type": "ListItem", position: 2, name: page.navLabel, item: url },
        ],
      },
    ],
  };
}
