import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { EDITORIAL_SLOTS } from "../src/lib/product-imagery/editorial-assets";
import {
  buildPilotPrompt,
  PRODUCT_CONTRACTS,
} from "../scripts/product_imagery/pilot-prompts";

test("pilot prompt builder emits 20 concrete Chinese prompts", () => {
  const prompts = Object.keys(PRODUCT_CONTRACTS).flatMap((slug) =>
    EDITORIAL_SLOTS.map((slot) => buildPilotPrompt(slug, slot)),
  );

  assert.equal(prompts.length, 20);
  for (const prompt of prompts) {
    assert.match(prompt, /\u4ea7\u54c1\u8eab\u4efd\u4f18\u5148\u7ea7\u9ad8\u4e8e\u98ce\u683c\u53c2\u8003/);
    assert.match(prompt, /4:5/);
    assert.match(prompt, /1600x2000/);
    assert.doesNotMatch(prompt, /TBD|TODO|SKU_PLACEHOLDER|\u5360\u4f4d/);
  }
});

test("each slot preserves the exact product identity contract", () => {
  for (const [slug, contract] of Object.entries(PRODUCT_CONTRACTS)) {
    for (const slot of EDITORIAL_SLOTS) {
      assert.match(buildPilotPrompt(slug, slot), new RegExp(contract.identity));
    }

    assert.match(buildPilotPrompt(slug, "on-model"), new RegExp(contract.casting));
    assert.match(buildPilotPrompt(slug, "main"), /\u65e0\u6a21\u7279/);
    assert.match(buildPilotPrompt(slug, "macro"), /\u4e0d\u5f97\u865a\u6784\u90e8\u4ef6/);
    assert.match(buildPilotPrompt(slug, "lifestyle"), /\u5730\u4e2d\u6d77\u573a\u666f/);
  }
});

test("the prompt builder rejects unknown slugs", () => {
  assert.throws(() => buildPilotPrompt("unknown-sku", "main"), /Unknown pilot SKU/);
});

test("the CLI prints four JSON prompts and rejects an unknown slug", () => {
  const cli = ["--import", "tsx", "scripts/product_imagery/pilot-prompts.ts"];
  const valid = spawnSync(process.execPath, [...cli, "--slug", "pearl-series-01"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  assert.equal(valid.status, 0, valid.stderr);

  const output = JSON.parse(valid.stdout) as Array<{ slot: string; prompt: string }>;
  assert.deepEqual(output.map(({ slot }) => slot), EDITORIAL_SLOTS);
  assert.equal(output.length, 4);

  const invalid = spawnSync(process.execPath, [...cli, "--slug", "unknown-sku"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  assert.equal(invalid.status, 1);
});
