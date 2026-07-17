import { expect, test } from "@playwright/test";

test.describe("storefront release flows", () => {
  for (const width of [320, 390]) {
    test(`homepage fits a ${width}px viewport`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
      await expect(
        page.getByRole("button", { name: "Open navigation menu" }),
      ).toBeVisible();
    });
  }

  test("homepage header moves from editorial overlay to solid navigation", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header[data-visual-state]");
    await expect(header).toHaveAttribute("data-visual-state", "overlay");
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await expect(header).toHaveAttribute("data-visual-state", "solid");
    await expect(page.getByRole("button", { name: "Shop menu" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Intention menu" })).toBeVisible();

    await page.goto("/about");
    await expect(page.locator("header[data-visual-state]")).toHaveAttribute(
      "data-visual-state",
      "solid",
    );
  });

  test("shop navigation links to real pearl product-type filters", async ({ page }) => {
    await page.goto("/");
    const shopMenu = page.getByRole("button", { name: "Shop menu" });
    await shopMenu.click();
    const earringsLink = page.getByRole("link", { name: "Pearl Earrings" }).first();
    await expect(earringsLink).toHaveAttribute(
      "href",
      "/collections/pearl-series?type=earrings",
    );
    await earringsLink.click();
    await expect(page).toHaveURL(/type=earrings/);
    await expect(page.locator('[data-product-type="earrings"]')).toHaveCount(12);
    await expect(page.locator('[data-product-type]:not([data-product-type="earrings"])')).toHaveCount(0);
  });

  test("desktop menus support keyboard close and focus return", async ({ page }) => {
    await page.goto("/");

    const shopMenu = page.getByRole("button", { name: "Shop menu" });
    await shopMenu.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("link", { name: "Pearl Earrings" }).first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#shop-menu")).toHaveCount(0);
    await expect(shopMenu).toBeFocused();

    await shopMenu.click();
    await expect(page.locator("#shop-menu")).toBeVisible();
    await page.mouse.click(5, 400);
    await expect(page.locator("#shop-menu")).toHaveCount(0);

    const intentionMenu = page.getByRole("button", { name: "Intention menu" });
    await intentionMenu.click();
    const guardianLink = page.getByRole("link", { name: "Find Your Guardian" });
    await expect(guardianLink).toBeVisible();
    await guardianLink.click();
    await expect(page).toHaveURL(/guardian-quiz/);
  });

  test("search, cart and mobile navigation restore keyboard focus", async ({ page }) => {
    await page.goto("/");

    const searchTrigger = page.getByRole("button", { name: "Search products" });
    await searchTrigger.click();
    const searchDialog = page.getByRole("dialog", { name: "Search products" });
    await expect(searchDialog).toBeVisible();
    await expect(searchDialog.getByRole("textbox")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(searchDialog).toHaveCount(0);
    await expect(searchTrigger).toBeFocused();

    const cartTrigger = page.getByRole("button", { name: /Shopping cart/ });
    await cartTrigger.click();
    const cartDialog = page.getByRole("dialog", { name: /Shopping cart/ });
    await expect(cartDialog.getByRole("button", { name: "Close cart" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(cartDialog).toHaveCount(0);
    await expect(cartTrigger).toBeFocused();

    await page.setViewportSize({ width: 390, height: 844 });
    const menuTrigger = page.getByRole("button", { name: "Open navigation menu" });
    await menuTrigger.click();
    const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(mobileNav).toBeVisible();
    await expect(page.getByRole("button", { name: "Close navigation menu" }).last()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(mobileNav).toHaveCount(0);
    await expect(menuTrigger).toBeFocused();
  });

  test("product gallery controls expose image positions", async ({ page }) => {
    await page.goto("/products/pearl-series-01");
    await expect(page.getByRole("button", { name: /Previous product image/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Next product image/ })).toBeVisible();
    const thumbnails = page.getByRole("button", { name: /View image \d+ of \d+/ });
    await expect(thumbnails).toHaveCount(3);
    await expect(thumbnails.first()).toHaveAttribute("aria-current", "true");
    await thumbnails.nth(1).click();
    await expect(thumbnails.nth(1)).toHaveAttribute("aria-current", "true");
  });

  test("footer exposes the customer policy routes", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    for (const [name, href] of [
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Shipping", "/shipping"],
      ["Refund Policy", "/refund"],
      ["FAQs", "/faq"],
    ] as const) {
      await expect(footer.getByRole("link", { name, exact: true })).toHaveAttribute(
        "href",
        href,
      );
    }
  });

  test("newsletter announces a successful subscription", async ({ page }) => {
    await page.route("**/api/newsletter", async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });
    await page.goto("/");
    const footer = page.locator("footer");
    await footer.getByPlaceholder("Your email address").fill("reader@example.com");
    await footer.getByRole("button", { name: "Subscribe" }).click();
    await expect(footer.getByText("You're on the list.")).toHaveAttribute(
      "aria-live",
      "polite",
    );
  });

  test("newsletter exposes subscription errors as alerts", async ({ page }) => {
    await page.route("**/api/newsletter", async (route) => {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({ error: "This address is already subscribed." }),
      });
    });
    await page.goto("/");
    const footer = page.locator("footer");
    await footer.getByPlaceholder("Your email address").fill("reader@example.com");
    await footer.getByRole("button", { name: "Subscribe" }).click();
    await expect(footer.getByRole("alert")).toHaveText(
      "This address is already subscribed.",
    );
  });
});
