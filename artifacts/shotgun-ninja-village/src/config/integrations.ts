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
    embedEnabled: (import.meta.env.VITE_DISCOURSE_EMBED as string) === "true",
  },
  sso: {
    enabled: (import.meta.env.VITE_DISCOURSE_SSO as string) === "true",
    loginUrl: import.meta.env.VITE_DISCOURSE_SSO_LOGIN_URL as string || "",
    logoutUrl: import.meta.env.VITE_DISCOURSE_SSO_LOGOUT_URL as string || "",
    callbackPath: "/auth/discourse/callback",
  },
  signup: {
    url: import.meta.env.VITE_DISCOURSE_SIGNUP_URL as string || "",
    fallbackUrl: "https://shotgunninjas.com/join",
  },
  groups: {
    supporter: "ronin-supporters",
    founder: "founding-ninjas",
  },
  gatedCategories: ["ronin-lounge", "founders-chamber"] as string[],
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

export function isSsoEnabled(): boolean {
  return communityConfig.sso.enabled && !!communityConfig.sso.loginUrl;
}

export function isEmbedEnabled(): boolean {
  return isLiveCommunity() && communityConfig.discourse.embedEnabled;
}
