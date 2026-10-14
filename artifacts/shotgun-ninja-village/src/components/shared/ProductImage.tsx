import { useState } from "react";
import type { Product } from "@/data/products";
import { brandAsset, merchDirection } from "@/data/brand";
import { storeConfig } from "@/config/integrations";

export function ProductImage({
  product,
  index = 0,
  eager = false,
}: {
  product: Product;
  index?: number;
  eager?: boolean;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const preview = storeConfig.mode !== "live";
  const actual = product.images[index];
  const concept =
    preview && merchDirection[product.handle]
      ? brandAsset(`merch/${product.handle}.webp`)
      : undefined;
  const source = actual || concept;
  return (
    <div className={`product-image ${actual ? "product-image--actual" : ""}`}>
      {source && source !== failedSource ? (
        <img
          src={source}
          alt={
            actual
              ? product.title
              : `Concept artwork for ${product.title}; final product subject to approval`
          }
          width="1024"
          height="1024"
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailedSource(source)}
        />
      ) : (
        <div className="product-image-missing">
          <img
            src={brandAsset("signal-crest.svg")}
            alt=""
            width="80"
            height="80"
          />
          <span>Product image unavailable</span>
        </div>
      )}
      {!actual && concept && (
        <span className="concept-label">Design concept</span>
      )}
    </div>
  );
}
