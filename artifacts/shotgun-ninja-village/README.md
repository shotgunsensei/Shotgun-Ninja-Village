# Shotgun Ninja Village

The community and entertainment hub of the **Shotgun Ninjas Productions** ecosystem.

> "Enter the village: transmissions, recovered systems, community, and merch — all under one bold brand."

## Ecosystem Positioning

Shotgun Ninja Village is one node in a connected family of products built by Shotgun Ninjas Productions. Each product has a clear focus; the Village is the **culture, story, and community layer** that anchors the rest.

| Product                                | Role                                  | Domain                  |
| -------------------------------------- | ------------------------------------- | ----------------------- |
| **ShotgunNinjas.com**                  | Main ecosystem hub                    | shotgunninjas.com       |
| **Shotgun Ninja Village** _(this app)_ | Community, content, merch             | shotgunninjavillage.com |
| **BrandForge OS**                      | Brand strategy & content deployment   | bf-os.com               |
| **TorqueShed**                         | Automotive diagnostics & repair cases | torqueshed.pro          |
| **TechDeck**                           | IT operations & MSP tooling           | techdeck.app            |
| **TradeFlowKit**                       | Business ops & revenue pipeline       | tradeflowkit.com        |
| **PulseDesk**                          | Healthcare ops coordination           | pulsedesk.support       |
| **FaultlineLab**                       | Diagnostic challenge & training       | faultlinelab.com        |

The Village cross-links to all of these as **in-fiction "recovered systems"** on the `/intel` page and as **extended network nodes** on the home page — making the ecosystem feel like one universe without overcrowding the UI.

## What's in this app

- **Signal Feed** (`/`) — Hero, transmission teaser, recovered systems, ecosystem links, mailing list
- **Mission Archive** (`/archive`) — All three episodes (EP1 playable, EP2/EP3 incoming)
- **Operator Files** (`/operators`) — Kage-9 dossier
- **The Grid Map** (`/grid`) — World zones and threat archetypes
- **The Arsenal** (`/arsenal`) — Confirmed loadout
- **Forge Intel** (`/intel`) — All 6 recovered ecosystem systems with in-fiction roles
- **The Village** (`/community`) — Native, database-backed message boards; public visitor reading, account posting, search, replies, and tier-aware rooms
- **Operator Accounts** (`/account`) — Signup, sign-in, callsigns, profiles, progress sync, notification consent, and persistent badges
- **Board routes** (`/community/:slug`, `/community/topic/:id`) — Topic creation, replies, owner editing/removal, and accessible empty/error/loading states
- **Public profiles** (`/community/operator/:callsign`) — Privacy-safe operator identity, alignment, tier flair, and earned badges
- **Ronin Supply** (`/merch`) — Shopify Storefront-ready merch with product modal, bestsellers, limited drops
- **Legal Suite** (`/legal/:section`) — Terms, Privacy, Refunds, Contact
- **404** — Branded not-found

## Stack

- React 19 + TypeScript + Vite
- wouter (routing) + framer-motion (transitions)
- Tailwind CSS v4
- Express 5 + PostgreSQL + Drizzle for accounts, sessions, topics, replies, and badges
- Native cookie authentication using salted scrypt password hashes and opaque server-side sessions
- Shopify Storefront-ready merchandise service
- PWA install prompt (minimal SW)

## Required environment

| Variable                                   | Purpose                                                                     |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| `DATABASE_URL`                             | PostgreSQL connection used by accounts, sessions, subscriptions, and boards |
| `PORT`                                     | Production API/static server port                                           |
| `APP_ORIGIN`                               | Canonical public origin used by the write-origin security check             |
| `COMMUNITY_ALLOWED_ORIGINS`                | Optional comma-separated additional trusted origins                         |
| `COOKIE_SECURE`                            | Keep `true` in HTTPS production; local development may use `false`          |
| `VITE_API_PROXY_TARGET`                    | Local Vite proxy target, normally `http://127.0.0.1:3000`                   |
| `VITE_STORE_MODE=live` + Shopify variables | Optional live Shopify catalog                                               |

Community screens never substitute fake activity when the API is unavailable. They show an honest, actionable error state. Only the optional merchandise catalog retains its documented mock mode.

## Database and local development

```powershell
pnpm install
$env:DATABASE_URL = "postgresql://..."
pnpm --filter @workspace/db run migrate

# Terminal 1
$env:PORT = "3000"
pnpm --filter @workspace/api-server run dev

# Terminal 2
$env:PORT = "24938"
pnpm --filter @workspace/shotgun-ninja-village run dev
```

The API production build also builds and serves the Village SPA, so account cookies and community writes remain same-origin after deployment.

## Scripts

```powershell
pnpm --filter @workspace/shotgun-ninja-village run check
pnpm --filter @workspace/api-server run test
pnpm run build
```

Built by **Shotgun Ninjas Productions**. All transmissions, characters, and brand assets © Shotgun Ninjas Productions.
