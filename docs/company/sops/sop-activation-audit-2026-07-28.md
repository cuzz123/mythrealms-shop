# SOP 激活审核｜2026-07-28

**审核 Owner：** CEO / 总控会话
**审核范围：** `SOP-10`、`SOP-20`、`SOP-30`、`SOP-40` 从 `draft` 进入 `ready` 的治理门槛。
**当前结论：** 四份 SOP 均已完成 v0.2 独立治理复核，独立 reviewer 为 CEO / 总控，源 Status 已同步为 `ready`；SOP-00 继续为 `active`。统一 Git 版本治理仍待技术会话定向提交。第 1–8 节保留首轮审核基线与历史缺口，第 9–10 节为当前控制性结论。`ready` 不等于 `active`，本文不替创始人或任何既有权限人批准外部、业务或生产动作。
**优先级边界：** SEO/GEO 仍是公司唯一 P0；内部 SOP 试运行只能使用现有权限和现有证据，不形成第四项公司关键任务。

## 1. 统一审核口径

按 `SOP-00`，`draft → ready` 只表示“内容完整、可以等待既有权限边界内的批准”，不表示已激活、已发布、已部署或获得商业权限。四份 SOP 在进入 `ready` 前统一完成：

1. 保留唯一 Owner 和 `draft` 源状态，按当前受审版本登记版本号与明确 `review_date`。
2. 把“最小激活条件”限定为内部桌面演练、证据分类或隔离环境验证；不得包含生产或外部动作。
3. 指定一个不与 Owner 重叠的 reviewer 角色，并保存一份按当前版本完成的试运行记录。
4. 试运行记录必须包含：SOP ID/版本、范围、日期/时区、执行人、输入、逐步结果、失败/跳过、停止条件、证据位置和 reviewer 结论。
5. 批准依据必须引用现有 CEO/公司决策或明确写“内部 SOP 治理准入”；不得把 `ready` 写成业务执行授权。
6. 任何缺失事实继续标“待确认”；试运行可以以 `blocked` 或 `not_available` 结束，不能为获得 `ready` 而放宽证据门槛。

**统一建议复盘窗：** `2026-08-07`，与 SOP 总索引及 14 天运营执行台试点复盘同窗。该日期是本审核建议；源文件未更新前仍以源文件实际值为准。

### 统一判定与最小修订任务

| SOP | `draft → ready` 判定 | Owner 内部最小修订任务 | 不属于 `ready` 内部准入、仍须未来另行授权/取证 |
| --- | --- | --- | --- |
| `SOP-10` | **暂不满足** | 增长与数据补 reviewer、复盘日、内部激活/批准依据；加入来源复开、事实/编辑判断、链接/图片、FAQ/schema 与阶段 5 本地验收的标准字段；用同一既有 URL 复核修订后的模板 | GSC/Bing 写入、生产 GA4/HTTP/head/sitemap 读取或变更、部署、canonical/redirect/noindex、公开发布 |
| `SOP-20` | **暂不满足** | 内容与品牌补 reviewer、复盘日、内部激活/批准依据；字段化控制性证据、资产/内容/公开三层状态、权利三态、A 修订复核、CTA/UTM 缺失处理及可机读连续性映射；以现有阻塞内容复核“不跳级” | 生成/投喂、剪辑、排期、账号操作、创始人手动发布及公开导流 |
| `SOP-30` | **暂不满足** | 商品与转化补 reviewer、复盘日、内部激活/批准依据；增加字段级证据模板与证据类别必填列，明确生成结构 QA→公开素材 QA 状态映射和营销授权最小签核格式；以同一证据包复核分层结果 | 商品事实补证所需外联/采购/付款、商品状态改变、营销解冻、公开发布 |
| `SOP-40` | **暂不满足** | 技术与自动化补独立 reviewer、内部治理批准依据与 `ready` 所需字段；完善 release record 对 fixed-SHA 命令/退出码、lint 例外、DB 阻塞、外部 BASE_URL 进程证据和回滚目标类型的记录规则，并复核本次 local-only NO-GO | merge/push/deploy、生产凭据/数据库、DNS/canonical、生产 smoke 与真实部署回滚执行 |

以上任务只修订 SOP 可执行性与审计字段。Owner 完成源文件修订并由所列 reviewer 复核前不得改为 `ready`；`ready` 即使未来成立，也不等于 `active` 或任何外部动作授权。

## 2. 逐份审核矩阵

| SOP | 唯一 Owner | 当前从 `draft` 进入 `ready` 还缺什么 | Owner 建议的 `review_date` | `ready` 批准角色 |
| --- | --- | --- | --- | --- |
| `SOP-10` SEO/GEO 页面生命周期 | 增长与数据 | `/pearls/how-to-wear` 阶段 1–3 的内部试运行证据已完成，但阶段 4 未通过、阶段 5 未执行；试运行揭示来源复开、事实/编辑判断、链接/图片、FAQ/schema、本地验收等标准字段与 reviewer/治理元数据仍缺，故尚不满足 `ready`。GSC/Bing/GA4 与生产 HTTP/head/sitemap 当前为 `not_available`，保留为未来对应阶段证据，不要求用外部动作换取内部准入 | 2026-08-07（审核建议；源文件待确认） | Owner 提交；CEO / 总控按 SOP-00 做治理准入，内容与品牌及技术与自动化分别复核内容/技术证据。无需创始人批准 `ready` |
| `SOP-20` 内容生产与短视频交接 | 内容与品牌 | `VIOLET_PENDANT_SEQUENCE_001` 内部试运行证据已完成，但尚不满足 `ready`：真实状态仍为 A-v1=`Fix`、B/C/D=内部参考资产 QA 通过、E/F=暂停；缺证据冲突优先级、资产/内容/公开状态分层、权利三态、A 修订复核字段、CTA/UTM 缺失处理、可机读连续性映射，且复盘日、内部激活条件与批准依据仍待确认 | 2026-08-07（审核建议；源文件待确认） | Owner 提交；CEO / 总控做治理准入，Image2 资产工坊与增长/事实 reviewer 只核证据。无需创始人批准 `ready` |
| `SOP-30` 商品事实与转化 QA | 商品与转化 | Violet A-v1 与 12 款商品矩阵的分层试运行已完成且未越级，但尚不满足 `ready`：缺字段级登记模板、证据类别必填列、生成结构 QA 与公开素材 QA 状态映射、营销授权最小签核格式；reviewer、复盘日、内部激活条件与批准依据仍待确认 | 2026-08-07（审核建议；源文件待确认） | Owner 提交；CEO / 总控做治理准入，内容与品牌复核公开主张边界，技术与自动化只复核 CTA/页面技术证据。无需创始人批准 `ready` |
| `SOP-40` 发布验证与回滚 | 技术与自动化 | 非生产 release record 试运行证据已完成，但结论为 local-only NO-GO，尚不满足 `ready`：固定 SHA 的候选验证记录不完整，full lint 历史为 8 errors/38 warnings，隔离 PostgreSQL 与符合 SOP 的外部 `BASE_URL` 进程证据缺失；独立 reviewer、内部治理批准依据及记录字段仍须补齐。生产授权与真实部署回滚目标属于未来执行关卡，不由 `ready` 自动取得 | 2026-08-07（沿用源文件） | Owner 提交；CEO / 总控做治理准入，另一技术 reviewer 核对固定 SHA、命令/结果和清理证据。`ready` 不授权 merge、push 或部署 |

## 3. SOP-10｜SEO/GEO 页面生命周期

### 最小激活条件与试运行范围

- 仅选择当前已批准的既有 `/pearls/how-to-wear`，不新建 earrings guide 或其他路由。
- 使用 Draft Pack 05、来源文案包、URL 决策登记册、安全商品内链矩阵与转化交接作为输入。
- 只演练生命周期阶段 1–5：意图证据、既有 URL 决策、来源/copy、事实/链接 QA、隔离本地候选记录。
- 不执行发布、部署、站长平台写入、redirect/noindex、sitemap 提交、切域或 canonical 生产值修改。

### 停止条件

- 出现新路由、无证据重定向、首页兜底跳转或范围漂移；
- 加入未核验商品、政策、法律、材质、库存或履约主张；
- 需要生产环境、外部账号写入或未授权 canonical/sitemap 变更；
- 任一 reviewer 无法将正文、链接、schema 或页面范围映射到来源。

### 最小证据

- 一份填写完整的 `URL → intent → keep/rewrite_candidate/blocked → sources → QA → local result` 记录；
- 每项实质主张、普通 HTML 内链与 reviewer 的来源/日期；
- 隔离差异和本地检查结果，明确写“未部署、未收录、未产生访问”；
- 停止项、`not_available` 字段和下一复盘日。

### 试运行回收（2026-07-28）

**证据：** [SOP-10 `/pearls/how-to-wear` 内部试运行](evidence/sop-10-trial-how-to-wear-2026-07-28.md)
**判定：** 试运行证据已完成，但 `draft → ready` 暂不满足；源文件 Status 继续为 `draft`。

本次已形成阶段 1–3 的内部证据：查询/意图与公开 SERP 抽样、既有 URL 决策，以及来源和 copy 草稿包。阶段 4 事实与链接 QA 未通过，因此阶段 5 未执行；没有本次试运行产生的代码差异、测试、构建、工作树或渲染产物。

进入 `ready` 前仍缺：

1. GSC、Bing、GA4，以及生产 HTTP、最终 `<head>`、canonical/sitemap 的可用证据；当前均为 `not_available`，不得解释为 0 流量、0 排名或技术失败。
2. GIA/FTC 来源的发布前人工复开、访问日期、支持范围与 reviewer 记录。
3. SKU/政策主记录审校、图片身份与权利证据、各目标链接的 Owner/可达性/事实边界核验。
4. 可见 FAQ 与 JSON-LD/schema 的逐项对照、允许差异规则及 reviewer 结论。
5. 唯一 reviewer 责任、源文件 `review_date`、内部激活条件和批准依据。

本次未修改代码、URL、canonical、sitemap 或商品状态，未部署、发布、登录外部平台或生成生产证据。四份试运行现已统一审核；SOP-10 须先完成上列 Owner 内部修订与 reviewer 复核，不单独升级为 `ready`。

## 4. SOP-20｜内容生产与短视频交接

### 最小激活条件与试运行范围

- 使用一个现有的非发布候选 `content_id` 做内部演练；优先选择不含未确认商品承诺、且不抢占 SEO/GEO P0 的素材。
- 只演练 brief、事实/禁用词、素材来源/权利、首帧 QA 与连续性交接；允许以 `blocked_*` 或 `not_available` 结束。
- 不投喂平台、不自动生成、不剪辑、不排期、不登录账号、不发布，也不把演练记录升级为正式成片。

### 停止条件

- 商品、画面、文案、CTA、目标 URL/UTM 不能一一对应；
- 素材身份、生成来源、商用权或第三方参考边界不清；
- 出现未确认材质、价格、库存、配送、低敏、效果或权利承诺；
- 任何人要求跳级到 `clip_generated`、`master_approved`、`post_ready` 或 `published` 而无对应证据。

### 最小证据

- 一份完整交接记录：`content_id`、Owner、版本、状态、事实/禁用词、素材路径/hash、来源/权利、CTA、URL/UTM 和 QA；
- 首帧/画板映射与拒绝项；
- reviewer 日期和结论；
- 明确的 `founder_manual_publish_evidence: not_available`，除非未来确有创始人平台证据。

### 试运行回收（2026-07-28）

**证据：** [SOP-20 Violet Pendant 内部试运行](evidence/sop-20-trial-violet-pendant-2026-07-28.md)
**内容 ID：** `VIOLET_PENDANT_SEQUENCE_001`
**判定：** 试运行证据已完成，但 `draft → ready` 暂不满足；源文件 Status 继续为 `draft`。

本次保持控制性证据所示的真实状态：A-v1=`Fix`；B/C/D 仅为内部参考资产 QA 通过；E/F=暂停。B/C/D 共 10 个主文件及派生文件的路径与 SHA-256 为 `10/10` 匹配，但这只证明内部可追溯性，不能覆盖 A-v1 的后续 Product QA `Fix`，也不构成商品事实、第三方权利、首帧、成片或公开发布批准。

进入 `ready` 前，SOP-20 仍需补清以下治理字段：

1. 证据冲突时的控制性证据路径、替代关系和决策时间。
2. `asset_status`、`content_status`、`public_release_status` 三层状态，防止资产 QA 被误读为内容可发布。
3. 内部生成溯源、第三方权利未核验、公开使用获授权三态权利字段。
4. A 每次修订的版本、修复项、Product QA `Keep/Fix`、reviewer 与日期。
5. CTA、目标 URL/UTM 缺失时固定为 `not_available` 且不得临时补填或发布的处理规则。
6. E/F 前每镜 source/end frame、身份/服装/场景引用、拒绝标准与 hash 的可机读连续性映射。
7. 源文件 `review_date`、内部激活条件和批准依据。

本次无生成、平台投喂、剪辑、排期、发布或导流；英文文案、CTA、目标 URL/UTM 与创始人发布证据均未被虚构补齐。四份试运行现已统一审核；SOP-20 须先完成上列 Owner 内部修订与 reviewer 复核，不单独升级为 `ready`。

## 5. SOP-30｜商品事实与转化 QA

### 最小激活条件与试运行范围

- 从现有 12 商品转化证据矩阵选一个 SKU 做只读证据分类；不要求该 SKU 通过，也不恢复样品、采购或履约工作。
- 仅用现有页面、矩阵、来源/权利记录和历史技术证据，逐项输出“通过（限技术）/ 阻塞 / 待确认”。
- 历史 HTTP 200、UTM 保留、Add-to-Cart HTML 或页面价格/`inStock` 只能保留为对应时点的技术/展示证据，不能证明商品身份、商用权、真实售价/库存、履约、政策或完整结账。

### 停止条件

- 需要联系供应商/货代、购买样品、付款、访问客户/支付数据或修改商品状态；
- 用图片、名称、代码、截图或另一 SKU 的资料推断材质、规格、权利或履约；
- 把营销冻结解释为下架，或把页面可访问解释为营销解冻；
- reviewer 无法确认所引用证据的 SKU、版本、地区或取得时间。

### 最小证据

- 一份字段级记录：结论、原始证据位置、时间、SKU/版本/地区、证据强度、复核人和失效触发；
- 对供应商映射、材质、图片权利、价格/库存、履约/退换、移动 CTA/加购分别给出通过/阻塞/待确认；
- 清楚分开技术入口、经营事实和营销放行；
- 试运行结论不得改变页面、商品状态或营销权限。

### 试运行回收（2026-07-28）

**证据：** [SOP-30 Violet A-v1 与 12 款商品分层试运行](evidence/sop-30-trial-violet-and-assortment-2026-07-28.md)
**判定：** 内部分层演练通过，但 `draft → ready` 暂不满足；源文件 Status 继续为 `draft`。

本次成功把证据分为可观察事实、技术证据、经营事实与营销状态四层：Violet 源图/A-v1 的路径、hash 与结构 QA 没有被升级为材质、权利或公开素材批准；12 款的历史 HTTP/UTM/Add-to-Cart、代码价格与 `inStock` 也没有被升级为真实库存、履约、完整结账或营销放行。

进入 `ready` 前由商品与转化 Owner 完成：

1. 增加可复用的字段级证据登记模板，至少包含来源、时间、SKU/版本/地区、证据强度、复核人和失效触发。
2. 将“可观察 / 技术 / 经营 / 营销状态”设为必填证据类别，禁止使用无边界的泛化“通过”。
3. 明确生成结构 QA 与公开素材 QA 的非替代状态映射，例如 `internal_visual_only`、`fix_required`、`rights_pending`、`marketing_approved`。
4. 增加营销授权最小签核格式：SKU、地区、渠道、素材、允许声明、开始/结束时间、复核日和批准引用。
5. 补唯一 reviewer、源文件 `review_date`、内部激活条件与批准依据，并用现有证据包复核新模板。

本次未修改商品、价格、库存、目录可见性、加购/结账、营销或素材状态。技术入口证据继续只按其日期和环境成立，不构成商品或履约通过。

## 6. SOP-40｜发布验证与回滚

### 最小激活条件与试运行范围

- 选择一个已经存在的固定本地候选 SHA，完成 release record 桌面演练或只读本地复核；不为试运行创建新的生产候选。
- 记录 clean worktree、`git diff --check`、相关测试/类型/lint/构建的实际结果；若完整 generate/prerender 需要隔离非生产 PostgreSQL 而环境不可用，按阻塞记录，不连接生产数据库。
- 可以复用已有外部本地服务 + `BASE_URL` 的测试证据，但须保留 PID/端口/命令核对与清理范围；不得把旧证据映射到不同 SHA。
- 不 merge、不 push、不 deploy、不读取生产凭据、不改 DNS/canonical，也不执行回滚。

### 停止条件

- worktree 不干净、固定 SHA 改变、必需门槛失败或证据无法对应同一候选；
- 需要生产数据库、生产凭据、广泛进程终止或未确认的隔离数据库；
- 缺少 merge/push/deploy/cutover 的对应书面权限；
- smoke 显示客户可见回归，或回滚目标不明确。

### 最小证据

- 一份完整 release record：固定 SHA、worktree/branch、当前状态、命令/退出码、测试与 build 模式；
- 隔离数据库的主机分类、临时库名及清理证据，或明确 `blocked`，不得保存凭据；
- `BASE_URL`、PID/端口/命令核对、测试结果与清理证明（如适用）；
- 批准引用保持“待确认”，并明确当前未 merge、未 push、未部署、未切域。

### 试运行回收（2026-07-28）

**证据：** [SOP-40 本地发布记录试运行](evidence/sop-40-trial-local-release-record-2026-07-28.md)
**固定候选：** `36a85c74e981723c7528c7a6fff1d4d317ba55b2`
**判定：** `local-only NO-GO`；试运行记录已完成，但 `draft → ready` 仍不满足，源文件 Status 继续为 `draft`。

已取得的本候选证据：

- `git rev-parse HEAD` 对应固定 SHA；
- 试运行开始前 `git status --short` 无输出；
- `git diff --check` 无输出；
- 未在试运行中修改候选源码。

本次候选保持 local-only NO-GO 的证据缺口：

1. 固定 SHA 尚无全量 unit、typecheck、compile/full build 结果；不得用其他 SHA 的历史通过结果替代。
2. full lint 的历史固定树结果为 **8 errors / 38 warnings**，不是 lint-green，也没有豁免。
3. 没有确认可用的隔离、非生产 PostgreSQL/fixture；完整 generate/prerender 继续标 `blocked`，且未使用生产 `DATABASE_URL` 或生产数据。
4. 没有按 SOP-40 外部进程协议产生完整的 `BASE_URL`、PID、command、port、测试结果和 cleanup 证明；历史 managed server 结果不可替代。
5. 没有生产授权、生产变量核验、部署 smoke 或真实部署回滚目标；本地 Git SHA 不能充当生产回滚目标。这些是未来生产执行关卡，不因 SOP 进入 `ready` 而自动取得。

权限边界核对：试运行未执行 merge、push、deploy、DNS/canonical、生产凭据、生产数据库、付款、邮件、履约或外部账号动作。四份证据现已齐套；统一审核仍要求技术与自动化 Owner 补独立 reviewer、内部治理批准依据与记录字段，并复核本次 NO-GO 后，才可重新申请 `ready`。

## 7. 创始人决策边界

### 本次真正需要创始人决定的事项

**无。** 四份 SOP 的内部试运行与 `draft → ready` 治理审核可以在现有 Owner、reviewer 与 CEO / 总控权限内完成；`ready` 不授权外部动作。

### 仅在未来触发时才提交创始人的事项

| 触发事项 | 届时需要的明确决定 |
| --- | --- |
| Pinterest/TikTok 或其他账号公开发布、广告或扩大渠道 | 指定内容、账号、渠道、时间、预算（如有）及允许范围；创始人继续手动发布，除非另行授权 |
| 生产部署、DNS/canonical/切域、外部站长平台写入或生产凭据使用 | 指定版本/SHA、环境、动作、operator、回滚目标及授权范围 |
| 付款、采购、样品、供应商/货代外联或恢复履约测试 | 指定预算、对象、市场、数量、责任人和停止条件 |
| 商品价格、库存、`isActive`、可见性、加购/结账状态或营销解冻 | 指定 SKU、字段、渠道/市场、生效范围、证据与复盘日 |

普通内部 reviewer、复盘日补齐、证据模板演练、隔离本地验证与 `draft → ready` 治理登记不列为创始人商业决策。任何真正的 merge、push 或其他生产链动作仍须由既有权限人明确批准，但不因本审核自动升级为创始人事项。

## 8. 统一审核后的执行顺序

1. 四个 Owner 按“统一判定与最小修订任务”补源文件元数据和字段，不扩大适用范围，不触发外部或生产动作。
2. 各自指定的独立 reviewer 用现有试运行证据复核修订后的模板；可以继续以 `blocked` / `not_available` / NO-GO 结束，但必须证明状态分层和停止条件可重复执行。
3. CEO / 总控只在修订 diff、reviewer 结论和证据位置齐备后复核 `draft → ready`；逐份实际满足可逐份登记，但不得跳过统一门槛。
4. 在源文件真实改为 `ready` 前，总索引继续显示四份 `draft`；即使未来进入 `ready`，外部发布、部署、付款、采购、外联和商品状态动作仍另行申请。

## 9. 第二轮独立 reviewer 登记（2026-07-28）

本节是晚于前述首轮审核的控制性 reviewer 记录。四份 `ready_candidate` 已在本次最小状态同步中转为 `ready`；这只表示治理内容、内部重演与独立复核齐备，不等于 `active` 或业务/生产授权。四份源 SOP 与相应 evidence 当前仍未纳入 Git 跟踪，统一版本治理尚待技术会话定向提交。

| SOP | 第二轮判定 | 控制性证据 | 状态边界 / 剩余条件 |
| --- | --- | --- | --- |
| `SOP-10 v0.2` | **Pass / `ready`** | [v0.2 `/pearls/how-to-wear` 只读重演](evidence/sop-10-trial-how-to-wear-2026-07-28-v0.2.md) | CEO / 总控确认 Owner 分离、三类判断和 QA 字段可执行；来源复开仍 `not_done`、阶段 4=`blocked`、阶段 5=`not_done`。旧 v0.1 仅作历史引用；外部与生产动作仍另授权 |
| `SOP-20 v0.2` | **Pass / `ready`** | [v0.2 E/F 预检与第四轮 reviewer 留档](evidence/sop-20-v0.2-violet-ef-preflight-qa-2026-07-28.md) | `frozen_control_v1` 的实际 E 文件、manifest、镜头圣经与证据包一致；S01 仅 preflight GO、未提交；S02/S03 继续 `CONDITIONAL HOLD`；全部下游为 false，公开发布保持 blocked |
| `SOP-30 v0.2` | **Pass / `ready`** | [v0.2 Reviewer-ready 字段级证据包](evidence/sop-30-v0.2-reviewer-ready-evidence-2026-07-28.md) | CEO / 总控确认 `ready`/`active` 已拆分；A-v2 Keep 仅 `observable`、provenance/hash 仅 `technical`；12 商品 `operational`/`marketing` 未越级，商品与营销状态不变 |
| `SOP-40 v0.2` | **Pass / `ready`** | [v0.2 本地 release record](evidence/sop-40-trial-local-release-record-2026-07-28.md) | fixed SHA 的记录字段可填；7 个当前 gate 全为 `not_run`，历史 lint 仅历史上下文。SOP 治理就绪，但固定候选仍 `local-only NO-GO`；不授权 merge、push 或部署 |

**当前汇总：** `SOP-10/20/30/40 = ready`；SOP-00=`active`。`ready` 不等于 `active`，不授权任何外部、业务或生产动作。统一 Git 版本治理仍待技术会话按第 10 节清单定向提交；本次没有 stage、commit、发布、部署、生成、投喂、商品/营销状态变化或外部动作。

## 10. 统一 Git 版本治理候选范围（尚未暂存或提交）

仅允许以下 14 个 SOP、evidence 与索引文件进入后续定向本地版本治理清单：

1. `docs/company/sops/00-sop-governance.md`
2. `docs/company/sops/10-seo-geo-page-lifecycle.md`
3. `docs/company/sops/20-content-video-handoff.md`
4. `docs/company/sops/30-product-fact-and-conversion-qa.md`
5. `docs/company/sops/40-release-verification-and-rollback.md`
6. `docs/company/sops/README.md`
7. `docs/company/sops/sop-activation-audit-2026-07-28.md`
8. `docs/company/sops/evidence/sop-10-trial-how-to-wear-2026-07-28.md`
9. `docs/company/sops/evidence/sop-10-trial-how-to-wear-2026-07-28-v0.2.md`
10. `docs/company/sops/evidence/sop-20-trial-violet-pendant-2026-07-28.md`
11. `docs/company/sops/evidence/sop-20-v0.2-violet-ef-preflight-qa-2026-07-28.md`
12. `docs/company/sops/evidence/sop-30-trial-violet-and-assortment-2026-07-28.md`
13. `docs/company/sops/evidence/sop-30-v0.2-reviewer-ready-evidence-2026-07-28.md`
14. `docs/company/sops/evidence/sop-40-trial-local-release-record-2026-07-28.md`

版本治理前必须再次核验：清单外文件未被暂存；四份源 Status 均为 `ready`、SOP-00 仍为 `active`；v0.1 evidence 仅作历史记录、v0.2 evidence 才是当前控制性复核；README 与 audit 的相对链接可解析；文件不含密钥、客户个人数据或支付标识；`git diff --cached --name-only` 为空。当前支持 SOP-20 hash 判断的 `video-pipeline` 文件不在本清单内，且其路径为本机绝对路径；若其本身未纳入可复现版本治理，新环境只能审阅已登记指纹，不能仅凭这 14 个文件重算原始资产，属于保留风险。本节不授权 stage、commit、push、merge 或任何生产动作。
