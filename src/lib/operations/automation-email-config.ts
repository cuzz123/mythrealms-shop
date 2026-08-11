import { readResendConfig } from "@/lib/server/resend-config";

type AutomationEmailEnv = Partial<Pick<NodeJS.ProcessEnv,
  "ADMIN_EMAIL" | "RESEND_API_KEY" | "RESEND_FROM_EMAIL"
>>;

export function readAutomationEmailConfig(env?: AutomationEmailEnv) {
  const source = env ?? {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  };
  const recipient = source.ADMIN_EMAIL?.trim();
  if (!recipient) throw new Error("ADMIN_EMAIL is missing");
  const { apiKey, from } = readResendConfig(source);
  return { apiKey, from, recipient };
}
