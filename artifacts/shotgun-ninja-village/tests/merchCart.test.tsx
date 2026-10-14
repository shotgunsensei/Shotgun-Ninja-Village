import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { products } from "@/data/products";
import { storeConfig } from "@/config/integrations";
import Merch from "@/pages/Merch";

vi.mock("@/services/store", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services/store")>();
  const { products } = await import("@/data/products");
  const product = {
    ...products[0],
    id: "gid://shopify/Product/1",
    variants: products[0].variants.map((v, i) => ({
      ...v,
      id: `gid://shopify/ProductVariant/${101 + i}`,
    })),
  };
  return {
    ...actual,
    getProducts: vi.fn(async () => [product]),
    getCollections: vi.fn(async () => []),
  };
});
const original = {
  mode: storeConfig.mode,
  shopify: { ...storeConfig.shopify },
};
afterEach(() => {
  cleanup();
  storeConfig.mode = original.mode;
  Object.assign(storeConfig.shopify, original.shopify);
});
describe("live cart UI regression with isolated fixtures", () => {
  it("adds the selected variant, updates quantity, removes items and carries the correct checkout URL", async () => {
    storeConfig.mode = "live";
    Object.assign(storeConfig.shopify, {
      domain: "village-test.myshopify.com",
      storefrontToken: "test-fixture",
      checkoutBaseUrl: "",
    });
    render(<Merch />);
    const product = await screen.findByRole("button", {
      name: "View Signal Hunter Tee",
    });
    product.focus();
    fireEvent.click(product);
    fireEvent.click(screen.getByRole("button", { name: "size: M" }));
    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));
    await screen.findByRole("heading", { name: "Your cart" });
    expect(
      screen
        .getByRole("link", { name: /Continue to checkout/ })
        .getAttribute("href"),
    ).toBe("https://village-test.myshopify.com/cart/102:1");
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "3" },
    });
    expect(
      screen
        .getByRole("link", { name: /Continue to checkout/ })
        .getAttribute("href"),
    ).toBe("https://village-test.myshopify.com/cart/102:3");
    fireEvent.click(
      screen.getByRole("button", { name: "Remove Signal Hunter Tee" }),
    );
    expect(
      screen.queryByRole("link", { name: /Continue to checkout/ }),
    ).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Close cart" }));
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Cart (0)" }),
      ),
    );
  });
});
