import assert from "node:assert/strict";
import test from "node:test";

import { auditBrandRoutes } from "../scripts/audit-brand-routes";

test("brand route audit never redirects unrelated routes to home", () => {
  const output = auditBrandRoutes([
    {
      path: "/guardian-quiz",
      clicks: 0,
      backlinks: 0,
      replacement: "/collections/pearl-series",
      brandConflict: true,
    },
  ]);

  assert.deepEqual(output[0], {
    path: "/guardian-quiz",
    action: "redirect",
    destination: "/collections/pearl-series",
    evidence: "zero-clicks-zero-backlinks-specific-replacement",
  });
  assert.notEqual(output[0].destination, "/");
});

test("brand route audit rewrites conflicting routes with search evidence in place", () => {
  assert.deepEqual(
    auditBrandRoutes([
      {
        path: "/pearls/stories",
        clicks: 4,
        backlinks: 0,
        replacement: "",
        brandConflict: true,
      },
    ]),
    [{
      path: "/pearls/stories",
      action: "rewrite",
      destination: "/pearls/stories",
      evidence: "search-or-backlink-evidence-rewrite-in-place",
    }],
  );
});

test("brand route audit keeps evidence-backed routes without a brand conflict", () => {
  assert.deepEqual(
    auditBrandRoutes([
      {
        path: "/pearls/care",
        clicks: 4,
        backlinks: 0,
        replacement: "/collections/pearl-series",
        brandConflict: false,
      },
    ]),
    [{
      path: "/pearls/care",
      action: "keep",
      destination: "/pearls/care",
      evidence: "search-or-backlink-evidence-no-brand-conflict",
    }],
  );
});

test("brand route audit keeps routes when external evidence is unavailable", () => {
  assert.deepEqual(
    auditBrandRoutes([
      {
        path: "/pearls/symbolism",
        clicks: "not_available",
        backlinks: "not_available",
        replacement: "",
        brandConflict: true,
      },
    ]),
    [{
      path: "/pearls/symbolism",
      action: "keep",
      destination: "/pearls/symbolism",
      evidence: "evidence-not-available-review-after-30-days",
    }],
  );
});

test("brand route audit keeps zero-evidence routes without a specific replacement", () => {
  assert.deepEqual(
    auditBrandRoutes([
      {
        path: "/blog/old-myth",
        clicks: 0,
        backlinks: 0,
        replacement: "",
        brandConflict: true,
      },
    ]),
    [{
      path: "/blog/old-myth",
      action: "keep",
      destination: "/blog/old-myth",
      evidence: "zero-clicks-zero-backlinks-no-specific-replacement",
    }],
  );
});
