import type { MetadataRoute } from "next";
import { absoluteUrl, pages } from "@/lib/site";

// Built from lib/site.ts: add a page there and it appears here automatically.
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(pages).map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: page.sitemap.lastModified,
    changeFrequency: page.sitemap.changeFrequency,
    priority: page.sitemap.priority,
  }));
}
