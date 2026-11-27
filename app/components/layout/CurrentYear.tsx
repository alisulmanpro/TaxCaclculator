"use client";

import { useSyncExternalStore } from "react";

const noSubscription = () => () => {};

/** Copyright year: the build year in the static HTML, then the visitor's current year. */
export default function CurrentYear({ buildYear }: { buildYear: number }) {
  return useSyncExternalStore(
    noSubscription,
    () => new Date().getFullYear(),
    () => buildYear,
  );
}
