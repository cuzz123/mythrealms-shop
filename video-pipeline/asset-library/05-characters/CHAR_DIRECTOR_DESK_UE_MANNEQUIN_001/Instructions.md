# CHAR_DIRECTOR_DESK_UE_MANNEQUIN_001

3D 导演台正在使用的真实 GLB 假人：`ue-mannequin-retopology.glb`。它不是之前 Blender 里的程序化积木人，而是带可用骨骼层级的网格模型；导演台已映射躯干、头部、肩肘手、髋膝脚等主要控制骨。

## 调用

1. 在 3D 导演台中选择 `ue4-mannequin` 角色 Rig，即使用此模型。
2. 在 Blender 中通过 **File > Import > glTF 2.0** 导入 `model.json` 的 `source_model_path`。
3. 导入后统一以 Z 轴向上、脚底落地校正；保留骨骼名称，动作重定向才可继续使用导演台的映射。
4. 用于站位、运镜、动作排练和 AI 视频预览参考；不把它当作最终角色美术模型。

## 授权边界

- 来源模型使用 Sketchfab Standard License，允许作为本地项目中的预演/成片组成部分使用。
- **不得**把 GLB、嵌入该 GLB 的 Blender 文件或可直接提取的模型包对外发布、售卖、下载或再分发。
- 因此本资产采用“内部链接”而非复制模型：原始 GLB 留在 `D:\storyai-3d-director-desk\public\models`。
- 若要建立可公开分发的人物母资产，请改用 CC0 的 MakeHuman 导出模型或 Quaternius 角色包。
