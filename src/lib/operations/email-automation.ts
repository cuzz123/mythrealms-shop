export type EmailAutomationCategory =
  | "ORDER_STATUS"
  | "SHIPPING_STATUS"
  | "SIZE_FAQ"
  | "CARE_FAQ"
  | "REFUND_REQUEST"
  | "CANCELLATION_REQUEST"
  | "ADDRESS_CHANGE_REQUEST"
  | "QUALITY_COMPLAINT"
  | "PAYMENT_DISPUTE"
  | "SUPPLIER_QUOTE"
  | "MARKETING"
  | "UNKNOWN";

export type MailboxAction = "AUTO_REPLY" | "DRAFT_HIGH_PRIORITY" | "IGNORE";
export type MailboxPriority = "NORMAL" | "HIGH";
export type OrderAutomationStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED"
  | string;

export interface IncomingMessage {
  id: string;
  fromEmail: string;
  fromName?: string | null;
  subject: string;
  textBody: string;
  htmlBody?: string | null;
  receivedAt?: string | null;
}

export interface OrderRecordForAutomation {
  id: string;
  displayReference?: string | null;
  email: string;
  status: OrderAutomationStatus;
  trackingNumber?: string | null;
  shippingAddress?: {
    name?: string | null;
    city?: string | null;
    country?: string | null;
  } | null;
}

export interface MessageDraft {
  subject: string;
  body: string;
}

export interface MailboxDecision {
  action: MailboxAction;
  priority: MailboxPriority;
  category: EmailAutomationCategory;
  matchedOrderId: string | null;
  draft: MessageDraft | null;
}

export interface DecideMailboxActionInput {
  message: IncomingMessage;
  category: EmailAutomationCategory;
  matchedOrder: OrderRecordForAutomation | null;
}

const REFUND_KEYWORDS = ["refund", "return", "money back"];
const CANCELLATION_KEYWORDS = ["cancel my order", "cancel order", "cancel"];
const ADDRESS_KEYWORDS = ["change address", "wrong address", "update address", "shipping address"];
const QUALITY_KEYWORDS = ["damaged", "broken", "defect", "scratched", "wrong item", "quality issue"];
const DISPUTE_KEYWORDS = ["chargeback", "dispute", "bank claim", "paypal case", "card dispute"];
const SUPPLIER_KEYWORDS = ["supplier quote", "quotation", "wholesale", "moq", "price list", "manufacturer"];
const MARKETING_KEYWORDS = ["marketing", "influencer", "agency", "seo", "backlink", "campaign", "promote your brand", "good fit for your brand", "brand partnership"];
const SIZE_KEYWORDS = ["ring size", "size guide", "sizing help", "what size should i", "which size should i", "size chart"];
const CARE_KEYWORDS = ["care instructions", "how do i care", "how should i clean", "jewelry care", "pearl care", "clean pearl"];
const SHIPPING_KEYWORDS = ["tracking", "track", "package", "shipment", "where is my order", "where is my package", "delivery status"];
const ORDER_KEYWORDS = ["order status", "check order", "my order", "order update"];
const INVALID_TRACKING_VALUES = new Set(["manual", "pending", "unknown", "n/a", "na", "none", "tbd"]);

function normalizeText(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

function hasAnyKeyword(text: string, keywords: readonly string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeTrackingToken(value: string): string {
  return value.toLowerCase().replace(/[\s-]+/g, "");
}

function hasValidTrackingNumber(order: OrderRecordForAutomation): boolean {
  if (typeof order.trackingNumber !== "string") {
    return false;
  }

  const trackingNumber = order.trackingNumber.trim();
  const normalized = normalizeTrackingToken(trackingNumber);
  if (
    trackingNumber.length < 8 ||
    Array.from(INVALID_TRACKING_VALUES).some((token) =>
      normalized.includes(normalizeTrackingToken(token)),
    )
  ) {
    return false;
  }

  return /\d/.test(trackingNumber);
}

function isOrderQuestion(category: EmailAutomationCategory): boolean {
  return category === "ORDER_STATUS" || category === "SHIPPING_STATUS";
}

export function classifyIncomingMessage(
  message: IncomingMessage,
): EmailAutomationCategory {
  const text = normalizeText(
    [message.subject, message.textBody, message.htmlBody].filter(Boolean).join(" "),
  );

  if (hasAnyKeyword(text, REFUND_KEYWORDS)) {
    return "REFUND_REQUEST";
  }
  if (hasAnyKeyword(text, CANCELLATION_KEYWORDS)) {
    return "CANCELLATION_REQUEST";
  }
  if (hasAnyKeyword(text, ADDRESS_KEYWORDS)) {
    return "ADDRESS_CHANGE_REQUEST";
  }
  if (hasAnyKeyword(text, QUALITY_KEYWORDS)) {
    return "QUALITY_COMPLAINT";
  }
  if (hasAnyKeyword(text, DISPUTE_KEYWORDS)) {
    return "PAYMENT_DISPUTE";
  }
  if (hasAnyKeyword(text, SUPPLIER_KEYWORDS)) {
    return "SUPPLIER_QUOTE";
  }
  if (hasAnyKeyword(text, MARKETING_KEYWORDS)) {
    return "MARKETING";
  }
  if (hasAnyKeyword(text, SIZE_KEYWORDS)) {
    return "SIZE_FAQ";
  }
  if (hasAnyKeyword(text, CARE_KEYWORDS)) {
    return "CARE_FAQ";
  }
  if (hasAnyKeyword(text, SHIPPING_KEYWORDS)) {
    return "SHIPPING_STATUS";
  }
  if (hasAnyKeyword(text, ORDER_KEYWORDS) || /\border\s+[a-z0-9-]{4,}\b/i.test(text)) {
    return "ORDER_STATUS";
  }

  return "UNKNOWN";
}

export function matchMessageToOrder(
  message: IncomingMessage,
  orders: readonly OrderRecordForAutomation[],
): OrderRecordForAutomation | null {
  const senderEmail = normalizeEmail(message.fromEmail);
  const searchableText = `${message.subject}\n${message.textBody}\n${message.htmlBody ?? ""}`;

  for (const order of orders) {
    if (normalizeEmail(order.email) !== senderEmail) {
      continue;
    }

    const references = [order.id, order.id.slice(-8)].filter(
      (reference, index, array) => Boolean(reference) && array.indexOf(reference) === index,
    );

    if (
      references.some((reference) =>
        new RegExp(`\\b${escapeRegex(reference)}\\b`, "i").test(searchableText),
      )
    ) {
      return order;
    }
  }

  return null;
}

function buildFaqDraft(category: "SIZE_FAQ" | "CARE_FAQ"): MessageDraft {
  if (category === "SIZE_FAQ") {
    return {
      subject: "Re: Sizing help",
      body:
        "Hello,\n\nThanks for reaching out. For sizing questions, please compare the item measurements with a ring or piece that already fits you well before placing the order. If you share the specific product and the measurement you are comparing against, we can review it with you.\n\nBest,\nMythRealms",
    };
  }

  return {
    subject: "Re: Jewelry care",
    body:
      "Hello,\n\nThanks for your message. We recommend wiping pearl jewelry with a soft cloth after wear, keeping it dry, and storing it separately from harder pieces to help avoid surface damage.\n\nBest,\nMythRealms",
  };
}

function buildOrderAutoReply(order: OrderRecordForAutomation): MessageDraft {
  const orderReference = order.displayReference?.trim() || order.id.slice(-8);

  return {
    subject: `Re: Order ${orderReference}`,
    body:
      `Hello,\n\nThanks for checking in about order ${orderReference}. Your order is marked as shipped, and the tracking number currently on file is ${order.trackingNumber?.trim()}.\n\nIf you need another review after checking the latest carrier scan, reply to this message and our team can take a closer look.\n\nBest,\nMythRealms`,
  };
}

function buildPendingOrderDraft(order: OrderRecordForAutomation | null): MessageDraft {
  const orderReference = order
    ? `order ${order.displayReference?.trim() || order.id.slice(-8)}`
    : "your order";

  return {
    subject: `Re: ${order ? `Order ${order.displayReference?.trim() || order.id.slice(-8)}` : "Your message"}`,
    body:
      `Hello,\n\nThank you for your message about ${orderReference}. We need to review the details internally and will follow up again once it is available. We are not able to confirm a shipping or delivery timeline from this draft.\n\nBest,\nMythRealms`,
  };
}

function buildHighRiskDraft(
  category: Exclude<
    EmailAutomationCategory,
    "ORDER_STATUS" | "SHIPPING_STATUS" | "SIZE_FAQ" | "CARE_FAQ" | "MARKETING"
  >,
  order: OrderRecordForAutomation | null,
): MessageDraft {
  const orderReference = order
    ? ` for order ${order.displayReference?.trim() || order.id.slice(-8)}`
    : "";

  const reasonByCategory: Record<typeof category, string> = {
    REFUND_REQUEST: "request",
    CANCELLATION_REQUEST: "request",
    ADDRESS_CHANGE_REQUEST: "request",
    QUALITY_COMPLAINT: "concern",
    PAYMENT_DISPUTE: "message",
    SUPPLIER_QUOTE: "message",
    UNKNOWN: "message",
  };

  return {
    subject: `Re: ${order ? `Order ${order.displayReference?.trim() || order.id.slice(-8)}` : "Your message"}`,
    body:
      `Hello,\n\nThank you for your ${reasonByCategory[category]}${orderReference}. Our team needs to review the details before responding further, and we will review the details and follow up as soon as possible.\n\nBest,\nMythRealms`,
  };
}

export function buildResponseDraft(
  input: DecideMailboxActionInput,
): MessageDraft | null {
  const { category, matchedOrder } = input;

  if (category === "MARKETING") {
    return null;
  }
  if (category === "SIZE_FAQ" || category === "CARE_FAQ") {
    return buildFaqDraft(category);
  }
  if (
    isOrderQuestion(category) &&
    matchedOrder &&
    matchedOrder.status === "SHIPPED" &&
    hasValidTrackingNumber(matchedOrder)
  ) {
    return buildOrderAutoReply(matchedOrder);
  }
  if (isOrderQuestion(category)) {
    return buildPendingOrderDraft(matchedOrder);
  }

  return buildHighRiskDraft(
    category as Exclude<
      EmailAutomationCategory,
      "ORDER_STATUS" | "SHIPPING_STATUS" | "SIZE_FAQ" | "CARE_FAQ" | "MARKETING"
    >,
    matchedOrder,
  );
}

export function decideMailboxAction(
  input: DecideMailboxActionInput,
): MailboxDecision {
  const { category, matchedOrder } = input;

  if (category === "MARKETING") {
    return {
      action: "IGNORE",
      priority: "NORMAL",
      category,
      matchedOrderId: matchedOrder?.id ?? null,
      draft: null,
    };
  }

  if (category === "SIZE_FAQ" || category === "CARE_FAQ") {
    return {
      action: "AUTO_REPLY",
      priority: "NORMAL",
      category,
      matchedOrderId: matchedOrder?.id ?? null,
      draft: buildResponseDraft(input),
    };
  }

  if (
    isOrderQuestion(category) &&
    matchedOrder &&
    matchedOrder.status === "SHIPPED" &&
    hasValidTrackingNumber(matchedOrder)
  ) {
    return {
      action: "AUTO_REPLY",
      priority: "NORMAL",
      category,
      matchedOrderId: matchedOrder.id,
      draft: buildResponseDraft(input),
    };
  }

  return {
    action: "DRAFT_HIGH_PRIORITY",
    priority: "HIGH",
    category,
    matchedOrderId: matchedOrder?.id ?? null,
    draft: buildResponseDraft(input),
  };
}
