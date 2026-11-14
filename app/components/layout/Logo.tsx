export function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`brand ${footer ? "brand-footer" : ""}`}
      href="#"
      aria-label="TaxCalculato.com home"
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
