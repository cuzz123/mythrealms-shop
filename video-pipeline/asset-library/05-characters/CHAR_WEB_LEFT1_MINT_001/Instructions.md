---
id: CHAR_WEB_LEFT1_MINT_001
asset_type: female_editorial_character_fullbody
status: available_unrigged
generator: Hunyuan 3D web image-to-3D
cloud_api: do_not_use
---

# 左一｜网页端混元 3D 上传包

网页端图生 3D 所需输入仍保留在本目录，方便追溯；生成模型已正式入库，不需要再次通过腾讯云 API 或网页端提交。

## 已导入模型

- GLB：`source/hunyuan-web/LEFT1_MINT_FULLBODY.glb`
- Blender 预览：`LEFT1_MINT_FULLBODY.blend`
- 缩略图：`Thumbnail.png`
- 当前状态：全身静态网格、未绑定骨骼。可用于构图与灯光，不可直接用于走位、坐姿或手部动画。

## 上传顺序

在混元 3D 网页版选择 **图生 3D → 多视图**，依次上传：

1. `source/three-view-crops/front.jpg`：正面
2. `source/three-view-crops/right_front.jpg`：右前 45°
3. `source/three-view-crops/back.jpg`：背面

## 首次提示词

```text
Full-body adult female editorial character, mint-green chiffon V-neck evening gown, long wavy blonde hair, delicate dangling earrings. Preserve the uploaded garment design, body silhouette, hair and accessories. Generate a complete body including dress hem, legs, feet and shoes. Neutral relaxed standing pose, clean topology, realistic PBR material.
```

## 节省次数规则

- 第 1 次只生成这一位左一；不要同时做车辆、场景或饰品。
- 只在以下任一情况出现时才做第 2 次：缺失脚/下摆、背面与输入不一致、脸部或手部明显破损。
- 首次可验收时立即下载 `GLB` 和原始预览图，交给资产库导入 Blender；不要为了不同角度连续抽卡。
- C 位与右二已有 PBR GLB，不重复生成。

## 不使用网页额度的资产

- 车与地下车库：用现有 3D 导演台、Blender 模块和免费车辆/场景资产处理。
- 右一、左二：现有图是肖像，先作为脸部、发型、耳饰参考；补齐全身三视图前不生成全身网格。
