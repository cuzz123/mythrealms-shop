# Task 4 Report — Sky-Sea Environment and FX Anchors

Date: 2026-08-21

Status: ACCEPTED — six final PNG anchors copied to the workspace and visually inspected.

## Scope and execution

Owned paths:

- video-pipeline/asset-library/03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001/
- video-pipeline/asset-library/08-fx/FX_MR_REVERSE_RAIN_001/
- video-pipeline/asset-library/08-fx/FX_MR_SKY_SEA_MOTHER_001/

Execution used the built-in image_gen tool only, one call per new asset plus one targeted call for each rejected/repair pass. No CLI or API image generation, network video tool, paid Seedance, or video generation was used. Every accepted PNG was inspected with view_image after it was copied into the workspace.

The current production contract and asset-pack manifest remain unchanged; Task 5 owns their later extension with generated-asset hashes.

## Accepted outputs and hashes

| Asset | Generated source path | Workspace output path | SHA-256 | Visual decision |
| --- | --- | --- | --- | --- |
| world-anchor.png | C:\Users\11458\.codex\generated_images\01a0201d-8fe9-71e2-a2a4-aa242513e609\exec-f4fe0615-5268-42f3-96a5-4fd642770ae2.png | video-pipeline/asset-library/03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001/source/world-anchor.png | 466654B43A560F8A8EBAD4D5E2CC266B9AB604C95246915D032EBB8B1085F2DA | ACCEPT |
| reverse-rain-street.png | C:\Users\11458\.codex\generated_images\01a0201d-8fe9-71e2-a2a4-aa242513e609\exec-cd5d1561-7bb3-4750-93aa-1bac279e83e3.png | video-pipeline/asset-library/03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001/source/reverse-rain-street.png | F909A71B464CE46CB47552DEA3F19104EBE3EEA8909CB9F075DB5E7902BF8D12 | ACCEPT |
| sky-sea-upward.png | C:\Users\11458\.codex\generated_images\01a0201d-8fe9-71e2-a2a4-aa242513e609\exec-aed886f4-e5d4-48d1-bab0-013bd6dc70c7.png (repair output) | video-pipeline/asset-library/03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001/source/sky-sea-upward.png | 2C491CB4DECC0E476E3B3E3D294295618F20C5B4884147C8C6CC60EE39D7CEEF | ACCEPT after single-variable stream-shape repair |
| direction-lock.png | C:\Users\11458\.codex\generated_images\01a0201d-8fe9-71e2-a2a4-aa242513e609\exec-aed49367-3424-4887-adb8-8a7395fc0fff.png | video-pipeline/asset-library/08-fx/FX_MR_REVERSE_RAIN_001/source/direction-lock.png | 21C53058A42446AA9AED2BCFA9DBE0BB3813F2323C09E98D15A342BCA4A54634 | ACCEPT |
| mother-shadow-lock.png | C:\Users\11458\.codex\generated_images\01a0201d-8fe9-71e2-a2a4-aa242513e609\exec-0f0a6f49-6ee1-4932-b78c-f77880f0e851.png | video-pipeline/asset-library/08-fx/FX_MR_SKY_SEA_MOTHER_001/source/mother-shadow-lock.png | F73D87A010296CF5BB284F93546944EAA1D36C4CFB947F7D8DB2A483A71C6825 | ACCEPT |
| mother-eye-lock.png | C:\Users\11458\.codex\generated_images\01a0201d-8fe9-71e2-a2a4-aa242513e609\exec-256cc5a9-a6d4-4122-9efb-27498d8d6778.png (repair output) | video-pipeline/asset-library/08-fx/FX_MR_SKY_SEA_MOTHER_001/source/mother-eye-lock.png | 069AD46BA6EBCF1B40A33F4886913262B9B277E09D947802C60040BC246FCF56 | ACCEPT after single-variable crop/visibility repair |

All six final files are 941x1672 RGB PNGs (near 9:16, no alpha). They are reference plates, not video takes.

## Prompt provenance

The following are the exact prompt bodies submitted to built-in image_gen. Input image paths are listed separately in each prompt section. Generated output paths above identify the corresponding source artifact.

### 1. world-anchor.png — accepted generation

Use case: photorealistic-natural
Asset type: reusable production environment geography anchor for a vertical dark-fantasy short film
Primary request: A coherent photorealistic British coastal old-city street in cold rain, viewed from a low street-level 32mm wide-angle camera. Wet pale limestone paving and weathered red-brown brick facades form a narrow perspective corridor. Modest unbranded shopfront glass reflects the rain; no readable signage. Above the street, far overhead, a vast suspended ocean hangs across the sky with its underside facing the city, clearly an ocean seen from below rather than a normal sky or ground-level sea. Natural diffuse daylight filters through the water, creating storm-cyan and deep sea-blue translucency while the street remains believable.
Scene/backdrop: one continuous narrow British coastal old-city lane, wet limestone and brick, restrained shopfront glass, no landmarks.
Subject: environment only; no people, no protagonist, no creature or eye.
Style/medium: live-action photorealistic location photography, natural physical materials, realistic rain and reflections, restrained dark-epic unease.
Composition/framing: vertical 9:16 production reference, low 32mm perspective down the street; street occupies lower two-thirds and the suspended ocean underside is legible in the upper third; no tilt-shift, no collage.
Lighting/mood: cold overcast daylight filtered through overhead seawater, one consistent soft light direction, quiet ominous realism.
Color palette: wet limestone grey-white, weathered brick brown, storm cyan, deep ocean blue, low-saturation cold green, natural neutral reflections.
Materials/textures: real wet stone, brick mortar, rain beads on glass, shallow puddles, translucent seawater underside with subtle natural caustics; no fantasy ornament.
Constraints: establish a reusable geography anchor; keep the street, ocean height, underside orientation, palette, and light direction physically coherent; no generated text or logo.
Avoid: downward-only rain, ordinary open sky, ground-level ocean, multiple suns, fantasy castle, landmark, recognizable IP creature, monster anatomy, full face, eye, hand, teeth, tentacle, beams, particle clouds, neon, warm orange-teal grade, text, watermark.
Output intent: clean high-fidelity environment plate for later matching; no protagonist yet.

Input images: none.

Note: an earlier identical built-in attempt returned no artifact to the caller and was not copied or treated as a deliverable; the accepted source above is the successful artifact.

### 2. reverse-rain-street.png — accepted generation

Input images: Image 1 was the accepted workspace file video-pipeline/asset-library/03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001/source/world-anchor.png; it was used as the exact geography reference.

Use case: photorealistic-natural
Asset type: reusable reverse-rain street continuity anchor for a vertical dark-fantasy short film
Primary request: Re-render the same street as a low 30mm street-level view with the reverse-rain rule unmistakable: shallow puddles on the wet limestone foreground form splash crowns that pull upward, individual droplets visibly leave the ground and travel toward the sky, and several thin rising water trails continue upward. The ocean remains far overhead with its underside facing the city. The rain direction is physically consistent everywhere: water is rising from pavement and puddles, never falling downward.
Scene/backdrop: same single lane and buildings from Image 1, modest unbranded shopfront glass, no landmark or readable sign.
Subject: environment and reverse-rain effect only; no protagonist, no people, no Mother eye or creature.
Style/medium: live-action photorealistic location photography, physically believable wet materials and water motion frozen in a sharp reference frame.
Composition/framing: vertical 9:16, low 28–35mm camera close to pavement, street corridor readable into distance, rising splash crown and droplets large enough to read at phone-thumbnail size; overhead sky-sea still visible.
Lighting/mood: same cold overcast daylight filtered through seawater as Image 1, one consistent light direction, quiet alarm.
Color palette: wet limestone grey-white, weathered brick brown, storm cyan, deep ocean blue, low-saturation cold green, natural reflections.
Materials/textures: sharp wet stone, puddle ripples, coherent upward splash crowns and beads, rain-wet glass, natural seawater underside.
Constraints: change only the water direction and camera emphasis; preserve the same geography, sea height, underside-facing ocean, palette, and light direction as Image 1. No generated text or logo.
Avoid: any downward rain, normal rainfall, ground-level ocean, contradictory street, multiple suns, fantasy castle, landmark, recognizable IP, protagonist, eye, full creature, teeth, tentacles, beams, particle soup, neon, orange-teal grade, text, watermark.
Output intent: unambiguous reverse-rain continuity reference that can feed the opening shot.

### 3. sky-sea-upward.png — initial generation (rejected)

Input images: Image 1 was the accepted world-anchor workspace file; Image 2 was the accepted reverse-rain-street workspace file.

Use case: photorealistic-natural
Asset type: reusable upward sky-sea reveal geography anchor for a vertical dark-fantasy short film
Primary request: A coherent upward-looking continuation of the same lane, following one clear central water column rising from the street toward the suspended ocean. The camera is near the pavement and tilts upward along the column; the wet limestone and brick walls frame the lower and side edges, then the view opens into the far overhead underside of the ocean. The column visibly travels upward from street level into the water underside, with several droplets aligned along it. The ocean is high above the city, never ground-level.
Scene/backdrop: same narrow British coastal old-city street as Images 1–2, modest unbranded shopfront glass, no landmark or readable signage.
Subject: environment and one rising water column only; no protagonist, no people, no Mother eye or creature.
Style/medium: live-action photorealistic location photography, sharp physical water, realistic seawater caustics and wet architecture.
Composition/framing: vertical 9:16 upward perspective, one dominant centered water column leads the eye from lower edge to upper ocean underside; building roofs and facades remain recognizable side anchors; one principal camera-axis view, no collage.
Lighting/mood: same cold daylight filtered through overhead seawater, one soft consistent direction, awe edged with alarm.
Color palette: wet limestone grey-white, weathered brick brown, storm cyan, deep ocean blue, low-saturation cold green, neutral reflections.
Materials/textures: realistic rain-wet brick and stone, glass beads, coherent droplet refraction, translucent ocean underside with natural underwater texture, no particles.
Constraints: preserve geography continuity from Images 1–2; make the ocean clearly suspended overhead and the water column clearly moving upward from street to sky-sea; no generated text or logo.
Avoid: downward rain, ordinary sky, ground-level ocean, contradictory street, multiple suns, fantasy castle, recognizable IP, full monster, eye, face, hand, teeth, tentacles, beams, particle soup, neon, text, watermark.
Output intent: clean upward-view plate for the world-reveal shot.

Generated source: C:\Users\11458\.codex\generated_images\01a0201d-8fe9-71e2-a2a4-aa242513e609\exec-0ca5a5d6-d11f-40db-bc53-57d5f8436fce.png

QA decision: REJECTED because the central water column repeated round droplets in a bead/pearl-chain pattern, risking a jewelry read and violating the no-particle/bead-chain intent. Street, sea height, palette, and light continuity passed.

### 4. sky-sea-upward.png — single-variable repair (accepted)

Input image: the rejected sky-sea-upward generated source above, copied temporarily to the workspace as the edit target and inspected with view_image.

Use case: precise-object-edit
Asset type: repair of the upward sky-sea reveal geography anchor
Primary request: Change only the central rising water column so it reads as one physically continuous, irregular translucent stream pulled upward from the street into the overhead ocean. Remove the repeated round bead/pearl-chain appearance: the column must have natural uneven width, stretched water sheets and a few connected rivulets, with only sparse small droplets beside it. Keep the column centered and clearly rising. No jewelry-like circles or necklace pattern.
Constraints: keep the buildings, windows, wet brick, ocean underside, light, colors, camera angle, and all surrounding sparse rising droplets unchanged. The ocean remains far overhead, never ground-level. No people, protagonist, eye, creature, face, hand, teeth, tentacles, beams, particle clouds, text, or watermark.
Avoid: bead chain, pearls, necklace, repeated perfect spheres, downward rain, ordinary sky, multiple suns, fantasy castle, recognizable IP.
Output intent: final clean upward-view continuity plate for the world-reveal shot.

Generated source: C:\Users\11458\.codex\generated_images\01a0201d-8fe9-71e2-a2a4-aa242513e609\exec-aed886f4-e5d4-48d1-bab0-013bd6dc70c7.png

QA decision: ACCEPTED. The central path now reads as an irregular connected stream with sparse droplets; geography and sky-sea continuity remain coherent.

### 5. direction-lock.png — accepted generation

Input images: Image 1 was the accepted reverse-rain street workspace file; Image 2 was the accepted repaired sky-sea-upward workspace file.

Use case: photorealistic-natural
Asset type: reusable reverse-rain FX direction lock for a vertical dark-fantasy short film
Primary request: A clean FX continuity plate that isolates the reverse-rain direction in the same street: foreground wet limestone puddle with one unmistakable upward splash crown, a central rising droplet and thin connected water column traveling from the splash toward the distant overhead ocean underside. Include only a few secondary droplets to show direction; keep all water physically rising away from the pavement. The suspended ocean remains far overhead as the destination of the column.
Scene/backdrop: same British coastal old-city lane, wet limestone and brick, restrained unbranded shopfront glass; no landmark.
Subject: reverse-rain water effect only; no protagonist, no people, no Mother eye or creature.
Style/medium: live-action photorealistic VFX reference, crisp realistic water refraction and contact splash, no synthetic graphic overlay.
Composition/framing: vertical 9:16, low camera near the splash; one dominant central column from lower foreground to overhead sea, enough negative space to read its full upward path, no collage.
Lighting/mood: cold natural daylight through seawater, one consistent direction, restrained uncanny alarm.
Color palette: wet limestone grey-white, weathered brick brown, storm cyan, deep ocean blue, low-saturation cold green, natural neutral reflections.
Materials/textures: realistic puddle surface, sharp splash crown with open upward fingers, droplets with natural refraction, connected water column, wet brick and glass, ocean underside caustics.
Constraints: direction-lock must communicate ground-to-sky motion in one still; preserve geography and sea continuity from Images 1–2. No generated text or logo.
Avoid: downward rain, splash falling back down, ground-level ocean, multiple suns, fantasy castle, recognizable IP, full monster, eye, face, hand, teeth, tentacles, beams, particle soup, bead chains, pearls, necklace pattern, text, watermark.
Output intent: production FX lock for opening reverse-rain shot.

### 6. mother-shadow-lock.png — accepted generation

Input images: Image 1 was the accepted world-anchor workspace file; Image 2 was the accepted sky-sea-upward workspace file.

Use case: photorealistic-natural
Asset type: reusable partial-Mother scale and shadow FX lock for a vertical dark-fantasy short film
Primary request: Show only the environmental evidence of a vast Mother passing through the suspended ocean: a broad, soft-edged organic shadow moves across the underside of the overhead sea and rolls over the street facades, briefly dimming daylight. The shadow must feel city-scale through its coverage and the changed illumination, but remain abstract and partial, without a creature outline or identifiable anatomy. Wet shopfront glass and puddles subtly darken with the moving shadow.
Scene/backdrop: same narrow British coastal old-city street, modest unbranded shopfront glass, no landmarks or readable signage.
Subject: one enormous moving shadow only; no visible creature body, no eye, face, hand, teeth, tentacles, fins, wings, or skin.
Style/medium: live-action photorealistic environmental VFX reference, believable lighting transition, restrained dark-epic unease.
Composition/framing: vertical 9:16 medium-wide low street view; overhead ocean underside fills upper half, shadow crossing it and the street in one readable sweep; architecture remains clear for scale.
Lighting/mood: natural diffuse daylight through seawater interrupted by one broad cold shadow; no artificial rim light, no beams.
Color palette: wet limestone grey-white, weathered brick brown, storm cyan, deep ocean blue, low-saturation cold green, natural shadow.
Materials/textures: realistic water underside caustics, rain-darkened masonry, glass reflections, soft shadow penumbra; no particles.
Constraints: environmental scale must carry the fear; keep Mother incomplete and unknown, with no anatomy or full silhouette; no generated text or logo.
Avoid: full monster, recognizable IP creature, eye, face, hand, teeth, tentacle, body, wings, fins, multiple suns, fantasy castle, downward rain, ground-level ocean, magic beams, particle soup, neon, text, watermark.
Output intent: clean Mother-shadow continuity lock for the scale-establishing shot.

### 7. mother-eye-lock.png — initial generation (rejected)

Input images: Image 1 was the accepted world-anchor workspace file; Image 2 was the accepted mother-shadow workspace file.

Use case: photorealistic-natural
Asset type: reusable partial-Mother eye continuity lock for a vertical dark-fantasy short film
Primary request: From the street looking up at the underside of the suspended ocean, reveal only one incomplete eye pressing against the water underside: a partial arc of a vast eyelid and a cropped portion of one iris with irregular pearl-like nacre texture and cold natural iridescence. The eye is seen through/against the underside water, not as a detached object. Keep most of the eye outside the frame or obscured by the water so the viewer cannot see a full face. It must feel ancient and city-scale through the compressed perspective and reflected light, not through anatomy.
Scene/backdrop: same narrow British coastal old-city street and overhead ocean as Images 1–2; no landmarks or readable signage.
Subject: one partial eye only; no other creature anatomy.
Style/medium: live-action photorealistic creature-fragment VFX reference, subtle tactile pearl nacre, believable seawater refraction, no glossy CGI toy look.
Composition/framing: vertical 9:16 low upward view with building edges framing the bottom/sides; incomplete eye occupies only the upper region, cropped by frame and ocean underside; no centered full eyeball, no full face.
Lighting/mood: cold daylight filtered through water with restrained pearl iridescence, soft shadow, quiet dread.
Color palette: storm cyan, deep ocean blue, wet limestone grey, weathered brick brown, white pearl nacre with faint cold green/pink shifts, natural neutral shadows.
Materials/textures: realistic rippled water underside, irregular nacre texture integrated in iris, wet glass and masonry, no luminous effects.
Constraints: partial Mother only; show one incomplete pearl-textured eye pressing toward the underside; keep identity unknown and never reveal head or body. No generated text or logo.
Avoid: full eye centered in frame, full face, second eye, nose, mouth, teeth, hand, tentacle, body, skin, scales, recognizable IP creature, fantasy castle, beams, magic glow, particle clouds, multiple suns, downward rain, ground-level ocean, text, watermark.
Output intent: clean eye lock for the eye-opening beat.

Generated source: C:\Users\11458\.codex\generated_images\01a0201d-8fe9-71e2-a2a4-aa242513e609\exec-2c6b5257-6098-4067-bb6f-874aad68567e.png

QA decision: REJECTED because the output showed an almost complete large eye, despite no full face. This breached the conservative incomplete-eye gate.

### 8. mother-eye-lock.png — single-variable crop/visibility repair (accepted)

Input image: the rejected mother-eye generated source above, copied temporarily to the workspace as the edit target and inspected with view_image.

Use case: precise-object-edit
Asset type: repair of the partial-Mother eye continuity lock
Primary request: Change only the eye visibility and crop so the Mother remains unmistakably partial. Replace the nearly complete eye with a cropped fragment pressing from behind the ocean underside: show only an incomplete crescent of one pearl-nacre iris and a short irregular eyelid arc, cut off by the top/right frame and merged into surrounding water. Do not show a complete oval, full pupil, or both eyelid edges. The eye fragment should occupy a smaller upper-corner area while the street and ocean remain the main composition. Keep the iris texture tactile and natural, not glowing.
Constraints: preserve the exact architecture, framing, sea height, underside orientation, water texture, shadow, palette, lighting, and wet surfaces. There is one eye fragment only and no other anatomy. Never reveal full face, head, body, skin, nose, mouth, teeth, hand, tentacle, fins, scales, or a second eye. No beams, particles, magic glow, text, logo, watermark.
Avoid: complete eye, centered full eyeball, perfect almond outline, visible full pupil, full face, monster body, recognizable IP.
Output intent: final conservative eye lock for the eye-opening beat, keeping identity unknown.

Generated source: C:\Users\11458\.codex\generated_images\01a0201d-8fe9-71e2-a2a4-aa242513e609\exec-256cc5a9-a6d4-4122-9efb-27498d8d6778.png

QA decision: ACCEPTED. Only a partial pearl-textured iris/eyelid crescent remains in the upper-right; no complete eye, face, hand, teeth, tentacle, body, or second eye is visible.

## Visual QA matrix

| Asset | Geography continuity | Direction / scale | Mother partial gate | Text / brand gate | Decision |
| --- | --- | --- | --- | --- | --- |
| world-anchor.png | PASS: one narrow wet brick/limestone lane; overhead sea underside | PASS: far suspended ocean, natural light | N/A; no eye | PASS: no readable text or logos | ACCEPT |
| reverse-rain-street.png | PASS: same street and sea height | PASS: puddle splash crowns and droplets leave ground upward | N/A | PASS | ACCEPT |
| sky-sea-upward.png | PASS after repair: same walls, roofline, sea height and palette | PASS after repair: one irregular connected stream travels upward | N/A | PASS | ACCEPT |
| direction-lock.png | PASS: same lane and overhead sea | PASS: splash crown plus ground-to-sky droplet path | N/A | PASS | ACCEPT |
| mother-shadow-lock.png | PASS: same lane and sea underside | PASS: broad city-scale dimming shadow | PASS: shadow only, no anatomy | PASS | ACCEPT |
| mother-eye-lock.png | PASS after repair: same lane and sea underside | PASS: eye fragment presses against water from above | PASS after repair: one cropped nacre crescent only | PASS | ACCEPT |

## Rejection criteria carried forward

Reject downward rain; any ground-level ocean; conflicting streets, sea heights, light directions, or palettes; multiple suns; fantasy castles; recognizable IP; readable brands or generated text; protagonists in these environment/FX anchors; full Mother face/body; second eye; hands, teeth, tentacles, fins, wings, scales, or skin; magic beams; particle soup; bead/pearl-chain water; warm orange-teal grading; and any loss of the narrow British coastal old-city geography.

## Verification commands

Presence and metadata:

    $files = @(
      'video-pipeline/asset-library/03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001/source/world-anchor.png',
      'video-pipeline/asset-library/03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001/source/reverse-rain-street.png',
      'video-pipeline/asset-library/03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001/source/sky-sea-upward.png',
      'video-pipeline/asset-library/08-fx/FX_MR_REVERSE_RAIN_001/source/direction-lock.png',
      'video-pipeline/asset-library/08-fx/FX_MR_SKY_SEA_MOTHER_001/source/mother-shadow-lock.png',
      'video-pipeline/asset-library/08-fx/FX_MR_SKY_SEA_MOTHER_001/source/mother-eye-lock.png'
    )
    $files | ForEach-Object { if (-not (Test-Path -LiteralPath $_)) { throw "Missing $_" } }
    node -e "const sharp=require('sharp'); const files=process.argv.slice(1); Promise.all(files.map(async f=>{const m=await sharp(f).metadata(); console.log(f,m.width+'x'+m.height,m.format,m.channels+'ch')})).catch(e=>{console.error(e);process.exit(1)})" -- $files
    Get-FileHash $files -Algorithm SHA256

Visual inspection:

    view_image was run on each final workspace PNG after copy. The six final outputs passed the subject, composition, texture, continuity, and avoid-list checks recorded above.

Validator results (expected red state while later Task 5/6 outputs are absent):

    & 'video-pipeline/asset-library/scripts/validate-sea-above-file001.ps1' -Mode anchors
    exit 1 — Missing S01 first frame dependency: first-frames/S01.png

    & 'video-pipeline/asset-library/scripts/validate-sea-above-file001.ps1' -Mode package
    exit 1 — Missing accepted take S01

These failures are dependency-gate failures after the contract and anchor paths were parsed; they do not indicate an environment/FX asset failure.

## Concerns for parent review

- The generated reference plates are 941x1672 (near 9:16), not 2160x3840; they are intended as image-to-video/reference anchors and should be upscaled or used as references in later production, not treated as final 4K deliverables.
- The direction-lock and repaired sky-sea-upward include sparse round droplets as physically plausible water; they are not intended to read as jewelry, but later motion prompts should explicitly preserve irregular liquid behavior.
- The shadow and eye plates are intentionally darker than the world anchor so the Mother scale reads through light loss; later shots must keep exposure changes restrained and avoid a black-frame jump.
