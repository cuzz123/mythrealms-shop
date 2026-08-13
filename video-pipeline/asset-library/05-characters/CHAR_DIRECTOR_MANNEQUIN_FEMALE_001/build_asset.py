from pathlib import Path
import importlib.util
import bpy

root = Path(__file__).resolve().parent
source = root.parents[3] / 'tools' / 'blender' / 'garage_mannequin_director_stage.py'
spec = importlib.util.spec_from_file_location('director_stage', source)
stage = importlib.util.module_from_spec(spec)
spec.loader.exec_module(stage)
stage.OUTPUT_DIR = root
stage.OUTPUT_BLEND = root / 'CHAR_DIRECTOR_MANNEQUIN_FEMALE_001_v1.blend'
stage.PREVIEW_DIR = root / 'preview_frames'
stage.ANIMATION_FRAMES_DIR = root / 'animation_frames'
stage.ensure_dirs()
stage.setup_scene()
bpy.ops.wm.save_as_mainfile(filepath=str(stage.OUTPUT_BLEND))
print(stage.OUTPUT_BLEND)
