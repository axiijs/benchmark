# Real Browser Framework Benchmark Results

Generated: 2026-07-10T12:59:23.382Z

These numbers were collected by Playwright in Chromium from actual DOM-rendering implementations of Axii, React, Vue, and Solid. No mocked framework timings are used.

Versions: axii@4.4.1 (local ../axii dist @ 4d7ddd6), data0@2.3.0 (local ../data0 dist @ b27c491), react@19.2.7, react-dom@19.2.7, vue@3.5.39, solid-js@1.9.14.

Settings: 8 measured iterations, 2 warmup iterations, base list size 1000.

## Mean Duration

| Test | Axii | React | Vue | Solid | Winner |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.713ms | 0.413ms | 0.350ms | 0.187ms | solid |
| create-1000 | 2.513ms | 2.975ms | 1.750ms | 0.887ms | solid |
| create-5000 | 9.933ms | 51.267ms | 7.267ms | 3.933ms | solid |
| append-100 | 0.288ms | 0.387ms | 1.513ms | 1.425ms | axii |
| update-100 | 0.363ms | 0.363ms | 1.612ms | 1.325ms | axii |
| remove-100 | 0.225ms | 0.512ms | 1.212ms | 1.163ms | axii |
| clear-1000 | 0.963ms | 0.800ms | 1.063ms | 0.337ms | solid |
| sort-1000 | 1.412ms | 3.163ms | 2.313ms | 1.387ms | solid |
| swap-2 | 0.112ms | 1.850ms | 1.125ms | 1.287ms | axii |
| reposition-1 | 0.412ms | 0.438ms | 1.188ms | 1.312ms | axii |
| reposition-100 | 0.488ms | 0.538ms | 1.350ms | 1.287ms | axii |
| move-head-to-tail | 0.550ms | 0.400ms | 1.287ms | 1.213ms | react |
| move-tail-to-head | 0.525ms | 3.000ms | 1.188ms | 1.250ms | axii |
| move-100-forward | 0.450ms | 0.500ms | 1.325ms | 1.262ms | axii |
| move-100-backward | 0.463ms | 1.562ms | 1.325ms | 1.213ms | axii |
| axii-data-only-create-1000 | 0.250ms | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 1.500ms | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 1.350ms | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 2.063ms | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 1.938ms | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 114.200ms | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 8.100ms | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 59.000ms | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 79.500ms | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 241.800ms | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 132.667ms | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 129.733ms | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 312.167ms | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 515.700ms | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | 27.300ms | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | 15.567ms | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 4.000ms | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 3.450ms | N/A | N/A | N/A | axii |

## Mean JS Heap Delta

Measured with Chromium `performance.memory.usedJSHeapSize` after forced GC before and after each measured iteration.

| Test | Axii | React | Vue | Solid | Lowest Heap Growth |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.056MB | 0.021MB | 0.061MB | 0.012MB | solid |
| create-1000 | 0.398MB | 0.136MB | 0.510MB | 0.103MB | solid |
| create-5000 | 2.238MB | 1.012MB | 2.718MB | 0.677MB | solid |
| append-100 | 0.026MB | -0.029MB | 0.053MB | -0.014MB | react |
| update-100 | -0.009MB | -0.039MB | -0.002MB | -0.025MB | react |
| remove-100 | -0.046MB | -0.051MB | -0.048MB | -0.035MB | react |
| clear-1000 | -0.407MB | -0.116MB | -0.510MB | -0.104MB | vue |
| sort-1000 | -0.008MB | -0.046MB | -0.000MB | -0.028MB | react |
| swap-2 | -0.017MB | -0.045MB | -0.000MB | -0.029MB | react |
| reposition-1 | -0.017MB | -0.046MB | -0.000MB | -0.024MB | react |
| reposition-100 | -0.012MB | -0.047MB | 0.000MB | -0.025MB | react |
| move-head-to-tail | -0.009MB | -0.046MB | 0.000MB | -0.029MB | react |
| move-tail-to-head | -0.012MB | -0.046MB | 0.000MB | -0.029MB | react |
| move-100-forward | -0.012MB | -0.046MB | 0.000MB | -0.028MB | react |
| move-100-backward | -0.006MB | -0.046MB | 0.000MB | -0.029MB | react |
| axii-data-only-create-1000 | 0.086MB | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 0.151MB | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 0.153MB | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 0.406MB | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 0.406MB | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 0.008MB | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 0.002MB | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 0.002MB | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 0.000MB | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | 0.002MB | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | 0.000MB | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 0.005MB | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 0.373MB | N/A | N/A | N/A | axii |

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
| 1 | axii | 19.408ms | 1.00x | 2.161MB |
| 2 | solid | 19.471ms | 1.00x | 0.394MB |
| 3 | vue | 25.867ms | 1.33x | 2.782MB |
| 4 | react | 68.167ms | 3.51x | 0.568MB |

## Raw Data

Raw JSON: `reports/performance-benchmark.json`
