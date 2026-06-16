# PawHaven vs ZenStone/DeskVibe — 三站交叉对比

## 一、项目身份

| | MythRealms | PawHaven | ZenStone (DeskVibe) |
|------|------|------|------|
| 品类 | 神话珠宝手链 | 智能宠物用品 | 高端办公桌/家居石材 |
| 定位 | 情感奢华 | 功能性暖调 | 北欧侘寂极简 |
| 产品数 | 100+ | 30+ | ~20 |
| 支付 | LS + PayPal | PayPal | PayPal |
| 部署 | mythrealms-shop.vercel.app | pawhaven-store-... | zenstone-store-weld.vercel.app |

---

## 二、各站优点 (可以互相学习)

### PawHaven 的优点 → MythRealms 可以学

| 特点 | 说明 | MythRealms 要不要学 |
|------|------|------|
| **品类筛选 Chip 带数量** | 筛选按钮上显示匹配数量 | ✅ 必学 — 28 宿 28 个产品，加数量标签用户知道多少 |
| **骨架屏 loading.tsx** | 产品详情页有骨架屏 | ✅ 已有部分，但产品详情页缺 |
| **WCAG AA 对比度** | 全项通过 | ✅ 我们修过了 text-muted |
| **空状态有引导 CTA** | "Clear Filters & Show All" | ✅ 简单做 |
| **产品图统一商业摄影感** | 白底浅景深 | ✅ 我们已做到 |
| **35 张产品图风格统一** | 一致性高 | ✅ 我们 100+ 张也统一 |

### ZenStone/DeskVibe 的优点 → MythRealms 可以学

| 特点 | 说明 | MythRealms 要不要学 |
|------|------|------|
| **Figtree 字体** | 与 BuddhaStones 同款，现代无衬线 | ⚠️ 已用 Cormorant+Inter 也好看 |
| **Shop the Look 区** | 整桌搭配展示 | ✅ 可以做 "Wear the Look" 手链叠戴 |
| **Desk Inspiration 画廊** | 6 张氛围图 | ✅ 可以做风格图集 |
| **杂志式页面节奏** | 轮播→搭配→分类→产品→信任→故事→评价→灵感 | ✅ 部分已做，但缺"搭配"和"评价" |
| **购物车持久化+弃单挽回弹窗** | 关网页再开购物车还在 | ⚠️ 我们有 Zustand persist 了 |
| **300ms 防抖搜索** | 搜索体验好 | ✅ 我们已有 |
| **心愿单** | 用户可收藏 | ✅ 我们已有 |
| **全宽轮播+导航** | 轮播占满屏 | ✅ 我们已做到 60-85vh |

---

## 三、各站缺点 (MythRealms 比他们强的地方)

| MythRealms 做得好的 | PawHaven 缺 | ZenStone 缺 |
|------|------|------|
| 产品数 100+ | 30 个 | ~20 个 |
| 双支付 LS+PayPal | 仅 PayPal | 仅 PayPal |
| 折扣系统 (DB驱动) | 无 | 无 |
| GEO (llms.txt+AI robots) | 无 | 无 |
| 产品描述情感化 (Guardian Tag) | 功能型文案 | 功能型文案 |
| 图片数量 (5-7 张/产品) | 1-2 张 | 1 张 |
| Gallery 多角度+光箱放大 | 无 | 无 |
| 产品筛选器 (石种/材质/意图) | Chip 筛选 | 无筛选 |
| 结构化数据 Schema.org | 无 | 无 |
| 分类数量 8 个 | 3 个 | 3 个 |
| n8n/Make 自动化工作流 | 无 | 无 |

---

## 四、MythRealms 现在该学的东西

### 立刻做 (P0)

| # | 学哪个站 | 做什么 | 灵感 |
|---|------|------|------|
| 1 | ZenStone | **Shop the Look / "Wear the Look"** — 3-4 组手链叠戴搭配，像杂志排版 | 整桌搭配 → 手腕叠戴 |
| 2 | PawHaven | **筛选器加数量标记** — "Lapis (7)" "Rose Quartz (5)" | Chip 带 count |
| 3 | ZenStone | **产品详情页加 loading.tsx** | 骨架屏 |

### 本周 (P1)

| # | 学哪个站 | 做什么 |
|---|------|------|
| 4 | ZenStone | **首页加评价区** — 即使种子数据 3 条也展示出来 |
| 5 | PawHaven | **首页底部 "View All Products" 入口** |
| 6 | ZenStone | **Desk Inspiration 风格 → 做 "Wrist Stories" 区** — 3 张手腕佩戴氛围图 |

---

## 五、MythRealms 独有的竞争优势 (护城河)

| 能力 | 说明 |
|------|------|
| 产品故事性 | 28 宿 + 五行 + 月相 + 山海经 — 竞品做不了 |
| 设计语言统一 | 大珠+金间隔件 — 全系列一眼识别 |
| GEO 先行 | AI 搜索引用 — 竞品没做 |
| 自动化就绪 | n8n 工作流/Pinterest API — 就等审核 |
| 多支付 | LS + PayPal 双通道 |
| 图片数量 | 每产品 3-7 张，Gallery + 光箱 |

---

## 六、结论

三个站技术栈相同 (Next.js + Prisma + Neon)，产品不同。MythRealms 在**内容深度和视觉一致性**上是三个站中最强的。但在**转化驱动的 UX 细节**(筛选器数量标记、搭配展示、评价区)上不如另外两个站。

**现在该做的:** 学 ZenStone 的搭配展示和 PawHaven 的筛选器数量标签，花 30 分钟就能让转化率再上一个台阶。
