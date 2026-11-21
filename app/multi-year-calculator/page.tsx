import type { Metadata } from "next";
import MultiYearCalculator from "@/app/components/calculator/MultiYearCalculator";
import Hero from "@/app/components/sections/Hero";
import HowItWorks from "@/app/components/sections/HowItWorks";
import FaqSection from "@/app/components/sections/FaqSection";
import ResourcesSection from "@/app/components/sections/ResourcesSection";
import JsonLd from "@/app/components/seo/JsonLd";
import { multiYearFaqs } from "@/lib/faqs";
import { pageJsonLd, pageMetadata } from "@/lib/seo";
import { pages } from "@/lib/site";

export const metadata: Metadata = pageMetadata("multiYear");

export default function MultiYearPage() {
  return (
    <main id="main">
      <JsonLd data={pageJsonLd("multiYear", multiYearFaqs)} />
      <Hero h1={pages.multiYear.h1} lead={pages.multiYear.lead}>
        <MultiYearCalculator />
      </Hero>
      <HowItWorks />
      <FaqSection
        title="Multi-year tax clarity"
        lead="Short, plain answers about salary periods and fiscal years."
        faqs={multiYearFaqs}
      />
      <ResourcesSection />
    </main>
  );
}
