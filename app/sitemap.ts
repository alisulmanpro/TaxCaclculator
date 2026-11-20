import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://taxcalculato.com",
      lastModified: "2026-11-20T00:00:00.000Z",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://taxcalculato.com/multi-year-calculator",
      lastModified: "2026-11-20T00:00:00.000Z",
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
