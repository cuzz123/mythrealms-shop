---
id: CHAR_HUMAN_MASTER_RIG_001
asset_type: character_rig_standard
status: available
license: Original-library-specification
use_scope: previs_motion_blocking_retarget_target
---

# 人体标准骨架 v1

这是一套**不含人物网格**的标准人体骨架：它把动作、镜头和站位先锁定在稳定的骨架规范上。后续接入合法来源的写实女性身体、头部、服装或发型时，必须遵循这套朝向、比例与控制器约定。

## 调用

1. 打开 `HumanMasterRig.blend`，选择 `HumanMasterRig`，进入 Pose Mode。
2. 角色朝向固定为 **-Y**；世界 Z 向上；脚底基准面为 `Z=0`；名义身高 `1.70m`。
3. 先使用橙色 `CTRL_*` 控制器：重心 `CTRL_cog`、头部 `CTRL_head`、手部/脚部 IK 与肘/膝 Pole；蓝色骨骼为变形骨骼，不作为日常主要控制入口。
4. 文件默认带有 `ValidationPose_Asymmetric`，用于检查“非对称双臂 + 转头 + 右膝弯曲”的基础可动性。
5. 将新角色网格绑定前，先让其脚底落在 Z=0，并让正面朝 -Y。不要改变 `root`、主要骨骼的名称或 Rest Pose。

## 骨架范围

- 躯干：`pelvis`、`spine_01` 至 `spine_03`、`neck`、`head`
- 面部调度：`jaw`、`eye.L`、`eye.R`
- 手臂：左右 `clavicle / upperarm / lowerarm / hand`，并包含每根手指三节
- 下肢：左右 `thigh / calf / foot / ball`
- 控制层：14 根 `CTRL_*` 非变形骨骼，双臂和双腿各有一组 IK + Pole

## 验收

- 变形骨骼 55 根；控制器 14 根；总计 70 根。
- `lowerarm.L/R` 与 `calf.L/R` 各有一项 IK 约束。
- 默认动作 `ValidationPose_Asymmetric` 可在第 1 帧读取。
- `Thumbnail.png` 应展示蓝色变形骨骼、橙色控制器与非对称校验姿态。

## 边界

此资产不是最终广告片的人物模型，不能凭骨架本身产生皮肤、五官、头发或布料效果。写实女性角色会作为下一层**可替换网格**接入；这样既避免把当前假人当成成片角色，也避免动作资产被单个模型锁死。
