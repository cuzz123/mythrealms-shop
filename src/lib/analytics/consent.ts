export const CONSENT_STORAGE_KEY = "cookie-consent";
export const CONSENT_CHANGED_EVENT = "mythrealms:consent-changed";

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
}

export interface ConsentStorageEvent {
  key: string | null;
}

export type ConsentListener = (event?: ConsentStorageEvent) => void;

export interface ConsentEventTarget {
  addEventListener(type: string, listener: ConsentListener): void;
  removeEventListener(type: string, listener: ConsentListener): void;
}

export interface ConsentSubscriptionOptions {
  target: ConsentEventTarget;
  readConsent: () => string | null;
  onConsentChange: (state: ConsentState) => void;
  reload: () => void;
}

function noConsent(): ConsentState {
  return { analytics: false, marketing: false };
}

function decodeStoredConsent(raw: string | null): ConsentState | null {
  if (!raw) return null;

  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;

    const consent = value as Record<string, unknown>;
    if (
      consent.necessary !== true ||
      typeof consent.analytics !== "boolean" ||
      typeof consent.marketing !== "boolean"
    ) {
      return null;
    }

    return {
      analytics: consent.analytics,
      marketing: consent.marketing,
    };
  } catch {
    return null;
  }
}

export function parseConsent(raw: string | null): ConsentState {
  return decodeStoredConsent(raw) ?? noConsent();
}

export function hasValidStoredConsent(raw: string | null): boolean {
  return decodeStoredConsent(raw) !== null;
}

export function requiresConsentReload(previous: ConsentState, next: ConsentState): boolean {
  return (previous.analytics && !next.analytics) || (previous.marketing && !next.marketing);
}

export function createConsentSubscriptionController({
  target,
  readConsent,
  onConsentChange,
  reload,
}: ConsentSubscriptionOptions) {
  let previousConsent = noConsent();

  const readAndApply = () => {
    let nextConsent: ConsentState;
    let persisted = true;

    try {
      nextConsent = parseConsent(readConsent());
    } catch {
      nextConsent = noConsent();
      persisted = false;
    }

    const shouldReload = persisted && requiresConsentReload(previousConsent, nextConsent);
    previousConsent = nextConsent;
    onConsentChange(nextConsent);
    if (shouldReload) reload();
  };

  const handleConsentChange: ConsentListener = () => readAndApply();
  const handleStorageChange: ConsentListener = (event) => {
    if (event?.key === CONSENT_STORAGE_KEY || event?.key === null) readAndApply();
  };

  return {
    start() {
      readAndApply();
      target.addEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
      target.addEventListener("storage", handleStorageChange);
    },
    cleanup() {
      target.removeEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
      target.removeEventListener("storage", handleStorageChange);
    },
  };
}

export function serializeConsent(level: "all" | "essential"): string {
  const enabled = level === "all";

  return JSON.stringify({
    necessary: true,
    analytics: enabled,
    marketing: enabled,
    timestamp: Date.now(),
  });
}
