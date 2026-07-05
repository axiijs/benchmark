#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const port = 4178;
const baseUrl = `http://127.0.0.1:${port}`;
const benchmarkTimeoutMs = 900000;
const frameworks = ["vanilla", "axii", "axii-atom", "axii-static", "react", "vue", "solid", "solid-signal"];

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

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

function formatMb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(3)}MB`;
}

function formatBytesPerItem(bytes, count) {
  return `${(bytes / count).toFixed(0)}B`;
}

function buildMarkdown(results) {
  const counts = results[frameworks[0]].settings.counts;
  const lines = [
    "# Framework Memory Benchmark Results",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "Retained JS heap measured with `performance.memory.usedJSHeapSize` after forced GC (`--js-flags=--expose-gc --enable-precise-memory-info`), one fresh Chromium page per framework. Values are medians across iterations.",
    "",
    "## Retained Heap After Rendering N Rows",
    "",
    `| Rows | ${frameworks.join(" | ")} |`,
    `| ---: | ${frameworks.map(() => "---:").join(" | ")} |`,
  ];

  for (const count of counts) {
    const cells = frameworks.map((framework) => {
      const median = results[framework].retained[count].retained.median;
      return `${formatMb(median)} (${formatBytesPerItem(median, count)}/row)`;
    });
    lines.push(`| ${count} | ${cells.join(" | ")} |`);
  }

  const componentCounts = Object.keys(results[frameworks[0]].componentTree ?? {});
  if (componentCounts.length) {
    lines.push(
      "",
      "## Retained Heap After Mounting N Leaf Components (each with 1 local state)",
      "",
      `| Components | ${frameworks.join(" | ")} |`,
      `| ---: | ${frameworks.map(() => "---:").join(" | ")} |`
    );
    for (const count of componentCounts) {
      const cells = frameworks.map((framework) => {
        const entry = results[framework].componentTree?.[count];
        if (!entry) return "N/A";
        return `${formatMb(entry.median)} (${formatBytesPerItem(entry.median, Number(count))}/comp)`;
      });
      lines.push(`| ${count} | ${cells.join(" | ")} |`);
    }
  }

  lines.push(
    "",
    "## Data-Only Baseline (plain JS objects, no framework)",
    "",
    `| Rows | ${frameworks.map((f) => `${f} page`).join(" | ")} |`,
    `| ---: | ${frameworks.map(() => "---:").join(" | ")} |`
  );
  for (const count of counts) {
    const cells = frameworks.map((framework) => formatMb(results[framework].dataOnly[count].median));
    lines.push(`| ${count} | ${cells.join(" | ")} |`);
  }

  lines.push(
    "",
    "## Residual Heap After Clearing (leak check, median)",
    "",
    `| Rows | ${frameworks.join(" | ")} |`,
    `| ---: | ${frameworks.map(() => "---:").join(" | ")} |`
  );
  for (const count of counts) {
    const cells = frameworks.map((framework) =>
      formatKb(results[framework].retained[count].residualAfterClear.median)
    );
    lines.push(`| ${count} | ${cells.join(" | ")} |`);
  }

  lines.push(
    "",
    "## Residual Heap After Clearing + One More Empty Render (median)",
    "",
    "Distinguishes true leaks from deferred release such as React's double-buffered fiber trees.",
    "",
    `| Rows | ${frameworks.join(" | ")} |`,
    `| ---: | ${frameworks.map(() => "---:").join(" | ")} |`
  );
  for (const count of counts) {
    const cells = frameworks.map((framework) => {
      const entry = results[framework].retained[count].residualAfterRerender;
      return entry ? formatKb(entry.median) : "N/A";
    });
    lines.push(`| ${count} | ${cells.join(" | ")} |`);
  }

  lines.push(
    "",
    "## Long-Run Growth",
    "",
    "| Metric | " + frameworks.join(" | ") + " |",
    "| --- | " + frameworks.map(() => "---:").join(" | ") + " |"
  );
  const leak = frameworks.map((framework) => formatKb(results[framework].leakCycles.growthBytes));
  const churn = frameworks.map((framework) => formatKb(results[framework].updateChurn.growthBytes));
  const mount = frameworks.map((framework) => formatKb(results[framework].mountBytes));
  const first = results[frameworks[0]];
  lines.push(`| Mount empty app | ${mount.join(" | ")} |`);
  lines.push(
    `| ${first.leakCycles.cycles}x create/clear ${first.leakCycles.count} rows | ${leak.join(" | ")} |`
  );
  lines.push(
    `| ${first.updateChurn.rounds}x update ${first.updateChurn.batch}/${first.updateChurn.listSize} rows | ${churn.join(" | ")} |`
  );

  lines.push("", "Raw JSON files are stored alongside this markdown in `results/`.", "");
  return lines.join("\n");
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
  server.stdout.on("data", () => {});
  server.stderr.on("data", () => {});

  let browser;
  try {
    await waitForServer(`${baseUrl}/memory-benchmark.html?framework=vanilla`);

    const launchOptions = {
      headless: true,
      args: ["--enable-precise-memory-info", "--js-flags=--expose-gc"],
    };
    try {
      browser = await chromium.launch({ ...launchOptions, channel: "chrome" });
    } catch {
      browser = await chromium.launch(launchOptions);
    }

    const results = {};
    for (const framework of frameworks) {
      console.log(`Running memory benchmark: ${framework}`);
      const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
      page.setDefaultTimeout(benchmarkTimeoutMs);
      page.on("console", (message) => console.log(`  [${framework}] ${message.text()}`));

      await page.goto(`${baseUrl}/memory-benchmark.html?framework=${framework}`, { waitUntil: "networkidle" });
      await page.waitForFunction(() => window.__BENCHMARK_DONE__ || window.__BENCHMARK_ERROR__, null, {
        timeout: benchmarkTimeoutMs,
      });
      const error = await page.evaluate(() => window.__BENCHMARK_ERROR__ || null);
      if (error) throw new Error(`${framework}: ${error}`);
      results[framework] = await page.evaluate(() => window.__BENCHMARK_RESULT__);
      await page.close();
    }

    await browser.close();
    browser = null;

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const jsonFile = path.join(projectRoot, `results/memory-benchmark-${stamp}.json`);
    const markdownFile = path.join(projectRoot, `results/memory-benchmark-${stamp}.md`);
    await fs.writeFile(jsonFile, `${JSON.stringify(results, null, 2)}\n`);
    const markdown = buildMarkdown(results);
    await fs.writeFile(markdownFile, markdown);
    console.log(markdown);
    console.log(`JSON: ${jsonFile}`);
    console.log(`Markdown: ${markdownFile}`);
  } finally {
    if (browser) await browser.close().catch(() => {});
    server.kill("SIGTERM");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    process.exit(process.exitCode ?? 0);
  });
