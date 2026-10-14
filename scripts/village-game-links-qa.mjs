import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const require = createRequire(import.meta.url);
const runtime = process.argv[2] || resolve(import.meta.dirname, "..");
const { chromium } = require(
  require.resolve("playwright", { paths: [runtime] }),
);
const axeModule = require(
  require.resolve("@axe-core/playwright", { paths: [runtime] }),
);
const AxeBuilder = axeModule.default || axeModule;
const output = resolve(import.meta.dirname, "../output/playwright");
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.argv[3],
});
const report = { checks: [], violations: [], errors: [] };
try {
  for (const [viewportName, viewport] of [
    ["desktop", { width: 1440, height: 1000 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    const context = await browser.newContext({
      viewport,
      reducedMotion: "reduce",
    });
    await context.route("**/api/**", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ message: "Isolated QA; backend not called" }),
      }),
    );
    await context.route("https://kage.shotgunninjavillage.com/**", (route) =>
      route.abort(),
    );
    const page = await context.newPage();
    page.on("pageerror", (error) => report.errors.push(String(error)));
    for (const route of ["/", "/codex", "/legal/refunds"]) {
      await page.goto("http://127.0.0.1:5188" + route, {
        waitUntil: "networkidle",
      });
      await page.locator("h1").first().waitFor();
      if (route !== "/legal/refunds") {
        const contentLinks = page.locator(
          'main a[href="https://kage.shotgunninjavillage.com"]',
        );
        assert.ok(
          (await contentLinks.count()) > 0,
          "Game destination must be linked in content",
        );
        for (const link of await contentLinks.all()) {
          assert.equal(await link.getAttribute("target"), "_blank");
          assert.equal(await link.getAttribute("rel"), "noopener noreferrer");
          assert.match(await link.textContent(), /launch pending/);
        }
        assert.equal(
          await page.getByRole("link", { name: /play now/i }).count(),
          0,
        );
      } else {
        await page
          .getByRole("heading", { name: "Merch is not open for orders" })
          .waitFor();
        assert.equal(
          await page.getByText(/Orders enter production/).count(),
          0,
        );
      }
      if (route === "/") {
        await page.locator("#game").scrollIntoViewIfNeeded();
        const imageState = await page
          .locator("#game img")
          .evaluate(async (img) => {
            await img.decode();
            const rect = img.getBoundingClientRect();
            const parent = img.parentElement.getBoundingClientRect();
            return {
              width: rect.width,
              height: rect.height,
              parentHeight: parent.height,
              naturalWidth: img.naturalWidth,
              opacity: getComputedStyle(img).opacity,
            };
          });
        assert.ok(
          imageState.naturalWidth > 0 &&
            imageState.width > 0 &&
            imageState.height > 0,
          "Game art must have a visible box",
        );
        report.checks.push({ viewport: viewportName, gameImage: imageState });
        await page.waitForTimeout(150);
        await page.screenshot({
          path: resolve(output, `game-links-${viewportName}-home.png`),
        });
      }
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
      );
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      report.violations.push(
        ...axe.violations.map((v) => ({
          viewport: viewportName,
          route,
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      );
      report.checks.push({ viewport: viewportName, route, status: "pass" });
    }
    if (viewportName === "mobile") {
      await page.getByRole("button", { name: "Open navigation" }).click();
      const navLink = page
        .getByRole("dialog", { name: "Site navigation" })
        .locator(".village-game-nav");
      await navLink.waitFor();
      assert.equal(
        await navLink.getAttribute("href"),
        "https://kage.shotgunninjavillage.com",
      );
      assert.equal(
        await navLink.evaluate(
          (link) => link.getBoundingClientRect().height >= 44,
        ),
        true,
      );
      const popup = context.waitForEvent("page");
      await navLink.click();
      const gameTab = await popup;
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      await gameTab.close();
      report.checks.push({
        viewport: viewportName,
        flow: "Mobile game navigation closes drawer and opens separate target",
        status: "pass",
      });
    }
    await context.close();
  }
  assert.equal(report.errors.length, 0);
  assert.equal(report.violations.length, 0);
} catch (error) {
  report.failure = String(error);
  process.exitCode = 1;
} finally {
  await browser.close();
  writeFileSync(
    resolve(output, "game-links-qa.json"),
    JSON.stringify(report, null, 2),
  );
}
console.log(JSON.stringify(report, null, 2));
