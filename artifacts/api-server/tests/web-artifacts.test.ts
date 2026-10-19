import { afterAll, describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { mountWebArtifacts } from "../src/web-artifacts";

const artifacts = mkdtempSync(path.join(tmpdir(), "village-web-"));
function fixture(name: string, file: string, content: string) {
  const target = path.join(artifacts, name, "dist/public", file);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content);
}
fixture("shotgun-ninja-village", "index.html", "<html>Village SPA</html>");
fixture("shotgun-ninja-village", "assets/village.js", "console.log('village')");
for (let n = 1; n <= 3; n++) {
  fixture(`shotgun-ninjas-ep${n}`, "index.html", `<html>Episode ${n}</html>`);
  fixture(`shotgun-ninjas-ep${n}`, "assets/episode.js", `console.log(${n})`);
  fixture(`shotgun-ninjas-ep${n}`, "assets/episode.css", `body{opacity:${n}}`);
  fixture(`shotgun-ninjas-ep${n}`, "images/scene.svg", "<svg/>");
}
const app = express();
// Keep the same precedence as app.ts: API policy and JSON errors before web.
app.use("/api/protected", (_req, res) => res.status(401).json({ message: "Sign in to continue" }));
app.use("/api", (_req, res) => res.status(404).json({ message: "API route not found" }));
mountWebArtifacts(app, artifacts);
afterAll(() => rmSync(artifacts, { recursive: true, force: true }));

describe("API-hosted episode namespaces", () => {
  for (let n = 1; n <= 3; n++) {
    const prefix = `/shotgun-ninjas-ep${n}`;
    it(`serves episode ${n} rather than the Village SPA`, async () => {
      const response = await request(app).get(`${prefix}/`).expect(200).expect("Content-Type", /text\/html/);
      expect(response.text).toBe(`<html>Episode ${n}</html>`);
    });
    it(`canonicalizes episode ${n}'s slash and preserves its query`, async () => {
      await request(app).get(`${prefix}?preview=1`).expect(301).expect("Location", `${prefix}/?preview=1`);
    });
    for (const [file, type] of [["assets/episode.js", /javascript/], ["assets/episode.css", /text\/css/], ["images/scene.svg", /image\/svg\+xml/]] as const) {
      it(`serves episode ${n} ${file} with its real type for GET and HEAD`, async () => {
        const get = await request(app).get(`${prefix}/${file}`).expect(200).expect("Content-Type", type);
        const head = await request(app).head(`${prefix}/${file}`).expect(200).expect("Content-Type", type);
        expect(head.text).toBeUndefined();
        expect(head.headers["content-length"]).toBe(get.headers["content-length"]);
      });
    }
    for (const file of ["assets/missing.js", "images/missing.svg", "unknown/deep-route", "index.html/missing"]) {
      it(`keeps missing episode ${n} ${file} out of the Village HTML fallback`, async () => {
        const response = await request(app).get(`${prefix}/${file}`).set("Accept", "text/html").expect(404);
        expect(response.type).toBe("text/plain");
        expect(response.text).toBe("Episode asset not found");
      });
    }
    it(`does not serve the Village SPA for a write to episode ${n}`, async () => {
      await request(app).post(`${prefix}/`).expect(404).expect("Content-Type", /text\/plain/);
    });
  }
  it("keeps API JSON 404 and unauthenticated 401 responses", async () => {
    await request(app).get("/api/missing").set("Accept", "text/html").expect(404).expect("Content-Type", /application\/json/);
    await request(app).get("/api/protected").expect(401).expect({ message: "Sign in to continue" });
  });
  it("preserves ordinary Village SPA routes and static assets", async () => {
    await request(app).get("/archive").set("Accept", "text/html").expect(200, "<html>Village SPA</html>");
    await request(app).get("/assets/village.js").expect(200).expect("Content-Type", /javascript/);
  });
  it("reserves all episode namespaces when a release output is absent", async () => {
    const missing = express();
    mountWebArtifacts(missing, path.join(artifacts, "missing-release"));
    for (let n = 1; n <= 3; n++) {
      await request(missing).get(`/shotgun-ninjas-ep${n}/`).set("Accept", "text/html").expect(404, "Episode asset not found");
    }
  });
});
