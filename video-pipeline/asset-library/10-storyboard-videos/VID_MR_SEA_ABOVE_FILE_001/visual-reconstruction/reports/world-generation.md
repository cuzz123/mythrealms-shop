# World Candidate Generation — FILE 001

Date: 2026-08-21
Track: Task 3 — Five World-Scale Scene Candidates
Status: candidate-only; no scene is promoted to an accepted production path

## Method and input boundary

All five masters were generated with the built-in image generation tool, one call per distinct scene, with no image inputs. The only positive inputs were the approved written world rules in the reconstruction design and Task 3 brief. No rejected environment, first-frame, style-test, protagonist, or other raster image was supplied as a positive reference. No CLI/API fallback, video generation, paid generation, or image repair was used.

The generated source files remain under `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e`. Final project outputs are under `visual-reconstruction/world/`. Sharp was used with `fit: "cover"`, `position: "centre"`, Lanczos resizing, sRGB conversion, alpha removal, and PNG output; no geometric stretching was used. Masters were inspected at full resolution before and after normalization.

## Scene 01 — City Beneath the Sea

### Exact generation prompt

```text
Use case: photorealistic-natural
Asset type: ultra-wide live-action science-fiction disaster establishing frame
Primary request: a populated British coastal city physically trapped beneath an ocean whose underside spans the entire horizon; the image must prove the phenomenon covers kilometres, not one street
Scene/backdrop: elevated civic rooftop looking across dense wet-stone districts, harbour, cathedral-scale civic landmarks, rail lines, cranes, distant cliffs and thousands of tiny scale references; multiple irregular water filaments rise from roads, roofs, river and harbour into the overhead ocean; one incomplete Mother shadow crosses several districts with no anatomy
Style/medium: grounded live-action production still with invisible VFX integration, ARRI Alexa 35 / fine 35 mm film character, no named-film imitation
Composition/framing: 14–18 mm rectilinear ultra-wide, strong foreground rooftop scale, layered city depth, horizon-spanning ocean, asymmetrical districts, crop-safe central vertical corridor
Lighting/mood: natural storm overcast transmitted through kilometres of water, restrained cyan only in motivated caustics, practical city warmth, soft highlight roll-off, realistic aerial perspective
Materials/textures: real wet slate, limestone, brick, glass, steel, mist and sea sediment
Constraints: physically coherent perspective and light; no complete creature; no text/logos; irregular ground-to-sky water motion; populated city
Avoid: oil painting, matte painting, game concept art, swimming-pool ceiling, flat water texture, glossy CGI, perfect symmetry, empty city, fantasy castle, magic beams, particle soup, duplicated buildings, multiple suns
```

### Provenance and output

- Generated source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-e4edd9b0-2c9e-40cf-b194-061cf7f5d1ec.png`
- Source SHA-256: `552F878834A24F6657A40CF561FA1C500173626B6CE779DB9C31C7ADE1BA0D0C`
- Source metadata: PNG, 1536×1024, sRGB, 3 channels, 8-bit uchar, no alpha
- Final output: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-city-beneath-sea.png`
- Final SHA-256: `E3B44314DD700B297E36021791D84B0D25B88012128998F0D3FE14A85AF25468`
- Final metadata: PNG, 2560×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- Inspection evidence: full-horizon ocean underside; dense districts; civic clock tower; harbour and rail/road corridors; cranes and vessels; distant cliffs; rooftop foreground with tiny people; visible traffic/light points; numerous irregular ground-to-sky filaments. This is more than five independent scale cues and reads as a kilometre-scale city rather than one street. The centre corridor remains usable for a later 9:16 crop.
- Rejected source: none. Repair prompt: none.

### Portrait crop proof

- Derivation source: the same Scene 01 generated source above; no second generation and no positive reference.
- Output: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-portrait-crop-test.png`
- SHA-256: `AB348FF496CF8DDA51A3154E12E94A7742BDBBBCB171401CBD240B2326D59322`
- Metadata: PNG, 1080×1920, sRGB, 3 channels, 8-bit uchar, no alpha
- Inspection evidence: centre crop retains the overhead ocean, civic tower and dense city, harbour/river depth, multiple rising filaments, rooftop foreground and two tiny people; it is a useful 9:16 composition corridor.
- Rejected source: none. Repair prompt: none.

## Scene 02 — Evacuation Square

### Exact generation prompt

```text
Use case: photorealistic-natural
Asset type: live-action science-fiction disaster crowd production still
Primary request: a monumental British civic square during an organised panic; hundreds of individually varied adults remove pearls and jewellery while fleeing across wet paving; at least several foreground and midground adults must visibly hold removed necklaces, pearl strands, earrings, or bracelets away from their necks and bodies; water pulls upward from fountain basins, gutters, umbrellas and coats in irregular tapered filaments with visible suction origins; buses, statues, civic steps and surrounding towers establish scale; 18 mm lens from low shoulder height; no protagonist focal portrait
Scene/backdrop: a real rain-soaked British civic square with monumental stone steps, fountain basins, buses, statues and surrounding towers; layered foreground, midground and background crowd with hundreds of individually varied adults, distinct faces, hair, ages, body types and rainwear
Style/medium: grounded live-action production still with invisible VFX integration, ARRI Alexa 35 / fine 35 mm film character, no named-film imitation, realistic pores, wet fabric, natural anatomy and believable motion
Composition/framing: low shoulder-height 18 mm wide view, asymmetrical crowd flow with readable hands at several distances; multiple people in the foreground and middle distance visibly unfasten necklaces or hold removed pearls/jewellery away from the neck; upward filaments must show their pavement, fountain, gutter, umbrella or coat origins and taper toward the overhead sea
Lighting/mood: natural storm overcast with restrained cyan only in motivated caustics, practical civic and bus lights, soft highlight roll-off, realistic aerial perspective; no ordinary downward rain field
Materials/textures: wet limestone paving, rain-darkened coats, wool, umbrellas, tarnished bus paint, stone and glass
Constraints: physically coherent perspective and light; no text/logos; reverse ground-to-sky water motion readable in a still frame; hundreds of individually varied adults; explicitly visible pearl and jewellery removal by several foreground/midground people; no protagonist focal portrait
Avoid: repeated extras, duplicated faces, cloned people, crowd smearing, ordinary downward rain, hands merely covering ears, hands covering faces, ambiguous jewellery gestures, perfect water columns, splash crowns, oil painting, matte painting, game concept art, glossy CGI, perfect symmetry, empty square, fantasy architecture, magic beams, particle soup, readable signage, logos, watermark
```

### Targeted identity-preserving repair prompt

The parent visual gate rejected the pre-edit candidate because its upper environment read as ordinary storm clouds/sky and its vertical filaments were too uniform and rain-like. The following single edit used only the newly generated Scene 02 candidate as the positive edit target:

```text
Use case: precise-object-edit
Asset type: identity-preserving live-action science-fiction disaster crowd frame
Primary request: edit only the upper environment and water behavior of this current Scene 02 candidate. Replace the visible storm-cloud sky with the unmistakable underside of a dark kilometre-wide ocean spanning the entire civic square and full horizon: a deep, heavy inverted sea with a readable distant boundary, layered depth, suspended sediment, broad transmitted light fields and physically coherent caustics. No ordinary sky or storm cloud should remain in the upper environment.
Input images: Image 1: current Scene 02 master, used as the sole positive edit target
Composition/framing: preserve the exact existing 18 mm low-shoulder composition and camera position. Preserve every crowd member, face, age, hair, body, wardrobe, hand, necklace, pearl strand, bus, statue, civic building, column, fountain, tree, wet paving tile and horizon landmark exactly as much as possible.
Water behavior: replace the uniform rain-like strings with irregular tapered suction filaments and rising sheets that visibly originate from fountain basins, gutters, wet paving, umbrellas and coats; each has a grounded suction source and a broad upward mass/downward tail leading to the overhead sea; no perfect columns, no bead chains, no splash crowns, no ordinary falling rain.
Lighting/mood: keep live-action prestige disaster photography, realistic pores and wet materials, but add coherent dark-ocean occlusion and soft cyan/white caustic light transmitted through kilometres of water; retain practical civic warmth and natural exposure.
Constraints: identity/content-preserving edit; change only upper sky/ocean and the water-flow effects; preserve crowd composition and all jewellery-removal gestures; at least several foreground and midground adults must still visibly hold removed necklaces or pearls away from their necks; preserve varied faces and extras without duplication; no protagonist focal portrait; no text, signage, logos or watermark.
Avoid: ordinary storm clouds, ordinary rain, uniform rain strings, repeated faces, cloned extras, crowd smear, altered jewelry gestures, changed architecture, swimming-pool ceiling, flat water texture, glossy CGI, oil painting, matte painting, game concept art, magic beams, particle soup, perfect symmetry, new characters, crop, stretch
```

### Provenance and output

- Pre-edit generated source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-93b6153d-fff5-48de-b188-97583f4293a5.png`
- Pre-edit source SHA-256: `7108A6D0EBCC08165EE75611D20625AFBDB6281F8BBA99BCEBE1B81C43D41DD6`
- Pre-edit source metadata: PNG, 1536×1024, sRGB, 3 channels, 8-bit uchar, no alpha
- Edited generated source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-e754944d-a78d-463f-9817-b2f95c2a37d6.png`
- Edited source SHA-256: `0C554BDAB54B8B5F08F1E40953598B6F521F9C817D1393B0807FF059C16FEBFC`
- Edited source metadata: PNG, 1672×941, sRGB, 3 channels, 8-bit uchar, no alpha
- Final output: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-02-evacuation-square.png`
- Final SHA-256: `18EB077D2A339E37D21E3828695A75BFACF92DC64FE938B834A05A202E0F280D`
- Final metadata: PNG, 1920×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- Inspection evidence: the upper half is now an unmistakable dark inverted ocean with a continuous kilometre-wide underside, deep rolling water, suspended sediment and transmitted caustic light; irregular branching suction sheets visibly rise from fountains, wet paving and crowd-level water sources rather than reading as a uniform rain field. The existing varied foreground/midground crowd remains, with several people holding pearl necklaces away from their necks; buses, statues, civic steps and towers remain legible. Full-resolution inspection found no obvious duplicated faces, cloned extras, crowd smear, ordinary storm sky, ordinary rain, or hands-only-covering-ears gesture.
- Original rejected reason: the pre-edit master was rejected by the parent visual gate because its upper environment read as ordinary storm clouds/sky and many vertical filaments read as uniform rain.
- Repair prompt: the exact single edit prompt is recorded above; no additional generation or edit was used.

## Scene 03 — S01 Street Hook

### Exact generation prompt

```text
Use case: photorealistic-natural
Asset type: vertical live-action science-fiction disaster street hook frame
Primary request: a vertical 9:16 live-action street frame, 28–35 mm observational lens, a temporary anonymous blonde adult stand-in positioned off-axis and still while layered crowds flee; the stand-in is not Candidate A, B, or C and is not a casting decision; one foreground civilian clearly holds removed jewellery away from the neck; multiple small puddle and gutter filaments pull upward with visible ground suction origins and downward tails; overhead sea enormous but naturally integrated
Scene/backdrop: a real wet British coastal street beneath an enormous distant overhead sea, historic stone shopfronts and masonry softened by storm haze, layered moving crowds at several depths, practical street and vehicle lights, no fantasy environment
Style/medium: grounded live-action production still with invisible VFX integration, ARRI Alexa 35 / fine 35 mm film character, no named-film imitation, observational documentary realism, natural pores and wet materials
Composition/framing: exact vertical 9:16 composition; 28–35 mm observational lens; anonymous blonde adult stand-in placed on the left third and off-axis, still and observational rather than posing; layered fleeing adults fill foreground, midground and distance; a separate foreground civilian clearly holds a removed necklace or earrings away from the neck; several puddle and gutter suction origins are visible on the paving with irregular filaments tapering upward into the enormous sea and visibly downward tails below their rising mass
Lighting/mood: natural storm overcast transmitted through kilometres of water, practical shop and vehicle warmth, restrained cyan only in motivated caustics, soft highlight roll-off, believable exposure and atmospheric depth; no ordinary downward rain field
Materials/textures: wet paving, rain-darkened coats, wool, umbrellas, oxidised metal, glass, skin and damp blonde strands
Constraints: physically coherent perspective and light; still frame must make upward direction immediately readable; no text/logos; stand-in is anonymous, temporary and not a casting decision; no jewelry on stand-in; preserve varied adult faces and extras; no protagonist focal portrait
Avoid: centred fashion posing, perfect water columns, splash crowns, bead strings, motion ambiguity, ordinary downward rain, repeated faces, cloned extras, crowd smearing, oil painting, matte painting, game concept art, glossy CGI, AI poster styling, magic beams, particle soup, readable signage, logos, watermark
```

### Provenance and output

- Generated source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-dcaf23a7-8dc4-4450-aef2-9621b987adfe.png`
- Source SHA-256: `A03CB919CF303F1B58A381C5E58785E332EA43E30CA65FF1608C2138BE950B7F`
- Source metadata: PNG, 941×1672, sRGB, 3 channels, 8-bit uchar, no alpha
- Final output: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-03-s01-street-hook.png`
- Final SHA-256: `4593D17518ED3BF42E53EFD20F9DF17A91D0B4FCEAAF0F566AB7D98C6273A65B`
- Final metadata: PNG, 1080×1920, sRGB, 3 channels, 8-bit uchar, no alpha
- Inspection evidence: anonymous blonde stand-in is still and off-axis on the left third, with face withheld and no casting claim; layered adult crowds flee through foreground, midground and distance; a separate right-foreground civilian clearly holds a removed pendant necklace away from the neck; multiple irregular puddle/gutter filaments visibly originate on the paving and taper upward into the enormous overhead sea, with grounded lower tails and suction sources readable in the still. No centred fashion pose, perfect water column, splash crown, bead string, ordinary rain field, readable signage, duplicated face pattern, or motion-dependent direction was observed.
- Rejected source: none. Repair prompt: none.

## Scene 04 — Rooftops Under the Mother

### Exact generation prompt

```text
Use case: photorealistic-natural
Asset type: ultra-wide live-action science-fiction disaster rooftop dread frame
Primary request: a low 14–18 mm view across real British rooftops, chimneys, cranes, towers and antennae; an impossible city-block-scale moving shadow and pressure distortion crosses the overhead ocean; tiny people on several rooftops provide scale; the Mother exists only as an abstract moving shadow and pressure distortion in the overhead sea, with no eye, face, limb, teeth, tentacle, anatomy or complete silhouette
Scene/backdrop: dense real British coastal city rooftops in storm rain, slate roofs, brick chimneys, cranes, church towers, aerials and antennae receding through atmospheric distance beneath an immense dark overhead ocean with depth, suspended sediment and broad transmitted light fields
Style/medium: grounded live-action production still with invisible VFX integration, ARRI Alexa 35 / fine 35 mm film character, no named-film imitation, realistic wet surfaces, natural film grain and physically coherent aerial perspective
Composition/framing: low 14–18 mm rectilinear ultra-wide rooftop perspective, layered foreground roofs and tiny people visibly distributed on several rooflines and terraces; asymmetrical city depth; the Mother is represented only by one or more broad city-block-scale moving shadow gradients and pressure distortion in the underside of the ocean, never a body or silhouette; no central vanishing-point symmetry
Lighting/mood: natural storm overcast transmitted through kilometres of water, restrained cyan only in motivated caustics, practical windows and roof lights, soft highlight roll-off, dread through scale and absence
Materials/textures: wet slate, aged brick, limestone, steel cranes, glass, mist, sea sediment and realistic atmospheric perspective
Constraints: physically coherent perspective and light; no text/logos; no creature anatomy whatsoever; no eye, face, limb, teeth, tentacle, complete silhouette, head, torso or recognizable body contour; people remain tiny scale references; any pressure distortion remains diffuse, abstract and embedded in the overhead ocean
Avoid: anatomy, eye, face, limb, teeth, tentacle, head, torso, complete silhouette, recognizable creature, oil painting, matte painting, game concept art, glossy CGI, perfect symmetry, empty rooftops, fantasy castle, magic beams, particle soup, repeated buildings, repeated people, readable signage, logos, watermark
```

### Provenance and output

- Generated source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-f64ad24f-74ae-413f-86a0-7b814edabeb2.png`
- Source SHA-256: `3AE26CA1E418CDFD84A740199C27E395DBCA3F6165F64D9A42647ACAF2037A2C`
- Source metadata: PNG, 1536×1024, sRGB, 3 channels, 8-bit uchar, no alpha
- Final output: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-04-rooftops-under-mother.png`
- Final SHA-256: `9E06CBFBFA3C067436BD2E62C601A22CD1612504139DEEEE9739330BCE023490`
- Final metadata: PNG, 1920×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- Inspection evidence: low ultra-wide rooftop view exposes layered slate roofs, chimneys, cranes, towers, antennas and tiny people distributed across both left and right rooflines/terraces. The Mother reads only as broad diffuse dark shadow gradients and pressure distortion embedded in the ocean underside; no eye, face, limb, teeth, tentacle, head, torso, anatomy, or complete silhouette is visible.
- Rejected source: none. Repair prompt: none.

## Scene 05 — Cliffs, Harbour, and Vertical Ocean

### Exact generation prompt

```text
Use case: photorealistic-natural
Asset type: epic ultra-wide live-action science-fiction disaster coastal panorama
Primary request: an epic coastal panorama containing wet cliffs, working harbour, dense city skyline and the overhead ocean in one coherent frame; harbour and river water rises in broad irregular sheets and filaments, revealing the vertical relationship between ground and sky-sea; tiny vessels, vehicles and people provide scale; 14–18 mm rectilinear ultra-wide, asymmetrical coastline
Scene/backdrop: a real British coastal city and harbour viewed from a high cliff road; wet layered cliffs in the foreground, working harbour and river, dense city skyline with civic towers and cranes, open horizon beneath an immense overhead ocean with depth, suspended sediment and broad underwater light fields
Style/medium: grounded live-action production still with invisible VFX integration, ARRI Alexa 35 / fine 35 mm film character, no named-film imitation, realistic aerial perspective and subtle organic film grain
Composition/framing: 14–18 mm rectilinear ultra-wide; asymmetrical coastline, strong foreground cliff edge and road, harbour and river crossing the middle distance, dense skyline and overhead sea filling the full horizon; tiny vessels, vehicles, people and birds provide scale
Lighting/mood: natural storm overcast transmitted through kilometres of water, restrained cyan only in motivated caustics, practical harbour and city warmth, soft highlight roll-off, weathered disaster realism
Materials/textures: wet rock and grass, dark sea cliffs, limestone, brick, glass, steel cranes, harbour water, mist, sea sediment
Constraints: physically coherent perspective and light; no complete creature; no text/logos; harbour and river water rises in broad irregular sheets and filaments; visible vertical relationship between ground, city and sky-sea; populated coastline
Avoid: oil painting, matte painting, game concept art, swimming-pool ceiling, flat water texture, glossy CGI, perfect symmetry, empty coastline, fantasy castle, magic beams, particle soup, duplicated buildings, multiple suns, readable signage, logos, watermark
```

### Provenance and output

- Initial generated source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-175d65c8-ba4f-4d6c-bcc1-ae8e56ea1b4a.png`
- Initial source SHA-256: `FC818F9717FBEA80EF9628EFC655319DD0D6256E0EE9C16D241BBE59FDD76766`
- Initial source metadata: PNG, 1672×941, sRGB, 3 channels, 8-bit uchar, no alpha
- Targeted repair source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-a15bac1f-209f-4a32-9d23-4a4b871c8577.png`
- Repair source SHA-256: `C30DA046B2C8256561931585609D1E9229A0718EF170AECADBAAC1C5DF49D126`
- Repair source metadata: PNG, 1928×816, sRGB, 3 channels, 8-bit uchar, no alpha
- Final output: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-05-cliffs-harbour-ocean.png`
- Final SHA-256: `6C1688E735492652C4CDCF22825ADA6FEF628175507D7E9E9B9FC1A43B7B1DCC`
- Final metadata: PNG, 2560×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- Inspection evidence: true ultra-wide asymmetric coastline; wet cliff foreground with people; road vehicles; working harbour with numerous vessels and cranes; dense skyline with civic towers; broad rising harbour/river sheets and filaments; overhead ocean depth and sediment/light fields. The ground-to-sky relationship and at least five world-scale cues read in one still. The repaired final was re-inspected at full resolution and contains no cliff-top banner, letter-like marks, text, logo, or watermark.
- Rejected source: the initial Scene 05 candidate was not rejected for world composition; it received one targeted repair solely because a small far-left cliff-top banner contained letter-like generated marks. Repair prompt: `Use case: precise-object-edit; Asset type: repaired ultra-wide live-action science-fiction disaster coastal panorama; Primary request: edit this newly generated Scene 05 image by removing only the small banner/sign and all letter-like marks at the far-left cliff-top edge; seamlessly continue the wet cliff, mist, distant atmosphere and tiny people so there is no sign, text, logo, watermark or artificial patch; Input images: Image 1: edit target, the newly generated Scene 05 candidate; no other references; Constraints: change only the far-left cliff-top banner/sign and letter-like marks; preserve the exact existing composition, perspective, framing, wet cliffs, harbour, river, city skyline, cranes, vessels, vehicles, people, overhead ocean, rising sheets and filaments, lighting, colour, scale and realistic live-action photographic texture; no new objects; no text or logos anywhere; Avoid: generated signage, readable writing, logos, watermarks, painting, matte painting, glossy CGI, altered coastline, changed skyline, changed water, changed people, extra detail, crop, stretch.`

## Deterministic overview

- Output: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/world-overview.png`
- SHA-256: `B507A4F2257903BDF93F6D6C76E62AFECE515E3BA4941D1CC25B494CA36A76B3`
- Metadata: PNG, 2560×1440, sRGB, 3 channels, 8-bit uchar, no alpha
- Construction: Sharp-created black RGB canvas; deterministic five-cell layout in `01`, `02`, `03` top row and `04`, `05` bottom row. White labels are confined to 64-pixel black top gutters; source masters are only composited into contained previews and remain unchanged.
- Inspection evidence: all labels are legible and outside image pixels; all five scenes are identifiable at overview scale, with the portrait street frame remaining visibly vertical.

## Rejection and repair ledger

Two targeted repairs are recorded. Scene 02 received one identity-preserving edit to replace ordinary storm sky/rain-like strings with a dark kilometre-wide inverted ocean and irregular grounded suction while preserving crowd/architecture/jewellery gestures. Scene 05 received one identity-preserving edit to remove a letter-like cliff-top banner while preserving world-scale content. Both repair targets were newly generated candidates, not old or rejected assets. Existing rejected environment, first-frame, style-test, and protagonist images were not opened or supplied to generation.

## Output inventory

| Output | Contract dimensions | Channels | SHA-256 |
| --- | ---: | ---: | --- |
| `scene-01-city-beneath-sea.png` | 2560×1080 | 3 | `E3B44314DD700B297E36021791D84B0D25B88012128998F0D3FE14A85AF25468` |
| `scene-01-portrait-crop-test.png` | 1080×1920 | 3 | `AB348FF496CF8DDA51A3154E12E94A7742BDBBBCB171401CBD240B2326D59322` |
| `scene-02-evacuation-square.png` | 1920×1080 | 3 | `18EB077D2A339E37D21E3828695A75BFACF92DC64FE938B834A05A202E0F280D` |
| `scene-03-s01-street-hook.png` | 1080×1920 | 3 | `4593D17518ED3BF42E53EFD20F9DF17A91D0B4FCEAAF0F566AB7D98C6273A65B` |
| `scene-04-rooftops-under-mother.png` | 1920×1080 | 3 | `9E06CBFBFA3C067436BD2E62C601A22CD1612504139DEEEE9739330BCE023490` |
| `scene-05-cliffs-harbour-ocean.png` | 2560×1080 | 3 | `6C1688E735492652C4CDCF22825ADA6FEF628175507D7E9E9B9FC1A43B7B1DCC` |
| `world-overview.png` | 2560×1440 | 3 | `B507A4F2257903BDF93F6D6C76E62AFECE515E3BA4941D1CC25B494CA36A76B3` |
