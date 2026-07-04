#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const workspaceRoot = path.resolve(projectRoot, "..");
const port = 4178;
const baseUrl = `http://127.0.0.1:${port}`;
const timeoutMs = 120000;

const trackedNames = [
  "SimpleElementHost",
  "StaticHost",
  "RxListHost",
  "AtomHost",
  "FunctionHost",
  "ComponentHost",
  "InlineFunctionTextBinding",
  "LightReactiveAttributeBinding",
  "LightReactiveBindingEffect",
  "ReactiveEffect",
  "Computed",
  "AtomComputed",
  "RxList",
  "CompactDep",
  "Dep",
  "Set",
  "Array",
  "Object",
  "HTMLDivElement",
  "Text",
  "Comment",
];

const snapshotScenarios = [
  {
    name: "data-only-create-1000",
    setup: async (page) => page.evaluate(async () => window.__AXII_HEAP_SNAPSHOT_HARNESS__.clearDataOnly()),
    create: async (page) => page.evaluate(async () => window.__AXII_HEAP_SNAPSHOT_HARNESS__.createDataOnly(1000)),
    clear: async (page) => page.evaluate(async () => window.__AXII_HEAP_SNAPSHOT_HARNESS__.clearDataOnly()),
  },
  {
    name: "host-only-create-1000",
    setup: async (page) => page.evaluate(async () => {
      const harness = window.__AXII_HEAP_SNAPSHOT_HARNESS__;
      await harness.setupStatic();
      await harness.clearStatic();
    }),
    create: async (page) => page.evaluate(async () => window.__AXII_HEAP_SNAPSHOT_HARNESS__.createStatic(1000)),
    clear: async (page) => page.evaluate(async () => window.__AXII_HEAP_SNAPSHOT_HARNESS__.clearStatic()),
  },
  {
    name: "static-row-create-1000",
    setup: async (page) => page.evaluate(async () => {
      const harness = window.__AXII_HEAP_SNAPSHOT_HARNESS__;
      await harness.setupStaticRow();
      await harness.clearStaticRow();
    }),
    create: async (page) => page.evaluate(async () => window.__AXII_HEAP_SNAPSHOT_HARNESS__.createStaticRow(1000)),
    clear: async (page) => page.evaluate(async () => window.__AXII_HEAP_SNAPSHOT_HARNESS__.clearStaticRow()),
  },
  {
    name: "signal-row-create-1000",
    setup: async (page) => page.evaluate(async () => window.__AXII_HEAP_SNAPSHOT_HARNESS__.clear()),
    create: async (page) => page.evaluate(async () => window.__AXII_HEAP_SNAPSHOT_HARNESS__.create(1000)),
    clear: async (page) => page.evaluate(async () => window.__AXII_HEAP_SNAPSHOT_HARNESS__.clear()),
  },
  {
    name: "dynamic-attr-create-1000",
    setup: async (page) => page.evaluate(async () => {
      const harness = window.__AXII_HEAP_SNAPSHOT_HARNESS__;
      await harness.setupDynamicAttr();
      await harness.clearDynamicAttr();
    }),
    create: async (page) => page.evaluate(async () => window.__AXII_HEAP_SNAPSHOT_HARNESS__.createDynamicAttr(1000)),
    clear: async (page) => page.evaluate(async () => window.__AXII_HEAP_SNAPSHOT_HARNESS__.clearDynamicAttr()),
  },
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await wait(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function formatBytes(bytes) {
  const sign = bytes < 0 ? "-" : "";
  const value = Math.abs(bytes);
  if (value >= 1024 * 1024) return `${sign}${(value / 1024 / 1024).toFixed(3)}MB`;
  if (value >= 1024) return `${sign}${(value / 1024).toFixed(1)}KB`;
  return `${sign}${value}B`;
}

function createEmptyStats() {
  return { count: 0, selfSize: 0 };
}

function incrementStats(map, key, selfSize) {
  const stats = map.get(key) ?? createEmptyStats();
  stats.count++;
  stats.selfSize += selfSize;
  map.set(key, stats);
}

function classifyNode(type, name) {
  if (/^(HTML|SVG).*Element$/.test(name) || name === "Text" || name === "Comment" || name === "DocumentFragment") {
    return "DOM";
  }
  if (
    name.endsWith("Host") ||
    name === "SimpleElementHost" ||
    name === "InlineFunctionTextBinding" ||
    name === "LightReactiveAttributeBinding" ||
    name === "LightReactiveBindingEffect"
  ) {
    return "Axii";
  }
  if (name === "ReactiveEffect" || name === "Computed" || name === "AtomComputed" || name === "RxList" || name === "CompactDep" || name === "Dep") {
    return "data0";
  }
  if (name === "Array" || name === "Object" || name === "Set" || name === "Map") {
    return "JS container";
  }
  return type;
}

function shouldTrackNode(type, name) {
  if (!trackedNames.includes(name)) return false;
  return type === "object" || type === "native" || type === "array";
}

function summarizeName(name) {
  const normalized = (name || "(anonymous)").replace(/\s+/g, " ").trim();
  return normalized.length > 100 ? `${normalized.slice(0, 97)}...` : normalized;
}

async function analyzeSnapshot(snapshotFile) {
  const content = await fs.readFile(snapshotFile, "utf8");
  const snapshot = JSON.parse(content);
  const { meta } = snapshot.snapshot;
  const nodeFields = meta.node_fields;
  const nodeTypes = meta.node_types[0];
  const nodeFieldCount = nodeFields.length;
  const typeIndex = nodeFields.indexOf("type");
  const nameIndex = nodeFields.indexOf("name");
  const selfSizeIndex = nodeFields.indexOf("self_size");
  const nodes = snapshot.nodes;
  const strings = snapshot.strings;
  const byName = new Map();
  const byCategory = new Map();
  const tracked = Object.fromEntries(trackedNames.map((name) => [name, createEmptyStats()]));

  for (let offset = 0; offset < nodes.length; offset += nodeFieldCount) {
    const type = nodeTypes[nodes[offset + typeIndex]];
    const name = strings[nodes[offset + nameIndex]] || "";
    const selfSize = nodes[offset + selfSizeIndex] ?? 0;

    incrementStats(byName, name, selfSize);
    incrementStats(byCategory, classifyNode(type, name), selfSize);
    if (tracked[name] && shouldTrackNode(type, name)) {
      tracked[name].count++;
      tracked[name].selfSize += selfSize;
    }
  }

  const topBySelfSize = Array.from(byName.entries())
    .map(([name, stats]) => ({ name: summarizeName(name), ...stats }))
    .sort((a, b) => b.selfSize - a.selfSize)
    .slice(0, 40);

  const topByCount = Array.from(byName.entries())
    .map(([name, stats]) => ({ name: summarizeName(name), ...stats }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 40);

  return {
    nodeCount: nodes.length / nodeFieldCount,
    byCategory: Object.fromEntries(byCategory),
    tracked,
    topBySelfSize,
    topByCount,
  };
}

async function forceGarbageCollection(page, client) {
  await page.evaluate(async () => {
    if (typeof window.gc === "function") {
      window.gc();
      await new Promise((resolve) => setTimeout(resolve, 0));
      window.gc();
    }
  });
  await client.send("HeapProfiler.collectGarbage");
  await page.waitForTimeout(50);
}

async function takeSnapshot({ page, client, outputDir, phase }) {
  await forceGarbageCollection(page, client);
  const usedJsHeapSize = await page.evaluate(() => performance.memory?.usedJSHeapSize ?? null);
  const chunks = [];
  const onChunk = ({ chunk }) => chunks.push(chunk);
  client.on("HeapProfiler.addHeapSnapshotChunk", onChunk);
  await client.send("HeapProfiler.takeHeapSnapshot", { reportProgress: false, captureNumericValue: true });
  client.off("HeapProfiler.addHeapSnapshotChunk", onChunk);

  const file = path.join(outputDir, `${phase}.heapsnapshot`);
  await fs.writeFile(file, chunks.join(""));
  const analysis = await analyzeSnapshot(file);
  return {
    phase,
    file,
    relativeFile: path.relative(workspaceRoot, file),
    usedJsHeapSize,
    ...analysis,
  };
}

async function launchBrowser() {
  const options = {
    headless: true,
    timeout: 60000,
    args: ["--enable-precise-memory-info", "--js-flags=--expose-gc"],
  };

  try {
    return await chromium.launch(options);
  } catch (error) {
    if (!String(error?.message ?? error).includes("Executable doesn't exist")) {
      throw error;
    }
    return chromium.launch({ ...options, channel: "chrome" });
  }
}

function statsDelta(current = createEmptyStats(), baseline = createEmptyStats()) {
  return {
    count: current.count - baseline.count,
    selfSize: current.selfSize - baseline.selfSize,
  };
}

function createTrackedDeltaRows(result, baseline) {
  return trackedNames
    .map((name) => {
      const currentStats = result.tracked[name] ?? createEmptyStats();
      const baselineStats = baseline.tracked[name] ?? createEmptyStats();
      return { name, ...statsDelta(currentStats, baselineStats) };
    })
    .filter((row) => row.count !== 0 || row.selfSize !== 0)
    .sort((a, b) => Math.abs(b.selfSize) - Math.abs(a.selfSize));
}

function createTrackedDeltaMap(result, baseline) {
  return Object.fromEntries(
    trackedNames.map((name) => {
      const currentStats = result.tracked[name] ?? createEmptyStats();
      const baselineStats = baseline.tracked[name] ?? createEmptyStats();
      return [name, statsDelta(currentStats, baselineStats)];
    })
  );
}

function createCategoryDeltaRows(result, baseline) {
  const names = new Set([
    ...Object.keys(result.byCategory ?? {}),
    ...Object.keys(baseline.byCategory ?? {}),
  ]);
  return [...names]
    .map((name) => {
      const currentStats = result.byCategory?.[name] ?? createEmptyStats();
      const baselineStats = baseline.byCategory?.[name] ?? createEmptyStats();
      return { name, ...statsDelta(currentStats, baselineStats) };
    })
    .filter((row) => row.count !== 0 || row.selfSize !== 0)
    .sort((a, b) => Math.abs(b.selfSize) - Math.abs(a.selfSize));
}

function formatStats(stats) {
  return `${stats.count} / ${formatBytes(stats.selfSize)}`;
}

function buildMarkdown({ timestamp, outputDir, results }) {
  const baseline = results.find((result) => result.phase === "empty-page") ?? results[0];
  const resultByPhase = new Map(results.map((result) => [result.phase, result]));
  const scenarioResults = results.filter((result) => result.baselinePhase);
  const lines = [
    "# Axii Heap Snapshot Attribution - Task 4",
    "",
    `Generated: ${timestamp}`,
    "",
    "This summary is generated from Chrome heap snapshots captured through Playwright/CDP. Raw `.heapsnapshot` files are saved next to this document and can be opened in Chrome DevTools for exact retained-size dominator inspection.",
    "",
    "The automated tables below report object counts and V8 `self_size` because Chrome heap snapshot JSON does not store precomputed retained size. Scenario deltas compare each create snapshot with its own mounted/empty baseline to reduce cross-scenario noise. Use the raw snapshots to inspect retained size for individual dominators.",
    "",
    `Snapshot directory: \`${path.relative(workspaceRoot, outputDir)}\``,
    "",
    "## Phases",
    "",
    "| Phase | Used JS Heap | Nodes | Snapshot |",
    "| --- | ---: | ---: | --- |",
  ];

  for (const result of results) {
    lines.push(
      `| ${result.phase} | ${result.usedJsHeapSize === null ? "N/A" : formatBytes(result.usedJsHeapSize)} | ${result.nodeCount} | \`${result.relativeFile}\` |`
    );
  }

  lines.push(
    "",
    "## Scenario Tracked Object Deltas",
    "",
    "Format: `count delta / self-size delta`. Each scenario is compared with its own baseline snapshot.",
    ""
  );

  for (const result of scenarioResults) {
    const scenarioBaseline = resultByPhase.get(result.baselinePhase) ?? baseline;
    lines.push(`### ${result.phase}`, "");
    const rows = createTrackedDeltaRows(result, scenarioBaseline);
    if (!rows.length) {
      lines.push("No tracked deltas.", "");
      continue;
    }
    lines.push("| Name | Delta |", "| --- | ---: |");
    rows.forEach((row) => {
      lines.push(`| ${row.name} | ${formatStats(row)} |`);
    });
    lines.push("");
  }

  lines.push(
    "## Key Scenario Comparison",
    "",
    "This table highlights the objects most relevant to deciding whether more `InlineFunctionTextBinding` work can have a large payoff.",
    "",
    "| Name | host-only | static-row | signal-row | dynamic-attr | signal - static | dynamic - static |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |"
  );

  const comparisonPhases = {
    "host-only": "host-only-create-1000",
    "static-row": "static-row-create-1000",
    "signal-row": "signal-row-create-1000",
    "dynamic-attr": "dynamic-attr-create-1000",
  };
  const comparisonDeltas = Object.fromEntries(
    Object.entries(comparisonPhases).map(([key, phase]) => {
      const result = resultByPhase.get(phase);
      const scenarioBaseline = result ? resultByPhase.get(result.baselinePhase) : undefined;
      return [key, result && scenarioBaseline ? createTrackedDeltaMap(result, scenarioBaseline) : {}];
    })
  );
  const keyNames = [
    "SimpleElementHost",
    "InlineFunctionTextBinding",
    "LightReactiveAttributeBinding",
    "ReactiveEffect",
    "Computed",
    "RxList",
    "Set",
    "Array",
    "Object",
    "HTMLDivElement",
    "Text",
    "Comment",
  ];
  for (const name of keyNames) {
    const host = comparisonDeltas["host-only"][name] ?? createEmptyStats();
    const staticRow = comparisonDeltas["static-row"][name] ?? createEmptyStats();
    const signal = comparisonDeltas["signal-row"][name] ?? createEmptyStats();
    const dynamicAttr = comparisonDeltas["dynamic-attr"][name] ?? createEmptyStats();
    const signalMinusStatic = statsDelta(signal, staticRow);
    const dynamicMinusStatic = statsDelta(dynamicAttr, staticRow);
    lines.push(
      `| ${name} | ${formatStats(host)} | ${formatStats(staticRow)} | ${formatStats(signal)} | ${formatStats(dynamicAttr)} | ${formatStats(signalMinusStatic)} | ${formatStats(dynamicMinusStatic)} |`
    );
  }
  lines.push("");

  lines.push(
    "## Category Deltas vs Empty Page",
    "",
    "Format: `count delta / self-size delta`. Categories are coarse and intended to guide the next manual retained-size inspection.",
    ""
  );

  for (const result of results.filter((item) => item.phase !== baseline.phase)) {
    lines.push(`### ${result.phase}`, "");
    const rows = createCategoryDeltaRows(result, baseline).slice(0, 16);
    if (!rows.length) {
      lines.push("No category deltas.", "");
      continue;
    }
    lines.push("| Category | Delta |", "| --- | ---: |");
    rows.forEach((row) => {
      lines.push(`| ${row.name} | ${formatStats(row)} |`);
    });
    lines.push("");
  }

  lines.push(
    "## Top Self-Size Names",
    "",
    "The top entries help separate framework objects from general JS/browser allocations. For retained-size root-cause work, open the raw snapshot and inspect dominators for the same phase.",
    ""
  );

  for (const result of results) {
    lines.push(`### ${result.phase}`, "", "| Name | Count | Self Size |", "| --- | ---: | ---: |");
    result.topBySelfSize.slice(0, 12).forEach((entry) => {
      lines.push(`| ${entry.name || "(anonymous)"} | ${entry.count} | ${formatBytes(entry.selfSize)} |`);
    });
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const timestamp = new Date().toISOString();
  const stamp = timestamp.replace(/[:.]/g, "-");
  const outputDir = path.join(workspaceRoot, "prompt", "output", `axii-heap-snapshots-${stamp}`);
  await fs.mkdir(outputDir, { recursive: true });

  const server = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["vite", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    {
      cwd: projectRoot,
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        BROWSER: "none",
        AXII_BENCHMARK_SOURCE_AXII: "true",
        AXII_BENCHMARK_LOCAL_DATA0: "true",
      },
    }
  );

  let browser;
  try {
    await waitForServer(`${baseUrl}/real-browser-benchmark.html?mode=heap-snapshot`);
    browser = await launchBrowser();
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    page.setDefaultTimeout(timeoutMs);
    await page.goto(`${baseUrl}/real-browser-benchmark.html?mode=heap-snapshot`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__BENCHMARK_DONE__ || window.__BENCHMARK_ERROR__, null, {
      timeout: timeoutMs,
    });
    const error = await page.evaluate(() => window.__BENCHMARK_ERROR__ || null);
    if (error) throw new Error(error);

    const client = await page.context().newCDPSession(page);
    await client.send("HeapProfiler.enable");

    const results = [];
    results.push(await takeSnapshot({ page, client, outputDir, phase: "empty-page" }));

    await page.evaluate(async () => {
      window.__AXII_HEAP_SNAPSHOT_HARNESS__.mount();
      await window.__AXII_HEAP_SNAPSHOT_HARNESS__.settle();
    });
    results.push(await takeSnapshot({ page, client, outputDir, phase: "mounted-empty-axii-root" }));

    for (const scenario of snapshotScenarios) {
      await scenario.setup(page);
      const baselinePhase = `${scenario.name}-baseline`;
      results.push(await takeSnapshot({ page, client, outputDir, phase: baselinePhase }));
      await scenario.create(page);
      const scenarioResult = await takeSnapshot({ page, client, outputDir, phase: scenario.name });
      scenarioResult.baselinePhase = baselinePhase;
      results.push(scenarioResult);
      await scenario.clear(page);
    }

    await page.evaluate(async () => window.__AXII_HEAP_SNAPSHOT_HARNESS__.clear());
    await page.evaluate(async () => window.__AXII_HEAP_SNAPSHOT_HARNESS__.createAndDestroyTemporaryRoot(1000));
    results.push(await takeSnapshot({ page, client, outputDir, phase: "destroy-root-after-create-1000" }));

    await page.evaluate(async () => window.__AXII_HEAP_SNAPSHOT_HARNESS__.destroy());
    results.push(await takeSnapshot({ page, client, outputDir, phase: "after-harness-destroy" }));

    const jsonFile = path.join(outputDir, "summary.json");
    const markdownFile = path.join(outputDir, "summary.md");
    await fs.writeFile(jsonFile, `${JSON.stringify({ timestamp, results }, null, 2)}\n`);
    await fs.writeFile(markdownFile, buildMarkdown({ timestamp, outputDir, results }));

    console.log(`Summary: ${path.relative(workspaceRoot, markdownFile)}`);
    console.log(`Snapshots: ${path.relative(workspaceRoot, outputDir)}`);
  } finally {
    if (browser) await browser.close().catch(() => {});
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
