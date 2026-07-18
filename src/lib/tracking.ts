import {
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
}

const pendingQueues: Record<TrackingPlatform, Map<string, PendingEvent>> = {
  ga: new Map(),
  meta: new Map(),
  pinterest: new Map(),
};

const targetKeys: Record<TrackingPlatform, keyof TrackingTarget> = {
  ga: "gtag",
  meta: "fbq",
  pinterest: "pintrk",
};

export const PURCHASE_STORAGE_PREFIX = "mythrealms:purchase-tracked:";
export const purchaseStorageKey = (orderId: string) =>
  `${PURCHASE_STORAGE_PREFIX}${orderId}`;

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
): boolean {
  if (!target) return false;

  const queue = pendingQueues[platform];
  const key = eventKey(args);
  const dispatcher = target[targetKeys[platform]];

  if (!dispatcher) {
    queue.set(key, { args });
    return true;
  }

  try {
    dispatcher(...args);
    queue.delete(key);
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
    queue.clear();
    return;
  }

  const dispatcher = target[targetKeys[platform]];
  if (!dispatcher) return;

  const events = [...queue.values()];
  queue.clear();

  for (const event of events) {
    try {
      dispatcher(...event.args);
    } catch {
      queue.set(eventKey(event.args), event);
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
      dispatchOrQueue("ga", ["event", "add_to_cart", buildAddToCartPayload(item)], target) ||
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
): boolean {
  let accepted = false;

  if (configured.ga && consent.analytics) {
    accepted =
      dispatchOrQueue(
        "ga",
        ["event", "purchase", buildPurchasePayload(orderId, value, items)],
        target,
      ) || accepted;
  }
  if (configured.meta && consent.marketing) {
    accepted =
      dispatchOrQueue(
        "meta",
        [
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
            order_id: orderId,
            product_id: items.map((item) => item.id),
            order_quantity: items.reduce((sum, item) => sum + item.quantity, 0),
          },
        ],
        target,
      ) || accepted;
  }

  return accepted;
}
