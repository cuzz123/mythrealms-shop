# MythRealms 珍珠视频 3D 建模参考图

本目录是给混元 3D 网页端准备的多视图输入图，不是可售首饰的 3D 母资产。

## 上传规则

每个资产目录都包含：

- `turnaround-sheet.png`：便于人工检查的三视图总览。
- `three-view-crops/front.jpg`：上传到中央的正面图位。
- `three-view-crops/left_front.jpg`：上传到左下角的「左 45° 图」位。
- `three-view-crops/back.jpg`：上传到底部的背面图位。

网页端使用 `3D 生成 - V3.1`，模型面数统一选 `500k`。不需要填写提示词；顶视、右 45°、右侧、底部槽位留空。

## 生成队列

| 顺序 | 目录 | 混元资产 ID | 用途 | 验收重点 |
| --- | --- | --- | --- | --- |
| 1 | `CHAR_MR_TALENT_FULL_001` | `CHAR_MR_TALENT_FULL_001` | 导演台走位、构图、布光预演 | 脚部完整；五指正常；面部和短发不漂移 |
| 2 | `PROP_MR_GIFT_BOX_001` | `PROP_MR_GIFT_BOX_001` | 开箱、礼赠、前景遮挡 | 盒盖、绒面内衬和金边连续；无首饰幻觉 |
| 3 | `PROP_MR_NECK_DISPLAY_001` | `PROP_MR_NECK_DISPLAY_001` | 项链、耳饰静物布光 | 对称、底座完整；不生成人脸或首饰 |
| 4 | `PROP_MR_LINEN_PEDESTAL_001` | `PROP_MR_LINEN_PEDESTAL_001` | 珍珠静物台、低机位推进 | 布料不穿模；石材和布料分层清晰 |
| 5 | `ENV_MR_LIMESTONE_ARCH_001` | `ENV_MR_LIMESTONE_ARCH_001` | 露台背景、侧移和环绕镜头 | 拱门不断裂；背面可用；比例稳定 |
| 6 | `ENV_MR_STUDIO_WINDOW_001` | `ENV_MR_STUDIO_WINDOW_001` | 窗边棚拍、反光与拉焦预演 | 窗格笔直；帘布不穿插；底座完整 |
| 7 | `PROP_MR_OLIVE_PLANTER_001` | `PROP_MR_OLIVE_PLANTER_001` | 花园、露台、屋顶的前景遮挡与景深层次 | 花盆完整；树干和叶片不漂浮 |
| 8 | `PROP_MR_BISTRO_SET_001` | `PROP_MR_BISTRO_SET_001` | 咖啡馆手镯、礼盒、桌边人物构图 | 桌椅脚完整；藤编和桌面不变形 |
| 9 | `PROP_MR_POOL_LOUNGER_001` | `PROP_MR_POOL_LOUNGER_001` | 泳池、海边的侧移、前景进入与生活方式镜头 | 木条连续；靠背和软垫无穿插 |
| 10 | `PROP_MR_FLOWER_STAND_001` | `PROP_MR_FLOWER_STAND_001` | 花市、花园的层次与遮挡转场 | 三个花桶完整；花朵不融成块 |
| 11 | `PROP_MR_STRIPED_PARASOL_001` | `PROP_MR_STRIPED_PARASOL_001` | 海边阶梯、泳池的高处前景与光影 | 伞杆、伞布、底座连续；不自动撑开 |
| 12 | `PROP_MR_RATTAN_BASKET_001` | `PROP_MR_RATTAN_BASKET_001` | 海滩小屋、窗边的低机位前景与礼赠氛围 | 编织纹理完整；盒盖和亚麻布无穿模 |
| 13 | `JWL_GENERIC_PEARL_DROP_EARRINGS_001` | `JWL_GENERIC_PEARL_DROP_EARRINGS_001` | 耳部构图、焦点、反光与耳饰动作预演 | 两只耳环对称；耳钩和珍珠不融合 |
| 14 | `JWL_GENERIC_PEARL_CHOKER_001` | `JWL_GENERIC_PEARL_CHOKER_001` | 锁骨构图、低头抬眼与项链焦点预演 | 链条闭合；珠粒不增减；中心坠位置稳定 |
| 15 | `JWL_GENERIC_PEARL_BRACELET_001` | `JWL_GENERIC_PEARL_BRACELET_001` | 手腕旋转、桌边特写与反光预演 | 双线不缠绕；两颗端部珍珠完整 |
| 16 | `JWL_GENERIC_PEARL_RING_001` | `JWL_GENERIC_PEARL_RING_001` | 手部进入、礼盒开合与微距焦点预演 | 戒圈闭合；四爪和珍珠不穿插 |

## 重要边界

- 具体珍珠首饰 SKU 继续使用网站真实产品图与 `assets/brand/video/virtual-talent-v1/worn-keyframes/` 中的佩戴关键帧；不要让混元重新建模可售首饰。
- `JWL_GENERIC_*` 仅为“耳饰、项链、手镯、戒指”四类通用占位模型，用来定位、打光、排镜头；不允许在商品页、广告中冒充真实 SKU。
- 角色模型仅服务于 3D 导演台的空间预演。最终 TikTok 成片继续以真实佩戴关键帧作为图生视频首帧，保证首饰结构正确。
- 每个下载的模型优先保存为 `GLB`；如网页端方便，再额外存一份 `FBX` 作为绑定和跨软件备份。
