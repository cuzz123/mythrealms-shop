import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { EditorialHero } from "../src/components/editorial/EditorialHero";
import { EditorialLinkBand } from "../src/components/editorial/EditorialLinkBand";
import { GuideLayout } from "../src/components/editorial/GuideLayout";
import { RelatedProducts } from "../src/components/editorial/RelatedProducts";
import { PEARL_GUIDES } from "../src/lib/editorial/guides";
import { getStorefrontProducts } from "../src/lib/storefront/catalog";

test("editorial hero renders its image, heading, and optional actions", () => {
  const html = renderToStaticMarkup(
    createElement(EditorialHero, {
      eyebrow: "Pearl Guide",
      title: "Pearl Care",
      description: "A direct answer about pearl care.",
      image: { src: "/care.jpg", alt: "Pearls laid on a soft cloth" },
      primaryAction: { label: "Read the guide", href: "#guide" },
      secondaryAction: { label: "Shop pearls", href: "/collections/pearl-series" },
    }),
  );

  assert.match(html, /<h1[^>]*>Pearl Care<\/h1>/);
  assert.match(html, /alt="Pearls laid on a soft cloth"/);
  assert.match(html, /href="#guide"/);
  assert.match(html, /href="\/collections\/pearl-series"/);
});

test("editorial hero reserves following-content space at common viewports", () => {
  const html = renderToStaticMarkup(
    createElement(EditorialHero, {
      eyebrow: "Pearl Guide",
      title: "Pearl Care",
      description: "A direct answer about pearl care.",
      image: { src: "/care.jpg", alt: "Pearls laid on a soft cloth" },
    }),
  );

  assert.match(html, /h-\[min\(35rem,calc\(100svh-13rem\)\)\]/);
  assert.match(html, /min-h-\[30rem\]/);
  assert.match(html, /sm:h-\[min\(42rem,calc\(100svh-12rem\)\)\]/);
  assert.match(html, /sm:min-h-\[32rem\]/);
  assert.doesNotMatch(html, /680px/);

  const fixedChromeHeight = 64 + 56;
  const mobileFollowingContent = 800 - fixedChromeHeight - 35 * 16;
  const desktopFollowingContent = 900 - fixedChromeHeight - 42 * 16;

  assert.equal(mobileFollowingContent, 120);
  assert.equal(desktopFollowingContent, 108);
});

test("guide layout keeps its visible editorial sections in the approved order", () => {
  const product = getStorefrontProducts()[0];
  assert.ok(product);

  const html = renderToStaticMarkup(
    createElement(GuideLayout, {
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Pearl Care", href: "/pearls/care" },
      ],
      guide: PEARL_GUIDES.care,
      relatedGuides: [
        {
          title: "How to Wear Pearls",
          description: "Choose pearl placement and scale.",
          href: "/pearls/how-to-wear",
        },
      ],
      relatedProducts: [product],
    }),
  );

  const breadcrumbIndex = html.indexOf('aria-label="Breadcrumb"');
  const heroIndex = html.indexOf("Put pearls on after cosmetics");
  const contentsIndex = html.indexOf("Table of contents");
  const articleIndex = html.indexOf("<article");
  const faqIndex = html.indexOf("Frequently asked questions");
  const bylineIndex = html.indexOf("MythRealms Editorial");
  const relatedGuidesIndex = html.indexOf("Related guides");
  const relatedProductsIndex = html.indexOf("Related products");

  assert.ok(breadcrumbIndex >= 0);
  assert.ok(breadcrumbIndex < heroIndex);
  assert.ok(heroIndex < contentsIndex);
  assert.ok(contentsIndex < articleIndex);
  assert.ok(articleIndex < faqIndex);
  assert.ok(faqIndex < bylineIndex);
  assert.ok(bylineIndex < relatedGuidesIndex);
  assert.ok(relatedGuidesIndex < relatedProductsIndex);
  assert.match(html, /<section[^>]*id="daily-routine"/);
  assert.match(html, /<table/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, new RegExp(`href="/products/${product.slug}"`));
  assert.doesNotMatch(html, /路/);
  assert.match(html, /aria-hidden="true"> \/ <\/span>/);
});

test("editorial link band renders exactly two image-led destinations", () => {
  const html = renderToStaticMarkup(
    createElement(EditorialLinkBand, {
      items: [
        {
          label: "Pearl Gift Guide",
          title: "Choose by the way they wear it.",
          copy: "Pearl gifts by price and style.",
          href: "/gifts",
          image: { src: "/gifts.jpg", alt: "Pearl gift edit" },
        },
        {
          label: "Pearl Knowledge",
          title: "Care, styling, and freshwater pearls.",
          copy: "Straight answers about pearl jewelry.",
          href: "/pearls",
          image: { src: "/pearls.jpg", alt: "Pearl jewelry guide" },
          links: [{ label: "Pearl Care", href: "/pearls/care" }],
        },
      ],
    }),
  );

  assert.equal((html.match(/<article/g) ?? []).length, 2);
  assert.match(html, /href="\/gifts"/);
  assert.match(html, /href="\/pearls"/);
  assert.match(html, /href="\/pearls\/care"/);
  assert.match(html, /alt="Pearl gift edit"/);
  assert.match(html, /alt="Pearl jewelry guide"/);
});

test("related products omits unavailable storefront records", () => {
  const product = getStorefrontProducts()[0];
  assert.ok(product);

  const html = renderToStaticMarkup(
    createElement(RelatedProducts, {
      products: [{ ...product, inStock: false }, product],
    }),
  );

  assert.equal((html.match(new RegExp(`/products/${product.slug}`, "g")) ?? []).length, 1);
});
