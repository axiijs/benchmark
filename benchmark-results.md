# Real Browser Framework Benchmark Results

Generated: 2026-07-05T00:54:25.511Z

These numbers were collected by Playwright in Chromium from actual DOM-rendering implementations of Axii, React, Vue, and Solid. No mocked framework timings are used.

Settings: 8 measured iterations, 2 warmup iterations, base list size 1000.

## Mean Duration

| Test | Axii | React | Vue | Solid | Winner |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.688ms | 0.487ms | 0.400ms | 0.188ms | solid |
| create-1000 | 3.088ms | 2.975ms | 1.562ms | 0.813ms | solid |
| create-5000 | 11.500ms | 51.600ms | 7.000ms | 3.767ms | solid |
| append-100 | 0.375ms | 0.425ms | 1.200ms | 1.362ms | axii |
| update-100 | 0.213ms | 0.312ms | 1.263ms | 1.238ms | axii |
| remove-100 | 0.125ms | 0.425ms | 0.975ms | 1.225ms | axii |
| clear-1000 | 0.700ms | 0.650ms | 0.625ms | 0.438ms | solid |
| sort-1000 | 1.400ms | 2.875ms | 1.962ms | 1.375ms | solid |
| swap-2 | 0.113ms | 1.663ms | 0.962ms | 1.187ms | axii |
| reposition-1 | 0.413ms | 0.388ms | 1.000ms | 1.250ms | react |
| reposition-100 | 0.513ms | 0.425ms | 1.037ms | 1.200ms | react |
| move-head-to-tail | 0.513ms | 0.325ms | 0.988ms | 1.225ms | react |
| move-tail-to-head | 0.525ms | 2.838ms | 1.000ms | 1.238ms | axii |
| move-100-forward | 0.425ms | 0.412ms | 1.050ms | 1.138ms | react |
| move-100-backward | 0.513ms | 1.387ms | 1.050ms | 1.175ms | axii |
| axii-data-only-create-1000 | 0.250ms | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 1.563ms | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 1.350ms | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 2.300ms | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 2.300ms | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 124.700ms | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 7.433ms | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 54.300ms | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 78.167ms | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 232.367ms | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 148.800ms | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 149.067ms | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 326.400ms | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 518.367ms | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | 29.133ms | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | 37.533ms | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 3.333ms | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 3.938ms | N/A | N/A | N/A | axii |

## Mean JS Heap Delta

Measured with Chromium `performance.memory.usedJSHeapSize` after forced GC before and after each measured iteration.

| Test | Axii | React | Vue | Solid | Lowest Heap Growth |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.106MB | 0.026MB | 0.062MB | 0.012MB | solid |
| create-1000 | 0.914MB | 0.115MB | 0.512MB | 0.105MB | solid |
| create-5000 | 4.795MB | 0.994MB | 2.718MB | 0.521MB | solid |
| append-100 | 0.077MB | -0.028MB | 0.053MB | -0.011MB | react |
| update-100 | -0.009MB | -0.040MB | -0.003MB | -0.025MB | react |
| remove-100 | -0.097MB | -0.052MB | -0.048MB | -0.031MB | axii |
| clear-1000 | -0.919MB | -0.128MB | -0.508MB | -0.100MB | axii |
| sort-1000 | -0.009MB | -0.044MB | 0.000MB | -0.028MB | react |
| swap-2 | -0.018MB | -0.045MB | -0.000MB | -0.029MB | react |
| reposition-1 | -0.011MB | -0.046MB | -0.000MB | -0.027MB | react |
| reposition-100 | -0.019MB | -0.046MB | 0.000MB | -0.029MB | react |
| move-head-to-tail | -0.009MB | -0.046MB | 0.000MB | -0.029MB | react |
| move-tail-to-head | -0.008MB | -0.045MB | 0.000MB | -0.029MB | react |
| move-100-forward | -0.012MB | -0.046MB | 0.000MB | -0.028MB | react |
| move-100-backward | -0.012MB | -0.046MB | 0.000MB | -0.029MB | react |
| axii-data-only-create-1000 | 0.086MB | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 0.238MB | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 0.238MB | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 0.912MB | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 0.922MB | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 0.003MB | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 0.004MB | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | -0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | -0.016MB | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | -0.014MB | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | -0.007MB | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 0.855MB | N/A | N/A | N/A | axii |

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
| 1 | solid | 18.817ms | 1.00x | 0.243MB |
| 2 | axii | 21.100ms | 1.12x | 4.768MB |
| 3 | vue | 22.075ms | 1.17x | 2.785MB |
| 4 | react | 67.188ms | 3.57x | 0.525MB |

## Raw Data

Raw JSON: `results/real-browser-comparison-2026-07-05T00-54-48-977Z.json`
