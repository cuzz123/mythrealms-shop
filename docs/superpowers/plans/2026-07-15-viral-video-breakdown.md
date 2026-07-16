# Viral Video Breakdown Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Add a local CLI that turns a reference MP4 into a one-take-aware beat timeline, editable semantic breakdown, asset-readiness audit, and Obsidian report.

**Architecture:** A new Python module composes existing FFmpeg helpers from analyze_reference.py without altering recipe.json. Pure functions construct beat boundaries, semantic records, and asset audits; the command layer writes frames and reports beneath the existing job directory. A small PowerShell wrapper exposes the command using the project’s established scripts convention.

**Tech Stack:** Python 3.13 standard library, existing Pillow and FFmpeg dependency, PowerShell, Python unittest.

## Global Constraints

- Never modify or move the source video.
- Never overwrite existing recipe.json or automated-remix outputs.
- Treat a one-take camera beat separately from a hard edit cut.
- No cloud, vision, or paid API calls in this first version.
- Do not write selected gaps into asset-library/registry/assets.json; review must remain explicit.

---

### Task 1: Beat-boundary model

**Files:**

- Create: video-pipeline/tests/test_breakdown_reference.py
- Create: video-pipeline/src/breakdown_reference.py

**Interfaces:**

- Produces build_beat_boundaries(duration: float, cut_boundaries: list[float], beat_interval: float, min_interval: float = 0.12) -> list[float].
- Produces build_beat_intervals(boundaries: list[float]) -> list[dict].

- [ ] Step 1: Write the failing test

    def test_build_beat_boundaries_adds_regular_intervals_to_a_continuous_take():
        boundaries = build_beat_boundaries(
            duration=2.4,
            cut_boundaries=[0.0, 2.4],
            beat_interval=0.8,
        )
        self.assertEqual(boundaries, [0.0, 0.8, 1.6, 2.4])

- [ ] Step 2: Run test to verify it fails

Run: python -m unittest tests.test_breakdown_reference.BeatTimelineTests.test_build_beat_boundaries_adds_regular_intervals_to_a_continuous_take -v

Expected: ImportError because breakdown_reference does not exist.

- [ ] Step 3: Write minimal implementation

    def build_beat_boundaries(duration, cut_boundaries, beat_interval, min_interval=0.12):
        candidates = [0.0, duration, *cut_boundaries]
        tick = beat_interval
        while tick < duration:
            candidates.append(tick)
            tick += beat_interval
        ordered = sorted({round(value, 3) for value in candidates if 0 <= value <= duration})
        return [value for index, value in enumerate(ordered) if index == 0 or value - ordered[index - 1] >= min_interval]

- [ ] Step 4: Run test to verify it passes

Run: python -m unittest tests.test_breakdown_reference.BeatTimelineTests.test_build_beat_boundaries_adds_regular_intervals_to_a_continuous_take -v

Expected: OK.

- [ ] Step 5: Add the cut-retention test

    def test_build_beat_boundaries_preserves_an_edit_cut():
        boundaries = build_beat_boundaries(
            duration=2.4,
            cut_boundaries=[0.0, 1.1, 2.4],
            beat_interval=0.8,
        )
        self.assertIn(1.1, boundaries)
        self.assertEqual(boundaries[0], 0.0)
        self.assertEqual(boundaries[-1], 2.4)

- [ ] Step 6: Run the two timeline tests

Run: python -m unittest tests.test_breakdown_reference.BeatTimelineTests -v

Expected: both tests pass.

### Task 2: Editable semantic breakdown schema

**Files:**

- Modify: video-pipeline/tests/test_breakdown_reference.py
- Modify: video-pipeline/src/breakdown_reference.py

**Interfaces:**

- Produces build_breakdown_records(boundaries: list[float], keyframe_paths: list[Path]) -> list[dict].
- Every record includes editing, camera, blocking, lighting, viral_hook, assets, and review.

- [ ] Step 1: Write the failing test

    def test_breakdown_record_has_editable_semantic_shell():
        records = build_breakdown_records(
            [0.0, 0.8],
            [Path("keyframes/beat_001.jpg")],
        )
        record = records[0]
        self.assertEqual(record["editing"]["type"], "continuous")
        self.assertEqual(record["camera"]["movement"], "unknown")
        self.assertEqual(record["blocking"]["anchor_object"], "unknown")
        self.assertEqual(record["lighting"]["key_direction"], "unknown")
        self.assertEqual(record["viral_hook"]["visual_hook"], "unknown")
        self.assertEqual(record["review"]["similarity_score"], None)

- [ ] Step 2: Run test to verify it fails

Run: python -m unittest tests.test_breakdown_reference.SemanticRecordTests.test_breakdown_record_has_editable_semantic_shell -v

Expected: AttributeError because build_breakdown_records does not exist.

- [ ] Step 3: Write minimal implementation

    def build_breakdown_records(boundaries, keyframe_paths):
        records = []
        for index, (start, end) in enumerate(zip(boundaries, boundaries[1:]), start=1):
            records.append({
                "id": f"beat_{index:03d}",
                "start": start,
                "end": end,
                "duration": round(end - start, 3),
                "keyframe": str(keyframe_paths[index - 1]),
                "editing": {"type": "continuous"},
                "camera": {"scale": "unknown", "movement": "unknown", "direction": "unknown", "lens_feel": "unknown", "focus_behavior": "unknown"},
                "blocking": {"roles": [], "subject_direction": "unknown", "subject_position": "unknown", "product_position": "unknown", "anchor_object": "unknown", "relative_position_notes": ""},
                "lighting": {"key_direction": "unknown", "quality": "unknown", "color_temperature": "unknown", "contrast": "unknown", "practicals": []},
                "viral_hook": {"visual_hook": "unknown", "information_change": "unknown", "product_visibility": "unknown", "transition_mechanism": "unknown", "audio_cue": "unknown"},
                "assets": {"selected_ids": [], "required_capabilities": []},
                "review": {"similarity_score": None, "notes": ""},
            })
        return records

- [ ] Step 4: Run semantic tests

Run: python -m unittest tests.test_breakdown_reference.SemanticRecordTests -v

Expected: OK.

### Task 3: Asset readiness audit and review-only gap proposals

**Files:**

- Modify: video-pipeline/tests/test_breakdown_reference.py
- Modify: video-pipeline/src/breakdown_reference.py

**Interfaces:**

- Produces audit_asset_capabilities(registry: dict, records: list[dict]) -> dict.
- Uses assets.required_capabilities only after a reviewer fills them.

- [ ] Step 1: Write the failing test

    def test_asset_audit_marks_approved_as_ready_and_planned_as_not_ready():
        registry = {"assets": [
            {"id": "CAM_READY", "category": "camera_rig", "status": "approved", "tags": ["orbit"]},
            {"id": "CAM_PLANNED", "category": "camera_rig", "status": "planned", "tags": ["orbit"]},
        ]}
        records = [{"assets": {"required_capabilities": ["orbit"]}}]
        audit = audit_asset_capabilities(registry, records)
        self.assertEqual(audit["requirements"][0]["ready_candidates"], ["CAM_READY"])
        self.assertEqual(audit["requirements"][0]["non_ready_candidates"], ["CAM_PLANNED"])
        self.assertEqual(audit["gaps"], [])

- [ ] Step 2: Run test to verify it fails

Run: python -m unittest tests.test_breakdown_reference.AssetAuditTests.test_asset_audit_marks_approved_as_ready_and_planned_as_not_ready -v

Expected: AttributeError because audit_asset_capabilities does not exist.

- [ ] Step 3: Write minimal implementation

    READY_STATUSES = {"approved", "available_static", "available_360_background"}

    def audit_asset_capabilities(registry, records):
        requirements = sorted({cap for record in records for cap in record["assets"]["required_capabilities"]})
        result = {"requirements": [], "gaps": []}
        for capability in requirements:
            candidates = [asset for asset in registry["assets"] if capability in asset.get("tags", [])]
            ready = [asset["id"] for asset in candidates if asset.get("status") in READY_STATUSES]
            non_ready = [asset["id"] for asset in candidates if asset.get("status") not in READY_STATUSES]
            item = {"capability": capability, "ready_candidates": ready, "non_ready_candidates": non_ready}
            result["requirements"].append(item)
            if not candidates:
                result["gaps"].append({"capability": capability, "status": "proposed"})
        return result

- [ ] Step 4: Run asset audit tests

Run: python -m unittest tests.test_breakdown_reference.AssetAuditTests -v

Expected: OK.

### Task 4: CLI output and Obsidian review report

**Files:**

- Modify: video-pipeline/tests/test_breakdown_reference.py
- Modify: video-pipeline/src/breakdown_reference.py
- Create: video-pipeline/scripts/05-breakdown-viral-video.ps1
- Modify: video-pipeline/README.md

**Interfaces:**

- main() accepts --reference, --job-name, --job-dir, --beat-interval, and --registry.
- Produces breakdown/beat_timeline.json, breakdown/breakdown.json, breakdown/asset-gaps.json, breakdown/keyframes/, and breakdown/obsidian-report.md.

- [ ] Step 1: Write the failing integration test

    def test_write_breakdown_artifacts_creates_report_and_keyframes(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            job_dir = Path(temp_dir) / "job"
            result = write_breakdown_artifacts(
                job_dir=job_dir,
                duration=1.6,
                cut_boundaries=[0.0, 1.6],
                beat_interval=0.8,
                keyframe_writer=lambda _, path: path.write_bytes(b"frame"),
                registry={"assets": []},
            )
            self.assertTrue((job_dir / "breakdown" / "breakdown.json").exists())
            self.assertTrue((job_dir / "breakdown" / "asset-gaps.json").exists())
            self.assertTrue((job_dir / "breakdown" / "obsidian-report.md").exists())
            self.assertEqual(len(result["records"]), 2)

- [ ] Step 2: Run test to verify it fails

Run: python -m unittest tests.test_breakdown_reference.BreakdownArtifactTests.test_write_breakdown_artifacts_creates_report_and_keyframes -v

Expected: AttributeError because write_breakdown_artifacts does not exist.

- [ ] Step 3: Write minimal implementation

    def write_breakdown_artifacts(job_dir, duration, cut_boundaries, beat_interval, keyframe_writer, registry):
        output_dir = job_dir / "breakdown"
        keyframe_dir = output_dir / "keyframes"
        keyframe_dir.mkdir(parents=True, exist_ok=True)
        boundaries = build_beat_boundaries(duration, cut_boundaries, beat_interval)
        keyframes = []
        for index, at_time in enumerate(boundaries[:-1], start=1):
            frame_path = keyframe_dir / f"beat_{index:03d}.jpg"
            keyframe_writer(at_time, frame_path)
            keyframes.append(frame_path)
        records = build_breakdown_records(boundaries, keyframes)
        audit = audit_asset_capabilities(registry, records)
        write_json(output_dir / "beat_timeline.json", {"boundaries": boundaries})
        write_json(output_dir / "breakdown.json", {"schema": "mythrealms.viral-breakdown.v1", "beats": records})
        write_json(output_dir / "asset-gaps.json", audit)
        report = output_dir / "obsidian-report.md"
        report.write_text(render_obsidian_report(records), encoding="utf-8")
        return {"records": records, "output_dir": output_dir}

- [ ] Step 4: Run artifact tests

Run: python -m unittest tests.test_breakdown_reference.BreakdownArtifactTests -v

Expected: OK.

- [ ] Step 5: Write the CLI and wrapper

Use ffprobe_duration, ffprobe_stream, detect_scenes, and extract_keyframe from analyze_reference.py. Read the default asset registry from asset-library/registry/assets.json. The PowerShell wrapper must pass only the documented CLI arguments and exit with the Python exit code.

    param(
        [Parameter(Mandatory = $true)][string]$Reference,
        [string]$JobName = "",
        [string]$JobDir = "",
        [double]$BeatInterval = 0.8,
        [string]$Registry = ""
    )
    $Root = Split-Path $PSScriptRoot -Parent
    $argsList = @("$Root\src\breakdown_reference.py", "--reference", $Reference, "--beat-interval", "$BeatInterval")
    if ($JobName -ne "") { $argsList += @("--job-name", $JobName) }
    if ($JobDir -ne "") { $argsList += @("--job-dir", $JobDir) }
    if ($Registry -ne "") { $argsList += @("--registry", $Registry) }
    python @argsList
    exit $LASTEXITCODE

- [ ] Step 6: Update README

Add a Viral Video Breakdown section with the wrapper command, output paths, and the instruction to fill unknown semantic fields before accepting asset gaps.

- [ ] Step 7: Run full tests

Run: python -m unittest discover -s tests -p "test_breakdown_reference.py" -v

Expected: all tests pass.

### Task 5: Final verification

**Files:**

- Verify only: video-pipeline/src/breakdown_reference.py
- Verify only: video-pipeline/tests/test_breakdown_reference.py
- Verify only: video-pipeline/scripts/05-breakdown-viral-video.ps1

- [ ] Step 1: Compile the command

Run: python -m py_compile src/breakdown_reference.py

Expected: exit code 0.

- [ ] Step 2: Run a synthetic local MP4 through the CLI

Create a 1.6 second color source with FFmpeg under video-pipeline/temp/, run the new PowerShell wrapper with a temporary job name, then assert the five required breakdown artifacts exist.

- [ ] Step 3: Inspect the report

Confirm the report contains a beat table, a linked JSON path, linked keyframes, and a reminder that visual fields are initial unknown values requiring review.
