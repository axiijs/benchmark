# Axii 内存使用深度分析（对比 React / Vue / Solid）

生成时间：2026-07-05。所有数据来自本仓库 `npm run benchmark:memory`（`scripts/run-memory-benchmark.js` + `src/memory-benchmark.js`）的真实测量，非模拟数据。

## 测量方法

- 浏览器：Playwright Headless Chromium 148，启动参数 `--enable-precise-memory-info --js-flags=--expose-gc`。
- 指标：`performance.memory.usedJSHeapSize`，每次读数前强制两轮 `window.gc()`，读的是**GC 后保留堆**（retained heap），不是瞬时分配量。
- 隔离：每个框架用独立的新页面测量，互不污染；每个场景先跑一轮预热排除首次 JIT/惰性初始化的一次性分配。
- 取值：每个数据点 5 次迭代取中位数。
- 版本：axii 3.9.2（本地构建，生产 dist）、data0 2.0.0、react 18.3.1、vue 3.5.34、solid-js 1.9.13。

被测变体说明：

| 变体 | 含义 |
| --- | --- |
| vanilla | 直接 DOM 操作，无框架，作为地板线 |
| axii | 惯用细粒度写法：行 label 为独立 `atom`，行文本绑定函数 child `() => item.label()`（FunctionHost 路径） |
| axii-atom | 行文本直接把 atom 作为 child（AtomHost 路径），少一层 FunctionHost |
| axii-static | 行内容为纯字符串（无每行响应式绑定），更新走 `splice` 整行替换 |
| react | 不可变数据 + `flushSync` 全量 re-render（惯用写法） |
| vue | `ref` + 渲染函数（惯用写法） |
| solid | 行文本为静态插值（Solid 编译语义下天然静态） |
| solid-signal | 与 axii 主变体对等：每行 label 是独立 signal，行文本绑定 signal |

## 一、稳态保留内存：渲染 N 行列表

GC 后保留堆增量（含数据本身；数据基线约 84B/行，见下）：

| Rows | vanilla | axii | axii-atom | axii-static | react | vue | solid | solid-signal |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 0.010MB (104B/行) | 0.103MB (1077B/行) | 0.088MB (924B/行) | 0.032MB (339B/行) | 0.027MB (287B/行) | 0.052MB (549B/行) | 0.010MB (105B/行) | 0.046MB (487B/行) |
| 1000 | 0.103MB (108B/行) | 0.928MB (973B/行) | 0.814MB (854B/行) | 0.242MB (254B/行) | 0.292MB (306B/行) | 0.512MB (537B/行) | 0.110MB (115B/行) | 0.474MB (497B/行) |
| 5000 | 0.515MB (108B/行) | 4.640MB (973B/行) | 4.072MB (854B/行) | 1.203MB (252B/行) | 1.467MB (308B/行) | 2.563MB (537B/行) | 0.521MB (109B/行) | 2.340MB (491B/行) |
| 10000 | 1.030MB (108B/行) | 9.277MB (973B/行) | 8.167MB (856B/行) | 2.410MB (253B/行) | 2.935MB (308B/行) | 5.113MB (536B/行) | 1.030MB (108B/行) | 4.655MB (488B/行) |

纯数据基线（同样的 `{id, label}` 对象数组，无任何框架参与）：1000 行 ≈ 0.084MB，即约 **84B/行** 是数据本身，其余才是框架开销。

所有框架的增长都是严格线性的（100 → 10000 行的每行成本几乎不变），没有超线性膨胀。

**换算成纯框架开销（减去 84–108B 数据/DOM 引用基线）后，每行开销排序：**

1. solid（静态文本）≈ 0B —— 编译期把静态插值直接变成 DOM 操作，运行时不留任何行级对象
2. axii-static ≈ 145B —— 每行一个 `CompactElementHost`
3. react ≈ 200B —— 每行一个 fiber（含 alternate 摊销）+ element 对象
4. solid-signal ≈ 380B —— 每行一个 signal + 一个 text effect
5. vue ≈ 430B —— 每行一个 vnode + 保留的旧 vnode 引用 + 响应式记账
6. axii-atom ≈ 745B —— 每行 CompactElementHost + AtomHost + LightBindingEffect + atom + dep
7. axii（函数 child）≈ 865B —— 上者再加一层 FunctionHost + DeferredBindingEffect

### Axii 每行内存的组成（由保留对象诊断证实）

`benchmark:real` 的 retained diagnostics（`create-1000` 场景）显示，1000 行细粒度列表在存活期恰好持有：

- 1000 个 `CompactElementHost`（行元素宿主）
- 1000 个 `FunctionHost`（函数 child 宿主）+ 1000 个 `FunctionNodeBinding`（DeferredBindingEffect）
- 1000 个活跃 `LightBindingEffect` + 1000 个 primitive atom dep

对照三个 axii 变体的实测差值可以直接给每个部件"称重"：

| 部件 | 每行成本 |
| --- | ---: |
| CompactElementHost（无绑定的行宿主） | ≈ 145B |
| + atom + AtomHost + LightBindingEffect + dep（atom child 路径） | ≈ +600B |
| + FunctionHost + DeferredBindingEffect（函数 child 路径，替代 AtomHost） | ≈ +120B |

即：**一个"可独立更新的文本绑定"在 axii 中约花 700–720B，同等语义在 Solid 中约花 380B**（solid-signal 与 solid 的差值）。这是 axii 与 Solid 差距的全部来源——宿主结构本身（axii-static 的 145B/行）并不比 React 的 fiber 重。

## 二、组件树：N 个带局部状态的叶子组件

每个叶子组件含 1 个局部 signal/state 和 2 个 span：

| Components | axii | react | vue | solid |
| ---: | ---: | ---: | ---: | ---: |
| 1000 | 2.25MB (2355B/个) | 0.79MB (825B/个) | 1.82MB (1907B/个) | 0.28MB (291B/个) |
| 5000 | 11.23MB (2355B/个) | 3.87MB (812B/个) | 8.91MB (1868B/个) | 1.38MB (290B/个) |

这是 axii 目前**最弱的场景**：每个组件实例 ≈ 2.35KB，是 Solid 的 8 倍、React 的 2.9 倍、Vue 的 1.23 倍。

原因在 `ComponentHost`（axii `src/ComponentHost.ts`）：每个实例无条件预分配

- 4 个 `Set`（`layoutEffects` / `effects` / `destroyCallback` / `layoutEffectDestroyHandles`）
- 4 个对象/数组（`refs` / `itemConfig` / `exposed` / `frame`）
- 每实例 `bind` 出来的 `createElement` / `createSVGElement` 闭包，以及整个 `renderContext`
- 加上组件内部结构本身的 StaticHost/占位符

其中大部分成员在典型小组件里从未被用到。Solid 的组件在运行时只是一次函数调用（无实例对象），React 是 2 个 fiber + hook 链表，Vue 是 instance + proxy + vnode——axii 是四者中唯一为"可能用到的能力"提前付费的。

## 三、清空后的残留与泄漏检测

渲染 N 行 → 清空 → 强制 GC 后，相对基线的残留：

| Rows | axii | react | vue | solid |
| ---: | ---: | ---: | ---: | ---: |
| 1000 | 5.6KB | 254.1KB | 0.4KB | 7.2KB |
| 10000 | 0.0KB | 2460.3KB | 0.0KB | 0.0KB |

再触发一轮空渲染后（区分"真泄漏"与 React 双缓冲 fiber 的延迟释放）：

| Rows | axii | react | vue | solid |
| ---: | ---: | ---: | ---: | ---: |
| 10000 | 0.0KB | 1171.7KB | 0.0KB | 0.0KB |

- **axii 的销毁路径是干净的**：`RxList.clear()` 之后 host/effect/dep 全部释放，残留 ≤ 若干 KB 且不随 N 增长；retained diagnostics 的 afterClear 全部归零（hosts/bindings/effects/deps 均为 0）。`root.destroy()` 场景同样归零。
- React 的残留随 N 线性增长（~120–250B/行），一部分是双缓冲 fiber 树的延迟释放（再渲染一轮后减半），但在本压测窗口内始终有 ~117B/行 未返还。这不代表 React 应用必然泄漏（后续渲染会逐步复用/释放），但**说明 React 的"已卸载内容"归还时机显著晚于其他三者**。
- 也说明旧的 `benchmark:real` 中 create 场景的 heap delta 对 React 系统性偏低：它的测量起点（clear 之后）还压着上一轮的 fiber 树,新一轮 create 复用了这些内存。本套件从真正干净的基线起测，修正了这一偏差。

## 四、长时间运行的增长（泄漏压测）

| 指标 | vanilla | axii | react | vue | solid |
| --- | ---: | ---: | ---: | ---: | ---: |
| 空应用挂载 | 1.1KB | 123.8KB | 96.8KB | 101.1KB | 52.3KB |
| 30 次 create/clear 1000 行后净增 | 6.6KB | 21.1KB | 266.8KB | 777.2KB | 16.0KB |
| 100 轮 × 更新 100/1000 行后净增 | 6.7KB | 20.3KB | 130.5KB | 34.9KB | -112.8KB |

- axii 反复建删 3 万行 DOM 后净增仅 ~21KB（≈0.7KB/轮，多为分配器/字符串驻留噪声），**无泄漏迹象**；高频文本更新 1 万次后净增 ~20KB，同样干净。
- vue 在 create/clear 循环中累计了 ~777KB（约 26B/行·轮），量级不大但可复现；react 累计 ~267KB，与其延迟释放行为一致。
- 空应用基线：axii 124KB，处于 react（97KB）/vue（101KB）同一量级，约为 solid（52KB）的 2.4 倍，绝对值对任何真实应用都可忽略。

## 五、代码体积（本 benchmark 构建产物,含各框架 runtime）

| chunk | minified | gzip |
| --- | ---: | ---: |
| solid（含 html 模板库） | 27.0KB | 10.6KB |
| vue | 59.9KB | 23.8KB |
| axii + data0 | 102.4KB | 29.5KB |
| react + react-dom | 141.0KB | 45.3KB |

## 六、结论：按场景给 axii 的内存水平定位

1. **纯展示/静态行大列表**（日志、表格快照）：用静态行写法时 axii ≈ 253B/行，**优于 Vue（537B）、与 React（306B）同级**，距 Solid（≈108B，编译期消除）仍有差距。
2. **细粒度可更新大列表**（实时行情、聊天流）：惯用 axii 写法 ≈ 973B/行，是**四个框架中最高的**——约为等价 Solid 写法（488B）的 2 倍、Vue 的 1.8 倍、React 的 3.2 倍。10000 行约 9.3MB，绝对量在桌面端可接受，但在移动端超大列表上应改用静态行 + 整行替换（253B/行），或等待下述优化。作为交换，axii 在该场景的**更新耗时**是四者最优（update-100 0.28ms vs React 0.43ms / Vue 1.5ms / Solid 1.25ms，见 `benchmark-results.md`）。
3. **组件很多、颗粒很细的组件树**：axii ≈ 2.35KB/组件实例，是**最重的**（Solid 的 8 倍、React 的 2.9 倍、Vue 的 1.23 倍）。上千个小组件的场景（设计器、画布类应用）内存会先于其他框架成为约束。
4. **生命周期卫生（最重要的工程指标）**：axii 表现**优秀**——清空/销毁后保留对象精确归零，反复建删与高频更新均无泄漏迹象；好于 React（延迟释放 + 线性残留）和 Vue（循环中缓慢累积），与 Solid 同级。
5. **基线与体积**：运行时堆基线与 React/Vue 同级；bundle gzip 后 29.5KB，小于 React、大于 Vue/Solid。

一句话总结：**axii 用"每个响应式绑定一组常驻对象（host + effect + atom + dep，约 700B）"换取了最优的更新性能和精确的资源回收；它的内存短板不在泄漏或增长模式（都非常干净），而在细粒度绑定和组件实例的单价上。**

## 七、对框架的优化建议（按收益排序）

1. **`ComponentHost` 惰性分配**：4 个 Set、`refs`/`itemConfig`/`exposed`/`frame`、bind 出来的 createElement 闭包全部改为首次使用时分配，预计可把 2.35KB/实例 压到 1KB 以内（多数小组件用不到这些能力），直接改善组件树场景 50%+。
2. **文本绑定瘦身**：函数 child 路径每行比 atom child 路径多 ~120B（FunctionHost + DeferredBindingEffect 两层）。若 JSX 编译期（vite-plugin）能识别 `() => atomLike()` 形态并降级为 AtomHost 路径，惯用写法可自动省 12%/行；更进一步,把 AtomHost + LightBindingEffect + dep 的三对象结构合并为单对象绑定（Solid 的做法),有望把 700B/绑定压到 400B 级别。
3. **`CompactElementHost` 已经足够薄**（145B/行,与 fiber 同级）,不是当前瓶颈。

## 复现方法

```bash
cd ../axii && npm install && npm run build
cd ../benchmark && npm install && npx playwright install chromium
npm run benchmark:memory   # 输出 results/memory-benchmark-<stamp>.{json,md}
npm run benchmark:real     # 含 retained object diagnostics 的完整性能套件
```
