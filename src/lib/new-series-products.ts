import type { Product } from "@/lib/1688-products";

type NewSeriesProductInput = {
  id: string;
  slug: string;
  name: string;
  kind: "earring design" | "bracelet" | "necklace" | "eyewear chain";
  price: number;
  detailCount: number;
};

function sourceGallery(slug: string, detailCount: number): string[] {
  const root = `/images/products/new-series/${slug}`;
  return [
    `${root}/main.jpg`,
    ...Array.from(
      { length: detailCount },
      (_, index) => `${root}/detail-${String(index + 1).padStart(2, "0")}.jpg`,
    ),
  ];
}

function createProduct(input: NewSeriesProductInput): Product {
  const sourceImages = sourceGallery(input.slug, input.detailCount);
  const editorialImages = [
    "new-series-white-shell-flower-drops", "new-series-gold-shell-teardrops",
    "new-series-baroque-pearl-hoops", "new-series-purple-gem-pearl-drops",
    "new-series-white-petal-flower-earrings", "new-series-mother-of-pearl-cluster-earrings",
    "new-series-white-shell-triple-drops", "new-series-round-shell-disc-drops",
    "new-series-pearl-jade-bracelet", "new-series-purple-gem-bangle",
    "new-series-shell-twist-pearl-cuff", "new-series-leaf-turquoise-pearl-cuff",
    "new-series-leaf-pearl-bracelet", "new-series-round-shell-gold-cuff",
    "new-series-purple-stone-pendant-necklace", "new-series-pearl-y-lariat",
    "new-series-green-layered-pendant-necklace", "new-series-pearl-dreamcatcher-lariat",
    "new-series-pearl-drop-choker", "new-series-multi-strand-pearl-choker",
    "new-series-black-drop-pearl-choker", "new-series-pearl-glasses-chain",
    "new-series-shell-drop-glasses-chain", "new-series-classic-pearl-chain",
    "new-series-turquoise-bead-chain",
  ].includes(input.slug)
    ? [
        `/images/products/new-series/${input.slug}/editorial-v1-01-hero.png`,
        `/images/products/new-series/${input.slug}/editorial-v1-02-macro.png`,
        `/images/products/new-series/${input.slug}/editorial-v1-03-worn.png`,
      ]
    : undefined;
  const images = editorialImages ?? sourceImages;
  const productType = input.kind === "earring design" ? "earrings" : input.kind;

  return {
    id: input.id,
    slug: input.slug,
    name: input.name,
    category: "pearl-series",
    categoryName: "The Pearl Edit",
    description: `${input.name} is a ${input.kind} selected for The Pearl Edit. Review every source-supplied product photo for the exact shape, setting, scale, color, and finish before ordering; lighting and screens can affect how details appear.`,
    price: input.price,
    image: images[0],
    images,
    imageRoles: {
      primary: images[0],
      ...(images[1] ? { detail: images[1] } : {}),
    },
    tag: "New",
    isBestSeller: false,
    isNew: true,
    isActive: true,
    inStock: true,
    rating: 0,
    reviewCount: 0,
    intention: `Pearl ${productType}`,
    benefitTriplet: "Pearl - Detail - Everyday",
  };
}

export const NEW_SERIES_PRODUCTS: Product[] = [
  createProduct({ id: "new-series-001", slug: "new-series-white-shell-flower-drops", name: "The Dewflower - Earrings", kind: "earring design", price: 34.99, detailCount: 4 }),
  createProduct({ id: "new-series-002", slug: "new-series-gold-shell-teardrops", name: "The Golden Petal - Earrings", kind: "earring design", price: 39.99, detailCount: 4 }),
  createProduct({ id: "new-series-003", slug: "new-series-baroque-pearl-hoops", name: "The Baroque Orbit - Earrings", kind: "earring design", price: 44.99, detailCount: 6 }),
  createProduct({ id: "new-series-004", slug: "new-series-purple-gem-pearl-drops", name: "The Violet Rain - Earrings", kind: "earring design", price: 42.99, detailCount: 4 }),
  createProduct({ id: "new-series-005", slug: "new-series-white-petal-flower-earrings", name: "The White Garden - Earrings", kind: "earring design", price: 39.99, detailCount: 4 }),
  createProduct({ id: "new-series-006", slug: "new-series-mother-of-pearl-cluster-earrings", name: "The Shell Bloom - Earrings", kind: "earring design", price: 44.99, detailCount: 5 }),
  createProduct({ id: "new-series-007", slug: "new-series-white-shell-triple-drops", name: "The Triple Light - Earrings", kind: "earring design", price: 42.99, detailCount: 4 }),
  createProduct({ id: "new-series-008", slug: "new-series-round-shell-disc-drops", name: "The Moon Disc - Earrings", kind: "earring design", price: 46.99, detailCount: 8 }),
  createProduct({ id: "new-series-009", slug: "new-series-pearl-jade-bracelet", name: "The Green Current - Bracelet", kind: "bracelet", price: 44.99, detailCount: 4 }),
  createProduct({ id: "new-series-010", slug: "new-series-purple-gem-bangle", name: "The Violet Arc - Bracelet", kind: "bracelet", price: 49.99, detailCount: 5 }),
  createProduct({ id: "new-series-011", slug: "new-series-shell-twist-pearl-cuff", name: "The Shell Twist - Bracelet", kind: "bracelet", price: 46.99, detailCount: 5 }),
  createProduct({ id: "new-series-012", slug: "new-series-leaf-turquoise-pearl-cuff", name: "The Turquoise Leaf - Bracelet", kind: "bracelet", price: 48.99, detailCount: 2 }),
  createProduct({ id: "new-series-013", slug: "new-series-leaf-pearl-bracelet", name: "The Leaf Line - Bracelet", kind: "bracelet", price: 49.99, detailCount: 4 }),
  createProduct({ id: "new-series-014", slug: "new-series-round-shell-gold-cuff", name: "The Golden Shell - Bracelet", kind: "bracelet", price: 54.99, detailCount: 6 }),
  createProduct({ id: "new-series-015", slug: "new-series-purple-stone-pendant-necklace", name: "The Violet Pendant - Necklace", kind: "necklace", price: 54.99, detailCount: 5 }),
  createProduct({ id: "new-series-016", slug: "new-series-pearl-y-lariat", name: "The Falling Pearl - Lariat", kind: "necklace", price: 59.99, detailCount: 2 }),
  createProduct({ id: "new-series-017", slug: "new-series-green-layered-pendant-necklace", name: "The Green Layer - Necklace", kind: "necklace", price: 56.99, detailCount: 1 }),
  createProduct({ id: "new-series-018", slug: "new-series-pearl-dreamcatcher-lariat", name: "The Dreamcatcher Pearl - Lariat", kind: "necklace", price: 62.99, detailCount: 1 }),
  createProduct({ id: "new-series-019", slug: "new-series-pearl-drop-choker", name: "The Pearl Drop - Choker", kind: "necklace", price: 57.99, detailCount: 3 }),
  createProduct({ id: "new-series-020", slug: "new-series-multi-strand-pearl-choker", name: "The Pearl Cascade - Choker", kind: "necklace", price: 64.99, detailCount: 2 }),
  createProduct({ id: "new-series-021", slug: "new-series-black-drop-pearl-choker", name: "The Midnight Drop - Choker", kind: "necklace", price: 59.99, detailCount: 1 }),
  createProduct({ id: "new-series-022", slug: "new-series-pearl-glasses-chain", name: "The Pearl Line - Eyewear Chain", kind: "eyewear chain", price: 34.99, detailCount: 4 }),
  createProduct({ id: "new-series-023", slug: "new-series-shell-drop-glasses-chain", name: "The Shell Drop - Eyewear Chain", kind: "eyewear chain", price: 36.99, detailCount: 2 }),
  createProduct({ id: "new-series-024", slug: "new-series-classic-pearl-chain", name: "The Classic Pearl - Eyewear Chain", kind: "eyewear chain", price: 32.99, detailCount: 0 }),
  createProduct({ id: "new-series-025", slug: "new-series-turquoise-bead-chain", name: "The Turquoise Note - Eyewear Chain", kind: "eyewear chain", price: 34.99, detailCount: 0 }),
];
