'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  calculateTax,
  currency,
  compactCurrency,
  FISCAL_YEARS,
  fiscalLabel,
  type FiscalYear,
} from "@/lib/tax";
import { cleanNumber, formatWithCommas } from "@/lib/format";
import {
  buildShareUrl,
  decodeSingle,
  encodeSingle,
  type InsightTab,
} from "@/lib/share";
import {
  BandTaxChart,
  ComparePairChart,
  SplitBarChart,
  YearsColumnChart,
  type BandBar,
  type YearBar,
} from "./charts";
import {
  ArrowRight,
  Empty,
  InsightsHeader,
  ModeTabs,
  MoneyInput,
  ResultActions,
  SelectField,
  chartColors,
  pct,
} from "./ui";
import "./calculator.css";

const MAX_MONTHLY = 1_000_000_000;

export default function SingleYearCalculator() {
  const [year, setYear] = useState<FiscalYear>("2026");
  const [salary, setSalary] = useState(""); // Starts empty (AGENTS.md)
  const [bonus, setBonus] = useState("0");
  const [deductions, setDeductions] = useState("0");
  const [withheld, setWithheld] = useState("0");
  const [comparison, setComparison] = useState<FiscalYear | "none">("2025");
  const [insightsOpen, setInsightsOpen] = useState(false); // Hidden by default (AGENTS.md)
  const [activeTab, setActiveTab] = useState<InsightTab>("overview");
  const [needSalary, setNeedSalary] = useState(false);

  const fyId = useId();
  const salId = useId();
  const bonusId = useId();
  const dedId = useId();
  const whId = useId();
  const cmpId = useId();
  const salaryRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLElement>(null);

  // Open a shared link: restore exactly what the sender saw.
  useEffect(() => {
    const shared = decodeSingle(window.location.search);
    if (!shared) return;
    /* eslint-disable react-hooks/set-state-in-effect -- one-time restore from the URL after mount */
    setYear(shared.year);
    setSalary(formatWithCommas(shared.salary));
    setBonus(formatWithCommas(shared.bonus) || "0");
    setDeductions(formatWithCommas(shared.deductions) || "0");
    setWithheld(formatWithCommas(shared.withheld) || "0");
    setComparison(shared.comparison);
    setInsightsOpen(shared.insightsOpen);
    setActiveTab(shared.tab);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Numeric values (calculations never receive formatted strings)
  const monthlySalary = cleanNumber(salary);
  const annualBonus = cleanNumber(bonus);
  const monthlyDeductions = cleanNumber(deductions);
  const taxWithheld = cleanNumber(withheld);

  // Bounds & results visibility
  const isAboveMax = monthlySalary > MAX_MONTHLY;
  const hasResults = monthlySalary > 0 && !isAboveMax;

  // Calculation (100% authoritative via lib/tax.ts — unchanged)
  const annualGross = isAboveMax ? 0 : monthlySalary * 12 + annualBonus;
  const monthlyGross = isAboveMax ? 0 : annualGross / 12;

  const result = useMemo(() => {
    const empty = {
      income: 0,
      tax: 0,
      baseTax: 0,
      surcharge: 0,
      takeHome: 0,
      marginal: 0,
      effective: 0,
      bands: [] as ReturnType<typeof calculateTax>["bands"],
    };
    if (!hasResults) return empty;
    try {
      return calculateTax({ income: annualGross, year });
    } catch {
      return empty;
    }
  }, [annualGross, year, hasResults]);

  const annualTax = result.tax;
  const monthlyTax = annualTax / 12;
  const annualDeductions = monthlyDeductions * 12;
  const annualNet = Math.max(0, annualGross - annualTax - annualDeductions);
  const monthlyNet = Math.max(0, monthlyGross - monthlyTax - monthlyDeductions);
  const effectiveRate = annualGross > 0 ? (annualTax / annualGross) * 100 : 0;
  const marginalRate = result.marginal;
  const keptAfterTax = Math.max(0, 100 - effectiveRate);
  const taxStillDue = Math.max(0, annualTax - taxWithheld);

  // Comparison with one other fiscal year
  const comparisonResult = useMemo(() => {
    if (!hasResults || comparison === "none" || isAboveMax || annualGross === 0) return null;
    try {
      const prev = calculateTax({ income: annualGross, year: comparison });
      const annualDiff = prev.tax - annualTax;
      return {
        prev,
        annualDiff,
        isSaving: annualDiff > 0.005,
        isIncrease: annualDiff < -0.005,
      };
    } catch {
      return null;
    }
  }, [annualGross, comparison, annualTax, isAboveMax, hasResults]);

  // The same income in every supported fiscal year
  const allYears = useMemo(() => {
    if (!hasResults || annualGross === 0) return [];
    return FISCAL_YEARS.map((fy) => {
      const res = calculateTax({ income: annualGross, year: fy });
      return {
        year: fy,
        annualTax: res.tax,
        monthlyTax: res.tax / 12,
        effective: res.effective,
        diff: res.tax - annualTax,
      };
    });
  }, [annualGross, annualTax, hasResults]);

  /* ────────────────────────────────────────── actions ────────────────────────────────────────── */

  const handleReset = () => {
    setYear("2026");
    setSalary("");
    setBonus("0");
    setDeductions("0");
    setWithheld("0");
    setComparison("2025");
    setInsightsOpen(false);
    setActiveTab("overview");
    setNeedSalary(false);
    // Forget a previously opened shared link, so a reload does not bring it back.
    if (window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const handleCalculate = () => {
    if (!hasResults) {
      setNeedSalary(true);
      salaryRef.current?.focus();
      return;
    }
    setNeedSalary(false);
    setSalary(formatWithCommas(salary));
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /** The link always describes the state on screen right now. */
  const getShareUrl = useCallback(
    () =>
      buildShareUrl(
        window.location.origin,
        window.location.pathname,
        encodeSingle({
          year,
          salary,
          bonus,
          deductions,
          withheld,
          comparison,
          insightsOpen,
          tab: activeTab,
        })
      ),
    [year, salary, bonus, deductions, withheld, comparison, insightsOpen, activeTab]
  );

  const handleDownloadPdf = useCallback(async () => {
    const { downloadSingleReport } = await import("pdf-reports");
    await downloadSingleReport({
      generated: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      shareUrl: getShareUrl(),
      yearLabel: fiscalLabel(year),
      monthlySalary,
      annualBonus,
      monthlyDeductions,
      taxWithheld,
      annualGross,
      monthlyGross,
      annualTax,
      monthlyTax,
      annualNet,
      monthlyNet,
      effective: effectiveRate,
      marginal: marginalRate,
      taxStillDue,
      baseTax: result.baseTax,
      surcharge: result.surcharge,
      bands: result.bands,
      comparison:
        comparison !== "none" && comparisonResult
          ? { label: fiscalLabel(comparison), tax: comparisonResult.prev.tax, diff: comparisonResult.annualDiff }
          : null,
      allYears: allYears.map((y) => ({
        label: fiscalLabel(y.year),
        tax: y.annualTax,
        effective: y.effective,
        selected: y.year === year,
      })),
    });
  }, [
    getShareUrl, year, monthlySalary, annualBonus, monthlyDeductions, taxWithheld, annualGross, monthlyGross,
    annualTax, monthlyTax, annualNet, monthlyNet, effectiveRate, marginalRate, taxStillDue, result,
    comparison, comparisonResult, allYears,
  ]);

  /* ────────────────────────────────────── chart / table data ────────────────────────────────────── */

  const deductionShare = Math.min(annualDeductions, Math.max(0, annualGross - annualTax));
  const splitParts = [
    { key: "net", label: "Take-home", value: annualNet, color: chartColors.keep },
    ...(deductionShare > 0
      ? [{ key: "ded", label: "Deductions", value: deductionShare, color: chartColors.deduction }]
      : []),
    { key: "tax", label: "Tax", value: annualTax, color: chartColors.tax },
  ];
  const takeHomePct = annualGross > 0 ? (annualNet / annualGross) * 100 : 0;
  const taxPct = annualGross > 0 ? (annualTax / annualGross) * 100 : 0;
  const dedPct = annualGross > 0 ? (deductionShare / annualGross) * 100 : 0;

  const yearBars: YearBar[] = allYears.map((y) => ({
    label: fiscalLabel(y.year),
    tax: y.annualTax,
    effective: y.effective,
    role: y.year === year ? "selected" : y.year === comparison ? "compare" : "other",
  }));

  const activeBands = result.bands.filter((b) => b.income > 0);
  const topBand = activeBands[activeBands.length - 1];
  const bandRange = (lower: number, upper: number) =>
    lower === 0
      ? `Up to ${currency(upper)}`
      : Number.isFinite(upper)
        ? `${currency(lower + 1)} – ${Math.round(upper).toLocaleString("en-US")}`
        : `Above ${currency(lower)}`;
  const bandBars: BandBar[] = activeBands.map((b) => ({
    rate: `${+b.rate.toFixed(2)}%`,
    range: bandRange(b.lower, b.upper),
    income: b.income,
    tax: b.tax,
    top: b === topBand,
  }));
  const maxBandIncome = Math.max(...activeBands.map((b) => b.income), 1);

  return (
    <div className="calc" id="salary-tool">
      <ModeTabs active="single" />

      <div className="calc-grid">
        {/* ───────────────────────────────────── Form ───────────────────────────────────── */}
        <form
          className="calc-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleCalculate();
          }}
          noValidate
        >
          <h2 className="calc-title">Your details</h2>

          <div className="field">
            <label htmlFor={fyId} className="field-label">
              <span className="step-num" aria-hidden="true">1</span>
              Fiscal year
            </label>
            <SelectField
              id={fyId}
              value={year}
              onChange={(value) => {
                const newYear = value as FiscalYear;
                setYear(newYear);
                if (comparison === newYear) {
                  setComparison(FISCAL_YEARS.find((y) => y !== newYear) ?? "2025");
                }
              }}
            >
              {FISCAL_YEARS.map((fy) => (
                <option key={fy} value={fy}>
                  {fiscalLabel(fy)}
                </option>
              ))}
            </SelectField>
            <p className="field-hint">A fiscal year runs from July to June.</p>
          </div>

          <div className="field">
            <label htmlFor={salId} className="field-label">
              <span className="step-num" aria-hidden="true">2</span>
              Monthly salary
            </label>
            <MoneyInput
              id={salId}
              inputRef={salaryRef}
              large
              value={salary}
              onChange={(v) => {
                setSalary(v);
                setNeedSalary(false);
              }}
              placeholder="Enter your Salary"
              invalid={isAboveMax || needSalary}
              describedBy={`${salId}-hint`}
            />
            <p className="field-hint" id={`${salId}-hint`}>
              What you earn each month, before tax.
            </p>
            {isAboveMax && (
              <div className="alert alert-error" role="alert">
                Enter a monthly salary between Rs. 1 and Rs. 1,000,000,000.
              </div>
            )}
            {needSalary && !isAboveMax && (
              <div className="alert alert-error" role="alert">
                Enter your monthly salary to see your tax.
              </div>
            )}
          </div>

          <details className="disclosure">
            <summary>
              <span className="disclosure-title">
                <b>Additional fields (optional)</b>
                <span>Bonus, deductions and tax already paid</span>
              </span>
            </summary>
            <div className="disclosure-body">
              <div className="field">
                <label htmlFor={bonusId}>Annual bonus (Rs.)</label>
                <MoneyInput id={bonusId} value={bonus} onChange={setBonus} placeholder="0" />
              </div>
              <div className="field">
                <label htmlFor={dedId}>Monthly deductions (Rs.)</label>
                <MoneyInput id={dedId} value={deductions} onChange={setDeductions} placeholder="0" />
              </div>
              <div className="field">
                <label htmlFor={whId}>Tax already withheld (Rs.)</label>
                <MoneyInput id={whId} value={withheld} onChange={setWithheld} placeholder="0" />
              </div>
            </div>
          </details>

          <div className="field">
            <label htmlFor={cmpId} className="field-label">
              <span className="step-num" aria-hidden="true">3</span>
              Compare with <span className="opt">(another year)</span>
            </label>
            <SelectField
              id={cmpId}
              value={comparison}
              onChange={(value) => setComparison(value as FiscalYear | "none")}
            >
              {FISCAL_YEARS.filter((fy) => fy !== year).map((fy) => (
                <option key={fy} value={fy}>
                  FY {fiscalLabel(fy)}
                </option>
              ))}
              <option value="none">No comparison</option>
            </SelectField>
            <p className="field-hint">See how your tax changed between two years.</p>
          </div>

          <div className="btn-row">
            <button type="submit" className="btn btn-primary">
              Calculate tax
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
            {hasResults && <span className="live-badge">Live estimate</span>}
          </div>

          {!hasResults ? (
            <Empty
              lines={[
                "Tax you pay each month",
                "Salary you take home each month",
                "Tax for the full year",
              ]}
            />
          ) : (
            <>
              <div className="hero-figure" aria-live="polite">
                <p className="lbl">Annual tax due · FY {fiscalLabel(year)}</p>
                <p className="num">{currency(annualTax)}</p>
                <p className="sub">
                  Effective rate {pct(effectiveRate)} · Marginal rate {pct(marginalRate)}
                </p>
              </div>

              <table className="rtable">
                <caption>Monthly and annual breakdown</caption>
                <thead>
                  <tr>
                    <th scope="col">Rs.</th>
                    <th scope="col">Monthly</th>
                    <th scope="col">Annual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Gross income</th>
                    <td>{Math.round(monthlyGross).toLocaleString("en-US")}</td>
                    <td>{Math.round(annualGross).toLocaleString("en-US")}</td>
                  </tr>
                  <tr>
                    <th scope="row">Tax</th>
                    <td className="is-tax">{Math.round(monthlyTax).toLocaleString("en-US")}</td>
                    <td className="is-tax">{Math.round(annualTax).toLocaleString("en-US")}</td>
                  </tr>
                  {monthlyDeductions > 0 && (
                    <tr>
                      <th scope="row">Deductions</th>
                      <td>{Math.round(monthlyDeductions).toLocaleString("en-US")}</td>
                      <td>{Math.round(annualDeductions).toLocaleString("en-US")}</td>
                    </tr>
                  )}
                  <tr className="is-total">
                    <th scope="row">Net income</th>
                    <td>{Math.round(monthlyNet).toLocaleString("en-US")}</td>
                    <td>{Math.round(annualNet).toLocaleString("en-US")}</td>
                  </tr>
                </tbody>
              </table>

              {comparisonResult && comparison !== "none" && (
                <div className="compare-banner">
                  <div className="left">
                    <span className="compare-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 18 18">
                        <path
                          d={comparisonResult.isIncrease ? "M9 15V3M4 8l5-5 5 5" : "M9 3v12M4 10l5 5 5-5"}
                          fill="none"
                          stroke="#0B3D2E"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <div>
                      <p className="tag">
                        {comparisonResult.isSaving
                          ? "LOWER TAX"
                          : comparisonResult.isIncrease
                            ? "HIGHER TAX"
                            : "SAME TAX"}
                      </p>
                      <p>Compared with FY {fiscalLabel(comparison)}</p>
                    </div>
                  </div>
                  <p className="amount">
                    {currency(Math.abs(comparisonResult.annualDiff))} <small>/ yr</small>
                  </p>
                </div>
              )}

              <dl className="mini-stats">
                <div className="mini-stat">
                  <dt>Kept after tax</dt>
                  <dd>{pct(keptAfterTax)}</dd>
                </div>
                <div className="mini-stat">
                  <dt>Net / month</dt>
                  <dd>{compactCurrency(monthlyNet)}</dd>
                </div>
                <div className="mini-stat">
                  <dt>Tax still due</dt>
                  <dd>{currency(taxStillDue)}</dd>
                </div>
              </dl>

              <ResultActions onPdf={handleDownloadPdf} getUrl={getShareUrl} />
            </>
          )}
        </aside>
      </div>

      {/* ───────────────────────────────────── Insights ───────────────────────────────────── */}
      {hasResults && (
        <section className="insights" aria-labelledby="insights-title">
          <InsightsHeader
            subtitle="See where your salary goes, year by year and band by band."
            open={insightsOpen}
            onToggle={() => setInsightsOpen((open) => !open)}
          />

          {insightsOpen && (
            <div className="insight-body" id="insights-body">
              <div className="seg" role="group" aria-label="Insight views">
                {(
                  [
                    ["overview", "Overview"],
                    ["comparison", "Fiscal year comparison"],
                    ["bands", "Tax bands"],
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

              {activeTab === "overview" && (
                <div className="insight-body">
                  <div>
                    <h3 className="insight-h">Where your salary goes</h3>
                    <p className="insight-p">Every year, out of {currency(annualGross)}.</p>
                  </div>
                  <SplitBarChart
                    parts={splitParts}
                    total={annualGross}
                    summary={`Of every Rs. 100 you earn, Rs. ${takeHomePct.toFixed(2)} is take-home and Rs. ${taxPct.toFixed(2)} is tax`}
                  />
                  <div className="legend">
                    <div className="legend-item">
                      <span className="dot dot-keep" aria-hidden="true" />
                      <b>You keep</b>
                      <span className="val">{currency(annualNet)} · {pct(takeHomePct)}</span>
                    </div>
                    {deductionShare > 0 && (
                      <div className="legend-item">
                        <span className="dot dot-old" aria-hidden="true" />
                        <b>Deductions</b>
                        <span className="val">{currency(deductionShare)} · {pct(dedPct)}</span>
                      </div>
                    )}
                    <div className="legend-item">
                      <span className="dot dot-tax" aria-hidden="true" />
                      <b>Tax</b>
                      <span className="val">{currency(annualTax)} · {pct(taxPct)}</span>
                    </div>
                  </div>
                  <div className="tiles">
                    <div className="tile">
                      <p>Gross salary</p>
                      <p>{currency(monthlyGross)}</p>
                    </div>
                    <div className="tile tile-tax">
                      <p>Tax</p>
                      <p>{currency(monthlyTax)}</p>
                    </div>
                    <div className="tile tile-keep">
                      <p>Take-home</p>
                      <p>{currency(monthlyNet)}</p>
                    </div>
                  </div>
                  <p className="field-hint" style={{ marginTop: -12 }}>
                    Tiles show the monthly figure.
                  </p>
                  <p className="kept-line">
                    For every Rs. 100 you earn, <strong>Rs. {takeHomePct.toFixed(2)}</strong> is take-home and{" "}
                    <strong>Rs. {taxPct.toFixed(2)}</strong> goes to tax.
                  </p>
                </div>
              )}

              {activeTab === "comparison" && (
                <div className="insight-body">
                  {comparisonResult && comparison !== "none" ? (
                    <>
                      <div className="cmp-head">
                        <div>
                          <h3 className="insight-h">
                            FY {fiscalLabel(year)} compared with FY {fiscalLabel(comparison)}
                          </h3>
                          <p className="insight-p">
                            Same income of {currency(annualGross)} a year, taxed with each year&apos;s rates.
                          </p>
                        </div>
                        <span className={`pill-green${comparisonResult.isIncrease ? " pill-amber" : ""}`}>
                          {comparisonResult.isSaving
                            ? `${currency(comparisonResult.annualDiff)} less tax per year`
                            : comparisonResult.isIncrease
                              ? `${currency(-comparisonResult.annualDiff)} more tax per year`
                              : "Same tax in both years"}
                        </span>
                      </div>
                      <div className="chart-grid">
                        <ComparePairChart
                          title="Tax per year"
                          rows={[
                            { label: `FY ${fiscalLabel(comparison)}`, value: comparisonResult.prev.tax, color: chartColors.old },
                            { label: `FY ${fiscalLabel(year)}`, value: annualTax, color: chartColors.keep },
                          ]}
                        />
                        <ComparePairChart
                          title="Take-home per year"
                          rows={[
                            {
                              label: `FY ${fiscalLabel(comparison)}`,
                              value: Math.max(0, annualGross - comparisonResult.prev.tax - annualDeductions),
                              color: chartColors.old,
                            },
                            { label: `FY ${fiscalLabel(year)}`, value: annualNet, color: chartColors.keep },
                          ]}
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <h3 className="insight-h">Fiscal year comparison</h3>
                      <p className="insight-p">
                        Pick a year in &ldquo;Compare with&rdquo; to see two years side by side. The chart below
                        always shows every year.
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="insight-h">The same income in every fiscal year</h3>
                    <p className="insight-p">Annual tax on {currency(annualGross)}.</p>
                  </div>
                  <YearsColumnChart data={yearBars} />
                  <div className="legend">
                    <div className="legend-item"><span className="dot dot-keep" aria-hidden="true" />Selected year</div>
                    {comparison !== "none" && (
                      <div className="legend-item"><span className="dot dot-old" aria-hidden="true" />Compared year</div>
                    )}
                    <div className="legend-item"><span className="dot" style={{ background: "#C5D6CB" }} aria-hidden="true" />Other years</div>
                  </div>
                  <div className="table-scroll">
                    <table className="wtable" style={{ minWidth: 560 }}>
                      <caption>Annual tax in each fiscal year</caption>
                      <thead>
                        <tr>
                          <th scope="col">Fiscal year</th>
                          <th scope="col" className="r">Annual tax</th>
                          <th scope="col" className="r">Monthly tax</th>
                          <th scope="col" className="r">Effective rate</th>
                          <th scope="col" className="r">vs. selected year</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allYears.map((y) => (
                          <tr key={y.year} className={y.year === year ? "row-selected" : undefined}>
                            <th scope="row">FY {fiscalLabel(y.year)}{y.year === year ? " (selected)" : ""}</th>
                            <td className="r">{currency(y.annualTax)}</td>
                            <td className="r">{currency(y.monthlyTax)}</td>
                            <td className="r">{pct(y.effective)}</td>
                            <td className={`r ${y.diff > 0.005 ? "up" : y.diff < -0.005 ? "down" : ""}`}>
                              {y.year === year
                                ? "—"
                                : `${y.diff > 0 ? "+" : y.diff < 0 ? "−" : ""}${currency(Math.abs(y.diff))}`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "bands" && (
                <div className="insight-body">
                  <div>
                    <h3 className="insight-h">Your tax, band by band</h3>
                    <p className="insight-p">
                      FY {fiscalLabel(year)} · yearly income of {currency(annualGross)}. Each part of your
                      income is taxed at its own rate.
                    </p>
                  </div>
                  <BandTaxChart data={bandBars} />
                  <div className="table-scroll">
                    <table className="wtable">
                      <caption>Tax by income band</caption>
                      <thead>
                        <tr>
                          <th scope="col">Yearly income band</th>
                          <th scope="col">Rate</th>
                          <th scope="col" style={{ width: "34%" }}>Your income in this band</th>
                          <th scope="col" className="r">Tax</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeBands.map((b) => {
                          const isTop = b === topBand;
                          return (
                            <tr key={b.lower} className={isTop ? "is-top" : undefined}>
                              <th scope="row">
                                {bandRange(b.lower, b.upper)}
                                {isTop && <span className="badge-top">Your top band</span>}
                              </th>
                              <td><strong>{+b.rate.toFixed(2)}%</strong></td>
                              <td>
                                <div className="band-bar">
                                  <i style={{ width: `${Math.max(2, (b.income / maxBandIncome) * 70)}%` }} />
                                  <span>{Math.round(b.income).toLocaleString("en-US")}</span>
                                </div>
                              </td>
                              <td className="r"><strong>{currency(b.tax)}</strong></td>
                            </tr>
                          );
                        })}
                        {result.surcharge > 0 && (
                          <tr>
                            <th scope="row" colSpan={3}>Surcharge on income above Rs. 10,000,000</th>
                            <td className="r"><strong>{currency(result.surcharge)}</strong></td>
                          </tr>
                        )}
                        <tr className="is-sum">
                          <th scope="row" colSpan={3}>Total tax for the year</th>
                          <td className="r">{currency(annualTax)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
