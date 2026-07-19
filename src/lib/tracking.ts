import {
  CONSENT_CHANGED_EVENT,
  CONSENT_STORAGE_KEY,
  parseConsent,
  type ConsentState,
} from "@/lib/analytics/consent";

export interface TrackingTarget {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  pintrk?: (...args: unknown[]) => void;
}

export interface ConfiguredPlatforms {
  ga: boolean;
  meta: boolean;
  pinterest: boolean;
}

export type TrackingPlatform = keyof ConfiguredPlatforms;

export type PlatformTrackingStatus =
  | "accepted"
  | "complete"
  | "denied"
  | "disabled"
  | "failed";

export type PlatformTrackingResult = Record<
  TrackingPlatform,
  PlatformTrackingStatus
>;

export type PlatformCompletion = Partial<Record<TrackingPlatform, boolean>>;

export type TrackingListener = () => void;

export interface TrackingEventTarget {
  addEventListener(type: string, listener: TrackingListener): void;
  removeEventListener(type: string, listener: TrackingListener): void;
}

export interface TrackingStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface TrackingController {
  start(): void;
  cleanup(): void;
}

export interface TrackingProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
  variant?: string;
}

export interface CartProduct extends TrackingProduct {
  quantity: number;
}

interface GaItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_category?: string;
  item_variant?: string;
}

interface PendingEvent {
  args: unknown[];
  key: string;
  deduplicate: boolean;
}

const pendingQueues: Record<TrackingPlatform, PendingEvent[]> = {
  ga: [],
  meta: [],
  pinterest: [],
};

const trackingPlatforms: TrackingPlatform[] = ["ga", "meta", "pinterest"];

const targetKeys: Record<TrackingPlatform, keyof TrackingTarget> = {
  ga: "gtag",
  meta: "fbq",
  pinterest: "pintrk",
};

export const PURCHASE_STORAGE_PREFIX = "mythrealms:purchase-tracked:";
export const purchaseStorageKey = (
  orderId: string,
  platform: TrackingPlatform,
) => `${PURCHASE_STORAGE_PREFIX}${orderId}:${platform}`;

function browserTarget(): TrackingTarget | undefined {
  return typeof window === "undefined"
    ? undefined
    : (window as Window & TrackingTarget);
}

function browserConsent(): ConsentState {
  if (typeof window === "undefined") {
    return { analytics: false, marketing: false };
  }

  try {
    return parseConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return { analytics: false, marketing: false };
  }
}

function browserConfiguredPlatforms(): ConfiguredPlatforms {
  return {
    ga: Boolean(process.env.NEXT_PUBLIC_GA_ID),
    meta: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
    pinterest: Boolean(process.env.NEXT_PUBLIC_PINTEREST_TAG_ID),
  };
}

function gaItem(product: TrackingProduct, quantity?: number): GaItem {
  return {
    item_id: product.id,
    item_name: product.name,
    price: product.price,
    ...(quantity === undefined ? {} : { quantity }),
    ...(product.category === undefined ? {} : { item_category: product.category }),
    ...(product.variant === undefined ? {} : { item_variant: product.variant }),
  };
}

export function buildViewItemPayload(product: TrackingProduct) {
  return {
    currency: "USD",
    value: product.price,
    items: [gaItem(product)],
  };
}

export function buildAddToCartPayload(product: CartProduct) {
  return {
    currency: "USD",
    value: product.price * product.quantity,
    items: [gaItem(product, product.quantity)],
  };
}

export function buildBeginCheckoutPayload(items: CartProduct[], value: number) {
  return {
    currency: "USD",
    value,
    items: items.map((item) => gaItem(item, item.quantity)),
  };
}

export function buildPurchasePayload(
  orderId: string,
  value: number,
  items: CartProduct[],
) {
  return {
    transaction_id: orderId,
    currency: "USD",
    value,
    items: items.map((item) => gaItem(item, item.quantity)),
  };
}

function eventKey(args: unknown[]): string {
  return JSON.stringify(args);
}

function hasPlatformConsent(platform: TrackingPlatform, consent: ConsentState): boolean {
  return platform === "ga" ? consent.analytics : consent.marketing;
}

function dispatchOrQueue(
  platform: TrackingPlatform,
  args: unknown[],
  target: TrackingTarget | undefined,
  deduplicate = true,
): boolean {
  if (!target) return false;

  const queue = pendingQueues[platform];
  const key = eventKey(args);
  const dispatcher = target[targetKeys[platform]];

  if (!dispatcher) {
    if (!deduplicate || !queue.some((event) => event.key === key)) {
      queue.push({ args, key, deduplicate });
    }
    return true;
  }

  try {
    dispatcher(...args);
    if (deduplicate) {
      pendingQueues[platform] = queue.filter((event) => event.key !== key);
    }
    return true;
  } catch {
    return false;
  }
}

export function flushTrackingQueue(
  platform: TrackingPlatform,
  target: TrackingTarget | undefined = browserTarget(),
  consent: ConsentState = browserConsent(),
): void {
  if (!target) return;

  const queue = pendingQueues[platform];
  if (!hasPlatformConsent(platform, consent)) {
    queue.length = 0;
    return;
  }

  const dispatcher = target[targetKeys[platform]];
  if (!dispatcher) return;

  const events = queue.splice(0);

  for (const event of events) {
    try {
      dispatcher(...event.args);
    } catch {
      if (!event.deduplicate || !queue.some(({ key }) => key === event.key)) {
        queue.push(event);
      }
    }
  }
}

export function trackViewItem(
  product: TrackingProduct,
  target: TrackingTarget | undefined = browserTarget(),
  consent: ConsentState = browserConsent(),
  configured: ConfiguredPlatforms = browserConfiguredPlatforms(),
): boolean {
  let accepted = false;

  if (configured.ga && consent.analytics) {
    accepted =
      dispatchOrQueue("ga", ["event", "view_item", buildViewItemPayload(product)], target) ||
      accepted;
  }
  if (configured.meta && consent.marketing) {
    accepted =
      dispatchOrQueue(
        "meta",
        [
          "track",
          "ViewContent",
          {
            content_ids: [product.id],
            content_name: product.name,
            content_type: "product",
            currency: "USD",
            value: product.price,
          },
        ],
        target,
      ) || accepted;
  }
  if (configured.pinterest && consent.marketing) {
    accepted =
      dispatchOrQueue(
        "pinterest",
        [
          "track",
          "pagevisit",
          {
            currency: "USD",
            value: product.price,
            product_id: product.id,
            product_name: product.name,
          },
        ],
        target,
      ) || accepted;
  }

  return accepted;
}

export function trackAddToCart(
  product: TrackingProduct & { quantity?: number },
  target: TrackingTarget | undefined = browserTarget(),
  consent: ConsentState = browserConsent(),
  configured: ConfiguredPlatforms = browserConfiguredPlatforms(),
): boolean {
  const item: CartProduct = { ...product, quantity: product.quantity ?? 1 };
  const value = item.price * item.quantity;
  let accepted = false;

  if (configured.ga && consent.analytics) {
    accepted =
      dispatchOrQueue(
        "ga",
        ["event", "add_to_cart", buildAddToCartPayload(item)],
        target,
        false,
      ) ||
      accepted;
  }
  if (configured.meta && consent.marketing) {
    accepted =
      dispatchOrQueue(
        "meta",
        [
          "track",
          "AddToCart",
          {
            content_ids: [item.id],
            content_name: item.name,
            content_type: "product",
            currency: "USD",
            value,
          },
        ],
        target,
        false,
      ) || accepted;
  }
  if (configured.pinterest && consent.marketing) {
    accepted =
      dispatchOrQueue(
        "pinterest",
        [
          "track",
          "addtocart",
          {
            currency: "USD",
            value,
            product_id: item.id,
            product_name: item.name,
            order_quantity: item.quantity,
          },
        ],
        target,
        false,
      ) || accepted;
  }

  return accepted;
}

export function trackBeginCheckout(
  items: CartProduct[],
  value: number,
  target: TrackingTarget | undefined = browserTarget(),
  consent: ConsentState = browserConsent(),
  configured: ConfiguredPlatforms = browserConfiguredPlatforms(),
): boolean {
  let accepted = false;

  if (configured.ga && consent.analytics) {
    accepted =
      dispatchOrQueue(
        "ga",
        ["event", "begin_checkout", buildBeginCheckoutPayload(items, value)],
        target,
      ) || accepted;
  }
  if (configured.meta && consent.marketing) {
    accepted =
      dispatchOrQueue(
        "meta",
        [
          "track",
          "InitiateCheckout",
          {
            content_ids: items.map((item) => item.id),
            content_type: "product",
            contents: items.map((item) => ({
              id: item.id,
              item_price: item.price,
              quantity: item.quantity,
            })),
            currency: "USD",
            num_items: items.reduce((sum, item) => sum + item.quantity, 0),
            value,
          },
        ],
        target,
      ) || accepted;
  }
  if (configured.pinterest && consent.marketing) {
    accepted =
      dispatchOrQueue(
        "pinterest",
        [
          "track",
          "checkout",
          {
            currency: "USD",
            value,
            product_id: items.map((item) => item.id),
            order_quantity: items.reduce((sum, item) => sum + item.quantity, 0),
          },
        ],
        target,
      ) || accepted;
  }

  return accepted;
}

export function trackPurchase(
  orderId: string,
  value: number,
  items: CartProduct[],
  target: TrackingTarget | undefined = browserTarget(),
  consent: ConsentState = browserConsent(),
  configured: ConfiguredPlatforms = browserConfiguredPlatforms(),
  completed: PlatformCompletion = {},
): PlatformTrackingResult {
  const result = {} as PlatformTrackingResult;

  const trackPlatform = (
    platform: TrackingPlatform,
    args: unknown[],
  ): PlatformTrackingStatus => {
    if (completed[platform]) return "complete";
    if (!configured[platform]) return "disabled";
    if (!hasPlatformConsent(platform, consent)) return "denied";
    return dispatchOrQueue(platform, args, target) ? "accepted" : "failed";
  };

  result.ga = trackPlatform("ga", [
    "event",
    "purchase",
    buildPurchasePayload(orderId, value, items),
  ]);
  result.meta = trackPlatform("meta", [
    "track",
    "Purchase",
    {
      content_ids: items.map((item) => item.id),
      content_type: "product",
      contents: items.map((item) => ({
        id: item.id,
        item_price: item.price,
        quantity: item.quantity,
      })),
      currency: "USD",
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
      value,
    },
  ]);
  result.pinterest = trackPlatform("pinterest", [
    "track",
    "checkout",
    {
      currency: "USD",
      value,
      order_id: orderId,
      product_id: items.map((item) => item.id),
      order_quantity: items.reduce((sum, item) => sum + item.quantity, 0),
    },
  ]);

  return result;
}

export function createCheckoutTrackingController({
  target,
  completion,
  items,
  value,
  track,
}: {
  target: TrackingEventTarget;
  completion: { current: boolean };
  items: CartProduct[];
  value: number;
  track: (items: CartProduct[], value: number) => boolean;
}): TrackingController {
  let listening = false;

  const stopListening = () => {
    if (!listening) return;
    target.removeEventListener(CONSENT_CHANGED_EVENT, attemptTracking);
    listening = false;
  };

  const attemptTracking = () => {
    if (completion.current) {
      stopListening();
      return;
    }
    if (!track(items, value)) return;
    completion.current = true;
    stopListening();
  };

  return {
    start() {
      attemptTracking();
      if (completion.current || listening) return;
      target.addEventListener(CONSENT_CHANGED_EVENT, attemptTracking);
      listening = true;
    },
    cleanup: stopListening,
  };
}

export function createPurchaseTrackingController({
  target,
  storage,
  orderId,
  track,
}: {
  target: TrackingEventTarget;
  storage: TrackingStorage;
  orderId: string;
  track: (completed: PlatformCompletion) => PlatformTrackingResult;
}): TrackingController {
  const completed: PlatformCompletion = {};
  let listening = false;
  let storageReadable = true;

  try {
    for (const platform of trackingPlatforms) {
      completed[platform] =
        storage.getItem(purchaseStorageKey(orderId, platform)) !== null;
    }
  } catch {
    storageReadable = false;
  }

  const stopListening = () => {
    if (!listening) return;
    target.removeEventListener(CONSENT_CHANGED_EVENT, attemptTracking);
    listening = false;
  };

  const attemptTracking = () => {
    if (!storageReadable) return false;
    const result = track(completed);

    for (const platform of trackingPlatforms) {
      if (result[platform] !== "accepted") continue;
      completed[platform] = true;
      try {
        storage.setItem(purchaseStorageKey(orderId, platform), "true");
      } catch {
        // In-memory completion still prevents duplicate sends during this mount.
      }
    }

    const shouldRetry = trackingPlatforms.some(
      (platform) =>
        result[platform] === "denied" || result[platform] === "failed",
    );
    if (!shouldRetry) stopListening();
    return shouldRetry;
  };

  return {
    start() {
      const shouldRetry = attemptTracking();
      if (!shouldRetry || listening) return;

      target.addEventListener(CONSENT_CHANGED_EVENT, attemptTracking);
      listening = true;
    },
    cleanup: stopListening,
  };
}
