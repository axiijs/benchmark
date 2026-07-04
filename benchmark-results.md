# Real Browser Framework Benchmark Results

Generated: 2026-07-04T18:02:32.894Z

These numbers were collected by Playwright in Chromium from actual DOM-rendering implementations of Axii, React, Vue, and Solid. No mocked framework timings are used.

Settings: 8 measured iterations, 2 warmup iterations, base list size 1000.

## Mean Duration

| Test | Axii | React | Vue | Solid | Winner |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.625ms | 0.400ms | 0.375ms | 0.162ms | solid |
| create-1000 | 3.012ms | 2.975ms | 1.625ms | 0.775ms | solid |
| create-5000 | 11.367ms | 51.567ms | 6.933ms | 3.567ms | solid |
| append-100 | 0.313ms | 0.413ms | 1.238ms | 1.262ms | axii |
| update-100 | 0.225ms | 0.313ms | 1.288ms | 1.225ms | axii |
| remove-100 | 0.187ms | 0.450ms | 1.025ms | 1.125ms | axii |
| clear-1000 | 0.800ms | 0.675ms | 0.625ms | 0.462ms | solid |
| sort-1000 | 1.413ms | 3.075ms | 1.975ms | 1.388ms | solid |
| swap-2 | 0.112ms | 1.800ms | 1.000ms | 1.150ms | axii |
| reposition-1 | 0.437ms | 0.350ms | 1.025ms | 1.163ms | react |
| reposition-100 | 0.488ms | 0.425ms | 1.075ms | 1.163ms | react |
| move-head-to-tail | 0.500ms | 0.337ms | 1.025ms | 1.137ms | react |
| move-tail-to-head | 0.488ms | 3.000ms | 1.038ms | 1.225ms | axii |
| move-100-forward | 0.475ms | 0.450ms | 1.025ms | 1.200ms | react |
| move-100-backward | 0.475ms | 1.487ms | 1.125ms | 1.188ms | axii |
| axii-data-only-create-1000 | 0.262ms | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 1.600ms | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 1.350ms | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 2.337ms | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 2.325ms | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 123.567ms | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 7.600ms | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 55.433ms | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 78.067ms | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 228.967ms | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 147.000ms | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 147.533ms | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 324.900ms | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 514.667ms | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | 29.167ms | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | 37.833ms | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 3.233ms | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 3.762ms | N/A | N/A | N/A | axii |

## Mean JS Heap Delta

Measured with Chromium `performance.memory.usedJSHeapSize` after forced GC before and after each measured iteration.

| Test | Axii | React | Vue | Solid | Lowest Heap Growth |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.104MB | 0.024MB | 0.062MB | 0.012MB | solid |
| create-1000 | 0.898MB | 0.132MB | 0.514MB | 0.101MB | solid |
| create-5000 | 4.776MB | 0.994MB | 2.718MB | 0.521MB | solid |
| append-100 | 0.077MB | -0.033MB | 0.053MB | -0.014MB | react |
| update-100 | -0.008MB | -0.038MB | -0.003MB | -0.025MB | react |
| remove-100 | -0.097MB | -0.048MB | -0.047MB | -0.035MB | axii |
| clear-1000 | -0.909MB | -0.147MB | -0.508MB | -0.098MB | axii |
| sort-1000 | -0.009MB | -0.044MB | 0.000MB | -0.022MB | react |
| swap-2 | -0.012MB | -0.045MB | -0.000MB | -0.027MB | react |
| reposition-1 | -0.011MB | -0.046MB | -0.000MB | -0.029MB | react |
| reposition-100 | -0.012MB | -0.046MB | 0.000MB | -0.029MB | react |
| move-head-to-tail | -0.003MB | -0.046MB | 0.000MB | -0.029MB | react |
| move-tail-to-head | -0.002MB | -0.045MB | 0.000MB | -0.025MB | react |
| move-100-forward | -0.009MB | -0.046MB | 0.000MB | -0.025MB | react |
| move-100-backward | -0.012MB | -0.046MB | 0.000MB | -0.025MB | react |
| axii-data-only-create-1000 | 0.086MB | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 0.240MB | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 0.239MB | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 0.918MB | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 0.918MB | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 0.004MB | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 0.002MB | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 0.002MB | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | -0.016MB | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | -0.014MB | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | -0.009MB | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 0.852MB | N/A | N/A | N/A | axii |

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
| 1 | solid | 18.192ms | 1.00x | 0.252MB |
| 2 | axii | 20.917ms | 1.15x | 4.770MB |
| 3 | vue | 22.396ms | 1.23x | 2.790MB |
| 4 | react | 67.717ms | 3.72x | 0.521MB |

## Raw Data

Raw JSON: `results/real-browser-comparison-2026-07-04T18-02-56-285Z.json`
