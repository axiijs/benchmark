# Framework Memory Benchmark Results

Generated: 2026-07-05T13:16:44.225Z

Retained JS heap measured with `performance.memory.usedJSHeapSize` after forced GC (`--js-flags=--expose-gc --enable-precise-memory-info`), one fresh Chromium page per framework. Values are medians across iterations.

## Retained Heap After Rendering N Rows

| Rows | vanilla | axii | axii-atom | axii-static | react | vue | solid | solid-signal |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 0.010MB (104B/row) | 0.067MB (704B/row) | 0.055MB (575B/row) | 0.026MB (269B/row) | 0.027MB (287B/row) | 0.051MB (537B/row) | 0.010MB (105B/row) | 0.046MB (487B/row) |
| 1000 | 0.103MB (108B/row) | 0.599MB (628B/row) | 0.539MB (565B/row) | 0.181MB (190B/row) | 0.292MB (306B/row) | 0.512MB (537B/row) | 0.110MB (115B/row) | 0.467MB (490B/row) |
| 5000 | 0.515MB (108B/row) | 2.999MB (629B/row) | 2.698MB (566B/row) | 0.898MB (188B/row) | 1.467MB (308B/row) | 2.563MB (537B/row) | 0.521MB (109B/row) | 2.340MB (491B/row) |
| 10000 | 1.030MB (108B/row) | 5.998MB (629B/row) | 5.415MB (568B/row) | 1.797MB (188B/row) | 2.935MB (308B/row) | 5.113MB (536B/row) | 1.030MB (108B/row) | 4.655MB (488B/row) |

## Retained Heap After Mounting N Leaf Components (each with 1 local state)

| Components | vanilla | axii | axii-atom | axii-static | react | vue | solid | solid-signal |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | -0.000MB (-5B/comp) | 0.095MB (1001B/comp) | N/A | 0.102MB (1073B/comp) | 0.087MB (910B/comp) | 0.193MB (2019B/comp) | 0.028MB (295B/comp) | N/A |
| 1000 | -0.008MB (-8B/comp) | 0.919MB (964B/comp) | N/A | 0.920MB (965B/comp) | 0.788MB (826B/comp) | 1.819MB (1907B/comp) | 0.278MB (291B/comp) | N/A |
| 5000 | -0.036MB (-8B/comp) | 4.584MB (961B/comp) | N/A | 4.590MB (963B/comp) | 3.871MB (812B/comp) | 8.907MB (1868B/comp) | 1.383MB (290B/comp) | N/A |

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
| 100 | 1.6KB | 15.7KB | 5.7KB | 12.0KB | 36.8KB | 10.2KB | 0.4KB | 1.6KB |
| 1000 | 15.7KB | 0.2KB | 12.6KB | 1.6KB | 254.1KB | 0.4KB | 11.1KB | 0.1KB |
| 5000 | 0.0KB | 0.8KB | 0.5KB | 0.5KB | 1236.1KB | 0.0KB | 0.0KB | 0.0KB |
| 10000 | 0.0KB | 0.6KB | 5.9KB | 0.3KB | 2460.4KB | 0.0KB | 0.0KB | 0.0KB |

## Residual Heap After Clearing + One More Empty Render (median)

Distinguishes true leaks from deferred release such as React's double-buffered fiber trees.

| Rows | vanilla | axii | axii-atom | axii-static | react | vue | solid | solid-signal |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 0.0KB | 15.7KB | 5.3KB | 10.4KB | 19.4KB | 10.3KB | 0.4KB | 1.6KB |
| 1000 | 0.1KB | 0.2KB | 0.2KB | 1.6KB | 125.6KB | 10.0KB | 7.2KB | 7.2KB |
| 5000 | 0.0KB | 0.8KB | 0.5KB | 0.5KB | 592.0KB | 0.0KB | 0.0KB | 0.0KB |
| 10000 | 0.0KB | 0.6KB | 3.0KB | 0.3KB | 1171.7KB | 0.0KB | 0.0KB | 0.0KB |

## Long-Run Growth

| Metric | vanilla | axii | axii-atom | axii-static | react | vue | solid | solid-signal |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mount empty app | 1.1KB | 108.5KB | 108.5KB | 108.5KB | 96.8KB | 101.0KB | 52.3KB | 52.4KB |
| 30x create/clear 1000 rows | 6.6KB | 13.8KB | 5.6KB | 14.3KB | 266.9KB | 777.2KB | 16.0KB | 16.0KB |
| 100x update 100/1000 rows | 6.7KB | 22.6KB | 41.0KB | 108.3KB | 129.0KB | 34.8KB | -17.9KB | 22.8KB |

Raw JSON: `reports/memory-benchmark.json` (committed). Timestamped copies of each run are written to `results/` (gitignored).
