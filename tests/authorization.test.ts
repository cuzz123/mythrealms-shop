import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  getAdminDecision,
  isSameOriginRequest,
} from "../src/lib/server/admin-auth";

test("reports unauthenticated when there is no signed-in user", () => {
  assert.equal(getAdminDecision(null), "unauthenticated");
  assert.equal(getAdminDecision({}), "unauthenticated");
});

test("reports forbidden for a signed-in customer", () => {
  assert.equal(
    getAdminDecision({ user: { id: "user-1", role: "CUSTOMER" } }),
    "forbidden",
  );
});

test("reports authenticated only for an admin session", () => {
  assert.equal(
    getAdminDecision({ user: { id: "admin-1", role: "ADMIN" } }),
    "authenticated",
  );
});

const adminApiRoutes = [
  "src/app/api/admin/assets/route.ts",
  "src/app/api/admin/assets/[id]/route.ts",
  "src/app/api/admin/blog/route.ts",
  "src/app/api/admin/blog/[id]/route.ts",
  "src/app/api/admin/discounts/route.ts",
  "src/app/api/admin/discounts/[id]/route.ts",
  "src/app/api/admin/orders/route.ts",
  "src/app/api/admin/orders/[id]/route.ts",
  "src/app/api/admin/pinterest-drafts/route.ts",
  "src/app/api/admin/pinterest-drafts/[id]/route.ts",
  "src/app/api/admin/products/route.ts",
  "src/app/api/admin/products/[id]/route.ts",
  "src/app/api/admin/seo/route.ts",
  "src/app/api/studio/image/route.ts",
  "src/app/api/studio/video/route.ts",
  "src/app/api/automation/generate-pin/route.ts",
  "src/app/api/pinterest/token/route.ts",
  "src/app/api/upload/route.ts",
];

const cronRoutes = [
  "src/app/api/automation/daily-pinterest/route.ts",
  "src/app/api/automation/daily-report/route.ts",
  "src/app/api/automation/low-stock-alert/route.ts",
  "src/app/api/automation/send-daily-report/route.ts",
  "src/app/api/pinterest/publish/route.ts",
];

test("all sensitive API routes enforce their server-side guard", () => {
  for (const relativePath of adminApiRoutes) {
    const source = readFileSync(path.join(process.cwd(), relativePath), "utf8");
    assert.match(source, /requireAdminApi\(/, `${relativePath} needs admin auth`);
  }
  for (const relativePath of cronRoutes) {
    const source = readFileSync(path.join(process.cwd(), relativePath), "utf8");
    assert.match(source, /requireCron\(/, `${relativePath} needs cron auth`);
  }
});

test("every data-bearing admin page enforces authorization before querying", () => {
  for (const relativePath of [
    "src/app/admin/page.tsx",
    "src/app/admin/blog/page.tsx",
    "src/app/admin/products/page.tsx",
  ]) {
    const source = readFileSync(path.join(process.cwd(), relativePath), "utf8");
    const guardIndex = source.indexOf("await requireAdminPage(");
    const queryIndex = source.indexOf("db.");
    assert.ok(guardIndex >= 0, `${relativePath} needs its own page guard`);
    assert.ok(guardIndex < queryIndex, `${relativePath} must guard before reading data`);
  }
});

test("state-changing admin automation is POST-only and same-origin protected", () => {
  for (const relativePath of [
    "src/app/api/automation/generate-all-pins/route.ts",
    "src/app/api/automation/generate-tiktok-script/route.ts",
  ]) {
    const source = readFileSync(path.join(process.cwd(), relativePath), "utf8");
    assert.match(source, /export async function POST\(/);
    assert.doesNotMatch(source, /export async function GET\(/);
    assert.match(source, /requireAdminMutation\(/);
  }

  assert.equal(
    isSameOriginRequest("https://shop.example/api/task", "https://shop.example"),
    true,
  );
  assert.equal(
    isSameOriginRequest("https://shop.example/api/task", "https://evil.example"),
    false,
  );
  assert.equal(isSameOriginRequest("https://shop.example/api/task", null), false);
});

test("unfinished gift-card and debug surfaces are not public", () => {
  const giftPagePath = path.join(process.cwd(), "src/app/gift-cards/page.tsx");
  const giftApi = readFileSync(
    path.join(process.cwd(), "src/app/api/gift-cards/route.ts"),
    "utf8",
  );
  const debugApi = readFileSync(
    path.join(process.cwd(), "src/app/api/debug/discounts/route.ts"),
    "utf8",
  );

  assert.equal(existsSync(giftPagePath), false);
  assert.match(giftApi, /export async function GET\(/);
  assert.match(giftApi, /export async function POST\(/);
  assert.match(giftApi, /status:\s*404/g);
  assert.match(debugApi, /status:\s*404/);
});

test("checkout success rejects missing or unknown orders", () => {
  const successPage = readFileSync(
    path.join(process.cwd(), "src/app/checkout/success/page.tsx"),
    "utf8",
  );
  assert.match(successPage, /if \(!order\)\s*notFound\(\)/);
});

test("Pinterest OAuth callback never renders access tokens", () => {
  const callbackPage = readFileSync(
    path.join(process.cwd(), "src/app/pinterest/callback/page.tsx"),
    "utf8",
  );
  assert.doesNotMatch(callbackPage, /textarea|access_token|setToken/);
  assert.match(callbackPage, /isValidOAuthState\(/);

  const tokenRoute = readFileSync(
    path.join(process.cwd(), "src/app/api/pinterest/token/route.ts"),
    "utf8",
  );
  const tokenCookieBlock = tokenRoute.slice(tokenRoute.indexOf("response.cookies.set(TOKEN_COOKIE"));
  assert.doesNotMatch(tokenCookieBlock, /maxAge:\s*expiresIn/);
});
