import { site } from "@/lib/site";

const stroke = { fill: "none", stroke: "#0F6B4C", strokeWidth: 1.8 } as const;

const resources = [
  {
    name: "Federal Board of Revenue",
    text: "Pakistan's official source for income tax information, forms and updates.",
    label: "Visit FBR",
    url: "https://www.fbr.gov.pk",
    icon: (
      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" {...stroke} />
        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" {...stroke} />
      </svg>
    ),
  },
  {
    name: "FBR Iris portal",
    text: "Access your official registration, income tax returns and filing records.",
    label: "Open Iris",
    url: "https://iris.fbr.gov.pk",
    icon: (
      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
        <rect x="4" y="3" width="16" height="18" rx="2.5" {...stroke} />
        <path d="M8 8h8M8 12h8M8 16h5" {...stroke} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Pakistan Code",
    text: "Find federal legislation and review the laws behind your tax obligations.",
    label: "Explore legislation",
    url: "https://pakistancode.gov.pk",
    icon: (
      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 6c-2-1.6-5-2-8-1.5v13c3-.5 6-.1 8 1.5 2-1.6 5-2 8-1.5v-13c-3-.5-6-.1-8 1.5zM12 6v13" {...stroke} strokeLinejoin="round" />
      </svg>
    ),
  },
];

export interface ResourcesSectionProps {
  tagline?: string;
  title?: string;
  lead?: string;
}

export default function ResourcesSection({
  tagline = "Trusted government sources",
  title = "Official resources. Reliable answers.",
  lead = "For the finer details, go directly to the people who write the rules.",
}: ResourcesSectionProps = {}) {
  return (
    <section className="resources" id="resources" aria-labelledby="resources-title">
      <div className="resources-inner">
        <div className="stack-14" style={{ gap: 10 }}>
          <div className="resources-eyebrow-row">
            <p className="eyebrow">{tagline}</p>
            <span className="resources-review-badge">
              <span className="resources-status-dot" aria-hidden="true" />
              Last reviewed: {site.officialResourcesLastReviewed}
            </span>
          </div>
          <h2 className="section-title" id="resources-title">
            {title}
          </h2>
          <p className="section-lead">{lead}</p>
        </div>
        <div className="resource-grid">
          {resources.map((resource) => (
            <a
              className="resource-card"
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className="resource-icon">{resource.icon}</span>
              <h3>{resource.name}</h3>
              <p>{resource.text}</p>
              <span className="resource-link">
                {resource.label}
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
                  <path d="M4 12L12 4M6 4h6v6" fill="none" stroke="#0F6B4C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
