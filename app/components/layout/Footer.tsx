import Link from "next/link";
import { Logo } from "./Logo";
import { pages, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-top">
          <Logo footer />
          <nav className="footer-nav" aria-label="Footer">
            <Link href={pages.home.path}>{pages.home.navLabel}</Link>
            <Link href={pages.multiYear.path}>{pages.multiYear.navLabel}</Link>
            <a href="https://www.fbr.gov.pk" target="_blank" rel="noreferrer noopener">
              FBR
            </a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>
            This calculator provides general estimates of Pakistan salary income tax in rupees and does not
            constitute tax or legal advice.
          </p>
          <p>© 2026 {site.name}</p>
        </div>
      </div>
    </footer>
  );
}
