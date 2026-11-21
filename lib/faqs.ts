// FAQ content. These items are shown on the page AND written into the FAQPage
// structured data, so Google can show them as rich results. Edit them here.
// Keep answers plain text (no HTML) and keep them identical to what the page shows.

export type Faq = { q: string; a: string };

export const singleYearFaqs: Faq[] = [
  {
    q: "How does the income tax calculator work?",
    a: "Choose a fiscal year and enter your monthly salary in Pakistani rupees. The calculator applies that year's salaried-person tax schedule to your annual income and shows your tax and take-home pay.",
  },
  {
    q: "What is the difference between gross and taxable income?",
    a: "Gross salary includes your salary and taxable bonuses. This tool treats those amounts as taxable salary before calculating income tax. The monthly deductions field is for post-tax payroll deductions, which reduce take-home pay without reducing taxable income.",
  },
  {
    q: "Which taxes and fiscal years are included?",
    a: "The calculator estimates Pakistan salaried-person income tax for FY 2020–21 to FY 2026–27, including the salary surcharge where it applied. Special reliefs, tax credits, other income and super tax are not included.",
  },
  {
    q: "How do I enter bonuses and monthly deductions?",
    a: "Open Additional fields and type your annual bonus, your monthly deductions and any tax already withheld. Leave them empty if you are not sure. Monthly deductions are post-tax amounts and affect take-home pay only.",
  },
  {
    q: "How accurate is my tax estimate?",
    a: "Estimates use the salaried-person schedule of the selected fiscal year and assume salary is your main source of income. Monthly figures are the annual figure divided by 12. Your actual tax can differ because of other income, credits or reliefs. This is not tax advice.",
  },
  {
    q: "Is my financial information saved or shared?",
    a: "No. All calculations happen in your browser. The amounts you type are not sent to a server or saved by this calculator. A shareable link only contains the numbers you choose to share.",
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
