"use client";

import { useCallback, useId, useMemo, useState } from "react";
import Link from "next/link";
import { useCopyLink } from "@/app/components/calculator/ui";
import type { ContentEntry } from "@/lib/content";
import QrDialog, { type QrTarget } from "./QrDialog";
import { CheckIcon, LinkIcon, OpenIcon, PageIcon, PostIcon, QrIcon, SearchIcon } from "./icons";
import "./sitemap.css";

const PAGE_SIZE = 10; // entries shown at first, and added by every "Show more"
const SEARCH_FROM = 6; // the search box appears when a list has more entries than this

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-11-25" -> "25 Nov 2026" (done by hand so the server and the browser always print the same). */
function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return y && m && d ? `${d} ${MONTHS[m - 1]} ${y}` : iso;
}

function CopyButton({ url }: { url: string }) {
  const link = useCopyLink(useCallback(() => url, [url]));
  const copied = link.state === "copied";
  return (
    <button type="button" className={`sm-btn${copied ? " is-done" : ""}`} onClick={link.copy}>
      {copied ? <CheckIcon /> : <LinkIcon />}
      <span aria-live="polite">{copied ? "Copied" : link.state === "failed" ? "Copy failed" : "Copy link"}</span>
    </button>
  );
}

type Props = {
  pages: ContentEntry[];
  /** null when there are no posts yet: the Posts tab is then not shown at all. */
  posts: ContentEntry[] | null;
  siteName: string;
  siteUrl: string;
};

export default function SitemapBrowser({ pages, posts, siteName, siteUrl }: Props) {
  const [tab, setTab] = useState<"page" | "post">("page");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [qr, setQr] = useState<QrTarget | null>(null);
  const searchId = useId();

  const hasPosts = !!posts && posts.length > 0;
  const active = tab === "post" && hasPosts ? posts : pages;
  const kind = tab === "post" && hasPosts ? "post" : "page";
  const noun = kind === "post" ? "post" : "page";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return active;
    return active.filter((e) => `${e.title} ${e.path} ${e.description}`.toLowerCase().includes(q));
  }, [active, query]);
  const shown = filtered.slice(0, limit);
  const left = filtered.length - shown.length;

  const switchTab = (next: "page" | "post") => {
    setTab(next);
    setQuery("");
    setLimit(PAGE_SIZE);
  };

  return (
    <div className="sm-wrap">
      <div className="sm-card">
        <div className="sm-bar">
          {hasPosts ? (
            <div className="sm-tabs" role="tablist" aria-label="Content type">
              {(
                [
                  ["page", "Pages", pages.length],
                  ["post", "Posts", posts.length],
                ] as const
              ).map(([key, label, count]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  id={`sm-tab-${key}`}
                  aria-selected={kind === key}
                  aria-controls="sm-panel"
                  className="sm-tab"
                  onClick={() => switchTab(key)}
                >
                  {label}
                  <span className="sm-count">{count}</span>
                </button>
              ))}
            </div>
          ) : (
            <h2 className="sm-heading">
              Pages <span className="sm-count">{pages.length}</span>
            </h2>
          )}

          <div className="sm-tools">
            {active.length > SEARCH_FROM && (
              <div className="sm-search">
                <label htmlFor={searchId} className="sr-only">
                  Search {noun}s
                </label>
                <SearchIcon />
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setLimit(PAGE_SIZE);
                  }}
                  placeholder={`Search ${noun}s`}
                  autoComplete="off"
                />
              </div>
            )}
            <button type="button" className="sm-btn" onClick={() => setQr({ title: siteName, url: siteUrl })}>
              <QrIcon />
              Site QR code
            </button>
          </div>
        </div>

        <div id="sm-panel" role={hasPosts ? "tabpanel" : undefined} aria-labelledby={hasPosts ? `sm-tab-${kind}` : undefined}>
          {filtered.length === 0 ? (
            <p className="sm-empty" role="status">
              No {noun}s match “{query.trim()}”.
            </p>
          ) : (
            <ul className="sm-list">
              {shown.map((e) => (
                <li key={e.path} className="sm-item">
                  <span className="sm-ico" aria-hidden="true">
                    {e.kind === "post" ? <PostIcon /> : <PageIcon />}
                  </span>
                  <div className="sm-main">
                    <h3 className="sm-title">
                      <Link href={e.path}>{e.title}</Link>
                    </h3>
                    <p className="sm-path">
                      <code>{e.path}</code>
                    </p>
                    <p className="sm-desc">{e.description}</p>
                  </div>
                  <p className="sm-date">
                    <span>Updated</span>
                    <time dateTime={e.updated}>{formatDate(e.updated)}</time>
                  </p>
                  <div className="sm-actions">
                    <CopyButton url={e.url} />
                    <button
                      type="button"
                      className="sm-btn"
                      onClick={() => setQr({ title: e.title, url: e.url })}
                      aria-label={`QR code for ${e.title}`}
                    >
                      <QrIcon />
                      QR code
                    </button>
                    <Link href={e.path} className="sm-btn sm-btn-ghost" aria-label={`Open ${e.title}`}>
                      <OpenIcon />
                      <span className="sm-open-text">Open</span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {filtered.length > 0 && (
            <div className="sm-foot">
              <p role="status" aria-live="polite">
                Showing {shown.length} of {filtered.length} {filtered.length === 1 ? noun : `${noun}s`}
              </p>
              {left > 0 && (
                <button type="button" className="sm-btn" onClick={() => setLimit((n) => n + PAGE_SIZE)}>
                  Show {Math.min(PAGE_SIZE, left)} more
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <QrDialog target={qr} onClose={() => setQr(null)} />
    </div>
  );
}
