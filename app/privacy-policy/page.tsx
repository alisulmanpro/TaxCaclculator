import type { Metadata } from "next";
import PlaceholderPage from "@/app/components/sections/PlaceholderPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy-policy" },
  description: `Privacy policy for ${site.name}. We prioritize user privacy: all calculations happen directly in your browser.`,
};

export default function PrivacyPolicyPage() {
  return (
    <PlaceholderPage
      eyebrow="LEGAL"
      title="Privacy Policy"
      description="How we protect your data: your salary is calculated in your browser."
      comingSoonText="Our formal privacy statement is being updated. Calculations run in your browser: typing a figure does not send it to us, and we do not sell it. A share link or QR code carries those figures in its web address, so share it only with people you trust: opening it sends that address to our web server, like any page request."
    />
  );
}
