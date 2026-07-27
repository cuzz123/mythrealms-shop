import { expect, test, type Locator, type Page } from "@playwright/test";

test("Quiet Light tokens and system font stacks are applied", async ({ page }) => {
  await page.goto("/");

  const styles = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const heading = document.createElement("h1");
    heading.textContent = "Quiet Light";
    document.body.appendChild(heading);

    return {
      tokens: {
        background: root.getPropertyValue("--background").trim(),
        surface: root.getPropertyValue("--surface").trim(),
        surfaceAlt: root.getPropertyValue("--surface-alt").trim(),
        text: root.getPropertyValue("--text").trim(),
        textSecondary: root.getPropertyValue("--text-secondary").trim(),
        accent: root.getPropertyValue("--accent").trim(),
        primary: root.getPropertyValue("--primary").trim(),
        border: root.getPropertyValue("--border").trim(),
      },
      bodyFont: getComputedStyle(document.body).fontFamily,
      headingFont: getComputedStyle(heading).fontFamily,
    };
  });

  expect(styles.tokens).toEqual({
    background: "#f7f3eb",
    surface: "#fffdf8",
    surfaceAlt: "#eee6da",
    text: "#292622",
    textSecondary: "#6d655d",
    accent: "#a98758",
    primary: "#b99863",
    border: "#ddd2c4",
  });
  expect(styles.headingFont).toBe(
    '"Iowan Old Style", Baskerville, "Times New Roman", serif',
  );
  expect(styles.bodyFont).toBe("Inter, ui-sans-serif, system-ui, sans-serif");
});

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
