import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="not-found" id="main">
      <h1>Page not found</h1>
      <p>
        The page you are looking for does not exist. Use the calculator to estimate your Pakistan salary
        income tax.
      </p>
      <Link href="/" className="btn btn-primary" style={{ flex: "0 0 auto" }}>
        Back to the calculator
      </Link>
    </main>
  );
}
