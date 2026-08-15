import { createHash, randomBytes } from "node:crypto";
import type { Request, RequestHandler, Response } from "express";
import { and, eq, gt, lt } from "drizzle-orm";
import {
  db,
  villageSessionsTable,
  villageUsersTable,
  type VillageUser,
} from "@workspace/db";

export const SESSION_COOKIE = "snv_session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

export type SessionUser = VillageUser;

function sessionHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function cookieOptions() {
  const secure =
    process.env.COOKIE_SECURE === "true" ||
    process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_MS,
  };
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await db
    .delete(villageSessionsTable)
    .where(lt(villageSessionsTable.expiresAt, new Date()));
  await db.insert(villageSessionsTable).values({
    tokenHash: sessionHash(token),
    userId,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
  });
  return token;
}

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(SESSION_COOKIE, token, cookieOptions());
}

export async function destroySession(
  req: Request,
  res: Response,
): Promise<void> {
  const token = req.cookies?.[SESSION_COOKIE];
  if (typeof token === "string" && token) {
    await db
      .delete(villageSessionsTable)
      .where(eq(villageSessionsTable.tokenHash, sessionHash(token)));
  }
  const { maxAge: _maxAge, ...options } = cookieOptions();
  res.clearCookie(SESSION_COOKIE, options);
}

export const loadSession: RequestHandler = async (req, res, next) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (typeof token !== "string" || !token) return next();

  try {
    const [row] = await db
      .select({ user: villageUsersTable })
      .from(villageSessionsTable)
      .innerJoin(
        villageUsersTable,
        eq(villageSessionsTable.userId, villageUsersTable.id),
      )
      .where(
        and(
          eq(villageSessionsTable.tokenHash, sessionHash(token)),
          gt(villageSessionsTable.expiresAt, new Date()),
          eq(villageUsersTable.status, "active"),
        ),
      )
      .limit(1);

    if (row?.user) {
      res.locals.villageUser = row.user satisfies SessionUser;
      if (Date.now() - row.user.lastSeenAt.getTime() > 5 * 60 * 1000) {
        await db
          .update(villageUsersTable)
          .set({ lastSeenAt: new Date() })
          .where(eq(villageUsersTable.id, row.user.id));
      }
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

export const requireAuth: RequestHandler = (_req, res, next) => {
  if (!res.locals.villageUser) {
    return res.status(401).json({ message: "Sign in to continue" });
  }
  return next();
};

export function currentUser(res: Response): SessionUser | null {
  return (res.locals.villageUser as SessionUser | undefined) ?? null;
}
