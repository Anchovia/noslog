# NosLog 2.0 Foundation v0.1 Promotion and Reusable Ordinary UI

## Document control

- Status: `Approved — Block 5 complete`
- Language: English
- Last updated: 2026-08-13
- Normative Foundation: [document 24](./24-foundation-v0.1.md)
- Provenance: [document 25](./25-foundation-v0.1-provenance.md)
- Scope authority: [document 57](./57-design-guide-remaining-work-audit.md)
- Controlled artifact:
  [Foundation v0.1 integrated regression](./specimens/foundation-v0.1-integrated-regression.html)
- Excluded: complete chart viewer/editor, final logo drawing, new page structure,
  final high-fidelity pages, and production implementation

## Block 5 purpose

Block 5 checks whether the already approved Foundation contracts operate together on
representative ordinary NosLog content and packages only the reusable responsibilities
that current page briefs already require. It does not redo source research, promote
historical specimen styling, or create a new page family.

The controlled artifact is a self-contained regression harness. It must not iframe,
copy, or depend on old serial comparison pages. It is not a final NosLog page or a
high-fidelity design target.

## Regression contract

The harness covers four different ordinary-UI pressures without assigning them old
`S` labels:

1. music discovery and result refinement;
2. Music detail identity, difficulty, metrics, and judgement/local-data summaries;
3. dense ranking and exact-value comparison;
4. Home routing, feedback, loading/empty/error recovery, and ordinary overlays.

It exposes Light/Dark appearance, Korean/Japanese/English content, representative
`320px`, `390px`, and wide content regions, and 100/200% text conditions. It validates
scope and token collisions rather than prescribing final composition.

| Gate              | Required result                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Scope             | No viewer/editor, renderer, `S4`, `S6`, or production file reference                                                         |
| Authority         | Values come only from document `24`; no Tailwind palette, old comparison candidate, or local hybrid                          |
| Neutral hierarchy | Surfaces, text, ordinary interaction, boundaries, identity, and primary action retain their approved restrained roles        |
| Narrow chroma     | Feedback, difficulty, local data, and judgement color remains inside its exact semantic marker/plot responsibility           |
| Focus             | Keyboard-visible `FOCUS-1B`: one achromatic `1px` inside border on the control; no pointer outline                           |
| Typography        | Approved composites, natural tracking, real multilingual pressure, and approved first-party dynamic-subset delivery          |
| Responsive        | No page-level horizontal overflow at `320px`, `390px`, or eligible wide arrangements                                         |
| Text growth       | Content and controls remain available at `200%` text size without hiding required meaning                                    |
| Non-color         | State, difficulty, judgement, FAST/SLOW, and chart comparison retain names, values, order, shape/pattern, or explicit status |
| Accessibility     | Semantic headings, labels, tables, visible focus, named icon-only controls, and explicit states remain intact                |

Historical glyph placeholders and temporary controls are not icon or component
authority. Downstream design must use the approved Lucide and semantic contracts, not
copy the harness appearance.

## Completed browser verification

The self-contained harness was checked in the local test browser on 2026-08-10. These
results validate the harness as controlled evidence; they do not approve its page
composition or settle the material decisions below.

| Condition                            | Result                                                                                                                                                         |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Korean, Dark, `320px`, 100% text     | All four fragments and the review frame fit their content region without horizontal overflow.                                                                  |
| English, Dark, `320px`, 200% text    | Required content and controls remain available; the root, frame, toolbar, fragments, and table do not overflow horizontally.                                   |
| Japanese, Light, `390px`, 100% text  | Content reflows without horizontal overflow and the Japanese title/content switch is applied.                                                                  |
| Korean, Dark, wide region, 100% text | Two-column comparison uses the available region without root, frame, or fragment overflow.                                                                     |
| Pointer focus                        | Pointer activation produces no decorative perimeter, including when the browser still reports `:focus-visible`.                                                |
| Keyboard focus                       | The controlled artifact now uses the approved achromatic single `1px` inside border and does not expose a pointer-only outline.                                |
| Overlay focus                        | Opening the details dialog focuses its named close control; closing it restores focus to the invoking `Details` button.                                        |
| Scope and dependencies               | The document contains no `iframe`, `canvas`, external resource, viewer/editor fragment, renderer dependency, or historical specimen dependency.                |
| Semantics and runtime                | Four labeled `article` regions, one semantic ranking table, named controls, and explicit status copy remain present; no console warning or error was observed. |

The pointer/keyboard result uses an explicit input-modality attribute rather than the
browser's `:focus-visible` heuristic alone. This prevents a persistent Dark outline
for pointer activation while preserving the approved keyboard-visible indicator.
The indicator uses only the control's achromatic `1px` inside boundary and does not
change its size, position, radius, or surrounding layout.

## Corrected Foundation summary

| Responsibility     | Approved contract                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| Typography         | Pretendard JP Variable family, document `24` composites, and approved `FPR-02` delivery contract |
| Neutral            | Adobe Spectrum S2 exact `M-A`, `F-A`, `NB-A`, and `NI-A`                                         |
| Focus              | `FI-C` achromatic single `1px` inside border on the control (`FOCUS-1B`)                         |
| Reserved signature | `SS-08` Radix Indigo has no current UI alias                                                     |
| Identity           | `ITA-C` achromatic mark and wordmark                                                             |
| Filled primary     | `RPA-A` Spectrum-neutral, rare and bounded                                                       |
| Material           | `MG-A` Adobe Spectrum S2                                                                         |
| Feedback           | `FS-BN` Atlassian chroma with neutral message typography                                         |
| Difficulty         | `DU-01` Spectrum four-marker mapping                                                             |
| Local data         | `LD-03` SAP single/sequential/FAST-SLOW/generic categorical mapping                              |
| Judgement          | `JD-02` Radix five judgement markers only                                                        |
| Iconography        | `IC-06` Lucide                                                                                   |
| Motion             | `MO-02` Atlassian `0/50/100/150/200/250ms` roles and `400ms` ceiling                             |
| Data visualization | `DV-05` Primer anatomy with NosLog colors and semantic-table floor                               |

The corrected summary intentionally does not assign Radix to primary actions, does not
assign FAST/SLOW to `JD-02`, and does not rename `MG-A` as `MG-01`.

`FPR-03` promoted all contracts in document `24` together as the approved Foundation
v0.1 normative authority on 2026-08-11. This promotion changes no values, source
selections, production files, final page composition, or viewer/editor boundary.

## Pretendard JP delivery and fallback decision

### Repository finding

The current application bundles `app/fonts/PretendardVariable.woff2` through
`next/font/local`. It is standard Pretendard `1.20250`, not the approved Pretendard JP
family. It is migration evidence only and must not be described as Foundation v0.1
compliance.

### Official-source findings

- Pretendard JP publishes a variable family and an official KO/JA/system fallback
  sequence. The reviewed upstream release is `1.3.9`.
- The complete `PretendardJPVariable.woff2` is approximately `5.35 MB`; unconditional
  first-view preload would impose unnecessary transfer.
- The official version-pinned variable dynamic-subset CSS loads only the Unicode ranges
  required by a page.
- Next.js can self-host local font assets and use explicit fallbacks. Production need
  not depend on a runtime third-party CDN.

Primary sources:
[Pretendard JP official documentation](https://github.com/orioncactus/pretendard/tree/main/packages/pretendard-jp/docs/en),
[version-pinned variable dynamic-subset CSS](https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-jp-dynamic-subset.min.css),
and [Next.js Font API](https://nextjs.org/docs/app/api-reference/components/font).

### Approved production contract — `FPR-02`

1. Vendor the official Pretendard JP `1.3.9` variable dynamic-subset CSS and referenced
   WOFF2 subsets on the NosLog origin.
2. Preserve the upstream font data. Repackage only the asset URLs needed to serve the
   CSS and WOFF2 slices from the same NosLog origin.
3. Pin version and SIL OFL 1.1 license/provenance; do not use an unversioned runtime
   CDN URL.
4. Use the official family order beginning with `Pretendard JP Variable`, then
   `Pretendard JP`, `Pretendard`, platform UI fonts, Japanese/Korean system fonts, and
   generic sans-serif.
5. Apply `ss05` only in `lang="ko"`.
6. Keep `font-display: swap`, validate fallback metrics in Korean/Japanese/English,
   and remove the current standard Pretendard asset only after migration verification.
7. Do not preload the complete `5.35 MB` variable file. Preload a critical subset only
   if later performance evidence justifies it.
8. Treat the official dynamic-subset stylesheet as the delivery mechanism rather than
   replacing it with one complete `next/font/local` JP file.
9. The future implementation session performs the font migration; this design-guide
   session changes no production font asset.

This resolves the only primitive-delivery decision in Block 5.

## Approved reusable component aliases — `FPR-04`

These aliases describe responsibilities, not appearance or a request to build a large
library now.

| Alias                | Responsibility                                                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppHeader`          | Achromatic identity, current navigation context, and labeled or accessible secondary actions                                                       |
| `SearchField`        | Accessible query, submit, loading, empty, error, and result-status relationships                                                                   |
| `ContentScopeSwitch` | Switch content kind within one search/comparison task without pretending to be page navigation                                                     |
| `FilterSortControl`  | Disclose secondary refinement without persistent option clutter                                                                                    |
| `ViewModeSwitch`     | Change presentation of one result set with programmatic and persistent selected state                                                              |
| `ResultCollection`   | Flat scannable linked entities with stable identity, metadata, and narrow domain markers; hover/focus never substitutes personal-record content    |
| `MusicEntityHeader`  | Canonical Music identity, localized companion access, facts, and contextual actions                                                                |
| `DifficultySelector` | Neutral control with four persistent approved markers outside the locked viewer/editor                                                             |
| `MetricSummary`      | Label, exact value, unit/basis, and comparison context without decorative color                                                                    |
| `DataTable`          | Semantic headers, row identity, exact values, current-user context, and responsive priority                                                        |
| `Pagination`         | Current/adjacent pages, ellipsis semantics, and previous/next actions                                                                              |
| `StatusMessage`      | Neutral title/body with approved Atlassian semantic marker, boundary, icon, and recovery                                                           |
| `FormField`          | Persistent label, help/constraint, value and availability state, associated error, and safe input preservation                                     |
| `Disclosure`         | Keyboard-operable reveal of secondary explanation or controls                                                                                      |
| `Overlay`            | Family contract that selects the correct popover/menu/dialog semantics, focus, dismissal, geometry, and motion rather than one universal component |
| `OrdinaryDataChart`  | Primer anatomy, exact-value interaction, non-color distinction, and same-data semantic table                                                       |

Visible icon controls use Lucide. Icon-only controls need an accessible name and
approved target. A local alias may not add a color, radius, shadow, or motion outside
document `24`.

`FormField` is a shared responsibility across Settings and onboarding, not a visual
field template. It covers persistent programmatic labels, help and constraints,
disabled/read-only/busy state where applicable, associated validation feedback, and
preservation of valid input after a failed submission. Native controls remain the
default where they satisfy the approved semantics.

`Overlay` is an interaction family, not permission to implement one polymorphic
overlay for every case. Each use must choose the correct dialog, popover, disclosure,
or ordinary navigation semantics from its owning page brief.

## Approved reusable patterns — `FPR-04`

| Pattern                  | Contract                                                                                                                                        |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Discovery and refinement | Search first; expose committed result status; disclose filters; retain loading/empty/error recovery and restorable state.                       |
| Focused entity detail    | Lead with canonical identity and current task, then progressively disclose records, comparison, and explanation.                                |
| Dense comparison         | Preserve table relationships, scan order, current-user context, exact values, and narrow priority without page-level two-dimensional scrolling. |
| Home task routing        | One clear search entry, restrained peer destinations, routine product tasks before editorial content, and explicit service/search failure.      |
| Feedback and recovery    | Explain in neutral typography, attach the approved severity roles, and provide one clear recovery action when available.                        |
| Responsive adaptation    | Recompose from content needs; validate `390px`, reflow at `320px`, and use wide space for comparison or parallel reading.                       |

These patterns preserve the current approved page briefs. They are not final templates,
wireframes, or permission to copy old specimen controls. There is no viewer/editor
template in the 2.0 package.

## Promotion prohibitions

- No Tailwind palette, starter card, sample gradient, radius, shadow, or implicit
  transition becomes a Foundation value.
- No new hybrid neutral, chromatic step, radius, shadow, or timing may be invented.
- Chroma remains a narrow semantic exception, not decoration.
- Dark containers do not receive persistent white outlines.
- Block 5 does not implement production code or authorize viewer/editor changes.

## Block 5 decision log

| ID       | Entry                                                                                                                                          | Status                                      |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `FPR-01` | Use one self-contained artifact only as a collision/regression harness for approved ordinary UI.                                               | `Accepted supporting evidence — 2026-08-11` |
| `FPR-02` | Adopt version-pinned, first-party self-hosted Pretendard JP variable dynamic-subset delivery and official fallback order.                      | `Approved — 2026-08-11`                     |
| `FPR-03` | Promote the approved document `24` contracts together as Foundation v0.1 without reopening source decisions.                                   | `Approved — 2026-08-11`                     |
| `FPR-04` | Adopt the reusable aliases and patterns above, adding `FormField`, narrowing `MusicEntityHeader`, and treating `Overlay` as a family contract. | `Approved — 2026-08-11`                     |
| `FPR-05` | Keep the complete viewer/editor outside regression, reusable UI, and downstream template work.                                                 | `Locked approved boundary`                  |

## Block 5 completion

Block 5 is complete. The controlled harness passed its stated checks, `FPR-02`
approved the production font-delivery contract, `FPR-03` promoted Foundation v0.1,
and `FPR-04` approved the lean reusable ordinary-UI package on 2026-08-11.

Do not reopen Block 5 from an older proposal, specimen, checklist, or deleted
comparison. Only a precise acceptance failure or a new explicit user decision may
reopen a named contract. There is no viewer/editor follow-up.
