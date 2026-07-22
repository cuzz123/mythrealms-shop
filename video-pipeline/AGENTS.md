# Automated Editing Workflow

## Goal
Turn a reference short video and a reusable material library into a reviewable vertical remix, with machine-readable intermediate files and an optional Jianying draft.

## Directory Rules
- `assets/`: reusable source materials. Copy from here; never move, delete, or rewrite originals.
- `work/`: one job folder per edit. Put reference files, generated metadata, clips, matches, captions, previews, and draft output here.
- `final/`: approved outputs only.
- `recipe.json`: the source of truth for reference-video structure.
- `matches.json`: the source of truth for selected replacement materials.
- `fragment_plan.json`: matching rationale and constraints for each fragment.

## Job Layout
```text
work/
  YYYY-MM-DD-HHMM-short-name/
    reference.mp4
    reference_audio.mp3
    recipe.json
    script.txt
    video_clips/
      fragment01.mp4
      fragment01.jpg
    material/
      fragment01/
    voice/
      final_voice.mp3
    captions.srt
    remix.mp4
    jianying_draft/
```

## Workflow
1. Analyze the reference video with FFmpeg scene detection.
2. Save each fragment clip and keyframe under `video_clips/`.
3. Generate `recipe.json` with start time, end time, duration, clip path, and keyframe path.
4. Match every reference keyframe against `assets/` by visual similarity.
5. Copy approved material into `material/fragmentNN/`; do not move originals.
6. Generate `fragment_plan.json` and `matches.json`.
7. Render `remix.mp4` and `captions.srt`.
8. If available, create a Jianying draft from the same timeline. If draft creation fails, keep the manifest and report why.

## Acceptance Criteria
- Low-confidence matches stay visible as missing material; do not fill them with unrelated media.
- Avoid using the same source file across three consecutive fragments.
- Avoid obvious adjacent repetition of the same folder, room, shot, or composition.
- Keep final output vertical: 1080x1920, 60 fps by default.
- Captions must stay within their fragment time range.
- Generated media paths in draft metadata must be absolute and point to existing files.
- Do not claim ASR, TTS, voice cloning, or Jianying draft generation succeeded unless the tool actually ran and produced a verifiable file.
