import { currency } from "@/lib/tax";

export interface CommonSalaryRow {
  monthly: number;
  taxMonthly: number;
  takeHomeMonthly: number;
  taxYearly: number;
}

export const commonSalariesData: CommonSalaryRow[] = [
  { monthly: 50000, taxMonthly: 0, takeHomeMonthly: 50000, taxYearly: 0 },
  { monthly: 60000, taxMonthly: 100, takeHomeMonthly: 59900, taxYearly: 1200 },
  { monthly: 70000, taxMonthly: 200, takeHomeMonthly: 69800, taxYearly: 2400 },
  { monthly: 80000, taxMonthly: 300, takeHomeMonthly: 79700, taxYearly: 3600 },
  { monthly: 100000, taxMonthly: 500, takeHomeMonthly: 99500, taxYearly: 6000 },
  { monthly: 120000, taxMonthly: 2700, takeHomeMonthly: 117300, taxYearly: 32400 },
  { monthly: 150000, taxMonthly: 6000, takeHomeMonthly: 144000, taxYearly: 72000 },
  { monthly: 180000, taxMonthly: 9300, takeHomeMonthly: 170700, taxYearly: 111600 },
  { monthly: 200000, taxMonthly: 13000, takeHomeMonthly: 187000, taxYearly: 156000 },
  { monthly: 250000, taxMonthly: 23000, takeHomeMonthly: 227000, taxYearly: 276000 },
  { monthly: 300000, taxMonthly: 34667, takeHomeMonthly: 265333, taxYearly: 416000 },
  { monthly: 400000, taxMonthly: 62000, takeHomeMonthly: 338000, taxYearly: 744000 },
  { monthly: 500000, taxMonthly: 92000, takeHomeMonthly: 408000, taxYearly: 1104000 },
];

/**
 * Section A: Tax on Common Salaries, FY 2026–27
 * A clear, scannable reference table showing tax and take-home pay for common salary benchmarks.
 * Server Component (no client state needed).
 */
export default function CommonSalariesSection() {
  return (
    <section
      className="tax-section-dark"
      id="common-salaries"
      aria-labelledby="common-salaries-title"
    >
      <div className="tax-section-inner">
        <header className="tax-section-header">
          <div className="tax-section-pill">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
            </svg>
            <span>Salary tax at a glance</span>
          </div>

          <h2 className="tax-section-title" id="common-salaries-title">
            Tax on Common Salaries, FY 2026–27
          </h2>

          <p className="tax-section-lead">
            How much income tax comes off a monthly salary of Rs.&nbsp;50,000 to Rs.&nbsp;500,000,
            and what you take home, on the FY 2026-27 slabs. Enter your own salary above for your exact
            figure, or pick last year there.
          </p>
        </header>

        <div className="tax-card">
          <div className="tax-table-wrap">
            <table className="tax-data-table" aria-label="Tax on Common Salaries for FY 2026-27">
              <thead>
                <tr>
                  <th scope="col">Monthly salary</th>
                  <th scope="col">Tax a month</th>
                  <th scope="col">Take-home a month</th>
                  <th scope="col">Tax a year</th>
                </tr>
              </thead>
              <tbody>
                {commonSalariesData.map((row) => (
                  <tr key={row.monthly}>
                    <td className="cell-num">{currency(row.monthly)}</td>
                    <td className="cell-tax-amt">{currency(row.taxMonthly)}</td>
                    <td className="cell-takehome-amt">{currency(row.takeHomeMonthly)}</td>
                    <td className="cell-tax-amt">{currency(row.taxYearly)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="tax-table-footnote">
            Salaried slab rates for FY 2026-27, on the full salary with nothing deducted. Monthly
            figures are the yearly tax split over 12 months and rounded to the rupee.
          </p>
        </div>
      </div>
    </section>
  );
}
