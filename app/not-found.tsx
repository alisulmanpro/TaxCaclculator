import Link from "next/link";
import { Logo } from "@/app/components/layout/Logo";

export default function NotFound() {
  return (
    <main className="container flex flex-col items-center justify-center min-h-[60vh] text-center py-20">
      <Logo />
      <h1 className="mt-8 text-4xl font-bold tracking-tight">404 - Page Not Found</h1>
      <p className="mt-4 text-sm text-[#b9cebf] max-w-md">
        The page you are looking for does not exist. Use our calculator to estimate your Pakistan salary income tax.
      </p>
      <Link
        href="/"
        className="button button-green mt-8 inline-flex items-center gap-2"
      >
        Back to Tax Calculator
      </Link>
    </main>
  );
}
