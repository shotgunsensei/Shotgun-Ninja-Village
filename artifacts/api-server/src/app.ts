import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { existsSync } from "node:fs";
import path from "node:path";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { loadSession } from "./auth/session";

const app: Express = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

const configuredOrigins = [
  process.env.APP_ORIGIN,
  ...(process.env.COMMUNITY_ALLOWED_ORIGINS ?? "").split(","),
]
  .map((value) => value?.trim().replace(/\/$/, ""))
  .filter((value): value is string => Boolean(value));
const developmentOrigins =
  process.env.NODE_ENV === "production"
    ? []
    : [
        "http://localhost:5173",
        "http://localhost:24938",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:24938",
      ];
const allowedOrigins = new Set([...configuredOrigins, ...developmentOrigins]);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use((_, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  next();
});
app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin.replace(/\/$/, "")))
        return callback(null, true);
      return callback(null, false);
    },
  }),
);
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const origin = req.get("origin")?.replace(/\/$/, "");
  if (!origin) return next();
  const requestOrigin = `${req.protocol}://${req.get("host")}`;
  if (origin === requestOrigin || allowedOrigins.has(origin)) return next();
  return res.status(403).json({ message: "Request origin is not allowed" });
});

app.use("/api", loadSession, router);
app.use("/api", (_req, res) =>
  res.status(404).json({ message: "API route not found" }),
);

const villagePublicDir = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "shotgun-ninja-village",
  "dist",
  "public",
);
if (existsSync(villagePublicDir)) {
  app.use(
    express.static(villagePublicDir, {
      index: false,
      maxAge: process.env.NODE_ENV === "production" ? "1h" : 0,
    }),
  );
  app.use((req, res, next) => {
    if (req.method !== "GET" || !req.accepts("html")) return next();
    return res.sendFile(path.join(villagePublicDir, "index.html"));
  });
}

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    logger.error({ err: error }, "Unhandled API error");
    if (res.headersSent) return;
    res.status(500).json({ message: "An unexpected error occurred" });
  },
);

export default app;
