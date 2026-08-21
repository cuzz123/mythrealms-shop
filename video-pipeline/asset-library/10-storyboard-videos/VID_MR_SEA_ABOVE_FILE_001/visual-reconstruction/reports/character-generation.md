# FILE 001 — Character Generation Provenance

Date: 2026-08-21
Package: `VID_MR_SEA_ABOVE_FILE_001_VISUAL_RECONSTRUCTION`
Track: Task 2 protagonist casting candidates
Status: candidate-only; no user selection or promotion inferred

## Generation policy and input roles

All original candidate images were generated with the built-in image generation tool, one call per candidate, with no positive input images. The old rejected protagonist, old environments, old first frames, and Hollywood style test were not supplied as image inputs and were not used to derive any face or identity. The only positive image inputs used later were each candidate's own accepted generated board for a single-variable panel-layout repair.

The original generator returned 1536×1024 RGB/sRGB PNG boards with four panels arranged horizontally. That layout is a concrete contract risk because a 1080×1920 centre crop would lose the front portrait and/or recognition panel. Each candidate therefore received exactly one identity-preserving layout repair: same woman, wardrobe, lighting, photography, and panel content; only the canvas orientation and panel arrangement changed. The repaired 941×1672 near-9:16 source was then centre-cropped with Sharp to the contract's 1080×1920 output without stretching.

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

## Candidate B — Dangerous curiosity

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
- Normalization: Sharp `resize(1080, 1920, { fit: 'cover', position: 'centre', withoutEnlargement: false })`, alpha removed, converted to sRGB, PNG output.
- Inspection result: accepted after full-resolution inspection of original, repaired source, and final board. Four panels show a distinct adult woman from A; pale-gold wet hair, vivid blue eyes, sharper eye shape and defined jaw support the dangerous-curiosity direction; profile ear, full-body outfit/proportions, upward recognition, hands, and wet-studio texture are readable; no jewellery, text, logo, watermark, celebrity likeness, or painterly treatment.
- Rejected-source reason: no rejected source was used. The original horizontal board was layout-repaired once because centre-cropping it directly would fail the four-panel contract, not because its identity or photographic content was rejected.

## Candidate C — Luminous resilience

### Exact original prompt

```text
Use case: photorealistic-natural
Asset type: live-action prestige science-fiction casting board for an original fictional protagonist
Primary request: create one cohesive casting board of the same unequivocally adult 23-year-old fictional British woman, never a real celebrity, with striking star-level presence, honey-ash wet blonde hair, luminous blue-green eyes, softer but distinctive facial planes, emotionally accessible resilience, quiet strength under pressure; clearly a different fictional woman from Candidates A and B
Scene/backdrop: neutral real casting-studio wall with rain-damp practical floor; no fantasy environment
Style/medium: authentic live-action production photography, ARRI Alexa 35 and fine 35 mm grain character, natural pores and fine facial texture, no retouching
Composition/framing: four coherent panels: close portrait, clean right profile with visible bare right ear, three-quarter full-body view, and upward-recognition expression; identical face/body/hair/outfit in all panels
Lighting/mood: soft overcast window key, restrained contrast, realistic skin colour, calm authority and contained unease
Materials/textures: damp blonde strands with flyaways, fitted pale silk-knit camisole, structured high-waisted short skirt, practical understated shoes, believable seams and wet fabric weight
Constraints: adult age 23; no jewellery; tasteful bare arms and legs; anatomically correct hands/ears; original identity; all panels same woman
Avoid: celebrity likeness, influencer face, childlike age, oil painting, illustration, wax skin, plastic hair, fashion-campaign retouching, lingerie, nightclub styling, fantasy warrior, text, logo, watermark
```

- Input roles: no positive image inputs.
- Original generated source: `C:\Users\11458\.codex\generated_images\01a02302-371c-7f40-a1ea-1899e829b188\exec-e7ff5ffe-fc0b-43e4-b020-d2a6781a1469.png`
- Original source SHA-256: `31B19D618BCB7960BB77BF07912C2FC23A0C33F5BD0A6245910A9B292B5AA2B3`
- Original source metadata: PNG, 1536×1024, 3 channels, sRGB.

### Exact single-variable repair prompt

```text
Use case: identity-preserve
Asset type: live-action prestige science-fiction casting board for an original fictional protagonist
Primary request: single-variable repair only: recompose this same accepted Candidate C casting board onto a tall portrait 9:16 canvas, stacking the same four coherent panels vertically in this order: close portrait, clean right profile with visible bare right ear, three-quarter full-body view, upward-recognition expression
Input images: Image 1: accepted Candidate C casting board; use only as the identity and panel-content reference
Subject: keep exactly the same unequivocally adult fictional woman, honey-ash wet blonde hair, luminous blue-green eyes, softer but distinctive facial planes, emotionally accessible resilience, quiet strength under pressure; same face, body, hair, expressions, wardrobe, shoes, wet-studio setting, lighting, natural asymmetry and skin texture
Style/medium: preserve authentic live-action production photography, ARRI Alexa 35 and fine 35 mm grain character, natural pores and fine facial texture, no retouching
Composition/framing: change only the canvas orientation and panel arrangement; portrait 9:16 board with all four panels fully visible and readable, identical face/body/hair/outfit in all panels
Lighting/mood: preserve soft overcast window key, restrained contrast, realistic skin colour, calm authority and contained unease
Materials/textures: preserve damp blonde strands with flyaways, fitted pale silk-knit camisole, structured high-waisted short skirt, practical understated shoes, believable seams and wet fabric weight
Constraints: adult age 23; no jewellery; tasteful bare arms and legs; anatomically correct hands/ears; original identity; preserve all source identity and photographic texture; no new subjects or props
Avoid: celebrity likeness, influencer face, childlike age, oil painting, illustration, wax skin, plastic hair, fashion-campaign retouching, lingerie, nightclub styling, fantasy warrior, text, logo, watermark, identity drift, changed wardrobe, changed lighting
```

- Repair input role: Image 1 was the accepted Candidate C original source above; no rejected project image was used.
- Repaired generated source: `C:\Users\11458\.codex\generated_images\01a02302-371c-7f40-a1ea-1899e829b188\exec-80c698cb-80de-49f4-9a0c-92970c70c3e4.png`
- Repaired source SHA-256: `2B69A0D8F619A21816CB7A15E8FF67F4FA76208A9B4435E131ADC2A06B6D9625`
- Repaired source metadata: PNG, 941×1672, 3 channels, sRGB.

### Final asset

- Final path: `visual-reconstruction/characters/candidate-c-luminous-resilience.png`
- Final SHA-256: `28D334182E22D40AD51E770D0902C674C644B639B6C9F31C61A35E92F657675E`
- Final metadata: PNG, 1080×1920, 3 channels, sRGB/RGB.
- Normalization: Sharp `resize(1080, 1920, { fit: 'cover', position: 'centre', withoutEnlargement: false })`, alpha removed, converted to sRGB, PNG output.
- Inspection result: accepted after full-resolution inspection of original, repaired source, and final board. Four panels show a distinct adult woman from A and B; honey-ash wet hair, luminous blue-green eyes, softer facial planes and accessible upward expression support resilience; profile ear, full-body outfit/proportions, hands, seams, wet floor, and natural skin remain readable; no jewellery, text, logo, watermark, celebrity likeness, or painterly treatment.
- Rejected-source reason: no rejected source was used. The original horizontal board was layout-repaired once because centre-cropping it directly would fail the four-panel contract, not because its identity or photographic content was rejected.

## Casting overview provenance

- Final path: `visual-reconstruction/characters/casting-overview.png`
- Final SHA-256: `9222A3613A86EA89DFAEB08AD739F70A672B17D74975FE21EB47EEAFFC24FF43`
- Final metadata: PNG, 3240×1920, 3 channels, sRGB/RGB.
- Deterministic construction: each accepted 1080×1920 board was centre-cropped with Sharp to 1080×1856 (`fit: cover`, `position: centre`), placed at x=0, 1080, and 2160 with y=64 on a black 3240×1920 RGB canvas, then a deterministic white `A`, `B`, `C` SVG label layer was composited only in the 64-pixel black top gutter. Board order is A/B/C. No accepted master file was altered by overview creation.
- Inspection result: full-resolution inspection confirms three side-by-side candidate cells in A/B/C order; the top 64 pixels are black except for the labels, labels do not overlap candidate imagery, and no text appears elsewhere.
- Rejected-source reason: overview uses only the three accepted final candidate boards; no old rejected visual was used.

## Focused validation expectation

The focused validator was run after the character assets and this generation report were created. Character metadata and hashes were checked independently with Sharp and SHA-256. The validator is expected to exit `1` until the world assets and independent review reports are supplied by the other task; character paths must not appear in its error list.
