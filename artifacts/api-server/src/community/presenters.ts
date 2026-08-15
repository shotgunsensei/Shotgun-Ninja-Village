import { and, count, eq, isNull } from "drizzle-orm";
import {
  db,
  forumPostsTable,
  forumTopicsTable,
  type VillageUser,
} from "@workspace/db";

export interface BadgeView {
  id: string;
  label: string;
  description: string;
  earned: boolean;
}

export async function buildBadges(user: VillageUser): Promise<BadgeView[]> {
  const [[topics], [posts]] = await Promise.all([
    db
      .select({ count: count() })
      .from(forumTopicsTable)
      .where(
        and(
          eq(forumTopicsTable.authorId, user.id),
          isNull(forumTopicsTable.deletedAt),
        ),
      ),
    db
      .select({ count: count() })
      .from(forumPostsTable)
      .where(
        and(
          eq(forumPostsTable.authorId, user.id),
          isNull(forumPostsTable.deletedAt),
        ),
      ),
  ]);

  const topicCount = topics?.count ?? 0;
  const postCount = posts?.count ?? 0;
  return [
    {
      id: "village-initiate",
      label: "Village Initiate",
      description: "Claimed a Shotgun Ninja account",
      earned: true,
    },
    {
      id: "alignment-locked",
      label: "Alignment Locked",
      description: "Completed operator alignment",
      earned: Boolean(user.archetype),
    },
    {
      id: "archive-enlisted",
      label: "Archive Enlisted",
      description: "Subscribed to transmission alerts",
      earned: user.newsletterOptIn,
    },
    {
      id: "full-transmission",
      label: "Full Transmission",
      description: "Watched all three transmissions",
      earned: new Set(user.watchedTransmissions).size >= 3,
    },
    {
      id: "signal-starter",
      label: "Signal Starter",
      description: "Started a Village topic",
      earned: topicCount >= 1,
    },
    {
      id: "village-voice",
      label: "Village Voice",
      description: "Contributed at least five posts",
      earned: postCount >= 5,
    },
    {
      id: "ronin-supporter",
      label: "Ronin Supporter",
      description: "Supporter status granted",
      earned: user.tier === "supporter" || user.tier === "founder",
    },
    {
      id: "founding-ninja",
      label: "Founding Ninja",
      description: "Permanent founder status",
      earned: user.tier === "founder",
    },
  ];
}

export async function presentUser(user: VillageUser, includePrivate = false) {
  const badges = await buildBadges(user);
  return {
    id: user.id,
    ...(includePrivate
      ? { email: user.email, newsletterOptIn: user.newsletterOptIn }
      : {}),
    displayName: user.displayName,
    callsign: user.callsign,
    bio: user.bio,
    avatarColor: user.avatarColor,
    role: user.role,
    tier: user.tier,
    archetype: user.archetype,
    watchedTransmissions: includePrivate ? user.watchedTransmissions : [],
    createdAt: user.createdAt.toISOString(),
    badges,
  };
}
