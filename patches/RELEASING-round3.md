# Round-3 内存优化的发布材料（2026-07-10）

本轮 axii/data0 改动由 Cloud Agent 完成，但 agent 对 `axiijs/axii`、`axiijs/data0`
只有读权限、也没有 npm 发布凭证，因此“合并到 main + 发版”准备到了**可一键执行**的
程度，由维护者完成最后的 push/publish。所有状态都已在本机验证：

- data0 本地 main = `v2.4.0`（merge + `chore(release): v2.4.0` + tag），207 个测试全过
- axii 本地 main = `v4.4.2`（merge + data0 依赖升级到 `^2.4.0` + release + tag），
  601 浏览器 + 6 node 测试全过（对 data0 2.4.0 与 2.3.0 均绿）
- 用 `npm pack` 出来的 `data0-2.4.0.tgz` + `axii-4.4.2.tgz` 装进本仓库后，
  `benchmark:memory` 复现出与 `reports/` 一致的数字（细粒度行 439B、组件 651B），
  版本行显示 `axii@4.4.2, data0@2.4.0`

## 交付文件

| 文件 | 内容 |
| --- | --- |
| `data0-v2.4.0.bundle` | data0 `origin/main..main` 的 git bundle，含 `main` 分支与 `v2.4.0` tag |
| `axii-v4.4.2.bundle` | axii 同款，含 `main` 与 `v4.4.2` tag |
| `data0-memory-optimization-round3.patch` / `axii-memory-optimization-round3.patch` | 同一改动的纯文本 patch（不含 merge/release 提交），供 review 或手工重放 |

bundle 与 patch 内容一致；bundle 额外保留了已验证的 merge 提交、release 提交与 tag
的原始 SHA。两者选其一即可。

## 维护者操作（按依赖顺序）

```bash
# 1. data0：合并 + 发版
cd data0 && git checkout main && git pull
git pull ../benchmark/patches/data0-v2.4.0.bundle main
git fetch ../benchmark/patches/data0-v2.4.0.bundle 'refs/tags/v2.4.0:refs/tags/v2.4.0'
npm install && npm test && npm run build      # 应全绿（207）
git push origin main v2.4.0
npm publish                                    # data0@2.4.0

# 2. axii：合并（含 data0 ^2.4.0 升级）+ 发版
cd ../axii && git checkout main && git pull
git pull ../benchmark/patches/axii-v4.4.2.bundle main
git fetch ../benchmark/patches/axii-v4.4.2.bundle 'refs/tags/v4.4.2:refs/tags/v4.4.2'
npm install && npm test && npm run build      # 应全绿（601 + 6）
git push origin main v4.4.2
npm publish                                    # axii@4.4.2

# 3. benchmark：合并依赖升级 PR（cursor/upgrade-axii-4.4.2-c784，
#    发布完成前保持 draft），合并后刷新 lockfile：
cd ../benchmark && npm install && git add package-lock.json && git commit -m 'chore: lock axii 4.4.2 / data0 2.4.0'
```

如果更希望走各仓库自己的发布流程（data0 `npm run release <version>` /
axii `release-it`），也可以只拉取 bundle 的 merge 提交（`git pull <bundle> main` 后
`git reset --hard HEAD~1` 丢弃 release 提交与 tag），再按常规流程发版；改动内容不变。
