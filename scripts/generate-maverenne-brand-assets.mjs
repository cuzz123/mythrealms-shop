import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceMaster = "public/brand/maverenne-mark.svg";
const sourceMethod = "deterministic_local_sharp_svg_rasterization";
const rightsStatus = "internal_original_brand_artwork__internal_use_only__not_a_product_or_seo_image__legal_review_not_a_publication_clearance";
const background = "#F7F3EB";

const outputSizes = [
  { path: "public/apple-icon.png", width: 180, height: 180 },
  { path: "public/icon-192.png", width: 192, height: 192 },
  { path: "public/icon-512.png", width: 512, height: 512 },
  { path: "public/brand/maverenne-og-default.png", width: 1200, height: 630 },
];

function absolute(relativePath) {
  return path.join(root, relativePath);
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function icoContainer(entries) {
  const directorySize = 6 + entries.length * 16;
  let offset = directorySize;
  const header = Buffer.alloc(directorySize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  for (const [index, entry] of entries.entries()) {
    const position = 6 + index * 16;
    header.writeUInt8(entry.width === 256 ? 0 : entry.width, position);
    header.writeUInt8(entry.height === 256 ? 0 : entry.height, position + 1);
    header.writeUInt8(0, position + 2);
    header.writeUInt8(0, position + 3);
    header.writeUInt16LE(1, position + 4);
    header.writeUInt16LE(32, position + 6);
    header.writeUInt32LE(entry.bytes.length, position + 8);
    header.writeUInt32LE(offset, position + 12);
    offset += entry.bytes.length;
  }

  return Buffer.concat([header, ...entries.map((entry) => entry.bytes)]);
}

async function renderPng(svg, width, height) {
  return sharp(svg, { density: 144 })
    .resize({ width, height, fit: "contain", background })
    .png({ compressionLevel: 9, adaptiveFiltering: false, progressive: false })
    .toBuffer();
}

async function main() {
  const rawSvg = await readFile(absolute(sourceMaster), "utf8");
  const svg = Buffer.from(rawSvg.replace(/\r\n?/g, "\n"), "utf8");
  await mkdir(absolute("public/brand"), { recursive: true });

  await writeFile(absolute(sourceMaster), svg);
  await writeFile(absolute("public/icon.svg"), svg);

  const rasterAssets = [];
  for (const output of outputSizes) {
    const bytes = await renderPng(svg, output.width, output.height);
    await writeFile(absolute(output.path), bytes);
    rasterAssets.push({ ...output, bytes });
  }

  const faviconEntries = await Promise.all(
    [16, 32, 48].map(async (size) => ({
      width: size,
      height: size,
      bytes: await renderPng(svg, size, size),
    })),
  );
  const favicon = icoContainer(faviconEntries);
  await writeFile(absolute("src/app/favicon.ico"), favicon);

  const provenanceAssets = [
    {
      path: sourceMaster,
      mimeType: "image/svg+xml",
      width: 64,
      height: 64,
      sha256: sha256(svg),
    },
    {
      path: "public/icon.svg",
      mimeType: "image/svg+xml",
      width: 64,
      height: 64,
      sha256: sha256(svg),
    },
    {
      path: "src/app/favicon.ico",
      mimeType: "image/x-icon",
      variants: faviconEntries.map(({ width, height }) => `${width}x${height}`),
      sha256: sha256(favicon),
    },
    ...rasterAssets.map(({ bytes, ...asset }) => ({
      ...asset,
      mimeType: "image/png",
      sha256: sha256(bytes),
    })),
  ];

  const provenance = {
    schemaVersion: "1.0",
    generatedOn: "2026-08-10",
    generator: "scripts/generate-maverenne-brand-assets.mjs",
    sourceMaster,
    sourceMethod,
    rightsStatus,
    restrictions: [
      "No external input, network access, image-generation service, product image, historical Pinterest asset, or SEO image is used.",
      "This is an internal original brand-artwork record, not a legal rights clearance or publication approval.",
    ],
    assets: provenanceAssets,
  };
  await writeFile(
    absolute("public/brand/maverenne-brand-assets.provenance.json"),
    `${JSON.stringify(provenance, null, 2)}\n`,
  );
}

await main();
