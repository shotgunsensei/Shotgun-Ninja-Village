import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
const root = resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", { paths: [process.argv[2] || root] }),
);
const publicRoot = resolve(
  root,
  "artifacts/shotgun-ninja-village/public/brand",
);
const sources = resolve(root, "docs/design/raster-source");
mkdirSync(resolve(publicRoot, "merch"), { recursive: true });
mkdirSync(sources, { recursive: true });
const names = [
  "signal-hunter-tee",
  "kage-9-operator-hoodie",
  "fracture-scan-drop-tee",
  "village-signal-cap",
  "tactical-sticker-pack",
  "founding-ninja-tee",
  "forge-protocol-long-sleeve",
  "noise-sector-poster",
];
const manifest = [];
for (const name of names) {
  const temporary = resolve(root, "..", name + ".base64");
  const original = resolve(sources, name + ".png");
  if (existsSync(temporary))
    writeFileSync(
      original,
      Buffer.from(readFileSync(temporary, "utf8").trim(), "base64"),
    );
  const source = readFileSync(original);
  const meta = await sharp(source).metadata();
  const web = resolve(publicRoot, "merch", name + ".webp");
  await sharp(source)
    .resize({ width: 1024, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(web);
  manifest.push({
    handle: name,
    source: "docs/design/raster-source/" + name + ".png",
    web: "artifacts/shotgun-ninja-village/public/brand/merch/" + name + ".webp",
    width: meta.width,
    height: meta.height,
    sourceBytes: source.length,
    sha256: createHash("sha256").update(source).digest("hex"),
    classification:
      "AI-generated original design concept; not a final product photo or print file",
    generator: "Built-in image_gen",
    dpiStatus: "No print readiness established",
  });
}
const hero = existsSync(resolve(publicRoot, "village-key-art.png"))
  ? resolve(publicRoot, "village-key-art.png")
  : resolve(sources, "village-key-art-v2.png");
await sharp(hero)
  .webp({ quality: 85 })
  .toFile(resolve(publicRoot, "village-key-art.webp"));
const meta = await sharp(hero).metadata();
manifest.push({
  name: "village-key-art",
  source: "docs/design/raster-source/village-key-art-v2.png",
  web: "artifacts/shotgun-ninja-village/public/brand/village-key-art.webp",
  width: meta.width,
  height: meta.height,
  sha256: createHash("sha256").update(readFileSync(hero)).digest("hex"),
  generator: "Built-in image_gen; revised with canonical Kage-9 reference",
  classification:
    "Original atmospheric web concept; not a rigged character or print master",
});
writeFileSync(
  resolve(root, "docs/design/asset-manifest.json"),
  JSON.stringify({ date: "2026-10-14", assets: manifest }, null, 2),
);
console.log(
  JSON.stringify(
    manifest.map(({ handle, name, width, height }) => ({
      asset: handle || name,
      width,
      height,
    })),
    null,
    2,
  ),
);
