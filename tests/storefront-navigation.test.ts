import assert from "node:assert/strict";
import test from "node:test";
import {
  FOOTER_GROUPS,
  HEADER_LINKS,
  HEADER_MENUS,
} from "../src/lib/storefront/navigation";

test("storefront navigation exposes the Maverenne public top-level order", () => {
  assert.deepEqual(HEADER_MENUS, []);
  assert.deepEqual(HEADER_LINKS.map(({ label }) => label), [
    "New",
    "Jewelry",
    "The Pearl Edit",
    "Gifts",
    "Journal",
    "About",
  ]);
  assert.deepEqual(HEADER_LINKS.map(({ href }) => href), [
    "/collections/new-arrivals",
    "/collections",
    "/collections/pearl-series",
    "/gifts",
    "/blog",
    "/about",
  ]);
});

test("public navigation serializations omit Guardian", () => {
  const navigation = JSON.stringify({ HEADER_MENUS, HEADER_LINKS, FOOTER_GROUPS });
  assert.doesNotMatch(navigation, /Guardian/);
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
