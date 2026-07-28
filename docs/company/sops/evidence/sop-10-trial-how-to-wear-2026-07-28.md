# SOP-10 内部试运行证据链｜`/pearls/how-to-wear`

**试运行日期：** 2026-07-28

**历史 SOP 版本：** v0.1 / `draft`。本记录保留首次试运行的历史结果；当前模板重演见 `sop-10-trial-how-to-wear-2026-07-28-v0.2.md`。v0.2 已定义内部桌面演练/隔离验证边界及治理角色，但未激活 SOP，也没有具体 reviewer 指派或治理批准记录。

**范围：** 仅复核现有 `/pearls/how-to-wear` 的阶段 1–5 内部证据；不构成代码、发布、部署、URL、canonical、sitemap、DNS 或外部平台操作授权。

## 结论与状态边界

阶段 1–3 已形成可复核的内部研究、既有 URL 和来源/copy 材料。阶段 4 尚未完成，故阶段 5 **未执行**：不存在本次试运行产生的隔离工作树、代码差异、本地测试或渲染结果。这里的“未执行”不等于页面不存在、部署失败、未收录或无访问。

| 状态 | 本次可证实 | 不表示 |
| --- | --- | --- |
| 内部草稿/来源包 | 已有可审阅文本和逐段来源边界 | 已实现、已部署、可索引或有真实访问 |
| `rewrite_candidate` | URL 决策登记册允许在条件满足后准备本地改写 | 已获本次具体代码变更或发布授权 |
| 阶段 5 未执行 | 本试运行没有改动代码 | 本地实现失败、生产状态异常或外部平台结果 |
| GSC/Bing/GA4 | `not_available` | 0 流量、0 排名、0 会话或无价值 |

## 阶段 1｜查询与意图证据

| SOP 最小输入 / 通过定义 | 试运行证据 | 状态 | 边界 / 下一步 |
| --- | --- | --- | --- |
| 一个可描述的用户问题、意图和页面类型 | `maverenne-phase2-seo-geo-execution-queue.md` 将该页定义为 “How can I wear pearls day to day?”、信息型造型意图；`maverenne-us-serp-query-map-2026-07-28.md` 记录了 everyday pearl jewelry、how to style pearl jewelry、pearl earrings for everyday wear、modern/casual styling 等相邻公开 SERP 查询簇。 | 内部意图证据：已记录 | SERP 记录是 2026-07-28 的公开页面类型抽样和美国英语地区假设，不是美国本地化结果保证、搜索量、排名、点击或流量。 |
| 来源 URL 或平台截图可重放 | US SERP query map 保存查询、观察日期、页面类型、现有承接 URL 和公开证据 URL。 | 部分可复核 | 本试运行未重新打开或截图外部 SERP；仅引用已有内部只读记录。 |
| GSC/Bing query/page（若可读） | 没有已核验的 GSC property/export 或 Bing Webmaster export。 | `not_available` | 不填 `0`；未来读取必须记录 property/site、日期范围、时区、筛选和截图时间。 |

**阶段 1 判断：** 通过“公开 SERP 抽样”这一路径的最小意图描述要求；不通过或不宣称任何平台表现读取。

## 阶段 2｜既有 URL 优先

| SOP 最小输入 / 通过定义 | 试运行证据 | 状态 | 边界 / 下一步 |
| --- | --- | --- | --- |
| 在 URL 决策登记册检查现有路由、canonical 与意图 | `maverenne-phase2-url-decision-register.md` 列明现有路由 `/pearls/how-to-wear`，意图为“日常珍珠搭配／风格灵感”；`maverenne-seo-technical-inventory.md` 记录该现有路由的源码级 canonical、Article + FAQPage + BreadcrumbList 意图。 | 路由和源码意图：已记录 | 技术盘点是代码静态证据，非生产 HTTP、最终 `<head>`、canonical 或收录证据。 |
| 单一现有目标，写明 keep / rewrite_candidate / blocked 和等价目标 | URL 决策登记册状态为 `rewrite_candidate（首批本地）`；等价目标为同一路径 `/pearls/how-to-wear`。 | 已记录 | 不创建新路由，不设置 redirect/noindex，不改变 canonical。 |
| 进入代码条件 | 决策登记册要求 Draft 01、图片身份/权利、Edit slug、来源、40–60 词答案、FAQ/schema、描述性链接审校；公开发布另需授权。 | 条件已记录 | 条件的完成情况见阶段 3–4；“rewrite_candidate”本身不是本次代码授权。 |

**阶段 2 判断：** 现有 URL 优先和单一等价目标均已记录；生产 canonical/HTTP 为 `not_available`。

## 阶段 3｜来源与 copy

| SOP 最小输入 / 通过定义 | 试运行证据 | 状态 | 边界 / 下一步 |
| --- | --- | --- | --- |
| H1、40–60 词直接答案、正文/FAQ、来源清单、禁止主张清单 | `maverenne-how-to-wear-source-and-copy.md` 为现有 URL 提供 Title、meta、H1、正文、三条 FAQ、逐段来源登记、HTML 链接计划及 required exclusion scan。直接答案经本地计数为 **52 英文词**，处于 SOP 的 40–60 词范围。 | 已形成内部草稿包 | 该包明确为 internal/review-ready，不是公开 copy、页面实现或可索引证据。 |
| 实质性事实回溯到来源或一方主记录；编辑建议与商品事实分开 | 一般护理段指向 GIA Pearl Buyer’s Guide / Pearl Care and Cleaning Guide；购买前事实边界指向 FTC 两篇消费者指南；造型建议被明确标为 preference-led editorial judgment，而非产品或普适事实。 | 来源和边界：已记录 | GIA 与 FTC 页面须在发布前由人工浏览器重新打开并记录支持范围；本试运行未完成外部复开。 |
| 禁止主张 | 来源包禁止 SKU 珍珠类型、材质、尺寸、舒适度、价格、库存、配送、退换、疗愈/保护/神话/效果、品牌或流量结果等主张。 | 已记录 | 禁止清单尚未对实际代码 diff 执行，因为没有代码 diff。 |
| 草稿状态 | 来源包明确不发布、不部署、不改生产 canonical/DNS；名称清查的内部冷启动许可不等于生产迁移或发布授权。 | 已记录 | 不将草稿写为本地实现、部署、收录、AI 引用或实际访问。 |

**阶段 3 判断：** 内部文案准入材料已具备；需要外部来源复开和实际 diff 审校后才能进入阶段 4。

## 阶段 4｜事实与链接 QA

| SOP 要求 | 现有证据 | 状态 | 阻塞 / 所需证据 |
| --- | --- | --- | --- |
| 事实审校与来源/日期/byline | 逐段来源 URL、支持范围和 SKU/政策边界已在来源包登记。 | 部分完成 | GIA 与 FTC URL 的发布前人工复开、访问日期、reviewer 和逐项支持确认均为 `not_available`。可见来源/日期/byline 的最终位置也未在代码 diff 中核验。 |
| SKU / 政策审校 | 来源包要求在购买前转向精确产品页和当前政策，不从编辑页或图片推断。 | 边界已定义 | 没有当前 SKU/政策 owner 的签字或逐项主记录审校，状态 `not_available`。 |
| 图片身份 / 商用权 | 来源包要求每张编辑图有可验证的 SKU 身份和许可记录，否则不使用产品图。 | 要求已定义 | 本次没有图片清单、身份记录、权利记录或 reviewer，状态 `not_available`。 |
| 描述性 HTML 内链 | 计划中的普通 HTML 目的地为 `/pearls/care`、`/pearls`、`/gifts`、`/collections/pearl-series`、`/contact`；禁止 `/pearls/stories`、`/pearls/symbolism`、Guardian、神话或象征链接。 | 计划已记录 | 每个目的地的 owner 复核、批准环境可达性、当前政策/目录事实和最终锚文本尚未验证，状态 `not_available`。 |
| FAQ 可见文本与 schema | 技术盘点记录源码具有 Article + FAQPage + BreadcrumbList 意图。来源包提供三条 FAQ。 | 源码意图和草稿均存在 | 当前页面代码并未按本次来源包实施；没有 JSON-LD 抽取/对照、可见渲染或 schema reviewer 记录，状态 `not_available`。 |

**阶段 4 判断：** 未通过。未完成的事实、链接、图片和 FAQ/schema QA 阻止进入公开代码，也使本试运行不启动阶段 5 实施。

## 阶段 5｜隔离实现状态

| SOP 要求 | 试运行记录 | 状态 | 结论 |
| --- | --- | --- | --- |
| 获授权隔离分支/工作树、只含已批准范围 | 本试运行未创建工作树/分支，未修改 `src/app/pearls/how-to-wear/page.tsx` 或任何测试/metadata/schema 文件。 | 未执行 | 没有“本地实现”产物。 |
| 本地测试、静态检查和差异审阅 | 没有针对本页的代码 diff、测试命令、构建、快照或差异审阅。 | `not_available` | 不报告通过或失败。 |
| 保留 URL、可回滚范围、不触及生产 canonical/redirect | 本试运行没有代码或生产变更。 | 未执行 | 因未实施而无回滚对象；不应将此理解为生产技术验收。 |

**阶段 5 判断：** 不启动。前置阶段 4 未完成，且本次任务未授权代码修改。当前 v0.2 的内部演练/隔离验证边界不等于阶段 5 书面授权；具体 reviewer 指派与治理批准记录仍未取得。

## 本次不执行的阶段与外部数据

阶段 6–10（技术验收、发布授权、Day 0、Day 7/14、更新/暂停）未进入。生产 HTTP、canonical、robots、sitemap、GSC、Bing、GA4、反链和 AI 引用全部为 `not_available`；没有外部读取、登录、截图或写入发生。

## SOP-10 试运行中发现的不清晰或不可执行步骤

| SOP 位置 / 事项 | 不清晰或不可执行点 | 对本试运行的影响 | 建议补充（不改变当前业务边界） |
| --- | --- | --- | --- |
| 治理元数据：激活条件、批准依据 | 此项为 v0.1 试运行发现的历史缺口；v0.2 已明确内部演练与隔离验证边界、Owner/CEO/reviewer 角色，但具体 reviewer 指派和治理批准记录仍未取得。 | `rewrite_candidate` 仍不能单独构成代码授权。 | 以 v0.2 重演记录继续保留授权引用、指派人、单页范围、有效期和撤销条件字段。 |
| 阶段 1 的公开 SERP 路径 | 要求记录日期/地区假设，但未定义最少查询数量、是否需要截图、结果页面类型的固定字段或复查频率。 | 可说明意图，却难以判断“来源 URL 或平台截图可重放”是否充分。 | 增加最小 SERP 记录模板与复查时限；仍明确不得推断排名/搜索量。 |
| 阶段 3 的“实质性事实”与“编辑建议” | SOP 要求二者分开，但未定义分类规则、谁批准编辑判断、何时需要权威来源。 | 造型建议可被安全地标为偏好型编辑判断，但审校人可能作出不同判断。 | 增加事实/编辑判断/一方商品事实三类标注规则和 reviewer。 |
| 阶段 4 的来源、日期、byline | 规定要审校，但未定义可接受的来源访问记录格式、byline 的必填/适用条件，或过期来源的重审周期。 | 无法在 SOP 内判定来源包的“发布前复开”记录是否合格。 | 增加字段模板：URL、访问日期、claim、支持摘述、reviewer、适用范围、复核期限。 |
| 阶段 4 的链接 / 图片 QA | 要求“已审”，未定义 destination owner、图片 rights 证明最小字段，或当某目的地不可达时是删链接还是阻塞全页。 | 所有候选链接与图像都停在 `not_available`，但阻断范围无法一致执行。 | 增加每项链接/图片的 owner、证据、失效处理与页面级 GO/NO-GO 规则。 |
| FAQ 与 schema “语义一致” | 未定义比较方式（逐字、实质一致、字段对照）、所需工具或 reviewer。 | 有草稿 FAQ 与源码 schema 意图，仍不能判定通过。 | 增加可见 FAQ—JSON-LD 对照表、允许差异规则和验证命令/工具记录字段。 |
| 阶段 5 的本地验收 | 要求本地测试、静态检查与差异审阅，但没有最低测试集合、命令记录格式、通过阈值或 failure owner。 | 不能预先界定本页实施后何为足够的本地通过。 | 增加每页最小门：路由/metadata/H1/直接答案字数/FAQ-schema/链接/禁用词检查，以及命令、输出、reviewer、时间戳。 |

## 后续最小动作（不授权执行）

1. 为阶段 4 补齐 GIA/FTC 人工复开记录、内容/事实/SKU-政策/图片/SEO reviewer 和每个链接目标的核验表。
2. 在 v0.2 所列的单页隔离授权、CEO 指派的独立 reviewer 与治理批准记录明确后，再决定是否创建仅含 `/pearls/how-to-wear` 的本地差异。
3. 仅在本地差异完成并通过最小测试后，按 SOP 阶段 6–10 另行申请授权环境验证与 Day 0/7/14 只读复盘。

## 引用的内部记录

- `docs/company/sops/10-seo-geo-page-lifecycle.md`
- `docs/company/maverenne-us-serp-query-map-2026-07-28.md`
- `docs/company/maverenne-phase2-url-decision-register.md`
- `docs/company/maverenne-phase2-seo-geo-execution-queue.md`
- `docs/company/maverenne-seo-technical-inventory.md`
- `docs/company/maverenne-how-to-wear-source-and-copy.md`
