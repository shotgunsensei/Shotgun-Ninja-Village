import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../src/auth/password";

describe("Village password hashing", () => {
  it("stores a salted scrypt hash and verifies the original password", async () => {
    const encoded = await hashPassword("correct-horse-battery-staple");
    expect(encoded).toMatch(/^scrypt\$/);
    expect(encoded).not.toContain("correct-horse-battery-staple");
    await expect(
      verifyPassword("correct-horse-battery-staple", encoded),
    ).resolves.toBe(true);
    await expect(verifyPassword("wrong-password", encoded)).resolves.toBe(
      false,
    );
  });

  it("uses a unique salt for every account", async () => {
    const first = await hashPassword("same-password");
    const second = await hashPassword("same-password");
    expect(first).not.toBe(second);
  });

  it("fails closed for malformed stored hashes", async () => {
    await expect(
      verifyPassword("anything", "not-a-password-hash"),
    ).resolves.toBe(false);
  });
});
