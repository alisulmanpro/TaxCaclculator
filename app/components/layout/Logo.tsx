import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

/** Brand logo (public/logo.png). Links home. `footer` puts it on a white chip for the dark footer. */
export function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <Link href="/" className={footer ? "footer-logo" : "brand-logo"} aria-label={`${site.name} – home`}>
      <Image src="/logo.png" alt={site.name} width={720} height={247} priority={!footer} />
    </Link>
  );
}
