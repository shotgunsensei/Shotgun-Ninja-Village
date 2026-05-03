# Shotgun Ninja Village

The community and entertainment hub of the **Shotgun Ninjas Productions** ecosystem.

> "Enter the village: transmissions, recovered systems, community, and merch — all under one bold brand."

## Ecosystem Positioning

Shotgun Ninja Village is one node in a connected family of products built by Shotgun Ninjas Productions. Each product has a clear focus; the Village is the **culture, story, and community layer** that anchors the rest.

| Product | Role | Domain |
|---|---|---|
| **ShotgunNinjas.com** | Main ecosystem hub | shotgunninjas.com |
| **Shotgun Ninja Village** *(this app)* | Community, content, merch | shotgunninjavillage.com |
| **BrandForge OS** | Brand strategy & content deployment | bf-os.com |
| **TorqueShed** | Automotive diagnostics & repair cases | torqueshed.pro |
| **TechDeck** | IT operations & MSP tooling | techdeck.app |
| **TradeFlowKit** | Business ops & revenue pipeline | tradeflowkit.com |
| **PulseDesk** | Healthcare ops coordination | pulsedesk.support |
| **FaultlineLab** | Diagnostic challenge & training | faultlinelab.com |

The Village cross-links to all of these as **in-fiction "recovered systems"** on the `/intel` page and as **extended network nodes** on the home page — making the ecosystem feel like one universe without overcrowding the UI.

## What's in this app

- **Signal Feed** (`/`) — Hero, transmission teaser, recovered systems, ecosystem links, mailing list
- **Mission Archive** (`/archive`) — All three episodes (EP1 playable, EP2/EP3 incoming)
- **Operator Files** (`/operators`) — Kage-9 dossier
- **The Grid Map** (`/grid`) — World zones and threat archetypes
- **The Arsenal** (`/arsenal`) — Confirmed loadout
- **Forge Intel** (`/intel`) — All 6 recovered ecosystem systems with in-fiction roles
- **The Village** (`/community`) — Discourse-ready community hub (SSO, embed, signup wired)
- **Ronin Supply** (`/merch`) — Shopify Storefront-ready merch with product modal, bestsellers, limited drops
- **Legal Suite** (`/legal/:section`) — Terms, Privacy, Refunds, Contact
- **404** — Branded not-found

## Stack

- React 18 + TypeScript + Vite
- wouter (routing) + framer-motion (transitions)
- Tailwind CSS v4
- Async-ready service layer for Shopify Storefront API + Discourse API
- PWA install prompt (minimal SW)

## Live mode env vars

| Variable | Purpose |
|---|---|
| `VITE_STORE_MODE=live` + `VITE_SHOPIFY_DOMAIN` + `VITE_SHOPIFY_STOREFRONT_TOKEN` | Live Shopify catalog |
| `VITE_COMMUNITY_MODE=live` + `VITE_DISCOURSE_URL` | Live Discourse community |
| `VITE_DISCOURSE_SSO=true` + `VITE_DISCOURSE_SSO_LOGIN_URL` | Discourse SSO |
| `VITE_DISCOURSE_EMBED=true` | Embedded community widget |
| `VITE_DISCOURSE_SIGNUP_URL` | Custom signup destination |

Without these, the app runs in **mock mode** with realistic placeholder data — no fake "live" claims.

## Scripts

```bash
pnpm dev         # local dev server
pnpm build       # production build
pnpm exec tsc --noEmit   # typecheck
```

Built by **Shotgun Ninjas Productions**. All transmissions, characters, and brand assets © Shotgun Ninjas Productions.
