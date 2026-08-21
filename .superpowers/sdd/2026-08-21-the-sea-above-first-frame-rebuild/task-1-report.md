# Task 1 report — Sea Above first-frame v1 contract and validator

Date: 2026-08-21
Base commit: `385e2126692c72269aa7773f249ff9b851799ae7`
Scope: Task 1 owned files only.

## Delivered files

- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/first-frame-contract.json`
- `video-pipeline/asset-library/scripts/validate-sea-above-first-frames.ps1`
- `.superpowers/sdd/2026-08-21-the-sea-above-first-frame-rebuild/task-1-report.md`

## Contract evidence

The contract declares `VID_MR_SEA_ABOVE_FILE_001_FIRST_FRAMES_V1`, schema version `1`, status `candidate_awaiting_user_approval`, nine ordered shots (`S01`–`S09`), one continuity asset, one overview, and the four required reports. It locks the 2160×3840 PNG/RGB/sRGB master specification and Candidate B/product truth hashes from the approved design.

The six approved world declarations were filled from `Get-FileHash -Algorithm SHA256`:

| Input | SHA-256 |
| --- | --- |
| `world/scene-01-city-beneath-sea.png` | `ED50178C514FD0A970D2586DAA40A1C3662F6EAF3EAD1539447D396E138B003F` |
| `world/scene-01-portrait-crop-test.png` | `D3F17599C0D188A57CF2420DAC93976E3943123F3109ACEA4D653D2908843204` |
| `world/scene-02-evacuation-square.png` | `18EB077D2A339E37D21E3828695A75BFACF92DC64FE938B834A05A202E0F280D` |
| `world/scene-03-s01-street-hook.png` | `B72AAFB5E8360E8CCD850E953DFD927778C8862354B446029FA59DC585E563DD` |
| `world/scene-04-rooftops-under-mother.png` | `9E06CBFBFA3C067436BD2E62C601A22CD1612504139DEEEE9739330BCE023490` |
| `world/scene-05-cliffs-harbour-ocean.png` | `12AB7C54014E2217F103657879DF23BB12411ABCC897AB90414F7B4224B446D3` |

## Validator behavior

`validate-sea-above-first-frames.ps1` resolves the repository root from `$PSScriptRoot`, parses the contract, verifies every declared input path and SHA-256, checks all shot and continuity media through Node plus repository `sharp`, and checks the overview as PNG/RGB/sRGB media. It reports missing files, hash drift, metadata mismatches, missing reports, missing `generation.md` shot sections, missing SHA-256 fields, missing reference-role fields, and forbidden positive-input prefixes. Errors are aggregated to one actionable line per path; unavailable values are reported as missing/unavailable rather than coerced to zero.

For a green package, each `generation.md` shot section must use a heading such as `## S01`, include a non-empty `Reference roles:` or equivalent reference-role field, include a 64-hex `SHA-256:` field, and keep forbidden historical inputs out of its positive-reference block.

## Expected-red verification

Command:

```powershell
pwsh -NoProfile -File video-pipeline/asset-library/scripts/validate-sea-above-first-frames.ps1
```

Result: exit `1` as required. The validator listed the absent v1 masters (`v1/S01.png` through `v1/S09.png`), continuity anchor (`v1/continuity/memory-pair-v1.png`), overview (`v1/3x3-overview.png`), and all four v1 reports. It produced no JSON parse, repository-root, hash, or Sharp crash; the approved input hashes were accepted.

Focused whitespace check:

```powershell
git diff --check -- video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/first-frame-contract.json video-pipeline/asset-library/scripts/validate-sea-above-first-frames.ps1
```

Result: exit `0`, no whitespace errors.

## Scope protection

The pre-existing dirty legacy first-frame/style-test files, staged legacy report, and `scripts/__pycache__/` were not edited, staged, or included in this Task 1 change.

## Commit

The three owned paths are staged with pathspecs only. The commit SHA is returned in the task handoff after the pathspec-limited commit; it is not duplicated here because embedding a commit ID in the committed report would make the evidence self-referential.
