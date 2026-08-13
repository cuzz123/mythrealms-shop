# Maverenne 内部链接与页面验收矩阵（内部执行稿）

状态：**仅规划；不得发布、部署或修改公开文案。** 依据 `maverenne-name-clearance.md`，`name_clearance_passed: false`。因此，本文件中的“Maverenne”只可用于内部任务标识；`clearance=false` 时，所有客户可见名称、品牌 URL、schema 名称、canonical 域名/文案、llms.txt 和社媒文案均保持冻结。本矩阵不授权新建索引 URL、改代码、提交 sitemap 或变更 Search Console/Bing/GA4。

## 适用边界与统一规则

- 仅使用现有规范 URL 和现有路由模式；链接必须是可抓取的普通 HTML `<a href>`，不得把带筛选参数的 URL、锚点 URL 或重定向入口放入 sitemap。
- 锚文本必须说明目标内容，禁止“点击这里”“了解更多”“查看全部”“首页”等空泛文本；不得为凑链接而把所有页面批量指向 `/`。
- 禁止新增 Guardian、神话、灵性/疗愈/保护/结果导向主线；旧主题页只可被收束为中性教育、个人风格与送礼语境。
- 通用珍珠教育不证明单一商品事实。材质、珍珠类型/处理、尺寸、库存、价格、履约、配送、退货、舒适度、过敏适用性等，只能由当前 SKU 或政策主记录逐项支持。
- 事实性正文须有可见来源、日期和编辑复核；优先 GIA、FTC、Google Search Central 及经批准的一方 SKU/政策记录。竞品博客不可作为事实来源。
- 这里的“验收”是发布前/发布后核查项，不表示当前生产站已部署、可访问、被抓取或已收录。

## 链接与验收矩阵

| Source URL | 建议锚文本（指向 target） | Target URL | 用户意图 | 链接所在模块 | 直接答案 / FAQ / schema / canonical / sitemap 验收 | 事实来源要求 | 名称清查前可否实施 | Owner | 完成定义 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/`（首页） | `阅读珍珠保养基础` | `/pearls/care` | 已购买后的保养学习 | 首页“Pearl Guide”教育卡 | 首页：不新增品牌文案；保留 self-canonical；Organization/WebSite 仅核验，不改名；sitemap 已有 `/`；目标页需有答案与 FAQPage | GIA Pearl Care；FTC Jewelry Guides | **否（客户可见链接/文案冻结）**；仅可做内部映射 | 内容负责人 + SEO | 链接为单一、描述性 HTML 链接；无材质或履约暗示；目标 URL 200/self-canonical/在 sitemap |
| `/`（首页） | `按当前展示商品浏览珍珠系列` | `/collections/pearl-series` | 购物探索 | 首页系列入口 | 集合页 canonical 固定无参数 URL；CollectionPage + BreadcrumbList；仅无参数集合进 sitemap；`?type=` 必须 noindex,follow | 当前 catalog 的 `isActive`、`inStock`、`pearl-series` 记录 | **否** | 商品负责人 + SEO | 不使用“热销/稀缺/限时”等承诺；目标可见商品与 catalog 一致；筛选 URL 不进 sitemap |
| `/pearls` | `学习日常佩戴珍珠的搭配思路` | `/pearls/how-to-wear` | 风格灵感 | Guide hub 的“Styling”卡 | Hub 直接答案在 H1 后 40–60 词；目标 Article + FAQPage + BreadcrumbList；双方 self-canonical 且进 sitemap | GIA Buyer’s Guide；经核验的编辑图片/SKU 图库 | **否** | 内容负责人 | 每个子指南有不同目的；链接不是泛化 CTA；不声明特定 SKU 的舒适度、尺寸或扣件 |
| `/pearls` | `了解淡水养殖珍珠的通用术语` | `/pearls/freshwater-pearls` | 术语与评估 | Guide hub 的“Terminology”卡 | Hub FAQPage；目标直接答案 40–60 词、Article/FAQPage/BreadcrumbList、self-canonical、在 sitemap | GIA Buyer’s Guide、How GIA Analyzes Pearls、FTC | **否** | 内容负责人 + 事实审校 | 明确“通用教育”；不将术语推断为店内任一 SKU 的类型、产地、处理或品质 |
| `/pearls` | `查看中性送礼与个人风格建议` | `/pearls/symbolism` | 送礼/个人意义 | Guide hub 的“Personal style”卡 | Hub 与目标均 self-canonical、在 sitemap；目标 BreadcrumbList；如新增 FAQ，须有可见问答与 FAQPage 对应 | FTC；文化历史另须博物馆/学术/一手机构来源 | **否** | 内容负责人 + 法务/事实审校 | 不含神话、灵性、保护、疗愈、未来结果承诺；目标页与 hub 双向可达 |
| `/pearls/care` | `查看淡水养殖珍珠的通用说明` | `/pearls/freshwater-pearls` | 保养前理解术语 | “相关指南”模块，保养步骤之后 | 直接答案紧随 H1、40–60 词；Article + FAQPage + BreadcrumbList；self-canonical；在 sitemap | GIA Care；GIA 分析/购买指南；FTC | **否** | 内容负责人 | 链接与保养上下文相关；不把清洁建议应用到未核验的具体 SKU |
| `/pearls/care` | `按日常佩戴场景阅读搭配建议` | `/pearls/how-to-wear` | 保养后继续使用 | “相关指南”模块 | 同上；所有链接 resolve；目标在 sitemap | GIA；编辑图片与 SKU 图库复核 | **否** | 内容负责人 | 无“防水/耐用/适合运动”等性能延伸 |
| `/pearls/care` | `查看当前珍珠系列中的在售商品` | `/collections/pearl-series` | 从教育到选购 | 正文末“浏览商品前请查看商品详情” | 集合 canonical 无参数；CollectionPage/BreadcrumbList；无参数集合在 sitemap，筛选 URL noindex | 当前 catalog；页面不得复述商品材质/库存/价格 | **否** | 商品负责人 + 内容负责人 | 链接是购买选项而非产品事实证据；不批量加首页链接 |
| `/pearls/care` | `阅读配送政策`；`阅读退货政策` | `/shipping`；`/refund` | 售后规则 | 保养页末“购买前核对政策” | 目标 canonical/indexing/sitemap 以技术审计与政策所有者为准；不得由本页创建政策摘要 | 当前批准的第一方政策记录 | **否** | 政策负责人 | 不承诺时效、免费配送、可退条件或例外；两个目标均可访问 |
| `/pearls/freshwater-pearls` | `阅读珍珠保养基础` | `/pearls/care` | 购买后维护 | “下一步阅读” | 直接答案 40–60 词；Article + FAQPage + BreadcrumbList；self-canonical；在 sitemap | GIA、FTC | **否** | 内容负责人 | 只链接一般保养；不称店内商品为淡水/养殖/未处理 |
| `/pearls/freshwater-pearls` | `按日常佩戴场景阅读搭配建议` | `/pearls/how-to-wear` | 风格灵感 | “下一步阅读” | 同上 | GIA Buyer’s Guide；图像核验 | **否** | 内容负责人 | 无舒适、尺寸、扣件、重量推断 |
| `/pearls/freshwater-pearls` | `查看当前珍珠系列中的在售商品` | `/collections/pearl-series` | 商业比较 | 文末购物入口 | 集合页无参数 canonical；CollectionPage/BreadcrumbList；仅 canonical URL 进 sitemap | 当前 catalog | **否** | 商品负责人 | 不以集合链接证明文章教育事实或任一 SKU 珍珠属性 |
| `/pearls/how-to-wear` | `阅读珍珠保养基础` | `/pearls/care` | 日常使用后维护 | “相关指南”模块 | 直接答案 40–60 词；Article + FAQPage + BreadcrumbList；self-canonical；在 sitemap | GIA Care；FTC | **否** | 内容负责人 | 无水洗、运动、耐久、敏感肌承诺 |
| `/pearls/how-to-wear` | `查看 Everyday Light 编辑搭配` | `/edits/everyday-light` | 按风格探索 | 编辑搭配卡 | 编辑页 canonical、ItemList + BreadcrumbList、在 sitemap；不改其 IA 前先确认 breadcrumb 上级 | 经核验的编辑图片和所链 SKU 图库 | **否** | 内容负责人 + 商品负责人 | 卡片只描述造型，不声明商品规格；不存在/无效编辑 slug 即不发布 |
| `/pearls/how-to-wear` | `查看 Dinner by the Water 编辑搭配` | `/edits/dinner-by-the-water` | 按场景探索 | 编辑搭配卡 | 同上 | 经核验的编辑图片和所链 SKU 图库 | **否** | 内容负责人 + 商品负责人 | 不作“适合晚宴/防水/舒适”等商品性能承诺 |
| `/pearls/how-to-wear` | `浏览当前珍珠系列` | `/collections/pearl-series` | 选购 | 文末集合入口 | 无参数 self-canonical；带 query noindex,follow；sitemap 仅列 canonical | 当前 catalog | **否** | 商品负责人 | 不写价格、库存、材质或送达时间摘要 |
| `/gifts` | `按当前展示商品浏览珍珠系列` | `/collections/pearl-series` | 按预算/场合选购 | Gift guide 主行动 | 直接答案 40–60 词；CollectionPage/ItemList；self-canonical；在 sitemap；集合 query 不进 sitemap | 当前 catalog；价格/可售状态仅实时批准数据 | **否** | 商品负责人 + 内容负责人 | 不称“热销”“人人适合”“准时到达”；商品卡与运行时数据一致 |
| `/gifts` | `阅读日常佩戴的搭配建议` | `/pearls/how-to-wear` | 判断收礼人风格 | 送礼前检查清单 | Guide 目标 Article/FAQPage/BreadcrumbList；self-canonical；在 sitemap | GIA Buyer’s Guide；编辑图核验 | **否** | 内容负责人 | 链接说明具体用途；不承诺尺码、佩戴感或适用人群 |
| `/gifts` | `阅读配送政策`；`阅读退货政策`；`联系支持团队` | `/shipping`；`/refund`；`/contact` | 下单前风险核对 | Gift guide 购买前信息区 | 每个目标 URL 的 canonical/indexing 按生产核验；不得以 Gifts 页替代政策原文 | 当前第一方政策/联系记录 | **否** | 政策负责人 + 客服负责人 | 无手工时效、库存、退货资格或响应时间承诺；三条链接 resolve |
| `/about` | `浏览当前珍珠系列` | `/collections/pearl-series` | 建立信任后选购 | About 的“查看当前商品信息”区 | About 仅在日后授权时：直接答案 40–60 词、AboutPage + BreadcrumbList、self-canonical、在 sitemap；`/story` 必须单跳 308 至 `/about` | 批准的内部品牌规格（仅 clearance 和发布授权后）；当前 catalog | **否；页面与名称均冻结** | 品牌负责人 + 法务 + SEO | name clearance、发布授权、事实审校三者均通过后才可实施；无创始人/工坊/来源/认证断言 |
| `/about` | `阅读珍珠指南`；`阅读送礼指南`；`阅读配送政策`；`阅读退货政策`；`联系支持团队` | `/pearls`；`/gifts`；`/shipping`；`/refund`；`/contact` | 信任与购买前核对 | About 的事实指向区 | About canonical/sitemap/schema 同上；各目标保持自己的 canonical，不复制政策内容 | 对应一方指南、政策、联系方式记录 | **否** | 品牌负责人 + 各页面 Owner | 只作导航，不新增公开品牌主张；所有目标可访问、无重定向链 |
| `/pearls/stories` | `返回珍珠指南首页` | `/pearls` | 汇总学习路径 | 页面开头 breadcrumb/导览 | 直接答案 40–60 词；BreadcrumbList；self-canonical；通过 `discoveryPaths`/sitemap 生产核验；与 hub 双向链接 | 各列出文章的对应权威来源；DB 文章审核记录 | **否** | 内容负责人 + SEO | 仅列已审文章；无完整重复 Journal archive；文章卡有来源路径/链接 |
| `/pearls/stories` | `阅读珍珠保养基础`；`阅读日常佩戴建议`；`了解淡水养殖珍珠术语` | `/pearls/care`；`/pearls/how-to-wear`；`/pearls/freshwater-pearls` | 按问题进入指南 | “实用指南”卡组 | 三目标均 Article + FAQPage + BreadcrumbList、self-canonical、在 sitemap | GIA、FTC、Google Search Central；按主题匹配 | **否** | 内容负责人 | 每卡单一问题、描述性锚文本；不新增神话或效果导向栏目 |
| `/pearls/stories` | `查看已审核的 Journal 文章` | `/blog` | 阅读文章集合 | 页面末 Journal 入口 | Journal self-canonical、metadata；生产核验 ItemList/Breadcrumb 取舍、分页、DB 与 sitemap 一致 | 仅 `isPearlEditorialPost` 且来源审核通过的 DB 文章 | **否** | 编辑负责人 + SEO | 不将非珍珠文章放入可索引列表；链接目标可访问；文章 sitemap 与 DB 准入一致 |
| `/pearls/symbolism` | `阅读送礼与个人风格建议` | `/gifts` | 按场合/关系选择 | 主文后的“下一步” | 直接答案 40–60 词；BreadcrumbList；self-canonical；在 sitemap | FTC；如有文化史须博物馆/学术/一手机构 | **否** | 内容负责人 + 事实审校 | 仅个人意义与中性送礼表达；无精神/疗愈/保护/结果承诺 |
| `/pearls/symbolism` | `阅读日常佩戴的搭配建议`；`查看珍珠故事与实用指南` | `/pearls/how-to-wear`；`/pearls/stories` | 风格与延伸阅读 | “相关阅读”模块 | 目标 self-canonical、在 sitemap；Stories 与 hub 双向链接 | GIA + 已审核文章来源 | **否** | 内容负责人 | 每链接均服务明确意图；不把象征意义写成产品属性 |
| `/pearls/symbolism` | `浏览当前珍珠系列`；`阅读配送政策`；`阅读退货政策` | `/collections/pearl-series`；`/shipping`；`/refund` | 选购与政策核对 | 文末购买前信息区 | 集合仅 canonical URL 进 sitemap；政策页以生产实测 canonical/indexing 为准 | 当前 catalog、当前批准政策 | **否** | 商品负责人 + 政策负责人 | 无材质、价格、库存、配送或退货承诺；所有目标 resolve |
| `/blog`（Journal） | `阅读珍珠保养基础`；`阅读日常佩戴建议` | `/pearls/care`；`/pearls/how-to-wear` | 从文章回到常青指南 | Journal 顶部“从这里开始”模块（仅 pearl editorial 语境） | Journal self-canonical、metadata；生产核验分页、DB 准入与 sitemap；不要求凭空新增 schema | 仅审核通过的珍珠编辑文章与权威指南来源 | **否** | 编辑负责人 + SEO | 不对空/非珍珠 Journal 批量输出链接；页面、分页和 sitemap 一致 |
| `/blog/[slug]`（Journal 文章模式） | `阅读本主题的珍珠保养指南` 或 `阅读本主题的佩戴指南`（按文章主题二选一） | `/pearls/care` 或 `/pearls/how-to-wear` | 深读后继续学习 | 文章末“相关指南” | 仅 pearl editorial：动态 self-canonical、BlogPosting JSON-LD；合格文章进 sitemap；非 pearl editorial 必须 noindex,nofollow | 本文可见引用 + 对应 GIA/FTC/一手来源 | **否** | 编辑负责人 + SEO | 一文最多链接最相关的 1–2 个指南；不能用通用锚文本；不可用文章推断 SKU 事实 |
| `/faq` | `查看当前珍珠系列` | `/collections/pearl-series` | FAQ 后选购 | 与“如何查看商品详情”对应的答案内 | FAQ 专属 title/description/canonical/OG；可见 FAQ 与 FAQPage JSON-LD 一致；self-canonical、在 sitemap；Rich Results Test 仅验证资格不承诺展示 | 当前 catalog；问题若涉及规格必须转向商品详情 | **否** | 客服负责人 + SEO | FAQ 答案不写材质/履约保证；JSON-LD 与可见文本逐项一致；链接为 HTML |
| `/faq` | `阅读珍珠保养基础`；`阅读配送政策`；`阅读退货政策`；`联系支持团队` | `/pearls/care`；`/shipping`；`/refund`；`/contact` | 获得确切售后信息 | 对应 FAQ 答案内，不设孤立链接墙 | 同上；各目标 canonical/indexing 在生产环境核验 | GIA（保养）；当前批准政策和联系记录 | **否** | 客服负责人 + 政策负责人 | 每条问答只链接到能回答该问的页面；无时间/资格/服务水平外推 |
| `/collections`（集合索引） | `浏览当前珍珠系列` | `/collections/pearl-series` | 集合发现 | 有效集合卡 | Collections self-canonical、metadata；生产前比对 `CATEGORIES` 与可接受动态 slug；目标 CollectionPage + BreadcrumbList；两者在 sitemap | 当前 catalog 分类/有效 slug 清单 | **否** | 商品负责人 + SEO | 不输出无效分类链接；无效/旧 slug 按既有 308；链接不含 query |
| `/collections/pearl-series`（集合页模式） | `阅读珍珠保养基础`；`阅读日常佩戴建议` | `/pearls/care`；`/pearls/how-to-wear` | 选购前教育 | 商品网格之后“购买前指南” | 无参数 self-canonical、CollectionPage + BreadcrumbList、在 sitemap；任何 `?sort=`/`?type=` 为 noindex,follow 且不进 sitemap | GIA/FTC；不得从指南导出商品规格 | **否** | 商品负责人 + SEO | 仅放 1–2 个高相关教育链接；不因筛选参数产生可索引重复页 |
| `/collections/pearl-series`（集合页模式） | `阅读送礼指南` | `/gifts` | 按场合筛选 | 集合页“送礼时”提示 | 同上；Gifts self-canonical、CollectionPage/ItemList、在 sitemap | 当前 catalog；当前批准政策 | **否** | 商品负责人 + 内容负责人 | 不称商品适合所有人、热销或可在某日期送达 |
| `/products/[slug]`（商品页模式） | `阅读珍珠保养基础`；`阅读日常佩戴建议`；`了解淡水养殖珍珠术语`；`阅读送礼指南` | `/pearls/care`；`/pearls/how-to-wear`；`/pearls/freshwater-pearls`；`/gifts` | 下单前教育/售后准备 | 已验证商品详情页的“Guides”模块；最多 4 条 | 有效 SKU：200、self-canonical、Product + BreadcrumbList、未 noindex、进入 sitemap；构建后逐项核验。无效 slug：noindex,nofollow/404 行为以现有实现为准 | 当前 SKU 主记录对 Product JSON-LD、图片、价格、库存的逐项证明；指南仅供通用教育 | **否** | 商品负责人 + SEO + 内容负责人 | 不让链接暗示 SKU 是淡水、某材质、耐水、低敏或可按时送达；每个显示 SKU 都通过 200/canonical/schema/sitemap 四项核验 |

## 实施顺序（待 clearance 通过后才可触及公开界面）

1. **P0：建立验收基线。** 对 `/sitemap.xml`、`/robots.txt`、`/collections/pearl-series?type=earrings`、代表商品页和八个 backlog URL 记录 HTTP、跳转链、canonical、meta robots、schema 与 sitemap 出现情况；基线不足时不得发布链接变更。
2. **P0：先完成 Pearl Guide 互链。** 依次 `/pearls`、`/pearls/care`、`/pearls/freshwater-pearls`、`/pearls/how-to-wear`；逐页完成答案、来源与 HTML 链接验收，不引入 SKU 推断。
3. **P1：连接商业决策页。** `/gifts`、`/collections`、`/collections/pearl-series`、`/products/[slug]`；先由 catalog/policy owner 签字，再验证参数页 noindex 和 sitemap 排除。
4. **P1：收束发现与支持路径。** `/pearls/stories`、`/pearls/symbolism`、`/blog`、`/blog/[slug]`、`/faq`；确保只保留中性教育与已审核文章，FAQ JSON-LD 必须与可见文本相同。
5. **P2：最后处理首页与 About。** 首页仅在名称/公开文案解冻后实施；`/about` 还必须具备发布授权、品牌事实记录与 `/story` 单跳 308 验证。不得把 Guardian/神话路线并入本计划。

## 机器可核验清单

以下命令/断言是发布门禁示例；需在已授权的预发布或生产环境执行，并记录 URL、时间、响应与负责人。所有 `clearance=false` 时仅允许做内部核验，不得据此发布客户可见改动。

- [ ] `maverenne-name-clearance.md` 中 `name_clearance_passed: true`、`purchase_authorized: true`、`production_migration_authorized: true`，且有授权 Owner 的发布签字；任一为 `false` 即阻断所有公开改动。
- [ ] 对矩阵每一条 source→target，页面 HTML 中存在精确 target 的 `<a href="…">`，锚文本非空，且不匹配 `点击这里|了解更多|查看全部|首页`。
- [ ] 矩阵中的规范 target 返回 200（或已批准的单跳永久迁移），最终 URL 自指 canonical；不得有重定向链、4xx 或 canonical 指向参数 URL。
- [ ] `/collections/pearl-series?type=*` 与 `?sort=*` 含 `noindex,follow`，canonical 指向无参数 `/collections/pearl-series`，且其参数 URL 不出现在 `/sitemap.xml`。
- [ ] `/sitemap.xml` 不含 4xx、noindex、参数化筛选、私有/结账 URL；有效商品 URL 同时满足 200、self-canonical、Product JSON-LD、非 noindex。
- [ ] `/pearls` 与三个指南页的 H1 后直接答案为 40–60 个英文单词；可见来源、日期、byline 存在；每项事实能映射到批准来源。
- [ ] FAQ 可见问答与 FAQPage JSON-LD 问答逐字语义一致；Article/BlogPosting/Product/CollectionPage/BreadcrumbList 的 URL 与 canonical 一致；富结果测试只作为资格核验。
- [ ] `rg -n -i 'guardian|myth|mythology|therapeutic|healing|protection|water.?resistant|hypoallergenic|best.?selling|handmade|custom|scarcity|guarantee|delivery'` 对拟发布客户可见差异逐项人工判定为无新增违规声明。
- [ ] 每个商品、集合和政策相关链接的显示性事实均有当前 SKU/catalog/policy 一方记录；没有记录即删除该事实，而不是以通用珍珠知识补足。

## 来源与责任说明

本矩阵来自 `maverenne-seo-geo-backlog.md` 的八个既有 URL、`maverenne-seo-technical-inventory.md` 的路由/metadata/schema/sitemap 审计，以及 `maverenne-name-clearance.md` 的冻结状态。Owner 是验收职责分配，不代表已获发布、改名、域名或外部平台操作授权。
