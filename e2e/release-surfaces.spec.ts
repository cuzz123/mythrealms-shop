import { expect, test, type Locator } from "@playwright/test";

async function expectImagesLoaded(images: Locator) {
  for (let index = 0; index < (await images.count()); index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (node) =>
            (node as HTMLImageElement).complete &&
            (node as HTMLImageElement).naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
}

test.describe("release surfaces", () => {
  test("guardian quiz resolves to three live pearl products", async ({ page }) => {
    await page.goto("/guardian-quiz");
    await page.getByRole("button", { name: "A fresh start after an ending." }).click();
    await page
      .getByRole("button", { name: "I can begin again before I feel ready." })
      .click();
    await page
      .getByRole("button", {
        name: "Pearl: calm water, moonlight, quiet strength.",
      })
      .click();

    await expect(page.getByRole("heading", { level: 1, name: "Phoenix" })).toBeVisible();
    await expect(page.locator('a[href^="/products/pearl-series-"]')).toHaveCount(3);
    await expect(page.getByRole("link", { name: /Shop The Pearl Edit/ })).toHaveAttribute(
      "href",
      "/collections/pearl-series",
    );
  });

  test("empty cart and checkout return customers to The Pearl Edit", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: "Your cart is waiting" })).toBeVisible();
    await expect(page.getByText(/hand-selected stones|Curated Singles/i)).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Browse The Pearl Edit" })).toHaveAttribute(
      "href",
      "/collections/pearl-series",
    );

    await page.goto("/checkout");
    await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Shop Now" })).toHaveAttribute(
      "href",
      "/collections/pearl-series",
    );
  });

  test("checkout offers only PayPal for a populated cart", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("cookie-consent", JSON.stringify({ necessary: true }));
    });
    await page.goto("/products/pearl-series-01");
    await page.getByRole("button", { name: /Add to Cart/ }).click();
    await page.goto("/checkout");
    await expect(page.getByText("PayPal", { exact: true })).toBeVisible();
    await expect(page.getByText("Card", { exact: true })).toHaveCount(0);
    await expect(page.getByText(/Afterpay|Klarna/)).toHaveCount(0);
  });

  test("unknown product pages and APIs return real 404 responses", async ({ page, request }) => {
    const pageResponse = await page.goto("/products/not-a-real-product");
    expect(pageResponse?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Page Not Found" })).toBeVisible();

    const apiResponse = await request.get("/api/products/not-a-real-product");
    expect(apiResponse.status()).toBe(404);
  });

  test("SEO machine surfaces expose the same 45 approved products", async ({ request }) => {
    const feed = await (await request.get("/api/feed")).text();
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const robots = await (await request.get("/robots.txt")).text();

    expect((feed.match(/<item>/g) || []).length).toBe(45);
    expect((sitemap.match(/\/products\//g) || []).length).toBe(45);
    expect(feed).not.toMatch(/crystal|gemstone|serenity|balance\s*&\s*light/i);
    expect(sitemap).not.toContain("/blog");
    expect(robots).toContain("Allow: /api/feed$");
  });

  test("about page uses loaded pearl imagery without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: "One clear collection, centered on pearls." }),
    ).toBeVisible();
    await expectImagesLoaded(page.locator("#main-content img"));
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
    ).toBeLessThanOrEqual(0);
  });

  test("editorial and utility surfaces stay truthful and use valid landmarks", async ({ page }) => {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await expect
        .poll(() =>
          page
            .getByText("Shop by Style", { exact: true })
            .evaluate((label) => {
              const rect = label.getBoundingClientRect();
              return Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
            }),
        )
        .toBeGreaterThan(0);
    }

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Pearls for sunlit days." })).toBeVisible();
    await expect(page.getByText("Editorial / Summer 2026", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Choose your starting point" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "A pearl point of view." })).toBeVisible();
    await page.waitForTimeout(5500);
    await expect(page.getByText(/Someone from|bought The /i)).toHaveCount(0);

    await page.getByRole("button", { name: "Search products" }).click();
    await expect(page.getByPlaceholder("Search pearl jewelry...")).toBeFocused();

    await page.goto("/about");
    await expect(page.locator("main")).toHaveCount(1);

    await page.goto("/loyalty");
    await expect(page).toHaveURL(/\/account$/);
  });

  test("approved new-series eyewear chains filter and render their source gallery", async ({ page }) => {
    await page.goto("/collections/pearl-series?type=eyewear-chains");
    await expect(page.locator('[data-product-type="eyewear-chains"]')).toHaveCount(4);
    await expect(
      page.locator("#main-content").getByText("4 styles", { exact: true }).first(),
    ).toBeVisible();

    await page.getByRole("link", { name: /The Pearl Line - Eyewear Chain/ }).first().click();
    await expect(page).toHaveURL(/\/products\/new-series-pearl-glasses-chain$/);
    await expect(page.getByRole("heading", { name: "The Pearl Line - Eyewear Chain" })).toBeVisible();
    await expect(page.getByRole("button", { name: /View image 1 of 5/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
    const galleryImages = page.locator('button[aria-label^="View image"] img');
    await expect(galleryImages).toHaveCount(5);
    await expectImagesLoaded(galleryImages);
  });
});
