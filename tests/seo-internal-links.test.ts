import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  getPurchaseGuideForProductType,
  PURCHASE_GUIDE_BY_PRODUCT_TYPE,
} from "../src/lib/seo/product-guides";
import { FOOTER_GROUPS } from "../src/lib/storefront/navigation";

const expectedGuides = {
  earrings: {
    href: "/pearls/how-to-choose-pearl-earrings",
    label: "How to choose pearl earrings",
  },
  necklaces: {
    href: "/pearls/pearl-necklace-length-guide",
    label: "How to choose a pearl necklace length",
  },
  bracelets: {
    href: "/pearls/bracelet-size-and-fit-guide",
    label: "How to choose a pearl bracelet size",
  },
  rings: { href: "/pearls", label: "Read the Pearl Guide" },
  "hair-accessories": { href: "/pearls", label: "Read the Pearl Guide" },
  "eyewear-chains": { href: "/pearls", label: "Read the Pearl Guide" },
} as const;

test("every storefront product type maps to one live purchase guide", () => {
  for (const [productType, expected] of Object.entries(expectedGuides)) {
    assert.deepEqual(
      getPurchaseGuideForProductType(productType as keyof typeof expectedGuides),
      expected,
    );
  }

  assert.deepEqual(PURCHASE_GUIDE_BY_PRODUCT_TYPE, expectedGuides);
  assert.doesNotMatch(
    JSON.stringify(PURCHASE_GUIDE_BY_PRODUCT_TYPE),
    /how-to-wear-pearl-hair-accessories|how-to-choose-a-glasses-chain|pearl-jewelry-buying-checklist/,
  );
});

test("size guide is exposed through crawlable site navigation", () => {
  const navigation = JSON.stringify(FOOTER_GROUPS);
  assert.match(navigation, /"href":"\/size-guide"/);
});

test("product Learn area renders exactly one mapped guide link", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/products/[slug]/1688-product.tsx"),
    "utf8",
  );
  const learningLinks = source.match(/function LearningLinks\([\s\S]*?\n}\n\nexport function Product1688/);

  assert.ok(learningLinks, "could not locate the product Learn link component");
  assert.equal((learningLinks[0].match(/<Link\b/g) || []).length, 5);
  for (const existingGuide of [
    "/pearls/care",
    "/pearls/how-to-wear",
    "/pearls/freshwater-pearls",
    "/gifts",
  ]) {
    assert.match(learningLinks[0], new RegExp(`href=\"${existingGuide}\"`));
  }
  assert.equal((learningLinks[0].match(/href=\{guide\.href\}/g) || []).length, 1);
  assert.match(learningLinks[0], /getPurchaseGuideForProductType/);
  assert.match(source, /<LearningLinks productType=\{productType\} \/>/);
});
