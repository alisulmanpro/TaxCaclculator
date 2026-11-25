import test from "node:test";
import assert from "node:assert/strict";
import { toolCategories } from "../lib/tools-directory.ts";

test("tools directory has exactly 1 category and 2 tools", () => {
  assert.equal(toolCategories.length, 1);

  const category = toolCategories[0];
  assert.equal(category.id, "salary-income");
  assert.equal(category.name, "SALARY & INCOME");
  assert.equal(category.icon, "wallet");
  assert.equal(category.tools.length, 2);

  const tool1 = category.tools[0];
  assert.equal(tool1.id, "salary-tax-calculator");
  assert.equal(tool1.name, "Salary Tax Calculator");
  assert.equal(tool1.description, "Calculate your Pakistan salary income tax and take-home pay.");
  assert.equal(tool1.href, "/");
  assert.equal(tool1.icon, "calculator");

  const tool2 = category.tools[1];
  assert.equal(tool2.id, "multi-year-calculator");
  assert.equal(tool2.name, "Multi-Year Income Tax Calculator");
  assert.equal(
    tool2.description,
    "Calculate your salary tax across multiple fiscal years, including salary changes and job transitions."
  );
  assert.equal(tool2.href, "/multi-year-calculator");
  assert.equal(tool2.icon, "calculator");
});

test("all tool categories and tools have valid structure and required fields", () => {
  for (const cat of toolCategories) {
    assert.ok(cat.id.length > 0, "category id must not be empty");
    assert.ok(cat.name.length > 0, "category name must not be empty");
    assert.ok(["wallet", "briefcase", "globe", "calculator"].includes(cat.icon));
    assert.ok(cat.tools.length > 0, "category must contain at least 1 tool");

    for (const tool of cat.tools) {
      assert.ok(tool.id.length > 0, "tool id must not be empty");
      assert.ok(tool.name.length > 0, "tool name must not be empty");
      assert.ok(tool.description.length > 0, "tool description must not be empty");
      assert.ok(tool.href.startsWith("/"), "tool href must be a valid path");
      assert.ok(
        ["calculator", "wallet", "briefcase", "target", "globe", "trending-up"].includes(tool.icon),
        `tool icon ${tool.icon} is invalid`
      );
    }
  }
});
