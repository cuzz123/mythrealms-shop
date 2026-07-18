import { expect, test, type APIRequestContext, type Locator, type Page } from "@playwright/test";

import { PEARL_GUIDES, PEARL_HUB_FAQ } from "../src/lib/editorial/guides";
import { getGiftSections, getNewArrivalProducts } from "../src/lib/editorial/gifts";
import { absoluteUrl } from "../src/lib/site";

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

async function internalHrefs(page: Page) {
  return page.locator('#main-content a[href^="/"]').evaluateAll((links) =>
    [...new Set(links.map((link) => link.getAttribute("href")))]
      .filter((href): href is string => Boolean(href))
      .map((href) => href.split("#")[0])
      .filter(Boolean),
  );
}

async function expectInternalLinksHealthy(request: APIRequestContext, hrefs: readonly string[]) {
  const responses = await Promise.all(
    hrefs.map(async (href) => ({ href, response: await request.get(href) })),
  );

  for (const { href, response } of responses) {
    expect(response.status(), href).toBeLessThan(400);
  }
}

async function expectNoHorizontalOverflow(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
  ).toBeLessThanOrEqual(0);
}

test.describe("release surfaces", () => {
  test("pearl knowledge hub renders its registry content on mobile and desktop", async ({ page }) => {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/pearls");
      await expect(page.getByRole("heading", { level: 1, name: "Pearl knowledge for choosing, wearing, and caring." })).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);
      for (const guide of Object.values(PEARL_GUIDES)) {
        await expect(page.getByRole("link", { name: new RegExp(guide.title, "i") }).first()).toHaveAttribute("href", `/pearls/${guide.slug}`);
      }
      for (const item of PEARL_HUB_FAQ) await expect(page.getByText(item.answer, { exact: true })).toBeVisible();
      await expect(page.getByRole("link", { name: "Read all customer FAQs" })).toHaveAttribute("href", "/faq");
      await expect(page.getByRole("link", { name: "Shop The Pearl Edit" }).first()).toHaveAttribute("href", "/collections/pearl-series");
      await expectImagesLoaded(page.locator("#main-content img"));
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    }
  });

  test("pearl guide routes expose visible editorial and machine-readable contracts", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const guide of Object.values(PEARL_GUIDES)) {
      const published = (guide as typeof guide & { published?: string }).published;
      await page.goto(`/pearls/${guide.slug}`);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1, name: guide.title })).toBeVisible();
      await expect(page.locator("#main-content").getByText(guide.directAnswer, { exact: true })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Table of contents" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Frequently asked questions" })).toBeVisible();
      for (const section of guide.sections) {
        await expect(page.getByRole("link", { name: section.heading }).first()).toHaveAttribute(
          "href",
          `#${section.id}`,
        );
        await expect(page.locator(`#${section.id}`)).toBeVisible();
      }
      for (const item of guide.faq) {
        await expect(page.getByText(item.question, { exact: true })).toBeVisible();
        await expect(page.getByText(item.answer, { exact: true })).toBeVisible();
      }
      const main = page.locator("#main-content");
      await expect(main.getByText("MythRealms Editorial", { exact: true })).toBeVisible();
      await expect(main.getByText("Published July 18, 2026", { exact: false })).toBeVisible();
      await expect(main.getByText("Updated July 18, 2026", { exact: false })).toBeVisible();
      const sourceLinks = main.locator('a[href^="https://"][rel~="noopener"][rel~="noreferrer"]');
      await expect(sourceLinks).toHaveCount(guide.sources.length);
      for (const source of guide.sources) {
        await expect(sourceLinks.filter({ hasText: source.label })).toHaveAttribute("href", source.href);
      }
      await expect(page.getByRole("heading", { name: "Related products" })).toBeVisible();
      const productHrefs = await page.locator('#main-content a[href^="/products/"]').evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute("href")))].filter(Boolean));
      expect(productHrefs.length).toBeGreaterThanOrEqual(4);
      expect(productHrefs.length).toBeLessThanOrEqual(6);
      const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent || "{}")));
      for (const type of ["Article", "BreadcrumbList", "FAQPage"]) expect(schemas.some((schema) => schema["@type"] === type)).toBe(true);
      const article = schemas.find((schema) => schema["@type"] === "Article");
      expect(article).toMatchObject({
        headline: guide.title,
        description: guide.directAnswer,
        image: absoluteUrl(guide.image.src),
        url: absoluteUrl(`/pearls/${guide.slug}`),
        datePublished: published,
        dateModified: guide.updated,
      });
      const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
      expect(
        faq.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }) => ({
          question: item.name,
          answer: item.acceptedAnswer.text,
        })),
      ).toEqual(guide.faq);
      await expectImagesLoaded(page.locator("#main-content img"));
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    }
  });

  test("new editorial pages remain readable without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();

    try {
      for (const route of [
        { path: "/", heading: "Pearls for sunlit days." },
        { path: "/about", heading: "Pearls, edited for real life." },
        { path: "/gifts", heading: "Pearl gifts, chosen by how they will be worn." },
        { path: "/collections/new-arrivals", heading: "New pearl arrivals." },
        { path: "/pearls", heading: "Pearl knowledge for choosing, wearing, and caring." },
        ...Object.values(PEARL_GUIDES).map((guide) => ({
          path: `/pearls/${guide.slug}`,
          heading: guide.title,
        })),
      ]) {
        await page.goto(route.path);
        await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
        await expect(page.locator("#main-content")).not.toBeEmpty();
      }
    } finally {
      await context.close();
    }
  });

  test("gift edit under $50 contains only matching current catalog products", async ({ page }) => {
    const expectedProducts = getGiftSections().find((section) => section.id === "under-50")!.products;
    await page.goto("/gifts#under-50");

    const section = page.locator("#under-50");
    await expect(section).toBeVisible();
    const productLinks = section.locator('a[href^="/products/"]');
    await expect(productLinks).toHaveCount(expectedProducts.length);
    expect(await productLinks.evaluateAll((links) => links.map((link) => link.getAttribute("href")))).toEqual(
      expectedProducts.map((product) => `/products/${product.slug}`),
    );

    for (let index = 0; index < expectedProducts.length; index += 1) {
      const product = expectedProducts[index];
      expect(product.price, product.slug).toBeLessThan(50);
      await expect(productLinks.nth(index)).toContainText(`$${product.price.toFixed(2)}`);
    }
  });

  test("mobile gift quick-add controls do not overlap product names", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/gifts");

    const controls = page.locator(
      '#under-50 button[aria-label^="Add "][aria-label$=" to cart"], ' +
        '#under-70 button[aria-label^="Add "][aria-label$=" to cart"], ' +
        '#everyday button[aria-label^="Add "][aria-label$=" to cart"], ' +
        '#statement button[aria-label^="Add "][aria-label$=" to cart"]',
    );
    expect(await controls.count()).toBeGreaterThan(0);

    for (let index = 0; index < (await controls.count()); index += 1) {
      const geometry = await controls.nth(index).evaluate((button) => {
        const title = button.parentElement?.querySelector("h3");
        if (!title) throw new Error("Product card is missing its name heading");

        const buttonRect = button.getBoundingClientRect();
        const titleRect = title.getBoundingClientRect();
        const buttonStyle = window.getComputedStyle(button);
        const visible =
          buttonRect.width > 0 &&
          buttonRect.height > 0 &&
          buttonStyle.display !== "none" &&
          buttonStyle.visibility !== "hidden" &&
          Number(buttonStyle.opacity) > 0;

        return {
          name: title.textContent?.trim() ?? "Unnamed product",
          visible,
          overlaps:
            buttonRect.left < titleRect.right &&
            buttonRect.right > titleRect.left &&
            buttonRect.top < titleRect.bottom &&
            buttonRect.bottom > titleRect.top,
          button: {
            left: buttonRect.left,
            right: buttonRect.right,
            top: buttonRect.top,
            bottom: buttonRect.bottom,
          },
          title: {
            left: titleRect.left,
            right: titleRect.right,
            top: titleRect.top,
            bottom: titleRect.bottom,
          },
        };
      });

      expect(geometry.visible, geometry.name).toBe(true);
      expect(geometry.overlaps, JSON.stringify(geometry)).toBe(false);
    }
  });

  test("new arrivals exactly match the catalog selector", async ({ page }) => {
    const expectedHrefs = getNewArrivalProducts().map((product) => `/products/${product.slug}`);
    await page.goto("/collections/new-arrivals");

    const products = page.locator('section[aria-labelledby="related-products-title"] a[href^="/products/"]');
    await expect(products).toHaveCount(expectedHrefs.length);
    expect(await products.evaluateAll((links) => links.map((link) => link.getAttribute("href")))).toEqual(
      expectedHrefs,
    );
  });

  test("Story, gift, and pearl journeys contain only healthy internal links", async ({ page, request }) => {
    test.setTimeout(120_000);
    const hrefs = new Set<string>();

    for (const path of [
      "/about",
      "/gifts",
      "/pearls",
      ...Object.values(PEARL_GUIDES).map((guide) => `/pearls/${guide.slug}`),
    ]) {
      await page.goto(path);
      for (const href of await internalHrefs(page)) hrefs.add(href);
    }

    await expectInternalLinksHealthy(request, [...hrefs]);
  });

  for (const viewport of [
    { width: 320, height: 800 },
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    test(`new editorial pages fit ${viewport.width}x${viewport.height} without horizontal overflow`, async ({ page }) => {
      test.setTimeout(120_000);
      await page.setViewportSize(viewport);

      for (const path of [
        "/",
        "/about",
        "/gifts",
        "/collections/new-arrivals",
        "/pearls",
        ...Object.values(PEARL_GUIDES).map((guide) => `/pearls/${guide.slug}`),
      ]) {
        await page.goto(path);
        await expect(page.locator("#main-content")).toBeVisible();
        await expectNoHorizontalOverflow(page);
      }
    });
  }

  test("homepage preserves the approved editorial sequence and first-viewport style hint", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const expectedHeadings = [
      "Pearls for sunlit days.",
      "Choose your starting point",
      "Pieces for everyday light.",
      "A little light, close to home.",
      "A pearl point of view.",
      "Notes from the coast.",
    ];
    const positions: number[] = [];

    for (const name of expectedHeadings) {
      const heading = page.getByRole("heading", { name, exact: true }).first();
      await expect(heading).toBeVisible();
      positions.push(await heading.evaluate((node) => node.getBoundingClientRect().top));
    }

    expect(positions).toEqual([...positions].sort((left, right) => left - right));
    await expect
      .poll(() =>
        page
          .getByRole("heading", { name: "Choose your starting point", exact: true })
          .evaluate((heading) => {
          const rect = heading.getBoundingClientRect();
          return Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        }),
      )
      .toBeGreaterThanOrEqual(24);
  });

  test("homepage keeps canonical metadata, organization data, and the Pearl Guide without retired claims", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("MythRealms | Pearl Jewelry for Everyday Light");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://mythrealms-shop.vercel.app",
    );
    await expect(page.getByRole("link", { name: "Read the Pearl Guide" })).toHaveAttribute(
      "href",
      "/pearls",
    );

    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts.map((script) => JSON.parse(script.textContent || "{}")),
    );
    expect(schemas.some((schema) => Array.isArray(schema["@type"]) && schema["@type"].includes("Organization"))).toBe(true);
    expect(schemas.some((schema) => schema["@type"] === "WebSite")).toBe(true);

    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/Balance\s*&\s*Light/i);
    expect(text).not.toMatch(/hand-selected stones|Curated Singles/i);
  });

  test("collection and product surfaces keep solid headers and truthful image roles", async ({ page }) => {
    await page.goto("/collections/pearl-series");
    await expect(page.locator("header[data-visual-state]")).toHaveAttribute("data-visual-state", "solid");

    const newSeriesImages = page
      .locator('a[href="/products/new-series-round-shell-disc-drops"]')
      .locator("img");
    await expect(newSeriesImages).toHaveCount(1);
    await expectImagesLoaded(newSeriesImages);

    const sourcePreservedImages = page
      .locator('a[href="/products/pearl-series-01"]')
      .locator("img");
    await expect(sourcePreservedImages).toHaveCount(2);
    await expectImagesLoaded(sourcePreservedImages);

    await page.goto("/products/pearl-series-01");
    await expect(page.locator("header[data-visual-state]")).toHaveAttribute("data-visual-state", "solid");
    await expectImagesLoaded(page.locator("#main-content img"));
  });

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

  test("Story about page shows its disclosure and loaded imagery without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: "Pearls, edited for real life." }),
    ).toBeVisible();
    await expect(page.getByText(/some editorial images are digitally created/i)).toBeVisible();
    const images = page.locator("#main-content img");
    expect(await images.count()).toBeGreaterThanOrEqual(4);
    await expectImagesLoaded(images);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
    ).toBeLessThanOrEqual(0);
  });

  test("Story route issues a permanent redirect to about", async ({ page, request }) => {
    const response = await request.get("/story", { maxRedirects: 0 });

    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe("/about");

    await page.goto("/story");
    await expect(page).toHaveURL(/\/about$/);
    await expect(
      page.getByRole("heading", { name: "Pearls, edited for real life." }),
    ).toBeVisible();
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
