import { expect, test, type Locator, type Page } from "@playwright/test";

import { BRAND } from "../src/lib/brand-identity";
import { HOMEPAGE_CATEGORY_LINKS } from "../src/lib/homepage-editorial";
import { HEADER_LINKS } from "../src/lib/storefront/navigation";

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

async function expectHeroContentWithinVisibleBounds(page: Page) {
  const hero = page.locator('[aria-labelledby="homepage-hero-title"]');
  const heroContent = [
    hero.getByText("Editorial / Summer 2026", { exact: true }),
    hero.getByRole("heading", { name: BRAND.heroTitle, exact: true }),
    hero.getByText(BRAND.heroDescription, { exact: true }),
    hero.getByRole("link", { name: BRAND.primaryCta.label, exact: true }),
    hero.getByRole("link", { name: BRAND.secondaryCta.label, exact: true }),
  ];

  for (const content of heroContent) {
    await expect(content).toBeVisible();
    const bounds = await content.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      const heroRect = node
        .closest('[aria-labelledby="homepage-hero-title"]')
        ?.getBoundingClientRect();

      if (!heroRect) {
        return { hasArea: false, insideHero: false, insideViewport: false };
      }

      const tolerance = 0.5;
      const visibleHeroTop = Math.max(heroRect.top, 0);
      const visibleHeroBottom = Math.min(heroRect.bottom, window.innerHeight);

      return {
        hasArea: rect.width > 0 && rect.height > 0,
        insideHero:
          rect.left >= heroRect.left - tolerance &&
          rect.right <= heroRect.right + tolerance &&
          rect.top >= visibleHeroTop - tolerance &&
          rect.bottom <= visibleHeroBottom + tolerance,
        insideViewport:
          rect.left >= -tolerance &&
          rect.right <= window.innerWidth + tolerance &&
          rect.top >= -tolerance &&
          rect.bottom <= window.innerHeight + tolerance,
      };
    });

    expect(bounds).toEqual({
      hasArea: true,
      insideHero: true,
      insideViewport: true,
    });
  }
}

test.describe("storefront release flows", () => {
  for (const { width, height } of [
    { width: 320, height: 800 },
    { width: 390, height: 844 },
  ]) {
    test(`homepage fits a ${width}px viewport`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expectHeroContentWithinVisibleBounds(page);
      await expectImagesLoaded(page.locator("#main-content img"));
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
      await expect(
        page.getByRole("button", { name: "Open navigation menu" }),
      ).toBeVisible();
    });
  }

  test("homepage shop by style links use approved pearl filters", async ({ page }) => {
    await page.goto("/");
    const categorySection = page.locator(
      'section[aria-labelledby="pearl-edit-categories-title"]',
    );
    await expect(
      categorySection.getByRole("heading", { name: "The Pearl Edit", exact: true }),
    ).toBeVisible();
    for (const { label, href } of HOMEPAGE_CATEGORY_LINKS) {
      await expect(
        categorySection.locator("a").filter({ hasText: label }).first(),
      ).toHaveAttribute("href", href);
    }
  });

  test("homepage promotes only the approved editorial destinations", async ({ page }) => {
    await page.goto("/");
    const guides = page.getByRole("region", { name: "Editorial guides" });

    await expect(guides.locator("article")).toHaveCount(2);
    await expect(guides.locator('a[href="/gifts"]')).not.toHaveCount(0);
    await expect(guides.locator('a[href="/pearls"]')).not.toHaveCount(0);
    await expect(guides.locator('a[href="/pearls/care"]')).not.toHaveCount(0);
    await expect(guides.locator('a[href="/pearls/how-to-wear"]')).not.toHaveCount(0);
  });

  test("homepage reveal motion resolves and reduced motion stays visible", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const categorySection = page.locator(
      'section[aria-labelledby="pearl-edit-categories-title"]',
    );
    await expect(categorySection).toHaveAttribute("data-reveal-ready", "true");
    await categorySection.scrollIntoViewIfNeeded();
    await expect(categorySection).toHaveAttribute("data-reveal-visible", "true");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await expect(categorySection).toHaveAttribute("data-reveal-visible", "true");
    await expect(
      categorySection.getByRole("heading", { name: "The Pearl Edit", exact: true }),
    ).toBeVisible();
  });

  test("homepage server-rendered content stays visible without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    try {
      await page.goto("/");
      const reveal = page.locator(
        'section[aria-labelledby="pearl-edit-categories-title"]',
      );
      await expect(reveal).toHaveAttribute("data-reveal-ready", "false");
      await expect(reveal).toHaveAttribute("data-reveal-visible", "true");
      await expect(
        reveal.getByRole("heading", { name: "The Pearl Edit", exact: true }),
      ).toBeVisible();
      await expect(
        reveal.locator("a").filter({ hasText: HOMEPAGE_CATEGORY_LINKS[0].label }).first(),
      ).toHaveAttribute("href", HOMEPAGE_CATEGORY_LINKS[0].href);
    } finally {
      await context.close();
    }
  });

  test("homepage header moves from editorial overlay to solid navigation", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header[data-visual-state]");
    await expect(header).toHaveAttribute("data-visual-state", "overlay");
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await expect(header).toHaveAttribute("data-visual-state", "solid");
    const mainNavigation = page.getByRole("navigation", { name: "Main navigation" });
    for (const link of HEADER_LINKS) {
      await expect(
        mainNavigation.getByRole("link", { name: link.label, exact: true }),
      ).toHaveAttribute("href", link.href);
    }

    await page.goto("/about");
    await expect(page.locator("header[data-visual-state]")).toHaveAttribute(
      "data-visual-state",
      "solid",
    );
  });

  test("category navigation links to real pearl product-type filters", async ({ page }) => {
    await page.goto("/");
    const categorySection = page.locator(
      'section[aria-labelledby="pearl-edit-categories-title"]',
    );
    const earringsLink = categorySection
      .locator("a")
      .filter({ hasText: "Pearl Earrings" })
      .first();
    await expect(earringsLink).toHaveAttribute(
      "href",
      "/collections/pearl-series?type=earrings",
    );
    await earringsLink.click();
    await expect(page).toHaveURL(/type=earrings/);
    await expect(page.locator('[data-product-type="earrings"]')).toHaveCount(12);
    await expect(page.locator('[data-product-type]:not([data-product-type="earrings"])')).toHaveCount(0);
  });

  test("product card media exposes neutral alternate views when supplied", async ({ page }) => {
    await page.goto("/collections/pearl-series");

    const newSeriesImages = page
      .locator('a[href="/products/new-series-round-shell-disc-drops"]')
      .locator("img");
    await expect(newSeriesImages).toHaveCount(1);
    await expectImagesLoaded(newSeriesImages);

    const editorialImages = page
      .locator('a[href="/products/pearl-series-01"]')
      .locator("img");
    await expect(editorialImages).toHaveCount(1);
    await expectImagesLoaded(editorialImages);
  });

  test("desktop direct header links navigate to approved routes", async ({ page }) => {
    for (const link of HEADER_LINKS) {
      await page.goto("/");
      const directLink = page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: link.label, exact: true });
      await expect(directLink).toHaveAttribute("href", link.href);
      await directLink.click();
      const path = link.href.split("?")[0].replaceAll("/", "\\/");
      await expect(page).toHaveURL(new RegExp(`${path}(?:\\?.*)?$`));
    }
  });

  test("desktop direct header links remain keyboard focusable", async ({ page }) => {
    await page.goto("/");
    const mainNavigation = page.getByRole("navigation", { name: "Main navigation" });
    const directLinks = HEADER_LINKS.map(({ label }) =>
      mainNavigation.getByRole("link", { name: label, exact: true }),
    );

    await directLinks[0].focus();
    for (let index = 0; index < directLinks.length; index += 1) {
      await expect(directLinks[index]).toBeFocused();
      if (index < directLinks.length - 1) await page.keyboard.press("Tab");
    }
  });

  test("mobile navigation reaches and navigates through its last link", async ({ page }) => {
    for (const viewport of [
      { width: 320, height: 800 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.getByRole("button", { name: "Open navigation menu" }).click();

      const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
      const mobileDialog = page.getByRole("dialog", { name: "Navigation menu" });
      const closeButton = mobileDialog.getByRole("button", { name: "Close navigation menu" });
      await expect(mobileNav).toBeVisible();
      for (const link of HEADER_LINKS) {
        await expect(
          mobileNav.getByRole("link", { name: link.label, exact: true }),
        ).toHaveAttribute("href", link.href);
      }

      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
      ).toBeLessThanOrEqual(0);

      const lastRoute = HEADER_LINKS.at(-1);
      if (!lastRoute) throw new Error("HEADER_LINKS must expose a final mobile route");
      const lastLink = mobileNav.getByRole("link", {
        name: lastRoute.label,
        exact: true,
      });
      await lastLink.scrollIntoViewIfNeeded();
      await expect(lastLink).toBeInViewport();
      await expect(closeButton).toBeInViewport();
      await lastLink.click();
      await expect(page).toHaveURL(new RegExp(`${lastRoute.href.replaceAll("/", "\\/")}$`));
    }
  });

  test("search, cart and mobile navigation restore keyboard focus", async ({ page }) => {
    await page.goto("/");

    const searchTrigger = page.getByRole("button", { name: "Search products" });
    await expect(searchTrigger).toHaveAttribute("title", "Search products");
    const searchBounds = await searchTrigger.boundingBox();
    expect(searchBounds?.width).toBeGreaterThanOrEqual(44);
    expect(searchBounds?.height).toBeGreaterThanOrEqual(44);
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
    await expect(thumbnails).toHaveCount(5);
    await expect(thumbnails.first()).toHaveAttribute("aria-current", "true");
    await thumbnails.nth(1).click();
    await expect(thumbnails.nth(1)).toHaveAttribute("aria-current", "true");
  });

  test("product pages link to pearl learning guides", async ({ page }) => {
    await page.goto("/products/pearl-series-01");
    const guides = page.getByRole("region", { name: "Learn about your pearls" });

    await expect(guides.getByRole("link", { name: "How to care for pearl jewelry" })).toHaveAttribute("href", "/pearls/care");
    await expect(guides.getByRole("link", { name: "How to wear pearls" })).toHaveAttribute("href", "/pearls/how-to-wear");
    await expect(guides.getByRole("link", { name: "What are freshwater pearls?" })).toHaveAttribute("href", "/pearls/freshwater-pearls");
    await expect(guides.getByRole("link", { name: "Shop pearl gifts" })).toHaveAttribute("href", "/gifts");
  });

  test("footer exposes the centralized discovery and policy routes", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    for (const [name, href] of [
      ["The Pearl Edit", "/collections/pearl-series"],
      ["New Arrivals", "/collections/new-arrivals"],
      ["Pearl Guide", "/pearls"],
      ["Pearl Care", "/pearls/care"],
      ["Our Story", "/about"],
      ["Contact", "/contact"],
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
    await expect(
      footer.getByRole("link", { name: "Find Your Guardian", exact: true }),
    ).toHaveCount(0);
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
