# MythRealms Video Pipeline

## Quick Start

### 1. Generate frames with ChatGPT
For each scene in your storyboard, generate a separate image:
```
frame-01.png  →  Opening: dark void + light beam
frame-02.png  →  Product close-up: black obsidian bracelet
frame-03.png  →  Atmospheric scene: misty cathedral chamber
frame-04.png  →  Model shot: wrist with relic
frame-05.png  →  Detail: stone texture + gold accent
frame-06.png  →  Closing: MythRealms logo + "Not Jewelry" text
```
Resolution: 1080×1920 (9:16 vertical for TikTok/Reels)

Place all frames in `video-pipeline/frames/`

### 2. Build the video
```powershell
cd video-pipeline
.\compose.ps1 -Output "output/mythrealms_video.mp4"
```

With audio:
```powershell
.\compose.ps1 -AudioFile "assets/soundtrack.mp3"
```

### 3. Frame timing (15 seconds)
| Frame | Time | Effect |
|---|---|---|
| frame-01 | 0.0-2.5s | Slow zoom-in + fade from black |
| frame-02 | 2.0-4.5s | Slow zoom-out + crossfade |
| frame-03 | 4.0-6.5s | Gentle pan + crossfade |
| frame-04 | 6.0-8.5s | Slow zoom-in + crossfade |
| frame-05 | 8.0-10.5s | Slow zoom-in + crossfade |
| frame-06 | 10.0-15.0s | Static + text overlay + fade to logo |

### Requirements
- FFmpeg installed and in PATH

### Output
- 1080×1920 mp4 (vertical)
- 30fps
- H.264 encoded
- Crossfade transitions (0.5s)
- Ken Burns effects (varied zoom/pan per frame)
