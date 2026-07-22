# Director Stage Fidelity Log

Reference: `D:\Chrome_Download\v03c76g10004d97q32qljht2pve1.750.mp4`  
Director stage: Blender mannequin blocking only; visual quality and character likeness are deliberately excluded from scoring.

## Scoring Rubric

- `90-100`: screen direction, subject order, staging, camera path, focus transfer, and key poses agree at every key beat.
- `75-89`: clear match at each beat, with visible but non-breaking differences in framing or timing.
- `60-74`: subject order and broad intent match, but staging/camera details are frequently wrong.
- `<60`: reference beat is recognisable but cannot yet guide a final AI-video prompt reliably.

Scores are reviewer estimates from side-by-side key-frame comparison. They are not pixel similarity metrics.

## Iteration 14 - Green-Marked Blocking Baseline

Artifact: `D:\Chrome_Download\mythrealms_garage_mannequin_director_stage\garage_mannequin_director_stage_actions_v14_green_mark_composition_corrected.blend`  
Evidence: `D:\Chrome_Download\mythrealms_garage_mannequin_director_stage\preview_frames\v14_green_mark_composition\`  
Reference evidence: `camera-study\reference-2fps-sheet.jpg`

| Section | Reference requirement | Current result | Score |
| --- | --- | --- | ---: |
| 00:00-00:02 role 1 opening | Woman alone in a medium three-quarter shot beside the car; slow oblique move, downward gaze rises to lens. | Role 1 is side-staged, but the foreground male is present too early and blocks too much of the frame. | 43 |
| 00:02-00:05 role 2 rack focus | Glasses man appears from right foreground/back-side, snaps his head to lens; woman remains visible left-back and soft. | Right-foreground placement, snap turn and strong DOF exist; facial framing is over-large and the entry timing starts too early. | 63 |
| 00:05-00:09 bat-guard reveal | Camera pulls back, then bat woman takes foreground from left while glasses man resolves behind. | Not revalidated after the v14 camera rewrite; treat as unproven. | 35 |
| 00:09-00:12 C-role reveal | Low-angle diagonal pullback/crane reveals the white-suit centre role after an off-camera walk-in. | C role has a walk-in path, but the reveal framing and crane path are unverified after current changes. | 40 |
| 00:12-00:15 five-role finale | Camera completes the backward high pull to a stable five-person/car tableau. | Broad five-role tableau exists, but composition and path are unverified after current changes. | 50 |
| Motion continuity | One continuous camera path and motivated character movement. | Several inherited camera keys conflict with current blocking; continuity requires a clean pass. | 38 |

**Overall baseline: 45 / 100.**

### Next Revision Targets

1. Restore a clean role-1-only opening through the first six 2fps reference frames.
2. Delay the right-foreground male entrance until the rack-focus beat, preserving screen-right direction.
3. Rebuild and verify the pullback-to-bat-guard section before touching the final reveal.

## Iteration 15 - Opening Timing Pass

Artifact: `D:\Chrome_Download\mythrealms_garage_mannequin_director_stage\garage_mannequin_director_stage_actions_v15_opening_timing_match.blend`  
Evidence: `preview_frames\v15_opening_timing\`

| Section | Result | Score |
| --- | --- | ---: |
| Role 1 opening | The glasses role is now absent during the opening hold and only enters from the right foreground near the rack-focus beat. Role 1 remains too profile/back-facing and the car is not yet framed like the reference. | 52 |
| Role 2 rack focus | The side/back-to-lens snap and focus order are preserved, but the close portrait is over-cropped relative to the reference. | 65 |
| Remaining sections | Not changed or not revalidated in this pass. | 42 |

**Overall: 48 / 100.** Improvement is real but insufficient; retain only as an intermediate version.

## Iteration 16 - Middle Pullback Experiment

Artifact: `D:\Chrome_Download\mythrealms_garage_mannequin_director_stage\garage_mannequin_director_stage_actions_v16_middle_pullback_bat_takeover.blend`

The camera continuity between the male closeup and bat-guard section was rewritten. The `156` frame rendered as an empty framing because the left-entry camera target was too central.

**Overall: 47 / 100.** Rejected as the working baseline; the failed empty-frame result is retained for traceability.

## Iteration 17 - Middle Staging Repair

Artifact: `D:\Chrome_Download\mythrealms_garage_mannequin_director_stage\garage_mannequin_director_stage_actions_v17_middle_staging_repaired.blend`  
Evidence: `preview_frames\v17_middle_staging\`, `preview_frames\v17_center_final_baseline\`

| Section | Result | Score |
| --- | --- | ---: |
| Role 1 opening + rack focus | Preserves the iteration 15 timing improvement. | 58 |
| Male pullback -> bat-guard takeover | Male now retreats through a medium/wider stage and the bat enters from the left edge before becoming foreground. Character orientation and car composition still diverge from the reference. | 50 |
| C-role reveal | Still begins on the bat guard rather than revealing the centre role at the correct low angle. | 32 |
| Five-role ending | Current stable render shows only three performers. The required five-person finale is not met. | 28 |
| Motion continuity | The 66-216 path is now keyframed continuously, but the 217+ handoff remains an unvalidated inherited path. | 48 |

**Overall: 50 / 100.** This is the current working baseline. The next gate is a clean C-role reveal and verified five-person final tableau; do not claim 90% until every section scores at least 90.

## Iteration 18 - C-Role Crane and Five-Role Finale

Artifact: `D:\Chrome_Download\mythrealms_garage_mannequin_director_stage\garage_mannequin_director_stage_actions_v18_center_crane_five_role_wide.blend`  
Evidence: `preview_frames\v18_center_crane_wide\`

| Section | Result | Score |
| --- | --- | ---: |
| Role 1 opening | Maintains the delayed glasses-role entrance, but role 1 remains over-profiled and the car/female framing differs from the reference. | 58 |
| Role 2 rack focus | Right-foreground blocking, snap-turn and strong background defocus are present. Portrait scale/timing still differs. | 65 |
| Male pullback -> bat-guard takeover | The bat now breaches from the left edge and receives focus. Its frontal pose and the reference car composition need refinement. | 50 |
| C-role reveal | C role is now isolated by a low-angle close framing, then receives a continuous rising pullback. It still lacks the reference's side-lean/vehicle interaction. | 65 |
| Five-role finale | All five mannequins and the car are present at frames 288, 320 and 360 after correcting the final lens from 70mm to 40mm. Stagger/pose spacing needs refinement. | 75 |
| Motion continuity | The end segment is now continuous from 217 to 360; earlier sections still have inherited timing differences. | 60 |

**Overall: 63 / 100.** This is the current working baseline and a genuine improvement over iteration 17. It is still below the 90% goal; next work must target role-1 orientation, bat-guard frontal composition, and shot-to-shot timing rather than broad scene construction.

## Iteration 19 - Performance Pass

Artifact: `D:\Chrome_Download\mythrealms_garage_mannequin_director_stage\garage_mannequin_director_stage_actions_v19_performance_pass.blend`

Added head/chest/waist keyframes for the opening gaze lift, the glasses-role snap turn, the bat-guard chin lift, and the C-role rise. A stale camera-position curve caused the frame-65 closeup to render empty.

**Overall: 61 / 100.** Rejected as the working baseline because the frame-65 continuity gate failed, despite improved character acting.

## Iteration 20 - Clean Opening Camera Path

Artifact: `D:\Chrome_Download\mythrealms_garage_mannequin_director_stage\garage_mannequin_director_stage_actions_v20_clean_opening_camera_path.blend`  
Evidence: `preview_frames\v20_opening_camera_clean\`

| Section | Result | Score |
| --- | --- | ---: |
| Role 1 opening | Role 1 now stays as the readable opening subject through frame 64 and performs a lowered-head to raised-head action. Car-edge framing and exact three-quarter orientation remain weaker than reference. | 67 |
| Role 2 rack focus | The foreground role is absent until the intended beat, appears side/back at frame 65, then turns into a focused close portrait at frame 66 while role 1 remains a left-background blur. | 78 |
| Male pullback -> bat guard | Retains iteration 18's left-edge bat entrance but remains less precise than reference. | 50 |
| C-role reveal | Retains the low-angle rise and pullback. | 65 |
| Five-role finale | Retains all five roles plus car within a stable 40mm wide frame. | 75 |
| Motion continuity | The critical opening path (frames 1-120) is now explicitly keyed without the inherited 64-65 position jump. | 72 |

**Overall: 68 / 100.** Current working baseline. The next constrained objective is to improve the bat-guard takeover and C-role vehicle interaction without disturbing the verified opening path.

## Iteration 21 - Midspace Car and Bat Entry

Artifact: `D:\Chrome_Download\mythrealms_garage_mannequin_director_stage\garage_mannequin_director_stage_actions_v21_midspace_car_bat_entry.blend`  
Evidence: `preview_frames\v21_midspace_bat\`

The male retreat now uses an 18mm wide pullback at frame 144, putting the car front back in the shot. The bat guard breaks the left edge at 156 and becomes the focus by 168.

**Overall: 72 / 100.** Accepted as an intermediate improvement. The bat guard is still too back-facing and the male/car composition remains more distant than reference.

## Iteration 22 - C Role Hands on Car

Artifact: `D:\Chrome_Download\mythrealms_garage_mannequin_director_stage\garage_mannequin_director_stage_actions_v22_center_hands_on_car.blend`  
Evidence: `preview_frames\v22_center_hands\`

Added a staged hand-IK progression from crouch to both hands directed onto the car hood, then retained it through the pullback and final tableau.

**Overall: 75 / 100.** Accepted. The C role now reads as controlling the car rather than standing passively in front of it; exact side-lean framing remains incomplete.

## Iteration 23 / 24 - Male Bat Handoff Experiments

Artifacts: `...v23_male_bat_handoff.blend`, `...v24_male_bat_world_fixed.blend`

The first duplicate inherited a role-container offset and landed in empty space. The world-space correction fixed the close shot but floated in the wide pullback.

**Overall: 72 / 100.** Both variants are rejected as working baselines. They are retained only as documented experiments.

## Iteration 25 - Clean Bat Handoff

Artifact: `D:\Chrome_Download\mythrealms_garage_mannequin_director_stage\garage_mannequin_director_stage_actions_v25_bat_handoff_clean.blend`

The male's shoulder bat remains only in his close/initial-reveal beat and is removed before it would float in the wide shot. The bat guard then owns the prop during the foreground section.

**Overall: 75 / 100.** Current working baseline. Reaching 90 requires a more faithful role-1 front/three-quarter camera relationship, a frontal bat-guard closeup, and a final timing audit across all 30 reference samples.

## Iteration 26 / 27 - Camera-Parent Failure and World-Space Replacement

Artifacts: `...v26_opening_pullback_bat_refined.blend`, `...v27_worldspace_camera_locked.blend`

Iteration 26 added the oblique opening, car-side pullback, and a clean chest-bone-parented shoulder bat. Validation exposed an inherited local camera offset: frames 66 and 156 could evaluate as empty shots even though their director-rig values looked correct. Iteration 27 replaced that vulnerable parented camera with `DIRECTOR_CAMERA_WORLDSPACE_v27`, a parentless world-space camera, while retaining the existing C-role and final-wide blocking.

**Overall: 74 / 100.** Rejected as the working baseline because the first world-space pass still sampled the glasses role's pre-move location at frame 66. The source of the failure is documented and no earlier file was overwritten.

## Iteration 28 - Rack Focus Re-sampled After Snap Turn

Artifact: `D:\Chrome_Download\mythrealms_garage_mannequin_director_stage\garage_mannequin_director_stage_actions_v28_rack_focus_resampled.blend`  
Evidence: `preview_frames\v28_rack_validation\`

| Section | Result | Score |
| --- | --- | ---: |
| Role 1 opening | New oblique camera keeps role 1 on the right with a visible car edge, but the simplified mannequin cannot yet read the exact side-facing/looking-down pose of the reference. | 70 |
| Glasses-role rack focus | Frames 64-68 now evaluate continuously: role 1 is clear through 64, the glasses role enters from the right at 65, and is locked in focus from 66 while role 1 remains a strong left-background blur. | 85 |
| Male pullback -> bat-guard takeover | The car-side retreat is readable at 144; the male holds at 156 and the bat guard receives a low-angle foreground takeover from 168. The handoff is still more abrupt and less layered than the reference. | 70 |
| C-role reveal | Preserved low-angle C-role entry and rise, but it needs a more faithful offscreen walk-in and vehicle lean. | 66 |
| Five-role finale | All five roles and the car remain in a stable final wide frame. Spacing and pose hierarchy still need refinement. | 76 |
| Motion continuity | The former 66-frame blank shot is removed by re-sampling after the role's world-position change. The camera is now parentless and deterministic. | 82 |

**Overall: 77 / 100.** This is the new working baseline. The 90% gate remains unmet. The next pass should improve the male-to-bat overlap, the C-role walk-in/lean, and the final tableau hierarchy while preserving the verified 64-84 rack-focus sequence.
