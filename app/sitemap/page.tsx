import type { Metadata } from "next";
import SitemapBrowser from "@/app/components/sitemap/SitemapBrowser";
import JsonLd from "@/app/components/seo/JsonLd";
import { getContentGroups } from "@/lib/content";
import { infoPageJsonLd, pageMetadata } from "@/lib/seo";
import { pages, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata("sitemap");

export default function SitemapPage() {
  const { pages: pageEntries, posts } = getContentGroups();
  return (
    <main id="main">
      <JsonLd data={infoPageJsonLd("sitemap")} />
      <section className="hero" aria-labelledby="page-title">
        <p className="hero-pill">{pages.sitemap.navLabel}</p>
        <h1 id="page-title">{pages.sitemap.h1}</h1>
        <p className="hero-lead">{pages.sitemap.lead}</p>
      </section>
      <SitemapBrowser pages={pageEntries} posts={posts} siteName={site.name} siteUrl={site.url} />
    </main>
  );
}
