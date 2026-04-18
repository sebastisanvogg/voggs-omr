import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#080808",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          fontFamily: "system-ui, sans-serif",
          fontSize: 22,
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
