# Maverenne 构建运行时兼容性诊断

- 记录时间：2026-07-26 08:12:05 +08:00
- 基线提交：`4504da950670c6a06fb41c3326203b202c278743`
- 范围：仅运行时兼容性诊断与验证。未修改业务源码、`package.json`、`package-lock.json`，未部署。
- 隔离目录：`C:\Users\11458\AppData\Local\Temp\mythrealms-node24-prisma-20260726`

## 结论

修复 lockfile 后，bundled Node 24 可以完成干净的无生命周期依赖安装，并可直接加载 Prisma 5.22.0 CLI 和其 Windows x64 引擎元数据；但 `prisma generate` 在 Node 24 环境中无输出地持续挂起，无法完成生成门禁。`npx` 包装器也会挂起，且其问题与直接运行 Prisma CLI 的生成挂起相互独立。

这证明原先 Node 25 的问题不能由「npm 子进程意外仍使用 Node 25」解释。尚未证明 Prisma 5.22.0 对 Node 24 存在版本级不兼容：直接 CLI 的 `--version` 成功，失败点被收敛在生成阶段。应在不变更依赖的前提下，以 Node 22 LTS 重复完整链路，区分 Node 24 ABI/运行时差异与 Windows 上的 Prisma 引擎或网络环境问题。

## 运行时与参考资料

| 项目 | 证据 |
| --- | --- |
| 系统默认运行时 | Node.js `v25.2.1`，npm `11.6.2` |
| bundled 运行时 | `C:\Users\11458\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`，Node.js `v24.14.0`，`win32/x64` |
| npm/npx CLI | `D:\Softwares\node_modules\npm\bin\{npm,npx}-cli.js`，npm `11.6.2`；由 bundled `node.exe` 显式启动 |
| Prisma 锁定版本 | `prisma@5.22.0`、`@prisma/client@5.22.0`（安装后由 package manifest 确认） |
| Prisma 官方要求 | 官方系统要求页说明 Prisma 官方支持 Node.js LTS；本次没有把较新的页面列出的版本范围倒推为 5.22 的版本承诺。来源：<https://www.prisma.io/docs/orm/reference/system-requirements> |
| Next 16.2.6 本地文档 | 已阅读隔离安装的 `node_modules/next/dist/docs/01-app/01-getting-started/01-installation.md`、`18-upgrading.md`、`02-guides/debugging.md`。安装文档要求 Node.js 至少 `20.9`，因此 Node 22/24 均满足 Next 的最低门槛。 |

## 命令与结果

所有 npm/npx 命令均以如下方式启动，避免 PowerShell 的 `D:\Softwares\npm.ps1` 将子进程绑定回系统 `node.exe`：

```powershell
$node24 = 'C:\Users\11458\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$npmCli = 'D:\Softwares\node_modules\npm\bin\npm-cli.js'
$npxCli = 'D:\Softwares\node_modules\npm\bin\npx-cli.js'
$env:PATH = (Split-Path $node24 -Parent) + ';' + $env:PATH
```

| 命令 | 退出码 | 时长 | 结果 |
| --- | ---: | ---: | --- |
| `node24 -p "process.version + process.execPath"` | 0 | < 1 秒 | 输出 `v24.14.0` 和 bundled `node.exe` 绝对路径。 |
| `node24 npm-cli.js --version` | 0 | < 1 秒 | npm `11.6.2`；npm CLI 本身由 Node 24 进程承载。 |
| `node24 npx-cli.js --version` | 0 | < 1 秒 | npx `11.6.2`；npx CLI 本身由 Node 24 进程承载。 |
| `node24 npm-cli.js ci --ignore-scripts --no-audit --no-fund` | 0 | 39.208 秒 | 在全新隔离目录安装 521 个包；唯一警告为 `node-domexception@1.0.0` 已弃用。 |
| `node24 npx-cli.js --no-install prisma --version` | 124 | 34.044 秒 | 无 stdout/stderr，工具时限终止。 |
| `node24 npx-cli.js --no-install prisma generate` | 124 | 364.023 秒 | 无 stdout/stderr，工具时限终止。 |
| `node24 node_modules/prisma/build/index.js --version` | 0 | 3.620 秒 | 直接 CLI 成功，并明确报告 `Node.js : v24.14.0`、`Computed binaryTarget : windows`、Windows query/schema engine。 |
| `node24 node_modules/prisma/build/index.js generate` | 无正常退出码（受控终止） | 约 122 秒 | 无 stdout/stderr；为避免遗留进程受控终止。与 npx 路径一致地卡在生成阶段。 |
| `node -e "require.resolve('@prisma/client')"` | 未运行 | — | 生成门禁未通过，不将安装期包解析误报为可用生成客户端。 |
| `npm run test:unit` | 未运行 | — | 测试数：0；生成门禁未通过。 |
| `npm run lint` | 未运行 | — | 生成门禁未通过。 |
| `npm run build` | 未运行 | — | 生成门禁未通过。 |

## 失败、修正与分类

| 原始操作 | 退出码 / stderr | 分类 | 修正后证据 |
| --- | --- | --- | --- |
| 主工作树复合读取命令读取 `node_modules/next/dist/docs`、Prisma package manifest | 1；`Cannot find path ... node_modules\\next\\dist`、`MODULE_NOT_FOUND` | 路径/前置条件 | 在隔离目录完成 `npm ci --ignore-scripts` 后，本地 Next 文档与 Prisma 5.22.0 manifest 均可读取。 |
| 工具调用结果处理 | 未执行 shell；`TypeError: Cannot read properties of undefined (reading 'map')` | 工具调用包装异常 | 更正返回值处理后，后续 shell 命令均正常获得退出码与输出。 |
| 假定 `C:\\Program Files\\nodejs\\node_modules\\npm\\bin` | 1；`Cannot find path`、`MODULE_NOT_FOUND` | 路径/PATH 配置 | 发现实际 npm 安装在 `D:\\Softwares`；不用其 `.ps1` 包装器，改由 Node 24 显式运行 `npm-cli.js`/`npx-cli.js`。 |
| `npm exec --no -- node -p ...` 诊断 | 子步骤 1；`npx canceled due to missing packages ... node@26.5.0` | 诊断命令语义错误，非 Prisma/Node 24 兼容性 | 改用 Prisma 的本地 CLI；直接 CLI 已明确输出 Node 24。该子步骤不影响前一条 `npm ci` 的退出码 0。 |
| `npx prisma` | 124、无输出 | npx 包装器/子进程路径异常 | 检查 `node_modules/.bin/prisma.cmd`：无同目录 node 时回退至 `node`；已将 Node 24 bin 置于 PATH 首位。直接 Node 24 启动 CLI 后，`--version` 成功而 `generate` 仍挂起，故生成问题并非仅由 npx 引起。 |

## Node 22 LTS 精确复现方案（不安装、不升级）

当前环境未发现已安装的 Node 22，因此本次没有下载或安装它。待负责人提供 Node 22 LTS 的绝对路径后，在一个新的空目录执行以下命令；不得使用系统 `npm`/`npx` 包装器：

```powershell
$node22 = 'C:\\absolute\\path\\to\\node-v22.x.x-win-x64\\node.exe'
$npmCli = 'D:\\Softwares\\node_modules\\npm\\bin\\npm-cli.js'
$npxCli = 'D:\\Softwares\\node_modules\\npm\\bin\\npx-cli.js'
$iso22 = 'C:\\Users\\11458\\AppData\\Local\\Temp\\mythrealms-node22-prisma-<timestamp>'

New-Item -ItemType Directory -Path $iso22
Copy-Item package.json, package-lock.json -Destination $iso22
Copy-Item prisma -Destination $iso22 -Recurse
Set-Location $iso22
$env:PATH = (Split-Path $node22 -Parent) + ';' + $env:PATH

& $node22 -p "JSON.stringify({version:process.version,execPath:process.execPath})"
& $node22 $npmCli ci --ignore-scripts --no-audit --no-fund
& $node22 $npxCli --no-install prisma --version
& $node22 '.\\node_modules\\prisma\\build\\index.js' generate
& $node22 -e "console.log(require.resolve('@prisma/client'))"
& $node22 $npmCli run test:unit
& $node22 $npmCli run lint
& $node22 $npmCli run build
```

每条命令均需单独记录开始/结束时间、退出码、完整 stdout/stderr 与单测数量；仅在直接 CLI 的 `generate` 返回 0 后才继续客户端解析、单测、lint、build。若 Node 22 成功而 Node 24 仍挂起，可将差异收敛为 Node 24/Prisma 5.22 Windows 运行时组合；若 Node 22 同样挂起，应继续调查 Prisma schema-engine 启动及网络/安全软件拦截，而不是修改应用或升级 Prisma。
