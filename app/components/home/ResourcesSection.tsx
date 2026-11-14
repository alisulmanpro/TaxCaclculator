function ShieldIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}

function DiagonalIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 18 18 6M6 6h12v12" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1v15" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M8 6h8M8 11h1m4 0h3M8 15h1m4 0h3M8 19h1m4 0h3" />
    </svg>
  );
}

const resources = [
  {
    icon: <GlobeIcon />,
    name: "Federal Board of Revenue",
    text: "Pakistan’s official source for income tax information, forms, and updates.",
    label: "Visit FBR",
    url: "https://www.fbr.gov.pk/",
  },
  {
    icon: <BookIcon />,
    name: "FBR Iris portal",
    text: "Access your official registration, income tax returns, and filing records.",
    label: "Open Iris",
    url: "https://iris.fbr.gov.pk/",
  },
  {
    icon: <CalculatorIcon />,
    name: "Pakistan Code",
    text: "Find federal legislation and review the laws behind your tax obligations.",
    label: "Explore legislation",
    url: "https://pakistancode.gov.pk/",
  },
];

export default function ResourcesSection() {
  return (
    <section className="resources-section container" id="resources">
      <div className="section-heading">
        <div>
          <div className="eyebrow">STRAIGHT FROM THE SOURCE</div>
          <h2>Official resources. Reliable answers.</h2>
        </div>
        <span className="resource-note">
          <ShieldIcon /> Trusted government sources
        </span>
      </div>
      <p className="section-description">
        For the finer details, go directly to the people who write the rules.
      </p>
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
            <span className="text-link">
              {resource.label}
              <DiagonalIcon size={16} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
