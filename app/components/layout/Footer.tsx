import { Logo } from "./Logo";
import { nav } from "./nav";

export default function Footer() {
  return (
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
          <span>© 2026 Thomas Northman. All rights reserved.</span>
          <span>Thoughtful guidance. Clearer outcomes.</span>
          <a href="#calculator">Back to calculator ↑</a>
        </div>
        <p className="footer-disclaimer">
          This calculator provides general estimates of Pakistan salary income tax in rupees and
          does not constitute tax or legal advice.
        </p>
      </div>
    </footer>
  );
}
