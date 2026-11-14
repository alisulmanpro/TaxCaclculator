'use client';

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { calculateTax, currency, FISCAL_YEARS, fiscalLabel, type FiscalYear } from "@/lib/tax";
import {
  bonusMonthOptions,
  calculateSalaryHistory,
  MAX_DATE,
  MIN_DATE,
  validatePeriods,
  type SalaryPeriod,
  type YearlyBonus,
  type YearSummary,
} from "@/lib/salary-history";
import SalaryInsights from "./SalaryInsights";

function ToolIcon({ name, size = 17 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    calculator: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M8 7h8M8 11h2m4 0h2M8 15h2m4 0h2M8 18h2m4 0h2" />
      </>
    ),
    history: <path d="M3 5v5h5M3.6 9A9 9 0 1 1 4 16M12 7v5l3 2" />,
    arrow: <path d="M4 12h16m-5-5 5 5-5 5" />,
    plus: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8m-4-4v8" />
      </>
    ),
    chevron: <path d="m7 10 5 5 5-5" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6m0-10v.1" />
      </>
    ),
    sliders: <path d="M4 6h16M4 12h16M4 18h16M8 3v6m8 0v6m-7 0v6" />,
    chart: <path d="M5 20V10m7 10V4m7 16v-7" />,
    close: <path d="m7 7 10 10M7 17 17 7" />,
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.calculator}
    </svg>
  );
}

function MoneyInput({
  label,
  ariaLabel,
  value,
  onChange,
  hint,
  unit = "Rs.",
  trailing,
  required = false,
}: {
  label: string;
  ariaLabel?: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  unit?: string;
  trailing?: ReactNode;
  required?: boolean;
}) {
  const id = useId();
  return (
    <div className="salary-amount-field">
      <div className="salary-field-heading">
        <label htmlFor={id}>{label}</label>
        {trailing}
      </div>
      <div className="salary-prefixed-input">
        <span>{unit}</span>
        <input
          id={id}
          type="number"
          aria-label={ariaLabel || label}
          required={required}
          min="0"
          max={unit === "×" ? "1000" : "1000000000"}
          step="any"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      {hint && <p className="salary-field-hint">{hint}</p>}
    </div>
  );
}
const blankBonus = (id: number): YearlyBonus => ({ id, amount: "0", unit: "rs", month: "" });
const blankPeriod = (id: number, bonusId: number): SalaryPeriod => ({
  id,
  start: "",
  end: "",
  salary: "0",
  monthlyBonus: "0",
  monthlyDeductions: "0",
  bonuses: [blankBonus(bonusId)],
});
const monthLabel = (value: string) =>
  new Date(`${value}-01T00:00:00Z`).toLocaleDateString("en-PK", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export default function SalaryCalculator() {
  const [tab, setTab] = useState<"single" | "multi">("single");
  const [year, setYear] = useState<FiscalYear>("2026");
  const [salary, setSalary] = useState("10000");
  const [comparison, setComparison] = useState<FiscalYear>("2025");
  const [insights, setInsights] = useState(false);
  const [periods, setPeriods] = useState<SalaryPeriod[]>([blankPeriod(1, 1)]);
  const [history, setHistory] = useState<YearSummary[] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const nextPeriodId = useRef(2);
  const nextBonusId = useRef(2);
  const resultRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);
  const insightsButton = useRef<HTMLButtonElement>(null);
  const validSalary =
    salary.trim() !== "" &&
    Number.isFinite(Number(salary)) &&
    Number(salary) >= 0 &&
    Number(salary) <= 1000000000;
  const gross = validSalary ? Number(salary) * 12 : 0;
  const result = calculateTax({ income: gross, year });
  const previous = calculateTax({ income: gross, year: comparison });
  const difference = result.tax - previous.tax;
  const periodError = validatePeriods(periods);
  const updatePeriod = (id: number, values: Partial<SalaryPeriod>) => {
    setPeriods((current) =>
      current.map((period) => (period.id === id ? { ...period, ...values } : period)),
    );
    setHistory(null);
  };
  const updateBonus = (period: SalaryPeriod, id: number, values: Partial<YearlyBonus>) =>
    updatePeriod(period.id, {
      bonuses: period.bonuses.map((bonus) => (bonus.id === id ? { ...bonus, ...values } : bonus)),
    });
  const scrollTo = (element: HTMLElement | null) =>
    element?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "nearest",
    });
  const tabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const next =
        event.key === "Home"
          ? "single"
          : event.key === "End"
            ? "multi"
            : tab === "single"
              ? "multi"
              : "single";
      setTab(next);
      document.getElementById(`salary-tab-${next}`)?.focus();
    }
  };

  return (
    <div className="salary-tool">
      <div className="salary-tab-bar">
        <div className="salary-tabs" role="tablist" aria-label="Tax calculation mode">
          {(
            [
              { value: "single", label: "Single Year", icon: "calculator" },
              { value: "multi", label: "Multi-Year", icon: "history" },
            ] as const
          ).map((item) => (
            <button
              key={item.value}
              id={`salary-tab-${item.value}`}
              type="button"
              role="tab"
              aria-selected={tab === item.value}
              aria-controls={`salary-panel-${item.value}`}
              tabIndex={tab === item.value ? 0 : -1}
              onClick={() => setTab(item.value)}
              onKeyDown={tabKey}
            >
              <ToolIcon name={item.icon} size={15} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div
        id="salary-panel-single"
        role="tabpanel"
        aria-labelledby="salary-tab-single"
        hidden={tab !== "single"}
      >
        <div className="salary-body">
          <div className="salary-input-grid">
            <label>
              Fiscal year
              <select
                aria-label="Fiscal year"
                value={year}
                onChange={(event) => {
                  const next = event.target.value as FiscalYear;
                  setYear(next);
                  setComparison(
                    next === "2024" ? "2025" : (String(Number(next) - 1) as FiscalYear),
                  );
                }}
              >
                {FISCAL_YEARS.map((value) => (
                  <option key={value} value={value}>
                    {fiscalLabel(value)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Monthly salary (Rs.)
              <input
                type="number"
                aria-label="Monthly salary (Rs.)"
                min="0"
                max="1000000000"
                step="any"
                value={salary}
                onChange={(event) => {
                  const value = event.target.value;
                  setSalary(value);
                  if (
                    !value.trim() ||
                    !Number.isFinite(Number(value)) ||
                    Number(value) < 0 ||
                    Number(value) > 1000000000
                  )
                    setInsights(false);
                }}
                aria-invalid={!validSalary}
                aria-describedby={!validSalary ? "salary-error" : undefined}
              />
            </label>
          </div>
          {!validSalary && (
            <p className="salary-error" id="salary-error">
              Enter a monthly salary between Rs. 0 and Rs. 1,000,000,000.
            </p>
          )}
          <div className="salary-breakdowns" aria-live="polite">
            {[
              {
                name: "Monthly breakdown",
                gross: gross / 12,
                tax: result.tax / 12,
                net: result.takeHome / 12,
              },
              { name: "Annual breakdown", gross, tax: result.tax, net: result.takeHome },
            ].map((card) => (
              <div className="salary-breakdown" key={card.name}>
                <h3>{card.name}</h3>
                <dl>
                  <div>
                    <dt>Gross income</dt>
                    <dd>{validSalary ? currency(card.gross) : "—"}</dd>
                  </div>
                  <div>
                    <dt>Income tax</dt>
                    <dd className="salary-tax">{validSalary ? currency(card.tax) : "—"}</dd>
                  </div>
                  <div>
                    <dt>Net income</dt>
                    <dd className="salary-net">{validSalary ? currency(card.net) : "—"}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
          <div
            className={`salary-comparison ${difference < 0 ? "is-saving" : ""}`}
            aria-live="polite"
          >
            <span className="salary-comparison-icon">
              {difference < 0 ? "↓" : difference > 0 ? "↑" : "="}
            </span>
            <div>
              <span className="salary-change-tag">
                {difference < 0 ? "Tax saving" : difference > 0 ? "Tax increase" : "No change"}
              </span>
              <h3>
                {!validSalary
                  ? "Enter your salary to compare"
                  : Math.abs(difference) < 0.005
                    ? "Your salary tax is unchanged"
                    : `${currency(Math.abs(difference) / 12)} ${difference < 0 ? "less" : "more"} tax per month`}
              </h3>
              <label>
                compared with{" "}
                <select
                  aria-label="Compare fiscal year"
                  value={comparison}
                  onChange={(event) => setComparison(event.target.value as FiscalYear)}
                >
                  {FISCAL_YEARS.map((value) => (
                    <option value={value} key={value}>
                      FY {fiscalLabel(value)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="salary-message">
            <span className="salary-message-mark">
              <ToolIcon name="chart" size={29} />
            </span>
            <div>
              <h3>A clearer picture. A more confident tomorrow.</h3>
              <p>Every number tells a story. Make yours a plan.</p>
            </div>
            <span className="salary-message-aside">
              YOUR MONEY,
              <br />
              WITH PERSPECTIVE.
            </span>
          </div>
          <div className="salary-tool-footer">
            <div>
              Effective tax rate{" "}
              <strong>{validSalary ? `${result.effective.toFixed(2)}%` : "—"}</strong>
            </div>
            <button
              type="button"
              ref={insightsButton}
              className="salary-primary"
              disabled={!validSalary}
              aria-expanded={insights}
              aria-controls="salary-insights"
              onClick={() => {
                setInsights(!insights);
                if (!insights) requestAnimationFrame(() => scrollTo(insightsRef.current));
              }}
            >
              <ToolIcon name="chart" size={14} />
              {insights ? "Hide insights" : "Show insights"}
            </button>
          </div>
          <div ref={insightsRef}>
            {insights && (
              <SalaryInsights
                result={result}
                year={year}
                onClose={() => {
                  setInsights(false);
                  insightsButton.current?.focus();
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div
        id="salary-panel-multi"
        role="tabpanel"
        aria-labelledby="salary-tab-multi"
        hidden={tab !== "multi"}
      >
        <form
          className="salary-body salary-history"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
            if (periodError) return;
            setHistory(calculateSalaryHistory(periods));
            requestAnimationFrame(() => scrollTo(resultRef.current));
          }}
        >
          <div className="salary-history-heading">
            <h3>Salary history</h3>
            <p>Add each period where your monthly salary stayed the same.</p>
          </div>
          <div className="salary-date-note">
            <ToolIcon name="info" size={15} />
            <div>
              <p>
                <strong>Dates you can enter:</strong> 01 Jul 2024 – 30 Jun 2027. Each fiscal year
                uses its own salary tax rates.
              </p>
              <p>
                <strong>Mid-month changes are fine:</strong> only the days covered count, based on
                actual days in the month.
              </p>
              <p>
                <strong>One period per date:</strong> periods cannot overlap. End one before the
                next begins.
              </p>
            </div>
          </div>
          <div className="salary-periods">
            {periods.map((period, index) => (
              <fieldset className="salary-period" key={period.id}>
                <legend className="sr-only">Salary period {index + 1}</legend>
                <div className="salary-period-heading">
                  <h4>
                    <span>{index + 1}</span>Period {index + 1}
                  </h4>
                  {periods.length > 1 && (
                    <button
                      type="button"
                      className="salary-remove"
                      aria-label={`Remove period ${index + 1}`}
                      onClick={() => {
                        setPeriods((current) => current.filter((item) => item.id !== period.id));
                        setHistory(null);
                      }}
                    >
                      <ToolIcon name="close" size={15} />
                    </button>
                  )}
                </div>
                <div className="salary-period-grid">
                  <div>
                    <span className="salary-field-caption">Dates worked</span>
                    <div className="salary-date-inputs">
                      <label>
                        Start date
                        <input
                          aria-label={`Period ${index + 1} start date`}
                          type="date"
                          required
                          min={MIN_DATE}
                          max={MAX_DATE}
                          value={period.start}
                          onChange={(event) =>
                            updatePeriod(period.id, { start: event.target.value })
                          }
                        />
                      </label>
                      <span aria-hidden="true">→</span>
                      <label>
                        End date
                        <input
                          aria-label={`Period ${index + 1} end date`}
                          type="date"
                          required
                          min={period.start || MIN_DATE}
                          max={MAX_DATE}
                          value={period.end}
                          onChange={(event) => updatePeriod(period.id, { end: event.target.value })}
                        />
                      </label>
                    </div>
                    <p className="salary-field-hint">Pick the first and last day of this salary.</p>
                  </div>
                  <MoneyInput
                    label="Monthly salary"
                    required
                    ariaLabel={`Period ${index + 1} monthly salary`}
                    value={period.salary}
                    onChange={(value) => updatePeriod(period.id, { salary: value })}
                    hint="Before tax"
                  />
                </div>
                <details className="salary-additional">
                  <summary>
                    <ToolIcon name="sliders" size={14} />
                    Additional fields <span>(optional)</span>
                    <ToolIcon name="chevron" size={14} />
                  </summary>
                  <div className="salary-additional-body">
                    <div className="salary-bonus-list">
                      {period.bonuses.map((bonus, bonusIndex) => (
                        <div className="salary-bonus-entry" key={bonus.id}>
                          <div className="salary-input-grid">
                            <MoneyInput
                              label={
                                bonusIndex === 0 ? "Yearly bonus" : `Yearly bonus ${bonusIndex + 1}`
                              }
                              ariaLabel={`Period ${index + 1} yearly bonus ${bonusIndex + 1}`}
                              value={bonus.amount}
                              unit={bonus.unit === "salary" ? "×" : "Rs."}
                              onChange={(value) => updateBonus(period, bonus.id, { amount: value })}
                              trailing={
                                <div
                                  className="salary-bonus-units"
                                  role="group"
                                  aria-label={`Period ${index + 1} bonus ${bonusIndex + 1} amount unit`}
                                >
                                  <button
                                    type="button"
                                    aria-pressed={bonus.unit === "rs"}
                                    onClick={() => updateBonus(period, bonus.id, { unit: "rs" })}
                                  >
                                    Rs.
                                  </button>
                                  <button
                                    type="button"
                                    aria-pressed={bonus.unit === "salary"}
                                    onClick={() =>
                                      updateBonus(period, bonus.id, { unit: "salary" })
                                    }
                                  >
                                    × Salary
                                  </button>
                                </div>
                              }
                              hint="A one-off payment, often quoted as two or three salaries. Taxed in its payment year, not spread across months."
                            />
                            <div className="salary-bonus-month">
                              <label>
                                Paid in
                                <select
                                  aria-label={`Period ${index + 1} bonus ${bonusIndex + 1} payment month`}
                                  value={bonus.month}
                                  required={Number(bonus.amount) > 0}
                                  onChange={(event) =>
                                    updateBonus(period, bonus.id, { month: event.target.value })
                                  }
                                >
                                  <option value="">Select month</option>
                                  {bonusMonthOptions(period.start, period.end).map((month) => (
                                    <option key={month} value={month}>
                                      {monthLabel(month)}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <p className="salary-field-hint">
                                The month decides which fiscal year your bonus is taxed in.
                              </p>
                              {period.bonuses.length > 1 && (
                                <button
                                  type="button"
                                  className="salary-remove-bonus"
                                  onClick={() =>
                                    updatePeriod(period.id, {
                                      bonuses: period.bonuses.filter(
                                        (item) => item.id !== bonus.id,
                                      ),
                                    })
                                  }
                                  aria-label={`Remove period ${index + 1} yearly bonus ${bonusIndex + 1}`}
                                >
                                  <ToolIcon name="close" size={13} />
                                  Remove bonus
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="salary-add-bonus"
                      onClick={() =>
                        updatePeriod(period.id, {
                          bonuses: [...period.bonuses, blankBonus(nextBonusId.current++)],
                        })
                      }
                    >
                      <ToolIcon name="plus" size={14} />
                      Add another yearly bonus
                    </button>
                    <div className="salary-recurring-fields salary-input-grid">
                      <MoneyInput
                        label="Monthly bonus"
                        ariaLabel={`Period ${index + 1} monthly bonus`}
                        value={period.monthlyBonus}
                        onChange={(value) => updatePeriod(period.id, { monthlyBonus: value })}
                        hint="A bonus or allowance paid on top of salary every month. It is salary income, so it is taxed with it."
                      />
                      <MoneyInput
                        label="Monthly deductions"
                        ariaLabel={`Period ${index + 1} monthly deductions`}
                        value={period.monthlyDeductions}
                        onChange={(value) => updatePeriod(period.id, { monthlyDeductions: value })}
                        hint="Post-tax amounts, such as salary advance repayments or welfare contributions. They lower take-home pay, not taxable income."
                      />
                    </div>
                  </div>
                </details>
              </fieldset>
            ))}
          </div>
          {submitted && periodError && (
            <p role="alert" className="salary-error">
              {periodError}
            </p>
          )}
          <div className="salary-history-actions">
            <button
              type="button"
              className="salary-add-period"
              onClick={() => {
                setPeriods((current) => [
                  ...current,
                  blankPeriod(nextPeriodId.current++, nextBonusId.current++),
                ]);
                setHistory(null);
                setSubmitted(false);
              }}
            >
              <ToolIcon name="plus" size={15} />
              Add another period
            </button>
            <button className="salary-primary" type="submit">
              Calculate total tax
              <ToolIcon name="arrow" size={16} />
            </button>
          </div>
          {history && (
            <div className="salary-history-results" ref={resultRef} role="status">
              <div className="salary-subheading">
                <h3>Your multi-year estimate</h3>
                <span>
                  {history.length} fiscal {history.length === 1 ? "year" : "years"}
                </span>
              </div>
              <div className="salary-year-list">
                {history.map((row) => (
                  <div key={row.year} className="salary-year-row">
                    <h4>FY {fiscalLabel(row.year)}</h4>
                    <dl>
                      <div>
                        <dt>Gross income</dt>
                        <dd>{currency(row.gross)}</dd>
                      </div>
                      <div>
                        <dt>Income tax</dt>
                        <dd className="salary-tax">{currency(row.tax)}</dd>
                      </div>
                      <div>
                        <dt>Post-tax deductions</dt>
                        <dd>{currency(row.deductions)}</dd>
                      </div>
                      <div>
                        <dt>Take-home income</dt>
                        <dd className="salary-net">{currency(row.net)}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
              <div className="salary-history-total">
                <span>Total estimated income tax</span>
                <strong>{currency(history.reduce((total, row) => total + row.tax, 0))}</strong>
              </div>
              <p>
                Only entered income is included. Add all salary periods in a fiscal year for a
                meaningful annual estimate. Post-tax deductions reduce take-home pay, not your
                income tax.
              </p>
            </div>
          )}
        </form>
      </div>
      <div className="salary-tool-disclaimer">
        <ToolIcon name="lock" size={12} />
        <p>
          Private, browser-only calculations. All amounts are Pakistani rupees (Rs.).
          Salaried-person estimates for FY 2024–25 to FY 2026–27; excludes special reliefs, credits,
          other income, and super tax. Not tax advice.
        </p>
      </div>
    </div>
  );
}
