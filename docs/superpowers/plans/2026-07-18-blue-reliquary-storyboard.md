# The Blue Reliquary Storyboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a production-ready 60-second, 15-clip Seedance package for pearl-series-04, including shot contracts, boundary edit contracts, asset references, and Obsidian-ready archive records.

**Architecture:** Keep creative truth in one master storyboard Markdown file under `video-pipeline/work`, where each four-second clip has a shot contract and every boundary has an edit contract. A small PowerShell validator checks duration, absolute reference paths, product proof, and all 14 edit boundaries before the package is copied into the asset library and linked from Obsidian.

**Tech Stack:** Markdown, PowerShell, existing local asset-library directory, Seedance all-mode prompt format, Obsidian Markdown.

## Global Constraints

- Produce 15 clips of exactly 4 seconds each for a 60-second final edit.
- Product structure is locked to `D:\mythrealms-shop\public\images\products\1688-shop\pearl-series\pearl-series-04-detail1.webp`.
- Use absolute Windows paths for every uploaded reference image.
- Product geometry, colour and bead order outrank talent and scene fidelity.
- Every boundary has an explicit transition plus a sound bridge or explicit silent cut.
- Do not ask the video model to render readable logo text; overlay the MythRealms logo in post.

---

## File Structure

- Create: `video-pipeline/work/2026-07-18-blue-reliquary/blue-reliquary-60s-master-storyboard.md` — source of truth for 15 shot contracts, 14 edit contracts, prompts and retake rules.
- Create: `video-pipeline/work/2026-07-18-blue-reliquary/validate-blue-reliquary.ps1` — validates that the storyboard has all required clip and boundary records and that absolute image paths exist.
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_BLUE_RELIQUARY_001/README.md` — durable asset-library record with output slots and links to master material.
- Create: `video-pipeline/asset-library/obsidian-vault/03-参考拆解/VID_MR_BLUE_RELIQUARY_001｜蓝色秘藏60秒分镜.md` — Obsidian entrypoint.

### Task 1: Lock the reference and production constraints

**Files:**
- Create: `video-pipeline/work/2026-07-18-blue-reliquary/blue-reliquary-60s-master-storyboard.md`
- Test: `video-pipeline/work/2026-07-18-blue-reliquary/validate-blue-reliquary.ps1`

**Interfaces:**
- Consumes: the absolute product path from Global Constraints.
- Produces: YAML frontmatter with `clip_count: 15`, `clip_duration_seconds: 4`, `total_duration_seconds: 60`, and `product_lock_path`.

- [ ] **Step 1: Write the failing validation assertion**

```powershell
$text = Get-Content -Raw -LiteralPath $storyboard
if ($text -notmatch 'clip_count: 15') { throw 'Expected 15 clips' }
if ($text -notmatch 'clip_duration_seconds: 4') { throw 'Expected 4-second clips' }
if ($text -notmatch [regex]::Escape($productPath)) { throw 'Missing product lock path' }
```

- [ ] **Step 2: Run the validation to verify it fails**

Run: `powershell -ExecutionPolicy Bypass -File video-pipeline/work/2026-07-18-blue-reliquary/validate-blue-reliquary.ps1`

Expected: FAIL because the storyboard does not exist.

- [ ] **Step 3: Write the master storyboard frontmatter and creative lock**

```markdown
---
project_id: VID_MR_BLUE_RELIQUARY_001
clip_count: 15
clip_duration_seconds: 4
total_duration_seconds: 60
product_lock_path: D:\mythrealms-shop\public\images\products\1688-shop\pearl-series\pearl-series-04-detail1.webp
---
```

- [ ] **Step 4: Run the validation to verify it passes**

Run: `powershell -ExecutionPolicy Bypass -File video-pipeline/work/2026-07-18-blue-reliquary/validate-blue-reliquary.ps1`

Expected: PASS for production constraints; later tasks extend the same validator.

- [ ] **Step 5: Commit**

```powershell
git add -- video-pipeline/work/2026-07-18-blue-reliquary
git commit -m "docs: lock blue reliquary production constraints"
```

### Task 2: Author the 15 shot contracts and Seedance prompts

**Files:**
- Modify: `video-pipeline/work/2026-07-18-blue-reliquary/blue-reliquary-60s-master-storyboard.md`
- Modify: `video-pipeline/work/2026-07-18-blue-reliquary/validate-blue-reliquary.ps1`

**Interfaces:**
- Consumes: Task 1 frontmatter and product lock.
- Produces: headings `## S01A` through `## S15A`; each has `Upload images (in order)`, an all-mode prompt, start state, end state, camera, sound, and product proof.

- [ ] **Step 1: Extend validation with a failing shot-count assertion**

```powershell
$shots = [regex]::Matches($text, '(?m)^## S(?:0[1-9]|1[0-5])A$')
if ($shots.Count -ne 15) { throw "Expected 15 shot contracts, got $($shots.Count)" }
```

- [ ] **Step 2: Run the validation to verify it fails**

Run: `powershell -ExecutionPolicy Bypass -File video-pipeline/work/2026-07-18-blue-reliquary/validate-blue-reliquary.ps1`

Expected: FAIL with `Expected 15 shot contracts`.

- [ ] **Step 3: Add the shot contracts in five narrative blocks**

```markdown
## S01A

**Edit timecode:** 00:00–00:04  
**Narrative job:** Establish a black-and-blue private collection room before revealing the product.  
**Upload images (in order):**
1. `D:\mythrealms-shop\public\images\products\1688-shop\pearl-series\pearl-series-04-detail1.webp` — only controls product material palette; do not reveal full jewellery yet.

**All-mode prompt:** 16:9, 4 seconds. [Concrete single action and one camera move.] Avoid readable text and altered jewellery geometry. Sound: [specific ambience].
```

Use this exact section format for `S01A`–`S15A`, grouped as 0–12s, 12–24s, 24–40s, 40–52s, and 52–60s.

- [ ] **Step 4: Extend validation for each prompt's absolute product path and product proof**

```powershell
foreach ($id in 1..15) {
  $label = 'S{0:D2}A' -f $id
  $section = ($text -split "## $label", 2)[1]
  if (-not $section -or $section -notmatch 'All-mode prompt' -or $section -notmatch 'product proof') { throw "Incomplete $label" }
}
```

- [ ] **Step 5: Run the validation to verify it passes**

Run: `powershell -ExecutionPolicy Bypass -File video-pipeline/work/2026-07-18-blue-reliquary/validate-blue-reliquary.ps1`

Expected: PASS with `shots=15`.

- [ ] **Step 6: Commit**

```powershell
git add -- video-pipeline/work/2026-07-18-blue-reliquary
git commit -m "docs: add blue reliquary shot prompts"
```

### Task 3: Add 14 edit contracts and validate continuity

**Files:**
- Modify: `video-pipeline/work/2026-07-18-blue-reliquary/blue-reliquary-60s-master-storyboard.md`
- Modify: `video-pipeline/work/2026-07-18-blue-reliquary/validate-blue-reliquary.ps1`

**Interfaces:**
- Consumes: ordered `S01A`–`S15A` contracts.
- Produces: `## Edit contracts` with boundaries `S01A -> S02A` through `S14A -> S15A` and a cut map.

- [ ] **Step 1: Add a failing boundary-count assertion**

```powershell
$boundaries = [regex]::Matches($text, '(?m)^\| S(?:0[1-9]|1[0-4])A 03\.\ds -> S(?:0[2-9]|1[0-5])A 00\.0s \|')
if ($boundaries.Count -ne 14) { throw "Expected 14 edit contracts, got $($boundaries.Count)" }
```

- [ ] **Step 2: Run the validation to verify it fails**

Run: `powershell -ExecutionPolicy Bypass -File video-pipeline/work/2026-07-18-blue-reliquary/validate-blue-reliquary.ps1`

Expected: FAIL with `Expected 14 edit contracts`.

- [ ] **Step 3: Add the cut map and per-boundary edit contracts**

```markdown
| Boundary | Edit transition | Visual match | Audio bridge | Retiming / post | Retry rule |
|---|---|---|---|---|---|
| S01A 03.7s -> S02A 00.0s | hard cut | blue stone highlight -> blue velvet highlight | low room tone continues | none | rerun S02A if hue moves toward cyan |
```

Add all 14 boundaries. Use hard cuts only where appropriate; use match cuts, focus handoffs, foreground occlusions, and J-cut/L-cut audio only when their visible function is explicit.

- [ ] **Step 4: Add asset-path validation**

```powershell
$paths = [regex]::Matches($text, '(?m)^\d+\. `(D:\\[^`]+\.(?:png|jpe?g|webp))`') | ForEach-Object { $_.Groups[1].Value }
foreach ($path in $paths) { if (-not (Test-Path -LiteralPath $path)) { throw "Missing reference: $path" } }
```

- [ ] **Step 5: Run the full validator**

Run: `powershell -ExecutionPolicy Bypass -File video-pipeline/work/2026-07-18-blue-reliquary/validate-blue-reliquary.ps1`

Expected: PASS with `clips=15; boundaries=14; references=...`.

- [ ] **Step 6: Commit**

```powershell
git add -- video-pipeline/work/2026-07-18-blue-reliquary
git commit -m "docs: add blue reliquary edit contracts"
```

### Task 4: Archive the package in the asset library and Obsidian

**Files:**
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_BLUE_RELIQUARY_001/README.md`
- Create: `video-pipeline/asset-library/obsidian-vault/03-参考拆解/VID_MR_BLUE_RELIQUARY_001｜蓝色秘藏60秒分镜.md`

**Interfaces:**
- Consumes: validated master storyboard and product lock.
- Produces: stable source link, output folders `source`, `preview`, `final`, and one Obsidian card.

- [ ] **Step 1: Add a failing archive assertion to the validator**

```powershell
$libraryReadme = 'D:\mythrealms-shop\video-pipeline\asset-library\10-storyboard-videos\VID_MR_BLUE_RELIQUARY_001\README.md'
$vaultCard = 'D:\mythrealms-shop\video-pipeline\asset-library\obsidian-vault\03-参考拆解\VID_MR_BLUE_RELIQUARY_001｜蓝色秘藏60秒分镜.md'
if (-not (Test-Path -LiteralPath $libraryReadme) -or -not (Test-Path -LiteralPath $vaultCard)) { throw 'Missing archive records' }
```

- [ ] **Step 2: Run validation to verify it fails**

Run: `powershell -ExecutionPolicy Bypass -File video-pipeline/work/2026-07-18-blue-reliquary/validate-blue-reliquary.ps1`

Expected: FAIL with `Missing archive records`.

- [ ] **Step 3: Create archive records**

```markdown
---
asset_id: VID_MR_BLUE_RELIQUARY_001
type: storyboard_video
status: planned
product: pearl-series-04
master_storyboard: D:\mythrealms-shop\video-pipeline\work\2026-07-18-blue-reliquary\blue-reliquary-60s-master-storyboard.md
---
```

The library README lists `source`, `preview`, and `final` folders plus generation status. The Obsidian card links to the library README and master storyboard, and embeds the product lock image.

- [ ] **Step 4: Run the full validator to verify it passes**

Run: `powershell -ExecutionPolicy Bypass -File video-pipeline/work/2026-07-18-blue-reliquary/validate-blue-reliquary.ps1`

Expected: PASS with all 15 clips, 14 boundaries, extant references and archive records.

- [ ] **Step 5: Commit**

```powershell
git add -- video-pipeline/work/2026-07-18-blue-reliquary video-pipeline/asset-library/10-storyboard-videos/VID_MR_BLUE_RELIQUARY_001 video-pipeline/asset-library/obsidian-vault/03-参考拆解
git commit -m "docs: archive blue reliquary storyboard package"
```

## Plan self-review

- Spec coverage: Task 1 locks the 60-second/15-clip constraints; Task 2 covers story, product proof, camera and prompts; Task 3 covers all boundaries and sound continuity; Task 4 covers asset-library and Obsidian handoff.
- Placeholder scan: no unresolved task descriptions; each test has an executable command and expected result.
- Interface consistency: all tasks use `blue-reliquary-60s-master-storyboard.md`, `validate-blue-reliquary.ps1`, `VID_MR_BLUE_RELIQUARY_001`, and the `S01A`–`S15A` identifiers consistently.
