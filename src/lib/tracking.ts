// GA4 / Meta Pixel event tracking helpers

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// GA4 Ecommerce Events
export function trackViewItem(product: {
  id: string; name: string; price: number;
  category?: string; variant?: string;
}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "view_item", {
    currency: "USD",
    value: product.price,
    items: [{
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      item_category: product.category,
      item_variant: product.variant,
    }],
  });
}

export interface CartProduct {
  id: string; name: string; price: number; quantity: number;
  category?: string; variant?: string;
}

export function trackAddToCart(product: { id: string; name: string; price: number; quantity?: number }) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "add_to_cart", {
    currency: "USD",
    value: product.price * (product.quantity || 1),
    items: [{
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity: product.quantity || 1,
    }],
  });
  // Meta Pixel
  if (window.fbq) {
    window.fbq("track", "AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      value: product.price * (product.quantity || 1),
      currency: "USD",
    });
  }
}

export function trackBeginCheckout(items: Array<{ id: string; name: string; price: number; quantity: number }>, value: number) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "begin_checkout", {
    currency: "USD",
    value,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
  if (window.fbq) {
    window.fbq("track", "InitiateCheckout", { value, currency: "USD" });
  }
}

export function trackPurchase(orderId: string, value: number, items: Array<{ id: string; name: string; price: number; quantity: number }>) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "purchase", {
    transaction_id: orderId,
    currency: "USD",
    value,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
  // Meta Pixel Purchase
  if (window.fbq) {
    window.fbq("track", "Purchase", {
      content_ids: items.map((i) => i.id),
      value,
      currency: "USD",
    });
  }
}
