"""Generate the nine remaining MythRealms camera-rig draft assets in Blender 5+."""
from pathlib import Path
import bpy, math
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
CATALOG = "85fc32ae-26a7-4c86-b2a0-01381e7b00a6"
RIGS = [
 ("CAM_ORBIT_EAR_REVEAL_50MM_001",50,"orbit_ear"),
 ("CAM_MULTI_MODEL_SLIDE_50MM_001",50,"slide"),
 ("CAM_RACK_FOCUS_BOKEH_85MM_001",85,"rack"),
 ("CAM_BACK_TO_FRONT_ORBIT_50MM_001",50,"back_orbit"),
 ("CAM_OVERHEAD_DROP_35MM_001",35,"drop"),
 ("CAM_SURFACE_MACRO_TRACK_100MM_001",100,"surface"),
 ("CAM_MIRROR_REVEAL_50MM_001",50,"mirror"),
 ("CAM_FOREGROUND_WIPE_35MM_001",35,"wipe"),
 ("CAM_WHIP_PAN_TRANSITION_35MM_001",35,"whip"),
]
def look(o,t): o.rotation_euler=(Vector(t)-o.location).to_track_quat('-Z','Y').to_euler()
def clear():
 bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
 for c in list(bpy.data.collections): bpy.data.collections.remove(c)
def mat(n,c):
 m=bpy.data.materials.new(n); m.diffuse_color=c; return m
def k(cam,f,p,t=(0,0,0)):
 cam.location=p; look(cam,t); cam.keyframe_insert('location',frame=f); cam.keyframe_insert('rotation_euler',frame=f)
def build(asset,lens,kind):
 clear(); s=bpy.context.scene; s.render.fps=30; s.frame_start=1; s.frame_end=180; s.render.resolution_x=1080; s.render.resolution_y=1920
 rig=bpy.data.collections.new(asset); s.collection.children.link(rig)
 slot=bpy.data.collections.new('PRODUCT_SLOT__REPLACE_ME'); rig.children.link(slot)
 focus=bpy.data.objects.new('FOCUS_TARGET__PRODUCT',None); rig.objects.link(focus)
 # Generic proxy: gold hoop + pearl; replace the slot collection in real use.
 gold=mat('Proxy_Gold',(0.7,0.22,0.03,1)); pearl=mat('Proxy_Pearl',(0.96,0.86,0.7,1))
 bpy.ops.mesh.primitive_torus_add(major_radius=.8,minor_radius=.05,location=(0,0,0),rotation=(math.pi/2,0,0)); hoop=bpy.context.object; hoop.data.materials.append(gold)
 bpy.ops.mesh.primitive_uv_sphere_add(segments=32,location=(0,0,-.8),scale=(.25,.12,.25)); gem=bpy.context.object; gem.data.materials.append(pearl)
 for o in (hoop,gem):
  for c in list(o.users_collection): c.objects.unlink(o)
  slot.objects.link(o)
 camd=bpy.data.cameras.new(asset); camd.lens=lens; camd.dof.use_dof=True; camd.dof.focus_object=focus; camd.dof.aperture_fstop=2.8
 cam=bpy.data.objects.new(asset,camd); rig.objects.link(cam); s.camera=cam
 if kind=='orbit_ear': k(cam,1,(2,-9,.6)); k(cam,180,(-2,-8,.3))
 elif kind=='slide': k(cam,1,(-5,-10,.2)); k(cam,180,(5,-10,.2))
 elif kind=='rack':
  bokeh=bpy.data.objects.new('FOCUS_TARGET__BOKEH',None); rig.objects.link(bokeh); bokeh.location=(0,-3,1); camd.dof.focus_object=bokeh; camd.dof.focus_object=focus; k(cam,1,(0,-11,.2)); k(cam,180,(0,-8,.1))
 elif kind=='back_orbit': k(cam,1,(0,9,.5)); k(cam,180,(0,-8,.2))
 elif kind=='drop': k(cam,1,(0,-.1,13)); k(cam,180,(0,-.1,6))
 elif kind=='surface': k(cam,1,(-2,-6,-.6),(-.6,0,-.6)); k(cam,180,(2,-6,.6),(.6,0,.4))
 elif kind=='mirror': k(cam,1,(3,-9,.2)); k(cam,180,(0,-7,.2))
 elif kind=='wipe': k(cam,1,(-2,-9,.2)); k(cam,180,(2,-8,.2))
 elif kind=='whip': k(cam,1,(-4,-8,.2)); k(cam,150,(4,-8,.2)); k(cam,180,(4,-8,.2))
 rig.asset_mark(); rig.asset_data.catalog_id=CATALOG; rig.asset_data.description=f'{asset}，6秒、30fps、可替换产品插槽。'; rig['asset_id']=asset; rig['default_import']='append'
 d=ROOT/asset; d.mkdir(exist_ok=True); bpy.ops.wm.save_as_mainfile(filepath=str(d/(asset+'_v1.blend')))
 (d/'Instructions.md').write_text(f'# {asset}\n\nDraft Camera Rig。使用时 Append 相机 Rig，Link 正式产品到 `PRODUCT_SLOT__REPLACE_ME`，并移动 `FOCUS_TARGET__PRODUCT`。\n',encoding='utf-8')
for spec in RIGS: build(*spec)
