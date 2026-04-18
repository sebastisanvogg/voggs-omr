import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#080808",
          backgroundImage:
            "radial-gradient(ellipse at 50% 20%, rgba(232,32,42,0.35) 0%, rgba(8,8,8,0) 60%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          fontSize: 120,
          fontWeight: 900,
          color: "#e8202a",
          letterSpacing: "-0.04em",
        }}
      >
        V
      </div>
    ),
    { ...size }
  );
}
