# MythRealms n8n 自动化工作流 — 设置指南

## 一、安装 n8n (5 分钟)

### 方案 A: n8n Cloud
1. 打开 https://app.n8n.cloud/register
2. 注册 → 创建 workspace → 完成

### 方案 B: 自托管
```bash
npm install -g n8n
n8n start
```
打开 http://localhost:5678

---

## 二、导入工作流

1. n8n 首页 → "Import from File"
2. 选择 `/content/n8n-workflows/` 下的 JSON 文件
3. 逐个导入全部 7 个工作流

---

## 三、配置凭证

### Pinterest API
1. n8n → Credentials → Pinterest OAuth2 API
2. 填入 Pinterest App ID + App Secret

### Facebook / Instagram (Meta Graph API)
1. 打开 https://developers.facebook.com → 创建 App → 类型 "商务"
2. 添加产品: Instagram Basic Display + Instagram Graph API
3. https://developers.facebook.com/tools/explorer → 获取 Page Access Token
4. 权限: `pages_manage_posts` + `instagram_basic` + `instagram_content_publish`
5. n8n → Credentials → Facebook Graph API → 填入 Token

### Email (Resend SMTP)
- SMTP 服务器: smtp.resend.com
- 端口: 587
- 用户名: resend
- 密码: 你的 Resend API Key

---

## 四、可用工作流

| 工作流 | 功能 | 触发 |
|------|------|------|
| daily-pinterest-pin.json | AI 生成 + 发布 Pin | 每天 20:00 EST |
| daily-instagram-post.json | 自动发 IG 产品图 | 每天 10:00 EST |
| daily-facebook-post.json | 自动发 FB Page 帖文 | 每天 10:15 EST |
| cross-platform-sync.json | AI 内容一键同步 Pin/IG/FB | 每天 09:00 EST |
| daily-report-email.json | 运营数据报告邮件 | 每天 08:00 |
| abandoned-cart-recovery.json | 弃单检测 + 邮件 | 每小时 |
| low-stock-alert.json | 库存预警邮件 | 每天 |

---

## 五、Instagram & Facebook 前置步骤

1. Facebook → 创建页面 → "品牌/产品" → 名称 MythRealms → 类别 "珠宝/手表"
2. Instagram → 设置 → 切换到专业账号 → 关联 Facebook Page
3. 在 n8n 工作流中替换:
   - `YOUR_INSTAGRAM_BUSINESS_ID` → 你的 IG 商业账号 ID
   - `YOUR_FACEBOOK_PAGE_ID` → 你的 FB Page ID

---

## 六、API 端点

| 端点 | 用途 |
|------|------|
| POST /api/automation/generate-pin | AI 生成 Pin 内容 |
| POST /api/automation/daily-report | 订单/库存/收入数据 |
| GET /api/feed/google | Google Shopping Feed |
| GET /api/products | 产品列表 |

---

## 七、测试

导入后点击 "Execute Workflow" 手动测试。确认无误后切换到 "Active"。
