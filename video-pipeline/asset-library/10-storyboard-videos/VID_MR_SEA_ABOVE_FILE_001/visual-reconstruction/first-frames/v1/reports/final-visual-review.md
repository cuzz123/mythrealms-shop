# Sea Above first-frame v1 — final visual / anti-AI review

Date: 2026-08-22 (Asia/Shanghai)
Reviewer: independent final visual reviewer (Luna Max visual pass)
Scope: `v1/S01.png`–`v1/S09.png`, `v1/continuity/memory-pair-v1.png`, and `v1/3x3-overview.png`.

## Review basis and method

I read the approved first-frame rebuild specification, `first-frame-contract.json`, and the complete `v1/reports/generation.md` before review. I inspected every v1 master individually from the PNG at full-resolution (`view_image`, `detail=original`), then inspected the continuity board and the 3×3 overview. The overview was used only for order, continuity-at-a-glance, and assembly checks; it was not used as a substitute for the master inspections.

The photographic gate rejects oil paint/concept-art treatment, glossy CGI, wax or plastic skin/hair, cloned people or buildings, impossible anatomy, stretched pixels, poster symmetry, unmotivated excessive cyan, generated text/logos/prices, and watermarks. The review also checks that warm memory treatment, VFX water, and the Mother eye remain physically integrated rather than becoming decorative or synthetic.

## Verdict and user disposition

**Reviewer verdict: NOT PASS / FAIL CLOSED.** S08 contains Critical visual failures: repeated cellular/honeycomb/caustic embossed relief across the face, exposed skin, hair-adjacent areas, and cream clothing, plus a product rendering that no longer presents a verifiable Baroque Orbit structure. These are visible on the full master and are not a thumbnail-only concern. The eye also drifts toward brown/olive rather than the specified blue with a subtle response.

**User acceptance override: operational continuation only.** The user’s latest decision was “先不用精修了，往下完成首帧图” (“do not refine for now; continue completing the first-frame images”), with the S08 cellular/honeycomb defect to be recorded truthfully. That instruction accepts the known defect for workflow continuation; it does **not** change this reviewer verdict to PASS, does not make the package validator-green, and does not authorize a claim that S08 is photographic-quality compliant. No repair was attempted and no PNG was changed.

## Master inventory and per-frame conclusion

All nine masters were verified as PNG, 2160×3840, RGB/3-channel, sRGB, no alpha. Hashes below are the inspected files.

| Frame | SHA-256 | Final visual verdict | Full-resolution conclusion |
| --- | --- | --- | --- |
| S01 | `648A878F37C37174BAE380F866759FFE7ECC9ADE0B95F89B21D0C572F0179B62` | PASS with Minor watch | Grounded wet-street live action, natural Candidate B anatomy/skin/hair/cream wardrobe, varied fleeing crowd, warm practicals, and a readable overhead sea. Ground-origin water is clear; several narrow paths are unusually straight and can momentarily read as suction columns. No obvious cloned people/buildings, stretched pixels, watermark, or legible generated text. |
| S02 | `1735B4A689978024A0D218B8D2763069DC96E5BD8C76503AEABCDD3824C81CEF` | PASS | Natural wet skin and hair clumps, adult face/ear anatomy, restrained storm light, and shallow street depth read as a photographic close-up. No wax/plastic surface, poster posing, duplicated anatomy, generated text, logo, or watermark. Exact product geometry is scored by the separate character/product review. |
| S03 | `A8EDA6644D619203052414020988A3AEAEA2B0078358CA749006FCCE6EE0682B` | PASS with Important composition watch | Live-action city scale and sea depth are coherent, with an unmistakable ground-to-sky water path. The centered roadway/filament creates a near-symmetrical, poster-like axis and the filament is more columnar than ideal; the off-axis protagonist, irregular city edges, and wet-location texture keep it from becoming a full graphic-poster failure. No stretched pixels, cloned structures, text, logo, or watermark observed. |
| S04 | `0FB67CAE9707E51CF02A79F908EC0729036CCDB086EB665EDC00BC659617486D` | PASS with Minor VFX watch | Ultra-wide wet rooftop/city/harbour geography is photographic and scale legible. The Mother remains a diffuse shadow in the overhead sea, with no creature anatomy. Repeated roof/window geometry is normal city texture rather than an obvious clone; some reverse-rain paths are very vertical. No generated text, logo, watermark, or impossible anatomy. |
| S05 | `2859CC09F89EC3995B5A1B1BD76742921D847B6C91625BC041CA45402D9B9E4B` | PASS with Minor VFX watch | One immense partially occluded biological eye is integrated under the same ocean and city scale as S04; no body, mouth, limb, tentacle, or gore is exposed. The iris/pupil edge is unusually clean and may read as synthetic at a glance, but the water membrane, atmospheric occlusion, city light, and restrained palette preserve a photographic VFX plate. No text/logo/watermark. |
| S06 | `8C1BC21DE27A472BD612FF8F7ADC2CB86A5858B203B84C86B8B0ECFF9E566E60` | PASS | Warm memory light remains photographic: the same child and clearly older adult relative walk on the recognisable wet street, hold hands with plausible anatomy, and preserve a naturally imperfect face/hair/clothing treatment. No painterly dissolve, cloned faces, wax skin, generated text, logo, or watermark. |
| S07 | `12BEEC8F95D538728096D1A83C7B07AF021FFA1BCE1E0273AAF038FE1497E9C4` | PASS with Minor VFX watch | The child remains sharp while the same adult relative is optically lost into rising water. The transition is translucent/refraction-based rather than gore, melting skin, horror deformation, or digital glitch. The broad water-body silhouette has a noticeable composited-VFX sheen, but does not introduce an anatomy or text failure. |
| S08 | `9EA57F5E8013E3485420ECDB4B3388AE393DF084FAA862E214C789C55069BE63` | **FAIL CLOSED — Critical** | Repeated cellular/honeycomb/caustic relief is visibly tiled across the forehead, cheeks, exposed shoulder/arm, hair-adjacent skin, and cream camisole/skirt; it is not natural pores, rain, or fabric weave. The main ear item is a simplified pearl drop/chain without a verifiable curved/open green-stone hoop, connector, irregular pearl, and terminal bead. The iris drifts brown/olive. Background pearl responses do not rescue the invalid main product. No text/logo/watermark issue was found, but the surface and product failures are sufficient to fail this domain. |
| S09 | `30B5BA18C829C773B70AB702DE4BDE579BFDECEBF9E699E58B46B85339FFDCF7` | PASS with Minor direction watch | Clean dark atmospheric plate with one droplet and a restrained upward trail. No person/product/creature, generated typography, title, logo, price, subtitle, or watermark. Direction relies on the faint trail and is less immediate than S01, but the plate remains photographic and loop-compatible. |

Severity summary: **Critical S08**; **Important residual composition watch S03**; Minor VFX/flow watches S01, S04, S05, S07, and S09. No other Critical photographic-realism failure was observed.

## Continuity and overview checks

### `continuity/memory-pair-v1.png`

SHA-256: `A5C5C572FEF6D9E2B44322AA32F0E6A4DF14A53003D95EDC34E6715BFDBF58FF`.

The full-resolution board keeps the same child and adult-relative identities across the portrait, adult-ear profile, and hand-holding street panels. The adult remains visibly mature, the child remains a child, and the hand/face relationship is coherent. Warm street reflections and shallow depth are photographic. The board is a continuity reference, not a deliverable shot; the small earring views are not used to overturn the separate product review.

### S03–S05 world continuity

S03, S04, and S05 share the same British coastal-city/harbour geography, overhead-sea height, cool sea-motivated light, and restrained Mother language. S04 establishes the city-block scale through diffuse shadow only; S05 escalates to one occluded eye without revealing a body. S03’s centered street axis is a composition watch, not a geography break.

### S06–S07 pair continuity

S06 and S07 preserve the child, adult relative, street direction, wardrobe, and hand relationship. S07 changes only the adult’s visibility through rising-water optical loss; it does not introduce a new face or a horror-body transformation.

### `3x3-overview.png`

SHA-256: `C1873A5816AFB0E233E74969CD9EB376D8B44E66FA3430E683177E50CAB38213`; metadata: PNG, 1128×2052, RGB/3-channel, sRGB, no alpha. The deterministic order is correct: `S01 S02 S03 / S04 S05 S06 / S07 S08 S09`. Labels are intentional white text in opaque black gutters and are not generated image text; no label overlaps a master cell. The overview makes the cold present-day / warm memory / dark loop progression readable. S08’s cellular surface defect is also visible in the overview, but the verdict above is based on its master.

## Evidence commands

The following commands were run from the repository root during this review. They are evidence only; no repair, staging, or commit was performed.

1. `pwsh -NoProfile -File video-pipeline/asset-library/scripts/validate-sea-above-first-frames.ps1`

   An initial diagnostic before this owned report existed returned exit code **1** for missing review files and a duplicate/malformed S08 generation section. After the concurrently owned world review was present and the generation report was synchronized by its owner, the final command run returned exit code **0**:

   ```text
   PASS: Sea Above first-frame v1 package
   EXIT_CODE=0
   ```

   This is a structural/package-validator PASS only. It does **not** override the independent visual reviewer’s Critical S08 FAIL or convert the user acceptance override into photographic-quality approval.

2. `git diff --check`

   Exit code: **0**. Git emitted only its normal LF→CRLF working-copy warnings for pre-existing modified Markdown files; no whitespace error was reported.

3. `Get-FileHash -Algorithm SHA256 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/*.png'`

   Exit code: **0**. The explicit master hashes are the inventory values above. The command covered S01–S09 and `3x3-overview.png`; continuity was separately hashed above.

## Blockers and handoff

- **Reviewer blocker:** S08 remains a Critical final-visual failure. The cellular/honeycomb relief and invalid product must remain in the record; they were not repaired or disguised.
- **Operational disposition:** user acceptance override permits the package to proceed to the next first-frame/approval step, but it is not a reviewer PASS and does not satisfy the spec’s photographic gate.
- **Historical package diagnostic:** before the concurrently owned world review and generation synchronization landed, the validator reported missing review files and a duplicate/malformed S08 section. The final observed structural validator run is PASS; those external files were not changed by this review.
- No PNG, `generation.md`, contract, overview, continuity asset, other reviewer file, Git index, or commit was changed by this review.
