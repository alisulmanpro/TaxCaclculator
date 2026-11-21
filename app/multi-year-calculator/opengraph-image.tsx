import { ogSize, renderOgImage } from "@/lib/og";
import { pages } from "@/lib/site";

export const alt = pages.multiYear.h1;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage(pages.multiYear.h1, pages.multiYear.socialImageText);
}
