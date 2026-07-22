"""Combine local iClone 97-bone rig with its full-body source mesh for director blocking."""
from pathlib import Path
import bpy, math
from mathutils import Vector
ROOT=Path(__file__).resolve().parent
FBX=Path(r'D:\Softwares\reallusion\iClone 8\Program\Assets\iClone\MotionMatchingTpose.fbx')
OBJ=Path(r'D:\Softwares\reallusion\iClone 8\Program\Assets\Share\StandardSeriesConverter\FullBodySource.obj')
OUT=ROOT/'CHAR_XIAOYUNQUE_HUMAN_VISUAL_BASE_001.blend';PREVIEW=ROOT/'Visual_base_preview.png'
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.fbx(filepath=str(FBX));arm=next(o for o in bpy.context.scene.objects if o.type=='ARMATURE')
for o in list(bpy.context.scene.objects):
 if o.type!='ARMATURE': bpy.data.objects.remove(o,do_unlink=True)
bpy.ops.wm.obj_import(filepath=str(OBJ));body=max((o for o in bpy.context.scene.objects if o.type=='MESH'),key=lambda o:len(o.data.vertices))
for o in list(bpy.context.scene.objects):
 if o.type=='MESH' and o!=body:bpy.data.objects.remove(o,do_unlink=True)
body.scale=(.01,.01,.01);body.rotation_euler=(math.pi/2,0,0);bpy.context.view_layer.objects.active=body;body.select_set(True);bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
mat=bpy.data.materials.new('Xiaoyunque_Matte_Lavender');mat.use_nodes=True;bsdf=mat.node_tree.nodes.get('Principled BSDF')
if bsdf:bsdf.inputs['Base Color'].default_value=(.57,.32,.76,1);bsdf.inputs['Roughness'].default_value=.46
body.data.materials.clear();body.data.materials.append(mat);body.name='XYQ_HUMAN_MANNEQUIN_BODY';arm.name='XYQ_HUMAN_97_BONE_RIG'
# Keep the rig as a reference object only. Its bind pose differs from the OBJ,
# so automatic weights would corrupt this visual base.
arm.hide_render=True;arm.hide_viewport=True
body['asset_id']='CHAR_XIAOYUNQUE_HUMAN_VISUAL_BASE_001';body['rig_status']='visual base only; awaiting retargeted bind pose'
s=bpy.context.scene;s.render.engine='BLENDER_EEVEE';s.render.resolution_x=540;s.render.resolution_y=960;s.world.color=(.035,.04,.055)
bpy.ops.object.light_add(type='AREA',location=(-3,-4,5));bpy.context.object.data.energy=1100;bpy.context.object.data.size=5
bpy.ops.object.camera_add(location=(0,-8,1.05));cam=bpy.context.object;cam.data.lens=48;cam.rotation_euler=(Vector((0,0,.9))-cam.location).to_track_quat('-Z','Y').to_euler();s.camera=cam
bpy.ops.wm.save_as_mainfile(filepath=str(OUT));s.render.filepath=str(PREVIEW);bpy.ops.render.render(write_still=True)
