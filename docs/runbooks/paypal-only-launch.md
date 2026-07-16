# PayPal-Only Production Launch

## Authority Boundary

This document does not authorize database writes, deployment, PayPal webhook changes, a charge, or a refund. Obtain explicit user authorization before each production mutation and before the live-money probe.

## 1. Record And Back Up

- Record the production database backup and verify it can be restored.
- Record the current deployment ID and public origin.
- Confirm `NEXT_PUBLIC_APP_URL` and `AUTH_URL` are the same HTTPS origin.

## 2. Read-Only Gate

Run `npm run launch:check`. Stop on any failure. Treat this as the complete read-only gate: stop deployment on any failure. This first gate does not authorize remediation. Do not print or paste secrets.

## 3. Additive Database Change

Only when the complete read-only gate reports a database-schema failure, and only after separate database-write authorization, run:

`npx prisma db execute --file prisma/sql/2026-07-15-order-confirmation-columns.sql --schema prisma/schema.prisma`

Run `npm run launch:check` again. Rerun the complete read-only gate and stop deployment on any remaining failure. Never use `prisma db push`.

## 4. Provider And Sender

- If the complete read-only gate reports a PayPal webhook mismatch, stop. Only after separate provider-configuration authorization, correct the live webhook URL so it ends in `/api/webhooks/paypal` and require `PAYMENT.CAPTURE.COMPLETED` and `PAYMENT.CAPTURE.REFUNDED`.
- After that authorized correction, rerun the complete read-only gate and stop on any failure.
- If the complete read-only gate reports a Resend sender mismatch, stop. Only after separate email-configuration authorization, correct `RESEND_FROM_EMAIL` to a sender verified inside Resend.
- After that authorized correction, rerun the complete read-only gate and stop on any failure.
- Proceed to the Pre-Money Smoke Test only after every check passes.

## 5. Pre-Money Smoke Test

- Checkout shows PayPal only.
- Disabled legacy checkout returns 410 without creating an order.
- Admin renders a static snapshot item and current shipping address.
- Admin cannot mark `PAID` or `REFUNDED`.
- An unsigned PayPal webhook is rejected.

## 6. Authorized Live Probe

After separate explicit user authorization, make one small real purchase. Verify `PENDING -> PAID`, the brand-sender email, and the exact admin item/address. Initiate the refund in PayPal, never in admin. A partial refund must not claim `REFUNDED`; cumulative/full refund confirmation must produce `REFUNDED`.

## 7. Rollback And Reconciliation

Before capture, restore the prior deployment if smoke tests fail. After a capture/app-write failure, never capture the order a second time; query PayPal by provider order/custom ID and reconcile manually. Keep the two nullable confirmation columns during application rollback. Do not use a destructive down migration.
