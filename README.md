# Axii Framework Performance Benchmark

This project provides a comprehensive performance benchmark comparing Axii with mainstream frontend frameworks including React, Vue, Svelte, Solid, Preact, and Qwik.

## 📊 Benchmark Scenarios

### 1. **Reactive Updates**
- Atomic value updates
- Nested object updates
- Array operations (push, pop, splice)
- Map/Set operations
- Batch updates

### 2. **List Rendering**
- Initial render of large lists (1000, 5000, 10000 items)
- Adding items to list
- Removing items from list
- Updating specific items
- Sorting and filtering
- Virtual scrolling performance

### 3. **Component Tree**
- Deep component nesting
- Component creation/destruction
- Props drilling vs Context
- Dynamic component switching

### 4. **DOM Manipulation**
- Attribute updates
- Style changes
- Class toggling
- Event handler performance
- DOM node creation/removal

### 5. **Memory Usage**
- Initial memory footprint
- Memory growth over time
- Garbage collection impact
- Memory leaks detection

### 6. **Real-world Scenarios**
- Todo application
- Data grid with sorting/filtering
- Form with validation
- Dashboard with charts
- Chat application

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Run Benchmarks

```bash
# Real Playwright/Chromium performance suite (duration + heap delta + retained diagnostics)
npm run benchmark:real

# Cross-framework retained-memory suite
npm run benchmark:memory

# Axii heap snapshots for offline analysis
npm run heap:snapshot
```

Note: `benchmark:real` and `benchmark:memory` require a built sibling `../axii` checkout (`cd ../axii && npm run build`) and the Playwright Chromium browser (`npx playwright install chromium`).

## 📈 Benchmark Results

Static reports (committed to this repository, regenerated on every benchmark run):

- [Performance benchmark report](reports/performance-benchmark.md) - duration + heap delta + retained object diagnostics from `npm run benchmark:real` (raw data: [`reports/performance-benchmark.json`](reports/performance-benchmark.json))
- [Memory benchmark report](reports/memory-benchmark.md) - retained heap, leak checks and long-run growth from `npm run benchmark:memory` (raw data: [`reports/memory-benchmark.json`](reports/memory-benchmark.json))
- [Latest performance results](benchmark-results.md) - same content as the performance report, kept at the repository root
- [Memory usage deep-dive analysis](docs/memory-analysis.md) - written analysis of the memory numbers, per-object weighing and optimization history

Each run also writes timestamped raw copies to `results/` (gitignored), and `screenshots/` holds visual comparisons when enabled (gitignored).

### Metrics Measured

1. **Time Metrics**
   - First Contentful Paint (FCP)
   - Time to Interactive (TTI)
   - Total Blocking Time (TBT)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)

2. **Performance Metrics**
   - Operations per second
   - Frame rate (FPS)
   - Script execution time
   - Render time
   - Update cycle time

3. **Resource Metrics**
   - Bundle size (minified + gzipped)
   - Memory usage (heap size)
   - Network requests
   - Cache efficiency

## 🏗️ Project Structure

```
axii-benchmark/
├── src/
│   ├── frameworks/               # Framework benchmark implementations
│   ├── real-browser-benchmark.js # In-page harness for benchmark:real
│   ├── memory-benchmark.js       # In-page harness for benchmark:memory
│   ├── utils/                    # Utility functions
│   └── types/                    # TypeScript definitions
├── scripts/                      # Playwright-based benchmark runners
├── docs/                         # Methodology and analysis documents
├── reports/                      # Static benchmark reports (committed)
└── results/                      # Timestamped raw run outputs (gitignored)
```

## 📝 Test Scenarios

### 1. List Operations (1K/5K/10K items)

| Operation | Description |
|-----------|------------|
| create | Initial render of list |
| append | Add items to end |
| prepend | Add items to beginning |
| insert | Insert at specific position |
| remove | Remove specific items |
| update | Update item properties |
| swap | Swap two items |
| clear | Remove all items |
| sort | Sort list |
| filter | Filter visible items |

### 2. Reactive Data Updates

| Test | Description |
|------|-------------|
| single-update | Update single atomic value |
| batch-update | Update multiple values in batch |
| computed | Computed/derived value updates |
| deep-update | Nested object property changes |
| array-mutation | Array push/pop/splice |
| map-operations | Map set/get/delete |

### 3. Component Performance

| Test | Description |
|------|-------------|
| mount | Component mount time |
| unmount | Component cleanup time |
| props-change | Props update performance |
| context | Context API performance |
| memo | Memoization effectiveness |

## 🎯 Axii Advantages Highlighted

1. **Precise Updates**: Only affected DOM nodes are updated
2. **No Re-renders**: Component functions execute only once
3. **Incremental Computation**: Reactive data performs minimal calculations
4. **Rich Data Structures**: Built-in RxList, RxMap, RxSet for optimal performance
5. **Memory Efficiency**: Lower memory footprint due to no Virtual DOM

## 📊 Visualization

The benchmark results include interactive charts showing:
- Performance comparison across frameworks
- Timeline views of operations
- Memory usage graphs
- FPS charts during animations
- Bundle size comparisons

## 🔧 Configuration

Customize benchmarks in `benchmark.config.js`:

```javascript
export default {
  frameworks: ['axii', 'react', 'vue', 'svelte'],
  iterations: 100,
  warmup: 10,
  scenarios: ['list', 'reactive', 'component'],
  outputFormat: ['json', 'html', 'csv']
}
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with UI
npm run test:ui

# Coverage report
npm run test:coverage
```

## 📚 Documentation

- [Benchmark Methodology](docs/methodology.md) - test categories, metrics, environment and statistical analysis
- [Memory Analysis](docs/memory-analysis.md) - deep-dive into retained memory per framework, with per-object weighing
- [Framework Comparison Analysis](framework-comparison-analysis.md) - architectural comparison behind the numbers
- [Performance Benchmark Report](reports/performance-benchmark.md) - latest measured performance results
- [Memory Benchmark Report](reports/memory-benchmark.md) - latest measured memory results

## 🤝 Contributing

Contributions are welcome! See the [Contributing section of the methodology guide](docs/methodology.md#contributing) for how to add new tests and report issues.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.