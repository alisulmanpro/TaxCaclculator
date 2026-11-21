"use client";

import { useEffect, useSyncExternalStore } from "react";

// Online/offline status from the browser. Server render and first paint assume "online" so nothing flashes.
function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}
const useIsOnline = () =>
  useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );

/**
 * Makes the site work without internet.
 * 1. Registers /sw.js (production only) which saves the pages, scripts, styles and fonts on the device.
 * 2. Loads the PDF code once while online, so "Download PDF" also works offline later.
 * 3. Shows a small notice while the device is offline.
 */
export default function OfflineSupport() {
  const online = useIsOnline();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    let cancelled = false;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(() => navigator.serviceWorker.ready)
      .then(() => {
        if (cancelled || !navigator.onLine) return;
        const warm = () => {
          // The service worker saves this chunk the first time it is fetched.
          void import("@/app/components/calculator/pdf/reports").catch(() => undefined);
        };
        if ("requestIdleCallback" in window) window.requestIdleCallback(warm, { timeout: 8000 });
        else setTimeout(warm, 3000);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (online) return null;
  return (
    <div className="offline-notice" role="status" aria-live="polite">
      <span className="offline-dot" aria-hidden="true" />
      You are offline. The calculator still works and your data stays on this device.
    </div>
  );
}
