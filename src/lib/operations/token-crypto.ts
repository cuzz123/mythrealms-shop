import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;
const AUTH_TAG_BYTES = 16;
const ENVELOPE_VERSION = "v1";

export class TokenCryptoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenCryptoError";
  }
}

function readEncryptionKey(encodedKey: string): Buffer {
  const key = Buffer.from(encodedKey, "base64");

  if (key.length !== 32) {
    throw new TokenCryptoError(
      "AUTOMATION_ENCRYPTION_KEY must be a base64-encoded 32-byte key.",
    );
  }

  return key;
}

function readEnvelopePart(value: string, expectedLength: number): Buffer {
  const part = Buffer.from(value, "base64url");

  if (part.length !== expectedLength) {
    throw new TokenCryptoError("Encrypted token envelope is invalid.");
  }

  return part;
}

export function encryptSecret(plaintext: string, encodedKey: string): string {
  const key = readEncryptionKey(encodedKey);
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_BYTES });
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    ENVELOPE_VERSION,
    iv.toString("base64url"),
    authTag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
}

export function decryptSecret(envelope: string, encodedKey: string): string {
  const [version, ivValue, authTagValue, ciphertextValue, ...extra] = envelope.split(".");

  if (
    version !== ENVELOPE_VERSION ||
    !ivValue ||
    !authTagValue ||
    ciphertextValue === undefined ||
    extra.length > 0
  ) {
    throw new TokenCryptoError("Encrypted token envelope is invalid.");
  }

  try {
    const decipher = createDecipheriv(
      ALGORITHM,
      readEncryptionKey(encodedKey),
      readEnvelopePart(ivValue, IV_BYTES),
      { authTagLength: AUTH_TAG_BYTES },
    );
    decipher.setAuthTag(readEnvelopePart(authTagValue, AUTH_TAG_BYTES));

    return Buffer.concat([
      decipher.update(Buffer.from(ciphertextValue, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  } catch (error) {
    if (error instanceof TokenCryptoError) {
      throw error;
    }

    throw new TokenCryptoError("Encrypted token could not be authenticated.");
  }
}
