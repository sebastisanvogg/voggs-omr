import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VOGGSMEDIA — TikTok Ads FUNKTIONIEREN";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#080808",
          backgroundImage:
            "radial-gradient(ellipse at 50% 0%, rgba(232,32,42,0.35) 0%, rgba(8,8,8,0) 55%)",
          padding: "72px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              backgroundColor: "#e8202a",
            }}
          />
          <div
            style={{
              fontSize: 20,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#e8202a",
              fontWeight: 600,
            }}
          >
            OMR Masterclass 2026 · VOGGSMEDIA
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 132,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: "-4px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>TikTok Ads</span>
            <span style={{ color: "#e8202a" }}>FUNKTIONIEREN.</span>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#a0a0a0",
              maxWidth: 820,
              lineHeight: 1.35,
            }}
          >
            Teste deine Ad in 30 Sekunden — KI-Analyse nach dem
            Hook-Trust-CTA Framework aus unserer Masterclass.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 28,
              fontSize: 22,
              color: "#a0a0a0",
            }}
          >
            <span>300+ Kunden</span>
            <span style={{ color: "#555" }}>|</span>
            <span>300 Mio. € Ad-Spend</span>
            <span style={{ color: "#555" }}>|</span>
            <span style={{ color: "#f59e0b" }}>4,93 / 5 ProvenExpert</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-0.5px",
            }}
          >
            <span>VOGGS</span>
            <span style={{ color: "#e8202a" }}>MEDIA</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
