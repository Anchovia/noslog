# NosLog 2.0 Specialized Pattern and Exception Register

## Document Control

- Status: `Approved governance register — initial entries approved 2026-08-03`
- Approval date: 2026-08-03
- Canonical language: English
- Korean companion:
  [23-specialized-pattern-exception-register.ko.md](./23-specialized-pattern-exception-register.ko.md)
- Scope: governance and initial approved records for NosLog-specific patterns that
  vary a shared design, accessibility, interaction, rendering, or integration rule
- Inputs: the approved page briefs, consistency audit, cross-cutting reference matrix,
  current-product evidence, focused exception-governance research, and explicit user
  approval
- Excluded: final visual values, high-fidelity layout, application implementation,
  ordinary responsive variants, unchanged NOSTALGIA semantics, release-scope
  deferrals, and implementation debt

This register makes specialized behavior explicit without turning every domain rule
or responsive variation into an exception. It governs downstream Claude Design and
future Codex implementation together with the approved page briefs. It does not
replace those briefs or authorize new behavior beyond their approved boundaries.

## Related Documents

- [Cross-cutting reference matrix](./22-cross-cutting-reference-matrix.md)
- [Chart Viewer page brief](./07-chart-viewer-page-brief.md)
- [Chart Editor and contribution page brief](./20-chart-editor-contribution-page-brief.md)
- [Music Detail page brief](./05-music-detail-page-brief.md)
- [Home page brief](./03-home-page-brief.md)
- [Design-guide consistency audit](./21-design-guide-consistency-audit.md)

## Classification Model

| Classification                | Meaning                                                                                                                                                                                                              | Register treatment                                                                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Domain invariant              | NOSTALGIA or approved product meaning that every valid design must preserve, such as Basic/Recital, score bands, four-measure chart columns, and official terminology                                                | Keep in the governing page brief and decision log. Do not call it an exception unless a specific presentation also varies a cross-cutting rule.        |
| Normal adaptation             | The same task recomposed for available space or capability, such as compact modal versus wide popover, hover/focus enhancement versus direct touch navigation, or list-first compact versus list-and-map wide layout | Govern through responsive, capability, and component rules. Do not register it as an exception.                                                        |
| Specialized contract          | A permanent, NosLog-specific pattern that intentionally varies or narrows a shared rule to preserve an approved task or domain meaning                                                                               | Register its purpose, varied rule, exact boundary, equivalent path or fallback, validation, and review triggers. No arbitrary expiry date is required. |
| Bounded exception             | A local exception to a cross-cutting requirement where removing it would materially damage information or task completion and the exception cannot be made broader than the necessary region                         | Register it with a strict containment boundary and require all surrounding content to follow the normal rule.                                          |
| Temporary exception           | A time-limited deviation accepted only while a documented replacement is delivered                                                                                                                                   | Require an owner, removal milestone, replacement plan, and blocking review trigger. No temporary exception is approved in this initial register.       |
| Scope boundary or Future Work | Work intentionally excluded from the 2.0 release, such as Recital strength rendering or real-time co-editing                                                                                                         | Track in page briefs and Future Work. It is not an exception.                                                                                          |
| Implementation debt           | Current behavior that conflicts with approved guidance, such as the fixed `390px` wide-screen shell, nested `main` landmarks, or a hidden `0 × 0` X iframe                                                           | Track in the audit and implementation backlog. Never use this register to legitimize it.                                                               |

## Admission Gate

A proposed entry must satisfy every applicable condition below before it can become
`Approved`.

1. **Verified need:** identify the approved user task, domain meaning, or safety need
   that the shared rule cannot adequately serve.
2. **Named variance:** identify the exact shared principle, pattern, or platform rule
   being varied. A feature that follows the shared system is not an exception.
3. **Insufficiency evidence:** explain why normal composition, configuration, or an
   existing component cannot solve the need without material loss.
4. **Smallest boundary:** name the exact route, component, region, mode, state, and
   audience. The exception must not silently spread to surrounding UI.
5. **Equivalent completion:** define the fallback, structured representation, or
   alternate interaction that preserves the necessary information and task.
6. **Cross-cutting impact:** record accessibility, keyboard and focus, responsive,
   Korean/Japanese/English, privacy, performance, data, and recovery implications.
7. **Verification contract:** specify representative content, states, viewports,
   input methods, browsers, and failure simulations.
8. **Lifecycle:** name the maintainer, review triggers, dependencies, rejected
   alternatives, and any superseding record.

The following are not sufficient reasons by themselves: visual preference, legacy
implementation, delivery pressure, implementation convenience, one screenshot,
framework defaults, browser-brand assumptions, or a third-party tool limitation.

## Authority and Lifecycle

- The NosLog maintainer and user is the final approver for every entry.
- Claude Design and future Codex sessions may create a `Proposed` record but cannot
  promote it to `Approved` without explicit user approval.
- Valid statuses are `Proposed`, `Approved`, `Rejected`, `Superseded`, and `Retired`.
- Do not silently rewrite the meaning of an approved record. A material change uses a
  new decision or clearly named revision and marks the older record `Superseded`.
- Permanent specialized contracts do not receive arbitrary calendar expiry dates.
  Review them when a named trigger occurs.
- Temporary exceptions require a removal milestone and replacement path at approval
  time. Passing the milestone without resolution returns the item to user review; it
  does not make the exception permanent.
- Reuse does not automatically promote an exception into a shared component. A second
  page-family use triggers review of whether the pattern should remain local, become a
  reusable specialized pattern, or be redesigned into the common system.

## Required Record Schema

Every new record must contain:

- ID, title, classification, status, approval date, and owner;
- verified user need and the governing rule being varied;
- exact in-scope and out-of-scope boundaries;
- approved behavior and prohibited expansion;
- why the shared pattern is insufficient;
- equivalent task path, structured evidence, and failure recovery;
- accessibility, responsive, localization, privacy, performance, and data impact;
- validation matrix and acceptance evidence;
- dependencies, rejected alternatives, and known limitations;
- review triggers, removal milestone when temporary, and superseding history.

## Approved Register

### `SP-01` Focused Chart Viewer Shell

- Classification: `Specialized contract`
- Status: `Approved`
- Owner: `NosLog maintainer`
- Governing variance: the shared user shell normally preserves global navigation,
  account access, and footer destinations.
- Need: published-chart playback and inspection require an uninterrupted, stable
  chart context with an explicit route back to the selected music and difficulty.
- In scope: the focused falling viewer, full-sheet viewer, and their viewer-specific
  full-screen state as defined by the approved Chart Viewer brief.
- Out of scope: Music Detail, discovery, rankings, editor, ordinary content pages,
  or removal of essential viewer exit, identity, report, state, and recovery controls.
- Approved behavior: omit the ordinary NosLog header, More panel, and footer; provide
  one focused shell with chart identity, explicit return, view selection, transport,
  settings, state, and one page-level `main` landmark.
- Fallback and recovery: deep links, renderer failure, full-screen rejection, missing
  chart, and exit must preserve or recover the known music/difficulty context according
  to the Chart Viewer brief.
- Validation: keyboard and pointer exit, browser Back, direct-link entry, focus order,
  one `main`, `320`, representative `390`, intermediate widths, `1280×720`, and
  `1440×900`.
- Review triggers: a second non-viewer page requests the focused shell, global
  navigation changes materially, or exit/recovery testing fails.
- Governing brief: [Chart Viewer](./07-chart-viewer-page-brief.md).

### `SP-02` Full-Sheet Local Two-Dimensional Chart Region

- Classification: `Bounded exception`
- Status: `Approved`
- Owner: `NosLog maintainer`
- Governing variance: `PR-06` and `PR-09` normally require content and controls to
  reflow at `320 CSS px` without page-level two-dimensional scrolling.
- Need: lane, time, measure, note-path, and hand relationships lose meaning when a
  chart column is sliced into an ordinary single-column document.
- In scope: only the labelled full-sheet chart region and its complete readable
  four-measure columns.
- Out of scope: viewer header, tabs, status, settings, transport, report action,
  column descriptions, or any surrounding page content.
- Approved behavior: contain horizontal exploration inside the chart region, keep one
  readable complete column at compact widths, show as many complete columns as fit at
  wide widths, and preserve native touch, trackpad, mouse, and keyboard scrolling.
- Equivalent path: give the region an accessible name and provide structured column
  start/end time and four-measure descriptions without requiring Canvas-pixel reading.
- Validation: `320 CSS px`, representative `390px`, intermediate widths, desktop,
  `200%`/`400%` zoom where applicable, keyboard scrolling, touch scrolling, focus
  visibility, and confirmation that no unrelated page content overflows.
- Review triggers: the chart no longer requires spatial relationships, a semantic
  non-2D representation achieves task parity, or the exception escapes its container.
- Governing brief: [Chart Viewer](./07-chart-viewer-page-brief.md).

### `SP-03` Chart Editor Spatial Workspace and Adjustable Tools

- Classification: `Bounded exception and specialized contract`
- Status: `Approved`
- Owner: `NosLog maintainer`
- Governing variance: ordinary document content reflows linearly and ordinary panels
  do not require a persistent two-dimensional time-and-pitch workspace.
- Need: precise note placement, width, duration, paths, timing, selection, preview,
  and property editing depend on a stable spatial relationship.
- In scope: the editor's time-and-pitch Canvas and its approved left, right, and bottom
  docked, collapsible, internally scrollable, and resizable tool regions.
- Out of scope: page shell, contribution workflow, notices, revision history, export,
  submission, and recovery controls, all of which must still reflow and remain usable.
- Approved behavior: allow bounded internal 2D scrolling and adjustable panels within
  validated minimum/maximum dimensions while preserving selection, playback time,
  work position, and tool context through resizing.
- Equivalent path: every drag-dependent edit and resize requires the approved keyboard
  or explicit non-drag path, structured properties, visible focus, and reset.
- Validation: compact portrait and landscape, intermediate widths, wide desktop,
  keyboard-only creation and editing, single-pointer alternatives, splitter limits,
  zoom, focus preservation, export, recovery, and submission availability.
- Review triggers: an editor control becomes reusable outside the editor, a required
  action remains drag-only, or compact layout blocks recovery/export/submission.
- Governing brief: [Chart Editor and contribution](./20-chart-editor-contribution-page-brief.md).

### `SP-04` PixiJS/WebGL Falling Renderer with Structured Fallback

- Classification: `Specialized contract`
- Status: `Approved`
- Owner: `NosLog maintainer`
- Governing variance: ordinary content and controls use native or semantic DOM-first
  rendering; Canvas/WebGL pixels do not expose their objects automatically.
- Need: the falling note, trajectory, judgement-line, hand, and piano relationship is
  a core NosLog chart-viewing capability and cannot be reproduced by ordinary document
  layout without replacing the approved viewing model.
- In scope: only the falling chart renderer and its tightly coupled playback surface.
- Out of scope: transport semantics, settings, errors, structured chart summary,
  full-sheet fallback, and surrounding shell.
- Approved behavior: keep PixiJS/WebGL for the falling renderer, choose availability by
  feature detection and actual initialization rather than browser brand, and avoid
  making every rendered note an unmanaged Tab stop or continuous announcement.
- Fallback and recovery: on initialization or unrecoverable context failure, pause,
  preserve time and settings where possible, activate the full-sheet view, show one
  concise scoped error, and provide one renderer retry. Recreate invalidated resources
  after a safe context restoration.
- Equivalent path: expose stable chart identity and summary, exact time, operable
  transport, non-color hand cues, and structured full-sheet/column evidence.
- Validation: initialization failure, `webglcontextlost`, safe restoration,
  unrecoverable loss, retry, Safari and other supported browsers, no-audio playback,
  reduced motion, keyboard controls, and preserved state.
- Review triggers: renderer technology changes, fallback parity fails, browser support
  changes materially, or accessibility testing identifies a missing task path.
- Governing brief: [Chart Viewer](./07-chart-viewer-page-brief.md).

### `SP-05` Single-Series Five-Axis Community Pattern Radar

- Classification: `Specialized contract`
- Status: `Approved`
- Owner: `NosLog maintainer`
- Governing variance: general comparison guidance prefers familiar Cartesian forms
  for precise multi-value comparison and warns against shape-only interpretation.
- Need: one stable rhythm-game pattern fingerprint supports rapid recognition of the
  selected chart's community-evaluated tendencies while exact comparison remains
  available separately.
- In scope: only the selected chart's community aggregate for Stairs, Repetition,
  Polyrhythm, Offset, and Chords in the approved fixed order and fixed scale.
- Out of scope: player profiles, rankings, score history, multi-chart comparison,
  personal overlays, multiple radar series, or Glissando as a community-radar axis.
- Approved behavior: use one series only; keep the five-axis order and scale stable;
  do not duplicate the same values as a second bar chart; do not treat shape or color
  as precise evidence.
- Equivalent path: associate localized axis names, exact structured values, evaluation
  count, aggregation state, and a concise textual interpretation with the visual.
- Validation: one/two-person Aggregating state, three-or-more aggregate, empty and
  error states, `320`, representative `390`, desktop, keyboard and screen-reader
  reading order, high contrast, non-color cues, and all three locales.
- Review triggers: the five-axis taxonomy changes, the radar is requested for another
  task, overlapping series are proposed, or testing shows the shape impairs rather
  than supports the approved recognition task.
- Governing brief: [Music Detail](./05-music-detail-page-brief.md).

### `SP-06` Supplementary Official X Widget

- Classification: `External-runtime specialized contract`
- Status: `Approved`
- Owner: `NosLog maintainer`
- Governing variance: core NosLog content normally remains controlled, localized,
  testable, and available without a third-party runtime receiving page/browser data.
- Need: NOSTALGIA publishes official news through its official X account, and the
  original post is the authoritative source users need to discover quickly.
- In scope: the Home official-news section after core search, destinations, sync, and
  NosLog announcements, showing the approved latest original official post through
  X's official embed mechanism.
- Out of scope: core navigation, search, data sync, service alerts, NosLog-authored
  announcements, paid API workarounds, scraping, duplicate embeds, or translated
  representations of the original post.
- Approved behavior: treat the widget as supplementary, load it after core content,
  preserve the original post language, localize surrounding labels, and disclose or
  handle third-party privacy behavior consistently with the approved privacy brief.
- Fallback and recovery: keep a stable localized link to the official NOSTALGIA
  account; do not leave an indefinite skeleton, broken empty frame, or blocked core
  task when the script is slow, blocked, unavailable, or renders at unusable size.
- Validation: script blocked, tracking protection, slow response, offline, protected or
  unavailable content, `0 × 0` iframe, all three locales, compact/wide layouts, and
  confirmation that core Home tasks remain operable.
- Review triggers: X changes embed availability or data collection, the official news
  source changes, the widget cannot reliably display usable content, or privacy policy
  requirements change.
- Governing briefs: [Home](./03-home-page-brief.md) and
  [Privacy and data practices](./18-privacy-data-practices-page-brief.md).

## Explicit Non-Entries

The following approved or observed items must not be converted into exceptions:

| Item                                                                                                                                             | Correct treatment                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| Basic/Recital, difficulty, rank, score-band, judgement, hand, Bingo, Exam, official-grade, and four-measure meaning                              | Domain invariants in the relevant page briefs |
| Compact modal versus wide popover, pointer hover/focus preview versus touch navigation, compact list-first versus wide list-and-map              | Normal responsive or capability adaptation    |
| Administrator redesign after 2.0, Recital viewer/editor dynamics, and real-time co-editing                                                       | Scope boundary or Future Work                 |
| Current wide-screen fixed `390px` shell, nested chart-preview `main`, incomplete custom composite keyboard behavior, and hidden `0 × 0` X iframe | Implementation debt to remove or repair       |

## Focused Reference Convergence

The focused review exceeded the required twelve independent sources and continued
past fifteen until additional sources no longer changed the classification, approval,
containment, fallback, lifecycle, or verification model.

| Evidence group                   | Representative sources                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Transferable result                                                                                                                                                                                                        | Limitation                                                                                          |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Contribution and admission       | [GOV.UK proposal process](https://design-system.service.gov.uk/community/propose-a-component-or-pattern/), [GOV.UK contribution criteria](https://design-system.service.gov.uk/community/contribution-criteria/), [USWDS maturity model](https://designsystem.digital.gov/maturity-model/), [Carbon component checklist](https://carbondesignsystem.com/contributing/component-checklist/), [NHS patterns](https://service-manual.nhs.uk/design-system/patterns), [PatternFly component groups](https://www.patternfly.org/component-groups/about-component-groups/) | Begin with demonstrated need, uniqueness, representative use, consistency, versatility, accessibility, and evidence. Product-specific work may remain outside the common library while still using its foundations.        | Large multi-team systems have roles NosLog does not; the user remains the single final approver.    |
| Status and lifecycle             | [Primer component lifecycle](https://primer.style/contribute/component-lifecycle/), [Atlassian release phases](https://atlassian.design/release-phases), [Atlassian contribution](https://atlassian.design/resources/contribution), [Spectrum principles](https://spectrum.adobe.com/page/principles/)                                                                                                                                                                                                                                                               | State, version, tests, documentation, responsive behavior, accessibility, production evidence, deprecation, and migration make maturity visible.                                                                           | NosLog does not need enterprise release bureaucracy or calendar expiry for stable domain contracts. |
| Decision records                 | [MADR](https://adr.github.io/madr/), [AWS ADR process](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html), [Google Cloud ADR overview](https://docs.cloud.google.com/architecture/architecture-decision-records)                                                                                                                                                                                                                                                                                              | Record context, options, decision, consequences, status, and history; supersede material decisions instead of silently changing them.                                                                                      | Architecture templates need design-, accessibility-, and product-specific fields for NosLog.        |
| Bounded accessibility exceptions | [W3C Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [W3C Orientation](https://www.w3.org/WAI/WCAG21/Understanding/orientation), [W3C Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)                                                                                                                                                                                                                                                                                                                     | A genuine spatial exception applies only to the necessary region. Surrounding content still reflows; orientation should not be forced when both work; drag interactions need non-drag alternatives unless truly essential. | WCAG establishes minimum conformance boundaries, not NosLog layout or visual styling.               |
| Specialized runtimes             | [MDN WebGL context restoration](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextrestored_event), [MDN context-loss detection](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/isContextLost), [X official embed](https://help.x.com/en/using-x/embed-x-feed), [X for Websites privacy](https://help.x.com/en/x-for-websites-ads-info-and-privacy)                                                                                                                                                              | GPU and third-party runtimes can fail or collect external data; lifecycle recovery, functional fallback, privacy treatment, and failure containment are part of the contract.                                              | Platform documentation does not determine NosLog copy, visual treatment, or product priority.       |

## Decision Log

| ID        | Decision                                                                                                   | Rationale                                                                                                                                                                                   | Status     |
| --------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `EXC-D01` | Use one Specialized Pattern and Exception Register rather than treating every domain rule as an exception. | Separates governed variance from domain truth, normal adaptation, scope boundaries, and implementation debt.                                                                                | `Approved` |
| `EXC-D02` | Permanent specialized contracts use trigger-based review without arbitrary expiry.                         | Stable domain needs should not expire by date, but must be reconsidered when scope, evidence, technology, accessibility, or reuse changes.                                                  | `Approved` |
| `EXC-D03` | Temporary exceptions require a removal milestone and replacement path.                                     | Prevents short-term implementation limits from silently becoming product rules.                                                                                                             | `Approved` |
| `EXC-D04` | Only the user/NosLog maintainer can approve an exception; downstream AI may only propose one.              | Preserves the approved design-decision authority across the Claude Design and future Codex stages.                                                                                          | `Approved` |
| `EXC-D05` | Register `SP-01` through `SP-06` as the initial approved specialized contracts and bounded exceptions.     | Each item already has an approved user need and page-brief contract, and the register adds containment, fallback, validation, and review governance without reopening its product decision. | `Approved` |

## Downstream Handoff Contract

- Claude Design must represent every in-scope specialized contract and its fallback,
  state, and boundary. It may refine visual composition only inside the approved rules.
- Claude Design must not copy a specialized pattern onto another page family or turn a
  local exception into a global component without a new `Proposed` record and approval.
- Future Codex implementation must map each record to code, automated checks where
  practical, browser acceptance criteria, and manual accessibility verification.
- A conflict between an approved page brief, this register, and downstream design must
  stop design or implementation for user review; it must not be resolved silently.
- Current implementation debt remains debt even if it superficially resembles an
  approved exception.

## Acceptance Checklist

- [x] The user approved the classification model and governance approach.
- [x] The user approved `SP-01` through `SP-06`.
- [x] Permanent and temporary lifecycle rules are explicit.
- [x] User-only approval authority is explicit.
- [x] Normal adaptations, scope boundaries, and implementation debt are excluded.
- [x] The English canonical and Korean companion documents contain the same
      substantive requirements.
- [ ] Foundation values, component anatomy, and high-fidelity treatment remain for
      their later approved phases.
