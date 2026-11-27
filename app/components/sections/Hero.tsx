import type { ReactNode } from "react";
import { site } from "@/lib/site";

/** Page intro with the H1, followed by the calculator (children). */
export default function Hero({
  h1,
  lead,
  children,
}: {
  h1: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="fx-hero" aria-labelledby="page-title">
        <div className="fx-wrap fx-hero-grid">
          <div>
            <h1 id="page-title">{h1}</h1>
            <p className="fx-hero-lead">{lead}</p>
          </div>
          <div className="fx-hero-trust">
            <p className="fx-hero-update">Updated for FY 2026–2027 FBR tax slabs</p>
            <p>Last updated: {site.taxRatesLastUpdated}</p>
            <p className="fx-hero-private">
              <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="7" width="10" height="7" rx="2" />
                <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
              </svg>
              Free · Private · Runs in your browser
            </p>
          </div>
        </div>
      </section>
      <section className="fx-wrap fx-calc-wrap" id="calculator" aria-label="Income tax calculator">
        {children}
      </section>
    </>
  );
}
