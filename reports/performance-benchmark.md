# Real Browser Framework Benchmark Results

Generated: 2026-07-10T09:52:08.843Z

These numbers were collected by Playwright in Chromium from actual DOM-rendering implementations of Axii, React, Vue, and Solid. No mocked framework timings are used.

Versions: axii@4.4.1, data0@2.3.0, react@19.2.7, react-dom@19.2.7, vue@3.5.39, solid-js@1.9.14.

Settings: 8 measured iterations, 2 warmup iterations, base list size 1000.

## Mean Duration

| Test | Axii | React | Vue | Solid | Winner |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.625ms | 0.363ms | 0.400ms | 0.162ms | solid |
| create-1000 | 2.588ms | 2.938ms | 1.713ms | 0.800ms | solid |
| create-5000 | 9.900ms | 51.233ms | 7.267ms | 3.833ms | solid |
| append-100 | 0.262ms | 0.413ms | 1.337ms | 1.337ms | axii |
| update-100 | 0.325ms | 0.325ms | 1.325ms | 1.262ms | axii |
| remove-100 | 0.250ms | 0.462ms | 1.050ms | 1.188ms | axii |
| clear-1000 | 0.650ms | 0.688ms | 0.575ms | 0.287ms | solid |
| sort-1000 | 1.375ms | 3.037ms | 2.037ms | 1.488ms | axii |
| swap-2 | 0.138ms | 1.812ms | 1.150ms | 1.238ms | axii |
| reposition-1 | 0.425ms | 0.375ms | 1.075ms | 1.188ms | react |
| reposition-100 | 0.488ms | 0.450ms | 1.163ms | 1.213ms | react |
| move-head-to-tail | 0.525ms | 0.338ms | 1.075ms | 1.225ms | react |
| move-tail-to-head | 0.512ms | 2.962ms | 1.075ms | 1.300ms | axii |
| move-100-forward | 0.450ms | 0.425ms | 1.100ms | 1.225ms | react |
| move-100-backward | 0.388ms | 1.437ms | 1.150ms | 1.213ms | axii |
| axii-data-only-create-1000 | 0.188ms | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 1.600ms | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 1.325ms | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 2.375ms | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 2.237ms | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 112.233ms | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 7.567ms | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 52.467ms | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 72.833ms | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 237.000ms | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 127.633ms | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 126.033ms | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 311.167ms | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 491.233ms | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | 26.833ms | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | 17.000ms | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 3.900ms | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 3.200ms | N/A | N/A | N/A | axii |

## Mean JS Heap Delta

Measured with Chromium `performance.memory.usedJSHeapSize` after forced GC before and after each measured iteration.

| Test | Axii | React | Vue | Solid | Lowest Heap Growth |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.074MB | 0.025MB | 0.061MB | 0.012MB | solid |
| create-1000 | 0.602MB | 0.153MB | 0.512MB | 0.105MB | solid |
| create-5000 | 3.193MB | 1.012MB | 2.718MB | 0.521MB | solid |
| append-100 | 0.039MB | -0.038MB | 0.053MB | 0.047MB | react |
| update-100 | -0.025MB | -0.038MB | -0.003MB | -0.025MB | react |
| remove-100 | -0.071MB | -0.056MB | -0.048MB | -0.033MB | axii |
| clear-1000 | -0.603MB | -0.133MB | -0.510MB | -0.105MB | axii |
| sort-1000 | -0.020MB | -0.046MB | 0.000MB | -0.022MB | react |
| swap-2 | -0.011MB | -0.045MB | -0.000MB | -0.027MB | react |
| reposition-1 | -0.011MB | -0.046MB | -0.003MB | -0.029MB | react |
| reposition-100 | -0.012MB | -0.046MB | 0.000MB | -0.031MB | react |
| move-head-to-tail | -0.012MB | -0.046MB | 0.000MB | -0.031MB | react |
| move-tail-to-head | -0.012MB | -0.046MB | 0.000MB | -0.025MB | react |
| move-100-forward | -0.025MB | -0.046MB | 0.000MB | -0.027MB | react |
| move-100-backward | -0.021MB | -0.046MB | 0.000MB | -0.027MB | react |
| axii-data-only-create-1000 | 0.086MB | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 0.179MB | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 0.181MB | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 0.586MB | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 0.592MB | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 0.008MB | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 0.002MB | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 0.002MB | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | -0.001MB | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | -0.001MB | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 0.005MB | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 0.658MB | N/A | N/A | N/A | axii |

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
| 1 | axii | 18.900ms | 1.00x | 3.083MB |
| 2 | solid | 18.958ms | 1.00x | 0.302MB |
| 3 | vue | 23.492ms | 1.24x | 2.781MB |
| 4 | react | 67.258ms | 3.56x | 0.561MB |

## Raw Data

Raw JSON: `reports/performance-benchmark.json`
