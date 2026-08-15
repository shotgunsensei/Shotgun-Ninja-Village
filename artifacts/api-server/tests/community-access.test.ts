import { describe, expect, it } from "vitest";
import type { SessionUser } from "../src/auth/session";
import {
  canAccessCategory,
  canCreateTopic,
  getCategory,
} from "../src/community/catalog";

function user(overrides: Partial<SessionUser> = {}): SessionUser {
  return {
    id: "00000000-0000-4000-8000-000000000001",
    email: "operator@example.com",
    passwordHash: "unused",
    displayName: "Test Operator",
    callsign: "test_operator",
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

describe("Village channel access", () => {
  it("keeps every public board visitor-readable", () => {
    expect(canAccessCategory(getCategory("village-gate")!, null)).toBe(true);
    expect(canAccessCategory(getCategory("support-suggestions")!, null)).toBe(
      true,
    );
  });

  it("does not expose paid rooms to visitors or free accounts", () => {
    const lounge = getCategory("ronin-lounge")!;
    const chamber = getCategory("founders-chamber")!;
    expect(canAccessCategory(lounge, null)).toBe(false);
    expect(canAccessCategory(lounge, user())).toBe(false);
    expect(canAccessCategory(chamber, user({ tier: "supporter" }))).toBe(false);
  });

  it("grants tier and moderator access without letting members publish official announcements", () => {
    expect(
      canAccessCategory(
        getCategory("ronin-lounge")!,
        user({ tier: "supporter" }),
      ),
    ).toBe(true);
    expect(
      canAccessCategory(
        getCategory("founders-chamber")!,
        user({ tier: "founder" }),
      ),
    ).toBe(true);
    expect(
      canAccessCategory(
        getCategory("founders-chamber")!,
        user({ role: "moderator" }),
      ),
    ).toBe(true);
    expect(canCreateTopic(getCategory("dojo-announcements")!, user())).toBe(
      false,
    );
    expect(
      canCreateTopic(
        getCategory("dojo-announcements")!,
        user({ role: "admin" }),
      ),
    ).toBe(true);
  });
});
