# 石中花影佩戴动作连续性改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让白贝母花耳环从石台、手部、耳垂到最终成对落台均有可见物理因果，消除任何凭空出现。

**Architecture:** 保持既有 8 段、每段 4 秒、9:16 的结构。重排 S03–S08 的状态合同，替换关键首帧，并把同一动作规则写入主分镜、Seedance 提示词、首帧说明与资产清单。

**Tech Stack:** Markdown、JSON、PNG 首帧资产、Seedance 2.0 全能模式提示词。

## Global Constraints

- 全片保持 8 段 × 4 秒、9:16、写实石灰岩艺术馆、无文字、无 Logo、无包装。
- S01–S03 不出现耳环；S04 起耳环必须始终有石台、手或耳垂作为可见载体。
- S05 必须完整出现靠近耳垂、扣合、手指松开的动作；S06 只展示已佩戴状态。
- S08 内先放下一只耳环，再由同一只手放入第二只；禁止任何帧内数量突增。
- 不覆盖用户工作树中无关的未提交内容；仅提交本计划列出的文件。

---

### Task 1: 重写镜头合同与生成提示词

**Files:**
- Modify: `video-pipeline/work/2026-07-19-white-shell-flower-gallery/limestone-gallery-master-storyboard.md`
- Modify: `video-pipeline/work/2026-07-19-white-shell-flower-gallery/seedance-prompts.md`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-07-19-white-shell-flower-wear-action-design.md`
- Produces: S03–S08 的统一产品状态合同，供首帧 README 和资产清单引用。

- [ ] **Step 1: 替换故事脊柱和连续性圣经**

写明“模特从主石台取一只耳环、在画内扣上、手离开后风带开发丝”；状态顺序为 S01–S03 无耳环、S04 台上一只、S05–S07 单耳、S08 两次放置后成对。

- [ ] **Step 2: 替换 S03–S08 分段合同**

S03 使用人物中远景；S04 用 50mm 拿起石台上的一只耳环；S05 用 85mm 展示靠近耳垂、扣合、松手；S06 用 85mm 显露已佩戴单耳；S07 保持该耳环的 100mm 材质微距；S08 用 100mm 先放下一只、再由同一只手放第二只。

- [ ] **Step 3: 重写 S03–S08 Seedance 全能模式提示词**

所有引用路径保持绝对路径。S04 引用环境、人物、产品；S05 引用人物、产品、动作接触图；S06、S07 明确继承 S05 验收末帧；S08 引用环境、花雕、产品，并明确两次可见放置的时序。

- [ ] **Step 4: 执行提示词检查**

```powershell
Select-String -Path 'video-pipeline/work/2026-07-19-white-shell-flower-gallery/seedance-prompts.md' -Pattern '凭空|突然出现|增殖|扣合|放下第二只'
```

预期：S05 有扣合描述，S08 有第二次放置描述，所有产品状态变化均禁止凭空出现。

- [ ] **Step 5: 提交**

```powershell
git add -- video-pipeline/work/2026-07-19-white-shell-flower-gallery/limestone-gallery-master-storyboard.md video-pipeline/work/2026-07-19-white-shell-flower-gallery/seedance-prompts.md
git commit -m "docs: stage physical earring reveal actions"
```

### Task 2: 替换关键首帧并更新首帧说明

**Files:**
- Modify: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/S03.png`
- Modify: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/S04.png`
- Modify: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/S05.png`
- Modify: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/S06.png`
- Modify: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/S08.png`
- Modify: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/overview.png`
- Modify: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/README.md`

**Interfaces:**
- Consumes: Task 1 产品状态合同与既有环境、人物、产品参考资产。
- Produces: 8 张与提示词契合的正式首帧。

- [ ] **Step 1: 生成与替换首帧**

S03 不把裸耳作为特写；S04 的单只耳环从第一帧起位于主石台；S05 的手、耳垂与单只耳环同时可见；S06 只允许一只已佩戴耳环；S08 只显示石台上的第一只与手带入第二只的起始状态。

- [ ] **Step 2: 重建总览**

以正式 S01–S08 生成 2 列 × 4 行 `overview.png`，不裁断手、耳环或石台。

- [ ] **Step 3: 更新 README**

将 S03、S04、S05、S06、S08 的描述与交接规则替换为“远景、取花、扣上、风中显露、两次落台”。

- [ ] **Step 4: 执行文件检查**

```powershell
$d='video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames'
if ((Get-ChildItem $d -Filter 'S*.png').Count -ne 8) { throw 'Expected 8 first frames' }
if (-not (Test-Path "$d/overview.png")) { throw 'Missing overview' }
```

预期：命令无错误；视觉检查确认 S04 台上一只、S05 扣上、S06 单耳、S08 手带第二只入画。

- [ ] **Step 5: 提交**

```powershell
git add -- video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames
git commit -m "assets: stage physical earring reveal frames"
```

### Task 3: 登记资产状态并验收整包

**Files:**
- Modify: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/asset-pack-manifest.json`
- Modify: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/README.md`
- Modify: `video-pipeline/asset-library/obsidian-vault/03-参考拆解/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001｜石中花影分镜.md`

**Interfaces:**
- Consumes: Task 1 合同与 Task 2 图像资产。
- Produces: 可在资产库、Obsidian 和 Seedance 工作流追踪的佩戴动作状态。

- [ ] **Step 1: 更新 manifest 的 `reveal_rule`**

改为：`S01-S03 no jewelry; S04 one earring begins visibly on the main pedestal; S05 visibly fastens it to one ear; S06-S07 retain that same single worn earring; S08 visibly places the second earring beside the first.`

- [ ] **Step 2: 更新视频包 README 和 Obsidian 卡片**

将“风第一次露出耳环”改为“石台取耳环、画内扣合、风中显露、两次落台收束”，保留首帧总览链接。

- [ ] **Step 3: 验收 JSON、关键术语和项目测试**

```powershell
node -e "const fs=require('fs'); const p='video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/asset-pack-manifest.json'; const m=JSON.parse(fs.readFileSync(p,'utf8')); if(!m.reveal_rule.includes('visibly fastens')) throw new Error('Missing fastening state'); console.log('manifest PASS')"
pnpm test:unit
```

预期：`manifest PASS`；单元测试零失败。

- [ ] **Step 4: 提交**

```powershell
git add -- video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/asset-pack-manifest.json video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/README.md 'video-pipeline/asset-library/obsidian-vault/03-参考拆解/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001｜石中花影分镜.md'
git commit -m "docs: document physical earring continuity"
```
