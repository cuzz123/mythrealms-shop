# Maverenne Phase 1 Brand Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不部署生产的隔离分支中建立 Maverenne 单一品牌事实源，并完成站内可见品牌、首页、导航、邮件与基础视觉迁移。

**Architecture:** 新建纯数据模块 `brand-identity.ts` 统一提供名称、文案、联系方式和视觉 token；现有页面和服务消费该模块，避免散落字符串。保留 `site.ts` 专门管理 canonical 域名；域名仍由环境变量控制，阶段一本地使用测试 URL。

**Tech Stack:** Next.js 16.2.6 App Router、React 19.2.4、TypeScript、CSS custom properties、Node test runner、Playwright。

## Global Constraints

- 品牌名为 `Maverenne`；标语为 `Come back to yourself.`；品类描述为 `Jewelry & Accessories`。
- 首页主标题为 `A little something for yourself.`，支撑句为 `Jewelry and accessories for finding your way back to you.`。
- 主 CTA 为 `Find Your Piece`，链接 `/collections/pearl-series`；次 CTA 为 `Shop the Pearl Edit`，链接同一集合页。
- 首阶段导航为 `New / Jewelry / The Pearl Edit / Gifts / Journal / About`；不显示空的 Accessories 或 Guardian Quiz。
- 只使用已核验商品事实；不得新增 healing、luck、energy、hypoallergenic、waterproof、tarnish-free 承诺。
- 不改变商品 slug、目录可见性、价格、库存、购物车、结账或支付逻辑。
- 本阶段不部署、不修改生产环境变量、不购买域名、不更改外部账号。
- 修改 metadata、OG 或 App Router 文件前，完整阅读 `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`。

---

### Task 1: 建立名称清查门槛记录

**Files:**
- Create: `docs/company/maverenne-name-clearance.md`
- Modify: `docs/company/decision-log.md`

**Interfaces:**
- Consumes: 已批准规格 `docs/superpowers/specs/2026-07-26-maverenne-brand-repositioning-design.md`
- Produces: 布尔门槛 `name_clearance_passed`；只有值为 `true` 才允许执行 Task 2–7

- [ ] **Step 1: 创建只读核验表**

写入四项证据：USPTO 商标精确词与近似词检索（第 14、18、26、35 类）、WIPO Global Brand Database 检索、`maverenne.com` 注册商最终状态、Pinterest/TikTok/Instagram 用户名状态。每项记录检查时间、查询词、结果 URL 和截图路径；结论字段只能是 `pass` 或 `fail`。

- [ ] **Step 2: 执行停止规则**

若任一相关类别出现高相似在先珠宝/配饰品牌，或法律复核建议停用，则将 `name_clearance_passed: false` 写入文档，停止本计划并返回命名设计；不得靠改拼写继续实施。

- [ ] **Step 3: 记录通过条件**

只有四项证据都有日期与来源，且没有发现必须停止的冲突时，记录：

```yaml
name_clearance_passed: true
purchase_authorized: false
production_migration_authorized: false
```

- [ ] **Step 4: 验证并提交**

Run: `rg -n "name_clearance_passed|purchase_authorized|production_migration_authorized" docs/company/maverenne-name-clearance.md`

Expected: 三个字段各出现一次，且购买与生产授权均为 `false`。

```bash
git add docs/company/maverenne-name-clearance.md docs/company/decision-log.md
git commit -m "docs: record Maverenne name clearance gate"
```

### Task 2: 建立单一品牌事实源

**Files:**
- Create: `src/lib/brand-identity.ts`
- Create: `tests/brand-identity.test.ts`
- Modify: `src/lib/site.ts`

**Interfaces:**
- Produces: `BRAND` 只读对象；`BrandIdentity` 类型；`SITE_NAME` 从 `BRAND.name` 导出
- Consumes: Task 1 的 `name_clearance_passed: true`

- [ ] **Step 1: 恢复可构建依赖树**

Run: `npm ci`

Run: `npx prisma generate`

Run: `node -e "require.resolve('@prisma/client'); console.log('prisma-client-resolved')"`

Expected: 三条命令退出 0，最后输出 `prisma-client-resolved`。若 registry 超时或客户端仍不可解析，记录为环境阻塞并停止代码任务，不得跳过阶段总 build。

- [ ] **Step 2: 写失败测试**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { BRAND } from "../src/lib/brand-identity";
import { SITE_NAME } from "../src/lib/site";

test("Maverenne identity exposes approved copy", () => {
  assert.equal(BRAND.name, "Maverenne");
  assert.equal(BRAND.tagline, "Come back to yourself.");
  assert.equal(BRAND.descriptor, "Jewelry & Accessories");
  assert.equal(BRAND.heroTitle, "A little something for yourself.");
  assert.equal(BRAND.primaryCta.label, "Find Your Piece");
  assert.equal(BRAND.primaryCta.href, "/collections/pearl-series");
  assert.equal(SITE_NAME, BRAND.name);
});
```

- [ ] **Step 3: 运行测试确认失败**

Run: `node --import tsx --test tests/brand-identity.test.ts`

Expected: FAIL，错误包含 `Cannot find module '../src/lib/brand-identity'`。

- [ ] **Step 4: 添加最小实现**

```ts
export const BRAND = {
  name: "Maverenne",
  pronunciation: "MAV-uh-ren",
  descriptor: "Jewelry & Accessories",
  tagline: "Come back to yourself.",
  promise: "Thoughtful jewelry and accessories for everyday moments that feel like your own.",
  heroTitle: "A little something for yourself.",
  heroDescription: "Jewelry and accessories for finding your way back to you.",
  primaryCta: { label: "Find Your Piece", href: "/collections/pearl-series" },
  secondaryCta: { label: "Shop the Pearl Edit", href: "/collections/pearl-series" },
  newsletterTitle: "A quiet note for you.",
} as const;

export type BrandIdentity = typeof BRAND;
```

在 `src/lib/site.ts` 中以 `export const SITE_NAME = BRAND.name` 替代硬编码名称；保留 `DEFAULT_SITE_URL` 到阶段三再改。

- [ ] **Step 5: 运行测试确认通过**

Run: `node --import tsx --test tests/brand-identity.test.ts`

Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src/lib/brand-identity.ts src/lib/site.ts tests/brand-identity.test.ts
git commit -m "feat: centralize Maverenne brand identity"
```

### Task 3: 迁移导航、页头和页尾

**Files:**
- Modify: `src/lib/storefront/navigation.ts`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `tests/storefront-navigation.test.ts`
- Modify: `e2e/release-surfaces.spec.ts`

**Interfaces:**
- Consumes: `BRAND.name`
- Produces: 六项桌面/移动导航和无 Guardian 的公共 chrome

- [ ] **Step 1: 写失败测试**

在 `tests/storefront-navigation.test.ts` 断言顶级可见标签严格等于：

```ts
assert.deepEqual(
  [...HEADER_MENUS.map((menu) => menu.label), ...HEADER_LINKS.map((link) => link.label)],
  ["New", "Jewelry", "The Pearl Edit", "Gifts", "Journal", "About"],
);
assert.equal(JSON.stringify({ HEADER_MENUS, HEADER_LINKS, FOOTER_GROUPS }).includes("Guardian"), false);
```

在 Playwright 中断言页头链接名称 `Maverenne home`，且页面 chrome 内无 `Find Your Guardian`。

- [ ] **Step 2: 运行测试确认失败**

Run: `node --import tsx --test tests/storefront-navigation.test.ts`

Expected: FAIL，当前顶层标签为 `Shop / Gifts / Discover`。

- [ ] **Step 3: 实现批准的信息架构**

将导航改为六个单链接项：

```ts
export const HEADER_MENUS = [] as const;
export const HEADER_LINKS = [
  { label: "New", href: "/collections/new-arrivals" },
  { label: "Jewelry", href: "/collections" },
  { label: "The Pearl Edit", href: "/collections/pearl-series" },
  { label: "Gifts", href: "/gifts" },
  { label: "Journal", href: "/blog" },
  { label: "About", href: "/about" },
] as const;
```

页头删除旧菱形 SVG 图标，只保留 `Maverenne` 字标；ARIA 从 `MythRealms home` 改为 `${BRAND.name} home`。页尾保留帮助、政策与 Pearl Guide 链接，但删除 Guardian 入口并使用 `BRAND.name`、`BRAND.tagline`。

- [ ] **Step 4: 验证桌面和移动导航**

Run: `node --import tsx --test tests/storefront-navigation.test.ts`

Run: `npx playwright test e2e/release-surfaces.spec.ts --grep "navigation|homepage"`

Expected: 单测与匹配的 Playwright 测试全部 PASS；320、390、1440 像素宽度无水平溢出。

- [ ] **Step 5: 提交**

```bash
git add src/lib/storefront/navigation.ts src/components/layout/Header.tsx src/components/layout/Footer.tsx tests/storefront-navigation.test.ts e2e/release-surfaces.spec.ts
git commit -m "feat: replace storefront chrome with Maverenne identity"
```

### Task 4: 重组首页并移除神话主入口

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/home/HomepageHero.tsx`
- Modify: `src/components/home/HomepageCategoryStories.tsx`
- Modify: `src/components/home/HomepageOccasionEdit.tsx`
- Modify: `src/components/home/HomepageEditorialStory.tsx`
- Modify: `src/components/home/HomepageGiftSets.tsx`
- Delete: `src/components/home/HomepageGuardian.tsx`
- Modify: `e2e/release-surfaces.spec.ts`

**Interfaces:**
- Consumes: `BRAND.heroTitle`, `BRAND.heroDescription`, `BRAND.primaryCta`, `BRAND.secondaryCta`, `BRAND.newsletterTitle`
- Produces: 设计规格规定的七段首页顺序

- [ ] **Step 1: 将首页顺序写成失败的 Playwright 断言**

按顺序查找以下标题并比较纵向坐标：

```ts
const expected = [
  "A little something for yourself.",
  "The Pearl Edit",
  "Shop by moment",
  "Pieces for everyday light.",
  "Come back to yourself.",
  "Everyday notes",
  "A quiet note for you.",
];
```

同时断言首页不存在 `/guardian-quiz` 链接或 `Guardian` 文本。

- [ ] **Step 2: 运行测试确认失败**

Run: `npx playwright test e2e/release-surfaces.spec.ts --grep "homepage preserves"`

Expected: FAIL，当前首页仍含 `Pearls for sunlit days.` 与 Guardian 区块。

- [ ] **Step 3: 实现首页文案与顺序**

复用现有商品选择器和图片，只改组件组合、标题、描述和 CTA。`Shop by moment` 固定为：

```ts
[
  { label: "For Everyday", href: "/collections/pearl-series" },
  { label: "For a New Chapter", href: "/gifts" },
  { label: "Just Because", href: "/collections/new-arrivals" },
  { label: "Small Gifts", href: "/gifts#under-50" },
]
```

删除 `HomepageGuardian` 的 import、渲染与文件。推荐区不得使用 `Bestseller`，统一称 `Editor’s picks` 或 `Pieces for everyday light.`。

- [ ] **Step 4: 运行首页验收**

Run: `npx playwright test e2e/release-surfaces.spec.ts --grep "homepage"`

Expected: 所有首页测试 PASS；无 Guardian；CTA href 与 Task 2 完全一致。

- [ ] **Step 5: 提交**

```bash
git add src/app/page.tsx src/components/home e2e/release-surfaces.spec.ts
git commit -m "feat: launch Maverenne emotional storefront homepage"
```

### Task 5: 迁移全局 metadata、JSON-LD 与 OG

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/opengraph-image.tsx`
- Modify: `src/components/ui/JsonLd.tsx`
- Modify: `src/components/ui/SeoJsonLd.tsx`
- Modify: `src/lib/seo/schema.ts`
- Modify: `src/lib/seo/blog.ts`
- Modify: `tests/structured-data.test.ts`
- Modify: `tests/seo-catalog.test.ts`

**Interfaces:**
- Consumes: `BRAND`、`siteUrl`、`absoluteUrl()`
- Produces: 所有页面继承的 Maverenne metadata 与 Organization/WebSite publisher 数据

- [ ] **Step 1: 写失败测试**

断言 Organization、WebSite、Product、BlogPosting publisher 名称均为 `Maverenne`，且序列化 schema 不含 `MythRealms`、Guardian archetype 或中国神话实体。根 metadata title 断言为 `Maverenne | Jewelry & Accessories for Everyday Moments`。

- [ ] **Step 2: 运行测试确认失败**

Run: `node --import tsx --test tests/structured-data.test.ts tests/seo-catalog.test.ts`

Expected: FAIL，当前 schema 与 title 仍使用 MythRealms。

- [ ] **Step 3: 最小迁移**

根 metadata 使用：

```ts
title: "Maverenne | Jewelry & Accessories for Everyday Moments",
description: "Thoughtful jewelry and accessories for everyday moments that feel like your own.",
openGraph: { siteName: BRAND.name, /* 保留现有类型与尺寸 */ },
```

OG 图片保留现有可用影像，但将所有可见文字与 alt 改为 Maverenne。`src/lib/seo/schema.ts`、`src/lib/seo/blog.ts`、两个 JSON-LD 组件的名称和 publisher 全部从 `BRAND.name` 读取；域名继续从 `siteUrl` 读取。

- [ ] **Step 4: 验证 metadata 与结构化数据**

Run: `node --import tsx --test tests/structured-data.test.ts tests/seo-catalog.test.ts`

Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/app/layout.tsx src/app/opengraph-image.tsx src/components/ui/JsonLd.tsx src/components/ui/SeoJsonLd.tsx src/lib/seo/schema.ts src/lib/seo/blog.ts tests/structured-data.test.ts tests/seo-catalog.test.ts
git commit -m "feat: migrate metadata and schemas to Maverenne"
```

### Task 6: 应用安静微光视觉 token

**Files:**
- Modify: `src/app/globals.css`
- Modify: `e2e/editorial-visuals.spec.ts`

**Interfaces:**
- Produces: 全站 CSS token，不改变组件接口

- [ ] **Step 1: 写失败的计算样式测试**

在 Playwright 中读取 `document.documentElement` 的 CSS 变量并断言：

```ts
expect(tokens).toEqual({
  background: "#f7f3eb",
  surface: "#fffdf8",
  surfaceAlt: "#eee6da",
  text: "#292622",
  textSecondary: "#6d655d",
  accent: "#a98758",
  primary: "#b99863",
  border: "#ddd2c4",
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx playwright test e2e/editorial-visuals.spec.ts --grep "Quiet Light tokens"`

Expected: FAIL，当前 token 值不同。

- [ ] **Step 3: 修改根 token 与字体栈**

设置上述颜色；标题栈使用 `"Iowan Old Style", "Baskerville", "Times New Roman", serif`，正文使用 `Inter, ui-sans-serif, system-ui, sans-serif`。不增加远程字体依赖。保留现有 focus ring 对比度，并验证香槟金只用于强调，不作为小字号正文色。

- [ ] **Step 4: 验证视觉与可访问性**

Run: `npx playwright test e2e/editorial-visuals.spec.ts e2e/release-surfaces.spec.ts --grep "Quiet Light|overflow|navigation"`

Expected: 全部 PASS，320/390/1440 无溢出，键盘 focus 可见。

- [ ] **Step 5: 提交**

```bash
git add src/app/globals.css e2e/editorial-visuals.spec.ts
git commit -m "style: apply Maverenne Quiet Light tokens"
```

### Task 7: 迁移客户通信与政策品牌名

**Files:**
- Modify: `src/lib/email.ts`
- Modify: `src/lib/operations/email-automation.ts`
- Modify: `src/app/api/contact/route.ts`
- Modify: `src/app/api/checkout/paypal/route.ts`
- Modify: `src/app/contact/page.tsx`
- Modify: `src/app/privacy/page.tsx`
- Modify: `src/app/terms/page.tsx`
- Modify: `src/app/shipping/page.tsx`
- Modify: `src/app/refund/page.tsx`
- Modify: `src/lib/launch/readiness.ts`
- Modify: `tests/email.test.ts`
- Modify: `tests/support-email.test.ts`
- Modify: `tests/storefront-policies.test.ts`
- Modify: `tests/launch-readiness.test.ts`

**Interfaces:**
- Consumes: `BRAND.name`、`siteUrl`、`SUPPORT_EMAIL`
- Produces: 订单、弃购、客服、PayPal 描述和政策页统一品牌

- [ ] **Step 1: 写失败测试**

断言邮件 HTML/text、客服草稿、PayPal description 和政策页导出文本包含 `Maverenne`，且不包含 `MythRealms`。支持邮箱必须从 `SUPPORT_EMAIL` 环境变量读取；开发环境未配置时使用不可投递的 `support@maverenne.invalid`。生产 launch readiness 在缺少 `SUPPORT_EMAIL` 时必须返回失败，防止虚构邮箱上线。

- [ ] **Step 2: 运行测试确认失败**

Run: `node --import tsx --test tests/email.test.ts tests/support-email.test.ts tests/storefront-policies.test.ts`

Expected: FAIL，现有文案仍使用 MythRealms。

- [ ] **Step 3: 替换为品牌常量**

所有客户可见名称改为 `BRAND.name`；PayPal description 使用 ```${BRAND.name} Order #${order.id.slice(-8)}```。不得在代码内硬编码真实发件域；发件人继续由环境变量提供，开发 fallback 固定为不可投递的 `.invalid` 地址。

- [ ] **Step 4: 运行客户通信测试**

Run: `node --import tsx --test tests/email.test.ts tests/support-email.test.ts tests/storefront-policies.test.ts tests/paypal-only-checkout.test.ts tests/launch-readiness.test.ts`

Expected: PASS；支付逻辑和订单状态断言无变化。

- [ ] **Step 5: 阶段一总验收**

Run: `npm run test:unit`

Run: `npm run lint`

Run: `npm run build`

Expected: 全部退出 0；若 lint 仍有既有 warning，数量不得增加；生产环境未发生任何变化。

- [ ] **Step 6: 提交**

```bash
git add src/lib/email.ts src/lib/operations/email-automation.ts src/lib/launch/readiness.ts src/app/api/contact/route.ts src/app/api/checkout/paypal/route.ts src/app/contact/page.tsx src/app/privacy/page.tsx src/app/terms/page.tsx src/app/shipping/page.tsx src/app/refund/page.tsx tests/email.test.ts tests/support-email.test.ts tests/storefront-policies.test.ts tests/launch-readiness.test.ts
git commit -m "feat: migrate customer communications to Maverenne"
```
