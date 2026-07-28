# Phase 2 lint baseline investigation — 2026-07-28

**Status:** Investigation only. No application source, ESLint rule, or browser-support setting was changed by this investigation.

## Commands and reproducibility

| Worktree | HEAD | Command | Result |
| --- | --- | --- | --- |
| `maverenne-phase-1` | `cc4f6746913041c52000732aff0b4e69c9d60218` | `node_modules/.bin/eslint.cmd . --format json` | 0 errors, 38 warnings |
| `maverenne-phase-2-how-to-wear` | `f02c3b0bea1312875e889a03cc3e028edd9a9d0b` | `node_modules/.bin/eslint.cmd . --format json` | 14 errors, 38 warnings |

The Phase 2 dependency tree was created with `pnpm install --frozen-lockfile --offline`; it reused the lockfile cache and did not download packages. Its explicit `prisma generate` passed. No production credential or database was used.

Both trees report Node-compatible ESLint `9.39.4`, Next and `eslint-config-next` `16.2.6`, TypeScript `5.9.3`, React `19.2.4`, and `eslint-plugin-react-hooks` `7.1.1`. The committed `eslint.config.mjs` and `package.json` hashes match, as do the actual React Hooks rule implementation files and the TypeScript parser/Babel dependency files inspected.

## Error inventory in the reproducible Phase 2 tree

| Rule | File and line | Count |
| --- | --- | ---: |
| `react-hooks/set-state-in-effect` | `src/app/account/page.tsx:40`; `src/app/admin/social-tasks/page.tsx:92`; `src/app/checkout/page.tsx:155,734`; `src/components/admin/OperationsHub.tsx:107`; `src/components/admin/PinterestDraftQueue.tsx:124`; `src/components/layout/Header.tsx:59,95`; `src/components/layout/SearchOverlay.tsx:58`; `src/components/ui/RecentlyViewed.tsx:18` | 10 |
| `react-hooks/refs` | `src/app/checkout/page.tsx:724,725`; `src/lib/client/use-dialog-focus.ts:28` | 3 |
| `react-hooks/immutability` | `src/app/admin/blog/[id]/page.tsx:54` | 1 |

## Root-cause evidence and hypothesis

The error behavior follows the current worktree/config resolution, not the ESLint CLI binary: swapping the two CLI shims while keeping the current directory fixed preserves the current directory's result. The same `account/page.tsx` bytes produce 0 errors in the old Phase 1 worktree and 1 error in the lockfile-installed Phase 2 worktree; `--no-ignore` gives the same split. The rule configuration is enabled as error in both trees.

This proves the prior “0 errors” result is not a valid interchangeable baseline for the frozen Phase 2 dependency environment. The remaining unexplained variable is the old npm-style worktree's path-sensitive module/config resolution; it is not a safe basis for changing rules or suppressing diagnostics. The frozen Phase 2 pnpm tree is the authoritative reproducible baseline.

## Pattern analysis and safe boundary

The compiler diagnostics describe source-level patterns, not generated files or scan-scope mistakes: synchronous state changes inside effects, ref mutation during render, and a closure accessing `fillPost` before its declaration. Existing code has safe callback-ref/event-handler writes, but no single repository pattern can mechanically replace the ten effect diagnostics without changing each component's loading, persistence, or request lifecycle.

No fix was made because the instruction requires a single confirmed root-cause hypothesis before TDD, and the specific old-tree resolver behavior has not been reduced beyond the demonstrated path-sensitive false-negative. Do not respond by disabling rules, adding bulk `eslint-disable`, reducing the lint preset, or making an undifferentiated 14-file rewrite.

## Separate build boundary

The isolated PostgreSQL fixture is still required for full Next `generate`/`generate-env`/prerender verification. It remains separate from lint and no production database was contacted.

## Batch A remediation

`src/app/admin/blog/[id]/page.tsx` now declares the unchanged `fillPost` function before the loading effect captures it. This preserves the request and state-update behavior while removing the compiler's declaration-order ambiguity. `tests/react-compiler-lint-contract.test.ts` first failed on the old order and then passed after the move. Target lint reported 0 errors and TypeScript passed; frozen-tree full-lint errors fell from 14 to 13.
