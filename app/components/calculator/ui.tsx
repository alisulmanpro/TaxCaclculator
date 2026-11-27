'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { pages } from "@/lib/site";
import {
  handleFormattedInputChange,
  handleFormattedInputKeyDown,
} from "@/lib/format";

/* ─────────────────────────────────────────── Icons ─────────────────────────────────────────── */

export function ChevronDown() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20">
      <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRight({ color = "#fff" }: { color?: string }) {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
      <path d="M3 9h12M10 4l5 5-5 5" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InfoIcon() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" style={{ flex: "none", marginTop: 1 }}>
      <circle cx="11" cy="11" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11 10v5.5M11 6.6v.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function DownloadIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
      <path d="M9 2v9M5 8l4 4 4-4M3 15h12" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LinkIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
      <path d="M7.5 10.5a3 3 0 0 0 4.2 0l2.6-2.6a3 3 0 0 0-4.2-4.2l-.8.8M10.5 7.5a3 3 0 0 0-4.2 0L3.7 10.1a3 3 0 0 0 4.2 4.2l.8-.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
      <path d="M3.5 9.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CaretIcon({ up }: { up: boolean }) {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
      <path d={up ? "M4 11.5l5-5 5 5" : "M4 6.5l5 5 5-5"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
      <path d="M9 3v12M3 9h12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14">
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function TickCircle() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="10" fill="#DCEDE3" />
      <path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#0F5C45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────── Pieces ─────────────────────────────────────────── */

/** Single year / Multi-year switch. Both are real links, so each mode has its own indexable URL. */
export function ModeTabs({ active }: { active: "single" | "multi" }) {
  return (
    <nav className="calc-modes" aria-label="Calculator type">
      <Link
        href={pages.home.path}
        className={`calc-mode${active === "single" ? " is-active" : ""}`}
        aria-current={active === "single" ? "page" : undefined}
      >
        <span className="calc-mode-title">Single year</span>
        <span className="calc-mode-sub">Same salary all year</span>
      </Link>
      <Link
        href={pages.multiYear.path}
        className={`calc-mode${active === "multi" ? " is-active" : ""}`}
        aria-current={active === "multi" ? "page" : undefined}
      >
        <span className="calc-mode-title">Multi-year</span>
        <span className="calc-mode-sub">Salary changed or new job</span>
      </Link>
    </nav>
  );
}

/** Rupee amount input with live thousands separators (lib/format.ts). */
export function MoneyInput({
  id,
  value,
  onChange,
  placeholder,
  invalid,
  large = false,
  describedBy,
  inputRef,
}: {
  id: string;
  value: string;
  onChange: (formatted: string) => void;
  placeholder: string;
  invalid?: boolean;
  large?: boolean;
  describedBy?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  if (large) {
    return (
      <div className={`money${invalid ? " money-bad" : ""}`}>
        <span className="money-prefix" aria-hidden="true">
          Rs.
        </span>
        <input
          id={id}
          ref={inputRef}
          type="text"
          value={value}
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={(e) => handleFormattedInputChange(e, onChange)}
          onKeyDown={(e) => handleFormattedInputKeyDown(e, onChange)}
        />
      </div>
    );
  }
  return (
    <input
      id={id}
      ref={inputRef}
      className="control control-sm"
      type="text"
      value={value}
      inputMode="numeric"
      autoComplete="off"
      placeholder={placeholder}
      aria-describedby={describedBy}
      onChange={(e) => handleFormattedInputChange(e, onChange)}
      onKeyDown={(e) => handleFormattedInputKeyDown(e, onChange)}
    />
  );
}

export function SelectField({
  id,
  value,
  onChange,
  children,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="select-wrap">
      <select id={id} className="control" value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
      <ChevronDown />
    </div>
  );
}

export function Empty({ lines }: { lines: string[] }) {
  return (
    <div className="empty">
      <svg aria-hidden="true" width="64" height="64" viewBox="0 0 64 64">
        <rect x="8" y="34" width="12" height="22" rx="3" fill="#0F5C45" />
        <rect x="26" y="22" width="12" height="34" rx="3" fill="#5E9F85" />
        <rect x="44" y="8" width="12" height="48" rx="3" fill="#F28C28" />
      </svg>
      <div>
        <p className="empty-title">Your tax will show here</p>
        <p className="empty-text">
          Enter your salary, then press <strong>Calculate</strong>. It also
          updates as you type.
        </p>
      </div>
      <ul>
        {lines.map((line) => (
          <li key={line}>
            <TickCircle />
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Insights header with the Show / Hide button (lives in the Insights section, not the result panel). */
export function InsightsHeader({
  subtitle,
  open,
  onToggle,
}: {
  subtitle: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="insights-head">
      <div>
        <h2 className="calc-title" id="insights-title">
          Insights
        </h2>
        <p>{subtitle}</p>
      </div>
      <button
        type="button"
        className="btn btn-secondary btn-toggle"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="insights-body"
      >
        {open ? "Hide insights" : "Show insights"}
        <CaretIcon up={open} />
      </button>
    </div>
  );
}

/** Tooltip card used by every chart. */
export function ChartTooltip({
  active,
  label,
  rows,
}: {
  active?: boolean;
  label?: string;
  rows: { name: string; value: string; color: string }[];
}) {
  if (!active || rows.length === 0) return null;
  return (
    <div className="chart-tooltip">
      {label && <b>{label}</b>}
      {rows.map((row) => (
        <div key={row.name}>
          <span className="dot" style={{ width: 10, height: 10, borderRadius: 3, background: row.color, display: "inline-block" }} />
          <span>
            {row.name}: <strong>{row.value}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────── Hooks ─────────────────────────────────────────── */

/**
 * Copy text to the clipboard. Falls back to a hidden textarea where the async
 * Clipboard API is unavailable (plain http, older browsers). Returns whether it worked.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/** "Copy shareable link" behaviour: builds the URL when clicked, so it always matches what is on screen. */
export function useCopyLink(getUrl: () => string) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = useCallback(async () => {
    const url = getUrl();
    const ok = await copyText(url);
    if (!ok) {
      // Last resort: put the link in the address bar so it can be copied by hand.
      try {
        const parsed = new URL(url);
        window.history.replaceState(null, "", `${parsed.pathname}${parsed.search}`);
      } catch {
        /* ignore */
      }
    }
    setState(ok ? "copied" : "failed");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2400);
  }, [getUrl]);

  return { state, copy };
}

/** Runs a PDF download and tracks the busy / error state for the button. */
export function usePdfDownload(run: () => Promise<void>) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const start = useCallback(async () => {
    setBusy(true);
    setError(false);
    try {
      await run();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }, [run]);

  return { busy, error, start };
}

/** Rupee formatting helpers shared by the charts. */
export const pct = (n: number) => `${+n.toFixed(2)}%`;
export const compactAxis = (n: number) => {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${+(n / 1_000).toFixed(0)}K`;
  return String(n);
};

export const chartColors = {
  keep: "#0F5C45",
  tax: "#D9730D",
  deduction: "#7D9288",
  old: "#7D9288",
  grid: "#E5EDE8",
  axis: "#55655D",
};

/** Download PDF + Copy shareable link, shown at the bottom of every result panel. */
export function ResultActions({
  onPdf,
  getUrl,
}: {
  onPdf: () => Promise<void>;
  getUrl: () => string;
}) {
  const pdf = usePdfDownload(onPdf);
  const link = useCopyLink(getUrl);
  return (
    <>
      <div className="result-actions">
        <button type="button" className="btn btn-pdf" onClick={pdf.start} disabled={pdf.busy}>
          <DownloadIcon />
          {pdf.busy ? "Preparing PDF…" : "Download PDF"}
        </button>
        <button type="button" className="btn btn-share" onClick={link.copy}>
          {link.state === "copied" ? <CheckIcon /> : <LinkIcon />}
          <span aria-live="polite">
            {link.state === "copied"
              ? "Link copied"
              : link.state === "failed"
                ? "Copy failed"
                : "Copy shareable link"}
          </span>
        </button>
      </div>
      {pdf.error && (
        <p className="result-error" role="alert">
          The PDF could not be created. Please try again.
        </p>
      )}
      {link.state === "failed" && (
        <p className="result-error" role="alert">
          Your browser blocked copying. The link is now in the address bar: copy it from there.
        </p>
      )}
    </>
  );
}
