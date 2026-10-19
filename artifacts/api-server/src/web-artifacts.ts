import express, { type Express } from "express";
import { existsSync } from "node:fs";
import path from "node:path";

/** Mount the API release's static outputs before the Village SPA fallback. */
export function mountWebArtifacts(app: Express, artifactsDir: string): void {
  const maxAge = process.env.NODE_ENV === "production" ? "1h" : 0;
  for (const name of [
    "shotgun-ninjas-ep1",
    "shotgun-ninjas-ep2",
    "shotgun-ninjas-ep3",
  ]) {
    const episode = express.Router();
    episode.use(
      express.static(path.join(artifactsDir, name, "dist", "public"), {
        maxAge,
      }),
    );
    // These are finite static films, not Village SPA routes. Missing builds,
    // assets and nested paths must never fall through to Village's index.
    episode.use((_req, res) => {
      res.status(404).type("text/plain").send("Episode asset not found");
    });
    app.use(`/${name}`, episode);
  }

  const villagePublicDir = path.join(
    artifactsDir,
    "shotgun-ninja-village",
    "dist",
    "public",
  );
  if (existsSync(villagePublicDir)) {
    app.use(express.static(villagePublicDir, { index: false, maxAge }));
    app.use((req, res, next) => {
      if (req.method !== "GET" || !req.accepts("html")) return next();
      return res.sendFile(path.join(villagePublicDir, "index.html"));
    });
  }
}
