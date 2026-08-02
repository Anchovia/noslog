# NosLog 2.0 Global-Rankings Page Brief

## Document Control

- Status: `Approved`
- Decision status: `Core Global-rankings contract approved: page purpose,
Basic/Recital and metric hierarchy, region scope, personal position, row anatomy,
country marker, shared-rank semantics, 25-player pagination, runtime states,
responsive composition, accessibility, localization, and browser acceptance`
- Evidence status: `Repository inspection, current browser evidence, approved
information architecture, approved Tier-list rating policy, cited leaderboard and
design-system comparables, responsive and accessibility standards, and the
user-approved decision record`
- Date started: 2026-08-02
- Last decision update: 2026-08-02
- Canonical language: English
- Korean companion:
  [08-global-rankings-page-brief.ko.md](./08-global-rankings-page-brief.ko.md)
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Related rating contract:
  [06-tier-list-page-brief.md](./06-tier-list-page-brief.md)
- Scope: Public localized user rankings for NOSTALGIA Basic and Recital, with
  Official Grd and Basic-only NosLog Rating comparison
- Excluded: Per-chart ranking inside Music detail, profile-dashboard design, changes
  to the approved rating formula, administrator interfaces, final Foundation tokens,
  final high-fidelity composition, and production implementation in this session

## Decision Labels

- **Observed:** Verified in the repository, current browser evidence, or an approved
  upstream artifact.
- **Approved:** Explicitly agreed with the user and authoritative for downstream
  design.
- **Proposed:** Evidence-based direction awaiting user approval.
- **Open:** Requires further research, testing, or a user decision.
- **Rejected:** Considered and explicitly not selected.
- **Superseded:** Replaced by a later approved direction.

This brief is authoritative for the approved Global-rankings behavior, hierarchy,
responsive contract, and states. Exact typography, color, spacing, radius, shadows,
avatar treatment, control dimensions, podium styling, and content-driven transition
values remain Foundation and downstream Claude Design work. Later visual decisions
may refine expression but must not remove or reinterpret this product contract.

## Purpose

The Global-rankings page answers two related questions:

> Who currently leads this selected NOSTALGIA comparison, and where do I stand in
> the same eligible population?

It is a public comparison destination, not a replacement for Music-detail chart
ranking, a profile dashboard, a tier calculator, or a social feed. Users choose a
NOSTALGIA mode, an available comparison metric, and one region scope; scan ranked
players; locate their own position; and open a player's public profile for supporting
context.

## Primary Context and Success

- **Approved upstream:** Rankings remain an independent destination reachable through
  the Home navigation block and More panel rather than a permanent labeled Header
  link.
- **Approved:** Mobile use around arcade play is the primary context. Desktop remains
  required and uses additional width for faster row comparison rather than retaining
  a fixed `390px` shell.
- **Approved:** A successful visit lets a user understand the selected mode, metric,
  and population; compare rank and value; find their own position when eligible; and
  open another player's public profile without losing ranking context.
- **Approved:** Rankings remain publicly readable when signed out. Authentication is
  required only for the personal-position feature and other account-specific context.
- **Approved:** Current visual styling is audit evidence rather than NosLog 2.0 visual
  authority.

## Current-Product Evidence

### Observed Route and Query State

- The localized page resolves at `/[locale]/rankings` and accepts `mode`, `metric`,
  `region`, and `page` query parameters.
- `mode` normalizes to `basic | recital`; invalid or omitted values become `basic`.
- `metric` normalizes to `grade | rating`; Rating is accepted only when mode is Basic.
- `region` normalizes to `all | kr | jp | global`.
- The internal `global` value does not mean every country. It means users whose
  `country` is neither `ko-KR` nor `ja-JP`.
- The current page and API both use a fixed `PAGE_SIZE = 7`.
- Out-of-range server-page requests redirect or clamp to the final valid page.

### Observed Ranking Data and Semantics

- Official Grd ranks users with a positive mode-specific grade and returns avatar,
  username, profile country category, mode-specific exam, and Grd.
- Basic NosLog Rating derives from the current published Basic Pianist Tier list,
  eligible scores at or above the approved floor, the approved mastery curve, and the
  top `70` eligible contributions. Its visible maximum is `10,000`.
- Rating eligibility and value depend on the currently published Tier source and its
  revision. Recital has no NosLog Rating.
- Current Official Grd ranking assigns a unique ordinal by value and user ID even when
  two visible values match.
- Current Rating ranking sorts by unrounded Rating, raw total, and user ID, then shows
  a rounded integer. Equal visible integers may therefore receive different ranks.
- The current user is calculated separately and returned with every payload when the
  viewer is eligible for the selected population.

### Observed Current Interface and Browser Behavior

- The current compact page stacks three full-width control groups: Basic/Recital,
  Official Grd/NosLog Rating, and four persistent region buttons.
- Selecting Rating while Recital is active silently changes the mode to Basic rather
  than hiding an unavailable metric.
- A complete current-user card is always placed above the list when a personal row
  exists, including when the same user is already visible in the current page.
- Ranking rows currently order identity as rank, avatar, country marker, username,
  exam, and value.
- Condition and page changes use client requests and `replaceState`; the URL is
  shareable but ordinary filter/page steps do not behave as a normal navigable
  history sequence.
- At `320px`, the current Header, title, controls, and current-user area overlap or
  become difficult to scan. At wide desktop widths, the general content shell remains
  approximately `390px` wide and does not use comparison space.
- Region-empty results can show both a no-personal-rank message and a no-ranking-results
  message, creating redundant empty-state content.

## Approved Scope and Invariants

- Preserve Basic and Recital as distinct NOSTALGIA comparison modes.
- Preserve Official Grd for both modes and NosLog Rating for Basic only.
- Preserve the approved Basic Rating formula and source contract; this brief changes
  presentation and shared-rank semantics, not calculation inputs.
- Preserve the four population meanings: all eligible users, Korea, Japan, and users
  outside those two categories.
- Preserve public profile navigation from each player identity.
- Do not add score-entry, following, messaging, social reactions, seasonal leagues,
  arbitrary time windows, or per-chart ranking to this page.
- Do not expose private profile fields or infer nationality beyond the profile's
  approved country-or-region category.

## Approved Information Hierarchy

Use one semantic `main` and the following mobile-first source order:

1. Page identity and eligible-player count
2. Basic/Recital mode selection
3. Available metric selection and region scope
4. Concise Rating basis when Rating is active
5. Conditional personal-position summary
6. Ranking result heading and update/error status
7. Ranked player rows
8. Explicit pagination

Desktop may align the control groups and widen result columns, but it must preserve
this hierarchy. Do not turn the page into a dashboard with unrelated statistics,
distribution charts, or multiple competing summaries.

## Mode, Metric, and Region Contract

### Mode

- Keep **Basic** and **Recital** as the always-visible primary exclusive choice.
- Changing mode resets `page` to `1` and retains the current region when valid.
- Changing to Recital deterministically selects Official Grd because Recital has no
  NosLog Rating.
- Do not place Basic and Recital inside the region control or one mixed Select.

### Metric

- In Basic, show one subordinate exclusive choice: **Official Grd** and **NosLog
  Rating**.
- In Recital, remove the metric switch entirely and show only the resolved Official
  Grd context. Do not display a disabled Rating control and do not silently switch the
  user back to Basic.
- Changing Basic metric resets `page` to `1` and retains the selected region.
- When Rating is active, show one concise basis line identifying the current published
  Basic Pianist Tier source and top-70 basis. Do not place the complete formula in the
  persistent page hierarchy.

### Region

- Use one compact Select or equivalent accessible popup with:
    - **All**
    - **Korea**
    - **Japan**
    - **Other regions**
- User-facing labels for internal `global` must be `기타 지역`, `その他地域`, and
  `Other regions`. Do not label it `Global`, because it explicitly excludes Korea and
  Japan.
- Changing region resets `page` to `1` and recomputes rank within the chosen
  population.
- Do not keep four permanent region buttons; region is secondary scope rather than a
  peer to Basic/Recital.

## URL, History, and Restoration Contract

- Keep mode, metric, region, and page shareable in the localized URL.
- Omit the metric query only for the default Official Grd state; encode Rating
  explicitly.
- Valid selection and pagination changes create navigable history entries. Browser
  Back and Forward restore the exact prior mode, metric, region, page, result set, and
  practical scroll context.
- Pagination controls are real navigable links or equivalent links with valid `href`
  values, supporting new-tab opening, copied links, and no-JavaScript navigation.
- Invalid values normalize deterministically. Out-of-range pages resolve to the last
  valid page and expose the canonical resolved URL.
- A mode, metric, or region change resets to page `1`; returning through Browser Back
  restores the previous page rather than applying that reset again.

## Personal Position Contract

### Signed-In and Eligible

- If the current user's row is not on the active page, show one compact summary:
  `My rank {rank} / {population} · {metric value}` and one **My position** action.
- Activating My position navigates to the page containing the current user's row,
  updates the URL, and moves reading/focus context to that highlighted row.
- If the current user's row is already on the active page, remove the separate summary
  instead of showing the same full player twice.
- Highlight the current row with a non-color marker and accessible `My rank` text.
  Color may support the distinction but must not be the only signal.

### Signed-In but Ineligible

- If other ranking rows exist but the current user lacks an eligible value in the
  selected context, show only the concise personal state **My rank unavailable**.
- Do not invent a rank, percentile, projected position, or challenge state.
- If the entire selected population is empty, do not duplicate this personal state
  above the page-level empty result.

### Signed Out

- Keep the full public ranking readable.
- Replace personal position with one low-emphasis login action explaining that login
  is needed only to locate the viewer's rank.
- Successful login returns to the exact ranking URL and restores the selected context.

## Shared-Rank Semantics

- Use competition ranking for equal published values: `1, 2, 2, 4`.
- For Official Grd, the integer value published in the interface is the authoritative
  equality value. Players with the same published Grd share a rank.
- For NosLog Rating, the published rounded integer is the authoritative equality
  value. Players with the same published Rating share a rank.
- Raw values may determine a stable display order within one shared-rank group, but
  must not produce different visible ranks for the same published value.
- If a tie crosses a page boundary, each affected row retains the same shared rank.
- Podium styling must tolerate multiple players sharing first, second, or third place.
  It must not imply unique medals when the rank is shared.

## Player-Row Anatomy

Use the first approved ranking structure as the layout basis. Each row contains:

1. Published shared rank
2. One player-identity group
    - profile avatar or approved fallback;
    - username;
    - country-or-region marker immediately after the username;
    - active-mode exam on the second identity line when one exists;
3. One right-aligned active value: Official Grd or NosLog Rating

Normative compact example:

```text
2   [avatar] CHOYO [Korea marker]                 Grd 5,921
             Basic Class 2
```

- Keep avatar and username adjacent; do not insert the country marker between them.
- Do not place a country marker before the avatar, where it competes with rank.
- Do not create separate Country/Region or Exam columns in the approved 2.0 result
  anatomy. Both are supporting identity metadata.
- Korea and Japan use their approved flags. Other regions use a globe marker because
  the stored category is not one specific nation.
- Every marker has an accessible localized name. Do not depend on flag shape, emoji
  rendering, or color alone.
- Username remains the clear profile link. Do not make auxiliary metadata separate
  competing links.
- Missing exam removes the second-line value without leaving an empty badge or
  placeholder.
- Numeric values use tabular figures and stable end alignment for comparison.

## Pagination Contract

- Use a fixed page size of `25` eligible players.
- Do not add a page-size selector.
- Use explicit pagination; do not use infinite scroll or automatic appended loading.
- Provide Previous, Next, the current page, useful neighboring pages, and boundaries
  with ellipsis when needed.
- Compact layouts may reduce the quantity of visible page numbers but must retain
  Previous, Next, current-page identity, and deterministic access to boundaries when
  useful.
- Expose total eligible-player count and enough page context to understand position.
- Page changes retain mode, metric, and region and move reading context to the result
  start or the requested My-position row.
- Hide pagination when one page is sufficient; do not render inert pagination chrome.

## Loading, Empty, Error, and Unavailable States

### Updating Existing Results

- Keep the last successfully rendered rows visible while a new condition or page is
  loading.
- Mark the results `aria-busy` and show a concise visible updating status close to the
  results. Do not blank the list or replace every row with unrelated skeleton cards.
- The pending selection must be distinguishable from the last committed result.
- Cancel or ignore stale requests so an older response cannot overwrite the newest
  user choice.

### Initial Loading

- Reserve a stable result area and expose one concise loading status.
- Do not show fabricated ranks, avatars, or metrics in skeleton content.

### Empty

- When the selected population has no eligible rows, show only the concise message
  **No ranking records** in the result area.
- Preserve the controls so the user can immediately change scope.
- Do not repeat a second personal-empty message in the same state.

### Error

- If an update fails after successful data exists, retain the last committed rows,
  revert or clearly resolve the pending selection, and show one inline error with a
  Retry action.
- If the initial request fails, show a bounded result error with Retry while preserving
  all selection controls.
- Do not transform an error into an empty result.

### Rating Source Unavailable

- Missing, incomplete, or invalid published Rating source is an unavailable metric
  state, not a zero-player ranking.
- Explain concisely that NosLog Rating is temporarily unavailable and preserve a clear
  way to return to Official Grd.

## Responsive Contract

### Compact Layout

- Use `390px` as a representative review canvas, not a fixed product width or
  breakpoint.
- Reflow without document-level two-dimensional scrolling down to `320 CSS px`.
- Keep mode visible; keep metric subordinate; use one region selector.
- Render results as compact semantic ranked rows without a separate visible table
  header when the relationships remain clear from the page context and values.
- Keep rank and active value on stable edges. Let the identity group take the flexible
  middle space.
- Keep username and country marker on the first identity line and exam on the second
  line. Long valid usernames may truncate visually only when the full accessible name
  remains available.
- Do not hide essential rank, username, country category, or active value behind Hover,
  a first tap, or horizontal scrolling.
- The personal summary and pagination must reflow without overlapping the Header or
  result rows.

### Wide Layout

- Remove the fixed compact-shell constraint and use an intentional comparison width.
- Present the same data as a quiet semantic table or table-like ranked list with
  aligned Rank, Player identity, and active-value regions.
- Preserve country marker and exam inside the Player identity group; do not reintroduce
  separate Region or Exam columns merely because space exists.
- Align mode, metric, and region efficiently when space allows without changing their
  hierarchy or producing a dense toolbar of permanent buttons.
- Keep `25` players per page; desktop width changes comparison alignment, not
  pagination policy.
- Do not fill extra width with unrelated player statistics.

### Implementation Semantics Across Layouts

- Compact and wide presentations must expose one equivalent ordered dataset.
- If implementation renders separate compact and wide DOM structures, only the active
  structure may remain in the accessibility tree; do not expose duplicate rows or
  duplicate profile links.
- Prefer content- or container-driven transitions over one assumed device boundary.

## Accessibility Contract

- Use one descriptive page heading and one labeled ranking result region.
- Mode and metric are keyboard-operable exclusive selections with programmatically
  exposed selected state and visible Focus.
- Region uses a native Select or an accessible popup/listbox pattern with a visible or
  programmatic label.
- Selection changes do not move Focus unexpectedly. Announce the committed result
  count or update status without announcing every row.
- Use native ordered-list or table semantics appropriate to the active responsive
  presentation. A wide data table has programmatically associated headers.
- Pagination is a labeled `nav`; the active page exposes `aria-current="page"`.
- Disabled Previous/Next controls are not focusable dead links.
- My position moves Focus only after the requested row is available and identifies it
  as the current user's rank.
- Profile links have the full username in their accessible name even when the visible
  text truncates.
- Country markers have localized accessible names. Decorative avatar fallback letters
  do not repeat the username to assistive technology.
- Rank, personal-row identity, selected controls, Loading, and errors never rely on
  color alone.
- Pointer targets satisfy the approved Foundation target-size rule and do not overlap.
- Respect reduced-motion preferences; ranking updates and page changes do not require
  motion to communicate state.

## Localization and Content

### Stable Domain Labels

- Keep `Basic`, `Recital`, `Grd`, and `NosLog` in their approved product forms.
- Approved metric labels:
    - Korean: `공식 Grd`, `NosLog 레이팅`
    - Japanese: `公式Grd`, `NosLogレーティング`
    - English: `Official Grd`, `NosLog Rating`
- Approved region labels:
    - Korean: `전체`, `대한민국`, `일본`, `기타 지역`
    - Japanese: `すべて`, `韓国`, `日本`, `その他地域`
    - English: `All`, `Korea`, `Japan`, `Other regions`

### Row and State Content

- Localize exam syntax without changing the underlying Basic/Recital mode or number.
- Keep state copy concise:
    - ranking empty: equivalent of `랭킹 기록이 없습니다`;
    - personal unavailable: equivalent of `내 순위 없음`;
    - loading: equivalent of `랭킹을 갱신하고 있습니다`;
    - error: equivalent of `랭킹을 불러오지 못했습니다` plus Retry.
- Format values with locale-aware grouping while preserving the domain's integer Grd
  and Rating meaning.
- Test Korean, Japanese, and English control labels together; do not assume Korean is
  always the longest string.

## Runtime State Contract

| State                     | Required visible outcome                                     | Interaction outcome                       |
| ------------------------- | ------------------------------------------------------------ | ----------------------------------------- |
| Basic + Official Grd      | Mode, both Basic metrics, region, Grd rows                   | All approved controls available           |
| Basic + Rating            | Mode, both Basic metrics, region, concise basis, Rating rows | Official Grd remains directly selectable  |
| Recital                   | Mode, region, Official Grd context, Recital rows             | Rating control absent                     |
| Signed in, off-page       | Compact My-rank summary                                      | My position opens containing page and row |
| Signed in, on-page        | No duplicate summary; marked personal row                    | Profile link and pagination remain usable |
| Signed in, ineligible     | Concise My-rank unavailable state when list exists           | Controls remain usable                    |
| Signed out                | Public list and low-emphasis login action                    | Login safely returns to same URL          |
| Updating                  | Last committed rows plus visible busy state                  | Stale responses cannot win                |
| Empty                     | One concise result message                                   | Controls remain usable; pagination hidden |
| Error after data          | Last committed rows plus Retry                               | Retry repeats current requested context   |
| Initial error             | Result error plus Retry                                      | Controls remain usable                    |
| Rating source unavailable | Explicit unavailable metric state                            | Official Grd recovery remains clear       |

## Implementation Mapping

| Approved requirement                      | Current source                                                                                               | Downstream change                                                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Localized ranking route and normalization | [`app/(nevigation)/rankings/page.tsx`](<../../app/(nevigation)/rankings/page.tsx>)                           | Preserve route; update page size and canonical state handling                                                |
| Client control and request orchestration  | [`components/rankings/rankingBrowser.tsx`](../../components/rankings/rankingBrowser.tsx)                     | Make metric conditional, consolidate region, use navigable history, and implement robust pending/error state |
| API page payload                          | [`app/api/rankings/route.ts`](../../app/api/rankings/route.ts)                                               | Use 25 rows and support containing-page personal navigation without inconsistent totals                      |
| Ranking queries and Rating source         | [`lib/rankings.ts`](../../lib/rankings.ts)                                                                   | Implement published-value shared ranks across page boundaries while preserving formula inputs                |
| Table composition                         | [`components/rankings/userRankingTable.tsx`](../../components/rankings/userRankingTable.tsx)                 | Remove unconditional duplicate personal card and compose conditional summary/list/pagination                 |
| Current-user summary                      | [`components/rankings/table/currentUserRanking.tsx`](../../components/rankings/table/currentUserRanking.tsx) | Replace full duplicate card with compact off-page/ineligible/signed-out states                               |
| Player row                                | [`components/rankings/table/userRankingRow.tsx`](../../components/rankings/table/userRankingRow.tsx)         | Use rank, integrated identity group, second-line exam, and right-aligned value                               |
| Country and exam metadata                 | [`components/rankings/table/rankingUserMeta.tsx`](../../components/rankings/table/rankingUserMeta.tsx)       | Keep localized accessible marker; move marker after username and exam below identity                         |
| Pagination                                | [`components/rankings/table/rankingPagination.tsx`](../../components/rankings/table/rankingPagination.tsx)   | Use navigable links, compact responsive items, Focus restoration, and 25-row policy                          |
| Formatting and page utilities             | [`components/rankings/table/rankingTableUtils.ts`](../../components/rankings/table/rankingTableUtils.ts)     | Add shared-rank and canonical-page utilities; preserve integer display                                       |
| Existing automated evidence               | [`tests/rankings.test.ts`](../../tests/rankings.test.ts)                                                     | Add ties, boundary ties, 25-row pages, My position, history, conditional metric, and state tests             |
| Localized labels                          | [`lib/i18n/messageCatalogs`](../../lib/i18n/messageCatalogs)                                                 | Add complete Korean/Japanese/English controls, states, and accessible names                                  |

## Representative Fixtures

Validate at minimum:

1. Basic Official Grd with more than twenty pages and a signed-in user on page one;
2. Basic NosLog Rating with a signed-in user on a later page;
3. Recital showing no Rating control;
4. three or more players sharing one published Grd and a tie spanning pages;
5. two users with distinct raw Rating but the same published integer;
6. current user on the active page, off the active page, and ineligible;
7. signed-out public access and exact post-login return;
8. Korea, Japan, and Other-regions identities, including missing avatar and exam;
9. a valid `20`-character username in Korean, Japanese, Latin, and mixed scripts;
10. zero results, one result, exactly `25`, `26`, and several hundred results;
11. initial Loading, update Loading, initial error, update error, and Retry;
12. missing or invalid published Rating source;
13. localized URLs and labels for Korean, Japanese, and English;
14. `320px`, representative `390px`, intermediate widths, and wide desktop;
15. keyboard-only control, pagination, My position, and profile navigation.

## Browser Acceptance Contract

- `/ko/rankings`, `/ja/rankings`, and `/en/rankings` resolve with localized metadata
  and equivalent behavior.
- Basic shows Official Grd and NosLog Rating. Recital never exposes or activates
  Rating.
- Region changes reset page and recalculate population rank. `Other regions` excludes
  Korea and Japan and is never labeled Global.
- Browser Back/Forward restores prior mode, metric, region, page, and useful scroll
  context.
- Direct, copied, refreshed, and new-tab pagination URLs resolve the same data.
- Every successful page contains at most `25` rows and exposes correct total/page
  context.
- Equal published values display shared competition ranks, including across a page
  boundary.
- A current user is never duplicated as both a full summary and visible row.
- My position opens the containing page, marks the row without color-only meaning,
  and provides appropriate Focus context.
- Username, country marker, exam, and value follow the approved integrated row anatomy
  in compact and wide layouts.
- At `320 CSS px`, no control, personal summary, row, or pagination item causes
  document-level horizontal overflow or overlap.
- Wide layouts use additional comparison space without creating separate Region/Exam
  columns or unrelated statistics.
- Loading keeps prior rows, exposes busy state, and ignores stale responses.
- Empty, error, and Rating-unavailable states remain distinguishable and actionable.
- All controls, profile links, My position, Retry, and pagination work with keyboard
  alone and expose visible Focus.
- Country markers and current-row identity remain understandable without color or
  image rendering.
- No unexpected browser console error occurs in the tested normal and failure flows.

## Reference Matrix

| Source                                                                                                                    | Transferable principle                                                                           | NosLog application                                                      | Limitation                                                          |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [Current Rankings route](<../../app/(nevigation)/rankings/page.tsx>)                                                      | Query normalization, public access, and server page bounds already exist                         | Preserve route and domain state while replacing the compact shell       | Current `7`-row policy is superseded                                |
| [Current Ranking browser](../../components/rankings/rankingBrowser.tsx)                                                   | Client caching and request-race IDs already protect some updates                                 | Reuse the verified request foundation                                   | Current controls are overly persistent and history uses Replace     |
| [Current ranking queries](../../lib/rankings.ts)                                                                          | Defines region populations and Rating source/calculation                                         | Preserves domain meaning and exposes required tie changes               | Current ordinal ranks differ from approved shared ranks             |
| [Approved IA](./02-information-architecture.md)                                                                           | Rankings are an independent Records-and-comparison destination                                   | Keeps direct Home/More access and public route                          | Does not define row anatomy                                         |
| [Approved Tier brief](./06-tier-list-page-brief.md)                                                                       | Basic Rating is anchored to the published Basic Pianist Tier policy                              | Keeps Rating explanation and eligibility consistent                     | Tier navigation does not dictate ranking UI                         |
| [NOSTALGIA official mode guidance](https://p.eagate.573.jp/game/nostalgia/op2/howto/entrance.html)                        | Basic and Recital are distinct game modes                                                        | Keeps mode above metric                                                 | Does not define NosLog ranking metrics                              |
| [osu! global rankings](https://osu.ppy.sh/rankings/osu/global/performance)                                                | Uses country scope, explicit sort context, dense player comparison, and numbered pages           | Supports one scoped ranked dataset with profile identity and pagination | osu! exposes more metrics than NosLog needs                         |
| [ScoreSaber player rankings](https://scoresaber.com/rankings)                                                             | Keeps rank, player identity, primary PP, country context, and explicit pages together            | Supports compact rhythm-game player rows                                | Beat Saber PP semantics do not map to Grd                           |
| [ScoreSaber ranking system](https://wiki.scoresaber.com/ranking-system.html)                                              | Distinguishes global and country comparison populations                                          | Supports explicit region scope                                          | NosLog has three profile categories rather than arbitrary countries |
| [Google Play Games leaderboards](https://support.google.com/googleplay/answer/3129939)                                    | Public comparison and player-profile navigation coexist with personal standing                   | Supports public list plus contextual personal position                  | Native game UI does not prescribe web layout                        |
| [Strava leaderboard filters](https://support.strava.com/en-us/articles/15401771-segment-leaderboard-filters)              | Secondary populations are selected through compact filters                                       | Supports one region selector rather than four persistent buttons        | Sport/time filters are outside NosLog scope                         |
| [Chess.com leaderboards](https://www.chess.com/leaderboard)                                                               | Separates competition categories and presents aligned rank, identity, and value                  | Supports mode/metric hierarchy and wide comparison                      | Chess categories and eligibility differ                             |
| [Lichess FAQ: leaderboards](https://lichess.org/faq#leaderboards)                                                         | Eligibility rules materially affect who appears in a ranking                                     | Supports clear ineligible and unavailable states                        | Glicko eligibility is not NosLog policy                             |
| [jubeat best-score ranking](https://p.eagate.573.jp/game/jubeat/beyond/ranking/best_score.html?mid=19600729&seq=0)        | Official BEMANI ranking evidence keeps visible score central                                     | Supports domain-familiar rank/value scanning                            | Per-song score ranking is not a user-wide Grd ranking               |
| [W3C WCAG: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                               | Content must preserve information and function at 320 CSS px except genuine 2D content           | Requires compact rows without document horizontal scroll                | Does not dictate NosLog row styling                                 |
| [W3C HTML Technique H51](https://www.w3.org/WAI/WCAG21/Techniques/html/H51)                                               | Tabular relationships should use programmatically determinable table structure                   | Supports a semantic wide comparison table                               | Compact layout may use an ordered ranked-list presentation          |
| [WAI-ARIA APG: Table](https://www.w3.org/WAI/ARIA/apg/patterns/table/)                                                    | Static tabular data needs row/cell relationships; native table is preferred where possible       | Guides wide result semantics                                            | The pattern is not a visual design system                           |
| [Carbon Content switcher](https://carbondesignsystem.com/components/content-switcher/usage/)                              | Similar related content may use a concise exclusive switch above the controlled area             | Supports Basic/Recital and subordinate Basic metric hierarchy           | Carbon styling is not adopted                                       |
| [Carbon Data table](https://carbondesignsystem.com/components/data-table/usage/)                                          | Tables align comparable values and require clear states and hierarchy                            | Supports intentional desktop expansion                                  | NosLog mobile density requires a compact variant                    |
| [Carbon Pagination](https://carbondesignsystem.com/components/pagination/usage/)                                          | Bounded large datasets use explicit page navigation and total context                            | Supports fixed 25-row pages                                             | Carbon's page-size selector is intentionally not adopted            |
| [USWDS Button group](https://designsystem.digital.gov/components/button-group/)                                           | Related choices need grouping and must avoid excessive button density                            | Supports two-level exclusive controls and secondary region disclosure   | Action-button guidance does not establish domain hierarchy          |
| [USWDS Pagination](https://designsystem.digital.gov/components/pagination/)                                               | Bounded collections benefit from Previous/Next, boundaries, neighbors, and accessible nav labels | Supports the approved compact pager                                     | Exact item count remains responsive                                 |
| [GOV.UK Pagination](https://design-system.service.gov.uk/components/pagination/)                                          | Previous/Next links and meaningful destinations should remain real links                         | Supports robust history and no-JavaScript navigation                    | Content-page labels are not needed for numeric ranking pages        |
| [MDN Responsive design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) | Responsive layouts adapt through fluid composition and content-driven breakpoints                | Rejects a fixed `390px` desktop shell                                   | General guidance does not set ranking density                       |
| [web.dev Responsive design basics](https://web.dev/articles/responsive-web-design-basics)                                 | Start small and add breakpoints where content needs them                                         | Supports mobile-first rows and intentional desktop comparison           | Exact thresholds require Foundation specimens                       |

### Evidence Convergence

- Rhythm-game and general leaderboard products converge on one stable ranked dataset,
  compact scope selection, direct player identity, an end-aligned primary value, and
  explicit personal standing.
- Authoritative pagination systems converge on navigable Previous/Next and numbered
  pages for a bounded comparison set; they do not support infinite scrolling as the
  primary ranking navigation.
- Responsive guidance converges on a compact stacked/list presentation and a wider
  aligned comparison presentation, not a fixed phone-width desktop page.
- Accessibility guidance converges on programmatic result relationships, labeled
  controls and navigation, visible Focus, and non-color state cues.
- No external source defines Basic/Recital, Official Grd, NosLog Rating, the internal
  `global` population, exam meaning, or shared published-value policy. Those come from
  verified NosLog/NOSTALGIA domain behavior and explicit user decisions.

## Rejected and Superseded Alternatives

- **Keep four permanent region buttons — Superseded:** region becomes one compact
  secondary Select or popup.
- **Show Rating in Recital and switch to Basic when activated — Rejected:** unavailable
  metric controls must not change the primary mode unexpectedly.
- **Keep page size seven — Superseded:** the approved fixed page contains 25 players.
- **Offer a page-size selector — Rejected:** it adds control density without serving
  the primary comparison task.
- **Use infinite scroll — Rejected:** it weakens location, sharing, Back behavior, and
  personal-position navigation in a bounded ranking.
- **Always show a complete current-user card — Superseded:** use a compact off-page
  summary and the marked row when visible.
- **Show both personal-empty and result-empty messages — Rejected:** one result-empty
  message is sufficient when the population is empty.
- **Assign unique ranks to equal published values — Rejected:** use competition shared
  ranks `1, 2, 2, 4`.
- **Put the country marker before the avatar or between avatar and username —
  Rejected:** preserve avatar/name identity and place the marker after username.
- **Create separate Region and Exam columns on desktop — Rejected:** keep them as
  supporting player identity metadata in every layout.
- **Use the second state-demonstration example as final layout authority — Rejected:**
  it demonstrated states only; the first approved ranking structure governs layout.
- **Keep Replace-only history for every selection and page change — Superseded:** use
  navigable URLs and restorable history.
- **Keep the full product fixed to 390px on desktop — Rejected:** `390px` is only a
  representative mobile review canvas.

## Decision Log

| ID      | Decision                                                                             | Status     |
| ------- | ------------------------------------------------------------------------------------ | ---------- |
| RANK-01 | Global rankings remain an independent public comparison destination                  | `Approved` |
| RANK-02 | Basic/Recital are the always-visible primary exclusive choice                        | `Approved` |
| RANK-03 | Official Grd exists in both modes; NosLog Rating exists only in Basic                | `Approved` |
| RANK-04 | Recital hides the metric switch and never redirects Rating to Basic                  | `Approved` |
| RANK-05 | Region uses All/Korea/Japan/Other regions in one compact selector                    | `Approved` |
| RANK-06 | Internal `global` is labeled Other regions, not Global                               | `Approved` |
| RANK-07 | Conditions and page are shareable and restorable through navigable history           | `Approved` |
| RANK-08 | Off-page personal position uses one compact summary and My-position action           | `Approved` |
| RANK-09 | On-page personal position removes the duplicate summary and marks the row            | `Approved` |
| RANK-10 | Equal published Grd or Rating values use shared competition rank                     | `Approved` |
| RANK-11 | Player identity is avatar, username plus country marker, and second-line exam        | `Approved` |
| RANK-12 | Country and exam do not become separate desktop columns                              | `Approved` |
| RANK-13 | Korea/Japan use flags and Other regions uses a globe with accessible names           | `Approved` |
| RANK-14 | Page size is fixed at 25 with no page-size selector                                  | `Approved` |
| RANK-15 | Explicit pagination replaces infinite or appended scrolling                          | `Approved` |
| RANK-16 | Loading preserves the last successful result and exposes busy state                  | `Approved` |
| RANK-17 | Empty, error, personal-ineligible, and Rating-unavailable states stay distinct       | `Approved` |
| RANK-18 | Compact layout reflows to 320px without document horizontal scrolling                | `Approved` |
| RANK-19 | Wide layout uses comparison width while preserving integrated identity metadata      | `Approved` |
| RANK-20 | The first approved ranking structure, not the state-demo layout, governs composition | `Approved` |

## Handoff Boundary

Claude Design may decide final type scale, control and row proportions, color,
spacing, avatar fallback style, podium treatment, borders, surfaces, loading
indicator, and exact content-driven layout transitions after the Foundation is
approved. It must preserve the hierarchy, conditional controls, population meaning,
integrated player identity, shared-rank semantics, personal-position behavior,
pagination, states, and acceptance criteria above. A later Codex implementation
session must compare the Claude output with this brief and request a guide or design
revision if it reintroduces misleading controls, unique ranks for equal published
values, separate country/exam columns, duplicate current-user content, a fixed phone
shell, or another conflicting behavior.
