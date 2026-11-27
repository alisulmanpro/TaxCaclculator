import type { Metadata } from "next";
import PlaceholderPage from "@/app/components/sections/PlaceholderPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${site.name}`,
  description: `Privacy policy for ${site.name}. We prioritize user privacy: all calculations happen directly in your browser.`,
};

export default function PrivacyPolicyPage() {
  return (
    <PlaceholderPage
      eyebrow="LEGAL"
      title="Privacy Policy"
      description="How we protect your data: your salary inputs remain 100% private and are processed locally in your browser."
      comingSoonText="Our formal privacy statement is being updated. We never store, transmit, or sell any personal financial data entered into our calculators."
    />
  );
}
