# Maverenne build baseline

- Recorded: 2026-07-26 03:00:05 +08:00
- Scope: Phase 1 Task 2 Step 1 technical baseline restoration and read-only validation.
- Source changes: none. Customer-visible branding, environment variables, and production were not changed.

## Preconditions

- Baseline commit: `82925d0`
- `package-lock.json` SHA-256 before `npm ci`: `8272B077034598B2D0BA8033BA8754DEF7CEE991C260589CB758E64F03C0A12F`
- `git status --short` was empty before and after the failed install. `npm ci` did not modify the lockfile, so no mechanical lockfile reversal was required.

## Command results

| Command | Exit code | Result |
| --- | ---: | --- |
| `npm ci` | 1 | Blocked before installing dependencies. |
| `npx prisma generate` | not run | Stopped by Task 2 Step 1 dependency-restoration gate. |
| `node -e "require.resolve('@prisma/client'); console.log('prisma-client-resolved')"` | not run | Stopped by Task 2 Step 1 dependency-restoration gate. |
| `npm run test:unit` | not run | Stopped; valid dependency tree and Prisma client are required first. Tests run: 0. |
| `npm run lint` | not run | Stopped; valid dependency tree and Prisma client are required first. |
| `npm run build` | not run | Stopped; valid dependency tree and Prisma client are required first. |

### `npm ci` output

```text
npm error code EUSAGE
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
npm error Invalid: lock file's @emnapi/wasi-threads@1.2.2 does not satisfy @emnapi/wasi-threads@1.2.3
```

NPM wrote its full diagnostic log to:

```text
C:\Users\11458\AppData\Local\npm-cache\_logs\2026-07-25T18_59_44_809Z-debug-0.log
```

## Warnings and errors

- Warnings: none reported.
- Errors: one dependency-lock synchronization error from `npm ci`.
- Test count: 0; no test command was authorized after the dependency gate failed.

## Root cause

The committed lockfile resolves the root `node_modules/@emnapi/wasi-threads` package to `1.2.2`, while the resolved dependency tree requires `1.2.3`. `npm ci` therefore correctly refuses to construct a clean dependency tree.

## Reproducible repair recommendation

In a separate, explicitly authorized dependency-maintenance change, use the repository's approved Node/npm version to regenerate only the lockfile from the current `package.json` (for example, run `npm install --package-lock-only`), review that the intended `@emnapi/wasi-threads` entry is updated to a version satisfying `1.2.3`, and commit that lockfile repair. Then rerun, in order:

```text
npm ci
npx prisma generate
node -e "require.resolve('@prisma/client'); console.log('prisma-client-resolved')"
npm run test:unit
npm run lint
npm run build
```

Do not use an unreviewed lockfile update or bypass `npm ci` with an existing `node_modules` directory.
