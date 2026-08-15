import type { RequestHandler } from "express";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  namespace: string;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export function createRateLimit({
  windowMs,
  max,
  namespace,
}: RateLimitOptions): RequestHandler {
  const buckets = new Map<string, Bucket>();

  return (req, res, next) => {
    const now = Date.now();
    const key = `${namespace}:${req.ip || req.socket.remoteAddress || "unknown"}`;
    const existing = buckets.get(key);
    const bucket =
      !existing || existing.resetAt <= now
        ? { count: 0, resetAt: now + windowMs }
        : existing;
    bucket.count += 1;
    buckets.set(key, bucket);

    if (buckets.size > 10_000) {
      for (const [bucketKey, value] of buckets) {
        if (value.resetAt <= now) buckets.delete(bucketKey);
      }
    }

    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader(
      "X-RateLimit-Remaining",
      String(Math.max(0, max - bucket.count)),
    );
    if (bucket.count > max) {
      res.setHeader(
        "Retry-After",
        String(Math.ceil((bucket.resetAt - now) / 1000)),
      );
      return res
        .status(429)
        .json({ message: "Too many requests. Wait a moment and try again." });
    }
    return next();
  };
}
