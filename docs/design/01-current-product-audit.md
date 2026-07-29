# NosLog 2.0 Current Product Audit

## Document Control

- Status: `Draft`
- Evidence status: `Observed from repository`
- Browser verification: `Pending`
- Date started: 2026-07-29
- Canonical language: English
- Korean companion:
  [01-current-product-audit.ko.md](./01-current-product-audit.ko.md)
- Scope: NosLog v1.6.0 user application, shared system states, and administrator
  application
- Decision authority: This document records the current product. It does not approve
  a NosLog 2.0 information architecture, visual direction, page contents, or feature
  removal.

## Purpose

This audit captures the product functions and states that must be understood before
NosLog 2.0 page briefs or design decisions are made. Repository observations are
recorded as facts. Missing browser evidence, ambiguous behavior, proposed changes, and
future decisions remain explicitly unresolved.

## Evidence Reviewed

- Next.js App Router page, layout, route-handler, and proxy structure
- Shared layout, navigation, localization, theme, and UI components
- Page-level server data loading and client interaction components
- Prisma data model
- Existing Vitest and Playwright coverage
- Project README for the v1.6.0 feature and operating baseline

The actual rendered UI, real-data content lengths, signed-in states, and responsive
behavior still require browser verification.

## Current Product Architecture

### Application Shells

| Shell                | Source                                                                                   | Observed behavior                                                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| User shell           | `app/(nevigation)/layout.tsx`                                                            | Shared skip link, header, main area, and footer. The current shell is capped at `390px` (`max-w-97.5`) even on wider viewports.                              |
| Authentication shell | `app/(auth)/layout.tsx`                                                                  | Standalone authentication and onboarding pages with a skip link and no standard header/footer. Search indexing is disabled.                                  |
| Administrator shell  | `app/admin/layout.tsx`                                                                   | Requires the administrator role, then renders the shared header/footer and an administrator navigation control. The current shell is also capped at `390px`. |
| System states        | `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`, `app/maintenance/page.tsx` | Localized route error, global error, not-found, retry, and maintenance experiences.                                                                          |

`nevigation` is the current source route-group name. It is not exposed in the public
URL.

### Localization and URL Rules

- Supported user locales are Korean (`ko`), Japanese (`ja`), and English (`en`).
- User-facing pages use locale-prefixed paths such as `/ko/music`, `/ja/music`, and
  `/en/music`.
- A non-localized user request is redirected using, in order, path locale, signed-in
  preference, locale cookie, and browser `Accept-Language`.
- Administrator, API, Discord OAuth, and framework paths are not locale-prefixed.
- Signed-in users store a locale preference. Signed-out users can change language from
  the header menu.
- The music-title preference can show an approved Korean or English translation, or
  the stored Japanese reading title, while preserving the original title.
- User pages and global system states are localized. Administrator pages remain Korean.

### Authentication and Permission Rules

- Discord OAuth is the login method.
- A signed-in account with an incomplete profile is redirected to onboarding.
- `/profile/settings` and `/onboarding` require authentication.
- A completed account cannot return to onboarding.
- Public content remains available without login, but personal records, editable bingo
  progress, exam submissions, preferred arcade selection, and private analytics depend
  on authentication.
- Administrator pages require an authenticated user whose role is `admin`; other users
  receive the not-found response.
- The user session lasts up to 14 days and uses an HTTP-only `SameSite=Lax` cookie.

## User Page and Feature Inventory

Routes below are shown with `[locale]` standing for `ko`, `ja`, or `en`.

| Family               | Route                                          | Access                                          | Observed content and functions                                                                                                                                                                                                                                                                                                                                               |
| -------------------- | ---------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home                 | `/[locale]`                                    | Public                                          | Published announcements; NosLog identity and tagline; global music search; quick links to music, rankings, bingo, tiers, exams, and arcades; data-sync guide link; feedback dialog; official NOSTALGIA X timeline.                                                                                                                                                           |
| Music discovery      | `/[locale]/music`                              | Public with personal enhancements               | Title/artist/index search; category filters; Normal, Hard, Expert, and Real filters with level ranges; signed-in record filters; name, level, recent-play, and weakness sorting; ascending/descending order; list/grid view; cursor-based progressive loading; empty result state.                                                                                           |
| Music detail         | `/[locale]/music/[index]/[difficulty]`         | Public with personal enhancements               | Difficulty switching and record, information, ranking, tier, and community/evaluation tabs; original and localized titles; jacket and metadata; personal record analytics; global music ranking; tier placement; user evaluation and voting features; canonical difficulty redirect and not-found states.                                                                    |
| Public chart viewer  | `/[locale]/music/[index]/[difficulty]/pattern` | Public when a valid chart revision is published | Music header and back navigation; falling and full-sheet tabs; left/right-hand legend; falling playback with play, restart, seek, local audio, note speed, metronome, metronome volume, and optional strict performance; full sheet grouped by four musical measures with timing labels; invalid or unpublished chart returns not-found. Local audio remains in the browser. |
| User rankings        | `/[locale]/rankings`                           | Public with current-user enhancement            | Basic/Recital mode; grade/rating metric where supported; all/Korea/Japan/global region filter; seven-row pagination; current user ranking; cached client transitions; loading and request-error states.                                                                                                                                                                      |
| Tier lists           | `/[locale]/tiers`                              | Public with personal record enhancement         | Basic/Recital mode; S, Full Combo, and Pianist goal selection; difficulty and official-level filters; explanatory guide and rating-weight chart; tier bands loaded progressively; per-chart record details for signed-in users; loading, retry, empty, and no-published-list states.                                                                                         |
| Legacy tier redirect | `/[locale]/tiers/[slug]`                       | Public                                          | Resolves the legacy list to the integrated mode/goal tier page and redirects.                                                                                                                                                                                                                                                                                                |
| Bingo list           | `/[locale]/bingo`                              | Public with personal progress                   | Published and currently available bingos; resume card; all/in-progress/chance/completed filters; progress sorting; mini board, progress, completion, reward, availability, and empty state.                                                                                                                                                                                  |
| Bingo detail         | `/[locale]/bingo/[id]`                         | Public; progress editing requires login         | Cover music and translated title; description; line/cell progress; reward; 5-by-5 mission board; mission filters and list; selected mission details; authenticated completion editing; unavailable or invalid bingo returns not-found.                                                                                                                                       |
| Exams                | `/[locale]/exams`                              | Public; proof submission requires login         | Basic/Recital modes; exam selection; requirements, rewards, stages and allowed charts; stored personal best values; simulation/advice; achievement and submission state; private proof upload; no-published-exam state.                                                                                                                                                      |
| Arcade discovery     | `/[locale]/gamecenter`                         | Public; preferred arcade requires login         | Region scope; arcade distribution map; text search; region-grouped list; expandable arcade details; location map, address copy, external Kakao Map link, machine count, price, operating status, business hours, notes, preferred-user count, and preferred arcade selection.                                                                                                |
| Data sync            | `/[locale]/bookmarklet`                        | Public guide; token and history require login   | Current sync status; latest result and analytics; bookmarklet installation and execution guide; GIF guidance; login prompt; signed token generation; token-regeneration warning and confirmation; processing, completed, failed, and no-sync states.                                                                                                                         |
| Public profile       | `/[locale]/profile/[id]`                       | Public with owner-only analytics/actions        | Profile identity, Basic/Recital switching, grade and global/country rank, summary, grade trend, rank distribution, best plays, recent plays, privacy-controlled fields, owner judgement analytics, share function, settings entry, and owner logout. Invalid/private-missing profile returns not-found.                                                                      |
| Profile settings     | `/[locale]/profile/settings`                   | Authenticated                                   | Avatar upload; dark/light theme; display language; localized music-title toggle; preferred arcade; nickname; country/region; linked Discord display fields; profile privacy controls; validation and submission feedback; destructive account deletion confirmation.                                                                                                         |
| Privacy policy       | `/[locale]/privacy`                            | Public                                          | Fully localized policy covering collected information, collection, retention, third parties, international transfer, deletion, user rights, cookies, security, contact, and changes.                                                                                                                                                                                         |
| Login                | `/[locale]/login`                              | Signed-out                                      | Discord OAuth entry, localized OAuth error messages, privacy notice, home navigation, and browse-without-login action. Signed-in users are redirected home.                                                                                                                                                                                                                  |
| Onboarding           | `/[locale]/onboarding`                         | Signed-in incomplete profiles                   | Initial profile completion for the newly authenticated user. Completed profiles are redirected home.                                                                                                                                                                                                                                                                         |
| Maintenance          | `/[locale]/maintenance` through proxy handling | Public system state                             | Localized service-maintenance message. API requests receive a `503` response while the maintenance mode is active.                                                                                                                                                                                                                                                           |

## Shared User Navigation and Global Functions

### Header

- Sticky 56px header.
- NosLog home link.
- Primary navigation: music, rankings, and tiers.
- Signed-out login action or signed-in profile avatar.
- Secondary menu: bingo, exams, arcades, and data sync.
- Administrator entry appears for an administrator.
- Signed-out secondary menu includes the locale switcher.
- On viewports below `1024px`, the header hides after downward scrolling and reappears
  near the top, on upward scrolling, or while keyboard focus is inside it.
- The menu locks body scrolling while open and closes with `Escape`.

### Footer

- Copyright.
- Privacy policy.
- GitHub repository.

### Global Preferences and Feedback

- Dark theme is the default; light theme is stored locally in the browser.
- Locale is stored in session/user data or a locale cookie.
- Localized music-title visibility is stored in the user profile.
- Global success/error notifications use a bottom-centered toast region.
- A skip link targets the single main content area.

## Administrator Page and Feature Inventory

Administrator routes are Korean-only and use `/admin`.

| Family                      | Routes                                                  | Observed content and functions                                                                                                                                                                                                      |
| --------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Operations dashboard        | `/admin`                                                | Service summaries; recent seven-day activity; processing-required tasks; content-management shortcuts.                                                                                                                              |
| Announcements               | `/admin/announcements`                                  | Create, edit, publish/unpublish, order by recency, and delete home announcements; empty state.                                                                                                                                      |
| Arcades                     | `/admin/arcades`                                        | Create and edit arcade name, region, coordinates, address, machine count, play price, coin count, operating status and note, business hours, general notes, and active state; empty state.                                          |
| Users                       | `/admin/users`                                          | Search by NosLog/NOSTALGIA/Discord identity; all/attention filtering; identity, country, role, play count, last play, sync health and data-count summaries; profile link; administrator role update; sync-token reset; empty state. |
| Music list and translations | `/admin/music`                                          | Search music; filter translation locale and status; translation coverage summary; CSV validation/import/export flow; approve a draft translation; empty state.                                                                      |
| Music detail                | `/admin/music/[index]`                                  | Edit shared music metadata and per-difficulty chart metadata; edit Korean and English translation title/status; display Japanese reading data; enter chart-pattern editor.                                                          |
| Chart editor and preview    | `/admin/music/[index]/[difficulty]/pattern`, `/preview` | Timing, BPM, meter and offset editing; note and path editing; local audio; history, save, revision, restore, publish and conflict handling; preview of the current draft in the public viewer UI.                                   |
| Catalog update review       | `/admin/catalog`                                        | Pending/applied/rejected filters; inspect music catalog change candidates; apply or reject pending candidates; empty state.                                                                                                         |
| Tier-list management        | `/admin/tiers`, `/new`, `/[id]`                         | List active and legacy tier lists; create/update/delete list; status, mode, goal and description; create/update/delete bands; search/filter/paginate charts; place, move, reorder, and remove entries; board and placement editor.  |
| Bingo management            | `/admin/bingos`, `/new`, `/[id]`                        | List bingo status; create/update/delete bingo metadata, availability, cover music, reward and required lines; edit all 25 missions.                                                                                                 |
| Exam management             | `/admin/exams`, `/new`, `/[id]`                         | Search and filter by mode/status; show pending proof count; create/update/delete exam metadata, scoring, requirements, publication, rewards, stages, music and chart choices.                                                       |
| Exam proof review           | `/admin/submissions`                                    | Pending/approved/rejected filters; view private proof image; review note; approve/reject; remove rejected or approved proof data according to the available action; empty state.                                                    |
| Community evaluations       | `/admin/community`                                      | Review chart constants, note-pattern evaluations, comments, reactions and author; delete evaluation; empty state.                                                                                                                   |
| Feedback                    | `/admin/feedback`                                       | Open/resolved filters; private attachment inspection; user profile link; message review; resolve or reopen report; empty state.                                                                                                     |
| Sync operations             | `/admin/syncs`                                          | All/processing/completed/failed filters; recent completion/failure/processing/stale summaries; per-sync received/inserted/changed counts; snapshot/history completeness and health classification; error details; empty state.      |

The administrator menu currently exposes 13 top-level destinations through a compact
dropdown grid.

## Current Visual and Component Baseline

This section records implementation facts only. NosLog 2.0 is not constrained to retain
these values.

### Current Foundations

- Local variable Pretendard is the global font.
- The app supports dark and light semantic color tokens.
- Existing semantic token groups cover backgrounds, surfaces, text, interaction,
  status, chart/score, ranks, difficulties, exam modes, genres, Discord, and card
  radius.
- The current named type utilities are display, score display, title, wordmark,
  section, body, muted body, label, caption, micro, badge, and input.
- The shared user and administrator shells currently use a 390px maximum width.

### Current Shared UI Components

- Button: primary, secondary, ghost, danger; small, medium, large, and icon sizes.
- Badge: neutral, outline, state, difficulty, mode, score, and rank variants.
- Card: card, header, title, and content primitives.
- Switch.
- Global toaster.
- Radix Dialog, Popover, Select, Slider, Switch, and Tabs are also used directly by
  feature components.

Many feature pages still contain locally styled controls and cards instead of using the
small shared component set. This is an implementation observation, not yet an approved
consolidation plan.

## Primary Data Domains

The Prisma schema currently contains 34 models covering these product domains:

- user identity, profile, privacy, role, and brooches;
- announcements and feedback;
- arcades and preferred arcade;
- music catalog, translated titles, charts, and catalog candidates;
- chart patterns, revisions, timing documents, and evaluations;
- data sync attempts, play history, snapshots, and level-constant history;
- tier lists, bands, entries, and placement history;
- personal best grades and play data;
- bingos, cells, and user progress;
- exams, stages, allowed charts, rewards, submissions, and achievements.

## Existing Product Verification Baseline

### Automated Checks

- ESLint, TypeScript, Vitest, production build, Prisma migration, seeded E2E, and
  Playwright are part of the documented CI flow.
- Public E2E coverage verifies:
    - Korean, Japanese, and English paths;
    - one main landmark, one level-one heading, a skip link, and named controls;
    - no horizontal overflow on core 390px pages;
    - header navigation;
    - signed-out login and browsing;
    - music list sorting and view mode;
    - music-detail signed-out state;
    - ranking mode changes;
    - bingo filter/sort interaction;
    - exam accordion interaction;
    - tier mode/goal controls;
    - absence of unhandled browser errors;
    - relaxed desktop performance boundaries.

### Browser Verification Still Required

The local development server was unavailable when the first browser pass was attempted.
The following evidence is therefore still pending:

- current screenshots and visible hierarchy for every page family;
- signed-out and signed-in differences;
- real content lengths and representative extreme data;
- 390px mobile behavior;
- desktop behavior and the effect of the current 390px shell cap;
- header scroll behavior;
- empty, loading, error, permission, and destructive states where they can be safely
  reproduced;
- chart viewer controls and visualization at mobile and desktop widths;
- administrator workflows at desktop width.

## Unresolved Audit Questions

These are audit questions, not design proposals:

1. Which page families currently receive the most real-world use?
2. Which signed-in account and sample records should be treated as representative for
   visual verification?
3. Are any current routes or features intentionally scheduled for removal regardless
   of the redesign?
4. Should administrator screens remain part of the NosLog 2.0 visual redesign after
   the user-facing product is complete, or only receive functional maintenance?
5. Are there private or rare states that cannot be safely reproduced in the development
   database and should instead be documented from code?

## Next Audit Actions

1. Start the existing local development server and sign in with the representative
   development account.
2. Verify user page families at 390px and a desktop width.
3. Verify owner-only profile, settings, sync, bingo, exam, and chart-viewer states.
4. Verify administrator pages at a desktop width.
5. Add browser evidence and observed usability symptoms to this document without
   making design decisions.
6. Review the completed audit with the user and obtain approval before information
   architecture or page-family decisions begin.
