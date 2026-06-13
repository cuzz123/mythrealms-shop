# Make.com 操作指南 (2026年6月最新版)

## 一、注册 (2 分钟)

1. 打开 https://make.com
2. 点右上角 **"Sign up free"**
3. 用 Google 账号或邮箱注册
4. 选择用途: **"For work"** → **"Automate my business"**
5. 进入主控台

---

## 二、核心概念 (1 分钟理解)

Make 的界面像一个画板，你把模块拖进去连线:

```
[触发器: 什么事件启动] → [动作: 做什么事] → [动作: 再做什么]
```

| 术语 | 含义 |
|------|------|
| Scenario (场景) | 一条完整工作流 |
| Module (模块) | 工作流里的一步 (如 "发送邮件") |
| Trigger (触发器) | 第一步，启动工作流的事件 |
| Action (动作) | 触发器之后的步骤 |
| Webhook | 外部服务发一个请求来触发你的工作流 |

---

## 三、创建第一个工作流 (5 分钟)

### 场景: 每天自动发运营报告到邮箱

**Step 1: 新建场景**
1. 点右上角 **"+ Create a new scenario"**
2. 空画板出现

**Step 2: 添加触发器**
1. 点中间大 **"+"** 按钮
2. 搜索 `tools` → 选 **"Tools"** 模块
3. 选 **"Set a timer"** (定时器) 或 **"Get current date"**
4. 或者直接用 **Schedule** 模块: 搜索 `schedule` → **"Schedule"** → 设置 "Every day at 08:00"

**Step 3: 添加动作 — 调你网站的 API**
1. 点 Schedule 右边的 **"+"**
2. 搜索 `http` → 选 **"HTTP"** 模块
3. 选 **"Make a request"**
4. 填写:
   - URL: `https://mythrealms-shop.vercel.app/api/automation/daily-report`
   - Method: `POST`
   - Body type: `JSON`
   - Headers: `Content-Type: application/json`
5. 点 OK

**Step 4: 添加动作 — 发邮件**
1. 点 HTTP 右边的 **"+"**
2. 搜索 `email` → 选 **"Email"** 模块 → **"Send an email"**
3. 填写:
   - To: `zheng111321@gmail.com`
   - Subject: `MythRealms Daily Report`
   - Content: 从上一步的 API 返回数据中选取

**Step 5: 测试**
1. 左下角点 **"Run once"**
2. 看每个模块是否变绿 (成功)
3. 如果变红 → 点红色模块看报错信息

**Step 6: 激活**
1. 左下角把开关从 **"INACTIVE"** 拨到 **"ACTIVE"**
2. 工作流开始自动运行

---

## 四、MythRealms 的 5 个工作流

### 工作流 1: 每日 Pinterest 发帖

```
[Schedule 每天 20:00] → [HTTP POST /api/automation/generate-pin] → [Pinterest Create Pin]
```

### 工作流 2: 每日运营报告

```
[Schedule 每天 08:00] → [HTTP POST /api/automation/daily-report] → [Email 发给自己]
```

### 工作流 3: 每日 Instagram 发帖

```
[Schedule 每天 10:00] → [HTTP POST /api/automation/generate-pin] → [Instagram Graph API 发图]
```

### 工作流 4: 库存预警

```
[Schedule 每天 09:00] → [HTTP POST /api/automation/daily-report] → [Router: 如果 lowStock>0] → [Email 发给自己]
```

### 工作流 5: Facebook 同步

```
[Schedule 每天 10:15] → [HTTP GET 内容素材] → [Facebook Graph API 发帖]
```

---

## 五、连接你的 API

在每个工作流的 HTTP 模块中，填写:

| API 端点 | 方法 | 说明 |
|------|:--:|------|
| `https://mythrealms-shop.vercel.app/api/automation/generate-pin` | POST | 生成 Pin 内容 |
| `https://mythrealms-shop.vercel.app/api/automation/daily-report` | POST | 运营数据 |
| `https://mythrealms-shop.vercel.app/api/products` | GET | 产品列表 |

---

## 六、免费额度

| 版本 | 操作次数/月 | 费用 |
|------|:--:|------|
| Free | 1,000 | 免费 |
| Core | 10,000 | $9/月 |
| Pro | 40,000 | $16/月 |

你每天 5 个工作流 × 30 天 = 150 次/月，**免费版完全够用**。

---

## 七、常见问题

**Q: HTTP 模块报错 401？**
A: 目前 API 不需要认证，检查 URL 是否正确。

**Q: 邮件发不出去？**
A: Make 内置 Email 模块需要配 SMTP。用 Resend: smtp.resend.com, 端口 587, 用户 resend, 密码填你的 API Key。

**Q: Pinterest API 怎么接？**
A: 搜索 `Pinterest` 模块 → 选 **"Pinterest"** → **"Create a Pin"** → 点 Add Connection → 登录你的 Pinterest 账号授权。
