import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  bonusMonthOptions,
  calculateSalaryHistory,
  validatePeriods,
  type SalaryPeriod,
} from "../src/salary-history";

const period: SalaryPeriod = {
  id: 1,
  start: "2024-07-01",
  end: "2027-06-30",
  salary: "100000",
  monthlyBonus: "0",
  monthlyDeductions: "0",
  bonuses: [{ id: 1, amount: "0", unit: "rs", month: "" }],
};
test("salary history uses July–June fiscal years and year-specific schedules", () => {
  const rows = calculateSalaryHistory([period]);
  assert.deepEqual(
    rows.map((row) => row.year),
    ["2024", "2025", "2026"],
  );
  assert.deepEqual(
    rows.map((row) => row.gross),
    [1200000, 1200000, 1200000],
  );
  assert.deepEqual(
    rows.map((row) => row.tax),
    [30000, 6000, 6000],
  );
});
test("partial months use actual days worked", () => {
  const [row] = calculateSalaryHistory([
    { ...period, start: "2025-02-15", end: "2025-02-28", salary: "28000" },
  ]);
  assert.equal(row.gross, 14000);
});
test("adjacent periods with changing salary aggregate into one fiscal year", () => {
  const [row] = calculateSalaryHistory([
    { ...period, start: "2026-07-01", end: "2026-09-30" },
    { ...period, id: 2, start: "2026-10-01", end: "2027-06-30", salary: "200000" },
  ]);
  assert.equal(row.year, "2026");
  assert.equal(row.gross, 2100000);
  assert.equal(row.tax, 105000);
});
test("a one-off bonus goes to its payment fiscal year, not period end", () => {
  const rows = calculateSalaryHistory([
    { ...period, bonuses: [{ id: 1, amount: "100000", unit: "rs", month: "2025-06" }] },
  ]);
  assert.equal(rows[0].gross, 1300000);
  assert.equal(rows[0].tax, 45000);
  assert.equal(rows[1].gross, 1200000);
  assert.equal(rows[2].gross, 1200000);
});
test("multiple yearly bonuses and salary multiples affect the selected years", () => {
  const rows = calculateSalaryHistory([
    {
      ...period,
      bonuses: [
        { id: 1, amount: "2", unit: "salary", month: "2025-07" },
        { id: 2, amount: "50000", unit: "rs", month: "2026-07" },
      ],
    },
  ]);
  assert.equal(rows[0].gross, 1200000);
  assert.equal(rows[1].gross, 1400000);
  assert.equal(rows[1].tax, 28000);
  assert.equal(rows[2].gross, 1250000);
  assert.equal(rows[2].tax, 11500);
});
test("recurring bonuses increase taxable salary", () => {
  const rows = calculateSalaryHistory([{ ...period, monthlyBonus: "10000" }]);
  assert.equal(rows[2].gross, 1320000);
  assert.equal(rows[2].tax, 19200);
});
test("post-tax deductions lower take-home, not taxable income or tax", () => {
  const baseline = calculateSalaryHistory([period]);
  const rows = calculateSalaryHistory([{ ...period, monthlyDeductions: "1000" }]);
  assert.equal(rows[2].gross, baseline[2].gross);
  assert.equal(rows[2].tax, baseline[2].tax);
  assert.equal(rows[2].deductions, 12000);
  assert.equal(rows[2].net, baseline[2].net - 12000);
});
test("partial-month bonuses and deductions are prorated consistently", () => {
  const [row] = calculateSalaryHistory([
    {
      ...period,
      start: "2026-11-16",
      end: "2026-11-30",
      salary: "100000",
      monthlyBonus: "10000",
      monthlyDeductions: "2000",
    },
  ]);
  assert.equal(row.gross, 55000);
  assert.equal(row.deductions, 1000);
  assert.equal(row.net, 54000);
});
test("bonus month choices are limited to the period and fiscal-year boundary", () => {
  assert.deepEqual(bonusMonthOptions("2026-06-15", "2026-07-10"), ["2026-06", "2026-07"]);
  assert.equal(bonusMonthOptions("", "").length, 36);
});
test("empty optional fields count as zero without blocking a calculation", () => {
  const rows = calculateSalaryHistory([
    {
      ...period,
      monthlyBonus: "",
      monthlyDeductions: "",
      bonuses: [{ id: 1, amount: "", unit: "rs", month: "" }],
    },
  ]);
  assert.equal(rows[2].gross, 1200000);
  assert.equal(rows[2].deductions, 0);
  assert.equal(rows[2].tax, 6000);
});
test("a nonzero bonus needs a valid payment month within the period", () => {
  assert.match(
    validatePeriods([{ ...period, bonuses: [{ id: 1, amount: "100", unit: "rs", month: "" }] }])!,
    /payment month/,
  );
  assert.match(
    validatePeriods([
      { ...period, bonuses: [{ id: 1, amount: "100", unit: "rs", month: "2024-06" }] },
    ])!,
    /within/,
  );
  assert.match(
    validatePeriods([
      { ...period, bonuses: [{ id: 1, amount: "1001", unit: "salary", month: "2025-01" }] },
    ])!,
    /1,000 salaries/,
  );
});
test("invalid dates, overlaps, negative values, and empty histories are rejected", () => {
  assert.match(validatePeriods([period, { ...period, id: 2 }])!, /overlap/);
  assert.match(validatePeriods([{ ...period, start: "" }])!, /Choose/);
  assert.match(validatePeriods([{ ...period, start: "2025-02-31" }])!, /valid dates/);
  assert.match(validatePeriods([{ ...period, start: "2023-07-01" }])!, /between/);
  assert.match(validatePeriods([{ ...period, end: "2023-01-01" }])!, /end on or after/);
  assert.match(validatePeriods([{ ...period, monthlyDeductions: "-1" }])!, /between/);
  assert.throws(() => calculateSalaryHistory([]), /at least one/);
});
