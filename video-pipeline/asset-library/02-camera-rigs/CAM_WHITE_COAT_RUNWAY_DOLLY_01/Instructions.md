# CAM_WHITE_COAT_RUNWAY_DOLLY_01｜正面全身·同步后移

- **状态：** candidate（候选待审）
- **质检：** pending_visual_review
- **配套动作：** `ACT_WHITE_COAT_RUNWAY_WALK_01`（白色长外套·正面台步）
- **角色：** `CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001`
- **规格：** 96 帧 @ 24 fps，共 4 秒

## 文件

- [镜头预览](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/preview/01_ACT_WHITE_COAT_RUNWAY_WALK_01.mp4)
- [镜头中段帧](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/preview/01_ACT_WHITE_COAT_RUNWAY_WALK_01_frames/frame_0048.png)
- [整包审片视频](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/preview/WHITE_COAT_WALK_ALL_3_REVIEW.mp4)
- [九帧审片表](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/preview/WHITE_COAT_WALK_REVIEW_SHEET.png)
- [Blender 动作包](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/WHITE_COAT_WALK_PACK_v1.blend)
- [动作清单](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/motion_manifest.json)

## 调用

从动作包 Blend 的 `Object` 数据块追加 `CAM_WHITE_COAT_RUNWAY_DOLLY_01` 和对应 `FOCUS_*` 对焦物体，将场景相机切换到该 Camera。焦距保持在 55–75 mm，景深焦点绑定角色上身。
