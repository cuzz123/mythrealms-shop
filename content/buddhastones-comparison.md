# MythRealms vs BuddhaStonesShop — 设计/UI/UX 全面对比

## 一、Hero 首屏

| 维度 | BuddhaStonesShop | MythRealms | 差距 |
|------|------|------|:--:|
| 首屏占屏比 | 100vh 满屏 | 85vh | ⚠️ 接近 |
| 品牌信息密度 | 一句话 + CTA | 一句话 + 副标题 + CTA | ✅ |
| 情感 hook | "Find Your Inner Peace" | "Find Your Star in the Ancient Sky" | ⚠️ 改了但还没部署 |
| 首屏产品露出 | 0 — 纯品牌 | 轮播图有产品 | ✅ 我们更好 |

**改:** Hero 文字已改但上次部署失败，需重新部署。

---

## 二、分类/导航

| 维度的 | BuddhaStonesShop | MythRealms | 差距 |
|------|------|------|:--:|
| 分类逻辑 | 情绪索引 (Protection, Anxiety...) | 产品类型 (28 Mansions, Elements...) | **大** |
| 分类命名 | 动词导向: "Shop Protection" | 名词导向: "28 Mansions" | **大** |
| 导航项数 | 7-8 项 | 6 项 | ✅ |
| 子导航/Mega Menu | 有，按需求细分 | 无 | 大 |
| 移动端导航 | 全屏手风琴菜单 | 下拉列表 | 中 |

**改:**
1. 分类卡片标签从名词改为动词: "Find Your Star" "Balance Your Elements"
2. 加 Mood Board 分类入口: "I want to feel... Protected / Empowered / Grounded / Radiant"

---

## 三、产品卡片

| 维度 | BuddhaStonesShop | MythRealms | 差距 |
|------|------|------|:--:|
| 图片风格 | 场景佩戴图 (手腕/颈部) | 白大理石单品图 | **大** |
| 信息层级 | 名称 → 价格 → 快速加购 | 名称 → 材质 | 中 |
| 情感标签 | "Protection" "Energy" 徽章 | 无 | **大** |
| 价格显示 | 醒目价格 | 无价格 | **大** |
| 悬停效果 | 切换第二张图 | 放大+加购按钮 | ⚠️ 都不错 |
| 快速加购 | 悬停显示 "Add to Cart" | 悬停显示购物袋图标 | ✅ |

**改:**
1. 产品卡加价格 (从最低变体取)
2. 每个产品加情感意图标签 (Protection / Wisdom / Love / Clarity)
3. 悬停显示第二张图 (Gallery 已有第二张图)

---

## 四、产品详情页

| 维度 | BuddhaStonesShop | MythRealms | 差距 |
|------|------|------|:--:|
| 图片数量 | 5-10 张 | 3-5 张 | ✅ |
| 产品描述 | 不讲材质 → 讲 "戴上后的感觉" | 讲神话故事 ✅ | ✅ 持平 |
| 尺码指南 | 嵌入式图示 | Modal | ✅ |
| "Who is this for?" | 明确写 | Guardian Tag ✅ | ✅ 持平 |
| 交叉销售 | "Complete the set" | "You May Also Like" | ✅ |
| 评价数 | 几百条 | 种子数据 3 条 | **大** |
| 信任条 | 免邮/退货/安全常驻 | 散落在各处 | 中 |

**改:**
1. 产品页顶部加迷你信任条 (免邮/退货/手工)
2. 产品卡加价格

---

## 五、信任与社会证明

| 维度 | BuddhaStonesShop | MythRealms | 差距 |
|------|------|------|:--:|
| 首页信任条 | 英雄区下方常驻 | 有 (刚加了) | ✅ |
| 评价墙 | 首页有 UGC 照片区 | 无 | **大** |
| "As seen in" | 新闻提及 | 无 | 中 |
| 实时浏览/购买通知 | "X people viewing" | 产品页有 (随机数) | ⚠️ |
| 30天退换标识 | 多处出现 | 结账页有 | 中 |

**改:** 首页加 "Join 1,000+ Guardians" 区域 + 3 个评价卡片 (等有真实评价后换成真的)

---

## 六、结账流程

| 维度 | BuddhaStonesShop | MythRealms | 差距 |
|------|------|------|:--:|
| 一步结账 | Shopify 原生 | 一页表单 | ✅ |
| 自动填入 | Shopify 地址建议 | 无 | 中 |
| 支付选项 | 信用卡 + PayPal + Apple Pay | 信用卡 (LS) + PayPal | ✅ |
| 折扣码 | 有 | 有 | ✅ |
| 弃单恢复 | Shopify 内置 | 自建 (Resend) | ✅ |

**改:** 加 Apple Pay / Google Pay 按钮 (LS 已支持，加一行代码)

---

## 七、页脚

| 维度 | BuddhaStonesShop | MythRealms | 差距 |
|------|------|------|:--:|
| 信息密度 | 适中 | 适中 | ✅ |
| Newsletter | 有 | 有 | ✅ |
| 社媒链接 | 有 | 有 | ✅ |
| 支付图标 | 信用卡 logo 行 | 有 | ✅ |
| 政策链接 | 齐全 | 齐全 | ✅ |

持平，不用改。

---

## 八、移动端体验

| 维度 | BuddhaStonesShop | MythRealms | 差距 |
|------|------|------|:--:|
| 响应式布局 | 自适应 | tailwind 响应式 | ✅ |
| 产品列数 | 2 列 | 2 列 | ✅ |
| 分类展示 | 横向滑动 | 横向滑动 | ✅ |
| 筛选器 | 侧边抽屉 | 侧边抽屉 | ✅ |
| 字体可读性 | 良好 | 良好 | ✅ |

持平。

---

## 九、立即修复清单 (按影响排序)

| # | 修复 | 影响 |
|---|------|------|
| 1 | 产品卡加价格显示 | 用户无法判断预算，直接流失 |
| 2 | 产品卡加情绪意图标签 | 把分类逻辑变成 emotional indexing |
| 3 | 全站字体统一升级 | Georgia → Cormorant Garamond 已配但部分没生效 |
| 4 | 产品页顶部迷你信任条 | 减少跳出 |
| 5 | 悬停显示第二张图 | 增加产品吸引力 |
| 6 | Apple Pay 按钮 | 移动端转化率提升 20%+ |
| 7 | 首页加评价社交证明区 | 信任建立 |

**第 1 项 (产品卡价格) 是最大的转化杀手。** 用户看不到价格不会点进去。现在修。你要我先把这 7 项全部修了吗？
