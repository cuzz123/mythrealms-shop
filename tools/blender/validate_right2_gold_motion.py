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


def find_limit_failures(rows, bone_deg=2.0, camera_m=0.06, camera_deg=2.0, lens_mm=3.0):
    return [row for row in rows if row["bone_deg"] > bone_deg or row["camera_m"] > camera_m or row["camera_deg"] > camera_deg or row["lens_mm"] > lens_mm]


def assert_limits(rows, bone_deg=2.0, camera_m=0.06, camera_deg=2.0, lens_mm=3.0):
    failures = find_limit_failures(rows, bone_deg, camera_m, camera_deg, lens_mm)
    assert not failures, failures[:10]


try:
    failures = []

    if PROTOTYPE_ACTION not in bpy.data.actions:
        failures.append(f"Missing {PROTOTYPE_ACTION}")
    if PROTOTYPE_CAMERA not in bpy.data.objects:
        failures.append(f"Missing {PROTOTYPE_CAMERA}")

    legacy_rows = sample_action(LEGACY_ACTION, "CAM_RIGHT2_GOLD_UPPER_BODY_SHOWREEL", 1, 240)
    legacy_bad = find_limit_failures(legacy_rows)
    if legacy_bad:
        failures.append(f"LEGACY_ACTION exceeded limits: {legacy_bad[:10]}")

    if PROTOTYPE_ACTION in bpy.data.actions and PROTOTYPE_CAMERA in bpy.data.objects:
        proto_rows = sample_action(PROTOTYPE_ACTION, PROTOTYPE_CAMERA, 1, 72)
        proto_bad = find_limit_failures(proto_rows, 1.25, 0.03, 1.0, 1.0)
        if proto_bad:
            failures.append(f"PROTOTYPE exceeded limits: {proto_bad[:10]}")

    if failures:
        raise AssertionError("\n".join(failures))
except Exception:
    traceback.print_exc()
    sys.stderr.flush()
    sys.stdout.flush()
    # Blender background mode may return 0 after exceptions or sys.exit; os._exit exposes failure to CI.
    os._exit(1)

print("RIGHT2_GOLD_MOTION_VALIDATION_OK")
