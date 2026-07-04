import { BenchmarkConfig, BenchmarkMetrics, BenchmarkResult } from '../types/benchmark';

export class BenchmarkRunner {
  private performanceObserver: PerformanceObserver | null = null;
  private metrics: Partial<BenchmarkMetrics> = {};

  constructor() {
    this.setupPerformanceObserver();
  }

  private setupPerformanceObserver() {
    if (typeof PerformanceObserver === 'undefined') return;

    this.performanceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          // Store timing measurements
        }
      }
    });

    this.performanceObserver.observe({ entryTypes: ['measure', 'navigation'] });
  }

  async runBenchmark(
    name: string,
    fn: () => void | Promise<void>,
    config: BenchmarkConfig
  ): Promise<BenchmarkMetrics> {
    const timings: number[] = [];
    const memorySnapshots: any[] = [];
    const fpsReadings: number[] = [];

    // Warmup iterations
    for (let i = 0; i < config.warmup; i++) {
      await fn();
      await this.delay(10);
    }

    // Reset GC if available
    if ((globalThis as any).gc) {
      (globalThis as any).gc();
      await this.delay(100);
    }

    // Capture initial memory
    const initialMemory = this.getMemoryUsage();

    // Main benchmark iterations
    for (let i = 0; i < config.iterations; i++) {
      const startTime = performance.now();
      const startMemory = this.getMemoryUsage();

      // Mark start
      performance.mark(`${name}-start-${i}`);

      // Run the benchmark function
      await fn();

      // Mark end
      performance.mark(`${name}-end-${i}`);
      
      const endTime = performance.now();
      const endMemory = this.getMemoryUsage();

      // Measure
      performance.measure(
        `${name}-${i}`,
        `${name}-start-${i}`,
        `${name}-end-${i}`
      );

      // Record timing
      timings.push(endTime - startTime);

      // Record memory
      memorySnapshots.push({
        before: startMemory,
        after: endMemory,
        delta: endMemory - startMemory
      });

      // Measure FPS if in browser
      if (typeof requestAnimationFrame !== 'undefined') {
        const fps = await this.measureFPS();
        fpsReadings.push(fps);
      }

      // Small delay between iterations
      await this.delay(5);
    }

    // Final memory after all iterations
    const finalMemory = this.getMemoryUsage();

    // Calculate statistics
    const metrics: BenchmarkMetrics = {
      timing: this.calculateTimingStats(timings),
      memory: {
        initial: initialMemory,
        peak: Math.max(...memorySnapshots.map(s => s.after)),
        final: finalMemory,
        delta: finalMemory - initialMemory,
        gcCount: this.getGCCount(),
        gcTime: this.getGCTime()
      },
      performance: {
        opsPerSecond: this.calculateOpsPerSecond(timings),
        fps: fpsReadings,
        avgFps: this.average(fpsReadings),
        minFps: Math.min(...fpsReadings),
        scriptTime: this.getScriptTime(),
        renderTime: this.getRenderTime(),
        layoutTime: this.getLayoutTime(),
        paintTime: this.getPaintTime()
      }
    };

    // Add web vitals if available
    if (typeof window !== 'undefined') {
      metrics.vitals = await this.getWebVitals();
    }

    // Clean up performance marks
    performance.clearMarks();
    performance.clearMeasures();

    return metrics;
  }

  private calculateTimingStats(timings: number[]) {
    const sorted = [...timings].sort((a, b) => a - b);
    const sum = timings.reduce((a, b) => a + b, 0);
    const avg = sum / timings.length;
    
    return {
      total: sum,
      average: avg,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
      stdDev: this.standardDeviation(timings, avg)
    };
  }

  private standardDeviation(values: number[], mean: number): number {
    const squareDiffs = values.map(value => {
      const diff = value - mean;
      return diff * diff;
    });
    const avgSquareDiff = this.average(squareDiffs);
    return Math.sqrt(avgSquareDiff);
  }

  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private calculateOpsPerSecond(timings: number[]): number {
    const avgTimeMs = this.average(timings);
    return avgTimeMs > 0 ? 1000 / avgTimeMs : 0;
  }

  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize / 1048576; // Convert to MB
    }
    return 0;
  }

  private async measureFPS(): Promise<number> {
    return new Promise((resolve) => {
      let lastTime = performance.now();
      let frames = 0;
      const duration = 100; // Measure over 100ms

      const measureFrame = () => {
        const currentTime = performance.now();
        frames++;

        if (currentTime - lastTime >= duration) {
          const fps = (frames * 1000) / (currentTime - lastTime);
          resolve(fps);
        } else {
          requestAnimationFrame(measureFrame);
        }
      };

      requestAnimationFrame(measureFrame);
    });
  }

  private getGCCount(): number {
    // This would need browser-specific implementation
    return 0;
  }

  private getGCTime(): number {
    // This would need browser-specific implementation
    return 0;
  }

  private getScriptTime(): number {
    const entries = performance.getEntriesByType('measure');
    const scriptEntries = entries.filter(e => e.name.includes('script'));
    return scriptEntries.reduce((sum, e) => sum + e.duration, 0);
  }

  private getRenderTime(): number {
    const entries = performance.getEntriesByType('measure');
    const renderEntries = entries.filter(e => e.name.includes('render'));
    return renderEntries.reduce((sum, e) => sum + e.duration, 0);
  }

  private getLayoutTime(): number {
    // Would need to use PerformanceObserver for layout entries
    return 0;
  }

  private getPaintTime(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(e => e.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : 0;
  }

  private async getWebVitals() {
    // This would integrate with web-vitals library
    return {
      fcp: this.getPaintTime(),
      lcp: 0,
      fid: 0,
      cls: 0,
      tti: 0,
      tbt: 0
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  cleanup() {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
  }
}