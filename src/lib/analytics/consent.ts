export const COOKIE_CONSENT_STORAGE_KEY = "cookie-consent";
export const CONSENT_CHANGED_EVENT = "mythrealms:consent-change";

export type ConsentPreference = Readonly<{
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}>;

export type ConsentHost = {
  readonly localStorage: Pick<Storage, "getItem" | "setItem">;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
  dispatchEvent(event: Event): boolean;
};

export function readAnalyticsConsent(host: ConsentHost) {
  try {
    const raw = host.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return false;

    const consent = JSON.parse(raw) as Record<string, unknown>;
    return consent.analytics === true || consent.all === true;
  } catch {
    return false;
  }
}

export function saveConsentPreference(
  host: ConsentHost,
  preference: ConsentPreference,
) {
  try {
    host.localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify(preference),
    );
  } catch {
    // The same-page event still applies the user's choice when storage is blocked.
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
    listener((event as CustomEvent<ConsentPreference>).detail);
  };

  host.addEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
  return () =>
    host.removeEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
}
