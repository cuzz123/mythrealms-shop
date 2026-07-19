---
asset_id: VID_MR_BLUE_RELIQUARY_001
type: storyboard_video
status: planned
brand: MythRealms
product: pearl-series-04
duration_seconds: 60
generation_clips: 15
---

# VID_MR_BLUE_RELIQUARY_001｜The Blue Reliquary｜蓝色秘藏

为 pearl-series-04 设计的 60 秒深蓝、粉珍珠、古金质感广告包。产品被处理为午夜私人收藏室中重新被发现的信物。

## Source of truth

- [60 秒主分镜与全能模式提示词](D:\mythrealms-shop\video-pipeline\work\2026-07-18-blue-reliquary\blue-reliquary-60s-master-storyboard.md)
- [验证脚本](D:\mythrealms-shop\video-pipeline\work\2026-07-18-blue-reliquary\validate-blue-reliquary.ps1)
- [产品结构锁定图](D:\mythrealms-shop\public\images\products\1688-shop\pearl-series\pearl-series-04-detail1.webp)

## Output slots

| Folder | Purpose |
|---|---|
| `source/` | Seedance 原始生成片段或下载文件。 |
| `preview/` | 单镜预览和剪辑节拍测试。 |
| `final/` | 调色、配音与 MythRealms Logo 后期完成的 MP4。 |

## Visual reference board

![场景与模特关键分镜](source/blue-reliquary-scene-model-storyboard-v1.png)

这张板锁定六个关键画面：黑曜石与靛蓝丝绒场景、黄铜盒、开盒产品、手腕佩戴、侧脸锁骨与产品 Hero。它用于后续全能模式生成时维持场景、光线、模特和产品的连续性。

![剧情优先分镜（当前采用）](source/blue-reliquary-narrative-first-storyboard-v2.png)

**当前采用 V2：** 前四格只建立“夜晚进入私人收藏室、发现并停在密盒前”的剧情，不出现任何可识别的首饰；第五格才开盒，最后一格才是产品 Hero。V1 仅保留作早期产品露出节奏的弃用参考。

## Acceptance status

- 15 个 4 秒生成合同：已规划
- 14 个剪辑切点合同：已规划
- 产品参考路径校验：通过
- 场景与模特关键分镜板：已生成
- 已生成视频：未开始
- 已完成成片：未开始

> 生成时只把产品结构图用于锁定珠序、深蓝矿石、粉珍珠与古金纹样；Logo 和文字必须在后期叠加。
