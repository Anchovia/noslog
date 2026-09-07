# NosLog product rules

Current behavioral baseline, consolidated on 2026-09-08. This preserves important
rules that cannot be inferred from Figma pictures. It does not define layouts,
create new features or certify implementation completeness. Presentation belongs
to the [implementation contract](./README.md) and current Figma. The latest explicit
user decision wins. For detailed predicates, payloads and edge cases, inspect the
linked domain implementation and its tests; do not reconstruct behavior from an
old design-stage checklist. Changes to material behavior require a user decision.

## Shared behavior

- NosLog is an unofficial NOSTALGIA records, ranking and archive service. It does
  not claim KONAMI affiliation or official certification.
- Keep Korean, Japanese and English routes and messages. UI language, play region,
  NosLog nickname, NOSTALGIA player name and Discord identity are distinct values.
- Explicit localized URLs render that locale without silently changing the saved
  preference. Region is never inferred from language. Stable profile IDs survive
  nickname changes. Original music titles remain available with approved translations.
- Preserve URL filters, selected chart/difficulty/mode and valid return destinations.
  Browser Back and resizing must not reset a task. Ignore stale responses for a
  previously selected target; retain correctly identified cached data during updates.
- Distinguish missing data, measured zero, loading, no result, private data, signed
  out and ineligible states. Never fabricate records or treat all of them as zero.
- Enforce authentication, ownership, eligibility and input validation on the server.
  Client-side hidden or disabled controls are not authorization.
- Keep keyboard operation, labels, focus restoration, accessible errors and retries.
  Explicit destructive confirmation is separate from ordinary navigation or save.

## Authentication, profile settings and account deletion

- Discord is the sole login provider. NosLog does not manage passwords. Validate
  OAuth state and trusted internal return paths. Do not accept arbitrary external
  redirect destinations.
- New/incomplete accounts complete onboarding before account-dependent work.
  Preserve the safe original destination and allow logout/public-browsing recovery.
- Settings retain Experience, Profile, Privacy, Connections and Account. Guests
  can use public experience settings and sign in for account settings.
- Profile and Privacy edits are explicitly saved. Preserve staged changes on
  failure; warn before discarding dirty forms. Language applies immediately.
- NosLog nicknames preserve allowed Unicode display form and case. Validation and
  normalized uniqueness belong to the existing account schemas/services, not a
  new uppercase conversion. The synced official player name remains read-only.
- Avatar selection/cropping is staged before save; accept the existing JPG/PNG/WebP
  4 MB limits. Discord refresh must not overwrite a custom NosLog avatar, nickname,
  region, arcade or privacy preference. Do not add Discord disconnect without an
  alternative login method. Changing login identity is a separate sensitive flow.
- Logout destroys the authenticated session and returns to localized Home; it does
  not delete the account or device-local preferences.
- Permanent account deletion requires fresh Discord verification for the same
  account, valid for **10 minutes**, followed by explicit deletion confirmation.
  The server rechecks expiry and identity at deletion time. See
  [verification window](../../features/settings/schemas/deletionVerification.ts)
  and [deletion service](../../features/profile/server/accountDeletionService.ts).
- Delete the account's linked personal records, contributions, submissions and
  owned uploads according to the existing deletion service. Shared catalogue
  definitions are not that user's personal progress. Do not describe personal
  Bingo as shared with other users.

## Public profile, privacy and sharing

- Keep five positive visibility settings: official player name, Discord identity,
  preferred arcade, total play count, and play activity. Play activity owns both
  last-played and recent-play disclosure. Off withholds public output; it does not
  delete stored values. There is no whole-profile-private switch.
- Apply visibility consistently to public profiles, incremental results, ranking
  identity, share cards and server-generated metadata. CSS hiding is insufficient.
  Do not leak private values through response payloads or generated images.
- Basic and Recital retain their distinct record/grade meaning. Show the highest
  approved exam achievement per mode; do not introduce a generic `GRADE 57` badge.
- Public share links use stable profile IDs and the selected locale. Card export,
  clipboard or native-share failure must offer a usable fallback without changing
  privacy settings. Respect the existing public-data policy on every request.
- See [profile services](../../features/profile/server) and
  [privacy controls](../../features/settings/components/privacySettings.tsx).

## Music discovery, details, tiers and rankings

- Music and published-chart discovery share a catalogue flow but retain distinct
  scopes. Preserve approved search/sort/filter meanings and published-chart
  availability. Result identity stays the music; do not restore personal-record
  hover previews or mix an unrelated difficulty's records into a result.
- Filters retain draft/apply/cancel behavior where they obscure results and the
  existing immediate behavior in a visible rail. Layout changes do not alter
  filter contents, URL restoration or server query meaning.
- Music Detail keeps one music identity and one selected difficulty across Chart
  Info, My Record, Ranking and Tier/Evaluation. View-chart/video actions reflect
  availability for that exact chart. The actual viewer/editor remain preserved.
- Personal record, judgement analysis and Recital values keep their source units
  and limitations. Missing mode-specific values are not substituted with Basic
  values. Retry the failed region without losing the current chart context.
- Basic/Recital modes and S/Full Combo/Pianist goals remain independent. Preserve
  published tier placements/history and existing top-70 rating calculation. A
  community vote never directly changes an official placement.
- Global rankings support Official Grd and NosLog Rating for both modes, with the
  existing region populations. Use competition ranks (`1, 2, 2, 4`) for equal
  published values, including ties across pages. Preserve 25-row pagination and
  reset the page when mode/metric/region changes as required by the existing query.
- See [discovery service](../../features/music/server/discoveryService.ts),
  [music-detail loading](../../features/music/server/loadMusicDetail.ts),
  [tier domain](../../lib/tiers.ts) and [rankings](../../features/rankings).

## Community voting and evaluation

- Six independent goal-vote scopes: Basic and Recital × S, Full Combo and Pianist.
  One editable/deletable vote per user, exact chart, mode and goal; accept 1.0–14.5
  in 0.1 increments. Do not expand an old unscoped rating into six votes.
- Eligibility uses the exact chart's verified record: S requires score ≥950,000;
  Full Combo requires `fc_type >= 2` or 1,000,000; Pianist requires `fc_type === 3`
  or 1,000,000. Recital additionally requires `grade_recital > 0`. This does not
  prove the goal and Recital participation occurred in the same historical play.
  Use [the shared predicates](../../features/music/lib/community.ts).
- Below three valid votes, display Aggregating and the exact count. **Aggregating
  rows can expand:** show aggregation guidance and the eligibility-appropriate
  contribution form instead of a distribution. A first vote has no preset value.
- From three votes, publish arithmetic mean, exact count and actual distribution.
  Keep the median diagnostic-only. Do not merge distinct voted tier values or
  discard an outlier merely because it differs from the majority.
- Goal-neutral pattern evaluation is separate from goal votes. Preserve the five
  axes and exact per-axis counts; missing/insufficient values are not zero. An
  incomplete published pattern does not produce a fabricated closed polygon.
- Preserve ownership, participation checks, edit/delete, opinion ordering and
  helpful-vote rules in [community mutations](../../features/music/server/communityMutation.ts).
  No contribution rewards or automatic tier changes are introduced.

## Data synchronization

- The account-specific bookmarklet executes on the official NOSTALGIA site. The
  NosLog page installs/guides it and observes status; it does not possess the user's
  official-site credentials. Never send p.eagate passwords or login cookies to NosLog.
- Basic Pass availability determines the returned data scope. A recent-only sync
  processes the available recent 30 plays and preserves previously imported full
  records. Do not infer zero or erase records because detailed data was unavailable.
- Distinguish plays checked, new plays stored and charts with changed best records.
  Repeated sync must not duplicate history. Unknown chart exclusions are counted
  safely; user-facing messages omit raw IDs, stack traces and credentials.
- Keep first-install guidance, returning-user flow, bookmarklet overlay, active/
  delayed/timed-out/completed/partial/failed states and state-specific recovery.
  Do not restore the removed separate "holdings/current coverage" section.
- Status polling does not start ingestion. Bound polling and stop at terminal
  states; announce meaningful changes without stealing focus or announcing every poll.
- Keep bounded recent attempt history and meaningful change previews. A first full
  import is not hundreds of invented individual achievements.
- Token invalidation expires existing bookmarklets and requires reinstallation.
  Never expose/log the raw token separately; it is embedded only where required.
- See [sync services](../../features/sync/server),
  [bookmarklet](../../lib/bookmarklet.ts) and
  [token service](../../features/profile/server/syncTokenService.ts).

## Bingo

- Catalogue definitions and missions are public. Saved checks are private to their
  owner. Guests can browse but do not receive fabricated personal `0/25` records.
- Preserve manual cell completion. Do not infer a checked cell from play history or
  sync data. Save failures restore confirmed state; repeated or out-of-order
  requests must not overwrite newer intent.
- Distinguish not-started, in-progress, music-unlock complete and full-board complete.
  Chance means a line has one unchecked cell; it is not a replacement lifecycle.
  NOS reward conditions are not proof that an in-game reward was received.
- Preserve current five catalogue filters (`all`, `progress`, `unlocked`, `full`,
  `chance`) and three sorts (`recent`, `progress`, release order). Their contents
  follow the user's explicit override, not a conflicting Figma filter illustration.
- Confirm reset for the selected board, clearing only that user's checks on that
  board. Preserve other boards and shared definitions. Do not add attempt history,
  official verification or shared-progress claims.
- See [catalogue rules](../../features/bingos/bingoCatalog.ts) and
  [progress service](../../features/bingos/server/bingoProgressService.ts).

## Exams

- Keep Basic, Recital and Event reference data distinct. Preserve official stage
  and cumulative thresholds, permitted difficulties and reward meaning.
- Basic practice analysis uses independent best plays, not a predicted single-run
  pass. Recital points are not Basic scores; do not fabricate unsupported personal
  Recital analysis. Event reference does not create certification or expiry dates.
- Certification is for eligible published Basic/Recital exams only. Require the
  verified grade, no duplicate pending submission and no already-approved grade at
  or above the target in that mode. Higher approval implies easier grades in that
  mode without requiring duplicate proofs; rejection does not remove prior approval.
- One JPEG/PNG/WebP image, at most 4 MB, must show final three-tune result, mode,
  grade, pass mark and official player name matching the latest synced identity.
  Permit cropping/rotation only while required evidence remains readable; no stitched
  or replaced result/name. Do not add video, EXIF, date or full-cabinet requirements.
- Choose/preview precedes explicit upload/submit. Preserve pending, approved,
  rejected-with-reason and retry states. Validate authorization, eligibility and
  owned private storage paths on the server. Clean up failed temporary uploads.
- See [eligibility](../../features/exams/examEligibility.ts),
  [proof service](../../features/exams/server/examProofService.ts) and
  [proof schema](../../features/exams/schemas/examProofSchema.ts).

## Arcades, announcements, feedback and recovery

- Arcade location permission follows a user action. Denial leaves search/list
  usable. Keep map/list selection coordinated, canonical detail links, verified
  operating information and correction reporting. Do not infer unavailable cabinet
  conditions or turn a report into an automatically verified fact.
- Preserve original/source language and public publication state for announcements;
  optional translations are not fabricated. Official NOSTALGIA news links remain
  distinguishable from NosLog announcements.
- Feedback/error reports preserve target/context and optional private proof. Report
  submission is not public publication of the image. Prevent duplicate submission
  and provide actionable upload/save errors without exposing internal diagnostics.
- Keep not-found, recoverable error, maintenance and fatal recovery distinct. Retry
  must preserve safe context. Missing/unauthorized resources must not leak existence
  or private details. These states do not authorize changes to preserved viewers.

## Data retention and operator facts

- Operator display: **계롤(Anchovia)**. Keep the confirmed contact and provider facts
  from [privacy content](../../features/privacy/content/privacyContent.ts); do not
  invent a business identity, processor, retention period or legal claim.
- Avatars are public; exam/feedback evidence is private with server-enforced access.
  Approved exam evidence and sensitive review notes expire six months after review
  while achievement remains. Rejected exam evidence and resolved feedback follow
  the existing six-month retention policy. Account deletion removes owned data and
  uploads under the deletion contract. See [retention rules](../../lib/privacyRetention.ts).
- Audio stays local to the browser. Never upload MP3 files to NosLog storage or DB.
- Documentation consolidation does not declare unresolved real-provider, privacy
  copy or assisted-browser checks passed. Record actual verification separately.
