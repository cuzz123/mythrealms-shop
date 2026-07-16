/**
 * Bulk upload public/images/ → Vercel Blob
 *
 * Usage: BLOB_READ_WRITE_TOKEN=xxx npx tsx scripts/upload-images-to-blob.ts
 */
import { put, list } from "@vercel/blob";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local" });

const IMAGES_DIR = join(process.cwd(), "public/images");

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (/\.(png|jpg|jpeg|webp|svg|gif|avif)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token || token === "vercel_blob_rw_" || token.length < 10) {
    console.error("❌ BLOB_READ_WRITE_TOKEN 未设置或无效。请在 .env 中设置。");
    console.error("   在 Vercel Dashboard → Storage → Blob → Settings 获取。");
    process.exit(1);
  }

  const files = walk(IMAGES_DIR);
  console.log(`找到 ${files.length} 张图片\n`);

  // Check what's already uploaded
  console.log("检查已有 blob…");
  const existing = new Set<string>();
  try {
    let cursor: string | undefined;
    do {
      const page = await list({ cursor, mode: "folded" });
      for (const f of page.blobs) existing.add(f.pathname);
      cursor = page.cursor;
    } while (cursor);
  } catch (e) {
    console.log("  无法列出已有 blob（可能是空 store）");
  }
  console.log(`  已有 ${existing.size} 个 blob\n`);

  const toUpload = files.filter((f) => {
    const rel = relative(IMAGES_DIR, f).replace(/\\/g, "/");
    return !existing.has(`images/${rel}`);
  });

  if (toUpload.length === 0) {
    console.log("✅ 全部已上传，无需操作。");
    return;
  }

  console.log(`需要上传 ${toUpload.length} 张图片（共 ${files.length}，${existing.size} 已跳过）\n`);

  let uploaded = 0;
  let skipped = 0;
  const startTime = Date.now();

  for (let i = 0; i < toUpload.length; i++) {
    const file = toUpload[i];
    const rel = relative(IMAGES_DIR, file).replace(/\\/g, "/");
    const pathname = `images/${rel}`;
    const size = statSync(file).size;

    try {
      const buffer = readFileSync(file);
      await put(pathname, buffer, {
        access: "public",
        contentType: file.endsWith(".svg") ? "image/svg+xml"
          : file.endsWith(".webp") ? "image/webp"
          : file.endsWith(".avif") ? "image/avif"
          : file.endsWith(".png") ? "image/png"
          : file.endsWith(".jpg") || file.endsWith(".jpeg") ? "image/jpeg"
          : file.endsWith(".gif") ? "image/gif"
          : undefined,
      });

      uploaded++;
      const pct = ((uploaded / toUpload.length) * 100).toFixed(0);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const rate = uploaded / ((Date.now() - startTime) / 1000);
      const remaining = ((toUpload.length - uploaded) / rate).toFixed(0);
      process.stdout.write(`\r  [${pct}%] ${uploaded}/${toUpload.length} | ${(size/1024).toFixed(0)}KB ${rel.slice(0, 60)} | 剩余约 ${remaining}s  `);
    } catch (error: unknown) {
      skipped++;
      const message = error instanceof Error ? error.message : "Unknown error";
      console.log(`\n  ⚠️  跳过 ${rel}: ${message.slice(0, 80)}`);
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(0);
  console.log(`\n\n✅ 完成！上传 ${uploaded}，跳过 ${skipped}，耗时 ${totalTime}s`);
  console.log(`   Blob 基础 URL: https://<YOUR_STORE_ID>.public.blob.vercel-storage.com/images/`);
}

main().catch((e) => {
  console.error("❌ 上传失败:", e.message);
  process.exit(1);
});
