# Sea Above first-frame v1 generation — Task 2

Date: 2026-08-21 (Asia/Shanghai)
Base commit: `954771dc3fc20646b82e82253c39021c61577bee`
Generator: built-in `image_gen` only; one generation call per distinct frame; no CLI/API fallback.
Master contract: 2160×3840 PNG, RGB (3 channels), sRGB, no stretching.

The generated source files remain in the Codex generated-images directory. Each accepted project master was produced with `sharp` using aspect-preserving `resize({ width: 2160, height: 3840, fit: 'cover', position: 'centre' })`, `toColourspace('srgb')`, `removeAlpha()`, and PNG output. The source aspect ratio was already near 9:16, so the cover operation removes only the minimal edge difference and does not stretch geometry.

## S01

Reference roles: Candidate B is the identity and fixed-wardrobe reference; approved Scene 03 is the present-day wet British-city, fleeing-crowd, and reverse-water world reference.

Positive references:
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/candidate-b-dangerous-curiosity.png` — identity, pale-gold wet blonde hair, vivid blue eyes, cream camisole, cream structured high-waisted short skirt, and white practical flats. SHA-256: `2CA5B608255BD2BE4DB3701CFFDA4EF4C5BA407F9CB85C7325ED37D84DF966F9`.
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-03-s01-street-hook.png` — approved wet-stone British-city street, fleeing crowd, and reverse-water geography. SHA-256: `B72AAFB5E8360E8CCD850E953DFD927778C8862354B446029FA59DC585E563DD`.

Negative-history exclusions:
- `first-frames/S01.png` and every other legacy first-frame image.
- `05-characters/CHAR_MR_TIDE_ARCHIVIST_001/` and all old character assets.
- `03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001/` and all old environment assets.
- `08-fx/FX_MR_REVERSE_RAIN_001/` and all old FX assets.
- `v1/continuity/memory-pair-v1.png` and the old memory pair.

Generated source path: `C:/Users/11458/.codex/generated_images/01a02500-ccb6-7f91-b31e-c2898be18672/exec-35016712-e3ef-43b4-a2df-71ad51dbd95f.png`
Generated source metadata: PNG, 941×1672, 3 channels, sRGB, no alpha. Generated source SHA-256: `886114B18C3CA634E350DF4B048562DA051F865DAA4D5DFFD67C5CDC14AA2CC7`.
Rejected candidate output path: `visual-reconstruction/first-frames/v1/S01.png`
Rejected candidate output metadata: PNG, 2160×3840, 3 channels/RGB, sRGB, no alpha. SHA-256: `4966E7EE0933627F59C8B90DB2D5BF19251D62045BB4B40DF3C573F308F7D179`.

Original visual inspection: rejected by independent review. The full source and normalized master were inspected with `view_image`; a 270×480 thumbnail was also inspected. Candidate B, the cream outfit, wet stone, fleeing crowd, and street-origin reverse water were strong, but the approved overhead ocean was not readable: the sky read as storm clouds. Foreground crowd gestures mostly read as covering ears rather than removing jewellery and holding it away from the body. No generated text, logo, or watermark was present.

Original rejection reason: overhead ocean boundary not readable; at least one foreground adult did not clearly hold removed jewellery away from their body; crowd gestures were ambiguous.
Targeted repairs: Repair 1 adds one concrete world/prop-gesture change — make the overhead sea occupy the upper sky with a visible water boundary, and make a foreground civilian visibly hold a removed pendant away from their body — while preserving Candidate B, the fixed cream outfit, street geography, and reverse-water origins. The rejected source and master were preserved as evidence above and were not used as positive inputs for the repair.

Exact prompt:
```text
Use case: photorealistic-natural
Asset type: vertical live-action first frame for a 9:16 story video, shot S01 present-day hook
Input images: Image 1: identity and fixed wardrobe reference for the same fictional adult Candidate B; Image 2: approved present-day British-city wet-street and reverse-water world reference. Use both as positive references, never as literal image copies.
Scene/backdrop: a real wet stone street in a present-day British city at natural storm-light dusk, old stone tenements and shopfronts receding behind a broad street, reflective puddles and gutters, a fleeing crowd moving through the depth of frame. Several civilians in wet coats are visibly removing earrings or necklaces as the jewellery is pulled upward toward the sea.
Subject: the same fictional adult Candidate B identity, pale-gold wet blonde hair in clumps, vivid blue eyes, natural skin texture, cream camisole, cream structured high-waisted short skirt, white practical flats. She stands off-axis and still as an observant witness, slightly turned toward the impossible water, braced and alert, never a fashion pose; keep her face and body natural and consistent with Candidate B.
Composition/framing: observational live-action camera, vertical 9:16, 28–35 mm lens, medium-wide full-body framing, heroine placed off-centre with asymmetrical negative space and crowd depth. Make reverse gravity unmistakable even at a 270x480 thumbnail: multiple irregular translucent water filaments visibly originate at separate ground points — puddles, gutter mouths, and wet coat hems — and travel upward in broken streams toward the distant sea/horizon. Each filament has a clear lower ground origin and rising direction, with droplets climbing upward and no rain streaks falling from above.
Lighting/mood: real natural storm light, cool slate and sea-green sky with restrained warm practical lamps, wet stone reflections, documentary observational tension.
Materials/textures: physically plausible wet wool and leather coats, real stone and asphalt microtexture, skin pores, wet hair clumps, liquid surface tension and splash detail.
Text (verbatim): none; no generated text, logos, captions, or watermarks.
Constraints: preserve Candidate B identity and the exact fixed cream outfit and white flats; show no jewellery on the heroine; keep the crowd fleeing and removing jewellery; make every water filament irregular, sparse, visibly rooted in the street, and travelling upward toward the sea. Photorealistic live-action frame, not a fashion editorial.
Avoid: ordinary falling rain, vertical rain curtains, decorative light beams, symmetrical centred tunnel, clean studio backdrop, polished beauty-ad retouching, fantasy illustration, CGI look, extra jewellery on heroine, generated text, logos, watermarks, legacy first-frame images, old character/environment/FX assets, or the memory-pair asset.
```

### Repair 1 — accepted replacement

Repair variable: make the overhead ocean occupy the upper sky with a clearly readable water boundary and make one foreground civilian visibly hold removed jewellery away from their body. Candidate B identity, cream outfit, street geography, natural storm light, and irregular upward ground origins remain unchanged.

Positive references and roles:
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/candidate-b-dangerous-curiosity.png` — Candidate B identity and fixed cream wardrobe. SHA-256: `2CA5B608255BD2BE4DB3701CFFDA4EF4C5BA407F9CB85C7325ED37D84DF966F9`.
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-03-s01-street-hook.png` — approved wet British-city and overhead-sea street geography. SHA-256: `B72AAFB5E8360E8CCD850E953DFD927778C8862354B446029FA59DC585E563DD`.
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-city-beneath-sea.png` — approved city scale and overhead-ocean boundary. SHA-256: `ED50178C514FD0A970D2586DAA40A1C3662F6EAF3EAD1539447D396E138B003F`.

Rejected source evidence retained: `C:/Users/11458/.codex/generated_images/01a02500-ccb6-7f91-b31e-c2898be18672/exec-35016712-e3ef-43b4-a2df-71ad51dbd95f.png` (941×1672 PNG/RGB/sRGB, SHA-256 `886114B18C3CA634E350DF4B048562DA051F865DAA4D5DFFD67C5CDC14AA2CC7`) and prior normalized `visual-reconstruction/first-frames/v1/S01.png` (2160×3840 PNG/RGB/sRGB, SHA-256 `4966E7EE0933627F59C8B90DB2D5BF19251D62045BB4B40DF3C573F308F7D179`). Neither rejected artifact was supplied as a positive reference.

Generated source path: `C:/Users/11458/.codex/generated_images/01a02500-ccb6-7f91-b31e-c2898be18672/exec-1b06cd66-41f6-4193-8c6b-02ad045cd951.png`
Generated source metadata: PNG, 941×1672, 3 channels, sRGB, no alpha. Generated source SHA-256: `0F1172CF537F5B99A7F99C1BAF9A10120BBFBB6E77F5C025981AE7B8686EBADC`.
Accepted output path: `visual-reconstruction/first-frames/v1/S01.png`
Accepted output metadata: PNG, 2160×3840, 3 channels/RGB, sRGB, no alpha. SHA-256: `648A878F37C37174BAE380F866759FFE7ECC9ADE0B95F89B21D0C572F0179B62`.

Visual inspection: accepted. The full source, normalized master, and 270×480 thumbnail were inspected with `view_image`. The upper sky is a continuous dark teal overhead ocean with layered wave ridges, foam, depth, and a distinct boundary separate from storm clouds. Candidate B remains natural, off-axis, and in the fixed cream camisole, structured high-waisted short skirt, and white flats. A foreground adult at right visibly extends a hand away from their torso holding a removed dangling pendant by its hook; the gesture remains readable at thumbnail size and is not an ear-covering gesture. Fleeing civilians, irregular ground-origin upward filaments, wet stone, and natural storm light hold. No generated text, logo, or watermark is present.

Rejection reason: none — accepted on the first repair source.
Targeted repair prompt: the exact prompt used for this accepted repair is below.

Exact repair prompt:
```text
Use case: photorealistic-natural
Asset type: vertical live-action first frame for a 9:16 story video, shot S01 present-day hook replacement
Input images: Image 1: identity and fixed wardrobe reference for the same fictional adult Candidate B; Image 2: approved present-day British-city street with a clearly overhead ocean reference; Image 3: approved city-beneath-sea scale reference. Use only these as positive references; do not use any rejected first frame or prior generated frame.
Scene/backdrop: a real wet stone street in a present-day British city under the approved Sea Above world rule. The upper half of the sky is unmistakably occupied by a physically coherent ocean above the city: a broad dark teal water surface spans from left edge to right edge, with a clearly readable lower boundary, layered wave ridges, translucent depth, suspended foam, and blue-green refracted storm light. The lower edge of this overhead sea is visibly separate from ordinary slate clouds; it must read as a massive ocean body overhead, not cloud, mist, or a decorative ceiling. Old stone tenements and shopfronts recede down the wet street beneath it.
Subject: the same fictional adult Candidate B identity, pale-gold wet blonde hair in clumps, vivid blue eyes, cream camisole, cream structured high-waisted short skirt, and white practical flats. She is off-axis and still at mid-left as an alert witness, slightly turned toward the overhead sea, braced and natural, never a fashion pose. A separate foreground adult civilian in a wet dark coat is clearly visible at the right edge in three-quarter view: one arm is extended away from their torso into open space, and their hand is unmistakably holding a small removed gold earring or necklace pendant by its hook, visibly separated from their ear and chest; their other hand is not covering the ear. The gesture must read at a 270x480 thumbnail as jewellery being removed and held away, not as covering ears.
Action and FX: the crowd is fleeing down the street. Multiple irregular translucent water filaments visibly originate at distinct ground points — a foreground puddle, gutter mouths, and wet coat hems — and climb upward toward the overhead sea with broken streams and droplets. Show clear lower origins and unmistakable upward direction; no ordinary rain falling from above.
Composition/framing: observational live-action camera, vertical 9:16, 28–35 mm lens, medium-wide full-body Candidate B framing with asymmetrical negative space and deep crowd perspective. Keep the overhead ocean boundary within the frame and large enough to remain obvious at thumbnail size. Keep the foreground civilian’s extended hand and removed jewellery unobscured and readable. Place the reverse-water filaments off-axis and irregular rather than as a centred tunnel.
Lighting/mood: real natural storm light filtered through the overhead sea, cool slate and sea-green tones, restrained warm street lamps, wet stone reflections, documentary observational tension.
Materials/textures: real wet stone and asphalt microtexture, wet wool and leather coats, skin pores, wet hair clumps, physically plausible liquid surface tension, refracted light and foam under the ocean surface.
Text (verbatim): none; no generated text, logos, captions, or watermarks.
Constraints: preserve Candidate B identity and exact fixed cream outfit and white flats; no jewellery on Candidate B; keep the foreground adult visibly holding removed jewellery away from their body; make the overhead ocean’s lower boundary, wave texture, and blue-green depth unmistakable; keep all reverse-water filaments visibly rooted in the street and travelling upward. Photorealistic live-action frame, not a fashion editorial or concept painting.
Avoid: storm-cloud-only sky, ordinary falling rain, gestures that only cover ears, hidden or fused jewellery, jewellery held against the body, vertical rain curtains, decorative light beams, swimming-pool interior, smooth flat blue ceiling, centred tunnel, symmetrical portal, polished beauty-ad retouching, fantasy illustration, CGI look, generated text, logos, watermarks, any rejected first-frame image, old character/environment/FX assets, or the memory-pair asset.
```

## S02

Reference roles: (original generation; now rejected continuity-order evidence) Candidate B is the identity/ear/wardrobe reference; product `main.jpg`, `detail-05.jpg`, and `product-lock.png` are the immutable Baroque Orbit geometry references; the prior S01 candidate was supplied for continuity before the accepted final S01 existed. This output is not an accepted continuity anchor.

Positive references:
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/candidate-b-dangerous-curiosity.png` — identity, natural face/ear anatomy, wet pale-gold hair, and fixed cream wardrobe. SHA-256: `2CA5B608255BD2BE4DB3701CFFDA4EF4C5BA407F9CB85C7325ED37D84DF966F9`.
- `video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/source/main.jpg` — overall Baroque Orbit product construction. SHA-256: `DD12F12A092965A08AB9096DC3E4E79925779B641B29142B4194FF1C8BDF950F`.
- `video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/source/detail-05.jpg` — close detail of the green-stone gold segment, connector, irregular pearl, and terminal bead. SHA-256: `73855F92B3426DE9428042561DF8AD5BD5A4EB98496BD31F2934ECEA6C67E2E5`.
- `video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/views/product-lock.png` — immutable product-lock geometry and material reference. SHA-256: `0B8671FAFCD9481DD53FC10EFB8ACC4671B901ABA647BF7C273069A01793517B`.

Rejected continuity input (not a positive reference for any replacement): prior S01 candidate `visual-reconstruction/first-frames/v1/S01.png`, SHA-256 `4966E7EE0933627F59C8B90DB2D5BF19251D62045BB4B40DF3C573F308F7D179`. The accepted S01 continuity master is the later repair output with SHA-256 `648A878F37C37174BAE380F866759FFE7ECC9ADE0B95F89B21D0C572F0179B62`.

Negative-history exclusions:
- `first-frames/S02.png` and every other legacy first-frame image.
- `05-characters/CHAR_MR_TIDE_ARCHIVIST_001/` and all old character assets.
- `03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001/` and all old environment assets.
- `08-fx/FX_MR_REVERSE_RAIN_001/` and all old FX assets.
- `v1/continuity/memory-pair-v1.png` and the old memory pair.

Generated source path: `C:/Users/11458/.codex/generated_images/01a02500-ccb6-7f91-b31e-c2898be18672/exec-823503c2-9d43-43db-838e-0f0ae8daa111.png`
Generated source metadata: PNG, 941×1672, 3 channels, sRGB, no alpha. Generated source SHA-256: `CA179DD73A2B1F177543CC2795396A761FDB191D6DF8EA554D50F3DF5A1C4EB9`.
Rejected continuity-order output path: `visual-reconstruction/first-frames/v1/S02.png`
Rejected continuity-order output metadata: PNG, 2160×3840, 3 channels/RGB, sRGB, no alpha. SHA-256: `102DC6825098EF085B8452C37E64FF7BF019FDBBB8F006683E7F7D6D423E7568`.

Visual inspection: pixels passed the product/identity gate, but the output is rejected for continuity order. The full source and normalized master were inspected with `view_image`. The right-profile/three-quarter close-up keeps natural face and ear anatomy, wet-hair clumps, skin texture, and storm light. Exactly one Baroque Orbit is in focus on the near ear: the green-stone gold segment, small gold connector ring, irregular nacreous baroque pearl, and tiny terminal bead are all present. There is no extra pearl, missing terminal, wrong connector, mirrored construction, deformed ear, duplicate earring, or beauty-ad retouching. No generated text, logo, or watermark is present.

Rejection reason: generated before the accepted final S01 and therefore cannot serve as the ordered S02 continuity output, even though the pixels passed the product/identity gate.
Targeted repairs: Repair 1 regenerates S02 with the accepted final S01 first, followed by Candidate B and all three immutable product truth anchors. The prior source and master remain preserved as rejected continuity-order evidence and are not supplied as positive inputs.

Original exact prompt (rejected continuity-order generation):
```text
Use case: photorealistic-natural
Asset type: vertical live-action first frame for a 9:16 story video, shot S02 product reveal
Input images: Image 1: Candidate B identity, wet pale-gold hair, and fixed wardrobe reference; Image 2: Baroque Orbit overall product construction reference; Image 3: Baroque Orbit close-detail reference; Image 4: immutable product-lock geometry reference; Image 5: prior S01 candidate continuity reference for light, wet hair, skin texture, and present-day storm world (later rejected; not the accepted final). Use these as positive references only and preserve the exact product truth.
Scene/backdrop: the same natural storm-light present-day British-city street atmosphere as accepted S01, soft wet-stone reflections and a distant cold sea glow, restrained background detail so the ear and earring remain the focal point.
Subject: the same fictional adult Candidate B identity, right-profile to three-quarter close-up, pale-gold wet blonde hair in realistic clumps partially swept behind the near ear, vivid blue eye visible, natural face and ear anatomy, pores and wet skin texture, cream camisole edge barely visible. She is beginning to angle her head toward the sea with quiet alarm and curiosity, not posing.
Product: exactly one Baroque Orbit earring worn on the near visible ear and kept in sharp focus. Match the product-lock exactly: a slim gold hoop/arc set with its row of vivid green stones, one small gold connector ring, one irregular luminous baroque pearl drop with its asymmetrical organic silhouette, and one tiny gold terminal bead at the pearl tip. Keep the hoop, green stones, connector ring, pearl, and terminal bead as one coherent single construction; do not redesign, simplify, mirror, duplicate, or add a second pearl.
Composition/framing: vertical 9:16, right-profile/three-quarter close-up, 35–40 mm observational live-action lens, near ear in the forward focal plane, earring large enough for the green stones, connector, pearl shape, and terminal bead to be unambiguous; head angled slightly toward the sea, natural shoulder and neck perspective, no beauty-ad crop.
Lighting/mood: continue S01’s cool natural storm light with soft wet reflections, realistic specular highlights on gold, green stones, and nacre, no glamour retouching.
Materials/textures: real skin pores, fine wet-hair clumps and stray strands, believable cartilage and earlobe, brushed and polished gold, individually readable green stones, iridescent baroque pearl ridges, tiny terminal bead.
Text (verbatim): none; no generated text, logos, captions, or watermarks.
Constraints: preserve Candidate B identity, natural ear anatomy, wet-hair clumps, skin texture, and S01 storm light; change only the shot scale/profile and show the exact single Baroque Orbit construction in focus. Product geometry is immutable.
Avoid: missing green stones, wrong connector, extra pearl, missing terminal bead, mirrored construction, deformed ear, duplicated earrings, invented chains or charms, beauty-ad retouching, waxy skin, generic hoop, smooth round pearl, CGI illustration, text, logos, watermarks, legacy first-frame images, old character/environment/FX assets, or the memory-pair asset.
```

### Repair 1 — accepted replacement (continuity-order fix)

Repair variable: regenerate S02 after the accepted final S01 exists. Preserve the exact product, Candidate B identity, fixed cream outfit, and S01 storm-light continuity; change only the continuity input/order and keep the close-up beat.

Positive references and roles, in generation order:
1. `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S01.png` — accepted final S01 continuity anchor for Candidate B appearance, fixed cream outfit, wet hair/skin, storm light, and present-day Sea Above atmosphere. SHA-256: `648A878F37C37174BAE380F866759FFE7ECC9ADE0B95F89B21D0C572F0179B62`.
2. `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/candidate-b-dangerous-curiosity.png` — Candidate B identity, natural face/ear anatomy, pale-gold wet hair, and fixed cream wardrobe. SHA-256: `2CA5B608255BD2BE4DB3701CFFDA4EF4C5BA407F9CB85C7325ED37D84DF966F9`.
3. `video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/source/main.jpg` — overall Baroque Orbit product construction. SHA-256: `DD12F12A092965A08AB9096DC3E4E79925779B641B29142B4194FF1C8BDF950F`.
4. `video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/source/detail-05.jpg` — green-stone gold segment, connector, irregular pearl, and terminal-bead detail. SHA-256: `73855F92B3426DE9428042561DF8AD5BD5A4EB98496BD31F2934ECEA6C67E2E5`.
5. `video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/views/product-lock.png` — immutable product-lock geometry and materials. SHA-256: `0B8671FAFCD9481DD53FC10EFB8ACC4671B901ABA647BF7C273069A01793517B`.

All five positive references were inspected with `view_image` before this generation and their roles were recorded above. The rejected prior S02 source `C:/Users/11458/.codex/generated_images/01a02500-ccb6-7f91-b31e-c2898be18672/exec-823503c2-9d43-43db-838e-0f0ae8daa111.png` (941×1672 PNG/RGB/sRGB, SHA-256 `CA179DD73A2B1F177543CC2795396A761FDB191D6DF8EA554D50F3DF5A1C4EB9`) and rejected prior S02 master `visual-reconstruction/first-frames/v1/S02.png` (2160×3840 PNG/RGB/sRGB, SHA-256 `102DC6825098EF085B8452C37E64FF7BF019FDBBB8F006683E7F7D6D423E7568`) were preserved as continuity-order evidence and were not supplied as positive references. The rejected S01 candidate hash `4966E7EE0933627F59C8B90DB2D5BF19251D62045BB4B40DF3C573F308F7D179` was likewise not supplied.

Generated source path: `C:/Users/11458/.codex/generated_images/01a02500-ccb6-7f91-b31e-c2898be18672/exec-cbbccf93-dbe8-4341-952e-b7049f8a489c.png`
Generated source metadata: PNG, 941×1672, 3 channels, sRGB, no alpha. Generated source SHA-256: `A7AFE6595BF204A628143CE4DE8A02C04D92EBF2935240B66D393BFA3D9C8BDF`.
Accepted output path: `visual-reconstruction/first-frames/v1/S02.png` (absolute workspace path `C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S02.png`)
Accepted output metadata: PNG, 2160×3840, 3 channels/RGB, sRGB, no alpha. SHA-256: `1735B4A689978024A0D218B8D2763069DC96E5BD8C76503AEABCDD3824C81CEF`.

Visual inspection: accepted. The full generated source, normalized master, and 270×480 thumbnail were inspected with `view_image`. Candidate B’s pale-gold wet hair, vivid blue eye, natural skin/ear anatomy, and fixed cream outfit remain coherent with accepted S01. Exactly one Baroque Orbit is worn on the visible near ear: green-stone gold segment/hoop, connector ring, irregular baroque pearl, and terminal bead are readable with no duplicate, missing component, mirrored construction, or extra jewelry. The storm-lit wet street and overhead-sea cue preserve S01 continuity. No generated text, logo, or watermark is present.

Rejection reason: none — accepted continuity-order replacement.

Exact repair prompt (used with the five references above in the stated order):
```text
Create a single live-action cinematic vertical 9:16 first-frame still for the approved Sea Above storyboard, shot S02, using the input images in this exact positive-reference order:
Image 1 = the accepted final S01 continuity reference (use it for Candidate B identity, fixed cream outfit, wet rain, blue-green storm light, and the Sea Above world);
Image 2 = Candidate B identity reference (use it for the same adult woman's face, pale-gold wet blonde hair, vivid blue eye, and wardrobe continuity);
Images 3, 4, and 5 = product truth anchors (main view, detail view, and product lock) and jointly control the exact Baroque Orbit earring geometry.

Important continuity instruction: Image 1 is the accepted S01 final, not an earlier candidate. Do not use any old first frame, old character/environment/FX asset, old memory pair, or the rejected prior S02 as a positive reference. Preserve the accepted S01 color/light/world continuity.

Composition and action: tight right-profile to three-quarter close-up of the same adult Candidate B woman in the rain, framed from upper chest to crown, face turned slightly toward the impossible sea above the street as if beginning to look up. Her pale-gold wet hair is clumped naturally, with realistic skin pores and physically plausible anatomy; one vivid blue eye is visible. She wears the same fixed cream outfit from Image 1, wet at the shoulders. Match the cool blue-green overcast light, wet specular highlights, shallow but readable background street, and natural live-action lens rendering (35–40 mm feel, no fisheye). The overhead ocean's lower boundary should remain a soft but legible background cue, consistent with accepted S01.

Product lock: show exactly one Baroque Orbit earring on the visible near ear, with the precise approved product design from Images 3–5: green-stone gold segment/hoop, connector ring, irregular baroque pearl, and small terminal bead. It must be physically worn at the ear, sharply readable, with correct scale, metal, stone, pearl shape, and attachment. No second earring, no mirrored duplicate, no missing component, no redesign, no extra jewelry. Do not add necklaces, rings, text, logos, watermarks, or graphic overlays.

Keep the image photorealistic and production-ready: coherent hands if visible, no deformed facial features, no duplicated people, no impossible jewelry, no text. The frame must read as the exact S02 beat immediately after accepted S01 while retaining the same identity, outfit, product, weather, and Sea Above world.
```

## S03

Reference roles: (original generation; now rejected continuity-order evidence) approved Scene 01, Scene 03, and Scene 05 are geography references for city scale, wet street, harbour/ocean horizon, and depth; the prior S01 candidate was supplied for storm-light continuity before the accepted final S01 existed. This output is not an accepted continuity anchor.

Positive references:
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-city-beneath-sea.png` — approved city-to-ocean scale and above-sea geography. SHA-256: `ED50178C514FD0A970D2586DAA40A1C3662F6EAF3EAD1539447D396E138B003F`.
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-03-s01-street-hook.png` — approved wet-street and reverse-water geography. SHA-256: `B72AAFB5E8360E8CCD850E953DFD927778C8862354B446029FA59DC585E563DD`.
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-05-cliffs-harbour-ocean.png` — approved cliffs, harbour, and horizon geography. SHA-256: `12AB7C54014E2217F103657879DF23BB12411ABCC897AB90414F7B4224B446D3`.

Rejected continuity input (not a positive reference for any replacement): prior S01 candidate `visual-reconstruction/first-frames/v1/S01.png`, SHA-256 `4966E7EE0933627F59C8B90DB2D5BF19251D62045BB4B40DF3C573F308F7D179`. The accepted S01 continuity master is the later repair output with SHA-256 `648A878F37C37174BAE380F866759FFE7ECC9ADE0B95F89B21D0C572F0179B62`.

Negative-history exclusions:
- `first-frames/S03.png` and every other legacy first-frame image.
- `05-characters/CHAR_MR_TIDE_ARCHIVIST_001/` and all old character assets.
- `03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001/` and all old environment assets.
- `08-fx/FX_MR_REVERSE_RAIN_001/` and all old FX assets.
- `v1/continuity/memory-pair-v1.png` and the old memory pair.

Generated source path: `C:/Users/11458/.codex/generated_images/01a02500-ccb6-7f91-b31e-c2898be18672/exec-04e4669b-6957-4a2f-9120-7a081ded2cba.png`
Generated source metadata: PNG, 941×1672, 3 channels, sRGB, no alpha. Generated source SHA-256: `5CBB67587BED3E4F247E8292901FE8E563858AECE62302D4912FDCBCA4A889E3`.
Rejected continuity-order output path: `visual-reconstruction/first-frames/v1/S03.png`
Rejected continuity-order output metadata: PNG, 2160×3840, 3 channels/RGB, sRGB, no alpha. SHA-256: `E5A8D849CE4318F54B3301D79A2A27F10BA0A0151577DDFFA8AE33D54B373D73`.

Original visual inspection: rejected by independent review. The full source and normalized master were inspected with `view_image`; a 270×480 thumbnail was also inspected. The low 14–18 mm reveal had a clear street-origin stream but depicted a normal ocean on the ground-level horizon plus a waterspout; it did not show the required ocean spanning the entire sky above the city. No generated text, logo, or watermark was present.

Original rejection reason: lower horizon read as an ordinary ocean; the overhead Sea Above world rule was absent; the water column read as a waterspout rather than a single filament entering the overhead sea.
Targeted repairs: Repair 1 changes one concrete world-geography variable — replace the ground-level ocean/waterspout with a terrestrial land-and-city horizon beneath a continuous overhead ocean and one street-to-sky filament entering it — while preserving low 14–18 mm framing, depth cues, and a small Candidate B scale cue. The rejected source and master were preserved as evidence above and were not used as positive inputs for the repair.

Exact prompt:
```text
Use case: photorealistic-natural
Asset type: vertical live-action first frame for a 9:16 story video, shot S03 world reveal
Input images: Image 1: approved city-beneath-sea geography reference; Image 2: approved wet British-city street and reverse-water geography reference; Image 3: approved cliffs-harbour-ocean horizon geography reference; Image 4: prior S01 candidate continuity reference for storm light, wet stone, and a small/partial Candidate B presence only (later rejected; not the accepted final). Use the world images for geography, never as identity replacement.
Scene/backdrop: a real present-day British stone street seen from a low camera position, opening through old architecture to a horizon-spanning ocean beyond the city. The impossible sea is a physically coherent distant body of water and high atmospheric wave field, not an indoor ceiling. Keep open natural sky and real weather between the buildings; no swimming-pool roof.
Subject: Candidate B is only a small or partial off-axis glimpse at the extreme side or lower edge, never the main subject and never a fashion pose. The geography and reverse-water event carry the frame.
Composition/framing: vertical 9:16, low 14–18 mm live-action reveal, strong foreground wet cobbles and gutter, broad asymmetrical view that avoids a centred tunnel. One and only one irregular reverse-rain path is the readable action: a broken translucent stream with droplets, splash fragments, and visible origin in a specific foreground puddle/gutter, rising away from camera along the street perspective and continuing unbroken toward the distant horizon-spanning ocean. The path must have an unmistakable lower ground origin and upward/away direction. Preserve at least three real architectural depth cues: foreground stone joints and puddle, midground rowhouses/lamps/cars and converging street, background harbour skyline/cliffs and a distinct ocean horizon. The path is off-centre, not a decorative symmetrical column.
Lighting/mood: real natural storm light, cool sea-green and slate tones with sparse warm windows and lamps, physically plausible wet reflections and atmospheric perspective.
Materials/textures: real wet stone, gutter water, masonry, window glass, distant harbour haze, wave translucency, imperfect weather detail; live-action photography, not matte-painting concept art.
Text (verbatim): none; no generated text, logos, captions, or watermarks.
Constraints: keep exactly one connected reverse-rain path from foreground ground origin to horizon ocean; make vertical direction legible; keep architecture physically grounded and asymmetric; preserve world geography from the approved references and the prior S01 candidate's storm-light continuity. The ocean must read as a real horizon-spanning sea phenomenon, not a roof or pool.
Avoid: swimming-pool ceiling, decorative water roof, indoor pool, flat matte painting, centred tunnel, symmetrical portal, multiple competing water paths, ordinary falling rain, unexplained water columns with no ground origin, unclear vertical direction, generic fantasy city, excessive CGI sheen, generated text, logos, watermarks, legacy first-frame images, old character/environment/FX assets, or the memory-pair asset.
```

### Repair 1 — rejected continuity-order candidate

Repair variable: replace the ground-level ocean/waterspout with a terrestrial land-and-city horizon beneath a continuous overhead ocean and one street-to-sky filament entering it. Low 14–18 mm framing, architecture depth cues, wet street, and a small Candidate B scale cue remain unchanged.

Positive references and roles:
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/candidate-b-dangerous-curiosity.png` — Candidate B identity and fixed cream wardrobe scale cue. SHA-256: `2CA5B608255BD2BE4DB3701CFFDA4EF4C5BA407F9CB85C7325ED37D84DF966F9`.
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-city-beneath-sea.png` — approved overhead-ocean world rule and city scale. SHA-256: `ED50178C514FD0A970D2586DAA40A1C3662F6EAF3EAD1539447D396E138B003F`.
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-03-s01-street-hook.png` — approved wet street and overhead-sea relationship. SHA-256: `B72AAFB5E8360E8CCD850E953DFD927778C8862354B446029FA59DC585E563DD`.
- `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-05-cliffs-harbour-ocean.png` — approved cliffs/harbour architecture and depth cues; used for land/city structure, not a ground-level ocean horizon. SHA-256: `12AB7C54014E2217F103657879DF23BB12411ABCC897AB90414F7B4224B446D3`.

Rejected source evidence retained: `C:/Users/11458/.codex/generated_images/01a02500-ccb6-7f91-b31e-c2898be18672/exec-04e4669b-6957-4a2f-9120-7a081ded2cba.png` (941×1672 PNG/RGB/sRGB, SHA-256 `5CBB67587BED3E4F247E8292901FE8E563858AECE62302D4912FDCBCA4A889E3`) and prior normalized `visual-reconstruction/first-frames/v1/S03.png` (2160×3840 PNG/RGB/sRGB, SHA-256 `E5A8D849CE4318F54B3301D79A2A27F10BA0A0151577DDFFA8AE33D54B373D73`). Neither rejected artifact was supplied as a positive reference.

Generated source path (rejected continuity-order candidate): `C:/Users/11458/.codex/generated_images/01a02500-ccb6-7f91-b31e-c2898be18672/exec-edd25562-c4fd-46c2-b473-0e9a54f0b4de.png`
Generated source metadata: PNG, 941×1672, 3 channels, sRGB, no alpha. Generated source SHA-256: `F2A24050C4B920E0CB4BC3C188765DECB605E46FDAB15FF35FC0E929FBB2033B`.
Rejected continuity-order output path: `visual-reconstruction/first-frames/v1/S03.png`
Rejected continuity-order output metadata: PNG, 2160×3840, 3 channels/RGB, sRGB, no alpha. SHA-256: `A62C632DF07882106D191B03054B38B8F28F9B7EB65008D1CC866A70BC279F01`.

Visual inspection: pixels and world geometry passed, but this output is rejected for continuity order. The full source, normalized master, and 270×480 thumbnail were inspected with `view_image`. A single irregular filament is traceable from a foreground puddle through the terrestrial city/land horizon and into a massive overhead ocean spanning the upper sky. The lower horizon is rooftops, towers, and distant land/cliffs with no ordinary ground-level ocean; the suspended sea has a clear boundary, layered wave texture, foam, and depth. Foreground wet cobbles/gutter, midground rowhouses/lamps/cars, and background city/land supply depth cues. Candidate B is only a small partial off-axis scale cue. The filament is not a waterspout, tornado, waterfall, rain curtain, or decorative column. No generated text, logo, or watermark is present.

Rejection reason: this repair was generated with Candidate B and Scenes 01/03/05 but omitted the accepted final S01 continuity reference; it is preserved as rejected continuity-order evidence despite passing the visual/world gate.
Targeted repair prompt: the exact prompt used for this rejected continuity-order candidate is below. Repair 2 below repeats the world variable with accepted S01 first in the positive-reference order.

Exact repair prompt:
```text
Use case: photorealistic-natural
Asset type: vertical live-action first frame for a 9:16 story video, shot S03 world reveal replacement
Input images: Image 1: Candidate B identity and fixed cream wardrobe reference; Image 2: approved city-beneath-sea geography and overhead-ocean reference; Image 3: approved wet British-city street and above-city sea reference; Image 4: approved cliffs/harbour architecture and depth reference. Use only these positive references; do not use any rejected first frame or prior generated frame.
Scene/backdrop: the approved Sea Above world rule is literal and unmistakable. A present-day British stone city street rises toward a lower geographic horizon made only of rooftops, towers, distant hills/cliffs, and land/city silhouettes. Above that ordinary land-and-city horizon, the upper half to two-thirds of the sky is occupied by a massive physically coherent ocean suspended overhead: a broad dark teal underside spans the entire frame from left edge to right edge, with an unmistakable lower water boundary, layered wave ridges, suspended foam, translucent depth, and refracted blue-green storm light. The overhead sea is not cloud, mist, a swimming-pool roof, or a normal ocean at ground level. Do not put any open ocean or water horizon on the ground-level horizon; keep the ordinary geographic horizon terrestrial and urban.
Subject: Candidate B is only a small or partial off-axis glimpse at the extreme lower edge, wearing the fixed cream camisole and cream structured high-waisted short skirt if visible, with pale-gold wet hair. She is a scale cue, never the main subject and never a fashion pose. The world geometry and one reverse-water connection carry the frame.
Action and FX: one and only one irregular translucent reverse-rain filament starts at a clearly visible foreground street puddle/gutter origin, rises away from camera through the city perspective, passes the land-and-city horizon, and visibly enters the underside of the overhead ocean. The single filament is broken, rope-thin-to-medium, with droplets climbing upward and sparse splash fragments; it is not a waterspout, tornado, waterfall, rain curtain, or decorative column. No second competing filament.
Composition/framing: vertical 9:16, low 14–18 mm live-action reveal, broad asymmetrical composition avoiding a centred tunnel. Keep the foreground puddle/gutter origin in frame, the lower terrestrial horizon readable, the entire overhead ocean boundary visible, and the single filament traceable from bottom to sky-sea. Preserve at least three real depth cues: foreground wet cobbles and gutter, midground rowhouses/lamps/cars and converging street, background rooftops/towers/distant land or cliffs. Place the filament off-centre.
Lighting/mood: real natural storm light filtered through the suspended ocean, cool sea-green and slate tones with restrained warm windows and lamps, physically plausible wet reflections and atmospheric perspective.
Materials/textures: real wet stone, gutter water, masonry, window glass, distant land haze, detailed wave translucency, suspended foam, and imperfect weather texture; live-action photography, not matte-painting concept art.
Text (verbatim): none; no generated text, logos, captions, or watermarks.
Constraints: show an overhead ocean spanning the sky with a visible lower boundary; keep the lower horizon ordinary land/city, not ocean; show exactly one connected street-to-sky filament entering the overhead sea; preserve Candidate B only as a small partial continuity cue and preserve the approved world geography. Make vertical direction unambiguous at a 270x480 thumbnail.
Avoid: normal sea at ground-level horizon, ocean-only skyline, waterspout, tornado, waterfall, multiple reverse-rain paths, ordinary falling rain, cloud-only sky, decorative water roof, swimming-pool ceiling, flat matte painting, centred tunnel, symmetrical portal, unclear ground origin, unclear vertical direction, generic fantasy city, excessive CGI sheen, generated text, logos, watermarks, any rejected first-frame image, old character/environment/FX assets, or the memory-pair asset.
```

### Repair 2 — accepted replacement (continuity-order fix)

Repair variable: regenerate S03 after the accepted final S01 exists. Preserve the overhead-ocean/city-land world rule, one connected street-to-sea filament, low wide reveal, and Candidate B scale cue; change only the continuity input/order so the accepted S01 is explicitly first.

Positive references and roles, in generation order:
1. `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S01.png` — accepted final S01 continuity anchor for Candidate B, fixed cream outfit, storm light, wet street, and Sea Above boundary. SHA-256: `648A878F37C37174BAE380F866759FFE7ECC9ADE0B95F89B21D0C572F0179B62`.
2. `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/candidate-b-dangerous-curiosity.png` — Candidate B identity and fixed cream wardrobe scale cue. SHA-256: `2CA5B608255BD2BE4DB3701CFFDA4EF4C5BA407F9CB85C7325ED37D84DF966F9`.
3. `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-city-beneath-sea.png` — approved overhead-ocean world rule and city scale. SHA-256: `ED50178C514FD0A970D2586DAA40A1C3662F6EAF3EAD1539447D396E138B003F`.
4. `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-03-s01-street-hook.png` — approved wet street, reverse-water, and above-city relationship. SHA-256: `B72AAFB5E8360E8CCD850E953DFD927778C8862354B446029FA59DC585E563DD`.
5. `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-05-cliffs-harbour-ocean.png` — approved cliffs/harbour architecture and depth cues; used to shape land/city structure, not to introduce a ground-level ocean horizon. SHA-256: `12AB7C54014E2217F103657879DF23BB12411ABCC897AB90414F7B4224B446D3`.

All five positive references were inspected with `view_image` before this generation and their roles were recorded above. The rejected prior S03 source `C:/Users/11458/.codex/generated_images/01a02500-ccb6-7f91-b31e-c2898be18672/exec-edd25562-c4fd-46c2-b473-0e9a54f0b4de.png` (941×1672 PNG/RGB/sRGB, SHA-256 `F2A24050C4B920E0CB4BC3C188765DECB605E46FDAB15FF35FC0E929FBB2033B`) and rejected prior S03 master `visual-reconstruction/first-frames/v1/S03.png` (2160×3840 PNG/RGB/sRGB, SHA-256 `A62C632DF07882106D191B03054B38B8F28F9B7EB65008D1CC866A70BC279F01`) were preserved as continuity-order evidence and were not supplied as positive references. The earlier S03 Repair 1 source omitted accepted S01; the rejected S01 candidate hash `4966E7EE0933627F59C8B90DB2D5BF19251D62045BB4B40DF3C573F308F7D179` was not supplied.

Generated source path: `C:/Users/11458/.codex/generated_images/01a02500-ccb6-7f91-b31e-c2898be18672/exec-7cc87e18-256b-415d-884c-7e7ecffd8fb0.png`
Generated source metadata: PNG, 941×1672, 3 channels, sRGB, no alpha. Generated source SHA-256: `B6C864B965861F15C705F4BA4E548BD31CE69A422BB2225A7381490944FE06CC`.
Accepted output path: `visual-reconstruction/first-frames/v1/S03.png` (absolute workspace path `C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S03.png`)
Accepted output metadata: PNG, 2160×3840, 3 channels/RGB, sRGB, no alpha. SHA-256: `A8EDA6644D619203052414020988A3AEAEA2B0078358CA749006FCCE6EE0682B`.

Visual inspection: accepted. The full generated source, normalized master, and 270×480 thumbnail were inspected with `view_image`. The upper half to two-thirds of the frame is a single readable overhead ocean with continuous wave texture, foam, depth, and a clear water boundary. The lower geographic horizon is only wet street, historic city buildings, rooftops, and terrestrial distant hills/land; no ordinary ground-level ocean is present. Exactly one irregular filament is traceable from the foreground street puddle/gutter through the city-land horizon into the overhead sea, with no waterspout, branching, second path, or rain curtain. Candidate B remains a small off-axis figure in the fixed cream outfit. No generated text, logo, or watermark is present.

Rejection reason: none — accepted continuity-order replacement.

Exact repair prompt (used with the five references above in the stated order):
```text
Create a single live-action cinematic vertical 9:16 first-frame still for the approved Sea Above storyboard, shot S03, using the input images in this exact positive-reference order:
Image 1 = the accepted final S01 continuity reference (the primary continuity anchor for Candidate B, fixed cream outfit, rain, blue-green light, city street, and the established Sea Above boundary);
Image 2 = Candidate B identity reference (same adult woman, pale-gold wet blonde hair and the same wardrobe if her partial figure is visible);
Images 3, 4, and 5 = approved world references for Scene 01 city beneath sea, Scene 03 street hook, and Scene 05 cliffs/harbour/ocean, used only to establish the water texture, city architecture, and filament physics.

Important continuity instruction: Image 1 is the accepted S01 final and must be used as a positive reference. Do not use any old first frame, rejected prior S03, old character/environment/FX asset, or old memory pair as a positive reference. Preserve the accepted S01 identity, fixed cream outfit, weather, lens realism, and blue-green palette.

World-rule composition: a low street-level vertical wide shot looking up a rain-darkened historic city street. The lower horizon and all ground-level geography must be ordinary LAND and CITY only: wet paving, curb, rooftops, facades, towers, distant hills or cliffs; do not show an ordinary ocean, harbour water, lake, or sea at the ground horizon. Above that land/city horizon, occupying the upper half to two-thirds of the sky with a clear curved water boundary, show one immense overhead ocean spanning the entire sky: readable wave ridges, depth, translucent blue-green water, foam, and underside light. It must unmistakably read as an ocean suspended overhead, not storm clouds and not a normal sky.

There is exactly one magical water filament/path: a single narrow stream starts visibly at one foreground street origin (a rain-filled gutter or puddle), rises through the city air, crosses the ordinary land/city horizon, and visibly enters the overhead ocean. Keep it continuous and spatially legible from street origin to sea. No waterspout, no funnel, no tornado, no second filament, no branching paths, no spray columns, and no ocean at street level. The filament is irregular and water-like, with a small splash at its street origin.

Camera and character: photorealistic live-action, 14–18 mm vertical wide-angle feel without fisheye distortion, grounded eye-level perspective with strong depth from foreground paving to distant city and overhead sea. Candidate B may appear as a small partial foreground figure at the edge, wearing the same fixed cream outfit and looking upward; keep her anatomy natural and identity consistent. Rain and wet reflections are physical, with realistic scale. No text, logos, watermarks, duplicated people, or graphic overlays.
```

## S04

Reference roles: ordered positive inputs are listed below in generation order.
1. `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S03.png` — accepted S03 continuity anchor for the established British coastal-city geography, overhead-ocean height and blue-green storm light, wet architecture, and irregular reverse-rain physics. SHA-256: `A8EDA6644D619203052414020988A3AEAEA2B0078358CA749006FCCE6EE0682B`.
2. `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-city-beneath-sea.png` — approved district-scale city density and suspended-ocean world rule. SHA-256: `ED50178C514FD0A970D2586DAA40A1C3662F6EAF3EAD1539447D396E138B003F`.
3. `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-04-rooftops-under-mother.png` — approved rooftops-under-Mother restrained shadow/dimming language. SHA-256: `9E06CBFBFA3C067436BD2E62C601A22CD1612504139DEEEE9739330BCE023490`.
4. `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-05-cliffs-harbour-ocean.png` — approved cliffs, harbour, vessels, cranes, and long atmospheric depth. SHA-256: `12AB7C54014E2217F103657879DF23BB12411ABCC897AB90414F7B4224B446D3`.

The product pearl/detail reference was displayed during preflight but was explicitly ignored for S04 and was not used as a positive generation input. All four positive local references above were inspected with `view_image` before generation and their roles were recorded. No Candidate B, product, legacy first-frame, old character/environment/FX, or memory-pair asset was supplied because S04 is a city-scale world frame with no visible character or product.

Generated source path: `C:/Users/11458/.codex/generated_images/01a02574-0dc2-7843-b5b0-7f3f9d6e2e5c/exec-b53a472e-16ba-4a99-b2ec-a32d00de0837.png`
Generated source metadata: PNG, 941×1672, 3 channels/RGB, sRGB, no alpha. Generated source SHA-256: `537C36DE4DB6B154BB9C5AA1305942C39E0E71B247AAAC26EAAD22265C6FDE5E`.
Accepted output path: `visual-reconstruction/first-frames/v1/S04.png` (absolute workspace path `C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S04.png`)
Accepted output metadata: PNG, 2160×3840, 3 channels/RGB, sRGB, no alpha. SHA-256: `0FB67CAE9707E51CF02A79F908EC0729036CCDB086EB665EDC00BC659617486D`.

Visual inspection: accepted on the first generation source. The full generated source, normalized master, and 270×480 thumbnail were inspected with `view_image`. The frame is a populated 14–18 mm city-scale view with a broad, diffuse, incomplete Mother shadow/occlusion crossing the upper ocean and dimming multiple districts; no recognizable anatomy is present. At least five scale cues are unambiguous: foreground wet rooftop parapet and chimneys, dense rows of stone tenements and streets, a distinct church/clock tower, multiple harbour cranes and vessels, distant cliffs/hills, plus tiny cars, pedestrians, and warm windows. The same overhead ocean height, boundary, wave texture, blue-green light, and irregular reverse-rain streams continue from S03. No eye, face, limb, teeth, tentacle, full silhouette, centred symmetry, empty city, generated text, logo, or watermark is present.

Rejection reason: none — accepted on the first generation source.
Targeted repairs: none. No repair call was made; the accepted source was normalized once with repository `sharp` using aspect-preserving `resize({ width: 2160, height: 3840, fit: 'cover', position: 'centre' })`, `toColourspace('srgb')`, `removeAlpha()`, and PNG output.

Exact prompt:
```text
Use case: photorealistic-natural
Asset type: vertical live-action first frame for a 9:16 story video, shot S04, establishing the Mother scale
Input images: Image 1: accepted S03 continuity reference for the established British coastal-city geography, overhead ocean height and blue-green storm light, wet architecture, and irregular reverse-rain physics. Image 2: approved Scene 01 city-beneath-sea world reference for district-scale city density and suspended ocean. Image 3: approved Scene 04 rooftops-under-Mother world reference for the restrained dimming shadow across the city. Image 4: approved Scene 05 cliffs-harbour-ocean world reference for harbour, cliffs, cranes, and atmospheric depth. Image 5 is an unrelated pearl/product texture reference; ignore it completely for this shot. Use only Images 1–4 as positive visual references and do not copy them literally.

Scene/backdrop: a real British coastal city at storm dusk, seen from a high but grounded 14–18 mm rectilinear ultra-wide viewpoint across several connected districts. Wet slate rooftops, stone tenements, narrow streets, terraces, a church/clock tower, harbour cranes, distant cliffs and hills, small warm windows, sparse moving cars and tiny pedestrians form one continuous lived-in city. The same immense dark teal overhead ocean established in accepted S03 spans the upper sky at the same height and light, with visible wave ridges, translucent depth, suspended foam, and a clear lower water boundary. Sparse irregular reverse-rain streams continue from gutters, rooftop edges, harbour surfaces, and streets upward into the overhead sea, with visible broken droplets and real scale.

Primary request: an incomplete Mother presence is revealed only as a broad, non-anatomical, irregular moving shadow/occlusion crossing multiple city districts and dimming the underside of the overhead ocean. The shadow is partly outside frame and partly lost in atmospheric haze; it has no body outline, no anatomy, no identifiable creature parts, and no focal face. It should read as a colossal presence inferred by the city-wide light fall, not as a monster illustration.

Composition/framing: vertical 9:16, 14–18 mm rectilinear live-action city-scale establishing frame, asymmetrical off-axis composition with the city filling the lower two-thirds and the ocean filling the upper third. Show at least five unambiguous scale cues at once: foreground rooftop parapet and chimney, rows of dense tenements and streets, a distinct church/clock tower, multiple harbour cranes and ships, distant cliffs/hills, plus tiny people/cars and window lights. Let the irregular shadow cross from one side across several districts rather than form a centred symmetric shape. Keep occupied city and layered depth; never an empty city, centred tunnel, or poster composition.

Lighting/mood: natural overcast storm light, blue-green light motivated by the overhead sea, a broad physically plausible dimming pass under the incomplete shadow, restrained warm windows and harbour lights, soft atmospheric occlusion and real haze. The shadow should be darker and cooler than the surrounding sea but diffuse at its edges, with no glow or beam.

Materials/textures: wet stone and slate, imperfect masonry, glass reflections, rooftop puddles, sea foam, water droplets, atmospheric perspective, subtle photographic grain, physically coherent scale and shadows; grounded live-action production photography with invisible VFX.

Text (verbatim): none; no generated text, logos, captions, signage, prices, or watermarks.

Constraints: preserve the accepted S03 sea height, lower land/city geography, blue-green storm palette, live-action realism, and irregular reverse-rain rule. The Mother remains incomplete and non-anatomical: shadow/occlusion only, partly off-frame, no recognizable body. Require a clearly inhabited multi-district city and at least five scale cues.

Avoid: any eye, face, iris, pupil, sclera, mouth, teeth, tongue, jaw, head, skull, limb, arm, hand, finger, claw, tentacle, appendage, wing, full silhouette, complete body, creature outline, centred symmetry, centred tunnel, empty city, flat matte painting, concept art, glossy CGI, monster-poster framing, magic particles, energy beams, neon cyan grade, ordinary falling rain, smooth blue ceiling, duplicated buildings or people, generated text, logos, prices, watermarks, old first frames, legacy character/environment/FX assets, memory-pair asset, or product/jewellery imagery.
```

## S05

Reference roles: ordered positive inputs are listed below in generation order.
1. `visual-reconstruction/first-frames/v1/S04.png` — accepted S04 continuity anchor for city orientation, overhead-ocean height/light, diffuse Mother shadow language, wet rooftops, harbour, cliffs, and atmospheric scale. SHA-256: `0FB67CAE9707E51CF02A79F908EC0729036CCDB086EB665EDC00BC659617486D`.
2. `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-01-city-beneath-sea.png` — approved city districts beneath the suspended ocean. SHA-256: `ED50178C514FD0A970D2586DAA40A1C3662F6EAF3EAD1539447D396E138B003F`.
3. `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-04-rooftops-under-mother.png` — approved restrained Mother dimming/shadow language. SHA-256: `9E06CBFBFA3C067436BD2E62C601A22CD1612504139DEEEE9739330BCE023490`.
4. `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-05-cliffs-harbour-ocean.png` — approved cliffs, harbour, vessels, and atmospheric depth. SHA-256: `12AB7C54014E2217F103657879DF23BB12411ABCC897AB90414F7B4224B446D3`.
5. `video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/source/detail-05.jpg` — approved product detail used only as abstract irregular pearl/nacre microstructure inspiration within the biological iris; no jewellery construction was requested or copied. SHA-256: `73855F92B3426DE9428042561DF8AD5BD5A4EB98496BD31F2934ECEA6C67E2E5`.

All five positive local references were inspected with `view_image` before generation and their roles were recorded above. Rejected first frames, old character/environment/FX assets, the old memory pair, and any product main/lock geometry were excluded from generation.

Generated source path: `C:/Users/11458/.codex/generated_images/01a02574-0dc2-7843-b5b0-7f3f9d6e2e5c/exec-c1c4f9da-4525-431f-a473-53dac52fc5f7.png`
Generated source metadata: PNG, 941×1672, 3 channels/RGB, sRGB, no alpha. Generated source SHA-256: `0DD0696F1E1554CD8A9E89B584DA7978D49EA38B49E19EBA59FB5B0E84052153`.
Accepted output path: `visual-reconstruction/first-frames/v1/S05.png` (absolute workspace path `C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S05.png`)
Accepted output metadata: PNG, 2160×3840, 3 channels/RGB, sRGB, no alpha. SHA-256: `2859CC09F89EC3995B5A1B1BD76742921D847B6C91625BC041CA45402D9B9E4B`.

Visual inspection: accepted on the first generation source. The full generated source, normalized master, and 270×480 thumbnail were inspected with `view_image`. Exactly one immense biological eye is visible beneath the overhead ocean, with only a partial wet sclera/iris/pupil slice exposed and the rest hidden by dark water, mist, and spray. The eye is distant and off-axis rather than a close-up or poster emblem. Scale is readable from the inhabited city and harbour: church/clock tower, dense roof planes and streets, multiple cranes and vessels, distant cliffs/hills, tiny cars/people, and warm windows. The iris contains restrained organic layered microstructure with a subtle nacre-like variation; it is not a pearl or jewellery collage. S04’s sea height, wave texture, dimmed blue-green light, wet city, and atmospheric depth remain coherent. No body, face, mouth, tentacle, beam, gore, magic particles, generated text, logo, or watermark is present.

Rejection reason: none — accepted on the first generation source.
Targeted repairs: none. No repair call was made; the accepted source was normalized once with repository `sharp` using aspect-preserving `resize({ width: 2160, height: 3840, fit: 'cover', position: 'centre' })`, `toColourspace('srgb')`, `removeAlpha()`, and PNG output.

Exact prompt:
```text
Use case: photorealistic-natural
Asset type: vertical live-action first frame for a 9:16 story video, shot S05, the restrained Mother eye reveal
Input images: Image 1: accepted S04 continuity anchor; preserve its exact city orientation, overhead-ocean height and wave light, diffuse Mother shadow language, wet rooftops, harbour, cliffs, and atmospheric scale. Image 2: approved Scene 01 world reference for city districts beneath the suspended ocean. Image 3: approved Scene 04 world reference for restrained dimming and shadow. Image 4: approved Scene 05 world reference for cliffs, harbour, vessels, and long atmospheric depth. Image 5: approved Baroque Orbit detail; use it only as an abstract reference for subtle irregular nacre microstructure, never as jewellery or a literal pearl object. Use these five images as positive references in the stated roles; do not copy them literally and do not use any rejected first frame or legacy asset.

Scene/backdrop: the same real British coastal city and storm dusk as accepted S04. Dense wet rooftops, old stone tenements, a distinct church/clock tower, harbour cranes and vessels, distant cliffs/hills, roads, tiny cars and pedestrians supply visible scale below the same immense dark teal ocean suspended overhead. Keep the broad overhead ocean at the same height and lower boundary as S04, with physically coherent wave ridges, translucent depth, suspended foam, and blue-green refracted light. Keep a softened remnant of the S04 dimming shadow around the water, but do not reveal a body.

Primary request: beneath and partly hidden by the overhead ocean, reveal exactly one immense biological eye at extreme distance, large enough that its scale is inferred from the city landmarks and atmospheric perspective. Show only a partial slice of the wet eye — part of the sclera, one muted iris and pupil, and a narrow organic rim disappearing behind dark ocean water, haze, and spray — as if the rest is occluded outside the frame. The eye is not a close-up: the 14–18 mm city-scale composition and tiny architecture must remain dominant context. Place the eye off-axis and partly cropped, not as a centred emblem. Its iris has restrained layered organic microstructure with a faint nacre-like depth and soft pearlescent variation inspired only by the irregular pearl surface in Image 5; it is biological tissue, not a pearl, crystal, gem, or jewellery construction. No glow: all light is physically motivated by the overhead sea and storm atmosphere.

Composition/framing: vertical 9:16, 14–18 mm rectilinear ultra-wide live-action view with asymmetrical depth. Keep lower two-thirds occupied by inhabited wet city and harbour; keep the overhead ocean and partial eye in the upper region behind atmospheric occlusion. Use church/clock tower, several cranes and vessels, dense roof planes, distant cliff edge, roads, and tiny humans/cars as explicit scale cues. The eye should be partially hidden by the ocean underside and mist so its perimeter is never fully visible; let city landmarks overlap or sit in front of portions of its distant form. Avoid poster framing or a giant isolated close-up.

Lighting/mood: grounded storm dusk, cool slate and sea-green tones, subtle warm windows and harbour lights, diffuse shadow, wet surfaces, real atmospheric haze, subdued biological wetness, quiet dread and scale. The eye reflects the same blue-green sea light; it does not emit light.

Materials/textures: live-action photography, wet stone and slate, imperfect masonry, glass reflections, water depth and foam, anatomically plausible eye tissue with moist surface and fine organic iris fibers, restrained layered nacre-like microtexture only within the iris, soft highlight roll-off, subtle film grain, invisible VFX.

Text (verbatim): none; no generated text, logos, captions, signage, prices, or watermarks.

Constraints: exactly one eye; partial and occluded; biological and wet but restrained; no surrounding face or body; preserve S04 city, sea height, light, reverse-rain/atmosphere, and scale. Keep the eye’s scale readable through at least five city/harbour landmarks and atmospheric distance. Image 5 contributes only abstract nacre microstructure inspiration; do not include any earring, gold hoop, green stones, connector, pearl drop, terminal bead, wood prop, or jewellery arrangement.

Avoid: second eye, multiple eyes, full face, head, skull, brow, nose, cheek, mouth, teeth, tongue, jaw, body, torso, limb, arm, hand, claw, tentacle, appendage, full creature silhouette, complete monster, beam, laser, magic particles, energy aura, gore, blood, exposed flesh, glossy monster CGI, crystal eye, gemstone eye, literal pearl eye, jewellery collage, baroque ornament, poster framing, centred emblem, symmetrical composition, eye filling the entire frame, neon cyan grade, cartoon, illustration, concept art, flat matte painting, generated text, logos, prices, watermarks, old first frames, old character/environment/FX assets, or memory-pair asset.

## Continuity anchor: memory-pair-v1

Generation date: 2026-08-22 (Asia/Shanghai).
Generator: built-in image_gen only; one generation call; no CLI/API fallback.
Role: new positive identity/product continuity board for S06 and S07. This board is not a legacy character or first-frame asset.

Reference roles:
1. C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/candidate-b-dangerous-curiosity.png — Candidate B facial traits only, used for plausible family resemblance and not for the child’s age or adult duplication. SHA-256: 2CA5B608255BD2BE4DB3701CFFDA4EF4C5BA407F9CB85C7325ED37D84DF966F9.
2. C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/source/main.jpg — overall Baroque Orbit product truth. SHA-256: DD12F12A092965A08AB9096DC3E4E79925779B641B29142B4194FF1C8BDF950F.
3. C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/source/detail-05.jpg — green-stone hoop, connector, irregular pearl, and terminal-bead detail. SHA-256: 73855F92B3426DE9428042561DF8AD5BD5A4EB98496BD31F2934ECEA6C67E2E5.
4. C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/views/product-lock.png — immutable product-lock geometry and material truth. SHA-256: 0B8671FAFCD9481DD53FC10EFB8ACC4671B901ABA647BF7C273069A01793517B.
5. C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-03-s01-street-hook.png — approved narrow British coastal-city street geography and wet-stone architecture. SHA-256: B72AAFB5E8360E8CCD850E953DFD927778C8862354B446029FA59DC585E563DD.

All five positive references were inspected with view_image at full resolution and at 270×480 before generation.

Negative-history exclusions (legacy only; not supplied as positive inputs):
- video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_MEMORY_PAIR_001/source/memory-pair-lock.png (rejected legacy memory-pair asset; excluded from every positive generation input).
- every legacy first-frame image under first-frames/;
- all 05-characters/CHAR_MR_TIDE_ assets;
- all 03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001 assets;
- all 08-fx/FX_MR_ assets;
- all prior generated memory, S06, or S07 images.

Generated source path: C:/Users/11458/.codex/generated_images/01a0259c-d021-7523-94ba-aa92ec43f541/exec-0ed3157e-fe60-4abf-aa4e-a9dc1d10abfa.png
Generated source metadata: PNG, 864×1821, 3 channels/RGB, sRGB, no alpha. Generated source SHA-256: D0CE3C179E4029CC8DD51A8CAB61C92BBE1551E3F42C5240CF3F04CEFBE0CC51.
Accepted output path: C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/continuity/memory-pair-v1.png
Accepted output metadata: PNG, 2160×3840, 3 channels/RGB, sRGB, no alpha. SHA-256: A5C5C572FEF6D9E2B44322AA32F0E6A4DF14A53003D95EDC34E6715BFDBF58FF.

Visual inspection: the generated source, normalized continuity board, and 270×480 source/final thumbnails were inspected with view_image. The board contains three clearly separated live-action views of the same fictional family: a clean portrait of the adult and child; a natural adult right-ear profile; and a hand-holding street view. The child is visibly about eight with child anatomy, rounded cheeks, smaller scale, and no face-shrunk-adult read. The adult is visibly mature with subtle forehead lines, crow’s feet, smile lines, and natural adult proportions. The exact earring is legible in the profile and hand-holding views as the irregular textured gold hoop/green stones, connector, one irregular pearl, and terminal gold bead. Hands and fingers are natural. The British street is recognizable and photographic, with warm reflections and no generated text, logo, price, caption, or watermark.

Rejection reason: none; no candidate source was rejected.
Repairs: none. The accepted source was normalized once with repository sharp using aspect-preserving contain resize to 2160×3840, a dark neutral side background to preserve all three panels, toColourspace('srgb'), removeAlpha(), and PNG output. No anatomy or product geometry was stretched.

Exact prompt:

Use case: photorealistic-natural
Asset type: new live-action identity and product continuity board for the Sea Above S06–S07 first frames
Input images: Image 1: Candidate B facial-trait reference only, for plausible family resemblance; do not copy her age or adult identity onto the child. Image 2: Baroque Orbit overall product truth. Image 3: Baroque Orbit close-detail product truth. Image 4: Baroque Orbit product-lock geometry truth. Image 5: approved Sea Above British coastal-city street geography. Use only these five positive references, in this order, as guidance; do not use any legacy first frame, old character/environment/FX asset, old memory pair, or prior generated memory image.
Scene/backdrop: one wholly new vertical photographic continuity board with three clearly separated live-action views from the same fictional family memory, using a softly warm, fragile late-afternoon glow on a recognisable narrow British coastal-city street with wet limestone, old stone tenements, modest shopfronts, and gentle water reflections. Keep the world grounded and real, not painterly and not a fashion board.
Subjects and identity lock: the same fictional adult female relative, approximately 48 years old, and the same fictional child, approximately 8 years old, appear consistently across all three views. The adult is clearly older than Candidate B and clearly older than the child: natural mature facial structure, subtle forehead lines, crow’s feet and smile lines, realistic adult hands, medium-length light brown to dark blonde hair with a few pale strands, calm protective expression. The child has age-appropriate child anatomy, child-sized head and body proportions, rounder cheeks, smaller jaw, natural loose light-brown/blonde hair, curious but gentle expression; never a face-shrunk adult, teen, or miniature woman. They share only plausible family traits such as blue-grey eyes and a similar brow/cheek shape. Wardrobe is simple period-neutral everyday clothing in muted cream, navy, and soft brown; no logos, no text, no costumes.
Board views: View 1 is a clean, uncluttered portrait of the adult and child together from the waist up, faces and age difference plainly readable, hands relaxed and anatomically correct. View 2 is a natural right-ear profile of the adult relative alone, hair tucked back, with one exact Baroque Orbit earring sharply legible and correctly assembled: irregular textured gold hoop set with small green stones, the correct small gold connector ring, one irregular white baroque pearl, and one tiny terminal gold bead. Keep the ear anatomy natural; no second earring in this profile, no duplicated jewelry, no redesign. View 3 is a candid waist-up to three-quarter hand-holding moment on the same street: the child’s small hand naturally holds the adult’s larger hand, fingers and thumb correctly formed, both bodies fully plausible and consistent with Views 1–2; the adult’s right ear and the exact earring remain visible but unstaged.
Composition/framing: a single board, three photographic panels with subtle neutral gutters, each panel vertical or portrait-oriented and clearly separated; no collage confusion, no readable labels, no typography. Keep enough facial and hand detail for identity review, with realistic 35–50 mm lens perspective and natural eye level.
Lighting/mood: warm but restrained memory light, soft golden reflections on wet stone, gentle contrast, natural skin tones, subtle film grain, quiet tenderness and fragility.
Materials/textures: real skin pores, age texture, child skin, individual hair strands, imperfect cotton/wool, wet limestone, physically plausible reflections, authentic gold, green stones, irregular nacre pearl, natural hands and finger joints.
Constraints: this is a brand-new fictional family continuity anchor. Preserve the same adult relative and same child across all three panels. Keep the child clearly age-appropriate and much younger; keep the adult distinctly older, not a lookalike or face-swapped duplicate. Exact Baroque Orbit structure must remain one hoop + green stones + connector + one irregular pearl + terminal bead. Photorealistic live-action capture, not illustration, oil painting, concept art, CGI, or beauty-ad retouching. No generated text, logos, prices, captions, labels, or watermarks.
Avoid: old memory-pair image, CHAR_MR_TIDE assets, legacy first frames, old environments, old FX assets, any other woman replacing the adult relative, adult-looking child, face-shrunk adult, teen child, mismatched hands, fused fingers, extra fingers, missing fingers, deformed ears, extra jewelry, generic pearl drop, chain, wrong connector, missing terminal bead, mirrored product, painterly nostalgia, soft-focus concealment, glamour poster, plastic skin, synthetic hair, magical effects, gore, morphing, glitch, text, logo, watermark.

## S06

Reference roles: ordered positive inputs are listed below in generation order.
1. C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/continuity/memory-pair-v1.png — new continuity anchor, primary identity lock for the same child and adult relative, their age separation, wardrobe language, street, and product. SHA-256: A5C5C572FEF6D9E2B44322AA32F0E6A4DF14A53003D95EDC34E6715BFDBF58FF.
2. C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/source/main.jpg — overall Baroque Orbit product truth. SHA-256: DD12F12A092965A08AB9096DC3E4E79925779B641B29142B4194FF1C8BDF950F.
3. C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/source/detail-05.jpg — green-stone hoop, connector, irregular pearl, and terminal-bead detail. SHA-256: 73855F92B3426DE9428042561DF8AD5BD5A4EB98496BD31F2934ECEA6C67E2E5.
4. C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/views/product-lock.png — immutable product-lock geometry and material truth. SHA-256: 0B8671FAFCD9481DD53FC10EFB8ACC4671B901ABA647BF7C273069A01793517B.
5. C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/world/scene-03-s01-street-hook.png — approved street and wet-stone geography. SHA-256: B72AAFB5E8360E8CCD850E953DFD927778C8862354B446029FA59DC585E563DD.

All five positive local references were inspected with view_image at full resolution and at 270×480 before generation. Negative-history exclusions:
- CHAR_MR_TIDE_MEMORY_PAIR_001/source/memory-pair-lock.png and every old memory-pair image;
- every legacy first-frame image under first-frames/;
- all 05-characters/CHAR_MR_TIDE_ assets;
- all 03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001 assets;
- all 08-fx/FX_MR_ assets;
- all prior generated S06/S07 images.

Generated source path: C:/Users/11458/.codex/generated_images/01a0259c-d021-7523-94ba-aa92ec43f541/exec-d78d559b-f4ee-4a5b-b316-c054dd9cfc43.png
Generated source metadata: PNG, 941×1672, 3 channels/RGB, sRGB, no alpha. Generated source SHA-256: 7891E4458F762077A3B6565D4838081A53F4A994AE3B67DB7A16CF7E9E0ECC0E.
Accepted output path: C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S06.png
Accepted output metadata: PNG, 2160×3840, 3 channels/RGB, sRGB, no alpha. SHA-256: 8C1BC21DE27A472BD612FF8F7ADC2CB86A5858B203B84C86B8B0ECFF9E566E60.

Visual inspection: the source and accepted master were inspected with view_image at full resolution and 270×480; the source and final thumbnails were also inspected. The same child and adult from the new anchor are stable, with a clear age gap and no face-shrunk-adult read. The child’s small hand and adult’s larger hand are naturally joined with plausible fingers. The warm fragile light, wet limestone street, stone façades, and narrow British-city perspective match the new anchor and approved Scene 03. The adult’s right ear is visible and the earring reads naturally as the exact gold/green-stone hoop, connector, irregular pearl, and terminal gold bead without a product-ad pose. No text, logo, price, caption, or watermark is present.

Rejection reason: none; accepted on the first generation source.
Repairs: none. The accepted source was normalized once with repository sharp using aspect-preserving resize({ width: 2160, height: 3840, fit: cover, position: centre }), toColourspace('srgb'), removeAlpha(), and PNG output. No anatomy or product geometry was stretched.

Exact prompt:

Use case: photorealistic-natural
Asset type: vertical live-action first frame for Sea Above shot S06, childhood memory
Input images: Image 1: the new accepted memory-pair-v1 continuity anchor, primary identity reference for the same fictional 8-year-old child and the same fictional 48-year-old adult female relative; preserve their exact faces, age separation, hair, proportions, wardrobe language, and family resemblance. Image 2: Baroque Orbit overall product truth. Image 3: Baroque Orbit close-detail product truth. Image 4: Baroque Orbit product-lock geometry truth. Image 5: approved Sea Above British coastal-city street geography and wet-stone architecture. Use only these positive references, in this exact order. Do not use any old memory pair, legacy first frame, old character/environment/FX asset, or prior generated S06/S07.
Scene/backdrop: the same narrow British coastal-city street seen in the accepted memory anchor, old stone tenements, modest unbranded shopfronts, wet limestone paving, a shallow reflective puddle, and a recognisable receding street corridor. This is a fragile warm memory moment in real natural late-afternoon light, with soft gold on wet stone and gentle blue shadow; physically photographic, not painterly nostalgia.
Subjects and identity lock: the same fictional child from Image 1, approximately 8 years old with clearly child-sized body and head proportions, rounder cheeks, loose light-brown/blonde hair, blue-grey eyes, curious gentle expression, and the same navy jacket, cream knit sweater, and dark trousers. The same adult female relative from Image 1, approximately 48 years old and visibly mature with subtle forehead lines, crow’s feet and smile lines, light brown/dark blonde hair in a loose bun, blue-grey eyes, brown cardigan, navy sweater, and dark trousers. They are the same two people, not lookalikes; no face replacement, age drift, or extra person.
Action and product: the child stands at the adult’s left side and naturally holds the adult’s right hand at the center of the frame. Show anatomically correct interlaced fingers, two hands only, clear separation of the child’s smaller hand and the adult’s larger hand. The adult looks down toward the child with quiet protection while walking slowly; the child looks up. The adult’s right ear is in a clear three-quarter profile and the exact Baroque Orbit earring is legible at natural scale but not staged as an advertisement: one irregular textured gold hoop set with small green stones, the correct small gold connector ring, one irregular white baroque pearl, and one tiny terminal gold bead. Preserve natural ear anatomy, realistic attachment, and physically plausible sway; no extra jewelry.
Composition/framing: vertical 9:16, live-action 35–40 mm medium full-body or three-quarter walking frame, child and adult clearly readable with hands and adult’s right ear unobscured. Keep them off-center within the street depth, candid and unstaged; no fashion pose, no beauty close-up, no collage, no labels or typography. The street geometry must visibly match the memory anchor and approved Scene 03: wet paving, tall stone façades, warm windows and lamps, narrow perspective.
Lighting/mood: fragile warm memory light, restrained golden rim on hair and wet stone, natural skin tones, soft overcast fill, subtle film grain, quiet tenderness with a trace of sadness.
Materials/textures: real skin pores and age texture, realistic child skin, individual hair strands, imperfect wool/knit/cardigan fabric, wet limestone microtexture, natural reflected light, precise gold, green stones, nacreous irregular pearl, and plausible human fingers.
Constraints: preserve the exact same child and adult identities from Image 1 across this frame. Keep the child clearly age-appropriate and not an adult miniature. Keep the adult clearly older. Exact earring geometry must be visible and correct without becoming a product advertisement. Photorealistic live-action capture with natural anatomy and hands. No generated text, logo, caption, price, watermark, or painterly filter.
Avoid: old memory-pair lock, CHAR_MR_TIDE assets, legacy first frames, old environment/FX assets, any different woman, adult-looking child, face-shrunk adult, teen, extra people, extra hands, fused or missing fingers, malformed ears, hidden earring, wrong earring, generic pearl drop, chain, missing hoop, missing green stones, missing connector, missing terminal gold bead, mirrored jewelry, glamour editorial, soft-focus concealment, plastic skin, plastic hair, illustration, concept art, oil painting, CGI, magic dust, glitch, morph, gore, text, logo, watermark.

## S07

Reference roles: ordered positive inputs are listed below in generation order.
1. C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/continuity/memory-pair-v1.png — new continuity anchor, primary identity/product lock for the same child and adult relative. SHA-256: A5C5C572FEF6D9E2B44322AA32F0E6A4DF14A53003D95EDC34E6715BFDBF58FF.
2. C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S06.png — accepted S06 continuity anchor for the same identities, street, warm light, clothing, hand relationship, and pose. SHA-256: 8C1BC21DE27A472BD612FF8F7ADC2CB86A5858B203B84C86B8B0ECFF9E566E60.

Both positive local references were inspected with view_image at full resolution and at 270×480 before generation. Negative-history exclusions:
- CHAR_MR_TIDE_MEMORY_PAIR_001/source/memory-pair-lock.png and every old memory-pair image;
- every legacy first-frame image under first-frames/;
- all 05-characters/CHAR_MR_TIDE_ assets;
- all 03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001 assets;
- all 08-fx/FX_MR_ assets;
- all prior generated S07 images.

Generated source path: C:/Users/11458/.codex/generated_images/01a0259c-d021-7523-94ba-aa92ec43f541/exec-f20b7482-c693-4e8d-b884-d22b8fe0d90e.png
Generated source metadata: PNG, 941×1672, 3 channels/RGB, sRGB, no alpha. Generated source SHA-256: 13EFB8FAAC4034F3DBE942222061099A6501E7929DF0CB79B43334F6F93ED70F.
Accepted output path: C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S07.png
Accepted output metadata: PNG, 2160×3840, 3 channels/RGB, sRGB, no alpha. SHA-256: 12BEEC8F95D538728096D1A83C7B07AF021FFA1BCE1E0273AAF038FE1497E9C4.

Visual inspection: the source and accepted master were inspected with view_image at full resolution and 270×480; the source and final thumbnails were also inspected. S06 and S07 were then inspected side by side at full resolution and at 270×480. The child remains the same sharp, age-appropriate eight-year-old with stable face, hair, clothing, scale, and hand. The adult remains the same mature relative with the same face, bun, cardigan, navy sweater, right-ear earring, and hand. The adult begins to vanish only through a rising, transparent water veil: real refraction bends the street and breaks up contrast while preserving an intact recognizable face, ear, earring, shoulder, and hand. The lower adult body is optically lost into the reflective water, not melted. No gore, blood, liquefied flesh, facial morph, pixel glitch, magic dust, painterly dissolve, duplicate person, or generated text/logo/watermark is present.

Rejection reason: none; accepted on the first generation source.
Repairs: none. The accepted source was normalized once with repository sharp using aspect-preserving resize({ width: 2160, height: 3840, fit: cover, position: centre }), toColourspace('srgb'), removeAlpha(), and PNG output. The pair was not repaired because identity and the rising-water optical-refraction rule held in both full-resolution and thumbnail reviews.

Exact prompt:

Use case: photorealistic-natural
Asset type: vertical live-action first frame for Sea Above shot S07, memory erasure
Input images: Image 1: the new accepted memory-pair-v1 continuity anchor, primary identity lock for the same fictional 8-year-old child and the same fictional 48-year-old adult female relative, including the adult’s right-ear Baroque Orbit earring. Image 2: accepted S06 first-frame master, the immediate continuity anchor for the same street, warm memory light, body positions, clothing, hand relationship, and facial identities. Use exactly these two positive references in this order. Do not use any other image, especially no legacy first frame, old memory pair, old character/environment/FX asset, rejected source, or unrelated woman.
Scene/backdrop: the same narrow wet British coastal-city street and stone façades from S06, with the same warm fragile memory light, reflected gold on limestone, gentle blue shadow, and shallow puddles. Preserve the live-action photographic lens and perspective. The street remains solid and recognizable while a physically plausible layer of rising water passes through the scene.
Subjects and continuity lock: the child on the left is the same 8-year-old girl from the memory anchor and S06, with the same round cheeks, loose light-brown/blonde hair, blue-grey eyes, navy jacket, cream knit sweater, dark trousers, child-sized anatomy, and a fully sharp, emotionally present face and body. She remains materially real and stable, looking up toward the adult. The adult on the right is the same approximately 48-year-old female relative from the memory anchor and S06, with the same mature face, light brown/dark blonde hair in a loose bun, brown cardigan, navy sweater, dark trousers, and natural adult anatomy. Her right ear still carries the exact Baroque Orbit construction: one irregular textured gold hoop with green stones, connector, one irregular white baroque pearl, and one terminal gold bead; it remains briefly legible through the water distortion.
Action and optical erasure: show the adult beginning to vanish only because a rising sheet and ribbons of water refract and occlude her in a physically coherent way. The adult’s upper face, ear, shoulder, and hand remain recognizable but partially displaced behind transparent rippling water; her lower torso and legs are more optically lost into the reflective water veil. Use real refraction: bending street lines, layered caustic highlights, wavering silhouette edges, increased transparency and contrast loss behind water, and a rising waterline from the pavement upward. The child stays sharp and unaffected in front of or beside the water. The hand relationship must remain physically plausible: the child’s small hand reaches the adult’s larger hand, with the adult hand partly refracted but anatomically intact, no fusion.
Composition/framing: vertical 9:16, same 35–40 mm medium three-quarter walking composition as S06, child fully visible and crisp on the left, adult on the right, same street depth and horizon. The erasure is understated and cinematic, not a graphic effect; let one or two transparent rising water planes cross the adult while keeping the child and street readable. No collage, no typography, no staged product shot.
Lighting/mood: same warm memory light as S06, with natural blue-green refraction and muted highlights only inside the rising water; quiet grief and fragile loss, restrained exposure, real wet reflections.
Materials/textures: photographic skin pores and mature facial texture, real wet stone, transparent moving water with physically correct refraction and caustics, individual hair strands, imperfect cardigan and knit, natural hand anatomy, precise gold and nacre pearl.
Constraints: maintain the same two identities, ages, clothing, body proportions, street, lens, light, and spatial relationship as S06. Adult disappearance must read as physically plausible rising-water optical loss only. Child remains consistent, sharp, and materially present. Keep the exact earring recognizable without turning it into a product advertisement. No generated text, logos, captions, prices, or watermark.
Avoid: different woman, child identity drift, adult-looking child, face-shrunk adult, complete invisibility, teleportation, melting flesh, liquefied skin, gore, blood, wounds, body horror, facial morphing, warped anatomy, fused fingers, extra fingers, missing limbs, digital glitch, pixel breakup, scanlines, magic dust, sparkles, glowing aura, fantasy beams, painterly dissolve, oil-paint texture, cartoon, concept art, CGI ghost, smoke, fog replacing the adult, duplicate people, extra jewelry, wrong earring, missing green stones, missing connector, missing pearl, missing terminal bead, soft-focus concealment, text, logo, watermark.

## Task 4 pair review and normalization

The new memory anchor, S06, and S07 were each inspected at full resolution and 270×480 with view_image. S06 and S07 were additionally composed into temporary full-resolution and 270×480 side-by-side review boards and inspected with view_image. The child’s face, age-appropriate anatomy, hair, clothing, and scale hold across the pair; the adult’s mature face, hair bun, clothing, right-ear product, and hand hold across the pair. The S07 change is restricted to transparent rising-water refraction/optical loss. No legacy memory-pair, first-frame, character, environment, or FX asset was used as a positive input.

Final normalized masters:
- C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/continuity/memory-pair-v1.png — PNG, 2160×3840, RGB/3 channels, sRGB, SHA-256 A5C5C572FEF6D9E2B44322AA32F0E6A4DF14A53003D95EDC34E6715BFDBF58FF.
- C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S06.png — PNG, 2160×3840, RGB/3 channels, sRGB, SHA-256 8C1BC21DE27A472BD612FF8F7ADC2CB86A5858B203B84C86B8B0ECFF9E566E60.
- C:/Users/11458/.codex/worktrees/2822/mythrealms-shop/video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/S07.png — PNG, 2160×3840, RGB/3 channels, sRGB, SHA-256 12BEEC8F95D538728096D1A83C7B07AF021FFA1BCE1E0273AAF038FE1497E9C4.

Source outputs and all rejection history remain in C:/Users/11458/.codex/generated_images/01a0259c-d021-7523-94ba-aa92ec43f541/. No source was overwritten; no Git index operation was performed.
```
