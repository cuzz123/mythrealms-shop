# FILE 001 S01–S09 First-Frame Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a validator-green, independently reviewed, user-ready v1 set of nine 2160×3840 live-action first frames using selected protagonist B, the real Baroque Orbit earring, and the approved “Sea Above” world.

**Architecture:** Keep the rejected legacy first frames untouched and build an immutable v1 candidate namespace under `visual-reconstruction/first-frames/`. A contract and validator establish fail-closed media and provenance requirements; built-in image generation creates one distinct asset per call, with targeted repair variants recorded rather than overwritten. Independent Luna Max sessions review character/product continuity, world/narrative continuity, and final photographic quality before the user gate.

**Tech Stack:** Built-in image generation, PowerShell 7, Node.js with repository `sharp`, Git, JSON and Markdown audit records, independent Luna Max review sessions.

**Spec:** `docs/superpowers/specs/2026-08-21-the-sea-above-first-frame-rebuild-design.md`

## Global Constraints

- Candidate B is immutable at SHA-256 `2CA5B608255BD2BE4DB3701CFFDA4EF4C5BA407F9CB85C7325ED37D84DF966F9`.
- Present-day wardrobe is always cream/white camisole, cream/white structured high-waisted short skirt, and white practical flats.
- Product truth hashes are `DD12F12A092965A08AB9096DC3E4E79925779B641B29142B4194FF1C8BDF950F`, `73855F92B3426DE9428042561DF8AD5BD5A4EB98496BD31F2934ECEA6C67E2E5`, and `0B8671FAFCD9481DD53FC10EFB8ACC4671B901ABA647BF7C273069A01793517B`.
- Only Candidate B, immutable product truth, and approved `visual-reconstruction/world/scene-01`–`scene-05` assets may be positive visual inputs.
- Old character/environment anchors, old memory pair, old first frames, and style tests are negative history only and must not be passed to image generation.
- Every master is exactly 2160×3840, PNG, three-channel RGB/sRGB; never stretch anatomy or product geometry.
- Built-in image generation is one call per distinct asset or targeted repair; no CLI/API generation fallback.
- No image may contain readable generated text, logos, prices, or watermarks; S09 must be text-free.
- No director card, Seedance video, publishing, production promotion, or paid-credit consumption occurs in this plan.
- Existing dirty legacy first-frame/style-test files and `scripts/__pycache__/` must remain unmodified and uncommitted.
- The B/D/F slot layout from `seedance-storyboard-production` is incompatible with the fixed S01–S09 contract; retain only its non-overwrite, provenance, independent-QA, and fail-closed controls.

## File Map

- `visual-reconstruction/first-frames/first-frame-contract.json`: immutable v1 file, input-hash, metadata, and report authority.
- `visual-reconstruction/first-frames/v1/S01.png`–`S09.png`: accepted candidate masters awaiting user approval.
- `visual-reconstruction/first-frames/v1/continuity/memory-pair-v1.png`: positive identity lock used only by S06/S07.
- `visual-reconstruction/first-frames/v1/3x3-overview.png`: deterministic labelled contact sheet; never a generation input.
- `visual-reconstruction/first-frames/v1/reports/generation.md`: exact prompts, inputs, source/output paths, hashes, inspections, rejections, and repairs.
- `visual-reconstruction/first-frames/v1/reports/character-product-review.md`: independent Luna Max identity/product review.
- `visual-reconstruction/first-frames/v1/reports/world-narrative-review.md`: independent Luna Max world/story review.
- `visual-reconstruction/first-frames/v1/reports/final-visual-review.md`: independent Luna Max photographic/anatomy/anti-AI review.
- `video-pipeline/asset-library/scripts/validate-sea-above-first-frames.ps1`: fail-closed automated validator.
- `.superpowers/sdd/2026-08-21-the-sea-above-first-frame-rebuild/`: task evidence and exact reviewer decisions.

---

### Task 1: Version Contract and Failing Validator

**Files:**
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/first-frame-contract.json`
- Create: `video-pipeline/asset-library/scripts/validate-sea-above-first-frames.ps1`
- Create: `.superpowers/sdd/2026-08-21-the-sea-above-first-frame-rebuild/task-1-report.md`

**Interfaces:**
- Consumes: production contract, selection record, approved input files and hashes.
- Produces: a declarative v1 asset contract and validator returning exit `0` only when all masters, continuity anchor, overview, provenance, and review reports satisfy the contract.

- [ ] **Step 1: Write the contract**

Create `first-frame-contract.json` with this exact public structure and the actual SHA-256 values for every approved world scene filled from `Get-FileHash`:

```json
{
  "schema_version": 1,
  "package_id": "VID_MR_SEA_ABOVE_FILE_001_FIRST_FRAMES_V1",
  "status": "candidate_awaiting_user_approval",
  "master": { "width": 2160, "height": 3840, "format": "png", "channels": 3, "colour_space": "srgb" },
  "selected_character": { "id": "B", "path": "video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/candidate-b-dangerous-curiosity.png", "sha256": "2CA5B608255BD2BE4DB3701CFFDA4EF4C5BA407F9CB85C7325ED37D84DF966F9" },
  "product_truth": [
    { "path": "video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/source/main.jpg", "sha256": "DD12F12A092965A08AB9096DC3E4E79925779B641B29142B4194FF1C8BDF950F" },
    { "path": "video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/source/detail-05.jpg", "sha256": "73855F92B3426DE9428042561DF8AD5BD5A4EB98496BD31F2934ECEA6C67E2E5" },
    { "path": "video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/views/product-lock.png", "sha256": "0B8671FAFCD9481DD53FC10EFB8ACC4671B901ABA647BF7C273069A01793517B" }
  ],
  "approved_world": [],
  "version_directory": "v1",
  "shots": ["S01", "S02", "S03", "S04", "S05", "S06", "S07", "S08", "S09"],
  "continuity_assets": ["v1/continuity/memory-pair-v1.png"],
  "overview": "v1/3x3-overview.png",
  "reports": [
    "v1/reports/generation.md",
    "v1/reports/character-product-review.md",
    "v1/reports/world-narrative-review.md",
    "v1/reports/final-visual-review.md"
  ],
  "forbidden_positive_input_prefixes": ["first-frames/", "05-characters/CHAR_MR_TIDE_", "03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001", "08-fx/FX_MR_"]
}
```

Resolve every contract path relative to the repository root. `approved_world` contains repository-root-relative path/hash objects for all five approved world masters plus the Scene 01 portrait crop where referenced.

- [ ] **Step 2: Write the fail-closed validator**

The PowerShell validator must resolve the repository root from `$PSScriptRoot`, parse the contract, and use Node plus `sharp` to verify every shot and continuity image. It must fail on a missing path, input-hash drift, non-PNG shot, dimensions other than 2160×3840, channel count other than three, colour space other than sRGB, missing report, missing shot section in `generation.md`, missing SHA-256 field, missing reference-role field, or a forbidden positive-input prefix found in provenance.

It prints one actionable error per path, exits `1` on any error, and prints only `PASS: Sea Above first-frame v1 package` before exit `0` when complete. Missing/unavailable values must never be coerced to zero.

- [ ] **Step 3: Run the expected-red test**

```powershell
pwsh -NoProfile -File video-pipeline/asset-library/scripts/validate-sea-above-first-frames.ps1
```

Expected: exit `1` listing absent v1 assets/reports, with no JSON, root-resolution, hash, or `sharp` crash.

- [ ] **Step 4: Record and commit only Task 1**

```powershell
git add -- 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/first-frame-contract.json' 'video-pipeline/asset-library/scripts/validate-sea-above-first-frames.ps1'
git add -f -- '.superpowers/sdd/2026-08-21-the-sea-above-first-frame-rebuild/task-1-report.md'
git diff --cached --check
git commit -m "assets: define Sea Above first-frame v1 contract" -- 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/first-frame-contract.json' 'video-pipeline/asset-library/scripts/validate-sea-above-first-frames.ps1' '.superpowers/sdd/2026-08-21-the-sea-above-first-frame-rebuild/task-1-report.md'
```

---

### Task 2: Present-Day Hook and Reveal Frames S01–S03

**Files:**
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S01.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S02.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S03.png`
- Create or append: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/reports/generation.md`

**Interfaces:**
- Consumes: Candidate B, three immutable product anchors, approved world Scenes 01–03, and Task 1 contract.
- Produces: three normalized masters with stable identity, exact jewellery where visible, and unambiguous reverse-rain/world rules.

- [ ] **Step 1: Generate and inspect S01**

Use Candidate B and approved Scene 03 as positive references. The exact prompt must include: same fictional adult Candidate B identity; pale-gold wet blonde hair; vivid blue eyes; cream camisole, cream structured high-waisted short skirt, white practical flats; off-axis stillness; fleeing British-city crowd removing jewellery; multiple irregular puddle/gutter/coat-to-sea filaments with visible ground origins; 28–35 mm observational live-action camera; real wet stone and natural storm light; no generated text. Reject if upward gravity is unreadable at a 270×480 thumbnail, the heroine becomes a fashion pose, or any filament looks like ordinary falling rain.

- [ ] **Step 2: Generate and inspect S02**

Use Candidate B, product `main.jpg`, `detail-05.jpg`, `product-lock.png`, and S01 only after S01 is accepted. Prompt for a right-profile/three-quarter 35–40 mm close-up with the exact single Baroque Orbit construction in focus, beginning to angle toward the sea. Preserve natural face/ear anatomy, wet-hair clumps, skin texture, and S01 light. Reject any missing green stones, wrong connector, extra pearl, missing terminal bead, mirrored construction, deformed ear, or beauty-ad retouching.

- [ ] **Step 3: Generate and inspect S03**

Use approved world Scenes 01, 03, and 05 plus accepted S01 for geography, never for identity replacement. Prompt for a low 14–18 mm vertical reveal: one irregular reverse-rain path connects wet street foreground to the horizon-spanning ocean; Candidate B is small or partial; real architecture supplies at least three depth cues. Reject a swimming-pool ceiling, decorative water roof, centred tunnel, flat matte painting, or unclear vertical direction.

- [ ] **Step 4: Normalize and record provenance**

For each accepted source, inspect with `view_image`, then use `sharp` to crop/pad to 2160×3840 RGB/sRGB without stretching. In `generation.md`, create an `## S0N` section with exact prompt, positive references and roles, explicit negative-history exclusions, generated source path, accepted output path, dimensions, channels, colour space, SHA-256, visual inspection result, rejection reason, and every targeted repair prompt. A repair changes one concrete variable and creates a new source; it never overwrites the rejected source.

- [ ] **Step 5: Focused validation and handoff**

Run the validator. Expected: S01–S03 do not appear in its errors; remaining frames and reviews still fail. The Luna Max producer returns owned paths/hashes and does not run `git add` or `git commit`.

- [ ] **Step 6: Parent review and focused commit**

After visual inspection, commit only S01–S03 and the generation report with pathspecs. Expected commit message: `assets: rebuild Sea Above first frames S01 to S03`.

---

### Task 3: Scale and Mother Frames S04–S05

**Files:**
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S04.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S05.png`
- Modify: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/reports/generation.md`

**Interfaces:**
- Consumes: approved world Scenes 01, 04, 05 and accepted S03 geography/light.
- Produces: a coherent no-anatomy Mother shadow frame followed by one restrained biological eye reveal.

- [ ] **Step 1: Generate S04**

Prompt a 14–18 mm ultra-wide city view using the approved world references and S03 geography. The incomplete Mother shadow must cross several districts and dim the same overhead ocean while irregular reverse rain continues. Require at least five scale cues. Explicitly forbid eye, face, limb, teeth, tentacle, full silhouette, centred symmetry, empty city, and concept-art rendering.

- [ ] **Step 2: Generate S05**

Prompt one immense partially occluded biological eye beneath the sea, readable through landmarks and atmospheric distance. Use the irregular white pearl only as subtle nacre microstructure inspiration; do not construct the eye from jewellery. Preserve the S04 sea height/light and forbid body, face, mouth, tentacle, beam, gore, magic particles, poster framing, and glossy monster CGI.

- [ ] **Step 3: Normalize, record, validate, and hand off**

Apply the same `sharp`, `view_image`, provenance, single-variable repair, and focused-validator rules as Task 2. Expected: S01–S05 pass media/provenance checks; S06–S09 and review reports remain missing. The Luna Max producer does not touch the Git index.

- [ ] **Step 4: Parent review and focused commit**

Commit only S04, S05, and the updated generation report. Expected commit message: `assets: rebuild Sea Above first frames S04 and S05`.

---

### Task 4: New Memory Continuity Pair and Frames S06–S07

**Files:**
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/continuity/memory-pair-v1.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S06.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S07.png`
- Modify: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/reports/generation.md`

**Interfaces:**
- Consumes: Candidate B facial traits as family-continuity guidance, real product truth, approved city geography, and no old memory-pair image.
- Produces: one new photographic identity anchor plus an accepted S06/S07 continuity pair.

- [ ] **Step 1: Generate the new memory anchor**

Create one live-action continuity board containing the same fictional child and adult female relative across clean portrait, right-ear product profile, and hand-holding views. The child may share plausible familial traits with Candidate B without being a face-shrunk adult. The adult relative wears the exact Baroque Orbit earring; anatomy, age separation, hands, and product structure must be clear. Record that the old `CHAR_MR_TIDE_MEMORY_PAIR_001/source/memory-pair-lock.png` was excluded.

- [ ] **Step 2: Generate S06**

Use only the new memory anchor, product truth, and approved world reference. Prompt the child holding the adult relative's hand on the same street in fragile warm memory light, with the exact earring legible but not staged as an advertisement. Reject identity drift, mismatched hands, adult-looking child, wrong product, soft-focus concealment, and painterly nostalgia.

- [ ] **Step 3: Generate S07**

Use the new memory anchor and accepted S06. Prompt the same adult relative beginning to vanish through physically plausible refraction in rising water while the child remains consistent. Reject melting flesh, gore, facial morphing, glitch pixels, magic dust, painterly dissolve, or replacement by a different woman.

- [ ] **Step 4: Pair review, normalize, record, validate, and hand off**

Inspect S06 and S07 side by side at full resolution. Repair/re-review them as a pair when either identity drifts. Normalize the continuity board and both masters to contract dimensions, add complete provenance, and run the validator. Expected: S01–S07 and the memory anchor pass; S08/S09 and reviews remain missing. The Luna Max producer does not touch the Git index.

- [ ] **Step 5: Parent review and focused commit**

Commit only the memory anchor, S06, S07, and the updated generation report. Expected commit message: `assets: rebuild Sea Above memory first frames`.

---

### Task 5: Reversal, Loop, and Deterministic Overview

**Files:**
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S08.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S09.png`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/3x3-overview.png`
- Modify: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/reports/generation.md`

**Interfaces:**
- Consumes: Candidate B, exact product truth, accepted S01/S02/S04/S05 continuity, and all accepted masters for overview assembly.
- Produces: final two masters and a labelled 3×3 review sheet.

- [ ] **Step 1: Generate S08**

Prompt Candidate B in the fixed cream outfit with exact earring, subtle physically plausible iris change, and pearls responding across layered city depth. Preserve the established sea/light/Mother scale. Reject superhero beams, glowing-ad jewellery, full creature, excessive particles, neon cyan grade, wrong wardrobe, identity drift, or product redesign.

- [ ] **Step 2: Generate S09**

Generate a dark photographic atmospheric plate with one real droplet rising through the frame and a luminance/motion composition that can cut back to S01. Require no text, title, logo, archive label, subtitle, watermark, creature, jewellery, or face.

- [ ] **Step 3: Normalize and build overview deterministically**

Normalize S08/S09 as above. Use `sharp` to assemble `3x3-overview.png` from accepted masters in exact row order `S01 S02 S03 / S04 S05 S06 / S07 S08 S09`. Place `S01`–`S09` labels only in opaque black gutters; do not rasterize labels over master image pixels and do not use generative assembly.

- [ ] **Step 4: Complete provenance and focused validation**

Record full S08/S09 provenance and an overview assembly command/hash. Run the validator. Expected: the only remaining failures are the three independent review reports.

- [ ] **Step 5: Parent review and focused commit**

Commit only S08, S09, overview, and updated generation report. Expected commit message: `assets: complete Sea Above first-frame v1 set`.

---

### Task 6: Three Independent Luna Max Reviews and Repair Gate

**Files:**
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/reports/character-product-review.md`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/reports/world-narrative-review.md`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/reports/final-visual-review.md`
- Create: `.superpowers/sdd/2026-08-21-the-sea-above-first-frame-rebuild/final-validation.md`

**Interfaces:**
- Consumes: all full-resolution v1 masters, memory anchor, overview, provenance, spec, and contract.
- Produces: three independent verdicts and a validator-green package or a precise failed-frame repair request.

- [ ] **Step 1: Run the character/product reviewer**

An independent Luna Max session inspects S01–S09 individually and side-by-side. It reports PASS/FAIL per visible occurrence for Candidate B identity, unequivocal adult age, wet pale-gold blonde hair, blue eyes, fixed cream wardrobe, face/body/hand/ear anatomy, and exact hoop/green stones/connector/baroque pearl/terminal gold bead. It separately verifies the new S06/S07 identities. Every finding is classified Critical, Important, or Minor with exact frame IDs.

- [ ] **Step 2: Run the world/narrative reviewer**

A second independent Luna Max session verifies still-readable narrative jobs: S01 upward rain, S02 pearl answer, S03 sky-sea reveal, S04 shadow-only scale, S05 eye-only restraint, S06 childhood memory, S07 memory erasure, S08 Mother reversal, and S09 text-free loop. It also checks shared geography, sea height, light, reverse-rain direction, Mother scale, and S06/S07 pair continuity.

- [ ] **Step 3: Run the final visual reviewer**

A third independent Luna Max session checks full-resolution photographic realism and rejects oil paint, concept art, glossy CGI, wax skin, plastic hair, cloned people/buildings, impossible anatomy, stretched pixels, poster symmetry, excessive cyan, generated text, logos, prices, and watermarks. It must inspect masters rather than judging only the overview.

- [ ] **Step 4: Repair only failed frames and repeat affected reviews**

Any Critical issue fails closed. Send only the affected frame, or S06/S07 pair, to a fresh targeted built-in image repair using one variable named by the reviewer. Preserve the rejected source and record the repair. Re-run every reviewer whose domain was affected; do not mark an unavailable re-review as PASS.

- [ ] **Step 5: Run final automated evidence commands**

```powershell
pwsh -NoProfile -File video-pipeline/asset-library/scripts/validate-sea-above-first-frames.ps1
git diff --check
Get-FileHash -Algorithm SHA256 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/*.png'
```

Expected: `PASS: Sea Above first-frame v1 package`, exit `0`, clean whitespace check, and explicit hashes for every PNG. Record exact commands, exit codes, hashes, reviewer verdicts, and any unavailable metric as `not_available`, never `0`.

- [ ] **Step 6: Commit reviews and evidence**

Use pathspec-limited staging and commit message `docs: review Sea Above first-frame v1 package`. Do not include legacy first-frame/style-test changes.

---

### Task 7: User First-Frame Approval Gate

**Files:**
- Create only after explicit approval: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/user-approval.json`
- Create only after explicit approval: `.superpowers/sdd/2026-08-21-the-sea-above-first-frame-rebuild/user-approval.md`

**Interfaces:**
- Consumes: validator-green full-resolution masters, overview, and independent review summaries.
- Produces: explicit approval or an exact repair list; never a director card or video.

- [ ] **Step 1: Present the package**

Show the 3×3 overview and all nine full-resolution frames, followed by concise reviewer findings. State clearly that these are first frames only, not generated video and not the final director card.

- [ ] **Step 2: Request exact user decision**

Ask for one of:

```text
首帧通过
```

or:

```text
重做：S02、S07（具体问题）
```

Praise, silence, or approval of fewer than all nine frames is not package approval.

- [ ] **Step 3: Record explicit approval without promotion**

After `首帧通过`, write `user-approval.json` containing status, package ID, ordered shot IDs, exact master hashes, approval timestamp with timezone, exact user wording, and `next_gate: finalize_director_card`. Record unavailable metrics as `not_available` rather than zero.

- [ ] **Step 4: Validate and commit the gate record**

Run the validator again, `git diff --check`, then pathspec-commit only the approval files with message `docs: record Sea Above first-frame approval`.

- [ ] **Step 5: Stop**

Do not write the final director card in this plan. Do not generate video or consume credits. Report that the next separately approved phase is director-card completion, followed by action-time confirmation before any paid Seedance generation.
