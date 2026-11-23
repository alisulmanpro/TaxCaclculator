"use client";

import type { Faq } from "@/lib/faqs";
import { useState } from "react";

export interface FaqSectionProps {
  badge?: string;
  title?: string;
  lead?: string;
  faqs: Faq[];
}

/**
 * FAQ accordion section built with accessible semantic buttons and headings (H3),
 * single-open accordion behavior, smooth CSS-driven expand/collapse transitions,
 * and clear + / − state indicator aligned to the right.
 */
export default function FaqSection({
  badge = "Got questions?",
  title = "Frequently Asked Questions",
  lead = "Clear answers about Pakistan income tax and how the calculator works.",
  faqs,
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="section-faq" id="faqs" aria-labelledby="faq-title">
      <div className="faq-container">
        <div className="faq-header">
          {badge && <span className="faq-badge">{badge}</span>}
          <h2 className="section-title faq-title" id="faq-title">
            {title}
          </h2>
          {lead && <p className="section-lead faq-lead">{lead}</p>}
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const buttonId = `faq-trigger-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <div
                className={`faq-item ${isOpen ? "faq-item-open" : ""}`}
                key={faq.q}
              >
                <h3 className="faq-question-heading">
                  <button
                    type="button"
                    id={buttonId}
                    className="faq-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="faq-question-text">{faq.q}</span>
                    <span className="faq-icon-wrapper" aria-hidden="true">
                      <svg
                        className="faq-icon-svg"
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Horizontal line (remains visible for both + and -) */}
                        <path
                          d="M4.5 10H15.5"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                        {/* Vertical line (scales and rotates away when open to form -) */}
                        <path
                          d="M10 4.5V15.5"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          className="faq-icon-vert"
                        />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`faq-panel ${isOpen ? "faq-panel-open" : ""}`}
                >
                  <div className="faq-panel-inner">
                    <p className="faq-answer-text">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
