import assert from "node:assert/strict";
import test from "node:test";
import {
  FOOTER_GROUPS,
  HEADER_LINKS,
  HEADER_MENUS,
} from "../src/lib/storefront/navigation";

test("storefront navigation exposes every approved discovery route", () => {
  assert.deepEqual(HEADER_MENUS.map(({ id, label }) => [id, label]), [
    ["shop", "Shop"],
    ["gifts", "Gifts"],
    ["discover", "Discover"],
  ]);
  const hrefs = [
    ...HEADER_MENUS.flatMap((menu) => menu.links.map((link) => link.href)),
    ...HEADER_LINKS.map((link) => link.href),
  ];
  for (const href of [
    "/collections/new-arrivals",
    "/gifts",
    "/pearls/care",
    "/pearls/how-to-wear",
    "/pearls/freshwater-pearls",
    "/guardian-quiz",
    "/about",
  ]) assert.ok(hrefs.includes(href), href);
});

test("footer groups are Shop, Learn, About, and Help", () => {
  assert.deepEqual(FOOTER_GROUPS.map((group) => group.label), [
    "Shop",
    "Learn",
    "About",
    "Help",
  ]);
  assert.deepEqual(FOOTER_GROUPS[0].links[0], {
    label: "The Pearl Edit",
    href: "/collections/pearl-series",
  });
  assert.ok(FOOTER_GROUPS[1].links.some(({ href }) => href === "/faq"));
  assert.equal(FOOTER_GROUPS[3].links.some(({ href }) => href === "/faq"), false);
});

test("retired collections never return to public navigation", () => {
  const navigation = JSON.stringify({ HEADER_MENUS, HEADER_LINKS, FOOTER_GROUPS });
  assert.doesNotMatch(navigation, /balance\s*&\s*light|serenity collection|crystal/i);
});
