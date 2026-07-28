# SOP-30 v0.2：Reviewer-ready 字段级证据包

**证据包 ID：** `SOP-30-TRIAL-2026-07-28-V02`
**SOP / Status：** `SOP-30 v0.2 / draft`
**执行人：** 商品与转化会话
**执行日期 / 时区：** 2026-07-28 / Asia/Shanghai
**独立 Reviewer：** CEO / 总控（与商品与转化 Owner 分离）；复核日期 2026-07-28
**review_date：** 2026-08-07
**范围：** Violet Pendant A-v2 内部结构锚点与当前 12 款铺货验证商品矩阵的静态证据分类。
**范围外：** 商品状态、价格、库存、营销冻结/解冻、素材公开使用、发布、部署、外联、采购或付款。

## 治理结论

独立 Reviewer 已完成治理复核，结论为 `Pass / ready_candidate`。这只表示 v0.2 的模板、分层、停止条件与 `ready` / `active` 边界可执行；不把源 Status 改为 `ready`。正式 `ready` 仍等待统一 Git 版本治理；`active` 必须由拥有既有权限的批准人另行书面批准并记录生效范围。

## 字段级记录

| record_id | 适用对象 / 版本 / 环境 | 字段或声明 | evidence_category | 结论 | 原始证据与取得时间 | 强度 / 允许用途 | Owner 以外 Reviewer / 复核日 | 下次复核 / 失效触发 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| VP-A2-OBS-01 | Violet Pendant / A-v2 / 内部生成参考 | 单链、多色珠子节奏、底部单主坠、短顶部连接、顶部延长/端环等可观察结构。 | `observable` | **通过（结构 Keep）** | `video-pipeline/asset-library/11-continuity-reference-packs/VIOLET_PENDANT_SEQUENCE_001/A-product-anchor/STRUCTURE_QA_RESULT_v2.md`；2026-07-28。 | 仅作内部 A 结构锚点。 | CEO / 总控 / 2026-07-28（治理独立复核） | A-v2 文件、源图或结构约束变化时。 |
| VP-A2-TECH-01 | Violet Pendant / A-v2 / 本地文件 | 输出路径、`provenance.json` 与 SHA-256 `CC6982…6B03F` 一致。 | `technical` | **通过（文件一致性）** | `generated-reference-v2/provenance.json` 与 A-v2 QA 结果；2026-07-28。 | 仅证明记录/输出一致。 | CEO / 总控 / 2026-07-28（治理独立复核） | 输出文件、hash 或 provenance 变更时。 |
| VP-A2-OP-01 | Violet Pendant / A-v2 / 未指定地区 | 素材权利、供应商/SKU 映射、材质/规格、样品一致、真实价格/库存、履约。 | `operational` | **待确认** | A-v2 QA 明确排除这些结论；没有对应一手经营证据。 | 不可用于公开商品事实、可售或履约承诺。 | CEO / 总控 / 2026-07-28（治理独立复核） | 任一供应、样品、权利、规格、价格/库存或履约证据到达时。 |
| VP-A2-MKT-01 | Violet Pendant / A-v2 / 未指定地区与渠道 | A-v2 的营销或公开素材授权。 | `marketing` | **待确认** | 未有 SOP-30 §11.1 的授权记录；A-v2 Keep 明确不解除营销或发布限制。 | 不得导流、投放或公开使用。 | CEO / 总控 / 2026-07-28（治理独立复核） | 出现完整营销签核或素材/范围变化时。 |
| AS12-TECH-01 | 12 款铺货验证商品 / 2026-07-25 历史生产 smoke | 12/12 HTTP 200、Pinterest UTM 保留、服务端 HTML 含 Add to Cart。 | `technical` | **通过（历史技术）** | `docs/company/assortment-12-product-conversion-evidence-matrix.md`，引用 2026-07-25 smoke。 | 仅作历史技术入口基线。 | CEO / 总控 / 2026-07-28（治理独立复核） | 生产、URL、模板或测试环境变化时。 |
| AS12-OBS-01 | 12 款铺货验证商品 / 页面与目录展示 | 商品名称/URL、页面显示价格与 `inStock` 展示、模板文字。 | `observable` | **通过（展示存在）** | `docs/company/assortment-12-product-conversion-evidence-matrix.md`；2026-07-28。 | 只可写为页面/代码显示值。 | CEO / 总控 / 2026-07-28（治理独立复核） | 页面、目录或模板文字变化时。 |
| AS12-TECH-02 | 12 款铺货验证商品 / 本地代码与历史回归 | 代码标题/self-canonical 模式、共享 Add to Cart 模板；The Shell Bloom 历史 390×844 CTA 回归。 | `technical` | **通过（限定技术）** | 同上；生产 canonical、其余 11 款真机和完整加购/结账前仍未逐页验证。 | 仅作本地配置/历史回归证据。 | CEO / 总控 / 2026-07-28（治理独立复核） | 路由、模板、生产环境或回归记录变化时。 |
| AS12-OP-01 | 12 款铺货验证商品 / 各 SKU | 供应商/SKU、主图—实物—权利链、材质/规格、真实售价/库存、履约/退换。 | `operational` | **阻塞** | 矩阵明确为待确认，且共享承诺缺经营证据。 | 不得使用未核验商品或履约承诺。 | CEO / 总控 / 2026-07-28（治理独立复核） | 对应 SKU 的一手证据、样品或履约闭环到达时。 |
| AS12-TECH-03 | 12 款铺货验证商品 / 生产移动链路 | 逐商品真机首屏 CTA、实际加购和结账前导航。 | `technical` | **待确认** | Shell Bloom 仅有历史自动化/sticky CTA；其余 11 款缺逐商品生产真机记录；全体缺实际加购/结账前完整记录。 | 不得写为完整转化链路已验收。 | CEO / 总控 / 2026-07-28（治理独立复核） | 真机/等效生产复核记录到达时。 |
| AS12-MKT-01 | 12 款铺货验证商品 / 未指定地区与渠道 | 对 12 款商品的主动营销、导流、广告或重点推荐授权。 | `marketing` | **待确认** | 未有 §11.1 签核；矩阵的 P0/P1 是修复风险，不是营销批准。 | 不得把技术可访问性解释为营销解冻。 | CEO / 总控 / 2026-07-28（治理独立复核） | 指定 SKU、地区、渠道、素材、允许声明与期限的完整签核到达时。 |

## 分类复核

| 检查 | 结果 |
| --- | --- |
| A-v2 Keep 是否只记录为 `observable` | **是**；其 provenance/hash 单列为 `technical`，没有 `operational` 或 `marketing=通过`。 |
| 12 商品矩阵的历史 smoke 与展示值是否只记录在允许层级 | **是**；分别记录为 `technical` 与 `observable`。 |
| 任一 `operational` 或 `marketing` 是否被写为通过 | **否**；A-v2 两类均为待确认；12 商品的经营字段为阻塞、营销字段为待确认。 |
| 独立 Reviewer 与 `active` 批准是否被混同 | **否**；CEO / 总控已完成独立治理复核，`active` 批准仍不存在。 |

## 停止条件

- 独立 Reviewer 复核后，本包登记为 `ready_candidate`；在统一 Git 版本治理完成前仍不能作为正式 `ready` 结论。
- 即使完成 `ready`，也不得据此将 SOP 写为 `active`，或执行任何商品/营销/外部动作。
- 任一输入版本、来源、页面、素材、供应、价格/库存、政策、履约或渠道范围变化时，受影响记录必须重审。

## 独立 Reviewer 留档

**Reviewer：** CEO / 总控（既有内部治理 reviewer；与商品与转化 Owner 分离）
**复核日期：** 2026-07-28
**判定：** `Pass / ready_candidate`

复核确认：`ready` 与 `active` 已拆分；A-v2 的 `structure_keep` 仅进入 `observable`，其输出路径/provenance/hash 仅进入 `technical`；12 商品矩阵中的历史 HTTP/UTM/Add-to-Cart、代码和展示值未被升级为 `operational` 或 `marketing`。所有经营/营销缺口继续为“待确认”或“阻塞”，字段模板、Reviewer、复核日和失效触发均可实际填写。

本结论不批准商品事实、素材公开使用、营销解冻、发布、部署、外联、采购、付款或商品状态改变。源 SOP 与本证据当前未纳入 Git 跟踪，正式 `ready` 等待统一版本治理；源 Status 继续为 `draft`。
