import Link from "next/link";

interface PlaceholderPageProps {
  eyebrow?: string;
  title: string;
  description: string;
  comingSoonText?: string;
  badge?: string;
  children?: React.ReactNode;
}

export default function PlaceholderPage({
  eyebrow = "TAX INFORMATION",
  title,
  description,
  comingSoonText = "We are currently preparing detailed, up-to-date guidance for this section based on the latest FBR Pakistan tax regulations.",
  badge = "Content Coming Soon",
  children,
}: PlaceholderPageProps) {
  return (
    <main id="main">
      {/* Header section on brand dark forest background */}
      <section className="placeholder-hero">
        <div className="placeholder-hero-inner">
          <div className="placeholder-eyebrow">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>{eyebrow}</span>
          </div>

          <h1 className="placeholder-title">{title}</h1>
          <p className="placeholder-lead">{description}</p>
        </div>
      </section>

      {/* Content body container */}
      <section className="placeholder-body">
        <div className="placeholder-card">
          <div className="placeholder-status-pill">
            <span className="placeholder-status-dot" aria-hidden="true" />
            <span>{badge}</span>
          </div>

          <p className="placeholder-message">{comingSoonText}</p>

          {children}

          <div className="placeholder-actions">
            <h2 className="placeholder-actions-title">Explore Available Tools</h2>
            <div className="placeholder-nav-grid">
              <Link href="/" className="placeholder-nav-card">
                <div className="placeholder-nav-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="8" y1="6" x2="16" y2="6" />
                    <path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" />
                  </svg>
                </div>
                <div>
                  <strong>Salary Tax Calculator</strong>
                  <p>Calculate your monthly and annual take-home salary.</p>
                </div>
              </Link>

              <Link href="/multi-year-calculator" className="placeholder-nav-card">
                <div className="placeholder-nav-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <div>
                  <strong>Multi-Year Calculator</strong>
                  <p>Calculate tax across job changes and salary increments.</p>
                </div>
              </Link>
            </div>

            <div className="placeholder-back-wrap">
              <Link href="/" className="placeholder-back-btn">
                ← Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
