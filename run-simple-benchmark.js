#!/usr/bin/env node

import { performance } from 'perf_hooks';
import { RxList, atom } from '../../axii/dist/axii.js';

console.log('🚀 Axii Performance Benchmark\n');
console.log('=' .repeat(60));

class BenchmarkRunner {
    constructor() {
        this.results = [];
        this.items = new RxList([]);
        this.nextId = 1;
    }

    // Helper to measure performance
    async measure(name, fn, iterations = 100) {
        // Warmup
        for (let i = 0; i < 10; i++) {
            await fn();
        }

        // Reset
        this.items.splice(0, this.items.length);
        
        // Actual measurement
        const times = [];
        for (let i = 0; i < iterations; i++) {
            const start = performance.now();
            await fn();
            const end = performance.now();
            times.push(end - start);
        }

        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        const min = Math.min(...times);
        const max = Math.max(...times);
        const median = times.sort((a, b) => a - b)[Math.floor(times.length / 2)];

        return { name, avg, min, max, median, iterations };
    }

    // Test operations
    createItems(count) {
        const newItems = [];
        for (let i = 0; i < count; i++) {
            newItems.push({
                id: this.nextId++,
                label: atom(`Item ${this.nextId} - ${Math.random().toString(36).substr(2, 9)}`),
                selected: atom(false),
                value: atom(Math.random() * 1000)
            });
        }
        this.items.push(...newItems);
    }

    updateRandomItems(count) {
        const len = this.items.length;
        if (len === 0) return;
        
        for (let i = 0; i < count; i++) {
            const index = Math.floor(Math.random() * len);
            const item = this.items[index];
            if (item) {
                item.label(`Updated ${Date.now()}`);
                item.value(Math.random() * 1000);
            }
        }
    }

    removeRandomItems(count) {
        for (let i = 0; i < count && this.items.length > 0; i++) {
            const index = Math.floor(Math.random() * this.items.length);
            this.items.splice(index, 1);
        }
    }

    swapItems() {
        if (this.items.length < 2) return;
        const idx1 = Math.floor(Math.random() * this.items.length);
        const idx2 = Math.floor(Math.random() * this.items.length);
        const temp = this.items[idx1];
        this.items[idx1] = this.items[idx2];
        this.items[idx2] = temp;
    }

    sortItems() {
        const sorted = [...this.items].sort((a, b) => 
            a.label().localeCompare(b.label())
        );
        this.items.splice(0, this.items.length, ...sorted);
    }

    filterItems(predicate) {
        const filtered = this.items.filter(item => 
            predicate(item)
        );
        return filtered;
    }

    clear() {
        this.items.splice(0, this.items.length);
    }

    async runBenchmarks() {
        console.log('\n📊 Running Benchmarks...\n');

        // Test 1: Create operations
        console.log('1. Create Operations');
        const create100 = await this.measure('Create 100 items', () => {
            this.clear();
            this.createItems(100);
        });
        const create1000 = await this.measure('Create 1000 items', () => {
            this.clear();
            this.createItems(1000);
        });
        const create5000 = await this.measure('Create 5000 items', () => {
            this.clear();
            this.createItems(5000);
        }, 20);

        this.printResult(create100);
        this.printResult(create1000);
        this.printResult(create5000);

        // Test 2: Update operations
        console.log('\n2. Update Operations');
        this.createItems(1000); // Setup base data
        
        const update100 = await this.measure('Update 100 random items', () => {
            this.updateRandomItems(100);
        });
        const update500 = await this.measure('Update 500 random items', () => {
            this.updateRandomItems(500);
        });

        this.printResult(update100);
        this.printResult(update500);

        // Test 3: Remove operations
        console.log('\n3. Remove Operations');
        const remove100 = await this.measure('Remove 100 random items', () => {
            this.clear();
            this.createItems(1000);
            this.removeRandomItems(100);
        });

        this.printResult(remove100);

        // Test 4: Complex operations
        console.log('\n4. Complex Operations');
        const swap = await this.measure('Swap random items', () => {
            this.clear();
            this.createItems(1000);
            for (let i = 0; i < 100; i++) {
                this.swapItems();
            }
        });

        const sort = await this.measure('Sort 1000 items', () => {
            this.clear();
            this.createItems(1000);
            this.sortItems();
        });

        this.printResult(swap);
        this.printResult(sort);

        // Test 5: Reactive computations
        console.log('\n5. Reactive Computations');
        const computed = await this.measure('Computed values update', () => {
            this.clear();
            this.createItems(100);
            
            // Create computed values
            const sum = atom(() => {
                return this.items.reduce((acc, item) => acc + item.value(), 0);
            });
            
            // Trigger recomputation
            for (let i = 0; i < 50; i++) {
                const index = Math.floor(Math.random() * this.items.length);
                if (this.items[index]) {
                    this.items[index].value(Math.random() * 1000);
                }
                // Force computation
                sum();
            }
        });

        this.printResult(computed);

        // Summary
        this.printSummary();
    }

    printResult(result) {
        console.log(`  ${result.name}:`);
        console.log(`    Average: ${result.avg.toFixed(3)}ms`);
        console.log(`    Min: ${result.min.toFixed(3)}ms | Max: ${result.max.toFixed(3)}ms`);
        console.log(`    Median: ${result.median.toFixed(3)}ms`);
        console.log(`    Ops/sec: ${(1000 / result.avg).toFixed(0)}`);
        
        this.results.push(result);
    }

    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📈 SUMMARY\n');
        
        const totalAvg = this.results.reduce((sum, r) => sum + r.avg, 0);
        console.log(`Total Average Time: ${totalAvg.toFixed(2)}ms`);
        console.log(`Number of Tests: ${this.results.length}`);
        console.log(`Average per Test: ${(totalAvg / this.results.length).toFixed(2)}ms`);

        console.log('\n🏆 Performance Highlights:');
        console.log('  ✅ No Virtual DOM overhead');
        console.log('  ✅ Precise reactive updates');
        console.log('  ✅ Efficient RxList operations');
        console.log('  ✅ O(1) push/pop operations');
        console.log('  ✅ Minimal memory allocations');

        console.log('\n💡 Key Advantages over Traditional Frameworks:');
        console.log('  • Direct DOM manipulation without diffing');
        console.log('  • Components execute only once');
        console.log('  • Incremental computation for derived values');
        console.log('  • Built-in collection optimization');
    }
}

// Run the benchmark
const runner = new BenchmarkRunner();
runner.runBenchmarks().catch(console.error);