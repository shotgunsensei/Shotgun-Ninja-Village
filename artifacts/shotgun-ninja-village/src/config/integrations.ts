export const storeConfig = {
  provider: "shopify" as const,
  mode: (import.meta.env.VITE_STORE_MODE as string) || "mock",
  shopify: {
    domain: import.meta.env.VITE_SHOPIFY_DOMAIN as string || "",
    storefrontToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string || "",
    checkoutBaseUrl: import.meta.env.VITE_SHOPIFY_CHECKOUT_URL as string || "",
  },
};

export function isLiveStore(): boolean {
  return storeConfig.mode === "live" && !!storeConfig.shopify.domain;
}
