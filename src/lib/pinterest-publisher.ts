export type PinterestPinInput = {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
};

export const PINTEREST_PUBLISHING_DISABLED_MESSAGE =
  "Pinterest external publishing is disabled for this internal-only local candidate.";

export const PINTEREST_PUBLISHING_DISABLED_STATUS = 503;

export type PinterestPublishEntrypoint =
  | "direct_publish"
  | "daily_automation"
  | "pinterest_cron"
  | "admin_publish"
  | "admin_retry"
  | "admin_ui"
  | "n8n_adapter";

export function getPinterestPublishBlock(entrypoint: PinterestPublishEntrypoint) {
  return {
    error: PINTEREST_PUBLISHING_DISABLED_MESSAGE,
    status: "internal_only_publish_blocked" as const,
    entrypoint,
    attempted: 0,
    published: 0,
  };
}

export async function publishPinterestPin(
  input: PinterestPinInput,
): Promise<{ pinId: string }> {
  void input;
  throw new Error(PINTEREST_PUBLISHING_DISABLED_MESSAGE);
}
