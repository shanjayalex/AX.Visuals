import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "AX.Visuals — We create content for businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const [photo, logo] = await Promise.all([
    readFile(path.join(process.cwd(), "public/media/grad-profile.jpg")),
    readFile(path.join(process.cwd(), "public/brand/ax-logo.png")),
  ]);
  const src = (b: Buffer, t: string) => `data:${t};base64,${b.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0A0A0B", color: "#F4F2EE", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src(photo, "image/jpeg")} alt="" width={520} height={630} style={{ position: "absolute", right: 0, top: 0, width: 520, height: 630, objectFit: "cover", opacity: 0.85 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#0A0A0B 55%,rgba(10,10,11,.2))" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: "100%", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src(logo, "image/png")} alt="" width={60} height={68} />
            <div style={{ display: "flex", fontSize: 20, letterSpacing: 8, color: "#8A8A90" }}>● REC · SRI LANKA</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 88, fontWeight: 800, lineHeight: 0.9, letterSpacing: -3 }}>
            <span>WE CREATE</span>
            <span>CONTENT FOR</span>
            <span style={{ color: "#FF3B2F" }}>BUSINESSES.</span>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#8A8A90" }}>Reels · Photos · Brand films — packages from Rs. 25,000</div>
        </div>
      </div>
    ),
    size,
  );
}
