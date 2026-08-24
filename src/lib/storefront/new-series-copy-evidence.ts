/**
 * Review manifest for the New Series copy.
 *
 * These terms record only visible shape, colour, and arrangement evidence
 * from the product galleries. The storefront copy does not import this file;
 * keeping the manifest separate prevents the review contract from becoming a
 * source of product content.
 */
export type NewSeriesCopyEvidence = Readonly<{
  productType:
    | "rings"
    | "bracelets"
    | "earrings"
    | "necklaces"
    | "eyewear-chains"
    | "hair-accessories";
  visibleTerms: readonly string[];
}>;

export const NEW_SERIES_COPY_EVIDENCE: Readonly<
  Record<string, NewSeriesCopyEvidence>
> = {
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
    visibleTerms: ["irregular luminous white drops", "smooth round hoops", "uneven lower shapes", "warm gold-toned color"],
  },
  "new-series-purple-gem-pearl-drops": {
    productType: "earrings",
    visibleTerms: ["milky oval center", "saturated violet border", "small reflective points", "round violet stud"],
  },
  "new-series-white-petal-flower-earrings": {
    productType: "earrings",
    visibleTerms: ["four rounded white petals", "small luminous bead", "simple symmetry", "floral outline"],
  },
  "new-series-mother-of-pearl-cluster-earrings": {
    productType: "earrings",
    visibleTerms: ["layered pale petal forms", "small bead grouping", "round lower charm", "clustered drop"],
  },
  "new-series-white-shell-triple-drops": {
    productType: "earrings",
    visibleTerms: ["three pale round shell-like discs", "warm gold-toned edge", "vertical drop", "repeated circles"],
  },
  "new-series-round-shell-disc-drops": {
    productType: "earrings",
    visibleTerms: ["dark green-gray upper discs", "iridescent lower discs", "small pale bead clusters", "round surfaces"],
  },
  "new-series-pearl-jade-bracelet": {
    productType: "bracelets",
    visibleTerms: ["irregular pearl-like white beads", "smooth green oval accent", "warm gold-toned links", "pale rhythm"],
  },
  "new-series-purple-gem-bangle": {
    productType: "bracelets",
    visibleTerms: ["faceted purple center", "pale round accents", "open warm gold-toned bangle", "straight rails"],
  },
  "new-series-shell-twist-pearl-cuff": {
    productType: "bracelets",
    visibleTerms: ["smooth pale round forms", "one irregular shell-like accent", "coiled gold-toned line", "open arc"],
  },
  "new-series-leaf-turquoise-pearl-cuff": {
    productType: "bracelets",
    visibleTerms: ["turquoise-colored round accents", "pale irregular center", "looping gold-toned cuff", "middle sweep"],
  },
  "new-series-leaf-pearl-bracelet": {
    productType: "bracelets",
    visibleTerms: ["pearl-like white beads", "open leaf-shaped gold-toned forms", "repeating wrist line", "open leaf"],
  },
  "new-series-round-shell-gold-cuff": {
    productType: "bracelets",
    visibleTerms: ["pale bead accents", "leaf- and shell-shaped", "gold-toned forms", "rounded centers"],
  },
  "new-series-purple-stone-pendant-necklace": {
    productType: "necklaces",
    visibleTerms: ["faceted purple stone-like shape", "rounded gold-toned frame", "dark, mauve, and smoky beads", "ornate connectors"],
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
    visibleTerms: ["chain fine at the shoulders", "pearl-like beads", "small openwork medallion", "long central drop"],
  },
  "new-series-pearl-drop-choker": {
    productType: "necklaces",
    visibleTerms: ["row of small pearl-like beads", "slim chain drops", "fringe edge", "different drop lengths"],
  },
  "new-series-multi-strand-pearl-choker": {
    productType: "necklaces",
    visibleTerms: ["fine gold-toned chain", "many strands of pearl-like beads", "varied lengths", "cascading lines"],
  },
  "new-series-black-drop-pearl-choker": {
    productType: "necklaces",
    visibleTerms: ["pale close-set bead line", "fine gold-toned chains", "pointed front fringe", "descending chain lengths"],
  },
  "new-series-pearl-glasses-chain": {
    productType: "eyewear-chains",
    visibleTerms: ["rounded pearl-like beads", "fine gold-toned chain", "clear loops for glasses", "beaded sections"],
  },
  "new-series-shell-drop-glasses-chain": {
    productType: "eyewear-chains",
    visibleTerms: ["small fan-shaped shell-like pendant", "slim gold-toned chain", "clear loops", "scalloped edges"],
  },
  "new-series-classic-pearl-chain": {
    productType: "eyewear-chains",
    visibleTerms: ["evenly spaced pearl-like beads", "slim gold-toned line", "clear glasses loops", "front section"],
  },
  "new-series-turquoise-bead-chain": {
    productType: "eyewear-chains",
    visibleTerms: ["fine gold-toned line", "two vertical groups", "turquoise-colored beads", "clear loops"],
  },
  "new-series-white-floral-hair-stick": {
    productType: "hair-accessories",
    visibleTerms: ["white many-petaled flower", "slim gold-toned stick", "cool blue-green round center", "long straight line"],
  },
  "new-series-white-flower-wood-stick": {
    productType: "hair-accessories",
    visibleTerms: ["dark wood-toned curved stick", "small white flower", "pearl-like hanging accent", "brown and ivory"],
  },
  "new-series-pearl-cluster-hair-claw": {
    productType: "hair-accessories",
    visibleTerms: ["irregular white pearl-like forms", "dense flower-like top", "gold-toned claw base", "rounded and petal-shaped pieces"],
  },
  "new-series-gold-pearl-hair-stick": {
    productType: "hair-accessories",
    visibleTerms: ["long, slim gold-toned stick", "elongated pearl-like accent", "small open floral connector", "straight body"],
  },
  "new-series-pearl-flower-u-pin": {
    productType: "hair-accessories",
    visibleTerms: ["five-petal flower", "rounded pearl-like center", "circular ring of small pale accents", "two long prongs"],
  },
  "new-series-pearl-bar-hair-clip": {
    productType: "hair-accessories",
    visibleTerms: ["three flower-like clusters", "gold-toned bar", "warmer center", "short floral band"],
  },
  "new-series-shell-chip-hair-clip": {
    productType: "hair-accessories",
    visibleTerms: ["irregular pale shell-like pieces", "small rounded bead accents", "open gold-toned filigree base", "uneven petal shapes"],
  },
  "new-series-wood-flower-hair-stick": {
    productType: "hair-accessories",
    visibleTerms: ["dark wood-toned stick", "two small floral ornaments", "one pale drop", "long brown base"],
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
    visibleTerms: ["white five-petal flower", "amber-colored center", "branch-like details", "long double-prong base"],
  },
  "new-series-star-flower-hair-clip": {
    productType: "hair-accessories",
    visibleTerms: ["pale pointed flower", "gold-toned bar", "soft pink rounded center", "small bright accents"],
  },
  "new-series-chain-flower-hair-pin": {
    productType: "hair-accessories",
    visibleTerms: ["small rounded cluster", "open rectangular frame", "several fine gold-toned chains", "vertical path"],
  },
  "new-series-flower-pearl-hair-clip": {
    productType: "hair-accessories",
    visibleTerms: ["warm gold-toned bar", "pale irregular forms", "darker rounded accent", "wing-like spread"],
  },
  "new-series-pink-flower-hair-clip": {
    productType: "hair-accessories",
    visibleTerms: ["soft pink and white rounded forms", "compact floral group", "slim gold-toned clip", "small footprint"],
  },
  "new-series-blue-flower-bow-hair-clip": {
    productType: "hair-accessories",
    visibleTerms: ["cool blue-green round accent", "pale petal-like forms", "warm gold-toned bar", "cool-warm contrast"],
  },
  "new-series-blue-teardrop-hair-stick": {
    productType: "hair-accessories",
    visibleTerms: ["round blue center", "small radiating frame", "dark wood-toned stick", "pearl-like drops"],
  },
  "new-series-dragonfly-hair-clip": {
    productType: "hair-accessories",
    visibleTerms: ["pale textured wings", "green oval center", "deep violet round accents", "warm gold-toned body"],
  },
} as const;
