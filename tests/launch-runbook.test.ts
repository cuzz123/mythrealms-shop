import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const runbook = readFileSync(
  path.join(process.cwd(), "docs/runbooks/paypal-only-launch.md"),
  "utf8",
);

const headings = [
  "# PayPal-Only Production Launch",
  "## Authority Boundary",
  "## 1. Record And Back Up",
  "## 2. Read-Only Gate",
  "## 3. Additive Database Change",
  "## 4. Provider And Sender",
  "## 5. Pre-Money Smoke Test",
  "## 6. Authorized Live Probe",
  "## 7. Rollback And Reconciliation",
] as const;

function section(candidate: string, heading: (typeof headings)[number]) {
  const headingIndex = headings.indexOf(heading);
  const start = candidate.indexOf(heading) + heading.length;
  const nextHeading = headings[headingIndex + 1];
  const end = nextHeading ? candidate.indexOf(nextHeading, start) : candidate.length;
  return candidate.slice(start, end).trim();
}

function assertNoForbiddenSurface(candidate: string) {
  const normalized = candidate.replace(/\r\n/g, "\n");
  const allowedPushWarning = "Never use `prisma db push`.";
  assert.equal(normalized.split(allowedPushWarning).length - 1, 1);
  const forbiddenSurface = normalized.replace(allowedPushWarning, "");
  assert.doesNotMatch(forbiddenSurface, /\b(?:npx\s+)?prisma\s+db\s+push\b/i);
  assert.doesNotMatch(normalized, /\bdrop\s+column\b/i);
  assert.doesNotMatch(normalized, /\bPAYPAL_CLIENT_SECRET\s*=/i);
}

function assertSafeRunbook(candidate: string) {
  const normalized = candidate.replace(/\r\n/g, "\n");
  assert.deepEqual(normalized.match(/^#{1,6}\s+.+$/gm) ?? [], headings);
  assertNoForbiddenSurface(normalized);

  assert.equal(
    section(normalized, "## Authority Boundary"),
    "This document does not authorize database writes, deployment, PayPal webhook changes, a charge, or a refund. Obtain explicit user authorization before each production mutation and before the live-money probe.",
  );

  const recordAndBackup = section(normalized, "## 1. Record And Back Up");
  assert.match(recordAndBackup, /Record the production database backup/);
  assert.match(recordAndBackup, /Record the current deployment ID/);

  const readOnlyGate = section(normalized, "## 2. Read-Only Gate");
  assert.match(readOnlyGate, /Run `npm run launch:check`\. Stop on any failure\./);

  const databaseChange = section(normalized, "## 3. Additive Database Change");
  assert.match(
    databaseChange,
    /^`npx prisma db execute --file prisma\/sql\/2026-07-15-order-confirmation-columns\.sql --schema prisma\/schema\.prisma`$/m,
  );
  assert.match(databaseChange, /Run `npm run launch:check` again\./);

  const providerAndSender = section(normalized, "## 4. Provider And Sender");
  assert.match(providerAndSender, /PAYMENT\.CAPTURE\.COMPLETED/);
  assert.match(providerAndSender, /PAYMENT\.CAPTURE\.REFUNDED/);
  assert.match(providerAndSender, /RESEND_FROM_EMAIL/);

  const smokeTest = section(normalized, "## 5. Pre-Money Smoke Test");
  assert.match(smokeTest, /Checkout shows PayPal only\./);
  assert.match(smokeTest, /Disabled legacy checkout returns 410 without creating an order\./);
  assert.match(smokeTest, /Admin renders a static snapshot item and current shipping address\./);
  assert.match(smokeTest, /Admin cannot mark `PAID` or `REFUNDED`\./);
  assert.match(smokeTest, /An unsigned PayPal webhook is rejected\./);

  const liveProbe = section(normalized, "## 6. Authorized Live Probe");
  assert.equal(
    liveProbe,
    "After separate explicit user authorization, make one small real purchase. Verify `PENDING -> PAID`, the brand-sender email, and the exact admin item/address. Initiate the refund in PayPal, never in admin. A partial refund must not claim `REFUNDED`; cumulative/full refund confirmation must produce `REFUNDED`.",
  );

  const rollback = section(normalized, "## 7. Rollback And Reconciliation");
  assert.equal(
    rollback,
    "Before capture, restore the prior deployment if smoke tests fail. After a capture/app-write failure, never capture the order a second time; query PayPal by provider order/custom ID and reconcile manually. Keep the two nullable confirmation columns during application rollback. Do not use a destructive down migration.",
  );
}

function replace(candidate: string, expected: string, replacement: string) {
  assert.ok(candidate.includes(expected), `fixture source is missing: ${expected}`);
  return candidate.replace(expected, replacement);
}

function assertInOrder(candidate: string, expected: readonly RegExp[]) {
  let offset = 0;
  for (const pattern of expected) {
    const match = pattern.exec(candidate.slice(offset));
    assert.ok(match, `missing ordered runbook step: ${pattern}`);
    offset += match.index + match[0].length;
  }
}

test("PayPal launch runbook contains every safety gate", () => {
  assertSafeRunbook(runbook);
});

test("rejects runbooks with reordered safety sections", () => {
  const reordered = replace(
    replace(
      replace(runbook, "## 1. Record And Back Up", "## TEMP"),
      "## 2. Read-Only Gate",
      "## 1. Record And Back Up",
    ),
    "## TEMP",
    "## 2. Read-Only Gate",
  );

  assert.throws(() => assertSafeRunbook(reordered));
});

test("rejects runbooks that weaken authorization or live-money semantics", () => {
  const unsafeVariants = [
    replace(
      runbook,
      "This document does not authorize database writes, deployment, PayPal webhook changes, a charge, or a refund. Obtain explicit user authorization before each production mutation and before the live-money probe.",
      "This document authorizes production mutations. A later appendix mentions explicit user authorization.",
    ),
    replace(
      runbook,
      "After separate explicit user authorization, make one small real purchase.",
      "After separate explicit user authorization, make two small real purchases.",
    ),
    replace(
      runbook,
      "After separate explicit user authorization, make one small real purchase.",
      "After separate explicit user authorization, make one small real purchase. Then make another real purchase.",
    ),
    replace(runbook, "`PENDING -> PAID`", "`PAID -> PENDING`"),
    replace(
      runbook,
      "A partial refund must not claim `REFUNDED`; cumulative/full refund confirmation must produce `REFUNDED`.",
      "A partial refund may claim `REFUNDED`; cumulative/full refund confirmation may also produce `REFUNDED`.",
    ),
    replace(
      runbook,
      "`npx prisma db execute --file prisma/sql/2026-07-15-order-confirmation-columns.sql --schema prisma/schema.prisma`",
      "`echo prisma/sql/2026-07-15-order-confirmation-columns.sql`",
    ),
  ];

  for (const unsafe of unsafeVariants) {
    assert.throws(() => assertSafeRunbook(unsafe));
  }
});

test("rejects runbooks that weaken rollback and reconciliation", () => {
  const unsafeVariants = [
    replace(
      runbook,
      "Before capture, restore the prior deployment if smoke tests fail.",
      "Before capture, keep the failed deployment active.",
    ),
    replace(
      runbook,
      "After a capture/app-write failure, never capture the order a second time; query PayPal by provider order/custom ID and reconcile manually.",
      "The phrase never capture the order a second time is historical; retry capture without PayPal reconciliation.",
    ),
    replace(
      runbook,
      "Keep the two nullable confirmation columns during application rollback.",
      "Remove the two nullable confirmation columns during application rollback.",
    ),
    replace(
      runbook,
      "Do not use a destructive down migration.",
      "Use a destructive down migration.",
    ),
    replace(
      runbook,
      "Do not use a destructive down migration.",
      "Do not use a destructive down migration. A destructive down migration is nevertheless allowed.",
    ),
  ];

  for (const unsafe of unsafeVariants) {
    assert.throws(() => assertSafeRunbook(unsafe));
  }
});

test("rejects disguised destructive commands and secret assignments", () => {
  assert.doesNotThrow(() => assertNoForbiddenSurface(runbook));

  for (const forbidden of [
    "- `nPx PrIsMa Db PuSh`",
    "> `Prisma Db Push`",
    "`DrOp CoLuMn confirmationSentAt`",
    "`paypal_client_secret = unsafe`",
  ]) {
    assert.throws(() => assertNoForbiddenSurface(`${runbook}\n${forbidden}\n`));
  }
});

test("the first complete read-only gate stops deployment without authorizing remediation", () => {
  const readOnlyGate = section(runbook, "## 2. Read-Only Gate");

  assert.match(readOnlyGate, /complete read-only gate/i);
  assert.match(readOnlyGate, /stop deployment on any failure/i);
  assert.match(readOnlyGate, /does not authorize remediation/i);
});

test("database remediation is a separately authorized additive branch followed by the complete gate", () => {
  const databaseChange = section(runbook, "## 3. Additive Database Change");

  assertInOrder(databaseChange, [
    /database-schema failure/i,
    /separate database-write authorization/i,
    /^`npx prisma db execute --file prisma\/sql\/2026-07-15-order-confirmation-columns\.sql --schema prisma\/schema\.prisma`$/m,
    /rerun the complete read-only gate/i,
  ]);
});

test("provider and sender remediations require separate authority and a fresh complete gate", () => {
  const providerAndSender = section(runbook, "## 4. Provider And Sender");

  assertInOrder(providerAndSender, [
    /PayPal webhook mismatch/i,
    /separate provider-configuration authorization/i,
    /rerun the complete read-only gate/i,
    /Resend sender mismatch/i,
    /separate email-configuration authorization/i,
    /rerun the complete read-only gate/i,
    /proceed to .*Pre-Money Smoke Test.* only after every check passes/i,
  ]);
});
