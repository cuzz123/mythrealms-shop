# Task 2 — Protagonist Casting Candidates

Date: 2026-08-21
Package: `VID_MR_SEA_ABOVE_FILE_001_VISUAL_RECONSTRUCTION`
Status: complete for the owned character track; candidate-only pending independent review and explicit user selection

## Scope and ownership

Implemented only the Task 2 character track. Owned files are:

- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/candidate-a-cold-intelligence.png`
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/candidate-b-dangerous-curiosity.png`
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/candidate-c-luminous-resilience.png`
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/casting-overview.png`
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reports/character-generation.md`
- `.superpowers/sdd/2026-08-21-the-sea-above-visual-reconstruction/task-2-report.md`

No world, accepted-character, first-frame, director-card, video, contract, validator, or review path was modified. Existing rejected/staged first-frame/style-test changes and unrelated untracked cache content were preserved. No `git add`, `git commit`, reset, revert, or shared-index mutation was performed.

## Generation and repair implementation

Three original casting boards were generated with the built-in image generation tool, one call per candidate, using the exact Task 2 prompts and no positive reference images. All three original sources were photorealistic 1536×1024 RGB/sRGB four-panel boards, but the model arranged the panels horizontally. A direct 1080×1920 centre crop would have discarded required portrait panels, so each candidate received one concrete single-variable repair using only its own accepted original board as Image 1. The repair changed only the canvas orientation/panel arrangement to four stacked panels on a near-9:16 source; identity, age direction, wardrobe, lighting, wet hair, photography, and panel content were explicitly locked.

Each repaired source was inspected at full resolution with `view_image`, then normalized with Sharp using an aspect-preserving centre crop to exactly 1080×1920, alpha removal, sRGB conversion, and PNG output. The overview was constructed deterministically from the three final boards in A/B/C order on a 3240×1920 RGB canvas: each board was centre-cropped to 1080×1856 and placed below a 64px black top gutter; labels `A`, `B`, and `C` were rendered only inside that gutter.

Exact original prompts, exact repair prompts, all generated source paths, input roles, final paths, hashes, metadata, inspection evidence, and rejected-source reasons are recorded in [character-generation.md](../../../video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reports/character-generation.md).

## Final asset evidence

| Asset | SHA-256 | Metadata |
| --- | --- | --- |
| `characters/candidate-a-cold-intelligence.png` | `9A5FC6E9590AFC6AA5E75EB6640CF5F792E4CBB4F5F7181ADB3A0E214BA1BE6B` | PNG, 1080×1920, 3 channels, sRGB |
| `characters/candidate-b-dangerous-curiosity.png` | `2CA5B608255BD2BE4DB3701CFFDA4EF4C5BA407F9CB85C7325ED37D84DF966F9` | PNG, 1080×1920, 3 channels, sRGB |
| `characters/candidate-c-luminous-resilience.png` | `28D334182E22D40AD51E770D0902C674C644B639B6C9F31C61A35E92F657675E` | PNG, 1080×1920, 3 channels, sRGB |
| `characters/casting-overview.png` | `9222A3613A86EA89DFAEB08AD739F70A672B17D74975FE21EB47EEAFFC24FF43` | PNG, 3240×1920, 3 channels, sRGB |

## Visual inspection and self-review

- Candidate A: full-resolution original, repaired source, and final board inspected. One unequivocally adult woman remains coherent across close portrait, right profile with bare ear, full-body outfit/proportions, and upward-recognition expression. Ash-blonde wet hair, sculpted cheekbones, direct gaze, natural pores, seams, shoes, hands, and rain-damp floor read as live-action photography.
- Candidate B: full-resolution original, repaired source, and final board inspected. Identity is distinct from A, with pale-gold wet hair, vivid blue eyes, sharper eye shape, defined jaw, and more volatile/dangerous curiosity. Profile ear, full-body view, upward recognition, hands, wet fabric, and floor reflections remain readable.
- Candidate C: full-resolution original, repaired source, and final board inspected. Identity is distinct from A and B, with honey-ash wet hair, luminous blue-green eyes, softer facial planes, and accessible resilience. Profile ear, full-body view, upward recognition, hands, wet fabric, and floor texture remain readable.
- Overview: full-resolution inspection confirms A/B/C order, three equal candidate cells, a 64px black top gutter, labels confined to the gutter, and no extra text or watermark.
- Anti-AI gate: no oil-paint texture, illustration treatment, fantasy environment/warrior styling, jewellery, logo, watermark, celebrity likeness, childlike age, or obvious repeated subject appears in the accepted final boards.

## Verification

### Focused validator

Command:

```powershell
pwsh -NoProfile -File video-pipeline/asset-library/scripts/validate-sea-above-visual-reconstruction.ps1
```

Exit code: `1`, as expected while Task 3 world assets and Task 4 independent review reports remain absent. The only reported omissions were:

```text
ERROR: reports/world-generation.md — missing file
ERROR: reports/character-review.md — missing file
ERROR: reports/world-review.md — missing file
ERROR: world/scene-01-city-beneath-sea.png — missing file
ERROR: world/scene-01-portrait-crop-test.png — missing file
ERROR: world/scene-02-evacuation-square.png — missing file
ERROR: world/scene-03-s01-street-hook.png — missing file
ERROR: world/scene-04-rooftops-under-mother.png — missing file
ERROR: world/scene-05-cliffs-harbour-ocean.png — missing file
ERROR: world/world-overview.png — missing file
```

The three character boards, casting overview, and `reports/character-generation.md` did not appear in the validator error list. Sharp metadata output independently confirmed all four final images as PNG, declared dimensions, 3 channels, and sRGB. SHA-256 recomputation matched the values above. `git diff --check` exited `0`.

## Remaining risks / parent review

- The generated candidates are intentionally not a selection. The independent character review and explicit user selection gate remain outstanding; no candidate has been promoted.
- Each layout repair is identity-preserving by prompt and visual inspection, but the parent/reviewer should make the final continuity call before any first-frame work.
- Candidate B's white shoes show a small greenish wet-floor reflection in the full-body panel; this is a natural set reflection and not a blocking anatomy or identity issue, but it can be noted during independent review.
- Validator remains red only for the world and review track omissions listed above; this is expected at the Task 2 handoff point.
