# SOP-20 内部试运行｜Violet Pendant｜2026-07-28

## 试运行边界

- **适用 SOP：** `SOP-20 Content & Video Handoff v0.1`，`status=draft`；本记录不构成 SOP 激活或发布授权。
- **内容 ID：** `VIOLET_PENDANT_SEQUENCE_001`
- **对应商品映射：** `new-series-015` / `new-series-purple-stone-pendant-necklace`
- **试运行状态：** `internal_trial_complete_blocked`；没有任何内容状态获准升级。
- **执行 Owner：** 内容与品牌（SOP 唯一 Owner）。本次仅检查既有证据与状态，不生成图片或视频、不投喂、不剪辑、不排期、不发布，也不操作外部账号。
- **渠道 / CTA / URL / UTM：** `not_available`。没有编造发布包字段，也没有形成外部导流。

## 输入链路与证据优先级

本试运行按现行事实将链路记为：**A = Fix；B/C/D = 已 QA；E/F = 暂停**。当证据冲突时，采用时间更晚、对 A 的结构接受与下一门槛有明确结论的 Product QA 记录。

| 阶段 | 既有状态 | 控制性证据 | 试运行判定 |
| --- | --- | --- | --- |
| A Product anchor | `Fix` | `A-product-anchor/STRUCTURE_QA_RESULT.md`：A v1 不接受为最终连续视频结构锚点，要求 Image2 A v2 与 Product QA `Keep`。 | 不可作为结构锁；阻止 E、F 和视频生成。 |
| B Identity | `accepted` | `provenance-manifest.json` 中 `VP_B_IDENTITY_CONTACT_SHEET_v1` 与四个派生视图，`qa_status=accepted`。 | 可作**内部**人物连续性参考；不构成商品、首帧或公开发布批准。 |
| C Wardrobe / placement | `accepted` | manifest 中 `VP_C_WARDROBE_CONTACT_SHEET_v1` 与两个派生视图，`qa_status=accepted`。 | 可作**内部**服装/位置参考；不构成商品、首帧或公开发布批准。 |
| D Scene master | `accepted` | manifest 中两张 D 参考图，`qa_status=accepted`。 | 可作**内部**场景/光线参考；不构成商品、首帧或公开发布批准。 |
| E Director board | `paused` | manifest `next_gate.before_gate` 明确写明不得生成 E。 | `not_available`，不得创建或升级。 |
| F First frames | `paused` | manifest `next_gate.before_gate` 明确写明不得生成 F。 | `blocked_first_frame`，不得创建或升级。 |

`镜头圣经与连续性约束包.md` 中的 A 源 JPG 视觉 QA 仅说明源图的视觉锚点用途，不能覆盖上述 A v1 的后续 Product QA `Fix`。manifest 顶部也已记录 A v1 等待 Image2 v2；本试运行未将 B/C/D 的通过错误地推定为 A、E、F 或公开视频通过。

## SOP-20 状态升级试验

| SOP 阶段 | 所需状态 / 最低证据 | 现有证据 | 结论 |
| --- | --- | --- | --- |
| 1. Brief | `brief_ready`：英文文案、画面 brief、单一 CTA、URL/UTM、范围 | 仅有内部连续性包；无已批准文案、CTA、URL 或 UTM。 | 保持 `brief_draft`。 |
| 2. Facts / 禁用词 | `fact_checked`：来源、允许事实、禁用承诺、复核者 | 有产品结构修正与部分禁用边界，但无完整可发布事实清单或独立事实复核。 | `blocked_facts`。 |
| 3. Asset rights | `asset_candidate`：来源、生成任务、路径/hash、权利状态、身份映射与限制 | B/C/D 有生成任务、路径、hash 与内部 QA；A 的来源图及所有素材没有对外商用权/商品导流授权闭环。 | `blocked_rights`。 |
| 4. First frame | `first_frame_qc`：已接受的结构锚点、首帧、映射与拒绝标准 | A v1 为 `Fix`，F 未创建。 | `blocked_first_frame`。 |
| 5. Continuity | `continuity_ready`：已接受 A、E/F 映射与连续性检查 | B/C/D 只能支持参考；E/F 暂停。 | `blocked_continuity`。 |
| 6. Generation | `clip_generated`：明确授权、锁定输入、任务/日期/prompt、输出 hash 与 QA | 无生成授权，且 SOP/manifest 均禁止在 A v2 `Keep` 前生成。 | `generation_not_authorized`。 |
| 7. Rough cut | 片段、时间线、连续性/文案 QA | 不存在片段。 | `not_available`。 |
| 8. Master | 已接受粗剪、导出与技术 QA | 不存在粗剪。 | `not_available`。 |
| 9. Post package | 已接受 Master、单一 CTA、URL/UTM、发布前 QA | 不存在 Master 或发布包。 | `blocked_post`。 |
| 10. Founder manual publish | 创始人手动发布证据 | 无发布，也无授权。 | `not_available`。 |
| 11. Record / data | URL、时间、平台数据、复盘 | 无发布。 | `not_available`。 |

**状态升级结论：** B/C/D 的 `accepted` 仅在各自的内部参考资产层成立。SOP-20 的“不跳级”规则可执行：缺失 A v2 `Keep`、E/F、事实/权利和发布包任一项，均不能进入片段、粗剪、Master、Post 或发布。

## 证据字段核验

| 字段 | 本次可核验值 | 结果 / 边界 |
| --- | --- | --- |
| B/C/D 文件存在性与 hash | 读取 `provenance-manifest.json`，对 10 个 B/C/D 主文件及派生文件执行存在性和 SHA-256 比对。 | `10/10` 存在且 hash 匹配。 |
| A v1 输出 | `A-product-anchor/generated-reference-v1/VP_A_PRODUCT_STRUCTURE_ANCHOR-v1.png`；SHA-256 `B433732B03E6619C0D24989C5AE681884B5A157287B9A1B39907EBA83B3ED8AF`。 | 文件/manifest hash 可核验；结构接受状态仍为 `Fix`。 |
| B/C/D 生成溯源 | manifest 记录了生成任务 ID、精确 prompt、输出路径、SHA-256、内部 QA 备注和 reviewer。 | 对内部可追溯性充分；不是第三方授权或非侵权保证。 |
| 商品身份 | `new-series-purple-stone-pendant-necklace` 只在 A/source-QA 与项目映射中出现。 | 未获得样品、材质、价格、库存、履约或对外导流批准。 |
| 禁用商品事实 | 任何公开文案均不得写未核验材质、价格、库存、配送、耐久、低敏/防过敏或功效承诺。 | 本次无文案与发布包，因此未触发可发布审核。 |
| Founder 发布与数据 | `not_available` | 无 URL、发布时间、平台数据或发布截图。 |

## 角色边界试验

| 角色 | 本次允许的职责 | 本次实际动作 | 越界检查 |
| --- | --- | --- | --- |
| 内容与品牌 | 维护 brief/事实/禁用词、资产状态、QA 记录与交接。 | 建立这份内部试运行证据记录。 | 通过：未创作、未生成、未投喂、未发布。 |
| Image2 资产工坊 | 在授权且门槛满足后，提供 A/E/F 等生成资产、溯源和视觉 QA。 | 无新增动作；A v2 仍待其生成和 QA。 | 通过：没有将本次审计冒充为 Image2 生成或批准。 |
| Seedance 总导演 | 在连续性已就绪且有授权后，处理片段/粗剪/连续性。 | 无动作。 | 通过：没有投喂或生成视频。 |
| 创始人 | 最终人工发布，登记 URL、时间和数据。 | 无动作、无证据。 | 通过：未假定发布或授权。 |

## 停止条件试验

以下停止条件均被证据明确触发，且本次遵守：

1. **A v1 = Fix：** 未获得 A v2 的绝对路径、生成溯源与 Product QA `Keep` 前，停止 E、F、Seedance 与任何视频制作。
2. **素材/对外权利未闭环：** B/C/D 内部生成溯源不能推定商品页导流、公开使用或第三方权利已确认；停止 Post 和发布。
3. **发布字段缺失：** CTA、目标 URL/UTM、英文文案和发布前 QA 均为 `not_available`；停止排期与发布。
4. **下游不存在：** 无片段、粗剪、Master；停止将参考图错误升级为成片。
5. **优先级边界：** Pinterest/TikTok 为 P1，SEO/GEO 为 P0；本次是有限证据审计，未占用生成或账号操作资源。

## SOP 缺口与建议（不在本次修改 SOP）

1. **证据冲突优先级需字段化。** SOP 要求“新证据”才能解锁，但未规定当概览 manifest 与后续详细 QA 不一致时，哪个记录为控制性证据。建议增加 `controlling_evidence_path`、`supersedes` 和 `decision_timestamp`。
2. **内容级状态与阶段级状态需分开。** 当前 B/C/D 可为 `accepted`，而内容整体仍应阻塞；建议在交接卡固定 `asset_status`、`content_status` 与 `public_release_status` 三个字段，防止绿色资产被误读为可发布。
3. **权利状态需要强制三态。** 应明确区分 `internal_project_asset_provenance_recorded`、`third_party_rights_not_verified`、`public_use_authorized`；仅有文件 hash/生成任务不应满足公开门槛。
4. **A 的复核签名需标准化。** `Fix` 已清楚，但应要求每次 A 修订包含 `version`、修复项逐条结果、Product QA `Keep/Fix`、reviewer 和日期，才可解锁 E/F。
5. **无发布包时的 CTA/URL 处理需模板化。** 目前可写 `not_available`，但 SOP 模板可要求显式记录“不得临时补填/不得发布”，避免后续手工发布绕过单一 CTA 与 UTM QA。
6. **连续性对象映射需可机读。** E/F 之前应有每镜 `source_frame`、`end_frame`、身份/服装/场景引用、拒绝标准和 hash 的表，而不是只依赖叙述性镜头圣经。

## 试运行结论

SOP-20 的状态升级、角色边界、证据字段与停止条件在本链路中**可执行且成功阻止越级**：B/C/D 的内部 QA 没有被误用为 A、E/F、视频或公开发布通过。下一步仍仅限在 Image2 交付 A v2 并获得 Product QA `Keep` 后，由对应角色重新开启 E/F 门槛评审；在此之前，本内容保持 `internal_trial_complete_blocked`，不得投喂、生成、发布或导流。
