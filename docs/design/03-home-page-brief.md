# NosLog 2.0 Home Page Brief

## Document Control

- Status: `Approved`
- Evidence status: `Repository and browser audit complete; reference comparison complete`
- Date started: 2026-07-30
- Date approved: 2026-07-31
- Last amended: 2026-08-08 (`HOME-20`)
- Canonical language: English
- Korean companion: [03-home-page-brief.ko.md](./03-home-page-brief.ko.md)
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Input audit: [01-current-product-audit.md](./01-current-product-audit.md)
- Scope: The localized user Home routes `/ko`, `/ja`, and `/en`
- Excluded: Final high-fidelity layout, foundation tokens, component styling,
  administrator redesign, and application implementation

## Decision Labels

- **Observed:** Verified in the repository, current UI, or browser.
- **Approved:** Explicitly agreed by the user or inherited from an approved artifact.
- **Proposed:** Recommended for discussion and not approved yet.
- **Open:** Requires a user decision or later validation.
- **Rejected:** Explicitly excluded from the direction.
- **Superseded:** Replaced by a later approved decision and retained for history.

This brief defines required content, behavior, states, and responsive intent. It does
not authorize Claude Design or a later Codex implementation session to invent missing
product decisions.

## Page Purpose and User Context

### Approved Purpose

Home is the primary orientation and routing surface for NosLog. It must let a user:

1. understand that NosLog is a NOSTALGIA record, ranking, tier, and chart archive;
2. search for a music entry or published chart immediately;
3. recognize and reach the important product destinations without learning the entire
   site structure;
4. notice a service condition that materially affects the current visit; and
5. reach the remaining approved destinations and official news after the core tasks.

Home is not a personal-record dashboard, a miniature copy of every feature, or a long
marketing explanation of NOSTALGIA.

### Primary Contexts

| Context                          | User need                                                                 | Home implication                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Around arcade play on mobile     | Find a music entry, chart, tier position, requirement, or arcade quickly. | Search and direct destinations must be available before editorial content and without long scanning. |
| Returning mobile user            | Re-enter a known product area with minimal friction.                      | Stable labels, relative order, and large reliable targets matter more than introductory copy.        |
| First-time or signed-out visitor | Understand the service and find public content without an account.        | Identity and public capabilities must be clear; login cannot block browsing.                         |
| Desktop research or comparison   | Use more space to scan destinations, updates, and dense downstream data.  | The Home shell must expand beyond the current 390px column without changing its semantic hierarchy.  |
| Korean, Japanese, or English     | Read controls and service information in the selected language.           | UI and editorial content need an explicit localization policy, not translated labels alone.          |

Authentication changes the account control and access-dependent actions. It does not
create a personalized Home dashboard or reorder the core Home hierarchy.

## Primary Task and Success Conditions

### Approved Primary Task

The primary Home task is to find the intended music entry or published chart and
continue to the relevant detail or viewer flow.

### Secondary Tasks

- Open Music, Chart Viewer, Rankings, Tiers, Bingo, Exams, Arcades, or Data Sync
  directly.
- Read a service-critical notice when one applies.
- Reach lower-priority official NOSTALGIA news.

### Success Conditions

A Home visit succeeds when the user can do one of the following without ambiguity:

- select Music or Chart search scope, submit a title or artist query, and arrive at the
  matching shared search surface;
- browse the selected search scope without first entering a query;
- open one of the eight approved product destinations, including Data Sync; or
- understand a service condition that changes whether or how NosLog can be used.

## Confirmed Product Inputs

- **Approved:** Mobile is the primary context, centered on a 390px baseline; desktop
  remains required.
- **Approved:** Ordinary pages use the responsive top header. Home does not introduce
  fixed bottom navigation.
- **Approved:** Home keeps a page-level direct-navigation block collection.
- **Approved:** Preserve the compact `N` logo mark in the Home identity region. The
  mark supports, but never replaces, the visible `NosLog` heading and localized
  service description.
- **Approved:** Music and Chart search share one surface with a compact leading scope
  selector. The Chart Viewer entry opens the shared search with Chart scope selected.
- **Approved:** Music, Chart Viewer, Rankings, Tiers, Bingo, Exams, Arcades, and Data
  Sync remain separate destinations. Do not introduce an umbrella content label.
- **Approved:** Data Sync joins the Home destination collection as its eighth peer
  block and remains a stable More-panel entry. The former separate Home row is
  superseded.
- **Approved:** Feedback moves out of Home into the More panel and is not duplicated in
  the footer.
- **Approved:** Privacy and GitHub remain footer destinations.
- **Rejected:** A signed-in personalization card for stale sync, recent play, or
  incomplete Bingo or Exams.
- **Approved:** Official news uses X's official Embedded Timeline for the
  `NOSTALGIA_573` account and presents its latest post as one item in a distinct
  official-news grid or region immediately after routine NosLog announcements.
- **Approved:** Do not add a paid X API, scraping, or another unofficial retrieval
  service for this Home requirement.
- **Observed:** The current official-widget integration does not render the post in the
  verified browser, so its implementation must be corrected and browser-verified
  rather than copied unchanged into NosLog 2.0.
- **Approved:** NosLog-authored notices require Korean, Japanese, and English content.
  The external official X post remains in its source language; NosLog localizes the
  surrounding heading, link, and fallback text.
- **Approved:** Home shows the three newest routine NosLog announcements as compact
  title-and-date links. It does not expand full announcement bodies in place.
- **Approved:** Each routine announcement opens a localized public detail page, and an
  “All announcements” link opens the localized announcement archive. Home omits the
  entire routine-announcement section when no published item exists.
- **Approved:** The three-item Home limit remains the same on mobile and desktop.

## Current Product Baseline

### Current Route and Dependencies

The current server-rendered Home route is `app/(nevigation)/(home)/page.tsx`. It loads:

- the current user;
- up to three published NosLog announcements, newest first;
- the selected locale and message catalog;
- the ordinary Header and Footer;
- a Music-only search form;
- six equal quick links: Music, Rankings, Bingo, Tiers, Exams, and Arcades;
- a separate Data Sync link;
- the current Feedback dialog trigger; and
- a lazily loaded official X timeline.

The current `Announcement` model stores one title and one body with no locale,
severity, expiry, or target-audience fields. The administrator input limits are 80
characters for a title and 2,000 characters for a body.

### Browser Evidence: 2026-07-30

| Check                      | Observed result                                                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 390 × 844 Korean Home      | `985px` document height; no document-level horizontal overflow; one-column content.                                                              |
| 390px Japanese and English | No document-level horizontal overflow in either locale; UI labels translate, but the stored announcement remains Korean.                         |
| 1440 × 1000 Home           | Header and Main remain a centered `390px` column at `x = 525px`; available desktop width is unused.                                              |
| Current content order      | Announcement → identity and Music search → six quick links → Data Sync → Feedback → official news.                                               |
| Official X before scroll   | A localized fallback link is present and no X iframe or script has loaded.                                                                       |
| Official X after scroll    | Scripts and three X/Twitter iframes load, but the Timeline iframe remains hidden at `0 × 0` and only the fallback link is usable.                |
| Empty announcements        | The entire announcement section is omitted.                                                                                                      |
| Empty Music query          | Both `/ko/music` and `/ko/music?q=` open the filterable default catalog; the first loaded batch contains 20 Music links and no validation error. |
| Whitespace Music query     | `/ko/music?q=%20%20%20` is normalized to the same default catalog and leaves the visible search field empty.                                     |
| Specific Music query       | `/ko/music?q=Altale` preserves the visible query and narrows the first result set to the matching Music entry.                                   |

These observations identify functionality and risk. They do not approve the current
390px desktop constraint, equal card proportions, content order, or styling.

## Content Inventory and Disposition

| Content or function             | Required disposition                                                                                                                | Status     |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Ordinary Header                 | Use the approved responsive shell; Home does not add a second global navigation system.                                             | `Approved` |
| Service identity                | Keep a concise NosLog identity and NOSTALGIA context near the primary search.                                                       | `Approved` |
| Home `N` logo mark              | Preserve the compact mark beside or above the identity; do not use it as the only accessible Home name.                             | `Approved` |
| Service-critical notice         | Show at most the highest-impact active service notice before search; reserve no gap when none exists.                               | `Approved` |
| Routine NosLog announcements    | Show the newest three as compact title-and-date links in a lower updates area; link to localized detail and archive pages.          | `Approved` |
| Music and Chart search          | Make the shared scope-aware search the strongest Home task.                                                                         | `Approved` |
| Eight destination blocks        | Keep Music, Chart Viewer, Rankings, Tiers, Bingo, Exams, Arcades, and Data Sync separately discoverable in one collection.          | `Approved` |
| Feedback                        | Remove the Home trigger and provide it in the More panel.                                                                           | `Approved` |
| Official NOSTALGIA news         | Use the official X Embedded Timeline to show the latest source post once in a distinct grid immediately after NosLog announcements. | `Approved` |
| Personalized next-action module | Do not add.                                                                                                                         | `Rejected` |
| Footer                          | Keep Privacy and GitHub as stable secondary destinations.                                                                           | `Approved` |

## Reference Comparison

References were reviewed on 2026-07-30. They contribute different roles and are not
visual templates to copy.

| Source                                                                                                    | Transferable principle                                                                                                 | NosLog application                                                                                                              | Limitation                                                                                        |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [W3C WCAG 2.2: Multiple Ways](https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways)                  | Search and direct navigation can provide different valid ways to locate the same content.                              | Keep both the strong shared search and direct Home destinations; neither replaces the other.                                    | It does not specify visual prominence or card layout.                                             |
| [W3C WCAG 2.2: Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html) | Headings and labels should describe purpose so users can orient and predict content.                                   | Search scope, destination names, notices, and news need descriptive visible text in every locale.                               | It does not choose NosLog terminology.                                                            |
| [Figma: UI Design Principles](https://www.figma.com/resource-library/ui-design-principles/)               | Hierarchy, progressive disclosure, consistency, proximity, and alignment reduce cognitive load.                        | Search, destinations, support, and editorial content should not receive equal visual weight merely because all are retained.    | It provides general principles rather than domain evidence.                                       |
| [GOV.UK: Navigate a Service](https://design-system.service.gov.uk/patterns/navigate-a-service/)           | Repeated, multi-task services benefit from concise navigation to the most useful top-level sections, not a site map.   | Keep the global Header restrained while Home provides task-oriented entry points to the approved product destinations.          | Government-service styling and exact header composition are not applicable.                       |
| [USWDS: Card](https://designsystem.digital.gov/components/card/)                                          | Cards are actionable summaries in related collections; simple actions may be better represented without a card.        | Treat the eight direct destinations as an enumerable link collection; their final component need not copy a content-heavy card. | It does not require cards or determine NosLog priority or grid geometry.                          |
| [Tailwind CSS: Responsive Design](https://tailwindcss.com/docs/responsive-design)                         | Start mobile-first and adapt components at wider breakpoints; container queries respond to actual available space.     | Preserve one semantic order while allowing Home blocks and updates to recompose when their containers gain usable width.        | Framework capability is not evidence for a particular breakpoint or number of columns.            |
| [Taiko.wiki Home](https://taiko.wiki/?lang=en)                                                            | A rhythm-game reference can combine direct domain destinations, new charts, and separate service and official notices. | Keep domain tasks and updates discoverable but distinguish them by purpose and priority.                                        | Its labels, density, and administration model are specific to Taiko.wiki and must not be copied.  |
| [Taiko.wiki Song Search](https://taiko.wiki/song?lang=en)                                                 | Search, new charts, genres, and difficulty filters support chart-oriented discovery.                                   | Home should hand off to a capable shared search rather than reproducing its complete filter set.                                | The search-results page is not a Home layout model.                                               |
| [MusicBrainz Home](https://musicbrainz.org/)                                                              | A music database keeps typed search persistent while placing explanation, news, and community content below it.        | Make search a stable product control and keep explanatory or editorial content secondary.                                       | MusicBrainz has contribution and encyclopedia goals that NosLog does not share.                   |
| [Songsterr Home](https://www.songsterr.com/)                                                              | A chart/tab service places search first, adds a compact scope choice, and then exposes browsable popular content.      | Confirm the value of an immediate chart-oriented search with a compact scope control.                                           | Its instrument scope and popularity list do not map to NOSTALGIA modes or NosLog priorities.      |
| [osu! Home](https://osu.ppy.sh/)                                                                          | A rhythm-game service preserves direct Beatmaps and Rankings destinations with a strong service identity.              | Keep domain terminology and direct routes recognizable rather than hiding everything behind a generic menu.                     | The public Home prioritizes downloading the playable game, while NosLog is an archive and viewer. |
| [Official NOSTALGIA Op.3](https://www.konami.com/arcadegames/products/am_nostalgia_op3/)                  | Official material establishes NOSTALGIA terminology, piano interaction, hand colors, and arcade context.               | NosLog identity and viewer descriptions must remain faithful to the covered game and clearly unofficial.                        | It is a marketing and instruction page, not a records-service Home pattern.                       |
| [USWDS: Site Alert](https://designsystem.digital.gov/components/site-alert/)                              | Sitewide alerts are for urgent, time-sensitive service information; place them prominently and avoid stacking them.    | Reserve the pre-search position for at most the highest-impact active service notice, not routine project updates.              | A government-wide emergency pattern would be excessive for ordinary NosLog announcements.         |
| [GOV.UK: Notification Banner](https://design-system.service.gov.uk/components/notification-banner/)       | A notification banner communicates important information not directly tied to the current page content.                | Treat an active service condition as a distinct message role rather than making every announcement a top banner.                | The component does not define an editorial news area or NosLog publishing rules.                  |
| [Carbon: Notification](https://carbondesignsystem.com/components/notification/usage/)                     | Notification disruptiveness should match purpose; contextual callouts belong near the content they affect.             | Separate operational conditions from routine updates and keep either message concise and linked to details when necessary.      | Carbon does not yet provide finalized banner guidance for every product-level use case.           |
| [W3C APG: Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)                                 | Alerts are brief, important, and time-sensitive; frequent interruptions and automatic disappearance harm usability.    | Do not use live alert semantics for static routine updates and do not make important service messages disappear automatically.  | ARIA semantics do not decide visual placement or editorial priority.                              |
| [X Help: Embed a Timeline](https://help.x.com/en/using-x/embed-x-feed)                                    | An embedded profile timeline displays public posts from the source account on another website.                         | Retain the original official NOSTALGIA source on Home while keeping an external link fallback.                                  | The embed is a third-party runtime with privacy, performance, and availability costs.             |
| [X Help: X for Websites and Privacy](https://help.x.com/en/x-for-websites-ads-info-and-privacy)           | Viewing embedded X content can send page, IP address, browser, operating-system, and cookie information to X.          | Treat the approved embed as optional third-party content and disclose or govern it consistently with NosLog privacy policy.     | This describes X data handling, not NosLog's final consent or privacy implementation.             |

### HOME-12 Focused Reference Comparison

The desktop-composition decision compared twenty-seven external sources across
authoritative responsive guidance, production discovery products, rhythm-game and
music-domain services, and editorial art-direction references. The comparison was
continued until the same layout principles recurred without producing a materially
different NosLog option.

| Source                                                                                                                                                                        | Observed pattern or role                                                                                                                                          | NosLog application                                                                                                                                          | Limitation                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [W3C: CSS C32](https://www.w3.org/WAI/WCAG21/Techniques/css/C32)                                                                                                              | Responsive regions reflow without two-dimensional scrolling, and visual rearrangement must not break meaningful source or focus order.                            | Keep one semantic Home order across widths and let CSS recompose regions without moving updates ahead of primary tasks.                                     | It establishes accessibility behavior, not a preferred visual grid.                                           |
| [GOV.UK: Layout](https://design-system.service.gov.uk/styles/layout/)                                                                                                         | A mobile-first single column can become controlled two-thirds or two-thirds-plus-one-third layouts; content width should match its needs.                         | Remove the 390px desktop constraint, but use bounded content regions rather than stretching every Home element across the viewport.                         | Government long-form layouts are quieter and more text-led than NosLog Home.                                  |
| [USWDS: Layout Grid](https://designsystem.digital.gov/utilities/layout-grid/)                                                                                                 | A centered, flexible, mobile-first twelve-column grid supports responsive column spans.                                                                           | Align major Home zones to a shared desktop grid while allowing local collections to choose their own appropriate spans.                                     | The utility system does not determine NosLog hierarchy or breakpoints.                                        |
| [Material 3: Canonical Layouts](https://m3.material.io/foundations/layout/canonical-examples/overview)                                                                        | Feed grids support peer collections; supporting panes are appropriate when secondary content directly supports the primary task.                                  | Use a grid for peer destinations, but do not place unrelated announcements in a permanent supporting rail beside search.                                    | Canonical application layouts are structural references, not NosLog surface styling.                          |
| [Atlassian: Applying Grid](https://atlassian.design/foundations/grid-beta/applying-grid/)                                                                                     | Fixed and fluid grids serve different content; wide fixed grids control relationships better than unconstrained fluid expansion.                                  | Use a capped responsive container and consistent keylines; do not preserve a phone canvas or use unlimited desktop width.                                   | Atlassian's default maximums are product-specific and must not become NosLog tokens without validation.       |
| [Carbon: 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/)                                                                                                  | Responsive columns create repeatable screen regions and shared keylines across breakpoints.                                                                       | Let search, the eight-destination collection, updates, and Footer relate to one layout system while retaining different internal component layouts.         | Carbon's sixteen-column implementation and spacing values are not adopted directly.                           |
| [Singapore Government Design System: Responsive Grid](https://www.designsystem.tech.gov.sg/foundations/layout/responsive-grid)                                                | Four-, eight-, and twelve-column layouts recompose at different widths; a sidebar is a contextual pattern rather than a default desktop requirement.              | Treat desktop as an intentional grid expansion and use no permanent Home sidebar because no approved content requires one.                                  | Its prescribed container measurements are not final NosLog dimensions.                                        |
| [Adobe Spectrum: Spacing](https://spectrum.adobe.com/page/spacing/), [Headers](https://spectrum.adobe.com/page/headers/), and [Cards](https://spectrum.adobe.com/page/cards/) | Page shells align with fixed or fluid grids, component priority changes responsively, and card groups align to the main grid without forcing every internal edge. | Align the destination collection and editorial region to the Home grid while keeping search and individual block internals at readable widths.              | Spectrum describes an ecosystem-wide system and not NosLog's dark visual language.                            |
| [Tailwind CSS: Responsive Design](https://tailwindcss.com/docs/responsive-design)                                                                                             | Mobile-first variants add wider-layout changes, and component adaptations should follow available space rather than device labels alone.                          | Preserve the mobile base and add only the desktop recompositions required by content relationships; defer exact breakpoint values to foundation testing.    | Framework syntax is implementation guidance, not product evidence.                                            |
| [Figma: UI Design Principles](https://www.figma.com/resource-library/ui-design-principles/)                                                                                   | Hierarchy, proximity, alignment, consistency, and progressive disclosure help users distinguish primary and secondary information.                                | Keep search visually dominant, group the eight peer destinations, and place updates after core tasks rather than giving every retained item equal weight.   | The principles do not settle NosLog-specific ordering or proportions.                                         |
| [NSW Design System: Grid](https://designsystem.nsw.gov.au/core/grid/index.html)                                                                                               | A responsive twelve-column system supports readable, accessible layouts from narrow to wide screens.                                                              | Use a common wide-layout structure while testing all three locales and narrower supported widths.                                                           | Public-service examples do not model a rhythm-game discovery Home.                                            |
| [NICE Design System: Layout](https://design-system.nice.org.uk/foundations/layout/)                                                                                           | A mobile-first fluid grid lets content occupy deliberate spans instead of scaling a narrow page uniformly.                                                        | Expand collections and update regions selectively while keeping bounded search and readable copy.                                                           | Its health-information context is more document-oriented than NosLog.                                         |
| [Dell Design System: Grid](https://www.delldesignsystem.com/foundations/grid)                                                                                                 | Responsive grids adjust margins, body widths, and column availability across viewport ranges.                                                                     | Define container and gutter behavior as foundation decisions instead of embedding a 390px assumption in the Home composition.                               | Dell's breakpoint and margin values are not NosLog defaults.                                                  |
| [Denmark Common Design System: Grid](https://designsystem.dk/styleguide/grid/)                                                                                                | A twelve-column grid creates horizontal alignment and vertical rhythm across responsive layouts.                                                                  | Use shared keylines for major Home zones and a stable vertical sequence from search through Footer.                                                         | Its exact desktop width and government visual conventions are not transferable.                               |
| [Spotify Search](https://open.spotify.com/search)                                                                                                                             | A wide discovery surface expands peer browse categories into a multi-column grid beside persistent application navigation.                                        | The browse grid supports using desktop width for peer destinations; the persistent library rail is not appropriate for NosLog's approved Header shell.      | Spotify is a playback application with a much larger persistent navigation model.                             |
| [Apple Music Search](https://music.apple.com/us/search)                                                                                                                       | Search remains compact while browse categories use the wider content pane as a multi-column collection.                                                           | Keep the Home search readable and bounded while allowing the destination collection to occupy more of the desktop container.                                | Its subscription, media playback, and sidebar model do not map to NosLog.                                     |
| [BeatSaver](https://www.beatsaver.com/)                                                                                                                                       | Chart discovery uses a wide search and filter row followed by a dense two-column result collection.                                                               | Confirms that chart-oriented content benefits from desktop width, but full filters and results remain on the shared discovery page rather than Home.        | It is a catalog-results surface, not a Home information hierarchy.                                            |
| [osu! Titanic: Beatmapsets](https://osu.titanic.sh/beatmapsets/)                                                                                                              | Dense chart browsing uses desktop space for filters and tabular comparison.                                                                                       | Reserve wide, comparison-oriented layouts for downstream chart discovery; Home should route to them instead of reproducing their density.                   | It is a listing page with thousands of results, not an orientation surface.                                   |
| [Taiko.wiki Home](https://taiko.wiki/?lang=en)                                                                                                                                | A rhythm-game Home uses a desktop rail, search, direct links, and side-by-side notices, but the combined density competes for attention.                          | Preserve direct domain access and separate service and official updates while treating the persistent rail and visual density as counterexamples.           | Its administration, advertising, and information volume differ from NosLog.                                   |
| [Songsterr](https://www.songsterr.com/)                                                                                                                                       | A chart service gives a centered search task strong prominence before popular content.                                                                            | Support a centered NosLog identity-and-search zone before the wider destination collection.                                                                 | Instrument tabs and popular-song lists do not map directly to NosLog scopes or destinations.                  |
| [MusicBrainz](https://musicbrainz.org/)                                                                                                                                       | A music database leads with search and places explanation, news, and community content later in the page.                                                         | Keep task entry ahead of editorial content and place routine updates in a lower semantic zone.                                                              | It is an encyclopedia and contribution platform with different secondary tasks.                               |
| [BeastSaber](https://bsaber.com/?s=true)                                                                                                                                      | A rich rhythm-game Home combines featured maps, packs, articles, events, and rankings into many competing modules.                                                | Use it as a density counterexample: NosLog Home remains an orientation surface and does not become a personalized or editorial dashboard.                   | Its curation and community publishing model is broader than NosLog's approved Home scope.                     |
| [ArcadeStat](https://arcadestat.app/en/)                                                                                                                                      | A fan-made arcade records service exposes multiple record, tier, and music functions from one product shell.                                                      | Confirms that NosLog's domain destinations deserve direct access while still requiring a clear primary task and restrained grouping.                        | Publicly observable page structure offers less detailed visual evidence than the other production references. |
| [Steam Search](https://store.steampowered.com/search/)                                                                                                                        | A wide primary result list uses a secondary rail for controls that directly filter those results.                                                                 | Reinforces the rejection of an announcement rail: a secondary desktop region should directly support the adjacent primary task, which NosLog news does not. | Commerce filters and result density are not a Home model.                                                     |
| [Plus X](https://dx.plusx.kr/)                                                                                                                                                | Wide editorial compositions use strong typographic hierarchy, shared edges, and deliberate two-column rhythm.                                                     | Inform later typography and editorial proportions for the lower updates area without changing the approved task hierarchy.                                  | It is an art-direction reference, not product-navigation evidence.                                            |
| [TURN.STUDIO](https://www.behance.net/gallery/252216015/Creative-Agency-Website-TURNSTUDIO)                                                                                   | Large-scale composition and controlled whitespace can make wide layouts feel intentional rather than merely enlarged.                                             | Inform the visual treatment of desktop space after the structural grid is validated.                                                                        | A creative-agency showcase does not determine NosLog interaction or accessibility behavior.                   |
| [MUSINSA Brand](https://www.musinsa.com/brand/musinsa)                                                                                                                        | Editorial content uses clear type hierarchy, image and text grouping, and repeated alignment across wide screens.                                                 | Inform later editorial hierarchy for announcements and official news while retaining NosLog's content order.                                                | It is a commerce and brand surface, not a functional rhythm-game Home reference.                              |

### Desktop Composition Alternatives

| Alternative                                | Benefit                                                                                             | Risk or cost                                                                                                                    | Decision   |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Wider single column                        | Preserves the simplest mobile-to-desktop translation.                                               | Continues to underuse desktop width, lengthens the page, and weakens comparison among peer destinations.                        | `Rejected` |
| Persistent primary pane plus update rail   | Makes the page appear fuller and keeps updates continuously visible.                                | Elevates unrelated news beside the primary search, creates a false task relationship, and risks responsive reading-order drift. | `Rejected` |
| Dashboard or unequal Bento composition     | Can create immediate visual variation and several prominence levels.                                | Conflicts with the approved consistent destination family, introduces arbitrary hierarchy, and increases responsive clutter.    | `Rejected` |
| Semantic zones with local responsive grids | Preserves mobile order while letting peer destinations and lower editorial content use wider space. | Requires later validation of container, gutter, column, and transition values with representative content.                      | `Approved` |

The approved desktop composition is:

1. retain one semantic sequence across viewport widths;
2. place at most one active service-critical notice before the identity and search,
   never in a low-priority side rail;
3. keep the concise NosLog identity and scope-aware search centered as the strongest
   desktop Home zone, with a readable maximum width rather than full-container
   stretching;
4. align the eight comparable destination blocks, including Data Sync, after search;
   use four columns by two rows when the collection has sufficient width and three
   columns by three rows in the compact-width state while preserving source order;
5. place routine NosLog announcements and official NOSTALGIA news only in the lower
   editorial zone;
6. at sufficiently wide layouts, show the two editorial sections side by side, give
   the NosLog announcement collection the larger share, and keep official news the
   smaller peer region;
7. at narrower layouts, stack the two editorial sections in the same source order:
   NosLog announcements first and official NOSTALGIA news second; and
8. align the Footer to the responsive page container after the editorial zone.

This approval fixes relationships, hierarchy, and recomposition rules. It does not fix
the final maximum width, breakpoint values, gutters, card dimensions, or the exact
ratio between the two desktop editorial regions. Those values remain
foundation and representative-example decisions that require real Korean, Japanese,
and English content.

### HOME-18 / HOME-20 Focused Reference Comparison

The destination-grid decision compared authoritative responsive and accessibility
guidance, production navigation research, established grid and collection systems,
and current NosLog evidence. The sources converge on shortening unnecessary mobile
navigation length, keeping peer items on consistent spans and keylines, preserving
meaningful reading order, and validating reflow at `320 CSS px`. They do not prescribe
one fixed column count for NosLog. The approved NosLog-specific resolution uses a
`3 × 3` compact collection when four columns no longer give localized labels enough
room, then returns to `4 × 2` when the collection is wide enough.

| Reference class                      | Sources                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Transferable principle and NosLog application                                                                                                                                                                                                                                                                   | Limitation                                                                                                       |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Mobile Home and navigation evidence  | [Baymard: Mobile Homepage and Category Navigation](https://baymard.com/blog/mobile-homepage-usability), [Baymard: Main Navigation UX](https://baymard.com/blog/ecommerce-navigation-best-practice)                                                                                                                                                                                                                                                         | Mobile users rely on direct Home shortcuts, while long category collections make overview and movement slower. Eight compact NosLog destinations should avoid a four-row mobile list; three rows are accepted when they materially improve label legibility.                                                    | Commerce categories are larger and more heterogeneous than NosLog's eight peer destinations.                     |
| Hierarchy, reading order, and reflow | [Microsoft Fluent 2: Layout](https://fluent2.microsoft.design/layout), [Figma: UI Design Principles](https://www.figma.com/resource-library/ui-design-principles/), [Apple HIG: Layout](https://developer.apple.com/design/human-interface-guidelines/layout), [W3C: Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html)                                                                                                                      | Keep priority content early, preserve source and focus order, align repeated controls, and avoid two-dimensional scrolling at `320 CSS px`. Compact `3 × 3` reflow protects labels without clipping, ellipsis, or micro-type; the final two peers remain equal and occupy the first two cells of the final row. | These sources establish hierarchy and accessibility constraints, not a NosLog column count.                      |
| Peer grid and collection systems     | [Carbon: 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/), [USWDS: Layout Grid](https://designsystem.digital.gov/utilities/layout-grid/), [Adobe Spectrum: Cards](https://spectrum.adobe.com/page/cards/), [Atlassian: Applying Grid](https://atlassian.design/foundations/grid-beta/applying-grid/), [Primer: Grid](https://primer.style/brand/layout/Grid/), [Bootstrap: Grid System](https://getbootstrap.com/docs/5.0/layout/grid/) | Repeated peer items benefit from equal spans, repeatable keylines, and consistent collection rhythm. Use eight equal blocks; do not stretch the last item, vary spans without an approved hierarchy, or turn the collection into a single wide toolbar.                                                         | Their tokens, breakpoints, and surface styles are product-specific and are not NosLog values.                    |
| Adaptive layout implementation       | [Android: Adapt Layout](https://developer.android.com/design/ui/mobile/guides/layout-and-content/adapt-layout), [Material 3: Canonical Layouts](https://m3.material.io/foundations/layout/canonical-examples/overview), [GOV.UK: Layout](https://design-system.service.gov.uk/styles/layout/), [Tailwind CSS: Responsive Design](https://tailwindcss.com/docs/responsive-design)                                                                           | Responsive composition follows content constraints. Use `3 × 3` only while the destination region is compact, then change to bounded `4 × 2`; do not add columns merely because the viewport is wide.                                                                                                           | These references allow several valid adaptive outcomes; the exact transition is a NosLog product decision.       |
| Current NosLog evidence              | Current Home implementation and the reviewed 320px/390px destination comparisons                                                                                                                                                                                                                                                                                                                                                                           | Three columns materially improve the available label measure over four at compact widths. Eight peers require one intentionally incomplete final row, but keeping every block equal and source ordered is preferable to stretching the eighth item or reducing type.                                            | The current visual treatment and dimensions are usability evidence only and are not the NosLog 2.0 final design. |

Implementation and downstream design must still validate all Korean, Japanese, and
English labels, `200%` text enlargement, minimum target sizes, and horizontal reflow at
`320px`, `390px`, and around the measured compact-to-standard transition. The S5
specimen uses a `448px` destination-region threshold, equivalent to a `480px` frame
with its current compact gutters, as a validation value rather than a universal device
breakpoint. Production should trigger the same relationship from the destination
container's available width. If content pressure remains, adjust gaps, padding, label
wrapping, or shared block height; do not use ellipsis or reduce the control label below
the approved type role.

### HOME-15 Focused Reference Comparison

The routine-announcement decision additionally compared twenty-one external pages across
authoritative guidance, task-oriented production services, rhythm-game sites, and
dedicated update archives. The sources reached saturation around a bounded recent
collection plus a stable route to complete history.

| Source                                                                                                             | Observed pattern                                                                                                         | NosLog application                                                                                       | Limitation                                                                             |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [W3C APG: Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)                                                  | Alerts are brief, important, and potentially time-sensitive; frequent interruptions harm usability.                      | Routine announcements remain ordinary editorial content rather than live alerts.                         | Accessibility semantics do not define a Home collection size.                          |
| [GOV.UK: Notification Banner](https://design-system.service.gov.uk/components/notification-banner/)                | Use banners sparingly and avoid showing more than one.                                                                   | Keep at most one service-critical message separate from routine updates.                                 | It does not prescribe an editorial archive.                                            |
| [USWDS: Site Alert](https://designsystem.digital.gov/components/site-alert/)                                       | Site alerts communicate urgent sitewide information and should not be stacked.                                           | Do not turn multiple routine releases into top-of-page alerts.                                           | The emergency context is stronger than ordinary NosLog updates.                        |
| [USWDS: Collection](https://designsystem.digital.gov/components/collection/)                                       | A compact related-content collection links each selective summary to its source and recommends six or fewer items.       | Use a short linked announcement collection rather than expanded article bodies.                          | Six is an upper guideline, not a reason for NosLog to show six.                        |
| [Carbon: Notification](https://carbondesignsystem.com/components/notification/usage/)                              | Notification copy stays short; longer explanations use a “View more” destination.                                        | Move full announcement bodies to stable detail pages.                                                    | Carbon notifications are not themselves an editorial-news template.                    |
| [Fluent 2: Message Bar](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage)               | Keep messages to one or two short sentences and link longer documentation; too many interruptions overload a flow.       | Keep Home rows scannable and use a detail link for complete content.                                     | Message bars concern application state more than routine news.                         |
| [Shopify Polaris: Banner](https://polaris-react.shopify.com/components/feedback-indicators/banner)                 | Banners are sparse, single-theme, concise, and not a regular information entry point.                                    | Routine history belongs in a normal collection and archive, not persistent banners.                      | Merchant workflows differ from an arcade companion service.                            |
| [VA.gov: Banner](https://design.va.gov/components/banner/)                                                         | Only one banner appears at a time; short headlines and messages link to fuller pages.                                    | Preserve one urgent slot while routing longer routine content to detail pages.                           | Its health and emergency content has higher stakes than NosLog releases.               |
| [Singapore Government Design System: System Banner](https://www.designsystem.tech.gov.sg/components/system-banner) | Routine body content should stay in normal flow; too many banner items dilute urgency and stale items should be removed. | Separate service status from the bounded routine-announcement area.                                      | Its optional auto-rotating banner is not adopted for NosLog.                           |
| [GOV.UK Design System Home](https://design-system.service.gov.uk/)                                                 | Home features one current “What’s new” item and links to the broader updates page.                                       | A task-oriented Home can keep updates bounded while preserving full-history access.                      | A design-system site publishes at a different cadence.                                 |
| [Scottish Government Design System Home](https://designsystem.gov.scot/)                                           | Home lists two recent updates and sends release history to another destination.                                          | Supports a small recent subset plus archive rather than an unbounded Home feed.                          | The content type is documentation updates, not game-service notices.                   |
| [UAE Design System Home](https://designsystem.gov.ae/)                                                             | A selected latest update appears as secondary Home content after primary guidance actions.                               | Routine announcements remain below core NosLog tasks and use restrained prominence.                      | It demonstrates hierarchy more than exact quantity.                                    |
| [CHUNITHM Japanese Home](https://chunithm.sega.jp/) and [CHUNITHM International Home](https://chunithm.sega.com/)  | Both surfaces expose three recent news items followed by a “more” or “view all” route.                                   | Three items is a domain-relevant bounded default with clear history access.                              | These are official game marketing sites, while NosLog is a companion archive.          |
| [maimai Home](https://maimai.sega.jp/)                                                                             | A bounded notices area is paired with a “see more notices” route.                                                        | Keep the Home summary finite and make older content deliberately reachable.                              | Much of its visual news content is image-led and should not be copied.                 |
| [Taiko.wiki Home](https://taiko.wiki/?lang=en)                                                                     | Five Wiki notices and three official notices create a dense but highly visible update block.                             | Confirms that service and official news need separate labels, while serving as a density counterexample. | Its wiki-heavy operating model prioritizes update scanning more than NosLog Home does. |
| [DanceDanceRevolution WORLD Home](https://p.eagate.573.jp/game/ddr/ddrworld/top/index.html)                        | Many long news bodies are placed directly in the Home flow.                                                              | Treat this as a counterexample: full bodies would let routine content dominate NosLog’s primary tasks.   | The official site intentionally functions partly as a full news destination.           |
| [SOUND VOLTEX News](https://p.eagate.573.jp/game/sdvx/vii/news/index.html)                                         | Full game updates live in a dedicated chronological news destination.                                                    | A dedicated archive can own complete and older NosLog announcements.                                     | It does not determine the number of preview items on NosLog Home.                      |
| [Nintendo News](https://www.nintendo.com/us/whatsnew/)                                                             | A dedicated filtered news page keeps loading older articles outside the product Home.                                    | Preserve long-term discoverability through an archive rather than a growing Home section.                | Nintendo’s publishing volume is far higher than NosLog’s.                              |
| [GitHub Changelog](https://github.blog/changelog/)                                                                 | A dedicated chronological changelog exposes dates and categories for a large history.                                    | Announcement history needs a stable browse route even when Home shows only three items.                  | Enterprise product taxonomy is unnecessary for the initial NosLog archive.             |
| [Figma Release Notes](https://www.figma.com/release-notes/)                                                        | Release history is a dedicated destination with chronological updates and subscription access.                           | Separate ongoing history from the task-oriented Home.                                                    | Subscription and release-marketing features are outside the current decision.          |

Current NosLog already fetches the newest three published announcements, but expands
up to 2,000-character bodies in Home accordions and provides no public detail or
archive route. The approved direction preserves the useful three-item operational
limit while replacing unbounded in-place expansion with stable detail and archive
access.

### HOME-11 Focused Reference Comparison

The empty-query decision additionally compared eighteen independent sources across
authoritative interaction guidance, search-platform behavior, production catalogs,
music and rhythm-game discovery, and a query-only counterexample.

| Reference class                        | Sources                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Transferable principle and NosLog application                                                                                                                                                                                                                                           | Limitation                                                                                                                                                             |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Interaction and accessibility guidance | [Apple Search Fields](https://developer.apple.com/design/human-interface-guidelines/search-fields), [USWDS Search](https://designsystem.digital.gov/components/search/), [MDN `input type="search"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search), [GOV.UK Error Message](https://design-system.service.gov.uk/components/error-message/), and [Nielsen Norman Group accessibility guidance](https://media.nngroup.com/media/reports/free/Usability_Guidelines_for_Accesible_Web_Design.pdf)                                                                                 | Search and browsing can coexist, while an empty value becomes invalid only when the product deliberately requires it. Do not show a validation error for an intentional browse action, and do not describe a queryless catalog as results for a nonexistent query.                      | These sources define semantics and failure risks, not NosLog's catalog contents or default ordering.                                                                   |
| Search-platform behavior               | [Algolia empty search](https://support.algolia.com/hc/en-us/articles/13029120172945-What-is-an-empty-search), [Meilisearch empty-query curation](https://www.meilisearch.com/docs/capabilities/search_rules/how_to/curate_empty_query), and [Elasticsearch filtered search](https://www.elastic.co/search-labs/tutorials/search-tutorial/full-text-search/filters)                                                                                                                                                                                                                                                 | A queryless state can return an initial or filtered catalog, but its default content should be intentionally curated instead of inheriting an arbitrary engine order. NosLog may open the selected browse scope without fixing its eventual sort and filter defaults in the Home brief. | Search-engine capability is implementation evidence rather than complete UX validation.                                                                                |
| Production browse and discovery        | [Spotify Search](https://open.spotify.com/search), [Steam Search](https://store.steampowered.com/search/), [osu! Titanic beatmap listing](https://osu.titanic.sh/beatmapsets/), [Nintendo Games](https://www.nintendo.com/us/store/games/), [PlayStation Store Browse](https://store.playstation.com/en-us/pages/browse), [Epic Games Store Browse](https://store.epicgames.com/en-US/browse), [BeatSaver](https://www.beatsaver.com/), [Discogs database search](https://support.discogs.com/hc/en-us/articles/360003622014-How-To-Browse-Search-In-The-Database), and [Bandcamp Tags](https://bandcamp.com/tags) | Music, game, and chart catalogs preserve a useful browse state before a text query and pair it with filters, categories, or curated ordering. This closely matches NosLog's shared Music/Chart discovery surface and its direct Music and Chart Viewer entries.                         | Several services expose a separate Browse route instead of interpreting an empty form submission; their surface styling and merchandising logic are not NosLog models. |
| Query-only counterexample              | [GitHub Search](https://github.com/search?q=&type=repositories)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | A pure global text-query tool may keep an empty search as instructions rather than a result set. This supports blocking an empty query only when there is no meaningful catalog state.                                                                                                  | GitHub searches heterogeneous code and repositories; it is less analogous to NosLog's bounded Music and published-chart catalogs.                                      |

The comparison converged after the catalog and counterexample patterns stopped adding
new behavior. NosLog fits the browse-and-search model because Music and Chart Viewer
already require direct queryless entry points into the same discovery surface. The
Nielsen Norman Group warning still applies: the queryless destination must be labeled
as a browse catalog, not as results generated by a blank query.

### HOME-16 Focused Reference Comparison

The Home search-preview decision compared twenty independent sources across
authoritative interaction and accessibility guidance, production component systems,
empirical autocomplete research, and public search products.

| Reference class                               | Sources                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Transferable principle and NosLog application                                                                                                                                                                                                                 | Limitation                                                                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Interaction and accessibility guidance        | [W3C APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), [WAI-ARIA](https://www.w3.org/TR/wai-aria/), [Apple Search Fields](https://developer.apple.com/design/human-interface-guidelines/search-fields), [Apple Machine Learning](https://developer.apple.com/design/human-interface-guidelines/machine-learning), [USWDS Combo Box](https://designsystem.digital.gov/components/combo-box/), [Fluent 2 Combobox](https://fluent2.microsoft.design/components/web/react/core/combobox/usage), and [GOV.UK Search Autocomplete](https://design-guide.publishing.service.gov.uk/components/search-autocomplete/)                               | Suggestions must remain understandable and keyboard-operable. Rank likely matches first and keep a lightweight public-search preview bounded; GOV.UK specifically limits this pattern to five suggestions to reduce cognitive load and unnecessary scrolling. | Long-list selection controls may legitimately scroll, but they solve a more focused task than a multi-purpose Home preview. |
| Component implementation systems              | [Primer SelectPanel guidelines](https://primer.style/product/components/select-panel/guidelines/), [Primer SelectPanel accessibility](https://primer.style/product/components/select-panel/accessibility/), [Primer Autocomplete](https://primer.style/design/components/autocomplete/), [Algolia suggested searches](https://www.algolia.com/doc/ui-libraries/autocomplete/guides/adding-suggested-searches), [Algolia Autocomplete](https://www.algolia.com/doc/ui-libraries/autocomplete/introduction/getting-started), and [Algolia query suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/react) | Scrollable lists require additional active-option visibility, focus, mobile, and screen-reader behavior. A bounded list with a distinct footer action can hand off to a complete result surface without turning Home into a result browser.                   | These systems provide implementation patterns; they do not determine NosLog relevance ranking or localized labels.          |
| Empirical autocomplete research               | [Baymard autocomplete design](https://baymard.com/blog/autocomplete-design) and [Baymard autocomplete examples](https://baymard.com/ecommerce-design-examples/34-autocomplete-suggestions)                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Too many simultaneous suggestions increase scanning and choice cost. Mobile should show fewer suggestions than a large desktop surface, and a fixed-height scrollbar is a poor substitute for stronger ranking and a full-results destination.                | The research focuses on ecommerce search, so its merchandising rules do not transfer to NosLog.                             |
| Public search products and domain comparables | [Google Autocomplete](https://blog.google/products-and-platforms/products/search/how-google-autocomplete-works-search/), [GitHub search](https://github.blog/news-insights/a-smarter-more-complete-y-search-bar/), [YouTube search predictions](https://support.google.com/youtube/answer/9872296?hl=en), [MusicBrainz Search](https://musicbrainz.org/search), and [BeatSaver](https://www.beatsaver.com/)                                                                                                                                                                                                                                                  | A small ranked preview and a complete searchable destination have different roles. NosLog Home should help users recognize a likely Music or Chart match, then transfer broader inspection and filtering to shared discovery.                                 | Public documentation does not expose every ranking rule or accessibility implementation, and the products differ in scope.  |

The comparison converged on a bounded preview rather than a five-row viewport over an
internally scrolling result list. Internal scrolling is valid for a dedicated
selection dialog or panel, but on Home it adds nested scrolling, hides the existence
of later matches, competes with the mobile keyboard, and duplicates the shared
discovery page. The approved alternative shows the highest-relevance matches without
internal scrolling or in-place expansion and provides a complete-results handoff only
when more matches exist than the preview can show.

### HOME-17 Focused Reference Comparison

The asynchronous preview-state decision compared twenty independent sources spanning
accessibility status semantics, loading and error guidance, production component
systems, and search-state implementations.

| Reference class                         | Sources                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Transferable principle and NosLog application                                                                                                                                                                                                                                            | Limitation                                                                                                                                                |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accessibility status and focus          | [W3C APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), [WCAG search-results status example](https://www.w3.org/WAI/WCAG22/working-examples/aria-role-status-searchresults/), [W3C ARIA22](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22), [W3C F103](https://www.w3.org/WAI/WCAG22/Techniques/failures/F103.html), and [MDN `aria-busy`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy)                                                            | Dynamic loading, result counts, no-match messages, and failures must be programmatically exposed without moving DOM focus away from the search field. Mark an updating region busy until the current response is complete and avoid announcements from obsolete intermediate updates.    | The standards define semantics rather than visual timing, popup geometry, or NosLog copy.                                                                 |
| Loading and application-error guidance  | [Apple Loading](https://developer.apple.com/design/human-interface-guidelines/loading), [Apple Progress Indicators](https://developer.apple.com/design/human-interface-guidelines/progress-indicators), [Material Progress Indicators](https://m2.material.io/components/progress-indicators), [Material Errors](https://m1.material.io/patterns/errors.html), and [Material UI Progress](https://mui.com/material-ui/react-progress/)                                                                                      | Fast completion should feel immediate; slower work needs local, consistent feedback. A component failure should preserve the usable remainder of the page and offer a supported recovery action. Delaying a visual loader prevents a fast response from flashing an unnecessary spinner. | Guidance differs on the exact delay before a visual loader appears, so the approved `400ms` request-time threshold is a NosLog-specific rule to validate. |
| Asynchronous autocomplete systems       | [CMS Autocomplete](https://design.cms.gov/v/5.0.2/components/autocomplete/), [Equinor Autocomplete](https://eds.equinor.com/docs/Next/components/inputs/autocomplete/), [React Spectrum ComboBox](https://react-spectrum.adobe.com/ComboBox), [Visa Combobox](https://design.visa.com/components/combobox/usage/), [Singapore Government Combo Box](https://www.designsystem.tech.gov.sg/components/combo-box), and [Australian Agriculture Autocomplete](https://design-system.agriculture.gov.au/components/autocomplete) | Loading, no-result, invalid-input, and service-failure states are different. For NosLog, the query is not invalid when retrieval fails, so failure belongs inside the popup with concise recovery rather than on the input as validation styling.                                        | Most examples select a value from a controlled list, while NosLog also supports explicit submission to complete discovery.                                |
| Search state and update implementations | [Scottish Government Autocomplete](https://designsystem.gov.scot/components/autocomplete), [Elastic Search UI State](https://www.elastic.co/docs/reference/search-ui/api-core-state), [Algolia multiple search states](https://www.algolia.com/doc/ui-libraries/autocomplete/guides/implementing-multiple-search-states), and [Telerik AutoComplete accessibility](https://www.telerik.com/design-system/docs/components/autocomplete/accessibility/)                                                                       | Current input, the query represented by rendered results, request identity, loading, and error are separate state. Invalidate prior matches when input changes, ignore stale responses, and announce only the state belonging to the latest normalized query and scope.                  | These sources expose implementation state but do not choose NosLog's navigation hierarchy or final visual styling.                                        |

The comparison converged on an anchored, non-modal popup rather than an in-flow block.
The popup attaches directly below the search field, appears above later Home content
without moving it, and adds no backdrop or page-level interaction lock. Selection,
complete-results handoff, `Escape`, clearing the query, or interaction outside the
search region closes it; `Escape` does not clear the query.

After the approved IME-safe `300ms` idle interval, the request begins immediately.
The suggestion region becomes programmatically busy at request start, but a visible
compact loading row appears only if that same request is still pending after `400ms`.
Changing the normalized query or scope immediately invalidates and hides prior
matches, clears the prior failure, and starts the next debounced cycle. An aborted or
older response must never replace the latest state.

Retrieval failure keeps the query, active scope, search control, explicit submission,
and every other Home destination usable. It appears inside the popup as a concise
localized message with a text retry action for the same query and scope. It is not
styled as invalid user input and does not move focus. New input dismisses the failure
and begins a new cycle.

### Reference Synthesis

The comparison converges on six requirements:

1. search and direct destination links should coexist;
2. the primary task must be visually stronger than retained support and editorial
   content;
3. Home should hand off to deeper filtering instead of reproducing downstream screens;
4. mobile-first does not justify retaining a fixed mobile-width canvas on desktop; and
5. Home search preview should remain bounded and hand broader inspection to shared
   discovery instead of adding an internally scrolling mini-results page; and
6. asynchronous search feedback should stay anchored to the search task, preserve the
   rest of Home, distinguish no matches from retrieval failure, and reject stale
   results.

References alone do not determine the exact destination order or card proportions.
Those remain user-approved decisions. The focused notice comparison informed the
approved three-item summary, detail, and archive model. The focused empty-query
comparison informed the approved browse-state rules, and the focused autocomplete
comparison informed the approved preview states. The asynchronous-state comparison
informed the approved popup, loading, invalidation, and recovery rules documented
below.

## Approved Information Priority

The following hierarchy is approved:

1. **Conditional service interruption:** only a notice that changes current service
   use may precede the primary task.
2. **Identity and shared search:** concise NosLog context plus the approved Music/Chart
   scope selector and search field.
3. **Primary destination collection:** all eight approved destinations in one
   consistent component family. Emphasis is expressed through the shared
   Music/Chart search and the reading order Music → Chart Viewer → Tiers → Rankings →
   Bingo → Exams → Arcades → Data Sync, not through loud accent colors, separate group
   labels, or an unapproved large-versus-small card system.
4. **Updates and editorial content:** routine NosLog announcements followed by a
   distinct official NOSTALGIA news grid containing the latest official X post.
5. **Trust and project footer:** Privacy and GitHub.

The destination collection is approved as three columns by three rows in its compact
width state and four columns by two rows when sufficient width is available. Exact
card dimensions, container width, gutters, and high-fidelity composition remain
foundation and representative-example decisions.

## Search Requirements

### Approved Behavior

- Music is the default Home search scope.
- The compact leading scope selector switches between Music and Chart.
- The closed selector has a visible icon and accessible name; the open selector shows
  localized text labels for both scopes.
- The placeholder, results, and submission behavior communicate the active scope.
- The Chart Viewer destination opens the same search surface with Chart scope already
  selected.
- Search hands off to the shared discovery page. Home does not reproduce full genre,
  level, difficulty, record, or availability filters.
- Keyboard operation, visible focus, and a programmatic label are required. Placeholder
  text alone is not the label.
- Submitting an empty or whitespace-only query explicitly opens the default browse
  state for the active scope: Music catalog for Music and published-chart catalog for
  Chart.
- Treat the destination as browsing, not as results matched by an empty query. Use a
  localized scope-aware catalog heading or state rather than an empty-results or
  validation message.
- Do not generate an empty `q` parameter for this transition. Preserve the selected
  scope in restorable and shareable URL state; omit `q` when no normalized query
  exists.
- Only an explicit submission or direct destination activation navigates to the
  catalog. Focusing an empty field does not navigate automatically.
- A non-empty normalized query opens a Home preview after composition has ended and
  `300ms` have passed without further input. Do not update results while Korean,
  Japanese, or another IME composition is active.
- Opening or updating the preview never navigates automatically.
- The preview shows the highest-relevance matches up to a maximum of five and has no
  internal scrolling.
- When the total is within the current preview capacity, show only the matches. When
  more matches exist than the preview can show, add a distinct localized
  `View all N results` handoff after the ranked matches.
- The complete-results handoff navigates to shared discovery with the active scope and
  normalized query preserved. It does not expand more results inside Home.
- When no preview match exists, keep the user's query and show a concise localized
  no-match message. Do not show a visible complete-results handoff in this state;
  explicit Enter or search-control submission may still open shared discovery.
- An empty focused field stays quiet: do not open recent, trending, or placeholder
  suggestions.
- Render preview states in a non-modal popup anchored directly below the search
  control. It overlays later Home content without changing document flow, adding a
  backdrop, or locking interaction with the rest of Home.
- Close the popup after selecting a match or the complete-results handoff, pressing
  `Escape`, clearing the query, or interacting outside the search region. `Escape`
  preserves the query.
- Begin retrieval after the approved IME-safe `300ms` idle interval. Mark the
  suggestion region busy immediately, but show its compact localized loading row only
  when the same request remains pending for an additional `400ms`.
- This `400ms` Home visual-loading threshold is intentionally different from the
  shared discovery surface's `300ms` request-visibility threshold. Home invalidates
  and hides its lightweight preview immediately and avoids opening a transient popup;
  discovery preserves a primary result collection as normal and operable until its
  threshold, then marks and weakens a still-pending replacement sooner. Do not
  normalize these values without new evidence and user approval.
- A normalized query or scope change immediately hides prior matches and clears the
  prior failure. Cancel the obsolete request when possible and always ignore a stale
  response that does not belong to the latest query and scope.
- Retrieval failure appears inside the popup as a concise localized message with a
  text retry action for the same query and scope. Keep the query, scope selector,
  explicit submission, direct destinations, and the remainder of Home usable.
- Do not style retrieval failure as invalid input or move focus to the message. New
  input dismisses that failure and starts the next debounced search cycle.
- Do not fix the default Music difficulty, filter, sort, Chart grouping, or Chart
  ordering in this Home brief. Define those defaults in the shared Music/Chart
  discovery brief with representative data.

### Downstream Discovery Resolution

- Shared discovery preserves the query when no result is found and never clears it
  automatically. The user edits or clears it through the visible search control.
- Home hands off only the normalized query and active scope. Complete filters, sorting,
  batching, and result recovery remain owned by shared discovery.

## Destination Requirements

- Represent the eight destinations as one semantic list of links.
- Use one consistent destination component family and comparable target sizes. Being
  later in the order does not make Bingo, Exams, Arcades, or Data Sync hidden,
  disabled, or a More-panel-only destination.
- Use three columns and three rows when the destination region is narrower than its
  validated `448px` content threshold, including representative `320px` and `390px`
  frames. Use four columns and two rows at and above that available width. Keep the
  final two compact items in source order at the leading edge of the third row; do not
  stretch either item, center them through unequal spans, collapse to two columns, or
  expand desktop to a single row.
- Keep all eight blocks equal in width and visual weight. A localized label may wrap
  without clipping or truncation; let the shared row height accommodate the longest
  required label rather than shrinking text below the approved type system.
- The entire visible destination block should have one predictable link target.
- Each destination needs visible localized text; an icon cannot be its only label.
- Music, Chart Viewer, Tiers, Bingo, and Exams must preserve their distinct NOSTALGIA
  meanings. Do not replace them with a generic grouping label. Concise visible labels
  may use `Music`, `Charts`, `Tiers`, `Rankings`, `Bingo`, `Exams`, `Arcades`, and
  `Data Sync` in English; `Charts` remains the entry to the Chart Viewer collection,
  not a renamed product feature.
- Do not add descriptions to every block by default. Use supporting text only when
  research or localization testing shows that the label alone is insufficient.
- Do not add permanent rows of extra mode or filter buttons to Home.

### Destination Prominence Alternatives

| Alternative                           | Meaning                                                                                                                                   | Benefit                                                                                            | Risk or cost                                                                                                                  |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Consistent blocks with priority order | Use the shared search as the strongest Music/Chart affordance, then order all eight comparable destination blocks by approved importance. | Preserves a calm, predictable collection while making the primary paths easier to encounter first. | The priority difference is subtler than unequal card sizes.                                                                   |
| Unequal card sizes or grid spans      | Give selected destinations visibly larger areas than the other peer destinations.                                                         | Makes hierarchy immediately visible.                                                               | Can create a noisy eight-item grid, complicate responsive consistency, and imply that smaller destinations are less complete. |
| Separate labeled groups               | Divide the destinations into primary and secondary groups.                                                                                | Makes the distinction explicit in text.                                                            | Adds headings and fragmentation and risks inventing an inaccurate domain grouping.                                            |

**Approved:** Use the first alternative as equal peers in an adaptive `3 × 3` compact
and `4 × 2` standard/wide collection. Exact block dimensions remain foundation and
representative-example decisions, but a future visual design must not create emphasis
by assigning unrelated accent colors, arbitrary card sizes, or a stretched final
block.

## Notice and News Alternatives

### Service and NosLog Announcements

| Alternative                                   | Placement model                                                                                                                | Benefit                                                                      | Risk or cost                                                                                |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| One top notice area for every announcement    | Sort all notices within one area before search.                                                                                | Maximum visibility and minimal publishing-model change.                      | Routine updates repeatedly displace the primary task and receive false urgency.             |
| Two role-based placements with no duplication | Show at most the highest-impact active service notice before search; show routine NosLog updates once in a lower updates area. | Protects the primary task while preserving urgent and routine communication. | Requires placement or severity metadata, expiry rules, and localized publishing discipline. |
| One lower notice area for every announcement  | Put both critical and routine notices after core tasks.                                                                        | Keeps the top of Home consistently task-focused.                             | A user may miss an outage or sync problem before beginning an affected task.                |

**Approved:** Use the second alternative. This is not two copies of one notice and not
only a sort order inside one announcement list. Each announcement has one role and one
placement:

- an outage, maintenance window, sync breakage, important data incident, or another
  condition that changes the current visit may occupy the pre-search service-alert
  position;
- a routine NosLog release or project update appears once in a lower updates area
  after the eight-destination collection; and
- when no active service-critical notice exists, no container or gap is reserved above
  search.

Routine updates use the following approved presentation:

- show the newest three published announcements, newest first;
- expose the title and localized publication date as a compact link row;
- do not place the full body in a Home accordion or expand it in place;
- open each item on its localized public announcement-detail page;
- provide an “All announcements” link to the localized announcement archive;
- omit the whole routine-announcement section when there is no published item; and
- keep the same three-item limit on mobile and desktop rather than increasing the
  desktop count.

Do not stack routine updates as equally urgent banners above search. The archive and
detail pages preserve access to complete and older content without allowing the Home
section to grow indefinitely.

### Official NOSTALGIA News

**Approved:**

- Use X's official Embedded Timeline for the `NOSTALGIA_573` profile. Do not use a
  paid API, scraping, or an unofficial proxy.
- Present the latest source post as one item in a distinct official-news grid or region
  immediately after routine NosLog announcements.
- “Grid” identifies an independent content collection; it does not approve a final
  column count. Mobile starts with one column, while wide-layout composition remains a
  later guide decision.
- Keep the source post in its original language and provide a localized link to the
  official account.
- Do not duplicate the same post elsewhere on Home.
- Load the widget after core Home content. Search and all eight destinations remain
  usable when X is blocked, delayed, or unavailable.
- When the widget fails, do not leave an indefinite skeleton or broken empty frame;
  retain the localized official-account fallback.

**Implementation caveat:** The current component already uses X's official widget and
requests a one-post limit, but the verified browser produced a hidden `0 × 0` Timeline
iframe. The future implementation must start from the current X Publish-generated
Embedded Timeline structure, correct the integration, and verify visible post content
in supported browsers. The present component is evidence of required debugging, not a
working implementation to copy unchanged.

## Required Data and Content Constraints

### Known Current Constraints

- Up to three published NosLog announcements are fetched.
- Announcement title: maximum 80 characters.
- Announcement body: maximum 2,000 characters.
- Announcement date: optional ISO timestamp rendered with locale-specific formatting.
- Eight direct product destinations are required, including Data Sync.
- Official news currently relies on the `NOSTALGIA_573` X account.
- The current official Timeline integration does not expose a visible Post in the
  verified browser.

### Required Data Model Changes

- Notice severity or placement classification.
- Optional notice start and expiry times.
- Korean, Japanese, and English announcement title and body.
- A stable public announcement identifier or slug for localized detail URLs.
- Published-list queries for the localized announcement archive, ordered newest first.
- A publication-readiness check that prevents publishing when any required
  NosLog-authored translation is missing.

No official audio, video, or logo asset is added to the NosLog server by this brief.
The embedded official X post remains externally hosted source content.

## Required States

| State                                 | Required outcome                                                                                                                | Status     |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Normal                                | Search and all approved destinations are immediately available.                                                                 | `Approved` |
| No service notice                     | No empty notice container or reserved gap appears above search.                                                                 | `Approved` |
| Service-critical notice               | At most the highest-impact active notice precedes search without changing destination availability unless required.             | `Approved` |
| Multiple routine notices              | Show only the newest three title-and-date links in the lower updates area; older items remain available in the archive.         | `Approved` |
| No routine announcement               | Omit the entire routine-announcement section without reserving an empty card, heading, or gap.                                  | `Approved` |
| No official news                      | Core tasks remain unchanged; retain the localized official-channel link without an empty feed shell.                            | `Approved` |
| Official-news load failure            | No broken iframe or indefinite skeleton; retain the official-channel link and keep core Home usable.                            | `Approved` |
| Empty or whitespace search submission | Open the active scope's default browse catalog without a validation error or empty-query results label.                         | `Approved` |
| Empty focused search field            | Keep the preview closed; do not show recent, trending, or placeholder suggestions.                                              | `Approved` |
| One to five preview matches           | Show only the ranked matches, up to the current preview capacity, without an internal scrollbar.                                | `Approved` |
| More than preview capacity            | Show the highest-relevance matches plus a distinct `View all N results` handoff to shared discovery; do not expand Home.        | `Approved` |
| No preview match                      | Preserve the query, show a concise no-match message, and omit the visible complete-results handoff.                             | `Approved` |
| Preview request under `400ms`         | Mark the suggestion region busy but show no visual loader; prior matches have already been invalidated.                         | `Approved` |
| Preview request beyond `400ms`        | Open the anchored popup with one compact localized loading row; keep search and the remainder of Home interactive.              | `Approved` |
| Search service failure                | Preserve query and scope; show an inline message and text retry in the popup without invalid-input styling or focus movement.   | `Approved` |
| Obsolete preview response             | Ignore it completely; only the latest normalized query and scope may update or announce preview state.                          | `Approved` |
| Signed out                            | Public search and destinations remain available; Header shows Login.                                                            | `Approved` |
| Signed in                             | Header shows the profile control; Home does not add personalized cards.                                                         | `Approved` |
| Unsupported or missing translation    | Do not publish a NosLog-authored notice until all three translations exist. The external X post remains in its source language. | `Approved` |
| Reduced motion                        | Header and other Home motion obey reduced-motion preferences; information never depends on animation.                           | `Approved` |

Home has no destructive action. Authentication prompts, permission errors, feedback
submission, and downstream empty results are specified by their respective page or
component briefs.

## Responsive Behavior

### Mobile Requirements

- Use 390px as the representative baseline and test narrower supported widths.
- Keep the semantic reading order aligned with information priority.
- Search is usable without horizontal scrolling and without truncating the active
  scope into an ambiguous icon.
- Do not place preview matches in a nested scroll region. Five is the maximum, not a
  required minimum: when the on-screen keyboard or available container height cannot
  accommodate five readable rows, show fewer ranked matches and retain the
  complete-results handoff when undisplayed matches exist.
- Keep the non-modal popup aligned to the search control and inside the viewport. It
  may temporarily cover later Home content but must not push destination blocks,
  create document overflow, add a backdrop, or block the rest of Home.
- Keep all eight destinations, including Data Sync, in three columns and three rows at
  representative `320px` and `390px` compact frames. Keep the third cell of the final
  row empty rather than resizing or reordering the final two peers. Wrap long localized
  labels and adapt gaps, padding, or shared block height without horizontal scroll.
- Destination labels remain readable in Korean, Japanese, and English.
- Editorial content does not push search and destinations below unnecessary
  introductory content.
- Routine announcements remain a three-row title-and-date collection; full bodies open
  on their detail pages rather than expanding the mobile Home.

### Desktop Requirements

- Remove the current global `390px` Home canvas constraint.
- Use a capped responsive page container and local grids to improve scanning,
  grouping, and comparison rather than merely enlarging the mobile column.
- Preserve the same semantic hierarchy, source order, focus order, and destination
  meanings.
- Keep the identity-and-search zone centered and bounded as the strongest Home region;
  do not stretch the search control across the full desktop container.
- Do not increase the search-preview maximum beyond five merely because desktop has
  more space. The shared discovery page owns larger result collections.
- Keep the popup attached to the same centered, bounded search region; wider layouts
  do not turn it into a page-width result panel.
- Keep the eight-destination collection at four columns and two rows after search,
  with one consistent block family and the approved reading order. Do not expand it
  into a single eight-column desktop toolbar.
- Bound the destination collection within the page grid instead of stretching its
  blocks indefinitely across wide screens.
- Keep routine announcements and official NOSTALGIA news in a lower editorial zone,
  not in a permanent sidebar beside search.
- At sufficiently wide layouts, place the two editorial sections side by side with
  routine NosLog announcements receiving the larger share. Stack them in source order
  when the available width is insufficient.
- Wider layouts keep the same three routine announcements and may recompose their
  container without adding older items.
- Do not move a service-critical notice into a low-priority rail.
- Exact container width, breakpoint, gutter, block dimensions, and editorial split
  ratio remain foundation and representative-example decisions. The destination
  column and row count is already approved.

### Container Behavior

Destination blocks and editorial summaries should adapt to the actual width of their
containing region. For the Home destination collection, adaptation changes between the
approved compact `3 × 3` and standard `4 × 2` relationships and may also change bounded
width, gap, padding, label wrap, and shared block height. Base the production
transition on the collection container, not a device label. Viewport breakpoints define
major shell changes; container queries may adapt this and other reusable collections
when the same component appears in a narrower region.

## Accessibility Requirements

- Provide one page `h1` that identifies NosLog and its Home context without repeating
  decorative wordmarks as headings.
- Use descriptive `h2` headings for content sections that remain on Home.
- Associate a visible or programmatically persistent label with search; do not rely on
  placeholder text alone.
- Expose the destination collection as navigation or a labeled link list with logical
  focus order.
- Give every icon-only scope or menu control an accessible name, state, and visible
  text when expanded.
- Expose the suggestion popup, active scope, expanded state, result relationship, and
  result count with appropriate combobox and listbox semantics. Keyboard and
  screen-reader users must be able to reach a preview match and the separate
  complete-results handoff without entering a nested scroll region.
- Mark the suggestion region busy as soon as the latest request starts. Announce the
  delayed loading state, final result count, no-match state, or retrieval failure
  without moving focus, and suppress announcements from canceled or stale requests.
- The retry text action must be keyboard operable and retain the latest query and
  scope. Retrieval failure uses programmatically determinable error semantics but
  does not mark the user's query as invalid.
- Ensure keyboard users can change scope, submit search, traverse destinations, and
  reach footer links without a focus trap.
- Retain the skip link and meaningful `header`, `main`, `nav`, `section`, and `footer`
  landmarks.
- Aim for comfortable touch targets and meet at least WCAG 2.2 target-size
  requirements. Exact component dimensions belong to the foundation.
- Do not make urgency, active scope, or destination type distinguishable by color
  alone.
- Expose routine announcements as a semantic list. Each row must have one clear
  localized detail-link target, and the “All announcements” control must identify that
  it opens the complete announcement collection.
- External official links identify their destination and opening behavior.
- Treat the approved third-party X timeline as supplementary content. Keep a localized
  official-channel link available without requiring the widget, and never make a core
  task depend on it.

## Localization Requirements

- Support Korean, Japanese, and English routes without changing task priority.
- Keep `NosLog` and game/product identifiers in their approved original form.
- Test at least these labels and equivalents: Chart Viewer, Data Sync Guide, Official
  NOSTALGIA News, and Feedback/Error Report.
- Search placeholder and visible label must describe both title and artist behavior in
  natural wording for the active locale.
- Localize the delayed loading message, result-count status, no-match message,
  retrieval-failure message, retry action, and complete-results handoff in Korean,
  Japanese, and English.
- Use locale-aware dates and avoid fixed-width date assumptions.
- Destination blocks must support Japanese and English expansion without reducing
  labels to unexplained icons.
- Require Korean, Japanese, and English content for NosLog-authored notices before
  publication.
- Localize the routine-announcement heading, “All announcements” link, detail and
  archive page metadata, and publication dates. Preserve the same announcement identity
  across locale routes rather than creating unrelated language-specific records.
- Localize the official-news heading, official-channel link, and fallback text. The
  embedded official X post remains the publisher's original Japanese source content
  and is not represented as a NosLog translation.

## Browser Verification Targets

The later design and implementation must verify:

- signed-out and signed-in Home;
- Korean, Japanese, and English routes;
- at least `320px`, `390px`, `768px`, `1024px`, and `1440px` viewport checks;
- zero horizontal document overflow at supported widths;
- Music and Chart scope selection with keyboard and pointer input;
- query submission, empty-query browse behavior, IME composition, and the `300ms`
  preview delay;
- empty focus, one to five matches, more-than-capacity matches, and no-match preview
  states, including preserved query and complete-results handoff rules;
- preview use at compact mobile keyboard height and desktop width without an internal
  result scrollbar or automatic navigation;
- anchored popup placement without layout shift, backdrop, document overflow, or loss
  of access to other Home controls;
- responses below and above the `400ms` visual-loading threshold, including immediate
  busy semantics and no fast-response spinner flash;
- query and scope changes during an active request, canceled requests, and deliberately
  reordered responses to verify that stale data never appears or is announced;
- retrieval failure, retained query and scope, keyboard-operable retry, new-input
  recovery, explicit submission, and continued access to every direct destination;
- popup dismissal through selection, complete-results handoff, `Escape`, query clear,
  and outside interaction without clearing the query on `Escape`;
- all eight destination links in compact `3 × 3` and standard/wide `4 × 2`
  collections, including Data Sync and the leading two-item compact final row;
- no service-critical notice and one service-critical notice;
- zero, one, exactly three, and more than three published routine announcements,
  including correct newest-first truncation and complete archive access;
- each Home announcement link, the “All announcements” link, and their Korean,
  Japanese, and English detail and archive destinations;
- official-news normal, empty, and unavailable states;
- compact Header scroll hide/reveal, persistent-wide Header, and reduced-motion behavior;
- visible focus order, skip link, landmarks, accessible names, and console errors.

## Acceptance Criteria for This Brief

- The primary task and success conditions are explicit.
- Every current Home function has an approved or rejected disposition.
- No approved information-architecture destination disappears.
- Content priority does not equate retention with equal visual weight.
- Mobile and desktop behavior preserve the approved eight-item adaptive destination
  grid: compact `3 × 3`, standard/wide `4 × 2`, with equal peer sizes and source order.
- Three-language constraints include editorial data, not only UI labels.
- Loading, empty, error, authentication, and reduced-motion states are covered.
- No material Home behavior remains `Open` or `Proposed`; scheduled foundation,
  content, and specimen details are not unresolved Home behavior.
- The user approved the complete synchronized brief and resolved decision register on
  2026-07-31.

## Decision Register

| ID      | Decision                                | Direction or question                                                                                                                                                                                                                                                  | Status       |
| ------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| HOME-01 | Home role                               | Orientation and task-routing surface, not a dashboard or miniature copy of every page.                                                                                                                                                                                 | `Approved`   |
| HOME-02 | Primary task                            | Shared Music/Chart search is the strongest Home task.                                                                                                                                                                                                                  | `Approved`   |
| HOME-03 | Destination set                         | Music, Chart Viewer, Rankings, Tiers, Bingo, Exams, Arcades, and Data Sync remain separate peer destinations.                                                                                                                                                          | `Approved`   |
| HOME-04 | Data Sync                               | Superseded by `HOME-18`: replace the former separate play-support row with Data Sync as the eighth peer in the Home destination collection; retain the stable More-panel entry.                                                                                        | `Superseded` |
| HOME-05 | Feedback                                | Move to More; do not show on Home or duplicate in Footer.                                                                                                                                                                                                              | `Approved`   |
| HOME-06 | Personalization card                    | Do not add stale-sync, recent-play, or incomplete-content cards.                                                                                                                                                                                                       | `Rejected`   |
| HOME-07 | Destination prominence                  | Use one consistent block family; express priority through shared search and the order Music → Chart Viewer → Tiers → Rankings → Bingo → Exams → Arcades → Data Sync.                                                                                                   | `Approved`   |
| HOME-08 | Notice placement rule                   | Give each notice one role and one placement: at most one active task-affecting notice before search; routine updates once below core tasks.                                                                                                                            | `Approved`   |
| HOME-09 | Official-news presentation              | Use X's official Embedded Timeline to show the latest `NOSTALGIA_573` source post once in a distinct grid after routine NosLog announcements.                                                                                                                          | `Approved`   |
| HOME-10 | Editorial localization                  | Require all three languages for NosLog-authored notices; localize the X section UI while preserving the embedded source post's original language.                                                                                                                      | `Approved`   |
| HOME-11 | Empty search behavior                   | Treat empty and whitespace-only submission as explicit entry to the active scope's browse catalog; omit empty `q`, preserve scope, and defer catalog defaults to the shared discovery brief.                                                                           | `Approved`   |
| HOME-12 | Desktop composition                     | Use semantic zones beyond 390px: centered bounded search, a bounded four-column by two-row destination collection, then a larger NosLog-updates region beside smaller official news when space permits.                                                                | `Approved`   |
| HOME-13 | Routine NosLog announcement destination | Keep once on Home below the eight-destination collection, immediately before official NOSTALGIA news.                                                                                                                                                                  | `Approved`   |
| HOME-14 | Empty official-news state               | Keep the localized official-channel link without an empty feed shell; core tasks remain unchanged.                                                                                                                                                                     | `Approved`   |
| HOME-15 | Routine announcement presentation       | Show the newest three title-and-date links on every viewport; open localized detail pages, provide an archive link, and omit the section when empty.                                                                                                                   | `Approved`   |
| HOME-16 | Search preview                          | After IME-safe `300ms` idle, show at most five ranked matches without internal scrolling or in-place expansion; use the approved four states and hand excess matches to shared discovery.                                                                              | `Approved`   |
| HOME-17 | Async preview feedback                  | Use an anchored non-modal popup, delayed `400ms` visual loading, immediate prior-result invalidation, stale-response rejection, and inline retryable failure without blocking Home or marking the query invalid.                                                       | `Approved`   |
| HOME-18 | Destination grid geometry               | Superseded by `HOME-20`: formerly fixed eight equal destination blocks to four columns and two rows at every supported width.                                                                                                                                          | `Superseded` |
| HOME-19 | Home `N` logo mark                      | Preserve the compact `N` mark in the Home identity region while retaining a visible `NosLog` heading and localized service description.                                                                                                                                | `Approved`   |
| HOME-20 | Adaptive destination geometry           | Use eight equal peers as `3 × 3` below the validated compact content width and `4 × 2` when sufficient width is available; keep the final compact row source ordered and unstretched, preserve 14px control labels, and use concise localized labels without ellipsis. | `Approved`   |

## Phase Approval

The user approved the synchronized English and Korean Home brief as a complete phase
deliverable on 2026-07-31 after reviewing the resolved decision register and
cross-document audit. This approval fixes the documented Home hierarchy, content,
interaction, responsive behavior, states, accessibility, localization, and downstream
handoff contracts.

On 2026-08-08, the user approved `HOME-18`, superseding the former separate Data Sync
Home row and the previously open destination column count. The later `HOME-20`
amendment keeps the same eight equal peers and Data Sync's More-panel entry, but
supersedes the fixed cross-width geometry: compact regions use `3 × 3`, while regions
with sufficient label measure use `4 × 2`.

The same review approved `HOME-19`: the compact `N` logo mark remains part of the
Home identity. It is not a substitute for the visible service name, semantic page
heading, or localized description.

The user approved `HOME-20` after reviewing the compact multilingual and `200%` text
pressure. The visible destination role remains `14/20`; English `Chart Viewer` is
shortened to `Charts` in this navigation context, with corresponding concise Korean
and Japanese labels. Labels wrap when needed and are not ellipsized.

Exact foundation tokens, final visual geometry and breakpoints, component styling,
localized production copy, and scheduled representative specimens remain downstream
design-system or content work. They do not reopen the approved Home product behavior.

## Ongoing Handoff

The approved Home contract remains an upstream constraint for Foundation, downstream
design, implementation mapping, and localized production copy. Later approved page
briefs supersede no Home behavior unless their decision logs say so explicitly.
