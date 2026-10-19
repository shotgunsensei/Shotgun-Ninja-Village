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
3. Run `pnpm run build`; the API artifact builds and serves the Village SPA from the same origin.
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
