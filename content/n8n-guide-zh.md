# n8n 完整操作指南 (2026年6月)

## 一、安装 n8n (二选一)

### 方案 A: n8n Cloud (最简单，无需安装)
1. 打开 https://app.n8n.cloud
2. 注册 → 创建 workspace → 直接进入主控台
3. 每月 1,000 次执行，够用

### 方案 B: WSL 本地安装
```bash
unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
npm install -g n8n --registry=https://registry.npmmirror.com
n8n start
```
打开 http://localhost:5678

---

## 二、创建第一个工作流: 每日运营报告

### Step 1: 新建工作流
1. 左上角点 **"+ New Workflow"**
2. 出现的空白画布上，点 **"+ Add first step"**

### Step 2: 添加定时触发器
1. 搜索框输入 `schedule`
2. 选 **"Schedule Trigger"**
3. 右侧面板设置:
   - Trigger Times: 点 **"Add Time"**
   - Hour: `8`
   - Minute: `0`
4. 点右上角 **"Done"** 关闭面板

### Step 3: 添加 HTTP 请求 (调你的 API)
1. 点 Schedule 节点右边的小 **"+"** 按钮
2. 搜索 `http` → 选 **"HTTP Request"**
3. 右侧面板填写:
   - Method: **POST**
   - URL: `https://mythrealms-shop.vercel.app/api/automation/daily-report`
   - Authentication: **None**
   - Send Body: 点开关关闭 (不需要传 Body)
4. 点 **"Done"**

### Step 4: 测试
1. 点右上角 **"Test Workflow"**
2. 等 3 秒 → 看 HTTP Request 节点变绿 (显示数据)
3. 点 HTTP Request 节点 → 右侧面板 → 点 **"Output"** 标签 → 查看返回的数据

### Step 5: 添加邮件通知
1. 点 HTTP Request 右边的小 **"+"**
2. 搜索 `email` → 选 **"Send Email"**
3. 右侧面板:
   - From Email: `noreply@mythrealms-shop.vercel.app`
   - To Email: `zheng111321@gmail.com`
   - Subject: `MythRealms Daily Report — {{new Date().toISOString().slice(0,10)}}`
   - Body: 这里写邮件正文

### Step 6: 激活
1. 右上角把开关从 **"Inactive"** 拨到 **"Active"**
2. 工作流开始每天 8:00 自动运行

---

## 三、MythRealms 全部工作流

### 工作流 1: 每日运营报告
```
[Schedule 08:00] → [HTTP POST /api/automation/daily-report] → [Email 发给你]
```

### 工作流 2: 每日 Pinterest Pin
```
[Schedule 20:00] → [HTTP POST /api/automation/generate-pin] → [Pinterest 创建 Pin]
```

### 工作流 3: 库存预警
```
[Schedule 09:00] → [HTTP POST /api/automation/daily-report] → [IF lowStock > 0] → [Email 发给你]
```

### 工作流 4: 弃单召回
```
[Schedule Cron: 0 * * * * (每小时)] → [HTTP 检查 PENDING 订单] → [Email 发弃单邮件]
```

### 工作流 5: Instagram 发帖
```
[Schedule 10:00] → [Code 节点: 选产品] → [Instagram 发布]
```

---

## 四、导入预设工作流

如果你不想手动创建，可以直接导入:
1. n8n 首页 → 右上角 **"..."** → **"Import from File"**
2. 选择 `/mnt/d/mythrealms-shop/content/n8n-workflows/` 下的 JSON 文件
3. 修改里面的 API URL 和邮箱 → 激活

---

## 五、常见问题

**Q: 执行报错 "Connection refused"？**
A: API 部署在 Vercel 上，确认 https://mythrealms-shop.vercel.app 可以访问。WSL 内可能需要关代理: `unset http_proxy https_proxy`

**Q: 不激活会运行吗？**
A: 不会。必须把开关拨到 "Active"。

**Q: 免费还是付费？**
A: n8n Cloud 免费 1000 次/月，自托管无限免费。
