# 指标与实验

> **P0 更新（2026-07-26）：SEO/GEO。** Day 0 首先需要 Search Console、Bing Webmaster 与 GA4 的只读同口径基线；在权限、导出/截图日期范围和 GA4 外部接收/报表读取证据齐备前，所有自然搜索流量、参与度、查询与落地页指标均为“待确认”，不得推测。社媒 72 小时记录保留但降级；自动剪辑暂停，广告、CTA 实验与商品状态变更均不启动。

**Owner：增长与数据会话。更新：每日轻检、周五完整复盘。**

北极星：累计真实付费客户数，90 天目标 10–30。所有基线在取得 GA4/订单数据前均为“待确认”，不可填估算值。

## 测量就绪单表（权威状态，2026-07-26）

> 本表是本轮 Task 3 的唯一状态表。`本地实现`、`生产部署`、`外部接收`、`报表可读`、`基线数据`和`决策资格`互不替代；任一后四列为“待确认”时，不得用本地测试、HTTP 200、verification meta、历史截图或历史数字补成当前基线。

| 测量面 | 本地实现 | 生产部署 | 外部接收 | 报表可读 | 当前基线数据 | 决策资格 / Day 0 最小字段 |
| --- | --- | --- | --- | --- | --- | --- |
| GA4 `view_item` | 已实现：商品页调用 `trackViewItem`；精确 payload、consent 拒绝和同意后重试有单测 | `待确认`：有 `NEXT_PUBLIC_GA_ID` 和历史生产部署证据，但未取得当前事件代码与该部署版本的逐项映射 | `待确认`：无 DebugView/实时事件证据 | `待确认`：无同时间窗报表导出 | `待确认`；不得以商品页 HTTP 200 或页面浏览替代 | `false`；需时区/日期范围、数据流、landing page、source/medium、campaign/content、engaged session、`view_item` 数及 consent 路径证据 |
| GA4 `add_to_cart` | 已实现：购物车入口调用 `trackAddToCart`；金额×数量、重复加购和 consent 有单测 | `待确认`，理由同上 | `待确认` | `待确认` | `待确认`；Add to Cart 按钮存在不是事件数据 | `false`；除上述维度外，需商品 ID、数量、币种、事件次数与去重/重复口径 |
| GA4 `begin_checkout` | 已实现：checkout 使用 acceptance-aware controller；payload 与 consent 后重试有单测 | `待确认`，理由同上 | `待确认` | `待确认` | `待确认`；本地 `PENDING` 订单不替代事件接收 | `false`；需商品项、value/currency、事件时点、consent 状态及测试流量标记 |
| GA4 `purchase` | 已实现：仅在结账成功页的 paid presentation 下渲染 tracker；以 `transaction_id` 构造事件，按平台 localStorage 键去重并在 consent 后重试；有单测 | `待确认`，理由同上 | `待确认`；无受控支付与 DebugView 对账证据 | `待确认` | `待确认`；历史 0 / 0 / $0.00 只作 2026-07-25 快照，不是当前基线 | `false`；需订单支付事实、transaction ID 对账、测试标记、事件/订单/营收一致性及幂等证据 |
| Consent（GA analytics / Meta、Pinterest marketing） | 已实现且 fail-closed：缺失/损坏值均拒绝；Essential Only 关闭 analytics/marketing；Accept All 开启两者；撤回会清队列/重载；相关专项测试通过 | `待确认`：有历史生产 Cookie 横幅/GA 客户端证据，未做本轮生产路径复核 | `待确认`：未证明拒绝路径在外部平台无事件、同意路径收到事件 | `待确认` | 不适用为流量基线；需记录同意状态与验证时点 | `false`；至少留存拒绝、同意、撤回三条路径及 GA4/Pinterest 对应外部结果 |
| Search Console sitemap + Google verification | sitemap 本地实现：动态读取已发布博客、公开商品/编辑/发现页，`revalidate=3600` 并去重；robots 指向 `/sitemap.xml`；根 metadata 有 Google verification token。源码测试存在，但本轮 SEO 套件因 Prisma client 缺失在加载阶段阻断 | 历史只读 smoke 记录 `/sitemap.xml` HTTP 200；当前部署内容与 verification meta 未在本轮复核 | `待确认`：没有 Search Console 所有权确认、sitemap 提交/读取或抓取证据 | `待确认`：无 Coverage/Pages/Performance 导出 | `待确认`；HTTP 200 和 verification meta 不是收录基线 | `false`；需 property、完整 sitemap URL、提交/读取时间、状态、发现 URL、已索引 URL、页面/查询 clicks、impressions、CTR、position、时区与日期范围 |
| Pinterest outbound clicks + Pinterest verification | 根 metadata 有 `p:domain_verify`，只是本地声明；outbound clicks 是平台指标，不由站内代码产生 | verification meta 的当前生产呈现 `待确认`；历史 Pin/排期不等于本轮发布或指标 | `待确认`：无本轮 Pin URL、内容 ID、发布时间及 Analytics 读数 | `待确认`：无获授权导出/截图 | `待确认`；历史曝光、播放、排期和空值均不得回填 | `false`；需账号、Pin URL/ID、发布时间与时区、统计窗口、impressions、outbound clicks、outbound CTR、目标 URL/UTM，并与 GA4 landing/source 对应 |
| 历史测试订单永久排除 | **未在当前源码闭环实现**：当前 `prisma/schema.prisma` 无 `Order.isTestOrder`，仓库无所述迁移文件，也未发现所有查询/导出/自动化的统一过滤 | 有 2026-07-25 生产字段结构与 15 笔未标记候选的历史记录；本轮未连接生产复核 | 支付服务商状态 `待确认`；不得外联或登录核验 | `待确认`：尚无证明所有经营报表永久排除的查询/导出 | 15 笔 `PENDING` 仅是历史审计批次，不是当前订单/营收基线 | `false`；需可审计批次标识、字段/迁移与当前 schema 一致、排除前后行数、所有报表/导出/受众/自动化过滤、异常清单；在此之前继续整批人工永久排除 |

本轮验证：`tests/analytics-tracking.test.ts` 与 `tests/analytics-consent.test.ts` 合计 `46/46` 通过。`tests/seo-catalog.test.ts` 和 `tests/checkout-order.test.ts` 因当前工作区无法解析 `.prisma/client/default` 在测试加载阶段阻断；这不是功能失败，也不是通过证据。未运行生产探针，未登录 GA4、Pinterest 或 Search Console。

| 周次 | 访客 | Pinterest / TikTok 流量 | Quiz 完成 | 商品浏览 | 加购 | 结账 | 订单 | 营收 | 订阅/退订 | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Week 1（2026-07-18–2026-07-25，历史快照） | 待确认（GA4 客户端 ID 已存在；接收与报表读取未验证） | 待确认（渠道数据未接入） | 待确认（`quiz_complete` 已实现并通过本地去重/consent 单测；GA4 接收未验证） | 待确认（GA4 接收与报表读取未验证） | 待确认（未取得事件数据） | 待确认（未取得事件数据） | 历史测试批次 15 笔 PENDING；不作为当前订单基线 | $0.00（仅历史本地快照，不是当前营收基线） | 0 / 待确认（仅历史受众快照；退订汇总未取得） | 仅供审计追溯；当前各经营基线仍待确认，不能计算真实转化表现。 |

> 测试订单永久排除：15 笔 `PENDING` 订单固定归类为历史管理员测试批次，永久不计入真实客户、已支付订单、营收、转化率、复购、客服或评价流程；不删除，保留为结账与支付状态机的测试证据。任何平台侧异常均单列核对，不改变整个批次的非经营属性。

## 14 天流量与测量冲刺（2026-07-25–2026-08-07）

核心目标：可归因的独立站有效访问、Guardian Quiz 参与和邮件订阅。具体数值目标待确认，不填估算值。已发生的自然流量仅按历史 Day 0 事实记录；后续有机内容保持内部准备，只有创始人对具体内容已有明确授权且逐条通过素材身份与商用权 QA 时，才由创始人操作。不投广告、不改商品状态。GE1822 样品、美国履约和商品营销解冻暂停而非取消，不作为本冲刺完成条件。

| 日期 | 有效访问 | 来源 / 媒介 / 活动 | Quiz 开始 | Quiz 完成 | Quiz CTA 点击 | 邮件订阅 | 异常 / 数据质量 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Day 0（2026-07-25 11:22:16 America/New_York） | 待确认 | Pinterest / 媒介与活动待确认 | 待确认 | 待确认 | 待确认 | 待确认 | 首条 `new-series-002 v1` 已手动发布；Pin URL、Board、目标 URL/UTM、impressions、outbound clicks 待确认；首次只读检查点为 2026-07-26 11:22:16 America/New_York |
| Day 1–14 | 待确认 | 待确认 | 待确认 | 待确认 | 待确认 | 待确认 | GA4 外部接收、邮件订阅事件名/读取及渠道数据待确认 |

复盘：Day 7 与 Day 14。所有测试流量和历史管理员测试订单继续排除；不得因页面代码价、`isActive` / `inStock` 或目录可见性推断真实库存、订单或营收。

### Day 0 数据状态与采集边界

| 指标/证据 | 当前状态 | Day 0 记法 | 仍需条件 |
| --- | --- | --- | --- |
| 12 商品 URL、UTM 查询参数与入口可用性 | 部署 `dpl_93sG4bA3yj5y51VoN5QELF8orAjd` 后 12/12 商品页及首页、Guardian Quiz、关键健康入口 smoke 通过；商品页 HTTP 200、标题一致、UTM 保留、Add to Cart 存在 | 记录为“技术 URL 验证通过”；不是流量数据 | 逐条发布前复核，不需 GA4 权限 |
| Pinterest impressions / outbound clicks | 已登记的历史起点为创始人手动发布 `new-series-002 v1`；Pin URL、Board、目标 URL/完整 UTM 和当前读数均未提供 | Day 0 历史起点已记录；impressions、outbound clicks 与当前状态继续为`待确认`，不得以历史数据或 0 替代 | 对既有 Pin 的只读证据与 Pinterest Analytics 读取权限；任何后续发布另需创始人既有明确授权及逐条 QA |
| sessions / engaged sessions / source-medium / UTM 归因 | 仅有历史 GA loader / Measurement ID（`NEXT_PUBLIC_GA_ID`）配置与部署证据；当前四个电商事件及 consent 代码与该部署版本的映射、外部接收均待确认 | `待确认` | GA4 property/service account 权限、当前代码版本映射、DebugView/实时报告和报表读取验证 |
| `view_item` / `add_to_cart` / `begin_checkout` / `purchase` | 本地实现和专项测试已确认；生产事件部署映射、外部接收与报表读数均无可信证据 | `待确认` | 见上方权威单表；`purchase` 另须支付事实、测试排除与幂等对账 |
| `quiz_start` | 本地实现与 consent 单测已确认；生产部署映射、外部接收未验证 | `待确认` | GA4 DebugView/实时报告与报表读取验证 |
| `quiz_complete` / `quiz_cta_click` | 本地去重与 consent 单测通过；历史记录称代码曾部署，本轮未复核部署映射，外部接收未验证 | `待确认` | GA4 DebugView/实时报告与报表读取验证 |
| 邮件订阅及来源 | 订阅事件名/归因读取待确认 | `待确认` | 邮件受众/订阅成功记录和归因读取权限 |
| 真实客户 / 已支付订单 / 已支付营收 | 2026-07-25 曾记录 0 / 0 / $0.00，现只作历史快照；当前本地 schema 无 `isTestOrder`，15 笔历史候选未标记 | 当前值均为`待确认`，不得沿用历史 0 | 恢复 schema/迁移一致性并验证标记、生产查询/导出/自动化全链路过滤 |

**Day 0 历史事实与权限边界：** 唯一可确认的启动事实是创始人曾手动发布 `new-series-002 v1`，并以该时刻作为历史 Day 0 起点；这不代表本轮部门获得任何新增发布权限。后续每一条发布都必须已有创始人的明确授权并完成逐条素材身份、商用权、目标 URL/UTM 与内容 QA；否则保持内部准备。GA4 property/service account、DebugView/实时报告、报表读取或 Pinterest Analytics 缺失既不构成发布授权，也不能替代外部测量证据；所有相关字段继续为“待确认”。

## 14 天自然引流冲刺：有效访问基线与复盘（仅准备）

**目标：** 取得可信的有效访问基线，不以订单、营收或商品转化作为本冲刺判断标准。不投广告、不改商品状态、不改 Quiz CTA/URL/文案；内容和落地页不依赖 GE1822 未验证信息。

| 指标 | 统一口径 | Day 0 基线 | Day 7 复盘阈值 | Day 14 复盘阈值 |
| --- | --- | --- | --- | --- |
| Sessions | GA4 会话，按 `source / medium` 与 UTM 拆分 | 待确认（GA4 外部读取未验证） | 至少 20 个 UTM 可归因 sessions 才进行方向性解读；不足则“证据不足” | 至少 50 个 UTM 可归因 sessions 才形成可复用基线；不足则延长观察，不优化 CTA |
| Engaged sessions | GA4 engaged sessions；同时报告参与率 | 待确认 | 在样本门槛满足时，参与率 ≥40% 可继续原节奏；<25% 仅记录问题，Day 14 前不改落地页 | 在样本门槛满足时，参与率 ≥40% 且无测量异常，才形成“有效访问”基线 |
| Source / medium | GA4 `session source / medium` 与 UTM 参数一致 | 待确认 | 已发布内容 100% 有标准 UTM 且能读到来源；否则停止解读并修复测量 | Pinterest/TikTok/直接/自然搜索分别报告；不把无法归因流量归为渠道胜出 |
| Quiz 开始 | 专用 `quiz_start` 事件已在当前本地源码实现，并有 consent 专项测试；生产部署映射、外部接收与报表读取未验证 | 待确认（仅外部数据待确认，不否定本地实现） | 外部验证前不得以页面浏览替代；验证后报告次数与完成率 | 同左；需 GA4 DebugView/实时报告与同时间窗报表证据 |
| Quiz 完成 | `quiz_complete`，去重后计数 | 待确认（本地测试通过，GA4 外部接收未验证） | 外部验证前不解读；验证后报告次数与完成/开始比 | 同左；样本不足标“证据不足” |
| CTA 点击 | `quiz_cta_click`，去重后计数 | 待确认（本地测试通过，GA4 外部接收未验证） | 外部验证前不解读；验证后报告 CTA 点击/完成比 | 同左；不据此启动 CTA 实验 |
| 邮件订阅 | 经确认的订阅成功记录；需可归因来源 | 待确认（受众/订阅事件读取未确认） | 仅报告已确认成功数；不可归因则标待确认 | 同左；不以订阅数替代有效访问 |

**Day 0 启动记录：** Day 0 已于 **2026-07-25 11:22:16 America/New_York** 由 Pinterest `new-series-002 v1` 的手动发布开始。Pin URL、Board、目标 URL/完整 UTM、impressions 与 outbound clicks 均未提供，保持“待确认”，不得按标准模板或历史数据推断。首次只读检查点为 **2026-07-26 11:22:16 America/New_York**；检查前不新增发布。GA4 外部读取证据、consent 外部验证和 Pinterest Analytics 读取未完成时保留为“待确认”，不得作效果判断或扩大节奏。

**Day 0 停止条件：** 素材身份/商用权/商品对应关系缺失或争议；Pin、目标 URL 或 UTM 错配/失效；平台审核限制；或内容出现未确认材质、价格、库存、配送或效果承诺时，立即停止新增发布并只记录异常。Pin URL、Board、impressions 和 outbound clicks 暂缺不填 0；URL/Board/目标 URL/UTM 未补齐前不扩大节奏。

### P0 72 小时渠道分账与复盘

**窗口：** 2026-07-25 11:22:16–2026-07-28 11:22:16（America/New_York）。目标是确认可读数据与异常，不以播放/曝光推断订单、营收或渠道胜出。

| 渠道 / 活动 | 0h 已知数据 | 24h / 48h / 72h 待读字段 | 分账规则 |
| --- | --- | --- | --- |
| Pinterest 账号 A｜`assortment-validation-14d` | `new-series-002 v1` 已发布；Pin URL、Board、目标 URL/UTM、impressions、outbound clicks 待确认 | 按单条 Pin 记录审核、URL/UTM、impressions、outbound clicks、站内会话（若 GA4 可读） | 不计入 `pearl_edit`，不与账号 B、TikTok、Reddit 汇总 |
| Pinterest 账号 B｜`pearl_edit` | 60 条定时；截图中 7 条珍珠 Pin 曝光为 **1 / 1 / 2 / 2 / 2 / 5 / 6**；outbound clicks 待确认 | 定时/实际发布差异、每条 impressions/outbound clicks、可读站内会话 | 仅归入 `pearl_edit`，不用于 `assortment-validation-14d` SKU 排名 |
| TikTok｜活动待确认 | Jul 16 视频 20 播放；Jul 19 视频 71 播放；第三条 9 个分镜已生成，创始人决定使用剪映手动剪辑，尚未确认发布 | 已发布两条的视频 URL、发布时间、播放、个人资料点击/站点点击；第三条仅在创始人确认发布后登记 | 播放与 Pinterest 曝光分开；不视为站内 sessions 或 SKU 需求 |
| Reddit｜无活动 | 未提供发帖、评论、链接或数据 | 是否有已批准活动、链接、可见数据 | 不发布；无数据标待确认，不与其他渠道相加 |

**72 小时复盘门槛：** 仅当账号、活动、内容链接/UTM 与平台字段可对应时，才报告单渠道事实。任一字段缺失、GA4 未外部验证或发生跨账号/跨活动混合时，结论为“待确认/证据不足”。不得基于目前 Pinterest 曝光或 TikTok 播放启动广告、修改商品状态、扩大频次或宣布赢家。

**每日 ≤10 分钟取数：** Pinterest 账号 A 2 分钟、账号 B 2 分钟、TikTok 2 分钟、Reddit 1 分钟、站内/GA4 2 分钟、分账与异常检查 1 分钟；无读取权限的字段写“待确认”。

**复盘规则：** Day 7 只检查数据完整性和访问质量，不修改商品状态、CTA、URL、广告或落地页；Day 14 只提出下一轮内容/测量建议。订单、营收和历史测试订单均不作为本冲刺判断依据。具体日程、UTM 与目标 URL 见 [growth-readiness.md](growth-readiness.md)。

## 技术 QA 记录

- 2026-07-26：本地 P1 测量实现（未部署）：在 analytics consent 已同意后，仅将标准 UTM 首次落地参数写入 sessionStorage；不改 canonical 或用户可见 URL，并把同一会话归因附加到 GA4 增长事件。`quiz_start` 在首次作答时发送一次；`newsletter_subscribe` 只在订阅接口真实成功响应后发送一次。拒绝 analytics consent 时不写入该归因、也不发送或排队事件。本轮可复现命令 `node --import tsx --test tests/analytics-tracking.test.ts tests/analytics-consent.test.ts` 为 46/46 通过；此前没有准确命令可映射的 62/62 数字不作为证据。GA4 DebugView/实时报告的外部接收仍待验证。
- 2026-07-26：SEO/GEO 源码审计（不等于生产收录证明）：robots 对通用爬虫开放公开内容并显式列出 `OAI-SearchBot`，sitemap 覆盖公开商品、内容、编辑页及发现页且去重；商品页具 canonical、Open Graph/Twitter、Product 与 Breadcrumb JSON-LD，根布局具 Organization/WebSite JSON-LD。Google verification meta 存在；Bing 验证与可证明的 Search Console/Bing 收录状态均未在仓库中发现。IndexNow 仅有条件提交代码，缺少可证明的 key 托管/生产启用证据。

- 2026-07-25：14 天引流冲刺的技术审计：主页、`/guardian-quiz`、`/pearls`、`/pearls/stories` 均在源码中声明 canonical；根布局提供默认 OG/Twitter 图，Pearl 内容页提供独立 OG/Twitter 元数据，Quiz 仅有 canonical 与 OG 标题/描述，尚无专属 OG 图/Twitter 覆盖。`robots.txt` 指向 sitemap，sitemap 由公开目录与已发布内容生成。
- 2026-07-25：生产站只读 smoke 已完成。铺货验证池的 12 个商品 URL 均返回 HTTP 200，页面标题与目标商品一致，标准 `utm_source=pinterest&utm_medium=organic&utm_campaign=assortment-validation-14d&utm_content=<slug>-v1` 查询参数均在最终 URL 保留，服务端 HTML 均包含 Add to Cart。The Shell Bloom 在 390×844 视口下显示固定 `Add to cart`，按钮中心命中元素为按钮自身、`pointer-events: auto`，未被其他层覆盖。该结果证明页面可访问与入口可交互，不等于 GA4 已接收 UTM/事件，也不等于商品事实、库存或履约已核验。
- 2026-07-25：早期测量包部署曾因生产 `Order.isTestOrder` 缺列而回滚；后续历史生产迁移只取代了“生产必然缺列”这一旧快照，不代表当前源码/迁移一致，也不证明 15 笔候选已标记或所有查询、导出、受众和自动化已统一过滤。测试订单永久排除闭环继续阻断经营基线与决策资格。
- 2026-07-25 历史生产证据：曾验证 `Order.isTestOrder BOOLEAN NOT NULL DEFAULT false`；但当前仓库无该 schema 字段及所述 `prisma/sql/2026-07-25-is-test-order.sql` 文件。15 笔历史测试候选尚未批量标记，查询/导出过滤是否全面生效仍待确认；不得把生产历史证据写成当前本地实现。
- 2026-07-25：早期“生产未配置 `NEXT_PUBLIC_GA_ID`”快照已被历史 GA loader / Measurement ID 配置与部署证据取代；该证据不证明当前四个电商事件及 consent 代码与部署版本一致，也不证明外部接收。`GOOGLE_ANALYTICS_PROPERTY_ID` 与 `GOOGLE_SERVICE_ACCOUNT_JSON` 仍未配置，GA4 property/service account、DebugView/实时报告和报表读取仍为 Day 0 外部门槛。
- 2026-07-25：UTM 不会被上述入口路由重写或 canonical 元数据剥离，GA4 的默认落地页采集可保留首次 URL 查询参数；现有自定义归因仅对 `utm_source=chatgpt.com` 在 analytics consent 后发送一次 `ai_referral`。站内 CTA 不主动透传 UTM，跨页/跨会话的自定义 UTM 归因尚未实现，不作为本次最小部署包的已验证能力。
- 2026-07-25：本地隔离 clean build 曾受不完整 `@prisma/client` 依赖树影响；后续生产部署已完成远端构建、TypeScript 与页面生成。该本地依赖问题不等同于当前生产未部署，但本地恢复状态仍待技术会话单独处理。
- 2026-07-25 历史记录曾说明 `quiz_complete`、`quiz_cta_click` 代码随生产部署；本轮只能确认当前本地实现与测试，未复核该生产映射，也未取得 GA4 外部接收/读取证据。`isTestOrder` 仅有历史生产字段证据，当前仓库实现缺失，15 笔候选未标记且全量查询过滤待确认。
- 2026-07-25：选品优先级仅用于运营推广，不改变任何商品的公开目录、搜索、Quiz、直链、加购或结账资格。本轮未授权任何商品状态变更；`pearl-series-13` 与 `new-series-mother-of-pearl-cluster-earrings` 均保留在 63 件公开商品目录中，并可通过本地结账解析。本次只读生产 smoke 未执行部署或商品状态修改。
- 2026-07-25：390×844 Chrome 本地回归确认 Cookie consent 横幅显示时，移动端商品页 Sticky Add to Cart 位于横幅上方且可访问；关闭横幅后 CTA 仍可访问。修复仅同步横幅实时高度到 Sticky CTA 的底部偏移，未改变商品、价格、URL、CTA 文案或营销行为。

漏斗定义：渠道访客 → Quiz 完成或商品页浏览 → 加购 → 结账 → 订单。内容指标（Pin 保存/出站点击、TikTok 完播/主页点击）只用于筛选主题和格式，不代替业务成功。转化指标按英雄商品页分解；运营指标记录内容批量耗时、自动化失败次数与未完成任务数。

## 2026-07-25 生产放行包执行结果

- 历史生产记录显示数据库曾有 `Order.isTestOrder BOOLEAN NOT NULL DEFAULT false`，当时结构检查为 1 列、`nullable=NO`、默认值 `false`、`isTestOrder=true` 为 0 笔；本轮未连接生产重验。当前仓库 schema/迁移不含该实现，15 笔历史候选仍未批量改标。
- 历史 Vercel Production 记录显示 GA loader / Measurement ID 环境变量 `NEXT_PUBLIC_GA_ID` 已配置，值未写入文档或日志；该记录只证明当时客户端具备加载条件，不证明当前四个电商事件及 consent 代码版本映射或外部接收。`GOOGLE_ANALYTICS_PROPERTY_ID` 与 `GOOGLE_SERVICE_ACCOUNT_JSON` 仍未配置，站内运营报表读取也未验证。
- 已部署版本 `dpl_93sG4bA3yj5y51VoN5QELF8orAjd`，并将 `mythrealms-shop.vercel.app` 指向该版本。远端构建通过 Next.js 生产构建、TypeScript 与 166 个页面生成。
- 部署后 smoke：铺货验证池 12/12 商品页 HTTP 200、UTM 保留、Add to Cart 存在；首页、Guardian Quiz、`/api/health`、`/api/health-db`、`/robots.txt`、`/sitemap.xml` 均 HTTP 200。移动 CTA 已有 390×844 自动化回归证据；本轮生产深层浏览器探针超时，故生产真机点击仍标为待补，不误报为失败。
- 上述历史结果取代更早的“生产缺列、未配置 `NEXT_PUBLIC_GA_ID`、目标版本未部署”快照，但不取代本轮权威单表。24 Pin 登记表的历史结构校验不构成当前发布或指标证据；GA4 DebugView/实时报告、Pinterest Analytics 可读性与可用 Day 0 测量基线仍待确认。

## 周五复盘

有效信号：待确认（GA4 接收与报表读取、商品页事件、Quiz 完成及渠道数据均未验证）。停止项：商品导流、CTA 实验与广告均冻结。最大漏斗损失：待确认；历史测试订单不进入转化漏斗，不能用于定位真实用户流失步骤。

本周唯一实验：**暂停。** 不启动 CTA 实验或广告。

- 前置条件：`quiz_complete` 与 `quiz_cta_click` 已实现并通过本地去重与 consent 行为单测；仍须在测试环境通过 GA4 DebugView 或实时报告验证事件接收与链路可读取。不得修改 Quiz CTA、URL、文案或落地页。
- 后续动作：前置条件完成后，先采集连续 7 天的事件基线；基线确认后再制定单一变量实验及阈值。
- 当前结论：证据不足，不启动实验，不宣称胜出。

## 历史管理员测试订单批次

- **历史快照（不是当前指标基线）：** 2026-07-25 曾记录管理员测试订单 15 笔 PENDING、真实付费客户 0、已支付订单 0、已支付营收 $0.00；当前值全部待确认，不得把该历史数字复制为 Day 0 基线。
- **一次性批次核验（数据库，2026-07-25）：** 15 笔均为 `PENDING`；2 笔关联 `ADMIN`、8 笔关联测试用户、5 笔为访客测试记录。6 笔有支付服务商订单号，其中 2 笔本地标记 `paypal:pending`；0 笔有本地 `paypal:paid:*` 标记。全部无确认邮件 claim/sent 时间、无物流号，所有订单项均无 product/variant 外键，故不存在该批次可扣减的站内 variant 库存。
- **异常处理：** 本地数据库未发现已支付、邮件、履约或库存扣减异常；PayPal 服务商侧 capture/取消状态未核验，仍待外部账户证据。任何平台侧不一致项须单独标为异常并人工核对。
- **永久排除规则：** 经营周报、累计真实付费客户、已支付订单、营收、漏斗转化、复购、客服和评价流程必须在聚合前排除该历史批次；不得因订单状态后续同步、导出或报表重算而自动回填。若发现任一订单存在真实捕获、邮件、库存或履约动作，只把该笔标为异常并人工核对，不把它直接认定为真实客户或经营收入。
- **实现状态：** 权威指标口径已固定；所有查询、导出、仪表盘与自动化是否均已落实永久排除，当前为**待确认**，列为本周 P1 内部验证任务。不得为此联系外部平台；PayPal 服务商侧核验须等待明确权限/授权。
- **启动门槛：** 测试订单批次归档、测试环境事件链路验证、至少 1 个商品通过完整 QA 三项全部完成前，不启动 CTA 实验、广告或任何商品导流内容。

## 实验模板

假设；单一变量；对象/页面；开始与结束时间；观察指标；继续阈值；停止阈值；结果；CEO 决策链接。一次仅改变一个变量，不足数据时标“证据不足”，不宣称胜出。
