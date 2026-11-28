import type { Metadata } from "next";
import PlaceholderPage from "@/app/components/sections/PlaceholderPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  alternates: { canonical: "/contact" },
  description: `Get in touch with the ${site.name} team for questions, feedback, or tax calculator suggestions.`,
};

export default function ContactPage() {
  return (
    <PlaceholderPage
      eyebrow="CONTACT US"
      title="Contact Our Team"
      description="Have questions regarding our calculators, feedback on tax slab calculations, or suggestions? Reach out directly."
      comingSoonText="Feel free to email us directly with any questions or comments."
      badge="Official Contact"
    >
      <div className="contact-details-box">
        <div className="contact-detail-row">
          <span className="contact-detail-label">Email:</span>
          <a href={`mailto:${site.contactEmail}`} className="contact-detail-link">
            {site.contactEmail}
          </a>
        </div>
        <div className="contact-detail-row">
          <span className="contact-detail-label">Location:</span>
          <span className="contact-detail-val">Pakistan</span>
        </div>
        <div className="contact-detail-row">
          <span className="contact-detail-label">Response Time:</span>
          <span className="contact-detail-val">Usually within 24–48 hours</span>
        </div>
      </div>
    </PlaceholderPage>
  );
}
