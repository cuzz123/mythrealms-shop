import assert from "node:assert/strict";
import test from "node:test";

import {
  createOAuthState,
  isValidOAuthState,
} from "../src/lib/server/oauth-state";

test("creates high-entropy OAuth state values", () => {
  const first = createOAuthState();
  const second = createOAuthState();
  assert.notEqual(first, second);
  assert.ok(first.length >= 32);
});

test("accepts only an exact OAuth state cookie match", () => {
  const state = createOAuthState();
  assert.equal(isValidOAuthState(state, state), true);
  assert.equal(isValidOAuthState(undefined, state), false);
  assert.equal(isValidOAuthState(state, undefined), false);
  assert.equal(isValidOAuthState(`${state}x`, state), false);
  assert.equal(isValidOAuthState("different", state), false);
});
