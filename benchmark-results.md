# Real Browser Framework Benchmark Results

Generated: 2026-07-05T03:20:08.631Z

These numbers were collected by Playwright in Chromium from actual DOM-rendering implementations of Axii, React, Vue, and Solid. No mocked framework timings are used.

Settings: 8 measured iterations, 2 warmup iterations, base list size 1000.

## Mean Duration

| Test | Axii | React | Vue | Solid | Winner |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.600ms | 0.437ms | 0.438ms | 0.175ms | solid |
| create-1000 | 2.950ms | 2.913ms | 1.638ms | 0.837ms | solid |
| create-5000 | 11.400ms | 52.933ms | 7.067ms | 3.900ms | solid |
| append-100 | 0.337ms | 0.388ms | 1.387ms | 1.425ms | axii |
| update-100 | 0.238ms | 0.375ms | 1.500ms | 1.363ms | axii |
| remove-100 | 0.138ms | 0.487ms | 1.188ms | 1.262ms | axii |
| clear-1000 | 0.750ms | 0.825ms | 0.750ms | 0.350ms | solid |
| sort-1000 | 1.375ms | 3.138ms | 2.288ms | 1.500ms | axii |
| swap-2 | 0.075ms | 1.788ms | 1.250ms | 1.263ms | axii |
| reposition-1 | 0.425ms | 0.425ms | 1.213ms | 1.262ms | axii |
| reposition-100 | 0.562ms | 0.487ms | 1.338ms | 1.225ms | react |
| move-head-to-tail | 0.475ms | 0.350ms | 1.300ms | 1.237ms | react |
| move-tail-to-head | 0.525ms | 2.913ms | 1.213ms | 1.263ms | axii |
| move-100-forward | 0.475ms | 0.500ms | 1.337ms | 1.200ms | axii |
| move-100-backward | 0.438ms | 1.425ms | 1.237ms | 1.288ms | axii |
| axii-data-only-create-1000 | 0.213ms | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 1.538ms | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 1.350ms | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 2.500ms | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 2.425ms | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 126.500ms | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 7.500ms | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 53.967ms | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 75.033ms | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 256.533ms | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 152.333ms | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 145.533ms | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 325.800ms | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 563.233ms | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | 30.633ms | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | 39.833ms | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 3.300ms | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 3.988ms | N/A | N/A | N/A | axii |

## Mean JS Heap Delta

Measured with Chromium `performance.memory.usedJSHeapSize` after forced GC before and after each measured iteration.

| Test | Axii | React | Vue | Solid | Lowest Heap Growth |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.077MB | 0.024MB | 0.062MB | 0.011MB | solid |
| create-1000 | 0.636MB | 0.132MB | 0.512MB | 0.105MB | solid |
| create-5000 | 3.404MB | 0.994MB | 2.571MB | 0.677MB | solid |
| append-100 | 0.056MB | -0.032MB | 0.053MB | -0.018MB | react |
| update-100 | -0.021MB | -0.040MB | -0.003MB | -0.025MB | react |
| remove-100 | -0.070MB | -0.047MB | -0.048MB | -0.031MB | axii |
| clear-1000 | -0.633MB | -0.113MB | -0.512MB | -0.102MB | axii |
| sort-1000 | -0.015MB | -0.044MB | -0.000MB | -0.024MB | react |
| swap-2 | -0.012MB | -0.045MB | -0.000MB | -0.029MB | react |
| reposition-1 | -0.011MB | -0.046MB | -0.000MB | -0.027MB | react |
| reposition-100 | -0.012MB | -0.046MB | 0.000MB | -0.029MB | react |
| move-head-to-tail | -0.012MB | -0.046MB | 0.000MB | -0.029MB | react |
| move-tail-to-head | -0.015MB | -0.045MB | 0.000MB | -0.029MB | react |
| move-100-forward | -0.006MB | -0.046MB | 0.000MB | -0.028MB | react |
| move-100-backward | -0.019MB | -0.046MB | 0.000MB | -0.025MB | react |
| axii-data-only-create-1000 | 0.086MB | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 0.178MB | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 0.179MB | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 0.640MB | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 0.641MB | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 0.004MB | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 0.003MB | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | 0.003MB | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | -0.014MB | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | -0.008MB | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 0.706MB | N/A | N/A | N/A | axii |

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
| 1 | solid | 19.550ms | 1.00x | 0.397MB |
| 2 | axii | 20.763ms | 1.06x | 3.345MB |
| 3 | vue | 25.142ms | 1.29x | 2.635MB |
| 4 | react | 69.383ms | 3.55x | 0.557MB |

## Raw Data

Raw JSON: `results/real-browser-comparison-2026-07-05T03-20-33-610Z.json`
