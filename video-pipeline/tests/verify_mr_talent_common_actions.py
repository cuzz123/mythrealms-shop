import sys
from pathlib import Path

import bpy


EXPECTED_ACTIONS = {
    "ACT_MR_TALENT_IDLE_WEIGHT_SHIFT_001",
    "ACT_MR_TALENT_WALK_FORWARD_001",
    "ACT_MR_TALENT_SIT_DOWN_001",
    "ACT_MR_TALENT_HEAD_TURN_001",
    "ACT_MR_TALENT_TOUCH_EAR_001",
}

library_path = Path(sys.argv[sys.argv.index("--") + 1])
assert library_path.exists(), f"Motion library missing: {library_path}"

bpy.ops.wm.open_mainfile(filepath=str(library_path))

rig = bpy.data.objects.get("MR_TALENT_ACTION_RIG")
mesh = bpy.data.objects.get("MR_TALENT_MESH")
assert rig and rig.type == "ARMATURE", "Expected the model-specific action armature"
assert mesh and mesh.type == "MESH", "Expected the full-body Hunyuan mesh"
assert mesh.parent == rig, "The Hunyuan mesh must be parented to its action rig"
assert any(mod.type == "ARMATURE" and mod.object == rig for mod in mesh.modifiers), "Mesh must use the action rig modifier"

weighted_vertices = sum(1 for vertex in mesh.data.vertices if vertex.groups)
assert weighted_vertices == len(mesh.data.vertices), "Every Hunyuan mesh vertex must receive skinning weights"

available_actions = {action.name for action in bpy.data.actions}
assert EXPECTED_ACTIONS <= available_actions, f"Missing actions: {sorted(EXPECTED_ACTIONS - available_actions)}"

for action_name in EXPECTED_ACTIONS:
    action = bpy.data.actions[action_name]
    assert action.frame_range[1] >= 72, f"Action too short: {action_name}"

preview_dir = library_path.parent / "previews"
for action_name in EXPECTED_ACTIONS:
    preview = preview_dir / f"{action_name}.mp4"
    assert preview.exists() and preview.stat().st_size > 1024, f"Preview missing: {preview.name}"

print(f"PASS: {library_path.name} contains {len(EXPECTED_ACTIONS)} rigged actions and previews")
