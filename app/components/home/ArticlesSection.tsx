'use client';

import { useEffect, useRef, useState } from "react";

function ArrowIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function DiagonalIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 18 18 6M6 6h12v12" />
    </svg>
  );
}

const articles = [
  {
    category: "TAX ESSENTIALS",
    title: "Understanding your salary income tax",
    description:
      "A little clarity goes a long way. Get to know the basics of how your income is taxed.",
    image: "tax-planning.jpg",
    time: "6 min read",
    alt: "Tax documents and a pen organized on a desk",
    content: [
      "Pakistan uses progressive income tax bands for salaried individuals. Each portion of your annual salary is taxed at the rate for that band. Moving into a higher band does not mean all of your income is taxed at the highest rate.",
      "Pakistan’s normal fiscal year runs from 1 July to 30 June. The calculator uses the salary schedule for your selected fiscal year and shows annual estimates alongside monthly averages, all in Pakistani rupees.",
      "These estimates assume salary is your principal source of income. Special reliefs, tax credits, other income, and super tax are not included. Consult FBR guidance or a qualified tax professional for your circumstances.",
    ],
  },
  {
    category: "SMARTER PLANNING",
    title: "Bonuses and deductions, explained",
    description: "Know the difference, explore your options, and make a more informed choice.",
    image: "calculator.jpg",
    time: "4 min read",
    alt: "Calculator and laptop ready for financial planning",
    content: [
      "A regular monthly bonus or allowance is included with your salary income. In the Multi-Year calculator, enter it separately so that it is included for the days covered by that salary period.",
      "A yearly bonus is a one-off payment. Enter its value in rupees or as a multiple of monthly salary, then choose the payment month. For example, two salaries of Rs. 100,000 add Rs. 200,000 to income in the payment month’s fiscal year.",
      "Monthly deductions in this tool are post-tax payroll deductions, such as advance repayments or welfare contributions. They reduce your take-home pay, not your taxable salary. Statutory reliefs and tax credits need separate professional review.",
    ],
  },
  {
    category: "FILING WITH CONFIDENCE",
    title: "Your checklist for a smoother tax season",
    description: "The documents, dates, and details to have ready before you file your return.",
    image: "filing.jpg",
    time: "5 min read",
    alt: "Preparing financial documents at a desk",
    content: [
      "Gather your CNIC or NTN details, salary certificates, payslips, bonus records, bank statements, and your previous return. Keep a record of income tax withheld by your employer.",
      "Check that your salary periods, bonus payment dates, and deductions match your records. Compare your employer’s withholding certificate with your estimated annual liability and review any eligible credits separately.",
      "Use FBR’s official website and Iris portal to confirm current filing requirements and deadlines. This calculator is a planning aid, not a tax return. Save your submitted return and supporting documents.",
    ],
  },
];

export default function ArticlesSection() {
  const [article, setArticle] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (article !== null) dialog.current?.showModal();
    else dialog.current?.close();
  }, [article]);

  return (
    <>
      <section className="articles-section container" id="guides">
        <div className="section-heading">
          <div>
            <div className="eyebrow">A LITTLE KNOWLEDGE GOES A LONG WAY</div>
            <h2>Make sense of your taxes</h2>
          </div>
          <a className="text-link" href="#article-list">
            Explore the guides <ArrowIcon size={17} />
          </a>
        </div>
        <p className="section-description">
          Straightforward guidance to help you make more confident financial decisions.
        </p>
        <div className="article-grid" id="article-list">
          {articles.map((item, index) => (
            <article className="article-card" key={item.title}>
              <button
                className="article-image-button"
                onClick={() => setArticle(index)}
                aria-label={`Read ${item.title}`}
              >
                <img
                  src={`/images/${item.image}`}
                  alt={item.alt}
                  loading="lazy"
                />
                <span>
                  <DiagonalIcon size={20} />
                </span>
              </button>
              <div className="article-meta">
                {item.category}
                <span>{item.time}</span>
              </div>
              <h3>
                <button onClick={() => setArticle(index)}>{item.title}</button>
              </h3>
              <p>{item.description}</p>
              <button className="text-link" onClick={() => setArticle(index)}>
                Read article <ArrowIcon size={16} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <dialog
        ref={dialog}
        onCancel={() => setArticle(null)}
        onClick={(event) => {
          if (event.target === dialog.current) setArticle(null);
        }}
        className="article-dialog"
      >
        {article !== null && (
          <>
            <button
              className="dialog-close"
              onClick={() => setArticle(null)}
              aria-label="Close article"
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 6 12 12M6 18 18 6" />
              </svg>
            </button>
            <img src={`/images/${articles[article].image}`} alt="" />
            <div className="dialog-body">
              <div className="eyebrow">
                {articles[article].category} · {articles[article].time}
              </div>
              <h2>{articles[article].title}</h2>
              {articles[article].content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <a
                className="text-link"
                href="https://www.fbr.gov.pk/"
                target="_blank"
                rel="noreferrer"
              >
                Read official guidance at FBR <DiagonalIcon size={16} />
              </a>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
