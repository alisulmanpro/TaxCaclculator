import type { Metadata } from "next";
import PlaceholderPage from "@/app/components/sections/PlaceholderPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Tax Blog & Insights | ${site.name}`,
  description: "Articles, insights, and updates on Pakistan budget announcements, tax slabs, and personal finance.",
};

export default function BlogPage() {
  return (
    <PlaceholderPage
      eyebrow="TAX BLOG"
      title="Tax Insights & Articles"
      description="Educational articles, annual budget analyses, and timely updates on Pakistan's personal income tax landscape."
      comingSoonText="Our editorial team is preparing insightful articles and budget breakdowns. New posts will be published here shortly."
    />
  );
}
