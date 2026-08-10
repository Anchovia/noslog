# NosLog 2.0 Data Sync Page Brief

## Document Control

- Status: `Approved`
- Decision status: `Complete Data Sync page contract approved: first-use and
returning-use hierarchy; explicit full-versus-recent scope; persistent coverage;
processing, delay, partial-completion, failure, and recovery states; concise result
previews and recent attempt history; account-specific bookmarklet security; text-led
media guidance; responsive behavior; accessibility; localization; and browser
acceptance`
- Evidence status: `Repository, schema, tests, current-interface, and authenticated
browser inspection; approved information architecture and Home contract; cited
official NOSTALGIA, rhythm-game score-import, production import, browser, security,
accessibility, responsive, and disclosure references; and the user-approved decision
record`
- Date started: 2026-08-03
- Last decision update: 2026-08-03
- Language: English
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Related Home contract:
  [03-home-page-brief.md](./03-home-page-brief.md)
- Scope: The localized public Data Sync entry, authenticated bookmarklet installation
  and execution guidance, attempt and coverage reporting, short attempt history,
  recovery, token invalidation, security and privacy explanation, responsive
  composition, accessibility, localization, and future implementation acceptance
- Excluded: Administrator sync-monitor redesign, replacement of the verified ingestion
  pipeline, direct official API integration, automatic background sync, storage of
  p.eagate credentials or cookies, final Foundation tokens, final high-fidelity
  composition, and production implementation in this design-guide session

## Decision Labels

- **Observed:** Verified in the repository, current browser evidence, an approved
  upstream artifact, or a cited source.
- **Approved:** Explicitly agreed with the user and authoritative for downstream design.
- **Proposed:** Evidence-based direction awaiting user approval.
- **Open:** Requires further research, testing, or a user decision.
- **Rejected:** Considered and explicitly not selected.
- **Superseded:** Replaced by a later approved direction.

This brief is authoritative for the Data Sync page's product meaning, content,
information hierarchy, data semantics, interaction, recovery, security, privacy,
responsive behavior, states, and acceptance criteria. Exact typography, color,
spacing, radius, elevation, illustration treatment, media framing, card treatment,
control dimensions, grid tracks, and content-driven transition values remain
Foundation and downstream Claude Design work. Later visual work may refine expression
but must not remove or reinterpret this product contract.

## Purpose

The Data Sync page answers five ordered questions:

> Is my NOSTALGIA data currently connected, what should I do next, what did the latest
> attempt add or update, what does NosLog currently cover, and how can I recover safely
> when the process fails?

It is a repeatable play-data transfer and confidence surface, not merely a one-time
bookmarklet tutorial. It is not an official KONAMI integration, a password manager, a
continuous background synchronization service, an administrator log viewer, or a raw
technical diagnostic console.

## Primary Context and Success

- **Approved upstream:** Data Sync remains an independent Play-support destination and
  a visually distinct Home row after the primary destination collection. It is not
  hidden under Music or Profile.
- **Approved:** Mobile use after playing at an Arcade is primary. A returning user must
  be able to understand sync state and start the next sync without first rereading the
  installation tutorial.
- **Approved:** First-time use must remain sufficiently explicit that a user can install
  and run the bookmarklet without outside instructions.
- **Approved:** A signed-out visitor succeeds when they understand what Data Sync does,
  what it sends, what it does not send, and how signing in enables an account-specific
  bookmarklet.
- **Approved:** A signed-in first-time user succeeds when they install the bookmarklet,
  open the official NOSTALGIA page, run it, and receive an understandable result.
- **Approved:** A returning user succeeds when the latest status, one clear next action,
  the latest result, and any required recovery are immediately visible.
- **Approved:** Recent-only synchronization is a valid successful outcome when the
  official detailed data is unavailable. It must never be presented as a failed or
  corrupted sync merely because it did not include the full catalog.
- **Approved:** Desktop remains required. Added width supports side-by-side status/result
  and setup/recovery comprehension rather than preserving a fixed approximately
  `390px` shell.
- **Approved:** Current styling and geometry are audit evidence, not NosLog 2.0 visual
  authority.

## Current-Product and Domain Evidence

### Repository and Data Evidence

- **Observed:** The localized public route is currently `/[locale]/bookmarklet`.
  Signed-out visitors can read the guide; an authenticated user is required to create
  the account-specific bookmarklet and view their result.
- **Observed:** `createSyncToken` signs `{ userId, version }` with HMAC. The token has no
  time expiry. `sync_token_version` invalidates every previously generated bookmarklet
  for the user when incremented.
- **Observed:** The bookmarklet runs only from the official
  `https://p.eagate.573.jp` origin, reads player data and the recent history, requests
  detailed music data when available, then sends the structured result and NosLog sync
  token to NosLog.
- **Observed:** The transfer does not send the user's p.eagate password or p.eagate
  login cookie to NosLog. The account-specific token is embedded in the bookmarklet
  code and must not be presented as a standalone secret or written to logs.
- **Observed:** The receive endpoint requires the exact p.eagate origin and JSON,
  limits request bodies to `8 MB`, caps recent history at `100` entries and music data
  at `2,000` entries, enforces a `30`-second cooldown, and permits only one active
  processing attempt per user.
- **Observed:** A processing attempt may remain active for up to `15` minutes. A later
  request marks an older attempt failed when that timeout has elapsed. Administrator
  health monitoring already treats processing at or above `10` minutes as delayed.
- **Observed:** Full sync updates profile data, accumulates deduplicated recent play
  events, applies current records only to known charts, stores record snapshots only
  when values changed, and recalculates dependent user and ranking data.
- **Observed:** Recent-only sync updates profile and accumulated recent plays but does
  not replace all current chart records. Existing full records remain available.
- **Observed:** `ChartPlayHistory` deduplicates by user, chart, source play time, score,
  max combo, and rank. `ChartRecordSnapshot` stores changed full-record states by sync
  and chart. Repeated attempts therefore support history without duplicating identical
  play events.
- **Observed:** Unknown music charts are skipped. The attempt can still complete while
  recording a notice. The current public summary reduces this to a boolean; the raw
  skipped chart IDs and internal message remain an administrator concern.
- **Observed:** `DataSync` stores attempt status, scope, received recent plays, inserted
  plays, changed records, an optional internal message, start, and completion time.
  The current public query reads only the latest attempt.
- **Observed:** Current coverage is separately derived from `PlayData` and accumulated
  history: played charts, charts with complete judgement counts, and charts with
  FAST/SLOW history.
- **Observed:** The Privacy page states that profile, play, judgement, rating, and sync
  records are retained until account deletion and that credentials are not stored.

### Current Interface and Browser Evidence

- **Observed:** The current page places status, token reset, latest result, bookmarklet
  installation, and run guidance in one long fixed-width column.
- **Observed:** Latest result expands to show attempt scope, received and inserted recent
  plays, changed records, and current judgement/timing coverage. It does not show past
  attempts or changed-item previews.
- **Observed:** The installation component switches between a desktop drag guide and a
  mobile bookmark-editing guide. Text and GIFs are both present.
- **Observed:** Token regeneration already uses a modal that explains immediate
  invalidation. Initial focus lands on the non-destructive Cancel action.
- **Observed:** At `390×844`, the closed page is a long single column. At `320×800`, the
  inspected page did not create document-level horizontal overflow. The secondary copy
  button was `36px` high and should not establish the 2.0 target size.
- **Observed:** At `1440×900`, the main content remains exactly about `390px` wide and
  leaves most desktop space unused.
- **Observed:** Expanding the mobile installation guide loads two additional tall GIFs.
  Current guide GIFs generated Next Image LCP warnings but no runtime error.
- **Observed:** Processing state does not automatically refresh, so a completed attempt
  can remain visually processing until the user reloads.

### External Domain Evidence

- **Observed:** Official NOSTALGIA Play Data exposes recent history for the latest
  `30` songs and requires the e-amusement Basic Course for detailed song records.
- **Observed:** Tachi, Gitadora-to-Kamaitachi, mai-tools, GITADORA Skill Viewer, and
  V-ARCHIVE demonstrate repeatable score collection, official-site extraction,
  installation instructions, missing-catalog limitations, and preserved history as
  established rhythm-game tracking needs.
- **Observed:** Notion and Slack import guidance exposes status, limitations,
  completion, partial outcomes, history, and recovery rather than treating import as
  an opaque submit action.
- **Observed:** Process-list guidance distinguishes a concise setup sequence from a
  linear step indicator. The bookmarklet is installed once and then reused; the page
  is not a persistent multi-screen wizard.
- **Observed:** Details and accordion guidance supports progressive disclosure when a
  returning majority does not need setup content, while warning against hiding content
  required to complete the primary first-time task.
- **Observed:** Progress guidance requires an indeterminate state when duration cannot
  be measured. A fabricated percentage would falsely imply knowledge the server does
  not have.
- **Observed:** WCAG status-message and modal-dialog guidance requires programmatic
  announcements without unnecessary focus movement and clear focus behavior for
  consequential confirmation.
- **Observed:** Security guidance converges on account-specific, revocable credentials,
  least exposure, no logs, and explicit consequences when credentials are replaced.
- **Observed:** Browser bookmarklet guidance confirms that mobile bookmark creation
  commonly requires copying and editing a bookmark URL and that behavior varies by
  browser.

## Approved Scope and Invariants

1. The Data Sync entry remains one localized public route with informative signed-out,
   first-time signed-in, and returning signed-in states.
2. Returning users see status and the next sync action before setup instructions.
3. First-time users see a concise setup process with installation and execution
   guidance expanded by default.
4. The page never asks the user to confirm installation with an unverifiable manual
   `Installed` checkbox.
5. The recurring sync path is not represented as a permanent step indicator or wizard.
6. The primary recurring action opens the official NOSTALGIA page in the expected
   context; the user explicitly runs the installed bookmarklet there.
7. Attempt scope and persistent NosLog coverage are separate concepts and separate
   visual groups.
8. Full and recent-only attempts are both valid. Recent-only never deletes or visually
   discredits previously synchronized full records.
9. First mention uses the localized equivalent of `e-amusement Basic Course (Basic
Pass)`; later mentions may use `Basic Course`. The label explains availability but
   does not imply NosLog sells or controls the subscription.
10. No determinate percentage is shown unless the future pipeline can truthfully
    measure total work and completed work. The current pipeline uses indeterminate
    processing.
11. Processing auto-refreshes while active. At `10` minutes it becomes delayed; at
    `15` minutes it exposes retry recovery consistent with the server timeout.
12. Unknown charts create `Completed · some excluded`, not a full failure. Public UI
    shows an excluded count and safe explanation, never raw IDs or internal errors.
13. Latest-result metrics use user-meaningful labels: `Recent plays checked`, `New
plays saved`, and `Charts with updated best records`.
14. Latest result may show at most three linked change previews. Large first full syncs
    are summarized as `First full record import` rather than rendered as hundreds of
    changes.
15. A collapsed Sync History exposes the latest five attempts. It is not an infinite
    technical audit log.
16. Token invalidation is secondary security/help functionality, not a persistent
    warning competing with the primary sync action.
17. Invalidation immediately expires every existing bookmarklet for the account and
    makes reinstallation the required next action.
18. The page clearly states what data is sent and that the p.eagate password and login
    cookie are not sent to NosLog.
19. A raw sync token is never rendered as standalone visible text, copied separately,
    written to client/server logs, analytics, monitoring, or public error details. The
    signed token remains embedded only where technically required in the account-
    specific bookmarklet.
20. Text instructions are independently complete. GIFs supplement those instructions;
    they never become the only explanation.
21. The page reflows at `320 CSS px`, uses added desktop space intentionally, and does
    not preserve a fixed phone-width shell.

## Terminology and Data Meaning

### User-Facing Terms

| Meaning                               | Required user-facing concept | Must not imply                                       |
| ------------------------------------- | ---------------------------- | ---------------------------------------------------- |
| One server ingestion                  | Sync attempt                 | Continuous connection or background sync             |
| Detailed catalog response present     | All records                  | Every historical play event ever made                |
| Detailed catalog response unavailable | Recent 30 plays              | Failure, deletion, or damaged data                   |
| Current stored completeness           | NosLog coverage              | The scope of only the latest attempt                 |
| New deduplicated recent events        | New plays saved              | Every row received was newly stored                  |
| Changed current chart record          | Updated best record          | The user necessarily played it in this exact attempt |
| Unknown catalog entries               | Some excluded                | Entire sync failure                                  |
| Signed bookmarklet credential         | Account-specific bookmarklet | p.eagate password or official KONAMI token           |

### Attempt Scope

- `All records` means the official detailed music response was available and the
  attempt could update the current per-chart record set in addition to recent plays.
- `Recent 30 plays` means the attempt received the official recent history but not the
  detailed music response. It adds new recent events and profile context while leaving
  existing current chart records intact.
- The number `30` describes the official recent-history window, not a NosLog deletion
  policy. NosLog retains deduplicated accumulated events under the approved privacy
  contract.

### Current NosLog Coverage

Coverage is the persistent state after all successful attempts, not a claim about the
latest payload. Show:

1. played-chart count;
2. charts with complete judgement details;
3. charts with FAST/SLOW details.

The design may express numerator/denominator only when the denominator is meaningful
and derived from the user's played records. Never merge the three measures into one
unexplained `sync percentage`.

## Approved Information Hierarchy

### Signed-Out Entry

Use one semantic `main` and this source order:

1. page identity and concise explanation;
2. what is synchronized and what is not collected;
3. sign-in action;
4. concise preview of the installation/run process;
5. limitations, including Basic Course scope.

Do not fabricate personal status, result, coverage, token, or history while signed out.

### First-Time Signed-In State

Use this mobile-first source order:

1. page identity;
2. `Not synced yet` status and concise next-action explanation;
3. account-specific security/privacy note;
4. expanded bookmarklet installation process;
5. expanded official-page execution process;
6. troubleshooting and token invalidation as secondary content.

The first setup uses a concise process list because all steps are required. It does not
use a global completion indicator and does not ask the user to mark steps complete.

### Returning Signed-In State

Use this mobile-first source order:

1. current status and its timestamp;
2. primary `Open NOSTALGIA page` action or status-appropriate recovery action;
3. latest result, including attempt scope and current coverage as separate groups;
4. up to three change previews when useful;
5. collapsed `Install or reinstall bookmarklet` guidance;
6. collapsed `Sync history` with the latest five attempts;
7. secondary Help/Security, including bookmarklet invalidation.

When a failure is specifically caused by an expired token or an installation problem,
open or strongly reveal the relevant recovery guidance instead of forcing the user to
find a collapsed section manually.

### Wide Composition

On wide layouts, preserve the semantic source order while using two purposeful areas:

- status, primary action, latest result, coverage, and previews;
- installation/recovery, history, and security/help.

The result area receives more visual weight. Do not create an empty desktop dashboard,
duplicate status cards, or place every section in equal-width equal-priority boxes.

## Action Priority

### Primary Actions

- First-time authenticated: create/install the account-specific bookmarklet.
- Returning idle/completed: `Open NOSTALGIA page`.
- Expired token: `Reinstall bookmarklet`.
- Timed-out/failed: `Try sync again` after explaining the next valid step.

Only one primary action is emphasized in a given state.

### Secondary Actions

- expand installation or browser-specific help;
- copy the bookmarklet address when required by the browser workflow;
- inspect a previewed changed Music detail;
- expand recent Sync History;
- report a repeated error;
- invalidate existing bookmarklets.

Do not place all secondary actions in the persistent top action row.

## Setup and Repeated-Sync Flow

### First Installation

1. Explain that the bookmarklet belongs to the current NosLog account and must not be
   shared.
2. Provide desktop drag installation where supported.
3. Provide a mobile/browser fallback that copies the complete bookmarklet address,
   creates a normal bookmark, and replaces its URL.
4. Explain browser-specific bookmark-editing limitations and the supported fallback.
5. Direct the user to sign into the official NOSTALGIA Play Data page.
6. Tell the user to run the bookmarklet from that official page.
7. Return to or refresh the NosLog status automatically when technically possible;
   otherwise give one concise return instruction.

The guide must not describe pasting the account-specific code into an untrusted page,
sharing it, or sending it to support.

### Returning Sync

1. The page presents current status and `Open NOSTALGIA page`.
2. The user signs in to the official page if necessary and runs the existing
   bookmarklet.
3. NosLog enters indeterminate processing and begins status refresh.
4. The completed result separates attempt scope, latest changes, and current coverage.
5. The user may open a previewed Music detail or leave the page; no extra confirmation
   is required.

### Basic Course Limitation

- On the first relevant explanation, use `e-amusement Basic Course (Basic Pass)` or
  its approved localized equivalent.
- Explain the effect, not only the subscription name: without detailed official data,
  the current attempt can still synchronize the recent 30 plays, while existing full
  records stay in NosLog.
- Do not use a warning color simply because the user has no Basic Course response.
- Do not present a purchase action unless it is an ordinary external official link and
  its presence is separately approved later.

## Status, Timing, and Recovery Contract

### Status Model

| State                            | Visible meaning                                             | Primary response                     | Additional behavior                        |
| -------------------------------- | ----------------------------------------------------------- | ------------------------------------ | ------------------------------------------ |
| Signed out                       | Sign-in is required for an account-specific bookmarklet     | Sign in                              | Keep public explanation available          |
| No history                       | No attempt has completed or started                         | Install bookmarklet                  | First-use guide expanded                   |
| Processing `<10 min`             | Sync is being processed                                     | No duplicate submit                  | Indeterminate status and automatic refresh |
| Delayed `10–<15 min`             | Sync is taking longer than usual                            | Wait; retain safe recovery help      | Continue refresh; no fake percentage       |
| Timed out `≥15 min`              | Current attempt did not finish in the allowed window        | Try again                            | Show retry and repeated-error report path  |
| Completed — full                 | All available detailed records and recent history processed | Open NOSTALGIA page for a later sync | Show full scope and coverage               |
| Completed — recent               | Recent 30 plays processed; previous full data preserved     | Open NOSTALGIA page for a later sync | Explain Basic Course effect neutrally      |
| Completed — some excluded        | Known data processed and unknown charts excluded            | Optional detail/retry later          | Show excluded count, no raw chart IDs      |
| Failed — signed out of NOSTALGIA | Official session unavailable                                | Sign in to NOSTALGIA and run again   | Open execution help                        |
| Failed — expired token           | Bookmarklet version invalid                                 | Reinstall bookmarklet                | Open reinstall help                        |
| Cooldown                         | A valid attempt ran too recently                            | Wait remaining time                  | Countdown based on server response         |
| Failed — server/process          | NosLog could not finish                                     | Try again                            | Offer error report after repetition        |

### Automatic Refresh

- Poll only while an attempt is active or when returning from the official page and a
  new attempt is expected.
- Stop when the attempt reaches a terminal state, the page is hidden for a sufficiently
  long period, the user leaves, or a bounded network-failure threshold is reached.
- Use cache-safe server data and avoid creating duplicate ingestion requests. Status
  polling never reruns the bookmarklet.
- Announce meaningful transitions such as completed, partial, failed, or delayed.
  Do not announce every poll.
- Keep focus where the user placed it. Completion does not move focus into the result.

### Failure Copy

- Explain what happened in one short statement and give one state-specific next action.
- Preserve the latest successful coverage even when the latest attempt fails.
- Never show stack traces, raw exception text, raw skipped IDs, token fragments,
  database identifiers, or administrator-only diagnostic messages.
- If exact failure classification is not safely available, use the general
  server/process recovery rather than guessing that the p.eagate session or token was
  at fault.

## Result and History Contract

### Latest Result

Always identify:

- terminal/active status;
- start or completion time in the active locale;
- attempt scope: `All records` or `Recent 30 plays`;
- duration when known;
- three attempt metrics with the approved user-facing labels;
- separate current NosLog coverage;
- partial exclusion count when applicable.

Zero values remain visible when they answer a meaningful question, such as a valid
sync that found no new play. Avoid celebratory success treatment that implies a record
improvement when all change counts are zero.

### Change Preview

- Show at most three preview items after a completed attempt when useful.
- Recent-only attempts prioritize newly stored recent plays.
- Full attempts prioritize changed best records.
- Each item identifies Music, difficulty, and the relevant changed value without
  reproducing a complete record card.
- Each item may link to the localized Music detail.
- A first full sync with a very large changed count uses one summary such as `First full
record import`; it does not pretend hundreds of baseline rows are individual new
  achievements.
- If no new or changed item exists, omit the preview region rather than displaying an
  empty decorative container.

### Sync History

- Keep the latest five attempts in reverse chronological order under a collapsed
  `Sync history` disclosure.
- Each row shows localized date/time, status, scope, duration if known, and concise
  attempt metrics.
- Partial completion is distinguishable from complete success and full failure.
- The current attempt may appear as processing/delayed at the top.
- History does not expose internal errors, tokens, raw chart IDs, administrator notes,
  request sizes, or infrastructure metadata.
- No infinite scroll, pagination, export, or complete technical audit log is required
  in the user page.

## Installation Guidance and Media Contract

### Progressive Disclosure

- First-time signed-in state: installation and run guidance are expanded.
- Returning successful state: group them under `Install or reinstall bookmarklet` and
  collapse by default.
- Relevant installation failure or expired token: reveal the affected guidance.
- Preserve expansion state during the current visit where practical.

### Text and GIF Relationship

- Every installation and execution step has complete visible text. A user must be able
  to finish the task when animations fail, are paused, are not understood, or are not
  loaded.
- A GIF illustrates the same local action and is supplementary. Do not replace the
  instruction with `See the animation` or rely on pixels alone to identify a control.
- Use descriptive alternative text only when the animation adds information not
  already stated next to it. Otherwise use an empty alternative to avoid duplication.
- Provide an accessible enlargement or full-media view when the action is too small to
  inspect at mobile width.
- Respect reduced-motion preferences. A paused/static first frame or user-controlled
  playback must remain understandable.
- Defer returning-user media until its disclosure is opened. Do not make multiple tall
  GIFs compete with status/result for initial loading priority.
- Preserve aspect ratio and prevent cumulative layout shift with known dimensions or
  equivalent reserved space.

### Browser-Specific Guidance

- Describe the supported desktop drag flow and mobile copy/edit flow without claiming
  every browser uses identical labels or menu locations.
- Identify known browsers where editing a bookmark URL is unavailable or materially
  different and give a supported alternative, such as desktop installation plus
  bookmark synchronization, when verified.
- If clipboard permission fails, keep the complete next-step explanation and provide a
  recoverable retry; never reveal only the token portion.
- Do not promise bookmarklet execution where a browser blocks `javascript:` bookmarks.

## Security and Privacy Contract

### Required Explanation Near Setup

State concisely that:

1. the bookmarklet is generated for the current NosLog account and must not be shared;
2. NosLog receives player information, recent play history, and detailed record data
   only when the official response provides it;
3. NosLog does not receive the user's p.eagate password or p.eagate login cookie;
4. synchronized profile, play, judgement, rating, and sync records follow the Privacy
   page's retention and account-deletion policy.

Do not turn this into a permanent alarm banner. The explanation belongs near setup and
in Help/Security.

### Bookmarklet Invalidation

- Label the secondary action by consequence, such as `Invalidate existing
bookmarklets`, rather than the implementation term `increment token version`.
- Open a modal naming that every existing bookmarklet for this account stops working
  immediately.
- Initial focus lands on Cancel or the least destructive action.
- Keep destructive confirmation visually and semantically distinct and name the
  consequence in the final action label.
- Escape, Cancel, and close return focus to the trigger without mutation.
- On success, close the modal, announce success, update page state, and make
  reinstallation the required next action.
- Do not imply the user can restore an invalidated bookmarklet. Recovery is generation
  and installation of the new account-specific bookmarklet.

### Transport and Error Boundaries

- Preserve exact official-origin checks, request schema validation, payload limits,
  cooldown, single-processing-attempt enforcement, and no-store response behavior.
- Do not place the signed bookmarklet, token, payload, p.eagate page content, or private
  record details in analytics or error-report attachments by default.
- Public result previews expose only the authenticated user's own permitted data and
  ordinary Music metadata.
- A feedback report about sync failure may include safe attempt ID/time and classified
  state generated by the server, but not a raw token or full payload.

## Authentication and Permission Contract

### Signed Out

- The guide, data categories, limitations, and privacy explanation remain public.
- Account-specific installation, result, coverage, history, and invalidation require
  sign-in.
- After sign-in, return the user to the localized Data Sync page.

### Signed In

- A user sees only their own bookmarklet, attempts, coverage, previews, and recovery.
- No role beyond an ordinary authenticated user is required to synchronize their own
  data.
- Session expiry during a page action returns a concise sign-in recovery and never
  exposes previously rendered credentials in an error.

### Administrator Boundary

- Administrator health, delays, raw errors, attempt IDs, user lookup, and operational
  investigation remain in the separate administrator surface.
- The user page may consume safe derived classifications and excluded counts but must
  not become a mirror of the administrator log.

## Responsive Contract

### Compact Layout

- Design mobile-first at a representative `390px`, then verify reflow down to
  `320 CSS px` and intermediate widths.
- Use the approved returning-user source order: status, next action, latest result,
  preview, install/recovery, history, security.
- Stack metrics or use a wrapping compact grid according to label/value width. Do not
  reduce critical labels below legibility to retain three rigid columns.
- Primary actions span an appropriate reliable touch width. Secondary icon-only
  controls require accessible names and adequate targets.
- Long Korean, Japanese, and English status or browser instructions wrap without
  overlapping icons or actions.
- GIF/media stays within its container and can enlarge without causing document-level
  two-dimensional scrolling.

### Wide Layout

- Do not retain the current fixed `390px` content width.
- Use a bounded responsive container and a two-area composition when content supports
  it: result/status as the main area and setup/recovery/help as the supporting area.
- Latest metrics and coverage may use wider horizontal comparison, but source order,
  heading relationships, and keyboard order remain coherent without CSS placement.
- Avoid stretching instructional prose and GIFs to the entire viewport. Use readable
  line lengths and purposeful media sizes inside the wider grid.
- A one-column layout may remain at widths where two columns would make either result
  or instruction content too narrow; transition values are content-driven.

### Short and Zoomed Viewports

- Token confirmation remains operable with internal scrolling without hiding the
  title or actions.
- At 200% text zoom, status, metrics, history rows, and instructional steps reflow
  rather than clip.
- Sticky actions, if later used, must not cover status messages, expanded media, or the
  final history/security content.

## Accessibility Contract

- Use one `h1`, ordered section headings, semantic lists for setup steps and history,
  and native button/link semantics.
- A process list is ordinary content, not a fake progress widget. Do not add
  `aria-current="step"` to repeated synchronization.
- The processing region exposes a concise accessible name and indeterminate busy
  state. Mark only the updating result region `aria-busy`, not the entire page.
- Announce meaningful status transitions with an appropriate status or alert region
  without moving focus. Avoid repeated announcements from each poll.
- The visible status never depends only on color or a pulsing dot; pair it with text.
- Disclosures expose expanded state, retain a visible keyboard focus indicator, and
  use controls with accessible names that describe their content.
- Modal confirmation follows the dialog pattern, traps focus while open, starts at the
  least destructive action, supports Escape, and returns focus to its trigger.
- Copy feedback is programmatically announced and does not remove focus from the copy
  control.
- Instructions identify controls by label and purpose, not only location, shape, or
  color.
- GIFs never autoplay in a way that violates motion guidance; reduced-motion users
  receive an equivalent static or controlled experience.
- Linked preview rows expose Music and difficulty in their accessible name and do not
  use the changed numeric value as the only link label.
- All interactive targets and information remain keyboard-operable and readable at
  `320 CSS px` and 200% zoom.

## Localization Contract

- `/ko/bookmarklet`, `/ja/bookmarklet`, and `/en/bookmarklet` provide equivalent
  features, states, recovery, security, history, and metadata.
- Preserve official identity and product terms. Localized first mention explains the
  official e-amusement Basic Course and the parenthetical `Basic Pass` term approved
  for NosLog; do not mistranslate it as a NosLog plan.
- `All records` and `Recent 30 plays` must remain semantically distinct in every
  locale. Avoid a translated generic `Partial sync` label that sounds like damage.
- Localize dates, times, relative times, durations, and number grouping with locale-
  aware formatters. Store and compare timestamps as absolute values.
- Korean and Japanese text may be compact; English recovery and security text may be
  materially longer. Layout transitions are driven by content rather than language-
  specific hard-coded widths.
- Browser menu labels may differ by OS, browser version, and locale. Use verified
  localized labels where available and pair them with a purpose-based explanation.
- Alternative text communicates the action demonstrated, not a filename or a literal
  frame-by-frame narration.
- Error classification is stable across languages even when user-facing copy differs.
  Do not parse localized strings to determine recovery behavior.

## Runtime State Contract

Use explicit server-derived state rather than inferring behavior from visual copy:

```ts
type PublicSyncStatus =
    | "none"
    | "processing"
    | "delayed"
    | "completed"
    | "completed_with_exclusions"
    | "failed";

type SyncScope = "full" | "recent";

type SyncRecovery =
    | "none"
    | "sign_in_nostalgia"
    | "reinstall_bookmarklet"
    | "wait_for_cooldown"
    | "retry"
    | "report_repeated_failure";

interface PublicSyncAttempt {
    id: number;
    status: PublicSyncStatus;
    scope: SyncScope;
    startedAt: string;
    completedAt: string | null;
    receivedRecentPlays: number;
    insertedRecentPlays: number;
    changedBestRecords: number;
    excludedChartCount: number;
    recovery: SyncRecovery;
    retryAfterSeconds: number | null;
}

interface SyncCoverage {
    playedCharts: number;
    judgementCharts: number;
    timingCharts: number;
}
```

The exact implementation may use equivalent names. It must preserve the separation of
attempt, persistent coverage, safe recovery classification, and administrator-only raw
diagnostics.

## Implementation Mapping

| Area                         | Current source                                                                                                                                                                                       | 2.0 obligation                                                                                                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route and server composition | [`app/(nevigation)/bookmarklet/page.tsx`](<../../app/(nevigation)/bookmarklet/page.tsx>)                                                                                                             | Branch signed-out, first-use, returning, processing, delayed, result, and recovery hierarchy without fixed phone width                                           |
| Latest result query          | [`app/(nevigation)/bookmarklet/data.ts`](<../../app/(nevigation)/bookmarklet/data.ts>)                                                                                                               | Return safe latest-five attempts, excluded count/classification, coverage, and bounded change previews without raw errors                                        |
| Token invalidation           | [`app/(nevigation)/bookmarklet/action.ts`](<../../app/(nevigation)/bookmarklet/action.ts>)                                                                                                           | Preserve version invalidation, expose consequence-led response, and require reinstall after success                                                              |
| Install guide                | [`components/bookmarklet/bookmarkletInstall.tsx`](../../components/bookmarklet/bookmarkletInstall.tsx)                                                                                               | Add first/returning disclosure behavior, complete text, media enlargement, reduced-motion/static equivalent, lazy returning media, and browser-specific recovery |
| Result presentation          | [`components/bookmarklet/syncResultSummary.tsx`](../../components/bookmarklet/syncResultSummary.tsx)                                                                                                 | Separate attempt scope and coverage, use approved labels, add partial and preview/history contracts, and announce live transitions                               |
| Confirmation                 | [`components/bookmarklet/syncTokenRegenerateButton.tsx`](../../components/bookmarklet/syncTokenRegenerateButton.tsx)                                                                                 | Keep least-destructive initial focus and return focus; move trigger to secondary Help/Security and make reinstall the post-success action                        |
| Bookmarklet creation         | [`lib/bookmarklet.ts`](../../lib/bookmarklet.ts)                                                                                                                                                     | Preserve signed account-specific code, official origin flow, and no standalone token/log exposure                                                                |
| Receive endpoint             | [`app/api/receivePlayerData/route.ts`](../../app/api/receivePlayerData/route.ts)                                                                                                                     | Preserve origin/schema/size/cooldown/locking/timeout controls; return safe machine-readable recovery and exclusion counts                                        |
| Full-record update           | [`lib/services/user/updatePlayData.ts`](../../lib/services/user/updatePlayData.ts)                                                                                                                   | Preserve known-chart filtering, current-record replacement semantics, and changed snapshot count                                                                 |
| Recent history               | [`lib/services/user/updateRecentPlay.ts`](../../lib/services/user/updateRecentPlay.ts)                                                                                                               | Preserve deduplication and expose bounded safe new-play preview data                                                                                             |
| Profile update               | [`lib/services/user/updatePlayerProfile.ts`](../../lib/services/user/updatePlayerProfile.ts)                                                                                                         | Preserve profile update without turning it into a separate user-facing scope                                                                                     |
| Schema                       | [`prisma/schema.prisma`](../../prisma/schema.prisma) `DataSync`, `ChartPlayHistory`, `ChartRecordSnapshot`, and `User.sync_token_version`                                                            | Add safe excluded count/recovery classification if needed; retain historical and cascade/privacy guarantees                                                      |
| Admin health                 | [`lib/admin/syncHealth.ts`](../../lib/admin/syncHealth.ts) and [`app/admin/syncs/page.tsx`](../../app/admin/syncs/page.tsx)                                                                          | Keep raw operations separate while sharing the 10-minute delayed and 15-minute timeout meaning                                                                   |
| Privacy                      | [`app/(nevigation)/privacy/page.tsx`](<../../app/(nevigation)/privacy/page.tsx>)                                                                                                                     | Keep collection, credential exclusion, retention, and deletion copy synchronized with the Data Sync explanation                                                  |
| Localization                 | [`lib/i18n/messageCatalogs`](../../lib/i18n/messageCatalogs)                                                                                                                                         | Add complete KO/JA/EN status, scope, coverage, history, security, media, browser, and recovery copy                                                              |
| Tests                        | [`tests/sync-api.test.ts`](../../tests/sync-api.test.ts), [`tests/sync-summary.test.ts`](../../tests/sync-summary.test.ts), and [`tests/bookmarklet-ui.test.ts`](../../tests/bookmarklet-ui.test.ts) | Extend safe state classification, attempt history, partial results, polling, token recovery, media fallback, responsive, and accessibility coverage              |

## Representative Fixtures

Validate at least:

1. signed-out visitor in Korean, Japanese, and English;
2. signed-in user with no attempt and a newly generated account-specific bookmarklet;
3. first-time desktop drag installation and first-time mobile copy/edit installation;
4. browser where bookmark URL editing works, differs, is blocked, or clipboard access
   is denied;
5. processing at 5 seconds, 9:59, 10:00, 14:59, and 15:00;
6. polling that transitions once from processing to full completion without duplicate
   announcements or duplicate ingestion;
7. a full attempt receiving 30 recent plays, inserting 0, changing 1 best record, and
   retaining broad current coverage;
8. a recent-only attempt inserting several events while preserving earlier full chart
   records and coverage;
9. valid completion with all three change metrics equal to zero;
10. first full import with hundreds of changed records summarized as a baseline import;
11. one, three, and more than three preview candidates with correct truncation and
    localized Music links;
12. completed attempt with one and many unknown charts, safe excluded count, and no raw
    ID in the public page;
13. latest five attempts containing full, recent, partial, failed, delayed, and active
    variants in reverse chronological order;
14. official NOSTALGIA session missing, expired token, active processing conflict,
    30-second cooldown, server failure, and repeated failure;
15. failed latest attempt while earlier successful coverage remains visible;
16. token invalidation cancel, Escape, confirm failure, confirm success, focus return,
    and mandatory reinstall state;
17. attempted token, payload, and raw-error leakage through visible copy, console,
    analytics, monitoring, URL, or feedback context;
18. GIF loaded, deferred, failed, enlarged, paused/static, and reduced-motion behavior
    while text remains sufficient;
19. `320px`, representative `390px`, intermediate widths, wide desktop, short
    viewport, 200% text zoom, keyboard-only, and screen-reader use;
20. long Korean recovery text, Japanese browser labels, and substantially longer
    English security copy.

## Browser Acceptance Contract

- `/ko/bookmarklet`, `/ja/bookmarklet`, and `/en/bookmarklet` expose equivalent Data
  Sync behavior and metadata.
- Signed-out users receive an accurate public explanation and sign-in recovery without
  a bookmarklet, personal result, coverage, or history leak.
- First-use signed-in users receive complete expanded text-led installation and
  execution guidance; returning successful users receive status and next action first.
- Desktop drag and supported mobile copy/edit flows can install the current account's
  bookmarklet. Unsupported browser behavior is stated and has an honest fallback.
- Running from a non-p.eagate origin remains rejected. Invalid content type, oversized
  payload, malformed payload, invalid token, cooldown, and active processing remain
  safely rejected.
- Processing auto-refreshes without rerunning ingestion, uses no fake percentage,
  announces terminal/delayed transitions once, and does not steal focus.
- The interface changes to delayed at 10 minutes and offers retry recovery at the
  15-minute timeout boundary consistently with server behavior.
- Full and recent-only results are both successful and clearly distinct. A recent-only
  result never deletes, hides, or implies deletion of earlier full records.
- Latest result visually and semantically separates this attempt's scope/metrics from
  persistent NosLog coverage.
- Partial completion shows an excluded count and safe explanation without internal
  error text or raw chart IDs.
- At most three useful change previews appear, first full imports are summarized, and
  preview links resolve to the correct localized Music detail.
- Sync History shows at most the latest five attempts in correct order with safe status,
  scope, time, duration, and metrics.
- Invalidation confirmation starts at the least destructive action, supports Cancel
  and Escape, returns focus, immediately invalidates old bookmarklets only after
  success, and makes reinstall the next action.
- No raw token, p.eagate password/cookie, source payload, private record detail, stack
  trace, or administrator-only diagnostic appears in visible public copy, URL,
  console, analytics, monitoring, or error-report defaults.
- GIF failure, non-animation, deferral, reduced motion, or an unavailable enlargement
  never prevents completion because adjacent text is independently complete.
- At `320 CSS px`, no status, metric, action, history row, long browser instruction,
  security copy, modal, or media frame creates document-level horizontal overflow,
  clipping, or overlap.
- Wide layouts use meaningful result/setup space and do not retain a fixed phone-width
  shell or stretch instructional prose/media indiscriminately.
- At 200% text zoom and in short viewports, all content and confirmation actions remain
  reachable and correctly ordered.
- Normal and failure flows produce no unexpected console error, hydration issue,
  duplicate status announcement, duplicate ingestion, stale processing state, focus
  loss, or credential leakage.

## Reference Matrix

| Source                                                                                                                                  | Transferable principle                                                                                       | NosLog application                                                              | Limitation                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [Current Data Sync entry](<../../app/(nevigation)/bookmarklet/page.tsx>)                                                                | Establishes public/auth hierarchy, current status, guide, and result flow                                    | Grounds observed functionality and current problems                             | Current fixed-width composition is not 2.0 authority                                |
| [Current bookmarklet implementation](../../lib/bookmarklet.ts)                                                                          | Shows account-specific signed code and official-site extraction                                              | Grounds security, execution, and token meaning                                  | Minified runtime is not user-facing guidance                                        |
| [Current receive endpoint](../../app/api/receivePlayerData/route.ts)                                                                    | Establishes origin, validation, size, cooldown, concurrency, timeout, and partial-catalog behavior           | Grounds safe state and recovery requirements                                    | Current public response classification is not yet sufficiently detailed             |
| [Current sync schema](../../prisma/schema.prisma)                                                                                       | Separates attempt, accumulated recent events, changed snapshots, and token version                           | Grounds scope, coverage, history, and invalidation                              | Latest-five public history and excluded count need safe query support               |
| [Current sync tests](../../tests/sync-api.test.ts)                                                                                      | Encodes verified security and ingestion behavior                                                             | Protects implementation invariants                                              | Does not cover every approved 2.0 presentation state                                |
| [Official NOSTALGIA Play Data notice](https://p.eagate.573.jp/game/nostalgia/op3/news/entrance.html)                                    | Recent history is the latest 30 songs; detailed music data depends on the Basic Course                       | Grounds full-versus-recent meaning and subscription explanation                 | Official availability can change and does not define NosLog retention               |
| [Official NOSTALGIA Play Data](https://p.eagate.573.jp/game/nostalgia/op3/playdata/entrance.html)                                       | Official records prioritize authenticated player and song data                                               | Grounds source identity                                                         | Most content requires official authentication and cannot define NosLog UI           |
| [Tachi](https://tachi.ac/)                                                                                                              | Rhythm-game tracking preserves scores, sessions, history, and integrations                                   | Supports repeatable sync and historical value                                   | Multi-game architecture is broader than NosLog                                      |
| [Gitadora to Kamaitachi](https://pfy.ch/programming/projects/gitadora.html)                                                             | Official-site scraping needs an explicit guide and may exclude songs missing from the destination catalog    | Supports safe partial completion and setup                                      | Userscript/file workflow differs from NosLog's direct bookmarklet post              |
| [mai-tools bookmarklet guide](https://myjian.github.io/mai-tools/)                                                                      | Desktop drag and mobile copy/edit installation are established bookmarklet flows                             | Supports browser-specific text-led setup                                        | It does not define NosLog security or supported-browser policy                      |
| [GITADORA Skill Viewer](https://gsv.fun/en)                                                                                             | A bookmarklet can fetch and store official-site skill data for later viewing                                 | Supports the recurring extraction model                                         | Legacy surface and injected-script implementation are not visual/security authority |
| [V-ARCHIVE client guide](https://v-archive.net/info/manual/client)                                                                      | Imported rhythm-game records need explicit credential handling and clear capture/upload feedback             | Supports concise trust and result feedback                                      | Native client capture differs from browser bookmarklets                             |
| [Notion: Import data](https://www.notion.com/help/import-data-into-notion)                                                              | Imports expose status, limitations, completion, and troubleshooting                                          | Supports status, limitation, and recovery disclosure                            | Workspace migration is larger and less frequent than score sync                     |
| [Slack import FAQ](https://slack.com/help/articles/360049597673-FAQ--Import-data-from-one-Slack-workspace-to-another)                   | Multi-phase imports communicate progress, completion dependencies, and troubleshooting                       | Supports honest processing and failure recovery                                 | Enterprise migration phases do not map one-to-one to NosLog                         |
| [USWDS Process List](https://designsystem.digital.gov/components/process-list/)                                                         | A process list explains a sequence without implying interactive wizard progress                              | Supports first-use setup steps                                                  | It does not define recurring status or final NosLog styling                         |
| [USWDS Step Indicator](https://designsystem.digital.gov/components/step-indicator/)                                                     | Step indicators are for linear multi-step flows with current-position meaning                                | Supports rejecting a permanent sync stepper                                     | First setup still benefits from ordinary numbered instructions                      |
| [GOV.UK Details](https://design-system.service.gov.uk/components/details/)                                                              | Secondary detail may be disclosed on demand, but essential task content should not be hidden                 | Supports first-use expansion and returning-use collapse                         | Browser-native details styling is not NosLog visual authority                       |
| [WAI-ARIA APG Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)                                                           | Disclosure headers expose state and remain keyboard operable                                                 | Supports install/history/help sections                                          | APG semantics do not select which content is primary                                |
| [Carbon Progress Indicator](https://carbondesignsystem.com/components/progress-indicator/usage/)                                        | Step progress differs from background system processing                                                      | Supports rejecting a recurring wizard                                           | Enterprise component styling is not adopted                                         |
| [Carbon Progress Bar](https://carbondesignsystem.com/components/progress-bar/usage/)                                                    | Indeterminate presentation is required when total progress cannot be calculated                              | Supports honest processing without fake percentages                             | Future measurable pipelines may justify determinate progress                        |
| [Carbon Inline Loading](https://carbondesignsystem.com/components/inline-loading/usage/)                                                | Local processing can transition to success or error without blocking the entire page                         | Supports status-local loading                                                   | Exact animation and timing are Foundation decisions                                 |
| [WCAG 2.2 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)                                            | Important progress, success, and error changes must be programmatically exposed without focus movement       | Supports polling announcements                                                  | It does not prescribe visible layout or poll frequency                              |
| [WAI-ARIA APG Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)                                                     | Modal focus is contained, predictable, cancellable, and returned to the trigger                              | Supports token invalidation confirmation                                        | It does not define consequence copy                                                 |
| [GOV.UK Warning Text](https://design-system.service.gov.uk/components/warning-text/)                                                    | Warning treatment is reserved for significant consequences                                                   | Supports consequence-led invalidation while rejecting permanent alarm treatment | Government risk tone can be excessive for routine setup                             |
| [MDN `javascript:` URLs](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/javascript)                                 | `javascript:` navigation executes script in the page context and is subject to browser/security restrictions | Grounds bookmarklet limitations                                                 | It documents the platform, not a recommendation to bypass browser policy            |
| [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)                                                               | Cross-origin requests require explicit origin and response controls                                          | Supports preserving exact official-origin handling                              | CORS alone is not authentication or payload validation                              |
| [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)              | Secrets should be least-exposed, revocable, rotated, and excluded from logs                                  | Supports account-specific token and invalidation boundaries                     | Bookmarklet delivery still requires the signed credential inside executable code    |
| [GitHub token security](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/token-expiration-and-revocation) | Revocation must have clear consequences and requires replacement credentials                                 | Supports explicit invalidation and reinstall recovery                           | GitHub tokens have different scope and expiry capabilities                          |
| [Apple Safari bookmarks on iPhone](https://support.apple.com/guide/iphone/bookmark-favorite-webpages-iph42ab2f3a7/ios)                  | Mobile bookmark creation and editing are platform-specific user actions                                      | Supports browser-specific instructions                                          | The page does not guarantee `javascript:` execution in every browser/version        |
| [WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                                  | Required content reflows at 320 CSS px without page-level two-dimensional scrolling                          | Grounds compact acceptance                                                      | Media enlargement may use a deliberate bounded viewer                               |
| [WCAG Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)                        | Motion triggered by interaction needs a disable/alternative when nonessential                                | Supports reduced-motion and static guidance                                     | Instructional GIF policy also depends on content equivalence                        |

### Evidence Convergence

- Official NOSTALGIA and current ingestion evidence converge on two legitimate payload
  scopes: detailed full records when Basic Course data is available and recent 30 plays
  otherwise. Neither supports labeling recent-only as failure or deleting prior full
  data.
- Rhythm-game trackers converge on repeatable import, preserved history, missing-
  catalog handling, and clear setup instructions. They do not justify exposing internal
  scraper errors or technical logs to ordinary users.
- Production import services converge on visible status, bounded history, limitations,
  completion, partial outcomes, and actionable recovery. Their enterprise phase models
  do not justify fabricated percent progress for NosLog.
- Process and disclosure guidance converges on expanded essential first-use instructions
  and collapsed secondary returning-use help. It does not support a permanent wizard or
  an unverifiable `Installed` checkbox.
- Accessibility references converge on indeterminate busy state, programmatic terminal
  announcements without focus theft, keyboard disclosures, consequence-led modal
  behavior, and text alternatives to media.
- Security sources converge on account-specific revocable credentials, least exposure,
  no logging, explicit invalidation effects, and replacement after revocation. They do
  not remove the technical need to embed the signed credential inside the bookmarklet.
- Browser references converge on text-led, browser-aware installation and honest
  limitations. GIF-only guidance cannot carry the approved accessibility or recovery
  contract.
- The 10-minute delayed threshold, 15-minute retry threshold, latest-five history,
  three-preview cap, terminology, ordering, and post-invalidation reinstall requirement
  are approved NosLog product decisions informed but not dictated by external sources.

## Rejected and Superseded Alternatives

- **Keep setup above status for every visit — Superseded:** returning users see current
  status and next action first; setup collapses unless relevant.
- **Permanent multi-step wizard or step indicator — Rejected:** recurring sync is not a
  linear multi-screen completion flow.
- **Manual `Installed` checkbox — Rejected:** NosLog cannot verify it and the state can
  become false after browser cleanup or token invalidation.
- **Hide first-use instructions in a disclosure — Rejected:** every first-time step is
  required to complete the task.
- **Show only GIFs — Rejected:** text must independently complete the task; animations
  are supplementary and may fail, be paused, or be inaccessible.
- **Remove GIFs entirely — Rejected:** verified animations remain useful visual support
  when paired with complete text, enlargement, deferred loading, and reduced-motion
  handling.
- **Show a determinate percentage based on elapsed time — Rejected:** elapsed time is
  not completed work and would be deceptive.
- **Require Basic Course for any success — Rejected:** recent 30 plays remain a valid
  successful scope.
- **Treat recent-only as warning/failure — Rejected:** explain its neutral limitation
  and preserve earlier full records.
- **Merge latest-attempt scope and persistent coverage into one percentage — Rejected:**
  they answer different questions and have no honest common denominator.
- **Show all changed records inline — Rejected:** cap useful previews at three and
  summarize first full import.
- **Expose complete user technical logs — Rejected:** latest five safe summaries are
  sufficient; administrator diagnostics remain separate.
- **Fail the entire attempt for unknown charts — Rejected:** known records complete and
  exclusions are counted safely.
- **Expose raw skipped chart IDs or exception text — Rejected:** public UI uses a safe
  count/classification.
- **Keep token invalidation as a persistent top warning — Superseded:** move it to
  secondary Help/Security with a consequence-led modal.
- **Focus the destructive confirm action first — Rejected:** initial focus remains on
  Cancel or the least destructive action.
- **Allow invalidated bookmarklets to be restored — Rejected:** successful invalidation
  requires generation and installation of the new bookmarklet.
- **Store or request p.eagate credentials — Rejected:** NosLog receives only the
  approved structured data and its own signed sync token.
- **Automatically sync in the background — Rejected:** current official-site access and
  security model require an explicit user-run bookmarklet.
- **Preserve fixed `390px` content on desktop — Rejected:** wide layouts use purposeful
  status/result and setup/recovery space.

## Decision Log

| ID      | Decision                                                                                                                  | Status     |
| ------- | ------------------------------------------------------------------------------------------------------------------------- | ---------- |
| SYNC-01 | Keep Data Sync an independent localized Play-support destination and Home row                                             | `Approved` |
| SYNC-02 | Serve informative signed-out, first-use signed-in, and returning signed-in states on one route                            | `Approved` |
| SYNC-03 | Show returning users current status and one next action before setup instructions                                         | `Approved` |
| SYNC-04 | Expand the required installation/run process for first use and collapse it for normal return use                          | `Approved` |
| SYNC-05 | Use an ordinary process list for first setup; do not use a recurring stepper or manual installed checkbox                 | `Approved` |
| SYNC-06 | Keep `Open NOSTALGIA page` as the primary recurring action and require explicit bookmarklet execution                     | `Approved` |
| SYNC-07 | Distinguish `All records` from `Recent 30 plays` and treat both as valid outcomes                                         | `Approved` |
| SYNC-08 | Explain `e-amusement Basic Course (Basic Pass)` once and describe its effect neutrally                                    | `Approved` |
| SYNC-09 | Preserve prior full records and accumulated deduplicated history after recent-only sync                                   | `Approved` |
| SYNC-10 | Separate latest-attempt scope/metrics from persistent NosLog coverage                                                     | `Approved` |
| SYNC-11 | Use indeterminate processing, automatic status refresh, 10-minute delayed, and 15-minute retry states                     | `Approved` |
| SYNC-12 | Announce meaningful status transitions without focus movement or repeated poll announcements                              | `Approved` |
| SYNC-13 | Classify recovery by official login, expired token, cooldown, timeout/process failure, and repetition                     | `Approved` |
| SYNC-14 | Treat unknown charts as `Completed · some excluded` and expose only a safe excluded count                                 | `Approved` |
| SYNC-15 | Use the labels `Recent plays checked`, `New plays saved`, and `Charts with updated best records`                          | `Approved` |
| SYNC-16 | Show at most three linked change previews and summarize a large first full import                                         | `Approved` |
| SYNC-17 | Expose the latest five safe attempts in a collapsed Sync History                                                          | `Approved` |
| SYNC-18 | Keep token invalidation in secondary Help/Security, explain immediate impact, and focus Cancel first                      | `Approved` |
| SYNC-19 | Make reinstall the required next action after successful bookmarklet invalidation                                         | `Approved` |
| SYNC-20 | State that the bookmarklet is account-specific, must not be shared, and never sends the p.eagate password or login cookie | `Approved` |
| SYNC-21 | Never display/log a standalone raw token or include credentials/payloads in public diagnostics                            | `Approved` |
| SYNC-22 | Retain complete text plus supplementary GIFs, enlargement, reduced-motion support, and deferred returning-user media      | `Approved` |
| SYNC-23 | Document browser-specific bookmark editing limitations and honest supported fallbacks                                     | `Approved` |
| SYNC-24 | Reflow at 320 CSS px and use purposeful two-area composition on sufficiently wide layouts                                 | `Approved` |
| SYNC-25 | Keep administrator raw diagnostics and monitoring outside the user page                                                   | `Approved` |

## Handoff Boundary

Claude Design may determine the final type scale, surfaces, status treatment,
illustration and GIF framing, process-list anatomy, card hierarchy, metric layout,
preview-row styling, disclosure treatment, modal appearance, spacing, grid tracks,
responsive transition values, and restrained motion after Foundation approval. It must
preserve the approved first/returning hierarchy, legitimate scope meanings, persistent
coverage distinction, state timing, partial completion, bounded previews/history,
recovery, security/privacy explanation, text-led media contract, accessibility, and
acceptance criteria.

The future Codex implementation session must compare Claude output with this brief. It
must request a guide or design revision before implementing any result that puts setup
above returning-user status, creates a fake stepper or progress percentage, treats
recent-only as failure, implies earlier full data was deleted, merges attempt and
coverage, exposes raw diagnostics or tokens, omits partial-exclusion meaning, shows an
unbounded change/history feed, focuses destructive invalidation first, fails to require
reinstallation after invalidation, relies on GIFs without complete text, fixes desktop
to phone width, or leaves processing and recovery inaccessible.
