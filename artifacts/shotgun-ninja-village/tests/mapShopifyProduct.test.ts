import { describe, it, expect } from "vitest";
import { mapShopifyProduct } from "@/services/store";

function baseNode(overrides: Partial<Parameters<typeof mapShopifyProduct>[0]> = {}) {
  return {
    id: "gid://shopify/Product/1",
    handle: "test-tee",
    title: "Test Tee",
    description: "A test tee",
    tags: [],
    images: { edges: [{ node: { url: "https://cdn.example/img1.jpg", altText: "front" } }] },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/10",
            title: "Default",
            sku: "SKU-1",
            price: { amount: "29.50", currencyCode: "USD" },
            compareAtPrice: { amount: "39.00", currencyCode: "USD" },
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: "M" },
              { name: "Color", value: "Black" },
            ],
          },
        },
      ],
    },
    collections: { edges: [{ node: { handle: "core-brand" } }] },
    ...overrides,
  };
}

describe("mapShopifyProduct", () => {
  it("maps core fields", () => {
    const p = mapShopifyProduct(baseNode());
    expect(p.id).toBe("gid://shopify/Product/1");
    expect(p.handle).toBe("test-tee");
    expect(p.title).toBe("Test Tee");
    expect(p.description).toBe("A test tee");
  });

  it("maps images to a flat URL array", () => {
    const p = mapShopifyProduct(
      baseNode({
        images: {
          edges: [
            { node: { url: "https://cdn.example/a.jpg", altText: "a" } },
            { node: { url: "https://cdn.example/b.jpg", altText: null } },
          ],
        },
      }),
    );
    expect(p.images).toEqual(["https://cdn.example/a.jpg", "https://cdn.example/b.jpg"]);
  });

  it("parses variant prices, compareAtPrice, sku, availability, and lower-cased options", () => {
    const p = mapShopifyProduct(baseNode());
    expect(p.variants).toHaveLength(1);
    const v = p.variants[0];
    expect(v.id).toBe("gid://shopify/ProductVariant/10");
    expect(v.title).toBe("Default");
    expect(v.sku).toBe("SKU-1");
    expect(v.price).toBe(29.5);
    expect(v.compareAtPrice).toBe(39);
    expect(v.available).toBe(true);
    expect(v.options).toEqual({ size: "M", color: "Black" });
  });

  it("defaults missing variant fields safely", () => {
    const p = mapShopifyProduct(
      baseNode({
        variants: {
          edges: [
            {
              node: {
                id: "v2",
                title: "Bare",
                price: { amount: "0", currencyCode: "USD" },
              },
            },
          ],
        },
      }),
    );
    const v = p.variants[0];
    expect(v.sku).toBe("");
    expect(v.compareAtPrice).toBeUndefined();
    expect(v.available).toBe(true);
    expect(v.options).toEqual({});
    expect(v.price).toBe(0);
  });

  it("flags featured / limitedDrop from tags", () => {
    expect(mapShopifyProduct(baseNode({ tags: ["featured"] })).featured).toBe(true);
    expect(mapShopifyProduct(baseNode({ tags: [] })).featured).toBe(false);
    expect(mapShopifyProduct(baseNode({ tags: ["limited"] })).limitedDrop).toBe(true);
    expect(mapShopifyProduct(baseNode({ tags: ["limited-drop"] })).limitedDrop).toBe(true);
    expect(mapShopifyProduct(baseNode({ tags: [] })).limitedDrop).toBe(false);
  });

  it("derives badge with correct precedence (limited > bestseller > new > supporters-only)", () => {
    expect(mapShopifyProduct(baseNode({ tags: ["limited", "bestseller", "new"] })).badge).toBe("limited");
    expect(mapShopifyProduct(baseNode({ tags: ["bestseller", "new"] })).badge).toBe("bestseller");
    expect(mapShopifyProduct(baseNode({ tags: ["new"] })).badge).toBe("new");
    expect(mapShopifyProduct(baseNode({ tags: ["supporters-only"] })).badge).toBe("supporters-only");
    expect(mapShopifyProduct(baseNode({ tags: [] })).badge).toBeUndefined();
  });

  it("treats absence of ready-to-ship as made-to-order, but ready-to-ship overrides", () => {
    expect(mapShopifyProduct(baseNode({ tags: [] })).madeToOrder).toBe(true);
    expect(mapShopifyProduct(baseNode({ tags: ["ready-to-ship"] })).madeToOrder).toBe(false);
    expect(mapShopifyProduct(baseNode({ tags: ["made-to-order"] })).madeToOrder).toBe(true);
    expect(
      mapShopifyProduct(baseNode({ tags: ["made-to-order", "ready-to-ship"] })).madeToOrder,
    ).toBe(true);
  });

  it("flattens collections to a handle array", () => {
    const p = mapShopifyProduct(
      baseNode({
        collections: {
          edges: [{ node: { handle: "core-brand" } }, { node: { handle: "kage-9" } }],
        },
      }),
    );
    expect(p.collections).toEqual(["core-brand", "kage-9"]);
  });

  it("handles entirely missing optional sections", () => {
    const p = mapShopifyProduct({
      id: "p",
      handle: "p",
      title: "P",
    });
    expect(p.description).toBe("");
    expect(p.images).toEqual([]);
    expect(p.variants).toEqual([]);
    expect(p.collections).toEqual([]);
    expect(p.tags).toEqual([]);
    expect(p.featured).toBe(false);
    expect(p.limitedDrop).toBe(false);
    expect(p.badge).toBeUndefined();
    expect(p.madeToOrder).toBe(true);
  });
});
