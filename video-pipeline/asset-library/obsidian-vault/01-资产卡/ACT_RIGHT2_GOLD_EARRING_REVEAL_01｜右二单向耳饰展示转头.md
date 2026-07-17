---
id: ACT_RIGHT2_GOLD_EARRING_REVEAL_01
asset_type: motion
status: approved
version: v1
generator: Blender 5.1.2 (scripted keyframes)
tags: [右二, 动作, 金色礼服, 耳饰, 转头展示, 上半身, v1]
character: CHAR_HUNYUAN_RIGHT2_GOLD_001
camera: CAM_RIGHT2_GOLD_EARRING_REVEAL_TEST
armature: RIG_RIGHT2_GOLD_UPPER_BODY
frames: 72
fps: 24
loop: false
qc_status: approved
---

# ACT_RIGHT2_GOLD_EARRING_REVEAL_01｜右二单向耳饰展示转头

单向转头（72 帧 / 3 秒），从偏左三分之四侧脸缓慢转向近正面展示角度，终点姿势不自动回正。

![](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_RIGHT2_GOLD_001/preview/rig_v5_earring_reveal/RIGHT2_GOLD_EARRING_REVEAL_CONTACT_SHEET.png)

## 元数据

- **Action:** `ACT_RIGHT2_GOLD_EARRING_REVEAL_01`
- **版本:** v1
- **角色:** [[CHAR_HUNYUAN_RIGHT2_GOLD_001｜混元3D-右二金色礼服角色]]
- **骨架:** `RIG_RIGHT2_GOLD_UPPER_BODY`
- **可选相机:** `CAM_RIGHT2_GOLD_EARRING_REVEAL_TEST`
- **帧范围:** 1–72（24 fps，3 秒）
- **循环:** 否
- **源 Blend:** [RIGHT2_GOLD_RIGGED_UPPER_BODY_v1.blend](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_RIGHT2_GOLD_001/RIGHT2_GOLD_RIGGED_UPPER_BODY_v1.blend)
- **预览:** [RIGHT2_GOLD_EARRING_REVEAL_PREVIEW.mp4](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_RIGHT2_GOLD_001/preview/rig_v5_earring_reveal/RIGHT2_GOLD_EARRING_REVEAL_PREVIEW.mp4)
- **联系表:** [RIGHT2_GOLD_EARRING_REVEAL_CONTACT_SHEET.png](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_RIGHT2_GOLD_001/preview/rig_v5_earring_reveal/RIGHT2_GOLD_EARRING_REVEAL_CONTACT_SHEET.png)
- **验证脚本:** [validate_right2_gold_motion.py](file:///D:/mythrealms-shop/tools/blender/validate_right2_gold_motion.py)
- **详细操作说明:** [Instructions.md](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/ACT_RIGHT2_GOLD_EARRING_REVEAL_01/Instructions.md)

## Blender 导入（File > Append）

1. File > Append → `RIGHT2_GOLD_RIGGED_UPPER_BODY_v1.blend`
2. Action → `ACT_RIGHT2_GOLD_EARRING_REVEAL_01`
3. 在骨架 `RIG_RIGHT2_GOLD_UPPER_BODY` 的 Action Editor 中选中即可播放。
4. 可选：额外 Append → Collections → `CAM_RIGHT2_GOLD_EARRING_REVEAL_TEST`，用 `Ctrl+Num0` 设为活动相机。

## 节奏拍点

| 帧 | 描述 |
|---|---|
| 1–12 | **起始停留** — 保持偏左三分之四侧脸，耳饰可见。 |
| 13–72 | **单向转头** — 头 Y 轴单调递增，颈部与胸部小幅协同，无反转；转向近正面展示角度。 |
| 72 | **终点姿势** — 到达最终展示姿势，Action 结束后保持，不自动回正。 |

## 质量检查

- 头 Y 轴偏转从帧 13 起单调递增，无回摆。
- 逐帧连续性无跳帧。
- 通过 Blender 后台执行 `tools/blender/validate_right2_gold_motion.py` 验证。

## 适用场景

- 耳饰肖像特写
- 三分之四侧面揭示
- 上半身珠宝广告

## 约束

仅上半身预演。源角色网格截至膝部附近收口，未做生产级拓扑。不可用于行走、全身或最终商业角色交付。

## 关联资产

- [[CHAR_HUNYUAN_RIGHT2_GOLD_001｜混元3D-右二金色礼服角色]]
- [详细操作说明（Instructions.md）](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/ACT_RIGHT2_GOLD_EARRING_REVEAL_01/Instructions.md)
