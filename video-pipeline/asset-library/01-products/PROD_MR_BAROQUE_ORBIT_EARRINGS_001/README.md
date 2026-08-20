# Product Truth Anchor — Baroque Orbit Earrings

`PROD_MR_BAROQUE_ORBIT_EARRINGS_001` is the immutable product identity anchor for Maverenne “The Sea Above / FILE 001”. Product geometry takes priority over visual novelty: downstream first frames and motion generations must match these exact source views.

## Deliverables

- `source/main.jpg` — byte-for-byte copy of the storefront gallery `main.jpg` (800 × 800).
- `source/detail-05.jpg` — byte-for-byte copy of the storefront gallery `detail-05.jpg` (800 × 800).
- `views/product-lock.png` — deterministic 1080 × 1920 (9:16) reference board. It is a four-panel crop-and-scale composite made only from the two source copies; it contains no generated pixels, text, model, added prop, extra jewelry, or redesign.

## Source provenance

Storefront source directory: `public/images/products/new-series/new-series-baroque-pearl-hoops/`

| Anchor | Source SHA-256 | Immutable copy SHA-256 |
| --- | --- | --- |
| `main.jpg` | `DD12F12A092965A08AB9096DC3E4E79925779B641B29142B4194FF1C8BDF950F` | `DD12F12A092965A08AB9096DC3E4E79925779B641B29142B4194FF1C8BDF950F` |
| `detail-05.jpg` | `73855F92B3426DE9428042561DF8AD5BD5A4EB98496BD31F2934ECEA6C67E2E5` | `73855F92B3426DE9428042561DF8AD5BD5A4EB98496BD31F2934ECEA6C67E2E5` |

## Five geometry locks

Every downstream depiction must preserve all five locks together:

1. **Polished gold circular hoop** — a closed, round hoop with its polished gold finish.
2. **Tiny green stones on the hoop front** — the green stone row remains present and set along the front of the hoop.
3. **One connecting ring** — exactly one gold connector ring joins each hoop to its pearl; do not add links or chains.
4. **Irregular white baroque pearl drop** — the pearl stays asymmetric, organically ridged, and visibly baroque; never substitute a smooth round pearl.
5. **Tiny terminal gold bead** — one small gold bead remains at the pearl’s terminal tip.

## Board view map and visual QA

- **Upper panel / front:** `detail-05.jpg` shows the complete hanging pair, both stone-set hoops, both single connectors, the asymmetric drops, and both terminal beads.
- **Middle panel / three-quarter:** `main.jpg` shows the exact laid-flat product angle and the hoop-to-pearl junction at larger scale.
- **Lower-left / connector macro:** a source crop from `detail-05.jpg` isolates one stone-set hoop, its single connector, and the beginning of the pearl; there is no doubled or invented hardware.
- **Lower-right / pearl texture:** a source crop from `detail-05.jpg` enlarges the real pearl ridges, asymmetry, nacre highlights, and attached terminal bead.

Reject any candidate that has missing green stones, extra connectors, a round substituted pearl, doubled earrings, the wrong terminal bead, generated letters, background blending that obscures the product, a model, a prop added by generation, unrelated jewelry, or any geometry redesign. The board intentionally has no captions or labels so generated lettering cannot be mistaken for product truth.

