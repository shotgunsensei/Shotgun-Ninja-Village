import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const runtime = process.argv[2] || resolve(import.meta.dirname, "..");
const { chromium } = require(
  require.resolve("playwright", { paths: [runtime] }),
);
const axeModule = require(
  require.resolve("@axe-core/playwright", { paths: [runtime] }),
);
const AxeBuilder = axeModule.default || axeModule;
const base = process.env.VILLAGE_QA_URL || "http://127.0.0.1:5178";
const output = resolve(import.meta.dirname, "../output/playwright");
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.VILLAGE_CHROMIUM_PATH
    ? { executablePath: process.env.VILLAGE_CHROMIUM_PATH }
    : {}),
});
const report = {
  base,
  checks: [],
  accessibility: [],
  runtimeErrors: [],
  performance: [],
};
async function setup(viewport) {
  const context = await browser.newContext({
    viewport,
    reducedMotion: "reduce",
  });
  await context.route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/api/auth/me")
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ user: null }),
      });
    if (path === "/api/signups/count")
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ count: 0 }),
      });
    return route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ message: "Local QA: backend unavailable" }),
    });
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => report.runtimeErrors.push(String(error)));
  return { context, page };
}
const routes = [
  "/",
  "/merch",
  "/codex",
  "/operators",
  "/grid",
  "/arsenal",
  "/archive",
  "/intel",
  "/alignment",
  "/community",
  "/account",
  "/legal/refunds",
];
try {
  for (const [name, viewport] of [
    ["desktop", { width: 1440, height: 1000 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    const { context, page } = await setup(viewport);
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      await page.locator("h1").first().waitFor();
      await page.evaluate(async () => {
        const height = document.body.scrollHeight;
        for (let y = 0; y < height; y += 650) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 100));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(300);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
        `Horizontal overflow ${route} ${name}`,
      );
      const broken = await page
        .locator("main img")
        .evaluateAll((images) =>
          images
            .filter((image) => !image.complete || image.naturalWidth === 0)
            .map((image) => image.getAttribute("src")),
        );
      assert.deepEqual(broken, [], `Broken images ${route} ${name}`);
      const heading = await page.locator("h1").first().textContent();
      report.checks.push({ route, viewport: name, heading, status: "pass" });
      if (
        ["/", "/merch", "/codex", "/operators", "/grid", "/arsenal"].includes(
          route,
        )
      )
        await page.screenshot({
          path: resolve(
            output,
            `redesign-${name}-${route === "/" ? "home" : route.slice(1)}.png`,
          ),
          fullPage: route === "/merch" || route === "/codex",
        });
      if (["/", "/merch", "/codex", "/alignment", "/account"].includes(route)) {
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        report.accessibility.push({
          route,
          viewport: name,
          violations: result.violations.map(
            ({ id, impact, description, nodes }) => ({
              id,
              impact,
              description,
              nodes: nodes.map(({ target, failureSummary }) => ({
                target,
                failureSummary,
              })),
            }),
          ),
        });
      }
      if (["/", "/merch"].includes(route)) {
        report.performance.push({
          route,
          viewport: name,
          ...(await page.evaluate(() => {
            const navigation = performance.getEntriesByType("navigation")[0];
            const resources = performance.getEntriesByType("resource");
            return {
              domContentLoadedMs: navigation.domContentLoadedEventEnd,
              totalTransferBytes: resources.reduce(
                (n, r) => n + (r.transferSize || 0),
                0,
              ),
              requests: resources.length,
              largestResources: resources
                .map((r) => ({
                  name: r.name.split("/").pop(),
                  bytes: r.transferSize || 0,
                }))
                .sort((a, b) => b.bytes - a.bytes)
                .slice(0, 5),
            };
          })),
        });
      }
    }
    await page.goto(base + "/merch", { waitUntil: "networkidle" });
    const product = page.getByRole("button", {
      name: "View Signal Hunter Tee",
      exact: true,
    });
    await product.click();
    await page.getByRole("dialog").waitFor();
    assert.equal(
      await page.getByRole("button", { name: /checkout closed/ }).isDisabled(),
      true,
    );
    assert.equal(await page.getByRole("link", { name: /Buy now/ }).count(), 0);
    await page.getByRole("button", { name: "size: 2XL" }).click();
    assert.equal(await page.locator(".detail-price").textContent(), "$36.99");
    const dialogAxe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    report.accessibility.push({
      route: "/merch/dialog",
      viewport: name,
      violations: dialogAxe.violations.map(({ id, impact, nodes }) => ({
        id,
        impact,
        targets: nodes.map((n) => n.target),
      })),
    });
    await page.screenshot({
      path: resolve(output, `redesign-${name}-product.png`),
    });
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("dialog").count(), 0);
    assert.equal(
      await product.evaluate((button) => document.activeElement === button),
      true,
      "Product dialog should restore focus",
    );
    await page.getByRole("button", { name: /Kage-9 Collection/ }).click();
    assert.equal(await page.locator(".merch-product-card").count(), 1);
    await page.getByRole("button", { name: /All items/ }).click();
    assert.equal(await page.locator(".merch-product-card").count(), 8);
    await page.getByRole("link", { name: /Open the village codex/ }).click();
    await page.getByRole("heading", { name: /One village/ }).waitFor();
    if (name === "mobile") {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page.getByRole("dialog", { name: "Site navigation" }).waitFor();
      await page
        .getByRole("link", { name: /Ronin Supply Village merch/ })
        .click();
      await page.getByRole("heading", { name: /RONIN/ }).waitFor();
      assert.equal(await page.getByRole("dialog").count(), 0);
    }
    report.checks.push({
      viewport: name,
      flow: "Product options, closed concept checkout, Escape/focus, collection filters, codex and mobile navigation",
      status: "pass",
    });
    await context.close();
  }
  assert.deepEqual(report.runtimeErrors, [], "No runtime exceptions");
} catch (error) {
  report.failure = String(error);
  process.exitCode = 1;
} finally {
  writeFileSync(
    resolve(output, "redesign-qa.json"),
    JSON.stringify(report, null, 2),
  );
  await browser.close();
}
console.log(
  JSON.stringify(
    {
      checks: report.checks.length,
      axeViolations: report.accessibility.reduce(
        (n, r) => n + r.violations.length,
        0,
      ),
      runtimeErrors: report.runtimeErrors,
      failure: report.failure,
      performance: report.performance,
    },
    null,
    2,
  ),
);
