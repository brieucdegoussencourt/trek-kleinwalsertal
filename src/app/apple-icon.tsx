import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// PNG twin of icon.svg — iOS home-screen icons don't accept SVG.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#2E4A3F" }}>
        <svg width="180" height="180" viewBox="0 0 64 64">
          <circle cx="46" cy="19" r="7" fill="#C9A15A" />
          <path d="M4 54 L22 20 L32 38 L41 25 L60 54 Z" fill="#F6F4EF" />
          <path d="M22 20 L27 29 L22 27 L17 29 Z" fill="#2E4A3F" fillOpacity="0.25" />
        </svg>
      </div>
    ),
    size,
  );
}
