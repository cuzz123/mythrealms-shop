# Turquoise Leaf 产品事实包

**内部状态：** 产品图库混入不同结构版本，暂停发布和视频生成

**最后核对日期：** 2026-07-19

## 站内记录

| 字段 | 当前记录 | 证据 |
| --- | --- | --- |
| 产品名称 | The Turquoise Leaf - Bracelet | `src/lib/new-series-products.ts` |
| 产品 ID | `new-series-012` | `src/lib/new-series-products.ts` |
| Slug | `new-series-leaf-turquoise-pearl-cuff` | `src/lib/new-series-products.ts` |
| 分类 | The Pearl Edit／手镯 | `src/lib/new-series-products.ts` |
| 当前售价 | 48.99 美元 | `src/lib/new-series-products.ts` |
| 当前代码库存状态 | `inStock: true` | `createProduct()` 当前默认值；不代表供应商实际有货 |
| 商品页 | `/products/new-series-leaf-turquoise-pearl-cuff` | 站内路由 |
| 镜头包 | `SHOT_TURQUOISE_LEAF_COLD_START_001` | `video-pipeline/asset-library/09-shot-templates/` |

## 供应商原图

源目录：`public/images/products/new-series/new-series-leaf-turquoise-pearl-cuff/`

| 文件 | 可见结构 | 一致性判断 |
| --- | --- | --- |
| `main.jpg` | 开口金色调绞线手镯；中央不规则白色片；左右各一颗蓝绿色圆珠；两个开口端各一颗白色不规则珠 | 与当前镜头包锁定结构一致 |
| `detail-01.jpg` | 开口金色调手镯；中央白色片周围增加一排小白珠；未显示左右蓝绿色圆珠 | 与 `main.jpg` 不是同一结构版本 |
| `detail-02.jpg` | 中央不规则白色片、左右蓝绿色圆珠、两端白色不规则珠 | 与 `main.jpg` 基本一致 |

图库结论：当前商品页把至少两种不同结构的手镯放在同一商品图库中，但站内没有款式选择器，买家无法知道实际会收到哪一种。

原图含 `GLSEEVO` 标识，发布时不得裁切成看似 MythRealms 自有拍摄，也不得删除来源记录。

## 当前镜头包锁定的版本

`SHOT_TURQUOISE_LEAF_COLD_START_001` 锁定的是 `main.jpg`／`detail-02.jpg` 版本：

- 开口金色调绞线结构。
- 中央一块不规则白色片状主体。
- 中央左右各一颗蓝绿色圆珠。
- 两个开口端各一颗白色不规则珠。
- 不包含中央周围的一排小白珠。

以上只能描述可见结构，不能证明白色主体、蓝绿色圆珠、端头白珠或金属的真实材质。

## 尺寸与重量

现有三张图片没有清晰可读的尺寸或重量标示。正式页面和视频不得推测开口宽度、内径或重量。

## AI 内容身份锁定

在供应商确认前停止生成。若确认实际发货为 `main.jpg` 版本，AI 图和视频必须保留：开口绞线、中央单一白色片、左右两颗蓝绿色圆珠和两端白色不规则珠；不得增加小白珠排、不得改成闭合手链、不得改变圆珠数量。

## 尚未核实

| 必须取得的信息 | 当前状态 |
| --- | --- |
| 1688 原始商品链接 | 未提供 |
| 供应商名称和联系人 | 未提供 |
| 独立站与社交媒体图片使用许可 | 未取得书面记录 |
| 采购价和国内运费 | 未提供 |
| `main.jpg` 与 `detail-01.jpg` 是否为两个可选款式 | 未确认 |
| 下单时如何指定实际发货版本 | 未确认 |
| 实际材质和镀层 | 未确认，不得对外宣称 |
| 产品尺寸、包装尺寸和计费重量 | 未提供 |
| 实际库存与缺货处理 | 未确认 |
| 供应商国内发货时效 | 未确认 |
| 退换货和破损补发规则 | 未确认 |

## 发布门槛

当前判断：**暂停。** 在供应商明确确认实际发货版本前，不得进入首周发布队列，不得继续消耗 Seedance 视频额度。确认 `main.jpg` 版本后，应从该商品图库中移除或拆分 `detail-01.jpg`；若实际发货为 `detail-01.jpg` 版本，则必须重做当前镜头包。
