export const CONSENT_STORAGE_KEY = "cookie-consent";
export const CONSENT_CHANGED_EVENT = "mythrealms:consent-changed";

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
}

function noConsent(): ConsentState {
  return { analytics: false, marketing: false };
}

export function parseConsent(raw: string | null): ConsentState {
  if (!raw) return noConsent();

  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return noConsent();

    const consent = value as Record<string, unknown>;
    return {
      analytics: consent.analytics === true,
      marketing: consent.marketing === true,
    };
  } catch {
    return noConsent();
  }
}

export function requiresConsentReload(previous: ConsentState, next: ConsentState): boolean {
  return (previous.analytics && !next.analytics) || (previous.marketing && !next.marketing);
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
