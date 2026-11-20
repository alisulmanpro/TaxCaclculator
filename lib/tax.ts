export type FiscalYear =
  | "2020"
  | "2021"
  | "2022"
  | "2023"
  | "2024"
  | "2025"
  | "2026";
export const FISCAL_YEARS: FiscalYear[] = [
  "2026",
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
];
export const fiscalLabel = (year: FiscalYear) => `${year}–${Number(year) + 1}`;
export const currency = (value: number) =>
  `Rs. ${new Intl.NumberFormat("en-PK", { maximumFractionDigits: 2 }).format(value)}`;
export const compactCurrency = (value: number) =>
  `Rs. ${new Intl.NumberFormat("en-PK", { notation: "compact", maximumFractionDigits: 1 }).format(value)}`;

// Pakistan salaried-person schedules, Finance Acts 2020–2026 (Tax Years 2021–2027).
// Salaried schedule applies where salary income exceeds 75% of taxable income.
export const TAX_RULES: Record<
  FiscalYear,
  { limits: number[]; rates: number[]; surcharge: number }
> = {
  "2020": {
    limits: [600000, 1200000, 1800000, 2500000, 3500000, 5000000, 8000000, 12000000, 30000000, 50000000, 75000000, Infinity],
    rates: [0, 0.05, 0.1, 0.15, 0.175, 0.2, 0.225, 0.25, 0.275, 0.3, 0.325, 0.35],
    surcharge: 0,
  },
  "2021": {
    limits: [600000, 1200000, 1800000, 2500000, 3500000, 5000000, 8000000, 12000000, 30000000, 50000000, 75000000, Infinity],
    rates: [0, 0.05, 0.1, 0.15, 0.175, 0.2, 0.225, 0.25, 0.275, 0.3, 0.325, 0.35],
    surcharge: 0,
  },
  "2022": {
    limits: [600000, 1200000, 2400000, 3600000, 6000000, 12000000, Infinity],
    rates: [0, 0.025, 0.125, 0.2, 0.25, 0.325, 0.35],
    surcharge: 0,
  },
  "2023": {
    limits: [600000, 1200000, 2400000, 3600000, 6000000, Infinity],
    rates: [0, 0.025, 0.125, 0.225, 0.275, 0.35],
    surcharge: 0,
  },
  "2024": {
    limits: [600000, 1200000, 2200000, 3200000, 4100000, Infinity],
    rates: [0, 0.05, 0.15, 0.25, 0.3, 0.35],
    surcharge: 0.1,
  },
  "2025": {
    limits: [600000, 1200000, 2200000, 3200000, 4100000, Infinity],
    rates: [0, 0.01, 0.11, 0.23, 0.3, 0.35],
    surcharge: 0.09,
  },
  "2026": {
    limits: [600000, 1200000, 2200000, 3200000, 4100000, 5600000, 7000000, Infinity],
    rates: [0, 0.01, 0.11, 0.2, 0.25, 0.29, 0.32, 0.35],
    surcharge: 0,
  },
};
export type TaxBand = { lower: number; upper: number; rate: number; income: number; tax: number };
export type TaxResult = ReturnType<typeof calculateTax>;

export function calculateTax({ income, year }: { income: number; year: FiscalYear }) {
  if (!Number.isFinite(income) || income < 0)
    throw new Error("Income must be a non-negative amount.");
  const rule = TAX_RULES[year];
  if (!rule) throw new Error("Choose a supported fiscal year.");
  let lower = 0;
  let marginal = 0;
  const bands: TaxBand[] = rule.limits.map((upper, index) => {
    const amount = Math.max(0, Math.min(income, upper) - lower);
    const rate = rule.rates[index];
    if (amount > 0) marginal = rate * 100;
    const band = { lower, upper, rate: rate * 100, income: amount, tax: amount * rate };
    lower = upper;
    return band;
  });
  const baseTax = bands.reduce((total, band) => total + band.tax, 0);
  const surcharge = income > 10000000 ? baseTax * rule.surcharge : 0;
  const tax = baseTax + surcharge;
  return {
    income,
    tax,
    baseTax,
    surcharge,
    takeHome: income - tax,
    marginal,
    effective: income ? (tax / income) * 100 : 0,
    bands,
  };
}
