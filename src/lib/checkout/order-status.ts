const PAID_ORDER_STATUSES = new Set(["PAID", "SHIPPED", "DELIVERED"]);

export function isPaidOrderStatus(status: string | null | undefined): boolean {
  return typeof status === "string" && PAID_ORDER_STATUSES.has(status);
}

export function shouldPollOrderStatus(status: string | null | undefined): boolean {
  return status === "PENDING" || status === "PROCESSING_PAYMENT";
}

export interface CheckoutSuccessPresentation {
  heading: string;
  message: string;
  note: string;
  trackPurchase: boolean;
  showFulfillmentSteps: boolean;
}

export function getCheckoutSuccessPresentation(
  status: string | null | undefined,
  confirmationSentAt?: Date | null,
): CheckoutSuccessPresentation {
  if (isPaidOrderStatus(status)) {
    return {
      heading: "Order Confirmed!",
      message: "Thank you for your purchase. Your order has been received and is being processed.",
      note: confirmationSentAt
        ? "A confirmation email has been sent. We will let you know when your order ships."
        : "Payment succeeded, but the confirmation email is pending and can be retried. We will let you know when your order ships.",
      trackPurchase: true,
      showFulfillmentSteps: true,
    };
  }

  if (status === "PENDING" || status === "PROCESSING_PAYMENT") {
    return {
      heading: "Payment Processing",
      message: "We are waiting for the payment provider to confirm your payment. This page updates automatically.",
      note: "We will send a confirmation email after payment is confirmed.",
      trackPurchase: false,
      showFulfillmentSteps: false,
    };
  }

  return {
    heading: "Order Status",
    message: "We could not confirm a paid order from this link.",
    note: "No fulfillment has started. Please return to checkout if you still wish to place this order.",
    trackPurchase: false,
    showFulfillmentSteps: false,
  };
}
