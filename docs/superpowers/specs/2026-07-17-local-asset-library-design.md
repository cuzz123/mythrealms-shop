# MythRealms 本地影视资产库设计

## 目标

把当前分散在 `video-pipeline/assets`、`video-pipeline/work`、`video-pipeline/final`、`huanyuan_model`、Codex 生成目录及人工导出目录中的可复用素材，统一纳入 `D:\mythrealms-shop\video-pipeline\asset-library` 管理，同时保留原始文件和现有 Blender、剪映绝对路径。

本阶段只做本地资产库，不接入云端对象存储。

## 核心原则

1. 不移动、不删除、不覆盖任何来源文件。
2. 首次归集采用“复制 -> SHA-256 校验 -> 建立索引”的方式。
3. 相同内容只保存一份正式副本；重复导入返回已有资产。
4. Obsidian 只保存资产卡和链接，不承担大型二进制文件的主存储。
5. 前端默认读取缩略图与低码率代理视频，原始视频只在编辑或导出时使用。
6. 剪映工作目录不直接搬迁；资产库保存可恢复的工程快照及成片。

## 目录结构

保留现有 `01` 至 `09` 分类，新增：

```text
asset-library/
├─ 00-inbox/
│  ├─ xiaoyunque/
│  ├─ jianying/
│  ├─ hunyuan/
│  └─ codex-images/
├─ 10-storyboard-videos/
├─ 11-edit-projects/
├─ 12-final-deliverables/
├─ 90-proxies/
└─ 99-manifests/
```

视频或工程资产采用统一目录：

```text
<ASSET_ID>/
├─ source/          # 原始文件的校验副本
├─ project/         # 剪映等工程快照压缩包
├─ Thumbnail.jpg    # 统一前端封面
├─ Preview.mp4      # 统一低码率预览
├─ metadata.json    # 单项资产元数据
└─ Instructions.md  # 人工可读说明
```

## 资产类型

| 类型 | 目录 | 用途 |
| --- | --- | --- |
| `storyboard-video` | `10-storyboard-videos` | 小云雀、Seedance 等生成的分镜或镜头视频 |
| `edit-project` | `11-edit-projects` | 剪映工程快照及恢复说明 |
| `edit-export` | `12-final-deliverables` | 剪映导出的审片版、平台版和成片 |
| `final-video` | `12-final-deliverables` | 已验收母版及发布版本 |

## 导入行为

导入工具接受文件或目录，并执行：

1. 计算来源文件 SHA-256；目录先生成 ZIP 快照再计算。
2. 查询 `99-manifests/local-assets.json` 是否已有相同校验值。
3. 若已存在，返回现有资产 ID，不重复复制。
4. 若不存在，创建分类目录和正式资产目录。
5. 视频用 FFmpeg 生成 `Thumbnail.jpg` 与 `Preview.mp4`。
6. 写入 `metadata.json`、全局清单和 Obsidian 资产卡。
7. 记录来源绝对路径、文件大小、导入时间、内容校验值和正式库路径。

导入失败时，清理未完成的临时目录，不写入正式清单。

## 剪映工程策略

剪映工程可能引用大量绝对路径，因此：

- 日常工作工程继续留在剪映原目录。
- 入库时生成整个工程目录的 ZIP 快照。
- 元数据记录快照生成时的原始工程路径。
- 成片单独以 `edit-export` 或 `final-video` 导入。
- 本阶段不自动改写剪映工程内部路径。

## Obsidian 与可视化前端

每个导入资产在 `obsidian-vault/01-资产卡` 生成中文资产卡，包含封面、预览视频、来源路径、正式路径、校验值和恢复说明。

可视化前端增加：

- 分镜视频
- 剪辑工程
- 成片交付

三类筛选。视频继续使用现有弹框播放器；工程快照没有视频时显示目录卡片。

## 验收标准

1. 初始化命令只创建缺失目录，不改动已有内容。
2. 导入一个 MP4 后，原文件仍存在，正式库中存在原片、封面、预览和元数据。
3. 重复导入相同内容不会生成第二份正式副本。
4. 导入剪映目录后，来源目录不变，资产库中存在可校验的 ZIP 快照。
5. Obsidian 中出现可点击资产卡。
6. 可视化前端能按新增分类显示资产，并在弹框播放预览。
7. Python 测试、前端测试、Lint 与 Next.js 构建通过。

