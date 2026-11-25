import type { Metadata } from "next";
import MultiYearCalculator from "@/app/components/calculator/MultiYearCalculator";
import Hero from "@/app/components/sections/Hero";
import CalculationMethodSection from "@/app/components/sections/CalculationMethodSection";
import FaqSection from "@/app/components/sections/FaqSection";
import ExploreCalculatorsSection from "@/app/components/sections/ExploreCalculatorsSection";
import ResourcesSection from "@/app/components/sections/ResourcesSection";
import QuranReflection from "@/app/components/sections/QuranReflection";
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
      <CalculationMethodSection />
      <FaqSection
        badge="COMMON QUESTIONS"
        title="Frequently Asked Questions About Multi-Year Salary Tax"
        lead="Clear answers about multi-year salary periods, fiscal boundaries, and tax calculations in Pakistan."
        faqs={multiYearFaqs}
      />
      <ExploreCalculatorsSection />
      <ResourcesSection
        tagline="OFFICIAL TAX REFERENCES"
        title="Official Pakistan Tax Resources"
        lead="Access official government resources and FBR publications to verify tax slabs, income tax rules, and relevant tax information."
      />
      <QuranReflection
        tagline="A REFLECTION"
        arabic="يَا أَيُّهَا الَّذِينَ آمَنُوا أَوْفُوا بِالْعُقُودِ"
        translation="O you who have believed, fulfill all contracts and obligations."
        surah="Surah Al-Ma'idah"
        ayah="5:1"
      />
    </main>
  );
}
