import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPOSITORY_ROOT = resolve(fileURLToPath(new URL("../../", import.meta.url)));
const OUTPUT_SLOTS = ["main", "on-model", "macro", "lifestyle"] as const;

type OutputSlot = (typeof OUTPUT_SLOTS)[number];

type Product = {
  slug: string;
  kind: string;
  sourceReferences: string[];
  outputs: Record<OutputSlot, string>;
  status: string;
};

type PilotManifest = {
  products: Product[];
};

type QaRecord = Record<string, unknown>;

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function publicUrl(reference: string): string {
  const normalized = reference.replaceAll("\\", "/").replace(/^\.\//, "");
  if (!normalized.startsWith("public/")) {
    throw new Error(`Expected a path beneath public/: ${reference}`);
  }
  return `/${normalized.slice("public/".length)}`;
}

function isAvailable(reference: string): boolean {
  return existsSync(resolve(REPOSITORY_ROOT, reference));
}

function valuesFor(record: QaRecord | undefined, keys: string[]): unknown[] {
  if (!record) return [];
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value;
    if (value !== undefined && value !== null && value !== "") return [value];
  }
  return [];
}

function renderValue(value: unknown, fallback: string): string {
  if (value === undefined || value === null || value === "") return escapeHtml(fallback);
  if (typeof value === "object") return escapeHtml(JSON.stringify(value));
  return escapeHtml(value);
}

function renderList(values: unknown[], fallback: string): string {
  if (values.length === 0) return `<span class="muted">${escapeHtml(fallback)}</span>`;
  return `<ul>${values.map((value) => `<li>${renderValue(value, fallback)}</li>`).join("")}</ul>`;
}

function renderSources(product: Product): string {
  return product.sourceReferences
    .map((reference, index) => {
      const label = `${product.slug} source ${index + 1}`;
      if (!isAvailable(reference)) {
        return `<div class="missing-source" data-reference-kind="source">Missing source: ${escapeHtml(label)}</div>`;
      }
      return `<img class="thumbnail" data-reference-kind="source" src="${escapeHtml(publicUrl(reference))}" alt="${escapeHtml(label)}">`;
    })
    .join("");
}

function renderOutput(product: Product, slot: OutputSlot): string {
  const reference = product.outputs[slot];
  if (!isAvailable(reference)) {
    return '<div class="not-generated" role="status">Not generated</div>';
  }
  return `<img class="output" data-reference-kind="output" src="${escapeHtml(publicUrl(reference))}" alt="${escapeHtml(`${product.slug} ${slot}`)}">`;
}

function renderQa(product: Product, qa: QaRecord | undefined): string {
  const status = renderValue(qa?.status ?? product.status, product.status);
  const rejections = renderList(valuesFor(qa, ["rejectionHistory", "rejections", "rejectionReasons"]), "None");
  const checklist = renderList(valuesFor(qa, ["identityChecklist", "identityChecks", "checks"]), "Not reviewed");

  return `<dl class="qa-summary"><div><dt>Status</dt><dd>${status}</dd></div><div><dt>Rejection history</dt><dd>${rejections}</dd></div><div><dt>Identity checklist</dt><dd>${checklist}</dd></div></dl>`;
}

function renderProduct(product: Product, qa: QaRecord | undefined): string {
  const rows = OUTPUT_SLOTS.map((slot, index) => {
    const sourceCell = index === 0 ? `<td class="source-cell" rowspan="4"><div class="source-list">${renderSources(product)}</div></td>` : "";
    const qaCell = index === 0 ? `<td class="qa-cell" rowspan="4">${renderQa(product, qa)}</td>` : "";
    return `<tr>${sourceCell}<th scope="row">${escapeHtml(slot)}</th><td>${renderOutput(product, slot)}</td>${qaCell}</tr>`;
  }).join("");

  return `<section class="product-section" data-product-slug="${escapeHtml(product.slug)}"><header><p>${escapeHtml(product.kind)}</p><h2>${escapeHtml(product.slug)}</h2></header><div class="table-wrap"><table><thead><tr><th>Supplier references</th><th>Slot</th><th>Editorial output</th><th>QA review</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

export function buildReviewHtml(manifest: PilotManifest, qaRecords: ReadonlyMap<string, QaRecord>): string {
  const sections = manifest.products.map((product) => renderProduct(product, qaRecords.get(product.slug))).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Product imagery review</title>
  <style>
    :root { color: #172033; background: #f5f7fb; font-family: Arial, sans-serif; }
    * { box-sizing: border-box; }
    body { margin: 0; }
    main { max-width: 1440px; margin: 0 auto; padding: 32px 24px 48px; }
    h1, h2, p { margin: 0; }
    h1 { font-size: 28px; }
    .intro { margin-top: 8px; color: #526078; }
    .product-section { margin-top: 28px; background: #ffffff; border: 1px solid #d7deea; border-radius: 6px; overflow: hidden; }
    .product-section header { padding: 16px 20px; border-bottom: 1px solid #d7deea; }
    .product-section header p { color: #526078; font-size: 13px; text-transform: uppercase; }
    .product-section h2 { margin-top: 4px; font-size: 20px; overflow-wrap: anywhere; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; min-width: 960px; border-collapse: collapse; }
    th, td { padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: left; vertical-align: top; }
    thead th { background: #eef2f7; font-size: 13px; }
    tbody th { width: 110px; font-size: 14px; text-transform: capitalize; }
    .source-cell { width: 270px; }
    .qa-cell { width: 270px; }
    .source-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .thumbnail, .output { display: block; width: 100%; height: auto; aspect-ratio: 4 / 5; object-fit: cover; border: 1px solid #cbd5e1; }
    .not-generated, .missing-source { min-height: 160px; display: grid; place-items: center; padding: 12px; border: 1px dashed #94a3b8; background: #f8fafc; color: #526078; text-align: center; }
    .qa-summary { display: grid; gap: 12px; margin: 0; }
    .qa-summary div { display: grid; gap: 4px; }
    dt { color: #526078; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    dd { margin: 0; overflow-wrap: anywhere; }
    ul { margin: 0; padding-left: 18px; }
    .muted { color: #64748b; }
    @media (max-width: 640px) { main { padding: 20px 12px 32px; } h1 { font-size: 24px; } .product-section header { padding: 14px; } }
  </style>
</head>
<body>
  <main>
    <h1>Product imagery review</h1>
    <p class="intro">Pilot asset comparison and QA status.</p>
    ${sections}
  </main>
</body>
</html>`;
}

function readQaRecords(manifest: PilotManifest): Map<string, QaRecord> {
  const records = new Map<string, QaRecord>();
  for (const product of manifest.products) {
    const qaPath = resolve(REPOSITORY_ROOT, "assets/product-imagery/qa", `${product.slug}.json`);
    if (existsSync(qaPath)) {
      records.set(product.slug, JSON.parse(readFileSync(qaPath, "utf8")) as QaRecord);
    }
  }
  return records;
}

export function buildReviewPage(): void {
  const manifestPath = resolve(REPOSITORY_ROOT, "assets/product-imagery/pilot-manifest.json");
  const outputPath = resolve(REPOSITORY_ROOT, "public/preview/product-imagery-review.html");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as PilotManifest;
  mkdirSync(resolve(REPOSITORY_ROOT, "public/preview"), { recursive: true });
  writeFileSync(outputPath, buildReviewHtml(manifest, readQaRecords(manifest)));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildReviewPage();
}
