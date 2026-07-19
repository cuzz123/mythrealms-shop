# MythRealms 冷启动技术就绪实施计划

> **供智能代理执行者使用：** 必须使用子技能 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans，逐项实施本计划。各步骤使用复选框（`- [ ]`）语法跟踪进度。

**目标：** 在向独立站导入美国自然流量之前，确保店铺可衡量、可索引，并且事实可信。

**架构：** 保持现有 Next.js App Router 店铺和商品目录作为事实来源。为 Sitemap 生成、Cookie 同意和电商事件载荷增加小型纯函数，使测试无需浏览器或数据库。UI 组件只负责把真实用户操作桥接到这些辅助函数。

**技术栈：** Next.js 16.2.6 App Router、React 19、TypeScript、Prisma、Zustand、通过 `tsx` 运行的 Node 测试运行器、Vercel。

## 全局约束

- 修改 metadata、Sitemap、JSON-LD 或统计代码前，必须立即阅读 `node_modules/next/dist/docs/` 下的相关文档。
- 不得修改 `public/`、`video-pipeline/` 或其他脏工作树路径下与任务无关的用户资产。
- 保留全部 45 个已批准公开产品。四个主推产品只是营销重点，不代表删除其他目录商品。
- 没有证据时，不得添加评分、评论、销量、紧迫感、来源、珍珠类型或材质声明。
- 供应商图片必须继续作为产品事实参考。AI editorial 图片可以补充，但不得替代这些参考图。
- 数据分析同意与营销同意必须分开。GA4 需要数据分析同意；Meta 和 Pinterest 需要营销同意。
- 每个实施任务都必须从失败测试开始，并以一个范围明确的 commit 结束。

---

### 任务 1：让 Journal 可索引并加入 Sitemap

**文件：**
- 修改：`tests/seo-catalog.test.ts`
- 新建：`src/lib/seo/blog.ts`
- 新建：`src/lib/seo/sitemap.ts`
- 修改：`src/app/sitemap.ts`
- 修改：`src/app/blog/page.tsx`
- 修改：`src/app/blog/[slug]/page.tsx`
- 修改：`src/components/ui/JsonLd.tsx`

- [ ] **步骤 1：用目标行为替换过时的 noindex 测试**

更新 `tests/seo-catalog.test.ts`，让它导入纯函数 `buildSitemapEntries`，而不是调用依赖数据库的路由。使用固定文章夹具：

```ts
const posts = [
  { slug: "pearl-earrings-under-50", updatedAt: new Date("2026-07-18T00:00:00Z") },
];

test("the sitemap includes the journal and published article URLs", () => {
  const entries = buildSitemapEntries(siteUrl, getStorefrontProducts(), posts);
  const urls = new Set(entries.map((entry) => entry.url));
  assert.equal(urls.has(`${siteUrl}/blog`), true);
  assert.equal(urls.has(`${siteUrl}/blog/pearl-earrings-under-50`), true);
});

test("the journal archive is indexable", () => {
  const robots = blogMetadata.robots;
  assert.notEqual(
    robots && typeof robots === "object" && "index" in robots ? robots.index : undefined,
    false,
  );
});
```

导入纯函数 `buildBlogMetadata`，并使用真实文章夹具测试。断言它返回规范 URL 和文章 Open Graph 数据，且不包含 `robots.index: false`。路由中的未找到响应仍保持 noindex。

- [ ] **步骤 2：运行聚焦测试并确认失败**

```powershell
npm run test:unit -- tests/seo-catalog.test.ts
```

预期：测试失败，因为辅助函数尚不存在，而且当前 Journal 仍是 noindex。

- [ ] **步骤 3：添加纯函数形式的 Blog metadata 和 Sitemap 构建器**

新建 `src/lib/seo/blog.ts`，实现接收 `{ slug, title, excerpt, image }` 的 `buildBlogMetadata` 函数，返回现有的规范地址、Open Graph 和 Twitter 字段，并使文章可索引。这样可以把数据库查询与 metadata 策略分离，使索引契约可以单元测试。

新建 `src/lib/seo/sitemap.ts`：

```ts
import type { MetadataRoute } from "next";
import type { StorefrontProduct } from "@/lib/storefront/catalog";

export interface SitemapPost {
  slug: string;
  updatedAt: Date;
}

export function buildSitemapEntries(
  baseUrl: string,
  products: StorefrontProduct[],
  posts: SitemapPost[],
): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/collections/pearl-series`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/pearls`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/faq`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/size-guide`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/shipping`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/refund`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticPages,
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
```

- [ ] **步骤 4：把 Sitemap 路由改为异步数据库适配器**

在 `src/app/sitemap.ts` 中只查询必要字段，并传给纯函数：

```ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await db.blogPost.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
  return buildSitemapEntries(siteUrl, getStorefrontProducts(), posts);
}
```

- [ ] **步骤 5：用正式启用的 Journal 契约替换归档和 noindex 文案**

在 `src/app/blog/page.tsx` 中：

- 除非当前 Next.js 文档要求数据库访问使用它，否则移除 `dynamic = "force-dynamic"`。
- 如果与已配置的数据库运行时兼容，使用 `export const revalidate = 3600`。
- 标题设为 `Pearl Jewelry Journal | MythRealms`。
- 描述使用符合事实的造型、保养、送礼、尺寸和配送指南概述。
- 移除 `robots: { index: false, follow: false }`。
- 将可见的 `Journal Archive` 和归档提示文案改为 `Pearl Jewelry Journal` 及正式启用的编辑内容文案。

在 `src/app/blog/[slug]/page.tsx` 中，只为未找到的 metadata 响应保留 `noindex`。现有文章必须调用 `buildBlogMetadata`。

- [ ] **步骤 6：添加 BlogPosting JSON-LD**

在 `src/components/ui/JsonLd.tsx` 中添加纯函数 `buildBlogPostingData` 和轻量组件 `BlogPostingJsonLd`。输入为 `headline`、`description`、`url`、可选 `image`、`datePublished`、`dateModified` 和 `authorName`。必须输出 `BlogPosting`、`mainEntityOfPage`、发布者 `MythRealms` 和 ISO 日期，不得虚构资质。在 `tests/seo-catalog.test.ts` 中测试纯构建器。

在 `src/app/blog/[slug]/page.tsx` 中使用真实数据库字段以及 `absoluteUrl`/`absoluteImageUrl` 辅助函数渲染。

- [ ] **步骤 7：运行测试和构建检查**

```powershell
npm run test:unit -- tests/seo-catalog.test.ts
npm run lint
npm run build
```

预期：所有命令退出码为 0；构建生成 `/sitemap.xml`、`/blog` 和文章路由，且没有 metadata 错误。

- [ ] **步骤 8：提交 Journal 和搜索改造**

```powershell
git add -- tests/seo-catalog.test.ts src/lib/seo/blog.ts src/lib/seo/sitemap.ts src/app/sitemap.ts src/app/blog/page.tsx 'src/app/blog/[slug]/page.tsx' src/components/ui/JsonLd.tsx
git commit -m "seo: index the pearl journal"
```

---

### 任务 2：让供应商图片成为产品事实参考

**文件：**
- 修改：`tests/storefront-catalog.test.ts`
- 修改：`tests/storefront-trust.test.ts`
- 修改：`src/lib/1688-products.ts`
- 修改：`src/app/products/[slug]/1688-product.tsx`
- 修改：`src/components/ui/JsonLd.tsx`

- [ ] **步骤 1：编写真实性回归测试**

替换要求 `pearl-series-01` 只能使用 editorial 图片的测试。新测试必须要求：

```ts
assert.equal(
  pilot.image,
  "/images/products/1688-shop/pearl-series/pearl-series-01-main.webp",
);
assert.deepEqual(pilot.images.slice(0, 3), [
  "/images/products/1688-shop/pearl-series/pearl-series-01-main.webp",
  "/images/products/1688-shop/pearl-series/pearl-series-01-detail2.webp",
  "/images/products/1688-shop/pearl-series/pearl-series-01-detail1.webp",
]);
assert.ok(pilot.images.some((image) => image.includes("-editorial-v1-")));
```

在 `tests/storefront-trust.test.ts` 中断言产品详情页包含可见的 editorial 图片披露，并且 `OrganizationJsonLd` 不再把 `Freshwater pearls` 声明为专业领域。

- [ ] **步骤 2：运行聚焦测试并确认失败**

```powershell
npm run test:unit -- tests/storefront-catalog.test.ts tests/storefront-trust.test.ts
```

预期：测试失败，因为试点产品当前用 editorial 图替换了原始图库。

- [ ] **步骤 3：将来源图置于前面，并把 editorial 图保留为补充**

在 `src/lib/1688-products.ts` 中将试点分支改为：

```ts
const editorialImages = EDITORIAL_PILOT_IMAGES[product.slug];
if (images && editorialImages) {
  product.image = images[0];
  product.images = [...images, ...editorialImages];
} else if (images) {
  product.image = images[0];
  product.images = [...images];
}
```

不要修改其他任何保留来源的图库。

- [ ] **步骤 4：添加简洁的产品图库披露**

在 `src/app/products/[slug]/1688-product.tsx` 的缩略图图库下方，仅当图片路径包含 `-editorial-` 时渲染一行低调文案：

```tsx
{images.some((image) => image.includes("-editorial-")) && (
  <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">
    Supplier-supplied product views appear first. Later editorial scenes may be AI-generated; refer to the first views for product shape and details.
  </p>
)}
```

- [ ] **步骤 5：移除没有依据的珍珠类型专业声明**

在 `OrganizationJsonLd` 中，从 `knowsAbout` 移除 `Freshwater pearls`。只保留 `Pearl jewelry`、`Jewelry styling` 和 `Pearl care`。

- [ ] **步骤 6：验证并提交**

```powershell
npm run test:unit -- tests/storefront-catalog.test.ts tests/storefront-trust.test.ts tests/public-catalog.test.ts
npm run lint
git add -- tests/storefront-catalog.test.ts tests/storefront-trust.test.ts src/lib/1688-products.ts 'src/app/products/[slug]/1688-product.tsx' src/components/ui/JsonLd.tsx
git commit -m "fix: preserve supplier product references"
```

---

### 任务 3：让同意状态可响应并按平台区分

**文件：**
- 新建：`tests/analytics-consent.test.ts`
- 新建：`src/lib/analytics/consent.ts`
- 修改：`src/components/layout/Analytics.tsx`
- 修改：`src/components/layout/CookieConsent.tsx`

- [ ] **步骤 1：编写纯函数同意状态测试**

覆盖缺失、格式错误、仅必要项、仅数据分析和全部同意的值：

```ts
assert.deepEqual(parseConsent(null), { analytics: false, marketing: false });
assert.deepEqual(parseConsent("not-json"), { analytics: false, marketing: false });
assert.deepEqual(
  parseConsent(JSON.stringify({ necessary: true, analytics: true, marketing: false })),
  { analytics: true, marketing: false },
);
```

同时测试 `serializeConsent("all")` 和 `serializeConsent("essential")`。

- [ ] **步骤 2：运行聚焦测试并确认失败**

```powershell
npm run test:unit -- tests/analytics-consent.test.ts
```

- [ ] **步骤 3：添加同意状态辅助函数和事件契约**

新建 `src/lib/analytics/consent.ts`：

```ts
export const CONSENT_STORAGE_KEY = "cookie-consent";
export const CONSENT_CHANGED_EVENT = "mythrealms:consent-changed";

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
}

export function parseConsent(raw: string | null): ConsentState { /* fail closed */ }
export function serializeConsent(level: "all" | "essential"): string { /* include timestamp */ }
```

- [ ] **步骤 4：立即派发同意状态变化**

在两个 Cookie 同意按钮处理函数中写入序列化值，并派发：

```ts
window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT));
```

- [ ] **步骤 5：让 Analytics 无需刷新即可响应**

重构 `Analytics.tsx`：挂载时读取 `ConsentState`，订阅 `CONSENT_CHANGED_EVENT` 和浏览器 `storage` 事件，并清理监听器。

只有在 `consent.analytics` 为 true 时渲染 GA 脚本。只有在 `consent.marketing` 为 true 时渲染 Meta Pixel 和 Pinterest Tag。所有 ID 保持可选，不得记录到日志。待任务 4 建立追踪队列后，再加入待处理事件刷新逻辑。

- [ ] **步骤 6：验证并提交**

```powershell
npm run test:unit -- tests/analytics-consent.test.ts
npm run lint
git add -- tests/analytics-consent.test.ts src/lib/analytics/consent.ts src/components/layout/Analytics.tsx src/components/layout/CookieConsent.tsx
git commit -m "fix: apply analytics consent immediately"
```

---

### 任务 4：接通完整电商事件漏斗

**文件：**
- 新建：`tests/analytics-tracking.test.ts`
- 修改：`src/lib/tracking.ts`
- 修改：`src/lib/cart.ts`
- 修改：`src/components/layout/Analytics.tsx`
- 修改：`src/app/products/[slug]/1688-product.tsx`
- 修改：`src/app/checkout/page.tsx`
- 修改：`src/app/checkout/success/tracker.tsx`

- [ ] **步骤 1：为载荷、独立派发和购买去重键编写测试**

导出纯构建器，并测试准确的货币、金额、商品 ID、数量和交易 ID。使用一个 GA 不存在但 Meta 和 Pinterest 存在的伪目标，断言这些平台仍然收到事件。

必须包含以下测试用例：

- 单个产品的 `view_item` 载荷。
- `add_to_cart` 金额等于 `price * quantity`。
- `begin_checkout` 包含全部商品。
- `purchase` 包含 `transaction_id`。
- Meta/Pinterest 的派发不依赖 `gtag`。
- 在平台初始化器出现前入队的事件，在平台就绪后恰好刷新一次。
- 未同意数据分析时，事件既不派发也不进入 GA 队列；未同意营销时，事件既不派发也不进入 Meta/Pinterest 队列。
- `purchaseStorageKey("order_123")` 返回稳定且带命名空间的键。

- [ ] **步骤 2：运行聚焦测试并确认失败**

```powershell
npm run test:unit -- tests/analytics-tracking.test.ts
```

- [ ] **步骤 3：围绕带类型的可选目标重构 `tracking.ts`**

使用统一目标类型和独立保护条件：

```ts
export interface TrackingTarget {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  pintrk?: (...args: unknown[]) => void;
}

function browserTarget(): TrackingTarget | undefined {
  return typeof window === "undefined" ? undefined : window;
}
```

每个公开追踪函数都接收可选的目标、同意状态和已配置平台状态，以便测试；并独立调用每个已配置、已获许可且可用的平台。浏览器默认的已配置平台状态来自三个 `NEXT_PUBLIC_*` ID。当用户已允许某个已配置平台，但其初始化器尚不存在时，保存一个该平台专属的待处理事件。导出 `flushTrackingQueue(platform, target)`，使 `Analytics.tsx` 只清空刚完成初始化的平台队列；这样可以避免晚到的 Meta 初始化器把事件重放给 GA。将 Pinterest 映射到其支持的电商事件（`addtocart` 和 `checkout`），不得发送个人数据。导出：

```ts
export const PURCHASE_STORAGE_PREFIX = "mythrealms:purchase-tracked:";
export const purchaseStorageKey = (orderId: string) => `${PURCHASE_STORAGE_PREFIX}${orderId}`;
```

- [ ] **步骤 4：初始化器就绪时刷新对应平台队列**

在 `src/components/layout/Analytics.tsx` 中，为每个已启用平台的初始化 `Script` 添加 `onReady` 回调，只调用对应队列：

```tsx
onReady={() => flushTrackingQueue("ga")}
onReady={() => flushTrackingQueue("meta")}
onReady={() => flushTrackingQueue("pinterest")}
```

根据已安装的 Next.js 16 文档确认 `onReady` 对所选 `Script` 用法有效。如果内联脚本在本地运行时不会触发它，则在初始化器建立队列函数后立即使用一个小型客户端回调；不要使用任意超时。

- [ ] **步骤 5：集中追踪所有加购操作**

在 `src/lib/cart.ts` 的 `addItem` 开头调用一次 `trackAddToCart`。这样无需重复组件 Hook，就能覆盖产品详情、吸底加购、产品卡片和愿望清单：

```ts
addItem: (product, quantity = 1) => {
  trackAddToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity,
    variant: product.variantName,
  });
  set(/* existing state update */);
},
```

- [ ] **步骤 6：在同意状态可能激活后追踪产品浏览**

在 `Product1688` 中创建一个 `useEffect`，挂载时调用 `trackViewItem`，并响应 `CONSENT_CHANGED_EVENT`。传入 ID、展示名称、价格、分类，以及可用的 slug/variant。卸载时移除监听器。

追踪层必须按平台对相同的待处理事件去重。不要使用组件级标记，在事件真正派发或入队前就把产品浏览标记为完成；否则用户挂载后才接受 Cookie 时，第一次浏览会丢失。

- [ ] **步骤 7：每次结账页面挂载只追踪一次开始结账**

在 `src/app/checkout/page.tsx` 中，等空购物车保护条件所需输入可用后，使用 ref 和 effect：

```ts
const checkoutTracked = useRef(false);
useEffect(() => {
  if (checkoutTracked.current || items.length === 0) return;
  checkoutTracked.current = true;
  trackBeginCheckout(
    items.map(({ product, quantity }) => ({ ...product, quantity })),
    total,
  );
}, [items, total]);
```

数据分析载荷不得包含邮箱、姓名、电话或地址。

- [ ] **步骤 8：对已付款购买事件去重**

用 `trackPurchase` 替换 `src/app/checkout/success/tracker.tsx` 中重复的 Pixel 调用。派发前，使用 `purchaseStorageKey(orderId)` 检查 `localStorage`。`trackPurchase` 必须返回是否至少有一个已获同意的平台接受事件并派发或入队；只有返回 true 时才写入键。在键不存在期间监听 `CONSENT_CHANGED_EVENT`，使用户在成功页接受同意后仍能记录购买。将 `items` 加入 effect 依赖列表，并清理监听器。

- [ ] **步骤 9：验证聚焦事件测试套件**

```powershell
npm run test:unit -- tests/analytics-tracking.test.ts tests/analytics-consent.test.ts
npm run lint
```

- [ ] **步骤 10：在浏览器中验证漏斗**

启动本地服务器，使用 Playwright 或内置浏览器，并注入假的 `gtag`、`fbq` 和 `pintrk` 函数。验证：

1. 仅同意必要 Cookie 时，不加载任何数据分析或营销脚本。
2. 点击 Accept All 后无需刷新即可加载脚本，并为每个已配置平台准确刷新一次当前页待处理的产品浏览。
3. 访问产品时发送一次 `view_item`。
4. 任意加购入口只发送一次加购事件。
5. 结账页面发送一次开始结账事件。
6. 刷新已付款成功页，不会为同一订单再次发送购买事件。

- [ ] **步骤 11：提交漏斗追踪**

```powershell
git add -- tests/analytics-tracking.test.ts src/lib/tracking.ts src/lib/cart.ts src/components/layout/Analytics.tsx 'src/app/products/[slug]/1688-product.tsx' src/app/checkout/page.tsx src/app/checkout/success/tracker.tsx
git commit -m "feat: track the ecommerce funnel"
```

---

### 任务 5：完成上线门槛和生产验证

**文件：**
- 新建：`docs/operations/cold-start-measurement-runbook.md`
- 修改：`.env.example`

- [ ] **步骤 1：记录必需的公开环境变量**

确保 `.env.example` 包含以下空占位符和注释：

```dotenv
NEXT_PUBLIC_APP_URL="https://mythrealms-shop.vercel.app"
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_META_PIXEL_ID=""
NEXT_PUBLIC_PINTEREST_TAG_ID=""
```

不要把真实 ID 或密钥提交到 Git。

- [ ] **步骤 2：编写衡量操作手册**

操作手册必须包括：

- UTM 格式：`utm_source`、`utm_medium=organic_social`、`utm_campaign`、`utm_content`。
- 四个主推产品的测试 URL。
- GA4 事件名及预期载荷字段。
- Meta 和 Pinterest 对应事件。
- 同意状态检查。
- 购买去重检查。
- 用于记录生产测试日期、测试人员、订单 ID 和结果的位置。

- [ ] **步骤 3：运行完整仓库门槛检查**

```powershell
npm run test:unit
npm run lint
npm run build
git diff --check
```

预期：所有命令退出码为 0。

- [ ] **步骤 4：部署并验证生产环境**

通过仓库现有 Vercel 流程部署。在临时生产地址 `https://mythrealms-shop.vercel.app` 上验证：

- `/robots.txt` 允许 `OAI-SearchBot`、`PerplexityBot` 和普通爬虫访问公开页面。
- `/sitemap.xml` 包含 `/blog` 和真实文章 URL。
- Journal 页面没有 `noindex`。
- 产品 JSON-LD 不包含虚构的 aggregate rating。
- `/api/feed` 返回有效 XML，并包含全部 45 个已批准 SKU。
- 用户同意后，四个电商事件会出现在调试或测试工具中。

- [ ] **步骤 5：提交操作手册和环境变量文档**

```powershell
git add -- .env.example docs/operations/cold-start-measurement-runbook.md
git commit -m "docs: add cold start measurement gate"
```

### 完成标准

- Journal 归档和文章可索引，并列在 Sitemap 中。
- 存在 AI editorial 图时，产品页面优先展示供应商来源图片。
- 同意状态变化在当前页面立即生效，并将数据分析与营销分开。
- `view_item`、`add_to_cart`、`begin_checkout` 和已去重的 `purchase` 能在各已配置平台上独立工作。
- 完整测试、Lint 和构建通过。
- 在发布任何自然流量营销链接之前，已经记录生产验证结果。
