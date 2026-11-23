// FAQ content. These items are shown on the page AND written into the FAQPage
// structured data, so Google can show them as rich results. Edit them here.
// Keep answers plain text (no HTML) and keep them identical to what the page shows.

export type Faq = { q: string; a: string };

export const singleYearFaqs: Faq[] = [
  {
    q: "What are the income tax slabs in Pakistan for FY 2026-2027?",
    a: "For FY 2026–2027 (1 July 2026 – 30 June 2027), the salaried-person slabs are: 0% up to Rs. 600,000; 5% on Rs. 600,001–1,200,000; 10% on Rs. 1,200,001–2,200,000; 15% on Rs. 2,200,001–3,200,000; 20% on Rs. 3,200,001–4,100,000; 25% on Rs. 4,100,001–5,000,000; 30% on Rs. 5,000,001–6,000,000; 35% above Rs. 6,000,000. The calculator applies these automatically when you pick FY 2026–27.",
  },
  {
    q: "What were Pakistan's income tax brackets for FY 2025-2026?",
    a: "For FY 2025–2026, the slabs are: 0% up to Rs. 600,000; 5% on Rs. 600,001–1,200,000; 10% on Rs. 1,200,001–2,200,000; 15% on Rs. 2,200,001–3,200,000; 20% on Rs. 3,200,001–4,100,000; 25% on Rs. 4,100,001–5,000,000; 30% on Rs. 5,000,001–6,000,000; 35% above Rs. 6,000,000. Select FY 2025–26 in the calculator to see your tax under these rates.",
  },
  {
    q: "How do I calculate income tax on my salary in Pakistan?",
    a: "Enter your monthly gross salary and pick the fiscal year. The calculator annualises your salary (×12), applies the year's salaried-person slabs from lib/tax.ts, and shows monthly and annual tax, take-home, and effective rate. No manual math needed.",
  },
  {
    q: "How much tax will I pay on my salary in Pakistan?",
    a: "That depends on your gross monthly salary and the fiscal year. Type your salary into the calculator — it instantly shows monthly tax, annual tax, and your effective tax rate for FY 2024–25 through FY 2026–27.",
  },
  {
    q: "What will my take-home salary be after tax?",
    a: "The calculator shows 'Monthly take-home' and 'Annual take-home' right below the tax figure. Take-home = gross salary minus income tax. No other deductions (provident fund, EOBI, etc.) are included.",
  },
  {
    q: "Can I compare income tax across multiple years in Pakistan?",
    a: "Yes. In the single-year calculator, turn on “Compare with another year” and pick a second fiscal year. For a detailed period-by-period view across years, open the Multi-Year Calculator at /multi-year-calculator.",
  },
];

export const multiYearFaqs: Faq[] = [
  {
    q: "How does the Multi-Year salary tax calculation work?",
    a: "Enter consecutive salary periods between 1 July 2024 and 30 June 2027. The calculator places each period in its July–June fiscal year and works out the tax of each year with that year's own schedule.",
  },
  {
    q: "How are fiscal years determined for salary periods?",
    a: "Pakistan's tax year runs from 1 July to 30 June. When a salary period crosses 30 June, the calculator splits it by calendar days so each part lands in the right fiscal year.",
  },
  {
    q: "How are mid-month date changes and partial months calculated?",
    a: "If you got a raise or started a job mid-month, the calculator counts the exact calendar days worked in that month. You do not need to round to full months.",
  },
  {
    q: "Why are overlapping salary periods not permitted?",
    a: "Each calendar day can only belong to one salary. Overlapping dates would count the same days twice, so the calculator shows an error. Start each new period on or after the day after the previous one ends.",
  },
  {
    q: "How are bonuses and monthly deductions treated across fiscal years?",
    a: "Regular monthly bonuses are taxed together with your salary for the days they apply. Monthly deductions are post-tax payroll amounts: they reduce take-home pay but not taxable income.",
  },
  {
    q: "Which fiscal years and tax rates are included?",
    a: "Multi-year mode covers FY 2024–25, FY 2025–26 and the revised eight-band schedule of FY 2026–27, including the surcharge above Rs. 10 million where it applied.",
  },
];
