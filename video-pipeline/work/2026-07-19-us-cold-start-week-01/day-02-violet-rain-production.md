# 第 2 条：Violet Rain 省额度生产包

**目标：** 制作一条约 10.5 秒的 TikTok，第一秒看清佩戴效果，随后用双只产品画面证明产品身份。

**生成策略：** 只生成 3 个 4 秒 I2V 镜头；第 4 张远景不生成视频，剪辑时使用 1.2 秒静帧轻推作为结尾。相较四镜头全生成，预计减少约 25% 的本条视频生成额度。

## 首帧审核结论

| 首帧 | 用途 | 结论 | 使用方式 |
| --- | --- | --- | --- |
| `FF_VIOLET_RAIN_03_WEARING_PROFILE-v1.png` | 第一秒佩戴 Hook | 通过 | 生成 Clip A |
| `FF_VIOLET_RAIN_02_WET_LIMESTONE_PAIR-v1.png` | 双只产品证明 | 通过 | 生成 Clip B |
| `FF_VIOLET_RAIN_01_HUMAN_HOOK-v2.png` | 人物近景补强 | 通过 | 生成 Clip C |
| `FF_VIOLET_RAIN_04_ARCH_LOOKBACK_END-v3.png` | 氛围结尾 | 限制使用 | 产品过小，只做 1.2 秒静帧结尾，不承担产品证明 |

前三张首帧与当前商品图库中的圆形紫色耳钉、单个金色连接环、不规则白色中心和紫色镶边结构基本一致。任何生成结果改变上述结构时直接淘汰。

## Seedance 生成设置

- 模式：I2V
- 画幅：9:16
- 单镜头：4 秒
- 音频：生成时无对白；最终音乐在 TikTok Commercial Music Library 中选择
- 每个镜头最多生成 2 次；第二次只能修正一个失败变量

### Clip A：佩戴侧面 Hook

**输入：** `FF_VIOLET_RAIN_03_WEARING_PROFILE-v1.png`

```text
@Image1为首帧。保持成年模特身份、深梅色礼服、手的位置、庭院布局和唯一可见的Violet Rain耳饰不变。4秒内模特只将下巴朝暖色壁灯方向转约8度，肩膀和手保持稳定，耳饰只自然轻摆一次；镜头缓慢推近约5%，第4秒完整耳饰最清晰。保留圆形紫色耳钉、单个金色连接环、不规则白色中心和紫色镶边。禁止新增第二只可见耳饰、改变产品轮廓、遮挡耳饰、改变手指或面部，不生成文字。声音：轻微庭院环境音，无对白。
```

**验收端点：** 第 4 秒脸部和完整耳饰共同清晰，耳饰没有复制、缩短或变圆。

### Clip B：双只产品证明

**输入：** `FF_VIOLET_RAIN_02_WET_LIMESTONE_PAIR-v1.png`

```text
@Image1为首帧。两只Violet Rain耳饰的位置、间距、比例和全部结构必须保持不变并始终完整可见。4秒内耳饰本体静止，仅让一条狭窄紫色反射光从左向右扫过一次；镜头只做一次极慢的顺时针小弧移。保留每只圆形紫色耳钉、单个金色连接环、不规则白色中心和紫色镶边。禁止复制、融合、旋转耳饰、增加宝石或道具，不生成文字。声音：低庭院环境音，无对白。
```

**验收端点：** 双只仍分离、结构相同、没有互相靠近或变形。

### Clip C：拨发近景

**输入：** `FF_VIOLET_RAIN_01_HUMAN_HOOK-v2.png`

```text
@Image1为首帧。保持成年模特面部、深色头发、深梅色礼服、手的位置、庭院灯光和Violet Rain耳饰不变。4秒内手指只向发后轻收一次，让耳侧保持无遮挡；头部基本静止，耳饰只轻摆一次。镜头缓慢推近约4%，第4秒眼睛与完整耳饰共同清晰。保留圆形紫色耳钉、单个金色连接环、不规则白色中心和紫色镶边。禁止手指经过耳饰、增加首饰、改变耳朵或面部，不生成文字。声音：轻微发丝和庭院环境音，无对白。
```

**验收端点：** 手停在发后，不遮挡耳饰，手指与耳朵结构正常。

## 剪辑时间线

| 时间 | 素材 | 画面文字 | 作用 |
| --- | --- | --- | --- |
| 0.0-2.6 秒 | Clip A 的 0.0-2.6 秒 | `Violet after dark.` | 第一秒展示佩戴效果 |
| 2.6-5.2 秒 | Clip B 的 0.6-3.2 秒 | `The Violet Rain` | 双只产品证明 |
| 5.2-8.9 秒 | Clip C 的 0.2-3.9 秒 | `Black or ivory?` | 人物近景与互动问题 |
| 8.9-10.1 秒 | 第 4 张静帧，轻推 3% | `See it in bio` | 氛围结尾与 CTA |

文字放在画面左侧或上方安全区，不得遮挡脸部和耳饰。不要在成片中写材质、尺寸、重量或工艺。

## 发布文案

**Caption：**

```text
Violet after dark. Would you style The Violet Rain with black or ivory? AI-created scene; product reference views are on the product page. #statementearrings #eveningstyle #jewelrystyling #MythRealms
```

**首评：**

```text
Product: The Violet Rain. The exact product page is linked in our bio.
```

**UTM 链接：**

```text
https://mythrealms-shop.vercel.app/products/new-series-purple-gem-pearl-drops?utm_source=tiktok&utm_medium=organic_social&utm_campaign=us_cold_start_2026q3&utm_content=violet_rain_profile_a
```

## 成片拒绝条件

- 第一秒耳饰不可辨认，或字幕遮挡耳饰。
- 任一镜头改变耳钉、连接环、白色中心或紫色镶边结构。
- 多出第二只可见耳饰、项链、手链或其他首饰。
- 手指、耳朵、脸部发生明显形变。
- 双只产品镜头出现复制、融合、滑动或比例突变。
- 使用未经确认的音频，或发布时遗漏适用的 AI 内容标签。
