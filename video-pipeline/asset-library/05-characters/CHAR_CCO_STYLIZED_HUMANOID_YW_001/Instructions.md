---
id: CHAR_CCO_STYLIZED_HUMANOID_YW_001
asset_type: character_rig
status: available
license: CC0-1.0
use_scope: previs_and_rig_testing
---

# CC0 风格化人形 YW 骨骼原型

这是已落地到资产库的开源 CC0 人形角色。它有一套 65 骨的完整 Armature、独立头发与眼睛网格，标准化后高度约 **1.91m**。`Preview.blend` 已把模型缩放、落地、布光与相机统一处理好。

## 调用

1. 预演、站位、走位、运镜测试时，直接打开 `Preview.blend` 或 Append 其中的 `CCO_YW_PREVIEW` Collection。
2. 在动作迁移前，保留骨架根骨 `Sacrum` 与原始骨骼名称；不要 Apply Armature Scale。
3. 用作角色与车辆、场景的比例尺时，以脚底位于 Z=0、身高 1.9134m 为准。
4. 若需要不同姿态，优先对 `Armature` 进入 Pose Mode；该资产适合检查全身轮廓与大动作，不适合面部或手部特写。

## 验收

- `Thumbnail.png` 可用于 React 资产管理页预览。
- `Preview.blend` 中应包含角色、3 点灯、地面与预览相机。
- 骨架有 65 根骨，根骨为 `Sacrum`。

## 授权与边界

- 来源：Girush 在 OpenGameArt 发布的 **Base Rigged Stylized Humanoid Character (YW)**。
- 授权：CC0 1.0；可修改、商用、再分发，保留本 `model.json` 中的来源与授权记录即可。
- 它是风格化角色原型，用于预演与骨骼测试；不替代后续的写实人体母资产或最终广告角色。
