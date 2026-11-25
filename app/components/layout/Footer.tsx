"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { site } from "@/lib/site";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer-inner">
        {/* Main 4-Column Grid */}
        <div className="footer-columns">
          {/* Column 1: Brand & Newsletter */}
          <div className="footer-col footer-col-brand">
            <div className="footer-logo-wrap">
              <Logo footer />
            </div>

            <p className="footer-brand-desc">
              Free Pakistan salary and income tax calculators to help you understand your tax
              liability and take-home pay.
            </p>

            <div className="footer-newsletter">
              <h3 className="footer-newsletter-title">Subscribe to Tax Updates</h3>

              {subscribed ? (
                <div className="footer-newsletter-success" role="status">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Thank you for subscribing! You will receive timely tax updates.</span>
                </div>
              ) : (
                <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                  <div className="footer-input-wrap">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      aria-label="Email address for tax updates"
                      className="footer-newsletter-input"
                    />
                  </div>
                  <button type="submit" className="footer-newsletter-btn">
                    Subscribe
                  </button>
                </form>
              )}

              <p className="footer-disclaimer-text">
                This calculator provides general estimates of Pakistan salary income tax in rupees
                and does not constitute tax or legal advice.
              </p>
            </div>
          </div>

          {/* Column 2: Tax Guides */}
          <div className="footer-col">
            <h3 className="footer-col-title">TAX GUIDES</h3>
            <ul className="footer-link-list">
              <li>
                <Link href="/tax-guides/income-tax-slabs" className="footer-bullet-link">
                  <span className="footer-bullet" aria-hidden="true" />
                  <span>Income Tax Slabs &amp; System</span>
                </Link>
              </li>
              <li>
                <Link href="/tax-guides/tax-deductions-and-credits" className="footer-bullet-link">
                  <span className="footer-bullet" aria-hidden="true" />
                  <span>Tax Deductions &amp; Credits</span>
                </Link>
              </li>
              <li>
                <Link href="/tax-guides/filing-your-tax-return" className="footer-bullet-link">
                  <span className="footer-bullet" aria-hidden="true" />
                  <span>Filing Your Tax Return</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://www.fbr.gov.pk/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="footer-bullet-link"
                >
                  <span className="footer-bullet" aria-hidden="true" />
                  <span>FBR Website</span>
                </a>
              </li>
              <li>
                <a
                  href="https://iris.fbr.gov.pk/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="footer-bullet-link"
                >
                  <span className="footer-bullet" aria-hidden="true" />
                  <span>IRIS Portal</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div className="footer-col">
            <h3 className="footer-col-title">USEFUL LINKS</h3>
            <ul className="footer-link-list">
              <li>
                <Link href="/about" className="footer-bullet-link">
                  <span className="footer-bullet" aria-hidden="true" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-bullet-link">
                  <span className="footer-bullet" aria-hidden="true" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link href="/#faqs" className="footer-bullet-link">
                  <span className="footer-bullet" aria-hidden="true" />
                  <span>FAQs</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="footer-bullet-link">
                  <span className="footer-bullet" aria-hidden="true" />
                  <span>Blog</span>
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className="footer-bullet-link">
                  <span className="footer-bullet" aria-hidden="true" />
                  <span>Terms of Use</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="footer-bullet-link">
                  <span className="footer-bullet" aria-hidden="true" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/#tax-slabs" className="footer-bullet-link">
                  <span className="footer-bullet" aria-hidden="true" />
                  <span>Income Tax Slabs</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="footer-col footer-col-contact">
            <h3 className="footer-col-title">CONTACT US</h3>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <span className="footer-contact-label">Location:</span>
                <span className="footer-contact-value">Pakistan</span>
              </div>

              <div className="footer-contact-item">
                <span className="footer-contact-label">Email:</span>
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="footer-contact-value footer-contact-link"
                >
                  {site.contactEmail}
                </a>
              </div>

              <div className="footer-contact-item">
                <span className="footer-contact-label">Service Area:</span>
                <span className="footer-contact-value">All Pakistan Provinces</span>
              </div>

              <div className="footer-contact-item">
                <span className="footer-contact-label">Support:</span>
                <Link href="/contact" className="footer-contact-value footer-contact-link">
                  Online Contact Form
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Divider & Bottom Copyright Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} {site.name}. All rights reserved.
          </p>
          <p className="footer-tagline">Designed with ❤️ in Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
