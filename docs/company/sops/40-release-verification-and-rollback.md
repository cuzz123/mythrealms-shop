# Release verification and rollback SOP

| Metadata | Current value |
| --- | --- |
| SOP ID | `SOP-40` |
| Owner | 技术与自动化 |
| Version | `v0.2` |
| Status | `ready` |
| Effective date | 待确认 |
| review_date | 2026-08-07 |
| Independent reviewer | CEO / 总控（与技术与自动化 Owner 分离；只复核治理字段与 local-only evidence，不获得执行权限）。 |
| `ready` approval basis | [2026-07-28 activation audit](sop-activation-audit-2026-07-28.md) and [SOP-40 v0.2 reviewer evidence](evidence/sop-40-trial-local-release-record-2026-07-28.md); internal governance review by CEO / 总控. |
| `active` criteria | 待确认；须由拥有既有发布权限的批准人另行确认版本、适用范围、固定 SHA、激活/生效日期与回滚目标。`ready` 不等于 `active`，不授权 merge、push、部署、生产凭据访问、DNS 或 canonical 变更。 |
| Predecessor / successor | 无 / 无 |
| Evidence boundary | 仅保存非敏感验证证据；不记录密钥、客户个人数据或支付标识。 |

## Purpose and scope

This SOP defines the evidence required to move a verified local candidate through merge, push, deployment, and (where applicable) domain or canonical cutover. Each is a separate state and requires its own authorization. Passing local checks is not authorization to release.

This SOP does not authorize production deployment, production credential access, DNS changes, canonical changes, or external-account actions.

## Release-state boundary

| State | Meaning | Required authorization | May proceed automatically? |
| --- | --- | --- | --- |
| Local candidate | A full, fixed commit has passed the applicable local gates. | Repository contributor approval for the local change. | Yes, only within the isolated worktree. |
| Merge | The candidate commit is integrated into the approved target branch. | Explicit merge approval naming the commit and target branch. | No. |
| Push | The approved branch is sent to its remote. | Explicit push approval. | No. |
| Deploy | A remote build is released to the specified environment. | Explicit deployment approval, environment, and commit. | No. |
| Domain/canonical cutover | DNS, public host, or canonical values are changed. | Separate explicit founder/owner approval after deployment readiness is known. | No. |

Record the current state and the person or written approval that permitted it. Never imply that a local commit was merged, pushed, deployed, or cut over.

## 1. Fix the candidate

1. Record the full candidate commit SHA with `git rev-parse HEAD`.
2. Confirm the candidate worktree is clean with `git status --short`; it must produce no output before release-gate testing.
3. Run `git diff --check` and resolve whitespace errors.
4. Run all commands against that fixed SHA. If files change during testing, stop, return to a clean worktree, create a new candidate commit, and restart the verification record.

### Fixed-SHA verification record

For every gate, record the candidate SHA, command, exit code, start/end time, and output reference together. A result may satisfy this SOP only when the candidate SHA reported immediately before the command equals the SHA in the release record and the worktree remains clean afterwards.

```text
Candidate SHA (full):
Branch and absolute worktree path:
Independent reviewer:
Pre-command git rev-parse HEAD:
Pre-command git status --short:
Pre-command git diff --check:
Gate name:
Exact command:
Start/end time and exit code:
Output reference:
Post-command git rev-parse HEAD:
Post-command git status --short:
Result state (pass | failed | blocked | not_run):
```

Earlier or different-SHA output is **historical context only**. It must be labelled as such and cannot turn a candidate gate into `pass`.

## 2. Local verification gates

Run the smallest relevant test set first, then the full gates required by the release scope. Record each exact command, exit code, runtime, and output location.

| Gate | Acceptance condition |
| --- | --- |
| Unit tests | Relevant tests pass, then the full unit suite passes when the release scope requires it. |
| Typecheck | The repository typecheck (for example `tsc --noEmit`) exits 0. |
| Lint | The repository's authoritative locked dependency tree reports 0 lint errors. Existing warnings must be counted and reviewed; do not silently substitute a different dependency tree. |
| Build | Run the documented Next.js compile/build command for the fixed SHA. A compile-only result does not prove generate/prerender. Record which mode ran. |
| Generated output | If the full build has generate/prerender work, it must be run with an isolated non-production database or remain an explicit release blocker. |

Do not bypass failures with broad disables, rule downgrades, skipped suites, or a cached `.next` directory. Use a clean build output when the build gate is being claimed.

### Result-state rules

| State | Meaning | Release-gate effect |
| --- | --- | --- |
| `pass` | The exact fixed-SHA command exited 0 and met the gate acceptance condition. | May support the relevant local gate only. |
| `failed` | The exact fixed-SHA command ran and returned a non-zero result or violated its acceptance condition. | Never waivable by this SOP; blocks the applicable candidate until a new fixed SHA is verified. |
| `blocked` | The command was not valid to run because a required approved dependency or environment boundary is absent (for example an isolated DB fixture). | Not a pass and not a failure; remains a release blocker until the boundary is met. |
| `not_run` | The command/action was deliberately not executed. | Not evidence of success, failure, or authorization. |

Record lint errors and warnings separately. Lint is `pass` only at zero errors in the authoritative locked dependency tree. A known remediation batch, warning count, historical result, or reviewer note cannot relabel a lint `failed` result as `pass`, `blocked`, or waived.

## 3. Isolated non-production database gate

Full generate/prerender may require database access. It must never use a production `DATABASE_URL`, production credentials, or production data.

1. Confirm that a local or otherwise isolated PostgreSQL instance already exists and is approved for test use. Do not install a database service as part of release verification.
2. Create a uniquely named, temporary database only after confirming its host is non-production. Record the database name and host classification, but never record connection credentials.
3. Point only the verification process at that temporary database; run the required Prisma generation/schema setup and fixture loading if documented.
4. Run the full build and a sitemap/prerender smoke check. Record commands and exit codes.
5. Drop only the exact temporary database created in step 2, and retain proof of the target name and cleanup result.

Record these fixture fields without credentials:

```text
Isolation approval/reference:
Host classification and evidence it is non-production:
Temporary database name (exact):
Schema/fixture command and exit code:
Fixture source/version and data-sensitivity boundary:
Build/sitemap/prerender command and exit code:
Cleanup command target (exact temporary database only):
Cleanup result and post-cleanup verification:
```

If there is no confirmed isolated PostgreSQL instance or fixture, do not substitute production data and do not claim a full build passed. Record `full generate/prerender blocked: isolated database unavailable` as a separate gate.

## 4. Playwright external `BASE_URL` gate

Use an externally started local server rather than Playwright's implicit web server when verifying process lifecycle or production-like behavior.

1. Start the local server hidden with a temporary local-only `AUTH_SECRET` and an explicit unused port.
2. Record the process PID, complete command line, port, start time, and expected base URL. Do not record the secret value.
3. Run target tests with `BASE_URL=http://127.0.0.1:<port>` and record the exact Playwright command and result.
4. Before cleanup, verify the PID and command line still identify the process started in step 1.
5. Stop only that verified PID. Do not use broad process termination. Record the stop result and verify the port is no longer listening.

Record the full parent/child process chain without secret values:

```text
Server launch command (secrets redacted):
Launcher/parent PID and command line:
Server child PID(s) and command line(s):
Port and BASE_URL:
Port-listening proof before tests:
Exact BASE_URL Playwright command and exit code:
PID/command-line verification immediately before cleanup:
Directed cleanup command and targeted PID(s):
Child-process cleanup result:
Port-closed proof after cleanup:
```

A Playwright runner timeout or Windows web-server teardown issue is not a passing result; preserve the test assertion output and distinguish a test failure from a cleanup failure.

## 5. Production authorization gate

Before any merge, push, deploy, or public cutover, obtain written approval that identifies the candidate SHA, target branch/environment, and intended action.

- A designated production operator must confirm required production variables are present and correctly scoped without exposing or copying their values into tickets, logs, or this repository.
- DNS and canonical changes need separate explicit authorization. A deployment approval alone does not authorize either one.
- Do not read production credentials or connect to production databases merely to make this confirmation.
- Confirm the rollback target (known-good deployed revision) before deployment begins.

## 6. Authorized deployment smoke test

Only after a deployment approval is recorded, run the least-invasive smoke tests appropriate to the release:

1. Verify the deployed revision matches the approved SHA or immutable build identifier.
2. Check the homepage and each changed public route returns the expected status and renders its essential server-readable content.
3. Check `robots.txt`, sitemap, canonical output, and Open Graph output when the release affects them, using the approved public host.
4. Exercise non-destructive flows only. Payment, fulfillment, or email end-to-end tests require their own sandbox/test-data authorization.
5. Record timestamp, environment, operator, endpoints/statuses, observed revision, and pass/fail result. Never record customer data, payment identifiers, or secrets.

## 7. Rollback procedure

1. Declare the rollback trigger: failed smoke test, material error rate, broken critical route, security issue, or an approved operational decision.
2. Identify the pre-approved known-good deployment/revision. Do not use `git reset --hard` or rewrite shared branch history as a release rollback.
3. Roll back the deployment to that immutable known-good revision using the authorized deployment mechanism.
4. Re-run the scoped smoke checks and record the restored revision and results.
5. If a DNS or canonical cutover occurred, roll it back only with the separate cutover authorization; deployment rollback does not itself authorize DNS changes.
6. Preserve the incident evidence and open a follow-up before attempting a new candidate.

Data migrations must have a separately reviewed rollback plan. Do not run destructive data reversal during an application rollback unless that plan and authority exist.

## 8. Evidence record template

Create one release record per candidate, retaining only non-sensitive operational evidence:

```text
Candidate SHA:
Worktree/branch:
Current state (local candidate | merged | pushed | deployed | cut over):
Independent reviewer and internal review date:
Activation criteria and approval basis/reference:
Fixed-SHA pre/post command evidence:
Gate results, each marked pass | failed | blocked | not_run:
Lint errors/warnings and no-waiver conclusion:
Isolated DB fixture/host classification, temporary DB, setup and cleanup evidence:
Playwright BASE_URL, parent/child PID/port/command verification, test result, cleanup proof:
Written approvals (reference only; no secret values):
Deployment environment and immutable revision:
Smoke endpoints/statuses and timestamp:
Rollback target and rollback result (if used):
Known blockers, historical context, deviations, and owner:
```

## 9. Stop conditions

Stop and escalate instead of continuing when any of the following is true:

- the worktree is not clean or the tested SHA changes;
- a required local gate fails;
- full generate/prerender needs an unconfirmed database;
- an action needs production credentials, deployment, merge, push, DNS, or canonical permission that is absent;
- smoke tests reveal a customer-facing regression; or
- a rollback target is unknown.
