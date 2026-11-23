"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Lightweight, accessible scroll observer.
 * - Triggers gentle entrance transitions once per section/card.
 * - Disconnects / unobserves elements once revealed (no re-hiding on scroll).
 * - Leaves elements 100% visible if reduced motion is preferred or if JS is disabled.
 * - Completely avoids continuous scroll-linked opacity interpolation (no bottom-of-screen fade).
 */
export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    document.documentElement.classList.add("js-reveal-ready");

    const targets = document.querySelectorAll<HTMLElement>(
      ".tax-section-header, .tax-card, .faq-header, .faq-container, .resource-card, .quran-card, .scroll-reveal"
    );

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.05,
      }
    );

    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // If element is already visible or above the viewport fold on initial load, reveal immediately
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("is-revealed");
      } else {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
