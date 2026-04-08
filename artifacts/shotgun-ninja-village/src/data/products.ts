export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
  options: Record<string, string>;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
  collections: string[];
  tags: string[];
  featured: boolean;
  limitedDrop: boolean;
  badge?: "new" | "bestseller" | "limited" | "supporters-only";
  madeToOrder: boolean;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  icon: string;
  productCount: number;
}

export const collections: Collection[] = [
  {
    id: "col-core",
    handle: "core-brand",
    title: "Core Brand",
    description: "Essential Shotgun Ninjas gear. The foundation of the village wardrobe.",
    icon: "shield",
    productCount: 6,
  },
  {
    id: "col-kage9",
    handle: "kage-9",
    title: "Kage-9 Collection",
    description: "Operator-grade apparel inspired by the signal hunter himself.",
    icon: "user",
    productCount: 4,
  },
  {
    id: "col-episodes",
    handle: "episode-drops",
    title: "Episode Drops",
    description: "Limited designs tied to each transmission in the trilogy.",
    icon: "play",
    productCount: 3,
  },
  {
    id: "col-stickers",
    handle: "stickers-small-goods",
    title: "Stickers & Small Goods",
    description: "Tactical patches, stickers, and field accessories.",
    icon: "tag",
    productCount: 8,
  },
  {
    id: "col-limited",
    handle: "limited-edition",
    title: "Limited Edition",
    description: "One-run drops. Once they're gone, they're gone.",
    icon: "zap",
    productCount: 2,
  },
  {
    id: "col-founders",
    handle: "founders-supporter",
    title: "Founders Gear",
    description: "Exclusive items for early supporters of the village.",
    icon: "award",
    productCount: 3,
  },
];

export const products: Product[] = [
  {
    id: "prod-001",
    handle: "signal-hunter-tee",
    title: "Signal Hunter Tee",
    description: "Premium heavyweight cotton tee featuring the Shotgun Ninjas signal icon. Clean, minimal, unmistakable.",
    images: [],
    variants: [
      { id: "v-001-s", title: "S", sku: "SN-SHT-S", price: 34.99, available: true, options: { size: "S" } },
      { id: "v-001-m", title: "M", sku: "SN-SHT-M", price: 34.99, available: true, options: { size: "M" } },
      { id: "v-001-l", title: "L", sku: "SN-SHT-L", price: 34.99, available: true, options: { size: "L" } },
      { id: "v-001-xl", title: "XL", sku: "SN-SHT-XL", price: 34.99, available: true, options: { size: "XL" } },
      { id: "v-001-2xl", title: "2XL", sku: "SN-SHT-2XL", price: 36.99, available: true, options: { size: "2XL" } },
    ],
    collections: ["core-brand"],
    tags: ["tee", "core"],
    featured: true,
    limitedDrop: false,
    badge: "bestseller",
    madeToOrder: true,
  },
  {
    id: "prod-002",
    handle: "kage-9-operator-hoodie",
    title: "Kage-9 Operator Hoodie",
    description: "Heavyweight pullover with Kage-9 tactical insignia. Red on black. Built for the field.",
    images: [],
    variants: [
      { id: "v-002-s", title: "S", sku: "SN-K9H-S", price: 64.99, available: true, options: { size: "S" } },
      { id: "v-002-m", title: "M", sku: "SN-K9H-M", price: 64.99, available: true, options: { size: "M" } },
      { id: "v-002-l", title: "L", sku: "SN-K9H-L", price: 64.99, available: true, options: { size: "L" } },
      { id: "v-002-xl", title: "XL", sku: "SN-K9H-XL", price: 64.99, available: true, options: { size: "XL" } },
    ],
    collections: ["kage-9", "core-brand"],
    tags: ["hoodie", "kage-9", "premium"],
    featured: true,
    limitedDrop: false,
    badge: "new",
    madeToOrder: true,
  },
  {
    id: "prod-003",
    handle: "fracture-scan-drop-tee",
    title: "Fracture Scan Drop Tee",
    description: "Transmission 03 commemorative tee. Industrial-grade design from the TorqueShed recovery arc.",
    images: [],
    variants: [
      { id: "v-003-s", title: "S", sku: "SN-FS-S", price: 39.99, available: true, options: { size: "S" } },
      { id: "v-003-m", title: "M", sku: "SN-FS-M", price: 39.99, available: true, options: { size: "M" } },
      { id: "v-003-l", title: "L", sku: "SN-FS-L", price: 39.99, available: true, options: { size: "L" } },
      { id: "v-003-xl", title: "XL", sku: "SN-FS-XL", price: 39.99, available: true, options: { size: "XL" } },
    ],
    collections: ["episode-drops", "limited-edition"],
    tags: ["tee", "episode-drop", "limited"],
    featured: true,
    limitedDrop: true,
    badge: "limited",
    madeToOrder: true,
  },
  {
    id: "prod-004",
    handle: "village-signal-cap",
    title: "Village Signal Cap",
    description: "Structured snapback with embroidered Shotgun Ninjas signal mark. Low-profile. Clean lines.",
    images: [],
    variants: [
      { id: "v-004-blk", title: "Black", sku: "SN-CAP-BLK", price: 29.99, available: true, options: { color: "Black" } },
      { id: "v-004-red", title: "Red", sku: "SN-CAP-RED", price: 29.99, available: true, options: { color: "Red" } },
    ],
    collections: ["core-brand", "stickers-small-goods"],
    tags: ["cap", "accessory"],
    featured: false,
    limitedDrop: false,
    madeToOrder: true,
  },
  {
    id: "prod-005",
    handle: "tactical-sticker-pack",
    title: "Tactical Sticker Pack",
    description: "6-piece vinyl sticker set. Signal icons, operator marks, and system logos. Weatherproof.",
    images: [],
    variants: [
      { id: "v-005", title: "Standard Pack", sku: "SN-STK-6PK", price: 12.99, available: true, options: {} },
    ],
    collections: ["stickers-small-goods"],
    tags: ["stickers", "accessories"],
    featured: false,
    limitedDrop: false,
    badge: "bestseller",
    madeToOrder: false,
  },
  {
    id: "prod-006",
    handle: "founding-ninja-tee",
    title: "Founding Ninja Tee",
    description: "Exclusive to early village supporters. Numbered run. Will not be reprinted.",
    images: [],
    variants: [
      { id: "v-006-s", title: "S", sku: "SN-FN-S", price: 44.99, available: true, options: { size: "S" } },
      { id: "v-006-m", title: "M", sku: "SN-FN-M", price: 44.99, available: true, options: { size: "M" } },
      { id: "v-006-l", title: "L", sku: "SN-FN-L", price: 44.99, available: true, options: { size: "L" } },
      { id: "v-006-xl", title: "XL", sku: "SN-FN-XL", price: 44.99, available: true, options: { size: "XL" } },
    ],
    collections: ["founders-supporter", "limited-edition"],
    tags: ["tee", "founders", "limited", "exclusive"],
    featured: true,
    limitedDrop: true,
    badge: "limited",
    madeToOrder: true,
  },
  {
    id: "prod-007",
    handle: "forge-protocol-long-sleeve",
    title: "Forge Protocol Long Sleeve",
    description: "Transmission 02 field tee. BrandForge signal map graphic on the back. Slim fit.",
    images: [],
    variants: [
      { id: "v-007-s", title: "S", sku: "SN-FP-S", price: 42.99, available: true, options: { size: "S" } },
      { id: "v-007-m", title: "M", sku: "SN-FP-M", price: 42.99, available: true, options: { size: "M" } },
      { id: "v-007-l", title: "L", sku: "SN-FP-L", price: 42.99, available: true, options: { size: "L" } },
      { id: "v-007-xl", title: "XL", sku: "SN-FP-XL", price: 42.99, available: true, options: { size: "XL" } },
    ],
    collections: ["episode-drops"],
    tags: ["long-sleeve", "episode-drop"],
    featured: false,
    limitedDrop: false,
    badge: "new",
    madeToOrder: true,
  },
  {
    id: "prod-008",
    handle: "noise-sector-poster",
    title: "Noise Sector Poster",
    description: "18x24 matte print. Grid Map noise sector visualization. Museum-quality paper.",
    images: [],
    variants: [
      { id: "v-008", title: "18x24", sku: "SN-NSP-18", price: 24.99, available: true, options: {} },
    ],
    collections: ["stickers-small-goods"],
    tags: ["poster", "art", "grid-map"],
    featured: false,
    limitedDrop: false,
    madeToOrder: true,
  },
];
