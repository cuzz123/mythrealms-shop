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

function isValidSender(from: string): boolean {
  let address = from;
  const displayMailbox = /^([^<>]+)<([^<>]+)>$/.exec(from);
  if (displayMailbox) {
    if (!displayMailbox[1].trim()) return false;
    address = displayMailbox[2].trim();
  } else if (/[<>]/.test(from)) {
    return false;
  }

  if (address.length > 254) return false;

  const at = address.indexOf("@");
  if (at <= 0 || at !== address.lastIndexOf("@") || at === address.length - 1) {
    return false;
  }

  const local = address.slice(0, at);
  const domain = address.slice(at + 1);
  if (
    local.length > 64 ||
    !/^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*$/.test(
      local,
    )
  ) {
    return false;
  }

  if (domain.length > 253) return false;
  const labels = domain.split(".");
  return (
    labels.length >= 2 &&
    labels.every(
      (label) =>
        label.length <= 63 &&
        /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label),
    )
  );
}

export function readResendConfig(
  env: ResendEnvironment = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  },
): { apiKey: string; from: string } {
  const apiKey = env.RESEND_API_KEY?.trim();
  const rawFrom = env.RESEND_FROM_EMAIL;
  if (!apiKey) throw new ResendConfigError("RESEND_API_KEY is missing");
  if (!rawFrom?.trim()) {
    throw new ResendConfigError("RESEND_FROM_EMAIL is missing");
  }
  const from = rawFrom.trim();
  if (
    /[\u0000-\u001F\u007F]/.test(rawFrom) ||
    /onboarding@resend\.dev/i.test(from) ||
    !isValidSender(from)
  ) {
    throw new ResendConfigError("RESEND_FROM_EMAIL must be a verified sender");
  }
  return { apiKey, from };
}
