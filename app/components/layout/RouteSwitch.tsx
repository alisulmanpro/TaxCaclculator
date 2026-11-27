"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { pages } from "@/lib/site";

const calculatorPaths: string[] = [pages.home.path, pages.multiYear.path];

/**
 * Header and footer live in the root layout, which every page shares. This picks the
 * calculator-page version on the two calculator routes and the original everywhere else.
 */
export default function RouteSwitch({ calculator, other }: { calculator: ReactNode; other: ReactNode }) {
  return calculatorPaths.includes(usePathname()) ? calculator : other;
}
