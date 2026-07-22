# Blender Asset Browser 设置

1. 打开 Blender：`Edit > Preferences > File Paths > Asset Libraries`。
2. 点击 `+`，名称填写 `MythRealms_Assets`，路径选择本目录：`D:\mythrealms-shop\video-pipeline\asset-library`。
3. 重启或刷新 Asset Browser 后，可在 Catalog 中看到产品、镜头、场景、灯光等首批分类。
4. 创建正式资产时，将可复用的 Collection、Material、Object、Action 或 World 标记为 Asset，选择对应 Catalog，并保存 `.blend` 到相应的分类目录。
5. 同步更新 `registry/assets.json` 和资产卡。只有 `approved` 的条目才能用于正式视频配方。

`blender_assets.cats.txt` 的 UUID 是目录的稳定身份。可以改显示名称和路径，但不要为已有目录重新生成 UUID，否则旧资产会失去分类关联。
