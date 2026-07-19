# MythRealms 冷启动下一阶段实施计划

> **面向智能体执行者：** 必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans` 子技能，按任务逐项执行本计划。所有步骤均使用复选框（`- [ ]`）语法跟踪进度。

**目标：** 用 7 天完成美国市场上线准备，打通“产品事实、跨境履约、生产数据追踪、首周内容”四个关口，并在全部通过后启动结构化的 14 天自然流量测试。

**整体架构：** 先以四款候选产品建立可审计的事实和成本资料，再根据真实履约能力修正商品页承诺；随后验证 Vercel 生产环境和完整电商事件漏斗；最后只为通过门槛的产品制作首周内容。所有对外发布和预算消耗均受人工审核及停止条件约束。

**技术与运营工具：** Next.js、Vercel、GA4、Meta Pixel、Pinterest Tag、Google Search Console、Google Merchant Center、TikTok、Instagram、Pinterest、现有生图工具、Seedance 2.0、1688、跨境集运或代发服务商。

## 全局约束

- 仅面向美国市场，对外内容使用英文，内部执行与确认使用中文。
- 不新增 AI 订阅，不采购首批库存，不在产品验证前投放广告。
- 四款候选产品为 Violet Rain、Moon Disc、Turquoise Leaf 和 Falling Pearl。
- 供应商原图、AI 图、页面描述和视频中的产品结构必须一致。
- 未取得供应商证明时，不得宣称珍珠类别、贵金属纯度、产地、手工制作、防水、疗愈效果或稀缺性。
- 供应商不直接发美国时，必须通过可追踪的国内集运仓或跨境代发服务完成履约。
- 预算继续锁定为：1,100 元履约周转金、400 元退款或补发准备金、300 元广告储备、100 元必要素材、100 元应急。
- 7 天准备阶段不动用 300 元广告储备。
- 每个外部平台配置和真实支付操作都需要人工确认。
- 工作区存在大量视频与 3D 素材，提交时只暂存本任务明确列出的文件。

---

### 任务 1：建立执行基线并同步计划状态

**时间：** 第 1 天上午

**文件：**
- 创建：`docs/operations/cold-start-launch-status.md`
- 修改：`docs/superpowers/plans/2026-07-18-cold-start-technical-readiness.md`
- 修改：`docs/superpowers/plans/2026-07-18-cold-start-channel-setup.md`
- 修改：`docs/superpowers/plans/2026-07-18-cold-start-content-operations.md`

**输入：** 当前仓库代码、Vercel 项目、三个冷启动计划。

**输出：** 一份区分“代码已存在、生产已验证、外部平台已完成、尚未执行”的状态表。

- [x] **步骤 1：记录 Git 基线**

运行：

```powershell
git status -sb
git log -8 --oneline
```

将当前分支、领先远端的提交数、三份中文计划的未提交状态记录到 `cold-start-launch-status.md`。不得把视频、Blender、缓存或临时目录混入本阶段文档提交。

- [x] **步骤 2：建立统一状态标记**

在状态表中对每项能力使用以下四种状态：

```text
未开始：没有代码、资料或平台配置
代码完成：仓库内已有实现，但尚未在生产环境验证
待人工验证：需要登录平台或执行真实业务操作
已完成：已有截图、事件记录、平台回执或测试结果作为证据
```

- [x] **步骤 3：只更新有证据的复选框**

代码存在但生产未验证的步骤不得勾选为完成。每个已勾选步骤必须在状态表中写明证据路径、测试命令或平台记录日期。

- [x] **步骤 4：单独提交中文计划与状态基线**

运行：

```powershell
git add -- docs/superpowers/plans/2026-07-18-cold-start-technical-readiness.md docs/superpowers/plans/2026-07-18-cold-start-channel-setup.md docs/superpowers/plans/2026-07-18-cold-start-content-operations.md docs/superpowers/plans/2026-07-19-cold-start-next-stage.md docs/operations/cold-start-launch-status.md
git diff --cached --check
git commit -m "docs: localize and sequence cold start plans"
```

预期结果：提交中只包含冷启动计划与状态文档。

---

### 任务 2：完成四款产品事实包

**时间：** 第 1 天下午至第 2 天上午

**文件：**
- 创建：`docs/operations/product-truth/violet-rain.md`
- 创建：`docs/operations/product-truth/moon-disc.md`
- 创建：`docs/operations/product-truth/turquoise-leaf.md`
- 创建：`docs/operations/product-truth/falling-pearl.md`
- 可能修改：`src/lib/new-series-products.ts`
- 可能修改：`src/lib/1688-products.ts`
- 测试：`tests/storefront-catalog.test.ts`
- 测试：`tests/storefront-trust.test.ts`

**输入：** 1688 商品链接、供应商聊天记录、供应商原图、当前商品页和四个现有镜头包。

**输出：** 四份只包含可验证事实的产品资料包；任何信息不完整的 SKU 被明确暂停。

- [ ] **步骤 1：记录每款产品的固定事实字段**

每份资料包必须包含：产品名称、站内 slug、1688 链接、供应商名称、采购价、可选款式、可见组件、已验证尺寸、单件重量、包装尺寸、库存处理方式、缺货处理方式、供应商国内发货时效、供应商原图路径、图片许可日期和许可范围。

- [ ] **步骤 2：向供应商取得图片使用许可**

许可记录至少需要明确允许在独立站和社交媒体中使用供应商图片。没有明确回复时，将对应产品标记为“禁止发布供应商图”，不得将沉默视为授权。

- [ ] **步骤 3：逐图检查产品身份**

对照以下源目录和镜头包，检查颜色、形状、珍珠数量、连接结构、吊坠方向和产品比例：

```text
public/images/products/new-series/new-series-purple-gem-pearl-drops/
public/images/products/new-series/new-series-round-shell-disc-drops/
public/images/products/new-series/new-series-leaf-turquoise-pearl-cuff/
public/images/products/new-series/new-series-pearl-y-lariat/
video-pipeline/asset-library/09-shot-templates/SHOT_VIOLET_RAIN_COLD_START_001/
video-pipeline/asset-library/09-shot-templates/SHOT_MOON_DISC_COLD_START_001/
video-pipeline/asset-library/09-shot-templates/SHOT_TURQUOISE_LEAF_COLD_START_001/
video-pipeline/asset-library/09-shot-templates/SHOT_FALLING_PEARL_COLD_START_001/
```

- [ ] **步骤 4：修正无法被事实支持的页面内容**

若产品名称、材质、尺寸、库存或价格与事实包不一致，先在 `src/lib/new-series-products.ts` 或 `src/lib/1688-products.ts` 修正，再发布内容。每项修正都需要在 `tests/storefront-catalog.test.ts` 或 `tests/storefront-trust.test.ts` 中增加回归断言。

- [ ] **步骤 5：执行产品真实性测试**

运行：

```powershell
npm run test:unit -- tests/storefront-catalog.test.ts tests/storefront-trust.test.ts tests/editorial-assets.test.ts
```

预期结果：全部通过；供应商原图仍位于 AI editorial 图片之前。

**通过门槛：** 至少两款产品拥有完整事实、可用图片授权和准确落地页。未通过产品不得进入首周视频生成。

---

### 任务 3：确定可执行的美国履约方案和单位经济性

**时间：** 第 2 天

**文件：**
- 创建：`docs/operations/us-fulfillment-comparison.md`
- 创建：`docs/operations/us-unit-economics.md`
- 可能修改：`src/app/shipping/page.tsx`
- 可能修改：`src/app/refund/page.tsx`
- 测试：`tests/storefront-trust.test.ts`

**输入：** 四份产品事实包、至少三家集运或跨境代发服务商的报价和条款。

**输出：** 一条首选履约线路、一条备用线路，以及四款产品的单件利润表。

- [ ] **步骤 1：询价至少三家服务商**

每家报价统一记录：国内收货仓地址、是否支持 1688 代收、是否验货、是否拍照、合单费、包装费、美国线路、计费重量、首重、续重、预计运输时效、追踪号生成时间、丢件赔付、破损赔付、退件地址和客服响应方式。

- [ ] **步骤 2：用统一公式计算单件经济性**

```text
单件可变成本 = 采购价 + 国内运费 + 代收/验货/包装费 + 国际运费 + 支付手续费 + 退款补发准备
单件贡献毛利 = 美元售价折算人民币 - 单件可变成本
贡献毛利率 = 单件贡献毛利 / 美元售价折算人民币
```

美元换算汇率使用计算当天的实际收款平台结算汇率，并在文档中记录日期，不使用长期固定汇率。

- [ ] **步骤 3：设定履约通过门槛**

首选线路必须同时满足：全程可追踪、能够接收单件 1688 包裹、有明确异常赔付、承诺时效可写入网站、单件贡献毛利率不低于 35%、单次补发不会击穿 400 元准备金。

- [ ] **步骤 4：让网站承诺与真实线路一致**

如果当前 Shipping 或 Refund 页面与选定线路不一致，修改 `src/app/shipping/page.tsx` 和 `src/app/refund/page.tsx`。不得使用“快速配送”“保证送达”等没有服务商合同支持的表述。

- [ ] **步骤 5：验证信任页面**

运行：

```powershell
npm run test:unit -- tests/storefront-trust.test.ts
npm run build
```

预期结果：测试和构建通过，配送与退货文案和实际履约方案一致。

**停止条件：** 找不到可追踪线路，或所有候选产品贡献毛利率均低于 35% 时，暂停内容发布，先更换产品或供应商。

---

### 任务 4：完成生产环境技术验收

**时间：** 第 3 天

**文件：**
- 使用：`.env.example`
- 使用：`docs/operations/cold-start-measurement-runbook.md`
- 使用：`src/lib/tracking.ts`
- 使用：`src/lib/analytics/consent.ts`
- 使用：`src/app/checkout/success/tracker.tsx`
- 测试：`tests/analytics-consent.test.ts`
- 测试：`tests/analytics-tracking.test.ts`
- 测试：`tests/seo-catalog.test.ts`
- 更新：`docs/operations/cold-start-launch-status.md`

**输入：** Vercel 生产项目、GA4 数据流、Meta Pixel、Pinterest Tag 和生产域名。

**输出：** 测试通过记录、生产环境变量清单和移动端漏斗验收结果。

- [ ] **步骤 1：运行本地技术门槛**

```powershell
npm run test:unit -- tests/analytics-consent.test.ts tests/analytics-tracking.test.ts tests/seo-catalog.test.ts tests/storefront-catalog.test.ts tests/storefront-trust.test.ts
npm run lint
npm run build
npm run launch:check
```

预期结果：全部命令退出码为 0。任何失败都先修复，再继续生产验证。

- [ ] **步骤 2：核对 Vercel 环境变量**

至少确认以下生产变量已正确配置；真实值只保存在 Vercel，不写入 Git：

```text
CRON_SECRET
NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_META_PIXEL_ID
NEXT_PUBLIC_PINTEREST_TAG_ID
```

未启用的平台变量可以留空，但必须在状态表中明确标记为停用，不能误报为已验证。

- [ ] **步骤 3：验证移动端完整路径**

使用美国移动端视口依次检查：首页、合集页、四个候选产品页、购物车、结账页、Shipping、Refund、Privacy、Terms。确认没有导航溢出、图片遮挡、错误价格或无法点击的按钮。

- [ ] **步骤 4：验证生产事件漏斗**

按 `docs/operations/cold-start-measurement-runbook.md` 验证：

```text
查看产品 -> view_item
加入购物车 -> add_to_cart
进入结账 -> begin_checkout
支付成功 -> purchase
```

真实低价支付和退款必须由用户单独确认。未经确认时，将 `purchase` 生产验证保留为“待人工验证”，不得自行创建扣款。

- [ ] **步骤 5：验证搜索入口**

确认以下地址在生产环境返回成功，并把结果记录到状态表：

```text
https://mythrealms.shop/robots.txt
https://mythrealms.shop/sitemap.xml
https://mythrealms.shop/blog
```

**通过门槛：** 本地测试、Lint、构建和启动检查全部通过；生产环境页面可用；至少 GA4 的前三个漏斗事件已经在 DebugView 中确认。

---

### 任务 5：配置渠道基线和稳定链接

**时间：** 第 4 天

**文件：**
- 创建：`docs/operations/cold-start-channel-baseline.md`
- 更新：`docs/operations/cold-start-launch-status.md`

**输入：** TikTok、Instagram、Pinterest、Google Search Console、Google Merchant Center 账号。

**输出：** 账号基线、统一 Bio、稳定链接、索引状态和商品 Feed 状态。

- [ ] **步骤 1：记录 TikTok 现有基线**

记录当前粉丝数、已发布内容数、三条旧视频各自的播放、点赞、评论、收藏、主页访问和链接点击。缺失的指标写明“平台未提供”，不估算。

- [ ] **步骤 2：统一三个社媒账号定位**

三个平台名称、头像和品牌描述保持一致。Bio 必须明确说明是珍珠首饰品牌，不使用抽象神兽世界观替代产品类别。

- [ ] **步骤 3：建立稳定 UTM 链接**

采用以下固定命名：

```text
utm_source=tiktok|instagram|pinterest
utm_medium=organic_social
utm_campaign=us_cold_start_2026q3
utm_content=<product>_<format>_<variant>
```

主页默认链接指向 Pearl Edit 合集；单条内容能够放链接时，直接指向对应产品页。

- [ ] **步骤 4：完成搜索平台配置**

在 Google Search Console 验证域名并提交 `https://mythrealms.shop/sitemap.xml`。只有任务 3 的配送和退货信息通过后，才向 Google Merchant Center 提交商品 Feed。

- [ ] **步骤 5：记录发现入口状态**

为 Search Console、Merchant Center、TikTok、Instagram 和 Pinterest 分别记录配置日期、当前状态、异常信息和下一次复查日期。

**通过门槛：** TikTok 可以把用户带到准确合集或产品页；GA4 能识别带 UTM 的美国会话；Sitemap 已提交且无阻断错误。

---

### 任务 6：制作首周七条 TikTok 内容队列

**时间：** 第 5 天至第 6 天

**文件：**
- 创建：`video-pipeline/work/2026-07-19-us-cold-start-week-01/content-queue.md`
- 创建：`docs/operations/cold-start-content-log.md`
- 使用：`video-pipeline/asset-library/09-shot-templates/SHOT_VIOLET_RAIN_COLD_START_001/`
- 使用：`video-pipeline/asset-library/09-shot-templates/SHOT_MOON_DISC_COLD_START_001/`
- 使用：`video-pipeline/asset-library/09-shot-templates/SHOT_TURQUOISE_LEAF_COLD_START_001/`
- 使用：`video-pipeline/asset-library/09-shot-templates/SHOT_FALLING_PEARL_COLD_START_001/`

**输入：** 通过事实与履约门槛的产品、现有首帧、Seedance 2.0 和统一 UTM 规范。

**输出：** 七条审核通过的视频、英文 Caption、首评、披露、音频来源和准确落地链接。

- [ ] **步骤 1：按固定测试矩阵分配七条内容**

```text
第 1 条：Moon Disc 微距动态
第 2 条：Violet Rain 佩戴侧面
第 3 条：Moon Disc 对比 Violet Rain
第 4 条：Falling Pearl 领口展示
第 5 条：AI 场景与供应商参考图说明
第 6 条：Turquoise Leaf 袖口展示
第 7 条：Violet Rain 黑色礼服穿搭
```

没有通过产品门槛的 SKU 用已通过产品的第二 Hook 变体替换，不得为了凑齐四款而发布不确定产品。

- [ ] **步骤 2：先审核首帧，再消耗视频额度**

每个首帧必须确认：产品身份准确、第一秒可见、移动端裁切安全、没有畸形人体、没有多余首饰、没有生成文字。首帧未通过时不得进入 Seedance。

- [ ] **步骤 3：每次只改变一个变量**

第一周可测试变量仅限第一帧或 Hook。视频主体、产品、Caption 结构和落地页保持不变，确保数据能够说明差异来自哪里。

- [ ] **步骤 4：完成发布前记录**

`cold-start-content-log.md` 每条内容记录：文件名、产品、内容形式、Hook、Caption、首评、AI 披露、音频来源、CTA、完整 UTM 链接、计划发布时间、审核结果和拒绝原因。

- [ ] **步骤 5：通过内容质量门槛**

七条视频全部满足：9:16、10-15 秒、前两秒看清产品、无水印、音频可商用、字幕位于安全区、产品页与视频一致、英文文案没有无法证实的材质或功效声明。

**预算门槛：** 只使用已购买的 AI 工具额度；必要素材开支累计不得超过 100 元。

---

### 任务 7：正式启动并执行首轮复盘

**时间：** 第 7 天启动，之后连续执行 14 天

**文件：**
- 更新：`docs/operations/cold-start-content-log.md`
- 更新：`docs/operations/cold-start-launch-status.md`
- 更新：`docs/superpowers/plans/2026-07-18-cold-start-content-operations.md`

**输入：** 七条已审核内容、可用产品页、UTM 链接和已验证的 GA4 数据流。

**输出：** 第一条结构化测试内容上线、2 小时和 24 小时数据，以及首周继续／迭代／停止决定。

- [ ] **步骤 1：发布前执行最终上线门槛**

只有以下条件全部成立时才发布：至少两款产品事实包通过；首选和备用履约线路已记录；配送与退货文案准确；GA4 前三个漏斗事件已验证；七条内容通过人工审核；社媒链接可访问准确落地页。

- [ ] **步骤 2：按固定时间发布**

首七天统一在美国东部时间晚上 8:00发布。不得因为前几小时播放低而临时增加发布数量。

- [ ] **步骤 3：记录 2 小时和 24 小时数据**

每条内容记录：播放量、平均观看时长、完播率、点赞、评论、收藏、主页访问、链接点击、美国会话、产品浏览、加购、发起结账和订单。

- [ ] **步骤 4：使用明确规则做首周决策**

```text
低播放 + 低观看时长：更换第一帧或缩短开场
有播放 + 无主页访问：更早展示产品名和穿搭场景
有主页访问 + 无链接点击：修正 Bio 和链接匹配
有产品访问 + 无加购：复查价格、产品可信度、配送和页面
出现严重产品不一致：立即下架并暂停对应 SKU
```

- [ ] **步骤 5：第 7 条发布满 24 小时后形成首周结论**

为每个产品和内容形式给出“保留、迭代、停止”之一。下一周只复制能够带来主页访问、产品页访问或加购的信号，点赞只作辅助指标。

---

## 七天日程

| 日期阶段 | 核心工作 | 当天必须产出 |
| --- | --- | --- |
| 第 1 天 | Git 与计划基线、产品事实收集 | 状态表、四份事实包框架、供应商许可请求 |
| 第 2 天 | 集运询价、单位经济性、产品门槛 | 首选／备用线路、四款利润表、可发布 SKU 名单 |
| 第 3 天 | 测试、构建、Vercel 与生产漏斗验收 | 技术验收记录、环境变量状态、异常清单 |
| 第 4 天 | TikTok、Instagram、Pinterest、GSC、GMC | 渠道基线、稳定链接、Sitemap 提交记录 |
| 第 5 天 | 首帧审核、Seedance 第一批生成 | 4 条通过审核的视频及完整发布资料 |
| 第 6 天 | 完成剩余视频、质量审核、排期 | 7 条完整队列、内容日志、拒绝记录 |
| 第 7 天 | 最终上线门槛、发布第一条 | 第一条正式测试内容、2 小时数据记录 |

## 阶段完成标准

- 至少两款产品拥有完整事实包、图片许可、准确商品页和可接受单位经济性。
- 已确定一条首选和一条备用美国履约线路。
- 本地测试、Lint、构建和启动检查通过。
- GA4 的 `view_item`、`add_to_cart` 和 `begin_checkout` 已在生产环境验证。
- Search Console 已提交 Sitemap，社媒稳定链接带有统一 UTM 参数。
- 七条首周 TikTok 内容已经人工审核并排期。
- 第 7 天正式发布第一条结构化测试内容。
- 1,100 元履约金、400 元退款准备金和 300 元广告储备保持未挪用。
- 任一核心门槛失败时有明确暂停原因，不以继续制作更多素材掩盖问题。

## 第 8 天后的执行方向

- 连续完成 14 天 TikTok 测试，并按计划复用为每周 4 条 Reels 和 4-6 条 Pins。
- 第 15 天开始每周发布一篇由真实用户问题驱动的高购买意图 Journal 文章。
- 第 60 天前保持广告储备锁定，除非达到计划中的访问、加购和事件验证门槛。
- 第 35 天根据有效产品访问、加购和订单选出候选主推 SKU，不根据单纯点赞决定。
