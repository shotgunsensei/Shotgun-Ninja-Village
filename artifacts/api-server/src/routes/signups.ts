import { Router, type IRouter } from "express";
import { CreateSignupBody, CreateSignupResponse } from "@workspace/api-zod";
import { db, signupsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.post("/signups", async (req, res) => {
  const parsed = CreateSignupBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues[0]?.message ?? "Invalid request",
    });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const source = parsed.data.source?.trim() || null;

  try {
    const result = await db
      .insert(signupsTable)
      .values({ email, source })
      .onConflictDoNothing({ target: signupsTable.email })
      .returning({ id: signupsTable.id });

    const created = result.length > 0;
    const body = CreateSignupResponse.parse({
      ok: true,
      alreadySubscribed: !created,
    });
    return res.status(created ? 201 : 200).json(body);
  } catch (err) {
    logger.error({ err }, "Failed to store signup");
    return res.status(500).json({ message: "Failed to store signup" });
  }
});

router.get("/signups/count", async (_req, res) => {
  try {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(signupsTable);
    return res.json({ count: row?.count ?? 0 });
  } catch (err) {
    logger.error({ err }, "Failed to count signups");
    return res.status(500).json({ message: "Failed to count signups" });
  }
});

export default router;
