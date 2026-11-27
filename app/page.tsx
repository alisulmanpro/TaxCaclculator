import type { Metadata } from "next";
import SingleYearCalculator from "@/app/components/calculator/SingleYearCalculator";
import Hero from "@/app/components/sections/Hero";
import HomeHeroIntro from "@/app/components/sections/HomeHeroIntro";
import CommonSalariesSection from "@/app/components/sections/CommonSalariesSection";
import TaxSlabsSection from "@/app/components/sections/TaxSlabsSection";
import FaqSection from "@/app/components/sections/FaqSection";
import ExploreCalculatorsSection from "@/app/components/sections/ExploreCalculatorsSection";
import ResourcesSection from "@/app/components/sections/ResourcesSection";
import QuranReflection from "@/app/components/sections/QuranReflection";
import SectionNav from "@/app/components/sections/SectionNav";
import JsonLd from "@/app/components/seo/JsonLd";
import { singleYearFaqs } from "@/lib/faqs";
import { pageJsonLd, pageMetadata } from "@/lib/seo";
import "./calculator-theme.css";

export const metadata: Metadata = pageMetadata("home");

export default function Home() {
  return (
    <main id="main" className="fx-theme">
      <JsonLd data={pageJsonLd("home", singleYearFaqs)} />
      <Hero intro={<HomeHeroIntro />}>
        <SingleYearCalculator />
      </Hero>
      <SectionNav
        links={[
          { href: "#common-salaries", label: "Common salaries" },
          { href: "#tax-slabs", label: "Tax slabs" },
          { href: "#faqs", label: "FAQs" },
          { href: "#explore-calculators", label: "Calculators" },
          { href: "#resources", label: "Official resources" },
        ]}
      />
      <CommonSalariesSection />
      <TaxSlabsSection />
      <FaqSection faqs={singleYearFaqs} />
      <ExploreCalculatorsSection />
      <ResourcesSection />
      <QuranReflection />
    </main>
  );
}
