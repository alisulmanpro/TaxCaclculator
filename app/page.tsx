import type { Metadata } from "next";
import SingleYearCalculator from "@/app/components/calculator/SingleYearCalculator";
import Hero from "@/app/components/sections/Hero";
import CommonSalariesSection from "@/app/components/sections/CommonSalariesSection";
import TaxSlabsSection from "@/app/components/sections/TaxSlabsSection";
import FaqSection from "@/app/components/sections/FaqSection";
import ExploreCalculatorsSection from "@/app/components/sections/ExploreCalculatorsSection";
import ResourcesSection from "@/app/components/sections/ResourcesSection";
import QuranReflection from "@/app/components/sections/QuranReflection";
import JsonLd from "@/app/components/seo/JsonLd";
import { singleYearFaqs } from "@/lib/faqs";
import { pageJsonLd, pageMetadata } from "@/lib/seo";
import { pages } from "@/lib/site";

export const metadata: Metadata = pageMetadata("home");

export default function Home() {
  return (
    <main id="main">
      <JsonLd data={pageJsonLd("home", singleYearFaqs)} />
      <Hero h1={pages.home.h1} lead={pages.home.lead}>
        <SingleYearCalculator />
      </Hero>
      <CommonSalariesSection />
      <TaxSlabsSection />
      <FaqSection faqs={singleYearFaqs} />
      <ExploreCalculatorsSection />
      <ResourcesSection />
      <QuranReflection />
    </main>
  );
}
