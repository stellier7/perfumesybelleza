import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "64px",
          height: "64px",
          background: "#f3d5ce",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8c6733",
          fontSize: 34,
          fontFamily: "Georgia",
        }}
      >
        P
      </div>
    ),
    { ...size },
  );
}
