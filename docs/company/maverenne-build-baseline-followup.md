# Maverenne build baseline follow-up

- Recorded: 2026-07-26 03:40:36 +08:00
- Scope: dependency-lock synchronization repair only. No application source, customer-visible branding, environment variables, or deployment was changed.
- Runtime: Node.js `v25.2.1`; npm `11.6.2`.

## Root cause and repair

The original `npm ci` correctly rejected the committed lockfile: the root `node_modules/@emnapi/wasi-threads` entry resolved `1.2.2`, but the resolved dependency tree required exact version `1.2.3`.

`npm install --package-lock-only --ignore-scripts --no-audit --no-fund` regenerated only the lock metadata. The reviewed change updates the root package to `@emnapi/wasi-threads@1.2.3` and adds the bundled metadata for `@tailwindcss/oxide-wasm32-wasi`; `package.json` is unchanged. No business dependency version was changed.

## Commands and results

| Command | Exit code | Result |
| --- | ---: | --- |
| `npm ci` | 1 | Expected reproduction: `EUSAGE`, lockfile's `@emnapi/wasi-threads@1.2.2` does not satisfy `1.2.3`. |
| `npm install --package-lock-only --ignore-scripts --no-audit --no-fund` | 0 | Repaired only `package-lock.json`. |
| `npm ci --no-audit --no-fund` (main worktree) | 124 | Execution timed out after 124 seconds while lifecycle scripts were running; no npm diagnostic was emitted. |
| `npm ci --no-audit --no-fund --foreground-scripts` (main worktree) | 1 | Cleanup of the timed-out installation hit Windows `EBUSY` on generated `node_modules/@prisma/client`. |
| `npm ci --no-audit --no-fund --foreground-scripts` (fresh isolated worktree using the repaired lockfile) | 124 | Timed out after 604 seconds without output, during lifecycle-script processing. This isolates the issue from the main-worktree EBUSY residue. |
| `npm ci --ignore-scripts --no-audit --no-fund` (second fresh isolated worktree using the repaired lockfile) | 0 | Added 521 packages in 27 seconds, proving the repaired lockfile passes npm's clean-install lock validation when lifecycle scripts are not run. |
| `npx prisma generate` (same clean isolated worktree) | 124 | Timed out after 184 seconds with no output. This is the active validation blocker. |
| `node -e "require.resolve('@prisma/client'); console.log('prisma-client-resolved')"` | not run | Stopped at failed Prisma-generation gate. |
| `npm run test:unit` | not run | Stopped at failed Prisma-generation gate; tests run: 0. |
| `npm run lint` | not run | Stopped at failed Prisma-generation gate. |
| `npm run build` | not run | Stopped at failed Prisma-generation gate. |

## Warnings and limitations

- The only package-install warning from the successful no-scripts clean install was: `npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead`.
- The `EBUSY` failure is an environment residue from the first command timeout, not a recurrence of the dependency-lock mismatch. A generated `node_modules` cleanup was attempted but blocked by the execution policy, so it was not performed.
- The full install and Prisma generation both hang without output in this Node/npm environment. Because Prisma generation did not complete, client resolution, SEO/brand-related unit tests, lint, and build were deliberately not run and are not claimed as passing.
- Next.js `16.2.6` documentation under `node_modules/next/dist/docs` was read in the isolated installation before validation; no application code was changed.

## Required next action

Diagnose why Prisma lifecycle/generation hangs in this environment (including the supported Node version and Prisma engine download/connectivity), then rerun the blocked commands in the order listed above. The lock synchronization repair itself is ready for review.
