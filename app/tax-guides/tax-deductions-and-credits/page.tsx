import type { Metadata } from "next";
import PlaceholderPage from "@/app/components/sections/PlaceholderPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Tax Deductions & Credits | ${site.name}`,
  description: "Guide to lawful tax deductions, tax credits, and rebates available to Pakistan taxpayers.",
};

export default function TaxDeductionsPage() {
  return (
    <PlaceholderPage
      eyebrow="TAX GUIDES"
      title="Tax Deductions & Credits"
      description="Understand eligible tax deductions, investment tax credits, charitable donations, and medical allowances under Pakistan tax laws."
      comingSoonText="Comprehensive guidance on legal tax deductions, advance tax adjustments, and tax credit computations is being compiled."
    />
  );
}
