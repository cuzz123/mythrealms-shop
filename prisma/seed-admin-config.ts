export type SeedAdminConfig = {
  email: string;
  password: string;
};

export function resolveSeedAdminConfig(
  env: Partial<
    Pick<NodeJS.ProcessEnv, "SEED_ADMIN_EMAIL" | "SEED_ADMIN_PASSWORD">
  >,
): SeedAdminConfig | null {
  const email = env.SEED_ADMIN_EMAIL?.trim();
  const password = env.SEED_ADMIN_PASSWORD;

  if (Boolean(email) !== Boolean(password)) {
    throw new Error(
      "SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be provided together",
    );
  }
  if (!email || !password) {
    return null;
  }
  if (password.length < 12) {
    throw new Error("SEED_ADMIN_PASSWORD must contain at least 12 characters");
  }

  return { email, password };
}
