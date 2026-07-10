// 判定构建时 axii/data0 的实际来源并生成版本标注。
// CAUTION 与 vite.config.ts 的 alias 逻辑保持一致：axii/data0 实际可能解析到
//  兄弟目录的本地构建（而不是 node_modules 里的 npm 版本）。报告必须如实标注，
//  否则"版本号 vs 实测数字"会互相矛盾。
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function describeGitHead(projectRoot, relativeRepoPath) {
  try {
    const sha = execFileSync(
      "git",
      ["-C", path.resolve(projectRoot, relativeRepoPath), "rev-parse", "--short", "HEAD"],
      { encoding: "utf8" }
    ).trim();
    return sha ? ` @ ${sha}` : "";
  } catch {
    return "";
  }
}

export function detectLocalDependencySources(projectRoot) {
  const overrides = {};
  const localAxiiSrc = path.resolve(projectRoot, "../axii/src/index.ts");
  const localAxiiDist = path.resolve(projectRoot, "../axii/dist/axii.js");
  const useSourceAxii = process.env.AXII_BENCHMARK_SOURCE_AXII === "true" && fs.existsSync(localAxiiSrc);
  if (useSourceAxii) {
    overrides.axii = `local ../axii src${describeGitHead(projectRoot, "../axii")}`;
  } else if (fs.existsSync(localAxiiDist)) {
    overrides.axii = `local ../axii dist${describeGitHead(projectRoot, "../axii")}`;
  }
  const localData0Dist = path.resolve(projectRoot, "../data0/dist/data0.js");
  const localData0Src = path.resolve(projectRoot, "../data0/src/index.ts");
  if (process.env.AXII_BENCHMARK_LOCAL_DATA0 === "true" && fs.existsSync(localData0Dist)) {
    overrides.data0 = `local ../data0 dist${describeGitHead(projectRoot, "../data0")}`;
  } else if (useSourceAxii && fs.existsSync(localData0Src)) {
    overrides.data0 = `local ../data0 src${describeGitHead(projectRoot, "../data0")}`;
  }
  return overrides;
}

// 就地把 versions map 的值加上本地来源标注（如 "4.4.1 (local ../axii dist @ 4d7ddd6)"）
export function annotateVersionsWithLocalSources(versions, projectRoot) {
  for (const [name, override] of Object.entries(detectLocalDependencySources(projectRoot))) {
    if (versions[name]) versions[name] = `${versions[name]} (${override})`;
  }
  return versions;
}
