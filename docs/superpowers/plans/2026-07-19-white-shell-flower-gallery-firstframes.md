# 石中花影首帧预览板 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为白贝母花耳环石灰岩花影馆视频包建立 8 张正式首帧与 1 张浏览总览图。

**Architecture:** 八张首帧按镜头合同独立保存，环境、人物、道具、产品各自维持单一控制职责。总览图只供浏览，不能替代单张首帧或产品结构锁；manifest 与 Obsidian 仅登记这些确定文件。

**Tech Stack:** 内置图像生成、PNG、Markdown、JSON、Node.js 验收脚本、Obsidian。

## Global Constraints

- 输出路径固定为 `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/`。
- S01–S05 无任何首饰；S06 仅一只耳环；S07 同一只耳环微距；S08 才出现成对耳环。
- 全部为 9:16、写实、无文字、无 Logo、无包装、无商品图深色背景。
- 场景、人物、石膏花雕、产品源图不得互相替代职责。

---

### Task 1: 生成前半段首帧

**Files:**
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/S01.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/S02.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/S03.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/S04.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/S05.png`

- [ ] 用环境锚点建立 S01 高窗、空展台和叶影。
- [ ] 用环境与花雕锚点建立 S02 粗粝石膏花雕。
- [ ] 用环境、人物三视图和动作表建立 S03 走入停下、S04 耳侧遮挡、S05 风前一刻。
- [ ] 逐图检查没有耳环、项链、手链、戒指或文字。
- [ ] 提交 `git commit -m "assets: add limestone gallery first frames one to five"`。

### Task 2: 生成产品揭示首帧与总览

**Files:**
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/S06.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/S07.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/S08.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/overview.png`

- [ ] 使用产品源图，仅让 S06 首次出现一只耳环、S07 出现同一只耳环的耳部微距。
- [ ] 用反向环境、花雕和产品源图建立 S08 成对耳环石台收尾。
- [ ] 生成或拼接不带文字的 8 格 `overview.png`，只用于浏览。
- [ ] 提交 `git commit -m "assets: add limestone gallery reveal frames"`。

### Task 3: 登记、浏览与验收

**Files:**
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/README.md`
- Modify: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/asset-pack-manifest.json`
- Modify: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/README.md`
- Modify: `video-pipeline/asset-library/obsidian-vault/03-参考拆解/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001｜石中花影分镜.md`

- [ ] 在 README 表格列出 S01–S08 的文件、首帧职责和首饰状态。
- [ ] 在 manifest 新增 `first_frame_paths`，所有值为 `D:\\mythrealms-shop\\...` 正式绝对路径。
- [ ] 在 Obsidian 分镜卡嵌入总览图并列出单帧链接。
- [ ] 用 Node.js 解析 manifest，验证 9 个 PNG、8 个帧路径以及总览路径存在；运行 `pnpm test:unit`。
- [ ] 提交 `git commit -m "docs: register limestone gallery first-frame board"`。

## Plan Self-Review

- Task 1 覆盖无首饰的 S01–S05，Task 2 覆盖产品首次出现、微距和收尾，Task 3 覆盖入库、浏览与验证。
- 无待填充项；路径、时序和首饰露出规则与设计规范一致。
