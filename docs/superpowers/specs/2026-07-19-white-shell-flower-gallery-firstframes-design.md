# 石中花影首帧预览板 Design

## 目的

为 `VID_MR_WHITE_SHELL_FLOWER_GALLERY_001` 补齐可浏览、可投喂的首帧资产：让 8 个 Seedance 片段在生成前就有可见的构图、身份和产品露出边界。

## 交付物

- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/S01.png` 至 `S08.png`：8 张 9:16 正式首帧。
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/first-frames/overview.png`：8 格浏览总览，仅用于 Obsidian 和审核。
- `first-frames/README.md`：每张图对应的单一职责、片段和允许露出。
- 更新视频包 README、Obsidian 分镜卡和 manifest，提供点击预览入口。

## 画面规则

1. S01 高窗、空主展台、花影；S02 石膏花雕；S03 模特走入；S04 耳侧被头发遮挡；S05 风前一刻。以上均无耳环、无其它首饰。
2. S06 发丝让出一只耳朵并首次露出单只白贝母花垂坠耳环；S07 为该耳环的耳部微距；S08 为石灰岩展台上的一对耳环与远处虚化石膏花雕。
3. 场景只由高窗石灰岩锚点控制；人物只由无首饰三视图控制；花雕只作空间道具；产品源图只在 S06–S08 控制耳环结构。
4. 所有图为写实、9:16、无文字、无 Logo、无包装、无商品图深色背景；不覆盖已有世界/模特/产品资产。

## 管理与验收

- 每个文件独立命名，方便成为 Seedance 的第一帧引用；总览图不承担结构控制。
- 清单登记 `first_frame_paths`，Obsidian 卡嵌入总览图并链接 8 张首帧。
- 验收：9 个 PNG 均存在；S01–S05 视觉检查无首饰；S06 单只、S08 成对；所有内容在 `assets.json` 路径内可解析。
