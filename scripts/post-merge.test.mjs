import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const hook = fileURLToPath(new URL("./post-merge.sh", import.meta.url));
const shell = process.platform === "win32"
  ? path.join(process.env.ProgramFiles ?? "C:/Program Files", "Git/bin/bash.exe")
  : "/bin/bash";

function runWithFakePnpm(installStatus = 0) {
  const directory = mkdtempSync(path.join(tmpdir(), "village-hook-test-"));
  try {
    const log = path.join(directory, "commands.log");
    const snapshot = path.join(directory, "post-merge.sh");
    // Git on Windows may check shell files out as CRLF. Test the actual
    // source commands with POSIX line endings in a disposable environment.
    writeFileSync(snapshot, readFileSync(hook, "utf8").replace(/\r\n/g, "\n"));
    writeFileSync(path.join(directory, "pnpm"), [
      "#!/bin/sh",
      'printf \'%s\\n\' "$*" >> "$HOOK_TEST_LOG"',
      'if [ "$#" -eq 2 ] && [ "$1" = install ] && [ "$2" = --frozen-lockfile ]; then',
      '  exit "$HOOK_TEST_INSTALL_STATUS"',
      "fi",
      "exit 97",
      "",
    ].join("\n"), { mode: 0o755 });
    const result = spawnSync(shell, [snapshot.replace(/\\/g, "/")], {
      cwd: directory,
      encoding: "utf8",
      timeout: 10_000,
      // No real pnpm, database URL, user shell startup file or provider
      // environment is available to the tested hook.
      env: {
        PATH: directory,
        ...(process.platform === "win32" ? { SystemRoot: process.env.SystemRoot } : {}),
        HOOK_TEST_LOG: log.replace(/\\/g, "/"),
        HOOK_TEST_INSTALL_STATUS: String(installStatus),
      },
    });
    assert.ifError(result.error);
    const calls = readFileSync(log, "utf8").trim().split("\n");
    return { status: result.status, calls, stderr: result.stderr };
  } finally {
    assert.equal(path.dirname(path.resolve(directory)), path.resolve(tmpdir()));
    rmSync(directory, { recursive: true, force: true });
  }
}

test("post-merge performs only frozen setup, with no schema command", () => {
  const result = runWithFakePnpm();
  assert.deepEqual(result.calls, ["install --frozen-lockfile"]);
  assert.equal(result.status, 0, result.stderr);
});

test("post-merge stops and reports frozen setup failure", () => {
  const result = runWithFakePnpm(37);
  assert.deepEqual(result.calls, ["install --frozen-lockfile"]);
  assert.equal(result.status, 37, result.stderr);
});
