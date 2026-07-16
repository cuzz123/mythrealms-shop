import crypto from "crypto";

export function createOAuthState(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function isValidOAuthState(
  received: string | null | undefined,
  expected: string | null | undefined,
): boolean {
  if (!received || !expected) return false;
  const receivedBuffer = Buffer.from(received, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return (
    receivedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}
