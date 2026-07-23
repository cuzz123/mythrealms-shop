# MythRealms 内容入口、Story 与 SEO/GEO 建设设计

**日期：** 2026-07-18

**状态：** 已经用户确认

**设计方向：** 编辑型精品电商，兼顾购买转化与内容权威
**品牌叙事：** 品牌主导，不公开或虚构创始人身份

## 1. 背景

MythRealms 已完成珍珠单一品类和地中海编辑视觉的第一轮统一。当前公开目录约 45 个珍珠 SKU，具备耳环、项链、手链、戒指和眼镜链等基础购物入口，但内容结构仍有三项明显缺口：

1. 导航以商品类型为主，缺少礼物、预算、场景和知识型入口。
2. `/about` 更像运营说明，没有形成可记忆、可信且与当前视觉一致的品牌故事。
3. `/pearls` 只有简短选购提示和 FAQ，尚未形成能承接搜索查询和答案引擎引用的珍珠知识中心。

本轮建设采用“编辑型精品电商”方案：保持目录克制，通过 Gifts 提升购买入口，通过 Pearl Knowledge Hub 建立内容权威，通过 Story 解释品牌审美和选品标准。不会把当前规模的商店扩张成大型零售 Mega Menu，也不会上线需要持续高频更新的杂志系统。

## 2. 目标

### 2.1 商业目标

- 让首次访问者可以按产品类型、预算、礼物需求和知识问题进入商店。
- 在不虚构销量、评论、产地、工艺和品牌历史的前提下提升信任。
- 从首页、知识页、Story 和商品页形成可追踪的购买路径。
- 为欧美市场的珍珠相关搜索和 AI 答案引用建立稳定页面。

### 2.2 用户目标

- 快速找到适合自己的珍珠品类或礼物预算。
- 在购买前获得清楚的珍珠护理、搭配和天然差异说明。
- 理解商品参考图与编辑佩戴图分别承担的作用。
- 清楚了解配送、退货、商品真实性和品牌承诺边界。

### 2.3 非目标

- 不建设需要日常编辑运营的完整 Journal/CMS。
- 不创建没有足够 SKU 支撑的材质、颜色、人群和节日薄内容页。
- 不声称 MythRealms 自有工厂、设计工作室、手工制作流程、环保认证或供应链溯源。
- 不添加虚构创始人、专家、奖项、媒体报道、客户评价或销售排名。
- 不改变结账、订单、商品图库和现有公开 SKU 的商业逻辑。
- 不在本轮购买或绑定域名；域名是发布前独立步骤。

## 3. 竞品启示

本设计参考 Mejuri、Missoma、Monica Vinader 和 Catbird 当前公开站点，提炼适合 MythRealms 规模的共同模式：

- Gifts 不是单一商品集合，而是按预算、场景和个性组织的视觉导购入口。
- Story 同时回答品牌为何存在、如何选择产品以及消费者可以相信什么。
- Care、Materials、Sizing 和 Styling 等实用知识承担长期搜索入口。
- 重要分类和内容页通过 Header、首页、商品页和 Footer 多次获得普通 HTML 链接。
- 头部品牌拥有大量 SKU 和线下服务，MythRealms 不复制其大型菜单、门店或服务体系。

## 4. 信息架构

### 4.1 顶部导航

桌面与移动导航共用一份类型化配置，提供三个主要菜单：

#### Shop

- All Pearl Jewelry -> `/collections/pearl-series`
- New Arrivals -> `/collections/new-arrivals`
- Pearl Earrings -> `/collections/pearl-series?type=earrings`
- Pearl Necklaces -> `/collections/pearl-series?type=necklaces`
- Pearl Bracelets -> `/collections/pearl-series?type=bracelets`
- Pearl Rings -> `/collections/pearl-series?type=rings`
- Pearl Eyewear Chains -> `/collections/pearl-series?type=eyewear-chains`

#### Gifts

- Pearl Gift Guide -> `/gifts`
- Gifts Under $50 -> `/gifts#under-50`
- Gifts Under $70 -> `/gifts#under-70`
- Everyday Gifts -> `/gifts#everyday`
- Statement Pearls -> `/gifts#statement`

预算和风格入口使用 `/gifts` 内的稳定锚点，不生成大量可索引筛选 URL。

#### Discover

- Pearl Guide -> `/pearls`
- Pearl Care -> `/pearls/care`
- How to Wear Pearls -> `/pearls/how-to-wear`
- Freshwater Pearl Guide -> `/pearls/freshwater-pearls`
- Find Your Guardian -> `/guardian-quiz`
- Our Story -> `/about`

当前重复出现的 Pearls、Story 和 Intention 顶级入口将合并到上述结构。Guardian 保留为品牌互动层，但不与珍珠知识和产品事实混写。

### 4.2 Footer

Footer 调整为四组：

- Shop：The Pearl Edit、New Arrivals、Earrings、Necklaces、Bracelets、Rings、Eyewear Chains。
- Learn：Pearl Guide、Pearl Care、How to Wear、Freshwater Pearls、FAQ。
- About：Our Story、Find Your Guardian、Contact、社交账号。
- Help：Shipping、Returns、Track Order、Refund、Privacy、Terms。

Newsletter 和真实配送/退货信息继续保留，不新增未经验证的服务承诺。

### 4.3 新增及重构路由

- 新增 `/gifts`。
- 新增 `/collections/new-arrivals`。
- 重构 `/pearls` 为知识中心。
- 新增 `/pearls/care`。
- 新增 `/pearls/how-to-wear`。
- 新增 `/pearls/freshwater-pearls`。
- 重构 `/about` 为品牌 Story。
- 新增 `/story` 永久重定向到 `/about`，canonical 始终指向 `/about`。

## 5. 首页调整

首页保持现有 Hero、Shop by Style、Pearl Edit、Editorial Story、Guardian 和 Newsletter 顺序，只增加两个高价值内容入口，避免继续堆叠同质卡片：

1. Gift Guide：使用产品与佩戴图组合，入口指向 `/gifts`。
2. Pearl Knowledge：使用场景图和三条文字链接，入口指向 Pearl Guide、Care 和 How to Wear。

两个入口使用全宽编辑带或非对称双栏，不使用嵌套卡片。首屏和已有分类区不被挤压，移动端保证图片、标题和 CTA 不重叠。

## 6. Story 页面

### 6.1 内容原则

Story 解释品牌观点和选品逻辑，不虚构个人经历。页面可以使用“we”代表品牌团队，但不得暗示并不存在的工作室、工匠、自产流程或认证。

### 6.2 页面结构

1. **Hero**
   - Eyebrow：`Our Story`
   - H1：`Pearls, edited for real life.`
   - 核心文案：MythRealms 将珍珠从只属于特殊场合的符号，带回日常衣柜、自然光和真实生活。
   - 使用现有地中海自然光佩戴图，首屏底部露出下一段。

2. **品牌观点**
   - 标题：`Why should pearls wait for an occasion?`
   - 说明品牌聚焦珍珠的原因，以及衣柜、比例、肤色、自然光和重复佩戴如何影响选品。

3. **选品标准**
   - Wearability：是否适合反复佩戴。
   - Proportion：珍珠、链条、坠饰与人体比例是否协调。
   - Product Truth：购买判断是否有对应 SKU 图库支持。
   - Versatility：是否能适配衬衫、针织、礼服和日常服装。

4. **产品参考与编辑表达**
   - `Product Reference` 使用同一 SKU 的真实产品图，承担结构、颜色、比例、表面和材质细节判断。
   - `Editorial Styling` 使用模特佩戴和场景图，承担搭配、光线和穿着氛围表达。
   - 页面明确说明部分编辑场景和佩戴图经过数字化创作，最终购买判断以商品图库为准。

5. **The Pearl Edit**
   - 使用非对称杂志版式进入 Earrings、Necklaces、Bracelets 和 Rings。
   - 不重复首页五张分类卡的布局。

6. **真实承诺**
   - 产品页展示当前可确认的材质信息。
   - 商品结构以对应 SKU 图库为准。
   - 配送时间和退货窗口明确可见。
   - Guardian 和 intention 文案不构成医疗、治疗、精神或结果保证。

7. **结尾入口**
   - `Shop The Pearl Edit`
   - `Read The Pearl Guide`

### 6.3 视觉

- 延续自然皮肤纹理、白色亚麻、石墙、海面、橄榄树和暖阳。
- 采用全宽图像带、分栏正文、无框文字和克制的细分线。
- 避免装饰性图标卡、渐变背景、大圆角营销卡和口号堆叠。

## 7. Gifts 页面

### 7.1 页面目标

Gifts 是单一、可索引的商业导购页。它通过真实规则组织公开 SKU，既方便购买，也避免为每个预算生成重复集合页。

### 7.2 分区规则

- Under $50：`price < 50`。
- Under $70：`price < 70`，但页面展示时优先排除已出现在 Under $50 首屏的重复 SKU。
- Everyday Gifts：使用明确维护的 SKU 列表，不依据虚构销量或评论自动判断。
- Statement Pearls：使用明确维护的 SKU 列表，不通过图片识别或描述关键词临时判断。

所有商品必须同时满足 `isActive === true` 与 `inStock === true`。某分区没有商品时整段隐藏。页面不显示“Best Seller”或“Most Loved”，除非未来接入真实销售数据。

## 8. New Arrivals

`/collections/new-arrivals` 只展示公开目录中 `isNew === true`、`isActive === true`、`inStock === true` 的商品。页面具有稳定 canonical、独立标题和说明，但商品详情 canonical 保持各自商品 URL。

若新品为空，页面显示返回 The Pearl Edit 的说明和链接，不输出空商品网格。

## 9. Pearl Knowledge Hub

### 9.1 Hub

`/pearls` 从 FAQ 页面升级为内容中心，承担以下职责：

- 提供珍珠选购的直接答案。
- 介绍 Care、How to Wear 和 Freshwater Pearls 三篇支柱指南。
- 按 Earrings、Necklaces、Bracelets & Rings 提供商品入口。
- 展示可见 FAQ，并链接完整 FAQ 页面。

### 9.2 文章统一结构

每篇指南包含：

1. H1 后 40 至 70 个英文单词的直接答案。
2. 页面目录和语义化锚点。
3. 使用问题式 H2 的正文。
4. 可核实的对比表、步骤或注意事项。
5. 可见 FAQ。
6. 相关商品与其他指南。
7. `MythRealms Editorial` 署名、真实发布日期、更新日期和来源链接。

重要结论引用 GIA 等一手珠宝教育资料。不得把一般珍珠知识套用为某个 SKU 的材质、产地或品质结论。

### 9.3 三篇支柱内容

- `/pearls/care`：佩戴顺序、清洁、保存、避免接触的物质、是否可以洗澡或游泳、常见护理错误。
- `/pearls/how-to-wear`：耳环与脸部比例、项链与领口、手腕和戒指搭配、日常与正式场景、与金属首饰混搭。
- `/pearls/freshwater-pearls`：养殖淡水珍珠的基本特征、形状和表面差异、光泽判断、与其他养殖珍珠的区别、购买前应确认的信息。

## 10. SEO 设计

### 10.1 页面元数据

每个新增或重构页面拥有独立：

- `title`
- `description`
- canonical URL
- Open Graph title、description、image 和 URL
- Twitter card
- 唯一 H1

筛选参数和锚点不生成独立 canonical。`/story` 不参与索引，只永久重定向。

### 10.2 内部链接

- Header 和 Footer 直接链接所有核心商业页与支柱内容。
- 首页直接链接 Gifts、Pearl Hub 和重点商品。
- 分类页链接对应选购指南。
- 商品页链接 Care、How to Wear 和 Gifts。
- 每篇指南至少链接一个商业页和两篇相关内容。
- 所有关键路径使用普通 `<a href>`，不依赖搜索框、点击事件或客户端筛选才能发现。

### 10.3 结构化数据

- 全站保留 `WebSite`、`Organization`、`OnlineStore`。
- Organization 增加与页面可见政策一致的配送和退货信息。
- Story 输出 `AboutPage` 和 BreadcrumbList。
- 指南输出 `Article`、BreadcrumbList，并仅为可见问答输出 FAQPage。
- Gifts 与集合页输出 `CollectionPage` 和 ItemList。
- 商品页 Product/Offer 只输出真实 name、description、image、sku、brand、category、price、currency 和 availability；material 与 color 仅在该 SKU 已有可确认数据时输出。
- 不输出无法验证的 aggregateRating、review、GTIN、MPN、产地、认证或销量。
- JSON-LD 在服务器初始 HTML 中生成，并与页面可见内容一致。

### 10.4 Sitemap 与索引

- Sitemap 纳入首页、核心集合、Gifts、Story canonical、Pearl Hub、三篇指南、FAQ、服务页和全部公开商品。
- 不纳入查询参数、锚点、后台、账户、结账、API、Studio 和旧 Blog Archive。
- robots.txt 继续禁止非公开路径。
- 发布后通过 Google Search Console 检查 Page Indexing、Merchant Listings 和 Product Snippets 报告。

## 11. GEO 与答案引擎设计

- 允许 OAI-SearchBot 和 OAI-AdsBot 抓取公开页面。
- 后台、账户、结账、API 和 Studio 对所有搜索及答案引擎保持禁止。
- 保持 GPTBot 当前策略，不把训练抓取与搜索抓取混为同一控制。
- 重要答案、表格和 FAQ 直接存在于服务器 HTML。
- 更新 `public/llms.txt` 为简洁站点地图；它是辅助入口，不被描述为排名保证。
- 页面使用清楚的标题层级、列表、表格、ARIA 标签、可描述图片 alt 和稳定锚点。
- Analytics 单独识别 `utm_source=chatgpt.com` 的 ChatGPT 搜索引流。
- 为 Bing 和支持的答案检索引擎准备 IndexNow 提交流程；域名稳定后启用。

Google AI 搜索仍依赖标准 SEO，不需要特殊 AI schema 或机器文件。GEO 的重点是可抓取、可理解、可引用、内容真实和实体关系清楚。

## 12. 组件与数据边界

### 12.1 数据模块

- `src/lib/storefront/navigation.ts`：Header、移动菜单和 Footer 共用的入口配置。
- `src/lib/editorial/guides.ts`：指南注册表、元数据、关联页面和来源。
- `src/lib/editorial/gifts.ts`：礼物分区定义和明确维护的 SKU 列表。
- `src/lib/storefront/catalog.ts`：继续作为公开商品真相来源。
- `src/lib/site.ts`：继续作为 canonical 和绝对 URL 的唯一来源。

内容模块不得覆盖商品价格、库存、图片、材质或公开状态。

### 12.2 UI 组件

- `StorefrontNavigation`：消费统一导航配置。
- `EditorialHero`：Story 和指南页共用的首屏布局。
- `GuideLayout`：目录、正文、事实表、FAQ、来源和相关入口。
- `RelatedProducts`：根据公开目录过滤明确 SKU。
- `EditorialLinkBand`：首页 Gifts 与 Pearl Knowledge 入口。
- JsonLd helpers：AboutPage、Article、CollectionPage、ItemList 和商家政策。

组件保持单一职责，不把所有文章正文塞进一个巨大 JSX 文件，也不重构与本轮无关的结账或账户组件。

## 13. 数据流与降级

1. 页面从指南或礼物配置读取内容定义。
2. 商品模块只通过 `getStorefrontProducts()` 获取公开商品。
3. `RelatedProducts` 和 Gifts 分区再次校验 active 与 stock 状态。
4. 结构化数据从同一页面数据和商品对象生成，避免两套值漂移。
5. Sitemap 从页面注册表和公开目录生成。

降级规则：

- 礼物分区无商品时隐藏整段。
- 关联 SKU 下架或缺失时从推荐中移除。
- 商品相关图片失败时只回退到同一 SKU 主图。
- 指南图片失败时保留正文布局，不以其他商品图冒充。
- JavaScript 禁用时正文、链接、FAQ 和商品入口仍可见。

## 14. 可访问性与性能

- 保持单一 H1 和连续标题层级。
- 所有菜单、目录、FAQ 和 CTA 支持键盘与清楚的 focus 状态。
- FAQ 使用原生 details/summary 或等价可访问实现。
- 表格在窄屏允许水平滚动，并提供语义化表头。
- 图片使用稳定 aspect ratio、响应式 sizes 和明确 object-position。
- 首屏只优先加载主图；正文和商品图延迟加载。
- 遵守 reduced-motion，禁用无限装饰动画。

## 15. 测试与验收

### 15.1 自动测试

- 导航配置同时被桌面、移动端和 Footer 消费。
- Gifts 预算规则和明确 SKU 分组正确，且只返回公开有货商品。
- New Arrivals 只返回 `isNew && isActive && inStock` 商品。
- 指南注册表包含唯一 slug、canonical、标题和来源。
- Sitemap 包含全部新增页面且不包含参数页。
- JSON-LD 可以解析，类型和字段与可见内容一致。
- 不出现虚构评分、GTIN、MPN、产地、认证或其他商品图片。
- Balance & Light 与其他退休系列不重新进入公开导航、Feed 或 Sitemap。

### 15.2 E2E

- 桌面和移动菜单均可进入 Shop、Gifts、Discover。
- Escape 关闭桌面菜单并恢复触发器焦点。
- `/story` 永久跳转 `/about`。
- Story、Gifts、New Arrivals、Pearl Hub 和三篇指南返回 200。
- Gifts 与文章中的商品链接进入正确 SKU。
- 页面在禁用 JavaScript 时仍显示主要正文和普通链接。

### 15.3 视觉验证

- 视口：1440x900、390x844、320x800。
- 检查 Header、Hero、目录、表格、图片裁切、商品网格、Footer 和移动菜单。
- 不允许横向溢出、文字遮挡、空白图片、内容卡片嵌套或首屏只剩图片。

### 15.4 发布门槛

- 单元测试、TypeScript、lint、production build 和 Playwright 全部运行。
- 结构化数据通过本地解析测试；部署后使用 Google Rich Results Test 和 URL Inspection 复核。
- 自定义域名绑定后再把生产 canonical、Search Console、Merchant Center 和 IndexNow 切换到正式域名。

## 16. 成功标准

- 用户可在两次点击内从任意公开页进入主要商品类别、Gifts、Pearl Guide、Story 和 Help。
- 新页面均有独立搜索意图、可见正文、真实内部链接和合法 canonical。
- Story 不包含虚构人物、工艺、认证或供应链承诺。
- 商品结构、图片、价格、库存和政策在可见页面、Feed 与 JSON-LD 之间保持一致。
- SEO/GEO 建设不依赖 `llms.txt` 或 schema 堆叠，而依赖真实内容、清楚实体和可抓取结构。

## 17. 参考资料

- Mejuri About Us: https://mejuri.com/gb/en/company/about-us
- Mejuri Gift Guide: https://mejuri.com/world/en/guided-shop/gift-guide
- Missoma About: https://us.missoma.com/pages/about-missoma
- Monica Vinader About: https://www.monicavinader.com/us/about
- Catbird Sitemap: https://www.catbirdnyc.com/sitemap
- Google ecommerce navigation: https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure
- Google merchant listing structured data: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- Google AI features and websites: https://developers.google.com/search/docs/appearance/ai-features
- OpenAI Publishers and Developers FAQ: https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
- IndexNow documentation: https://www.indexnow.org/documentation
