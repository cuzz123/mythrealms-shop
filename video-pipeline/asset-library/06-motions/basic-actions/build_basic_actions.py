"""Create 30 rig-driven XiaoYunque director-stage basic motion assets."""
from pathlib import Path
import bpy, math

ROOT=Path(__file__).resolve().parent
MODEL=ROOT.parents[1]/'05-characters'/'CHAR_XIAOYUNQUE_MANNEQUIN_001'/'CHAR_XIAOYUNQUE_MANNEQUIN_FEMALE_003.blend'
SPECS=[
 ('ACT_IDLE_BREATH_001','spine',.05),('ACT_IDLE_WEIGHT_SHIFT_001','root',.08),('ACT_HEAD_TURN_LEFT_001','head',.35),('ACT_HEAD_TURN_RIGHT_001','head',-.35),('ACT_HEAD_LIFT_SLOW_001','head',-.22),('ACT_HEAD_LOWER_SLOW_001','head',.22),('ACT_LOOK_LEFT_001','head',.16),('ACT_LOOK_RIGHT_001','head',-.16),('ACT_WAVE_RIGHT_001','forearm.R',.8),('ACT_WAVE_LEFT_001','forearm.L',-.8),('ACT_HAND_ENTER_LEFT_001','upper_arm.L',-.55),('ACT_HAND_ENTER_RIGHT_001','upper_arm.R',.55),('ACT_TOUCH_EARRING_LEFT_001','upper_arm.L',-.95),('ACT_TOUCH_EARRING_RIGHT_001','upper_arm.R',.95),('ACT_TOUCH_NECKLACE_001','upper_arm.R',.7),('ACT_HAND_ON_HIP_001','forearm.R',.95),('ACT_CROSS_ARMS_001','upper_arm.R',1.05),('ACT_OPEN_ARMS_001','upper_arm.L',-.35),('ACT_POINT_LEFT_001','forearm.L',-.4),('ACT_POINT_RIGHT_001','forearm.R',.4),('ACT_STEP_FORWARD_001','thigh.R',.25),('ACT_STEP_BACK_001','thigh.L',-.25),('ACT_WALK_IN_PLACE_001','thigh.L',.32),('ACT_TURN_45_LEFT_001','root',.78),('ACT_TURN_45_RIGHT_001','root',-.78),('ACT_TURN_180_001','root',3.14),('ACT_LEAN_LEFT_001','spine',.18),('ACT_LEAN_RIGHT_001','spine',-.18),('ACT_REACH_FORWARD_001','upper_arm.R',1.3),('ACT_PRODUCT_PRESENT_001','upper_arm.L',-.72),]
def clear():
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 for c in list(bpy.data.collections):bpy.data.collections.remove(c)
def load():
 with bpy.data.libraries.load(str(MODEL),link=False) as (src,dst):dst.collections=[n for n in src.collections if n.startswith('CHAR_XIAOYUNQUE')]
 c=dst.collections[0];bpy.context.scene.collection.children.link(c);return next(o for o in c.objects if o.type=='ARMATURE')
def humanize(action):
 """Turn synchronous mechanical keys into anticipation, follow-through and settle."""
 bag=action.layers[0].strips[0].channelbags[0]
 for fc in bag.fcurves:
  points=fc.keyframe_points
  peak=next((p for p in points if round(p.co.x)==90),None);settle=next((p for p in points if round(p.co.x)==150),None)
  if not peak or not settle: continue
  value=peak.co.y
  # Forearm/head lag slightly behind shoulders/spine; legs lead the root.
  lag=8 if any(x in fc.data_path for x in ('forearm','head','shin')) else (3 if 'upper_arm' in fc.data_path else 0)
  points.insert(24+lag,-value*.14,options={'FAST'}) # anticipation in the opposite direction
  peak.co.x=78+lag
  settle.co.x=124+lag;settle.co.y=value*.62
  for p in points:
   p.interpolation='BEZIER';p.handle_left_type='AUTO_CLAMPED';p.handle_right_type='AUTO_CLAMPED'
def build(a,bone,angle):
 clear();s=bpy.context.scene;s.frame_start=1;s.frame_end=180;s.render.fps=30;rig=load();rig.name='XYQ_DIRECTOR_ARMATURE'
 for pb in rig.pose.bones:pb.rotation_mode='XYZ'
 pb=rig.pose.bones.get(bone)
 if pb:
  pb.rotation_euler=(0,0,0);pb.keyframe_insert('rotation_euler',frame=1)
  if bone=='root': pb.rotation_euler=(0,0,angle)
  elif bone.startswith('head'):pb.rotation_euler=(0,angle,0)
  elif bone=='spine':pb.rotation_euler=(angle,0,0)
  else:pb.rotation_euler=(0,angle,0)
  pb.keyframe_insert('rotation_euler',frame=90);pb.keyframe_insert('rotation_euler',frame=150)
  pb.rotation_euler=(0,0,0);pb.keyframe_insert('rotation_euler',frame=180)
 # Add counter-motion so actions read as full-body director-stage movement.
 extras={}
 if 'WAVE' in a: extras={'upper_arm.R':-.45,'spine':.08,'head':-.12}
 elif 'TOUCH_EARRING' in a: extras={'forearm.R':.7,'head':-.18,'spine':.06}
 elif 'HAND_ENTER' in a: extras={'forearm.L':-.65,'spine':.08}
 elif 'STEP' in a or 'WALK' in a: extras={'thigh.L':.35,'thigh.R':-.35,'shin.L':-.2,'shin.R':.2,'spine':.06}
 elif 'TURN' in a: extras={'spine':.18,'head':.32,'upper_arm.L':-.2,'upper_arm.R':.2}
 elif 'LEAN' in a: extras={'head':-.18,'upper_arm.L':-.18,'upper_arm.R':.18}
 elif 'PRODUCT_PRESENT' in a: extras={'forearm.L':-.75,'head':-.12,'spine':.06}
 elif 'CROSS_ARMS' in a: extras={'upper_arm.L':-.9,'forearm.L':.65,'forearm.R':-.65}
 elif 'HEAD_' in a or 'LOOK_' in a: extras={'spine':.05,'upper_arm.L':-.08,'upper_arm.R':.08}
 for name,value in extras.items():
  q=rig.pose.bones.get(name)
  if not q or q==pb: continue
  q.rotation_mode='XYZ';q.rotation_euler=(0,0,0);q.keyframe_insert('rotation_euler',frame=1);q.rotation_euler=(value,0,0);q.keyframe_insert('rotation_euler',frame=90);q.keyframe_insert('rotation_euler',frame=150);q.rotation_euler=(0,0,0);q.keyframe_insert('rotation_euler',frame=180)
 if 'STEP' in a or 'WALK' in a:
  rig.location=(0,0,0);rig.keyframe_insert('location',frame=1);rig.location=(0,.35 if 'FORWARD' in a else -.25,0);rig.keyframe_insert('location',frame=150);rig.location=(0,0,0);rig.keyframe_insert('location',frame=180)
 action=rig.animation_data.action;action.name=a
 humanize(action)
 d=ROOT/a;d.mkdir(exist_ok=True);bpy.ops.wm.save_as_mainfile(filepath=str(d/(a+'_v2.blend')))
 (d/'Instructions.md').write_text(f'# {a}\n\n6秒、30fps 的小云雀基础动作。Append 后替换或叠加在导演台镜头中。\n',encoding='utf8')
for spec in SPECS:build(*spec)
