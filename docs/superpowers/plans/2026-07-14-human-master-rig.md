# Human Master Rig Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for inline execution. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a reusable, human-proportioned character-rig standard that every previs character and later realistic mesh can map to.

**Architecture:** Keep the canonical rig separate from character geometry. The first deliverable is a Blender `HumanMasterRig` armature, controller map, validation pose and asset card. CC0 proxy characters may map onto it for blocking; a later high-fidelity female mesh replaces the proxy without changing camera, motion or blocking assets.

**Tech Stack:** Blender 5.1.2, Blender MCP Python execution, JSON metadata, Markdown/Obsidian asset cards.

## Global Constraints

- Keep Z-up, forward direction `-Y`, feet grounded at Z=0 and nominal character height 1.70m.
- Separate deform bones from `CTRL_` controller bones.
- Include spine, clavicle, arms, full finger chains, pelvis, legs, feet, eyes and jaw.
- Record every external source and license in `model.json`; reusable source assets must be CC0 or have a compatible explicit license.
- Treat the current CC0 stylized humanoid as previs-only; do not present it as a final luxury-ad character.

---

### Task 1: Canonical human armature and control map

**Files:**
- Create: `video-pipeline/asset-library/05-characters/CHAR_HUMAN_MASTER_RIG_001/HumanMasterRig.blend`
- Create: `video-pipeline/asset-library/05-characters/CHAR_HUMAN_MASTER_RIG_001/model.json`
- Create: `video-pipeline/asset-library/05-characters/CHAR_HUMAN_MASTER_RIG_001/Instructions.md`

- [ ] Build a 1.70m armature with deform chains for spine, limbs, fingers, face anchors and feet.
- [ ] Add controller bones for root, torso, head, hand IK, elbow poles, foot IK and knee poles.
- [ ] Add a validation pose with asymmetric arms, head turn and one bent knee.
- [ ] Save a standardized Blender scene and render `Thumbnail.png`.
- [ ] Record bone names, scale convention, controller names and validation requirements in `model.json`.

### Task 2: Motion-facing validation layer

**Files:**
- Modify: `video-pipeline/asset-library/05-characters/CHAR_HUMAN_MASTER_RIG_001/model.json`
- Create: `video-pipeline/asset-library/06-motions/master-rig-validation/Instructions.md`

- [ ] Map the 15 core director-desk controls to canonical rig bones.
- [ ] Specify pose checks for head turn, torso twist, shoulder lift, hand target, weight shift and foot plant.
- [ ] Mark unsupported mesh-specific facial deformation separately from skeletal motion.

### Task 3: Realistic female mesh acquisition and binding

**Files:**
- Create: `video-pipeline/asset-library/05-characters/CHAR_FEMALE_REALISTIC_BASE_001/model.json`
- Create: `video-pipeline/asset-library/05-characters/CHAR_FEMALE_REALISTIC_BASE_001/Instructions.md`

- [ ] Acquire only a source with an explicit license compatible with the asset-library purpose.
- [ ] Normalize to 1.70m, confirm forward direction and feet ground contact.
- [ ] Bind or retarget the mesh to the canonical rig, then render a neutral and a three-quarter thumbnail.
- [ ] Reject the mesh if hands, neck, head rotation or shoulder deformation visibly fail in the validation pose.

### Task 4: Asset-library registration and verification

**Files:**
- Create: `video-pipeline/asset-library/obsidian-vault/01-资产卡/CHAR_HUMAN_MASTER_RIG_001｜人体标准骨架.md`
- Modify: `D:/react-flow/src/lib/asset-library/server.ts` when that UI workspace is active

- [ ] Confirm `Thumbnail.png`, `HumanMasterRig.blend`, `model.json` and instructions exist.
- [ ] Ensure the visual asset page discovers the asset and serves the thumbnail.
- [ ] Add a human-readable title, rig tags and links to director-desk mannequin, motions and blocking assets.
