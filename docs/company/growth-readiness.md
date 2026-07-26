# 14 天流量与测量冲刺准备

> **P0 更新（2026-07-26）：SEO/GEO 是唯一 P0。** 先以 Search Console、Bing Webmaster 与 GA4 的只读证据建立搜索基线，围绕用户问题、SERP 页面类型和自身可验证主题准备工作；Pinterest/TikTok/Reddit 72 小时记录继续保留，但降为运营记录，不能驱动优先级结论。自动剪辑暂停；不投广告、不改商品状态、不启动 CTA 实验。

**Owner：增长与数据会话。周期：2026-07-25–2026-08-07。状态：已记录创始人手动发布 `new-series-002 v1` 的历史 Day 0 起点；部门没有新增发布授权，后续发布须有创始人既有明确授权并逐条通过素材身份、商用权与链接 QA。不投广告、不改商品状态。更新：GA4 外部验证、自然流量数据或测试订单异常出现时。**

当前目标为可归因的独立站有效访问、Guardian Quiz 参与和邮件订阅。GE1822 样品采购、美国履约和商品营销解冻暂停而非取消，不是本冲刺 P0；以下商品上线基线保留为暂停/归档模板。

**权威测量状态：** 六层证据状态统一见 [metrics.md 的“测量就绪单表”](metrics.md#测量就绪单表权威状态2026-07-26)。本文件只定义验证步骤和最小字段，不另建第二张状态表；本地实现、生产部署、外部接收、报表可读、基线数据与决策资格不得相互替代。

## 1. 不依赖供应商聊天回复的可执行项 vs. 仍须等待的门槛

| 不依赖供应商聊天回复的可执行项（内部） | 必须等待的证据/授权 |
| --- | --- |
| 准备 GA4 测试环境与生产环境验证清单、截图/导出证据模板及回滚条件 | 仅有历史 GA loader / Measurement ID 配置与部署证据；当前四个电商事件及 consent 代码版本映射、GA4 property/service account 权限和外部 DebugView/实时报告接收证据均待确认 |
| 审核并维护 Pinterest、TikTok 与 SEO 可发布素材包；避免未确认材质、价格、库存与履约承诺 | 素材身份/商用权与最终内容 QA；只有创始人已有明确授权时才由创始人手动发布，部门无新增发布权限 |
| 建立 UTM、渠道/内容/活动命名、落地页检查和 14 天自然流量基线模板 | 外部 GA4 接收与报表读取证据；发布前的逐条 QA |
| 固化历史管理员测试订单的排除查询、周报口径与异常登记模板 | 支付服务商侧状态核验；该核验不改变默认永久排除口径 |
| 准备 Pinterest/TikTok 账号资料、SEO 元数据与内部链接清单、发布前检查表和内部内容排期草案 | 账号登录/管理员权限、创始人对具体内容的明确授权、逐条 QA 与下述候选发布停止条件 |

供应商聊天回复不是本冲刺启动门槛。1688 页面截图、URL 与货号只作初步声明证据；天然珍珠、925 银、低敏/防过敏等高风险具体承诺仍禁用。不得以“准备完成”替代部署、外部验证或公开发布批准。

## 2. GA4 测试/生产验证清单

### 验证原则

- 本地测试通过仅证明本地行为，不证明 GA4 已接收、处理或可在报告读取。
- 每个事件必须保留：环境、时间（含时区）、测试步骤、预期、DebugView/实时报告证据、验证人、结果与异常；不记录客户个人数据、支付标识或密钥。
- 不因验证而修改 Quiz CTA、URL、文案、落地页，不启动广告或商品导流。

### 前置配置

| 项目 | 测试环境 | 生产环境 | 所需部署/凭据 |
| --- | --- | --- | --- |
| GA4 客户端配置 | 确认数据流测量 ID 已注入构建产物且非空 | 仅有历史 GA loader / Measurement ID（`NEXT_PUBLIC_GA_ID`）配置与部署证据；当前四个电商事件及 consent 代码与该部署版本的映射、外部接收均待确认 | 仍需当前代码版本映射、GA4 property/service account 权限与外部验证 |
| Consent | 初始拒绝状态、同意、撤回三条路径可重复测试 | 与生产 Cookie 横幅和持久化行为一致 | 部署：仅代码变更时需要；凭据：无 |
| DebugView / 实时报告 | 可查看测试操作对应的事件 | 可查看受控生产验证操作对应的事件 | 部署：生产需要；权限：GA4 DebugView/实时报告读取权限 |
| 报表读取 | 验证目标事件可通过获批准的读取方式取得 | 验证生产报告读取与事件名称、时间范围一致 | 部署：读取服务变更时需要；凭据：GA4 只读服务账号/属性访问权限 |

### 事件验证矩阵

| 事件 | 受控测试步骤 | 必验字段/行为 | Consent 验证 | 外部接收判定 |
| --- | --- | --- | --- | --- |
| `view_item` | 在受控商品页加载一次，不改变商品状态 | 商品 ID/name/price/currency 与测试配置一致；页面 HTTP 200 不替代事件 | 未同意时不发送；同意后重新触发才发送；撤回后不再发送 | DebugView/实时报告与受控时点对应，随后同时间窗报表可读 |
| `add_to_cart` | 在受控商品页加购一次，不建立真实履约 | 商品、数量、value/currency 正确；重复加购按操作次数计 | 同上 | 同上；按钮存在不等于接收成功 |
| `quiz_complete` | 完成一次 Quiz；重复完成相同会话的去重场景另测 | 仅在完成时触发；去重符合设计；不附带个人数据 | 未同意时不发送；同意后完成 Quiz 才发送；撤回后不再发送 | DebugView 或实时报告显示一次与受控时间相符的事件，随后报表读取可取得 |
| `quiz_cta_click` | 在 Quiz 结果页点击现有 CTA 一次；不更改 CTA 或 URL | 仅在点击时触发；关联的 CTA 标识为非敏感值 | 同上 | 同上 |
| `begin_checkout` | 在测试商品/隔离测试路径开始结账；不得建立真实履约 | 仅在进入结账开始点触发；金额/货币字段与测试配置一致且无个人数据 | 同上 | 同上；不以创建本地 PENDING 订单替代事件接收证据 |
| `purchase` | 仅使用获批准的支付沙盒或受控非真实交易完成支付回调 | 只在服务端读取到 paid 状态后呈现 tracker；按 transaction ID/平台去重；不得由 PENDING 页面触发 | Consent 行为按已批准实现验证；支付事实不因前端重载而重复记账 | DebugView/实时报告与报表读取一致；与测试支付事实核对，不记录支付标识 |

### 通过、阻断与回滚

- **可进入 14 天自然流量基线的通过条件：** 有效访问口径、`quiz_complete`、`quiz_cta_click` 和邮件订阅成功事件名/读取方式均已明确；测试环境取得所需外部接收证据；consent 的拒绝、同意、撤回路径有证据；读取结果可复核。`begin_checkout` / `purchase` 继续监控，但不是本冲刺启动门槛。
- **阻断条件：** 缺少有效访问、Quiz 或邮件订阅的读取口径/外部接收证据，事件在拒绝 consent 后仍发送，核心事件重复或带入个人数据。若 `purchase` 验证被另行授权，其支付事实与幂等问题仍按原门槛阻断。
- **回滚条件：** 生产验证出现上述阻断条件或影响真实订单/隐私时，停止验证流量并按技术会话既定发布回滚方案处理；增长会话不自行部署。

## 2A. 铺货验证优先：Day 0 历史记录与后续内部准备

**当前状态：** 已确认的本轮边界仅包括创始人此前手动发布 `new-series-002 v1` 的历史事实，以及 Pinterest/TikTok 的其他历史发布记录；这些事实不向部门授予新增发布权限。任何后续内容必须已有创始人的明确授权并逐条通过素材身份、商用权、目标 URL/UTM 与最终内容 QA，实际操作仍仅由创始人完成。未取得上述条件时保持内部准备；不投广告、不修改任何商品的目录、库存、`isActive`、加购或结账状态。12 款商品的页面可访问性与 UTM 查询参数保留已有只读 smoke 证据，但这不是 GA4 接收、Pinterest 数据或经营结果证据。

### Day 0 数据采集表

| 采集项 | Day 0 应记录的字段 | 当前可采/已知状态 | 仍需外部权限或验证 |
| --- | --- | --- | --- |
| 实验冻结 | 开始时间、时区、首批内容 ID/SKU/版本/实际发布时间 | 历史 Day 0 已由创始人手动发布 `new-series-002 v1` 的时刻固定；该记录不授权后续发布 | 补齐既有 Pin 的素材身份/商用权、Pin URL、Board 和目标 URL/UTM；后续发布另需创始人明确授权与逐条 QA |
| 12 商品 URL | 商品 ID、slug、目标 URL、`v1`/`v2` UTM、HTTP 状态、标题与移动端加购可用性 | 已部署版本 `dpl_93sG4bA3yj5y51VoN5QELF8orAjd` 的 12/12 商品页与首页、Quiz、健康入口 smoke 通过；商品 URL 的 HTTP 200、标题一致、UTM 保留与加购入口已记录 | 公开发布前逐条复核；不需 GA4 权限 |
| 非商品承接页 | `/guardian-quiz`、`/pearls`、`/pearls/stories`、`/pearls/symbolism` 的 URL、canonical、加载与 UTM 保留 | 页面存在/canonical 的源码审计记录；本次不作为 SKU 排名分母 | 如需会话/参与数据，需 GA4 外部读取 |
| Pinterest 内容数据 | impressions、outbound clicks、内容 ID、发布时间 | 已登记创始人手动发布 `new-series-002 v1` 的历史 Day 0 起点；Pin URL、Board、目标 URL/完整 UTM 和当前读数均待确认、不填 0 | 对既有 Pin 的只读证据与 Pinterest Analytics 读取权限；后续发布另需明确授权与逐条 QA |
| GA4 流量与事件 | sessions、engaged sessions、source/medium、UTM campaign/content、`view_item`、`add_to_cart`、`begin_checkout`、`purchase` | 仅有历史 GA loader / Measurement ID 配置与部署证据；当前四个电商事件及 consent 代码版本映射、外部接收均待确认，仍不可采为可信生产数据 | 当前代码版本映射、GA4 property/service account、DebugView/实时报告、报表读取与 consent 外部验证 |
| Quiz 与订阅 | `quiz_start`、`quiz_complete`、`quiz_cta_click`、订阅成功数与来源 | 三个 Quiz 事件及订阅成功后事件均有当前本地实现/测试证据；生产映射、外部接收与报表读取未验证 | GA4 外部事件读取；邮件受众/成功记录与归因权限 |
| 排除与异常 | 测试订单排除标记、内部/机器人流量依据、测量中断与页面变更 | 永久排除政策已固定；生产字段仅有历史证据。当前本地 schema/迁移缺少 `isTestOrder`，15 笔候选未标记且统一过滤未证实 | 恢复源码/生产一致性并验证标记及所有查询、导出、受众和自动化过滤 |

### 12 商品 + 非商品落地页 UTM 校验矩阵

**商品 Pin 统一规则：** `utm_source=pinterest&utm_medium=organic&utm_campaign=assortment-validation-14d&utm_content=<slug>-v1|v2`。每款恰有两条 Pin；`v1` 为近景版本、`v2` 为佩戴/场景版本。下表只确认 URL 结构与验证状态，不代表商品材质、价格、库存、履约或营销承诺已确认。

| 类型 | 落地页 | UTM content（两条） | Day 0 URL 校验 | 流量数据读取 |
| --- | --- | --- | --- | --- |
| 商品｜The Shell Bloom | `/products/new-series-mother-of-pearl-cluster-earrings` | `new-series-mother-of-pearl-cluster-earrings-v1` / `new-series-mother-of-pearl-cluster-earrings-v2` | 已有 HTTP 200、标题一致、参数保留、移动端加购 smoke；公开前复核 | 需 Pinterest + GA4 外部权限 |
| 商品｜The Dewflower | `/products/new-series-white-shell-flower-drops` | `new-series-white-shell-flower-drops-v1` / `new-series-white-shell-flower-drops-v2` | 同上 | 同上 |
| 商品｜The Golden Petal | `/products/new-series-gold-shell-teardrops` | `new-series-gold-shell-teardrops-v1` / `new-series-gold-shell-teardrops-v2` | 同上 | 同上 |
| 商品｜The Baroque Orbit | `/products/new-series-baroque-pearl-hoops` | `new-series-baroque-pearl-hoops-v1` / `new-series-baroque-pearl-hoops-v2` | 同上 | 同上 |
| 商品｜The First Light | `/products/pearl-series-05` | `pearl-series-05-v1` / `pearl-series-05-v2` | 同上 | 同上 |
| 商品｜The Green Current | `/products/new-series-pearl-jade-bracelet` | `new-series-pearl-jade-bracelet-v1` / `new-series-pearl-jade-bracelet-v2` | 同上 | 同上 |
| 商品｜The Shell Twist | `/products/new-series-shell-twist-pearl-cuff` | `new-series-shell-twist-pearl-cuff-v1` / `new-series-shell-twist-pearl-cuff-v2` | 同上 | 同上 |
| 商品｜The Inner Glow | `/products/pearl-series-17` | `pearl-series-17-v1` / `pearl-series-17-v2` | 同上 | 同上 |
| 商品｜The Falling Pearl | `/products/new-series-pearl-y-lariat` | `new-series-pearl-y-lariat-v1` / `new-series-pearl-y-lariat-v2` | 同上 | 同上 |
| 商品｜The Pearl Drop | `/products/new-series-pearl-drop-choker` | `new-series-pearl-drop-choker-v1` / `new-series-pearl-drop-choker-v2` | 同上 | 同上 |
| 商品｜The Calm Tide | `/products/pearl-series-01` | `pearl-series-01-v1` / `pearl-series-01-v2` | 同上 | 同上 |
| 商品｜The Still Point | `/products/pearl-series-02` | `pearl-series-02-v1` / `pearl-series-02-v2` | 同上 | 同上 |
| 非商品｜Guardian Quiz | `/guardian-quiz` | 不进入 SKU `v1`/`v2` 排名；如单独发布，另建不与商品混用的 campaign/content | canonical/页面存在有源码审计；发布前复核 | 需 GA4 外部读取 Quiz 事件 |
| 非商品｜Pearl 发现页 | `/pearls` | 同上 | canonical/页面存在有源码审计；发布前复核 | 需 GA4 外部读取 |
| 非商品｜Pearl Stories | `/pearls/stories` | 同上 | canonical/页面存在有源码审计；发布前复核 | 需 GA4 外部读取 |
| 非商品｜Pearl Symbolism | `/pearls/symbolism` | 同上 | canonical/页面存在有源码审计；发布前复核 | 需 GA4 外部读取 |

### Day 1–3 发布顺序建议（秘书处 QA 后由创始人手动执行）

| 日 / 时段 | 内容 | 版本 | 目标 URL | 排期理由 |
| --- | --- | --- | --- | --- |
| Day 1｜午间 | The Shell Bloom | v1 近景 | `/products/new-series-mother-of-pearl-cluster-earrings` | 耳环类别起始样本；不附加材质或履约承诺 |
| Day 1｜晚间 | The Inner Glow | v1 近景 | `/products/pearl-series-17` | 与耳环错开品类和时段，避免同类首日挤占 |
| Day 2｜午间 | The Green Current | v1 近景 | `/products/new-series-pearl-jade-bracelet` | 手链类别首样本，维持同格式 |
| Day 2｜晚间 | The Calm Tide | v1 近景 | `/products/pearl-series-01` | 戒指类别首样本，维持同格式 |
| Day 3｜午间 | The Dewflower | v1 近景 | `/products/new-series-white-shell-flower-drops` | 耳环第二样本，避免连续同一商品 |
| Day 3｜晚间 | The Falling Pearl | v1 近景 | `/products/new-series-pearl-y-lariat` | 项链第二样本，完成前三天跨品类覆盖 |

Day 1–3 仅推荐 `v1`，其余商品与全部 `v2` 保持待排期，以保证 24 条内容在 Day 1–12 内均衡出现。每条发布前必须用表中统一参数生成完整 URL；在秘书处完成素材核对前不执行发布。

### 首批发布记录与 America/New_York 起点建议

- **原内部建议起点：** America/New_York 工作日上午 **10:00** 仅是发布前排期建议，不构成授权；历史 Day 0 以创始人实际手动发布 `new-series-002 v1` 的时间为准，不回填为 10:00。
- **首条候选（已由实际发布取代）：** 创始人已手动发布 Pinterest `new-series-002 v1`；原 Day 1 The Shell Bloom `v1` 仅保留为未执行的排期建议。已发布并不替代素材身份、商品对应关系与商用权 QA 的记录。
- **TikTok 候选起点：** 首条 TikTok 的内部排期不得早于首条 Pinterest 发布 **24 小时后**；即使无身份/权利、链接、平台审核或异常信号，也仍须创始人对该具体内容明确授权并由创始人手动发布。不与 Pinterest SKU 排名数据混合。

| 字段 | 首批发布记录（逐条填写） |
| --- | --- |
| Day / 实际时间（America/New_York） | 待发布后记录 |
| 渠道 / 账号 | Pinterest 或 TikTok / 待确认 |
| 内容 ID / SKU / 版本 | 待 QA 后记录 |
| 素材身份 QA 证据 / 商用权证据 | 待秘书处提供或核对；缺任一项不得发布 |
| 标题、唯一 CTA、目标 URL 与完整 UTM | 待发布前复核 |
| 平台发布 URL / 发布操作者 | 待创始人手动发布后记录 |
| 24 小时检查 | 平台审核状态、链接到达、UTM 保留、异常；数据不可读则标待确认 |
| 结论 | 建议后续单条 / 暂停；建议不构成授权，只有创始人明确授权后才记录实际发布 |

#### Day 0 首条实际发布记录

| 字段 | 已知事实 / 状态 |
| --- | --- |
| Day 0 起点（America/New_York） | **2026-07-25 11:22:16**（由系统时间 2026-07-25 23:22:16 +08:00 换算） |
| 渠道 / 内容 | Pinterest / `new-series-002 v1` |
| Pin URL / Board | 待确认（未提供） |
| 素材身份、商品对应关系与商用权 QA | 待秘书处核对；本记录不因已发布而视为 QA 已完成 |
| 目标 URL 与完整 UTM | 待确认（未提供；不得按计划模板反推为实际值） |
| impressions / outbound clicks | 待确认（未提供；不得填 0） |
| 首次只读检查点 | **2026-07-26 11:22:16 America/New_York**；只记录平台审核状态、Pin URL/Board、目标 URL/UTM、链接到达及可读取数据，不发布、不编辑、不删除、不投广告 |
| 检查前节奏 | 不新增发布，等待秘书处完成首条素材 QA 与首次只读检查 |

**首次检查后的处理：** 若发现素材身份/商用权/商品对应关系缺失或争议、Pin/目标 URL/UTM 错配或失效、平台审核限制，或出现未确认材质/价格/库存/配送/效果承诺，立即停止新增发布并仅记录异常。Pin URL、Board、impressions 或 outbound clicks 暂缺本身不回填数值；其中 URL/Board/目标 URL/UTM 未补齐前，不扩大节奏。

## 2B. P0 可归因引流：72 小时渠道记录与复盘（只读）

**观察窗口：** 2026-07-25 11:22:16 至 2026-07-28 11:22:16（America/New_York），以已登记的 Day 0 首条 Pinterest 发布为起点。此表只做读取与记录；创始人负责最终人工发布，本会话不登录账号、不发布、不投广告、不改商品。

### 账户与活动隔离规则

| 渠道 / 账号 | 活动 | 已确认事实 | 严禁混合的口径 |
| --- | --- | --- | --- |
| Pinterest｜账号 A（Day 0 手动发布账号，名称待确认） | `assortment-validation-14d` | `new-series-002 v1` 已发布；Pin URL、Board、目标 URL/UTM、impressions、outbound clicks 待确认 | 不与账号 B、TikTok 或 Reddit 相加；不计入 `pearl_edit` |
| Pinterest｜账号 B（日历定时账号，名称待确认） | `pearl_edit` | 已设 60 条定时发布；截图可见 7 条珍珠 Pin 的曝光依次为 **1 / 1 / 2 / 2 / 2 / 5 / 6** | 不归入 `assortment-validation-14d`；未提供 outbound clicks 时不写 0 |
| TikTok｜账号名称待确认 | 活动/UTM 待确认 | 已发布两条：Jul 16 为 **20** 播放、Jul 19 为 **71** 播放；第三条 9 个分镜已生成，创始人决定使用剪映手动剪辑，尚未确认发布 | 不加入 Pinterest SKU 排名或 Pinterest 曝光；播放不等于站内访问 |
| Reddit｜账号/社区待确认 | 无 | 未提供发帖、评论、链接或数据 | 不自行发布或补造活动；保持待确认 |

### 72 小时读取记录表

| 检查点（America/New_York） | Pinterest 账号 A｜`assortment-validation-14d` | Pinterest 账号 B｜`pearl_edit` | TikTok | Reddit | 复盘动作 |
| --- | --- | --- | --- | --- | --- |
| 0h｜2026-07-25 11:22:16 | `new-series-002 v1` 已发布；Pin URL/Board/UTM/数据待确认 | 60 条定时；7 条截图曝光为 1/1/2/2/2/5/6 | 历史两条为 20、71 播放；第三条分镜完成、待创始人手动剪辑与发布 | 无活动数据 | 仅建立分账记录，不合并任何指标 |
| 24h｜2026-07-26 11:22:16 | Pin URL、Board、目标 URL/UTM、审核状态、impressions、outbound clicks：待确认 | 已实际发布数、该账号新增 Pin、各 Pin impressions/outbound clicks：待确认 | 三条的 URL、发布时间、播放、个人资料点击/站点点击（如可读）：待确认 | 发帖/评论/链接：待确认 | 只读检查；若任何 URL/UTM/QA 异常，停止新增发布 |
| 48h｜2026-07-27 11:22:16 | 同上，按 Pin 单条记录，不汇总进 `pearl_edit` | 同上，保留 60 条定时与实际发布的差异 | 同上；不将播放视为流量或转化 | 同上 | 仅标记完整性与异常，不优化文案/CTA |
| 72h｜2026-07-28 11:22:16 | 报告单条 Pin 的可确认数据；缺失为待确认 | 单独报告 `pearl_edit` 的可确认数据；不得与账号 A 合并 | 单独报告三条视频的可确认数据 | 单独报告是否有活动 | 只判断“数据可读 / 不可读 / 异常”，不宣布赢家、不投放 |

### 创始人每日取数清单（最多 10 分钟）

1. **Pinterest 账号 A，2 分钟：** 记录 Day 0 Pin URL、Board、审核状态、impressions、outbound clicks；目标 URL/UTM 仅在可见时抄录，否则写“待确认”。
2. **Pinterest 账号 B，2 分钟：** 记录定时队列仍为 60 条或实际差异、当日实际发布数，以及可见的单条 impressions/outbound clicks；只归入 `pearl_edit`。
3. **TikTok，2 分钟：** 记录三条视频的发布时间、播放、个人资料点击/站点点击（若平台显示）；Jul 16 的 20 与 Jul 19 的 71 保留为历史背景，不与 Pinterest 合并。
4. **Reddit，1 分钟：** 只记录是否存在已批准活动、链接和可见数据；无活动则写“待确认/无已提供活动”，不发帖。
5. **站内/GA4，2 分钟：** 若有读取权限，按渠道分别记录 sessions、engaged sessions、source/medium 与 UTM；无权限或无外部验证则写“待确认”。
6. **异常与合计检查，1 分钟：** 核对没有跨账号、跨平台或跨活动相加；若发现素材/权利、链接/UTM、平台审核或未确认事实异常，停止新增发布并登记。

**停止条件：** 除既有素材、商用权、目标 URL/UTM、平台审核和未确认事实停止条件外，发现把 `pearl_edit` 与 `assortment-validation-14d`、两套 Pinterest 账号、TikTok 或 Reddit 混合统计时，立即停止复盘结论，仅更正记录；不删除或重发内容。

### Pinterest / TikTok 候选发布与停止条件

| 渠道 | 内部候选节奏（不构成授权） | 每条发布的必要条件 | 立即停止新增发布的条件 |
| --- | --- | --- | --- |
| Pinterest | 历史首条仅作 Day 0 记录；后续候选至多每 24 小时 1 条，前 3 条完成检查前不提出 2 条/日建议 | 每条均须创始人对具体内容明确授权，并完成素材身份、商用权、链接/UTM 与最终内容 QA；历史发布、连续无异常或 GA4 状态均不能替代授权 | 素材身份或商用权缺失/争议；目标页或 UTM 失效；平台限制/审核异常；出现未确认材质、价格、库存、配送或效果承诺；任何广告投放请求 |
| TikTok | 最早候选排期在 Pinterest 历史首条发布 24 小时后；未确认第三条成片前不把第三条列为可发布项 | 每条均须创始人对具体内容明确授权，并完成身份/权利、链接/UTM 与最终内容 QA；实际操作仅由创始人完成 | 与 Pinterest 相同；另加音频/视频权利不清、商品或 Quiz 结果被错误表述、引导至未 QA 链接 |

停止后只记录已发生的事实与异常，不删除、替换、重发或增加广告；恢复发布须先由秘书处确认问题闭环，并由创始人对拟发布内容给出明确授权。历史发布或 GA4/Pinterest 证据缺失本身均不构成新增发布授权。

## 3. Pinterest / TikTok / SEO：内部准备与可发布门槛

### 当前仅可执行的内部动作（不发布）

1. 建立 Pinterest/TikTok 账号资料、头像、简介、网站字段、板块/栏目名称和访问权限的内部检查表；所有外链先经过 UTM 与目标页核对。
2. 对草稿逐条完成素材来源/商用权、无未确认材质/价格/库存/配送承诺、无疗愈或保证性表述的 QA。
3. 准备品牌/神话、Guardian Quiz 内容的原始文件、alt text、标题、描述、唯一 CTA 和发布记录表；同时准备 SEO 页面主题、元数据与内部链接建议。
4. 准备发布后 24 小时、Day 7 与 Day 14 观察表：有效访问、来源/媒介、Quiz 参与、邮件订阅和异常；未获授权前不上传、不排期、不改生产页面。

### 可发布门槛（全部满足后才可另行申请授权）

- 已确认创始人手动发布 `new-series-002 v1` 以及 Pinterest/TikTok 其他历史发布的事实；这些历史事实不授权本轮新增发布。后续内容只有在创始人已有明确授权且逐条完成素材身份、商用权、目标 URL/UTM 与最终内容 QA 后，才可由创始人手动发布。
- 每条内容经内容与品牌会话 QA：原创或授权素材；不含未确认材质、价格、库存、配送、客户评价或效果承诺。
- 每条仅一个目标明确的 CTA；所有站点、Quiz 或订阅链接使用已核对的 UTM 与目标页。
- 增长会话确认历史发布记录与异常回收方式可用；候选排期不构成新增发布授权，也未把内容指标表述为销售结果。
- 本冲刺不投广告。商品主动导流仍不得绕过其营销门槛；品牌/神话、Guardian Quiz 与 SEO 自然流量不以 GE1822 样品或美国履约为启动条件。

## 4. 14 天自然流量最小基线模板（准备；执行待授权）

| 项目 | Day 0 | Day 1–14 | Day 7 / Day 14 输出 |
| --- | --- | --- | --- |
| 归因 | 确认渠道/内容/活动命名、UTM、目标页、时区 | 逐日记录来源/媒介/活动及 UTM 异常 | 可归因访问占比：待确认；列出缺失或错误来源 |
| 有效访问 | 定义有效访问规则并记录 GA4 可读性；具体阈值待确认 | 访客、会话、参与会话/有效访问：待确认 | 只报告可复核总量与趋势，不宣称因果胜出 |
| Guardian Quiz | 确认 Quiz 开始、完成与 CTA 事件口径 | Quiz 开始、完成、完成率、CTA 点击：待确认 | 说明事件接收、去重、consent 与样本限制 |
| 邮件订阅 | 订阅成功事件名、来源字段与去重规则：待确认 | 新订阅、来源/媒介、失败/重复：待确认 | 报告可归因订阅；不包含个人数据 |
| 内容/SEO | 记录已获批发布项、URL 与发布时间 | 曝光、出站点击、搜索访问、落地页访问：待确认 | 按主题/格式描述信号，不替代业务结果 |
| 数据治理 | 固化 15 笔历史管理员测试订单永久排除 | 新测试数据单独标记并排除 | 异常项与是否影响基线 |

本阶段不把订单、营收或商品解冻作为冲刺完成条件，但继续如实记录真实已支付订单与营收；未知即“待确认”。

## 5. 暂停 / 归档：The Shell Bloom / GE1822 上线后的 7 天商品基线模板

**启动门槛：** 供应商聊天回复不是必需项。以下五项必须均有可复核证据：

1. GE1822 样品与批准的页面/素材在外观上保持一致；
2. 可售价格与库存已确认；
3. 美国端到端履约测试完成；
4. GA4 事件在测试环境取得外部接收与读取验证；
5. CEO 明确批准发布。

任一项为“待确认”即不启动；不以供应商聊天截图、代码本地测试、目录可见或内部草稿替代上述证据。

| 项目 | Day 0（冻结） | Day 1–7（仅观察） | 周末输出 |
| --- | --- | --- | --- |
| 范围 | 确认唯一页面/URL、数据流、时区和历史测试订单排除查询 | 不改 CTA、文案、URL、价格、素材、受众或投放 | 记录变更是否为 0；否则基线失效并标“待确认” |
| 流量 | 记录开始时间与 GA4 可读性 | 访客、会话、来源/媒介：待确认后逐日填入 | 仅描述观察窗口，不归因胜出 |
| Quiz | 确认事件验证证据 | `quiz_complete`、`quiz_cta_click`、结果页 CTA 点击率 | 若样本不足，写“证据不足” |
| 商品与结账 | 确认 `view_item`、`add_to_cart`、`begin_checkout`、`purchase` 的读取口径 | 按日记录事件与已支付订单；测试订单持续排除 | 真实付费客户、已支付订单、已支付营收；未证实均为“待确认” |
| 内容 | 确认无广告、无 CTA 实验 | 若经单独授权发布无商品暖启动内容，仅记录其内容指标 | 不用内容指标替代业务成功 |
| 异常 | 建立异常日志 | consent、重复事件、支付回调、数据延迟、页面错误 | 标记是否影响基线；影响则不做比较 |

**基线结束判定：** 仅在连续 7 天没有未记录的产品/CTA/投放变更，且事件读取与真实支付口径可复核时，才可由增长会话提出一项后续单变量实验建议；是否启动仍须 CEO 决定。

### The Shell Bloom 无材质承诺渠道测试矩阵（仅准备，不发布、不投广告）

| 渠道 | 待授权后的最小测试单元 | 可用表达边界 | 禁止项 | 仅准备的记录指标 | 当前状态 |
| --- | --- | --- | --- | --- | --- |
| Pinterest（自然） | 1 个静态 Pin 或图文轮播，使用经样品一致性验收的视觉 | 造型、细节、送礼/日常场景与开放式品牌表达；不陈述材质事实 | 材质、低敏/防过敏、价格、库存、配送承诺；广告和未批准链接 | 曝光、保存、出站点击（若未来获准链接）及异常 | 冻结，不制作发布物 |
| TikTok（自然） | 1 条 9:16 无真人产品细节/包装/场景短片 | 画面所见细节与非保证性叙事；不将象征表达为结果 | 材质、价格、配送、疗愈承诺；付费推广 | 播放、完播、主页点击及异常 | 冻结，不制作发布物 |
| Guardian Quiz（既有路径） | 不修改现有 CTA、URL、文案或推荐逻辑，仅验证已定义事件 | 通用结果叙事，不添加商品材质承诺 | CTA 实验、结果页改版、商品导流扩张 | `quiz_complete`、`quiz_cta_click`、去重与 consent 异常 | 冻结，先完成 GA4 外部验证 |
| 商品页（自有渠道） | 已批准页面的被动观察，不新增促销模块 | 已核验的页面事实；未核验事实仍不写入 | 价格/库存/材质的未核验承诺，限时/稀缺/配送承诺 | `view_item`、`add_to_cart`、`begin_checkout`、`purchase` 与页面异常 | 冻结，等待五项启动门槛 |
| 邮件 | 不设测试单元 | 不适用 | 发送营销邮件、订阅增长承诺 | 配置/受众可用性仅作待确认项 | 冻结；当前不纳入基线渠道 |

矩阵用于基线后的渠道选择，不构成发布、导流、广告、CTA 实验或商品事实声明的授权。

## 5. 14 天独立站自然引流冲刺（内部准备；后续发布须另有明确授权）

**目标：** 获取可归因的有效访问，不以订单、营收或商品转化作为本冲刺成功条件。全程不投广告、不改商品状态、不改 Quiz CTA/URL/文案、不使用或依赖 GE1822 未验证的材质、价格、库存、配送或样品事实。

### 落地页优先级

1. **Guardian Quiz：** `/guardian-quiz`。仅在 GA4 外部验证后使用既有页面；不改推荐逻辑，也不以 Quiz 结果作商品事实承诺。
2. **品牌/神话内容：** `/story`。发布前须由内容与品牌会话确认页面不含未验证商品事实。
3. **首页：** `/`。作为品牌概念或无法安全导向前两者时的承接页。
4. **邮件订阅承接：** 现有订阅表单/成功事件名与承接路径待确认；未核对前不虚构 URL，不把表单展示当作成功订阅。
5. **不使用：** 商品页、集合页、结账页、GE1822 专属页面，直至其独立营销解冻门槛完成。

### 统一 UTM 规则

- `utm_source`：`pinterest` 或 `tiktok`
- `utm_medium`：固定为 `organic_social`
- `utm_campaign`：固定为 `organic-sprint-14d`
- `utm_content`：`dNN-pNN-主题` 或 `dNN-tNN-主题`；NN 为两位日序和当日内容序号，主题使用 `quiz`、`story` 或 `home`。
- URL 只允许使用相对路径加上述四个参数；不得添加商品、价格、材质、配送或实验参数。示例：`/guardian-quiz?utm_source=pinterest&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d01-p01-quiz`。

### 每日渠道动作与目标 URL

**执行状态：** 下表仅是内部候选队列，不构成发布授权；当前等待秘书处完成首批素材身份/商用权 QA，且每条后续发布仍须有创始人明确授权并由创始人手动执行。Pinterest 为主；TikTok 仅作为候选辅渠道。SEO 为现有页面承接检查，不新增商品事实或页面改版。

| 日 | Pinterest 主动作 / 目标 URL | TikTok 辅动作 / 目标 URL | SEO 承接动作 |
| --- | --- | --- | --- |
| Day 1 | P01 抽象 Guardian 故事卡 → `/guardian-quiz?utm_source=pinterest&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d01-p01-quiz` | 无 | 核验 Quiz 的标题、canonical、可索引状态与无错误加载 |
| Day 2 | P02 开放式品牌叙事卡 → `/story?utm_source=pinterest&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d02-p01-story` | 无 | 核验 `/story` 的标题、canonical、可索引状态与无未验证商品事实 |
| Day 3 | P03 抽象符号卡 → `/guardian-quiz?utm_source=pinterest&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d03-p01-quiz` | 无 | 核验 Quiz 加载、consent 和 GA4 受控路径 |
| Day 4 | P04 品牌留白图文卡 → `/?utm_source=pinterest&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d04-p01-home` | 无 | 核验首页标题、canonical、核心入口无错误 |
| Day 5 | P05 神话/故事轮播 → `/story?utm_source=pinterest&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d05-p01-story` | 无 | 检查 Sitemap/索引覆盖可读性；缺证据标待确认 |
| Day 6 | P06 Guardian 选择提示卡 → `/guardian-quiz?utm_source=pinterest&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d06-p01-quiz` | 无 | 检查 UTM 到达后页面、consent 和事件路径 |
| Day 7 | P07 品牌概念卡 → `/?utm_source=pinterest&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d07-p01-home` | 无 | Day 7 数据完整性复盘，不调整 CTA 或商品状态 |
| Day 8 | P08 神话叙事卡 → `/story?utm_source=pinterest&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d08-p01-story` | T01 无真人 Quiz 过程短片 → `/guardian-quiz?utm_source=tiktok&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d08-t01-quiz` | 检查来源/媒介与 UTM 可读性 |
| Day 9 | P09 抽象 Guardian 故事卡 → `/guardian-quiz?utm_source=pinterest&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d09-p01-quiz` | 无 | 检查 Quiz 事件去重与异常日志 |
| Day 10 | P10 品牌叙事卡 → `/?utm_source=pinterest&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d10-p01-home` | T02 无真人品牌/故事短片 → `/story?utm_source=tiktok&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d10-t01-story` | 检查首页承接和来源/媒介 |
| Day 11 | P11 神话开放式提问卡 → `/story?utm_source=pinterest&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d11-p01-story` | 无 | 检查索引/抓取异常；不改页面 |
| Day 12 | P12 Guardian 选择提示卡 → `/guardian-quiz?utm_source=pinterest&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d12-p01-quiz` | T03 无真人品牌概念短片 → `/?utm_source=tiktok&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d12-t01-home` | 检查 UTM 和事件延迟 |
| Day 13 | P13 品牌留白图文卡 → `/?utm_source=pinterest&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d13-p01-home` | 无 | 汇总未解决测量异常，不作中途优化 |
| Day 14 | P14 Guardian 故事收束卡 → `/guardian-quiz?utm_source=pinterest&utm_medium=organic_social&utm_campaign=organic-sprint-14d&utm_content=d14-p01-quiz` | 无 | Day 14 复盘；仅产出下一步建议，不启动实验 |

### 发布前的必要条件

| 创始人需手动发布/授权 | 内部完成项 |
| --- | --- |
| 书面解除本次自然引流发布冻结；逐条手动发布已批准内容；确认账号权限与公开资料 | 每条内容的原创/授权素材、无商品/材质/价格/配送承诺 QA，唯一 CTA、UTM、目标 URL 与截图记录均已复核 |
| 批准使用 `/guardian-quiz`、`/story`、`/` 及核对后的邮件订阅承接作为本冲刺路径；不批准商品/集合页导流 | GA4 在测试环境取得外部 DebugView/实时报告和读取证据；consent 路径已验证；邮件订阅成功事件名/读取方式与数据记录表可用 |
| 批准 Day 0 开始时间、时区和 Day 7/14 复盘时间；任何公开沟通或账号操作由创始人执行 | 现有 SEO 承接页的可访问性、canonical、标题与错误页面检查已完成；异常均已记录为待确认或阻断 |

新增发布缺少创始人明确授权或逐条 QA 时，发布计划保持内部准备状态。GA4 外部验证缺失会阻断测量基线与效果判断，但既不授予也不撤销发布权限；发布权限始终由创始人的明确授权单独决定。邮件订阅是核心目标，但其承接路径、成功事件名和读取证据在核验前保持“待确认”；广告、商品导流、CTA 实验及商品状态变更不在本冲刺范围。

## 6. 历史管理员测试订单排除规则

1. 固定批次为 15 笔历史管理员测试订单，2026-07-25 快照状态为 `PENDING`；当前状态待确认。不删除，保留为结账与支付状态机的审计证据。
2. 永久排除于真实付费客户、订单、营收、转化率、复购、客服队列、评价邀请、营销受众、库存扣减评估和任何基线/实验分母分子之外。
3. 周报、日报、GA4/订单导出或手工复盘必须先应用批次排除；不得将该批次回填为 0 以外的业务成果。
4. 支付服务商侧若出现不一致，只能作为单笔异常人工核对；在创始人书面裁定前，仍保持整批排除，且不暴露支付标识或客户信息。
5. 对外部验证、支付沙盒或后续测试产生的新测试数据，必须单独标注、隔离并按同一排除原则处理，不得混入真实经营指标。
