import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Perfumes y Belleza, envío a todo Honduras";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#f6f0e8",
          color: "#211915",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, color: "#8c6733", fontFamily: "Georgia" }}>
          HONDURAS
        </div>
        <div style={{ marginTop: 16, fontSize: 84, lineHeight: 0.95, fontFamily: "Georgia" }}>
          Perfumes y Belleza
        </div>
        <div style={{ marginTop: 24, fontSize: 32, color: "#72655d" }}>
          Diseñador, alternativas árabes y belleza
        </div>
      </div>
    ),
    { ...size },
  );
}
