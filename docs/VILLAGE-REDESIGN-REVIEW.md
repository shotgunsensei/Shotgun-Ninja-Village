# Village redesign verification and owner review

Branch: `codex/village-anime-brand`, isolated worktree based on `785788f`.
No deployment, real order, physical catalog change, or fulfillment mutation.

## Evidence

- Production build and TypeScript check passed.
- 65 unit/component tests passed, including the preview-claim regression; final results are recorded in `output/playwright/unit-results.json`.
- 26 isolated Chromium checks: 12 routes at desktop 1440×1000 and mobile 390×844, plus two merch interaction flows.
- Zero runtime exceptions, broken main-content images or document horizontal overflow.
- Zero axe WCAG 2 A/AA and 2.1 AA rule violations on home, merch, codex, alignment, account and product dialog at both viewports. This is automated evidence, not full accessibility certification.
- Merch flow covers concept checkout disabled, 2XL price change, Escape/focus restoration, collection counts/filter/reset, codex navigation, mobile drawer navigation.
- Isolated live fixtures cover exact variants, unavailable/absent combinations, cart add/quantity/remove, numeric Shopify cart links, and failure without demo fallback. No actual Shopify checkout or payment was performed.
- Product and collection record text was compared with the original checkout and is unchanged; only optional currency typing was added.
- Shared ecosystem source, community API/server, account storage, customer data and fulfillment configuration remain untouched.

## Page-load measurement

Local static preview; no CPU/network throttling; all content scrolled into view; fresh browser contexts. These are observed resource transfers, not Lighthouse scores or public CDN metrics.

Home: 7,610,334 → 1,167,681 bytes (~85% less).
Merch: 1,467,778 bytes after all eight concept images and world art load.
Entry bundle: ~138 KB gzip; merch route ~5.9 KB gzip. Canonical PNGs retained alongside smaller WebP derivatives.
Fonts still load from the existing Google Fonts integration. Real device/network and human screen-reader checks remain owner-review follow-ups.

## Screenshot review

Accepted redesign evidence:

- `output/playwright/redesign-desktop-home.png`
- `output/playwright/redesign-desktop-merch.png`
- `output/playwright/redesign-mobile-home.png`
- `output/playwright/redesign-mobile-merch.png`
- `output/playwright/redesign-desktop-codex.png`
- `output/playwright/redesign-mobile-codex.png`
- desktop/mobile product, operator, grid and arsenal screenshots in the same folder.

Source audit:

1. Home — rendered; original command-hub identity and transmissions recorded.
2. Merch — rendered; empty images and unsupported marketing claims found.
3. Product detail — rendered; preview checkout closed; focus/semantics needed improvement.
4. Operators — rendered; canonical Kage-9 features inspected.
5. Grid — rendered; four established districts retained.
6. Arsenal — rendered; five existing equipment studies retained.
7. Archive — rendered; trilogy purchase-free watch navigation recorded.
8. Intel — rendered; shared ecosystem links retained.
9. Alignment — rendered; four archetypes and five-question setup retained.
10. Community — rendered; account/board integration identified.
11. Account — rendered; sign-in/signup flows inventoried without submitting.
12. Refunds/legal — rendered; policy paths retained.

The first live full-page merch capture had untriggered scroll animations and was rejected for complete-flow evidence. Re-capture script scrolls the page before capture. Other live route captures and product-detail screenshot were inspected. Source inventory plus parent independent bundle check establishes current preview-store status.

## Reproduction

Use Node 24 and the existing pnpm workspace dependencies:
`pnpm --filter @workspace/shotgun-ninja-village check`.
For restricted Windows worktrees reusing dependencies via junctions, Vite's `--configLoader runner` avoids writes to the original dependency directory, and Vitest TEMP/TMP can point to `.cache/test-temp`.

Install free QA dependencies in a separate local folder:
`npm install --prefix <qa-runtime> playwright @axe-core/playwright sharp`.
`node scripts/village-browser-qa.mjs <qa-runtime>` targets local preview port 5178; `VILLAGE_QA_URL` and `VILLAGE_CHROMIUM_PATH` can override the target/browser executable.
`node scripts/optimize-brand-images.mjs <qa-runtime>` and `optimize-canonical-images.mjs` regenerate web derivatives from retained originals.
This task used a fresh headless browser, without shared CallCommandAI profiles or tabs.

## Remaining release gates

Owner review of the cohesive design and garment concepts; approved physical vendor/templates/print masters/samples; verified Shopify catalog/checkout configuration if commerce is activated. The existing preview catalog is closed.

Authenticated push and draft PR creation are **pending** parent credential-scope clearance following a GitHub PAT exposure in diagnostic output. No authenticated GitHub write has been attempted since that hold. Local implementation, commit and patch are available for review. The redesign must not be deployed wholesale before owner review.
