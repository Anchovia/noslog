# NosLog 2.0 C5 Rare Primary-Action Policy Visual Comparison

## Document Control

- Status: `RPA-A achromatic primary approved; RPA-B and RPA-C rejected after measured
Dark hover/pressed text-contrast failure; Radix has no action alias`
- Canonical language: English
- Korean companion:
  [51-foundation-c5-rare-primary-action-policy-visual-comparison.ko.md](./51-foundation-c5-rare-primary-action-policy-visual-comparison.ko.md)
- Date: 2026-08-10
- Research input:
  [50-foundation-c5-rare-primary-action-eligibility-research.md](./50-foundation-c5-rare-primary-action-eligibility-research.md)
- Interactive specimen:
  [c5-rare-primary-action-policy-comparison.html](./specimens/c5-rare-primary-action-policy-comparison.html)
- Scope: compare `RPA-A`, `RPA-B`, and `RPA-C` with exact approved source values in
  four approved NosLog action contexts and measure responsive, state, focus, and text-
  contrast behavior
- Excludes: production component implementation, final button geometry, destructive
  actions, Discord branding, feedback colors, final page design, and a new action-
  color source

The user approved this comparison scope after document `50`, then approved `RPA-A` on
2026-08-10 after reviewing the measured result and recommendation. The specimen keeps
all three candidates as evidence; only `RPA-A` is a downstream policy.

## Fixed Comparison Contract

All three candidates use identical content, component geometry, placement, surfaces,
foreground hierarchy, focus treatment, and interaction-state controls. Only action
color ownership changes.

| Fixed role           | Exact mapping                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| Light neutral action | Default `#292929`; hover/pressed `#131313`; text `#FFFFFF`                                            |
| Dark neutral action  | Default `#DBDBDB`; hover/pressed `#F2F2F2`; text `#111111`                                            |
| Light Radix action   | Default `#3E63DD`; hover/pressed `#3358D4`; text `#FFFFFF`                                            |
| Dark Radix action    | Default `#3E63DD`; hover/pressed `#5472E4`; text `#FFFFFF`                                            |
| Focus                | Approved Fluent `FI-C`: Light black / Dark white `2px` zero-gap pseudo-boundary                       |
| Target and labels    | Minimum `44px`; persistent visible label; loading retains the label and exposes busy state            |
| Ordinary interaction | Neutral links, tools, navigation, fields, metadata, and identity remain outside the action-color gate |

No candidate value was shifted, interpolated, replaced with Tailwind, or adjusted to
improve a measured result.

## Compared NosLog Contexts

| Context                   | Approved product meaning                                                                              | Primary action shown    | Secondary hierarchy                       | Why it matters                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------- | ----------------------------------------- | -------------------------------------------------------------------------- |
| Routine Settings Save     | One dirty-state Profile category commit; success remains in context                                   | `변경사항 저장`         | `내 프로필 보기` text link                | Tests whether a routine form commit should consume signature color         |
| Dedicated Data Sync state | Returning user sees current status and exactly one next sync action                                   | `NOSTALGIA 페이지 열기` | Recent sync history text link             | Strongest low-density essential-transition candidate                       |
| Recoverable page error    | Preserve concise error meaning and offer explicit retry                                               | `다시 시도`             | Home text link                            | Tests a bounded recovery state with one unmistakable next action           |
| Dense editor contribution | Autosave and tools remain visible while the terminal user action submits an immutable review snapshot | `심사 제출`             | Neutral `Revision 저장` and toolbar tools | Tests whether a valid page primary spreads color into dense operational UI |

Discord Login was excluded because Discord owns its external-brand treatment.
Destructive actions were excluded because they belong to the later danger/feedback
gate.

## Policy Rendering

| Policy                      | Settings | Data Sync | Recovery | Editor submit | Final status                                 |
| --------------------------- | -------- | --------- | -------- | ------------- | -------------------------------------------- |
| `RPA-A` Achromatic primary  | Neutral  | Neutral   | Neutral  | Neutral       | `Approved — 2026-08-10`                      |
| `RPA-B` Essential exception | Neutral  | Radix     | Radix    | Neutral       | `Rejected after measured failure`            |
| `RPA-C` Page primary Indigo | Radix    | Radix     | Radix    | Radix         | `Rejected after measured failure and spread` |

## Measured Text Contrast

Ratios use WCAG relative luminance. Button labels in the specimen are ordinary text,
so the required ratio is `4.5:1` under WCAG 2.2 Success Criterion 1.4.3.

| Mapping                               |   Default | Hover / pressed | Result   |
| ------------------------------------- | --------: | --------------: | -------- |
| Light Spectrum neutral, white text    | `14.55:1` |       `18.58:1` | Pass     |
| Dark Spectrum neutral, `#111111` text | `13.64:1` |       `16.87:1` | Pass     |
| Light Radix Indigo, white text        |  `5.21:1` |        `6.02:1` | Pass     |
| Dark Radix Indigo, white text         |  `5.21:1` |    **`4.28:1`** | **Fail** |

The failure is exact: Dark hover/pressed `#5472E4` with `#FFFFFF` text measures
`4.28:1`, below `4.5:1`. The value may not be silently darkened, the foreground may
not be swapped per state, and the upstream state mapping may not be replaced with an
unsourced value. Increasing every action label to large-text size would distort the
component comparison and is not a legitimate fix for ordinary product buttons.

## Candidate Outcome

### `RPA-A` — Approved

- Every tested default, hover, and pressed text pairing passes.
- The same neutral action hierarchy remains legible in routine, dedicated, recovery,
  and dense contexts.
- It assigns no filled-action alias to Radix and therefore preserves the smallest
  approved chromatic budget.
- The user approved this as the NosLog filled primary-action policy on 2026-08-10.

### `RPA-B` — Rejected

- Its hierarchy remains bounded to Data Sync and Recovery as intended.
- Both Radix actions fail ordinary-text contrast in Dark hover/pressed.
- Because the failure occurs in a required interaction state, the policy cannot be
  approved with the exact mapping compared here.
- The user selected `RPA-A`; retain `RPA-B` as rejected evidence only.

### `RPA-C` — Rejected

- All four contexts receive Indigo, visibly propagating signature color into routine
  Settings and dense Editor UI.
- Every Radix action also fails Dark hover/pressed text contrast.
- Its simpler one-primary-per-page rule does not overcome the accessibility failure.
- The user selected `RPA-A`; retain `RPA-C` as rejected evidence only.

## Browser Verification

The interactive specimen was tested in the in-app browser at the local served URL.

| Check                 | Result                                                                                                                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop               | At `1280px` browser width, the `1265px` review shell renders three equal candidate columns with no horizontal overflow.                                                                         |
| Intermediate          | At a constrained `720px` review width, candidates stack and each candidate uses two equal context columns; no descendant crosses the shell boundary.                                            |
| Representative mobile | At `390px`, candidate and context content use one column; shell `scrollWidth` equals `clientWidth`; every measured action remains at least `44px`.                                              |
| Minimum compact       | At `320px`, the shell remains exactly `320px` with no out-of-bound descendant; all twelve primary labels remain fully contained and `44px` high.                                                |
| Policy mapping        | Computed Light and Dark colors match every exact value in the fixed contract; `RPA-B` colors only Sync/Recovery while `RPA-C` colors all four contexts.                                         |
| State controls        | Default, hover, pressed, focus, loading, and disabled controls update all twelve primary actions consistently. Loading exposes busy/duplicate-prevention semantics and keeps the visible label. |
| Focus                 | Dark focus preview measures a white `2px solid` pseudo-boundary; Light uses black through the same `FI-C` mapping.                                                                              |
| Failure disclosure    | Dark hover/pressed reveals an explicit `4.28:1` failure notice; it is hidden in unaffected state combinations.                                                                                  |

The specimen includes a forced-colors override, but this browser pass did not provide
dedicated forced-colors emulation. Runtime forced-colors rendering remains a later
acceptance check and is not claimed as verified here.

## Approved Policy

`RPA-A · Achromatic primary` is approved with these constraints:

1. A page, bounded region, or temporary flow may expose at most one proven non-
   destructive internal primary action. Not every view needs one.
2. Every qualifying filled primary uses the exact Spectrum neutral mapping in the
   fixed contract above.
3. Equal-priority actions are lowered to neutral secondary treatment rather than
   multiplying filled primaries.
4. Navigation, ordinary links, tools, filters, selection, and routine lower-priority
   actions do not receive the filled-primary alias.
5. External-brand and destructive actions remain owned by their separate gates.
6. Radix Indigo receives no filled-action alias. `RPA-B` and `RPA-C` remain rejected
   evidence and may be reopened only through a new user-approved research gate.

Final component token naming and production implementation remain later gates; the
policy and exact semantic mapping are now authoritative.

## Decision Log

| ID       | Item                                                                                         | Status                                   |
| -------- | -------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `RPV-01` | Compare `RPA-A`, `RPA-B`, and `RPA-C` in four approved NosLog contexts.                      | `Completed — 2026-08-10`                 |
| `RPV-02` | Preserve exact Spectrum and Radix Light/Dark default, hover, pressed, and foreground values. | `Completed — 2026-08-10`                 |
| `RPV-03` | Validate Desktop, `720px`, `390px`, and `320 CSS px` reflow and minimum targets.             | `Completed — 2026-08-10`                 |
| `RPV-04` | Validate default, hover, pressed, focus, loading, and disabled specimen states.              | `Completed — 2026-08-10`                 |
| `RPV-05` | Accept `RPA-B` with exact Radix Dark hover/pressed mapping.                                  | `Rejected — 2026-08-10; measured 4.28:1` |
| `RPV-06` | Accept `RPA-C` with exact Radix Dark hover/pressed mapping.                                  | `Rejected — 2026-08-10; measured 4.28:1` |
| `RPV-07` | Approve `RPA-A` as the NosLog filled primary-action policy.                                  | `Approved — 2026-08-10`                  |
| `RPV-08` | Approve any Radix filled primary-action alias.                                               | `Rejected; Radix has no action alias`    |
| `RPV-09` | Limit an approved filled primary to at most one proven action per bounded context.           | `Required by RPA-A`                      |

## Sources

- [Rare primary-action eligibility research](./50-foundation-c5-rare-primary-action-eligibility-research.md)
- [Settings and account page brief](./16-settings-account-page-brief.md)
- [Data Sync page brief](./13-data-sync-page-brief.md)
- [System recovery states page brief](./19-system-recovery-states-page-brief.md)
- [Chart editor and contribution page brief](./20-chart-editor-contribution-page-brief.md)
- [C5 finalist actual-content comparison](./47-foundation-c5-finalist-noslog-context-comparison.md)
- [Adobe Spectrum Button](https://spectrum.adobe.com/page/button/)
- [Radix Themes Button](https://www.radix-ui.com/themes/docs/components/button)
- [WCAG 2.2: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
