export const MERCHANT_FACTS = {
  name: "Maverenne",
  supportEmail: "Maverenne@outlook.com",
  primaryMarket: "United States",
  businessModel: "independent online jewelry retailer",
  fulfillmentModel: "supplier-direct fulfillment",
} as const;

export function resolveSupportEmail(value?: string): string {
  return value?.trim() || MERCHANT_FACTS.supportEmail;
}
