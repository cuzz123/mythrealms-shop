import { expect, test, type Page } from "@playwright/test";

import { absoluteUrl } from "../src/lib/site";

const path = "/pearls/care";
const canonical = absoluteUrl(path);
const heading = "How to Care for Pearls";
const directAnswer =
  "General pearl-care guidance is to reduce contact with fragrance, cosmetics, heat, and harsh cleaners; wipe pearls with a very soft, clean cloth after wear; and avoid ultrasonic or steam cleaning. This is educational guidance for pearls, not a care instruction for any store item, setting, string, or finish.";
const sectionHeadings = [
  "Keep everyday exposure in mind",
  "Use gentle cleaning boundaries",
  "Pause when the item-specific detail is missing",
  "Store general education beside exact instructions",
];
const controlledHrefs = [
  "/pearls",
  "/pearls/how-to-wear",
  "/pearls/freshwater-pearls",
  "/contact",
];

async function assertCareContract(page: Page) {
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  await expect(page.getByText(directAnswer, { exact: true })).toBeVisible();
  for (const sectionHeading of sectionHeadings) {
    await expect(page.getByRole("heading", { level: 2, name: sectionHeading })).toBeVisible();
  }
  await expect(page.getByRole("heading", { level: 2, name: "Frequently asked questions" })).toBeVisible();

  const main = page.locator("#main-content");
  await expect(main.locator('a[href^="https://"]')).toHaveCount(2);
  await expect(main.locator('a[href^="/products/"]')).toHaveCount(0);
  await expect(main.locator("img")).toHaveCount(0);
  for (const href of controlledHrefs) {
    await expect(main.locator(`a[href="${href}"]`).first()).toBeVisible();
  }

  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent || "{}")));
  const article = schemas.find((schema) => schema["@type"] === "Article");
  expect(article).toEqual({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: heading,
    description: directAnswer,
    url: canonical,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  });
  const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
  await expect(main.locator("dl > div")).toHaveCount(faq.mainEntity.length);
  expect(
    await main.locator("dl > div").evaluateAll((items) =>
      items.map((item) => ({
        question: item.querySelector("dt")?.textContent?.trim(),
        answer: item.querySelector("dd")?.textContent?.trim(),
      })),
    ),
  ).toEqual(
    faq.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }) => ({
      question: item.name,
      answer: item.acceptedAnswer.text,
    })),
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
}

test("care guide honors its rights-safe route contract across runtime modes", async ({ page, browser }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 900 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await assertCareContract(page);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(path);
  const reached = new Set<string>();
  for (let press = 0; press < 100 && reached.size < controlledHrefs.length; press += 1) {
    await page.keyboard.press("Tab");
    const href = await page.evaluate(() =>
      document.activeElement instanceof HTMLAnchorElement
        ? document.activeElement.getAttribute("href")
        : null,
    );
    if (href && controlledHrefs.includes(href)) reached.add(href);
  }
  expect([...reached].sort()).toEqual([...controlledHrefs].sort());

  const noJsContext = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const noJsPage = await noJsContext.newPage();
  try {
    const response = await noJsPage.goto(path);
    expect(response?.status()).toBe(200);
    await assertCareContract(noJsPage);
  } finally {
    await noJsContext.close();
  }
});
