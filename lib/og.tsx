import { ImageResponse } from "next/og";
import { OG_LOGO_SRC } from "./og-logo";
import { site } from "./site";

export const ogSize = { width: 1200, height: 630 };

/**
 * Social share image (1200×630) built from lib/site.ts text and the embedded logo (lib/og-logo.ts).
 * Used by app/opengraph-image.tsx and app/multi-year-calculator/opengraph-image.tsx.
 */
export async function renderOgImage(headline: string, subline: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #0B3D2E 0%, #0F6B4C 100%)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            background: "#ffffff",
            borderRadius: 24,
            padding: "18px 28px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders to an image, next/image is not supported here */}
          <img src={OG_LOGO_SRC} width={262} height={90} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>{headline}</div>
          <div style={{ fontSize: 34, color: "#BBD6C8" }}>{subline}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#8FDDBB" }}>
          {site.url.replace(/^https?:\/\//, "")} · Free · Private · Runs in your browser
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
