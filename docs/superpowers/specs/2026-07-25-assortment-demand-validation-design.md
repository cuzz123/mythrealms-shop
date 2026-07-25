# MythRealms 12 款商品需求验证实验设计

**日期：** 2026-07-25

**状态：** 创始人已确认设计

**实验周期：** 14 天；样本不足时统一延长 7 天

**主要渠道：** Pinterest 自然流量

**目标市场：** 美国

## 1. 目标

通过等量、同规格的自然内容曝光，比较 12 款现有商品的真实兴趣与购买意图，在不下架任何商品、不使用付费广告、不依赖供应商聊天回复的前提下，选出下一轮值得优先投入供应链、内容和转化优化的 3 款商品。

实验验证的是相对商品需求，而不是单纯增加播放量或网站访问量。Pinterest 出站点击率用于识别初步兴趣，GA4 商品页行为与加购用于识别更深购买意图，真实非管理员订单作为强需求信号。

## 2. 非目标

- 不在本轮验证最终材质、供应商、美国履约能力或产品质量。
- 不为任何商品投放付费广告、设置独享折扣或制造虚假稀缺。
- 不因实验结果下架、隐藏、停售或阻止购买任何商品。
- 不在实验期间修改商品价格、商品页结构、排序或 CTA。
- 不用播放量、点赞量或单一访问量直接确定主推款。
- 不把 15 笔历史管理员测试订单计入客户、营收或转化。

## 3. 实验商品

采用均衡铺货结构：4 款耳环、3 款手链、3 款项链、2 款戒指。

| 品类 | 商品 | ID / slug | 目标页面 |
|---|---|---|---|
| 耳环 | The Shell Bloom | `new-series-006` / `new-series-mother-of-pearl-cluster-earrings` | `/products/new-series-mother-of-pearl-cluster-earrings` |
| 耳环 | The Dewflower | `new-series-001` / `new-series-white-shell-flower-drops` | `/products/new-series-white-shell-flower-drops` |
| 耳环 | The Golden Petal | `new-series-002` / `new-series-gold-shell-teardrops` | `/products/new-series-gold-shell-teardrops` |
| 耳环 | The Baroque Orbit | `new-series-003` / `new-series-baroque-pearl-hoops` | `/products/new-series-baroque-pearl-hoops` |
| 手链 | The First Light | `1688-005` / `pearl-series-05` | `/products/pearl-series-05` |
| 手链 | The Green Current | `new-series-009` / `new-series-pearl-jade-bracelet` | `/products/new-series-pearl-jade-bracelet` |
| 手链 | The Shell Twist | `new-series-011` / `new-series-shell-twist-pearl-cuff` | `/products/new-series-shell-twist-pearl-cuff` |
| 项链 | The Inner Glow | `1688-017` / `pearl-series-17` | `/products/pearl-series-17` |
| 项链 | The Falling Pearl | `new-series-016` / `new-series-pearl-y-lariat` | `/products/new-series-pearl-y-lariat` |
| 项链 | The Pearl Drop | `new-series-019` / `new-series-pearl-drop-choker` | `/products/new-series-pearl-drop-choker` |
| 戒指 | The Calm Tide | `1688-001` / `pearl-series-01` | `/products/pearl-series-01` |
| 戒指 | The Still Point | `1688-002` / `pearl-series-02` | `/products/pearl-series-02` |

## 4. 曝光设计

每款商品获得两条 Pinterest Pin，共 24 条：

1. 产品近景版本：突出可观察的轮廓、层次、颜色和视觉细节。
2. 佩戴、场景或礼物情绪版本：表达使用场景，不新增未经确认的材质或性能承诺。

前 12 天每天发布 2 条。第 13–14 天停止新增商品 Pin，仅观察累计数据和延迟点击。午间与晚间时段按品类和商品轮换，确保没有商品持续占用同一时段。

所有 Pin 使用同一 CTA 语义，例如 `View the design`。内容不得引入未经确认的天然珍珠、mother-of-pearl、925 银、低敏、防过敏、不褪色、库存或配送承诺。

TikTok、SEO 和品牌内容可以继续运行，但其流量不计入 12 款商品的胜负排名。Pinterest 是本轮唯一 SKU 排名渠道。

## 5. UTM 与归因

每条 Pin 直接链接对应商品页，使用以下 UTM：

```text
utm_source=pinterest
utm_medium=organic
utm_campaign=assortment-validation-14d
utm_content=<商品slug>-v1 或 <商品slug>-v2
```

第一轮不开发站内跨页 UTM 续传。GA4 使用首次落地和会话归因，将商品浏览、加购、结账和购买归入对应 Pinterest 会话。Pinterest 平台侧出站点击不依赖 GA4 consent，作为第一层主指标。

## 6. 指标与数据字段

每个内容和商品至少记录：

| 字段 | 来源 |
|---|---|
| 日期、内容 ID、商品 ID、版本、发布时间 | 内容日历 |
| Pinterest impressions | Pinterest Analytics |
| Pinterest outbound clicks | Pinterest Analytics |
| 出站点击率 `outbound clicks / impressions` | 计算字段 |
| GA4 sessions、engaged sessions、source / medium | GA4 |
| `view_item` | GA4 |
| `add_to_cart` | GA4 |
| `begin_checkout` | GA4 |
| `purchase` 与已支付营收 | GA4 与订单系统交叉核对 |
| consent 状态和测量异常 | 技术日志 / 实验日志 |
| 页面、价格或内容变更 | `decision-log.md` |

管理员、内部、机器人和已知测试流量从有效样本中排除。15 笔历史管理员测试订单永久排除。

## 7. 最低样本与排名规则

每款商品进入正式排名前必须同时满足：

- 至少 1,000 次 Pinterest 曝光；
- 至少 20 次可归因商品页访问。

未满足最低样本的商品不被判为赢家或输家。实验统一延长 7 天，并为不足商品补充同模板自然曝光，不使用付费广告补量。

排名采用漏斗分层，不使用加权总分：

1. 按 Pinterest 出站点击率筛出前 6 款。
2. 在前 6 款中比较有效商品访问率。
3. 结合加购、结账与真实订单，确定前 3 款。

任一真实非管理员订单是强需求信号，但必须排除误购、异常流量、退款和测试订单。

结果解释：

- 点击率高、有效访问低：内容吸引人，但商品或落地页不匹配。
- 点击率低、加购率高：商品可能有需求，素材较弱，应更换素材复测。
- 点击率和深层行为都高：进入下一轮主推候选。
- 点击率和深层行为都低：暂停主动推广，但不下架商品。
- 访问高、加购低：检查价格、信任信息、图片和配送表达，不直接判定无需求。

## 8. Day 0 启动门槛

启动前必须全部满足：

- GA4 外部确认能接收 `view_item`、`add_to_cart`、`begin_checkout` 和 `purchase`。
- 拒绝 analytics consent 时不发送分析事件；接受后关键事件只发送一次。
- Pinterest 商业账号可读取 impressions 与 outbound clicks。
- 24 条 Pin 均具有正确商品、目标 URL、版本和 UTM。
- 12 个商品页在移动端可访问、可加购，且没有因实验改变目录或购买状态。
- 经营查询、导出和指标中永久排除历史管理员测试订单。
- 完整 clean production build、部署包验证与生产 smoke test 已通过。

当前本地 clean build 受到不完整 `@prisma/client` 依赖树阻塞。该依赖问题、GA4 外部接收和生产部署必须在 Day 0 前解决；在此之前不得启动实验计时。

## 9. 运行节奏

- Day 0：记录 GA4 与 Pinterest 基线，冻结实验规则。
- Day 1–12：每天发布 2 条 Pin；增长会话记录发布与测量状态。
- Day 7：只检查测量、曝光均衡和异常，不选赢家。
- Day 13–14：停止新增商品 Pin，观察延迟行为。
- Day 14：仅在样本门槛满足时执行排名。
- Day 21：仅在样本不足时作为统一延长终点。

## 10. 异常与订单处理

- 测量中断：暂停实验计时；修复后继续，丢失数据不进入排名。
- 单款曝光不足：追加同模板自然曝光，不单独投广告。
- 单条内容异常爆发：保留真实结果，仍用点击率与深层行为判断。
- 商品页或价格中途变化：记录变更，受影响日期不与其他商品直接比较。
- 出现真实订单：作为强信号，立即进入人工订单、履约或退款处理；不得伪造履约能力。
- 机器人、内部或异常流量：从有效样本剔除并记录依据。

## 11. 职责

- CEO / 总控：冻结实验规则；Day 14 或 Day 21 批准下一轮主推候选。
- 内容与品牌：交付 24 条等规格 Pin，不新增未确认商品承诺。
- 增长与数据：UTM、排期、平台数据、GA4 数据、Day 7/14 复盘。
- 技术与自动化：恢复依赖、clean build、测量验证、部署、生产 smoke 与回滚。
- 商品与转化：只在出现真实订单或实验赢家后恢复对应供应商、样品和履约验证。

## 12. 输出与后续动作

实验结束后输出：

- 前 3 款：进入主推、供应商、样品、美国履约和商品页优化。
- 中间 3 款：更换素材后复测。
- 后 6 款：暂停主动推广，继续保持正常上架和销售。
- 样本不足：不宣布赢家，统一延长 7 天。

本设计只定义实验。生产部署、Pinterest 公开发布和任何付费行为仍须在实施计划中明确授权和验收。

## 13. 验收测试

实施前后必须验证：

- 12 个目标页面和 UTM URL 返回成功且保留首次落地查询参数。
- 每款商品一次页面访问仅产生一次 `view_item`。
- 一次加购仅产生一次 `add_to_cart`。
- consent 拒绝与接受路径符合预期。
- 管理员测试订单不进入订单、营收和客户指标。
- 24 条内容的 SKU、URL、UTM、版本和发布时间无重复或错配。
- 所有商品保持原有目录、搜索、Quiz、直链、加购和结账状态。
