export function classifyReferralSource(locationHref: string) {
  const current = new URL(locationHref);
  const campaign = current.searchParams.get("utm_source")?.toLowerCase();
  return campaign === "chatgpt.com" ? "chatgpt.com" : null;
}
