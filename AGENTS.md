# AGENTS.md

## Cursor Cloud specific instructions

This repo (`axii-benchmark`) is the **runnable web app**: `npm run dev` starts Vite at http://localhost:3000. The root `index.html` is the main UI (framework cards + scenario picker + "Run Selected"/"Run All"); its in-browser numbers are simulated for a quick demo. The heavier scripts under `scripts/` (`npm run benchmark`, `npm run benchmark:real`, `npm run benchmark:memory`, `npm run heap:snapshot`) drive real Playwright-based measurements. `benchmark:real` and `benchmark:memory` write static reports with stable filenames to `reports/` (committed to git, linked from the README) in addition to timestamped raw copies in `results/` (gitignored); commit the updated `reports/` files (and root `benchmark-results.md`) after re-running benchmarks.

Dependency on the sibling `axii` repo (see `vite.config.ts`):
- By default the Vite alias resolves `axii` to `../axii/dist/axii.js`, so **`../axii` must be built** (`cd ../axii && npm run build`) before the dev server will load. This build is **not** part of the update script (which only installs dependencies), so run it manually once after a fresh environment, or after changing `../axii/src`. Alternatively, run the dev server with `AXII_BENCHMARK_SOURCE_AXII=true` to consume `../axii/src` directly and skip the build.
- `AXII_BENCHMARK_SOURCE_AXII=true` makes it consume `../axii/src/index.ts` (and `../data0/src`) directly instead of the built dist.
- `AXII_BENCHMARK_LOCAL_DATA0=true` uses a sibling `../data0` checkout for `data0` (none is present here by default).

Gotchas:
- `npm test` runs Vitest but there are **no test files**, so it exits with "No test files found" — this is expected, not a failure.
- There is no lint script. `npx tsc --noEmit` reports **pre-existing** React/axii JSX interop errors in `src/frameworks/react/`; it is not part of any npm script or CI.
- The `benchmark:real` / `heap:snapshot` scripts launch headless Chromium via Playwright, which needs the chromium browser + system libraries (browser installed by the update script; OS libs are in the base image).
