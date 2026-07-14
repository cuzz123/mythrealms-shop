# RIGHT2_GOLD Upper-Body Rig

## Deliverable

- Blender asset: `RIGHT2_GOLD_RIGGED_UPPER_BODY_v1.blend`
- Armature: `RIG_RIGHT2_GOLD_UPPER_BODY`
- Active camera: `CAM_RIGHT2_GOLD_EARRING_REVEAL_TEST`
- Active action: `ACT_RIGHT2_GOLD_EARRING_REVEAL_01`
- Timeline: frames `1-72`, `24 fps`
- Rebuild script: `D:\mythrealms-shop\tools\blender\rig_hunyuan_right2_gold_upper_body.py`

## Motion assets

| Action | Frames | Use |
| --- | ---: | --- |
| `ACT_RIGHT2_GOLD_IDLE_BREATH_01` | 1-48 | Close/medium idle breathing |
| `ACT_RIGHT2_GOLD_SNAP_GLANCE_01` | 1-48 | Side look followed by a fast camera glance |
| `ACT_RIGHT2_GOLD_CHIN_LIFT_01` | 1-48 | Downward gaze to controlled chin lift |
| `ACT_RIGHT2_GOLD_EDITORIAL_ARM_01` | 1-48 | Restrained shoulder/arm presentation |
| `ACT_RIGHT2_GOLD_SIDE_LEAN_01` | 1-48 | Torso lean with head counter-rotation |
| `ACT_RIGHT2_GOLD_UPPER_BODY_SHOWREEL_01` | 1-240 | All five motions arranged for the legacy showreel camera |
| `ACT_RIGHT2_GOLD_EARRING_REVEAL_01` | 1-72 | Slow three-quarter turn for near-earring reveal |

## Camera beats

- Starts 1/40/100/145/193.
- Frames `1-39`: medium push-in for idle breathing and the first pose bridge.
- Frames `40-99`: tighter portrait, controlled glance, and neutral bridge.
- Frames `100-144`: three-quarter chin-lift orbit.
- Frames `145-192`: lower shoulder/arm presentation.
- Frames `193-240`: close side-lean settle.

## Prototype: earring reveal (frames 1-72)

- Active camera: `CAM_RIGHT2_GOLD_EARRING_REVEAL_TEST`
- Focus empty: `FOCUS_RIGHT2_GOLD_EARRING_REVEAL_TEST`
- Active action: `ACT_RIGHT2_GOLD_EARRING_REVEAL_01`
- Timeline: `1-72`, `24 fps`
- Camera moves from medium-wide to a tight near-earring close-up at frames 1/24/48/72 with auto-clamped interpolation.

### How to play back the prototype

1. Open `RIGHT2_GOLD_RIGGED_UPPER_BODY_v1.blend`.
2. In the Timeline, set frame range to `1-72`.
3. In the Outliner, select `RIG_RIGHT2_GOLD_UPPER_BODY` and under
   Action Editor choose `ACT_RIGHT2_GOLD_EARRING_REVEAL_01`.
4. Set the 3D Viewport camera to `CAM_RIGHT2_GOLD_EARRING_REVEAL_TEST`
   (View > Cameras > Set Active Object as Camera).
5. Press Space to play the 3-second shot.

The legacy showreel camera `CAM_RIGHT2_GOLD_UPPER_BODY_SHOWREEL` and its
action `ACT_RIGHT2_GOLD_UPPER_BODY_SHOWREEL_01` (frames 1-240) remain
in the file for validation runs.

## Limitations

The Hunyuan source is a single 320k-vertex mesh without production retopology and ends above the knees. The armature is intentionally limited to restrained upper-body previs. Do not use it for walking, full-body staging, large elbow raises, cloth simulation, or final commercial character delivery without retopology and corrective weight work.

Latest earring-reveal validation renders are stored under
`preview/rig_v5_earring_reveal/`. The H.264 preview is
`preview/rig_v5_earring_reveal/RIGHT2_GOLD_EARRING_REVEAL_PREVIEW.mp4`.
