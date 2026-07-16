#!/usr/bin/env node
// Batch compress PNG images using sharp
(async () => {
const { default: sharp } = await import("sharp");
const fs = await import("node:fs");
const path = await import("node:path");

const DIR = path.join(__dirname, "..", "public", "images");
const MIN_KB = 50; // skip already small images

let totalBefore = 0;
let totalAfter = 0;
let count = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { walk(full); continue; }
    if (!e.name.endsWith(".png") && !e.name.endsWith(".jpg") && !e.name.endsWith(".jpeg")) continue;

    const stat = fs.statSync(full);
    if (stat.size < MIN_KB * 1024) continue;

    totalBefore += stat.size;
    const tmp = full + ".tmp";

    try {
      sharp(full)
        .png({ quality: 85, compressionLevel: 9, palette: true })
        .toFile(tmp, (err) => {
          if (err) { console.log("  SKIP", e.name, err.message); return; }
          const after = fs.statSync(tmp).size;
          if (after < stat.size * 0.95) {
            fs.renameSync(tmp, full);
            totalAfter += after;
            count++;
            const pct = Math.round((1 - after / stat.size) * 100);
            console.log(`  ${pct}%  ${e.name}  ${(stat.size/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB`);
          } else {
            fs.unlinkSync(tmp);
            totalAfter += after;
          }
        });
    } catch (e) {
      console.log("  ERR", e.name, e.message);
    }
  }
}

console.log("Compressing images...\n");
walk(DIR);

setTimeout(() => {
  const saved = totalBefore - totalAfter;
  const pct = totalBefore > 0 ? Math.round((saved / totalBefore) * 100) : 0;
  console.log(`\nDone: ${count} images compressed`);
  console.log(`Before: ${(totalBefore/1024/1024).toFixed(1)}MB → After: ${(totalAfter/1024/1024).toFixed(1)}MB`);
  console.log(`Saved: ${(saved/1024/1024).toFixed(1)}MB (${pct}%)`);
}, 5000);
})();
