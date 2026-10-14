import {
  products as mockProducts,
  collections as mockCollections,
  type Product,
  type Collection,
} from "@/data/products";
import { storeConfig, isLiveStore } from "@/config/integrations";

export async function getProducts(
  collectionHandle?: string,
): Promise<Product[]> {
  if (storeConfig.mode === "live") {
    return fetchShopifyProducts(collectionHandle);
  }
  if (collectionHandle) {
    return mockProducts.filter((p) => p.collections.includes(collectionHandle));
  }
  return mockProducts;
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (storeConfig.mode === "live") {
    return fetchShopifyProduct(handle);
  }
  return mockProducts.find((p) => p.handle === handle) || null;
}

export async function getCollections(): Promise<Collection[]> {
  if (storeConfig.mode === "live") {
    return fetchShopifyCollections();
  }
  return mockCollections;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (storeConfig.mode === "live") {
    return fetchShopifyProducts().then((ps) => ps.filter((p) => p.featured));
  }
  return mockProducts.filter((p) => p.featured);
}

export async function getLimitedDrops(): Promise<Product[]> {
  if (storeConfig.mode === "live") {
    return fetchShopifyProducts().then((ps) => ps.filter((p) => p.limitedDrop));
  }
  return mockProducts.filter((p) => p.limitedDrop);
}

export type CheckoutLine = { variantId: string; quantity: number };

function checkoutBase(): string | null {
  if (!isLiveStore()) return null;
  try {
    const configured =
      storeConfig.shopify.checkoutBaseUrl ||
      `https://${storeConfig.shopify.domain}`;
    const url = new URL(configured);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      return null;
    if (!storeConfig.shopify.checkoutBaseUrl && url.pathname !== "/")
      return null;
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function getCartCheckoutUrl(lines: CheckoutLine[]): string {
  const base = checkoutBase();
  if (!base || !lines.length) return "#store-coming-soon";
  const normalized = lines.map((line) => {
    const id = line.variantId.replace(/^gid:\/\/shopify\/ProductVariant\//, "");
    if (
      !/^\d+$/.test(id) ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > 99
    )
      return null;
    return `${id}:${line.quantity}`;
  });
  return normalized.some((line) => line === null)
    ? "#store-coming-soon"
    : `${base}/cart/${normalized.join(",")}`;
}

export function getCheckoutUrl(variantId: string, quantity = 1): string {
  return getCartCheckoutUrl([{ variantId, quantity }]);
}

export function getProductUrl(handle: string): string {
  if (!isLiveStore()) return "#store-coming-soon";
  try {
    const url = new URL(`https://${storeConfig.shopify.domain}`);
    if (
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      url.username ||
      url.password
    )
      return "#store-coming-soon";
    return `${url.origin}/products/${encodeURIComponent(handle)}`;
  } catch {
    return "#store-coming-soon";
  }
}

export function formatPrice(amount: number, currencyCode = "USD"): string {
  return currencyCode === "USD"
    ? `$${amount.toFixed(2)}`
    : new Intl.NumberFormat("en", {
        style: "currency",
        currency: currencyCode,
      }).format(amount);
}

export function isLive(): boolean {
  return isLiveStore();
}

interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}
interface ShopifySelectedOption {
  name: string;
  value: string;
}
interface ShopifyImageNode {
  url: string;
  altText?: string | null;
}
interface ShopifyVariantNode {
  id: string;
  title: string;
  sku?: string | null;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney | null;
  availableForSale?: boolean;
  selectedOptions?: ShopifySelectedOption[];
}
interface ShopifyCollectionRef {
  handle: string;
}
interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  description?: string;
  tags?: string[];
  images?: { edges: { node: ShopifyImageNode }[] };
  variants?: { edges: { node: ShopifyVariantNode }[] };
  collections?: { edges: { node: ShopifyCollectionRef }[] };
}
interface ShopifyCollectionNode {
  id: string;
  handle: string;
  title: string;
  description?: string;
  productsCount?: { count: number };
}
interface StorefrontResponse<T> {
  data?: T;
  errors?: unknown;
}

function storefrontFetch<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<StorefrontResponse<T>> {
  const { domain, storefrontToken, apiVersion } = storeConfig.shopify;
  if (!isLiveStore())
    return Promise.reject(new Error("The live catalog is not configured."));
  try {
    const url = new URL(`https://${domain}`);
    if (
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      url.username ||
      url.password
    )
      throw new Error("Invalid store domain.");
    if (!/^\d{4}-(01|04|07|10)$/.test(apiVersion))
      throw new Error("Invalid Storefront API version.");
    return fetch(`${url.origin}/api/${apiVersion}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontToken,
      },
      body: JSON.stringify({ query, variables }),
    }).then(async (response) => {
      if (!response.ok) throw new Error("The store catalog request failed.");
      const result = (await response.json()) as StorefrontResponse<T>;
      if (result.errors || !result.data)
        throw new Error("The store catalog is unavailable.");
      return result;
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function fetchShopifyProducts(
  collectionHandle?: string,
): Promise<Product[]> {
  try {
    const query = collectionHandle
      ? `query ($handle: String!) {
           collection(handle: $handle) {
             products(first: 50) { edges { node { ${PRODUCT_FIELDS} } } }
           }
         }`
      : `query { products(first: 50) { edges { node { ${PRODUCT_FIELDS} } } } }`;

    const variables = collectionHandle ? { handle: collectionHandle } : {};
    type ListResp = {
      products?: { edges: { node: ShopifyProductNode }[] };
      collection?: { products: { edges: { node: ShopifyProductNode }[] } };
    };
    const data = await storefrontFetch<ListResp>(query, variables);
    const edges = collectionHandle
      ? data.data?.collection?.products?.edges
      : data.data?.products?.edges;
    return (edges ?? []).map((e) => mapShopifyProduct(e.node));
  } catch (error) {
    throw error;
  }
}

async function fetchShopifyProduct(handle: string): Promise<Product | null> {
  try {
    const data = await storefrontFetch<{ product?: ShopifyProductNode | null }>(
      `query ($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`,
      { handle },
    );
    const node = data.data?.product;
    return node ? mapShopifyProduct(node) : null;
  } catch (error) {
    throw error;
  }
}

async function fetchShopifyCollections(): Promise<Collection[]> {
  try {
    const data = await storefrontFetch<{
      collections: { edges: { node: ShopifyCollectionNode }[] };
    }>(`query {
      collections(first: 20) {
        edges { node { id handle title description } }
      }
    }`);
    return (data.data?.collections?.edges ?? []).map((e) => ({
      id: e.node.id,
      handle: e.node.handle,
      title: e.node.title,
      description: e.node.description || "",
      icon: mapCollectionIcon(e.node.handle),
      productCount: e.node.productsCount?.count ?? 0,
    }));
  } catch (error) {
    throw error;
  }
}

const PRODUCT_FIELDS = `
  id handle title description
  tags
  images(first: 5) { edges { node { url altText } } }
  variants(first: 30) {
    edges {
      node {
        id title sku
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        availableForSale
        selectedOptions { name value }
      }
    }
  }
  collections(first: 10) { edges { node { handle } } }
`;

export function mapShopifyProduct(node: ShopifyProductNode): Product {
  const tags: string[] = node.tags ?? [];
  const collections = (node.collections?.edges ?? []).map((e) => e.node.handle);
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description || "",
    images: (node.images?.edges ?? []).map((e) => e.node.url),
    variants: (node.variants?.edges ?? []).map((e) => ({
      id: e.node.id,
      title: e.node.title,
      sku: e.node.sku || "",
      price: parseFloat(e.node.price?.amount ?? "0"),
      currencyCode: e.node.price?.currencyCode || "USD",
      compareAtPrice: e.node.compareAtPrice
        ? parseFloat(e.node.compareAtPrice.amount)
        : undefined,
      available: e.node.availableForSale ?? true,
      options: Object.fromEntries(
        (e.node.selectedOptions ?? []).map((o) => [
          o.name.toLowerCase(),
          o.value,
        ]),
      ),
    })),
    collections,
    tags,
    featured: tags.includes("featured"),
    limitedDrop: tags.includes("limited") || tags.includes("limited-drop"),
    badge: tags.includes("limited")
      ? "limited"
      : tags.includes("bestseller")
        ? "bestseller"
        : tags.includes("new")
          ? "new"
          : tags.includes("supporters-only")
            ? "supporters-only"
            : undefined,
    madeToOrder:
      tags.includes("made-to-order") || !tags.includes("ready-to-ship"),
  };
}

function mapCollectionIcon(handle: string): string {
  const map: Record<string, string> = {
    "core-brand": "shield",
    "kage-9": "user",
    "episode-drops": "play",
    "stickers-small-goods": "tag",
    "limited-edition": "zap",
    "founders-supporter": "award",
  };
  return map[handle] ?? "tag";
}
