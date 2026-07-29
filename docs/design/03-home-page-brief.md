# NosLog 2.0 Home Page Brief

## Document Control

- Status: `Draft for discussion`
- Evidence status: `Repository and browser audit complete; reference comparison complete`
- Date started: 2026-07-30
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
5. reach lower-priority play support and official news after the core tasks.

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

- Open Music, Chart Viewer, Rankings, Tiers, Bingo, Exams, or Arcades directly.
- Start or resume the Data Sync guidance flow.
- Read a service-critical notice when one applies.
- Reach lower-priority official NOSTALGIA news.

### Success Conditions

A Home visit succeeds when the user can do one of the following without ambiguity:

- select Music or Chart search scope, submit a title or artist query, and arrive at the
  matching shared search surface;
- browse the selected search scope without first entering a query;
- open one of the seven approved product destinations;
- open Data Sync as an independent play-support action; or
- understand a service condition that changes whether or how NosLog can be used.

## Confirmed Product Inputs

- **Approved:** Mobile is the primary context, centered on a 390px baseline; desktop
  remains required.
- **Approved:** Ordinary pages use the responsive top header. Home does not introduce
  fixed bottom navigation.
- **Approved:** Home keeps a page-level direct-navigation block collection.
- **Approved:** Music and Chart search share one surface with a compact leading scope
  selector. The Chart Viewer entry opens the shared search with Chart scope selected.
- **Approved:** Music, Chart Viewer, Rankings, Tiers, Bingo, Exams, and Arcades remain
  separate destinations. Do not introduce an umbrella content label.
- **Approved:** Data Sync remains a separate Home row and a stable More-panel entry.
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

| Check                      | Observed result                                                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 390 × 844 Korean Home      | `985px` document height; no document-level horizontal overflow; one-column content.                                               |
| 390px Japanese and English | No document-level horizontal overflow in either locale; UI labels translate, but the stored announcement remains Korean.          |
| 1440 × 1000 Home           | Header and Main remain a centered `390px` column at `x = 525px`; available desktop width is unused.                               |
| Current content order      | Announcement → identity and Music search → six quick links → Data Sync → Feedback → official news.                                |
| Official X before scroll   | A localized fallback link is present and no X iframe or script has loaded.                                                        |
| Official X after scroll    | Scripts and three X/Twitter iframes load, but the Timeline iframe remains hidden at `0 × 0` and only the fallback link is usable. |
| Empty announcements        | The entire announcement section is omitted.                                                                                       |

These observations identify functionality and risk. They do not approve the current
390px desktop constraint, equal card proportions, content order, or styling.

## Content Inventory and Disposition

| Content or function             | Required disposition                                                                                                                | Status     |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Ordinary Header                 | Use the approved responsive shell; Home does not add a second global navigation system.                                             | `Approved` |
| Service identity                | Keep a concise NosLog identity and NOSTALGIA context near the primary search.                                                       | `Approved` |
| Service-critical notice         | Show at most the highest-impact active service notice before search; reserve no gap when none exists.                               | `Approved` |
| Routine NosLog announcements    | Show each routine update once in a lower updates area after the primary destinations and Data Sync.                                 | `Approved` |
| Music and Chart search          | Make the shared scope-aware search the strongest Home task.                                                                         | `Approved` |
| Seven destination blocks        | Keep Music, Chart Viewer, Rankings, Tiers, Bingo, Exams, and Arcades separately discoverable.                                       | `Approved` |
| Data Sync                       | Keep as a visually distinct play-support action after the main destination collection.                                              | `Approved` |
| Feedback                        | Remove the Home trigger and provide it in the More panel.                                                                           | `Approved` |
| Official NOSTALGIA news         | Use the official X Embedded Timeline to show the latest source post once in a distinct grid immediately after NosLog announcements. | `Approved` |
| Personalized next-action module | Do not add.                                                                                                                         | `Rejected` |
| Footer                          | Keep Privacy and GitHub as stable secondary destinations.                                                                           | `Approved` |

## Reference Comparison

References were reviewed on 2026-07-30. They contribute different roles and are not
visual templates to copy.

| Source                                                                                                    | Transferable principle                                                                                                 | NosLog application                                                                                                             | Limitation                                                                                        |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| [W3C WCAG 2.2: Multiple Ways](https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways)                  | Search and direct navigation can provide different valid ways to locate the same content.                              | Keep both the strong shared search and direct Home destinations; neither replaces the other.                                   | It does not specify visual prominence or card layout.                                             |
| [W3C WCAG 2.2: Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html) | Headings and labels should describe purpose so users can orient and predict content.                                   | Search scope, destination names, notices, and news need descriptive visible text in every locale.                              | It does not choose NosLog terminology.                                                            |
| [Figma: UI Design Principles](https://www.figma.com/resource-library/ui-design-principles/)               | Hierarchy, progressive disclosure, consistency, proximity, and alignment reduce cognitive load.                        | Search, destinations, support, and editorial content should not receive equal visual weight merely because all are retained.   | It provides general principles rather than domain evidence.                                       |
| [GOV.UK: Navigate a Service](https://design-system.service.gov.uk/patterns/navigate-a-service/)           | Repeated, multi-task services benefit from concise navigation to the most useful top-level sections, not a site map.   | Keep the global Header restrained while Home provides task-oriented entry points to the approved product destinations.         | Government-service styling and exact header composition are not applicable.                       |
| [USWDS: Card](https://designsystem.digital.gov/components/card/)                                          | Cards are actionable summaries in related collections; simple actions may be better represented without a card.        | Destination blocks may form an enumerable link collection, while Data Sync can remain a distinct row rather than another card. | It does not require cards or determine unequal NosLog priority.                                   |
| [Tailwind CSS: Responsive Design](https://tailwindcss.com/docs/responsive-design)                         | Start mobile-first and adapt components at wider breakpoints; container queries respond to actual available space.     | Preserve one semantic order while allowing Home blocks and updates to recompose when their containers gain usable width.       | Framework capability is not evidence for a particular breakpoint or number of columns.            |
| [Taiko.wiki Home](https://taiko.wiki/?lang=en)                                                            | A rhythm-game reference can combine direct domain destinations, new charts, and separate service and official notices. | Keep domain tasks and updates discoverable but distinguish them by purpose and priority.                                       | Its labels, density, and administration model are specific to Taiko.wiki and must not be copied.  |
| [Taiko.wiki Song Search](https://taiko.wiki/song?lang=en)                                                 | Search, new charts, genres, and difficulty filters support chart-oriented discovery.                                   | Home should hand off to a capable shared search rather than reproducing its complete filter set.                               | The search-results page is not a Home layout model.                                               |
| [MusicBrainz Home](https://musicbrainz.org/)                                                              | A music database keeps typed search persistent while placing explanation, news, and community content below it.        | Make search a stable product control and keep explanatory or editorial content secondary.                                      | MusicBrainz has contribution and encyclopedia goals that NosLog does not share.                   |
| [Songsterr Home](https://www.songsterr.com/)                                                              | A chart/tab service places search first, adds a compact scope choice, and then exposes browsable popular content.      | Confirm the value of an immediate chart-oriented search with a compact scope control.                                          | Its instrument scope and popularity list do not map to NOSTALGIA modes or NosLog priorities.      |
| [osu! Home](https://osu.ppy.sh/)                                                                          | A rhythm-game service preserves direct Beatmaps and Rankings destinations with a strong service identity.              | Keep domain terminology and direct routes recognizable rather than hiding everything behind a generic menu.                    | The public Home prioritizes downloading the playable game, while NosLog is an archive and viewer. |
| [Official NOSTALGIA Op.3](https://www.konami.com/arcadegames/products/am_nostalgia_op3/)                  | Official material establishes NOSTALGIA terminology, piano interaction, hand colors, and arcade context.               | NosLog identity and viewer descriptions must remain faithful to the covered game and clearly unofficial.                       | It is a marketing and instruction page, not a records-service Home pattern.                       |
| [USWDS: Site Alert](https://designsystem.digital.gov/components/site-alert/)                              | Sitewide alerts are for urgent, time-sensitive service information; place them prominently and avoid stacking them.    | Reserve the pre-search position for at most the highest-impact active service notice, not routine project updates.             | A government-wide emergency pattern would be excessive for ordinary NosLog announcements.         |
| [GOV.UK: Notification Banner](https://design-system.service.gov.uk/components/notification-banner/)       | A notification banner communicates important information not directly tied to the current page content.                | Treat an active service condition as a distinct message role rather than making every announcement a top banner.               | The component does not define an editorial news area or NosLog publishing rules.                  |
| [Carbon: Notification](https://carbondesignsystem.com/components/notification/usage/)                     | Notification disruptiveness should match purpose; contextual callouts belong near the content they affect.             | Separate operational conditions from routine updates and keep either message concise and linked to details when necessary.     | Carbon does not yet provide finalized banner guidance for every product-level use case.           |
| [W3C APG: Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)                                 | Alerts are brief, important, and time-sensitive; frequent interruptions and automatic disappearance harm usability.    | Do not use live alert semantics for static routine updates and do not make important service messages disappear automatically. | ARIA semantics do not decide visual placement or editorial priority.                              |
| [X Help: Embed a Timeline](https://help.x.com/en/using-x/embed-x-feed)                                    | An embedded profile timeline displays public posts from the source account on another website.                         | Retain the original official NOSTALGIA source on Home while keeping an external link fallback.                                 | The embed is a third-party runtime with privacy, performance, and availability costs.             |
| [X Help: X for Websites and Privacy](https://help.x.com/en/x-for-websites-ads-info-and-privacy)           | Viewing embedded X content can send page, IP address, browser, operating-system, and cookie information to X.          | Treat the approved embed as optional third-party content and disclose or govern it consistently with NosLog privacy policy.    | This describes X data handling, not NosLog's final consent or privacy implementation.             |

### Reference Synthesis

The comparison converges on four requirements:

1. search and direct destination links should coexist;
2. the primary task must be visually stronger than retained support and editorial
   content;
3. Home should hand off to deeper filtering instead of reproducing downstream screens;
4. mobile-first does not justify retaining a fixed mobile-width canvas on desktop.

The references do not determine the exact destination order, card proportions, or
NosLog notice publishing model. Those remain user decisions. The official-news
presentation is approved below.

## Approved Information Priority

The following hierarchy is approved:

1. **Conditional service interruption:** only a notice that changes current service
   use may precede the primary task.
2. **Identity and shared search:** concise NosLog context plus the approved Music/Chart
   scope selector and search field.
3. **Primary destination collection:** all seven approved destinations in one
   consistent component family. Emphasis is expressed through the shared
   Music/Chart search and the reading order Music → Chart Viewer → Tiers → Rankings →
   Bingo → Exams → Arcades, not through loud accent colors, separate group labels, or
   an unapproved large-versus-small card system.
4. **Play support:** the independent Data Sync row.
5. **Updates and editorial content:** routine NosLog announcements followed by a
   distinct official NOSTALGIA news grid containing the latest official X post.
6. **Trust and project footer:** Privacy and GitHub.

No exact column count, card size, or high-fidelity composition is approved by this
hierarchy.

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

### Proposed Behavior

- Submitting an empty query opens the selected scope as a browseable catalog rather
  than showing a Home validation error.
- Search failure or unavailable data must not remove the direct destination collection.

## Destination Requirements

- Represent the seven destinations as one semantic list of links even if responsive
  layout gives them different visual sizes.
- Use one consistent destination component family and comparable target sizes. Being
  later in the order does not make Bingo, Exams, or Arcades hidden, disabled, or a
  More-panel-only destination.
- The entire visible destination block should have one predictable link target.
- Each destination needs visible localized text; an icon cannot be its only label.
- Music, Chart Viewer, Tiers, Bingo, and Exams must preserve their distinct NOSTALGIA
  meanings. Do not replace them with a generic grouping label.
- Do not add descriptions to every block by default. Use supporting text only when
  research or localization testing shows that the label alone is insufficient.
- Do not add permanent rows of extra mode or filter buttons to Home.

### Destination Prominence Alternatives

| Alternative                           | Meaning                                                                                                                                   | Benefit                                                                                            | Risk or cost                                                                                                                    |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Consistent blocks with priority order | Use the shared search as the strongest Music/Chart affordance, then order all seven comparable destination blocks by approved importance. | Preserves a calm, predictable collection while making the primary paths easier to encounter first. | The priority difference is subtler than unequal card sizes.                                                                     |
| Unequal card sizes or grid spans      | Give the four primary destinations visibly larger areas than the other three.                                                             | Makes hierarchy immediately visible.                                                               | Can create a noisy seven-item grid, complicate responsive recomposition, and imply that smaller destinations are less complete. |
| Separate labeled groups               | Divide the destinations into primary and secondary groups.                                                                                | Makes the distinction explicit in text.                                                            | Adds headings and fragmentation and risks inventing an inaccurate domain grouping.                                              |

**Approved:** Use the first alternative. Exact columns and block proportions remain
foundation and representative-example decisions, but a future visual design should
not create emphasis by assigning unrelated accent colors or arbitrary card sizes.

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
  after the primary destinations and Data Sync; and
- when no active service-critical notice exists, no container or gap is reserved above
  search.

The exact number and presentation of routine updates remain open. Do not stack multiple
equally urgent banners above search.

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
- Load the widget after core Home content. Search, destinations, and Data Sync remain
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
- Seven direct product destinations are required.
- Official news currently relies on the `NOSTALGIA_573` X account.
- The current official Timeline integration does not expose a visible Post in the
  verified browser.

### Required Data Model Changes

- Notice severity or placement classification.
- Optional notice start and expiry times.
- Korean, Japanese, and English announcement title and body.
- A publication-readiness check that prevents publishing when any required
  NosLog-authored translation is missing.

No official audio, video, or logo asset is added to the NosLog server by this brief.
The embedded official X post remains externally hosted source content.

## Required States

| State                              | Required outcome                                                                                                                | Status     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Normal                             | Search and all approved destinations are immediately available.                                                                 | `Approved` |
| No service notice                  | No empty notice container or reserved gap appears above search.                                                                 | `Approved` |
| Service-critical notice            | At most the highest-impact active notice precedes search without changing destination availability unless required.             | `Approved` |
| Multiple routine notices           | Show them once in the lower NosLog updates area; they do not become equally urgent banners above search.                        | `Approved` |
| No official news                   | Core tasks remain unchanged; retain the localized official-channel link without an empty feed shell.                            | `Approved` |
| Official-news load failure         | No broken iframe or indefinite skeleton; retain the official-channel link and keep core Home usable.                            | `Approved` |
| Empty search submission            | Open the selected browse scope.                                                                                                 | `Proposed` |
| Search service failure             | Communicate failure on the shared search surface; direct Home destinations remain usable.                                       | `Proposed` |
| Signed out                         | Public search and destinations remain available; Header shows Login.                                                            | `Approved` |
| Signed in                          | Header shows the profile control; Home does not add personalized cards.                                                         | `Approved` |
| Unsupported or missing translation | Do not publish a NosLog-authored notice until all three translations exist. The external X post remains in its source language. | `Approved` |
| Reduced motion                     | Header and other Home motion obey reduced-motion preferences; information never depends on animation.                           | `Approved` |

Home has no destructive action. Authentication prompts, permission errors, feedback
submission, and downstream empty results are specified by their respective page or
component briefs.

## Responsive Behavior

### Mobile Requirements

- Use 390px as the representative baseline and test narrower supported widths.
- Keep the semantic reading order aligned with information priority.
- Search is usable without horizontal scrolling and without truncating the active
  scope into an ambiguous icon.
- Destination labels remain readable in Korean, Japanese, and English.
- Editorial content does not push search and destinations below unnecessary
  introductory content.

### Desktop Requirements

- Remove the current global `390px` Home canvas constraint.
- Use available width to improve scanning, grouping, and comparison rather than merely
  enlarging the mobile column.
- Preserve the same semantic hierarchy and destination meanings.
- The destination collection may gain columns, while updates may occupy a secondary
  region after the primary search and task entry points.
- Do not move a service-critical notice into a low-priority rail.
- Exact container width, column count, breakpoint, and secondary-region composition
  remain foundation and representative-example decisions.

### Container Behavior

Destination blocks and editorial summaries should adapt to the actual width of their
containing region. Viewport breakpoints define major shell changes; container queries
may adapt reusable collections when the same component appears in a narrower region.

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
- Ensure keyboard users can change scope, submit search, traverse destinations, and
  reach footer links without a focus trap.
- Retain the skip link and meaningful `header`, `main`, `nav`, `section`, and `footer`
  landmarks.
- Aim for comfortable touch targets and meet at least WCAG 2.2 target-size
  requirements. Exact component dimensions belong to the foundation.
- Do not make urgency, active scope, or destination type distinguishable by color
  alone.
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
- Use locale-aware dates and avoid fixed-width date assumptions.
- Destination blocks must support Japanese and English expansion without reducing
  labels to unexplained icons.
- Require Korean, Japanese, and English content for NosLog-authored notices before
  publication.
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
- query submission and empty-query browse behavior;
- all seven destination links and Data Sync;
- no notice, one critical notice, and multiple routine notices;
- official-news normal, empty, and unavailable states;
- Header scroll hide/reveal and reduced-motion behavior;
- visible focus order, skip link, landmarks, accessible names, and console errors.

## Acceptance Criteria for This Brief

- The primary task and success conditions are explicit.
- Every current Home function has an approved, proposed, open, or rejected
  disposition.
- No approved information-architecture destination disappears.
- Content priority does not equate retention with equal visual weight.
- Mobile and desktop behavior are specified without fixing an unvalidated final grid.
- Three-language constraints include editorial data, not only UI labels.
- Loading, empty, error, authentication, and reduced-motion states are covered.
- Proposed and approved decisions remain visibly distinct.
- The user resolves the open decision register before this brief becomes approved.

## Decision Register

| ID      | Decision                                | Direction or question                                                                                                                                    | Status     |
| ------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| HOME-01 | Home role                               | Orientation and task-routing surface, not a dashboard or miniature copy of every page.                                                                   | `Approved` |
| HOME-02 | Primary task                            | Shared Music/Chart search is the strongest Home task.                                                                                                    | `Approved` |
| HOME-03 | Destination set                         | Music, Chart Viewer, Rankings, Tiers, Bingo, Exams, and Arcades remain separate.                                                                         | `Approved` |
| HOME-04 | Data Sync                               | Retain a separate play-support row.                                                                                                                      | `Approved` |
| HOME-05 | Feedback                                | Move to More; do not show on Home or duplicate in Footer.                                                                                                | `Approved` |
| HOME-06 | Personalization card                    | Do not add stale-sync, recent-play, or incomplete-content cards.                                                                                         | `Rejected` |
| HOME-07 | Destination prominence                  | Use one consistent block family; express priority through shared search and the order Music → Chart Viewer → Tiers → Rankings → Bingo → Exams → Arcades. | `Approved` |
| HOME-08 | Notice placement rule                   | Give each notice one role and one placement: at most one active task-affecting notice before search; routine updates once below core tasks.              | `Approved` |
| HOME-09 | Official-news presentation              | Use X's official Embedded Timeline to show the latest `NOSTALGIA_573` source post once in a distinct grid after routine NosLog announcements.            | `Approved` |
| HOME-10 | Editorial localization                  | Require all three languages for NosLog-authored notices; localize the X section UI while preserving the embedded source post's original language.        | `Approved` |
| HOME-11 | Empty search behavior                   | Open the selected scope as a browseable catalog.                                                                                                         | `Proposed` |
| HOME-12 | Desktop composition                     | Expand beyond 390px; allow task and secondary regions after search while preserving semantic order.                                                      | `Proposed` |
| HOME-13 | Routine NosLog announcement destination | Keep once on Home below the primary destinations and Data Sync, immediately before official NOSTALGIA news.                                              | `Approved` |
| HOME-14 | Empty official-news state               | Keep the localized official-channel link without an empty feed shell; core tasks remain unchanged.                                                       | `Approved` |
| HOME-15 | Routine announcement quantity           | Decide how many routine NosLog updates the lower area shows and how older items remain reachable.                                                        | `Open`     |

## First Discussion Batch

The user should decide these items before the next Home brief revision:

1. Decide the routine announcement quantity and older-announcement access in
   `HOME-15`.

Desktop composition, exact copy, and detailed search states should be discussed in a
later batch after these content decisions are resolved.
