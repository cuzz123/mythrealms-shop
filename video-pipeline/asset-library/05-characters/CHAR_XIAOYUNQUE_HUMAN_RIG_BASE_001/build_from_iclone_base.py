"""Create a neutral director mannequin from the locally installed iClone T-pose base."""
from pathlib import Path
import bpy

ROOT=Path(__file__).resolve().parent
SOURCE=Path(r'D:\Softwares\reallusion\iClone 8\Program\Assets\iClone\MotionMatchingTpose.fbx')
OUT=ROOT/'CHAR_XIAOYUNQUE_HUMAN_RIG_BASE_001.blend'
PREVIEW=ROOT/'Preview.png'
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.fbx(filepath=str(SOURCE))
imported=list(bpy.context.scene.objects)
# iClone FBX arrives Y-up in this import path. Rotate one outer root, keeping
# every original armature/mesh parent relation and skin binding intact.
axis_root=bpy.data.objects.new('XYQ_AXIS_CONVERSION_ROOT',None);bpy.context.scene.collection.objects.link(axis_root);axis_root.rotation_euler=(1.5708,0,0)
for obj in imported:
 if obj.parent is None: obj.parent=axis_root
arm=next(o for o in bpy.context.scene.objects if o.type=='ARMATURE')
body=next(o for o in bpy.context.scene.objects if o.name=='CC_Base_Body')
for o in bpy.context.scene.objects:
 if o not in (arm,body): o.hide_render=True;o.hide_viewport=True
mat=bpy.data.materials.new('Xiaoyunque_Matte_Lavender');mat.use_nodes=True
bsdf=mat.node_tree.nodes.get('Principled BSDF')
if bsdf: bsdf.inputs['Base Color'].default_value=(.57,.32,.76,1);bsdf.inputs['Roughness'].default_value=.48
body.data.materials.clear();body.data.materials.append(mat);body.name='XYQ_HUMAN_MANNEQUIN_BODY';arm.name='XYQ_HUMAN_97_BONE_RIG'
for b in arm.data.bones:b.use_deform=True
arm['asset_id']='CHAR_XIAOYUNQUE_HUMAN_RIG_BASE_001';arm['source']='local iClone MotionMatchingTpose base';arm['bone_count']=len(arm.data.bones)
scene=bpy.context.scene;scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=540;scene.render.resolution_y=960;scene.world.color=(.035,.04,.055)
bpy.ops.object.light_add(type='AREA',location=(-3,-5,5));bpy.context.object.data.energy=1100;bpy.context.object.data.size=5
bpy.ops.object.camera_add(location=(0,-8,1.25));cam=bpy.context.object;cam.data.lens=48;from mathutils import Vector;cam.rotation_euler=(Vector((0,0,1.0))-cam.location).to_track_quat('-Z','Y').to_euler();scene.camera=cam
bpy.ops.wm.save_as_mainfile(filepath=str(OUT));scene.render.filepath=str(PREVIEW);bpy.ops.render.render(write_still=True)
