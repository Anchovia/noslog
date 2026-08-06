# NosLog 2.0 Foundation S3 Global Rankings Structural Validation

## Document Control

- Status: `Approved — S3 First Review complete`
- Canonical language: English
- Korean companion:
  [29-foundation-s3-global-rankings-structural-validation.ko.md](./29-foundation-s3-global-rankings-structural-validation.ko.md)
- Started: 2026-08-06
- Approved: 2026-08-07
- Scope: structural validation of the approved Foundation typography, spacing,
  grid, container, density, comparison, target, and state contracts on representative
  specimen `S3`
- Approval boundary: this document does not approve color, material, final row or
  control geometry, final podium styling, avatar treatment, production screen
  composition, ranking calculation implementation, or application code

## Related Authority

- [Global Rankings page brief](./08-global-rankings-page-brief.md)
- [Foundation v0.1 research brief](./24-foundation-v0.1-research-brief.md)
- [Foundation semantic role map](./25-foundation-semantic-role-map.md)
- [Foundation typography and layout candidates](./26-foundation-typography-layout-candidates.md)
- [S1 discovery structural validation](./27-foundation-s1-discovery-structural-validation.md)
- [S2 Music Detail structural validation](./28-foundation-s2-music-detail-structural-validation.md)

The approved Global Rankings brief owns product meaning, ranking eligibility,
mode/metric availability, region populations, published-value shared ranks, personal
position behavior, row content, pagination policy, URL restoration, runtime states,
and responsive invariants. Documents `25` and `26` own shared Foundation contracts.
This validation may expose a conflict but may not silently rewrite those authorities.

## Validation Purpose

`S3` tests whether one dense public comparison destination can preserve NOSTALGIA
meaning and scan efficiency without retaining the current fixed `390px` application
column or turning every scope into a persistent peer button. It must answer:

1. Can Basic/Recital, Basic-only metric selection, one region scope, personal
   position, twenty-five ranked players, and explicit pagination fit at `320 CSS px`
   without document horizontal scrolling?
2. Can compact rows keep published rank and active value stable while a Korean,
   Japanese, Latin, or mixed-script username takes the flexible middle region?
3. Can the same ordered dataset become an aligned wide comparison without adding
   unrelated statistics or separate Country and Exam columns?
4. Can equal published values show competition ranks such as `1, 2, 2, 4` without a
   podium structure implying one unique medal holder?
5. Can the current user appear once: as a compact off-page summary or as one marked
   row, never both?
6. Can the result keep the last committed rows during loading or update failure while
   keeping empty, initial error, ineligible, and Rating-unavailable states distinct?
7. Can controls, rows, and pagination survive Korean/Japanese/English labels,
   `200%` text, visible focus, and effective public targets without a new type-size
   exception?

## Non-goals

- This is not a final page design or production-ready Figma screen.
- It does not approve the specimen's grayscale color or surface treatment.
- It does not choose final avatar size, row height, border, radius, elevation, icon,
  motion, or podium accents.
- It does not change Official Grd, NosLog Rating, eligibility, or source formulas.
- It does not implement shared-rank queries, URL history, or the `25`-row API policy.
- It does not create a Recital Rating source.
- It does not add country, exam, play-count, accuracy, or score columns.
- It does not use the legacy NOSTORY Figma as current layout authority.

## Observed Baseline

### Repository and browser evidence — 2026-08-06

| ID          | Observation                                                                                                                                                                    | Status     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| `S3-OBS-01` | At a `1280px` viewport, the current ranking `main` and content remain exactly `390px` wide; the result does not use desktop comparison space.                                  | `Observed` |
| `S3-OBS-02` | At `320px`, the current page avoids document horizontal overflow, but its usable result width is only `288px` and long usernames truncate strongly.                            | `Observed` |
| `S3-OBS-03` | The current compact hierarchy stacks three persistent button groups: mode, metric, and four regions, before the result.                                                        | `Observed` |
| `S3-OBS-04` | The current user appears in a complete separate card and again as an ordinary row on the same page.                                                                            | `Observed` |
| `S3-OBS-05` | Two visible users with the same published Grd `5,713` receive different visible ranks `3` and `4`, conflicting with the approved published-value competition ranking.          | `Observed` |
| `S3-OBS-06` | Current row identity orders country before username and keeps exam on the same line; the approved contract places country after username and exam on a supporting second line. | `Observed` |
| `S3-OBS-07` | Current page, API, and client constants use `PAGE_SIZE = 7`; the approved fixed policy is `25`.                                                                                | `Observed` |
| `S3-OBS-08` | Activating Rating while Recital is selected silently changes the primary mode to Basic; the approved contract instead removes the unavailable Rating choice from Recital.      | `Observed` |
| `S3-OBS-09` | Current pagination uses scripted buttons rather than navigable page links, and condition changes use `replaceState`, weakening ordinary Back/Forward and copied-link behavior. | `Observed` |
| `S3-OBS-10` | Current ranking code uses raw values and user IDs as visible ordinal tie-breakers, including distinct raw Ratings that round to the same published integer.                    | `Observed` |

These observations are migration and failure evidence only. They are not visual or
layout authority for this specimen.

## Approved Contracts Under Test

### Information order

The following source and reading order remains stable:

1. page identity and eligible-player count;
2. Basic/Recital mode;
3. available metric and one region scope;
4. concise Rating basis only when Rating is active;
5. conditional personal-position summary;
6. result heading and update/error status;
7. ranked rows;
8. explicit pagination.

Basic and Recital remain the always-visible primary choice. Basic exposes Official Grd
and NosLog Rating; Recital exposes only Official Grd and does not show an inert or
misleading Rating choice. Region remains one selector with All, Korea, Japan, and
Other regions.

### One ranked dataset and one active value

Every row keeps this content:

1. published shared rank;
2. avatar or fallback;
3. username followed by country/region marker;
4. active-mode exam on a supporting line when present;
5. one end-aligned active value: Official Grd or NosLog Rating.

Country and exam remain inside the player identity group at every width. The wide
layout may align the same regions more precisely, but it may not add unrelated player
statistics merely because space exists.

### Shared-rank and personal-position semantics

- Equal published Grd or rounded Rating values use competition ranks `1, 2, 2, 4`.
- Raw values may stabilize order inside a tied group but never create distinct
  published ranks.
- If the current user is off-page, one compact summary shows rank, population, value,
  and My position.
- If the current user is on-page, the summary disappears and that one row retains its
  exam plus a programmatic My rank name. It does not repeat visible My rank copy.
- A persistent inline-start structural marker accompanies optional tonal row support,
  so the distinction does not depend on color alone.

### Pagination and state policy

- Each successful page contains at most `25` players; there is no page-size selector.
- Pagination is navigable, labeled, and explicit. Infinite or automatically appended
  results are excluded.
- Existing rows and personal context remain during update loading and update failure.
- Empty, initial error, personal ineligibility, and Rating-source unavailability are
  distinct outcomes.
- The selected mode, metric, region, and page remain shareable and restorable.

### Foundation contract

- Compact uses four logical tracks, `12px` gutters, and safe-aware `16px` margins.
- Intermediate starts from a measured `672 CSS px` page-layout query container with
  eight tracks, `16px` gutters, and `24px` margins.
- Wide starts from `1056 CSS px` with twelve tracks, `16px` gutters, and `32px`
  margins.
- The page uses the approved `wide` container class and its fluid maximum, not a
  fixed phone-width shell.
- `page-title` uses `24/32 · 700`, with the approved `32/40 · 700` wide substitution
  only when the page and measured title region meet the Foundation gate.
- Row comparison values use `metric-value` `14/20 · 500` with tabular figures.
- Shared user-facing text does not fall below `12px`.
- Ordinary public effective pointer targets remain at least `44 × 44px` under the
  approved Foundation contract.

## Broad Reference Comparison

| Source                                                                                                                    | Transferable finding                                                                                          | NosLog application                                                     | Limitation                                                       |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [Current Rankings route](<../../app/(nevigation)/rankings/page.tsx>)                                                      | Existing query and public route are reusable                                                                  | Preserve domain state while replacing fixed width and `7` rows         | Current layout is superseded evidence                            |
| [Current Ranking browser](../../components/rankings/rankingBrowser.tsx)                                                   | Request-race protection already exists                                                                        | Reuse asynchronous foundation while correcting history and conditions  | Current controls and Recital redirection conflict                |
| [Current ranking queries](../../lib/rankings.ts)                                                                          | Defines populations and Rating source                                                                         | Preserve formula inputs and replace visible tie semantics              | Current ID/raw-value ordinal is rejected                         |
| [Approved Global Rankings brief](./08-global-rankings-page-brief.md)                                                      | Owns NosLog ranking meaning and content                                                                       | Governs every S3 structural invariant                                  | Does not choose final visual geometry                            |
| [NOSTALGIA official mode guide](https://p.eagate.573.jp/game/nostalgia/op3/howto/entrance.html)                           | Basic and Recital are separate official play modes                                                            | Mode remains above metric                                              | It does not define NosLog rankings                               |
| [osu! global rankings](https://osu.ppy.sh/rankings/osu/global)                                                            | Dense rank/identity/value rows, country scope, metric choice, and numbered pages coexist                      | Supports direct high-frequency metric choice and wide alignment        | osu! exposes many more statistics                                |
| [ScoreSaber Player Rankings](https://scoresaber.com/rankings)                                                             | Rank, identity, primary value, and supporting metrics scan as repeated rows                                   | Supports rhythm-game-native row comparison                             | PP and accuracy do not map to Grd                                |
| [jubeat Total Best Score Ranking](https://p.eagate.573.jp/game/jubeat/beyond/ranking/ranking4.html)                       | Official BEMANI ranking keeps player and primary published value central                                      | Supports quiet rank/value emphasis                                     | It is a different aggregate metric                               |
| [Google Play Games leaderboards](https://support.google.com/googleplay/answer/3129939)                                    | Public comparison, multiple leaderboards, player profile, and personal standing coexist                       | Supports public list plus contextual My position                       | Native UI does not prescribe web layout                          |
| [Apple Game Center HIG](https://developer.apple.com/design/human-interface-guidelines/game-center)                        | Players compare global/friend standing and best all-time scores                                               | Supports one clear active comparison context                           | Platform UI and recurrence differ                                |
| [Strava leaderboard filters](https://support.strava.com/en-us/articles/15401771-segment-leaderboard-filters)              | Secondary populations use compact scoped filters                                                              | Supports one region selector                                           | Sport/time filters are outside scope                             |
| [Chess.com leaderboards](https://www.chess.com/leaderboard)                                                               | Categories remain distinct while rows align identity and rating                                               | Supports mode/metric hierarchy                                         | Chess qualification differs                                      |
| [Lichess leaderboard FAQ](https://lichess.org/faq#leaderboards)                                                           | Eligibility must be explicit and can exclude otherwise valid users                                            | Supports personal-ineligible state                                     | Its Glicko rules are not NosLog rules                            |
| [Carbon Content switcher](https://carbondesignsystem.com/components/content-switcher/usage/)                              | Direct exclusive switching fits closely related alternate views; distinct destinations require other patterns | Supports visible Basic/Recital and a subordinate two-metric switch     | Carbon styling is not adopted                                    |
| [Carbon Data table](https://carbondesignsystem.com/components/data-table/usage/)                                          | Aligned rows support efficient comparison; features should follow task need                                   | Supports quiet wide comparison and no unrelated columns                | Mobile needs a compact transformation                            |
| [Carbon Pagination](https://carbondesignsystem.com/components/pagination/usage/)                                          | Pagination stays adjacent to its data and compresses at small widths                                          | Supports explicit responsive pages                                     | Its page-size selector is intentionally omitted                  |
| [USWDS Table](https://designsystem.digital.gov/components/table/)                                                         | Tables suit long structured lists; cells should remain brief and comparable                                   | Supports aligned Rank/Player/Value regions                             | Compact stacked variants require careful semantics               |
| [USWDS Button group](https://designsystem.digital.gov/components/button-group/)                                           | Related choices need grouping, but too many visible options burden choice                                     | Supports two bounded direct switches and one disclosed region scope    | Action groups are not identical to view switches                 |
| [GOV.UK Pagination](https://design-system.service.gov.uk/components/pagination/)                                          | Page navigation uses real links and filtering returns to page one                                             | Supports copied links, Back, and no-script navigation                  | Guidance-page labels are unnecessary here                        |
| [W3C WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                | Content must preserve information and function at `320 CSS px` except genuine 2D content                      | Requires row reflow instead of document horizontal scroll              | Does not select a ranking layout                                 |
| [WAI-ARIA APG Table](https://www.w3.org/WAI/ARIA/apg/patterns/table/)                                                     | Native table semantics are preferred for static tabular relationships                                         | Supports programmatic wide comparison headers                          | Visual compact treatment remains open                            |
| [WAI-ARIA APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)                                                       | Exclusive panels need selected state and predictable keyboard behavior                                        | Informs direct mode/metric switch semantics                            | NosLog may use buttons/content switchers rather than page tabs   |
| [WAI-ARIA APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)                                               | Select-only popups expose one value from a predefined set                                                     | Supports one region selector                                           | It should not hide high-frequency Basic metrics without evidence |
| [WCAG Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)                                  | Pointer targets need at least `24px` or sufficient spacing                                                    | Provides the standards floor below the stricter NosLog `44px` contract | Standards minimum is not the product target                      |
| [WCAG Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)                                  | Loading, result count, and error updates need programmatic exposure without forced focus                      | Supports concise update announcements                                  | Does not define visual treatment                                 |
| [web.dev Responsive basics](https://web.dev/articles/responsive-web-design-basics)                                        | Start small and add breakpoints when content requires them                                                    | Supports measured row/table and control transitions                    | Exact thresholds require specimens                               |
| [MDN Responsive design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) | Fixed width fails both narrow and wide contexts                                                               | Rejects the current `390px` desktop shell                              | General guidance does not set density                            |

### Evidence convergence

- Rhythm-game and general leaderboards converge on one stable ordered dataset, direct
  identity, a primary comparable value, personal standing, and bounded navigation.
- Direct two-choice controls are common for high-frequency related comparison modes;
  secondary multi-option populations converge on a compact selector.
- Data-table systems converge on aligned wide comparison, while responsive guidance
  requires a compact form that preserves the same information rather than shrinking a
  desktop table or forcing two-dimensional scrolling.
- Pagination guidance converges on real Previous/Next and page links near the result;
  none supports infinite scrolling as the primary navigation for a stable ranking.
- Accessibility guidance converges on native semantics, visible selected/focus state,
  programmatic status, and targets that do not lose function under reflow.
- External references do not determine Basic/Recital, Grd/Rating availability,
  published-value ties, region meaning, or exam placement. Those remain approved
  NosLog/NOSTALGIA domain decisions.

## Representative Fixture Matrix

| ID         | Purpose                   | Specimen content                                                 |
| ---------- | ------------------------- | ---------------------------------------------------------------- |
| `GR-ID-01` | Complete Korean identity  | `계롤`, Korea marker, mode exam, current-row variant             |
| `GR-ID-02` | Long Japanese identity    | `月夜のピアニスト`, Japan marker, full accessible name           |
| `GR-ID-03` | Long Latin identity       | `avery_long_player_name` and `ResonanceAndRhythm`                |
| `GR-ID-04` | Mixed-script pressure     | Korean, Japanese, and Latin identities in one 25-row page        |
| `GR-ID-05` | Other-region semantics    | globe marker with localized accessible name                      |
| `GR-ID-06` | Missing optional metadata | fallback avatar and one row without an exam                      |
| `GR-ID-07` | Published tie             | two consecutive users share published value and visible rank `4` |
| `GR-ID-08` | Page-density boundary     | exactly `25` visible rows and page `6 / 42` context              |

Implementation tests must additionally cover a tie crossing rows `25/26`, distinct
raw Ratings with one rounded integer, zero/one/`24`/`25`/`26`/hundreds of results,
and an out-of-range canonical page. Those are data and navigation tests rather than
visual specimen fixtures.

## State Matrix

- Basic + Official Grd;
- Basic + NosLog Rating with concise source basis;
- Recital + Official Grd with the metric switch absent;
- signed-in user off-page, on-page, and ineligible;
- signed-out public list with contextual login action;
- initial loading and retained-result updating;
- retained-result update error with Retry;
- empty population;
- initial error with Retry;
- Rating-source unavailable with Official Grd recovery;
- exact `25` rows and one-page result with pagination omitted;
- Korean, Japanese, and English;
- default text, `200%` text, WCAG text-spacing override, reduced motion, keyboard,
  fine pointer, and coarse pointer.

## S3 Structural Slices

1. `S3-A` — page identity, eligible population, and selection context;
2. `S3-B` — always-visible mode, conditional Basic metric, and one region selector;
3. `S3-C` — concise Rating source basis;
4. `S3-D` — compact off-page personal summary and on-page current-row marker;
5. `S3-E` — one 25-row Rank/Player/Value dataset with integrated identity metadata;
6. `S3-F` — published-value tie presentation and podium-neutral row anatomy;
7. `S3-G` — compressed and expanded explicit pagination;
8. `S3-H` — loading, update error, empty, initial error, and unavailable states;
9. `S3-I` — compact-to-aligned-wide transformation using one equivalent dataset.

## Measured Structural Candidate

The specimen demonstrates, but does not yet approve, the following candidate:

### Selection hierarchy

- Basic/Recital remains one direct two-choice primary switch.
- Basic Official Grd/NosLog Rating remains a direct two-choice subordinate switch,
  because both are high-frequency comparison views and direct switching avoids an
  unnecessary open-select step.
- Recital removes that subordinate switch and resolves Official Grd.
- Region remains one labeled native Select in the structural specimen.
- At compact widths these controls stack in hierarchy order. Wider widths align them
  only when their complete localized labels and targets fit.

### Ranked rows

- One semantic Rank/Player/Value dataset is used at every width; no duplicate compact
  and desktop row trees are exposed.
- Below the measured comparison threshold, the visible header is omitted while rank,
  integrated identity, and active value retain their relationships.
- At the threshold, the same regions align under visible Rank, Player, and active-value
  headers.
- Top ranks keep the same row anatomy. Final Claude Design may add restrained accents
  that tolerate shared ranks, but the candidate does not introduce a separate podium
  card block.
- At `200%` text and narrow widths, the active value moves below the identity instead
  of squeezing the username link below its effective target or hiding information.

### Pagination

- Compact pagination keeps Previous, first boundary, current page, last boundary, and
  Next.
- When space permits it adds one neighbor on each side plus non-interactive ellipses.
- Every navigable item keeps the Foundation effective target. The active page uses
  `aria-current="page"` and is not a dead link.

## Measurement Matrix

| Group                 | Required measurements                                                      |
| --------------------- | -------------------------------------------------------------------------- |
| Compact               | `320`, `360`, `390`, `430px`                                               |
| Pagination transition | `479/480/481px`                                                            |
| Comparison transition | `639/640/641px` at default text                                            |
| Control alignment     | `767/768/769px` at default text                                            |
| Page-grid transitions | `671/672/673px` and `1055/1056/1057px`                                     |
| Wide                  | `1280`, `1440px`, and maximum-container behavior                           |
| Text                  | default, `200%`, WCAG text-spacing override, effective `320px` at zoom     |
| Language              | Korean, Japanese, English controls and mixed-script identity               |
| State                 | three mode/metric contexts, off/on-page personal rank, five runtime states |
| Input                 | keyboard-only, fine pointer, coarse pointer, hybrid input                  |

## Browser Validation Record — 2026-08-06

The structural specimen was served locally and measured in the test browser. The
review frame controls actual component inline size. The values below validate
structure and reflow only, not final visual design.

### Core matrix result

| Matrix                       | Combination                                                                  |   Cases | Failures |
| ---------------------------- | ---------------------------------------------------------------------------- | ------: | -------: |
| Compact contexts             | `320/360/390/430 × ko/ja/en × 100/200% × Basic Grd/Basic Rating/Recital Grd` |      72 |        0 |
| Transition and wide contexts | `479–1440 measured widths × ko/ja/en × 100/200% × three contexts`            |     306 |        0 |
| Personal position            | `320/390/640/1056/1440 × ko/ja/en × 100/200% × three contexts`               |      90 |        0 |
| Runtime states               | five widths × ko/ja/en × 100/200% × five states                              |     150 |        0 |
| Total                        | all measured structural combinations                                         | **618** |    **0** |

Every passing result kept complete essential identity in the accessibility tree,
twenty-five rows where required, no specimen-level horizontal overflow, no boundary
escape, no undersized effective target, exactly one personal-position expression, and
the correct conditional metric presence.

### Measured candidate thresholds

| Transition                                      | Default text             | `200%` text                 | Meaning                                                      |
| ----------------------------------------------- | ------------------------ | --------------------------- | ------------------------------------------------------------ |
| Expanded pager neighbors                        | `480px`                  | `1056px`                    | Smaller sizes retain Previous, boundaries, current, and Next |
| Visible aligned comparison header               | `640px`                  | `1056px`                    | Same dataset gains visible Rank/Player/Value headers         |
| Mode and subordinate scope in wider composition | `640px`                  | `1056px`                    | Hierarchy aligns without changing order                      |
| Metric and region side by side                  | `768px`                  | `1056px`                    | Both full localized labels and targets fit without escape    |
| Wide `page-title` substitution                  | `1056px` Foundation gate | `1056px` measured candidate | Remains governed by `FTL-09`, not ranking preference         |

These are measured S3 component candidates, not generic device breakpoints or
Foundation tokens. The user approved these S3-specific transitions at First Review.

### Interaction and state checks

| Check                                                                | Result |
| -------------------------------------------------------------------- | ------ |
| Recital removes the metric switch and changes row exams to Recital   | `Pass` |
| Returning to Basic restores a direct two-choice metric switch        | `Pass` |
| Rating exposes its concise basis and changes the active end value    | `Pass` |
| Region Select updates one secondary population value                 | `Pass` |
| Off-page summary and on-page marked row never appear together        | `Pass` |
| Loading retains rows and personal context with `aria-busy=true`      | `Pass` |
| Update error retains rows and exposes inline Retry                   | `Pass` |
| Empty, initial error, and Rating unavailable replace rows distinctly | `Pass` |
| Compact pagination retains two boundaries and current-page identity  | `Pass` |
| Default and `200%` transitions expose one comparison mode only       | `Pass` |

### Demonstrated corrections

1. Keeping the active value on the right at `320px + 200%` squeezed the player link's
   effective region below the Foundation target. The candidate reflows the value
   beneath identity under that pressure and restores the full target.
2. Aligning metric and region beside each other at `640px` caused the region field to
   escape because the nested scope group did not have enough inline capacity. Their
   side-by-side transition moved to the measured `768px` threshold.
3. A current-row marker initially replaced the exam, violating the approved identity
   contract. The corrected row preserves exam and adds a localized programmatic My
   rank name.
4. A visible My rank supporting line increased only the current row's height and
   repeated information the signed-in player can already recognize. User review
   removed that visible copy; the row now combines an accessible name with a
   persistent inline-start structural marker and optional tonal support.
5. The initial candidate used a metric Select. Broad evidence and the approved
   high-frequency two-metric contract support a direct subordinate two-choice switch;
   region alone remains the disclosed multi-option scope.

## Decision and Validation Status Log

| ID       | Entry                                                                                                                                                                    | Status     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| `S3V-01` | Treat the current fixed width, seven-row page, persistent region buttons, duplicate personal card, Recital redirect, and unique visible ties as migration evidence only. | `Observed` |
| `S3V-02` | Preserve the approved page order, Basic/Recital meaning, Basic-only Rating, one region scope, shared ranks, integrated identity, personal position, and 25-row policy.   | `Approved` |
| `S3V-03` | Use a direct Basic/Recital switch, a conditional direct Basic metric switch, and one region Select in S3.                                                                | `Approved` |
| `S3V-04` | Use one equivalent semantic dataset with a headerless compact expression and aligned visible headers from the measured capacity threshold.                               | `Approved` |
| `S3V-05` | Keep top ranks in the same row anatomy and leave restrained tie-safe visual accents to the later appearance gate; do not add a separate podium block.                    | `Approved` |
| `S3V-06` | At narrow `200%` text, reflow the active value below identity instead of clipping identity or violating target size.                                                     | `Approved` |
| `S3V-07` | Use measured thresholds `480`, `640`, `768`, and `1056px` only for their documented S3 transitions.                                                                      | `Approved` |
| `S3V-08` | Preserve exam, omit visible My rank copy, and identify the current row with a programmatic name plus an inline-start structural marker and optional tonal support.       | `Approved` |
| `S3V-09` | The final measured `618` structural combinations pass with zero failures.                                                                                                | `Observed` |
| `S3V-10` | Keep final color, material, row geometry, avatar treatment, podium accent, and implementation outside this gate.                                                         | `Approved` |

## Approved First Review Gate — 2026-08-07

The user approved the following structural decisions after reviewing the specimen and
the revised current-row example:

1. approve a direct two-choice Basic metric switch while region remains one Select;
2. approve one equivalent dataset with compact header omission and measured wide
   alignment;
3. approve no separate podium-card block, while leaving restrained shared-rank-safe
   accents to the later appearance phase;
4. approve active-value reflow below identity at narrow `200%` text;
5. approve the measured S3 transition candidates `480`, `640`, `768`, and `1056px`;
6. preserve exam, remove the visible My rank line, and identify the current row with a
   programmatic name plus a persistent inline-start structural marker and optional
   tonal support.

This approval validates structure and responsive behavior only. It does
not approve final visual design, colors, material, exact dimensions, ranking logic
implementation, or application code.
