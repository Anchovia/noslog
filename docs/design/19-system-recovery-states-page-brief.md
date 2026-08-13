# NosLog 2.0 System-Recovery States Page Brief

## Document Control

- Status: `Approved`
- Decision status: `Four distinct recovery meanings approved: localized not-found
inside the ordinary shell; recoverable page errors with retry and context
preservation; fatal application errors inside a minimal recovery shell; and planned
maintenance with truthful optional timing, manual refresh, and HTTP 503 semantics.`
- Evidence status: `Current repository and test inspection; live Korean, Japanese,
and English browser inspection of not-found and maintenance at 1280 CSS px;
previously recorded compact not-found evidence; approved information-architecture
and shared-shell contracts; more than twenty cited platform, HTTP, search,
accessibility, design-system, and production-service references; and the
user-approved decision record`
- Date started: 2026-08-03
- Last decision update: 2026-08-03
- Language: English
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Shared-shell contract:
  [15-shared-shell-navigation-brief.md](./15-shared-shell-navigation-brief.md)
- Announcement contract:
  [14-announcements-page-brief.md](./14-announcements-page-brief.md)
- Scope: unmatched routes and unavailable public resources; recoverable route errors;
  fatal root errors; planned maintenance; shell ownership; copy hierarchy; actions;
  locale, metadata, HTTP and cache semantics; responsive behavior; accessibility;
  diagnostics boundaries; implementation mapping; and browser acceptance
- Excluded: page-local loading, empty, validation, permission, upload, and destructive
  states already governed by their page-family briefs; final Foundation tokens and
  artwork; an external status service; a new support-ticket system; administrator
  incident tooling; production implementation; and high-fidelity page design

## Decision Labels

- **Observed:** Verified in the repository, browser, tests, approved upstream artifact,
  or cited source.
- **Approved:** Explicitly agreed with the user and authoritative for downstream design
  and implementation.
- **Proposed:** Evidence-based direction awaiting user approval.
- **Open:** Requires later implementation or operational verification without changing
  the approved product behavior.
- **Rejected:** Considered and explicitly not selected.
- **Superseded:** Replaced by a later approved decision.

This brief governs only service-level recovery states. A downstream designer must not
turn the four states into one generic error template, invent unsupported operational
promises, expose technical diagnostics, or restore navigation that the application
cannot reliably execute.

## Purpose

System-recovery states let a visitor understand what failed, whether NosLog itself is
available, and which single action is most likely to recover. They prevent dead ends
without overloading users with technical detail.

The family answers four ordered questions:

1. Is the requested destination missing, or is NosLog malfunctioning?
2. Can the current page recover without leaving its context?
3. Is the application shell itself unavailable?
4. Is NosLog intentionally under maintenance, and is there a truthful expected return
   time?

## State Taxonomy and Success

| State                  | Meaning                                                                          | Shell                         | Primary success                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------- |
| Not found              | NosLog is available, but the route or authorized public resource cannot be found | Ordinary public shell         | Reach Home or another valid destination without mistaking the state for an outage                  |
| Recoverable page error | The ordinary shell works, but one route segment or request failed                | Ordinary public shell         | Retry successfully or leave through a safe ordinary route without losing avoidable context         |
| Fatal global error     | Root application rendering or initialization failed                              | Minimal system-recovery shell | Reinitialize the document or leave through a full navigation without depending on the broken shell |
| Planned maintenance    | NosLog intentionally returns temporary unavailability                            | Minimal system-recovery shell | Understand the temporary state and manually check again, with truthful timing when known           |

- **Approved:** These meanings remain distinct even if their eventual visual language
  shares typography, spacing, icon, or action primitives.
- **Approved:** A permission-sensitive resource may intentionally resolve as not found
  when revealing its existence would leak private information. This brief does not add
  a universal `403` page.
- **Approved:** Component-local and task-local errors remain in their owning page brief.
  They escalate to this family only when the page or application cannot continue.

## Current-Product Evidence

### Current Implementation

- **Observed:** [`app/not-found.tsx`](../../app/not-found.tsx) renders localized title,
  description, and Home link through the client locale provider. When reached outside
  the ordinary route group, it does not independently provide a `main` landmark,
  ordinary header, or footer.
- **Observed:** The current unmatched route inherits the generic site title rather than
  a localized, descriptive not-found document title.
- **Observed:** [`app/error.tsx`](../../app/error.tsx) records the error, writes it to
  the Console, shows generic localized copy, and exposes only `reset()`.
- **Observed:** [`app/global-error.tsx`](../../app/global-error.tsx) replaces the root
  document and exposes only `reset()`. It initializes English and reads the document
  language after mount, so correct first-render locale is not guaranteed by the
  current contract.
- **Observed:** [`app/maintenance/page.tsx`](../../app/maintenance/page.tsx) renders a
  localized minimal page with one `main`, NosLog mark, wrench icon, heading, and
  description. It has no recovery action or operational timing.
- **Observed:** [`proxy.ts`](../../proxy.ts) rewrites ordinary requests to Maintenance
  with status `503`, `Cache-Control: no-store`, and fixed `Retry-After: 3600`. APIs
  receive Korean-only JSON regardless of requested locale.
- **Observed:** Login, administrator, OAuth, metadata assets, and Maintenance itself
  bypass the maintenance rewrite. This is operational behavior, not a promise that all
  bypass destinations belong in the user-facing maintenance page.
- **Observed:** [`tests/maintenance.test.ts`](../../tests/maintenance.test.ts) verifies
  the 503 rewrite, API response, fixed Retry-After value, and bypass paths.
- **Observed:** [`lib/observability/client.ts`](../../lib/observability/client.ts)
  stores a bounded in-browser diagnostic list. There is no verified external incident
  or support identifier that would make a user-visible reference code meaningful.

### Browser Evidence

- **Observed:** Current Korean, Japanese, and English unmatched routes and Maintenance
  were inspected at 1280 CSS px. The visible copy was localized and neither surface
  created document-level horizontal overflow.
- **Observed:** The current unmatched route had no `main`, dedicated localized page
  title, or ordinary shell. The current Maintenance route had one `main`, localized
  no-index metadata, and no action.
- **Observed:** The Maintenance content remained constrained to approximately 390px
  on the wide viewport. That is current evidence, not a 2.0 maximum-width rule.
- **Observed:** Earlier product-audit browser evidence confirmed localized not-found
  behavior for an unavailable public chart in a compact viewport.
- **Open implementation verification:** The final 2.0 states still require deliberate
  320, 390, intermediate, and 1280 CSS px tests in every locale. The 1280 audit does
  not substitute for compact and zoom validation.

## Research Synthesis

### Convergent Findings

1. HTTP and platform guidance distinguish missing resources, recoverable rendering
   errors, root rendering failures, and temporary service unavailability. Their
   response status and recovery behavior should not be merged.
2. Government and product design systems converge on one descriptive heading, short
   neutral copy, a useful next action, and no blame, jokes, or technical jargon.
3. The ordinary site structure remains useful for a genuine not-found state because
   the service still works. Maintenance and fatal errors must not depend on potentially
   broken global navigation.
4. Retry is appropriate only when it can plausibly resolve the failure. A primary
   action must not pretend to fix a missing route or unavailable feature.
5. Planned maintenance may show an expected return time when it is maintained and
   truthful. Unknown timing must be omitted rather than guessed.
6. Descriptive titles, one `main`, one `h1`, logical focus, programmatic status
   feedback, keyboard access, and 320 CSS px reflow remain required even on short
   recovery pages.

### NosLog-Specific Fit

- NosLog already has localized paths, a stable ordinary shell, a minimal recovery
  surface, and page/global Next.js error boundaries. The 2.0 contract can refine
  existing responsibilities rather than create a separate application.
- Users commonly arrive from shared music, profile, ranking, tier, Bingo, Exam, and
  chart links. A dedicated music-only search control on the universal 404 would be
  misleading for non-music failures.
- NosLog has no approved external status page and no verified user-facing incident
  identifier. Neither is required for an honest recovery experience.

### Reference Limitations

- Government services provide strong content and accessibility patterns but are not
  NosLog art direction.
- Next.js defines file-convention behavior, not final copy or responsive layout.
- HTTP and search guidance define protocol meaning but not action hierarchy.
- Design-system empty states inform concise recovery content but do not turn a system
  failure into a normal no-data state.
- Statuspage guidance informs truthful maintenance communication; it does not justify
  adding an external service to NosLog.

## Approved Shared Content Contract

- Use one visible `h1` and no second competing title.
- Follow the heading with at most one concise explanatory paragraph in the default
  state. Optional maintenance timing is structured metadata, not another essay.
- Present one primary action. A secondary action is allowed only where this brief
  explicitly requires it.
- Use neutral, direct language. Do not blame the user, apologize repeatedly, joke,
  personify the failure, or use NOSTALGIA terminology as decoration.
- Do not show stack traces, exception messages, route digests, request payloads, raw
  database identifiers, internal paths, or a fabricated reference code.
- A decorative icon or NosLog mark may support recognition, but text carries the state
  meaning. Do not require a large illustration or mascot scene.
- Final typography, color, icon drawing, spacing, and action styling belong to the
  approved Foundation and the active high-fidelity design stage. Visual treatment must preserve the hierarchy
  and shell contract defined here.

## Approved Not-Found Contract

### Meaning and Shell

- Render inside the ordinary public shell: first-focusable Skip link, Header, one
  page-level `main`, and Footer.
- Preserve ordinary Home identity, account state, More navigation, Privacy, and GitHub
  access. Do not create a special navigation taxonomy for 404.
- Return a real HTTP `404` for an unmatched route or missing public resource and apply
  no-index behavior. Do not render a successful `200` soft-404 page.

### Content and Actions

1. Localized document title equivalent to `Page not found | NosLog`.
2. Localized `h1` equivalent to `Page not found`.
3. One short sentence stating that the requested page cannot be found.
4. One primary Home link.

- Do not add a dedicated search field, Music action, Back button, suggested links,
  support paragraph, or giant visible `404` number.
- The ordinary More panel already provides broader destinations and Feedback / Error
  Report when the user needs them.
- Browser Back remains available but is not duplicated as the page's primary recovery
  because the prior document may be absent, external, or equally invalid.

### Security-Sensitive Missing Resources

- Unpublished announcements, private profiles or fields, unavailable chart revisions,
  and similar resources may share this not-found presentation when existence must not
  be disclosed.
- Copy must not distinguish `never existed`, `deleted`, `private`, or `not authorized`
  unless the owning product brief explicitly permits disclosure.

## Approved Recoverable Page-Error Contract

### Meaning and Shell

- Keep the ordinary shell when Header, navigation, locale, and page boundary remain
  functional.
- Keep the failed content region in the page's normal reading position. Do not replace
  a functioning application with the fatal-error shell.

### Content and Actions

1. Localized `h1` or region heading equivalent to `Could not load this page`.
2. One short sentence equivalent to `Please try again in a moment.`
3. Primary `Try again` button calling the page recovery boundary.
4. Secondary Home text link.

- The ordinary More panel's Feedback / Error Report remains available.
- Do not reveal the error digest or raw exception.
- If only a subordinate region failed and the rest of the page remains usable, use a
  contextual region error governed by that page brief rather than elevating the whole
  page.

### Retry and Context Preservation

- Disable or mark the retry action busy while one retry is in progress and prevent
  duplicate activation.
- Announce the meaningful retry result without moving focus unnecessarily.
- On success, restore the page at the same meaningful context where technically
  possible.
- Preserve entered values, selected filters, selected difficulty, scroll-relevant
  route state, and completed steps when the owning flow can do so safely.
- Never claim that data was saved or preserved unless the application can prove it.
- On repeated failure, keep the concise recovery state and ordinary support access;
  do not continuously append technical messages or automatically retry.

## Approved Fatal Global-Error Contract

### Meaning and Shell

- Replace the broken application with the minimal system-recovery shell.
- Render only NosLog identity, one `main`, one `h1`, concise explanation, primary
  retry, and secondary Home link.
- Do not render the ordinary Header, More panel, Footer, feedback Dialog, Toast stack,
  or page-specific navigation because their dependencies may be part of the failure.

### Actions

- Primary `Try again` reinitializes or reloads the document through the framework's
  supported recovery path.
- Secondary Home uses an ordinary full-document link rather than client-only routing.
- Do not auto-reload. A repeated root crash must remain stable enough to read and act.

### Locale and Root Safety

- Resolve Korean, Japanese, or English before meaningful recovery copy is painted.
  Do not initialize English and replace it after mount when another locale is known.
- The replacement `<html>` uses the correct `lang`, approved theme baseline, font
  fallback, viewport behavior, and sufficient standalone styling without assuming the
  ordinary provider tree rendered.
- If locale cannot be recovered from the request or route, use the same documented
  product fallback used by normal first entry; do not infer from an exception message.

## Approved Planned-Maintenance Contract

### Meaning and Shell

- Use the minimal system-recovery shell, not the ordinary Header, More panel, Footer,
  feedback Dialog, or a broken destination list.
- Keep a recognizable NosLog identity, one `main`, one `h1`, concise operator message,
  optional truthful timing, and one manual recovery action.
- Maintenance is a temporary operational state, not a NosLog announcement article.
  A related public announcement may provide history, but the 503 page must remain
  understandable on its own.

### Content Hierarchy

1. NosLog identity.
2. Localized `h1` equivalent to `Service maintenance in progress`.
3. One short localized explanation.
4. Optional expected end time when known.
5. Optional last-updated time when an operator message or estimate changes.
6. Primary `Check again` button.

- An operator message must be short, plain, and safe to show in all supported locales.
- If the expected end is unknown, omit the field. Do not show `unknown`, an empty row,
  or a generic one-hour estimate.
- Render an exact localized date and time with an unambiguous timezone such as `KST`.
  A relative phrase may supplement it but cannot replace the exact value.
- Show `Last updated` only when it communicates a real public change. It is not the
  deployment start time by default.

### Refresh and Availability Behavior

- `Check again` performs a user-initiated document refresh and exposes a busy state.
- Do not auto-refresh, poll, count down, or redirect when the estimated end passes.
- Continue returning HTTP `503` for maintained public pages and APIs.
- Send `Cache-Control: no-store` for the temporary recovery response.
- `Retry-After`, when sent, must reflect maintained operational data or a deliberately
  configured retry interval. The current fixed `3600` is not a user-visible promise
  and must not be treated as an expected end time.
- API maintenance responses require safe locale-consistent machine-readable behavior;
  Korean-only JSON is not the 2.0 multilingual contract.
- No external status page, paid API, or workaround embed is introduced by this brief.

## Responsive and Layout Contract

- Design mobile first using 390px as the representative review canvas, not as a fixed
  content width or breakpoint.
- Reflow at 320 CSS px without page-level horizontal scrolling, clipped actions, or
  hidden copy.
- The ordinary not-found and recoverable-error states follow the ordinary shell's
  compact and wide behavior.
- Fatal and Maintenance remain visually focused at every width. Wide layouts may use
  a larger readable measure and intentional negative space, but must not merely freeze
  a 390px mobile canvas or add a second information column.
- Actions may use available inline width on wider layouts and stack when content fit
  requires it. Semantic order remains primary then secondary.
- Verify short viewport heights, safe areas, 200% zoom, 400% zoom, Korean wrapping,
  Japanese line breaking, and longer English action labels.

## Accessibility Contract

- Every standalone state exposes exactly one page-level `main` and one visible `h1`.
- Not-found and recoverable states retain the ordinary first-focusable Skip link.
- On client route transition to a system state, move or restore programmatic focus to
  the page heading or main start according to the shared route-focus pattern. Do not
  leave focus on a removed trigger.
- Use native links for Home and native buttons for Retry or Check again.
- Busy state is programmatically determinable, prevents duplicate activation, and does
  not remove the button label.
- Announce a meaningful retry failure or success through the shared status pattern
  without repeatedly announcing unchanged countdown or polling content.
- Focus indicators remain visible and unobscured. Controls satisfy WCAG 2.2 target
  size or spacing requirements.
- State meaning never depends on icon, color, animation, or HTTP code alone.
- Respect reduced motion. These states require no decorative motion to be understood.
- Descriptive localized document titles distinguish Not found, Error, and Maintenance
  in browser history and assistive-technology navigation.

## Localization and Content Contract

- Korean, Japanese, and English provide the same state meaning, action availability,
  timing facts, privacy boundary, and technical-detail omissions.
- Do not translate NosLog or code identifiers. User-visible labels use natural product
  language rather than literal framework terminology such as `error boundary`,
  `digest`, `render`, or `HTTP 503`.
- Maintenance timestamps use locale-appropriate order and numerals while retaining an
  explicit timezone.
- A missing translation must not make the fatal boundary flash English and then swap.
  The implementation must provide stable initial-language resolution.
- Copy examples in this brief are semantic requirements, not final translation
  approval. Human review remains required during the localization and content phase.

## Metadata, Search, and Protocol Contract

| State                  | HTTP and cache                                                                                           | Indexing                                          | Document title                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------- |
| Not found              | Real `404` for unmatched or missing public resource                                                      | `noindex`; do not include in sitemap              | Localized `Page not found                                      | NosLog` equivalent |
| Recoverable page error | Preserve the truthful response semantics available to the boundary; never manufacture a `404`            | Do not create a separate indexable error URL      | Localized page-error title when the boundary owns the document |
| Fatal global error     | Preserve framework/server failure semantics; do not turn a root failure into a successful indexable page | No indexable standalone recovery URL              | Localized `Could not load NosLog` equivalent                   |
| Maintenance            | `503`, `no-store`, truthful optional `Retry-After`                                                       | `noindex`, `nofollow`, and no sitemap destination | Localized `Service maintenance                                 | NosLog` equivalent |

- Canonical and `hreflang` must not imply that a missing route is a valid canonical
  document.
- Maintenance may keep locale-addressable rendering behavior without becoming a
  permanent navigable content destination.
- Social and search metadata must not reuse a Korean description for Japanese or
  English recovery pages.

## Privacy, Diagnostics, and Support Boundary

- Client and server logging may retain safe operational detail under the later
  observability contract, but visible copy exposes none of it.
- Do not place tokens, request bodies, official record payloads, user-entered form
  content, exception messages, or private URLs in visible diagnostics or default
  feedback attachments.
- Do not show a reference or incident ID until an implemented support path can resolve
  that ID. A random-looking code without operator value is rejected.
- Feedback / Error Report remains reachable through the ordinary More panel for
  Not-found and recoverable errors. It is absent from fatal and Maintenance states.
- The existing feedback Dialog and private attachment handling remain governed by the
  shared shell and Privacy briefs. This brief does not add another submission form.

## State and Edge-Case Matrix

| Condition                                       | Required result                                                  | Status     |
| ----------------------------------------------- | ---------------------------------------------------------------- | ---------- |
| Unknown localized route                         | Ordinary-shell Not found, Home primary, real 404                 | `Approved` |
| Unpublished or privacy-sensitive resource       | Same safe Not found unless owning brief permits disclosure       | `Approved` |
| Page boundary fails once                        | Ordinary-shell page error with Try again and Home                | `Approved` |
| Retry succeeds                                  | Restore meaningful page context where possible                   | `Approved` |
| Retry remains unsuccessful                      | Keep concise state and ordinary Feedback access; no auto loop    | `Approved` |
| Root/provider tree crashes                      | Minimal fatal shell with Try again and full-document Home        | `Approved` |
| Locale known during fatal crash                 | Correct locale on first meaningful paint                         | `Approved` |
| Maintenance with expected end                   | Show exact localized time and timezone plus Check again          | `Approved` |
| Maintenance without expected end                | Omit timing row; never invent an estimate                        | `Approved` |
| Estimate changes                                | Update value and public Last updated timestamp                   | `Approved` |
| Estimate passes but service remains unavailable | Remain stable; no automatic redirect or false completion claim   | `Approved` |
| API during maintenance                          | 503, no-store, safe locale-consistent error contract             | `Approved` |
| 320 CSS px or 400% zoom                         | Complete reading and actions without two-dimensional page scroll | `Approved` |
| Decorative asset fails                          | Text and actions remain complete without layout collapse         | `Approved` |

## Implementation Mapping

| Responsibility       | Current source                                                                             | 2.0 requirement                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Not-found rendering  | [`app/not-found.tsx`](../../app/not-found.tsx)                                             | Place in ordinary shell with one `main`, localized title, concise copy, Home only, real 404/noindex |
| Recoverable boundary | [`app/error.tsx`](../../app/error.tsx)                                                     | Add secondary Home, busy/status behavior, preserve ordinary shell and safe context                  |
| Fatal boundary       | [`app/global-error.tsx`](../../app/global-error.tsx)                                       | Resolve locale before paint, use standalone minimal shell, primary retry plus full-document Home    |
| Maintenance page     | [`app/maintenance/page.tsx`](../../app/maintenance/page.tsx)                               | Add Check again and optional truthful expected-end/last-updated data without fixed-width authority  |
| Maintenance routing  | [`proxy.ts`](../../proxy.ts)                                                               | Preserve 503/no-store, make Retry-After truthful, define locale-consistent API contract             |
| Maintenance tests    | [`tests/maintenance.test.ts`](../../tests/maintenance.test.ts)                             | Cover locale, known/unknown estimate, exact status/cache, bypass safety, and API behavior           |
| Client diagnostics   | [`lib/observability/client.ts`](../../lib/observability/client.ts)                         | Keep operational details invisible and sensitive data excluded; no unresolvable public code         |
| Shared shell         | [`app/(nevigation)/layout.tsx`](<../../app/(nevigation)/layout.tsx>) and shared components | Ordinary shell for Not found/recoverable; no ordinary shell for fatal/Maintenance                   |
| Metadata             | [`lib/metadata/site.ts`](../../lib/metadata/site.ts) and route metadata                    | Provide locale-specific titles/descriptions and correct robots/canonical behavior                   |
| Localized copy       | [`lib/i18n/messages.ts`](../../lib/i18n/messages.ts) and fatal-safe copy source            | Maintain semantic parity across ko/ja/en and initial fatal-locale correctness                       |

- This is a downstream mapping, not authorization to implement in this design-guide
  session.
- Exact maintenance-data storage may be environment configuration or a small
  operator-controlled source. It must support the approved truthful fields and safe
  fallback; the guide does not choose a database migration prematurely.

## Browser and Automated Acceptance Contract

Future implementation must verify at minimum:

1. unknown routes and unavailable safe resources in Korean, Japanese, and English;
2. real 404 status, noindex, locale-specific title, one `main`, one `h1`, ordinary
   Header/Footer, and Home navigation;
3. recoverable failure, busy retry, duplicate-click prevention, success restoration,
   repeated failure, Home link, and ordinary Feedback access;
4. fatal error in every locale without English flash, provider dependency, duplicate
   root landmarks, client-only Home routing, or automatic reload;
5. Maintenance with known time, unknown time, changed estimate, expired estimate, and
   manual Check again;
6. Maintenance page and API 503, no-store, truthful Retry-After behavior, bypass paths,
   and locale-consistent safe API payload;
7. 320, 390, representative intermediate, and 1280 CSS px in all locales;
8. 200% and 400% zoom, short viewport height, keyboard-only operation, visible focus,
   target spacing, reduced motion, and no horizontal document overflow;
9. direct entry, route transition, browser Back/Forward, refresh, and shared invalid
   links;
10. no raw error, digest, token, payload, private route, false saved-data claim,
    fabricated incident code, hydration failure, or unexpected Console failure caused
    by the recovery interface.

Automated checks must cover response semantics, metadata, locale, landmark count,
actions, retry state, and maintenance variants. Real browser inspection remains
required because lint, typecheck, unit tests, and snapshots do not verify actual
reflow, focus visibility, first-paint locale, or action clarity.

## Reference Matrix

| Source                                                                                                                     | Transferable principle                                                                                   | NosLog application                                           | Limitation                                                               |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| [Next.js Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)                                       | Expected failures, route boundaries, root errors, retry, and logging have distinct responsibilities      | Preserve page and global boundary distinction                | Does not define NosLog copy or art direction                             |
| [Next.js `not-found.js`](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)                             | Unmatched resources use the not-found convention and noindex behavior                                    | Real shared localized 404                                    | Framework convention does not choose shell composition                   |
| [Next.js `notFound()`](https://nextjs.org/docs/app/api-reference/functions/not-found)                                      | A route can intentionally stop and render its segment's not-found UI                                     | Safe missing-resource resolution                             | Does not decide permission-disclosure policy                             |
| [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.pdf)                                                                     | 404 and 503 communicate different meanings; Retry-After may accompany 503                                | Truthful status and temporary-unavailability semantics       | Protocol semantics do not define visual hierarchy                        |
| [Google crawling error guidance](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors) | Missing resources should return 404/410 rather than soft 404                                             | Prevent indexable successful missing pages                   | Search guidance does not define user actions                             |
| [W3C Page Titled](https://www.w3.org/WAI/WCAG22/Understanding/page-titled)                                                 | Pages need descriptive titles that identify topic or purpose                                             | Distinct localized Not found, Error, and Maintenance titles  | Does not prescribe title wording                                         |
| [W3C Page Regions](https://www.w3.org/WAI/tutorials/page-structure/regions/)                                               | Landmarks expose page structure                                                                          | Exactly one page-level `main`                                | Does not decide ordinary versus minimal shell                            |
| [W3C Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/)                                                  | Headings communicate hierarchy                                                                           | One visible state `h1`                                       | Visual scale remains Foundation work                                     |
| [WCAG Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)                                           | Focus follows meaning and operability                                                                    | Route-state heading focus and logical action order           | Does not prescribe framework focus APIs                                  |
| [WCAG Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)                                        | Dynamic status changes can be exposed without disruptive focus movement                                  | Retry busy/result announcement                               | Does not require excessive announcements                                 |
| [WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                     | Content remains usable at 320 CSS px-equivalent reflow                                                   | Compact recovery-state acceptance                            | Intrinsically two-dimensional content exceptions do not apply here       |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                                                  | Keyboard, contrast, focus, target size, language, and reflow apply to every state                        | Whole-state accessibility baseline                           | Does not define NosLog components                                        |
| [GOV.UK Page not found](https://design-system.service.gov.uk/patterns/page-not-found-pages/)                               | Use a descriptive title, concise non-blaming explanation, and useful next step                           | Minimal Not-found copy and Home recovery                     | Government service language is not copied literally                      |
| [GOV.UK Problem with the service](https://design-system.service.gov.uk/patterns/problem-with-the-service-pages/)           | Unexpected failures differ from missing pages and planned maintenance                                    | Separate recoverable/fatal meaning                           | Transaction-preservation examples are context-specific                   |
| [GOV.UK Service unavailable](https://design-system.service.gov.uk/patterns/service-unavailable-pages/)                     | Planned unavailability may state return timing and alternatives when known                               | Optional truthful maintenance timing                         | NosLog has no approved alternative service channel                       |
| [USWDS 404 template](https://designsystem.digital.gov/templates/404-page/)                                                 | Consistent service layout, plain explanation, and recovery actions prevent dead ends                     | Ordinary-shell Not found                                     | Its optional code and support content are unnecessary here               |
| [Primer Blankslate](https://primer.style/product/components/blankslate)                                                    | Heading, description, and bounded action hierarchy form a clear state                                    | Shared concise anatomy                                       | A generic blankslate is not an outage taxonomy                           |
| [Primer Degraded Experiences](https://primer.style/product/ui-patterns/degraded-experiences/)                              | Preserve unaffected UI, avoid false data-loss implications, and offer actions that can resolve the issue | Keep ordinary shell for recoverable failure                  | GitHub product examples do not define NosLog content                     |
| [Carbon Empty States](https://carbondesignsystem.com/patterns/empty-states-pattern/)                                       | Plain language and actionable next steps avoid dead ends                                                 | Concise missing/unavailable communication                    | System failure remains distinct from empty data                          |
| [Atlassian Empty State](https://atlassian.design/foundations/content/designing-messages/empty-state)                       | Short scannable heading, limited body, and one clear CTA reduce overload                                 | Supports one primary action                                  | Does not define HTTP or fatal-shell semantics                            |
| [Atlassian Statuspage Maintenance](https://support.atlassian.com/statuspage/docs/schedule-maintenance/)                    | Planned start, duration, state, and updates require maintained operational facts                         | Expected end and Last updated fields                         | Does not require adopting Statuspage                                     |
| [Atlassian Statuspage User Guide](https://support.atlassian.com/statuspage/docs/read-the-statuspage-user-guide/)           | Clear current state and transparent updates support trust                                                | Truthful maintenance communication                           | External subscription/status features remain excluded                    |
| [Current NosLog recovery code](../../app/not-found.tsx)                                                                    | Provides actual copy, locale, shell, and action baseline                                                 | Distinguishes evidence from 2.0 requirements                 | Current styling and gaps are not visual authority                        |
| [Current NosLog maintenance routing](../../proxy.ts)                                                                       | Proves 503, no-store, fixed Retry-After, API, and bypass behavior                                        | Defines implementation risks and preserved protocol behavior | Static one-hour retry and Korean-only API are not approved 2.0 contracts |

### Evidence Convergence

- Platform and HTTP sources converge on four distinct meanings and truthful status.
- Government and product-system sources converge on concise, neutral, actionable
  content rather than decorative or technical failure pages.
- Accessibility sources converge on descriptive titles, landmarks, headings, focus,
  status communication, keyboard access, and reflow.
- Maintenance sources converge on showing timing only when it is maintained and
  truthful.
- No credible source justifies a giant code, automatic reload loop, universal music
  search, broken full navigation, raw diagnostic, or invented incident ID for NosLog.

## Rejected and Superseded Alternatives

- **One generic error page for every failure — Rejected:** it hides whether a route is
  missing, retryable, globally broken, or intentionally unavailable.
- **Minimal shell for 404 — Rejected:** NosLog remains functional and ordinary
  navigation provides useful recovery.
- **Ordinary global navigation during fatal error or Maintenance — Rejected:** it may
  expose destinations known to be unreliable and adds noise to a recovery task.
- **Dedicated music search on 404 — Rejected:** invalid NosLog links can target many
  non-music product families, while ordinary navigation already provides discovery.
- **Visible giant `404` or technical error code — Rejected:** concise semantic text and
  truthful HTTP status are sufficient; large codes do not improve recovery.
- **Back as the primary 404 action — Rejected:** prior history may be absent, external,
  or invalid. Home is stable and Back remains browser-native.
- **Automatic retry, polling, countdown, or redirect — Rejected:** it surprises users,
  creates load, and can enter a failure loop.
- **Fixed one-hour maintenance promise — Superseded:** show an actual expected end only
  when known; otherwise omit timing.
- **External status service — Rejected:** no verified need or approved integration;
  the 503 surface must stand alone.
- **Feedback upload inside fatal or Maintenance shell — Rejected:** its dependencies
  may be unavailable; ordinary-shell states retain the established support path.
- **User-visible digest or random reference ID — Rejected:** there is no implemented
  support lookup that makes it useful, and technical detail may expose sensitive data.
- **Large illustration or humorous failure copy — Rejected:** state meaning and action
  clarity take priority; final art may use a restrained non-semantic icon only.

## Decision Log

| ID          | Decision                                                                                                                 | Status     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------ | ---------- |
| RECOVERY-01 | Keep Not found, recoverable page error, fatal global error, and planned Maintenance as four distinct states              | `Approved` |
| RECOVERY-02 | Render Not found inside the ordinary public shell with Home as its only dedicated action                                 | `Approved` |
| RECOVERY-03 | Return real 404/noindex semantics and localized descriptive metadata                                                     | `Approved` |
| RECOVERY-04 | Omit dedicated search, giant code, Back control, suggestion list, and extra support prose from Not found                 | `Approved` |
| RECOVERY-05 | Allow privacy-sensitive missing resources to use the same non-disclosing Not-found state                                 | `Approved` |
| RECOVERY-06 | Keep the ordinary shell for recoverable page errors with Try again primary and Home secondary                            | `Approved` |
| RECOVERY-07 | Preserve safe user context where possible and never claim unverified persistence                                         | `Approved` |
| RECOVERY-08 | Use busy/status behavior, prevent duplicate retry, and do not auto-retry                                                 | `Approved` |
| RECOVERY-09 | Use a minimal standalone shell for fatal global errors                                                                   | `Approved` |
| RECOVERY-10 | Give fatal errors Try again primary and full-document Home secondary, without Feedback or global navigation              | `Approved` |
| RECOVERY-11 | Resolve fatal-boundary locale before meaningful first paint                                                              | `Approved` |
| RECOVERY-12 | Use a minimal standalone shell and manual Check again for planned Maintenance                                            | `Approved` |
| RECOVERY-13 | Support optional expected end and Last updated only from truthful maintained data                                        | `Approved` |
| RECOVERY-14 | Do not auto-refresh, poll, count down, or redirect Maintenance                                                           | `Approved` |
| RECOVERY-15 | Preserve 503/no-store and make Retry-After and API locale behavior truthful                                              | `Approved` |
| RECOVERY-16 | Show no raw error, digest, private payload, fabricated reference code, or unsupported data-loss claim                    | `Approved` |
| RECOVERY-17 | Reflow through 320 CSS px and preserve one `main`, one `h1`, focus, keyboard, zoom, and locale parity                    | `Approved` |
| RECOVERY-18 | Leave exact visual tokens and final human-reviewed strings to Foundation and downstream design without changing behavior | `Approved` |

## Handoff Boundary

The active high-fidelity design stage must preserve each state's meaning, shell, hierarchy, actions, timing
rules, locale parity, and semantic requirements. It may create a restrained shared
visual language within the later approved Foundation, but must not merge states, add
unsupported actions, turn error codes into the focal point, invent an estimate, or
make Maintenance depend on ordinary navigation.

The future Codex implementation session must compare the final design with this brief,
map each state to the approved Next.js and proxy responsibilities, and verify both
protocol behavior and browser interaction. If implementation cannot provide stable
first-paint locale or truthful maintenance timing, it must omit the unsupported field
and request a guide revision rather than silently displaying misleading information.
