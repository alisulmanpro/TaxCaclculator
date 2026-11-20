// Helper utilities for comma-separated number formatting, parsing, and cursor preservation

/**
 * Format a numeric string with thousands separators (commas).
 * Strips all non-digit characters and leading zeros (preserving "0").
 * Returns an empty string if the input has no digits.
 */
export function formatWithCommas(val: string): string {
  if (!val) return "";
  // Strip everything except digits
  const clean = val.replace(/\D/g, "");
  if (!clean) return "";
  // Strip leading zeros if followed by other digits, unless just "0"
  let whole = clean;
  if (whole.length > 1 && whole.startsWith("0")) {
    whole = whole.replace(/^0+/, "") || "0";
  }
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Clean a formatted string into a safe positive numeric value.
 * Strips all commas and whitespace.
 * Returns 0 if empty, invalid, or negative.
 */
export function cleanNumber(val: string): number {
  if (!val) return 0;
  const clean = String(val).replace(/,/g, "").trim();
  const num = Number(clean);
  return Number.isFinite(num) && num >= 0 ? num : 0;
}

/**
 * Calculate the new cursor position in a formatted string
 * based on how many digits were before the cursor in the unformatted string.
 */
export function calculateNewCursor(
  rawValue: string,
  selectionStart: number,
  formattedValue: string
): number {
  const nonCommasBefore = rawValue.slice(0, selectionStart).replace(/,/g, "").length;
  if (nonCommasBefore === 0) return 0;

  let count = 0;
  for (let i = 0; i < formattedValue.length; i++) {
    if (formattedValue[i] !== ",") {
      count++;
    }
    if (count === nonCommasBefore) {
      return i + 1;
    }
  }
  return formattedValue.length;
}

/**
 * React input change handler that formats salary/numeric amounts live
 * while preserving the user's cursor position.
 */
export function handleFormattedInputChange(
  e: React.ChangeEvent<HTMLInputElement>,
  onChange: (formatted: string) => void
): void {
  const input = e.target;
  const raw = input.value;
  const selectionStart = input.selectionStart ?? raw.length;
  const formatted = formatWithCommas(raw);
  const newCursor = calculateNewCursor(raw, selectionStart, formatted);

  onChange(formatted);

  if (typeof requestAnimationFrame !== "undefined") {
    requestAnimationFrame(() => {
      input.setSelectionRange(newCursor, newCursor);
    });
  }
}

/**
 * React input keydown handler that handles Backspace when deleting across a comma.
 */
export function handleFormattedInputKeyDown(
  e: React.KeyboardEvent<HTMLInputElement>,
  onChange: (formatted: string) => void
): void {
  if (e.key === "Backspace") {
    const input = e.currentTarget;
    const { selectionStart, selectionEnd, value } = input;
    if (selectionStart !== null && selectionStart === selectionEnd && selectionStart > 1) {
      if (value[selectionStart - 1] === ",") {
        e.preventDefault();
        // Delete the digit before the comma instead of leaving it trapped
        const nextRaw = value.slice(0, selectionStart - 2) + value.slice(selectionStart);
        const formatted = formatWithCommas(nextRaw);
        const newCursor = calculateNewCursor(nextRaw, selectionStart - 2, formatted);
        onChange(formatted);
        if (typeof requestAnimationFrame !== "undefined") {
          requestAnimationFrame(() => {
            input.setSelectionRange(newCursor, newCursor);
          });
        }
      }
    }
  }
}
