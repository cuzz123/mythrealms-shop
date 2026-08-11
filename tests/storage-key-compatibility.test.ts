import assert from "node:assert/strict";
import test from "node:test";

import {
  createPurchaseTrackingController,
  trackPurchase,
  type TrackingPlatform,
} from "../src/lib/tracking";
import { reportAiReferralOnce } from "../src/lib/analytics/referral";
import type { ConsentState } from "../src/lib/analytics/consent";
import { shouldShowFirstOrderInvitationFromStorage } from "../src/components/growth/FirstOrderInvitation";

class MemoryStorage implements Storage {
  readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

test("cart and wishlist rehydrate state already stored under the established namespaces", async () => {
  const storage = new MemoryStorage();
  storage.setItem("mythrealms-cart", JSON.stringify({
    state: {
      items: [{
        product: {
          id: "existing-cart-item",
          name: "Existing cart item",
          slug: "existing-cart-item",
          image: "/existing-cart-item.jpg",
          price: 48,
        },
        quantity: 2,
      }],
    },
    version: 0,
  }));
  storage.setItem("mythrealms-wishlist", JSON.stringify({
    state: {
      items: [{
        id: "existing-wishlist-item",
        name: "Existing wishlist item",
        slug: "existing-wishlist-item",
        image: "/existing-wishlist-item.jpg",
        price: 52,
      }],
    },
    version: 0,
  }));
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: storage },
  });

  try {
    const [{ useCartStore }, { useWishlistStore }] = await Promise.all([
      import("../src/lib/cart"),
      import("../src/lib/wishlist"),
    ]);

    assert.equal(useCartStore.getState().itemCount(), 2);
    assert.equal(useCartStore.getState().items[0]?.product.id, "existing-cart-item");
    assert.equal(useWishlistStore.getState().count(), 1);
    assert.equal(useWishlistStore.getState().isWishlisted("existing-wishlist-item"), true);
  } finally {
    Reflect.deleteProperty(globalThis, "window");
  }
});

test("established invitation cooldown and session storage suppress another invitation", () => {
  const localStorage = new MemoryStorage();
  const sessionStorage = new MemoryStorage();
  const now = Date.UTC(2026, 7, 11);
  localStorage.setItem(
    "mythrealms:first-order-invitation-dismissed-at",
    String(now - 13 * 24 * 60 * 60 * 1000),
  );
  assert.equal(shouldShowFirstOrderInvitationFromStorage({ now, localStorage, sessionStorage }), false);

  localStorage.clear();
  sessionStorage.setItem("mythrealms:first-order-invitation-shown", "true");
  assert.equal(shouldShowFirstOrderInvitationFromStorage({ now, localStorage, sessionStorage }), false);
});

test("an established referral marker suppresses the same event after a refresh", () => {
  const sessionStorage = new MemoryStorage();
  sessionStorage.setItem("mythrealms-ai-referral-tracked", "1");
  const calls: unknown[][] = [];

  const reported = reportAiReferralOnce({
    locationHref: "https://www.maverenne.com/?utm_source=chatgpt.com",
    sessionStorage,
    gtag: (...args: unknown[]) => calls.push(args),
    dedupe: { current: false },
  });

  assert.equal(reported, false);
  assert.deepEqual(calls, []);
});

test("established purchase markers suppress every platform event after a refresh", () => {
  const storage = new MemoryStorage();
  const orderId = "existing-paid-order";
  for (const platform of ["ga", "meta", "pinterest"] satisfies TrackingPlatform[]) {
    storage.setItem(`mythrealms:purchase-tracked:${orderId}:${platform}`, "true");
  }
  const calls = { ga: 0, meta: 0, pinterest: 0 };
  const consent: ConsentState = { analytics: true, marketing: true };
  const target = new EventTarget();
  const controller = createPurchaseTrackingController({
    target,
    storage,
    orderId,
    track: (completed) => trackPurchase(
      orderId,
      58,
      [{ id: "existing-item", name: "Existing item", price: 58, quantity: 1 }],
      {
        gtag: () => calls.ga++,
        fbq: () => calls.meta++,
        pintrk: () => calls.pinterest++,
      },
      consent,
      { ga: true, meta: true, pinterest: true },
      completed,
    ),
  });

  controller.start();
  controller.cleanup();

  assert.deepEqual(calls, { ga: 0, meta: 0, pinterest: 0 });
});
