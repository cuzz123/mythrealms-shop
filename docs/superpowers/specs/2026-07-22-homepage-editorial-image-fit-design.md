# Homepage editorial image-fit design

## Goal

Remove supplier-style imagery from the homepage and make the editorial image system feel intentional at every viewport.

## Scope

- The Pearl Edit uses only the approved editorial gallery roles: `primary` for the product image and `wearing` for the alternate image.
- Product cards remain at a stable 4:5 aspect ratio with cover cropping, which avoids mixed source dimensions changing the grid rhythm.
- The hero uses viewport-specific composition: a wide desktop composition with the left side reserved for copy, and a taller mobile composition that keeps the jewelry visible above the copy.
- The existing model-worn category-story imagery remains unchanged.

## Non-goals

- No new AI image generation in this pass.
- No wholesale redesign of the homepage sections or product catalog.

## Verification

- Add source-level regression coverage that the homepage featured selection passes editorial image roles to product cards.
- Add source-level regression coverage that the hero defines desktop and mobile crop behavior.
- Run targeted storefront tests, lint, and a production build in the main workspace.
