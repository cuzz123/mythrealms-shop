# Task 3 rework report — Protagonist and Memory Anchors

## Status

Reworked all four Task 3 anchors after the user’s binding visual override. The current accepted protagonist is an unequivocally adult woman, exact age 23, with cool pale champagne/ash-blonde wet center-parted hair, vivid blue-green eyes, tall-looking slim athletic-hourglass proportions, and a cool/light coordinated premium British fantasy-editorial outfit. The old age/wardrobe contract is superseded and is not represented in the accepted files. Generation used built-in `image_gen` only; no API or CLI fallback was used.

Audit follow-up: `task-3-brief.md` has been reconciled to this override and now states the exact age-23 / adult 21–24 range, blonde blue-green identity, wet center-part hair, camisole-and-high-waisted-short-skirt wardrobe, premium British cold-elegance direction, product locks, and memory safety constraints. This report records the rework provenance and remains aligned with the current brief.

Every generated output, every targeted repair, and the dependency product lock were inspected with `view_image` before acceptance or rejection.

## Inputs and generated source/output paths

Dependency inspected as the immutable product reference:

- Input: `C:\Users\11458\.codex\worktrees\2822\mythrealms-shop\video-pipeline\asset-library\01-products\PROD_MR_BAROQUE_ORBIT_EARRINGS_001\views\product-lock.png`
- Role: product truth board; only its Baroque Orbit geometry was used for wearing/memory generations. Its wood and flower backgrounds were explicitly excluded from scene design.

| Asset | Built-in generated source | Accepted project output |
| --- | --- | --- |
| Turnaround | `C:\Users\11458\.codex\generated_images\01a01fd4-6667-7881-bcc4-18813ea6c60f\exec-0ff91754-e4ed-4599-884f-3096339c570a.png` | `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/character-turnaround.png` |
| Expression sheet | `C:\Users\11458\.codex\generated_images\01a01fd4-6667-7881-bcc4-18813ea6c60f\exec-7e43a13e-f636-4953-9b60-c16d6f2ff143.png` | `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/expression-sheet.png` |
| Earring profile | `C:\Users\11458\.codex\generated_images\01a01fd4-6667-7881-bcc4-18813ea6c60f\exec-67c44d66-00cb-43a6-8aaa-8142c324bcb0.png` | `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/earring-profile.png` |
| Memory pair repair | `C:\Users\11458\.codex\generated_images\01a01fd4-6667-7881-bcc4-18813ea6c60f\exec-9e463b9a-eed3-443e-8fb1-f9ca90c501b3.png` | `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_MEMORY_PAIR_001/source/memory-pair-lock.png` |

The repair target for the memory pair was inspected but not accepted as a final file:

- `C:\Users\11458\.codex\generated_images\01a01fd4-6667-7881-bcc4-18813ea6c60f\exec-c547e051-5073-449a-8ab9-21d2462101d4.png`

Superseded pre-override generated sources were inspected and rejected before finalization; they remain only in the generated-images area and were never copied into the current accepted filenames:

- `exec-86810f16-b83a-4773-88b7-aa581e730c50.png` — prior age/wardrobe contract.
- `exec-d28bf722-3359-4c08-b5e5-562f702848f4.png` — prior age/wardrobe contract expression sheet.

## Binding identity invariants

- Exact adult age: 23. The face must read as unequivocally adult, while retaining youthful energy; never teenager or childlike.
- Cool pale champagne/ash-blonde shoulder-length hair, visibly wet from rain, strict center part, damp strands at both temples, loose wet ends at the shoulders.
- Vivid blue-green eyes, fair natural skin with visible pores and faint freckles, refined adult oval face, high cheekbones, clear jawline, straight elegant nose, softly full closed lips.
- Tall-looking slim athletic-hourglass feminine proportions: long legs, long neck, naturally toned shoulders and arms, defined waist, relaxed adult posture.
- Cool/light coordinated outfit: fully opaque fitted dove-ice camisole top with broad straps and modest straight neckline; structured high-waisted pale slate-blue short skirt above the knee; bare arms and bare legs. No outer layer, sheer material, lingerie styling, or nudity.
- Restrained acting and makeup; no smile, influencer gloss, provocative posing, plastic skin, malformed anatomy, duplicated fingers, or added jewelry.
- Turnaround and expression sheet: no jewelry. Wearing profile and memory pair: exactly one Baroque Orbit earring on the visible anatomical right ear.
- Product geometry remains immutable: polished closed circular gold hoop; continuous tiny green stones on the hoop front; exactly one gold connector ring; asymmetric organically ridged white baroque pearl drop; one tiny terminal gold bead.
- Memory pair: child around eight, fully clothed, mostly rear/three-quarter, non-identifiable, safely holding one distinct adult hand. Adult and child remain separate identities with no danger, injury, or sensational framing.

## Built-in prompts used for accepted outputs

### `character-turnaround.png`

```text
Use case: photorealistic-natural
Asset type: production character identity turnaround sheet for a fictional adult woman
Primary request: Create one clean four-view identity sheet of the SAME unequivocally adult fictional woman, age 23, shown as four separate full-height premium editorial photographs in an uncluttered 2x2 grid: straight-on front, left profile, right profile, and rear three-quarter. This is a continuity reference, not a fashion campaign.
Scene/backdrop: neutral cool pearl-grey daylight studio backdrop with very soft tonal variation, no props.
Subject: youthful but clearly adult woman age 23, strikingly beautiful in a refined British fantasy-editorial way, tall-looking slim athletic-hourglass feminine proportions, long legs, long neck, naturally toned shoulders and arms, defined waist, relaxed adult posture. Face is youthful yet unmistakably adult: refined oval face, high cheekbones, clear jawline, vivid blue-green eyes, straight elegant nose, softly full closed lips, fair natural skin with visible pores and faint freckles, restrained makeup only. Blonde hair is cool pale champagne-blonde with a little ash depth, shoulder-length, visibly wet from rain, strict center part, damp strands at both temples, loose wet ends around the shoulders.
Wardrobe: cool/light coordinated premium British fantasy/editorial outfit, fully opaque fitted dove-ice camisole top with broad elegant straps and a modest straight neckline, paired with a structured high-waisted pale slate-blue short skirt ending above the knee, clean tailoring and subtle tonal texture; bare arms and bare legs, no outer layer, no tights, no sheer fabric, no lingerie styling, no nudity. Same outfit in every view.
Style/medium: photorealistic natural 85mm editorial realism, premium British cold-elegance, real skin and anatomy, believable body proportions, understated and cinematic without glamour retouching or influencer polish.
Composition/framing: all four views full body from head to feet, relaxed standing with weight naturally balanced, arms resting at sides and hands visible, same scale and eye line in every panel, profiles large enough to read both ears, plain studio floor; no labels or captions.
Lighting/mood: flat cool grey daylight, soft realistic shadows, quiet observant authority, restrained acting.
Color palette: pearl grey, ice blue, pale slate, champagne blonde, natural fair skin, vivid blue-green eyes.
Materials/textures: individual rain-darkened blonde strands, realistic skin pores and freckles, opaque woven camisole fabric, structured skirt fabric, anatomically correct ears, hands, feet, and natural leg texture.
Constraints: one identity only across all four views; exact adult age 23, face, vivid blue-green eyes, blonde shade, hair length, strict center part, wet-hair pattern, tall-looking proportions, outfit cut, and neutral closed-mouth expression; no jewelry, no earrings, no necklace, no piercings, no glasses, no props, no smile, no provocative pose, no cleavage emphasis, no nightclub styling, no text, no watermark.
Avoid: teenager or childlike appearance, brunette or dark hair, outer layer or jacket, generic influencer, lingerie, sheer fabric, transparent fabric, nudity, exaggerated cleavage, pin-up pose, plastic skin, airbrushed skin, cosmetic surgery look, malformed ears, extra fingers, hidden hands, dramatic beauty lighting, warm glamour grading, fantasy armor, extra characters.
Output intent: neutral reference board for later image-to-video continuity.
```

### `expression-sheet.png`

```text
Use case: photorealistic-natural
Asset type: production character expression continuity sheet
Input images: Image 1: new identity reference; preserve this exact unequivocally adult 23-year-old woman, blonde wet hair, vivid blue-green eyes, body presence, and cool coordinated outfit.
Primary request: Create one clean four-panel expression sheet of the SAME clearly adult woman from Image 1, four head-and-shoulders premium editorial photographs in a 2x2 grid with no labels or text. Panel 1: neutral observation, vivid blue-green eyes quietly studying something off-camera, closed mouth. Panel 2: delayed recognition, realization arriving a beat late, eyes slightly widened but face controlled, closed mouth. Panel 3: contained fear, subtle tension around eyes and jaw, controlled breathing, no panic, closed mouth. Panel 4: upward resolve, gaze lifted slightly above camera, calm determined blue-green eyes and set jaw, no smile.
Scene/backdrop: the same neutral cool pearl-grey daylight studio backdrop as Image 1, no props.
Subject: preserve exact adult protagonist identity: unequivocal age 23, youthful striking beauty with refined British fantasy-editorial presence, fair natural skin with visible pores and faint freckles, vivid blue-green eyes, straight elegant nose, softly full closed lips, cool pale champagne/ash-blonde shoulder-length rain-wet hair with strict center part and damp temple strands, cool/light coordinated outfit of a fully opaque fitted dove-ice camisole top with broad straps and modest straight neckline plus structured high-waisted pale slate-blue short skirt above the knee, bare arms and legs.
Style/medium: photorealistic natural 85mm editorial realism, premium British cold-elegance, real skin/anatomy and restrained makeup, no influencer gloss.
Composition/framing: identical camera height and head size in all four panels, head-and-shoulders crop with shoulders and camisole straps visible, ears visible where angle permits, relaxed adult posture; expressions readable but understated.
Lighting/mood: neutral cool grey daylight, soft shadows, quiet authority, psychologically precise.
Constraints: change expression only; keep age 23, identity, facial proportions, vivid blue-green eye color, blonde shade, hair length, strict center part, wet-hair clumps, ear anatomy, outfit cut, bare arms/legs, lighting, and color continuity unchanged; no jewelry or piercings, no glasses, no smile, no glamour posing, no nightclub styling, no lingerie, no sheer fabric, no nudity, no tears, no bruises, no danger, no text, no watermark.
Avoid: identity drift, four different women, teenager or childlike face, brunette or dark hair, outer layer or jacket, generic influencer beauty, plastic skin, airbrushed retouching, exaggerated horror, open mouth, teeth, theatrical crying, duplicated faces, malformed ears, extra features.
Output intent: continuity reference for a photorealistic narrative video.
```

### `earring-profile.png`

```text
Use case: photorealistic-natural
Asset type: production wearing-profile and product continuity reference
Input images: Image 1: new adult protagonist identity reference; preserve this exact 23-year-old blonde woman, face, wet center-parted hair, body presence, and cool/light coordinated outfit. Image 2: immutable product truth reference board; use only the exact Baroque Orbit earring geometry, never its wood or flower backgrounds.
Primary request: Create one single close editorial right-side profile portrait of the unequivocally adult woman from Image 1, age 23, facing camera-left so her anatomical right ear is the near visible ear. She wears exactly ONE Baroque Orbit earring on that right ear; the far ear is not visible and there is no other jewelry. Make the earring large enough and sharply focused to be visibly readable while remaining physically plausible in scale.
Scene/backdrop: neutral cool pearl-grey daylight studio background, no props.
Subject: same strikingly beautiful but believable 23-year-old adult woman, vivid blue-green eye, fair natural skin with visible pores and faint freckles, refined youthful-adult oval face with high cheekbones and clear jawline, straight elegant nose, softly full closed lips, cool pale champagne/ash-blonde shoulder-length rain-wet hair with strict center part and damp temple strands, hair tucked just enough behind the near ear. Show the cool/light outfit's opaque dove-ice camisole shoulder strap and upper chest only; no outer layer or jacket.
Style/medium: photorealistic natural 85mm editorial realism, premium British cold-elegance fantasy-editorial casting, real pores and realistic ear cartilage/pierced lobe, restrained makeup, no influencer gloss.
Composition/framing: head-and-shoulders crop, clean true profile with near anatomical right ear unobstructed, earring hanging fully in frame against grey background; eye, ear, product, hair texture, and shoulder strap all sharply readable; no labels or text.
Lighting/mood: soft neutral cool grey daylight with a gentle controlled highlight on the product, quiet restrained acting, no glamour lighting.
Materials/textures: polished gold closed circular hoop; tiny vivid green stones in a continuous row along the hoop front; exactly one small gold connector ring between hoop and pearl; one asymmetric organically ridged white baroque pearl drop with nacre iridescence; one tiny terminal gold bead at the pearl tip. Match Image 2's geometry, silhouette, hardware count, color, and proportions exactly.
Constraints: change only viewpoint and add one exact earring to the anatomical right ear; preserve age 23, face identity, vivid blue-green eye color, blonde shade, strict center-part wet-hair pattern, ear anatomy, natural skin, closed-mouth expression, outfit strap, and realistic proportions. Product geometry is locked to Image 2: closed round polished gold hoop, front green-stone row, one connector ring, irregular baroque pearl, one terminal bead. No left earring, no second earring, no necklace, no rings, no bracelet, no glasses, no outer layer or jacket, no text, no watermark.
Avoid: teenager or childlike face, product redesign, smooth round pearl, missing green stones, extra connectors or chains, doubled earrings, floating jewelry, earring fused into hair or ear, malformed ear, distorted face, plastic skin, influencer glamour, smile, provocative pose, nightclub styling, lingerie, sheer fabric, nudity, generated letters, flower/wood props from the reference board.
Output intent: high-fidelity wearing profile for downstream shot generation.
```

### `memory-pair-lock.png`

```text
Use case: photorealistic-natural
Asset type: childhood-memory pair continuity lock for a narrative video
Input images: Image 1: new adult protagonist identity reference; Image 2: new adult wearing-profile with exact earring; Image 3: immutable product truth board for earring geometry only, ignore its wood/flower backgrounds.
Primary request: Create one quiet, non-exploitative childhood memory photograph on a wet old-city street. A fully clothed child around 8 years old is the foreground subject, shown mostly from rear three-quarter view, holding one distinct adult woman's hand. The adult is the same unequivocally adult age-23 blonde protagonist from Images 1–2, shown beside the child in a restrained right-side three-quarter profile with her face partly turned away; her anatomical right ear visibly wears exactly one Baroque Orbit earring from Images 2–3. The scene reads as safe walking together, never a crisis.
Scene/backdrop: one narrow British coastal old-city street with wet limestone and brick paving, modest unbranded shopfront glass, cool grey rain-muted daylight, shallow depth of field; no landmark, no readable signage, no traffic.
Subject 1 (child): fully clothed child around 8 years old in a simple muted ice-blue waterproof hooded shell, dark trousers, and rain boots; seen mostly from behind and three-quarter back, face not identifiable, relaxed posture, one small hand naturally holding the adult's hand; no danger or exposed body.
Subject 2 (adult): same strikingly beautiful but believable adult woman, exactly age 23, tall-looking slim athletic-hourglass proportions, long wet cool champagne-blonde hair with strict center part, vivid blue-green eye glimpsed in profile, fair natural skin with pores and faint freckles, refined youthful-adult face, restrained closed-mouth expression. She wears the same cool/light coordinated premium British fantasy-editorial outfit as Image 1: fully opaque fitted dove-ice camisole top with broad straps and modest neckline, structured high-waisted pale slate-blue short skirt above the knee, bare arms and bare legs; no outer layer, no tights, no sheer fabric, no lingerie, no nudity. Show her right-side profile enough to read the near right ear and exact earring.
Product lock: one and only one earring on the adult's near anatomical right ear, matching Image 3 exactly: closed polished gold circular hoop, continuous tiny vivid green stones along the hoop front, exactly one gold connector ring, one asymmetric organically ridged white baroque pearl drop, one tiny terminal gold bead. Physically plausible attachment and scale.
Style/medium: photorealistic natural 85mm editorial realism, premium British cold-elegance fantasy-editorial restraint, real skin and fabric texture, no influencer gloss.
Composition/framing: vertical 9:16 frame, child foreground lower-left/center, adult beside and slightly behind on the right, joined hands clear in the middle of the frame, adult ear and earring readable but not oversized; adult and child remain fully separate figures; no labels or text.
Lighting/mood: soft overcast daylight after rain, gentle reflections on pavement, tender but restrained memory quality, no melodrama.
Constraints: child remains fully clothed, mostly rear/three-quarter, non-identifiable and safe; adult and child faces must remain clearly distinct with no blending; preserve adult age 23, blonde identity, blue-green eyes, wet center-part hair, outfit, natural anatomy, and product geometry; exactly one earring on adult right ear, no other jewelry; only safe hand-holding, no danger, no injury, no fear, no crying, no sensational framing, no text, no watermark.
Avoid: child facing camera in close-up, child/adult face merge, adult or child glamour pose, smiling, plastic skin, duplicated fingers, malformed hands, malformed ear, extra earrings, extra jewelry, product redesign, smooth round pearl, missing green stones, extra connector rings, visible brands, readable signs, weapons, traffic, falling, drowning, storm peril, outer layer on adult, dark hair, older adult, teenager or childlike adult, nightclub styling, lingerie, sheer fabric, nudity.
Output intent: safe continuity reference for the childhood-memory beat.
```

### Memory-pair single-attribute repair

```text
Use case: identity-preserve
Asset type: repair of the accepted memory-pair continuity frame
Input images: Image 1: edit target; preserve this exact frame.
Primary request: Change only the adult woman's footwear: add understated pale cool-grey closed low-profile flats appropriate to a wet old-city street. Keep her legs bare. Preserve every other pixel-level visual invariant as closely as possible.
Constraints: keep the unequivocally adult age-23 blonde woman, wet center-parted hair, vivid blue-green eye glimpse, cool/light opaque camisole and high-waisted short skirt, exact right-ear Baroque Orbit earring with green stones, single connector, irregular pearl and terminal bead, adult/child identities, rear/three-quarter child framing, joined hands, street, lighting, perspective, and composition unchanged. No extra jewelry, no face changes, no hand changes, no child changes, no new props, no text, no watermark.
Avoid: barefoot adult, footwear redesign beyond simple pale flats, identity drift, child/adult face blending, duplicated fingers, malformed hands or ear, product redesign, extra earring, danger, sensational framing.
```

## Visual QA per accepted image

| Image | Result |
| --- | --- |
| `character-turnaround.png` | PASS. Four full-body panels show the same adult age-23 blonde woman in front, left profile, right profile, and rear three-quarter views. The cool/light camisole and short skirt, bare arms/legs, high-waisted tailoring, wet center part, natural hands/feet, and neutral acting are consistent. No jewelry, outer layer, smile, dark-hair drift, plastic skin, or malformed anatomy. |
| `expression-sheet.png` | PASS. Four close panels preserve the same adult face, vivid blue-green eyes, blonde wet-hair pattern, camisole straps, skin texture, and neutral grey daylight. Observation, delayed recognition, contained fear, and upward resolve are distinct yet restrained; no jewelry, open mouth, age drift, or glamour posing. |
| `earring-profile.png` | PASS. Clean camera-left profile exposes the anatomical right ear. Exactly one earring is attached and sharply readable: closed gold hoop, green-stone row, one connector ring, irregular baroque pearl, terminal gold bead. Adult age, blonde identity, wet-hair pattern, ear anatomy, natural skin, and camisole strap remain continuous; no extra jewelry or redesign. |
| `memory-pair-lock.png` | PASS. Fully clothed child remains rear/three-quarter and non-identifiable; adult and child are clearly distinct; joined hands are safe and natural; adult age-23 blonde identity, cool/light outfit, pale flats, and one right-ear earring are present on the same wet old-city street. No danger, injury, face blending, duplicated fingers, extra jewelry, readable signage, or sensational framing. |

## Rejection and repair ledger

| Source | Decision | Reason / action |
| --- | --- | --- |
| `exec-86810f16-b83a-4773-88b7-aa581e730c50.png` | REJECTED | Superseded age/wardrobe contract; never copied into current accepted filename. |
| `exec-d28bf722-3359-4c08-b5e5-562f702848f4.png` | REJECTED | Superseded age/wardrobe contract expression sheet; never copied into current accepted filename. |
| `exec-c547e051-5073-449a-8ab9-21d2462101d4.png` | REJECTED | Memory composition and identity passed, but adult footwear was implausibly bare for the wet street; used only as the edit target. |
| `exec-9e463b9a-eed3-443e-8fb1-f9ca90c501b3.png` | ACCEPTED | Single-attribute footwear repair passed; only pale flats were added and all identity/product/safety invariants remained intact. |

No rejected variant was copied into an accepted filename. The prior Task 3 asset commit remains historical; this rework replaces its four project files in the focused follow-up commit.

## Verification

The following checks were run after copying the accepted rework sources into the workspace:

```powershell
@(
  'video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/README.md',
  'video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/character-turnaround.png',
  'video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/expression-sheet.png',
  'video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/earring-profile.png',
  'video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_MEMORY_PAIR_001/README.md',
  'video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_MEMORY_PAIR_001/source/memory-pair-lock.png'
) | ForEach-Object { if (-not (Test-Path -LiteralPath $_)) { throw "Missing $_" } }
node -e "const sharp=require('sharp'); const files=['video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/character-turnaround.png','video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/expression-sheet.png','video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/earring-profile.png','video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_MEMORY_PAIR_001/source/memory-pair-lock.png']; Promise.all(files.map(f=>sharp(f).metadata().then(m=>console.log(f, m.width+'x'+m.height, m.format))))"
Get-FileHash video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/*.png,video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_MEMORY_PAIR_001/source/*.png -Algorithm SHA256
git diff --check
```

The required presence check, PNG metadata/hash checks, and `git diff --check` completed without errors before commit. Each final output was opened with `view_image` after generation and after the targeted repair where applicable.

## Files

- `.superpowers/sdd/2026-08-20-the-sea-above-file-001-production/task-3-brief.md`
- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/README.md`
- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/character-turnaround.png`
- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/expression-sheet.png`
- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/earring-profile.png`
- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_MEMORY_PAIR_001/README.md`
- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_MEMORY_PAIR_001/source/memory-pair-lock.png`

## Commit

- Asset rework: `87eb656e6b99c4e06d6235b83fd00943c3b81b5b` — `assets: rework Sea Above protagonist anchors`
- Documentation audit fix: `docs: reconcile Sea Above Task 3 audit contract` (this focused docs commit; no image files changed).

## Self-review

The rework is limited to the two owned character directories plus the reconciled task brief and this required report. All four accepted project files now use the age-23 blonde protagonist contract. No prior outer-layer/older-age wording remains in the owned READMEs, accepted-asset prompts, or current task brief. No unrelated files, product source pixels, manifest, validator, environment, or FX assets were changed.

## Concerns

- The memory pair is a wider narrative frame, so the product’s green stones are less legible than in the dedicated wearing profile; the earring remains visibly present and the exact geometry is anchored by the profile plus immutable product-lock input.
- The generated PNGs are reference boards/frames only; they do not provide a rig, alpha cutout, or animation data.
