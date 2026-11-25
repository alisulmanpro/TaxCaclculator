import type { Metadata } from "next";
import PlaceholderPage from "@/app/components/sections/PlaceholderPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Filing Your Tax Return | ${site.name}`,
  description: "Step-by-step guidance on how to file your annual income tax return using the FBR IRIS portal.",
};

export default function FilingTaxReturnPage() {
  return (
    <PlaceholderPage
      eyebrow="TAX GUIDES"
      title="Filing Your Tax Return"
      description="A beginner-friendly walkthrough on preparing documentation, registering for an NTN, and submitting wealth statements on FBR IRIS."
      comingSoonText="A clear, practical guide on filing annual salaried income tax returns on FBR IRIS is coming soon."
    />
  );
}
