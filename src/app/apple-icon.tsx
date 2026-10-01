import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// PNG twin of icon.svg — iOS home-screen icons don't accept SVG.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0F6E56" }}>
        <svg width="180" height="180" viewBox="0 0 64 64">
          <circle cx="46" cy="19" r="7" fill="#EF9F27" />
          <path d="M4 54 L22 20 L32 38 L41 25 L60 54 Z" fill="#F1EFE8" />
          <path d="M22 20 L27 29 L22 27 L17 29 Z" fill="#0F6E56" fillOpacity="0.25" />
        </svg>
      </div>
    ),
    size,
  );
}
