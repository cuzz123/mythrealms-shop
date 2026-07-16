# 运营中枢邮箱与日报接入
运营中枢依次包含三个流程：手工1688候选录入与审核、Outlook 客服邮件分流、每日北京时间 09:00 日报。选品模块不依赖 Outlook 或 GA4；后两者未配置时会在对应流程中跳过。

## 1. 部署前准备

1. 将站点部署到具有公开 HTTPS 域名的环境。Microsoft Graph 的 webhook 不接受 localhost。
2. 确认 `NEXT_PUBLIC_APP_URL` 是唯一、无尾部斜杠的公网域名，例如 `https://your-domain.com`。
3. 将以下值配置到生产环境：

```dotenv
OPERATIONS_REPORT_RECIPIENT="mythrealms@outlook.com"
OPERATIONS_CNY_USD_RATE="0.14"
OPERATIONS_TARGET_GROSS_MARGIN="0.70"
CRON_SECRET="一个足够长的随机字符串"
```

`OPERATIONS_CNY_USD_RATE` 表示 1 元人民币兑多少美元。未设置时使用 `0.14`；目标毛利率未设置时使用 `0.70`。

## 2. 创建 Microsoft 应用

1. 打开 [Azure Portal App registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)，选择 **New registration**。
2. 名称可以填 `MythRealms Operations` 。支持的帐户类型选择 **Accounts in any organizational directory and personal Microsoft accounts** 或包含个人 Microsoft 账户的选项。
3. 在 **Web** 里填写重定向 URI：

```text
https://your-domain.com/api/admin/operations/outlook/callback
```

4. 创建后，在 **Overview** 复制 Application (client) ID。
5. 在 **Certificates & secrets** 创建 client secret，立即复制 **Value**（不是 Secret ID）。
6. 在 **API permissions** 为 **Microsoft Graph / Delegated permissions** 添加：`User.Read`、`Mail.Read`、`Mail.Send`。`offline_access` 会由 OAuth 请求时自动带上，不需要单独增加。不需要 Application permissions，也不应给予更宽泛的邮箱权限。

本项目针对个人 Outlook 账户使用 `consumers` 租户。如使用组织 Microsoft 365 账户，请以组织租户 ID 替换它，并根据组织策略完成管理员同意。

## 3. 配置环境变量

将以下变量填入 Vercel 或其他部署平台的 Production 环境：

```dotenv
MICROSOFT_GRAPH_CLIENT_ID="Azure 应用的 client ID"
MICROSOFT_GRAPH_CLIENT_SECRET="Azure 中复制的 secret Value"
MICROSOFT_GRAPH_TENANT_ID="consumers"
MICROSOFT_GRAPH_REDIRECT_URI="https://your-domain.com/api/admin/operations/outlook/callback"
MICROSOFT_GRAPH_WEBHOOK_CLIENT_STATE="长随机字符串"
AUTOMATION_ENCRYPTION_KEY="32 字节 Base64 密钥"
```

在 PowerShell 生成 `AUTOMATION_ENCRYPTION_KEY`：

```powershell
[byte[]]$bytes = 1..32 | ForEach-Object { Get-Random -Maximum 256 }
[Convert]::ToBase64String($bytes)
```

不要将 `MICROSOFT_GRAPH_CLIENT_SECRET`、`AUTOMATION_ENCRYPTION_KEY`或 Graph 刷新令牌放入 `NEXT_PUBLIC_` 变量、前端代码或 Git 仓库。刷新令牌会以 AES-256-GCM 加密后保存在数据库。

## 4. 连接 Outlook 并验证 webhook

1. 部署新环境变量后，运行 `npm run db:push` 将运营数据表推送到数据库。
2. 以管理员登录站点，打开 **运营中枢**，点击 Outlook 连接按钮，完成 `mythrealms@outlook.com` 授权。
3. 回调成功后，系统会为 Inbox 创建一个 Microsoft Graph 订阅。收到新邮件时，`/api/webhooks/outlook` 会先验证 `clientState`，再写入可幂等的处理队列。
4. Graph 订阅会在接近到期时由每日 Cron 续期。请保持每日 `/api/cron/daily` 能被平台调用；`vercel.json` 已配置为 UTC 01:00，即北京时间 09:00。

自动回复仅限于已发货订单的有效追踪号，和低风险的尺寸/保养 FAQ。取消、退款、收件信息变更、品质、付款争议、供应商和未知邮件仅会生成高优先级草稿，必须由人工审阅。

## 5. 日报和 GA4（可选）

日报通过 Resend 发送。除了 `RESEND_API_KEY`，如需要指定已验证的发件人，再配置：

```dotenv
OPERATIONS_REPORT_FROM="MythRealms <ops@your-domain.com>"
```

GA4 是可选的。在 GA4 Property 中将 service account 邮箱账号加为阅读者，然后配置：

```dotenv
GOOGLE_ANALYTICS_PROPERTY_ID="properties/123456789"
GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
```

两个 GA4 值只要有一个缺失，日报会标记 GA4 未配置，不会阻塞选品、邮件队列或日报生成。
