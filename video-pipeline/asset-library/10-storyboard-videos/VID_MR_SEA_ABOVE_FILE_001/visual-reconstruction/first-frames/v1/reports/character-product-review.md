# Sea Above first-frame v1 — character/product review

Date: 2026-08-22 (Asia/Shanghai)
Reviewer: independent Luna Max character/product pass
Scope: the nine v1 masters (`S01.png`–`S09.png`) and `continuity/memory-pair-v1.png`, inspected from the full-resolution PNG masters. The 3×3 overview was used only as an order cross-check; it did not replace master inspection.
Method: before visual inspection, I read the Task 6 brief (`.superpowers/sdd/2026-08-21-the-sea-above-first-frame-rebuild/task-6-brief.md`), the first-frame contract (`video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/first-frame-contract.json`), reconstruction contract (`video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reconstruction-contract.json`), production contract (`video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/production-contract.json`), v1 generation/provenance record (`video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/reports/generation.md`), and progress ledger (`.superpowers/sdd/2026-08-21-the-sea-above-first-frame-rebuild/progress.md`).

## Verdict

**NOT PASS — the character/product review gate remains failed by one Critical frame, S08.**

The user has explicitly accepted the known S08 defects and chosen to stop repair and continue the first-frame package. That is an operational disposition, not a reviewer PASS. S08 remains a recorded failed frame; no PNG, contract, generation record, or Git index was changed during this review.

`.superpowers/sdd/2026-08-21-the-sea-above-first-frame-rebuild/final-validation.md` records the structural validator at exit code 0; that structural PASS does not change this domain's NOT PASS visual QA gate.

## Master inventory inspected

All nine masters are PNG, 2160×3840, RGB/3-channel, sRGB, no alpha. The inspected SHA-256 values were:

| Frame | SHA-256 | Visible character/product occurrence | Result |
| --- | --- | --- | --- |
| S01 | `648A878F37C37174BAE380F866759FFE7ECC9ADE0B95F89B21D0C572F0179B62` | Candidate B full body; foreground civilian holds a separate removed pendant | PASS for visible Candidate B; product-lock N/A |
| S02 | `1735B4A689978024A0D218B8D2763069DC96E5BD8C76503AEABCDD3824C81CEF` | Candidate B close-up; one worn Baroque Orbit on near ear | PASS |
| S03 | `A8EDA6644D619203052414020988A3AEAEA2B0078358CA749006FCCE6EE0682B` | Small partial Candidate B at left; no readable product occurrence | PASS for visible identity cues; product N/A |
| S04 | `0FB67CAE9707E51CF02A79F908EC0729036CCDB086EB665EDC00BC659617486D` | No person or product | N/A; no character/product leakage |
| S05 | `2859CC09F89EC3995B5A1B1BD76742921D847B6C91625BC041CA45402D9B9E4B` | No person or product; eye-only world beat | N/A |
| S06 | `8C1BC21DE27A472BD612FF8F7ADC2CB86A5858B203B84C86B8B0ECFF9E566E60` | New child/adult memory identities; adult right-ear product | PASS |
| S07 | `12BEEC8F95D538728096D1A83C7B07AF021FFA1BCE1E0273AAF038FE1497E9C4` | Same child/adult identities through rising-water erasure; adult right-ear product | PASS |
| S08 | `9EA57F5E8013E3485420ECDB4B3388AE393DF084FAA862E214C789C55069BE63` | Candidate B close portrait; main earring and background pendants | **FAIL — Critical** |
| S09 | `30B5BA18C829C773B70AB702DE4BDE579BFDECEBF9E699E58B46B85339FFDCF7` | No person or product | N/A |

Continuity anchor inspected: `memory-pair-v1.png`, SHA-256 `A5C5C572FEF6D9E2B44322AA32F0E6A4DF14A53003D95EDC34E6715BFDBF58FF`, PNG 2160×3840 RGB/sRGB/no alpha.

## Frame findings

### S01 — PASS for visible character occurrence

Candidate B reads as the same unequivocally adult woman: pale-gold wet blonde hair, blue eyes, natural adult proportions and skin, fixed cream camisole/structured short skirt, and white flats. Her face, hands, ears and body are anatomically coherent in the full-body frame. She has no jewellery, as required. The foreground civilian’s hand-held pendant is a separate narrative removal cue, not a product-lock occurrence; no duplicate product is visible on Candidate B.

### S02 — PASS

The right-profile close-up preserves the adult Candidate B face, wet pale-gold hair, blue eye, ear anatomy and cream wardrobe edge. One worn earring is attached to the near ear and visibly contains the required construction: curved/open gold hoop/arc with green stones, connector ring, irregular baroque pearl and terminal gold bead. No second earring, extra pearl, mirrored construction or malformed ear is visible.

### S03 — PASS for visible cues; product N/A

The small left-edge figure is consistent with Candidate B through pale-gold wet hair, cream wardrobe and adult silhouette. The shot does not expose a product-sized ear occurrence, so product geometry is not scored here. No contradictory identity or extra jewellery is visible.

### S04 — N/A

This is a city-scale frame with no human or product occurrence. No character or jewellery leakage is visible.

### S05 — N/A

This is the eye-only Mother scale beat. No product occurrence is present. The visible iris reads as a blue/green natural eye under the water texture; there is no jewellery to score.

### S06 — PASS

The new memory identities are distinct and stable: the child is clearly approximately eight years old with child-sized proportions, and the companion is clearly a mature adult. Their faces, hair, clothing and hand relationship are coherent; the joined hands do not show extra or fused fingers. The adult’s right-ear earring is naturally attached and reads as the gold/green-stone hoop, connector, irregular pearl and terminal bead at the intended medium walking scale. It is not staged as a product poster and no extra jewellery is visible.

### S07 — PASS

The child remains the same clearly minor identity and stays sharp. The adult remains the same mature companion with the same bun, cardigan, navy sweater, body proportions, hand relationship and right-ear earring. The water veil obscures the lower adult body through refraction rather than changing the face, ear, hand or jewellery into a morph. The earring remains attached and no duplicate or loose jewellery is visible.

### S08 — FAIL CLOSED (Critical)

This frame is broadly recognizable as an adult Candidate B portrait in the fixed cream outfit and wet pale-gold hair, but it fails the mandatory character/product lock in multiple visible ways:

1. **Critical product failure:** the main near-ear item is a thin gold connector/chain with a white pearl-like drop. The required open curved/oval gold hoop with a visible inner opening, distinct green stones, connector ring, irregular baroque pearl and terminal gold bead is not present or verifiable. It is a generic/simplified drop rather than the immutable Baroque Orbit construction.
2. **Critical natural-surface failure:** repeated cellular/honeycomb/caustic relief is visibly tiled across the face, forehead, exposed arm/shoulder, wet hair-adjacent surfaces and cream camisole/skirt. This violates the natural skin/plain fabric requirement and makes the frame read as an unclean generated texture.
3. **Important eye/identity failure:** the visible eye reads brown/olive rather than the specified vivid blue Candidate B eye. The adult age and broad facial identity remain recognizable, but the eye-colour drift compounds the identity lock failure.
4. **Important product-response failure:** background pendants are visible, but the main product structure is already invalid and the near/middle/far product response cannot be accepted as a clean exact-product occurrence.

Operational decision: the user has accepted these known S08 defects and instructed the team to stop repair. This is recorded as **user-accepted known defect / no further repair**, not as a reviewer PASS and not as a validator-green character/product gate.

### S09 — N/A

The atmospheric loop plate contains no face, body, hand, ear, person or jewellery. The single droplet is not a product occurrence.

## Severity summary

- Critical: S08 exact Baroque Orbit product absent/invalid; S08 repeated cellular/honeycomb surface relief on skin and clothing.
- Important: S08 visible eye-colour drift away from vivid blue; S08 product-response layers cannot be accepted as exact-product evidence while the main product is invalid.
- Minor: no additional character/product defect was found in S01–S07 or S09. S06/S07 product instances are medium-scale and less inspectable than S02, but they remain structurally consistent and naturally attached.

## Review disposition

No repair was attempted. No PNG, overview, continuity asset, contract, generation record, reviewer file other than this report, Git index, or commit was changed. Parent review must carry the S08 non-PASS forward even though the user has accepted the known defect operationally.
