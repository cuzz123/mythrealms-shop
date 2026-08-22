# Sea Above first-frame v1 — final validation evidence

Date: 2026-08-22 (Asia/Shanghai)
Evidence run: 2026-08-22, Asia/Shanghai (`+08:00`)
Package: `VID_MR_SEA_ABOVE_FILE_001_FIRST_FRAMES_V1`

## Important interpretation

The structural/package validator passed, but that does **not** mean visual QA passed. All three independent reviewers retain a non-PASS result for S08:

- Character/product reviewer: **NOT PASS** — S08 Critical product and natural-surface failures.
- World/narrative reviewer: **FAIL-CLOSED** — S08 product/texture defects and incomplete pearl-layer readability.
- Final visual reviewer: **NOT PASS / FAIL CLOSED** — S08 cellular/honeycomb relief, invalid product rendering and eye-colour drift.

The user’s acceptance override is recorded verbatim: `先不用精修了，往下完成首帧图` (“do not refine it for now; continue completing the first-frame images”). This permits operational continuation with the known S08 defect; it is not a reviewer PASS, does not waive the visual gate, and does not convert the package into a photographic-quality approval.

## Automated validation commands

### 1. Structural/package validator

Command:

~~~powershell
pwsh -NoProfile -File video-pipeline/asset-library/scripts/validate-sea-above-first-frames.ps1
~~~

Run window: `2026-08-22T21:15:38.0580444+08:00` → `2026-08-22T21:15:39.9932319+08:00`
Exit code: `0`

Exact output:

~~~text
PASS: Sea Above first-frame v1 package
~~~

Interpretation: structural package checks are green, including the corrected unique formal `## S08` generation section and all three reviewer report files. This result does not override the three visual-review FAIL/NOT PASS findings for S08.

### 2. Whitespace check

Command:

~~~powershell
git diff --check
~~~

Run window: `2026-08-22T21:15:59.2997670+08:00` → `2026-08-22T21:15:59.4856822+08:00`
Exit code: `0`

Output consisted only of Git’s working-copy line-ending warnings:

~~~text
warning: in the working copy of '.superpowers/sdd/2026-08-21-the-sea-above-first-frame-rebuild/task-5-report.md', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/reports/generation.md', LF will be replaced by CRLF the next time Git touches it
~~~

No whitespace error was reported.

### 3. SHA-256 evidence for all v1 PNGs

Command executed from the repository root:

~~~powershell
$ErrorActionPreference='Stop'
$root='video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1'
$files=@(Get-ChildItem -File "$root\*.png" | Sort-Object Name) + @(Get-Item "$root\continuity\memory-pair-v1.png")
$files | ForEach-Object { Get-FileHash -Algorithm SHA256 $_.FullName }
~~~

Run window: `2026-08-22T21:16:48.4149883+08:00` → `2026-08-22T21:16:48.7510632+08:00`
Exit code: `0`

The command covered every PNG in the v1 root (`S01`–`S09` and `3x3-overview`) plus `continuity/memory-pair-v1.png`:

| Asset | Bytes | SHA-256 |
| --- | ---: | --- |
| `S01.png` | 15,904,170 | `648A878F37C37174BAE380F866759FFE7ECC9ADE0B95F89B21D0C572F0179B62` |
| `S02.png` | 14,524,426 | `1735B4A689978024A0D218B8D2763069DC96E5BD8C76503AEABCDD3824C81CEF` |
| `S03.png` | 16,276,587 | `A8EDA6644D619203052414020988A3AEAEA2B0078358CA749006FCCE6EE0682B` |
| `S04.png` | 16,953,767 | `0FB67CAE9707E51CF02A79F908EC0729036CCDB086EB665EDC00BC659617486D` |
| `S05.png` | 15,713,354 | `2859CC09F89EC3995B5A1B1BD76742921D847B6C91625BC041CA45402D9B9E4B` |
| `S06.png` | 17,638,806 | `8C1BC21DE27A472BD612FF8F7ADC2CB86A5858B203B84C86B8B0ECFF9E566E60` |
| `S07.png` | 18,280,472 | `12BEEC8F95D538728096D1A83C7B07AF021FFA1BCE1E0273AAF038FE1497E9C4` |
| `S08.png` | 15,376,487 | `9EA57F5E8013E3485420ECDB4B3388AE393DF084FAA862E214C789C55069BE63` |
| `S09.png` | 5,650,317 | `30B5BA18C829C773B70AB702DE4BDE579BFDECEBF9E699E58B46B85339FFDCF7` |
| `3x3-overview.png` | 5,055,363 | `C1873A5816AFB0E233E74969CD9EB376D8B44E66FA3430E683177E50CAB38213` |
| `continuity/memory-pair-v1.png` | 15,192,207 | `A5C5C572FEF6D9E2B44322AA32F0E6A4DF14A53003D95EDC34E6715BFDBF58FF` |

### 4. Sharp master metadata evidence

Command executed from the repository root:

~~~powershell
$js='const sharp=require("sharp"); const root="video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/"; const files=["S01.png","S02.png","S03.png","S04.png","S05.png","S06.png","S07.png","S08.png","S09.png"].map(f=>root+f); Promise.all(files.map(async f=>{const m=await sharp(f).metadata(); return {file:f.slice(root.length),width:m.width,height:m.height,format:m.format,channels:m.channels,space:m.space,depth:m.depth,hasAlpha:m.hasAlpha};})).then(x=>console.log(JSON.stringify(x))).catch(e=>{console.error(e);process.exit(1)});'
node -e $js
~~~

Run window: `2026-08-22T21:17:13.0994492+08:00` → `2026-08-22T21:17:13.2069335+08:00`
Exit code: `0`

All nine masters reported the same contract metadata:

| Frames | Width | Height | Format | Channels | Colour space | Depth | Alpha |
| --- | ---: | ---: | --- | ---: | --- | --- | --- |
| `S01.png`–`S09.png` | 2160 | 3840 | PNG | 3 | `srgb` | `uchar` | false |

## Reviewer evidence summary

| Domain | Report | S08 result | Package interpretation |
| --- | --- | --- | --- |
| Character/product | `v1/reports/character-product-review.md` | **NOT PASS / Critical** | Exact Baroque Orbit product and natural-surface lock fail. |
| World/narrative | `v1/reports/world-narrative-review.md` | **FAIL-CLOSED** | Mother-reversal beat is recognizable, but known product/texture/pearl-layer defects remain. |
| Final visual | `v1/reports/final-visual-review.md` | **NOT PASS / FAIL CLOSED** | Cellular/honeycomb relief, invalid product and eye-colour drift fail photographic gate. |

The three reports agree on the S08 defect; the operational user acceptance override is preserved as a separate decision and is not represented as a visual QA pass.

## Unavailable metrics

External video-performance, retention, CTR, and live deployment metrics: `not_available`. No unavailable metric is represented as `0`.

## Final evidence boundary

This file is evidence only. No PNG, overview, continuity asset, contract, generation record, reviewer report, Git index, or commit was modified while collecting these commands. The remaining known blocker is visual QA of S08, accepted operationally by the user but still failed in all three independent reviewer domains.
