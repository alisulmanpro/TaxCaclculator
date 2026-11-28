import { test } from "node:test";
import assert from "node:assert/strict";
import { singleYearFaqs } from "../lib/faqs.ts";

test("the slab answers state the rates the calculator uses", () => {
  const [now, previous] = singleYearFaqs;
  for (const part of ["1% on Rs. 600,001–1,200,000", "20% on Rs. 2,200,001–3,200,000", "35% above Rs. 7,000,000", "No surcharge"]) {
    assert.ok(now.a.includes(part), part);
  }
  for (const part of ["23% on Rs. 2,200,001–3,200,000", "35% above Rs. 4,100,000", "surcharge of 9%"]) {
    assert.ok(previous.a.includes(part), part);
  }
});
