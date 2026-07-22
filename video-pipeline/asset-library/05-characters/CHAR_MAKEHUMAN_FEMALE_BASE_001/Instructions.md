---
id: CHAR_MAKEHUMAN_FEMALE_BASE_001
asset_type: female_human_base_mesh
status: available
license: CC0-1.0-core-assets
use_scope: previs_and_look_development
---

# MakeHuman 女性人体基础网格

这是一个来源和授权均已记录的女性人体基础网格，不是小云雀式假人。它已被转换为资产库统一坐标：Z 轴向上、正面朝 -Y、脚底落在 Z=0、身高 1.70m。

## 调用

1. 打开 `Preview.blend`，用于检查全身比例、脸部朝向、发型轮廓、人与车辆/场景的尺度关系。
2. 此文件当前**未绑定骨架**，不能直接加入动作库或用作正式镜头动画。
3. 绑定阶段只以 [[CHAR_HUMAN_MASTER_RIG_001｜人体标准骨架]] 为目标；先完成 A Pose 对位，再验收肩、肘、膝、手指的权重。
4. 服装、皮肤贴图、妆容与角色脸部细节必须另立资产卡，不能把临时材质当成最终角色设计。

## 验收数据

- 人体：13,868 顶点、13,866 面。
- 发型：`long01`，3,239 顶点。
- 高度：1.70m；正面：-Y；地面：Z=0。
- 已渲染 `Thumbnail.png`，可由资产可视化管理页直接读取。

## 授权

- 人体与长发均来自 MakeHuman Community 的核心资产；该项目说明核心图形资产为 CC0。
- 许可证记录：<https://static.makehumancommunity.org/about/license.html>
- `female_elegantsuit01.obj` 仅作为待验证服装源保留，尚未加入此角色预览；后续每个服装/皮肤/贴图都必须单独记录来源和许可证。

## 质量边界

这是写实化流程的**基础层**，用于替换假人、做比例和动作绑定验证；目前不是成片级高定角色。需要继续补全：标准骨架绑定、脸部/眼睛细节、皮肤 PBR、礼服与饰品、表情控制。
