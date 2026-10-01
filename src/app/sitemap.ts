import type { MetadataRoute } from "next";
import { VALLEY_CHAPTERS } from "@/data/trek";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      // Image sitemap entries — the "La vallée" chapter photos.
      images: VALLEY_CHAPTERS.map((c) => c.image.src),
    },
  ];
}
