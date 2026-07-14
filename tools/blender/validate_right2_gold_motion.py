import bpy
import math
import os
import sys
import traceback

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


try:
    assert_limits(sample_action(LEGACY_ACTION, "CAM_RIGHT2_GOLD_UPPER_BODY_SHOWREEL", 1, 240))
    assert PROTOTYPE_ACTION in bpy.data.actions, f"Missing {PROTOTYPE_ACTION}"
    assert PROTOTYPE_CAMERA in bpy.data.objects, f"Missing {PROTOTYPE_CAMERA}"
    assert_limits(sample_action(PROTOTYPE_ACTION, PROTOTYPE_CAMERA, 1, 72), bone_deg=1.25, camera_m=0.03, camera_deg=1.0, lens_mm=1.0)
except Exception:
    traceback.print_exc()
    sys.stderr.flush()
    sys.stdout.flush()
    os._exit(1)

print("RIGHT2_GOLD_MOTION_VALIDATION_OK")
