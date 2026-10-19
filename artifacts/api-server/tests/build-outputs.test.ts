import { afterAll, describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import path from "node:path";

const fixtures: string[] = [];
afterAll(() => fixtures.forEach(dir => rmSync(dir, { recursive: true, force: true })));
const script = path.resolve(import.meta.dirname, "../../../scripts/verify-build-outputs.mjs");
function run(mode: "valid" | "wrong-prefix" | "missing-asset" | "stale") {
  const root = mkdtempSync(path.join(tmpdir(), "village-build-outputs-"));
  fixtures.push(root);
  function file(relative: string, body: string) {
    const target = path.join(root, relative);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, body);
  }
  for (const name of ["mockup-sandbox", "shotgun-ninja-village", "shotgun-ninjas-ep1", "shotgun-ninjas-ep2", "shotgun-ninjas-ep3"]) {
    const directory = `artifacts/${name}/dist${name === "mockup-sandbox" ? "" : "/public"}`;
    const prefix = name.startsWith("shotgun-ninjas-ep") && !(mode === "wrong-prefix" && name.endsWith("2")) ? `/${name}/` : "/";
    file(`${directory}/index.html`, `<script src="${prefix}assets/index.js"></script>`);
    if (!(mode === "missing-asset" && name.endsWith("3"))) file(`${directory}/assets/index.js`, "console.log('built')");
  }
  file("artifacts/api-server/dist/index.mjs", "console.log('api')");
  return spawnSync(process.execPath, [script], {
    cwd: root,
    env: { ...process.env, VILLAGE_BUILD_STARTED_MS: mode === "stale" ? String(Date.now() + 10_000) : "0" },
    encoding: "utf8",
    windowsHide: true,
  });
}
describe("release output verification", () => {
  it("accepts all six fresh outputs with distinct episode prefixes", () => {
    const result = run("valid");
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout.trim().split("\n")).toHaveLength(6);
  });
  for (const mode of ["wrong-prefix", "missing-asset", "stale"] as const) {
    it(`rejects ${mode} release output`, () => {
      expect(run(mode).status).not.toBe(0);
    });
  }
});
