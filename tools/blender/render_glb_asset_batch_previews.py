from __future__ import annotations

import subprocess
import sys
from pathlib import Path

import bpy
from mathutils import Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))

from glb_asset_batch_specs import (  # noqa: E402
    ASSETS,
    BATCH_PREVIEW_DIR,
    CONTACT_SHEET,
    asset_dir,
)


WIDTH = 480
HEIGHT = 720


def point_at(obj: bpy.types.Object, target: Vector) -> None:
    obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()


def render_thumbnail(item: dict[str, object]) -> Path:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    source = asset_dir(item) / "source.glb"
    bpy.ops.import_scene.gltf(filepath=str(source))
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if not meshes:
        raise RuntimeError(f"No mesh imported for {item['asset_id']}")
    points = [
        obj.matrix_world @ Vector(corner)
        for obj in meshes
        for corner in obj.bound_box
    ]
    minimum = Vector([min(point[axis] for point in points) for axis in range(3)])
    maximum = Vector([max(point[axis] for point in points) for axis in range(3)])
    center = (minimum + maximum) * 0.5
    dimensions = maximum - minimum
    largest = max(dimensions)

    bpy.ops.object.camera_add(
        location=(center.x, minimum.y - largest * 3.0, center.z)
    )
    camera = bpy.context.object
    camera.name = f"CAM_PREVIEW_{item['asset_id']}"
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = max(
        dimensions.z * 1.18,
        dimensions.x * 1.18 / (WIDTH / HEIGHT),
    )
    point_at(camera, center)

    bpy.ops.object.light_add(
        type="AREA",
        location=(center.x - largest, minimum.y - largest * 1.8, center.z + dimensions.z * 0.45),
    )
    key = bpy.context.object
    key.data.energy = 900
    key.data.shape = "DISK"
    key.data.size = largest * 1.5
    point_at(key, center)

    bpy.ops.object.light_add(
        type="AREA",
        location=(center.x + largest, maximum.y + largest, center.z + dimensions.z * 0.15),
    )
    fill = bpy.context.object
    fill.data.energy = 550
    fill.data.size = largest * 1.2
    point_at(fill, center)

    scene = bpy.context.scene
    scene.camera = camera
    scene.world = bpy.data.worlds.new("preview_world") if not scene.world else scene.world
    scene.world.use_nodes = True
    background = scene.world.node_tree.nodes["Background"]
    background.inputs["Color"].default_value = (0.035, 0.035, 0.035, 1.0)
    background.inputs["Strength"].default_value = 0.8
    scene.render.resolution_x = WIDTH
    scene.render.resolution_y = HEIGHT
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    output = asset_dir(item) / "preview" / "thumbnail.png"
    output.parent.mkdir(parents=True, exist_ok=True)
    scene.render.filepath = str(output)
    bpy.ops.render.render(write_still=True)
    print(f"GLB_THUMBNAIL={output}")
    return output


def build_contact_sheet(thumbnails: list[Path]) -> None:
    BATCH_PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    command = ["ffmpeg", "-y", "-loglevel", "error"]
    for thumbnail in thumbnails:
        command.extend(["-i", str(thumbnail)])
    layout = "|".join(
        f"{(index % 3) * WIDTH}_{(index // 3) * HEIGHT}"
        for index in range(len(thumbnails))
    )
    command.extend(
        [
            "-filter_complex",
            f"xstack=inputs={len(thumbnails)}:layout={layout}[out]",
            "-map",
            "[out]",
            "-frames:v",
            "1",
            str(CONTACT_SHEET),
        ]
    )
    subprocess.run(command, check=True)
    print(f"GLB_CONTACT_SHEET={CONTACT_SHEET}")


def main() -> None:
    thumbnails = [render_thumbnail(item) for item in ASSETS]
    build_contact_sheet(thumbnails)
    print(f"GLB_ASSET_BATCH_PREVIEWS={len(thumbnails)}")


if __name__ == "__main__":
    main()
