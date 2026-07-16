# Viral Video Breakdown Design

## Goal

Turn one local reference MP4 into a reviewable, reusable breakdown job:

1. a timeline that covers both edit cuts and one-take camera beats;
2. a structured shot recipe suitable for director blocking and asset reuse;
3. an Obsidian report with keyframes and explicit asset gaps;
4. a machine-readable asset backlog that can be promoted into the asset registry after review.

## Scope

This first version is local and deterministic. It does not call paid vision APIs, create a web upload flow, generate Blender files, or generate a final replacement video.

It extends the existing FFmpeg-based reference analyzer. Existing automated remix and storyboard workflows must continue to work without changing their output contracts.

## Input and output

Input:

- a local MP4 accepted by FFmpeg;
- an optional job name;
- optional beat interval in seconds, default 0.8 seconds.

Output under video-pipeline/work/<job>/breakdown/:

- beat_timeline.json: cut boundaries plus regular camera beats, deduplicated and bounded by video duration;
- breakdown.json: a v1 semantic shell with one editable record per beat interval;
- keyframes/: one still at each beat boundary;
- asset-gaps.json: normalized missing-asset proposals;
- obsidian-report.md: human review report linking the keyframes and source data.

The report must use the existing Obsidian vault and link to the exact job data without copying or moving the source video.

## Timeline model

Scene remains the existing FFmpeg edit-cut result. A separate beat is used for all director decisions:

- every edit boundary is a beat boundary;
- regular boundaries are inserted at the configured interval;
- boundaries are sorted, de-duplicated within 40 ms, and include exactly 0 and the video duration;
- intervals shorter than 120 ms are merged into the following interval.

This makes a continuous take analyzable without falsely pretending it has multiple edits.

## Semantic record

Each beat interval writes an editable record with these fields:

- id, start, end, duration, keyframe;
- editing: cut, continuous, or transition;
- camera: scale, movement, direction, lens_feel, focus_behavior;
- blocking: roles, subject direction, subject position, product position, anchor object, and relative-position notes;
- lighting: key direction, quality, color temperature, contrast, and practical sources;
- viral_hook: visual hook, information change, product visibility, transition mechanism, and audio cue;
- assets: reusable asset IDs and proposed gaps;
- review: score fields and reviewer notes.

The first automatic pass writes conservative values: unknown is explicitly unknown, while the analyzer infers only timeline/editing and available asset inventory. The user corrects visual semantics in the generated Markdown or JSON; a later vision module can fill these fields.

## Asset-gap policy

The analyzer reads asset-library/registry/assets.json. It creates a gap only when a selected semantic field references an asset category with no reusable candidate. New gaps are suggestions, not registry assets:

- planned camera or lighting assets count as candidates but are marked non-ready;
- available_* and approved assets are ready candidates;
- character references and unrigged meshes are not accepted as natural-action assets;
- no automatic registry writes occur.

## CLI

New command:

    python src/breakdown_reference.py --reference "D:\videos\reference.mp4" --job-name "viral-test"

PowerShell wrapper:

    .\scripts\05-breakdown-viral-video.ps1 -Reference "D:\videos\reference.mp4" -JobName "viral-test"

## Verification

Tests use generated short MP4 fixtures and a temporary asset registry. They must prove:

1. a continuous video receives regular beat boundaries even when it has no cuts;
2. a cut video retains the cut as an exact beat boundary;
3. the semantic schema is complete and intentionally marks unobserved visual properties as unknown;
4. the generated asset gaps distinguish ready, planned, and unavailable asset candidates;
5. the Obsidian report links its data and keyframes.

## Acceptance criteria

- The command runs locally with the existing requirements.
- It never alters the source MP4 or existing recipe.json.
- Every report interval has a keyframe and editable semantic record.
- The output opens as a linked report from the Obsidian vault.
- Tests pass with python -m unittest discover -s tests -p "test_breakdown_reference.py" -v.
