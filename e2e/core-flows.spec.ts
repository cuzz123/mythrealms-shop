import { expect, test, type Locator, type Page } from "@playwright/test";

import { HEADER_MENUS } from "../src/lib/storefront/navigation";

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
    hero.getByRole("heading", { name: "Pearls for sunlit days." }),
    hero.getByText(
      "Pearl jewelry selected for natural light, everyday movement, and the moments worth keeping.",
      { exact: true },
    ),
    hero.getByRole("link", { name: "Shop the Pearl Edit" }),
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
    const styleRegion = page.getByRole("region", { name: "Choose your starting point" });
    await expect(styleRegion.getByRole("link", { name: "Everyday Pearl" })).toHaveAttribute("href", "/collections/pearl-series");
    await expect(styleRegion.getByRole("link", { name: "Pearl Earrings" })).toHaveAttribute("href", "/collections/pearl-series?type=earrings");
    await expect(styleRegion.getByRole("link", { name: "Pearl Necklaces" })).toHaveAttribute("href", "/collections/pearl-series?type=necklaces");
    await expect(styleRegion.getByRole("link", { name: "Pearl Bracelets" })).toHaveAttribute("href", "/collections/pearl-series?type=bracelets");
    await expect(styleRegion.getByRole("link", { name: "Pearl Eyewear Chains" })).toHaveAttribute("href", "/collections/pearl-series?type=eyewear-chains");
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
    const sections = page.locator("[data-reveal-ready]");
    await expect(sections.first()).toHaveAttribute("data-reveal-ready", "true");
    await sections.first().scrollIntoViewIfNeeded();
    await expect(sections.first()).toHaveAttribute("data-reveal-visible", "true");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await expect(sections.first()).toHaveAttribute("data-reveal-visible", "true");
    await expect(
      page.getByRole("heading", { name: "Choose your starting point" }),
    ).toBeVisible();
  });

  test("homepage server-rendered content stays visible without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    try {
      await page.goto("/");
      const reveal = page.locator('[aria-labelledby="shop-by-style-title"]');
      await expect(reveal).toHaveAttribute("data-reveal-ready", "false");
      await expect(reveal).toHaveAttribute("data-reveal-visible", "true");
      await expect(
        reveal.getByRole("heading", { name: "Choose your starting point" }),
      ).toBeVisible();
      await expect(reveal.getByRole("link", { name: "Everyday Pearl" })).toHaveAttribute(
        "href",
        "/collections/pearl-series",
      );
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
    await expect(page.getByRole("button", { name: "Shop menu" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Gifts menu" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Discover menu" })).toBeVisible();

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

  test("desktop Shop, Gifts, and Discover menus open and navigate", async ({ page }) => {
    for (const journey of [
      { trigger: "Shop menu", item: "New Arrivals", path: "/collections/new-arrivals" },
      { trigger: "Gifts menu", item: "All Gifts", path: "/gifts" },
      { trigger: "Discover menu", item: "Pearl Knowledge", path: "/pearls" },
    ]) {
      await page.goto("/");
      const trigger = page.getByRole("button", { name: journey.trigger });
      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");

      const item = page.getByRole("menuitem", { name: journey.item });
      await expect(item).toBeVisible();
      await expect(item).toHaveAttribute("href", journey.path);

      await page.locator("h1").click();
      await expect(item).toHaveCount(0);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");

      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(item).toBeVisible();
      await item.click();
      await expect(page).toHaveURL(new RegExp(`${journey.path.replaceAll("/", "\\/")}$`));
    }
  });

  test("desktop menu items return focus to their trigger on Escape", async ({ page }) => {
    for (const menu of [
      { triggerName: "Shop menu", menuId: "shop-menu", firstLink: "All Pearl Jewelry" },
      { triggerName: "Gifts menu", menuId: "gifts-menu", firstLink: "All Gifts" },
      { triggerName: "Discover menu", menuId: "discover-menu", firstLink: "Pearl Knowledge" },
    ]) {
      await page.goto("/");
      const trigger = page.getByRole("button", { name: menu.triggerName });
      const menuList = page.locator(`#${menu.menuId}`);

      await trigger.press("ArrowDown");
      await expect(menuList.getByRole("menuitem", { name: menu.firstLink })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(menuList).toHaveCount(0);
      await expect(trigger).toBeFocused();
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
      for (const menu of HEADER_MENUS) {
        await expect(mobileNav.getByText(menu.label, { exact: true })).toBeVisible();
        for (const link of menu.links) {
          await expect(mobileNav.getByRole("link", { name: link.label, exact: true })).toHaveAttribute(
            "href",
            link.href,
          );
        }
      }

      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
      ).toBeLessThanOrEqual(0);

      const lastMenu = HEADER_MENUS[HEADER_MENUS.length - 1];
      const lastRoute = lastMenu.links[lastMenu.links.length - 1];
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
    expect(searchBounds?.width).toBe(40);
    expect(searchBounds?.height).toBe(40);
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
      ["Find Your Guardian", "/guardian-quiz"],
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
