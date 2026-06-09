# MythRealms Shop -- 全面评估报告 (2026-06-09)

> 范围: 代码质量 · UI/UX · 页面设计 · 竞品对标 · 功能缺失 · 安全合规

---

## 一、总体评分

| 维度 | 评分 | 趋势 |
|------|:--:|:--:|
| 品牌视觉 | 8.5/10 | ↑ 奢华风格迭代后显著提升 |
| 代码质量 | 6/10 | → 功能跑通了但技术债积累 |
| UI/UX 体验 | 6.5/10 | → 骨架好但细节粗糙 |
| 移动端适配 | 7/10 | → 响应式布局基本完整 |
| 安全合规 | 5/10 | ↓ `.env` 提交到仓库 + 限流失效 |
| 性能 | 6/10 | ↓ N+1 查询 + 无流式渲染 |
| SEO | 7/10 | → 基础完整但缺乏内容策略 |
| 竞品对齐 | 5/10 | ↓ 缺少奢侈品电商核心功能 |

---

## 二、代码质量审查

### Critical (立即修复)

**1. `.env` 包含生产密钥已提交到 Git**
`.env` 文件中有完整的数据库密码、LemonSqueezy API Key、Resend Key、Google OAuth Secret，且文件权限为 `rwxrwxrwx`。
```
修复: 确保 .gitignore 包含 .env，轮换所有已泄露的密钥
```

**2. 管理员删除产品会级联删除历史订单**
`api/admin/products/[id]/route.ts:114` -- Product 表设置了 `onDelete: Cascade`，删产品会把该产品的所有 `OrderItem` 一起删掉。
```
修复: 改为软删除 (isActive = false)，删除前检查是否有关联订单
```

**3. 搜索无索引 + 无分页**
`search/page.tsx:36-52` -- 对 5 个字段做 `contains + mode: "insensitive"`，PostgreSQL 无法使用索引。且没有 skip/take 分页。
```
修复: 添加全文搜索索引 (tsvector)，添加分页
```

### High (2周内)

**4. `any` 类型泛滥** -- 15+ 文件
`where: any` / `orderBy: any` / `(user as any).role` 绕过了 TypeScript 类型检查。应用 Prisma 内置的 `Prisma.ProductWhereInput` 等类型。

**5. 内存限流在 Serverless 环境下是空操作**
`lib/server/rate-limit.ts` -- 每个 Vercel 函数实例有独立内存，Map 不共享。
```
修复: 改用 Upstash Redis 或 Vercel KV
```

**6. N+1 查询**
`api/checkout/route.ts:24-36` 和 `api/discounts/validate/route.ts:144-152` 循环内 await 数据库查询。
```
修复: findMany({ where: { id: { in: ids } } }) 批量查询
```

**7. 客户端购物车与服务器购物车不同步**
`lib/cart.ts` (Zustand + localStorage) 与 `api/cart/route.ts` (Session) 是完全独立的两个系统。
```
修复: 统一为客户端 Zustand + API 同步方案，或登录后合并购物车
```

**8. 折扣码硬编码**
`api/discounts/validate/route.ts:8-50` -- 折扣定义在代码中，改折扣需要部署。
```
修复: 创建 DiscountCode 数据库模型，Admin 页面管理
```

### Warning (本月)

**9. 重复代码** -- `VariantSelector.tsx` 组件未使用，变体选择逻辑在 `ProductActions.tsx` 中重复实现。星评 UI 在 `products/[slug]/page.tsx` 中重复 4 次。
**10. JSON.parse 到处重复** -- 产品 images/details 字段每次读取都手动 parse，应用 Prisma jsonb 类型。
**11. 首页分类卡硬编码** -- `page.tsx` 中 6 张分类卡是 150 行 JSX 复制粘贴，应用数据驱动循环。
**12. Admin 认证守卫重复** -- 5 个路由文件中有相同的 auth 检查代码。
**13. 弱会话 ID** -- `lib/utils.ts:32` 用 `Math.random()` 代替 `crypto.randomUUID()`。
**14. Webhook HMAC 对比可崩溃** -- 空 signature 时 `timingSafeEqual` 比较不同长度 Buffer 会抛异常。

---

## 三、UI/UX 审查

### Critical

**15. 购物车页提示 "Join Waitlist -- Coming Soon" 但结账页有完整表单**
`cart/page.tsx:121` vs `checkout/page.tsx:233-279` -- 用户看到 "即将推出" 然后点结账又能填写支付信息，信任断裂。
```
修复: 如果 LS 支付已配好，删除 Waitlist 文案。如果还没配好，结账页也应提示。
```

**16. "Read the Story" 链接无点击事件**
`products/[slug]/page.tsx:144-150` -- 产品详情页的 "Ancient Legend Behind This Piece — Read the Story" 是一个纯 div，没有 onClick。
```
修复: 添加跳转到产品描述区的 onClick，或改为锚链接 <a href="#tabs">
```

**17. `#6B6055` 文字对比度不符合 WCAG AA**
`globals.css:12` -- `--text-muted: #6B6055` 在 `#0F0D0E` 背景上对比度仅 2.7:1 (AA 要求 4.5:1)。
```
修复: 改为 #8A7D6E 或更亮的值
```

### High

**18. 移动端"快速加购"按钮不可见**
`ProductCard.tsx:105-108` -- 悬浮加购按钮仅 hover 触发，触屏设备完全看不到。
```
修复: 移动端始终显示一个小加购图标
```

**19. 国家选择器只列了 8 个国家**
`checkout/page.tsx:407-414` -- US/UK/CA/AU/DE/FR/JP/SG。全球客户无法下单。
```
修复: 扩展至主要市场国家列表 (至少 30+ 国)
```

**20. Header 导航无当前页高亮**
`Header.tsx:63-73` -- 所有导航链接样式完全相同，用户不知道自己在哪个页面。
```
修复: 使用 usePathname() 检测当前路由并添加 active 样式
```

**21. 产品详情/分类页无加载骨架屏**
两个页面都用 `force-dynamic` 但没有 `loading.tsx` 或 Suspense。数据库慢查询 = 白屏。

**22. 首页 465 行不可流式渲染**
所有 section 串行 await，整个页面是一次性 SSR 输出。Hero 必须等数据库返回才能渲染。
```
修复: 用 <Suspense> 包裹非首屏 Section，Promise.all 并行查询
```

### Warning

**23. 搜索覆盖层缺少 aria-modal / aria-controls**
`SearchOverlay.tsx` 缺少无障碍标注。

**24. Zoom Modal 缺少焦点陷阱**
打开全屏画廊后 Tab 键能走到遮罩层后面。

**25. Hero Carousel 不尊重 prefers-reduced-motion**
`HeroCarousel.tsx:23` 无条件自动轮播。

**26. 购物车 Drawer 和产品页加购行为不一致**
网格快捷加购只弹 toast，产品详情页加购自动弹抽屉。

---

## 四、竞品对标 (Cartier / Tiffany / Bvlgari)

| 功能 | MythRealms | 奢侈品电商标准 | 差距 |
|------|:--:|:--:|------|
| 高分辨率多角度产品图 | ✅ | ✅ | 达标 |
| 3D 产品预览 / 配置器 | ❌ | ✅ | **大** |
| 尺寸指南交互 | ✅ Modal | ✅ | 达标 |
| 试戴 (AR/模特手部) | ❌ | ✅ | **大** |
| 材质/宝石筛选 | ✅ | ✅ | 达标 |
| 编辑故事 / 品牌叙事 | ✅ | ✅ | 达标 |
| 个性化推荐 | ❌ | ✅ | 中 |
| 愿望单 / 收藏 | ❌ | ✅ | **大** |
| 比较功能 | ❌ | ✅ | 中 |
| 礼盒包装选项 | ❌ | ✅ | 中 |
| 店内预约 | ❌ | ✅ | 小 (纯线上无需) |
| 实时库存通知 | 部分 | ✅ | 中 |
| 弃单邮件 | ❌ (需 Resend) | ✅ | **大** |
| 多语言 | ❌ | ✅ | 中 |
| 多币种 | ❌ | ✅ | 中 |
| Apple/Google Pay | ❌ | ✅ | **大** |
| 忠诚度计划 | ❌ | ✅ | 中 |
| 社交证明 (X人正在看) | ❌ | ✅ | 中 |
| 无障碍 WCAG AA | ❌ | ✅ | 中 |

---

## 五、功能缺失清单 (按优先级)

### P0 — 阻塞上线
1. **`.env` 安全修复** -- 轮换密钥 + gitignore
2. **购物车/结账矛盾** -- 统一状态，删除 Waitlist 文案
3. **"Read the Story" 死链接** -- 修复或移除
4. **国家列表扩展** -- 至少 30+ 国

### P1 — 影响转化
5. **愿望单** -- 用 Zustand persist + 简单 UI
6. **Apple Pay / Google Pay** -- LS 支持，结账加按钮
7. **弃单邮件** -- Resend 已配，补 3 封邮件模板
8. **移动端加购按钮** -- 始终可见
9. **Header 当前页高亮** -- usePathname
10. **首页 Suspense 流式渲染**
11. **加载骨架屏** -- 产品页 + 分类页
12. **数据库搜索索引** -- PostgreSQL tsvector

### P2 — 体验提升
13. **对比度修复** -- text-muted 颜色
14. **无障碍加强** -- aria-modal, focus trap, reduced-motion
15. **N+1 查询优化** -- 批量查询
16. **折扣码数据库化** -- DiscountCode 模型
17. **`any` 类型清理**
18. **限流生产化** -- Upstash Redis
19. **JSON 字段改用 jsonb**
20. **社交证明小组件**

### P3 — 长期差异化
21. **3D 产品预览** -- Three.js
22. **虚拟试戴 AR** -- WebXR
23. **多语言** -- next-intl
24. **多币种** -- LS 自动换算
25. **忠诚度计划**

---

## 六、立即行动清单 (本周)

| # | 行动 | 文件 |
|---|------|------|
| 1 | `.gitignore` 加 `.env`, 轮换数据库密码和 API Key | `.env`, `.gitignore` |
| 2 | 删除 cart 页 "Coming Soon" 文案 | `cart/page.tsx` |
| 3 | 修 "Read the Story" 死链接 | `products/[slug]/page.tsx` |
| 4 | 扩展国家列表到 30+ 国 | `checkout/page.tsx` |
| 5 | Header 当前页高亮 | `Header.tsx` |
| 6 | 移动端加购按钮常显 | `ProductCard.tsx` |
| 7 | text-muted 对比度修复 | `globals.css` |
| 8 | 产品/分类页加 loading.tsx | `products/[slug]/`, `collections/[slug]/` |
| 9 | N+1 查询改批量 | `checkout/route.ts`, `discounts/validate/route.ts` |
| 10 | 软删除替代硬删除 | `admin/products/[id]/route.ts` |
