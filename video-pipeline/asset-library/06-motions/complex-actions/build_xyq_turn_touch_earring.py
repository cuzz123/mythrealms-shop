"""Create a 6-second complex performance test for XiaoYunque mannequin 013.

The action deliberately combines a weight shift, torso turn, right-hand
ear-touch, counterbalancing left arm, then a product-presentation recovery.
It is a rig validation clip rather than a looped idle action.
"""
from pathlib import Path
import bpy

ROOT = Path(__file__).resolve().parent
CHAR_ROOT = ROOT.parents[1] / "05-characters" / "CHAR_XIAOYUNQUE_MANNEQUIN_001"
SOURCE = CHAR_ROOT / "CHAR_XIAOYUNQUE_MANNEQUIN_FEMALE_013_NATURAL_SHELL.blend"
OUT = ROOT / "ACT_XYQ_TURN_TOUCH_EARRING_001.blend"
VIDEO = ROOT / "Preview.mp4"
FRAME_DIR = ROOT / "preview_frames"
CHECKPOINTS = {
    1: ROOT / "Preview_01_ready.png",
    42: ROOT / "Preview_02_turn.png",
    78: ROOT / "Preview_03_touch_ear.png",
    112: ROOT / "Preview_04_present.png",
    144: ROOT / "Preview_05_return.png",
}
RIG = "XYQ_NATURAL_SHELL_55_BONE_RIG"


def reset_pose(rig):
    for bone in rig.pose.bones:
        bone.rotation_mode = "XYZ"
        bone.rotation_euler = (0.0, 0.0, 0.0)
        bone.location = (0.0, 0.0, 0.0)


def key_pose(rig, frame, rotations):
    """Key all deliberately controlled body parts at one storytelling beat."""
    for name, values in rotations.items():
        bone = rig.pose.bones[name]
        bone.rotation_mode = "XYZ"
        bone.rotation_euler = values
        bone.keyframe_insert(data_path="rotation_euler", frame=frame, group=name)


def create_hand_ik(rig):
    """Use an explicit right-wrist target so the hand actually reaches the ear.

    Raw Euler rotations are useful for broad acting, but they are unreliable
    for a precise hand-to-ear contact.  This small two-bone IK setup makes the
    key storytelling pose anatomically coherent and remains visible in the
    saved action blend for adjustment.
    """
    target = bpy.data.objects.new("XYQ_ACTION_RIGHT_HAND_TARGET", None)
    bpy.context.scene.collection.objects.link(target)
    target.empty_display_type = "SPHERE"
    target.empty_display_size = .045
    target.hide_render = True
    hand = rig.pose.bones["hand.R"]
    constraint = hand.constraints.new("IK")
    constraint.name = "RIGHT_HAND_EAR_CONTACT_IK"
    constraint.target = target
    constraint.chain_count = 3
    constraint.use_tail = True
    constraint.use_stretch = False
    return target


def key_target(target, frame, location):
    target.location = location
    target.keyframe_insert(data_path="location", frame=frame)


def poses(rig, right_hand_target):
    # Right and left arm local-Y signs are opposite because the bone heads point
    # in opposite X directions.  This makes the sequence genuinely asymmetric.
    ready = {
        "pelvis": (0, 0, 0), "spine_01": (0, 0, 0), "spine_02": (0, 0, 0), "spine": (0, 0, 0),
        "neck": (0, 0, 0), "head": (0, 0, 0),
        "upper_arm.R": (0, .18, .02), "forearm.R": (0, .06, 0), "hand.R": (0, 0, 0),
        "upper_arm.L": (0, -.70, -.03), "forearm.L": (0, -.10, 0), "hand.L": (0, 0, 0),
        "thigh.R": (0, -.05, -.02), "thigh.L": (0, .05, .02),
    }
    turn = {
        "pelvis": (0, 0, -.045), "spine_01": (0, 0, -.060), "spine_02": (.02, 0, -.075), "spine": (.025, 0, -.09),
        "neck": (0, 0, -.06), "head": (0, 0, -.08),
        "upper_arm.R": (0, .10, .04), "forearm.R": (0, .10, .02), "hand.R": (0, .02, .04),
        "upper_arm.L": (0, -.68, -.04), "forearm.L": (0, -.10, -.01), "hand.L": (0, 0, -.04),
        "thigh.R": (0, -.08, -.035), "thigh.L": (0, .06, .03),
    }
    touch = {
        "pelvis": (0, 0, -.075), "spine_01": (.025, 0, -.095), "spine_02": (.035, 0, -.12), "spine": (.045, 0, -.15),
        "neck": (.025, 0, -.09), "head": (.015, 0, -.12),
        "upper_arm.R": (0, 0, .02), "forearm.R": (0, 0, 0), "hand.R": (0, 0, .10),
        "upper_arm.L": (0, -.64, -.06), "forearm.L": (0, -.10, -.02), "hand.L": (.02, 0, -.05),
        "thigh.R": (0, -.10, -.05), "thigh.L": (0, .08, .04),
    }
    present = {
        "pelvis": (0, 0, -.025), "spine_01": (0, 0, -.03), "spine_02": (.01, 0, -.04), "spine": (.015, 0, -.055),
        "neck": (0, 0, -.025), "head": (0, 0, -.04),
        "upper_arm.R": (0, .02, -.10), "forearm.R": (0, .08, -.16), "hand.R": (.02, 0, -.18),
        "upper_arm.L": (0, -.52, .04), "forearm.L": (0, -.10, .04), "hand.L": (0, 0, .08),
        "thigh.R": (0, -.03, -.02), "thigh.L": (0, .03, .02),
    }
    # Frame layout: settle -> turn -> ear detail hold -> reveal -> settle.
    # Target path: neutral hand -> precise right-ear contact -> forward reveal.
    key_target(right_hand_target, 1, (1.16, 0.0, 1.34))
    key_target(right_hand_target, 24, (1.16, 0.0, 1.34))
    key_target(right_hand_target, 42, (.62, -.03, 1.46))
    key_target(right_hand_target, 66, (.21, -.16, 1.62))
    key_target(right_hand_target, 84, (.21, -.16, 1.62))
    key_target(right_hand_target, 112, (.62, -.52, 1.25))
    key_target(right_hand_target, 132, (1.16, 0.0, 1.34))
    key_target(right_hand_target, 144, (1.16, 0.0, 1.34))
    key_pose(rig, 1, ready)
    key_pose(rig, 24, ready)
    key_pose(rig, 42, turn)
    key_pose(rig, 66, touch)
    key_pose(rig, 84, touch)
    key_pose(rig, 112, present)
    key_pose(rig, 132, ready)
    key_pose(rig, 144, ready)


def set_interpolation(action):
    # Blender 5 keeps fcurves inside action layers / strips / channel bags.
    for layer in action.layers:
        for strip in layer.strips:
            for bag in strip.channelbags:
                for fcurve in bag.fcurves:
                    for point in fcurve.keyframe_points:
                        point.interpolation = "BEZIER"


def main():
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
    scene = bpy.context.scene
    rig = bpy.data.objects[RIG]
    reset_pose(rig)
    rig.animation_data_clear()
    action = bpy.data.actions.new("ACT_XYQ_TURN_TOUCH_EARRING_001")
    action["category"] = "complex performance validation"
    action["description"] = "turn, touch right ear, recover into presentation"
    rig.animation_data_create()
    rig.animation_data.action = action
    right_hand_target = create_hand_ik(rig)
    poses(rig, right_hand_target)
    set_interpolation(action)
    scene.frame_start, scene.frame_end = 1, 144
    scene.render.fps = 24
    scene.render.resolution_x, scene.render.resolution_y = 600, 800
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True
    for frame, path in CHECKPOINTS.items():
        scene.frame_set(frame)
        scene.render.filepath = str(path)
        bpy.ops.render.render(write_still=True)
    # Render a compact PNG sequence; the caller encodes it to MP4 using the
    # installed ffmpeg build because Blender 5.1 removed FFMPEG from the image
    # settings enum used by older scripts.
    scene.frame_set(1)
    FRAME_DIR.mkdir(parents=True, exist_ok=True)
    scene.render.image_settings.file_format = "PNG"
    scene.render.resolution_percentage = 75
    scene.render.filepath = str(FRAME_DIR / "frame_")
    bpy.ops.render.render(animation=True)
    scene.render.resolution_percentage = 100
    scene.frame_set(1)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT))


if __name__ == "__main__":
    main()
