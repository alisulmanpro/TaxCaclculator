import type { Metadata } from "next";
import SingleYearCalculator from "@/app/components/calculator/SingleYearCalculator";
import Hero from "@/app/components/sections/Hero";
import FaqSection from "@/app/components/sections/FaqSection";
import ResourcesSection from "@/app/components/sections/ResourcesSection";
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
      <FaqSection
        title="A little more clarity"
        lead="Short, plain answers about how the calculator works."
        faqs={singleYearFaqs}
      />
      <ResourcesSection />
    </main>
  );
}
