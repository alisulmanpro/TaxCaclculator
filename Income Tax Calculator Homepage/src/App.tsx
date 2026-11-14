import { useEffect, useRef, useState } from "react";
import SalaryCalculator from "./SalaryCalculator";

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    diagonal: (
      <>
        <path d="M6 18 18 6M6 6h12v12" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    calculator: (
      <>
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M8 6h8M8 11h1m4 0h3M8 15h1m4 0h3M8 19h1m4 0h3" />
      </>
    ),
    book: (
      <>
        <path d="M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1v15" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    plus: <path d="M5 12h14M12 5v14" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.book}
    </svg>
  );
}

function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`brand ${footer ? "brand-footer" : ""}`}
      href="#"
      aria-label="Thomas Northman home"
    >
      <svg
        viewBox="0 0 42 42"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        aria-hidden="true"
      >
        <path d="M21 3v33M6 9h30M10 9 4 27h12L10 9Zm22 0-6 18h12L32 9ZM14 37h14M18 33h6M19 5h4" />
        <path d="M4 27c3 4 9 4 12 0m10 0c3 4 9 4 12 0" />
      </svg>
      <span>TaxCalculato.com{footer && <small>TAX LAWYER</small>}</span>
    </a>
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
    content: [
      "Gather your CNIC or NTN details, salary certificates, payslips, bonus records, bank statements, and your previous return. Keep a record of income tax withheld by your employer.",
      "Check that your salary periods, bonus payment dates, and deductions match your records. Compare your employer’s withholding certificate with your estimated annual liability and review any eligible credits separately.",
      "Use FBR’s official website and Iris portal to confirm current filing requirements and deadlines. This calculator is a planning aid, not a tax return. Save your submitted return and supporting documents.",
    ],
  },
];
const faqs = [
  [
    "How does the income tax calculator work?",
    "Choose a fiscal year and enter your monthly salary in Pakistani rupees. The calculator applies that year’s Pakistan salaried-person tax schedule to annual income. Multi-Year mode groups your salary and bonuses into July–June fiscal years and calculates each year separately.",
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
const nav = [
  { label: "About", href: "#about" },
  { label: "Disputes", href: "#guides" },
  { label: "International", href: "#resources" },
  { label: "Rates & Fees", href: "#calculator" },
  { label: "Contact", href: "mailto:consultation@thomasnorthman.com" },
];

export default function App() {
  const [menu, setMenu] = useState(false);
  const [article, setArticle] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (article !== null) dialog.current?.showModal();
    else dialog.current?.close();
  }, [article]);
  return (
    <>
      <header className="header container">
        <Logo />
        <nav className={menu ? "navigation is-open" : "navigation"} aria-label="Main navigation">
          {nav.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setMenu(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <a
          className="button button-black consultation"
          href="mailto:consultation@thomasnorthman.com"
        >
          Consultation <Icon name="diagonal" size={13} />
        </a>
        <button
          className="mobile-toggle"
          onClick={() => setMenu(!menu)}
          aria-label="Toggle navigation"
          aria-expanded={menu}
        >
          <Icon name={menu ? "close" : "menu"} />
        </button>
      </header>

      <main>
        <section className="hero hero-centered container" id="about">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="green-line" /> CLARITY. CONFIDENCE. PEACE OF MIND.
            </div>
            <h1>
              Pakistan Salary & <span>Income Tax</span> Calculator
            </h1>
            <p>
              Understand your income. Know your taxes.
              <br className="desktop-break" /> Our income tax calculator brings clarity to the
              numbers—so you can plan your next step with confidence.
            </p>
          </div>
          <div
            className="calculator-section"
            id="calculator"
            role="region"
            aria-labelledby="calculator-title"
          >
            <h2 className="sr-only" id="calculator-title">
              Income tax calculator
            </h2>
            <SalaryCalculator />
          </div>
        </section>

        <section className="quote-section">
          <div className="quote-mark">“</div>
          <blockquote>
            “Tax is a puzzle—with the right insight,
            <br />
            you can see the bigger picture.”
          </blockquote>
          <span>LESS COMPLEXITY. MORE POSSIBILITY.</span>
        </section>

        <section className="articles-section container" id="guides">
          <div className="section-heading">
            <div>
              <div className="eyebrow">A LITTLE KNOWLEDGE GOES A LONG WAY</div>
              <h2>Make sense of your taxes</h2>
            </div>
            <a className="text-link" href="#article-list">
              Explore the guides <Icon name="arrow" size={17} />
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
                    alt={
                      index === 0
                        ? "Tax documents and a pen organized on a desk"
                        : index === 1
                          ? "Calculator and laptop ready for financial planning"
                          : "Preparing financial documents at a desk"
                    }
                    loading="lazy"
                  />
                  <span>
                    <Icon name="diagonal" size={20} />
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
                  Read article <Icon name="arrow" size={16} />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="faq-section container" id="faqs">
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
              Let’s answer a few of yours.
            </p>
            <div className="faq-contact">
              <span>Still have a question?</span>
              <a className="text-link" href="mailto:consultation@thomasnorthman.com">
                Let’s talk <Icon name="arrow" size={17} />
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
                      <Icon name="plus" size={18} />
                    </span>
                  </button>
                </h3>
                <div id={`faq-${index}`} hidden={openFaq !== index}>
                  <p>{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="resources-section container" id="resources">
          <div className="section-heading">
            <div>
              <div className="eyebrow">STRAIGHT FROM THE SOURCE</div>
              <h2>Official resources. Reliable answers.</h2>
            </div>
            <span className="resource-note">
              <Icon name="shield" size={16} /> Trusted government sources
            </span>
          </div>
          <p className="section-description">
            For the finer details, go directly to the people who write the rules.
          </p>
          <div className="resource-grid">
            {[
              {
                icon: "globe",
                name: "Federal Board of Revenue",
                text: "Pakistan’s official source for income tax information, forms, and updates.",
                label: "Visit FBR",
                url: "https://www.fbr.gov.pk/",
              },
              {
                icon: "book",
                name: "FBR Iris portal",
                text: "Access your official registration, income tax returns, and filing records.",
                label: "Open Iris",
                url: "https://iris.fbr.gov.pk/",
              },
              {
                icon: "calculator",
                name: "Pakistan Code",
                text: "Find federal legislation and review the laws behind your tax obligations.",
                label: "Explore legislation",
                url: "https://pakistancode.gov.pk/",
              },
            ].map((resource) => (
              <a
                className="resource-card"
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="resource-icon">
                  <Icon name={resource.icon} size={24} />
                </span>
                <h3>{resource.name}</h3>
                <p>{resource.text}</p>
                <span className="text-link">
                  {resource.label}
                  <Icon name="diagonal" size={16} />
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="bottom-cta container">
          <div>
            <div className="eyebrow">YOUR NEXT STEP, WITH CONFIDENCE.</div>
            <h2>
              Some questions deserve
              <br />a personal conversation.
            </h2>
            <p>For the complexities a calculator can’t solve, we’re here.</p>
          </div>
          <a className="button button-green" href="mailto:consultation@thomasnorthman.com">
            Start a consultation <Icon name="arrow" size={17} />
          </a>
        </section>
      </main>

      <footer>
        <div className="container footer-content">
          <Logo footer />
          <nav aria-label="Footer navigation">
            {nav.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="footer-rule" />
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Thomas Northman. All rights reserved.</span>
            <span>Thoughtful guidance. Clearer outcomes.</span>
            <a href="#calculator">Back to calculator ↑</a>
          </div>
          <p className="footer-disclaimer">
            This calculator provides general estimates of Pakistan salary income tax in rupees and
            does not constitute tax or legal advice.
          </p>
        </div>
      </footer>
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
              <Icon name="close" />
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
                Read official guidance at FBR <Icon name="diagonal" size={16} />
              </a>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
