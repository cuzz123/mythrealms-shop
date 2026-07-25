# Maverenne Phase 3 Domain Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在获得逐项授权后，把已验证的 Maverenne 版本切换到新 canonical 域名，同步外部平台，并以可回滚的生产验收完成协调上线。

**Architecture:** 代码只依赖 `NEXT_PUBLIC_APP_URL` 和品牌常量；域名绑定、旧域名 301、分析平台与搜索平台通过各自控制台执行。上线采用单个已验证 commit，先配置后部署，再冻结内容发布 24 小时执行 smoke；任何硬门槛失败立即回滚。

**Tech Stack:** Vercel、Next.js 16、GA4、Google Search Console、Bing Webmaster Tools、Pinterest、TikTok、Resend、PayPal、Playwright、PowerShell/curl。

## Global Constraints

- 只有 `name_clearance_passed: true`、域名已归属、品牌邮箱可用、阶段一/二测试通过且创始人明确批准生产发布时才可开始。
- 新 canonical 只能是实际购买并绑定成功的 HTTPS 域名；禁止在代码中猜测域名。
- 旧域名和 Vercel 入口按原 path/query 重定向，至少维持 12 个月。
- 不执行数据库 schema 或商品数据迁移。
- 不改变商品路径、价格、库存、销售状态、支付提供商或广告状态。
- 上线窗口内暂停 Pinterest、TikTok、Reddit 和博客新增发布 24 小时。
- 发生购物、支付、邮件、canonical 或归因故障时立即回滚，不带故障继续观察。
- 部署前完整阅读 `node_modules/next/dist/docs/01-app/02-guides/production-checklist.md`，并按本项目 Next.js 16.2.6 行为验收。

---

### Task 1: 购买域名并冻结发布清单

**Files:**
- Create: `docs/company/maverenne-cutover-runbook.md`
- Modify: `docs/company/weekly-priorities.md`
- Modify: `docs/company/decision-log.md`

**Interfaces:**
- Produces: `domain_purchase_authorized: true`、`domain_owned: true`、`cutover_authorized: true`、`release_commit`、`new_canonical_origin`、`rollback_commit`

- [ ] **Step 1: 获取域名购买授权并完成购买**

重新检查 `maverenne.com` 的注册商实时状态，向创始人提交注册商、首年价格、续费价格、注册年限和隐私保护条款。只有创始人明确批准该价格与年限后写入 `domain_purchase_authorized: true` 并完成购买；购买成功后记录注册商订单凭证路径和 `domain_owned: true`，不得在仓库记录付款信息或登录凭据。

- [ ] **Step 2: 记录不可省略字段**

Runbook 必须记录：正式域名、注册商、Vercel project、发布 commit、回滚 commit、窗口开始/结束时间（America/New_York 与 Asia/Shanghai）、执行人、创始人授权时间、内容冻结时间。

- [ ] **Step 3: 执行门槛检查**

```powershell
rg -n "name_clearance_passed: true" docs/company/maverenne-name-clearance.md
npm run brand:check-public
npm run test:unit
npm run lint
npm run build
git status --short
```

Expected: 清查通过；所有命令退出 0；工作区仅包含本次已审核改动；发布 commit 与测试 commit 完全一致。

- [ ] **Step 4: 获取一次明确生产授权**

向创始人提交完整 runbook、变更清单和回滚 commit。只有回复明确授权该 commit、域名和窗口后，写入 `cutover_authorized: true`。授权不包含广告、采购、商品状态或数据库变更。

- [ ] **Step 5: 提交 runbook**

```bash
git add docs/company/maverenne-cutover-runbook.md docs/company/weekly-priorities.md docs/company/decision-log.md
git commit -m "docs: authorize Maverenne production cutover"
```

### Task 2: 配置域名、环境和品牌邮箱

**Files:**
- Modify: Vercel project environment variables (external)
- Modify: Vercel Domains settings (external)
- Modify: Resend domain/sender settings (external)
- Modify: `docs/company/maverenne-cutover-runbook.md`

**Interfaces:**
- Consumes: `new_canonical_origin`、已验证的品牌邮箱
- Produces: Production/Preview 环境的 `NEXT_PUBLIC_APP_URL`、`SUPPORT_EMAIL`、`RESEND_FROM_EMAIL`

- [ ] **Step 1: 绑定正式域名但暂不切主域**

在 Vercel 验证 DNS 与 TLS，然后从 runbook 读取实际域名并确认其到达目标 project：

```powershell
$cutoverOrigin = ((Select-String -Path 'docs/company/maverenne-cutover-runbook.md' -Pattern '^new_canonical_origin:').Line -replace '^new_canonical_origin:\s*','').Trim()
$parsedOrigin = $null
if (-not [Uri]::TryCreate($cutoverOrigin, [UriKind]::Absolute, [ref]$parsedOrigin) -or $parsedOrigin.Scheme -ne 'https') { throw 'runbook new_canonical_origin must be an absolute HTTPS URL' }
Invoke-WebRequest -Method Head -Uri "$cutoverOrigin/api/health" -MaximumRedirection 0
```

Expected: HTTP 200，证书主机名与 `new_canonical_origin` 一致。

- [ ] **Step 2: 设置生产环境变量**

从 runbook 读取已核验值，并在 Vercel Production 环境设置。`NEXT_PUBLIC_APP_URL` 会在 Next.js 构建时内联，因此这些变量必须在生产 build 之前写入，随后从同一 release commit 重新构建；不得只切 alias 或只改运行时环境：

```powershell
$cutoverOrigin = ((Select-String -Path 'docs/company/maverenne-cutover-runbook.md' -Pattern '^new_canonical_origin:').Line -replace '^new_canonical_origin:\s*','').Trim()
$supportEmail = ((Select-String -Path 'docs/company/maverenne-cutover-runbook.md' -Pattern '^support_email:').Line -replace '^support_email:\s*','').Trim()
$resendFrom = "Maverenne <$supportEmail>"
$cutoverOrigin | vercel env add NEXT_PUBLIC_APP_URL production
$cutoverOrigin | vercel env add AUTH_URL production
$supportEmail | vercel env add SUPPORT_EMAIL production
$resendFrom | vercel env add RESEND_FROM_EMAIL production
```

不得在仓库或 runbook 中写入 API key、DNS token 或服务账号 JSON。

- [ ] **Step 3: 验证邮件域**

Resend SPF、DKIM、DMARC 状态必须为 verified；向创始人控制的测试邮箱发送一封测试邮件，验证 From、Reply-To、品牌名和链接域名。失败则停止，不部署。

- [ ] **Step 4: 记录证据**

在 runbook 只记录平台、状态、验证时间和截图路径，不记录密钥。

### Task 3: 部署唯一已验证 commit

**Files:**
- Modify: Vercel production deployment (external)
- Modify: `docs/company/maverenne-cutover-runbook.md`

**Interfaces:**
- Consumes: Task 1 `release_commit`
- Produces: `deployment_id` 与生产 URL

- [ ] **Step 1: 部署 release commit**

从 Vercel 部署 runbook 指定的 commit；构建日志中的 commit SHA 必须完全一致。不得从脏工作区运行临时部署。

- [ ] **Step 2: 在新域名尚未设主域时做预检**

验证 `/`、`/collections/pearl-series`、12 个验证商品页、`/gifts`、`/blog`、`/about`、`/robots.txt`、`/sitemap.xml`、`/llms.txt`、`/api/feed` 均返回预期状态。

- [ ] **Step 3: 设置新域为主域并启用旧域重定向**

新域预检通过后设为 Production Domain。旧 MythRealms 域和 `mythrealms-shop.vercel.app` 配置为保留 path/query 的永久重定向；不得统一落到首页。

- [ ] **Step 4: 验证 301/308**

对首页、一个商品、一个 Pearl Guide、一个博客 URL 执行不跟随跳转请求；Location 必须为新 origin 加同路径。将实际响应头保存到 runbook。

### Task 4: 同步搜索、分析与社交平台

**Files:**
- Modify: Google Search Console property (external)
- Modify: Bing Webmaster Tools site (external)
- Modify: GA4 web stream (external)
- Modify: Pinterest/TikTok profile links (external)
- Modify: PayPal app return/webhook allowlist if configured (external)
- Modify: `docs/company/maverenne-cutover-runbook.md`

**Interfaces:**
- Consumes: 新 production origin 与 sitemap
- Produces: 各平台带时间戳的 verified 状态

- [ ] **Step 1: 搜索平台**

在 GSC 新增 Domain property 并提交 `${new_canonical_origin}/sitemap.xml`；在 Bing 新增站点并提交同一 sitemap。旧 property 保留，不删除。

- [ ] **Step 2: GA4 与 consent 验证**

更新 web stream URL。拒绝 analytics consent 时确认零 GA4 请求；接受后在 DebugView/Realtime 验证 `page_view`、`view_item`、`add_to_cart`、`begin_checkout`，仅在 sandbox/受控真实支付成功后验证 `purchase`。每个事件只出现一次。

- [ ] **Step 3: 社交平台**

Pinterest 与 TikTok 显示名称改为 Maverenne，主页链接改为新域名；不删除历史帖子。抽查三个历史 Pinterest URL，经旧域重定向后到达相同商品或内容路径。

- [ ] **Step 4: PayPal 回调与 webhook**

若 PayPal 配置绑定旧 origin，更新 return/cancel/webhook allowlist；使用 sandbox 完成一次支付，确认订单状态、库存扣减和确认邮件链路不变。未成功 capture 时不得产生 purchase。

### Task 5: 生产 smoke、混合品牌审计与回滚判定

**Files:**
- Create: `e2e/maverenne-production-smoke.spec.ts`
- Modify: `docs/company/maverenne-cutover-runbook.md`
- Modify: `docs/company/metrics.md`

**Interfaces:**
- Consumes: `playwright.config.ts` 已支持的环境变量 `BASE_URL`
- Produces: 可重复生产 smoke 结果和最终 GO/ROLLBACK 结论

- [ ] **Step 1: 写生产 smoke**

测试覆盖：

```ts
test("Maverenne production identity and commerce paths", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Maverenne/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\//);
  await expect(page.getByRole("link", { name: "Maverenne home" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("MythRealms");
  await page.goto("/products/pearl-series-01");
  await expect(page.getByRole("button", { name: /Add to Cart/ })).toBeVisible();
});
```

另覆盖 390×844 Cookie 横幅存在/关闭时 Sticky Add to Cart 可点击、购物车、结账前页、robots/sitemap/llms/feed、12 商品页和旧 URL 重定向。

- [ ] **Step 2: 运行生产 smoke**

Run:

```powershell
$env:BASE_URL = ((Select-String -Path 'docs/company/maverenne-cutover-runbook.md' -Pattern '^new_canonical_origin:').Line -replace '^new_canonical_origin:\s*','').Trim()
npx playwright test e2e/maverenne-production-smoke.spec.ts
```

Expected: 全部 PASS。

- [ ] **Step 3: 执行混合品牌扫描**

Run: `npm run brand:check-public`

再抓取首页、分类、12 商品、About、Journal、政策页、事务邮件样本，检查客户可见 `MythRealms` 为 0。旧品牌只允许出现在重定向配置和审计记录。

- [ ] **Step 4: 应用回滚条件**

以下任一情况立即把 Vercel production alias 回退到 runbook 的 `rollback_commit`，恢复旧主域路由，并保持外部平台记录不删除：商品/购物车/结账失败；事务邮件失败；canonical 指向错误；旧 URL 未按路径重定向；GA4 consent 违规；公开页面混用品牌。

- [ ] **Step 5: 记录最终状态**

全部通过后在 runbook 写 `cutover_status: complete`，在 `metrics.md` 记录新的 Day 0 时间与基线字段，所有流量/订单数没有读数时写 `待确认`，不得填 0。内容冻结满 24 小时且无 P0/P1 异常后恢复创始人手动发布。

- [ ] **Step 6: 提交测试与运行记录**

```bash
git add e2e/maverenne-production-smoke.spec.ts docs/company/maverenne-cutover-runbook.md docs/company/metrics.md
git commit -m "test: verify Maverenne production cutover"
```

### Task 6: 启动 30 天珠宝需求验证

**Files:**
- Modify: `docs/company/metrics.md`
- Modify: `docs/company/weekly-priorities.md`
- Modify: `docs/company/content-calendar.md`
- Create: `obsidian-vault/00-首页/ACT-2026-07-26｜Maverenne 30天珠宝需求验证.md`

**Interfaces:**
- Consumes: Task 5 的 `cutover_status: complete` 与新域名 Day 0 时间
- Produces: 单一 30 天验证窗口、最多 12 款商品、统一归因口径与阶段性判断

- [ ] **Step 1: 冻结验证范围**

记录最多 12 款现有商品及其 slug，不新增商品、采购或品类；渠道为 Pinterest、TikTok 与 SEO，全部使用新 canonical URL 和可区分的 UTM。广告状态固定为 `off`。

- [ ] **Step 2: 建立不虚构的 Day 0**

在 `metrics.md` 记录 America/New_York 与 Asia/Shanghai 的准确起始时间，以及 `sessions`、`engaged_sessions`、`view_item`、`add_to_cart`、`begin_checkout`、`purchase`、邮件订阅和渠道字段。读取不到的数据写 `待确认`，不得填 0。

- [ ] **Step 3: 固定判断门槛**

达到 300–500 次可归因美国访问后才作初步品类判断。诊断顺序固定为：无曝光看分发；有曝光无点击看创意/受众；点击高跳出看落地匹配；浏览无加购看商品/价值/信任；加购无结账看配送/支付/退换。

- [ ] **Step 4: 设置复盘点**

Day 7 只检查测量完整性和渠道异常；Day 14 检查访问质量与商品相对信号；Day 30 决定继续珠宝、调整商品池，或在珠宝获得足量访问但购买意图偏弱时提出发饰、胸针、包饰中的一个相邻品类实验。样本未达到 300 次时不得宣称赛道失败。

- [ ] **Step 5: 验证文档一致性并提交**

Run: `rg -n "300–500|12 款|广告状态|Day 7|Day 14|Day 30" docs/company/metrics.md docs/company/weekly-priorities.md docs/company/content-calendar.md 'obsidian-vault/00-首页/ACT-2026-07-26｜Maverenne 30天珠宝需求验证.md'`

Expected: 四份文件均使用同一窗口、商品上限和判断门槛，没有虚构基线。

```bash
git add docs/company/metrics.md docs/company/weekly-priorities.md docs/company/content-calendar.md 'obsidian-vault/00-首页/ACT-2026-07-26｜Maverenne 30天珠宝需求验证.md'
git commit -m "docs: start Maverenne 30-day jewelry validation"
```
