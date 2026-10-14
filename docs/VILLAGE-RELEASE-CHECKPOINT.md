# Village release checkpoint — 2026-10-14

## Completed local work

The original redesign remains preserved in commits 88983fa and 9b1f253, with the verified 9b1f253 bundle and three Library review images unchanged. The original 65 unit/component tests and 26 desktop/mobile checks remain preserved as prior evidence.

Read-only audit found no later design revision or release instruction inside this task before the new game-link request. GitHub main still points to 785788f. Connected read-only repository access succeeded after the reported removal of expired Replit/Codex PAT entries; this is **not** evidence that the exposed inherited PAT was revoked. Authenticated writes and publication remain on hold.

This checkpoint completes these concrete follow-ups:

- Home `/`: a hero game link and a responsive Kage-9 game section.
- Shared desktop/mobile navigation: a game link that closes the mobile drawer.
- Codex `/codex`: a game destination link.
- All game links target `https://kage.shotgunninjavillage.com`, open safely in a separate tab, and state launch pending. No live-play claim.
- Legal `/legal/terms` and `/legal/refunds`: when the concept store is closed, show its status rather than unverified production, refund, international-shipping or final-sale promises. Existing configured-live policy content is preserved.
- Asset regeneration: use the immutable local Git catalog baseline rather than a hard-coded Windows checkout; do not rewrite unchanged source files.

The game destination could not be verified accessible with the available read tools. Local DNS inspection was denied by the environment. That does not establish that the domain is down. The game task owns public hosting, gameplay verification and multi-level expansion. No DNS or game-repository change was performed here; `shotgunninjas.com` remains owned by its separate task.

## New bounded validation

- Typecheck, script syntax, production build and diff whitespace checks passed.
- Four legal-policy regression tests passed.
- Three game-destination regression tests passed.
- Seven isolated Chromium page/interaction checks passed across desktop 1440×1000 and mobile 390×844: home, codex, refunds and mobile game navigation. Decoded character-image geometry checked at both sizes.
- Zero automated WCAG A/AA violations and runtime exceptions on those changed routes; no horizontal overflow. External game requests were blocked during tests.
- Mobile and desktop character-art captures inspected. Capture waits for image decoding; artwork is explicitly labeled as character concept art.
- No shared browser, paid calls, spending, production migration, catalog/order change or publication.
- Product/collection record preservation still passes. Prices and the merch presentation are unchanged.

Focused results and captures: `output/playwright/release-readiness-results.json`, `game-destination-results.json`, `game-links-qa.json`, and `game-links-{mobile,desktop}-home.png`. The legal test file passed all four tests in the combined report; the corrected accessible-heading case then passed all three game tests in its focused report. Previous completed checks were not broadly rerun.

## What actually needs owner input

**Closed concept website:** the requested game address is already set. Merchandise vendor/print decisions do not block publishing a clearly closed concept catalog. Push/draft PR and deployment remain pending the existing credential/publication hold and the owner's release review; do not ask for another approval if the parent already has that authorization.

**Physical merchandise and live sales:** these are not completed by web mockups. Indispensable inputs are:

1. The chosen fulfillment provider/account and actual product blank/color/vendor SKU or template for each item to produce, plus approved placement/print method. Existing concept acceptance should be reused; only unresolved item choices or revisions need another decision.
2. Owner confirmation of actual shipping/returns/final-sale policy before live-store activation. The inherited live text contains 24–48-hour production entry, 30-day defect claims, 5–10-business-day production, international shipping and founders final-sale terms; none is verified against a supplier here.
3. Final production proof/sew-out or sample acceptance before manufacturing/catalog publication, and a provider quote plus explicit spending authorization before any paid sample/order. No price change or new purchase is assumed.

Once the provider templates and product choices exist, isolated print artwork and vendor-compliant exports can be prepared locally. Current 1254×1254 flattened garment scenes are concepts, not printable masters. Exact proposed boxes and raster targets remain in `MERCH-PRODUCTION-HANDOFF.md`; final vendor bleed, safe zones, color profile, stitching constraints and placements are still unresolved.

**Credentials only:** uploading `codex/village-anime-brand` to `shotgunsensei/Shotgun-Ninja-Village` and opening a draft PR is pending the parent's verification of the affected credential entry and safe authentication. No authenticated write has been attempted under the hold. Successful read access or GitHub Desktop activity does not resolve that hold.
