import { expect, test, type Locator, type Page } from "@playwright/test";

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

async function scrollToTop(page: Page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
}

async function freezeFooterYear(page: Page) {
  const copyright = page
    .locator("footer")
    .getByText(/^© \d{4} MythRealms\. All rights reserved\.$/);
  await expect(copyright).toHaveCount(1);
  await copyright.evaluate((node) => {
    node.textContent = node.textContent?.replace(/© \d{4}/, "© 2000") ?? "";
  });
}

async function waitForCanonicalAnnouncement(page: Page) {
  await expect(page.getByRole("region", { name: "Announcement" })).toContainText(
    "Free shipping over $69.99 | 30-day returns",
  );
}

async function stabilizeVisual(page: Page, path: string) {
  await page.addInitScript(() => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        timestamp: 1,
      }),
    );
    const nativeSetInterval = window.setInterval.bind(window);
    window.setInterval = ((
      handler: TimerHandler,
      timeout?: number,
      ...args: unknown[]
    ) =>
      timeout === 4500
        ? 0
        : nativeSetInterval(handler, timeout, ...args)) as typeof window.setInterval;
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  await page.evaluate(() => document.fonts.ready);
  await expectImagesLoaded(page.locator("#main-content img"));
  await scrollToTop(page);
  await waitForCanonicalAnnouncement(page);
  await freezeFooterYear(page);
}

test("homepage editorial discovery", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await stabilizeVisual(page, "/");
  await page
    .getByRole("heading", { name: "Choose by the way they wear it." })
    .scrollIntoViewIfNeeded();
  await scrollToTop(page);
  await expect(page.locator('header[data-visual-state="overlay"]')).toBeVisible();
  await expect(page).toHaveScreenshot("homepage.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
});

test("Story editorial page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await stabilizeVisual(page, "/about");
  await expect(page).toHaveScreenshot("story.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
});

test("pearl knowledge hub", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await stabilizeVisual(page, "/pearls");
  await expect(page).toHaveScreenshot("pearls-hub.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
});

test("mobile gift guide", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await stabilizeVisual(page, "/gifts");
  await expect(page).toHaveScreenshot("gifts-mobile.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
});
