'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pages } from "@/lib/site";

const links = [
  { label: pages.home.navLabel, href: pages.home.path },
  { label: pages.multiYear.navLabel, href: pages.multiYear.path },
  { label: "FAQ", href: "#faqs" },
  { label: "Official sources", href: "#resources" },
];

const calculatorPaths: string[] = [pages.home.path, pages.multiYear.path];

/** Main navigation. Only this part is a client component, to mark the current page. */
export default function NavLinks({ label }: { label: string }) {
  const pathname = usePathname();
  return (
    <nav className="site-nav" aria-label={label}>
      {links.map((link) => {
        const isPage = link.href.startsWith("/");
        const current = isPage && pathname === link.href;
        // Anchor links stay on a calculator page; other pages have no such section, so they go home.
        const base = calculatorPaths.includes(pathname) ? pathname : pages.home.path;
        const href = isPage ? link.href : `${base}${link.href}`;
        return (
          <Link key={link.label} href={href} aria-current={current ? "page" : undefined}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
