import { eq } from "drizzle-orm";
import { db, pool, villageUsersTable } from "@workspace/db";

const args = new Map(
  process.argv
    .slice(2)
    .map((value, index, all) =>
      value.startsWith("--") ? [value.slice(2), all[index + 1]] : null,
    )
    .filter((value): value is [string, string] => Boolean(value?.[1])),
);

const callsign = args.get("callsign")?.trim().toLowerCase();
const role = args.get("role")?.trim().toLowerCase();
const tier = args.get("tier")?.trim().toLowerCase();
const roles = new Set(["member", "moderator", "admin"]);
const tiers = new Set(["free", "supporter", "founder"]);

if (!callsign || (!role && !tier)) {
  throw new Error(
    "Usage: pnpm --filter @workspace/api-server operator:access -- --callsign <callsign> [--role member|moderator|admin] [--tier free|supporter|founder]",
  );
}
if (role && !roles.has(role)) throw new Error(`Invalid role: ${role}`);
if (tier && !tiers.has(tier)) throw new Error(`Invalid tier: ${tier}`);

const [updated] = await db
  .update(villageUsersTable)
  .set({
    ...(role ? { role } : {}),
    ...(tier ? { tier } : {}),
    updatedAt: new Date(),
  })
  .where(eq(villageUsersTable.callsign, callsign))
  .returning({
    callsign: villageUsersTable.callsign,
    role: villageUsersTable.role,
    tier: villageUsersTable.tier,
  });

if (!updated) throw new Error(`No operator found for callsign: ${callsign}`);
console.log(
  `Updated @${updated.callsign}: role=${updated.role}, tier=${updated.tier}`,
);
await pool.end();
