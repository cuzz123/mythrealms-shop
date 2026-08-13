# MythRealms 视频制作管线

本目录包含四条工作流：

- 自动混剪：参考视频 → 镜头配方 → 素材匹配 → 预览渲染 → 可选的剪映草稿。
- 爆款视频拆解：参考视频 → 切点与一镜到底节拍 → 可编辑导演拆解 → Obsidian 审阅入口。
- 静态帧合成：准备好的图片 → 简单的 FFmpeg 幻灯片视频。
- AI 分镜：产品图 → 分镜板 → 规范化帧 → 供 Seedance 或小云雀使用的首尾帧提示词。

## 1. 自动混剪工作流

### 准备素材

将可复用的产品、场景、模特，以及 AI 生成的视频或图片放在：

```text
video-pipeline/assets/
```

匹配器会把选中的文件复制到每个任务目录，不会移动或改写原始素材。

### 检查环境

```powershell
cd video-pipeline
.\scripts\00-check-env.ps1
```

需要具备：

- 已加入 `PATH` 的 FFmpeg 与 ffprobe
- Python 3.8 或更高版本
- `requirements.txt` 中列出的 Python 包

如有需要，安装依赖：

```powershell
python -m pip install -r requirements.txt
```

### 运行完整工作流

```powershell
cd video-pipeline
.\scripts\04-run-workflow.ps1 -Reference "D:\path\to\reference.mp4" -Assets "assets" -Draft
```

将 `D:\path\to\reference.mp4` 换成实际参考视频路径；文件不存在时命令会立即停止。

输出目录：

```text
video-pipeline/work/YYYY-MM-DD-HHMM-reference-name/
```

重要文件：

- `recipe.json`：参考视频的场景边界、时长、关键帧与片段。
- `fragment_plan.json`：每个片段的匹配理由和候选素材。
- `matches.json`：每个片段最终选用的替换素材及置信度。
- `captions.srt`：在 `script.txt` 有文本时生成的字幕。
- `remix.mp4`：供审阅的混剪预览。
- `timeline_manifest.json`：完整时间线，用于审计和草稿生成失败时的回退。
- `draft_report.json`：剪映草稿创建状态。

### 手动逐步运行

```powershell
.\scripts\01-analyze-reference.ps1 -Reference "D:\path\to\reference.mp4" -JobName "test-edit"
.\scripts\02-match-materials.ps1 -Recipe "work\test-edit\recipe.json" -Assets "assets"
.\scripts\03-render-remix.ps1 -Recipe "work\test-edit\recipe.json" -Matches "work\test-edit\matches.json" -Draft
```

### 添加字幕或配音

编辑 `work\<job>\script.txt`，每个片段一行：

```text
fragment01    第一段字幕
fragment02    第二段字幕
```

如果已有最终配音文件：

```powershell
.\scripts\03-render-remix.ps1 `
  -Recipe "work\test-edit\recipe.json" `
  -Matches "work\test-edit\matches.json" `
  -Voice "work\test-edit\voice\final_voice.mp3" `
  -Draft
```

豆包等 TTS 服务或本地声音克隆工具可以把分段音频写入 `voice/`，但本仓库不会保存 API 密钥或厂商绑定的语音代码。

## 2. 爆款视频拆解工作流

在复刻爆款参考视频前先运行此命令。它会保留原始 MP4 和既有的 `recipe.json`，另行生成审阅包；即使视频没有剪辑点，也会按固定节拍拆解一镜到底的运镜。

```powershell
cd D:\mythrealms-shop\video-pipeline
.\scripts\05-breakdown-viral-video.ps1 `
  -Reference "D:\path\to\reference.mp4" `
  -JobName "viral-reference" `
  -BeatInterval 0.8
```

输出位于 `work\viral-reference\breakdown\`：

- `beat_timeline.json`：真实剪辑点与规律审阅节拍。
- `breakdown.json`：可编辑的镜头、站位、灯光、爆点、资产与验收字段。
- `keyframes\`：每个审阅段对应的一张关键帧。
- `asset-gaps.json`：只读的可复用资产候选与待补资产建议。
- `obsidian-report.md`：含关键帧内部链接的 Markdown 审阅报告。

每次运行还会在 `asset-library\obsidian-vault\03-参考拆解\` 新建 `拆解｜<任务名>.md` 入口卡，因此任务会直接出现在资产库中。若要写入其他库，可传入 `-ObsidianVault "D:\path\to\vault"`。

视觉字段初始会保守地标为 `unknown`。在把资产缺口加入正式生产队列前，请先在 `breakdown.json` 或 `obsidian-report.md` 中补全实际的镜头运动、人物与产品相对位置、灯光、焦点行为与爆点机制。该命令绝不会自动写入 `asset-library\registry\assets.json`。

## 3. 静态帧合成工作流

为每个场景准备一张 1080×1920 图片：

```text
frame-01.png
frame-02.png
frame-03.png
frame-04.png
frame-05.png
frame-06.png
```

将图片放进 `video-pipeline/frames/` 后运行：

```powershell
cd video-pipeline
.\compose.ps1 -Output "output/mythrealms_video.mp4"
```

带音频时：

```powershell
.\compose.ps1 -AudioFile "assets/soundtrack.mp3"
```

## 4. AI 分镜工作流

适用于当前的珍珠首饰广告流程：

```text
产品图 → 图片模型生成 3×4 分镜板 → 裁切为 12 张规范化帧 → 生成相邻首尾帧提示词 → 上传到 Seedance / 小云雀
```

### A. 编辑模板

复制或编辑：

```text
storyboard.template.json
```

重要字段：

- `product.image`：产品参考图。
- `product.must_keep`：视频模型必须保留的产品细节。
- `model.description`：模特或角色设定。
- `scene.description`：主场景与灯光。
- `storyboard.segments`：相邻镜头段的时长与运动方向。

### B. 生成分镜板

用图片模型生成干净的 3×4 分镜板。建议：

- 尽量不要有白色间隔线或边框。
- 所有格子使用一致的 9:16 镜头语言。
- 保持同一模特、服装和场景连续。
- 产品始终位于同一手腕或身体位置。
- 为 1080×1920 输出预留足够的画面边缘。

### C. 裁切并规范化分镜板

```powershell
cd D:\mythrealms-shop\video-pipeline
.\scripts\10-storyboard-crop.ps1 `
  -Board "D:\path\to\storyboard.png" `
  -Output "work\my-product-frames" `
  -Prefix "frame" `
  -Mode "contain-blur"
```

如果分镜板可见间隔线，可传入像素值：

```powershell
.\scripts\10-storyboard-crop.ps1 `
  -Board "D:\path\to\storyboard.png" `
  -Output "work\my-product-frames" `
  -GapX 4 `
  -GapY 4 `
  -SafeInset 2
```

输出：

- `frame_01.png` ... `frame_12.png`
- `contact_sheet_frame.png`
- `storyboard_manifest.json`

### D. 生成视频提示词

```powershell
.\scripts\11-storyboard-prompts.ps1 `
  -Frames "work\my-product-frames" `
  -Output "work\my-product-prompts.md" `
  -Prefix "frame" `
  -Provider "seedance"
```

输出：

- `my-product-prompts.md`：供手动上传使用的提示词。
- `my-product-prompts.jobs.json`：供未来 API 适配器使用的结构化任务。

相邻帧配对方式：

```text
frame_01.png -> frame_02.png
frame_02.png -> frame_03.png
...
frame_11.png -> frame_12.png
```

同一张连接帧必须同时作为上一段的尾帧和下一段的首帧使用，不要重新导出视觉上相似但并非同一张的图片。

## 默认输出规格

- 9:16 竖版视频
- 1080×1920
- 自动混剪默认 60 fps
- H.264 MP4 预览文件
- `pyJianYingDraft` 成功时可选生成剪映草稿

## 本地资产归集

小云雀分镜、剪映工程和剪辑成片不要继续散落在下载目录。使用以下入口进行无损归集：

```powershell
cd D:\mythrealms-shop\video-pipeline
.\scripts\14-import-local-asset.ps1 -Init
```

导入工具会复制来源、校验 SHA-256、生成预览并写入 Obsidian 资产卡；重复内容不会保存第二份。详细命令见 `asset-library\docs\local-library-workflow.md`。
