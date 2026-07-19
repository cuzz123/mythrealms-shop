import { expect, test, type APIRequestContext, type Locator, type Page } from "@playwright/test";

import {
  getRelatedGuideProducts,
  PEARL_GUIDES,
  PEARL_HUB_FAQ,
} from "../src/lib/editorial/guides";
import { getGiftSections, getNewArrivalProducts } from "../src/lib/editorial/gifts";
import { absoluteUrl } from "../src/lib/site";

async function expectImagesLoaded(images: Locator) {
  for (let index = 0; index < (await images.count()); index += 1) {
    await expect(async () => {
      const image = images.nth(index);
      await image.scrollIntoViewIfNeeded();
      expect(
        await image.evaluate(
          (node) =>
            (node as HTMLImageElement).complete &&
            (node as HTMLImageElement).naturalWidth > 0,
        ),
      ).toBe(true);
    }).toPass();
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

async function expectLayoutReady(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  const images = page.locator("#main-content img");
  if ((await images.count()) > 0) await expectImagesLoaded(images);
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
      const expectedProducts = getRelatedGuideProducts(guide);
      expect(expectedProducts.length).toBeGreaterThanOrEqual(4);
      expect(expectedProducts.length).toBeLessThanOrEqual(6);
      const productLinks = main.locator('a[href^="/products/"]');
      await expect(productLinks).toHaveCount(expectedProducts.length);
      const productHrefs = await productLinks.evaluateAll((links) =>
        links.map((link) => link.getAttribute("href")),
      );
      expect(productHrefs).toEqual(
        expectedProducts.map((product) => `/products/${product.slug}`),
      );
      expect(new Set(productHrefs).size).toBe(productHrefs.length);
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
      const expectedImageCount =
        1 +
        expectedProducts.reduce(
          (count, product) => count + 1 + Number(Boolean(product.imageRoles?.wearing)),
          0,
        );
      expect(expectedImageCount).toBeGreaterThan(0);
      const guideImages = main.locator("img");
      await expect(guideImages).toHaveCount(expectedImageCount);
      await expectImagesLoaded(guideImages);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    }
  });

  test("new editorial pages remain readable without JavaScript", async ({ browser }) => {
    test.setTimeout(120_000);
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();

    try {
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1, name: "Pearls for sunlit days." })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Choose your starting point" }).first()).toBeVisible();
      await expect(page.getByRole("link", { name: "Shop the Pearl Edit" })).toHaveAttribute(
        "href",
        "/collections/pearl-series",
      );
      await expect(page.getByRole("link", { name: "Read the Pearl Guide" })).toHaveAttribute(
        "href",
        "/pearls",
      );
      await expect(page.getByRole("region", { name: "Editorial guides" }).locator("article")).toHaveCount(2);
      expect(await page.locator("#main-content img").count()).toBeGreaterThan(0);

      await page.goto("/about");
      await expect(page.getByRole("heading", { level: 1, name: "Pearls, edited for real life." })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Product reference and editorial styling" })).toBeVisible();
      await expect(page.getByText(/some editorial images are digitally created/i)).toBeVisible();
      await expect(page.getByRole("heading", { name: "Find your way into the edit." })).toBeVisible();
      await expect(page.getByRole("link", { name: "Read the Pearl Guide" })).toHaveAttribute("href", "/pearls");
      await expect(page.getByRole("link", { name: "Explore Gifts" })).toHaveAttribute("href", "/gifts");
      expect(await page.locator("#main-content img").count()).toBeGreaterThanOrEqual(4);

      const giftSections = getGiftSections();
      await page.goto("/gifts");
      await expect(page.getByRole("heading", { level: 1, name: "Pearl gifts, chosen by how they will be worn." })).toBeVisible();
      await expect(page.getByRole("link", { name: "Browse gifts" })).toHaveAttribute("href", "#under-50");
      for (const section of giftSections) {
        await expect(page.getByRole("heading", { name: section.title, exact: true })).toBeVisible();
        await expect(page.locator(`#${section.id} a[href^="/products/"]`)).toHaveCount(
          section.products.length,
        );
      }
      await expect(
        page.locator("#main-content").getByRole("link", { name: "Pearl care", exact: true }),
      ).toHaveAttribute("href", "/pearls/care");
      expect(await page.locator("#main-content img").count()).toBeGreaterThan(0);

      const newArrivals = getNewArrivalProducts();
      await page.goto("/collections/new-arrivals");
      await expect(page.getByRole("heading", { level: 1, name: "New pearl arrivals." })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Recently added to the Pearl Edit" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Shop The Pearl Edit" })).toHaveAttribute(
        "href",
        "/collections/pearl-series",
      );
      const newArrivalLinks = page.locator(
        'section[aria-labelledby="related-products-title"] a[href^="/products/"]',
      );
      await expect(newArrivalLinks).toHaveCount(newArrivals.length);
      expect(await newArrivalLinks.evaluateAll((links) => links.map((link) => link.getAttribute("href")))).toEqual(
        newArrivals.map((product) => `/products/${product.slug}`),
      );
      expect(await page.locator("#main-content img").count()).toBeGreaterThan(0);

      await page.goto("/pearls");
      await expect(page.getByRole("heading", { level: 1, name: "Pearl knowledge for choosing, wearing, and caring." })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Read by the question in front of you." })).toBeVisible();
      await expect(page.getByRole("heading", { name: "General pearl questions" })).toBeVisible();
      for (const guide of Object.values(PEARL_GUIDES)) {
        await expect(page.locator(`a[href="/pearls/${guide.slug}"]`).first()).toBeVisible();
      }
      for (const item of PEARL_HUB_FAQ) {
        await expect(page.getByText(item.answer, { exact: true })).toBeVisible();
      }
      await expect(page.getByRole("link", { name: "Read all customer FAQs" })).toHaveAttribute("href", "/faq");
      expect(await page.locator("#main-content img").count()).toBeGreaterThan(0);

      for (const guide of Object.values(PEARL_GUIDES)) {
        await page.goto(`/pearls/${guide.slug}`);
        await expect(page.getByRole("heading", { level: 1, name: guide.title })).toBeVisible();
        await expect(page.getByText(guide.directAnswer, { exact: true })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Table of contents" })).toBeVisible();
        await expect(page.getByRole("heading", { name: guide.sections[0].heading })).toBeVisible();
        await expect(page.getByText(guide.faq[0].answer, { exact: true })).toBeVisible();
        await expect(page.locator('#main-content a[href^="https://"]')).toHaveCount(
          guide.sources.length,
        );
        const relatedProducts = getRelatedGuideProducts(guide);
        await expect(page.locator('#main-content a[href^="/products/"]')).toHaveCount(
          relatedProducts.length,
        );
        expect(await page.locator("#main-content img").count()).toBeGreaterThan(0);
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

    const renderedSectionAmounts: number[] = [];
    for (let index = 0; index < expectedProducts.length; index += 1) {
      const product = expectedProducts[index];
      expect(product.price, product.slug).toBeLessThan(50);
      const card = productLinks.nth(index).locator("..");
      await expect(card).toContainText(`$${product.price.toFixed(2)}`);
      const cardAmounts = await card.evaluate((node) =>
        [...(node.textContent?.matchAll(/\$([\d,]+(?:\.\d{2})?)/g) ?? [])].map((match) =>
          Number(match[1].replaceAll(",", "")),
        ),
      );
      expect(cardAmounts.length, product.slug).toBeGreaterThan(0);
      for (const amount of cardAmounts) expect(amount, product.slug).toBeLessThan(50);
      renderedSectionAmounts.push(...cardAmounts);
    }
    expect(renderedSectionAmounts.length).toBeGreaterThanOrEqual(expectedProducts.length);
    for (const amount of renderedSectionAmounts) {
      expect(amount, "under-50 product grid").toBeLessThan(50);
    }
  });

  test("mobile gift cards keep complete names and quick-add controls in separate action space", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/gifts");

    const expectedSections = getGiftSections();
    const renderedHrefs: (string | null)[] = [];
    let renderedCardCount = 0;

    for (const expectedSection of expectedSections) {
      const section = page.locator(`#${expectedSection.id}`);
      const productLinks = section.locator('a[href^="/products/"]');
      const quickAdds = section.locator(
        'button[aria-label^="Add "][aria-label$=" to cart"]',
      );
      await expect(productLinks).toHaveCount(expectedSection.products.length);
      await expect(quickAdds).toHaveCount(expectedSection.products.length);
      renderedHrefs.push(
        ...(await productLinks.evaluateAll((links) =>
          links.map((link) => link.getAttribute("href")),
        )),
      );
      renderedCardCount += await productLinks.count();

      for (let index = 0; index < expectedSection.products.length; index += 1) {
        const card = productLinks.nth(index).locator("..");
        const titles = card.locator("h3");
        const controls = card.locator(
          'button[aria-label^="Add "][aria-label$=" to cart"]',
        );
        await expect(titles).toHaveCount(1);
        await expect(controls).toHaveCount(1);
        await expect(controls).toBeVisible();

        const geometry = await card.evaluate((node) => {
          const title = node.querySelector("h3");
          const control = node.querySelector<HTMLButtonElement>(
            'button[aria-label^="Add "][aria-label$=" to cart"]',
          );
          const imageActionArea = node.querySelector(":scope > a > div");
          if (!title || !control || !imageActionArea) {
            throw new Error("Product card is missing title, quick-add, or image action area");
          }

          const cardRect = node.getBoundingClientRect();
          const imageRect = imageActionArea.getBoundingClientRect();
          const titleRect = title.getBoundingClientRect();
          const controlRect = control.getBoundingClientRect();
          const titleStyle = window.getComputedStyle(title);
          const controlStyle = window.getComputedStyle(control);
          const tolerance = 0.5;

          return {
            name: title.textContent?.trim() ?? "",
            titleHasArea: titleRect.width > 0 && titleRect.height > 0,
            controlVisible:
              controlRect.width > 0 &&
              controlRect.height > 0 &&
              controlStyle.display !== "none" &&
              controlStyle.visibility !== "hidden" &&
              Number(controlStyle.opacity) > 0,
            titleLineClamp: titleStyle.webkitLineClamp,
            titleOverflow: titleStyle.overflow,
            titleTruncated:
              title.scrollHeight > title.clientHeight + 1 ||
              title.scrollWidth > title.clientWidth + 1,
            controlInsideCard:
              controlRect.left >= cardRect.left - tolerance &&
              controlRect.right <= cardRect.right + tolerance &&
              controlRect.top >= cardRect.top - tolerance &&
              controlRect.bottom <= cardRect.bottom + tolerance,
            controlInsideImage:
              controlRect.left >= imageRect.left - tolerance &&
              controlRect.right <= imageRect.right + tolerance &&
              controlRect.top >= imageRect.top - tolerance &&
              controlRect.bottom <= imageRect.bottom + tolerance,
            overlaps:
              controlRect.left < titleRect.right &&
              controlRect.right > titleRect.left &&
              controlRect.top < titleRect.bottom &&
              controlRect.bottom > titleRect.top,
          };
        });

        expect(geometry.name.length, expectedSection.products[index].slug).toBeGreaterThan(0);
        expect(geometry.titleHasArea, geometry.name).toBe(true);
        expect(geometry.controlVisible, geometry.name).toBe(true);
        expect(geometry.titleLineClamp, geometry.name).toBe("none");
        expect(geometry.titleOverflow, geometry.name).not.toMatch(/hidden|clip/);
        expect(geometry.titleTruncated, geometry.name).toBe(false);
        expect(geometry.controlInsideCard, geometry.name).toBe(true);
        expect(geometry.controlInsideImage, geometry.name).toBe(true);
        expect(geometry.overlaps, geometry.name).toBe(false);
      }
    }

    const expectedProducts = expectedSections.flatMap((section) => section.products);
    expect(renderedCardCount).toBe(expectedProducts.length);
    expect(renderedHrefs).toEqual(
      expectedProducts.map((product) => `/products/${product.slug}`),
    );
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
      const routeHrefs = await internalHrefs(page);
      expect(routeHrefs.length, `${path} internal main-content links`).toBeGreaterThan(0);
      for (const href of routeHrefs) hrefs.add(href);
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
        await expectLayoutReady(page);
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
