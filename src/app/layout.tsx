import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { TREK_META } from "@/data/trek";
import {
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
  SEO_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const serif = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: TREK_META.participants }],
  creator: TREK_META.participants,
  category: "travel",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: SITE_NAME,
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
  },
  appleWebApp: { title: "Kleinwalsertal", statusBarStyle: "default" },
  formatDetection: { telephone: false },
  other: {
    // Geo meta tags — the valley centre (Mittelberg / Hirschegg).
    "geo.region": "AT-8",
    "geo.placename": "Kleinwalsertal, Vorarlberg",
    "geo.position": "47.33;10.17",
    ICBM: "47.33, 10.17",
  },
};

export const viewport: Viewport = {
  themeColor: "#2E4A3F",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${serif.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
