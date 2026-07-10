# Framework Memory Benchmark Results

Generated: 2026-07-10T12:59:12.997Z

Retained JS heap measured with `performance.memory.usedJSHeapSize` after forced GC (`--js-flags=--expose-gc --enable-precise-memory-info`), one fresh Chromium page per framework. Values are medians across iterations.

Versions: axii@4.4.1 (local ../axii dist @ 4d7ddd6), data0@2.3.0 (local ../data0 dist @ b27c491), react@19.2.7, react-dom@19.2.7, vue@3.5.39, solid-js@1.9.14.

## Retained Heap After Rendering N Rows

| Rows | vanilla | axii | axii-atom | axii-static | react | vue | solid | solid-signal |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 0.010MB (104B/row) | 0.049MB (515B/row) | 0.042MB (443B/row) | 0.023MB (240B/row) | 0.027MB (288B/row) | 0.052MB (549B/row) | 0.010MB (105B/row) | 0.046MB (487B/row) |
| 1000 | 0.103MB (108B/row) | 0.416MB (437B/row) | 0.348MB (365B/row) | 0.158MB (166B/row) | 0.292MB (306B/row) | 0.512MB (537B/row) | 0.104MB (109B/row) | 0.474MB (498B/row) |
| 5000 | 0.515MB (108B/row) | 2.081MB (436B/row) | 1.741MB (365B/row) | 0.764MB (160B/row) | 1.468MB (308B/row) | 2.563MB (537B/row) | 0.521MB (109B/row) | 2.340MB (491B/row) |
| 10000 | 1.030MB (108B/row) | 4.108MB (431B/row) | 3.453MB (362B/row) | 1.477MB (155B/row) | 2.935MB (308B/row) | 5.113MB (536B/row) | 1.030MB (108B/row) | 4.655MB (488B/row) |

## Retained Heap After Mounting N Leaf Components (each with 1 local state)

| Components | vanilla | axii | axii-atom | axii-static | react | vue | solid | solid-signal |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | -0.000MB (-5B/comp) | 0.065MB (684B/comp) | N/A | 0.069MB (719B/comp) | 0.089MB (930B/comp) | 0.197MB (2065B/comp) | 0.028MB (295B/comp) | N/A |
| 1000 | -0.008MB (-8B/comp) | 0.621MB (651B/comp) | N/A | 0.602MB (631B/comp) | 0.786MB (825B/comp) | 1.819MB (1907B/comp) | 0.278MB (291B/comp) | N/A |
| 5000 | -0.036MB (-8B/comp) | 3.015MB (632B/comp) | N/A | 2.986MB (626B/comp) | 3.871MB (812B/comp) | 8.908MB (1868B/comp) | 1.383MB (290B/comp) | N/A |

## Data-Only Baseline (plain JS objects, no framework)

| Rows | vanilla page | axii page | axii-atom page | axii-static page | react page | vue page | solid page | solid-signal page |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 0.008MB | 0.008MB | 0.008MB | 0.008MB | 0.008MB | 0.008MB | 0.008MB | 0.008MB |
| 1000 | 0.084MB | 0.084MB | 0.084MB | 0.084MB | 0.084MB | 0.084MB | 0.084MB | 0.084MB |
| 5000 | 0.419MB | 0.419MB | 0.419MB | 0.419MB | 0.419MB | 0.419MB | 0.419MB | 0.419MB |
| 10000 | 0.839MB | 0.839MB | 0.839MB | 0.839MB | 0.839MB | 0.839MB | 0.839MB | 0.839MB |

## Residual Heap After Clearing (leak check, median)

| Rows | vanilla | axii | axii-atom | axii-static | react | vue | solid | solid-signal |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 1.6KB | 10.2KB | 12.7KB | 12.4KB | 31.1KB | 11.7KB | 1.7KB | 1.7KB |
| 1000 | 0.2KB | 0.5KB | 6.4KB | 15.9KB | 253.5KB | 0.4KB | 0.1KB | 7.3KB |
| 5000 | 0.0KB | 1.5KB | 1.7KB | 0.0KB | 1236.9KB | 0.2KB | 0.0KB | 0.0KB |
| 10000 | 0.0KB | 0.4KB | -0.7KB | 0.2KB | 2460.9KB | 0.0KB | 0.0KB | 0.0KB |

## Residual Heap After Clearing + One More Empty Render (median)

Distinguishes true leaks from deferred release such as React's double-buffered fiber trees.

| Rows | vanilla | axii | axii-atom | axii-static | react | vue | solid | solid-signal |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 0.0KB | 10.2KB | 7.7KB | 10.8KB | 11.0KB | 10.2KB | 0.4KB | 1.6KB |
| 1000 | 0.1KB | 0.5KB | 6.4KB | 6.4KB | 128.9KB | 10.1KB | 0.1KB | 7.3KB |
| 5000 | 0.0KB | 1.5KB | 1.7KB | 0.0KB | 612.3KB | 0.2KB | 0.0KB | 0.0KB |
| 10000 | 0.0KB | 0.4KB | -0.7KB | 0.2KB | 1210.9KB | 0.0KB | 0.0KB | 0.0KB |

## Long-Run Growth

| Metric | vanilla | axii | axii-atom | axii-static | react | vue | solid | solid-signal |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mount empty app | 1.1KB | 115.1KB | 115.1KB | 115.1KB | 105.5KB | 107.2KB | 52.2KB | 52.3KB |
| 30x create/clear 1000 rows | 6.7KB | 7.6KB | 9.5KB | 7.2KB | 274.0KB | 777.2KB | 16.0KB | 16.0KB |
| 100x update 100/1000 rows | 6.7KB | 23.5KB | 36.2KB | 124.0KB | 98.6KB | 34.6KB | -17.9KB | 38.4KB |

Raw JSON: `reports/memory-benchmark.json` (committed). Timestamped copies of each run are written to `results/` (gitignored).
