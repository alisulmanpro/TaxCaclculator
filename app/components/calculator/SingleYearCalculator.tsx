'use client';

import { useState, useId, useMemo } from "react";
import Link from "next/link";
import {
  calculateTax,
  currency,
  compactCurrency,
  FISCAL_YEARS,
  fiscalLabel,
  type FiscalYear,
} from "@/lib/tax";
import {
  formatWithCommas,
  cleanNumber,
  handleFormattedInputChange,
  handleFormattedInputKeyDown,
} from "@/lib/format";
import "./calculator.css";

export default function SingleYearCalculator() {
  const [year, setYear] = useState<FiscalYear>("2026");
  const [salary, setSalary] = useState(""); // Starts empty
  const [bonus, setBonus] = useState("0");
  const [deductions, setDeductions] = useState("0");
  const [withheld, setWithheld] = useState("0");
  const [comparison, setComparison] = useState<FiscalYear | "none">("2025");
  const [insightsOpen, setInsightsOpen] = useState(false); // Hidden by default
  const [activeTab, setActiveTab] = useState<"overview" | "comparison" | "bands">("overview");
  const [hoveredBar, setHoveredBar] = useState<"gross" | "tax" | "net" | null>("net");
  const [copied, setCopied] = useState(false);

  // Form IDs for accessibility
  const fyId = useId();
  const salId = useId();
  const bonusId = useId();
  const dedId = useId();
  const whId = useId();
  const cmpId = useId();

  // Numeric values
  const monthlySalary = cleanNumber(salary);
  const annualBonus = cleanNumber(bonus);
  const monthlyDeductions = cleanNumber(deductions);
  const taxWithheld = cleanNumber(withheld);

  // Bounds & Results Visibility
  const isAboveMax = monthlySalary > 1000000000;
  const hasResults = monthlySalary > 0 && !isAboveMax;

  // Calculation Logic (100% authoritative via lib/tax.ts)
  const annualGross = isAboveMax ? 0 : monthlySalary * 12 + annualBonus;
  const monthlyGross = isAboveMax ? 0 : annualGross / 12;

  const result = useMemo(() => {
    if (!hasResults) {
      return {
        income: 0,
        tax: 0,
        baseTax: 0,
        surcharge: 0,
        takeHome: 0,
        marginal: 0,
        effective: 0,
        bands: [],
      };
    }
    try {
      return calculateTax({ income: annualGross, year });
    } catch {
      return {
        income: 0,
        tax: 0,
        baseTax: 0,
        surcharge: 0,
        takeHome: 0,
        marginal: 0,
        effective: 0,
        bands: [],
      };
    }
  }, [annualGross, year, hasResults]);

  const annualTax = result.tax;
  const monthlyTax = annualTax / 12;
  const annualNet = Math.max(0, annualGross - annualTax - monthlyDeductions * 12);
  const monthlyNet = Math.max(0, monthlyGross - monthlyTax - monthlyDeductions);
  const effectiveRate = annualGross > 0 ? (annualTax / annualGross) * 100 : 0;
  const marginalRate = result.marginal;
  const netPercent = Math.max(0, 100 - effectiveRate);
  const taxStillDue = Math.max(0, annualTax - taxWithheld);

  // Comparison Calculations
  const comparisonResult = useMemo(() => {
    if (!hasResults || comparison === "none" || isAboveMax || annualGross === 0) return null;
    try {
      const prev = calculateTax({ income: annualGross, year: comparison });
      const annualDiff = prev.tax - annualTax;
      const monthlyDiff = annualDiff / 12;
      const isSaving = annualDiff > 0.005;
      const isIncrease = annualDiff < -0.005;
      return {
        prev,
        annualDiff,
        monthlyDiff,
        isSaving,
        isIncrease,
      };
    } catch {
      return null;
    }
  }, [annualGross, comparison, annualTax, isAboveMax, hasResults]);

  // Full 7-year comparison for the comparison tab
  const allYearComparisons = useMemo(() => {
    if (!hasResults || annualGross === 0) return [];
    return FISCAL_YEARS.map((fy) => {
      const res = calculateTax({ income: annualGross, year: fy });
      const diff = res.tax - annualTax;
      return {
        year: fy,
        annualTax: res.tax,
        monthlyTax: res.tax / 12,
        effective: res.effective,
        diff,
      };
    });
  }, [annualGross, annualTax, hasResults]);

  // Actions
  const handleReset = () => {
    setYear("2026");
    setSalary("");
    setBonus("0");
    setDeductions("0");
    setWithheld("0");
    setComparison("2025");
    setInsightsOpen(false);
    setActiveTab("overview");
    setHoveredBar("net");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleDownloadPdf = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Bar chart proportional heights
  const maxBarVal = Math.max(monthlyGross, 1);
  const grossHeightPercent = 100;
  const taxHeightPercent = monthlyGross > 0 ? Math.max(6, Math.min(100, (monthlyTax / maxBarVal) * 100)) : 0;
  const netHeightPercent = monthlyGross > 0 ? Math.max(6, Math.min(100, (monthlyNet / maxBarVal) * 100)) : 0;

  return (
    <div className="calc-card" id="salary-tool">
      {/* Tab Switcher: Single Year active, Multi-Year navigates to /multi-year-calculator */}
      <div className="calc-tabs-bar">
        <div className="calc-tabs-track" role="tablist" aria-label="Tax calculation mode">
          <button
            type="button"
            role="tab"
            aria-selected="true"
            className="calc-tab on"
          >
            Single Year
          </button>
          <Link
            href="/multi-year-calculator"
            role="tab"
            aria-selected="false"
            className="calc-tab"
          >
            Multi-Year
          </Link>
        </div>
      </div>

      {/* Calculator Body: Compact single column when empty, 2 columns when calculated */}
      <div className={`calc-body ${!hasResults ? "no-results" : ""}`}>
        {/* Left Column: Your details */}
        <div className="calc-col">
          <h2 className="calc-h2">Your details</h2>

          {/* Fiscal year */}
          <div>
            <label htmlFor={fyId} className="calc-label">
              Fiscal year
            </label>
            <select
              id={fyId}
              className="calc-select"
              value={year}
              onChange={(e) => {
                const newYear = e.target.value as FiscalYear;
                setYear(newYear);
                if (comparison === newYear) {
                  const alt = FISCAL_YEARS.find((y) => y !== newYear) ?? "2025";
                  setComparison(alt);
                }
              }}
            >
              {FISCAL_YEARS.map((fy) => (
                <option key={fy} value={fy}>
                  {fiscalLabel(fy)}
                </option>
              ))}
            </select>
          </div>

          {/* Monthly salary */}
          <div>
            <label htmlFor={salId} className="calc-label">
              Monthly salary (Rs.)
            </label>
            <input
              id={salId}
              className="calc-input"
              value={salary}
              inputMode="numeric"
              placeholder="Enter your Salary"
              onChange={(e) => handleFormattedInputChange(e, setSalary)}
              onKeyDown={(e) => handleFormattedInputKeyDown(e, setSalary)}
            />
          </div>

          {/* Optional additional fields */}
          <details className="calc-details" open={false}>
            <summary>Additional fields (optional)</summary>
            <div className="calc-details-body">
              <div>
                <label htmlFor={bonusId} className="calc-label">
                  Annual bonus (Rs.)
                </label>
                <input
                  id={bonusId}
                  className="calc-input"
                  value={bonus}
                  inputMode="numeric"
                  placeholder="0"
                  onChange={(e) => handleFormattedInputChange(e, setBonus)}
                  onKeyDown={(e) => handleFormattedInputKeyDown(e, setBonus)}
                />
              </div>

              <div>
                <label htmlFor={dedId} className="calc-label">
                  Monthly deductions (Rs.)
                </label>
                <input
                  id={dedId}
                  className="calc-input"
                  value={deductions}
                  inputMode="numeric"
                  placeholder="0"
                  onChange={(e) => handleFormattedInputChange(e, setDeductions)}
                  onKeyDown={(e) => handleFormattedInputKeyDown(e, setDeductions)}
                />
              </div>

              <div>
                <label htmlFor={whId} className="calc-label">
                  Tax already withheld (Rs.)
                </label>
                <input
                  id={whId}
                  className="calc-input"
                  value={withheld}
                  inputMode="numeric"
                  placeholder="0"
                  onChange={(e) => handleFormattedInputChange(e, setWithheld)}
                  onKeyDown={(e) => handleFormattedInputKeyDown(e, setWithheld)}
                />
              </div>
            </div>
          </details>

          {/* Compare with */}
          <div>
            <label htmlFor={cmpId} className="calc-label">
              Compare with
            </label>
            <select
              id={cmpId}
              className="calc-select"
              value={comparison}
              onChange={(e) => {
                setComparison(e.target.value as FiscalYear | "none");
              }}
            >
              {FISCAL_YEARS.filter((fy) => fy !== year).map((fy) => (
                <option key={fy} value={fy}>
                  FY {fiscalLabel(fy)}
                </option>
              ))}
              <option value="none">No comparison</option>
            </select>
          </div>

          {/* Error messages */}
          {isAboveMax && (
            <div className="calc-error" role="alert">
              Enter a monthly salary between Rs. 1 and Rs. 1,000,000,000.
            </div>
          )}

          {/* Action buttons */}
          <div className="calc-actions">
            <button
              type="button"
              className="calc-btn"
              onClick={() => {
                if (salary.trim()) setSalary(formatWithCommas(salary));
              }}
            >
              Calculate tax
            </button>
            <button
              type="button"
              className="calc-btn-ghost"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>

          <p className="calc-disclaimer">
            Private, browser-only calculations. All amounts in Pakistani rupees (Rs.).
            Excludes special reliefs, credits, other income and super tax. Not tax advice.
          </p>
        </div>

        {/* Right Column: Your result (Rendered ONLY when valid salary entered) */}
        {hasResults && (
          <div className="calc-col">
            <div className="calc-result-header">
              <h2 className="calc-h2">Your result</h2>
              <span className="calc-badge">
                Live estimate
              </span>
            </div>

            {/* Forest Result Hero Card */}
            <div className="calc-hero-card">
              <div className="calc-hero-top">Annual tax due</div>
              <div className="calc-hero-val">{currency(annualTax)}</div>
              <div className="calc-hero-sub">
                Effective rate {effectiveRate.toFixed(2)}% · Marginal rate {marginalRate}%
              </div>
            </div>

            {/* Monthly & Annual Mint Breakdown Cards */}
            <div className="calc-mint-grid">
              {/* Monthly */}
              <div className="calc-mint-card">
                <div className="calc-eyebrow">Monthly breakdown</div>
                <div className="calc-stat-key">Gross income</div>
                <div className="calc-stat-val">{currency(monthlyGross)}</div>
                <div className="calc-stat-key">Monthly tax</div>
                <div className="calc-stat-val is-tax">{currency(monthlyTax)}</div>
                <div className="calc-stat-key">Net income</div>
                <div className="calc-stat-val">{currency(monthlyNet)}</div>
              </div>

              {/* Annual */}
              <div className="calc-mint-card">
                <div className="calc-eyebrow">Annual breakdown</div>
                <div className="calc-stat-key">Gross income</div>
                <div className="calc-stat-val">{currency(annualGross)}</div>
                <div className="calc-stat-key">Annual tax</div>
                <div className="calc-stat-val is-tax">{currency(annualTax)}</div>
                <div className="calc-stat-key">Net income</div>
                <div className="calc-stat-val">{currency(annualNet)}</div>
              </div>
            </div>

            {/* Tax Saving / Comparison Strip */}
            {comparisonResult && (
              <div className="calc-savings-strip" aria-live="polite">
                <div>
                  <span className="calc-eyebrow">
                    {comparisonResult.isSaving
                      ? "Tax saving"
                      : comparisonResult.isIncrease
                      ? "Tax increase"
                      : "No change"}
                  </span>
                  <div className="calc-savings-msg">
                    {comparisonResult.isSaving
                      ? `You save ${currency(Math.abs(comparisonResult.monthlyDiff))} per month vs FY ${fiscalLabel(comparison as FiscalYear)}`
                      : comparisonResult.isIncrease
                      ? `You pay ${currency(Math.abs(comparisonResult.monthlyDiff))} more per month vs FY ${fiscalLabel(comparison as FiscalYear)}`
                      : `No tax difference compared with FY ${fiscalLabel(comparison as FiscalYear)}`}
                  </div>
                </div>
                <div className="calc-savings-diff">
                  {comparisonResult.isSaving
                    ? `− ${currency(Math.abs(comparisonResult.annualDiff))} / yr`
                    : comparisonResult.isIncrease
                    ? `+ ${currency(Math.abs(comparisonResult.annualDiff))} / yr`
                    : `${currency(0)} / yr`}
                </div>
              </div>
            )}

            {/* 4 Stat Tiles */}
            <div className="calc-tiles-grid">
              <div className="calc-tile">
                <div className="k">Effective rate</div>
                <div className="v">{effectiveRate.toFixed(2)}%</div>
              </div>
              <div className="calc-tile">
                <div className="k">Take-home share</div>
                <div className="v">{netPercent.toFixed(2)}%</div>
              </div>
              <div className="calc-tile">
                <div className="k">Net / month</div>
                <div className="v">{compactCurrency(monthlyNet)}</div>
              </div>
              <div className="calc-tile">
                <div className="k">Tax still due</div>
                <div className="v">
                  {taxWithheld > 0 && taxStillDue === 0
                    ? "Fully paid"
                    : compactCurrency(taxStillDue)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="calc-actions">
              <button
                type="button"
                className="calc-btn"
                onClick={() => setInsightsOpen((prev) => !prev)}
                aria-expanded={insightsOpen}
              >
                {insightsOpen ? "Hide Insights" : "Show Insights"}
              </button>
              <button
                type="button"
                className="calc-btn-ghost"
                onClick={handleDownloadPdf}
              >
                Download PDF
              </button>
              <button
                type="button"
                className="calc-btn-ghost"
                onClick={handleCopyLink}
              >
                {copied ? "Link copied! ✓" : "Copy shareable link"}
              </button>
            </div>
          </div>
        )}

        {/* Full-Width Insights Section (Revealed across full width when Show Insights is clicked) */}
        {hasResults && insightsOpen && (
          <div className="calc-insights-section">
            <div className="calc-subtabs" role="tablist" aria-label="Salary insights tabs">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "overview"}
                className={`calc-tab ${activeTab === "overview" ? "on" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "comparison"}
                className={`calc-tab ${activeTab === "comparison" ? "on" : ""}`}
                onClick={() => setActiveTab("comparison")}
              >
                Fiscal year comparison
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "bands"}
                className={`calc-tab ${activeTab === "bands" ? "on" : ""}`}
                onClick={() => setActiveTab("bands")}
              >
                Tax bands
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
              <div className="calc-tile" style={{ padding: "24px" }}>
                <div className="calc-cashflow-container">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "16px", color: "#14261D" }}>
                      Monthly cash flow
                    </div>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#4F5D55" }}>
                      Interactive breakdown of how your monthly salary is distributed.
                    </p>
                  </div>

                  {/* Active Bar Tooltip Display */}
                  <div className="calc-chart-tooltip" aria-live="polite">
                    <div>
                      <span className="calc-chart-tooltip-label">
                        {hoveredBar === "gross"
                          ? "Gross Monthly Salary"
                          : hoveredBar === "tax"
                          ? "Monthly Income Tax"
                          : "Monthly Net Take-Home"}
                      </span>
                      <div className="calc-chart-tooltip-val">
                        {hoveredBar === "gross"
                          ? currency(monthlyGross)
                          : hoveredBar === "tax"
                          ? currency(monthlyTax)
                          : currency(monthlyNet)}
                      </div>
                    </div>
                    <div style={{ fontSize: "12px", color: "#A9C7B8", textAlign: "right" }}>
                      {hoveredBar === "gross"
                        ? "100% of gross"
                        : hoveredBar === "tax"
                        ? `${((monthlyTax / monthlyGross) * 100).toFixed(1)}% of gross`
                        : `${((monthlyNet / monthlyGross) * 100).toFixed(1)}% of gross`}
                    </div>
                  </div>

                  {/* Interactive Chart Bars */}
                  <div className="calc-cashflow-chart">
                    {/* Gross */}
                    <div
                      className={`calc-chart-bar-item ${hoveredBar === "gross" ? "is-active" : ""}`}
                      onMouseEnter={() => setHoveredBar("gross")}
                      onClick={() => setHoveredBar("gross")}
                      tabIndex={0}
                      role="button"
                      aria-label={`Gross income: ${currency(monthlyGross)}`}
                    >
                      <div
                        className="calc-chart-bar-gross"
                        style={{ height: `${grossHeightPercent}%` }}
                      />
                    </div>

                    {/* Tax */}
                    <div
                      className={`calc-chart-bar-item ${hoveredBar === "tax" ? "is-active" : ""}`}
                      onMouseEnter={() => setHoveredBar("tax")}
                      onClick={() => setHoveredBar("tax")}
                      tabIndex={0}
                      role="button"
                      aria-label={`Monthly tax: ${currency(monthlyTax)}`}
                    >
                      <div
                        className="calc-chart-bar-tax"
                        style={{ height: `${taxHeightPercent}%` }}
                      />
                    </div>

                    {/* Net */}
                    <div
                      className={`calc-chart-bar-item ${hoveredBar === "net" ? "is-active" : ""}`}
                      onMouseEnter={() => setHoveredBar("net")}
                      onClick={() => setHoveredBar("net")}
                      tabIndex={0}
                      role="button"
                      aria-label={`Take-home: ${currency(monthlyNet)}`}
                    >
                      <div
                        className="calc-chart-bar-net"
                        style={{ height: `${netHeightPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Chart Labels */}
                  <div className="calc-chart-labels">
                    <div
                      className={hoveredBar === "gross" ? "is-active" : ""}
                      onMouseEnter={() => setHoveredBar("gross")}
                      onClick={() => setHoveredBar("gross")}
                    >
                      <b>Gross</b>
                      <br />
                      {compactCurrency(monthlyGross)}
                    </div>
                    <div
                      className={hoveredBar === "tax" ? "is-active" : ""}
                      onMouseEnter={() => setHoveredBar("tax")}
                      onClick={() => setHoveredBar("tax")}
                    >
                      <b>Tax</b>
                      <br />− {compactCurrency(monthlyTax)}
                    </div>
                    <div
                      className={hoveredBar === "net" ? "is-active" : ""}
                      onMouseEnter={() => setHoveredBar("net")}
                      onClick={() => setHoveredBar("net")}
                    >
                      <b>Take-home</b>
                      <br />
                      {compactCurrency(monthlyNet)}
                    </div>
                  </div>

                  <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #DDE3DF" }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#14261D" }}>
                      For every Rs. 100 earned
                    </div>
                    <div
                      className="calc-split-bar"
                      role="img"
                      aria-label={`${netPercent.toFixed(2)} rupees kept, ${effectiveRate.toFixed(2)} rupees tax`}
                    >
                      <div
                        className="calc-split-bar-net"
                        style={{ width: `${netPercent}%` }}
                      />
                      <div
                        className="calc-split-bar-tax"
                        style={{ width: `${effectiveRate}%` }}
                      />
                    </div>
                    <div className="calc-split-labels">
                      <span>Rs. {netPercent.toFixed(2)} you keep</span>
                      <span>Rs. {effectiveRate.toFixed(2)} tax</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Fiscal Year Comparison Table */}
            {activeTab === "comparison" && (
              <div className="calc-tile" style={{ padding: "24px" }}>
                <div style={{ fontWeight: 700, marginBottom: "6px", fontSize: "16px", color: "#14261D" }}>
                  Comparison across fiscal years (same gross income)
                </div>
                <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#4F5D55" }}>
                  See how the same gross income of {currency(annualGross)}/yr is taxed under different Finance Acts.
                </p>
                <div className="calc-table-wrap">
                  <table className="calc-table">
                    <thead>
                      <tr>
                        <th>Fiscal year</th>
                        <th>Annual tax</th>
                        <th>Monthly tax</th>
                        <th>Effective</th>
                        <th>Difference vs {fiscalLabel(year)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allYearComparisons.map((row) => (
                        <tr
                          key={row.year}
                          className={row.year === year ? "calc-row-highlight" : ""}
                        >
                          <td>
                            <b>FY {fiscalLabel(row.year)}</b>
                            {row.year === year && " (selected)"}
                          </td>
                          <td style={{ color: "#A3452E", fontWeight: 600 }}>
                            {currency(row.annualTax)}
                          </td>
                          <td>{currency(row.monthlyTax)}</td>
                          <td>{row.effective.toFixed(2)}%</td>
                          <td style={{ fontWeight: 600 }}>
                            {row.year === year
                              ? "—"
                              : row.diff > 0
                              ? `You save ${currency(row.diff)}`
                              : `You pay ${currency(Math.abs(row.diff))} more`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Tax Bands Table */}
            {activeTab === "bands" && (
              <div className="calc-tile" style={{ padding: "24px" }}>
                <div style={{ fontWeight: 700, marginBottom: "6px", fontSize: "16px", color: "#14261D" }}>
                  FY {fiscalLabel(year)} Progressive Tax Bands
                </div>
                <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#4F5D55" }}>
                  Pakistan personal income tax is progressive. Each portion of your income is taxed at its respective slab rate.
                </p>
                <div className="calc-table-wrap">
                  <table className="calc-table">
                    <thead>
                      <tr>
                        <th>Income slab</th>
                        <th>Rate</th>
                        <th>Taxable in slab</th>
                        <th>Tax in slab</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.bands.map((b, i) => (
                        <tr key={i}>
                          <td>
                            {currency(b.lower)} –{" "}
                            {b.upper === Infinity ? "Above" : currency(b.upper)}
                          </td>
                          <td>{b.rate}%</td>
                          <td>{currency(b.income)}</td>
                          <td style={{ color: b.tax > 0 ? "#A3452E" : "inherit" }}>
                            {currency(b.tax)}
                          </td>
                        </tr>
                      ))}
                      {result.surcharge > 0 && (
                        <tr style={{ background: "#FCEEED" }}>
                          <td colSpan={3}>
                            <b>Salary Surcharge (on income above Rs. 10M)</b>
                          </td>
                          <td style={{ color: "#A3452E", fontWeight: 700 }}>
                            {currency(result.surcharge)}
                          </td>
                        </tr>
                      )}
                      <tr className="calc-row-total">
                        <td colSpan={2}>
                          <b>Total</b>
                        </td>
                        <td>
                          <b>{currency(result.income)}</b>
                        </td>
                        <td style={{ color: "#A3452E" }}>
                          <b>{currency(result.tax)}</b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
