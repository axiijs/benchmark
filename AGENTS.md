# AGENTS.md

## Cursor Cloud specific instructions

This repo (`axii-benchmark`) is the **runnable web app**: `npm run dev` starts Vite at http://localhost:3000. The root `index.html` is the main UI (framework cards + scenario picker + "Run Selected"/"Run All"); its in-browser numbers are simulated for a quick demo. The heavier scripts under `scripts/` (`npm run benchmark`, `npm run benchmark:real`, `npm run heap:snapshot`) drive real Playwright-based measurements.

Dependency on the sibling `axii` repo (see `vite.config.ts`):
- By default the Vite alias resolves `axii` to `../axii/dist/axii.js`, so **`../axii` must be built** (`cd ../axii && npm run build`) before the dev server will load. The update script builds it automatically.
- `AXII_BENCHMARK_SOURCE_AXII=true` makes it consume `../axii/src/index.ts` (and `../data0/src`) directly instead of the built dist.
- `AXII_BENCHMARK_LOCAL_DATA0=true` uses a sibling `../data0` checkout for `data0` (none is present here by default).

Gotchas:
- `npm test` runs Vitest but there are **no test files**, so it exits with "No test files found" — this is expected, not a failure.
- There is no lint script. `npx tsc --noEmit` reports **pre-existing** React/axii JSX interop errors in `src/frameworks/react/`; it is not part of any npm script or CI.
- The `benchmark:real` / `heap:snapshot` scripts launch headless Chromium via Playwright, which needs the chromium browser + system libraries (browser installed by the update script; OS libs are in the base image).
