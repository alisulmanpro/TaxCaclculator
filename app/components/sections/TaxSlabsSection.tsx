"use client";

import { useId, useState } from "react";
import { FISCAL_YEARS, fiscalLabel, type FiscalYear, TAX_RULES } from "@/lib/tax";

function formatSlabCurrency(num: number): string {
  return "Rs. " + num.toLocaleString("en-IN");
}

export interface SlabRow {
  range: string;
  tax: string;
}

export function getSlabsForYear(year: FiscalYear): SlabRow[] {
  const rule = TAX_RULES[year];
  let lower = 0;
  let cumTax = 0;

  return rule.limits.map((upper, idx) => {
    const rate = rule.rates[idx];
    let rangeStr = "";
    if (idx === 0) {
      rangeStr = `Up to ${formatSlabCurrency(upper)}`;
    } else if (upper === Infinity) {
      rangeStr = `Above ${formatSlabCurrency(lower)}`;
    } else {
      rangeStr = `${formatSlabCurrency(lower + 1)} to ${formatSlabCurrency(upper)}`;
    }

    let taxStr = "";
    const pct = Math.round(rate * 1000) / 10;
    if (rate === 0) {
      taxStr = "0% (Tax Free)";
    } else if (cumTax === 0) {
      taxStr = `${pct}% of the amount exceeding ${formatSlabCurrency(lower)}`;
    } else {
      taxStr = `${formatSlabCurrency(Math.round(cumTax))} + ${pct}% of the amount exceeding ${formatSlabCurrency(lower)}`;
    }

    if (upper !== Infinity) {
      cumTax += (upper - lower) * rate;
    }
    lower = upper;

    return { range: rangeStr, tax: taxStr };
  });
}

/**
 * Section B: Income Tax Slabs in Pakistan
 * Reproduces the progressive salary tax slabs table with an interactive fiscal year selector.
 */
export default function TaxSlabsSection() {
  const [selectedYear, setSelectedYear] = useState<FiscalYear>("2026");
  const selectId = useId();
  const slabs = getSlabsForYear(selectedYear);

  return (
    <section
      className="tax-section-dark tax-section-slabs"
      id="tax-slabs"
      aria-labelledby="tax-slabs-title"
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>FBR salary tax slabs</span>
          </div>

          <h2 className="tax-section-title" id="tax-slabs-title">
            Income Tax Slabs in Pakistan
          </h2>

          <p className="tax-section-lead">
            The progressive salary tax rates the calculator applies. Pick any fiscal year from FY
            2020-2021 onwards to see the slabs that applied that year.
          </p>
        </header>

        <div className="tax-card tax-card-slabs">
          <div className="tax-card-topbar">
            <label htmlFor={selectId} className="tax-card-topbar-label">
              Pakistan&apos;s salaried income tax slabs for the selected fiscal year:
            </label>
            <select
              id={selectId}
              className="tax-card-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value as FiscalYear)}
              aria-label="Select Fiscal Year"
            >
              {FISCAL_YEARS.map((year) => (
                <option key={year} value={year}>
                  FY {fiscalLabel(year)}
                </option>
              ))}
            </select>
          </div>

          <div className="tax-table-wrap tax-table-wrap-slabs">
            <table
              className="tax-data-table tax-data-table-slabs"
              aria-label={`Income Tax Slabs for FY ${fiscalLabel(selectedYear)}`}
            >
              <thead>
                <tr>
                  <th scope="col">Annual Taxable Income</th>
                  <th scope="col">Tax</th>
                </tr>
              </thead>
              <tbody>
                {slabs.map((slab) => (
                  <tr key={slab.range}>
                    <td className="cell-slab-range">{slab.range}</td>
                    <td className="cell-slab-tax">{slab.tax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
