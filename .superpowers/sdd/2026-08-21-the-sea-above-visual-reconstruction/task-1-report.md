# Task 1 — Isolated Reconstruction Contract and Validator

Date: 2026-08-21
Package: `VID_MR_SEA_ABOVE_FILE_001_VISUAL_RECONSTRUCTION`
Status: candidate-only package intentionally red until Tasks 2–4 supply assets and reports

## Implementation

Created the exact candidate contract at:

`video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reconstruction-contract.json`

Created the focused validator at:

`video-pipeline/asset-library/scripts/validate-sea-above-visual-reconstruction.ps1`

The validator resolves the repository root from `$PSScriptRoot`, parses the contract without changing it, resolves only package-relative paths, checks every declared image and report, invokes Node with the repository `sharp` dependency for JSON image metadata, enforces PNG format, declared dimensions, and three-channel RGB/sRGB metadata, and reports one error per failed path. Missing metadata remains an error rather than being coerced to zero. The two deterministic overview canvases are checked at the approved plan dimensions: 3240×1920 for the character overview and 2560×1440 for the world overview.

## Verification

PowerShell parser check:

```text
PowerShell parse: PASS
```

Sharp metadata smoke check against the existing S01 PNG (outside the candidate namespace):

```text
{"format":"png","width":1080,"height":1920,"channels":3,"space":"srgb"}
```

Required initial-red command:

```powershell
pwsh -NoProfile -File video-pipeline/asset-library/scripts/validate-sea-above-visual-reconstruction.ps1
```

Exit code: `1`.

Exact expected-red reason: the candidate namespace has not yet been populated, so all eleven declared images and all four declared reports are absent. The validator listed these missing paths and produced no JSON parse, path-resolution, or `sharp` execution error:

```text
ERROR: reports/character-generation.md — missing file
ERROR: reports/world-generation.md — missing file
ERROR: reports/character-review.md — missing file
ERROR: reports/world-review.md — missing file
ERROR: characters/candidate-a-cold-intelligence.png — missing file
ERROR: characters/candidate-b-dangerous-curiosity.png — missing file
ERROR: characters/candidate-c-luminous-resilience.png — missing file
ERROR: characters/casting-overview.png — missing file
ERROR: world/scene-01-city-beneath-sea.png — missing file
ERROR: world/scene-01-portrait-crop-test.png — missing file
ERROR: world/scene-02-evacuation-square.png — missing file
ERROR: world/scene-03-s01-street-hook.png — missing file
ERROR: world/scene-04-rooftops-under-mother.png — missing file
ERROR: world/scene-05-cliffs-harbour-ocean.png — missing file
ERROR: world/world-overview.png — missing file
EXIT_CODE=1
```

## Self-review

- Contract keys, paths, dimensions, channels, status, and promotion gate match the Task 1 brief verbatim.
- Existing rejected first-frame/style-test files and unrelated cache content were not edited, staged, or reverted.
- The validator does not use `$HOME`, does not mutate the contract, and does not convert null values to numeric defaults.
- The validator only emits `PASS: visual reconstruction package` after every image and report passes; the expected initial state remains exit `1` until later tasks supply the package.
- No production image or report was fabricated for this contract-only task.
