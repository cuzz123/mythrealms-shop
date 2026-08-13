---
asset_id: ACT_XYQ_TURN_TOUCH_EARRING_001
type: complex_action
character: CHAR_XIAOYUNQUE_MANNEQUIN_FEMALE_013
duration_seconds: 6
fps: 24
---

# 转身 · 触耳 · 回身展示

6 秒复杂动作回归测试：准备、轻微转身、右手到耳侧、回身展示、收势。

- [视频预览](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/complex-actions/Preview.mp4)
- [动作 Blend](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/complex-actions/ACT_XYQ_TURN_TOUCH_EARRING_001.blend)
- [触耳关键帧](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/complex-actions/Preview_03_touch_ear.png)
- [展示关键帧](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-motions/complex-actions/Preview_04_present.png)

右手使用 `XYQ_ACTION_RIGHT_HAND_TARGET` 的 IK 约束保证目标到达耳侧；大幅躯干扭转仍会暴露当前自动权重的拉伸，因此该动作同时作为后续权重优化的回归测试。
