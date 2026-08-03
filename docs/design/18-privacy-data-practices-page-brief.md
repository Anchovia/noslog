# NosLog 2.0 Privacy and Data-Practices Page Brief

## Document Control

- Status: `Approved with release blockers`
- Decision status: `Privacy experience approved: public localized policy; age-fourteen
account eligibility; layered at-a-glance disclosure plus complete policy; in-page
navigation; explicit public-profile consequences; verified no-collection statements;
differentiated service-provider, external-service, cookie, and device-storage
disclosure; settings and email rights paths; version history; responsive long-form
reading; and Korean, Japanese, and English parity. Final operator identity and legal
copy remain blocked on pre-release legal review.`
- Evidence status: `Repository, schema, deletion, retention, upload, session, OAuth,
localization, external-service, and deployment inspection; live Korean, Japanese,
and English browser inspection at 320, 390, and 1280 CSS px; approved Profile,
Settings, Authentication, Data Sync, Shared Shell, and information-architecture
contracts; more than twenty cited regulatory, accessibility, provider, and
production-service references; and the user-approved decision record`
- Date started: 2026-08-03
- Last decision update: 2026-08-03
- Canonical language: English
- Korean companion:
  [18-privacy-data-practices-page-brief.ko.md](./18-privacy-data-practices-page-brief.ko.md)
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Shared-shell contract:
  [15-shared-shell-navigation-brief.md](./15-shared-shell-navigation-brief.md)
- Settings and account contract:
  [16-settings-account-page-brief.md](./16-settings-account-page-brief.md)
- Authentication and onboarding contract:
  [17-authentication-onboarding-page-brief.md](./17-authentication-onboarding-page-brief.md)
- Profile privacy contract: [09-profile-page-brief.md](./09-profile-page-brief.md)
- Data Sync contract: [13-data-sync-page-brief.md](./13-data-sync-page-brief.md)
- Chart-contribution contract:
  [20-chart-editor-contribution-page-brief.md](./20-chart-editor-contribution-page-brief.md)
- Scope: public Privacy route, data-practice disclosure, public-data consequences,
  retention and deletion explanation, cookies and device storage, processors and
  external services, international transfers, age eligibility, privacy rights and
  contact paths, policy history, responsive reading, accessibility, localization,
  implementation mapping, and release acceptance
- Excluded: legal advice, final legally operative wording, autonomous publication of
  the operator's real name, final Foundation tokens and visual styling, a raw
  self-service account-data export, a cookie-consent platform selected without legal
  review, administrator privacy-operation redesign, production implementation,
  database or storage migration, and high-fidelity page design

## Decision Labels

- **Observed:** Verified in the repository, browser, deployment configuration, an
  approved upstream artifact, or a cited source.
- **Approved:** Explicitly agreed with the user and authoritative for downstream
  design and implementation.
- **Proposed:** Evidence-based direction awaiting user approval.
- **Open:** Requires research, operational verification, legal review, or a user
  decision before release.
- **Release blocker:** May be designed as a clearly marked placeholder but must not be
  represented as resolved or shipped as final copy.
- **Rejected:** Considered and explicitly not selected.
- **Superseded:** Replaced by a later approved direction.

This brief governs the NosLog 2.0 privacy experience and the consistency contract
between what the interface says and what the product actually processes. It is not a
substitute for legal review. Claude Design may define the final visual composition
inside the approved Foundation, but it must not simplify away a required disclosure,
invent a data practice, imply consent where no valid consent occurred, hide a public
consequence, or present a release blocker as resolved.

## Purpose

The Privacy page lets a visitor or account holder understand, without reading source
code, what NosLog receives, creates, stores, displays publicly, sends to service
providers, keeps, deletes, and deliberately does not collect. It also provides direct
ways to manage settings, delete an account, request privacy assistance, and inspect
earlier policy versions.

The page must answer nine questions in this order:

1. Who operates NosLog and which service does this notice cover?
2. What does NosLog collect, from which source, and for which purpose?
3. Which profile, record, ranking, or community data can other people see?
4. Which credentials, audio, location, advertising, and tracking data does NosLog not
   collect under the approved product contract?
5. How long is each meaningful category retained, and what happens on deletion?
6. Which processors, infrastructure providers, identity providers, embedded services,
   and external content origins receive data or connection metadata?
7. Which cookies and device-local preferences exist, how long do they last, and what
   breaks if they are removed?
8. How can a user access, correct, restrict, hide, or delete data?
9. What changed, when did it take effect, and where can an earlier version be read?

## Primary Context and Success

- **Approved:** Privacy is a public, locale-prefixed destination at
  `/[locale]/privacy`; no login is required.
- **Approved:** The ordinary-page Footer is the persistent global entry. Login,
  account deletion, uploads, external integrations, and other collection contexts may
  add a contextual Privacy link without moving Privacy into the More panel.
- **Approved:** A visitor succeeds when the first screen communicates the most
  consequential data practices and provides direct navigation to full detail.
- **Approved:** An account holder succeeds when they can understand public-profile
  effects and reach Settings, account deletion, or the privacy email without searching
  another page.
- **Approved:** A policy reader succeeds when every statement is specific enough to
  compare with real product behavior, not a generic list of things NosLog merely
  “may” do.
- **Approved:** The full policy remains available and searchable on one page. The
  concise first layer does not replace the complete notice.
- **Approved:** Korean, Japanese, and English expose the same material facts, rights,
  limitations, effective dates, and release blockers.
- **Approved:** NosLog account creation and authenticated account use are limited to
  people aged fourteen or older. Public browsing remains available regardless of
  account eligibility.
- **Open / release blocker:** Final legally operative copy, controller/operator
  identity, jurisdiction-specific legal bases, complaint channels, and consent
  requirements must receive qualified legal review before NosLog 2.0 release.

## Current-Product Evidence

### Current Policy and Route

- **Observed:** The current public route is implemented in
  [`app/(nevigation)/privacy/page.tsx`](<../../app/(nevigation)/privacy/page.tsx>)
  with complete Korean, Japanese, and English copy embedded in the page module.
- **Observed:** Current sections cover data and purposes, collection methods,
  retention, third-party provision, processors and international transfer, deletion,
  rights, cookies, security, contact, and changes.
- **Observed:** The current policy identifies the contact only as `NosLog operator`
  with an email address. The user has explicitly deferred publishing a real operator
  name.
- **Observed:** The page is public and indexable, uses the ordinary user shell, and is
  linked from the Footer.
- **Observed:** The content uses one `h1`, sequential `h2` section headings, and `h3`
  item headings. The language attribute changes correctly for Korean, Japanese, and
  English.
- **Observed:** There is no policy table of contents, concise practice summary,
  previous-version archive, separate last-updated date, or direct Settings action.

### Browser Evidence

- **Observed:** The current page was inspected live in Korean, Japanese, and English
  at 320, 390, and 1280 CSS px.
- **Observed:** None of the nine specimens created document-level horizontal overflow.
- **Observed:** At 320 CSS px, measured document height was approximately 3,705px in
  Korean, 4,273px in Japanese, and 4,816px in English.
- **Observed:** At 390 CSS px, measured document height was approximately 3,255px in
  Korean, 3,614px in Japanese, and 4,021px in English.
- **Observed:** At 1280 CSS px, the ordinary main content remained a centered 390px
  column. Korean was approximately 3,232px high and English approximately 3,931px high,
  leaving most wide space unused.
- **Observed:** The current mobile header still fits at 320 CSS px, but the long page
  requires repeated scrolling with no overview or section navigation.
- **Observed:** Heading order, Skip link, email link, localized Home link, and Footer
  links provide a useful semantic baseline that should be preserved.

### Account and Identity Data

- **Observed:** Discord OAuth requests only `identify`. It retrieves Discord ID,
  username, global display name, and avatar and does not request email, guild, message,
  or connection scopes.
- **Observed:** The callback uses a short-lived Discord access token to retrieve the
  identity and does not persist the access token or Discord password.
- **Observed:** The account stores a durable Discord identifier and display fields,
  NosLog username, NOSTALGIA player name, avatar reference, country/region, locale,
  localized-title preference, preferred arcade, public-visibility flags, role,
  official game metrics, and synchronization metadata.
- **Observed:** The approved Profile contract makes NosLog username, avatar,
  country-category identity, exams, competitive metrics, ranks, progress, Best Plays,
  rank distribution, and judgement summary public when data exists.
- **Observed:** The approved Profile contract adds five explicit user-controlled
  disclosures: NOSTALGIA player name, Discord identity, preferred arcade, Play count,
  and grouped Play activity covering both Last played and Recent Plays.
- **Observed:** The current schema supports only three of those five controls;
  preferred-arcade and Play-activity visibility require 2.0 implementation work.

### NOSTALGIA Records and Product Activity

- **Observed:** The bookmarklet runs on the official `p.eagate.573.jp` page, uses the
  user's existing official-site browser session to request player, recent-play, and
  full-record responses, and sends the returned record payload plus a signed NosLog
  sync token to NosLog.
- **Observed:** NosLog does not receive the user's BEMANI password or official-site
  session cookie.
- **Observed:** Stored game data includes profile totals, modes and grades, detailed
  best records, score, rank, combo, judgement counts, timing values, note-type rates,
  play count, full-combo and Pianist counts, recent play events, record snapshots,
  sync attempts, and timestamps.
- **Observed:** The approved Profile contract retains complete meaningful history
  without an arbitrary thirty-item cap and avoids duplicate events or identical
  snapshots.
- **Observed:** User-created or user-linked product activity can also include Bingo
  progress, exam submissions and achievements, chart evaluations and reactions,
  feedback reports, profile-card sharing, and future approved tier voting.
- **Observed:** Tier voting is an approved future capability but does not yet have a
  production schema. The policy and collection notice must be updated before that
  feature collects votes.

### Uploads, Retention, and Deletion

- **Observed:** Avatars use public Vercel Blob storage. Anyone with the URL can request
  a public Blob; Profile and Share artifacts may display the selected avatar.
- **Observed:** Exam evidence and feedback attachments use a separate private Vercel
  Blob store and are delivered only through an authorization-checked server path.
- **Observed:** Images are limited to JPEG, PNG, or WebP and 4MB; upload-token grants
  are rate-limited by user and purpose.
- **Observed:** Resolved feedback records and attachments are deleted six months after
  resolution.
- **Observed:** Approved exam evidence and reviewer notes are redacted six months after
  review while the approved achievement remains until account deletion.
- **Observed:** Rejected exam submissions and evidence are deleted six months after
  review.
- **Observed:** The retention Cron runs daily. Cleanup is batched and failures are
  counted and logged for later operational attention.
- **Observed:** Account deletion first attempts to remove known avatar, feedback, and
  exam Blobs, then deletes the User row and cascade-linked data, and finally destroys
  the session. A Blob failure prevents the active account row from being deleted so
  the system does not knowingly lose the file reference.
- **Observed:** Client flows try to discard canceled feedback and exam uploads, and
  replace old avatars after a successful save.
- **Open / release blocker:** A directly uploaded file can be abandoned before its URL
  is attached to a database record. A storage lifecycle or explicit orphan-upload
  cleanup guarantee is not currently demonstrated for every path.
- **Open / release blocker:** Current wording promises immediate permanent deletion
  without documenting managed-database point-in-time history, backups, CDN copies, or
  provider deletion windows. Exact active-system and backup expiration behavior must
  be verified before final wording.

### Cookies, Device Storage, Logs, and External Services

- **Observed:** `user_session_cookie` is essential, HTTP-only, SameSite Lax, Secure in
  production, and configured for up to fourteen days.
- **Observed:** `noslog-locale` is a non-HTTP-only language-preference cookie configured
  for one year. It is not disclosed in the current policy.
- **Observed:** Theme, chart-viewer metronome volume, and Strict Performance preference
  use browser local storage. These values remain on the device and are not account
  profile fields.
- **Observed and approved future scope:** Chart-editor piano visibility also uses local
  storage. The approved user contribution editor keeps this device-local preference
  and must disclose it alongside other editor preferences before release.
- **Observed:** The current codebase has no product analytics, advertising SDK,
  tracking pixel, or marketing profile dependency.
- **Observed:** The deployment uses Vercel Functions in `sin1`, and the configured Neon
  host resolves to AWS `ap-southeast-1` in Singapore.
- **Observed:** The current policy says both Blob stores are in Seoul `icn1`; the
  repository cannot independently verify the Blob dashboard setting.
- **Observed:** Kakao Maps loads its JavaScript SDK only on map experiences. X's
  official widget loads on Home with `data-dnt=true`. Discord OAuth, Discord avatar
  delivery, official NOSTALGIA assets and record pages, and external links can also
  transmit ordinary connection metadata to their respective operators.
- **Open / release blocker:** Exact Vercel log fields and retention, Neon history and
  backup retention, Blob regions and deletion lifecycle, subprocessor lists, and the
  legal classification of each external service require release-environment
  verification.
- **Open / release blocker:** Legal review must determine whether X, Kakao, or another
  nonessential third-party embed requires prior consent, a just-in-time notice, or a
  user-initiated load in any supported jurisdiction. This brief does not silently add
  or waive a consent gate.

## Research Synthesis

### Convergent Findings

1. A privacy notice must describe actual categories, purposes, retention, recipients,
   rights, automated collection, and contact routes rather than provide a generic
   disclaimer.
2. Required and optional processing, consent-based and non-consent processing, direct
   collection and external-source collection, and processor and third-party roles
   should remain distinguishable.
3. Key information should be available at or before collection and linked from stable
   service locations. A single footer link is necessary but contextual collection
   links remain useful.
4. A layered notice improves comprehension when the short layer identifies the
   operator, principal data categories, purposes, public consequences, and control
   routes while the complete policy remains accessible.
5. Long content benefits from descriptive headings and in-page navigation. Full legal
   meaning should not be hidden behind a large stack of closed accordions.
6. Data minimization, purpose limitation, precise retention, deletion, and truthful
   “we do not collect” statements are trust and engineering requirements, not only
   copywriting choices.
7. International services require specific, maintained disclosure. Static vendor
   claims become misleading when regions, subprocessors, or retention defaults change.
8. Public game records and rankings need an explicit public-consequence explanation.
   A public profile cannot rely on the user inferring visibility from the interface.
9. The account-rights path should combine direct self-service controls with a human
   contact route for requests the product cannot complete automatically.
10. Policy versions and effective dates help users and reviewers determine which data
    promise applied at a given time.
11. Multilingual translations must preserve legal meaning, not merely approximate the
    visual length of the source language.
12. Under-fourteen account access is not safe to introduce without a complete guardian
    consent and verification system. Restricting accounts to fourteen and older avoids
    inventing an unimplemented legal process while preserving public browsing.

### NosLog-Specific Conclusion

- **Approved:** Preserve the current full policy categories, but reorganize them around
  real product data and public consequences.
- **Approved:** Add one concise at-a-glance layer and in-page navigation; do not replace
  the policy with a summary.
- **Approved:** Treat Privacy as a living product contract synchronized with the
  schema, infrastructure, and approved page briefs.
- **Approved:** Explicitly disclose account data, NOSTALGIA record data, public
  profile/ranking consequences, submissions, community activity, service operations,
  cookies, and device-only preferences.
- **Approved:** Explicitly state verified non-collection boundaries and require the
  policy to change before those boundaries change in code.
- **Approved:** Maintain a versioned archive and separate `Last updated` from
  `Effective`.
- **Approved:** Keep Settings and email as the rights paths; do not add a raw data
  export button to 2.0 merely because some larger services provide one.
- **Approved:** Do not publish the operator's real name without a later explicit user
  decision and legal review. Keep it as a release blocker rather than filling a fake
  person or silently treating `NosLog operator` as legally sufficient.

## Approved Scope and Invariants

### Public Route and Entry Points

- Keep `/[locale]/privacy` stable for Korean, Japanese, and English.
- Keep the ordinary-page Footer link in every authentication state.
- Login places a contextual Privacy link beside the concise Discord disclosure.
- Account deletion places a contextual Privacy link near the destructive consequence
  explanation.
- Feedback, exam proof, avatar, Data Sync, profile visibility, and external-map or
  embed contexts may use concise just-in-time copy that links to the relevant policy
  heading.
- Do not duplicate Privacy as a More-panel destination.
- Do not require acceptance of an unchanged policy merely to browse public content.
- Whether account creation needs an explicit consent control is a legal-review outcome,
  not a visual assumption.

### Age Eligibility

- Public NosLog information remains browseable without an account.
- A person must be at least fourteen years old to create or use a NosLog account.
- Login and account creation communicate the age requirement before completing the
  account action.
- Do not collect date of birth merely to decorate a Profile or personalize content.
- The implementation may use a concise age confirmation only if legal review approves
  that mechanism as sufficient. This brief does not invent identity-document or
  guardian-data collection.
- If a future product decision admits users under fourteen, it requires a new approved
  guardian-consent, verification, withdrawal, retention, and privacy-copy contract
  before implementation.

### Verified Non-Collection Statements

The at-a-glance layer and complete policy may state the following while the verified
product behavior remains unchanged:

- NosLog does not receive or store a Discord password.
- NosLog does not persist the Discord OAuth access token used to retrieve basic
  identity.
- NosLog does not request Discord email, guild, message, or connection scopes.
- NosLog does not receive or store the user's BEMANI password or official-site session
  cookie.
- Local MP3 or other audio selected for the chart editor/viewer remains in the browser
  and is not uploaded to the NosLog server or database.
- NosLog does not request precise device geolocation.
- NosLog does not use advertising, behavioral analytics, or marketing-tracking tools.
- NosLog does not sell personal information or provide it for third-party advertising.
- NosLog does not collect payment-card information.

Each statement is a product invariant. If later implementation proposes a conflicting
practice, update and approve the guide, just-in-time notice, policy, and legal basis
before collection begins. Do not leave a false reassurance live during a staged
rollout.

## Information Hierarchy

Use this source order:

1. page identity, `Last updated`, and `Effective` date;
2. concise at-a-glance disclosure;
3. page contents navigation;
4. operator, scope, and account-age eligibility;
5. data categories, sources, purposes, required/optional meaning, and legal basis;
6. public display and user-controlled visibility;
7. retention, deletion, backups, and orphan cleanup;
8. processors, transfers, independent external services, and external content;
9. cookies and device-local storage;
10. privacy rights and control routes;
11. security practices and breach/contact information;
12. policy changes, history, and earlier versions.

The final legally reviewed policy may split or rename a section to meet applicable
law, but it must preserve this user-facing question order and all verified product
facts.

## At-a-Glance Contract

### Purpose

The first layer is a concise orientation, not an icon-only legal summary and not a
consent banner. It should be understandable without expanding anything.

### Required Content

Use four compact groups:

1. **What NosLog uses:** Discord basic identity, NosLog Profile settings, NOSTALGIA
   records deliberately synchronized by the user, submissions and community activity,
   and essential service logs.
2. **What becomes public:** the approved public Profile, records, rankings,
   evaluations, and the five user-controlled identity/activity groups.
3. **What NosLog does not collect:** credentials, local audio, precise location,
   advertising/behavioral analytics, payment data, and sale for advertising.
4. **Your controls:** Settings, visibility controls, account deletion, privacy email,
   and policy history.

### Presentation Rules

- Plain text carries the meaning; icons may support but never replace labels.
- Do not place a green “safe” badge over unresolved or nuanced practices.
- Do not use absolute security claims such as `100% secure`.
- Link each group to the matching full section.
- A short note identifies that detailed provider, transfer, and retention information
  follows.
- The first layer must remain concise in all three languages and may reflow vertically.

## Full Policy Content Contract

### 1. Operator, Scope, and Eligibility

- Identify NosLog as an unofficial NOSTALGIA records, rankings, archive, chart-editor,
  and chart-viewer service unaffiliated with KONAMI.
- Define which website, localized routes, account features, APIs, and user submissions
  the policy covers.
- State the fourteen-and-older account rule and public-browsing alternative.
- Distinguish the service operator from Discord, KONAMI/BEMANI, Vercel, Neon, Kakao,
  and X.
- Show the privacy contact email.
- **Release blocker:** final controller/operator name or approved service-department
  identity and any legally required address, telephone, officer, complaint body, or
  representative cannot be finalized without legal review and explicit user approval.

### 2. Data Categories, Sources, Purposes, and Basis

For every category, disclose:

- specific or meaningfully grouped fields;
- whether the source is Discord, direct user input, a deliberate BEMANI bookmarklet
  sync, product use, administrator review, or automatic infrastructure operation;
- purpose;
- whether the data is necessary for the requested account/feature or optional;
- retention rule or a direct link to its retention row;
- whether it can be public;
- the legally reviewed processing basis.

Avoid one undifferentiated “service improvement” purpose. NosLog does not currently use
personal activity for advertising or broad behavioral analytics, and the policy must
not reserve that practice speculatively.

### 3. Public Data and Visibility

- Explain that NosLog is partly a public records and comparison service.
- Enumerate always-public and user-controlled Profile groups according to the approved
  Profile brief.
- Explain that rankings, tier-related voting, chart evaluations, and reactions may
  associate a contribution with the user's public NosLog identity where that feature's
  approved contract requires it.
- Explain that chart drafts and review submissions are account-private, while an
  accepted official-chart contribution preserves public contributor credit after the
  advance submission disclosure.
- Explain that public avatars are stored in a public Blob and may appear in Profile,
  Rankings, comments, or generated Share artifacts.
- Explain that hiding a field removes it from subsequent public payloads and Share
  artifacts; it does not delete the underlying account field.
- Generated Profile cards include only the approved public identity and selected-mode
  summary plus visible NOSTALGIA name, Play count, and preferred arcade name. They omit
  hidden fields, Discord, play activity, NOS, sync metadata, and arcade details.
- Hidden fields are omitted from visitors rather than displayed as a `Private`
  placeholder.
- Visibility choices must be presented before a field is first made public and remain
  changeable in Settings.

### 4. Retention and Deletion

- Use a scannable category/purpose/retention table or an accessible reflowing
  equivalent.
- Distinguish active account data, immutable or accumulated record history, public
  contribution data, private submissions, temporary upload controls, session cookies,
  language cookies, local-device preferences, provider logs, backups, and abandoned
  uploads.
- Distinguish personal chart drafts, immutable review snapshots, review events,
  accepted canonical chart history, and public contributor attribution. Their exact
  account-deletion treatment remains a release blocker rather than an inferred rule.
- Preserve the approved six-month feedback and exam rules.
- Explain account deletion as deletion from active NosLog systems and linked known
  uploads, subject to verified backup/provider expiration and any narrowly applicable
  legal retention.
- Do not say `immediate and permanently unrecoverable everywhere` until backup, CDN,
  and provider behavior is verified and legally reviewed.
- State whether open feedback or pending exam evidence remains until resolution/review
  plus the approved period, or until account deletion.
- State that meaningful record history remains until account deletion; the UI's five-
  item preview is not a retention limit.
- Give an exact operational-log retention or an honest, legally valid determination
  rule before release.

### 5. Processors and International Transfers

- Use a maintained record for each processor containing legal entity, function,
  categories transferred, purpose, country/region, timing and method, retention or
  determination rule, and relevant privacy/DPA link.
- At minimum, verify Vercel hosting/functions, public and private Vercel Blob, and Neon
  database processing against the production environment.
- Do not treat a deployment code such as `sin1` or `icn1` as a permanent legal fact
  without a human-readable country and current dashboard evidence.
- Recheck provider subprocessors and regional configuration at every release that
  changes infrastructure.
- Distinguish processing on behalf of NosLog from an independent service's own
  processing. Final classifications require legal review.

### 6. Independent External Services and Content

- Explain Discord OAuth and identity retrieval, including the minimal `identify` scope
  and Discord's own policy.
- Explain the user-initiated p.eagate bookmarklet path and that KONAMI/BEMANI processes
  the official-site session under its own terms.
- Explain Kakao Maps connection metadata when a map is loaded.
- Explain the official X widget and X's processing when the widget is loaded, even with
  the available Do Not Track option enabled.
- Identify material direct remote-media origins when a user's browser contacts them.
- Provide provider-policy links with clear names; do not imply that an external link
  makes NosLog responsible for or affiliated with that provider.
- If legal review requires consent or user-initiated loading for a nonessential embed,
  the final design must include that approved gate before the request occurs.

### 7. Cookies and Device-Local Storage

At minimum, distinguish:

| Technology            | Current purpose                                      | Current duration / clearing behavior                   | Effect of blocking                                           |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| `user_session_cookie` | Essential authenticated session and OAuth state      | Up to 14 days under the current security configuration | Login and account features fail                              |
| `noslog-locale`       | Signed-out and route language preference             | Up to 1 year                                           | Language falls back to route, account, or browser resolution |
| `noslog-theme`        | Device-local theme preference                        | Until changed or browser storage is cleared            | Default theme is used                                        |
| Metronome volume      | Device-local chart-viewer/editor audio preference    | Until changed or browser storage is cleared            | Default volume is used                                       |
| Strict Performance    | Device-local chart-viewer performance interpretation | Until changed or browser storage is cleared            | Default viewer behavior is used                              |

- Do not call all device storage a cookie.
- Explain that local-storage values are not synchronized to the NosLog account under
  the approved contract.
- Do not show a cookie banner solely because essential and preference storage exists.
  Legal review determines whether third-party embeds create a separate consent need.
- Provide practical browser-clearing guidance or link to maintained browser guidance
  without turning the policy into a browser manual.

### 8. Rights and Controls

- Direct self-service controls include Profile/Settings editing, five visibility
  groups, language and title-display preferences, Logout, and permanent account
  deletion.
- Email remains the human path for access, correction, deletion, restriction, or other
  legally applicable requests that the product cannot complete automatically.
- Do not promise a one-click raw data export in 2.0. Legal access requests may still be
  fulfilled manually in a commonly usable form after identity verification.
- Explain necessary identity verification without requesting unrelated credentials or
  a Discord password.
- State expected response timing only after legal review establishes the correct
  obligation and operational ability.
- Link account deletion directly to the approved destructive flow when signed in;
  signed-out readers receive Login with a safe return.
- Explain that deleting the account removes the NosLog account and stored NosLog data;
  it does not delete the person's Discord or KONAMI account.

### 9. Security and Incident Information

- Describe measures at an understandable category level: encrypted transport,
  HTTP-only session, authorization checks, private evidence storage, format and size
  validation, rate limiting, least-privilege operator access, retention cleanup, and
  dependency/infrastructure practices actually in use.
- Do not publish secrets, exact attack surfaces, or unsupported certification claims.
- Do not equate private Blob access with immunity from breach.
- Provide the privacy/security contact path and, after legal review, any required
  authority or complaint routes.
- A material incident-notification promise must match the incident-response process;
  do not improvise it in visual copy.

### 10. Changes and Version History

- Show `Last updated` and `Effective` as separate labeled dates.
- Maintain previous policy versions with stable, locale-aware URLs or equivalent
  versioned artifacts.
- The current page links to a chronological history that identifies version, effective
  date, and a concise change summary.
- Significant changes are announced through NosLog service announcements before they
  take effect when practicable. Do not promise email notification because NosLog does
  not collect account email.
- A typo-only translation correction may update `Last updated` without implying a new
  data practice; material changes receive a new effective version.
- Archived versions are read-only and clearly marked as superseded.

## Interaction and Navigation Contract

### In-Page Navigation

- Generate or author a descriptive link for every top-level full-policy section.
- Compact layouts present one concise `On this page` disclosure near the top. It may
  collapse its link list, but it does not collapse the policy sections themselves.
- Wide layouts may use a persistent side navigation when the content column has enough
  room. Sticky behavior must not obscure the Header, focused target, or section
  heading.
- Active-section indication supplements but never replaces the section labels.
- Anchor navigation updates Focus or reading context accessibly and respects reduced
  motion.
- Each heading receives a stable localized or language-neutral anchor contract that
  does not break contextual links whenever copy is edited.

### Actions and Links

- Primary utility actions are `Open Settings` for a signed-in user and `Privacy
contact` for every user; neither visually outranks the policy itself.
- `Delete account` is a contextual link into Settings, not a destructive button on the
  Privacy page.
- External provider policies open with clear destination names and ordinary external-
  link treatment.
- `Previous versions` remains an internal destination.
- Do not retain a redundant full-width `Back to Home` action when the ordinary Header
  and Footer provide Home. A compact context-preserving Back link may be used only if
  the final shared-shell pattern requires it consistently.

## Responsive Layout Contract

### Compact Layouts

- Validate first at representative 390px and through 320 CSS px.
- Use one content column with page identity, at-a-glance groups, compact contents
  disclosure, and all policy sections in source order.
- Cards, tables, provider details, dates, email addresses, URLs, and long Korean,
  Japanese, or English terms wrap without document-level horizontal scrolling.
- A wide legal table must recompose into labeled rows or description groups rather
  than force routine two-dimensional scrolling.
- The full text remains selectable, searchable, zoomable, and printable.

### Wide Layouts

- Do not retain the current fixed 390px desktop column.
- Use a comfortable long-form reading measure for policy prose and a separate contents
  column only when both can fit without compressing the prose.
- Use wide space for navigation, retention/provider comparison, and scanning—not for
  decorative empty panels or marketing content.
- Exact container width, column proportions, gaps, and sticky transition remain later
  Foundation and Claude Design decisions, tested with English's longest content.
- Keep ordinary shared Header and Footer alignment while allowing the policy body to
  use an appropriate editorial container.

### Print and Text Enlargement

- Print output uses a single complete content flow, visible URLs or useful link text,
  effective/version dates, and no sticky navigation or hidden sections.
- At 200% and 400% zoom, the page preserves content and controls without two-
  dimensional scrolling except for content that genuinely requires it.
- Text-spacing overrides do not clip section titles, provider names, dates, or links.

## State Contract

| State                                        | Required result                                                            | Forbidden result                                 |
| -------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------ |
| Current policy available                     | Summary, full policy, dates, contact, and history access                   | Summary without full text                        |
| No prior version yet                         | Hide or concisely explain unavailable history                              | Empty archive chrome or fabricated version       |
| Archived version                             | Read-only full copy with version and superseded status                     | Controls implying it is current                  |
| Signed out                                   | Full policy, email, public Home, and contextual Login for account controls | Blocking policy behind authentication            |
| Signed in                                    | Same policy plus Settings/account-control links                            | Different legal meaning based on login           |
| Provider detail unavailable at build/release | Block release or show a legally reviewed truthful determination rule       | Guessing a region or retention period            |
| Localized copy not legally synchronized      | Keep phase unapproved and block release for that locale                    | Shipping a summary or machine-only approximation |
| Policy rendering failure                     | Plain, complete fallback content or ordinary recoverable system error      | Blank page or redirect to Home                   |
| External provider link failure               | Policy remains readable; identify failed external destination              | Hiding NosLog's own disclosure                   |

The policy should normally be server-rendered from versioned local content and should
not need a loading skeleton. Do not make essential privacy meaning depend on a client
request or third-party script.

## Accessibility Contract

- Use one descriptive `h1`, sequential section headings, and subsection headings that
  describe purpose rather than repeat legal numbering alone.
- Preserve the global Skip link and one `main` landmark.
- In-page navigation is a labeled `nav`; the current link uses `aria-current` or an
  equivalent textual state without color-only meaning.
- Anchor targets use sufficient scroll margin so the Header does not obscure them.
- Links communicate their destinations from text or programmatic context. Avoid
  repeated unlabeled `Learn more` links.
- Contact information uses real `mailto:` semantics while keeping the address visible
  as text.
- Data categories and retention relationships use semantic tables only when tabular;
  reflowed compact presentations preserve header associations.
- Icons, color, labels, and status chips never carry legal meaning alone.
- Focus remains visible and does not jump merely because the active contents item
  changes during scrolling.
- Respect reduced motion for smooth anchor scrolling and active-section transitions.
- The page meets WCAG 2.2 AA requirements relevant to Reflow, Resize Text, Text
  Spacing, Contrast, Headings and Labels, Focus, Link Purpose, Language of Page/Parts,
  and Status Messages.

## Localization and Legal-Copy Contract

- Korean, Japanese, and English carry the same substantive categories, purposes,
  retention, public consequences, provider facts, rights, age rule, dates, and release
  limitations.
- Use human-reviewed legal translation before release. Machine translation may create
  a draft but is not final authority.
- Keep stable code identifiers such as `user_session_cookie`, `noslog-locale`,
  `Discord`, `NOSTALGIA`, `BEMANI`, provider names, and region codes intact where
  translation would create ambiguity.
- Use localized explanatory labels around `Basic`, `Recital`, `Grd`, `NosLog Rating`,
  and other approved domain terms.
- Provider legal names, countries, dates, and email addresses must not be localized
  into different facts.
- Long English provider and purpose descriptions, Japanese unbroken terms, and Korean
  legal compounds must be included in responsive tests.
- **Open / release blocker:** legal review must decide whether one language is legally
  controlling and how that relationship is disclosed. Do not autonomously declare the
  English design-document source or Korean product copy legally controlling.

## Data and Content Requirements for Design Specimens

Required representative content includes:

1. a signed-out Korean visitor at 390px;
2. a signed-in Japanese user with all five optional Profile groups hidden;
3. a signed-in English user with every optional Profile group public;
4. current and archived policy versions with separate update/effective dates;
5. one provider with a long legal name, country, region, data list, transfer timing,
   and retention explanation;
6. one long retention row and one honest unresolved/log-determination specimen;
7. session cookie, language cookie, and local-storage preferences;
8. the complete verified no-collection group;
9. a 320px specimen with long provider URLs and no horizontal overflow;
10. 1280px wide layout with contents navigation and editorial reading measure;
11. print layout; and
12. previous-version history with at least one superseded item.

Do not use `Lorem ipsum`, invented provider regions, fictional legal names, or shortened
English-only copy to validate the page.

## Implementation Mapping

| Approved requirement           | Current source                                                                                                                                            | Downstream change                                                                                                                           |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Public localized Privacy route | [`app/(nevigation)/privacy/page.tsx`](<../../app/(nevigation)/privacy/page.tsx>)                                                                          | Preserve route and metadata; replace fixed single-column composition with versioned structured policy content                               |
| Footer access                  | [`components/layout/footer.tsx`](../../components/layout/footer.tsx)                                                                                      | Preserve global public link and localized destination                                                                                       |
| Login contextual disclosure    | [`app/(auth)/login/page.tsx`](<../../app/(auth)/login/page.tsx>) and Auth brief                                                                           | Keep concise data and age context with heading-specific Privacy link                                                                        |
| Account controls and deletion  | [`app/(nevigation)/profile/settings/securityActions.ts`](<../../app/(nevigation)/profile/settings/securityActions.ts>)                                    | Preserve verified deletion ordering; align copy with active-system and backup truth                                                         |
| Five visibility groups         | Profile and Settings briefs; [`prisma/schema.prisma`](../../prisma/schema.prisma)                                                                         | Add missing preferred-arcade and Play-activity controls and prevent public payload/cache leakage                                            |
| Discord data boundary          | [`app/(auth)/discord/start/route.ts`](<../../app/(auth)/discord/start/route.ts>) and [`complete/route.ts`](<../../app/(auth)/discord/complete/route.ts>)  | Preserve `identify` only and no persisted access token; expose accurate disclosure                                                          |
| BEMANI sync source             | [`lib/bookmarklet.ts`](../../lib/bookmarklet.ts), receive route, and Data Sync brief                                                                      | Explain user-initiated source, payload, signed token, and credential/session-cookie exclusion                                               |
| Active retention cleanup       | [`lib/privacyRetention.ts`](../../lib/privacyRetention.ts) and [`app/api/cron/privacy-retention/route.ts`](../../app/api/cron/privacy-retention/route.ts) | Preserve six-month rules; add operational monitoring and policy-version evidence                                                            |
| Public/private uploads         | [`lib/blob.ts`](../../lib/blob.ts) and upload actions                                                                                                     | Preserve access separation; guarantee orphan cleanup and verified provider deletion lifecycle                                               |
| Cookie inventory               | [`lib/session.ts`](../../lib/session.ts), [`lib/i18n/routing.ts`](../../lib/i18n/routing.ts), and [`proxy.ts`](../../proxy.ts)                            | Disclose session and one-year locale cookies exactly                                                                                        |
| Device-local preferences       | [`app/layout.tsx`](../../app/layout.tsx), chart viewer preference hooks                                                                                   | Disclose theme, metronome volume, and Strict Performance without claiming server sync                                                       |
| External widgets and maps      | [`components/home/officialXTimeline.tsx`](../../components/home/officialXTimeline.tsx) and [`lib/kakaoMaps.ts`](../../lib/kakaoMaps.ts)                   | Add exact external-service disclosure and any legally required load gate after review                                                       |
| Infrastructure regions         | [`vercel.json`](../../vercel.json), Production dashboards, provider contracts                                                                             | Verify human-readable countries, regions, subprocessors, logs, backups, and retention before release                                        |
| Policy history                 | No current route                                                                                                                                          | Add versioned current/history data source and locale-aware archived destinations                                                            |
| Tests                          | Existing privacy-retention, account-deletion, localization, and E2E suites                                                                                | Add content-schema, data-practice consistency, versions, age disclosure, public fields, keyboard, reflow, print, and locale parity coverage |

## Pre-Release Privacy Blockers

| ID       | Required resolution                                                                                                                 | Owner/evidence                                                   | Status            |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------- |
| PRIV-B01 | Legally sufficient operator/controller identity and contact disclosure without publishing a real name before explicit user approval | User decision plus qualified Korean/international privacy review | `Release blocker` |
| PRIV-B02 | Applicable legal bases, consent points, complaint channels, rights timing, and supported-jurisdiction obligations                   | Qualified legal review                                           | `Release blocker` |
| PRIV-B03 | Exact Vercel operational-log fields and retention                                                                                   | Production plan/dashboard and Vercel documentation               | `Release blocker` |
| PRIV-B04 | Exact Neon point-in-time history, backup, deletion, and Singapore processing facts                                                  | Production Neon project and DPA/subprocessor evidence            | `Release blocker` |
| PRIV-B05 | Exact public/private Blob regions, cache/deletion lifecycle, and abandoned-upload cleanup                                           | Production Blob dashboards, lifecycle implementation, and tests  | `Release blocker` |
| PRIV-B06 | Current processor/subprocessor, country, transfer, and retention register                                                           | Production vendor contracts and release checklist                | `Release blocker` |
| PRIV-B07 | X/Kakao/other nonessential external-load consent or just-in-time notice requirement                                                 | Legal review plus network/browser evidence                       | `Release blocker` |
| PRIV-B08 | Korean/Japanese/English legally reviewed substantive parity and any governing-language clause                                       | Human legal translation review                                   | `Release blocker` |
| PRIV-B09 | Fourteen-and-older account disclosure and a legally adequate, non-dark-pattern eligibility mechanism                                | Legal review, Auth design, and E2E                               | `Release blocker` |
| PRIV-B10 | Contributor terms covering chart rights, warranties, moderation, and public attribution                                             | Qualified legal review and approved submission copy              | `Release blocker` |
| PRIV-B11 | Account-deletion treatment for private chart work, review records, accepted canonical history, and contributor attribution          | Product decision, legal review, schema, and deletion tests       | `Release blocker` |

The release may not convert a blocker to `Approved` merely because a placeholder has
been styled or the current policy already contains a similar sentence.

## Browser and QA Acceptance

Future implementation acceptance must verify:

1. `/ko/privacy`, `/ja/privacy`, and `/en/privacy` are public, indexable as intended,
   and share the same material section set;
2. Footer, Login disclosure, and account-deletion context open the correct localized
   policy or heading;
3. current version shows separate `Last updated` and `Effective` dates;
4. previous versions are stable, read-only, localized, and marked superseded;
5. at-a-glance links reach the corresponding full sections without obscured headings;
6. compact contents navigation is keyboard operable and policy sections remain fully
   available without expanding each one;
7. wide contents navigation has correct reading and Focus order and never covers text;
8. 320, 360, 390, intermediate, tablet, and representative desktop widths have no
   ordinary two-dimensional page scroll;
9. Korean, Japanese, and English long provider, retention, cookie, and contact values
   wrap without clipping;
10. 200%/400% zoom, text spacing, reduced motion, and keyboard-only use preserve the
    complete policy;
11. screen readers can navigate the heading outline, contents `nav`, retention
    relationships, external links, and contact information;
12. signed-out readers can read everything and contact the operator without Login;
13. signed-in Settings and deletion links use safe localized return behavior;
14. public-data disclosure matches the actual API, Profile, Rankings, community, and
    Share payloads for all five visibility controls;
15. Discord scope and persisted fields match the disclosed identity list and no access
    token, password, or unrequested provider field is persisted;
16. local chart audio never appears in a NosLog upload request, server log payload, or
    database object;
17. session and locale cookie names, durations, and failure effects match production;
18. local-storage preferences remain device-only and clearing them produces the
    disclosed default behavior;
19. retention tests prove feedback and exam deadlines, active account deletion, Blob
    handling, and orphan cleanup;
20. production evidence records current regions, processors, subprocessors, log
    retention, backup retention, and external embed behavior;
21. no analytics, advertising, or tracking request contradicts the approved
    no-collection statements;
22. the age requirement appears before account creation and under-fourteen accounts
    cannot silently complete the ordinary account flow;
23. the page remains complete when X, Kakao, Discord, or any provider policy link is
    unavailable; and
24. print output includes full policy meaning, dates, contact, and version identity.

Lint, typecheck, unit tests, and build are necessary but do not substitute for network,
storage, locale, public-visibility, screen-reader, print, and responsive browser
verification.

## Reference Matrix

| Source                                                                                                                                                                                                                                    | Transferable principle                                                                                                                    | NosLog application                                                 | Limitation                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| [Korean PIPC: 2026 Privacy Policy Guidelines index](https://www.privacy.go.kr/front/bbs/bbsList.do?bbsNo=BBSMSTR_000000000049)                                                                                                            | Use the current Korean policy-writing baseline                                                                                            | Release legal-copy checklist starts from current guidance          | The index does not replace qualified review of NosLog facts         |
| [Korean Personal Information Protection Act](https://law.go.kr/lsInfoP.do?lsId=011357)                                                                                                                                                    | Disclose purpose, retention, provision, deletion, processors, rights, contact, automated collection, and transfer as applicable           | Defines the core complete-policy inventory                         | Exact applicability and basis require legal review                  |
| [PIPC 2025 guideline release](https://m.pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS074&mCode=C020010000&nttId=11133)                                                                                                             | Distinguish required/recommended items, legal bases, accessible entry points, rights, and behavioral data                                 | Supports Footer plus contextual links and specific data/basis rows | The 2026 guide supersedes details where changed                     |
| [Japan PPC general APPI guidelines](https://www.ppc.go.jp/personalinfo/legal/guidelines_tsusoku/)                                                                                                                                         | Services outside Japan may still need to consider Japanese residents and actual data handling                                             | Justifies Japanese legal review and equal substantive notice       | Does not determine NosLog's Korean controller obligations           |
| [Japan PPC foreign-transfer guidelines](https://www.ppc.go.jp/personalinfo/legal/guidelines_offshore/)                                                                                                                                    | Foreign recipient, purpose, safeguards, and country information need specificity                                                          | Supports maintained provider and transfer facts                    | Exact applicability depends on service role and flow                |
| [European Commission: information to individuals](https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/principles-gdpr/what-information-must-be-given-individuals-whose-data-collected_en)         | Identity, purposes, categories, basis, retention, recipients, transfers, rights, and sources should be clear                              | Supports complete structured disclosure                            | EU applicability is a legal-review question                         |
| [European Commission: data-processing principles](https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/principles-gdpr/overview-principles/what-data-can-we-process-and-under-which-conditions_en) | Purpose limitation, minimization, accuracy, and transparency constrain collection                                                         | Supports verified no-collection and no speculative purposes        | Does not define UI layout                                           |
| [EDPB endorsed transparency guidelines](https://www.edpb.europa.eu/endorsed-wp29-guidelines_en)                                                                                                                                           | Transparency must be concise, intelligible, accessible, and specific                                                                      | Supports layered but complete policy                               | European guidance is not the sole governing law                     |
| [ICO: methods for privacy information](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-methods-can-we-use-to-provide-privacy-information/)                            | A top layer can summarize identity, collection, and purpose while full detail remains available                                           | Supports at-a-glance plus full sections                            | UK examples do not define Korean legal sufficiency                  |
| [ICO privacy-notice checklist](https://ico.org.uk/media/for-organisations/documents/1625126/privacy-notice-checklist.pdf)                                                                                                                 | Inventory actual data, purpose, future use, consequences, access, security, and non-use                                                   | Supports code-to-policy consistency audit                          | Checklist still needs jurisdiction-specific review                  |
| [OECD Privacy Principles](https://www.oecd.org/en/topics/sub-issues/privacy-principles.html)                                                                                                                                              | Collection limitation, purpose, security, openness, participation, and accountability form a durable system                               | Supports privacy as an engineering lifecycle                       | Principles are not direct page-copy requirements                    |
| [FTC Data Security](https://www.ftc.gov/business-guidance/privacy-security/data-security)                                                                                                                                                 | Collect only what is needed, protect it, and dispose of it securely                                                                       | Supports orphan, log, and backup blockers                          | US enforcement scope differs                                        |
| [California CPPA general notices](https://cppa.ca.gov/pdf/general_notices.pdf)                                                                                                                                                            | Collection notice should identify categories, purposes, sale/share, and retention near collection                                         | Supports contextual just-in-time links                             | CCPA applicability requires legal review                            |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                                                                                                                                                                 | Reflow, headings, link purpose, focus, language, and text spacing apply to legal content                                                  | Sets 320px and accessible reading requirements                     | Does not prescribe policy wording                                   |
| [W3C Headings tutorial](https://www.w3.org/WAI/tutorials/page-structure/headings/)                                                                                                                                                        | Semantic headings communicate organization and enable navigation                                                                          | Preserve and extend current heading outline                        | Does not define visual hierarchy tokens                             |
| [USWDS In-page navigation](https://designsystem.digital.gov/components/in-page-navigation/)                                                                                                                                               | Lengthy pages benefit from a tested contents navigator with deliberate keyboard order                                                     | Supports compact and wide TOC behavior                             | Government component styling is not NosLog authority                |
| [GOV.UK Footer](https://design-system.service.gov.uk/components/footer/)                                                                                                                                                                  | Privacy and cookie information belong in a stable secondary service location                                                              | Preserves Privacy in Footer                                        | Contextual collection links are still required                      |
| [Discord OAuth2 and permissions](https://docs.discord.com/developers/platform/oauth2-and-permissions)                                                                                                                                     | `identify` grants basic profile fields and scopes should remain minimal                                                                   | Supports exact Discord disclosure                                  | Discord controls its own authorization interface                    |
| [Discord User resource](https://docs.discord.com/developers/resources/user)                                                                                                                                                               | ID, username, global name, avatar, and email have distinct scope behavior                                                                 | Confirms that `identify` does not require email                    | Returned optional fields may change                                 |
| [Discord retention guidance](https://support.discord.com/hc/en-us/articles/5431812448791-How-long-Discord-keeps-your-information)                                                                                                         | Provider retention and user rights belong to the provider's policy, not an invented NosLog promise                                        | Supports role separation and provider link                         | Discord's own data is not NosLog database data                      |
| [Vercel Blob](https://vercel.com/docs/vercel-blob)                                                                                                                                                                                        | Public and private stores have materially different access; region is chosen and cannot be changed                                        | Supports avatar/evidence distinction and dashboard verification    | Exact NosLog store region is deployment-specific                    |
| [Vercel Data Processing Addendum](https://vercel.com/legal/Vercel_Inc_-_Data_Processing_Addendum.pdf)                                                                                                                                     | Processor, subprocessor, deletion, assistance, and cross-border terms need maintained contractual evidence                                | Supports vendor register                                           | Contract interpretation needs legal review                          |
| [Neon subprocessors](https://neon.com/subprocessors)                                                                                                                                                                                      | Infrastructure providers use their own subprocessors and update lists                                                                     | Requires a maintained release register                             | Does not state the exact NosLog project configuration               |
| [Neon Security](https://neon.com/security)                                                                                                                                                                                                | Security and transfer claims should rely on provider evidence                                                                             | Supports accurate high-level safeguards                            | Marketing/security pages do not replace DPA review                  |
| [Kakao Privacy](https://kakao.com/policy/privacy)                                                                                                                                                                                         | Device, IP, cookies, and usage information may be processed by the map/service provider                                                   | Supports external-map disclosure                                   | Exact Kakao Maps SDK flow needs network verification                |
| [GitHub General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)                                                                                                              | Effective date, contents navigation, categories, rights, transfers, minors, changes, and translations can coexist in one long-form policy | Supports full structured policy and history                        | GitHub's scale and commercial purposes do not transfer              |
| [osu! Privacy Policy](https://osu.ppy.sh/legal/en/Privacy)                                                                                                                                                                                | Public scores, rankings, Profile data, account security, and game records require explicit game-domain disclosure                         | Supports NosLog public-record consequences                         | osu!'s anti-cheat and deletion rules do not transfer                |
| [Current Privacy implementation](<../../app/(nevigation)/privacy/page.tsx>)                                                                                                                                                               | Establishes multilingual content, useful semantic heading order, and existing retention promises                                          | Preserve verified facts while improving structure                  | Fixed width, omissions, and unverified claims are not 2.0 authority |
| [Current schema](../../prisma/schema.prisma)                                                                                                                                                                                              | Reveals actual identity, records, progress, submissions, evaluations, sync, and visibility fields                                         | Prevents generic or incomplete category copy                       | Future approved fields require migrations and policy updates        |
| [Current retention implementation](../../lib/privacyRetention.ts)                                                                                                                                                                         | Proves six-month feedback/exam behavior and operational failure handling                                                                  | Keeps policy aligned with executable deletion logic                | Does not handle every provider backup or orphan file                |

### Evidence Convergence

- Korean, Japanese, European, OECD, and US guidance converge on actual data inventory,
  purpose, retention, recipients, rights, security, and accessible contact—not vague
  boilerplate.
- Privacy-content sources converge on layered delivery only when the full policy remains
  available and materially complete.
- Accessibility and design-system sources converge on headings, contents navigation,
  Reflow, clear link purpose, and stable Footer access for long documents.
- Provider sources confirm that scope, storage access, regions, subprocessors, logs,
  and retention are configuration-dependent facts that require maintenance.
- Gaming references support explicit public record and ranking consequences rather
  than treating gameplay data as ordinary private account settings.
- No credible source supports guessing a legal operator name, allowing under-fourteen
  accounts without a guardian system, claiming universal immediate deletion without
  backup evidence, or treating a short summary as the complete policy.

## Rejected and Superseded Alternatives

- **Keep only the current wall of cards — Superseded:** preserve full content but add
  an at-a-glance layer, contents navigation, and wide editorial composition.
- **Replace the full policy with icons or a short summary — Rejected:** the first layer
  cannot carry complete legal and operational detail.
- **Collapse every policy section by default — Rejected:** it impairs search,
  scanning, printing, and complete access; only the compact contents list may collapse.
- **Keep desktop fixed to 390px — Superseded:** the fixed mobile column creates an
  unnecessarily long wide-screen document.
- **Use broad `may collect` boilerplate — Rejected:** disclose real current and approved
  practices and update before adding a new practice.
- **Treat every external organization as the same kind of third party — Rejected:**
  processor, identity provider, independent embed, official data source, and external
  content roles differ and require legal classification.
- **Omit language cookie and local storage — Rejected:** device persistence is part of
  understandable product behavior even when not synchronized to an account.
- **Claim permanent deletion everywhere immediately — Rejected until verified:** active
  deletion, provider caches, backups, and history have different lifecycles.
- **Publish a fictional operator name or infer consent to real-name publication —
  Rejected:** operator identity remains a release blocker until explicit approval and
  legal review.
- **Allow under-fourteen accounts without guardian infrastructure — Rejected:** public
  browsing remains available, but account eligibility begins at fourteen.
- **Collect date of birth for the age rule by default — Rejected:** it would add new
  personal data without an approved necessity and verification contract.
- **Promise email policy notices — Rejected:** NosLog does not collect account email;
  use service announcements and a stable version history.
- **Add a raw self-service data-export dashboard to 2.0 — Rejected:** Settings and
  human privacy requests cover the approved need; legal access remains supportable
  manually.
- **Hide Privacy inside More — Rejected:** Footer is the stable global destination;
  collection contexts add direct links where needed.
- **Let the policy depend on X, Kakao, or another third-party script — Rejected:** the
  entire NosLog disclosure must render without external scripts.

## Decision Log

| ID      | Decision                                                                                                       | Status            |
| ------- | -------------------------------------------------------------------------------------------------------------- | ----------------- |
| PRIV-01 | Keep Privacy public at every locale-prefixed `/privacy` route                                                  | `Approved`        |
| PRIV-02 | Keep Privacy in the ordinary Footer and out of More                                                            | `Approved`        |
| PRIV-03 | Add contextual Privacy links at Login, deletion, uploads, sync, and material collection points                 | `Approved`        |
| PRIV-04 | Use an at-a-glance first layer plus the complete policy                                                        | `Approved`        |
| PRIV-05 | Use in-page navigation and keep full policy sections visible                                                   | `Approved`        |
| PRIV-06 | Show separate Last-updated and Effective dates                                                                 | `Approved`        |
| PRIV-07 | Maintain stable previous-version history                                                                       | `Approved`        |
| PRIV-08 | Limit NosLog account creation/use to age fourteen and older                                                    | `Approved`        |
| PRIV-09 | Preserve public browsing without an account                                                                    | `Approved`        |
| PRIV-10 | Do not add under-fourteen guardian flows without a new approved contract                                       | `Approved`        |
| PRIV-11 | Explicitly disclose approved always-public and five user-controlled Profile groups                             | `Approved`        |
| PRIV-12 | Explain public Rankings, community contributions, and Share-artifact consequences                              | `Approved`        |
| PRIV-13 | State verified Discord and BEMANI credential/token exclusions                                                  | `Approved`        |
| PRIV-14 | State that local chart audio never reaches the server                                                          | `Approved`        |
| PRIV-15 | State no precise geolocation, advertising, behavioral analytics, payment data, sale, or advertising sharing    | `Approved`        |
| PRIV-16 | Treat verified non-collection statements as product invariants that require prior policy revision to change    | `Approved`        |
| PRIV-17 | Distinguish processor, international transfer, independent external service, and content-source roles          | `Approved`        |
| PRIV-18 | Disclose both session and locale cookies                                                                       | `Approved`        |
| PRIV-19 | Disclose theme, metronome-volume, and Strict-Performance device-local storage                                  | `Approved`        |
| PRIV-20 | Preserve six-month feedback and exam retention rules                                                           | `Approved`        |
| PRIV-21 | Preserve complete meaningful record history until account deletion without equating preview count to retention | `Approved`        |
| PRIV-22 | Keep Settings self-service plus email-based human privacy requests                                             | `Approved`        |
| PRIV-23 | Do not add a raw self-service account-data export in 2.0                                                       | `Approved`        |
| PRIV-24 | Use service announcements and history for policy changes, not promised account email                           | `Approved`        |
| PRIV-25 | Require semantic headings, accessible TOC, 320px Reflow, wide editorial layout, and print completeness         | `Approved`        |
| PRIV-26 | Preserve substantive Korean/Japanese/English parity                                                            | `Approved`        |
| PRIV-27 | Defer real operator-name publication; do not invent or autonomously publish it                                 | `Approved`        |
| PRIV-28 | Resolve legally sufficient operator/controller disclosure before release                                       | `Release blocker` |
| PRIV-29 | Resolve legal bases, consent points, rights timing, and jurisdiction details before release                    | `Release blocker` |
| PRIV-30 | Verify logs, backups, regions, subprocessors, external embeds, and deletion lifecycles before release          | `Release blocker` |
| PRIV-31 | Implement and prove abandoned-upload cleanup before release                                                    | `Release blocker` |
| PRIV-32 | Obtain human legal translation review and decide any governing-language clause before release                  | `Release blocker` |
| PRIV-33 | Disclose private chart work and public accepted-contributor consequences                                       | `Approved`        |
| PRIV-34 | Limit Profile share artifacts to approved public-safe fields and invalidate caches after visibility changes    | `Approved`        |
| PRIV-35 | Resolve contributor terms and account-deletion attribution before user chart contribution launches             | `Release blocker` |

## Handoff Boundary

Claude Design must preserve the at-a-glance/full-policy relationship, section order,
public-data consequences, verified non-collection statements, Settings and email
control paths, age rule, version history, accessible in-page navigation, complete
compact content, wide editorial adaptation, print behavior, and every visible release
blocker. It may define final typography, spacing, summary treatment, table/card
composition, contents-navigation appearance, sticky threshold, and external-link
treatment within the later approved Foundation. It must not design away legal detail,
invent consent, add tracking, publish an operator name, hide full content in accordions,
or imply that a styled placeholder is legally complete.

The future Codex implementation session must run a code-to-policy data inventory,
verify production vendor settings and network requests, implement policy versioning,
add the missing Profile visibility controls, establish orphan and backup deletion
truth, update tests, and obtain the recorded legal and translation approvals. If the
legal review changes age eligibility, consent, controller identification, rights,
international-transfer wording, external-embed loading, or retention, return to this
guide for explicit revision before implementation or release.
