import {
  createElement as axiiCreateElement,
  createRoot as createAxiiRoot,
  RxList,
  atom,
  batch,
} from "axii";
import React from "react";
import { createRoot as createReactRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { createApp, defineComponent, h, nextTick, ref } from "vue";
import { createSignal } from "solid-js";
import { createComponent, render as renderSolid } from "solid-js/web";
import html from "solid-js/html";

// 专注内存的基准：稳态保留内存 / clear 后残留 / 反复 create-clear 泄漏 / 长时间更新漂移。
// 所有读数都在强制 GC 之后取 performance.memory.usedJSHeapSize。
const COUNTS = [100, 1000, 5000, 10000];
const COMPONENT_COUNTS = [100, 1000, 5000];
const RETAINED_ITERATIONS = 5;
const LEAK_CYCLES = 30;
const LEAK_COUNT = 1000;
const UPDATE_ROUNDS = 100;
const UPDATE_BATCH = 100;

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

async function forceGarbageCollection() {
  if (typeof window.gc !== "function") return;
  window.gc();
  await new Promise((resolve) => setTimeout(resolve, 0));
  window.gc();
}

async function readHeap() {
  await forceGarbageCollection();
  return performance.memory?.usedJSHeapSize;
}

function median(samples) {
  const sorted = [...samples].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function summarize(samples) {
  return {
    samples,
    median: median(samples),
    min: Math.min(...samples),
    max: Math.max(...samples),
    mean: samples.reduce((sum, value) => sum + value, 0) / samples.length,
  };
}

class VanillaAdapter {
  name = "vanilla";
  items = [];
  rows = [];

  mount(container) {
    this.listEl = document.createElement("div");
    this.listEl.className = "list";
    this.countEl = document.createElement("div");
    this.countEl.className = "count";
    this.countEl.textContent = "Items: 0";
    this.listEl.appendChild(this.countEl);
    container.appendChild(this.listEl);
  }

  async settle() {}

  create(count) {
    this.clear();
    this.items = makeItems(count);
    const fragment = document.createDocumentFragment();
    this.rows = this.items.map((item) => {
      const row = document.createElement("div");
      row.className = "item";
      row.textContent = item.label;
      fragment.appendChild(row);
      return row;
    });
    this.listEl.appendChild(fragment);
    this.countEl.textContent = `Items: ${this.items.length}`;
  }

  update(count, round = 0) {
    const length = this.items.length;
    for (let i = 0; i < Math.min(count, length); i++) {
      const index = updateIndex(i, length);
      const label = `Updated ${round}-${i}`;
      this.items[index] = { ...this.items[index], label };
      this.rows[index].textContent = label;
    }
  }

  clear() {
    this.items = [];
    for (const row of this.rows) row.remove();
    this.rows = [];
    this.countEl.textContent = "Items: 0";
  }

  destroy() {
    this.listEl.remove();
  }
}

// 惯用 axii 用法：每行 label 是独立 atom（细粒度更新，行文本绑定各自的 signal）
class AxiiAdapter {
  name = "axii";

  mount(container) {
    this.items = new RxList([]);
    const List = ({}, { createElement }) => {
      return createElement(
        "div",
        { className: "list" },
        createElement("div", { className: "count" }, () => `Items: ${this.items.length}`),
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
    this.items.clear();
    this.items.push(...makeItems(count).map((item) => ({ ...item, label: atom(item.label) })));
  }

  update(count, round = 0) {
    const length = this.items.length;
    batch(() => {
      for (let i = 0; i < Math.min(count, length); i++) {
        this.items.at(updateIndex(i, length)).label(`Updated ${round}-${i}`);
      }
    });
  }

  clear() {
    this.items.clear();
  }

  destroy() {
    this.root.destroy();
    this.items.destroy?.();
  }
}

// 行文本直接把 atom 作为 child（AtomHost 路径），比函数 child（FunctionHost 路径）少一层分配
class AxiiAtomAdapter {
  name = "axii-atom";

  mount(container) {
    this.items = new RxList([]);
    const List = ({}, { createElement }) => {
      return createElement(
        "div",
        { className: "list" },
        createElement("div", { className: "count" }, () => `Items: ${this.items.length}`),
        this.items.map(
          (item) => createElement("div", { key: item.id, className: "item" }, item.label),
          { skipItemEffect: true }
        )
      );
    };
    this.root = createAxiiRoot(container);
    this.root.render(axiiCreateElement(List, {}));
  }

  async settle() {}

  create(count) {
    this.items.clear();
    this.items.push(...makeItems(count).map((item) => ({ ...item, label: atom(item.label) })));
  }

  update(count, round = 0) {
    const length = this.items.length;
    batch(() => {
      for (let i = 0; i < Math.min(count, length); i++) {
        this.items.at(updateIndex(i, length)).label(`Updated ${round}-${i}`);
      }
    });
  }

  clear() {
    this.items.clear();
  }

  destroy() {
    this.root.destroy();
    this.items.destroy?.();
  }
}

// 数据形态与 react/vue/solid 相同（不可变对象 + 纯字符串 label），更新通过替换行对象完成
class AxiiStaticAdapter {
  name = "axii-static";

  mount(container) {
    this.items = new RxList([]);
    const List = ({}, { createElement }) => {
      return createElement(
        "div",
        { className: "list" },
        createElement("div", { className: "count" }, () => `Items: ${this.items.length}`),
        this.items.map(
          (item) => createElement("div", { key: item.id, className: "item" }, item.label),
          { skipItemEffect: true }
        )
      );
    };
    this.root = createAxiiRoot(container);
    this.root.render(axiiCreateElement(List, {}));
  }

  async settle() {}

  create(count) {
    this.items.clear();
    this.items.push(...makeItems(count));
  }

  update(count, round = 0) {
    const length = this.items.length;
    for (let i = 0; i < Math.min(count, length); i++) {
      const index = updateIndex(i, length);
      const current = this.items.at(index);
      this.items.splice(index, 1, { ...current, label: `Updated ${round}-${i}` });
    }
  }

  clear() {
    this.items.clear();
  }

  destroy() {
    this.root.destroy();
    this.items.destroy?.();
  }
}

class ReactAdapter {
  name = "react";
  items = [];

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
    this.commit(makeItems(count));
  }

  update(count, round = 0) {
    const next = [...this.items];
    for (let i = 0; i < Math.min(count, next.length); i++) {
      const index = updateIndex(i, next.length);
      next[index] = { ...next[index], label: `Updated ${round}-${i}` };
    }
    this.commit(next);
  }

  clear() {
    this.commit([]);
  }

  destroy() {
    this.root.unmount();
  }
}

class VueAdapter {
  name = "vue";
  items = ref([]);

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
    this.items.value = makeItems(count);
  }

  update(count, round = 0) {
    const next = [...this.items.value];
    for (let i = 0; i < Math.min(count, next.length); i++) {
      const index = updateIndex(i, next.length);
      next[index] = { ...next[index], label: `Updated ${round}-${i}` };
    }
    this.items.value = next;
  }

  clear() {
    this.items.value = [];
  }

  destroy() {
    this.app.unmount();
  }
}

class SolidAdapter {
  name = "solid";

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
    this.setItems(makeItems(count));
  }

  update(count, round = 0) {
    this.setItems((items) => {
      const next = [...items];
      for (let i = 0; i < Math.min(count, next.length); i++) {
        const index = updateIndex(i, next.length);
        next[index] = { ...next[index], label: `Updated ${round}-${i}` };
      }
      return next;
    });
  }

  clear() {
    this.setItems([]);
  }

  destroy() {
    this.dispose();
  }
}

// 与 axii 主适配器对应的细粒度用法：每行 label 是独立 signal，行文本直接绑定 signal
class SolidSignalAdapter {
  name = "solid-signal";
  rows = [];

  mount(container) {
    const [items, setItems] = createSignal([]);
    this.items = items;
    this.setItems = setItems;
    this.dispose = renderSolid(
      () =>
        html`<div class="list">
          <div class="count">${() => `Items: ${items().length}`}</div>
          ${() => items().map((item) => html`<div class="item">${() => item.label()}</div>`)}
        </div>`,
      container
    );
  }

  async settle() {}

  create(count) {
    this.setItems(
      makeItems(count).map((item) => {
        const [label, setLabel] = createSignal(item.label);
        return { id: item.id, label, setLabel };
      })
    );
  }

  update(count, round = 0) {
    const items = this.items();
    const length = items.length;
    for (let i = 0; i < Math.min(count, length); i++) {
      items[updateIndex(i, length)].setLabel(`Updated ${round}-${i}`);
    }
  }

  clear() {
    this.setItems([]);
  }

  destroy() {
    this.dispose();
  }
}

const ADAPTERS = {
  vanilla: VanillaAdapter,
  axii: AxiiAdapter,
  "axii-atom": AxiiAtomAdapter,
  "axii-static": AxiiStaticAdapter,
  react: ReactAdapter,
  vue: VueAdapter,
  solid: SolidAdapter,
  "solid-signal": SolidSignalAdapter,
};

// 组件树场景：N 个带局部状态(1 个 signal/state)的叶子组件，测每个组件实例的保留内存
const COMPONENT_TREE_MOUNTERS = {
  vanilla(container, items) {
    const listEl = document.createElement("div");
    listEl.className = "list";
    const states = items.map((item) => {
      const state = { checked: false };
      const row = document.createElement("div");
      row.className = "row";
      const labelEl = document.createElement("span");
      labelEl.textContent = item.label;
      const stateEl = document.createElement("span");
      stateEl.textContent = state.checked ? "on" : "off";
      row.append(labelEl, stateEl);
      listEl.appendChild(row);
      return state;
    });
    container.appendChild(listEl);
    return async () => {
      states.length = 0;
      listEl.remove();
    };
  },

  axii(container, items) {
    const Row = ({ item }, { createElement }) => {
      const checked = atom(false);
      return createElement(
        "div",
        { className: "row" },
        createElement("span", {}, item.label),
        createElement("span", {}, () => (checked() ? "on" : "off"))
      );
    };
    const App = ({}, { createElement }) =>
      createElement(
        "div",
        { className: "list" },
        items.map((item) => createElement(Row, { key: item.id, item }))
      );
    const root = createAxiiRoot(container);
    root.render(axiiCreateElement(App, {}));
    return async () => root.destroy();
  },

  react(container, items) {
    const Row = ({ item }) => {
      const [checked] = React.useState(false);
      return React.createElement(
        "div",
        { className: "row" },
        React.createElement("span", null, item.label),
        React.createElement("span", null, checked ? "on" : "off")
      );
    };
    const App = () =>
      React.createElement(
        "div",
        { className: "list" },
        items.map((item) => React.createElement(Row, { key: item.id, item }))
      );
    const root = createReactRoot(container);
    flushSync(() => root.render(React.createElement(App)));
    return async () => root.unmount();
  },

  vue(container, items) {
    const Row = defineComponent({
      props: ["item"],
      setup(props) {
        const checked = ref(false);
        return () =>
          h("div", { class: "row" }, [
            h("span", props.item.label),
            h("span", checked.value ? "on" : "off"),
          ]);
      },
    });
    const app = createApp({
      render: () =>
        h(
          "div",
          { class: "list" },
          items.map((item) => h(Row, { key: item.id, item }))
        ),
    });
    app.mount(container);
    return async () => {
      app.unmount();
      await nextTick();
    };
  },

  solid(container, items) {
    const Row = (props) => {
      const [checked] = createSignal(false);
      return html`<div class="row">
        <span>${props.item.label}</span>
        <span>${() => (checked() ? "on" : "off")}</span>
      </div>`;
    };
    const dispose = renderSolid(
      () =>
        html`<div class="list">
          ${items.map((item) => createComponent(Row, { item }))}
        </div>`,
      container
    );
    return async () => dispose();
  },
};
COMPONENT_TREE_MOUNTERS["axii-static"] = COMPONENT_TREE_MOUNTERS.axii;

async function measureComponentTree(frameworkName, mountsRoot) {
  const mounter = COMPONENT_TREE_MOUNTERS[frameworkName];
  if (!mounter) return null;

  const result = {};
  for (const count of COMPONENT_COUNTS) {
    const samples = [];
    for (let i = 0; i < RETAINED_ITERATIONS; i++) {
      const container = document.createElement("section");
      mountsRoot.appendChild(container);
      const items = makeItems(count);
      const before = await readHeap();
      const destroy = await mounter(container, items);
      const after = await readHeap();
      await destroy();
      container.remove();
      await forceGarbageCollection();
      samples.push(after - before);
    }
    result[count] = summarize(samples);
  }
  return result;
}

async function measureDataOnly() {
  const result = {};
  for (const count of COUNTS) {
    const samples = [];
    for (let i = 0; i < RETAINED_ITERATIONS; i++) {
      // 挂到 window 上防止 V8 把只写不读的局部变量当作死值提前回收
      window.__DATA_ONLY_KEEP__ = null;
      const before = await readHeap();
      window.__DATA_ONLY_KEEP__ = makeItems(count);
      const after = await readHeap();
      samples.push(after - before);
    }
    window.__DATA_ONLY_KEEP__ = null;
    result[count] = summarize(samples);
  }
  await forceGarbageCollection();
  return result;
}

async function measureRetained(adapter, count) {
  const retainedSamples = [];
  const residualSamples = [];
  const residualAfterRerenderSamples = [];
  for (let i = 0; i < RETAINED_ITERATIONS; i++) {
    adapter.clear();
    await adapter.settle();
    const base = await readHeap();
    adapter.create(count);
    await adapter.settle();
    const afterCreate = await readHeap();
    adapter.clear();
    await adapter.settle();
    const afterClear = await readHeap();
    // 再触发一轮空渲染：区分“真正泄漏”与“双缓冲/延迟释放”（React fiber alternate 等）
    adapter.clear();
    await adapter.settle();
    const afterSecondClear = await readHeap();
    retainedSamples.push(afterCreate - base);
    residualSamples.push(afterClear - base);
    residualAfterRerenderSamples.push(afterSecondClear - base);
  }
  return {
    retained: summarize(retainedSamples),
    residualAfterClear: summarize(residualSamples),
    residualAfterRerender: summarize(residualAfterRerenderSamples),
  };
}

async function measureLeakCycles(adapter) {
  adapter.clear();
  await adapter.settle();
  const before = await readHeap();
  for (let i = 0; i < LEAK_CYCLES; i++) {
    adapter.create(LEAK_COUNT);
    await adapter.settle();
    adapter.clear();
    await adapter.settle();
  }
  const after = await readHeap();
  return { cycles: LEAK_CYCLES, count: LEAK_COUNT, growthBytes: after - before };
}

async function measureUpdateChurn(adapter) {
  adapter.create(LEAK_COUNT);
  await adapter.settle();
  const before = await readHeap();
  for (let round = 0; round < UPDATE_ROUNDS; round++) {
    adapter.update(UPDATE_BATCH, round);
    await adapter.settle();
  }
  const after = await readHeap();
  adapter.clear();
  await adapter.settle();
  return {
    rounds: UPDATE_ROUNDS,
    batch: UPDATE_BATCH,
    listSize: LEAK_COUNT,
    growthBytes: after - before,
  };
}

async function run() {
  const output = document.getElementById("output");
  const params = new URLSearchParams(window.location.search);
  const frameworkName = params.get("framework");
  const Adapter = ADAPTERS[frameworkName];
  if (!Adapter) {
    throw new Error(`Unknown framework "${frameworkName}". Use ?framework=${Object.keys(ADAPTERS).join("|")}`);
  }

  if (typeof performance.memory?.usedJSHeapSize !== "number") {
    throw new Error("performance.memory unavailable; launch Chromium with --enable-precise-memory-info");
  }

  const result = {
    framework: frameworkName,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    settings: {
      counts: COUNTS,
      retainedIterations: RETAINED_ITERATIONS,
      leakCycles: LEAK_CYCLES,
      leakCount: LEAK_COUNT,
      updateRounds: UPDATE_ROUNDS,
      updateBatch: UPDATE_BATCH,
    },
  };

  output.textContent = `Measuring data-only baseline (${frameworkName})`;
  result.dataOnly = await measureDataOnly();

  const container = document.createElement("section");
  container.className = "benchmark-host";
  document.getElementById("mounts").appendChild(container);

  output.textContent = `Mounting ${frameworkName}`;
  const heapBeforeMount = await readHeap();
  const adapter = new Adapter();
  adapter.mount(container);
  await adapter.settle();
  const heapAfterMount = await readHeap();
  result.mountBytes = heapAfterMount - heapBeforeMount;

  // 预热一轮，排除首次 JIT/惰性初始化的一次性分配
  adapter.create(1000);
  await adapter.settle();
  adapter.clear();
  await adapter.settle();

  result.retained = {};
  for (const count of COUNTS) {
    output.textContent = `Measuring retained heap: ${frameworkName} x ${count}`;
    console.log(output.textContent);
    result.retained[count] = await measureRetained(adapter, count);
  }

  output.textContent = `Measuring create/clear leak cycles: ${frameworkName}`;
  console.log(output.textContent);
  result.leakCycles = await measureLeakCycles(adapter);

  output.textContent = `Measuring update churn: ${frameworkName}`;
  console.log(output.textContent);
  result.updateChurn = await measureUpdateChurn(adapter);

  adapter.destroy();
  container.remove();
  await forceGarbageCollection();

  output.textContent = `Measuring component tree: ${frameworkName}`;
  console.log(output.textContent);
  result.componentTree = await measureComponentTree(frameworkName, document.getElementById("mounts"));

  output.textContent = `Done: ${frameworkName}`;
  window.__BENCHMARK_RESULT__ = result;
  window.__BENCHMARK_DONE__ = true;
}

run().catch((error) => {
  window.__BENCHMARK_ERROR__ = String(error?.stack || error);
  document.getElementById("output").textContent = window.__BENCHMARK_ERROR__;
});
