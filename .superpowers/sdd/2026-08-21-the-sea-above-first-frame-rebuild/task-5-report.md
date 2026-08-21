# Task 5 report — FILE 001 first-frame rebuild

Status: DONE. S08 Repair 3 and S09 were accepted by parent pixel review; both masters were normalized, and the deterministic labelled 3×3 overview was assembled. No staging or commit was performed.

Date: 2026-08-22 (Asia/Shanghai)

## Owned outputs

| Output | Final metadata | SHA-256 |
| --- | --- | --- |
| `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S08.png` | PNG, 2160×3840, RGB, 3 channels, sRGB, no alpha | `9EA57F5E8013E3485420ECDB4B3388AE393DF084FAA862E214C789C55069BE63` |
| `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S09.png` | PNG, 2160×3840, RGB, 3 channels, sRGB, no alpha | `30B5BA18C829C773B70AB702DE4BDE579BFDECEBF9E699E58B46B85339FFDCF7` |
| `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/3x3-overview.png` | PNG, 1128×2052, RGB, 3 channels, sRGB, no alpha | `C1873A5816AFB0E233E74969CD9EB376D8B44E66FA3430E683177E50CAB38213` |

## S08 provenance and review

- Ordered positive roles were accepted S02 (`1735B4A689978024A0D218B8D2763069DC96E5BD8C76503AEABCDD3824C81CEF`), Candidate B identity/wardrobe (`2CA5B608255BD2BE4DB3701CFFDA4EF4C5BA407F9CB85C7325ED37D84DF966F9`), product-lock (`0B8671FAFCD9481DD53FC10EFB8ACC4671B901ABA647BF7C273069A01793517B`), S04 (`0FB67CAE9707E51CF02A79F908EC0729036CCDB086EB665EDC00BC659617486D`), and S05 (`2859CC09F89EC3995B5A1B1BD76742921D847B6C91625BC041CA45402D9B9E4B`). Product `source/main.jpg` (`DD12F12A092965A08AB9096DC3E4E79925779B641B29142B4194FF1C8BDF950F`) and `source/detail-05.jpg` (`73855F92B3426DE9428042561DF8AD5BD5A4EB98496BD31F2934ECEA6C67E2E5`) were inspected but not supplied because the built-in image tool accepts at most five local references.
- Base source `exec-f211458e-01d2-4648-9ad8-28d99bb6cde3.png`, SHA `4AEBAE9980D45CDDC702FF545F64CAFEFEE0AA8A583C6FEB94EFBB0CF73ACE5F`: REJECTED because layered near/middle/far pearl response was not readable.
- Repair 1 source `exec-2faee401-54b8-481e-a5e3-5339eb8e97d5.png`, SHA `A9E75AD630181DCDC3CEE43BD2A88CA295880BEA63FD2517458FAEDA28F434D6`: REJECTED because pendants hung normally or were merely touched; no anti-gravity action read at thumbnail scale.
- Repair 2 source `exec-98482495-0273-45cd-ab5d-685a50deac5c.png`, SHA `7A6F6A993709226B9CC53D881DBB6EBDD0A0BA3E5957D4B49518605FD5E1B2EF`: REJECTED because the middle necklace lifted but Candidate B's and the right-front pearls remained near-normal gravity at thumbnail scale.
- Accepted Repair 3 source `exec-bacfb7ab-d2c9-4b52-99c7-9f6cbaa1ffd4.png`, SHA `0CEFFA51C93DE60A38FD134373FB3CEA37F0C8117B2AA98D307ACA4F00F40D79`: Candidate B, middle-distance, and right-front pearls read as attached, same-direction up/right anti-gravity responses without beams, glow, particles, or hands. Source and final were inspected full-resolution and at 270×480.
- Exact prompts, ordered roles, source/final paths, metadata, rejection history, and inspection notes are appended under `## S08` in `v1/reports/generation.md`.

## S09 provenance and review

- No positive local references were used. The source was `exec-5e6f921f-bea4-41bf-abbd-79a5f07e1d86.png`, PNG 941×1672 RGB/sRGB/no alpha, SHA `0762BC60B3F510E221784DF16DEF3C5293BE5D02BDEE589EC87390F1A1E4FA18`.
- The accepted plate contains exactly one real rising droplet and one restrained trail in a dark blue-black photographic atmosphere; it has no person, face, jewellery, creature, text, title, logo, watermark, or particle field. Final and source were inspected full-resolution and at 270×480.
- The exact S09 prompt and source/final provenance are appended under `## S09` in `v1/reports/generation.md`.

## Deterministic overview

- Source order is exactly `S01 S02 S03 / S04 S05 S06 / S07 S08 S09`, using accepted masters only.
- Each cell is a 360×640 centre-cropped Sharp resize; each has an opaque black 28 px label gutter, with 24 px black row/column gutters. Labels are confined to gutters; no master pixels are covered. Canvas is 1128×2052 RGB/sRGB PNG.
- The exact repository-root Sharp assembly command, all nine source-master hashes, output metadata, and full/270×480 inspection notes are appended under `## Overview — deterministic 3×3 review sheet` in `v1/reports/generation.md`.

## Verification and boundaries

- Normalization used repository Sharp 0.34.5 with centre `fit: cover`, Lanczos3, `toColourspace('srgb')`, `removeAlpha()`, and PNG output.
- `pwsh -NoProfile -File video-pipeline/asset-library/scripts/validate-sea-above-first-frames.ps1` returned exit code `1` with exactly the three expected missing independent reports: `character-product-review.md`, `world-narrative-review.md`, and `final-visual-review.md`. No S08/S09/overview or contract error remained.
- Final scoped whitespace check: `git diff --check -- video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S08.png video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S09.png video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/3x3-overview.png video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/reports/generation.md .superpowers/sdd/2026-08-21-the-sea-above-first-frame-rebuild/task-5-report.md` — exit code `0`, no whitespace errors; Git emitted only its normal LF→CRLF working-copy warning for `generation.md`.
- No accepted S01–S07 master, contract, manifest, unrelated dirty/staged/untracked file, or Git index was changed. Temporary inspection thumbnails remain outside the v1 package and are not deliverables.
