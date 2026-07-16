export const SUPPLIER_CANDIDATE_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
] as const;

export type SupplierCandidateStatus =
  (typeof SUPPLIER_CANDIDATE_STATUSES)[number];

export const MAILBOX_CONNECTION_STATUSES = [
  "DISCONNECTED",
  "CONNECTED",
  "ERROR",
  "DISABLED",
] as const;

export type MailboxConnectionStatus =
  (typeof MAILBOX_CONNECTION_STATUSES)[number];

export const MAILBOX_EVENT_CATEGORIES = [
  "ORDER_STATUS",
  "SHIPPING",
  "FAQ",
  "PRODUCT_CARE",
  "REFUND",
  "CANCEL",
  "ADDRESS_CHANGE",
  "QUALITY",
  "PAYMENT_DISPUTE",
  "SUPPLIER",
  "MARKETING",
  "UNKNOWN",
] as const;

export type MailboxEventCategory = (typeof MAILBOX_EVENT_CATEGORIES)[number];

export const MAILBOX_AUTOMATION_DECISIONS = [
  "AUTO_REPLY",
  "DRAFT_HIGH_PRIORITY",
  "IGNORE",
] as const;

export type MailboxAutomationDecision =
  (typeof MAILBOX_AUTOMATION_DECISIONS)[number];

export const MAILBOX_AUTOMATION_ACTIONS = [
  "RECEIVED",
  "AUTO_REPLIED",
  "DRAFTED",
  "SENT",
  "IGNORED",
  "FAILED",
] as const;

export type MailboxAutomationAction =
  (typeof MAILBOX_AUTOMATION_ACTIONS)[number];

export const MAILBOX_EVENT_PRIORITIES = [
  "LOW",
  "NORMAL",
  "HIGH",
] as const;

export type MailboxEventPriority = (typeof MAILBOX_EVENT_PRIORITIES)[number];

export const MAILBOX_AUTOMATION_STATUSES = [
  "PENDING",
  "PROCESSING",
  "PROCESSED",
  "FAILED",
  "IGNORED",
] as const;

export type MailboxAutomationStatus =
  (typeof MAILBOX_AUTOMATION_STATUSES)[number];

export interface OperationsSourcingConfig {
  enabled: true;
  cnyToUsdRate: number;
  targetGrossMargin: number;
}

export interface OperationsReportingConfig {
  recipient: string;
}

export interface OperationsGa4ConfigEnabled {
  configured: true;
  propertyId: string;
  serviceAccountJson: string;
}

export interface OperationsGa4ConfigDisabled {
  configured: false;
  reason: string;
}

export type OperationsGa4Config =
  | OperationsGa4ConfigEnabled
  | OperationsGa4ConfigDisabled;

export interface OperationsOutlookConfigEnabled {
  configured: true;
  enabled: true;
  clientId: string;
  clientSecret: string;
  tenantId: string;
  redirectUri: string;
  webhookClientState: string;
  encryptionKey: string;
}

export interface OperationsOutlookConfigDisabled {
  configured: false;
  enabled: false;
  reason: string;
  missingFields: string[];
}

export type OperationsOutlookConfig =
  | OperationsOutlookConfigEnabled
  | OperationsOutlookConfigDisabled;

export interface OperationsConfig {
  sourcing: OperationsSourcingConfig;
  reporting: OperationsReportingConfig;
  ga4: OperationsGa4Config;
  outlook: OperationsOutlookConfig;
}
