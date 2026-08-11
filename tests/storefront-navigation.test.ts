import assert from "node:assert/strict";
import test from "node:test";
import {
  FOOTER_GROUPS,
  HEADER_LINKS,
  HEADER_MENUS,
} from "../src/lib/storefront/navigation";

test("storefront navigation exposes the Maverenne public top-level order", () => {
  assert.deepEqual(HEADER_MENUS.map(({ id, label }) => ({ id, label })), [
    { id: "shop", label: "Shop" },
    { id: "gifts", label: "Gifts" },
    { id: "discover", label: "Discover" },
  ]);
  assert.ok(
    HEADER_MENUS.find(({ id }) => id === "shop")?.links.some(
      ({ href }) => href === "/collections/pearl-series",
    ),
  );
  assert.ok(
    HEADER_MENUS.find(({ id }) => id === "gifts")?.links.some(
      ({ href }) => href === "/gifts#gift-help",
    ),
  );
  assert.ok(
    HEADER_MENUS.find(({ id }) => id === "discover")?.links.some(
      ({ href }) => href === "/pearls/care",
    ),
  );
  assert.deepEqual(HEADER_LINKS, []);
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
