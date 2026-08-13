# 参考重建分析（不作为资产使用）

## 90% 相机匹配 visual hull

`VISUAL_HULL_PROTOTYPE.blend` 是轮廓评分实验，不是人体角色模型。它不能用于导演台、动作或镜头资产，**请不要打开或调用它**。

- [90.28% 匹配预览](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_XIAOYUNQUE_MANNEQUIN_001/analysis/VISUAL_HULL_match.png)
- [侧面体积检查](file:///D:/mythrealms-shop/video-pipeline/asset-library/05-characters/CHAR_XIAOYUNQUE_MANNEQUIN_001/analysis/VISUAL_HULL_side.png)

正式可动资产仍为 013。若需要 90% 的正式角色模型，必须在 013 的人体网格上重拓扑、分件、权重转移并重新评分，不能直接使用这个实验文件。
