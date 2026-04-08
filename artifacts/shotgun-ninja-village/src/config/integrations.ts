export const storeConfig = {
  provider: "shopify" as const,
  mode: (import.meta.env.VITE_STORE_MODE as string) || "mock",
  shopify: {
    domain: import.meta.env.VITE_SHOPIFY_DOMAIN as string || "",
    storefrontToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string || "",
    checkoutBaseUrl: import.meta.env.VITE_SHOPIFY_CHECKOUT_URL as string || "",
  },
};

export const communityConfig = {
  provider: "discourse" as const,
  mode: (import.meta.env.VITE_COMMUNITY_MODE as string) || "mock",
  discourse: {
    url: import.meta.env.VITE_DISCOURSE_URL as string || "",
    apiKey: import.meta.env.VITE_DISCOURSE_API_KEY as string || "",
  },
  recommendedSubdomain: "community.shotgunninjavillage.com",
};

export const accountConfig = {
  mode: (import.meta.env.VITE_AUTH_MODE as string) || "disabled",
  ssoProvider: "discourse" as const,
};

export function isLiveStore(): boolean {
  return storeConfig.mode === "live" && !!storeConfig.shopify.domain;
}

export function isLiveCommunity(): boolean {
  return communityConfig.mode === "live" && !!communityConfig.discourse.url;
}
