# GLB Asset Ingestion And Fullbody Walk Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ingest and visualize nine supplied GLB assets, promote the existing Right2 Gold pack to 30/30 approved, and deliver a rigged fullbody white-coat model with three biomechanically conservative walk tests and paired cameras.

**Architecture:** Keep batch metadata, Blender construction, rendering, and validation in separate scripts. Preserve every source GLB, drive the 292k-vertex fullbody mesh through weights transferred from a decimated proxy, and build walking Actions from declarative gait specs so validation can inspect both joint limits and planted-foot intervals.

**Tech Stack:** Blender 5.1.2 Python API, Python 3.13, JSON, PowerShell, ffmpeg/ffprobe, existing Markdown/Obsidian asset-card conventions.

## Global Constraints

- Source GLBs are read from `D:/Chrome_Download` and copied without modifying their contents.
- Character assets live under `video-pipeline/asset-library/05-characters`; prop assets use the existing `video-pipeline/asset-library/03-scene-kits/PROP_*` convention.
- The fullbody source is `85848780b48a738fbe785543a8cbb05a.glb`, one mesh with 292,098 vertices and no source Armature.
- Preserve the original high-resolution mesh in every rig output; hide but retain the decimated proxy.
- Walk tests are exactly 96 frames at 24 fps and remain `candidate` until the user explicitly accepts them.
- Existing Right2 Gold Actions and Cameras become exactly 30 approved and 0 candidate.
- A walk fails when feet visibly slide during a planted interval, penetrate the floor, knees reverse, joint angles exceed declared bounds, or coat deformation destroys the silhouette.
- Do not enable cloth simulation, facial animation, finger animation, or large-scale walk-library expansion in this implementation.
- BlenderMCP background warnings are non-fatal; Python tracebacks and failed validators are fatal.
- Work with the dirty tree without reverting unrelated user changes.

---

### Task 1: Nine-GLB Asset Ingestion And Visual Index

**Files:**
- Create: `tools/blender/glb_asset_batch_specs.py`
- Create: `tools/blender/validate_glb_asset_batch.py`
- Create: `tools/blender/ingest_glb_asset_batch.py`
- Create: `tools/blender/render_glb_asset_batch_previews.py`
- Modify: `video-pipeline/asset-library/registry/assets.json`
- Create: `video-pipeline/asset-library/obsidian-vault/00-首页/GLB模型资产索引.md`
- Create: `video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_WHITE_DRESS_HALF_001/`
- Create: `video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001/`
- Create: `video-pipeline/asset-library/03-scene-kits/PROP_WHITE_BED_DRAPED_001/`
- Create: `video-pipeline/asset-library/03-scene-kits/PROP_NECKLACE_BUST_WHITE_001/`
- Create: `video-pipeline/asset-library/03-scene-kits/PROP_POTTED_BRANCH_001/`
- Create: `video-pipeline/asset-library/03-scene-kits/PROP_WHITE_CHAIR_001/`
- Create: `video-pipeline/asset-library/03-scene-kits/PROP_WICKER_STORAGE_BOX_001/`
- Create: `video-pipeline/asset-library/03-scene-kits/PROP_PATIO_UMBRELLA_CLOSED_001/`
- Create: `video-pipeline/asset-library/03-scene-kits/PROP_FLOWER_PLANTER_WHITE_001/`

**Interfaces:**
- Produces: `ASSETS: list[dict[str, object]]` in `glb_asset_batch_specs.py` with keys `source_name`, `asset_id`, `name_zh`, `asset_type`, `library_section`, and `walk_rig_candidate`.
- Produces: each asset directory with `source.glb`, `model.json`, `Instructions.md`, and `preview/thumbnail.png`.
- Produces: `video-pipeline/asset-library/obsidian-vault/00-首页/GLB模型资产索引.md` and `preview/GLB_MODEL_ASSET_CONTACT_SHEET.png`.

- [ ] **Step 1: Write the failing batch validator**

Create `validate_glb_asset_batch.py` so it imports `ASSETS`, checks all nine source files, verifies unique IDs, and requires every output file and registry/card entry:

```python
from glb_asset_batch_specs import ASSETS, LIBRARY

errors = []
assert len(ASSETS) == 9
assert len({item["asset_id"] for item in ASSETS}) == 9
for item in ASSETS:
    asset_dir = LIBRARY / item["library_section"] / item["asset_id"]
    for name in ("source.glb", "model.json", "Instructions.md", "preview/thumbnail.png"):
        if not (asset_dir / name).exists():
            errors.append(f"missing {item['asset_id']}/{name}")
if errors:
    raise RuntimeError("\n".join(errors))
print("GLB_ASSET_BATCH_VALIDATION_OK")
```

- [ ] **Step 2: Run the validator and confirm the expected RED state**

Run:

```powershell
& 'D:\Softwares\Blender\blender.exe' --background --python 'D:\mythrealms-shop\tools\blender\validate_glb_asset_batch.py'
```

Expected: non-zero exit with missing asset-directory/file messages, not an import or syntax error.

- [ ] **Step 3: Add the exact nine-item declarative spec**

Define these exact nine source-to-ID mappings:

```python
ASSETS = [
    {"source_name": "9102900ee726384b29739ff33aa09e1b.glb", "asset_id": "CHAR_HUNYUAN_WHITE_DRESS_HALF_001", "name_zh": "白色礼服半身女模特", "asset_type": "character", "library_section": "05-characters", "walk_rig_candidate": False},
    {"source_name": "588470d1c1906aa16bad61684fd8e7b7.glb", "asset_id": "PROP_WHITE_BED_DRAPED_001", "name_zh": "白色垂布床", "asset_type": "prop", "library_section": "03-scene-kits", "walk_rig_candidate": False},
    {"source_name": "dd50b213d03f54c25d8abe75570bab4a.glb", "asset_id": "PROP_NECKLACE_BUST_WHITE_001", "name_zh": "白色项链展示架", "asset_type": "prop", "library_section": "03-scene-kits", "walk_rig_candidate": False},
    {"source_name": "b0a70d953d242b065e613b5ba99560bd.glb", "asset_id": "PROP_POTTED_BRANCH_001", "name_zh": "陶盆枯枝陈设", "asset_type": "prop", "library_section": "03-scene-kits", "walk_rig_candidate": False},
    {"source_name": "e517b68016fb0ffdcc1b7ac57f742f1c.glb", "asset_id": "PROP_WHITE_CHAIR_001", "name_zh": "白色休闲椅", "asset_type": "prop", "library_section": "03-scene-kits", "walk_rig_candidate": False},
    {"source_name": "6442506e913de55fdcc9e68494138d9d.glb", "asset_id": "PROP_WICKER_STORAGE_BOX_001", "name_zh": "藤编收纳箱", "asset_type": "prop", "library_section": "03-scene-kits", "walk_rig_candidate": False},
    {"source_name": "cfe79b6e8550979df70c5ef1135b9dfe.glb", "asset_id": "PROP_PATIO_UMBRELLA_CLOSED_001", "name_zh": "收拢庭院遮阳伞", "asset_type": "prop", "library_section": "03-scene-kits", "walk_rig_candidate": False},
    {"source_name": "65850450fdda91b92b1ff0b9b7fc079b.glb", "asset_id": "PROP_FLOWER_PLANTER_WHITE_001", "name_zh": "白花木箱花架", "asset_type": "prop", "library_section": "03-scene-kits", "walk_rig_candidate": False},
    {"source_name": "85848780b48a738fbe785543a8cbb05a.glb", "asset_id": "CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001", "name_zh": "白色长外套全身女模特", "asset_type": "character", "library_section": "05-characters", "walk_rig_candidate": True},
]
```

Also include:

```python
ROOT = Path(__file__).resolve().parents[2]
LIBRARY = ROOT / "video-pipeline" / "asset-library"
SOURCE_ROOT = Path(r"D:\Chrome_Download")
FULLBODY_ID = "CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001"
```

Reject duplicate source names or IDs at module import.

- [ ] **Step 4: Implement deterministic ingestion and metadata**

`ingest_glb_asset_batch.py` must copy each GLB to `source.glb`, calculate SHA-256, import it in a reset Blender scene, and write actual mesh/vertex/polygon/material/armature/bounds data to `model.json`. Use structured JSON updates for `registry/assets.json`; never concatenate JSON strings. Write missing cards without overwriting hand-authored content.

Required metadata shape:

```python
metadata = {
    "id": item["asset_id"],
    "name_zh": item["name_zh"],
    "asset_type": item["asset_type"],
    "source_sha256": sha256(source_bytes).hexdigest(),
    "geometry": audit_result,
    "rig": {"armature_count": 0, "walk_rig_candidate": item["walk_rig_candidate"]},
    "status": "approved_source",
}
```

- [ ] **Step 5: Render individual previews and the nine-item contact sheet**

`render_glb_asset_batch_previews.py` must use an orthographic camera fitted from world-space bounds, neutral dark background, two area lights, 480x720 thumbnails, and ffmpeg `xstack` without `drawtext` dependency. Preserve grid order from `ASSETS` and write a Markdown index table mapping each grid number to its card.

- [ ] **Step 6: Run ingestion, rendering, and GREEN validation**

Run:

```powershell
& 'D:\Softwares\Blender\blender.exe' --background --python 'D:\mythrealms-shop\tools\blender\ingest_glb_asset_batch.py'
& 'D:\Softwares\Blender\blender.exe' --background --python 'D:\mythrealms-shop\tools\blender\render_glb_asset_batch_previews.py'
& 'D:\Softwares\Blender\blender.exe' --background --python 'D:\mythrealms-shop\tools\blender\validate_glb_asset_batch.py'
```

Expected final line: `GLB_ASSET_BATCH_VALIDATION_OK`.

- [ ] **Step 7: Commit the ingestion task**

```powershell
git add -- tools/blender/glb_asset_batch_specs.py tools/blender/validate_glb_asset_batch.py tools/blender/ingest_glb_asset_batch.py tools/blender/render_glb_asset_batch_previews.py video-pipeline/asset-library/03-scene-kits video-pipeline/asset-library/05-characters video-pipeline/asset-library/registry/assets.json video-pipeline/asset-library/obsidian-vault
git commit -m "feat: ingest visualized glb asset batch"
```

---

### Task 2: Promote The Existing Right2 Gold Pack To 30/30 Approved

**Files:**
- Modify: `tools/blender/validate_right2_gold_safe_motion_pack.py`
- Modify: `tools/blender/right2_gold_safe_motion_specs.py`
- Modify: `tools/blender/build_right2_gold_safe_motion_pack.py`
- Create: `tools/blender/promote_right2_gold_safe_pack.py`
- Modify generated metadata/cards under `video-pipeline/asset-library/06-motions/RIGHT2_GOLD_JEWELRY_SAFE_PACK_001/`, `02-camera-rigs/`, `05-characters/CHAR_HUNYUAN_RIGHT2_GOLD_001/`, registry, and Obsidian cards

**Interfaces:**
- Consumes: existing `MOTION_SPECS` and `RIGHT2_GOLD_JEWELRY_SAFE_PACK_v1.blend`.
- Produces: 30 Actions and 30 Cameras whose Blender custom properties, manifest rows, cards, and counts all say `approved`.

- [ ] **Step 1: Change the validator first to require 30 approved items**

Replace the two-approved invariant with:

```python
approved = [entry for entry in entries if entry.get("status") == "approved"]
if len(approved) != 30:
    errors.append(f"expected 30 approved motions, got {len(approved)}")
if manifest.get("approved_count") != 30 or manifest.get("candidate_count") != 0:
    errors.append("manifest approval counts must be 30/0")
```

Also require each paired Camera `status` and `qc_status` to equal `approved`.

- [ ] **Step 2: Run the validator and verify RED**

Expected: failure reporting 2 approved motions and/or candidate metadata.

- [ ] **Step 3: Make approval counts data-driven and promote all specs**

Set every spec status to `approved`. In the builder derive counts instead of hardcoding:

```python
approved_count = sum(item["status"] == "approved" for item in manifest_rows)
candidate_count = len(manifest_rows) - approved_count
manifest["status"] = "approved" if candidate_count == 0 else "candidate_review"
```

`promote_right2_gold_safe_pack.py` must update existing Action/Camera asset custom properties and manifest/card metadata without changing F-curves, camera transforms, catalog IDs, or preview media.

- [ ] **Step 4: Rebuild/synchronize and run GREEN validation**

Run the builder, promotion script, `sync_right2_gold_safe_pack_cards.py`, then the validator. Expected: `RIGHT2_GOLD_SAFE_MOTION_PACK_VALIDATION_OK`, `approved_count=30`, and `candidate_count=0`.

- [ ] **Step 5: Commit the approval promotion**

```powershell
git add -- tools/blender/right2_gold_safe_motion_specs.py tools/blender/build_right2_gold_safe_motion_pack.py tools/blender/promote_right2_gold_safe_pack.py tools/blender/validate_right2_gold_safe_motion_pack.py video-pipeline/asset-library
git commit -m "feat: approve right2 gold motion camera pack"
```

---

### Task 3: Build And Validate The Fullbody Proxy Rig

**Files:**
- Create: `tools/blender/validate_hunyuan_white_coat_fullbody_rig.py`
- Create: `tools/blender/rig_hunyuan_white_coat_fullbody.py`
- Create: `video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001/CHAR_HUNYUAN_WHITE_COAT_FULLBODY_RIG_v1.blend`
- Modify: that character's `model.json`, `Instructions.md`, and Obsidian card

**Interfaces:**
- Produces: objects `MESH_WHITE_COAT_HIRES`, `MESH_WHITE_COAT_PROXY`, and `RIG_WHITE_COAT_FULLBODY`.
- Produces bones `root`, `pelvis`, `spine_01`, `spine_02`, `chest`, `neck`, `head`, left/right clavicle/upper_arm/forearm/hand, upper_leg/lower_leg/foot/toe, foot IK controls, and knee poles.
- Produces custom property `rig_version=1` and a hidden non-rendering proxy retaining transferred vertex groups.

- [ ] **Step 1: Write the failing rig validator**

Require the output Blend, exact objects/bones, source vertex count >= 290,000, proxy vertex count between 20,000 and 35,000, an Armature modifier on the high-res mesh, non-empty leg groups, and no unweighted high-res vertices.

Use the real weight check:

```python
deform_names = {bone.name for bone in rig.data.bones if bone.use_deform}
unweighted = 0
for vertex in hires.data.vertices:
    total = sum(group.weight for group in vertex.groups
                if hires.vertex_groups[group.group].name in deform_names)
    if total < 0.001:
        unweighted += 1
if unweighted:
    errors.append(f"unweighted high-res vertices={unweighted}")
```

- [ ] **Step 2: Run validator and verify RED because the Rig Blend is absent**

- [ ] **Step 3: Implement normalized import, proxy generation, and full humanoid rig**

Import `source.glb`, rename the high-res mesh, preserve its material, duplicate and apply Decimate to the proxy target range, then create the armature from measured body height. Bone placement must use normalized proportions and left/right mesh bounds; do not reuse the upper-body-only Right2 rig.

Add lower-limb IK constraints with chain length 2, knee poles, and explicit pole angles. Store joint-limit metadata on the rig:

```python
rig["joint_limits_deg"] = json.dumps({
    "upper_leg": {"flexion": [-20, 45], "abduction": [-12, 12]},
    "lower_leg": {"flexion": [0, 65]},
    "foot": {"pitch": [-25, 25]},
})
```

- [ ] **Step 4: Bind proxy and transfer weights to the preserved high-res mesh**

Parent proxy with automatic weights, repair failed/empty groups before transfer, then add a Data Transfer modifier to high-res using `NEAREST_POLYNOR` vertex mapping and transfer vertex-group weights. Apply Data Transfer, add Armature modifier, hide proxy in renders, and save the Rig Blend.

- [ ] **Step 5: Run rig validator and inspect five neutral deformation checkpoints**

Render neutral, left-contact, right-contact, left-knee-lift, and right-knee-lift stills. Expected: validator prints `WHITE_COAT_FULLBODY_RIG_VALIDATION_OK`; no reversed knee, floor penetration, detached limb, or destroyed coat silhouette.

- [ ] **Step 6: Commit the fullbody rig**

```powershell
git add -- tools/blender/validate_hunyuan_white_coat_fullbody_rig.py tools/blender/rig_hunyuan_white_coat_fullbody.py video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001
git commit -m "feat: rig fullbody white coat model"
```

---

### Task 4: Build Three Walk Actions And Paired Cameras

**Files:**
- Create: `tools/blender/white_coat_walk_specs.py`
- Create: `tools/blender/validate_white_coat_walk_pack.py`
- Create: `tools/blender/build_white_coat_walk_pack.py`
- Create: `video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/WHITE_COAT_WALK_PACK_v1.blend`
- Create: `video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/motion_manifest.json`

**Interfaces:**
- Consumes: `CHAR_HUNYUAN_WHITE_COAT_FULLBODY_RIG_v1.blend` and the exact rig object/bone names from Task 3.
- Produces: Actions `ACT_WHITE_COAT_RUNWAY_WALK_01`, `ACT_WHITE_COAT_WALK_IN_STOP_01`, and `ACT_WHITE_COAT_TRACKING_PASS_01`, paired with Cameras `CAM_WHITE_COAT_RUNWAY_DOLLY_01`, `CAM_WHITE_COAT_WALK_IN_STOP_01`, and `CAM_WHITE_COAT_TRACKING_PASS_01`; each is 96 frames at 24 fps.
- Produces: per-action `planted_intervals` metadata used by validation.

- [ ] **Step 1: Write gait specs and the failing walk-pack validator**

Represent each planted interval explicitly:

```python
WALKS = [
    {
        "action_id": "ACT_WHITE_COAT_RUNWAY_WALK_01",
        "camera_id": "CAM_WHITE_COAT_RUNWAY_DOLLY_01",
        "frames": 96,
        "planted_intervals": {"L": [(1, 12), (49, 60)], "R": [(25, 36), (73, 84)]},
        "status": "candidate",
    },
    {
        "action_id": "ACT_WHITE_COAT_WALK_IN_STOP_01",
        "camera_id": "CAM_WHITE_COAT_WALK_IN_STOP_01",
        "frames": 96,
        "planted_intervals": {"L": [(1, 14), (49, 64)], "R": [(25, 40), (73, 96)]},
        "status": "candidate",
    },
    {
        "action_id": "ACT_WHITE_COAT_TRACKING_PASS_01",
        "camera_id": "CAM_WHITE_COAT_TRACKING_PASS_01",
        "frames": 96,
        "planted_intervals": {"L": [(1, 12), (49, 60)], "R": [(25, 36), (73, 84)]},
        "status": "candidate",
    },
]
```

Validator requirements: exact IDs, frame range 1..96, fps 24, Action/Camera asset marks, catalog IDs, IK curves, root forward displacement, declared status, and no missing keyframes at gait phase boundaries.

- [ ] **Step 2: Run validator and verify RED because the walk pack does not exist**

- [ ] **Step 3: Implement conservative gait generation**

Create contact/down/passing/up poses for alternating feet. During planted intervals keep each IK controller at constant world position while root and pelvis advance. Limit pelvis vertical motion to a small fraction of body height, pelvis yaw to <= 4 degrees, shoulder counter-rotation to <= 3 degrees, and head yaw/roll to <= 1.5 degrees. Use Bezier handles with no overshoot on feet and pelvis.

`ACT_WHITE_COAT_WALK_IN_STOP_01` must ease root speed to zero over the last step and hold a stable final pose for at least 12 frames. Do not create a teleport or a last-frame pose snap.

- [ ] **Step 4: Build the paired cameras and asset metadata**

Create fullbody dolly-back, walk-in stop, and three-quarter parallel tracking cameras. Use stable horizon, lens range 55-75 mm, visible feet, and a focus Empty near chest height. Mark Actions/Cameras as assets under Chinese walk-motion and camera catalogs.

- [ ] **Step 5: Run GREEN validation and numerical planted-foot checks**

For every planted interval, sample the foot IK world location each frame and require horizontal drift <= 0.01 body-height units and floor error <= 0.005 body-height units. Expected final line: `WHITE_COAT_WALK_PACK_VALIDATION_OK`.

- [ ] **Step 6: Commit the walk pack**

```powershell
git add -- tools/blender/white_coat_walk_specs.py tools/blender/validate_white_coat_walk_pack.py tools/blender/build_white_coat_walk_pack.py video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001 video-pipeline/asset-library/blender_assets.cats.txt
git commit -m "feat: add white coat walk motion tests"
```

---

### Task 5: Render Review Media, Cards, And Final Verification

**Files:**
- Create: `tools/blender/render_white_coat_walk_pack_previews.py`
- Create: `tools/blender/build_white_coat_walk_review_sheet.py`
- Create: `tools/blender/sync_white_coat_walk_pack_cards.py`
- Create: three MP4 previews and checkpoint frames under `video-pipeline/asset-library/06-motions/WHITE_COAT_WALK_PACK_001/preview/`
- Create: independent motion/camera Instructions and Obsidian cards for the six assets

**Interfaces:**
- Consumes: validated walk pack and manifest from Task 4.
- Produces: three 4-second 640x360 H.264 MP4 files, checkpoint frames, one review sheet, one combined 12-second reel, and six cards.

- [ ] **Step 1: Add preview requirements to the validator and verify RED**

Require each manifest preview, six cards, review sheet, and combined reel. Use ffprobe to require each clip to be 96 frames, 24 fps, and 4.000 seconds.

- [ ] **Step 2: Implement deterministic rendering and encoding**

Render PNG frames from each paired camera, encode with ffmpeg, and concatenate the three clips. Skip a render only when exactly 96 valid frames and a passing ffprobe result already exist.

- [ ] **Step 3: Build the review sheet and synchronize cards**

The review sheet must show frames 1, 12, 24, 36, 48, 60, 72, 84, and 96 for each action. Cards link the exact action, paired camera, Blend, manifest, MP4, and review sheet; status remains `candidate`.

- [ ] **Step 4: Perform visual and numerical final review**

Inspect the review sheet and all three MP4s for knee direction, planted feet, head stability, pelvis amplitude, arm/body intersections, coat tearing, and final-pose stability. Re-run the ingestion validator, Right2 Gold validator, fullbody-rig validator, and walk-pack validator.

Expected final evidence:

```text
GLB_ASSET_BATCH_VALIDATION_OK
RIGHT2_GOLD_SAFE_MOTION_PACK_VALIDATION_OK
WHITE_COAT_FULLBODY_RIG_VALIDATION_OK
WHITE_COAT_WALK_PACK_VALIDATION_OK
```

- [ ] **Step 5: Commit review media and cards**

```powershell
git add -- tools/blender/render_white_coat_walk_pack_previews.py tools/blender/build_white_coat_walk_review_sheet.py tools/blender/sync_white_coat_walk_pack_cards.py video-pipeline/asset-library
git commit -m "feat: add white coat walk review assets"
```

- [ ] **Step 6: Run final scoped hygiene checks**

```powershell
python -m py_compile tools/blender/glb_asset_batch_specs.py tools/blender/ingest_glb_asset_batch.py tools/blender/validate_glb_asset_batch.py tools/blender/rig_hunyuan_white_coat_fullbody.py tools/blender/validate_hunyuan_white_coat_fullbody_rig.py tools/blender/white_coat_walk_specs.py tools/blender/build_white_coat_walk_pack.py tools/blender/validate_white_coat_walk_pack.py
git diff --check -- tools/blender video-pipeline/asset-library docs/superpowers
```

Expected: Python exits 0 and scoped `git diff --check` reports no whitespace errors.
