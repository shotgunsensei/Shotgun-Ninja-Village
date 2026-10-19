import { spawnSync } from "node:child_process";
import path from "node:path";

// Invoke through pnpm so the already selected package-manager version is reused.
// Never inherit the API artifact's BASE_PATH (often "/") for an episode build.
const pnpm = process.env.npm_execpath;
if (!pnpm) throw new Error("Run the API release build through pnpm");
const root = path.resolve(import.meta.dirname, "../../..");
for (const [name, base] of [
  ["shotgun-ninja-village", "/"],
  ["shotgun-ninjas-ep1", "/shotgun-ninjas-ep1/"],
  ["shotgun-ninjas-ep2", "/shotgun-ninjas-ep2/"],
  ["shotgun-ninjas-ep3", "/shotgun-ninjas-ep3/"],
]) {
  const result = spawnSync(
    process.execPath,
    [pnpm, "--filter", `@workspace/${name}`, "--fail-if-no-match", "run", "build"],
    {
      cwd: root,
      env: { ...process.env, BASE_PATH: base },
      stdio: "inherit",
      windowsHide: true,
    },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
