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
    background_color: "#F1EFE8",
    theme_color: "#0F6E56",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
