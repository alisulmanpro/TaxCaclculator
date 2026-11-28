import Link from "next/link";
import { Logo } from "./Logo";
import CurrentYear from "./CurrentYear";
import { pages, site } from "@/lib/site";

const guides = [
  { label: "Income Tax Slabs & System", href: "/tax-guides/income-tax-slabs" },
  { label: "Tax Deductions & Credits", href: "/tax-guides/tax-deductions-and-credits" },
  { label: "Filing Your Tax Return", href: "/tax-guides/filing-your-tax-return" },
];

const officialPortals = [
  { label: "FBR Website", href: "https://www.fbr.gov.pk/" },
  { label: "IRIS Portal", href: "https://iris.fbr.gov.pk/" },
];

const usefulLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/#faqs" },
  { label: "Blog", href: "/blog" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Income Tax Slabs", href: "/#tax-slabs" },
  { label: pages.sitemap.navLabel, href: pages.sitemap.path },
];

/** The footer of every page (styles: app/chrome.css). */
export default function Footer() {
  return (
    <footer className="fx-footer">
      <div className="fx-wrap">
        <div className="fx-footer-grid">
          <div className="fx-footer-brand">
            <Logo footer />
            <p>
              Free Pakistan salary and income tax calculators to help you understand your tax liability
              and take-home pay.
            </p>
            <p className="fx-footer-note">
              This calculator provides general estimates of Pakistan salary income tax in rupees and does
              not constitute tax or legal advice.
            </p>
          </div>

          <nav aria-labelledby="footer-guides-title">
            <h2 id="footer-guides-title">Tax Guides</h2>
            <ul>
              {guides.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
              {officialPortals.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noreferrer noopener">
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-links-title">
            <h2 id="footer-links-title">Useful Links</h2>
            <ul>
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2>Contact Us</h2>
            <dl>
              <div>
                <dt>Location</dt>
                <dd>{site.country}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
                </dd>
              </div>
              <div>
                <dt>Service Area</dt>
                <dd>All Pakistan Provinces</dd>
              </div>
              <div>
                <dt>Support</dt>
                <dd>
                  <Link href="/contact">Contact page</Link>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="fx-footer-bottom">
          <p>
            © <CurrentYear buildYear={new Date().getFullYear()} /> {site.name}. All rights reserved.
          </p>
          <span className="fx-footer-sep" aria-hidden="true" />
          <p>Designed with ❤️ in Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
