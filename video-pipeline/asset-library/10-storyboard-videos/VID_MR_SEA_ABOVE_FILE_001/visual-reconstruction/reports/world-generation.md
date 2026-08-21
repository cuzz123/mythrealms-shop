# World Candidate Generation — FILE 001

Date: 2026-08-21
Track: Task 3 — Five World-Scale Scene Candidates
Status: candidate-only; no scene is promoted to an accepted production path

## Method and input boundary

Each scene's initial candidate was generated with the built-in image generation tool, one call per distinct scene, with no image input. Scene 01, Scene 02, Scene 03 and Scene 05 then used their own current candidate/source as the positive input for documented single-target repairs; Scene 01 had one independent-review water-physics/Mother repair, Scene 02 had one sky-and-suction repair, Scene 03 had one jewelry-state repair, and Scene 05 had an earlier banner cleanup, one independent-review water-physics repair using its immediately preceding final, and a second independent-review water-physics repair using the pre-arc source recorded below after the arc repair was rejected. No old or rejected environment, first-frame, style-test, protagonist, or unrelated project raster image was supplied as a positive input. No CLI/API fallback, video generation, or paid generation was used.

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
- Pre-round1 final output: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-city-beneath-sea.png`
- Pre-round1 final SHA-256: `E3B44314DD700B297E36021791D84B0D25B88012128998F0D3FE14A85AF25468`
- Pre-round1 final metadata: PNG, 2560×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- Pre-round1 inspection evidence: full-horizon ocean underside; dense districts; civic clock tower; harbour and rail/road corridors; cranes and vessels; distant cliffs; rooftop foreground with tiny people; visible traffic/light points; long irregular ground-to-sky filaments. This is more than five independent scale cues and reads as a kilometre-scale city rather than one street. The centre corridor remained usable for a 9:16 crop.
- Rejected source: independent review round 1 rejected this pre-round1 final because long twisted filaments read as waterspout/tornado funnels and the Mother shadow was indistinct from the ocean wave texture. Repair prompt: none for the initial candidate; the targeted repair is recorded below.

### Portrait crop proof

- Derivation source: the pre-round1 Scene 01 final above; no second generation and no positive reference for the initial proof.
- Pre-round1 output: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-portrait-crop-test.png`
- Pre-round1 SHA-256: `AB348FF496CF8DDA51A3154E12E94A7742BDBBBCB171401CBD240B2326D59322`
- Pre-round1 metadata: PNG, 1080×1920, sRGB, 3 channels, 8-bit uchar, no alpha
- Pre-round1 inspection evidence: centre crop retains the overhead ocean, civic tower and dense city, harbour/river depth, multiple rising filaments, rooftop foreground and two tiny people; it was a useful 9:16 composition corridor before round1 repair.
- Rejected source: the pre-round1 Scene 01 final was superseded after independent review round 1; the replacement proof is recorded below.

### Independent review round 1 — targeted water-physics and Mother repair

Independent review rejected the pre-round1 Scene 01 final because its long twisted filaments read as waterspout/tornado funnels and the Mother shadow was too indistinct from the ocean wave texture. The following single edit used only that current Scene 01 candidate as the sole positive edit target; no other image was supplied.

#### Exact repair prompt

```text
Use case: precise-object-edit
Asset type: content-preserving epic ultra-wide live-action science-fiction disaster city-under-sea panorama
Input images: Image 1 is the sole edit target: the current Scene 01 candidate. Use no other image or reference.
Primary request: change only the overhead water-physics details and the abstract Mother pressure cue while preserving the exact city panorama. Replace every long twisted tornado-like or waterspout-like funnel with many smaller irregular tapered reverse-rain filaments and torn sheets whose LOWER origins are visibly attached to multiple real roads, rooftops, gutters, river edges and harbour surfaces; each filament must narrow, break and disappear upward into the overhead ocean. Reverse direction must read in the still from grounded origins to sky-sea, with no vortex rotation, funnel cone, splash crown, ordinary waterspout or conventional rain column. Add one broad, incomplete city-block-scale diffuse Mother shadow/pressure band inside the overhead ocean, crossing multiple city districts and visibly separable from wave texture as a soft moving pressure depression, but dissolving at both ends and containing no anatomy whatsoever.
Scene/backdrop: preserve the existing real British coastal city beneath an enormous kilometre-scale inverted ocean: exact clocktower and civic skyline, dense city blocks, harbour and river, road corridors with traffic, wet rooftop foreground, people/scale cues, ships, working cranes, distant cliffs and full-horizon water underside.
Style/medium: grounded live-action prestige science-fiction disaster photography with invisible VFX integration, ARRI Alexa 35 / fine 35 mm film character, natural wet materials, realistic atmospheric perspective, no concept-art or synthetic render look.
Composition/framing: preserve exact 14–18 mm rectilinear ultra-wide framing, full horizon, clocktower position, harbour/river geometry, road axes, rooftop foreground and the central crop-safe 9:16 corridor. Do not crop, stretch, reframe, mirror or symmetrize.
Lighting/mood: preserve storm-dark exposure, practical city and harbour warmth, transmitted underwater caustics, soft highlight roll-off and believable scale. The Mother pressure band is a broad low-contrast darkening/pressure distortion within the ocean, not a creature silhouette.
Materials/textures: wet slate and masonry, glass, roads, realistic traffic lights, rough harbour water, fine suspended sediment, torn translucent water filaments and physically coherent reflections.
Constraints: change only the water filaments/sheets and the single abstract pressure band; preserve all buildings, clocktower, roads, rooftops, people, ships, cranes, cliffs, city scale, ocean boundary, perspective, lighting and live-action realism. No text, logos or watermark.
Avoid: long twisted funnels, tornadoes, waterspouts, vortex rotation, funnel cones, perfect columns, splash crowns, downward ordinary rain, horizontal-only water, magic beams, glowing energy, particle soup, anatomy, eye, face, limb, tentacle, teeth, head, torso, complete silhouette, rounded creature outline, multiple shadow lobes, oil painting, matte painting, game concept art, glossy CGI, altered skyline, removed harbour, missing people, crop, stretch, mirror, watermark.
```

#### Repaired provenance and output

- Pre-repair final output rejected by independent review: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-city-beneath-sea.png`
- Pre-repair final SHA-256: `E3B44314DD700B297E36021791D84B0D25B88012128998F0D3FE14A85AF25468`
- Pre-repair final metadata: PNG, 2560×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- Repair source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-9eb00ea3-c026-4e97-a5d7-a5ed5e1aae04.png`
- Repair source SHA-256: `ACB48C9CE96CEC07F87752684FBF5B9E370F67A172ADDFFC97127A76B918F71C`
- Repair source metadata: PNG, 1928×815, sRGB, 3 channels, 8-bit uchar, no alpha
- Final output: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-city-beneath-sea.png`
- Final SHA-256: `ED50178C514FD0A970D2586DAA40A1C3662F6EAF3EAD1539447D396E138B003F`
- Final metadata: PNG, 2560×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- Portrait crop proof: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-portrait-crop-test.png`
- Portrait crop proof SHA-256: `D3F17599C0D188A57CF2420DAC93976E3943123F3109ACEA4D653D2908843204`
- Portrait crop metadata: PNG, 1080×1920, sRGB, 3 channels, 8-bit uchar, no alpha
- Inspection evidence: the full-resolution replacement preserves the clocktower, dense city/harbour, roads, rooftop foreground, ships, cranes, cliffs, people/scale cues, full-horizon ocean and crop-safe central corridor. Numerous smaller irregular filaments and torn sheets visibly attach to roads, roofs, gutters, river and harbour before narrowing/breaking upward; no long twisted funnel, vortex rotation, funnel cone, splash crown or conventional waterspout is visible. A broad incomplete low-contrast pressure band crosses multiple districts inside the ocean and dissolves at both ends without eye, face, limb, tentacle, teeth, head, torso or complete silhouette. The band remains a review risk because its separation from wave texture is subtle at overview scale.
- Rejected reason for prior final: independent review found waterspout-like long twisted funnels and an indistinct Mother shadow.

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

- Initial generated source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-dcaf23a7-8dc4-4450-aef2-9621b987adfe.png`
- Initial source SHA-256: `A03CB919CF303F1B58A381C5E58785E332EA43E30CA65FF1608C2138BE950B7F`
- Initial source metadata: PNG, 941×1672, sRGB, 3 channels, 8-bit uchar, no alpha
- Pre-repair final output: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-03-s01-street-hook.png`
- Pre-repair final SHA-256: `4593D17518ED3BF42E53EFD20F9DF17A91D0B4FCEAAF0F566AB7D98C6273A65B`
- Pre-repair final metadata: PNG, 1080×1920, sRGB, 3 channels, 8-bit uchar, no alpha
- Pre-repair inspection evidence: anonymous blonde stand-in was still and off-axis on the left third, layered adult crowds fled through foreground, midground and distance, and the right-foreground civilian held a pendant while chain contact with the neck remained ambiguous. Multiple irregular puddle/gutter filaments visibly originated on the paving and tapered upward into the enormous overhead sea.
- Rejected source: independent review round 1 rejected the pre-repair final because the right-foreground jewelry state did not unambiguously prove the necklace was already removed and held away from the neck; chain contact/hand-at-collar ambiguity remained. The targeted repair is recorded below.

### Independent review round 1 — targeted jewelry-state repair

Independent review rejected the pre-repair Scene 03 final for ambiguous necklace removal. The following strict single-variable edit used only the current Scene 03 candidate as the sole positive edit target; no other image was supplied.

#### Exact repair prompt

```text
Use case: precise-object-edit
Asset type: content-preserving vertical live-action science-fiction disaster street hook
Input images: Image 1 is the sole edit target: the current Scene 03 candidate. Use no other image or reference.
Primary request: change ONLY the right-foreground civilian's jewelry state. Her bare neck and collarbones must have absolutely no chain, necklace, pendant, bead or jewelry touching, crossing or encircling them. She must visibly hold the complete removed necklace/chain as one loose closed loop with its pendant in one extended hand, clearly suspended at least 20–30 cm away from her neck and chest. The loop and pendant must be fully visible, separated from clothing and skin; her other hand must also be away from her neck. The still must unambiguously read already removed and held away, not unfastening, touching collar, ear-covering or chain still attached.
Scene/backdrop: preserve the exact existing wet British coastal street beneath the enormous overhead ocean, historic buildings, cars, practical street lights, layered fleeing crowd, puddle/gutter suction and all ground-to-sky water behavior.
Subject: preserve the anonymous off-axis blonde adult stand-in on the left exactly; preserve the right-foreground civilian's identity, face, hair, clothing, body placement and expression except for the jewelry state and hand placement required above.
Style/medium: grounded live-action prestige science-fiction disaster photography with invisible VFX, natural wet skin/fabric, realistic hands and jewelry, no glossy CGI, no poster styling.
Composition/framing: preserve exact vertical 9:16 composition, camera perspective, crop, buildings, cars, fleeing crowd, overhead sea, street depth and lighting. Do not crop, stretch, reframe, mirror, add or remove people.
Lighting/mood: preserve existing storm-dark exposure, practical street warmth, wet reflections and transmitted underwater light.
Materials/textures: preserve rain-darkened coats, wet paving, realistic metal necklace and pendant, natural skin, hair and fingers.
Constraints: change only the right foreground civilian's necklace attachment/removal state and the minimum hand pose needed to display the complete loose loop away from the neck; no chain segment may remain on the neck or collarbone. Preserve every other pixel-level subject, action, composition, building, car, person, water filament and lighting invariant as far as possible. No text, logos or watermark.
Avoid: chain touching neck, chain encircling neck, partial necklace, unfastening gesture, hands at collar, hands covering ears or face, bead-string artifact, fused fingers, extra fingers, extra jewelry, duplicate pendant, hidden loop, floating jewelry, altered blonde stand-in, face drift, anatomy drift, changed crowd, changed buildings/cars, ordinary rain, glossy CGI, oil painting, matte painting, game concept art, crop, stretch, mirror, watermark.
```

#### Repaired provenance and output

- Pre-repair final output rejected by independent review: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-03-s01-street-hook.png`
- Pre-repair final SHA-256: `4593D17518ED3BF42E53EFD20F9DF17A91D0B4FCEAAF0F566AB7D98C6273A65B`
- Pre-repair final metadata: PNG, 1080×1920, sRGB, 3 channels, 8-bit uchar, no alpha
- Repair source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-3c89ba06-c3c7-4fc2-ae70-6073731921c4.png`
- Repair source SHA-256: `44252A57EDA443B6B8E229C1E681F10CD806460591F038EFCF010E03048B2A96`
- Repair source metadata: PNG, 941×1672, sRGB, 3 channels, 8-bit uchar, no alpha
- Final output: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-03-s01-street-hook.png`
- Final SHA-256: `B72AAFB5E8360E8CCD850E953DFD927778C8862354B446029FA59DC585E563DD`
- Final metadata: PNG, 1080×1920, sRGB, 3 channels, 8-bit uchar, no alpha
- Inspection evidence: the right-foreground civilian's neck and collarbones are bare with no chain contact; the complete closed necklace loop and pendant hang from one extended hand visibly away from the neck/chest, while the other hand is away from the neck. The anonymous off-axis blonde stand-in, fleeing crowd, buildings, cars, lighting, overhead ocean and ground-origin upward suction remain. No bead-string artifact, fused fingers, extra jewelry, duplicate pendant, face drift or anatomy drift was observed.
- Rejected reason for prior final: independent review found the necklace removal state ambiguous because chain contact and a hand-at-collar gesture could still be read as unfastening.

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

### Independent review round 1 — targeted water-physics repair

The independent review rejected the prior Scene 05 final for content, not framing: its vertical strands read predominantly as downward-hanging sediment and its harbour turbulence did not unmistakably show broad reverse flow originating at the harbour/river surface and connecting upward into the overhead sea. The prior final was retained as the sole positive edit target for one content-preserving repair; no other image was supplied.

#### Exact repair prompt

```text
Use case: precise-object-edit
Asset type: content-preserving epic ultra-wide live-action science-fiction disaster coastal panorama
Input images: Image 1 is the sole edit target: the current Scene 05 candidate. Use no other image or reference.
Primary request: change only the harbour and river water physics so reverse flow is unmistakable in this still frame. Create multiple broad, irregular, upward-curving water sheets rising directly from distinct visible harbour/river surface points around boats, quays and the working waterfront. Each sheet must have a clearly visible lower origin attached to the water surface, widen and fold as it lifts, break into irregular tapered filaments, and visibly narrow/rise into and connect with the underside of the enormous overhead ocean. Show at least three separate ground-to-sky suction paths with both bottom and top connections readable; use broad wet surfaces and broken edge strands, never narrow tornado funnels.
Scene/backdrop: preserve the existing wet British coastal city panorama exactly: dark layered cliff at left, working harbour and river, dense illuminated city skyline, civic towers, cranes, vessels, vehicles and tiny people, under the same kilometer-scale inverted ocean with depth, suspended sediment and transmitted underwater light.
Style/medium: grounded live-action prestige science-fiction disaster photography with invisible VFX, natural wet materials, physically coherent scale and light, ARRI Alexa 35 / fine 35 mm film character, restrained cyan only in motivated caustics.
Composition/framing: preserve the exact existing asymmetrical 14–18 mm rectilinear ultra-wide framing, coastline geometry, skyline positions, harbour layout, boats, cranes, road, vehicles and people. Do not crop, stretch, reframe, mirror or symmetrize.
Lighting/mood: preserve storm-dark exposure, practical harbour/city warmth, soft highlight roll-off and the existing believable atmospheric perspective. Remove the dominance of downward-hanging sediment curtains; the visible water motion must read upward from harbour/river to sky-sea without animation.
Materials/textures: real wet cliff rock and grass, slate/brick/limestone/steel, rough harbour water, translucent heavy sheets with foamless torn edges, droplets and suspended sediment integrated with the overhead sea.
Constraints: change only water behavior and the minimum local occlusion needed to make the upward attachments legible; preserve all existing cliffs, harbour/river, buildings, towers, cranes, boats, vehicles, people, ocean boundary, camera perspective, realism, scale and lighting. No text, logos or watermark.
Avoid: downward rain or sediment dominance, horizontal-only turbulence, ordinary vessel wakes as the main effect, ordinary waterspout funnels, narrow tornadoes, perfect columns, symmetric splash crowns, magical beams, glowing energy, particle soup, glossy CGI, oil painting, matte painting, game concept art, fantasy panorama, altered skyline, removed boats, duplicated buildings, new objects, crop, stretch, mirror, watermark.
```

#### Repaired provenance and output

- Pre-repair final output rejected by independent review: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-05-cliffs-harbour-ocean.png`
- Pre-repair final SHA-256: `6C1688E735492652C4CDCF22825ADA6FEF628175507D7E9E9B9FC1A43B7B1DCC`
- Pre-repair final metadata: PNG, 2560×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- Repair source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-5bfb9241-b553-474c-bc47-78a302e53a73.png`
- Repair source SHA-256: `4AA9D962BBB689B8230E6199EE6B1842466BAED90CD4FFEBF9DFEC7A6FCDA36B`
- Repair source metadata: PNG, 1928×815, sRGB, 3 channels, 8-bit uchar, no alpha
- Final output: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-05-cliffs-harbour-ocean.png`
- Final SHA-256: `473CD2AE4D52DCB72B1FA7DF9946012C3B00A618F4E3AAA4ADDECD82BEB86251`
- Final metadata: PNG, 2560×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- Inspection evidence: the repaired full-resolution still preserves the wet cliff, working harbour/river, dense city skyline, civic towers, cranes, vessels, road, vehicles, people, asymmetrical ultra-wide perspective and overhead ocean. Four broad irregular upward-curving water sheets have visible harbour/river origins around quays and boats, broken tapered filaments, and readable top connections into the sea underside; downward sediment curtains no longer dominate. The broad arcs are intentionally prominent for still-frame reverse-flow proof and remain a review risk for possible large water-wall/fountain interpretation, but no narrow tornado funnel, perfect column, magic beam, text, logo or watermark is visible.
- Rejected reason for prior final: independent review found downward-hanging sediment dominance and horizontal/ordinary harbour turbulence without unmistakable harbour-to-ocean reverse-flow paths.

### Independent review round 2 — anti-fountain water-physics repair

Independent review round 2 rejected the preceding Scene 05 water-physics repair because four smooth repeated near-parabolic arcs and bright splash bases read as conventional giant fountains. That arc-repair final and its source were not used as positive input for the replacement below. The replacement used only the pre-arc Scene 05 source recorded above, which preserves the approved cliffs, harbour, city, ships, cranes, vehicles, people, lighting and composition without inheriting the arc geometry.

The first round-2 result was self-rejected after full-resolution inspection: although it removed the parabolic arcs and bright crowns, several near-vertical paths still read as repeated fountain-like columns. It was not used as positive input for the final round-2 result. A second single-target edit again used only the pre-arc source.

#### Exact intermediate round-2 repair prompt (self-rejected)

```text
Use case: precise-object-edit
Asset type: content-preserving epic ultra-wide live-action science-fiction disaster coastal panorama
Input images: Image 1 is the sole edit target and positive reference: the pre-arc Scene 05 candidate with wet cliffs, harbour, dense city, ships, cranes, vehicles, people and overhead ocean. Do not use the current arc-repair image or any other image.
Primary request: change ONLY the water physics. Replace the existing downward sediment and turbulence with 6–9 non-repeating, ragged, torn, near-vertical water sheets and ribbons rising directly from varied harbour/river surface locations around boats and quays into the overhead ocean. Keep every path within about 15 degrees of vertical; vary widths, heights, spacing and interruption points. Shred each edge into droplets and broken strands; let some ribbons merge into the ocean underside. The still must prove upward suction through surface deformation, not trajectory: at every lower origin the harbour surface itself is visibly stretched upward into a concave dimple, trough or temporarily exposed dark depression, with no bright splash crown or foamy fountain base.
Scene/backdrop: preserve the exact pre-arc panorama: wet layered cliff at left, working harbour and river, dense illuminated coastal city skyline and civic tower, cranes, boats, road vehicles, tiny people, practical lights, asymmetrical coastline and the enormous sedimented overhead ocean.
Style/medium: grounded live-action prestige science-fiction disaster photography with invisible VFX, physically coherent water/light/scale, natural wet materials, ARRI Alexa 35 / fine 35 mm film character, restrained cyan caustics, no synthetic render look.
Composition/framing: preserve the exact asymmetrical 14–18 mm rectilinear ultra-wide composition, camera height, coastline, skyline, harbour layout, ships, cranes, roads, vehicles and people. Do not crop, stretch, reframe, mirror or symmetrize.
Lighting/mood: preserve storm-dark exposure, harbour/city warmth, atmospheric perspective and transmitted light through the overhead sea. Lower origins should be dark wet deformations with realistic reflections, not bright highlights.
Materials/textures: real wet cliff rock and grass, stone, steel, rough harbour water, translucent torn sheets, suspended sediment and small droplets integrated with the ocean underside.
Constraints: change only water behavior and minimum local occlusion needed to show the dark surface depressions; preserve every landscape, city, harbour, ship, crane, vehicle, person, light, camera and ocean invariant. No text, logos or watermark.
Avoid: parabolic arcs, fountain trajectories, symmetrical spacing, repeated arches, giant fountains, bright fountain bases, splash crowns, narrow tornado funnels, vortex rotation, perfect columns, ordinary waterspouts, ordinary vessel wakes as the main effect, magical beams, glowing energy, particle soup, glossy CGI, oil painting, matte painting, game concept art, altered skyline, removed boats, new objects, crop, stretch, mirror, watermark.
```

#### Exact final round-2 repair prompt

```text
Use case: precise-object-edit.
Asset type: content-preserving epic ultra-wide live-action science-fiction disaster coastal panorama.
Image 1 is the sole positive reference: the pre-arc Scene 05 panorama with wet cliff, working harbour, dense coastal city, civic tower, ships, cranes, vehicles, people and the immense overhead ocean. Do not use any arc-repair candidate or any other image as reference.

Change only the water physics. Preserve every cliff, building, tower, crane, ship, vehicle, person, practical light, road, harbour layout, camera position, asymmetrical coastline, overhead ocean and live-action exposure from Image 1.

Create exactly 6–8 NON-REPEATING, broad torn water SHEETS/CURTAINS rising from the harbour or river surface toward the overhead sea. They are thin, irregular translucent planes and shredded hanging ribbons, not discrete jets or columns: vary their widths dramatically, heights, gaps, translucency and interruption points; edges fray into scattered droplets; no two have matching shape or spacing. Keep each overall rise near vertical, no more than about 15 degrees from vertical, with no lateral trajectory. Some fragments should merge into the underside of the ocean; others should stop and break apart. Make the reverse flow read through the still image: at each lower origin the actual harbour surface is pulled upward into a long dark concave trough/dimple, like a wet sheet being peeled from the water, with a temporarily exposed dark depression and stretched ripples extending into it. The surface deformation must continue into the thin sheet. No white spray, no splash crown and no bright base.

Water appearance: dark heavy seawater, suspended sediment, realistic refraction, torn edges and gravity-broken droplets, integrated with the ocean underside. The sheets should feel like irregular reverse rain curtains, not water fountains. Use only a few broad sheets and many discontinuous fragments around them, leaving open water between them.

Style: grounded live-action prestige science-fiction disaster photography, invisible VFX, physically coherent scale/light/materials, wet rock/steel/stone and natural harbour reflections, restrained cyan caustics, ARRI Alexa 35 / fine 35 mm film character. No synthetic render look.

Composition: preserve the exact 14–18 mm rectilinear ultra-wide panorama and all landscape/city/harbour/ship/crane/vehicle/person details. Do not crop, stretch, reframe, mirror or symmetrize. No text, logos or watermark.

Strictly avoid: any fountain, jet, geyser, spout, splash base, splash crown, upright column, repeated vertical pillar, parabolic arc, arch, trajectory, waterspout, tornado funnel, vortex, water cannon, magical beam, glowing energy, particle soup, ordinary wake, glossy CGI, matte/concept/game art, altered skyline or missing objects.
```

#### Repaired provenance and output

- Arc-repair final rejected by independent review: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-05-cliffs-harbour-ocean.png`
- Arc-repair final SHA-256: `473CD2AE4D52DCB72B1FA7DF9946012C3B00A618F4E3AAA4ADDECD82BEB86251`
- Arc-repair final metadata: PNG, 2560×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- Arc-repair source not used as positive input: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-5bfb9241-b553-474c-bc47-78a302e53a73.png`
- Arc-repair source SHA-256: `4AA9D962BBB689B8230E6199EE6B1842466BAED90CD4FFEBF9DFEC7A6FCDA36B`
- Sole positive source for both round-2 attempts: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-a15bac1f-209f-4a32-9d23-4a4b871c8577.png`
- Sole positive source SHA-256: `C30DA046B2C8256561931585609D1E9229A0718EF170AECADBAAC1C5DF49D126`
- Sole positive source metadata: PNG, 1928×816, sRGB, 3 channels, 8-bit uchar, no alpha; this is the source associated with pre-arc final SHA-256 `6C1688E735492652C4CDCF22825ADA6FEF628175507D7E9E9B9FC1A43B7B1DCC`
- Intermediate round-2 source (self-rejected): `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-d99c9cea-6446-49f9-af72-def1975f8cae.png`
- Intermediate round-2 source SHA-256: `6298FF40EA24C29CD71417031F65C8EBF7B708789F170C5C5263D890B5B00F96`
- Intermediate round-2 source metadata: PNG, 1927×816, sRGB, 3 channels, 8-bit uchar, no alpha
- Intermediate round-2 normalized SHA-256: `973B10E4EB3D82D97CD8E964E35946970EF48A551FE666BAEDB312594A613D06`
- Intermediate rejection: full-resolution inspection found no parabolic arcs or bright crowns, but repeated near-vertical paths still read too much like fountain columns; it was discarded and never used as a positive input.
- Final round-2 repair source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-158c08fc-5ba0-4886-8916-2209b1d2e383.png`
- Final round-2 repair source SHA-256: `E6F8A794190292E5046904DE508FF178DAF9F11F874F4EA3A1C04EBE5EE5822A`
- Final round-2 repair source metadata: PNG, 1928×816, sRGB, 3 channels, 8-bit uchar, no alpha
- Final output: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-05-cliffs-harbour-ocean.png`
- Final SHA-256: `12AB7C54014E2217F103657879DF23BB12411ABCC897AB90414F7B4224B446D3`
- Final metadata: PNG, 2560×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- Inspection evidence: full-resolution inspection preserves the wet cliff and tiny people at left, working harbour and river, dense illuminated city skyline and civic tower, cranes, ships, road vehicles, practical lights, asymmetrical 14–18 mm composition and the full overhead ocean. The final water behavior is carried by 6–8 visibly non-repeating ragged near-vertical sheets/curtains plus broken fragments, with varied widths, interruptions and shredded droplet edges. Multiple lower origins show the harbour surface stretched into dark concave troughs/depressions with ripples pulled into them; some sheets merge into the ocean underside. No parabolic arc, repeated arch, bright splash crown/base, funnel, perfect column, ordinary wake, magical beam, glossy CGI, text or watermark is visible. Residual review risk: at some scales a few narrow fragments and dark deformations may still be interpreted as vertical suction columns, but the rejected smooth arcs and bright fountain bases are absent.
- Rejected reason for the arc version: independent review found four smooth repeated near-parabolic arcs and bright splash bases that read as conventional giant fountains; the arc image was explicitly excluded from the round-2 positive-input boundary.

## Deterministic overview

- Output: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/world-overview.png`
- SHA-256: `060E8F17CE7882665FE789EE7FA4C41BA4738D5FBEEFD73B092A3A30F15FB725`
- Metadata: PNG, 2560×1440, sRGB, 3 channels, 8-bit uchar, no alpha
- Construction: Sharp-created black RGB canvas; deterministic five-cell layout in `01`, `02`, `03` top row and `04`, `05` bottom row. White labels are confined to 64-pixel black top gutters; source masters are only composited into contained previews and remain unchanged.
- Inspection evidence: all labels are legible and outside image pixels; all five scenes are identifiable at overview scale, with the portrait street frame remaining visibly vertical.

## Rejection and repair ledger

Six targeted repairs are recorded. Scene 01 received one independent-review edit to replace waterspout-like funnels with grounded reverse-rain filaments and clarify the diffuse Mother pressure band. Scene 02 received one identity-preserving edit to replace ordinary storm sky/rain-like strings with a dark kilometre-wide inverted ocean and irregular grounded suction while preserving crowd/architecture/jewellery gestures. Scene 03 received one strict single-variable edit to make the removed necklace loop and bare neck unambiguous. Scene 05 received one identity-preserving edit to remove a letter-like cliff-top banner, one independent-review repair that was rejected for repeated fountain-like arcs, and a second independent-review repair using the pre-arc source to replace that geometry with ragged near-vertical suction curtains. All repair targets were the current scene candidate or immediately preceding final except the two round-2 Scene 05 attempts, which deliberately reused only the pre-arc source; no old rejected environment, first-frame, style-test, or protagonist image was used as a positive input. Existing rejected project images were not opened or supplied to generation.

## Output inventory

| Output | Contract dimensions | Channels | SHA-256 |
| --- | ---: | ---: | --- |
| `scene-01-city-beneath-sea.png` | 2560×1080 | 3 | `ED50178C514FD0A970D2586DAA40A1C3662F6EAF3EAD1539447D396E138B003F` |
| `scene-01-portrait-crop-test.png` | 1080×1920 | 3 | `D3F17599C0D188A57CF2420DAC93976E3943123F3109ACEA4D653D2908843204` |
| `scene-02-evacuation-square.png` | 1920×1080 | 3 | `18EB077D2A339E37D21E3828695A75BFACF92DC64FE938B834A05A202E0F280D` |
| `scene-03-s01-street-hook.png` | 1080×1920 | 3 | `B72AAFB5E8360E8CCD850E953DFD927778C8862354B446029FA59DC585E563DD` |
| `scene-04-rooftops-under-mother.png` | 1920×1080 | 3 | `9E06CBFBFA3C067436BD2E62C601A22CD1612504139DEEEE9739330BCE023490` |
| `scene-05-cliffs-harbour-ocean.png` | 2560×1080 | 3 | `12AB7C54014E2217F103657879DF23BB12411ABCC897AB90414F7B4224B446D3` |
| `world-overview.png` | 2560×1440 | 3 | `060E8F17CE7882665FE789EE7FA4C41BA4738D5FBEEFD73B092A3A30F15FB725` |
