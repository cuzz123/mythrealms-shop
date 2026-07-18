export const STORE_POLICY_FACTS = {
  freeShippingThresholdUsd: 69.99,
  handlingBusinessDays: { min: 2, max: 5 },
  usStandardTransitBusinessDays: { min: 8, max: 14 },
  returnWindowDays: 30,
  returnMethod: "https://schema.org/ReturnByMail",
  defaultReturnFees: "https://schema.org/ReturnShippingFees",
} as const;

export type StorePolicyFacts = typeof STORE_POLICY_FACTS;
