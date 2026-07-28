# SOP-10 v0.2 只读重演证据｜`/pearls/how-to-wear`

**SOP version / status：** v0.2 / `draft`

**重演日期：** 2026-07-28

**执行人：** 增长与数据（Codex；只读内部复核）

**独立治理 reviewer：** CEO / 总控（与增长与数据 Owner 分离）；复核日期 2026-07-28。当前结论：`Pass / ready_candidate`。

**治理边界：** v0.2 允许既有 URL 的桌面证据演练与模板填充；它不等于 SOP 已激活，也不构成阶段 5 本地代码、发布、部署、外部平台、canonical/redirect/noindex、sitemap 或商品状态授权。内部治理 reviewer 记录见本文末；正式 `ready` 仍等待统一 Git 版本治理。

**范围：** 同一既有 `/pearls/how-to-wear`，阶段 1–5。未登录、读取或写入外部平台；未修改代码、URL、canonical、生产或商品状态。

## 重演结论

阶段 1 的公开 SERP 意图证据、阶段 2 的既有 URL 决策、阶段 3 的内部来源/copy 包均可登记。来源复开、链接/图片、FAQ-schema 与阶段 4 QA 没有完成记录，因此阶段 4 为 `blocked`，阶段 5 为 `not_done`。本重演不产生本地实现、部署、收录、AI 引用、真实访问或业务结果。

## 阶段 1｜查询与意图证据

| v0.2 字段 | 结果 | 状态 | 证据 / 边界 |
| --- | --- | --- | --- |
| 现有 URL | `/pearls/how-to-wear` | 已记录 | 既有路由；未创建新路径。 |
| 用户问题 / 意图 | “How can I wear pearls day to day?”；信息型、偏好导向的日常造型意图 | 已记录 | `maverenne-phase2-seo-geo-execution-queue.md`。 |
| 公开 SERP 记录 | everyday pearl jewelry、how to style pearl jewelry、pearl earrings for everyday wear、modern/casual styling 相邻查询簇 | 部分可复核 | `maverenne-us-serp-query-map-2026-07-28.md`；日期 2026-07-28、美国英语地区假设。非搜索量、排名、点击或流量证据。 |
| GSC / Bing query-page | 无已核验 property/site 导出或截图 | `not_available` | 不填 `0`。 |

**阶段 1 结果：** 通过公开 SERP 抽样的最小意图描述路径；平台表现读取仍为 `not_available`。

## 阶段 2｜既有 URL 优先

| v0.2 字段 | 结果 | 状态 | 证据 / 边界 |
| --- | --- | --- | --- |
| 当前动作 | `rewrite_candidate（首批本地）` | 已记录 | `maverenne-phase2-url-decision-register.md`。 |
| 等价目标 | `/pearls/how-to-wear` | 已记录 | 同一路径；不创建 redirect/noindex。 |
| 页面用途 | 日常珍珠搭配／风格灵感 | 已记录 | URL 决策登记册。 |
| canonical / schema 代码意图 | canonical、Article + FAQPage + BreadcrumbList | 源码意图已记录 | `maverenne-seo-technical-inventory.md`；不是生产 HTTP、最终 `<head>` 或收录证据。 |
| 进入代码条件 | 来源/copy、图片身份与权利、Edit slug、40–60 词答案、FAQ/schema、描述性链接审校 | 条件已记录 | 本重演仅判断记录，不视作已满足。 |

**阶段 2 结果：** 保持既有 URL；生产 canonical/HTTP 为 `not_available`。

## 阶段 3｜来源复开、事实与编辑判断

### 来源复开记录

| 来源 URL | 访问日 | 审阅人 | 支持范围 | 判断标记 | 结果 |
| --- | --- | --- | --- | --- | --- |
| `https://developers.google.com/search/docs/fundamentals/creating-helpful-content` | `not_done` | 待 CEO 指派的独立 reviewer | 仅支持清晰、以人为本的编辑过程；不支持具体造型、SKU 或结果主张。 | `editorial_judgment` | `not_done` |
| `https://www.gia.edu/pearl/buyers-guide` | `not_done` | 待 CEO 指派的独立 reviewer | 一般珍珠护理中与化妆品/香水接触有关的边界；不支持任何店内 SKU 事实。 | `external_fact` | `not_done` |
| `https://www.gia.edu/gia-news-research/pearl-care-cleaning` | `not_done` | 待 CEO 指派的独立 reviewer | 一般珍珠护理、软布、避免高温/蒸汽/超声波等边界；不支持完成品或 SKU 护理适用性。 | `external_fact` | `not_done` |
| `https://consumer.ftc.gov/articles/buying-gemstones-diamonds-and-pearls` | `not_done` | 待 CEO 指派的独立 reviewer | 一般消费者核对描述/书面信息边界；不支持任何具体价格、库存、履约或商品事实。 | `external_fact` | `not_done` |
| `https://consumer.ftc.gov/articles/buying-platinum-gold-and-silver-jewelry` | `not_done` | 待 CEO 指派的独立 reviewer | 一般消费者核对商品说明边界；不支持任何店内材质、金属、镀层或政策事实。 | `external_fact` | `not_done` |
| 当前 SKU / 政策主记录 | `not_available` | 对应商品 / 政策 Owner 待确认 | 仅在拟议 copy 对 SKU、价格、库存、配送、退换或产品细节作出主张时需要；本草稿不以此类事实支撑造型建议。 | `first_party_product_policy_fact` | `not_available` |

### copy 与分类复核

| 项目 | 结果 | 状态 | 边界 |
| --- | --- | --- | --- |
| Title / meta / H1 / 正文 / 3 条 FAQ | 已在 `maverenne-how-to-wear-source-and-copy.md` 形成内部 review-ready 包 | 已记录 | 不代表页面已实现或公开。 |
| 直接答案 | 52 英文词 | 已记录 | 在 40–60 词范围；未经实际页面渲染/差异审校。 |
| 造型建议 | `editorial_judgment` | 已分类 | 必须保持可选、偏好导向，不能升级为产品事实、普适规则或效果承诺。 |
| 一般珍珠护理 | `external_fact` | 已分类，来源复开未完成 | 发布前需要上表完整复开记录。 |
| SKU / 政策细节 | `first_party_product_policy_fact` | `not_available` | 不得由图片、一般教育或相邻 SKU 推断。 |
| 禁止主张扫描 | 规则已在来源包列出 | `not_done` | 没有拟议代码 diff，不能报告扫描通过。 |

**阶段 3 结果：** copy 和判断标记已记录；所有需要来源复开的项目仍是 `not_done`，不构成阶段 4 通过。

## 阶段 4｜链接、图片、FAQ/schema 与本地代码准入

### 普通 HTML 链接 QA

| 目标 URL | 拟议描述性锚文本 | 用户目的 | Owner/reviewer | 可达性 | 事实边界 | 结果 |
| --- | --- | --- | --- | --- | --- | --- |
| `/pearls/care` | Read pearl care guidance | 转向一般护理教育 | 待确认 | `not_done` | 不能证明具体 SKU 的护理适用性。 | `not_done` |
| `/pearls` | Explore the Pearl Guide | 转向教育 hub | 待确认 | `not_done` | 不证明任何产品事实。 | `not_done` |
| `/gifts` | Read the pearl jewelry gift guide | 可选礼赠教育上下文 | 待确认 | `not_done` | 不承诺收礼适配、库存、价格或履约。 | `not_done` |
| `/collections/pearl-series` | Browse the current pearl collection | 转向当前目录 | 待确认 | `not_done` | 目录链接不是材质、珍珠类别、库存或价格事实证据。 | `not_done` |
| `/contact` | Ask about a product detail | 查询经核验的产品细节 | 待确认 | `not_done` | 不承诺支持结果或服务水平。 | `not_done` |

禁止加入 `/pearls/stories`、`/pearls/symbolism`、Guardian、神话或象征主题链接；本重演没有拟议差异，故没有链接加入或删除动作。

### 图片权利 QA

| 资产 ID / 路径 | 来源 / 商业使用权 | SKU 关联状态 | 事实边界 | reviewer / review_date | 结果 |
| --- | --- | --- | --- | --- | --- |
| 拟议编辑图 | `not_available` | `not_available` | 没有身份证据时不得使用产品图，也不得从图片推断 SKU 事实。 | 待 CEO 指派 / 2026-08-07 | `not_done` |

### FAQ 正文—schema 对照

| FAQ 编号 | 可见问题 / 答案 | schema 问题 / 答案 | 比较方式 | 结果 | reviewer / review_date |
| --- | --- | --- | --- | --- | --- |
| 1 | 来源包中的 FAQ 1 | `not_available`（未实施页面未抽取 JSON-LD） | 实质语义对照 | `not_available` | 待 CEO 指派 / 2026-08-07 |
| 2 | 来源包中的 FAQ 2 | `not_available`（未实施页面未抽取 JSON-LD） | 实质语义对照 | `not_available` | 待 CEO 指派 / 2026-08-07 |
| 3 | 来源包中的 FAQ 3 | `not_available`（未实施页面未抽取 JSON-LD） | 实质语义对照 | `not_available` | 待 CEO 指派 / 2026-08-07 |

### 阶段 4 本地代码准入结果

| v0.2 准入项 | 结果 | 状态 |
| --- | --- | --- |
| 每个 `external_fact` 有来源复开字段 | 全部访问日/reviewer 为 `not_done` | `blocked` |
| 判断标记完整并满足边界 | 标记已登记；一方商品/政策主记录为 `not_available` | `blocked` |
| 禁止主张扫描 | 没有拟议差异可扫描 | `not_done` |
| 链接与图片 QA | 所有链接可达性/Owner 未核；图片身份/权利缺失 | `blocked` |
| FAQ—schema 对照 | 无实施页面的可见正文/JSON-LD 抽取 | `not_available` |
| 独立 reviewer 结论 | 待 CEO / 总控指派 | `not_done` |

**阶段 4 结果：** `blocked`。不进入公开代码、部署或外部验证。

## 阶段 5｜隔离实现与最小本地验收

| v0.2 本地验收记录 | 结果 | 状态 |
| --- | --- | --- |
| 书面隔离授权引用、URL 范围、工作树/分支、提交/差异标识、执行人、技术 reviewer、执行日期 | 仅有本次只读重演；其他字段均 `not_available` | `not_done` |
| 路由保持、metadata/H1、40–60 词答案、FAQ-schema、普通 HTML 链接、禁止主张扫描 | 没有代码 diff 或本地页面实现 | `not_done` |
| 测试 / 静态检查 / 渲染或快照、命令/输出/时间戳 | 没有运行 | `not_available` |
| 差异审阅结论 / 回滚范围 | 没有差异或回滚对象 | `not_done` |

**阶段 5 结果：** `not_done`。v0.2 的内部桌面演练条件不构成隔离实施授权；本重演未修改任何代码。

## 未进入的阶段与数据状态

阶段 6–10 未进入。生产 HTTP、最终 `<head>`、canonical、robots、sitemap、GSC、Bing、GA4、反链和 AI 搜索引用均为 `not_available`。未执行外部登录、读取、截图或写入。

## reviewer 结论位置

| reviewer | 结论 | 日期 | 状态 |
| --- | --- | --- | --- |
| CEO / 总控（独立治理 reviewer） | **Pass：** v0.2 重演正确区分已记录、`not_done`、`not_available` 与 `blocked`；阶段 4 保持 `blocked`，阶段 5 保持 `not_done`。该结论只支持 SOP-10 成为 `ready_candidate`，不批准页面进入代码、发布或生产。 | 2026-07-28 | `Pass / ready_candidate` |

阶段 3–5 的内容、事实、链接、图片与技术字段 reviewer 并未因本次治理复核而补做；其对应 `not_done` / `not_available` 状态继续有效。旧 `sop-10-trial-how-to-wear-2026-07-28.md` 仅作 v0.1 历史引用，不覆盖本 v0.2 重演。源 SOP 与本证据当前未纳入 Git 跟踪，因此尚不能形成正式 `ready` 的稳定版本、diff 与批准基线。

## 精确输入文件

- `docs/company/sops/10-seo-geo-page-lifecycle.md`
- `docs/company/sops/evidence/sop-10-trial-how-to-wear-2026-07-28.md`（历史 v0.1 试运行）
- `docs/company/maverenne-us-serp-query-map-2026-07-28.md`
- `docs/company/maverenne-phase2-url-decision-register.md`
- `docs/company/maverenne-seo-technical-inventory.md`
- `docs/company/maverenne-how-to-wear-source-and-copy.md`
