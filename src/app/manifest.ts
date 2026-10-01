import type { MetadataRoute } from "next";
import { SEO_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Kleinwalsertal",
    description: SEO_DESCRIPTION,
    lang: "fr",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F4EF",
    theme_color: "#2E4A3F",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
