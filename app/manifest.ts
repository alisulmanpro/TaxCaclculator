import type { MetadataRoute } from "next";
import { pages, site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: pages.home.title,
    short_name: site.shortName,
    description: pages.home.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F3F6F3",
    theme_color: site.themeColor,
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
