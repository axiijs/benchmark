# Real Browser Framework Benchmark Results

Generated: 2026-07-05T04:01:47.536Z

These numbers were collected by Playwright in Chromium from actual DOM-rendering implementations of Axii, React, Vue, and Solid. No mocked framework timings are used.

Settings: 8 measured iterations, 2 warmup iterations, base list size 1000.

## Mean Duration

| Test | Axii | React | Vue | Solid | Winner |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.538ms | 0.375ms | 0.375ms | 0.175ms | solid |
| create-1000 | 2.462ms | 3.000ms | 1.612ms | 0.812ms | solid |
| create-5000 | 9.967ms | 51.600ms | 6.967ms | 3.700ms | solid |
| append-100 | 0.325ms | 0.425ms | 1.287ms | 1.338ms | axii |
| update-100 | 0.225ms | 0.300ms | 1.325ms | 1.200ms | axii |
| remove-100 | 0.225ms | 0.425ms | 1.038ms | 1.163ms | axii |
| clear-1000 | 0.638ms | 0.638ms | 0.550ms | 0.388ms | solid |
| sort-1000 | 1.400ms | 2.975ms | 2.037ms | 1.350ms | solid |
| swap-2 | 0.150ms | 1.700ms | 1.013ms | 1.225ms | axii |
| reposition-1 | 0.425ms | 0.350ms | 0.950ms | 1.225ms | react |
| reposition-100 | 0.487ms | 0.438ms | 1.012ms | 1.237ms | react |
| move-head-to-tail | 0.500ms | 0.350ms | 1.050ms | 1.163ms | react |
| move-tail-to-head | 0.550ms | 2.825ms | 0.950ms | 1.188ms | axii |
| move-100-forward | 0.450ms | 0.450ms | 1.025ms | 1.175ms | axii |
| move-100-backward | 0.425ms | 1.388ms | 1.100ms | 1.212ms | axii |
| axii-data-only-create-1000 | 0.225ms | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 1.512ms | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 1.313ms | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 2.363ms | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 2.325ms | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 116.933ms | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 7.533ms | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 60.567ms | N/A | N/A | N/A | axii |
| axii-static-row-create-clear-1000-repeat-50 | 81.200ms | N/A | N/A | N/A | axii |
| axii-create-remove-chunks-1000-repeat-50 | 251.033ms | N/A | N/A | N/A | axii |
| axii-create-remove-999-then-1-repeat-50 | 140.133ms | N/A | N/A | N/A | axii |
| axii-create-clear-method-1000-repeat-50 | 133.233ms | N/A | N/A | N/A | axii |
| axii-create-clear-yield-1000-repeat-50 | 324.000ms | N/A | N/A | N/A | axii |
| axii-create-clear-gc-1000-repeat-50 | 499.333ms | N/A | N/A | N/A | axii |
| axii-append-remove-100-repeat-100 | 27.800ms | N/A | N/A | N/A | axii |
| axii-update-text-1000-repeat-100 | 37.933ms | N/A | N/A | N/A | axii |
| axii-destroy-root-after-create-1000 | 3.033ms | N/A | N/A | N/A | axii |
| axii-dynamic-attr-create-1000 | 3.312ms | N/A | N/A | N/A | axii |

## Mean JS Heap Delta

Measured with Chromium `performance.memory.usedJSHeapSize` after forced GC before and after each measured iteration.

| Test | Axii | React | Vue | Solid | Lowest Heap Growth |
| --- | ---: | ---: | ---: | ---: | --- |
| create-100 | 0.072MB | 0.022MB | 0.062MB | 0.012MB | solid |
| create-1000 | 0.592MB | 0.166MB | 0.512MB | 0.105MB | solid |
| create-5000 | 3.155MB | 0.994MB | 2.718MB | 0.521MB | solid |
| append-100 | 0.044MB | -0.104MB | 0.053MB | -0.009MB | react |
| update-100 | -0.015MB | -0.038MB | -0.003MB | -0.029MB | react |
| remove-100 | -0.070MB | -0.048MB | -0.048MB | -0.035MB | axii |
| clear-1000 | -0.590MB | -0.147MB | -0.510MB | -0.104MB | axii |
| sort-1000 | -0.009MB | -0.044MB | 0.000MB | -0.028MB | react |
| swap-2 | -0.018MB | -0.045MB | -0.000MB | -0.029MB | react |
| reposition-1 | -0.017MB | -0.046MB | -0.000MB | -0.027MB | react |
| reposition-100 | -0.019MB | -0.046MB | 0.000MB | -0.029MB | react |
| move-head-to-tail | -0.015MB | -0.046MB | 0.000MB | -0.029MB | react |
| move-tail-to-head | -0.015MB | -0.045MB | 0.000MB | -0.029MB | react |
| move-100-forward | -0.015MB | -0.046MB | 0.000MB | -0.028MB | react |
| move-100-backward | -0.019MB | -0.046MB | 0.000MB | -0.029MB | react |
| axii-data-only-create-1000 | 0.086MB | N/A | N/A | N/A | axii |
| axii-host-only-create-1000 | 0.176MB | N/A | N/A | N/A | axii |
| axii-static-row-create-1000 | 0.179MB | N/A | N/A | N/A | axii |
| axii-signal-row-create-1000 | 0.595MB | N/A | N/A | N/A | axii |
| axii-fine-grained-create-1000 | 0.602MB | N/A | N/A | N/A | axii |
| axii-create-clear-1000-repeat-50 | 0.006MB | N/A | N/A | N/A | axii |
| axii-data-only-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
| axii-host-only-create-clear-1000-repeat-50 | 0.001MB | N/A | N/A | N/A | axii |
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
| 1 | solid | 18.550ms | 1.00x | 0.234MB |
| 2 | axii | 18.767ms | 1.01x | 3.062MB |
| 3 | vue | 22.292ms | 1.20x | 2.784MB |
| 4 | react | 67.237ms | 3.62x | 0.483MB |

## Raw Data

Raw JSON: `results/real-browser-comparison-2026-07-05T04-02-10-907Z.json`
