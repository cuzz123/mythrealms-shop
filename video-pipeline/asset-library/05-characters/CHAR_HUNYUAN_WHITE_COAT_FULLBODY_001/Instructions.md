# CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001｜白色长外套全身女模特

- **类型：** character
- **状态：** 全身骨架已绑定，走路动作候选
- **源文件哈希：** `65f7db8c815e8435189ec971eeb01407bcb1607c91a5ca1ae8b9f22d802ffbb3`
- **网格：** 1 个，292,098 顶点，494,630 面
- **骨架：** `RIG_WHITE_COAT_FULLBODY`，27 骨，含左右脚 IK 与膝极向控制
- **高模：** `MESH_WHITE_COAT_HIRES`，保留 292,098 顶点原始材质网格
- **绑定代理：** `MESH_WHITE_COAT_PROXY`，29,334 顶点，仅用于权重求解，渲染隐藏
- **使用范围：** 全身站立、走路测试、全身运镜预演；长外套会遮挡膝部动作细节。

## 文件

- [原始 GLB](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001/source.glb)
- [缩略图](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001/preview/thumbnail.png)
- [全身绑定 Blend](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001/CHAR_HUNYUAN_WHITE_COAT_FULLBODY_RIG_v1.blend)
- [中性姿势检查](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001/preview/rig_v1_checkpoints/01_neutral.png)
- [左脚接触检查](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001/preview/rig_v1_checkpoints/02_left_contact.png)
- [右脚接触检查](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001/preview/rig_v1_checkpoints/03_right_contact.png)
- [模型元数据](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001/model.json)

原始 GLB 保持不变。任何绑定、减面或材质修正必须输出新文件，不能覆盖 `source.glb`。

## 调用

在 Blender 使用 **File > Append** 打开全身绑定 Blend，追加 `RIG_WHITE_COAT_FULLBODY` 与 `MESH_WHITE_COAT_HIRES`。走路动作必须驱动 `root`、`pelvis`、左右 `foot_ik.*` 与 `knee_pole.*`，不要直接移动高模网格。

当前绑定已通过结构、权重覆盖、IK 静止角与五个变形姿势检查。动作资产仍需逐条渲染后验收。

<!-- WHITE_COAT_WALK_PACK_001 -->
## 走路动作候选包

- [3 组走路动作与镜头审片](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/preview/WHITE_COAT_WALK_ALL_3_REVIEW.mp4)
- [关键帧审片表](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/preview/WHITE_COAT_WALK_REVIEW_SHEET.png)
- [走路动作 Blend](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/WHITE_COAT_WALK_PACK_v1.blend)
- [走路动作清单](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/motion_manifest.json)

当前 3 组走路动作均为 `candidate`，需要连续播放验收后才能升为正式资产。
