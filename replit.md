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
  - `public/images/` — 7 AI-generated scene backgrounds
  - `src/index.css` — glitch effects, CRT overlay, brand variables
