/* Offline support for the calculator.
 *
 * The calculators run entirely in the browser, so once the pages and their JS/CSS/fonts are saved on the
 * device, the whole site works without internet. Strategy:
 *   - Pages (navigation):   network first (3 s limit), fall back to the saved copy. New deploys show up online.
 *   - /_next/static/*:      cache first (file names contain a content hash, so they never change).
 *   - Other same-origin files (logo, icons, manifest): saved copy first, refreshed in the background.
 *   - Everything else (RSC data, APIs, other sites): untouched.
 *
 * Bump CACHE_VERSION if you change this file in a way that needs old caches cleared. */

const CACHE_VERSION = "v1";
const CACHE = `tax-calculator-${CACHE_VERSION}`;

// Pages saved on install. Add every new calculator page here.
const PAGES = ["/", "/multi-year-calculator"];
// Small files the pages and the PDF need.
const FILES = ["/logo.png", "/icon.png", "/apple-icon.png", "/manifest.webmanifest"];

const NETWORK_TIMEOUT_MS = 3000;

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("tax-calculator-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(pageHandler(request, url));
    return;
  }
  // Next.js soft-navigation / data requests: leave alone (if offline, Next falls back to a normal page load).
  if (request.headers.get("RSC") || url.searchParams.has("_rsc")) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (FILES.includes(url.pathname) || /\.(?:png|ico|svg|woff2?|webmanifest)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

/* ───────────────────────────── helpers ───────────────────────────── */

async function precache() {
  const cache = await caches.open(CACHE);
  const assets = new Set();

  for (const page of PAGES) {
    try {
      const res = await fetch(page, { cache: "reload" });
      if (!res.ok) continue;
      const html = await res.clone().text();
      await cache.put(page, res);
      // The HTML lists every script, style and font the page needs: save them too.
      for (const m of html.matchAll(/(?:\/_next\/)?(static\/(?:chunks|css|media)\/[^"'\\\s)<>]+)/g)) {
        assets.add("/_next/" + m[1]);
      }
    } catch {
      /* offline during install: the page is saved the first time it is visited */
    }
  }
  await Promise.all(
    [...FILES, ...assets].map(async (path) => {
      try {
        const res = await fetch(path);
        if (res.ok) await cache.put(path, res);
      } catch {
        /* ignore, it is saved on first use */
      }
    }),
  );
}

async function pageHandler(request, url) {
  const cache = await caches.open(CACHE);
  // Shared links carry the numbers in ?query. The page is identical, so match on the path only.
  const key = url.pathname;
  try {
    const res = await fetchWithTimeout(request, NETWORK_TIMEOUT_MS);
    if (res.ok && res.headers.get("content-type")?.includes("text/html")) {
      cache.put(key, res.clone());
    }
    return res;
  } catch {
    const saved = (await cache.match(key)) || (await cache.match("/"));
    return saved || offlineResponse();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const saved = await cache.match(request);
  if (saved) return saved;
  const res = await fetch(request);
  if (res.ok) cache.put(request, res.clone());
  return res;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const saved = await cache.match(request);
  const refresh = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => undefined);
  return saved || (await refresh) || Response.error();
}

function fetchWithTimeout(request, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    fetch(request).then(
      (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

function offlineResponse() {
  return new Response(
    "<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'><title>Offline</title>" +
      "<body style='font-family:system-ui;padding:2rem;max-width:32rem;margin:auto'><h1>You are offline</h1>" +
      "<p>Open the calculator once while online and it will work without internet after that.</p>",
    { status: 503, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}
