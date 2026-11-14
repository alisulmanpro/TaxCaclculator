'use client';

import { useState } from "react";
import { nav } from "./nav";
import { Logo } from "./Logo";

function DiagonalIcon() {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 18 18 6M6 6h12v12" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 6 12 12M6 18 18 6" />
    </svg>
  );
}

export default function Header() {
  const [menu, setMenu] = useState(false);

  return (
    <header className="header container">
      <Logo />
      <nav
        className={menu ? "navigation is-open" : "navigation"}
        aria-label="Main navigation"
      >
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
        Consultation <DiagonalIcon />
      </a>
      <button
        className="mobile-toggle"
        onClick={() => setMenu(!menu)}
        aria-label="Toggle navigation"
        aria-expanded={menu}
      >
        {menu ? <CloseIcon /> : <MenuIcon />}
      </button>
    </header>
  );
}
