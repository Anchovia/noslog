# NosLog 2.0 Design-Guide Remaining-Work Audit

## Document control

- Status: `Approved current scope authority`
- Language: English
- Last updated: 2026-08-11
- Mirrors: the six-block table in the root `README.md`
- Foundation authority: [document 24](./24-foundation-v0.1.md)
- Foundation provenance: [document 25](./25-foundation-v0.1-provenance.md)
- Active Block 5 proposal:
  [document 63](./63-foundation-v0.1-reusable-ui-regression.md)

## Why this document exists

Earlier design-guide files accumulated chronological research plans, candidates,
specimens, unchecked future items, and superseded status language. Those internal
steps were repeatedly misreported as new top-level work. This audit is the only
design-document authority for what remains.

A later explicit user decision overrides an older plan. Deleted documents and Git
history preserve evidence; they do not restore work to the roadmap. No completion
percentage is permitted until the user approves both a denominator and method.

## Absolute exclusions

- The complete existing chart viewer/editor is preserved under
  [document 07](./07-chart-viewer-editor-preservation.md).
- There is no pending viewer/editor redesign, Foundation migration, component,
  specimen, responsive pass, accessibility reinterpretation, or contribution flow.
- Final high-fidelity pages and production application implementation belong to the
  later Claude Design and Codex stages, respectively.
- Final logo drawing is downstream visual design, not a missing Foundation decision.

## Fixed six-block baseline

|   # | User-facing block                       | Status        | Completed or remaining result                                                                                                                                                               |
| --: | --------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   1 | C5 color closeout                       | `Complete`    | Spectrum neutrals and difficulty, Fluent focus, Radix reserved signature/judgement, achromatic identity/action, Atlassian feedback, SAP local data; viewer/editor excluded                  |
|   2 | Iconography                             | `Complete`    | Lucide ordinary-UI source, geometry, sizes, labels, targets, and accessibility grammar approved                                                                                             |
|   3 | Motion / Reduced motion                 | `Complete`    | Atlassian exact duration/easing ownership and instant meaningful reduced mode approved                                                                                                      |
|   4 | Data-visualization anatomy              | `Complete`    | GitHub Primer ordinary-UI anatomy, exact-value access, non-color cues, and semantic-table floor approved                                                                                    |
|   5 | Foundation promotion and reusable UI    | `In progress` | Pretendard JP delivery is approved; approve/revise Foundation promotion and the reusable aliases and patterns in document `63`                                                              |
|   6 | Downstream handoff and milestone export | `Not started` | Consolidate screen requirements, implementation mapping, accessibility/localization/browser QA, Claude Design handoff, and export a versioned PDF after the user chooses language/packaging |

Only Blocks `5` and `6` remain. Research, candidates, specimens, browser checks,
documentation, and approval gates inside a block are not additional blocks or “next
tasks.”

## Completed scope that must not be reopened by stale text

- product and route audit;
- information architecture, navigation, user flows, and current page-family briefs;
- cross-cutting principles, evidence method, accessibility floor, and exception
  governance;
- typography, spacing, grid, layout, containers, neutral color, focus, identity,
  primary action, material, feedback, domain/data colors, iconography, motion, and
  ordinary data-visualization source decisions;
- the entire chart viewer/editor scope correction and preservation boundary.

A failed current acceptance requirement or a new explicit user decision may reopen a
precisely named item. Preference, an old unchecked box, or a deleted specimen may not.

## Active Block 5 gate

Block 5 does not re-run old source comparisons. It packages and checks the already
approved contracts in document `24`.

`FPR-02` is approved: use the version-pinned official Pretendard JP `1.3.9`
variable dynamic subsets, first-party self-hosted with the official fallback order.

The current material decisions awaiting user review are:

1. `FPR-03`: promote the approved Foundation inputs together without reopening their
   source selections; and
2. `FPR-04`: approve or revise the implementation-neutral reusable aliases and
   patterns recorded in document `63`.

The regression HTML is evidence for these decisions, not a final NosLog page or a
source of component appearance. It contains no viewer/editor fragment.

## Block 6 result

After Block 5 approval, Block 6 must produce one coherent downstream package:

- current screen and page-family requirements linked to the approved briefs;
- Foundation and reusable-pattern implementation mapping;
- accessibility, localization, state, responsive, and browser acceptance matrix;
- explicit chart viewer/editor preservation instruction;
- Claude Design prompt/handoff boundaries and conflict escalation rule;
- editable guide index and a versioned PDF after the user chooses its language and
  packaging.

Block 6 does not create the final high-fidelity page suite or implement the app.

## Current active design-document set

The active tree contains only:

- documents `01–19` for product evidence, IA, and current page-family requirements,
  with document `07` converted to preservation-only authority;
- document `22` for cross-cutting principles and exception governance;
- document `24` for normative Foundation v0.1;
- document `25` for consolidated provenance and decision history;
- this document `57` for remaining scope; and
- document `63` for the active Block 5 gate.

All active design documents are English-only. Serial comparison documents, Korean
companions, obsolete viewer/editor briefs, and historical specimens remain available
only through Git history.

## Decision log

| ID       | Decision                                                                                                       | Status                       |
| -------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `RWA-01` | Use exactly six top-level blocks and never convert internal steps into more blocks.                            | `Approved correction`        |
| `RWA-02` | Treat Blocks 1–4 as complete and locked unless a precise failure or user decision reopens one.                 | `Approved`                   |
| `RWA-03` | Keep the complete viewer/editor outside all remaining work.                                                    | `Approved absolute boundary` |
| `RWA-04` | Report no completion percentage without an approved denominator and method.                                    | `Approved correction`        |
| `RWA-05` | Consolidate active design authority to English-only current documents and rely on Git for superseded evidence. | `Approved — 2026-08-10`      |
| `RWA-06` | Use official Pretendard JP `1.3.9` variable dynamic subsets as version-pinned, first-party self-hosted assets. | `Approved — 2026-08-11`      |
