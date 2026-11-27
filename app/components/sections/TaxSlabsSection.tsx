"use client";

import { useState } from "react";
import { FISCAL_YEARS, fiscalLabel, type FiscalYear, TAX_RULES } from "@/lib/tax";
import DataSectionHeader from "./DataSectionHeader";

function formatSlabCurrency(num: number): string {
  // The non-breaking space keeps "Rs." on the same line as its amount.
  return "Rs.\u00a0" + num.toLocaleString("en-US");
}

export interface SlabRow {
  range: string;
  tax: string;
}

/** "2026" → "FY 2026–27" */
const tabLabel = (year: FiscalYear) => `FY ${year}–${String(Number(year) + 1).slice(-2)}`;

/** The three newest years are buttons; the rest sit in the "Earlier years" menu. */
const tabYears = FISCAL_YEARS.slice(0, 3);
const earlierYears = FISCAL_YEARS.slice(3);

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
      rangeStr = `${formatSlabCurrency(lower + 1)} – ${upper.toLocaleString("en-US")}`;
    }

    let taxStr = "";
    const pct = Math.round(rate * 1000) / 10;
    if (rate === 0) {
      taxStr = "Tax free";
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
 * The progressive salary tax slabs table with a fiscal year switcher.
 */
export default function TaxSlabsSection() {
  const [selectedYear, setSelectedYear] = useState<FiscalYear>("2026");
  const slabs = getSlabsForYear(selectedYear);
  const isEarlier = earlierYears.includes(selectedYear);

  return (
    <section className="fx-section fx-data fx-data-slabs" id="tax-slabs" aria-labelledby="tax-slabs-title">
      <div className="fx-wrap">
        <DataSectionHeader
          eyebrow="Understand your tax"
          title="Income tax slabs in Pakistan"
          titleId="tax-slabs-title"
          lead="Your salary is taxed progressively. Only the income within each band is charged at that band’s rate."
        />

        <div className="fx-year-tabs fx-rise" role="group" aria-label="Fiscal year">
          {tabYears.map((year) => (
            <button
              key={year}
              type="button"
              className="fx-year-tab"
              data-year={year}
              aria-pressed={selectedYear === year}
              onClick={() => setSelectedYear(year)}
            >
              {tabLabel(year)}
            </button>
          ))}
          <select
            className={`fx-year-tab fx-year-more${isEarlier ? " is-active" : ""}`}
            aria-label="Earlier fiscal years"
            value={isEarlier ? selectedYear : ""}
            onChange={(e) => setSelectedYear(e.target.value as FiscalYear)}
          >
            <option value="" disabled>
              FY Earlier years
            </option>
            {earlierYears.map((year) => (
              <option key={year} value={year}>
                {tabLabel(year)}
              </option>
            ))}
          </select>
        </div>

        <div className="tax-table-wrap">
          <table
            className="tax-data-table tax-data-table-slabs"
            aria-label={`Income Tax Slabs for FY ${fiscalLabel(selectedYear)}`}
          >
            <thead>
              <tr className="fx-rise">
                <th scope="col">Annual taxable income</th>
                <th scope="col">Income tax calculation</th>
              </tr>
            </thead>
            <tbody>
              {slabs.map((slab) => (
                <tr key={slab.range} className="fx-rise">
                  <td className="cell-num">{slab.range}</td>
                  <td>{slab.tax}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="tax-table-footnote fx-rise">
          Salaried-person rates shown for the selected fiscal year. Review official FBR guidance for your
          individual circumstances.
        </p>
      </div>
    </section>
  );
}
