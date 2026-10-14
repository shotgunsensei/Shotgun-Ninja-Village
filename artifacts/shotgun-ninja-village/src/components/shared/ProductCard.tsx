import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/data/products";
import { merchDirection } from "@/data/brand";
import { formatPrice } from "@/services/store";
import { ProductImage } from "./ProductImage";

export function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect?: (product: Product) => void;
}) {
  const prices = product.variants.map((v) => v.price);
  const min = prices.length ? Math.min(...prices) : undefined;
  const direction = merchDirection[product.handle];
  return (
    <button
      type="button"
      className="merch-product-card"
      onClick={() => onSelect?.(product)}
      aria-label={`View ${product.title}`}
    >
      <ProductImage product={product} />
      <div className="merch-product-copy">
        <div className="merch-product-meta">
          <span>
            {direction?.family ||
              product.collections[0]?.replace(/-/g, " ") ||
              "Ronin Supply"}
          </span>
          <span>{direction?.code || "SN"}</span>
        </div>
        <h3>{product.title}</h3>
        <div className="merch-product-bottom">
          <span>
            {min === undefined
              ? "Price unavailable"
              : `${prices.some((p) => p !== min) ? "From " : ""}${formatPrice(min, product.variants[0]?.currencyCode)}`}
          </span>
          <span>
            View item <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </div>
      </div>
    </button>
  );
}
