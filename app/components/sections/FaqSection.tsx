import type { Faq } from "@/lib/faqs";

/** FAQ accordion built on native <details>: answers are in the HTML for search engines, no JavaScript needed. */
export default function FaqSection({
  eyebrow = "Questions",
  title,
  lead,
  faqs,
}: {
  eyebrow?: string;
  title: string;
  lead: string;
  faqs: Faq[];
}) {
  return (
    <section className="section section-split" id="faqs" aria-labelledby="faq-title">
      <div className="stack-14">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title" id="faq-title">
          {title}
        </h2>
        <p className="section-lead" style={{ maxWidth: 360 }}>
          {lead}
        </p>
      </div>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <details className="faq-item" key={faq.q} name="faq" open={index === 0}>
            <summary>{faq.q}</summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
