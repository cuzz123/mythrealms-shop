# 公司 SOP 总索引

**索引 Owner：** CEO / 总控会话。**维护：** 秘书处 / 14 天运营执行台仅做导航、证据回收与状态登记，不构成新部门或新决策层。
**当前优先级：** SEO/GEO 是公司唯一 P0。SOP 只固化已批准流程，不授权发布、部署、外联、付款、采购、广告或商品状态变化。
**索引复盘日：** 2026-08-07。未知或源文件未声明的字段统一写“待确认”。

## 导航与最小索引

| SOP | Owner | 版本 / 状态 | 触发条件 | 关键输入 | 主要输出 | 最小证据 | 复盘日 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [SOP-00｜治理与总索引规范](00-sop-governance.md) | CEO / 总控会话 | `v1.0` / `active` | 建立、变更、暂停、恢复或退役公司 SOP/checklist | 上位决策、适用范围、责任与审批边界 | 统一编号、五态、版本、证据及索引规则 | 版本/状态、批准依据、变更记录 | 2026-08-07 |
| [SOP-10｜SEO/GEO 页面生命周期](10-seo-geo-page-lifecycle.md) | 增长与数据 | `v0.2` / `ready` | 现有可索引 URL 进入研究、改写、本地实现、技术验收或复盘 | 查询/意图证据、URL 决策、来源文案、事实/链接 QA、获批本地范围 | 页面生命周期记录、本地候选、技术验收或 Day 0/7/14 复盘记录 | 平台导出/截图、URL/head/robots/sitemap/schema/内链结果、时间与 reviewer | 2026-08-07 |
| [SOP-20｜内容生产与短视频交接](20-content-video-handoff.md) | 内容与品牌 | `v0.2` / `ready` | 内容 brief 进入事实、素材、生成、剪辑、发布准备或发布后记录 | brief、事实/禁用词、素材来源/权利、文件映射、单一 CTA、URL/UTM | 可追溯交接链；仅有创始人真实平台证据时才产生 `published/recorded` 记录 | 素材路径/hash、来源与权利、QA、平台 URL、发布时间与可见数据 | 2026-08-07 |
| [SOP-30｜商品事实与转化 QA](30-product-fact-and-conversion-qa.md) | 商品与转化 | `v0.2` / `ready` | 任一 SKU、商品页、素材、主动商品营销或首次真实接单拟放行 | [12 款商品转化证据矩阵](../assortment-12-product-conversion-evidence-matrix.md)、SKU/供应商映射、规格、图片权利、定价/库存、履约退换、移动 CTA/加购证据；矩阵中的历史 HTTP/UTM/Add-to-Cart 仅为技术入口证据 | 字段级“通过 / 阻塞 / 待确认”证据包及放行边界 | 原始证据、取得时间、SKU/版本/地区、证据强度、复核人、失效触发 | 2026-08-07 |
| [SOP-40｜发布验证与回滚](40-release-verification-and-rollback.md) | 技术与自动化 | `v0.2` / `ready` | 固定本地候选拟进入 merge、push、deploy、域名/canonical 切换，或需要回滚 | 固定 SHA、clean worktree、测试门槛、隔离非生产数据库（如需）、书面授权、回滚目标 | 单候选 release record、分状态 GO/NO-GO、受权部署 smoke 或回滚记录 | SHA、命令/退出码、build/DB 清理、BASE_URL/PID、批准引用、部署与回滚结果 | 2026-08-07 |

## 当前启用 / 就绪 / 阻塞矩阵

| SOP | 治理状态 | 当前可用范围 | 当前阻塞范围 / 原因 |
| --- | --- | --- | --- |
| `SOP-00` | **启用（`active`）** | SOP 提议、编号、五态、版本、审批、证据与索引治理 | 不阻塞内部治理；任何业务/生产动作仍沿用原权限链 |
| `SOP-10` | **就绪（`ready`，`v0.2`）** | v0.2 字段与 `/pearls/how-to-wear` 重演已通过独立治理复核 | 来源复开=`not_done`、阶段 4=`blocked`、阶段 5=`not_done`；生产与站长平台动作另授权。`ready` 不等于 `active` |
| `SOP-20` | **就绪（`ready`，`v0.2`）** | `frozen_control_v1` 的 E/F 静态交接链通过第四轮独立复核；S01 仅 preflight GO | S01 未提交/未生成；S02/S03=`CONDITIONAL HOLD`；全部下游 false、`public_release=blocked`。无生成、剪辑、排期或发布授权 |
| `SOP-30` | **就绪（`ready`，`v0.2`）** | 字段级模板通过独立治理复核；A-v2 与 12 商品矩阵仍保持可观察/技术/经营/营销分层 | 外联、采购、付款、营销解冻和商品状态改变另授权。`ready` 不等于 `active` |
| `SOP-40` | **就绪（`ready`，`v0.2`）** | fixed-SHA、gate 状态与 release record 字段通过独立治理复核 | 固定候选仍为 `local-only NO-GO`；merge/push/deploy、生产凭据、DNS/canonical 与回滚执行另授权。`ready` 不等于 `active` |

说明：`ready` 只表示 SOP 治理内容、内部重演与独立复核已齐备，不等于 `active`，也不授权任何外部、业务或生产动作。`blocked` 只描述当前没有授权或证据的动作，不等于技术失败、文件未产出或永久取消。

## 2026-07-28 统一激活审核

完整判定与 Owner 修订任务见 [SOP 激活审核](sop-activation-audit-2026-07-28.md)。四份 v0.2 均已通过独立治理复核，源文件 Status 已同步为 `ready`；SOP-00 继续为 `active`。`ready` 不构成任何外部或生产授权，统一 Git 版本治理仍待技术会话定向提交。

| SOP | 最近试运行证据 | 准入结论 | 下一内部交付 Owner |
| --- | --- | --- | --- |
| `SOP-10` | [v0.2 How-to-wear 重演](evidence/sop-10-trial-how-to-wear-2026-07-28-v0.2.md) | Pass / `ready` | 技术会话：仅定向提交治理文件；不执行阶段 4/5 外部或生产动作 |
| `SOP-20` | [v0.2 E/F 预检与第四轮 reviewer 留档](evidence/sop-20-v0.2-violet-ef-preflight-qa-2026-07-28.md) | Pass / `ready` | 技术会话：仅定向提交治理文件；保持未提交、未生成与公开阻塞 |
| `SOP-30` | [v0.2 Reviewer-ready 证据包](evidence/sop-30-v0.2-reviewer-ready-evidence-2026-07-28.md) | Pass / `ready` | 技术会话：仅定向提交治理文件；不改变商品或营销状态 |
| `SOP-40` | [v0.2 本地 release record](evidence/sop-40-trial-local-release-record-2026-07-28.md) | Pass / `ready`；候选仍 `local-only NO-GO` | 技术会话：仅定向提交治理文件；不执行 merge/push/deploy |

这些内部修订不要求先取得生产数据或外部权限；缺失外部证据可以继续登记为 `not_available` / `blocked`。但任何实际发布、部署、平台写入、付款、采购、外联或商品状态改变仍须走原授权链，不能由 `ready` 替代。

## 现行决策一致性检查

| 检查项 | 结论 | 索引边界 |
| --- | --- | --- |
| SEO/GEO 是公司唯一 P0 | 一致 | `SOP-10` 直接服务 P0；`SOP-20/30/40` 仅提供必要支持，不形成并列 P0 |
| Pinterest/TikTok 由创始人手动剪辑/发布 | 一致 | `SOP-20` 只有在创始人真实平台操作及 URL/时间证据存在时才允许记录为已发布；部门不得代发 |
| 生产动作需要明确授权 | 一致 | `SOP-10/30/40` 均把部署、canonical/DNS、外部账号、付款/采购或商品状态变化留在原授权链；本索引不放行任何动作 |
| 不新增永久运营部门 | 一致 | 秘书处/运营执行台仅维护索引和证据，不获得策略、预算或执行权限 |
| 草稿、本地实现、部署、收录、引用和访问不得混同 | 一致 | 总索引只登记源文件与证据状态，不把 SOP 产出写成业务执行结果 |

**审核结论：** 五份 SOP 与当前核心决策未发现实质冲突。`SOP-10/20/30/40` 的唯一 Owner、`v0.2` 和 `ready` 已统一，SOP-00 仍为 `active`。四份 `ready` 只完成治理准入，不等于 `active`；统一 Git 版本治理仍待定向提交，任何未来激活也不扩大执行权限。

## 索引维护规则

1. 只从对应 SOP 和 `docs/company` 权威文件读取状态；不在索引中创造业务事实或替源文件批准状态。
2. 新增或变更 SOP 时，更新导航、治理状态、复盘日和证据位置；长篇步骤留在源文件。
3. `ready`、`paused`、`retired` 或证据缺失的 SOP 不写成已执行；缺值标“待确认”。
4. 若 SOP 与 weekly priorities、decision log、metrics 或 catalog 权威状态冲突，先停止状态升级并交 CEO/创始人裁决，不用索引覆盖权威文件。
5. 本索引不保存密钥、客户个人数据、支付标识或原始客户消息。
