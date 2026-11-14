import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://taxcalculato.com",
      lastModified: "2026-11-15T00:00:00.000Z",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
