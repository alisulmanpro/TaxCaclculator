import type { Metadata } from "next";
import PlaceholderPage from "@/app/components/sections/PlaceholderPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `About Us | ${site.name}`,
  description: `About ${site.name} — Free, accessible and accurate Pakistan salary and income tax tools.`,
};

export default function AboutPage() {
  return (
    <PlaceholderPage
      eyebrow="ABOUT US"
      title={`About ${site.name}`}
      description="We build clean, private, and precise salary tax calculators for employees and employers in Pakistan."
      comingSoonText={`${site.name} is dedicated to making Pakistan's complex tax rules simple, transparent, and instantly accessible to everyone.`}
    />
  );
}
