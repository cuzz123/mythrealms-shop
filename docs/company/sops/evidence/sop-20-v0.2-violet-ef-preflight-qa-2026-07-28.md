# SOP-20 v0.2 重演证据｜Violet Pendant E/F 投喂前 QA｜2026-07-28

## 范围与不可变边界

- **SOP：** `SOP-20 v0.2`，仍为 `draft`；本记录是静态复核，不激活 SOP。
- **项目：** `VIOLET_PENDANT_SEQUENCE_001` / `new-series-purple-stone-pendant-necklace`。
- **本次实际动作：** 只读核验、文件 hash、图像目视复核和文档一致性修正；未生成、未投喂、未剪辑、未排期、未发布、未操作账号、未 stage/commit。
- **全局执行状态（逐项核验）：** `file_exists=true` 仅表示本地文件存在；不表示已提交或已生成 Seedance 视频。`seedance_generated=false`、`submitted=false`、`edited=false`、`master=false`、`post=false`、`published=false`，`public_release=blocked`。
- **外部边界：** A-v2 `Keep` 仅为内部可观察结构锚点；不构成来源图权利、非侵权、材质、金属、规格、样品、价格、库存、履约、可售或公开发布结论。所有对外权利状态为 `not_available`。

## 控制性证据与状态

1. **控制性 A 决定：** `A-product-anchor/STRUCTURE_QA_RESULT_v2.md`（SHA-256 `39188CE3841A2664ABFAC96CC0E3C61CDE9E7930455C5DF292DC01B03E64FB30`）明确 A-v2=`Keep`，且仅限内部产品结构锚点；A-v1 保持 `Fix`。
2. **资产控制记录：** `provenance-manifest.json`（SHA-256 `A04F2DF418188EC17C7094252C344BBAA970CB5FAB5A4A459284223FC6E08E85`）将 B/C/D 记为权威内部参考，E/F 记为内部资产；拒绝的 S03 v1 不得传播，并登记 E 控制文件的冻结元数据。
3. **镜头连续性：** `镜头圣经与连续性约束包.md`（SHA-256 `B8BA73EA95F30F9447FE0D72D2E4D537A0120F0C4A6074A2AB80FE43EC4BDB7B`）规定 S02 必须从实际 `Keep` 的 S01 终帧开始、S03 必须从实际 `Keep` 的 S02 终帧开始，并引用同一冻结 E 控制版本。
4. **Obsidian 复核：** `obsidian-vault/01-资产卡/VP_A_PRODUCT_STRUCTURE_ANCHOR_001｜Violet Pendant结构锚点.md` 原有“v2 待 Keep / E/F 冻结”口径已过时；本次最小修正为 A-v2 内部 `Keep`、E/F 内部创建准备，保留 Seedance 未提交/未生成和公开阻塞。

## E 画板、投喂卡与 F 资产登记

| 对象 | 绝对路径 / SHA-256 | 来源与控制性状态 | 文件与 QA 状态 | 允许范围 |
| --- | --- | --- | --- | --- |
| E 严格三镜总导演画板 | `D:\mythrealms-shop\video-pipeline\asset-library\11-continuity-reference-packs\VIOLET_PENDANT_SEQUENCE_001\E-严格三镜总导演画板与I2V投喂卡.md`<br>`BDB7F5E4DBE2C3C9436A0C75094E2995631552C12E64656B37998BB6F52A5AFF` | 基于 A-v2 `Keep`、B/C/D 内部权威参考及镜头圣经；`control_version=frozen_control_v1`。 | `file_exists=true`；`asset_qa_status=accepted_candidate`（文档/画板层）；不是视频产物。 | `internal_prompt_and_firstframe_ready_not_generated`；不构成投喂、发布或商品授权。 |
| 最终 I2V 投喂卡 | 同一 E 文件（标题、三镜表和“可直接复制的 4s I2V 提示词”部分）；同一 SHA-256。 | S01 卡以 F_S01 为首帧；S02/S03 卡含强制替换占位符。 | `file_exists=true`；`asset_qa_status=accepted_candidate`（提示词卡层）。不得写为 `not_created`。 | S01 仅可在另行内部提交授权下使用；S02/S03 不可立即投喂。 |
| F S01 候选 | `D:\mythrealms-shop\video-pipeline\asset-library\11-continuity-reference-packs\VIOLET_PENDANT_SEQUENCE_001\F-first-frames\VP_F_S01_SHOULDER_REVEAL-v1.png`<br>`46E4F7FCA951B63AA965B30D0415C2D8653BDA95E17305F71EDD9E85E3442DDB` | manifest：`VP_F_S01_SHOULDER_REVEAL_v1`；基于 A-v2、B/C/D。 | `file_exists=true`；941×1672（9:16 竖屏）；`asset_qa_status=accepted_candidate`。 | 可作为 S01 内部首帧候选；不是 Seedance 输出或公开素材。 |
| F S02 设计候选 | `D:\mythrealms-shop\video-pipeline\asset-library\11-continuity-reference-packs\VIOLET_PENDANT_SEQUENCE_001\F-first-frames\VP_F_S02_WINDOW_STEP-v1.png`<br>`B9C97E58B2E3C2FB5FE7520553B10305BCDD961ECD659FDA75A70F18F38CCB2D` | manifest：`VP_F_S02_WINDOW_STEP_v1`；明确为设计参考，非最终 S02 输入。 | `file_exists=true`；941×1672（9:16 竖屏）；`asset_qa_status=accepted_candidate`。 | **不得立即投喂。** 必须以实际 `Keep` 的 S01 终帧替换。 |
| F S03 设计候选 | `D:\mythrealms-shop\video-pipeline\asset-library\11-continuity-reference-packs\VIOLET_PENDANT_SEQUENCE_001\F-first-frames\VP_F_S03_WINDOW_LOOKBACK-v2.png`<br>`5DE03533EE5EA4E2D74D8ECC2B3AE9523C1BF86CCBADA427094F5EDF1CECE5E5` | manifest：`VP_F_S03_WINDOW_LOOKBACK_v2`；由 v1 后背主坠错误修正。 | `file_exists=true`；941×1672（9:16 竖屏）；`asset_qa_status=accepted_candidate`。 | **不得立即投喂。** 必须以实际 `Keep` 的 S02 终帧替换。 |
| F S03 v1 rejected | `D:\mythrealms-shop\video-pipeline\asset-library\11-continuity-reference-packs\VIOLET_PENDANT_SEQUENCE_001\F-first-frames\rejected\VP_F_S03_WINDOW_LOOKBACK-v1-rejected-back-pendant.png`<br>`CAC2CCF59B12832BA50267D75F19CBC1BA5CE22F433AEAA650D14927F110B363` | manifest `rejected_assets`：主坠错误出现在背部。 | `file_exists=true`；`asset_qa_status=rejected`。 | 永不作为投喂、连续性或发布输入。 |

## 逐镜投喂前 QA

| 检查项 | S01 | S02 | S03 |
| --- | --- | --- | --- |
| 提示词开头 | **通过：** 首五项均为存在的 `@` 绝对路径，第一项为 F_S01。 | **条件通过：** 第一项是 `@D:\REPLACE_WITH_ACTUAL_KEEP_S01_END_FRAME.png` 占位符，当前不存在且必须替换。 | **条件通过：** 第一项是 `@D:\REPLACE_WITH_ACTUAL_KEEP_S02_END_FRAME.png` 占位符，当前不存在且必须替换。 |
| 9:16 / 4s | 通过：卡中明确 `9:16`、`4s`，F 为 941×1672。 | 条件通过：卡中明确 `9:16`、`4s`；真实终帧替换后再核验。 | 条件通过：卡中明确 `9:16`、`4s`；真实终帧替换后再核验。 |
| 连续性 | 通过：单链单坠、同一虚构成年身份、墨紫无袖上衣、石台左前/窄窗右后、右后冷/左前弱暖光；唯一动作是左手放下。 | 条件通过：只走一步、手保持放下、不得重演 S01；必须继承真实 S01 `Keep` 终帧。 | 条件通过：只小幅回望、手保持放下、不得走路或触链；必须继承真实 S02 `Keep` 终帧。 |
| 禁用项 | 通过：不含材质、价格、库存、配送、低敏、耐久、授权或商品功效承诺；禁止额外首饰、双链/多坠、长对称吊环、完整亮内圈、文字、logo、水印、音乐或转场。 | 条件通过：同一禁用项已写入；不可因占位符而提交。 | 条件通过：同一禁用项已写入；rejected S03 v1 已明确禁止。 |
| 输出命名 | 通过（规划层）：`VP_S01_SHOULDER_REVEAL_T01.mp4`，但该输出不存在。 | 条件通过（规划层）：`VP_S02_WINDOW_STEP_T01.mp4`，输出不存在。 | 条件通过（规划层）：`VP_S03_WINDOW_LOOKBACK_T01.mp4`，输出不存在。 |
| 结论 | **GO（仅提示词/首帧预检）：** 可复制，且只在创始人另行内部提交授权后使用。`submitted=false`、`seedance_generated=false`。 | **CONDITIONAL HOLD：** 等待实际 `Keep` 的 S01 终帧，当前不得投喂。 | **CONDITIONAL HOLD：** 等待实际 `Keep` 的 S02 终帧，当前不得投喂。 |

## 可复制 S01 内部投喂文本（仅预检 GO；未提交）

```text
@D:\mythrealms-shop\video-pipeline\asset-library\11-continuity-reference-packs\VIOLET_PENDANT_SEQUENCE_001\F-first-frames\VP_F_S01_SHOULDER_REVEAL-v1.png @D:\mythrealms-shop\video-pipeline\asset-library\11-continuity-reference-packs\VIOLET_PENDANT_SEQUENCE_001\A-product-anchor\generated-reference-v2\VP_A_PRODUCT_STRUCTURE_ANCHOR-v2.png @D:\mythrealms-shop\video-pipeline\asset-library\11-continuity-reference-packs\VIOLET_PENDANT_SEQUENCE_001\B-identity\VP_B_IDENTITY_LEFT45-v1.png @D:\mythrealms-shop\video-pipeline\asset-library\11-continuity-reference-packs\VIOLET_PENDANT_SEQUENCE_001\C-wardrobe-placement\VP_C_WARDROBE_FRONT-v1.png @D:\mythrealms-shop\video-pipeline\asset-library\11-continuity-reference-packs\VIOLET_PENDANT_SEQUENCE_001\D-scene-master\VP_D_SCENE_MASTER_WINDOW_CORRIDOR-v1.png 9:16 竖屏，4s。保持首帧同一虚构成年女性、墨紫无袖上衣、暮色石灰岩窗廊与右后冷/左前弱暖光。镜头只做极轻向右漂移；左手从锁骨旁缓慢放下，胸前单一小主坠完整露出，双脚不移动。单条多色珠链、短顶部延长/端环、短紧凑连接、浅紫不规则中心与局部点状内弧均不变。不要额外首饰、第二条链/主坠、长对称吊环、完整亮内圈、文字、logo、水印、音乐或转场。
```

该文本只可用于内部提交前的复制和人工 QA；其不含公开商品承诺，也不改变 `submitted=false`、`seedance_generated=false` 或 `public_release=blocked`。

## Description / BGM QA

- **Description：** `A quiet turn toward the window. Which detail did you notice first?` 为中性视觉文案，只有一个互动 CTA，未含材质、价格、库存、配送、促销或疗效承诺；作为草稿文案可交给创始人审核，但不是已批准发布包，`public_release=blocked`。
- **BGM：** 仅有搜索词，无具体曲目、许可或平台可用权利证据；`audio_rights_status=not_available`。**不可**作为可直接发布的音频资产交付，须由创始人在目标平台内另行确认可用权利。

## 最终判定与停止条件

`internal_prompt_and_firstframe_ready_not_generated` 保持不变。S01 仅获“提示词和首帧预检 GO”，不是提交或生成 GO；S02/S03 仍为条件审核，必须等待前一镜真实 `Keep` 终帧。任一身份、服装、单链单坠、前胸佩戴、石台/窄窗位置、光向、动作顺序或禁用项漂移，均为 `Re-roll`，且不得向后镜传播。公开发布继续阻塞。

## 独立 Reviewer 留档

**Reviewer：** CEO / 总控（与内容与品牌 Owner 分离）
**复核日期：** 2026-07-28
**判定：** `Fix`；不得登记 `ready_candidate`。

已确认的项目：

1. A-v2 结构 QA、manifest 与镜头圣经的实际 SHA-256 分别匹配本文所列 `39188CE3…4FB30`、`A04F2DF4…08E85`、`B8BA73EA…BDB7B`；E 控制文件匹配 `BDB7F5E4…A5AFF`。
2. 三张 accepted F 与一张 rejected F 均存在，尺寸为 941×1672，实际 SHA-256 与本文及 manifest 登记一致；rejected S03 v1 不得传播。
3. S01 只达到 preflight GO，`submitted=false`、`seedance_generated=false`；S02/S03 所需真实 `Keep` 终帧占位路径均不存在，因此继续 `CONDITIONAL HOLD`。
4. 项目目录没有 mp4 或音频产物；`edited=false`、`master=false`、`post=false`、`published=false` 与 `public_release=blocked` 未被越级。BGM 仅为搜索词，`audio_rights_status=not_available`。

冻结完成：`E-严格三镜总导演画板与I2V投喂卡.md` 已冻结为 `frozen_control_v1`；`frozen_at=2026-07-28T14:38:58.7817212+08:00`，Owner=内容与品牌，`file_size_bytes=8310`，SHA-256=`BDB7F5E4DBE2C3C9436A0C75094E2995631552C12E64656B37998BB6F52A5AFF`。冻结后禁止修改该文件正文；evidence、manifest 与镜头圣经均引用该同一版本。

## 第四轮独立 Reviewer 留档（2026-07-28）

- **Reviewer：** CEO / 总控（独立于内容与品牌 Owner）
- **复核对象：** SOP-20 `v0.2 / draft`、本证据包、`provenance-manifest.json`、`镜头圣经与连续性约束包.md` 及实际 E 画板文件。
- **判定：** **Pass / `ready_candidate`**。本结论只取代第三轮因 E 文件指纹不一致而作出的 `Fix` 判定；第三轮记录继续保留为历史审计证据。源 SOP Status 仍为 `draft`，不自动变更为 `ready` 或 `active`。
- **冻结控制核验：** 实际 E 文件 SHA-256 为 `BDB7F5E4DBE2C3C9436A0C75094E2995631552C12E64656B37998BB6F52A5AFF`、大小为 `8310` bytes；manifest 与镜头圣经均登记 `control_version=frozen_control_v1`、`frozen_at=2026-07-28T14:38:58.7817212+08:00`、Owner=内容与品牌和相同指纹。旧 hash 前缀 `95DD7EBA` 在 SOP/evidence 与该连续性包范围内为 `0` 处；新完整 hash 共 `4` 处，限定在本证据包两处、manifest 一处、镜头圣经一处，引用范围与控制链一致。
- **执行状态核验：** S01 仅为 preflight GO，`submitted=false`、`seedance_generated=false`；S02/S03 因真实 `Keep` 终帧占位路径不存在继续 `CONDITIONAL HOLD`。`edited=false`、`master=false`、`post=false`、`published=false`，`public_release=blocked`；BGM 仍仅是搜索词，`audio_rights_status=not_available`。
- **版本治理边界：** `ready_candidate` 仅表示 v0.2 治理字段和本地静态证据链可执行。正式 `ready` 仍等待四份 SOP 的统一 Git 版本治理；本留档不授权生成、投喂、剪辑、发布、外部平台、付款、采购、部署或商品状态动作。

源 SOP、evidence 与相关治理文件当前仍未纳入 Git 跟踪；即使 hash 修正并通过复核，正式 `ready` 仍等待统一版本治理。本结论不授权生成、投喂、剪辑、发布或任何外部动作。
