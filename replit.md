# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Shotgun Ninjas - Episode 1: The Signal in the Static
- **Path**: `artifacts/shotgun-ninjas-ep1/`
- **Type**: video-js (animated video, not deployable — export from preview pane)
- **Stack**: React + Vite + Framer Motion + Tailwind CSS
- **Description**: Motion-manga style cinematic intro for the Shotgun Ninjas universe featuring Kage-9 (Hayaku Kageru)
- **Scenes**: 5 scenes (~46s loop) — corrupted city, noise sectors, Kage-9 reveal, archive breach, mission lock
- **Fonts**: Space Grotesk (body) + Teko (display)
- **Palette**: deep red (#B91C1C), electric blue (#3B82F6), near-black (#0A0A0F)
- **Key files**:
  - `src/components/video/VideoTemplate.tsx` — main timeline orchestrator
  - `src/components/video/video_scenes/Scene1-5.tsx` — individual scene components
  - `src/lib/video/hooks.ts` — DO NOT MODIFY (recording/export pipeline)
  - `public/images/` — 10 AI-generated scene backgrounds
  - `src/index.css` — glitch effects, CRT overlay, brand variables

### Shotgun Ninja Village (Hub App)
- **Path**: `artifacts/shotgun-ninja-village/`
- **Type**: react-vite (presentation-first, no backend)
- **Stack**: React + Vite + Tailwind CSS + Framer Motion + wouter
- **Description**: Immersive cyber-noir hub for the Shotgun Ninjas universe — tactical command interface aesthetic
- **Port**: 24938 (previewPath: `/`)
- **Pages**: 8 sections
  - `/` — Signal Feed (Home): cinematic hero, priority nodes grid, ecosystem triad (Archive/Community/Merch), universe links
  - `/archive` — The Archive: 3 episodes (EP1 playable, EP2-3 coming soon) + cross-links to Community & Merch
  - `/operators` — Operator Files: Kage-9 classified dossier with character image
  - `/grid` — The Grid Map: 4 world zones with AI images + threat archetypes
  - `/arsenal` — The Arsenal: 5 gear items with AI-generated images
  - `/intel` — Forge Intel: 4 products mapped to in-universe tactical platforms
  - `/community` — The Village: community hub with 7 category channels, trending topics feed, 3-tier member perks
  - `/merch` — Ronin Supply: premium merch storefront with 8 mock products, 6 collections, limited drops section, collection filtering
- **Commerce Architecture**: Shopify-ready service layer (`src/services/store.ts`) with mock mode default; goes live via VITE_SHOPIFY_DOMAIN + VITE_SHOPIFY_STOREFRONT_TOKEN env vars
- **Community Architecture**: Discourse-ready service layer (`src/services/community.ts`) with async data loading; mock mode default; goes live via VITE_DISCOURSE_URL + VITE_COMMUNITY_MODE=live env vars. SSO via VITE_DISCOURSE_SSO=true + VITE_DISCOURSE_SSO_LOGIN_URL. Embed via VITE_DISCOURSE_EMBED=true. Signup via VITE_DISCOURSE_SIGNUP_URL (fallback: shotgunninjas.com/join). Gated categories: ronin-lounge, founders-chamber. Discourse group mapping: ronin-supporters, founding-ninjas.
- **Integration Config**: `src/config/integrations.ts` — provider config for Shopify, Discourse (URL, SSO, embed, signup, groups, gated categories), and auth. No API keys in client code.
- **Routing**: wouter with BASE_URL support; image paths use `asset()` helper for subpath deployment safety
- **Fonts**: Space Grotesk (body) + Teko (display)
- **Palette**: deep red (#B91C1C/#DC2626), electric blue (#3B82F6/#60A5FA), near-black (#0A0A0F)
- **PWA**: Installable on mobile/desktop via manifest.json + service worker; install button in sidebar + mobile header (auto-hides when installed)
- **Key files**:
  - `src/App.tsx` — wouter router with 8 routes
  - `src/components/layout/Layout.tsx` — tactical sidebar layout with install button, Community + Ronin Supply nav, Main Site link
  - `src/hooks/useInstallPrompt.ts` — PWA install prompt hook (beforeinstallprompt/display-mode detection)
  - `src/pages/Home.tsx`, `Archive.tsx`, `Operators.tsx`, `Grid.tsx`, `Arsenal.tsx`, `Intel.tsx`, `Community.tsx`, `Merch.tsx`
  - `src/data/transmissions.ts` — shared trilogy config (single source of truth)
  - `src/data/products.ts` — 8 mock products, 6 collections with full variant/SKU data model (Printful-ready)
  - `src/data/community.ts` — 8 forum categories (7 open + 1 gated) with Discourse IDs, 6 featured topics with excerpts/avatars, 9 member perks across 3 tiers, community stats
  - `src/services/store.ts` — store service abstraction (mock → Shopify transition)
  - `src/services/community.ts` — community service abstraction (mock → Discourse transition)
  - `src/config/integrations.ts` — env-based config for Shopify, Discourse, auth
  - `src/index.css` — cyber-noir theme with glitch effects, scanlines, tactical borders
  - `public/manifest.json` — PWA manifest (standalone, theme #B91C1C)
  - `public/sw.js` — minimal service worker for installability
  - `public/images/` — 14+ AI-generated images (hero, character, zones, arsenal, episodes, icons)

### Shotgun Ninjas - Episode 2: Forge Protocol
- **Path**: `artifacts/shotgun-ninjas-ep2/`
- **Type**: video-js (animated video, not deployable — export from preview pane)
- **Stack**: React + Vite + Framer Motion + Tailwind CSS
- **Description**: 16-scene motion-manga where Kage-9 discovers BrandForge OS, infiltrates a counterfeit signal hub, reclaims stolen signal
- **Port**: 23317 (previewPath: `/shotgun-ninjas-ep2/`)
- **Color arc**: corrupted reds → intensifying blue as BrandForge awakens → clean blue-white signal reclamation
- **Key files**:
  - `src/components/video/VideoTemplate.tsx` — 16-scene timeline orchestrator
  - `src/components/video/video_scenes/Scene1-16.tsx` — individual scene components
  - `src/lib/video/hooks.ts` — DO NOT MODIFY (recording/export pipeline)
  - `public/images/` — 9 AI-generated anime-style scene images

### Shotgun Ninjas - Episode 3: Fracture Scan
- **Path**: `artifacts/shotgun-ninjas-ep3/`
- **Type**: video-js (animated video, not deployable — export from preview pane)
- **Stack**: React + Vite + Framer Motion + Tailwind CSS
- **Description**: 18-scene industrial cyber-noir motion-manga — Kage-9 discovers TorqueShed mechanical intelligence console, exposes sabotaged transport, reveals the counterfeit lattice has moved into infrastructure
- **Port**: 20118 (previewPath: `/shotgun-ninjas-ep3/`)
- **Color arc**: dead steel grays/ember red → intensifying blue as TorqueShed activates → combined blues with hard industrial whites
- **Fonts**: Teko (display) + Space Grotesk (body)
- **Key files**:
  - `src/components/video/VideoTemplate.tsx` — 18-scene timeline with persistent background layers
  - `src/components/video/video_scenes/Scene1-18.tsx` — individual scene components
  - `src/lib/video/hooks.ts` — DO NOT MODIFY (recording/export pipeline)
  - `public/images/` — 18 AI-generated industrial/mechanical scene images
