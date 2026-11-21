// Used instead of app/components/calculator/pdf/reports.tsx in the SERVER bundle (see turbopack.resolveAlias in next.config.ts).
// PDFs are only created in the browser, and keeping @react-pdf out of the server bundle keeps the Cloudflare Worker small
// (the free plan allows 3 MiB). This code never runs: it is only reached from a click handler.
const browserOnly = async () => {
  throw new Error("PDF reports are created in the browser only.");
};
export const downloadSingleReport = browserOnly;
export const downloadMultiReport = browserOnly;
