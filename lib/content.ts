// ─────────────────────────────────────────────────────────────────────────────
//  CONTENT LIST — everything that appears on the Sitemap page (/sitemap) and in sitemap.xml.
//
//  • Pages come from `pages` in lib/site.ts (add a page there and it shows up everywhere).
//  • Posts: add them to `posts` below. While the list is empty the "Posts" tab is NOT shown
//    on the sitemap page, only the pages are.
// ─────────────────────────────────────────────────────────────────────────────
import { absoluteUrl, pages } from "./site.ts";

export type PostSeo = {
  /** URL path, e.g. "/blog/salary-tax-slabs-2026-27". The post page itself must exist at this path. */
  path: string;
  title: string;
  /** Meta description / short summary shown on the sitemap page. */
  description: string;
  /** Publish date, YYYY-MM-DD. */
  published: string;
  /** Last update, YYYY-MM-DD (defaults to `published`). */
  updated?: string;
};

/** Blog posts. Empty for now. Example entry:
 *  { path: "/blog/salary-tax-slabs-2026-27", title: "Salary tax slabs 2026–27", description: "…", published: "2026-12-01" } */
export const posts: PostSeo[] = [];

export type ContentKind = "page" | "post";

export type ContentEntry = {
  kind: ContentKind;
  title: string;
  path: string;
  /** Full URL (domain + path). Used for the copy link button and the QR code. */
  url: string;
  description: string;
  /** YYYY-MM-DD */
  updated: string;
};

/** Pages in the order they are listed (home first, the sitemap last). */
export function getPageEntries(): ContentEntry[] {
  return Object.values(pages).map((p) => ({
    kind: "page" as const,
    title: p.title,
    path: p.path,
    url: absoluteUrl(p.path),
    description: p.description,
    updated: p.sitemap.lastModified,
  }));
}

/** Posts, newest first. */
export function getPostEntries(list: PostSeo[] = posts): ContentEntry[] {
  return list
    .map((p) => ({
      kind: "post" as const,
      title: p.title,
      path: p.path,
      url: absoluteUrl(p.path),
      description: p.description,
      updated: p.updated ?? p.published,
    }))
    .sort((a, b) => b.updated.localeCompare(a.updated));
}

/** What the sitemap page shows: the posts group is only included when there are posts. */
export function getContentGroups(list: PostSeo[] = posts) {
  const postEntries = getPostEntries(list);
  return { pages: getPageEntries(), posts: postEntries.length ? postEntries : null };
}
