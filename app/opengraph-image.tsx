import { ogSize, renderOgImage } from "@/lib/og";
import { pages } from "@/lib/site";

export const alt = pages.home.h1;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage(pages.home.h1, pages.home.socialImageText);
}
