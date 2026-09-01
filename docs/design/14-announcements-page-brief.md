# NosLog 2.0 Announcements Archive and Detail Page Brief

## Document Control

- Status: `Approved`
- Decision status: `Complete announcements contract approved: one authoritative
NosLog-authored announcement system; distinct active service-critical and routine
Home placements; localized public Archive and Detail routes; concise chronological
listing; bounded URL pagination; restricted Markdown; scheduling and expiry;
locale-specific modification disclosure; stable multilingual identity; responsive
behavior; accessibility; search metadata; and browser acceptance`
- Evidence status: `Repository, schema, administrator flow, current-interface, and
authenticated browser inspection; approved information architecture and Home page
contract; more than twenty cited accessibility, content, production announcement,
changelog, and rhythm-game references; and the user-approved decision record`
- Date started: 2026-08-03
- Last decision update: 2026-08-03
- Language: English
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Related Home contract:
  [03-home-page-brief.md](./03-home-page-brief.md)
- Scope: NosLog-authored service-critical and routine announcements, localized public
  Archive and Detail destinations, Home-to-announcement handoff, publication and
  expiry meaning, content format, modification disclosure, responsive composition,
  accessibility, localization, search metadata, data requirements, and future
  implementation acceptance
- Excluded: NOSTALGIA official X content, a complete administrator-interface redesign,
  comments, reactions, subscriptions, notification delivery, RSS, announcement search
  and filters, final Foundation tokens, final high-fidelity composition, and
  production implementation in this design-guide session

## Decision Labels

- **Observed:** Verified in the repository, current browser evidence, an approved
  upstream artifact, or a cited source.
- **Approved:** Explicitly agreed with the user and authoritative for downstream design.
- **Proposed:** Evidence-based direction awaiting user approval.
- **Open:** Requires further research, testing, or a user decision.
- **Rejected:** Considered and explicitly not selected.
- **Superseded:** Replaced by a later approved direction.

This brief is authoritative for the public announcement system's product meaning,
content hierarchy, publication behavior, localization, responsive behavior, states,
accessibility, metadata, and acceptance criteria. Exact typography, color, spacing,
surface treatment, radius, elevation, control dimensions, grid tracks, and
content-driven transition values remain Foundation and active high-fidelity design work.
Later visual work may refine expression but must not remove or reinterpret this
product contract.

## Purpose

The announcement system answers three ordered questions:

> Is anything affecting my use of NosLog now, what has NosLog recently announced, and
> where can I read the complete current or historical notice in my language?

It replaces the current Home-only expandable notice with a durable public publishing
system. It is not a general blog, a NOSTALGIA official-news mirror, a social feed, a
support ticket system, or a high-volume product changelog.

## Primary Context and Success

- **Approved upstream:** The Home page may expose one currently active
  service-critical notice before primary search when use of NosLog is materially
  affected.
- **Approved upstream:** The lower Home editorial area exposes the three newest routine
  NosLog announcements as localized title-and-publication-date links immediately
  before the separate NOSTALGIA official-news area.
- **Approved:** Home succeeds when the user can recognize an active service impact or
  choose a recent routine notice without expanding full body content in place.
- **Approved:** The Archive succeeds when the user can scan current and historical
  NosLog notices chronologically, open a specific notice, share or restore the current
  page, and understand when there are no notices.
- **Approved:** Detail succeeds when the selected locale presents the complete title,
  publication date, applicable modification date, and structured body without
  requiring authentication.
- **Approved:** Korean, Japanese, and English pages refer to the same announcement
  identity. A missing translation blocks public publication instead of falling back to
  Korean.
- **Approved:** Mobile around Arcade use is primary, while Desktop remains required and
  must not preserve the current fixed approximately `390px` shell.
- **Approved:** Current styling and geometry are audit evidence, not NosLog 2.0 visual
  authority.

## Current-Product and Domain Evidence

### Repository and Data Evidence

- **Observed:** `Announcement` currently stores one `title`, one `content`,
  `isPublished`, `publishedAt`, `createdAt`, and `updatedAt` value. There is no public
  slug, translation identity, placement, priority, schedule, expiry, constrained rich
  content, or locale-specific public modification timestamp.
- **Observed:** The public query selects only published records, sorts by
  `publishedAt` and `id` descending, caches for five minutes, and returns at most three
  records.
- **Observed:** The current public record shape contains only `id`, `title`, `content`,
  and optional `publishedAt`.
- **Observed:** The Korean administrator form limits the title to `80` characters and
  body to `2,000` characters. Publication is a checkbox, publication happens
  immediately, and an existing `publishedAt` is preserved while the record remains
  published.
- **Observed:** Unpublishing clears `publishedAt`; deletion is a hard delete. The
  current workflow has no translation-completeness validation, schedule, expiry,
  preview, or published-content modification distinction.
- **Observed:** The administrator list returns at most `100` records. Public Archive
  and Detail routes and announcement-specific automated tests do not currently exist.
- **Observed:** Cache invalidation currently covers Home and the administrator page,
  not localized public Archive or Detail destinations.

### Current Interface and Browser Evidence

- **Observed:** Home currently renders up to three announcements as native `details`
  disclosures. Opening one exposes the entire body inline and displaces the Hero,
  search, and primary destinations.
- **Observed:** The inspected development data contained one notice titled
  `프로토타입 테스트중입니다.` with a Korean-only body.
- **Observed:** At `390×844`, the closed notice row fit without document-level
  horizontal overflow. Expanding the body increased the notice area from about `84px`
  to about `200px` and moved the Hero downward.
- **Observed:** At `320×800`, both the title and publication date were truncated with
  ellipses in the current row even though the document itself did not overflow.
- **Observed:** At `1440×900`, the current `main` remained exactly about `390px` wide,
  leaving most Desktop width unused.
- **Observed:** `/ja` and `/en` localized the section heading to `お知らせ` and
  `Announcements`, but the stored title and body remained Korean.
- **Observed:** No Console warnings or errors were recorded during the announcement
  inspection.

### External Evidence

- **Observed:** USWDS Collection guidance treats a compact list as links to complete
  content, recommends that the unique headline itself be the link, uses limited
  metadata such as date, and directs larger catalogs to a separate Archive.
- **Observed:** USWDS and GOV.UK pagination guidance supports URL-addressable pagination
  for chronological Archives, rejects unnecessary pagination for short collections,
  and cautions against infinite scrolling.
- **Observed:** W3C guidance requires descriptive headings, meaningful link purposes,
  correct page language, semantic structure, visible focus, and reflow.
- **Observed:** Google localized-page guidance supports a distinct URL per language
  connected with reciprocal `hreflang`, while Article guidance supports explicit
  headline, publication date, modification date, and organization-author metadata.
- **Observed:** GitHub, Vercel, Notion, Linear, Cloudflare, Discord, Apple, and Steam
  separate Archive/list discovery from complete content. Their advanced filters,
  search, authors, media, RSS, and taxonomy answer volumes and editorial models broader
  than the approved NosLog need.
- **Observed:** Official NOSTALGIA, SOUND VOLTEX, maimai, and osu! news surfaces
  reinforce chronological date-and-title discovery in the rhythm-game context. Their
  legacy presentation, official publishing role, and mixed external content are not
  visual or product authority for NosLog.

## Approved Scope and Invariants

1. One authoritative NosLog-authored announcement record supplies every public Home,
   Archive, and Detail presentation. Home does not maintain a separate copy.
2. Each announcement has one placement role: `Service critical` or `Routine`. The
   same announcement is not duplicated in both Home locations.
3. Home displays at most one highest-priority currently active service-critical notice
   before primary search. It reserves no empty shell when none is active.
4. Home displays at most the three newest routine announcements in the lower editorial
   area. It shows title and publication date only and never expands the body inline.
5. NOSTALGIA official X content stays in its separate approved official-news area and
   never enters the NosLog announcement Archive.
6. The public Archive paths are `/ko/announcements`, `/ja/announcements`, and
   `/en/announcements`.
7. The Archive is reverse chronological by original publication date and shows one
   semantic list. It does not split chronology into visual columns.
8. Each Archive row shows only the complete localized title and localized original
   publication date. It has no summary, thumbnail, author, reading time, reaction,
   visible category Chip, or duplicate `Read more` link.
9. Each Archive page contains at most `20` notices. URL-based pagination appears only
   when a second page exists.
10. Announcement pagination uses an addressable query such as `?page=2`, survives
    refresh and sharing, and never uses infinite scroll or a scrollable inner list.
11. Archive search, filtering, sorting controls, page-size selection, and RSS are not
    part of the approved initial system. They require a future verified user need.
12. Detail exposes one Archive return link, localized `h1`, localized publication
    date, locale-specific modification date when applicable, and the complete
    localized body.
13. Detail does not add author profiles, reading time, share controls, related notices,
    previous/next notices, comments, or reactions.
14. Announcement body supports only approved restricted Markdown: paragraphs, `h2`,
    `h3`, unordered lists, ordered lists, strong emphasis, and links.
15. Raw HTML, body `h1`, tables, images, video, embeds, files, scripts, and custom
    styling are not permitted. Text and links must independently communicate the
    notice.
16. Each locale has an `80`-character title limit and a `5,000`-character Markdown
    body limit. Limits count the stored content consistently and are not inferred from
    rendered pixel width.
17. Publication follows `Draft -> Scheduled or immediate publication -> Published`.
    Schedule, activation, and expiry are explicit data rather than client-only timers.
18. A service-critical announcement has an activation interval. After expiry it
    disappears from the critical Home position but remains in Archive and Detail.
19. A routine announcement may remain published without expiry.
20. A published announcement is unpublished before destructive removal. Previously
    public records are not casually hard-deleted from the administrator list.
21. Korean, Japanese, and English title and body content are all required before any
    announcement becomes public.
22. Every announcement uses one immutable, language-neutral public slug across all
    locale routes. Editing a title does not change its URL.
23. Any post-publication change to visible localized content, including title, body,
    or a visible link, updates that locale's public modification timestamp.
24. Pre-publication edits and administrator-only placement, schedule, priority, or
    internal-state edits do not create a visible content modification date.
25. Detail shows both publication and modification dates when a public modification
    exists. Home and Archive continue to show only original publication date and keep
    their original-publication ordering.
26. Announcement pages are public and equivalent for signed-out and signed-in users.
    They contain no personal read state or account-specific module.
27. Archive and Detail reflow without page-level two-dimensional scrolling at
    `320 CSS px`; Desktop uses a purposeful readable measure instead of a fixed phone
    canvas.

## Terminology and Data Meaning

| Concept                       | Required meaning                                                                     | Must not mean                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Service-critical announcement | A currently relevant NosLog issue or change that materially affects use              | Every routine update, promotional emphasis, or a generic warning style |
| Routine announcement          | A normal NosLog update preserved in the lower Home list and Archive                  | Low-quality or optional data that may be deleted                       |
| Original publication date     | The first time the complete three-language announcement became public                | The latest edit, schedule edit, or Home activation time                |
| Public modification date      | The last post-publication change to visible content for that locale                  | Any database `updatedAt` or internal administrator edit                |
| Activation                    | When a service-critical notice may occupy the critical Home position                 | Initial creation or translation drafting                               |
| Expiry                        | End of service-critical Home prominence                                              | Deletion from historical Archive or invalidation of its Detail URL     |
| Unpublish                     | Intentional removal from public destinations while preserving administration history | Casual permanent deletion                                              |
| Public slug                   | Immutable language-neutral path identity shared across locales                       | A title-derived locale string that changes on edit                     |

### Placement and Priority

- `Service critical` and `Routine` control Home placement, not a visible catalog
  taxonomy.
- If more than one service-critical notice is active, the system uses an explicit
  administrator priority and a deterministic time tie-breaker to choose the single
  Home notice. Other active notices remain available in the Archive.
- The Archive does not expose a category filter or category Chip solely because this
  internal placement field exists.

### Publication and Modification Dates

- `publishedAt` is immutable after first public publication except for an explicitly
  approved data correction.
- Each translation needs its own public-content modification timestamp because one
  language may be corrected without changing the others.
- A first publication has no separate visible modification date.
- Archive order never moves an older notice forward merely because it was corrected.
- Visible dates use localized human-readable formatting and a machine-readable
  `datetime` value.

## Approved Information Hierarchy

### Home Service-Critical Surface

Use this source order only when an active notice exists:

1. concise critical context or label;
2. complete localized notice title as the Detail link;
3. original publication date when it helps orient the user.

The control does not expand the body. It must not become a dismissible marketing
banner, carousel, or permanent empty slot. Dismissal and read-state behavior are not
approved.

### Home Routine Surface

Use this source order:

1. localized section heading;
2. up to three routine announcement title-and-date links in newest-first order;
3. one descriptive `All announcements` Archive link.

Omit the entire routine section when no routine announcement is public. Keep the
separate NOSTALGIA official-news area after it according to the Home contract.

### Archive

Use one semantic `main` and this mobile-first source order:

1. page identity and concise purpose only if required;
2. reverse-chronological announcement list;
3. pagination when more than one page exists.

Do not add a Hero, featured announcement, search field, filter row, category tabs,
result count, or explanatory marketing copy merely to occupy space. The page title and
the notice list should answer the task directly.

### Detail

Use one semantic `article` within `main` and this source order:

1. descriptive Archive return link or breadcrumb-equivalent location cue;
2. localized announcement title as the single page `h1`;
3. original publication date and, when present, locale-specific modification date;
4. restricted-Markdown body in authored source order.

Do not duplicate the Archive return link at the end unless later browser testing proves
that long approved bodies create a real navigation problem. The maximum body length is
bounded and browser Back remains available.

### Wide Composition

- Archive remains a single chronological reading column. Added width may improve page
  framing and readable line length but must not produce two independent chronological
  columns.
- Detail uses an editorial reading measure suitable for Korean, Japanese, and English.
  It does not stretch body lines across the available Desktop viewport.
- No permanent Sidebar is justified by the approved title, dates, and bounded body.
- Exact container width, measure, margins, and transition points remain Foundation and
  downstream design decisions validated with representative content.

## Action Priority

### Archive Actions

- **Primary per item:** open that notice by activating its descriptive title link.
- **Secondary:** navigate to another Archive page when pagination exists.

Do not add a second link to the same Detail destination inside one row.

### Detail Actions

- **Primary:** read the announcement.
- **Secondary:** return to the announcement Archive or follow an authored body link.

There is no emphasized button required on ordinary Detail pages. Body links use normal
link semantics and external destinations identify their external behavior.

## Archive Contract

### List Item Anatomy

Each list item contains:

1. the complete localized title;
2. the localized original publication date.

The title is the only Detail link. It wraps instead of using a destructive fixed-width
ellipsis in the Archive. At compact widths the date may move below the title; it must
not force both values into an unreadable single row.

### Pagination

- Page one is the canonical Archive root without a required `?page=1` suffix.
- Pages after the first use a stable URL query.
- Do not render pagination for zero to `20` notices.
- Pagination exposes previous and next navigation and current-page meaning. Wide
  layouts may expose a compact bounded page-number set; compact layouts may reduce
  visible numbers while preserving accessible first, previous, current, next, and last
  meaning.
- Pagination remains on one visual line and has touch targets that meet the approved
  Foundation accessibility target.
- Invalid or out-of-range pages resolve to a safe first-page or localized not-found
  behavior without rendering an empty successful Archive. Exact redirect status is an
  implementation-level SEO choice.

### Empty Archive

Show one concise localized statement equivalent to `No announcements.` Do not add a
search suggestion, category suggestion, illustration requirement, or disabled
pagination.

## Detail Content Contract

### Restricted Markdown

Allowed authored structures are:

- paragraphs;
- `h2` and `h3` section headings;
- unordered and ordered lists;
- strong emphasis;
- internal and external links.

Rendering must sanitize content with an explicit allowlist. Markdown syntax must not
permit raw HTML, scriptable URLs, arbitrary attributes, custom color, layout, or style.
The administrator authoring experience must preview the same sanitized structure that
public Detail will render, but its final visual redesign belongs to a later
administrator initiative.

### Link Behavior

- Internal NosLog links prefer the active locale and preserve approved route identity.
- External links expose their destination behavior visually and programmatically.
- Link text describes the destination; generic repeated `Click here` or `Read more`
  text is not sufficient when the notice can name the target.
- Long URLs or uninterrupted tokens wrap without page-level overflow.
- Opening a new tab is not the default unless an explicit product or security reason is
  approved later.

### Content Limits

- Title: maximum `80` characters per locale.
- Body: maximum `5,000` stored Markdown characters per locale.
- The body does not accept images, video, embeds, tables, or file attachments.
- Long headings, long Japanese strings, English expansion, lists near the limit, and
  multiple links must be included in representative fixtures.

## Publication and Lifecycle Contract

### Status Model

| Status                             | Public Archive and Detail | Home critical        | Home routine              |
| ---------------------------------- | ------------------------- | -------------------- | ------------------------- |
| Draft                              | Hidden                    | Hidden               | Hidden                    |
| Scheduled before public start      | Hidden                    | Hidden               | Hidden                    |
| Published routine                  | Visible                   | Hidden               | Eligible for newest three |
| Published active service critical  | Visible                   | Eligible by priority | Hidden                    |
| Published expired service critical | Visible                   | Hidden               | Hidden                    |
| Unpublished                        | Hidden from public users  | Hidden               | Hidden                    |

The Archive preserves expired service-critical announcements because expiry ends
prominence, not historical meaning.

### Publication Readiness

Publication is blocked until all of the following are valid:

1. immutable public slug;
2. one approved placement role;
3. Korean, Japanese, and English title and body;
4. title and body length limits;
5. sanitized restricted-Markdown validation;
6. valid schedule and activation ordering;
7. expiry after activation when expiry is present.

Service-critical publication additionally requires enough timing and priority data to
produce deterministic Home behavior.

### Unpublish and Destructive Removal

- Unpublishing removes the record from Home, Archive, Detail, sitemap, and public
  metadata without exposing draft content.
- A request to an unpublished or unavailable public slug uses the shared localized
  not-found experience and does not reveal whether a private record exists.
- Hard deletion of a previously public record is exceptional and belongs behind a
  consequence-led administrator confirmation. Exact retention and administrator
  permissions belong to future implementation and administrator-design work.

## Date and Revision Contract

### Original Publication

- The original publication timestamp is set when the complete announcement first
  becomes public.
- Scheduled publication uses the actual effective public time.
- Unpublish and republish do not silently rewrite historical publication chronology.

### Public Modification

- After first publication, changing any visible localized title, body text, or visible
  authored link updates that locale's public modification timestamp.
- Every public-facing edit counts; the administrator does not need to classify it as
  `major` before users receive transparent modification information.
- Editing Japanese only does not mark Korean or English as modified.
- Draft edits made before first publication do not produce a modification date.
- Placement, priority, schedule, expiry, and other administrator-only edits do not
  produce a localized content modification date unless they also change visible
  content.

### Public Presentation

- Detail presents publication and modification dates together when the modification
  timestamp exists.
- Home and Archive show only original publication date to preserve concise scanning.
- Archive and Home order remain based on original publication date.
- Article metadata uses the same locale-specific public modification date visible on
  the page; it must not expose an unrelated database `updatedAt`.

## URL, Metadata, and Indexing Contract

### Public Routes

- Archive: `/[locale]/announcements`
- Detail: `/[locale]/announcements/[publicSlug]`
- Pagination: `/[locale]/announcements?page=N` for pages after the first

The public slug is generated or explicitly assigned once, is language-neutral, and is
not regenerated from edited titles.

### Locale Identity

- Each Korean, Japanese, and English Detail URL represents one translation of the same
  announcement identity.
- Reciprocal `hreflang` alternatives connect all three available locale routes.
- Each locale page has a self-referential Canonical URL rather than Canonicalizing all
  translations to one language.
- Locale switching on Detail preserves the public slug and opens the equivalent
  translation.

### Metadata

Each Detail page provides localized:

- document title and description derived from approved content;
- Open Graph title, description, URL, and NosLog identity;
- original publication and locale-specific modification date;
- `Article` or another implementation-validated compatible structured-data type with
  NosLog as the organization author/publisher;
- reciprocal alternate-language links.

Images are not required by this brief. Metadata must not invent an announcement image
or reuse copyrighted NOSTALGIA artwork merely to fill an Article image field.

Published Archive and Detail destinations participate in the public sitemap. Draft,
scheduled-before-publication, and unpublished records do not.

## Authentication and Permission Contract

### Public Users

- Signed-out and signed-in users receive the same announcement content and navigation.
- No login prompt, personalized read indicator, dismissal state, or account-dependent
  ordering appears.
- Public rendering must not expose administrator notes, drafts, scheduling controls,
  translation readiness, or priority values.

### Administrator Boundary

The future administrator workflow must support the approved content model, validation,
preview, schedule, activation, expiry, priority, locale-specific modification dates,
unpublish, and exceptional destructive confirmation. This brief does not approve its
final visual layout or broaden administrator access beyond the existing administrator
boundary.

## Responsive Contract

### Compact Archive

- Validate first at representative `390px` and reflow through `320 CSS px`.
- Preserve full title comprehension. Let the title wrap and move the date to a separate
  line when required instead of truncating both values.
- Maintain one chronological column and document-level scrolling.
- Pagination must remain understandable and operable without wrapping into an
  ambiguous second line.
- Do not use horizontal scrolling, fixed phone-width children, or an inner scroll area.

### Compact Detail

- Title, dates, headings, lists, paragraphs, and links wrap within the viewport.
- Heading hierarchy and spacing must preserve authored relationships at `320 CSS px`.
- Long links and Japanese strings wrap safely.
- No body feature requires a hover state.

### Wide Archive and Detail

- The page shell expands beyond the current `390px` maximum while keeping Archive and
  Detail at purposeful readable measures.
- Archive does not become a masonry or multi-column card Grid.
- Detail does not introduce a permanent metadata Sidebar or stretch body text across
  the viewport.
- Added width may improve framing, title/date alignment, and pagination placement
  without duplicating content or changing source order.
- Exact maximum measure and content-driven transition values remain Foundation and
  active high-fidelity design decisions.

### Zoom and Short Viewports

- At browser zoom and short heights, no fixed overlay hides the title, dates, list, or
  body.
- The shared header must follow the approved shell contract: compact auto-hide must
  restore consistently, and neither compact nor persistent-wide behavior may trap
  Archive or Detail navigation behind viewport-height assumptions.

## Accessibility Contract

- Archive uses a semantic heading, unordered list, and list items. Each title is a
  uniquely named link to its Detail page.
- Detail uses one `main`, one `article`, one page `h1`, and authored `h2`/`h3` hierarchy.
- Dates use semantic `time` elements with machine-readable `datetime` values.
- Pagination uses a descriptive `nav` label, list semantics, link semantics, and
  `aria-current="page"` for the current page.
- Visible focus follows the approved Foundation contract and is not clipped by list or
  content containers.
- Link purpose is understandable from visible text or its programmatic context.
- External-link meaning is not indicated by color or an unexplained icon alone.
- Service-critical meaning is conveyed by text and semantics, not color alone.
- Restricted Markdown renders native semantic paragraphs, headings, lists, emphasis,
  and links rather than generic clickable containers.
- Content reflows at `320 CSS px` without page-level two-dimensional scrolling.
- Touch targets meet the approved Foundation target and maintain adequate separation.
- Initial server-rendered Archive and Detail content remains understandable without
  client-side JavaScript. Progressive client behavior must not be required to read a
  notice or follow its primary links.
- Page language matches the active locale; any intentionally embedded foreign-language
  fragment uses appropriate language-of-parts markup when needed.

## Localization Contract

- All public routes and UI labels support Korean, Japanese, and English.
- NosLog-authored title and body content require all three approved translations before
  publication. No public fallback silently substitutes Korean on Japanese or English
  routes.
- The same announcement identity and immutable slug are retained across locales.
- Dates use locale-appropriate visible formatting while retaining one unambiguous
  machine-readable timestamp.
- Archive titles, Detail headings, empty text, not-found text, pagination names,
  publication and modification labels, Archive return link, and external-link meaning
  are localized.
- Internal body links prefer the active locale. If an equivalent localized destination
  does not exist, the content must identify the actual destination rather than imply a
  nonexistent translation.
- Korean and Japanese line breaking, English expansion, punctuation, and full-width
  characters must not be normalized into one language's visual assumptions.
- Public-content modification is tracked per translation and only the changed locale
  exposes its modification date.

## Runtime State Contract

| State                              | Required public result                                                                 | Status     |
| ---------------------------------- | -------------------------------------------------------------------------------------- | ---------- |
| No active service-critical notice  | No critical Home container or reserved gap                                             | `Approved` |
| One active service-critical notice | One linked notice before primary search                                                | `Approved` |
| Multiple active critical records   | Deterministically show only the highest-priority one; keep all public items in Archive | `Approved` |
| No routine notice                  | Omit the lower Home announcement section                                               | `Approved` |
| One to three routine notices       | Show every available title-and-date link                                               | `Approved` |
| More than three routine notices    | Show newest three plus `All announcements`                                             | `Approved` |
| Empty Archive                      | Show one concise localized empty statement and no pagination                           | `Approved` |
| One to twenty Archive records      | Show one complete list and no pagination                                               | `Approved` |
| More than twenty Archive records   | Show twenty and URL-addressable pagination                                             | `Approved` |
| Archive page refresh/share/back    | Preserve the same page through its URL                                                 | `Approved` |
| Out-of-range Archive page          | Safe first-page or localized not-found resolution; never an empty successful list      | `Approved` |
| Normal Detail                      | Show localized title, publication date, and body                                       | `Approved` |
| Modified Detail                    | Also show that locale's modification date                                              | `Approved` |
| Expired service-critical Detail    | Remain readable without current critical Home prominence                               | `Approved` |
| Scheduled but not public           | Do not expose in Home, Archive, Detail, sitemap, or metadata                           | `Approved` |
| Unpublished or unavailable slug    | Shared localized not-found result without private-record disclosure                    | `Approved` |
| Translation missing at publish     | Block publication for all public locales                                               | `Approved` |
| Body contains disallowed markup    | Block or sanitize according to the allowlist before public rendering                   | `Approved` |
| Initial request failure            | Use the shared page-level retry/error contract without presenting stale private drafts | `Approved` |
| Signed out                         | Full public reading and navigation remain available                                    | `Approved` |
| Signed in                          | Same public content; no personal read state added                                      | `Approved` |

Archive and Detail have no user-facing destructive action. Publication, unpublish, and
hard-delete failures belong to the future administrator contract but must preserve the
public invariants above.

## Implementation Mapping

### Required Semantic Data

The implementation needs the following meanings, though exact Prisma normalization is
an implementation decision:

- immutable public slug;
- placement role;
- service-critical priority;
- draft, scheduled, published, and unpublished lifecycle meaning;
- original publication timestamp;
- service-critical activation and optional expiry timestamps;
- Korean, Japanese, and English title and restricted-Markdown body;
- locale-specific public-content modification timestamp;
- ordinary internal creation and update audit timestamps that are not automatically
  shown to users.

A normalized `Announcement` plus `AnnouncementTranslation` model is a plausible mapping
but is not mandated if another schema preserves the approved identity, validation, and
query behavior.

### Required Queries

- highest-priority active service-critical notice for Home;
- newest three published routine notices for Home;
- reverse-chronological paginated public Archive for one locale;
- public Detail by immutable slug and locale;
- reciprocal locale metadata for one Detail record;
- administrator validation and lifecycle queries.

All public queries must exclude draft, scheduled-before-publication, and unpublished
content. Expired service-critical records remain eligible for Archive and Detail.

### Rendering and Sanitization

- Parse restricted Markdown with an explicit allowlist.
- Sanitize links and reject scriptable schemes.
- Render semantic server-readable HTML.
- Use one public rendering path for administrator preview and final Detail meaning so
  preview does not promise unsupported structures.
- Cache and revalidate Home, every affected localized Archive page, Detail locale
  routes, sitemap, and metadata when publication state or visible content changes.

### Current-to-Target Migration

- Existing one-language records require Korean source preservation plus approved
  Japanese and English translations before becoming public in the 2.0 system.
- Existing IDs may remain internal, but public links require the new immutable slug.
- Current plain text can migrate to Markdown-compatible paragraphs without adding raw
  HTML.
- Existing Home disclosures become title/date links; the body moves to Detail.
- Existing `updatedAt` must not be reused blindly as public modification date.

## Representative Fixtures

The downstream guide examples, implementation fixtures, and browser tests must include:

1. no announcements;
2. one routine announcement;
3. exactly three and more than three routine announcements;
4. no active critical notice and one active critical notice;
5. overlapping active critical notices with deterministic priority;
6. an expired critical notice still present in Archive and Detail;
7. exactly `20` and `21` Archive records;
8. first, middle, and last Archive pages;
9. an `80`-character Korean title;
10. a long Japanese title and expanded English title;
11. body paragraphs, `h2`, `h3`, both list types, strong text, internal link, and
    external link;
12. a body near `5,000` characters;
13. long uninterrupted link text and mixed full-width characters;
14. unmodified first publication;
15. Korean-only post-publication correction, proving Japanese and English modification
    dates remain absent;
16. modified title and modified body/link;
17. scheduled, unpublished, and missing-translation records that never become public;
18. disallowed raw HTML and unsafe URL attempts;
19. signed-out and signed-in access to the same public Detail;
20. invalid and out-of-range Archive/Detail URLs.

Fixture text must be representative content, not repeated placeholder strings that
hide line-breaking or hierarchy problems.

## Browser Acceptance Contract

Validate all approved public states at:

- `320 CSS px` compact reflow;
- representative `390px` mobile viewport;
- at least one intermediate width where title/date or pagination composition changes;
- a Desktop width such as `1280px` or `1440px`;
- browser zoom sufficient to expose fixed-height, clipping, and reflow failures.

Required checks:

- Korean, Japanese, and English Archive and Detail routes;
- no Korean content fallback in Japanese or English;
- Home critical absence and active state;
- Home routine counts `0`, `1`, `3`, and more than `3`;
- every Home and Archive title opens the correct locale-equivalent Detail;
- `All announcements` opens the correct locale Archive;
- complete non-truncated Archive titles at `320px` and safe date reflow;
- no inline body disclosure on Home;
- exactly `20` items per Archive page and no pagination on a single page;
- pagination share, refresh, forward, and Back restoration;
- semantic current-page announcement and keyboard navigation;
- Detail publication and locale-specific modification dates;
- expired critical Archive/Detail persistence and Home removal;
- draft, scheduled, untranslated, and unpublished exclusion;
- restricted Markdown semantics and sanitization;
- long body, long link, long Korean/Japanese/English content, and no horizontal
  document overflow;
- visible focus, heading hierarchy, list semantics, `time` semantics, link purpose,
  language markup, and touch targets;
- self-Canonical, reciprocal `hreflang`, localized metadata, structured dates, and
  sitemap inclusion/exclusion;
- equivalent signed-out and signed-in public access;
- no unhandled Console error or hydration failure;
- useful server-rendered content and link navigation when client JavaScript is
  unavailable.

## Reference Matrix

| Source                                                                                                            | Transferable principle                                                                                                           | NosLog application                                                                      | Limitation                                                                                |
| ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [USWDS Collection](https://designsystem.digital.gov/components/collection/)                                       | Compact related-content lists use unique headline links, limited metadata, semantic lists, and a separate Archive for more items | Title is the only Detail link; date is the only row metadata; Home hands off to Archive | USWDS supports optional summaries and images that NosLog does not need                    |
| [USWDS Pagination](https://designsystem.digital.gov/components/pagination/)                                       | Large chronological collections may use bounded URL pagination with current-page semantics and generous targets                  | Supports 20-item Archive pages and accessible navigation                                | It does not choose NosLog's page size or final visual styling                             |
| [GOV.UK Pagination](https://design-system.service.gov.uk/components/pagination/)                                  | Paginate only when useful, avoid infinite scroll, hide pagination on one page, and preserve understandable adjacent navigation   | Supports conditional URL pagination and rejection of infinite scroll                    | Government journey styling is not NosLog visual authority                                 |
| [GOV.UK Notification banner](https://design-system.service.gov.uk/components/notification-banner/)                | Interruptive notification treatment is for information users need to know, not routine editorial content                         | Supports reserving the pre-search position for service-critical notices only            | Its alert roles and tone cannot be copied without matching urgency                        |
| [W3C Link Purpose](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)                      | Users must understand destination from link text or programmatic context                                                         | Announcement title links and descriptive Archive navigation                             | It does not select page layout or metadata density                                        |
| [W3C Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels)                        | Descriptive headings help orientation and scanning                                                                               | One Archive heading, one Detail `h1`, authored `h2`/`h3`                                | It does not prescribe typography                                                          |
| [W3C Language of Page](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page)                              | Assistive technology needs correct page and part language                                                                        | Locale routes and no silent Korean fallback                                             | It does not define the translation workflow                                               |
| [W3C Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                             | Content reflows at 320 CSS px without two-dimensional page scrolling                                                             | Grounds title/date stacking, body wrap, and compact pagination                          | Exact responsive transitions remain content-driven                                        |
| [Google localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions) | Localized equivalents use distinct URLs and reciprocal language alternatives                                                     | Same slug across `/ko`, `/ja`, and `/en` with `hreflang`                                | Search discovery does not replace usability or translation QA                             |
| [Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)    | Article metadata can expose headline, publication, modification, and organization author                                         | Grounds locale-specific dates and NosLog publisher metadata                             | Rich-result display is not guaranteed and images are not required by this brief           |
| [MDN `time`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/time)                           | Human dates can carry machine-readable values                                                                                    | Localized visible dates with unambiguous `datetime`                                     | It does not choose the visible locale format                                              |
| [GitHub Changelog](https://github.blog/changelog/)                                                                | High-volume updates use searchable taxonomy, dated links, Detail pages, Archive grouping, and RSS                                | Confirms Archive/Detail separation and metadata value                                   | Its volume, tags, and product breadth do not justify NosLog filters                       |
| [Vercel Changelog](https://vercel.com/changelog)                                                                  | Dense product updates support search and categories when catalog scale demands them                                              | Provides a future comparison if NosLog volume grows                                     | Current NosLog announcements are smaller and not a product-marketing feed                 |
| [Notion Releases](https://www.notion.com/releases)                                                                | Release Archive and individual dated Detail content remain shareable                                                             | Supports stable Detail identity and chronology                                          | Long promotional release packages exceed NosLog notice needs                              |
| [Linear Changelog](https://linear.app/changelog/page/1)                                                           | Editorial Changelog can combine dates, full narrative, media, search, and categories                                             | Confirms that richer functions should follow editorial need                             | Continuous product storytelling and media are outside current scope                       |
| [Cloudflare Changelog](https://developers.cloudflare.com/changelog/)                                              | Technical Archives expose dated entries, product context, pagination, and RSS                                                    | Supports stable chronological preservation                                              | Technical product taxonomy and code-heavy bodies are broader than NosLog                  |
| [Discord Blog](https://discord.com/blog)                                                                          | Article Archives use categories, summaries, media, and load-more discovery                                                       | Shows why a general Blog pattern carries more information than a notice Archive         | NosLog is not an editorial magazine or press center                                       |
| [Apple Newsroom](https://www.apple.com/newsroom/)                                                                 | News Archive distinguishes content types and provides dated permanent articles                                                   | Supports durable public Detail and Archive identity                                     | Press releases, photography, and topic taxonomy are not NosLog requirements               |
| [Steam News](https://steamcommunity.com/app/593110/announcements/)                                                | Game-service announcements preserve dated long-form updates and stable links                                                     | Supports complete Detail outside compact discovery                                      | Community reactions, media, and social counts are explicitly excluded                     |
| [NOSTALGIA official](https://p.eagate.573.jp/game/nostalgia/op3/top/entrance.html)                                | Rhythm-game users encounter chronological date-and-update information near the game context                                      | Confirms date-title scanning familiarity                                                | Official Japanese-only legacy presentation is not a NosLog accessibility/layout authority |
| [SOUND VOLTEX News](https://p.eagate.573.jp/game/sdvx/vii/news/index.html)                                        | Routine updates and important apologies coexist chronologically                                                                  | Supports preserving expired critical history while separating prominence                | Mixed character voice, images, and official marketing do not fit NosLog-authored notices  |
| [maimai News](https://maimai.sega.jp/news/)                                                                       | Paginated date-title archives are established in rhythm-game services                                                            | Supports chronological pagination                                                       | Its legacy pagination density and visual treatment are not copied                         |
| [osu! News](https://osu.ppy.sh/home/news) and [News API](https://osu.ppy.sh/docs/#news)                           | News has stable records, slugs, publication/update metadata, authors, images, and pagination                                     | Supports durable machine-readable identity and localized-ready data separation          | Community editorial scale and author/media fields exceed approved NosLog scope            |

### Evidence Convergence

- Accessibility and collection guidance converge on semantic lists, descriptive title
  links, limited metadata, correct language, date semantics, and reflow. This supports
  title/date rows and rejects the current cramped single-row truncation.
- Pagination guidance and production Archives converge on URL-addressable pages for a
  growing chronological history and reject unnecessary pagination or infinite scroll.
  The exact `20`-item size is an approved NosLog choice, not a universal standard.
- Production services converge on stable Detail URLs, original publication dates, and
  modification metadata. Their search, categories, RSS, authors, media, and reactions
  solve larger editorial catalogs and do not justify initial NosLog complexity.
- Rhythm-game sources converge on date-first chronological discovery and preservation
  of important service updates. Their official status and legacy presentation do not
  justify copying layout, tone, or Japanese-only content.
- Localization and search guidance converge on distinct locale URLs, shared content
  identity, reciprocal language alternates, and truthful visible/structured dates.
- Current NosLog evidence and the approved Home brief converge on replacing inline
  disclosure with links, separating current service impact from routine editorial
  updates, and preserving all complete content in localized Detail and Archive pages.

## Rejected and Superseded Alternatives

- **Keep Home-only Accordion bodies — Superseded:** Home now links compact notice
  discovery to complete localized Detail pages.
- **Use one Home notice placement for every announcement — Superseded:** active service
  impact and routine updates have distinct approved positions and one role per record.
- **Duplicate one notice in critical and routine Home areas — Rejected:** one record has
  one Home placement and the Archive preserves universal discovery.
- **Put official NOSTALGIA X posts in the NosLog Archive — Rejected:** source identity,
  language, ownership, and approved Home role remain separate.
- **Show body summaries, thumbnails, categories, and authors in Archive — Rejected:**
  title and date provide the approved information scent without unnecessary density.
- **Add Archive search, filters, sorting, or page-size controls now — Rejected:** no
  verified current lookup need justifies them.
- **Use infinite scroll or an internal scrolling list — Rejected:** URL pagination
  preserves location, sharing, restoration, keyboard access, and historical browsing.
- **Use multi-column chronological Archive cards on Desktop — Rejected:** a single list
  preserves unambiguous reading order.
- **Use title-derived localized slugs — Rejected:** title edits and three languages
  would fragment identity and break shared links.
- **Publish with one or two translations and fall back to Korean — Rejected:** every
  NosLog-authored public announcement requires all three languages.
- **Show database `updatedAt` as modification date — Rejected:** public Detail shows
  only locale-specific visible-content changes after publication.
- **Require a `major edit` checkbox before showing modification — Superseded:** every
  post-publication visible-content edit updates that locale's public modification date.
- **Reorder Archive by modification date — Rejected:** corrections do not turn an old
  notice into a new announcement.
- **Delete expired critical notices — Rejected:** expiry ends Home prominence, not
  historical access.
- **Allow raw HTML, images, embeds, tables, or attachments — Rejected:** restricted
  semantic Markdown covers the approved notice need with lower security and layout
  risk.
- **Add comments, reactions, read state, dismissal, or personalized ordering —
  Rejected:** announcements are public reading content, not a social or inbox system.
- **Fix Archive and Detail to `390px` on Desktop — Rejected:** the responsive shell uses
  wide space intentionally while protecting readable measure.

## Decision Log

| ID     | Decision                                                                                                                                                                                                                                                      | Status     |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| ANN-01 | Replace the Home-only expandable notice with one authoritative Home, Archive, and Detail system                                                                                                                                                               | `Approved` |
| ANN-02 | Give each record one `Service critical` or `Routine` Home placement role                                                                                                                                                                                      | `Approved` |
| ANN-03 | Show at most one highest-priority active critical notice before Home search and no empty shell                                                                                                                                                                | `Approved` |
| ANN-04 | Show the newest three routine title/date links in the lower Home editorial area                                                                                                                                                                               | `Approved` |
| ANN-05 | Keep NOSTALGIA official X content separate from the NosLog announcement Archive                                                                                                                                                                               | `Approved` |
| ANN-06 | Provide public `/[locale]/announcements` Archive routes                                                                                                                                                                                                       | `Approved` |
| ANN-07 | Use one newest-first semantic list with localized full title and original publication date only                                                                                                                                                               | `Approved` |
| ANN-08 | Paginate after 20 items with addressable URLs; do not use infinite or inner scroll                                                                                                                                                                            | `Approved` |
| ANN-09 | Omit initial Archive search, filters, sorting, page-size selection, and RSS                                                                                                                                                                                   | `Approved` |
| ANN-10 | Provide public localized Detail with Archive return, one `h1`, dates, and full body                                                                                                                                                                           | `Approved` |
| ANN-11 | Omit authors, reading time, sharing controls, related/adjacent notices, comments, and reactions                                                                                                                                                               | `Approved` |
| ANN-12 | Allow only paragraphs, `h2`, `h3`, lists, strong emphasis, and links in restricted Markdown                                                                                                                                                                   | `Approved` |
| ANN-13 | Keep an 80-character title and expand each locale body limit to 5,000 Markdown characters                                                                                                                                                                     | `Approved` |
| ANN-14 | Reject raw HTML, body `h1`, tables, images, video, embeds, files, scripts, and custom styling                                                                                                                                                                 | `Approved` |
| ANN-15 | Use Draft, scheduled or immediate publication, Published, expiry, and Unpublished lifecycle meaning                                                                                                                                                           | `Approved` |
| ANN-16 | Remove expired critical notices from Home prominence while preserving Archive and Detail                                                                                                                                                                      | `Approved` |
| ANN-17 | Require unpublish before exceptional destructive removal of a previously public record                                                                                                                                                                        | `Approved` |
| ANN-18 | Require complete Korean, Japanese, and English title/body content before publication                                                                                                                                                                          | `Approved` |
| ANN-19 | Use one immutable language-neutral public slug across all locale routes                                                                                                                                                                                       | `Approved` |
| ANN-20 | Keep original publication date immutable and use it for Home/Archive display and ordering                                                                                                                                                                     | `Approved` |
| ANN-21 | Mark every post-publication visible-content edit with that locale's public modification date                                                                                                                                                                  | `Approved` |
| ANN-22 | Do not treat pre-publication or administrator-only edits as public content modifications                                                                                                                                                                      | `Approved` |
| ANN-23 | Show publication and applicable modification dates on Detail; show publication only elsewhere                                                                                                                                                                 | `Approved` |
| ANN-24 | Make public content identical for signed-out and signed-in users with no personal read state                                                                                                                                                                  | `Approved` |
| ANN-25 | Use locale-specific Canonical, reciprocal `hreflang`, truthful Article metadata, and sitemap inclusion                                                                                                                                                        | `Approved` |
| ANN-26 | Reflow through 320 CSS px and use purposeful readable Desktop measures without multi-column chronology                                                                                                                                                        | `Approved` |
| ANN-27 | Preserve semantic lists, headings, dates, pagination, link purpose, focus, language, and server-readable content                                                                                                                                              | `Approved` |
| ANN-28 | Body typography maps h2 to `section-title`, h3 to `component-title`, paragraphs to `body`; strong renders as body weight 600 in implementation and is not drawn in Figma (no `body-strong` composite is created)                                              | `Approved` |
| ANN-29 | Inline body links use `content/interactive` plus underline — the neutral system has no chromatic link color and the interactive step is near-invisible inline, so the underline is the working cue; external links additionally carry `Icon/external-link` 16 | `Approved` |
| ANN-30 | Archive rows reuse the Home announcement-row anatomy (title `body`, date `metadata` subdued, divider rhythm, title as the only link); the back control follows `SET-42`; wide measures follow the P7 reading precedent                                        | `Approved` |

## Handoff Boundary

The active high-fidelity design stage may determine the final type scale, editorial measure, surfaces, critical
notice emphasis, row dividers, date treatment, pagination appearance, Markdown rhythm,
spacing, grid tracks, responsive transition values, and restrained motion after
Foundation approval. It must preserve the approved two Home roles, non-duplicated
content identity, title/date Archive density, 20-item URL pagination, minimal Detail,
restricted Markdown, lifecycle, translation gate, stable slug, transparent
locale-specific modifications, public access, semantic structure, and acceptance
criteria.

The future Codex implementation session must compare the final approved Figma output with this brief. It
must request a guide or design revision before implementing any result that restores
inline Home bodies, duplicates notices across Home roles, mixes official X content into
the Archive, hides or truncates Archive titles, adds unapproved catalog controls,
depends on infinite scroll, changes URLs with titles, publishes incomplete
translations, deletes expired history, exposes raw HTML, mistakes internal `updatedAt`
for public modification, reorders history on correction, adds account-dependent read
state, fixes Desktop to phone width, or makes the content inaccessible without
client-side JavaScript.

## Korean, Japanese and English Copy — approved 2026-09-01

`home.announcements` (`공지사항` / `お知らせ` / `Announcements`) is reused as the page
title and the Detail return-link label. Three strings are new:

| Meaning                 | Korean                 | Japanese                 | English             |
| ----------------------- | ---------------------- | ------------------------ | ------------------- |
| Empty Archive           | `공지사항이 없습니다.` | `お知らせはありません。` | `No announcements.` |
| Publication-date label  | `게시일`               | `掲載日`                 | `Published`         |
| Modification-date label | `수정일`               | `更新日`                 | `Updated`           |

Visible dates follow the Home row format (`2026. 8. 15.` in Korean). Pagination reuses
the C7 `Pagination` component and its existing labels.
