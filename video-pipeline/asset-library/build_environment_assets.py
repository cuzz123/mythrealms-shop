"""Generate the first MythRealms product-agnostic scene and lighting libraries."""
from pathlib import Path
import bpy

ROOT=Path(__file__).resolve().parent
def clear():
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 for c in list(bpy.data.collections):bpy.data.collections.remove(c)
def mat(n,color,metal=0,rough=.4):
 m=bpy.data.materials.new(n);m.diffuse_color=color;m.metallic=metal;m.roughness=rough;return m
def cube(c,n,p,s,m):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name=n;o.dimensions=s;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m)
 for x in list(o.users_collection):x.objects.unlink(o)
 c.objects.link(o)
def empty(c,n,p=(0,0,0)):
 o=bpy.data.objects.new(n,None);c.objects.link(o);o.location=p;return o
def save(cat,aid,build):
 clear();c=bpy.data.collections.new(aid);bpy.context.scene.collection.children.link(c);build(c);c.asset_mark();c['asset_id']=aid;c['default_import']='link';d=ROOT/cat/aid;d.mkdir(parents=True,exist_ok=True);bpy.ops.wm.save_as_mainfile(filepath=str(d/(aid+'_v1.blend')))
 (d/'Instructions.md').write_text(f'# {aid}\n\nLink 此母资产；将产品放入 `PRODUCT_SLOT__REPLACE_ME`。\n',encoding='utf8')
def glass(c):
 dark=mat('wet_stone',(0.015,.025,.03,1),.15,.2);gold=mat('frame_gold',(.3,.12,.02,1),.8,.25);cube(c,'wet_stone_floor',(0,0,-.1),(12,12,.2),dark)
 for x in (-4,4):cube(c,'glass_frame',(x,2,2),(0.08,.08,4),gold)
 for z in (0,2,4):cube(c,'glass_cross',(0,2,z),(8,.08,.06),gold)
 empty(c,'PRODUCT_SLOT__REPLACE_ME',(0,0,1));empty(c,'CHARACTER_SLOT__REPLACE_ME',(0,-1,0))
def gallery(c):
 marble=mat('gallery_marble',(.65,.65,.63,1),.05,.22);black=mat('obsidian',(.01,.01,.015,1),.2,.18);cube(c,'marble_floor',(0,0,-.1),(14,14,.2),marble);cube(c,'hero_plinth',(0,0,.55),(2,2,1.1),black);empty(c,'PRODUCT_SLOT__REPLACE_ME',(0,0,1.2));empty(c,'CHARACTER_SLOT__REPLACE_ME',(0,-2,0))
def home(c):
 wood=mat('dark_wood',(.05,.018,.01,1),.05,.3);velvet=mat('velvet',(.08,.02,.06,1),0,.7);cube(c,'wood_floor',(0,0,-.1),(14,14,.2),wood);cube(c,'window_wall',(0,3,2.5),(12,.2,5),velvet);cube(c,'sofa',(-2,1,.55),(3,1,1.1),velvet);empty(c,'PRODUCT_SLOT__REPLACE_ME',(0,0,1));empty(c,'CHARACTER_SLOT__REPLACE_ME',(0,-.5,0))
def light(c,name,spec):
 empty(c,'LIGHT_TARGET__PRODUCT_CENTER')
 for i,(p,col,power,size) in enumerate(spec):
  d=bpy.data.lights.new(f'{name}_{i}','AREA');d.energy=power;d.color=col;d.shape='DISK';d.size=size;o=bpy.data.objects.new(d.name,d);c.objects.link(o);o.location=p
def moon(c):light(c,'MoonGold',[((-3,-3,4),(.2,.4,1),900,4),((3,-2,2),(1,.35,.06),1050,2),((0,2,3),(1,.7,.2),700,2)])
def museum(c):light(c,'MuseumSpot',[((0,-1,6),(1,.9,.75),1600,1.5),((2,-3,2),(.35,.4,1),250,3)])
def sweep(c):light(c,'JewelrySweep',[((2,-3,2),(1,.3,.04),1000,.7),((-2,-2,1),(.2,.4,1),500,2),((0,2,3),(1,.8,.4),550,1)])
save('03-scenes','SET_GLASSHOUSE_NIGHT_001',glass);save('03-scenes','SET_MINIMAL_GALLERY_001',gallery);save('03-scenes','SET_MODERN_NIGHT_HOME_001',home)
save('04-lighting','LIGHT_MOON_GOLD_002',moon);save('04-lighting','LIGHT_MUSEUM_SPOT_001',museum);save('04-lighting','LIGHT_JEWELRY_SWEEP_001',sweep)
