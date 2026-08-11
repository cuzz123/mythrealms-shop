import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { GET as getLlmsText } from "../src/app/llms.txt/route";
import robots from "../src/app/robots";
import {
  DEFAULT_SITE_URL,
  SITE_NAME,
  absoluteUrl,
} from "../src/lib/site";

const LEGACY_PUBLIC_IDENTITY = /MythRealms|mythrealms-shop\.vercel\.app/i;
const LEGACY_IDENTITY_TOKENS = /mythrealms(?:[a-z0-9_.:-]*[a-z0-9_.:-])?/gi;
const PUBLIC_RUNTIME_ROOTS = ["src/app", "src/components", "src/lib", "public"] as const;
const EXPLICIT_HISTORICAL_OR_INTERNAL_RESIDUE_PATHS = [
  "content/pin-library/all-pins.json",
  "docs/company/maverenne-url-migration.csv",
] as const;
const EXPLICIT_LEGACY_TOKEN_ALLOWLIST = new Map<string, readonly string[]>([
  [
    "src/app/admin/social-tasks/page.tsx",
    // Preserve these two localStorage keys only to read/write the existing admin checklist state.
    ["mythrealms-tasks", "mythrealms-tasks-expanded"],
  ],
  [
    "src/lib/recently-viewed.ts",
    // Read and migrate this legacy key once; all subsequent writes use the Maverenne key.
    ["mythrealms-recently-viewed"],
  ],
  // Established browser persistence/dedupe namespaces remain internal and preserve existing state.
  ["src/lib/cart.ts", ["mythrealms-cart"]],
  ["src/lib/wishlist.ts", ["mythrealms-wishlist"]],
  ["src/lib/tracking.ts", ["mythrealms:purchase-tracked:"]],
  ["src/components/growth/FirstOrderInvitation.tsx", ["mythrealms:first-order-invitation-dismissed-at", "mythrealms:first-order-invitation-shown"]],
  ["src/lib/analytics/referral.ts", ["mythrealms-ai-referral-tracked"]],
  // These 099c namespaces are internal compatibility or idempotency tokens, not public identity.
  ["src/app/checkout/page.tsx", ["mythrealmsorderid"]],
  ["src/app/products/[slug]/1688-product.tsx", ["mythrealms-recently-viewed"]],
  ["src/lib/analytics/consent.ts", ["mythrealms:consent-changed"]],
  ["src/lib/client/recently-viewed.ts", ["mythrealms-recently-viewed"]],
  ["src/lib/client/social-task-storage.ts", ["mythrealms-tasks", "mythrealms-tasks-expanded", "mythrealms-social-tasks-change"]],
]);
const ACTIVE_AUTOMATION_SURFACES = [
  "content/n8n-workflows/daily-report-email.json",
  "content/n8n-workflows/daily-pinterest-pin.json",
  "content/n8n-workflows/cross-platform-sync.json",
  "content/n8n-workflows/daily-instagram-post.json",
  "content/n8n-workflows/daily-facebook-post.json",
  "scripts/gen-pins.ts",
  "scripts/gen-tiktok.ts",
  "scripts/publish-pins.py",
  "src/lib/pinterest-content.ts",
] as const;
const ACTIVE_PINTEREST_ROUND =
  "content/pin-library/maverenne-2026-08-10-round-01.json";
const STATIC_HTML_ARCHIVE_MANIFEST =
  "docs/company/archive/legacy-public-static-2026-08-10/disposition.json";
const PROHIBITED_PUBLIC_STATIC_HTML = /MythRealms|mythrealms-shop\.vercel\.app|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\b(?:api[_-]?key|access[_-]?token|token|password|secret|handcrafted|free[ -]?shipping|price|in stock|out of stock|limited stock|buy now|add to cart|shop now)\b|\$\d/iu;

const require = createRequire(import.meta.url);
require.extensions[".css"] = () => undefined;
const { metadata } = require("../src/app/layout") as typeof import("../src/app/layout");

type ManifestOutput = {
  name?: string;
  short_name?: string;
  start_url?: string;
  display?: string;
  icons?: Array<{ src?: string; sizes?: string; type?: string }>;
};

type BrandAssetProvenance = {
  sourceMaster?: string;
  sourceMethod?: string;
  rightsStatus?: string;
  assets?: Array<{
    path?: string;
    width?: number;
    height?: number;
    sha256?: string;
  }>;
};

function pngDimensions(asset: string): { width: number; height: number } {
  const bytes = readFileSync(path.join(process.cwd(), asset));
  assert.deepEqual(
    bytes.subarray(0, 8),
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    `${asset} must be a PNG`,
  );
  assert.equal(bytes.toString("ascii", 12, 16), "IHDR", `${asset} must have an IHDR chunk`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function sha256(asset: string): string {
  return createHash("sha256")
    .update(readFileSync(path.join(process.cwd(), asset)))
    .digest("hex");
}

function filesUnder(relativeDirectory: string, extension: RegExp): string[] {
  const absoluteDirectory = path.join(process.cwd(), relativeDirectory);
  if (!existsSync(absoluteDirectory)) return [];

  return readdirSync(absoluteDirectory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) return filesUnder(relativePath, extension);
    return extension.test(entry.name) && statSync(path.join(process.cwd(), relativePath)).isFile()
      ? [relativePath]
      : [];
  });
}

function unapprovedLegacyTokens(file: string, source: string): string[] {
  const normalizedFile = file.replaceAll("\\", "/");
  return Array.from(source.matchAll(LEGACY_IDENTITY_TOKENS), (match) => match[0]).filter(
    (token) => !EXPLICIT_LEGACY_TOKEN_ALLOWLIST.get(normalizedFile)?.includes(token.toLowerCase()),
  );
}

function legacyResidue(paths: readonly string[]): string[] {
  return paths.flatMap((file) => {
    const normalizedFile = file.replaceAll("\\", "/");
    if (EXPLICIT_HISTORICAL_OR_INTERNAL_RESIDUE_PATHS.some(
      (allowedPath) =>
        normalizedFile === allowedPath ||
        normalizedFile.startsWith(`${allowedPath}/`),
    )) return [];

    const source = readFileSync(path.join(process.cwd(), file), "utf8");
    return unapprovedLegacyTokens(normalizedFile, source).map((token) => `${file}: ${token}`);
  });
}

function publicStaticHtmlResidue(paths: readonly string[]): string[] {
  return paths.flatMap((file) => {
    const contents = readFileSync(path.join(process.cwd(), file), "utf8");
    return Array.from(contents.matchAll(new RegExp(PROHIBITED_PUBLIC_STATIC_HTML.source, "giu"))).map(
      (match) => `${file}: ${match[0]}`,
    );
  });
}

test("public identity primitives resolve the approved Maverenne domain", () => {
  assert.equal(SITE_NAME, "Maverenne");
  assert.equal(DEFAULT_SITE_URL, "https://www.maverenne.com");
  assert.equal(absoluteUrl("/pearls"), "https://www.maverenne.com/pearls");
});

test("legacy token allowlists require exact maximal tokens", () => {
  assert.deepEqual(
    unapprovedLegacyTokens(
      "src/app/admin/social-tasks/page.tsx",
      '"mythrealms-tasks" "mythrealms-tasks-expanded"',
    ),
    [],
  );
  assert.deepEqual(
    unapprovedLegacyTokens(
      "src/app/admin/social-tasks/page.tsx",
      '"mythrealms-tasks-backup" "mythrealms-tasks-expanded-extra"',
    ),
    ["mythrealms-tasks-backup", "mythrealms-tasks-expanded-extra"],
  );
});

test("root metadata emits Maverenne without legacy public identity", () => {
  const publicMetadata = JSON.stringify(metadata);
  const icons = metadata.icons as { icon?: unknown; apple?: unknown } | undefined;

  assert.match(publicMetadata, /Maverenne/);
  assert.match(publicMetadata, /\/brand\/maverenne-og-default\.png/);
  assert.doesNotMatch(publicMetadata, LEGACY_PUBLIC_IDENTITY);

  assert.equal(icons?.icon, "/icon-192.png");
  assert.equal(icons?.apple, "/apple-icon.png");
  assert.match(JSON.stringify(metadata.openGraph?.images), /maverenne-og-default\.png/);
  assert.match(JSON.stringify(metadata.twitter?.images), /maverenne-og-default\.png/);
});

test("machine discovery surfaces use the canonical Maverenne origin", async () => {
  const robotOutput = robots();
  const llmsText = await getLlmsText().text();

  assert.equal(robotOutput.host, "https://www.maverenne.com");
  assert.equal(robotOutput.sitemap, "https://www.maverenne.com/sitemap.xml");
  assert.match(llmsText, /Maverenne/);
  assert.match(llmsText, /https:\/\/www\.maverenne\.com/);
  assert.doesNotMatch(llmsText, LEGACY_PUBLIC_IDENTITY);
});

test("public route and static HTML surfaces cannot retain legacy identity", () => {
  const publicRuntimeFiles = [
    ...PUBLIC_RUNTIME_ROOTS.flatMap((root) =>
      root === "public" ? filesUnder(root, /\.html$/) : filesUnder(root, /\.(?:ts|tsx)$/),
    ),
    ...ACTIVE_AUTOMATION_SURFACES,
  ];

  assert.deepEqual(legacyResidue(publicRuntimeFiles), []);
});

test("public static HTML cannot expose legacy identity, credentials, or stale commercial claims", () => {
  assert.deepEqual(
    publicStaticHtmlResidue(filesUnder("public", /\.html$/)),
    [],
  );
});

test("the static HTML archive records each relocated public artifact with its original hash", () => {
  assert.equal(existsSync(path.join(process.cwd(), STATIC_HTML_ARCHIVE_MANIFEST)), true);
  if (!existsSync(path.join(process.cwd(), STATIC_HTML_ARCHIVE_MANIFEST))) return;

  const manifest = JSON.parse(
    readFileSync(path.join(process.cwd(), STATIC_HTML_ARCHIVE_MANIFEST), "utf8"),
  ) as {
    disposition?: string;
    files?: Array<{ originalPath?: string; archivePath?: string; bytes?: number; sha256?: string; disposition?: string }>;
  };

  assert.equal(manifest.disposition, "internal-only-historical-evidence");
  assert.equal(manifest.files?.length, 31, "archive must account for all relocated artifacts");
  for (const file of manifest.files ?? []) {
    assert.match(file.originalPath ?? "", /^public\/(?:demo|guides|preview)\//);
    assert.match(file.archivePath ?? "", /^docs\/company\/archive\/legacy-public-static-2026-08-10\//);
    assert.equal(file.disposition, "relocated-internal-only-no-approved-runtime-purpose");
    assert.equal(file.bytes, statSync(path.join(process.cwd(), file.archivePath!)).size);
    assert.equal(file.sha256, sha256(file.archivePath!), `${file.archivePath} must retain its original hash`);
  }

  const archiveRoot = "docs/company/archive/legacy-public-static-2026-08-10/public";
  const archivedArtifacts = filesUnder(archiveRoot, /.+/)
    .map((file) => file.replaceAll("\\", "/"))
    .sort();
  const recordedArtifacts = (manifest.files ?? [])
    .map((file) => file.archivePath!)
    .sort();
  assert.deepEqual(recordedArtifacts, archivedArtifacts);
  for (const file of manifest.files ?? []) {
    assert.equal(existsSync(path.join(process.cwd(), file.originalPath!)), false);
  }
});

test("the active Pinterest round cannot inherit the historical archive identity", () => {
  // The historical archive and internal tools are deliberately excluded from
  // the public runtime scan above; this check applies once the active round exists.
  if (!existsSync(path.join(process.cwd(), ACTIVE_PINTEREST_ROUND))) return;
  assert.deepEqual(legacyResidue([ACTIVE_PINTEREST_ROUND]), []);
});

test("the Maverenne manifest declares installable brand metadata and icon variants", () => {
  const manifestPath = path.join(process.cwd(), "src/app/manifest.ts");
  assert.equal(existsSync(manifestPath), true, "src/app/manifest.ts must exist");
  if (!existsSync(manifestPath)) return;

  const manifestModule = require("../src/app/manifest") as {
    default?: () => ManifestOutput;
  };
  const manifestSource = readFileSync(manifestPath, "utf8");
  assert.match(manifestSource, /import\s*\{\s*SITE_NAME\s*\}\s*from\s*["']@\/lib\/site["']/);
  assert.doesNotMatch(manifestSource, /["']Maverenne["']/);
  assert.equal(typeof manifestModule.default, "function");
  if (typeof manifestModule.default !== "function") return;

  const manifest = manifestModule.default();
  assert.equal(manifest.name, "Maverenne");
  assert.equal(manifest.short_name, "Maverenne");
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.display, "standalone");
  assert.deepEqual(manifest.icons, [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
  ]);
});

test("the Maverenne brand asset family derives from a text-free vector master", () => {
  const assets = [
    "public/brand/maverenne-mark.svg",
    "src/app/favicon.ico",
    "public/icon.svg",
    "public/apple-icon.png",
    "public/icon-192.png",
    "public/icon-512.png",
    "public/brand/maverenne-og-default.png",
    "public/brand/maverenne-brand-assets.provenance.json",
  ];
  for (const asset of assets) {
    assert.equal(existsSync(path.join(process.cwd(), asset)), true, `${asset} must exist`);
  }

  const master = readFileSync(path.join(process.cwd(), "public/brand/maverenne-mark.svg"), "utf8");
  assert.match(master, /viewBox=["']0 0 64 64["']/);
  assert.doesNotMatch(master, /<text|<title|<desc|font|diamond|#D4A84B/i);
  assert.match(master, /<path/);
  assert.match(master, /<circle/);

  const favicon = readFileSync(path.join(process.cwd(), "src/app/favicon.ico"));
  assert.equal(favicon.readUInt16LE(0), 0, "favicon ICO header must begin with a reserved zero");
  assert.equal(favicon.readUInt16LE(2), 1, "favicon must be an ICO container");
  assert.equal(favicon.readUInt16LE(4), 3, "favicon must contain 16, 32, and 48 pixel variants");
});

test("the Maverenne raster brand assets have exact approved dimensions", () => {
  const dimensions = {
    "public/apple-icon.png": { width: 180, height: 180 },
    "public/icon-192.png": { width: 192, height: 192 },
    "public/icon-512.png": { width: 512, height: 512 },
    "public/brand/maverenne-og-default.png": { width: 1200, height: 630 },
  } as const;

  for (const [asset, expected] of Object.entries(dimensions)) {
    assert.deepEqual(pngDimensions(asset), expected, `${asset} dimensions must match its public contract`);
  }
});

test("the Maverenne brand provenance records actual deterministic outputs", () => {
  const provenancePath = "public/brand/maverenne-brand-assets.provenance.json";
  const provenance = JSON.parse(
    readFileSync(path.join(process.cwd(), provenancePath), "utf8"),
  ) as BrandAssetProvenance;

  assert.equal(provenance.sourceMaster, "public/brand/maverenne-mark.svg");
  assert.match(provenance.sourceMethod ?? "", /deterministic.*sharp/i);
  assert.match(provenance.rightsStatus ?? "", /internal/i);

  for (const asset of provenance.assets ?? []) {
    assert.ok(asset.path, "each provenance entry must name its output path");
    assert.equal(asset.sha256, sha256(asset.path!), `${asset.path} SHA-256 must match its recorded bytes`);
    if (asset.path?.endsWith(".png")) {
      assert.deepEqual(
        pngDimensions(asset.path),
        { width: asset.width, height: asset.height },
        `${asset.path} provenance dimensions must match the PNG`,
      );
    }
  }
});

test("the brand generator is invariant to CRLF source checkouts", () => {
  const source = path.join(process.cwd(), "public/brand/maverenne-mark.svg");
  const generatedOutputs = [
    "public/brand/maverenne-mark.svg",
    "public/icon.svg",
    "public/apple-icon.png",
    "public/icon-192.png",
    "public/icon-512.png",
    "public/brand/maverenne-og-default.png",
    "src/app/favicon.ico",
    "public/brand/maverenne-brand-assets.provenance.json",
  ];
  const original = readFileSync(source);
  const runGenerator = () => execFileSync(process.execPath, ["scripts/generate-maverenne-brand-assets.mjs"], {
    cwd: process.cwd(),
    stdio: "pipe",
  });
  const hashes = () => Object.fromEntries(generatedOutputs.map((asset) => [asset, sha256(asset)]));

  runGenerator();
  const expected = hashes();
  try {
    writeFileSync(source, original.toString("utf8").replace(/\r?\n/g, "\r\n"));
    runGenerator();
    const provenance = JSON.parse(
      readFileSync(path.join(process.cwd(), "public/brand/maverenne-brand-assets.provenance.json"), "utf8"),
    ) as BrandAssetProvenance;
    const sourceEntry = provenance.assets?.find((asset) => asset.path === "public/brand/maverenne-mark.svg");
    assert.equal(sourceEntry?.sha256, sha256("public/brand/maverenne-mark.svg"));
    assert.deepEqual(hashes(), expected);
  } finally {
    writeFileSync(source, original);
    runGenerator();
  }
});
