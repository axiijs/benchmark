import {
  createElement as axiiCreateElement,
  createRoot as createAxiiRoot,
  RxList,
  atom,
  batch,
  disableAxiiRetainedObjectDiagnostics,
  enableAxiiRetainedObjectDiagnostics,
  getAxiiRetainedObjectDiagnosticsSnapshot,
} from "axii";
import React from "react";
import { createRoot as createReactRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { createApp, h, nextTick, ref } from "vue";
import { createSignal } from "solid-js";
import { render as renderSolid } from "solid-js/web";
import html from "solid-js/html";

const ITERATIONS = 8;
const WARMUP = 2;
const BASE_COUNT = 1000;
const TESTS = [
  { name: "create-100", run: (adapter) => adapter.create(100), setup: (adapter) => adapter.clear() },
  { name: "create-1000", run: (adapter) => adapter.create(1000), setup: (adapter) => adapter.clear() },
  { name: "create-5000", run: (adapter) => adapter.create(5000), setup: (adapter) => adapter.clear(), iterations: 3 },
  { name: "append-100", run: (adapter) => adapter.append(100), setup: (adapter) => adapter.create(BASE_COUNT) },
  { name: "update-100", run: (adapter) => adapter.update(100), setup: (adapter) => adapter.create(BASE_COUNT) },
  { name: "remove-100", run: (adapter) => adapter.remove(100), setup: (adapter) => adapter.create(BASE_COUNT) },
  { name: "clear-1000", run: (adapter) => adapter.clear(), setup: (adapter) => adapter.create(BASE_COUNT) },
  { name: "sort-1000", run: (adapter) => adapter.sort(), setup: (adapter) => adapter.create(BASE_COUNT) },
  { name: "swap-2", run: (adapter) => adapter.swap(), setup: (adapter) => adapter.create(BASE_COUNT) },
  { name: "reposition-1", run: (adapter) => adapter.reposition(1), setup: (adapter) => adapter.create(BASE_COUNT) },
  { name: "reposition-100", run: (adapter) => adapter.reposition(100), setup: (adapter) => adapter.create(BASE_COUNT) },
  { name: "move-head-to-tail", run: (adapter) => adapter.move(0, BASE_COUNT - 1, 1), setup: (adapter) => adapter.create(BASE_COUNT) },
  { name: "move-tail-to-head", run: (adapter) => adapter.move(BASE_COUNT - 1, 0, 1), setup: (adapter) => adapter.create(BASE_COUNT) },
  { name: "move-100-forward", run: (adapter) => adapter.move(100, 700, 100), setup: (adapter) => adapter.create(BASE_COUNT) },
  { name: "move-100-backward", run: (adapter) => adapter.move(700, 100, 100), setup: (adapter) => adapter.create(BASE_COUNT) },
  {
    name: "axii-data-only-create-1000",
    run: (adapter) => adapter.createDataOnly(1000),
    setup: (adapter) => adapter.clearDataOnly(),
    frameworks: ["axii"],
    includeInSummary: false,
  },
  {
    name: "axii-host-only-create-1000",
    run: (adapter) => adapter.createStatic(1000),
    setup: (adapter) => {
      adapter.setupStatic();
      adapter.clearStatic();
    },
    frameworks: ["axii"],
    includeInSummary: false,
  },
  {
    name: "axii-static-row-create-1000",
    run: (adapter) => adapter.createStaticRow(1000),
    setup: (adapter) => {
      adapter.setupStaticRow();
      adapter.clearStaticRow();
    },
    frameworks: ["axii"],
    includeInSummary: false,
  },
  {
    name: "axii-signal-row-create-1000",
    run: (adapter) => adapter.create(1000),
    setup: (adapter) => adapter.clear(),
    frameworks: ["axii"],
    includeInSummary: false,
  },
  {
    name: "axii-fine-grained-create-1000",
    run: (adapter) => adapter.create(1000),
    setup: (adapter) => adapter.clear(),
    frameworks: ["axii"],
    includeInSummary: false,
  },
  {
    name: "axii-create-clear-1000-repeat-50",
    run: (adapter) => adapter.repeatCreateClear(1000, 50),
    setup: (adapter) => adapter.clear(),
    frameworks: ["axii"],
    includeInSummary: false,
    iterations: 3,
  },
  {
    name: "axii-data-only-create-clear-1000-repeat-50",
    run: (adapter) => adapter.repeatDataOnlyCreateClear(1000, 50),
    setup: (adapter) => adapter.clearDataOnly(),
    frameworks: ["axii"],
    includeInSummary: false,
    iterations: 3,
  },
  {
    name: "axii-host-only-create-clear-1000-repeat-50",
    run: (adapter) => adapter.repeatStaticCreateClear(1000, 50),
    setup: (adapter) => {
      adapter.setupStatic();
      adapter.clearStatic();
    },
    frameworks: ["axii"],
    includeInSummary: false,
    iterations: 3,
  },
  {
    name: "axii-static-row-create-clear-1000-repeat-50",
    run: (adapter) => adapter.repeatStaticRowCreateClear(1000, 50),
    setup: (adapter) => {
      adapter.setupStaticRow();
      adapter.clearStaticRow();
    },
    frameworks: ["axii"],
    includeInSummary: false,
    iterations: 3,
  },
  {
    name: "axii-create-remove-chunks-1000-repeat-50",
    run: (adapter) => adapter.repeatCreateRemoveChunks(1000, 100, 50),
    setup: (adapter) => adapter.clear(),
    frameworks: ["axii"],
    includeInSummary: false,
    iterations: 3,
  },
  {
    name: "axii-create-remove-999-then-1-repeat-50",
    run: (adapter) => adapter.repeatCreateRemoveAlmostAllThenLast(1000, 50),
    setup: (adapter) => adapter.clear(),
    frameworks: ["axii"],
    includeInSummary: false,
    iterations: 3,
  },
  {
    name: "axii-create-clear-method-1000-repeat-50",
    run: (adapter) => adapter.repeatCreateClearMethod(1000, 50),
    setup: (adapter) => adapter.clear(),
    frameworks: ["axii"],
    includeInSummary: false,
    iterations: 3,
  },
  {
    name: "axii-create-clear-yield-1000-repeat-50",
    run: (adapter) => adapter.repeatCreateClearWithYield(1000, 50),
    setup: (adapter) => adapter.clear(),
    frameworks: ["axii"],
    includeInSummary: false,
    iterations: 3,
  },
  {
    name: "axii-create-clear-gc-1000-repeat-50",
    run: (adapter) => adapter.repeatCreateClearWithGc(1000, 50),
    setup: (adapter) => adapter.clear(),
    frameworks: ["axii"],
    includeInSummary: false,
    iterations: 3,
  },
  {
    name: "axii-append-remove-100-repeat-100",
    run: (adapter) => adapter.repeatAppendRemove(100, 100),
    setup: (adapter) => adapter.create(BASE_COUNT),
    frameworks: ["axii"],
    includeInSummary: false,
    iterations: 3,
  },
  {
    name: "axii-update-text-1000-repeat-100",
    run: (adapter) => adapter.repeatUpdateText(100),
    setup: (adapter) => adapter.create(BASE_COUNT),
    frameworks: ["axii"],
    includeInSummary: false,
    iterations: 3,
  },
  {
    name: "axii-destroy-root-after-create-1000",
    run: (adapter) => adapter.createAndDestroyTemporaryRoot(1000),
    setup: (adapter) => adapter.clear(),
    frameworks: ["axii"],
    includeInSummary: false,
    iterations: 3,
  },
  {
    name: "axii-dynamic-attr-create-1000",
    run: (adapter) => adapter.createDynamicAttr(1000),
    setup: (adapter) => {
      adapter.setupDynamicAttr();
      adapter.clearDynamicAttr();
    },
    frameworks: ["axii"],
    includeInSummary: false,
  },
];

const AXII_RETAINED_DIAGNOSTIC_SCENARIOS = [
  {
    name: "create-1000",
    setup: async (adapter) => adapter.clear(),
    create: async (adapter) => adapter.create(1000),
    clear: async (adapter) => adapter.clear(),
  },
  {
    name: "axii-host-only-create-1000",
    setup: async (adapter) => {
      adapter.setupStatic();
      adapter.clearStatic();
    },
    create: async (adapter) => adapter.createStatic(1000),
    clear: async (adapter) => adapter.clearStatic(),
  },
  {
    name: "axii-static-row-create-1000",
    setup: async (adapter) => {
      adapter.setupStaticRow();
      adapter.clearStaticRow();
    },
    create: async (adapter) => adapter.createStaticRow(1000),
    clear: async (adapter) => adapter.clearStaticRow(),
  },
  {
    name: "axii-signal-row-create-1000",
    setup: async (adapter) => adapter.clear(),
    create: async (adapter) => adapter.create(1000),
    clear: async (adapter) => adapter.clear(),
  },
  {
    name: "axii-dynamic-attr-create-1000",
    setup: async (adapter) => {
      adapter.setupDynamicAttr();
      adapter.clearDynamicAttr();
    },
    create: async (adapter) => adapter.createDynamicAttr(1000),
    clear: async (adapter) => adapter.clearDynamicAttr(),
  },
  {
    name: "axii-destroy-root-after-create-1000",
    setup: async (adapter) => adapter.clear(),
    create: async (adapter) => adapter.createAndDestroyTemporaryRoot(1000),
  },
];

function makeItem(id, labelPrefix = "Item") {
  return {
    id,
    label: `${labelPrefix} ${id} ${(id * 2654435761 >>> 0).toString(36)}`,
  };
}

function makeItems(count, start = 0, labelPrefix = "Item") {
  return Array.from({ length: count }, (_, index) => makeItem(start + index, labelPrefix));
}

function updateIndex(index, length) {
  return (index * 37 + 17) % length;
}

function removeIndex(index, length) {
  return (index * 53 + 11) % length;
}

function repositionIndexes(length, limit) {
  const safeLimit = Math.min(limit, length);
  const start = Math.min(17 % length, length - safeLimit);
  const newStart = Math.min(733 % length, length - safeLimit);
  return { start, newStart, limit: safeLimit };
}

function moveItems(items, limit) {
  if (items.length < 2) return items;
  const { start, newStart, limit: safeLimit } = repositionIndexes(items.length, limit);
  return moveItemsByIndexes(items, start, newStart, safeLimit);
}

function moveItemsByIndexes(items, start, newStart, limit = 1) {
  if (items.length < 2 || start === newStart) return items;
  if (start < 0 || newStart < 0 || limit <= 0 || start + limit > items.length || newStart + limit > items.length) {
    return items;
  }
  const next = [...items];
  const moved = next.splice(start, limit);
  next.splice(newStart, 0, ...moved);
  return next;
}

function summarize(samples) {
  const sorted = [...samples].sort((a, b) => a - b);
  const sum = samples.reduce((total, value) => total + value, 0);
  const mean = sum / samples.length;
  const variance = samples.reduce((total, value) => total + (value - mean) ** 2, 0) / samples.length;
  return {
    iterations: samples.length,
    mean,
    median: sorted[Math.floor(sorted.length / 2)],
    min: sorted[0],
    max: sorted[sorted.length - 1],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    p99: sorted[Math.floor(sorted.length * 0.99)],
    stddev: Math.sqrt(variance),
    samples,
  };
}

async function forceGarbageCollection() {
  if (typeof window.gc !== "function") return;
  window.gc();
  await new Promise((resolve) => setTimeout(resolve, 0));
  window.gc();
}

async function readUsedJsHeapSize() {
  await forceGarbageCollection();
  return performance.memory?.usedJSHeapSize;
}

async function readRetainedDiagnosticsSnapshot() {
  await forceGarbageCollection();
  return getAxiiRetainedObjectDiagnosticsSnapshot();
}

async function measure(test, adapter) {
  const iterations = test.iterations ?? ITERATIONS;

  for (let i = 0; i < WARMUP; i++) {
    await test.setup(adapter);
    await adapter.settle();
    await test.run(adapter);
    await adapter.settle();
  }

  const samples = [];
  const memorySamples = [];
  for (let i = 0; i < iterations; i++) {
    await test.setup(adapter);
    await adapter.settle();
    const memoryBefore = await readUsedJsHeapSize();
    const start = performance.now();
    await test.run(adapter);
    await adapter.settle();
    samples.push(performance.now() - start);
    const memoryAfter = await readUsedJsHeapSize();
    if (memoryBefore !== undefined && memoryAfter !== undefined) {
      memorySamples.push(memoryAfter - memoryBefore);
    }
  }

  const summary = summarize(samples);
  if (memorySamples.length > 0) {
    summary.memory = {
      unit: "bytes",
      metric: "usedJSHeapSizeDelta",
      ...summarize(memorySamples),
    };
  }
  return summary;
}

async function collectAxiiRetainedDiagnostics(adapter) {
  const scenarios = {};

  for (const scenario of AXII_RETAINED_DIAGNOSTIC_SCENARIOS) {
    await scenario.setup(adapter);
    await adapter.settle();
    enableAxiiRetainedObjectDiagnostics({ reset: true });
    const snapshots = {
      baseline: await readRetainedDiagnosticsSnapshot(),
    };

    try {
      await scenario.create(adapter);
      await adapter.settle();
      snapshots.afterCreate = await readRetainedDiagnosticsSnapshot();

      if (scenario.clear) {
        await scenario.clear(adapter);
        await adapter.settle();
        snapshots.afterClear = await readRetainedDiagnosticsSnapshot();
      } else {
        snapshots.afterDestroy = await readRetainedDiagnosticsSnapshot();
      }
    } finally {
      disableAxiiRetainedObjectDiagnostics();
      await scenario.setup(adapter);
      await adapter.settle();
    }

    scenarios[scenario.name] = snapshots;
  }

  return scenarios;
}

function createContainer(name) {
  const host = document.createElement("section");
  host.className = "benchmark-host";
  host.dataset.framework = name;
  document.getElementById("mounts").appendChild(host);
  return host;
}

class AxiiAdapter {
  name = "axii";
  items = new RxList([]);
  dataOnlyItems = new RxList([]);
  staticItems = new RxList([]);
  staticRowItems = new RxList([]);
  dynamicAttrItems = new RxList([]);
  nextId = 0;
  staticNextId = 0;

  mount(container) {
    this.container = container;
    const List = ({}, { createElement }) => {
      return createElement(
        "div",
        { className: "list" },
        createElement("div", { className: "count" }, () => `Items: ${this.items.length}`),
        // skipItemEffect: 行映射函数没有直接读取响应式依赖（label 是延迟读取的），
        // 用 data0 的公开选项跳过每行的 map effect 分配
        this.items.map(
          (item) => createElement("div", { key: item.id, className: "item" }, () => item.label()),
          { skipItemEffect: true }
        )
      );
    };
    this.root = createAxiiRoot(container);
    this.root.render(axiiCreateElement(List, {}));
  }

  async settle() {}

  create(count) {
    this.nextId = 0;
    this.items.clear();
    this.items.push(...makeItems(count).map((item) => ({ ...item, label: atom(item.label) })));
    this.nextId = count;
  }

  setupStatic() {
    if (this.staticRoot) return;
    this.staticContainer = document.createElement("section");
    this.staticContainer.className = "diagnostic-host-only";
    this.container.appendChild(this.staticContainer);
    const StaticList = ({}, { createElement }) => {
      return createElement(
        "div",
        { className: "static-list" },
        this.staticItems.map(
          (item) => createElement("div", { key: item.id, className: "item" }, item.label),
          { skipItemEffect: true }
        )
      );
    };
    this.staticRoot = createAxiiRoot(this.staticContainer);
    this.staticRoot.render(axiiCreateElement(StaticList, {}));
  }

  setupStaticRow() {
    if (this.staticRowRoot) return;
    this.staticRowContainer = document.createElement("section");
    this.staticRowContainer.className = "diagnostic-static-row";
    this.container.appendChild(this.staticRowContainer);
    const StaticRowList = ({}, { createElement }) => {
      return createElement(
        "div",
        { className: "list" },
        createElement("div", { className: "count" }, () => `Items: ${this.staticRowItems.length}`),
        this.staticRowItems.map(
          (item) => createElement("div", { key: item.id, className: "item" }, item.label),
          { skipItemEffect: true }
        )
      );
    };
    this.staticRowRoot = createAxiiRoot(this.staticRowContainer);
    this.staticRowRoot.render(axiiCreateElement(StaticRowList, {}));
  }

  setupDynamicAttr() {
    if (this.dynamicAttrRoot) return;
    this.dynamicAttrContainer = document.createElement("section");
    this.dynamicAttrContainer.className = "diagnostic-dynamic-attr";
    this.container.appendChild(this.dynamicAttrContainer);
    const DynamicAttrList = ({}, { createElement }) => {
      return createElement(
        "div",
        { className: "list" },
        this.dynamicAttrItems.map(
          (item) => createElement("div", { key: item.id, className: () => item.className() }, item.label),
          { skipItemEffect: true }
        )
      );
    };
    this.dynamicAttrRoot = createAxiiRoot(this.dynamicAttrContainer);
    this.dynamicAttrRoot.render(axiiCreateElement(DynamicAttrList, {}));
  }

  createDataOnly(count) {
    this.dataOnlyItems.push(...makeItems(count));
  }

  clearDataOnly() {
    this.dataOnlyItems.clear();
  }

  createStatic(count) {
    this.staticNextId = count;
    this.staticItems.push(...makeItems(count));
  }

  clearStatic() {
    this.staticNextId = 0;
    this.staticItems.clear();
  }

  createStaticRow(count) {
    this.staticRowItems.push(...makeItems(count));
  }

  clearStaticRow() {
    this.staticRowItems.clear();
  }

  createDynamicAttr(count) {
    this.dynamicAttrItems.push(
      ...makeItems(count).map((item) => ({
        ...item,
        className: atom(item.id % 2 === 0 ? "item even" : "item odd"),
      }))
    );
  }

  clearDynamicAttr() {
    this.dynamicAttrItems.clear();
  }

  repeatCreateClear(count, repeats) {
    for (let i = 0; i < repeats; i++) {
      this.create(count);
      this.clear();
    }
  }

  repeatDataOnlyCreateClear(count, repeats) {
    for (let i = 0; i < repeats; i++) {
      this.createDataOnly(count);
      this.clearDataOnly();
    }
  }

  repeatStaticCreateClear(count, repeats) {
    for (let i = 0; i < repeats; i++) {
      this.createStatic(count);
      this.clearStatic();
    }
  }

  repeatStaticRowCreateClear(count, repeats) {
    for (let i = 0; i < repeats; i++) {
      this.createStaticRow(count);
      this.clearStaticRow();
    }
  }

  repeatCreateRemoveChunks(count, chunkSize, repeats) {
    for (let i = 0; i < repeats; i++) {
      this.create(count);
      while (this.items.length > 0) {
        this.items.splice(0, Math.min(chunkSize, this.items.length));
      }
    }
  }

  repeatCreateRemoveAlmostAllThenLast(count, repeats) {
    for (let i = 0; i < repeats; i++) {
      this.create(count);
      this.items.splice(0, count - 1);
      this.items.splice(0, 1);
    }
  }

  repeatCreateClearMethod(count, repeats) {
    for (let i = 0; i < repeats; i++) {
      this.create(count);
      this.clearByMethod();
    }
  }

  async repeatCreateClearWithYield(count, repeats) {
    for (let i = 0; i < repeats; i++) {
      this.create(count);
      this.clear();
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  async repeatCreateClearWithGc(count, repeats) {
    for (let i = 0; i < repeats; i++) {
      this.create(count);
      this.clear();
      await forceGarbageCollection();
    }
  }

  repeatAppendRemove(count, repeats) {
    for (let i = 0; i < repeats; i++) {
      this.append(count);
      this.items.splice(Math.max(0, this.items.length - count), count);
    }
  }

  repeatUpdateText(repeats) {
    const length = this.items.length;
    for (let round = 0; round < repeats; round++) {
      batch(() => {
        for (let index = 0; index < length; index++) {
          this.items.at(index).label(`Updated ${round}-${index}`);
        }
      });
    }
  }

  createAndDestroyTemporaryRoot(count) {
    const tempContainer = document.createElement("section");
    tempContainer.className = "diagnostic-destroy-root";
    this.container.appendChild(tempContainer);
    const tempItems = new RxList([]);
    const TempList = ({}, { createElement }) => createElement(
      "div",
      { className: "list" },
      tempItems.map(
        (item) => createElement("div", { key: item.id, className: "item" }, () => item.label()),
        { skipItemEffect: true }
      )
    );
    const tempRoot = createAxiiRoot(tempContainer);
    tempRoot.render(axiiCreateElement(TempList, {}));
    tempItems.push(...makeItems(count).map((item) => ({ ...item, label: atom(item.label) })));
    tempRoot.destroy();
    tempItems.clear();
    tempItems.destroy();
    tempContainer.remove();
  }

  append(count) {
    const start = this.nextId;
    this.items.push(...makeItems(count, start, "Append").map((item) => ({ ...item, label: atom(item.label) })));
    this.nextId += count;
  }

  update(count) {
    const length = this.items.length;
    batch(() => {
      for (let i = 0; i < Math.min(count, length); i++) {
        this.items.at(updateIndex(i, length)).label(`Updated ${i}`);
      }
    });
  }

  remove(count) {
    const start = Math.min(removeIndex(0, this.items.length), Math.max(0, this.items.length - count));
    this.items.splice(start, Math.min(count, this.items.length - start));
  }

  clear() {
    this.items.clear();
  }

  clearByMethod() {
    const length = this.items.length;
    if (length > 1) {
      this.items.splice(0, length - 1);
    }
    if (this.items.length) {
      this.items.splice(0, 1);
    }
  }

  sort() {
    this.items.sortSelf((a, b) => b.label().localeCompare(a.label()));
  }

  swap() {
    if (this.items.length < 2) return;
    const a = 17 % this.items.length;
    const b = 733 % this.items.length;
    this.items.swap(a, b);
  }

  reposition(limit) {
    if (this.items.length < 2) return;
    const indexes = repositionIndexes(this.items.length, limit);
    this.items.reposition(indexes.start, indexes.newStart, indexes.limit);
  }

  move(start, newStart, limit) {
    if (this.items.length < 2) return;
    this.items.reposition(start, newStart, limit);
  }

  destroy() {
    this.root?.destroy?.();
    this.staticRoot?.destroy?.();
    this.staticRowRoot?.destroy?.();
    this.dynamicAttrRoot?.destroy?.();
    this.staticContainer?.remove();
    this.staticRowContainer?.remove();
    this.dynamicAttrContainer?.remove();
  }
}

class ReactAdapter {
  name = "react";
  items = [];
  nextId = 0;

  mount(container) {
    this.root = createReactRoot(container);
    this.render();
  }

  commit(items) {
    this.items = items;
    flushSync(() => this.render());
  }

  render() {
    this.root.render(
      React.createElement(
        "div",
        { className: "list" },
        React.createElement("div", { className: "count" }, `Items: ${this.items.length}`),
        this.items.map((item) => React.createElement("div", { key: item.id, className: "item" }, item.label))
      )
    );
  }

  async settle() {}

  create(count) {
    this.nextId = count;
    this.commit(makeItems(count));
  }

  append(count) {
    const start = this.nextId;
    this.nextId += count;
    this.commit([...this.items, ...makeItems(count, start, "Append")]);
  }

  update(count) {
    const next = [...this.items];
    for (let i = 0; i < Math.min(count, next.length); i++) {
      const index = updateIndex(i, next.length);
      next[index] = { ...next[index], label: `Updated ${i}` };
    }
    this.commit(next);
  }

  remove(count) {
    const next = [...this.items];
    const start = Math.min(removeIndex(0, next.length), Math.max(0, next.length - count));
    next.splice(start, Math.min(count, next.length - start));
    this.commit(next);
  }

  clear() {
    this.commit([]);
  }

  sort() {
    this.commit([...this.items].sort((a, b) => b.label.localeCompare(a.label)));
  }

  swap() {
    if (this.items.length < 2) return;
    const next = [...this.items];
    const a = 17 % next.length;
    const b = 733 % next.length;
    [next[a], next[b]] = [next[b], next[a]];
    this.commit(next);
  }

  reposition(limit) {
    this.commit(moveItems(this.items, limit));
  }

  move(start, newStart, limit) {
    this.commit(moveItemsByIndexes(this.items, start, newStart, limit));
  }

  destroy() {
    this.root.unmount();
  }
}

class VueAdapter {
  name = "vue";
  items = ref([]);
  nextId = 0;

  mount(container) {
    this.app = createApp({
      setup: () => ({ items: this.items }),
      render() {
        return h("div", { class: "list" }, [
          h("div", { class: "count" }, `Items: ${this.items.length}`),
          ...this.items.map((item) => h("div", { key: item.id, class: "item" }, item.label)),
        ]);
      },
    });
    this.app.mount(container);
  }

  async settle() {
    await nextTick();
  }

  create(count) {
    this.nextId = count;
    this.items.value = makeItems(count);
  }

  append(count) {
    const start = this.nextId;
    this.nextId += count;
    this.items.value = [...this.items.value, ...makeItems(count, start, "Append")];
  }

  update(count) {
    const next = [...this.items.value];
    for (let i = 0; i < Math.min(count, next.length); i++) {
      const index = updateIndex(i, next.length);
      next[index] = { ...next[index], label: `Updated ${i}` };
    }
    this.items.value = next;
  }

  remove(count) {
    const next = [...this.items.value];
    const start = Math.min(removeIndex(0, next.length), Math.max(0, next.length - count));
    next.splice(start, Math.min(count, next.length - start));
    this.items.value = next;
  }

  clear() {
    this.items.value = [];
  }

  sort() {
    this.items.value = [...this.items.value].sort((a, b) => b.label.localeCompare(a.label));
  }

  swap() {
    if (this.items.value.length < 2) return;
    const next = [...this.items.value];
    const a = 17 % next.length;
    const b = 733 % next.length;
    [next[a], next[b]] = [next[b], next[a]];
    this.items.value = next;
  }

  reposition(limit) {
    this.items.value = moveItems(this.items.value, limit);
  }

  move(start, newStart, limit) {
    this.items.value = moveItemsByIndexes(this.items.value, start, newStart, limit);
  }

  destroy() {
    this.app.unmount();
  }
}

class SolidAdapter {
  name = "solid";
  nextId = 0;

  mount(container) {
    const [items, setItems] = createSignal([]);
    this.items = items;
    this.setItems = setItems;
    this.dispose = renderSolid(
      () =>
        html`<div class="list">
          <div class="count">${() => `Items: ${items().length}`}</div>
          ${() => items().map((item) => html`<div class="item">${item.label}</div>`)}
        </div>`,
      container
    );
  }

  async settle() {}

  create(count) {
    this.nextId = count;
    this.setItems(makeItems(count));
  }

  append(count) {
    const start = this.nextId;
    this.nextId += count;
    this.setItems((items) => [...items, ...makeItems(count, start, "Append")]);
  }

  update(count) {
    this.setItems((items) => {
      const next = [...items];
      for (let i = 0; i < Math.min(count, next.length); i++) {
        const index = updateIndex(i, next.length);
        next[index] = { ...next[index], label: `Updated ${i}` };
      }
      return next;
    });
  }

  remove(count) {
    this.setItems((items) => {
      const next = [...items];
      const start = Math.min(removeIndex(0, next.length), Math.max(0, next.length - count));
      next.splice(start, Math.min(count, next.length - start));
      return next;
    });
  }

  clear() {
    this.setItems([]);
  }

  sort() {
    this.setItems((items) => [...items].sort((a, b) => b.label.localeCompare(a.label)));
  }

  swap() {
    this.setItems((items) => {
      if (items.length < 2) return items;
      const next = [...items];
      const a = 17 % next.length;
      const b = 733 % next.length;
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
  }

  reposition(limit) {
    this.setItems((items) => moveItems(items, limit));
  }

  move(start, newStart, limit) {
    this.setItems((items) => moveItemsByIndexes(items, start, newStart, limit));
  }

  destroy() {
    this.dispose();
  }
}

const ADAPTERS = [AxiiAdapter, ReactAdapter, VueAdapter, SolidAdapter];

function createAxiiHeapSnapshotHarness() {
  return {
    adapter: null,
    container: null,
    mount() {
      if (this.adapter) return;
      this.adapter = new AxiiAdapter();
      this.container = createContainer("axii-heap-snapshot");
      this.adapter.mount(this.container);
    },
    async settle() {
      await this.adapter?.settle();
      await forceGarbageCollection();
    },
    async create(count) {
      this.adapter.create(count);
      await this.settle();
    },
    async clear() {
      this.adapter.clear();
      await this.settle();
    },
    async setupStatic() {
      this.adapter.setupStatic();
      await this.settle();
    },
    async createStatic(count) {
      this.adapter.createStatic(count);
      await this.settle();
    },
    async clearStatic() {
      this.adapter.clearStatic();
      await this.settle();
    },
    async setupStaticRow() {
      this.adapter.setupStaticRow();
      await this.settle();
    },
    async createStaticRow(count) {
      this.adapter.createStaticRow(count);
      await this.settle();
    },
    async clearStaticRow() {
      this.adapter.clearStaticRow();
      await this.settle();
    },
    async setupDynamicAttr() {
      this.adapter.setupDynamicAttr();
      await this.settle();
    },
    async createDynamicAttr(count) {
      this.adapter.createDynamicAttr(count);
      await this.settle();
    },
    async clearDynamicAttr() {
      this.adapter.clearDynamicAttr();
      await this.settle();
    },
    async createDataOnly(count) {
      this.adapter.createDataOnly(count);
      await this.settle();
    },
    async clearDataOnly() {
      this.adapter.clearDataOnly();
      await this.settle();
    },
    async createAndDestroyTemporaryRoot(count) {
      this.adapter.createAndDestroyTemporaryRoot(count);
      await this.settle();
    },
    async destroy() {
      this.adapter?.destroy();
      this.container?.remove();
      this.adapter = null;
      this.container = null;
      await forceGarbageCollection();
    },
  };
}

async function run() {
  const output = document.getElementById("output");
  const frameworkFilter = new URLSearchParams(window.location.search).get("framework");
  const result = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    settings: {
      iterations: ITERATIONS,
      warmup: WARMUP,
      baseCount: BASE_COUNT,
      tests: TESTS.map(({ name, includeInSummary }) => ({ name, includeInSummary })),
    },
    tests: {},
  };

  for (const Adapter of ADAPTERS) {
    const adapter = new Adapter();
    if (frameworkFilter && adapter.name !== frameworkFilter) continue;
    const container = createContainer(adapter.name);
    adapter.mount(container);
    result.tests[adapter.name] = {};

    for (const test of TESTS) {
      if (test.frameworks && !test.frameworks.includes(adapter.name)) continue;
      output.textContent = `Running ${adapter.name} / ${test.name}`;
      console.log(output.textContent);
      result.tests[adapter.name][test.name] = await measure(test, adapter);
      console.log(`Finished ${adapter.name} / ${test.name}: ${result.tests[adapter.name][test.name].mean.toFixed(3)}ms`);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    if (adapter.name === "axii") {
      output.textContent = "Collecting axii retained object diagnostics";
      console.log(output.textContent);
      result.diagnostics = {
        ...(result.diagnostics ?? {}),
        axiiRetainedObjects: await collectAxiiRetainedDiagnostics(adapter),
      };
    }

    adapter.destroy();
    container.remove();
  }

  output.textContent = "Benchmark complete";
  window.__BENCHMARK_RESULT__ = result;
  window.__BENCHMARK_DONE__ = true;
}

if (new URLSearchParams(window.location.search).get("mode") === "heap-snapshot") {
  window.__AXII_HEAP_SNAPSHOT_HARNESS__ = createAxiiHeapSnapshotHarness();
  window.__BENCHMARK_DONE__ = true;
  document.getElementById("output").textContent = "Axii heap snapshot harness ready";
} else {
  run().catch((error) => {
    window.__BENCHMARK_ERROR__ = String(error?.stack || error);
    document.getElementById("output").textContent = window.__BENCHMARK_ERROR__;
  });
}
