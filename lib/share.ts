// Shareable-link encoding for both calculators.
//
// The whole calculator state is stored in the URL query string, so a copied link
// reopens exactly what the sender saw. Nothing is sent to a server: the query string is
// only ever read in the browser. Every value is validated on the way in, so a hand-edited
// or broken link can never put the calculator into an invalid state.
import { FISCAL_YEARS, type FiscalYear } from "./tax.ts";
import { MIN_DATE, MAX_DATE } from "./salary-history.ts";

export type InsightTab = "overview" | "comparison" | "bands";
export type MultiInsightTab = "chart" | "periods";

export const MAX_AMOUNT = 1_000_000_000;
export const MAX_SHARED_PERIODS = 12;

export type SingleShareState = {
  year: FiscalYear;
  /** Monthly salary as plain digits (no commas). */
  salary: string;
  bonus: string;
  deductions: string;
  withheld: string;
  comparison: FiscalYear | "none";
  insightsOpen: boolean;
  tab: InsightTab;
};

export type SharedPeriod = {
  start: string;
  end: string;
  salary: string;
  monthlyBonus: string;
  monthlyDeductions: string;
};

export type MultiShareState = {
  periods: SharedPeriod[];
  insightsOpen: boolean;
  tab: MultiInsightTab;
};

const digits = (value: string) => value.replace(/[^0-9]/g, "");
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Parse a plain-digit amount. Returns null if it is not a valid amount in range. */
function parseAmount(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const clean = raw.trim();
  if (!/^\d{1,10}$/.test(clean)) return null;
  const value = Number(clean);
  if (!Number.isFinite(value) || value > MAX_AMOUNT) return null;
  return String(value);
}

function isFiscalYear(value: string | null): value is FiscalYear {
  return value !== null && (FISCAL_YEARS as string[]).includes(value);
}

function isRealDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const time = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(time)) return false;
  return new Date(time).toISOString().slice(0, 10) === value;
}

/* ---------------------------------- single year --------------------------------- */

export function encodeSingle(state: SingleShareState): string {
  const params = new URLSearchParams();
  params.set("fy", state.year);
  params.set("sal", digits(state.salary));
  const bonus = digits(state.bonus);
  const deductions = digits(state.deductions);
  const withheld = digits(state.withheld);
  if (bonus && bonus !== "0") params.set("bonus", bonus);
  if (deductions && deductions !== "0") params.set("ded", deductions);
  if (withheld && withheld !== "0") params.set("wh", withheld);
  params.set("cmp", state.comparison);
  if (state.insightsOpen) {
    params.set("ins", "1");
    params.set("tab", state.tab);
  }
  return params.toString();
}

export function decodeSingle(query: string | URLSearchParams): SingleShareState | null {
  const params = typeof query === "string" ? new URLSearchParams(query) : query;
  const salary = parseAmount(params.get("sal"));
  if (salary === null || Number(salary) <= 0) return null;

  const fy = params.get("fy");
  const year: FiscalYear = isFiscalYear(fy) ? fy : "2026";

  const cmpRaw = params.get("cmp");
  let comparison: FiscalYear | "none" = "none";
  if (cmpRaw === "none") comparison = "none";
  else if (isFiscalYear(cmpRaw) && cmpRaw !== year) comparison = cmpRaw;
  else comparison = FISCAL_YEARS.find((y) => y !== year) ?? "none";

  const tabRaw = params.get("tab");
  const tab: InsightTab =
    tabRaw === "comparison" || tabRaw === "bands" ? tabRaw : "overview";

  return {
    year,
    salary,
    bonus: parseAmount(params.get("bonus")) ?? "0",
    deductions: parseAmount(params.get("ded")) ?? "0",
    withheld: parseAmount(params.get("wh")) ?? "0",
    comparison,
    insightsOpen: params.get("ins") === "1",
    tab,
  };
}

/* ----------------------------------- multi year --------------------------------- */

export function encodeMulti(state: MultiShareState): string {
  const params = new URLSearchParams();
  for (const p of state.periods) {
    params.append(
      "p",
      [
        p.start,
        p.end,
        digits(p.salary) || "0",
        digits(p.monthlyBonus) || "0",
        digits(p.monthlyDeductions) || "0",
      ].join("_")
    );
  }
  params.set("ins", state.insightsOpen ? "1" : "0");
  params.set("tab", state.tab);
  return params.toString();
}

export function decodeMulti(query: string | URLSearchParams): MultiShareState | null {
  const params = typeof query === "string" ? new URLSearchParams(query) : query;
  const rawPeriods = params.getAll("p");
  if (rawPeriods.length === 0 || rawPeriods.length > MAX_SHARED_PERIODS) return null;

  const periods: SharedPeriod[] = [];
  for (const raw of rawPeriods) {
    const parts = raw.split("_");
    if (parts.length !== 5) return null;
    const [start, end, salary, bonus, deductions] = parts;
    if (!isRealDate(start) || !isRealDate(end)) return null;
    if (start < MIN_DATE || end > MAX_DATE || start > end) return null;
    const sal = parseAmount(salary);
    const bon = parseAmount(bonus);
    const ded = parseAmount(deductions);
    if (sal === null || Number(sal) <= 0 || bon === null || ded === null) return null;
    periods.push({ start, end, salary: sal, monthlyBonus: bon, monthlyDeductions: ded });
  }

  return {
    periods,
    insightsOpen: params.get("ins") !== "0",
    tab: params.get("tab") === "periods" ? "periods" : "chart",
  };
}

/** Builds the absolute share URL for the current page without any existing query/hash. */
export function buildShareUrl(origin: string, pathname: string, query: string): string {
  return `${origin}${pathname}?${query}`;
}
