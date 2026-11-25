import { test } from "node:test";
import assert from "node:assert/strict";
import { getContentGroups, getPageEntries, getPostEntries, type PostSeo } from "../lib/content.ts";

const post = (path: string, published: string, updated?: string): PostSeo => ({
  path,
  title: `Post ${path}`,
  description: "d",
  published,
  updated,
});

test("pages: home, calculators and the sitemap itself are listed with full URLs", () => {
  const entries = getPageEntries();
  assert.deepEqual(
    entries.map((e) => e.path),
    ["/", "/multi-year-calculator", "/sitemap"],
  );
  assert.ok(entries.every((e) => e.kind === "page" && e.url.startsWith("http") && e.title && e.description));
  assert.equal(entries[0].url.endsWith("/"), false); // home is the bare domain
});

test("posts group is null while there are no posts (the Posts tab is hidden)", () => {
  assert.equal(getContentGroups([]).posts, null);
  assert.ok(getContentGroups([]).pages.length > 0);
});

test("posts group appears with posts, newest update first", () => {
  const groups = getContentGroups([post("/blog/a", "2026-01-01"), post("/blog/b", "2026-02-01"), post("/blog/c", "2026-01-15", "2026-03-01")]);
  assert.deepEqual(groups.posts?.map((p) => p.path), ["/blog/c", "/blog/b", "/blog/a"]);
  assert.ok(groups.posts?.every((p) => p.kind === "post"));
});

test("a post without `updated` uses its publish date", () => {
  assert.equal(getPostEntries([post("/blog/a", "2026-05-05")])[0].updated, "2026-05-05");
});
