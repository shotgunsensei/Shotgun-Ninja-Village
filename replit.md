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
- **Pages**: 6 sections
  - `/` — Signal Feed (Home): cinematic hero, priority nodes grid
  - `/archive` — The Archive: 3 episodes (EP1 playable, EP2-3 coming soon)
  - `/operators` — Operator Files: Kage-9 classified dossier with character image
  - `/grid` — The Grid Map: 4 world zones with AI images + threat archetypes
  - `/arsenal` — The Arsenal: 5 gear items with AI-generated images
  - `/intel` — Forge Intel: 4 products mapped to in-universe tactical platforms
- **Routing**: wouter with BASE_URL support; image paths use `asset()` helper for subpath deployment safety
- **Fonts**: Space Grotesk (body) + Teko (display)
- **Palette**: deep red (#B91C1C/#DC2626), electric blue (#3B82F6/#60A5FA), near-black (#0A0A0F)
- **Key files**:
  - `src/App.tsx` — wouter router with 6 routes
  - `src/components/layout/Layout.tsx` — tactical sidebar layout
  - `src/pages/Home.tsx`, `Archive.tsx`, `Operators.tsx`, `Grid.tsx`, `Arsenal.tsx`, `Intel.tsx`
  - `src/index.css` — cyber-noir theme with glitch effects, scanlines, tactical borders
  - `public/images/` — 14 AI-generated images (hero, character, zones, arsenal, episodes)
