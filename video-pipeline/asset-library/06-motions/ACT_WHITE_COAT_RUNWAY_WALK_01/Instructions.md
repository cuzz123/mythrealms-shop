# ACT_WHITE_COAT_RUNWAY_WALK_01｜白色长外套·正面台步

- **状态：** candidate（候选待审）
- **质检：** pending_visual_review
- **角色：** `CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001`
- **骨架：** `RIG_WHITE_COAT_FULLBODY`
- **配套镜头：** `CAM_WHITE_COAT_RUNWAY_DOLLY_01`（正面全身·同步后移）
- **规格：** 96 帧 @ 24 fps，共 4 秒

## 文件

- [动作预览](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/preview/01_ACT_WHITE_COAT_RUNWAY_WALK_01.mp4)
- [动作中段帧](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/preview/01_ACT_WHITE_COAT_RUNWAY_WALK_01_frames/frame_0048.png)
- [整包审片视频](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/preview/WHITE_COAT_WALK_ALL_3_REVIEW.mp4)
- [九帧审片表](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/preview/WHITE_COAT_WALK_REVIEW_SHEET.png)
- [Blender 动作包](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/WHITE_COAT_WALK_PACK_v1.blend)
- [动作清单](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/motion_manifest.json)

## 调用

从动作包 Blend 的 `Action` 数据块追加 `ACT_WHITE_COAT_RUNWAY_WALK_01`，应用到 `RIG_WHITE_COAT_FULLBODY`。该动作使用 `root` 推进、左右 `foot_ik.*` 落脚和 `knee_pole.*` 膝盖朝向控制；不要直接移动高精度网格。

当前仅作为长外套全身步态候选。正式用于广告前，需要动态复核脚底滑动、膝盖朝向、重心转移和外套遮挡。
