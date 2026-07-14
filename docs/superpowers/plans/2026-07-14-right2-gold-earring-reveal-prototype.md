# RIGHT2 Gold Earring Reveal Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the existing one-frame animation and camera pops, then add one reusable 72-frame earring-reveal advertising motion with a dedicated preview camera.

**Architecture:** Keep the existing Blender rebuild script as the source of truth. Add one Blender-side validator that evaluates generated Actions and cameras frame by frame, then extend the rebuild script with clamped interpolation, compatible segment boundaries, one new Action, and one preview camera. Rebuild from the original Hunyuan source and validate the saved `.blend`, not only the Python source.

**Tech Stack:** Blender 5.1 Python API, `bpy`, `mathutils`, Windows PowerShell, Blender background validation, Blender MCP visual inspection.

## Global Constraints

- Preserve `RIGHT2_GOLD.blend` as the unmodified source asset.
- Do not change mesh topology, materials, or source textures.
- Keep head yaw within 8 degrees, neck yaw within 4 degrees, and chest yaw within 2 degrees for the prototype.
- Existing showreel per-frame limits: bone rotation 2 degrees, camera translation 0.06 meters, camera rotation 2 degrees, focal length 3 mm.
- Prototype remains upper-body previs without facial blendshapes, finger articulation, cloth simulation, or production retopology.

---

### Task 1: Add Blender-Side Continuity Validation

**Files:**
- Create: `tools/blender/validate_right2_gold_motion.py`
- Test: `video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_RIGHT2_GOLD_001/RIGHT2_GOLD_RIGGED_UPPER_BODY_v1.blend`

**Interfaces:**
- Consumes: the open Blender file, `RIG_RIGHT2_GOLD_UPPER_BODY`, `ACT_RIGHT2_GOLD_UPPER_BODY_SHOWREEL_01`, and the active preview cameras.
- Produces: process exit code `0` on success or raises `AssertionError` with all failed continuity checks.

- [ ] **Step 1: Write the failing validator**

Create a script with these checks:

```python
import bpy
import math

RIG = "RIG_RIGHT2_GOLD_UPPER_BODY"
LEGACY_ACTION = "ACT_RIGHT2_GOLD_UPPER_BODY_SHOWREEL_01"
PROTOTYPE_ACTION = "ACT_RIGHT2_GOLD_EARRING_REVEAL_01"
PROTOTYPE_CAMERA = "CAM_RIGHT2_GOLD_EARRING_REVEAL_TEST"


def sample_action(action_name, camera_name, start, end):
    scene = bpy.context.scene
    rig = bpy.data.objects[RIG]
    camera = bpy.data.objects[camera_name]
    rig.animation_data_create()
    rig.animation_data.action = bpy.data.actions[action_name]
    rows = []
    previous = None
    for frame in range(start, end + 1):
        scene.frame_set(frame)
        current = {
            "bones": {
                name: tuple(rig.pose.bones[name].rotation_euler)
                for name in ("chest", "neck", "head")
            },
            "camera_location": camera.matrix_world.translation.copy(),
            "camera_rotation": camera.matrix_world.to_quaternion(),
            "lens": camera.data.lens,
        }
        if previous is not None:
            bone_delta = max(
                math.degrees(abs(current["bones"][name][axis] - previous["bones"][name][axis]))
                for name in current["bones"]
                for axis in range(3)
            )
            rows.append({
                "frame": frame,
                "bone_deg": bone_delta,
                "camera_m": (current["camera_location"] - previous["camera_location"]).length,
                "camera_deg": math.degrees(current["camera_rotation"].rotation_difference(previous["camera_rotation"]).angle),
                "lens_mm": abs(current["lens"] - previous["lens"]),
            })
        previous = current
    return rows


def assert_limits(rows, bone_deg=2.0, camera_m=0.06, camera_deg=2.0, lens_mm=3.0):
    failures = [row for row in rows if row["bone_deg"] > bone_deg or row["camera_m"] > camera_m or row["camera_deg"] > camera_deg or row["lens_mm"] > lens_mm]
    assert not failures, failures[:10]


assert PROTOTYPE_ACTION in bpy.data.actions, f"Missing {PROTOTYPE_ACTION}"
assert PROTOTYPE_CAMERA in bpy.data.objects, f"Missing {PROTOTYPE_CAMERA}"
assert_limits(sample_action(LEGACY_ACTION, "CAM_RIGHT2_GOLD_UPPER_BODY_SHOWREEL", 1, 240))
assert_limits(sample_action(PROTOTYPE_ACTION, PROTOTYPE_CAMERA, 1, 72), bone_deg=1.25, camera_m=0.03, camera_deg=1.0, lens_mm=1.0)
print("RIGHT2_GOLD_MOTION_VALIDATION_OK")
```

- [ ] **Step 2: Run the validator and verify RED**

Run:

```powershell
& 'D:\Softwares\Blender\blender.exe' --background 'D:\mythrealms-shop\video-pipeline\asset-library\05-characters\CHAR_HUNYUAN_RIGHT2_GOLD_001\RIGHT2_GOLD_RIGGED_UPPER_BODY_v1.blend' --python 'D:\mythrealms-shop\tools\blender\validate_right2_gold_motion.py'
```

Expected: non-zero exit with `Missing ACT_RIGHT2_GOLD_EARRING_REVEAL_01`. After temporarily checking the legacy action first, it must also report frame 49 and frame 97 continuity failures.

### Task 2: Implement Clamped Motion and the Earring Reveal Action

**Files:**
- Modify: `tools/blender/rig_hunyuan_right2_gold_upper_body.py:177-360`
- Test: `tools/blender/validate_right2_gold_motion.py`

**Interfaces:**
- Consumes: `create_action(rig, name, poses, description)` and the existing 15-bone upper-body rig.
- Produces: `ACT_RIGHT2_GOLD_EARRING_REVEAL_01` with frame range `1-72` and auto-clamped Bezier keys.

- [ ] **Step 1: Add Blender 5.1 Action curve iteration**

Add helpers that support layered Actions:

```python
def iter_action_fcurves(action):
    if hasattr(action, "fcurves"):
        yield from action.fcurves
        return
    for layer in action.layers:
        for strip in layer.strips:
            for slot in action.slots:
                channelbag = strip.channelbag(slot, ensure=False)
                if channelbag:
                    yield from channelbag.fcurves


def clamp_action_curves(action):
    for fcurve in iter_action_fcurves(action):
        for key in fcurve.keyframe_points:
            key.interpolation = "BEZIER"
            key.handle_left_type = "AUTO_CLAMPED"
            key.handle_right_type = "AUTO_CLAMPED"
```

Call `clamp_action_curves(action)` after all poses are keyed in `create_action`.

- [ ] **Step 2: Add the 72-frame prototype Action**

Append this Action in `create_motion_assets`:

```python
create_action(
    rig,
    "ACT_RIGHT2_GOLD_EARRING_REVEAL_01",
    [
        {"frame": 1},
        {"frame": 12},
        {"frame": 28, "rotations": {
            "chest": (0.0, -0.018, 0.006),
            "neck": (0.0, -0.045, 0.008),
            "head": (-0.008, -0.09, 0.014),
            "clavicle.L": (0.0, 0.0, -0.008),
            "clavicle.R": (0.0, 0.0, 0.006),
        }},
        {"frame": 44, "rotations": {
            "chest": (0.0, 0.012, -0.004),
            "neck": (0.012, 0.025, -0.006),
            "head": (0.018, 0.07, -0.012),
            "clavicle.L": (0.0, 0.0, -0.004),
            "clavicle.R": (0.0, 0.0, 0.003),
        }},
        {"frame": 56, "rotations": {
            "chest": (0.0, 0.009, -0.003),
            "neck": (0.009, 0.02, -0.004),
            "head": (0.014, 0.055, -0.009),
        }},
        {"frame": 72},
    ],
    "Slow three-quarter turn that reveals the near earring and settles without a pose pop.",
)
```

- [ ] **Step 3: Replace one-frame legacy showreel changes with bridges**

Replace the first three showreel sections with these exact compatible keys; keep
the existing frame `145-240` keys unchanged:

```python
poses = [
    {"frame": 1},
    {"frame": 24, "rotations": {
        "spine_02": (0.012, 0.0, 0.0),
        "chest": (-0.016, 0.0, 0.0),
    }, "locations": {"pelvis": (0.0, 0.0, 0.003)}},
    {"frame": 36},
    {"frame": 40, "rotations": {
        "chest": (0.0, -0.01, 0.0),
        "neck": (0.0, -0.02, 0.0),
        "head": (0.0, -0.04, 0.0),
    }},
    {"frame": 52, "rotations": {
        "chest": (0.0, -0.04, 0.0),
        "neck": (0.0, -0.08, 0.0),
        "head": (0.0, -0.16, 0.0),
    }},
    {"frame": 60, "rotations": {
        "chest": (0.0, -0.04, 0.0),
        "neck": (0.0, -0.08, 0.0),
        "head": (0.0, -0.16, 0.0),
    }},
    {"frame": 68, "rotations": {
        "chest": (0.0, 0.015, 0.0),
        "neck": (0.0, 0.03, 0.0),
        "head": (0.0, 0.06, 0.0),
    }},
    {"frame": 80, "rotations": {
        "chest": (0.0, 0.009, 0.0),
        "neck": (0.0, 0.018, 0.0),
        "head": (0.0, 0.035, 0.0),
    }},
    {"frame": 88},
    {"frame": 100, "rotations": {
        "neck": (-0.018, 0.0, 0.0),
        "head": (-0.06, 0.0, 0.0),
    }},
    {"frame": 112, "rotations": {
        "neck": (-0.018, 0.0, 0.0),
        "head": (-0.06, 0.0, 0.0),
    }},
    {"frame": 128, "rotations": {
        "chest": (0.012, 0.0, 0.0),
        "neck": (0.028, 0.0, 0.0),
        "head": (0.08, 0.0, 0.0),
    }},
    {"frame": 140},
    {"frame": 144},
]
```

Replace the legacy camera's frame `1-144` keys with non-adjacent bridges:

```python
keys = [
    (1, (0.48, -1.92, 0.72), (0.0, 0.0, 0.71), 58),
    (40, (0.40, -1.72, 0.74), (0.0, 0.0, 0.74), 64),
    (64, (0.30, -1.42, 0.80), (0.0, 0.0, 0.86), 82),
    (88, (0.46, -1.62, 0.78), (0.0, 0.0, 0.80), 72),
    (112, (0.62, -1.78, 0.70), (0.0, 0.0, 0.72), 64),
    (144, (-0.40, -1.68, 0.74), (0.0, 0.0, 0.75), 62),
]
```

- [ ] **Step 4: Run Python syntax verification**

Run:

```powershell
python -m py_compile 'D:\mythrealms-shop\tools\blender\rig_hunyuan_right2_gold_upper_body.py' 'D:\mythrealms-shop\tools\blender\validate_right2_gold_motion.py'
```

Expected: exit code `0` with no output.

### Task 3: Add the Prototype Camera and Rebuild

**Files:**
- Modify: `tools/blender/rig_hunyuan_right2_gold_upper_body.py:364-473`
- Modify: `video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_RIGHT2_GOLD_001/model.json`
- Modify: `video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_RIGHT2_GOLD_001/Rigging.md`

**Interfaces:**
- Consumes: `key_camera`, the earring Action, and the focus-empty pattern used by the existing camera.
- Produces: `CAM_RIGHT2_GOLD_EARRING_REVEAL_TEST`, a dedicated focus empty, active prototype Action, scene range `1-72`, and updated asset metadata.

- [ ] **Step 1: Add a dedicated prototype camera**

Create a camera using these keys and auto-clamped interpolation:

```python
keys = [
    (1, (0.42, -1.52, 0.86), (0.04, 0.0, 0.94), 78.0, 2.2),
    (24, (0.38, -1.47, 0.88), (0.055, 0.0, 0.97), 81.0, 2.0),
    (48, (0.33, -1.41, 0.90), (0.07, 0.0, 0.99), 85.0, 1.8),
    (72, (0.31, -1.39, 0.90), (0.07, 0.0, 0.99), 86.0, 1.8),
]
```

Use a separate focus empty named `FOCUS_RIGHT2_GOLD_EARRING_REVEAL_TEST`. Set the active scene camera to the prototype camera, the active rig Action to the prototype Action, and the scene range to `1-72`.

- [ ] **Step 2: Rebuild from the source Blender asset**

Open `RIGHT2_GOLD.blend` in Blender and execute the updated rebuild script, saving the result to `RIGHT2_GOLD_RIGGED_UPPER_BODY_v1.blend`.

- [ ] **Step 3: Run the validator and verify GREEN**

Run the Task 1 Blender command again.

Expected: exit code `0` and `RIGHT2_GOLD_MOTION_VALIDATION_OK`.

- [ ] **Step 4: Update metadata and documentation**

Add `ACT_RIGHT2_GOLD_EARRING_REVEAL_01` and `CAM_RIGHT2_GOLD_EARRING_REVEAL_TEST` to `model.json`. Add a prototype motion row and playback instructions to `Rigging.md`.

### Task 4: Render and Inspect Prototype Frames

**Files:**
- Create: `video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_RIGHT2_GOLD_001/preview/rig_v5_earring_reveal/`

**Interfaces:**
- Consumes: the rebuilt Blender file with the prototype camera and Action active.
- Produces: rendered PNGs at frames `1, 12, 28, 36, 44, 56, 72`.

- [ ] **Step 1: Render the seven acceptance frames**

Render with the active camera at frames `1, 12, 28, 36, 44, 56, 72` into `preview/rig_v5_earring_reveal/`.

- [ ] **Step 2: Visually inspect framing and deformation**

Confirm the visible earring remains in frame, head motion reads as one continuous turn, shoulders do not collapse, and no camera or focus pop appears between adjacent samples.

- [ ] **Step 3: Save the final verified Blender file**

Save after setting frame `1`, the prototype camera active, and `ACT_RIGHT2_GOLD_EARRING_REVEAL_01` active.

- [ ] **Step 4: Commit only the implementation-owned text files**

```powershell
git add -- 'tools/blender/rig_hunyuan_right2_gold_upper_body.py' 'tools/blender/validate_right2_gold_motion.py' 'video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_RIGHT2_GOLD_001/model.json' 'video-pipeline/asset-library/05-characters/CHAR_HUNYUAN_RIGHT2_GOLD_001/Rigging.md'
git commit -m 'feat: add right2 gold earring reveal prototype'
```

Do not stage unrelated working-tree changes or binary Blender/PNG outputs.
