import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Mock the database layer so tests run without a live Postgres connection.
const insertChain = {
  values: vi.fn(),
  onConflictDoNothing: vi.fn(),
  returning: vi.fn(),
};
insertChain.values.mockReturnValue(insertChain);
insertChain.onConflictDoNothing.mockReturnValue(insertChain);

const selectChain = {
  from: vi.fn(),
};

vi.mock("@workspace/db", () => ({
  db: {
    insert: vi.fn(() => insertChain),
    select: vi.fn(() => selectChain),
  },
  signupsTable: { id: "id", email: "email", source: "source" },
}));

import { db } from "@workspace/db";
import app from "../src/app";

beforeEach(() => {
  vi.clearAllMocks();
  insertChain.values.mockReturnValue(insertChain);
  insertChain.onConflictDoNothing.mockReturnValue(insertChain);
});

describe("POST /api/signups", () => {
  it("creates a new signup and returns 201", async () => {
    insertChain.returning.mockResolvedValue([{ id: 1 }]);

    const res = await request(app)
      .post("/api/signups")
      .send({ email: "ninja@example.com", source: "village-home" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true, alreadySubscribed: false });
    expect(insertChain.values).toHaveBeenCalledWith({
      email: "ninja@example.com",
      source: "village-home",
    });
  });

  it("normalizes email casing before storing", async () => {
    insertChain.returning.mockResolvedValue([{ id: 2 }]);

    const res = await request(app)
      .post("/api/signups")
      .send({ email: "Ninja@Example.COM" });

    expect(res.status).toBe(201);
    expect(insertChain.values).toHaveBeenCalledWith({
      email: "ninja@example.com",
      source: null,
    });
  });

  it("returns 200 with alreadySubscribed for a duplicate email", async () => {
    // onConflictDoNothing → no rows returned means the email already existed
    insertChain.returning.mockResolvedValue([]);

    const res = await request(app)
      .post("/api/signups")
      .send({ email: "ninja@example.com" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, alreadySubscribed: true });
  });

  it("rejects an invalid email with 400 and does not touch the database", async () => {
    const res = await request(app)
      .post("/api/signups")
      .send({ email: "not-an-email" });

    expect(res.status).toBe(400);
    expect(typeof res.body.message).toBe("string");
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("rejects a missing email with 400", async () => {
    const res = await request(app).post("/api/signups").send({});
    expect(res.status).toBe(400);
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("returns 500 when the database insert fails", async () => {
    insertChain.returning.mockRejectedValue(new Error("db down"));

    const res = await request(app)
      .post("/api/signups")
      .send({ email: "ninja@example.com" });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Failed to store signup" });
  });
});

describe("GET /api/signups/count", () => {
  it("returns the current signup count", async () => {
    selectChain.from.mockResolvedValue([{ count: 42 }]);

    const res = await request(app).get("/api/signups/count");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ count: 42 });
  });

  it("returns 0 when the table is empty and no row comes back", async () => {
    selectChain.from.mockResolvedValue([]);

    const res = await request(app).get("/api/signups/count");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ count: 0 });
  });

  it("returns 500 when the database query fails", async () => {
    selectChain.from.mockRejectedValue(new Error("db down"));

    const res = await request(app).get("/api/signups/count");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Failed to count signups" });
  });
});
