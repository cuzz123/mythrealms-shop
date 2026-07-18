export function classifyReferralSource(locationHref: string) {
  const current = new URL(locationHref);
  const campaign = current.searchParams.get("utm_source")?.toLowerCase();
  return campaign === "chatgpt.com" ? "chatgpt.com" : null;
}

const AI_REFERRAL_SESSION_KEY = "mythrealms-ai-referral-tracked";

type AiReferralInput = Readonly<{
  locationHref: string;
  sessionStorage: Pick<Storage, "getItem" | "setItem">;
  gtag: (...args: unknown[]) => void;
  dedupe: { current: boolean };
}>;

export function shouldReportAiReferral(
  analyticsConsented: boolean,
  gaInitialized: boolean,
) {
  return analyticsConsented && gaInitialized;
}

export function reportAiReferralOnce({
  locationHref,
  sessionStorage,
  gtag,
  dedupe,
}: AiReferralInput) {
  if (dedupe.current) return false;

  try {
    const source = classifyReferralSource(locationHref);
    if (!source) return false;

    try {
      if (sessionStorage.getItem(AI_REFERRAL_SESSION_KEY)) {
        dedupe.current = true;
        return false;
      }
    } catch {
      // In-memory dedupe still prevents repeated events while this page is mounted.
    }

    dedupe.current = true;
    try {
      sessionStorage.setItem(AI_REFERRAL_SESSION_KEY, "1");
    } catch {
      // Reporting remains available when browser storage is restricted.
    }

    gtag("event", "ai_referral", { source });
    return true;
  } catch {
    return false;
  }
}
