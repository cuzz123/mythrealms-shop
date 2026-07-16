import assert from "node:assert/strict";
import test from "node:test";

import {
  TokenCryptoError,
  decryptSecret,
  encryptSecret,
} from "../src/lib/operations/token-crypto";

const PRIMARY_KEY = Buffer.alloc(32, 7).toString("base64");
const OTHER_KEY = Buffer.alloc(32, 9).toString("base64");

test("encrypts and decrypts an Outlook refresh token without exposing its plaintext", () => {
  const encrypted = encryptSecret("refresh-token-value", PRIMARY_KEY);

  assert.notEqual(encrypted, "refresh-token-value");
  assert.equal(decryptSecret(encrypted, PRIMARY_KEY), "refresh-token-value");
});

test("rejects ciphertext when the encryption key does not authenticate it", () => {
  const encrypted = encryptSecret("refresh-token-value", PRIMARY_KEY);

  assert.throws(
    () => decryptSecret(encrypted, OTHER_KEY),
    TokenCryptoError,
  );
});

test("rejects malformed or incorrectly sized encryption keys", () => {
  assert.throws(
    () => encryptSecret("refresh-token-value", "not-a-32-byte-key"),
    TokenCryptoError,
  );
});
