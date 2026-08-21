# FILE 001 — Character Generation Provenance

Date: 2026-08-21
Package: `VID_MR_SEA_ABOVE_FILE_001_VISUAL_RECONSTRUCTION`
Track: Task 2 protagonist casting candidates
Status: candidate-only; no user selection or promotion inferred

## Generation policy and input roles

All original candidate images were generated with the built-in image generation tool, one call per candidate, with no positive input images. The old rejected protagonist, old environments, old first frames, and Hollywood style test were not supplied as image inputs and were not used to derive any face or identity. The only positive image inputs used later were each candidate's own accepted generated board for a single-variable panel-layout repair. User-approved Candidate A is unchanged. User-approved Candidate B is the exact pre-review/committed cream-white outfit board from HEAD `09eef7c9`; its face/look is retained byte-for-byte even though wardrobe standardization is intentionally deferred until after final character selection. The newly generated B replacement is archived and not the current candidate. New Candidate C is the only newly retained third identity.

The original A generation returned a 1536×1024 RGB/sRGB board with four panels arranged horizontally, so A retained its documented one-time identity-preserving layout repair. The user-retained B came from the previously accepted 1536×1024 original followed by its own identity-preserving portrait-layout repair; that repaired source was normalized to the exact historical final bytes. The archived B replacement and retained C generations returned readable 941×1672 near-9:16 boards directly, so neither used a repair prompt or positive reference. Every final source was then centre-cropped with Sharp to the contract's 1080×1920 output without stretching.

## Candidate A — Cold intelligence

### Exact original prompt

```text
Use case: photorealistic-natural
Asset type: live-action prestige science-fiction casting board for an original fictional protagonist
Primary request: create one cohesive casting board of the same unequivocally adult 23-year-old fictional British woman, never a real celebrity, with striking star-level presence, ash-blonde wet hair, blue-green eyes, sculpted cheekbones, direct intelligent gaze, tall fit feminine athletic-hourglass proportions, natural asymmetry and memorable silhouette
Scene/backdrop: neutral real casting-studio wall with rain-damp practical floor; no fantasy environment
Style/medium: authentic live-action production photography, ARRI Alexa 35 and fine 35 mm grain character, natural pores and fine facial texture, no retouching
Composition/framing: four coherent panels: close portrait, clean right profile with visible bare right ear, three-quarter full-body view, and upward-recognition expression; identical face/body/hair/outfit in all panels
Lighting/mood: soft overcast window key, restrained contrast, realistic skin colour, calm authority and contained unease
Materials/textures: damp blonde strands with flyaways, fitted pale silk-knit camisole, structured high-waisted short skirt, practical understated shoes, believable seams and wet fabric weight
Constraints: adult age 23; no jewellery; tasteful bare arms and legs; anatomically correct hands/ears; original identity; all panels same woman
Avoid: celebrity likeness, influencer face, childlike age, oil painting, illustration, wax skin, plastic hair, fashion-campaign retouching, lingerie, nightclub styling, fantasy warrior, text, logo, watermark
```

- Input roles: no positive image inputs.
- Original generated source: `C:\Users\11458\.codex\generated_images\01a02302-371c-7f40-a1ea-1899e829b188\exec-3683bb43-894c-46ac-8f0f-f77ee2251fba.png`
- Original source SHA-256: `86F2AE67830325BE90B2A84AB5DBEF589999C4EF33DB583789B594116678F5A9`
- Original source metadata: PNG, 1536×1024, 3 channels, sRGB.

### Exact single-variable repair prompt

```text
Use case: identity-preserve
Asset type: live-action prestige science-fiction casting board for an original fictional protagonist
Primary request: single-variable repair only: recompose this same accepted Candidate A casting board onto a tall portrait 9:16 canvas, stacking the same four coherent panels vertically in this order: close portrait, clean right profile with visible bare right ear, three-quarter full-body view, upward-recognition expression
Input images: Image 1: accepted Candidate A casting board; use only as the identity and panel-content reference
Subject: keep exactly the same unequivocally adult fictional woman, ash-blonde wet hair, blue-green eyes, sculpted cheekbones, direct intelligent gaze, tall fit feminine athletic-hourglass proportions, same face, body, hair, expressions, wardrobe, shoes, wet-studio setting, lighting, natural asymmetry and skin texture
Style/medium: preserve authentic live-action production photography, ARRI Alexa 35 and fine 35 mm grain character, natural pores and fine facial texture, no retouching
Composition/framing: change only the canvas orientation and panel arrangement; portrait 9:16 board with all four panels fully visible and readable, identical face/body/hair/outfit in all panels
Lighting/mood: preserve soft overcast window key, restrained contrast, realistic skin colour, calm authority and contained unease
Materials/textures: preserve damp blonde strands with flyaways, fitted pale silk-knit camisole, structured high-waisted short skirt, practical understated shoes, believable seams and wet fabric weight
Constraints: adult age 23; no jewellery; tasteful bare arms and legs; anatomically correct hands/ears; original identity; preserve all source identity and photographic texture; no new subjects or props
Avoid: celebrity likeness, influencer face, childlike age, oil painting, illustration, wax skin, plastic hair, fashion-campaign retouching, lingerie, nightclub styling, fantasy warrior, text, logo, watermark, identity drift, changed wardrobe, changed lighting
```

- Repair input role: Image 1 was the accepted Candidate A original source above; no rejected project image was used.
- Repaired generated source: `C:\Users\11458\.codex\generated_images\01a02302-371c-7f40-a1ea-1899e829b188\exec-ad524430-49a7-47e6-9520-c92b9480ecbd.png`
- Repaired source SHA-256: `B12FEDD5DC834EBE15ED43B40D3281618152E655E0F8855682BCBBAD8BA9F4FE`
- Repaired source metadata: PNG, 941×1672, 3 channels, sRGB.

### Final asset

- Final path: `visual-reconstruction/characters/candidate-a-cold-intelligence.png`
- Final SHA-256: `9A5FC6E9590AFC6AA5E75EB6640CF5F792E4CBB4F5F7181ADB3A0E214BA1BE6B`
- Final metadata: PNG, 1080×1920, 3 channels, sRGB/RGB.
- Normalization: Sharp `resize(1080, 1920, { fit: 'cover', position: 'centre', withoutEnlargement: false })`, alpha removed, converted to sRGB, PNG output.
- Inspection result: accepted after full-resolution inspection of original, repaired source, and final board. Four panels show one unequivocally adult woman; direct intelligent portrait, clean right profile with bare ear, readable full-body outfit/proportions, and upward-recognition expression; wet hair, pores, seams, rain-damp floor, hands, and ears read naturally; no jewellery, text, logo, watermark, celebrity likeness, or painterly treatment.
- Rejected-source reason: no rejected source was used. The original horizontal board was layout-repaired once because centre-cropping it directly would fail the four-panel contract, not because its identity or photographic content was rejected.

## Candidate B — Dangerous curiosity (user-retained approved identity)

Candidate B in the final casting package is the exact pre-review/committed Candidate B represented by the user's approved Image #1 screenshot. It is not the later regenerated B attempt. The final target bytes match the historical accepted output exactly (`2CA5B608255BD2BE4DB3701CFFDA4EF4C5BA407F9CB85C7325ED37D84DF966F9`). The cream/white wardrobe variance is intentionally retained at this casting stage to preserve the user-approved face and overall look; wardrobe will be standardized after final character selection without changing this identity.

### Exact original prompt

```text
Use case: photorealistic-natural
Asset type: live-action prestige science-fiction casting board for an original fictional protagonist
Primary request: create one cohesive casting board of the same unequivocally adult 23-year-old fictional British woman, never a real celebrity, with striking star-level presence, pale-gold wet blonde hair, vivid blue eyes, sharper eye shape, defined jaw, magnetic dangerous curiosity, more volatile emotional presence, still refined and intelligent; clearly a different fictional woman from Candidate A
Scene/backdrop: neutral real casting-studio wall with rain-damp practical floor; no fantasy environment
Style/medium: authentic live-action production photography, ARRI Alexa 35 and fine 35 mm grain character, natural pores and fine facial texture, no retouching
Composition/framing: four coherent panels: close portrait, clean right profile with visible bare right ear, three-quarter full-body view, and upward-recognition expression; identical face/body/hair/outfit in all panels
Lighting/mood: soft overcast window key, restrained contrast, realistic skin colour, calm authority and contained unease
Materials/textures: damp blonde strands with flyaways, fitted pale silk-knit camisole, structured high-waisted short skirt, practical understated shoes, believable seams and wet fabric weight
Constraints: adult age 23; no jewellery; tasteful bare arms and legs; anatomically correct hands/ears; original identity; all panels same woman
Avoid: celebrity likeness, influencer face, childlike age, oil painting, illustration, wax skin, plastic hair, fashion-campaign retouching, lingerie, nightclub styling, fantasy warrior, text, logo, watermark
```

- Input roles: no positive image inputs.
- Original generated source: `C:\Users\11458\.codex\generated_images\01a02302-371c-7f40-a1ea-1899e829b188\exec-db7ac663-94b0-4b4e-86ab-399af88d94d7.png`
- Original source SHA-256: `B666DB3A38D0228FFEF3999FDA488D154ECE1916A0A9B06F2D9B64FBFE2707C8`
- Original source metadata: PNG, 1536×1024, 3 channels, sRGB.

### Exact single-variable repair prompt

```text
Use case: identity-preserve
Asset type: live-action prestige science-fiction casting board for an original fictional protagonist
Primary request: single-variable repair only: recompose this same accepted Candidate B casting board onto a tall portrait 9:16 canvas, stacking the same four coherent panels vertically in this order: close portrait, clean right profile with visible bare right ear, three-quarter full-body view, upward-recognition expression
Input images: Image 1: accepted Candidate B casting board; use only as the identity and panel-content reference
Subject: keep exactly the same unequivocally adult fictional woman, pale-gold wet blonde hair, vivid blue eyes, sharper eye shape, defined jaw, magnetic dangerous curiosity, more volatile emotional presence, still refined and intelligent; same face, body, hair, expressions, wardrobe, shoes, wet-studio setting, lighting, natural asymmetry and skin texture
Style/medium: preserve authentic live-action production photography, ARRI Alexa 35 and fine 35 mm grain character, natural pores and fine facial texture, no retouching
Composition/framing: change only the canvas orientation and panel arrangement; portrait 9:16 board with all four panels fully visible and readable, identical face/body/hair/outfit in all panels
Lighting/mood: preserve soft overcast window key, restrained contrast, realistic skin colour, calm authority and contained unease
Materials/textures: preserve damp blonde strands with flyaways, fitted pale silk-knit camisole, structured high-waisted short skirt, practical understated shoes, believable seams and wet fabric weight
Constraints: adult age 23; no jewellery; tasteful bare arms and legs; anatomically correct hands/ears; original identity; preserve all source identity and photographic texture; no new subjects or props
Avoid: celebrity likeness, influencer face, childlike age, oil painting, illustration, wax skin, plastic hair, fashion-campaign retouching, lingerie, nightclub styling, fantasy warrior, text, logo, watermark, identity drift, changed wardrobe, changed lighting
```

- Repair input role: Image 1 was the accepted Candidate B original source above; no rejected project image was used.
- Repaired generated source: `C:\Users\11458\.codex\generated_images\01a02302-371c-7f40-a1ea-1899e829b188\exec-449e7b42-0db5-4298-8369-b4daab795a01.png`
- Repaired source SHA-256: `D49885BEF4E37BD064EBD39C60B368E9DB7A99F8F70E62F32994B2E4F22A78B9`
- Repaired source metadata: PNG, 941×1672, 3 channels, sRGB.

### Final asset

- Final path: `visual-reconstruction/characters/candidate-b-dangerous-curiosity.png`
- Final SHA-256: `2CA5B608255BD2BE4DB3701CFFDA4EF4C5BA407F9CB85C7325ED37D84DF966F9`
- Final metadata: PNG, 1080×1920, 3 channels, sRGB/RGB.
- Normalization: Sharp `resize(1080, 1920, { fit: 'cover', position: 'centre', withoutEnlargement: false })`, alpha removed, converted to sRGB, PNG output; recomputed bytes match the historical accepted final exactly.
- Inspection result: full-resolution inspection confirms the same user-approved adult woman across the close portrait, clean right profile with bare ear, three-quarter full-body view, and upward-recognition expression. Pale-gold wet hair, vivid blue eyes, defined jaw, dangerous curiosity, natural pores, approved cream/white wardrobe, shoes, hands, ears, and wet-studio texture remain coherent. Candidate A and this B are the two user-approved screenshot identities.
- Rejected-source reason: no rejected project image was used. This accepted B identity was restored from its recorded repaired source after the later replacement attempt was superseded by the user's explicit approval of the original face/look.

## Candidate B — Dangerous curiosity (archived non-selected replacement attempt)

This from-scratch replacement was generated after independent review but is not the final Candidate B. It is archived for provenance only because the user explicitly approved the exact original B face/look and asked that it be preserved. The replacement was not used as a positive input for any final candidate or overview.

### Exact new original prompt

```text
Use case: photorealistic-natural
Asset type: live-action prestige science-fiction casting board for an original fictional protagonist
Primary request: create one cohesive casting board of the same unequivocally adult 23-year-old fictional British woman, never a real celebrity, as a genuinely independent new identity not based on any other casting candidate; striking star-level presence; square strong-jaw facial scaffold with a broad angular lower face and pronounced mandibular line, narrower deep-set vivid blue eyes under straight low brows, a longer straight nose with a high bridge, distinct defined lips with a clear cupid's bow, pale-gold wet blonde hair, magnetic dangerous curiosity and volatile intelligence; this woman must visibly read as a different person from any other candidate, not a sharpened variant of an oval or soft face
Scene/backdrop: neutral real casting-studio wall with rain-damp practical floor; no fantasy environment
Style/medium: authentic live-action production photography, ARRI Alexa 35 and fine 35 mm grain character, natural pores and fine facial texture, no retouching
Composition/framing: tall portrait 9:16 casting board with four coherent panels stacked vertically: close portrait, clean right profile with visible bare right ear, three-quarter full-body view, and upward-recognition expression; identical face/body/hair/outfit in all panels
Lighting/mood: soft overcast window key, restrained contrast, realistic skin colour, controlled authority with dangerous curiosity and contained unease
Materials/textures: pale-gold damp blonde strands with flyaways, fitted pale-grey silk-knit camisole, structured charcoal high-waisted short skirt clearly a skirt and not shorts, practical understated black flats, believable seams and wet fabric weight
Constraints: adult age 23; fictional British woman; no jewellery; tasteful bare arms and legs; anatomically correct hands/ears; original identity; all panels same woman; wardrobe and shoes identical in all panels; no borrowed facial identity
Avoid: celebrity likeness, influencer face, childlike age, any resemblance to another casting candidate, oval sculpted face, soft round-to-heart face, identical eyes/brows/nose/lips to another candidate, oil painting, illustration, wax skin, plastic hair, fashion-campaign retouching, lingerie, nightclub styling, fantasy warrior, shorts, white or cream wardrobe, jewellery, text, logo, watermark
```

- Input roles: no positive image inputs; regenerated from scratch.
- New generated source: `C:\Users\11458\.codex\generated_images\01a02302-371c-7f40-a1ea-1899e829b188\exec-001324a3-d907-47c3-a3a1-d09731ad03ac.png`
- New source SHA-256: `64B8597D44AE54FE0BA5F310DCCFCF2E368B709E52D53F4B753CEEF1F892F5C6`
- New source metadata: PNG, 941×1672, 3 channels, sRGB.
- Layout repair: none; source was already a readable near-9:16 four-panel board.

### Archived replacement output (not selected)

- Archived final path: `C:\Users\11458\.codex\generated_images\01a02302-371c-7f40-a1ea-1899e829b188\candidate-b-new-replacement-not-selected-final.png`
- Archived final SHA-256: `CAC6A4A720416868DF5ACF03F540C31CFAC57739894664FE4B587CE311F97AF8`
- Archived final metadata: PNG, 1080×1920, 3 channels, sRGB/RGB.
- Normalization: Sharp `resize(1080, 1920, { fit: 'cover', position: 'centre', withoutEnlargement: false })`, alpha removed, converted to sRGB, PNG output.
- Inspection result: full-resolution source and final inspected. The four panels hold one unequivocally adult woman with square/strong lower face, narrow deep-set vivid blue eyes, longer straight nose, distinct brows/lips, pale-gold wet hair, clean right ear, readable skirt/full body, and dangerous-curiosity upward recognition. Wardrobe matches A/C direction: pale-grey camisole, charcoal skirt, black flats, no jewellery. Overview-scale comparison shows B is visibly distinct from A and C.
- Rejected-source reason for non-selected replacement: the user's explicit approval of the original B face/look takes precedence over wardrobe normalization at casting stage; the replacement is retained only as a recorded rejected attempt, with no positive image input used.

## Candidate C — Luminous resilience (new distinct candidate)

The previous C output is superseded and rejected for selection. Independent review found that it shared A/B's eyes, brows, nose, lips, and face scaffold, and its identity was not sufficiently distinct. Superseded final SHA-256: `28D334182E22D40AD51E770D0902C674C644B639B6C9F31C61A35E92F657675E`.

### Exact new original prompt

```text
Use case: photorealistic-natural
Asset type: live-action prestige science-fiction casting board for an original fictional protagonist
Primary request: create one cohesive casting board of the same unequivocally adult 23-year-old fictional British woman, never a real celebrity, as a genuinely independent new identity not based on any other casting candidate; striking star-level presence; soft round-to-heart facial scaffold with full cheeks, a gentle jaw tapering to a small rounded chin, wider-set blue-green eyes, a short straight nose, subtly freckled natural skin across the bridge and cheeks, softer distinctive facial planes, honey-ash wet blonde hair, emotionally accessible resilience and luminous quiet strength under pressure; this woman must visibly read as a different person from any other candidate, not a softened variant of a square or angular face
Scene/backdrop: neutral real casting-studio wall with rain-damp practical floor; no fantasy environment
Style/medium: authentic live-action production photography, ARRI Alexa 35 and fine 35 mm grain character, natural pores, subtle freckles, and fine facial texture, no retouching
Composition/framing: tall portrait 9:16 casting board with four coherent panels stacked vertically: close portrait, clean right profile with visible bare right ear, three-quarter full-body view, and upward-recognition expression; identical face/body/hair/outfit in all panels
Lighting/mood: soft overcast window key, restrained contrast, realistic skin colour, open emotional accessibility, luminous resilience and contained fear
Materials/textures: honey-ash damp blonde strands with flyaways, fitted pale-grey silk-knit camisole, structured charcoal high-waisted short skirt clearly a skirt and not shorts, practical understated black flats, believable seams and wet fabric weight
Constraints: adult age 23; fictional British woman; no jewellery; tasteful bare arms and legs; anatomically correct hands/ears; original identity; all panels same woman; wardrobe and shoes identical in all panels; no borrowed facial identity
Avoid: celebrity likeness, influencer face, childlike age, any resemblance to another casting candidate, square strong jaw, angular lower face, narrow deep-set eyes, long nose, identical eyes/brows/nose/lips to another candidate, oil painting, illustration, wax skin, plastic hair, fashion-campaign retouching, lingerie, nightclub styling, fantasy warrior, shorts, white or cream wardrobe, jewellery, text, logo, watermark
```

- Input roles: no positive image inputs; regenerated from scratch.
- New generated source: `C:\Users\11458\.codex\generated_images\01a02302-371c-7f40-a1ea-1899e829b188\exec-822b0d69-e3a2-44be-9334-db5a28fd3d97.png`
- New source SHA-256: `464B7D620654BC343BEE5CACFB3CF7054DDCCF9C6B94EB2242777B2144729CB2`
- New source metadata: PNG, 941×1672, 3 channels, sRGB.
- Layout repair: none; source was already a readable near-9:16 four-panel board.

### Final replacement asset

- Final path: `visual-reconstruction/characters/candidate-c-luminous-resilience.png`
- Final SHA-256: `43E1499EC6036A01376740E1D1D175BB53381F0192E04A787211BB20091848EF`
- Final metadata: PNG, 1080×1920, 3 channels, sRGB/RGB.
- Normalization: Sharp `resize(1080, 1920, { fit: 'cover', position: 'centre', withoutEnlargement: false })`, alpha removed, converted to sRGB, PNG output.
- Inspection result: full-resolution source and final inspected. The four panels hold one unequivocally adult woman with soft round-to-heart face, full cheeks, wider-set blue-green eyes, short straight nose, freckles, honey-ash wet hair, clean right ear, readable skirt/full body, and luminous-resilience upward recognition. Wardrobe matches A/B direction: pale-grey camisole, charcoal skirt, black flats, no jewellery. Overview-scale comparison shows C is visibly distinct from A and B.
- Rejected-source reason for superseded C: previous final was rejected after independent review for insufficient facial identity separation from A/B; no prior C image was used as a positive input for this replacement.

## Casting overview provenance

- Final path: `visual-reconstruction/characters/casting-overview.png`
- Final SHA-256: `3D16E580FFD87706578F58C2B0B25DEA639F0E1BC4D101CE24D54741F969FF2D`
- Final metadata: PNG, 3240×1920, 3 channels, sRGB/RGB.
- Deterministic construction: each accepted 1080×1920 board was centre-cropped with Sharp to 1080×1856 (`fit: cover`, `position: centre`), placed at x=0, 1080, and 2160 with y=64 on a black 3240×1920 RGB canvas, then a deterministic white `A`, `B`, `C` SVG label layer was composited only in the 64-pixel black top gutter. Board order is A/B/C. No accepted master file was altered by overview creation.
- Inspection result: full-resolution inspection confirms three side-by-side candidate cells in A/B/C order; the top 64 pixels are black except for the labels, labels do not overlap candidate imagery, and no text appears elsewhere. At overview scale A reads as the unchanged sculpted-oval/cold-intelligence anchor, B as the user-retained approved dangerous-curiosity identity, and C as the distinct round-to-heart/freckled/wider-eye luminous-resilience identity; silhouettes, eyes, noses, jaws, and lips remain visibly different enough to compare.
- Rejected-source reason: overview uses only unchanged A, the exact user-retained old B final, and new C; the archived new B replacement and old rejected C were not used.

## Focused validation expectation

The focused validator was run after the character assets and this generation report were created. Character metadata and hashes were checked independently with Sharp and SHA-256. The validator is expected to exit `1` until the world assets and independent review reports are supplied by the other task; character paths must not appear in its error list.
