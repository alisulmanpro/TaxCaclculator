import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateTax, currency, FISCAL_YEARS, fiscalLabel } from "../lib/tax.ts";

test("all money is formatted in rupees", () => {
  assert.equal(currency(1200000), "Rs. 1,200,000");
  assert.equal(currency(0), "Rs. 0");
  assert.equal(currency(500.25), "Rs. 500.25");
});

test("FISCAL_YEARS includes all 7 years from 2020-21 to 2026-27", () => {
  assert.deepEqual(FISCAL_YEARS, ["2026", "2025", "2024", "2023", "2022", "2021", "2020"]);
  assert.equal(fiscalLabel("2020"), "2020–2021");
  assert.equal(fiscalLabel("2026"), "2026–2027");
});

test("income up to Rs. 600,000 is tax free in every supported fiscal year", () => {
  for (const year of FISCAL_YEARS) {
    for (const income of [0, 120000, 599999, 600000]) {
      const result = calculateTax({ income, year });
      assert.equal(result.tax, 0, `Tax should be 0 for income ${income} in FY ${year}`);
      assert.equal(result.takeHome, income);
      assert.equal(result.effective, 0);
    }
  }
});

test("FY 2020–21 (Finance Act 2020) progressive salary slabs", () => {
  // Slabs: 0-600k: 0%, 600k-1.2M: 5%, 1.2M-1.8M: 30k+10%, 1.8M-2.5M: 90k+15%, 2.5M-3.5M: 195k+17.5%, 3.5M-5M: 370k+20%
  const cases = [
    [600001, 0.05],
    [1200000, 30000],
    [1800000, 90000],
    [2400000, 180000],
    [2500000, 195000],
    [3500000, 370000],
    [5000000, 670000],
  ];
  for (const [income, expectedTax] of cases) {
    const res = calculateTax({ income, year: "2020" });
    assert.equal(Math.round(res.tax * 100) / 100, expectedTax);
  }
});

test("FY 2021–22 (Finance Act 2021) progressive salary slabs", () => {
  const cases = [
    [1200000, 30000],
    [1800000, 90000],
    [2400000, 180000],
    [3500000, 370000],
    [5000000, 670000],
  ];
  for (const [income, expectedTax] of cases) {
    const res = calculateTax({ income, year: "2021" });
    assert.equal(res.tax, expectedTax);
  }
});

test("FY 2022–23 (Finance Act 2022) progressive salary slabs", () => {
  // Slabs: 0-600k: 0%, 600k-1.2M: 2.5%, 1.2M-2.4M: 15k+12.5%, 2.4M-3.6M: 165k+20%, 3.6M-6M: 405k+25%, 6M-12M: 1005k+32.5%
  assert.equal(calculateTax({ income: 600001, year: "2022" }).tax, 0.025);
  const cases = [
    [1200000, 15000],
    [2400000, 165000],
    [3600000, 405000],
    [6000000, 1005000],
    [12000000, 2955000],
  ];
  for (const [income, expectedTax] of cases) {
    const res = calculateTax({ income, year: "2022" });
    assert.equal(res.tax, expectedTax);
  }
});

test("FY 2023–24 (Finance Act 2023) progressive salary slabs", () => {
  // Slabs: 0-600k: 0%, 600k-1.2M: 2.5%, 1.2M-2.4M: 15k+12.5%, 2.4M-3.6M: 165k+22.5%, 3.6M-6M: 435k+27.5%, >6M: 1095k+35%
  const cases = [
    [1200000, 15000],
    [2400000, 165000],
    [3600000, 435000],
    [6000000, 1095000],
  ];
  for (const [income, expectedTax] of cases) {
    const res = calculateTax({ income, year: "2023" });
    assert.equal(res.tax, expectedTax);
  }
});

test("FY 2024–25 (Finance Act 2024) progressive salary slabs", () => {
  const cases = [
    [1200000, 30000],
    [2200000, 180000],
    [3200000, 430000],
    [4100000, 700000],
  ];
  for (const [income, tax] of cases) {
    assert.equal(calculateTax({ income, year: "2024" }).tax, tax);
  }
});

test("FY 2025–26 progressive salary slabs", () => {
  const cases = [
    [1200000, 6000],
    [2200000, 116000],
    [3200000, 346000],
    [4100000, 616000],
  ];
  for (const [income, tax] of cases) {
    assert.equal(calculateTax({ income, year: "2025" }).tax, tax);
  }
});

test("FY 2026–27 benchmark test cases", () => {
  const benchmarks = [
    { monthly: 100000, annualTax: 6000, monthlyTax: 500 },
    { monthly: 150000, annualTax: 72000, monthlyTax: 6000 },
    { monthly: 200000, annualTax: 156000, monthlyTax: 13000 },
    { monthly: 250000, annualTax: 276000, monthlyTax: 23000 },
    { monthly: 300000, annualTax: 416000, monthlyTax: 34666.66666666667 },
    { monthly: 400000, annualTax: 744000, monthlyTax: 62000 },
    { monthly: 500000, annualTax: 1104000, monthlyTax: 92000 },
  ];
  for (const b of benchmarks) {
    const res = calculateTax({ income: b.monthly * 12, year: "2026" });
    assert.equal(res.tax, b.annualTax);
    assert.equal(Math.round((res.tax / 12) * 100) / 100, Math.round(b.monthlyTax * 100) / 100);
  }
});

test("salary surcharges apply only to the appropriate years above Rs. 10 million", () => {
  assert.equal(calculateTax({ income: 10000000, year: "2024" }).surcharge, 0);
  assert.equal(calculateTax({ income: 12000000, year: "2024" }).tax, 3811500);
  assert.equal(calculateTax({ income: 12000000, year: "2025" }).tax, 3685290);
  const current = calculateTax({ income: 12000000, year: "2026" });
  assert.equal(current.surcharge, 0);
  assert.equal(current.tax, 3174000);
});

test("Part 8: Same-salary historical comparison logic and exact example test", () => {
  // Monthly Salary = Rs. 100,000 -> Annual = Rs. 1,200,000
  const gross = 100000 * 12;
  const res2026 = calculateTax({ income: gross, year: "2026" });
  const res2020 = calculateTax({ income: gross, year: "2020" });

  // 1. Both use exact same gross income
  assert.equal(res2026.income, 1200000);
  assert.equal(res2020.income, 1200000);

  // 2. Verified annual tax
  assert.equal(res2026.tax, 6000);
  assert.equal(res2020.tax, 30000);

  // 3. Derived monthly tax
  assert.equal(res2026.tax / 12, 500);
  assert.equal(res2020.tax / 12, 2500);

  // 4. Annual difference = Comparison Year Tax - Selected Year Tax
  const annualDiff = res2020.tax - res2026.tax;
  const monthlyDiff = annualDiff / 12;
  assert.equal(annualDiff, 24000);
  assert.equal(monthlyDiff, 2000);

  // 5. Positive difference = tax saving
  assert.ok(annualDiff > 0);
  const message = `You save ${currency(monthlyDiff)} per month compared with FY ${fiscalLabel("2020")}.`;
  assert.equal(message, "You save Rs. 2,000 per month compared with FY 2020–2021.");

  // 6. Reverse comparison (user pays more under selected year)
  const revAnnualDiff = res2026.tax - res2020.tax;
  const revMonthlyDiff = revAnnualDiff / 12;
  assert.equal(revAnnualDiff, -24000);
  assert.equal(revMonthlyDiff, -2000);
  const revMessage = `You pay ${currency(Math.abs(revMonthlyDiff))} more per month compared with FY ${fiscalLabel("2026")}.`;
  assert.equal(revMessage, "You pay Rs. 2,000 more per month compared with FY 2026–2027.");

  // 7. Same year comparison (no difference)
  const sameAnnualDiff = res2026.tax - res2026.tax;
  assert.equal(sameAnnualDiff, 0);
  const sameMessage = `No tax difference compared with FY ${fiscalLabel("2026")}.`;
  assert.equal(sameMessage, "No tax difference compared with FY 2026–2027.");
});

test("tax bands reconcile to the total and take-home income for all years", () => {
  for (const year of FISCAL_YEARS) {
    const result = calculateTax({ income: 2500000, year });
    assert.equal(
      Math.round(result.bands.reduce((sum, band) => sum + band.tax, 0)),
      Math.round(result.baseTax),
    );
    assert.equal(
      Math.round(result.bands.reduce((sum, band) => sum + band.income, 0)),
      result.income,
    );
    assert.equal(Math.round(result.takeHome + result.tax), 2500000);
    assert.equal(
      Math.round(result.effective * 100) / 100,
      Math.round((result.tax / result.income) * 10000) / 100,
    );
  }
});

test("invalid income and unsupported schedules are rejected", () => {
  for (const income of [-1, Infinity, NaN]) {
    assert.throws(() => calculateTax({ income, year: "2026" }), /non-negative/);
  }
  assert.throws(() => calculateTax({ income: 10000, year: "2019" }), /supported/);
  assert.throws(() => calculateTax({ income: 10000, year: "2030" }), /supported/);
});
