# MythRealms 生产技术验收记录

**验收日期：** 2026-07-19

**验收分支：** `codex/cold-start-next-stage`

**本地提交：** `8f6e3b0`

**临时生产域名：** `https://mythrealms-shop.vercel.app`

## 结论

仓库代码、生产构建、本地生产服务器、公开页面、SEO 入口和数据库连接已经通过本轮技术检查。站点仍未达到“可放心接收真实订单”的完整门槛，当前明确阻塞项为订单邮件发件人未配置，以及 PayPal Webhook 无法通过只读验证。

当前中国网络无法稳定连接 `vercel.app`，因此本轮不能把 Vercel 公开页面标记为生产已验证。该限制只说明当前验收网络不可用，不代表美国用户访问失败；仍需使用美国网络重新检查线上页面。

## 本地质量门槛

| 项目 | 命令 | 结果 |
| --- | --- | --- |
| 完整单元测试 | `npm run test:unit` | 通过：340 项，0 失败 |
| Lint | `npm run lint` | 通过：0 错误，34 条既有警告 |
| 生产构建 | `npm run build` | 通过：Next.js 16.2.6 编译、类型检查和 137 个静态页面生成成功 |

测试中的邮件失败日志来自预期失败场景；最终测试汇总仍为 340 项通过、0 项失败。

## 启动检查

运行时仅在当前进程中设置 `LAUNCH_ALLOW_VERCEL_APP_URL=true`，没有修改 `.env` 或提交密钥。`launch:check` 为只读操作：检查数据库结构，读取 PayPal Webhook 配置，不创建订单、不扣款、不退款、不发送邮件。

| 检查项 | 结果 | 说明 |
| --- | --- | --- |
| Environment | 失败 | 本地缺少 `RESEND_FROM_EMAIL` |
| App URL | 通过 | `NEXT_PUBLIC_APP_URL` 与 `AUTH_URL` 使用相同的临时 Vercel 地址 |
| Database | 通过 | 支付所需表结构存在 |
| Resend sender | 失败 | 未配置经过邮件服务商验证的发件人 |
| PayPal webhook | 失败 | 只读检查无法确认 Webhook ID、URL和事件配置 |

本地变量存在性检查还显示：`CRON_SECRET`、`NEXT_PUBLIC_GA_ID` 和 `NEXT_PUBLIC_META_PIXEL_ID` 已存在；`NEXT_PUBLIC_PINTEREST_TAG_ID` 缺失。这里只记录存在性，不证明 Vercel Production 中的变量值正确，也不输出任何密钥。

## 本地生产页面检查

使用成功构建的生产包在 `http://127.0.0.1:3107` 启动 `next start`，以下路径全部返回 HTTP 200：

```text
/
/robots.txt
/sitemap.xml
/blog
/products/new-series-round-shell-disc-drops
/cart
/checkout
/shipping
/refund
/privacy
/terms
/api/feed
/api/health
```

`/api/health-db` 返回 HTTP 200，并报告数据库已连接。该检查只验证连接和读取，不创建或修改订单。

## SEO 入口检查

- `robots.txt` 包含 `OAI-SearchBot` 规则。
- `robots.txt` 指向 `https://mythrealms-shop.vercel.app/sitemap.xml`。
- Sitemap 共包含 62 个 URL。
- Sitemap 中包含 `/blog` 和 Moon Disc 商品页。
- Sitemap URL 统一使用 `https://mythrealms-shop.vercel.app` 根地址；根 URL 本身不带末尾斜杠，其余页面使用同一主机。

## 线上验证限制

- 当前网络对 `vercel.app` 的 HTTPS 连接被重置，普通请求、固定 Vercel IP 请求和浏览器加载均未成功。
- Web 抓取器也拒绝打开该临时地址，因此不能获得独立的线上响应证据。
- 先前 Vercel 控制台记录显示 Production 为 `Ready`，来源提交为 `86961c9`；本地当前提交 `8f6e3b0` 尚不能视为已部署。

## 下一动作

1. 在 Resend 中验证可用发件域名或发件地址，并在 Vercel Production 设置 `RESEND_FROM_EMAIL`。
2. 在 PayPal Live 控制台确认 Webhook URL 为 `https://mythrealms-shop.vercel.app/api/webhooks/paypal`，并启用 `PAYMENT.CAPTURE.COMPLETED` 与 `PAYMENT.CAPTURE.REFUNDED`。
3. 重新运行本地检查时继续把 `LAUNCH_ALLOW_VERCEL_APP_URL=true` 作为命令级临时变量；它只是验收脚本的临时域名许可，不需要写入 Vercel Production。
4. 使用美国网络验证首页、商品页、购物车、结账、政策页、`robots.txt` 和 `sitemap.xml`。
5. 完成以上配置后重新运行 `npm run launch:check`；所有检查通过前，不执行真实支付验收。
