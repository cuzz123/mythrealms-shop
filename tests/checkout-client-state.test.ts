import assert from "node:assert/strict";
import test from "node:test";

import {
  getKeyedValue,
  schedulePayPalUnavailable,
} from "../src/lib/checkout/client-state";

test("a discount preview is visible only for the cart that produced it", () => {
  const state = { key: "sku-1:1", value: { discount: 10 } };

  assert.deepEqual(getKeyedValue(state, "sku-1:1"), { discount: 10 });
  assert.equal(getKeyedValue(state, ""), null);
  assert.equal(getKeyedValue(state, "sku-2:1"), null);
});

test("PayPal unavailable reporting is deferred and cancellable", () => {
  const scheduled: Array<() => void> = [];
  const messages: string[] = [];
  const cancel = schedulePayPalUnavailable(
    (message) => messages.push(message),
    (callback) => scheduled.push(callback),
  );

  assert.deepEqual(messages, []);
  scheduled[0]();
  assert.deepEqual(messages, ["PayPal could not be loaded. Please refresh and try again."]);

  const cancelledMessages: string[] = [];
  const cancelledTasks: Array<() => void> = [];
  const cancelBeforeRun = schedulePayPalUnavailable(
    (message) => cancelledMessages.push(message),
    (callback) => cancelledTasks.push(callback),
  );
  cancelBeforeRun();
  cancelledTasks[0]();
  assert.deepEqual(cancelledMessages, []);

  cancel();
});
