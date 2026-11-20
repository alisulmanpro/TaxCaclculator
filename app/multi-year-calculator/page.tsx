import type { Metadata } from "next";
import MultiYearHeroSection from "@/app/components/multi-year/MultiYearHeroSection";
import QuoteSection from "@/app/components/home/QuoteSection";
import MultiYearFAQSection from "@/app/components/multi-year/MultiYearFAQSection";
import ResourcesSection from "@/app/components/home/ResourcesSection";
import BottomCTA from "@/app/components/home/BottomCTA";
import ScrollReveal from "@/app/components/layout/ScrollReveal";

export const metadata: Metadata = {
  title: "Pakistan Multi-Year Salary & Income Tax Calculator | TaxCalculato.com",
  description:
    "Calculate Pakistan salary income tax across multiple salary periods, bonuses, and fiscal years (FY 2024–25 to FY 2026–27). Free, private, browser-only tax planning tool.",
  openGraph: {
    title: "Pakistan Multi-Year Salary & Income Tax Calculator",
    description:
      "Track tax liability across changing salaries and fiscal years. Free Pakistan salary income tax calculator.",
    type: "website",
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pakistan Multi-Year Salary & Income Tax Calculator",
    description:
      "Free Pakistan multi-year salary income tax calculator. Multi-period calculations for FY 2024–27.",
  },
};

export default function MultiYearPage() {
  return (
    <main className="flex flex-col items-center justify-center w-screen">
      <MultiYearHeroSection />
      <ScrollReveal>
        <QuoteSection />
      </ScrollReveal>
      <ScrollReveal delay={60}>
        <MultiYearFAQSection />
      </ScrollReveal>
      <ScrollReveal delay={60}>
        <ResourcesSection />
      </ScrollReveal>
      <ScrollReveal delay={60}>
        <BottomCTA />
      </ScrollReveal>
    </main>
  );
}
