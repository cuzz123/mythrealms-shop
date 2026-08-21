# FILE 001 — S01–S09 First-Frame Rebuild Design

Date: 2026-08-21

Status: User-approved specification

Project: Maverenne — `FILE 001: THE PEARL THAT ANSWERED`

## 1. Objective and Boundary

Rebuild all nine FILE 001 first frames on the approved visual foundation, then stop for user review. This phase produces still images, a numbered overview, provenance, hashes, automated media validation, and independent Luna Max visual QA.

This phase does not write or finalize the Seedance director card, generate video, consume paid Seedance credits, alter publication assets, or promote the new images over the legacy `first-frames/S01.png`–`S09.png` files.

## 2. Immutable Approved Inputs

### 2.1 Protagonist

The protagonist is Candidate B, selected by the user on `2026-08-21T21:16:38+08:00`:

- path: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/characters/candidate-b-dangerous-curiosity.png`
- SHA-256: `2CA5B608255BD2BE4DB3701CFFDA4EF4C5BA407F9CB85C7325ED37D84DF966F9`
- identity: fictional adult British woman, 23 years old, pale-gold wet blonde hair, vivid blue eyes, sharp eye shape, defined jaw, magnetic dangerous curiosity;
- fixed wardrobe in every present-day full or partial body view: refined cream/white camisole, cream/white structured high-waisted short skirt, and white practical flats;
- no gray or charcoal alternate skirt, no jacket, no costume restyle, no celebrity likeness, no age drift, and no fashion-poster posing.

The casting board is the only positive protagonist identity reference. Rejected character turnarounds, expression sheets, earring profiles, old first frames, and style tests are negative history and must not be supplied to image generation.

### 2.2 Product

Baroque Orbit product truth is immutable:

- `source/main.jpg` — SHA-256 `DD12F12A092965A08AB9096DC3E4E79925779B641B29142B4194FF1C8BDF950F`
- `source/detail-05.jpg` — SHA-256 `73855F92B3426DE9428042561DF8AD5BD5A4EB98496BD31F2934ECEA6C67E2E5`
- `views/product-lock.png` — SHA-256 `0B8671FAFCD9481DD53FC10EFB8ACC4671B901ABA647BF7C273069A01793517B`

Whenever visible, the right-ear earring must preserve one gold hoop set with green stones, the correct connector, one irregular white baroque pearl, and the terminal gold bead. No extra pearl, missing bead, chain substitution, mirrored construction, or generic pearl drop is accepted.

### 2.3 World

All five user-approved world masters under `visual-reconstruction/world/` are positive environment references. They lock the British coastal-city geography, horizon-spanning overhead ocean, irregular ground-to-sky reverse rain, storm-overcast light, physical scale, and restrained Mother language.

The old `ENV_MR_SEA_ABOVE_OLD_CITY_001` environment, old first frames, and old FX anchors are not positive image inputs. They may be inspected only to identify failures to avoid.

## 3. Visual Language

- Grounded live-action science-fiction disaster epic, photographed like a high-budget Hollywood feature or prestige television production on real British locations with invisible VFX.
- Real skin pores, wet-hair clumping, imperfect cloth, plausible anatomy, restrained colour, organic grain, soft highlight roll-off, and physically coherent atmospheric depth.
- 28–40 mm spherical character coverage; 14–18 mm rectilinear world-scale coverage where specified.
- Storm cyan is motivated only by the overhead sea. Skin, stone, brick, gold, pearl, and cloth remain natural.
- Reject oil-painting texture, concept art, glossy CGI, synthetic poster composition, wax skin, plastic hair, perfect symmetry, centred runway posing, duplicated people or buildings, readable generated text, logos, prices, and watermarks.

## 4. Shot Contracts

Every master is a vertical 2160×3840 RGB/sRGB PNG. Each still must communicate its narrative job before motion or audio exists.

### S01 — Reverse-rain rule

- Feed-thumbnail hook: Candidate B stands off-axis in the approved cream outfit while layered crowds flee and visibly remove jewellery.
- Multiple irregular filaments originate at puddles, gutters, coats, and paving and pull upward into the overhead sea.
- Upward direction must be readable from suction origins and tapered trails; no splash crowns, downward rain, bead chains, or perfect columns.
- No title, logo, product name, or fade-in plate.

### S02 — Pearl answers

- Tight right-profile or three-quarter close-up of Candidate B, exact identity and wet hair preserved.
- Exact Baroque Orbit earring is the sharp visual anchor and begins to cant toward the sky; face remains anatomically natural.
- Background world and crowd are subordinate but coherent with S01. No redesigned jewellery or beauty-campaign retouching.

### S03 — Reveal sky-sea

- A single reverse-rain filament creates a readable visual path from street level to the ocean spanning the entire sky.
- Candidate B may be small or partly seen, but geography, sea depth, and vertical scale must match approved world scenes.
- Use a low 14–18 mm composition with real architecture and asymmetrical depth; no decorative ceiling-water effect.

### S04 — Establish Mother scale

- Ultra-wide city-scale view with the incomplete Mother shadow crossing several districts and dimming the environment.
- Show no eye, face, limb, teeth, tentacle, or complete body.
- The shadow, city, overhead sea, and reverse rain share one coherent perspective and light field.

### S05 — Eye opens

- One immense eye is partially visible beneath the overhead ocean, large enough that its scale is inferred from city landmarks and atmospheric occlusion.
- The iris or scleral microstructure may echo irregular pearl nacre, but it is biological, wet, restrained, and not a literal jewellery collage.
- No creature body, face, mouth, tentacle, magic beam, gore, or generic energy particles.

### S06 — Childhood memory

- Create a new memory identity pair compatible with Candidate B: a fictional child version and an adult female relative wearing the exact Baroque Orbit earring.
- The child holds the relative's hand on a recognisable but memory-softened version of the same street.
- Warm, fragile memory light is allowed, but faces, hands, product geometry, and spatial relationship remain photographic.
- The rejected old `memory-pair-lock.png` is not a positive reference.

### S07 — Memory erased

- The same newly generated adult relative from S06 is refracted by rising water and beginning to disappear, while the child identity remains consistent.
- Erasure reads as optical loss of memory, not gore, melting skin, horror-body deformation, digital glitch, or painterly dissolve.
- S06 and S07 must be accepted or repaired as a continuity pair.

### S08 — Mother reversal

- Candidate B returns in the cream outfit with the exact earring; her iris begins a subtle physically plausible change.
- Pearls across the city respond in depth while the environment confirms a city-wide event; Candidate B remains the emotional anchor.
- No superhero beam, glowing jewellery advertisement, full Mother reveal, or excessive magic particles.

### S09 — Archive and loop

- Clean dark atmospheric plate with one real droplet travelling upward through frame, composed to connect visually back to S01.
- No generated typography, title, logo, archive label, subtitle, or watermark; exact titles are reserved for post-production.

## 5. Versioning and Asset Layout

All new work is isolated under:

`video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/v1/`

Required outputs:

- `S01.png` through `S09.png`;
- `3x3-overview.png`;
- `continuity/memory-pair-v1.png` when needed to lock S06/S07;
- `first-frame-contract.json`;
- `reports/generation.md`;
- `reports/character-product-review.md`;
- `reports/world-narrative-review.md`;
- `reports/final-visual-review.md`.

Generated-source files and repair variants remain traceable in the report but are not silently promoted over accepted v1 masters. Any later iteration uses `v2/`, never overwrites `v1/`.

## 6. Generation and Repair Workflow

1. Verify immutable input hashes and create a fail-closed version contract and validator.
2. Use built-in image generation, one call per distinct image or one targeted repair. Do not use CLI/API image-generation fallback.
3. Generate S01–S05 first, visually inspect each full-resolution frame, and repair only concrete failures with a single-variable instruction.
4. Build a new memory continuity anchor, then generate S06 and S07 as a locked pair.
5. Generate S08 and S09, inspect them, and create the deterministic numbered overview.
6. Normalize accepted masters to 2160×3840 RGB/sRGB PNG with `sharp`, using crop and padding only when necessary and never stretching anatomy or product geometry.
7. Record exact prompt, positive reference role, generated source, output path, dimensions, colour mode, SHA-256, inspection result, rejection reason, and repair history for every master.
8. Independent Luna Max reviewers separately assess identity/product continuity, world/narrative continuity, and live-action visual quality. A Critical issue fails closed and returns only the affected frame or pair for targeted repair and re-review.

## 7. Seedance Storyboard Skill Compatibility

The standard `seedance-storyboard-production` B/D/F three-shot slot contract is not applied because FILE 001 already has an immutable nine-shot S01–S09 structure. The compatible control principles remain binding: non-destructive versioning, absolute traceable inputs, per-image provenance, independent QA, and fail-closed acceptance.

## 8. Acceptance and Stop Gate

The v1 package passes only when:

- all nine masters exist at 2160×3840 RGB/sRGB PNG;
- Candidate B identity, age, wet blonde hair, blue eyes, cream wardrobe, and anatomy remain stable wherever visible;
- the exact product geometry is correct wherever visible;
- S01 communicates reverse rain at thumbnail size;
- S03–S05 share geography, sea height, light, and Mother scale;
- S06/S07 share the new child and adult-relative identities;
- S09 contains no generated text;
- the validator and all independent Luna Max reviews pass;
- the user explicitly approves the nine full-resolution frames and overview.

After presenting the completed v1 package, production stops. The final director card requires a separate approved phase. Any paid Seedance generation requires a separate action-time confirmation immediately before credits are consumed.
