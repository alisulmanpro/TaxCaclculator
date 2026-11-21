'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import {
  calculateSalaryHistory,
  fiscalYearOf,
  validatePeriods,
  MIN_DATE,
  MAX_DATE,
  type SalaryPeriod,
  type YearSummary,
} from "@/lib/salary-history";
import { currency, compactCurrency, fiscalLabel } from "@/lib/tax";
import { cleanNumber, formatWithCommas } from "@/lib/format";
import {
  buildShareUrl,
  decodeMulti,
  encodeMulti,
  type MultiInsightTab,
} from "@/lib/share";
import { FyStackChart } from "./charts";
import {
  ArrowRight,
  CloseIcon,
  Empty,
  InfoIcon,
  InsightsHeader,
  ModeTabs,
  MoneyInput,
  PlusIcon,
  ResultActions,
  pct,
} from "./ui";
import "./calculator.css";

// Helper to sanitize periods by removing formatting commas before engine validation
function sanitizePeriods(rawPeriods: SalaryPeriod[]): SalaryPeriod[] {
  return rawPeriods.map((p) => ({
    ...p,
    salary: p.salary ? p.salary.replace(/,/g, "").trim() : "0",
    monthlyBonus: p.monthlyBonus ? p.monthlyBonus.replace(/,/g, "").trim() : "0",
    monthlyDeductions: p.monthlyDeductions ? p.monthlyDeductions.replace(/,/g, "").trim() : "0",
    bonuses: (p.bonuses || []).map((b) => ({
      ...b,
      amount: b.amount ? b.amount.replace(/,/g, "").trim() : "0",
    })),
  }));
}

interface MultiYearCalculationResult {
  summaries: YearSummary[];
  totalGross: number;
  totalTax: number;
  totalNet: number;
  totalMonths: number;
  avgRate: number;
  /** The exact (cleaned) periods that produced this result — used for the PDF and the shared link. */
  periods: SalaryPeriod[];
}

// Factory function: returns a fresh default period array on every call
// Using a factory (not a module-level const) prevents shared-reference bugs on reset
function createDefaultPeriods(): SalaryPeriod[] {
  return [
    {
      id: 1,
      start: "2024-07-01",
      end: "2025-06-30",
      salary: "",
      monthlyBonus: "0",
      monthlyDeductions: "0",
      bonuses: [],
    },
  ];
}

/**
 * Validates the periods and runs the (unchanged) salary-history engine.
 * Returns either an error message or the full result.
 */
function runCalculation(
  periods: SalaryPeriod[]
): { error: string } | { result: MultiYearCalculationResult } {
  // Validate that every period has a salary entered
  const hasEmptySalary = periods.some(
    (p) => !p.salary || p.salary.trim() === "" || cleanNumber(p.salary) === 0
  );
  if (hasEmptySalary) return { error: "Please enter a valid monthly salary for all periods." };

  const sanitized = sanitizePeriods(periods);
  const err = validatePeriods(sanitized);
  if (err) return { error: err };

  try {
    const summaries = calculateSalaryHistory(sanitized);
    const totalGross = summaries.reduce((sum, s) => sum + s.gross, 0);
    const totalTax = summaries.reduce((sum, s) => sum + s.tax, 0);
    const totalNet = summaries.reduce((sum, s) => sum + s.net, 0);
    const avgRate = totalGross > 0 ? (totalTax / totalGross) * 100 : 0;

    // Calculate approximate months worked from period dates
    let totalDays = 0;
    for (const p of sanitized) {
      const sTime = Date.parse(`${p.start}T00:00:00Z`);
      const eTime = Date.parse(`${p.end}T00:00:00Z`);
      if (eTime >= sTime) {
        totalDays += Math.round((eTime - sTime) / 86400000) + 1;
      }
    }
    const totalMonths = Math.max(1, Math.round(totalDays / 30.4375));

    return {
      result: { summaries, totalGross, totalTax, totalNet, totalMonths, avgRate, periods: sanitized },
    };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Invalid period values." };
  }
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

/** Fiscal years a period touches, e.g. "2024–2025" or "2024–2025, 2025–2026". */
function periodFiscalYears(p: SalaryPeriod): string {
  const first = fiscalYearOf(new Date(`${p.start}T00:00:00Z`));
  const last = fiscalYearOf(new Date(`${p.end}T00:00:00Z`));
  if (first === last) return fiscalLabel(first);
  return `${fiscalLabel(first)}, ${fiscalLabel(last)}`;
}

export default function MultiYearCalculator() {
  const [periods, setPeriods] = useState<SalaryPeriod[]>(createDefaultPeriods);
  const [calculatedResult, setCalculatedResult] = useState<MultiYearCalculationResult | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(true); // Multi-Year insights visible by default after calculation
  const [activeTab, setActiveTab] = useState<MultiInsightTab>("chart");
  const [validationError, setValidationError] = useState<string | null>(null);
  const resultRef = useRef<HTMLElement>(null);

  // Open a shared link: restore the periods and show the same result the sender saw.
  useEffect(() => {
    const shared = decodeMulti(window.location.search);
    if (!shared) return;
    const restored: SalaryPeriod[] = shared.periods.map((p, i) => ({
      id: i + 1,
      start: p.start,
      end: p.end,
      salary: formatWithCommas(p.salary),
      monthlyBonus: formatWithCommas(p.monthlyBonus) || "0",
      monthlyDeductions: formatWithCommas(p.monthlyDeductions) || "0",
      bonuses: [],
    }));
    const outcome = runCalculation(restored);
    /* eslint-disable react-hooks/set-state-in-effect -- one-time restore from the URL after mount */
    setPeriods(restored);
    if ("result" in outcome) {
      setCalculatedResult(outcome.result);
      setInsightsOpen(shared.insightsOpen);
      setActiveTab(shared.tab);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Editing any input invalidates the shown result (AGENTS.md: stale results are hidden)
  const markStale = () => {
    if (calculatedResult) {
      setIsStale(true);
      setCalculatedResult(null);
    }
    setValidationError(null);
  };

  // Period management
  const addPeriod = () => {
    const nextId = periods.length ? Math.max(...periods.map((p) => p.id)) + 1 : 1;
    let nextStart = "2025-07-01";
    let nextEnd = "2026-06-30";

    if (periods.length) {
      const lastEnd = periods[periods.length - 1].end;
      if (lastEnd && lastEnd < MAX_DATE) {
        const d = new Date(`${lastEnd}T00:00:00Z`);
        d.setUTCDate(d.getUTCDate() + 1);
        nextStart = d.toISOString().slice(0, 10);
        const endD = new Date(d);
        endD.setUTCFullYear(endD.getUTCFullYear() + 1);
        endD.setUTCDate(endD.getUTCDate() - 1);
        const endStr = endD.toISOString().slice(0, 10);
        nextEnd = endStr > MAX_DATE ? MAX_DATE : endStr;
      }
    }

    setPeriods([
      ...periods,
      {
        id: nextId,
        start: nextStart,
        end: nextEnd,
        salary: "",
        monthlyBonus: "0",
        monthlyDeductions: "0",
        bonuses: [],
      },
    ]);
    markStale();
  };

  const removePeriod = (id: number) => {
    if (periods.length <= 1) return;
    setPeriods(periods.filter((p) => p.id !== id));
    markStale();
  };

  const updatePeriod = (id: number, field: keyof SalaryPeriod, val: string) => {
    setPeriods(
      periods.map((p) => {
        if (p.id !== id) return p;
        return { ...p, [field]: val };
      })
    );
    markStale();
  };

  const handleReset = () => {
    setPeriods(createDefaultPeriods());
    setCalculatedResult(null);
    setIsStale(false);
    setInsightsOpen(true);
    setActiveTab("chart");
    setValidationError(null);
    // Forget a previously opened shared link, so a reload does not bring it back.
    if (window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const handleCalculate = () => {
    const outcome = runCalculation(periods);
    if ("error" in outcome) {
      setValidationError(outcome.error);
      setCalculatedResult(null);
      return;
    }
    setCalculatedResult(outcome.result);
    setValidationError(null);
    setIsStale(false);
    setInsightsOpen(true); // Default to visible on valid calculation
    setActiveTab("chart");
    // On small screens the result sits below the form: bring it into view.
    requestAnimationFrame(() =>
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  const hasResults = calculatedResult !== null;

  /** The link always describes the result on screen right now. */
  const getShareUrl = useCallback(() => {
    const source = calculatedResult?.periods ?? [];
    return buildShareUrl(
      window.location.origin,
      window.location.pathname,
      encodeMulti({
        periods: source.map((p) => ({
          start: p.start,
          end: p.end,
          salary: p.salary,
          monthlyBonus: p.monthlyBonus,
          monthlyDeductions: p.monthlyDeductions,
        })),
        insightsOpen,
        tab: activeTab,
      })
    );
  }, [calculatedResult, insightsOpen, activeTab]);

  const handleDownloadPdf = useCallback(async () => {
    if (!calculatedResult) return;
    const { downloadMultiReport } = await import("pdf-reports");
    await downloadMultiReport({
      generated: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      shareUrl: getShareUrl(),
      totalTax: calculatedResult.totalTax,
      totalGross: calculatedResult.totalGross,
      totalNet: calculatedResult.totalNet,
      totalMonths: calculatedResult.totalMonths,
      avgRate: calculatedResult.avgRate,
      years: calculatedResult.summaries.map((s) => ({
        label: fiscalLabel(s.year),
        gross: s.gross,
        tax: s.tax,
        net: s.net,
      })),
      periods: calculatedResult.periods.map((p, i) => ({
        n: i + 1,
        dates: `${formatDate(p.start)} - ${formatDate(p.end)}`,
        salary: cleanNumber(p.salary),
        bonus: cleanNumber(p.monthlyBonus),
        deductions: cleanNumber(p.monthlyDeductions),
        fiscalYears: periodFiscalYears(p).replace(/–/g, "-"),
      })),
    });
  }, [calculatedResult, getShareUrl]);

  const stackData =
    calculatedResult?.summaries.map((s) => ({
      label: fiscalLabel(s.year),
      gross: s.gross,
      tax: s.tax,
      net: s.net,
    })) ?? [];

  return (
    <div className="calc" id="salary-tool">
      <ModeTabs active="multi" />

      <div className="calc-grid">
        {/* ───────────────────────────────────── Salary history ───────────────────────────────────── */}
        <form
          className="calc-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleCalculate();
          }}
          noValidate
          style={{ gap: 24 }}
        >
          <div>
            <h2 className="calc-title">Salary history</h2>
            <p className="calc-sub">Add each period where your monthly salary stayed the same.</p>
          </div>

          <div className="notice">
            <InfoIcon />
            <ul>
              <li><strong>Dates you can enter:</strong> 1 Jul 2024 – 30 Jun 2027.</li>
              <li><strong>Mid-month changes are fine:</strong> only the days covered count.</li>
              <li><strong>One period per date:</strong> periods cannot overlap.</li>
            </ul>
          </div>

          {periods.map((period, index) => (
            <div key={period.id} className="period" role="group" aria-label={`Salary period ${index + 1}`}>
              <div className="period-head">
                <p className="period-title">
                  <span aria-hidden="true">{index + 1}</span>
                  Period {index + 1}
                </p>
                {periods.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-small"
                    onClick={() => removePeriod(period.id)}
                    aria-label={`Remove period ${index + 1}`}
                  >
                    <CloseIcon />
                    Remove
                  </button>
                )}
              </div>

              <div className="period-dates">
                <div className="field">
                  <label className="field-label" htmlFor={`start-${period.id}`}>Start date</label>
                  <input
                    id={`start-${period.id}`}
                    type="date"
                    className="control"
                    value={period.start}
                    min={MIN_DATE}
                    max={MAX_DATE}
                    onChange={(e) => updatePeriod(period.id, "start", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor={`end-${period.id}`}>End date</label>
                  <input
                    id={`end-${period.id}`}
                    type="date"
                    className="control"
                    value={period.end}
                    min={MIN_DATE}
                    max={MAX_DATE}
                    onChange={(e) => updatePeriod(period.id, "end", e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field-label" htmlFor={`sal-${period.id}`}>Monthly salary</label>
                <MoneyInput
                  id={`sal-${period.id}`}
                  large
                  value={period.salary}
                  onChange={(formatted) => updatePeriod(period.id, "salary", formatted)}
                  placeholder="Enter your monthly salary"
                />
                <p className="field-hint">What you earn each month in this period, before tax.</p>
              </div>

              <details className="disclosure">
                <summary>
                  <span className="disclosure-title">
                    <b>Additional fields (optional)</b>
                    <span>Regular monthly bonus and monthly deductions</span>
                  </span>
                </summary>
                <div className="disclosure-body">
                  <div className="field">
                    <label htmlFor={`bonus-${period.id}`}>Regular monthly bonus (Rs.)</label>
                    <MoneyInput
                      id={`bonus-${period.id}`}
                      value={period.monthlyBonus}
                      onChange={(formatted) => updatePeriod(period.id, "monthlyBonus", formatted)}
                      placeholder="0"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`ded-${period.id}`}>Monthly deductions (Rs.)</label>
                    <MoneyInput
                      id={`ded-${period.id}`}
                      value={period.monthlyDeductions}
                      onChange={(formatted) => updatePeriod(period.id, "monthlyDeductions", formatted)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </details>
            </div>
          ))}

          <button type="button" className="btn btn-add" onClick={addPeriod}>
            <PlusIcon />
            Add another period
          </button>

          {validationError && (
            <div className="alert alert-error" role="alert">
              {validationError}
            </div>
          )}
          {isStale && !validationError && (
            <div className="alert alert-info" role="status">
              Inputs changed. Click &quot;Calculate taxes&quot; to see the updated result.
            </div>
          )}

          <div className="btn-row">
            <button type="submit" className="btn btn-primary">
              Calculate taxes
              <ArrowRight />
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>

          <p className="fine-print">
            Private, browser-only calculations. All amounts are in Pakistani rupees (Rs.). Excludes
            special reliefs, credits, other income and super tax. Not tax advice.
          </p>
        </form>

        {/* ───────────────────────────────────── Result ───────────────────────────────────── */}
        <aside className="result" aria-label="Your result" ref={resultRef}>
          <div className="result-head">
            <h2 className="calc-title">Your result</h2>
            {hasResults && <span className="live-badge">Calculated</span>}
          </div>

          {!calculatedResult ? (
            <Empty
              lines={[
                "Tax for each fiscal year",
                "Total tax, gross and net income",
                "Average tax rate across all periods",
              ]}
            />
          ) : (
            <>
              <div className="hero-figure" aria-live="polite">
                <p className="lbl">
                  Total tax across {calculatedResult.periods.length}{" "}
                  {calculatedResult.periods.length === 1 ? "period" : "periods"}
                </p>
                <p className="num">{currency(calculatedResult.totalTax)}</p>
                <p className="sub">
                  {calculatedResult.totalMonths} months · Average effective rate{" "}
                  {calculatedResult.avgRate.toFixed(1)}%
                </p>
              </div>

              <dl className="mini-stats mini-stats-lg">
                <div className="mini-stat">
                  <dt>Total gross income</dt>
                  <dd>{currency(calculatedResult.totalGross)}</dd>
                </div>
                <div className="mini-stat">
                  <dt>Total net income</dt>
                  <dd>{currency(calculatedResult.totalNet)}</dd>
                </div>
              </dl>

              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Fiscal year breakdown</h3>
                <div className="rtable-scroll">
                  <table className="rtable rtable-fy">
                    <caption>Gross, tax and net income for each fiscal year</caption>
                    <thead>
                      <tr>
                        <th scope="col">Fiscal year</th>
                        <th scope="col">Gross</th>
                        <th scope="col">Tax</th>
                        <th scope="col">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculatedResult.summaries.map((s) => (
                        <tr key={s.year}>
                          <th scope="row">FY {fiscalLabel(s.year)}</th>
                          <td>{Math.round(s.gross).toLocaleString("en-US")}</td>
                          <td className="is-tax">{Math.round(s.tax).toLocaleString("en-US")}</td>
                          <td>{Math.round(s.net).toLocaleString("en-US")}</td>
                        </tr>
                      ))}
                      <tr className="is-total">
                        <th scope="row">Total</th>
                        <td>{Math.round(calculatedResult.totalGross).toLocaleString("en-US")}</td>
                        <td className="is-tax">{Math.round(calculatedResult.totalTax).toLocaleString("en-US")}</td>
                        <td>{Math.round(calculatedResult.totalNet).toLocaleString("en-US")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <ResultActions onPdf={handleDownloadPdf} getUrl={getShareUrl} />
            </>
          )}
        </aside>
      </div>

      {/* ───────────────────────────────────── Insights ───────────────────────────────────── */}
      {calculatedResult && (
        <section className="insights" aria-labelledby="insights-title">
          <InsightsHeader
            subtitle="See how your tax changed from year to year."
            open={insightsOpen}
            onToggle={() => setInsightsOpen((open) => !open)}
          />

          {insightsOpen && (
            <div className="insight-body" id="insights-body">
              <div className="seg" role="group" aria-label="Insight views">
                {(
                  [
                    ["chart", "Tax vs take-home"],
                    ["periods", "Salary periods"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={activeTab === key}
                    onClick={() => setActiveTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {activeTab === "chart" && (
                <div className="insight-body">
                  <div>
                    <h3 className="insight-h">Tax vs take-home by fiscal year</h3>
                    <p className="insight-p">
                      Each column is one fiscal year&apos;s gross income, split into what you keep and what goes
                      to tax.
                    </p>
                  </div>
                  <FyStackChart data={stackData} />
                  <div className="legend">
                    <div className="legend-item"><span className="dot dot-keep" aria-hidden="true" />You keep (net income)</div>
                    <div className="legend-item"><span className="dot dot-tax" aria-hidden="true" />Tax</div>
                  </div>
                  <ul className="legend" style={{ padding: 0, listStyle: "none", flexDirection: "column" }}>
                    {calculatedResult.summaries.map((s) => (
                      <li key={s.year} className="legend-item" style={{ flexWrap: "wrap" }}>
                        <b>FY {fiscalLabel(s.year)}</b>
                        <span className="val">
                          {pct(s.gross > 0 ? (s.tax / s.gross) * 100 : 0)} tax · {compactCurrency(s.tax)} of{" "}
                          {compactCurrency(s.gross)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "periods" && (
                <div className="insight-body">
                  <div>
                    <h3 className="insight-h">Your salary periods</h3>
                    <p className="insight-p">How each period was placed in a fiscal year.</p>
                  </div>
                  <div className="table-scroll">
                    <table className="wtable" style={{ minWidth: 680 }}>
                      <caption>Salary periods and the fiscal years they fall in</caption>
                      <thead>
                        <tr>
                          <th scope="col">Period</th>
                          <th scope="col">Dates</th>
                          <th scope="col" className="r">Monthly salary</th>
                          <th scope="col" className="r">Bonus / deductions</th>
                          <th scope="col">Fiscal year</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculatedResult.periods.map((p, i) => (
                          <tr key={p.id}>
                            <th scope="row" style={{ fontWeight: 600 }}>Period {i + 1}</th>
                            <td>{formatDate(p.start)} – {formatDate(p.end)}</td>
                            <td className="r">{currency(cleanNumber(p.salary))}</td>
                            <td className="r">
                              {currency(cleanNumber(p.monthlyBonus))} / {currency(cleanNumber(p.monthlyDeductions))}
                            </td>
                            <td>{periodFiscalYears(p)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="field-hint">
                    Tax is worked out per fiscal year (see the breakdown above), because salary from several periods
                    in one year is added together before it is taxed.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
