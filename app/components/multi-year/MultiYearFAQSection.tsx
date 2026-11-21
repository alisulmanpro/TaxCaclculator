'use client';

import { useState } from "react";

function PlusIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5v14" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const multiYearFaqs: [string, string][] = [
  [
    "How does the Multi-Year salary tax calculation work?",
    "The Multi-Year calculator allows you to enter consecutive salary periods between 1 July 2024 and 30 June 2027. It maps your earnings, bonuses, and deductions to their respective July–June Pakistan fiscal years and computes tax liability using each fiscal year's exact statutory schedule.",
  ],
  [
    "How are fiscal years determined for salary periods?",
    "In Pakistan, the financial tax year runs from 1 July of one calendar year to 30 June of the next. When a salary period spans across 30 June, the calculator automatically prorates your salary and splits earnings into their respective fiscal years based on calendar days worked.",
  ],
  [
    "How are mid-month date changes and partial months calculated?",
    "If you received a salary increment, promotion, or started a job mid-month, the calculator uses the exact number of calendar days worked in that month to calculate proportional gross earnings. You do not need to approximate full months.",
  ],
  [
    "Why are overlapping salary periods not permitted?",
    "For salaried persons, each calendar day can only be attributed to a single active compensation rate. Overlapping date ranges create double-counting of working days and are flagged with an error. Ensure the start date of a new period begins on or after the day following the previous period's end date.",
  ],
  [
    "How are bonuses and monthly deductions treated across fiscal years?",
    "Regular monthly bonuses and allowances are taxed alongside your monthly salary for the days active. Annual one-off bonuses are allocated to the specific fiscal year in which they are received. Post-tax payroll deductions reduce net take-home pay without lowering your taxable income.",
  ],
  [
    "Which fiscal years and tax rates are included?",
    "The calculator covers Finance Act schedules for FY 2024–25, FY 2025–26, and the revised eight-band schedule for FY 2026–27, including applicable super-salary surcharges above Rs. 10 million in earlier years.",
  ],
];

export default function MultiYearFAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="faq-section container" id="faqs">
      <div className="faq-intro">
        <div className="eyebrow">GOOD QUESTIONS. CLEAR ANSWERS.</div>
        <h2>
          Multi-Year
          <br />
          tax clarity.
        </h2>
        <p>
          Managing changing salaries across fiscal years?
          <br />
          Here are the answers to common questions.
        </p>
        <div className="faq-contact">
          <span>Still have a question?</span>
          <a className="text-link" href="mailto:hello@taxcalculato.com">
            Let&apos;s talk <ArrowIcon />
          </a>
        </div>
      </div>
      <div className="faq-list">
        {multiYearFaqs.map(([question, answer], index) => (
          <div className={`faq-item ${openFaq === index ? "expanded" : ""}`} key={question}>
            <h3>
              <button
                aria-expanded={openFaq === index}
                aria-controls={`multi-faq-${index}`}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                {question}
                <span>
                  <PlusIcon />
                </span>
              </button>
            </h3>
            <div
              id={`multi-faq-${index}`}
              className={`faq-answer-wrap${openFaq === index ? " is-open" : ""}`}
              role="region"
              aria-hidden={openFaq !== index}
            >
              <div className="faq-answer-inner">
                <p>{answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
