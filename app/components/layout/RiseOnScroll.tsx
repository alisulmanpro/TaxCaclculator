"use client";

import { useEffect } from "react";

const STEP_MS = 90;
const MAX_WAIT_MS = 720;

/**
 * Raises every `.fx-rise` element into place, one after another, as it is scrolled into view.
 * Content is only hidden once this runs, and never with reduced motion, so nothing depends on it.
 */
export default function RiseOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const items = Array.from(document.querySelectorAll<HTMLElement>(".fx-rise"));
    let nextStart = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (!isIntersecting) return;
          const element = target as HTMLElement;
          const now = performance.now();
          // Queue behind the previous element, without letting a fast scroll build up a long wait.
          const start = Math.min(Math.max(now, nextStart), now + MAX_WAIT_MS);
          nextStart = start + STEP_MS;
          element.style.setProperty("--rise-delay", `${Math.round(start - now)}ms`);
          element.classList.remove("fx-wait");
          observer.unobserve(element);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    items.forEach((element) => {
      // Whatever is already on screen (or above it) stays as it is, so nothing blinks on load.
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.classList.add("fx-wait");
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      items.forEach((element) => element.classList.remove("fx-wait"));
    };
  }, []);

  return null;
}
