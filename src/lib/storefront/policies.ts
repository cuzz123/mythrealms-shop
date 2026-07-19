export const STORE_POLICY_FACTS = {
  freeShippingThresholdUsd: 69.99,
  standardShippingFlatRateUsd: 4.99,
  handlingBusinessDays: { min: 2, max: 5 },
  usStandardTransitBusinessDays: { min: 8, max: 14 },
  returnWindowDays: 30,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
  customerRemorseReturnFees:
    "https://schema.org/ReturnFeesCustomerResponsibility",
  itemDefectReturnFees: "https://schema.org/FreeReturn",
  returnLabelSource:
    "https://schema.org/ReturnLabelCustomerResponsibility",
  customerRemorseReturnLabelSource:
    "https://schema.org/ReturnLabelCustomerResponsibility",
} as const;

export type StorePolicyFacts = typeof STORE_POLICY_FACTS;
