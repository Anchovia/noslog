# NosLog product rules

Current behavioral baseline, consolidated on 2026-09-08. This preserves important
rules that cannot be inferred from the screen. It does not define layouts,
create new features or certify implementation completeness. Presentation belongs
to the [design guide](./README.md). The latest explicit user decision wins. For detailed predicates, payloads and edge cases, inspect the
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

- Keep six positive visibility settings: official player name, Discord identity,
  preferred arcade, total play count, play activity and play scores. Play activity
  owns both last-played and recent-play disclosure. Off withholds public output; it
  does not delete stored values. There is no whole-profile-private switch.
- Play scores (2026-09-18, default on for existing and new users; onboarding shows it
  checked): when off, the player is left out of chart rankings, score-ruler pins and
  dots, the score distribution, global Grd / rating rankings, other players' rank
  positions and "similar Grd" averages — ranks are recomputed among the remaining
  players. Only the player still sees their own position among the public players.
  Others see the profile identity with a lock message instead of Grd, rating, ranks,
  rank distribution, judgement totals, best plays, progress and recent plays; the
  profile plays/progress APIs return 403 for them. Values are withheld on the server,
  not hidden with CSS.
- Apply visibility consistently to public profiles, incremental results, ranking
  identity, share cards and server-generated metadata. CSS hiding is insufficient.
  Do not leak private values through response payloads or generated images.
- Basic and Recital retain their distinct record/grade meaning. Show the highest
  approved exam achievement per mode; do not introduce a generic `GRADE 57` badge.
- The public profile (2026-09-25) is one head (identity, meta line, mode, headline
  Grd) above section tabs with their own URLs — overview `/profile/[id]` and
  achievements `/profile/[id]/achievements` so far. The selected mode lives in the
  URL (`?mode=recital`) and carries across tabs. The headline "top N%" is the world
  rank divided by the players who show scores and have that mode's Grd — the same
  population the rank counts. The 90-day change is the official Grd change over the
  progress range and is shown only when it rose.
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
- Opening a music result from the catalogue (music list, grid, dense view)
  or a bingo music mission lands on that music's highest difficulty — Real
  when it has one, otherwise Expert (then Hard, Normal). Players care least
  about the lowest difficulty (2026-09-19). Links that already name a
  difficulty (search preview, chart results, records) keep theirs.
- Music Detail keeps one music identity and one selected difficulty across
  Overview, My Record, Ranking and Ratings (URL `tab` values stay `detail`,
  `record`, `ranking`, `tier`). The header shows the selected chart's constant and
  its published tier values; a chart without a constant shows a muted "—" in the
  constant cell, and unlisted/unpublished tier scopes show no value rather than a
  guessed one. View-chart/video actions are always present and are
  disabled unless that exact chart has them. The stats card starts with the
  viewer's best record on the selected chart (grade icon, best score, Basic Grd);
  with no record it shows dashes, and when signed out it links to sign-in.
  A localized title (when the viewer's setting allows it) appears as a line
  under the title; long title, localized title and artist lines are clipped
  with an end fade and the whole block expands on tap without losing text. The actual viewer/editor remain preserved.
- Personal record, judgement analysis and Recital values keep their source units
  and limitations. Missing mode-specific values are not substituted with Basic
  values. Retry the failed region without losing the current chart context.
- Arcade facilities (parking, smoking room …) and cabinet tags (streaming
  cabinet, headphone jack …) are fixed lists chosen by admins; cabinet features
  (key weight, screen lag, sound volume) are three-step choices plus an optional
  free-text note (100 chars). Values are stored as keys and translated on
  screen; the free-text note is shown as written. Editing tags, features or
  facilities does not refresh a cabinet's verification time — only availability
  or condition changes (or 「오늘 확인」) do (2026-09-22).
- Chart and music data fields (note count, constant, BPM, length, release date,
  unlock condition) record where each value came from in `chart_field_sources`
  (play-record inference, BEMANIWiki, RemyWiki, official level or manual). Values
  inferred from players' own records win over wiki values when they disagree;
  wiki-sourced values may be replaced once records exist (2026-09-18).
- The unlock condition is stored as the BEMANIWiki original (Japanese, per song,
  same text on every chart). The detail page parses it per difficulty: one line
  per event, a leading 「→」 marks where the event moved after it ended, and the
  stardust count is this difficulty's number (4 numbers = N/H/E/R, 3 = N/H/E,
  1 = every difficulty; with both 3- and 1-number lines the 1-number line is
  Real's). Event names are translated through `unlock_condition_translations`
  (ko · en; ja shows the original; unknown names fall back to the original)
  (2026-09-18).
- Release date (`released_at`, shown as 「수록일」) is per chart: Normal, Hard
  and Expert take the song's release date (BEMANIWiki 配信日), Real takes the
  date that Real chart was added (新規追加日). Charts the wiki does not date stay
  empty rather than borrowing the song date (2026-09-18).
- The ranking tab's score-distribution curve shows player pins at each best
  score: every participant when there are 30 or fewer, otherwise the top 3 plus
  the signed-in viewer. Nearby pins collapse into the highest-scoring player with
  a "+N" count; the viewer is never collapsed. Choosing a player scrolls to that
  player's leaderboard row, opening the page that contains it (2026-09-17).
- The similar-Grd comparison in judgement analysis uses other players within
  ±200 Grd, excluding the viewer, and is available from one such record
  (2026-09-16, previously five). It is always shown (no toggle). Each
  judgement/note-rate average uses only the records that have that value; an
  item without an average shows no average line, and with no comparable records
  neither the basis count nor any average appears.
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
- Below three valid votes, display Aggregating and the exact count. A row
  expands only when it has something to show: a distribution (three or more
  votes), a vote the viewer may cast, or the viewer's existing vote. No
  explanatory sentences (aggregation guidance, eligibility reasons, value range)
  are shown; ineligible viewers simply get no input, and guests get one
  "sign in to vote" link under the list (2026-09-16). A first vote has no preset
  value; an existing vote stays editable/deletable.
- From three votes, publish arithmetic mean, exact count and actual distribution.
  Keep the median diagnostic-only. Do not merge distinct voted tier values or
  discard an outlier merely because it differs from the majority.
- Goal-neutral pattern evaluation is separate from goal votes. Preserve the five
  axes and exact per-axis counts; missing/insufficient values are not zero. An
  axis average is shown from one rating (2026-09-17, previously three); an
  axis without ratings shows an empty bar and "—"; a rating input
  left untouched stays "not rated", distinct from 0. The 0–4 scale is the
  pattern's strength compared with all charts, not its share of this chart
  (2026-09-23); the criteria dialog and the pattern form say so.
- Preserve ownership, participation checks and edit/delete in
  [community mutations](../../features/music/server/communityMutation.ts).
  Opinions are listed newest first. The helpful-vote control and helpful sort
  are removed from the UI (2026-09-16); stored helpful data and the API remain.
  Pattern ratings save as soon as a value is chosen (changes within a short
  moment are batched); tapping the chosen value again clears that axis, and
  clearing every axis asks for confirmation. When no ratings and no opinion
  remain, the evaluation row is deleted.
  The pattern form saves ratings only and the opinion composer saves the
  opinion only — both write the same evaluation row, so saving one keeps the
  other's stored value. Deleting the pattern evaluation keeps an existing
  opinion.
  No contribution rewards or automatic tier changes are introduced.
- Opinion interactions (2026-09-22). Likes reuse the existing helpful table: a
  signed-in player with a positive record on that chart may like others' opinions
  and replies (not their own). Sort: newest or most liked.
  Replies are one level deep (`CommunityOpinionReply`); replying to a reply
  prefixes `@name`. Writing a reply needs the same chart record as writing an
  opinion; the author may edit or delete their reply, and replies can be reported
  (same report table with `replyId`). When an opinion with replies is deleted, its
  row stays as "deleted by author" so others' replies remain; no new replies are
  accepted there. Clearing a whole evaluation that has replies keeps the row with
  ratings and opinion emptied. Account deletion cascades the author's replies.
- Opinion translation (2026-09-22). The text language is detected from its script
  (Hangul → ko, kana/Han → ja, Latin → en; one or two letters → none). When an
  opinion or reply is written or edited, the server translates it into the other
  two locales after the response (`after`) with the same Gemini key as official X
  news (`GEMINI_API_KEY`, free tier — user decision) and stores them; viewers reuse
  the stored text. "See translation" appears only when the text language differs
  from the viewer's locale; if a stored translation is missing (older text or a
  failed call) the first click creates and stores it once. Editing clears stale
  translations before re-translating; deleting removes them. Without the key no
  button is shown. The privacy policy (2026-09-22) discloses the free-tier transfer.

## Data synchronization

- The account-specific bookmarklet executes on the official NOSTALGIA site. The
  NosLog page installs/guides it and observes status; it does not possess the user's
  official-site credentials. Never send p.eagate passwords or login cookies to NosLog.
- Basic Pass availability determines the returned data scope, not access to personal
  features (2026-09-20). Recent-only sync accumulates unique plays into chart best
  records, observed play/FC/P counts, Basic Grd (top 50), Rating, rankings and history.
  After Pass expiry, continue from existing full values; preserve independent bests
  and absent Recital/note-rate fields. Never replace unknown Recital with zero.
  Total player play count still comes from player_info. Full sync reconciles chart
  values/counts to the official response without deleting play or growth history.
- When recent Basic Grd is zero, retain the raw history value and supplement personal
  bests with the validated judgment/combo formula (2026-09-20). Only two-hand
  A/A2/S/P records with a known official constant and matching note/judgment totals
  are calculated; unsupported or incomplete inputs remain unchanged. Revisit
  already-applied zero records without incrementing counts; full-import coverage
  remains authoritative. Positive source Grd takes precedence over calculation.
- Record projection and history receipts commit together. Full-import coverage and
  receipts prevent overlap and retries from increasing counts twice. Official play
  timestamps have minute precision: an overlap in the full-import minute is treated
  conservatively as covered. Use chart play dates for score improvements, actual
  sync observations for Grd/Rating history. Preserve privacy and existing layouts;
  do not add per-score source badges. See [deployment and checks](../operations/recent-record-projection/README.md).
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
- A newly registered chart gets its official level as the constant, except Real:
  a new Real chart stores no constant (the ◆ level does not determine it) until an
  operator fills it. Syncing never overwrites an existing constant.
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
  follow the user's explicit override.
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
- Every announcement carries one category (`UPDATE`, `MAINTENANCE`, `DATA`,
  `NOTICE`; default `NOTICE`) separate from placement. The category renders as an
  inline outline tag before the title (24px, 1px `border/default`, `radius/control`,
  `metadata` text in `content/subdued`, no colour) on Home, the archive and the
  detail page; long titles wrap under the tag. Maintenance in progress is still
  signalled by `MAINTENANCE_MODE`, not by the tag.
- The public archive filters by one category through `?category=<lowercase>` (unknown
  values fall back to all). Active critical announcements are pinned above the dated
  list on page 1 of the matching filter and are left out of the dated list; page count
  ignores them. The detail page links the previous (older) and next (newer)
  announcement in publication order across all categories (2026-09-18).
- Home/archive announcement reads carry metadata
  and body-validity checks only; bodies are cached per announcement for detail.
  Both caches share announcement invalidation. Publication and critical-period
  checks run at read time, preserving scheduled visibility and expired history.
- Admin announcement saving keeps the existing rules (slug and all three
  translations are required even for a draft). The editor fills an empty slug
  from the English (else Korean) title on save; "임시저장" / "비공개로 전환" saves
  unpublished, "게시" / "업데이트" saves published (2026-09-18).
- Community events (2026-09-18): signed-in users with at least one completed
  data sync may write. A post has a working copy and an approved public copy.
  Save = draft (a change request stays a change request until resubmitted);
  "게시 요청" = pending review. Admins approve (working copy becomes public; first
  approval date kept), request changes (public copy stays) or reject (the whole
  post is taken down and can no longer be edited or resubmitted). Change request
  and rejection need a reason, shown at the top of the author's edit screen.
  The period is Korean dates; an event is live from the start date 00:00 KST
  until the end of the end date. Tabs: live (ending soonest first), upcoming
  (starting soonest first), ended (most recent first). Authors can delete their
  own post in any state, including a public one (it leaves the list and Home at
  once); the cover image file is removed only when it is in the author's upload
  folder and no other post uses it. Public events are listed in the sitemap.
- Announcement and event bodies may include images uploaded through the editor
  (JPG/PNG/WebP, 4 MB, shared hourly upload limit) to the public store under
  `announcements/{admin}/image` or `events/{author}/image`. The renderer shows only
  images from those folders on our public store; other image URLs are dropped.
  Uploaded body images are not deleted when a post is edited or removed (unused
  files may remain).
- Preserve original/source language and public publication state for announcements;
  optional translations are not fabricated. Official NOSTALGIA news links remain
  distinguishable from NosLog announcements.
- Feedback/error reports preserve target/context and optional private proof. Report
  submission is not public publication of the image. Prevent duplicate submission
  and provide actionable upload/save errors without exposing internal diagnostics.
- Feedback replies (2026-09-18): an admin may add a reply when resolving a report.
  The reporter sees their reports (status received / resolved, reply) under "My
  reports" in the feedback dialog; unread replies show a dot on the menu's feedback
  entry and on the tab, cleared when the list is opened. Reopening keeps the reply.
- The general feedback form records a type — `bug` (problem report) or `idea`
  (suggestion) — and accepts any non-empty text up to 1,000 characters (no minimum
  length, 2026-09-18). Arcade reports keep their own 10–1,000 character rule and have
  no type. Reports made before this change keep an empty type.
- Keep not-found, recoverable error, maintenance and fatal recovery distinct. Retry
  must preserve safe context. Missing/unauthorized resources must not leak existence
  or private details. These states do not authorize changes to preserved viewers.

## Polls on posts (2026-09-23)

- A poll belongs to one post (announcement or community event); it is stored beside the post,
  not inside the body, and is rendered at the end of the published post.
- Question and option texts are translated rows. Announcements are written in ko/ja/en; an event
  keeps only the locale it was written in. Readers get their locale, then Korean, then whatever exists.
- Options keep the author's order, 2 to 20 of them. Two options cannot share the same text in one locale.
- Single-choice polls record the vote on click; multiple-choice polls submit with a button and respect
  the optional maximum. A vote is one (option, user) pair, so one account cannot count twice.
- Signed-out readers see results only; voting asks them to sign in. Results visibility follows the poll
  setting: always, after voting, or after it closes.
- Once any vote exists, the question, the options and the way of choosing are locked; only the deadline
  can change, and options can be added if the poll allowed it. After the deadline nothing can change, and
  votes are refused. Deleting the post deletes the poll and its votes.

## User contributions (2026-09-23)

- Two roles only: **contributors** (any signed-in user) and **admins**. There
  is no reviewer role; only admins apply or publish. Contribution levels
  (「기여 Lv.1–6」, later stage) are a reward label and never unlock
  permissions.
- Stage 1 — chart info suggestions for BPM, note count, length and release
  date. A suggestion carries a value plus evidence (video or official link, or
  a note for "checked myself"). It must differ from the current value. One
  pending suggestion per user · chart · field (resubmitting replaces it); at
  most 30 new suggestions per user per 24 hours. Level constants stay
  admin-only.
- Admin review (`/admin/contributions`, existing admin look): apply writes the
  chart value, a `chart_field_sources` row (`source = "contribution"`, linked
  to the suggestion) and marks it applied in one transaction; reject needs a
  reason that the author can see. Several suggestions can be applied or
  rejected at once. Suggestions whose current value changed since they were
  made are flagged.
- Stage 2 — contribution points (2026-09-24). Points are written to
  `contribution_points` when a contribution is accepted, one row per source and
  never removed except with the account: applied suggestion 1, resolved arcade
  report 1 (reopening and resolving again does not add more), cabinet check 1
  per Seoul day. Awarding never blocks the underlying action. Levels 1–6 at
  1 · 10 · 30 · 100 · 300 · 1,000 points; admins show 「운영자」 instead.
  Names in rankings, opinions and replies show the label from level 3; the
  profile shows it from level 1 with a public 「기여」 section (level, points,
  counts) and, for the owner only, their suggestion list with rejection reasons.
- Stage 3 — user chart drafts and timestamped comments (2026-09-24). One draft
  per user · chart (`chart_drafts`): it starts from the published chart, or an
  empty chart when none is published (an empty chart, here and in the admin editor, starts its timing at
  500 ms so notes on 1마디 1박 are seen falling — 2026-09-25), and only its author and admins can see
  it. Draft → 「검토 요청」 (locked; the author can withdraw) → admin
  「수정 요청」 or 「공개」. Size limits: 20,000 notes, 1,000 timing points,
  30 minutes. Saving uses the draft version, so a stale window gets a conflict
  instead of overwriting. A request with overlapping notes is refused.
- Publishing (admin only, one transaction): unpublished admin editor changes
  are first kept as a revision, then the draft becomes the published chart,
  a `contribution` revision records the draft and its base published version
  (「· 기준 vN」 / 「· 새 채보」), the chart author (`author_id`) is set and the
  author gets 20 points once per published version. Reopening a published
  draft starts again from the current published chart.
- Timestamped comments (`chart_comments`): on a published chart anyone signed
  in can comment (500 characters, 50 per 24 hours); on a draft only its author
  and admins. Authors can delete their own comment until it is resolved. Only
  admins resolve (+1 point when the writer is not an admin, published-chart
  comments only) or hide. Comment times link to the viewer as `?t=` in seconds.
- The public viewer credits the author with their name label (level 3+, or
  「운영자」) and names the publishing admin in 「출처」. 「영상에서 추출」 follows
  the published chart's lineage: a contribution inherits it only through its
  base version, so a chart started from empty never shows it.
- The editor stays wide-screen only (1056+). Narrower screens get a notice with
  「주소 복사」 instead of opening it.

## Chart import from video extraction (2026-09-23)

- The admin chart editor can import a vid2bmap result zip (Kim Yeonghun · Choi Sunghee, KAIST,
  MIT) as a preview. Nothing changes until "초안에 넣기"; it writes the draft only (publishing
  stays separate), saves the current draft as a revision first, and is undoable. Videos and
  frames never reach the site — extraction runs on the operator's own computer.
- Notes are placed by beat lines, not video time: a note's beat is its position between the
  neighbouring bar lines the game draws each beat (one line = one beat of the active time
  signature). Only the first bar line's beat is chosen by a person; when the draft already has
  notes it starts at the position that agrees with the most of them.
- Snap to the suggested grid (smallest average offset per grid step), chosen again per beat
  (2026-09-24 C): a beat keeps the song grid only when every note in it is within 2.5 video
  frames and no two notes more than that apart land on one spot; otherwise the coarsest grid
  from 1/2 to 1/16 that does both (e.g. a 1/8-beat run inside a 1/6-beat song), and if none
  does, notes off the song grid keep their video position. Tenuto and trill lengths use the
  grid of the beat they end in, and the end is put on that grid. Moved notes can be selected for
  review after import. Notes that clash on one spot are then re-snapped finer (×2 … ×8, e.g. a one-frame staircase at 180 BPM needs 1/24). Same-lane reads
  within 3 frames are one note, and so are two reads of the same kind within 3 frames where one
  lane range contains the other (the wider is kept — vid2bmap sometimes reads a note again one
  frame later, narrower).
  Hands come from the zip when it carries them (2026-09-24: the runner takes notes and bar lines
  from the main vid2bmap run and only the hand from the `LR_classification` branch run, matched
  by kind, lanes and nearby frame); otherwise they are guessed by lane centre, and only guessed
  centre notes are selected for review. Glissando pieces (vid2bmap reads each rung) are joined
  into one glissando when the next piece is within 12 frames and 4 lanes (2026-09-24); the path
  keeps the start, end and bends over 1 lane, one rung per piece plus rungs vid2bmap skipped
  (gaps at least twice the usual, counted down) — one rung = one judgement, and the game's rung
  spacing is not a clean grid (Gaia 180 BPM ≈ 1/9 beat), so the spacing is the first-to-last span
  divided by that count and bends sit on rungs (note counts match the result screen for all three
  checked songs: Altale 1,604 · アルストロメリア 1,394 · Gaia 1,539), a lone piece is
  dropped, and a standard note on the path is taken as a rung read twice and dropped. A trill's
  head width w becomes two positions of width w-1 one lane apart (the video's hexes alternate
  one lane within the head, 2026-09-24) and is flagged.
  When the zip carries hands for at least half its notes, notes whose hand was not read and that
  look like extraction ghosts are dropped before import and listed in a warning with their
  places (2026-09-25 F1′, checked against the videos by the combo counter): a tenuto of 8 beats
  or more that overlaps another note, and a standard note inside a tenuto's lanes within ¾ of a
  beat after its head. Notes whose hand was read are never dropped. When the chart has a note
  count, the panel compares it with the import's judgement count (one per note, one per
  glissando rung).
- Against an existing draft every difference is listed (same tick, overlapping lanes = same
  note; otherwise the same lane, width and type within 1/8 of a quarter = the same note moved;
  a hand read from the video counts as a difference, a guessed hand does not) and chosen
  per place; notes after the draft are a separate
  new-section toggle. An import that would create overlapping notes cannot be applied; the
  footer names the first places where an imported note overlaps.
- Snap check in the editor (2026-09-24 C, like osu!'s "Unsnapped hitobjects" check): a note
  whose start is off every editor snap (1/1–1/32 of the active beat) gets a dashed warning
  outline, and the note inspector lists them with the nearest grid and offset in ms, one by one
  or all at once to the nearest grid.
- Tempo changes become proposed timing points (2026-09-23 T2): the result zip carries
  `beat_frames.json` — frames where bar lines crossed one grid row, before vid2bmap's
  frame-drop correction — and the tempo is measured from those (the corrected bar lines
  jitter ±10%). Beats are counted on the AI bar lines the notes use (2026-09-25): when the zip is
  read, a gap of 1.5× the neighbours or more gets the raw bar line inside it, or, when neither has
  one, even lines from 1.8× (below that it may be a fermata); a line under half a beat from its
  neighbour with no raw line is dropped; the import panel says where 「AI 가 놓친 박자선 ○곳을
  메우고 …」. Each AI line is paired with its raw frame (within 35% of a beat, following the offset
  that frame-drop correction shifts); unpaired beats share the raw time between their paired
  neighbours evenly. A change is a shift of more than 1.5% in the trimmed mean of 8 beats that
  lasts at least 8 beats; each section's BPM is measured by a straight-line fit over all its beats (shared slope, separate offsets across steps where
  the beats jump by more than 1.5 frames; sections under 32 beats use the first-to-last average), then the first of whole →
  0.5 → 0.1 → 0.01 whose beats stay within the video jitter + 0.5 frames to the section end is proposed (2026-09-25 B′),
  with the measurement shown. The start BPM is proposed only when the current one drifts past that limit.
  Where the video moves beat by beat (2026-09-25 B) — two beats together off the section BPM by 2.5 frames or
  more, sections under 32 beats, or a beat drifting 2.5 frames from the video — the beats are chained with the
  longest whole BPMs that keep every beat within 1.5 frames (the one that ends a run is picked by the next 16
  beats), then the section BPM resumes; the points of one such place share a card (「17마디 3박 — 2박 느려짐」,
  「45마디 3박 ~ 48마디 2박 — 박마다 바뀜」) showing the beat intervals in frames. No song-specific values.
  Timing points start a new measure, as in osu!, so a card whose last point is mid-bar also puts a point with the
  same BPM on the next downbeat of the song's bars (the timing before import, with the proposed start meter) unless
  another point comes first (2026-09-25 마) — 「… · 49마디 1박 마디선 맞춤」 on the card.
  When the draft has timing points besides the start and they miss the video (a beat more than 2.5 frames off after
  removing the average offset), a card offers 「기존 타이밍 포인트를 영상 타이밍으로」 (2026-09-25 B): proposals are made
  as if only the start point existed and the others are removed with the import (one undo step; the start point and
  its time stay). On by default only when the draft has no notes; off keeps them and says which proposals they block.
  Proposals
  replace the bar-interval BPM warning, are on by default, add the point at the beat with the
  previous time signature, and go in with the notes in one undoable step. No proposal where a
  timing point already exists; older zips without beat frames keep the warning only.
  The start timing gets the same kind of proposal (2026-09-24 A) when the first section — measured
  over its whole length, not the first beats — differs from it: 「시작 타이밍을 BPM ○ 로」, on by
  default only when the draft has no notes (changing the start BPM moves every existing note in
  time); it changes only that point's BPM, like editing it, and goes in with the notes. The offset
  (start time against the audio) cannot come from the video; when the start time is 0 ms the same
  card offers 「시작 시각을 500ms 로」 (2026-09-25 B, the new-draft default), on by default only when
  the draft has no notes, moving every timing point by the same amount. The meter is proposed in the same
  card (2026-09-24 A): the game draws the same line every beat, so accents at beat heads (notes
  within 3 frames, tenuto/trill starts ×3) are compared for 3- and 4-beat cycles; 「박자를 ○/4 로」
  shows 뚜렷함/약함 (clear = score ≥ 0.15 and twice the other) and is on by default only when
  clear and the draft has no notes. With it on, an empty draft's first bar goes to the strongest
  accent (measure 1 = last downbeat at or before the first note), so a song that does not start on
  a downbeat lands right (Altale: first note 1마디 3½박).
- Provenance (2026-09-24 C2): right after an import the editor saves a revision with
  kind `vid2bmap`. A published chart whose published revision number is at or after the first
  `vid2bmap` revision shows "노트 배치 · 영상에서 추출(vid2bmap)" and a sources dialog (vid2bmap,
  its authors, MIT, paper and repository links). The byline is the publisher's username with the
  operator tag when their role is admin. The viewer never reads draft content.

## Official X news (2026-09-19)

- Home reads the persisted latest post and successful ko/en translations through the data cache; it never calls X or Gemini. New posts are checked every 12 hours outside page rendering using `since_id`. Successful translations have no time-based expiry.
- Unchanged content is not rewritten or retranslated. A DB execution claim still changes once per UTC half-day to prevent concurrent/duplicate paid calls. Failed translations retry on the next scheduled run; existing raw content remains available.
- The latest post only is retained, not a historical archive. Incremental polling does not automatically reconcile deletion, privacy changes, or edits that are not returned by X.
- Hobby deployments use GitHub Actions; see [setup, verification SQL and limitations](../operations/official-x-sync.md).

## Visit analytics (2026-09-20)

- Within the loaded dashboard period, metric changes reuse the same snapshot and
  update `metric` in browser history without another server request. Period changes
  and page reloads fetch a new snapshot. Direct links, back/forward navigation,
  admin authorization and today's hourly chart remain supported. Today's hourly
  bars follow the selected metric: page views from the hour bucket, signups and
  syncs from their existing timestamps (Seoul hour). Visitors are counted per day
  only, so today keeps the empty hourly frame with a centered note (2026-09-22).

- Accounts whose current role is `admin` are excluded at collection time from
  page views, daily visitors, hour/audience buckets, browser external events and
  API-call totals. Dashboard signup, sync, funnel and contribution totals also
  exclude current admins; operational queues and failure monitoring do not.
  Existing aggregate visit rows cannot be retroactively separated because they
  intentionally contain no account identifier (2026-09-21).
- Counted totals only, never who visited. A page view increments the day total, the
  route total, the Seoul hour bucket (`hour`, `00`–`23`) and the signed-in split
  (`audience` / `audienceVisitor`, `member` | `guest`). The signed-in flag comes from
  the session cookie; no account id is stored. Daily visitor hashes still expire the
  next day and totals after 90 days.
- The privacy policy lists the retained totals, so adding a new breakdown requires a
  new effective version (archive the current copy under
  `features/privacy/content/versions/{effective}.json`). Hourly buckets and the
  signed-in split were announced in the 2026-09-20 version.
- Dashboard panels that use existing tables only (conversion, contributions) collect
  nothing new. Real-time presence and error trends need extra storage; they are out.

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

## Achievements (2026-09-24)

- Tiered achievements judged automatically from synced records and site activity. Five grades — bronze I ·
  silver II · gold III · platinum IV · diamond V (2026-09-25) — and each achievement has its own set of
  grades: all five, only bronze · silver · gold, or a single diamond for a very rare one. The stored tier is
  the grade. There are no hidden achievements and no conditions based on play counts, sync counts, streaks
  or luck, and no bingo achievement (bingo cells are ticked by players themselves). Definitions and
  thresholds live in code (`features/achievements`); they can be tuned again from the production
  distribution.
- Judging runs at the end of every sync, after records and Grd are updated. It only adds newly reached
  tiers (`user_achievements`, one row per user · achievement · tier) and never removes a tier, even if the
  value later drops. The only exception is the admin 「업적 다시 판정」 with 「기준에 못 미치는 단계도 빼기」
  checked (2026-09-25, off by default, used after thresholds change): it removes tiers of removed
  achievements, grades an achievement no longer has, and tiers whose current value is below the threshold. A failed judgement never fails the sync. Achievements that come from activity
  (opinions, helpful marks, pattern ratings, exams) are also picked up at the next sync.
- The date of a tier is when NosLog confirmed it (the sync time), not when it was played.
- Rarity is shown as the number of players who reached each tier, only on the achievement page.
  No player list.
- The profile head shows up to three achievements the owner chose (`user_achievement_showcase`), or the
  highest tiers automatically when none are chosen. They are chosen in Settings → Profile (2026-09-25) and
  saved with the rest of the profile form; only earned achievements, at most three, in the chosen order.
  An invalid choice blocks the whole save. The achievement list itself has no pin controls.
- Profiles with private scores: other people do not see skill or collection achievements (they reveal
  record ranges); challenge and community achievements stay visible. Progress values are shown only to the
  owner.
