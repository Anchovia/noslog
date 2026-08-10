# NosLog 2.0 Bingo Page Brief

## Document Control

- Status: `Approved`
- Decision status: `Bingo list and detail contract approved: permanent catalog,
manual-only progress, public browsing, authenticated editing, reward semantics,
reset behavior, mission localization, responsive composition, runtime states,
accessibility, and browser acceptance`
- Evidence status: `Repository, schema, seed-data, and browser inspection; official
NOSTALGIA evidence; approved information architecture; cited task-list, checkbox,
grid, destructive-action, responsive, accessibility, and localization references;
and the user-approved decision record`
- Date started: 2026-08-03
- Last decision update: 2026-08-03
- Language: English
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Related contracts:
  [03-home-page-brief.md](./03-home-page-brief.md),
  [04-shared-discovery-page-brief.md](./04-shared-discovery-page-brief.md), and
  [05-music-detail-page-brief.md](./05-music-detail-page-brief.md)
- Scope: localized public Bingo catalog and Bingo detail, signed-in manual mission
  records, progress and reward meaning, recent manual record, reset, and contextual
  Music-detail links
- Excluded: administrator editor design, automatic NOSTALGIA Bingo synchronization,
  attempt or retry history, final Foundation tokens, final high-fidelity composition,
  and production implementation in this session

## Decision Labels

- **Observed:** Verified in the repository, current browser evidence, or an approved
  upstream artifact.
- **Approved:** Explicitly agreed with the user and authoritative for downstream
  design.
- **Proposed:** Evidence-based direction awaiting user approval.
- **Open:** Requires further research, testing, or a user decision.
- **Rejected:** Considered and explicitly not selected.
- **Superseded:** Replaced by a later approved direction.

This brief is authoritative for Bingo purpose, content hierarchy, state meaning,
interaction, localization, responsive behavior, and acceptance. Exact typography,
color, spacing, radius, elevation, cover treatment, control dimensions, grid gaps,
and content-driven transition values remain Foundation and downstream Claude Design
work. Later visual work may refine expression but must not reinterpret this contract.

## Purpose

Bingo is a public reference and a signed-in manual checklist for NOSTALGIA Bingo
missions. It answers three ordered questions:

> Which board am I looking for, what must I complete, and how does my manually
> recorded progress relate to the music-unlock and NOS rewards?

It is not a live NOSTALGIA state mirror. NOSTALGIA does not provide NosLog with the
active-board or mission-completion state needed for automatic tracking. NosLog must
therefore help users read the same 5×5 mission structure they see in the game and
record their own checks without claiming that those checks are official game state.

## Primary Context and Success

- **Approved:** Mobile use beside an arcade cabinet is primary. A user should be able
  to locate a board, match a coordinate, read the mission, and update one check with
  minimal context switching.
- **Approved:** A signed-out visit succeeds when the user can browse all boards,
  understand reward structure, open any board, inspect all twenty-five missions, and
  follow contextual Music links without being shown fabricated personal progress.
- **Approved:** A signed-in visit succeeds when the user can resume the most recently
  manually edited board, record mission completion, understand music-unlock versus
  full-board progress, and recover from a save failure.
- **Approved:** Desktop remains required and uses its additional width for board and
  mission comparison. It must not preserve the current approximately `390px` shell in
  the center of a wide viewport.
- **Approved:** Current styling and geometry are evidence only, not NosLog 2.0 visual
  authority.

## Current-Product and Domain Evidence

### Official Domain Evidence

- **Observed:** Official NOSTALGIA material presents Bingo as a 5×5 mission board with
  line and completion rewards and provides reset/retry behavior in the game.
- **Observed:** NosLog receives no official active-board or per-cell progress feed.
  Existing user progress is therefore a NosLog manual record, not proof that the
  in-game board was active when a score was achieved.
- **Approved interpretation:** Official reset existence does not require NosLog to
  model attempts. NosLog needs only a way to clear its current manual checklist.

### Repository and Data Evidence

- **Observed:** Public localized routes exist at `/[locale]/bingo` and
  `/[locale]/bingo/[id]`; reading is public and mutation requires authentication.
- **Observed:** [`prisma/data/op3-bingos.json`](../../prisma/data/op3-bingos.json)
  contains 44 boards and 1,100 cells, exactly 25 cells per board.
- **Observed:** The data uses `FORTE`, `Op.2`, and `Op.3` as release provenance. It has
  no board end dates. `sourceVersion` is metadata, not a user-selectable Bingo mode.
- **Observed:** Required music-unlock lines range from 2 to 7. Data separately models
  per-line NOS, full-board completion NOS, and total available NOS.
- **Observed:** [`Bingo`](../../prisma/schema.prisma),
  [`BingoCell`](../../prisma/schema.prisma), and
  [`BingoCellProgress`](../../prisma/schema.prisma) provide board metadata, one mission
  string per cell, and user-scoped manual completion timestamps.
- **Observed gap:** The current mission schema has one `title` string and the current
  imported mission text is Korean. It cannot yet represent verified official Japanese
  text plus independently reviewed Korean and English translations.
- **Observed:** Current progress calculation recognizes the twelve standard 5×5 Bingo
  lines and can identify a line with one remaining cell as a chance state.
- **Observed:** Current mutation uses optimistic client state, server persistence,
  rollback, and localized error feedback.

### Current Interface and Browser Evidence

- **Observed:** The current list exposes all, in-progress, chance, and completed
  controls; progress ordering; compact board previews; progress values; and reward
  information.
- **Observed:** The current detail exposes cover and reward context, a 5×5 board,
  mission filters, all 25 missions, and manual controls.
- **Observed:** Current wide layouts retain a narrow mobile-like column and leave large
  unused margins. Compact `390px` and `320px` checks did not cause document-level
  horizontal overflow, but this does not validate long Korean/Japanese/English content
  or the final 2.0 hierarchy.
- **Observed issue:** Current “continue” and availability wording can imply a live or
  time-limited in-game state that NosLog cannot verify.

## Approved Scope and Invariants

1. All 44 boards are permanently browsable. Do not add availability windows, ended
   states, an archive, or a version selector.
2. `sourceVersion` may appear only as release metadata such as `FORTE`, `Op.2`, or
   `Op.3`.
3. Progress is always a user-entered NosLog checklist. Never imply automatic sync,
   official activation, score-based completion, or verified in-game completion.
4. The 5×5 board remains the primary mission-finding model on detail.
5. Song-unlock progress and full-board reward progress are distinct meanings.
6. Reading is public. Login is required only to add, remove, or reset personal checks.
7. A “recent” board means the board whose NosLog manual record was edited most
   recently. It does not mean active, selected, or currently running in NOSTALGIA.
8. No attempt count, retry cycle, completion-history ledger, or lifetime earned-NOS
   total is introduced.

## Approved Information Hierarchy

### Bingo List

1. page identity and concise manual-record explanation;
2. catalog summary and, only for a signed-in user with progress, recent manual record;
3. compact filter and sort controls;
4. permanent Bingo catalog cards;
5. explicit next batch control when more items exist.

### Bingo Detail

1. return to Bingo list and board identity;
2. reward and progress semantics;
3. 5×5 board;
4. mission list and compact mission filter;
5. contextual login or reset action when applicable.

The board and mission list are one synchronized task surface. A detached primary CTA
must not compete with the act of finding and checking a mission.

## Progress and Reward Semantics

### Progress States

| State                 | Rule                                                         | Required meaning                                                   |
| --------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------ |
| Not started           | No saved completed cells                                     | No personal progress has been manually recorded                    |
| In progress           | At least one cell saved; fewer than `requiredLines` complete | Manual record exists; music-unlock threshold has not been reached  |
| Music unlock complete | Completed lines are at least `requiredLines`; cells remain   | Required song-unlock line threshold is satisfied in the checklist  |
| Full board complete   | All 25 cells are saved complete                              | Checklist is complete and full-board reward condition is satisfied |

- A board can exceed the music-unlock threshold without being full-board complete.
- “Completed” without qualification is ambiguous and must not merge these two states.
- Chance is a helpful board condition, not a top-level lifecycle state. It means one
  unchecked cell remains in at least one valid line and may be used as a secondary
  filter or cue for signed-in progress.
- Signed-out users have no personal state. Do not assign them `Not started` or show
  `0/25`, because that would look like a measured personal record.

### Reward Model

Display reward meaning as distinct values rather than one unexplained total:

- `requiredLines`: number of completed lines required for the music unlock;
- `lineRewardNos`: NOS earned for each completed line;
- `completionRewardNos`: additional NOS for all 25 cells;
- `rewardNos`: total NOS available from all line rewards plus full-board bonus.

The interface must not label `rewardNos` as already earned. Personal progress may
explain reached conditions, but NosLog cannot verify in-game receipt of the reward.

## Bingo List Contract

### Catalog Summary

- State that there are 44 permanently available boards and that progress is manually
  recorded in NosLog.
- Do not show a date range, countdown, ended badge, or release-version switcher.
- Release metadata may help identify a board but must remain subordinate to its title
  and cover.

### Recent Manual Record

- Show only to a signed-in user when at least one saved cell record exists.
- Select the board with the most recently updated manual cell record.
- Label it with language equivalent to `Recently recorded Bingo`; do not use `Active`,
  `Activated`, `Continue in game`, or another phrase that implies NOSTALGIA state.
- Provide a direct return to that board. Its layout must remain visually connected to
  the list rather than becoming a detached dashboard.
- When the latest board is reset and no saved cells remain, recompute from the next
  most recent saved board or omit the module.

### Filter and Sort

- Keep controls compact and contextually grouped rather than exposing a permanent row
  of many buttons.
- Personal status options for signed-in users: `All`, `In progress`, `Music unlock
complete`, and `Full board complete`.
- `Chance` may be available as a secondary progress filter, but it must not replace
  the approved state model.
- Signed-out users do not see personal status filters.
- Sort options: `Recently recorded`, `Progress high`, and `Release order` where they
  are meaningful. Personal sorts are omitted or disabled with a clear reason when no
  authenticated progress exists; do not fabricate zero values.
- The chosen state must be restorable and compatible with browser Back.

### Catalog Cards

Each card preserves the following information contract:

- board cover or defined missing-cover fallback;
- original board and Music titles;
- subordinate `sourceVersion` release metadata;
- compact 5×5 miniature that communicates board identity and, when signed in,
  personal checked cells;
- signed-in progress state and concise progress value;
- concise music-unlock or reward context when needed for comparison.

Signed-out cards omit checked cells, progress fractions, personal state badges,
chance cues, and other personal completion indicators. They remain fully interactive
destinations, not disabled previews.

### Batching

- Load the first 12 boards, then provide an explicit next-12 action while more remain.
- Do not use automatic infinite scroll.
- Preserve filter, sort, loaded count, and useful list position across detail round
  trips and browser Back.
- A no-match result must be concise and distinguish a filter result from a missing
  catalog.

## Bingo Detail Contract

### Identity and Reward Context

- Provide a clear return to the list and identify title, cover, and release metadata.
- Explain required music-unlock lines separately from per-line NOS, full-board bonus,
  and total available NOS.
- Signed-in personal progress may be summarized here. Signed-out users receive reward
  structure without a fake personal progress block.

### 5×5 Board

- Render the complete 5×5 coordinate model without horizontal page scrolling at the
  required compact widths.
- Each cell is selectable for navigating to or emphasizing its mission details.
- Selection and saved completion are separate states. Selection is available to every
  visitor; completion is editable only when signed in.
- Checked, selected, chance-related, and keyboard-focus states must not rely on color
  alone and must remain visually distinguishable from one another.
- Board coordinates and mission rows use the same stable numbering/coordinate system.
- The board may become sticky beside the mission list on wide layouts only when it
  does not hide content or break keyboard and zoom behavior.

### Mission List and Filter

- Show all 25 missions and preserve their relationship to board coordinates.
- Selecting a board cell moves focus or view to the corresponding mission without
  unexpectedly changing its completion state.
- Selecting or focusing a mission synchronizes the board selection.
- Use one compact mission-filter control rather than a permanent row of all options.
- Signed-in options: `All`, `Incomplete`, `Complete`, and `Chance`.
- Signed-out users need only `All` unless another non-personal browsing filter is later
  separately approved.
- Each row may include coordinate, localized mission instruction, required context,
  contextual Music-detail link when a verified relation exists, and a signed-in
  manual checkbox.
- Do not invent Music links by parsing text. Use verified structured relationships.

## Manual Completion and Save Contract

- A signed-in checkbox adds or removes one NosLog `BingoCellProgress` record.
- The optimistic state may update immediately, but its save status must be perceivable
  and a failure must restore the last confirmed state.
- Repeated activation while the same mutation is pending must not create duplicate or
  out-of-order records.
- A later response must not overwrite a more recent local intent. Implementation must
  serialize, version, or otherwise guard cell mutations.
- Updating one cell recomputes completed cells, completed lines, unlock status,
  full-board status, chance cues, recent-record timestamp, and relevant list summary.
- Do not infer completion from play records, score, rank, or synchronized song data.
- The checked state means `manually recorded complete in NosLog`, not `officially
verified complete in NOSTALGIA`.

## Reset Contract

- Provide a secondary/destructive `Reset Bingo record` action only for a signed-in
  user when that board has saved progress.
- It is available whether the checklist is in progress, music-unlock complete, or
  full-board complete.
- Require explicit confirmation naming the board and explaining that all 25 saved
  checks for this board will be removed.
- Confirmation and cancellation must have unambiguous labels; initial Focus, Focus
  containment, Escape behavior, and return Focus must follow the adopted dialog
  component contract.
- On success, delete the user's progress rows for that board, recompute summaries, and
  remove stale recent-record references.
- On failure, preserve the confirmed checklist and show a recoverable error.
- Do not create retry cycles, attempt history, completion dates, archived boards, or
  lifetime earned-NOS records as a side effect.

## Authentication and Permission Contract

### Signed Out

- Can browse all 44 boards and open every board detail.
- Can inspect cover/title, release metadata, reward structure, the 5×5 board, and all
  25 localized missions.
- Can select cells to read corresponding mission details and follow public Music
  links.
- Does not see completion checkboxes, `0/25`, personal status filters, personal
  checked mini-board cells, chance progress, or a recent-record card.
- Receives one concise login prompt near the mission editing context. Do not repeat a
  disabled login control on every cell or mission.
- After login, return to the same locale and exact Bingo detail when possible.

### Signed In

- Receives the same public reference content plus personal manual progress controls,
  filters, recent record, save status, and reset when applicable.
- Authentication changes editing capability, not the board catalog or permanent
  availability.

### Permission and Missing Resource

- Direct mutation without authentication returns an authorization outcome and never
  changes data.
- An invalid board or mission is a not-found/data-integrity state, not an “ended Bingo”
  state.
- A published-board read failure must not be presented as lack of user permission.

## URL, History, and Restoration Contract

- Localized list and detail URLs remain stable and shareable.
- List filter, sort, loaded batch, and selected item context should use URL state or a
  history-restorable equivalent when useful.
- A list → detail → Back round trip restores the user's catalog context.
- Mission selection may use a stable fragment or query only if it improves sharing or
  restoration without turning every transient focus movement into history noise.
- Login return state preserves locale, board identifier, and intended editing context.
- Reset confirmation is transient UI state and must not create a history entry.

## Loading, Empty, Error, Disabled, and Destructive States

| State                     | Required behavior                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------- |
| Initial catalog loading   | Preserve page identity and provide a stable catalog skeleton without fake values       |
| Next batch loading        | Keep loaded boards visible; bind progress only to the explicit batch action            |
| Catalog empty             | Treat as a publishing/data failure because the approved catalog has 44 boards          |
| Filter no result          | Concisely state that no Bingo matches the current filter and preserve controls         |
| Detail loading            | Preserve board identity/return context when known and avoid cumulative layout shifts   |
| Invalid board or mission  | Provide localized not-found recovery to the permanent catalog                          |
| Signed-out editing        | Omit controls and provide one contextual login prompt                                  |
| Cell save pending         | Preserve usable reading; prevent conflicting repeated mutation and expose saving state |
| Cell save failure         | Revert to confirmed state, identify the failed action concisely, and allow Retry       |
| Partial mission relation  | Keep the mission readable; omit only the unavailable contextual Music link             |
| Missing localized mission | Show verified official Japanese text with `lang="ja"`; do not hide the mission         |
| Reset confirmation        | Name scope and consequence; do not confirm by ambiguous icon alone                     |
| Reset pending             | Prevent duplicate reset while preserving the dialog's status                           |
| Reset failure             | Keep saved progress intact and allow Retry or cancel                                   |
| Missing cover             | Use the approved media fallback without changing card or board meaning                 |

There is no “Bingo unavailable” or “Bingo ended” runtime state in the approved
permanent catalog contract.

## Responsive Contract

### Compact Layout

- Use `390px` as the representative review canvas, not a fixed width or breakpoint.
- Verify one-dimensional reflow through `320 CSS px` and intermediate widths with
  long Korean, Japanese, and English content and 200% text zoom.
- The list may use two cards per row while real content remains legible. It must
  collapse to one column when cover, title, mini-board, or state content no longer
  fits; this transition is content-driven and may occur around `350px` or another
  tested value.
- Detail stacks board before mission list so the in-game coordinate model is available
  before mission scanning.
- The board itself keeps a square 5×5 relationship, but the document must not require
  two-dimensional scrolling.
- Reward information and controls wrap or recompose; they do not compress into
  unreadable single rows.

### Wide Layout

- Use available width for a multi-column catalog and for board/mission comparison.
- Detail may place a board/context column beside the mission-list column. Sticky board
  behavior is allowed only after keyboard, zoom, and viewport-height validation.
- Do not merely enlarge the compact layout or center it inside a phone-width shell.
- Do not add more permanent filters, metadata, or repeated actions just because width
  is available.

### Layout Semantics

- Catalog and mission reading order remains equivalent across layouts.
- CSS visual order must not contradict DOM, keyboard, or screen-reader order.
- A miniature board may simplify labels visually, but accessible names must retain
  board and progress meaning.

## Accessibility Contract

- Use a semantic list for the catalog and mission collection unless a true table
  relationship is introduced.
- Treat the 5×5 board as one composite coordinate control. Use native buttons or an
  appropriate grid implementation with documented keyboard behavior; do not create 25
  unlabelled clickable `div` elements.
- Every board cell exposes coordinate, localized mission summary, selected state, and,
  for signed-in users, manually recorded completion state.
- If roving Focus is used, Arrow keys move within the board, Home/End behavior is
  documented, and Tab exits the composite. If each cell is a normal button, ordinary
  Tab behavior must remain manageable and tested. Choose one pattern during component
  design and document it; do not mix both.
- Manual completion uses a native checkbox or equivalent with programmatic label and
  state. Board selection must not toggle it implicitly.
- Progress, unlock, chance, completion, save, and error meanings cannot rely on color,
  cover art, or position alone.
- Announce successful and failed manual changes without moving Focus unexpectedly.
- Reset uses a correctly named destructive confirmation dialog and returns Focus to
  its trigger.
- All interactive targets satisfy the approved target-size Foundation rule and remain
  operable by keyboard and touch.
- At 200% text zoom and `320 CSS px`, long mission text, reward labels, filters, and
  actions reflow without clipping or overlapping the board.
- Respect reduced motion; selection and save feedback do not require movement to be
  understood.

## Localization and Content Contract

### Mission Source and Translation

- Verified official Japanese mission text is canonical domain content.
- Korean and English are independently reviewed translations, not transformations that
  replace the Japanese source.
- Display one mission language matching the page locale. Do not show original and
  translation together on every row by default.
- Mission instructions are always localized independently of the Music Detail-only
  translated-title disclosure.
- When approved Korean or English is missing, fall back to verified official Japanese,
  mark that element `lang="ja"`, and keep the surrounding interface in the selected
  locale.
- Do not display a verbose public `translation pending` message for each fallback.
  Missing-review state belongs in administrator workflows.
- AI output may seed a translation draft but cannot become public until reviewed.
- Do not reverse-translate the current Korean seed and label it official Japanese.

### Stable Domain Tokens

- Preserve domain tokens whose translation would damage implementation or player
  recognition, including `◆Just`, `Near`, `Miss`, `Normal`, `Hard`, `Expert`, `Real`,
  and `nos`.
- Translate surrounding grammar and instructions naturally for Korean, Japanese, and
  English rather than concatenating token-by-token fragments.
- Board coordinates remain stable across languages.

### Board and Music Titles

- Show canonical original board and Music titles on Bingo surfaces. Approved Music
  translations/readings remain searchable and are disclosed only on Music Detail.
- Mission-instruction localization is independent from the Music Detail translation
  disclosure.
- Long classical titles, long artist/context names, mixed scripts, numerals, and music
  symbols must wrap without fixed-height clipping.

## Runtime State Contract

| State group       | Values                                                                             | Scope                    |
| ----------------- | ---------------------------------------------------------------------------------- | ------------------------ |
| Authentication    | signed out, signed in                                                              | Page family              |
| Catalog request   | initial loading, ready, next-batch loading, filter empty, error                    | List                     |
| List query        | personal status filter where authorized, sort, loaded count                        | List and URL/history     |
| Recent record     | absent, available                                                                  | Signed-in list           |
| Board request     | loading, ready, not found, error                                                   | Detail                   |
| Mission selection | none/default, coordinate selected                                                  | Detail interaction       |
| Manual progress   | no record, in progress, music unlock complete, full board complete                 | Signed-in user and board |
| Cell mutation     | confirmed unchecked, save-to-checked, confirmed checked, save-to-unchecked, failed | Signed-in user and cell  |
| Reset             | unavailable, available, confirming, pending, failed, succeeded                     | Signed-in user and board |
| Localization      | approved locale text, verified Japanese fallback                                   | Mission element          |
| Music relation    | verified link, no verified link                                                    | Mission row              |

Do not collapse request, authentication, selection, and manual-progress states into
one overloaded card badge or a single `loading` boolean.

## Implementation Mapping

| Concern                  | Current source                                                                                                                                                                                                  | Downstream requirement                                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| List route and query     | [`app/(nevigation)/bingo/page.tsx`](<../../app/(nevigation)/bingo/page.tsx>) and [`app/(nevigation)/bingo/data.ts`](<../../app/(nevigation)/bingo/data.ts>)                                                     | Return all 44 published boards permanently; add restorable batch/filter/sort contract without availability filtering     |
| List composition         | [`components/bingo/bingoList.tsx`](../../components/bingo/bingoList.tsx)                                                                                                                                        | Rename live-state implications, separate signed-out/public data, and use content-responsive wide composition             |
| Recent manual record     | [`components/bingo/list/continueBingoCard.tsx`](../../components/bingo/list/continueBingoCard.tsx) and [`components/bingo/list/bingoListUtils.ts`](../../components/bingo/list/bingoListUtils.ts)               | Replace `continue/active` semantics with most recently manually edited board and omit when no saved progress             |
| Filters                  | [`components/bingo/list/bingoListFilters.tsx`](../../components/bingo/list/bingoListFilters.tsx)                                                                                                                | Align to approved states; hide personal filters signed out; preserve restorable state                                    |
| List card and miniature  | [`components/bingo/list/bingoListCard.tsx`](../../components/bingo/list/bingoListCard.tsx) and [`components/bingo/list/bingoMiniBoard.tsx`](../../components/bingo/list/bingoMiniBoard.tsx)                     | Preserve public identity; show personal cells/state only when authenticated                                              |
| Detail route             | [`app/(nevigation)/bingo/[id]/page.tsx`](<../../app/(nevigation)/bingo/[id]/page.tsx>)                                                                                                                          | Separate reward meanings, signed-out public reference, and authenticated edit context                                    |
| Board                    | [`components/bingo/plate/bingoBoard.tsx`](../../components/bingo/plate/bingoBoard.tsx)                                                                                                                          | Separate selection from completion and implement an approved accessible composite pattern                                |
| Mission list and filters | [`components/bingo/plate/bingoMissionList.tsx`](../../components/bingo/plate/bingoMissionList.tsx) and [`components/bingo/plate/bingoMissionFilters.tsx`](../../components/bingo/plate/bingoMissionFilters.tsx) | Synchronize coordinates; compact filtering; omit repeated signed-out edit controls                                       |
| Manual mutation          | [`app/(nevigation)/bingo/[id]/actions.ts`](<../../app/(nevigation)/bingo/[id]/actions.ts>) and [`components/bingo/plate/useBingoPlate.ts`](../../components/bingo/plate/useBingoPlate.ts)                       | Preserve authorization and rollback; add stale-response/duplicate-mutation guard and explicit save feedback              |
| Progress calculation     | [`lib/bingo.ts`](../../lib/bingo.ts)                                                                                                                                                                            | Preserve twelve-line calculation and derive distinct unlock/full/chance semantics                                        |
| Reset                    | New authenticated board-scoped action and dialog                                                                                                                                                                | Delete only this user's 25 board progress rows, confirm explicitly, recompute recent record, and keep no attempt history |
| Data model               | [`prisma/schema.prisma`](../../prisma/schema.prisma)                                                                                                                                                            | Add canonical Japanese plus reviewed KO/EN mission fields/statuses or an equivalent localized-content relation           |
| Seed/import              | [`prisma/data/op3-bingos.json`](../../prisma/data/op3-bingos.json)                                                                                                                                              | Source verified official Japanese; retain reviewed Korean; add reviewed English without false provenance                 |
| Localized labels         | [`lib/i18n/messageCatalogs`](../../lib/i18n/messageCatalogs)                                                                                                                                                    | Add complete list/detail/reward/save/reset/login/fallback strings in KO/JA/EN                                            |

## Representative Fixtures

Validate at minimum:

1. signed-out and signed-in users viewing the same complete 44-board catalog;
2. no saved progress, one checked cell, multiple lines, exact unlock threshold,
   threshold exceeded, and all 25 cells complete;
3. one-line chance, multiple simultaneous chances, and no chance;
4. the most recently edited board changing after a cell save and after reset;
5. a board with `requiredLines` 2 and one with 7;
6. every observed reward combination, including distinct per-line, full-board, and
   total values;
7. `FORTE`, `Op.2`, and `Op.3` metadata without version filtering;
8. a missing cover and the longest real classical title;
9. short and long Japanese official missions, reviewed Korean and English, and a
   missing KO/EN translation using Japanese fallback;
10. mission with and without a verified Music relation;
11. cell save success, slow save, duplicate activation, out-of-order response,
    authorization expiry, and save failure rollback;
12. reset cancel, success, failure, and recent-record recomputation;
13. all list filters/sorts, no-match state, first 12, next 12, and Back restoration;
14. exact board-cell and mission-row selection synchronization by mouse, touch,
    keyboard, and assistive technology;
15. `320px`, representative `390px`, intermediate widths, wide desktop, short viewport,
    200% text zoom, reduced motion, and screen-reader structure.

## Browser Acceptance Contract

- `/ko/bingo`, `/ja/bingo`, `/en/bingo`, and their detail routes resolve with
  equivalent behavior and localized metadata.
- Every one of the 44 permanent boards is reachable without login and no unavailable,
  ended, date-range, archive, or version-selector UI appears.
- Signed-out visitors can inspect all 25 missions and select board cells without seeing
  fake `0/25`, personal checked cells, completion controls, personal filters, chance
  progress, or recent-record content.
- The single signed-out login prompt returns to the same locale and board after a
  successful login.
- Signed-in changes persist, update all derived progress/reward cues, guard against
  duplicate/out-of-order writes, and roll back accurately on failure.
- Music unlock, full-board completion, per-line NOS, full-board NOS, and total
  available NOS remain semantically distinct.
- Reset clearly names its destructive scope, removes only the current user's board
  records, preserves data on failure, and creates no attempt history.
- Board and mission selection remain synchronized without selection accidentally
  toggling completion.
- Mission instructions use the page locale when reviewed; missing KO/EN text falls
  back to verified Japanese with correct language metadata.
- Music-title disclosure never suppresses localized mission instructions.
- First 12 and explicit next-12 loading preserve filters, sort, loaded count, position,
  and useful Back behavior.
- At `320 CSS px`, no card, board, mission, reward group, filter, dialog, or action
  causes document-level horizontal overflow, clipping, or overlap.
- Wide layouts use additional catalog and board/mission comparison space without a
  fixed phone-width shell or gratuitous extra controls.
- All cells, checkboxes, selectors, links, batch actions, Retry, and Reset work with
  keyboard alone, expose visible Focus, and retain understandable names and states.
- Loading, filter-empty, not-found, authorization, save-error, reset-error, missing
  relation, missing translation, and missing-cover states are distinct and recoverable
  where recovery exists.
- No unexpected browser console error, hydration issue, stale optimistic result, or
  cross-user progress leak occurs in tested normal and failure flows.

## Reference Matrix

| Source                                                                                                                                   | Transferable principle                                                                               | NosLog application                                                          | Limitation                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [Current Bingo routes and data](<../../app/(nevigation)/bingo/data.ts>)                                                                  | Establishes public reads, current availability filtering, progress retrieval, and recent update data | Separates observed implementation from the approved permanent catalog       | Current availability and naming are not 2.0 authority                                   |
| [Current Bingo schema](../../prisma/schema.prisma)                                                                                       | Confirms board rewards, source metadata, cells, and user-scoped manual progress                      | Grounds reward and reset requirements                                       | Does not yet support canonical JA plus reviewed KO/EN missions                          |
| [Current Bingo seed](../../prisma/data/op3-bingos.json)                                                                                  | Provides all 44 real boards, 25-cell structures, long titles, versions, and reward ranges            | Supplies representative production fixtures                                 | Current Korean mission text is not verified Japanese provenance                         |
| [Approved IA](./02-information-architecture.md)                                                                                          | Keeps Bingo an independent unlock-and-reward destination linked to Music                             | Preserves access and contextual Music links                                 | Does not define list/detail anatomy                                                     |
| [NOSTALGIA official news](https://p.eagate.573.jp/game/nostalgia/op3/news/entrance.html)                                                 | Provides official Bingo availability, reward, reset, and event-domain evidence                       | Grounds permanent-board and reset interpretation                            | Official game UI does not define NosLog manual-record UX                                |
| [NOSTALGIA official How to](https://p.eagate.573.jp/game/nostalgia/op3/howto/entrance.html)                                              | Establishes official game vocabulary and player context                                              | Prevents invented activation or synchronization meaning                     | Does not provide NosLog with user progress data                                         |
| [GOV.UK Task list](https://design-system.service.gov.uk/components/task-list/)                                                           | Tasks need clear names, status meaning, and a scan-friendly relationship                             | Supports coordinate-linked missions with explicit manual status             | A Bingo board is spatial and cannot be reduced to a generic linear task list            |
| [GOV.UK Complete multiple tasks](https://design-system.service.gov.uk/patterns/complete-multiple-tasks/)                                 | Multi-step work benefits from visible progress and resumable task context                            | Supports recent manual record and concise progress states                   | Government completion flows do not define NOSTALGIA rewards                             |
| [WAI-ARIA APG Checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)                                                              | Binary completion needs programmatic checked state and labels                                        | Governs manual mission completion                                           | Does not define optimistic persistence or board selection                               |
| [WAI-ARIA APG Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)                                                                      | Composite grids require explicit Focus and keyboard behavior                                         | Informs accessible 5×5 navigation if grid semantics are selected            | APG grid increases implementation complexity and is not mandatory if native buttons fit |
| [WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                                   | Ordinary content must reflow at 320 CSS px without two-dimensional page scrolling                    | Requires compact board, mission, reward, and card reflow                    | Does not prescribe card count or layout tokens                                          |
| [WCAG Language of Parts](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts)                                                  | A fallback passage in another language needs programmatic language identification                    | Requires `lang="ja"` for Japanese mission fallback                          | Does not determine translation governance                                               |
| [Carbon Modal](https://v10.carbondesignsystem.com/components/modal/usage/)                                                               | Destructive modals need clear consequence, hierarchy, Focus handling, and constrained actions        | Informs board-record reset confirmation                                     | Carbon visual styling is not NosLog authority                                           |
| [Material Dialogs](https://m1.material.io/components/dialogs.html)                                                                       | Dialogs interrupt flow and should be reserved for necessary decisions                                | Supports confirmation only for reset, not ordinary mission checking         | Legacy Material measurements are not adopted                                            |
| [eBay Confirmation dialog](https://playbook.ebay.com/design-system/components/confirmation-dialog)                                       | Confirmations should name the action and provide safe cancellation                                   | Supports explicit reset scope and cancel path                               | Marketplace task context differs from Bingo                                             |
| [W3C Language negotiation](https://www.w3.org/International/questions/qa-when-lang-neg)                                                  | Locale selection and content-language fallback are distinct concerns                                 | Keeps page locale while one missing mission falls back to Japanese          | Does not define editorial approval status                                               |
| [Unicode CLDR translation guide](https://cldr.unicode.org/translation/getting-started/guide)                                             | Translation requires context, stable terminology, review, and locale-aware grammar                   | Supports reviewed KO/EN mission content and preserved domain tokens         | CLDR itself does not supply NOSTALGIA translations                                      |
| [Android localization](https://developer.android.com/guide/topics/resources/localization)                                                | Default/fallback resources must keep interfaces functional when locale-specific text is missing      | Supports deterministic fallback instead of missing mission rows             | Android resource mechanics are not copied directly into Next.js                         |
| [Microsoft resource fallback](https://learn.microsoft.com/en-us/dotnet/core/extensions/retrieve-resources)                               | Resource lookup uses explicit culture fallback rather than ad hoc mixed content                      | Supports a documented mission fallback chain                                | .NET resource structure is not the implementation target                                |
| [Apple package localization](https://developer.apple.com/documentation/xcode/localizing-package-resources)                               | Localized resources should preserve a base source and language-specific variants                     | Supports canonical-source plus reviewed variants                            | Apple package APIs are not used                                                         |
| [Next.js Internationalization](https://nextjs.org/docs/app/guides/internationalization)                                                  | Locale routes and server rendering need explicit dictionaries and routing                            | Aligns mission and interface locale with existing `/ko`, `/ja`, `/en` paths | Does not provide content-review workflow                                                |
| [FormatJS fallback](https://formatjs.github.io/docs/intl/)                                                                               | Runtime formatting and fallback should be deterministic and observable                               | Supports non-breaking fallback and complete message catalogs                | Library adoption is not decided by this brief                                           |
| [i18next fallback](https://www.i18next.com/principles/fallback)                                                                          | Fallback languages can be ordered without mixing every translation on screen                         | Supports one visible mission language with Japanese fallback                | NosLog may not use i18next                                                              |
| [Sanity localization](https://www.sanity.io/docs/studio/localization)                                                                    | Field-level localization preserves content identity and editorial status                             | Supports per-mission canonical and translated fields                        | Sanity is not the NosLog CMS                                                            |
| [Shopify Markets fallback](https://shopify.dev/docs/apps/build/markets/index)                                                            | Market/locale fallback must preserve a usable public experience                                      | Supports public mission fallback while review state stays operational       | Commerce markets differ from game content                                               |
| [Steamworks Languages](https://partner.steamgames.com/documentation/languages)                                                           | Game-facing localization needs supported-language planning and stable terminology                    | Supports KO/JA/EN game-domain glossary and review                           | Steam language support is broader than NosLog scope                                     |
| [GOV.UK Translations](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/consider-translations/) | Translated content needs ownership, maintenance, and source coordination                             | Supports review status and canonical Japanese provenance                    | Government publishing workflow is not copied wholesale                                  |
| [Home Office limited-English guidance](https://design.homeoffice.gov.uk/design-and-content/content/designing-for-limited-english)        | Instructions should be concise, literal, and avoid unnecessary complexity                            | Guides mission and login/reset support copy                                 | English accessibility guidance does not define Japanese/Korean game vocabulary          |
| [IBM translation documentation](https://www.ibm.com/docs/en/about?topic=translations-documentation)                                      | Fallback and translated documentation require visible, consistent language management                | Supports deterministic fallback and avoids false translation claims         | Documentation pages differ from per-cell missions                                       |

### Evidence Convergence

- Official NOSTALGIA evidence and repository data converge on a 5×5, reward-bearing
  domain object, while the lack of an official progress feed requires a manual-only
  NosLog contract.
- Task-list, checkbox, and grid references converge on explicit status, labeled
  controls, synchronized spatial/list context, and keyboard behavior. They do not
  justify replacing the 5×5 board with a generic linear checklist.
- Destructive-action references converge on limiting confirmation to consequential
  reset, naming its scope, and preserving safe cancel/Focus behavior.
- Responsive guidance and current browser evidence converge on `320 CSS px` reflow and
  intentional desktop use rather than a fixed 390px product shell.
- Localization sources converge on canonical source content, reviewed variants,
  deterministic fallback, and correct language metadata. They do not support labeling
  reverse-translated Korean as official Japanese or publishing raw AI drafts.
- No external source determines the exact 44-board permanent contract, distinction
  between music unlock and full-board completion, recent-record semantics, signed-out
  omission rules, or absence of attempt history. Those decisions come from verified
  NOSTALGIA/NosLog evidence and explicit user approval.

## Rejected and Superseded Alternatives

- **Automatically complete missions from synchronized play records — Rejected:** a
  qualifying record does not prove the corresponding in-game Bingo was active.
- **Label one board active or currently selected — Rejected:** NosLog cannot read the
  user's active NOSTALGIA board. Use recently manually recorded only.
- **Create retry sessions, attempt counts, or completion history — Rejected:** reset
  only clears the current checklist; no verified user need warrants a ledger.
- **Add availability dates, ended states, archive, or version selector — Rejected:**
  all 44 approved boards are permanently browsable and versions are provenance only.
- **Show signed-out `0/25` and disabled completion controls — Rejected:** this fabricates
  personal state and repeats an unavailable action 25 times.
- **Hide the board from signed-out users — Rejected:** board coordinates and missions
  are valuable public reference information.
- **Show original and translation on every mission — Rejected:** one locale-matched
  instruction preserves scanning; Japanese appears only as fallback where needed.
- **Treat the current Korean mission as official source and reverse-translate it —
  Rejected:** official Japanese provenance must be sourced and verified.
- **Use one unexplained NOS total — Superseded:** line, full-board bonus, total
  available, and music-unlock threshold are separate meanings.
- **Make a detached persistent continue CTA — Rejected:** recent record stays in the
  list hierarchy and cannot imply official activity.
- **Use automatic infinite scroll — Rejected:** explicit batches preserve position,
  control, and history.
- **Keep desktop inside a fixed mobile-width shell — Rejected:** `390px` is a review
  canvas, not a desktop layout width.
- **Treat the structural discussion example as final high fidelity — Rejected:** it
  communicated hierarchy only; Foundation and Claude Design own final visual form.

## Decision Log

| ID       | Decision                                                                                                     | Status     |
| -------- | ------------------------------------------------------------------------------------------------------------ | ---------- |
| BINGO-01 | Bingo is a public reference and signed-in manual checklist, never an official synchronized state mirror      | `Approved` |
| BINGO-02 | All 44 boards are permanently browsable with no availability/archive/version selector                        | `Approved` |
| BINGO-03 | `sourceVersion` is subordinate release provenance only                                                       | `Approved` |
| BINGO-04 | Signed-out users see full board and mission reference content but no fabricated personal progress            | `Approved` |
| BINGO-05 | One contextual login prompt replaces repeated disabled editing controls and returns to the exact board       | `Approved` |
| BINGO-06 | The most recently edited manual board may appear as `Recently recorded`, never active/activated              | `Approved` |
| BINGO-07 | Progress distinguishes not started, in progress, music unlock complete, and full board complete              | `Approved` |
| BINGO-08 | Chance remains a secondary one-cell-from-line condition rather than a lifecycle state                        | `Approved` |
| BINGO-09 | Required lines, per-line NOS, full-board bonus, and total available NOS remain distinct                      | `Approved` |
| BINGO-10 | List uses compact personal filters/sorts, first 12 plus explicit next 12, and restorable context             | `Approved` |
| BINGO-11 | The complete 5×5 board remains central and synchronizes selection with the 25-mission list                   | `Approved` |
| BINGO-12 | Selection is public and independent from signed-in manual completion                                         | `Approved` |
| BINGO-13 | Manual mutation uses authorization, optimistic feedback, rollback, and stale/duplicate-write protection      | `Approved` |
| BINGO-14 | Reset clears only the user's current 25-cell board record after explicit confirmation                        | `Approved` |
| BINGO-15 | Reset creates no attempt, retry, completion-history, or lifetime-NOS record                                  | `Approved` |
| BINGO-16 | Verified official Japanese is canonical mission content; KO/EN are independently reviewed translations       | `Approved` |
| BINGO-17 | Mission instructions follow page locale independently from the Music Detail-only translation disclosure      | `Approved` |
| BINGO-18 | Missing approved KO/EN mission text falls back to verified Japanese with `lang="ja"`                         | `Approved` |
| BINGO-19 | Compact layouts reflow through 320 CSS px; wide layouts use added catalog and board/mission comparison space | `Approved` |
| BINGO-20 | Final high-fidelity styling remains Foundation and Claude Design work within this product contract           | `Approved` |

## Handoff Boundary

Claude Design may determine final typography, visual emphasis, surfaces, cover and
mini-board treatment, card proportions, column tracks, gaps, selected/check/chance
styling, control appearance, dialog appearance, responsive transition points, and
motion after Foundation approval. It must preserve the permanent catalog, manual-only
truth model, signed-out omissions, reward meanings, central board, synchronized
mission structure, reset boundary, localization provenance and fallback, state
contract, accessibility, and acceptance criteria.

The later Codex implementation session must compare the Claude output against this
brief. It must request a guide or design revision before implementing any design that
invents live game state, auto-completes missions, hides public reference content,
shows fake signed-out progress, merges unlock and full-board meaning, adds attempt
history or availability UI, uses unreviewed/reverse-translated mission content, keeps
a fixed phone-width desktop shell, or otherwise conflicts with the approved contract.
