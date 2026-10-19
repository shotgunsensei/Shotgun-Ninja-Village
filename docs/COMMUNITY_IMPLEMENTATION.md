# Village Community Implementation

## Delivered capability map

| Site promise                    | Implemented behavior                                                                                                       | Access boundary                                                                                       |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Free operator account           | Name, email, unique lowercase callsign, password, consent, optional transmission-alert opt-in                              | Public signup; password is salted with scrypt and never returned                                      |
| Sign in and persistent identity | Opaque 30-day HTTP-only cookie backed by a hashed server-side session token                                                | Active accounts only; origin checks and rate limits protect writes                                    |
| Public message boards           | Nine named channels with live database counts and search                                                                   | All public channels are visitor-readable                                                              |
| Post, reply, and connect        | Topic creation, replies, owner edits/removal, operator links, live counts and activity times                               | Free account required to write; Dojo announcements are admin-created                                  |
| Supporter and founder rooms     | Ronin Lounge and Founders Chamber exist and enforce tier checks on API reads and writes                                    | Supporter/founder assignment is server-controlled; no client-side self-upgrade                        |
| Operator profile                | Display name, callsign, bio, signal color, alignment, tier, public earned badges                                           | Email, consent, password data, session data, and raw watch history stay private                       |
| Badges and profile flair        | Village Initiate, Alignment Locked, Archive Enlisted, Full Transmission, Signal Starter, Village Voice, Supporter, Founder | Calculated from trusted account/progress/community records; paid badges require a server-granted tier |
| Existing site milestones        | Local quiz and watch progress sync into the authenticated profile on sign-in and as milestones occur                       | Server merges progress; it does not erase already-earned progress                                     |
| Transmission alert consent      | Opt-in is persisted and mirrored to the existing signup list; opt-out removes the address from that list                   | Actual campaigns require the production mailing provider/workflow                                     |
| Visitor-safe failure behavior   | Loading skeletons, empty states, inline validation, 401/403/404 states, and honest API outage messaging                    | No mock forum users, counts, or posts are presented as live                                           |

## Data model

- `village_users`: account, role/tier, profile, progress, consent, and lifecycle state.
- `village_sessions`: hashed opaque tokens with expiry and cascading account cleanup.
- `village_forum_topics`: channel, owner, title, activity, moderation, and view data.
- `village_forum_posts`: original posts and replies with owner editing and soft deletion.
- `signups`: existing archive/transmission email list, reused instead of creating a second list.

Migration: `lib/db/drizzle/0000_village-community.sql`

## Release sequence

The configured Replit post-merge script only performs frozen dependency setup. It
must not push schemas or apply migrations. Source configuration does not establish
whether a GitHub merge invokes a particular deployed Replit environment; verify
that source/deployment coupling separately before release.

1. Configure `DATABASE_URL`, `APP_ORIGIN`, `PORT`, and secure production cookies.
2. Treat any database migration as a separate owner-controlled operation: review
   the exact committed migration and target database identity, confirm a
   recoverable backup and restoration plan, arrange a write pause when required,
   and obtain explicit approval before running
   `pnpm --filter @workspace/db run migrate` against that confirmed target.
   A source merge or dependency setup is not approval to alter a database. Check
   the resulting schema and readiness before resuming writes or promoting the app.
3. Run `pnpm run build`; the API artifact builds and serves the Village SPA and
   all three episodes from the same origin. The API-only release command
   `pnpm --filter @workspace/api-server run build` also builds all four frontends.
4. Smoke test visitor board reads, signup, login, topic creation, reply, edit/remove, public profile, badge sync, logout, and gated-room denial.
5. Connect the opted-in `signups` list to the approved mailing provider before scheduling transmission campaigns.

Run `node --test scripts/post-merge.test.mjs` to verify the hook with a disposable
fake `pnpm`; this test performs no actual installation or database operation.

Grant a verified operator moderation or paid access from a trusted server shell only:

```powershell
pnpm --filter @workspace/api-server operator:access -- --callsign kage-9 --role admin --tier founder
```

## Security and monetization boundaries

- Public board content is plain text and React-escaped; HTML injection is not accepted.
- Premium room authorization is enforced in the API, including unfiltered topic feeds.
- Supporter/founder tier changes are not exposed to client APIs.
- Admin/moderator privileges are never derived from client claims.
- Missing database or provider configuration produces errors, never fake success.

## Same-origin episode releases

The API release builds Village at `/` and Episodes 1–3 at
`/shotgun-ninjas-ep1/`, `/shotgun-ninjas-ep2/` and `/shotgun-ninjas-ep3/`.
The release script explicitly supplies each child build's `BASE_PATH`, including
when the API environment inherits `BASE_PATH=/`. Keep the sibling frontend
`dist/public` directories beside the API artifact in the deployed workspace;
shipping only `api-server/dist` omits the web outputs. The root build still
produces all six configured entries, including the separate mockup artifact.

Episode directories are mounted before Village's SPA fallback. Bare episode
URLs redirect to a trailing slash; valid HTML, JS, CSS and public scene assets
support GET/HEAD. Unknown episode paths and absent episode outputs return 404
instead of Village HTML, including requests accepting HTML. `/api` JSON errors,
authentication, session and paid-room policies keep their existing precedence.
No database migration, Replit router setting or publication is part of this change.

Direct standalone episode commands retain their existing `BASE_PATH` behavior;
their Vite configuration and base-aware scene-image references are unchanged.
The integrated API serves Village at the root. Hosting the entire Village under
another prefix is outside this topology: its transmission links remain root paths.

Before publication, run the canonical build and
`node scripts/verify-build-outputs.mjs`, then exercise each episode URL, its
emitted JS/CSS/favicon and every public scene image at the intended API origin.
Verify missing episode assets return 404, `/archive` still loads Village, and
`/api` errors stay JSON. Local loopback acceptance with external fonts blocked
establishes serving and initial rendering; it does not certify live routing,
external fonts, full playback timing, audio or production visual acceptance.
