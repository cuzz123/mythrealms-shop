# 本地影视资产库工作流

## 主库位置

```text
D:\mythrealms-shop\video-pipeline\asset-library
```

所有入库动作都采用“复制、SHA-256 校验、生成代理、建立索引”。工具不会移动、删除或覆盖来源文件。

## 初始化

```powershell
cd D:\mythrealms-shop\video-pipeline
.\scripts\14-import-local-asset.ps1 -Init
```

初始化命令可以重复执行，只创建缺失目录。

## 小云雀分镜视频入库

```powershell
.\scripts\14-import-local-asset.ps1 `
  -Source "D:\小云雀导出\shot-01.mp4" `
  -Type "storyboard-video" `
  -Title "花瓣珍珠耳环暖金窗光分镜"
```

正式文件进入 `10-storyboard-videos/<ASSET_ID>/`，自动生成：

- `source/`：原始视频校验副本。
- `Thumbnail.jpg`：可视化前端与 Obsidian 封面。
- `Preview.mp4`：720×1280 边界内的 H.264 低码率预览。
- `metadata.json`：来源、大小、SHA-256、正式路径与预览路径。
- `Instructions.md`：人工可读说明。

## 剪映工程快照

先退出正在写入该工程的剪映窗口，再执行：

```powershell
.\scripts\14-import-local-asset.ps1 `
  -Source "C:\Users\11458\AppData\Local\JianyingPro\User Data\Projects\com.lveditor.draft\工程目录" `
  -Type "edit-project" `
  -Title "珍珠耳环广告剪映工程 v1"
```

工具会生成确定性的 ZIP 快照，保存到 `11-edit-projects/<ASSET_ID>/project/`。来源工程仍留在剪映原目录，工具不会改写工程中的绝对路径。

## 剪映导出视频与正式成片

审片版或普通剪辑导出：

```powershell
.\scripts\14-import-local-asset.ps1 `
  -Source "D:\剪映导出\pearl-ad-review.mp4" `
  -Type "edit-export" `
  -Title "珍珠耳环广告审片版 v1"
```

已验收母版或发布版本：

```powershell
.\scripts\14-import-local-asset.ps1 `
  -Source "D:\剪映导出\pearl-ad-master.mp4" `
  -Type "final-video" `
  -Title "珍珠耳环广告 9比16 发布母版"
```

两者进入 `12-final-deliverables/`，并生成可视化前端使用的封面和代理视频。

## 去重规则

全局索引位于：

```text
99-manifests/local-assets.json
```

导入前先计算内容 SHA-256。即使文件改过名字，只要内容完全相同，就返回已有资产 ID，不再复制第二份。

## 导入箱

暂时无法确认类型的文件先放入：

```text
00-inbox/xiaoyunque/
00-inbox/jianying/
00-inbox/hunyuan/
00-inbox/codex-images/
```

导入箱不是正式资产分类。确认用途、版本和标题后，再通过导入脚本归档。

## 当前试导入

- `VID_STORYBOARD_WARM_WINDOW_PEARL_EARRING_001`
- 标题：暖金窗光花瓣珍珠耳环分镜 6s
- 来源：`D:\Chrome_Download\storyboard_6s_v2.mp4`
- 已验证同内容的 `storyboard_6s_v2 (1).mp4` 被识别为重复文件，没有生成第二份资产。

