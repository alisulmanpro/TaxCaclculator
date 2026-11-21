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

const faqs: [string, string][] = [
  [
    "How does the income tax calculator work?",
    "Choose a fiscal year and enter your monthly salary in Pakistani rupees. The calculator applies that year's Pakistan salaried-person tax schedule to annual income. Multi-Year mode groups your salary and bonuses into July–June fiscal years and calculates each year separately.",
  ],
  [
    "What is the difference between gross and taxable income?",
    "Gross salary includes your salary and taxable bonuses. This tool treats those amounts as taxable salary before calculating income tax. The monthly deductions field is for post-tax payroll deductions, which reduce take-home pay without reducing taxable income.",
  ],
  [
    "Which taxes and fiscal years are included?",
    "The calculator estimates Pakistan salaried-person income tax for FY 2024–25, 2025–26, and 2026–27, including applicable salary surcharges in earlier years. Special reliefs, tax credits, other income, and super tax are excluded.",
  ],
  [
    "How do I enter bonuses and monthly deductions?",
    "Open Additional fields in a salary period. Add each yearly bonus in rupees or as a salary multiple and select its payment month. Regular monthly bonuses are taxed with salary. Monthly deductions are post-tax amounts and affect take-home pay only.",
  ],
  [
    "How accurate is my tax estimate?",
    "Estimates use the salaried-person schedules for the selected fiscal year and assume salary is your principal source of income. Monthly figures are annual estimates divided by 12. Your actual liability can differ because of other income, credits, reliefs, special circumstances, or incomplete salary history. This is not tax advice.",
  ],
  [
    "Is my financial information saved or shared?",
    "No. All calculations happen in your browser. The income and deduction values you enter are not submitted to a server or saved by this calculator.",
  ],
];

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="faq-section container" id="faqs">
      <style>{`
        .faq-list {
          padding: 4px 24px;
        }
        .faq-item {
          border-bottom: 1px solid #e6e8e1;
        }
        .faq-item:first-child {
          border-top: 0;
        }
        .faq-item:last-child {
          border-bottom: 0;
        }
        .faq-item h3 {
          margin: 0 !important;
          padding: 0 !important;
          font-size: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
        .faq-item h3 > button {
          display: flex;
          width: 100%;
          gap: 20px;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0 !important;
          min-height: 58px;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.4;
          color: #20221f;
          text-align: left;
          background: transparent;
          border: 0;
          cursor: pointer;
          transition: color 0.22s ease;
        }
        .faq-item h3 > button > span {
          flex-shrink: 0;
          display: grid;
          place-items: center;
          width: 23px;
          height: 23px;
          color: #6e7e67;
          background: #f3f5ef;
          border-radius: 50%;
          transition: background 0.22s ease, color 0.22s ease;
        }
        .faq-item h3 svg {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .faq-item.expanded h3 svg {
          transform: rotate(45deg);
        }
        .faq-item.expanded h3 > button {
          color: #008857;
          padding: 18px 0 10px !important;
        }
        .faq-item.expanded h3 > button > span {
          background: #e8f5ed;
          color: #008857;
        }
        /* Animated accordion panel using CSS grid trick */
        .faq-answer-wrap {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.32s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .faq-answer-wrap.is-open {
          grid-template-rows: 1fr;
        }
        .faq-answer-inner {
          overflow: hidden;
        }
        .faq-item p {
          margin: 0 !important;
          font-size: 12px;
          line-height: 1.75;
          color: #8c9383;
          padding: 0 28px 18px 0 !important;
        }
        @media (max-width: 760px) {
          .faq-list {
            padding-inline: 18px;
          }
          .faq-item h3 {
            margin: 0 !important;
            padding: 0 !important;
          }
          .faq-item h3 > button {
            font-size: 11px;
            padding: 15px 0 !important;
            min-height: 52px;
            gap: 12px;
          }
          .faq-item.expanded h3 > button {
            padding: 15px 0 8px !important;
          }
          .faq-item p {
            margin: 0 !important;
            font-size: 11px;
            padding: 0 20px 14px 0 !important;
          }
        }
        @media (max-width: 480px) {
          .faq-item h3 {
            margin: 0 !important;
            padding: 0 !important;
          }
          .faq-item h3 > button {
            font-size: 12px;
            padding: 15px 0 !important;
            min-height: 52px;
          }
          .faq-item.expanded h3 > button {
            padding: 15px 0 8px !important;
          }
          .faq-item p {
            margin: 0 !important;
            font-size: 12px;
            padding: 0 16px 14px 0 !important;
          }
        }
      `}</style>
      <div className="faq-intro">
        <div className="eyebrow">GOOD QUESTIONS. CLEAR ANSWERS.</div>
        <h2>
          A little more
          <br />
          clarity.
        </h2>
        <p>
          Taxes come with questions.
          <br />
          Let&apos;s answer a few of yours.
        </p>
        <div className="faq-contact">
          <span>Still have a question?</span>
          <a className="text-link" href="mailto:hello@taxcalculato.com">
            Let&apos;s talk <ArrowIcon />
          </a>
        </div>
      </div>
      <div className="faq-list">
        {faqs.map(([question, answer], index) => (
          <div className={`faq-item ${openFaq === index ? "expanded" : ""}`} key={question}>
            <h3>
              <button
                aria-expanded={openFaq === index}
                aria-controls={`faq-${index}`}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                {question}
                <span>
                  <PlusIcon />
                </span>
              </button>
            </h3>
            {/* CSS grid-row trick: animates 0fr → 1fr smoothly without JS height measurement */}
            <div
              id={`faq-${index}`}
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
