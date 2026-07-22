"""Build four mannequin-only camera rehearsals; render locally when review is needed."""
from pathlib import Path
import bpy
from mathutils import Vector

ROOT=Path(__file__).resolve().parent
MANNEQUIN=ROOT.parents[1]/'05-characters'/'CHAR_XIAOYUNQUE_MANNEQUIN_001'/'CHAR_XIAOYUNQUE_MANNEQUIN_FEMALE_002.blend'
SHOTS=[('REHEARSAL_ORBIT_EAR',1,'orbit'),('REHEARSAL_BACK_TO_FRONT',1,'back'),('REHEARSAL_FOUR_MODEL_SLIDE',4,'slide'),('REHEARSAL_OVERHEAD_DROP',1,'drop')]
SHOTS += [
 ('CINEMA_SYMMETRY_DOLLY_001',1,'symmetry'),
 ('CINEMA_LATERAL_PARALLAX_001',3,'parallax'),
 ('CINEMA_TRIANGLE_ENSEMBLE_001',3,'triangle'),
 ('CINEMA_LONG_TAKE_FOLLOW_001',1,'follow'),
 ('CINEMA_SUSPENSE_ORBIT_001',1,'suspense'),
 ('CINEMA_HERO_LOW_ORBIT_001',1,'hero_orbit'),
 ('CINEMA_DU_QIFENG_FOUR_BLOCKING_001',4,'du_four'),
 ('CINEMA_MOTIVATED_FOREGROUND_TRANSITION_001',1,'spielberg_transition'),
]
def look(o,t):o.rotation_euler=(Vector(t)-o.location).to_track_quat('-Z','Y').to_euler()
def clear():
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 for c in list(bpy.data.collections):bpy.data.collections.remove(c)
def import_model():
 with bpy.data.libraries.load(str(MANNEQUIN),link=False) as (src,dst):dst.collections=[n for n in src.collections if n.startswith('CHAR_XIAOYUNQUE')]
 col=dst.collections[0];bpy.context.scene.collection.children.link(col);return list(col.objects)
def clone(objs,x):
 root=bpy.data.objects.new(f'MANNEQUIN_{x}_ROOT',None);bpy.context.scene.collection.objects.link(root);root.location.x=x
 # Preserve the mannequin's rigid bone-parent graph; move only its armature root.
 rig=next(o for o in objs if o.type=='ARMATURE');rig.parent=root
 return root
def camera(s,kind):
 d=bpy.data.cameras.new('CAMERA');c=bpy.data.objects.new('CAMERA',d);s.collection.objects.link(c);s.camera=c;d.lens=30 if kind=='hero_orbit' else (32 if kind=='du_four' else 50)
 if kind=='orbit':pts=[(3,-7,1),(0,-7,1),(-3,-7,1)]
 elif kind=='back':pts=[(0,7,1),(2,-6,1)]
 elif kind=='slide':pts=[(-7,-8,1),(7,-8,1)]
 elif kind=='symmetry':pts=[(0,-10,1),(0,-5,1)]
 elif kind=='parallax':pts=[(-6,-7,1),(6,-7,1)]
 elif kind=='triangle':pts=[(0,-9,1),(0,-7,1)]
 elif kind=='follow':pts=[(0,-8,1),(0,-5,1)]
 elif kind=='suspense':pts=[(4,-6,1),(-4,-6,1)]
 elif kind=='hero_orbit':pts=[(5,-6,.1),(0,-7,.35),(-5,-5,.65)]
 elif kind=='du_four':pts=[(1.2,-10,.8),(.8,-8.5,.8)]
 elif kind=='spielberg_transition':pts=[(-2.5,-8,1),(0,-7,1),(2.5,-8,1)]
 else:pts=[(0,-.2,10),(0,-.2,5)]
 for f,p in zip((1,90,180),pts if len(pts)==3 else (pts[0],pts[-1],pts[-1])):c.location=p;look(c,(0,0,.8 if kind=='hero_orbit' else .5));c.keyframe_insert('location',frame=f);c.keyframe_insert('rotation_euler',frame=f)
def build(a,n,k):
 clear();s=bpy.context.scene;s.render.engine='BLENDER_EEVEE';s.render.resolution_x=360;s.render.resolution_y=640;s.render.fps=30;s.frame_start=1;s.frame_end=180;s.world.color=(.04,.04,.055)
 objs=import_model();roots=[clone(objs,0)]
 for i in range(1,n):
  copied=[];mapping={}
  for o in objs:
   q=o.copy();q.data=o.data; bpy.context.scene.collection.objects.link(q);copied.append(q);mapping[o]=q
  for original,q in mapping.items():
   if original.parent in mapping:
    q.parent=mapping[original.parent];q.parent_type=original.parent_type;q.parent_bone=original.parent_bone
  roots.append(clone(copied,(i-(n-1)/2)*1.8))
 if k=='du_four':
  for root,loc in zip(roots,[(.15,-2.4,0),(-2.7,.15,0),(2.45,.45,0),(.25,3.0,0)]):root.location=loc
 bpy.ops.mesh.primitive_plane_add(size=30,location=(0,0,-1.05));floor=bpy.context.object
 bpy.ops.object.light_add(type='AREA',location=(-3,-4,5));bpy.context.object.data.energy=1200;bpy.context.object.data.size=5
 bpy.ops.object.light_add(type='AREA',location=(3,2,3));bpy.context.object.data.energy=500;bpy.context.object.data.size=3
 camera(s,k);d=ROOT/a;d.mkdir(exist_ok=True);bpy.ops.wm.save_as_mainfile(filepath=str(d/(a+'_v1.blend')))
 if k=='spielberg_transition':
  bpy.ops.mesh.primitive_cube_add(size=1,location=(-5,-3,1.3));o=bpy.context.object;o.name='FOREGROUND_OCCLUDER__DOORFRAME_OR_PILLAR';o.dimensions=(.75,.55,4.5);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
  o.keyframe_insert('location',frame=1);o.location.x=0;o.keyframe_insert('location',frame=78);o.location.x=5;o.keyframe_insert('location',frame=112)
  bpy.ops.wm.save_as_mainfile(filepath=str(d/(a+'_v1.blend')))
for x in SHOTS:build(*x)
