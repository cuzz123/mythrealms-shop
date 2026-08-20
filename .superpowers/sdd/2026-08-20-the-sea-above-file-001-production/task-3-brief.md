### Task 3: Protagonist and Memory Anchors

**Owner:** Fresh luna-worker session. The turnaround and memory pair may begin in parallel with Tasks 2 and 4; Step 2 must wait for Task 2 `product-lock.png`.

**Interfaces:**
- Consumes: the current adult protagonist contract and Task 2 product lock for the wearing profile.
- Produces: `character-turnaround.png`, `expression-sheet.png`, `earring-profile.png`, and `memory-pair-lock.png`.

## Binding protagonist contract

- The protagonist is one unequivocally adult fictional woman, exact age 23 (within the adult 21–24 range), youthful but never teenager-like or childlike.
- She is strikingly beautiful with a refined premium British cold-elegance / fantasy-editorial presence, not generic influencer glamour.
- Hair is cool pale champagne/ash blonde, shoulder length, visibly wet from rain, with a strict center part, damp strands at both temples, and loose wet ends at the shoulders.
- Eyes are vivid blue-green. Skin is natural and realistic, with visible pores and faint freckles; anatomy, ears, hands, and feet must remain believable.
- Proportions are tall-looking, slim, athletic-hourglass, with long legs, long neck, naturally toned shoulders and arms, defined waist, and relaxed adult posture.
- Acting and makeup are restrained: closed mouth, no smile, no provocative or glamour pose, no influencer gloss, no plastic or airbrushed skin.

## Binding wardrobe contract

- The outfit is a cool/light coordinated premium British fantasy-editorial look: a fully opaque refined fitted dove-ice camisole top with broad straps and a modest straight neckline, paired with a structured high-waisted pale slate-blue short skirt ending above the knee.
- Arms and legs are bare. The same outfit is used consistently across all four anchors.
- No outer layer, jacket, tights, sheer or transparent fabric, lingerie styling, cleavage emphasis, or nudity.

## Binding product and memory contracts

- The turnaround and expression sheet show no jewelry.
- The wearing profile and memory pair show exactly one Baroque Orbit earring on the adult's visible anatomical right ear and no other jewelry.
- The earring geometry is immutable: polished closed circular gold hoop; continuous tiny green stones on the hoop front; exactly one gold connector ring; one asymmetric organically ridged white baroque pearl drop; one tiny terminal gold bead.
- The memory child is around eight, fully clothed, non-identifiable, mostly rear/three-quarter, and distinct from the adult. The scene shows safe hand-holding with no danger, injury, fear, or sensational framing.

## Production steps

- [ ] **Step 1: Generate `character-turnaround.png`**

  Generate the same age-23 adult blonde woman in front, both profiles, and rear three-quarter views. Use photorealistic-natural 85mm editorial realism, neutral cool grey daylight, real skin/anatomy, the binding wardrobe, and no jewelry.

- [ ] **Step 2: Generate `expression-sheet.png` and `earring-profile.png`**

  The expression sheet contains neutral observation, delayed recognition, contained fear, and upward resolve. Preserve the exact adult identity, age 23, blonde wet center-parted hair, vivid blue-green eyes, proportions, outfit, and restrained acting. The profile faces camera-left so the anatomical right ear is visible and carries exactly one immutable Baroque Orbit earring.

- [ ] **Step 3: Generate `memory-pair-lock.png`**

  Show the safe, fully clothed, non-identifiable child mostly from rear/three-quarter view holding one distinct adult woman's hand on the same wet old-city street. The adult is the same exact age-23 blonde protagonist in the binding outfit and wears the exact right-ear earring. Keep adult and child clearly distinct and free of danger.

- [ ] **Step 4: Inspect, document, and commit**

  Use built-in image generation only, one call per distinct asset or repair. Inspect every generated output and the Task 2 product lock with `view_image`. Reject identity drift, age drift, loss of blonde continuity, plastic skin, duplicated fingers, malformed ears, child/adult face blending, added jewelry, glamour posing, smiling, or changed earring geometry. Keep rejected variants out of accepted filenames. Document prompts, provenance, invariants, visual QA, rejection/repair history, verification, files, commit, self-review, and concerns in `task-3-report.md` and keep both character READMEs aligned with this contract.

## Owned outputs

- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/`
- `video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_MEMORY_PAIR_001/`
- `.superpowers/sdd/2026-08-20-the-sea-above-file-001-production/task-3-report.md`
