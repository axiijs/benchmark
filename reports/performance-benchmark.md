# Real Browser Framework Benchmark Results

Generated: 2026-07-10T09:43:20.230Z

These numbers were collected by Playwright in Chromium from actual DOM-rendering implementations of Axii, React, Vue, and Solid. No mocked framework timings are used.

Settings: 8 measured iterations, 2 warmup iterations, base list size 1000.

## Mean Duration

| Test | Axii | React | Vue | Solid | Winner |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.612ms | 0.425ms | 0.400ms | 0.175ms | solid |
| create-1000 | 2.500ms | 3.025ms | 1.562ms | 0.800ms | solid |
| create-5000 | 9.833ms | 51.700ms | 6.933ms | 3.800ms | solid |
| append-100 | 0.275ms | 0.413ms | 1.288ms | 1.338ms | axii |
| update-100 | 0.350ms | 0.350ms | 1.338ms | 1.275ms | axii |
| remove-100 | 0.188ms | 0.400ms | 1.100ms | 1.150ms | axii |
| clear-1000 | 0.712ms | 0.675ms | 0.575ms | 0.400ms | solid |
| sort-1000 | 1.350ms | 2.875ms | 2.050ms | 1.425ms | axii |
| swap-2 | 0.137ms | 1.662ms | 1.000ms | 1.138ms | axii |
| reposition-1 | 0.413ms | 0.375ms | 1.062ms | 1.300ms | react |
| reposition-100 | 0.488ms | 0.462ms | 1.138ms | 1.275ms | react |
| move-head-to-tail | 0.500ms | 0.325ms | 1.025ms | 1.213ms | react |
| move-tail-to-head | 0.525ms | 2.875ms | 0.975ms | 1.288ms | axii |
| move-100-forward | 0.425ms | 0.463ms | 1.050ms | 1.200ms | axii |
| move-100-backward | 0.463ms | 1.400ms | 1.050ms | 1.188ms | axii |
| axii-data-only-create-1000 | 0.275ms | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 1.588ms | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 1.450ms | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 2.400ms | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 2.225ms | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 112.867ms | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 7.533ms | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 52.300ms | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 72.300ms | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 233.567ms | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 125.167ms | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 129.200ms | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 309.467ms | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 490.167ms | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | 26.367ms | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | 16.400ms | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 3.633ms | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 3.213ms | N/A | N/A | N/A | axii |

## Mean JS Heap Delta

Measured with Chromium `performance.memory.usedJSHeapSize` after forced GC before and after each measured iteration.

| Test | Axii | React | Vue | Solid | Lowest Heap Growth |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.074MB | 0.024MB | 0.063MB | 0.012MB | solid |
| create-1000 | 0.601MB | 0.132MB | 0.514MB | 0.103MB | solid |
| create-5000 | 3.185MB | 0.994MB | 2.718MB | 0.521MB | solid |
| append-100 | 0.038MB | -0.030MB | 0.053MB | -0.009MB | react |
| update-100 | -0.019MB | -0.038MB | -0.003MB | -0.021MB | react |
| remove-100 | -0.064MB | -0.055MB | -0.047MB | -0.036MB | axii |
| clear-1000 | -0.597MB | -0.130MB | -0.510MB | -0.104MB | axii |
| sort-1000 | -0.020MB | -0.044MB | -0.000MB | -0.024MB | react |
| swap-2 | -0.017MB | -0.045MB | -0.000MB | -0.027MB | react |
| reposition-1 | -0.017MB | -0.046MB | -0.000MB | -0.024MB | react |
| reposition-100 | -0.019MB | -0.046MB | 0.000MB | -0.023MB | react |
| move-head-to-tail | -0.015MB | -0.046MB | 0.000MB | -0.025MB | react |
| move-tail-to-head | -0.018MB | -0.045MB | 0.000MB | -0.021MB | react |
| move-100-forward | -0.025MB | -0.046MB | 0.000MB | -0.027MB | react |
| move-100-backward | -0.012MB | -0.046MB | 0.000MB | -0.027MB | react |
| axii-data-only-create-1000 | 0.086MB | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 0.181MB | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 0.181MB | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 0.602MB | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 0.591MB | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 0.008MB | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 0.002MB | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 0.002MB | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | -0.001MB | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | -0.001MB | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 0.005MB | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 0.663MB | N/A | N/A | N/A | axii |

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
| 1 | axii | 18.771ms | 1.00x | 3.073MB |
| 2 | solid | 18.963ms | 1.01x | 0.268MB |
| 3 | vue | 22.546ms | 1.20x | 2.788MB |
| 4 | react | 67.425ms | 3.59x | 0.535MB |

## Raw Data

Raw JSON: `reports/performance-benchmark.json`
