import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import HomePage from "../src/app/page";

const HOMEPAGE_MARKERS = [
  "homepage-signature-hero",
  "homepage-category-index",
  "homepage-editorial-diptych",
  "homepage-primary-edit",
  "homepage-story-band",
  "homepage-editorial-links",
  "homepage-secondary-edit",
  "homepage-newsletter-letter",
];

test("homepage renders the signature editorial sequence with one route H1", () => {
  const html = renderToStaticMarkup(createElement(HomePage));
  const positions = HOMEPAGE_MARKERS.map((marker) => html.indexOf(`data-homepage-section=\"${marker}\"`));

  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((left, right) => left - right));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /data-signature-hero=\"true\"/);
});

test("homepage composes exactly one editorial diptych section", () => {
  const html = renderToStaticMarkup(createElement(HomePage));

  assert.equal((html.match(/data-homepage-section=\"homepage-editorial-diptych\"/g) ?? []).length, 1);
});

test("homepage hero source contract keeps client controls mapped to each slide and only preloads slide zero", () => {
  const source = readFileSync(resolve("src/components/home/HomepageHero.tsx"), "utf8");

  assert.match(source, /^"use client";/);
  assert.match(
    source,
    /HOMEPAGE_HERO_SLIDES\.map\(\(slide, index\) => \(\s*<Image[\s\S]*?preload=\{index === 0\}/,
  );
  assert.doesNotMatch(source, /preload=\{(?:true|index !== 0|index >= 0)\}/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(
    source,
    /HOMEPAGE_HERO_SLIDES\.map\(\(slide, index\) => \(\s*<button[\s\S]*?onClick=\{\(\) => setActiveSlide\(index\)\}[\s\S]*?aria-label=\{`Show \$\{slide\.eyebrow\}`\}[\s\S]*?aria-current=\{index === activeSlide\}/,
  );
  assert.match(source, /const hero = HOMEPAGE_HERO_SLIDES\[activeSlide\];/);
});

test("scroll reveals do not reserve a blank first viewport gap", () => {
  const source = readFileSync(resolve("src/components/ui/ScrollRevealEnhancer.tsx"), "utf8");

  assert.match(source, /\{ threshold: 0\.01, rootMargin: "0px" \}/);
  assert.doesNotMatch(source, /threshold: 0\.15, rootMargin: "0px 0px -10% 0px"/);
});
