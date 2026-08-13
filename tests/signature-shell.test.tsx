import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

function source(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("mobile bottom navigation keeps safe-area spacing and presentation-only cart ownership", () => {
  const navigation = source("src/components/layout/MobileBottomNav.tsx");

  assert.match(navigation, /pb-\[calc\(env\(safe-area-inset-bottom\)\+0\.5rem\)\]/);
  assert.doesNotMatch(navigation, /\baddItem\b|\bprice\b|\binventory\b|\bcheckout\b/i);
});

test("search overlay remains a focused modal with an explicit close control", () => {
  const overlay = source("src/components/layout/SearchOverlay.tsx");

  assert.match(overlay, /role="dialog"/);
  assert.match(overlay, /aria-modal="true"/);
  assert.match(overlay, /useDialogFocus/);
  assert.match(overlay, /aria-label="Close search"/);
});

test("cart drawer preserves focus, cart updates, and routes without introducing shipping policy messaging", () => {
  const drawer = source("src/components/layout/CartDrawer.tsx");

  assert.match(drawer, /useDialogFocus/);
  assert.match(drawer, /updateQuantity/);
  assert.match(drawer, /removeItem/);
  assert.doesNotMatch(drawer, /FreeShippingProgress|free-shipping-progress|free shipping/i);
  assert.match(drawer, /href="\/cart"/);
  assert.match(drawer, /href="\/checkout"/);
});

test("header cart control keeps a 44px minimum mobile target", () => {
  const header = source("src/components/layout/Header.tsx");

  assert.match(
    header,
    /aria-label=\{`Shopping cart, \$\{itemCount\} items`\}[\s\S]*?className=\{`relative flex h-11 w-11/,
  );
});
