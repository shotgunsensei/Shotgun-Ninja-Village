import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const villageUsersTable = pgTable(
  "village_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 320 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    displayName: varchar("display_name", { length: 80 }).notNull(),
    callsign: varchar("callsign", { length: 24 }).notNull(),
    bio: varchar("bio", { length: 400 }).notNull().default(""),
    avatarColor: varchar("avatar_color", { length: 24 })
      .notNull()
      .default("crimson"),
    role: varchar("role", { length: 24 }).notNull().default("member"),
    tier: varchar("tier", { length: 24 }).notNull().default("free"),
    status: varchar("status", { length: 24 }).notNull().default("active"),
    newsletterOptIn: boolean("newsletter_opt_in").notNull().default(false),
    archetype: varchar("archetype", { length: 24 }),
    watchedTransmissions: text("watched_transmissions")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    termsAcceptedAt: timestamp("terms_accepted_at", {
      withTimezone: true,
    }).notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("village_users_email_unique").on(table.email),
    uniqueIndex("village_users_callsign_unique").on(table.callsign),
    index("village_users_last_seen_idx").on(table.lastSeenAt),
  ],
);

export const villageSessionsTable = pgTable(
  "village_sessions",
  {
    tokenHash: varchar("token_hash", { length: 64 }).primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => villageUsersTable.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("village_sessions_user_idx").on(table.userId),
    index("village_sessions_expiry_idx").on(table.expiresAt),
  ],
);

export const forumTopicsTable = pgTable(
  "village_forum_topics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categorySlug: varchar("category_slug", { length: 64 }).notNull(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => villageUsersTable.id, { onDelete: "restrict" }),
    title: varchar("title", { length: 140 }).notNull(),
    excerpt: varchar("excerpt", { length: 240 }).notNull(),
    viewCount: integer("view_count").notNull().default(0),
    pinned: boolean("pinned").notNull().default(false),
    locked: boolean("locked").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastPostedAt: timestamp("last_posted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("village_topics_category_idx").on(table.categorySlug),
    index("village_topics_last_posted_idx").on(table.lastPostedAt),
    index("village_topics_author_idx").on(table.authorId),
  ],
);

export const forumPostsTable = pgTable(
  "village_forum_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    topicId: uuid("topic_id")
      .notNull()
      .references(() => forumTopicsTable.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => villageUsersTable.id, { onDelete: "restrict" }),
    body: text("body").notNull(),
    isOriginal: boolean("is_original").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("village_posts_topic_idx").on(table.topicId),
    index("village_posts_author_idx").on(table.authorId),
    index("village_posts_created_idx").on(table.createdAt),
  ],
);

export type VillageUser = typeof villageUsersTable.$inferSelect;
export type VillageSession = typeof villageSessionsTable.$inferSelect;
export type ForumTopic = typeof forumTopicsTable.$inferSelect;
export type ForumPost = typeof forumPostsTable.$inferSelect;
