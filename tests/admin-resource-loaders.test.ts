import assert from "node:assert/strict";
import test from "node:test";

import {
  loadOperationsSnapshot,
  loadPinterestDrafts,
} from "../src/lib/client/admin-resource-loaders";

test("operations loader preserves successful endpoints when another endpoint fails", async () => {
  const fetcher = async (input: string | URL | Request) => {
    const url = String(input);
    if (url.endsWith("/candidates")) return Response.json([{ id: "candidate-1" }]);
    if (url.endsWith("/inbox")) {
      return Response.json({ events: [{ id: "event-1" }], connection: { status: "connected" } });
    }
    return Response.json({ error: "report unavailable" }, { status: 503 });
  };

  assert.deepEqual(await loadOperationsSnapshot(fetcher), {
    candidates: [{ id: "candidate-1" }],
    inbox: { events: [{ id: "event-1" }], connection: { status: "connected" } },
  });
});

test("operations loader rejects transport failures", async () => {
  await assert.rejects(
    loadOperationsSnapshot(async () => {
      throw new Error("offline");
    }),
    /offline/,
  );
});

test("Pinterest loader returns drafts and rejects non-success responses", async () => {
  const drafts = [{ id: "draft-1", title: "First draft" }];
  assert.deepEqual(
    await loadPinterestDrafts(async () => Response.json({ drafts })),
    drafts,
  );
  await assert.rejects(
    loadPinterestDrafts(async () =>
      Response.json({ error: "queue unavailable" }, { status: 503 }),
    ),
    /queue unavailable/,
  );
});
