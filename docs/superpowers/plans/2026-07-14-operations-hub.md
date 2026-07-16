# MythRealms 运营中枢实施计划

> **执行要求：** 使用 `superpowers:executing-plans` 或 `superpowers:subagent-driven-development` 按任务逐项执行。每项遵循 RED -> GREEN -> REFACTOR，并在进入下一项前完成验证。

**目标：** 在 `/admin/operations` 交付中文运营中枢：人工录入并审核 1688 选品、通过 Microsoft Graph 自动处理低风险 Outlook 客服邮件、记录全部动作，并在每天北京时间 09:00 向 `mythrealms@outlook.com` 发送运营日报。

**架构：** 1688 只接收人工录入的候选链接和成本资料，不抓取、不调用未授权接口、不自动公开商品。选品评分、邮件分类、自动回复判断和日报组装是可注入依赖的纯服务；Route Handler 只做鉴权、校验和调用 Prisma/第三方 API。Graph 以 OAuth 长期令牌和邮件 Webhook 接收新邮件，Cron 只续订订阅、生成日报和运行已批准的日常任务。

**技术栈：** Next.js 16.2.6 App Router、React 19、TypeScript、Prisma 5、Node 内置 `node:test` + `tsx`、Microsoft Graph REST API、Resend、可选 Google Analytics Data API（`google-auth-library`）。

## 全局约束

- 后台页和管理 API 使用 `requireAdminPage()` / `requireAdminApi()`；Webhook 仅允许 Graph 验证和通过 `clientState` 检查的通知。
- 自动发送仅用于确定的订单/物流状态与低风险 FAQ。退款、取消、改地址、质量投诉、支付争议、供应商报价、未知邮件一律高优先级草稿。
- 订单状态只从本地已验证订单读取；无有效订单匹配或物流号时，不承诺发货时间或物流状态。
- OAuth refresh token 与 webhook 密钥不进入浏览器、日志或响应。数据库保存 AES-256-GCM 的密文、IV 和认证标签。
- 自动、人工、失败、忽略动作全部审计；一个 Graph 邮件 ID 只处理一次。
- 不执行生产数据库修改或 Vercel 部署。环境变量核对后再由操作者执行 `npm run db:push`。
- 不回退、暂存或格式化本工作区中任何无关的既有改动。

## 任务 1：数据模型与运行时配置

**文件：** 修改 `prisma/schema.prisma`、`.env.example`；创建 `src/lib/operations/config.ts`、`src/lib/operations/types.ts`、`tests/operations-config.test.ts`。

**模型与接口：**
- `SupplierCandidate`：1688 链接、供应商、材质/规格、采购价（分）、MOQ、预估运费（分）、一件代发、评分、建议零售价、状态、审核说明。
- `MailboxConnection`：唯一 Graph 帐号、加密 refresh token、access token 过期时间、订阅 ID/过期时间、连接状态。
- `MailboxAutomationEvent`：Graph message ID、分类、决定、动作、优先级、关联订单、草稿/已发送文本、错误和时间戳。
- `OperationsReport`：报告日期、结构化区块 JSON、投递结果、生成时间。
- `getOperationsConfig()`：校验汇率、毛利率、报告收件人、Outlook 及可选 GA4 配置；缺少可选项返回明确未配置状态。

- [ ] **步骤 1：先写失败测试。** 覆盖默认汇率/毛利率、非法比例和汇率、无 GA4 返回 `configured: false`、生产环境缺 Graph 密钥时只禁用 Outlook 而保留选品。运行 `npm run test:unit -- tests/operations-config.test.ts`，预期模块缺失失败。
- [ ] **步骤 2：实现模型和配置。** 所有金额用 `Int` 分，JSON 用 `String`；候选 URL、Graph `messageId` 和连接邮箱各自唯一，并加入候选状态/分数、收件箱优先级/状态、报告日期索引。`.env.example` 只加占位符：`OPERATIONS_REPORT_RECIPIENT`、`OPERATIONS_CNY_USD_RATE`、`OPERATIONS_TARGET_GROSS_MARGIN`、`MICROSOFT_GRAPH_CLIENT_ID`、`MICROSOFT_GRAPH_CLIENT_SECRET`、`MICROSOFT_GRAPH_TENANT_ID`、`MICROSOFT_GRAPH_REDIRECT_URI`、`MICROSOFT_GRAPH_WEBHOOK_CLIENT_STATE`、`AUTOMATION_ENCRYPTION_KEY`、`GOOGLE_ANALYTICS_PROPERTY_ID`、`GOOGLE_SERVICE_ACCOUNT_JSON`。
- [ ] **步骤 3：验证。** 运行 `npm run test:unit -- tests/operations-config.test.ts` 和 `npx prisma validate`，预期通过。

## 任务 2：1688 候选成本、评分、状态机

**文件：** 创建 `src/lib/operations/candidate-scoring.ts`、`src/lib/operations/candidates.ts`、`tests/operations-candidate-scoring.test.ts`。

**接口：** `parseCandidateInput(value)` 标准化输入和金额；`scoreCandidate(candidate, config)` 返回 0–100 分、理由、到岸 USD 分、建议零售价 USD 分；`transitionCandidateStatus(from, to)` 仅允许 `PENDING` 与 `APPROVED`/`REJECTED` 间的确认状态转换，绝不创建公开商品。

- [ ] **步骤 1：写失败测试。** 校验 1688/Alibaba HTTP(S) URL、非负金额、正整数 MOQ、必填供应商/材质；固定评分为到岸成本 30、MOQ 20、一件代发 20、资料完整度 20、低成本低 MOQ 奖励 10。建议零售价采用 `到岸 USD / (1 - 目标毛利率)` 向上取整美元；同样输入必须得到相同得分与理由。运行 `npm run test:unit -- tests/operations-candidate-scoring.test.ts`，预期失败。
- [ ] **步骤 2：实现纯逻辑与 Prisma 仓储适配器。** 仅保存人工输入链接，不发出 1688 请求；评分模块不导入 Prisma，仓储处理创建、筛选、审核状态更新与重新评分。
- [ ] **步骤 3：验证。** 运行 `npm run test:unit -- tests/operations-candidate-scoring.test.ts`，预期通过。

## 任务 3：候选管理 API 与后台界面

**文件：** 创建 `src/app/api/admin/operations/candidates/route.ts`、`src/app/api/admin/operations/candidates/[id]/route.ts`、`src/components/admin/OperationsCandidateQueue.tsx`、`src/app/admin/operations/page.tsx`、`tests/operations-candidate-api.test.ts`；修改 `src/components/admin/AdminShell.tsx`。

**接口：** `GET /api/admin/operations/candidates?status=&sort=` 返回候选、成本、建议售价、评分和理由；`POST` 仅创建 `PENDING`，重复链接返回 409；`PATCH /:id` 只接受验证后字段与状态迁移，并写审核说明。

- [ ] **步骤 1：写失败测试。** 覆盖管理员守卫、无效 JSON 的 400、重复 URL 的 409、客户无权读写，及 `APPROVED` 不会创建或修改 `Product`。运行 `npm run test:unit -- tests/operations-candidate-api.test.ts`，预期失败。
- [ ] **步骤 2：实现 API 和中文界面。** 后台导航新增“运营中枢”。三个标签页的容器先提供“1688 候选”：紧凑表单、状态/分数排序、外链、一件代发标记、到岸成本、建议售价、得分依据与通过/退回/待定操作。候选不会出现在客户侧。
- [ ] **步骤 3：验证。** 运行 `npm run test:unit -- tests/operations-candidate-api.test.ts`、`npx tsc --noEmit --pretty false`，并以管理员身份在 320px、390px、桌面检查表单和表格无溢出、文字不遮挡。

## 任务 4：Graph OAuth、加密和 Outlook Webhook

**文件：** 创建 `src/lib/operations/token-crypto.ts`、`src/lib/operations/microsoft-graph.ts`、`src/lib/operations/outlook-connection.ts`、`src/app/api/admin/operations/outlook/connect/route.ts`、`src/app/api/admin/operations/outlook/callback/route.ts`、`src/app/api/webhooks/outlook/route.ts`、`tests/operations-token-crypto.test.ts`、`tests/operations-outlook-webhook.test.ts`。

**接口：** `encryptSecret` / `decryptSecret` 使用 AES-256-GCM；`createMicrosoftAuthorizationUrl(state)` 请求 `offline_access Mail.Read Mail.Send`；`exchangeCodeAndSaveConnection` 加密保存令牌；`renewInboxSubscription` 订阅 `/me/messages`；Webhook 在十秒内以 `text/plain` 原样回显 `validationToken`，其他通知以 `clientState`、订阅 ID 和幂等键验证后入队。

- [ ] **步骤 1：先查阅最新 Microsoft Graph 官方文档并写失败测试。** 复核个人 Microsoft 帐号 OAuth 参数、订阅资源和有效期上限。测试加解密往返/错误密钥拒绝、验证回显、错误 `clientState` 拒绝、重复 `messageId` 不重复入队。运行 `npm run test:unit -- tests/operations-token-crypto.test.ts tests/operations-outlook-webhook.test.ts`，预期失败。
- [ ] **步骤 2：实现安全连接边界。** 所有 Graph 请求置于 server-only 模块；`state` 使用 HttpOnly、SameSite=Lax、短有效期 cookie 绑定发起管理员。回调校验后存连接并建订阅；通知不信任携带正文，改由服务器向 Graph 读取实际邮件。网络和 API 失败落审计事件。
- [ ] **步骤 3：验证。** 运行 `npm run test:unit -- tests/operations-token-crypto.test.ts tests/operations-outlook-webhook.test.ts` 与 `npx tsc --noEmit --pretty false`。

## 任务 5：邮件分类、订单匹配、自动回复和草稿

**文件：** 创建 `src/lib/operations/email-automation.ts`、`src/lib/operations/mailbox-events.ts`、`src/app/api/admin/operations/inbox/route.ts`、`src/app/api/admin/operations/inbox/[id]/route.ts`、`tests/operations-email-automation.test.ts`。

**接口：** `classifyIncomingMessage(message)` 返回订单状态、物流、配送 FAQ、护理 FAQ、退款、取消、改地址、质量问题、支付争议、供应商、营销、未知；`matchMessageToOrder(message, orders)` 只在订单号和邮箱证据充分时关联；`decideMailboxAction` 返回 `AUTO_REPLY`、`DRAFT_HIGH_PRIORITY`、`IGNORE`；`processMailboxEvent(eventId)` 保证幂等地取信、生成草稿、发送或记录失败。

- [ ] **步骤 1：写失败测试。** 覆盖有物流号的已发货订单查询自动回复；待发货订单只出草稿且不承诺日期；尺寸/保养 FAQ 可自动回复；含退款、取消、地址、质量、拒付、供应商报价的任意邮件均高优先级草稿；无法匹配订单不自动发；重复事件幂等。运行 `npm run test:unit -- tests/operations-email-automation.test.ts`，预期失败。
- [ ] **步骤 2：实现分类、模板和审计。** 文案只陈述已支持的政策与事实。自动回复前再次确认未处理；Graph 失败写 `FAILED` 并保留草稿。管理员 inbox API 可筛选、查看摘要、修改草稿、手动发送或忽略；所有手动动作也审计。
- [ ] **步骤 3：验证。** 运行 `npm run test:unit -- tests/operations-email-automation.test.ts tests/authorization.test.ts` 与 `npx tsc --noEmit --pretty false`。

## 任务 6：日报、可选 GA4 和每日 Cron

**文件：** 创建 `src/lib/operations/ga4.ts`、`src/lib/operations/report.ts`、`src/app/api/admin/operations/reports/route.ts`、`src/components/admin/OperationsDailyReport.tsx`、`tests/operations-report.test.ts`；修改 `src/app/api/cron/daily/route.ts`、`vercel.json`、`package.json`。

**接口：** `getGa4Snapshot()` 仅在配置齐全时拉取真实 GA4 指标，否则返回带原因的 `unavailable`；`buildOperationsReport(date, dependencies)` 汇总订单/销售、候选、收件箱、GA4、异常；`sendOperationsReport(report)` 通过 Resend 投递到 `OPERATIONS_REPORT_RECIPIENT` 并持久化结果；Cron 使用 UTC `0 1 * * *`（全年对应北京时间 09:00），续订 Graph、发日报、并隔离原有 Pinterest/SEO 子任务失败。

- [ ] **步骤 1：安装最小认证依赖并写失败测试。** 增加 `google-auth-library`，不用浏览器 SDK。以假仓储/发送器测试金额和各区块汇总、未配 GA4 仍发报告、子任务失败隔离、按日期幂等。运行 `npm run test:unit -- tests/operations-report.test.ts`，预期失败。
- [ ] **步骤 2：实现报告和编排器。** 订单/销售仅来自本地订单状态，复用 `src/lib/email.ts` 的 Resend 通道，加入文本和 HTML 报告。替换现有 Cron 中日报 `skipped` 占位，报告不含客户地址、付款资料或 OAuth 数据。
- [ ] **步骤 3：验证。** 运行 `npm run test:unit -- tests/operations-report.test.ts`、`npm run test:unit`、`npx prisma validate`、`npm run build`。若既有 Neon 不可达提示仍零退出，记录为环境警告。

## 任务 7：整合界面、中文接入文档和最终复核

**文件：** 修改 `src/app/admin/operations/page.tsx`、`src/components/admin/OperationsCandidateQueue.tsx`、`src/components/admin/OperationsDailyReport.tsx`、`.env.example`；创建 `src/components/admin/OperationsInboxQueue.tsx`、`docs/operations-outlook-setup.md`；按需要修改测试。

- [ ] **步骤 1：完成三个标签页。** 每日报告显示最新报告、GA4 状态和投递结果；1688 候选复用任务 3；收件箱按高优先级优先，支持摘要、订单关联、草稿编辑、发送/忽略。显示 Outlook 连接状态和仅管理员可见的连接命令；未连接时解释状态但不暴露密钥。
- [ ] **步骤 2：编写中文接入指南。** 覆盖 Azure App Registration、个人 Outlook 授权、回调 URL、公开 HTTPS Webhook、订阅续订、Resend、GA4 service account、生成 `AUTOMATION_ENCRYPTION_KEY`、配置 Cron 和 `npm run db:push`。明确 Graph 生产通知要求线上 HTTPS；`localhost` 仅可测 OAuth/界面。
- [ ] **步骤 3：最终验证。** 运行 `npm run test:unit`、`npx tsc --noEmit --pretty false`、`npx prisma validate`、`npm run build`、`git diff --check`。复用或启动本地服务，检查 `/admin/operations` 在桌面、390px、320px 无横向滚动。以测试替身确认：候选不创建 `Product`、高风险邮件不调用 Graph 发送、错误 `clientState` 不入队、未授权 Cron 返回 401。
- [ ] **步骤 4：安全复核与交付。** 检查所有新管理路由有 `requireAdminApi()`、Webhook 只接受验证/合法通知、令牌不出现在日志/响应/客户端 bundle、失败事件被审计。报告数据库、Azure/Graph、Resend、GA4、生产 URL 的用户配置步骤；不暂存或提交其他无关改动。
