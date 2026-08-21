# Task 3 Report — Five World-Scale Scene Candidates

Date: 2026-08-21  
Track owner: world candidate production  
Status: complete for Task 3; candidate-only namespace, pending independent review and user gate

## Owned files

- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-city-beneath-sea.png`
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-portrait-crop-test.png`
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-02-evacuation-square.png`
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-03-s01-street-hook.png`
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-04-rooftops-under-mother.png`
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-05-cliffs-harbour-ocean.png`
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/world-overview.png`
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reports/world-generation.md`
- `.superpowers/sdd/2026-08-21-the-sea-above-visual-reconstruction/task-3-report.md`

No character, accepted-character, accepted-environment, first-frame, director-card, video, contract, validator, or unrelated path was modified. The shared Git index was not staged or mutated.

## Generation and inspection result

Each scene's initial candidate was generated with the built-in image-generation tool, one call per scene and no image input. Scene 01, Scene 02, Scene 03 and Scene 05 then used their own current candidate/source as the positive input for documented single-target repairs; Scene 01 had one independent-review water-physics/Mother repair, Scene 02 had one sky-and-suction repair, Scene 03 had one jewelry-state repair, and Scene 05 had one earlier banner cleanup, one independent-review arc repair that was rejected, and a final independent-review water-physics repair using only the pre-arc source. Every generated source was inspected with `view_image` before normalization. Every final full-resolution output and the overview were inspected after Sharp processing.

- Scene 01: repaired after independent review rejected the prior final because long twisted filaments read as waterspout/tornado funnels and the Mother shadow was indistinct from ocean wave texture. The replacement preserves the ultra-wide city beneath a horizon-spanning ocean with dense districts, civic tower, harbour, rail/road corridors, cranes, vessels, distant cliffs, tiny people/traffic and a crop-safe central corridor. Smaller grounded reverse-rain filaments now attach to roads, roofs, gutters, river and harbour before breaking upward; a broad incomplete diffuse pressure band crosses multiple districts without anatomy. The new 9:16 crop proof retains ocean, city, harbour, rooftop and multiple scale cues. The pressure band remains a review risk at overview scale.
- Scene 02: repaired after parent visual-gate rejection of the pre-edit master. The pre-edit crowd/jewellery composition was preserved while one identity-preserving edit replaced ordinary storm sky/rain-like strings with a dark kilometre-wide inverted ocean and irregular grounded suction sheets. Several foreground and midground adults still visibly unfasten or hold pearl necklaces away from necks; no obvious duplicated faces, repeated extras, crowd smear, ordinary sky/rain, or hands-only-covering-ears gesture survived the repaired full-resolution inspection.
- Scene 03: repaired after independent review rejected the prior final because the right-foreground jewelry state did not unambiguously prove the necklace was already removed and held away from the neck. The strict single-variable repair preserves the anonymous off-axis blonde stand-in, fleeing crowd, buildings/cars/lighting, overhead ocean and ground-origin suction; the right foreground civilian now has a bare neck/collarbone and visibly holds a complete closed necklace loop with pendant at arm's length. No centred fashion pose, perfect column, splash crown, bead string, ordinary rain field, duplicated face pattern, or motion-dependent direction was observed; no accepted-character claim is made.
- Scene 04: accepted for this Task 3 candidate handoff. Fresh low 14–18 mm rooftop generation was inspected full-resolution: slate/brick roofs, chimneys, cranes, towers and antennas recede across city depth with tiny people on multiple left/right rooflines. Mother is only broad diffuse shadow/pressure distortion in the overhead ocean; no eye, face, limb, teeth, tentacle, anatomy, head, torso or complete silhouette is visible.
- Scene 05: the first water-physics repair was rejected in independent review because four smooth repeated near-parabolic arcs and bright splash bases read as conventional giant fountains. That arc image was not used as a positive reference. The replacement used only the pre-arc source and preserves the asymmetrical cliffs, working harbour/river, skyline, cranes, vessels, vehicles, people and deep overhead sea; non-repeating ragged near-vertical sheets/curtains now rise through dark harbour-surface troughs/depressions with broken edges and no parabolic arcs or bright fountain bases. Full-resolution inspection still flags a residual risk that a few narrow fragments may read as vertical suction columns.
- Overview: accepted. Deterministic 2560×1440 black RGB canvas with cells `01`–`05`; labels are confined to 64-pixel black top gutters and masters remain unchanged.

Scene 01 received one independent-review water-physics/Mother repair using its current Scene 01 candidate as the sole positive edit target. Scene 02 had one identity-preserving repair after the parent visual gate found ordinary storm sky and rain-like filaments; the sole positive edit target was its own newly generated Scene 02 candidate. Scene 03 received one strict single-variable jewelry-state repair using its current Scene 03 candidate as the sole positive edit target. Scene 05 first received one targeted repair for a small letter-like cliff-top banner, then an independent-review arc repair using the immediately preceding Scene 05 final that was rejected, followed by two controlled round-2 attempts using only the pre-arc source; the first round-2 result was self-rejected for residual fountain-like columns and the final round-2 result is recorded below. No old or rejected environment, first-frame, style-test, protagonist, or unrelated project image was used as a positive input.

## Scene 01 round 1 repair provenance

Independent review rejected the pre-round1 Scene 01 final because its long twisted filaments read as waterspout/tornado funnels and the Mother shadow was too indistinct from the ocean wave texture. The following exact single-target repair used only that current Scene 01 candidate as its positive edit target:

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

- Rejected pre-repair final SHA-256: `E3B44314DD700B297E36021791D84B0D25B88012128998F0D3FE14A85AF25468`; metadata: PNG, 2560×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- Repair source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-9eb00ea3-c026-4e97-a5d7-a5ed5e1aae04.png`
- Repair source SHA-256: `ACB48C9CE96CEC07F87752684FBF5B9E370F67A172ADDFFC97127A76B918F71C`; metadata: PNG, 1928×815, sRGB, 3 channels, 8-bit uchar, no alpha
- Repaired final SHA-256: `ED50178C514FD0A970D2586DAA40A1C3662F6EAF3EAD1539447D396E138B003F`; metadata: PNG, 2560×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- New portrait crop proof SHA-256: `D3F17599C0D188A57CF2420DAC93976E3943123F3109ACEA4D653D2908843204`; metadata: PNG, 1080×1920, sRGB, 3 channels, 8-bit uchar, no alpha
- Inspection: full-resolution master retains the exact city, harbour, clocktower, roads, rooftops, people/scale cues, ships, cranes, cliffs and central corridor. Smaller irregular filaments visibly attach to roads, roofs, gutters, river and harbour before narrowing/breaking upward; no long twisted funnel, vortex rotation, funnel cone or conventional waterspout remains. A broad incomplete diffuse pressure band crosses multiple districts without anatomy; its separation from wave texture remains a reviewer risk.

## Scene 03 round 1 repair provenance

Independent review rejected the pre-repair Scene 03 final because the right-foreground jewelry state did not unambiguously prove the necklace was already removed and held away from the neck. The following exact strict single-variable repair used only the current Scene 03 candidate as its positive edit target:

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

- Rejected pre-repair final SHA-256: `4593D17518ED3BF42E53EFD20F9DF17A91D0B4FCEAAF0F566AB7D98C6273A65B`; metadata: PNG, 1080×1920, sRGB, 3 channels, 8-bit uchar, no alpha
- Repair source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-3c89ba06-c3c7-4fc2-ae70-6073731921c4.png`
- Repair source SHA-256: `44252A57EDA443B6B8E229C1E681F10CD806460591F038EFCF010E03048B2A96`; metadata: PNG, 941×1672, sRGB, 3 channels, 8-bit uchar, no alpha
- Repaired final SHA-256: `B72AAFB5E8360E8CCD850E953DFD927778C8862354B446029FA59DC585E563DD`; metadata: PNG, 1080×1920, sRGB, 3 channels, 8-bit uchar, no alpha
- Inspection: right-foreground civilian has a bare neck/collarbone, complete closed necklace loop and pendant visibly held away in one extended hand, with the other hand away from the neck; blonde stand-in, crowd, architecture, cars, lighting, ocean and suction behavior remain. No chain contact, bead-string artifact, fused fingers, extra jewelry or duplicate pendant observed.

## Scene 05 round 1 repair provenance

Independent review rejected the prior Scene 05 final because its vertical strands read predominantly as downward-hanging sediment and its harbour turbulence did not unmistakably show broad reverse flow originating at the harbour/river surface and connecting upward into the overhead sea. The following exact single-target repair used only that immediately preceding Scene 05 final as its positive edit target:

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

- Rejected pre-repair final SHA-256: `6C1688E735492652C4CDCF22825ADA6FEF628175507D7E9E9B9FC1A43B7B1DCC`; metadata: PNG, 2560×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- Repair source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-5bfb9241-b553-474c-bc47-78a302e53a73.png`
- Repair source SHA-256: `4AA9D962BBB689B8230E6199EE6B1842466BAED90CD4FFEBF9DFEC7A6FCDA36B`; metadata: PNG, 1928×815, sRGB, 3 channels, 8-bit uchar, no alpha
- Repaired final SHA-256: `473CD2AE4D52DCB72B1FA7DF9946012C3B00A618F4E3AAA4ADDECD82BEB86251`; metadata: PNG, 2560×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- Inspection: four broad irregular upward-curving sheets visibly originate around quays/boats, break into tapered filaments and connect to the sea underside; cliffs, harbour, city, scale cues, vessels, cranes, vehicles, people, framing and live-action realism remain. The arcs remain a reviewer risk for possible large water-wall/fountain interpretation.

### Scene 05 round 2 repair provenance

Independent review round 2 rejected the preceding Scene 05 water-physics repair because four smooth repeated near-parabolic arcs and bright splash bases read as conventional giant fountains. The arc-repair image and its source were explicitly excluded from the positive-input boundary. The replacement used only the pre-arc Scene 05 source associated with the approved pre-arc final SHA-256 6C1688E735492652C4CDCF22825ADA6FEF628175507D7E9E9B9FC1A43B7B1DCC. The first round-2 result was self-rejected after full-resolution inspection because repeated near-vertical paths still read too much like fountain columns; it was not used as positive input.

The final round-2 edit used this exact prompt with the pre-arc source as its sole positive input:

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

- Rejected arc-repair final SHA-256: `473CD2AE4D52DCB72B1FA7DF9946012C3B00A618F4E3AAA4ADDECD82BEB86251`; metadata: PNG, 2560×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- Rejected arc-repair source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-5bfb9241-b553-474c-bc47-78a302e53a73.png`; SHA-256: `4AA9D962BBB689B8230E6199EE6B1842466BAED90CD4FFEBF9DFEC7A6FCDA36B`; metadata: PNG, 1928×815, sRGB, 3 channels, 8-bit uchar, no alpha
- Sole pre-arc positive source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-a15bac1f-209f-4a32-9d23-4a4b871c8577.png`; SHA-256: `C30DA046B2C8256561931585609D1E9229A0718EF170AECADBAAC1C5DF49D126`; metadata: PNG, 1928×816, sRGB, 3 channels, 8-bit uchar, no alpha
- Intermediate round-2 source self-rejected: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-d99c9cea-6446-49f9-af72-def1975f8cae.png`; SHA-256: `6298FF40EA24C29CD71417031F65C8EBF7B708789F170C5C5263D890B5B00F96`; metadata: PNG, 1927×816, sRGB, 3 channels, 8-bit uchar, no alpha; normalized rejected hash: `973B10E4EB3D82D97CD8E964E35946970EF48A551FE666BAEDB312594A613D06`
- Final round-2 source: `C:\Users\11458\.codex\generated_images\01a02344-d149-7241-b7c0-8f71c94ec11e\exec-158c08fc-5ba0-4886-8916-2209b1d2e383.png`; SHA-256: `E6F8A794190292E5046904DE508FF178DAF9F11F874F4EA3A1C04EBE5EE5822A`; metadata: PNG, 1928×816, sRGB, 3 channels, 8-bit uchar, no alpha
- Final output: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-05-cliffs-harbour-ocean.png`; SHA-256: `12AB7C54014E2217F103657879DF23BB12411ABCC897AB90414F7B4224B446D3`; metadata: PNG, 2560×1080, sRGB, 3 channels, 8-bit uchar, no alpha
- Inspection: full-resolution final preserves cliffs, harbour/river, dense city/civic tower, cranes, ships, vehicles, people, practical lights, asymmetrical 14–18 mm framing and overhead ocean. Six–eight visibly non-repeating ragged near-vertical sheets/curtains and broken fragments have varied widths and interruptions; multiple lower origins show dark concave harbour-surface troughs/depressions with stretched ripples, and some fragments merge into the ocean underside. No parabolic arcs, repeated arches, bright splash bases/crowns, funnels, perfect columns, magical beams, glossy CGI, text or watermark were observed. Residual risk: a few narrow fragments and dark deformations may still read as vertical suction columns at some scales.

## Final hashes

| File | Dimensions | Channels | SHA-256 |
| --- | ---: | ---: | --- |
| `scene-01-city-beneath-sea.png` | 2560×1080 | 3 | `ED50178C514FD0A970D2586DAA40A1C3662F6EAF3EAD1539447D396E138B003F` |
| `scene-01-portrait-crop-test.png` | 1080×1920 | 3 | `D3F17599C0D188A57CF2420DAC93976E3943123F3109ACEA4D653D2908843204` |
| `scene-02-evacuation-square.png` | 1920×1080 | 3 | `18EB077D2A339E37D21E3828695A75BFACF92DC64FE938B834A05A202E0F280D` |
| `scene-03-s01-street-hook.png` | 1080×1920 | 3 | `B72AAFB5E8360E8CCD850E953DFD927778C8862354B446029FA59DC585E563DD` |
| `scene-04-rooftops-under-mother.png` | 1920×1080 | 3 | `9E06CBFBFA3C067436BD2E62C601A22CD1612504139DEEEE9739330BCE023490` |
| `scene-05-cliffs-harbour-ocean.png` | 2560×1080 | 3 | `12AB7C54014E2217F103657879DF23BB12411ABCC897AB90414F7B4224B446D3` |
| `world-overview.png` | 2560×1440 | 3 | `060E8F17CE7882665FE789EE7FA4C41BA4738D5FBEEFD73B092A3A30F15FB725` |

Exact prompts, generated source paths, source hashes/metadata, final output hashes/metadata, inspection evidence, rejection ledger, and Sharp normalization details are recorded in `visual-reconstruction/reports/world-generation.md`.

## Verification

Command:

```powershell
pwsh -NoProfile -File video-pipeline/asset-library/scripts/validate-sea-above-visual-reconstruction.ps1
```

Result: exit code `1` as expected. All character and world images parsed and passed metadata checks. The only errors were the two independent-review reports not yet produced by Task 4:

```text
ERROR: reports/character-review.md — missing file
ERROR: reports/world-review.md — missing file
```

No JSON parse, path-resolution, or Sharp execution error occurred. `git diff --check` result: exit code `0`.

## Remaining concerns / parent review

- Independent visual review remains required by Task 4; the expected focused validator red is solely the missing `character-review.md` and `world-review.md` reports.
- Scene 01's smaller reverse-rain filaments are grounded and non-vortex, but the diffuse Mother pressure band remains subtle and may still blend with ocean wave texture at overview scale.
- Scene 03 blonde stand-in is intentionally anonymous and temporary; it must not be treated as the selected protagonist.
- The five world images remain candidate-only and must not be promoted until explicit user world approval.
