import { FISCAL_YEARS, type FiscalYear } from "@/lib/tax";

/** "2026" → "2026–27" */
const shortYear = (year: FiscalYear) => `${year}–${String(Number(year) + 1).slice(-2)}`;

/** Home page hero: heading and short points on the left, current fiscal year card on the right. */
export default function HomeHeroIntro() {
  const newest = FISCAL_YEARS[0];
  const oldest = FISCAL_YEARS[FISCAL_YEARS.length - 1];

  return (
    <section className="fx-hero fx-home-hero" aria-labelledby="page-title">
      <div className="fx-wrap fx-hero-grid">
        <div>
          <p className="fx-home-badge">Pakistan salary tax calculator</p>
          <h1 id="page-title">Pakistan salary &amp; income tax calculator.</h1>
          <p className="fx-hero-lead">
            Know what you owe and what you take home. Calculate your Pakistan salary income tax in seconds,
            without the spreadsheets.
          </p>
          <ul className="fx-home-points">
            {["Free to use", "No sign-up", "Private calculations"].map((point) => (
              <li key={point}>
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 7.5l3 3 6-7" />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="fx-year-card">
          <p className="fx-year-label">Current fiscal year</p>
          <p className="fx-year-value">{shortYear(newest)}</p>
          <p className="fx-year-title">Salary tax, made simple.</p>
          <p className="fx-year-note">
            Compare fiscal years from <span>{shortYear(oldest)}</span> onwards.
          </p>
          <a className="fx-year-link" href="#tax-slabs">
            Explore tax slabs below <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
