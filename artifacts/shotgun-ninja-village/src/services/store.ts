import { products as mockProducts, collections as mockCollections, type Product, type Collection } from "@/data/products";
import { storeConfig, isLiveStore } from "@/config/integrations";

export async function getProducts(collectionHandle?: string): Promise<Product[]> {
  if (isLiveStore()) {
    return fetchShopifyProducts(collectionHandle);
  }
  if (collectionHandle) {
    return mockProducts.filter((p) => p.collections.includes(collectionHandle));
  }
  return mockProducts;
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (isLiveStore()) {
    return fetchShopifyProduct(handle);
  }
  return mockProducts.find((p) => p.handle === handle) || null;
}

export async function getCollections(): Promise<Collection[]> {
  if (isLiveStore()) {
    return fetchShopifyCollections();
  }
  return mockCollections;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (isLiveStore()) {
    return fetchShopifyProducts().then((ps) => ps.filter((p) => p.featured));
  }
  return mockProducts.filter((p) => p.featured);
}

export function getCheckoutUrl(variantId: string, quantity = 1): string {
  if (isLiveStore() && storeConfig.shopify.checkoutBaseUrl) {
    return `${storeConfig.shopify.checkoutBaseUrl}/cart/${variantId}:${quantity}`;
  }
  return "#store-coming-soon";
}

export function formatPrice(cents: number): string {
  return `$${cents.toFixed(2)}`;
}

async function fetchShopifyProducts(_collectionHandle?: string): Promise<Product[]> {
  return mockProducts;
}

async function fetchShopifyProduct(_handle: string): Promise<Product | null> {
  return mockProducts.find((p) => p.handle === _handle) || null;
}

async function fetchShopifyCollections(): Promise<Collection[]> {
  return mockCollections;
}
