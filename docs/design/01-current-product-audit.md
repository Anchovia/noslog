# NosLog 2.0 Current Product Audit

## Document Control

- Status: `Approved for information-architecture planning`
- Evidence status: `Observed from repository and representative browser pass`
- Browser verification: `Pass 1 complete; rare and unpublished states pending`
- Date started: 2026-07-29
- Scope decisions confirmed: 2026-07-29
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
- Signed-in browser inspection using representative development data at `390 × 844`
  and `1440 × 900`

The first browser pass covers representative signed-in user pages, administrator
pages, all three locales, and the chart-preview exception. Rare, destructive,
permission-denied, loading, and unpublished states still require targeted evidence
where they can be reproduced safely.

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

### Browser Observation Pass 1

The browser evidence below was collected on 2026-07-29 from the running local
development server. It used the signed-in representative profile with ID `8`, which
also has administrator access. The viewports were `390 × 844` and `1440 × 900`.

These are current-product observations. They do not approve a NosLog 2.0 width,
layout, hierarchy, or component decision.

#### Representative User Pages at 390px

| Page family      | Example path                                   | Document height | Observed behavior                                                                                        |
| ---------------- | ---------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------- |
| Home             | `/ko`                                          | `985px`         | Announcement, identity, search, quick links, feedback, and official-news content render in one column.   |
| Music discovery  | `/ko/music`                                    | `1,747px`       | Search, filters, sorting, view controls, and music results fit without horizontal document overflow.     |
| Music discovery  | `/ja/music`                                    | `2,132px`       | Japanese UI and original titles fit without horizontal overflow; the page is taller than the ko/en pass. |
| Music discovery  | `/en/music`                                    | `1,747px`       | English controls and labels fit without horizontal document overflow.                                    |
| Music detail     | `/ko/music/59d7…/real`                         | `1,060px`       | Difficulty controls and four content tabs render inside the 390px shell.                                 |
| Rankings         | `/ko/rankings`                                 | `844px`         | Mode, metric, and region controls fit within the viewport width.                                         |
| Tier lists       | `/ko/tiers`                                    | `3,953px`       | Multiple tier bands form a long single-column reading flow.                                              |
| Bingo list       | `/ko/bingo`                                    | `6,010px`       | Filters and many bingo cards produce the longest inspected user-page scroll.                             |
| Exams            | `/ko/exams`                                    | `913px`         | Mode, advice, grade selection, and stage content fit without horizontal overflow.                        |
| Arcade discovery | `/ko/gamecenter`                               | `844px`         | Region and search controls plus the available arcade result fit in one column.                           |
| Data sync        | `/ko/bookmarklet`                              | `1,346px`       | Status, token, bookmarklet, sync result, and illustrated instructions form a sequential flow.            |
| Public profile   | `/ko/profile/8`                                | `1,758px`       | Owner controls and record analytics render in the same single-column shell.                              |
| Profile settings | `/ko/profile/settings`, `/en/profile/settings` | `2,128–2,200px` | Eight settings groups and destructive account controls form a long settings flow in both locales.        |

No horizontal document overflow was measured on these representative mobile pages.
The different Japanese music-list height is a localization stress signal to investigate
with representative translated content; this pass does not assign a cause or prescribe
a layout response.

#### Header Interaction at 390px

- The header begins at `y = 0` with a measured height of `56px`.
- After scrolling down to `700px`, the header moves to `y = -56px`.
- After scrolling back up to `350px`, it returns to `y = 0`.
- This confirms the implemented hide-on-downward-scroll and reveal-on-upward-scroll
  behavior in the rendered UI.

#### Desktop Shell at 1440px

- Home, music discovery, music detail, rankings, the administrator dashboard, and
  inspected administrator list/management pages retained a centered `390px` main
  column. Its measured horizontal position was `x = 525px`.
- Dense administrator tasks such as music, user, exam, bingo, arcade, and sync
  management therefore remain vertically stacked rather than using the available
  desktop width.
- Representative resulting page heights included approximately `7,335px` for
  administrator music, `3,246px` for administrator bingo, `2,990px` for administrator
  exams, `2,365px` for administrator arcades, and `2,289px` for administrator users.
- This confirms the existing shell constraint. It does not make `390px` the NosLog 2.0
  desktop baseline.

#### Chart Viewer Exception

- The administrator chart preview intentionally escapes the normal shell width.
- Its falling view measured `364 × 574px` inside the 390px viewport and
  `1,022 × 612px` at the desktop width.
- The full-sheet view uses horizontally scrollable four-measure columns. At 390px,
  the scroll region measured `364px` wide with `1,164px` of horizontal content, and
  each inspected chart canvas measured `274 × 718px`.
- The preview exposes play, restart, seek, local audio, note-speed, metronome,
  metronome-volume, and strict-performance controls.
- The inspected chart had an administrator preview but no published public revision:
  its public pattern URL correctly rendered the localized not-found state.
- The administrator preview currently renders two nested `main` landmarks. This is an
  observed accessibility-structure issue to address during the appropriate design or
  implementation phase.

#### Observed Usability Symptoms

- Wide desktop viewports leave substantial unused horizontal space on ordinary user
  and administrator pages.
- Dense lists and management tools become very long single-column pages.
- Information-rich user pages such as bingo, tier lists, profile, and settings also
  rely heavily on vertical sequencing.
- The chart viewer already requires a different responsive model from ordinary content
  pages because its visualization has an intrinsic minimum useful width.
- Japanese and English must be tested with real long content rather than assumed to
  behave identically to Korean.

These symptoms identify investigation targets only. They do not yet authorize a
specific grid, breakpoint, maximum width, navigation model, or content removal.

### Browser Evidence Still Required

- signed-out login, browsing, and localized first-entry behavior in a clean session;
- a published public chart revision, because the inspected chart was preview-only;
- representative empty, loading, request-error, disabled, permission, and destructive
  states where they can be reproduced safely;
- long translated music titles and extreme real record values in all three locales;
- keyboard traversal, visible focus, menu focus management, and reduced-motion behavior;
- representative screenshots after the audit decisions determine which states must be
  retained as formal comparison evidence.

## Confirmed Audit Decisions

### Priority User Page Families

1. **Home is the primary entry experience.** It must help a newly landed user
   understand where to go and obtain important information immediately.
2. **Music discovery and music detail are primary product tasks.** Music lookup is
   expected to be one of the most frequent behaviors for a rhythm-game service, so
   discovery and detail must be treated as a connected high-priority journey.
3. **Tier lists are a primary play-planning task.** Many users choose what to play by
   following tier-list progression, so the tier experience is also a high-priority
   page family.

These priorities determine research and pilot-screen order. They do not imply that
other verified features may be removed silently.

### Feature Disposition

- No existing feature is currently scheduled for removal or deferral.
- All verified user-facing functions remain in scope unless later evidence supports a
  change and the user explicitly approves it.
- Information architecture may consolidate, regroup, or progressively disclose
  functions, but this must not remove their capability or discoverability without a
  separate approved decision.
- Potential removal or deferral candidates discovered during page briefs or reference
  research must be presented with evidence and tradeoffs for discussion.

### Administrator Scope

- Administrator functionality remains documented as part of the current product.
- The administrator interface is excluded from the NosLog 2.0 user-interface redesign.
- During the NosLog 2.0 user-facing work, administrator pages receive functional
  maintenance only unless separately authorized.
- A production-level administrator redesign may begin as a distinct post-2.0 phase.

## Remaining Audit Follow-up Questions

These are audit questions, not design proposals:

1. Are there private or rare states that cannot be safely reproduced in the development
   database and should instead be documented from code?
2. Which published chart, longest translated titles, and extreme record values should
   become the formal stress-test fixtures?

## Next Audit Actions

1. Identify representative stress-test data and any states that must remain code-only
   evidence.
2. Keep this inventory synchronized when approved 2.0 contracts add capabilities such
   as user official-chart contribution without misrepresenting them as current code.
3. Keep broad administrator redesign outside 2.0 while documenting the review workflow
   required by an approved user contribution feature.
