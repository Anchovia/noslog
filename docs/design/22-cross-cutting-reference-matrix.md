# NosLog 2.0 Cross-Cutting Principles and Exception Governance

## Document control

- Status: `Approved — consolidated current authority`
- Language: English
- Research date: 2026-08-03
- Consolidated: 2026-08-10
- Scope: evidence roles, approved cross-cutting principles, accessibility and
  internationalization constraints, and specialized-pattern governance
- Normative Foundation values: [document 24](./24-foundation-v0.1.md)
- Foundation provenance: [document 25](./25-foundation-v0.1-provenance.md)
- Locked viewer/editor boundary:
  [document 07](./07-chart-viewer-editor-preservation.md)

This document consolidates the still-current substance of the former cross-cutting
matrix and exception register. It does not reopen completed Foundation values or
authorize any viewer/editor change.

## Evidence method

References are used only for the role they can support.

| Role | Evidence class                                                          | Valid use                                                                                            | Invalid use                                                          |
| ---- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `A`  | Standards and authoritative accessibility/internationalization guidance | Required semantics, language, reflow, input, focus, contrast, and preference behavior                | Visual art direction or domain meaning                               |
| `B`  | Maintained official design systems and platform guidance                | Foundation models, token roles, responsive patterns, interaction anatomy, implementation constraints | Copying brand values or components without a focused NosLog decision |
| `C`  | Current production services                                             | Observing hierarchy, density, adaptation, and real-world tradeoffs                                   | Treating one product as a universal rule                             |
| `D`  | Official game material and rhythm-game products                         | Domain terminology, score relationships, chart identity, and arcade context                          | Importing another game's mechanics or surface styling                |
| `E`  | Editorial and art-direction references                                  | Proportion, typographic contrast, pacing, composition, imagery, and expression                       | Accessibility, navigation, or dense-product behavior                 |

Localized copies, mirrors, package versions, and repeated documentation pages are not
independent evidence. A material decision requires at least twelve relevant,
independent sources and should continue past fifteen when credible evidence still
changes the result. A broad source pool is a starting point, never a waiver for focused
research.

## Approved cross-cutting principles

| ID      | Principle                           | Required interpretation                                                                                                                            |
| ------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PR-01` | Shared hierarchy                    | Map page tasks to shared semantic roles rather than creating page-local emphasis systems.                                                          |
| `PR-02` | Familiar interaction, exact domain  | Use familiar web patterns without replacing NOSTALGIA entities, labels, or relationships.                                                          |
| `PR-03` | Concise with context                | Keep default views concise while preserving the scope, selection, state, unit, denominator, or value needed to interpret results.                  |
| `PR-04` | Dark anchor, complete appearances   | Use Dark as the representative art-direction anchor while supporting complete System, Dark, and Light behavior through documented semantic roles.  |
| `PR-05` | One multilingual hierarchy          | Preserve one semantic typographic hierarchy across Korean, Japanese, English, and mixed-script content; validate each script's actual composition. |
| `PR-06` | Content-driven recomposition        | Preserve task and meaning while recomposing from content and container constraints from `320 CSS px` through wide analytical layouts.              |
| `PR-07` | Exact comparison evidence           | Align comparison frames and connect every visualization to exact scope, unit, denominator, order, scale, time, labels, and accessible data.        |
| `PR-08` | Restrained controls                 | Keep emphasis scarce, disclose secondary controls contextually, and build identity through content and composition rather than persistent accent.  |
| `PR-09` | Accessibility as construction input | Preserve equivalent information and task completion through semantics, keyboard, touch, focus, reflow, alternatives, and preference support.       |
| `PR-10` | Governed specialization             | Admit specialized behavior only through documented purpose, smallest boundary, fallback, validation, ownership, and review.                        |

All ten principles are `Approved`. Exact values and aliases are governed by document
`24`, not by early open questions preserved in Git history.

## Accessibility and internationalization floor

The design and release target is WCAG 2.2 AA. Native HTML semantics are preferred.
Custom composites require complete name, role, value, state, focus, keyboard, pointer,
touch, and announcement behavior.

Every applicable ordinary-UI requirement and specimen must verify:

- no loss of content or function at `200%` text resize and `320 CSS px` reflow;
- user text-spacing overrides, browser zoom, safe areas, and tiled windows;
- visible keyboard focus, logical source/focus order, skip paths, and no keyboard trap;
- pointer and touch target geometry with alternatives to dragging;
- Light/Dark contrast, non-color cues, forced colors, color-disabled review, and
  color-vision-deficiency review for data;
- `prefers-reduced-motion` with immediate state and equivalent static meaning;
- loading, empty, partial, error, disabled, permission, and destructive states;
- Korean, Japanese, English, and mixed-script line breaking, punctuation, labels,
  date/number formatting, and long real content;
- equivalent text or semantic-table access for nontrivial visualizations.

Automated checks, lint, or a component-library audit alone are not proof. Validate
representative complete tasks with keyboard-only, screen-reader, zoom, text-spacing,
forced-colors/high-contrast, reduced-motion, touch, and browser review as applicable.

Primary standards include [WCAG 2.2](https://www.w3.org/TR/WCAG22/),
[WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/),
[WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html),
[WCAG Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html),
[WCAG Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html),
[KLReq](https://www.w3.org/TR/klreq/), [JLReq](https://www.w3.org/TR/jlreq/),
[CSS Text](https://www.w3.org/TR/css-text-3/), and
[Unicode LDML](https://www.unicode.org/reports/tr35/).

## Responsive and content rules

- `390px` is a representative mobile review canvas, not a fixed width, minimum,
  standard, or breakpoint.
- Ordinary content reflows without page-level two-dimensional scrolling at
  `320 CSS px`.
- Use stable semantic/source order across layouts. Recomposition may change grouping,
  columns, disclosure, and visible density without changing task meaning.
- Wide layouts use space for comparison, analysis, parallel reading, and
  administration, not simply an enlarged mobile column.
- Viewport queries govern page-level alignment; nested components use container queries
  when their own available space determines composition.
- Do not shrink type, targets, or data marks to preserve a preferred arrangement.
- The locked viewer/editor is outside these rules.

## Specialized-pattern classification

| Classification       | Meaning                                                       | Governance                                                                  |
| -------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Domain invariant     | A factual NOSTALGIA or NosLog product relationship            | Record in the relevant brief; do not call it an exception.                  |
| Normal adaptation    | Expected responsive, locale, input, or state variation        | Keep inside the shared rule; no exception record.                           |
| Specialized contract | A permanent, task-specific pattern that narrows a shared rule | Record purpose, boundary, fallback, validation, owner, and review triggers. |
| Bounded exception    | A local variance necessary for meaning or task completion     | Use the smallest exact region and require normal rules outside it.          |
| Temporary exception  | A short-lived implementation limitation                       | Name removal milestone, replacement path, and owner.                        |
| Scope boundary       | Work deliberately excluded from the initiative                | Record as excluded; never treat it as pending design work.                  |
| Implementation debt  | Current code that fails an approved requirement               | Track as debt; never elevate it into design authority.                      |

A proposed exception must show a verified need, the shared rule that is insufficient,
the smallest route/component/region/state boundary, an equivalent path or fallback,
cross-cutting impact, validation, lifecycle, and rejected alternatives. Visual
preference, legacy code, schedule pressure, framework defaults, and one screenshot are
insufficient.

Only the user can approve, expand, supersede, or retire an exception. A second page
family requesting the same local pattern triggers review for a shared abstraction;
repetition never promotes it automatically.

## Current specialized and bounded records

| ID            | Contract                                                    | Boundary and current disposition                                                                                                                                                                                                         |
| ------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PRES-01`     | Complete chart viewer/editor preservation                   | Scope boundary governed only by document `07`; it is not a reusable 2.0 pattern.                                                                                                                                                         |
| `SP-05`       | Single-series five-axis community-pattern radar             | Keep one stable learned five-axis order and scale, visible axis labels, exact supporting values, and a semantic alternative. Do not use it for precise or multi-series comparison.                                                       |
| `SP-06`       | Supplementary official X content                            | Load after core content, disclose third-party behavior, preserve a first-party summary/link and failure fallback, and never make it the only carrier of an announcement.                                                                 |
| `DATA-2D`     | Inherently dimensional ordinary data table or visualization | Contain overflow inside a labeled region and provide a semantic summary/table; ordinary page chrome still reflows.                                                                                                                       |
| `AUDIO-LOCAL` | User-selected chart audio remains device-local              | Do not upload MP3 data to NosLog servers or databases.                                                                                                                                                                                   |
| `FOCUS-1B`    | Single-border keyboard-visible focus geometry               | Eligible ordinary UI only: one `1px` inside focus border on the control itself, recoloring an existing resting boundary or appearing only while focused; pointer focus and the locked viewer/editor are excluded. Supersedes `FOCUS-2L`. |

The first four former viewer/editor entries are superseded by the single stronger
`PRES-01` boundary. They must not be interpreted as authorization to redesign or
apply ordinary Foundation rules inside those experiences.

### `FOCUS-1B` governed record — supersedes `FOCUS-2L` (2026-08-13)

- **Verified need:** the two-layer indicator read as a doubled outline and grew the
  focused object outward. The user rejected it on 2026-08-13 and required a single
  border that changes color the way an invalid field changes its border color.
- **Superseded rule:** `FOCUS-2L` (a `1px` separation edge plus a `2px` outer
  perimeter) is `Superseded`. Its geometry, external extent, and separation band no
  longer apply anywhere in ordinary NosLog 2.0 UI.
- **Smallest boundary:** keyboard-visible focus on eligible ordinary NosLog 2.0 UI;
  no pointer perimeter and no change inside the locked viewer/editor.
- **Equivalent path or fallback:** forced colors use system `Highlight` for the focus
  border; native semantics and focus order remain unchanged.
- **Cross-cutting impact:** none outward. The border is inside the control, so bounds,
  layout, scroll containment, and sticky regions are unaffected. Where the focus color
  cannot reach `3:1` on a filled control, the approved on-fill color is used instead.
  The indicator never recolors identity, selection, status, or content.
- **Accepted limitation:** a `1px` color-only indicator meets SC 2.4.7 but not the
  `2px` minimum of SC 2.4.13. Recorded with the decision rather than hidden.
- **Validation:** inspect all four sides in Light and Dark, bordered and borderless
  controls, rounded controls, overlays, scroll regions, keyboard navigation, zoom,
  text growth, and forced colors. Confirm the focused control's box is byte-identical
  to its resting box, and that the focus border differs measurably from the resting
  boundary color.
- **Lifecycle and owner:** permanent Foundation correction owned by document `24`;
  only the user may supersede it after equivalent cross-component evidence.
- **Rejected alternatives:** the former zero-gap ring, the two-layer separation
  geometry, thickness changes on focus, persistent pointer/Dark outlines, and
  decorative focus shadows.

## Focused source pool

The approved principles and Foundation research used, among others:

- standards: W3C WCAG/WAI, WAI-ARIA APG, KLReq, JLReq, CSS Text, Unicode LDML;
- maintained systems: Adobe Spectrum, Atlassian, Microsoft Fluent, IBM Carbon,
  GitHub Primer, SAP Fiori, Material, Shopify Polaris, Radix Colors, GitLab Pajamas,
  LINE, Ant Design, USWDS, GOV.UK, Apple HIG, and Japan Digital Agency;
- production and domain evidence: current NosLog code/browser behavior, official
  NOSTALGIA material, music/catalog services, ranking and chart products, and
  representative Korean/Japanese production work.

The focused selection provenance, package versions, exact candidates, measured
failures, and user decisions are consolidated in document `25`.

## Downstream handoff

- The active high-fidelity design stage may refine composition only inside approved page briefs, document
  `24`, and the records above. It may propose but not silently create an exception.
- Future implementation maps each active record to code and appropriate automated plus
  manual checks.
- If an approved pattern lacks a required state or fails an acceptance requirement,
  report the conflict and reopen it with the user.
- Git history preserves the retired detailed matrix and comparison evidence; it is not
  current design authority.

## Decision log

| ID        | Decision                                                                                    | Status                                |
| --------- | ------------------------------------------------------------------------------------------- | ------------------------------------- |
| `REF-D01` | Keep evidence roles distinct and record source limitations.                                 | `Approved`                            |
| `REF-D02` | Require focused twelve-to-fifteen-source research for material decisions.                   | `Approved`                            |
| `REF-D03` | Preserve approved page briefs and NOSTALGIA semantics over reference styling.               | `Approved`                            |
| `REF-D04` | Centralize exact Foundation values and selection provenance in documents `24` and `25`.     | `Approved consolidation — 2026-08-10` |
| `EXC-D01` | Use classified governance rather than treating every domain rule as an exception.           | `Approved`                            |
| `EXC-D02` | Use trigger-based review for permanent contracts and removal milestones for temporary ones. | `Approved`                            |
| `EXC-D03` | Reserve exception approval and expansion to the user.                                       | `Approved`                            |
| `EXC-D04` | Supersede former viewer/editor specialized entries with the absolute preservation contract. | `Approved correction — 2026-08-10`    |
