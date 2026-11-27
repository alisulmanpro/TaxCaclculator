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
    q: "What is a Multi-Year Income Tax Calculator?",
    a: "It is a specialized tax calculator for salaried individuals in Pakistan that computes income tax and take-home pay across multiple fiscal years. Rather than assuming a single flat salary, it tracks changing compensation, promotions, and multiple employment periods across official July–June fiscal boundaries.",
  },
  {
    q: "When should I use a Multi-Year Salary Tax Calculator?",
    a: "Use it whenever your salary changed during the year, if you switched employers, received mid-month increments, took unpaid leaves, earned variable bonuses, or want to compare your tax obligations and take-home earnings across several Pakistani fiscal years (FY 2024–25 to FY 2026–27).",
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
    q: "Why does the calculator count actual working days?",
    a: "Employment periods often start or terminate mid-month. Counting exact calendar days worked instead of rounding to whole months ensures your daily salary and recurring allowances are prorated mathematically, preventing over- or under-estimation of your taxable income.",
  },
  {
    q: "How is salary divided when it crosses two fiscal years?",
    a: "If a salary period extends across 30 June (for instance, 1 May to 31 August), the calculator automatically splits the period at the 30 June boundary. Days up to 30 June are allocated to the earlier fiscal year, and days from 1 July onward are allocated to the new fiscal year under its new tax rules.",
  },
  {
    q: "Which tax slabs are applied to each fiscal year?",
    a: "Each fiscal year is governed by its own FBR statutory schedule enacted by parliament. The calculator automatically applies the relevant tax slabs for each period: FY 2024–25 rates, FY 2025–26 rates, or the revised FY 2026–27 progressive brackets, including any high-income surcharges above Rs. 10 million.",
  },
  {
    q: "Can I calculate income across multiple fiscal years?",
    a: "Yes. You can enter consecutive salary periods covering any timeframe between 1 July 2024 and 30 June 2027. The calculator sorts and groups your timeline by fiscal year, giving you a detailed year-by-year summary of gross income, tax liability, and take-home pay.",
  },
  {
    q: "How is the final tax liability determined?",
    a: "Within each fiscal year, all base salaries and bonuses earned are summed to compute annual taxable income. The statutory progressive rates for that year are applied to determine total tax. Post-tax payroll deductions are subtracted from net income to calculate your exact take-home pay.",
  },
];
