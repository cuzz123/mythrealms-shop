# The Calm Tide Ring Editorial Image Pilot

## Goal

Replace the five product-gallery images for `pearl-series-01` (The Calm Tide - Ring) with a consistent Mediterranean editorial treatment. This pilot establishes a repeatable visual system before any other product images change.

## Product invariants

Every generated image must preserve the product represented by the current source gallery:

- gold-toned, coiled open ring band;
- asymmetric cluster of pale blush freshwater pearls;
- open, adjustable-looking silhouette and the relative pearl cluster placement;
- square product-gallery crop.

Do not add gemstones, logos, copy, measurement overlays, watermarks, extra jewelry, or packaging claims. The existing five supplier photos are reference inputs only and remain in the repository as an unchanged fallback.

## Visual system

- **Style:** quiet Mediterranean luxury editorial.
- **Palette:** warm white, limestone, oat linen, muted olive, pearl blush, soft gold.
- **Light:** diffuse morning sunlight with gentle shadows and natural highlight roll-off.
- **Surface language:** matte limestone, lightly wrinkled natural linen, restrained ceramic accents.
- **Composition:** high-end jewelry editorial; one clear product focal point per image, generous negative space, no visible text.

## Gallery sequence

1. **Hero:** ring centered on warm linen and limestone; product is large, sharp, and clearly legible.
2. **Macro:** close crop on pearl cluster and coiled band to show luster and texture.
3. **Worn:** natural hand wearing the ring on a sunlit Mediterranean terrace, background softly defocused.
4. **Profile:** side-angle product study on a cream background, showing the open band and pearl depth.
5. **Atmosphere:** ring with a restrained linen, ceramic, and olive-branch still life as the gallery closing image.

## Asset and integration plan

- Generate five new square, product-specific image files using the current gallery as visual references.
- Validate each result against the product invariants before it can replace a source image.
- Save the approved assets as non-destructive `-editorial-v1` siblings under `public/images/products/1688-shop/pearl-series/`.
- Update only `pearl-series-01` references in `src/lib/1688-products.ts`, preserving the original source file names and enabling an immediate rollback.
- Verify the home card, collection card, product gallery, product metadata, and image paths after integration.

## Acceptance criteria

- All five images read as one visual family at card and product-page size.
- The ring remains recognizably faithful to the supplied source product.
- All asset paths resolve locally and in a production build.
- No other product's image references change.
- Original assets are not overwritten.

## Risks and controls

Image generation can distort jewelry geometry. The approval gate is therefore per image: discard any result whose band shape, pearl cluster, color, or wearing placement visibly diverges from the references. The pilot remains isolated to one product until the user approves the rendered gallery.
