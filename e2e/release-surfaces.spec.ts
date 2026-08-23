import { expect, test, type APIRequestContext, type Locator, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { BRAND } from "../src/lib/brand-identity";
import {
  getRelatedGuideProducts,
  PEARL_GUIDES,
  PEARL_HUB_FAQ,
} from "../src/lib/editorial/guides";
import { getNewArrivalProducts } from "../src/lib/editorial/gifts";
import { absoluteUrl } from "../src/lib/site";
import { getStorefrontProducts } from "../src/lib/storefront/catalog";

const STOREFRONT_PRODUCT_COUNT = getStorefrontProducts().length;

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
  const visibleIndexes = await images.evaluateAll((nodes) =>
    nodes.flatMap((node, index) => {
      const rect = node.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight ? [index] : [];
    }),
  );
  for (const index of visibleIndexes) await expectImagesLoaded(images.nth(index));
}

async function expectNoHorizontalOverflow(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
  ).toBeLessThanOrEqual(0);
}

async function expectSparseAbout(page: Page) {
  const main = page.locator("#main-content");
  await expect(main.getByRole("heading", { level: 1, name: "About Maverenne" })).toBeVisible();
  await expect(
    main.getByText(
      "Thoughtful jewelry and accessories for everyday moments that feel like your own.",
      { exact: true },
    ),
  ).toBeVisible();

  const internalLinks = main.locator('a[href^="/"]');
  await expect(internalLinks).toHaveCount(2);
  await expect(main.getByRole("link", { name: "Explore the Pearl Series" })).toHaveAttribute(
    "href",
    "/collections/pearl-series",
  );
  await expect(main.getByRole("link", { name: "Read the Pearl Guide" })).toHaveAttribute(
    "href",
    "/pearls",
  );
  await expect(main.locator("img")).toHaveCount(0);
}

async function expectReviewedPearlCareRoute(
  page: Page,
  request: APIRequestContext,
) {
  const main = page.locator("#main-content");
  const heading = page.getByRole("heading", {
    level: 1,
    name: "How to Care for Pearls",
  });
  const lead = main.locator("article h1 + p");
  const canonical = absoluteUrl("/pearls/care");

  await expect(page.locator("h1")).toHaveCount(1);
  await expect(heading).toBeVisible();
  await expect(lead).toBeVisible();

  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => JSON.parse(script.textContent || "{}")),
    );
  const article = schemas.find((schema) => schema["@type"] === "Article");
  const breadcrumb = schemas.find((schema) => schema["@type"] === "BreadcrumbList");
  const faq = schemas.find((schema) => schema["@type"] === "FAQPage");

  expect(article).toBeDefined();
  expect(article).toMatchObject({
    url: canonical,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  });
  expect(article.datePublished).toBeUndefined();
  expect(article.dateModified).toBeUndefined();
  expect(article.author).toBeUndefined();
  expect(article.image).toBeUndefined();

  const visibleHeading = (await heading.textContent())?.trim();
  const leadDescription = article.description;
  expect(visibleHeading).toBe("How to Care for Pearls");
  expect(article.headline).toBe(visibleHeading);
  expect(leadDescription).toEqual(expect.any(String));
  await expect(lead).toHaveText(leadDescription as string);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);

  const visibleBreadcrumbs = await page
    .getByRole("navigation", { name: "Breadcrumb" })
    .locator('a, [aria-current="page"]')
    .evaluateAll((items) =>
      items.map((item) => ({
        name: item.textContent?.trim(),
        path:
          item instanceof HTMLAnchorElement
            ? new URL(item.href).pathname
            : window.location.pathname,
      })),
    );
  expect(visibleBreadcrumbs.at(-1)).toEqual({
    name: "How to Care for Pearls",
    path: "/pearls/care",
  });
  expect(breadcrumb).toBeDefined();
  expect(
    breadcrumb.itemListElement.map(
      (item: { position: number; name: string; item: string }) => ({
        position: item.position,
        name: item.name,
        path: new URL(item.item).pathname,
      }),
    ),
  ).toEqual(
    visibleBreadcrumbs.map((item, index) => ({ position: index + 1, ...item })),
  );

  const visibleFaq = await main.locator("dl dt").evaluateAll((questions) =>
    questions.map((question) => ({
      question: question.textContent?.trim() ?? "",
      answer: question.parentElement?.querySelector("dd")?.textContent?.trim() ?? "",
    })),
  );
  expect(visibleFaq.length).toBeGreaterThan(0);
  expect(faq).toBeDefined();
  expect(
    faq.mainEntity.map(
      (item: { name: string; acceptedAnswer: { text: string } }) => ({
        question: item.name,
        answer: item.acceptedAnswer.text,
      }),
    ),
  ).toEqual(visibleFaq);

  for (const name of [
    "Frequently asked questions",
    "Continue the pearl guide",
    "Sources",
  ]) {
    await expect(main.getByRole("heading", { name, exact: true })).toBeVisible();
  }
  await expect(main.getByRole("heading", { name: "Table of contents" })).toHaveCount(0);
  await expect(main.getByRole("heading", { name: "Related products" })).toHaveCount(0);
  await expect(main.locator('a[href^="/products/"]')).toHaveCount(0);
  await expect(main.locator("img")).toHaveCount(0);
  await expect(main.getByText(`${BRAND.name} Editorial`, { exact: true })).toHaveCount(0);
  await expect(main.getByText(/^Published /)).toHaveCount(0);
  await expect(main.getByText(/^Updated /)).toHaveCount(0);

  const sourceLinks = main.locator('a[href^="https://"]');
  await expect(sourceLinks).toHaveCount(2);
  for (let index = 0; index < (await sourceLinks.count()); index += 1) {
    await expect(sourceLinks.nth(index)).toHaveAttribute("rel", "noopener noreferrer");
  }

  const hrefs = await internalHrefs(page);
  expect(hrefs).toEqual(
    expect.arrayContaining([
      "/",
      "/pearls",
      "/contact",
      "/pearls/how-to-wear",
      "/pearls/freshwater-pearls",
    ]),
  );
  await expectInternalLinksHealthy(request, hrefs);
  await expectNoHorizontalOverflow(page);
}

function parseRenderedCurrency(text: string) {
  const markerIndexes = [...text.matchAll(/\$/g)].map((match) => match.index);
  const tokens = markerIndexes.flatMap((index) => {
    const match = text
      .slice(index)
      .match(/^\$(?:0|[1-9]\d*)\.\d{2}(?=$|\s)/);
    return match ? [match[0]] : [];
  });

  return {
    markerCount: markerIndexes.length,
    tokens,
    amounts: tokens.map((token) => Number(token.slice(1))),
  };
}

function expectStrictlyParsedAmountsUnder50(text: string, label: string) {
  const parsed = parseRenderedCurrency(text);
  expect(parsed.markerCount, `${label}: dollar markers`).toBeGreaterThan(0);
  expect(parsed.tokens, `${label}: exact currency tokens`).toHaveLength(parsed.markerCount);
  expect(parsed.amounts, `${label}: parsed amounts`).toHaveLength(parsed.markerCount);
  for (const amount of parsed.amounts) expect(amount, label).toBeLessThan(50);
}

test.describe("release surfaces", () => {
  test("public navigation presents the Maverenne home link without Guardian", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Maverenne home" })).toBeVisible();
    const storefrontChrome = page.locator("[data-storefront-chrome]");
    await expect(storefrontChrome.getByRole("link", { name: "Find Your Guardian" })).toHaveCount(0);
    await expect(storefrontChrome.getByText("Find Your Guardian", { exact: true })).toHaveCount(0);
  });

  test("rendered currency parser requires safe terminal boundaries", () => {
    const currentCardText =
      "The Calm Tide - Ring\n$29.99\t$39.99\nSave $10.00\nPRODUCT VIEW";
    expect(parseRenderedCurrency(currentCardText)).toEqual({
      markerCount: 3,
      tokens: ["$29.99", "$39.99", "$10.00"],
      amounts: [29.99, 39.99, 10],
    });
    expect(() =>
      expectStrictlyParsedAmountsUnder50(currentCardText, "current card separators"),
    ).not.toThrow();

    for (const malformed of ["$49.99USD", "$49.99e3"]) {
      expect(parseRenderedCurrency(malformed), malformed).toEqual({
        markerCount: 1,
        tokens: [],
        amounts: [],
      });
      expect(
        () => expectStrictlyParsedAmountsUnder50(malformed, malformed),
        malformed,
      ).toThrow();
    }

    const mixedText = "$29.99\n$49.99USD";
    expect(parseRenderedCurrency(mixedText)).toEqual({
      markerCount: 2,
      tokens: ["$29.99"],
      amounts: [29.99],
    });
    expect(() => expectStrictlyParsedAmountsUnder50(mixedText, "mixed markers")).toThrow();
  });

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

  test("pearl guide routes expose visible editorial and machine-readable contracts", async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const guide of Object.values(PEARL_GUIDES)) {
      const published = (guide as typeof guide & { published?: string }).published;
      await page.goto(`/pearls/${guide.slug}`);
      if (guide.slug === "care") {
        await expectReviewedPearlCareRoute(page, request);
        continue;
      }
      await expect(page.locator("h1")).toHaveCount(1);
      const expectedHeading = guide.slug === "care" ? "How to Care for Pearls" : guide.title;
      await expect(page.getByRole("heading", { level: 1, name: expectedHeading })).toBeVisible();
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
      await expect(main.getByText(`${BRAND.name} Editorial`, { exact: true })).toBeVisible();
      await expect(main.getByText("Published July 18, 2026", { exact: false })).toBeVisible();
      const updatedLabel = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${guide.updated}T00:00:00Z`));
      await expect(main.getByText(`Updated ${updatedLabel}`, { exact: false })).toBeVisible();
      const sourceLinks = main.locator('a[href^="https://"][rel~="noopener"][rel~="noreferrer"]');
      await expect(sourceLinks).toHaveCount(guide.sources.length);
      for (const source of guide.sources) {
        await expect(sourceLinks.filter({ hasText: source.label })).toHaveAttribute("href", source.href);
      }
      const productLinks = main.locator('a[href^="/products/"]');
      const expectedProducts =
        guide.slug === "freshwater-pearls" ? getRelatedGuideProducts(guide) : [];
      if (expectedProducts.length > 0) {
        await expect(page.getByRole("heading", { name: "Related products" })).toBeVisible();
        expect(expectedProducts.length).toBeGreaterThanOrEqual(4);
        expect(expectedProducts.length).toBeLessThanOrEqual(6);
        await expect(productLinks).toHaveCount(expectedProducts.length);
        const productHrefs = await productLinks.evaluateAll((links) =>
          links.map((link) => link.getAttribute("href")),
        );
        expect(productHrefs).toEqual(
          expectedProducts.map((product) => `/products/${product.slug}`),
        );
        expect(new Set(productHrefs).size).toBe(productHrefs.length);
      } else {
        await expect(page.getByRole("heading", { name: "Related products" })).toHaveCount(0);
        await expect(productLinks).toHaveCount(0);
      }
      const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent || "{}")));
      for (const type of ["Article", "BreadcrumbList", "FAQPage"]) expect(schemas.some((schema) => schema["@type"] === type)).toBe(true);
      const visibleBreadcrumbs = await page
        .getByRole("navigation", { name: "Breadcrumb" })
        .locator('a, [aria-current="page"]')
        .evaluateAll((items) =>
          items.map((item) => ({
            name: item.textContent?.trim(),
            path:
              item instanceof HTMLAnchorElement
                ? new URL(item.href).pathname
                : window.location.pathname,
          })),
        );
      const breadcrumb = schemas.find((schema) => schema["@type"] === "BreadcrumbList");
      expect(
        breadcrumb.itemListElement.map(
          (item: { position: number; name: string; item: string }) => ({
            position: item.position,
            name: item.name,
            path: new URL(item.item).pathname,
          }),
        ),
      ).toEqual(
        visibleBreadcrumbs.map((item, index) => ({ position: index + 1, ...item })),
      );
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
          (count, product) => count + 1 + Number(Boolean(product.imageRoles?.alternate)),
          0,
        );
      expect(expectedImageCount).toBeGreaterThan(0);
      const guideImages = main.locator("img");
      await expect(guideImages).toHaveCount(expectedImageCount);
      await expectImagesLoaded(guideImages);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    }
  });

  test("public editorial shell server-renders without JavaScript or a global skeleton", async ({ browser, request }) => {
    test.setTimeout(120_000);
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();

    try {
      await page.goto("/");
      await expect(page.locator('[data-storefront-chrome="header"]')).toBeVisible();
      await expect(page.locator('[data-storefront-chrome="footer"]')).toBeVisible();
      await expect(page.getByRole("heading", { level: 1, name: "A little something for yourself." })).toBeVisible();
      await expect(page.getByRole("heading", { name: "The Pearl Edit" }).first()).toBeVisible();
      await expect(page.getByRole("link", { name: "Find Your Piece" })).toHaveAttribute(
        "href",
        "/collections/pearl-series",
      );
      await expect(page.getByRole("link", { name: "Shop the Pearl Edit" })).toHaveAttribute(
        "href",
        "/collections/pearl-series",
      );
      await expect(page.getByRole("link", { name: "Read the guide" })).toHaveAttribute(
        "href",
        "/pearls",
      );
      expect(await page.locator("#main-content img").count()).toBeGreaterThan(0);

      await page.goto("/about");
      await expectSparseAbout(page);

      await page.goto("/gifts");
      await expect(page.getByRole("heading", { level: 1, name: "A Pearl Jewelry Gift Guide for Everyday Giving" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Read the gift checklist" })).toHaveAttribute("href", "#gift-method");
      await expect(page.getByRole("link", { name: "Browse the catalog" })).toHaveAttribute("href", "/collections/pearl-series");
      await expect(page.getByRole("heading", { name: "Check the facts before you choose." })).toBeVisible();
      await expect(page.locator('#main-content a[href^="/products/"]')).toHaveCount(0);
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
        if (guide.slug === "care") {
          await expectReviewedPearlCareRoute(page, request);
          continue;
        }
        const expectedHeading = guide.slug === "care" ? "How to Care for Pearls" : guide.title;
        await expect(page.getByRole("heading", { level: 1, name: expectedHeading })).toBeVisible();
        await expect(page.getByText(guide.directAnswer, { exact: true })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Table of contents" })).toBeVisible();
        await expect(page.getByRole("heading", { name: guide.sections[0].heading })).toBeVisible();
        await expect(page.getByText(guide.faq[0].answer, { exact: true })).toBeVisible();
        await expect(page.locator('#main-content a[href^="https://"]')).toHaveCount(
          guide.sources.length,
        );
        const relatedProducts =
          guide.slug === "freshwater-pearls" ? getRelatedGuideProducts(guide) : [];
        await expect(page.locator('#main-content a[href^="/products/"]')).toHaveCount(
          relatedProducts.length,
        );
        expect(await page.locator("#main-content img").count()).toBeGreaterThan(0);
      }
    } finally {
      await context.close();
    }
  });

  test("studio renders its own provider boundary and suppresses storefront chrome", async ({ page }) => {
    await page.goto("/studio");

    await expect(page.locator("[data-studio-shell]")).toBeAttached();
    await expect(page.getByRole("heading", { level: 1, name: "MythRealms Studio" })).toBeVisible();
    await expect(page.locator("#react-flow-wrapper")).toBeVisible();
    await expect(page.locator("[data-storefront-chrome]")).toHaveCount(2);
    for (const chrome of await page.locator("[data-storefront-chrome]").all()) {
      await expect(chrome).toBeHidden();
    }
    await expect(page.locator("#main-content")).toHaveCSS("padding-bottom", "0px");
  });

  test("gift guide avoids unverified price and product merchandising", async ({ page }) => {
    await page.goto("/gifts");

    const main = page.locator("#main-content");
    await expect(main.locator('a[href^="/products/"]')).toHaveCount(0);
    await expect(main.locator('button[aria-label^="Add "][aria-label$=" to cart"]')).toHaveCount(0);
    await expect(main.getByText("Under $50", { exact: true })).toHaveCount(0);
    await expect(main.getByText("Under $70", { exact: true })).toHaveCount(0);
    await expect(main.getByRole("link", { name: "Shipping" })).toHaveAttribute("href", "/shipping");
    await expect(main.getByRole("link", { name: "Returns" })).toHaveAttribute("href", "/refund");
    await expect(main.getByRole("link", { name: "Styling guide" })).toHaveAttribute("href", "/pearls/how-to-wear");
    await expect(main.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  });

  test("mobile gift guide keeps its checklist and help links readable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/gifts");

    await expect(page.locator("#gift-method")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Gift guide help" })).toBeVisible();
    await expect(page.locator('#main-content a[href^="/products/"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
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

  test("homepage renders the Maverenne signature section sequence without Guardian", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const expectedMarkers = [
      "homepage-signature-hero",
      "homepage-category-index",
      "homepage-editorial-diptych",
      "homepage-primary-edit",
      "homepage-story-band",
      "homepage-editorial-links",
      "homepage-secondary-edit",
      "homepage-newsletter-letter",
    ];
    const positions: number[] = [];

    for (const marker of expectedMarkers) {
      const section = page.locator(`[data-homepage-section="${marker}"]`);
      await expect(section).toHaveCount(1);
      positions.push(await section.evaluate((node) => node.getBoundingClientRect().top));
    }

    expect(positions).toEqual([...positions].sort((left, right) => left - right));
    await expect(page.locator("h1")).toHaveCount(1);
    await expectNoHorizontalOverflow(page);

    await expect(page.getByRole("link", { name: "Find Your Piece" })).toHaveAttribute(
      "href",
      "/collections/pearl-series",
    );
    await expect(page.getByRole("link", { name: "Shop the Pearl Edit" }).first()).toHaveAttribute(
      "href",
      "/collections/pearl-series",
    );
    await expect(page.getByRole("link", { name: "Explore new arrivals" })).toHaveAttribute(
      "href",
      "/collections/new-arrivals",
    );
    await expect(page.locator('a[href="/guardian-quiz"]')).toHaveCount(0);
    await expect(page.getByText(/Guardian/i)).toHaveCount(0);
  });

  test("homepage keeps its marker sequence in DOM and visual order on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const markers = page.locator("[data-homepage-section]");
    await expect(markers).toHaveCount(8);
    expect(await markers.evaluateAll((sections) =>
      sections.map((section) => section.getAttribute("data-homepage-section")),
    )).toEqual([
      "homepage-signature-hero",
      "homepage-category-index",
      "homepage-editorial-diptych",
      "homepage-primary-edit",
      "homepage-story-band",
      "homepage-editorial-links",
      "homepage-secondary-edit",
      "homepage-newsletter-letter",
    ]);

    const topOffsets = await markers.evaluateAll((sections) =>
      sections.map((section) => section.getBoundingClientRect().top),
    );
    expect(topOffsets).toEqual([...topOffsets].sort((left, right) => left - right));

    const diptych = page.locator('[data-homepage-section="homepage-editorial-diptych"]');
    expect(await diptych.evaluate((section) => {
      const [layout] = Array.from(section.children);
      const [primary, content] = Array.from(layout.children);
      const [text, detail, action] = Array.from(content.children);
      return {
        primary: primary.querySelector("img")?.tagName,
        heading: text.querySelector("h2")?.textContent,
        detail: detail.querySelector("img")?.tagName,
        href: action.getAttribute("href"),
      };
    })).toEqual({
      primary: "IMG",
      heading: "Shop by moment",
      detail: "IMG",
      href: "/collections/new-arrivals",
    });
  });

  test("homepage moment route definitions retain their approved destinations", () => {
    const source = readFileSync(resolve("src/components/home/HomepageOccasionEdit.tsx"), "utf8");

    for (const [label, href] of [
      ["For Everyday", "/collections/pearl-series"],
      ["For a New Chapter", "/gifts"],
      ["Just Because", "/collections/new-arrivals"],
      ["Small Gifts", "/gifts"],
    ]) {
      expect(source).toContain(`label: "${label}", href: "${href}"`);
    }
  });

  test("homepage hero does not register its 7-second rotation under reduced motion", async ({ page }) => {
    await page.addInitScript(() => {
      const originalSetInterval = window.setInterval;
      const registrations: unknown[] = [];
      Object.defineProperty(window, "__homepageHeroIntervals", { value: registrations, configurable: true });
      window.setInterval = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
        registrations.push({ handler, timeout, args });
        return originalSetInterval(() => undefined, timeout);
      }) as typeof window.setInterval;
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const controls = page.getByRole("button", { name: /Show / });
    await expect(controls).toHaveCount(3);
    await expect(controls.first()).toHaveAttribute("aria-current", "true");
    expect(await page.evaluate(() =>
      (window as Window & { __homepageHeroIntervals?: { timeout?: number }[] }).__homepageHeroIntervals
        ?.filter(({ timeout }) => timeout === 7000).length ?? 0,
    )).toBe(0);
  });

  test("homepage keeps the existing first-viewport style hint", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    await expect
      .poll(() =>
        page
          .getByRole("heading", { name: "The Pearl Edit", exact: true })
          .evaluate((heading) => {
          const rect = heading.getBoundingClientRect();
          return Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        }),
      )
      .toBeGreaterThanOrEqual(24);
  });

  test("homepage keeps canonical metadata, organization data, and the Pearl Guide without retired claims", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(`${BRAND.name} | ${BRAND.descriptor} for Everyday Moments`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.maverenne.com",
    );
    await expect(page.getByRole("link", { name: "Read the guide" })).toHaveAttribute(
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

  test("collection and product surfaces keep solid headers and neutral alternate image roles", async ({ page }) => {
    await page.goto("/collections/pearl-series");
    await expect(page.locator("header[data-visual-state]")).toHaveAttribute("data-visual-state", "solid");

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

    await page.goto("/products/pearl-series-01");
    await expect(page.locator("header[data-visual-state]")).toHaveAttribute("data-visual-state", "solid");
    await expectImagesLoaded(page.locator("#main-content img"));
  });

  test("mobile product purchase entry keeps its gallery controls, primary action, and cart opening intact", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/products/new-series-pearl-glasses-chain");

    const galleryPosition = page.locator("[data-gallery-position]");
    await expect(galleryPosition).toHaveText("1 / 3");
    await expect(galleryPosition).toHaveAttribute("aria-live", "polite");

    const nextImage = page.getByRole("button", { name: /Next product image, 1 of 3/ });
    await nextImage.focus();
    await page.keyboard.press("Enter");
    await expect(galleryPosition).toHaveText("2 / 3");

    const primaryAdd = page.getByTestId("primary-add-to-cart");
    await primaryAdd.scrollIntoViewIfNeeded();
    await expect(primaryAdd).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const stickyAdd = page.getByTestId("sticky-add-to-cart");
    await expect(stickyAdd).toBeVisible();
    const mobileNav = page.locator("nav").filter({
      has: page.getByRole("button", { name: "Cart" }),
    });
    expect((await stickyAdd.boundingBox())?.y + (await stickyAdd.boundingBox())?.height).toBeLessThanOrEqual(
      (await mobileNav.boundingBox())?.y ?? 0,
    );

    await stickyAdd.getByRole("button", { name: /Add .* to cart/ }).click();
    await expect(page.getByRole("dialog", { name: /Shopping cart with 1 items/ })).toBeVisible();
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

  test(`SEO machine surfaces expose the same ${STOREFRONT_PRODUCT_COUNT} approved products`, async ({ request }) => {
    const feed = await (await request.get("/api/feed")).text();
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const robots = await (await request.get("/robots.txt")).text();

    expect((feed.match(/<item>/g) || []).length).toBe(STOREFRONT_PRODUCT_COUNT);
    expect((sitemap.match(/\/products\//g) || []).length).toBe(STOREFRONT_PRODUCT_COUNT);
    expect(feed).not.toMatch(/crystal|gemstone|serenity|balance\s*&\s*light/i);
    expect(sitemap).toContain("/blog</loc>");
    expect(sitemap).not.toMatch(
      /crystal|gemstone|obsidian|amethyst|rose-quartz|serenity|balance\s*&\s*light/i,
    );
    expect(robots).toContain("Allow: /api/feed$");
  });

  test("About page keeps its sparse neutral contract without imagery", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about");
    await expectSparseAbout(page);
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
    await expectSparseAbout(page);
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
            .getByText("Jewelry & Accessories", { exact: true })
            .evaluate((label) => {
              const rect = label.getBoundingClientRect();
              return Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
            }),
        )
        .toBeGreaterThan(0);
    }

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "A little something for yourself." })).toBeVisible();
    await expect(page.getByText("Editorial / Summer 2026", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "The Pearl Edit" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Shop by moment" })).toBeVisible();
    await expect(page.getByText(/Guardian/i)).toHaveCount(0);
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
    await expect(page.getByRole("button", { name: /View image 1 of 3/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
    const galleryImages = page.locator('button[aria-label^="View image"] img');
    await expect(galleryImages).toHaveCount(3);
    await expectImagesLoaded(galleryImages);
  });
});
