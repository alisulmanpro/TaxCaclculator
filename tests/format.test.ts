import test from "node:test";
import assert from "node:assert/strict";
import {
  formatWithCommas,
  cleanNumber,
  calculateNewCursor,
} from "../lib/format.ts";

test("formatWithCommas formats thousands separators properly", () => {
  assert.equal(formatWithCommas(""), "");
  assert.equal(formatWithCommas("0"), "0");
  assert.equal(formatWithCommas("50"), "50");
  assert.equal(formatWithCommas("100"), "100");
  assert.equal(formatWithCommas("1000"), "1,000");
  assert.equal(formatWithCommas("10000"), "10,000");
  assert.equal(formatWithCommas("100000"), "100,000");
  assert.equal(formatWithCommas("1000000"), "1,000,000");
  assert.equal(formatWithCommas("10000000"), "10,000,000");
  assert.equal(formatWithCommas("100000000"), "100,000,000");
  assert.equal(formatWithCommas("1000000000"), "1,000,000,000");
});

test("formatWithCommas cleans invalid and leading zero inputs", () => {
  assert.equal(formatWithCommas("05000"), "5,000");
  assert.equal(formatWithCommas("0000"), "0");
  assert.equal(formatWithCommas("abc"), "");
  assert.equal(formatWithCommas("1,000abc"), "1,000");
  assert.equal(formatWithCommas("Rs. 50,000"), "50,000");
  assert.equal(formatWithCommas("-5000"), "5,000");
});

test("cleanNumber parses formatted strings to pure numbers", () => {
  assert.equal(cleanNumber(""), 0);
  assert.equal(cleanNumber("0"), 0);
  assert.equal(cleanNumber("1,000"), 1000);
  assert.equal(cleanNumber("10,000"), 10000);
  assert.equal(cleanNumber("100,000"), 100000);
  assert.equal(cleanNumber("1,000,000"), 1000000);
  assert.equal(cleanNumber("invalid"), 0);
});

test("calculateNewCursor calculates correct cursor position", () => {
  // Empty
  assert.equal(calculateNewCursor("", 0, ""), 0);

  // Typing at end of 100 -> 1000 => 1,000
  assert.equal(calculateNewCursor("1000", 4, "1,000"), 5);

  // Typing in middle: 1|000 -> typed 2 -> raw 12,000 -> 12,000 cursor after 2
  assert.equal(calculateNewCursor("12,000", 2, "12,000"), 2);

  // Typing at end of 10000 -> 100000 => 100,000
  assert.equal(calculateNewCursor("100000", 6, "100,000"), 7);

  // Pasting 500000 into empty
  assert.equal(calculateNewCursor("500000", 6, "500,000"), 7);
});
