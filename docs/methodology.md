# Benchmark Methodology

## Overview

This document describes the methodology used to benchmark Axii against other mainstream frontend frameworks. Our goal is to provide fair, reproducible, and meaningful performance comparisons.

## Frameworks Tested

| Framework | Version | Key Features |
|-----------|---------|--------------|
| **Axii** | 3.7.13 | Atom-based reactivity, No Virtual DOM, RxList/RxMap/RxSet |
| React | 18.3.1 | Virtual DOM, Fiber architecture, Concurrent features |
| Vue | 3.5.13 | Proxy-based reactivity, Virtual DOM, Composition API |
| Svelte | 5.6.0 | Compile-time optimizations, No Virtual DOM, Runes |
| Solid | 1.9.4 | Fine-grained reactivity, No Virtual DOM, JSX |
| Preact | 10.25.4 | Lightweight React alternative, Virtual DOM |

## Test Categories

### 1. Reactive Updates
Tests the performance of reactive data updates and propagation.

**Tests:**
- **single-update**: Update a single reactive value
- **batch-update**: Update multiple values simultaneously
- **deep-update**: Modify nested object properties
- **computed-values**: Derived/computed value recalculations
- **array-mutations**: Array push, pop, splice operations
- **map-operations**: Map set, get, delete operations
- **set-operations**: Set add, delete, has operations

**What We Measure:**
- Time to complete update cycle
- Memory allocated during updates
- Number of DOM operations triggered
- Computation efficiency for derived values

### 2. List Rendering
Tests performance with large lists and various list operations.

**List Sizes:** 100, 1000, 5000, 10000 items

**Operations:**
- **create**: Initial render of list
- **append**: Add items to end
- **prepend**: Add items to beginning
- **insert**: Insert at specific position
- **remove**: Remove specific items
- **update**: Update item properties
- **swap**: Swap two items
- **clear**: Remove all items
- **sort**: Sort list items
- **filter**: Filter visible items

**What We Measure:**
- Time to complete operation
- Frame rate during operation
- Memory usage growth
- DOM reconciliation efficiency

### 3. Component Operations
Tests component lifecycle and composition performance.

**Tests:**
- **mount**: Component initialization time
- **unmount**: Component cleanup time
- **props-update**: Props change propagation
- **context**: Context API performance
- **deep-nesting**: Deeply nested component trees
- **dynamic-switch**: Dynamic component switching

**What We Measure:**
- Component creation overhead
- Memory leaks during unmount
- Props drilling vs context performance
- Render tree optimization

### 4. DOM Manipulations
Tests low-level DOM operation performance.

**Tests:**
- **attribute-update**: DOM attribute changes
- **style-change**: Inline style modifications
- **class-toggle**: CSS class additions/removals
- **event-handler**: Event listener performance
- **node-create**: DOM node creation
- **node-remove**: DOM node removal

**What We Measure:**
- Direct DOM manipulation speed
- Style recalculation impact
- Event handling overhead
- Reflow/repaint triggers

### 5. Real-World Scenarios
Tests with complete application patterns.

**Applications:**
- **Todo App**: CRUD operations, filtering, state management
- **Data Grid**: Large table with sorting/filtering
- **Form Validation**: Complex form with real-time validation
- **Dashboard**: Multiple widgets with frequent updates
- **Chat App**: Message list with real-time updates

**What We Measure:**
- Overall application responsiveness
- Memory usage over time
- Bundle size impact
- Time to interactive

## Performance Metrics

### Primary Metrics

1. **Execution Time**
   - Total time to complete operation
   - Average time across iterations
   - 95th and 99th percentile times

2. **Memory Usage**
   - Heap size before/after operation
   - Memory growth rate
   - Garbage collection frequency

3. **Frame Rate**
   - FPS during animations
   - Frame drops count
   - Jank detection

4. **Operations Per Second**
   - Throughput measurement
   - Scalability assessment

### Web Vitals

- **FCP** (First Contentful Paint)
- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)
- **TTI** (Time to Interactive)
- **TBT** (Total Blocking Time)

## Test Environment

### Hardware Specifications
- **CPU**: Standardized to 4x slowdown for consistency
- **Memory**: 8GB allocated to browser
- **Network**: Offline (all resources local)

### Software Configuration
- **Browser**: Chromium (latest stable)
- **OS**: Cross-platform testing
- **Node.js**: v20.x
- **Build**: Production builds with minification

### Test Parameters
```javascript
{
  iterations: 100,      // Number of test runs
  warmup: 10,          // Warmup iterations
  delay: 100,          // Delay between tests (ms)
  timeout: 30000,      // Test timeout (ms)
  gcBetweenTests: true // Force GC between tests
}
```

## Statistical Analysis

### Data Processing
1. **Outlier Removal**: Remove top/bottom 5% of results
2. **Averaging**: Use median for central tendency
3. **Variance**: Calculate standard deviation
4. **Confidence**: 95% confidence intervals

### Comparison Methodology
1. **Baseline**: Axii as baseline (100%)
2. **Relative Performance**: Other frameworks as percentage
3. **Statistical Significance**: T-test for meaningful differences
4. **Multiple Runs**: Minimum 3 complete benchmark runs

## Ensuring Fairness

### Framework-Specific Optimizations
Each framework is configured with its recommended optimizations:

- **Axii**: Batch updates, incremental computation
- **React**: Concurrent mode, automatic batching
- **Vue**: Composition API, compiler optimizations
- **Svelte**: Compiler hints, immutable updates
- **Solid**: Store patterns, createMemo usage
- **Preact**: Compat mode disabled, optimized builds

### Common Pitfalls Avoided
1. **Cold Start Bias**: Proper warmup iterations
2. **Memory Leaks**: Cleanup verification
3. **Throttling**: Disabled browser throttling
4. **Background Tasks**: Isolated test environment
5. **Build Differences**: Consistent build configurations

## Reproducibility

### Running the Benchmarks
```bash
# Install dependencies
npm install

# Run all benchmarks
npm run benchmark

# Run specific framework
npm run benchmark -- --framework=axii

# Run specific scenario
npm run benchmark -- --scenario=list
```

### Configuration File
All parameters are defined in `benchmark.config.js` for easy modification.

### Result Verification
- Results include environment information
- Git commit hash for exact code version
- Timestamps for temporal tracking
- Raw data exported for independent analysis

## Limitations

### Known Constraints
1. **Synthetic Nature**: Benchmarks may not reflect all real-world scenarios
2. **Browser Specifics**: Results may vary across browsers
3. **Hardware Dependency**: Absolute times depend on hardware
4. **Version Sensitivity**: Framework updates may change results

### Interpretation Guidelines
1. Focus on relative performance, not absolute numbers
2. Consider multiple metrics, not just speed
3. Evaluate based on your specific use case
4. Consider developer experience alongside performance

## Contributing

### Adding New Tests
1. Define test in appropriate category
2. Implement for all frameworks
3. Ensure statistical validity (minimum 100 iterations)
4. Document test purpose and methodology

### Reporting Issues
- Include full environment details
- Provide reproduction steps
- Share raw benchmark data
- Suggest improvements

## FAQ

### Q: Why these specific frameworks?
A: We selected the most popular and representative frameworks covering different paradigms (Virtual DOM, compile-time optimization, fine-grained reactivity).

### Q: How often are benchmarks updated?
A: We run benchmarks for each major framework release and quarterly for tracking trends.

### Q: Can I trust these results for my use case?
A: These benchmarks provide general performance indicators. Always test with your specific application patterns and requirements.

### Q: Why does Axii perform better in these tests?
A: Axii's architecture eliminates Virtual DOM overhead and uses precise reactive updates, resulting in minimal unnecessary computations and DOM manipulations.

## Conclusion

This benchmark suite aims to provide transparent, fair, and useful performance comparisons. While Axii shows strong performance characteristics, the best framework choice depends on many factors beyond raw performance, including ecosystem, learning curve, and specific project requirements.