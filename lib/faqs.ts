// FAQ content. These items are shown on the page AND written into the FAQPage
// structured data, so Google can show them as rich results. Edit them here.
// Keep answers plain text (no HTML) and keep them identical to what the page shows.

import { TAX_RULES, type FiscalYear } from "./tax.ts";

export type Faq = { q: string; a: string };

const amount = (value: number) => value.toLocaleString("en-US");

/** One year's salaried slabs in words, read from lib/tax.ts so the answer cannot drift from the calculator. */
function slabAnswer(year: FiscalYear) {
  const { limits, rates, surcharge } = TAX_RULES[year];
  const bands = limits.map((upper, index) => {
    const rate = `${Math.round(rates[index] * 1000) / 10}%`;
    if (index === 0) return `${rate} up to Rs. ${amount(upper)}`;
    const lower = limits[index - 1];
    if (upper === Infinity) return `${rate} above Rs. ${amount(lower)}`;
    return `${rate} on Rs. ${amount(lower + 1)}–${amount(upper)}`;
  });
  const extra = surcharge
    ? `A surcharge of ${Math.round(surcharge * 100)}% of the tax also applies when taxable income is above Rs. 10,000,000.`
    : "No surcharge applies to salaried persons this year.";
  return `${bands.join("; ")}. Each rate applies only to the income inside its band. ${extra}`;
}

export const singleYearFaqs: Faq[] = [
  {
    q: "What are the income tax slabs in Pakistan for FY 2026-2027?",
    a: `For FY 2026–2027 (1 July 2026 – 30 June 2027), the salaried-person slabs are: ${slabAnswer("2026")} The calculator applies these automatically when you pick FY 2026–27.`,
  },
  {
    q: "What were Pakistan's income tax brackets for FY 2025-2026?",
    a: `For FY 2025–2026 (1 July 2025 – 30 June 2026), the salaried-person slabs are: ${slabAnswer("2025")} Select FY 2025–26 in the calculator to see your tax under these rates.`,
  },
  {
    q: "How do I calculate income tax on my salary in Pakistan?",
    a: "Enter your monthly gross salary and pick the fiscal year. The calculator multiplies the salary by 12, adds any annual bonus, and applies that year's salaried-person slabs. It shows monthly and annual tax, net income, and your effective and marginal tax rates.",
  },
  {
    q: "How much tax will I pay on my salary in Pakistan?",
    a: "That depends on your gross monthly salary and the fiscal year. Type your salary into the calculator to see monthly tax, annual tax and your effective tax rate for any fiscal year from 2020–21 to 2026–27.",
  },
  {
    q: "What will my take-home salary be after tax?",
    a: "The result table shows your monthly and annual net income, which is your take-home pay. It is your gross income minus income tax and minus any monthly deductions you enter, such as provident fund or EOBI. Those deductions do not reduce the income that is taxed.",
  },
  {
    q: "Can I compare income tax across multiple years in Pakistan?",
    a: "Yes. In the single-year calculator, choose a second fiscal year under “Compare with”. For salary changes across several years, open the Multi-Year Calculator at /multi-year-calculator.",
  },
];

export const multiYearFaqs: Faq[] = [
  {
    q: "What is a Multi-Year Income Tax Calculator?",
    a: "It is a specialized tax calculator for salaried individuals in Pakistan that computes income tax and take-home pay across multiple fiscal years. Rather than assuming a single flat salary, it tracks changing compensation, promotions, and multiple employment periods across official July–June fiscal boundaries.",
  },
  {
    q: "When should I use a Multi-Year Salary Tax Calculator?",
    a: "Use it whenever your salary changed during the year, if you switched employers, received a mid-month increment, had a gap between jobs, or want to compare your tax and take-home pay across fiscal years from 2024–25 to 2026–27.",
  },
  {
    q: "How does Pakistan's 1 July to 30 June fiscal year affect my salary?",
    a: "In Pakistan, the tax year runs from 1 July to 30 June of the following year. Your income tax is calculated on the aggregate salary received within that specific 12-month period, rather than the calendar year. Earnings from January to June belong to the ending fiscal year, while earnings from July to December belong to the new fiscal year.",
  },
  {
    q: "What happens if I change jobs during a fiscal year?",
    a: "You enter each job as an independent salary period with its respective start and end dates. The calculator combines all income earned from both employers within that same 1 July – 30 June fiscal year to determine your cumulative taxable income and apply the appropriate progressive tax bracket.",
  },
  {
    q: "How does the calculator handle salary changes during the year?",
    a: "When you receive a salary increment, enter your old salary up to the effective date, and add a new period starting from the date of the raise. The calculator prorates each period based on actual calendar days and aggregates them into that fiscal year's total earnings.",
  },
  {
    q: "Why does the calculator count exact calendar days?",
    a: "Jobs often start or end in the middle of a month. Counting the exact calendar days in each salary period, instead of rounding to whole months, prorates your salary, regular bonus and deductions for that month.",
  },
  {
    q: "How is salary divided when it crosses two fiscal years?",
    a: "If a salary period extends across 30 June (for instance, 1 May to 31 August), the calculator automatically splits the period at the 30 June boundary. Days up to 30 June are allocated to the earlier fiscal year, and days from 1 July onward are allocated to the new fiscal year under its new tax rules.",
  },
  {
    q: "Which tax slabs are applied to each fiscal year?",
    a: "Each fiscal year has its own slabs set by that year's Finance Act. The calculator applies the FY 2024–25, FY 2025–26 or FY 2026–27 slabs to the income of that year. A surcharge on tax also applies to income above Rs. 10 million in FY 2024–25 (10%) and FY 2025–26 (9%), but not in FY 2026–27.",
  },
  {
    q: "Can I calculate income across multiple fiscal years?",
    a: "Yes. You can enter consecutive salary periods covering any timeframe between 1 July 2024 and 30 June 2027. The calculator sorts and groups your timeline by fiscal year, giving you a detailed year-by-year summary of gross income, tax liability, and take-home pay.",
  },
  {
    q: "How is the final tax liability determined?",
    a: "Within each fiscal year, salary and regular bonuses are added up to give annual taxable income, and that year's progressive rates are applied to it. Monthly deductions are then subtracted, together with the tax, to estimate your take-home pay; they do not reduce the taxable income.",
  },
];
