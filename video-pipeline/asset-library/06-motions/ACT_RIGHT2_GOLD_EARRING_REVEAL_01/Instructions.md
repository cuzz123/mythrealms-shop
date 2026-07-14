# ACT_RIGHT2_GOLD_EARRING_REVEAL_01｜右二单向耳饰展示转头

- **动作 ID:** `ACT_RIGHT2_GOLD_EARRING_REVEAL_01`
- **版本:** v1
- **状态:** ✅ approved
- **角色:** `CHAR_HUNYUAN_RIGHT2_GOLD_001`
- **骨架:** `RIG_RIGHT2_GOLD_UPPER_BODY`
- **可选相机:** `CAM_RIGHT2_GOLD_EARRING_REVEAL_TEST`
- **帧数:** 72 @ 24 fps（3 秒）
- **循环:** 否 — 终点姿态保持，需用切换或剪切退出

## 文件路径

| 类型 | 路径 |
|---|---|
| 源 Blend | `file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_RIGHT2_GOLD_001/RIGHT2_GOLD_RIGGED_UPPER_BODY_v1.blend` |
| 预览视频 | `file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_RIGHT2_GOLD_001/preview/rig_v5_earring_reveal/RIGHT2_GOLD_EARRING_REVEAL_PREVIEW.mp4` |
| 联系表 | `file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_RIGHT2_GOLD_001/preview/rig_v5_earring_reveal/RIGHT2_GOLD_EARRING_REVEAL_CONTACT_SHEET.png` |
| 验证脚本 | `tools/blender/validate_right2_gold_motion.py` |

## Blender 导入步骤（File > Append）

### 导入动作

1. 打开你的场景 Blend 文件。
2. **File > Append**（或快捷键 `Shift+F1`）。
3. 导航到 `RIGHT2_GOLD_RIGGED_UPPER_BODY_v1.blend` 并双击进入。
4. 依次展开 **Action** 文件夹。
5. 选中 `ACT_RIGHT2_GOLD_EARRING_REVEAL_01`，点击 **Append**。
6. 在 3D 视图中选中 `RIG_RIGHT2_GOLD_UPPER_BODY` 骨架。
7. 切换到 **Dope Sheet** 模式，在下拉菜单中切换到 **Action Editor**。
8. 在 Action Editor 的浏览器中选择刚导入的动作即可应用。

### 可选：导入相机

如果场景需要匹配预览视角：

1. 再次 **File > Append** → 进入同一 Blend 文件。
2. 展开 **Collections**（或 **Objects**）。
3. 找到 `CAM_RIGHT2_GOLD_EARRING_REVEAL_TEST`，点击 **Append**。
4. 将相机放入场景后，可设为当前活动相机（`Ctrl+Num0`）。

## 节奏拍点

| 帧区间 | 描述 |
|---|---|
| 1–12 | **起始停留** — 保持偏左的三分之四侧脸，耳饰可见。 |
| 13–72 | **单向转头** — 头部 Y 轴单调递增，颈部与胸部小幅协同，无反转或回摆；逐步转向近正面展示角度。 |
| 72 | **终点姿势** — 到达最终展示姿势；Action 结束后保持该姿势，不自动回正。 |

> **注意:** 动作同时使用头、颈、胸和锁骨的小幅关键帧；其中头部 Y 轴轨迹必须保持单调。当前头部局部 Y 轴约从 -5.16° 转到 +4.01°，头颈胸组合转向约 15°。如需叠加眨眼或呼吸，请勿改变这条单向轨迹。

## 质量检查与验证

每次使用该动作前应运行验证脚本：

```powershell
& 'D:\Softwares\Blender\blender.exe' --background `
  'D:\mythrealms-shop\video-pipeline\asset-library\05-characters\CHAR_HUNYUAN_RIGHT2_GOLD_001\RIGHT2_GOLD_RIGGED_UPPER_BODY_v1.blend' `
  --python 'D:\mythrealms-shop\tools\blender\validate_right2_gold_motion.py'
```

验证脚本检查以下内容：

- **(a) 头部 Y 轴单调递增** — 帧 13–72 范围内，头部偏转角严格单调上升，不允许任何回摆或抖动。
- **(b) 逐帧连续性** — 相邻帧之间的角速度变化在合理阈值内，无跳帧或突变。

人工检查要点：

- 预览视频中耳饰是否始终在画面内。
- 终点姿态下耳饰与面部轮廓是否清晰分离。
- 开头 12 帧保持静止，无意外偏移。

## 适用场景

- **耳饰肖像特写** — 镜头聚焦耳部，转头过程自然展示饰品佩戴效果。
- **三分之四侧面揭示** — 角色以克制的单向转头展现耳饰与面部轮廓关系。
- **上半身珠宝广告** — 配合金色礼服，适用于高级珠宝或时尚品牌的广告级预演。
- **入画衔接** — 作为角色从远景推进后的首次转头动作，建立与观众的视线连接。

## 约束说明

- **上半身仅预演级别。** 源角色网格截至膝部附近收口，膝盖以下无骨骼。
- **未做生产级拓扑。** 网格为混元生成原始输出，未经重拓扑优化。
- **不可用于以下场景：**
  - 行走、跑动等全身镜头
  - 最终商业角色交付
  - 需要膝盖/脚部动画的任何镜头
- 建议在 previs/previz 阶段使用，后期需替换为生产级角色。

## 关联资产

- [[CHAR_HUNYUAN_RIGHT2_GOLD_001｜混元3D-右二金色礼服角色]]
