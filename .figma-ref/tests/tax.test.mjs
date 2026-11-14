import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateTax, currency } from "../src/tax.ts";

test("all money is formatted in rupees", () => {
  assert.equal(currency(1200000), "Rs. 1,200,000");
  assert.equal(currency(0), "Rs. 0");
  assert.equal(currency(500.25), "Rs. 500.25");
});
test("income up to Rs. 600,000 is tax free in every supported fiscal year", () => {
  for (const year of ["2024", "2025", "2026"])
    for (const income of [0, 120000, 600000]) {
      const result = calculateTax({ income, year });
      assert.equal(result.tax, 0);
      assert.equal(result.takeHome, income);
      assert.equal(result.effective, 0);
    }
});
test("FY 2024–25 uses the correct progressive salary bands", () => {
  for (const [income, tax] of [
    [1200000, 30000],
    [2200000, 180000],
    [3200000, 430000],
    [4100000, 700000],
  ])
    assert.equal(calculateTax({ income, year: "2024" }).tax, tax);
});
test("FY 2025–26 uses the correct progressive salary bands", () => {
  for (const [income, tax] of [
    [1200000, 6000],
    [2200000, 116000],
    [3200000, 346000],
    [4100000, 616000],
  ])
    assert.equal(calculateTax({ income, year: "2025" }).tax, tax);
});
test("FY 2026–27 uses the revised eight salary bands", () => {
  for (const [income, tax] of [
    [1200000, 6000],
    [2200000, 116000],
    [3200000, 316000],
    [4100000, 541000],
    [5600000, 976000],
    [7000000, 1424000],
  ])
    assert.equal(calculateTax({ income, year: "2026" }).tax, tax);
});
test("salary surcharges apply only to the appropriate years above Rs. 10 million", () => {
  assert.equal(calculateTax({ income: 10000000, year: "2024" }).surcharge, 0);
  assert.equal(calculateTax({ income: 12000000, year: "2024" }).tax, 3811500);
  assert.equal(calculateTax({ income: 12000000, year: "2025" }).tax, 3685290);
  const current = calculateTax({ income: 12000000, year: "2026" });
  assert.equal(current.surcharge, 0);
  assert.equal(current.tax, 3174000);
});
test("tax bands reconcile to the total and take-home income", () => {
  const result = calculateTax({ income: 1250000, year: "2026" });
  assert.equal(result.tax, 11500);
  assert.equal(result.marginal, 11);
  assert.equal(
    result.bands.reduce((sum, band) => sum + band.tax, 0),
    result.baseTax,
  );
  assert.equal(
    result.bands.reduce((sum, band) => sum + band.income, 0),
    result.income,
  );
  assert.equal(result.takeHome + result.tax, 1250000);
});
test("invalid income and unsupported schedules are rejected", () => {
  for (const income of [-1, Infinity, NaN])
    assert.throws(() => calculateTax({ income, year: "2026" }), /non-negative/);
  assert.throws(() => calculateTax({ income: 10000, year: "2030" }), /supported/);
});
