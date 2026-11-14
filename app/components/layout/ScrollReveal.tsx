'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // ms
  as?: 'section' | 'div' | 'article';
}

/**
 * Lightweight scroll-reveal wrapper.
 * Adds `reveal-visible` class when the element enters the viewport.
 * Uses a single IntersectionObserver per instance; no library needed.
 */
export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            el.style.transitionDelay = `${delay}ms`;
          }
          el.classList.add('reveal-visible');
          observer.unobserve(el); // fire once only
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  // Cast to avoid TypeScript union-ref complaints
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal-on-scroll ${className}`}
    >
      {children}
    </Tag>
  );
}
