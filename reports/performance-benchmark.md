# Real Browser Framework Benchmark Results

Generated: 2026-07-05T13:15:45.693Z

These numbers were collected by Playwright in Chromium from actual DOM-rendering implementations of Axii, React, Vue, and Solid. No mocked framework timings are used.

Settings: 8 measured iterations, 2 warmup iterations, base list size 1000.

## Mean Duration

| Test | Axii | React | Vue | Solid | Winner |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.588ms | 0.375ms | 0.375ms | 0.187ms | solid |
| create-1000 | 2.475ms | 2.975ms | 1.600ms | 0.825ms | solid |
| create-5000 | 9.933ms | 51.900ms | 7.100ms | 3.800ms | solid |
| append-100 | 0.288ms | 0.413ms | 1.212ms | 1.337ms | axii |
| update-100 | 0.225ms | 0.262ms | 1.262ms | 1.250ms | axii |
| remove-100 | 0.175ms | 0.387ms | 1.062ms | 1.162ms | axii |
| clear-1000 | 0.675ms | 0.738ms | 0.550ms | 0.363ms | solid |
| sort-1000 | 1.400ms | 2.912ms | 2.025ms | 1.362ms | solid |
| swap-2 | 0.125ms | 1.650ms | 1.063ms | 1.250ms | axii |
| reposition-1 | 0.413ms | 0.375ms | 1.025ms | 1.262ms | react |
| reposition-100 | 0.513ms | 0.438ms | 1.050ms | 1.225ms | react |
| move-head-to-tail | 0.525ms | 0.325ms | 0.975ms | 1.175ms | react |
| move-tail-to-head | 0.512ms | 2.937ms | 1.012ms | 1.212ms | axii |
| move-100-forward | 0.450ms | 0.388ms | 1.037ms | 1.325ms | react |
| move-100-backward | 0.437ms | 1.425ms | 1.050ms | 1.250ms | axii |
| axii-data-only-create-1000 | 0.237ms | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 1.537ms | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 1.300ms | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 2.300ms | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 2.437ms | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 117.333ms | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 7.600ms | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 54.867ms | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 76.133ms | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 251.900ms | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 133.200ms | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 130.667ms | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 312.333ms | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 508.233ms | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | 29.167ms | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | 59.167ms | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 3.067ms | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 3.250ms | N/A | N/A | N/A | axii |

## Mean JS Heap Delta

Measured with Chromium `performance.memory.usedJSHeapSize` after forced GC before and after each measured iteration.

| Test | Axii | React | Vue | Solid | Lowest Heap Growth |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.071MB | 0.022MB | 0.062MB | 0.012MB | solid |
| create-1000 | 0.595MB | 0.149MB | 0.512MB | 0.105MB | solid |
| create-5000 | 3.155MB | 0.994MB | 2.718MB | 0.521MB | solid |
| append-100 | 0.051MB | -0.026MB | 0.053MB | -0.013MB | react |
| update-100 | -0.021MB | -0.040MB | -0.003MB | -0.029MB | react |
| remove-100 | -0.071MB | -0.048MB | -0.048MB | -0.035MB | axii |
| clear-1000 | -0.590MB | -0.113MB | -0.508MB | -0.102MB | axii |
| sort-1000 | -0.009MB | -0.044MB | -0.000MB | -0.028MB | react |
| swap-2 | -0.021MB | -0.045MB | -0.000MB | -0.025MB | react |
| reposition-1 | -0.017MB | -0.046MB | -0.000MB | -0.024MB | react |
| reposition-100 | -0.019MB | -0.046MB | 0.000MB | -0.029MB | react |
| move-head-to-tail | -0.019MB | -0.046MB | 0.000MB | -0.029MB | react |
| move-tail-to-head | -0.015MB | -0.045MB | 0.000MB | -0.029MB | react |
| move-100-forward | -0.019MB | -0.046MB | 0.000MB | -0.025MB | react |
| move-100-backward | -0.019MB | -0.046MB | 0.000MB | -0.025MB | react |
| axii-data-only-create-1000 | 0.086MB | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 0.180MB | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 0.183MB | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 0.581MB | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 0.583MB | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 0.006MB | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | -0.014MB | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | -0.014MB | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 0.003MB | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 0.644MB | N/A | N/A | N/A | axii |

## Axii Retained Object Diagnostics

Counts are collected by the opt-in Axii/data0 retained object diagnostics API after forced GC. Full per-type created/destroyed counters are in the raw JSON.

| Scenario | Phase | Active Hosts | Host Types | Active Light Bindings | Light Binding Types | Active Effects | Effect Sources | Primitive Atom Deps | Compact Hosts | Style States |
| --- | --- | ---: | --- | ---: | --- | ---: | --- | ---: | ---: | ---: |
| create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| create-1000 | afterCreate | 2000 | CompactElementHost:1000, FunctionHost:1000 | 1000 | FunctionNodeBinding:1000 | 1000 | LightBindingEffect:1000 | 1000 | 1000 | 0 |
| create-1000 | afterClear | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-host-only-create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-host-only-create-1000 | afterCreate | 1000 | CompactElementHost:1000 | 0 | - | 0 | - | 0 | 1000 | 0 |
| axii-host-only-create-1000 | afterClear | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-static-row-create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-static-row-create-1000 | afterCreate | 1000 | CompactElementHost:1000 | 0 | - | 0 | - | 0 | 1000 | 0 |
| axii-static-row-create-1000 | afterClear | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-signal-row-create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-signal-row-create-1000 | afterCreate | 2000 | CompactElementHost:1000, FunctionHost:1000 | 1000 | FunctionNodeBinding:1000 | 1000 | LightBindingEffect:1000 | 1000 | 1000 | 0 |
| axii-signal-row-create-1000 | afterClear | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-dynamic-attr-create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-dynamic-attr-create-1000 | afterCreate | 1000 | CompactElementHost:1000 | 1000 | ReactiveAttributeBinding:1000 | 1000 | LightBindingEffect:1000 | 1000 | 1000 | 0 |
| axii-dynamic-attr-create-1000 | afterClear | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-destroy-root-after-create-1000 | baseline | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-destroy-root-after-create-1000 | afterCreate | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |
| axii-destroy-root-after-create-1000 | afterDestroy | 0 | - | 0 | - | 0 | - | 0 | 0 | 0 |

## Summary

| Rank | Framework | Total Mean | Relative To Winner | Total Mean Heap Delta |
| ---: | --- | ---: | ---: | ---: |
| 1 | axii | 18.733ms | 1.00x | 3.053MB |
| 2 | solid | 18.987ms | 1.01x | 0.247MB |
| 3 | vue | 22.400ms | 1.20x | 2.785MB |
| 4 | react | 67.500ms | 3.60x | 0.576MB |

## Raw Data

Raw JSON: `reports/performance-benchmark.json`
