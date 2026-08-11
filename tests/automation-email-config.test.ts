import assert from "node:assert/strict";
import test from "node:test";
import { readAutomationEmailConfig } from "../src/lib/operations/automation-email-config";

test("automation email fails closed without explicit recipient and verified sender", () => {
  assert.throws(() => readAutomationEmailConfig({}), /ADMIN_EMAIL/);
  assert.throws(() => readAutomationEmailConfig({ ADMIN_EMAIL: "ops@example.net" }), /RESEND_API_KEY/);
  assert.throws(() => readAutomationEmailConfig({ ADMIN_EMAIL: "ops@example.net", RESEND_API_KEY: "key" }), /RESEND_FROM_EMAIL/);
});

test("automation email accepts only explicit verified configuration", () => {
  assert.deepEqual(readAutomationEmailConfig({
    ADMIN_EMAIL: "ops@example.net",
    RESEND_API_KEY: "key",
    RESEND_FROM_EMAIL: "Maverenne <sender@example.net>",
  }), { apiKey: "key", from: "Maverenne <sender@example.net>", recipient: "ops@example.net" });
});
