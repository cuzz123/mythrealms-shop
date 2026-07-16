# GLB 资产入库与全身模特步态测试设计

## 目标

将用户提供的 9 个 GLB 按现有资产库规范入库并建立可视化索引；把
`RIGHT2_GOLD_JEWELRY_SAFE_PACK_001` 中 30 组动作与镜头统一升级为已验收；
使用唯一的全身女模特建立完整人体骨架，并交付 3 组可审片的模特走路测试。

本轮以 Blender 导演台和动作资产可复用性为目标，不把 29 万顶点的生成模型
当作最终影视角色交付。步态必须先通过人体结构、足底接触和衣物形变检查，
才能由候选状态升级为已验收。

## 输入审计

9 个 GLB 均为单网格、单材质、无 Armature。临时正视图已经确认如下映射：

| 源文件 | 资产 ID | 中文名称 | 归档目录 |
|---|---|---|---|
| `9102900ee726384b29739ff33aa09e1b.glb` | `CHAR_HUNYUAN_WHITE_DRESS_HALF_001` | 白色礼服半身女模特 | `05-characters` |
| `588470d1c1906aa16bad61684fd8e7b7.glb` | `PROP_WHITE_BED_DRAPED_001` | 白色垂布床 | `03-scene-kits` |
| `dd50b213d03f54c25d8abe75570bab4a.glb` | `PROP_NECKLACE_BUST_WHITE_001` | 白色项链展示架 | `03-scene-kits` |
| `b0a70d953d242b065e613b5ba99560bd.glb` | `PROP_POTTED_BRANCH_001` | 陶盆枯枝陈设 | `03-scene-kits` |
| `e517b68016fb0ffdcc1b7ac57f742f1c.glb` | `PROP_WHITE_CHAIR_001` | 白色休闲椅 | `03-scene-kits` |
| `6442506e913de55fdcc9e68494138d9d.glb` | `PROP_WICKER_STORAGE_BOX_001` | 藤编收纳箱 | `03-scene-kits` |
| `cfe79b6e8550979df70c5ef1135b9dfe.glb` | `PROP_PATIO_UMBRELLA_CLOSED_001` | 收拢庭院遮阳伞 | `03-scene-kits` |
| `65850450fdda91b92b1ff0b9b7fc079b.glb` | `PROP_FLOWER_PLANTER_WHITE_001` | 白花木箱花架 | `03-scene-kits` |
| `85848780b48a738fbe785543a8cbb05a.glb` | `CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001` | 白色长外套全身女模特 | `05-characters` |

全身角色包含 292,098 个顶点和 494,630 个面，覆盖头部到双脚，但没有骨骼。

## 资产入库设计

每个资产目录包含原始 GLB、`model.json`、`Instructions.md` 和 `preview/`。
原始 GLB 只复制，不覆盖、不重命名其内部节点。`model.json` 记录源路径、文件哈希、
顶点/面数、材质数、骨架状态、包围盒、中文名称、资产类型和使用限制。

每个资产生成统一正视缩略图，并生成 9 项中文九宫格。资产同步到：

- `video-pipeline/asset-library/registry/assets.json`
- `video-pipeline/asset-library/obsidian-vault/01-资产卡/`
- `video-pipeline/asset-library/obsidian-vault/00-首页/GLB模型资产索引.md`

角色卡标记是否为半身或全身；道具卡标记推荐场景用途。只有全身白色长外套女模特
标记为 `walk_rig_candidate=true`。

## 原动作包批量验收

`RIGHT2_GOLD_JEWELRY_SAFE_PACK_001` 的 30 个 Action 和 30 个 Camera 全部设置为：

- `status=approved`
- `qc_status=approved`

整包统计更新为 `approved_count=30`、`candidate_count=0`，包状态更新为
`approved`。需要同步规格源、Blender 数据块自定义属性、manifest、角色元数据、
registry、独立说明、Obsidian 卡和中文索引。验证器改为要求恰好 30 个已验收项。

## 全身骨架方案

采用 Blender 内部的“低模代理权重传递”方案，不直接在 29 万顶点原网格上求解热权重。

1. 保留原始高模对象和材质，复制出不可渲染的绑定代理。
2. 将代理 Decimate 到约 20,000 至 35,000 顶点，并检查身体是否仍保持单一轮廓。
3. 建立完整通用人体骨架：`root`、`pelvis`、脊柱链、胸、颈、头、锁骨、
   上下臂、手、上下腿、踝、脚掌和脚趾。
4. 为双腿建立足部 IK、膝盖 Pole 和脚跟/脚尖控制；手臂保留 FK，避免首轮过度复杂。
5. 在代理上执行自动权重并修正髋部、膝部、腋下、外套下摆与脚踝。
6. 使用 Data Transfer 的 nearest-face-interpolated 模式把顶点组传回原始高模。
7. 原始高模由 Armature Modifier 驱动；代理隐藏渲染但保留作为权重修复源。

风衣、裙摆和腿部可能属于同一生成网格，迈步时可能产生粘连或拉伸。首轮不启用布料模拟，
只使用保守步幅与修正权重；仍无法接受时，停止扩展动作并将下摆分离/重拓扑列为后续工作。

## 首轮步态与镜头

所有测试均为 96 帧、24 fps、4 秒，状态初始为 `candidate`。

| 动作 | 动作 ID | 配套镜头 | 说明 |
|---|---|---|---|
| 秀场直线慢走 | `ACT_WHITE_COAT_RUNWAY_WALK_01` | `CAM_WHITE_COAT_RUNWAY_DOLLY_01` | 两个完整步态周期，镜头等速后退，保持全身构图 |
| 缓步入镜并停下定姿 | `ACT_WHITE_COAT_WALK_IN_STOP_01` | `CAM_WHITE_COAT_WALK_IN_STOP_01` | 约三步进入标记点，最后一步减速、重心落稳、停下定姿 |
| 三分侧跟拍走过镜头 | `ACT_WHITE_COAT_TRACKING_PASS_01` | `CAM_WHITE_COAT_TRACKING_PASS_01` | 三分侧构图，镜头平行跟拍，保留脚部接触和身体纵向起伏 |

步态采用明确的接触、下沉、经过和上升四相循环。骨盆只做小幅上下与左右转移；
胸腔和肩线产生反向微摆；头部保持稳定；膝盖始终朝脚尖方向；脚掌按脚跟、全掌、
前掌顺序滚动。通过根骨位移驱动前进，足部 IK 在支撑期锁定，避免滑步。

## 数据流与脚本边界

入库脚本只负责复制、审计、元数据、缩略图和索引。绑定脚本只处理全身角色并输出独立
Rig Blend。步态构建脚本从 Rig Blend 创建 3 个 Action、3 个 Camera 和对应焦点对象，
输出动作包 Blend 与 manifest。渲染脚本只读动作包，生成每项 MP4、关键帧检查图和总审片。

验证器独立于构建器，检查文件数量、资产 ID、顶点下限、原始高模存在、骨骼命名、
动作帧范围、IK 控制器、脚底高度、关节角限制、镜头配对和状态统计。

## 错误处理

- 缺失任何源 GLB、哈希变化或导入后没有 Mesh 时立即停止入库。
- 自动权重失败、出现未加权顶点或权重总和异常时不输出正式 Rig Blend。
- 膝肘反折、脚底穿地、支撑脚滑动超限或外套严重穿插时动作保持候选并标记失败原因。
- 不覆盖既有资产卡；重复执行只更新该批资产生成的索引和明确允许更新的元数据。
- Blender 后台模式中的 BlenderMCP 警告不作为失败，但任何 Python traceback 都视为失败。

## 验证与验收标准

1. 9 个资产目录、9 张卡、9 张缩略图和 1 张九宫格均存在，registry 中 ID 唯一。
2. 原动作包 manifest 与 Blend 中 30 个动作和 30 个镜头全部为 `approved`。
3. 全身角色 Rig Blend 同时保留原始高模、隐藏代理和完整人体 Armature。
4. 三个动作均为 96 帧，支撑脚可见时无明显滑步，脚不穿地，膝盖不反折。
5. 骨盆与肩线摆幅克制，头部不左右跳变，停止动作的最终重心稳定。
6. 每个动作都有可播放的 4 秒 MP4、关键帧检查图和配套镜头。
7. 三个新动作保持候选，只有用户观看预览并明确验收后才能升级为 `approved`。

## 不在本轮范围

- 面部表情、口型、手指精细动画和首饰二次动力学。
- 风衣布料模拟、影视级重拓扑、毛发重做和最终皮肤材质。
- 将步态自动重定向到其他角色。
- 在首轮 3 个动作验收前扩展大规模走路动作库。
