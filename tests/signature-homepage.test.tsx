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

test("homepage hero keeps its interactive state boundary and only preloads the initial slide", () => {
  const source = readFileSync(resolve("src/components/home/HomepageHero.tsx"), "utf8");

  assert.match(source, /^"use client";/);
  assert.match(source, /preload=\{index === 0\}/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /setActiveSlide/);
});
