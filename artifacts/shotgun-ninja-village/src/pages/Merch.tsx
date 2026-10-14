import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, ArrowUpRight, ShoppingBag, X } from "lucide-react";
import type { Product, ProductVariant, Collection } from "@/data/products";
import { brandAsset } from "@/data/brand";
import {
  getProducts,
  getCollections,
  getCartCheckoutUrl,
  formatPrice,
  isLive,
} from "@/services/store";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductModal } from "@/components/shared/ProductModal";
import { UniverseFooter } from "@workspace/sn-ecosystem";
import { usePageMeta } from "@/hooks/usePageMeta";

type CartLine = { product: Product; variant: ProductVariant; quantity: number };

export default function Merch() {
  usePageMeta({
    title: "Ronin Supply — Village Merch",
    description:
      "Original Shotgun Ninjas apparel, operator marks, and world prints. Explore the Ronin Supply design collection.",
  });
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const cartTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setError(false);
    Promise.all([getProducts(), getCollections()])
      .then(([products, nextCollections]) => {
        if (!cancelled) {
          setAllProducts(products);
          setCollections(nextCollections);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setAllProducts([]);
          setCollections([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const visible = activeCollection
    ? allProducts.filter((p) => p.collections.includes(activeCollection))
    : allProducts;
  const checkout = getCartCheckoutUrl(
    cart.map((line) => ({
      variantId: line.variant.id,
      quantity: line.quantity,
    })),
  );
  const cartCount = cart.reduce((total, line) => total + line.quantity, 0);
  const currencies = [
    ...new Set(cart.map((line) => line.variant.currencyCode || "USD")),
  ];
  const subtotal = cart.reduce(
    (total, line) => total + line.quantity * line.variant.price,
    0,
  );

  function addToCart(product: Product, variant: ProductVariant) {
    if (
      !isLive() ||
      !variant.available ||
      getCartCheckoutUrl([{ variantId: variant.id, quantity: 1 }]) ===
        "#store-coming-soon"
    )
      return;
    setCart((previous) => {
      const match = previous.find((line) => line.variant.id === variant.id);
      return match
        ? previous.map((line) =>
            line.variant.id === variant.id
              ? { ...line, quantity: Math.min(99, line.quantity + 1) }
              : line,
          )
        : [...previous, { product, variant, quantity: 1 }];
    });
    setSelectedProduct(null);
    setCartOpen(true);
  }

  return (
    <div className="village-page merch-page">
      <section className="supply-hero">
        <div className="supply-hero-copy">
          <p className="eyebrow">Shotgun Ninjas / Village outfitter</p>
          <h1>
            RONIN
            <br />
            <span>SUPPLY.</span>
          </h1>
          <p className="lede">
            Wear the world.
            <br />
            Carry the signal.
          </p>
          <p>
            From Kage-9's red armor to the marks of the village. A single
            universe, translated into everyday gear.
          </p>
          <a href="#shop" className="brand-button">
            Explore the collection <ArrowRight size={18} />
          </a>
        </div>
        <div className="supply-hero-art">
          <img
            src={brandAsset("merch/kage-9-operator-hoodie.webp")}
            alt="Kage-9 hoodie design concept, not a current product photograph"
            width="1024"
            height="1024"
            fetchPriority="high"
            decoding="async"
          />
          <div className="supply-art-caption">
            <span>DESIGN STUDY / KAGE-9</span>
            <span>OWNER REVIEW CONCEPT</span>
          </div>
        </div>
      </section>
      {!isLive() && (
        <div className="catalog-notice" role="note">
          <span className="notice-dot" /> Concept catalog. Artwork and garments
          are previews; checkout is closed. Existing preview prices are shown
          for reference.
        </div>
      )}
      <div className="supply-strip">
        <span>Signal Essentials</span>
        <span>Kage-9</span>
        <span>Transmission Archive</span>
        <span>Village Marks</span>
        <span>Founders</span>
      </div>
      <section id="shop" className="supply-shop">
        <div className="supply-section-heading">
          <div>
            <p className="eyebrow">The village wardrobe</p>
            <h2>Choose your signal.</h2>
          </div>
          <div>
            {isLive() && (
              <button
                type="button"
                ref={cartTrigger}
                className="cart-trigger"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag size={18} /> Cart ({cartCount})
              </button>
            )}
          </div>
        </div>
        {loaded && !error && (
          <div
            className="collection-filters"
            aria-label="Filter products by collection"
          >
            <button
              type="button"
              aria-pressed={!activeCollection}
              onClick={() => setActiveCollection(null)}
            >
              All items <span>{allProducts.length}</span>
            </button>
            {collections.map((collection) => (
              <button
                key={collection.id}
                type="button"
                aria-pressed={activeCollection === collection.handle}
                onClick={() => setActiveCollection(collection.handle)}
              >
                {collection.title}{" "}
                <span>
                  {
                    allProducts.filter((p) =>
                      p.collections.includes(collection.handle),
                    ).length
                  }
                </span>
              </button>
            ))}
          </div>
        )}
        {!loaded && (
          <div className="catalog-state" role="status">
            Opening the supply archive…
          </div>
        )}
        {error && (
          <div className="catalog-state" role="alert">
            <h3>The supply channel is unavailable.</h3>
            <p>We couldn't load the store catalog. Please try again.</p>
            <button
              type="button"
              className="brand-button"
              onClick={() => setAttempt((a) => a + 1)}
            >
              Retry catalog
            </button>
          </div>
        )}
        {loaded && !error && (
          <>
            <p className="catalog-results" role="status">
              {visible.length} {visible.length === 1 ? "item" : "items"}
              {activeCollection
                ? ` / ${collections.find((c) => c.handle === activeCollection)?.title || activeCollection}`
                : " / All collections"}
            </p>
            <div className="merch-product-grid">
              {visible.map((product) => (
                <ProductCard
                  product={product}
                  key={product.id}
                  onSelect={setSelectedProduct}
                />
              ))}
            </div>
            {!visible.length && (
              <div className="catalog-state">
                <p>No items in this collection.</p>
                <button
                  type="button"
                  className="brand-button brand-button--outline"
                  onClick={() => setActiveCollection(null)}
                >
                  View all items
                </button>
              </div>
            )}
          </>
        )}
      </section>
      <section className="supply-world">
        <img
          src={brandAsset("village-key-art.webp")}
          width="1536"
          height="1024"
          alt="Lantern-lit rooftops of the Shotgun Ninjas village"
          loading="lazy"
          decoding="async"
        />
        <div>
          <p className="eyebrow">Built from the same world</p>
          <h2>
            More than a mark.
            <br />A place to belong.
          </h2>
          <p>
            Explore the archetypes, districts, and recovered transmissions
            behind the collection.
          </p>
          <Link href="/codex" className="text-link">
            Open the village codex <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section className="supply-info">
        <article>
          <p className="eyebrow">01 / Artwork</p>
          <h3>Original by design.</h3>
          <p>
            Signal crests, operator studies, and world prints share one anime
            action-game language.
          </p>
        </article>
        <article>
          <p className="eyebrow">02 / Ordering</p>
          <h3>Know what you get.</h3>
          <p>
            {isLive()
              ? "Choose a store variant and review final availability and delivery at checkout."
              : "These are design previews. Ordering opens after products and production artwork are approved."}
          </p>
        </article>
        <article>
          <p className="eyebrow">03 / Support</p>
          <h3>A clear next step.</h3>
          <p>
            <Link href="/legal/refunds">
              Shipping & returns <ArrowUpRight size={14} />
            </Link>
            <Link href="/legal/contact">
              Contact the village <ArrowUpRight size={14} />
            </Link>
          </p>
        </article>
      </section>
      <UniverseFooter LinkComponent={Link} />
      {selectedProduct && (
        <ProductModal
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(variant) => addToCart(selectedProduct, variant)}
        />
      )}
      <Dialog.Root open={cartOpen} onOpenChange={setCartOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="supply-overlay" />
          <Dialog.Content
            className="supply-dialog cart-dialog"
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              cartTrigger.current?.focus();
            }}
          >
            <Dialog.Close className="dialog-close" aria-label="Close cart">
              <X size={20} />
            </Dialog.Close>
            <p className="eyebrow">Ronin Supply</p>
            <Dialog.Title>Your cart</Dialog.Title>
            <Dialog.Description>
              Review your selected store variants before continuing to Shopify.
            </Dialog.Description>
            {!cart.length && (
              <p className="cart-empty">
                Your cart is empty. Explore the collection to add an item.
              </p>
            )}
            {cart.map((line) => (
              <article className="cart-line" key={line.variant.id}>
                <div>
                  <h3>{line.product.title}</h3>
                  <p>
                    {line.variant.title} /{" "}
                    {formatPrice(line.variant.price, line.variant.currencyCode)}
                  </p>
                </div>
                <label>
                  Quantity
                  <input
                    aria-label={`Quantity for ${line.product.title} ${line.variant.title}`}
                    type="number"
                    min="1"
                    max="99"
                    value={line.quantity}
                    onChange={(event) => {
                      const quantity = Math.max(
                        1,
                        Math.min(99, Number(event.target.value) || 1),
                      );
                      setCart((previous) =>
                        previous.map((item) =>
                          item.variant.id === line.variant.id
                            ? { ...item, quantity }
                            : item,
                        ),
                      );
                    }}
                  />
                </label>
                <button
                  type="button"
                  aria-label={`Remove ${line.product.title}`}
                  onClick={() =>
                    setCart((previous) =>
                      previous.filter(
                        (item) => item.variant.id !== line.variant.id,
                      ),
                    )
                  }
                >
                  Remove
                </button>
              </article>
            ))}
            {!!cart.length && (
              <>
                <p className="cart-subtotal">
                  {currencies.length === 1
                    ? `Subtotal / ${formatPrice(subtotal, currencies[0])}`
                    : "Final total confirmed by Shopify."}
                </p>
                <p className="detail-policy">
                  Shipping, tax, availability, and final totals are confirmed at
                  checkout.
                </p>
                {checkout !== "#store-coming-soon" && (
                  <a
                    className="brand-button"
                    href={checkout}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Continue to checkout <ArrowUpRight size={18} />
                    <span className="sr-only">
                      {" "}
                      (opens Shopify in a new tab)
                    </span>
                  </a>
                )}
              </>
            )}
            <Dialog.Close className="text-link">
              Continue browsing <ArrowRight size={16} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
