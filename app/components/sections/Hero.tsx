import type { ReactNode } from "react";

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
      <section className="hero" aria-labelledby="page-title">
        <p className="hero-pill">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <rect x="3" y="7" width="10" height="7" rx="2" fill="none" stroke="#0B5139" strokeWidth="1.6" />
            <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="#0B5139" strokeWidth="1.6" />
          </svg>
          Free · Private · Runs in your browser
        </p>
        <h1 id="page-title">{h1}</h1>
        <p className="hero-lead">{lead}</p>
      </section>
      <section className="calc-wrap" id="calculator" aria-label="Income tax calculator">
        {children}
      </section>
    </>
  );
}
