# Real Browser Framework Benchmark Results

Generated: 2026-07-04T17:37:24.624Z

These numbers were collected by Playwright in Chromium from actual DOM-rendering implementations of Axii, React, Vue, and Solid. No mocked framework timings are used.

Settings: 8 measured iterations, 2 warmup iterations, base list size 1000.

## Mean Duration

| Test | Axii | React | Vue | Solid | Winner |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.813ms | 0.412ms | 0.387ms | 0.113ms | solid |
| create-1000 | 4.613ms | 2.962ms | 1.725ms | 0.800ms | solid |
| create-5000 | 20.367ms | 51.567ms | 7.300ms | 3.767ms | solid |
| append-100 | 0.437ms | 0.388ms | 1.262ms | 1.325ms | react |
| update-100 | 0.263ms | 0.313ms | 1.300ms | 1.225ms | axii |
| remove-100 | 0.200ms | 0.400ms | 0.975ms | 1.150ms | axii |
| clear-1000 | 1.313ms | 0.650ms | 0.563ms | 0.437ms | solid |
| sort-1000 | 1.463ms | 2.975ms | 2.025ms | 1.375ms | solid |
| swap-2 | 0.150ms | 1.675ms | 1.025ms | 1.212ms | axii |
| reposition-1 | 0.437ms | 0.300ms | 0.988ms | 1.238ms | react |
| reposition-100 | 0.537ms | 0.437ms | 1.038ms | 1.200ms | react |
| move-head-to-tail | 0.500ms | 0.313ms | 1.225ms | 1.212ms | react |
| move-tail-to-head | 0.538ms | 2.763ms | 1.000ms | 1.213ms | axii |
| move-100-forward | 0.475ms | 0.400ms | 1.063ms | 1.200ms | react |
| move-100-backward | 0.462ms | 1.325ms | 1.025ms | 1.200ms | axii |
| axii-data-only-create-1000 | 0.200ms | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 1.638ms | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 1.363ms | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 4.525ms | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 4.313ms | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 208.633ms | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 7.667ms | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 56.300ms | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 81.700ms | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 239.000ms | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 203.833ms | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 197.533ms | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 387.000ms | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 623.200ms | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | 34.700ms | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | 41.200ms | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 5.533ms | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 4.337ms | N/A | N/A | N/A | axii |

## Mean JS Heap Delta

Measured with Chromium `performance.memory.usedJSHeapSize` after forced GC before and after each measured iteration.

| Test | Axii | React | Vue | Solid | Lowest Heap Growth |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.105MB | 0.021MB | 0.063MB | 0.012MB | solid |
| create-1000 | 0.947MB | 0.132MB | 0.510MB | 0.099MB | solid |
| create-5000 | 4.907MB | 0.994MB | 2.718MB | 0.521MB | solid |
| append-100 | 0.092MB | -0.026MB | 0.053MB | -0.014MB | react |
| update-100 | -0.018MB | -0.040MB | -0.003MB | -0.029MB | react |
| remove-100 | -0.086MB | -0.048MB | -0.047MB | -0.035MB | axii |
| clear-1000 | -0.938MB | -0.130MB | -0.510MB | -0.100MB | axii |
| sort-1000 | -0.009MB | -0.044MB | -0.000MB | -0.028MB | react |
| swap-2 | -0.007MB | -0.045MB | -0.000MB | -0.029MB | react |
| reposition-1 | 0.001MB | -0.046MB | 0.001MB | -0.027MB | react |
| reposition-100 | -0.008MB | -0.046MB | 0.000MB | -0.029MB | react |
| move-head-to-tail | -0.004MB | -0.046MB | 0.000MB | -0.029MB | react |
| move-tail-to-head | 0.004MB | -0.045MB | 0.000MB | -0.027MB | react |
| move-100-forward | -0.004MB | -0.046MB | 0.000MB | -0.027MB | react |
| move-100-backward | -0.000MB | -0.046MB | 0.000MB | -0.027MB | react |
| axii-data-only-create-1000 | 0.086MB | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 0.241MB | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 0.237MB | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 0.955MB | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 0.946MB | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 0.006MB | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 0.003MB | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | -0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | -0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 0.002MB | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | 0.005MB | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | -0.012MB | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | -0.024MB | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 0.868MB | N/A | N/A | N/A | axii |

## Axii Retained Object Diagnostics

Counts are collected by the opt-in Axii/data0 retained object diagnostics API after forced GC. Full per-type created/destroyed counters are in the raw JSON.

| Scenario | Phase | Active Hosts | Host Types | Active Light Bindings | Light Binding Types | Active Effects | Effect Sources | Primitive Atom Deps | Compact Hosts | Style States |
| --- | --- | ---: | --- | ---: | --- | ---: | --- | ---: | ---: | ---: |
| create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| create-1000 | afterCreate | 2000 | CompactElementHost:1000, FunctionHost:1000 | 1000 | FunctionNodeBinding:1000 | 1000 | Cr:1000 | 1000 | 1000 | 0 |
| create-1000 | afterClear | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-host-only-create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-host-only-create-1000 | afterCreate | 1000 | CompactElementHost:1000 | 0 | - | 0 | - | 0 | 1000 | 0 |
| axii-host-only-create-1000 | afterClear | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-static-row-create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-static-row-create-1000 | afterCreate | 1000 | CompactElementHost:1000 | 0 | - | 0 | - | 0 | 1000 | 0 |
| axii-static-row-create-1000 | afterClear | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-signal-row-create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-signal-row-create-1000 | afterCreate | 2000 | CompactElementHost:1000, FunctionHost:1000 | 1000 | FunctionNodeBinding:1000 | 1000 | Cr:1000 | 1000 | 1000 | 0 |
| axii-signal-row-create-1000 | afterClear | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-dynamic-attr-create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-dynamic-attr-create-1000 | afterCreate | 1000 | CompactElementHost:1000 | 1000 | ReactiveAttributeBinding:1000 | 1000 | ce:1000 | 1000 | 1000 | 0 |
| axii-dynamic-attr-create-1000 | afterClear | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-destroy-root-after-create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-destroy-root-after-create-1000 | afterCreate | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-destroy-root-after-create-1000 | afterDestroy | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |

## Summary

| Rank | Framework | Total Mean | Relative To Winner | Total Mean Heap Delta |
| ---: | --- | ---: | ---: | ---: |
| 1 | solid | 18.667ms | 1.00x | 0.232MB |
| 2 | vue | 22.900ms | 1.23x | 2.786MB |
| 3 | axii | 32.567ms | 1.74x | 4.980MB |
| 4 | react | 66.879ms | 3.58x | 0.540MB |

## Raw Data

Raw JSON: `results/real-browser-comparison-2026-07-04T17-37-50-126Z.json`
