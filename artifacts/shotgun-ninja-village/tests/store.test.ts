import { describe, it, expect } from "vitest";
import { formatPrice, getProducts, getCheckoutUrl, getProductUrl, isLive } from "@/services/store";

describe("formatPrice", () => {
  it("formats whole numbers with two decimals and dollar sign", () => {
    expect(formatPrice(0)).toBe("$0.00");
    expect(formatPrice(5)).toBe("$5.00");
    expect(formatPrice(42)).toBe("$42.00");
  });

  it("rounds to two decimal places", () => {
    expect(formatPrice(9.999)).toBe("$10.00");
    expect(formatPrice(1.234)).toBe("$1.23");
    expect(formatPrice(1.235)).toBe("$1.24");
  });

  it("handles large numbers", () => {
    expect(formatPrice(1234.5)).toBe("$1234.50");
  });
});

describe("isLive (mock mode)", () => {
  it("returns false when in mock mode", () => {
    expect(isLive()).toBe(false);
  });
});

describe("getCheckoutUrl / getProductUrl in mock mode", () => {
  it("returns the coming-soon anchor when not live", () => {
    expect(getCheckoutUrl("variant-1")).toBe("#store-coming-soon");
    expect(getProductUrl("some-handle")).toBe("#store-coming-soon");
  });
});

describe("getProducts (mock data)", () => {
  it("returns the full mock product list", async () => {
    const all = await getProducts();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
    for (const p of all) {
      expect(typeof p.handle).toBe("string");
      expect(typeof p.title).toBe("string");
      expect(Array.isArray(p.variants)).toBe(true);
    }
  });

  it("filters by collection handle", async () => {
    const all = await getProducts();
    const someCollection = all.find((p) => p.collections.length > 0)?.collections[0];
    expect(someCollection).toBeDefined();
    const filtered = await getProducts(someCollection!);
    expect(filtered.length).toBeGreaterThan(0);
    for (const p of filtered) {
      expect(p.collections).toContain(someCollection);
    }
  });
});
