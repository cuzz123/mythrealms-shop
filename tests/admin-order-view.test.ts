import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  parseAdminShippingAddress,
  toAdminOrderItemView,
} from "../src/lib/orders/admin-order-view";

const base = {
  id: "item-1",
  quantity: 2,
  price: 29.99,
  variant: null,
};

test("linked product wins and preserves line facts", () => {
  assert.deepEqual(
    toAdminOrderItemView({
      ...base,
      productSnapshot: JSON.stringify({ name: "Snapshot", slug: "snapshot" }),
      product: {
        name: "Linked Pearl",
        slug: "linked-pearl",
        images: JSON.stringify(["/linked.webp"]),
      },
    }),
    {
      id: "item-1",
      quantity: 2,
      price: 29.99,
      name: "Linked Pearl",
      slug: "linked-pearl",
      image: "/linked.webp",
      variantName: null,
    },
  );
});

test("null relation falls back to the static product snapshot", () => {
  const result = toAdminOrderItemView({
    ...base,
    product: null,
    productSnapshot: JSON.stringify({
      name: "Snapshot Pearl",
      slug: "pearl-series-01",
      image: "/snapshot.webp",
    }),
  });
  assert.equal(result.name, "Snapshot Pearl");
  assert.equal(result.slug, "pearl-series-01");
  assert.equal(result.image, "/snapshot.webp");
});

test("missing or corrupt snapshots degrade without a broken link", () => {
  for (const productSnapshot of [null, "{broken", "[]"]) {
    const result = toAdminOrderItemView({
      ...base,
      product: null,
      productSnapshot,
    });
    assert.equal(result.name, "Unknown item");
    assert.equal(result.slug, null);
    assert.equal(result.image, null);
  }
});

test("address prefers current address and supports legacy line1", () => {
  assert.equal(
    parseAdminShippingAddress(
      JSON.stringify({ address: "123 Pearl St", line1: "legacy" }),
    )?.address,
    "123 Pearl St",
  );
  assert.equal(
    parseAdminShippingAddress(JSON.stringify({ line1: "456 Legacy Rd" }))?.address,
    "456 Legacy Rd",
  );
  assert.equal(parseAdminShippingAddress("{broken"), null);
});

test("admin detail API normalizes items and address after authorization", () => {
  const route = readFileSync(
    path.join(process.cwd(), "src/app/api/admin/orders/[id]/route.ts"),
    "utf8",
  );
  const getHandler = route.slice(
    route.indexOf("export async function GET"),
    route.indexOf("export async function PATCH"),
  );
  const guardIndex = Math.max(
    getHandler.indexOf("requireAdminApi()"),
    getHandler.indexOf("await auth()"),
  );
  assert.notEqual(guardIndex, -1);
  assert.ok(guardIndex < getHandler.indexOf("await params"));
  assert.match(route, /productSnapshot: true/);
  assert.match(route, /parseAdminShippingAddress\(shippingAddress\)/);
  assert.match(route, /items: items\.map\(toAdminOrderItemView\)/);
});

test("admin page never dereferences a nullable product relation", () => {
  const page = readFileSync(
    path.join(process.cwd(), "src/app/admin/orders/[id]/page.tsx"),
    "utf8",
  );
  assert.doesNotMatch(page, /item\.product\.(slug|name)/);
  assert.match(page, /item\.slug/);
});
