# Village inventory before redesign

Audit date 2026-10-14. Local repository main clean at 785788f. Isolated branch codex/village-anime-brand. Canonical remote confirmed shotgunsensei/Shotgun-Ninja-Village; Xodus-John alias lookup returned 404. Original checkout and its files remain untouched.

## Pages and flows

/ home: cinematic intro, three recovered transmissions, watch progress, signup API/offline queue, enlisted counter, alignment/community/merch/ecosystem links.
/archive: trilogy navigation and episode projects (three React/Vite motion manga projects).
/operators: Kage-9 / Hayaku Kageru dossier.
/grid: Forge Grid, Noise Sectors, Archive Fractures, Operator Havens and threats.
/arsenal: back/hip shotguns, katana, headset, red armor.
/intel: BrandForge, TorqueShed and shared ecosystem cross-links.
/alignment: five-question local archetype setup, four results, persistent operator record, retake/share/next links.
/community, /community/:slug, /community/topic/:id, /community/operator/:callsign: native board reads, authenticated contributions and permission-enforced rooms.
/account: native PostgreSQL/HTTP-only session account flows.
/merch: eight preview products, six collections, detail modal, selected variant -> Shopify cart permalink only if live configured; otherwise coming soon.
/legal and /legal/{terms,privacy,refunds,contact}: existing policy and contact content.
PWA manifest/service worker and install flow; SEO metadata, robots/sitemap; lazy-loaded SPA routes, BASE_URL support.

## Catalog and current gaps

All eight products have empty image arrays. Card and modal ignore images even when Shopify supplies them. Collection counts are hard-coded and inaccurate. Catalog mode defaults to mock; parent independent deployed-bundle audit confirms disabled checkout (#store-coming-soon). No verified Shopify credentials or physical fulfillment integration. No orders, catalog mutations or customer records accessed.

Signal Hunter Tee: S/M/L/XL $34.99; 2XL $36.99.
Kage-9 Operator Hoodie: S/M/L/XL $64.99.
Fracture Scan Drop Tee: S/M/L/XL $39.99.
Village Signal Cap: Black/Red $29.99.
Tactical Sticker Pack: standard $12.99.
Founding Ninja Tee: S/M/L/XL $44.99.
Forge Protocol Long Sleeve: S/M/L/XL $42.99.
Noise Sector Poster: 18x24 $24.99.
Prices above are existing preview records, not verified live sale prices.

Six source collections: core-brand, kage-9, episode-drops, stickers-small-goods, limited-edition, founders-supporter. No product records are rewritten by this redesign.

## Assets and integrations

Canonical PNGs: hero, kage-9, kage-9-operator; four zone images; five gear images; three episode thumbs; episode-specific motion artwork; PWA icons. Existing .agents/agent_assets_metadata.toml records generated provenance. Canonical operator and portrait pixels inspected. No 3D models located.

Frontend React 19 / Vite 7 / Tailwind 4 / Wouter / Framer Motion / TanStack Query. Express 5, Drizzle/PostgreSQL, typed API client. Shared packages/sn-ecosystem owns cross-brand data; no unrelated OperatorOS changes. Shopify Storefront GraphQL service is optional and previously returned demo products on live request failures. This redesign removes that fallback and validates checkout IDs.

## Evidence limits

Web fetch confirms the JavaScript command hub shell. Parent independently read the deployed bundle and canonical image. Source inventory is complete; rendered production screenshot/interaction evidence is tracked separately under the QA report. Live payment, shipping and manufacturing remain unverified. No purchase is authorized or performed.
