import { test } from "node:test";
import assert from "node:assert/strict";
import {
  encodeSingle,
  decodeSingle,
  encodeMulti,
  decodeMulti,
  type SingleShareState,
  type MultiShareState,
} from "../lib/share.ts";

const single: SingleShareState = {
  year: "2025",
  salary: "200000",
  bonus: "50000",
  deductions: "1500",
  withheld: "10000",
  comparison: "2024",
  insightsOpen: true,
  tab: "comparison",
};

test("single year: encode then decode returns the same state", () => {
  assert.deepEqual(decodeSingle(encodeSingle(single)), single);
});

test("single year: commas in amounts are stripped and zero extras are omitted", () => {
  const query = encodeSingle({
    ...single,
    salary: "200,000",
    bonus: "0",
    deductions: "",
    withheld: "0",
    insightsOpen: false,
  });
  assert.equal(query, "fy=2025&sal=200000&cmp=2024");
  const back = decodeSingle(query);
  assert.equal(back?.bonus, "0");
  assert.equal(back?.insightsOpen, false);
  assert.equal(back?.tab, "overview");
});

test("single year: invalid or missing salary gives null", () => {
  assert.equal(decodeSingle(""), null);
  assert.equal(decodeSingle("fy=2025"), null);
  assert.equal(decodeSingle("sal=0"), null);
  assert.equal(decodeSingle("sal=abc"), null);
  assert.equal(decodeSingle("sal=-5"), null);
  assert.equal(decodeSingle("sal=1000000001"), null);
  assert.equal(decodeSingle("sal=99999999999999"), null);
});

test("single year: unknown year, comparison and tab fall back safely", () => {
  const back = decodeSingle("sal=100000&fy=1999&cmp=2000&tab=hack&ins=1");
  assert.equal(back?.year, "2026");
  assert.notEqual(back?.comparison, "2026");
  assert.equal(back?.tab, "overview");
  assert.equal(back?.insightsOpen, true);
});

test("single year: comparison equal to the year is replaced", () => {
  const back = decodeSingle("sal=100000&fy=2025&cmp=2025");
  assert.notEqual(back?.comparison, "2025");
});

const multi: MultiShareState = {
  periods: [
    {
      start: "2024-07-01",
      end: "2025-06-30",
      salary: "150000",
      monthlyBonus: "0",
      monthlyDeductions: "0",
    },
    {
      start: "2025-07-01",
      end: "2026-06-30",
      salary: "200000",
      monthlyBonus: "5000",
      monthlyDeductions: "1000",
    },
  ],
  insightsOpen: true,
  tab: "periods",
};

test("multi year: encode then decode returns the same state", () => {
  assert.deepEqual(decodeMulti(encodeMulti(multi)), multi);
});

test("multi year: insights hidden state is kept", () => {
  const back = decodeMulti(encodeMulti({ ...multi, insightsOpen: false }));
  assert.equal(back?.insightsOpen, false);
});

test("multi year: bad dates, ranges and amounts give null", () => {
  assert.equal(decodeMulti(""), null);
  assert.equal(decodeMulti("p=2024-07-01_2025-06-30_150000_0"), null);
  assert.equal(decodeMulti("p=2024-13-01_2025-06-30_150000_0_0"), null);
  assert.equal(decodeMulti("p=2024-02-30_2025-06-30_150000_0_0"), null);
  assert.equal(decodeMulti("p=2023-07-01_2025-06-30_150000_0_0"), null);
  assert.equal(decodeMulti("p=2024-07-01_2027-07-01_150000_0_0"), null);
  assert.equal(decodeMulti("p=2025-07-01_2025-06-30_150000_0_0"), null);
  assert.equal(decodeMulti("p=2024-07-01_2025-06-30_0_0_0"), null);
  assert.equal(decodeMulti("p=2024-07-01_2025-06-30_x_0_0"), null);
});

test("multi year: too many periods are rejected", () => {
  const many = Array.from({ length: 13 }, () => "p=2024-07-01_2024-07-31_1000_0_0").join("&");
  assert.equal(decodeMulti(many), null);
});
