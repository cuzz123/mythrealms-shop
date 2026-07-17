# ACT_RIGHT2_GOLD_JEWELRY_POISE_01｜综合首饰展示·抬颏侧转

- **状态：** approved（已验收）
- **内部质检：** 已验收
- **角色：** `CHAR_HUNYUAN_RIGHT2_GOLD_001`
- **骨架：** `RIG_RIGHT2_GOLD_UPPER_BODY`
- **帧数：** 72 @ 24 fps（3 秒）
- **配套镜头：** `CAM_RIGHT2_GOLD_JEWELRY_POISE_01`

## 文件

- Blend：`D:\mythrealms-shop\video-pipeline\asset-library\05-characters\CHAR_HUNYUAN_RIGHT2_GOLD_001\RIGHT2_GOLD_JEWELRY_POSE_v1.blend`
- 预览：`D:\mythrealms-shop\video-pipeline\asset-library\05-characters\CHAR_HUNYUAN_RIGHT2_GOLD_001\preview\jewelry_pose_v1\RIGHT2_GOLD_JEWELRY_POSE_PREVIEW.mp4`
- 联系表：`D:\mythrealms-shop\video-pipeline\asset-library\05-characters\CHAR_HUNYUAN_RIGHT2_GOLD_001\preview\jewelry_pose_v1\RIGHT2_GOLD_JEWELRY_POSE_CONTACT_SHEET.png`
- 验证脚本：`D:\mythrealms-shop\tools\blender\validate_right2_gold_jewelry_pose.py`

## 动作节奏

| 帧 | 动作 |
|---|---|
| 1-12 | 低头、三分之四侧脸起势并停留 |
| 13-56 | 缓慢抬颏，同时单向侧转至展示角度 |
| 57-72 | 保持最终姿态，供剪辑或转场使用 |

## 使用边界

该动作只驱动原模已验证的头、颈、胸与极小肩线变化，双臂全程锁定。适合耳饰、锁骨线和综合首饰肖像；不适用于行走、全身动作或大幅手臂动作。

在 Blender 中通过 **File > Append > Action** 导入 `ACT_RIGHT2_GOLD_JEWELRY_POISE_01`，并应用到 `RIG_RIGHT2_GOLD_UPPER_BODY`。
