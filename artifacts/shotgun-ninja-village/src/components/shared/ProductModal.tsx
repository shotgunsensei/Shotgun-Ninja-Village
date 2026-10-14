import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ShoppingBag, ArrowUpRight } from "lucide-react";
import type { Product, ProductVariant } from "@/data/products";
import { merchDirection } from "@/data/brand";
import { formatPrice, getCheckoutUrl, isLive } from "@/services/store";
import { ProductImage } from "./ProductImage";

export function ProductModal({
  product,
  onClose,
  onAddToCart,
}: {
  product: Product;
  onClose: () => void;
  onAddToCart?: (variant: ProductVariant) => void;
}) {
  const opener = useRef(
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null,
  );
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => ({
    ...(product.variants.find((v) => v.available)?.options ||
      product.variants[0]?.options ||
      {}),
  }));
  const [imageIndex, setImageIndex] = useState(0);
  const optionKeys = [
    ...new Set(product.variants.flatMap((v) => Object.keys(v.options))),
  ];
  const selectedVariant = product.variants.find((v) =>
    optionKeys.every((k) => v.options[k] === selectedOptions[k]),
  );
  const checkoutUrl = selectedVariant?.available
    ? getCheckoutUrl(selectedVariant.id)
    : "#store-coming-soon";
  const canBuy =
    isLive() &&
    !!selectedVariant?.available &&
    checkoutUrl !== "#store-coming-soon";
  const direction = merchDirection[product.handle];
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="supply-overlay" />
        <Dialog.Content
          className="supply-dialog"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            opener.current?.focus();
          }}
        >
          <Dialog.Close
            className="dialog-close"
            aria-label="Close product details"
          >
            <X size={20} />
          </Dialog.Close>
          <div className="product-detail-grid">
            <div className="product-detail-visual">
              <ProductImage
                key={product.id + imageIndex}
                product={product}
                index={imageIndex}
                eager
              />
              {product.images.length > 1 && (
                <div className="image-selector" aria-label="Product images">
                  {product.images.map((image, i) => (
                    <button
                      type="button"
                      key={image + i}
                      aria-label={`View product image ${i + 1}`}
                      aria-pressed={imageIndex === i}
                      onClick={() => setImageIndex(i)}
                    >
                      <img
                        src={image}
                        alt=""
                        width="64"
                        height="64"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="product-detail-copy">
              <p className="eyebrow">{direction?.family || "Ronin Supply"}</p>
              <Dialog.Title>{product.title}</Dialog.Title>
              <Dialog.Description>
                {isLive()
                  ? product.description
                  : "A proposed design from the Shotgun Ninjas universe. Final garment, print, and production details are subject to approval."}
              </Dialog.Description>
              {!isLive() && direction && (
                <p className="design-note">{direction.motif}</p>
              )}
              <p className="detail-price">
                {selectedVariant
                  ? formatPrice(
                      selectedVariant.price,
                      selectedVariant.currencyCode,
                    )
                  : "Select an available combination"}
              </p>
              {optionKeys.map((key) => (
                <fieldset key={key} className="variant-options">
                  <legend>
                    {key} <span>/ {selectedOptions[key]}</span>
                  </legend>
                  <div>
                    {[
                      ...new Set(
                        product.variants
                          .map((v) => v.options[key])
                          .filter(Boolean),
                      ),
                    ].map((value) => (
                      <button
                        type="button"
                        key={value}
                        aria-label={`${key}: ${value}`}
                        aria-pressed={selectedOptions[key] === value}
                        onClick={() =>
                          setSelectedOptions((previous) => ({
                            ...previous,
                            [key]: value,
                          }))
                        }
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
              {isLive() && !selectedVariant?.available && (
                <p role="status">
                  This combination is unavailable. Choose another option.
                </p>
              )}
              {canBuy ? (
                <div className="purchase-actions">
                  {onAddToCart && (
                    <button
                      type="button"
                      className="brand-button"
                      onClick={() =>
                        selectedVariant && onAddToCart(selectedVariant)
                      }
                    >
                      <ShoppingBag size={18} /> Add to cart
                    </button>
                  )}
                  <a
                    className="brand-button brand-button--outline"
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy now <ArrowUpRight size={18} />
                    <span className="sr-only">
                      {" "}
                      (opens Shopify in a new tab)
                    </span>
                  </a>
                </div>
              ) : (
                <button type="button" className="brand-button" disabled>
                  {isLive()
                    ? "Unavailable"
                    : "Concept preview · checkout closed"}
                </button>
              )}
              {selectedVariant?.sku && (
                <p className="detail-sku">SKU / {selectedVariant.sku}</p>
              )}
              <div className="detail-policy">
                {isLive()
                  ? "Final availability, tax, shipping, and delivery are confirmed by the store at checkout."
                  : "Artwork and garment images are design concepts. The store is not accepting orders here."}{" "}
                <a href={`${import.meta.env.BASE_URL}legal/refunds`}>
                  Shipping & returns
                </a>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
