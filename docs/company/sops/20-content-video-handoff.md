# 20｜内容生产与短视频交接 SOP

| 治理元数据 | 当前值 |
| --- | --- |
| 唯一 Owner | 内容与品牌 |
| 版本 | v0.2 |
| Status | `ready` |
| 独立 reviewer | CEO / 总控（与内容与品牌 Owner 分离；仅作内部 SOP 治理复核，不获得生成、发布或账号权限）。 |
| review_date | 2026-08-07 |
| 内部激活条件 | 仅完成既有阻塞链路的静态复核：控制性证据、三层状态、权利三态、A 修订复核、CTA/UTM 缺失处理和可机读连续性映射均已登记；不得生成、投喂、剪辑、排期、发布或操作账号。 |
| `ready` 批准依据 | [2026-07-28 activation audit](sop-activation-audit-2026-07-28.md) 与 [SOP-20 v0.2 第四轮 reviewer evidence](evidence/sop-20-v0.2-violet-ef-preflight-qa-2026-07-28.md)；CEO / 总控内部治理复核。 |
| `ready` 边界 | `ready` 不等于 `active`，不构成创始人、商品、素材商用、生成、投喂、剪辑、账号操作或公开发布授权。 |

**状态：内部 SOP；不授权生成、发布、账号操作、广告或商品状态变更。**
**优先级：** SEO/GEO 是公司唯一 P0。Pinterest 与 TikTok 是 P1，由创始人手动剪辑/发布；本 SOP 只保持候选素材、QA 和真实记录，不得抢占 P0 的人员、审批或交付窗口。

## 1. 核心规则

1. 每条内容只能有一个明确 CTA；CTA、目标 URL/UTM 和画面主体必须能对应同一条登记记录。
2. 任何状态升级都需要本 SOP 指定的可复核证据。没有证据，状态保持原样并记为 `not_available`、`blocked` 或 `needs_review`，不得按推断补齐。
3. 素材可用不等于商品可导流；项目生成资产不等于第三方授权、非侵权结论或公开商用许可。
4. 不得写未经核验的材质、天然属性、金属、低敏/防过敏、耐久/不褪色、价格、库存、折扣、配送、到货、退换或履约承诺。画面可见描述也不得外推为商品事实。
5. 只有创始人完成真实的手动平台操作，且平台 URL、发布时间和可见状态被登记后，内容才可记为 `published`。提示词、首帧、生成片段、粗剪、导出文件或排期都不是发布证据。
6. **控制性证据优先级：** 对同一对象的冲突记录，依次采用（a）较晚且逐项给出 `Keep` / `Fix` / `blocked` 决定的 QA 记录；（b）其明确引用的版本化 provenance；（c）概览 manifest 或叙述性画板。控制性记录必须填写 `controlling_evidence_path`、`decision_timestamp`、`supersedes`（无则 `not_available`）；概览状态不得覆盖较晚的控制性决定。
7. **三层状态不可互推：** 每条记录分别维护 `asset_status`、`content_status`、`public_release_status`。例如 B/C/D 可为内部 `accepted`，而内容仍可为 `blocked_continuity`、公开状态仍为 `not_publish_approved`；任一较低层通过均不得自动升级较高层。
8. **权利三态：** 仅可使用 `internal_project_asset_provenance_recorded`、`third_party_rights_not_verified`、`public_use_authorized`。生成任务、文件 hash 或项目资产归属最多支持第一态，不能推定第二态已排除或第三态已获得；未知必须写 `not_available` 并阻止公开发布。
9. **A 修订与复核：** A 的任何 `Fix` 必须锁定下游 E/F 与视频生成。A 的后续版本只有在记录 `anchor_version`、`fix_items`、`fix_result_by_item`、`product_qa_decision`（`Keep` / `Fix`）、`reviewer`、`review_date`、绝对路径、provenance 路径及 hash 后，才可重新评审 E/F。`Keep` 仅解除指定门槛，不授予生成、发布或公开使用权。
10. **CTA/UTM 缺失：** `single_cta` 或 `target_url_and_utm` 缺失时必须填 `not_available` 和 `missing_field_stop=true`；不得临时补填、排期或发布。仅在两字段均经 QA 且与同一内容记录匹配时，才可进入 `post_ready` 评审。

## 2. 角色与权限边界

| 角色 | 可以做 | 必须交接的证据 | 不可以做 |
| --- | --- | --- | --- |
| 内容与品牌 | 写 brief、英文文案、事实/禁用词表、单一 CTA、URL/UTM 候选；维护内容登记和发布后记录。 | 事实来源、禁用词检查、素材 ID/路径、文案版本、CTA/UTM QA。 | 虚构商品事实、放宽权利边界、把候选写为已发布、操作外部账号。 |
| Image2 资产工坊 | 在已批准的内部 brief 下准备首帧/静帧候选、保留版本化输出、源参考和哈希。 | source reference、生成任务/日期/提示词或任务证据、输出路径/哈希、画幅、可见结构 QA、权利状态。 | 以生成记录声称第三方授权/非侵权；删除源证据；替换商品身份；直接公开发布。 |
| Seedance 总导演 | 制作三镜/多镜画板、连续性锁、I2V 提示词、逐镜验收表和剪映交接。 | 画板映射、首帧精确路径、人物/服装/场景/商品连续性规则、每镜输入与输出、拒绝项。 | 在无证据时把画板写成成片；擅自投喂、自动生成、剪辑或发布；突破商品/权利/禁用词门槛。 |
| 创始人 | 选择已通过候选，手动执行获授权的平台生成/剪辑/发布；确认最终 URL、时间、平台可见状态和可见数据。 | 平台 URL、实际发布时间与时区、最终文案/素材版本、目标 URL、可见数据或明确 `not_available`。 | 用无 QA、错品错链、权利不清或含禁用承诺的内容发布；把内部测试当公开授权。 |

## 3. 状态流水线与交接门槛

| 阶段 | 允许状态 | 主责 | 进入条件 | 必须留存的交接证据 | 不满足时 |
| --- | --- | --- | --- | --- | --- |
| 1. Brief | `brief_draft` → `brief_ready` | 内容与品牌 | 内容主题、渠道、单一 CTA 已提出。 | 英文标题/文案或脚本、画面 brief、CTA、目标 URL/UTM 候选、商品/非商品范围。 | 保持 `brief_draft`。 |
| 2. 事实与禁用词 | `fact_checked` / `blocked_facts` | 内容与品牌 | 已读取对应商品/品牌权威资料。 | 每项可写事实的来源；禁用词清单；未确认项明确为不可写。 | 标 `blocked_facts`，不得进入制作。 |
| 3. 素材来源与权利 | `asset_candidate` / `blocked_rights` | Image2 资产工坊 + 内容与品牌 | 素材 ID/路径存在。 | 来源、参考图/任务证据、权利字段或 `not_available`、文件哈希、商品身份映射、商用限制。 | 标 `blocked_rights`；不得以“项目资产”推定可公开。 |
| 4. 首帧 | `first_frame_qc` / `blocked_first_frame` | Image2 资产工坊 | 阶段 2–3 通过内部审校。 | 9:16/画幅、文件路径/哈希、可见商品结构、无文字/水印/错品、首帧与 brief 对应。 | 标 `blocked_first_frame` 并记录缺口。 |
| 5. 连续性 | `continuity_ready` / `blocked_continuity` | Seedance 总导演 | 首帧已通过内部 QA。 | 逐镜 board mapping；人物、服装、场景、光线、商品结构、动作账本；每镜拒绝项。 | 不投喂；标 `blocked_continuity`。 |
| 6. 生成片段 | `clip_generated` / `generation_not_authorized` | 创始人，或另有书面授权的执行者 | 明确生成授权；逐镜输入已锁定。 | 真实生成任务/日期、输入首帧哈希、提示词版本、输出路径/哈希、逐镜 QA。 | 无真实输出时保留 `continuity_ready`，不得写 `clip_generated`。 |
| 7. 粗剪 | `rough_cut_ready` | 创始人 | 所用片段均有阶段 6 证据。 | 粗剪路径/哈希、镜头顺序、时长、转场/BGM 来源与限制、禁用词复查。 | 保持 `clip_generated`；不得称正式成片。 |
| 8. Master | `master_approved` | 创始人 | 粗剪已逐镜验收。 | 最终文件路径/哈希、画幅/时长、最终文案、事实/权利/连续性/禁用词 QA 结果。 | 保持 `rough_cut_ready` 或标 `blocked_master`。 |
| 9. Post 包 | `post_ready` | 内容与品牌 + 创始人 | Master 已批准，且渠道要求已核。 | 最终标题/描述/脚本、单一 CTA、准确目标 URL/UTM、素材版本、平台适配 QA。 | 不得排期或发布；标 `blocked_post`。 |
| 10. 创始人手动发布 | `published` | 创始人 | `post_ready` 且另有发布权限。 | 平台 URL/帖子 ID（如可见）、实际发布时间和时区、最终文案、最终 URL、可见状态截图或等效平台证据。 | 仅保留 `post_ready`；部门不得代发。 |
| 11. URL/时间/数据登记 | `recorded` | 内容与品牌 + 创始人 | 已有真实发布证据。 | 平台 URL、发布时间、UTM 最终落地 URL、可见展示/点击等聚合数据及读取时间；没有数据则 `not_available`。 | 保持 `published`，不得估算数据。 |

状态必须按表中顺序流转；不得跳级。`blocked_*` 解除时，必须增加新的可复核证据并记录解除人、日期和原因。

### 3.1 可机读连续性映射

阶段 5 及以后，每条镜头必须以同一内容记录中的下列字段保存；任何字段缺失均为 `blocked_continuity`，不得投喂或生成：

```text
continuity_map_id:
shot_id:
source_frame_asset_id_and_absolute_path:
source_frame_hash:
end_frame_asset_id_and_absolute_path: not_available | value
end_frame_hash: not_available | value
anchor_version:
identity_reference_asset_id_and_hash:
wardrobe_reference_asset_id_and_hash:
scene_light_reference_asset_id_and_hash:
product_structure_reference_asset_id_and_hash:
allowed_action:
rejection_criteria:
controlling_evidence_path:
decision_timestamp:
```

**静态复核样例（非生成授权）：** `VIOLET_PENDANT_SEQUENCE_001` 的 A-v1 保持 `Fix`（`A-product-anchor/STRUCTURE_QA_RESULT.md`）；控制性结构记录已更新为 A-v2 `Keep`（`A-product-anchor/STRUCTURE_QA_RESULT_v2.md`），且该 `Keep` **仅**接受内部 A 产品结构锚点。B/C/D 继续为内部权威参考资产 QA `accepted`。依 Obsidian 制作台的权威状态，E/F 与最终投喂卡为 `authorized_for_internal_creation`，但所有 E/F 产物和实际投喂仍为 `not_created` / `not_available`；`public_release_status` 保持 `blocked`。该样例只能验证字段、权限分层和停止条件，不构成商品事实、外部权利、生成、投喂或发布授权。

## 4. 发布前最小 QA

每条 Pinterest/TikTok 候选须完成以下登记：

- 身份：SKU/slug/目标页或明确“非商品内容”；画面、文案、链接三者一致。
- 权利：来源、生成溯源、第三方参考边界、商用状态；未知即 `not_available`。
- 事实：仅保留已证实或纯可见描述；逐项检查禁用承诺。
- 视觉：文件存在、平台画幅、无错品/多件/缺件/水印/文字/Logo 转移；人物与连续性符合画板。
- 链接：只保留一个 CTA；URL/UTM 完整、可访问且映射正确。链接存在不等于商品营销解冻。
- 发布：仅创始人手动操作；平台 URL、时间、最终文案和素材版本必须回填。

## 5. P1 与 SEO/GEO P0 的调度规则

- SEO/GEO 的来源证据、内部链接、Draft Pack、现有 URL 本地验收和发布门槛始终优先。
- Pinterest/TikTok 只在不影响 P0 承诺与验收的空档处理；不以“素材已齐”要求抢占 P0 审核、开发或创始人决策。
- 自动剪辑、自动投喂和部门账号发布处于暂停状态，除非创始人另行明确授权。
- 本 SOP 是记录与交接机制，不构成发布、部署、广告、付款、采购、外联、商品解冻或状态修改授权。

## 6. 最小交接记录模板

```text
content_id:
channel: Pinterest | TikTok
asset_status:
content_status:
public_release_status:
owner:
reviewer: not_available | role + name
review_date: not_available | YYYY-MM-DD
brief_version:
facts_and_prohibited_claims:
asset_id_and_absolute_path:
source_and_rights_status: internal_project_asset_provenance_recorded | third_party_rights_not_verified | public_use_authorized | not_available
controlling_evidence_path:
decision_timestamp:
supersedes: not_available | prior evidence path
anchor_version: not_available | value
fix_items: not_available | itemized list
fix_result_by_item: not_available | itemized list
product_qa_decision: not_available | Keep | Fix
first_frame_or_master_hash:
board_or_clip_mapping:
single_cta:
target_url_and_utm:
missing_field_stop: true | false
qa_result_and_missing_evidence:
founder_manual_publish_evidence: not_available | platform URL + time + timezone
post_publish_data: not_available | source + read time + aggregate values
```
