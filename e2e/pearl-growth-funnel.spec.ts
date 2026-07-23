import { expect, test } from "@playwright/test";

test.describe("pearl growth funnel", () => {
  test("mobile sticky add appears after the primary purchase control leaves view and uses the cart flow", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "cookie-consent",
        JSON.stringify({ necessary: true, analytics: false, marketing: false }),
      );
      localStorage.setItem("mythrealms:first-order-invitation-dismissed-at", String(Date.now()));
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/products/pearl-series-01");

    const primaryAdd = page.getByTestId("primary-add-to-cart");
    const stickyAdd = page.getByTestId("sticky-add-to-cart");
    await expect(primaryAdd).toBeVisible();
    await expect(stickyAdd).toBeHidden();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(stickyAdd).toBeVisible();
    await stickyAdd.getByRole("button", { name: /add .* to cart/i }).click();
    await expect(page.getByRole("dialog", { name: /shopping cart/i })).toBeVisible();
  });

  test("desktop does not render the mobile sticky add control", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/products/pearl-series-01");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByTestId("sticky-add-to-cart")).toBeHidden();
  });

  test("growth entry routes remain reachable", async ({ page }) => {
    for (const path of ["/", "/edits/everyday-light", "/gifts", "/pearls/care", "/pearls/symbolism"]) {
      await page.goto(path);
      await expect(page.locator("#main-content")).toBeVisible();
    }
  });

  test("first-order invitation closes with Escape after an engaged visit", async ({ browser }) => {
    const context = await browser.newContext();
    await context.addInitScript(() => {
      localStorage.setItem(
        "cookie-consent",
        JSON.stringify({ necessary: true, analytics: false, marketing: false }),
      );
      localStorage.removeItem("mythrealms:first-order-invitation-dismissed-at");
      sessionStorage.removeItem("mythrealms:first-order-invitation-shown");
      const nativeSetTimeout = window.setTimeout.bind(window);
      window.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) =>
        timeout === 20_000 ? nativeSetTimeout(handler, 0, ...args) : nativeSetTimeout(handler, timeout, ...args)) as typeof window.setTimeout;
    });
    const page = await context.newPage();
    try {
      await page.goto("/");
      await page.waitForTimeout(150);
      await page.evaluate(() => window.dispatchEvent(new Event("scroll")));

      const invitation = page.getByRole("dialog", { name: /notes from the coast/i });
      await expect(invitation).toBeVisible();
      await expect(page.getByLabel("Email address")).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(invitation).toBeHidden();
    } finally {
      await context.close();
    }
  });
});
