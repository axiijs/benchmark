# Axii 内存使用深度分析（对比 React / Vue / Solid）

生成时间：2026-07-05。所有数据来自本仓库 `npm run benchmark:memory`（`scripts/run-memory-benchmark.js` + `src/memory-benchmark.js`）的真实测量，非模拟数据。

> **更新（2026-07-10）**：第三轮深度 review 完成（见文末「十、第三轮深度 review 与优化」）。
> 在已发布的 axii 4.4.1 + data0 2.3.0 基础上：细粒度行 642B → **440B**（-31%，
> 低于 solid-signal 的 490B 与 Vue 的 537B），atom 行 565B → **367B**，静态行
> 194B → **166B**，组件实例 913B → **652B**（-29%，比 React 的 825B 轻 21%）。
> 速度全面持平或更快（fine-grained create -18%），清理卫生指标不变（全部归零）。

> **更新（2026-07-05）**：基于本报告第七节的优化建议，axii 侧已完成一轮内存优化
> （axii 仓库分支 `cursor/memory-optimization-90a2`），本文各表为**优化前**的原始数据，
> 优化后的对比见文末「八、优化落地后的实测结果」。摘要：细粒度行 973B → 678B（-30%），
> atom 行 855B → 615B，静态行 253B → 189B（低于 React 的 306B），组件实例 2355B → 1013B
> （-57%，低于 Vue 的 1907B），同时速度套件总耗时还快了 ~12%。

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

## 八、优化落地后的实测结果（2026-07-05）

第七节的建议已在 axii 仓库实现（分支 `cursor/memory-optimization-90a2`），改动包括：

1. **每个绑定 effect 去掉 3 个实例闭包**：data0 `ReactiveEffect` 构造器逐实例分配的
   `pauseCollectChild`/`resumeCollectChild`/`dispatch` 箭头函数，在 `LightBindingEffect`
   构造后用共享函数覆盖。
2. **Host 与绑定 effect 合并为同一对象**：`AtomHost`/`FunctionHost` 直接继承
   `LightBindingEffect`/`DeferredBindingEffect`，每个响应式文本绑定少一个对象 + 一个闭包；
   `FunctionHost` 只在 source 函数声明了参数时才分配 context 对象。
3. **`StaticHost` 瘦身**：`attachRefs` 从实例箭头函数改为原型方法（长列表每行省一个闭包），
   去掉恒定初始化的字段槽位。
4. **`ComponentHost` 全面惰性化**：4 个 Set、`refs`/`exposed`/`frame`/`itemConfig`、全部
   renderContext 闭包、`DataContext` 都改为首次使用才分配；renderContext 变成全 getter 的
   轻量包装（组件解构哪个能力才为哪个付费）；无 boundProps/AOP 配置的组件走 props 快路径；
   无 layoutEffect/ref 的组件跳过 attach 监听注册。

### 稳态列表内存（GC 后保留堆，每行）

| 变体 | 优化前 | 优化后 | 对比 |
| --- | ---: | ---: | --- |
| axii 细粒度（函数 child） | 973B | **678B** | -30%，介于 Vue（537B）与 atom 行之间 |
| axii atom child | 855B | **615B** | -28% |
| axii 静态行 | 253B | **189B** | -25%，**低于 React（306B）** |
| react / vue / solid / solid-signal | 306B / 537B / 108B / 490B | 不变 | 参照系 |

### 组件树（每个带 1 个局部状态的叶子组件）

| 框架 | 每组件 |
| --- | ---: |
| solid | 290B |
| react | 826B |
| **axii（优化后）** | **1013B**（原 2355B，-57%） |
| vue | 1907B |

axii 从「四者最重（Vue 的 1.23 倍）」变为「React 与 Vue 之间」，与 React 的差距从 2.9 倍缩小到 1.23 倍。

### 卫生指标与速度（必须不回退的约束）

- 清空/销毁后 retained diagnostics 依然全部归零；30 次 create/clear 循环净增 ~16KB（与 Solid 相同量级）；全部 398 + 6 个测试通过。
- 速度不但没有回退还有改善（分配变少）：`benchmark:real` 四框架总耗时 axii 23.7ms → **20.8ms**
  （solid 19.6ms / vue 25.1ms / react 69.4ms），create-1000 3.65ms → 2.95ms，update-100
  0.28ms → 0.24ms，swap-2 0.13ms → 0.08ms。axii 仍保持 append/update/remove/sort/swap/move
  多数场景第一。

### 剩余差距与归因

细粒度行 678B vs 等价 Solid 写法 490B：剩余差距几乎全部在 data0 侧——每个 atom 的结构
（闭包 + WeakMap dep 登记）和 `ReactiveEffect` 基类的 11 个实例字段 + deps 数组，比 Solid
的 signal（3 字段对象）和 computation 重。组件的剩余 ~190B（vs React）主要是 ComponentHost
自身必需字段（type/props/children/inputProps/placeholder/pathContext/renderContext 等
12+ 槽位）+ 1 个 createElement bind 闭包，已接近该设计下的下限。

## 九、data0 侧优化落地（2026-07-05，第二轮）

上面指出的 data0 侧差距也已实现（补丁见本仓库 `patches/data0-memory-optimization.patch`，
基于 data0 2.0.0，包含逐对象称重脚本 `scripts/measure-retained.mjs` 与热路径计时脚本
`scripts/measure-speed.mjs`）：

1. **`ReactiveEffect` 瘦身**：`pauseCollectChild`/`resumeCollectChild`/`dispatch` 从每实例
   箭头函数改为原型方法（每 effect 少 3 个闭包）；恒定默认值（`isRunningAsync`/
   `useDepMarker`/`index`/`shouldCollectChild`）移到原型；无 getter 的轻量 effect 不再为
   `getter`/`isAsync` 占实例槽位；destroy 用赋值 undefined 替代 `delete`（delete 会把对象
   推进字典属性模式）。
2. **`Computed` 全面惰性化**：7 个集合字段（triggerInfos/effectFramesArray/
   keyToEffectFrames/dirtyFromDeps/markedDirtyEffects/savedTriggerInfos/cachedValues）
   惰性分配；`updatedAt` 从"每实例一个 atom"变为普通时间戳 + 按需 atom；8 个箭头函数字段
   改为原型方法（scheduler 需要脱离 this 的回调用惰性 bound 版本）。
3. **primitive atom 共享原型**：`raw` 访问器、`Symbol.toPrimitive`、`IS_ATOM` 标记全部放到
   共享原型上，实例只保留一个自有值属性；dep 登记改用普通 symbol 赋值替代 defineProperty，
   避免把 atom 函数推进字典属性模式。
4. **`RxList.indexKeyDeps`** 惰性分配。

### data0 微基准（node --expose-gc，GC 后保留字节/对象）

| 对象 | 优化前 | 优化后 |
| --- | ---: | ---: |
| 轻量绑定 effect | 416B | **136B** (-67%) |
| atom + 1 订阅者（含 dep/track 记账） | 926B | **621B** (-33%) |
| computed（含 status/updatedAt 等） | 2370B | **627B** (-74%) |
| 空 RxList | 5441B | **1792B** (-67%) |

热路径速度（`measure-speed.mjs`）：全部持平或更快——effect 创建/销毁 -18%，
RxList 1000 行 splice 建删 -51%，atom 读写与 batch 更新持平。data0 全部 174 个测试通过。

### 叠加 data0 后的浏览器实测（axii 优化分支 + data0 补丁）

| 场景 | 仅 axii 优化 | + data0 优化 | 参照 |
| --- | ---: | ---: | --- |
| 细粒度行 | 678B | **652B** | Vue 537B / solid-signal 490B |
| atom child 行 | 615B | **590B** | |
| 组件（1 个局部状态） | 1013B | **~990B** | React 826B / Vue 1907B |
| 空应用挂载 | 118KB | **108KB** | Vue 101KB / React 97KB |

速度进一步改善：`benchmark:real` 四框架总耗时 axii 降到 **18.8ms**，与 Solid（18.6ms）
只差 1%（vue 22.3ms / react 67.2ms）；create-1000 从 2.95ms 降到 2.46ms（初始基线 3.65ms）。
清空后 retained diagnostics 依然全部归零。

data0 的每绑定"atom+dep+effect"结构从 926B 压到 621B 后，剩余与 Solid 的差距主要是
架构性的：data0 的 dep 是独立对象 + effect.deps 反向数组（支持双向清理与 dep marker 位），
Solid 则把订阅内联在 signal/computation 两个对象的数组里。再往下压需要改变依赖图的数据
结构本身，属于收益递减的大改动。

## 十、第三轮深度 review 与优化（2026-07-10）

前两轮落地后（axii 4.4.1 + data0 2.3.0 均已发布），实测基线为：细粒度行 ~640B、
atom 行 565B、静态行 194B、组件 ~915B。本轮用堆快照对每行保留对象逐一"点名"
（`npm run heap:snapshot` + 自写的快照 diff/持有者归因脚本），发现剩余开销里有
一大半不是架构性的，而是 V8 层面的分配细节。改动以 patch 形式随本仓库提交
（`patches/axii-memory-optimization-round3.patch`、
`patches/data0-memory-optimization-round3.patch`，也在两仓库的
`cursor/memory-deep-review-c784` 本地分支上）。

### 每行保留对象的逐项归因（1000 行细粒度列表，优化前）

| 对象 | 每行字节 | 问题 |
| --- | ---: | --- |
| `FunctionHost.deps` 数组 | 92B | `deps = []` 后第一次 push 使 V8 把 elements store 直接扩到容量 17（0+0/2+16），单 dep 绑定浪费 64B |
| 每 child 克隆的 `pathContext` + `LinkedNode` + PropertyArray | ~60B | 文本绑定从不消费 hostPath，纯属预付 |
| `elementPath` 数组（每行内容相同的 `[0]`） | 28B | 同一模板位置在每行重复分配 |
| `reactiveHosts` 包装数组（单 child） | 28B | 一元素一绑定是典型形态，数组多余 |
| atom updater 自引用闭包的 Context | 20B | 闭包变量自引用，每 atom 一个只装自己的 Context |
| 元素 host 的 PropertyArray | 20B | `collectRefHandles/collectDetachStyledChildren` 无条件赋 undefined，把 host 推出 in-object 容量 |
| `RxList.map(skipItemEffect)` 的空 frame 数组 | 16B | 每行分配 `[]` 占位，内容恒为空 |
| 属性绑定（dynamic-attr 场景）：闭包 + Context | ~50B/绑定 | 闭包捕获 el/key/value/path/isSVG/host 六个变量 |

### 改动清单

data0（`cursor/memory-deep-review-c784`，5 commits）：

1. **`ReactiveEffect.deps` 惰性且精确容量**：初始指向共享 frozen 空数组哨兵，第一次
   track 经由新的 `addDep` 换成容量恰好为 1 的 `[dep]` 字面量。单 dep effect 92B→28B；
   从未 track 到依赖的 effect 零数组分配。
2. **primitive atom 改为命名函数表达式（NFE）自引用**：函数体不再捕获创建期变量，
   每 atom 少一个专属 Context（~20B）。
3. **`Computed` 可选构造参数不再用参数属性**：applyPatch/callbacks/skipIndicator/
   preventEffectSession 有值才赋，默认值放原型（每 computed 少 ~4 个 undefined 槽位）。
4. **`RxList.map({skipItemEffect:true})` 复用共享 frozen 空 frame**，不再逐行分配 `[]`。

axii（`cursor/memory-deep-review-c784`，3 commits）：

1. **atom/函数 child 不再克隆 pathContext**：文本绑定共享父元素 host 的 context，
   位置信息（owner + elementPath + debugSource）放进一个 3 字段 position 对象；
   函数节点渲染出结构内容时才由 `childPathContext()` 惰性物化出与旧实现逐字段等价的
   完整链。省掉每绑定的 clone + LinkedNode + 隐藏 PropertyArray（~60B）。
2. **响应式属性绑定子类化**（`ReactiveAttributeEffect`）：字段进实例槽位，替代
   「LightBindingEffect + 六变量闭包 + Context」（每属性绑定 ~50B）。
3. **`collectRefHandles/collectDetachStyledChildren` 只在有值时赋值**：无条件写
   undefined 曾把每个元素 host 推出 in-object 容量（每行一个 ~20B PropertyArray）。
4. **`reactiveHosts`/`attrEffects` 单个时直接存对象**（数组只在多 child/attr 时出现），
   并在构造器显式预置 undefined 保住 in-object 槽位。
5. **小 elementPath 驻留池**：≤3 段的 path 数组按内容驻留（上限 4096 条防御性回退），
   全列表同一模板位置共享一份。
6. **ComponentHost**：name 变 getter；ref/__this 有值才赋；render 完成后把 inputProps
   换成共享空对象，让 JSX 调用点的 props 对象可被回收。

### data0 微基准（node --expose-gc，GC 后保留字节/对象，同机同脚本）

| 对象 | 2.3.0 | 优化后 |
| --- | ---: | ---: |
| primitive atom(string) | 176B | **136B** (-23%) |
| atom + 1 订阅者（含 dep/track 记账） | 620B | **452B** (-27%) |
| 轻量绑定 effect（无依赖） | 136B | **104B** (-24%) |
| computed（含上游 atom） | 946B | **707B** (-25%) |
| 空 RxList | 274B | **226B** (-18%) |

热路径速度（`measure-speed.mjs`，进程内交替 A/B 取中位数）全部持平或更快：
atom 写+读 -7%，effect 创建/销毁 -3%，RxList splice churn、RxMap 建删、batch 更新
均在噪声内持平。data0 全部 207 个测试通过。

### 浏览器实测（本仓库 `benchmark:memory`，同机对比）

稳态列表（GC 后保留堆，每行，1000 行）：

| 变体 | 4.4.1 基线 | 优化后 | 参照 |
| --- | ---: | ---: | --- |
| axii 细粒度（函数 child） | 642B | **440B** (-31%) | **低于 solid-signal（490B）、Vue（537B）** |
| axii atom child | 565B | **367B** (-35%) | 接近 React 全静态行（314B） |
| axii 静态行 | 194B | **166B** (-14%) | React 314B 的一半 |
| react / vue / solid / solid-signal | 314B / 537B / 115B / 490B | 不变 | 参照系 |

10000 行时 axii 细粒度 6.02MB → **4.11MB**（631B → 431B/行）。

组件树（每个带 1 个局部状态的叶子组件，1000 个）：

| 框架 | 每组件 |
| --- | ---: |
| solid | 291B |
| **axii（优化后）** | **652B**（原 913B，-29%） |
| react | 825B |
| vue | 1907B |

axii 组件实例从「略重于 React」变为 **比 React 轻 21%**，约为 Vue 的 1/3。

### 卫生指标与速度（必须不回退的约束）

- 清空/销毁后 retained diagnostics（hosts/bindings/effects/deps）依然全部归零；
  5000/10000 行 clear 后残留 ≈ 0KB；30 次 create/clear 循环净增 7.6KB（Solid 16KB）；
  高频更新 100 轮净增 23KB，与基线持平。axii 601 + 6 个测试、data0 207 个测试全部通过。
- `benchmark:real` 速度全面持平或更快：15 项对比场景 axii 总耗时 18.9ms → **18.6ms**，
  仍保持 append/update/remove/swap/move 多数场景第一；axii 专项中
  signal-row-create-1000 2.38ms → **1.96ms**（-17%），fine-grained-create-1000
  2.24ms → **1.83ms**，create-clear×50 112ms → **100ms**，update-text×100 17.0ms →
  **15.7ms**（分配变少直接反映到速度）。create-1000 的堆增量 0.60MB → **0.40MB**。

### 剩余差距与定位

细粒度行还剩的每行开销（~330B 框架部分）已数得过来：FunctionHost 64B、
CompactElementHost 36B、CompactDep 24B、atom 函数 32B + 值/dep 记账 PropertyArray
20B、用户 mapFn 闭包 + Context 48B、position 对象 24B、deps `[dep]` 28B、DOM 包装
对象的 PropertyArray 20B。再往下压只剩两条路：把 FunctionHost 与行元素 host 合并成
单对象（省 ~90B，但让 StaticHost 全家背上 effect 基类），或编译期把
`() => atom()` 降级为 AtomHost 路径（省 ~70B）。两者都属于收益递减的结构性改动，
本轮不做。组件场景已优于 React，剩余成本主要是 props 两份（normalized + children
挂载）与 renderContext 包装，同样属于设计内成本。

## 复现方法

```bash
cd ../axii && npm install && npm run build
cd ../benchmark && npm install && npx playwright install chromium
npm run benchmark:memory   # 输出 results/memory-benchmark-<stamp>.{json,md}
npm run benchmark:real     # 含 retained object diagnostics 的完整性能套件
```

复现第十节（本轮 patch）：

```bash
cd ../axii  && git apply ../benchmark/patches/axii-memory-optimization-round3.patch  && npm run build
cd ../data0 && git apply ../benchmark/patches/data0-memory-optimization-round3.patch && npm run build
cd ../benchmark && AXII_BENCHMARK_LOCAL_DATA0=true npm run benchmark:memory
```
