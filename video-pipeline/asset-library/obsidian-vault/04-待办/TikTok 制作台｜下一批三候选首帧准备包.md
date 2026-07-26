---
type: first_frame_generation_prep
status: ready_internal
prepared_at: 2026-07-26
scope: next_tiktok_recipe_batch
image_generation_executed: false
external_actions: none
---

# TikTok 制作台｜下一批三候选首帧准备包

## 使用边界

- 本卡只准备首帧生成与后续 3×4 秒镜头骨架，没有调用 `image/imagegen`，没有生成图片或视频，也没有发布。
- `GO` 只代表允许进入内部首帧生成与视觉 QA；不代表商品材质、商用权、价格、库存、履约或公开发布已经核验。
- 三组首帧均采用 `9:16` 竖屏构图，不生成文字、Logo、水印、价格或商品承诺。
- 不引用或复用已发布的 Baroque Orbit、Gold Shell Teardrops 素材。
- 图片生成后必须另存为版本化新文件；不得覆盖原环境图、商品源图或现有首帧。

## 总判定

| 候选 | 首帧生成判定 | 原因 | 下一步 |
| --- | --- | --- | --- |
| Mist Jade | **NO-GO** | 资产卡与 manifest 把对象写成 necklace，但唯一商品源图、公开目录 slug 与肉眼结构均指向 bracelet；身份冲突会把错误结构固化进生成链 | 先把路线明确改为 bracelet，或补一张真正的 necklace 结构源图；完成后再启用下方暂存提示词 |
| Coastal Pearl Cascade Necklace | **GO（仅内部生成）** | 环境与产品结构源分离清楚；横向人物图只控制海岸石墙、窗光与深蓝色承托关系，不控制人物身份 | 生成一个无可识别人脸的 9:16 产品首帧，逐层核对三层结构与单件数量 |
| Pearl Series 04 Cobalt & Blush | **GO（仅内部生成）** | 商品源图清楚显示项链与手链为一组，环境图可提供自然窗光；但源图含第三方字样且权利状态未核验 | 仅以源图控制可见结构与配色关系，生成无文字的 9:16 内部首帧；公开使用前另做权利 QA |

---

## A. Mist Jade｜身份冲突，暂不生成

### 输入与角色

1. 场景参考：`D:\mythrealms-shop\video-pipeline\asset-library\03-scene-kits\ENV_MR_COASTAL_BREAKFAST_TERRACE_001\source\coastal-breakfast-panorama-v1.png`
   - 只控制海岸早餐露台、白色亚麻桌布、白瓷盘、柠檬、暖向自然光与空间方向。
2. 商品结构参考：`D:\mythrealms-shop\public\images\products\new-series\new-series-pearl-jade-bracelet\main.jpg`
   - 肉眼可见为一条短环形手链：不规则浅色珠形单元、一个雾绿色椭圆中心单元、金色调延长链。
   - 只控制可见结构、比例与配色；不转移黑色首饰台、木盘、纸张、`GLSEEVO` 或 `FASHION JEWELRY` 字样。

### 身份冲突证据

- `D:\mythrealms-shop\video-pipeline\asset-library\01-products\PROD_MR_PEARL_JADE_NECKLACE_001\README.md` 把对象命名为“项链”，并写成“短项链比例”。
- `D:\mythrealms-shop\video-pipeline\asset-library\10-storyboard-videos\VID_MR_PEARL_JADE_COASTAL_BREAKFAST_001\asset-pack-manifest.json` 同样把项目标题与首次揭示写成 necklace。
- 唯一商品源图位于 `new-series-pearl-jade-bracelet\main.jpg`，站内 `src\lib\new-series-products.ts` 也把 `new-series-pearl-jade-bracelet` 定义为 bracelet；源图可见结构与手链一致。
- 因此不得把这张源图拉长、复制或重新设计成项链；当前首帧生成判定为 **NO-GO**。

### 9:16 首帧构图（仅在身份修复后启用）

- 竖屏近景，白色亚麻桌布占画面下方约 60%，海面与石墙在上方虚化。
- 白瓷浅盘位于下方三分之一中心；一条完整手链平放在盘内，雾绿色椭圆中心单元朝向镜头。
- 柠檬保留在右后方作为暖色视觉锚，产品周围留有足够空白；无人物、无手、无其他首饰。
- 身份修复后的建议输出：`D:\mythrealms-shop\video-pipeline\asset-library\10-storyboard-videos\VID_MR_PEARL_JADE_COASTAL_BREAKFAST_001\first-frames\ff_pearl_jade_bracelet_breakfast_9x16-v1.png`。

### 暂存 image/imagegen 中文提示词（NO-GO，禁止现在执行）

```text
@D:\mythrealms-shop\video-pipeline\asset-library\03-scene-kits\ENV_MR_COASTAL_BREAKFAST_TERRACE_001\source\coastal-breakfast-panorama-v1.png 只作为海岸露台、白色亚麻桌布、白瓷盘、柠檬和自然光方向参考。@D:\mythrealms-shop\public\images\products\new-series\new-series-pearl-jade-bracelet\main.jpg 只作为一条手链的完整结构、比例与配色参考，不复制原图背景、首饰台、木盘、纸张、品牌文字或水印。生成一张 9:16 竖屏、写实自然的珠宝产品首帧：白瓷浅盘位于画面下方三分之一中心，一条完整手链自然平放在盘内，雾绿色椭圆中心单元朝向镜头，不规则浅色珠形单元和金色调延长链保持与商品参考一致；海岸石墙与海面在上方柔和虚化，柠檬在右后方，晨间侧光从右侧掠过盘沿。产品数量只能为一条，不拉长为项链，不增加吊坠、宝石、戒指、耳环或第二件首饰。无人物、无手、无文字、无 Logo、无水印、无价格。输出必须是 9:16 竖屏首帧。
```

### 三镜头动作骨架（身份修复后才可写成正式配方）

1. **Hook｜盘沿揭示**：4 秒；相机从盘沿前景做一次短距离侧滑，终点露出雾绿色中心单元；手链完全静止。
2. **Response｜高光经过**：4 秒；锁定微距，窗光高光从浅色珠形单元经过雾绿色中心单元一次，终点清楚读到完整中心结构。
3. **Context｜早餐桌收束**：4 秒；缓慢后拉到竖屏中近景，白瓷盘、柠檬、海岸背景形成三层空间；手链仍为唯一首饰。

### 负面约束

- 禁止 necklace 化、拉长、复制珠形单元或虚构第二条链。
- 禁止把 `GLSEEVO`、`FASHION JEWELRY`、原图首饰台、木盘与纸张带入首帧。
- 禁止人物、手指、佩戴动作、产品悬浮、产品变形、文字、Logo、水印和额外首饰。

---

## B. Coastal Pearl Cascade Necklace｜内部生成 GO

### 输入与角色

1. 场景与光线参考：`D:\mythrealms-shop\video-pipeline\asset-library\10-storyboard-videos\VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001\first-frames\s04-window-no-necklace.png`
   - 只控制海岸石墙、狭长窗、冷静海光、深蓝色承托面与空间明暗；不控制人物身份、脸、发型或身体。
2. 商品结构参考：`D:\mythrealms-shop\video-pipeline\asset-library\01-products\PROD_MR_COASTAL_PEARL_CASCADE_NECKLACE_001\source\product-source.jpg`
   - 只控制一条项链、三层由短至长的金色调细链、间隔垂坠的白色不规则珠形单元与整体层级。
   - 不转移黑色模特台、黑色背景或拍摄阴影。

### 缺口与风险

- 现有场景图是 16:9 横图且带人物，不能直接作为 9:16 I2V 首帧。
- 商品源图只有正面模特台视角；生成后必须逐层核对链条数量、垂坠点数量趋势与单件数量。
- 公开使用前仍需生成溯源、非实质复刻与商品/样品一致性 QA；本卡不提供商用授权结论。

### 9:16 首帧构图

- 竖屏产品静物，不出现可识别人脸或手。
- 深蓝色亚光颈台位于画面下方至中部，海岸石墙和狭长窗在后方形成垂直框景。
- 一条完整三层项链正面佩戴在颈台上；短、中、长三层都可读，最长层不被底边裁断。
- 右侧冷海光掠过珠形垂坠，左侧保持石墙暗部；上方保留呼吸空间。
- 建议输出：`D:\mythrealms-shop\video-pipeline\asset-library\10-storyboard-videos\VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001\first-frames\ff_coastal_cascade_window_still_9x16-v1.png`。

### 可直接用于 image/imagegen 的中文提示词

```text
@D:\mythrealms-shop\video-pipeline\asset-library\10-storyboard-videos\VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001\first-frames\s04-window-no-necklace.png 只作为海岸石墙、狭长窗、冷静海光、深蓝色承托关系与空间明暗参考，不复制或保留原图人物身份。@D:\mythrealms-shop\video-pipeline\asset-library\01-products\PROD_MR_COASTAL_PEARL_CASCADE_NECKLACE_001\source\product-source.jpg 只作为唯一一条项链的产品结构参考：三层金色调细链由短至长下落，白色不规则珠形单元以垂坠节奏分布；不复制黑色模特台、黑色背景或原图阴影。生成一张 9:16 竖屏、写实自然的珠宝产品首帧：深蓝色亚光颈台位于画面下方至中部，置于海岸石墙室内，后方狭长窗可见柔和海面；唯一一条完整项链正面佩戴在颈台上，三层结构全部清楚，最长层不被底边裁断。冷海光从右侧掠过垂坠珠形单元，左侧石墙保留暗部，上方留有呼吸空间。严格保持单件、三层、细链、间隔垂坠结构，不增加第四层、不变成紧贴颈圈、不增加耳环、戒指、吊坠或第二条项链。无人物、无手、无文字、无 Logo、无水印、无价格。输出必须是 9:16 竖屏首帧。
```

### 三镜头动作骨架

1. **Hook｜窗影揭示**：4 秒；从石墙暗部开始一次受控横向滑动，狭长窗光逐步露出三层项链，终点停在完整正面结构。
2. **Response｜三层证明**：4 秒；锁定微距，单一高光从短层向长层顺序经过；项链不摆动、不变形、不增殖。
3. **Context｜海岸空间**：4 秒；缓慢后拉到竖屏中景，颈台保持中心，窗与海面形成背景纵深，终点三层仍全部可读。

### 负面约束

- 禁止人物身份转移、脸、手、佩戴扣合与头发遮挡。
- 禁止项链层数改变、珍珠/珠形单元复制、第二条项链、额外首饰、产品旋转或悬浮。
- 禁止生成文字、Logo、水印、价格、材质与功效承诺。

### 生成后 GO 门槛

- [ ] 文件为 9:16 竖屏且未覆盖任何源文件。
- [ ] 画面只有一条项链；短、中、长三层全部清楚并与商品源图结构一致。
- [ ] 没有复制原图人物身份、黑色模特台、品牌文字或水印。
- [ ] 通过逐图来源记录、非实质复刻检查与首帧产品结构 QA 后，才可写正式 Seedance 4 秒提示词。

---

## C. Pearl Series 04 Cobalt & Blush｜内部生成 GO

### 输入与角色

1. 场景参考：`D:\mythrealms-shop\video-pipeline\asset-library\03-scene-kits\ENV_MR_NATURAL_WINDOW_LINEN_APARTMENT_001\source\window-apartment-panorama-v1.png`
   - 只控制亚麻公寓、自然窗光、木地板、浅色扶手椅与圆形木边桌。
2. 商品结构参考：`D:\mythrealms-shop\public\images\products\1688-shop\pearl-series\pearl-series-04-detail1.webp`
   - 只控制一条项链与一条手链的成套关系、钴蓝色主单元、深蓝色小珠、浅粉色珠簇、古金色调镂空圆珠与链条的可见组合。
   - 不转移黑色背景、展示盒、`PEYUDESIGN`、`PEARL JEWELRY` 或中文水印。

### 缺口与风险

- 现有环境图为横图，尚无 9:16 产品首帧。
- 商品源图含第三方品牌/水印，且图像权利状态未在本卡核验；只允许内部重构测试，不可据此宣称公开商用已通过。
- 商品由两件组成，生成模型容易漏掉手链、复制蓝色单元或改变项链/手链比例；首帧必须固定“一条项链 + 一条手链”。

### 9:16 首帧构图

- 竖屏近景，圆形木边桌占画面下半部，浅色扶手椅位于右后方，白纱帘与窗光在左后方。
- 项链以自然弧线完整铺在米色亚麻布上；手链位于右上方，二者不重叠。
- 钴蓝、深蓝、浅粉和古金色调的组合可读；产品保持静止，窗帘影与高光提供后续运动空间。
- 建议输出：`D:\mythrealms-shop\video-pipeline\asset-library\10-storyboard-videos\VID_MR_PEARL_SERIES_04_NATURAL_WINDOW_001\first-frames\ff_pearl_series_04_table_set_9x16-v1.png`。

### 可直接用于 image/imagegen 的中文提示词

```text
@D:\mythrealms-shop\video-pipeline\asset-library\03-scene-kits\ENV_MR_NATURAL_WINDOW_LINEN_APARTMENT_001\source\window-apartment-panorama-v1.png 只作为亚麻公寓、白纱帘、自然窗光、浅色扶手椅与圆形木边桌的场景参考。@D:\mythrealms-shop\public\images\products\1688-shop\pearl-series\pearl-series-04-detail1.webp 只作为一套首饰的可见结构与配色参考：一条项链、一条手链，钴蓝色主单元、深蓝色小珠、浅粉色珠簇、古金色调镂空圆珠与链条；不复制黑色背景、展示盒、品牌文字或水印。生成一张 9:16 竖屏、写实自然的珠宝静物首帧：圆形木边桌位于画面下半部，桌面铺一小块无图案米色亚麻布；项链以完整自然弧线铺开，手链位于右上方并与项链分离，两件都完整可见。左后方白纱帘透入斜向暖窗光，右后方浅色扶手椅柔和虚化；产品保持静止，蓝、粉、古金色调关系清楚。严格保持一条项链加一条手链，不增加第三件首饰，不复制蓝色单元，不改变两件的基本比例和连接关系。无人物、无手、无文字、无 Logo、无水印、无价格。输出必须是 9:16 竖屏首帧。
```

### 三镜头动作骨架

1. **Hook｜纱帘影掠过**：4 秒；锁定近景，窗帘影从项链左端掠向钴蓝色中心单元，终点高光落在中心结构；产品不动。
2. **Response｜套组关系**：4 秒；一次缓慢对角侧滑从项链中心移向右上方手链，终点让两件同时保持在画面内。
3. **Context｜日常桌面**：4 秒；从细节缓慢后拉至竖屏中景，木边桌、扶手椅和窗光形成自然生活场景，项链与手链仍完整分离。

### 负面约束

- 禁止第三件首饰、漏掉手链、把两件合并、复制蓝色单元、改变链条连接关系或让产品悬浮。
- 禁止黑色展示背景、展示盒、`PEYUDESIGN`、`PEARL JEWELRY`、中文水印或任何新文字。
- 禁止人物、手、佩戴动作、价格、材质、库存、配送、耐久与功效承诺。

### 生成后 GO 门槛

- [ ] 文件为 9:16 竖屏且未覆盖任何源文件。
- [ ] 只有一条项链和一条手链；两件均完整、分离、无增殖。
- [ ] 蓝、粉、古金色调及关键单元关系与商品源图可核对。
- [ ] 原图品牌文字、水印、黑色展示背景和展示盒均未转移。
- [ ] 完成生成溯源、非实质复刻与商品结构 QA 后，才可写正式 Seedance 4 秒提示词。

---

## 推荐执行顺序

1. 先生成 **Coastal Pearl Cascade Necklace** 首帧：单件、三层结构，变量最少。
2. 再生成 **Pearl Series 04 Cobalt & Blush** 首帧：两件套，重点检查增殖与漏件。
3. **Mist Jade 保持 NO-GO**：身份修复前不得占用每日图片或视频生成额度。

## 回传格式

每张生成结果只回传：

```text
候选：
生成文件绝对路径：
使用的两张参考图：
是否 9:16：
单件/套组数量是否正确：
产品结构偏差：
是否出现文字、Logo、水印或额外首饰：
判定：Keep / Fix in post / Re-roll / Rewrite
```

本准备包不执行或授权 `image/imagegen`、小云雀、剪映、AdsPower、TikTok、广告、付款、采购、部署或商品状态修改。
