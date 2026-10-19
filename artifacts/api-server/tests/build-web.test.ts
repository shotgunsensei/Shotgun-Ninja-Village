import { afterAll, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import path from "node:path";

const fixture = mkdtempSync(path.join(tmpdir(), "village-release-build-"));
const fakePnpm = path.join(fixture, "fake-pnpm.cjs");
writeFileSync(fakePnpm, `
const fs = require('node:fs');
fs.appendFileSync(process.env.BUILD_TEST_LOG, JSON.stringify({args: process.argv.slice(2), base: process.env.BASE_PATH, cwd: process.cwd()})+'\\n');
if (process.env.BUILD_TEST_FAIL === process.argv[3]) process.exit(47);
`);
const root = path.resolve(import.meta.dirname, "../../..");
const script = path.join(root, "artifacts/api-server/scripts/build-web.mjs");
afterAll(() => rmSync(fixture, { recursive: true, force: true }));

function run(name: string, extra: Record<string, string> = {}) {
  const log = path.join(fixture, `${name}.jsonl`);
  // pnpm on Windows can export NPM_EXECPATH. Do not pass a second differently
  // cased key: Windows may select the inherited real tool over the fake one.
  const env = Object.fromEntries(
    ["SystemRoot", "WINDIR", "PATH", "TEMP", "TMP", "USERPROFILE"]
      .filter(key => process.env[key])
      .map(key => [key, process.env[key]]),
  );
  const child = spawnSync(process.execPath, [script], {
    cwd: path.dirname(script),
    env: { ...env, npm_execpath: fakePnpm, BUILD_TEST_LOG: log, BASE_PATH: "/", ...extra },
    encoding: "utf8",
    windowsHide: true,
  });
  if (!existsSync(log)) throw new Error(JSON.stringify({ error: child.error?.message, status: child.status, stdout: child.stdout, stderr: child.stderr }));
  return { child, calls: readFileSync(log, "utf8").trim().split("\n").map(line => JSON.parse(line)) };
}

describe("single-API release build", () => {
  it("actually invokes all web builds with isolated bases despite inherited BASE_PATH=/", () => {
    const { child, calls } = run("root-base");
    expect(child.status, child.stderr).toBe(0);
    expect(calls.map(call => [call.args, call.base])).toEqual([
      [["--filter", "@workspace/shotgun-ninja-village", "--fail-if-no-match", "run", "build"], "/"],
      [["--filter", "@workspace/shotgun-ninjas-ep1", "--fail-if-no-match", "run", "build"], "/shotgun-ninjas-ep1/"],
      [["--filter", "@workspace/shotgun-ninjas-ep2", "--fail-if-no-match", "run", "build"], "/shotgun-ninjas-ep2/"],
      [["--filter", "@workspace/shotgun-ninjas-ep3", "--fail-if-no-match", "run", "build"], "/shotgun-ninjas-ep3/"],
    ]);
    expect(calls.every(call => call.cwd === root)).toBe(true);
  });
  it("does not let an inherited custom API base corrupt the fixed release mounts", () => {
    const { child, calls } = run("custom-base", { BASE_PATH: "/inherited/" });
    expect(child.status, child.stderr).toBe(0);
    expect(calls.map(call => call.base)).toEqual(["/", "/shotgun-ninjas-ep1/", "/shotgun-ninjas-ep2/", "/shotgun-ninjas-ep3/"]);
  });
  it("stops the release immediately when an episode build fails", () => {
    const { child, calls } = run("failure", { BUILD_TEST_FAIL: "@workspace/shotgun-ninjas-ep2" });
    expect(child.status).toBe(47);
    expect(calls).toHaveLength(3);
    expect(calls.at(-1).args[1]).toBe("@workspace/shotgun-ninjas-ep2");
  });
});
