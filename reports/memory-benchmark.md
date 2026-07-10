# Framework Memory Benchmark Results

Generated: 2026-07-10T09:52:59.206Z

Retained JS heap measured with `performance.memory.usedJSHeapSize` after forced GC (`--js-flags=--expose-gc --enable-precise-memory-info`), one fresh Chromium page per framework. Values are medians across iterations.

Versions: axii@4.4.1, data0@2.3.0, react@19.2.7, react-dom@19.2.7, vue@3.5.39, solid-js@1.9.14.

## Retained Heap After Rendering N Rows

| Rows | vanilla | axii | axii-atom | axii-static | react | vue | solid | solid-signal |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 0.010MB (104B/row) | 0.068MB (715B/row) | 0.061MB (643B/row) | 0.026MB (268B/row) | 0.027MB (288B/row) | 0.052MB (549B/row) | 0.010MB (105B/row) | 0.046MB (487B/row) |
| 1000 | 0.103MB (108B/row) | 0.609MB (639B/row) | 0.539MB (565B/row) | 0.185MB (194B/row) | 0.299MB (314B/row) | 0.512MB (537B/row) | 0.110MB (115B/row) | 0.467MB (490B/row) |
| 5000 | 0.515MB (108B/row) | 3.033MB (636B/row) | 2.694MB (565B/row) | 0.897MB (188B/row) | 1.468MB (308B/row) | 2.563MB (537B/row) | 0.521MB (109B/row) | 2.340MB (491B/row) |
| 10000 | 1.030MB (108B/row) | 6.020MB (631B/row) | 5.357MB (562B/row) | 1.743MB (183B/row) | 2.935MB (308B/row) | 5.113MB (536B/row) | 1.030MB (108B/row) | 4.655MB (488B/row) |

## Retained Heap After Mounting N Leaf Components (each with 1 local state)

| Components | vanilla | axii | axii-atom | axii-static | react | vue | solid | solid-signal |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | -0.000MB (-5B/comp) | 0.090MB (947B/comp) | N/A | 0.092MB (968B/comp) | 0.087MB (915B/comp) | 0.192MB (2017B/comp) | 0.028MB (295B/comp) | N/A |
| 1000 | -0.008MB (-8B/comp) | 0.888MB (932B/comp) | N/A | 0.864MB (906B/comp) | 0.786MB (825B/comp) | 1.819MB (1907B/comp) | 0.278MB (291B/comp) | N/A |
| 5000 | -0.036MB (-8B/comp) | 4.355MB (913B/comp) | N/A | 4.318MB (906B/comp) | 3.871MB (812B/comp) | 8.907MB (1868B/comp) | 1.383MB (290B/comp) | N/A |

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
| 100 | 0.0KB | 9.7KB | 7.6KB | 12.4KB | 37.2KB | 10.2KB | 0.4KB | 1.7KB |
| 1000 | 15.7KB | 47.3KB | 3.8KB | 6.4KB | 261.3KB | 15.7KB | 7.2KB | 7.3KB |
| 5000 | 0.0KB | 0.6KB | 1.5KB | 1.6KB | 1237.2KB | 0.2KB | 0.0KB | 0.1KB |
| 10000 | 0.0KB | 0.3KB | -1.3KB | 0.5KB | 2460.9KB | 0.0KB | 0.0KB | 0.0KB |

## Residual Heap After Clearing + One More Empty Render (median)

Distinguishes true leaks from deferred release such as React's double-buffered fiber trees.

| Rows | vanilla | axii | axii-atom | axii-static | react | vue | solid | solid-signal |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 0.0KB | 7.6KB | 7.6KB | 10.8KB | 19.0KB | 10.3KB | 0.1KB | 1.7KB |
| 1000 | 0.1KB | 3.6KB | 0.3KB | 6.4KB | 136.7KB | 6.7KB | 7.2KB | 7.3KB |
| 5000 | 0.0KB | 0.6KB | 1.0KB | 1.6KB | 612.6KB | 0.1KB | 0.0KB | 0.0KB |
| 10000 | 0.0KB | 0.3KB | -1.3KB | 0.2KB | 1210.8KB | 0.0KB | 0.0KB | 0.0KB |

## Long-Run Growth

| Metric | vanilla | axii | axii-atom | axii-static | react | vue | solid | solid-signal |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mount empty app | 1.1KB | 115.0KB | 115.0KB | 115.0KB | 105.5KB | 107.2KB | 52.2KB | 52.3KB |
| 30x create/clear 1000 rows | 6.7KB | 8.1KB | 12.1KB | 7.0KB | 274.1KB | 776.9KB | 16.0KB | 16.1KB |
| 100x update 100/1000 rows | 6.7KB | 21.9KB | 31.3KB | 124.0KB | 98.6KB | 35.0KB | -17.9KB | 38.4KB |

Raw JSON: `reports/memory-benchmark.json` (committed). Timestamped copies of each run are written to `results/` (gitignored).
