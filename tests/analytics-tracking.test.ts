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
  trackPurchase: (
    orderId: string,
    value: number,
    items: TrackItem[],
    target?: TrackingTarget,
    consent?: ConsentState,
    configured?: ConfiguredPlatforms,
  ) => boolean;
  flushTrackingQueue: (platform: "ga" | "meta" | "pinterest", target?: TrackingTarget) => void;
  purchaseStorageKey: (orderId: string) => string;
};

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
  tracking.flushTrackingQueue("ga", sink);
  tracking.flushTrackingQueue("meta", sink);
  tracking.flushTrackingQueue("pinterest", sink);
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

test("deduplicates pending events and flushes each platform exactly once", () => {
  const unavailableTarget: TrackingTarget = {};
  const product = { id: "pearl_queue", name: "Queued Pearl", price: 40, quantity: 1 };

  assert.equal(
    tracking.trackAddToCart(product, unavailableTarget, allConsent, allConfigured),
    true,
  );
  assert.equal(
    tracking.trackAddToCart(product, unavailableTarget, allConsent, allConfigured),
    true,
  );

  const gaCalls: unknown[][] = [];
  const metaCalls: unknown[][] = [];
  const pinterestCalls: unknown[][] = [];
  tracking.flushTrackingQueue("ga", { gtag: (...args) => gaCalls.push(args) });
  tracking.flushTrackingQueue("meta", { fbq: (...args) => metaCalls.push(args) });
  tracking.flushTrackingQueue("pinterest", { pintrk: (...args) => pinterestCalls.push(args) });
  tracking.flushTrackingQueue("ga", { gtag: (...args) => gaCalls.push(args) });
  tracking.flushTrackingQueue("meta", { fbq: (...args) => metaCalls.push(args) });
  tracking.flushTrackingQueue("pinterest", { pintrk: (...args) => pinterestCalls.push(args) });

  assert.equal(gaCalls.length, 1);
  assert.equal(metaCalls.length, 1);
  assert.equal(pinterestCalls.length, 1);
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

test("returns false when no configured platform has consent", () => {
  assert.equal(
    tracking.trackPurchase(
      "order_denied",
      20,
      [{ id: "pearl_1", name: "Stillwater Pearl", price: 20, quantity: 1 }],
      {},
      noConsent,
      allConfigured,
    ),
    false,
  );
});

test("builds a stable namespaced purchase storage key", () => {
  assert.equal(
    tracking.purchaseStorageKey("order_123"),
    "mythrealms:purchase-tracked:order_123",
  );
});

test("wires add-to-cart tracking through the cart store", () => {
  const cartSource = source("src/lib/cart.ts");
  assert.match(cartSource, /import \{ trackAddToCart \} from ['\"]@\/lib\/tracking['\"]/);
  assert.match(cartSource, /addItem: \(product, quantity = 1\) => \{\s*trackAddToCart\(/);
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

test("tracks begin checkout once per checkout mount", () => {
  const checkoutSource = source("src/app/checkout/page.tsx");
  assert.match(checkoutSource, /checkoutTracked = useRef\(false\)/);
  assert.match(checkoutSource, /trackBeginCheckout\(/);
  assert.match(checkoutSource, /checkoutTracked\.current = true/);
});

test("delegates paid purchase tracking with storage deduplication and consent retry", () => {
  const trackerSource = source("src/app/checkout/success/tracker.tsx");
  assert.match(trackerSource, /purchaseStorageKey\(orderId\)/);
  assert.match(trackerSource, /trackPurchase\(orderId, value, items/);
  assert.match(trackerSource, /addEventListener\(CONSENT_CHANGED_EVENT,/);
  assert.match(trackerSource, /removeEventListener\(CONSENT_CHANGED_EVENT,/);
  assert.doesNotMatch(trackerSource, /\bw\.(?:gtag|fbq|pintrk)\b/);
});
