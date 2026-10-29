// Builds width variants (`name-480.webp`, `name-960.webp`) for shipped photos so
// `SitePhoto` can serve phones a small file via srcset. Run: `node scripts/media-variants.mjs`.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = path.join(process.cwd(), "public", "media");
const WIDTHS = [240, 480, 720, 960, 1400];

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith(".webp") || /-(240|480|720|960|1400)\.webp$/.test(file)) continue;
  const source = path.join(dir, file);
  const { width = 0 } = await sharp(source).metadata();
  for (const w of WIDTHS) {
    const out = path.join(dir, file.replace(/\.webp$/, `-${w}.webp`));
    // Smaller widths need real downscaling; a same-width variant is just a lighter re-encode.
    if (w < width ? width <= w * 1.2 : w !== width) continue;
    await sharp(source).resize({ width: w }).webp({ quality: 62 }).toFile(out);
    console.log(path.basename(out), Math.round(fs.statSync(out).size / 1024), "KB");
  }
}
