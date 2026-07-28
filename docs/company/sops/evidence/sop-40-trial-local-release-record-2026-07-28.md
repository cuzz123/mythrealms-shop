# SOP-40 trial: local release record - 2026-07-28

**Record type:** internal local-only tabletop trial; not a release approval or deployment record.
**SOP version/status:** `v0.2` / `draft`.
**Timezone:** Asia/Shanghai.

## Roles and approval boundary

| Field | Value |
| --- | --- |
| Executor | Technology & Automation |
| Independent reviewer | CEO / 总控（与技术与自动化 Owner 分离）；2026-07-28 独立治理复核 |
| Internal governance approval role | CEO / 总控；本次只审核 SOP 治理完整性，不授权 release action |
| Production approval | absent; no production action is authorized |

## Fixed local candidate

| Field | Value |
| --- | --- |
| Candidate SHA | `36a85c74e981723c7528c7a6fff1d4d317ba55b2` |
| Candidate subject | `docs: plan pearl care candidate tests` |
| Branch/worktree | `codex/maverenne-phase-2-how-to-wear` / `D:\mythrealms-shop\.worktrees\maverenne-phase-2-how-to-wear` |
| Current state | local candidate only |
| Merge / push / deploy / cutover | all `not_run` - no authorization |
| Production credentials/database | `not_run` - not read or used |
| Trial conclusion | local-only **NO-GO** |

## Fixed-SHA pre/post verification

| Phase | Exact command | Exit code | Output/result | Current status |
| --- | --- | ---: | --- | --- |
| Pre-SHA | `git rev-parse HEAD` | 0 | `36a85c74e981723c7528c7a6fff1d4d317ba55b2` | pass |
| Pre-clean | `git status --short` | 0 | no output | pass |
| Pre-whitespace | `git diff --check` | 0 | no output | pass |
| Post-SHA | `git rev-parse HEAD` | 0 | `36a85c74e981723c7528c7a6fff1d4d317ba55b2` | pass |
| Post-clean | `git status --short` | 0 | no output | pass |

No candidate source change was made during this trial. The evidence record itself is outside the isolated candidate worktree and does not change the candidate SHA.

## Current-candidate local gates

Every row below is scoped to the fixed candidate SHA. `not_run` means the command/action was not executed at that SHA; it is neither `failed` nor `blocked`.

| Gate | Exact command | Exit code | Current result | Current status |
| --- | --- | ---: | --- | --- |
| Target unit | `node --import tsx --test <approved-target-tests>` | not_run | not executed at candidate SHA | not_run |
| Full unit | `node --import tsx --test` | not_run | not executed at candidate SHA | not_run |
| Typecheck | `npx tsc --noEmit` | not_run | not executed at candidate SHA | not_run |
| Target lint | `node node_modules/eslint/bin/eslint.js <approved-targets>` | not_run | not executed at candidate SHA | not_run |
| Full lint | `node node_modules/eslint/bin/eslint.js .` | not_run | not executed at candidate SHA | not_run |
| Compile build | `next build --experimental-build-mode compile` | not_run | not executed at candidate SHA | not_run |
| Full generate/prerender build | `next build` with approved isolated fixture | not_run | not executed at candidate SHA | not_run |

## Historical context only - not current candidate results

| Historical SHA | Exact command/result | Historical outcome | Boundary |
| --- | --- | --- | --- |
| `05388ab0a1b1e2473855c58c54939843d4ea3597` | Full lint run before the current candidate: 8 errors, 38 warnings | `failed` at historical SHA | Does not make current candidate failed, blocked, or passed. |
| `05388ab0a1b1e2473855c58c54939843d4ea3597` | Target unit/typecheck/target lint and RecentlyViewed local e2e were run before the current candidate | historical pass context | Does not satisfy a current-candidate gate. |

## Isolated DB and build boundary

| Field | Value |
| --- | --- |
| Current fixture command | `not_run` |
| Current full build command | `not_run` |
| Isolated host/database | `not_run`; no instance or temporary database selected |
| Schema/fixture/cleanup | `not_run`; no fixture was created or removed |
| Production `DATABASE_URL` or data | not used |
| Future gate blocker | A confirmed isolated non-production PostgreSQL fixture is required before a full generate/prerender build may be run. This is a future gate condition, not the current command status. |

## External `BASE_URL` boundary

| Field | Value |
| --- | --- |
| Server launch command | `not_run` |
| Parent PID/command | `not_run` |
| Child PID(s)/command(s) | `not_run` |
| Port/BASE_URL listening proof | `not_run` |
| Exact Playwright command | `BASE_URL=http://127.0.0.1:<port> npx playwright test <approved-targets>` - `not_run` |
| Directed cleanup/port-closed proof | `not_run` |
| Historical managed-server e2e | historical context only; absent explicit parent/child PID and cleanup evidence, therefore not a current `BASE_URL` gate result |

## Authorization, smoke, and rollback

| Field | Value |
| --- | --- |
| Written production approval/variable presence check | `not_run` / absent |
| Production smoke, payment, email, fulfillment, external-account tests | `not_run` |
| Deployed revision | `not_available`; no deployment exists |
| Proposed local comparison reference | `98db5e1d4554def4e56f416c046b04591e8699d6` |
| Rollback command/action | `not_run`; no branch history or deployment was changed |
| DNS/canonical rollback | `not_run`; no cutover exists |

## Result-state audit

- `pass` appears only for completed fixed-SHA Git verification commands with exit code 0.
- `not_run` appears for current candidate gates not executed by this trial.
- Historical lint `failed` is retained only in historical context and is not a current candidate result.
- No current-candidate command is marked `blocked`; the DB fixture is a future prerequisite, not an executed command outcome.
- This trial remains local-only NO-GO until a future fixed candidate is independently reviewed and completes required gates.

## SOP gaps retained from the tabletop trial

1. A repository-standard external-server launch command/runbook is still needed to make parent/child PID evidence reproducible.
2. A repository-specific isolated PostgreSQL fixture eligibility checklist/runbook is still needed.
3. A production deployment record must name the actual immutable rollback target; a local Git SHA alone is not one.

No item in this record authorizes a workaround, a production action, permission expansion, or credential access.

## Independent reviewer record

**Reviewer:** CEO / 总控（existing internal governance reviewer; separate from Technology & Automation Owner）
**Review date:** 2026-07-28
**Decision:** `Pass / ready_candidate` for SOP-40 governance only; the fixed local candidate remains `local-only NO-GO`.

The reviewer confirmed:

1. Candidate SHA, pre/post SHA and current state all map to `36a85c74e981723c7528c7a6fff1d4d317ba55b2`; the pre/post Git commands and exit codes are explicitly recorded.
2. The seven current-candidate gates are all `not_run`. No current result is marked `failed` or `blocked`.
3. The historical 8-error / 38-warning lint result is isolated under historical SHA `05388ab0a1b1e2473855c58c54939843d4ea3597`; it does not classify the current candidate.
4. The isolated DB and external `BASE_URL` parent/child PID, port, command and cleanup fields are fillable and correctly remain `not_run`; their future prerequisites do not become current command results.
5. `ready_candidate` does not mean the release candidate passed, nor does it authorize merge, push, deploy, production credentials/database, DNS/canonical or rollback execution.

The source SOP and this evidence are not yet tracked by Git, so formal `ready` waits for unified version governance. Source Status remains `draft`.
