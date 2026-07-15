# 左手轻触左耳饰原型实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在人体主骨架上制作 `ACT_JEWELRY_TOUCH_EARRING_LEFT_001`，重定向到右二金色礼服角色，生成可检查的 3 秒预览并登记为首个通用首饰动作资产。

**Architecture:** 以 JSON 动作规格为单一数据源。主骨架生成器使用左手 IK 目标制作动作并烘焙变形骨骼；右二适配器使用相同语义拍点和角色比例重新求解手臂，不直接复制不同骨架的世界坐标。两个 Blender 侧验证器分别检查母包结构和右二角色上的连续性、耳部目标距离与最终保持。

**Tech Stack:** Blender 5.1.2、Python 3、`bpy`、`mathutils`、标准库 `unittest`、FFmpeg/FFprobe、JSON、Markdown/Obsidian。

## Global Constraints

- 保留 `HumanMasterRig.blend` 和 `RIGHT2_GOLD_RIGGED_UPPER_BODY_v1.blend`，不得覆盖源文件。
- 动作 ID 为 `ACT_JEWELRY_TOUCH_EARRING_LEFT_001`，中文名为“左手轻触左耳饰”。
- 主骨架对象为 `HumanMasterRig`；右二骨架对象为 `RIG_RIGHT2_GOLD_UPPER_BODY`。
- 时间范围 1-72 帧，24 fps，3 秒；61-72 帧必须稳定保持。
- 曲线使用 Bezier `AUTO_CLAMPED`，不得因插值过冲产生方向反复。
- 左手到左耳锚点最近距离不超过 0.08m；手掌不得进入头部核心碰撞球。
- 预览为 H.264、1280x720、24 fps、72 帧。
- 原型阶段不增加手指骨，不承诺单根手指贴合耳饰；以手掌和手腕轮廓验收。
- 现有 30 个小云雀基础动作和右二已批准动作不得删除或改名。

---

### Task 1: 建立动作规格和纯 Python 验证

**Files:**
- Create: `video-pipeline/tests/test_jewelry_motion_specs.py`
- Create: `video-pipeline/asset-library/06-motions/jewelry-model-actions/motion_specs.json`
- Create: `tools/blender/jewelry_motion_specs.py`

**Interfaces:**
- Consumes: UTF-8 JSON 中的动作定义。
- Produces: `load_motion_specs(path: Path) -> dict[str, MotionSpec]`；`MotionSpec` 包含 `id`、`name_zh`、`frames`、`fps`、`beats`、`targets` 和 `paired_camera_id`。

- [ ] **Step 1: 写失败的规格测试**

```python
class JewelryMotionSpecTests(unittest.TestCase):
    def test_left_earring_touch_spec_is_complete(self):
        specs = load_motion_specs(SPECS_PATH)
        spec = specs["ACT_JEWELRY_TOUCH_EARRING_LEFT_001"]
        self.assertEqual(spec.name_zh, "左手轻触左耳饰")
        self.assertEqual((spec.frames, spec.fps), (72, 24))
        self.assertEqual([beat.frame for beat in spec.beats], [1, 12, 24, 52, 60, 61, 72])
        self.assertEqual(spec.targets["hand"], "ear_left")
        self.assertEqual(spec.paired_camera_id, "CAM_JEWELRY_EARRING_TOUCH_LEFT_ARC_85MM_001")
```

- [ ] **Step 2: 运行测试确认 RED**

Run:

```powershell
python -m unittest discover -s video-pipeline/tests -p "test_jewelry_motion_specs.py" -v
```

Expected: FAIL，提示 `tools.blender.jewelry_motion_specs` 或规格文件不存在。

- [ ] **Step 3: 实现最小规格加载器和首条规格**

规格必须包含以下关键拍点：

```json
{
  "frame": 52,
  "phase": "touch",
  "hand_target": "ear_left",
  "head_response": "meet_hand_subtle"
}
```

加载器必须拒绝重复 ID、非 72 帧、非 24 fps、拍点无序和缺失配套镜头 ID。

- [ ] **Step 4: 运行测试确认 GREEN**

Run:

```powershell
python -m unittest discover -s video-pipeline/tests -p "test_jewelry_motion_specs.py" -v
```

Expected: PASS。

- [ ] **Step 5: 提交**

```powershell
git add -- video-pipeline/tests/test_jewelry_motion_specs.py video-pipeline/asset-library/06-motions/jewelry-model-actions/motion_specs.json tools/blender/jewelry_motion_specs.py
git commit -m "feat(blender): define first jewelry motion spec"
```

---

### Task 2: 生成主骨架动作母包

**Files:**
- Create: `tools/blender/build_jewelry_motion_pack.py`
- Create: `tools/blender/validate_jewelry_motion_pack.py`
- Create: `video-pipeline/asset-library/06-motions/jewelry-model-actions/JewelryMotionPack_v1.blend` (generated)

**Interfaces:**
- Consumes: `HumanMasterRig.blend` 和 `MotionSpec`。
- Produces: `JewelryMotionPack_v1.blend`，其中包含 `HumanMasterRig`、`ANCHOR_EAR_LEFT`、作者 Action 和烘焙 Action `ACT_JEWELRY_TOUCH_EARRING_LEFT_001`。

- [ ] **Step 1: 写失败的 Blender 母包验证器**

验证器必须检查：

```python
EXPECTED_ACTION = "ACT_JEWELRY_TOUCH_EARRING_LEFT_001"
assert "HumanMasterRig" in bpy.data.objects
assert EXPECTED_ACTION in bpy.data.actions
assert "ANCHOR_EAR_LEFT" in bpy.data.objects
assert bpy.context.scene.frame_start == 1
assert bpy.context.scene.frame_end == 72
assert bpy.context.scene.render.fps == 24
```

还要检查 Action 已 `asset_mark()`、中文名自定义属性为“左手轻触左耳饰”、曲线全部为 `AUTO_CLAMPED`。

- [ ] **Step 2: 对源主骨架运行验证器确认 RED**

Run:

```powershell
& 'D:\Softwares\Blender\blender.exe' --background `
  'D:\mythrealms-shop\video-pipeline\asset-library\05-characters\CHAR_HUMAN_MASTER_RIG_001\HumanMasterRig.blend' `
  --python 'D:\mythrealms-shop\tools\blender\validate_jewelry_motion_pack.py'
```

Expected: 非零退出，提示缺少 `ACT_JEWELRY_TOUCH_EARRING_LEFT_001`。

- [ ] **Step 3: 制作主骨架动作**

生成器必须：

1. 打开主骨架源文件副本。
2. 在头骨附近建立 `ANCHOR_EAR_LEFT`。
3. 使用 `CTRL_hand_ik.L` 和 `CTRL_elbow_pole.L` 制作 1/12/24/52/60/61/72 拍点。
4. 让胸、颈、头只做克制响应，头部不得左右往返。
5. 在 52 帧让手部目标靠近耳锚点，但在头部核心球外保留至少 0.025m。
6. 烘焙 `clavicle.L`、`upperarm.L`、`lowerarm.L`、`hand.L`、`spine_03`、`neck`、`head` 到发布 Action。
7. 将发布 Action 标记为 Blender Asset，并保存母包。

- [ ] **Step 4: 运行母包验证器确认 GREEN**

Run:

```powershell
& 'D:\Softwares\Blender\blender.exe' --background `
  'D:\mythrealms-shop\video-pipeline\asset-library\06-motions\jewelry-model-actions\JewelryMotionPack_v1.blend' `
  --python 'D:\mythrealms-shop\tools\blender\validate_jewelry_motion_pack.py'
```

Expected: `JEWELRY_MOTION_PACK_VALIDATION_OK`。

- [ ] **Step 5: 提交生成器与验证器**

```powershell
git add -- tools/blender/build_jewelry_motion_pack.py tools/blender/validate_jewelry_motion_pack.py
git commit -m "feat(blender): build jewelry motion master pack"
```

---

### Task 3: 重定向到右二角色并验证交互

**Files:**
- Create: `tools/blender/retarget_jewelry_motion_right2.py`
- Create: `tools/blender/validate_jewelry_motion_right2.py`
- Create: `video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_RIGHT2_GOLD_001/RIGHT2_GOLD_JEWELRY_MOTION_VALIDATION_v1.blend` (generated)

**Interfaces:**
- Consumes: 母包发布 Action、右二 15 骨骼角色和语义拍点。
- Produces: `ACT_RIGHT2_GOLD_TOUCH_EARRING_LEFT_001`、`ANCHOR_RIGHT2_EAR_LEFT`、`TARGET_RIGHT2_HAND_LEFT` 和独立验收 Blend。

- [ ] **Step 1: 写失败的右二验证器**

验证器逐帧采样，并聚合报告以下失败：

```python
assert min_hand_to_ear_m <= 0.08
assert min_hand_to_head_core_m >= 0.025
assert max_bone_delta_deg <= 2.5
assert max_hand_delta_m <= 0.035
assert hold_delta_deg_61_72 <= 0.05
assert hold_delta_m_61_72 <= 0.001
```

头部 Y 轴允许单向或保持，不允许出现超过 0.2° 的反向回摆。

- [ ] **Step 2: 对现有右二 Blend 运行验证器确认 RED**

Run:

```powershell
& 'D:\Softwares\Blender\blender.exe' --background `
  'D:\mythrealms-shop\video-pipeline\asset-library\05-characters\CHAR_HUNYUAN_RIGHT2_GOLD_001\RIGHT2_GOLD_RIGGED_UPPER_BODY_v1.blend' `
  --python 'D:\mythrealms-shop\tools\blender\validate_jewelry_motion_right2.py'
```

Expected: 非零退出，提示缺少右二验收 Action 和耳部锚点。

- [ ] **Step 3: 实现比例感知重定向**

适配器必须：

1. 复制现有右二 Blend 到独立验收文件。
2. 创建头骨父级的左耳锚点和头部核心碰撞球。
3. 根据右二肩、上臂、前臂和手长重新计算手部目标，不复制主骨架世界坐标。
4. 使用临时 IK 目标求解左臂，烘焙到 `upper_arm.L`、`forearm.L` 和 `hand.L` 后删除临时 IK 约束。
5. 保留右二原有所有 Actions 和相机。
6. 将新 Action 设为活动 Action，时间范围设为 1-72。

- [ ] **Step 4: 运行右二验证器确认 GREEN**

Expected: `RIGHT2_JEWELRY_MOTION_VALIDATION_OK`，并输出最近手耳距离、头部净空和最大逐帧变化。

- [ ] **Step 5: 提交适配器与验证器**

```powershell
git add -- tools/blender/retarget_jewelry_motion_right2.py tools/blender/validate_jewelry_motion_right2.py
git commit -m "feat(blender): retarget jewelry motion to right2"
```

---

### Task 4: 渲染预览并登记原型资产

**Files:**
- Create: `tools/blender/render_jewelry_motion_preview.py`
- Create: `video-pipeline/tests/test_jewelry_motion_asset_catalog.py`
- Create: `video-pipeline/asset-library/06-motions/jewelry-model-actions/ACT_JEWELRY_TOUCH_EARRING_LEFT_001/Instructions.md`
- Create: `video-pipeline/asset-library/06-motions/jewelry-model-actions/ACT_JEWELRY_TOUCH_EARRING_LEFT_001/Preview.mp4` (generated)
- Create: `video-pipeline/asset-library/06-motions/jewelry-model-actions/ACT_JEWELRY_TOUCH_EARRING_LEFT_001/ContactSheet.png` (generated)
- Create: `video-pipeline/asset-library/06-motions/jewelry-model-actions/ACT_JEWELRY_TOUCH_EARRING_LEFT_001/validation.json` (generated)
- Create: `video-pipeline/asset-library/obsidian-vault/01-资产卡/ACT_JEWELRY_TOUCH_EARRING_LEFT_001｜左手轻触左耳饰.md`
- Modify: `video-pipeline/asset-library/registry/assets.json`
- Modify: `video-pipeline/asset-library/obsidian-vault/00-首页/资产预览台.md`

**Interfaces:**
- Consumes: 通过验证的右二验收 Blend。
- Produces: 72 帧 H.264 预览、六帧联系表、验证 JSON 和可检索资产卡。

- [ ] **Step 1: 写失败的资产目录测试**

测试必须确认：

```python
self.assertEqual(entry["name"], "左手轻触左耳饰")
self.assertEqual(entry["status"], "approved")
self.assertEqual(entry["category"], "motion")
self.assertEqual(entry["usage"]["default_import"], "append")
self.assertTrue(preview.exists())
self.assertTrue(contact_sheet.exists())
self.assertTrue(instructions.exists())
```

还要用 FFprobe 检查 `duration=3`、`nb_frames=72`、`r_frame_rate=24/1` 和 `1280x720`。

- [ ] **Step 2: 运行测试确认 RED**

Expected: FAIL，提示资产目录或注册表条目不存在。

- [ ] **Step 3: 渲染与生成卡片**

渲染脚本必须从右二验收 Blend 输出帧 1-72，FFmpeg 编码为 H.264，并从 1/12/24/52/61/72 帧生成 3x2 联系表。Instructions 和资产卡必须写明：

- 主骨架 Action 和右二验收 Action 名称。
- 1-72 帧、24 fps、非循环。
- 左手到左耳饰的目标距离验收结果。
- 仅上半身预演，不包含精细手指贴合。
- 配套镜头为 `CAM_JEWELRY_EARRING_TOUCH_LEFT_ARC_85MM_001`，尚未制作时标注 planned。

- [ ] **Step 4: 运行全部验收**

Run:

```powershell
python -m unittest discover -s video-pipeline/tests -p "test_jewelry_motion_*.py" -v
& 'D:\Softwares\Blender\blender.exe' --background 'D:\mythrealms-shop\video-pipeline\asset-library\06-motions\jewelry-model-actions\JewelryMotionPack_v1.blend' --python 'D:\mythrealms-shop\tools\blender\validate_jewelry_motion_pack.py'
& 'D:\Softwares\Blender\blender.exe' --background 'D:\mythrealms-shop\video-pipeline\asset-library\05-characters\CHAR_HUNYUAN_RIGHT2_GOLD_001\RIGHT2_GOLD_JEWELRY_MOTION_VALIDATION_v1.blend' --python 'D:\mythrealms-shop\tools\blender\validate_jewelry_motion_right2.py'
```

Expected: 全部 PASS，并输出两个 Blender 验证成功标记。

- [ ] **Step 5: 提交原型资产卡**

```powershell
git add -- tools/blender/render_jewelry_motion_preview.py video-pipeline/tests/test_jewelry_motion_asset_catalog.py video-pipeline/asset-library/06-motions/jewelry-model-actions/ACT_JEWELRY_TOUCH_EARRING_LEFT_001/Instructions.md 'video-pipeline/asset-library/obsidian-vault/01-资产卡/ACT_JEWELRY_TOUCH_EARRING_LEFT_001｜左手轻触左耳饰.md' video-pipeline/asset-library/registry/assets.json 'video-pipeline/asset-library/obsidian-vault/00-首页/资产预览台.md'
git commit -m "docs(assets): register left earring touch prototype"
```

---

## 完成标准

- 用户可在 Blender 中打开右二验收 Blend，按空格看到动作完整播放。
- 视频中动作只有一次抬手与接近耳饰，不出现来回摆头、瞬移或最终回正。
- 主骨架母包和右二验收文件均通过自动验证。
- 原型动作的中文资产卡、调用说明、预览、联系表和注册表条目齐全。
- 原型通过用户视觉验收后，才把同一框架扩展到其余 29 个动作和 30 个镜头。
