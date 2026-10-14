import React from "react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { products } from "@/data/products";
import { storeConfig } from "@/config/integrations";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductModal } from "@/components/shared/ProductModal";
import Merch from "@/pages/Merch";
import {
  getCartCheckoutUrl,
  getCheckoutUrl,
  getProducts,
  getCollections,
  getProduct,
} from "@/services/store";

const original = {
  mode: storeConfig.mode,
  shopify: { ...storeConfig.shopify },
};
const live = () => {
  storeConfig.mode = "live";
  storeConfig.shopify.domain = "village-test.myshopify.com";
  storeConfig.shopify.storefrontToken = "test-fixture";
  storeConfig.shopify.checkoutBaseUrl = "";
};
const liveProduct = {
  ...products[0],
  id: "gid://shopify/Product/1",
  images: ["https://cdn.example.test/tee.jpg"],
  variants: [
    {
      id: "gid://shopify/ProductVariant/101",
      title: "S / Black",
      sku: "STORE-S-B",
      price: 34.99,
      available: true,
      options: { size: "S", color: "Black" },
    },
    {
      id: "gid://shopify/ProductVariant/102",
      title: "M / Black",
      sku: "STORE-M-B",
      price: 36.99,
      available: true,
      options: { size: "M", color: "Black" },
    },
    {
      id: "gid://shopify/ProductVariant/103",
      title: "S / Red",
      sku: "STORE-S-R",
      price: 34.99,
      available: false,
      options: { size: "S", color: "Red" },
    },
  ],
};
beforeEach(() => {
  storeConfig.mode = original.mode;
  Object.assign(storeConfig.shopify, original.shopify);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  storeConfig.mode = original.mode;
  Object.assign(storeConfig.shopify, original.shopify);
});

describe("checkout navigation", () => {
  it("never sends concept identifiers to checkout", () => {
    expect(getCheckoutUrl("v-001-s")).toBe("#store-coming-soon");
    live();
    expect(getCheckoutUrl("v-001-s")).toBe("#store-coming-soon");
  });
  it("normalizes GraphQL variant IDs and carries quantities across cart lines", () => {
    live();
    expect(
      getCartCheckoutUrl([
        { variantId: "gid://shopify/ProductVariant/101", quantity: 2 },
        { variantId: "102", quantity: 1 },
      ]),
    ).toBe("https://village-test.myshopify.com/cart/101:2,102:1");
    storeConfig.shopify.checkoutBaseUrl = "https://checkout.example.test/en/";
    expect(getCheckoutUrl("gid://shopify/ProductVariant/101")).toBe(
      "https://checkout.example.test/en/cart/101:1",
    );
  });
  it("rejects empty carts, invalid quantities and unsafe checkout bases", () => {
    live();
    expect(getCartCheckoutUrl([])).toBe("#store-coming-soon");
    for (const quantity of [0, -1, 1.5, 100, NaN])
      expect(getCheckoutUrl("101", quantity)).toBe("#store-coming-soon");
    for (const url of [
      "http://test.example",
      "javascript:alert(1)",
      "https://u:p@test.example",
      "https://test.example/?secret=x",
    ]) {
      storeConfig.shopify.checkoutBaseUrl = url;
      expect(getCheckoutUrl("101")).toBe("#store-coming-soon");
    }
  });
  it("fails live requests visibly instead of returning preview products", async () => {
    live();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(getProducts()).rejects.toThrow();
    await expect(getProduct("signal-hunter-tee")).rejects.toThrow();
    await expect(getCollections()).rejects.toThrow();
  });
  it("rejects GraphQL errors and incomplete live configuration", async () => {
    live();
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({
          ok: true,
          json: async () => ({ errors: [{ message: "invalid" }] }),
        }),
    );
    await expect(getProducts()).rejects.toThrow("unavailable");
    storeConfig.shopify.storefrontToken = "";
    await expect(getProducts()).rejects.toThrow("not configured");
  });
});

describe("product detail and image behavior", () => {
  it("uses store images and never overlays concept artwork onto a live item", () => {
    live();
    render(<ProductCard product={liveProduct} />);
    expect(
      screen.getByRole("img", { name: liveProduct.title }).getAttribute("src"),
    ).toBe(liveProduct.images[0]);
    expect(screen.queryByText("Design concept")).toBeNull();
  });
  it("labels preview artwork and disables ordering", () => {
    render(<ProductModal product={products[0]} onClose={() => {}} />);
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(
      screen
        .getByRole("button", { name: /checkout closed/i })
        .hasAttribute("disabled"),
    ).toBe(true);
    expect(screen.queryByRole("link", { name: /buy now/i })).toBeNull();
  });
  it("does not turn unverified demo descriptions into manufacturing or scarcity promises", () => {
    render(<ProductModal product={products[5]} onClose={() => {}} />);
    expect(screen.queryByText(/Will not be reprinted/)).toBeNull();
    expect(
      screen.getByText(/production details are subject to approval/),
    ).toBeTruthy();
  });
  it("links only the exact selected combination and blocks unavailable or absent variants", async () => {
    live();
    render(<ProductModal product={liveProduct} onClose={() => {}} />);
    expect(
      screen.getByRole("link", { name: /buy now/i }).getAttribute("href"),
    ).toContain("/cart/101:1");
    fireEvent.click(screen.getByRole("button", { name: "size: M" }));
    expect(
      screen.getByRole("link", { name: /buy now/i }).getAttribute("href"),
    ).toContain("/cart/102:1");
    fireEvent.click(screen.getByRole("button", { name: "color: Red" }));
    expect(screen.queryByRole("link", { name: /buy now/i })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "size: S" }));
    expect(screen.queryByRole("link", { name: /buy now/i })).toBeNull();
  });
});

describe("merch catalog", () => {
  it("derives collection counts and filters without altering product records", async () => {
    render(<Merch />);
    await waitFor(() =>
      expect(screen.getAllByRole("button", { name: /^View / })).toHaveLength(8),
    );
    const kage = screen.getByRole("button", { name: /Kage-9 Collection/ });
    expect(kage.textContent).toContain("1");
    fireEvent.click(kage);
    expect(screen.getAllByRole("button", { name: /^View / })).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: /All items/ }));
    expect(screen.getAllByRole("button", { name: /^View / })).toHaveLength(8);
    expect(products[0].variants[0].price).toBe(34.99);
  });
});
