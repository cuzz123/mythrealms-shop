---
name_clearance_passed: true
clearance_basis: "Founder accepted cold-start operating risk after no-result USPTO/WIPO manual screens and preliminary public-web review"
legal_clearance_completed: false
purchase_authorized: true
domain_owned: true
registrant_email_verified: true
production_migration_authorized: false
checked_at: 2026-07-27T11:30:00+08:00
scope: "Read-only public-source preliminary clearance; United States jewelry and accessories"
---

# Maverenne 名称清查证据记录

## 2026-07-27 冷启动运营放行

- 创始人在 USPTO Trademark Search 第一方界面手动核验 `Maverenne`、`Maverene`、`Maveren`、`Maverenn`、`Maverinne`，报告五组均为 `No results found`。
- 创始人在 WIPO Global Brand Database 第一方界面核验相同五组词，报告均无结果。
- 公开互联网初筛未发现可识别的同名珠宝、饰品、时尚或零售同业商业主体。
- 创始人已购买 `maverenne.com` 一年并完成注册联系人邮箱验证；Verisign RDAP 已返回域名对象，注册期至 `2027-07-27T03:13:16Z`。
- 创始人明确接受尚无美国商标律师正式意见的冷启动风险，并授权开始隔离环境中的品牌代码替换。
- `name_clearance_passed=true` 仅表示本项目内部实现门槛放行，不代表法律意见或保证可注册；`legal_clearance_completed=false`。
- DNS、外部账号和生产迁移仍未授权，`production_migration_authorized=false`。

> **不是法律意见。** 本记录只汇总公开、权威或第一方来源中的只读初步证据，不替代美国持牌商标律师的完整清查、近似性判断或法律意见。搜索无命中、页面不可访问或 RDAP 404 均不得表述为“可注册”“无冲突”或“可购买”。

## 当前结论

| 门槛 | 当前值 | 结论依据 |
| --- | --- | --- |
| `name_clearance_passed` | `true` | 创始人完成 USPTO/WIPO 五组词人工初筛并接受冷启动运营风险；此值只放行隔离代码实现，不等于法律意见。 |
| `purchase_authorized` | `true` | 创始人已自行购买 `maverenne.com`，注册局 RDAP 已确认域名对象。 |
| `production_migration_authorized` | `false` | 未授权 DNS、生产环境变量或生产部署。 |

本次没有发现可以据以宣称“确定冲突”的证据；同样没有足够证据宣称名称可以注册或使用。证据不足本身即触发停止规则。

## 查询范围与方法

- 查询时间：`2026-07-26T08:30:21+08:00`（Asia/Shanghai）。
- 名称词组：精确词 `Maverenne`；近似/误拼词 `Maverene`、`Maveren`、`Maverenn`、`Maverinne`；组合词 `Maverenne Jewelry`、`Maverenne Accessories`。
- 商品/服务重点：Nice 第 `14` 类（珠宝、首饰及相关钟表商品）、`18` 类（包、皮具等配饰）、`26` 类（发饰及其他非珠宝装饰品）和 `35` 类（线上/实体零售服务）。
- 审查边界：类别只是检索重点，不是排除边界。USPTO 明确说明，商品或服务无需处于同一国际类别也可能相关；标记也无需完全相同，只要在外观、读音、含义或商业印象上近似且商品/服务相关，就可能产生混淆。
- 操作边界：仅访问公开 URL 和公开 HTTP/RDAP 响应；未登录、未绕过验证码、未购买/预订域名、未占用用户名、未申请商标、未联系律师或其他第三方、未修改 DNS、账号或生产配置。

## 证据记录

### 1. USPTO Trademark Search

| 字段 | 记录 |
| --- | --- |
| 官方查询入口 | [USPTO Trademark Search](https://tmsearch.uspto.gov/search/search-information) |
| 精确词 URL | [查询参数为 `maverenne` 的结果入口](https://tmsearch.uspto.gov/search/search-results?searchType=all&searchTerm=maverenne) |
| 实际查询词 | `Maverenne`；其余近似词和组合词因未取得可复核结果会话，均不得标记为已完成 |
| HTTP 观察 | 精确词 URL 返回 HTTP `200`、`Content-Type: text/html` 和静态应用文档；公开响应本身没有提供结果数、命中列表、筛选条件或查询时点快照。HTTP 200 只证明应用外壳可访问，不证明查询执行成功。 |
| 可复核结果 | `not_available` |
| 项目判定 | `fail`（证据不完整） |

官方方法依据：

- [USPTO Federal trademark searching](https://www.uspto.gov/trademarks/search/federal-trademark-searching) 要求从精确词扩展到其他拼写和读音，并逐项评估标记近似性、商品/服务相关性与存续状态；官方明确说没有一种查询能保证发现所有潜在冲突。
- [USPTO Likelihood of confusion](https://www.uspto.gov/trademarks/search/likelihood-confusion) 明确将外观、读音、含义、商业印象和商品/服务关系纳入判断。
- [USPTO Comprehensive clearance search](https://www.uspto.gov/trademarks/search/comprehensive-clearance-search-similar-trademarks) 明确指出完整清查不限于联邦数据库，还包括官方公报、州登记、域名、国际数据库和普通法使用，并建议由有经验的美国持牌律师解释结果。

局限：本次没有取得任何查询词的完整结果页、结果数、命中详情或状态/类别筛选快照；因此不能排除第 14/18/26/35 类或其他相关类别中的在先申请、注册或普通法权利，也不能把精确词 URL 的可访问性写成“零命中”。

### 2. WIPO Global Brand Database

| 字段 | 记录 |
| --- | --- |
| 官方查询入口 | [WIPO Global Brand Database](https://branddb.wipo.int/en/quicksearch) |
| 计划查询词 | `Maverenne`、`Maverene`、`Maveren`、`Maverenn`、`Maverinne` |
| 公开响应观察 | 页面在进入检索界面前返回 `altcha-widget` 验证挑战，并调用 WIPO 自有 `https://api.branddb.wipo.int/captcha`；本次没有绕过或代替验证。 |
| 可复核结果 | `not_available` |
| 项目判定 | `fail`（访问限制导致证据不完整） |

覆盖范围依据：[WIPO Global Brand Database 官方说明](https://www.wipo.int/en/web/global-brand-database/index) 显示数据库涵盖 Madrid 国际商标及参与国家/地区局的集合，同时明确建议另查国家/地区知识产权局登记。故即使日后取得 WIPO 空结果，也不能单独证明全球无冲突或名称可注册。

局限：所有计划词均未形成结果数、空结果或命中详情的可复核快照；不能排除国际注册或参与局记录，亦不能推断未参与/更新滞后的登记情况。

### 3. `maverenne.com` RDAP / 注册状态

| 字段 | 记录 |
| --- | --- |
| 权威 RDAP URL | [Verisign `.com` RDAP](https://rdap.verisign.com/com/v1/domain/maverenne.com) |
| 查询词 | `maverenne.com` |
| 实际响应 | HTTP `404 Not Found`；`Content-Type: application/rdap+json`；响应时间点为本文件 `checked_at` 附近。 |
| 有限含义 | 查询当时，Verisign `.com` RDAP 服务没有返回该名称的域名对象。 |
| 可购买性结论 | `not_available` |
| 项目判定 | `fail`（尚无获批注册商实时结果） |

技术依据：[IANA 对 RDAP 服务的测试要求](https://www.iana.org/help/rdap-requirements) 说明，不存在于该 RDAP 服务中的域名应返回 4xx，而存在的域名对象应返回 200 和标准域名 JSON。该技术语义只说明 RDAP 对象是否返回，不提供注册商库存、首年/续费价格、保留、溢价、商标限制或结账可用性。

局限：未指定并访问公司获批注册商的实时搜索页；未取得价格、续费、保留/溢价提示或注册条款。`404` 因而不得改写为“未注册”“可注册”或“可购买”。未进行购买、预订、加购、结账或 DNS 变更。

### 4. 社交用户名（非法律清查结论）

| 平台 | 第一方公开 URL | 查询用户名 | 公开证据状态 |
| --- | --- | --- | --- |
| Pinterest | [公开资料 URL](https://www.pinterest.com/maverenne/) | `maverenne` | `not_available` |
| TikTok | [公开资料 URL](https://www.tiktok.com/@maverenne) | `maverenne` | `not_available` |
| Instagram | [公开资料 URL](https://www.instagram.com/maverenne/) | `maverenne` | `not_available` |

本次公开、未登录访问未取得平台明确的“存在”“不存在”“可用”或“不可用”状态证据；网络超时、限流、空白页、404 或登录墙均可能有多种原因，不能据此推断用户名可用。未登录、未尝试创建/改名、未占用用户名、未发布内容。

局限：资料 URL 不存在也不等同于用户名可注册；最终状态只能由获授权账号管理员在平台第一方界面内只读确认并留存平台明确提示。社媒状态是内部渠道一致性门槛，不是商标可注册性的法律结论。

## 明确布尔门槛

以下条件采用“全部满足”逻辑；任何 `fail`、`not_available`、缺失快照、过期证据或待复核项都保持对应值为 `false`。

### `name_clearance_passed`

仅当以下条件全部满足，且另有授权人员明确更新本字段时，才可考虑改为 `true`：

1. USPTO 中上述精确词、近似拼写、读音/商业印象变体已形成可复核的完整查询记录，并审阅所有相关 live 记录及必要的 dead/common-law 风险；
2. WIPO 中全部计划词已有可复核结果，并补查相关国家/地区官方登记范围；
3. 依 USPTO 官方方法完成州登记、官方公报、互联网普通法使用及相关商品/服务范围的完整清查；
4. 相关命中、搜索范围和局限已经有经验的美国持牌商标律师书面复核并明确认可继续使用/申请；
5. 内部命名负责人明确批准，且社媒渠道一致性风险已被接受或解决。

当前：创始人已明确接受尚无律师正式意见的冷启动风险，因此内部代码实现门槛记录为 `name_clearance_passed=true`；法律清查状态另以 `legal_clearance_completed=false` 表示。

### `purchase_authorized`

仅当 `name_clearance_passed=true`、获批注册商实时显示 `maverenne.com` 可注册且价格/续费/保留/溢价/条款均已复核，并取得独立书面购买与预算批准后，才可改为 `true`。RDAP 404、购物车可加入或注册商搜索结果本身均不是购买授权。

当前：创始人已自行完成域名购买，故 `purchase_authorized=true`、`domain_owned=true`。

### `production_migration_authorized`

仅当 `name_clearance_passed=true`、所需域名/账号已通过合法获批流程取得、迁移与回滚证据通过复核，并取得独立书面生产变更批准后，才可改为 `true`。

当前：条件未满足，故 `production_migration_authorized=false`。

## 停止规则与下一步

- 立即保持三项布尔值为 `false`，不得据此推进客户可见改名或生产迁移。
- 由获授权人员在 USPTO 和 WIPO 第一方界面中完成全部查询并保存带 URL、查询词、时间、结果数和命中详情的证据；验证码必须由人工正常完成，不得绕过。
- 由有经验的美国持牌商标律师完成完整清查和书面近似性判断；本文件不替代该工作。
- 由获授权账号管理员在平台第一方界面中只查看社媒用户名状态；不得保存改名或占用。
- 只有在名称门槛通过后，才由获批注册商提供域名实时状态；查询不等于购买，购买和生产迁移仍需各自独立授权。
