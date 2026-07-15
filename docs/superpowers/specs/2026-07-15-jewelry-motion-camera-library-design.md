# 首饰模特动作与镜头资产库设计规格

## 目标

建立一套可复用的首饰广告预演资产库：30 个首饰模特常用动作和与其一一配对的 30 个常用镜头。动作以 `CHAR_HUMAN_MASTER_RIG_001` 为规范骨架，在 `CHAR_HUNYUAN_RIGHT2_GOLD_001` 上逐个重定向、渲染和验收；镜头在动作验收后制作。

第一阶段只制作一个原型动作“左手轻触左耳饰”，确认动作质量、重定向和预览流程后再批量生成。

## 已确认决策

- 采用混合资产包，不为 60 项资产复制 60 份母 Blend。
- 中文用于资产名称、卡片标题和预览标题；内部 ID 保持 `A-Z0-9_`。
- 动作统一基于人体主骨架制作，并烘焙到变形骨骼层以便重定向。
- 右二金色礼服角色是第一验收载体，不是动作的唯一适用角色。
- 全部动作限制为上半身首饰展示，不加入走路、跑跳或完整下肢动作。
- 动作和镜头预览统一为 72 帧、24 fps、3 秒、1280x720、H.264。
- 现有 `06-motions/basic-actions` 的 30 个小云雀基础动作保留，不覆盖、不删除。
- Blend、预览、联系表和验证全部齐全后，资产状态才可设为 `approved`。

## 资产架构

### 动作母包

`video-pipeline/asset-library/06-motions/jewelry-model-actions/JewelryMotionPack_v1.blend`

- 包含 `HumanMasterRig` 和 30 个 Asset-marked Actions。
- 动作作者层可以使用主骨架控制器；发布层必须烘焙到 55 根变形骨骼。
- 动作定义来自结构化规格文件，不在 Blender 脚本中散落硬编码名称和参数。

### 镜头母包

`video-pipeline/asset-library/02-camera-rigs/jewelry-model-cameras/JewelryCameraPack_v1.blend`

- 包含 30 个 Asset-marked Camera Collections。
- 每个 Collection 包含相机、相机 Rig、焦点 Empty 和语义焦点锚点引用。
- 镜头焦距以 50/70/85/100mm 为主，仅综合上半身镜头允许 35mm。

### 单项资产目录

每项动作和镜头仍有独立目录，但只存放轻量资产：

- `Instructions.md`
- `Preview.mp4`
- `ContactSheet.png`
- 验证报告

单项资产通过母 Blend 内的 Action 或 Camera Collection 名称调用，不复制母 Blend。

### Obsidian 与注册表

- 每项资产生成一张中文 Obsidian 卡。
- 每项资产登记到 `video-pipeline/asset-library/registry/assets.json`。
- 动作卡记录配套镜头 ID；镜头卡记录配套动作 ID。
- 二进制文件继续存放在资产库目录，Obsidian 只保存索引和链接。

## 动作生产流程

1. 从动作规格读取中文名、内部 ID、关键拍点、参与骨骼、焦点部位和约束。
2. 在 `HumanMasterRig` 控制层制作动作。
3. 将动作烘焙到主骨架变形骨骼层。
4. 通过骨名映射重定向到 `RIG_RIGHT2_GOLD_UPPER_BODY`。
5. 在右二角色上运行连续性、目标到达和姿势范围验证。
6. 生成 720p 视频和六帧联系表。
7. 生成 Instructions、Obsidian 卡和注册表条目。

主骨架到右二骨架的第一版映射至少覆盖：

| 语义部位 | 主骨架 | 右二骨架 |
| --- | --- | --- |
| 根部 | `root` | `root` |
| 下段脊柱 | `spine_01` | `spine_01` |
| 中段脊柱 | `spine_02` | `spine_02` |
| 胸部 | `spine_03` | `chest` |
| 颈部 | `neck` | `neck` |
| 头部 | `head` | `head` |
| 左上臂 | `upperarm.L` | `upper_arm.L` |
| 右上臂 | `upperarm.R` | `upper_arm.R` |
| 左前臂 | `lowerarm.L` | `forearm.L` |
| 右前臂 | `lowerarm.R` | `forearm.R` |
| 左手 | `hand.L` | `hand.L` |
| 右手 | `hand.R` | `hand.R` |

戒指和精细手指动作需要右二验证骨架 v2 增加手指链与手掌控制；没有通过手指权重验证前，对应动作保持 `draft`。

## 30 个动作

| 序号 | 内部 ID | 中文名称 | 重点部位 |
| ---: | --- | --- | --- |
| 1 | `ACT_JEWELRY_EARRING_REVEAL_NEAR_001` | 单向耳饰揭示 | 头颈胸 |
| 2 | `ACT_JEWELRY_TOUCH_EARRING_LEFT_001` | 左手轻触左耳饰 | 左臂、左手、头颈 |
| 3 | `ACT_JEWELRY_TOUCH_EARRING_RIGHT_001` | 右手轻触右耳饰 | 右臂、右手、头颈 |
| 4 | `ACT_JEWELRY_HAIR_TUCK_LEFT_001` | 左手拢发露耳 | 左臂、左手、头部 |
| 5 | `ACT_JEWELRY_HAIR_TUCK_RIGHT_001` | 右手拢发露耳 | 右臂、右手、头部 |
| 6 | `ACT_JEWELRY_CHIN_LIFT_NECKLACE_001` | 抬颏展示项链 | 头颈胸 |
| 7 | `ACT_JEWELRY_TOUCH_PENDANT_CENTER_001` | 指尖轻触中央吊坠 | 双臂、手、胸部 |
| 8 | `ACT_JEWELRY_TRACE_NECKLINE_LEFT_001` | 左手沿颈线轻抚 | 左臂、左手、锁骨 |
| 9 | `ACT_JEWELRY_TRACE_NECKLINE_RIGHT_001` | 右手沿颈线轻抚 | 右臂、右手、锁骨 |
| 10 | `ACT_JEWELRY_COLLARBONE_FRAME_001` | 双手框定锁骨 | 双臂、双手、胸部 |
| 11 | `ACT_JEWELRY_WRIST_RAISE_LEFT_001` | 左腕缓慢抬起 | 左臂、左腕 |
| 12 | `ACT_JEWELRY_WRIST_RAISE_RIGHT_001` | 右腕缓慢抬起 | 右臂、右腕 |
| 13 | `ACT_JEWELRY_WRIST_ROTATE_LEFT_001` | 左腕翻转展示 | 左腕、左手 |
| 14 | `ACT_JEWELRY_WRIST_ROTATE_RIGHT_001` | 右腕翻转展示 | 右腕、右手 |
| 15 | `ACT_JEWELRY_BRACELET_TOUCH_001` | 对侧手轻触手链 | 双臂、双手 |
| 16 | `ACT_JEWELRY_RING_CHEEK_LEFT_001` | 左手戒指贴近脸颊 | 左臂、左手、头部 |
| 17 | `ACT_JEWELRY_RING_CHEEK_RIGHT_001` | 右手戒指贴近脸颊 | 右臂、右手、头部 |
| 18 | `ACT_JEWELRY_RING_LIP_SIDE_001` | 戒指手轻停唇侧 | 手、头部 |
| 19 | `ACT_JEWELRY_RING_INSPECT_001` | 低头端详戒指 | 双手、头颈 |
| 20 | `ACT_JEWELRY_RING_FINGER_FAN_001` | 手指扇形展开 | 手掌、手指 |
| 21 | `ACT_JEWELRY_IDLE_LUXURY_BREATH_001` | 奢华静息呼吸 | 胸部、肩部、头部 |
| 22 | `ACT_JEWELRY_HEAD_TURN_LEFT_SLOW_001` | 缓慢左转头 | 头颈胸 |
| 23 | `ACT_JEWELRY_HEAD_TURN_RIGHT_SLOW_001` | 缓慢右转头 | 头颈胸 |
| 24 | `ACT_JEWELRY_CHIN_LOWER_GAZE_001` | 垂眸收颏 | 头颈 |
| 25 | `ACT_JEWELRY_SHOULDER_LOOKBACK_001` | 转肩回眸 | 胸部、肩部、头颈 |
| 26 | `ACT_JEWELRY_EARRING_TO_NECKLACE_001` | 从耳饰过渡到项链 | 头颈、手臂 |
| 27 | `ACT_JEWELRY_NECKLACE_TO_BRACELET_001` | 从项链过渡到手链 | 头颈、双臂 |
| 28 | `ACT_JEWELRY_RING_TO_EYE_LINE_001` | 戒指抬至视线 | 手臂、手、头部 |
| 29 | `ACT_JEWELRY_DOUBLE_HAND_FACE_FRAME_001` | 双手框脸展示 | 双臂、双手、头部 |
| 30 | `ACT_JEWELRY_EDITORIAL_SETTLE_001` | 编辑感收势定格 | 全上半身 |

## 30 个配套镜头

| 序号 | 内部 ID | 中文名称 | 配套动作 |
| ---: | --- | --- | --- |
| 1 | `CAM_JEWELRY_EARRING_PROFILE_PUSH_85MM_001` | 耳饰侧脸慢推 | 1 |
| 2 | `CAM_JEWELRY_EARRING_TOUCH_LEFT_ARC_85MM_001` | 左耳触碰弧移特写 | 2 |
| 3 | `CAM_JEWELRY_EARRING_TOUCH_RIGHT_ARC_85MM_001` | 右耳触碰弧移特写 | 3 |
| 4 | `CAM_JEWELRY_HAIR_TUCK_LEFT_SLIDE_70MM_001` | 左侧拢发横移 | 4 |
| 5 | `CAM_JEWELRY_HAIR_TUCK_RIGHT_SLIDE_70MM_001` | 右侧拢发横移 | 5 |
| 6 | `CAM_JEWELRY_NECKLACE_CHIN_TILT_70MM_001` | 项链抬颏下摇 | 6 |
| 7 | `CAM_JEWELRY_PENDANT_MACRO_PUSH_100MM_001` | 吊坠微距慢推 | 7 |
| 8 | `CAM_JEWELRY_NECKLINE_LEFT_TRACK_85MM_001` | 左颈线横向跟拍 | 8 |
| 9 | `CAM_JEWELRY_NECKLINE_RIGHT_TRACK_85MM_001` | 右颈线横向跟拍 | 9 |
| 10 | `CAM_JEWELRY_COLLARBONE_CENTER_PUSH_70MM_001` | 锁骨对称慢推 | 10 |
| 11 | `CAM_JEWELRY_WRIST_RAISE_LEFT_TRACK_85MM_001` | 左腕抬升跟拍 | 11 |
| 12 | `CAM_JEWELRY_WRIST_RAISE_RIGHT_TRACK_85MM_001` | 右腕抬升跟拍 | 12 |
| 13 | `CAM_JEWELRY_WRIST_ROTATE_LEFT_ORBIT_100MM_001` | 左腕翻转微距环绕 | 13 |
| 14 | `CAM_JEWELRY_WRIST_ROTATE_RIGHT_ORBIT_100MM_001` | 右腕翻转微距环绕 | 14 |
| 15 | `CAM_JEWELRY_BRACELET_TOUCH_RACK_100MM_001` | 手链触碰拉焦 | 15 |
| 16 | `CAM_JEWELRY_RING_CHEEK_LEFT_CLOSE_100MM_001` | 左脸戒指贴近特写 | 16 |
| 17 | `CAM_JEWELRY_RING_CHEEK_RIGHT_CLOSE_100MM_001` | 右脸戒指贴近特写 | 17 |
| 18 | `CAM_JEWELRY_RING_LIP_MACRO_100MM_001` | 唇侧戒指微距 | 18 |
| 19 | `CAM_JEWELRY_RING_INSPECT_ORBIT_85MM_001` | 戒指端详小环绕 | 19 |
| 20 | `CAM_JEWELRY_FINGER_FAN_FOCUS_SWEEP_100MM_001` | 指间珠宝扫焦 | 20 |
| 21 | `CAM_JEWELRY_PORTRAIT_LOCKED_PUSH_85MM_001` | 肖像静置微推 | 21 |
| 22 | `CAM_JEWELRY_HEAD_TURN_LEFT_ARC_70MM_001` | 左转头弧形跟拍 | 22 |
| 23 | `CAM_JEWELRY_HEAD_TURN_RIGHT_ARC_70MM_001` | 右转头弧形跟拍 | 23 |
| 24 | `CAM_JEWELRY_CHIN_LOWER_PUSH_85MM_001` | 垂眸收颏慢推 | 24 |
| 25 | `CAM_JEWELRY_SHOULDER_LOOKBACK_ORBIT_50MM_001` | 转肩回眸半环绕 | 25 |
| 26 | `CAM_JEWELRY_EAR_TO_NECK_TILT_70MM_001` | 耳饰至项链下摇跟拍 | 26 |
| 27 | `CAM_JEWELRY_NECK_TO_WRIST_DIAGONAL_70MM_001` | 项链至手链斜向跟拍 | 27 |
| 28 | `CAM_JEWELRY_RING_TO_EYES_RACK_100MM_001` | 戒指至眼神拉焦 | 28 |
| 29 | `CAM_JEWELRY_DOUBLE_HAND_FACE_PUSH_85MM_001` | 双手框脸对称慢推 | 29 |
| 30 | `CAM_JEWELRY_EDITORIAL_SETTLE_PULL_50MM_001` | 编辑感收势后拉 | 30 |

## 动作验收规则

- Action ID、中文名称和配套镜头 ID 唯一。
- 帧范围为 1-72，帧率 24 fps。
- 曲线使用 Bezier 和 `AUTO_CLAMPED`，不允许插值过冲造成反向摆动。
- 相邻帧旋转和位置变化必须低于各关节的连续性阈值。
- 交互动作必须验证手或腕与语义锚点的最近距离。
- 角色网格不得出现明显爆点、撕裂或手臂穿过头部/胸部。
- 右二角色无法可靠验证的手指动作保留为 `draft`。

## 镜头验收规则

- 镜头必须引用存在的动作 ID 和焦点锚点。
- 相机、相机 Rig、焦点 Empty 和镜头元数据必须同属一个 Camera Collection。
- 主体关键部位在关键拍点不得出框。
- 相机不得穿过角色包围盒或以不可见跳变切换位置。
- 景深焦点在关键拍点必须落在目标锚点上。
- 结束前必须完成减速并落定。

## 首个原型

首个原型为：

- Action ID：`ACT_JEWELRY_TOUCH_EARRING_LEFT_001`
- 中文名称：左手轻触左耳饰
- 主骨架：`HumanMasterRig`
- 右二验收动作：`ACT_RIGHT2_GOLD_TOUCH_EARRING_LEFT_001`
- 配套镜头暂不制作；先单独验收动作。

节奏：

| 帧 | 动作 |
| --- | --- |
| 1-12 | 偏左三分之四侧脸起始停留 |
| 13-24 | 左肩和左肘先行，手腕延迟启动 |
| 25-52 | 左手沿脸侧抬至左耳饰附近，头部轻微迎向手 |
| 53-60 | 手指和手腕小幅调整，避免遮住耳饰 |
| 61-72 | 保持最终展示姿势 |

原型通过条件：

- 左手目标点到左耳锚点的最近距离不超过 8cm。
- 手掌不穿过头部包围区，前臂不穿过胸部。
- 头部 Y 轴不出现左右反复摆动。
- 第 61-72 帧为稳定保持，不出现回正或姿势跳变。
- 预览视频和六帧联系表能清楚看出“抬手、触耳、保持”三段。

## 非目标

- 本批次不制作最终皮肤、面部表情、发丝或布料模拟。
- 本批次不保证所有角色零调整重定向；每个角色仍需比例校正层。
- 本批次不替代最终商业角色的生产级拓扑和蒙皮。
- 原型未通过前不批量渲染其余 29 个动作或 30 个镜头。
