import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_GIFT_NOTE_LENGTH,
  normalizeGiftNote,
  useCartStore,
} from "../src/lib/cart";
import { buildBeginCheckoutPayload } from "../src/lib/tracking";

const pearl = {
  id: "1688-001",
  name: "Pearl Drop Earrings",
  slug: "pearl-drop-earrings",
  image: "/images/pearl-drop-earrings.jpg",
  price: 29.99,
};

test("normalizes a gift note before cart storage", () => {
  assert.equal(normalizeGiftNote("  For Ada  "), "For Ada");
  assert.equal(normalizeGiftNote("   "), undefined);
  assert.equal(
    normalizeGiftNote("a".repeat(MAX_GIFT_NOTE_LENGTH + 12)),
    "a".repeat(MAX_GIFT_NOTE_LENGTH),
  );
});

test("gift notes preserve cart subtotal and only change through cart editing", () => {
  const store = useCartStore.getState();
  store.clearCart();

  store.addItem(pearl, 1, "  First note  ");
  store.addItem(pearl, 2, "Replacement note");

  let state = useCartStore.getState();
  assert.equal(state.items.length, 1);
  assert.equal(state.items[0].quantity, 3);
  assert.equal(state.items[0].giftNote, "First note");
  assert.equal(state.subtotal(), 89.97);

  state.setGiftNote(pearl.id, undefined, "  Cart note  ");
  state = useCartStore.getState();
  assert.equal(state.items[0].giftNote, "  Cart note  ");

  state.commitGiftNote(pearl.id, undefined);
  state = useCartStore.getState();
  assert.equal(state.items[0].giftNote, "Cart note");
  assert.equal(state.subtotal(), 89.97);

  state.setGiftNote(pearl.id, undefined, " ");
  state.commitGiftNote(pearl.id, undefined);
  assert.equal(useCartStore.getState().items[0].giftNote, undefined);
  useCartStore.getState().clearCart();
});

test("preserves a typed space until a multiword gift note is committed", () => {
  const store = useCartStore.getState();
  store.clearCart();
  store.addItem(pearl);

  store.setGiftNote(pearl.id, undefined, "For ");
  assert.equal(useCartStore.getState().items[0].giftNote, "For ");

  useCartStore.getState().setGiftNote(pearl.id, undefined, "For Ada");
  useCartStore.getState().commitGiftNote(pearl.id, undefined);
  assert.equal(useCartStore.getState().items[0].giftNote, "For Ada");
  useCartStore.getState().clearCart();
});

test("checkout analytics serialization never contains private gift note text", () => {
  const secret = "For Ada - private message";
  const cartItem = { ...pearl, quantity: 1, giftNote: secret };
  const payload = buildBeginCheckoutPayload(
    [cartItem],
    pearl.price,
  );

  assert.doesNotMatch(JSON.stringify(payload), new RegExp(secret));
});
