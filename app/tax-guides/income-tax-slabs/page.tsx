import type { Metadata } from "next";
import PlaceholderPage from "@/app/components/sections/PlaceholderPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Income Tax Slabs & System | ${site.name}`,
  description: "Learn how Pakistan's progressive income tax slabs work for salaried individuals and business income.",
};

export default function IncomeTaxSlabsPage() {
  return (
    <PlaceholderPage
      eyebrow="TAX GUIDES"
      title="Income Tax Slabs & System"
      description="An overview of Pakistan's progressive income tax brackets, progressive slab rates, and how annual taxable income is evaluated under the Income Tax Ordinance."
      comingSoonText="Detailed educational breakdown of Pakistan's statutory income tax schedules, slab brackets, and computation mechanics is currently in preparation."
    />
  );
}
