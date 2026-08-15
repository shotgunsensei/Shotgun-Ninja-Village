import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import {
  CreateReplyBody,
  CreateTopicBody,
  UpdatePostBody,
  UpdateTopicBody,
} from "@workspace/api-zod";
import { and, count, desc, eq, ilike, inArray, isNull, sql } from "drizzle-orm";
import {
  db,
  forumPostsTable,
  forumTopicsTable,
  villageUsersTable,
} from "@workspace/db";
import { currentUser, requireAuth } from "../auth/session";
import {
  canAccessCategory,
  canCreateTopic,
  communityCategories,
  getCategory,
} from "../community/catalog";
import { presentUser } from "../community/presenters";
import { createRateLimit } from "../lib/rate-limit";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const postLimit = createRateLimit({
  windowMs: 60 * 1000,
  max: 20,
  namespace: "community-write",
});
const uuidSchema = z.string().uuid();
const pageSchema = z.coerce.number().int().min(1).max(10_000).default(1);
const TOPICS_PER_PAGE = 20;

function isModerator(role: string): boolean {
  return role === "admin" || role === "moderator";
}

function firstIssue(error: { issues: Array<{ message: string }> }): string {
  return error.issues[0]?.message ?? "Invalid request";
}

function routeParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

router.get("/community/categories", async (_req, res) => {
  try {
    const user = currentUser(res);
    const [topicRows, postRows] = await Promise.all([
      db
        .select({ categorySlug: forumTopicsTable.categorySlug, count: count() })
        .from(forumTopicsTable)
        .where(isNull(forumTopicsTable.deletedAt))
        .groupBy(forumTopicsTable.categorySlug),
      db
        .select({ categorySlug: forumTopicsTable.categorySlug, count: count() })
        .from(forumPostsTable)
        .innerJoin(
          forumTopicsTable,
          eq(forumPostsTable.topicId, forumTopicsTable.id),
        )
        .where(
          and(
            isNull(forumPostsTable.deletedAt),
            isNull(forumTopicsTable.deletedAt),
          ),
        )
        .groupBy(forumTopicsTable.categorySlug),
    ]);
    const topicCounts = new Map(
      topicRows.map((row) => [row.categorySlug, row.count]),
    );
    const postCounts = new Map(
      postRows.map((row) => [row.categorySlug, row.count]),
    );
    return res.json({
      categories: communityCategories.map((category) => ({
        ...category,
        locked: Boolean(category.requiredTier),
        canAccess: canAccessCategory(category, user),
        canCreateTopic: Boolean(user && canCreateTopic(category, user)),
        topicCount: topicCounts.get(category.slug) ?? 0,
        postCount: postCounts.get(category.slug) ?? 0,
      })),
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to load community categories");
    return res
      .status(500)
      .json({ message: "Community channels are temporarily unavailable" });
  }
});

router.get("/community/stats", async (_req, res) => {
  try {
    const [[members], [topics], [posts], [online], [newest]] =
      await Promise.all([
        db
          .select({ count: count() })
          .from(villageUsersTable)
          .where(eq(villageUsersTable.status, "active")),
        db
          .select({ count: count() })
          .from(forumTopicsTable)
          .where(isNull(forumTopicsTable.deletedAt)),
        db
          .select({ count: count() })
          .from(forumPostsTable)
          .where(isNull(forumPostsTable.deletedAt)),
        db
          .select({ count: count() })
          .from(villageUsersTable)
          .where(
            sql`${villageUsersTable.lastSeenAt} > now() - interval '15 minutes'`,
          ),
        db
          .select({ callsign: villageUsersTable.callsign })
          .from(villageUsersTable)
          .where(eq(villageUsersTable.status, "active"))
          .orderBy(desc(villageUsersTable.createdAt))
          .limit(1),
      ]);
    return res.json({
      totalMembers: members?.count ?? 0,
      onlineNow: online?.count ?? 0,
      totalTopics: topics?.count ?? 0,
      totalPosts: posts?.count ?? 0,
      newestMember: newest?.callsign ?? null,
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to load community statistics");
    return res
      .status(500)
      .json({ message: "Community statistics are temporarily unavailable" });
  }
});

router.get("/community/topics", async (req, res) => {
  const user = currentUser(res);
  const accessibleSlugs = communityCategories
    .filter((category) => canAccessCategory(category, user))
    .map((category) => category.slug);
  const categorySlug =
    typeof req.query.category === "string" ? req.query.category : undefined;
  const search =
    typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : "";
  const parsedPage = pageSchema.safeParse(req.query.page ?? 1);
  if (!parsedPage.success) {
    return res.status(400).json({ message: "Page must be a positive number" });
  }
  const page = parsedPage.data;
  if (categorySlug) {
    const category = getCategory(categorySlug);
    if (!category)
      return res.status(404).json({ message: "Channel not found" });
    if (!canAccessCategory(category, user))
      return res
        .status(403)
        .json({ message: "This channel requires a higher access tier" });
  }

  try {
    const rows = await db
      .select({
        id: forumTopicsTable.id,
        categorySlug: forumTopicsTable.categorySlug,
        title: forumTopicsTable.title,
        excerpt: forumTopicsTable.excerpt,
        viewCount: forumTopicsTable.viewCount,
        pinned: forumTopicsTable.pinned,
        locked: forumTopicsTable.locked,
        createdAt: forumTopicsTable.createdAt,
        lastPostedAt: forumTopicsTable.lastPostedAt,
        authorId: villageUsersTable.id,
        author: villageUsersTable.callsign,
        authorDisplayName: villageUsersTable.displayName,
        authorTier: villageUsersTable.tier,
        authorArchetype: villageUsersTable.archetype,
        replyCount: sql<number>`greatest(count(${forumPostsTable.id})::int - 1, 0)`,
      })
      .from(forumTopicsTable)
      .innerJoin(
        villageUsersTable,
        eq(forumTopicsTable.authorId, villageUsersTable.id),
      )
      .leftJoin(
        forumPostsTable,
        and(
          eq(forumPostsTable.topicId, forumTopicsTable.id),
          isNull(forumPostsTable.deletedAt),
        ),
      )
      .where(
        and(
          isNull(forumTopicsTable.deletedAt),
          inArray(forumTopicsTable.categorySlug, accessibleSlugs),
          categorySlug
            ? eq(forumTopicsTable.categorySlug, categorySlug)
            : undefined,
          search ? ilike(forumTopicsTable.title, `%${search}%`) : undefined,
        ),
      )
      .groupBy(forumTopicsTable.id, villageUsersTable.id)
      .orderBy(
        desc(forumTopicsTable.pinned),
        desc(forumTopicsTable.lastPostedAt),
      )
      .limit(TOPICS_PER_PAGE + 1)
      .offset((page - 1) * TOPICS_PER_PAGE);

    return res.json({
      topics: rows.slice(0, TOPICS_PER_PAGE).map((row) => ({
        ...row,
        createdAt: row.createdAt.toISOString(),
        lastPostedAt: row.lastPostedAt.toISOString(),
        isMine: user?.id === row.authorId,
      })),
      page,
      hasMore: rows.length > TOPICS_PER_PAGE,
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to load community topics");
    return res
      .status(500)
      .json({ message: "Topics are temporarily unavailable" });
  }
});

router.get("/community/topics/:id", async (req, res) => {
  const topicId = routeParam(req.params.id);
  if (!uuidSchema.safeParse(topicId).success)
    return res.status(404).json({ message: "Topic not found" });
  const user = currentUser(res);

  try {
    const [topic] = await db
      .select({
        id: forumTopicsTable.id,
        categorySlug: forumTopicsTable.categorySlug,
        title: forumTopicsTable.title,
        excerpt: forumTopicsTable.excerpt,
        authorId: forumTopicsTable.authorId,
        viewCount: forumTopicsTable.viewCount,
        pinned: forumTopicsTable.pinned,
        locked: forumTopicsTable.locked,
        createdAt: forumTopicsTable.createdAt,
        lastPostedAt: forumTopicsTable.lastPostedAt,
        author: villageUsersTable.callsign,
        authorDisplayName: villageUsersTable.displayName,
        authorTier: villageUsersTable.tier,
        authorArchetype: villageUsersTable.archetype,
      })
      .from(forumTopicsTable)
      .innerJoin(
        villageUsersTable,
        eq(forumTopicsTable.authorId, villageUsersTable.id),
      )
      .where(
        and(
          eq(forumTopicsTable.id, topicId),
          isNull(forumTopicsTable.deletedAt),
        ),
      )
      .limit(1);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const category = getCategory(topic.categorySlug);
    if (!category)
      return res.status(404).json({ message: "Channel not found" });
    if (!canAccessCategory(category, user))
      return res
        .status(403)
        .json({ message: "This channel requires a higher access tier" });

    const posts = await db
      .select({
        id: forumPostsTable.id,
        body: forumPostsTable.body,
        isOriginal: forumPostsTable.isOriginal,
        createdAt: forumPostsTable.createdAt,
        updatedAt: forumPostsTable.updatedAt,
        authorId: villageUsersTable.id,
        author: villageUsersTable.callsign,
        authorDisplayName: villageUsersTable.displayName,
        authorTier: villageUsersTable.tier,
        authorArchetype: villageUsersTable.archetype,
        avatarColor: villageUsersTable.avatarColor,
      })
      .from(forumPostsTable)
      .innerJoin(
        villageUsersTable,
        eq(forumPostsTable.authorId, villageUsersTable.id),
      )
      .where(
        and(
          eq(forumPostsTable.topicId, topic.id),
          isNull(forumPostsTable.deletedAt),
        ),
      )
      .orderBy(forumPostsTable.createdAt);

    await db
      .update(forumTopicsTable)
      .set({ viewCount: sql`${forumTopicsTable.viewCount} + 1` })
      .where(eq(forumTopicsTable.id, topic.id));

    return res.json({
      topic: {
        ...topic,
        viewCount: topic.viewCount + 1,
        createdAt: topic.createdAt.toISOString(),
        lastPostedAt: topic.lastPostedAt.toISOString(),
        isMine: user?.id === topic.authorId,
      },
      posts: posts.map((post) => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        isMine: user?.id === post.authorId,
      })),
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to load community topic");
    return res
      .status(500)
      .json({ message: "This topic is temporarily unavailable" });
  }
});

router.post("/community/topics", requireAuth, postLimit, async (req, res) => {
  const parsed = CreateTopicBody.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: firstIssue(parsed.error) });
  const user = currentUser(res)!;
  const category = getCategory(parsed.data.categorySlug);
  if (!category) return res.status(404).json({ message: "Channel not found" });
  if (!canCreateTopic(category, user))
    return res
      .status(403)
      .json({ message: "You cannot start topics in this channel" });

  try {
    const topic = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(forumTopicsTable)
        .values({
          categorySlug: category.slug,
          authorId: user.id,
          title: parsed.data.title,
          excerpt:
            parsed.data.body.slice(0, 237) +
            (parsed.data.body.length > 237 ? "…" : ""),
        })
        .returning();
      await tx.insert(forumPostsTable).values({
        topicId: created!.id,
        authorId: user.id,
        body: parsed.data.body,
        isOriginal: true,
      });
      return created!;
    });
    return res.status(201).json({ id: topic.id });
  } catch (error) {
    logger.error({ err: error }, "Failed to create community topic");
    return res.status(500).json({ message: "Topic could not be published" });
  }
});

router.patch(
  "/community/topics/:id",
  requireAuth,
  postLimit,
  async (req, res) => {
    const topicId = routeParam(req.params.id);
    if (!uuidSchema.safeParse(topicId).success)
      return res.status(404).json({ message: "Topic not found" });
    const parsed = UpdateTopicBody.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: firstIssue(parsed.error) });
    const user = currentUser(res)!;
    const [topic] = await db
      .select()
      .from(forumTopicsTable)
      .where(
        and(
          eq(forumTopicsTable.id, topicId),
          isNull(forumTopicsTable.deletedAt),
        ),
      )
      .limit(1);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    if (topic.authorId !== user.id && !isModerator(user.role))
      return res
        .status(403)
        .json({ message: "You can only edit your own topic" });
    await db
      .update(forumTopicsTable)
      .set({ title: parsed.data.title, updatedAt: new Date() })
      .where(eq(forumTopicsTable.id, topic.id));
    return res.json({ ok: true });
  },
);

router.delete(
  "/community/topics/:id",
  requireAuth,
  postLimit,
  async (req, res) => {
    const topicId = routeParam(req.params.id);
    if (!uuidSchema.safeParse(topicId).success)
      return res.status(404).json({ message: "Topic not found" });
    const user = currentUser(res)!;
    const [topic] = await db
      .select()
      .from(forumTopicsTable)
      .where(
        and(
          eq(forumTopicsTable.id, topicId),
          isNull(forumTopicsTable.deletedAt),
        ),
      )
      .limit(1);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    if (topic.authorId !== user.id && !isModerator(user.role))
      return res
        .status(403)
        .json({ message: "You can only remove your own topic" });
    await db
      .update(forumTopicsTable)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(forumTopicsTable.id, topic.id));
    return res.status(204).send();
  },
);

router.post(
  "/community/topics/:id/replies",
  requireAuth,
  postLimit,
  async (req, res) => {
    const topicId = routeParam(req.params.id);
    if (!uuidSchema.safeParse(topicId).success)
      return res.status(404).json({ message: "Topic not found" });
    const parsed = CreateReplyBody.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: firstIssue(parsed.error) });
    const user = currentUser(res)!;
    const [topic] = await db
      .select()
      .from(forumTopicsTable)
      .where(
        and(
          eq(forumTopicsTable.id, topicId),
          isNull(forumTopicsTable.deletedAt),
        ),
      )
      .limit(1);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    const category = getCategory(topic.categorySlug);
    if (!category || !canAccessCategory(category, user))
      return res
        .status(403)
        .json({ message: "You cannot reply in this channel" });
    if (topic.locked && !isModerator(user.role))
      return res.status(403).json({ message: "This topic is locked" });

    const [post] = await db.transaction(async (tx) => {
      const created = await tx
        .insert(forumPostsTable)
        .values({
          topicId: topic.id,
          authorId: user.id,
          body: parsed.data.body,
        })
        .returning();
      await tx
        .update(forumTopicsTable)
        .set({ lastPostedAt: new Date(), updatedAt: new Date() })
        .where(eq(forumTopicsTable.id, topic.id));
      return created;
    });
    return res.status(201).json({ id: post!.id });
  },
);

router.patch(
  "/community/posts/:id",
  requireAuth,
  postLimit,
  async (req, res) => {
    const postId = routeParam(req.params.id);
    if (!uuidSchema.safeParse(postId).success)
      return res.status(404).json({ message: "Post not found" });
    const parsed = UpdatePostBody.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: firstIssue(parsed.error) });
    const user = currentUser(res)!;
    const [post] = await db
      .select()
      .from(forumPostsTable)
      .where(
        and(eq(forumPostsTable.id, postId), isNull(forumPostsTable.deletedAt)),
      )
      .limit(1);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.authorId !== user.id && !isModerator(user.role))
      return res
        .status(403)
        .json({ message: "You can only edit your own post" });
    await db
      .update(forumPostsTable)
      .set({ body: parsed.data.body, updatedAt: new Date() })
      .where(eq(forumPostsTable.id, post.id));
    if (post.isOriginal) {
      await db
        .update(forumTopicsTable)
        .set({ excerpt: parsed.data.body.slice(0, 240), updatedAt: new Date() })
        .where(eq(forumTopicsTable.id, post.topicId));
    }
    return res.json({ ok: true });
  },
);

router.delete(
  "/community/posts/:id",
  requireAuth,
  postLimit,
  async (req, res) => {
    const postId = routeParam(req.params.id);
    if (!uuidSchema.safeParse(postId).success)
      return res.status(404).json({ message: "Post not found" });
    const user = currentUser(res)!;
    const [post] = await db
      .select()
      .from(forumPostsTable)
      .where(
        and(eq(forumPostsTable.id, postId), isNull(forumPostsTable.deletedAt)),
      )
      .limit(1);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.isOriginal)
      return res
        .status(400)
        .json({ message: "Remove the topic to remove its opening post" });
    if (post.authorId !== user.id && !isModerator(user.role))
      return res
        .status(403)
        .json({ message: "You can only remove your own post" });
    await db
      .update(forumPostsTable)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(forumPostsTable.id, post.id));
    return res.status(204).send();
  },
);

router.get("/community/operators/:callsign", async (req, res) => {
  const callsign = routeParam(req.params.callsign).trim().toLowerCase();
  const [user] = await db
    .select()
    .from(villageUsersTable)
    .where(
      and(
        eq(villageUsersTable.callsign, callsign),
        eq(villageUsersTable.status, "active"),
      ),
    )
    .limit(1);
  if (!user) return res.status(404).json({ message: "Operator not found" });
  return res.json({ user: await presentUser(user, false) });
});

export default router;
