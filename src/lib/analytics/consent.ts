export const CONSENT_STORAGE_KEY = "cookie-consent";
export const CONSENT_CHANGED_EVENT = "mythrealms:consent-changed";

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
}

export type ConsentPreference = Readonly<{
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}>;

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

export type ConsentHost = {
  readonly localStorage: Pick<Storage, "getItem" | "setItem">;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
  dispatchEvent(event: Event): boolean;
};

function noConsent(): ConsentState {
  return { analytics: false, marketing: false };
}

function decodeConsentValue(value: unknown): ConsentState | null {
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
}

function decodeStoredConsent(raw: string | null): ConsentState | null {
  if (!raw) return null;

  try {
    return decodeConsentValue(JSON.parse(raw));
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

export function requiresConsentReload(
  previous: ConsentState,
  next: ConsentState,
): boolean {
  return (
    (previous.analytics && !next.analytics) ||
    (previous.marketing && !next.marketing)
  );
}

export function createConsentSubscriptionController({
  target,
  readConsent,
  onConsentChange,
  reload,
}: ConsentSubscriptionOptions) {
  let previousConsent = noConsent();

  const applyConsent = (nextConsent: ConsentState, reloadOnDowngrade: boolean) => {
    const shouldReload =
      reloadOnDowngrade && requiresConsentReload(previousConsent, nextConsent);
    previousConsent = nextConsent;
    onConsentChange(nextConsent);
    if (shouldReload) reload();
  };

  const readAndApply = () => {
    let nextConsent: ConsentState;
    let persisted = true;

    try {
      nextConsent = parseConsent(readConsent());
    } catch {
      nextConsent = noConsent();
      persisted = false;
    }

    applyConsent(nextConsent, persisted);
  };

  const handleConsentChange: ConsentListener = (event) => {
    const detail = (event as unknown as { detail?: unknown } | undefined)?.detail;
    const eventConsent = decodeConsentValue(detail);
    if (eventConsent) {
      applyConsent(eventConsent, true);
      return;
    }
    readAndApply();
  };
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

export function readAnalyticsConsent(host: ConsentHost): boolean {
  try {
    return parseConsent(host.localStorage.getItem(CONSENT_STORAGE_KEY)).analytics;
  } catch {
    return false;
  }
}

export function saveConsentPreference(
  host: ConsentHost,
  preference: ConsentPreference,
) {
  try {
    host.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preference));
  } catch {
    // The same-page event still applies the choice when storage is blocked.
  }

  host.dispatchEvent(
    new CustomEvent<ConsentPreference>(CONSENT_CHANGED_EVENT, {
      detail: preference,
    }),
  );
}

export function subscribeToConsentChanges(
  host: ConsentHost,
  listener: (preference: ConsentPreference) => void,
) {
  const handleConsentChange: EventListener = (event) => {
    const preference = (event as CustomEvent<ConsentPreference>).detail;
    if (decodeConsentValue(preference)) listener(preference);
  };

  host.addEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
  return () =>
    host.removeEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
}
