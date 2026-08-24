import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

function source(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("public storefront chrome does not bootstrap an auth session", () => {
  const header = source("src/components/layout/Header.tsx");
  const layoutShell = source("src/components/layout/LayoutShell.tsx");

  assert.doesNotMatch(header, /next-auth\/react|\buseSession\b/);
  assert.match(header, /href="\/account"/);
  assert.match(header, /aria-label="My account"/);
  assert.match(header, /<User\b/);
  assert.doesNotMatch(layoutShell, /@\/app\/providers|\bProviders\b/);
});

test("account layout remains the auth provider boundary", () => {
  const accountLayout = source("src/app/account/layout.tsx");

  assert.match(accountLayout, /import \{ Providers \} from "@\/app\/providers"/);
  assert.match(accountLayout, /<Providers>\{children\}<\/Providers>/);
});
