#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const port = 4177;
const baseUrl = `http://127.0.0.1:${port}`;
const benchmarkTimeoutMs = 900000;
const frameworks = ["axii", "react", "vue", "solid"];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await wait(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function formatMs(value) {
  return `${value.toFixed(3)}ms`;
}

function formatOptionalMs(value) {
  return value === undefined ? "N/A" : formatMs(value);
}

function formatBytes(value) {
  const sign = value < 0 ? "-" : "";
  const mb = Math.abs(value) / 1024 / 1024;
  return `${sign}${mb.toFixed(3)}MB`;
}

function formatOptionalBytes(value) {
  return value === undefined ? "N/A" : formatBytes(value);
}

function formatCountMap(counts = {}) {
  const entries = Object.entries(counts).filter(([, value]) => value !== 0);
  if (!entries.length) return "-";
  return entries.map(([key, value]) => `${key}:${value}`).join(", ");
}

async function readPackageVersions(names) {
  const versions = {};
  for (const name of names) {
    const pkgPath = path.join(projectRoot, "node_modules", name, "package.json");
    const pkg = JSON.parse(await fs.readFile(pkgPath, "utf8"));
    versions[name] = pkg.version;
  }
  return versions;
}

function formatVersions(versions = {}) {
  return Object.entries(versions).map(([name, version]) => `${name}@${version}`).join(", ");
}

function buildMarkdown(result) {
  const frameworks = Object.keys(result.tests);
  const testNames = result.settings.tests?.map((test) => test.name) ?? Object.keys(result.tests[frameworks[0]]);
  const summaryTestNames = result.settings.tests
    ?.filter((test) => test.includeInSummary !== false)
    .map((test) => test.name) ?? testNames;

  const lines = [
    "# Real Browser Framework Benchmark Results",
    "",
    `Generated: ${result.timestamp}`,
    "",
    "These numbers were collected by Playwright in Chromium from actual DOM-rendering implementations of Axii, React, Vue, and Solid. No mocked framework timings are used.",
    "",
    `Versions: ${formatVersions(result.versions)}.`,
    "",
    `Settings: ${result.settings.iterations} measured iterations, ${result.settings.warmup} warmup iterations, base list size ${result.settings.baseCount}.`,
    "",
    "## Mean Duration",
    "",
    "| Test | Axii | React | Vue | Solid | Winner |",
    "| --- | ---: | ---: | ---: | ---: | --- |",
  ];

  for (const testName of testNames) {
    const row = frameworks.map((framework) => ({
      framework,
      mean: result.tests[framework][testName]?.mean,
    })).filter((entry) => entry.mean !== undefined);
    row.sort((a, b) => a.mean - b.mean);
    const byName = Object.fromEntries(row.map((entry) => [entry.framework, entry.mean]));
    lines.push(
      `| ${testName} | ${formatOptionalMs(byName.axii)} | ${formatOptionalMs(byName.react)} | ${formatOptionalMs(byName.vue)} | ${formatOptionalMs(byName.solid)} | ${row[0]?.framework ?? "N/A"} |`
    );
  }

  lines.push(
    "",
    "## Mean JS Heap Delta",
    "",
    "Measured with Chromium `performance.memory.usedJSHeapSize` after forced GC before and after each measured iteration.",
    "",
    "| Test | Axii | React | Vue | Solid | Lowest Heap Growth |",
    "| --- | ---: | ---: | ---: | ---: | --- |"
  );

  for (const testName of testNames) {
    const row = frameworks.map((framework) => ({
      framework,
      mean: result.tests[framework][testName]?.memory?.mean,
    })).filter((entry) => entry.mean !== undefined);
    row.sort((a, b) => a.mean - b.mean);
    const byName = Object.fromEntries(row.map((entry) => [entry.framework, entry.mean]));
    lines.push(
      `| ${testName} | ${formatOptionalBytes(byName.axii)} | ${formatOptionalBytes(byName.react)} | ${formatOptionalBytes(byName.vue)} | ${formatOptionalBytes(byName.solid)} | ${row[0]?.framework ?? "N/A"} |`
    );
  }

  if (result.diagnostics?.axiiRetainedObjects) {
    lines.push(
      "",
      "## Axii Retained Object Diagnostics",
      "",
      "Counts are collected by the opt-in Axii/data0 retained object diagnostics API after forced GC. Full per-type created/destroyed counters are in the raw JSON.",
      "",
      "| Scenario | Phase | Active Hosts | Host Types | Active Light Bindings | Light Binding Types | Active Effects | Effect Sources | Primitive Atom Deps | Compact Hosts | Style States |",
      "| --- | --- | ---: | --- | ---: | --- | ---: | --- | ---: | ---: | ---: |"
    );

    for (const [scenarioName, snapshots] of Object.entries(result.diagnostics.axiiRetainedObjects)) {
      for (const phase of ["baseline", "afterCreate", "afterClear", "afterDestroy"]) {
        const snapshot = snapshots[phase];
        if (!snapshot) continue;
        lines.push(
          `| ${scenarioName} | ${phase} | ${snapshot.hosts.totalActive} | ${formatCountMap(snapshot.hosts.activeByType)} | ${snapshot.lightBindings.totalActive} | ${formatCountMap(snapshot.lightBindings.activeByType)} | ${snapshot.data0.reactiveEffects.totalActive} | ${formatCountMap(snapshot.data0.reactiveEffects.activeBySource)} | ${snapshot.data0.primitiveAtomDeps.activeDeps} | ${snapshot.compactListHosts.active} | ${snapshot.styles.activeHostStyleStates} |`
        );
      }
    }
  }

  lines.push("", "## Summary", "");

  const totals = frameworks.map((framework) => {
    const total = summaryTestNames.reduce((sum, testName) => sum + result.tests[framework][testName].mean, 0);
    const memoryTotal = summaryTestNames.reduce(
      (sum, testName) => sum + (result.tests[framework][testName].memory?.mean ?? 0),
      0
    );
    return { framework, total, memoryTotal };
  });
  totals.sort((a, b) => a.total - b.total);

  lines.push("| Rank | Framework | Total Mean | Relative To Winner | Total Mean Heap Delta |");
  lines.push("| ---: | --- | ---: | ---: | ---: |");
  for (const [index, entry] of totals.entries()) {
    lines.push(
      `| ${index + 1} | ${entry.framework} | ${formatMs(entry.total)} | ${(entry.total / totals[0].total).toFixed(2)}x | ${formatBytes(entry.memoryTotal)} |`
    );
  }

  lines.push("", "## Raw Data", "");
  lines.push(`Raw JSON: \`${result.rawJsonFile}\``);
  return `${lines.join("\n")}\n`;
}

async function main() {
  await fs.mkdir(path.join(projectRoot, "results"), { recursive: true });

  const server = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    {
      cwd: projectRoot,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, BROWSER: "none" },
    }
  );

  let serverOutput = "";
  server.stdout.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  let browser;
  try {
    await waitForServer(`${baseUrl}/real-browser-benchmark.html`);

    const launchOptions = {
      headless: true,
      args: ["--enable-precise-memory-info", "--js-flags=--expose-gc"],
    };
    try {
      browser = await chromium.launch({ ...launchOptions, channel: "chrome" });
    } catch (error) {
      // 环境里没有安装 Chrome 时退回 Playwright 自带的 Chromium
      console.warn(`Chrome channel unavailable (${String(error?.message ?? error).split("\n")[0]}), falling back to bundled Chromium`);
      browser = await chromium.launch(launchOptions);
    }

    const consoleMessages = [];
    let result;

    for (const framework of frameworks) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
      page.setDefaultTimeout(benchmarkTimeoutMs);
      page.on("console", (message) => {
        const text = `${message.type()}: ${message.text()}`;
        consoleMessages.push(`[${framework}] ${text}`);
        console.log(text);
      });

      await page.goto(`${baseUrl}/real-browser-benchmark.html?framework=${framework}`, { waitUntil: "networkidle" });
      await page.waitForFunction(() => window.__BENCHMARK_DONE__ || window.__BENCHMARK_ERROR__, null, {
        timeout: benchmarkTimeoutMs,
      });

      const error = await page.evaluate(() => window.__BENCHMARK_ERROR__ || null);
      if (error) {
        throw new Error(`${framework}: ${error}`);
      }

      const frameworkResult = await page.evaluate(() => window.__BENCHMARK_RESULT__);
      await page.close();

      if (!result) {
        result = { ...frameworkResult, tests: {} };
      }
      result.tests[framework] = frameworkResult.tests[framework];
    }

    await browser.close();
    browser = null;

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const jsonFile = `results/real-browser-comparison-${stamp}.json`;
    const markdownFile = `results/real-browser-comparison-${stamp}.md`;
    // 静态报告（提交进仓库）引用固定路径的 JSON，避免 README/报告里的链接指向被 gitignore 的时间戳文件
    const staticJsonFile = "reports/performance-benchmark.json";
    const staticMarkdownFile = "reports/performance-benchmark.md";
    result.rawJsonFile = staticJsonFile;
    result.versions = await readPackageVersions(["axii", "data0", "react", "react-dom", "vue", "solid-js"]);

    const staticJson = `${JSON.stringify(result, null, 2)}\n`;
    const markdown = buildMarkdown(result);

    // 完整版（含 server 输出与 console 日志）只落在 results/，提交的静态 JSON 保持干净
    result.serverOutput = serverOutput;
    result.consoleMessages = consoleMessages;

    await fs.mkdir(path.join(projectRoot, "reports"), { recursive: true });
    await fs.writeFile(path.join(projectRoot, jsonFile), `${JSON.stringify(result, null, 2)}\n`);
    await fs.writeFile(path.join(projectRoot, markdownFile), markdown);
    await fs.writeFile(path.join(projectRoot, staticJsonFile), staticJson);
    await fs.writeFile(path.join(projectRoot, staticMarkdownFile), markdown);
    await fs.writeFile(path.join(projectRoot, "benchmark-results.md"), markdown);

    console.log(`JSON: ${jsonFile}`);
    console.log(`Markdown: ${markdownFile}`);
    console.log(`Static report: ${staticMarkdownFile} (+ ${staticJsonFile})`);
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
    server.kill("SIGTERM");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    // vite preview 子进程的 stdio 管道可能让 node 事件循环无法自然退出，这里显式退出
    process.exit(process.exitCode ?? 0);
  });
