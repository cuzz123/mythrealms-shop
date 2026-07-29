import assert from "node:assert/strict";
import test from "node:test";

import {
  parseCompletedTasks,
  parseExpandedCategories,
  writeSocialTaskState,
} from "../src/lib/client/social-task-storage";

test("social task storage restores valid persisted records", () => {
  assert.deepEqual(
    parseCompletedTasks('{"pin-post":"2026-07-29","ga-realtime":"2026-07-28"}'),
    { "pin-post": "2026-07-29", "ga-realtime": "2026-07-28" },
  );
  assert.deepEqual(
    parseExpandedCategories('{"Pinterest":true,"Analytics":false}'),
    { Pinterest: true, Analytics: false },
  );
});

test("social task storage treats malformed or wrong-shaped values as empty", () => {
  for (const value of [null, "not json", "[]", '{"pin-post":true}']) {
    assert.deepEqual(parseCompletedTasks(value), {});
  }
  for (const value of [null, "not json", "[]", '{"Pinterest":"yes"}']) {
    assert.deepEqual(parseExpandedCategories(value), {});
  }
});

test("social task updates persist both records without erasing either one", () => {
  const writes = new Map<string, string>();
  const storage = {
    setItem(key: string, value: string) {
      writes.set(key, value);
    },
  };

  writeSocialTaskState(
    storage,
    { "pin-post": "2026-07-29" },
    { Pinterest: true },
  );

  assert.equal(writes.get("mythrealms-tasks"), '{"pin-post":"2026-07-29"}');
  assert.equal(writes.get("mythrealms-tasks-expanded"), '{"Pinterest":true}');
});
