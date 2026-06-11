# MythRealms Shop — 全线评估报告 2026-06-11

> 覆盖维度: UI/UX · 网页设计 · 用户体验 · 代码审查 · 安全 · 交易全链路 · 流量推广 · SEO · GEO · 运营 · 售后

---

## 一、总评

| 维度 | 评分 | 状态 |
|------|:--:|------|
| UI/UX | 7.5/10 | 骨架好，细节粗糙 |
| 网页设计 | 8/10 | 品牌感强，部分重复代码 |
| 代码质量 | 6/10 | 功能跑通但技术债积压 |
| 安全性 | 6/10 | 多处 Critical/High 风险 |
| 交易链路 | 6.5/10 | 支付通但订单生命周期断裂 |
| 运营售后 | 4/10 | 内容好但无实际流程 |
| 流量推广 | 6/10 | 基础设施就绪，待执行 |
| SEO/GEO | 7/10 | SEO 基础好，GEO 未启动 |
| 模块测试 | 0/10 | 完全缺失 |

**综合评价: 80% 努力花在产品打磨上，20% 花在能真正卖货的事情上。品牌和产品图已经做到位了，现在缺的是把所有技术债修完 + 开始推广。**

---

## 二、UI/UX — 25 个发现

### P0 (Critical)

| # | 问题 | 文件:行 |
|---|------|------|
| 1 | 轮播隐藏 slide 未设 `aria-hidden`，键盘用户会遍历 8 张不可见图 | `HeroCarousel.tsx:32` |
| 2 | Hero 星域动画 div 缺少 `aria-hidden` | `page.tsx:26-51` |
| 3 | 结账表单全部字段缺少 `autocomplete` 属性 | `checkout/page.tsx:326-346` |
| 4 | 图片缩放 Modal 缺少焦点陷阱 | `Gallery.tsx:167` |
| 5 | 面包屑用 `<a>` 而非 `<Link>`，导致整页刷新 | `products/[slug]/page.tsx:106-108` |

### P1 (High)

| # | 问题 | 文件:行 |
|---|------|------|
| 6 | 所有动画缺少 `prefers-reduced-motion` 保护 | `globals.css:44-69` |
| 7 | `text-muted: #8A7D6E` 小字号对比度不足 | `globals.css:9` |
| 8 | 购物车页折扣码硬编码，与结账页逻辑不一致 | `cart/page.tsx:20-28` |
| 9 | 产品页"X people viewing"是随机数 | `products/[slug]/page.tsx:163` |
| 10 | 搜索网络错误与无结果 UI 一模一样 | `SearchOverlay.tsx:68-69` |
| 11 | 结账表单输入框无 `aria-describedby` 指向错误信息 | `checkout/page.tsx:326` |
| 12 | 手机号字段无 `inputMode="tel"` | `checkout/page.tsx:386` |
| 13 | 国家 `<select>` 无 `aria-label` | `checkout/page.tsx:406` |

### P2 (Medium)

| # | 问题 | 文件:行 |
|---|------|------|
| 14 | "Find Your Guardian" CTA 两个位置指向不同目标 | `page.tsx:90,344` |
| 15 | 结账信任信号放在支付按钮下方 | `checkout/page.tsx:664-670` |
| 16 | 支付方式标签用文字缩写而非图标 | `cart/page.tsx:124-125` |
| 17 | `content-visibility` 缺失多个 section | `page.tsx` 多处 |
| 18 | 购物车抽屉 "View Cart & Checkout" 标签含两个动作 | `CartDrawer.tsx:308` |
| 19 | 产品卡片 `will-change-transform` 过度使用 | `ProductCard.tsx:82` |
| 20 | 首页分类卡硬编码 6 个 JSX 块而非数据循环 | `page.tsx:153-317` |
| 21 | 结账无 "Back to Cart" 按钮 | `checkout/page.tsx:350-362` |
| 22 | 联系表单网络错误用 `toast.success` 而非 `toast.error` | `contact/page.tsx:32` |
| 23 | 产品页 Guardian Tag 用长串三元运算符 | `products/[slug]/page.tsx:130-143` |
| 24 | 分类加载骨架屏无视觉反馈 | `collections/[slug]/page.tsx:102-104` |
| 25 | 产品详情页无 loading.tsx | `products/[slug]/` |

---

## 三、安全性 — 8 个严重风险

### Critical

| # | 风险 | 文件 |
|---|------|------|
| 1 | **`.env` 含生产密钥提交到 Git** | `.env` |
| 2 | **PayPal Webhook 无签名验证** — 任何人可伪造支付事件 | `webhooks/paypal/route.ts:11` |

### High

| # | 风险 | 文件 |
|---|------|------|
| 3 | LS Webhook secret 缺失时无验证 | `webhooks/lemonsqueezy/route.ts:14` |
| 4 | 折扣 API 用客户端传来的价格计算折扣 | `discounts/validate/route.ts:31` |
| 5 | 限流器内存 Map，Serverless 下形同虚设 | `lib/server/rate-limit.ts:9` |
| 6 | 15+ 处 `(user as any).role` 绕过类型检查 | 多个文件 |
| 7 | 折扣 PATCH 接口将原始 body 直接传给 Prisma | `admin/discounts/[id]/route.ts:19` |

### Medium/Low

| # | 风险 | 文件 |
|---|------|------|
| 8 | 订单删除为硬删除，级联删除历史订单 | `admin/products/[id]/route.ts` |
| 9 | 订单记录存储客户端传来的价格而非服务端重算价格 | `checkout/route.ts:86` |
| 10 | 注册接口返回数据库 ID | `auth/register/route.ts:22` |
| 11 | 服务端错误信息直接返回客户端 | 10+ API 文件 |
| 12 | PII 被 console.log | `contact/route.ts:26` |
| 13 | 搜索大小写敏感 | `products/route.ts:27` |
| 14 | 未使用的 Stripe 依赖在 package.json | `package.json` |

---

## 四、交易全链路 — 10 个断裂点

### P0

| # | 断裂点 | 后果 |
|---|------|------|
| 1 | PENDING 订单永不过期清理 | 僵尸订单堆积 |
| 2 | 库存校验与扣减非原子操作 | 超卖 |
| 3 | 退款时库存不回补 | 库存永久流失 |
| 4 | 联系表单只 console.log，不发邮件 | 客户消息丢失 |

### P1

| # | 断裂点 | 后果 |
|---|------|------|
| 5 | 订单无 SHIPPED/DELIVERED 状态转换 | 所有订单卡在 PAID |
| 6 | Admin 订单页纯只读，无法操作 | 无法发货 |
| 7 | 结账清除购物车在支付跳转之前 | 支付失败则购物车丢失 |
| 8 | "guest@example.com" 兜底创建孤儿订单 | 无法追踪 |
| 9 | 折扣 usedCount 永不自增 | 用量限制失效 |
| 10 | 弃单邮件自动触发从未运行 | 弃单恢复为零 |

---

## 五、SEO / GEO 策略

### SEO 现状 (7/10)

- ✅ Sitemap 已提交 Google
- ✅ Schema.org Product/Breadcrumb/Organization 结构化数据
- ✅ 20 篇博客
- ✅ 73 个产品页，每个有独立 meta title/description
- ✅ Google Merchant Feed 已配置
- ❌ 无关键词研究
- ❌ 无内部链接策略
- ❌ 无反向链接建设
- ❌ 无 Search Console 数据审查

### GEO 策略 — 新战场 (2026 必须做)

**GEO = Generative Engine Optimization** — 让 AI (ChatGPT/Gemini/Perplexity/Copilot) 回答问题时引用你的品牌。

**MythRealms 的 GEO 优势:** 你的产品每件都有神话故事背景，天然适合 AI 引述。

**30 天 GEO 启动计划:**

| 周 | 行动 |
|------|------|
| 第 1 周 | 每篇博客开头加 120-150 字 "答案胶囊" (AI 查询时优先抓取的内容) |
| 第 1 周 | 加 FAQ Schema 到 20 篇博客 |
| 第 2 周 | 创建 `llms.txt` 文件列出网站关键内容 |
| 第 2 周 | 在 robots.txt 中允许 AI 爬虫 (GPTBot, ClaudeBot) |
| 第 3 周 | 在 Reddit/Quora 回答神话珠宝类问题，附产品链接 |
| 第 4 周 | 用 Profound 或 AthenaHQ 测试 AI 是否引用你的网站 |

---

## 六、立即修复清单 (本周)

### Critical — 必须今天就修

| # | 行动 | 预估耗时 |
|---|------|:--:|
| 1 | 轮换所有密钥 + git rm --cached .env | 10分钟 |
| 2 | PayPal Webhook 加签名验证 | 5分钟 |
| 3 | 结账表单加 autocomplete 属性 | 5分钟 |
| 4 | 面包屑改 `<Link>` | 2分钟 |
| 5 | LS Webhook 强制要求 secret | 1分钟 |
| 6 | Admin 折扣 PATCH 加字段白名单 | 3分钟 |

### High — 本周内

| # | 行动 | 预估耗时 |
|---|------|:--:|
| 7 | 折扣 API 改为服务端查询价格 | 10分钟 |
| 8 | 加 `prefers-reduced-motion` | 5分钟 |
| 9 | 加 AI 爬虫到 robots.txt + 创建 llms.txt | 5分钟 |
| 10 | 联系表单改为发邮件 + 修 toast | 3分钟 |
| 11 | Admin 订单页加 SHIPPED/DELIVERED 操作 | 15分钟 |
| 12 | 结账失败不清空购物车 | 2分钟 |
| 13 | 折扣 usedCount 在 webhook 中自增 | 3分钟 |
| 14 | 库存原子扣减 + 退款回补 | 10分钟 |

---

## 七、GEO 具体行动指南

### 1. 创建 `llms.txt`

在 `public/llms.txt` 添加:

```
# MythRealms — Luxury Jewelry Inspired by Chinese Mythology

## Key Pages
- Home: https://mythrealms-shop.vercel.app
- Beast Pendants Collection: https://mythrealms-shop.vercel.app/collections/beast-pendants
- 28 Mansions Star Bracelets: https://mythrealms-shop.vercel.app/collections/28-mansions
- Guardian Quiz: https://mythrealms-shop.vercel.app/guardian-quiz

## About
MythRealms creates handcrafted luxury jewelry inspired by the Classic of Mountains and Seas,
China's oldest bestiary. Each piece features 14k gold, sterling silver, or authentic gemstones
and tells a story from a 2,000-year-old legend.

## Product Collections
- Beast Pendants: 12 mythical creature designs (Nine-Tailed Fox, Qilin, Azure Dragon, Phoenix, etc.)
- 28 Mansions: 28 beaded bracelets aligned with Chinese lunar astronomy
- Five Elements: Wood, Fire, Earth, Metal, Water bracelets
- Four Seasons: 12 seasonal jewelry pieces
- Zodiac Amulets: 12 Chinese zodiac pendant medallions
- Artist Collaborations: Limited editions (30-100 pieces)

## Facts
- Every piece handcrafted to order (2-3 week production)
- Free shipping on orders over $69.99
- 30-day return policy
- Ships to 36 countries
```

### 2. 更新 robots.txt

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://mythrealms-shop.vercel.app/sitemap.xml
```

### 3. 每篇博客加 Answer Capsule

在每篇博客开头(标题下方)加 120-150 字的 "答案摘要"，用 `<div>` 包裹:

```html
<div class="answer-capsule">
  <strong>Answer:</strong> The Nine-Tailed Fox (九尾狐) first appeared in the Shan Hai Jing
  over 2,000 years ago. Unlike her modern depictions, the original nine-tailed fox was an
  auspicious omen — she appeared only when peace and prosperity were coming to a kingdom.
  At MythRealms, she is rendered as a 14k gold pendant with nine pavé diamond arcs.
</div>
```

AI 抓取网页时优先提取这类结构化答案块。
