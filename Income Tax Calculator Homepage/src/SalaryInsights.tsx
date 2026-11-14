import { useState, type KeyboardEvent } from "react";
import {
  calculateTax,
  compactCurrency,
  currency,
  FISCAL_YEARS,
  fiscalLabel,
  type FiscalYear,
  type TaxResult,
} from "./tax";
import "./salary-insights.css";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "comparison", label: "Fiscal year comparison" },
  { id: "bands", label: "Tax bands" },
] as const;
type InsightsTab = (typeof tabs)[number]["id"];

export default function SalaryInsights({
  result,
  year,
  onClose,
}: {
  result: TaxResult;
  year: FiscalYear;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<InsightsTab>("overview");
  const [frequency, setFrequency] = useState("monthly");
  const factor = frequency === "monthly" ? 1 / 12 : 1;
  const netPercent = Math.max(0, 100 - result.effective);
  const comparison = FISCAL_YEARS.map((value) => ({
    year: value,
    ...calculateTax({ year: value, income: result.income }),
  }));
  const tabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setTab(tabs[next].id);
    document.getElementById(`insights-tab-${tabs[next].id}`)?.focus();
  };

  return (
    <section
      className="salary-insights"
      id="salary-insights"
      aria-labelledby="salary-insights-title"
    >
      <header className="insights-heading">
        <div>
          <div className="insights-eyebrow">SALARY INSIGHTS</div>
          <h3 id="salary-insights-title">Understand your tax at a glance</h3>
          <p>
            {currency(result.income / 12)} per month <span>·</span> FY {fiscalLabel(year)}
          </p>
        </div>
        <div className="insights-heading-actions">
          <div className="insights-effective">
            <strong>{result.effective.toFixed(2)}%</strong>
            <span>Effective tax rate</span>
          </div>
          <button
            className="insights-hide"
            type="button"
            onClick={onClose}
            aria-controls="salary-insights"
            aria-expanded="true"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M5 20V10m7 10V4m7 16v-7" />
            </svg>
            Hide insights
          </button>
        </div>
      </header>
      <div className="insights-tabs" role="tablist" aria-label="Salary insights">
        {tabs.map((item, index) => (
          <button
            key={item.id}
            id={`insights-tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            aria-controls={`insights-panel-${item.id}`}
            tabIndex={tab === item.id ? 0 : -1}
            onClick={() => setTab(item.id)}
            onKeyDown={(event) => tabKey(event, index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id="insights-panel-overview"
        aria-labelledby="insights-tab-overview"
        hidden={tab !== "overview"}
      >
        <div className="insights-overview">
          <div className="insights-panel-heading">
            <div>
              <h4>Your salary in one view</h4>
              <p>A clear view of what you earn, pay, and keep.</p>
            </div>
            <label className="insights-frequency">
              <span className="sr-only">Insights frequency</span>
              <select value={frequency} onChange={(event) => setFrequency(event.target.value)}>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </label>
          </div>
          <div className="insights-cashflow">
            <div className="insights-chart-area">
              <h5>{frequency === "monthly" ? "Monthly" : "Annual"} cash flow</h5>
              <div
                className="insights-chart"
                role="img"
                aria-label={`Gross salary ${currency(result.income * factor)}, tax ${currency(result.tax * factor)}, take-home ${currency(result.takeHome * factor)}`}
              >
                <div className="insights-chart-baseline" />
                {[
                  { name: "Gross salary", value: result.income, className: "gross" },
                  { name: "Tax", value: result.tax, className: "tax" },
                  { name: "Take-home", value: result.takeHome, className: "net" },
                ].map((bar) => (
                  <div className={`insights-bar-column ${bar.className}`} key={bar.name}>
                    <div className="insights-bar-space">
                      <div
                        className="insights-bar"
                        style={{
                          height: `${result.income > 0 ? (bar.value / result.income) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span>{bar.name}</span>
                    <strong>
                      {bar.className === "tax" ? "− " : ""}
                      {compactCurrency(bar.value * factor)}
                    </strong>
                  </div>
                ))}
              </div>
              <p className="insights-chart-caption">
                Tax reduces your {frequency === "monthly" ? "monthly" : "annual"} salary by{" "}
                <strong>{result.effective.toFixed(2)}%</strong>
              </p>
            </div>
            <aside className="insights-glance">
              <div className="insights-eyebrow">AT A GLANCE</div>
              <div className="insights-takehome">
                <span className="insights-wallet">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <rect x="4" y="5" width="16" height="15" rx="2" />
                    <path d="M4 9h16m-5 5h5" />
                  </svg>
                </span>
                <div>
                  <strong>{currency(result.takeHome * factor)}</strong>
                  <h5>{frequency === "monthly" ? "Monthly" : "Annual"} take-home</h5>
                  <p>
                    {compactCurrency(result.takeHome * (frequency === "monthly" ? 1 : 1 / 12))} per{" "}
                    {frequency === "monthly" ? "year" : "month"}
                  </p>
                </div>
              </div>
              <dl>
                <div>
                  <dt>Monthly tax</dt>
                  <dd className="salary-tax">{currency(result.tax / 12)}</dd>
                </div>
                <div>
                  <dt>Annual tax</dt>
                  <dd className="salary-tax">{currency(result.tax)}</dd>
                </div>
                <div>
                  <dt>
                    Marginal rate{" "}
                    <span
                      title="The rate applied to the highest portion of your annual salary, before any surcharge."
                      aria-label="Rate on your highest income band"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 11v6m0-10v.1" />
                      </svg>
                    </span>
                  </dt>
                  <dd>{result.marginal}%</dd>
                </div>
              </dl>
            </aside>
          </div>
          <div className="insights-per-hundred">
            <h5>For every Rs. 100 earned</h5>
            <div className="insights-retention-bar">
              <span style={{ width: `${netPercent}%` }}>
                {netPercent >= 20 ? `${netPercent.toFixed(2)}% take-home` : ""}
              </span>
              <i style={{ width: `${result.effective}%` }} />
            </div>
            <div className="insights-retention-labels">
              <span>{currency(netPercent)} you keep</span>
              <span>{currency(result.effective)} tax</span>
            </div>
          </div>
        </div>
      </div>
      <div
        role="tabpanel"
        id="insights-panel-comparison"
        aria-labelledby="insights-tab-comparison"
        hidden={tab !== "comparison"}
      >
        <div className="insights-overview">
          <div className="insights-panel-heading">
            <div>
              <h4>Same salary. Different fiscal years.</h4>
              <p>
                Compare {currency(result.income / 12)} per month across supported tax schedules.
              </p>
            </div>
          </div>
          <div className="insights-comparison-grid">
            {comparison.map((row) => (
              <article className={row.year === year ? "is-current" : ""} key={row.year}>
                <span className="insights-eyebrow">FY {fiscalLabel(row.year)}</span>
                <h5>
                  {currency(row.takeHome / 12)}
                  <small>monthly take-home</small>
                </h5>
                <dl>
                  <div>
                    <dt>Monthly tax</dt>
                    <dd className="salary-tax">{currency(row.tax / 12)}</dd>
                  </div>
                  <div>
                    <dt>Annual tax</dt>
                    <dd>{currency(row.tax)}</dd>
                  </div>
                  <div>
                    <dt>Effective rate</dt>
                    <dd>{row.effective.toFixed(2)}%</dd>
                  </div>
                </dl>
                {row.year === year && (
                  <span className="insights-current-label">Selected fiscal year</span>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
      <div
        role="tabpanel"
        id="insights-panel-bands"
        aria-labelledby="insights-tab-bands"
        hidden={tab !== "bands"}
      >
        <div className="insights-overview">
          <div className="insights-panel-heading">
            <div>
              <h4>How your tax is calculated</h4>
              <p>Your annual salary is taxed progressively, not all at the highest rate.</p>
            </div>
          </div>
          <div className="insights-table-scroll">
            <table className="insights-bands">
              <caption className="sr-only">
                Annual salary tax bands for fiscal year {fiscalLabel(year)}
              </caption>
              <thead>
                <tr>
                  <th>Annual income band</th>
                  <th>Rate</th>
                  <th>Your income in band</th>
                  <th>Tax</th>
                </tr>
              </thead>
              <tbody>
                {result.bands.map((band) => (
                  <tr key={band.lower} className={band.income > 0 ? "is-used" : ""}>
                    <th>
                      {band.upper === Infinity
                        ? `Over ${currency(band.lower)}`
                        : band.lower === 0
                          ? `Up to ${currency(band.upper)}`
                          : `${currency(band.lower)} – ${currency(band.upper)}`}
                    </th>
                    <td>{band.rate}%</td>
                    <td>{currency(band.income)}</td>
                    <td>{currency(band.tax)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {result.surcharge > 0 && (
                  <tr>
                    <th colSpan={3}>Salary surcharge on income over Rs. 10 million</th>
                    <td>{currency(result.surcharge)}</td>
                  </tr>
                )}
                <tr>
                  <th colSpan={3}>Total annual tax</th>
                  <td>{currency(result.tax)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <p className="insights-method-note">
        Pakistan salaried-person estimates. Monthly amounts are annual figures divided by 12.
        Special reliefs, credits, other income, and super tax are excluded.{" "}
        <a
          href="https://taxsummaries.pwc.com/pakistan/individual/taxes-on-personal-income"
          target="_blank"
          rel="noreferrer"
        >
          View tax reference ↗
        </a>
      </p>
    </section>
  );
}
