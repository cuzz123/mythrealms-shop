# Baroque Orbit First-Frame Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate and visually verify four independent 9:16 first frames for the `The Baroque Orbit - Earrings` cold-start advertising pilot.

**Architecture:** Each frame is generated separately from explicit local product references so a failed frame can be repaired without changing approved work. Product-only frames use only product photography; the wearing frame adds one approved original-character reference with the product images remaining the geometry authority. Approved outputs are then linked into the Obsidian 影视资产库 as one shot package.

**Tech Stack:** Codex image generation, local image references, `view_image` visual verification, Markdown/JSON asset metadata, Obsidian vault.

## Global Constraints

- Output is portrait 9:16 and contains no generated text.
- Preserve two irregular white baroque pearl drops, gold circular hoops, green accent stones, and terminal gold beads.
- Do not add cups, books, tables, vases, flowers, furniture, packaging, or unrelated props.
- Generate and review every frame independently.
- Do not copy approved frames into the storefront public product gallery.
- Animate at most two approved frames in Xiaoyunque after still-frame review.

---

### Task 1: Generate the macro hook

**Files:**
- Reference: `public/images/products/new-series/new-series-baroque-pearl-hoops/main.jpg`
- Reference: `public/images/products/new-series/new-series-baroque-pearl-hoops/detail-05.jpg`
- Planned output: `video-pipeline/asset-library/09-shot-templates/SHOT_BAROQUE_ORBIT_COLD_START_001/first-frames/FF_BAROQUE_ORBIT_01_MACRO_HOOK.png`

**Interfaces:**
- Consumes: product appearance and material locks from the design spec.
- Produces: one static opening frame suitable for a digital push-in.

- [ ] **Step 1: Generate the frame from the two product references**

Use this exact generation brief:

```text
Create a single 9:16 luxury commercial product photograph using the referenced earrings as strict geometry and material authority. Extreme macro crop: one irregular white baroque pearl surface fills the lower center while part of its polished gold circular hoop and tiny green accent stones remain visible and recognizable. Dark charcoal seamless background, controlled soft side light from frame left, crisp nacre ridges and restrained specular highlights, shallow but sufficient depth of field. Preserve the organic asymmetric pearl shape, gold terminal bead, hoop structure, and green stones exactly. One earring detail only; do not invent or duplicate parts. No model, text, logo, packaging, flowers, plants, cups, books, tables, vases, furniture, or decorative props.
```

- [ ] **Step 2: Inspect the result at original resolution**

Run `view_image` with `detail: original`. Verify product recognition, macro sharpness, and absence of prohibited objects.

- [ ] **Step 3: Accept or repair only this frame**

Accept when the pearl remains irregular, part of the hoop and green stones are visible, and the background is empty. If it fails, regenerate with the same references and change only the failing clause.

### Task 2: Generate the suspended hero

**Files:**
- Reference: `public/images/products/new-series/new-series-baroque-pearl-hoops/detail-05.jpg`
- Reference: `public/images/products/new-series/new-series-baroque-pearl-hoops/detail-06.jpg`
- Planned output: `video-pipeline/asset-library/09-shot-templates/SHOT_BAROQUE_ORBIT_COLD_START_001/first-frames/FF_BAROQUE_ORBIT_02_SUSPENDED_HERO.png`

**Interfaces:**
- Consumes: approved product geometry locks.
- Produces: primary four-second image-to-video start frame.

- [ ] **Step 1: Generate the frame from the two product references**

Use this exact generation brief:

```text
Create a single 9:16 luxury commercial hero photograph of the exact referenced earring pair. Both earrings hang freely in the upper-middle of frame against a clean dark charcoal seamless background, separated with clear negative space and fully visible from gold hoop to pearl tip. Preserve the two distinct irregular white baroque pearl shapes, polished gold circular hoops, tiny green accent stones on the hoop faces, and small gold terminal beads exactly. Soft directional key from frame left and a narrow controlled rim from frame right reveal nacre ridges without changing color. No visible support wire, no text, no logo, no packaging, no model, no flowers, plants, cups, books, tables, vases, furniture, or decorative props.
```

- [ ] **Step 2: Inspect motion safety**

Verify both earrings have clear space to sway without crossing the frame edge or each other, and that the pair is not duplicated or fused.

- [ ] **Step 3: Accept or repair only this frame**

Accept only when the full pair and all findings remain legible. Repair one variable at a time if support hardware, extra objects, or product drift appears.

### Task 3: Generate the wearing profile

**Files:**
- Product reference: `public/images/products/new-series/new-series-baroque-pearl-hoops/main.jpg`
- Product reference: `public/images/products/new-series/new-series-baroque-pearl-hoops/detail-05.jpg`
- Character reference: `video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_MUSE_EMERALD_001/source/three-view-crops/left_front.jpg`
- Planned output: `video-pipeline/asset-library/09-shot-templates/SHOT_BAROQUE_ORBIT_COLD_START_001/first-frames/FF_BAROQUE_ORBIT_03_WEARING_PROFILE.png`

**Interfaces:**
- Consumes: product geometry authority plus approved original-character identity and wardrobe reference.
- Produces: optional four-second wearing shot start frame.

- [ ] **Step 1: Generate the frame from all three references**

Use this exact generation brief:

```text
Create a single 9:16 commercial portrait close-up using the referenced original adult model for identity, hairstyle, and emerald one-shoulder wardrobe only. Frame from upper chest to above the head in a clean left-facing three-quarter side profile. Hair is swept fully behind the visible ear; both hands and arms are outside the frame. Replace the model's existing floral earring with one exact earring from the product references: irregular white baroque pearl drop, polished gold circular hoop, tiny green accent stones on the hoop face, and small gold terminal bead. The earring hangs naturally, remains fully visible, and is not enlarged. Dark neutral seamless background, soft portrait key and subtle rim light. No text, logo, furniture, location details, flowers, plants, cups, books, tables, vases, or other jewelry.
```

- [ ] **Step 2: Inspect identity and product separation**

Verify the model remains the approved original character, the old floral earring is absent, the new earring matches the product, and no hand occludes the ear.

- [ ] **Step 3: Accept or repair only this frame**

Product fidelity has priority over facial or fabric micro-detail. Reject any smooth spherical pearl, oversized earring, extra jewelry, hand, or partial crop of the product.

### Task 4: Generate the clean end frame

**Files:**
- Reference: `public/images/products/new-series/new-series-baroque-pearl-hoops/detail-06.jpg`
- Reference: `public/images/products/new-series/new-series-baroque-pearl-hoops/detail-05.jpg`
- Planned output: `video-pipeline/asset-library/09-shot-templates/SHOT_BAROQUE_ORBIT_COLD_START_001/first-frames/FF_BAROQUE_ORBIT_04_CLEAN_END_FRAME.png`

**Interfaces:**
- Consumes: product geometry lock.
- Produces: static call-to-action background with copy-safe space.

- [ ] **Step 1: Generate the frame from the two product references**

Use this exact generation brief:

```text
Create a single clean 9:16 luxury ecommerce end frame using the exact referenced pair of earrings as strict geometry and material authority. Place both earrings clearly in the lower-left and lower-center on a seamless warm off-white surface with very soft contact shadows. Preserve each irregular white baroque pearl shape, polished gold circular hoop, tiny green accent stones, and small terminal gold bead exactly. Keep the upper-right forty percent visually empty for copy to be added later in post. Neutral soft studio light, accurate white balance, restrained highlights. No generated lettering, logo, packaging, model, flowers, plants, cups, books, tables, vases, furniture, or decorative objects.
```

- [ ] **Step 2: Inspect copy-safe composition**

Verify the upper-right remains empty while the product is still large enough to read on a phone.

- [ ] **Step 3: Accept or repair only this frame**

Reject extra props, generated text, overly small product, merged earrings, or changed pearl geometry.

### Task 5: Review and hand off approved frames

**Files:**
- Create after image approval: `video-pipeline/asset-library/09-shot-templates/SHOT_BAROQUE_ORBIT_COLD_START_001/template.json`
- Create after image approval: `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Baroque Orbit Cold Start 9x16.md`
- Copy after image approval: the four approved first-frame PNG files into the planned output directory.

**Interfaces:**
- Consumes: four individually approved image-generation outputs.
- Produces: one linked Obsidian shot package with traceable frame roles and later Seedance take IDs.

- [ ] **Step 1: Present all four independent outputs for visual review**

Show each file separately at full frame, with its frame ID. Do not make a contact sheet until individual review is complete.

- [ ] **Step 2: Record approval status per frame**

Use `approved`, `repair`, or `rejected`. Never regenerate an approved frame while repairing another frame.

- [ ] **Step 3: Create the shot package only after approval**

The JSON manifest records frame ID, role, local file path, source references, prompt version `v1`, approval status, and empty `seedance_take_ids`. The Obsidian card links the manifest, source product, four frames, and planned animation order: frame 02 first, frame 03 second only after product-fidelity approval.

- [ ] **Step 4: Verify asset handoff**

Confirm all links resolve inside the Obsidian vault, the storefront product gallery is unchanged, and the four source product photographs remain untouched.
