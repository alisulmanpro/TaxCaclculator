import { calculateTax, type FiscalYear } from "./tax.ts";

export const MIN_DATE = "2024-07-01";
export const MAX_DATE = "2027-06-30";
export type YearlyBonus = { id: number; amount: string; unit: "rs" | "salary"; month: string };
export type SalaryPeriod = {
  id: number;
  start: string;
  end: string;
  salary: string;
  monthlyBonus: string;
  monthlyDeductions: string;
  bonuses: YearlyBonus[];
};
export type YearSummary = {
  year: FiscalYear;
  gross: number;
  tax: number;
  net: number;
  deductions: number;
};
const dateValue = (value: string) => Date.parse(`${value}T00:00:00Z`);
const isAmount = (value: string) =>
  value.trim() !== "" &&
  Number.isFinite(Number(value)) &&
  Number(value) >= 0 &&
  Number(value) <= 1000000000;
export const fiscalYearOf = (date: Date): FiscalYear =>
  String(date.getUTCFullYear() - (date.getUTCMonth() < 6 ? 1 : 0)) as FiscalYear;

export function bonusMonthOptions(start: string, end: string) {
  const options: string[] = [];
  const first = start ? start.slice(0, 7) : MIN_DATE.slice(0, 7);
  const last = end ? end.slice(0, 7) : MAX_DATE.slice(0, 7);
  let date = new Date(`${first}-01T00:00:00Z`);
  for (let index = 0; index < 36 && Number.isFinite(date.getTime()); index++) {
    const month = date.toISOString().slice(0, 7);
    if (month > last) break;
    options.push(month);
    date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
  }
  return options;
}
export function validatePeriods(periods: SalaryPeriod[]): string | null {
  if (!periods.length) return "Add at least one salary period.";
  const sorted = [...periods].sort((a, b) => a.start.localeCompare(b.start));
  for (let index = 0; index < sorted.length; index++) {
    const period = sorted[index];
    if (!period.start || !period.end) return "Choose a start and end date for every period.";
    if (
      [period.start, period.end].some(
        (value) =>
          !Number.isFinite(dateValue(value)) ||
          new Date(dateValue(value)).toISOString().slice(0, 10) !== value,
      )
    )
      return "Enter valid dates for every period.";
    if (period.start > period.end) return "Each period must end on or after its start date.";
    if (period.start < MIN_DATE || period.end > MAX_DATE)
      return "Dates must be between 1 July 2024 and 30 June 2027.";
    if (index > 0 && sorted[index - 1].end >= period.start)
      return "Salary periods cannot overlap. End one period before the next begins.";
    if (
      !isAmount(period.salary) ||
      [period.monthlyBonus, period.monthlyDeductions].some((value) => !isAmount(value || "0"))
    )
      return "Salary, monthly bonus, and deductions must be between Rs. 0 and Rs. 1,000,000,000.";
    for (const bonus of period.bonuses) {
      if (!isAmount(bonus.amount || "0")) return "Enter a valid non-negative yearly bonus.";
      if (bonus.unit === "salary" && Number(bonus.amount) > 1000)
        return "A salary-multiple bonus must be between 0 and 1,000 salaries.";
      if (Number(bonus.amount) > 0) {
        if (!bonus.month) return "Choose a payment month for every yearly bonus.";
        if (!bonusMonthOptions(period.start, period.end).includes(bonus.month))
          return "Each bonus payment month must fall within its salary period.";
      }
    }
  }
  return null;
}

// Salaries, regular bonuses, and post-tax deductions use actual days worked per month.
// A yearly bonus is counted once, in its selected payment month and fiscal year.
export function calculateSalaryHistory(periods: SalaryPeriod[]): YearSummary[] {
  const error = validatePeriods(periods);
  if (error) throw new Error(error);
  const years = new Map<FiscalYear, { gross: number; deductions: number }>();
  for (const period of periods) {
    const start = new Date(`${period.start}T00:00:00Z`);
    const endTime = dateValue(period.end);
    let month = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1);
    while (month <= endTime) {
      const date = new Date(month);
      const next = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1);
      const fraction =
        (Math.min(endTime + 86400000, next) - Math.max(dateValue(period.start), month)) /
        (next - month);
      const year = fiscalYearOf(date);
      const bucket = years.get(year) ?? { gross: 0, deductions: 0 };
      bucket.gross += (Number(period.salary) + Number(period.monthlyBonus)) * fraction;
      bucket.deductions += Number(period.monthlyDeductions) * fraction;
      for (const bonus of period.bonuses) {
        if (bonus.month === date.toISOString().slice(0, 7))
          bucket.gross +=
            Number(bonus.amount) * (bonus.unit === "salary" ? Number(period.salary) : 1);
      }
      years.set(year, bucket);
      month = next;
    }
  }
  return [...years.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, values]) => {
      const result = calculateTax({ year, income: values.gross });
      return {
        year,
        gross: values.gross,
        tax: result.tax,
        deductions: values.deductions,
        net: result.takeHome - values.deductions,
      };
    });
}
