# Task 5 Report — FILE 001 First Frames

Date: 2026-08-21

Status: ACCEPTED — S01–S09 and the deterministic 3×3 overview were created, copied into the owned first-frames directory, visually inspected, and dimension-checked. S06/S07 completed the requested right-ear/orientation repair round.

## Scope and execution

Owned outputs:

- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/first-frames/S01.png` through `S09.png`
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/first-frames/3x3-overview.png`
- this focused report

The built-in `image_gen` tool was used for S01–S08, one generation or edit call per asset/pass. No paid service, CLI/API image generation, or video generation was used. Every accepted generated source and every final workspace image was inspected with the local image viewer. Generated sources remain in the external imagegen directory and were not copied into the repository as extra junk.

Imagegen sources were 941×1672 RGB PNGs. The accepted image sources were deterministically center-cover resized to 1080×1920 with Sharp (`fit: cover`, `position: centre`, `kernel: lanczos3`) and written as 3-channel sRGB PNGs. S09 was not AI-generated: it is a deterministic Sharp-rendered SVG plate using `C:\Windows\Fonts\consola.ttf` (Consolas), exact requested copy, a black background, and one small upward-pointing droplet. The overview is a deterministic Sharp composite in S01–S09 order; labels live in 28 px gutters above each untouched 360×640 image cell.

The production contract and asset-pack manifest were not changed. The manifest currently declares the pre-existing `first-frames/overview.png` package dependency while this task's explicit deliverable is `first-frames/3x3-overview.png`; this report records the discrepancy for the parent integration pass rather than changing authority casually.

## Accepted outputs, provenance, and hashes

All S01–S09 masters are 1080×1920, RGB/sRGB PNGs. The overview is 1128×2052, RGB/sRGB PNG.

| Asset | Accepted generated source (external) | Workspace output | Source SHA-256 | Output SHA-256 | QA |
| --- | --- | --- | --- | --- | --- |
| S01.png | `C:\Users\11458\.codex\generated_images\01a02052-0c60-77f0-98fa-73d7adf03138\exec-e13351e1-491e-4a05-a594-da1f22153239.png` | `first-frames/S01.png` | `6EBCD369EC418E145CE185EA1C00AD26F74170AE9E7BF71B11A223A7E7E53C65` | `A20A13D1FADE6E5D24010981DDFA129F88BEA989DE8FD37A7DE6B30A32EFF2BD` | ACCEPT |
| S02.png | `C:\Users\11458\.codex\generated_images\01a02052-0c60-77f0-98fa-73d7adf03138\exec-33d00073-403a-4538-915b-919fcdb20c3d.png` | `first-frames/S02.png` | `7B3BB45A4B5A62367C025ACE61D6AF205002A10A5378C33907DFB21FDBE2D126` | `6EDA488806A919FDF39E70D2E5E3C1B9AF549590A3B216FA4D86AAA69235971E` | ACCEPT after pearl/hand-gap repair |
| S03.png | `C:\Users\11458\.codex\generated_images\01a02052-0c60-77f0-98fa-73d7adf03138\exec-63818f9d-19ed-4e66-b46d-8f7a45887af4.png` | `first-frames/S03.png` | `D84664D90D537BD2AEA3D70BE5B259358C02C3D09CDFBAF9A5DF9221436ECAD8` | `37FB493AD4DE2FF6FD25B42A3FD3D8AC00BCD65B9CA1D0424FC05BEACA2AC44A` | ACCEPT |
| S04.png | `C:\Users\11458\.codex\generated_images\01a02052-0c60-77f0-98fa-73d7adf03138\exec-f320b108-d0db-4425-a37f-6a2837e64c19.png` | `first-frames/S04.png` | `BAA08E4F9CF4BCAD6567F89FD392DEA5AB5DCEDB997DFDBBB6CE658BB81FD94E` | `DA853B6F794313061C0D7DEDD6459E31D15F944A875D31445024100BA370DA78` | ACCEPT |
| S05.png | `C:\Users\11458\.codex\generated_images\01a02052-0c60-77f0-98fa-73d7adf03138\exec-c6b6ebfe-c0e8-456c-859f-39c054d9b70b.png` | `first-frames/S05.png` | `48C08334D5D6E81033182C286DC612C68CEFACA69FBF362B94134681CAFD14B6` | `8679CAE7F9BDC63A2C2B6962319C7CB6DA212E825C6A9CB0B5C0D7FF2ABE30A2` | ACCEPT |
| S06.png | `C:\Users\11458\.codex\generated_images\01a02052-0c60-77f0-98fa-73d7adf03138\exec-18ddaa88-c3da-4129-8a0c-27bbfa6df98e.png` | `first-frames/S06.png` | `CE25683B120C110B6E539CEBEA40C4B03185FD67A04A15777EBDED415C642EB7` | `1D479088C7D3CF85B010936128743990DEE9C34DCC3A6F42B3688BFD96CE7B1B` | ACCEPT after frame-right/right-ear repair |
| S07.png | `C:\Users\11458\.codex\generated_images\01a02052-0c60-77f0-98fa-73d7adf03138\exec-6e0b731d-9219-48e1-bfac-3d3a74123e0e.png` | `first-frames/S07.png` | `DAEB33DB41E7D42117C6368BEC39B4805F27DCAEEE027C58C482CFBF9C345233` | `3C57167195A6D231A6DA93F7872D04C16C9F7E0AA678FEB9DA4FAB28553A2196` | ACCEPT after upward-curtain repair |
| S08.png | `C:\Users\11458\.codex\generated_images\01a02052-0c60-77f0-98fa-73d7adf03138\exec-523ff5a8-0aaf-402a-9512-35d3fbce0568.png` | `first-frames/S08.png` | `7C54B9A8551FD502C4ABEBF872B57A9885FE069CA79C006124B595C9889A9DC5` | `6B7A7F2E70A9D4DFBB443CDA22CB213E80A54F345A46F1F2E53B0D7BA7772B3D` | ACCEPT |
| S09.png | deterministic Sharp SVG; no imagegen source | `first-frames/S09.png` | — | `DCB4D6A17D1A5C95EB114D5EBD4432AF980598322994636B18F926C19D7B95D1` | ACCEPT; exact copy/black card |
| 3x3-overview.png | deterministic Sharp composite; no imagegen source | `first-frames/3x3-overview.png` | — | `73391AC6254AF6AF809E5E0CD6CAAD0BCDCC77A1C30F12217247079D989E9911` | ACCEPT; 3×3 order/gutters |

## Per-shot visual QA

| Shot | Visual QA decision |
| --- | --- |
| S01 | PASS. Low street frame immediately reads ground-to-sky suction: a foreground pavement origin rises toward the overhead sea. The adult protagonist is stationary; sparse background adults flee/remove jewelry. No title, logo, name, price, fade, or watermark. |
| S02 | PASS after targeted repair. Tight right profile keeps the exact closed gold hoop, green-stone front, one connector, irregular pearl, and terminal bead readable. Pearl is physically tilted upward; five fingers stop short with an air gap. No text or extra jewelry. |
| S03 | PASS. Camera-start low pavement origin shows one continuous upward column, tiny protagonist for scale, and an unbroken line into the overhead sea. |
| S04 | PASS. Same old-city geography under a broad Mother shadow crossing the sea underside; protagonist is tiny and no anatomy/eye is visible. |
| S05 | PASS. Upper-right partial nacre fragment is cropped/embedded in the overhead sea; protagonist is below and looking up. It never resolves into a full eye oval, face, or body. |
| S06 | PASS after orientation and jewelry repairs. Warm/desaturated memory composition retains safe rear/three-quarter child, joined hands, and ambiguous adult identity. Adult nose/gaze points frame-right and the visible anatomical right ear carries a recognizable exact Baroque Orbit: green-stone hoop, one connector, irregular pearl, terminal bead. |
| S07 | PASS after deriving from corrected S06 and repairing the water. Adult remains frame-right/right-ear locked; child and joined hands remain safe/clear. One thin translucent sheet rises from a quiet inward-pulled pavement origin and refracts/removes adult identity; no impact crown, gore, or body horror. |
| S08 | PASS. Current protagonist close portrait has contained fear turning toward upward resolve, exact right-ear earring, subtle beginning nacre texture inside a normal iris, and only a small cropped overhead eye/reflection. No generated text. |
| S09 | PASS. Pure black deterministic archive card with exactly `THE SEA HAS CHOSEN AGAIN.` and `MAVERENNE // RECOVERED TIDE FILE 001`; one small rising droplet/trail loops visually toward S01. No extra copy, logo, watermark, price, or AI lettering. |

The 3×3 overview was inspected after final RGB normalization. It is S01–S09 in order, with labels in gutters and no label pixels over any master frame. The master frames were not modified by overview construction.

## Rejected passes and repair reasons

| Pass | Generated source | SHA-256 | Decision/reason |
| --- | --- | --- | --- |
| S02 initial | `C:\Users\11458\.codex\generated_images\01a02052-0c60-77f0-98fa-73d7adf03138\exec-3fc66a86-b50d-4cf3-ad1b-11351b76cbda.png` | `566088A2E29DF0015B1D0D115806375A69EA84399D7E06F260D830F0561CA1EE` | REJECT. Pearl remained downward/insufficiently tilted and approaching fingertips were too close; repaired with a single-object tilt and hand-gap edit. |
| S06 initial | `C:\Users\11458\.codex\generated_images\01a02052-0c60-77f0-98fa-73d7adf03138\exec-c2e64021-173a-48a7-a272-3a243ab15d55.png` | `AA8E1183B69E04352086BA4EBD77B8B9786F2C082BD246ABB2AEA7E18FBA9D56` | REJECT. Adult turned frame-left, making the visible jewelry read as the wrong ear for the binding lock. |
| S07 first orientation | `C:\Users\11458\.codex\generated_images\01a02052-0c60-77f0-98fa-73d7adf03138\exec-a74060fd-e569-4f0a-a5e8-effc94afb0d9.png` | `B4905E845DA9A7700D8F846A1F727FDA53EEB9ED9B06C963AFF946D5B4E7DB0E` | REJECT/superseded. Derived from pre-correction S06, so it did not satisfy the requested right-facing/right-ear continuity. |
| S06 orientation repair | `C:\Users\11458\.codex\generated_images\01a02052-0c60-77f0-98fa-73d7adf03138\exec-b6844abc-620e-4aa7-8651-bd48c4587d79.png` | `68691C2E87AF233427FEB8658114EC1A46A2D608E4CB32C340FD29F6095E914F` | REJECT. Face direction was corrected, but the visible hardware read as chain-like and green-stone/one-connector geometry was not sufficiently clear. |
| S07 first water repair | `C:\Users\11458\.codex\generated_images\01a02052-0c60-77f0-98fa-73d7adf03138\exec-b54b6d86-77b4-48c9-aea1-21076bcf8db4.png` | `A1B355C43F996B4D5CFB3E1A688421D703CB5AB0B382D8C22ABFC81BDB499B75` | REJECT. Corrected orientation passed, but the bottom water event still formed an ordinary impact splash/crown. A targeted water-only repair removed that cue. |

## Exact imagegen prompt provenance

The following are the exact prompt bodies submitted to built-in `image_gen`; references are listed immediately before each prompt. These are image-generation prompts only, not Seedance prompts or a director card.

### S01 — accepted generation

References:

- `video-pipeline/asset-library/03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001/source/reverse-rain-street.png`
- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/character-turnaround.png`

```text
Use case: photorealistic-natural
Asset type: first-frame still for a 9:16 dark-fantasy short film, FILE 001 opening hook
Input images: Image 1: exact British old-city reverse-rain environment reference; preserve its street geography, overhead sea, cold storm-cyan light, and one pavement-anchored upward stream. Image 2: adult protagonist identity reference; preserve the same age-23 woman, face, blue-green eyes, wet center-parted blonde hair, body proportions, and wardrobe.

Primary request: Create a live-action photorealistic first frame at the instant the reverse rain begins. Low street-level 28–30mm vertical view. The 23-year-old adult blonde protagonist stands completely still near the middle of the wet old-city lane, while a few indistinct adult background pedestrians urgently flee and remove ordinary jewelry. Make the abnormal direction instantly legible: water visibly starts at wet pavement and shallow puddles and rises upward toward the distant underside of the vast suspended sea; no water falls down from above. The protagonist is the calm stationary anchor amid motion.

Scene/backdrop: one narrow British coastal old-city street with wet limestone paving, weathered red-brown brick and restrained unbranded shopfront glass, same distant overhead ocean underside.
Subject: same adult protagonist in a fitted opaque light camisole and high-waisted pale slate-blue short skirt, bare arms and legs, tasteful British cold elegance; background adults only, no identifiable faces.
Style/medium: natural live-action cinematography, realistic human skin, wet fabric and physically plausible water, restrained beautiful-but-uneasy dark fantasy.
Composition/framing: low viewpoint, protagonist centered slightly above the vertical midpoint and fully readable from knees up, a foreground puddle and upward suction stream prominent at the bottom-center, distant overhead sea visible above, background runners small and sparse, no clutter.
Lighting/mood: cold storm-cyan daylight through seawater, natural neutral skin tones, quiet alarm.
Constraints: no text, no logo, no product name, no price, no watermark, no fade, no title card; no full Mother, no eye, no creature; preserve one coherent upward gravity direction. The protagonist is unequivocally adult; no child, no sexualized posing.
Avoid: downward rain, conventional falling droplets, water impact crown, ground-level ocean, fantasy castle, landmarks, readable signs, recognizable IP, magic beams, particle soup, orange-teal grade, duplicate people, extra limbs, malformed hands, extra jewelry, generated lettering.
Output intent: a clean 9:16 first-frame image with the reverse-rain rule readable at phone-thumbnail size.
```

### S02 — initial rejected generation

References:

- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/earring-profile.png`
- `video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/views/product-lock.png`
- `video-pipeline/asset-library/03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001/source/world-anchor.png`

```text
Use case: identity-preserve
Asset type: first-frame still for a 9:16 live-action dark-fantasy short film, FILE 001 pearl-response close-up
Input images: Image 1: adult protagonist right-side profile identity and earring reference; preserve the same 23-year-old face, blue-green eye, wet center-parted blonde hair, natural skin, and anatomical right ear. Image 2: exact Baroque Orbit product geometry reference; preserve the real earring structure. Image 3: old-city overhead-sea environment reference; use only for cold storm-cyan world continuity.

Primary request: A photorealistic tight right-profile close-up of the current adult protagonist on the same rain-wet old-city street. Her fingers are naturally proportioned and paused one centimeter before removing the exact earring from the anatomical right ear; do not touch or deform the jewelry. The irregular white baroque pearl physically tilts upward toward the overhead sea as if answering it, while her face shows delayed recognition rather than panic. The earring remains fully readable: polished closed gold hoop, tiny green stones along the hoop front, exactly one connector ring, one organically ridged asymmetric white baroque pearl, and one tiny terminal gold bead.

Scene/backdrop: soft-focus wet brick and shopfront reflections, a sliver of the suspended ocean underside above; no readable signs.
Subject: same adult woman, fitted opaque light camisole strap at shoulder, bare neck and shoulder, clean right profile; one right-ear earring only.
Style/medium: natural live-action 85mm macro/editorial close-up, crisp skin pores and wet hair strands, restrained uncanny realism.
Composition/framing: vertical 9:16, profile fills middle and upper frame, anatomical right ear on the image-right side, hand entering from below and stopping before the earring, pearl tilted diagonally upward; keep enough negative space above for the implied sea, no second earring.
Lighting/mood: cold storm-cyan daylight with a small neutral highlight on gold and nacre, city sound about to vanish, quiet recognition.
Constraints: exact product geometry is immutable; safe human hand anatomy with five natural fingers, no contact that obscures the earring. No generated text, logo, price, watermark, title card, or UI; no body horror, no creature, no full Mother.
Avoid: left-ear confusion, doubled jewelry, extra connector rings, round pearl, smooth pearl, missing green stones, missing terminal bead, malformed fingers, fused fingers, extra hands, distorted ear, smiling, glamour pose, downward rain, orange-teal grade, readable signage.
Output intent: a motion-ready first frame where the earring's upward physical tilt is immediately legible and the face is still processing what it hears.
```

### S02 — accepted targeted repair

References:

- `C:\Users\11458\.codex\generated_images\01a02052-0c60-77f0-98fa-73d7adf03138\exec-3fc66a86-b50d-4cf3-ad1b-11351b76cbda.png`
- `video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/views/product-lock.png`

```text
Use case: precise-object-edit
Asset type: repaired first-frame still for a 9:16 live-action dark-fantasy short film
Input images: Image 1: edit target; preserve the exact adult woman's face, right profile, wet center-parted blonde hair, natural skin, shoulder/camisole, background street, ocean underside, framing, light, and earring geometry. Image 2: immutable product geometry reference.

Primary request: Change only two details in Image 1. First, rotate the single irregular white baroque pearl and its one connector ring as a physically coherent rigid hanging unit so the pearl is clearly tilted diagonally upward toward the overhead sea, while the hoop remains seated in the anatomical right ear. Second, keep the approaching hand naturally poised just short of the pearl, with a visible narrow air gap and no fingertip touching or intersecting any jewelry. Preserve five natural fingers and safe anatomy.

Constraints: keep exactly one closed polished gold hoop with tiny green stones on its front, exactly one connector ring, one asymmetric ridged white baroque pearl, and one terminal gold bead; no added jewelry or redesigned hardware. Keep face/identity, framing, wardrobe, wet hair, street, ocean, color, and focus unchanged. No text, logo, watermark, or extra objects.
Avoid: downward-hanging unchanged pearl, contact or intersection between fingers and pearl, duplicate connector, round pearl, missing stones, missing terminal bead, fused or malformed fingers, extra hand, altered face, second earring, generated lettering.
```

### S03 — accepted generation

References:

- `video-pipeline/asset-library/03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001/source/sky-sea-upward.png`
- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/character-turnaround.png`

```text
Use case: photorealistic-natural
Asset type: first-frame still for a 9:16 live-action dark-fantasy short film, FILE 001 world reveal
Input images: Image 1: exact upward sky-sea geography and reverse-rain origin reference; preserve same street corridor, pavement suction origin, overhead ocean underside, storm-cyan palette, sea height, and light direction. Image 2: adult protagonist identity reference; preserve the same 23-year-old blonde woman, face, blue-green eyes, wet center-parted hair, and light camisole/high-waisted short skirt.

Primary request: Camera-start frame at the low pavement origin of one continuous irregular upward water column. Place the protagonist small in the middle distance on the same old-city street for human scale, standing still and looking upward. The single water column begins visibly in one shallow pavement puddle at the lower foreground, with inward suction deformation and a tapered irregular neck, then leads continuously through the street toward the vast suspended ocean underside above. The vertical geometry must be instantly readable as ground-to-sky.

Scene/backdrop: one narrow British coastal old-city lane, wet limestone paving, weathered red-brown brick, unbranded shopfront glass, distant overhead ocean seen from below.
Subject: one sparse reverse-rain column and one small adult protagonist; no crowd needed.
Style/medium: live-action photorealistic location/VFX plate, physically plausible wet water and reflections, restrained dark-epic unease.
Composition/framing: low 28mm wide vertical view, bottom 15–20% contains pavement and the suction puddle, column centered and unbroken, protagonist small (roughly 8–12% frame height) beyond the puddle, ocean underside fills upper half; no crop removing origin or destination.
Lighting/mood: cold storm-cyan daylight filtered through seawater, natural neutral reflections, growing awe.
Constraints: preserve upward gravity, one stream only, one protagonist only, no generated text, logo, price, watermark, signage, or title card. No Mother eye or creature anatomy.
Avoid: disconnected floating stream, waterfall descending from sea, ordinary downward rain, splash impact crown, pearl/bead chain, multiple columns, ground-level ocean, oversized protagonist, duplicate person, fantasy castle, landmark, recognizable IP, beams, particle soup, orange-teal grade.
Output intent: motion-ready first frame whose camera can begin at the puddle and later travel upward along one water column.
```

### S04 — accepted generation

References:

- `video-pipeline/asset-library/08-fx/FX_MR_SKY_SEA_MOTHER_001/source/mother-shadow-lock.png`
- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/character-turnaround.png`

```text
Use case: photorealistic-natural
Asset type: first-frame still for a 9:16 live-action dark-fantasy short film, FILE 001 scale beat
Input images: Image 1: accepted partial-Mother shadow and exact old-city geography reference; preserve its overhead sea underside, broad soft-edged shadow, street architecture, sea height, storm-cyan palette, and light direction. Image 2: adult protagonist identity reference; preserve the same age-23 blonde woman and light camisole/high-waisted short skirt, but show her very small for scale.

Primary request: A wide locked-off vertical street frame beneath a vast suspended ocean. The protagonist is a tiny, clearly adult human figure far below in the same wet old-city lane, standing still and looking up. A city-scale Mother shadow crosses the underside of the overhead water and rolls over the street, visibly dimming the daylight; use only the shadow, no anatomy, no outline, no eye. The huge scale difference must read immediately from buildings, street, and tiny figure.

Scene/backdrop: same narrow British coastal old-city street with wet limestone, weathered brick, unbranded shopfront glass and full overhead sea underside.
Subject: one small adult protagonist only; vast soft organic darkness in the water above.
Style/medium: live-action photorealistic location plate, restrained beautiful-but-ominous realism, no spectacle excess.
Composition/framing: 24–28mm vertical wide shot, street corridor and full sea underside visible, protagonist under 5% of frame height near lower-middle, shadow occupying a broad upper swath and crossing the water, no close anatomy.
Lighting/mood: cold storm-cyan daylight abruptly subdued by deep blue-black soft shadow; preserve natural reflections, no hard black frame.
Constraints: Mother remains only a partial moving shadow in the water; no eye, face, body, tentacles, fins, teeth, hands, or full creature. No text, logo, price, watermark, signage, or title card.
Avoid: visible creature anatomy, full eye, centered black void, fantasy castle, landmark, recognizable IP, downward rain, ground-level ocean, beams, particle soup, warm orange-teal grade, giant protagonist, duplicate people.
Output intent: a motion-ready scale first frame that gives the later shadow crossing a clear starting composition.
```

### S05 — accepted generation

References:

- `video-pipeline/asset-library/08-fx/FX_MR_SKY_SEA_MOTHER_001/source/mother-eye-lock.png`
- `video-pipeline/asset-library/03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001/source/sky-sea-upward.png`
- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/character-turnaround.png`

```text
Use case: photorealistic-natural
Asset type: first-frame still for a 9:16 live-action dark-fantasy short film, FILE 001 partial-Mother reveal
Input images: Image 1: accepted partial nacre eye fragment reference; preserve its cropped upper-right placement, irregular pearl-like iris texture, and incomplete visibility. Image 2: exact upward sky-sea street geography; preserve sea underside, street height, palette, and light direction. Image 3: adult protagonist identity reference; show the same 23-year-old woman small below, preserving blonde hair and light outfit.

Primary request: Looking upward from the same wet old-city street, show the protagonist below the overhead sea, small enough for scale, gazing upward. In the upper-right edge of the suspended sea underside, a partial nacre eye fragment presses through the water: only a cropped sliver of iris/lashes and surrounding nacre texture, never a full oval, never a whole eye, never a face. The eye fragment is physically embedded in the underside and merges with the water; it must feel like a huge presence without revealing anatomy. Keep the protagonist's human body intact and distant.

Scene/backdrop: same narrow British coastal old-city lane, wet limestone and weathered brick, overhead water underside filling the sky.
Subject: one tiny adult protagonist below; one incomplete upper-right nacre eye fragment only.
Style/medium: live-action photorealistic dark-fantasy location plate, restrained natural iridescence, no spectacle.
Composition/framing: vertical 9:16 upward-looking wide view, protagonist in lower-middle under 6% frame height, eye fragment cropped by the upper-right frame edge and no larger than roughly 12% of frame width; leave most of sea underside open, no centered eye.
Lighting/mood: cold storm-cyan filtered daylight, nacre glint in pale green-white, quiet dread.
Constraints: partial fragment only; no complete eye oval, no pupil-centered portrait, no face, body, hand, teeth, tentacle, fins, scales, second eye, or creature silhouette. No text, logo, price, watermark, signs, or title card.
Avoid: full eye, centered eye, full Mother, anatomy outline, monster body, gore, injury, body horror, magic beam, particle cloud, orange-teal grade, fantasy castle, recognizable IP, downward rain, ground-level ocean.
Output intent: motion-ready frame that supports an eye slowly opening later while preserving mystery and scale.
```

### S06 — initial rejected generation

References:

- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_MEMORY_PAIR_001/source/memory-pair-lock.png`
- `video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/views/product-lock.png`

```text
Use case: photorealistic-natural
Asset type: first-frame still for a 9:16 live-action dark-fantasy childhood-memory beat
Input images: Image 1: accepted safe memory-pair composition; preserve the same old-city street, safe rear/three-quarter child framing, joined hands, adult wardrobe and body, and distinct adult/child identities. Image 2: immutable Baroque Orbit product geometry reference; make the adult's anatomical right-ear earring recognizable.

Primary request: A warmer, gently desaturated memory variation of the same wet old-city lane. A fully clothed child around eight years old is seen from the rear/three-quarter view, safe and non-identifiable, holding the adult woman's hand. The adult is the same unequivocally adult 23-year-old blonde woman in the light camisole and pale high-waisted short skirt, seen three-quarter rear with her face not fully presented. Her anatomical right ear clearly wears exactly the Baroque Orbit earring: closed polished gold hoop, tiny green stones, one connector ring, irregular white baroque pearl, tiny terminal gold bead. Keep the adult and child visually distinct; do not frame the adult as a literal mother or add any identity cue beyond the hand-holding memory.

Scene/backdrop: same narrow British coastal old-city lane, wet stone, brick, shopfront reflections, no readable signs.
Subject: safe child in muted ice-blue hooded waterproof shell, dark trousers and rain boots; adult woman holding the child's hand, no danger.
Style/medium: live-action photorealistic memory insert, slightly warmer and lower-contrast than present-day frames, subtle film grain and softened highlights, no surreal haze.
Composition/framing: vertical 9:16, child lower-left in rear/three-quarter, adult right of center, joined hands clearly visible, right ear and earring readable enough to identify, adult face partly turned away; walking or pausing calmly.
Lighting/mood: warm overcast memory light with restrained beige/amber reflected warmth, still rainy, tender but ambiguous.
Constraints: child fully clothed and safe, no vulnerable close-up, no gore, no injury, no panic. No text, logo, watermark, signage, product name, price, or title card. Do not imply the adult is currently the protagonist's mother; the memory may be a relative or unknown woman.
Avoid: child face close-up, child/adult face blending, danger, traffic, drowning, body horror, extra jewelry, second earring, altered product geometry, malformed hands, missing fingers, sexualized framing, orange-teal grade, fantasy castle, recognizable IP.
Output intent: a safe continuity-locked memory first frame with a clearly recognizable right-ear earring and intentionally unresolved adult identity.
```

### S07 — first pass from pre-correction S06 (superseded)

References:

- `C:\Users\11458\.codex\worktrees\2822\mythrealms-shop\video-pipeline\asset-library\10-storyboard-videos\VID_MR_SEA_ABOVE_FILE_001\first-frames\S06.png`
- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_MEMORY_PAIR_001/source/memory-pair-lock.png`

```text
Use case: precise-object-edit
Asset type: first-frame still for a 9:16 live-action dark-fantasy memory-erasure beat
Input images: Image 1: edit target S06 memory frame; preserve its exact child, adult body/wardrobe, joined hands, right-ear earring, street composition, warm desaturated palette, and safe framing. Image 2: accepted memory-pair continuity reference; use only to preserve safe child rear/three-quarter composition and identities.

Primary request: Change only the adult's facial identity and the water event. Keep the child fully safe, clear, rear/three-quarter, and holding the same adult hand. Keep the adult body, wet blonde hair, light camisole, pale short skirt, right-ear Baroque Orbit earring, joined hands, street, camera, warm memory grade, and all clothing unchanged. Add one translucent sheet of water rising vertically from the pavement between camera and adult face, physically refracting and partially removing the adult's facial features so her face/identity is partly obscured and beginning to disappear from the memory. The water sheet must be elegant and non-violent: no gore, no skin damage, no body horror, no injury, no distress to the child. Leave the earring and hand visible enough for continuity.

Scene/backdrop: same wet old-city lane, soft warm/desaturated memory light.
Composition/framing: preserve S06 layout; rising sheet crosses the adult face/upper torso only, child remains unobstructed and readable, adult's right ear and earring remain visible at the side.
Lighting/mood: warmer memory light with subtle watery refraction, quiet loss and ambiguity.
Constraints: change only adult facial refraction/removal and one upward water sheet; no added people or objects. No generated text, logo, watermark, signage, price, or title card.
Avoid: child obstruction, face blending, melting skin, blood, wounds, injury, horror, drowning, panic, broken hands, extra jewelry, missing earring, duplicate adult, downward rain, particle soup, magical beam.
```

### S06 — frame-right/right-ear orientation repair (superseded by final earring repair)

References:

- `C:\Users\11458\.codex\worktrees\2822\mythrealms-shop\video-pipeline\asset-library\10-storyboard-videos\VID_MR_SEA_ABOVE_FILE_001\first-frames\S06.png`
- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_MEMORY_PAIR_001/source/memory-pair-lock.png`

```text
Use case: precise-object-edit
Asset type: corrected first-frame still for a 9:16 live-action dark-fantasy childhood-memory beat
Input images: Image 1: edit target S06; preserve the exact child, joined hands, adult body/wardrobe, wet old-city lane, warm desaturated memory grade, camera, scale, and safe framing. Image 2: immutable Baroque Orbit product geometry reference.

Primary request: Change only the adult's head and upper-torso orientation. Turn the adult so her nose and gaze point toward the RIGHT edge of the frame, showing her clear right-facing profile; the visible ear on the near side must be her anatomical RIGHT ear and must carry the exact Baroque Orbit earring. Keep the child on the left, fully clothed rear/three-quarter and safe, still holding the same adult hand. Preserve adult age 23, wet center-parted blonde hair, light camisole, pale high-waisted short skirt, bare limbs, and same body/hand proportions. Keep the adult's face partially turned away and identity ambiguous, not a literal mother cue.

The visible anatomical RIGHT ear must show the exact product clearly enough to recognize: polished closed gold hoop, front row of tiny green stones, exactly one connector ring, one irregular ridged white baroque pearl, and one tiny terminal gold bead. Do not add any jewelry to the other ear.

Scene/backdrop: same warm/desaturated wet British old-city lane, no signs.
Composition/framing: preserve S06 layout and joined hands; adult remains right of center, child lower-left; adult head turns toward frame-right so the right-ear earring faces camera and reads clearly.
Lighting/mood: same warm overcast memory light, tender ambiguity.
Constraints: change only adult orientation and the corresponding earring visibility; preserve child safety, joined hands, street, palette, clothing, and body. No text, logo, watermark, price, title card, or extra objects.
Avoid: adult still facing frame-left, visible left-ear jewelry, ambiguous ear side, second earring, extra connector, round pearl, missing green stones, missing terminal bead, malformed ear or hands, child face, identity blending, danger, gore, body horror, sexualized framing, orange-teal grade.
```

### S06 — final exact right-ear jewelry repair (accepted)

References:

- `C:\Users\11458\.codex\worktrees\2822\mythrealms-shop\video-pipeline\asset-library\10-storyboard-videos\VID_MR_SEA_ABOVE_FILE_001\first-frames\S06.png`
- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/earring-profile.png`
- `video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/views/product-lock.png`

```text
Use case: precise-object-edit
Asset type: final corrected childhood-memory first-frame still, 9:16 live-action
Input images: Image 1: current S06 edit target; preserve every pixel-level choice except the right-ear jewelry: adult facing frame-right, same face/hair/body/wardrobe, child, joined hands, old-city street, warm desaturated memory grade, framing, and safe composition. Image 2: anatomical right-profile wearing reference; use it to keep one earring on the visible anatomical right ear. Image 3: immutable product lock; use it as the authoritative geometry.

Primary request: Replace only the adult's visible anatomical RIGHT-ear earring with the exact Baroque Orbit earring from Image 3. It must be a single polished closed circular gold hoop with a clearly readable continuous row of tiny green stones on the hoop front, exactly ONE small gold connector ring directly below the hoop, exactly ONE irregular organically ridged white baroque pearl drop, and exactly ONE tiny terminal gold bead. Make it modestly larger and sharper than the current earring but still naturally scaled to the adult ear, so all five locks are recognizable in this memory wide shot. The adult's nose must continue pointing toward the RIGHT frame edge and the visible ear remains her anatomical RIGHT ear. Remove every extra loop or chain.

Constraints: change only this one jewelry object. Preserve adult orientation, face, wet center-parted blonde hair, light camisole, pale high-waisted short skirt, bare limbs, child rear/three-quarter safe framing, joined hands, street, warm memory grade, focus, and camera. No jewelry on the opposite ear. No text, logo, watermark, price, signage, title card, or extra objects.
Avoid: chain or multiple links, multiple hoops, multiple connectors, round pearl, smooth pearl, missing green stones, missing terminal bead, duplicated pearl, jewelry on left ear, changed orientation, changed child, malformed anatomy, danger, gore, body horror, sexualized framing, orange-teal grade.
```

### S07 — corrected orientation generation (superseded by water-only repair)

References:

- `C:\Users\11458\.codex\worktrees\2822\mythrealms-shop\video-pipeline\asset-library\10-storyboard-videos\VID_MR_SEA_ABOVE_FILE_001\first-frames\S06.png`
- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_MEMORY_PAIR_001/source/memory-pair-lock.png`

```text
Use case: precise-object-edit
Asset type: corrected S07 first-frame still for a 9:16 live-action dark-fantasy memory-erasure beat
Input images: Image 1: corrected S06 edit target; preserve its adult facing frame-right/right-facing profile, visible anatomical right-ear Baroque Orbit earring, child rear/three-quarter safety, joined hands, same adult body/wardrobe, wet old-city lane, warm desaturated memory grade, camera, and layout. Image 2: accepted memory-pair continuity reference; preserve safe child framing and distinct identities.

Primary request: Change only the adult's facial identity and add one rising sheet of water. Keep the corrected S06 composition and adult orientation exactly: the adult's nose points to the RIGHT edge; the visible near ear is anatomical RIGHT and keeps the exact green-stone hoop, one connector, irregular baroque pearl, and terminal bead. Keep the child fully clothed, unobstructed, rear/three-quarter, safe, and holding the same adult hand. From the wet pavement, a single translucent sheet of water rises upward in front of the adult, physically refracting and partially erasing her face/identity; the face becomes incomplete and difficult to recognize while the adult body, right ear, earring, hand, and child remain clear. No gore, skin damage, injury, or body horror.

Scene/backdrop: same warm/desaturated wet British old-city lane, same camera and light.
Composition/framing: preserve corrected S06 layout; water sheet must have a visible lower pavement origin and rise vertically across the adult face/upper torso only, never covering the child or joined hands; retain enough right ear/equipment visibility for continuity.
Lighting/mood: warm memory light with restrained watery refraction, quiet loss, no panic.
Constraints: one water sheet only, ground-to-sky direction legible, no added people or objects. No text, logo, watermark, signage, price, title card, or UI.
Avoid: adult facing frame-left, wrong ear, lost earring, chain jewelry, extra connector, child obstruction, child face close-up, face blending, melting skin, blood, wound, injury, drowning, horror, downward rainfall, impact splash, magic beam, particle soup, orange-teal grade.
```

### S08 — accepted generation

References:

- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/source/earring-profile.png`
- `video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/views/product-lock.png`
- `video-pipeline/asset-library/08-fx/FX_MR_SKY_SEA_MOTHER_001/source/mother-eye-lock.png`

```text
Use case: identity-preserve
Asset type: first-frame still for a 9:16 live-action dark-fantasy short film, FILE 001 Mother reversal
Input images: Image 1: adult protagonist right-profile identity and exact earring reference; preserve the same 23-year-old face, wet center-parted blonde hair, blue-green eyes, and anatomical right ear. Image 2: immutable Baroque Orbit product geometry reference; preserve all five jewelry locks. Image 3: partial-Mother eye reference; use only a small overhead reflection/fragment, never a full eye.

Primary request: Photorealistic close current-day portrait of the same adult protagonist on the wet old-city street, turned slightly upward with contained fear hardening into resolve. The exact right-ear Baroque Orbit earring is readable and physically intact: polished closed gold hoop, tiny green stones on the hoop front, exactly one connector ring, irregular ridged white baroque pearl, tiny terminal gold bead. One blue-green iris is just beginning to show a very subtle nacre texture within the normal human iris structure, like a pearlescent ring under the cornea; no injury, no glow, no extra pupil, no body horror. In the upper background/overhead reflection, show only a small cropped partial nacre-eye presence merged into the suspended sea, supporting an unheard whisper of “Mother?” without any text.

Scene/backdrop: same cold wet old-city lane, soft overhead sea underside and a small upper-right reflection/fragment.
Subject: same adult woman, shoulders-up or chest-up, light camisole strap visible, no other jewelry.
Style/medium: live-action 85mm close portrait, natural skin pores and wet hair, restrained uncanny realism.
Composition/framing: vertical 9:16; protagonist face and right ear fill center-right, gaze lifted slightly above camera, earring unobscured; partial eye/reflection stays small in upper background and cropped, not centered; leave quiet negative space around her expression.
Lighting/mood: cold storm-cyan daylight with neutral skin, subtle nacre highlight only in one iris and pearl; quiet resolve, no melodrama.
Constraints: human eye anatomy remains normal; nacre texture subtle and internal, no damage. Product geometry immutable. No generated text, logo, price, watermark, subtitle, or title card.
Avoid: full Mother eye, full face/body/creature above, centered eye, second earring, extra jewelry, duplicate pearl, missing green stones, extra connector, round pearl, injury, glowing eye, multiple pupils, cracked skin, blood, tears-as-gore, exaggerated scream, glamour pose, orange-teal grade, beams, particle soup, readable signage.
```

## Deterministic S09 and overview provenance

S09 was rendered without imagegen from a fixed SVG passed to Sharp. The raster canvas is 1080×1920, black (`#000000`), with Consolas from `C:\Windows\Fonts\consola.ttf`, centered exact lines:

```text
THE SEA HAS CHOSEN AGAIN.
MAVERENNE // RECOVERED TIDE FILE 001
```

The only non-copy graphic is one small pale-cyan droplet with a short upward trail near the lower center; its pointed end faces upward to support the S09→S01 loop. The SVG contains no other text, logo, watermark, price, or generated lettering.

The overview uses a 1128×2052 dark canvas. Each master is resized to exactly 360×640 with Lanczos3 and placed in a 3×3 grid with 12 px gutters, 28 px label bars above each cell, and labels `S01` through `S09` only in those gutters. The masters are not edited in place.

## Verification

Image metadata check (Sharp):

```text
PASS S01.png 1080x1920 png 3ch
PASS S02.png 1080x1920 png 3ch
PASS S03.png 1080x1920 png 3ch
PASS S04.png 1080x1920 png 3ch
PASS S05.png 1080x1920 png 3ch
PASS S06.png 1080x1920 png 3ch
PASS S07.png 1080x1920 png 3ch
PASS S08.png 1080x1920 png 3ch
PASS S09.png 1080x1920 png 3ch
PASS 3x3-overview.png 1128x2052 png 3ch
```

Anchor validator command:

```powershell
.\video-pipeline\asset-library\scripts\validate-sea-above-file001.ps1 -Mode anchors
```

Result: expected-red at `Missing S01 prompt dependency: prompts/seedance-s01.md`. Prompt files are explicitly outside this Task 5 first-frame scope; no prompt file was created or modified here. The validator reaches the shot anchor stage after contract/manifest validation, and the required anchor declarations themselves remain unchanged.

`git diff --check` was run after report creation and must remain clean before the focused commit. No take/release validator was run as a completion gate because accepted videos, Seedance prompts, audio, and deliverables are intentionally not part of this task.

## Parent review notes

- S06 is the final frame-right memory orientation; S07 derives from that corrected S06 and preserves the same right-ear product continuity.
- The manifest's existing `overview.png` package declaration does not match the explicit requested `3x3-overview.png` filename. Parent should decide whether a later manifest-authority change or compatibility alias is warranted; this task intentionally did not touch the manifest.
- S08's nacre iris texture is deliberately subtle and remains normal human anatomy with no injury or glow.
