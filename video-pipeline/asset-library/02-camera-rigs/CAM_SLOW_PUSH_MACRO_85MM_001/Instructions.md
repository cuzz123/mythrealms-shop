# CAM_SLOW_PUSH_MACRO_85MM_001

6 秒、30fps、85mm 的珠宝慢推微距。相机在第 1–150 帧完成推进，并在最后 1 秒轻微落定；焦点绑定 `FOCUS_TARGET__PRODUCT`。

## 使用

1. 在 Blender Asset Browser 中 Append 此镜头 Rig，或打开 `CAM_SLOW_PUSH_MACRO_85MM_001_v1.blend`。
2. 用正式产品替换 `PRODUCT_SLOT__LINK_OR_APPEND_PRODUCT_HERE` 中的代理耳环；正式产品建议 Link。
3. 将 `FOCUS_TARGET__PRODUCT` 移到产品的视觉主体。
4. 移除预览环境和预览灯光，改用已批准的场景与 Lighting Rig。
5. 先看 `Preview.mp4`，再输出正式分辨率。

## 不要改动

- 不要删除相机的第 1、72、150、180 帧，否则速度曲线与结尾停顿会失效。
- 不要把产品资产直接编辑在镜头文件中；需要修改产品时回到产品母资产。
