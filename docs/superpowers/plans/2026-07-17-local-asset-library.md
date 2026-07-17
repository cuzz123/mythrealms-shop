# MythRealms Local Asset Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a non-destructive local ingestion workflow for storyboard videos, Jianying projects, and final edits, and expose the imported assets in the existing MythRealms asset browser.

**Architecture:** Keep `video-pipeline/asset-library` as the canonical store. A Python standard-library ingestion module creates deterministic asset directories, hashes source content, generates video proxies through FFmpeg, writes local/global manifests, and creates Obsidian cards. The existing Next.js browser is extended with three directory-backed asset kinds.

**Tech Stack:** Python 3.13 standard library, FFmpeg/ffprobe, PowerShell, Node.js test runner, Next.js 16.2.10, React 19, TypeScript.

## Global Constraints

- Never move, delete, overwrite, or rewrite a source file or source directory.
- Copy first, verify SHA-256, and only then publish the asset manifest entry.
- Do not add a new runtime dependency for ingestion.
- Keep existing asset category directories and existing user changes intact.
- Obsidian stores cards and links, not the only copy of binary media.
- This phase is local-only; do not configure cloud credentials or remote storage.

---

### Task 1: Local asset importer

**Files:**
- Create: `video-pipeline/tests/test_local_asset_library.py`
- Create: `video-pipeline/src/local_asset_library.py`
- Create: `video-pipeline/scripts/14-import-local-asset.ps1`

**Interfaces:**
- Produces: `ensure_library_layout(root: Path) -> None`
- Produces: `ingest_asset(source: Path, asset_type: str, title: str, root: Path, vault: Path, asset_id: str | None = None, generate_preview: bool = True) -> dict[str, Any]`
- Produces CLI subcommands `init` and `ingest`.

- [ ] **Step 1: Write failing layout and file-ingest tests**

Create tests that expect the new directories, source preservation, verified copied file, metadata, global manifest, and Obsidian card.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `python -m unittest video-pipeline.tests.test_local_asset_library -v`

Expected: import failure because `src.local_asset_library` does not exist.

- [ ] **Step 3: Implement the minimal layout and file-ingest behavior**

Implement deterministic IDs, chunked SHA-256 hashing, temporary-copy-then-rename, JSON manifest writing, and Obsidian card creation.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `python -m unittest video-pipeline.tests.test_local_asset_library -v`

Expected: all current focused tests pass.

- [ ] **Step 5: Add a failing duplicate-content test**

The test imports the same bytes from two different file names and expects one canonical asset directory and one manifest entry.

- [ ] **Step 6: Run the duplicate test and verify RED**

Run: `python -m unittest video-pipeline.tests.test_local_asset_library.LocalAssetLibraryTests.test_duplicate_content_reuses_existing_asset -v`

Expected: duplicate asset is created before deduplication is implemented.

- [ ] **Step 7: Implement manifest-based deduplication**

Lookup the source checksum before allocating a new asset directory and return the existing metadata when it matches.

- [ ] **Step 8: Run the focused test and verify GREEN**

Run: `python -m unittest video-pipeline.tests.test_local_asset_library -v`

Expected: all importer tests pass.

- [ ] **Step 9: Add a failing Jianying snapshot test**

The test imports a temporary directory and expects a ZIP under `project/`, unchanged source files, and a directory-tree checksum recorded in metadata.

- [ ] **Step 10: Run the snapshot test and verify RED**

Run: `python -m unittest video-pipeline.tests.test_local_asset_library.LocalAssetLibraryTests.test_jianying_project_is_snapshotted_without_source_mutation -v`

Expected: directory ingestion is rejected before snapshot support is implemented.

- [ ] **Step 11: Implement deterministic directory snapshots**

Create a stable ZIP from sorted relative paths, exclude transient cache files, compute a directory-tree checksum, and copy the completed snapshot into the formal asset directory.

- [ ] **Step 12: Run importer tests and verify GREEN**

Run: `python -m unittest video-pipeline.tests.test_local_asset_library -v`

Expected: all importer tests pass.

- [ ] **Step 13: Add video preview integration test and implementation**

Generate a one-second color MP4 with FFmpeg, ingest it, and assert that `Thumbnail.jpg` and `Preview.mp4` are non-empty and readable by ffprobe. Implement the FFmpeg commands only after watching the test fail.

- [ ] **Step 14: Add the PowerShell wrapper**

Expose `-Init`, `-Source`, `-Type`, `-Title`, `-AssetId`, `-NoPreview`, `-LibraryRoot`, and `-ObsidianVault`, forwarding to the Python module without changing source files.

### Task 2: Asset browser categories

**Files:**
- Create: `D:/react-flow/tests/asset-library-local-media.test.ts`
- Modify: `D:/react-flow/src/lib/asset-library/server.ts`
- Modify: `D:/react-flow/src/lib/asset-library/state.ts`
- Modify: `D:/react-flow/src/lib/asset-library/filter.ts`
- Modify: `D:/react-flow/src/components/studio/AssetLibraryStudio.tsx`

**Interfaces:**
- Extends `AssetKind` with `storyboardVideo`, `editProject`, and `finalVideo`.
- Scans `10-storyboard-videos`, `11-edit-projects`, and `12-final-deliverables`.

- [ ] **Step 1: Read the installed Next.js route-handler documentation**

Read: `D:/react-flow/node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`.

- [ ] **Step 2: Write a failing directory-scan test**

Create a temporary asset root with one asset under each new category, including `.jpg`, `.mp4`, and `metadata.json`, then expect three correctly typed records.

- [ ] **Step 3: Run the focused Node test and verify RED**

Run: `npm test -- tests/asset-library-local-media.test.ts`

Expected: new asset kinds and directories are not recognized.

- [ ] **Step 4: Implement the three server-side categories**

Extend the type union, category configuration, file discovery, tags, descriptions, and metadata title fallback. Include `Thumbnail.jpg`, `metadata.json`, and project ZIPs in discovery.

- [ ] **Step 5: Run the focused Node test and verify GREEN**

Run: `npm test -- tests/asset-library-local-media.test.ts`

Expected: the new scan test passes.

- [ ] **Step 6: Write failing state/filter tests for the new categories**

Extend existing tests to require URL parsing, selection, counts, and a `视频` filter across storyboard and final videos.

- [ ] **Step 7: Run state/filter tests and verify RED**

Run: `npm test -- tests/asset-library-state.test.ts tests/asset-library-filter.test.ts`

Expected: unsupported category or filter assertion fails.

- [ ] **Step 8: Implement client labels and filter behavior**

Add category order, Chinese labels, colors, descriptions, and the `视频` filter without changing existing preview modal behavior.

- [ ] **Step 9: Run all React Flow tests and verify GREEN**

Run: `npm test`

Expected: all tests pass.

### Task 3: Initialize and pilot-import existing local assets

**Files:**
- Create directories under `video-pipeline/asset-library/00-inbox`, `10-storyboard-videos`, `11-edit-projects`, `12-final-deliverables`, `90-proxies`, and `99-manifests`.
- Create: `video-pipeline/asset-library/99-manifests/local-assets.json`
- Modify: `video-pipeline/asset-library/README.md`
- Modify: `video-pipeline/README.md`

**Interfaces:**
- Uses the Task 1 CLI only; no ad-hoc copy commands.

- [ ] **Step 1: Initialize the canonical layout**

Run: `python -m src.local_asset_library init --root asset-library --vault asset-library/obsidian-vault` from `video-pipeline`.

Expected: only missing directories and an empty valid manifest are created.

- [ ] **Step 2: Inventory candidate Xiaoyunque, Jianying, and final files**

List candidate media with absolute path, size, modified time, and likely type. Do not import ambiguous files as a production category.

- [ ] **Step 3: Pilot-import one unambiguous local video**

Run the importer with an explicit type and title, then compare source and destination SHA-256 values.

- [ ] **Step 4: Document daily operation**

Add Chinese commands for initialization, storyboard video import, Jianying project snapshot, final export import, duplicate behavior, and recovery.

### Task 4: Full verification

**Files:**
- Verify all files modified in Tasks 1-3.

**Interfaces:**
- Consumes all previous task outputs.

- [ ] **Step 1: Run Python tests**

Run: `python -m unittest discover -s video-pipeline/tests -p "test_*.py" -v`

Expected: zero failures and zero errors.

- [ ] **Step 2: Run asset browser tests**

Run: `npm test` from `D:/react-flow`.

Expected: zero failures.

- [ ] **Step 3: Run asset browser lint**

Run: `npm run lint` from `D:/react-flow`.

Expected: zero lint errors.

- [ ] **Step 4: Run Next.js production build**

Run: `npm run build` from `D:/react-flow`.

Expected: exit code 0.

- [ ] **Step 5: Run manifest and media integrity checks**

Parse every generated JSON file, verify imported source checksums, and use ffprobe on generated preview MP4 files.

- [ ] **Step 6: Review the final diff and source preservation**

Confirm no pre-existing source file was deleted or modified, and report imported assets, skipped duplicates, and any ambiguous candidates left in the inbox.

