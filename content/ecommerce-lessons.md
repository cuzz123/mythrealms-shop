# 五年独立站老手经验 → MythRealms 落地清单

## 一、速度优化 (1→3秒跳出率+32%)

| 经验 | MythRealms 现状 | 行动 |
|------|------|------|
| 图片 WebP 格式 | ❌ 全是 PNG | WebP 之前试过崩了，保守用压缩版已缩60% |
| CDN | ✅ Vercel 自带全球 CDN | 不需要额外操作 |
| 主图<150KB | ⚠️ 压缩后~600KB | 再压一轮到 200KB 以下 |
| 少用插件 | ✅ 没有插件 | — |

**我们已在做:** 图片压缩60%+ `loading="lazy"`。速度基本达标。

---

## 二、首屏 3 秒定律 (最重要的是第一印象)

**核心:** 用户在 0.5 秒内必须读懂: 卖什么、为什么买、现在有什么好处。

| 经验 | MythRealms 现状 | 问题 |
|------|------|------|
| 首屏是 "广告牌" 不是 "网站首页" | ⚠️ 轮播图是产品但文字太抽象 | "Which Beast Guards Your Soul" 老外不懂山海经，3 秒内不知道这是什么 |
| 一句说清三个信息 | ❌ 没有明确好处 | 没价格、没锚点、没具体行动号召 |

**改:** 轮播图第一张文案改成:

```
"28 Celestial Bracelets · Handcrafted in 14k Gold"
"Each bracelet mapped to a star in the ancient Chinese sky"
"Free Shipping Over $69.99 — Find Your Star"
```

**3 秒内读懂:** 卖手链的、28款、有文化故事、免邮。

---

## 三、产品图: 首图必须是使用场景图

**核心:** 欧美用户 "看不到就不信"。第一张图必须是佩戴场景，不是白底产品图。

| 经验 | MythRealms 现状 |
|------|------|
| 首张图 = 使用场景 | ❌ 全是白大理石产品图 |
| 视频加购率+20% | ⚠️ 小云雀视频生成中，还没挂到产品页 |

**改:** 每个产品 Gallery 的第一张图换成手腕佩戴图。几十张手腕图 Agnes API 已生成过(`*-wrist.png`, `*worn.png`)，排到 Gallery 最前面。

---

## 四、文案: 参数→好处翻译

**核心:** "Lapis Lazuli beads" → "Ancient wisdom on your wrist"

| 产品 | 现在 | 改成 |
|------|------|------|
| 28宿 | "Lapis Lazuli beads with gold spacers" | "Wear the star you were born under. Deep blue lapis with gold spacers — each bead a constellation." |
| 五行 | "Green Jade · Wood Element" | "The energy of spring on your wrist. Imperial jade — for growth, beginnings, and renewal." |
| 月相 | "Moonstone with diamond halo" | "The full moon, captured in stone. 28 diamonds. One for each night the moon watches over you." |

---

## 五、信任建设: 没有评价也要让用户信

| 经验 | MythRealms 已做 | 还缺的 |
|------|:--:|------|
| 退换货政策 | ✅ /refund | — |
| About Us 故事 | ✅ 品牌故事 | 缺个人照片/仓库实拍 |
| 工厂/生产图 | ❌ | 加一张手工制作过程的图 |
| "I check every order" | ❌ | About Us 加创始人署名 |

---

## 六、不要让用户思考 "怎么买"

| 经验 | MythRealms 现状 | 行动 |
|------|------|------|
| CTAs 高饱和暖色 | ✅ CTA 金色 (D4A84B) 够醒目 | OK |
| "Buy Now" 而非 "Add to Cart" | ✅ 已有 Buy It Now | OK |
| 移动端固定底栏 | ❌ 没有 | Mobile 加 sticky Add to Cart |
| 游客直接结账 | ✅ 已支持 | OK |
| PayPal Express | ✅ 已支持 | OK |
| 结账步骤 4→2 | ✅ 1 页表单 | OK |

**唯一的行动:** 移动端加固定底栏 Add to Cart。

---

## 七、页面结构: 回答用户脑子里的问题

**用户心理路径 → 对应页面内容:**

| 问题 | 对应板块 | 我们的状态 |
|------|------|:--:|
| 这是什么？ | Hero 轮播 | ✅ |
| 适合我吗？ | 28宿/五行产品区 | ✅ |
| 怎么证明？ | GuardianMatch 情感共鸣 | ✅ |
| 为什么现在买？ | ❌ 缺紧迫感 | **要加** |

**改:** 首页底部加一个限时区域: "New Arrivals — Limited Stock" 或者首单折扣倒计时。

---

## 八、卖 "更好的自己" 不是卖产品

**核心洞察:** 老外不是在买手链，是在买 "拥有守护神之后更自信的自己"。

我们的 Guardian Tag 已经在做这件事了:
- "For the one who's been underestimated"
- "For the one rebuilding from ashes"

**强化方向:** 首页 Hero 文案从 "Find your star" → "Wear your destiny." 更强的身份认同。

---

## 立即行动清单 (4项)

| # | 行动 | 影响 | 耗时 |
|---|------|------|:--:|
| 1 | 轮播图第一张文案改具体 | 3秒停留率 | 2分钟 |
| 2 | Gallery 第一张换成手腕图 | 产品点击率 | 10分钟 |
| 3 | 移动端 sticky Add to Cart | 移动端转化率 | 5分钟 |
| 4 | 产品描述加一句 "好处翻译" | 详情页转化 | 15分钟 |
