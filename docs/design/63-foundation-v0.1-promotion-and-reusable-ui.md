# NosLog 2.0 Foundation v0.1 Promotion and Reusable Ordinary UI

## Document control

- Status: `Proposed — Block 5 final approval pending`
- Canonical language: English
- Korean companion:
  [63-foundation-v0.1-promotion-and-reusable-ui.ko.md](./63-foundation-v0.1-promotion-and-reusable-ui.ko.md)
- Date: 2026-08-10
- Inputs: approved documents `24`–`62`, the fixed six-block authority in document
  `57`, and the completed `S1`, `S2`, `S3`, and `S5` structure fixtures
- Integrated specimen:
  [foundation-v0.1-integrated-regression.html](./specimens/foundation-v0.1-integrated-regression.html)
- Scope: promotion of the approved ordinary-UI Foundation and consolidation of
  already validated reusable aliases, patterns, and templates
- Excluded: `S4`, `S6`, the entire chart viewer/editor, new page structure, final
  logo drawing, final high-fidelity design, and production implementation

## Block 5 boundary

This block does not redesign any page and does not create another work package. It
applies the already approved Foundation inputs to the already approved ordinary-UI
fixtures, checks for collisions, and packages only the reusable contracts those
fixtures have already validated. Earlier alternatives remain evidence; rejected or
superseded candidates do not become downstream targets.

The entire chart viewer/editor remains locked. Nothing in this document authorizes a
change to its shell, controls, accessibility behavior, responsive layout, renderer,
notes, hand colors, geometry, motion, or editor model.

## Integrated regression result

The common regression layer applies approved Foundation values without replacing the
fixture structure. The wrapper exposes `S1`, `S2`, `S3`, and `S5`; Dark/Light;
Pretendard JP/intentional fallback; `320`, `390`, and eligible wide layouts; KO/JA/EN;
and 100/200% text conditions.

| Gate                         | Evidence                                                                                                                                             | Result                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Included structure           | Only the approved `S1`, `S2`, `S3`, and `S5` source fixtures are embedded.                                                                           | `Pass`                             |
| Scope lock                   | No `S4`, `S6`, viewer, editor, or renderer file is referenced or changed.                                                                            | `Pass`                             |
| Neutral themes               | Approved Spectrum S2 Dark/Light neutral role mappings are applied intact.                                                                            | `Pass`                             |
| Approved color exceptions    | Difficulty, ordinary local-data, feedback, and judgement colors remain narrow semantic exceptions; hierarchy stays neutral.                          | `Pass`                             |
| Responsive reflow            | Representative `320`, `390`, and eligible wide combinations produce no fixture-level horizontal overflow.                                            | `Pass`                             |
| Localization and text growth | Representative KO/JA/EN and 200% text combinations produce no fixture-level horizontal overflow.                                                     | `Pass`                             |
| S5 exhaustive matrix         | Existing 13 widths × 3 locales × 2 scales × 8 states matrix with the common Foundation layer: `624` cases, `0` failures.                             | `Pass`                             |
| Font load/fallback           | Official version-pinned Pretendard JP dynamic subset loads in the specimen; intentional system fallback remains operable.                            | `Pass — delivery approval pending` |
| Browser console              | No new page-authored runtime error. One earlier iframe-observer error came from the browser automation layer and did not recur with page navigation. | `Pass with noted tool artifact`    |

Historical fixture notes and text glyphs remain structure-test placeholders. They are
not iconography authority. Production and downstream design must use the approved
`IC-06 · Lucide` contract; this regression does not redraw historical specimens into
final pages.

## Foundation v0.1 promotion candidate

Promotion means that these approved sources operate together as the default
ordinary-UI contract. It does not permit mixing, interpolating, or replacing their
primitive values with Tailwind defaults.

| Foundation role              | Governing approved source and contract                                                                    |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| Typography                   | Pretendard JP Variable; approved type roles and Korean-only `ss05` from documents `24`–`25`               |
| Neutral primitives and roles | Adobe Spectrum S2 exact Dark/Light neutral ramps and mappings in documents `32`–`37`                      |
| Signature accent             | `SS-08 · Radix Colors Indigo`, only through approved rare-primary and signature aliases                   |
| Identity touchpoints         | `ITA-C · Achromatic`; product identity remains neutral                                                    |
| Geometry and material        | `MG-01 · Adobe Spectrum S2`; 4px control, 8px container, 10px overlay geometry and flat bounded surfaces  |
| Feedback and status          | `FS-BN · Atlassian semantic color + neutral message typography`                                           |
| Difficulty markers           | `DU-01 · Adobe Spectrum S2`, limited to Normal/Hard/Expert/Real markers outside the renderer              |
| Ordinary local data          | `LD-03 · SAP Fiori Horizon`, with semantic/domain exceptions documented separately                        |
| Judgement domain             | `JD-02 · Radix Colors 3.0.0`, limited to judgement markers and FAST/SLOW treatment                        |
| Iconography                  | `IC-06 · Lucide`, 20px default, 16px compact supporting, published 2px outline geometry                   |
| Motion                       | `MO-02 · Atlassian`, 0/50/100/150ms roles and instant reduced-motion alternatives                         |
| Ordinary data visualization  | `DV-05 · GitHub Primer` anatomy with the W3C semantic-table floor and circular personal/benchmark markers |

### Promotion prohibitions

- Tailwind remains an implementation utility, never a palette or component-style
  source.
- Do not create a hybrid ramp, intermediate swatch, radius, shadow, or animation to
  make a screen appear more “NosLog-like.”
- Neutral hierarchy is the default. Signature, status, difficulty, local-data, and
  judgement colors are narrow semantic exceptions, not decoration.
- The approved absence of persistent outlines on dark containers remains intact.
  Boundaries appear only where containment, interaction, or state requires them.
- Promotion does not authorize changes to the locked viewer/editor.

## Pretendard JP delivery and fallback proposal

### Repository finding

The current application bundles `app/fonts/PretendardVariable.woff2` through
`next/font/local`. It is standard Pretendard `1.20250`, not the approved Pretendard JP
family. It is migration evidence only and must not be presented as Foundation v0.1
compliance.

### Official-source findings

- Pretendard JP publishes a variable family and an official KO/JA/system fallback
  sequence. The inspected upstream release is `1.3.9`.
- The complete upstream `PretendardJPVariable.woff2` is approximately `5.35 MB`; eager
  first-view preload would impose an avoidable transfer cost.
- The official version-pinned variable dynamic-subset CSS loads only Unicode ranges
  needed by the page. The specimen uses this official asset to verify family and
  fallback behavior.
- Next.js `next/font` self-hosts local font files and supports explicit fallbacks.
  Production should therefore vendor the pinned Pretendard JP dynamic-subset assets
  on the NosLog origin, not depend on a runtime third-party CDN.

Primary sources:
[Pretendard JP official documentation](https://github.com/orioncactus/pretendard/tree/main/packages/pretendard-jp/docs/en),
[official version-pinned variable dynamic-subset CSS](https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-jp-dynamic-subset.min.css),
and [Next.js Font API](https://nextjs.org/docs/app/api-reference/components/font).

### Proposed production contract

1. Vendor the official Pretendard JP `1.3.9` variable dynamic-subset CSS and referenced
   WOFF2 subset files on the NosLog origin.
2. Pin the upstream version and record license/provenance; do not use an unversioned
   CDN URL.
3. Use the official family order beginning with `Pretendard JP Variable`, then
   `Pretendard JP`, `Pretendard`, platform UI fonts, Japanese/Korean system fonts, and
   generic sans-serif.
4. Apply `ss05` only inside `lang="ko"`; do not force it onto Japanese or English.
5. Keep `font-display: swap`, preserve usable fallback metrics, and verify KO/JA/EN
   before removing the current standard Pretendard asset.
6. Do not preload the complete 5.35 MB variable file. Preload only an evidence-backed
   critical subset if later performance measurement justifies it.
7. The later implementation session performs the application-font migration; this
   design-guide session changes no production font asset or layout code.

This delivery contract is the only material user decision still open in Block 5. If
approved, Foundation v0.1 and the reusable contracts below can be promoted together
without another visual-source comparison.

## Reusable component aliases

These are implementation-neutral aliases, not a request to create a large component
library now. Later work may map them to existing project components when semantics and
states match.

| Alias                | Validated responsibility                                                                  | Validated by       |
| -------------------- | ----------------------------------------------------------------------------------------- | ------------------ |
| `AppHeader`          | Achromatic identity, navigation context, labeled or accessible secondary actions          | S1, S2, S3, S5     |
| `SearchField`        | Accessible query input, submit action, and applicable loading/empty/error/results states  | S1, S5             |
| `ContentScopeSwitch` | Switches searched or compared content kind without acting as page navigation              | S1, S5             |
| `FilterSortControl`  | Opens secondary filtering/sorting without persistent option clutter                       | S1, S3             |
| `ViewModeSwitch`     | Changes presentation of the same result set with programmatic selected state              | S1                 |
| `ResultCollection`   | Flat, scannable linked results with stable identity, metadata, and domain markers         | S1, S5             |
| `EntityHeader`       | Music identity, translated/original metadata, supporting facts, contextual actions        | S2                 |
| `DifficultySelector` | Neutral control with four approved persistent markers outside the renderer                | S2                 |
| `MetricSummary`      | Label, exact value, unit/basis, and comparison context without decorative color           | S2, S3             |
| `DataTable`          | Semantic headers, row identity, exact values, current-user treatment, responsive priority | S3                 |
| `Pagination`         | Current and adjacent pages, ellipsis semantics, previous/next actions                     | S3                 |
| `StatusMessage`      | Neutral title/body with approved Atlassian semantic marker/icon/boundary roles            | S1, S2, S3, S5     |
| `Disclosure`         | Keyboard-operable reveal of secondary explanation or controls                             | S2, S3             |
| `Overlay`            | Contextual popover/list/dialog using approved geometry, focus, dismissal, and motion      | S2, S5             |
| `OrdinaryDataChart`  | Primer anatomy, exact-value interaction, non-color distinction, same semantic table       | S2 and document 62 |

Visible icon controls use Lucide. Icon-only controls require an accessible name and
the approved target size. Text glyphs in historical fixtures are never component
assets.

## Reusable patterns

| Pattern                         | Contract                                                                                                                                         | Template evidence |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| Discovery and result refinement | Search first; expose committed result status; disclose filters; retain loading/empty/error recovery.                                             | `S1`              |
| Focused entity detail           | Lead with music identity and current task, then progressively disclose comparison, records, and explanatory data.                                | `S2`              |
| Dense comparison data           | Preserve table relationships, scan order, current-user context, exact values, and narrow-screen priority without two-dimensional page scrolling. | `S3`              |
| Home task routing               | One clear search entry, restrained destinations, routine content before editorial/official content, defined service/search failures.             | `S5`              |
| Feedback and recovery           | Explain in neutral typography, attach approved severity roles, provide one clear recovery action when available.                                 | S1, S2, S3, S5    |
| Responsive adaptation           | Recompose from content needs; `390px` review canvas, `320 CSS px` reflow floor, wide space for comparison or parallel reading.                   | S1, S2, S3, S5    |

## Template status

`S1`, `S2`, `S3`, and `S5` are approved structural templates for downstream design
requirements. They establish content priority, responsive relationships, required
states, and component responsibilities. They are not final pages or visual comps and
do not authorize copying placeholder glyphs or specimen controls. No new `S4` or `S6`
template exists or is needed under the locked viewer/editor boundary.

## Proposed decision log

| ID       | Entry                                                                                                         | Status                     |
| -------- | ------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `FPR-01` | Use the integrated specimen only as a final collision/regression harness for approved ordinary UI.            | `Proposed`                 |
| `FPR-02` | Adopt version-pinned, self-hosted Pretendard JP variable dynamic-subset delivery and official fallback order. | `Awaiting user approval`   |
| `FPR-03` | Promote the listed approved sources together as Foundation v0.1 without reopening source decisions.           | `Awaiting user approval`   |
| `FPR-04` | Adopt the listed reusable aliases, patterns, and four structural templates as the Block 5 package.            | `Awaiting user approval`   |
| `FPR-05` | Keep the entire viewer/editor and `S4`/`S6` outside regression, reusable UI, and downstream template work.    | `Locked approved boundary` |

## Block 5 completion gate

Block 5 becomes complete only after the user approves `FPR-02`–`FPR-04`. On approval,
this document and its Korean companion change to `Approved`, document `57` and the
README mark Block 5 complete, and Block 6 becomes the only remaining large block. No
percentage or new work-package count is introduced.
