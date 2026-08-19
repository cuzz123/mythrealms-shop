import { expect, test } from "@playwright/test";

const activeGuides = [
  ["/pearls/how-to-choose-pearl-earrings", "How to Choose Pearl Earrings"],
  ["/pearls/pearl-necklace-length-guide", "Pearl Necklace Length Guide"],
  ["/pearls/bracelet-size-and-fit-guide", "Pearl Bracelet Size and Fit Guide"],
] as const;

const heldGuides = [
  "/pearls/how-to-wear-pearl-hair-accessories",
  "/pearls/how-to-choose-a-glasses-chain",
  "/pearls/pearl-jewelry-buying-checklist",
] as const;

test("approved purchase guides expose canonical content and structured data", async ({ page }) => {
  for (const [path, heading] of activeGuides) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://www.maverenne.com${path}`,
    );

    const schemaTypes = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.map((script) => JSON.parse(script.textContent || "{}")["@type"]),
      );
    expect(schemaTypes).toEqual(
      expect.arrayContaining(["Article", "FAQPage", "BreadcrumbList"]),
    );
  }
});

test("held purchase guides remain unavailable", async ({ request }) => {
  for (const path of heldGuides) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

test("purchase guides fit mobile and desktop without horizontal overflow", async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    for (const [path] of activeGuides) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        ),
        `${path} at ${viewport.width}px`,
      ).toBeLessThanOrEqual(0);
    }
  }
});
