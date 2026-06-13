# MythRealms n8n 自动化工作流 — 设置指南

## 一、安装 n8n (5 分钟)

### 方案 A: n8n Cloud (最简单，免费额度 1,000 次/月)
1. 打开 https://app.n8n.cloud/register
2. 注册 → 创建 workspace → 完成

### 方案 B: 自托管 (无限免费)
```bash
npm install -g n8n
n8n start
```
然后打开 http://localhost:5678

---

## 二、导入工作流

1. n8n 首页 → **"Import from File"**
2. 选择 `/content/n8n-workflows/` 下的 JSON 文件
3. 逐个导入 5 个工作流

---

## 三、配置凭证

### Pinterest API
1. n8n → **Credentials** → **Pinterest OAuth2 API**
2. 填入你的 Pinterest App ID 和 App Secret
3. 授权

### Email (Resend / SMTP)
1. n8n → **Credentials** → **SMTP**
2. 或者用 Resend 的 SMTP: smtp.resend.com, 端口 587

---

## 四、可用工作流

| 工作流 | 功能 | 触发器 |
|------|------|------|
| `daily-pinterest-pin.json` | 每天生成 1 条 Pin 文案 + 发布 | 每天 20:00 EST |
| `daily-report-email.json` | 每天发送运营数据报告 | 每天 08:00 |
| `weekly-blog-generator.json` | 每周生成 1 篇博客草稿 | 每周一 |
| `abandoned-cart-recovery.json` | 每小时检查弃单 + 发邮件 | 每小时 |
| `low-stock-alert.json` | 库存 <5 时发邮件通知 | 每天 |

---

## 五、API 端点

| 端点 | 用途 |
|------|------|
| `POST /api/automation/generate-pin` | AI 生成 Pin 标题+描述 |
| `POST /api/automation/daily-report` | 拉取订单/库存/收入数据 |
| `POST /api/automation/inventory-alert` | 检查低库存产品 |
| `GET /api/feed/google` | Google Shopping Feed |
| `GET /api/products` | 产品列表 |

---

## 六、测试工作流

导入后点击 **"Execute Workflow"** 手动测试。确认无误后切换到 **"Active"**。
