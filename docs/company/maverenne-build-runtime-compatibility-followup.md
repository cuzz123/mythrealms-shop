# Maverenne 构建运行时兼容性跟进诊断

- 诊断时间：2026-07-26 08:23–08:38 +08:00
- 范围：仅 Prisma 5.22.0 / Node.js 22 与 24 的隔离运行时诊断；未部署，未修改生产环境、商品数据、业务源码、`package.json` 或 `package-lock.json`。
- Node 24 隔离目录：`C:\Users\11458\AppData\Local\Temp\mythrealms-node24-prisma-20260726`
- Node 22 下载隔离目录：`C:\Users\11458\AppData\Local\Temp\mythrealms-node22-prisma-20260726-082801`

## 结论

1. **Node 22 LTS 对照尚未完成，不能宣称通过。** 本机没有已安装或缓存的 Node 22。Node.js 官方发行索引显示最新 Node 22 LTS 为 `v22.22.0`（Jod，官方条目自带 npm `10.9.4`），但官方 ZIP 在两次有界下载中均未完成，因此没有解压、没有执行 `npm ci`，也没有执行 Node 22 下的 `prisma generate`。
2. **Prisma 5.22.0 的 `generate` 可以在当前 Node 24.14.0 Windows x64 环境运行。** 在先前隔离目录的引擎文件已经齐备后，直接 CLI 复核于 1.049 秒内退出 0，Prisma 自报生成耗时 182 ms；随后 `require.resolve('@prisma/client')` 于 0.077 秒内退出 0。
3. **先前的“Node 24 挂起”最符合慢速/阻塞的 Prisma 引擎获取叠加不完整的超时进程树清理，而不是已证明的 Node 24 ABI 不兼容。** schema 明确请求 `native`、`rhel-openssl-3.0.x` 和 `windows` 三个 binary target。先前超时以后，隔离目录仍在后台逐步出现引擎及生成产物，最终 `.prisma/client` 于 08:24:31 完整生成并包含 RHEL 引擎。与此同时，08:08 启动的 `npx prisma --version` 的 Node → cmd → Node 三层进程在 08:35 仍存活，证明外层工具超时没有完整清理子进程树。
4. 上述第 3 点是基于时间线、文件产物、网络表现与残留进程的**高置信推断**，不是网络抓包级根因证明。Node 22 尚未运行，因此仍不能完成 Node 22/24 严格 A/B 对照。

## 版本与配置证据

| 项目 | 证据 |
| --- | --- |
| Node 24 | `v24.14.0`，`win32/x64`，ABI modules `137`；绝对路径 `C:\Users\11458\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` |
| npm CLI | 由上述 Node 24 显式承载 `D:\Softwares\node_modules\npm\bin\npm-cli.js`，版本 `11.6.2`，退出 0 |
| Prisma | `prisma@5.22.0`、`@prisma/client@5.22.0`，两次 manifest 读取均退出 0 |
| Prisma generator | `provider = "prisma-client-js"`；`binaryTargets = ["native", "rhel-openssl-3.0.x", "windows"]` |
| Node 22 官方候选 | 官方 `index.json` 的 Node 22 最新 LTS 条目为 `v22.22.0`、代号 Jod、npm `10.9.4`；本次未成功取得并校验 ZIP |

## 精确命令与结果

### Node 22 获取尝试

| 命令/动作 | 时长 | 退出码 | 结果 |
| --- | ---: | ---: | --- |
| `Invoke-WebRequest https://nodejs.org/dist/v22.22.0/node-v22.22.0-win-x64.zip -OutFile <temp-zip>`，随后计划取 `SHASUMS256.txt` | 60.025 秒 | 工具 124 | 下载阶段超时，仅留下 1,289,280 字节半文件；未取得/验证 SHA-256，未解压、未使用。 |
| `curl.exe --fail --location --continue-at - --output <temp-zip> <official-url>` | 7.505 秒 | 33 | 官方端点对该请求不支持 Range，输出 `HTTP server does not seem to support byte ranges`。 |
| `curl.exe --fail --location --output <new-temp-zip> <official-url>` | 304.027 秒 | 外层工具 124 | 外层超时；新目标文件未形成可验证完成产物。curl 子进程被外层超时遗留，08:35 只按精确 PID 和命令行匹配终止。 |

因此以下 Node 22 命令均**未运行**：版本复核、`npm ci`、`prisma --version`、`prisma generate`、客户端解析、单测、lint、build。

### Node 24 缓存命中复核

运行目录为 Node 24 隔离目录，直接调用本地 Prisma CLI，不经过 `npx`：

```powershell
& 'C:\Users\11458\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' `
  'C:\Users\11458\AppData\Local\Temp\mythrealms-node24-prisma-20260726\node_modules\prisma\build\index.js' `
  generate --schema '.\prisma\schema.prisma'
```

| 验证 | 开始/结束（+08:00） | 时长 | 退出码 | 结果 |
| --- | --- | ---: | ---: | --- |
| Node 24 直接 `prisma generate` | 08:37:39.0569 / 08:37:40.1087 | 1.049 秒 | 0 | `Prisma schema loaded`；`Generated Prisma Client (v5.22.0)`；Prisma 自报 182 ms。 |
| `node24 -e "console.log(require.resolve('@prisma/client')); ..."` | 08:37:40.1136 / 08:37:40.1907 | 0.077 秒 | 0 | 解析到隔离目录 `node_modules\@prisma\client\default.js`，版本 `5.22.0`。 |

此前另一次缓存命中复核的 stdout 也报告生成成功（Prisma 自报 175 ms，总进程约 1.147 秒），但 `Start-Process` 对象没有给出可用退出码，因此只作为辅助证据，不用于退出码 0 的结论。

## 挂起根因证据链

1. 直接 CLI 的 `--version` 先前可以在 Node 24 成功，说明 CLI 主入口和 Windows 引擎元数据读取不是必然崩溃点。
2. `prisma/schema.prisma` 要求额外生成 `rhel-openssl-3.0.x` 引擎，不只有本机 Windows target。
3. 先前报告“挂起”之后，Node 24 隔离目录仍继续变化：
   - `node_modules\@prisma\engines\schema-engine-windows.exe`：18,145,792 字节，时间 08:17:44；
   - `node_modules\.prisma\client\query_engine-windows.dll.node`：19,261,952 字节，时间 08:09:08；
   - `node_modules\.prisma\client\libquery_engine-rhel-openssl-3.0.x.so.node`：16,161,048 字节，时间 08:24:31；
   - 同目录生成的 JS、类型和 package 文件也统一更新于 08:24:31。
4. 官方 Node ZIP 在相同机器上 60 秒和 304 秒的受控窗口内均未完成，独立显示当前到外部分发端点的下载链路异常缓慢或阻塞。
5. 先前 `npx prisma --version` 的父 Node、`cmd.exe`、子 Node 三层进程从 08:08 持续到至少 08:35，说明外层 timeout 只结束了等待方，没有完整结束进程树。这会让“受控终止”后的下载/生成继续并在更晚时间落盘。
6. 引擎齐备后，相同 Node 24、相同 Prisma 5.22.0、相同 schema 的直接 `generate` 稳定快速退出 0。该差异支持“冷启动引擎获取/进程管理”假设，反对“Node 24 下 Prisma 5.22 generate 必然不兼容”假设。

## 未运行的验证

- Node 22 的全部命令：未运行，原因是官方运行时 ZIP 未完成且未通过 SHA-256 门禁。
- `npm run test:unit`：未运行。
- `npm run lint`：未运行。
- `npm run build`：未运行。

仅在 Node 24 的 `generate` 明确退出 0 后运行了最小相关验证 `require.resolve('@prisma/client')`。没有把未运行的测试声明为通过。

## 剩余阻塞与下一步决策

- 严格 Node 22/24 A/B 对照仍被“无法在有界时间内取得并校验 Node 22 官方 ZIP”阻塞。
- 若要完成对照，应由负责人提供一个已校验的 Node 22 x64 Windows ZIP/`node.exe` 绝对路径，或批准使用可访问的受信任内部镜像；仍应在全新临时目录执行，不修改仓库依赖。
- 若要把网络假设升级为确定根因，需要另行批准网络层观测（代理/防火墙日志、下载 URL 与耗时、Prisma fetch-engine DEBUG 日志），并确保 timeout 能杀完整进程树。
- 当前证据不支持为了该问题升级 Prisma、修改 schema 或修改业务代码。

## 主工作区复核（秘书处，2026-07-26 08:45–08:48 +08:00）

- 使用 bundled Node `v24.14.0` 对主工作区执行 lockfile 安装：`npm ci --ignore-scripts --no-audit --no-fund`，43.7 秒，退出码 `0`，安装 521 个包。
- 安装后直接运行 `node node_modules/prisma/build/index.js generate`；124 秒后外层工具以退出码 `124` 超时，stdout/stderr 均无可用生成结果，`node_modules/.prisma/client/index.js` 不存在。
- 超时后只读进程检查发现本轮 Prisma Node 子进程 PID `37248` 仍在运行，再次证明外层超时未清理完整进程树。秘书处核对命令行属于本轮 `prisma generate` 后，仅终止该 PID；复核结果为进程已终止。
- 当前主工作区仍不能解析 `@prisma/client`。因此隔离目录的成功证据不能升级为“主工作区已解除阻塞”，单测、lint、clean build 继续未运行。
- 这次复核没有修改业务代码、商品状态或生产环境；依赖安装只影响本地 `node_modules`。

## 主工作区有界复现（Task 1，2026-07-26 09:06–09:15 +08:00）

### 结论

- 本轮未恢复主工作区生成的 Prisma Client，结果为**有界、可复现阻塞**。`npm ci --ignore-scripts` 成功，但直接 Prisma CLI 在 300 秒窗口内没有退出；清理包装器自身随后退出 `1`，并遗留本轮唯一匹配的 Prisma Node 进程 PID `33060`。
- 只按完整绝对命令行匹配该 PID 后执行 `taskkill.exe /PID 33060 /T /F`，命令报告成功；1 秒后复查匹配进程数为 `0`。未允许进程在后台继续下载或生成。
- 清理后 `node_modules/.prisma/client/index.js`、`default.js`、Windows 查询引擎和 RHEL 查询引擎均不存在。因此没有执行后置 `require.resolve('@prisma/client')` 门禁，也没有执行单测、lint 或 build。
- 本轮没有修改 `prisma/schema.prisma`、依赖版本、业务代码、商品状态或生产环境。唯一持久文档修改是本节。

### 重跑前基线

使用 bundled Node `C:\Users\11458\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`（`v24.14.0`）：

| 检查 | 时长 | 退出码 | 结果 |
| --- | ---: | ---: | --- |
| `node24 -e "try { console.log(require.resolve('@prisma/client')); console.log(require('@prisma/client/package.json').version); process.exit(0) } catch (e) { console.error(e.code + ': ' + e.message); process.exit(1) }"` | 0.149 秒 | 0 | 仅解析到包入口 `D:\mythrealms-shop\node_modules\@prisma\client\default.js`，包版本 `5.22.0`。这不代表生成客户端存在。 |
| 生成产物检查 | — | — | `node_modules/.prisma/client/index.js`、Windows 查询引擎、RHEL 查询引擎均不存在；`node_modules/@prisma/engines/schema-engine-windows.exe` 存在，18,145,792 字节。 |
| 命令行包含本工作区 Prisma 的 `node.exe` / `cmd.exe` 进程检查 | — | — | 匹配数 `0`。 |

### `npm ci --ignore-scripts`

实际命令：

```powershell
& 'C:\Users\11458\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' `
  'D:\Softwares\node_modules\npm\bin\npm-cli.js' `
  ci --ignore-scripts --no-audit --no-fund
```

| 根 PID | 时长 | 退出码 | stdout/stderr | 结束后残留检查 |
| ---: | ---: | ---: | --- | --- |
| `62504` | 57.965 秒 | 0 | `added 521 packages in 58s`；另有 `node-domexception@1.0.0` deprecated 警告 | 根 PID、直接子 PID、以及匹配 `npm-cli.js ... ci --ignore-scripts` 的进程数均为 `0`；未调用 kill。 |

在此之前曾有一次包装器探测因本机 `ProcessStartInfo.ArgumentList` 为 null 而未把参数传给 Node；该探测实际只启动无参数 Node（0.184 秒、退出 0），已当场作废，**不计为 `npm ci` 结果**。

### Prisma 生成与清理

实际子进程命令（环境变量 `DEBUG=prisma:fetch-engine:download`）：

```powershell
& 'C:\Users\11458\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' `
  'D:\mythrealms-shop\node_modules\prisma\build\index.js' `
  generate --schema 'D:\mythrealms-shop\prisma\schema.prisma'
```

外层使用 `System.Diagnostics.Process` 异步读取 stdout/stderr，调用 `WaitForExit(300000)`；计划在超时时调用 `Kill($true)` 并等待退出。实际外层调用于 304.7 秒后退出 `1` 且未返回内部 stdout/stderr 摘要，不能宣称捕获到 target 下载日志，也不能把该退出码解释为 Prisma 自身退出码。只读复查证明 Prisma 子进程仍在运行：

```text
PID 33060, parent PID 41060
"C:\Users\11458\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "D:\mythrealms-shop\node_modules\prisma\build\index.js" generate --schema "D:\mythrealms-shop\prisma\schema.prisma"
```

精确清理与复查：

```powershell
taskkill.exe /PID 33060 /T /F
```

| 动作 | 退出码/结果 |
| --- | --- |
| 清理前完整命令行匹配 | 1 个进程：PID `33060` |
| `taskkill.exe /PID 33060 /T /F` | 报告 `SUCCESS`，PID `33060` 已终止 |
| 1 秒后相同完整命令行匹配 | `0` 个进程 |
| 清理后生成产物 | `.prisma/client/index.js`、`default.js`、`query_engine-windows.dll.node`、`libquery_engine-rhel-openssl-3.0.x.so.node` 均不存在 |

### 未运行项

- 后置 `require.resolve('@prisma/client')`：未运行；原因是 Prisma generation 没有退出 `0`。
- `npm run test:unit`：未运行。
- `npm run lint`：未运行。
- `npm run build`：未运行。

本轮证据继续支持“主工作区冷启动引擎获取在当前链路上超过有界窗口，并且普通外层超时/当前 .NET 包装器不能可靠清理完整进程树”。本轮没有得到 target 下载 stdout/stderr，故不能把具体下载 URL、单一 target 或网络设备宣称为确定根因。

## 主工作区修复与最终复核（2026-07-26 11:27–11:38 +08:00）

### 已确认根因

1. 诊断流程使用 `npm ci --ignore-scripts`，这会跳过 `@prisma/engines` 与项目根 `postinstall`；当时主工作区 `node_modules/@prisma/engines` 只有说明文件，没有 Windows schema/query engine。
2. 旧 generator 同时要求 `native`、`rhel-openssl-3.0.x` 和 `windows`。Windows 本地生成因此还要冷下载 RHEL 查询引擎；当前链路下载缓慢，并被外层超时提前终止。
3. 同版本 Windows schema engine 单独执行 `--version` 退出 0；引擎和查询缓存齐备后，同一 Node 24、Prisma 5.22.0 与 schema 的主工作区 `generate` 正常退出。因此不是 Node 24 ABI 或 Prisma CLI 固有不兼容。

### 持久修复

- `package.json` 的 `db:generate` 与 `postinstall` 直接调用已安装的 `prisma generate`，不再使用 `npx` 包装层。
- `vercel.json` 构建命令改为 `npm run db:generate && next build`，保证每次 Vercel build 都在目标主机重新生成客户端。
- generator 使用 `binaryTargets = ["native"]`。本地 Windows 生成 Windows 引擎；Vercel Linux 构建生成 Linux 原生引擎，不再要求 Windows 冷安装额外下载 RHEL 产物。
- 新增 `tests/prisma-build-contract.test.ts` 锁定上述契约。

官方依据：Prisma 的 Vercel 指南要求在 postinstall 或 build 中运行 `prisma generate`；generator 参考说明 `native` 会按实际构建操作系统选择正确引擎。

### fresh 验证

| 验证 | 结果 |
| --- | --- |
| Prisma 构建契约测试（RED） | 修改前 0/2，通过预期失败证明测试能捕获 `npx` 和多平台 targets |
| Prisma 构建契约测试（GREEN） | 2/2，退出 0 |
| `npm run db:generate` | 退出 0；Prisma Client 5.22.0，167 ms |
| `npm run test:unit` | 475/475，退出 0 |
| `npm run build` | 退出 0；Next 16.2.6 编译、TypeScript、166 个静态页面生成均通过 |
| `playwright test e2e/release-surfaces.spec.ts` | 18/24；6 项非 Prisma 失败，现已能真实运行而不再被客户端缺失阻断 |

### 当前边界

- Prisma 主工作区阻塞已解除。
- 浏览器 E2E 尚未全绿；失败集中于旧 45 商品数量断言、旧指南商品链接契约、图片加载、首页样式与购物车 hydration 状态，应独立处理。
- 未部署、未修改生产环境、未操作外部账号或数据库。
