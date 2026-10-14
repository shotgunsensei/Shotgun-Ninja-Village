import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const { chromium } = await import(process.argv[2] || "playwright");
const output = resolve(import.meta.dirname, "../output/playwright");
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.VILLAGE_CHROMIUM_PATH
    ? { executablePath: process.env.VILLAGE_CHROMIUM_PATH }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const report = [];
for (const [route, name] of [
  ["/", "home"],
  ["/merch", "merch"],
  ["/operators", "operators"],
  ["/grid", "grid"],
  ["/arsenal", "arsenal"],
  ["/archive", "archive"],
  ["/intel", "intel"],
  ["/alignment", "alignment"],
  ["/community", "community"],
  ["/account", "account"],
  ["/legal/refunds", "refunds"],
]) {
  try {
    await page.goto("https://shotgunninjavillage.com" + route, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    const headline = await page
      .locator("h1")
      .first()
      .textContent()
      .catch(() => "");
    if (route === "/merch") {
      const height = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < height; y += 700) {
        await page.evaluate((y) => window.scrollTo(0, y), y);
        await page.waitForTimeout(160);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(700);
    }
    await page.screenshot({
      path: resolve(output, "live-" + name + ".png"),
      fullPage: route === "/merch",
    });
    report.push({
      route,
      headline,
      health: "rendered",
      url: page.url(),
      links: await page
        .locator("main a")
        .evaluateAll((links) =>
          links.map((a) => ({
            text: a.textContent?.trim(),
            href: a.getAttribute("href"),
          })),
        ),
    });
    if (route === "/merch") {
      const products = page
        .locator('[role="button"]')
        .filter({ hasText: "Signal Hunter Tee" });
      if (await products.count()) {
        await products.first().click();
        await page.screenshot({ path: resolve(output, "live-product.png") });
        report.push({
          step: "Product detail",
          health: "preview only",
          checkoutLinks: await page
            .getByRole("link", { name: /Buy Now/ })
            .count(),
          comingSoon: await page
            .getByText("Coming Soon", { exact: true })
            .count(),
        });
      }
    }
  } catch (error) {
    report.push({ route, health: "blocked", reason: String(error) });
  }
}
writeFileSync(
  resolve(output, "live-inventory.json"),
  JSON.stringify(report, null, 2),
);
await browser.close();
console.log(
  JSON.stringify(
    report.map(({ route, step, health, headline }) => ({
      route,
      step,
      health,
      headline,
    })),
    null,
    2,
  ),
);
