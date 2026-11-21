import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import OfflineSupport from "@/app/components/layout/OfflineSupport";
import JsonLd from "@/app/components/seo/JsonLd";
import { siteJsonLd } from "@/lib/seo";
import { fullTitle, pages, site } from "@/lib/site";
import "./globals.css";

// Self-hosted variable fonts (app/fonts, SIL Open Font License): no request to Google at runtime.
const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});
const grotesk = localFont({
  src: "./fonts/space-grotesk-latin-wght-normal.woff2",
  weight: "300 700",
  variable: "--font-grotesk",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: site.themeColor,
};

// Site-wide defaults. Per-page title/description/canonical are set in each page (lib/seo.ts → lib/site.ts).
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: fullTitle(pages.home), template: `%s | ${site.name}` },
  description: pages.home.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: { type: "website", siteName: site.name, locale: site.locale },
  twitter: { card: "summary_large_image" },
  verification: {
    ...(site.verification.google ? { google: site.verification.google } : {}),
    ...(site.verification.bing ? { other: { "msvalidate.01": site.verification.bing } } : {}),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.language} className={`${inter.variable} ${grotesk.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to the calculator
        </a>
        <JsonLd data={siteJsonLd()} />
        <Header />
        {children}
        <Footer />
        <OfflineSupport />
      </body>
    </html>
  );
}
