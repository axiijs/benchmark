export interface BenchmarkResult {
  framework: string;
  scenario: string;
  test: string;
  metrics: BenchmarkMetrics;
  timestamp: number;
  environment: BenchmarkEnvironment;
}

export interface BenchmarkMetrics {
  // Timing metrics (in milliseconds)
  timing: {
    total: number;
    average: number;
    min: number;
    max: number;
    median: number;
    p95: number;
    p99: number;
    stdDev: number;
  };
  
  // Memory metrics (in MB)
  memory: {
    initial: number;
    peak: number;
    final: number;
    delta: number;
    gcCount: number;
    gcTime: number;
  };
  
  // Performance metrics
  performance: {
    opsPerSecond: number;
    fps: number[];
    avgFps: number;
    minFps: number;
    scriptTime: number;
    renderTime: number;
    layoutTime: number;
    paintTime: number;
  };
  
  // Web vitals
  vitals?: {
    fcp: number;  // First Contentful Paint
    lcp: number;  // Largest Contentful Paint
    fid: number;  // First Input Delay
    cls: number;  // Cumulative Layout Shift
    tti: number;  // Time to Interactive
    tbt: number;  // Total Blocking Time
  };
}

export interface BenchmarkEnvironment {
  browser: string;
  browserVersion: string;
  os: string;
  cpu: string;
  memory: number;
  nodeVersion: string;
  timestamp: string;
}

export interface BenchmarkConfig {
  framework: string;
  scenario: string;
  test: string;
  iterations: number;
  warmup: number;
  data?: any;
}

export interface TestData {
  id: string | number;
  text: string;
  number: number;
  date: Date;
  selected: boolean;
  nested?: {
    value: string;
    count: number;
  };
}

export type BenchmarkRunner = (config: BenchmarkConfig) => Promise<BenchmarkMetrics>;

export interface FrameworkAdapter {
  name: string;
  version: string;
  setup: () => Promise<void>;
  teardown: () => Promise<void>;
  runTest: (testName: string, data?: any) => Promise<void>;
  getMetrics: () => BenchmarkMetrics;
}

export interface ScenarioDefinition {
  name: string;
  description: string;
  setup?: () => Promise<void>;
  tests: TestDefinition[];
  teardown?: () => Promise<void>;
}

export interface TestDefinition {
  name: string;
  description: string;
  run: (framework: FrameworkAdapter, data?: any) => Promise<void>;
  validate?: (result: any) => boolean;
  data?: () => any;
}

export interface ComparisonResult {
  baseline: string;
  frameworks: FrameworkComparison[];
  winner: string;
  summary: string;
}

export interface FrameworkComparison {
  name: string;
  metrics: BenchmarkMetrics;
  comparison: {
    timing: number;      // Percentage difference from baseline
    memory: number;      // Percentage difference from baseline
    performance: number; // Percentage difference from baseline
  };
  rank: number;
}