# Product Imagery Photo-Restyle Design

## Objective

Rebuild the four-image package for `pearl-series-01` so it reads as a coherent real editorial photo shoot while preserving the supplier product's visible construction at least 95%. Use this corrected package as the realism gate before resuming the remaining pilot products.

## Approved Method

Use source-anchored photo restyling. Every final begins from the closest supplier photograph and asks the image model to change only the surrounding surface, background, framing, and lighting. The product is not extracted and pasted onto a separate plate.

- Main and macro begin from the watermark-free product crop in `pearl-series-01-detail1.webp`.
- On-model begins from the correctly worn supplier image `pearl-series-01-detail3.webp`; the hand, one-finger placement, ring, and contact relationship remain fixed.
- Lifestyle begins from the product photograph and expands it into a plausible cafe-table photograph at real ring scale.
- One slot is generated per call. A result from one slot is never reused as the product source for another slot.

## Explicitly Rejected Methods

- Hard alpha cutouts placed on an unrelated surface.
- Deterministic jewelry overlays on a separately generated hand.
- Product layers with dark extraction fringes, mismatched sharpness, or mismatched color temperature.
- Floating jewelry, oversized jewelry, missing contact shadows, or depth of field that differs between product and scene.
- Full-frame regeneration that changes pearl count, wire topology, coiled band construction, or correct wearing.

## Visual Contract

The package uses restrained warm linen, pale limestone, and Mediterranean cafe light. Product scale must remain physically credible. Light direction, softness, reflections, contact shadow, grain, focus, and depth of field must agree across the product and its surroundings.

The ring has ten pink-white pearls in a dense asymmetric branch, fine gold wire stems, wrapped junctions, and a tightly coiled circular band. On-model it encircles exactly one proximal finger segment with the pearl branch on the back of the hand.

## Generation And Review

Each slot receives at most three source-anchored attempts. Review the native output before normalization.

Reject when:

- any product topology changes;
- the product looks pasted, floating, too sharp, too soft, too large, or too small for the scene;
- the on-model image spans two fingers or moves the branch away from the back of the hand;
- text, logos, watermarks, UI, or unrelated jewelry appears.

If no attempt passes, keep the manifest record `draft` and use the original supplier image as the storefront fallback. Never approve a visually fake compromise.

## Delivery

Approved outputs are `1600x2000` 4:5 WebP files no larger than `900KB`, named `01-main.webp`, `02-on-model.webp`, `03-macro.webp`, and `04-lifestyle.webp`. The QA record stores source image, generation attempt, topology observations, realism observations, and final approval for each slot.
