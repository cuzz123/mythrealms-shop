# MythRealms Product Imagery Reconstruction Design

## Goal

Rebuild the storefront imagery for all 45 approved pearl-led SKUs using the visual language established by the 72 generated references in:

`C:\Users\11458\.codex\generated_images\019f4467-ba2f-7870-96c2-66c210cfcd72`

The resulting catalog should feel like one photographed editorial campaign while preserving each real product's structure, scale, color, and wearing direction with at least 95% visual similarity to the supplier source gallery.

The work is local-only until the user approves the reconstructed catalog. It must not be deployed to Vercel as part of this project.

## Scope

- Reconstruct imagery for the 20 existing Pearl Edit SKUs and 25 approved `new_series` SKUs.
- Produce four final images for each SKU, for a total of 180 approved images.
- Begin with a five-SKU pilot covering the highest-risk product types.
- Preserve all original supplier files unchanged as the source of truth and fallback.
- Update storefront image ordering, aspect ratios, metadata, feeds, and tests only after the pilot is approved.

## Non-Goals

- Do not publish the new imagery to Vercel during this project.
- Do not generate images for the 67 held-back `new_series` products.
- Do not invent new jewelry structures, materials, gemstone claims, clasps, or product variants.
- Do not remove or overwrite supplier originals.
- Do not treat visual similarity as permission to accept changed pearl counts, chain paths, fittings, or wearing directions.

## Reference System

### Product Identity References

For each SKU, select two to four of the clearest supplier images. These images define the product identity and override all stylistic references. Record the following before generation:

- pearl, bead, stone, shell, and charm count where visible;
- shape, spacing, color, and relative scale;
- metal color and wire or chain construction;
- clasp, hook, hinge, cuff opening, and connector type;
- pendant order and chain path;
- correct wearing side, orientation, and attachment point.

### Style References

The 72 generated images are style, casting, wardrobe, lighting, composition, and setting references only. Jewelry shown in those references must never replace or modify the target SKU.

The approved visual language is:

- Mediterranean courtyards, seaside stone, flower storefronts, quiet interiors, and olive-tree terraces;
- white, ivory, pale blue, and black linen or satin clothing;
- natural directional sunlight with readable shadows and warm gold reflections;
- realistic skin texture, flyaway hair, restrained makeup, and editorial rather than studio-perfect posing;
- warm-white linen or limestone product still lifes, with occasional controlled black editorial backgrounds;
- adult models suitable for a Western-market jewelry campaign, with white, Black, Latina, Mediterranean, mixed-heritage, and other diverse casting across the catalog.

The malformed bracelet campaign image identified in the asset-library design is excluded as a product reference.

## Deliverables Per SKU

Each SKU receives an `editorial-v2` package containing four 1600 by 2000 pixel, 4:5 WebP images:

1. `01-main.webp`: clean product-led hero on warm-white linen or limestone.
2. `02-on-model.webp`: believable adult model wearing the exact product correctly.
3. `03-macro.webp`: close structural view of pearls, metalwork, connectors, or clasp.
4. `04-lifestyle.webp`: product-led Mediterranean lifestyle scene with the item still clearly readable.

Final files use this non-destructive path:

`D:\mythrealms-shop\public\images\products\editorial-v2\<sku>\`

Each package also records source references, prompts, generation attempts, rejection reasons, approval status, and the final structure checklist. The original supplier gallery remains in its current location.

## Pilot

The first production batch contains 20 images for five representative SKUs:

- `pearl-series-01`: ring orientation, finger placement, and pearl cluster structure;
- `new-series-round-shell-disc-drops`: earring hooks, shell discs, pearl alignment, and paired symmetry;
- `new-series-shell-twist-pearl-cuff`: cuff opening, wire twist, end pearls, and wrist orientation;
- `new-series-pearl-dreamcatcher-lariat`: long chain path, pendant order, drop length, and neckline scale;
- `new-series-pearl-glasses-chain`: eyewear connectors, temple attachment, chain routing, and paired length.

The remaining 40 SKUs are not generated until the user approves the pilot comparison sheet.

## Production Method

Use a product-locked hybrid workflow rather than full-frame AI reconstruction.

### Product And Macro Images

- Preserve the product pixels or a high-fidelity extracted product layer whenever practical.
- Replace or rebuild only the background, surface, lighting integration, and removable supplier text or watermark regions.
- Keep the product silhouette and all visible construction details unchanged.

### On-Model Images

- Use the supplier product and wearing views as identity anchors.
- Generate the model, pose, wardrobe, and setting around a fixed jewelry placement plan.
- Preserve or composite the product region when an adequate source wearing view exists.
- For products without a wearing view, construct the model pose around an exact product composite and add occlusion, contact shadow, and reflections without redrawing the jewelry.
- Rings must sit around the finger, bracelets around the wrist, earrings through the earlobe or correct fitting, necklaces against the neckline, and eyewear chains on both temple connectors.

### Lifestyle Images

- Keep the product as the visual subject, not a tiny decorative element.
- Use generated scenes only after product scale, pose, and placement have been defined.
- Avoid unrelated props, logos, text, watermarks, and fashion accessories that compete with the SKU.

### Fallback Rule

If two generation attempts change the product structure, stop full-image regeneration. Switch to deterministic product-layer compositing and regenerate only the surrounding model, scene, lighting, or occlusion masks.

## Quality Gates

Every final image must pass both product fidelity and realism review.

### Product Fidelity

Reject the image if any of these change:

- pearl, bead, shell, stone, or charm count;
- product silhouette, chain path, spacing, or relative proportions;
- metal color, earring hook, clasp, cuff opening, hinge, or connector;
- pendant order, front and back orientation, or correct wearing direction;
- product scale on the body beyond a plausible change caused by perspective.

The 95% threshold is evaluated with side-by-side visual inspection and a SKU-specific structure checklist. Critical topology changes are automatic failures even when the rest of the image appears similar.

### Realism

Reject the image for:

- malformed hands, fingers, ears, eyewear temples, necklines, or body anatomy;
- floating jewelry, missing contact shadows, impossible chain tension, or hair passing through metal;
- plastic skin, repeated facial details, excessive smoothing, or implausible pores;
- inconsistent light direction, reflections, perspective, or depth of field;
- supplier watermarks, generated text, logos, or visible source artifacts.

## Review Artifacts

For each pilot SKU, produce a comparison panel containing:

- the selected supplier identity references;
- all four reconstructed images;
- the structure checklist and pass or fail status;
- any known limitations that remain visible.

The user reviews the 20-image pilot before any storefront mapping changes or remaining batch generation.

## Storefront Integration

After pilot approval, the storefront uses the four images in this order:

1. product card and gallery main image;
2. product-card hover and first wearing image;
3. structural detail;
4. lifestyle context.

Product cards and product-detail galleries use a consistent 4:5 frame. Image alternative text describes the real product and view without claiming the model is a real customer. Google product feeds, structured data, and any storefront image maps use only approved `editorial-v2` assets.

An SKU without four approved assets continues to use its source-preserved gallery. Integration must be per-SKU and reversible.

## Verification

Before a pilot or full-batch handoff:

- verify supplier-source hashes are unchanged;
- verify every approved image exists, is 1600 by 2000 pixels, is WebP, and belongs to its SKU directory;
- verify every approved SKU has exactly four ordered assets;
- validate the asset manifest and reject duplicate or cross-SKU paths;
- run focused unit tests and TypeScript validation;
- run the production build;
- run Playwright at 320 px, 390 px, and desktop widths;
- check the homepage, collection filters, product cards, product galleries, feeds, structured data, and missing-product 404 behavior;
- confirm no broken images, unexpected horizontal overflow, or product-image cropping that hides the jewelry.

## Rollout

1. Generate and review the five-SKU pilot locally.
2. Present the pilot comparison page without changing storefront image mappings.
3. Apply requested corrections and obtain explicit pilot approval.
4. Generate the remaining 40 SKU packages in product-type batches.
5. Approve and map assets per SKU, retaining fallback behavior for failures.
6. Run the full verification suite and leave the production preview running locally.
7. Treat public deployment as a separate, explicit user decision.
