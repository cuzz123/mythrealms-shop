# iClone AI Studio Pre-Generation Package

This package prepares inputs before AI video generation. iClone 8 controls scene layout, camera, pose, and motion. AI Studio with Seedance produces the final realistic video.

Blender is not part of this first phase. Obsidian is optional and should only record approvals, prompt revisions, and rejected generations.

## Prepare A Job

Run from PowerShell. Pass the directory that contains the five role sheets:

```powershell
cd D:\mythrealms-shop\video-pipeline
.\scripts\12-iclone-ai-studio-prep.ps1 `
  -ReferenceVideo "D:\Chrome_Download\v03c76g10004d97q32qljht2pve1.750.mp4" `
  -CharactersDirectory "<role-image-directory>"
```

The script validates the source files and writes a dated `manifest.json` under `video-pipeline/work/`. It only records absolute paths; it never moves or edits source media.

## iClone And AI Studio

1. Open iClone 8 and build the garage with proxy actors, a car, and lighting.
2. Follow the `iclone.blocking` and `iclone.camera` entries in the generated manifest.
3. In AI Studio, provide the source video for cadence and camera language, plus the role reference specified by each shot.
4. Generate the five shots separately, approve them, then assemble the accepted clips in Jianying.

## Shot Plan

| Shot | Time | Lead role | Intent |
| --- | --- | --- | --- |
| S01 | 00:00-00:02 | right1_black | Black-look character reveal; no bat visible. |
| S02 | 00:02-00:05 | left2_glasses | Glasses close-up and rack-focus finish. |
| S03 | 00:05-00:09 | right1_black | Bat enters, shoulder pose, foreground cut-in. |
| S04 | 00:09-00:12 | center_navy | Center role reveal with car behind. |
| S05 | 00:12-00:15 | group | Five-role power tableau. |

## Optional Obsidian

Use one note per shot. Keep only the accepted prompt, iClone screenshot, Seedance output path, and a one-line decision. Do not duplicate source videos into the vault.
