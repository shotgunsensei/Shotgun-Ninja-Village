import { Router, type IRouter } from "express";
import { and, eq, ne, or } from "drizzle-orm";
import {
  db,
  signupsTable,
  villageUsersTable,
  type VillageUser,
} from "@workspace/db";
import {
  LoginBody,
  RegisterBody,
  UpdateProfileBody,
  UpdateProgressBody,
} from "@workspace/api-zod";
import { hashPassword, verifyPassword } from "../auth/password";
import {
  createSession,
  currentUser,
  destroySession,
  requireAuth,
  setSessionCookie,
} from "../auth/session";
import { presentUser } from "../community/presenters";
import { createRateLimit } from "../lib/rate-limit";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const authLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  namespace: "auth",
});

function validationMessage(error: {
  issues: Array<{ message: string }>;
}): string {
  return error.issues[0]?.message ?? "Invalid request";
}

router.post("/auth/register", authLimit, async (req, res) => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: validationMessage(parsed.error) });

  const email = parsed.data.email.trim().toLowerCase();
  const callsign = parsed.data.callsign.trim().toLowerCase();

  try {
    const [existing] = await db
      .select({
        email: villageUsersTable.email,
        callsign: villageUsersTable.callsign,
      })
      .from(villageUsersTable)
      .where(
        or(
          eq(villageUsersTable.email, email),
          eq(villageUsersTable.callsign, callsign),
        ),
      )
      .limit(1);

    if (existing) {
      const field = existing.email === email ? "email" : "callsign";
      return res
        .status(409)
        .json({ field, message: `That ${field} is already in use` });
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const watchedTransmissions = [...new Set(parsed.data.watchedTransmissions)];
    const [user] = await db
      .insert(villageUsersTable)
      .values({
        email,
        callsign,
        displayName: parsed.data.displayName.trim(),
        passwordHash,
        newsletterOptIn: parsed.data.newsletterOptIn,
        archetype: parsed.data.archetype ?? null,
        watchedTransmissions,
        termsAcceptedAt: new Date(),
      })
      .returning();

    if (!user) throw new Error("User insert did not return a record");

    if (user.newsletterOptIn) {
      await db
        .insert(signupsTable)
        .values({ email: user.email, source: "village-account" })
        .onConflictDoNothing({ target: signupsTable.email });
    }

    const token = await createSession(user.id);
    setSessionCookie(res, token);
    return res.status(201).json({ user: await presentUser(user, true) });
  } catch (error) {
    if ((error as { code?: string }).code === "23505") {
      return res
        .status(409)
        .json({ message: "That email or callsign is already in use" });
    }
    logger.error({ err: error }, "Failed to register Village account");
    return res
      .status(500)
      .json({ message: "Account could not be created. Try again shortly." });
  }
});

router.post("/auth/login", authLimit, async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: validationMessage(parsed.error) });

  try {
    const [user] = await db
      .select()
      .from(villageUsersTable)
      .where(
        eq(villageUsersTable.email, parsed.data.email.trim().toLowerCase()),
      )
      .limit(1);
    const valid = user
      ? await verifyPassword(parsed.data.password, user.passwordHash)
      : await hashPassword(parsed.data.password).then(() => false);

    if (!user || !valid || user.status !== "active") {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    const token = await createSession(user.id);
    setSessionCookie(res, token);
    await db
      .update(villageUsersTable)
      .set({ lastSeenAt: new Date() })
      .where(eq(villageUsersTable.id, user.id));
    return res.json({ user: await presentUser(user, true) });
  } catch (error) {
    logger.error({ err: error }, "Failed to sign into Village account");
    return res
      .status(500)
      .json({ message: "Sign in is temporarily unavailable" });
  }
});

router.post("/auth/logout", async (req, res) => {
  try {
    await destroySession(req, res);
    return res.status(204).send();
  } catch (error) {
    logger.error({ err: error }, "Failed to destroy Village session");
    return res.status(500).json({ message: "Could not sign out cleanly" });
  }
});

router.get("/auth/me", requireAuth, async (_req, res) => {
  const user = currentUser(res)!;
  return res.json({ user: await presentUser(user, true) });
});

router.patch("/auth/me", requireAuth, async (req, res) => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: validationMessage(parsed.error) });
  const user = currentUser(res)!;
  const changes: Partial<typeof villageUsersTable.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (parsed.data.displayName !== undefined)
    changes.displayName = parsed.data.displayName.trim();
  if (parsed.data.bio !== undefined) changes.bio = parsed.data.bio.trim();
  if (parsed.data.avatarColor !== undefined)
    changes.avatarColor = parsed.data.avatarColor;
  if (parsed.data.newsletterOptIn !== undefined)
    changes.newsletterOptIn = parsed.data.newsletterOptIn;
  if (parsed.data.callsign !== undefined) {
    const callsign = parsed.data.callsign.trim().toLowerCase();
    const [existing] = await db
      .select({ id: villageUsersTable.id })
      .from(villageUsersTable)
      .where(
        and(
          eq(villageUsersTable.callsign, callsign),
          ne(villageUsersTable.id, user.id),
        ),
      )
      .limit(1);
    if (existing)
      return res
        .status(409)
        .json({
          field: "callsign",
          message: "That callsign is already in use",
        });
    changes.callsign = callsign;
  }

  try {
    const [updated] = await db
      .update(villageUsersTable)
      .set(changes)
      .where(eq(villageUsersTable.id, user.id))
      .returning();
    if (!updated) return res.status(404).json({ message: "Account not found" });

    if (parsed.data.newsletterOptIn === true) {
      await db
        .insert(signupsTable)
        .values({ email: updated.email, source: "village-account" })
        .onConflictDoNothing({ target: signupsTable.email });
    } else if (parsed.data.newsletterOptIn === false) {
      await db
        .delete(signupsTable)
        .where(eq(signupsTable.email, updated.email));
    }
    return res.json({ user: await presentUser(updated, true) });
  } catch (error) {
    if ((error as { code?: string }).code === "23505") {
      return res
        .status(409)
        .json({ message: "That callsign is already in use" });
    }
    logger.error({ err: error }, "Failed to update Village account");
    return res.status(500).json({ message: "Profile could not be updated" });
  }
});

router.patch("/auth/progress", requireAuth, async (req, res) => {
  const parsed = UpdateProgressBody.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: validationMessage(parsed.error) });
  const user = currentUser(res)!;
  const changes: Partial<typeof villageUsersTable.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (parsed.data.archetype !== undefined)
    changes.archetype = parsed.data.archetype;
  if (parsed.data.watchedTransmissions !== undefined) {
    changes.watchedTransmissions = [
      ...new Set([
        ...user.watchedTransmissions,
        ...parsed.data.watchedTransmissions,
      ]),
    ];
  }

  try {
    const [updated] = await db
      .update(villageUsersTable)
      .set(changes)
      .where(eq(villageUsersTable.id, user.id))
      .returning();
    return res.json({ user: await presentUser(updated!, true) });
  } catch (error) {
    logger.error({ err: error }, "Failed to sync Village progress");
    return res.status(500).json({ message: "Progress could not be synced" });
  }
});

export default router;
