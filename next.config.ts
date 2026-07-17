import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Chapter photos in the "La vallée" section come from Wikimedia Commons.
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;
