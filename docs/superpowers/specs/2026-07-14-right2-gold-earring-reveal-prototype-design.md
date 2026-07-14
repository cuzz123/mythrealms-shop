# RIGHT2 Gold Earring Reveal Prototype

## Goal

Create one production-oriented upper-body jewelry advertising motion for
`CHAR_HUNYUAN_RIGHT2_GOLD_001` and remove the visible single-frame jumps from
the existing preview showreel.

## Root Cause

The current combined showreel contains discontinuous segment boundaries:

- Frame 48 to 49 changes the head by 9.17 degrees in one frame.
- Frame 96 to 97 moves the camera by 0.328 meters, rotates it by 4.04 degrees,
  and changes the focal length by 12 mm in one frame.

Reducing pose amplitude alone cannot remove these jumps. Segment boundaries
must share compatible poses and camera states.

## Prototype Motion

Add `ACT_RIGHT2_GOLD_EARRING_REVEAL_01`, a 72-frame action at 24 fps:

- Frames 1-12: quiet three-quarter hold with subtle breathing.
- Frames 13-36: slow head and neck turn that exposes the near ear.
- Frames 37-52: restrained chin adjustment and shoulder settle.
- Frames 53-72: stable jewelry hold and gentle return toward the compatible
  end pose.

The head yaw remains within 8 degrees, the neck within 4 degrees, and the chest
within 2 degrees. Motion is distributed across chest, neck, and head to avoid a
hinged or mechanical silhouette.

## Camera

Add a dedicated 72-frame upper-body camera preview with a slow lateral move and
small push-in. The camera focuses near the visible earring and uses shallow
depth of field without abrupt focus or focal-length changes.

## Continuity Fix

Replace the one-frame pose and camera transitions in the existing showreel with
matched boundary keys and multi-frame bridges. Use Bezier interpolation with
auto-clamped handles to prevent overshoot while keeping natural acceleration.

## Deliverables

- Updated Blender rebuild script.
- Updated rigged Blender asset with the new reusable Action.
- One 72-frame prototype preview setup.
- Validation renders covering hold, turn, reveal, settle, and final pose.
- Machine-readable continuity checks for maximum per-frame bone rotation,
  camera translation, camera rotation, and focal-length change.

## Acceptance Criteria

- Existing showreel contains no one-frame head change above 2 degrees.
- Existing showreel contains no one-frame camera translation above 0.06 meters.
- Existing showreel contains no one-frame camera rotation above 2 degrees.
- Existing showreel contains no one-frame focal-length change above 3 mm.
- Earring reveal begins and ends on compatible poses and shows no visible pop.
- The generated Blender file opens with the prototype Action and camera ready
  for playback.

## Scope Boundary

This remains an upper-body previs asset. It does not add facial blendshapes,
finger articulation, cloth simulation, or production retopology.
