# Real Browser Framework Benchmark Results

Generated: 2026-07-05T02:04:21.427Z

These numbers were collected by Playwright in Chromium from actual DOM-rendering implementations of Axii, React, Vue, and Solid. No mocked framework timings are used.

Settings: 8 measured iterations, 2 warmup iterations, base list size 1000.

## Mean Duration

| Test | Axii | React | Vue | Solid | Winner |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.725ms | 0.437ms | 0.400ms | 0.175ms | solid |
| create-1000 | 3.650ms | 2.988ms | 1.675ms | 0.875ms | solid |
| create-5000 | 13.033ms | 52.100ms | 7.167ms | 3.800ms | solid |
| append-100 | 0.363ms | 0.462ms | 1.363ms | 1.425ms | axii |
| update-100 | 0.275ms | 0.425ms | 1.500ms | 1.250ms | axii |
| remove-100 | 0.175ms | 0.512ms | 1.188ms | 1.287ms | axii |
| clear-1000 | 0.875ms | 0.750ms | 0.638ms | 0.375ms | solid |
| sort-1000 | 1.525ms | 3.113ms | 2.175ms | 1.575ms | axii |
| swap-2 | 0.125ms | 1.738ms | 1.175ms | 1.462ms | axii |
| reposition-1 | 0.450ms | 0.463ms | 1.125ms | 1.300ms | axii |
| reposition-100 | 0.538ms | 0.488ms | 1.138ms | 1.287ms | react |
| move-head-to-tail | 0.575ms | 0.438ms | 1.100ms | 1.350ms | react |
| move-tail-to-head | 0.537ms | 2.912ms | 1.138ms | 1.288ms | axii |
| move-100-forward | 0.425ms | 0.500ms | 1.238ms | 1.288ms | axii |
| move-100-backward | 0.475ms | 1.438ms | 1.212ms | 1.313ms | axii |
| axii-data-only-create-1000 | 0.263ms | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 1.600ms | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 1.337ms | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 2.413ms | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 2.413ms | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 131.867ms | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 7.533ms | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 53.933ms | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 78.100ms | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 247.767ms | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 160.500ms | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 173.300ms | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 335.167ms | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 562.567ms | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | 29.567ms | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | 37.867ms | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 3.300ms | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 4.200ms | N/A | N/A | N/A | axii |

## Mean JS Heap Delta

Measured with Chromium `performance.memory.usedJSHeapSize` after forced GC before and after each measured iteration.

| Test | Axii | React | Vue | Solid | Lowest Heap Growth |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.107MB | 0.024MB | 0.025MB | 0.012MB | solid |
| create-1000 | 0.927MB | 0.149MB | 0.514MB | 0.105MB | solid |
| create-5000 | 4.648MB | 0.994MB | 2.571MB | 0.677MB | solid |
| append-100 | 0.084MB | -0.100MB | 0.053MB | -0.016MB | react |
| update-100 | -0.003MB | -0.038MB | -0.003MB | -0.027MB | react |
| remove-100 | -0.092MB | -0.048MB | -0.047MB | -0.033MB | axii |
| clear-1000 | -0.931MB | -0.147MB | -0.512MB | -0.104MB | axii |
| sort-1000 | -0.009MB | -0.044MB | 0.000MB | -0.026MB | react |
| swap-2 | -0.024MB | -0.045MB | -0.000MB | -0.027MB | react |
| reposition-1 | -0.005MB | -0.046MB | -0.000MB | -0.027MB | react |
| reposition-100 | -0.006MB | -0.046MB | 0.000MB | -0.027MB | react |
| move-head-to-tail | -0.003MB | -0.046MB | 0.000MB | -0.021MB | react |
| move-tail-to-head | 0.000MB | -0.045MB | 0.000MB | -0.025MB | react |
| move-100-forward | -0.019MB | -0.046MB | 0.000MB | -0.028MB | react |
| move-100-backward | -0.006MB | -0.046MB | 0.000MB | -0.025MB | react |
| axii-data-only-create-1000 | 0.086MB | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 0.237MB | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 0.241MB | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 0.930MB | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 0.928MB | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 0.006MB | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 0.006MB | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 0.002MB | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | 0.002MB | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | -0.014MB | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 0.005MB | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 0.868MB | N/A | N/A | N/A | axii |

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
| 1 | solid | 20.050ms | 1.00x | 0.407MB |
| 2 | axii | 23.746ms | 1.18x | 4.668MB |
| 3 | vue | 24.229ms | 1.21x | 2.601MB |
| 4 | react | 68.762ms | 3.43x | 0.471MB |

## Raw Data

Raw JSON: `results/real-browser-comparison-2026-07-05T02-04-47-091Z.json`
