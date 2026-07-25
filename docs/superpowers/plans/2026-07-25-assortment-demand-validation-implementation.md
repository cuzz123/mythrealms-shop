# MythRealms 12-SKU Assortment Demand Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不下架商品、不投广告、不更改价格/商品页/CTA 的前提下，上线并运行一轮可归因、可复核的 14 天 Pinterest 铺货需求验证，从 12 款商品中识别最多 3 款值得进入下一轮供应链和转化投入的候选。

**Architecture:** 使用一个纯 TypeScript 实验清单作为 12 个 SKU、24 个 Pin、UTM 和排名规则的唯一机器可读来源；现有商品页继续负责 `view_item`，购物车继续负责 `add_to_cart`，GA4 依靠首次落地 UTM 做会话归因。经营订单通过数据库 `isTestOrder` 字段永久排除测试订单。内容、平台数据和 GA4 数据汇入固定 CSV，再由确定性分析脚本生成 Day 7 / Day 14 / Day 21 报告。生产发布只包含已验证的测量、移动 CTA 和本实验所需的最小变更。

**Tech Stack:** Next.js 16.2.6 App Router、React 19、TypeScript、Prisma 5/PostgreSQL、GA4、Pinterest Business、Node test runner、Playwright、Markdown/CSV。

## Global Constraints

- `new-series-006` 只是首批 12 款之一，不是唯一主推；所有 63 件公开商品保持原有目录、搜索、Quiz、直链、加购与结账状态。
- 不下架、不隐藏、不停售任何商品；不改商品价格、商品页结构、页面 CTA、折扣或库存状态。
- 不投付费广告；Pinterest 是本轮唯一 SKU 排名渠道。TikTok、SEO 和品牌内容可以继续，但不得并入 SKU 胜负数据。
- 24 条 Pin 只使用可观察视觉描述，不新增天然珍珠、mother-of-pearl、925 银、低敏、防过敏、不褪色、库存或配送承诺。
- 15 笔历史测试订单不删除；写入明确的持久化标记后，永久排除客户、订单、营收、转化、复购、客服与评价指标。
- Day 0 前不得公开启动队列。Day 0 必须同时满足：clean build、生产 smoke、GA4 外部接收、consent 验证、Pinterest 指标可读、24 条内容 QA、12 个目标页移动端可访问与可加购。
- 任何数据库结构变更先在本地/测试数据库验证；生产应用 `prisma db push` 时不得使用 `--accept-data-loss`。
- 当前工作区存在大量他人改动。每个任务只暂存该任务列出的文件；禁止执行 `git add .`、`git reset --hard` 或覆盖无关改动。

---

## Task 1: 恢复可重复的本地验证环境

**Files + Interfaces:**

- Verify: `D:/mythrealms-shop/package-lock.json`
- Verify: `D:/mythrealms-shop/package.json`
- Verify: `D:/mythrealms-shop/prisma/schema.prisma`
- Modify only if a script is missing: `D:/mythrealms-shop/package.json`
- Interface: `npm ci` → `npm run db:generate` → unit/lint/build commands all resolve from the lockfile.

- [ ] **Step 1: Record the current dependency failure without editing source**

Run:

```powershell
Test-Path node_modules/@prisma/client/index.js
Test-Path node_modules/@playwright/test/cli.js
npm ls @prisma/client prisma @playwright/test --depth=0
```

Expected: current incomplete packages are explicitly visible; do not treat the old `.next` cache as build evidence.

- [ ] **Step 2: Restore dependencies from the committed lockfile**

Run:

```powershell
npm ci
npm run db:generate
```

Expected: both package paths exist and `node -e "require('@prisma/client')"` exits 0. If registry access fails, stop this task and retry the same lockfile install later; do not change package versions as a workaround.

- [ ] **Step 3: Establish the pre-change baseline**

Run:

```powershell
npm run test:unit
npm run lint
```

Expected: capture the exact pass/fail baseline. Existing warnings may be recorded, but new errors block later tasks.

- [ ] **Step 4: Prove a cache-independent production build**

Move only the generated cache to a task-specific temporary path, then build:

```powershell
$experimentNext = Join-Path $env:TEMP "mythrealms-next-before-assortment"
if (Test-Path .next) { Move-Item -LiteralPath .next -Destination $experimentNext }
npm run build
```

Expected: build exits 0 from an empty `.next`. Restore or remove only the task-specific cache after inspection.

- [ ] **Step 5: Commit only an actual script correction, otherwise make no commit**

If `package.json` required no change, record “environment restored; no source commit.” If a script was corrected:

```powershell
git add package.json package-lock.json
git commit -m "chore: restore repeatable validation commands"
```

---

## Task 2: 建立 12 SKU / 24 Pin 的机器可读实验清单

**Files + Interfaces:**

- Create: `D:/mythrealms-shop/src/lib/experiments/assortment-validation.ts`
- Create: `D:/mythrealms-shop/tests/assortment-validation.test.ts`
- Interface: `ASSORTMENT_PRODUCTS`, `ASSORTMENT_PINS`, `buildAssortmentUrl()`, `validateAssortmentManifest()`.

- [ ] **Step 1: Write failing manifest tests**

The tests must assert:

```ts
assert.equal(ASSORTMENT_PRODUCTS.length, 12);
assert.deepEqual(
  countBy(ASSORTMENT_PRODUCTS, (item) => item.category),
  { earrings: 4, bracelets: 3, necklaces: 3, rings: 2 },
);
assert.equal(ASSORTMENT_PINS.length, 24);
assert.equal(new Set(ASSORTMENT_PINS.map((pin) => pin.contentId)).size, 24);
assert.ok(ASSORTMENT_PRODUCTS.every((product) =>
  ASSORTMENT_PINS.filter((pin) => pin.productId === product.id).length === 2,
));
```

Also assert every target is `/products/<slug>`, every campaign is `assortment-validation-14d`, and every SKU has exactly one `v1` and one `v2`.

Run `node --import tsx --test tests/assortment-validation.test.ts`; expected failure because the module does not exist.

- [ ] **Step 2: Implement the exact product manifest**

Use this immutable interface and exact IDs:

```ts
export type AssortmentCategory = "earrings" | "bracelets" | "necklaces" | "rings";

export interface AssortmentProduct {
  id: string;
  name: string;
  slug: string;
  category: AssortmentCategory;
}

export const ASSORTMENT_PRODUCTS = [
  { id: "new-series-006", name: "The Shell Bloom", slug: "new-series-mother-of-pearl-cluster-earrings", category: "earrings" },
  { id: "new-series-001", name: "The Dewflower", slug: "new-series-white-shell-flower-drops", category: "earrings" },
  { id: "new-series-002", name: "The Golden Petal", slug: "new-series-gold-shell-teardrops", category: "earrings" },
  { id: "new-series-003", name: "The Baroque Orbit", slug: "new-series-baroque-pearl-hoops", category: "earrings" },
  { id: "1688-005", name: "The First Light", slug: "pearl-series-05", category: "bracelets" },
  { id: "new-series-009", name: "The Green Current", slug: "new-series-pearl-jade-bracelet", category: "bracelets" },
  { id: "new-series-011", name: "The Shell Twist", slug: "new-series-shell-twist-pearl-cuff", category: "bracelets" },
  { id: "1688-017", name: "The Inner Glow", slug: "pearl-series-17", category: "necklaces" },
  { id: "new-series-016", name: "The Falling Pearl", slug: "new-series-pearl-y-lariat", category: "necklaces" },
  { id: "new-series-019", name: "The Pearl Drop", slug: "new-series-pearl-drop-choker", category: "necklaces" },
  { id: "1688-001", name: "The Calm Tide", slug: "pearl-series-01", category: "rings" },
  { id: "1688-002", name: "The Still Point", slug: "pearl-series-02", category: "rings" },
] as const satisfies readonly AssortmentProduct[];
```

- [ ] **Step 3: Implement the fixed schedule and URL builder**

Use `America/New_York` as the scheduling timezone, with a noon and evening slot. Use this order so each SKU receives one noon and one evening exposure:

| Day | 12:00 ET | 20:00 ET |
|---|---|---|
| 1 | Shell Bloom v1 | Calm Tide v1 |
| 2 | Dewflower v1 | First Light v1 |
| 3 | Golden Petal v1 | Inner Glow v1 |
| 4 | Baroque Orbit v1 | Green Current v1 |
| 5 | Shell Twist v1 | Still Point v1 |
| 6 | Falling Pearl v1 | Pearl Drop v1 |
| 7 | Calm Tide v2 | Shell Bloom v2 |
| 8 | First Light v2 | Dewflower v2 |
| 9 | Inner Glow v2 | Golden Petal v2 |
| 10 | Green Current v2 | Baroque Orbit v2 |
| 11 | Still Point v2 | Shell Twist v2 |
| 12 | Pearl Drop v2 | Falling Pearl v2 |

URL builder contract:

```ts
buildAssortmentUrl(pin) ===
  `/products/${pin.slug}?utm_source=pinterest&utm_medium=organic&utm_campaign=assortment-validation-14d&utm_content=${pin.slug}-${pin.version}`;
```

Days 13 and 14 intentionally contain no new SKU Pin.

- [ ] **Step 4: Run focused and full tests**

```powershell
node --import tsx --test tests/assortment-validation.test.ts
npm run test:unit
git diff --check
```

- [ ] **Step 5: Commit**

```powershell
git add src/lib/experiments/assortment-validation.ts tests/assortment-validation.test.ts
git commit -m "feat: define assortment validation manifest"
```

---

## Task 3: 生成并校验 24 条 Pinterest 发布包

**Files + Interfaces:**

- Create: `D:/mythrealms-shop/docs/company/assortment-validation-content.md`
- Modify: `D:/mythrealms-shop/docs/company/content-calendar.md`
- Modify: `D:/mythrealms-shop/src/lib/experiments/assortment-validation.ts`
- Modify: `D:/mythrealms-shop/tests/assortment-validation.test.ts`
- Interface per Pin: `contentId`, `day`, `slot`, `productId`, `version`, `title`, `description`, `visualBrief`, `cta`, `targetUrl`, `assetPath`, `status`.

- [ ] **Step 1: Add failing completeness and safety tests**

Tests must require all 24 records to have non-empty copy and enforce:

```ts
assert.equal(pin.cta, "View the design");
assert.match(pin.targetUrl, /^\/products\//);
assert.doesNotMatch(
  `${pin.title} ${pin.description}`.toLowerCase(),
  /natural pearl|mother[- ]of[- ]pearl|925|hypoallergenic|allergy|tarnish|in stock|ships? in|delivery/,
);
```

Also reject duplicate title+description pairs and missing local assets.

- [ ] **Step 2: Write two equal-format variants per SKU**

- `v1`: product close-up, only observable silhouette, color, layering, movement, and styling.
- `v2`: wear/gift/occasion framing, without material, performance, inventory, price, or delivery claims.
- Exactly one CTA: `View the design`.
- Keep description length in one fixed band, 120–220 English characters, so copy volume does not bias exposure.
- `assetPath` must point to an existing repository image. Do not regenerate product images in this task.

- [ ] **Step 3: Append only schedule references to the shared calendar**

`content-calendar.md` should link to the focused content file and show Day 1–14 status. Do not duplicate all copy into both documents. Initial status is `内部已验收，待 Day 0 授权`; it is not `已发布`.

- [ ] **Step 4: Validate manifest, copy, files, and encoding**

```powershell
node --import tsx --test tests/assortment-validation.test.ts
rg -n "天然珍珠|mother.of.pearl|925|低敏|防过敏|不褪色|库存|配送" docs/company/assortment-validation-content.md
git diff --check
```

Expected: forbidden-claim search has no promotional matches; UTF-8 Chinese and English render correctly in both Git and Obsidian.

- [ ] **Step 5: Commit**

```powershell
git add docs/company/assortment-validation-content.md docs/company/content-calendar.md src/lib/experiments/assortment-validation.ts tests/assortment-validation.test.ts
git commit -m "docs: prepare 24-pin assortment queue"
```

---

## Task 4: 将测试订单排除变成数据库事实

**Files + Interfaces:**

- Modify: `D:/mythrealms-shop/prisma/schema.prisma`
- Create: `D:/mythrealms-shop/src/lib/orders/business-order-filter.ts`
- Create: `D:/mythrealms-shop/scripts/mark-test-orders.ts`
- Create: `D:/mythrealms-shop/tests/business-order-filter.test.ts`
- Modify: `D:/mythrealms-shop/src/app/admin/page.tsx`
- Modify: `D:/mythrealms-shop/src/lib/operations/report-worker.ts`
- Modify: `D:/mythrealms-shop/src/app/api/automation/daily-report/route.ts`
- Modify: `D:/mythrealms-shop/src/app/api/automation/send-daily-report/route.ts`
- Modify: `D:/mythrealms-shop/src/lib/checkout/discount.ts`
- Interface: `Order.isTestOrder Boolean @default(false)`, `BUSINESS_ORDER_WHERE`, dry-run/apply CLI.

- [ ] **Step 1: Write failing filter tests**

```ts
assert.deepEqual(BUSINESS_ORDER_WHERE, { isTestOrder: false });
assert.equal(isBusinessOrder({ isTestOrder: false }), true);
assert.equal(isBusinessOrder({ isTestOrder: true }), false);
```

Source-boundary assertions must verify every business metric query contains `isTestOrder: false`. Admin order detail/list may still show test orders for audit; they are not business metrics.

- [ ] **Step 2: Add the persistent field and shared filter**

In `Order`:

```prisma
isTestOrder Boolean @default(false)
```

Shared module:

```ts
export const BUSINESS_ORDER_WHERE = { isTestOrder: false } as const;
export function isBusinessOrder(order: { isTestOrder: boolean }) {
  return !order.isTestOrder;
}
```

- [ ] **Step 3: Apply the filter only to business semantics**

Filter:

- admin dashboard `Total Orders` and `Revenue`;
- operations report order count, paid count, and paid revenue;
- both automation daily reports;
- paid-order count used by first-order discount eligibility.

Do not filter payment webhooks, order lookup, account history, fulfillment state machines, or admin audit lists. Those paths need the complete order record.

- [ ] **Step 4: Implement a fail-closed historical backfill tool**

CLI behavior:

```text
node --env-file-if-exists=.env --import tsx scripts/mark-test-orders.ts --preview
node --env-file-if-exists=.env --import tsx scripts/mark-test-orders.ts --apply --ids=<15 comma-separated IDs>
```

The apply path must refuse unless:

- exactly 15 unique IDs are supplied;
- all 15 exist and are currently `PENDING`;
- all have `confirmationClaimedAt`, `confirmationSentAt`, and `trackingNumber` null;
- none has a paid provider marker;
- every item has null `productId` and `variantId`;
- a transaction updates exactly 15 rows.

The tool prints only ID, status, created date, user role category, and boolean evidence. It must not print shipping addresses or full customer emails.

- [ ] **Step 5: Test against a non-production database**

```powershell
npm run db:generate
npx prisma db push
node --import tsx --test tests/business-order-filter.test.ts tests/operations-report.test.ts
npm run test:unit
```

Expected: test orders remain readable in admin/audit paths but contribute zero to business metrics.

- [ ] **Step 6: Commit without applying production data changes**

```powershell
git add prisma/schema.prisma src/lib/orders/business-order-filter.ts scripts/mark-test-orders.ts tests/business-order-filter.test.ts src/app/admin/page.tsx src/lib/operations/report-worker.ts src/app/api/automation/daily-report/route.ts src/app/api/automation/send-daily-report/route.ts src/lib/checkout/discount.ts
git commit -m "feat: exclude test orders from business metrics"
```

Production schema push and 15-row backfill remain part of the authorized deployment task, not this commit.

---

## Task 5: 验证现有商品漏斗，不重复造埋点

**Files + Interfaces:**

- Modify: `D:/mythrealms-shop/tests/analytics-tracking.test.ts`
- Create: `D:/mythrealms-shop/e2e/assortment-validation.spec.ts`
- Modify only if a test proves a defect: `D:/mythrealms-shop/src/lib/tracking.ts`
- Modify only if a test proves a defect: `D:/mythrealms-shop/src/app/products/[slug]/1688-product.tsx`
- Modify only if a test proves a defect: `D:/mythrealms-shop/src/lib/cart.ts`
- Interface: `view_item`, `add_to_cart`, `begin_checkout`, `purchase`; GA4 consent gate; first landing UTM.

- [ ] **Step 1: Add failing experiment-boundary tests**

For each manifest product, test that its UTM URL resolves and its ID/slug maps to the public catalog. Add browser tests for one product from each category and a full 12-URL HTTP loop.

Browser acceptance:

- URL retains `utm_source=pinterest`, `utm_medium=organic`, `utm_campaign=assortment-validation-14d`, and the exact `utm_content` on first load;
- analytics rejection produces no GA call;
- acceptance produces one `view_item` for one page view;
- one add-to-cart action produces one `add_to_cart`;
- the sticky CTA remains clickable at 390×844 both before and after CookieConsent dismissal.

- [ ] **Step 2: Prove the current implementation before editing it**

Run:

```powershell
node --import tsx --test tests/analytics-tracking.test.ts tests/assortment-validation.test.ts
npx playwright test e2e/assortment-validation.spec.ts --project=chromium
```

If current code passes, do not change tracking source. If it fails, make the smallest defect correction and add a regression assertion for that exact failure.

- [ ] **Step 3: Protect catalog and checkout invariants**

Add assertions that `getStorefrontProducts()` still returns 63 items and both `1688-013` / `pearl-series-13` and `new-series-006` / Shell Bloom remain independently resolvable. Verify the 12 experiment SKUs are additive selection only, never an availability filter.

- [ ] **Step 4: Run validation**

```powershell
npm run test:unit
npm run lint
npm run build
npx playwright test e2e/assortment-validation.spec.ts --project=chromium
git diff --check
```

- [ ] **Step 5: Commit**

Stage only changed test files and any proven minimal fix:

```powershell
git add tests/analytics-tracking.test.ts e2e/assortment-validation.spec.ts
git commit -m "test: verify assortment funnel attribution"
```

If source files changed, include only those named above after reviewing their diff.

---

## Task 6: 建立数据录入和确定性排名器

**Files + Interfaces:**

- Create: `D:/mythrealms-shop/src/lib/experiments/assortment-analysis.ts`
- Create: `D:/mythrealms-shop/tests/assortment-analysis.test.ts`
- Create: `D:/mythrealms-shop/scripts/analyze-assortment-validation.ts`
- Create: `D:/mythrealms-shop/docs/company/assortment-validation-data.csv`
- Create: `D:/mythrealms-shop/docs/company/assortment-validation-runbook.md`
- Modify: `D:/mythrealms-shop/docs/company/metrics.md`
- Interface: CSV in, Markdown report out; no network or database writes.

- [ ] **Step 1: Write failing eligibility and ranking tests**

Test these exact rules:

```ts
eligible = pinterestImpressions >= 1000 && attributablePdpSessions >= 20;
outboundCtr = pinterestOutboundClicks / pinterestImpressions;
engagedVisitRate = engagedSessions / attributablePdpSessions;
addToCartRate = addToCart / attributablePdpSessions;
checkoutRate = beginCheckout / attributablePdpSessions;
```

- Only eligible SKUs enter ranking.
- Stage 1 selects top 6 by outbound CTR.
- Stage 2 records engaged visit rate for those 6.
- Final ordering is lexicographic: real paid orders desc, checkout rate desc, add-to-cart rate desc, engaged visit rate desc, outbound CTR desc, product ID asc as deterministic tie-break.
- If fewer than 6 SKUs are eligible, result is `EXTEND_7_DAYS`, with no winner.
- If all top-6 SKUs have zero `add_to_cart`, `begin_checkout`, and paid orders, return a provisional interest ranking but `winnerStatus: INSUFFICIENT_LOWER_FUNNEL_SIGNAL`.

- [ ] **Step 2: Implement the pure analysis module**

Use integer counts and revenue cents. Division by zero returns 0. The module must not infer missing fields as real zero: CSV parser distinguishes blank (`missing`) from numeric `0`.

- [ ] **Step 3: Define the exact CSV schema**

Header:

```csv
snapshot_date,product_id,slug,pinterest_impressions,pinterest_outbound_clicks,attributable_pdp_sessions,engaged_sessions,view_item,add_to_cart,begin_checkout,paid_orders,paid_revenue_cents,excluded_sessions,measurement_minutes_lost,notes
```

Seed 12 rows with product IDs/slugs and blank metric cells. Blank cells must make the report fail validation; they are not silently converted to zero.

- [ ] **Step 4: Implement report output**

Command:

```powershell
node --import tsx scripts/analyze-assortment-validation.ts --input docs/company/assortment-validation-data.csv --output docs/company/assortment-validation-report.md
```

Report sections:

1. measurement completeness and excluded traffic;
2. eligibility table;
3. top-6 CTR table;
4. lower-funnel table;
5. `EXTEND_7_DAYS`, `INSUFFICIENT_LOWER_FUNNEL_SIGNAL`, or final top 3;
6. next action: top 3 supplier/sample/fulfillment validation, middle 3 creative retest, bottom 6 pause active promotion without downlisting.

- [ ] **Step 5: Add Day 0 / 7 / 14 / 21 runbook**

- Day 0: record GA4/Pinterest baseline and freeze the manifest.
- Day 1–12: publish exactly two scheduled Pins; record Pin URL and publishing timestamp.
- Day 7: measurement/balance audit only; do not announce winners.
- Day 13–14: no new SKU Pin; continue collecting delayed clicks.
- Day 14: run the report only if all 12 are eligible.
- Day 21: run after a uniform seven-day extension when Day 14 is insufficient.
- Measurement outage pauses the experiment clock; `measurement_minutes_lost` is excluded and documented.

- [ ] **Step 6: Test and commit**

```powershell
node --import tsx --test tests/assortment-analysis.test.ts
node --import tsx scripts/analyze-assortment-validation.ts --input tests/fixtures/assortment-validation-complete.csv --output $env:TEMP/assortment-report.md
npm run test:unit
git diff --check
git add src/lib/experiments/assortment-analysis.ts tests/assortment-analysis.test.ts scripts/analyze-assortment-validation.ts docs/company/assortment-validation-data.csv docs/company/assortment-validation-runbook.md docs/company/metrics.md tests/fixtures/assortment-validation-complete.csv
git commit -m "feat: add assortment validation reporting"
```

---

## Task 7: 完成 clean release candidate 和数据库预部署验证

**Files + Interfaces:**

- Modify: `D:/mythrealms-shop/docs/company/assortment-validation-runbook.md`
- Modify: `D:/mythrealms-shop/docs/company/metrics.md`
- Verify: all files committed by Tasks 1–6.
- Interface: one exact commit SHA becomes the release candidate; production DB change and app deploy use that SHA.

- [ ] **Step 1: Review the release diff by scope**

```powershell
git status --short
git diff --stat HEAD~5..HEAD
git diff --check HEAD~5..HEAD
```

Verify no product activation, pricing, CTA copy, discount, inventory, Quiz recommendation, or unrelated visual changes entered the release.

- [ ] **Step 2: Run the complete local gate from clean generated state**

```powershell
npm ci
npm run db:generate
$releaseNext = Join-Path $env:TEMP "mythrealms-next-assortment-release"
if (Test-Path .next) { Move-Item -LiteralPath .next -Destination $releaseNext }
npm run test:unit
npm run lint
npm run build
npx playwright test e2e/assortment-validation.spec.ts e2e/pearl-growth-funnel.spec.ts --project=chromium
```

All commands must exit 0. A cached or interrupted build is not acceptable.

- [ ] **Step 3: Dry-run the test-order backfill against the target database**

```powershell
node --env-file-if-exists=.env --import tsx scripts/mark-test-orders.ts --preview
```

Record the 15 IDs in a private operator note, not in Git. Confirm the preview evidence matches the documented historical batch. Do not apply yet.

- [ ] **Step 4: Freeze the release SHA and rollback point**

```powershell
git rev-parse HEAD
git rev-parse HEAD^
```

Record both SHAs in the runbook execution log. The rollback is the prior known-good deployment; database rollback is not required for the additive boolean field.

- [ ] **Step 5: Commit only runbook evidence**

```powershell
git add docs/company/assortment-validation-runbook.md docs/company/metrics.md
git commit -m "docs: record assortment release readiness"
```

---

## Task 8: 部署、标记测试订单并完成生产 smoke

**Files + Interfaces:**

- Update after verification: `D:/mythrealms-shop/docs/company/assortment-validation-runbook.md`
- Update after verification: `D:/mythrealms-shop/docs/company/metrics.md`
- External interfaces: Vercel production, production PostgreSQL, GA4 DebugView/Realtime, Pinterest Business Analytics.

- [ ] **Step 1: Obtain explicit production deployment authorization**

The authorization covers only: additive `isTestOrder` schema field, exact 15-row test marker, existing CookieConsent/Sticky CTA fix, GA4 Quiz events, assortment manifest/tests/reporting, and the already reviewed release SHA. It does not authorize public Pin publishing.

- [ ] **Step 2: Apply the additive production schema change**

Against the production database:

```powershell
npm run db:generate
npx prisma db push
```

Expected: only `Order.isTestOrder` is added with default `false`. Abort if Prisma reports data loss or unrelated destructive drift.

- [ ] **Step 3: Mark exactly the 15 historical test orders**

Run preview, then apply the exact reviewed IDs:

```powershell
node --env-file-if-exists=.env --import tsx scripts/mark-test-orders.ts --preview
node --env-file-if-exists=.env --import tsx scripts/mark-test-orders.ts --apply --ids=<the 15 reviewed IDs>
```

Expected: transaction updates exactly 15. Re-run preview/report queries and verify real paid customers 0, paid orders 0, paid revenue $0.00 at the current baseline.

- [ ] **Step 4: Deploy the frozen release SHA**

Deploy through the existing Vercel project workflow. Do not build a different working-tree state. Save deployment URL, commit SHA, start time, and completion time.

- [ ] **Step 5: Run production storefront smoke**

For all 12 UTM URLs: HTTP 200, correct product identity, add-to-cart available, no catalog changes. At 390×844, verify CookieConsent shown/hidden states do not cover Sticky Add to Cart. Confirm `pearl-series-13` and Shell Bloom remain separate and purchasable.

- [ ] **Step 6: Run external GA4 and consent verification**

In a clean browser profile:

1. reject analytics; confirm no GA request/event;
2. accept analytics;
3. open one experiment UTM product URL; confirm one `view_item` with correct item ID;
4. add once; confirm one `add_to_cart`;
5. enter checkout in an approved test path; confirm one `begin_checkout`;
6. verify `purchase` only through an approved sandbox/non-real path, never by treating a PENDING order as paid;
7. confirm source/medium `pinterest / organic`, campaign `assortment-validation-14d`, and content variant are readable in DebugView/Realtime or Explorations.

- [ ] **Step 7: Verify Pinterest measurement readiness**

Confirm the business account can read Pin impressions and outbound clicks and can schedule the exact URLs. No Pin is published in this step.

- [ ] **Step 8: Record evidence and commit**

```powershell
git add docs/company/assortment-validation-runbook.md docs/company/metrics.md
git commit -m "docs: verify assortment production readiness"
```

---

## Task 9: CEO Day 0 授权并启动 14 天队列

**Files + Interfaces:**

- Modify daily: `D:/mythrealms-shop/docs/company/assortment-validation-data.csv`
- Modify at checkpoints: `D:/mythrealms-shop/docs/company/assortment-validation-runbook.md`
- Modify for decisions only: `D:/mythrealms-shop/docs/company/decision-log.md`
- External interface: Pinterest scheduling/publishing.

- [ ] **Step 1: Present one final go/no-go packet to CEO**

Packet includes only:

- release SHA and production smoke result;
- GA4/consent external evidence;
- Pinterest analytics readability;
- 12-page and 24-content QA result;
- 15-test-order exclusion result;
- exact Day 1–12 schedule and rollback/pause rule.

CEO decision is `GO`, `NO-GO`, or `GO WITH RECORDED EXCEPTION`. Any exception affecting attribution, product availability, or content safety must be `NO-GO`.

- [ ] **Step 2: Freeze Day 0**

Record Day 0 calendar date, `America/New_York` timezone, campaign ID, release SHA, product page fingerprints/URLs, and baseline metrics. No mid-test price/page/CTA edits.

- [ ] **Step 3: Schedule/publish Day 1–12 only**

Use the manifest schedule exactly. After each publish, record Pinterest Pin URL, actual timestamp, content ID, and status. A failed slot is rescheduled to the same time band and recorded; do not compensate with paid exposure.

- [ ] **Step 4: Perform daily 10-minute measurement checks**

Check only:

- Pin is live and target URL correct;
- Pinterest impressions/outbound clicks are readable;
- GA4 session and event flow has not broken;
- no material/price/delivery promise appeared accidentally;
- no unexpected product availability change.

Do not change the winning hypothesis or declare a winner during daily checks.

- [ ] **Step 5: Day 7 balance audit**

Compare impressions and attributable sessions across SKUs. Only correct operational errors or measurement outages. Do not optimize individual winners, replace creatives, or alter pages mid-test.

- [ ] **Step 6: Day 13–14 observation window**

Publish no new SKU Pin. Collect delayed clicks and reconcile Pinterest totals, GA4 landing sessions, excluded traffic, and real order records.

- [ ] **Step 7: Run Day 14 analysis**

```powershell
node --import tsx scripts/analyze-assortment-validation.ts --input docs/company/assortment-validation-data.csv --output docs/company/assortment-validation-report.md
```

If any SKU has fewer than 1,000 impressions or 20 attributable PDP sessions, do not name winners; execute a uniform seven-day extension and analyze on Day 21.

- [ ] **Step 8: CEO approves the result interpretation**

- Final top 3: resume supplier/sample/U.S. fulfillment work only for these candidates.
- Middle 3: keep listed; prepare a controlled creative retest.
- Bottom 6: keep listed and purchasable; pause active promotion only.
- Insufficient lower-funnel signal: label top 3 as provisional interest candidates, not validated winners.

- [ ] **Step 9: Commit checkpoint evidence without exposing private analytics data**

Commit aggregate counts and decisions only. Do not commit customer emails, addresses, GA credentials, Pin account tokens, or order-provider identifiers.

```powershell
git add docs/company/assortment-validation-data.csv docs/company/assortment-validation-report.md docs/company/assortment-validation-runbook.md docs/company/decision-log.md
git commit -m "docs: record assortment validation results"
```

---

## Final Verification Checklist

- [ ] `npm ci` and `npm run db:generate` complete from the lockfile.
- [ ] `npm run test:unit`, `npm run lint`, clean `npm run build`, and focused Playwright tests exit 0.
- [ ] Manifest contains exactly 12 unique SKUs and 24 unique Pin records with the approved 4/3/3/2 category balance.
- [ ] Every SKU receives one noon and one evening Pin; Days 13–14 contain no new SKU posts.
- [ ] Every UTM URL uses `pinterest / organic / assortment-validation-14d` and a unique `<slug>-v1|v2` content value.
- [ ] All 12 product pages remain available and purchasable; full storefront count remains 63.
- [ ] GA4 externally receives one `view_item` and one `add_to_cart` per single action after consent, and sends none after rejection.
- [ ] Exactly 15 historical test orders have `isTestOrder=true`; business metrics exclude them while audit/admin access retains them.
- [ ] Pinterest impressions/outbound clicks and GA4 attributable PDP sessions are both readable before Day 0.
- [ ] No paid ads, discounts, price changes, page/CTA changes, or supplier/sample work are introduced by the experiment.
- [ ] No winner is declared below 1,000 Pinterest impressions and 20 attributable PDP sessions per SKU.
- [ ] Final top 3 are selected by the documented staged funnel, not by views or intuition alone.

## Self-Review Notes

- **Spec coverage:** Covers the approved 12 products, 24 equal-format Pins, UTM format, Pinterest-only ranking, Day 0 gate, 14/21-day timing, sample thresholds, staged ranking, test-order exclusion, no-downlisting rule, and paused supplier/sample work.
- **Placeholder scan:** The only runtime-substituted values are authorized operational facts that cannot exist before execution: Day 0 date, deployment SHA/URL, the privately reviewed 15 order IDs, and observed analytics counts. No product, URL, metric definition, threshold, schedule, or decision rule is left undefined.
- **Type consistency:** Product IDs/slugs match `src/lib/1688-products.ts` and `src/lib/new-series-products.ts`; metrics use integer counts and revenue cents; blank CSV cells remain missing rather than becoming zero; public catalog state is independent from experiment priority.
