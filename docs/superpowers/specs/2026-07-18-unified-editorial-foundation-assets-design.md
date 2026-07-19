# Unified Editorial Foundation Assets

## Goal

Create the first reusable visual layer for four jewelry products. The assets must support daily short-form ad production while keeping model, location, product styling, and I2V direction consistent.

## Creative Direction

All twelve images use one shared art direction: Mediterranean warm-sun editorial photography, believable adult models with natural skin texture, ivory plaster and pale limestone, undyed linen, olive-leaf shadows, restrained gold accents, and warm late-afternoon side light. Images remain photorealistic and contain no text, logos, spare jewelry, cups, tables, laptops, vases, or unrelated props.

## Deliverables

Create three 9:16 reusable first-frame assets for each product, for twelve assets total.

| Product | Asset set | Framing purpose |
| --- | --- | --- |
| Violet Rain | half-body earring, side-profile earring, full-body courtyard interaction | earring identity and an environment anchor |
| Moon Disc | half-body earring, side-profile earring, full-body sea-terrace interaction | earring identity and an environment anchor |
| Turquoise Leaf | wrist close-up, half-body bracelet, full-body pool-courtyard interaction | bracelet proof and an environment anchor |
| Falling Pearl | collarbone close-up, half-body necklace, full-body rooftop-courtyard interaction | necklace proof and an environment anchor |

Each asset receives a Chinese Seedance 2.0 Fast image-to-video prompt for a four-second clip. The prompt specifies the corresponding image as the first frame, a single product-safe action, a single camera movement, continuity constraints, and exclusions.

## Asset Model

Each asset has one stable ID and belongs simultaneously to:

- one product card in `01-products`;
- one model card in `05-characters`;
- one setting card in `03-scenes`;
- one visual style card in `07-styles`;
- its generated I2V prompt record.

Product-specific first frames remain independent files. Asset cards only reference the IDs and relative paths, so a future shot recipe can compose a product, model, scene, and motion without duplicating identity descriptions.

## Naming and Storage

Files are stored under `video-pipeline/asset-library` in product-specific folders. Stable IDs use `FOUNDATION_<PRODUCT>_<ROLE>_001`. An Obsidian card is created per asset under `obsidian-vault/01-资产卡`, with frontmatter for product, character, scene, style, framing, file path, and prompt path.

## Generation and Quality Gates

Every image must pass these checks before it is retained:

1. The intended jewelry is visible, correctly placed, and visually dominant for close and half-body frames.
2. The model remains an adult, anatomically credible, naturally lit, and free of duplicate limbs or deformed hands.
3. The background follows the shared Mediterranean editorial direction without unrelated tabletop objects or extra jewelry.
4. The image is vertical 9:16 and provides enough stable composition for an I2V opening frame.
5. The I2V prompt uses one action and one camera move only, with a fixed four-second duration.

## Validation

Run the repository asset validation and decode every generated image. Confirm all twelve cards resolve to their files and that each has a non-empty Chinese I2V prompt. Preview a representative asset card in the local library at `http://127.0.0.1:5174/`.

## Out of Scope

This batch does not create fully isolated character turnarounds, transparent product cutouts, video generations, paid-media campaigns, or changes to the storefront. Those can reuse this foundation after the image library is proven.
