// Resizes the studio's source photos (in the parent folder) into web-ready copies in /public/media.
// Run: node scripts/optimize-media.mjs
import sharp from "sharp";
import path from "node:path";

const SRC = path.resolve("..");
const OUT = path.resolve("public/media");

const map = {
  "_ALX5050.jpg": "grad-red-wall.jpg",
  "_ALX5056.jpg": "grad-tube-landscape.jpg",
  "_ALX5057.jpg": "grad-tube-hands.jpg",
  "_ALX5162.jpg": "grad-tube-forward.jpg",
  "_ALX5217.jpg": "grad-low-angle.jpg",
  "_ALX5223.jpg": "grad-profile.jpg",
  "dgthdfg.jpg": "post-officially-graduated.jpg",
  "fvgdfx.jpg": "post-hard-work.jpg",
  "sdrfgtswer.jpg": "post-next-chapter.jpg",
  "srfdgdesrf.jpg": "post-tube-dark.jpg",
  "srfghbsdf.jpg": "post-made-it.jpg",
  "Untitled-1jkl.jpg": "post-chapter-completed.jpg",
  "xcvbdf.jpg": "post-dreams-reality.jpg",
  "sfdgvsdf.jpg": "ceremony-deiva-satchiyaga.jpg",
  "dvgdx.jpg": "ceremony-mangalyam.jpg",
  "xfbghdxf.jpg": "ceremony-anbin-adaiyalam.jpg",
  "zsdvfgsxd.jpg": "ceremony-sirakattum.jpg",
};

for (const [src, out] of Object.entries(map)) {
  const img = sharp(path.join(SRC, src)).rotate();
  const meta = await img.metadata();
  await img
    .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, out));
  console.log(out, meta.width + "x" + meta.height);
}

// Logo: trim the transparent padding
await sharp(path.join(SRC, "ChatGPT Image Sep 10, 2026, 06_58_00 PM.png"))
  .trim()
  .png()
  .toFile(path.resolve("public/brand/ax-logo.png"));
console.log("logo done", await sharp("public/brand/ax-logo.png").metadata().then(m => m.width + "x" + m.height));
