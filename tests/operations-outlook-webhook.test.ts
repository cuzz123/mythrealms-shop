import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  OutlookWebhookVerificationError,
  getGraphValidationResponse,
  parseGraphMessageNotifications,
} from "../src/lib/operations/outlook-webhook";

const expected = {
  clientState: "client-state-secret",
  subscriptionId: "subscription-123",
};
const routePath = join(process.cwd(), "src/app/api/webhooks/outlook/route.ts");

test("returns Graph's decoded validation token as plain text", () => {
  assert.equal(
    getGraphValidationResponse("opaque+token/with=characters"),
    "opaque+token/with=characters",
  );
});

test("accepts only the configured subscription and client state", () => {
  const notifications = parseGraphMessageNotifications(
    {
      value: [
        {
          subscriptionId: "subscription-123",
          clientState: "client-state-secret",
          changeType: "created",
          resourceData: { id: "message-1" },
        },
        {
          subscriptionId: "subscription-123",
          clientState: "client-state-secret",
          changeType: "created",
          resourceData: { id: "message-1" },
        },
      ],
    },
    expected,
  );

  assert.deepEqual(notifications, [{ messageId: "message-1" }]);
});

test("rejects a notification with an unexpected client state", () => {
  assert.throws(
    () =>
      parseGraphMessageNotifications(
        {
          value: [
            {
              subscriptionId: "subscription-123",
              clientState: "wrong-state",
              changeType: "created",
              resourceData: { id: "message-1" },
            },
          ],
        },
        expected,
      ),
    OutlookWebhookVerificationError,
  );
});

test("the webhook route validates first and queues idempotent work before replying", () => {
  const source = readFileSync(routePath, "utf8");

  assert.match(source, /getGraphValidationResponse/);
  assert.match(source, /parseGraphMessageNotifications/);
  assert.match(source, /createMany/);
  assert.match(source, /skipDuplicates:\s*true/);
  assert.match(source, /after\(/);
  assert.match(source, /processMailboxEvent/);
  assert.match(source, /getOperationsOutlookConfig/);
  assert.match(source, /status:\s*202/);
  assert.doesNotMatch(source, /requireAdminApi/);
});
