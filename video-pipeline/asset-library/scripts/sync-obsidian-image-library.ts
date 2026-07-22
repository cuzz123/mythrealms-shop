import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";

const ASSET_ROOT = resolve(__dirname, "..");
const PROJECT_ROOT = resolve(ASSET_ROOT, "..", "..");
const PUBLIC_IMAGES_ROOT = join(PROJECT_ROOT, "public", "images");
const NEW_SERIES_ROOT = join(PUBLIC_IMAGES_ROOT, "new_series");
const GENERATED_ROOT = "C:\\Users\\11458\\.codex\\generated_images\\019f4467-ba2f-7870-96c2-66c210cfcd72";
const VAULT_ROOT = join(ASSET_ROOT, "obsidian-vault");
const IMAGE_ROOT = join(ASSET_ROOT, "06-reference-inputs", "mythrealms-pearl-visual-library");
const CARD_ROOT = join(VAULT_ROOT, "01-资产卡", "图像参考");
const HOME_ROOT = join(VAULT_ROOT, "00-首页");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const categories = ["model", "product", "wearing", "scene"] as const;
type Category = (typeof categories)[number];
type SourceKind = "new_series" | "site_reference" | "generated_collection";
type Candidate = { hash: string; filePath: string; contextPath: string | null; sourceKind: SourceKind };
type Override = { category: Category; name: string };
type Details = {
  id: string;
  name: string;
  category: Category;
  series: string;
  sourceKind: SourceKind;
  needsReview: boolean;
  tags: string[];
  useCases: string[];
};

const labels: Record<Category, string> = {
  model: "模特",
  product: "产品",
  wearing: "佩戴图",
  scene: "场景图",
};

const metadata: Record<Category, Pick<Details, "tags" | "useCases">> = {
  model: { tags: ["图像素材", "模特", "人物参考", "珍珠风格"], useCases: ["角色参考", "镜头选角", "造型一致性"] },
  product: { tags: ["图像素材", "产品", "静物", "珍珠风格"], useCases: ["产品参考", "详情页构图", "广告静物"] },
  wearing: { tags: ["图像素材", "佩戴", "珠宝", "珍珠风格"], useCases: ["佩戴参考", "社媒内容", "近景镜头"] },
  scene: { tags: ["图像素材", "场景", "地中海", "珍珠风格"], useCases: ["场景参考", "视觉基调", "镜头背景"] },
};

// Opaque generated filenames were visually reviewed before entering the library.
const overrides: Record<string, Override> = {
  "017903": { category: "wearing", name: "日光珍珠坠饰佩戴" },
  "036e7f": { category: "wearing", name: "日光珍珠项链佩戴" },
  "07f9ab": { category: "wearing", name: "星芒珍珠耳环佩戴" },
  "151db0": { category: "model", name: "暖白造型全身模特" },
  "222e12": { category: "model", name: "自然手部模特特写" },
  "228c9b": { category: "product", name: "珍珠坠饰项链静物" },
  "241924": { category: "wearing", name: "粉珍珠戒指佩戴" },
  "2bacd4": { category: "scene", name: "庭院咖啡桌场景" },
  "2c6b74": { category: "scene", name: "花园入口场景" },
  "2d30d2": { category: "model", name: "白衬衫侧脸模特" },
  "400452": { category: "model", name: "花园白衬衫模特" },
  "452653": { category: "scene", name: "露台夕阳场景" },
  "4dc8d1": { category: "scene", name: "陶罐橄榄庭院场景" },
  "4e29b8": { category: "product", name: "粉珍珠手镯静物" },
  "65c179": { category: "wearing", name: "复古戒指佩戴" },
  "66a0ae": { category: "model", name: "暖白套装全身模特" },
  "6dae5a": { category: "wearing", name: "蓝玉手链佩戴" },
  "72933e": { category: "model", name: "白衬衫正面模特" },
  "74a74c": { category: "wearing", name: "蓝玉手链手腕佩戴" },
  "80d14d": { category: "product", name: "珍珠花朵戒指静物" },
  "8a2313": { category: "wearing", name: "咖啡桌手链佩戴" },
  "8cf40d": { category: "wearing", name: "珍珠垂坠耳环佩戴" },
  "99bf04": { category: "model", name: "白衬衫近景模特" },
  "9b5938": { category: "scene", name: "泳池躺椅场景" },
  "9bc839": { category: "wearing", name: "花园珍珠耳环佩戴" },
  "9e02cc": { category: "wearing", name: "花影珍珠耳环佩戴" },
  "a0fc6c": { category: "product", name: "珍珠编织手镯静物" },
  "a94a6e": { category: "model", name: "蓝衬衫全身模特" },
  "afa305": { category: "wearing", name: "彩珠手链佩戴" },
  "aff6b5": { category: "scene", name: "窗边静物场景" },
  "b2eea9": { category: "model", name: "庭院蓝衬衫模特" },
  "c39e8e": { category: "model", name: "阅读白衬衫模特" },
  "c60378": { category: "wearing", name: "日光珍珠耳环佩戴" },
  "cdb0a1": { category: "scene", name: "海边石阶场景" },
  "d7cc64": { category: "wearing", name: "泳池珍珠项链佩戴" },
  "d91f6e": { category: "wearing", name: "白衬衫珍珠耳环佩戴" },
  "dd392d": { category: "scene", name: "海边窗帘场景" },
  "de7369": { category: "product", name: "粉珍珠圈形手镯静物" },
  "dfd333": { category: "wearing", name: "珍珠坠饰项链佩戴" },
  "e34317": { category: "wearing", name: "珍珠项链颈部佩戴" },
  "e4899d": { category: "wearing", name: "蓝衬衫珍珠耳环佩戴" },
  "e74945": { category: "wearing", name: "彩珠手链手腕佩戴" },
  "eaafcd": { category: "wearing", name: "咖啡桌珍珠耳环佩戴" },
  "ee5f67": { category: "wearing", name: "海边珍珠耳环佩戴" },
  "ef3d5e": { category: "wearing", name: "金色珍珠项链佩戴" },
  "f17a5b": { category: "scene", name: "地中海露台场景" },
  "fe2457": { category: "product", name: "珍珠编织手镯静物" },
};

function walkImages(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const itemPath = join(directory, entry.name);
    if (entry.isDirectory()) return walkImages(itemPath);
    return IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase()) ? [itemPath] : [];
  });
}

function hashFile(filePath: string): string {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function normalize(filePath: string): string {
  return filePath.replace(/\\/g, "/").toLowerCase();
}

function classify(filePath: string): Category {
  const path = normalize(filePath);
  if (path.includes("-worn.") || path.includes("pearl-earrings-editorial")) return "wearing";
  if (path.includes("/new_series/") || path.includes("/products/")) return "product";
  if (["/hero/", "/blog/", "/collections/", "/gifts/", "/about/"].some((part) => path.includes(part))) return "scene";
  return "model";
}

function titleCase(value: string): string {
  return value.split(/[-_\s]+/).filter(Boolean).map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join(" ");
}

function seriesFor(filePath: string | null, override: Override | undefined): string {
  if (override) return "Pearl Sunlight Campaign";
  const path = normalize(filePath ?? "");
  if (path.includes("/new_series/")) return "New Series";
  if (path.includes("/pearl-edit-v1/")) return "Pearl Edit V1";
  if (path.includes("/brand/products/")) return "Pearl Collection";
  if (path.includes("/brand/hero/")) return "Brand Hero";
  if (path.includes("/blog/")) return "Journal";
  return "Generated Collection";
}

function nameFor(candidate: Candidate, category: Category, override: Override | undefined): string {
  if (override) return override.name;
  if (!candidate.contextPath) return `待复核${labels[category]} ${candidate.hash.slice(0, 6)}`;
  const stem = basename(candidate.contextPath, extname(candidate.contextPath));
  const newSeries = stem.match(/_(\d{3})_\d+$/);
  return newSeries ? `New Series ${newSeries[1]}` : titleCase(stem);
}

function toFileUri(filePath: string): string {
  return `file:///${filePath.replace(/\\/g, "/")}`;
}

function yamlArray(values: string[]): string {
  return `[${values.map((value) => JSON.stringify(value)).join(", ")}]`;
}

function buildCandidates(): Candidate[] {
  const known = new Map<string, string>();
  for (const filePath of walkImages(PUBLIC_IMAGES_ROOT)) known.set(hashFile(filePath), filePath);
  const candidates = new Map<string, Candidate>();
  for (const filePath of walkImages(NEW_SERIES_ROOT)) {
    const hash = hashFile(filePath);
    candidates.set(hash, { hash, filePath, contextPath: filePath, sourceKind: "new_series" });
  }
  for (const filePath of walkImages(GENERATED_ROOT)) {
    const hash = hashFile(filePath);
    if (candidates.has(hash)) continue;
    const contextPath = known.get(hash) ?? null;
    candidates.set(hash, { hash, filePath, contextPath, sourceKind: contextPath ? "site_reference" : "generated_collection" });
  }
  return [...candidates.values()].sort((left, right) => left.hash.localeCompare(right.hash));
}

function describe(candidate: Candidate): Details {
  const override = candidate.sourceKind === "generated_collection" ? overrides[candidate.hash.slice(0, 6)] : undefined;
  const category = override?.category ?? (candidate.contextPath ? classify(candidate.contextPath) : "scene");
  const needsReview = candidate.sourceKind === "generated_collection" && !override;
  const categoryData = metadata[category];
  return {
    id: `IMG_MR_${category.toUpperCase()}_${candidate.hash.slice(0, 10).toUpperCase()}`,
    name: nameFor(candidate, category, override),
    category,
    series: seriesFor(candidate.contextPath, override),
    sourceKind: candidate.sourceKind,
    needsReview,
    tags: needsReview ? [...categoryData.tags, "待复核"] : categoryData.tags,
    useCases: categoryData.useCases,
  };
}

function cardContent(details: Details, imagePath: string): string {
  const status = details.needsReview ? "needs_review" : "reference_ready";
  const sourceLabels: Record<SourceKind, string> = { new_series: "New Series", site_reference: "站点现有素材", generated_collection: "生成素材集" };
  return [
    "---",
    `id: ${details.id}`,
    "asset_type: image_reference",
    `category: ${details.category}`,
    `status: ${status}`,
    "import_mode: image_reference",
    `series: ${JSON.stringify(details.series)}`,
    `source: ${details.sourceKind}`,
    "version: v1",
    `tags: ${yamlArray(details.tags)}`,
    "---",
    "",
    `# ${details.id}｜${details.name}`,
    "",
    `![](${toFileUri(imagePath)})`,
    "",
    "## 文件",
    "",
    `- [原图](${toFileUri(imagePath)})`,
    `- 分类：${labels[details.category]}`,
    `- 系列：${details.series}`,
    `- 来源：${sourceLabels[details.sourceKind]}`,
    "",
    "## 调用、限制与验收",
    "",
    `- 可用于：${details.useCases.join("、")}`,
    "- 不可替换：这是一张视觉参考图，不代表可直接调用的 3D 模型或成品。",
    "- [x] 图片已归档并可在 Obsidian 中预览",
    "- [x] 已完成分类，可按 YAML 属性检索",
    "",
  ].join("\n");
}

function writeIndexes(entries: Details[]) {
  mkdirSync(HOME_ROOT, { recursive: true });
  const counts = Object.fromEntries(categories.map((category) => [category, entries.filter((entry) => entry.category === category).length])) as Record<Category, number>;
  for (const category of categories) {
    const label = labels[category];
    const content = [
      "---",
      "type: image_asset_index",
      `category: ${category}`,
      `asset_count: ${counts[category]}`,
      "---",
      "",
      `# 珍珠图像素材｜${label}`,
      "",
      `共 ${counts[category]} 张，资产卡位于 \`01-资产卡/图像参考/${label}\`。`,
      "",
      "```dataview",
      "TABLE WITHOUT ID link(file.link, \"资产卡\") AS \"资产卡\", series AS \"系列\", status AS \"状态\"",
      `FROM "01-资产卡/图像参考/${label}"`,
      "SORT series ASC, id ASC",
      "```",
      "",
    ].join("\n");
    writeFileSync(join(HOME_ROOT, `珠宝图像素材｜${label}.md`), content, "utf8");
  }
  const dashboard = [
    "---",
    "type: image_asset_library",
    `total_assets: ${entries.length}`,
    "---",
    "",
    "# 珍珠图像素材库",
    "",
    "本库归档模特、产品、佩戴和场景视觉参考；原图位于影视资产库的 `06-reference-inputs`，资产卡仅保存分类、来源和调用说明。",
    "",
    "| 分类 | 数量 | 索引 |",
    "| --- | ---: | --- |",
    `| 模特 | ${counts.model} | [[珠宝图像素材｜模特]] |`,
    `| 产品 | ${counts.product} | [[珠宝图像素材｜产品]] |`,
    `| 佩戴图 | ${counts.wearing} | [[珠宝图像素材｜佩戴图]] |`,
    `| 场景图 | ${counts.scene} | [[珠宝图像素材｜场景图]] |`,
    "",
  ].join("\n");
  writeFileSync(join(HOME_ROOT, "珍珠图像素材库.md"), dashboard, "utf8");
}

export function syncObsidianImageLibrary() {
  const candidates = buildCandidates();
  const entries: Details[] = [];
  mkdirSync(IMAGE_ROOT, { recursive: true });
  mkdirSync(CARD_ROOT, { recursive: true });
  for (const candidate of candidates) {
    const details = describe(candidate);
    const extension = extname(candidate.filePath).toLowerCase();
    const folder = labels[details.category];
    const imageDirectory = join(IMAGE_ROOT, folder);
    const cardDirectory = join(CARD_ROOT, folder);
    const imagePath = join(imageDirectory, `${details.id}${extension}`);
    const cardPath = join(cardDirectory, `${details.id}.md`);
    mkdirSync(imageDirectory, { recursive: true });
    mkdirSync(cardDirectory, { recursive: true });
    if (!existsSync(imagePath)) copyFileSync(candidate.filePath, imagePath);
    if (!existsSync(cardPath)) writeFileSync(cardPath, cardContent(details, imagePath), "utf8");
    entries.push(details);
  }
  writeIndexes(entries);
  writeFileSync(join(IMAGE_ROOT, "manifest.json"), `${JSON.stringify(entries, null, 2)}\n`, "utf8");
  writeFileSync(join(IMAGE_ROOT, "README.md"), ["# MythRealms Pearl Visual Library", "", "Copied reference images for the Obsidian visual asset cards.", "The original generated-image source remains unchanged.", ""].join("\n"), "utf8");
  const counts = Object.fromEntries(categories.map((category) => [category, entries.filter((entry) => entry.category === category).length]));
  return { sourceFiles: walkImages(GENERATED_ROOT).length + walkImages(NEW_SERIES_ROOT).length, uniqueAssets: entries.length, counts, needsReview: entries.filter((entry) => entry.needsReview).length };
}

if (process.argv[1]?.endsWith("sync-obsidian-image-library.ts")) {
  console.log(JSON.stringify(syncObsidianImageLibrary(), null, 2));
}
