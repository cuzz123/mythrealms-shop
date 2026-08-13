# AE Reference Control Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and render a 15.046-second Adobe After Effects 2.5D control pass that reproduces the reference video's role-reveal order, camera pullback, rack-focus handoffs, and final five-role car tableau.

**Architecture:** Store the shot contract in one JSON manifest, generate the complete AE project from one deterministic ExtendScript file, and drive build/render/transcode/QC from one PowerShell entry point. Keep debug overlays and the clean Xiaoyunque input as separate AE master comps so review information never leaks into the model-facing video.

**Tech Stack:** Adobe After Effects ExtendScript, AfterFX/aerender, PowerShell 7 or Windows PowerShell 5.1, Python 3, pytest, FFmpeg/ffprobe.

## Global Constraints

- Source: `D:\Chrome_Download\v03c76g10004d97q32qljht2pve1.750.mp4`.
- Duration: 15.046 seconds; rendered duration must differ by no more than one frame.
- Raster and rate: 1280×720, 24 fps, square pixels, 16:9.
- Five roles must enter in source order; each key entry may differ by at most three frames.
- The camera path must remain continuous; no blank frames, unmotivated jumps, or unintended layer crossings.
- The final five-role/car tableau must hold for at least 12 frames.
- `MASTER_CLEAN` contains no labels, guide paths, or debug text.
- No final logo, readable brand copy, photoreal cast, or fine jewelry structure in this control pass.
- Work outputs live under `video-pipeline/work/ae-control-v03c76g10004d97q32qljht2pve1/`.
- Do not upload to Xiaoyunque or spend generation credits in this plan.

## File Map

- Create `video-pipeline/ae-control/v03c76g10004d97q32qljht2pve1/control-pass.json`: single source of truth for source metadata, beat frames, role colors, camera keys, focus keys, layer names, and output paths.
- Create `video-pipeline/ae-control/v03c76g10004d97q32qljht2pve1/build-control-pass.jsx`: deterministic AE project generator; creates comps, shape layers, 3D rig, overlays, markers, render masters, and saves the `.aep`.
- Create `video-pipeline/ae-control/v03c76g10004d97q32qljht2pve1/render-control-pass.ps1`: locates AE, runs the builder, invokes aerender, transcodes review/clean videos, exports endpoints, and emits QC metadata.
- Create `video-pipeline/ae-control/v03c76g10004d97q32qljht2pve1/xiaoyunque-prompt-zh.md`: reference-role prompt and upload order.
- Create `video-pipeline/tests/test_ae_control_pass.py`: manifest and JSX static-contract tests.
- Generate `video-pipeline/work/ae-control-v03c76g10004d97q32qljht2pve1/ae-reference-control-pass.aep` and render/QC artifacts; do not commit generated media.

---

### Task 1: Lock the 360-frame Shot Contract

**Files:**
- Create: `video-pipeline/ae-control/v03c76g10004d97q32qljht2pve1/control-pass.json`
- Create: `video-pipeline/tests/test_ae_control_pass.py`

**Interfaces:**
- Consumes: source-video facts from ffprobe and the approved design spec.
- Produces: `load_manifest() -> dict`, integer beat frames, named role definitions, camera keys, focus keys, and absolute output paths consumed by Tasks 2–5.

- [ ] **Step 1: Write the failing manifest tests**

Create the following test module section:

```python
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
JOB = ROOT / "video-pipeline" / "ae-control" / "v03c76g10004d97q32qljht2pve1"
MANIFEST = JOB / "control-pass.json"


def load_manifest() -> dict:
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


def test_manifest_locks_source_and_delivery_spec() -> None:
    data = load_manifest()
    assert data["source"] == r"D:\Chrome_Download\v03c76g10004d97q32qljht2pve1.750.mp4"
    assert data["width"] == 1280
    assert data["height"] == 720
    assert data["fps"] == 24
    assert data["duration_seconds"] == 15.046
    assert data["duration_frames"] == 361


def test_manifest_has_ordered_role_and_focus_handoffs() -> None:
    data = load_manifest()
    assert [role["id"] for role in data["roles"]] == [
        "ROLE_01", "ROLE_02", "ROLE_03", "ROLE_04", "ROLE_05"
    ]
    entries = [role["entry_frame"] for role in data["roles"]]
    assert entries == sorted(entries)
    assert entries == [0, 48, 120, 216, 288]
    assert [key["target"] for key in data["focus_keys"]] == [
        "ROLE_01", "ROLE_02", "ROLE_03", "ROLE_04", "GROUP"
    ]


def test_manifest_finishes_with_stable_group_hold() -> None:
    data = load_manifest()
    assert data["final_hold_start_frame"] <= data["duration_frames"] - 12
    assert data["camera_keys"][-1]["frame"] == data["final_hold_start_frame"]
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```powershell
python -m pytest video-pipeline/tests/test_ae_control_pass.py -v
```

Expected: failure because `control-pass.json` does not exist.

- [ ] **Step 3: Create the complete manifest**

Create `control-pass.json` with this data model and values:

```json
{
  "job_id": "ae-control-v03c76g10004d97q32qljht2pve1",
  "source": "D:\\Chrome_Download\\v03c76g10004d97q32qljht2pve1.750.mp4",
  "work_dir": "D:\\mythrealms-shop\\video-pipeline\\work\\ae-control-v03c76g10004d97q32qljht2pve1",
  "project_path": "D:\\mythrealms-shop\\video-pipeline\\work\\ae-control-v03c76g10004d97q32qljht2pve1\\ae-reference-control-pass.aep",
  "width": 1280,
  "height": 720,
  "fps": 24,
  "duration_seconds": 15.046,
  "duration_frames": 361,
  "final_hold_start_frame": 349,
  "roles": [
    {"id":"ROLE_01","entry_frame":0,"color":[0.22,0.60,1.00],"start":[760,390,40],"end":[410,420,180]},
    {"id":"ROLE_02","entry_frame":48,"color":[1.00,0.55,0.20],"start":[1510,390,-260],"end":[540,415,120]},
    {"id":"ROLE_03","entry_frame":120,"color":[0.84,0.30,0.72],"start":[-300,430,-180],"end":[350,435,90]},
    {"id":"ROLE_04","entry_frame":216,"color":[0.92,0.92,0.92],"start":[650,780,-40],"end":[640,430,110]},
    {"id":"ROLE_05","entry_frame":288,"color":[0.30,0.90,0.58],"start":[1450,430,-100],"end":[950,435,130]}
  ],
  "camera_keys": [
    {"frame":0,"position":[640,360,-1250],"point":[760,390,40],"zoom":1150},
    {"frame":48,"position":[675,350,-1210],"point":[755,390,40],"zoom":1180},
    {"frame":72,"position":[720,355,-1080],"point":[900,390,-100],"zoom":1280},
    {"frame":120,"position":[660,350,-1400],"point":[690,410,20],"zoom":920},
    {"frame":216,"position":[610,455,-1550],"point":[520,420,40],"zoom":820},
    {"frame":288,"position":[640,410,-2050],"point":[640,410,90],"zoom":720},
    {"frame":349,"position":[640,320,-2450],"point":[640,420,100],"zoom":640}
  ],
  "focus_keys": [
    {"frame":0,"target":"ROLE_01"},
    {"frame":60,"target":"ROLE_02"},
    {"frame":156,"target":"ROLE_03"},
    {"frame":228,"target":"ROLE_04"},
    {"frame":300,"target":"GROUP"}
  ],
  "outputs": {
    "review_avi":"review-overlay.avi",
    "clean_avi":"xiaoyunque-control-clean.avi",
    "review_mp4":"review-overlay.mp4",
    "clean_mp4":"xiaoyunque-control-clean.mp4",
    "first_frame":"first-frame.png",
    "last_frame":"last-frame.png",
    "qc_json":"qc.json",
    "comparison":"comparison-contact-sheet.jpg"
  }
}
```

- [ ] **Step 4: Run tests and verify the manifest contract passes**

Run:

```powershell
python -m pytest video-pipeline/tests/test_ae_control_pass.py -v
```

Expected: three tests pass.

- [ ] **Step 5: Commit the manifest contract**

```powershell
git add -- video-pipeline/ae-control/v03c76g10004d97q32qljht2pve1/control-pass.json video-pipeline/tests/test_ae_control_pass.py
git commit -m "test: lock AE control pass timing"
```

---

### Task 2: Generate the Deterministic AE Project

**Files:**
- Create: `video-pipeline/ae-control/v03c76g10004d97q32qljht2pve1/build-control-pass.jsx`
- Modify: `video-pipeline/tests/test_ae_control_pass.py`

**Interfaces:**
- Consumes: `control-pass.json` located beside the JSX file.
- Produces: comps named `REF_SOURCE`, `CTRL_WORLD`, `ROLE_01`–`ROLE_05`, `MASTER_CLEAN`, and `MASTER_REVIEW`; camera `CAMERA_RIG`; null `FOCUS_RIG`; project file at `manifest.project_path`.

- [ ] **Step 1: Add failing static-contract tests for the JSX**

Append:

```python
JSX = JOB / "build-control-pass.jsx"


def test_jsx_declares_required_project_units() -> None:
    source = JSX.read_text(encoding="utf-8")
    for token in (
        '"REF_SOURCE"', '"CTRL_WORLD"', '"MASTER_CLEAN"', '"MASTER_REVIEW"',
        '"CAMERA_RIG"', '"FOCUS_RIG"', '"BEAT_MARKERS"', '"REVIEW_OVERLAY"'
    ):
        assert token in source
    for role in range(1, 6):
        assert f'"ROLE_{role:02d}"' in source


def test_jsx_saves_the_project_and_separates_review_overlay() -> None:
    source = JSX.read_text(encoding="utf-8")
    assert "app.project.save" in source
    assert "MASTER_CLEAN" in source
    assert "MASTER_REVIEW" in source
    assert "REVIEW_OVERLAY" in source
    assert "cleanComp.layers.add(overlayComp)" not in source
```

- [ ] **Step 2: Run the JSX tests and confirm they fail**

Run:

```powershell
python -m pytest video-pipeline/tests/test_ae_control_pass.py -k jsx -v
```

Expected: failure because `build-control-pass.jsx` does not exist.

- [ ] **Step 3: Implement the AE builder with explicit helpers**

The script must implement and call these complete interfaces:

```javascript
function readJson(file) { file.open("r"); var text = file.read(); file.close(); return JSON.parse(text); }
function frameTime(frame, fps) { return frame / fps; }
function setKeys(property, keys, fps) {
    for (var i = 0; i < keys.length; i++) property.setValueAtTime(frameTime(keys[i].frame, fps), keys[i].value);
}
function easeAll(property, influence) {
    for (var i = 1; i <= property.numKeys; i++) {
        var ease = new KeyframeEase(0, influence);
        var dimensions = property.value instanceof Array ? property.value.length : 1;
        var incoming = [], outgoing = [];
        for (var d = 0; d < dimensions; d++) { incoming.push(ease); outgoing.push(ease); }
        property.setTemporalEaseAtKey(i, incoming, outgoing);
    }
}
function addRoleComp(folder, manifest, role) {
    var comp = app.project.items.addComp(role.id, 300, 600, 1, manifest.duration_seconds, manifest.fps);
    comp.parentFolder = folder;
    var body = comp.layers.addShape(); body.name = role.id + "_BODY";
    var contents = body.property("ADBE Root Vectors Group");
    var rect = contents.addProperty("ADBE Vector Shape - Rect"); rect.property("ADBE Vector Rect Size").setValue([110, 390]);
    var fill = contents.addProperty("ADBE Vector Graphic - Fill"); fill.property("ADBE Vector Fill Color").setValue(role.color);
    var head = contents.addProperty("ADBE Vector Shape - Ellipse"); head.property("ADBE Vector Ellipse Size").setValue([105, 125]);
    head.property("ADBE Vector Ellipse Position").setValue([0, -245]);
    return comp;
}
function addBeatMarker(comp, frame, label, fps) {
    var marker = new MarkerValue(label); comp.markerProperty.setValueAtTime(frameTime(frame, fps), marker);
}
```

The main body must use `app.beginUndoGroup("Build AE Reference Control Pass")`, close any default untitled project without saving, import the source as `REF_SOURCE`, create a garage-world precomp with a dark floor, perspective lane lines, a centered car placeholder and repeated ceiling-light bars, build the five role precomps, and add all role/world layers as 3D layers. It must set each role's entry/start/end values from the manifest, add three-key head/torso motion around the role's entry, create a two-node AE camera, apply the manifest camera position/point/zoom keys, enable depth of field, and animate focus distance at each `focus_keys` frame.

Create `MASTER_CLEAN` from only `CTRL_WORLD`, role layers, the camera, and source audio. Duplicate it as `MASTER_REVIEW`; add `REVIEW_OVERLAY` only to the review comp. The overlay must show role IDs, action-safe title, current frame, and five colored path strokes. Add markers at frames 0, 48, 120, 216, 288, and 349. Save with `app.project.save(new File(manifest.project_path))`, call `app.endUndoGroup()`, and surface errors with `alert("AE control pass build failed: " + error.toString())` before rethrowing.

- [ ] **Step 4: Run all static tests**

Run:

```powershell
python -m pytest video-pipeline/tests/test_ae_control_pass.py -v
```

Expected: all manifest and JSX contract tests pass.

- [ ] **Step 5: Commit the AE builder**

```powershell
git add -- video-pipeline/ae-control/v03c76g10004d97q32qljht2pve1/build-control-pass.jsx video-pipeline/tests/test_ae_control_pass.py
git commit -m "feat: generate AE reference control project"
```

---

### Task 3: Add AE Location, Render, and Transcode Automation

**Files:**
- Create: `video-pipeline/ae-control/v03c76g10004d97q32qljht2pve1/render-control-pass.ps1`
- Modify: `video-pipeline/tests/test_ae_control_pass.py`

**Interfaces:**
- Consumes: optional `-AfterEffectsPath`, optional `-AerenderPath`, `control-pass.json`, builder JSX, and source MP4.
- Produces: `.aep`, lossless review/clean intermediates, H.264 review/clean MP4s, endpoint PNGs, and `qc.json`.

- [ ] **Step 1: Add a failing runner-contract test**

Append:

```python
RUNNER = JOB / "render-control-pass.ps1"


def test_runner_has_dry_run_and_required_tools() -> None:
    source = RUNNER.read_text(encoding="utf-8")
    assert "[switch]$DryRun" in source
    assert "AfterFX.exe" in source
    assert "aerender.exe" in source
    assert "ffmpeg" in source
    assert "ffprobe" in source
    assert "MASTER_CLEAN" in source
    assert "MASTER_REVIEW" in source
```

- [ ] **Step 2: Run the runner test and confirm it fails**

Run:

```powershell
python -m pytest video-pipeline/tests/test_ae_control_pass.py -k runner -v
```

Expected: failure because `render-control-pass.ps1` does not exist.

- [ ] **Step 3: Implement the runner**

Use this parameter contract and location order:

```powershell
[CmdletBinding()]
param(
    [string]$AfterEffectsPath,
    [string]$AerenderPath,
    [switch]$DryRun
)
$ErrorActionPreference = 'Stop'
$JobDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Manifest = Get-Content -Raw (Join-Path $JobDir 'control-pass.json') | ConvertFrom-Json
$WorkDir = $Manifest.work_dir
$Builder = Join-Path $JobDir 'build-control-pass.jsx'
$Project = $Manifest.project_path
New-Item -ItemType Directory -Force -Path $WorkDir | Out-Null
```

Resolve AE in this order: explicit parameter, `HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\AfterFX.exe`, `HKCU` equivalent, then recursive search under `C:\Program Files\Adobe` limited to `AfterFX.exe`. Derive `aerender.exe` from the selected AE directory unless explicitly supplied. Resolve FFmpeg and ffprobe with `Get-Command`.

For `-DryRun`, print one JSON object containing `afterEffects`, `aerender`, `ffmpeg`, `ffprobe`, `builder`, `project`, `workDir`, and `source`, then exit without launching applications.

For execution, call AfterFX with `-r $Builder`, poll for `$Project` for up to 120 seconds while allowing GUI visibility, then render:

```powershell
& $AerenderPath -project $Project -comp 'MASTER_CLEAN' -output (Join-Path $WorkDir 'xiaoyunque-control-clean.avi')
& $AerenderPath -project $Project -comp 'MASTER_REVIEW' -output (Join-Path $WorkDir 'review-overlay.avi')
```

Transcode each AVI to H.264 using `-c:v libx264 -pix_fmt yuv420p -r 24 -movflags +faststart`; map source audio with `-map 0:v:0 -map 1:a:0? -shortest`. Export frame zero and the final displayed frame from the clean MP4. Write `qc.json` from ffprobe fields `duration`, `width`, `height`, `r_frame_rate`, `codec_name`, and file size. Exit nonzero when the project, either render, either endpoint PNG, or QC JSON is missing.

- [ ] **Step 4: Run tests and a dry-run probe**

Run:

```powershell
python -m pytest video-pipeline/tests/test_ae_control_pass.py -v
powershell -NoProfile -ExecutionPolicy Bypass -File video-pipeline/ae-control/v03c76g10004d97q32qljht2pve1/render-control-pass.ps1 -DryRun
```

Expected: pytest passes. Dry run prints valid JSON; if AE is not installed, it exits with a clear `AfterFX.exe was not found` error before any mutation outside the task work directory.

- [ ] **Step 5: Commit the render automation**

```powershell
git add -- video-pipeline/ae-control/v03c76g10004d97q32qljht2pve1/render-control-pass.ps1 video-pipeline/tests/test_ae_control_pass.py
git commit -m "feat: automate AE control pass rendering"
```

---

### Task 4: Build and Render in After Effects

**Files:**
- Generate: `video-pipeline/work/ae-control-v03c76g10004d97q32qljht2pve1/ae-reference-control-pass.aep`
- Generate: `video-pipeline/work/ae-control-v03c76g10004d97q32qljht2pve1/review-overlay.mp4`
- Generate: `video-pipeline/work/ae-control-v03c76g10004d97q32qljht2pve1/xiaoyunque-control-clean.mp4`
- Generate: `video-pipeline/work/ae-control-v03c76g10004d97q32qljht2pve1/first-frame.png`
- Generate: `video-pipeline/work/ae-control-v03c76g10004d97q32qljht2pve1/last-frame.png`

**Interfaces:**
- Consumes: tested manifest, JSX builder, renderer, local AE installation, FFmpeg, and source video.
- Produces: the editable project and model-facing/review media required by Task 5.

- [ ] **Step 1: Locate AE through the supported Windows-control workflow**

Initialize the Computer Use runtime, read its `guidance`, `api`, and `confirmations` documentation, then inspect the Creative Cloud/Start menu only if registry and filesystem detection did not locate AE. Record the resolved `AfterFX.exe` and adjacent `aerender.exe`; do not install or update Adobe software without explicit user authorization.

- [ ] **Step 2: Run the full builder/render pipeline**

Run with the resolved path:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File video-pipeline/ae-control/v03c76g10004d97q32qljht2pve1/render-control-pass.ps1 -AfterEffectsPath 'C:\Program Files\Adobe\Adobe After Effects 2026\Support Files\AfterFX.exe'
```

Expected: the AE project opens/builds visibly, aerender completes both comps, and the work directory contains the two MP4s, two PNGs, and `qc.json`.

- [ ] **Step 3: Inspect AE for script/runtime errors**

Use Windows screenshots/UI Automation to verify `MASTER_CLEAN`, `MASTER_REVIEW`, `CAMERA_RIG`, `FOCUS_RIG`, and all five role comps exist. Scrub frames 0, 60, 156, 228, 300, and 349. If a frame is empty, fix only the corresponding manifest camera/role key and rerun; preserve already accepted beats.

- [ ] **Step 4: Validate rendered media mechanically**

Run:

```powershell
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate -of json video-pipeline/work/ae-control-v03c76g10004d97q32qljht2pve1/xiaoyunque-control-clean.mp4
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate -of json video-pipeline/work/ae-control-v03c76g10004d97q32qljht2pve1/review-overlay.mp4
```

Expected: both videos are H.264, 1280×720, 24 fps, and 15.046 seconds within one frame.

- [ ] **Step 5: Keep generated media uncommitted**

Run:

```powershell
git status --short -- video-pipeline/work/ae-control-v03c76g10004d97q32qljht2pve1
```

Expected: generated artifacts are either ignored or remain untracked; do not stage `.aep`, `.avi`, `.mp4`, `.png`, or `qc.json`.

---

### Task 5: Visual QC and Xiaoyunque Handoff

**Files:**
- Create: `video-pipeline/ae-control/v03c76g10004d97q32qljht2pve1/xiaoyunque-prompt-zh.md`
- Generate: `video-pipeline/work/ae-control-v03c76g10004d97q32qljht2pve1/comparison-contact-sheet.jpg`
- Modify: `video-pipeline/tests/test_ae_control_pass.py`

**Interfaces:**
- Consumes: source MP4, clean/review control videos, endpoint PNGs, and `qc.json`.
- Produces: comparison evidence, final prompt, and a pass/fail record for every approved design criterion.

- [ ] **Step 1: Add a failing prompt-contract test**

Append:

```python
PROMPT = JOB / "xiaoyunque-prompt-zh.md"


def test_xiaoyunque_prompt_isolates_reference_roles() -> None:
    text = PROMPT.read_text(encoding="utf-8")
    assert "只参考动作时序、人物站位、镜头路径、构图展开和焦点节奏" in text
    assert "不要继承占位人物外观" in text
    assert "不要生成角色编号、路径线、调试文字" in text
```

- [ ] **Step 2: Run the prompt test and confirm it fails**

Run:

```powershell
python -m pytest video-pipeline/tests/test_ae_control_pass.py -k xiaoyunque -v
```

Expected: failure because the handoff prompt does not exist.

- [ ] **Step 3: Write the final Chinese reference prompt**

Create the file with this exact model-facing paragraph:

```markdown
# 小云雀参考视频提示词

上传顺序：视频 1 为 `xiaoyunque-control-clean.mp4`；后续人物、场景和产品参考图分别上传并单独指定角色。

视频 1 只参考动作时序、人物站位、镜头路径、构图展开和焦点节奏：先由车旁单人中近景开始，右前景人物进入并完成拉焦，镜头连续后拉揭示车辆与左前景人物，再以低机位揭示中心人物，最后收束为五人与车辆的稳定宽景。不要继承占位人物外观、颜色、材质或临时车辆造型；不要生成角色编号、路径线、调试文字、品牌字样或水印。人物身份只由人物参考图控制，场景材质只由场景参考图控制，产品结构只由产品参考图控制。
```

- [ ] **Step 4: Generate and inspect the comparison sheet**

Extract the same six frames from source and clean control videos at seconds `0`, `2.5`, `6.5`, `9.5`, `12.5`, and `14.5`; label source/control rows and combine them into `comparison-contact-sheet.jpg` with FFmpeg. Inspect the sheet and record pass/fail for role order, camera direction, focus subject, vehicle visibility, and final group hold. Fix one variable per rerender.

- [ ] **Step 5: Run the full automated test suite**

Run:

```powershell
python -m pytest video-pipeline/tests/test_ae_control_pass.py -v
```

Expected: all tests pass.

- [ ] **Step 6: Commit the handoff prompt and tests**

```powershell
git add -- video-pipeline/ae-control/v03c76g10004d97q32qljht2pve1/xiaoyunque-prompt-zh.md video-pipeline/tests/test_ae_control_pass.py
git commit -m "docs: add Xiaoyunque AE control handoff"
```

- [ ] **Step 7: Final verification report**

Report the clickable paths to the `.aep`, review MP4, clean MP4, comparison sheet, first/last frames, prompt, and `qc.json`. State any criterion that did not pass; do not call the control pass complete unless the mechanical checks and visual beat checks pass.
