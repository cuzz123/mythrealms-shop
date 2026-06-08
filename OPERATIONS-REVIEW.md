# MythRealms Shop -- 全面运营与优化分析报告

> 评估日期: 2026-06-07 | 项目路径: `/mnt/d/mythrealms-shop` | 线上地址: mythrealms.jasperkit.com

---

## 一、项目画像

| 维度 | 现状 |
|------|------|
| 定位 | 中国神话主题饰品独立站 (山海经 IP) |
| 目标客群 | 对中国传统文化/神话感兴趣的海外消费者 (18-45 岁) |
| SKU 数量 | ~12 (种子数据) vs 竞品 8,000-12,000 |
| 技术栈 | Next.js 16 + Prisma + PostgreSQL (Neon) + Tailwind CSS 4 |
| 支付 | LemonSqueezy (配置不完整) / Stripe (代码存在但未配置) |
| 部署 | Vercel, 域名 mythrealms.jasperkit.com |
| 团队 | 一人公司模式 (Claude + Agent 协作) |

---

## 二、现状评分卡

### 已完成且质量较高的模块

| 模块 | 评分 | 说明 |
|------|:----:|------|
| 品牌视觉与暗色主题 | 9/10 | 暗黑+古铜金配色统一，Cormorant+Inter 字体搭配得体 |
| 首页叙事 | 9/10 | Hero Starfield + 类别卡 + 二十八宿 + Guardian Match + BrandStory，层次分明 |
| 产品详情页 | 8/10 | Gallery + 变体选择 + 评星 + Guardian Tag 情感标签，差异化做得好 |
| Guardian Quiz | 9/10 | 人格测试式产品推荐，社交传播潜力大 |
| 购物车抽屉 | 8/10 | 免邮进度条 + 推荐商品 + 快捷键关闭，体验完整 |
| SEO 基础 | 8/10 | sitemap.xml / robots.txt / 动态 metadata / 面包屑 / h1-h4 层级 |
| 筛选器侧边栏 | 8/10 | 石种/意图/材质/价格四维筛选，Slide-over 交互 |
| Admin 后台 | 7/10 | 产品/订单/博客 CRUD 齐全，Dashboard 统计卡片 |

### 存在问题的模块

| 模块 | 评分 | 问题 |
|------|:----:|------|
| 支付网关 | 4/10 | Stripe + LemonSqueezy 双代码但均未完整配置，实际支付可能走 demo 模式 |
| 产品数量 | 2/10 | 12 个 SKU vs 竞品 8000+，严重不足 |
| 折扣系统 | 3/10 | AnnouncementBar 宣传 MYTH15 / B2G1，但结账无折扣码输入框 |
| 搜索 | 5/10 | 搜索后硬编码跳转到 beast-pendants 分类，非全局搜索 |
| 主题一致性 | 6/10 | Blog 和 Admin 有多处 `bg-white` 硬编码，破坏暗色主题 |
| 图片资源 | 3/10 | 产品图用 CSS gradient 占位，无实拍图 |
| 邮件系统 | 2/10 | Resend 已集成但 API Key 为空，弃单召回无效 |
| 内容营销 | 4/10 | 仅 5 篇种子博客，无持续内容策略 |

---

## 三、技术债务清单

### P0 -- 阻塞上线

**1. 支付网关混乱**

`src/lib/stripe.ts` 和 `src/lib/lemonsqueezy.ts` 两套代码并存。`src/app/api/checkout/route.ts` 先尝试 LemonSqueezy API，失败后走直接购买链接，再失败进入 demo 模式直接跳转成功页 -- 这意味着"不付款也能下单"。

```
推荐方案: 二选一清理
- 选 Stripe: 全球覆盖好，开发文档完善，Checkout Session 成熟
- 选 LemonSqueezy: Merchant of Record，自动处理全球税务，适合一人公司
当前 .env 只有 LemonSqueezy 变量(值为空)，建议完成 LemonSqueezy 配置或切换回 Stripe。
```

**2. 折扣码虚假宣传**

`AnnouncementBar` 展示 "15% Off First Order: MYTH15" 和 "Buy 2 Get 1 Free on Pendants"，但 `CheckoutPage` 和 `CartDrawer` 均无折扣码输入框，`/api/checkout` 也无折扣计算逻辑。这是法律风险 (虚假广告) + 转化损失。

**3. 搜索跳转 Bug**

`SearchOverlay.tsx` 第 80/96 行硬编码跳转到 `/collections/beast-pendants?search=...`。用户搜 "Phoenix necklace" 只会看到 Beast Pendants 分类的产品。

### P1 -- 影响转化率

**4. 产品图片为占位符**

所有产品图使用 CSS `linear-gradient` 占位。饰品是高度视觉化的品类，没有实拍图 = 零转化。

```
短期方案: 使用 Midjourney/DALL-E 生成高质量神话生物饰品渲染图
长期方案: 找供应商拿样品实拍，每产品 5-10 张多角度图
```

**5. 主题不一致**

- Blog 页面卡片: `bg-white` (硬编码)
- Admin Dashboard 统计卡片: `bg-white` (硬编码)
- 应全部使用 `bg-[var(--surface)]` 或 `bg-[var(--bg)]`

**6. 结账表单无验证**

Checkout 页面只验证了 email 非空，address/city/zip 都没有验证。LemonSqueezy 可能需要完整地址才能计算税费。

**7. 图片标签未优化**

大部分 `<img>` 未使用 Next.js `<Image>` 组件，缺少:
- 自动 lazy loading
- 响应式 srcSet
- AVIF/WebP 格式转换
- 模糊占位符 (blurDataURL)

**8. Cookie 同意横幅缺失**

面向欧美市场的电商必须 GDPR 合规。需要 Cookie 同意管理 + Privacy Policy 链接。

### P2 -- 体验改善

**9. 缺少库存预警**

`ProductActions.tsx` 有低库存提示，但只在 <= 5 件时显示，且购物车内无库存验证。加入购物车时不扣减库存，多人同时购买可能超卖。

**10. 缺少愿望单**

无用户收藏/愿望单功能，无法做再营销。

**11. 价格排序性能**

`CollectionFilters` 和 `/api/products` 的价格排序是 JS 内存排序 (`_minPrice`)，1000+ 产品时会出现性能问题。应在数据库层面解决 (variant 的 min price 可以冗余到 Product 表)。

**12. API 无限流**

所有 API 路由无 rate limiting，尤其 `/api/checkout` 和 `/api/contact` 容易被滥用。

---

## 四、运营策略

### 4.1 品牌定位

MythRealms 的差异化优势是 **"山海经 IP + 情感共鸣"**，不是卖饰品，是卖 **"守护神身份认同"**。这是竞品 (通用水晶/佛教饰品站) 无法复制的护城河。

**一句话定位**: "Which ancient beast guards your soul?" -- 用 2000 年前的东方神话回答"我是谁"。

### 4.2 目标市场

基于产品定价 ($32-$140) 和品类特征:

| 市场 | 优先级 | 理由 |
|------|:------:|------|
| 北美 (US/CA) | P0 | 英语市场，对中国神秘文化好奇，消费力强 |
| 英国/澳洲 | P1 | 英语市场，文化亲近 |
| 东南亚华人 | P1 | 文化认同强，中文内容可直接复用 |
| 欧洲 | P2 | 需要多语言 + 合规成本 |

### 4.3 流量获取策略

**第一阶段: 内容驱动 (0-3 个月)**

1. **SEO 长尾内容**: 每周 2 篇博客
   - "What is the Nine-Tailed Fox? The Complete Guide to 九尾狐"
   - "Azure Dragon vs White Tiger: Which Guardian Matches Your Personality?"
   - "The 28 Chinese Constellations Explained"

2. **Pinterest**: 饰品品类 Pinterest 流量转化率极高
   - 每件产品 5 张 Pin (不同角度 + 神话故事卡片)
   - 用 Canva 制作 "Which Guardian Are You?" infographic

3. **TikTok / Reels**: 15-30 秒短视频
   - Guardian Quiz 结果展示
   - 产品开箱 / 佩戴效果
   - 神话故事旁白 + 产品展示

**第二阶段: 付费获客 (3-6 个月)**

4. **Meta Ads**: 
   - 兴趣定向: Chinese mythology, fantasy jewelry, spiritual jewelry, Wicca, crystals
   - Retargeting: 浏览产品未购买 / 加购未结账
   - Lookalike: 基于已购买用户

5. **Google Shopping**: 产品 Feed + Performance Max

6. **Influencer 合作**: 
   - TikTok 神话/神秘学博主演绎 Guardian Quiz
   - 寄样品换测评 (成本 $30-140/人)

**第三阶段: 复购与社群 (6-12 个月)**

7. **Email 序列**:
   - 购买后 Day 1: Guardian 故事邮件
   - Day 7: 产品护理指南
   - Day 21: "Complete your set" 推荐
   - Day 60: 新品通知 + 老客专属折扣

8. **会员体系**: 
   - 青铜 Guardian: 消费 $0-99
   - 白银 Guardian: 消费 $100-299 (5% 折扣)
   - 黄金 Guardian: 消费 $300+ (10% 折扣 + 提前新品)

### 4.4 产品策略

**SKU 扩展路线**:

| 优先级 | 品类 | 数量 | 价格带 |
|:------:|------|:----:|--------|
| 立即 | 10 神兽吊坠 (补全) | 10 | $32-55 |
| Week 2 | 二十八宿手串系列 | 28 | $25-45 |
| Week 4 | 五行石系列 | 5 | $35-60 |
| Month 2 | 四季系列 (四象延伸) | 12 | $40-80 |
| Month 3 | 十二生肖联名 | 12 | $30-60 |
| Month 4 | 限量艺术家联名 | 3-5 | $80-200 |

**定价策略**:
- 统一免邮门槛 $69.99 (引导加购第二件)
- 设置 "Compare at Price" (划线价) 制造折扣感
- Bundle 套装 (如 Four Symbols 四件套) 定价 = 单买总和的 75%
- 首单 15% 折扣 (MYTH15 -- 需要实际实现)

### 4.5 转化率优化 (CRO)

按漏斗优化:

```
流量 100%
  -> 浏览产品 60%   [优化: 首页 Hero/Carousel 引导到爆款]
  -> 加购 15%       [优化: 产品图 + Guardian Tag + 紧迫感]
  -> 发起结账 8%    [优化: 购物车推荐 + 免邮进度条]
  -> 完成支付 3%    [优化: 结账流程简化 + 信任信号]
```

具体行动:
- **产品页**: 加 "Only X left" + "X people viewing" 社会证明
- **购物车**: B2G1 自动应用 (买 2 个 pendants 送 1 个最低价)
- **结账**: 移除不必要的地址字段，支持 Apple Pay / Google Pay 快捷支付
- **弃单**: 1h / 24h / 72h 三封邮件序列

---

## 五、代码优化清单

### 立即修复 (本周)

| # | 文件 | 问题 | 行动 |
|---|------|------|------|
| 1 | `.env` | LemonSqueezy 配置为空 | 完成 LS 配置或切换 Stripe |
| 2 | `checkout/page.tsx` | 无折扣码字段 | 添加 discount code input + 调用验证 API |
| 3 | `SearchOverlay.tsx:80` | 搜索硬编码跳转 | 改为全局搜索或搜索结果页 |
| 4 | `blog/page.tsx:26` | `bg-white` | 改为 `bg-[var(--surface)]` |
| 5 | `admin/page.tsx:30` | `bg-white` | 改为 `bg-[var(--surface)]` |
| 6 | `/api/checkout` | 无折扣计算 | 添加 discount code 验证逻辑 |
| 7 | `AnnouncementBar` | B2G1 无后端 | 在购物车逻辑中实现 B2G1 |

### 短期优化 (2 周内)

| # | 范围 | 行动 |
|---|------|------|
| 8 | 所有 `<img>` | 替换为 Next.js `<Image>` + lazy loading |
| 9 | `globals.css` | 添加 `.bg-surface` / `.bg-card` 工具类，消除硬编码 |
| 10 | Checkout form | 添加 address/zip/phone 前端验证 |
| 11 | API routes | 添加 rate limiting (vercel/kv 或 upstash/ratelimit) |
| 12 | Product schema | 添加 `minPrice` 冗余字段解决价格排序性能 |
| 13 | Cart logic | 加入购物车时校验实时库存 |
| 14 | `layout.tsx` | 添加 Cookie Consent 组件 |

### 中期改进 (1 个月)

| # | 范围 | 行动 |
|---|------|------|
| 15 | 图片 | 实现 blurDataURL 占位符 + AVIF 格式 |
| 16 | 国际化 | 添加 next-intl 支持中/日/法/西 |
| 17 | 多币种 | 集成汇率 API 自动转换价格显示 |
| 18 | 愿望单 | 新建 Wishlist 数据模型 + UI |
| 19 | 评论 | 购买后自动发邮件邀请评价 |
| 20 | 分析 | 配置 GA4 ecommerce events (view_item, add_to_cart, purchase) |

---

## 六、财务模型参考

### 假设

- 平均客单价: $55
- 产品成本 (含运费): ~$15 (找供应商直发)
- 毛利率: ~73%
- 付费广告 CPA: $15-25 (初期偏高)

### 盈亏平衡估算

| 指标 | 保守 | 合理 | 乐观 |
|------|:----:|:----:|:----:|
| 月流量 | 5,000 | 20,000 | 80,000 |
| 转化率 | 1.5% | 2.5% | 3.5% |
| 月订单 | 75 | 500 | 2,800 |
| 月收入 | $4,125 | $27,500 | $154,000 |
| 月毛利 | $3,000 | $20,000 | $112,000 |
| 广告支出 | $1,500 | $10,000 | $45,000 |
| **月净利** | **$1,500** | **$10,000** | **$67,000** |

达到"合理"水平的关键: **产品数量 > 100 SKU + 每周 2 篇博客 + Pinterest 起量**。

---

## 七、优先级时间线

```
Week 1-2:  修复 P0 问题 (支付、折扣码、搜索、主题)
Week 3-4:  补齐 50 个 SKU + 生成产品渲染图
Month 2:   内容引擎启动 (Blog + Pinterest + TikTok)
Month 3:   邮件自动化 + Meta Ads 测试
Month 4:   多币种 + 国际化 + 愿望单
Month 5-6: 规模化 (Google Shopping + Affiliate + Influencer)
```

---

## 八、关键结论

1. **品牌和叙事已经 80 分** -- 山海经 IP + Guardian 身份认同是真正的差异化，竞品无法短期复制
2. **技术底座扎实但未完工** -- 支付、折扣、搜索三个核心转化环节有 bug，必须立即修复
3. **最大瓶颈是内容 (产品 + 图片 + 博客)** -- 12 个 SKU 不可能支撑独立站，需要快速扩张到 50-100
4. **营销渠道优先级: SEO Blog > Pinterest > TikTok > Meta Ads** -- 前三个是免费/低成本流量，先跑通再付费
5. **一人公司可以跑通** -- 用 Agent 辅助内容生产 + 自动化邮件 + 供应商直发，运营成本可以控制在 $500/月以内

---

> 下次评审建议在完成 Week 1-2 P0 修复后进行，重点验证支付流程和折扣系统。
