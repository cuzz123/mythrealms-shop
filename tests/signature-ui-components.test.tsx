import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { EditorialInlineImage } from "../src/components/editorial/EditorialInlineImage";
import { SectionHeading } from "../src/components/editorial/SectionHeading";
import { SignatureHero } from "../src/components/editorial/SignatureHero";

test("signature hero renders one semantic heading with a decorative index label and full-width image sizing", () => {
  const html = renderToStaticMarkup(
    createElement(SignatureHero, {
      eyebrow: "The Maverenne Edit",
      title: "An enduring silhouette",
      description: "A considered study in light and form.",
      indexLabel: "01",
      image: {
        src: "/signature-hero.jpg",
        alt: "A pearl necklace in soft morning light",
        objectPosition: { base: "50% 40%", md: "50% 50%" },
      },
      primaryAction: { label: "Explore", href: "/collections/pearls" },
      secondaryAction: { label: "Our story", href: "/story" },
    }),
  );

  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /<h1[^>]*>An enduring silhouette<\/h1>/);
  assert.match(html, /aria-hidden="true">01<\/span>/);
  assert.match(html, /sizes="100vw"/);
  assert.match(html, /href="\/collections\/pearls"/);
  assert.match(html, /href="\/story"/);
});

test("section heading presents an editorial section title", () => {
  const html = renderToStaticMarkup(
    createElement(SectionHeading, {
      eyebrow: "Materials",
      title: "Made to be worn often.",
    }),
  );

  assert.match(html, /<h2[^>]*>Made to be worn often\.<\/h2>/);
  assert.match(html, /Materials/);
});

test("editorial inline image stays an in-flow lazy image without interactive or caption wrappers", () => {
  const html = renderToStaticMarkup(
    createElement(EditorialInlineImage, {
      src: "/editorial-detail.jpg",
      alt: "Close view of a pearl clasp",
      width: 1200,
      height: 800,
      sizes: "(max-width: 768px) 100vw, 48rem",
      className: "mt-8",
      imageClassName: "object-cover",
    }),
  );

  assert.match(html, /alt="Close view of a pearl clasp"/);
  assert.match(html, /width="1200"/);
  assert.match(html, /height="800"/);
  assert.match(html, /loading="lazy"/);
  assert.doesNotMatch(html, /<(?:a|button|figcaption)\b/);
});
