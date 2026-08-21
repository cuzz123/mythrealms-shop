# Task 2 — Protagonist Casting Candidates

Date: 2026-08-21
Package: `VID_MR_SEA_ABOVE_FILE_001_VISUAL_RECONSTRUCTION`
Status: complete for the owned character track; candidate-only pending independent review and explicit user selection. Current set is unchanged Candidate A, user-retained pre-review Candidate B, and new distinct Candidate C.

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

Candidate A was preserved unchanged from the approved prior output. The final Candidate B is the exact pre-review/committed Candidate B at HEAD `09eef7c9` represented by the user's approved Image #1 screenshot: its recorded 1536×1024 source and own identity-preserving portrait repair were restored to the historical final bytes, with the cream/white wardrobe intentionally retained until after final character selection. A separate new B was then generated from scratch with no positive image input and archived as a rejected replacement; it was not used in the final package. New Candidate C was generated from scratch with no positive image input as the one retained third identity. No rejected protagonist, environment, first frame, or Hollywood style test was supplied as a positive input.

The restored B source, new C source, and final A/B/C boards were inspected at full resolution with `view_image`. Final boards were normalized with Sharp using an aspect-preserving centre crop to exactly 1080×1920, alpha removal, sRGB conversion, and PNG output; no stretching was used. The overview was rebuilt deterministically from unchanged A, restored old B, and new C in A/B/C order on a 3240×1920 RGB canvas: each board was centre-cropped to 1080×1856 and placed below a 64px black top gutter; labels `A`, `B`, and `C` were rendered only inside that gutter.

Exact original prompts, exact repair prompts, all generated source paths, input roles, final paths, hashes, metadata, inspection evidence, and rejected-source reasons are recorded in [character-generation.md](../../../video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reports/character-generation.md).

## Final asset evidence

| Asset | SHA-256 | Metadata |
| --- | --- | --- |
| `characters/candidate-a-cold-intelligence.png` | `9A5FC6E9590AFC6AA5E75EB6640CF5F792E4CBB4F5F7181ADB3A0E214BA1BE6B` | PNG, 1080×1920, 3 channels, sRGB |
| `characters/candidate-b-dangerous-curiosity.png` | `2CA5B608255BD2BE4DB3701CFFDA4EF4C5BA407F9CB85C7325ED37D84DF966F9` | PNG, 1080×1920, 3 channels, sRGB |
| `characters/candidate-c-luminous-resilience.png` | `43E1499EC6036A01376740E1D1D175BB53381F0192E04A787211BB20091848EF` | PNG, 1080×1920, 3 channels, sRGB |
| `characters/casting-overview.png` | `3D16E580FFD87706578F58C2B0B25DEA639F0E1BC4D101CE24D54741F969FF2D` | PNG, 3240×1920, 3 channels, sRGB |

## Visual inspection and self-review

- Candidate A: full-resolution original, repaired source, and final board inspected. One unequivocally adult woman remains coherent across close portrait, right profile with bare ear, full-body outfit/proportions, and upward-recognition expression. Ash-blonde wet hair, sculpted cheekbones, direct gaze, natural pores, seams, shoes, hands, and rain-damp floor read as live-action photography.
- Candidate B: full-resolution inspection of the restored historical final confirms the user's approved Image #1 identity remains unchanged: pale-gold wet hair, vivid blue eyes, sharper eye shape, defined jaw, and volatile/dangerous curiosity. Profile ear, full-body view, upward recognition, hands, wet fabric, and cream/white wardrobe remain readable. Wardrobe variance is explicitly deferred for later standardization without changing this face.
- Candidate C: full-resolution source and final inspected. Identity is visibly distinct from A and user-retained B: soft round-to-heart face, full cheeks, wider-set blue-green eyes, short straight nose, subtle freckles, honey-ash hair, and luminous resilience. Profile ear, full-body view, upward recognition, hands, wet fabric, and pale-grey/charcoal/black wardrobe remain readable.
- Overview: full-resolution inspection confirms A/B/C order, three equal candidate cells, a 64px black top gutter, labels confined to the gutter, and no extra text or watermark. At overview scale, A's sculpted oval/angular scaffold, B's approved dangerous-curiosity scaffold, and C's round-to-heart/freckled/wider-eye scaffold remain visibly different across silhouettes, eyes, noses, jaws, and lips.
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

- The generated candidates are intentionally not a final selection. The independent character review and explicit user selection gate remain outstanding; no candidate has been promoted.
- User-approved screenshots map to unchanged Candidate A (Image #2) and the exact pre-review/committed Candidate B at HEAD `09eef7c9` (Image #1); the archived regenerated B attempt remains outside the final package for provenance and was not discarded.
- Candidate B's cream/white wardrobe is intentionally retained to preserve the approved face/look; standardize wardrobe only after final character selection and do not alter the identity.
- Candidate B's shoes show a small greenish wet-floor reflection in the full-body panel; this is a natural set reflection and not a blocking anatomy or identity issue, but it can be noted during independent review.
- Validator remains red only for the world and review track omissions listed above; this is expected at the Task 2 handoff point.
