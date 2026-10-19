import express from "express";
import request from "supertest";
import { PgDialect } from "drizzle-orm/pg-core";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SessionUser } from "../src/auth/session";

const database = vi.hoisted(() => ({ select: vi.fn(), update: vi.fn() }));
vi.mock("@workspace/db", async () => ({
  ...(await import("../../../lib/db/src/schema/village-community")),
  db: database,
}));

import { forumPostsTable, forumTopicsTable } from "@workspace/db";
import router from "../src/routes/community";

const authorId = "00000000-0000-4000-8000-000000000001";
const otherId = "00000000-0000-4000-8000-000000000002";
const topicId = "00000000-0000-4000-8000-000000000003";
const postId = "00000000-0000-4000-8000-000000000004";
const dialect = new PgDialect();
let now = Date.now();
let session: SessionUser | null;
let topic: Record<string, unknown> | null;
let post: Record<string, unknown> | null;
let writes: Array<{ table: unknown; values: Record<string, unknown> }>;

function user(overrides: Partial<SessionUser> = {}): SessionUser {
  return {
    id: authorId,
    email: "operator@example.test",
    passwordHash: "unused",
    displayName: "Operator",
    callsign: "operator",
    bio: "",
    avatarColor: "crimson",
    role: "member",
    tier: "free",
    status: "active",
    newsletterOptIn: false,
    archetype: null,
    watchedTransmissions: [],
    termsAcceptedAt: new Date(),
    lastSeenAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  // Exercise the real limiter while giving each isolated request a fresh window.
  vi.spyOn(Date, "now").mockReturnValue((now += 60_001));
  session = user();
  topic = {
    id: topicId,
    authorId,
    categorySlug: "village-gate",
    deletedAt: null,
  };
  post = { id: postId, topicId, authorId, isOriginal: false, deletedAt: null };
  writes = [];
  database.select.mockImplementation(() => ({
    from: (table: unknown) => ({
      where: (condition: Parameters<PgDialect["sqlToQuery"]>[0]) => ({
        limit: async () => {
          const query = dialect.sqlToQuery(condition);
          const row = table === forumTopicsTable ? topic : post;
          // A small query fixture, not a database: honor the real compiled ID
          // and soft-delete predicates so missing parent filters cannot pass.
          const activeOnly = query.sql.includes('"deleted_at" is null');
          return row &&
            row.id === query.params[0] &&
            (!activeOnly || row.deletedAt === null)
            ? [row]
            : [];
        },
      }),
    }),
  }));
  database.update.mockImplementation((table: unknown) => ({
    set: (values: Record<string, unknown>) => ({
      where: async () => {
        writes.push({ table, values });
      },
    }),
  }));
});

const operations = [
  {
    name: "topic PATCH",
    method: "patch",
    target: "topics",
    body: { title: "Updated topic title" },
    status: 200,
  },
  { name: "topic DELETE", method: "delete", target: "topics", status: 204 },
  {
    name: "post PATCH",
    method: "patch",
    target: "posts",
    body: { body: "Updated reply body" },
    status: 200,
  },
  { name: "post DELETE", method: "delete", target: "posts", status: 204 },
] as const;

async function mutate(
  operation: (typeof operations)[number],
  id?: string,
  body?: unknown,
) {
  const app = express();
  app.use(express.json());
  app.use((_req, res, next) => {
    res.locals.villageUser = session;
    next();
  });
  app.use("/api", router);
  const pending = request(app)[operation.method](
    `/api/community/${operation.target}/${id ?? (operation.target === "topics" ? topicId : postId)}`,
  );
  return pending.send(
    body ?? ("body" in operation ? operation.body : undefined),
  );
}

describe.each(operations)("$name current room access", (operation) => {
  it.each([
    ["ronin-lounge", "free"],
    ["founders-chamber", "free"],
    ["founders-chamber", "supporter"],
    ["ronin-lounge", "unknown"],
  ])(
    "denies an author without current access to %s at tier %s",
    async (categorySlug, tier) => {
      topic!.categorySlug = categorySlug;
      session = user({ tier });
      expect((await mutate(operation)).status).toBe(403);
      expect(writes).toEqual([]);
    },
  );

  it.each([
    ["village-gate", "free"],
    ["ronin-lounge", "supporter"],
    ["ronin-lounge", "founder"],
    ["founders-chamber", "founder"],
  ])("preserves author access to %s at tier %s", async (categorySlug, tier) => {
    topic!.categorySlug = categorySlug;
    session = user({ tier });
    const response = await mutate(operation);
    expect(response.status).toBe(operation.status);
    if (operation.method === "patch")
      expect(response.body).toEqual({ ok: true });
    expect(writes).toHaveLength(1);
  });

  it.each(["admin", "moderator"])(
    "preserves free-tier %s management of another paid-room author",
    async (role) => {
      topic!.categorySlug = "founders-chamber";
      session = user({ id: otherId, role });
      expect((await mutate(operation)).status).toBe(operation.status);
      expect(writes).toHaveLength(1);
    },
  );

  it("does not turn category access into ownership", async () => {
    topic!.categorySlug = "founders-chamber";
    session = user({ id: otherId, tier: "founder" });
    expect((await mutate(operation)).status).toBe(403);
    expect(writes).toEqual([]);
  });

  it("fails closed for an unknown stored category", async () => {
    topic!.categorySlug = "removed-channel";
    expect((await mutate(operation)).status).toBe(404);
    expect(writes).toEqual([]);
  });

  it("retains author management of locked topics and announcement content", async () => {
    topic!.categorySlug = "dojo-announcements";
    topic!.locked = true;
    expect((await mutate(operation)).status).toBe(operation.status);
    expect(writes).toHaveLength(1);
  });

  it("still requires authentication before reading or writing content", async () => {
    session = null;
    expect((await mutate(operation)).status).toBe(401);
    expect(database.select).not.toHaveBeenCalled();
    expect(writes).toEqual([]);
  });

  it("keeps invalid IDs at 404 without querying content", async () => {
    expect((await mutate(operation, "not-a-uuid")).status).toBe(404);
    expect(database.select).not.toHaveBeenCalled();
    expect(writes).toEqual([]);
  });

  it.each(["missing", "deleted"])("rejects a %s target", async (state) => {
    if (operation.target === "topics") {
      if (state === "missing") topic = null;
      else topic!.deletedAt = new Date();
    } else {
      if (state === "missing") post = null;
      else post!.deletedAt = new Date();
    }
    expect((await mutate(operation)).status).toBe(404);
    expect(writes).toEqual([]);
  });
});

describe.each(operations.filter((operation) => operation.target === "posts"))(
  "$name parent lifecycle",
  (operation) => {
    it.each(["missing", "deleted"])(
      "rejects a %s parent even for a moderator",
      async (state) => {
        session = user({ role: "moderator", id: otherId });
        if (state === "missing") topic = null;
        else topic!.deletedAt = new Date();
        expect((await mutate(operation)).status).toBe(404);
        expect(writes).toEqual([]);
      },
    );

    it("does not use an unrelated parent topic", async () => {
      topic!.id = otherId;
      expect((await mutate(operation)).status).toBe(404);
      expect(writes).toEqual([]);
    });
  },
);

it("denies a revoked author's opening-post edit before either content write", async () => {
  topic!.categorySlug = "ronin-lounge";
  post!.isOriginal = true;
  expect((await mutate(operations[2])).status).toBe(403);
  expect(writes).toEqual([]);
});

it("retains the accessible opening-post edit and topic excerpt update", async () => {
  post!.isOriginal = true;
  expect((await mutate(operations[2])).status).toBe(200);
  expect(writes).toEqual([
    {
      table: forumPostsTable,
      values: { body: "Updated reply body", updatedAt: expect.any(Date) },
    },
    {
      table: forumTopicsTable,
      values: { excerpt: "Updated reply body", updatedAt: expect.any(Date) },
    },
  ]);
});

it("keeps direct opening-post deletion at 400 for accessible authors", async () => {
  post!.isOriginal = true;
  const response = await mutate(operations[3]);
  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    "Remove the topic to remove its opening post",
  );
  expect(writes).toEqual([]);
});

it.each([operations[0], operations[2]])(
  "keeps malformed $name bodies at 400 before querying",
  async (operation) => {
    expect((await mutate(operation, undefined, {})).status).toBe(400);
    expect(database.select).not.toHaveBeenCalled();
    expect(writes).toEqual([]);
  },
);
