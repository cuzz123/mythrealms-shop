export class ResendConfigError extends Error {
  readonly status = 503;

  constructor(message: string) {
    super(message);
    this.name = "ResendConfigError";
  }
}

type ResendEnvironment = Partial<
  Pick<NodeJS.ProcessEnv, "RESEND_API_KEY" | "RESEND_FROM_EMAIL">
>;

export function readResendConfig(
  env: ResendEnvironment = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  },
): { apiKey: string; from: string } {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey) throw new ResendConfigError("RESEND_API_KEY is missing");
  if (!from) throw new ResendConfigError("RESEND_FROM_EMAIL is missing");
  const senderPattern =
    /^(?:[^<>]+<[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+>|[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+)$/;
  if (/onboarding@resend\.dev/i.test(from) || !senderPattern.test(from)) {
    throw new ResendConfigError("RESEND_FROM_EMAIL must be a verified sender");
  }
  return { apiKey, from };
}
