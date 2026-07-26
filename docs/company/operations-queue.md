# 运营执行队列（14 天）

> 试运行范围：2026-07-25–2026-08-07。状态定义见 [运营执行台](operations-desk-14d.md)。队列记录已派工作与依赖，不代表授权、发布、部署或商业结果。

| ID | 优先级 | 工作线 / 任务 | Owner | 输入 | 交付 | 截止 | 验收 | 依赖 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OPS-001 | P0（唯一） | SEO/GEO：现有可索引页面、主题/实体、内链、结构化信息、可引用内容、搜索与 AI 推荐入口的证据化优先级清单 | 增长与数据 + 内容与品牌；技术与自动化仅处理直接阻塞 | 公司《每周优先级》治理基线 | 有来源的优先级清单与证据表 | 2026-08-07 | 区分准备、部署、收录、引用/推荐、访问；未知项为待确认 | 外部搜索/AI 可见性；生产变更另行授权 | `in_progress` |
| OPS-002 | P0 子项目 | Maverenne 名称、域名与社交名称门槛的可复查补证 | 秘书处调度；外部专业/账号主体待确认 | [名称核验记录](maverenne-name-clearance.md) | 完整、可复查的门槛证据；不足则保留不通过结论 | 客户可见迁移前 | 仅在全部必需证据满足后才可放行；当前不得放行 | USPTO、WIPO、注册商、社交平台、专业判断与授权 | `waiting_external` |
| OPS-003 | P0 子项目 | Maverenne 旧 URL 四源证据审计 | 增长与数据 + 内容与品牌；秘书处调度 | [迁移准备行动](../../obsidian-vault/00-首页/ACT-2026-07-26｜Maverenne 品牌迁移准备.md) | 按 URL 的 GSC/Bing/GA4/Pinterest 证据表；无证据为 `keep/待确认` | 2026-08-07 | 无猜测的 keep/rewrite/redirect 结论；不批量删页或重定向首页 | 四个平台逐 URL 只读导出 | `waiting_external` |
| OPS-004 | P0 子项目 | 阶段一 Task 2–7：品牌事实源与客户可见站内迁移 | 技术与自动化 + 内容与品牌 | [阶段一计划](../superpowers/plans/2026-07-26-maverenne-phase-1-brand-foundation.md) | 隔离分支内、经测试与审查的计划交付 | 未启动 | 名称门槛通过后，按各任务测试和独立审查验收；不等于生产上线 | `name_clearance_passed: false`；`npm ci`、`prisma generate`、隔离分支及后续授权 | `stopped` |
| OPS-005 | P0 子项目 | 阶段二客户可见 SEO/内容迁移实施 | 技术与自动化 + 内容与品牌 + 增长与数据 | [阶段二计划](../superpowers/plans/2026-07-26-maverenne-phase-2-seo-content-migration.md) | URL 审计、内容/机器可读品牌迁移与残留审计的计划交付 | 未启动 | 仅在前置门槛、逐 URL 证据、测试和审查满足后验收 | 名称门槛、OPS-003、隔离分支；生产授权另行取得 | `stopped` |
| OPS-006 | P1 | Reddit 自然入口内部准备 | 增长与数据 | 公司《每周优先级》治理基线 | 社区、规则、主题、潜在落地页与风险清单 | 2026-08-07 | 仅研究；不含发帖、评论或外链 | 平台/社区规则；外部动作需另行授权 | `queued` |
| OPS-007 | 支持（非 P0） | Pinterest/TikTok 素材候选、文案/禁用词、链接/UTM QA 与发布记录 | 创始人手动剪辑/发布；内容与品牌 + 增长与数据支持 | 公司《每周优先级》治理基线 | 内部支持包与真实发布记录模板 | 2026-08-07 | 只有创始人确认和平台证据可记录“正式成片/已发布” | 创始人操作、平台证据；部门无账号发布权限 | `queued` |
| OPS-008 | 治理 | 14 天试点日对账与交付回收 | 秘书处/调度中心 | [运营执行台](operations-desk-14d.md) 与本队列 | 每日回收记录、状态校正与异常升级 | 每个工作日 | 每条变更可追溯；不虚构完成或外部事实 | 各 Owner 的回收；CEO 的决策 | `in_progress` |
| OPS-009 | P0 支持 | SEO 技术清单（只读源码与配置盘点） | 技术与自动化 | `maverenne-seo-technical-inventory.md`；提交 `b64e98b` | 路由、canonical、metadata、schema、sitemap、robots 与旧品牌残留的证据化清单 | 2026-07-26 | 已产出且明确代码证据不等于部署、抓取或收录 | 生产 HTTP/搜索平台验证仍另列，客户可见改名继续冻结 | `accepted` |
| OPS-010 | P0 支持 | GEO 实体与事实注册表 | 内容与品牌 + 增长与数据 | `maverenne-entity-fact-registry.md`；提交 `973d06c` | 可审计的实体、事实边界、证据等级与 AI 答复限制 | 2026-07-26 | 已形成内部注册表；未把 proposed/unknown 写为经营事实 | 逐 SKU、订单、平台与名称核验仍待独立证据 | `accepted` |
| OPS-011 | P0 支持 | 四周 SEO/GEO backlog | 增长与数据 + 内容与品牌 | `maverenne-seo-geo-backlog.md`；提交 `1433162` | 有优先级、验收定义和事实边界的四周内部 backlog | 2026-07-26 | backlog 已登记；其中客户可见品牌改名项不自动获授权 | 名称门槛、生产变更及外部证据 | `accepted` |
| OPS-012 | P0 支持 | 构建基线报告 | 技术与自动化 | `maverenne-build-baseline.md`；提交 `6e9624a` | 依赖恢复门槛、失败原因与可复现验证顺序 | 2026-07-26 | 报告已接受；报告明确 `npm ci` 失败、Prisma/测试/lint/build 均未运行 | 依赖锁修复与完整验证见 OPS-016 | `accepted` |
| OPS-013 | P0 子项目 | URL 审计工具、初始 CSV 与测试 | 技术与自动化 + 增长与数据 | `scripts/audit-brand-routes.ts`、`maverenne-url-migration.csv`、`tests/brand-route-audit.test.ts`；提交 `394284e` | 基于点击/外链证据的 keep/rewrite/redirect 决策工具与初始审计表 | 2026-07-26 | 工具、CSV 与测试已登记；Node 原生测试 `5/5` 通过。CSV 当前外部指标为 `not_available`，不表示 URL 决策已完成 | GSC/Bing/GA4/Pinterest 逐路径导出；OPS-003 保持等待 | `accepted` |
| OPS-014 | P0 子项目 | Maverenne 人工名称清查清单 | 秘书处调度；获授权账号管理员执行 | `maverenne-clearance-manual-checklist.md`；提交 `2168b5c` | 不写入外部系统的第一方证据采集与停止规则清单 | 2026-07-26 | 清单已接受；未执行清单，也不改变 `name_clearance_passed: false` | 律师、注册商、平台账号管理员与明确授权 | `accepted` |
| OPS-015 | 治理 | 运营执行台章程 | 秘书处/调度中心 | [运营执行台](operations-desk-14d.md)；提交 `b2cc656` | 14 天职责边界、六态流转、交接/对账/升级与转永久门槛 | 2026-07-26 | 章程已接受；不授予策略、发布、部署、付款、采购、外联或商品状态权限 | CEO 在 Day 14 复盘是否延续 | `accepted` |
| OPS-016 | P0 支持 | 依赖锁同步修复 | 技术与自动化 | `maverenne-build-baseline-followup.md`；提交 `bbbf255` | 经审查的 `package-lock.json` 同步修复与验证记录 | 2026-07-26 | 锁文件修复已接受；忽略 lifecycle scripts 的干净安装通过。完整验证未接受，见下方阻塞证据 | 支持的 Node/npm/Prisma 运行环境；后续验证须另行取得真实结果 | `accepted` |
| OPS-017 | 支持（非 P0） | 转化政策一致性与 readiness 审计 | 商品与转化 + 内容与品牌；技术与自动化支持 | `maverenne-conversion-evidence-pack.md`、`maverenne-conversion-readiness.md`；提交 `88c0978`、`6feb644` | 转化证据准备包、政策一致性/ready 状态审计与风险边界 | 2026-07-26 | 内部审计与待填写证据包已接受；不等于真实接单、履约、退款或公开政策已放行 | 一手履约、政策、支付和商品事实；公开修改需另行授权 | `accepted` |
| OPS-018 | P0 支持 | 内部链接与页面验收矩阵 | 增长与数据 + 内容与品牌；技术与自动化支持 | `maverenne-seo-internal-link-map.md`；提交 `7829cdf` | 路径级内链、canonical、robots、sitemap、结构化信息与验收证据矩阵 | 2026-07-26 | 内部验收矩阵已接受；其中生产/发布门禁仍须按矩阵取得实际证据 | 可用构建环境；生产只读核验和变更授权 | `accepted` |
| OPS-019 | 治理 | 原商品会话消息提交失败的替代处置 | 秘书处/调度中心 | 原会话提交失败记录；OPS-017 | 将未送达的原商品会话事项由独立转化政策一致性审计承接 | 2026-07-26 | 已记录替代关系；不追溯宣称原消息已送达或已处理 | OPS-017 的实际交付与验收 | `accepted` |
| OPS-020 | P0 支持 | SEO/GEO 完整草稿包 02 | 内容与品牌 | `maverenne-seo-draft-pack-02.md`；提交 `ff1cdcb` | `/pearls/care` 与 `/pearls/freshwater-pearls` 的品牌中性内部草稿 | 2026-07-26 | 正文、直接回答、FAQ、来源与禁用推断边界齐全；未改公开页面 | 名称清查、公开文案审查与发布授权 | `accepted` |
| OPS-021 | P0 支持 | SEO/GEO 完整草稿包 03 | 内容与品牌 | `maverenne-seo-draft-pack-03.md`；提交 `654dd3d` | `/pearls` 与 `/about` 的内部审校草稿 | 2026-07-26 | About 使用 `[BRAND_NAME]`；未宣称注册、上线、域名或经营事实 | 名称清查、品牌事实与发布授权 | `accepted` |
| OPS-022 | P0 支持 | Prisma 运行时兼容性诊断 | 技术与自动化 | `maverenne-build-runtime-compatibility.md`；提交 `efe8fee` | Node 24 安装、Prisma CLI 与 generate 的分层诊断证据 | 2026-07-26 | Node 24 干净安装与 CLI 启动证据已接受；`generate` 仍未通过 | Node 22 LTS 对照或 Prisma 引擎/生成挂起根因 | `accepted` |
| OPS-023 | P0 子项目 | Maverenne 名称清查证据补强 | 秘书处调度 | `maverenne-name-clearance.md` | 带查询时间、词组、类别、官方方法和明确布尔门槛的只读记录 | 2026-07-26 | 证据记录已补强；三项门槛继续为 `false`，不代表发现确定冲突 | USPTO/WIPO 可复核结果、律师复核、注册商与账号管理员证据 | `waiting_external` |
| OPS-024 | P0 支持 | 六页 SEO/GEO 一手来源证据包 | 内容与品牌 + 增长与数据 | `maverenne-seo-source-evidence.md` | 六页逐主张的来源、支持范围、禁止推断与采用状态 | 2026-07-26 | 仅采用 GIA、FTC、Google Search Central；未改公开页面 | 发布前链接复核、商品/政策事实、名称清查与发布授权 | `accepted` |
| OPS-025 | P0 支持 | Prisma 运行时兼容性跟进诊断 | 技术与自动化 + 秘书处复核 | `maverenne-build-runtime-compatibility-followup.md` | Node 22 获取失败、隔离目录成功与主工作区冷启动超时的分层证据 | 2026-07-26 | 主工作区安装退出 0，但 `generate` 124 秒超时且遗留进程已定向终止；客户端仍不可解析，单测、lint、build 未运行 | 诊断主工作区多平台引擎获取链路或提供可信预热缓存，再重新验证 | `accepted_with_blocker` |

## 本批接受的交付（非新增任务）

| 交付 | 证据提交 | 登记 | 说明 |
| --- | --- | --- | --- |
| SEO draft pack 01 | `10e4927` | `accepted` | 内部、不可发布的 SEO/GEO 草稿包；不授权公开文案、代码、metadata、结构化数据或链接变更。 |
| Conversion evidence pack | `88c0978` | `accepted` | 待填写的经营事实采集/复核包；接受文档交付，不表示任何 P0 经营事实已获证明。 |
| Conversion readiness audit | `6feb644` | `accepted` | 由 OPS-017 承接；接受内部审计，不表示真实接单或履约放行。 |
| Internal link acceptance map | `7829cdf` | `accepted` | 由 OPS-018 承接；接受内部矩阵，生产页面验收仍需逐项实际证据。 |
| 依赖锁同步修复 | `bbbf255` | `accepted` | 由 OPS-016 承接；仅接受锁文件同步修复，未接受完整构建验证。 |
| SEO draft pack 02 | `ff1cdcb` | `accepted` | 两个现有珍珠知识 URL 的品牌中性内部草稿；不授权发布。 |
| SEO draft pack 03 | `654dd3d` | `accepted` | Pearl Guide hub 与 `[BRAND_NAME]` About 内部草稿；不授权替换占位符或上线。 |
| Prisma 运行时兼容性诊断 | `efe8fee` | `accepted` | 接受诊断记录，不表示 `prisma generate`、测试、lint 或 build 通过。 |
| Maverenne 名称清查证据补强 | `maverenne-name-clearance.md` | `accepted_with_blocker` | 接受只读证据记录；名称、购买、生产迁移三项门槛继续为 `false`。 |
| 六页 SEO/GEO 一手来源证据包 | `maverenne-seo-source-evidence.md` | `accepted` | 接受内部来源矩阵；不授权公开页面、商品事实或品牌事实变更。 |
| Prisma 运行时兼容性跟进 | `maverenne-build-runtime-compatibility-followup.md` | `accepted` | 接受隔离诊断目录中 Node 24 缓存命中后的真实成功证据；不表示主工作区、单测、lint 或 build 通过。 |

## 验证阻塞证据（非新增任务）

| 状态 | 范围 | 可复查证据 | 未运行项 | 解除条件 |
| --- | --- | --- | --- | --- |
| `blocked_main_workspace` | Prisma 与完整验证 | 隔离诊断目录在引擎缓存齐备后 `generate` 1.049 秒退出 0；主工作区 lockfile 安装 43.7 秒退出 0，但直接 `generate` 124 秒超时且遗留本轮 PID `37248`，定向终止后客户端仍不可解析 | 主工作区单测、lint、build 均未运行；Node 22 A/B 因官方 ZIP 下载失败未完成 | 诊断或预热主工作区所需 Windows/RHEL 多平台引擎获取链路，生成客户端后再按顺序验证；不得把隔离目录成功写成主工作区或构建通过。 |

## 冻结提示

`name_clearance_passed: false` 时，客户可见品牌改名、域名购买、外部平台写入、生产部署和任何商品状态变更都不在本队列可执行范围。OPS-004 和 OPS-005 的 `stopped` 仅反映这一门槛，不表示取消或完成。
