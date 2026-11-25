import type { MetadataRoute } from "next";
import { absoluteUrl, pages } from "@/lib/site";
import { posts } from "@/lib/content";

// Built from lib/site.ts (pages) and lib/content.ts (posts): add one there and it appears here automatically.
export default function sitemap(): MetadataRoute.Sitemap {
  const pageUrls = Object.values(pages).map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: page.sitemap.lastModified,
    changeFrequency: page.sitemap.changeFrequency,
    priority: page.sitemap.priority,
  }));
  const postUrls = posts.map((post) => ({
    url: absoluteUrl(post.path),
    lastModified: post.updated ?? post.published,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...pageUrls, ...postUrls];
}
