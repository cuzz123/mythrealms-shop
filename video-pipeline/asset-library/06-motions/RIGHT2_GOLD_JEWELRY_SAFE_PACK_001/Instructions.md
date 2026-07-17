# RIGHT2_GOLD_JEWELRY_SAFE_PACK_001｜右二金色礼服·首饰模特安全动作镜头包

- **状态：** approved
- **角色：** `CHAR_HUNYUAN_RIGHT2_GOLD_001`
- **骨架：** `RIG_RIGHT2_GOLD_UPPER_BODY`
- **内容：** 30 个动作 + 30 个一一配套镜头
- **规格：** 每项 72 帧 @ 24 fps（3 秒）
- **验收状态：** 30 个已验收，0 个候选；30 个均通过本轮内部动态质检

## 文件

- Blend：`D:\mythrealms-shop\video-pipeline\asset-library\06-motions\RIGHT2_GOLD_JEWELRY_SAFE_PACK_001\RIGHT2_GOLD_JEWELRY_SAFE_PACK_v1.blend`
- 动作清单：`D:\mythrealms-shop\video-pipeline\asset-library\06-motions\RIGHT2_GOLD_JEWELRY_SAFE_PACK_001\motion_manifest.json`
- 30 项总览：`D:\mythrealms-shop\video-pipeline\asset-library\06-motions\RIGHT2_GOLD_JEWELRY_SAFE_PACK_001\preview\RIGHT2_GOLD_JEWELRY_SAFE_PACK_CONTACT_SHEET.png`
- 动作轨迹表：`D:\mythrealms-shop\video-pipeline\asset-library\06-motions\RIGHT2_GOLD_JEWELRY_SAFE_PACK_001\preview\RIGHT2_GOLD_JEWELRY_SAFE_PACK_REVIEW_SHEET.png`
- 90 秒总审片：`D:\mythrealms-shop\video-pipeline\asset-library\06-motions\RIGHT2_GOLD_JEWELRY_SAFE_PACK_001\preview\RIGHT2_GOLD_ALL_30_ACTIONS_REVIEW.mp4`
- 全量轨迹表：`D:\mythrealms-shop\video-pipeline\asset-library\06-motions\RIGHT2_GOLD_JEWELRY_SAFE_PACK_001\preview\full_review_sheets`
- 30 段独立预览：`D:\mythrealms-shop\video-pipeline\asset-library\06-motions\RIGHT2_GOLD_JEWELRY_SAFE_PACK_001\preview\review_clips`
- 验证脚本：`D:\mythrealms-shop\tools\blender\validate_right2_gold_safe_motion_pack.py`

## 动作与镜头

| # | 动作中文名 | 配套镜头中文名 | 状态 |
|---:|---|---|---|
| 01 | 右二单向耳饰展示转头 | 耳饰揭示·三分侧慢推 | 已验收 |
| 02 | 综合首饰展示·抬颏侧转 | 综合首饰展示·缓慢推近 | 已验收 |
| 03 | 柔和抬颏展示 | 正面肖像·柔和慢推 | 已验收 |
| 04 | 轻收下颌展示 | 高机位肖像·缓降定格 | 已验收 |
| 05 | 左侧耳饰揭示 | 左耳饰·焦点靠近 | 已验收 |
| 06 | 右侧耳饰揭示 | 右耳饰·焦点靠近 | 已验收 |
| 07 | 左倾耳饰定格 | 左三分侧·微弧靠近 | 已验收 |
| 08 | 右倾耳饰定格 | 右三分侧·微弧靠近 | 已验收 |
| 09 | 抬颏展示锁骨 | 锁骨线·低位慢推 | 已验收 |
| 10 | 低颌展示锁骨 | 锁骨线·低位慢推 | 已验收 |
| 11 | 上身左旋展示 | 左三分侧·微弧靠近 | 已验收 |
| 12 | 上身右旋展示 | 右三分侧·微弧靠近 | 已验收 |
| 13 | 左肩线轻提 | 左耳饰·焦点靠近 | 已验收 |
| 14 | 右肩线轻提 | 右耳饰·焦点靠近 | 已验收 |
| 15 | 双肩舒展定格 | 正面锁定·呼吸定格 | 已验收 |
| 16 | 胸腔轻吸气 | 正面锁定·呼吸定格 | 已验收 |
| 17 | 胸腔轻呼气 | 正面锁定·呼吸定格 | 已验收 |
| 18 | 缓慢转向镜头 | 正面肖像·柔和慢推 | 已验收 |
| 19 | 向左侧缓慢离镜 | 左三分侧·微弧靠近 | 已验收 |
| 20 | 向右侧缓慢离镜 | 右三分侧·微弧靠近 | 已验收 |
| 21 | 上半身轻靠左 | 头肩近景·横向微移 | 已验收 |
| 22 | 上半身轻靠右 | 头肩近景·横向微移 | 已验收 |
| 23 | 上半身轻前倾 | 高机位肖像·缓降定格 | 已验收 |
| 24 | 上半身轻后仰 | 低机位肩线·缓升 | 已验收 |
| 25 | 颈线延伸展示 | 锁骨线·低位慢推 | 已验收 |
| 26 | 左倾回正定格 | 正面肖像·柔和慢推 | 已验收 |
| 27 | 右倾回正定格 | 正面肖像·柔和慢推 | 已验收 |
| 28 | 左侧轮廓终章 | 左耳饰·焦点靠近 | 已验收 |
| 29 | 右侧轮廓终章 | 右耳饰·焦点靠近 | 已验收 |
| 30 | 首饰主视觉终章定格 | 头肩近景·横向微移 | 已验收 |

## 调用方法

在 Blender 中使用 **File > Append** 打开整包 Blend：

1. 从 `Action` 选择清单中的动作 ID，应用到 `RIG_RIGHT2_GOLD_UPPER_BODY`。
2. 从 `Object` 追加同 ID 配套的 `CAM_*` 摄像机和 `FOCUS_CAM_*` 景深焦点。
3. 将场景设置为 24 fps、1-72 帧；动作在 56 帧完成并保持到 72 帧。

也可以直接使用 Blender Asset Browser：

1. 在 **编辑 > 偏好设置 > 文件路径 > 资产库** 中添加 `D:\mythrealms-shop\video-pipeline\asset-library`。
2. 动作位于 `动作与站位/首饰模特/右二金色礼服`。
3. 镜头位于 `镜头/首饰模特/右二金色礼服`。
4. Action 拖入后应用到 `RIG_RIGHT2_GOLD_UPPER_BODY`；Camera 资产连同对应 `FOCUS_*` 对象一起追加。

## 使用边界

该包坚持使用原始混元高精度网格，双臂锁定，只驱动已验证的头、颈、胸、脊柱与极小肩线变化。适合耳饰、项链、锁骨线和上半身肖像；不适用于行走、全身动作、大幅抬臂或手触首饰。

## 第二轮内部质检

- 30 个动作均已渲染完整 72 帧 MP4。
- 01-10、11-20、21-30 分三张六关键帧轨迹表完成视觉检查。
- 第 24 项低机位镜头曾切掉过多头顶，现已重新取景并复核。
- 未发现动作回摆、突跳、肩颈折叠、网格撕裂或摄影道具穿帮。
- 30 个动作均已由用户批量验收，状态统一为 `approved`。
