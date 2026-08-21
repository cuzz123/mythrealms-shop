# FILE 001 Visual Reconstruction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce three new live-action protagonist casting candidates and five city-scale grounded science-fiction disaster scenes for user selection, without reusing rejected positive visual references or generating video.

**Architecture:** Build an isolated `visual-reconstruction` candidate namespace beneath the existing FILE 001 package. Character and world production are independent and may run concurrently in separate Luna Max sessions; each track records built-in image-generation provenance and passes automated media checks plus an independent visual review before the user gate. Nothing is promoted into accepted character, environment, first-frame, director-card, or video paths until the user selects one character and approves the world direction.

**Tech Stack:** Built-in image generation, PowerShell 7, Node.js with the repository's existing `sharp` dependency, Git, Markdown/JSON audit records.

**Spec:** `docs/superpowers/specs/2026-08-21-the-sea-above-visual-reconstruction-design.md`

## Global Constraints

- Direction is grounded science-fiction disaster epic with prestige-television performance and live-action photographic realism.
- Three genuinely different fictional adult protagonist candidates are required; none may derive from the rejected protagonist face.
- Five world scenes are required, including a 14–18 mm ultra-wide city panorama.
- Existing rejected protagonist, environment, first-frame, and style-test images are negative references only and must never be supplied to image generation as positive image inputs.
- The immutable Baroque Orbit product-truth source and hashes remain untouched; casting boards contain no jewellery.
- Use built-in image generation one call per distinct image or targeted repair. Do not use CLI/API fallback.
- Do not generate Seedance video, complete the director card, publish, or spend credits.
- Reject oil-paint texture, game concept art, fantasy matte painting, synthetic poster styling, wax skin, plastic hair, repeated faces, cloned extras, impossible architecture, excessive cyan grading, centred runway posing, perfect symmetry, readable generated signage, logos, prices, or watermarks.
- All candidate assets live under `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/` until explicit user selection.
- Every final candidate records exact prompt, input-role list, generated source path, output path, SHA-256, dimensions, colour mode, rejection reason, and repair history.
- Implementation commits must not stage the pre-existing rejected first-frame/style-test changes already present in the worktree.

---

### Task 1: Isolated Reconstruction Contract and Validator

**Files:**
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reconstruction-contract.json`
- Create: `video-pipeline/asset-library/scripts/validate-sea-above-visual-reconstruction.ps1`
- Create: `.superpowers/sdd/2026-08-21-the-sea-above-visual-reconstruction/task-1-report.md`

**Interfaces:**
- Consumes: approved visual-reconstruction spec and existing repository media tooling.
- Produces: `reconstruction-contract.json` as the immutable candidate file/dimension authority and `validate-sea-above-visual-reconstruction.ps1` returning exit `0` only when every declared asset exists and meets metadata requirements.

- [ ] **Step 1: Create the candidate contract**

Use this exact structure:

```json
{
  "schema_version": 1,
  "package_id": "VID_MR_SEA_ABOVE_FILE_001_VISUAL_RECONSTRUCTION",
  "status": "candidate_only",
  "forbid_promotion_without_user_selection": true,
  "characters": {
    "directory": "characters",
    "files": [
      "candidate-a-cold-intelligence.png",
      "candidate-b-dangerous-curiosity.png",
      "candidate-c-luminous-resilience.png"
    ],
    "overview": "characters/casting-overview.png",
    "width": 1080,
    "height": 1920,
    "channels": 3
  },
  "world": {
    "directory": "world",
    "files": [
      { "path": "scene-01-city-beneath-sea.png", "width": 2560, "height": 1080 },
      { "path": "scene-01-portrait-crop-test.png", "width": 1080, "height": 1920 },
      { "path": "scene-02-evacuation-square.png", "width": 1920, "height": 1080 },
      { "path": "scene-03-s01-street-hook.png", "width": 1080, "height": 1920 },
      { "path": "scene-04-rooftops-under-mother.png", "width": 1920, "height": 1080 },
      { "path": "scene-05-cliffs-harbour-ocean.png", "width": 2560, "height": 1080 }
    ],
    "overview": "world/world-overview.png",
    "channels": 3
  },
  "reports": [
    "reports/character-generation.md",
    "reports/world-generation.md",
    "reports/character-review.md",
    "reports/world-review.md"
  ]
}
```

- [ ] **Step 2: Write the validator**

The PowerShell validator must:

1. resolve its repository root from `$PSScriptRoot` without using `$HOME`;
2. parse the contract;
3. fail on missing files, unexpected dimensions, non-PNG format, non-RGB/three-channel output, or missing reports;
4. invoke Node with `sharp` to print JSON metadata for each image;
5. print one error per failed path and exit `1`; print `PASS: visual reconstruction package` and exit `0` only when complete;
6. never treat a missing value as zero or silently mutate the contract.

- [ ] **Step 3: Verify the expected initial red state**

Run:

```powershell
pwsh -NoProfile -File video-pipeline/asset-library/scripts/validate-sea-above-visual-reconstruction.ps1
```

Expected: exit `1` with missing candidate images and reports listed. No JSON parse, path-resolution, or `sharp` execution error is permitted.

- [ ] **Step 4: Record and commit Task 1**

The report records the command, exit code, and exact expected-red reason.

```powershell
git add -- 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reconstruction-contract.json' 'video-pipeline/asset-library/scripts/validate-sea-above-visual-reconstruction.ps1'
git add -f -- '.superpowers/sdd/2026-08-21-the-sea-above-visual-reconstruction/task-1-report.md'
git diff --cached --check
git commit -m "assets: define Sea Above reconstruction contract"
```

Expected: focused commit containing only the three Task 1 files.

---

### Task 2: Three Protagonist Casting Candidates

**Files:**
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/candidate-a-cold-intelligence.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/candidate-b-dangerous-curiosity.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/candidate-c-luminous-resilience.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/casting-overview.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reports/character-generation.md`

**Interfaces:**
- Consumes: Task 1 contract and the approved written spec only; no rejected image is a positive input.
- Produces: three 1080×1920 RGB casting boards plus a deterministic labelled overview for user selection.

- [ ] **Step 1: Generate Candidate A — Cold Intelligence**

Use built-in image generation with this normalized prompt:

```text
Use case: photorealistic-natural
Asset type: live-action prestige science-fiction casting board for an original fictional protagonist
Primary request: create one cohesive casting board of the same unequivocally adult 23-year-old fictional British woman, never a real celebrity, with striking star-level presence, ash-blonde wet hair, blue-green eyes, sculpted cheekbones, direct intelligent gaze, tall fit feminine athletic-hourglass proportions, natural asymmetry and memorable silhouette
Scene/backdrop: neutral real casting-studio wall with rain-damp practical floor; no fantasy environment
Style/medium: authentic live-action production photography, ARRI Alexa 35 and fine 35 mm grain character, natural pores and fine facial texture, no retouching
Composition/framing: four coherent panels: close portrait, clean right profile with visible bare right ear, three-quarter full-body view, and upward-recognition expression; identical face/body/hair/outfit in all panels
Lighting/mood: soft overcast window key, restrained contrast, realistic skin colour, calm authority and contained unease
Materials/textures: damp blonde strands with flyaways, fitted pale silk-knit camisole, structured high-waisted short skirt, practical understated shoes, believable seams and wet fabric weight
Constraints: adult age 23; no jewellery; tasteful bare arms and legs; anatomically correct hands/ears; original identity; all panels same woman
Avoid: celebrity likeness, influencer face, childlike age, oil painting, illustration, wax skin, plastic hair, fashion-campaign retouching, lingerie, nightclub styling, fantasy warrior, text, logo, watermark
```

Inspect the generated source with `view_image`. Accept only if all four panels show the same adult identity and natural anatomy. Apply at most one single-variable repair if a concrete failure exists.

- [ ] **Step 2: Generate Candidate B — Dangerous Curiosity**

Repeat the complete prompt structure from Step 1, changing only the identity direction to:

```text
pale-gold wet blonde hair, vivid blue eyes, sharper eye shape, defined jaw, magnetic dangerous curiosity, more volatile emotional presence, still refined and intelligent; clearly a different fictional woman from Candidate A
```

All age, anatomy, wardrobe, photography, panel, and anti-AI constraints remain verbatim.

- [ ] **Step 3: Generate Candidate C — Luminous Resilience**

Repeat the complete prompt structure from Step 1, changing only the identity direction to:

```text
honey-ash wet blonde hair, luminous blue-green eyes, softer but distinctive facial planes, emotionally accessible resilience, quiet strength under pressure; clearly a different fictional woman from Candidates A and B
```

All age, anatomy, wardrobe, photography, panel, and anti-AI constraints remain verbatim.

- [ ] **Step 4: Normalize and create casting overview**

Use `sharp` to centre-crop each accepted board to 1080×1920 without stretching. Build `casting-overview.png` as a deterministic 3240×1920 horizontal canvas in A/B/C order, with labels `A`, `B`, and `C` confined to a 64-pixel black top gutter. Do not alter master pixels beyond resizing/cropping needed for the contract.

- [ ] **Step 5: Record provenance and run focused checks**

`character-generation.md` must contain each exact prompt, the generated source path under Codex generated images, final path, SHA-256, dimensions, channels, repair prompt if used, inspection result, and rejected-source reason.

Run:

```powershell
pwsh -NoProfile -File video-pipeline/asset-library/scripts/validate-sea-above-visual-reconstruction.ps1
```

Expected: exit `1` only because world assets and independent review reports are not yet present. Character images must not appear in the error list.

- [ ] **Step 6: Hand off the character track without touching the shared Git index**

The parallel Luna Max producer must not run `git add`, `git commit`, or mutate the shared index. It returns the exact owned file list, hashes, and focused-check output to the parent agent. Expected: no world, accepted-character, first-frame, director-card, or video path modified.

---

### Task 3: Five World-Scale Scene Candidates

**Files:**
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-city-beneath-sea.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-portrait-crop-test.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-02-evacuation-square.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-03-s01-street-hook.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-04-rooftops-under-mother.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-05-cliffs-harbour-ocean.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/world-overview.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reports/world-generation.md`

**Interfaces:**
- Consumes: Task 1 contract and approved written world rules only; no rejected environment or first-frame image is a positive input.
- Produces: five independently reviewable world scenes, one portrait crop proof, and a deterministic overview.

- [ ] **Step 1: Generate Scene 01 — City Beneath the Sea**

```text
Use case: photorealistic-natural
Asset type: ultra-wide live-action science-fiction disaster establishing frame
Primary request: a populated British coastal city physically trapped beneath an ocean whose underside spans the entire horizon; the image must prove the phenomenon covers kilometres, not one street
Scene/backdrop: elevated civic rooftop looking across dense wet-stone districts, harbour, cathedral-scale civic landmarks, rail lines, cranes, distant cliffs and thousands of tiny scale references; multiple irregular water filaments rise from roads, roofs, river and harbour into the overhead ocean; one incomplete Mother shadow crosses several districts with no anatomy
Style/medium: grounded live-action production still with invisible VFX integration, ARRI Alexa 35 / fine 35 mm film character, no named-film imitation
Composition/framing: 14–18 mm rectilinear ultra-wide, strong foreground rooftop scale, layered city depth, horizon-spanning ocean, asymmetrical districts, crop-safe central vertical corridor
Lighting/mood: natural storm overcast transmitted through kilometres of water, restrained cyan only in motivated caustics, practical city warmth, soft highlight roll-off, realistic aerial perspective
Materials/textures: real wet slate, limestone, brick, glass, steel, mist and sea sediment
Constraints: physically coherent perspective and light; no complete creature; no text/logos; irregular ground-to-sky water motion; populated city
Avoid: oil painting, matte painting, game concept art, swimming-pool ceiling, flat water texture, glossy CGI, perfect symmetry, empty city, fantasy castle, magic beams, particle soup, duplicated buildings, multiple suns
```

Accept only if at least five independent scale cues are visible and the ocean spans the full city horizon.

- [ ] **Step 2: Generate Scene 02 — Evacuation Square**

Use the same photographic and anti-AI constraints with this scene block:

```text
monumental British civic square during an organised panic; hundreds of individually varied adults remove pearls and jewellery while fleeing across wet paving; water pulls upward from fountain basins, gutters, umbrellas and coats in irregular tapered filaments; buses, statues, civic steps and surrounding towers establish scale; 18 mm lens from low shoulder height; no protagonist focal portrait
```

Reject repeated extras, duplicated faces, crowd smearing, ordinary downward rain, or jewellery-removal gestures that only look like people covering their ears.

- [ ] **Step 3: Generate Scene 03 — S01 Street Hook**

Use the same photographic and anti-AI constraints with this scene block:

```text
vertical 9:16 live-action street frame, 28–35 mm observational lens, a temporary anonymous blonde adult stand-in positioned off-axis and still while layered crowds flee; one foreground civilian clearly holds removed jewellery away from the neck; multiple small puddle and gutter filaments pull upward with visible suction origins and downward tails; overhead sea enormous but naturally integrated; stand-in is not a casting decision and must not be reused after user selection
```

Reject centred fashion posing, perfect water columns, splash crowns, bead strings, or any frame that requires motion to understand the upward direction.

- [ ] **Step 4: Generate Scene 04 — Rooftops Under the Mother**

Use the same photographic and anti-AI constraints with this scene block:

```text
low 14–18 mm view across real British rooftops, chimneys, cranes, towers and antennae; an impossible city-block-scale moving shadow and pressure distortion crosses the overhead ocean; people on several rooftops provide tiny scale; show no eye, face, limb, teeth, tentacle or complete silhouette
```

- [ ] **Step 5: Generate Scene 05 — Cliffs, Harbour, and Vertical Ocean**

Use the same photographic and anti-AI constraints with this scene block:

```text
epic coastal panorama containing wet cliffs, working harbour, dense city skyline and the overhead ocean in one coherent frame; harbour and river water rises in broad irregular sheets and filaments, revealing the vertical relationship between ground and sky-sea; tiny vessels, vehicles and people provide scale; 14–18 mm rectilinear ultra-wide, asymmetrical coastline
```

- [ ] **Step 6: Normalize masters, crop proof, and overview**

Use `sharp` without stretching:

- Scene 01 and Scene 05: 2560×1080 centre crop.
- Scene 02 and Scene 04: 1920×1080 centre crop.
- Scene 03: 1080×1920 centre crop.
- Derive `scene-01-portrait-crop-test.png` as a 1080×1920 crop from the Scene 01 generated source, preserving city, ocean, and at least three scale cues.
- Build `world-overview.png` on a 2560×1440 black canvas with labelled cells `01`–`05`; labels remain in gutters and masters remain unchanged.

- [ ] **Step 7: Record provenance and run focused checks**

`world-generation.md` contains every exact prompt, source/output path, SHA-256, metadata, positive inspection evidence, rejected reason, and repair prompt.

Run the reconstruction validator. Expected: all world images pass; exit remains `1` only if the character track or independent review reports are incomplete.

- [ ] **Step 8: Hand off the world track without touching the shared Git index**

The parallel Luna Max producer must not run `git add`, `git commit`, or mutate the shared index. It returns the exact owned file list, hashes, and focused-check output to the parent agent. Expected: no character-candidate, accepted environment, first-frame, director-card, or video path modified.

---

### Task 4: Independent Candidate Reviews and Package Validation

**Files:**
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reports/character-review.md`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reports/world-review.md`

**Interfaces:**
- Consumes: Task 2 and Task 3 committed candidate assets and generation reports.
- Produces: two independent review decisions and a validator-green candidate package ready for user presentation.

- [ ] **Step 0: Parent agent integrates the two parallel production tracks serially**

After both producers are idle, the parent agent visually inspects every owned file and then makes two non-overlapping commits in this exact order. Use pathspec-limited commits so pre-existing rejected first-frame/style-test changes are not included:

```powershell
git add -- 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters' 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reports/character-generation.md'
git diff --cached --check
git commit -m "assets: create Sea Above casting candidates" -- 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters' 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reports/character-generation.md'

git add -- 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world' 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reports/world-generation.md'
git diff --cached --check
git commit -m "assets: create Sea Above world candidates" -- 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world' 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reports/world-generation.md'
```

Expected: the character commit contains only character candidates/overview/report; the world commit contains only world candidates/overview/report.

- [ ] **Step 1: Run independent Luna Max character review**

The reviewer is read-only and must inspect all three full-resolution boards plus overview. It reports per candidate:

- adult 21–24 read;
- star-level attraction and distinctiveness without celebrity likeness;
- identity consistency across all panels;
- realistic skin/hair/materials and absence of oil-paint or AI-poster texture;
- natural hands, ears, face, body and wardrobe;
- suitability of the bare right ear for the exact product;
- concrete Critical/Important/Minor issues.

The reviewer writes `character-review.md`. Any Critical issue sends only that candidate back to a fresh targeted repair cycle before re-review.

- [ ] **Step 2: Run independent Luna Max world review**

The reviewer is read-only and must inspect every full-resolution scene, portrait crop, and overview. It verifies:

- Scene 01 and Scene 05 are genuinely ultra-wide and city/world scale;
- perspective, light, ocean depth, atmospheric distance, and scale cues are coherent;
- reverse rain reads ground-to-sky in still frames;
- Scene 02 crowd is varied and jewellery removal is explicit;
- Scene 04 reveals no Mother anatomy;
- Scene 03 avoids accepted-character claims;
- no painting, concept-art, glossy CGI, symmetry, repeated people/buildings, text, logo, or watermark survives;
- concrete Critical/Important/Minor issues.

The reviewer writes `world-review.md`. Any Critical issue sends only the failed scene back to a fresh targeted repair cycle before re-review.

- [ ] **Step 3: Run final automated validation**

```powershell
pwsh -NoProfile -File video-pipeline/asset-library/scripts/validate-sea-above-visual-reconstruction.ps1
git diff --check
```

Expected:

```text
PASS: visual reconstruction package
```

and exit code `0`. Do not reinterpret missing reports or assets as acceptable.

- [ ] **Step 4: Commit reviews**

```powershell
git add -- 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reports/character-review.md' 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reports/world-review.md'
git diff --cached --check
git commit -m "docs: review Sea Above visual candidates"
```

---

### Task 5: User Casting and World Selection Gate

**Files:**
- Create after user selection only: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/selection.json`
- Create after user selection only: `.superpowers/sdd/2026-08-21-the-sea-above-visual-reconstruction/user-selection.md`

**Interfaces:**
- Consumes: validator-green character and world candidate package.
- Produces: an explicit user decision; it does not yet promote assets into accepted production paths.

- [ ] **Step 1: Present all candidates**

Show the user:

1. `casting-overview.png` followed by all three full-resolution casting boards;
2. `world-overview.png` followed by all five full-resolution scene masters and the Scene 01 portrait crop proof;
3. a concise list of independent-review findings that materially affect selection.

- [ ] **Step 2: Request exact selection**

Ask the user to provide both decisions in one response:

```text
角色：A / B / C
世界：通过 / 指定需要重做的场景编号
```

Do not infer approval from silence, praise, or approval of only one half.

- [ ] **Step 3: Record the decision without promotion**

After explicit approval, write:

```json
{
  "status": "user_selected",
  "character": "A",
  "world_approved": true,
  "approved_scene_ids": ["01", "02", "03", "04", "05"],
  "selected_at": "ISO-8601 timestamp with timezone",
  "next_gate": "rebuild_S01-S09_first_frames"
}
```

Replace only the `character` value with the user's actual A/B/C choice. Record the user's exact wording and local timestamp in `user-selection.md`; never write unavailable metrics as zero.

- [ ] **Step 4: Validate and commit the selection record**

```powershell
git add -- 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/selection.json'
git add -f -- '.superpowers/sdd/2026-08-21-the-sea-above-visual-reconstruction/user-selection.md'
git diff --cached --check
git commit -m "docs: record Sea Above visual selection"
```

Stop after this commit. Rebuilding S01–S09 requires the next approved execution phase; director-card completion and paid video generation remain separately gated.
