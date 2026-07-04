#!/usr/bin/env node
// 快速 CPU profile：只跑 axii create-1000，输出自顶向下热点函数列表。
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const port = 4179;
const baseUrl = `http://127.0.0.1:${port}`;

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try { const res = await fetch(url); if (res.ok) return; } catch {}
    await wait(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function main() {
  const server = spawn("npx", ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    cwd: projectRoot, stdio: "ignore",
  });
  let browser;
  try {
    await waitForServer(`${baseUrl}/real-browser-benchmark.html`);
    browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--js-flags=--expose-gc"] });
    const page = await browser.newPage();
    // heap-snapshot mode 只挂载 harness，不自动跑基准
    await page.goto(`${baseUrl}/real-browser-benchmark.html?mode=heap-snapshot`, { waitUntil: "networkidle" });
    await page.evaluate(() => window.__AXII_HEAP_SNAPSHOT_HARNESS__.mount());

    const client = await page.context().newCDPSession(page);
    await client.send("Profiler.enable");
    await client.send("Profiler.setSamplingInterval", { interval: 20 });

    // 预热
    await page.evaluate(async () => {
      const h = window.__AXII_HEAP_SNAPSHOT_HARNESS__;
      for (let i = 0; i < 5; i++) { h.adapter.create(1000); h.adapter.clear(); }
    });

    await client.send("Profiler.start");
    await page.evaluate(async () => {
      const h = window.__AXII_HEAP_SNAPSHOT_HARNESS__;
      for (let i = 0; i < 100; i++) { h.adapter.create(1000); h.adapter.clear(); }
    });
    const { profile } = await client.send("Profiler.stop");

    // 汇总 self time
    const nodesById = new Map(profile.nodes.map((n) => [n.id, n]));
    const selfTime = new Map();
    const deltas = profile.timeDeltas || [];
    const samples = profile.samples || [];
    for (let i = 0; i < samples.length; i++) {
      const node = nodesById.get(samples[i]);
      const key = `${node.callFrame.functionName || "(anonymous)"} @ ${node.callFrame.url.split("/").pop()}:${node.callFrame.lineNumber}`;
      selfTime.set(key, (selfTime.get(key) ?? 0) + (deltas[i] ?? 0));
    }
    const totalUs = [...selfTime.values()].reduce((a, b) => a + b, 0);
    const top = [...selfTime.entries()].sort((a, b) => b[1] - a[1]).slice(0, 45);
    console.log(`total sampled: ${(totalUs / 1000).toFixed(1)}ms over 100 iterations of create+clear 1000`);
    for (const [key, us] of top) {
      console.log(`${(us / 1000).toFixed(2).padStart(9)}ms  ${((us / totalUs) * 100).toFixed(1).padStart(5)}%  ${key}`);
    }
    await fs.writeFile(path.join(projectRoot, "results", "axii-create-profile.cpuprofile"), JSON.stringify(profile));
  } finally {
    if (browser) await browser.close().catch(() => {});
    server.kill("SIGTERM");
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
