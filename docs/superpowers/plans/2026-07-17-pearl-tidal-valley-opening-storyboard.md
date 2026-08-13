# Pearl Tidal Valley Opening Storyboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce the first 12 seconds of the MythRealms “Pearl Tidal Valley” campaign as four reusable visual anchors, three Seedance-ready shot prompts, one exact-text director board, and one asset-library record.

**Architecture:** Generate world imagery as four role-separated raster references, reuse three anchors as shot first frames, and compose the final board deterministically with Pillow so Chinese copy and timecodes remain exact. Keep generation outputs under one work package, then copy the approved package into `06-reference-inputs` with an Obsidian card.

**Tech Stack:** Built-in image generation, Python 3.13, Pillow, Markdown, JSON, Seedance 2.0 I2V prompts.

## Global Constraints

- Master frames are 16:9 and contain no generated text, watermark, logo, character, horse, or visible jewelry.
- The world is grounded live-action realism: wet black basalt, real silver-grey seawater, restrained mother-of-pearl mineral layers, and one inhabitable obsidian-glass villa.
- The time of day, wind direction, cold sky light, silver sea, and single warm villa window remain continuous.
- Each Seedance prompt contains one primary camera move and one visible endpoint.
- Image references have one primary role each; no reference controls identity, motion, environment, and style at the same time.
- The final board is 3840×2160 and uses deterministic Chinese typography from `C:/Windows/Fonts/msyh.ttc`.
- Source images remain textless; all labels, timings, and prompts are added during deterministic board composition.

---

### Task 1: Create the production package and prompt contracts

**Files:**
- Create: `video-pipeline/work/2026-07-17-pearl-tidal-valley-opening/prompts/seedance-s01.md`
- Create: `video-pipeline/work/2026-07-17-pearl-tidal-valley-opening/manifest.json`

**Interfaces:**
- Consumes: approved design spec `docs/superpowers/specs/2026-07-17-pearl-tidal-valley-opening-storyboard-design.md`.
- Produces: exact image-generation briefs and three Seedance I2V prompts used by Tasks 2–4.

- [ ] **Step 1: Create the work directories**

Create `references`, `board`, and `prompts` below the work-package root without deleting any existing version.

- [ ] **Step 2: Write the three Seedance prompt contracts**

Use these exact scopes:

```text
S01A / @Image1 controls world geography and first frame only. Preserve island silhouettes, cloud ceiling, sea colour, and realistic water. Over four seconds the camera makes one slow 24mm aerial push forward with a slight descent, ending with the central ravine clearly aligned as the path ahead. Clouds drift slowly and waves break naturally. No rotation, orbit, dive, architecture, people, jewelry, text, or logo. Sound intent: low wind and distant surf.

S01B / @Image1 controls the ravine geography, basalt material, sea channel, and first frame only. Preserve the opening and both wall silhouettes. Over four seconds the camera makes one level 35mm low-altitude move straight through the ravine, ending when a tiny geometric villa silhouette first appears at the exit. Mother-of-pearl colour appears only as thin mineral layers under grazing light; no giant pearl, shell palace, fantasy glow, people, jewelry, text, or logo. Sound intent: narrowed wind, closer surf, one low pulse.

S01C / @Image1 controls villa identity, cliff geography, window layout, and first frame; @Image2 controls basalt, sea foam, and restrained mother-of-pearl material only. Preserve the villa silhouette, floor count, glass divisions, and the single warm window. Over four seconds the camera performs one slow 50mm lateral reveal from behind foreground rock, then decelerates to a locked frame with the warm window on the upper-right third. Only cloud, mist, sea, and camera move. No building deformation, extra lights, people, jewelry, text, or logo. Sound intent: wind becomes muffled behind the rock, then half a second of quiet.
```

- [ ] **Step 3: Write the manifest**

Record package ID `REF_MR_PEARL_TIDAL_VALLEY_OPENING_001`, source reference filename, design-spec path, four image roles, three shot IDs, 16:9 framing, and status `draft`.

- [ ] **Step 4: Validate package files**

Run:

```powershell
python -c "import json, pathlib; p=pathlib.Path(r'video-pipeline/work/2026-07-17-pearl-tidal-valley-opening/manifest.json'); d=json.loads(p.read_text(encoding='utf-8')); assert d['id']=='REF_MR_PEARL_TIDAL_VALLEY_OPENING_001'; assert len(d['references'])==4; assert len(d['shots'])==3"
```

Expected: exit code 0.

### Task 2: Generate and visually validate four role-separated anchors

**Files:**
- Create: `video-pipeline/work/2026-07-17-pearl-tidal-valley-opening/references/world-anchor.png`
- Create: `video-pipeline/work/2026-07-17-pearl-tidal-valley-opening/references/ravine-anchor.png`
- Create: `video-pipeline/work/2026-07-17-pearl-tidal-valley-opening/references/villa-anchor.png`
- Create: `video-pipeline/work/2026-07-17-pearl-tidal-valley-opening/references/material-anchor.png`

**Interfaces:**
- Consumes: image briefs below and the continuity locks from Task 1.
- Produces: four 16:9 textless PNG files for Seedance and the board composer.

- [ ] **Step 1: Generate `world-anchor`**

```text
Use case: ads-marketing. Textless first-frame reference for a luxury pearl brand film. Photorealistic 16:9 extreme aerial establishing shot before dawn: a remote archipelago of wet black basalt cliffs under a low blue-grey cloud ceiling, real silver-grey ocean threading between the islands, narrow white surf, one central ravine forming a clear forward path. Restrained composed-classicist framing, credible North Atlantic scale, natural atmosphere and water physics, cold soft sky light, one distant narrow patch of light on the sea. No building, person, horse, jewelry, pearl object, shell palace, fantasy glow, aurora, neon, text, logo, watermark, interface, or black letterbox.
```

- [ ] **Step 2: Generate `ravine-anchor`**

```text
Use case: ads-marketing. Textless first-frame reference for the same photorealistic 16:9 world, camera at low altitude and level, entering a broad sea ravine between wet black basalt walls. The real ocean channel occupies the lower centre and leads toward a distant exit. Thin natural mother-of-pearl mineral seams appear sparingly in the rock at grazing angles, with restrained pale pink, cool cyan, and soft gold iridescence. Same pre-dawn blue-grey cloud ceiling and cold light as the world anchor. No giant pearls, shells, glowing cave, fantasy architecture, person, horse, jewelry, text, logo, watermark, interface, or black letterbox.
```

- [ ] **Step 3: Generate `villa-anchor`**

```text
Use case: ads-marketing. Textless first-frame reference in the same photorealistic 16:9 world. A low horizontal inhabitable villa of dark obsidian stone and frameless glass is embedded into the edge of a wet black basalt cliff above a silver-grey sea, seen from a distant front three-quarter angle with foreground rock partially concealing the left side. One and only one warm amber window glows at the upper-right third; all other glass stays cool and dark. Restrained premium residential architecture, one floor plus a recessed lower terrace, credible structure and scale, blue-grey cloud wall behind it. No spaceship silhouette, impossible cantilever, extra lit windows, person, horse, jewelry, text, logo, watermark, interface, or black letterbox.
```

- [ ] **Step 4: Generate `material-anchor`**

```text
Use case: scientific-educational material reference for the same live-action environment, textless 16:9 close detail board showing one continuous natural shoreline surface: wet porous black basalt in the foreground, realistic silver-grey sea foam crossing one edge, and a few thin embedded mother-of-pearl mineral layers revealed in a fractured rock face. Iridescence remains subtle and physical, visible only at grazing light, pale pink/cool cyan/soft gold. Cold diffuse pre-dawn light, high material fidelity. No jewelry, loose pearl, giant shell, magic glow, neon, person, text, labels, logo, watermark, interface, or black letterbox.
```

- [ ] **Step 5: Validate the four outputs**

Open each image at original detail. Reject and regenerate only the failing image when any hard constraint fails. Confirm all four are landscape, textless, share the same time of day and palette, and keep mother-of-pearl restrained.

### Task 3: Build and test the deterministic director-board composer

**Files:**
- Create: `video-pipeline/scripts/build_pearl_tidal_valley_board.py`
- Create: `video-pipeline/tests/test_pearl_tidal_valley_board.py`
- Create: `video-pipeline/work/2026-07-17-pearl-tidal-valley-opening/board/pearl-tidal-valley-opening-board.png`

**Interfaces:**
- Consumes: four image paths, manifest JSON, and prompt Markdown.
- Produces: `build_board(package_root: Path, output: Path) -> Path` and a 3840×2160 PNG.

- [ ] **Step 1: Write the failing test**

Create four synthetic 1600×900 images, a minimal manifest, and prompt file in a temporary directory. Call `build_board` and assert output exists, size is `(3840, 2160)`, mode is `RGB`, and all three shot IDs are present in `output.with_suffix('.txt')` accessibility text.

- [ ] **Step 2: Run the focused test and verify red**

Run:

```powershell
python -m unittest video-pipeline.tests.test_pearl_tidal_valley_board -v
```

Expected: failure because `build_pearl_tidal_valley_board` does not exist.

- [ ] **Step 3: Implement the board composer**

Use Pillow, `C:/Windows/Fonts/msyh.ttc`, `msyhbd.ttc`, and a warm ivory background. Render a top identity bar, three equal 16:9 shot cards with exact Chinese notes, and a bottom strip containing the material anchor, five colour swatches, the scale/movement progression, and risk tags. Write a UTF-8 `.txt` accessibility companion containing the full board copy.

- [ ] **Step 4: Run the focused test and verify green**

Run the command from Step 2. Expected: one passing test.

- [ ] **Step 5: Render the actual board and inspect it**

Run:

```powershell
python video-pipeline/scripts/build_pearl_tidal_valley_board.py --package video-pipeline/work/2026-07-17-pearl-tidal-valley-opening
```

Expected: the PNG and companion TXT exist; no text overlaps; all images remain uncropped at their critical edges.

### Task 4: Finalize prompts and register the package

**Files:**
- Create: `video-pipeline/asset-library/06-reference-inputs/REF_MR_PEARL_TIDAL_VALLEY_OPENING_001/`
- Create: `video-pipeline/asset-library/obsidian-vault/01-资产卡/REF_MR_PEARL_TIDAL_VALLEY_OPENING_001｜珍珠潮汐谷首段分镜.md`
- Modify: `video-pipeline/work/2026-07-17-pearl-tidal-valley-opening/manifest.json`

**Interfaces:**
- Consumes: approved references, board, prompts, and manifest.
- Produces: one reusable local reference package and Obsidian entry.

- [ ] **Step 1: Run anti-slop and continuity review**

Confirm every prompt has one subject/world anchor, one action, one camera move, one endpoint, physical lighting, sound intent, explicit reference roles, and no unsupported future beat.

- [ ] **Step 2: Copy the approved package non-destructively**

Copy references, board, prompt Markdown, accessibility text, and manifest into the asset directory without deleting the work package.

- [ ] **Step 3: Update status and checksums**

Set manifest status to `ready`, record SHA-256 for the four references and board, and record the asset-library relative path.

- [ ] **Step 4: Create the Obsidian card**

Include the board preview, four reference links, three prompt summaries, usage order, and the rule that the generated clip or final frame must return for review before the second segment is finalized.

- [ ] **Step 5: Run final verification**

Run full video-pipeline tests, open the board at original resolution, verify all five checksums, and confirm no original source or user asset was moved or deleted.
