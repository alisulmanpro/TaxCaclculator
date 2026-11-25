export interface CalculatorTool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: "calculator" | "wallet" | "briefcase" | "target" | "globe" | "trending-up";
  badge?: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: "wallet" | "briefcase" | "globe" | "calculator";
  tools: CalculatorTool[];
}

/**
 * Scalable category-based tools directory configuration.
 * Currently configured with 1 active category ("SALARY & INCOME") and 2 active calculators:
 * 1. Single-Year: Salary Tax Calculator ("/")
 * 2. Multi-Year: Multi-Year Income Tax Calculator ("/multi-year-calculator")
 *
 * Future categories and tools can be added here without modifying the component logic.
 */
export const toolCategories: ToolCategory[] = [
  {
    id: "salary-income",
    name: "SALARY & INCOME",
    icon: "wallet",
    tools: [
      {
        id: "salary-tax-calculator",
        name: "Salary Tax Calculator",
        description: "Calculate your Pakistan salary income tax and take-home pay.",
        href: "/",
        icon: "calculator",
      },
      {
        id: "multi-year-calculator",
        name: "Multi-Year Income Tax Calculator",
        description:
          "Calculate your salary tax across multiple fiscal years, including salary changes and job transitions.",
        href: "/multi-year-calculator",
        icon: "calculator",
      },
    ],
  },
];
