# MythRealms 影视资产库

这是视频制作的母资产库：用可检索的资产 ID 和镜头配方替代“复制旧 `.blend` 工程再修改”的工作方式。

## 从这里开始

1. 在 Blender 中将此目录注册为 Asset Browser 的资产库根目录；其中的 `blender_assets.cats.txt` 已预置首批目录。
2. 每次复刻参考视频，先在 `docs/shot-breakdown-template.md` 完成镜头拆解和灰模验证。
3. 将可复用的结果登记到 `registry/assets.json`，再放入对应分类目录。
4. 用 `recipes/` 的配方组合资产；产品、场景和品牌标准灯光优先 Link，相机动画、临时灯光和转场优先 Append。

## 分类

| 目录 | 内容 | 默认调用 |
| --- | --- | --- |
| `01-products` | 产品模型、参考图、材质、尺寸与不可修改规则 | Link |
| `02-camera-rigs` | 相机路径、焦点、速度曲线与预览 | Append |
| `03-scenes` | 品牌母场景与标准道具 | Link |
| `04-lighting` | 可独立复用的 Lighting Rig | Link |
| `05-characters` | 角色、站位与角色参考 | Link |
| `06-motions` | 动作、走位、姿势和转场 | Append |
| `07-styles` | 提示词、LUT、颗粒和后期预设 | Append |
| `08-fx` | 前景遮挡、反射、粒子等效果 | Append |
| `09-shot-templates` | 已预设插槽的 9:16 镜头工程 | Copy then customize |

## 入库门槛

只有同时满足以下条件才把 `status` 设为 `approved`：换产品可用、换场景可用、两周后无需重新研究即可调用。每个正式资产须有缩略图、3–5 秒预览、说明、版本和来源；未完成的资产保留 `draft` 或 `planned`，不能假装可用。

## 当前第一批

`registry/assets.json` 已登记第一阶段的 6 种镜头、4 套灯光、3 个母场景、3 组站位/动作、1 个风格预设，并登记了工作区现有的 C 位礼服角色。缺少的 `.blend` 与预览文件均明确标为 `planned`，下一步应按优先级从 `CAM_SLOW_PUSH_MACRO_85MM_001` 开始制作。

## Obsidian 管理层

打开 `obsidian-vault/` 作为独立 Obsidian Vault。它只管理资产卡、镜头配方、拆解笔记和生产待办，并通过链接指向本目录中的 `.blend`、视频和图片；不要把二进制资产移动进 Vault，也不要把 Obsidian 当作渲染素材的唯一存储位置。

## 校验

```powershell
python -c "import json; json.load(open('video-pipeline/asset-library/registry/assets.json', encoding='utf-8')); json.load(open('video-pipeline/asset-library/recipes/SHOT_LUXURY_PRODUCT_REVEAL_9X16_001.json', encoding='utf-8')); print('JSON OK')"
```

## 本地视频与剪辑工程归集

小云雀分镜视频、剪映工程快照、剪映导出视频和正式成片统一通过 `..\scripts\14-import-local-asset.ps1` 入库。脚本只复制并校验，不移动或删除来源文件，并按 SHA-256 去重。

完整使用方法见 [本地影视资产库工作流](docs/local-library-workflow.md)。
