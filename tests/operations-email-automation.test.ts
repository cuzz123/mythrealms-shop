import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyIncomingMessage,
  decideMailboxAction,
  matchMessageToOrder,
  type IncomingMessage,
  type OrderRecordForAutomation,
} from "../src/lib/operations/email-automation";

function createMessage(overrides: Partial<IncomingMessage> = {}): IncomingMessage {
  return {
    id: "msg-1",
    fromEmail: "buyer@example.com",
    fromName: "Buyer",
    subject: "Question about order ord_live_20260714_ab12cd34",
    textBody: "Hi, can you check order ord_live_20260714_ab12cd34 for me?",
    receivedAt: "2026-07-14T09:00:00.000Z",
    ...overrides,
  };
}

function createOrder(
  overrides: Partial<OrderRecordForAutomation> = {},
): OrderRecordForAutomation {
  return {
    id: "ord_live_20260714_ab12cd34",
    displayReference: "MR internal ref",
    email: "buyer@example.com",
    status: "SHIPPED",
    trackingNumber: "YT123456789CN",
    shippingAddress: {
      name: "Ada Lovelace",
      city: "New York",
      country: "US",
    },
    ...overrides,
  };
}

test("classifies shipped-order tracking questions as shipping status", () => {
  const category = classifyIncomingMessage(
    createMessage({
      subject: "Tracking for order ord_live_20260714_ab12cd34",
      textBody: "Hello, where is my package and tracking for order ord_live_20260714_ab12cd34?",
    }),
  );

  assert.equal(category, "SHIPPING_STATUS");
});

test("classifies size and care FAQs as low-risk FAQ categories", () => {
  assert.equal(
    classifyIncomingMessage(
      createMessage({
        subject: "Sizing help",
        textBody: "What ring size should I choose for this item?",
      }),
    ),
    "SIZE_FAQ",
  );

  assert.equal(
    classifyIncomingMessage(
      createMessage({
        subject: "Care instructions",
        textBody: "How should I clean pearl jewelry and store it safely after wear?",
      }),
    ),
    "CARE_FAQ",
  );
});

test("classifies obvious outreach as marketing before broad faq words can misfire", () => {
  assert.equal(
    classifyIncomingMessage(
      createMessage({
        fromEmail: "agency@example.com",
        subject: "Agency introduction",
        textBody: "We are an agency and a good fit for your brand. We can store creative assets and improve campaign performance.",
      }),
    ),
    "MARKETING",
  );
});

test("classifies refund, cancellation, address, quality, dispute, supplier, and unknown mail as high-risk categories", () => {
  assert.equal(
    classifyIncomingMessage(
      createMessage({
        subject: "Refund request for ab12cd34",
        textBody: "I want a refund for order ab12cd34.",
      }),
    ),
    "REFUND_REQUEST",
  );
  assert.equal(
    classifyIncomingMessage(
      createMessage({
        subject: "Cancel order",
        textBody: "Please cancel order ab12cd34.",
      }),
    ),
    "CANCELLATION_REQUEST",
  );
  assert.equal(
    classifyIncomingMessage(
      createMessage({
        subject: "Address change",
        textBody: "I entered the wrong address for order ab12cd34.",
      }),
    ),
    "ADDRESS_CHANGE_REQUEST",
  );
  assert.equal(
    classifyIncomingMessage(
      createMessage({
        subject: "Damaged item",
        textBody: "The bracelet arrived damaged and scratched.",
      }),
    ),
    "QUALITY_COMPLAINT",
  );
  assert.equal(
    classifyIncomingMessage(
      createMessage({
        subject: "Chargeback",
        textBody: "I opened a dispute with my bank for this charge.",
      }),
    ),
    "PAYMENT_DISPUTE",
  );
  assert.equal(
    classifyIncomingMessage(
      createMessage({
        fromEmail: "vendor@example.com",
        subject: "Wholesale quotation",
        textBody: "Please find our supplier quote attached for your review.",
      }),
    ),
    "SUPPLIER_QUOTE",
  );
  assert.equal(
    classifyIncomingMessage(
      createMessage({
        subject: "Need help",
        textBody: "Something feels off and I need assistance.",
      }),
    ),
    "UNKNOWN",
  );
});

test("matches an order only when sender email and explicit real order reference both support it", () => {
  const orders = [
    createOrder({ id: "ord_live_20260714_ab12cd34" }),
    createOrder({ id: "ord_live_20260714_ff99ee88" }),
  ];

  const matched = matchMessageToOrder(
    createMessage({
      fromEmail: "Buyer@Example.com",
      subject: "Tracking for ff99ee88",
      textBody: "Please check order ff99ee88 for me.",
    }),
    orders,
  );

  assert.equal(matched?.id, "ord_live_20260714_ff99ee88");
});

test("does not match an order when the sender email disagrees or the real reference is missing", () => {
  const order = createOrder();

  assert.equal(
    matchMessageToOrder(
      createMessage({
        fromEmail: "other@example.com",
        subject: "Tracking for ab12cd34",
        textBody: "Please check order ab12cd34 for me.",
      }),
      [order],
    ),
    null,
  );

  assert.equal(
    matchMessageToOrder(
      createMessage({
        subject: "Where is my order?",
        textBody: "Can you check shipping for my recent order?",
      }),
      [order],
    ),
    null,
  );

  assert.equal(
    matchMessageToOrder(
      createMessage({
        subject: "Question about MR internal ref",
        textBody: "Can you check the MR internal ref on my order?",
      }),
      [order],
    ),
    null,
  );
});

test("auto-replies only to shipped order inquiries with a valid tracking number", () => {
  const message = createMessage({
    subject: "Tracking for order ord_live_20260714_ab12cd34",
    textBody: "Can you send the tracking for order ord_live_20260714_ab12cd34?",
  });
  const order = createOrder();

  const decision = decideMailboxAction({
    message,
    category: classifyIncomingMessage(message),
    matchedOrder: order,
  });

  assert.equal(decision.action, "AUTO_REPLY");
  assert.equal(decision.priority, "NORMAL");
  assert.ok(decision.draft);
  assert.match(decision.draft.body, /YT123456789CN/);
  assert.doesNotMatch(decision.draft.body, /refund|eligible|approved/i);
});

test("does not auto-reply when the tracking value is only a placeholder string", () => {
  const message = createMessage({
    subject: "Tracking for order ord_live_20260714_ab12cd34",
    textBody: "Can you send the tracking for order ord_live_20260714_ab12cd34?",
  });

  const decision = decideMailboxAction({
    message,
    category: classifyIncomingMessage(message),
    matchedOrder: createOrder({
      trackingNumber: "pending",
    }),
  });

  assert.equal(decision.action, "DRAFT_HIGH_PRIORITY");
  assert.equal(decision.priority, "HIGH");
  assert.ok(decision.draft);
  assert.doesNotMatch(decision.draft.body, /pending/i);
});

test("does not auto-reply when tracking contains a placeholder token plus extra characters", () => {
  const message = createMessage({
    subject: "Tracking for order ord_live_20260714_ab12cd34",
    textBody: "Can you send the tracking for order ord_live_20260714_ab12cd34?",
  });

  const pendingVariant = decideMailboxAction({
    message,
    category: classifyIncomingMessage(message),
    matchedOrder: createOrder({
      trackingNumber: "pending123",
    }),
  });
  assert.equal(pendingVariant.action, "DRAFT_HIGH_PRIORITY");
  assert.equal(pendingVariant.priority, "HIGH");

  const manualVariant = decideMailboxAction({
    message,
    category: classifyIncomingMessage(message),
    matchedOrder: createOrder({
      trackingNumber: "Man-ual 01",
    }),
  });
  assert.equal(manualVariant.action, "DRAFT_HIGH_PRIORITY");
  assert.equal(manualVariant.priority, "HIGH");

  const unknownVariant = decideMailboxAction({
    message,
    category: classifyIncomingMessage(message),
    matchedOrder: createOrder({
      trackingNumber: "unknown0001",
    }),
  });
  assert.equal(unknownVariant.action, "DRAFT_HIGH_PRIORITY");
  assert.equal(unknownVariant.priority, "HIGH");
});

test("creates a draft for order-status questions when the order is not shipped or lacks tracking", () => {
  const message = createMessage({
    subject: "Status for ab12cd34",
    textBody: "Can you update me on order ab12cd34?",
  });
  const decision = decideMailboxAction({
    message,
    category: classifyIncomingMessage(message),
    matchedOrder: createOrder({
      status: "PAID",
      trackingNumber: null,
    }),
  });

  assert.equal(decision.action, "DRAFT_HIGH_PRIORITY");
  assert.equal(decision.priority, "HIGH");
  assert.ok(decision.draft);
  assert.doesNotMatch(decision.draft.body, /2-5 business days|7-20 business days|will ship on/i);
  assert.match(decision.draft.body, /once it is available/i);
});

test("auto-replies to low-risk size and care questions without inventing order facts", () => {
  const sizeDecision = decideMailboxAction({
    message: createMessage({
      subject: "Sizing help",
      textBody: "Which ring size should I pick?",
    }),
    category: "SIZE_FAQ",
    matchedOrder: null,
  });
  assert.equal(sizeDecision.action, "AUTO_REPLY");
  assert.ok(sizeDecision.draft);
  assert.doesNotMatch(sizeDecision.draft.body, /ord_live_20260714_ab12cd34|tracking|refund/i);

  const careDecision = decideMailboxAction({
    message: createMessage({
      subject: "Pearl care",
      textBody: "How do I care for pearl jewelry?",
    }),
    category: "CARE_FAQ",
    matchedOrder: null,
  });
  assert.equal(careDecision.action, "AUTO_REPLY");
  assert.ok(careDecision.draft);
  assert.match(careDecision.draft.body, /soft cloth|dry/i);
});

test("routes refund and other high-risk messages to high-priority drafts and never auto-replies", () => {
  const decision = decideMailboxAction({
    message: createMessage({
      subject: "Refund request for ab12cd34",
      textBody: "I want a refund for order ab12cd34.",
    }),
    category: "REFUND_REQUEST",
    matchedOrder: createOrder({ status: "DELIVERED" }),
  });

  assert.equal(decision.action, "DRAFT_HIGH_PRIORITY");
  assert.equal(decision.priority, "HIGH");
  assert.ok(decision.draft);
  assert.doesNotMatch(decision.draft.body, /refund will be issued|eligible for a refund|approved/i);
});

test("routes unmatched order questions and unknown mail to high-priority drafts instead of auto replies", () => {
  const unmatchedOrderDecision = decideMailboxAction({
    message: createMessage({
      subject: "Where is order zz88yy77?",
      textBody: "Can you check order zz88yy77?",
    }),
    category: "ORDER_STATUS",
    matchedOrder: null,
  });
  assert.equal(unmatchedOrderDecision.action, "DRAFT_HIGH_PRIORITY");
  assert.ok(unmatchedOrderDecision.draft);
  assert.match(unmatchedOrderDecision.draft.body, /review the details/i);

  const unknownDecision = decideMailboxAction({
    message: createMessage({
      subject: "Need help",
      textBody: "Something feels off and I need assistance.",
    }),
    category: "UNKNOWN",
    matchedOrder: null,
  });
  assert.equal(unknownDecision.action, "DRAFT_HIGH_PRIORITY");
  assert.equal(unknownDecision.priority, "HIGH");
});

test("ignores obvious marketing outreach", () => {
  const decision = decideMailboxAction({
    message: createMessage({
      fromEmail: "agency@example.com",
      subject: "Influencer marketing proposal",
      textBody: "We are an agency and a good fit for your brand. We can grow your brand with a paid campaign.",
    }),
    category: "MARKETING",
    matchedOrder: null,
  });

  assert.equal(decision.action, "IGNORE");
  assert.equal(decision.draft, null);
});
