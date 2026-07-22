# MythRealms 海岸图书馆珍珠项链 Campaign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** 交付一套可直接喂给 Seedance 2.0、可回溯到 Obsidian 的 36.8 秒 MythRealms 三层珍珠项链广告资产包。

**Architecture:** 先生成稳定参考资产（产品结构、人物、空间、白马、扣合关键姿势），再按 S01→S09 生成首帧。所有镜头只使用已验收的锚点和前一镜验收末帧续接。README、资产清单、逐镜头提示词和剪辑合同为唯一事实来源，Obsidian 卡仅索引和预览。

**Tech Stack:** 本地文件资产库、图像生成、Seedance 2.0 全能模式、FFmpeg/剪映后期、Obsidian Markdown。

## Global Constraints

- 唯一产品源图：D:\mythrealms-shop\public\images\new_series\微信图片_20260709085151_1036_423.jpg；仅允许一条三层金色细链、白色不规则垂坠珍珠项链。
- S01–S04 不显示锁骨项链；S05 画内完成后颈扣合；S06 才完整显露项链。
- 女主为成年欧美女性、深棕自然波浪发、墨蓝丝缎长裙；不直视镜头、不笑、不做可见呼吸循环。
- 每个 Seedance 生成片段至少四秒，成片长度严格为 36.8 秒。
- 单镜头只允许一个主动作和一个主运镜；默认近景不眨眼。
- 白马不得与珠宝同镜生成；Logo 仅后期静态叠层。
- 每条提示词使用 Windows 绝对路径引用输入图，图片必须实际放入项目资产库。

---

## File Structure

- video-pipeline/asset-library/01-products/PROD_MR_COASTAL_PEARL_CASCADE_NECKLACE_001/：产品锁、源图副本和说明。
- video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_COASTAL_LIBRARY_001/：女主三视图、表情表、无首饰和佩戴状态。
- video-pipeline/asset-library/03-scene-kits/ENV_MR_COASTAL_LIBRARY_001/：海崖、草浪、石灰岩海岸图书馆全景和高窗锚点。
- video-pipeline/asset-library/03-scene-kits/ANIMAL_MR_WHITE_HORSE_001/：白马三视图和鬃毛近景。
- video-pipeline/asset-library/06-reference-inputs/REF_MR_COASTAL_NECKLACE_FASTEN_001/：后颈扣合关键姿势图。
- video-pipeline/asset-library/10-storyboard-videos/VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001/：九段首帧、提示词、剪辑合同、清单、总览。
- video-pipeline/asset-library/obsidian-vault/03-参考拆解/VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001｜海岸图书馆珍珠项链.md：Obsidian 预览入口。

### Task 1: 建立产品锁与资产包目录

**Files:**
- Create: video-pipeline/asset-library/01-products/PROD_MR_COASTAL_PEARL_CASCADE_NECKLACE_001/README.md
- Create: video-pipeline/asset-library/01-products/PROD_MR_COASTAL_PEARL_CASCADE_NECKLACE_001/source/product-source.jpg
- Create: video-pipeline/asset-library/10-storyboard-videos/VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001/asset-pack-manifest.json
- Create: video-pipeline/asset-library/10-storyboard-videos/VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001/README.md

**Consumes:** approved product source and design spec.
**Produces:** stable product ID PROD_MR_COASTAL_PEARL_CASCADE_NECKLACE_001 and campaign ID VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001.

- [ ] Copy the unique product source to source/product-source.jpg and create first-frames and prompts directories.
- [ ] Write the product README: three gold fine-chain arcs ordered short/mid/long, irregular white dangling pearls, one necklace only, no visibility before S05.
- [ ] Write asset-pack-manifest.json with keys product, character, environment, animal, fasten_reference, shots, using the exact IDs in this plan.
- [ ] Verify the copied file exists and ConvertFrom-Json returns all five required asset references.
- [ ] Commit: git commit -m "assets: lock coastal pearl necklace campaign".

### Task 2: 生成稳定的角色、空间、白马与扣合锚点

**Files:**
- Create: video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_COASTAL_LIBRARY_001/views/character-turnaround.png
- Create: video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_COASTAL_LIBRARY_001/views/expression-sheet.png
- Create: video-pipeline/asset-library/03-scene-kits/ENV_MR_COASTAL_LIBRARY_001/views/world-anchor.png
- Create: video-pipeline/asset-library/03-scene-kits/ENV_MR_COASTAL_LIBRARY_001/views/library-window-anchor.png
- Create: video-pipeline/asset-library/03-scene-kits/ANIMAL_MR_WHITE_HORSE_001/views/horse-turnaround.png
- Create: video-pipeline/asset-library/06-reference-inputs/REF_MR_COASTAL_NECKLACE_FASTEN_001/views/back-neck-fasten.png

**Consumes:** Task 1 product lock.
**Produces:** bounded reference inputs for S01–S08.

- [ ] Generate one realistic model turnaround: front, left 45°, right 45°, side, back; adult European woman, navy satin, no necklace.
- [ ] Generate expression sheet: neutral, attentive, distant, soft-downcast; no smile, no direct gaze.
- [ ] Generate world-anchor: cold-gray sea, wind-bent grass, low cloud, original distant limestone library/residence. Generate library-window-anchor: tall interior window, limestone verticals, restrained daylight, no woman/product.
- [ ] Generate white-horse turnaround plus side-wind mane close-up. Generate back-neck-fasten: hair lifted aside, two hands close one clasp, all three tiers originate continuously from the clasp.
- [ ] Visually reject any extra jewelry, multiple necklaces, direct gaze, generated text, horse jewelry, malformed hands, tier mismatch, or broken clasp continuity.
- [ ] Write README files with absolute source paths; character README states S04 no-necklace and S06/S08 fastened state.
- [ ] Commit: git commit -m "assets: add coastal necklace campaign anchors".

### Task 3: 生成九段首帧与连续性 QA

**Files:**
- Create: video-pipeline/asset-library/10-storyboard-videos/VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001/first-frames/s01-coast.png through s09-product-macro.png
- Create: video-pipeline/asset-library/10-storyboard-videos/VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001/first-frames/overview.png
- Create: video-pipeline/asset-library/10-storyboard-videos/VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001/first-frames/README.md

**Consumes:** Task 1 lock and Task 2 anchors.
**Produces:** accepted visual inputs for individual Seedance generations.

- [ ] Generate S01 24mm coastal push, S02 side-wind mane only, S03 limestone entrance, S04 model at tall window with clear bare collarbone. Product reference forbidden in S01–S04.
- [ ] Generate S05 back-neck clasp closing. Review it before generating S06. Generate S06 from accepted S05 final frame; show the same woman, the same necklace, fully visible at collarbone.
- [ ] Generate S07 mane high-light match only, S08 wearing state side turn at coastal window, S09 exact necklace macro still-life.
- [ ] Build overview.png in S01–S09 order with labels outside images.
- [ ] QA overview: S04 no necklace; S05 has three exiting clasp tiers; S06 and S08 identical necklace geometry; S09 matches product source. Record pass/fail in first-frames README.
- [ ] Commit: git commit -m "assets: add coastal necklace storyboard frames".

### Task 4: 编写逐镜头 Seedance 提示词和剪辑合同

**Files:**
- Create: video-pipeline/asset-library/10-storyboard-videos/VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001/prompts/seedance-s01.md through seedance-s09.md
- Create: video-pipeline/asset-library/10-storyboard-videos/VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001/prompts/README.md
- Create: video-pipeline/asset-library/10-storyboard-videos/VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001/cut-map.md

**Consumes:** Task 3 accepted first frames.
**Produces:** copy-ready prompts and deterministic 36.8-second edit map.

- [ ] Every prompt starts with 输入图（绝对路径）: and contains only controlling images, a four-second generation request, one camera movement, and one action.
- [ ] S04 literal performance lock: 头、肩、胸口保持视觉稳定；嘴唇不动；本 4 秒不眨眼；不出现可见呼吸循环；眼神停在画外目标。
- [ ] S05 references product, model back view, fastening anchor. S06 references accepted S05 end frame and literal rule: 只允许从“扣环已合上”继续；不得增殖、替换或重设计项链；三层细链由短至长，白色不规则珍珠垂坠。
- [ ] S07 references horse mane only. S08 references accepted S06 end frame plus model/environment. S09 references product source and S08 pearl-light anchor.
- [ ] cut-map.md must specify final durations 5.2, 2.8, 4.7, 4.6, 4.8, 4.6, 3.7, 2.7, 3.7; six approved cut contracts; 80/85/90% slow-down choices; wind/room/clasp audio bridges.
- [ ] Lint all nine prompt files for input heading and absolute paths; reject relative references.
- [ ] Commit: git commit -m "docs: add coastal necklace seedance prompts".

### Task 5: 建立 Obsidian 索引并验收资产包

**Files:**
- Create: video-pipeline/asset-library/obsidian-vault/03-参考拆解/VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001｜海岸图书馆珍珠项链.md
- Modify: video-pipeline/asset-library/10-storyboard-videos/VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001/README.md

**Consumes:** Tasks 1–4 outputs.
**Produces:** Obsidian-previewable campaign asset card.

- [ ] Write card frontmatter: id VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001; type 分镜资产包; status asset_pack_ready; tags [三层珍珠项链, 海岸图书馆, Seedance, MythRealms].
- [ ] Embed overview and link manifest, cut map, prompt README, product, character, environment, animal, fastening reference.
- [ ] Campaign README states 36.8 seconds, S01–S09 order, S04→S05→S06 state contract, and generate one accepted clip before continuing from the accepted last frame.
- [ ] QA required files: README, manifest, cut map, overview, nine frames, nine prompts. Manually approve only none → physically fastened → fully visible.
- [ ] Commit: git commit -m "docs: package coastal necklace campaign".

## Self-Review

- Spec coverage: Task 1 locks product; Task 2 creates all mandatory generation assets; Task 3 protects the reveal sequence; Task 4 maps 36.8 seconds, absolute paths, audio bridges, natural performance; Task 5 adds Obsidian preview and final acceptance.
- Placeholder scan: no unspecified paths or acceptance rules remain.
- Consistency: every task uses PROD_MR_COASTAL_PEARL_CASCADE_NECKLACE_001 and VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001.
