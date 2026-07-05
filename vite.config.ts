import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

// 只有本地确实存在 ../data0 checkout 时才允许 alias 过去，否则回退到 node_modules 里的 data0，
// 避免 heap:snapshot 等脚本在没有 data0 checkout 的环境里直接构建失败
const localData0Exists = fs.existsSync(path.resolve(__dirname, '../data0/src/index.ts'));
const localData0DistExists = fs.existsSync(path.resolve(__dirname, '../data0/dist/data0.js'));
const useLocalData0 = process.env.AXII_BENCHMARK_LOCAL_DATA0 === 'true' && localData0DistExists;
const useSourceAxii = process.env.AXII_BENCHMARK_SOURCE_AXII === 'true';
const useSourceData0 = useSourceAxii && localData0Exists;
const optimizedDeps = useSourceAxii
  ? ['react', 'react-dom', 'vue', 'solid-js', 'solid-js/web', 'solid-js/html']
  : ['axii', 'data0', 'react', 'react-dom', 'vue', 'solid-js', 'solid-js/web', 'solid-js/html'];

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@frameworks': path.resolve(__dirname, './src/frameworks'),
      '@benchmarks': path.resolve(__dirname, './src/benchmarks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      'axii': path.resolve(__dirname, useSourceAxii ? '../axii/src/index.ts' : '../axii/dist/axii.js'),
      'axii/jsx-runtime': path.resolve(__dirname, useSourceAxii ? '../axii/src/index.ts' : '../axii/dist/axii.js'),
      'axii/jsx-dev-runtime': path.resolve(__dirname, useSourceAxii ? '../axii/src/index.ts' : '../axii/dist/axii.js'),
      ...(useLocalData0 || useSourceData0 ? {
        'data0': path.resolve(__dirname, useSourceData0 ? '../data0/src/index.ts' : '../data0/dist/data0.js'),
      } : {}),
    },
  },
  build: {
    target: 'es2022',
    // BENCH_NO_MINIFY=true 用于 CPU profile 时保留可读的函数名
    minify: process.env.BENCH_NO_MINIFY === 'true' ? false : 'esbuild',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        realBrowserBenchmark: path.resolve(__dirname, 'real-browser-benchmark.html'),
        memoryBenchmark: path.resolve(__dirname, 'memory-benchmark.html'),
      },
      output: {
        manualChunks: {
          'axii': ['axii', 'data0'],
          'react': ['react', 'react-dom'],
          'vue': ['vue'],
          'solid': ['solid-js'],
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
  },
  define: {
    __DEV__: useSourceAxii,
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },
  optimizeDeps: {
    include: optimizedDeps,
  }
});