"""Generate MythRealms blocking/action draft assets in Blender 5+."""
from pathlib import Path
import bpy, math

ROOT=Path(__file__).resolve().parent
CAT="15fc32ae-26a7-4c86-b2a0-01381e7b00af"
SPECS=[
('BLOCK_SINGLE_MODEL_PRODUCT_001','单模特产品展示站位',1,'still'),('BLOCK_DUAL_MODEL_SYMMETRY_001','双模特对称站位',2,'sym'),('BLOCK_FOUR_MODEL_WALK_001','四模特走位',4,'walk'),('BLOCK_FIVE_MODEL_CENTER_001','五人C位构图',5,'center'),('BLOCK_TRIANGLE_NOIR_001','三角站位',3,'triangle'),('ACT_HEAD_TURN_SLOW_001','模特回头动作',1,'turn'),('ACT_TOUCH_EARRING_001','抚摸耳环动作',1,'touch'),('ACT_HEAD_LIFT_SLOW_001','缓慢抬头动作',1,'lift'),('ACT_HAND_ENTER_FRAME_001','手部进入画面动作',1,'hand')]
def clear():
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 for c in list(bpy.data.collections):bpy.data.collections.remove(c)
def person(col,i,x=0,y=0):
 bpy.ops.mesh.primitive_cylinder_add(vertices=16,radius=.45,depth=2,location=(x,y,1));o=bpy.context.object;o.name=f'MODEL_{i:02d}__REPLACE_ME'
 for c in list(o.users_collection):c.objects.unlink(o)
 col.objects.link(o);return o
def build(id,name,n,mode):
 clear();s=bpy.context.scene;s.render.fps=30;s.frame_start=1;s.frame_end=180
 col=bpy.data.collections.new(id);s.collection.children.link(col);models=[]
 for i in range(n):
  x=(i-(n-1)/2)*1.35;y=abs(i-(n-1)/2)*.35 if mode in ('triangle','center') else 0;models.append(person(col,i+1,x,y))
 focus=bpy.data.objects.new('FOCUS_TARGET__PRODUCT',None);col.objects.link(focus);focus.location=(0,-.25,1.55)
 if mode=='walk':
  for i,o in enumerate(models):o.location.x-=1;o.keyframe_insert('location',frame=1);o.location.x+=2;o.keyframe_insert('location',frame=180)
 if mode=='turn': models[0].rotation_euler=(0,0,math.radians(-35));models[0].keyframe_insert('rotation_euler',frame=1);models[0].rotation_euler=(0,0,math.radians(25));models[0].keyframe_insert('rotation_euler',frame=150)
 if mode=='lift': models[0].rotation_euler=(math.radians(12),0,0);models[0].keyframe_insert('rotation_euler',frame=1);models[0].rotation_euler=(math.radians(-8),0,0);models[0].keyframe_insert('rotation_euler',frame=150)
 if mode in ('touch','hand'):
  bpy.ops.mesh.primitive_uv_sphere_add(segments=16,location=(1.5,-.2,1.5));h=bpy.context.object;h.name='HAND_PROXY__REPLACE_ME'
  for c in list(h.users_collection):c.objects.unlink(h)
  col.objects.link(h);h.keyframe_insert('location',frame=1);h.location.x=.3;h.keyframe_insert('location',frame=110)
 col.asset_mark();col.asset_data.catalog_id=CAT;col.asset_data.description=name;col['asset_id']=id;col['default_import']='append'
 d=ROOT/id;d.mkdir(exist_ok=True);bpy.ops.wm.save_as_mainfile(filepath=str(d/(id+'_v1.blend')));(d/'Instructions.md').write_text(f'# {name}\n\nAppend 此站位/动作；用真实角色替换 `MODEL_*__REPLACE_ME`，产品焦点对齐 `FOCUS_TARGET__PRODUCT`。\n',encoding='utf8')
for x in SPECS:build(*x)
