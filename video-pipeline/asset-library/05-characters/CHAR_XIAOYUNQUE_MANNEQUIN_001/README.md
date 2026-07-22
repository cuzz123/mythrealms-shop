---
asset_id: CHAR_XIAOYUNQUE_MANNEQUIN_FEMALE_014
type: character
status: verified-preview
rig_bones: 55
---

# 小云雀导演台假人 · 人体内核版 014

当前可用母资产：`CHAR_XIAOYUNQUE_MANNEQUIN_FEMALE_014_ARTICULATED_HUMAN.blend`。

## 预览

- [参考匹配视图](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_XIAOYUNQUE_MANNEQUIN_001/Preview_v14_match.png)
- [正面](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_XIAOYUNQUE_MANNEQUIN_001/Preview_v14_front.png)
- [侧面](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_XIAOYUNQUE_MANNEQUIN_001/Preview_v14_side.png)
- [背面](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_XIAOYUNQUE_MANNEQUIN_001/Preview_v14_back.png)
- [Blender 母资产](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_XIAOYUNQUE_MANNEQUIN_001/CHAR_XIAOYUNQUE_MANNEQUIN_FEMALE_014_ARTICULATED_HUMAN.blend)

## 已验证

- `XYQ_NATURAL_PROPORTION_CORE` 是 7,308 顶点、7,296 面的真实人体网格，不是由图像轮廓堆出的切片或平面。
- 55 根人形控制骨骼已通过 Armature Modifier 自动绑定到人体内核；蛋形头壳与颈部机械环也各自骨骼绑定。
- 保留人体的连续躯干、手、足和软组织体积，仅用深紫色材质分区标记颈、肘、膝等活动区；这比外挂大球更接近参考假人的比例。
- 014 尚未以 90% 对外宣称；此前 visual-hull 分数只属于分析实验，不能代表这个可动画角色。

## 使用

在 Blender 打开母资产，选择 `XYQ_NATURAL_SHELL_55_BONE_RIG`，进入 Pose Mode。常用骨骼为 `pelvis`、`spine_01`/`spine_02`/`spine`、`head`、`upper_arm.*`、`forearm.*`、`thigh.*`、`shin.*`，以及每根手指的三段骨骼。

> `analysis/VISUAL_HULL_PROTOTYPE.blend` 是已隔离的轮廓分析文件；不要在资产库中打开或调用它。
