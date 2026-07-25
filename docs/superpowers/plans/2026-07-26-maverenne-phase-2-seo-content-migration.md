# Maverenne Phase 2 SEO and Content Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不损失有效搜索资产的前提下移除 MythRealms 神话主线，使 canonical、结构化内容、sitemap、feed、`llms.txt` 与内部链接统一支持 Maverenne。

**Architecture:** 先生成 URL 资产清单并应用明确的保留/改写/重定向规则，再改代码。重定向保持小规模静态映射并由测试锁定；所有机器可读表面从 `BRAND` 与 `siteUrl` 取值，避免域名与品牌漂移。

**Tech Stack:** Next.js metadata routes、NextConfig redirects、TypeScript、Node test runner、Playwright、Google Search Console/Bing 导出文件。

## Global Constraints

- SEO/GEO 是当前唯一 P0；不得为了视觉改名破坏现有可索引页面。
- 商品 slug 与有效 Pearl Guide URL 保持不变。
- `/guardian-quiz` 从导航和首页消失；其 URL 处置必须依据审计规则，不批量删除。
- 禁止将多个不相关旧 URL 全部重定向到首页。
- sitemap、robots、feed、JSON-LD、`llms.txt` 必须使用同一 canonical 域名。
- 不虚构 GSC 点击、展示、外链或索引状态；缺失数据明确记为 `not_available`。
- 本阶段只在隔离分支执行，不部署生产。
- 修改重定向前完整阅读 `node_modules/next/dist/docs/01-app/02-guides/redirecting.md`，优先使用 `next.config.ts` 的静态 redirects。

---

### Task 1: 建立可重复的 URL 资产审计

**Files:**
- Create: `scripts/audit-brand-routes.ts`
- Create: `tests/brand-route-audit.test.ts`
- Create: `docs/company/maverenne-url-migration.csv`
- Modify: `package.json`

**Interfaces:**
- Produces: `auditBrandRoutes(input: BrandRouteEvidence[]): BrandRouteDecision[]`
- Types: `BrandRouteEvidence = { path: string; clicks: number | "not_available"; backlinks: number | "not_available"; replacement: string; brandConflict: boolean }`；`BrandRouteDecision = { path: string; action: "keep" | "rewrite" | "redirect"; destination: string; evidence: string }`

- [ ] **Step 1: 写失败测试**

```ts
test("brand route audit never redirects unrelated routes to home", () => {
  const output = auditBrandRoutes([
    { path: "/guardian-quiz", clicks: 0, backlinks: 0, replacement: "/collections/pearl-series" },
  ]);
  assert.deepEqual(output[0], {
    path: "/guardian-quiz",
    action: "redirect",
    destination: "/collections/pearl-series",
    evidence: "zero-clicks-zero-backlinks-specific-replacement",
  });
  assert.notEqual(output[0].destination, "/");
});
```

- [ ] **Step 2: 运行确认失败**

Run: `node --import tsx --test tests/brand-route-audit.test.ts`

Expected: FAIL，模块不存在。

- [ ] **Step 3: 实现审计规则**

规则固定为：任一数据为 `not_available` 时 `keep` 且 `destination=path`；有点击或外链且 `brandConflict=true` 时 `rewrite`、保留原 URL 且 `destination=path`；有点击或外链且无品牌冲突时 `keep`；点击和外链均为 0 且 replacement 为具体非首页路径时才 `redirect`；没有具体 replacement 时 `keep`。`rewrite` 的执行语义只是在原路径改写内容、metadata 与内部链接，不产生 HTTP redirect。

CSV 固定列：`path,gsc_clicks,external_backlinks,evidence_window,brand_conflict,action,destination,reviewer,reviewed_at`。首次填入 `/guardian-quiz`、`/pearls/stories`、`/pearls/symbolism` 和所有含旧神话主题的已发布博客 URL；缺失外部数据写 `not_available`，对应 action 必须为 `keep`。CSV 只保存证据，不在运行时读取；经人工复核且 action 为 redirect 的行，才可在 Task 2 手工复制到受 TypeScript 类型约束的 `LEGACY_BRAND_REDIRECTS`。

- [ ] **Step 4: 验证脚本与 CSV**

Run: `npm run brand:audit-routes`

Expected: 输出每个旧路由的 action，不出现空 destination 的 redirect，也不出现 destination `/`。

- [ ] **Step 5: 提交**

```bash
git add scripts/audit-brand-routes.ts tests/brand-route-audit.test.ts docs/company/maverenne-url-migration.csv package.json
git commit -m "feat: add evidence-based brand route audit"
```

### Task 2: 实施已审计的神话入口退场

**Files:**
- Create: `src/lib/seo/legacy-brand-routes.ts`
- Modify: `next.config.ts`
- Modify: `src/app/guardian-quiz/page.tsx`
- Modify: `src/app/guardian-quiz/quiz-client.tsx`
- Modify: `tests/seo-catalog.test.ts`
- Modify: `e2e/release-surfaces.spec.ts`

**Interfaces:**
- Consumes: `docs/company/maverenne-url-migration.csv` 中 reviewer 已填写且 action 为 redirect 的行
- Produces: `LEGACY_BRAND_REDIRECTS: readonly { source: string; destination: string; permanent: true }[]`

- [ ] **Step 1: 写失败测试**

测试必须验证：所有 redirect destination 都是站内具体路径且不为 `/`；导航与首页不含 guardian；若 `/guardian-quiz` 证据仍为 `not_available`，页面 metadata 为 `robots: { index: false, follow: true }` 并显示已退场说明，不显示神话结果或产品匹配。

- [ ] **Step 2: 运行确认失败**

Run: `node --import tsx --test tests/seo-catalog.test.ts`

Expected: FAIL，当前 Quiz 仍公开索引并呈现六种神话 archetype。

- [ ] **Step 3: 实现两种确定行为**

如果 CSV action 为 `redirect`，把该行加入 `LEGACY_BRAND_REDIRECTS` 并合并到 `next.config.ts` redirects；如果 action 为 `keep`，把 `/guardian-quiz` 改成简短退场页：标题 `Find your next everyday piece.`，正文说明体验已退场，唯一 CTA 到 `/collections/pearl-series`，metadata noindex/follow。删除旧问题、archetype、情绪功效文案和 Quiz 事件调用。

- [ ] **Step 4: 验证退场行为**

Run: `node --import tsx --test tests/seo-catalog.test.ts tests/analytics-tracking.test.ts`

Run: `npx playwright test e2e/release-surfaces.spec.ts --grep "guardian|legacy"`

Expected: PASS；不存在神话结果页；任何 308 都指向 CSV 指定的具体页面。

- [ ] **Step 5: 提交**

```bash
git add src/lib/seo/legacy-brand-routes.ts next.config.ts src/app/guardian-quiz tests/seo-catalog.test.ts tests/analytics-tracking.test.ts e2e/release-surfaces.spec.ts
git commit -m "feat: retire Guardian mythology surfaces safely"
```

### Task 3: 统一机器可读品牌与 canonical 来源

**Files:**
- Modify: `src/app/llms.txt/route.ts`
- Modify: `src/app/robots.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/lib/seo/sitemap.ts`
- Modify: `src/lib/storefront/feed.ts`
- Modify: `src/app/api/feed/route.ts`
- Modify: `src/app/api/feed/google/route.ts`
- Modify: `src/app/products/[slug]/1688-product.tsx`
- Modify: `tests/seo-catalog.test.ts`
- Modify: `tests/public-catalog.test.ts`

**Interfaces:**
- Consumes: 阶段一 Task 5 已迁移的 schema 模块、`BRAND`、`siteUrl`、`absoluteUrl()`
- Produces: 同源 sitemap、robots、feed、产品 JSON-LD 与 `llms.txt`

- [ ] **Step 1: 写失败测试**

对 `llms.txt`、sitemap、feed、robots 与产品 schema 逐项断言包含 `Maverenne` 或测试 `siteUrl`，不含 `MythRealms` 和硬编码 `mythrealms-shop.vercel.app`。商品总数必须与 `getStorefrontProducts()` 相同。

- [ ] **Step 2: 运行确认失败**

Run: `node --import tsx --test tests/seo-catalog.test.ts tests/public-catalog.test.ts`

Expected: FAIL，`llms.txt` 和产品组件仍含旧品牌或硬编码域名。

- [ ] **Step 3: 使用共享常量替换硬编码**

`llms.txt` 首段改为：

```text
# Maverenne

> Maverenne offers thoughtful jewelry and accessories for everyday moments that feel like your own.
```

保留商品页为 SKU 事实源的说明和禁止医疗/情绪结果承诺。`1688-product.tsx` 删除局部 `siteUrl` fallback，改为导入 `siteUrl` 与 `absoluteUrl()`。

- [ ] **Step 4: 验证机器表面**

Run: `node --import tsx --test tests/seo-catalog.test.ts tests/public-catalog.test.ts tests/structured-data.test.ts`

Expected: PASS，商品计数无变化。

- [ ] **Step 5: 提交**

```bash
git add -- src/app/llms.txt/route.ts src/app/robots.ts src/app/sitemap.ts src/lib/seo/sitemap.ts src/lib/storefront/feed.ts src/app/api/feed 'src/app/products/[slug]/1688-product.tsx' tests/seo-catalog.test.ts tests/public-catalog.test.ts
git commit -m "feat: align Maverenne machine-readable surfaces"
```

### Task 4: 改写品牌、Journal 与 Pearl Guide 的实体表达

**Files:**
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/lib/editorial/guides.ts`
- Modify: `src/lib/editorial/story.ts`
- Modify: `src/app/pearls/page.tsx`
- Modify: `src/app/pearls/stories/page.tsx`
- Modify: `src/app/pearls/symbolism/page.tsx`
- Modify: `tests/story-page.test.ts`
- Modify: `tests/editorial-guides.test.ts`
- Modify: `tests/pearl-guides.test.ts`

**Interfaces:**
- Consumes: `BRAND.name`、`BRAND.promise`、审核过的通用珍珠教育来源
- Produces: Maverenne 品牌实体和不依赖神话的内容集群

- [ ] **Step 1: 写失败测试**

断言 About H1 为 `Jewelry for the moments that feel like your own.`，作者为 `Maverenne Editorial`；公共正文不含六个 Guardian 名称、二十八星宿或 guaranteed emotional outcome。Pearl Guide 仍保留 care、how-to-wear、freshwater-pearls 的健康内部链接。

- [ ] **Step 2: 运行确认失败**

Run: `node --import tsx --test tests/story-page.test.ts tests/editorial-guides.test.ts tests/pearl-guides.test.ts`

Expected: FAIL，当前 About 或作者仍引用 MythRealms。

- [ ] **Step 3: 改写而不反推 SKU 属性**

About 只说明编辑式选品、日常自购和数字生成图片披露；Pearl Guide 保持通用教育定位，并在每篇页尾加入：`General pearl education does not establish the materials or construction of a specific product.`。`/pearls/stories` 与 `/pearls/symbolism` 去除 Guardian 与功效表达，保留可引用的珍珠文化/佩戴历史；无法提供权威来源的段落直接删除。

- [ ] **Step 4: 验证内容与链接**

Run: `node --import tsx --test tests/story-page.test.ts tests/editorial-guides.test.ts tests/pearl-guides.test.ts`

Run: `npx playwright test e2e/release-surfaces.spec.ts --grep "Story|Pearl|internal links"`

Expected: PASS；内部链接全部返回 200；没有把通用知识写成商品事实。

- [ ] **Step 5: 提交**

```bash
git add -- src/app/about/page.tsx src/app/blog src/lib/editorial src/app/pearls tests/story-page.test.ts tests/editorial-guides.test.ts tests/pearl-guides.test.ts
git commit -m "content: reposition Maverenne journal and pearl guides"
```

### Task 5: 建立旧品牌残留审计与阶段二总验收

**Files:**
- Create: `scripts/check-public-brand.ts`
- Create: `tests/public-brand.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `npm run brand:check-public`，发现客户可见旧品牌或神话实体时退出 1

- [ ] **Step 1: 写失败测试**

扫描 `src/app`、`src/components`、客户邮件与公开 feed，允许旧域名只存在于阶段三重定向配置，禁止 `MythRealms`、Guardian archetype 和旧支持邮箱出现在客户可见源文件。

- [ ] **Step 2: 运行确认失败**

Run: `node --import tsx --test tests/public-brand.test.ts`

Expected: 在尚未迁移的公开文件存在旧字符串时 FAIL。

- [ ] **Step 3: 实现带 allowlist 的检查器**

allowlist 只能包含 `next.config.ts` 中旧 host 重定向记录和测试 fixture；管理后台内部报告不属于公共表面，但邮件发件人和 PayPal 描述属于公共表面。

- [ ] **Step 4: 阶段二总验收**

Run: `npm run brand:check-public`

Run: `npm run test:unit`

Run: `npm run lint`

Run: `npm run build`

Expected: 全部退出 0；商品总数、路径与购物行为不变；未部署生产。

- [ ] **Step 5: 提交**

```bash
git add scripts/check-public-brand.ts tests/public-brand.test.ts package.json
git commit -m "test: prevent public MythRealms brand regressions"
```
