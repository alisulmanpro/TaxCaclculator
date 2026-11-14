import type { Metadata } from "next";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pakistan Salary & Income Tax Calculator | TaxCalculato.com",
  description:
    "Calculate your Pakistan salary income tax instantly. Supports FY 2024–25, 2025–26, and 2026–27. See monthly and annual tax breakdowns, compare fiscal years, and explore tax bands.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Pakistan Salary & Income Tax Calculator",
    description:
      "Understand your income. Know your taxes. Free Pakistan salary income tax calculator for FY 2024–27.",
    type: "website",
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pakistan Salary & Income Tax Calculator",
    description:
      "Free Pakistan salary income tax calculator. Monthly and annual estimates for FY 2024–27.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "TaxCalculato.com",
      url: "https://taxcalculato.com",
      description: "Pakistan salary income tax calculator for salaried individuals.",
    },
    {
      "@type": "WebPage",
      name: "Pakistan Salary & Income Tax Calculator",
      description:
        "Free Pakistan salary income tax calculator covering FY 2024–25, 2025–26, and 2026–27.",
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
