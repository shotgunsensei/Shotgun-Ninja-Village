import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const started = Number(process.env.VILLAGE_BUILD_STARTED_MS ?? 0);
const outputs = [
  ["mockup", "artifacts/mockup-sandbox/dist/index.html"],
  ["episode1", "artifacts/shotgun-ninjas-ep1/dist/public/index.html"],
  ["episode2", "artifacts/shotgun-ninjas-ep2/dist/public/index.html"],
  ["episode3", "artifacts/shotgun-ninjas-ep3/dist/public/index.html"],
  ["village", "artifacts/shotgun-ninja-village/dist/public/index.html"],
  ["api", "artifacts/api-server/dist/index.mjs"],
];

for (const [name, relativePath] of outputs) {
  const file = path.resolve(relativePath);
  const stat = statSync(file);
  assert(stat.isFile() && stat.size > 0, `Empty or missing ${name} entry`);
  assert(stat.mtimeMs >= started, `Stale ${name} entry`);
  const bytes = readFileSync(file);
  if (file.endsWith(".html")) {
    const references = [...bytes.toString("utf8").matchAll(/(?:src|href)="(\/assets\/[^"?#]+)[^"]*"/g)];
    assert(references.length > 0, `No built assets referenced by ${name}`);
    for (const [, asset] of references) {
      assert(existsSync(path.join(path.dirname(file), asset)), `Missing ${name} asset ${asset}`);
    }
  }
  console.log(JSON.stringify({ name, path: relativePath, bytes: stat.size, sha256: createHash("sha256").update(bytes).digest("hex") }));
}
