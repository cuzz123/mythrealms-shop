import assert from "node:assert/strict";
import test from "node:test";

import {
  getProductType,
  getStorefrontProductById,
  getStorefrontProductBySlug,
  getStorefrontProducts,
} from "../src/lib/storefront/catalog";
import {
  shouldMarkPrimaryAsEncountered,
  shouldShowStickyAddToCart,
} from "../src/components/storefront/StickyAddToCart";

const EXPECTED_TYPES = {
  rings: ["pearl-series-01", "pearl-series-02", "pearl-series-03"],
  bracelets: [
    "pearl-series-04",
    "pearl-series-05",
    "pearl-series-06",
    "pearl-series-07",
    "pearl-series-08",
    "pearl-series-09",
    "pearl-series-10",
    "pearl-series-11",
    "pearl-series-12",
    "new-series-pearl-jade-bracelet",
    "new-series-purple-gem-bangle",
    "new-series-shell-twist-pearl-cuff",
    "new-series-leaf-turquoise-pearl-cuff",
    "new-series-leaf-pearl-bracelet",
    "new-series-round-shell-gold-cuff",
  ],
  earrings: [
    "pearl-series-13",
    "pearl-series-14",
    "pearl-series-15",
    "pearl-series-16",
    "new-series-white-shell-flower-drops",
    "new-series-gold-shell-teardrops",
    "new-series-baroque-pearl-hoops",
    "new-series-purple-gem-pearl-drops",
    "new-series-white-petal-flower-earrings",
    "new-series-mother-of-pearl-cluster-earrings",
    "new-series-white-shell-triple-drops",
    "new-series-round-shell-disc-drops",
  ],
  necklaces: [
    "pearl-series-17",
    "pearl-series-18",
    "pearl-series-19",
    "pearl-series-20",
    "new-series-purple-stone-pendant-necklace",
    "new-series-pearl-y-lariat",
    "new-series-green-layered-pendant-necklace",
    "new-series-pearl-dreamcatcher-lariat",
    "new-series-pearl-drop-choker",
    "new-series-multi-strand-pearl-choker",
    "new-series-black-drop-pearl-choker",
  ],
  "eyewear-chains": [
    "new-series-pearl-glasses-chain",
    "new-series-shell-drop-glasses-chain",
    "new-series-classic-pearl-chain",
    "new-series-turquoise-bead-chain",
  ],
  "hair-accessories": [
    "new-series-white-floral-hair-stick",
    "new-series-white-flower-wood-stick",
    "new-series-pearl-cluster-hair-claw",
    "new-series-gold-pearl-hair-stick",
    "new-series-pearl-flower-u-pin",
    "new-series-pearl-bar-hair-clip",
    "new-series-shell-chip-hair-clip",
    "new-series-wood-flower-hair-stick",
    "new-series-daisy-chain-hair-stick",
    "new-series-wood-pearl-hair-stick",
    "new-series-gold-star-hair-stick",
    "new-series-star-flower-hair-clip",
    "new-series-chain-flower-hair-pin",
    "new-series-flower-pearl-hair-clip",
    "new-series-pink-flower-hair-clip",
    "new-series-blue-flower-bow-hair-clip",
    "new-series-blue-teardrop-hair-stick",
    "new-series-dragonfly-hair-clip",
  ],
} as const;

const NEW_SERIES_SLUGS = Object.values(EXPECTED_TYPES)
  .flat()
  .filter((slug) => slug.startsWith("new-series-"));

type NewSeriesCopyEvidence = {
  productType: keyof typeof EXPECTED_TYPES;
  visibleTerms: readonly string[];
};

const NEW_SERIES_COPY_EVIDENCE: Record<string, NewSeriesCopyEvidence> = {
  "new-series-white-shell-flower-drops": {
    productType: "earrings",
    visibleTerms: ["translucent white", "scalloped petals", "flower drops", "two flowers"],
  },
  "new-series-gold-shell-teardrops": {
    productType: "earrings",
    visibleTerms: ["pale petal-shaped", "gold-toned oval", "cream beads", "teardrop outline"],
  },
  "new-series-baroque-pearl-hoops": {
    productType: "earrings",
    visibleTerms: ["irregular luminous white drops", "round hoops", "uneven lower shapes", "organic"],
  },
  "new-series-purple-gem-pearl-drops": {
    productType: "earrings",
    visibleTerms: ["milky oval center", "violet border", "reflective points", "round violet stud"],
  },
  "new-series-white-petal-flower-earrings": {
    productType: "earrings",
    visibleTerms: ["four rounded white petals", "luminous bead", "close to the ear", "floral outline"],
  },
  "new-series-mother-of-pearl-cluster-earrings": {
    productType: "earrings",
    visibleTerms: ["layered pale petal forms", "bead grouping", "round lower charm", "clustered drop"],
  },
  "new-series-white-shell-triple-drops": {
    productType: "earrings",
    visibleTerms: ["three pale round shell-like discs", "gold-toned edge", "vertical drop", "repeated circles"],
  },
  "new-series-round-shell-disc-drops": {
    productType: "earrings",
    visibleTerms: ["dark green-gray upper discs", "iridescent lower discs", "pale bead clusters", "round surfaces"],
  },
  "new-series-pearl-jade-bracelet": {
    productType: "bracelets",
    visibleTerms: ["irregular pearl-like white beads", "smooth green oval accent", "gold-toned links", "wrist"],
  },
  "new-series-purple-gem-bangle": {
    productType: "bracelets",
    visibleTerms: ["faceted purple center", "pale round accents", "open warm gold-toned bangle", "straight rails"],
  },
  "new-series-shell-twist-pearl-cuff": {
    productType: "bracelets",
    visibleTerms: ["smooth pale round forms", "irregular shell-like accent", "coiled gold-toned line", "open arc"],
  },
  "new-series-leaf-turquoise-pearl-cuff": {
    productType: "bracelets",
    visibleTerms: ["turquoise-colored round accents", "pale irregular center", "looping gold-toned cuff", "leaf"],
  },
  "new-series-leaf-pearl-bracelet": {
    productType: "bracelets",
    visibleTerms: ["pearl-like white beads", "leaf-shaped gold-toned forms", "repeating wrist line", "botanical"],
  },
  "new-series-round-shell-gold-cuff": {
    productType: "bracelets",
    visibleTerms: ["pale bead accents", "leaf- and shell-shaped", "gold-toned forms", "rounded centers"],
  },
  "new-series-purple-stone-pendant-necklace": {
    productType: "necklaces",
    visibleTerms: ["faceted purple stone-like shape", "rounded gold-toned frame", "dark, mauve, and smoky beads", "pendant"],
  },
  "new-series-pearl-y-lariat": {
    productType: "necklaces",
    visibleTerms: ["fine gold-toned chain", "graduated pearl-like beads", "Y-shaped layout", "final round drop"],
  },
  "new-series-green-layered-pendant-necklace": {
    productType: "necklaces",
    visibleTerms: ["fine gold-toned chain", "alternating light cream rounded beads", "openwork center", "single lower bead"],
  },
  "new-series-pearl-dreamcatcher-lariat": {
    productType: "necklaces",
    visibleTerms: ["fine at the shoulders", "pearl-like beads", "openwork medallion", "long central drop"],
  },
  "new-series-pearl-drop-choker": {
    productType: "necklaces",
    visibleTerms: ["row of small pearl-like beads", "slim chain drops", "fringe edge", "front"],
  },
  "new-series-multi-strand-pearl-choker": {
    productType: "necklaces",
    visibleTerms: ["fine gold-toned chain", "many strands", "pearl-like beads", "varied lengths"],
  },
  "new-series-black-drop-pearl-choker": {
    productType: "necklaces",
    visibleTerms: ["pale close-set bead line", "gold-toned chains", "pointed front fringe", "descending chain lengths"],
  },
  "new-series-pearl-glasses-chain": {
    productType: "eyewear-chains",
    visibleTerms: ["rounded pearl-like beads", "fine gold-toned chain", "clear loops for glasses", "near the frames"],
  },
  "new-series-shell-drop-glasses-chain": {
    productType: "eyewear-chains",
    visibleTerms: ["fan-shaped shell-like pendant", "slim gold-toned chain", "clear loops", "scalloped edges"],
  },
  "new-series-classic-pearl-chain": {
    productType: "eyewear-chains",
    visibleTerms: ["evenly spaced pearl-like beads", "slim gold-toned line", "clear glasses loops", "front section"],
  },
  "new-series-turquoise-bead-chain": {
    productType: "eyewear-chains",
    visibleTerms: ["fine gold-toned line", "two vertical groups", "turquoise-colored beads", "clear loops for glasses"],
  },
  "new-series-white-floral-hair-stick": {
    productType: "hair-accessories",
    visibleTerms: ["white many-petaled flower", "slim gold-toned stick", "blue-green round center", "low twist"],
  },
  "new-series-white-flower-wood-stick": {
    productType: "hair-accessories",
    visibleTerms: ["dark wood-toned curved stick", "small white flower", "pearl-like hanging accent", "brown and ivory"],
  },
  "new-series-pearl-cluster-hair-claw": {
    productType: "hair-accessories",
    visibleTerms: ["irregular white pearl-like forms", "dense flower-like top", "gold-toned claw base", "petal-shaped pieces"],
  },
  "new-series-gold-pearl-hair-stick": {
    productType: "hair-accessories",
    visibleTerms: ["long, slim gold-toned stick", "elongated pearl-like accent", "open floral connector", "updo"],
  },
  "new-series-pearl-flower-u-pin": {
    productType: "hair-accessories",
    visibleTerms: ["five-petal flower", "rounded pearl-like center", "circular ring", "two long prongs"],
  },
  "new-series-pearl-bar-hair-clip": {
    productType: "hair-accessories",
    visibleTerms: ["three flower-like clusters", "gold-toned bar", "warmer center", "floral band"],
  },
  "new-series-shell-chip-hair-clip": {
    productType: "hair-accessories",
    visibleTerms: ["irregular pale shell-like pieces", "rounded bead accents", "gold-toned filigree base", "petal shapes"],
  },
  "new-series-wood-flower-hair-stick": {
    productType: "hair-accessories",
    visibleTerms: ["dark wood-toned stick", "two small floral ornaments", "pale drop", "long brown base"],
  },
  "new-series-daisy-chain-hair-stick": {
    productType: "hair-accessories",
    visibleTerms: ["pale daisy-like flower", "bright yellow middle", "two trailing gold-toned chains", "straight counterline"],
  },
  "new-series-wood-pearl-hair-stick": {
    productType: "hair-accessories",
    visibleTerms: ["dark openwork top", "long narrow stick", "three pearl-like drops", "separate gold-toned chains"],
  },
  "new-series-gold-star-hair-stick": {
    productType: "hair-accessories",
    visibleTerms: ["white five-petal flower", "amber-colored center", "branch-like details", "double-prong base"],
  },
  "new-series-star-flower-hair-clip": {
    productType: "hair-accessories",
    visibleTerms: ["pale pointed flower", "gold-toned bar", "soft pink rounded center", "pointed petals"],
  },
  "new-series-chain-flower-hair-pin": {
    productType: "hair-accessories",
    visibleTerms: ["small rounded cluster", "open rectangular frame", "fine gold-toned chains", "vertical path"],
  },
  "new-series-flower-pearl-hair-clip": {
    productType: "hair-accessories",
    visibleTerms: ["warm gold-toned bar", "pale irregular forms", "darker rounded accent", "wing-like spread"],
  },
  "new-series-pink-flower-hair-clip": {
    productType: "hair-accessories",
    visibleTerms: ["soft pink and white rounded forms", "compact floral group", "slim gold-toned clip", "blush note"],
  },
  "new-series-blue-flower-bow-hair-clip": {
    productType: "hair-accessories",
    visibleTerms: ["cool blue-green round accent", "pale petal-like forms", "warm gold-toned bar", "cool-warm contrast"],
  },
  "new-series-blue-teardrop-hair-stick": {
    productType: "hair-accessories",
    visibleTerms: ["round blue center", "radiating frame", "dark wood-toned stick", "pearl-like drops"],
  },
  "new-series-dragonfly-hair-clip": {
    productType: "hair-accessories",
    visibleTerms: ["pale textured wings", "green oval center", "deep violet round accents", "horizontal clip bar"],
  },
} as const;

test("storefront exposes the 20 core products and 43 approved new-series products", () => {
  const products = getStorefrontProducts();

  assert.equal(products.length, 63);
  assert.equal(new Set(products.map((product) => product.id)).size, 63);
  assert.equal(new Set(products.map((product) => product.slug)).size, 63);
  assert.ok(
    products.every(
      (product) =>
        product.category === "pearl-series" && product.isActive && product.inStock,
    ),
  );
});

test("retired and unknown products cannot be resolved", () => {
  assert.equal(getStorefrontProductBySlug("pearl-crystal-series-03"), undefined);
  assert.equal(getStorefrontProductBySlug("curated-singles-01"), undefined);
  assert.equal(getStorefrontProductBySlug("test-product"), undefined);
  assert.equal(getStorefrontProductById("1688-035"), undefined);
  assert.equal(getStorefrontProductById("missing"), undefined);
});

test("every storefront product has a deterministic merchandise type", () => {
  for (const [type, slugs] of Object.entries(EXPECTED_TYPES)) {
    for (const slug of slugs) {
      const product = getStorefrontProductBySlug(slug);
      assert.ok(product, `Expected storefront product ${slug}`);
      assert.equal(getProductType(product), type);
    }
  }

  const classified = Object.values(EXPECTED_TYPES).flat();
  assert.equal(classified.length, 63);
  assert.deepEqual(
    [...classified].sort(),
    getStorefrontProducts().map((product) => product.slug).sort(),
  );
});

test("catalog results cannot mutate the source collection or lookups", () => {
  const firstRead = getStorefrontProducts();
  const original = firstRead[0];

  firstRead.pop();
  original.slug = "curated-singles-01";
  original.images.push("/tampered.webp");

  assert.equal(getStorefrontProducts().length, 63);
  assert.equal(getStorefrontProductBySlug("curated-singles-01"), undefined);

  const freshProduct = getStorefrontProductById(original.id);
  assert.ok(freshProduct);
  assert.notEqual(freshProduct.slug, "curated-singles-01");
  assert.ok(!freshProduct.images.includes("/tampered.webp"));
});

test("collection-ready catalog reads remain an ordered product-only array", () => {
  const products = getStorefrontProducts();

  assert.ok(products.length >= 12);
  assert.ok(products.every((product) => typeof product.id === "string"));
  assert.deepEqual(
    products.map((product) => product.slug),
    getStorefrontProducts().map((product) => product.slug),
  );
});

test("the calm tide pilot uses its complete editorial gallery without changing other pearl source galleries", () => {
  const pilot = getStorefrontProductBySlug("pearl-series-01");
  assert.ok(pilot);
  assert.equal(
    pilot.image,
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-01-hero.png",
  );
  assert.deepEqual(pilot.images, [
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-01-hero.png",
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-02-macro.png",
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-03-worn.png",
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-04-profile.png",
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-05-atmosphere.png",
  ]);
  assert.deepEqual(pilot.imageRoles, {
    primary: "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-01-hero.png",
    wearing: "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-03-worn.png",
    detail: "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-02-macro.png",
  });

  const coreEditorialSlugs = [
    "pearl-series-02", "pearl-series-03", "pearl-series-04", "pearl-series-05",
    "pearl-series-06", "pearl-series-07", "pearl-series-08", "pearl-series-09",
    "pearl-series-10", "pearl-series-11", "pearl-series-12", "pearl-series-13",
    "pearl-series-14", "pearl-series-15", "pearl-series-16", "pearl-series-17",
    "pearl-series-18", "pearl-series-19", "pearl-series-20",
  ];

  for (const slug of coreEditorialSlugs) {
    const product = getStorefrontProductBySlug(slug);
    assert.ok(product, `Expected ${slug} to be available`);
    const imageRoot = `/images/products/1688-shop/pearl-series/${slug}-editorial-v1-`;
    assert.deepEqual(product.images, [
      `${imageRoot}01-hero.png`,
      `${imageRoot}02-macro.png`,
      `${imageRoot}03-worn.png`,
    ]);
    assert.deepEqual(product.imageRoles, {
      primary: `${imageRoot}01-hero.png`,
      detail: `${imageRoot}02-macro.png`,
      wearing: `${imageRoot}03-worn.png`,
    });
  }
});

test("approved new-series products use their own approved galleries", () => {
  assert.equal(NEW_SERIES_SLUGS.length, 43);

  for (const slug of NEW_SERIES_SLUGS) {
    const product = getStorefrontProductBySlug(slug);
    assert.ok(product, `Expected approved new-series product ${slug}`);
    const sourceRoot = `/images/products/new-series/${slug}/`;
    const editorialRoot = `${sourceRoot}editorial-v1-`;
    const expectedPrimary = `${editorialRoot}01-hero.png`;
    assert.equal(product.image, expectedPrimary);
    assert.ok(product.images.length >= 1);
    assert.ok(
      product.images.every((image) => image.startsWith(sourceRoot)),
      `${slug} must not reuse another product's images`,
    );
  }
});

test("each new-series description matches its approved gallery evidence and product kind", () => {
  assert.deepEqual(
    Object.keys(NEW_SERIES_COPY_EVIDENCE).sort(),
    [...NEW_SERIES_SLUGS].sort(),
    "copy evidence must cover exactly the 43 approved new-series slugs",
  );

  for (const slug of NEW_SERIES_SLUGS) {
    const product = getStorefrontProductBySlug(slug);
    assert.ok(product, `Expected approved new-series product ${slug}`);
    const evidence = NEW_SERIES_COPY_EVIDENCE[slug];
    assert.ok(evidence, `Missing approved gallery evidence contract for ${slug}`);
    assert.equal(getProductType(product), evidence.productType, `${slug} has the wrong product kind`);

    const copy = product.description.toLowerCase();
    for (const term of evidence.visibleTerms) {
      assert.ok(
        copy.includes(term.toLowerCase()),
        `${slug} must mention approved visible evidence term "${term}"`,
      );
    }
  }
});

test("new-series products have explicit, distinct, substantive descriptions", () => {
  const products = NEW_SERIES_SLUGS.map((slug) => {
    const product = getStorefrontProductBySlug(slug);
    assert.ok(product, `Expected approved new-series product ${slug}`);
    return product;
  });
  const descriptions = products.map((product) => product.description.trim());

  assert.equal(new Set(descriptions).size, 43);

  for (const product of products) {
    assert.ok(product.description.includes(product.name), `${product.slug} must name the product`);
    assert.ok(product.description.length >= 220, `${product.slug} needs substantial copy`);
    assert.ok(
      !product.description.includes("Review every source-supplied product photo"),
      `${product.slug} must not use the shared source-photo disclaimer`,
    );
    assert.ok(
      !product.description.includes("lighting and screens can affect how details appear"),
      `${product.slug} must not use the shared lighting disclaimer`,
    );
  }
});

test("new-series product copy excludes unsupported material, quality, and factual language", () => {
  const bannedLanguage = [
    /\bpolished\b/i,
    /\bone-of-a-kind\b/i,
    /\brefined\b/i,
    /\bdistinctive\b/i,
    /\bunique\b/i,
    /\bpremium\b/i,
    /\bluxur(?:y|ious)\b/i,
    /\bhigh[- ]quality\b/i,
    /\bquality\b/i,
    /\bdurab(?:le|ility)\b/i,
    /\blong[- ]lasting\b/i,
    /\bcomfortable\b/i,
    /\blightweight\b/i,
    /\bhand[- ]?made\b/i,
    /\bcraftsmanship\b/i,
    /\bhypoallergenic\b/i,
    /\bwaterproof\b/i,
  ];
  const bannedFactualClaims = [
    /\b(?:sku|gtin|mpn|upc|ean)\b/i,
    /\b\d+(?:\.\d+)?\s*(?:mm|cm|m|in(?:ch(?:es)?)?|ft|oz|g|kg|lb(?:s)?)\b/i,
    /\b\d+(?:\.\d+)?\s*(?:x|×|by)\s*\d+(?:\.\d+)?\b/i,
    /\b(?:approximately|approx\.?|about)\s+\d/i,
    /\b(?:dimension(?:s|al)?|measure(?:s|ment|ments)?|diameter|width|height|depth)\b/i,
    /\b(?:item|product|piece|net|shipping)\s+(?:weight|weighs?)\b/i,
    /\b(?:grams?|ounces?|pounds?)\b/i,
    /\b(?:made|crafted|constructed|manufactured|produced)\s+(?:of|from|in|by)\b/i,
    /\b(?:assembled|fabricated|formed|forged)\s+(?:of|from|in|by)\b/i,
    /\b(?:sourced|originat(?:ed|es?)|imported)\s+(?:in|from)\b/i,
    /\b(?:genuine|natural|solid|sterling|karat|vermeil|pure)\s+(?:gold|silver|pearl|stone|gem|wood|shell|leather|metal|crystal|glass)\b/i,
    /\b(?:gold|silver|pearl|stone|gem|wood|shell|leather|metal|crystal|glass)\s*(?:plated|filled|alloy|content)\b/i,
    /\b(?:hand[- ]?made|handcrafted|artisan|manufacturing)\b/i,
    /\b(?:certif(?:ied|ication)|authentic(?:ated|ity)?|hallmark|certificate|compliant|tested|grade)\b/i,
    /\b(?:country of origin|origin|imported|sourced)\b/i,
    /\bshown in the approved gallery\b/i,
    /\bsource[- ]supplied\b/i,
    /\blighting and screens\b/i,
  ];

  for (const slug of NEW_SERIES_SLUGS) {
    const product = getStorefrontProductBySlug(slug);
    assert.ok(product, `Expected approved new-series product ${slug}`);
    for (const pattern of bannedLanguage) {
      assert.doesNotMatch(product.description, pattern, `${slug} contains unsupported language ${pattern}`);
    }
    // Appearance-safe qualifiers such as "gold-toned" and "pearl-like" remain allowed.
    const copyBody = product.description.replace(product.name, "");
    for (const pattern of bannedFactualClaims) {
      assert.doesNotMatch(copyBody, pattern, `${slug} contains unsupported factual language ${pattern}`);
    }
  }
});

test("new-series product copy avoids repeated long phrases and sentence templates", () => {
  const products = NEW_SERIES_SLUGS.map((slug) => {
    const product = getStorefrontProductBySlug(slug);
    assert.ok(product, `Expected approved new-series product ${slug}`);
    return product;
  });
  const repeatedNgrams = new Map<string, Set<string>>();

  for (const product of products) {
    const words = product.description
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
    for (let index = 0; index + 7 <= words.length; index += 1) {
      const phrase = words.slice(index, index + 7).join(" ");
      const owners = repeatedNgrams.get(phrase) ?? new Set<string>();
      owners.add(product.slug);
      repeatedNgrams.set(phrase, owners);
    }
  }

  const sharedLongPhrases = [...repeatedNgrams.entries()]
    .filter(([, owners]) => owners.size > 1)
    .map(([phrase]) => phrase);
  assert.deepEqual(sharedLongPhrases, [], `Shared long phrases: ${sharedLongPhrases.join(" | ")}`);

  const repeatedSentenceOpenings = new Map<string, Set<string>>();
  for (const product of products) {
    for (const sentence of product.description.split(/[.!?]+/).slice(1)) {
      const opening = sentence
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 3)
        .join(" ");
      if (!opening) continue;
      const owners = repeatedSentenceOpenings.get(opening) ?? new Set<string>();
      owners.add(product.slug);
      repeatedSentenceOpenings.set(opening, owners);
    }
  }

  const sharedOpenings = [...repeatedSentenceOpenings.entries()]
    .filter(([, owners]) => owners.size > 1)
    .map(([opening]) => opening);
  assert.deepEqual(sharedOpenings, [], `Shared sentence openings: ${sharedOpenings.join(" | ")}`);

  const sentenceCounts = products.map((product) =>
    product.description.split(/[.!?]+/).filter((sentence) => sentence.trim()).length,
  );
  assert.ok(
    new Set(sentenceCounts).size > 1,
    `Sentence counts should vary across the catalog; observed ${sentenceCounts.join(", ")}`,
  );
});

test("storefront products expose truthful card image roles", () => {
  const editorialCore = getStorefrontProductBySlug("pearl-series-13");
  const editorialWorn = getStorefrontProductBySlug("pearl-series-18");
  const newSeries = getStorefrontProductBySlug("new-series-round-shell-disc-drops");

  assert.equal(editorialCore?.imageRoles?.wearing, "/images/products/1688-shop/pearl-series/pearl-series-13-editorial-v1-03-worn.png");
  assert.equal(editorialWorn?.imageRoles?.wearing, "/images/products/1688-shop/pearl-series/pearl-series-18-editorial-v1-03-worn.png");
  assert.equal(newSeries?.imageRoles?.wearing, "/images/products/new-series/new-series-round-shell-disc-drops/editorial-v1-03-worn.png");
  assert.equal(newSeries?.imageRoles?.primary, newSeries?.images[0]);
});

test("sticky purchase controls remain absent when the product is unavailable", () => {
  assert.equal(shouldShowStickyAddToCart(false, false, true, true), false);
  assert.equal(shouldShowStickyAddToCart(true, true, true, true), false);
  assert.equal(shouldShowStickyAddToCart(true, false, false, true), false);
  assert.equal(shouldShowStickyAddToCart(true, false, true, true), true);
});

test("sticky purchase control waits for the primary control to enter the viewport", () => {
  assert.equal(shouldShowStickyAddToCart(true, false, true, false), false);
});

test("sticky purchase control treats a primary control passed above the viewport as encountered", () => {
  assert.equal(shouldMarkPrimaryAsEncountered(false, false, 100), false);
  assert.equal(shouldMarkPrimaryAsEncountered(false, false, -1), true);
  assert.equal(shouldMarkPrimaryAsEncountered(false, true, 100), true);
  assert.equal(shouldMarkPrimaryAsEncountered(true, false, 100), true);
});
