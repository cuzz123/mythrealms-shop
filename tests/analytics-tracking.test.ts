import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test, { afterEach } from "node:test";

import * as trackingModule from "../src/lib/tracking";

interface ConsentState {
  analytics: boolean;
  marketing: boolean;
}

interface ConfiguredPlatforms {
  ga: boolean;
  meta: boolean;
  pinterest: boolean;
}

interface TrackingTarget {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  pintrk?: (...args: unknown[]) => void;
}

interface TrackItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  variant?: string;
}

type TrackingApi = {
  buildViewItemPayload: (product: Omit<TrackItem, "quantity">) => unknown;
  buildAddToCartPayload: (product: TrackItem) => unknown;
  buildBeginCheckoutPayload: (items: TrackItem[], value: number) => unknown;
  buildPurchasePayload: (orderId: string, value: number, items: TrackItem[]) => unknown;
  buildViewItemListPayload: (list: { id: string; name: string; items: TrackItem[] }) => unknown;
  buildSelectItemPayload: (list: { id: string; name: string }, product: TrackItem) => unknown;
  buildViewPromotionPayload: (promotion: { id: string; name: string }) => unknown;
  buildSelectPromotionPayload: (promotion: { id: string; name: string }) => unknown;
  buildAddGiftNotePayload: (product: Pick<TrackItem, "id" | "name">) => unknown;
  buildViewEditPayload: (edit: { id: string; name: string }) => unknown;
  trackViewItemList: (list: { id: string; name: string; items: TrackItem[] }, target?: TrackingTarget, consent?: ConsentState, configured?: ConfiguredPlatforms) => boolean;
  trackAddGiftNote: (product: Pick<TrackItem, "id" | "name">, target?: TrackingTarget, consent?: ConsentState, configured?: ConfiguredPlatforms) => boolean;
  trackViewItem: (
    product: Omit<TrackItem, "quantity">,
    target?: TrackingTarget,
    consent?: ConsentState,
    configured?: ConfiguredPlatforms,
  ) => boolean;
  trackAddToCart: (
    product: TrackItem,
    target?: TrackingTarget,
    consent?: ConsentState,
    configured?: ConfiguredPlatforms,
  ) => boolean;
  trackBeginCheckout: (
    items: TrackItem[],
    value: number,
    target?: TrackingTarget,
    consent?: ConsentState,
    configured?: ConfiguredPlatforms,
  ) => boolean;
  trackPurchase: (
    orderId: string,
    value: number,
    items: TrackItem[],
    target?: TrackingTarget,
    consent?: ConsentState,
    configured?: ConfiguredPlatforms,
    completed?: Partial<Record<TrackingPlatform, boolean>>,
  ) => PlatformTrackingResult;
  flushTrackingQueue: (
    platform: "ga" | "meta" | "pinterest",
    target?: TrackingTarget,
    consent?: ConsentState,
  ) => void;
  purchaseStorageKey: (orderId: string, platform: TrackingPlatform) => string;
  createCheckoutTrackingController: (options: {
    target: TrackingEventTarget;
    completion: { current: boolean };
    items: TrackItem[];
    value: number;
    track: (items: TrackItem[], value: number) => boolean;
  }) => TrackingController;
  createPurchaseTrackingController: (options: {
    target: TrackingEventTarget;
    storage: TrackingStorage;
    orderId: string;
    track: (
      completed: Partial<Record<TrackingPlatform, boolean>>,
    ) => PlatformTrackingResult;
  }) => TrackingController;
};

type TrackingPlatform = "ga" | "meta" | "pinterest";
type PlatformTrackingStatus = "accepted" | "complete" | "denied" | "disabled" | "failed";
type PlatformTrackingResult = Record<TrackingPlatform, PlatformTrackingStatus>;

interface TrackingController {
  start(): void;
  cleanup(): void;
}

type TrackingListener = () => void;

interface TrackingEventTarget {
  addEventListener(type: string, listener: TrackingListener): void;
  removeEventListener(type: string, listener: TrackingListener): void;
}

interface TrackingStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

class FakeTrackingEventTarget implements TrackingEventTarget {
  readonly added: Array<{ type: string; listener: TrackingListener }> = [];
  readonly removed: Array<{ type: string; listener: TrackingListener }> = [];

  addEventListener(type: string, listener: TrackingListener) {
    this.added.push({ type, listener });
  }

  removeEventListener(type: string, listener: TrackingListener) {
    this.removed.push({ type, listener });
  }

  dispatch(type: string) {
    for (const entry of [...this.added]) {
      if (
        entry.type === type &&
        !this.removed.some((removed) => removed.listener === entry.listener)
      ) {
        entry.listener();
      }
    }
  }
}

class MemoryTrackingStorage implements TrackingStorage {
  readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const tracking = trackingModule as unknown as TrackingApi;
const allConsent: ConsentState = { analytics: true, marketing: true };
const noConsent: ConsentState = { analytics: false, marketing: false };
const allConfigured: ConfiguredPlatforms = { ga: true, meta: true, pinterest: true };

function source(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

afterEach(() => {
  if (typeof tracking.flushTrackingQueue !== "function") return;
  const sink: Required<TrackingTarget> = {
    gtag: () => {},
    fbq: () => {},
    pintrk: () => {},
  };
  tracking.flushTrackingQueue("ga", sink, allConsent);
  tracking.flushTrackingQueue("meta", sink, allConsent);
  tracking.flushTrackingQueue("pinterest", sink, allConsent);
});

test("builds an exact GA4 view_item payload for one product", () => {
  assert.deepEqual(
    tracking.buildViewItemPayload({
      id: "pearl_1",
      name: "Stillwater Pearl",
      price: 29.5,
      category: "Pearls",
      variant: "silver",
    }),
    {
      currency: "USD",
      value: 29.5,
      items: [
        {
          item_id: "pearl_1",
          item_name: "Stillwater Pearl",
          price: 29.5,
          item_category: "Pearls",
          item_variant: "silver",
        },
      ],
    },
  );
});

test("builds add_to_cart value from price times quantity", () => {
  assert.deepEqual(
    tracking.buildAddToCartPayload({
      id: "pearl_2",
      name: "Moon Pearl",
      price: 18.25,
      quantity: 3,
      variant: "large",
    }),
    {
      currency: "USD",
      value: 54.75,
      items: [
        {
          item_id: "pearl_2",
          item_name: "Moon Pearl",
          price: 18.25,
          quantity: 3,
          item_variant: "large",
        },
      ],
    },
  );
});

test("builds begin_checkout with every item", () => {
  const items: TrackItem[] = [
    { id: "pearl_1", name: "Stillwater Pearl", price: 29.5, quantity: 1 },
    { id: "pearl_2", name: "Moon Pearl", price: 18.25, quantity: 2, variant: "large" },
  ];

  assert.deepEqual(tracking.buildBeginCheckoutPayload(items, 66), {
    currency: "USD",
    value: 66,
    items: [
      { item_id: "pearl_1", item_name: "Stillwater Pearl", price: 29.5, quantity: 1 },
      {
        item_id: "pearl_2",
        item_name: "Moon Pearl",
        price: 18.25,
        quantity: 2,
        item_variant: "large",
      },
    ],
  });
});

test("builds purchase with a transaction ID", () => {
  const items: TrackItem[] = [
    { id: "pearl_1", name: "Stillwater Pearl", price: 29.5, quantity: 2 },
  ];

  assert.deepEqual(tracking.buildPurchasePayload("order_123", 59, items), {
    transaction_id: "order_123",
    currency: "USD",
    value: 59,
    items: [
      { item_id: "pearl_1", item_name: "Stillwater Pearl", price: 29.5, quantity: 2 },
    ],
  });
});

test("builds growth payloads without gift note or email content", () => {
  const product = { id: "pearl_3", name: "Daylight Pearl", price: 38, quantity: 1 };
  const list = { id: "complements:pearl_1", name: "Complete the edit", items: [product] };

  assert.deepEqual(tracking.buildViewItemListPayload(list), {
    item_list_id: "complements:pearl_1",
    item_list_name: "Complete the edit",
    items: [{ item_id: "pearl_3", item_name: "Daylight Pearl", price: 38, quantity: 1 }],
  });
  assert.deepEqual(tracking.buildSelectItemPayload(list, product), {
    item_list_id: "complements:pearl_1",
    item_list_name: "Complete the edit",
    items: [{ item_id: "pearl_3", item_name: "Daylight Pearl", price: 38, quantity: 1 }],
  });
  assert.deepEqual(tracking.buildViewPromotionPayload({ id: "free-shipping", name: "Free shipping progress" }), {
    promotion_id: "free-shipping",
    promotion_name: "Free shipping progress",
  });
  assert.deepEqual(tracking.buildSelectPromotionPayload({ id: "free-shipping", name: "Free shipping progress" }), {
    promotion_id: "free-shipping",
    promotion_name: "Free shipping progress",
  });
  assert.deepEqual(tracking.buildAddGiftNotePayload(product), {
    item_id: "pearl_3",
    item_name: "Daylight Pearl",
  });
  assert.deepEqual(tracking.buildViewEditPayload({ id: "everyday-light", name: "Everyday Light" }), {
    edit_id: "everyday-light",
    edit_name: "Everyday Light",
  });

  const serialized = JSON.stringify([
    tracking.buildAddGiftNotePayload(product),
    tracking.buildViewItemListPayload(list),
  ]);
  assert.doesNotMatch(serialized, /private|note|email/i);
});

test("growth events do not dispatch or queue when analytics consent is denied", () => {
  const gaOnly: ConfiguredPlatforms = { ga: true, meta: false, pinterest: false };
  const calls: unknown[][] = [];
  const list = {
    id: "complements:pearl_1",
    name: "Complete the edit",
    items: [{ id: "pearl_3", name: "Daylight Pearl", price: 38, quantity: 1 }],
  };

  assert.equal(tracking.trackViewItemList(list, { gtag: (...args) => calls.push(args) }, noConsent, gaOnly), false);
  assert.equal(tracking.trackAddGiftNote({ id: "pearl_3", name: "Daylight Pearl" }, {}, noConsent, gaOnly), false);
  tracking.flushTrackingQueue("ga", { gtag: (...args) => calls.push(args) }, allConsent);

  assert.deepEqual(calls, []);
});

test("dispatches Meta and Pinterest independently when GA is absent", () => {
  const metaCalls: unknown[][] = [];
  const pinterestCalls: unknown[][] = [];
  const target: TrackingTarget = {
    fbq: (...args) => metaCalls.push(args),
    pintrk: (...args) => pinterestCalls.push(args),
  };

  const accepted = tracking.trackAddToCart(
    { id: "pearl_2", name: "Moon Pearl", price: 18.25, quantity: 2 },
    target,
    allConsent,
    allConfigured,
  );

  assert.equal(accepted, true);
  assert.deepEqual(metaCalls, [
    [
      "track",
      "AddToCart",
      {
        content_ids: ["pearl_2"],
        content_name: "Moon Pearl",
        content_type: "product",
        currency: "USD",
        value: 36.5,
      },
    ],
  ]);
  assert.deepEqual(pinterestCalls, [
    [
      "track",
      "addtocart",
      {
        currency: "USD",
        value: 36.5,
        product_id: "pearl_2",
        product_name: "Moon Pearl",
        order_quantity: 2,
      },
    ],
  ]);
});

test("queues two identical add-to-cart transactions independently", () => {
  const product = { id: "pearl_queue", name: "Queued Pearl", price: 40, quantity: 1 };
  const gaOnly: ConfiguredPlatforms = { ga: true, meta: false, pinterest: false };

  assert.equal(
    tracking.trackAddToCart(product, {}, allConsent, gaOnly),
    true,
  );
  assert.equal(
    tracking.trackAddToCart(product, {}, allConsent, gaOnly),
    true,
  );

  const gaCalls: unknown[][] = [];
  tracking.flushTrackingQueue("ga", { gtag: (...args) => gaCalls.push(args) }, allConsent);

  assert.equal(gaCalls.length, 2);
});

test("deduplicates true idempotent retries while a platform is unavailable", () => {
  const product = { id: "view_retry", name: "Retry Pearl", price: 40 };
  const gaOnly: ConfiguredPlatforms = { ga: true, meta: false, pinterest: false };

  assert.equal(tracking.trackViewItem(product, {}, allConsent, gaOnly), true);
  assert.equal(tracking.trackViewItem(product, {}, allConsent, gaOnly), true);

  const calls: unknown[][] = [];
  tracking.flushTrackingQueue("ga", { gtag: (...args) => calls.push(args) }, allConsent);
  tracking.flushTrackingQueue("ga", { gtag: (...args) => calls.push(args) }, allConsent);

  assert.equal(calls.length, 1);
});

test("drops queued events when consent is revoked before platform readiness", () => {
  const gaOnly: ConfiguredPlatforms = { ga: true, meta: false, pinterest: false };
  const product = { id: "revoked_queue", name: "Revoked Pearl", price: 15 };
  const calls: unknown[][] = [];

  assert.equal(tracking.trackViewItem(product, {}, allConsent, gaOnly), true);
  tracking.flushTrackingQueue(
    "ga",
    { gtag: (...args) => calls.push(args) },
    noConsent,
  );
  tracking.flushTrackingQueue(
    "ga",
    { gtag: (...args) => calls.push(args) },
    allConsent,
  );

  assert.deepEqual(calls, []);
});

test("keeps a queued event when an identical live dispatch throws", () => {
  const gaOnly: ConfiguredPlatforms = { ga: true, meta: false, pinterest: false };
  const product = { id: "retry_queue", name: "Retry Pearl", price: 20 };
  const calls: unknown[][] = [];

  assert.equal(tracking.trackViewItem(product, {}, allConsent, gaOnly), true);
  assert.equal(
    tracking.trackViewItem(
      product,
      { gtag: () => { throw new Error("dispatcher unavailable"); } },
      allConsent,
      gaOnly,
    ),
    false,
  );
  tracking.flushTrackingQueue("ga", { gtag: (...args) => calls.push(args) }, allConsent);

  assert.equal(calls.length, 1);
});

test("maps begin checkout to Pinterest checkout", () => {
  const pinterestOnly: ConfiguredPlatforms = { ga: false, meta: false, pinterest: true };
  const calls: unknown[][] = [];
  const items: TrackItem[] = [
    { id: "pearl_1", name: "Stillwater Pearl", price: 29.5, quantity: 1 },
    { id: "pearl_2", name: "Moon Pearl", price: 18.25, quantity: 2 },
  ];

  assert.equal(
    tracking.trackBeginCheckout(
      items,
      66,
      { pintrk: (...args) => calls.push(args) },
      allConsent,
      pinterestOnly,
    ),
    true,
  );
  assert.deepEqual(calls, [
    [
      "track",
      "checkout",
      {
        currency: "USD",
        value: 66,
        product_id: ["pearl_1", "pearl_2"],
        order_quantity: 3,
      },
    ],
  ]);
});

test("does not dispatch or queue GA events when analytics consent is denied", () => {
  const directCalls: unknown[][] = [];
  const product = { id: "ga_denied", name: "Denied Pearl", price: 10 };
  const accepted = tracking.trackViewItem(
    product,
    { gtag: (...args) => directCalls.push(args) },
    { analytics: false, marketing: true },
    allConfigured,
  );
  const queuedCalls: unknown[][] = [];
  tracking.trackViewItem(product, {}, { analytics: false, marketing: true }, allConfigured);
  tracking.flushTrackingQueue("ga", { gtag: (...args) => queuedCalls.push(args) });

  assert.equal(accepted, true, "marketing platforms can still accept the event");
  assert.deepEqual(directCalls, []);
  assert.deepEqual(queuedCalls, []);
});

test("does not dispatch or queue Meta or Pinterest events when marketing consent is denied", () => {
  const metaCalls: unknown[][] = [];
  const pinterestCalls: unknown[][] = [];
  const product = { id: "marketing_denied", name: "Denied Pearl", price: 10, quantity: 1 };
  const accepted = tracking.trackAddToCart(
    product,
    {
      fbq: (...args) => metaCalls.push(args),
      pintrk: (...args) => pinterestCalls.push(args),
    },
    { analytics: true, marketing: false },
    allConfigured,
  );
  tracking.trackAddToCart(product, {}, { analytics: true, marketing: false }, allConfigured);
  tracking.flushTrackingQueue("meta", { fbq: (...args) => metaCalls.push(args) });
  tracking.flushTrackingQueue("pinterest", { pintrk: (...args) => pinterestCalls.push(args) });

  assert.equal(accepted, true, "GA can still accept the event");
  assert.deepEqual(metaCalls, []);
  assert.deepEqual(pinterestCalls, []);
});

test("reports each configured platform denied when no consent is granted", () => {
  assert.deepEqual(
    tracking.trackPurchase(
      "order_denied",
      20,
      [{ id: "pearl_1", name: "Stillwater Pearl", price: 20, quantity: 1 }],
      {},
      noConsent,
      allConfigured,
    ),
    { ga: "denied", meta: "denied", pinterest: "denied" },
  );
});

test("builds stable per-platform purchase storage keys", () => {
  assert.equal(
    tracking.purchaseStorageKey("order_123", "ga"),
    "mythrealms:purchase-tracked:order_123:ga",
  );
  assert.equal(
    tracking.purchaseStorageKey("order_123", "meta"),
    "mythrealms:purchase-tracked:order_123:meta",
  );
});

test("checkout retries after consent is granted and cleans up the exact listener", () => {
  const target = new FakeTrackingEventTarget();
  const completion = { current: false };
  const items = [{ id: "checkout_1", name: "Checkout Pearl", price: 32, quantity: 1 }];
  const calls: Array<{ items: TrackItem[]; value: number }> = [];
  let consentGranted = false;
  const controller = tracking.createCheckoutTrackingController({
    target,
    completion,
    items,
    value: 36.99,
    track: (trackedItems, value) => {
      if (!consentGranted) return false;
      calls.push({ items: trackedItems, value });
      return true;
    },
  });

  controller.start();
  assert.equal(completion.current, false);
  assert.equal(target.added.length, 1);

  consentGranted = true;
  target.dispatch("mythrealms:consent-changed");
  target.dispatch("mythrealms:consent-changed");
  controller.cleanup();

  assert.deepEqual(calls, [{ items, value: 36.99 }]);
  assert.equal(completion.current, true);
  assert.equal(target.removed.length, 1);
  assert.equal(target.removed[0].listener, target.added[0].listener);
});

function purchaseLifecycleFixture(initialConsent: ConsentState) {
  const target = new FakeTrackingEventTarget();
  const storage = new MemoryTrackingStorage();
  const calls = { ga: 0, meta: 0, pinterest: 0 };
  let consent = initialConsent;
  const trackingTarget: TrackingTarget = {
    gtag: () => calls.ga++,
    fbq: () => calls.meta++,
    pintrk: () => calls.pinterest++,
  };
  const items = [{ id: "purchase_1", name: "Purchase Pearl", price: 58, quantity: 1 }];
  const createController = () =>
    tracking.createPurchaseTrackingController({
      target,
      storage,
      orderId: "order_platforms",
      track: (completed) =>
        tracking.trackPurchase(
          "order_platforms",
          58,
          items,
          trackingTarget,
          consent,
          allConfigured,
          completed,
        ),
    });

  return {
    target,
    storage,
    calls,
    createController,
    setConsent(next: ConsentState) {
      consent = next;
    },
  };
}

test("purchase sends analytics first and marketing once after later consent, including refresh", () => {
  const fixture = purchaseLifecycleFixture({ analytics: true, marketing: false });
  const controller = fixture.createController();

  controller.start();
  assert.deepEqual(fixture.calls, { ga: 1, meta: 0, pinterest: 0 });

  fixture.setConsent(allConsent);
  fixture.target.dispatch("mythrealms:consent-changed");
  fixture.target.dispatch("mythrealms:consent-changed");
  assert.deepEqual(fixture.calls, { ga: 1, meta: 1, pinterest: 1 });
  controller.cleanup();

  const refreshed = fixture.createController();
  refreshed.start();
  refreshed.cleanup();
  assert.deepEqual(fixture.calls, { ga: 1, meta: 1, pinterest: 1 });
});

test("purchase sends marketing first and analytics once after later consent, including refresh", () => {
  const fixture = purchaseLifecycleFixture({ analytics: false, marketing: true });
  const controller = fixture.createController();

  controller.start();
  assert.deepEqual(fixture.calls, { ga: 0, meta: 1, pinterest: 1 });

  fixture.setConsent(allConsent);
  fixture.target.dispatch("mythrealms:consent-changed");
  fixture.target.dispatch("mythrealms:consent-changed");
  assert.deepEqual(fixture.calls, { ga: 1, meta: 1, pinterest: 1 });
  controller.cleanup();

  const refreshed = fixture.createController();
  refreshed.start();
  refreshed.cleanup();
  assert.deepEqual(fixture.calls, { ga: 1, meta: 1, pinterest: 1 });
});

test("wires add-to-cart tracking through the cart store", () => {
  const cartSource = source("src/lib/cart.ts");
  assert.match(cartSource, /import \{ trackAddToCart \} from ['\"]@\/lib\/tracking['\"]/);
  assert.match(
    cartSource,
    /addItem: \(product, quantity = 1(?:, giftNote)?\) => \{\s*trackAddToCart\(/,
  );
});

test("flushes only the initializer platform from each analytics Script", () => {
  const analyticsSource = source("src/components/layout/Analytics.tsx");
  assert.match(analyticsSource, /onReady=\{\(\) => flushTrackingQueue\("ga"\)\}/);
  assert.match(analyticsSource, /onReady=\{\(\) => flushTrackingQueue\("meta"\)\}/);
  assert.match(analyticsSource, /onReady=\{\(\) => flushTrackingQueue\("pinterest"\)\}/);
});

test("inline initializers signal an immediate platform-specific flush", () => {
  const analyticsSource = source("src/components/layout/Analytics.tsx");

  for (const platform of ["ga", "meta", "pinterest"]) {
    assert.match(
      analyticsSource,
      new RegExp(`addEventListener\\(TRACKING_READY_EVENTS\\.${platform},`),
    );
    assert.match(
      analyticsSource,
      new RegExp(`dispatchEvent\\(new Event\\('mythrealms:${platform}-ready'\\)\\)`),
    );
  }
});

test("retries product view tracking when consent changes", () => {
  const productSource = source("src/app/products/[slug]/1688-product.tsx");
  assert.match(productSource, /trackViewItem\(/);
  assert.match(productSource, /addEventListener\(CONSENT_CHANGED_EVENT,/);
  assert.match(productSource, /removeEventListener\(CONSENT_CHANGED_EVENT,/);
});

test("checkout page uses the acceptance-aware lifecycle controller", () => {
  const checkoutSource = source("src/app/checkout/page.tsx");
  assert.match(checkoutSource, /checkoutTracked = useRef\(false\)/);
  assert.match(checkoutSource, /createCheckoutTrackingController\(/);
});

test("success tracker delegates per-platform storage and consent retry to its lifecycle controller", () => {
  const trackerSource = source("src/app/checkout/success/tracker.tsx");
  assert.match(trackerSource, /createPurchaseTrackingController\(/);
  assert.match(trackerSource, /trackPurchase\(\s*orderId,\s*value,\s*items/);
  assert.doesNotMatch(trackerSource, /\bw\.(?:gtag|fbq|pintrk)\b/);
});
