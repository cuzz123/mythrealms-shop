import { ImageResponse } from "next/og";

export const alt = "MythRealms — Ancient Chinese Mythology Jewelry";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default Open Graph / Twitter share image for every page (Next.js convention).
// Pages may override via their own openGraph.images.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#14110B",
          color: "#F5EFE0",
        }}
      >
        <div style={{ fontSize: 86, fontWeight: 700, letterSpacing: 14, color: "#D4A84B" }}>
          MYTHREALMS
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: "#E8DEC8", maxWidth: 900, textAlign: "center" }}>
          Handcrafted Gemstone Bracelets · Ancient Chinese Mythology
        </div>
        <div style={{ marginTop: 36, fontSize: 25, color: "#B9A77E" }}>
          28 Lunar Mansions · Five Elements · Find your guardian
        </div>
      </div>
    ),
    { ...size }
  );
}
