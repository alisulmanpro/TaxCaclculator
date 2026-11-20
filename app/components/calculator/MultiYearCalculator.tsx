'use client';

import { useState } from "react";
import Link from "next/link";
import {
  calculateSalaryHistory,
  validatePeriods,
  MIN_DATE,
  MAX_DATE,
  type SalaryPeriod,
  type YearSummary,
} from "@/lib/salary-history";
import { currency, compactCurrency, fiscalLabel } from "@/lib/tax";
import {
  cleanNumber,
  handleFormattedInputChange,
  handleFormattedInputKeyDown,
} from "@/lib/format";
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

export default function MultiYearCalculator() {
  const [periods, setPeriods] = useState<SalaryPeriod[]>(createDefaultPeriods);
  const [calculatedResult, setCalculatedResult] = useState<MultiYearCalculationResult | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(true); // Part 10: Multi-Year insights visible by default after calculation
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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
    // Stale handling: editing invalidates previous results
    if (calculatedResult) {
      setIsStale(true);
      setCalculatedResult(null);
    }
    setValidationError(null);
  };

  const removePeriod = (id: number) => {
    if (periods.length <= 1) return;
    setPeriods(periods.filter((p) => p.id !== id));
    if (calculatedResult) {
      setIsStale(true);
      setCalculatedResult(null);
    }
    setValidationError(null);
  };

  const updatePeriod = (id: number, field: keyof SalaryPeriod, val: string) => {
    setPeriods(
      periods.map((p) => {
        if (p.id !== id) return p;
        return { ...p, [field]: val };
      })
    );
    // Stale handling: editing invalidates previous results
    if (calculatedResult) {
      setIsStale(true);
      setCalculatedResult(null);
    }
    setValidationError(null);
  };

  // Actions
  const handleReset = () => {
    setPeriods(createDefaultPeriods());
    setCalculatedResult(null);
    setIsStale(false);
    setInsightsOpen(true);
    setValidationError(null);
    setCopied(false);
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

  const handleCalculate = () => {
    // Validate that every period has a salary entered
    const hasEmptySalary = periods.some(
      (p) => !p.salary || p.salary.trim() === "" || cleanNumber(p.salary) === 0
    );
    if (hasEmptySalary) {
      setValidationError("Please enter a valid monthly salary for all periods.");
      setCalculatedResult(null);
      return;
    }

    const sanitized = sanitizePeriods(periods);
    const err = validatePeriods(sanitized);
    if (err) {
      setValidationError(err);
      setCalculatedResult(null);
      return;
    }

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

      setCalculatedResult({
        summaries,
        totalGross,
        totalTax,
        totalNet,
        totalMonths,
        avgRate,
      });
      setValidationError(null);
      setIsStale(false);
      setInsightsOpen(true); // Default to visible on valid calculation
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid period values.";
      setValidationError(msg);
      setCalculatedResult(null);
    }
  };

  const hasResults = calculatedResult !== null;

  return (
    <div className="calc-card" id="salary-tool">
      {/* Tab Switcher: Single Year navigates to /, Multi-Year active */}
      <div className="calc-tabs-bar">
        <div className="calc-tabs-track" role="tablist" aria-label="Tax calculation mode">
          <Link
            href="/#calculator"
            role="tab"
            aria-selected="false"
            className="calc-tab"
          >
            Single Year
          </Link>
          <button
            type="button"
            role="tab"
            aria-selected="true"
            className="calc-tab on"
          >
            Multi-Year
          </button>
        </div>
      </div>

      {/* Calculator Body: Compact single column when empty, 2 columns when calculated */}
      <div className={`calc-body ${!hasResults ? "no-results" : ""}`}>
        {/* Left Column: Salary history */}
        <div className="calc-col">
          <div>
            <h2 className="calc-h2">Salary history</h2>
            <p className="calc-disclaimer" style={{ margin: "6px 0 0", fontSize: "14px" }}>
              Add each period where your monthly salary stayed the same.
            </p>
          </div>

          {/* Dates Guidance Notice */}
          <div className="calc-notice-box">
            <b>Dates you can enter:</b> 01 Jul 2024 – 30 Jun 2027. Each fiscal year uses its own rates.
            <br />
            <b>Mid-month changes are fine:</b> only days covered count.
            <br />
            <b>One period per date:</b> periods cannot overlap.
          </div>

          {/* Periods List */}
          {periods.map((period, index) => (
            <div key={period.id} className="calc-period-card">
              <div className="calc-period-header">
                <span className="calc-period-title">Period {index + 1}</span>
                {periods.length > 1 && (
                  <button
                    type="button"
                    className="calc-period-remove"
                    onClick={() => removePeriod(period.id)}
                    aria-label={`Remove period ${index + 1}`}
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Start & End Dates */}
              <div className="calc-dates-grid">
                <div>
                  <label className="calc-label" htmlFor={`start-${period.id}`}>
                    Start date
                  </label>
                  <input
                    id={`start-${period.id}`}
                    type="date"
                    className="calc-input"
                    value={period.start}
                    min={MIN_DATE}
                    max={MAX_DATE}
                    onChange={(e) => updatePeriod(period.id, "start", e.target.value)}
                  />
                </div>
                <div>
                  <label className="calc-label" htmlFor={`end-${period.id}`}>
                    End date
                  </label>
                  <input
                    id={`end-${period.id}`}
                    type="date"
                    className="calc-input"
                    value={period.end}
                    min={MIN_DATE}
                    max={MAX_DATE}
                    onChange={(e) => updatePeriod(period.id, "end", e.target.value)}
                  />
                </div>
              </div>

              {/* Monthly Salary */}
              <div>
                <label className="calc-label" htmlFor={`sal-${period.id}`}>
                  Monthly salary (Rs.)
                </label>
                <input
                  id={`sal-${period.id}`}
                  className="calc-input"
                  value={period.salary}
                  inputMode="numeric"
                  placeholder="Enter your monthly salary"
                  onChange={(e) =>
                    handleFormattedInputChange(e, (formatted) =>
                      updatePeriod(period.id, "salary", formatted)
                    )
                  }
                  onKeyDown={(e) =>
                    handleFormattedInputKeyDown(e, (formatted) =>
                      updatePeriod(period.id, "salary", formatted)
                    )
                  }
                />
              </div>

              {/* Optional Fields (Bonus & Deductions) */}
              <details className="calc-details" open={false}>
                <summary>Additional fields (optional)</summary>
                <div className="calc-details-body">
                  <div>
                    <label className="calc-label" htmlFor={`bonus-${period.id}`}>
                      Regular monthly bonus (Rs.)
                    </label>
                    <input
                      id={`bonus-${period.id}`}
                      className="calc-input"
                      value={period.monthlyBonus}
                      inputMode="numeric"
                      placeholder="0"
                      onChange={(e) =>
                        handleFormattedInputChange(e, (formatted) =>
                          updatePeriod(period.id, "monthlyBonus", formatted)
                        )
                      }
                      onKeyDown={(e) =>
                        handleFormattedInputKeyDown(e, (formatted) =>
                          updatePeriod(period.id, "monthlyBonus", formatted)
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="calc-label" htmlFor={`ded-${period.id}`}>
                      Monthly deductions (Rs.)
                    </label>
                    <input
                      id={`ded-${period.id}`}
                      className="calc-input"
                      value={period.monthlyDeductions}
                      inputMode="numeric"
                      placeholder="0"
                      onChange={(e) =>
                        handleFormattedInputChange(e, (formatted) =>
                          updatePeriod(period.id, "monthlyDeductions", formatted)
                        )
                      }
                      onKeyDown={(e) =>
                        handleFormattedInputKeyDown(e, (formatted) =>
                          updatePeriod(period.id, "monthlyDeductions", formatted)
                        )
                      }
                    />
                  </div>
                </div>
              </details>
            </div>
          ))}

          {/* Add Period Button */}
          <button
            type="button"
            className="calc-btn-ghost calc-btn-dashed"
            onClick={addPeriod}
          >
            + Add another period
          </button>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="calc-error" role="alert">
              {validationError}
            </div>
          )}

          {/* Stale Warning Banner */}
          {isStale && !validationError && (
            <div className="calc-stale-banner" role="status">
              Inputs changed. Click &quot;Calculate Taxes&quot; to calculate updated results.
            </div>
          )}

          {/* Calculate & Reset Actions */}
          <div className="calc-actions">
            <button
              type="button"
              className="calc-btn"
              onClick={handleCalculate}
            >
              Calculate Taxes →
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

        {/* Right Column: Your result (Rendered ONLY after user calculates) */}
        {hasResults && calculatedResult && (
          <div className="calc-col calc-result-col">
            <div className="calc-result-header">
              <h2 className="calc-h2">Your result</h2>
              <span className="calc-badge">
                Live calculation
              </span>
            </div>

            {/* Forest Total Tax Hero Card */}
            <div className="calc-hero-card">
              <div className="calc-hero-top">
                Total tax across {periods.length} {periods.length === 1 ? "period" : "periods"}
              </div>
              <div className="calc-hero-val">{currency(calculatedResult.totalTax)}</div>
              <div className="calc-hero-sub">
                {calculatedResult.totalMonths} months · Average effective rate{" "}
                {calculatedResult.avgRate.toFixed(1)}%
              </div>
            </div>

            {/* Gross & Net Mint Breakdown Cards */}
            <div className="calc-mint-grid">
              <div className="calc-mint-card">
                <div className="calc-stat-key" style={{ marginTop: 0 }}>
                  Total gross income
                </div>
                <div className="calc-stat-val">{currency(calculatedResult.totalGross)}</div>
              </div>
              <div className="calc-mint-card">
                <div className="calc-stat-key" style={{ marginTop: 0 }}>
                  Total net income
                </div>
                <div className="calc-stat-val">{currency(calculatedResult.totalNet)}</div>
              </div>
            </div>

            {/* Multi-Year Insights (VISIBLE by default after calculation) */}
            {insightsOpen && (
              <>
                {/* Fiscal Year Table */}
                <div className="calc-tile calc-tile-result">
                  <div style={{ fontWeight: 700, marginBottom: "12px", fontSize: "15px", color: "#14261D" }}>
                    Fiscal year breakdown
                  </div>
                  <div className="calc-table-wrap">
                    <table className="calc-table">
                      <thead>
                        <tr>
                          <th>Fiscal year</th>
                          <th>Gross</th>
                          <th>Tax</th>
                          <th>Net</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculatedResult.summaries.map((s) => (
                          <tr key={s.year}>
                            <td>
                              <b>FY {fiscalLabel(s.year)}</b>
                            </td>
                            <td>{compactCurrency(s.gross)}</td>
                            <td style={{ color: "#A3452E", fontWeight: 600 }}>
                              {compactCurrency(s.tax)}
                            </td>
                            <td>{compactCurrency(s.net)}</td>
                          </tr>
                        ))}
                        <tr className="calc-row-total">
                          <td>
                            <b>Total</b>
                          </td>
                          <td>
                            <b>{compactCurrency(calculatedResult.totalGross)}</b>
                          </td>
                          <td style={{ color: "#A3452E" }}>
                            <b>{compactCurrency(calculatedResult.totalTax)}</b>
                          </td>
                          <td>
                            <b>{compactCurrency(calculatedResult.totalNet)}</b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tax vs Take-home by Fiscal Year */}
                <div className="calc-tile calc-tile-result">
                  <div style={{ fontWeight: 700, marginBottom: "14px", fontSize: "15px", color: "#14261D" }}>
                    Tax vs take-home by fiscal year
                  </div>
                  <div style={{ display: "grid", gap: "14px" }}>
                    {calculatedResult.summaries.map((s) => {
                      const eff = s.gross > 0 ? (s.tax / s.gross) * 100 : 0;
                      const netP = Math.max(0, 100 - eff);
                      return (
                        <div key={s.year}>
                          <div
                            style={{
                              fontSize: "12px",
                              marginBottom: "4px",
                              color: "#4F5D55",
                              display: "flex",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              gap: "4px",
                            }}
                          >
                            <span>FY {fiscalLabel(s.year)}</span>
                            <span>{eff.toFixed(1)}% tax</span>
                          </div>
                          <div
                            className="calc-split-bar"
                            style={{ height: "20px" }}
                            role="img"
                            aria-label={`FY ${fiscalLabel(s.year)}: ${netP.toFixed(1)}% take-home, ${eff.toFixed(1)}% tax`}
                          >
                            <div
                              className="calc-split-bar-net"
                              style={{ width: `${netP}%` }}
                            />
                            <div
                              className="calc-split-bar-tax"
                              style={{ width: `${eff}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="calc-actions">
              <button
                type="button"
                className="calc-btn"
                onClick={() => setInsightsOpen((prev) => !prev)}
                aria-expanded={insightsOpen}
              >
                {insightsOpen ? "Hide insights" : "Show insights"}
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
      </div>
    </div>
  );
}
