# NosLog 2.0 Exam Page Brief

## Document Control

- Status: `Approved`
- Decision status: `Complete Exam-family contract approved: independent Basic,
Recital, and Event modes; official requirements; mode-specific score semantics;
supported practice analysis; permanent Event reference; Basic/Recital proof and
certification; proof evidence, review, privacy, and retention; URL restoration;
responsive behavior; accessibility; localization; viewer/editor preservation boundary;
and browser acceptance`
- Evidence status: `Repository, schema, seed, current-interface, and authenticated
workflow inspection; NOSTALGIA official guidance; original Basic and Recital result
recordings; approved information architecture and related page briefs; cited
rhythm-game exam, task, tabs, file-upload, security, responsive, accessibility, and
internationalization references; and the user-approved decision record`
- Date started: 2026-08-03
- Last decision update: 2026-08-03
- Language: English
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Related contracts:
  [03-home-page-brief.md](./03-home-page-brief.md),
  [04-shared-discovery-page-brief.md](./04-shared-discovery-page-brief.md),
  [05-music-detail-page-brief.md](./05-music-detail-page-brief.md), and
  [09-profile-page-brief.md](./09-profile-page-brief.md)
- Scope: Localized public Exam entry and selected-Exam routes, permanent Basic,
  Recital, and Event reference, signed-in score-based practice analysis where the data
  is trustworthy, Basic/Recital achievement proof, private moderator review, and
  Profile certification outcome
- Excluded: Administrator Exam-definition editor redesign, final moderator-interface
  composition, automatic official Exam-result synchronization, Event certification,
  unsupported Recital practice prediction, final Foundation tokens, final
  high-fidelity composition, production implementation in this session, and Recital
  chart authoring or rendering

## Decision Labels

- **Observed:** Verified in the repository, current browser evidence, official game
  evidence, or an approved upstream artifact.
- **Approved:** Explicitly agreed with the user and authoritative for downstream
  design.
- **Proposed:** Evidence-based direction awaiting user approval.
- **Open:** Requires further research, testing, or a user decision.
- **Rejected:** Considered and explicitly not selected.
- **Superseded:** Replaced by a later approved direction.

This brief is authoritative for the Exam family's content, scoring meaning,
interaction, certification, privacy, responsive behavior, states, and acceptance
criteria. Exact typography, color, spacing, radius, elevation, stage-card treatment,
control dimensions, grid tracks, proof-preview styling, and content-driven transition
values remain Foundation and active high-fidelity design work. Later visual work may
refine expression but must not remove or reinterpret this product contract.

## Purpose

The Exam family answers four ordered questions:

> Which official NOSTALGIA Exam am I inspecting, what must be achieved in one ordered
> run, what can my synchronized records safely tell me about preparation, and how can
> I record an eligible Basic or Recital pass in NosLog?

It is a public official-reference and preparation surface with an optional private
certification workflow. It is not a Tier list, a Bingo checklist, a generic score
calculator, an official live Exam-state mirror, or a promise that independent Music
bests equal a successful sequential Exam run.

## Primary Context and Success

- **Approved upstream:** Exams remain an independent NOSTALGIA destination. They must
  not be grouped with Tier lists or Bingo under a fabricated umbrella label.
- **Approved:** Mobile use around an arcade session is primary. Users must be able to
  choose an Exam, read all three stages and cumulative conditions, and inspect or
  submit proof without unnecessary mode changes or two-dimensional page scrolling.
- **Approved:** A signed-out visitor succeeds when they can inspect every published
  Basic, Recital, and Event Exam, including eligibility Grade, NOS fee, rewards,
  ordered stages, allowed charts, and pass conditions, without fabricated personal
  state.
- **Approved:** A signed-in visitor succeeds when they can additionally understand
  eligibility, use only supported practice analysis, inspect certification state, and
  submit recoverable proof for an eligible Basic or Recital Exam.
- **Approved:** Desktop remains required. Additional width should improve simultaneous
  comparison of official conditions, stages, analysis, and proof state rather than
  preserving a fixed approximately `390px` shell.
- **Approved:** Current styling and geometry are audit evidence, not NosLog 2.0 visual
  authority.

## Current-Product and Domain Evidence

### Official NOSTALGIA Evidence

- **Observed:** NOSTALGIA defines three Exam classes: promotion Exams in `Basic` and
  `Recital`, plus special `Event` Exams.
- **Observed:** An Exam is entered from the play-mode flow and is available only at the
  beginning of a three-tune play context.
- **Observed:** Every displayed stage condition must be met. Failure at an intermediate
  condition ends the Exam; independent best scores from different plays do not prove a
  successful Exam run.
- **Observed:** Basic uses score conditions. The seeded promotion Exams use a first
  single-stage threshold followed by cumulative thresholds for the first two and all
  three tunes.
- **Observed and user-confirmed:** Recital evaluates four performance categories at up
  to `10` points each, for `40` points per Music performance and `120` across three
  tunes. Seeded Recital promotion conditions are cumulative.
- **User-confirmed:** The eight seeded Event Exams are permanent/always available in
  NosLog's reference context. They are not separated into current and historical
  catalogs.
- **Observed:** Original Basic and Recital pass recordings show a final summary with
  Exam identity, per-tune values, total condition, and a `合格` seal. The game player
  name remains visible in the upper-right HUD, allowing one complete frame to support
  a proportionate manual fan-service review.

### Repository and Data Evidence

- **Observed:** The localized public route is currently `/[locale]/exams`; active mode
  and selected Exam exist only in client state.
- **Observed:** The import defines `28` Exams: ten Basic promotion Exams, ten Recital
  promotion Exams, and eight Event Exams. Every Exam contains ordered `1st`, `2nd`, and
  `Fin` stages.
- **Observed:** `Exam`, `ExamStage`, `ExamStageChart`, and `ExamReward` preserve mode,
  scoring type, Grade, fee, required official Grade, stage conditions, multiple allowed
  charts, and multiple rewards.
- **Observed:** Published definitions are shared cached data. User play records,
  achievements, and submissions are fetched outside that shared cache.
- **Observed:** Current Basic analysis sums chart bests from independent plays and can
  compare them with cumulative conditions. It does not represent one official Exam
  attempt.
- **Observed:** Current Recital stage bests are unavailable because synchronized
  `PlayData` does not provide the required Recital point details.
- **Observed issue:** Score-type Event Exams have compatible score data but current
  analysis is limited by the UI to Basic mode.
- **Observed issue:** When an Event stage allows multiple difficulties, the current
  card links to the first allowed chart. This arbitrarily chooses one permitted chart
  and can misrepresent the official choice.
- **Observed:** `User.nostalgia_name` stores the synchronized in-game player name. The
  moderator submission query already retrieves it together with the private proof and
  Exam identity.
- **Observed:** `ExamSubmission` holds private proof, review state and notes;
  `ExamAchievement` stores approved achievements. Legacy `exam_basic` and
  `exam_recital` values are still read for compatibility.
- **Observed issue:** The client currently uploads immediately after file selection,
  without an explicit preview-and-confirm step.
- **Observed issue:** The visible UI omits proof from Event Exams, but the current
  server availability function does not explicitly reject Event proof.

### Current Interface and Browser Evidence

- **Observed:** The current page exposes Basic, Recital, and Event as top mode tabs,
  then uses one Exam selector and one selected-Exam detail.
- **Observed:** Basic can show a user-controlled advice switch, eligibility/fee/reward
  details, three stage cards, derived gaps, and proof upload.
- **Observed:** Recital shows official cumulative point conditions and proof upload but
  no personal analysis.
- **Observed:** Event shows permanent stage and reward reference, supports stages with
  several allowed difficulties, and omits proof.
- **Observed:** The current interface remains close to a narrow mobile column on wide
  screens. Current successful reflow is not evidence that long multilingual content,
  proof states, or the approved 2.0 hierarchy have been validated.

## Approved Scope and Invariants

1. Basic, Recital, and Event remain separate official modes in one Exam family.
2. Show one selected Exam at a time. Do not expose ten Grade buttons or every Event as
   persistent top-level controls.
3. Official requirements always take priority over personal analysis and proof.
4. Preserve exact ordered stages, allowed charts, scoring type, single/cumulative
   conditions, required official Grade, NOS fee, and reward meaning.
5. Personal analysis is labeled and treated as `Practice analysis`; it is never an
   official attempt result or pass forecast.
6. Basic and score-type Event analysis may use synchronized independent bests with an
   explicit limitation. Recital and Recital-point Event analysis remain absent until
   reliable Recital detail exists.
7. Event Exams are permanent public reference content and never create NosLog Exam
   certification, proof submissions, or Profile Exam titles.
8. Basic and Recital certification is based on private one-image manual proof review.
9. A higher approved Grade in a mode implies completion of easier Grades in that same
   mode. NosLog presents the highest approved official Exam title rather than a stack
   of every lower title.
10. `ExamAchievement` or its normalized successor is the authoritative certification
    source. Legacy `exam_basic` and `exam_recital` are migration/compatibility inputs,
    not parallel authorities.
11. The complete existing chart viewer/editor is outside this brief and remains
    unchanged under document `07`; Exam requirements do not create future chart work.

## Approved Information Hierarchy

Use one semantic `main` and the following mobile-first source order:

1. page identity and concise Exam explanation;
2. Basic/Recital/Event mode control;
3. selected-Exam control and selected Exam identity;
4. official entry information: required Grade, fee, reward, availability and approved
   certification state where applicable;
5. ordered three-stage official requirements and allowed charts;
6. supported signed-in Practice analysis;
7. contextual Basic/Recital proof state and action.

Official facts must remain understandable when analysis or proof is absent. Practice
analysis and proof are subordinate utilities, not competing dashboard summaries.

## Navigation, Selection, and URL Contract

### Entry and Selected Routes

- Keep `/[locale]/exams` as the stable family entry.
- Give each published Exam a stable `/[locale]/exams/[slug]` destination.
- Selecting an Exam must update navigation/history to its stable destination rather
  than remaining only in ephemeral component state.
- The active mode is derived from the selected Exam. Mode changes expose that mode's
  compact Exam selector and a deterministic published selection; they do not create a
  second contradictory hidden selection.
- Browser Back restores the previous mode, selected Exam, analysis disclosure, and
  useful reading position when feasible.
- Direct links and refreshes reproduce the same selected Exam and official content.

### Mode and Exam Controls

- Basic, Recital, and Event are the only top-level mode choices.
- Use one accessible exclusive mode control. If tabs are used, implement complete tab
  keyboard and controlled-panel semantics.
- Use one compact Grade/Event selector such as a select, combobox, or popover. Its
  exact visual form remains Foundation/active high-fidelity design work.
- Options communicate Grade/Event identity and concise eligibility or achievement
  state without turning the control into a wall of badges.
- Do not hide official Exams that the current user cannot yet enter. Eligibility
  affects personal action, not public reference access.

## Official Exam Information Contract

### Entry and Reward Context

Every selected Exam displays:

- official mode and Exam title;
- required official Grade;
- the user's current relevant Grade only when signed in and available;
- NOS fee;
- official reward or promotion outcome;
- ordered three-stage requirement summary;
- current NosLog certification status for Basic/Recital when signed in.

Do not collapse Grade eligibility, NOS fee, reward, and certification into one generic
`status`. These are different questions.

### Stage Contract

Each stage preserves:

- `1st`, `2nd`, or `Fin` sequence position;
- original Music title;
- artist where useful;
- every allowed difficulty and level;
- whether the threshold applies to that stage alone or cumulative performance;
- exact required score or Recital points;
- an unambiguous Music-detail path that does not silently choose the first allowed
  chart when several are valid.

When several difficulties are allowed, show the complete set and route to a Music
context where the permitted set remains understandable. Do not imply that the lowest
or first stored chart is the official default.

## Mode-Specific Scoring Contract

### Basic

- Display score values with locale-aware separators and no unit that could be confused
  with Recital points.
- Preserve the official threshold sequence exactly. Seeded promotion Exams use a
  first-tune threshold, first-plus-second cumulative threshold, and three-tune total.
- Practice analysis may compare each chart's synchronized best score with an implied
  per-stage preparation target and official cumulative thresholds.
- A prominent plain-language limitation states that these bests come from independent
  plays and do not prove the player can pass all stages in one Exam run.

### Recital

- Explain the scoring model as four evaluation categories × `10` points = `40` points
  per tune, `120` points across three tunes.
- Preserve cumulative thresholds such as `24`, `52`, and `84` without converting them
  into Basic score or percentage semantics.
- Do not fabricate per-category or per-stage personal values when the synchronization
  source does not provide them.
- Omit the Practice-analysis module instead of rendering a misleading zero, disabled
  calculator, or Basic-score substitute.
- When a future reliable Recital source exists, add a separately researched and
  approved Recital analysis; do not automatically reuse Basic logic.

### Event

- Treat all eight seeded Events as permanent/always available reference content.
- Do not add date ranges, ended badges, current/archive grouping, or a historical
  mode selector.
- Preserve each Event's actual scoring type. Score Events may use the approved Basic
  score-analysis model; Recital-point Events follow the Recital no-analysis rule until
  reliable data exists.
- Show every permitted difficulty and every Music-unlock reward.
- Event never exposes proof, certification, Profile title, or achievement state.

## Practice Analysis Contract

- Show only for a signed-in user and an Exam/scoring type supported by synchronized
  data.
- Label the module `Practice analysis`, not `Pass probability`, `Expected result`,
  `Simulation`, or another phrase that implies an official attempt.
- Keep it secondary to official conditions and user-controlled when the amount of
  detail would otherwise dominate the page.
- It may include stage best, preparation target, shortfall, cumulative comparison,
  rank/FC/Pianist marker, Max Combo, and Miss/Near where supported.
- Note-type success rates may inform a concise practice cue only where the underlying
  data is valid; they must not be converted into an Exam pass claim.
- Never sum unavailable stages into an optimistic `0` or infer a Recital value from
  Basic score, judgement counts, or note-type success rates.
- The limitation about independent bests remains visible or programmatically adjacent
  whenever derived totals are shown.

## Certification and Achievement Contract

### Eligibility and Meaning

- Certification applies only to Basic and Recital promotion Exams.
- Proof submission requires authentication, a published Exam, an official Grade that
  meets the Exam's `requiredGrade`, no existing approved achievement at that Grade or
  higher, and no active pending submission.
- Public reference remains visible when the user is signed out or ineligible. Only the
  personal certification action is unavailable.
- Event proof is rejected on the server even if a client is modified to request it.
- Approved proof records a NosLog-verified fan-service achievement. It must not claim
  to be an official KONAMI certificate or cryptographic identity verification.

### Grade Inheritance and Profile Display

- An approved higher Grade implies all easier Grades in the same mode.
- Do not require separate proof or duplicate visible badges for implied lower Grades.
- Exam selectors may communicate implied completion, but the Profile shows the highest
  approved Basic title and highest approved Recital title only.
- Migration must reconcile legacy `exam_basic`/`exam_recital` with normalized
  achievements without downgrading an already recognized user.
- Do not allow the legacy and normalized sources to disagree silently. Complete the
  migration and then treat the normalized source as authoritative.

## Proof Evidence Standard

### Required One-Image Content

One image must show all of the following in the same readable frame:

1. the final three-tune Exam result, not an individual Music result or intermediate
   stage screen;
2. `Basic` or `Recital` mode;
3. the submitted Grade;
4. the final `合格` mark; and
5. the NOSTALGIA player name in the upper-right HUD.

The visible game player name must match the user's latest synchronized
`nostalgia_name`. Compare it with the private moderator record, not the public NosLog
username. Public `hide_nostalgia_name` preference does not hide this private review
fact from authorized moderators.

If the player changed their NOSTALGIA name, instruct them to synchronize again before
submitting. A missing, illegible, or materially mismatched name is rejected with a
specific reason and a resubmission path.

### Permitted and Rejected Image Treatment

- A full cabinet or keyboard photo is not required.
- Cropping is allowed only when every required result and identity region remains
  readable in one frame.
- Rotation, perspective correction, and ordinary compression are allowed.
- Image stitching, replacement of result/name content, or covering a required region
  is not accepted.
- Do not require an embedded date, camera metadata, or EXIF. The achievement is not
  time-limited and the official final result does not expose a reliable date.
- This is proportionate manual moderation, not fraud-proof identity verification. Do
  not add a two-image, video, handwritten-code, or full-cabinet requirement without a
  new evidence-backed approval.

## Proof Submission and Review Contract

### Choose, Preview, and Submit

- Accept one `JPEG`, `PNG`, or `WebP` image up to `4 MB`.
- File selection enters a local preparation state and displays a readable preview,
  filename/type/size summary, replace action, and explicit submit action.
- Do not upload immediately when the operating-system file picker closes.
- Before confirmation, state the five required visible elements, private review use,
  and six-month evidence-retention period concisely.
- Cancel or replace before submit must not leave an owned orphan Blob.

### Upload and Review States

The workflow distinguishes:

1. not submitted;
2. file selected/preparing;
3. uploading and finalizing;
4. pending manual review;
5. approved;
6. rejected with moderator reason and resubmit action; and
7. recoverable upload or submission error.

- Disable duplicate submit while uploading or pending.
- If Blob upload succeeds but submission creation fails, delete the owned temporary
  Blob or expose a safe retry that cannot create duplicate submissions.
- Replacing a rejected submission removes or supersedes the old rejected evidence
  according to the approved retention policy; do not accumulate an unbounded visible
  stack in the user flow.
- Approval creates or updates normalized achievement state and applies Grade
  inheritance.
- Rejection never removes an earlier higher approved Grade.

### Privacy, Authorization, and Retention

- Store proof in private Blob storage. Never expose a public object URL.
- Only the submitting user may see their submission state; only authorized moderators
  may view the private image and review identity.
- Validate authentication, ownership, Exam type, eligibility, pending/approved state,
  MIME type, size, and owned private path on the server. Client `accept` is only a
  convenience.
- Use generated server-controlled storage paths and do not trust user-provided
  filenames as object authority.
- Preserve reviewer reason for user recovery while it is retained; do not expose
  internal moderator-only notes publicly.
- Delete approved evidence and sensitive review notes six months after review while
  retaining the achievement. Delete rejected evidence according to the existing
  six-month privacy rule. Account deletion removes submissions, private images, and
  achievements according to the product privacy contract.

## Authentication and Permission Contract

### Signed Out

- Show complete public Exam reference.
- Omit fabricated player Grade, personal bests, practice analysis, achievement, and
  submission state.
- Provide at most one contextual login action where certification would otherwise
  begin; do not repeat disabled proof controls for every Exam stage.
- Preserve locale and selected Exam after successful login.

### Signed In

- Show the relevant synchronized official Grade when available.
- If no Grade/sync data exists, explain that data synchronization is required for
  eligibility and player-name comparison; do not fabricate zero.
- If Grade is below the requirement, keep reference content readable and state the
  concise personal reason the proof action is unavailable.
- If achieved, show approved state instead of another upload action.
- If pending, show review state and block duplicates.
- If rejected, show the user-facing reason and one resubmit path.

### Missing and Unauthorized Resources

- Draft, deleted, or unknown Exams do not leak private definitions.
- A direct unknown slug returns the localized not-found contract, not a silent default
  to another Exam.
- Authorization expiry during upload preserves the local selection where safe and
  provides a locale-preserving login/retry path.

## Loading, Empty, Error, Disabled, and Destructive States

| State                       | Required behavior                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------- |
| Initial definition loading  | Preserve page identity and show shape-stable selected-Exam/stage placeholders without fabricated values |
| Mode has no published Exams | Show one concise localized empty message and keep the other modes usable                                |
| Selected Exam not found     | Use localized not-found behavior; do not silently open a different Exam                                 |
| Personal data loading       | Keep official reference stable; update only personal eligibility/analysis/proof regions                 |
| Signed out                  | Omit personal values; preserve public reference and one contextual login path                           |
| No synchronized Grade/name  | Explain sync requirement in the personal action context; do not show `0` or an empty proof picker       |
| Official Grade insufficient | Keep official content; disable only certification and state the requirement concisely                   |
| Unsupported analysis        | Omit the module or provide one concise explanation; never show a fake zero analysis                     |
| Slow supported analysis     | Keep official content readable and mark only the analysis region busy                                   |
| File selected               | Show local preview, requirements, replace/cancel, and explicit submit; no network upload yet            |
| Invalid type/size           | Identify the exact problem adjacent to the picker while retaining a recoverable selection path          |
| Uploading                   | Mark the proof region busy, prevent duplicate action, and retain stable page content                    |
| Pending review              | Show pending status and submission date if useful; do not offer duplicate upload                        |
| Approved                    | Show achieved status and inherited lower-Grade meaning; no upload action                                |
| Rejected                    | Show concise moderator reason and resubmit action without exposing internal notes                       |
| Upload/finalize error       | Keep or safely discard the preview according to ownership state and provide Retry                       |
| Private image expired       | Preserve achievement and explain to moderators that evidence was deleted by retention policy            |

No general page error should erase useful cached official reference when only personal
analysis or proof state fails.

## Responsive Contract

### Compact Layout

- Use `390px` as a representative review canvas, not a fixed product width.
- Reflow through `320 CSS px` without document-level horizontal scrolling.
- Keep one-column source order, compact mode control, compact Exam selector, official
  context, vertical ordered stages, optional analysis, and proof state.
- Do not force stage requirements into a wide comparison table. Cumulative
  relationships must remain explicit in text or connected cards.
- Long Japanese classical titles, translated titles, artists, score values, and review
  reasons wrap without fixed-height clipping.
- File preview remains contained and does not push controls beyond the viewport.

### Wide Layout

- Use additional width for meaningful comparison: selected-Exam navigation beside
  official detail, or official stages beside supported analysis/proof, when reading
  and keyboard order remain coherent.
- Do not promote every Grade/Event into a permanent button grid merely because width
  is available.
- Do not stretch three stage cards so far that Music titles and thresholds lose their
  relationship.
- Keep proof and personal analysis visibly subordinate to official requirements.

### Layout Semantics

- DOM order remains meaningful without CSS placement.
- Responsive movement does not duplicate controls or personal state in the
  accessibility tree.
- Use viewport breakpoints or container queries at content failure points, not device
  names or the legacy fixed mobile shell.

## Accessibility Contract

- Use one `h1`, ordered section headings, and an ordered list or equivalent semantic
  structure for `1st`, `2nd`, and `Fin`.
- The Basic/Recital/Event control exposes selected state, name, controlled content,
  and complete keyboard behavior for its chosen native/APG pattern.
- The Exam selector has a persistent accessible label, announces selected Exam and
  relevant eligibility/achievement context, and does not rely on visual badges alone.
- Single versus cumulative thresholds are stated in text; arrows, indentation, or
  color may supplement but never replace the relationship.
- Scores and Recital points use understandable labels and locale-aware numbers.
- Passed, insufficient, locked, pending, approved, and rejected states do not rely on
  color alone.
- Practice-analysis totals include their independent-best limitation in nearby visible
  text and programmatic description.
- The file input remains a native operable input or equivalent labeled control.
  Preview, replace, cancel, submit, progress, success, and error are keyboard
  operable.
- Upload validation errors identify the failing field and preserve Focus or move it to
  the actionable error summary according to the final form pattern.
- Async upload/review-state changes use appropriately scoped status announcements
  without repeatedly reading the entire page.
- Dialogs, if used for final submission confirmation, trap and restore Focus correctly,
  support Escape where cancellation is safe, and do not obscure the evidence
  requirements.
- Respect reduced motion. No Exam/pass styling may require animation to understand
  status.
- At 200% text zoom and `320 CSS px`, no official condition, player-name instruction,
  rejection reason, or action is clipped.

## Localization and Content Contract

### Interface and Domain Terms

- Provide complete Korean, Japanese, and English interface strings for modes,
  eligibility, fee, reward, stages, cumulative conditions, practice limitations,
  proof requirements, review states, errors, and retention.
- Preserve stable recognizable tokens where translation would harm game recognition,
  including `Basic`, `Recital`, `Event`, `Normal`, `Hard`, `Expert`, `Real`, and `nos`.
- Localize surrounding grammar, Grade labels, score/point units, dates, and status
  copy naturally rather than concatenating token fragments.
- The result evidence requirement may quote the official Japanese `合格` mark and
  explain it in the page locale.

### Exam and Music Content

- Official Japanese Exam/Event names and Music titles are canonical domain content.
- Korean and English Exam descriptions/reward explanations require reviewed localized
  fields or an equivalent localized-content model; the current single Exam text fields
  are not sufficient authority for all three locales.
- Show the original Music title only in Exam stage references. Approved translations
  and readings remain searchable and are disclosed on the linked Music Detail page.
- Missing reviewed Exam translation falls back deterministically to canonical
  Japanese with correct `lang="ja"`; do not present a Korean seed label as official
  Japanese.
- Long titles and mixed scripts must remain complete in official stage reference.
  Visual truncation may be used only where a full accessible value and reliable
  expansion/destination remain available.

## Runtime State Contract

| State group        | Values                                                                       | Scope                         |
| ------------------ | ---------------------------------------------------------------------------- | ----------------------------- |
| Authentication     | signed out, signed in, expired during action                                 | Family and personal actions   |
| Definition request | loading, ready, mode empty, selected not found, error                        | Public Exam reference         |
| Active selection   | Basic/Recital/Event, selected slug                                           | URL and history               |
| Eligibility        | unknown/no sync, insufficient Grade, eligible                                | Signed-in Basic/Recital proof |
| Official scoring   | Basic score, Recital point, Event score, Event Recital point                 | Selected Exam                 |
| Analysis support   | hidden signed out, supported idle, supported busy, ready, error, unsupported | Personal analysis             |
| Achievement        | none, exact approved, implied by higher Grade                                | Signed-in Basic/Recital       |
| Submission         | none, file preparing, uploading, pending, approved, rejected, error          | Signed-in eligible Exam       |
| Proof file         | absent, valid preview, invalid type, too large, replaced/cancelled           | Local and upload flow         |
| Private evidence   | retained, expired after retention                                            | Moderator context             |
| Music relation     | one allowed chart, multiple allowed charts, reward link, missing relation    | Official stages/rewards       |
| Localization       | approved locale content, canonical Japanese fallback                         | Text element                  |

Do not collapse official eligibility, analysis support, achievement, and submission
into one `status` or a page-global `loading` boolean.

## Implementation Mapping

| Concern               | Current source                                                                                                                                                                               | Downstream requirement                                                                                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Entry route           | [`app/(nevigation)/exams/page.tsx`](<../../app/(nevigation)/exams/page.tsx>)                                                                                                                 | Add stable selected `/[locale]/exams/[slug]` destinations and history restoration while retaining public entry                                  |
| Definition data       | [`app/(nevigation)/exams/data.ts`](<../../app/(nevigation)/exams/data.ts>)                                                                                                                   | Preserve shared public cache; localize Exam content; keep personal state outside shared cache                                                   |
| Exam import           | [`prisma/import-op3-exams.mjs`](../../prisma/import-op3-exams.mjs)                                                                                                                           | Preserve 10 Basic, 10 Recital, 8 permanent Event definitions and exact scoring/conditions/rewards                                               |
| Exam schema           | [`prisma/schema.prisma`](../../prisma/schema.prisma)                                                                                                                                         | Support localized Exam content and normalized certification authority; preserve allowed-chart multiplicity                                      |
| Dashboard composition | [`components/exams/examDashboard.tsx`](../../components/exams/examDashboard.tsx)                                                                                                             | Replace client-only selection with URL contract; preserve one selected Exam; scope analysis/proof correctly                                     |
| Mode control          | [`components/exams/dashboard/examModeTabs.tsx`](../../components/exams/dashboard/examModeTabs.tsx)                                                                                           | Keep three exclusive modes with accessible semantics and compact responsive treatment                                                           |
| Exam selector         | [`components/exams/dashboard/examSelector.tsx`](../../components/exams/dashboard/examSelector.tsx)                                                                                           | Keep one compact selector, avoid persistent Grade button wall, express eligibility/achievement without hiding Exams                             |
| Official overview     | [`components/exams/dashboard/examOverview.tsx`](../../components/exams/dashboard/examOverview.tsx)                                                                                           | Make required Grade, fee, reward, and availability clear official facts rather than an easily missed optional detail                            |
| Stage list            | [`components/exams/dashboard/examStageTable.tsx`](../../components/exams/dashboard/examStageTable.tsx)                                                                                       | Preserve order and cumulative meaning; show every allowed chart; remove arbitrary first-chart routing                                           |
| Current analysis      | [`components/exams/dashboard/examSimulation.tsx`](../../components/exams/dashboard/examSimulation.tsx) and [`examDashboardUtils.ts`](../../components/exams/dashboard/examDashboardUtils.ts) | Rename/reframe as Practice analysis, add independent-best limitation, support score Events, never fabricate Recital values                      |
| Proof UI              | [`components/exams/dashboard/examProofUpload.tsx`](../../components/exams/dashboard/examProofUpload.tsx)                                                                                     | Add choose-preview-confirm, evidence checklist, complete state model, and accessible recovery                                                   |
| Proof server          | [`app/(nevigation)/exams/actions.ts`](<../../app/(nevigation)/exams/actions.ts>)                                                                                                             | Explicitly reject Event, validate eligibility/name-related prerequisites and private ownership, prevent duplicates/orphans                      |
| Moderator review      | [`app/admin/submissions/page.tsx`](../../app/admin/submissions/page.tsx) and [`app/admin/submissions/actions.ts`](../../app/admin/submissions/actions.ts)                                    | Compare proof player name with private synchronized `nostalgia_name`, enforce evidence criteria, preserve safe approval/rejection and retention |
| Achievement source    | `ExamAchievement`, legacy `exam_basic`, and `exam_recital` in [`prisma/schema.prisma`](../../prisma/schema.prisma)                                                                           | Migrate to one authoritative normalized source and derive easier Grades from the highest approved Grade                                         |
| Privacy cleanup       | Current private-image retention jobs and Privacy contract                                                                                                                                    | Delete evidence/notes after six months while preserving approved achievement and account-deletion cascade                                       |
| Localization          | [`lib/i18n/messageCatalogs`](../../lib/i18n/messageCatalogs)                                                                                                                                 | Add complete KO/JA/EN selection, scoring, analysis, proof, review, error, and fallback strings                                                  |
| Chart system boundary | [Viewer/editor preservation contract](./07-chart-viewer-editor-preservation.md)                                                                                                              | Make no viewer/editor, renderer, schema, palette, geometry, or Recital-dynamics change under this brief                                         |

## Representative Fixtures

Validate at minimum:

1. signed-out and signed-in visitors on the same Basic, Recital, and Event definitions;
2. Basic 10th and 1st Grade, Recital 10th and 1st Grade, a score Event, and a
   Recital-point Event;
3. exact single then cumulative thresholds and a long three-stage classical title;
4. one allowed chart and four allowed charts without arbitrary first-chart selection;
5. no synchronized Grade, insufficient Grade, exact eligibility, and already higher
   approved Grade;
6. no stage record, partial Basic records, all Basic records, and analysis request
   failure;
7. independent Basic bests that exceed the mathematical total but carry no official
   pass claim;
8. Recital's four×10, 40-per-tune, 120-total explanation with no personal Recital data;
9. Event reward with one Music and with multiple Music rewards;
10. no proof, valid local preview, invalid type, over 4 MB, replacement, cancellation,
    upload, and finalization failure;
11. pending, approved, rejected-with-reason, resubmit, and retained achievement after
    proof expiry;
12. proof with all five required elements, cropped-but-complete proof, missing player
    name, mismatched name, intermediate-stage screenshot, and edited/composite proof;
13. hidden public NOSTALGIA name while authorized moderator comparison still works;
14. unknown slug, deleted/draft Exam, authorization expiry, duplicate submit, and
    client attempt to submit Event proof;
15. original Japanese plus reviewed Korean/English Exam content and canonical Japanese
    fallback;
16. `320px`, representative `390px`, intermediate widths, wide desktop, short
    viewport, 200% text zoom, reduced motion, keyboard-only, and screen-reader use.

## Browser Acceptance Contract

- `/ko/exams`, `/ja/exams`, `/en/exams`, and every published selected-Exam slug resolve
  with equivalent behavior and localized metadata.
- Direct links, refresh, mode changes, selected Exam changes, Music-detail round trips,
  and browser Back preserve or restore the correct Exam and useful position.
- All 28 approved definitions remain reachable; Event is one permanent catalog with no
  date/archive/current distinction.
- Signed-out users can read all official requirements and rewards without fabricated
  Grade, record, analysis, achievement, or submission state.
- Basic, Recital, Event score, and Event Recital-point values retain correct units and
  cumulative meaning.
- Every stage exposes all allowed charts, and no multi-chart Event silently routes to
  the first stored difficulty as if it were official.
- Supported Practice analysis is clearly subordinate, labels independent bests, and
  never states or visually implies an official pass forecast.
- Recital and Recital-point Event show no fabricated personal analysis until a
  separately approved reliable source exists.
- Basic/Recital proof is available only for an authenticated eligible user without a
  pending or equal/higher approved achievement. Event proof is rejected on the server.
- File selection creates a local preview and does not upload until explicit submit.
- Valid upload supports only JPEG/PNG/WebP up to 4 MB, private storage, duplicate
  prevention, orphan cleanup, and recoverable failure states.
- Moderator review can see the submitted Exam, private image, and synchronized
  NOSTALGIA name, and applies the five-element evidence rule.
- Approval derives easier same-mode Grades, Profile displays only the highest approved
  mode title, and proof expiry does not remove the achievement.
- Rejection exposes a concise user-facing reason and allows a safe resubmission.
- At `320 CSS px`, no selector, stage, cumulative condition, long title, analysis,
  proof preview, reason, or action causes document-level horizontal overflow,
  clipping, or overlap.
- Wide layouts use added comparison space without a fixed phone-width shell or a wall
  of Grade/Event buttons.
- Mode and Exam controls, Music links, analysis disclosure, proof selection,
  replacement, cancel, submit, Retry, and login work with keyboard alone and expose
  visible Focus.
- Status and validation changes are announced without relying on color or excessive
  live-region output.
- No unexpected browser console error, hydration issue, public private-image URL,
  cross-user state leak, duplicate submission, or stale selected-Exam state occurs in
  tested normal and failure flows.

## Reference Matrix

| Source                                                                                                              | Transferable principle                                                                                         | NosLog application                                                 | Limitation                                                         |
| ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| [Current Exam entry/data](<../../app/(nevigation)/exams/page.tsx>)                                                  | Establishes public definitions, personal-state boundary, title localization, and current client-only selection | Grounds observed implementation and migration                      | Current layout and URL behavior are not 2.0 authority              |
| [Current Exam components](../../components/exams/examDashboard.tsx)                                                 | Shows three modes, one selector, analysis, stages, and proof flow                                              | Identifies useful composition and current gaps                     | Immediate upload and Basic-only analysis are superseded            |
| [Current Exam schema](../../prisma/schema.prisma)                                                                   | Preserves stages, allowed charts, rewards, submissions, achievements, and player name                          | Grounds data and privacy requirements                              | Legacy and normalized achievement sources still coexist            |
| [Current Exam import](../../prisma/import-op3-exams.mjs)                                                            | Supplies all 28 real definitions and mode-specific thresholds                                                  | Provides representative fixtures and permanent Event set           | Imported text is not complete KO/JA/EN editorial authority         |
| [Approved IA](./02-information-architecture.md)                                                                     | Keeps Exams independent from Tier lists and Bingo                                                              | Preserves navigation and product meaning                           | Does not define Exam anatomy                                       |
| [Approved Music detail brief](./05-music-detail-page-brief.md)                                                      | Defines contextual Music/chart destinations and localized title hierarchy                                      | Supports unambiguous stage-to-Music navigation                     | Does not define Exam scoring                                       |
| [Approved Profile brief](./09-profile-page-brief.md)                                                                | Displays highest Basic/Recital Exam titles in public performance identity                                      | Aligns achievement outcome                                         | Does not define proof review                                       |
| [NOSTALGIA Op.3 official How to](https://p.eagate.573.jp/game/nostalgia/op3/howto/entrance.html)                    | Defines Basic/Recital/Event Exams, three-stage conditions, and fail behavior                                   | Establishes official truth hierarchy and sequential-run limitation | Does not define NosLog analysis or proof UX                        |
| [NOSTALGIA Op.2 official How to](https://p.eagate.573.jp/game/nostalgia/op2/howto/entrance.html)                    | Documents Recital result/evaluation and Exam structure                                                         | Supports Recital-specific semantics                                | Older version imagery is not current visual authority              |
| [NOSTALGIA Op.3 official News](https://p.eagate.573.jp/game/nostalgia/op3/news/entrance.html)                       | Publishes Grade/Exam additions and rewards                                                                     | Supports official provenance and Event reward reference            | News chronology does not justify an archive UI                     |
| [Original Basic 3rd Grade pass recording](https://www.youtube.com/watch?v=mu0Z-2VMPZA)                              | Final pass summary contains Grade, stage values, total, `合格`, and upper-right player identity                | Validates one-frame evidence criteria                              | One uploader and capture setup cannot define security policy alone |
| [Original Recital 1st Grade pass recording](https://www.youtube.com/watch?v=0IBKbcBZYGU)                            | Recital final summary shows point totals and the same persistent player-identity area                          | Confirms cross-mode evidence anatomy                               | Recording quality varies from user proof                           |
| [Independent Basic 8th Grade recording](https://www.youtube.com/watch?v=KBP5tkFhvxI)                                | Independently confirms player name persists in the upper-right result context                                  | Reduces dependence on one uploader                                 | Op.2 visual styling is not 2.0 design authority                    |
| [SOUND VOLTEX Skill Analyzer](https://p.eagate.573.jp/game/sdvx/vii/howto/skill.html)                               | Skill examinations separate course identity, ordered tracks, conditions, and outcome                           | Supports ordered official Exam reference                           | SDVX gauges and course ranks do not map to NOSTALGIA scoring       |
| [SOUND VOLTEX game modes](https://p.eagate.573.jp/game/sdvx/vii/howto/game_mode.html)                               | Distinct play purposes remain recognizable modes                                                               | Supports Basic/Recital/Event separation                            | Does not determine NosLog selector styling                         |
| [IIDX course mode](https://p.eagate.573.jp/game/2dx/26/howto/mode/game_mode.html)                                   | Sequential course performance differs from independent song records                                            | Reinforces no pass forecast from independent bests                 | IIDX gauge/failure rules differ                                    |
| [IIDX Play Data](https://p.eagate.573.jp/game/2dx/26/howto/epass/play_data.html)                                    | Official identity and play records are separate from external service analysis                                 | Supports explicit provenance and identity comparison               | Does not authorize NosLog proof                                    |
| [CHUNITHM Class Certification](https://chunithm.sega.jp/play/class/)                                                | Certification tasks use ordered course and clear eligibility/outcome framing                                   | Supports official-condition priority                               | CHUNITHM's life system is not adopted                              |
| [Taiko Dan-i Dojo](https://taiko.namco-ch.net/taiko/special/dani_dojo_gaiden/about.php)                             | Course conditions need exact per-song/overall interpretation                                                   | Supports explicit single/cumulative wording                        | Taiko achievement metrics differ                                   |
| [maimai course guidance](https://maimai.sega.com/play/newfunction4/)                                                | Skill/course modes benefit from clear selection and outcome context                                            | Supports compact course navigation                                 | Mode mechanics are not copied                                      |
| [Carbon Tabs](https://carbondesignsystem.com/components/tabs/usage/)                                                | A small exclusive peer set may use tabs with complete keyboard behavior                                        | Supports three mode choices                                        | Carbon styling and measurements are not NosLog authority           |
| [GOV.UK Task list](https://design-system.service.gov.uk/components/task-list/)                                      | Ordered tasks need visible status and scan-friendly relationships                                              | Supports stage sequence and condition clarity                      | Generic tasks cannot replace musical stage semantics               |
| [USWDS Step indicator](https://designsystem.digital.gov/components/step-indicator/)                                 | Step order and current/completed meaning must be explicit and accessible                                       | Informs ordered stages without requiring a stepper                 | The Exam is reference, not an interactive wizard                   |
| [USWDS File input](https://designsystem.digital.gov/components/file-input/)                                         | File inputs need accepted formats, guidance, drag/selection behavior, and validation                           | Supports accessible proof choice                                   | USWDS styling is not adopted                                       |
| [USWDS File input accessibility tests](https://designsystem.digital.gov/components/file-input/accessibility-tests/) | Keyboard, label, error, zoom, and assistive-technology behavior require explicit tests                         | Grounds proof acceptance tests                                     | Does not define private moderation                                 |
| [Carbon File uploader](https://carbondesignsystem.com/components/file-uploader/usage/)                              | Selected, uploading, success, error, and removal are distinct states                                           | Supports choose-preview-submit and state model                     | Carbon's upload variants are not copied visually                   |
| [MDN file input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file)                   | `accept` guides selection but server validation remains necessary                                              | Supports native input and MIME validation                          | Browser metadata is not proof authenticity                         |
| [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)        | Allowlist, size limits, generated names, private storage, authorization, and cleanup reduce upload risk        | Grounds private proof security                                     | Security controls do not determine evidence meaning                |
| [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)    | Authorization must be enforced server-side on every object action                                              | Prevents cross-user proof access and Event bypass                  | Does not define UI hierarchy                                       |
| [WCAG Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)                  | Errors must identify the problem in text and be associated with the field/action                               | Supports upload and rejection recovery                             | Does not prescribe exact copy                                      |
| [WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                              | Content must preserve information and function at 320 CSS px without two-dimensional page scrolling            | Requires compact stages and proof flow                             | Does not prescribe layout tokens                                   |
| [WAI-ARIA APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)                                                 | Tab patterns require selected/controlled relationships and keyboard navigation                                 | Governs mode tabs if selected                                      | A native alternative may be more suitable after Foundation testing |
| [W3C Internationalization techniques](https://www.w3.org/International/techniques/authoring-html.en)                | Mixed-language content needs correct language metadata and script-aware layout                                 | Supports Japanese fallback and KO/JA/EN content                    | Exact typography remains Foundation work                           |

### Evidence Convergence

- Official NOSTALGIA and comparable rhythm-game course references converge on exact
  ordered requirements and one-run outcomes. They do not support treating independent
  Music bests as an official pass forecast.
- The current data model and official scoring evidence converge on separate Basic and
  Recital analysis logic. They do not support inventing Recital values from Basic data.
- Tabs and selection references converge on a small three-mode control plus one compact
  Exam selector rather than many persistent Grade/Event buttons.
- Original result recordings converge on a one-frame Basic/Recital evidence anatomy:
  final Exam identity, Grade, `合格`, and upper-right player name. This supports a
  proportionate one-image manual workflow, not strong identity assurance.
- File-upload, security, and authorization references converge on explicit selection,
  preview/state feedback, server validation, private storage, ownership checks, and
  cleanup. They do not validate the content of a game screenshot; moderator criteria
  remain necessary.
- Responsive and internationalization references converge on `320 CSS px` reflow,
  complete long titles, explicit units, and correct language metadata rather than a
  fixed `390px` product shell.
- No external source determines permanent Event treatment, exact proof eligibility,
  six-month retention, Grade inheritance, or highest-title Profile display. Those
  decisions come from verified NosLog/NOSTALGIA behavior, the Privacy contract, and
  explicit user approval.

## Rejected and Superseded Alternatives

- **Combine Exams with Tier lists or Bingo under a Challenge landing page — Rejected:**
  the three are distinct NOSTALGIA concepts and user tasks.
- **Expose every Grade/Event as persistent buttons — Rejected:** one compact selector
  preserves hierarchy and scales across modes/locales.
- **Keep selected Exam only in client state — Superseded:** every Exam receives a
  stable shareable/restorable slug route.
- **Make official entry information an easily missed optional detail — Superseded:**
  eligibility, fee, reward, stages, and conditions are primary reference facts.
- **Call independent-best arithmetic a simulation or pass likelihood — Rejected:** it
  cannot represent a sequential official run.
- **Apply Basic analysis to Recital — Rejected:** score and four-category Recital point
  semantics are different and current synchronized Recital details are absent.
- **Hide all Event analysis because mode is Event — Superseded:** scoring type, not the
  Event label alone, determines whether score-based Practice analysis is supported.
- **Split Event into current and archive or add a version selector — Rejected:** the
  approved eight-Exam reference set is permanent and release history is not a mode.
- **Link a multi-chart Event stage to its first stored chart — Rejected:** every allowed
  chart must remain visible and the destination cannot imply an arbitrary default.
- **Allow Event proof or Profile title — Rejected:** Event remains reward/reference
  content, not NosLog certification.
- **Show every implied lower Grade on Profile — Rejected:** show only the highest
  approved Basic and Recital title.
- **Maintain legacy and normalized achievements as equal authorities — Rejected:**
  migrate and use one normalized source.
- **Upload immediately after file selection — Superseded:** selection is followed by
  preview and explicit submit.
- **Require two images, video, handwritten code, full cabinet, date, or EXIF —
  Rejected:** disproportionate friction without reliable additional assurance for this
  fan-service workflow.
- **Accept an individual Music result or cropped frame without player name — Rejected:**
  the one image must contain all five approved evidence elements.
- **Expose proof through public Blob URLs — Rejected:** evidence remains private and
  retention-limited.
- **Keep desktop inside a fixed mobile-width shell — Rejected:** `390px` is a
  representative review canvas, not a desktop layout width.
- **Add Recital strong/weak chart backgrounds or any related editor/viewer behavior —
  Rejected from this scope:** the complete viewer/editor is a locked preservation
  exception. This brief does not register that idea as future NosLog 2.0 work.

## Decision Log

| ID      | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Status                |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| EXAM-01 | Exams remain an independent public NOSTALGIA page family                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `Approved`            |
| EXAM-02 | Basic, Recital, and Event are the only top-level peer modes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `Approved`            |
| EXAM-03 | Show one selected Exam with one compact Grade/Event selector                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `Approved`            |
| EXAM-04 | Every selected Exam has a stable localized slug route and restorable history                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `Approved`            |
| EXAM-05 | Official Grade, fee, reward, stage order, allowed charts, and conditions precede personal tools                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Approved`            |
| EXAM-06 | Basic promotion conditions preserve single then cumulative score semantics                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `Approved`            |
| EXAM-07 | Recital uses four categories ×10, 40 per tune, 120 total, and its own cumulative point semantics                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `Approved`            |
| EXAM-08 | Personal derived content is named Practice analysis and never predicts an official pass                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `Approved`            |
| EXAM-09 | Basic and score Events may use independent-best Practice analysis with an explicit limitation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `Approved`            |
| EXAM-10 | Recital and Recital-point Event analysis is omitted until reliable Recital details exist                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `Approved`            |
| EXAM-11 | All eight seeded Event Exams are permanent reference content with no archive/version split                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `Approved`            |
| EXAM-12 | Multi-chart stages expose every allowed chart and never imply the first stored chart is official                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `Approved`            |
| EXAM-13 | Event has no proof, NosLog certification, achievement, or Profile Exam title                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `Approved`            |
| EXAM-14 | Basic/Recital proof requires authentication, official Grade eligibility, and no pending/equal-or-higher approval                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `Approved`            |
| EXAM-15 | One proof image must show final result, mode, Grade, `合格`, and matching upper-right player name                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `Approved`            |
| EXAM-16 | Proof supports crop/rotation/perspective/compression but not missing regions, stitching, or result/name alteration                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `Approved`            |
| EXAM-17 | Proof does not require full cabinet, second image, video, date, handwritten code, or EXIF                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `Approved`            |
| EXAM-18 | File flow is one JPEG/PNG/WebP up to 4 MB with choose, preview, explicit submit, and recoverable states                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `Approved`            |
| EXAM-19 | Proof is private, server-authorized, moderator-reviewed, and deleted after six months while achievement remains                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Approved`            |
| EXAM-20 | Synchronized `nostalgia_name` is the private comparison identity even when hidden publicly                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `Approved`            |
| EXAM-21 | Higher approved Grade implies easier same-mode Grades; Profile shows the highest title only                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `Approved`            |
| EXAM-22 | Normalized Exam achievement becomes authoritative after legacy reconciliation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `Approved`            |
| EXAM-23 | Compact layouts reflow through 320 CSS px and wide layouts use meaningful comparison space                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `Approved`            |
| EXAM-24 | Exam requirements do not authorize any viewer/editor or Recital-dynamics change; document `07` preserves the complete experiences                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `Approved correction` |
| EXAM-25 | High-fidelity 2026-09-02: the Exam selector is a popover listbox on the `DestinationPanel` overlay contract (rows 44 = Grade + right-aligned concise state text; current row `interaction/menu-set` + `emphasis-label`, the P9 language-menu/`SET-49` language); a native select cannot render the option-level eligibility/achievement state this brief requires                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `Approved`            |
| EXAM-26 | High-fidelity 2026-09-02: stages are three connected cards — each card carries its own scope-explicit condition text (`이 곡 {score}` · `1st+2nd 누적 {score}` · `3곡 누적 {score}`) and cards are joined by a short vertical connector line; no separate condition-summary card, no dense divider-row table                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `Approved`            |
| EXAM-27 | High-fidelity 2026-09-02: Practice analysis is one collapsed Disclosure card below the stages (P4 calculation-guide precedent): open order is limitation line → per-stage best/target/gap rows → cumulative comparison; signed-out or unsupported modes omit the card entirely; the mode control is a 3-segment `SegmentedControl` 358×44 (`PROF-34` precedent)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Approved`            |
| EXAM-28 | Korean copy approved 2026-09-02: module label `연습 분석` (replaces `플레이 조언`); limitation `베스트 기록은 서로 다른 플레이에서 온 값이라, 한 번의 검정 주행에서 세 곡을 연속으로 통과할 수 있다는 뜻은 아닙니다.`; scope-condition labels above; Recital explanation `4개 평가 항목 × 10점 — 곡당 40점, 3곡 합계 120점`; proof checklist `최종 3곡 결과 화면 · Basic 또는 Recital 모드 · 응시한 급수 · 合格 표시 · 화면 우상단 플레이어 이름`; review/retention `제출한 이미지는 비공개로 심사되며, 심사 후 6개월이 지나면 삭제됩니다.`; name-sync `게임 내 이름을 바꿨다면 다시 동기화한 뒤 제출해 주세요.`; selector state `Grd. 부족` (replaces `잠김` in the selector context); second batch 2026-09-02: page description `공식 검정의 응시 조건·과제곡을 확인하고 합격을 인증합니다.`, checklist heading `한 장에 모두 보여야 합니다`, proof-preparation actions `제출`·`교체`·`취소`, sync notice `자격 확인과 플레이어 이름 대조에는 데이터 동기화가 필요합니다.` + `데이터 동기화`, loading `검정 정보를 불러오는 중입니다.`; ja/en drafts for the new strings approved 2026-09-02 (page description, `証明`/`Proof`, scope labels `この曲`/`This tune` · `累計`/`cumulative`, `練習分析`/`Practice Analysis`, `合格証明`/`Passing Proof`, Event titles, `なし`/`None`, `楽曲解禁`/`Song unlock`; en Grade naming follows the catalog `{mode} Class {exam}`; native review pending) | `Approved`            |
| EXAM-29 | Wide layout 2026-09-02 (user decision after a first 805/395 build was rejected as leaving the top half empty; six 1280 references measured — MS Learn and AWS certification, Coursera, LeetCode study plans, Khan Academy, chess.com lessons, plus Spotify's playlist tracklist): a Grade rail replaces the popover selector at wide — left rail 292 carries the mode control and all ten Grades with per-row state (`완료`/`응시 가능`/`Grd. 부족`, current row `interaction/menu-set` + `emphasis-label`, the `SET-49` rail language); content 908 carries identity, the selected-exam head card, the stage tracklist, and analysis/proof in two columns. The popover selector remains the compact form                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `Approved`            |
| EXAM-30 | Stages render as a jacket tracklist at every width (the exam is a three-track setlist; Spotify tracklist and C6 Music List language): jacket 64 bleeding the card's left edge, sequence + difficulty, original title, and the scope + required value right-aligned in tabular figures; connectors between rows keep the `EXAM-26` connected-run cue; the whole row is the Music-detail link affordance exactly as C6 rows are                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `Approved`            |
| EXAM-31 | Entry facts merge into the selected-exam head card as label-over-value clusters (2×2 compact, one row wide) — `metric-display` was considered per `PROF-42` and rejected because text statuses (`응시 조건 부족`) overflow compact cells and the four facts are heterogeneous, unlike P6's four metrics                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `Approved`            |
| EXAM-32 | Difficulty labels are **coloured text** — the game's and current product's native convention (user decision 2026-09-02 after a dot marker and an outline-badge proposal were both rejected as generic chip patterns; 12 alternatives were drawn and compared). The label `{Difficulty} {level}` renders as one `metric-value` run filled with `difficulty/text-*` (doc 24 `DU-01` text-ramp amendment: same hue, `≥4.5:1` both modes — five new primitives, three existing reused). The C3 `DifficultyMarker` component was revised to this form (dot removed); multi-chart Event stages list every allowed chart as its own coloured label (the official exam screen anatomy — top mode tabs, per-tune rows with jacket, difficulty, and pass condition — was verified against the Op.3 howto `exam_02` capture, and matches the tracklist row structure)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `Approved`            |

## Handoff Boundary

The active high-fidelity design stage may determine final type scale, visual emphasis, surface treatment,
mode-control appearance, selector pattern, stage-card anatomy, cumulative connectors,
column proportions, grid tracks, gaps, proof-preview styling, status treatment,
responsive transition points, and motion after Foundation approval. It must preserve
the official-first hierarchy, mode/scoring distinctions, permanent Event meaning,
supported-analysis boundary, one-image evidence criteria, private proof lifecycle,
Grade inheritance, localization, accessibility, and acceptance criteria.

The later Codex implementation session must compare the final approved Figma output against this
brief. It must request a guide or design revision before implementing any design that
combines Exams with Tier/Bingo, exposes a button wall, hides official requirements,
predicts a pass from independent bests, fabricates Recital analysis, archives permanent
Events, silently selects one allowed Event chart, accepts Event proof, auto-uploads on
file selection, omits player-name comparison, exposes private evidence, shows every
lower Grade title, adds unapproved Recital chart semantics, keeps a fixed phone-width
desktop shell, or otherwise conflicts with the approved contract.
