export default {
  // Frameworks to benchmark
  frameworks: [
    'axii',
    'react',
    'vue',
    'svelte',
    'solid',
    'preact',
  ],

  // Benchmark scenarios
  scenarios: {
    reactive: {
      enabled: true,
      tests: [
        'single-update',
        'batch-update',
        'deep-update',
        'computed-values',
        'array-mutations',
        'map-operations',
        'set-operations'
      ]
    },
    list: {
      enabled: true,
      sizes: [100, 1000, 5000, 10000],
      tests: [
        'create',
        'append',
        'prepend', 
        'insert',
        'remove',
        'update',
        'swap',
        'clear',
        'sort',
        'filter'
      ]
    },
    component: {
      enabled: true,
      tests: [
        'mount',
        'unmount',
        'props-update',
        'context',
        'deep-nesting',
        'dynamic-switch'
      ]
    },
    dom: {
      enabled: true,
      tests: [
        'attribute-update',
        'style-change',
        'class-toggle',
        'event-handler',
        'node-create',
        'node-remove'
      ]
    },
    realworld: {
      enabled: true,
      apps: [
        'todo',
        'data-grid',
        'form-validation',
        'dashboard',
        'chat'
      ]
    }
  },

  // Performance metrics to measure
  metrics: {
    timing: true,           // FCP, TTI, TBT, LCP
    memory: true,          // Heap size, GC
    fps: true,             // Frame rate
    operations: true,      // Ops per second
    bundle: true,          // Bundle size
    lighthouse: false      // Full Lighthouse audit (slower)
  },

  // Benchmark settings
  settings: {
    iterations: 100,       // Number of iterations per test
    warmup: 10,           // Warmup iterations
    timeout: 30000,       // Test timeout in ms
    delay: 100,           // Delay between tests in ms
    concurrent: false,    // Run tests concurrently
    headless: true,       // Run browser in headless mode
    viewport: {
      width: 1920,
      height: 1080
    }
  },

  // Output configuration
  output: {
    formats: ['json', 'html', 'csv', 'markdown'],
    resultsDir: './results',
    reportsDir: './reports',
    screenshotsDir: './screenshots',
    verbose: false,
    compareBaseline: true,
    generateCharts: true
  },

  // Framework specific configurations
  frameworkConfig: {
    axii: {
      // Axii specific optimizations
      enableBatchUpdates: true,
      useIncrementalComputation: true
    },
    react: {
      // React 18 features
      useConcurrentMode: true,
      useAutomaticBatching: true
    },
    vue: {
      // Vue 3 optimizations
      useCompositionAPI: true
    },
    svelte: {
      // Svelte 5 runes
      useRunes: true
    }
  },

  // Test data generation
  testData: {
    seed: 12345,          // Random seed for reproducibility
    textLength: 50,       // Length of text fields
    numberRange: [0, 1000], // Range for numeric values
    dateRange: ['2020-01-01', '2025-12-31']
  },

  // Browser configuration
  browser: {
    type: 'chromium',     // chromium, firefox, webkit
    args: [
      '--disable-gpu',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  }
};