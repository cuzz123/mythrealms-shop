---
id: CHAR_HUNYUAN_C_POSITION_001
asset_type: female_editorial_character_midshot
status: available_limited
generator: Tencent Hunyuan 3D Pro 3.1
rig: unrigged
---

# C 位｜混元 3D 礼服角色

这是由 C 位三视图生成的带 PBR 材质 GLB：深蓝礼服、珍珠项链和盘发已经成为模型的一部分。它替代旧的积木式假人，适合先做脸部、上半身、半身构图、车边对视和灯光预演。

## 调用

1. 在 Blender 打开 `C_POSITION.blend`，或将 `source/hunyuan-raw/C_POSITION.glb` 以 **File > Import > glTF 2.0** 导入。
2. 默认保持 Hunyuan 原始材质；先在镜头景别中检验再调整色温、反射和阴影。
3. 当前模型没有骨骼，且下半身到膝部附近收口；不能直接用于走路、全身落地或多人全景。
4. 要进入动作库，先补全下肢/鞋履网格，再重拓扑和绑定到 [[CHAR_HUMAN_MASTER_RIG_001｜人体标准骨架]]。

## 验收

- 生成模式：Hunyuan 3D Pro 3.1，Normal + PBR。
- 输入：正面、右前 45°、背面三视图。
- 服务端回传：GLB 与 OBJ；原始文件已保留在 `source/hunyuan-raw/`。
- 已在 Blender 5.1.2 成功导入并渲染 `Thumbnail.png`。

## 使用边界

可用于中近景角色预演、C 位肖像、珠宝/礼服灯光测试；暂不用于全身走位、复杂肢体动作或最终商业角色交付。对外商用前仍需确认参考图来源权利与腾讯混元服务条款。
