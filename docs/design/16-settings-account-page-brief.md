# NosLog 2.0 Settings and Account Management Page Brief

## Document Control

- Status: `Approved`
- Decision status: `Complete settings and account-management contract approved:
one public locale-prefixed destination; responsive category navigation; guest and
authenticated scope; immediate and explicit save ownership; language and theme
behavior; profile image, NosLog nickname, NOSTALGIA identity,
country/region, and preferred-arcade rules; five positive privacy controls;
Discord identity management; logout; and permanent account deletion`
- Evidence status: `Repository and browser inspection; approved information
architecture, profile, and shared-shell briefs; more than thirty cited
accessibility, internationalization, design-system, platform, and production
references; and the user-approved decision record`
- Date started: 2026-08-03
- Last decision update: 2026-08-04
- Canonical language: English
- Korean companion:
  [16-settings-account-page-brief.ko.md](./16-settings-account-page-brief.ko.md)
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Shared-shell contract:
  [15-shared-shell-navigation-brief.md](./15-shared-shell-navigation-brief.md)
- Authentication and onboarding contract:
  [17-authentication-onboarding-page-brief.md](./17-authentication-onboarding-page-brief.md)
- Privacy and data-practices contract:
  [18-privacy-data-practices-page-brief.md](./18-privacy-data-practices-page-brief.md)
- Profile contract: [09-profile-page-brief.md](./09-profile-page-brief.md)
- Scope: public settings entry, category structure, preference ownership and saving,
  signed-out and signed-in behavior, profile editing, privacy, Discord connection,
  logout, deletion, responsive adaptation, localization, accessibility, states, and
  future implementation acceptance
- Excluded: final visual styling, exact Foundation tokens and dimensions, final
  localized copy, raw account-data export, administrator settings redesign,
  database/API implementation, and production code changes in this design-guide
  session

## Decision Labels

- **Observed:** Verified in the repository, current browser evidence, an approved
  upstream artifact, or a cited source.
- **Approved:** Explicitly agreed with the user and authoritative for downstream design.
- **Proposed:** Evidence-based direction awaiting user approval.
- **Open:** Requires further research, testing, or a user decision.
- **Rejected:** Considered and explicitly not selected.
- **Superseded:** Replaced by a later approved direction.

This brief is authoritative for settings membership, information order, behavior,
ownership, states, responsive adaptation, accessibility, and acceptance criteria.
Claude Design may define the final visual composition within the later approved
Foundation, but it must not change which settings exist, how they are saved, who can
use them, or the consequences of sensitive actions.

## Purpose

Settings gives every visitor one predictable place to control the NosLog experience
and gives authenticated users a safe place to manage identity, public visibility,
connection state, and account lifecycle.

The surface must answer five questions without becoming one long undifferentiated
form:

1. How should NosLog look and which language should it use on this device or account?
2. Which identity and arcade information represents me?
3. Which approved profile and activity fields may other people see?
4. Which Discord account is used to authenticate me?
5. How do I sign out or permanently delete my NosLog account with informed consent?

## Primary Context and Success

- **Approved:** Settings is an ordinary public-shell destination at
  `/[locale]/settings`, reachable from More whether signed out or signed in.
- **Approved:** A guest succeeds when they can change language and theme without
  encountering disabled account forms.
- **Approved:** An authenticated user succeeds when they can find a category,
  understand persistence and public consequences, save changes without losing input,
  and return to the same category or view their profile.
- **Approved:** Sensitive identity and deletion actions explain consequences before
  commitment and never imply success after a partial or failed operation.
- **Approved:** Mobile is the primary context, but wide layouts must use available
  space for orientation and efficient category switching rather than retaining the
  current approximately `390px` column.
- **Approved:** Korean, Japanese, and English preserve the same category meaning,
  control ownership, and consequence hierarchy.

## Current-Product Evidence

### Repository Evidence

- **Observed:** Settings currently exists only under authenticated profile routing;
  signed-out access redirects to login. A public `/[locale]/settings` route does not
  yet exist.
- **Observed:** The current page combines avatar, theme, locale, localized-title
  visibility, arcade, username, country, privacy, editable Discord data, Save/Cancel,
  and account deletion in one long form.
- **Observed:** Theme is currently an immediate local-storage preference with dark as
  the fallback. Locale is currently staged and takes effect after the entire form is
  saved.
- **Observed:** The current save action remains available without a dirty-state
  distinction and redirects to Profile after success. There is no verified unsaved
  leave warning.
- **Observed:** The current username path uppercases input and applies a uniqueness
  constraint. The data model also holds a separate synced `nostalgia_name`; these are
  different identity concepts.
- **Observed:** Current avatar upload accepts JPG, PNG, and WebP up to 4 MB and stores
  a public Blob, but does not provide the approved remove and crop workflow.
- **Observed:** Preferred arcade currently uses an active-arcade native select. It
  does not provide name/region search, unavailable-selection retention, or discovery
  navigation.
- **Observed:** Current privacy fields are three negative `hide_*` controls. They do
  not cover the approved five positive public-visibility concepts.
- **Observed:** Discord OAuth is the sole authentication identity. Existing callback
  behavior refreshes Discord-derived information, while the current form also exposes
  Discord values as editable fields.
- **Observed:** Current deletion requires an exact phrase, removes uploaded Blobs,
  deletes database data, and destroys the session on success. Blob deletion failure
  prevents database deletion, but complete idempotent retry and recent OAuth
  reauthentication are not current verified contracts.

### Browser Evidence

- **Observed:** At compact width, the single form creates a very long page with
  unrelated actions sharing one save boundary.
- **Observed:** At wide desktop width, the settings content still occupies the same
  narrow centered shell rather than adding persistent category orientation.
- **Observed:** The current hierarchy does not clearly distinguish immediate display
  preferences, staged profile edits, read-only login identity, and irreversible
  account deletion.

Current implementation is a feature and data inventory. It is not the visual or
interaction authority for NosLog 2.0.

## Research Synthesis

### Convergent Findings

1. Mobile settings work best as a categorized overview that opens one focused group;
   wide settings can keep category navigation visible beside the detail region.
2. Immediate preferences and explicit-save forms may coexist when their persistence
   boundary is visually and semantically clear.
3. Language must be manually selectable, reflected in document language and URL, and
   must not be silently overwritten by automatic negotiation after an explicit choice.
4. Theme should include system preference in addition to light and dark, and must
   remain operable without relying on color alone.
5. Public-profile controls are clearer when labels describe the visible result and
   enabled means public, rather than presenting a collection of negative “hide” rules.
6. Authentication identity should remain read-only outside a dedicated sensitive
   account-change flow.
7. Searchable single-selection is appropriate for a growing named-venue set; it needs
   keyboard-complete combobox semantics rather than a custom inaccessible picker.
8. Destructive account deletion needs escalating friction: consequences, recent
   authentication, exact confirmation, an unambiguous final action, robust processing,
   and truthful completion reporting.
9. A human-readable social profile card and a raw machine-readable data archive solve
   different tasks and must not share one label or implied behavior.

### NosLog-Specific Fit

- Arcade-adjacent mobile use favors short category tasks and immediate display
  preferences.
- Country/region is not a language proxy. It defines the user's main NOSTALGIA play
  region and regional ranking population.
- NOSTALGIA's official player name is game-synced and uppercase; NosLog nickname is a
  separate service identity with broader writing-system support.
- Discord is the only login method, so “disconnect” would strand the account. NosLog
  instead provides refresh and a separately confirmed login-account change.
- Profile-card sharing remains a profile feature. It is not a settings backup or a
  prerequisite for deletion.

## Approved Information Architecture

### One Destination, Contextual Scope

- Use one localized entry: `/[locale]/settings`.
- Do not create a guest-only settings page or a second account-settings entry in More.
- Exact child-route versus query-state naming is deferred to implementation mapping,
  but the selected category must be restorable through browser back/forward and a
  direct URL.
- Preserve existing localized links through a compatibility redirect from
  `/[locale]/profile/settings` when 2.0 is implemented.

### Category Set and Order

| Order | Category    | Guest | Signed in | Required contents                                                                               |
| ----- | ----------- | ----- | --------- | ----------------------------------------------------------------------------------------------- |
| 1     | Experience  | Yes   | Yes       | Language and theme                                                                              |
| 2     | Profile     | No    | Yes       | Avatar, NosLog nickname, read-only NOSTALGIA identity context, country/region, preferred arcade |
| 3     | Privacy     | No    | Yes       | Five positive public-visibility controls                                                        |
| 4     | Connections | No    | Yes       | Read-only Discord identity, refresh information, change login account                           |
| 5     | Account     | No    | Yes       | Logout, contextual Privacy access, permanently delete account                                   |

- A guest sees Experience plus a compact sign-in note explaining that profile and
  account settings become available after login.
- Do not render inaccessible authenticated categories as a long disabled list.
- Category labels remain stable across layout adaptations; do not merge categories to
  save space.

### Information Priority

1. current category identity and any unsaved state;
2. primary controls and concise consequence text;
3. category-specific save or sensitive action;
4. inline validation and status feedback;
5. contextual supporting links.

Long generic explanations, repeated legal copy, raw internal identifiers, and
duplicate navigation links are progressively disclosed or omitted.

## Experience Category Contract

### Language

- Options are Korean, Japanese, and English.
- Selection takes effect immediately and navigates to the same settings category under
  the new locale prefix.
- Update the URL, visible UI, document `<html lang>`, and stored preference as one
  coherent transition.
- Signed-in selection persists to the account. Signed-out selection persists only in
  the browser.
- An explicit shared URL such as `/ja/music/...` renders in Japanese for that visit but
  does not silently overwrite a previously stored account or browser preference.
- For a first signed-out visit with no explicit choice, initialize Korean for a Korean
  browser, Japanese for a Japanese browser, and English otherwise.
- Do not infer country/region from the selected UI language.

### Theme

- Options are System, Dark, and Light.
- System is the initial default for new users and guests who have not made an explicit
  choice.
- Preserve an existing explicit dark or light choice during migration.
- Theme remains device-local even while signed in; do not sync it across devices.
- System follows the current operating-system preference and responds when that
  preference changes.
- All three options apply immediately. No category Save action is required.
- The approved NosLog representative art direction remains dark, while both dark and
  light modes require complete contrast, state, chart, image, and focus testing.

## Profile Category Contract

Profile fields are one staged form with one explicit category Save action. The Save
action is disabled until a valid change exists.

### Avatar

- Show the current avatar, a Change action, and a Remove action when a custom avatar
  exists.
- Accept JPG, PNG, and WebP up to 4 MB.
- After choosing a file, provide a local 1:1 crop/position step and circular profile
  preview. The crop interaction must work with touch and keyboard.
- The staged preview does not become public until Profile is saved successfully.
- If upload or save fails, preserve the existing public avatar and the user's staged
  editing context.
- Remove is staged with the rest of Profile and falls back to the NosLog-generated
  identity image only after a successful save.
- Do not let Discord refresh overwrite a user-selected NosLog avatar.

### NosLog Nickname

- Label the editable field `NosLog nickname` in meaning, not “NOSTALGIA name.”
- Allow 1–20 Unicode letters and numbers across Korean, Japanese, and Latin writing,
  plus internal spaces and `.`, `_`, and `-`.
- Trim outer whitespace; reject blank-only values, controls, and emoji in the initial
  2.0 contract.
- Preserve the entered display case and allowed width form.
- Enforce uniqueness through a normalized comparison key that is case-insensitive and
  full-width/half-width-insensitive.
- Existing numeric profile URLs remain canonical; nickname changes must not break
  shared profile links.
- Explain uniqueness errors inline without erasing the entered nickname.

### NOSTALGIA Official Player Name Boundary

- NOSTALGIA player name is a separate, synced identity supplied by game data.
- It remains uppercase according to the game and is never editable in NosLog settings.
- If context is necessary, show it as concise read-only supporting identity, not as a
  second editable name field.
- Its public visibility is controlled in Privacy.

### Country or Region

- Options are Korea, Japan, and Other.
- This value means main NOSTALGIA play region and regional-ranking population. It does
  not select language and is not inferred from language.
- Changing the existing value opens a short confirmation explaining the ranking and
  profile consequence before the staged change is accepted.
- Do not require proof, impose a long cooldown, or suggest that the choice represents
  nationality.

### Preferred Arcade

- The closed field summarizes the selected venue as `name · region` and provides
  Change or Clear.
- Change opens a searchable, keyboard-complete, single-select list supporting venue
  name and region queries.
- Provide a contextual route to arcade discovery; do not embed a duplicate map inside
  Settings.
- A venue chosen from Settings is staged until Profile save.
- The contextual “set as preferred” action on an arcade detail page may update the same
  field immediately because the venue and consequence are already explicit there.
- If the selected venue later becomes inactive, retain it as unavailable and offer
  Change or Clear. Never silently erase it.

### Profile Save and Completion

- Save commits all valid staged Profile changes as one category operation.
- Remain in Profile after success and announce a concise success status.
- Provide a separate `View my profile` link; do not force navigation after save.
- Preserve every valid input and expose field errors if save fails.
- If the user attempts to leave with staged changes, warn before discarding them.

## Privacy Category Contract

Use positive labels. On means the data is visible on approved public surfaces; Off
means NosLog withholds it from other users. Do not add a whole-profile private switch.

| Order | Control               | Public meaning when On                                                 | Coupling rule                                                       |
| ----- | --------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1     | NOSTALGIA player name | Show the synced official player name where the profile contract allows | Does not affect NosLog nickname                                     |
| 2     | Discord identity      | Show approved Discord display identity on the public profile           | Does not disconnect or change login identity                        |
| 3     | Preferred arcade      | Show the selected preferred arcade                                     | Does not remove the stored selection                                |
| 4     | Total play count      | Show aggregate play count                                              | Does not hide score or ranking data unless another contract says so |
| 5     | Play activity         | Show Last played and Recent Plays together                             | One control owns both to avoid contradictory partial activity       |

- Privacy is one explicit-save category. Save is disabled until dirty.
- Changing a toggle does not erase the underlying data.
- Labels and short descriptions state the public consequence without exposing internal
  `hide_*` names.
- If save fails, keep the pending choices, announce the failure, and identify the
  affected control when possible.
- Public surfaces must consume the same privacy policy consistently; a profile card,
  profile page, ranking identity, and other approved consumers may not invent their
  own incompatible visibility meanings.

## Connections Category Contract

### Discord Identity

- Discord remains the sole NosLog login method.
- Show the current Discord-derived display identity read-only. Do not provide manual
  Discord username or display-name fields.
- `Refresh Discord information` requests current approved identity data through OAuth
  and updates Discord-derived fields only.
- Refresh must not overwrite the NosLog nickname, custom avatar, country, arcade, or
  privacy settings.
- Public Discord visibility is controlled only in Privacy.

### Change Login Account

- Provide a separate sensitive `Change login account` action.
- Before OAuth begins, confirm that future login identity and account association will
  change; do not present this as a casual information refresh.
- Complete the change only after the callback proves the new Discord identity and the
  server resolves uniqueness and account-association rules safely.
- Do not offer Disconnect while Discord is the only authentication method.
- Cancellation or OAuth failure returns to Connections with the existing login
  identity intact and an actionable status.

## Account Category Contract

### Logout

- Logout is a direct account action separated from permanent deletion.
- It clears the authenticated session but preserves device-local theme and the saved
  signed-out browser language preference.
- After logout, navigate to the localized Home and provide concise confirmation.

### Contextual Privacy Access

- The ordinary footer remains the global owner of Privacy and GitHub links.
- Account may provide a contextual Privacy link near deletion consequences because the
  policy is directly relevant there. This is not a new header or More-panel entry.

### Permanent Account Deletion

Account deletion is immediate and irreversible. There is no grace period or recovery
window in the approved 2.0 contract.

#### Entry and Consequence Summary

1. Keep the destructive area visually and semantically separate from Logout.
2. Open an accessible confirmation dialog instead of deleting inline.
3. Explain that the NosLog account is deleted, while Discord and the official
   NOSTALGIA account remain unaffected.
4. Show a concise user-centered consequence summary with exact counts when reliable.
   Use no more than approximately four or five grouped rows, omit zero-value rows when
   that improves clarity, and never expose raw database-table names.

Approved consequence groups include:

- play, synchronization, and recent-play records;
- growth and grade history;
- tier votes and community activity;
- Bingo and Exam progress or submissions;
- user uploads and evidence files;
- public profile and ranking presence.

Counts make the consequence tangible; they must not become a dense database inventory.

#### Verification and Confirmation

1. Require recent Discord OAuth authentication before final deletion.
2. If Discord authentication is unavailable, do not weaken verification; provide the
   approved Privacy contact/recovery route.
3. Require typing one localized exact confirmation phrase supplied by the interface.
4. The final destructive button remains disabled until recent authentication and the
   exact phrase are both valid.
5. Do not ask for a deletion reason.

Exact final localized wording belongs to the localization-copy pass, but it must retain
the meaning “permanently delete this NosLog account” and must not use ambiguous generic
confirmation such as `OK`.

#### Processing and Result

- On final submission, prevent duplicate requests and prevent dismissing the dialog
  while the irreversible server operation is active.
- The server operation must be idempotent or safely retryable.
- Do not show success if account data or uploads were only partially deleted.
- On a retryable failure, preserve safe recovery context and provide Retry and Error
  report routes without leaving the account in a falsely completed UI state.
- On complete success, destroy the session, clear account-sensitive client caches,
  navigate to localized Home, and show a one-time completion status.
- Device-local guest theme and language preferences remain.
- Signing in later with the same Discord identity creates a new NosLog account rather
  than restoring deleted data.

### Raw Account-Data Export Boundary

- **Rejected for NosLog 2.0 scope:** Do not add a raw `Export my data` control to this
  Settings brief.
- The approved profile-card Share feature creates a visually composed profile summary
  for X, Discord, and other social services. It is not a backup, archive, portability
  package, or deletion prerequisite.
- If a raw machine-readable archive becomes a verified future need, research its data
  scope, privacy, generation, expiry, localization, and operational cost as a separate
  product capability. Do not relabel profile-card sharing as data export.

## Persistence and Save Ownership

| Control or action           | Ownership                                | Commit timing                        | Failure behavior                                           |
| --------------------------- | ---------------------------------------- | ------------------------------------ | ---------------------------------------------------------- |
| Language                    | Account when signed in; browser as guest | Immediate                            | Stay on usable locale/context; expose retryable status     |
| Theme                       | Device/browser                           | Immediate                            | Retain last usable theme                                   |
| Avatar and Profile fields   | Account                                  | Explicit Profile Save                | Keep input/staged preview; preserve existing public avatar |
| Five Privacy controls       | Account                                  | Explicit Privacy Save                | Keep pending controls and expose error                     |
| Refresh Discord information | Account connection                       | Explicit OAuth action                | Preserve existing identity                                 |
| Change login account        | Account connection                       | Confirmed OAuth action               | Preserve existing identity                                 |
| Logout                      | Session                                  | Explicit direct action               | Do not report logout until session invalidation succeeds   |
| Delete account              | Account lifecycle                        | Reauth + exact phrase + final action | Truthful partial/retry state; never false success          |

### Explicit-Save Category Rules

- Save is disabled before any valid change and while a save is running.
- A visible dirty state must not rely only on button color.
- Leaving, changing category, using browser history, or closing the page with unsaved
  changes triggers one consistent discard warning.
- After server validation failure, focus the error summary first when present and then
  make the first invalid field reachable predictably.
- Success and error feedback uses a programmatic status announcement without stealing
  focus unnecessarily.
- Mobile may use a category-only sticky save region. It is not global navigation and
  appears only for an explicit-save category.
- Wide layouts keep the category action within the detail region.

## State Contract

| State                            | Required behavior                                                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Guest                            | Experience works; compact sign-in note; no disabled authenticated-category list                            |
| Authenticated overview           | Five categories in approved order with concise current summaries where useful                              |
| Category loading                 | Preserve category orientation and stable geometry; do not replace the whole shell                          |
| Preference applying              | Prevent conflicting repeat input only as needed; retain readable current value                             |
| Clean explicit-save category     | Save disabled; no unsaved warning                                                                          |
| Dirty valid category             | Save enabled; dirty state exposed textually or semantically                                                |
| Dirty invalid category           | Save disabled or submission blocked; inline guidance identifies invalid field                              |
| Saving                           | Save busy and protected from duplicate submission; other destructive actions unavailable                   |
| Save success                     | Remain in category; announce concise result; clear dirty state                                             |
| Save failure                     | Preserve input; error summary plus inline error; no forced navigation                                      |
| Unsaved navigation               | Confirm discard or remain; cancel preserves state                                                          |
| Avatar local preview             | Public avatar unchanged until successful Profile save                                                      |
| Avatar upload failure            | Existing avatar remains; user can retry or choose another file                                             |
| Nickname conflict                | Preserve entered form; explain uniqueness conflict inline                                                  |
| No preferred arcade              | Clear empty value with Change/select action                                                                |
| Preferred arcade unavailable     | Retain labeled unavailable value; provide Change and Clear                                                 |
| Discord refresh in progress      | Existing login identity remains visible; prevent repeat refresh                                            |
| Discord change cancelled/failed  | Existing account association remains; return actionable status                                             |
| Privacy save failure             | Underlying data and prior public state unchanged; pending choices remain for retry                         |
| Deletion dialog initial          | Least-destructive focus, clear title/consequences, final action disabled                                   |
| Deletion reauthentication needed | Explain requirement and preserve dialog progress that is safe to retain                                    |
| Deletion processing              | Dialog cannot dismiss; duplicate final action blocked                                                      |
| Deletion retryable failure       | No success claim; retry and error-report paths                                                             |
| Deletion complete                | Session and sensitive cache cleared; localized Home and one-time completion status                         |
| Offline or interrupted request   | Distinguish unapplied local input from uncertain server result; reconcile before another sensitive request |
| Permission/session expired       | Preserve non-sensitive staged input where safe; explain sign-in requirement and return path                |

## Responsive Layout Contract

### Compact and Mobile

- Start with a Settings overview that lists only categories available to the current
  authentication state.
- Selecting a category opens a focused detail surface with a clear Settings-back
  relationship.
- Preserve category and form state through back/forward navigation.
- One column reflows through `320 CSS px` without two-dimensional page scrolling.
- Explicit-save categories may use a bottom sticky action region above safe-area
  insets. It must not cover the final field, validation, focused content, or software
  keyboard.
- Dialogs, comboboxes, avatar crop, and exact-phrase confirmation must remain operable
  at short viewport heights and 200–400% zoom.

### Wide Layout

- Use a persistent category list at left and one detail region at right when content
  fit supports it.
- Do not merely center and enlarge the compact screen.
- Category selection updates the detail and history state without losing orientation.
- Keep destructive Account content within the detail column; do not promote deletion
  into persistent navigation.
- Exact transition width is determined later from real Korean, Japanese, and English
  labels and detail-content fit, not from the current `1024px` implementation.

## Accessibility Contract

- One page-level `main` and one descriptive `h1`; category title follows a coherent
  heading order.
- Category navigation uses ordinary links or buttons with current state, not ARIA
  `menu` semantics.
- Every form control has a persistent programmatic label. Placeholder text is never
  the only label.
- Toggle name and state expose the positive public consequence; color is not the only
  state indicator.
- Use native radio semantics for language and theme choices unless an equivalent
  composite passes complete keyboard and screen-reader testing.
- Preferred arcade follows the WAI-ARIA combobox pattern: text input, announced result
  count/state, arrow navigation, Enter selection, Escape behavior, and visible focus.
- Avatar crop exposes non-pointer controls for position and zoom and a meaningful
  preview description.
- Validation satisfies error identification, suggestion where known, and prevention
  for account deletion.
- Save and preference results use appropriate live status semantics. Do not announce
  every keystroke or crop movement.
- Confirmation and deletion use modal-dialog/alert-dialog behavior as appropriate:
  semantic title and description, focus containment, Escape before processing,
  least-destructive initial focus, and focus restoration on cancellation.
- While deletion is processing, dismissal is disabled but the busy state remains
  perceivable.
- Meet approved contrast, target-size, focus-visible, reflow, zoom, reduced-motion,
  and focus-not-obscured requirements once Foundation tokens are defined.

## Localization and Content Contract

- Provide complete Korean, Japanese, and English labels, instructions, validation,
  status, confirmation phrase, consequence text, and recovery actions.
- Do not derive locale labels by transliteration or make Korean the semantic source at
  runtime.
- Allow Japanese and English category/action labels to wrap without truncating the
  setting meaning.
- Preserve code identifiers and exact user-entered nickname form where required.
- Normalize nickname uniqueness separately from display form and test Korean,
  Japanese, Latin, full-width, half-width, spaces, punctuation, and combining forms.
- Locale changes update document language before announcing the new category content.
- Country values use localized display names, while stored identifiers remain stable.
- Destructive confirmation phrases must be language-specific and shown close to the
  input; never require users to guess or translate the phrase.
- Dates and counts in deletion consequences use locale-aware formatting.

## Data and Representative Content Requirements

Future design specimens and tests must include:

- a 20-character mixed-script NosLog nickname and a uniqueness conflict;
- distinct NosLog nickname and uppercase NOSTALGIA player name;
- Korean, Japanese, and English category/action labels at realistic longest lengths;
- a preferred arcade with a long Japanese venue name and region;
- an inactive preferred arcade;
- missing, custom, failed, and staged avatar states;
- Discord display name changes and refresh failure;
- zero, small, and large deletion consequence counts;
- profiles with and without play activity, Discord visibility, and preferred arcade;
- signed-out browser preferences, an existing signed-in account preference, and a new
  account seeded from guest preference;
- system theme changes while Settings is open;
- expired session, offline save, server validation, OAuth cancellation, and partial
  deletion-retry states.

Do not use only ideal short Korean content when judging layout.

## Implementation Mapping

Future implementation should evaluate current code and preserve data safely rather
than copy current form geometry:

| Current or required area                   | Required 2.0 responsibility                                                                                                  |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Current `/[locale]/profile/settings` route | Compatibility redirect preserving locale and, where possible, category intent                                                |
| New `/[locale]/settings` family            | Public overview, authenticated categories, URL-restorable detail state, ordinary shell                                       |
| Current Settings form/action               | Split save ownership into immediate Experience controls and explicit Profile/Privacy operations                              |
| User preference model                      | System theme migration, account/browser language precedence, five positive privacy concepts                                  |
| User identity model                        | Preserve separate NosLog nickname and synced uppercase NOSTALGIA name                                                        |
| Nickname persistence                       | Add normalized uniqueness key without changing canonical numeric profile URLs                                                |
| Avatar storage and action                  | Staged crop/remove, safe Blob replacement, failure rollback, user-avatar precedence over Discord                             |
| Arcade selector and APIs                   | Searchable active venue selection, unavailable retained value, contextual detail action                                      |
| Discord OAuth                              | Read-only display, refresh-only field updates, confirmed account change, recent reauthentication for deletion                |
| Deletion action and storage                | Consequence counts, safe upload/data deletion, idempotency, partial-failure truth, session/cache clearing                    |
| Profile/privacy consumers                  | Enforce the same positive visibility contract across public profile, cards, rankings, and approved surfaces                  |
| Automated and browser tests                | Persistence, history, dirty warnings, validation, OAuth, deletion, reflow, locale, theme, semantics, and privacy consistency |

Exact database migrations, endpoint names, category route syntax, and final component
names belong to the future implementation plan. They may not weaken this behavior
contract.

## Browser Acceptance Contract

Future downstream design and implementation must verify at minimum:

1. guest and authenticated `/ko/settings`, `/ja/settings`, and `/en/settings` entry,
   including More-panel navigation and legacy-route redirect;
2. guest Experience controls with no disabled account-category inventory;
3. signed-in category overview and direct/restored Profile, Privacy, Connections, and
   Account category state through link, reload, back, and forward;
4. immediate language transition retaining category, correct URL and `<html lang>`,
   stored-preference precedence, and explicit shared-locale URL behavior;
5. System/Dark/Light application, existing-choice migration, operating-system change,
   reload persistence, and both visual themes;
6. removal of the former localized-title preference without losing translated/read-
   title search aliases or the Music Detail disclosure;
7. avatar format/size rejection, touch and keyboard crop, preview, remove, save
   success, upload failure, and Discord-refresh non-interference;
8. nickname Unicode rules, normalization collisions, display preservation, validation
   recovery, and unchanged numeric profile URLs;
9. separate read-only uppercase NOSTALGIA name and its privacy behavior;
10. country confirmation and independence from language, plus preferred-arcade search,
    clear, unavailable retention, discovery link, and detail-page immediate action;
11. every positive Privacy control across all consuming public surfaces and save
    failure without underlying data loss;
12. Discord read-only identity, refresh, cancellation/failure, account change, lack of
    Disconnect, and no overwrite of unrelated profile fields;
13. explicit-save clean, dirty, invalid, saving, success, failure, discard-warning,
    category-change, and expired-session behavior;
14. deletion consequence counts, recent OAuth reauthentication, exact localized
    phrase, button gating, keyboard focus, processing lock, retryable/partial failure,
    complete deletion, cache/session clearing, and later new-account behavior;
15. `320px`, representative `390px`, intermediate content-driven transitions, and a
    wide viewport such as `1280px` in all three languages, at short height and
    200–400% zoom;
16. keyboard-only navigation, visible focus, labels, announcements, combobox,
    confirmation dialog, reduced motion, target sizes, no clipped focus, and no
    unexpected horizontal page scroll.

Lint, typecheck, and component tests do not replace actual browser inspection of the
localized responsive interactions.

## Reference Matrix

| Source                                                                                                                                                      | Transferable principle                                                            | NosLog application                                    | Limitation                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------- |
| [Android Settings](https://developer.android.com/design/ui/mobile/guides/patterns/settings)                                                                 | Group related preferences in predictable categories                               | Compact overview and focused category detail          | Android visual patterns do not define NosLog web styling        |
| [SAP Fiori Profile and Settings](https://www.sap.com/design-system/fiori-design-android/v26-1/patterns/profile-and-settings/usage)                          | Separate profile, application settings, and account actions                       | Five explicit categories                              | Enterprise mobile scope differs from NosLog                     |
| [Primer Layout](https://primer.style/product/getting-started/foundations/layout/)                                                                           | Responsive composition should use available space intentionally                   | Compact drill-in and wide list-detail adaptation      | Does not prescribe settings content                             |
| [Grafana Save pattern](https://grafana.com/developers/saga/patterns/save/)                                                                                  | Save ownership and feedback must be predictable                                   | Category-level staged saves                           | Grafana has denser administrative forms                         |
| [GitLab Saving and Feedback](https://design.gitlab.com/patterns/saving-and-feedback/)                                                                       | Distinguish immediate, explicit, loading, success, and failure states             | Mixed save model with clear boundaries                | GitLab component styling is not adopted                         |
| [Agriculture Warn before leaving](https://design-system.agriculture.gov.au/patterns/warn-before-leaving)                                                    | Warn when navigation would discard meaningful unsaved work                        | Profile and Privacy dirty-state protection            | Exact browser integration remains implementation work           |
| [W3C Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)                                                           | Identify errors in text and associate them with controls                          | Error summary and inline validation                   | Does not choose product wording                                 |
| [W3C Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)                                                                          | Announce results without unnecessary focus movement                               | Immediate preference and save feedback                | Live-region implementation requires testing                     |
| [W3C Form Labels](https://www.w3.org/WAI/tutorials/forms/labels/)                                                                                           | Controls require persistent programmatic labels                                   | All settings, confirmation, and crop controls         | Does not define NosLog hierarchy                                |
| [Android Dark Theme](https://developer.android.com/develop/ui/views/theming/darktheme)                                                                      | Support system preference and complete theme coverage                             | System, Dark, and Light                               | Android tokens do not transfer                                  |
| [Apple Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)                                                                  | Preserve legibility, contrast, and imagery across appearances                     | Both theme modes require full visual verification     | Apple platform styling is not adopted                           |
| [web.dev prefers-color-scheme](https://web.dev/articles/prefers-color-scheme)                                                                               | Respect and react to operating-system appearance preference                       | System theme                                          | Browser support details may evolve                              |
| [web.dev Theme switch](https://web.dev/articles/building/a-theme-switch-component)                                                                          | A theme control needs explicit state, persistence, and accessible interaction     | Immediate three-option theme setting                  | Example code is not the implementation authority                |
| [W3C Language Negotiation](https://www.w3.org/International/questions/qa-when-lang-neg)                                                                     | Automatic negotiation is an initial choice, not a substitute for user control     | First-visit locale default                            | Does not define URL routing                                     |
| [W3C Site Language Navigation](https://www.w3.org/International/questions/qa-site-conneg.en.html)                                                           | Offer a visible language choice and remember explicit selection                   | Public Settings language control                      | Content strategy remains NosLog-specific                        |
| [W3C Language Selector](https://www.w3.org/International/questions/qa-navigation-select)                                                                    | Use understandable language names and avoid flag-only language controls           | Korean, Japanese, and English choices                 | Does not define category layout                                 |
| [W3C Declaring Language](https://www.w3.org/International/questions/qa-html-language-declarations.html)                                                     | Document language metadata must match rendered language                           | Update `<html lang>` with locale                      | Does not define persistence                                     |
| [Google Search settings](https://www.google.com/preferences)                                                                                                | Guests can control browser-scoped language and display preferences                | Public Experience category                            | Google has a different preference set                           |
| [YouTube Language or Location](https://support.google.com/youtube/answer/87604)                                                                             | Language and location are distinct preferences with different consequences        | Keep locale independent from play region              | YouTube location semantics differ                               |
| [osu! Account Help](https://osu.ppy.sh/wiki/en/Help_centre/Account)                                                                                         | Rhythm-game identity and country changes require explicit account semantics       | Country consequence and identity separation           | osu! policy does not determine NosLog verification              |
| [osu! Ranking](https://osu.ppy.sh/wiki/en/Ranking)                                                                                                          | Country grouping affects competitive ranking context                              | Regional-ranking population explanation               | NOSTALGIA ranking rules remain authoritative                    |
| [Unicode CLDR Territory Names](https://cldr.unicode.org/translation/displaynames/countryregion-territory-names)                                             | Stable identifiers may use localized display names                                | Korea, Japan, and Other presentation                  | “Other” is a NosLog product grouping                            |
| [Discord OAuth2](https://docs.discord.com/developers/platform/oauth2-and-permissions)                                                                       | OAuth identity actions require explicit authorization boundaries                  | Refresh, account change, and recent reauthentication  | NosLog owns account-association policy                          |
| [Discord User Resource](https://docs.discord.com/developers/resources/user)                                                                                 | Discord fields originate from a remote identity record                            | Read-only derived Discord information                 | Available fields depend on scopes                               |
| [Discord Usernames](https://support.discord.com/hc/en-us/articles/12620128861463-New-Usernames-Display-Names)                                               | Username and display name are distinct Discord concepts                           | Avoid manual ambiguous Discord editing                | Discord terminology may change                                  |
| [Discord Connections FAQ](https://support.discord.com/hc/en-us/articles/32330173689623-Account-Connections-on-Discord-FAQ)                                  | Connection visibility and account connection are separate concerns                | Privacy toggle does not disconnect login              | Discord-native profile connections differ from NosLog           |
| [Google Profile Picture](https://support.google.com/accounts/answer/27442)                                                                                  | Users expect preview, change, and removal for profile images                      | Avatar workflow                                       | Google crop behavior is not copied                              |
| [GitHub Profile Personalization](https://docs.github.com/en/account-and-profile/tutorials/personalize-your-profile)                                         | Service identity fields should be clearly named and independently editable        | NosLog nickname boundary                              | GitHub naming rules differ                                      |
| [GOV.UK File Upload](https://design-system.service.gov.uk/components/file-upload/)                                                                          | State accepted types, size, errors, and recovery clearly                          | JPG/PNG/WebP and 4 MB avatar validation               | Crop is outside the component scope                             |
| [W3C Images Tutorial](https://www.w3.org/WAI/tutorials/images/)                                                                                             | Images need purpose-appropriate alternatives                                      | Avatar and preview semantics                          | Interactive crop needs additional controls                      |
| [W3C Personal Names](https://www.w3.org/International/questions/qa-personal-names.en)                                                                       | Names should not be constrained to one writing system or Western structure        | Unicode NosLog nickname                               | Product-safe punctuation and uniqueness remain NosLog decisions |
| [osu! Registration](https://osu.ppy.sh/wiki/en/Registration)                                                                                                | Rhythm-game community identity uses explicit uniqueness and naming rules          | Comparable nickname validation context                | NosLog deliberately supports different scripts and URLs         |
| [WAI-ARIA Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)                                                                                     | Searchable selection needs defined keyboard, focus, and popup behavior            | Preferred-arcade search                               | Exact visual composition remains downstream                     |
| [USWDS Combo Box](https://designsystem.digital.gov/components/combo-box/)                                                                                   | Long option sets benefit from filtering and robust status/error states            | Venue name and region filtering                       | Federal tokens do not transfer                                  |
| [Primer Autocomplete](https://primer.style/product/components/autocomplete/)                                                                                | Autocomplete should communicate results and selection clearly                     | Single preferred-arcade result                        | GitHub's use cases include multi-select                         |
| [Carbon Dropdown](https://carbondesignsystem.com/components/dropdown/usage/)                                                                                | Choose dropdown, combobox, or autocomplete from option-set size and task          | Avoid a map or long native select for growing venues  | Carbon terminology is not the final component name              |
| [Steam Privacy](https://help.steampowered.com/en/faqs/view/588C-C67D-0251-C276)                                                                             | Public identity and activity fields may have distinct visibility controls         | Five field-level privacy concepts                     | Steam's whole-profile modes are explicitly not adopted          |
| [Google Profile Visibility](https://support.google.com/accounts/answer/6304920)                                                                             | Explain which personal information other people can see                           | Positive consequence labels                           | Google has broader account ecosystems                           |
| [GitHub Delete Account](https://docs.github.com/en/enterprise-cloud%40latest/account-and-profile/how-tos/account-management/deleting-your-personal-account) | Deletion should enumerate consequences and require deliberate confirmation        | Structured NosLog consequence dialog                  | GitHub ownership-transfer rules do not apply                    |
| [Google Delete Account](https://support.google.com/accounts/answer/32046)                                                                                   | Explain data loss and unaffected external services                                | NosLog versus Discord/NOSTALGIA boundary              | Google offers export, which is not approved for NosLog 2.0      |
| [Discord Delete Account](https://support.discord.com/hc/en-us/articles/212500837-How-to-Delete-your-Discord-Account)                                        | Authentication-platform account lifecycle differs from connected-service deletion | Clarify Discord account remains                       | Discord deletion itself is outside NosLog                       |
| [Mozilla Delete Account](https://support.mozilla.org/en-US/kb/firefox-accounts-managing-account-data)                                                       | Permanent deletion needs clear scope and completion state                         | NosLog data groups and irreversible result            | Mozilla data categories differ                                  |
| [Steam Account Deletion](https://help.steampowered.com/ms/faqs/view/21A6-7C93-6CFE-100B)                                                                    | High-impact deletion uses confirmation and safeguards                             | Escalating friction                                   | Steam's grace-period policy is not adopted                      |
| [Microsoft Close Account](https://support.microsoft.com/en-US/accounts-billing/manage/how-to-close-your-microsoft-account)                                  | External subscriptions/services and account effects must be distinguished         | Unaffected NOSTALGIA/Discord explanation              | Microsoft ecosystem complexity is not NosLog's                  |
| [Atlassian Delete Account](https://support.atlassian.com/atlassian-account/docs/delete-your-atlassian-account/)                                             | Deletion status must account for distributed data and retry behavior              | Truthful completion and partial failure               | Organization ownership does not apply                           |
| [W3C Error Prevention](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html)                                              | User-controlled data deletion needs review, confirmation, or reversibility        | Consequence review, reauth, and exact phrase          | NosLog chooses confirmation because deletion is not reversible  |
| [WAI-ARIA Alert Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)                                                                              | Urgent confirmation needs semantic title, description, and controlled focus       | Final deletion warning                                | Not every settings dialog should use alertdialog                |
| [WAI-ARIA Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)                                                                             | Modal interactions need focus containment, Escape, and return                     | Account change and deletion dialogs                   | Processing-lock behavior is product-specific                    |
| [USWDS Modal](https://designsystem.digital.gov/components/modal/)                                                                                           | Modal content should be focused, concise, and operable at narrow widths           | Bounded consequence summary                           | USWDS styling does not transfer                                 |
| [Google Download Data](https://support.google.com/accounts/answer/3024190)                                                                                  | Raw data archives are a distinct portability workflow                             | Evidence for separating export from social sharing    | NosLog 2.0 explicitly excludes this capability                  |
| [Discord Data Package](https://support.discord.com/hc/en-us/articles/360004957991-Your-Discord-Data-Package)                                                | Data packages require generation, scope, download, and privacy rules              | Supports treating future export as a separate product | Discord package scope does not define NosLog data               |

## Rejected and Superseded Alternatives

- **Authenticated-only Settings — Rejected:** guests need usable language and theme
  preferences without authentication.
- **Separate guest settings route — Rejected:** one predictable destination is clearer
  and can reveal scope by authentication state.
- **One long authenticated form — Rejected:** unrelated persistence and consequence
  boundaries become unclear, especially on mobile.
- **Disabled authenticated categories for guests — Rejected:** they add length without
  enabling a task; a compact sign-in note is sufficient.
- **Mobile-only bottom settings navigation — Rejected:** it conflicts with the approved
  responsive top-shell model and does not transfer to wide layouts.
- **Theme synchronized to the account — Rejected:** device environment is the stronger
  owner; language and title visibility remain account-aware.
- **Dark as the universal default — Superseded:** System is the initial default while
  preserving prior explicit dark/light choices.
- **Language from country/region — Rejected:** UI language and play/ranking region are
  different user concepts.
- **Automatic locale negotiation overwriting explicit preference — Rejected:** direct
  links may render a locale without silently changing stored choice.
- **One global Save for every category — Rejected:** immediate display preferences and
  staged profile/privacy data require different commit timing.
- **Forced redirect to Profile after save — Rejected:** success remains in context;
  viewing the profile is a separate action.
- **Editable NOSTALGIA name — Rejected:** it is synced official game identity.
- **Forced-uppercase NosLog nickname — Superseded:** preserve user display form while
  enforcing normalized uniqueness.
- **Emoji in initial nickname rules — Rejected for 2.0:** defer until normalization,
  moderation, rendering, and search behavior are intentionally specified.
- **Map embedded in preferred-arcade settings — Rejected:** searchable single-select
  solves editing; full discovery remains in the Arcade family.
- **Silently clearing inactive preferred arcade — Rejected:** preserve user context and
  make unavailable status explicit.
- **Whole-profile private mode — Rejected:** use the approved five field concepts.
- **Negative `hide_*` labels — Superseded:** positive labels make On consistently mean
  public.
- **Separate Last played and Recent Plays controls — Rejected:** one Play activity
  control prevents contradictory partial visibility.
- **Manually editable Discord name — Rejected:** Discord owns its identity data.
- **Disconnect Discord — Rejected:** it is the sole login method.
- **Discord refresh changing NosLog profile choices — Rejected:** refresh only remote
  identity fields.
- **Deletion grace period — Rejected:** deletion is immediate after strong informed
  confirmation.
- **Deletion reason survey — Rejected:** it adds friction unrelated to safety.
- **Raw database table inventory in deletion dialog — Rejected:** concise user-centered
  groups and reliable counts communicate consequence better.
- **Raw account-data export in 2.0 — Rejected:** no verified immediate requirement;
  future portability is a separate researched capability.
- **Treating profile-card Share as data export — Rejected:** social presentation and
  machine-readable backup have different users, content, and risk.

## Decision Log

| ID     | Decision                                                                                                                              | Status       |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| SET-01 | Use one public locale-prefixed `/[locale]/settings` destination for guests and authenticated users                                    | `Approved`   |
| SET-02 | Preserve selected category in direct URL and browser history; exact syntax remains implementation mapping                             | `Approved`   |
| SET-03 | Use Experience, Profile, Privacy, Connections, and Account in that order                                                              | `Approved`   |
| SET-04 | Guests see usable Experience plus a compact sign-in note, not disabled account controls                                               | `Approved`   |
| SET-05 | Compact layouts use overview-to-category navigation; wide layouts use persistent list-detail                                          | `Approved`   |
| SET-06 | Language is immediate, locale-prefixed, account-owned when signed in, and browser-owned as guest                                      | `Approved`   |
| SET-07 | Direct locale URLs render that locale without overwriting a stored explicit preference                                                | `Approved`   |
| SET-08 | Theme offers System, Dark, and Light and remains device-local                                                                         | `Approved`   |
| SET-09 | New users default to System; migrate existing explicit dark/light choices                                                             | `Approved`   |
| SET-10 | Earlier direction added an immediate localized/reading-title visibility preference                                                    | `Superseded` |
| SET-11 | Profile and Privacy each use an explicit category Save with dirty protection                                                          | `Approved`   |
| SET-12 | Save remains in category and offers a separate View my profile action                                                                 | `Approved`   |
| SET-13 | Avatar supports JPG/PNG/WebP up to 4 MB, staged 1:1 crop, circular preview, change, and remove                                        | `Approved`   |
| SET-14 | Failed avatar save preserves the existing public avatar                                                                               | `Approved`   |
| SET-15 | NosLog nickname is separate from NOSTALGIA official player name                                                                       | `Approved`   |
| SET-16 | Nickname supports approved Unicode scripts and punctuation, display preservation, and normalized uniqueness                           | `Approved`   |
| SET-17 | Keep numeric profile URLs canonical across nickname changes                                                                           | `Approved`   |
| SET-18 | NOSTALGIA official player name stays synced, uppercase, read-only, and privacy-controlled                                             | `Approved`   |
| SET-19 | Country/region means main play and regional-ranking region, independent from language                                                 | `Approved`   |
| SET-20 | Country change uses a short consequence confirmation without proof or long cooldown                                                   | `Approved`   |
| SET-21 | Preferred arcade uses searchable single-select, Clear, discovery link, and unavailable-value retention                                | `Approved`   |
| SET-22 | Settings venue edits are staged; arcade-detail contextual set action may be immediate                                                 | `Approved`   |
| SET-23 | Use five positive privacy controls; On always means public                                                                            | `Approved`   |
| SET-24 | One Play activity control owns Last played and Recent Plays                                                                           | `Approved`   |
| SET-25 | Discord identity is read-only and refreshed through OAuth without overwriting NosLog profile fields                                   | `Approved`   |
| SET-26 | Change login account is a separate confirmed sensitive OAuth action                                                                   | `Approved`   |
| SET-27 | Do not expose Disconnect while Discord is the sole login method                                                                       | `Approved`   |
| SET-28 | Logout preserves device-local and guest browser preferences                                                                           | `Approved`   |
| SET-29 | Keep Privacy globally in the footer while allowing contextual deletion access                                                         | `Approved`   |
| SET-30 | Account deletion is immediate, permanent, and preceded by grouped consequences and reliable counts                                    | `Approved`   |
| SET-31 | Require recent Discord reauthentication and an exact localized phrase before deletion                                                 | `Approved`   |
| SET-32 | Deletion processing prevents duplicates/dismissal and reports partial failure truthfully                                              | `Approved`   |
| SET-33 | Complete deletion clears session and sensitive cache, returns to localized Home, and does not restore later                           | `Approved`   |
| SET-34 | Discord and official NOSTALGIA accounts remain unaffected by NosLog deletion                                                          | `Approved`   |
| SET-35 | Exclude raw account-data export from NosLog 2.0 Settings                                                                              | `Rejected`   |
| SET-36 | Keep profile-card Share separate as a social profile feature, never relabel it as export                                              | `Approved`   |
| SET-37 | Future raw export, if justified, requires its own product, privacy, and operational brief                                             | `Approved`   |
| SET-38 | Remove the localized/reading-title preference; original titles are persistent and translation disclosure belongs only to Music Detail | `Approved`   |

## Handoff Boundary

Claude Design must preserve the approved categories, order, authentication scope,
immediate versus explicit-save boundaries, profile concepts, positive privacy meaning,
Discord constraints, and deletion safeguards. It may determine final typography,
spacing, component styling, and content-driven transition within the future approved
Foundation. It must not turn Settings back into one long form, expose account controls
to guests as disabled clutter, make NOSTALGIA identity editable, add Discord
disconnect, weaken deletion verification, or present profile-card Share as a backup.

The future Codex implementation session must reconcile schema, migration, OAuth,
storage, route, and test implications before coding. If an implementation limitation
would merge persistence boundaries, lose existing preferences, make deletion
non-idempotent, or prevent the approved multilingual responsive behavior, report the
conflict and obtain a guide revision instead of silently weakening this contract.
