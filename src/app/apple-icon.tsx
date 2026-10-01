import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// PNG twin of icon.svg — iOS home-screen icons don't accept SVG.
// iOS rounds the corners itself, so the background is a full square.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#2E4A3F" }}>
        <svg width="180" height="180" viewBox="0 0 24 24">
          <path
            d="m8 3 4 8 5-5 5 15H2L8 3z"
            transform="translate(3 3.25) scale(0.75)"
            fill="none"
            stroke="#F6F4EF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
