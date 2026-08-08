# NosLog 2.0 Foundation S5 Home Structural Validation

## Document Control

- Status: `Measured draft — S5 First Review ready`
- Canonical language: English
- Korean companion:
  [31-foundation-s5-home-structural-validation.ko.md](./31-foundation-s5-home-structural-validation.ko.md)
- Started: 2026-08-08
- Scope: structural validation of the approved Home identity, shared search,
  adaptive destination collection, notice hierarchy, editorial composition,
  localization, state, target, and responsive contracts on representative specimen
  `S5`
- Interactive specimen:
  [s5-home-structure.html](./specimens/s5-home-structure.html)
- Approval boundary: this document does not approve final color, material, logo
  drawing, icon set, exact production dimensions, final component styling, X widget
  implementation, search API, production copy, final page composition, or application
  code

## Related Authority

- [Home page brief](./03-home-page-brief.md)
- [Announcement page brief](./14-announcements-page-brief.md)
- [Shared shell and navigation brief](./15-shared-shell-navigation-brief.md)
- [Shared discovery page brief](./04-shared-discovery-page-brief.md)
- [Foundation v0.1 research brief](./24-foundation-v0.1-research-brief.md)
- [Foundation semantic role map](./25-foundation-semantic-role-map.md)
- [Foundation typography and layout candidates](./26-foundation-typography-layout-candidates.md)

The Home brief owns purpose, task hierarchy, destination meaning, search behavior,
announcement placement, official-news role, state behavior, and the approved adaptive
`3 × 3` compact / `4 × 2` standard destination relationship. The Announcement brief
owns publication and Archive/Detail
behavior. Documents `25` and `26` own shared typography, spacing, grid, container,
density, and target contracts. This validation may expose a conflict but may not
silently rewrite those authorities.

## Validation Purpose

`S5` tests whether Home can remain an immediate orientation and routing surface rather
than becoming a marketing page, dashboard, or miniature copy of every destination. It
must answer:

1. Can the compact `N` mark, visible `NosLog` heading, localized service context, and
   shared Music/Chart search form one restrained identity-and-task region?
2. Can search remain the strongest Home task without removing the eight direct
   destinations that support alternative navigation?
3. Can eight equal destinations reflow to three columns by three rows at `320 CSS px`
   and return to four columns by two rows when sufficient width is available, across
   Korean/Japanese/English and at `200%` text, without clipping, truncation, micro-type,
   or document horizontal scrolling?
4. Can intermediate and wide layouts bound search and destinations deliberately rather
   than retaining the current `390px` canvas or stretching four blocks indefinitely?
5. Can one service-critical notice precede search without turning routine updates into
   alerts or producing an empty reserved gap?
6. Can routine NosLog announcements and the supplementary official NOSTALGIA source
   remain in their approved order while stacking compactly and using an `8/4` wide
   editorial relationship?
7. Can the official X region fail or be blocked without a broken frame, indefinite
   skeleton, or loss of access to core Home tasks?
8. Can the search preview overlay later Home content without layout shift, nested
   scrolling, automatic navigation, or stale state?

## Non-goals

- This is not the final Home design, final Figma screen, or production implementation.
- It does not select the final dark palette, border, radius, elevation, iconography,
  motion, logo artwork, illustration, or final component styling.
- It does not implement the scope selector, IME-safe debounce, search API, X widget,
  announcement routes, or responsive application shell.
- It does not personalize Home, add a fixed bottom navigation, add descriptions to
  destination blocks, or reopen the destination order and approved adaptive geometry.
- It does not move Feedback back to Home, move Privacy or GitHub out of the footer, or
  change the already approved announcement order.
- It does not use the legacy NOSTORY Figma as current layout authority.

## Observed Baseline

### Repository and browser evidence — 2026-08-08

| ID          | Observation                                                                                                                                                 | Status     |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `S5-OBS-01` | The current route renders a Home-only Music search, six direct destinations in a `3 × 2` grid, a separate Data Sync row, Home Feedback, and official X.     | `Observed` |
| `S5-OBS-02` | Chart Viewer is not a current direct Home destination, even though the approved Home contract requires it as the second peer.                               | `Observed` |
| `S5-OBS-03` | The current implementation places routine announcements before identity and search rather than in the approved lower editorial region.                      | `Observed` |
| `S5-OBS-04` | At a `1440 × 900` browser viewport, current `main` remains approximately `390px` wide and the destination grid approximately `358px` wide.                  | `Observed` |
| `S5-OBS-05` | At `320` and `390px`, the current grid contains three columns and six `80px`-high blocks; Data Sync remains a separate horizontal row.                      | `Observed` |
| `S5-OBS-06` | The current official widget creates no usable visible source-post region in the verified browser; the official-account fallback remains the usable surface. | `Observed` |
| `S5-OBS-07` | Current Home does not expose the approved Music/Chart scope selector, preview popup, complete-results handoff, or preview recovery states.                  | `Observed` |
| `S5-OBS-08` | The repository and browser were clean and synchronized on `dev` before this draft began.                                                                    | `Observed` |

These observations are migration evidence only. The current visual hierarchy, narrow
desktop canvas, destination geometry, Feedback placement, and announcement placement
are not 2.0 design authority.

## Approved Contracts Under Test

### Identity and primary task

- Preserve the compact `N` logo mark as a Home identity element.
- Keep one visible `NosLog` `h1` and one localized service-context line. The `N` mark
  never substitutes for either one.
- Use the shared `page-title` role rather than promoting Home to the gated `display`
  role. Search remains stronger through composition and task placement.
- Music remains the default search scope. The compact leading scope control changes
  Music/Chart context; it does not create two permanent search rows or tab buttons.
- The preview is an anchored non-modal popup. It shows no empty-field suggestions,
  no internal scrolling, no more than five matches, a separate complete-results
  handoff when needed, and concise loading/empty/error recovery.

### Search and destination width relationships

The representative structure uses the approved page-grid tiers as follows:

| Page-layout tier                | Search and identity | Destination collection | Destination geometry |
| ------------------------------- | ------------------- | ---------------------- | -------------------- |
| Narrow compact region `<448px`  | `4/4` tracks        | `4/4` tracks           | exactly `3 × 3`      |
| Compact region `≥448px`, `<672` | `4/4` tracks        | `4/4` tracks           | exactly `4 × 2`      |
| Intermediate                    | centered `6/8`      | `8/8` tracks           | exactly `4 × 2`      |
| Wide `≥1056`                    | centered `8/12`     | centered `8/12`        | exactly `4 × 2`      |

The `448px` value is the measured available destination-region width, equivalent to a
`480px` specimen frame with current compact gutters; it is not a universal device
breakpoint. Production should react to the collection container's available width.
Page-grid thresholds continue to align larger regions. Search and destinations remain
bounded at wide widths instead of stretching to the complete `standard` container.

### Destination component family

- Use one semantic list of eight complete-link targets in the approved order: Music,
  Chart Viewer, Tiers, Rankings, Bingo, Exams, Arcades, and Data Sync. The concise
  visible navigation labels are `Music`, `Charts`, `Tiers`, `Rankings`, `Bingo`,
  `Exams`, `Arcades`, and `Data Sync` in English, with `악곡`/`채보` and `楽曲`/`譜面`
  equivalents for the first two entries.
- Every peer uses the same navigational component anatomy: one non-essential icon and
  one visible localized label. No descriptions, status badges, nested buttons, or
  local filters are added.
- The group has a programmatic navigation label but no additional visible section
  heading in the specimen. The immediately visible labels already identify the
  destinations, and another heading would compete with the primary search without
  adding domain meaning.
- At compact width, icon and label stack to protect text width. At measured wider
  widths they may align inline when complete labels fit. At `200%` text they return to
  stacking.
- Labels wrap; they are never clipped, ellipsized, converted to icon-only controls, or
  reduced below the approved `14/20` control role. Rows grow from their longest
  required peer.

### Notice and editorial hierarchy

- At most one active service-critical notice precedes identity and search. Its surface
  may span the `standard` content region, while its readable content is bounded to the
  same centered `8/12` wide measure as search.
- No service-critical notice means no container and no reserved gap.
- Routine NosLog announcements remain after destinations and immediately before
  official NOSTALGIA news. They never move above search.
- Compact and intermediate tiers stack routine announcements and official news in
  source order.
- Wide uses eight of twelve editorial tracks for routine NosLog announcements and four
  for official news.
- Routine announcements retain the approved maximum of three linked title/date rows
  and one complete-Archive link.
- The official region contains one externally hosted source post when available. Its
  failure state contains concise localized status plus a direct official-account link,
  without a broken empty feed shell.

## Broad Reference Comparison

| Source                                                                                                         | Transferable finding                                                                                      | S5 application                                                                  | Limitation                                                                |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [WCAG Multiple Ways](https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways)                                | Search and direct links are valid complementary ways to locate content.                                   | Keep both shared search and the destination collection.                         | It does not choose visual hierarchy or grid count.                        |
| [WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                         | Required content reflows at `320 CSS px` without two-dimensional page scrolling.                          | Wrap labels and grow rows instead of shrinking type or clipping.                | It does not require a four-column phone collection.                       |
| [W3C APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)                                         | Popup ownership, expanded state, focus, selection, and keyboard behavior need explicit semantics.         | Govern the scope-aware search preview structure.                                | It does not select debounce or Home content.                              |
| [USWDS Card](https://designsystem.digital.gov/components/card/)                                                | Simple actions do not need content-heavy card anatomy.                                                    | Keep destination blocks concise and navigational.                               | It does not require tiles or exact geometry.                              |
| [USWDS Collection](https://designsystem.digital.gov/components/collection/)                                    | Bounded linked summaries support compact scanning and a separate complete destination.                    | Keep three routine rows and the Announcement Archive handoff.                   | Its optional summaries and media are unnecessary for S5.                  |
| [USWDS Site Alert](https://designsystem.digital.gov/components/site-alert/)                                    | Site alerts are reserved for urgent sitewide information and should not be stacked.                       | Keep one service-critical pre-search slot.                                      | Government emergency emphasis can be stronger than NosLog needs.          |
| [GOV.UK Navigate a service](https://design-system.service.gov.uk/patterns/navigate-a-service/)                 | Repeated multi-task services need concise top-level destinations rather than an exhaustive persistent UI. | Keep the global Header restrained while Home exposes the approved task entries. | Government labels and styling are not copied.                             |
| [GOV.UK Notification banner](https://design-system.service.gov.uk/components/notification-banner/)             | Important banners should be sparse and link to complete information.                                      | Use one concise service state with a detail handoff.                            | It does not govern routine editorial updates.                             |
| [Carbon Tile](https://carbondesignsystem.com/components/tile/usage/)                                           | Clickable tile groups use matched variants, consistent dimensions, and one whole-tile target.             | Use eight equal peer links with one component family.                           | Carbon's visual tokens are not NosLog tokens.                             |
| [Fluent 2 Layout](https://fluent2.microsoft.design/layout)                                                     | Regions adapt to available width while preserving content priority.                                       | Center and bound task regions rather than scaling the compact canvas.           | Fluent breakpoints are not copied.                                        |
| [Japan Digital Agency Layout](https://design.digital.go.jp/dads/foundations/layout/)                           | Responsive columns, margins, gutters, and readable region width are governed together.                    | Validate the existing NosLog 4/8/12 alignment contract.                         | Public-service content density differs.                                   |
| [MDN Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries) | A component can react to the width actually available to its container.                                   | Let nested search/destination/editorial composition use measured space.         | Implementation capability does not justify product hierarchy.             |
| [Taiko.wiki Home](https://taiko.wiki/?lang=en)                                                                 | Rhythm-game reference tasks, service notices, and official notices can coexist as distinct sections.      | Preserve domain destinations and separate NosLog and official news.             | Its current notice density is a counterexample for NosLog.                |
| [Songsterr Home](https://www.songsterr.com/)                                                                   | A chart-oriented service can make immediate search the strongest public task.                             | Keep shared Music/Chart search ahead of editorial content.                      | Instrument scopes and popular-content lists do not map to NosLog.         |
| [osu! Home](https://osu.ppy.sh/)                                                                               | Rhythm-game identity and direct Beatmaps/Rankings destinations remain recognizable.                       | Preserve explicit domain routes rather than generic grouping labels.            | Its primary Home task is game download, not archive search.               |
| [CHUNITHM International](https://chunithm.sega.com/)                                                           | Recent updates are bounded and connect to a complete news destination.                                    | Support the finite Home summary plus complete Announcement Archive.             | Official marketing hierarchy is not a NosLog layout template.             |
| [Official NOSTALGIA](https://p.eagate.573.jp/game/nostalgia/op3/top/entrance.html)                             | The official source identity and source-language post remain distinct.                                    | Keep the official X region supplementary and source-authored.                   | Legacy official presentation is not an accessibility or layout authority. |

### Evidence convergence

- Accessibility and navigation sources converge on preserving both search and direct
  destinations, complete labels, one-dimensional page reflow, and semantic popup
  behavior.
- Tile and layout systems converge on one matched navigational component family,
  whole-target interaction, bounded regions, and composition based on available space.
- Alert and update references converge on separating a single urgent service state
  from bounded routine editorial content with a complete-history destination.
- Rhythm-game and chart references support explicit domain destinations and
  source-separated official news, but do not define NosLog's exact destination count,
  adaptive `3 × 3`/`4 × 2` relationship, or Music/Chart scope behavior. Those remain
  approved NosLog decisions.

## Representative Fixture and State Matrix

| ID        | Purpose                       | Specimen content                                                                        |
| --------- | ----------------------------- | --------------------------------------------------------------------------------------- |
| `HOME-01` | Identity and search           | `N` mark, visible `NosLog` heading, localized context, scope control, field, and submit |
| `HOME-02` | Destination density           | eight icon-and-label peer links in compact `3 × 3` and standard/wide `4 × 2` geometry   |
| `HOME-03` | Routine editorial hierarchy   | three title/date announcement rows, Archive link, and one official source region        |
| `HOME-04` | Service interruption          | one concise service-critical notice with a detail handoff                               |
| `HOME-05` | Preview results               | three representative matches plus complete-results handoff                              |
| `HOME-06` | Preview progress and recovery | delayed loading row, concise no-match state, retryable retrieval failure                |
| `HOME-07` | Empty routine collection      | routine section omitted; official source remains after destinations                     |
| `HOME-08` | Third-party failure           | no feed shell; localized failure copy and official-account link                         |

The specimen exposes `320`, `390`, `480`, `672`, `1056`, `1280`, and `1440px` controls,
Korean/Japanese/English content, default and `200%` text, and eight representative
states. Automated measurement must additionally cover destination transition
`479/480/481`, page-grid transition `671/672/673`, and wide transition
`1055/1056/1057px`, every width/locale/text/state combination, target geometry,
popup containment, and frame overflow.

## S5 Structural Slices

1. `S5-A` — ordinary shared Header with compact Home identity;
2. `S5-B` — optional service-critical notice before the primary task;
3. `S5-C` — restrained `N` mark, `NosLog` heading, context, and shared search;
4. `S5-D` — anchored preview with results, delayed loading, empty, and error states;
5. `S5-E` — eight equal whole-link destinations in adaptive compact `3 × 3` and
   standard/wide `4 × 2` geometry;
6. `S5-F` — three-item routine Announcement collection plus Archive handoff;
7. `S5-G` — separate one-post official source or direct-link fallback;
8. `S5-H` — stacked compact/intermediate and `8/4` wide editorial composition;
9. `S5-I` — Privacy and GitHub trust footer without Home Feedback duplication.

## Measurement Matrix

| Group           | Required measurements                                                                                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Compact         | `320`, `390px`, destination threshold `479/480/481px`, and page-grid threshold `671px`                                                                                 |
| Intermediate    | `672`, `673px` and `1055px` adjacent threshold                                                                                                                         |
| Wide            | `1056`, `1057`, `1280`, and `1440px` with `standard` maximum behavior                                                                                                  |
| Text            | default and `200%`; production also requires browser zoom and WCAG text-spacing overrides                                                                              |
| Language        | Korean, Japanese, and English long destination, notice, search, and official-fallback content                                                                          |
| Search state    | closed, results, delayed loading, no match, and retrieval error                                                                                                        |
| Editorial state | normal, service critical, no routine announcements, and official source unavailable                                                                                    |
| Input           | keyboard/pointer scope, preview results, complete handoff, Escape, outside dismissal, and retry later                                                                  |
| Structure       | no frame overflow, exact eight items, `3 × 3` below and `4 × 2` at/above the destination threshold, leading compact final row, correct wide spans, no nested scrolling |

## Browser Validation Record

Measured in the test browser on 2026-08-08.

| Validation                   | Result           | Evidence                                                                                                                                                            |
| ---------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Automated structural matrix  | `Pass — 624/624` | Thirteen widths (`320`, `390`, `479`, `480`, `481`, `671`, `672`, `673`, `1055`, `1056`, `1057`, `1280`, `1440`) × three locales × two text scales × eight states   |
| Document horizontal overflow | `Pass`           | No tested case exceeded its specimen frame                                                                                                                          |
| Destination relationship     | `Pass`           | `320`, `390`, and `479px` retained eight equal targets in `3 × 3`; `480px` and above retained `4 × 2`; the compact final row remained leading and unstretched       |
| Destination transition       | `Pass`           | Adjacent `479/480/481px` checks changed only the approved destination geometry and created no frame overflow                                                        |
| Target geometry              | `Pass`           | Every destination target retained a minimum measured block size of `44px`                                                                                           |
| Search preview containment   | `Pass`           | Results, loading, empty, and error previews remained within the search region without internal scrolling                                                            |
| Compact visual review        | `Pass`           | `390px` Korean default and `320px` English at `200%` used `3 × 3`, retained `14/20` at default scale, preserved order, and avoided ellipsis and horizontal overflow |
| Wide visual review           | `Pass`           | `1056px` Korean default retained centered `8/12` task regions and the `8/4` editorial relationship                                                                  |
| Wide no-routine state        | `Pass`           | With routine announcements omitted, official news occupied the approved leading `4/12` tracks rather than floating at the right edge                                |

The first pre-amendment automated run exposed fifteen English `200%` cases at
`320/390px` where a section heading row produced horizontal overflow. The correction
allows the heading, archive/source link, and enlarged copy to reflow vertically instead
of reducing type or clipping content. After `HOME-20`, the expanded 624-case matrix
also passed with zero failures.

The prior deliberately severe `320px` plus English `200%` combination exposed the
cost of a fixed four-column compact collection. `HOME-20` replaces that relationship
with three columns, keeps the final two peers equal at the leading edge of the third
row, and shortens only the visible Chart navigation label. Numeric pass results still
do not replace user review of N-mark emphasis, search priority, destination density,
popup overlay, announcement placement, or wide editorial balance.

## Decision and Validation Status Log

| ID       | Entry                                                                                                                                                                                                                                             | Status       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `S5V-01` | Treat current six-item `3 × 2` Home, separate Data Sync, Home Feedback, top routine notice, Music-only search, and fixed `390px` desktop canvas as migration evidence only.                                                                       | `Observed`   |
| `S5V-02` | Preserve the compact `N` logo mark together with a visible `NosLog` heading and localized service description.                                                                                                                                    | `Approved`   |
| `S5V-03` | Keep Home identity on `page-title`, not `display`, and make search strongest through task order and bounded composition.                                                                                                                          | `Approved`   |
| `S5V-04` | Use `4/4`, centered `6/8`, and centered `8/12` search relationships across compact, intermediate, and wide tiers.                                                                                                                                 | `Approved`   |
| `S5V-05` | Formerly kept destinations at exact `4 × 2` in every tier. Superseded by `S5V-10` after compact multilingual and enlarged-text review.                                                                                                            | `Superseded` |
| `S5V-06` | Let the critical surface span the standard region while bounding its wide readable content to the centered eight-track task measure.                                                                                                              | `Approved`   |
| `S5V-07` | Stack editorial sections below wide and use routine `8/12` plus official `4/12` at wide widths, without moving either above destinations.                                                                                                         | `Approved`   |
| `S5V-08` | When routine announcements are absent at wide width, place the remaining official region at the leading `4/12` tracks instead of leaving it floating at the right edge.                                                                           | `Approved`   |
| `S5V-09` | Keep exact visual appearance, production dimensions, iconography, X integration, search implementation, and application code outside this gate.                                                                                                   | `Approved`   |
| `S5V-10` | Use eight equal destinations as compact `3 × 3` below the measured available-width threshold and `4 × 2` otherwise; keep the final compact row leading and unstretched, use concise localized Chart labels, retain `14/20`, and do not ellipsize. | `Approved`   |

## First Review Gate

User review is still required before this measured draft is promoted:

1. visual acceptance of the remeasured adaptive destination fit and hierarchy,
   including the compact incomplete final row;
2. whether the measured structure requires any Foundation correction despite the
   zero-failure matrix; and
3. promotion of the validation record from `Measured draft` to `Approved`.
