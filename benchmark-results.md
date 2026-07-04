# Real Browser Framework Benchmark Results

Generated: 2026-05-20T09:18:13.132Z

These numbers were collected by Playwright in Chromium from actual DOM-rendering implementations of Axii, React, Vue, and Solid. No mocked framework timings are used.

Settings: 8 measured iterations, 2 warmup iterations, base list size 1000.

## Mean Duration

| Test | Axii | React | Vue | Solid | Winner |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.862ms | 0.238ms | 0.225ms | 0.113ms | solid |
| create-1000 | 5.250ms | 1.388ms | 0.912ms | 0.500ms | solid |
| create-5000 | 24.667ms | 23.700ms | 3.733ms | 2.300ms | solid |
| append-100 | 0.613ms | 0.250ms | 0.638ms | 0.650ms | react |
| update-100 | 0.200ms | 0.138ms | 0.663ms | 0.612ms | react |
| remove-100 | 0.125ms | 0.287ms | 0.588ms | 0.550ms | axii |
| clear-1000 | 0.525ms | 0.450ms | 0.363ms | 0.237ms | solid |
| sort-1000 | 0.988ms | 1.400ms | 1.113ms | 0.825ms | solid |
| swap-2 | 0.050ms | 0.837ms | 0.550ms | 0.713ms | axii |
| reposition-1 | 0.212ms | 0.250ms | 0.563ms | 0.663ms | axii |
| reposition-100 | 0.275ms | 0.263ms | 0.625ms | 0.650ms | react |
| move-head-to-tail | 0.200ms | 0.200ms | 0.613ms | 0.662ms | axii |
| move-tail-to-head | 0.288ms | 1.263ms | 0.612ms | 0.700ms | axii |
| move-100-forward | 0.225ms | 0.238ms | 0.650ms | 0.637ms | axii |
| move-100-backward | 0.262ms | 0.650ms | 0.600ms | 0.687ms | axii |
| axii-data-only-create-1000 | 0.238ms | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 3.925ms | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 3.675ms | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 5.175ms | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 5.275ms | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 209.300ms | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 7.467ms | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 149.667ms | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 155.833ms | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 260.433ms | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 206.700ms | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 212.133ms | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 435.633ms | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 603.733ms | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | 56.167ms | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | 22.100ms | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 5.500ms | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 5.113ms | N/A | N/A | N/A | axii |

## Mean JS Heap Delta

Measured with Chromium `performance.memory.usedJSHeapSize` after forced GC before and after each measured iteration.

| Test | Axii | React | Vue | Solid | Lowest Heap Growth |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.066MB | 0.048MB | -0.045MB | 0.012MB | vue |
| create-1000 | 0.501MB | 0.166MB | 0.514MB | 0.105MB | solid |
| create-5000 | 2.643MB | 0.838MB | 2.563MB | 0.521MB | solid |
| append-100 | 0.046MB | -0.025MB | 0.054MB | -0.013MB | react |
| update-100 | -0.009MB | -0.038MB | -0.002MB | -0.025MB | react |
| remove-100 | -0.043MB | -0.052MB | -0.049MB | -0.035MB | react |
| clear-1000 | -0.489MB | -0.165MB | -0.512MB | -0.104MB | vue |
| sort-1000 | -0.013MB | -0.043MB | 0.000MB | -0.024MB | react |
| swap-2 | -0.002MB | -0.045MB | -0.000MB | -0.025MB | react |
| reposition-1 | -0.004MB | -0.046MB | 0.001MB | -0.027MB | react |
| reposition-100 | -0.005MB | -0.046MB | 0.000MB | -0.027MB | react |
| move-head-to-tail | -0.000MB | -0.046MB | 0.000MB | -0.025MB | react |
| move-tail-to-head | -0.001MB | -0.045MB | 0.000MB | -0.025MB | react |
| move-100-forward | -0.000MB | -0.046MB | 0.000MB | -0.026MB | react |
| move-100-backward | 0.001MB | -0.046MB | 0.000MB | -0.025MB | react |
| axii-data-only-create-1000 | 0.086MB | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 0.226MB | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 0.233MB | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 0.519MB | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 0.511MB | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | -0.028MB | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 0.002MB | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 0.010MB | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 0.002MB | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 0.002MB | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 0.002MB | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | -0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 0.003MB | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | 0.001MB | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | 0.012MB | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 0.005MB | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 0.483MB | N/A | N/A | N/A | axii |

## Axii Retained Object Diagnostics

Counts are collected by the opt-in Axii/data0 retained object diagnostics API after forced GC. Full per-type created/destroyed counters are in the raw JSON.

| Scenario | Phase | Active Hosts | Host Types | Active Light Bindings | Light Binding Types | Active Effects | Effect Sources | Primitive Atom Deps | Compact Hosts | Style States |
| --- | --- | ---: | --- | ---: | --- | ---: | --- | ---: | ---: | ---: |
| create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| create-1000 | afterCreate | 1000 | SimpleElementHost:1000 | 1000 | InlineFunctionTextBinding:1000 | 0 | - | 0 | 1000 | 0 |
| create-1000 | afterClear | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-host-only-create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-host-only-create-1000 | afterCreate | 1000 | SimpleElementHost:1000 | 0 | - | 0 | - | 0 | 1000 | 0 |
| axii-host-only-create-1000 | afterClear | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-static-row-create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-static-row-create-1000 | afterCreate | 1000 | SimpleElementHost:1000 | 0 | - | 0 | - | 0 | 1000 | 0 |
| axii-static-row-create-1000 | afterClear | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-signal-row-create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-signal-row-create-1000 | afterCreate | 1000 | SimpleElementHost:1000 | 1000 | InlineFunctionTextBinding:1000 | 0 | - | 0 | 1000 | 0 |
| axii-signal-row-create-1000 | afterClear | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-dynamic-attr-create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-dynamic-attr-create-1000 | afterCreate | 1000 | SimpleElementHost:1000 | 1000 | LightReactiveAttributeBinding:1000 | 0 | - | 0 | 1000 | 0 |
| axii-dynamic-attr-create-1000 | afterClear | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-destroy-root-after-create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-destroy-root-after-create-1000 | afterCreate | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-destroy-root-after-create-1000 | afterDestroy | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |

## Summary

| Rank | Framework | Total Mean | Relative To Winner | Total Mean Heap Delta |
| ---: | --- | ---: | ---: | ---: |
| 1 | solid | 10.500ms | 1.00x | 0.255MB |
| 2 | vue | 12.446ms | 1.19x | 2.524MB |
| 3 | react | 31.550ms | 3.00x | 0.411MB |
| 4 | axii | 34.742ms | 3.31x | 2.689MB |

## Raw Data

Raw JSON: `results/real-browser-comparison-2026-05-20T09-18-36-924Z.json`
