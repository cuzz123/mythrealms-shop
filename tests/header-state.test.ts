import assert from "node:assert/strict";
import test from "node:test";

import {
  getHeaderVisualState,
  takePendingMenuFocus,
} from "../src/lib/client/header-state";

test("header is solid off-home and crosses the home half-viewport threshold", () => {
  assert.equal(getHeaderVisualState("/gifts", 0, 900), "solid");
  assert.equal(getHeaderVisualState("/", 449, 900), "overlay");
  assert.equal(getHeaderVisualState("/", 451, 900), "solid");
});

test("pending desktop focus is consumed only by the matching open menu", () => {
  assert.equal(takePendingMenuFocus("shop", "shop"), "shop");
  assert.equal(takePendingMenuFocus("shop", "gifts"), null);
  assert.equal(takePendingMenuFocus(null, "shop"), null);
});
