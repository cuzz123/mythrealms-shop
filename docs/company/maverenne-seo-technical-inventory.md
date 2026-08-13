# SEO 技术资产与可索引性盘点（只读）

审计日期：2026-07-26。范围仅为仓库源码与配置的静态证据；未发起生产 HTTP 请求，未读取 Search Console、日志或抓取报告。

## 证据边界

- 本文的“可索引”只表示代码层面的意图（路由、metadata、robots、sitemap 或 noindex 设置），**不等于** URL 已部署、可访问、被抓取或已被搜索引擎收录。
- `siteUrl` 默认是 `https://mythrealms-shop.vercel.app`，但可被 `NEXT_PUBLIC_APP_URL` 改写；未验证生产环境实际值、域名归属、响应状态、最终 `<head>` 或 robots/sitemap 输出。
- 产品数量的“63”来自 `PRODUCT_TYPES_BY_SLUG` 的 63 个白名单键；最终 storefront 还要求 `pearl-series`、`isActive`、`inStock`，所以当前实际可输出数量须在构建/运行时复核。
- 当前工作树没有 `node_modules`；已读取相邻工作树中同为 Next.js 16.2.6 的 `node_modules/next/dist/docs/`：Metadata Files、`sitemap`、`robots`、`generateMetadata`、Redirecting、`next.config` redirects。其关键约束是：metadata 由路由段浅合并；`sitemap.ts`/`robots.ts` 是默认缓存的特殊路由；配置重定向的 `permanent: true` 对应 308、`false` 对应 307，且在文件系统路由之前检查。

## 主资产盘点

| 路由 / 类型 | HTTP 证据边界 | canonical | metadata | schema | sitemap | noindex | 内部入口 | 旧品牌残留 | 风险 | 建议动作 | 证据文件 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` 首页 | 仅 `force-static` 源码意图；未验证 200/渲染 head | `siteUrl` | 只补 canonical/OG URL，标题/描述/robots 从根 layout 继承 | 根 layout 的 Organization、WebSite | 是，priority 1 | 无 | Logo、全局页头/页脚 | MythRealms | 首页自身没有专属 title/description/OG 图；继承值可用但页面主题不精确 | P1：补首页专属 metadata/OG；**如涉及客户可见改名，name clearance 前冻结** | `src/app/page.tsx:19-24`; `src/app/layout.tsx:9-48`; `src/lib/seo/sitemap.ts:17-23` |
| `/about` About | 未验证部署/状态 | 是 | title、description、OG、Twitter | AboutPage + BreadcrumbList | 是 | Discover、页脚 About、`/story` 旧路径 | MythRealms | 旧 `/story` 要靠 308 才会统一；未做生产验证 | P2：上线后抽测 `/story` 的单跳 308 与 canonical | `src/app/about/page.tsx:13-31,158-170`; `src/lib/storefront/navigation.ts:48-50,80-86`; `next.config.ts:12-18` |
| `/faq` FAQ | 未验证部署/状态 | 无路由级 canonical（仅可继承 metadataBase，不能推定 canonical 标签） | 无导出 metadata；根 layout 继承 | 内联 FAQPage | 是 | Footer Learn、相关帮助页 | MythRealms | 缺专属 title/description/canonical/OG；FAQ 富结果呈现不保证 | P1：补静态 metadata 与 canonical；保留 FAQ JSON-LD 并用 Rich Results Test 验证 | `src/app/faq/page.tsx:1-105,218-239`; `src/lib/seo/sitemap.ts:28-36`; `src/lib/storefront/navigation.ts:67-77` |
| `/blog` Journal 索引 | 未验证部署、数据库内容或分页 | 是 | title、description、OG、Twitter | 无索引页 ItemList/Breadcrumb | 是 | `Pearl Stories`、llms、Footer | MythRealms | 数据库文章可能为空/变化；sitemap 又按数据库筛选 | P1：生产核查索引页、分页与 sitemap 的文章 URL 一致性 | `src/app/blog/page.tsx:10-24,36-65`; `src/app/sitemap.ts:13-31`; `src/app/llms.txt/route.ts:25-42` |
| `/blog/[slug]` Journal 子页 | 未验证数据库记录、200/404、渲染输出 | `buildBlogMetadata` 中按 slug 生成 | 动态 metadata；非 Pearl editorial 返回 noindex,nofollow | BlogPosting JSON-LD | 仅 `isPearlEditorialPost` 的 DB 文章 | 未列入 Header，来自 Journal/Stories 卡片 | MythRealms | DB 过滤与前端索引的准入规则需持续一致 | P1：发布流程校验「可访问、canonical、JSON-LD、sitemap」四项；不得以代码存在声称收录 | `src/app/blog/[slug]/page.tsx:14-52`; `src/lib/seo/blog.ts:62-64`; `src/app/sitemap.ts:13-30` |
| `/pearls` Pearl Guide hub | 未验证部署/状态 | 是 | title、description、OG、Twitter | FAQPage | 是 | Discover、Footer Learn、首页 | MythRealms | 无 Breadcrumb JSON-LD；不影响抓取资格但导航语义不完整 | P2：评估补 BreadcrumbList；上线后验证 FAQ 结构化数据 | `src/app/pearls/page.tsx:16-64`; `src/lib/storefront/navigation.ts:40-47,67-75`; `src/lib/seo/sitemap.ts:24-27` |
| `/pearls/care`、`/pearls/how-to-wear`、`/pearls/freshwater-pearls` Pearl Guide 子页 | 未验证部署/状态 | 是（各页） | 各自导出 metadata | Article + FAQPage + BreadcrumbList | 是 | Hub、Discover、Footer、Gifts（care） | MythRealms | 内容日期和事实准确性未在本审计核验 | P2：发布时核验 Article 的日期、图片绝对 URL 与 FAQ 可见文本一致 | `src/app/pearls/care/page.tsx:27-62`; `src/app/pearls/how-to-wear/page.tsx:13-49`; `src/app/pearls/freshwater-pearls/page.tsx:13-49`; `src/lib/seo/sitemap.ts:24-27` |
| `/pearls/stories`、`/pearls/symbolism` Pearl Guide 发现子页 | 未验证部署/状态 | 是 | title、description、OG、Twitter | BreadcrumbList | 是（通过 `discoveryPaths`） | Discover、Footer；Stories 连至 Journal | MythRealms | 两页没有 Article/FAQ schema，属内容策略取舍；`stories` 依赖 DB | P2：生产抽测 sitemap 是否含两页；若目标为文章富结果，再评估 Article schema | `src/app/pearls/stories/page.tsx:11-46`; `src/app/pearls/symbolism/page.tsx:10-36`; `src/app/sitemap.ts:25-31` |
| `/gifts` Gifts | 未验证部署/状态 | 是 | title、description、OG、Twitter | CollectionPage/ItemList | 是 | Header Gifts、Footer、llms、首页礼赠模块 | MythRealms | 锚点筛选（如 `#under-50`）不是独立可索引页；产品集合随运行时 catalog 改变 | P2：确保礼赠清单只引用可见商品；无需将锚点加入 sitemap | `src/app/gifts/page.tsx:19-62,69-135`; `src/lib/storefront/navigation.ts:26-36`; `src/lib/seo/sitemap.ts:22` |
| `/collections` Collections 索引 | 未验证部署/状态 | 是 | title、description、OG、Twitter | 无 | 是 | Header/Footer/首页 | MythRealms | 只有 pearl-series 是有效动态集合，索引页的分类来源可能扩展为无效链接 | P1：发布前对 `CATEGORIES` 与动态页接受的 slug 做一致性测试 | `src/app/collections/page.tsx:8-23,62-105`; `src/app/collections/[slug]/page.tsx:34-68`; `src/lib/seo/sitemap.ts:19-21` |
| `/collections/pearl-series`、`?type=`筛选 | 未验证 200/308/noindex 响应 | 固定为无参数 pearl-series | 动态 title/description/OG；有 query 时 `robots: noindex,follow` | CollectionPage + BreadcrumbList | 是（主 URL） | Header/Footer、Gifts、首页、llms | MythRealms | 若 query robots metadata 未如期渲染，筛选 URL 会产生重复风险 | P0：在生产核验带 query 的 `X-Robots-Tag`/meta robots 与 canonical；不要把筛选 URL 加入 sitemap | `src/app/collections/[slug]/page.tsx:27-54,65-94`; `src/lib/storefront/navigation.ts:16-23` |
| `/collections/new-arrivals` | 未验证部署/状态 | 是 | 专属 metadata | 未在本次源码抽样发现专属 schema | 是 | Header/Footer、llms | MythRealms | 与 catalog 库存状态关联，sitemap 静态列出而内容可能为空 | P1：生产验证有可见商品时的 200、无商品时的索引策略 | `src/app/collections/new-arrivals/page.tsx:13-24`; `src/lib/seo/sitemap.ts:21`; `src/lib/storefront/navigation.ts:17,60` |
| `/products/[slug]`（63 个白名单路由模式） | `dynamicParams=false` + 静态参数来源于可见 catalog；未验证构建产物与 63 个 HTTP 响应 | 是（有效商品） | 动态 title/description、OG、Twitter；无效 slug noindex,nofollow | Product + BreadcrumbList | 是，来源同一 catalog | Collection、Gifts、Edits、产品卡、sitemap | MythRealms | 白名单 63 与 `isActive/inStock` 过滤可能使实际静态参数少于 63；未验证所有图像/价格/Offer | P0：构建后导出/抓取参数清单，逐项对 sitemap、canonical、Product JSON-LD、200 做自动核验 | `src/lib/storefront/catalog.ts:17-82,98-113`; `src/app/products/[slug]/page.tsx:13-52`; `src/app/products/[slug]/1688-product.tsx:160-177`; `src/lib/seo/sitemap.ts:41-45` |
| `/guardian-quiz` Guardian/神话入口 | 未验证部署/交互/状态 | 是 | title、description、OG；无 Twitter 显式覆盖 | 无 | 是 | Discover、Footer、首页 Guardian、FAQ/Contact | MythRealms；“guardian archetype”仍为客户可见旧叙事 | sitemap 收录但无 schema；结果若由客户端决定，抓取价值需实测 | P1：定义该页是长期可索引落地页还是活动工具；前者补 Twitter/FAQ 或 WebPage schema；**任何客户可见改名冻结至 name clearance** | `src/app/guardian-quiz/page.tsx:5-18`; `src/components/home/HomepageGuardian.tsx:8-31`; `src/lib/storefront/navigation.ts:40-50,80-86`; `src/lib/seo/sitemap.ts:23` |
| `/edits/[slug]`（4 个 Pearl Edit） | 未验证静态参数和 HTTP 响应 | 是 | 动态 metadata | ItemList + BreadcrumbList | 是（`PEARL_EDITS`） | Gifts、首页、相关编辑 | MythRealms | Breadcrumb 的上级指向 `/gifts` 而名称为 Pearl Edits，信息架构可能含混 | P2：确认编辑页的上级 IA；若改 URL，先制定 308 映射 | `src/app/edits/[slug]/page.tsx:28-82`; `src/lib/storefront/pearl-edits.ts:12-65`; `src/app/sitemap.ts:25-30` |
| `robots.txt` 特殊路由 | 未验证实际 `/robots.txt` 200、Content-Type 或 bot 解析 | 不适用 | 不适用 | 不适用 | 指向 `/sitemap.xml` | 禁止 API/admin/account/auth/checkout/studio；允许 `/` 和 `/api/feed$` | llms、sitemap 互相引用 | MythRealms | `allow: ["/", "/api/feed$"]` 的 `$` 是否按目标爬虫解释需生产文本检查；robots 不等于 noindex | P0：生产下载并用 Google/Bing 测试工具核验规则；对敏感/重复页面继续依赖 noindex | `src/app/robots.ts:4-28`; `src/app/llms.txt/route.ts:44-48`; `next.config.ts:118-131` |
| `sitemap.xml` 特殊路由 | 未验证实际 XML、URL 数量、DB 可用性和缓存更新 | 条目来自 `siteUrl` | 不适用 | 不适用 | 资产本身 | 不列出账户/结账等私有路径 | robots、llms | MythRealms | `revalidate=3600`，文章 DB 查询失败会影响输出；缺 `lastModified` 的产品/静态页降低变更信号 | P0：生产每小时后抓取 XML，校验 63 模式的实际可见产品、非 4xx、无 noindex URL；P2：为可得资源补 lastModified | `src/app/sitemap.ts:10-31`; `src/lib/seo/sitemap.ts:17-69` |
| `/llms.txt` Route Handler | 未验证实际 200、text/plain 或被外部系统采用 | 内容声明 canonical site | 纯文本，不是 Next metadata | 不适用 | 不在 sitemap | 无 | 可发现核心页、机器资源 | MythRealms 多处 | llms.txt 非搜索引擎索引协议，不能替代 sitemap/structured data；文中产品范围须与 catalog 同步 | P1：生产验证 content-type/正文；版本化检查所列 URL 均可访问；**改名相关文案冻结至 name clearance** | `src/app/llms.txt/route.ts:3-57` |

## 重定向、noindex 与品牌残留

- 已配置永久 308：`/story → /about`，以及三个退役 collection slug → `/collections/pearl-series`；动态集合页也对同三 slug 调用 `permanentRedirect`。应以生产 HTTP 抽测确认没有重复跳转。
- 全局 `X-Robots-Tag: noindex, follow` 覆盖 account/admin/auth/cart/checkout/pinterest/returns/search/studio/track-order/unsubscribe/wishlist；account、cart、checkout layout 另有 metadata robots。`robots.txt` 的 Disallow 不可替代这些 noindex 防线。
- 源码中未发现 “Maverenne” 字符串（搜索范围 `src`、`public`、`content`，排除 demo/preview 的结论不适用于部署资产）；客户可见旧品牌为 **MythRealms**，分布在根 metadata、结构化数据、Header/Footer、产品/集合页、llms.txt、支持邮箱与社媒账号。该判断是代码文本盘点，不是对外品牌/商标状态判断。

## 修复优先级

### P0

1. 在生产环境抓取 `/sitemap.xml`、`/robots.txt`、`/collections/pearl-series?type=earrings`、代表商品和四个旧 URL：记录 HTTP 状态、跳转链、canonical、meta robots、XML 条目。代码证据不能代替该验证。
2. 为实际输出的商品集合建立 CI/发布门禁：每个 URL 必须 200、self-canonical、Product JSON-LD、未被 noindex，且 sitemap 中不含 4xx/noindex URL。
3. **冻结**所有客户可见的 MythRealms → Maverenne（或任何新名称）替换、域名迁移、canonical/structured-data/llms/社媒改名，直至 name clearance 通过；届时先制定全量 308 与回滚计划。

### P1

1. 给 `/faq` 增加专属 title、description、canonical、OG/Twitter，并用富结果测试验证 FAQPage。
2. 为首页补专属 metadata/OG，清理 collections 索引与有效 slug 的不一致风险。
3. 明确 Guardian Quiz 的长期搜索目标并补齐相应 metadata/schema；核对 Journal、New Arrivals、llms.txt 的运行时内容与 sitemap。
4. **冻结**以上任一客户可见品牌词、品牌 URL 或品牌 schema 名称的改动，直至 name clearance。

### P2

1. 为 hub/编辑页评估 Breadcrumb/Article schema 与 `lastModified` 的补充，优先依据实际内容维护流程。
2. 建立每次发布后的 robots、sitemap、canonical、结构化数据和重定向抽测；验证 FAQ/Article 富结果仅表示资格，不承诺展示。
3. name clearance 通过后，再审查旧品牌在客户可见源码、邮件模板、公开 `content` 文档、域名与第三方账号中的迁移顺序。
