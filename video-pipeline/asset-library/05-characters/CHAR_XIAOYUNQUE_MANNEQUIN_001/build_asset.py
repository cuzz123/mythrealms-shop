"""Create a XiaoYunque-style articulated female director mannequin with an armature."""
from pathlib import Path
import math
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "CHAR_XIAOYUNQUE_MANNEQUIN_FEMALE_005.blend"
PREVIEW = ROOT / "Preview_v2.png"

def clear():
    bpy.ops.object.select_all(action="SELECT"); bpy.ops.object.delete(use_global=False)
    for c in list(bpy.data.collections): bpy.data.collections.remove(c)

def mat():
    m=bpy.data.materials.new("Xiaoyunque_Lavender");m.use_nodes=True;m.node_tree.nodes.clear()
    b=m.node_tree.nodes.new("ShaderNodeBsdfPrincipled");o=m.node_tree.nodes.new("ShaderNodeOutputMaterial");m.node_tree.links.new(b.outputs["BSDF"],o.inputs["Surface"]);b.inputs["Base Color"].default_value=(0.58,0.30,0.78,1);b.inputs["Roughness"].default_value=.38
    return m

def link(o,c):
    for x in list(o.users_collection): x.objects.unlink(o)
    c.objects.link(o); return o

def sphere(c,n,p,s,m):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=40,ring_count=24,location=p); o=link(bpy.context.object,c);o.name=n;o.scale=s;o.data.materials.append(m);bpy.ops.object.shade_smooth();return o

def capsule(c,n,a,b,r,m):
    a,b=Vector(a),Vector(b);d=b-a
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=20,location=(a+b)/2);o=link(bpy.context.object,c);o.name=n;o.scale=(r,r,d.length/2+r);o.rotation_euler=d.to_track_quat('Z','Y').to_euler();o.data.materials.append(m);bpy.ops.object.shade_smooth();return o

def shell(c,n,a,b,r1,r2,m):
    """Rounded multi-section limb shell: tapered at joints and fuller through the limb."""
    a,b=Vector(a),Vector(b);d=b-a;L=d.length
    o=profile_shell(c,n,[(-L*.5,r1*.72,r1*.66),(-L*.28,r1,r1*.9),(L*.25,r2*1.08,r2),(L*.5,r2*.70,r2*.65)],m)
    o.location=(a+b)*.5;o.rotation_euler=d.to_track_quat('Z','Y').to_euler();return o

def profile_shell(c,n,levels,m,segments=32):
    """Smooth multi-section hard shell for female torso/limbs, not a primitive cone."""
    verts=[];faces=[]
    for z,rx,ry in levels:
        for i in range(segments):
            a=math.tau*i/segments;verts.append((rx*math.cos(a),ry*math.sin(a),z))
    for j in range(len(levels)-1):
        for i in range(segments):
            q=(i+1)%segments;faces.append((j*segments+i,j*segments+q,(j+1)*segments+q,(j+1)*segments+i))
    faces.append(tuple(range(segments-1,-1,-1)));last=(len(levels)-1)*segments;faces.append(tuple(last+i for i in range(segments)))
    mesh=bpy.data.meshes.new(n+'_mesh');mesh.from_pydata(verts,[],faces);mesh.update();o=bpy.data.objects.new(n,mesh);c.objects.link(o);o.data.materials.append(m)
    bevel=o.modifiers.new('surface_softening','BEVEL');bevel.width=.035;bevel.segments=2;bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.shade_smooth();return o

def armature(c):
    bpy.ops.object.armature_add(enter_editmode=True,location=(0,0,0)); rig=link(bpy.context.object,c);rig.name="XYQ_DIRECTOR_ARMATURE";rig.data.name=rig.name
    eb=rig.data.edit_bones; eb.remove(eb[0])
    # Human control chain: pelvis carries body weight; segmented spine carries
    # torso gesture; clavicle/scapula precede the arms for natural shoulder motion.
    defs={"root":((0,0,0),(0,0,.36),None),"pelvis":((0,0,.36),(0,0,.72),"root"),"spine_01":((0,0,.72),(0,0,1.00),"pelvis"),"spine_02":((0,0,1.00),(0,0,1.26),"spine_01"),"spine":((0,0,1.26),(0,0,1.55),"spine_02"),"neck":((0,0,1.55),(0,0,1.68),"spine"),"head":((0,0,1.68),(0,0,1.96),"neck")}
    for s in (-1,1):
        q="L" if s<0 else "R"; defs|={f"clavicle.{q}":((.08*s,0,1.48),(.27*s,0,1.49),"spine"),f"scapula.{q}":((.27*s,.03,1.49),(.40*s,.04,1.47),f"clavicle.{q}"),f"upper_arm.{q}":((.40*s,0,1.48),(.86*s,0,1.48),f"scapula.{q}"),f"forearm.{q}":((.86*s,0,1.48),(1.45*s,0,1.48),f"upper_arm.{q}"),f"hand.{q}":((1.45*s,0,1.48),(1.68*s,0,1.48),f"forearm.{q}"),f"thigh.{q}":((.19*s,0,.57),(.25*s,0,-.25),"pelvis"),f"shin.{q}":((.25*s,0,-.25),(.22*s,0,-1.03),f"thigh.{q}"),f"foot.{q}":((.22*s,0,-1.03),(.22*s,-.28,-1.03),f"shin.{q}"),f"toe.{q}":((.22*s,-.28,-1.03),(.22*s,-.46,-1.03),f"foot.{q}")}
        for i in range(5):
            a=(1.61*s,(i-2)*.035,1.48);b=(1.70*s,(i-2)*.04,1.47);d=(1.78*s,(i-2)*.045,1.46);e=(1.86*s,(i-2)*.05,1.45)
            defs[f"finger_{i}_01.{q}"]=(a,b,f"hand.{q}");defs[f"finger_{i}_02.{q}"]=(b,d,f"finger_{i}_01.{q}");defs[f"finger_{i}_03.{q}"]=(d,e,f"finger_{i}_02.{q}")
    for n,(h,t,p) in defs.items(): b=eb.new(n);b.head=h;b.tail=t;b.parent=eb[p] if p else None
    bpy.ops.object.mode_set(mode="OBJECT"); return rig

def bind(o,rig,bone):
    # Preserve the object in world space while binding its rigid module to a bone.
    world=o.matrix_world.copy();o.parent=rig;o.parent_type="BONE";o.parent_bone=bone;o.matrix_world=world

def build():
    clear();scene=bpy.context.scene;scene.render.engine="BLENDER_EEVEE";scene.render.resolution_x=600;scene.render.resolution_y=800;scene.world.color=(.075,.08,.095)
    c=bpy.data.collections.new("CHAR_XIAOYUNQUE_MANNEQUIN_FEMALE_002");scene.collection.children.link(c);m=mat();rig=armature(c)
    front=bpy.data.materials.new("Xiaoyunque_FrontMarker");front.diffuse_color=(0.82,0.58,1.0,1)
    core=profile_shell(c,"FEMALE_TORSO_CORE",[(.55,.36,.23),(.72,.34,.22),(.91,.21,.16),(1.08,.20,.16),(1.25,.29,.19),(1.46,.37,.21),(1.55,.34,.20)],m)
    parts=[(sphere(c,"HEAD_FACELESS",(0,0,1.82),(.18,.16,.27),m),"head"),(sphere(c,"HEAD_FRONT_DIRECTION",(0,-.165,1.82),(.075,.014,.13),front),"head"),(core,"spine"),(sphere(c,"CHEST_FRONT_DIRECTION",(0,-.215,1.34),(.10,.014,.14),front),"spine"),(sphere(c,"BREAST.L",(-.14,-.18,1.34),(.13,.065,.145),m),"spine"),(sphere(c,"BREAST.R",(.14,-.18,1.34),(.13,.065,.145),m),"spine"),(sphere(c,"PELVIS_FRONT_DIRECTION",(0,-.245,.65),(.16,.014,.10),front),"root")]
    for s in (-1,1):
        q="L" if s<0 else "R"; parts += [(sphere(c,f"SHOULDER.{q}",(.34*s,0,1.48),(.14,.14,.14),m),"upper_arm."+q),(shell(c,f"UPPER_ARM.{q}",(.43*s,0,1.48),(.84*s,0,1.48),.125,.105,m),"upper_arm."+q),(sphere(c,f"ELBOW.{q}",(.88*s,0,1.48),(.12,.12,.12),m),"forearm."+q),(shell(c,f"FOREARM.{q}",(.94*s,0,1.48),(1.4*s,0,1.48),.10,.075,m),"forearm."+q),(sphere(c,f"WRIST.{q}",(1.45*s,0,1.48),(.075,.075,.075),m),"hand."+q),(shell(c,f"HAND.{q}",(1.49*s,0,1.48),(1.68*s,0,1.48),.09,.12,m),"hand."+q),(shell(c,f"THIGH.{q}",(.19*s,0,.53),(.25*s,0,-.22),.21,.15,m),"thigh."+q),(sphere(c,f"KNEE.{q}",(.25*s,0,-.27),(.14,.13,.14),m),"shin."+q),(shell(c,f"SHIN.{q}",(.25*s,0,-.35),(.22*s,0,-.95),.13,.085,m),"shin."+q),(shell(c,f"FOOT.{q}",(.22*s,-.03,-1.03),(.22*s,-.24,-1.03),.11,.07,m),"foot."+q)]
        for i in range(5): parts.append((capsule(c,f"FINGER_{i}.{q}",(1.68*s,(i-2)*.035,1.48),(1.84*s,(i-2)*.05,1.46),.022,m),"hand."+q))
    for o,b in parts: bind(o,rig,b)
    c.asset_mark();c["asset_id"]="CHAR_XIAOYUNQUE_MANNEQUIN_FEMALE_002";c["binding"]="rigid bone parenting per modular body part"
    # Reference uses a close three-quarter director-viewport angle, not an orthographic front view.
    bpy.ops.object.camera_add(location=(3.0,-8.0,.5));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,.42))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=57;scene.camera=cam
    scene.render.film_transparent=True
    bpy.ops.object.light_add(type="AREA",location=(-3,-4,5));bpy.context.object.data.energy=950;bpy.context.object.data.size=4
    bpy.ops.object.light_add(type="AREA",location=(3,-3,2));bpy.context.object.data.energy=450;bpy.context.object.data.size=3
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT));scene.render.filepath=str(PREVIEW);bpy.ops.render.render(write_still=True)
if __name__=="__main__": build()
