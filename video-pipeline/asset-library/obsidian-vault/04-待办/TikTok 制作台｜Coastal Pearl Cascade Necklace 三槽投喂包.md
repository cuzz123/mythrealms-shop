---
type: founder_handoff
status: ready_internal
project_id: TIKTOK_SEEDANCE_ASSORTMENT
subject: Coastal Pearl Cascade Necklace
product_asset_id: PROD_MR_COASTAL_PEARL_CASCADE_NECKLACE_001
generation_mode: I2V
format: 9:16
clip_seconds: 4
external_actions: founder_only
---

# TikTok 制作台｜Coastal Pearl Cascade Necklace 三槽投喂包

## 本轮目标

用同一张 9:16 精确首帧测试三种独立运动：展台旋转产生的三层惯性、横向气流产生的逐层波动、低机位上升配合小角度回转。每条都是独立的 4 秒 I2V，不把上一条生成结果作为下一条输入。画面必须有明确位移、物理原因和新终点，不能只做光线闪动、景深呼吸或轻微推镜的 PPT 式微动。

## 引用角色与边界

- 精确首帧：`D:\mythrealms-shop\video-pipeline\asset-library\10-storyboard-videos\VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001\first-frames\FF_COASTAL_CASCADE_01_NAVY_BUST-v1.png`。锁定海军蓝展示台、石墙、右侧窗框、海景、三层垂坠结构、构图和起始光向。
- 产品几何锁：`D:\mythrealms-shop\video-pipeline\asset-library\01-products\PROD_MR_COASTAL_PEARL_CASCADE_NECKLACE_001\source\product-source.jpg`。只用于核对三层连接顺序、每层弧度、浅色水滴形悬坠的数量/间距和整体比例；不转移黑色背景或任何未出现在精确首帧中的画面元素。
- `Coastal Pearl Cascade Necklace` 仅作内部识别名。不得从名称或图片推导材质、天然珍珠、镀层、价格、库存、配送、低敏、耐久或任何功效承诺。
- 三层定义：最上层贴近展示台颈部，中层形成较深弧线，最下层形成最长弧线；左右肩部的连接与悬坠归属于同一套结构，不能变成额外项链。

## 三条可直接复制的 Seedance 2.0 提示词

### 1. 主钩子｜隐形转台回身

```text
@D:\mythrealms-shop\video-pipeline\asset-library\10-storyboard-videos\VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001\first-frames\FF_COASTAL_CASCADE_01_NAVY_BUST-v1.png @D:\mythrealms-shop\video-pipeline\asset-library\01-products\PROD_MR_COASTAL_PEARL_CASCADE_NECKLACE_001\source\product-source.jpg 9:16 竖屏，4秒，首帧生视频（I2V）。第一张图是精确首帧，锁定海军蓝展示台、石墙、右侧窗框、海景、构图与起始光向；第二张图只锁定三层垂坠的连接顺序、弧度、浅色水滴形悬坠数量/间距和整体比例，不转移黑色背景。0–0.4秒，展示台静止，三层结构完整可读。0.4–2.4秒，隐藏转台让整个展示台绕垂直轴平顺向右转约12度；三层连接线随展台同步转动，所有悬坠因惯性先落后同一方向，再各自完成一次低幅钟摆回摆，最下层的摆幅略大、最上层最小，运动有明确层级但不互相穿插。镜头同时做一次约8%的缓慢反向横移，保持展示台居中，窗框与石墙产生明显视差。2.4–4秒，展台减速并停在新的三分之四角度，三层悬坠越过最低点一次后自然衰减，终帧必须明显不同于首帧。始终保持恰好三层主弧线、原有左右连接、原有悬坠数量和间距；连接点固定在各自位置，不能滑动、断裂或新增。禁止第四层、重复悬坠、悬坠增殖、串成珠链、结构融化、展示台变形、自行漂浮、连续自转、镜头环绕、突然变焦、文字、logo、水印。无对白、无音乐；只保留低室内空气声、转台很轻的机械摩擦声和一次细小连接件轻响。
```

### 2. 回应镜头｜海风逐层经过

```text
@D:\mythrealms-shop\video-pipeline\asset-library\10-storyboard-videos\VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001\first-frames\FF_COASTAL_CASCADE_01_NAVY_BUST-v1.png @D:\mythrealms-shop\video-pipeline\asset-library\01-products\PROD_MR_COASTAL_PEARL_CASCADE_NECKLACE_001\source\product-source.jpg 9:16 竖屏，4秒，首帧生视频（I2V）。第一张图是精确首帧，锁定同一海军蓝展示台、三层结构、石墙、右侧窗框、海景与起始构图；第二张图仅锁定三层连接顺序、弧度、浅色水滴形悬坠数量/间距和整体比例，不转移背景。0–0.5秒，展示台和三层结构稳定。0.5–2.5秒，一阵来自右侧窗户的短促柔和气流横向穿过：右侧悬坠先向左偏移，波动沿每一层由右向左传递，随后三层各完成一次回摆；最下层因长度更长稍晚到达终点，形成可见但克制的时间差。气流只推动悬坠和很短的连接段，三条主弧线仍贴合展示台、锚点不移动。镜头从右侧窗框方向向左做一次约12%的平滑侧向滑移，焦点始终覆盖完整三层结构，石墙和窗框形成清楚视差。2.5–4秒，气流停止，悬坠回摆一次后衰减，终帧停在略偏左的观察位置。禁止只有光线移动而商品不动；禁止整套项链漂离展示台、连接线像橡皮拉长、悬坠互相碰穿、连续摇摆、自转、增殖、变成第四层、重排间距、结构融化、窗外场景突变、文字、logo、水印。无对白、无音乐；只保留窗边低风声与一组轻微、非夸张的连接件碰响。
```

### 3. 备用钩子｜低机位穿越三层

```text
@D:\mythrealms-shop\video-pipeline\asset-library\10-storyboard-videos\VID_MR_COASTAL_LIBRARY_PEARL_NECKLACE_001\first-frames\FF_COASTAL_CASCADE_01_NAVY_BUST-v1.png @D:\mythrealms-shop\video-pipeline\asset-library\01-products\PROD_MR_COASTAL_PEARL_CASCADE_NECKLACE_001\source\product-source.jpg 9:16 竖屏，4秒，首帧生视频（I2V）。第一张图是精确首帧，锁定海军蓝展示台、三层垂坠、石墙、右侧窗框、海景和起始空间；第二张图只锁定三层连接顺序、弧度、浅色水滴形悬坠数量/间距和比例，不转移黑色背景。0–0.4秒，完整三层结构保持静止。0.4–3.0秒，隐藏转台让展示台向左回转约8度，同时镜头以低机位从最下层正前方平顺上升到最上层，运动幅度约为画面高度的22%，始终让三层从下到上依次穿过视觉中心；展示台回转带动三层悬坠产生一次方向一致、幅度从上到下逐渐增大的惯性摆动，连接线承重自然且不离开展示台。镜头只做这一条低位上升轨迹，不环绕、不甩镜、不切镜，焦点从最下层连续移交至最上层但完整结构始终可辨。3.0–4秒，镜头停在最上层与中层之间，展台停止回转，悬坠完成一次回摆并开始衰减，终帧留下最上层清晰、中层仍可见、最下层进入画面下部的明显新构图。始终保持恰好三层、原有连接点、原有悬坠数量/间距与各层相对长度。禁止第四层、缺层、复制悬坠、串珠化、链条变粗、几何拉伸、展示台变形、商品漂浮、连续旋转、过度景深模糊、突然变焦、文字、logo、水印。无对白、无音乐；只保留低室内空气声、轻微转台声和一次自然的连接件轻响。
```

## 连续性与生成 QA

- 三条提示词都从同一张精确首帧开始，但彼此独立；不得把上一条视频或末帧传给下一槽。
- 成功画面必须同时满足：展示台或悬坠发生可见位移、三层结构仍完整、到达明显新终点。只动光、只呼吸变焦或只做焦点漂移均判定失败。
- 三层锁优先于运动强度：层数、各层相对长度、连接顺序、锚点、悬坠数量/间距与展示台几何均不得改变。
- 悬坠运动必须由转台惯性或右侧气流驱动；只允许一次主要摆动和一次回摆，随后衰减，不做无限循环。
- 产品锁图只提供结构证据，不提供材质、成分、价格、库存、履约或营销事实。

## 失败重试｜一次只改一个变量

| 失败现象 | 判定 | 下一次只改这一项 |
| --- | --- | --- |
| 像静态图，只动了光或做微推 | `Rewrite` | 保持全部结构锁不变，只把展台角位移提高到 14 度，或把横向气流造成的悬坠偏移明确为一个悬坠宽度；二者不可同时改。 |
| 三层变四层、缺层或相对长度改变 | `Re-roll` | 保持动作和镜头不变，只把镜头改为基本锁定，并重申“恰好三条主弧线，连接点固定”。 |
| 浅色悬坠增殖、消失或重排 | `Re-roll` | 保持镜头与时间不变，只降低摆幅，并重申数量/间距完全继承两张参考图。 |
| 连接线拉长、穿过展示台或互相穿插 | `Rewrite` | 保持位移不变，只把转台角度降低 3 度，并删除额外焦点变化。 |
| 摆动过猛或持续循环 | `Rewrite` | 保持转台/气流方向不变，只改为“越过最低点一次后衰减，禁止第二次完整摆动”。 |
| 终帧仍与首帧相似 | `Rewrite` | 保持商品结构和动作不变，只把相机终点增加 5% 位移。 |
| 只有局部小瑕疵且可裁掉 | `Fix in post` | 不重生成；记录安全入点、出点后在剪映裁切。 |

## 输出文件名

- 主钩子：`COASTAL_CASCADE_TURNTABLE_HOOK_T01.mp4`
- 回应镜头：`COASTAL_CASCADE_WINDOW_WAVE_T01.mp4`
- 备用钩子：`COASTAL_CASCADE_LOW_RISE_T01.mp4`
- 候选母版：`COASTAL_CASCADE_CANDIDATE_C01_MASTER.mp4`
- 候选发布版：`COASTAL_CASCADE_CANDIDATE_C01_POST.mp4`

## 剪映 6.5–8 秒交接

精确剪点必须等三条素材回传后再定；以下是固定结构，不预测未生成画面的最佳帧。

1. V1 先放主钩子与备用钩子中首秒动作更快、结构更稳的一条，取约 3.0–3.5 秒；从转台真正开始转动或镜头真正开始上升的第一帧进入，在第一次回摆开始衰减时硬切。
2. V1 紧接回应镜头，取约 3.5–4.0 秒；从右侧悬坠开始偏移前 2–3 帧进入，保留波动传至左侧和一次回摆的终点。
3. 总时长 6.5–8.0 秒；不用淡入、闪白、旋转、缩放或模板转场，只做一次硬切。
4. 屏幕文字仅在最后 0.8–1.2 秒出现，放在左上石墙负空间，避开展示台、三层结构和右侧窗框。
5. 精确入点、出点和硬切拍点保持 `待回传素材 QA`，不得在看到素材前写死。

## TikTok 发布包

- 封面字：`Three Lines, One Movement`
- 屏幕字：`Turn or breeze?`
- Caption：`One shape, three lines, and a little movement. Turn or breeze?`
- 标签：`#LayeredNecklace #JewelryDetails #StyleInMotion #EverydayJewelry`
- CTA：评论区回答 `Turn` 或 `Breeze`；不附商品链接。

## BGM 与混音合同

- 创始人账号曲库搜索词：`coastal editorial`、`soft pulse`、`minimal strings`。
- 节奏：92–104 BPM，4/4；选择开头两拍内已有干净 downbeat、无重低音 drop、无歌词或人声抢位的已授权曲目。
- 最终曲目：`待确认`；必须以创始人 TikTok 账号内实际可用的授权曲库为准。
- BGM 音量：14%–16%；生成音频默认关闭。若保留已审核的低室内/风声，环境声维持 3%–5%，不得盖过音乐拍点。
- BGM 淡入 0.05–0.10 秒，结尾淡出 0.20 秒。
- 硬切在素材 QA 后对齐一次 downbeat；在此之前不写死具体秒点。
- 曲目不可用回退：若候选曲因地区、账号或授权不可用，只替换曲目；必须保持以上搜索词、92–104 BPM、同一硬切逻辑、14%–16% 混音、0.05–0.10 秒淡入、0.20 秒淡出、6.5–8.0 秒结构、Caption、屏幕文字和 CTA 不变。

## 发布前检查与边界

- [ ] 三段均为 9:16、4 秒，且每条提示词开头的两个 `@绝对路径` 未被手工改写。
- [ ] 三段都经过 Keep / Fix in post / Re-roll / Rewrite 判定，三层结构和悬坠数量通过。
- [ ] 精确剪点与最终曲目已根据回传素材及创始人账号可用曲库确认。
- [ ] 未写入材质、天然珍珠、价格、库存、配送、低敏、耐久或功效承诺。
- [ ] 未附商品链接，未把本内部交接卡当成发布授权。

本卡不执行或授权小云雀、剪映、AdsPower、TikTok、广告、付款、采购、部署、外联或商品状态修改。
