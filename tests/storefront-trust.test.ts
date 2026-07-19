import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

function source(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("the storefront does not render fabricated purchase activity", () => {
  assert.doesNotMatch(source("src/components/layout/LayoutShell.tsx"), /SocialProof/);
  assert.equal(existsSync(path.join(process.cwd(), "src/components/ui/SocialProof.tsx")), false);
});

test("editorial hero imagery is not presented as a specific SKU", () => {
  const hero = source("src/components/home/HomepageHero.tsx");
  assert.doesNotMatch(hero, /On her\s*\//i);
  assert.doesNotMatch(hero, /The Soft Return Earrings/i);
  assert.match(hero, /Editorial/i);
});

test("product galleries disclose editorial images and organization data avoids pearl-type expertise claims", () => {
  const product = source("src/app/products/[slug]/1688-product.tsx");
  const jsonLd = source("src/components/ui/JsonLd.tsx");

  assert.match(
    product,
    /Supplier-supplied product views appear first\. Later editorial scenes may be AI-generated; refer to the first views for product shape and details\./,
  );
  assert.doesNotMatch(jsonLd, /Freshwater pearls/);
});

test("homepage hero reserves a fixed category-story reveal", () => {
  const hero = source("src/components/home/HomepageHero.tsx");
  assert.match(hero, /\[--homepage-category-reveal:10rem\]/);
  assert.match(hero, /min-h-\[calc\(100svh-2\.25rem-var\(--homepage-category-reveal\)\)\]/);
});

test("homepage category stories defer image motion", () => {
  const stories = source("src/components/home/HomepageCategoryStories.tsx");
  assert.doesNotMatch(stories, /transition-transform|duration-500|group-hover:scale/);
});

test("global storefront styles exclude unused decorative motion", () => {
  const styles = source("src/app/globals.css");
  assert.doesNotMatch(
    styles,
    /(?:@keyframes (?:twinkle1|twinkle2|fadeInUp|pulseDot|bounceDown|slideInContent|subtleZoom|progressFill|zoomFade|heroContentIn|paintAcross|riseUp|modalOpen)|\.animate-(?:slideInContent|subtle-zoom|paint-across|rise-up|modal-open|slide-in-right))/,
  );
});

test("product cards use explicit neutral alternate media without model claims", () => {
  const card = source("src/components/product/ProductCard.tsx");
  assert.doesNotMatch(card, /images\[1\]/);
  assert.doesNotMatch(card, /includes\(["']-worn\./);
  assert.doesNotMatch(card, /imageRoles\?\.wearing/);
  assert.match(card, /imageRoles\?\.alternate/);
  assert.match(card, /alternate product view/i);
  assert.doesNotMatch(card, /on[- ]model/i);
});

test("the legacy loyalty route is noindex and makes no unimplemented reward promises", () => {
  const loyalty = source("src/app/loyalty/page.tsx");
  assert.match(loyalty, /index:\s*false/);
  assert.match(loyalty, /redirect\(["']\/account["']\)/);
  assert.doesNotMatch(loyalty, /new stones|100 points|5% off|10% off/i);
});

test("about relies on the shared main landmark", () => {
  assert.doesNotMatch(source("src/app/about/page.tsx"), /<\/?main(?:\s|>)/);
});

test("cart quantity and removal controls have product-specific accessible names", () => {
  const cart = source("src/app/cart/page.tsx");
  assert.match(cart, /aria-label={`Decrease quantity for \$\{item\.product\.name\}`}/);
  assert.match(cart, /aria-label={`Increase quantity for \$\{item\.product\.name\}`}/);
  assert.match(cart, /aria-label={`Remove \$\{item\.product\.name\} from cart`}/);
});

test("search prompts only for merchandise available in the pearl catalog", () => {
  const search = source("src/components/layout/SearchOverlay.tsx");
  assert.match(search, /placeholder="Search pearl jewelry/);
  assert.doesNotMatch(search, /stones|apparel/i);
});
