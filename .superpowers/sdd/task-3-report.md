# Task 3 Report - The Turquoise Leaf

## Status

DONE

## Commit

- This report ships in the commit with message `assets: add Turquoise Leaf TikTok shot package`.
- Branch: `codex/four-product-tiktok-assets`
- Base before Task 3: `a5392fc`

## Delivered Files

- `video-pipeline/asset-library/09-shot-templates/SHOT_TURQUOISE_LEAF_COLD_START_001/template.json`
- `video-pipeline/asset-library/09-shot-templates/SHOT_TURQUOISE_LEAF_COLD_START_001/Thumbnail.png`
- `video-pipeline/asset-library/09-shot-templates/SHOT_TURQUOISE_LEAF_COLD_START_001/first-frames/FF_TURQUOISE_LEAF_01_POOL_SLEEVE_HOOK-v1.png`
- `video-pipeline/asset-library/09-shot-templates/SHOT_TURQUOISE_LEAF_COLD_START_001/first-frames/FF_TURQUOISE_LEAF_02_POOL_LIMESTONE_PRODUCT-v1.png`
- `video-pipeline/asset-library/09-shot-templates/SHOT_TURQUOISE_LEAF_COLD_START_001/first-frames/FF_TURQUOISE_LEAF_03_SLEEVE_REVEAL-v2.png`
- `video-pipeline/asset-library/09-shot-templates/SHOT_TURQUOISE_LEAF_COLD_START_001/first-frames/FF_TURQUOISE_LEAF_04_STAIR_WALL_TRACK_END-v1.png`
- `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Turquoise Leaf 泳池庭院冷启动 9x16.md`
- `.superpowers/sdd/task-3-report.md`

## Generation And Visual Review

- Frame 01 is the approved high-angle human hook: a visible adult red-haired freckled model, partial face and upper body, cream sleeve-clear setup, pool reflections, believable anatomy, and one complete default open cuff.
- Frame 02 is the approved sole-product proof: one cuff on plain pale limestone beside turquoise water, with no props. The central white shell, two turquoise stones, two pearl terminals, and open geometry are simultaneously readable.
- The first Frame 03 candidate was rejected because its wearing angle hid one turquoise stone and at least one pearl terminal. It was not copied into the package.
- Frame 03 v2 preserves the approved eye-level waist-up model, crossed-arm pose, natural skin, cream linen, pool courtyard, and 60-70% model allocation. The open C gap faces camera, and the central shell, both turquoise stones, and both pearl terminals are separated and readable.
- Frame 04 v1 is the approved environment-led ending: limestone steps and wall occupy about 60-70%, the planted model occupies about 25-35%, and the bracelet hand rests on the wall with clean travel space for one hand glide.
- Exactly four approved PNGs are shipped. No rejected candidate is present in the production folder.
- Every approved frame uses only the storefront default variant: open twisted/wire-wrapped gold-tone cuff, one irregular rectangular white shell centerpiece, one round turquoise stone on each side, and one irregular white pearl terminal at each end. No fine-pearl row or extra small pearl appears.

## Package Review

- Four Chinese Seedance 2.0 Fast I2V prompts are present. Each is 4 seconds and explicitly limits the clip to one subject or subject-side action plus one controlled camera move.
- Landing path: `/products/new-series-leaf-turquoise-pearl-cuff`.
- Organic UTM medium: `organic`; paid UTM medium: `paid_social`.
- Both URLs use campaign `turquoise_leaf_cold_start` and content token `sunlit_skin_v1`.
- Hook: `Made for sunlit skin.`
- Three English captions are present, including the `$48.99` price-led caption.
- Pinned comment is exactly `The exact bracelet shown is The Turquoise Leaf. Tap the link in our bio to see it.`
- Music uses TikTok Commercial Music Library minimal fashion percussion at 108-112 BPM.
- Edit length is 11.5 seconds, diagnostics use a 24-hour measurement window, and the base plan is 176 credits.
- The card and template agree on prompts, paths, copy, UTMs, music, edit plan, diagnostics, and cost.
- All card links use final `file:///D:/mythrealms-shop/...` targets.

## Verification

Fresh PowerShell package verification parsed `template.json` and asserted JSON shape, four dynamic frames, role order, 4-second duration, approved status, existing paths, PNG decoding and 9:16 tolerance, exact shipped filenames, action/camera prompt markers, card prompt parity, direct landing path, UTMs, captions, pinned comment, music, edit length, diagnostics, credits, final links, and thumbnail identity.

Output:

```text
json=pass frames=4 dynamic=4 prompts=4 roles=4 shipped_png=4
dimensions=FF_TURQUOISE_LEAF_01_POOL_SLEEVE_HOOK=941x1672; FF_TURQUOISE_LEAF_02_POOL_LIMESTONE_PRODUCT=941x1672; FF_TURQUOISE_LEAF_03_SLEEVE_REVEAL=941x1672; FF_TURQUOISE_LEAF_04_STAIR_WALL_TRACK_END=941x1672
identity_lock=default_open_cuff_no_fine_pearl_row
landing=/products/new-series-leaf-turquoise-pearl-cuff organic_medium=organic paid_medium=paid_social campaign=turquoise_leaf_cold_start content=sunlit_skin_v1
captions=3 pinned=exact bpm=108-112 edit=11.5s diagnostics=4 credits=176
card_prompt_parity=pass final_links=6 thumbnail_sha256=c290be494a2604455875ae7210c070f12ac3c57a8515f2593030b5f762ced922
```

## Concerns

None.
