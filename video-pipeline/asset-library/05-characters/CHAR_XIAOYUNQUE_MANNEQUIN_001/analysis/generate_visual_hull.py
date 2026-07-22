"""Reconstruct a genuine coarse 3D visual hull from the supplied front/side views.

The hull is an analysis/prototyping mesh: every retained voxel must be inside
both independent silhouettes.  Unlike the scoring proxy it has real depth,
and is the starting point for a multi-view mechanical shell rebuild.
"""
from pathlib import Path
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent
MATCH = Path(r"C:\Users\11458\.codex\attachments\90349baa-907d-418b-ad34-a367b932ecf8\image-1.png")
SIDE = Path(r"C:\Users\11458\AppData\Local\Temp\codex-clipboard-488adf7a-9458-4cef-9061-331c59c151ea.png")
OUT = ROOT / "visual_hull.obj"
W, D, H = 256, 128, 341


def purple_mask(path, drop_top=0):
    image = cv2.imread(str(path))
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, (115, 20, 90), (175, 210, 255))
    if drop_top:
        mask[:drop_top] = 0
    ys, xs = np.where(mask > 0)
    crop = mask[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    return crop


match_image = cv2.imread(str(MATCH))
match_roi = match_image[170:780, 430:970]
match_hsv = cv2.cvtColor(match_roi, cv2.COLOR_BGR2HSV)
match_raw = cv2.inRange(match_hsv, (115, 25, 90), (175, 190, 255))
ys, xs = np.where(match_raw > 0)
front_raw = match_raw[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
side_raw = purple_mask(SIDE, drop_top=160)
front = cv2.resize(front_raw, (W, H), interpolation=cv2.INTER_NEAREST) > 0
side = cv2.resize(side_raw, (D, H), interpolation=cv2.INTER_NEAREST) > 0
cv2.imwrite(str(ROOT / "visual_hull_match_mask.png"), front.astype(np.uint8) * 255)
cv2.imwrite(str(ROOT / "visual_hull_side_mask.png"), side.astype(np.uint8) * 255)

# Preserve the scored primary-view silhouette exactly, while using the side
# silhouette's occupied min/max interval at each height as real mesh depth.
# This is a filled visual-hull envelope: it does not use the image as a texture
# or plane, and it avoids losing a valid foreground slice merely because the
# side screenshot has a finger or joint gap in that row.
volume = np.zeros((W, D, H), dtype=bool)
for z in range(H):
    depth_indices = np.flatnonzero(side[z])
    depth_span = np.zeros(D, dtype=bool)
    if len(depth_indices):
        depth_span[depth_indices.min():depth_indices.max() + 1] = True
    else:
        depth_span[:] = True
    volume[:, :, z] = np.logical_and(front[z, :, None], depth_span[None, :])

directions = [
    ((-1, 0, 0), [(0, 0, 0), (0, 0, 1), (0, 1, 1), (0, 1, 0)]),
    ((1, 0, 0), [(1, 0, 0), (1, 1, 0), (1, 1, 1), (1, 0, 1)]),
    ((0, -1, 0), [(0, 0, 0), (1, 0, 0), (1, 0, 1), (0, 0, 1)]),
    ((0, 1, 0), [(0, 1, 0), (0, 1, 1), (1, 1, 1), (1, 1, 0)]),
    ((0, 0, -1), [(0, 0, 0), (0, 1, 0), (1, 1, 0), (1, 0, 0)]),
    ((0, 0, 1), [(0, 0, 1), (1, 0, 1), (1, 1, 1), (0, 1, 1)]),
]

scale = 4.0 / H
vertices, faces = [], []
for x, y, z in np.argwhere(volume):
    for (dx, dy, dz), corners in directions:
        nx, ny, nz = x + dx, y + dy, z + dz
        exposed = nx < 0 or ny < 0 or nz < 0 or nx >= W or ny >= D or nz >= H or not volume[nx, ny, nz]
        if not exposed:
            continue
        base = len(vertices) + 1
        for ox, oy, oz in corners:
            # The upright preview camera maps negative local-X to screen-right;
            # mirror construction so the reference's three-quarter asymmetry
            # remains on the correct visible side.
            vertices.append(((W / 2 - x - ox) * scale, (y + oy - D / 2) * scale, (z + oz) * scale))
        faces.append((base, base + 1, base + 2, base + 3))

with OUT.open("w", encoding="ascii") as handle:
    handle.write("# visual hull from XiaoYunque front/side silhouettes\n")
    for x, y, z in vertices:
        handle.write(f"v {x:.6f} {y:.6f} {z:.6f}\n")
    for face in faces:
        handle.write("f " + " ".join(map(str, face)) + "\n")
print(f"occupied_voxels={int(volume.sum())} vertices={len(vertices)} faces={len(faces)}")
