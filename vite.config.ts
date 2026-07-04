import { defineConfig } from 'vite';
import path from 'path';

const useLocalData0 = process.env.AXII_BENCHMARK_LOCAL_DATA0 === 'true';
const useSourceAxii = process.env.AXII_BENCHMARK_SOURCE_AXII === 'true';
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
      ...(useLocalData0 || useSourceAxii ? {
        'data0': path.resolve(__dirname, useSourceAxii ? '../data0/src/index.ts' : '../data0/dist/data0.js'),
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