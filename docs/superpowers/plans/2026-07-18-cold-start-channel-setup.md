# MythRealms 美国市场渠道配置实施计划

> **供智能代理执行者使用：** 必须使用子技能 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans，逐项实施本计划。各步骤使用复选框（`- [ ]`）语法跟踪进度。

**目标：** 在不动用预留运营预算的前提下，配置衡量美国市场纯自然流量冷启动所需的外部发现、数据分析和电商渠道。

**架构：** Vercel 承载规范独立站。GA4 是数据衡量来源，Search Console 和 Merchant Center 是 Google 发现入口，TikTok、Instagram 和 Pinterest 负责内容分发。所有主页链接采用统一稳定的 UTM 规范，以便在 GA4 中对比各渠道表现。

**技术栈：** Vercel、GA4、Google Search Console、Google Merchant Center、Meta Business Suite、Pinterest Business、TikTok Business、OpenAI/Perplexity 爬虫验证。

## 全局约束

- 只有在技术就绪计划部署完成后，才能执行本计划。
- 严禁将访问令牌、客户端密钥、恢复代码或付款信息粘贴到仓库文件或截图中。
- 使用已验证的生产域名 `https://mythrealms.shop`，不得使用 Vercel 预览地址。
- 仅面向美国。除非履约能力已经就绪，否则不得在商品 Feed 或营销活动中启用其他国家或地区。
- 第 1-60 天不得启动付费广告。在满足策略规定的触发条件前，预留的 300 元人民币必须保持不动。
- 任何需要账号授权的平台操作，都必须保留为经用户批准后手动执行的操作。

---

### 任务 1：建立 URL 与 UTM 规范

**产出：** 一份私有运营备注，以及全渠道统一使用的四个生产链接。

- [ ] **步骤 1：确认规范生产地址的行为**

逐一打开以下 URL，确认响应成功，并且没有跳转到预览域名：

```text
https://mythrealms.shop/
https://mythrealms.shop/collections/pearl-series
https://mythrealms.shop/sitemap.xml
https://mythrealms.shop/api/feed
```

- [ ] **步骤 2：采用统一的 UTM 命名规范**

使用小写 ASCII 值：

```text
utm_source=tiktok|instagram|pinterest
utm_medium=organic_social
utm_campaign=us_cold_start_2026q3
utm_content=<product>_<concept>_<hook-version>
```

示例：

```text
https://mythrealms.shop/products/new-series-purple-gem-pearl-drops?utm_source=tiktok&utm_medium=organic_social&utm_campaign=us_cold_start_2026q3&utm_content=violet_rain_macro_a
```

- [ ] **步骤 3：为每个渠道建立一个稳定的主页链接**

账号主页统一链接到 Pearl Edit 合集，单条帖子则直接链接到对应产品。在冷启动阶段不使用第三方 link-in-bio 工具。

---

### 任务 2：在 Vercel 中配置 GA4 和生产环境 ID

**产出：** GA4 Web 数据流、生产环境变量，以及通过验证的 DebugView 事件。

- [ ] **步骤 1：创建或确认 GA4 Web 数据流**

网站 URL 使用 `https://mythrealms.shop`，数据流名称使用 `MythRealms US Store`，并私下记录 `G-...` 衡量 ID。

- [ ] **步骤 2：在 Vercel 中添加生产环境变量**

进入 Project Settings -> Environment Variables，只添加实际已经取得的 ID：

```text
NEXT_PUBLIC_GA_ID=G-...
NEXT_PUBLIC_META_PIXEL_ID=...
NEXT_PUBLIC_PINTEREST_TAG_ID=...
```

作用域设为 Production。由于公开变量会被编译进客户端包，添加后必须触发一次新部署。

- [ ] **步骤 3：验证 GA4 事件**

在 GA4 DebugView 或 Realtime 中接受 Cookie，然后执行：

```text
product view -> add to cart -> checkout -> paid test order
```

确认收到 `view_item`、`add_to_cart`、`begin_checkout` 和 `purchase`。确认货币为 `USD`、商品 ID 正确，并且同一订单 ID 只产生一次购买事件。

- [ ] **步骤 4：创建保存的每周获客视图**

报告必须展示来源/媒介、营销活动、落地页、美国用户、商品浏览、加购、开始结账、购买、收入和转化率。

---

### 任务 3：配置 Google Search Console

**产出：** 已验证的域名资源、已接受的 Sitemap，以及索引基线记录。

- [ ] **步骤 1：验证域名资源**

如已有 DNS 验证则沿用。优先为 `mythrealms.shop` 使用域名资源；除非诊断确有需要，否则不要再创建一个相互竞争的 URL 前缀资源。

- [ ] **步骤 2：提交 Sitemap**

提交：

```text
https://mythrealms.shop/sitemap.xml
```

记录提交日期和状态。

- [ ] **步骤 3：检查代表性 URL**

检查首页、Pearl Edit 合集、四个主推产品 URL、Journal 归档页和一篇 Journal 文章。只有在线 URL 显示可索引且规范地址正确后，才请求编入索引。

- [ ] **步骤 4：记录基线**

记录已编入索引页面数、被排除或 noindex 的页面数、已发现但尚未编入索引的页面数，以及所有结构化数据错误。每周复查一次，不要每天反复请求索引。

---

### 任务 4：配置 Google Merchant Center 免费商品展示

**产出：** 仅面向美国的商店设置、定时抓取的主 Feed，以及获批商品基线。

- [ ] **步骤 1：验证企业身份和网站**

确认展示的企业名称、域名、客服邮箱、退货政策、配送政策和结账货币均与线上网站一致。

- [ ] **步骤 2：根据真实履约数据配置美国配送和退货**

只填写所选跨境履约线路确实能够达到的配送时效与费用。不要复制竞品政策。目的地国家仅保留美国。

- [ ] **步骤 3：添加定时 Feed**

将 `https://mythrealms.shop/api/feed` 设置为主 Feed，语言为英语，目标国家为美国，货币为 USD，每日抓取一次。

- [ ] **步骤 4：按事实来源优先级解决诊断问题**

如出现价格、库存、图片、配送或政策不一致，先修复独立站或商品目录，再让 Feed 重新生成。不要只在 Merchant Center 内部临时修改数值。

- [ ] **步骤 5：记录基线**

记录已提交、已批准、受限和被拒商品总数。即使低优先级 SKU 仍有非政策类问题，只要四个主推产品已获批，冷启动仍可继续；任何政策违规都会阻止上线。

---

### 任务 5：配置 TikTok 的美国自然流量分发

**产出：** 完整账号资料、适用于商业内容的安全发布设置，以及渠道主页 URL。

- [ ] **步骤 1：完善账号资料**

使用准确品牌名、易识别 Logo、简短的珍珠首饰品类说明，并将带 TikTok UTM 的主页链接指向 `/collections/pearl-series`。

- [ ] **步骤 2：建立安全发布默认值**

每条商业内容都必须：

- 在 TikTok 提供相关披露选项时，将帖子标记为推广用户自己的品牌。
- 使用写实 AI 人物或场景时，开启 AI 生成内容标签。
- 使用 TikTok Commercial Music Library 中的音频，或拥有可证明商业使用权的音频。
- 不得复用带抖音水印的视频、未授权热门音乐或受版权保护的电影片段。

- [ ] **步骤 3：确保早期账号操作经过人工审核**

如平台支持，可使用定时草稿，但发布前必须人工检查最终裁切、配文、产品身份、披露信息、音频版权和产品链接。不得自动化评论、点赞、关注或重复发布行为。

- [ ] **步骤 4：建立内容审核规则**

在 24 小时内回复真实问题。隐藏垃圾信息和冒充内容。对于材质、珍珠类型、配送或耐用性问题，回答不得超出已验证的供应商和履约事实。

---

### 任务 6：配置 Instagram 和 Pinterest 复用渠道

**产出：** 商业账号、已验证链接，以及可复用发布模板。

- [ ] **步骤 1：Instagram**

将 Instagram 专业账号连接到 Meta Business Suite。添加带 Instagram UTM 的合集链接。确认用户同意营销 Cookie 后，Meta Pixel Test Events 能收到 PageView 和电商事件。

- [ ] **步骤 2：Pinterest**

转换或确认商业账号，认领 `mythrealms.shop`，创建名为 `Pearl Jewelry Styling` 的画板，并在主页使用带 Pinterest UTM 的合集链接。

- [ ] **步骤 3：Pin 内容规范**

每条 Pin 都需要干净的 2:3 图片或兼容视频、直白的产品或造型标题、符合事实的描述、直接产品或指南 URL，以及有用的替代文本。避免堆砌关键词和含糊的神秘功效声明。

- [ ] **步骤 4：验证 Pinterest Tag**

用户同意营销 Cookie 后，在 Pinterest Tag 诊断工具中确认页面、加购和结账事件。

---

### 任务 7：验证 AI 搜索可发现性

**产出：** 可抓取性记录和信息源访问检查。

- [ ] **步骤 1：检查生产环境的 robots 规则**

确认 `OAI-SearchBot` 和 `PerplexityBot` 可以访问首页、合集、产品、Journal、政策页面和 Sitemap。私人账户、结账、后台和 API 路由应保持禁止抓取，规范公开产品 Feed 除外。

- [ ] **步骤 2：检查 AI 系统能够获取的公开事实**

在未登录浏览器中检查首页、About、Shipping、Refund、FAQ、产品页和文章。价格、库存、配送、退货和产品描述必须在各处保持一致。

- [ ] **步骤 3：将直接电商 Feed 项目视为可选项**

仅在账号符合资格时申请 OpenAI 电商或产品 Feed 接入。保持稳定的产品 ID，并以规范商品目录为事实来源。不要仅为了进入答案引擎而另建并维护一个推测性的 Feed。

---

### 任务 8：执行正式上线验收

**产出：** 带日期的上线检查清单，以及通过或不通过的决策。

- [ ] **步骤 1：执行一次移动端验收流程**

在真实设备或模拟的美国移动端视口中执行：

```text
TikTok UTM URL -> product -> add to cart -> checkout -> paid test -> confirmation
```

- [ ] **步骤 2：确认数据链路**

验证会话来源、营销活动、落地页、四个电商事件、订单 ID、USD 金额，并确认没有重复购买事件。

- [ ] **步骤 3：确认发现入口**

确认 Sitemap 已被接受、代表性 URL 可索引、Merchant Feed 能正常抓取、四个主推产品符合免费展示条件，并且公开页面可以抓取。

- [ ] **步骤 4：作出上线决策**

只有付款、产品真实性、数据分析和政策阻断项全部通过后，才启动自然流量发布。搜索索引和 Merchant 审核可以仍在处理中，但不得存在尚未解决的配置或政策错误。

### 完成标准

- 生产环境统计 ID 已配置，且没有暴露密钥。
- 用户同意后，完整电商流程可以在 GA4 和已配置的营销平台中看到。
- Search Console 已接受 Sitemap，代表性 URL 可以编入索引。
- Merchant Center 能抓取 Feed，四个主推产品不存在政策阻断项。
- TikTok、Instagram 和 Pinterest 账号使用各自渠道专属 UTM 链接，并采用合规的披露与音频默认设置。
- 尚未启用任何广告支出。
