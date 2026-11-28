import type { Metadata } from "next";
import PlaceholderPage from "@/app/components/sections/PlaceholderPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  alternates: { canonical: "/terms-of-use" },
  description: `Terms and conditions for using ${site.name} calculators and informational services.`,
};

export default function TermsOfUsePage() {
  return (
    <PlaceholderPage
      eyebrow="LEGAL"
      title="Terms of Use"
      description="Guidelines and terms governing your use of our free Pakistan salary and income tax calculators."
      comingSoonText="Our formal terms of use documentation is being finalized. In summary: all calculations are provided for informational estimation purposes and do not constitute formal tax or legal advice."
    />
  );
}
