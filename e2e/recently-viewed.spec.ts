import { expect, test } from "@playwright/test";

const RECENTLY_VIEWED_KEY = "mythrealms-recently-viewed";

test("recently viewed has no server-rendered content without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Recently Viewed" })).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test("recently viewed hydrates stored products without writing the storage key again", async ({ browser }) => {
  const context = await browser.newContext();
  await context.addInitScript((key) => {
    localStorage.setItem(key, JSON.stringify(["pearl-series-01", "pearl-series-02"]));
    const originalSetItem = Storage.prototype.setItem;
    let writes = 0;
    Storage.prototype.setItem = function trackedSetItem(name, value) {
      if (name === key) writes += 1;
      return originalSetItem.call(this, name, value);
    };
    Object.defineProperty(window, "__recentlyViewedWrites", { get: () => writes });
  }, RECENTLY_VIEWED_KEY);
  const page = await context.newPage();

  try {
    await page.goto("/");
    const section = page.getByRole("heading", { name: "Recently Viewed" }).locator("..").locator("..");
    await expect(section).toBeVisible();
    await expect(section.getByRole("link", { name: /The Calm Tide - Ring/ })).toHaveAttribute(
      "href",
      "/products/pearl-series-01",
    );
    await expect(section.getByRole("link", { name: /The Still Point - Ring/ })).toHaveAttribute(
      "href",
      "/products/pearl-series-02",
    );
    expect(await page.evaluate(() => (window as Window & { __recentlyViewedWrites: number }).__recentlyViewedWrites)).toBe(0);
  } finally {
    await context.close();
  }
});

test("recently viewed stays empty for missing and malformed storage", async ({ browser }) => {
  for (const storedValue of [null, "not json"]) {
    const context = await browser.newContext();
    await context.addInitScript(
      ({ key, value }) => {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      },
      { key: RECENTLY_VIEWED_KEY, value: storedValue },
    );
    const page = await context.newPage();

    try {
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Recently Viewed" })).toHaveCount(0);
    } finally {
      await context.close();
    }
  }
});
