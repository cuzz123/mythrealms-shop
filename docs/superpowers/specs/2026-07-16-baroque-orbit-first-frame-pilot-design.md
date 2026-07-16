# Baroque Orbit First-Frame Pilot Design

## Goal

Create four 9:16 first-frame images for a cold-start social ad featuring
`The Baroque Orbit - Earrings`. The images are reviewed before any Xiaoyunque
Seedance 2.0 Fast credits are spent.

The pilot validates product fidelity, first-frame-to-video suitability, and a
repeatable review process. It does not publish to the storefront or generate a
complete campaign batch.

## Product Lock

- Product ID: `new-series-003`
- Product name: `The Baroque Orbit - Earrings`
- Source directory:
  `public/images/products/new-series/new-series-baroque-pearl-hoops/`
- Required appearance: two irregular white baroque pearl drops, polished gold
  circular hoop findings, small green accent stones on the hoop face, and one
  small gold bead at the end of each pearl.

The generated frames must preserve the earrings' asymmetric organic pearl
shapes. They must not turn the pearls into smooth spheres, duplicate parts,
change the hoop geometry, or invent extra stones.

## Frame Set

### `FF_BAROQUE_ORBIT_01_MACRO_HOOK`

- Extreme macro product detail.
- One pearl surface and part of its gold hoop dominate the frame.
- Dark neutral seamless background with controlled side light.
- No model, text, furniture, flowers, cups, books, tables, vases, or unrelated
  props.
- Intended use: static opening with a short digital push-in.

### `FF_BAROQUE_ORBIT_02_SUSPENDED_HERO`

- Both earrings hang freely against a dark neutral background.
- Full product pair remains visible and separated.
- Clean highlight along the pearl ridges and gold hoops.
- No visible support hardware and no unrelated props.
- Intended use: primary four-second image-to-video candidate with a subtle
  pendulum movement and controlled camera approach.

### `FF_BAROQUE_ORBIT_03_WEARING_PROFILE`

- Original adult model in a clean side-profile close-up.
- One earring is worn naturally and remains unobstructed.
- Hair is swept behind the visible ear; hands stay out of frame.
- The background is dark and simple, with no recognizable location or props.
- Intended use: optional four-second image-to-video candidate with a small head
  turn only.

### `FF_BAROQUE_ORBIT_04_CLEAN_END_FRAME`

- Both earrings presented clearly on a clean off-white surface.
- Product pair occupies the lower-left and center area.
- Upper-right area remains visually quiet for copy added during post-production.
- No generated lettering, logo, packaging, furniture, plants, or decorative
  objects.
- Intended use: static end frame and call-to-action background.

## Generation Rules

- Generate each frame separately using the product source images as references.
- Use no generated text. All copy and calls to action are added in post.
- Treat the product reference as the geometry and material authority.
- Treat any character reference as identity and styling guidance only; it must
  not change the product.
- Do not combine the four frames into a contact sheet before review.
- Keep the visual language restrained: commercial product realism, physically
  plausible light, and no decorative scene dressing.

## Credit Plan

Still-frame generation does not consume the Xiaoyunque video allowance. After
review, animate at most two approved frames:

1. Animate `FF_BAROQUE_ORBIT_02_SUSPENDED_HERO` first for four seconds.
2. Animate `FF_BAROQUE_ORBIT_03_WEARING_PROFILE` only if its product fidelity
   passes review.
3. Keep frames 01 and 04 static unless later performance data justifies another
   video-generation attempt.

## Acceptance Criteria

- All four files are portrait 9:16 images and readable at social-feed size.
- The product silhouette, materials, findings, and count match the source.
- No unrelated props or generated text appear.
- The macro frame has a clear visual hook without hiding the product identity.
- The suspended frame provides safe motion space around both earrings.
- The wearing frame keeps the ear and earring unobstructed and uses no visible
  hand interaction.
- The end frame provides clean copy space without making the product too small.
- Failed frames are regenerated individually; approved frames are never
  regenerated as part of another frame's repair.

## Asset Handoff

Approved first frames become shot-package assets in the MythRealms Obsidian
影视资产库. Their asset cards record the product source, frame role, generation
prompt version, approval status, and any later Seedance take IDs. They are not
copied into the storefront's public product gallery.
