import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { EditorialDivider } from "../src/components/storefront/EditorialDivider";

test("editorial divider is not a product or interactive merchandising card", () => {
  const html = renderToStaticMarkup(
    createElement(EditorialDivider, {
      image: {
        src: "/images/brand/editorial/scene-seaside-stairs.png",
        alt: "Sunlit limestone steps near the sea",
      },
      eyebrow: "Maverenne Notes",
      title: "Made for the life around them.",
      description: "A quiet pause between pieces.",
    }),
  );

  assert.doesNotMatch(html, /<(?:a|button)\b|\$|price|stock/i);
  assert.match(html, /data-editorial-divider="true"/);
});

test("collection inserts its editorial rhythm break while rendering rather than mutating products", () => {
  const source = readFileSync("src/app/collections/[slug]/1688-collection.tsx", "utf8");

  assert.match(source, /import\s+\{\s*EditorialDivider\s*\}/);
  assert.match(source, /products\.length\s*>=\s*12/);
  assert.match(source, /index\s*===\s*7/);
  assert.doesNotMatch(source, /products\.(?:splice|push|unshift)\s*\(/);
});

test("product cards preserve tap-safe mobile controls and reduce hover image motion", () => {
  const source = readFileSync("src/components/product/ProductCard.tsx", "utf8");

  assert.match(source, /max-sm:h-11\s+max-sm:w-11/);
  assert.match(source, /max-sm:top-16/);
  assert.match(source, /motion-reduce:transition-none/);
});
