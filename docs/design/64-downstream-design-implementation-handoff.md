# NosLog 2.0 Downstream Design and Implementation Handoff

## Document control

- Status: `Approved — Block 6 complete`
- Language: English canonical source
- Last updated: 2026-08-13
- Milestone: `NosLog 2.0 Design Guide v0.1`
- Scope authority: [document 57](./57-design-guide-remaining-work-audit.md)
- Foundation authority: [document 24](./24-foundation-v0.1.md)
- Foundation provenance: [document 25](./25-foundation-v0.1-provenance.md)
- Reusable ordinary UI: [document 63](./63-foundation-v0.1-reusable-ui-regression.md)
- Absolute preservation boundary:
  [document 07](./07-chart-viewer-editor-preservation.md)
- Milestone export:
  [`output/pdf/noslog-2.0-design-guide-v0.1.pdf`](../../output/pdf/noslog-2.0-design-guide-v0.1.pdf)

## Purpose

This document is the single downstream entry point for the approved NosLog 2.0 design
guide. It indexes rather than duplicates the exact product, page, Foundation, and
acceptance contracts in the active English sources.

It introduces no new product feature, hierarchy, interaction, visual token, page
family, or viewer/editor work. If this summary appears to conflict with a linked
authority, the authority order below governs and the conflict must be reported.

## Authority and conflict handling

Use this order:

1. the user's latest explicit decision;
2. root `AGENTS.md`, especially the viewer/editor boundary and process rules;
3. root `README.md` and [document 57](./57-design-guide-remaining-work-audit.md);
4. [document 07](./07-chart-viewer-editor-preservation.md) for the locked chart
   experiences;
5. [document 24](./24-foundation-v0.1.md) for normative Foundation values;
6. [document 25](./25-foundation-v0.1-provenance.md) for source and decision history;
7. the relevant approved Page Brief;
8. [document 22](./22-cross-cutting-reference-matrix.md) and
   [document 63](./63-foundation-v0.1-reusable-ui-regression.md).

Do not resolve a conflict by copying the current visual implementation, the legacy
NOSTORY Figma, a deleted comparison, the regression-harness composition, Tailwind
defaults, or a downstream designer's preference. Stop and request a guide or design
revision when a material conflict remains.

## Three-stage delivery boundary

| Stage                     | Owner                           | Required result                                                                                                                                        | Prohibited expansion                                                                     |
| ------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Guide packaging           | Completed Codex guide stage     | Complete editable authority, downstream index, QA contract, and versioned milestone export                                                             | Final page suite or production implementation                                            |
| High-fidelity design      | Current downstream design stage | Continue the existing `NosLog v2.0.0` Figma file inside the approved product, Foundation, state, responsive, accessibility, and localization contracts | New product behavior, omitted required state, viewer/editor redesign, or unsourced token |
| Production implementation | Later separate Codex session    | Map the approved guide and final Figma output to the existing stack, code, data, and verified browser behavior                                         | Silently resolving guide/design conflicts or changing the locked experiences             |

## Active source index

| Source                                                                      | Governing role                                                                                                                   |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [01 — Current product audit](./01-current-product-audit.md)                 | Current feature, route, data, permission, component, browser, and administrator inventory                                        |
| [02 — Information architecture](./02-information-architecture.md)           | Page families, navigation relationships, route ownership, and important flows                                                    |
| [03–19 — Page and shared briefs](./03-home-page-brief.md)                   | Required purpose, hierarchy, actions, state, responsive behavior, accessibility, localization, mapping, and acceptance by family |
| [07 — Viewer/editor preservation](./07-chart-viewer-editor-preservation.md) | Absolute exclusion from ordinary 2.0 design and implementation                                                                   |
| [22 — Cross-cutting authority](./22-cross-cutting-reference-matrix.md)      | Shared principles, accessibility floor, responsive rules, and exception governance                                               |
| [24 — Foundation v0.1](./24-foundation-v0.1.md)                             | Exact normative typography, spacing, layout, color, material, iconography, motion, and ordinary data-visualization contracts     |
| [25 — Foundation provenance](./25-foundation-v0.1-provenance.md)            | Source versions, approvals, rejections, and supersessions; not a substitute token ledger                                         |
| [57 — Remaining-work audit](./57-design-guide-remaining-work-audit.md)      | Six-block progress and obsolete-work disposition                                                                                 |
| [63 — Reusable ordinary UI](./63-foundation-v0.1-reusable-ui-regression.md) | Approved responsibility aliases, patterns, and integrated regression evidence                                                    |
| This document                                                               | Downstream reading order, screen coverage, mapping, QA, and export manifest                                                      |

## Screen and page-family requirements

The linked brief is the full contract. The summary below identifies the required
downstream design output and the acceptance risk that must remain visible.

| Family or surface             | Routes or boundary                                                                  | Full authority                                                                               | Required downstream representation                                                                                                                 | Critical implementation and QA ownership                                                                                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Shared ordinary shell         | Locale-prefixed ordinary user pages                                                 | [15](./15-shared-shell-navigation-brief.md), [19](./19-system-recovery-states-page-brief.md) | Restrained header, account state, one More trigger, compact modal, wide popover, footer, skip path, scroll behavior                                | Stable taxonomy and source order, modal/popover semantics, focus return, compact hide/reveal, persistent wide header                                                                 |
| Home                          | `/ko`, `/ja`, `/en`                                                                 | [03](./03-home-page-brief.md)                                                                | Search-first entry, eight equal peer destinations, bounded announcements, official-news fallback                                                   | IME-safe preview, stale-response rejection, `3 × 3` compact and `4 × 2` fitting geometry, all content/service states                                                                 |
| Music and Chart discovery     | `/[locale]/music` with Music or Chart scope                                         | [04](./04-shared-discovery-page-brief.md)                                                    | One shared search surface, scope-aware results, stable Music-card identity, staged compact filters, visible wide refinement, explicit continuation | URL/history restoration, exact filter logic, no hover/focus record substitution, IME timing, finite measured timeout, no infinite scroll, direct viewer entry without target changes |
| Music detail                  | `/[locale]/music/[index]/[difficulty]`                                              | [05](./05-music-detail-page-brief.md)                                                        | Stable Music/chart context, four content areas, resource actions, record/ranking/tier/evaluation and community evidence                            | Atomic target state, freshness/retry rules, exact score/tie/tier meanings, eligibility, semantic tables, return focus, viewer link only                                              |
| Tier planning                 | `/[locale]/tiers`                                                                   | [06](./06-tier-list-page-brief.md)                                                           | Mode/goal hierarchy, band navigation, staged compact filters, compact/detailed result presentations                                                | Official/community separation, restorable state, exact per-chart context, no voting or automatic reordering inside Tier cards                                                        |
| Chart viewer and editor       | Existing routes and implementation only                                             | [07](./07-chart-viewer-editor-preservation.md)                                               | No new high-fidelity screen, specimen, component, annotation, or Foundation application                                                            | Preserve entire page, DOM, controls, accessibility, responsive behavior, renderers, palettes, geometry, animation, audio, and editor model                                           |
| Global rankings               | `/[locale]/rankings`                                                                | [08](./08-global-rankings-page-brief.md)                                                     | Mode/metric/region hierarchy, integrated player identity, exact values, conditional personal position, 25-row pagination                           | Shared-rank semantics, population truth, semantic table relationships, responsive priority, current-user context without duplication                                                 |
| Public profile                | `/[locale]/profile/[id]` plus complete Best/Recent destinations                     | [09](./09-profile-page-brief.md)                                                             | Public performance identity, mode-scoped summary, progress, five-item previews, full-list access, owner sync context, public-safe share            | Five privacy groups, no fabricated Recital Rating, exact retention, cache invalidation, hidden-state and owner/public separation                                                     |
| Bingo                         | `/[locale]/bingo`, `/[locale]/bingo/[id]`                                           | [10](./10-bingo-page-brief.md)                                                               | Permanent catalog, central 5×5 board, synchronized mission list, reward meaning, signed-in manual completion and reset                             | No live-state fabrication or automatic completion, public signed-out reference, checkbox semantics, save rollback, localized mission provenance                                      |
| Exams                         | `/[locale]/exams`, `/[locale]/exams/[slug]`                                         | [11](./11-exam-page-brief.md)                                                                | Basic/Recital/Event reference, official requirements, supported analysis, proof and certification states                                           | Event restrictions, private one-image evidence, player-name comparison, orphan cleanup, retention, no viewer/editor or Recital-renderer changes                                      |
| Arcade discovery and detail   | `/[locale]/gamecenter`, `/[locale]/gamecenter/[arcade-slug]`                        | [12](./12-arcade-discovery-page-brief.md)                                                    | Synchronized list/map discovery, explicit nearby/area actions, stable detail, cabinet facts, verification, directions, bounded reporting           | No automatic location prompt, one result truth, small-sample privacy, map-independent access, international address/time/currency semantics                                          |
| Data Sync                     | `/[locale]/bookmarklet`                                                             | [13](./13-data-sync-page-brief.md)                                                           | First-use and returning hierarchy, exact scope/coverage, processing and recovery, bounded history, text-led media, token invalidation              | No fake progress, raw diagnostics, token or credential leakage; exact timing, partial result, timeout, retry, security and privacy boundaries                                        |
| Announcements                 | `/[locale]/announcements`, `/[locale]/announcements/[publicSlug]`                   | [14](./14-announcements-page-brief.md)                                                       | Localized archive and detail, two distinct Home roles, chronological density, restricted Markdown, 20-item URL pagination                          | Stable multilingual identity and slugs, publication/expiry/history truth, no X mixing, translation completeness, no client-JS dependency                                             |
| Settings and account          | `/[locale]/settings`; compatibility redirect from `/[locale]/profile/settings`      | [16](./16-settings-account-page-brief.md)                                                    | Public overview, guest preferences, authenticated categories, focused detail, five positive privacy controls, deletion safeguards                  | Persistence ownership, schema/OAuth/storage migration, field semantics, dirty/save/error states, reauthentication and idempotent deletion                                            |
| Authentication and onboarding | Localized Login, Discord callback recovery, onboarding, and incomplete-profile gate | [17](./17-authentication-onboarding-page-brief.md)                                           | Minimal auth shell, one Discord action, public-browse exit, destination context, two-field onboarding, identity confirmation                       | Safe return, OAuth state/security, least `identify` scope, no password/provider invention, preserved guest preferences and recovery                                                  |
| Privacy and data practices    | `/[locale]/privacy` and stable version history                                      | [18](./18-privacy-data-practices-page-brief.md)                                              | At-a-glance layer plus complete policy, TOC, public-data consequences, provider/retention detail, print and release-blocker visibility             | Code-to-policy audit, production vendor evidence, legal review, human translation, orphan/backup deletion truth; never style a blocker as resolved                                   |
| System recovery               | Not found, recoverable page error, fatal root error, planned Maintenance            | [19](./19-system-recovery-states-page-brief.md)                                              | Four distinct meanings with the correct ordinary or minimal shell and truthful actions/timing                                                      | Next.js/proxy ownership, HTTP/cache semantics, first-paint locale, retry/context preservation, no raw diagnostics or invented estimate                                               |
| Administrator product         | Existing `/admin/*` inventory                                                       | [01](./01-current-product-audit.md)                                                          | No broad 2.0 redesign output                                                                                                                       | Functional maintenance only unless separately authorized; current chart editor is additionally locked by document `07`                                                               |

## Foundation application contract

The active design stage and later implementation must:

1. map every ordinary Light, Dark, and System appearance to the exact semantic roles
   in document `24`;
2. keep Adobe Spectrum S2 as the exclusive neutral primitive source and preserve exact
   published values;
3. keep Radix Indigo reserved without inventing a current alias;
4. keep the identity achromatic and the rare filled primary action neutral;
5. keep Atlassian feedback chroma, Spectrum difficulty, SAP local-data, and Radix
   judgement color inside their approved semantic boundaries;
6. use Lucide for eligible visible ordinary-UI icons and Atlassian motion roles with
   the approved reduced-motion behavior;
7. use Primer ordinary data-visualization anatomy with exact-value and semantic-table
   access;
8. use the approved first-party, version-pinned Pretendard JP delivery contract; and
9. never apply any of these rules inside the locked chart viewer/editor.

Tailwind may implement an approved rule. It may not supply colors, templates, radii,
shadows, gradients, or component appearance.

## Reusable responsibility mapping

These aliases are responsibilities, not a demand for one component per row or a
license to invent styling. The exact contract remains in document `63`.

| Responsibility group      | Approved aliases                                                               | Primary consumers                                                 |
| ------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Shell and navigation      | `AppHeader`, `Overlay`, `Disclosure`                                           | Shared shell, Home, Settings, auth, recovery                      |
| Search and refinement     | `SearchField`, `ContentScopeSwitch`, `FilterSortControl`, `ViewModeSwitch`     | Home, discovery, tiers, rankings, arcade                          |
| Entity and result reading | `ResultCollection`, `MusicEntityHeader`, `DifficultySelector`, `MetricSummary` | Discovery, Music detail, tiers, profile, exams                    |
| Exact dense data          | `DataTable`, `Pagination`, `OrdinaryDataChart`                                 | Music detail, rankings, profile, announcements, privacy           |
| Forms and feedback        | `FormField`, `StatusMessage`                                                   | Settings, auth, Bingo, exams, arcade reports, Data Sync, recovery |

`Overlay` is a family contract. Choose dialog, popover, disclosure, listbox, or
ordinary navigation semantics from the owning brief; do not build one universal
polymorphic overlay. `MusicEntityHeader` is Music-scoped and must not become an
unsupported generic entity model.

## Implementation mapping contract

The future implementation session must begin with a code-and-design reconciliation,
not immediate styling.

| Mapping layer                 | Required action                                                                                                                                            | Acceptance evidence                                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Routes and history            | Preserve approved public routes, add approved detail/list destinations and compatibility redirects, normalize query/fragment state, and retain safe return | Direct entry, reload, Back/Forward, share URL, locale switch, Login/onboarding return                    |
| Data and schema               | Compare every brief's Implementation Mapping with current Prisma, queries, actions, caches, uploads, and retention jobs before migration                   | Migration plan, fixtures, authorization tests, cache invalidation, privacy data inventory                |
| Authentication and permission | Centralize Discord, incomplete-profile, owner/public, moderator, signed-out, and destructive boundaries                                                    | Server authorization plus browser state coverage; no disabled fake capability                            |
| Localization and content      | Implement complete KO/JA/EN UI and reviewed content, preserve canonical NOSTALGIA identifiers, and use locale-aware number/date/address formatting         | Three-locale fixture parity, mixed-script layout, fallback provenance, metadata and `lang` checks        |
| Foundation tokens             | Map document `24` semantic roles to code tokens without Tailwind or local visual invention                                                                 | Exact-value token audit in Light/Dark/System and component-state review                                  |
| Reusable UI                   | Reuse approved responsibilities where behavior is actually shared; keep page-specific domain contracts local                                               | Component tests plus representative complete-task browser tests                                          |
| Async and recovery            | Preserve request identity, stale-response rejection, local busy boundaries, retry, restoration, and status announcements                                   | Reordered-response, timeout, cancellation, partial, retry, and repeated-failure tests                    |
| Privacy and security          | Complete document `18` release blockers with production and qualified-review evidence                                                                      | No release while a blocker is unresolved; network, storage, deletion, provider, and policy parity checks |
| Viewer/editor exclusion       | Identify and protect all relevant routes/files before broad shell or token migration                                                                       | No diff or runtime change inside the locked experiences except separately authorized maintenance         |

Exact source files and downstream code changes remain in each Page Brief's
`Implementation Mapping` section. This index does not replace them.

### Current code-entry inventory

This inventory gives the future implementation session a starting point. It is not a
complete change list and does not make current composition authoritative.

| Family         | Current code entry points to inspect first                                                                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shared shell   | `app/(nevigation)/layout.tsx`, `components/layout/header.tsx`, `headerNavigation.tsx`, `scrollAwareHeader.tsx`, `footer.tsx`, `skipLink.tsx`                                             |
| Home           | `app/(nevigation)/(home)/page.tsx`, Home actions, official-news and feedback components                                                                                                  |
| Discovery      | `app/(nevigation)/music/page.tsx`, `data.ts`, `query.ts`, `schema.ts`, `components/music/musicSearch.tsx`, `musicResults.tsx`, and `components/music/search/*`                           |
| Music detail   | `app/(nevigation)/music/[index]/[difficulty]/page.tsx`, `data.ts`, `loadMusicDetail.ts`, actions/schema, and ordinary `components/music/*` detail/record/ranking/tier/evaluation modules |
| Tiers          | `app/(nevigation)/tiers/page.tsx`, `data.ts`, legacy compatibility route, and `components/tiers/*`                                                                                       |
| Rankings       | `app/(nevigation)/rankings/page.tsx`, `app/api/rankings/route.ts`, `lib/rankings.ts`, and `components/rankings/*`                                                                        |
| Profile        | `app/(nevigation)/profile/[id]/*`, `components/profile/dashboard/*`, Profile actions/data, and public share-card route                                                                   |
| Bingo          | `app/(nevigation)/bingo/*`, `components/bingo/*`, and Bingo actions/data                                                                                                                 |
| Exams          | `app/(nevigation)/exams/*`, `components/exams/*`, proof actions, and current moderator-review implementation for functional integration only                                             |
| Arcades        | `app/(nevigation)/gamecenter/*`, `components/gamecenter/*`, `lib/arcades.ts`, `lib/arcadeDetails.ts`, and `lib/arcadeRegions.ts`                                                         |
| Data Sync      | `app/(nevigation)/bookmarklet/*`, `components/bookmarklet/*`, `lib/bookmarklet.ts`, and the receive-data API boundary                                                                    |
| Announcements  | `lib/announcements.ts`, Home announcement reads, and current administrator publication flow; approved public Archive/Detail routes are new work                                          |
| Settings       | Current `app/(nevigation)/profile/settings/*` and `components/profile/*` settings/security modules; approved `/[locale]/settings` is the new canonical family                            |
| Authentication | `app/(auth)/layout.tsx`, Login, Discord start/complete, onboarding routes/actions, `components/onboarding/onboardingForm.tsx`, and session/proxy boundaries                              |
| Privacy        | `app/(nevigation)/privacy/page.tsx`, `lib/privacyRetention.ts`, Blob/session/routing/proxy sources, provider settings, and policy-version data to be added                               |
| Recovery       | `app/not-found.tsx`, `app/global-error.tsx`, `app/maintenance/page.tsx`, shared error boundaries, and `proxy.ts`                                                                         |
| Viewer/editor  | Resolve the current target routes/files only to protect them from the migration. Do not use them as ordinary design input or add them to a redesign work list.                           |

Broad administrator redesign remains excluded even where an approved public workflow
must continue to integrate with an existing moderator action.

## Responsive and content acceptance matrix

Every applicable ordinary surface must be evaluated against its actual content and
container, not only device names.

| Dimension             | Minimum Block 6 handoff requirement                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Compact               | Representative `390px` design plus successful one-dimensional reflow at `320 CSS px`                                              |
| Intermediate          | Test widths where the longest KO/JA/EN labels, controls, tables, cards, or panels force composition changes                       |
| Wide                  | Use additional space for comparison, analysis, parallel reading, maps, or settings navigation; do not enlarge a phone column      |
| Text growth           | Verify 200% text resize and 400% zoom where applicable; no clipped focus, hidden action, or obscured software-keyboard target     |
| Content stress        | Use real long titles, mixed scripts, large values, zero/empty/partial/extreme data, long recovery text, and unavailable resources |
| Orientation and input | Support keyboard, pointer, touch, safe areas, short viewport heights, and orientation changes where the task permits              |
| Two-dimensional data  | Contain only inherently dimensional data, preserve page reflow, and provide a semantic summary/table                              |
| Motion                | Preserve immediate state meaning under `prefers-reduced-motion`; never rely on animation for availability or completion           |

No breakpoint is approved merely because a framework supplies it. Document a
content-fit reason for every layout transition. The approved fixed thresholds already
recorded in a Page Brief remain authoritative for that exact pattern.

## State and interaction acceptance matrix

Each family must cover only applicable states, but no required state may be omitted
from high-fidelity design merely because implementation will occur later.

| State class             | Required evidence                                                                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Request lifecycle       | Initial, retained/revalidation, loading, slow response, success, empty, partial, stale, failure, retry, cancellation, and out-of-order response where applicable |
| Identity and permission | Signed out, incomplete profile, signed in, owner, public viewer, moderator, unavailable action, and permission loss during a task                                |
| Form and mutation       | Pristine, dirty, invalid, busy, success, recoverable failure, duplicate prevention, rollback, destructive confirmation, and focus restoration                    |
| Data meaning            | Unknown, not published, not listed, not eligible, hidden by privacy, absent optional value, zero value, and unavailable external resource remain distinct        |
| Navigation              | Direct entry, source-aware entry, reload, Back/Forward, locale change, Login/onboarding round trip, pagination/continuation, and meaningful focus destination    |
| External dependency     | X, map, video, image, Discord, provider link, or network failure leaves first-party purpose and recovery intact                                                  |
| System recovery         | Not found, recoverable page error, fatal root error, and Maintenance retain different shell and protocol meanings                                                |

## Accessibility and localization release floor

The target is WCAG 2.2 AA. Automated checks are necessary but insufficient.

- Use native semantics first; custom composites require complete name, role, value,
  state, keyboard, focus, pointer, touch, and announcement behavior.
- Keep one logical source/focus order across responsive compositions, with skip paths,
  visible keyboard focus, no trap, and no obscured focus.
- Do not communicate status, difficulty, judgement, FAST/SLOW, chart series, selection,
  error, or availability through color alone.
- Verify forced colors/high contrast, color-disabled and color-vision-deficiency review,
  reduced motion, screen-reader navigation, touch targets, text spacing, and zoom.
- Validate Korean, Japanese, English, and mixed-script line breaking, punctuation,
  canonical domain labels, dates, values, units, addresses, and fallback language.
- Keep nontrivial visualizations connected to exact values and equivalent semantic
  data.

## Browser and verification coverage

The future implementation release matrix must include:

1. current stable Chromium, Firefox, and Safari on representative desktop systems;
2. representative iOS Safari and Android Chromium touch behavior;
3. `320px`, `390px`, intermediate content-fit transitions, and wide analytical layouts;
4. KO/JA/EN route, metadata, content, search, form, error, and return-path coverage;
5. keyboard-only and screen-reader coverage for primary tasks and every custom
   composite;
6. Light, Dark, System, forced-colors/high-contrast, reduced-motion, and text-growth
   checks;
7. network delay, reordered requests, provider failure, image/media failure, and
   offline-adjacent recovery where applicable;
8. no unexpected console, hydration, uncaught runtime, authorization, privacy, or
   horizontal-overflow error; and
9. explicit regression proof that the chart viewer/editor remained unchanged.

Each Page Brief contains the exact route, fixture, state, and acceptance additions for
its family. Those requirements are cumulative with this floor.

## Privacy release blockers

The design experience is approved, but NosLog 2.0 may not release until document `18`
records evidence for:

- legally sufficient operator/controller identity and contact;
- legal bases, consent points, complaint channels, rights timing, and jurisdiction;
- exact Vercel logs and retention;
- exact Neon history, backup, deletion, region, and processing facts;
- public/private Blob regions, cache and deletion lifecycle, and abandoned-upload
  cleanup;
- the processor/subprocessor, country, transfer, and retention register;
- X/Kakao/other nonessential external-load consent or notice requirements;
- legally reviewed Korean/Japanese/English parity and any governing-language clause;
  and
- a legally adequate, non-dark-pattern fourteen-and-older account mechanism.

The cancelled user chart-contribution proposal is not a blocker, screen, component,
legal-copy task, or implementation task.

## Active high-fidelity design handoff

The current downstream design stage continues the existing `NosLog v2.0.0` Figma file
(`cVbWCxhkfxFfHmAKLCyKrD`) and must produce the final high-fidelity website design, including
the applicable ordinary page families, required states, content-driven compact and
wide adaptations, reusable responsibilities, and Foundation variables/components.

For every page family, the active design stage must:

1. cite the governing Page Brief and preserve its source order, hierarchy, action,
   state, domain, privacy, and responsive contract;
2. use realistic KO/JA/EN content and the representative/edge fixtures in that brief;
3. show enough state and responsive evidence that implementation does not need to
   invent behavior;
4. map visible values to document `24`, not Tailwind or a new hybrid;
5. mark any unresolved implementation measurement as a measured handoff item rather
   than inventing a product rule; and
6. report any conflict or missing required state before finalizing the affected design.

The active design stage must not:

- use the legacy NOSTORY Figma as current authority;
- copy the integrated regression harness as page composition;
- redesign, recreate, annotate, or apply Foundation to the chart viewer/editor;
- add a new user chart-contribution/editor flow;
- remove a verified function, state, locale, privacy control, or recovery path;
- turn release blockers into reassuring finished UI; or
- present arbitrary visual preference as a NosLog rule.

## Future Codex implementation handoff

Before coding, the later Codex session must:

1. reread root `AGENTS.md`, `README.md`, this document, documents `07`, `22`, `24`,
   `25`, `57`, and `63`, then the owning Page Brief;
2. inspect the current code, schema, tests, runtime UI, and final approved Figma output;
3. produce a guide/design/code reconciliation report and stop on material conflicts;
4. identify all locked viewer/editor routes and files before global shell, font, token,
   or component migration;
5. plan schema, route, content, cache, privacy, localization, and test changes by page
   family; and
6. implement in small reviewable units with browser verification after each meaningful
   unit.

Implementation is not complete until applicable lint, typecheck, unit, integration,
build, migration, E2E, accessibility, responsive, locale, privacy, browser, and
viewer/editor-preservation checks pass.

## Milestone PDF assembly manifest

The versioned PDF should package the editable authority in this reading order:

1. cover, version, date, status, and authority order;
2. product context and current-product audit summary;
3. information architecture and page-family map;
4. approved Page Briefs, with document `07` presented as a preservation contract;
5. cross-cutting principles and exception governance;
6. Foundation v0.1 normative rules and concise provenance/decision history;
7. reusable ordinary-UI package and regression findings without treating the harness
   as final composition;
8. this downstream screen, mapping, QA, and escalation package; and
9. visible privacy release-blocker register and milestone limitations.

Do not include deleted comparison documents, Korean companion files, historical `S`
plans, rejected over-accented examples, or a viewer/editor redesign specimen.

The approved milestone package is one English PDF. Canonical Markdown remains the
editable source of truth; the PDF is a versioned reading and distribution artifact.

## Milestone PDF editorial system

Before choosing the PDF treatment, the comparison covered nineteen independent
official or first-party systems and manuals: Adobe Spectrum, Atlassian, IBM Carbon,
Microsoft Fluent, Material Design, Shopify Polaris, GitHub Primer, SAP Fiori,
Salesforce Lightning, Apple Human Interface Guidelines, GOV.UK, USWDS, NHS, Ant
Design, W3C Design System, Government of Canada, VA, NSW, and the NASA Graphics
Standards Manual. The comparison evaluated cover and chapter hierarchy, contents and
navigation, dense table treatment, technical insets, status/callout notation,
accessibility, and long-form maintenance rather than brand similarity alone.

`ED-03 · GitHub Primer` is approved for the PDF editorial system. Apply the current
[Primer light functional colors](https://www.primer.style/product/primitives/color/)
exactly to the distribution artifact:

| Editorial role | Primer functional role | Published value |
| -------------- | ---------------------- | --------------- |
| Paper          | `bgColor-default`      | `#FFFFFF`       |
| Ink            | `fgColor-default`      | `#1F2328`       |
| Muted text     | `fgColor-muted`        | `#59636E`       |
| Inset surface  | `bgColor-muted`        | `#F6F8FA`       |
| Rule/boundary  | `borderColor-default`  | `#D1D9E0`       |
| Link/notation  | `fgColor-accent`       | `#0969DA`       |

Use the accent only for links, chapter markers, and restrained document notation.
This editorial mapping is not a NosLog product primitive, semantic role, component
alias, or signature-color decision. It does not override document `24`, transfer to
high-fidelity design or production UI, or apply to the locked chart viewer/editor.

The approved export path is
`output/pdf/noslog-2.0-design-guide-v0.1.pdf`. The export must retain searchable text,
document metadata, linked contents, and PDF bookmarks, then be rendered page by page
for blank-page, clipping, overflow, and visual consistency review.

## Block 6 decision log

| ID       | Decision                                                                                                                                  | Status                          |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `HND-01` | Use this one English editable document as the downstream index rather than creating several overlapping handoff files.                    | `Approved — 2026-08-11`         |
| `HND-02` | Carry every approved page family through the screen, mapping, state, responsive, accessibility, localization, and browser matrices above. | `Approved — 2026-08-11`         |
| `HND-03` | Keep the viewer/editor and administrator redesign outside the downstream ordinary-UI package.                                             | `Inherited approved boundary`   |
| `HND-04` | Preserve Privacy release blockers while removing the superseded chart-contribution blocker.                                               | `Inherited approved correction` |
| `HND-05` | Export one English milestone PDF using `ED-03 · GitHub Primer` as artifact-only editorial notation.                                       | `Approved — 2026-08-11`         |

Block 6 is complete when the linked PDF passes the export checks above. All six
top-level design-guide blocks are then complete; privacy, legal, production-evidence,
downstream visual-design, and implementation obligations remain release or later-stage
work rather than additional design-guide blocks.
