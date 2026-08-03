# NosLog 2.0 Authentication and Onboarding Page Brief

## Document Control

- Status: `Approved`
- Decision status: `Complete authentication and onboarding contract approved:
one Discord OAuth entry; public browsing without authentication; destination-aware
safe return; concise data disclosure; minimal nickname and country/region onboarding;
visible Discord account confirmation; incomplete-profile gating; explicit
logout-and-browse escape; accessible error recovery; responsive authentication shell;
and Korean, Japanese, and English parity`
- Evidence status: `Repository, schema, tests, current-interface, and browser
inspection at 320, 390, and 1280 CSS px; approved information-architecture,
shared-shell, settings, and profile contracts; more than twenty cited accessibility,
security, design-system, production-service, and rhythm-game references; and the
user-approved decision record`
- Date started: 2026-08-03
- Last decision update: 2026-08-03
- Canonical language: English
- Korean companion:
  [17-authentication-onboarding-page-brief.ko.md](./17-authentication-onboarding-page-brief.ko.md)
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Shared-shell contract:
  [15-shared-shell-navigation-brief.md](./15-shared-shell-navigation-brief.md)
- Settings and account contract:
  [16-settings-account-page-brief.md](./16-settings-account-page-brief.md)
- Privacy and data-practices contract:
  [18-privacy-data-practices-page-brief.md](./18-privacy-data-practices-page-brief.md)
- Profile contract: [09-profile-page-brief.md](./09-profile-page-brief.md)
- Scope: signed-out Login, Discord OAuth entry and callback recovery, initial profile
  completion, incomplete-profile gating, safe destination return, authentication
  shell content, responsive behavior, accessibility, localization, states, data
  boundaries, and future implementation acceptance
- Excluded: final visual styling, exact Foundation tokens and dimensions, final
  localized copy, another login provider, password authentication or recovery,
  administrator authentication redesign, legal advice, production OAuth
  implementation, database migration, and high-fidelity page design

## Decision Labels

- **Observed:** Verified in the repository, current browser evidence, an approved
  upstream artifact, or a cited source.
- **Approved:** Explicitly agreed with the user and authoritative for downstream design.
- **Proposed:** Evidence-based direction awaiting user approval.
- **Open:** Requires further research, testing, or a user decision.
- **Rejected:** Considered and explicitly not selected.
- **Superseded:** Replaced by a later approved direction.

This brief is authoritative for the authentication and onboarding product meaning,
information order, transitions, permissions, recovery, responsive adaptation,
accessibility, and acceptance criteria. Claude Design may define final visual
composition within the later approved Foundation, but it must not add login methods,
split Login and registration, collect additional onboarding data, change the
incomplete-profile gate, or remove the approved public-browsing escape.

## Purpose

Authentication lets a visitor deliberately connect one Discord identity to NosLog
without obscuring what data is used or blocking public exploration. Onboarding creates
the minimum complete NosLog identity required for personal records, rankings,
regional context, and public profile behavior.

The family must answer six questions:

1. Why is authentication needed for the action the user just selected?
2. Which external identity and minimum data will NosLog use?
3. Can the user continue exploring public content without authentication?
4. Which two NosLog profile values must a new user provide?
5. What happens if authentication, onboarding, or the session fails?
6. Where does the user return after successful completion or intentional exit?

## Primary Context and Success

- **Approved:** Login is used from the signed-out header and whenever an account-only
  action requires authentication.
- **Approved:** Public music, charts, rankings, tiers, announcements, arcades, and
  other approved public information remain explorable without a NosLog account.
- **Approved:** A signed-out visitor succeeds when they can understand the single
  Discord action, the data boundary, the destination after completion, and the
  public-browsing alternative.
- **Approved:** A new authenticated user succeeds when they can confirm the Discord
  account, create a NosLog nickname, select a country/region, and reach the original
  safe destination without an extra celebration or configuration step.
- **Approved:** An incomplete account is never left in an ambiguous partially usable
  personalized state. It completes onboarding or explicitly logs out and returns to
  public Home.
- **Approved:** A returning complete account bypasses onboarding and returns directly
  to the safe requested destination, or localized Home when none exists.
- **Approved:** Korean, Japanese, and English preserve identical meaning, action
  priority, error recovery, and data disclosure.

## Current-Product Evidence

### Repository and Data Evidence

- **Observed:** Discord OAuth is the sole login method. The authorization request uses
  the `identify` scope and the callback retrieves Discord `id`, `username`,
  `global_name`, and `avatar`.
- **Observed:** NosLog stores the stable Discord user ID as the account link. The
  current callback does not persist a Discord password or OAuth access token after
  retrieving identity.
- **Observed:** The current OAuth start route stores a one-time state value and an
  internal-looking `returnTo` value in the session. The callback consumes both before
  validating the response.
- **Observed:** A complete returning account may return to the stored destination, but
  a new account is sent to onboarding and current onboarding completion always sends
  the user to Home. The original destination is therefore lost across onboarding.
- **Observed:** A Discord authorization cancellation without a code currently falls
  into the same visible error family as an invalid or expired state.
- **Observed:** Login currently maps configuration, token exchange, profile retrieval,
  account-linking, and user lookup failures to localized messages, but some messages
  expose operator-oriented meaning instead of user recovery.
- **Observed:** The current session cookie is HTTP-only, SameSite Lax, secure in
  production, and configured for a fourteen-day lifetime. Exact future lifetime is a
  security and implementation policy, not a visual-design decision in this brief.
- **Observed:** An incomplete authenticated profile is currently redirected to
  onboarding from all ordinary user routes. A completed profile cannot reopen
  onboarding.
- **Observed:** Current onboarding asks for one NosLog username and one country/region
  radio choice. It does not ask for avatar, preferred arcade, data sync, privacy,
  tutorial, or NOSTALGIA player data.
- **Observed:** Current onboarding uppercases the NosLog username and derives the UI
  locale from country. Both behaviors conflict with the approved Settings contract:
  NosLog nickname preserves approved Unicode display, and country/region is independent
  from language.
- **Observed:** Current onboarding has no explicit logout or public-browsing escape,
  no visible confirmation of which Discord account is connected, and no preserved
  original destination.
- **Observed:** Current server validation preserves duplicate-nickname and generic
  failure messages, but field association, error focus, and dynamic status semantics
  are incomplete.

### Browser Evidence

- **Observed:** The signed-out Login was inspected on the separate local
  `127.0.0.1` origin because the existing `localhost` session was already signed in.
  No protected content or account data was accessed through that signed-out origin.
- **Observed:** Korean Login at 320 CSS px had no horizontal overflow and exposed the
  NosLog identity, one Discord action, a Privacy link, and a browse-without-login
  action.
- **Observed:** Korean, Japanese, and English Login retained the same semantic content
  at 320 CSS px.
- **Observed:** At 1280 CSS px, the current Login remained an approximately 390px
  centered column and left most wide space unused. That fixed composition is current
  evidence, not 2.0 authority.
- **Observed:** The current OAuth error message is visible, but the inspected error
  container had no error or live-region role.
- **Observed:** Signed-out onboarding redirects to Login, and a completed signed-in
  account visiting onboarding redirects to Home.
- **Observed:** A live incomplete-profile browser specimen was not available without
  creating or mutating a user account. The onboarding visual was therefore verified
  from repository evidence only. The future acceptance suite must include a seeded
  incomplete account.

## Research Synthesis

### Convergent Findings

1. Authentication entry works best when one primary action reflects the actual
   identity provider and secondary paths do not compete with it.
2. Login and registration should not be presented as different choices when one
   federated action determines whether the linked account already exists.
3. Onboarding should request only information necessary to establish a usable account;
   optional profile, preference, education, and synchronization tasks belong later in
   context.
4. A one-screen, two-field completion task does not benefit from a multi-step progress
   indicator.
5. Federated authentication should identify the provider, disclose the relevant data
   use, request the least privilege, use a durable provider ID, validate state, and
   return only to trusted internal destinations.
6. A user should be able to identify the external account being connected and recover
   from choosing the wrong account without completing the service profile.
7. Required authentication and onboarding errors need concise textual meaning,
   programmatic notification, preserved input, and a clear retry or exit.
8. Public exploration remains a distinct product path. An account gate should protect
   personal actions without falsely implying that all public NosLog value requires
   login.
9. Responsive authentication remains a focused task column; wide space does not
   justify adding marketing carousels, unrelated navigation, or a second information
   hierarchy.

### NosLog-Specific Fit

- NosLog has exactly one authentication provider and does not manage a password.
  Separate “Login,” “Register,” and “Forgot password” flows would describe capabilities
  that do not exist.
- Discord identity establishes account ownership, while the NosLog nickname is the
  public service identity. Showing both during onboarding prevents wrong-account
  completion without merging their meanings.
- Country/region affects regional rankings and primary play context, not interface
  language.
- Arcade-adjacent mobile use favors a short completion task and reliable return to the
  chart, tier, bingo, exam, sync, or profile action that prompted authentication.
- A hard completion gate avoids partially initialized personal records and rankings.
  The explicit logout-and-browse path preserves public access without requiring every
  personalized surface to support an incomplete account.

## Approved Authentication Model

### State and Transition Map

| Starting state                        | Trigger                                 | Required transition                | Success destination                                 | Exit or failure                                    |
| ------------------------------------- | --------------------------------------- | ---------------------------------- | --------------------------------------------------- | -------------------------------------------------- |
| Signed out                            | Header Login                            | Login → Discord OAuth              | Localized Home for complete account                 | Retry or browse public Home                        |
| Signed out                            | Account-only action                     | Contextual Login → Discord OAuth   | Original validated destination for complete account | Retry or return to the public context              |
| Signed out, new Discord identity      | Any Login entry                         | Login → Discord OAuth → Onboarding | Original validated destination, else localized Home | Logout and browse public Home                      |
| Signed in, profile incomplete         | Any ordinary or account-dependent route | Redirect to Onboarding             | Original validated destination after completion     | Logout and browse public Home                      |
| Signed in, profile complete           | Login or Onboarding route               | Bypass auth surface                | Localized Home or preserved valid destination       | Not applicable                                     |
| Session expired during protected task | Protected action                        | Contextual Login                   | Resume safe destination after success               | Preserve safe non-sensitive context; retry or Home |
| OAuth cancelled or invalid            | Discord callback                        | Login recovery state               | Retry then follow original safe return              | Browse public context or Home                      |

### Return-Destination Contract

- Preserve the intended destination across Login, Discord OAuth, and Onboarding.
- Accept only normalized internal user destinations that belong to the NosLog origin
  and approved locale-prefixed user routing.
- Reject external URLs, protocol-relative URLs, authentication callback routes,
  API/framework routes, administrator routes unless separately authorized, and any
  malformed or recursively gated destination.
- Store and validate the destination on the server-side flow; do not trust a client
  label or arbitrary query value as authorization.
- Display a localized, concise context line when the destination is meaningful, such
  as “After login, you will return to your profile.” Do not expose raw paths.
- If validation fails or no destination exists, use localized Home.
- On logout from incomplete onboarding, go to localized public Home rather than the
  protected destination, preventing an immediate login loop.

## Login Contract

### Information and Action Order

1. skip link to `main`;
2. NosLog identity linked to localized Home;
3. Login heading and one concise purpose line;
4. optional destination-context line when authentication was action-triggered;
5. one primary `Continue with Discord` action;
6. concise Discord data-use statement with an inline Privacy link;
7. secondary `Browse without login` text action;
8. ordinary trust footer from the minimal authentication shell.

### Primary Action

- Use one Discord-branded action with localized text equivalent to “Continue with
  Discord.”
- Do not split Login and registration. The callback determines whether to resume an
  account or create an incomplete one.
- Do not add email, password, passkey, Steam, Google, X, or NOSTALGIA credentials.
- Request only Discord `identify`. Adding email, guild, or other scopes requires a
  new verified product need, privacy review, and user approval.
- After activation, expose a busy state and prevent duplicate starts without changing
  the action's accessible name into an unexplained spinner.

### Data and Privacy Disclosure

- Place a concise statement directly after the primary action explaining that NosLog
  receives the Discord identifier, display name, username, and avatar for account
  authentication and initial identity.
- Provide an inline localized Privacy link because the disclosure belongs to the
  authentication decision. Privacy remains in the ordinary footer elsewhere and does
  not become a header or More-panel destination.
- Do not add a separate mandatory consent checkbox unless later legal review requires
  distinct recorded consent. The action and adjacent disclosure must not imply access
  to email, guilds, messages, contacts, or the user's Discord password.
- Never present Discord authorization as NOSTALGIA, KONAMI, or e-amusement login.

### Public-Browsing Alternative

- Keep one secondary text action to leave authentication and browse public NosLog.
- From a general Login entry, it opens localized Home.
- From an action-triggered Login, it returns to the previous safe public context when
  available; otherwise it opens localized Home.
- The secondary action must remain visibly and programmatically distinct from the
  primary Discord action without becoming another filled button of equal weight.

## Onboarding Contract

### Purpose and Information Order

Onboarding is account completion, not a product tour or Settings substitute.

1. skip link to `main`;
2. NosLog identity;
3. onboarding heading and concise purpose;
4. destination reason when entry resulted from a protected destination;
5. compact connected-Discord confirmation;
6. NosLog nickname field;
7. country/region single choice;
8. one completion action;
9. `Log out and browse` secondary text action;
10. ordinary trust footer.

### Connected Discord Confirmation

- Show the Discord avatar and display name in a compact read-only identity row.
- Label the row as the connected login account; do not present it as the editable
  NosLog nickname or NOSTALGIA player name.
- Do not expose the raw Discord ID.
- The approved escape for a wrong account is `Log out and browse`; a future explicit
  account-change flow remains governed by Settings after account completion.
- If the Discord avatar is absent or cannot load, retain the display name and an
  accessible fallback avatar without blocking completion.

### NosLog Nickname

- Use the same nickname concept, allowed Unicode scripts and punctuation, display
  preservation, normalized uniqueness, and canonical numeric profile identity as the
  Settings contract.
- Do not force uppercase. NOSTALGIA's official player name remains a different,
  synchronized uppercase concept.
- Explain the field as the name shown in NosLog, not the Discord name and not the
  official NOSTALGIA name.
- Server validation remains authoritative. On conflict or invalid input, preserve the
  entered value and associate concise correction guidance with the field.
- Do not ask the user to re-enter the Discord display name.

### Country or Region

- Offer Korea, Japan, and Global/Other using localized labels whose meaning remains
  consistent across languages.
- Explain that this choice represents the main play and regional-ranking region.
- Do not use it to change the interface language.
- The initial account language and localized-title preference inherit the approved
  explicit guest preference when one exists; otherwise they follow the approved
  browser-locale defaults.
- A later change follows the Settings country/region consequence confirmation; initial
  onboarding selection does not need that change warning.

### Explicitly Excluded Onboarding Content

- avatar upload or crop;
- preferred arcade;
- profile-visibility controls;
- data-sync installation;
- NOSTALGIA player-name entry;
- gameplay history, rating, grade, or record import;
- feature tour, slideshow, checklist, or celebration page;
- notification, newsletter, or marketing consent;
- theme and localized-title controls already inherited from guest preferences;
- a progress indicator for this one-screen task.

## Incomplete-Profile Gate

- A newly created account enters Onboarding before any ordinary personalized
  destination or authenticated Home state.
- While the authenticated profile remains incomplete, requests outside the permitted
  OAuth callback, Onboarding, logout, and required recovery endpoints redirect to
  Onboarding.
- A direct request for personal Profile, Settings account categories, Bingo editing,
  Exam submission, Data Sync, or another account-dependent action follows the same
  redirect rule.
- Do not show a warning modal before redirecting. The destination-aware reason is
  rendered inside Onboarding, immediately before the form context.
- Example reason: “Complete your account setup to use your profile.” Final localized
  wording remains a content-design task.
- After successful completion, return directly to the original validated destination.
  Do not insert another mandatory confirmation or celebration page.
- `Log out and browse` destroys the authenticated session, preserves approved
  device-local guest preferences, and opens localized public Home.
- Logging in again with the same Discord identity resumes the incomplete Onboarding;
  it does not create a duplicate account.
- A completed account visiting Onboarding is redirected away and never sees or edits
  profile fields through this initial-completion surface.

## Form Submission and Persistence

- Nickname and country/region commit together as one explicit onboarding submission.
- Submit remains disabled only when the form is invalid or already processing; do not
  require an unrelated checkbox.
- Prevent duplicate submission and expose a textual or semantic busy state.
- On validation or network failure, preserve nickname, selected region, connected
  identity context, and safe return destination.
- Completion must be atomic from the user's perspective: do not claim success until
  the profile is complete and the authenticated session reflects that state.
- Country/region must not overwrite the active language.
- Successful completion may announce a concise one-time status at the destination,
  but the status must not become an extra page or block the destination task.

## Error and Recovery Contract

| State                                                             | User-facing meaning                                     | Primary recovery                    | Secondary recovery                    |
| ----------------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------- | ------------------------------------- |
| Discord authorization cancelled                                   | Login was not completed                                 | Try Discord again                   | Browse public NosLog                  |
| OAuth state missing, invalid, or expired                          | The Login attempt expired or could not be verified      | Start Login again                   | Browse public NosLog                  |
| Discord temporarily unavailable                                   | NosLog could not complete Discord authentication        | Retry                               | Browse public NosLog                  |
| Identity retrieval failed                                         | NosLog could not confirm the Discord account            | Retry                               | Browse public NosLog                  |
| Discord identity already connected elsewhere during a change flow | The selected identity belongs to another NosLog account | Return to existing account settings | Feedback/error report when unresolved |
| Server or configuration fault                                     | Login is temporarily unavailable                        | Retry later                         | Browse public NosLog                  |
| Session expired before protected action                           | Login is required again                                 | Login and return                    | Return to public context              |
| Nickname conflict                                                 | The nickname is unavailable                             | Edit nickname and submit            | None                                  |
| Invalid nickname                                                  | The nickname does not meet the stated rules             | Correct the identified field        | None                                  |
| Region missing                                                    | One region is required                                  | Select a region                     | None                                  |
| Onboarding save failed                                            | Account setup was not completed                         | Retry with preserved input          | Log out and browse                    |
| Return destination rejected                                       | The requested destination was unsafe or unavailable     | Continue to localized Home          | None                                  |

- Never expose client secrets, provider responses, stack traces, raw callback
  parameters, database codes, or “check configuration” operator instructions.
- Distinguish user cancellation, expiry/security validation, provider failure, and
  service failure even when they share one visual error pattern.
- Error text identifies what happened and the next useful action without blaming the
  user.
- Dynamic errors and busy/completion states use appropriate live-region or status
  semantics. Do not over-announce every keystroke.
- When a submitted form has errors, focus a concise error summary when useful and make
  the first invalid control predictably reachable. Associate field errors through
  native labels and descriptions.

## Responsive Layout Contract

### Compact and Mobile

- Use one fluid task column with content-driven inline padding; do not set the
  application or shell to a fixed 390px width.
- Reflow through 320 CSS px without horizontal page scrolling.
- Keep identity, purpose, connected-account confirmation, form, and escape in one
  semantic order.
- Do not use a bottom navigation, full ordinary header, decorative side illustration,
  or modal onboarding.
- Long Korean, Japanese, and English error and disclosure text wraps without reducing
  touch-target size or obscuring the primary action.
- The form may scroll vertically on short viewports; the completion action must not
  cover focused fields or error text.

### Wide Layout

- Retain one focused task column with a readable maximum line length and fluid outer
  space.
- The final Foundation may modestly widen the form compared with compact view, but it
  must not preserve the current approximately 390px width as a universal fixed canvas.
- Do not add a second marketing panel, testimonial carousel, feature list, or ordinary
  product navigation merely to fill desktop space.
- The connected identity and two fields may use available inline space only when the
  content remains one clear completion sequence.

## Accessibility Contract

- Keep the shared-shell first-focusable skip link, one `main`, NosLog Home link, and
  ordinary trust footer.
- Use one page `h1`; visible labels for nickname; and `fieldset`/`legend` or an
  equivalent native grouping for country/region.
- The Discord action has an accessible name that identifies both the action and
  provider. Provider iconography is decorative when the text already names Discord.
- Do not rely on color, Discord avatar, or icon alone to communicate account,
  selection, busy, success, or error state.
- Associate guidance and errors with their fields. Use `aria-invalid` only when
  invalid and preserve an understandable error message in text.
- Busy states remain announced and prevent accidental duplicate activation.
- Authentication recovery and public-browsing actions remain keyboard reachable in
  logical order.
- Redirected destination context is conveyed by text, not only by a changed URL.
- Focus after redirect lands at the page heading or a concise contextual error/reason
  region according to the task; successful return restores a predictable page
  starting point without attempting to focus a missing old element.
- Meet WCAG 2.2 AA contrast, focus appearance, target size, reflow, accessible
  authentication, error identification, error suggestion, and status-message
  requirements.

## Localization and Content Contract

- Provide complete Korean, Japanese, and English Login, Onboarding, disclosure,
  destination-context, error, busy, logout, and completion strings.
- Keep one semantic action vocabulary across languages: continue with Discord,
  complete account setup, log out and browse, retry, and browse without login.
- Do not translate `NosLog`, `Discord`, route identifiers, OAuth terms in
  implementation mapping, or the official all-capital `NOSTALGIA` service name into
  a different product identity.
- Localize region display labels but preserve stable stored values.
- Do not derive language from country/region.
- Context lines use human destination names rather than interpolated paths.
- Error copy may expand significantly in Japanese or English; no control placement may
  depend on Korean string length.
- Final legal wording requires privacy/legal review, but the approved product data
  boundary and minimum disclosure cannot be removed by copy editing.

## Data and Representative Content Requirements

Design and implementation specimens must include:

1. complete returning account and new incomplete account;
2. Discord display name shorter than 8 characters and longer than 24 characters;
3. available and conflicting NosLog nicknames in Korean, Japanese, Latin, digits, and
   approved punctuation;
4. Korea, Japan, and Global/Other region choices in all three interface languages;
5. a direct Login with no return target;
6. a contextual Login returning to Profile and one other account-dependent page;
7. user-cancelled OAuth, expired state, provider failure, and service failure;
8. missing Discord avatar with a usable fallback;
9. onboarding validation and server failure with preserved input;
10. 320, 390, intermediate, and 1280 CSS px layouts;
11. keyboard-only completion and screen-reader error/status behavior;
12. logout-and-browse followed by a later Login that resumes the same incomplete
    account.

## Implementation Mapping

| Concern              | Current source                                                                               | Required 2.0 mapping                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Authentication shell | [`app/(auth)/layout.tsx`](<../../app/(auth)/layout.tsx>)                                     | Preserve minimal identity, skip route, one main, trust footer, and fluid responsive width                                   |
| Login page           | [`app/(auth)/login/page.tsx`](<../../app/(auth)/login/page.tsx>)                             | One Discord action, destination context, data disclosure, Privacy, public-browse exit, classified recovery                  |
| OAuth start          | [`app/(auth)/discord/start/route.ts`](<../../app/(auth)/discord/start/route.ts>)             | Server-side trusted return destination, one-time state, least `identify` scope                                              |
| OAuth callback       | [`app/(auth)/discord/complete/route.ts`](<../../app/(auth)/discord/complete/route.ts>)       | Distinguish cancellation and security expiry, preserve return across new-user onboarding, retain stable Discord ID behavior |
| Onboarding page      | [`app/(auth)/onboarding/page.tsx`](<../../app/(auth)/onboarding/page.tsx>)                   | Destination reason, Discord identity row, approved two-field form, logout-and-browse                                        |
| Onboarding form      | [`components/onboarding/onboardingForm.tsx`](../../components/onboarding/onboardingForm.tsx) | Settings nickname rules, region grouping, associated errors, busy protection, no language mutation                          |
| Onboarding action    | [`app/(auth)/onboarding/actions.ts`](<../../app/(auth)/onboarding/actions.ts>)               | Atomic completion, preserved guest preferences, country-language independence, safe return                                  |
| Completion route     | [`app/(auth)/onboarding/complete/route.ts`](<../../app/(auth)/onboarding/complete/route.ts>) | Return to validated destination or localized Home without extra page                                                        |
| Gate and locale      | [`proxy.ts`](../../proxy.ts)                                                                 | Incomplete-profile gate, completed-user bypass, session-expiry return, no unsafe redirect                                   |
| Session              | [`lib/session.ts`](../../lib/session.ts)                                                     | Preserve secure session properties; exact lifetime remains security policy                                                  |
| OAuth tests          | [`tests/discord-oauth.test.ts`](../../tests/discord-oauth.test.ts)                           | Add cancellation, invalid return, new-user preserved return, and recovery cases                                             |
| Onboarding tests     | [`tests/onboarding.test.ts`](../../tests/onboarding.test.ts)                                 | Add display-preserving nickname, language independence, identity confirmation data, logout, resume, and safe return         |
| Localization         | Current locale message catalogs                                                              | Add matched ko/ja/en destination, disclosure, state, and recovery strings                                                   |

The table maps approved behavior to later work. It does not authorize production code
changes in this design-guide session.

## Browser Acceptance Contract

Future implementation is not accepted until the following are verified in the actual
browser:

1. signed-out general Login at 320, 390, intermediate, and 1280 CSS px;
2. Korean, Japanese, and English Login with no horizontal overflow;
3. contextual Login names the destination and returns to it after a complete-account
   OAuth flow;
4. a new seeded account preserves the destination through Onboarding;
5. Onboarding shows the correct Discord avatar/display name without exposing raw ID;
6. nickname and region errors preserve input and are programmatically associated;
7. country/region does not change the active UI language;
8. completion prevents duplicates, updates the session, and returns only to a validated
   internal destination;
9. direct Profile access by an incomplete account redirects to Onboarding, shows the
   contextual reason, and returns to Profile after completion;
10. `Log out and browse` clears the session and opens localized public Home;
11. signing in again with the same incomplete Discord account resumes Onboarding
    without duplicate-account creation;
12. OAuth cancellation, invalid/expired state, provider failure, and server failure
    show distinct useful recovery while public browsing remains available;
13. screen reader announces dynamic errors, busy state, and completion without
    duplicate or per-keystroke noise;
14. keyboard focus order follows identity, primary action/form, escape, and footer;
15. 320 CSS px reflow and 200%/400% zoom do not create two-dimensional page scrolling;
16. no Login, Onboarding, callback, or error page is indexed;
17. no Discord access token, secret, raw provider response, or unsafe return URL appears
    in the UI, client state, logs exposed to the browser, or navigation history.

The currently unavailable live incomplete-profile state must be covered by seeded E2E
and a real browser specimen before implementation acceptance. Unit, type, lint, and
build checks do not substitute for this stateful browser verification.

## Reference Matrix

| Source                                                                                                                                 | Transferable principle                                                               | NosLog application                                                         | Limitation                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [Apple HIG: Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding)                                      | Keep onboarding focused and postpone nonessential setup                              | Ask only nickname and region                                               | Native Apple guidance does not define NosLog web styling   |
| [W3C Forms Tutorial](https://www.w3.org/WAI/tutorials/forms/)                                                                          | Short forms, labels, grouping, validation, and notifications reduce abandonment      | One two-field form with native semantics                                   | Does not prescribe product hierarchy                       |
| [W3C Redundant Entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html)                                                | Do not ask for the same information twice in one process                             | Reuse Discord identity and guest preferences                               | Does not decide which NosLog fields are required           |
| [W3C Accessible Authentication](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum)                         | The whole authentication path must avoid cognitive barriers                          | One external provider action and understandable recovery                   | Provider-owned Discord UI remains outside NosLog control   |
| [W3C Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification)                                           | Identify the error and affected item in text                                         | Associated nickname and region errors                                      | Does not define final error styling                        |
| [W3C Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html)                                              | Provide a correction when known                                                      | Actionable nickname and retry guidance                                     | Security-sensitive errors may intentionally remain general |
| [W3C Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)                                                     | Dynamic results, busy states, and errors need programmatic exposure                  | OAuth/form status semantics                                                | Avoid making the experience overly chatty                  |
| [W3C User Notifications](https://www.w3.org/WAI/tutorials/forms/notifications/)                                                        | Preserve input, associate messages, and focus errors predictably                     | Onboarding recovery and error summary                                      | Example presentation is not a NosLog visual source         |
| [GOV.UK Button](https://design-system.service.gov.uk/components/button/)                                                               | Use one clear primary action and prevent duplicate submission                        | One Discord CTA and one completion action                                  | Government styling is not visual authority                 |
| [GOV.UK Create a username](https://design-system.service.gov.uk/patterns/create-a-username/)                                           | Ask for a custom username only when needed and explain uniqueness                    | NosLog public nickname with later editing                                  | GOV.UK's character model is not NosLog's Unicode rule      |
| [Carbon Progress Indicator](https://carbondesignsystem.com/components/progress-indicator/usage/)                                       | Do not use progress indicators for fewer than three steps                            | No progress UI for one-screen onboarding                                   | Carbon visual anatomy is not authority                     |
| [Microsoft Design: Reimagining our front door](https://microsoft.design/articles/reimagining-our-front-door/)                          | Calm, focused sign-in reduces clutter and dead ends                                  | Restrained Login and recovery paths                                        | Enterprise scale differs from NosLog                       |
| [Primer Feature Onboarding](https://primer.style/product/ui-patterns/feature-onboarding/)                                              | Context, proximity, dominance, dismissal, and return affect comprehension            | Destination reason and explicit exit                                       | Feature education is broader than account completion       |
| [Primer Getting Started](https://primer.style/product/getting-started/)                                                                | Familiar responsive patterns should remain inclusive                                 | Native form and predictable task order                                     | GitHub product context is different                        |
| [Atlassian Empty State](https://atlassian.design/foundations/content/designing-messages/empty-state)                                   | Keep messages concise with the next useful action                                    | Concise classified auth recovery                                           | Authentication errors are not ordinary empty states        |
| [OAuth 2.0 Security BCP, RFC 9700](https://datatracker.ietf.org/doc/rfc9700/)                                                          | Validate callbacks, prevent open redirects, and use state securely                   | Trusted internal return and state handling                                 | Engineering security authority, not page layout            |
| [Discord OAuth2](https://docs.discord.com/developers/platform/oauth2-and-permissions)                                                  | Scopes define provider data access                                                   | Retain only `identify`                                                     | Discord controls its own authorization screen              |
| [Discord User Resource](https://docs.discord.com/developers/resources/user)                                                            | Stable ID and profile fields have distinct meanings                                  | Durable account link plus display/avatar confirmation                      | Provider fields can change or be absent                    |
| [GitHub OAuth best practices](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/best-practices-for-creating-an-oauth-app) | Request minimal scope and store durable unique IDs                                   | Supports Discord minimal-scope and stable-ID boundary                      | GitHub permissions differ from Discord                     |
| [GitHub Authorizing OAuth apps](https://docs.github.com/en/apps/oauth-apps/using-oauth-apps/authorizing-oauth-apps)                    | Users should understand the app and requested information                            | Adjacent data disclosure and Privacy link                                  | GitHub's provider screen is not NosLog UI                  |
| [Google third-party access](https://support.google.com/accounts/answer/14012355)                                                       | Provider credentials and third-party accounts remain separate; review requested data | Explain that Discord password is not shared and NosLog account is separate | Google-specific fields and controls differ                 |
| [Steam Help: Sign in](https://help.steampowered.com/en/login)                                                                          | Primary sign-in and visible recovery coexist without broad site navigation           | Supports focused auth shell and secondary recovery                         | Steam uses passwords and QR, unlike NosLog                 |
| [osu! Registration](https://osu.ppy.sh/wiki/en/Registration)                                                                           | Rhythm-game services define a distinct public account identity and rules             | Supports explicit NosLog nickname meaning                                  | osu! manages its own password and account creation         |
| [Osekai INEX](https://inex.osekai.net/)                                                                                                | Public rhythm-game exploration can coexist with provider-linked account features     | Keep public browsing beside Discord authentication                         | Osekai uses osu! identity and a different feature set      |
| [Current Login](<../../app/(auth)/login/page.tsx>)                                                                                     | Establishes one Discord action, Privacy, and public-browse baseline                  | Preserve verified feature intent while replacing fixed composition         | Current hierarchy and errors are not 2.0 authority         |
| [Current Onboarding](<../../app/(auth)/onboarding/page.tsx>)                                                                           | Establishes two required fields and completion gate                                  | Preserve minimal domain requirements                                       | Uppercase and country-locale coupling are superseded       |

### Evidence Convergence

- Security sources converge on least privilege, durable provider identity, state
  validation, and trusted return destinations.
- Accessibility and form sources converge on short input, native semantics, associated
  errors, preserved values, and programmatic status.
- Production services converge on a focused sign-in task with visible recovery rather
  than a full product dashboard.
- Rhythm-game comparables support provider-linked account features alongside public
  exploration, but they do not override NosLog's Discord-only and two-field product
  contract.
- No credible evidence supports splitting Login and registration, collecting more
  onboarding fields, using a progress indicator, or treating country as language for
  NosLog.

## Rejected and Superseded Alternatives

- **Separate Login and registration controls — Rejected:** one Discord flow determines
  whether the account exists; two controls describe a false product distinction.
- **Add more identity providers — Rejected for 2.0:** no verified NosLog need or
  account-linking contract supports another provider.
- **Password reset or email recovery — Rejected:** NosLog stores no password or email
  authentication credential.
- **Make authentication mandatory for public exploration — Rejected:** public
  discovery is an approved service path.
- **Allow an incomplete authenticated profile to use personalized surfaces —
  Rejected:** it creates ambiguous identity, record, regional-ranking, and privacy
  states.
- **Show a warning modal before redirecting an incomplete profile — Rejected:** it adds
  a step without resolving the required form; destination context belongs in
  Onboarding.
- **Offer no escape from incomplete Onboarding — Superseded:** use explicit logout and
  public Home.
- **Discard the original destination after Onboarding — Superseded:** preserve one
  validated internal destination through the complete flow.
- **Use an arbitrary client `returnTo` URL — Rejected:** use server-validated,
  same-origin, approved user destinations only.
- **Show raw technical OAuth errors — Rejected:** classify cancellation, expiry,
  provider, and service recovery without secrets or operator instructions.
- **Use a mandatory consent checkbox — Rejected unless later legal review requires
  it:** concise adjacent disclosure and the explicit Discord action are the approved
  product pattern.
- **Force NosLog nickname uppercase — Superseded:** preserve the approved Unicode
  nickname; only official NOSTALGIA player name remains uppercase.
- **Derive language from country/region — Superseded:** language preference and play
  region are independent.
- **Add avatar, preferred arcade, privacy, data sync, or tutorial to Onboarding —
  Rejected:** these are optional later tasks or established Settings destinations.
- **Use a progress indicator — Rejected:** the approved task is one screen with two
  input groups.
- **Fix authentication content to a 390px application width — Superseded:** 390px is a
  representative review canvas, not a fixed width or breakpoint.
- **Add a wide marketing split-screen — Rejected:** wide adaptation must preserve the
  focused authentication task without speculative content.

## Decision Log

| ID      | Decision                                                                                         | Status     |
| ------- | ------------------------------------------------------------------------------------------------ | ---------- |
| AUTH-01 | Keep Discord as the only NosLog 2.0 authentication provider                                      | `Approved` |
| AUTH-02 | Use one “Continue with Discord” action; do not split Login and registration                      | `Approved` |
| AUTH-03 | Keep public browsing available without authentication                                            | `Approved` |
| AUTH-04 | Show a concise human destination context for action-triggered Login                              | `Approved` |
| AUTH-05 | Preserve one server-validated internal destination across Login, OAuth, and Onboarding           | `Approved` |
| AUTH-06 | Fall back to localized Home when no safe destination exists                                      | `Approved` |
| AUTH-07 | Request only Discord `identify`; do not imply password, email, guild, or message access          | `Approved` |
| AUTH-08 | Place concise Discord data disclosure and an inline Privacy link after the primary action        | `Approved` |
| AUTH-09 | Do not require a separate consent checkbox unless later legal review changes the requirement     | `Approved` |
| AUTH-10 | Use one-screen onboarding with NosLog nickname and country/region only                           | `Approved` |
| AUTH-11 | Show Discord avatar and display name as a compact read-only connected-account confirmation       | `Approved` |
| AUTH-12 | Reuse the Settings nickname rules and do not force uppercase                                     | `Approved` |
| AUTH-13 | Keep country/region independent from UI language                                                 | `Approved` |
| AUTH-14 | Inherit approved explicit guest language/title preferences for a new account                     | `Approved` |
| AUTH-15 | Do not add a progress indicator, tour, or extra profile/setup fields                             | `Approved` |
| AUTH-16 | Gate incomplete authenticated profiles through Onboarding before ordinary or personalized use    | `Approved` |
| AUTH-17 | Redirect direct Profile and other account-dependent access to Onboarding without a warning modal | `Approved` |
| AUTH-18 | Show a concise destination-aware reason inside Onboarding                                        | `Approved` |
| AUTH-19 | Return directly to the validated destination after successful completion                         | `Approved` |
| AUTH-20 | Provide “Log out and browse” and return to localized public Home                                 | `Approved` |
| AUTH-21 | Resume the same incomplete account on later Login; never create a duplicate                      | `Approved` |
| AUTH-22 | Distinguish OAuth cancellation, expiry/security, provider, and service failures                  | `Approved` |
| AUTH-23 | Preserve form input and expose associated, programmatic error and status feedback                | `Approved` |
| AUTH-24 | Use the minimal identity-plus-trust-footer shell without profile, More, or bottom navigation     | `Approved` |
| AUTH-25 | Use a fluid focused task column through 320 CSS px; do not fix the shell to 390px                | `Approved` |
| AUTH-26 | Keep the same semantic contract and recovery in Korean, Japanese, and English                    | `Approved` |
| AUTH-27 | Require a seeded incomplete account in future browser and E2E acceptance                         | `Approved` |

## Handoff Boundary

Claude Design must preserve the single Discord action, public-browse alternative,
destination context, adjacent disclosure, two-field onboarding, connected-account
confirmation, incomplete-profile gate, logout escape, safe return, error
classification, semantic order, and responsive/accessibility contracts. It may define
final typography, spacing, component styling, and content-driven width within the
later approved Foundation. It must not invent another provider, a Login/register
split, optional onboarding modules, a progress stepper, a warning modal before
Onboarding, or a desktop marketing panel.

The future Codex implementation session must map this brief to OAuth, session, proxy,
localization, database, unit, E2E, and browser behavior. If Discord platform policy,
privacy/legal review, or implementation security requires a materially different
scope, return flow, consent mechanism, or account state, report the conflict and obtain
a guide revision before implementation.
