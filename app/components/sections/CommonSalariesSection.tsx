import { currency } from "@/lib/tax";
import DataSectionHeader from "./DataSectionHeader";

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
 * Section A: tax on common salaries, FY 2026–27
 * A clear, scannable reference table showing tax and take-home pay for common salary benchmarks.
 * Server Component (no client state needed).
 */
export default function CommonSalariesSection() {
  return (
    <section className="fx-section fx-data fx-data-common" id="common-salaries" aria-labelledby="common-salaries-title">
      <div className="fx-wrap">
        <DataSectionHeader
          eyebrow="Salary tax at a glance"
          title="What does your salary look like after tax?"
          titleId="common-salaries-title"
          lead="Compare monthly tax and take-home pay for common salaries in Pakistan. FY 2026–27."
        />

        <div className="tax-table-wrap">
          <table className="tax-data-table tax-data-table-common" aria-label="Tax on Common Salaries for FY 2026-27">
            <thead>
              <tr className="fx-rise">
                <th scope="col">Monthly gross salary</th>
                <th scope="col">Monthly income tax</th>
                <th scope="col">Monthly take-home</th>
                <th scope="col">Annual income tax</th>
              </tr>
            </thead>
            <tbody>
              {commonSalariesData.map((row) => (
                <tr key={row.monthly} className="fx-rise">
                  <td className="cell-num">{currency(row.monthly)}</td>
                  <td>{currency(row.taxMonthly)}</td>
                  <td className="cell-takehome-amt">{currency(row.takeHomeMonthly)}</td>
                  <td>{currency(row.taxYearly)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="tax-table-footnote fx-rise">
          Figures use the full salary with no deductions. Monthly tax is annual tax divided by 12, rounded
          to the nearest rupee.
        </p>
      </div>
    </section>
  );
}
