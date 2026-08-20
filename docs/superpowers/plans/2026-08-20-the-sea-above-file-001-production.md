# The Sea Above FILE 001 Production Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Produce and validate a 28–34 second, 9:16, movie-quality Maverenne TikTok pilot named FILE 001 — THE PEARL THAT ANSWERED, including reusable world anchors, director cards, accepted generated takes, bilingual exports, cover art, and release evidence.

**Architecture:** Build product, character, environment, and FX anchors as independent identity layers, then assemble nine editorial beats instead of asking one generation to maintain a 34-second world. A manifest and PowerShell validator make every dependency explicit; accepted takes feed a reproducible FFmpeg edit, while blind-review and technical gates block release when the result is merely attractive but not narratively legible.

**Tech Stack:** image_gen for bitmap anchors, Seedance 2.0 Fast I2V for four-second live-action takes, PNG/JPEG/WAV/SRT/JSON/Markdown, FFmpeg/FFprobe for deterministic post-production, PowerShell validation, TikTok 9:16 delivery.

**Spec:** docs/superpowers/specs/2026-08-20-the-sea-above-file-001-design.md

## Global Constraints

- Execution uses fresh luna-worker agents; that role is fixed to gpt-5.6-luna with max reasoning. The root session owns world-canon decisions, paid-action confirmation, integration, and final release approval.
- Use the isolated Codex worktree for tracked changes. Do not edit or replace production storefront images under public/images/products.
- Master format is 2160×3840, 24fps, 9:16. TikTok exports are 1080×1920 H.264/AAC.
- Target duration is 28–34 seconds. Do not add explanatory footage solely to reach 34 seconds.
- The first visible frame shows rain moving upward; no logo, fade-in, price, or product name may precede it.
- Preserve Baroque Orbit geometry: gold hoop, green stones, one connector ring, one irregular white baroque pearl, and one terminal gold bead.
- Keep adult protagonist identity, eye structure, dark wet hair, ivory-grey structured coat, and natural skin stable across shots.
- Sky-sea height, underside orientation, storm-cyan palette, light direction, and upward gravity remain consistent.
- Show only Mother shadow and one eye. No complete creature, blood, injury, parasites, gore, superhero beams, or generic magic particles.
- Generated footage contains no text, logos, watermarks, prices, or UI. Add typography in post.
- Use one principal camera move and one principal supernatural event per generated take.
- Seedance paid generation requires action-time confirmation. Base production is 13 four-second takes × 44 credits = 572 credits. Stop and redesign after three rejected takes for one shot.
- Audio is original or rights-cleared. Do not use a named commercial song or an unlogged TikTok track in the master.
- Unavailable analytics use not_available or insufficient_sample, never zero.
- Commit after each independently reviewable task. Do not include unrelated worktree changes.
- Workers are not alone in the worktree: never revert another worker's edits, adapt to concurrent accepted changes, and stage only the paths owned by the current task.

## File Map

Create these reusable anchors:

- video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/
- video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001/
- video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_MEMORY_PAIR_001/
- video-pipeline/asset-library/03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001/
- video-pipeline/asset-library/08-fx/FX_MR_REVERSE_RAIN_001/
- video-pipeline/asset-library/08-fx/FX_MR_SKY_SEA_MOTHER_001/

Create the film package at:

- video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/

The package contains:

- README.md
- production-contract.json
- asset-pack-manifest.json
- cut-map.md
- director-card.md
- distribution.md
- first-frames/S01.png through S09.png and overview.png
- prompts/seedance-s01.md through seedance-s09.md
- takes/candidates/ and takes/accepted/S01.mp4 through S09.mp4
- audio/ambience.wav, heartbeat.wav, mother-rumble.wav, four voice WAVs, and mix-34s.wav
- subtitles/file001-en.srt and file001-zh.srt
- edit/render-file001.ps1
- qa/visual-review.md, blind-review.md, and release-metrics.json
- deliverables/file001-master-2160x3840-prores.mov
- deliverables/file001-en-1080x1920.mp4 and file001-zh-1080x1920.mp4
- deliverables/file001-cover-en.png and file001-cover-zh.png

Create validator:

- video-pipeline/asset-library/scripts/validate-sea-above-file001.ps1

Read only:

- docs/superpowers/specs/2026-08-20-the-sea-above-file-001-design.md
- video-pipeline/asset-library/09-shot-templates/SHOT_BAROQUE_ORBIT_COLD_START_001/template.json
- public/images/products/new-series/new-series-baroque-pearl-hoops/main.jpg
- public/images/products/new-series/new-series-baroque-pearl-hoops/detail-05.jpg

---

### Task 1: Package Contract and Failing Validator

**Owner:** Fresh luna-worker session.

**Files:**
- Create: video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/production-contract.json
- Create: video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/asset-pack-manifest.json
- Create: video-pipeline/asset-library/scripts/validate-sea-above-file001.ps1

**Interfaces:**
- Consumes: Approved design spec and exact file map.
- Produces: Contract ID VID_MR_SEA_ABOVE_FILE_001, nine shot records, dependency paths, media checks, and a validator used by later tasks.

- [ ] **Step 1: Write the production contract**

Use these immutable values:

~~~json
{
  "schema_version": "1.0",
  "id": "VID_MR_SEA_ABOVE_FILE_001",
  "title": "FILE 001 — THE PEARL THAT ANSWERED",
  "format": { "width": 2160, "height": 3840, "fps": 24, "min_seconds": 28, "max_seconds": 34 },
  "product_id": "PROD_MR_BAROQUE_ORBIT_EARRINGS_001",
  "character_id": "CHAR_MR_TIDE_ARCHIVIST_001",
  "environment_id": "ENV_MR_SEA_ABOVE_OLD_CITY_001",
  "fx_ids": ["FX_MR_REVERSE_RAIN_001", "FX_MR_SKY_SEA_MOTHER_001"],
  "shot_ids": ["S01", "S02", "S03", "S04", "S05", "S06", "S07", "S08", "S09"],
  "seedance": { "seconds_per_take": 4, "credits_per_take": 44, "approved_base_takes": 13, "approved_base_credits": 572, "max_rejected_takes_per_shot": 3 },
  "release_gate": { "requires_blind_review": true, "requires_clean_loop": true, "requires_bilingual_exports": true }
}
~~~

- [ ] **Step 2: Write the validator before assets exist**

Parse the contract, assert the exact nine shot IDs, verify required Markdown/JSON/images/audio/subtitles/takes/deliverables, use ffprobe for dimensions, fps, duration and audio streams, and reject numeric zero for unavailable metrics.

Use this accepted-take loop:

~~~powershell
$contract = Get-Content -Raw -LiteralPath $ContractPath | ConvertFrom-Json
if (($contract.shot_ids -join ',') -ne 'S01,S02,S03,S04,S05,S06,S07,S08,S09') { throw 'shot_ids mismatch' }
foreach ($shotId in $contract.shot_ids) {
  $take = Join-Path $PackageRoot "takes/accepted/$shotId.mp4"
  if (-not (Test-Path -LiteralPath $take)) { throw "Missing accepted take $shotId" }
  $probe = & ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate -show_entries format=duration -of json $take | ConvertFrom-Json
  if (-not ($probe.streams | Where-Object codec_type -eq 'video')) { throw "$shotId has no video stream" }
}
~~~

- [ ] **Step 3: Prove the validator fails for missing assets**

Run:

~~~powershell
& 'video-pipeline/asset-library/scripts/validate-sea-above-file001.ps1' -Mode package
~~~

Expected: non-zero exit with the first missing dependency named; no JSON parse error.

- [ ] **Step 4: Commit**

~~~powershell
git add -- 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/production-contract.json' 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/asset-pack-manifest.json' 'video-pipeline/asset-library/scripts/validate-sea-above-file001.ps1'
git commit -m "assets: define Sea Above FILE 001 contract"
~~~

### Task 2: Product Truth Anchor

**Owner:** Fresh luna-worker session. May run in parallel with Tasks 3 and 4.

**Files:**
- Create: video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/
- Reference: public/images/products/new-series/new-series-baroque-pearl-hoops/

**Interfaces:**
- Consumes: Storefront main.jpg, detail-05.jpg, and geometry locks.
- Produces: Immutable source copies, a 9:16 product-lock board, and README.

- [ ] **Step 1: Copy immutable source images**

~~~powershell
$dst = 'video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001/source'
New-Item -ItemType Directory -Force -Path $dst | Out-Null
Copy-Item -LiteralPath 'public/images/products/new-series/new-series-baroque-pearl-hoops/main.jpg' -Destination (Join-Path $dst 'main.jpg')
Copy-Item -LiteralPath 'public/images/products/new-series/new-series-baroque-pearl-hoops/detail-05.jpg' -Destination (Join-Path $dst 'detail-05.jpg')
~~~

- [ ] **Step 2: Generate product-lock.png**

Use both sources as exact references. Show front, three-quarter, connector macro, and pearl texture without changing hoop, green stones, connector count, irregular pearl silhouette, or terminal bead. No model, text, props, extra jewelry, or redesign.

- [ ] **Step 3: Inspect and document**

Reject missing green stones, extra connectors, round substituted pearls, doubled earrings, wrong terminal bead, generated letters, or background blending. Record locks and rejection list in README.md.

- [ ] **Step 4: Verify and commit**

~~~powershell
$root = 'video-pipeline/asset-library/01-products/PROD_MR_BAROQUE_ORBIT_EARRINGS_001'
@('source/main.jpg','source/detail-05.jpg','views/product-lock.png','README.md') | ForEach-Object { if (-not (Test-Path -LiteralPath (Join-Path $root $_))) { throw "Missing $_" } }
git add -- $root
git commit -m "assets: lock Baroque Orbit product identity"
~~~

### Task 3: Protagonist and Memory Anchors

**Owner:** Fresh luna-worker session. The turnaround and memory pair may begin in parallel with Tasks 2 and 4; Step 2 must wait for Task 2 product-lock.png.

**Interfaces:**
- Consumes: Adult protagonist contract and Task 2 product lock for the wearing profile.
- Produces: Adult turnaround, expression sheet, earring profile, and childhood-memory pair.

- [ ] **Step 1: Generate character-turnaround.png**

Generate the same fictional adult woman in front, both profiles, and rear three-quarter views. Lock age 25–35, dark rain-wet hair, natural skin, restrained makeup, ivory-grey structured coat, realistic ears/hands, no jewelry, neutral grey daylight, 85mm editorial realism.

- [ ] **Step 2: Generate expression-sheet.png and earring-profile.png**

Expressions: neutral observation, delayed recognition, contained fear, upward resolve. The profile uses Task 2 product lock; only the right ear wears one exact Baroque Orbit earring. Do not change face, coat, wet-hair pattern, ear anatomy, or product geometry.

- [ ] **Step 3: Generate memory-pair-lock.png**

Show a fully clothed child mostly from rear/three-quarter view holding a distinct adult woman's hand on the same street. The adult wears the exact earring. Keep it non-exploitative, non-sensational, and free of danger.

- [ ] **Step 4: QA and commit**

Reject identity drift, plastic skin, duplicated fingers, malformed ears, child/adult face blending, added jewelry, glamour posing, smiling, or changed earring. Document accepted traits in both READMEs.

~~~powershell
git add -- 'video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_ARCHIVIST_001' 'video-pipeline/asset-library/05-characters/CHAR_MR_TIDE_MEMORY_PAIR_001'
git commit -m "assets: add Sea Above character anchors"
~~~

### Task 4: Sky-Sea Environment and FX Anchors

**Owner:** Fresh luna-worker session. May run in parallel with Tasks 2 and 3.

**Interfaces:**
- Consumes: World rules, storm-cyan palette, upward gravity, partial-Mother constraint.
- Produces: Geography anchor, street/upward views, reverse-rain reference, Mother eye and shadow references.

- [ ] **Step 1: Generate world-anchor.png**

Create a photorealistic British coastal old-city street in cold rain: wet limestone and brick, modest shopfront glass, narrow perspective, no readable brands or landmark. Above it hangs an ocean whose underside faces the city. Natural daylight enters through water; no eye yet.

- [ ] **Step 2: Derive reverse-rain-street.png and sky-sea-upward.png**

The street view uses a low 28–35mm camera with droplets visibly leaving puddles upward. The upward view follows one rising water column. Buildings, sea height, palette, light, and water direction must match.

- [ ] **Step 3: Generate FX locks**

direction-lock.png shows splash crown at ground, rising droplet, and column continuing into sky-sea. mother-shadow-lock.png shows only a vast moving shadow. mother-eye-lock.png shows one incomplete pearl-textured eye pressing toward the underside; no full face, hand, teeth, tentacles, or body.

- [ ] **Step 4: QA and commit**

Reject downward rain, ground-level ocean, contradictory streets, multiple suns, fantasy castles, recognisable IP creatures, full monster anatomy, text, beams, or particle clouds.

~~~powershell
git add -- 'video-pipeline/asset-library/03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001' 'video-pipeline/asset-library/08-fx/FX_MR_REVERSE_RAIN_001' 'video-pipeline/asset-library/08-fx/FX_MR_SKY_SEA_MOTHER_001'
git commit -m "assets: establish Sea Above world anchors"
~~~

### Task 5: Nine-Shot Storyboard and Prompt Pack

**Owner:** Fresh luna-worker after Tasks 2–4 pass root review.

**Interfaces:**
- Consumes: Approved product, character, memory, environment, and FX anchors.
- Produces: Nine motion-ready frames, nine complete Seedance cards, cut map, director card, distribution card, and take ledger.

- [ ] **Step 1: Write the fixed cut map**

| ID | Edit time | Narrative job | Generated motion |
| --- | --- | --- | --- |
| S01 | 0.0–2.3s | Reverse-rain rule | Puddle droplets rise while crowd removes jewelry |
| S02 | 2.3–5.8s | Pearl answers | Exact earring turns toward sky; sound empties |
| S03 | 5.8–10.5s | Reveal sky-sea | Camera rises along one water column |
| S04 | 10.5–13.7s | Establish scale | Vast Mother shadow crosses; daylight dims |
| S05 | 13.7–17.8s | Eye opens | Pearl-textured eye opens beneath sky-sea |
| S06 | 17.8–21.2s | Childhood memory | Child holds adult hand; exact earring visible |
| S07 | 21.2–25.2s | Memory erased | Adult face refracts and disappears in rising water |
| S08 | 25.2–31.2s | Mother reversal | Pearl whispers; city pearls light; iris changes |
| S09 | 31.2–34.0s | Archive and loop | Black archive card; one drop rises into S01 |

- [ ] **Step 2: Generate and inspect S01–S09 first frames**

Each is derived from accepted anchors. S01 reads at feed thumbnail size. S02/S08 preserve protagonist and earring. S03–S05 share geography, sea height, light, and Mother scale. S06/S07 share memory identities. S09 is a clean plate without generated text. Save S01.png through S09.png and a numbered 3×3 overview.png.

- [ ] **Step 3: Write nine Seedance cards**

Every prompts/seedance-sNN.md contains exact uploads, role of each upload, four-second Chinese prompt, negative constraints, camera contract, motion contract, end state, edit range, audio intent, take ledger, and acceptance/rejection notes. One principal camera move and one principal supernatural event only.

- [ ] **Step 4: Write director-card.md and distribution.md**

Include performance direction, lens/light/color continuity, sound map, exact bilingual lines, edit timeline, bilingual captions, covers, pinned comment, hashtags, A/B opening rule, and no sales CTA.

S09 post typography is exact and must not be paraphrased:

~~~text
THE SEA HAS CHOSEN AGAIN.
MAVERENNE // RECOVERED TIDE FILE 001
~~~

- [ ] **Step 5: Extend manifest and validate anchors**

Store paths and SHA-256 values in asset-pack-manifest.json. Add validator Mode anchors.

~~~powershell
& 'video-pipeline/asset-library/scripts/validate-sea-above-file001.ps1' -Mode anchors
~~~

Expected: anchors: PASS; first_frames: 9/9; prompts: 9/9.

- [ ] **Step 6: Commit**

~~~powershell
git add -- 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001' 'video-pipeline/asset-library/scripts/validate-sea-above-file001.ps1'
git commit -m "assets: storyboard Sea Above FILE 001"
~~~

### Task 6: Paid Seedance Take Production

**Owner:** Fresh luna-worker for bookkeeping; root performs browser confirmations and accepts/rejects takes.

**Interfaces:**
- Consumes: Nine approved frames and prompts.
- Produces: Nine accepted four-second takes and complete rejection ledger.

- [ ] **Step 1: Request action-time paid confirmation**

Show exact base budget: nine primary takes plus second takes for S01, S02, S05, S08 = 13 × 44 = 572 credits. Do not press Generate without confirmation.

- [ ] **Step 2: Generate in dependency order**

Generate S01–S05 first. Root reviews geography, gravity, product, and Mother continuity. Then generate S06–S09. S09 is an atmospheric plate without generated text.

- [ ] **Step 3: Enforce one-variable repairs**

Log one primary rejection reason: identity, product_geometry, gravity_direction, environment, mother_scale, camera, motion, artifact, or other. Change only that variable. After three rejects, return the shot to Task 5 for simplification.

- [ ] **Step 4: Promote without overwriting candidates**

Copy accepted candidate to takes/accepted/SNN.mp4. Preserve candidates and ledgers.

~~~powershell
& 'video-pipeline/asset-library/scripts/validate-sea-above-file001.ps1' -Mode takes
~~~

Expected: accepted_takes: 9/9.

- [ ] **Step 5: Commit**

~~~powershell
git add -- 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/takes' 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/prompts' 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/asset-pack-manifest.json'
git commit -m "assets: add accepted Sea Above FILE 001 takes"
~~~

### Task 7: Original Sound and Subtitles

**Owner:** Fresh luna-worker; root reviews language and mix intent.

**Interfaces:**
- Consumes: Locked 34-second cut and four dialogue lines.
- Produces: Rights-cleared 48kHz/24-bit stereo mix and bilingual SRT.

- [ ] **Step 1: Produce sound stems**

Create reverse rain, evacuated-city ambience, dry heartbeat, distant ocean rumble, glass vibration, pearl chime, and loop drop. Log source/tool/date/rights in director-card.md. No named commercial song.

- [ ] **Step 2: Produce exact voices**

~~~text
10.6s distant emergency broadcast: It heard someone.
15.2s intimate child-like synthetic character voice: I remember you.
23.2s adult protagonist, contained: Who are you?
28.0s wide non-human low voice: Mother.
~~~

Do not clone or imitate a real person.

- [ ] **Step 3: Mix 34 seconds**

Export audio/mix-34s.wav at 48kHz stereo 24-bit PCM, near -14 LUFS and no higher than -1 dBTP. Preserve the S02 sound vacuum and keep Mother energy below dialogue.

- [ ] **Step 4: Write bilingual SRT**

Use these English cue times; Chinese uses approved translations at identical times:

~~~srt
1
00:00:00,000 --> 00:00:02,300
IF THE RAIN FALLS UP, REMOVE EVERY PEARL.

2
00:00:10,600 --> 00:00:12,300
It heard someone.

3
00:00:15,200 --> 00:00:16,800
I remember you.

4
00:00:23,200 --> 00:00:24,700
Who are you?

5
00:00:28,000 --> 00:00:29,200
Mother.

6
00:00:31,200 --> 00:00:33,300
THE SEA HAS CHOSEN AGAIN.
~~~

- [ ] **Step 5: Verify and commit**

~~~powershell
$probe = & ffprobe -v error -show_entries stream=sample_rate,channels -show_entries format=duration -of json 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/audio/mix-34s.wav' | ConvertFrom-Json
if ([int]$probe.streams[0].sample_rate -ne 48000 -or [int]$probe.streams[0].channels -ne 2) { throw 'Audio format failed' }
git add -- 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/audio' 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/subtitles' 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/director-card.md'
git commit -m "assets: add Sea Above FILE 001 sound package"
~~~

### Task 8: Deterministic Edit and Bilingual Exports

**Owner:** Fresh luna-worker.

**Interfaces:**
- Consumes: Nine accepted takes, cut timings, mixed WAV, bilingual SRT.
- Produces: 4K ProRes master, two TikTok MP4s, and two covers.

- [ ] **Step 1: Write render-file001.ps1 with fail-fast checks**

Resolve all files beneath explicit PackageRoot. Normalize to 2160×3840 at 24fps, trim/retime by cut map, add the exact S09 titles from Task 5 in post, concatenate without black frames, use mix-34s.wav, and render bilingual variants.

Define paths before invoking FFmpeg:

~~~powershell
param(
  [ValidateSet('master','exports')][string]$Stage,
  [string]$PackageRoot = 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001'
)
$VideoOnly = Join-Path $PackageRoot 'edit/work/file001-video-only.mov'
$Mix = Join-Path $PackageRoot 'audio/mix-34s.wav'
$Master = Join-Path $PackageRoot 'deliverables/file001-master-2160x3840-prores.mov'
foreach ($Language in @('en','zh')) {
  $Export = Join-Path $PackageRoot "deliverables/file001-$Language-1080x1920.mp4"
  $SrtPath = (Resolve-Path -LiteralPath (Join-Path $PackageRoot "subtitles/file001-$Language.srt")).Path
  $EscapedSrt = $SrtPath.Replace('\','/').Replace(':','\:').Replace("'","\'")
  & ffmpeg -y -i $Master -vf "scale=1080:1920:flags=lanczos,subtitles='$EscapedSrt'" -c:v libx264 -preset slow -crf 16 -profile:v high -level 4.2 -pix_fmt yuv420p -c:a aac -b:a 320k -movflags +faststart $Export
}
~~~

Use these codecs:

~~~powershell
ffmpeg -y -i $VideoOnly -i $Mix -map 0:v -map 1:a -c:v prores_ks -profile:v 3 -pix_fmt yuv422p10le -c:a pcm_s24le $Master
ffmpeg -y -i $Master -vf "scale=1080:1920:flags=lanczos,subtitles='$EscapedSrt'" -c:v libx264 -preset slow -crf 16 -profile:v high -level 4.2 -pix_fmt yuv420p -c:a aac -b:a 320k -movflags +faststart $Export
~~~

- [ ] **Step 2: Render master**

~~~powershell
& 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/edit/render-file001.ps1' -Stage master
~~~

Expected: 2160×3840, 24fps, 28–34 seconds, one PCM audio stream.

- [ ] **Step 3: Render exports and covers**

~~~powershell
& 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/edit/render-file001.ps1' -Stage exports
~~~

Expected: two 1080×1920 MP4s and two cover PNGs. Covers use an S01 frame with visible upward rain; copy is IF THE RAIN FALLS UP… and 如果雨水向上落……; do not reveal the eye.

- [ ] **Step 4: Verify technical delivery and loop**

Run validator Mode deliverables. Export first/last 12-frame contact sheets and inspect direction, luminance jump, black frames, and audio clicks. Repair only S09 timing or loop bridge; do not regenerate S01 for an edit-only failure.

- [ ] **Step 5: Commit**

~~~powershell
git add -- 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/edit' 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/deliverables' 'video-pipeline/asset-library/scripts/validate-sea-above-file001.ps1'
git commit -m "assets: render Sea Above FILE 001 master"
~~~

### Task 9: Narrative QA and Release Evidence

**Owner:** Root session; luna-worker may prepare evidence but cannot waive a failure.

**Interfaces:**
- Consumes: Final master, exports, spec, contract, provenance.
- Produces: Release decision, traceable evidence, intervention list.

- [ ] **Step 1: Complete visual review**

Record PASS/FAIL for gravity, sea continuity, Mother scale, protagonist, memory pair, product geometry, iris anatomy, text safety, compression, and loop. Include file SHA-256 values and contact-sheet paths.

- [ ] **Step 2: Run blind review**

Use at least three reviewers who have not read the spec. Show 0–3s, 0–11s, and full film separately. Pass only when 0–3s prompts upward-rain/pearl questions, 0–11s communicates ocean or a vast body above the city, and full film prompts the Mother identity question or a request for FILE 002. “Beautiful” alone is a failure.

- [ ] **Step 3: Initialize metrics without fake zeros**

~~~json
{
  "published_at": "not_available",
  "tiktok_url": "not_available",
  "views": "not_available",
  "average_watch_seconds": "not_available",
  "completion_rate": "not_available",
  "profile_visit_rate": "not_available",
  "comments_world_questions": "not_available",
  "sample_status": "not_available"
}
~~~

After publishing, use insufficient_sample until 300–500 valid views.

Directionally successful means average watch time reaches at least 35% of final duration, completion reaches at least 15%, profile visits reach at least 2%, and comments contain genuine world-rule or Mother-identity questions. Do not claim statistical validation before the sample threshold.

- [ ] **Step 4: Run release validation**

~~~powershell
& 'video-pipeline/asset-library/scripts/validate-sea-above-file001.ps1' -Mode release
git diff --check
git status --short
~~~

Expected: validator exit 0, no unrelated changes, every manifest path exists and matches SHA-256.

- [ ] **Step 5: Commit evidence**

~~~powershell
git add -- 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/qa' 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/README.md' 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/distribution.md' 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/asset-pack-manifest.json'
git commit -m "docs: add Sea Above FILE 001 release evidence"
~~~

- [ ] **Step 6: Handoff**

Report final SHA, master/export paths, duration, codecs, QA, actual credits, rejected-take ledger, rights provenance, and blockers. User intervention is limited to paid Seedance confirmation, final TikTok publish, and optional selection of a rights-cleared Commercial Music Library alternate.
