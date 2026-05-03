import { describe, it, expect } from "vitest";
import { ecosystem, recoveredSystems, extendedSystems } from "@/data/ecosystem";

describe("ecosystem data", () => {
  it("contains exactly 6 products", () => {
    expect(ecosystem).toHaveLength(6);
  });

  it("has exactly 2 recovered systems", () => {
    expect(recoveredSystems).toHaveLength(2);
    for (const p of recoveredSystems) {
      expect(p.tier).toBe("recovered");
    }
  });

  it("has exactly 4 extended systems", () => {
    expect(extendedSystems).toHaveLength(4);
    for (const p of extendedSystems) {
      expect(p.tier).toBe("extended");
    }
  });

  it("every product has a unique id", () => {
    const ids = ecosystem.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every product url is a well-formed https URL", () => {
    for (const p of ecosystem) {
      expect(p.url).toMatch(/^https:\/\/[^\s]+$/);
      // URL constructor throws on malformed inputs
      expect(() => new URL(p.url)).not.toThrow();
    }
  });

  it("every product has the required display fields", () => {
    for (const p of ecosystem) {
      expect(p.name.length).toBeGreaterThan(0);
      expect(p.universeRole.length).toBeGreaterThan(0);
      expect(p.realRole.length).toBeGreaterThan(0);
      expect(p.shortDesc.length).toBeGreaterThan(0);
      expect(p.longDesc.length).toBeGreaterThan(0);
      expect(p.urlLabel.length).toBeGreaterThan(0);
      expect(p.color).toMatch(/^text-/);
      expect(p.borderColor).toMatch(/^border-/);
    }
  });
});
