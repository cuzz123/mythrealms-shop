# 珍珠潮汐谷｜首段 Seedance 2.0 生成包

- 资产编号：`REF_MR_PEARL_TIDAL_VALLEY_OPENING_001`
- 成片区间：`00:00–00:12`
- 画幅：`16:9`
- 生成方式：三段独立 I2V，后期顺接
- 连续性锁定：黎明前、低云、冷灰海面、湿黑玄武岩、风向一致；本段无人物、无产品、无马、无文字与 Logo

## 旁白

> 一条高级的广告，一开始都必须从大众未见过的风景开始。卖什么不重要，但得制造一种人们想要的生活幻觉。

## 引用图角色

- `@Image1 / world-anchor.png`：只控制 S01A 的地理、时间与首帧。
- `@Image1 / ravine-anchor.png`：只控制 S01B 的峡谷地理、材质与首帧。
- `@Image1 / villa-anchor.png`：控制 S01C 的建筑、悬崖地理、窗格与首帧。
- `@Image2 / material-anchor.png`：S01C 仅引用其玄武岩、海沫和克制的珍珠母层材质。

## S01A｜未知海岛建立镜头｜0–4 秒

### 中文生产提示词

`@Image1` 只控制世界地理与首帧。保持岛屿轮廓、低云层、银灰海色与真实海水。四秒内，摄影机以 24mm 广角进行一次缓慢航拍前推，并轻微下降，结束时中央海蚀峡谷清晰对齐为前进路径。云层缓慢漂移，浪花自然拍岸。禁止旋转、环绕、俯冲、建筑、人物、首饰、文字或 Logo。声音意图：低沉海风、远处海浪。

### English fallback

`@Image1` controls world geography and the first frame only. Preserve the island silhouettes, low cloud ceiling, silver-grey sea colour, and realistic water. Over four seconds the camera performs one slow 24mm aerial push forward with a slight descent, ending with the central sea ravine clearly aligned as the path ahead. Clouds drift slowly and waves break naturally. No rotation, orbit, dive, architecture, people, jewelry, text, or logo. Sound intent: low wind and distant surf.

### 验收锚点

- 结尾能明确看出中央峡谷是下一镜的入口。
- 海面与岛体不发生液化、漂移或尺寸突变。
- 只允许一次前推加轻微下降，不叠加环绕。

## S01B｜进入海蚀峡谷｜4–8 秒

### 中文生产提示词

`@Image1` 只控制峡谷地理、玄武岩材质、海水通道与首帧。保持入口和两侧岩壁轮廓。四秒内，摄影机以 35mm 镜头在低空保持水平，沿中央海水通道直线穿过峡谷；结尾时，出口处第一次出现一座极小的几何建筑剪影。珍珠母色只以掠射光下的细薄矿物层出现。禁止巨型珍珠、贝壳宫殿、魔法发光、人物、首饰、文字或 Logo。声音意图：峡谷收窄后的风声、较近的海浪、一次低频脉冲。

### English fallback

`@Image1` controls the ravine geography, basalt material, sea channel, and first frame only. Preserve the opening and both wall silhouettes. Over four seconds the camera makes one level 35mm low-altitude move straight through the ravine, ending when a tiny geometric villa silhouette first appears at the exit. Mother-of-pearl colour appears only as thin mineral layers under grazing light. No giant pearl, shell palace, fantasy glow, people, jewelry, text, or logo. Sound intent: narrowed wind, closer surf, one low pulse.

### 验收锚点

- 镜头保持水平直线前进，不左右摆动。
- 结尾只露出“小而远”的别墅剪影，不能提前变成建筑主镜头。
- 珍珠母层只占岩壁局部，不能变成霓虹矿洞。

## S01C｜悬崖别墅揭示｜8–12 秒

### 中文生产提示词

`@Image1` 控制别墅身份、悬崖地理、窗格布局与首帧；`@Image2` 只控制玄武岩、海沫与克制的珍珠母层材质。保持别墅轮廓、楼层数量、玻璃分割和唯一一扇暖色窗。四秒内，摄影机以 50mm 镜头从左侧前景岩石后进行一次缓慢横向揭示，然后减速并锁定画面，使暖窗位于右上三分区。只允许云、薄雾、海水与摄影机运动。禁止建筑变形、增加灯光、人物、首饰、文字或 Logo。声音意图：风声被岩壁逐渐遮蔽，结尾留半秒安静。

### English fallback

`@Image1` controls villa identity, cliff geography, window layout, and the first frame; `@Image2` controls basalt, sea foam, and restrained mother-of-pearl material only. Preserve the villa silhouette, floor count, glass divisions, and the single warm window. Over four seconds the camera performs one slow 50mm lateral reveal from behind foreground rock, then decelerates to a locked frame with the warm window on the upper-right third. Only cloud, mist, sea, and camera move. No building deformation, extra lights, people, jewelry, text, or logo. Sound intent: wind becomes muffled behind the rock, then half a second of quiet.

### 验收锚点

- 始终只有一扇暖窗。
- 别墅轮廓、层数和玻璃分割不变化。
- 横移揭示后必须减速停稳，为下一段人物出场留接点。

## 生成顺序与失败回退

1. 先生成 S01A；把它的合格末帧作为 S01B 的补充地理参考。
2. S01B 合格后，把末帧作为 S01C 的补充空间参考，但仍以 `villa-anchor.png` 锁建筑。
3. 若某段出现液化或多余运镜，只重做该段，不改已经通过的世界锚点。
4. 每段先按 4 秒低成本预览验收；运动和空间通过后再做高分辨率版本。

