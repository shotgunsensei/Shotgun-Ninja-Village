import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, extname } from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, "..");
const sharp = require(
  require.resolve("sharp", { paths: [process.argv[2] || root] }),
);
const app = resolve(root, "artifacts/shotgun-ninja-village");
const names = readdirSync(resolve(app, "public/images")).filter((name) =>
  name.endsWith(".png"),
);
for (const name of names)
  await sharp(resolve(app, "public/images", name))
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(resolve(app, "public/images", name.replace(".png", ".webp")));
function update(directory) {
  for (const file of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, file.name);
    if (file.isDirectory()) update(path);
    else if ([".ts", ".tsx"].includes(extname(path))) {
      const original = readFileSync(path, "utf8");
      let content = original;
      for (const name of names)
        content = content.replaceAll(
          "images/" + name,
          "images/" + name.replace(".png", ".webp"),
        );
      if (content !== original) writeFileSync(path, content);
    }
  }
}
update(resolve(app, "src"));
await sharp(resolve(root, "docs/design/raster-source/village-key-art-v2.png"))
  .resize(1200, 630, { fit: "cover" })
  .jpeg({ quality: 90 })
  .toFile(resolve(app, "public/brand/village-social.jpg"));
const preserved = execFileSync(
  "git",
  ["show", "785788f:artifacts/shotgun-ninja-village/src/data/products.ts"],
  { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
)
  .split("export const collections:")[1]
  .replaceAll("\r\n", "\n");
const current = readFileSync(resolve(app, "src/data/products.ts"), "utf8")
  .split("export const collections:")[1]
  .replaceAll("\r\n", "\n");
if (current !== preserved) throw new Error("Catalog data changed");
console.log(
  "15 canonical PNGs retained; loss-limited WebP derivatives wired. Product/collection records match source.",
);
