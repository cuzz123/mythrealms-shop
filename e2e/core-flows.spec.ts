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

  test("shop navigation links to real pearl product-type filters", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByText("Shop", { exact: true })
      .click();
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
});
