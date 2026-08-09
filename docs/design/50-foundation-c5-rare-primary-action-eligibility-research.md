# NosLog 2.0 C5 Rare Primary-Action Eligibility Research

## Document Control

- Status: `Research complete; RPA-A approved after document 51; RPA-B and RPA-C
rejected; Radix has no filled-action alias`
- Canonical language: English
- Korean companion:
  [50-foundation-c5-rare-primary-action-eligibility-research.ko.md](./50-foundation-c5-rare-primary-action-eligibility-research.ko.md)
- Date: 2026-08-10
- Scope: determine whether the approved `SS-08` Radix Colors Indigo source may
  receive a filled primary-action alias, and if so at what level of action hierarchy
- Inputs: approved page briefs `03`–`20`, documents `32`–`49`, current action styling
  as migration evidence, and the fourteen independent official references below
- Excludes: external-brand actions, destructive and feedback colors, final button
  geometry or radius, motion duration, final component implementation, and broad page
  design

Document `49` approved `ITA-C`, so the NosLog mark and wordmark remain achromatic.
That decision does not answer whether a proven task action may receive the approved
Radix source. This document opens the separate `IAV-07` / `FNC-07` gate without
recoloring identity, routine interaction, domain values, or content.

**Outcome update — 2026-08-10:** document `51` completed the approved comparison.
`RPA-B` and `RPA-C` fail exact Dark hover/pressed text contrast at `4.28:1`;
the user subsequently approved `RPA-A`; `RPA-B` and `RPA-C` are rejected, and Radix
has no action alias.

## Decision Boundary

This research answers one question:

> Should a filled primary action remain achromatic, use Radix Indigo only in a
> dedicated essential-action context, or use Radix for every legitimate page-level
> primary action?

It does not assume that every page needs a primary button. It also does not treat
navigation, persistent selection, a branded OAuth action, destructive confirmation,
or an editor toolbar command as equivalent merely because each may be visually
implemented with a `<button>` or button-like link.

## Fixed Provenance and Accessibility Constraints

1. Adobe Spectrum S2 remains the exclusive neutral primitive source.
2. Radix Colors Indigo remains the exclusive signature identity source, with exact
   Light/Dark solid mappings preserved intact if an action alias is later approved.
3. `ITA-C` remains fixed: no Indigo logo, Indigo logo field, or default white logo
   outline.
4. Fluent `FI-C` remains the focus indicator. A filled action does not recolor focus.
5. Ordinary links, search controls, filters, selection, pagination, editor tools,
   chart data, difficulty, mode, hand, score, and external-brand colors remain outside
   this gate.
6. A candidate-filled action must retain a visible text label, a minimum `44px` target,
   busy/duplicate-submission prevention, non-color state cues, and measured contrast
   in default, hover, pressed, focus-visible, disabled, and forced-colors states.
7. `FCM-11` and `SIG-07` remain `Rejected` and are not comparison targets.

## Current NosLog Action Inventory

The inventory below is observed from approved briefs and current code. It is not an
action-color approval.

| Action class                                             | Representative NosLog evidence                                                                                              | Frequency and context                                                                               | Eligibility implication                                                                                                 |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Search, filter, view, pagination, and selection controls | Home Music/Chart search, discovery filter commit, ranking mode and page controls, chart-viewer controls                     | Repeated inside content-rich pages                                                                  | Ordinary interaction; never receives Radix merely for being frequently used                                             |
| Navigation and external destination                      | Home destinations, Music detail links, Arcade `Directions`, Home/not-found links                                            | Often visually important but changes location rather than committing product state                  | Preserve link semantics and neutral hierarchy; not a generic filled-action alias                                        |
| External identity action                                 | `Continue with Discord`                                                                                                     | One dedicated authentication action                                                                 | Discord owns the external-brand treatment; Radix and Spectrum primary candidates do not recolor it                      |
| Routine form and administrative commit                   | Profile Settings Save, admin Save/Create/Edit, chart draft Save, bingo Save                                                 | Repeated across forms and operational tools                                                         | A universal Radix primary recipe would create broad accent propagation; neutral primary evidence is required            |
| Dedicated task transition or recovery                    | Onboarding completion, current Data Sync state action, recoverable/fatal `Try again`, planned-maintenance exit when offered | One action in a bounded, low-density state that exists to move the user forward                     | Strongest research-stage accent candidate; document `51` later rejected the accent mapping and approved neutral `RPA-A` |
| High-consequence workflow commit                         | Exam evidence submission, chart `Submit for review`, reviewer `Approve and publish`                                         | Infrequent but carries validation, permission, stale-base, or irreversible publication consequences | Must not use color alone; confirmation and semantic state remain mandatory; requires separate measured context          |
| Destructive action                                       | Account deletion, reject/delete admin actions, token invalidation                                                           | Sparse but negative consequence                                                                     | Owned by the later danger/feedback gate, never by Radix primary-action eligibility                                      |

Current implementation already uses achromatic inverse fills such as
`bg-text-primary text-bg` for Settings Save and administrator Save actions. This is
migration evidence, not proof of a final component alias. The document `47` specimen
used candidate color on Home `기록 동기화` and Rankings `내 위치 보기` only to measure
source coexistence; those placements were comparison scaffolding and are not approved
rare actions.

## Authoritative Reference Matrix

|   # | Official source                                                                                                                                                                                                                                            | Equivalent primary-action rule and appearance                                                                                                                                                                  | Transferable NosLog principle                                                                                           | Limitation                                                                                                                                               |
| --: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   1 | [Adobe Spectrum Button](https://spectrum.adobe.com/page/button/) and [Button Group](https://spectrum.adobe.com/page/button-group/)                                                                                                                         | Separates strong `accent` from medium-emphasis neutral `primary`. Accent is reserved for essential actions; primary fill uses `gray-800`; related secondary actions remain outline.                            | Provides a sourced two-tier model compatible with Spectrum neutrals and a separately approved signature source.         | Spectrum permits up to three accent buttons per view, which is too broad to copy into NosLog without a stricter measured budget.                         |
|   2 | [Radix Themes color](https://www.radix-ui.com/themes/docs/theme/color), [Button](https://www.radix-ui.com/themes/docs/components/button), and [Radix Colors scale usage](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) | Theme accent is applied to primary buttons and links; solid components use step `9`, hover step `10`, and contrast foreground.                                                                                 | Confirms that exact Radix `9/10` values are valid solid-component inputs.                                               | Radix Themes' broad accent propagation conflicts with approved neutral links, selection, and focus; its default theme model cannot be adopted wholesale. |
|   3 | [Microsoft Fluent 2 Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)                                                                                                                                                       | Only one primary button per layout. If more than two actions have equal priority, all use neutral backgrounds; many minor actions use outline, subtle, or transparent treatments.                              | A primary is a hierarchy decision, not a color entitlement; ambiguity should lower emphasis rather than multiply color. | Fluent role guidance does not authorize Fluent color values in NosLog.                                                                                   |
|   4 | [Atlassian Button](https://atlassian.design/guidelines/product/components/buttons)                                                                                                                                                                         | Primary appears once per area for the most important CTA; not every screen needs one. Default is used for most other actions.                                                                                  | Supports one bounded high-emphasis action and neutral ordinary actions.                                                 | Atlassian brand tokens and discovery/Rovo appearances are product-specific.                                                                              |
|   5 | [IBM Carbon Button](https://carbondesignsystem.com/components/button/usage/)                                                                                                                                                                               | One primary per page, with temporary nested-flow exceptions; explicitly states that not every page needs a primary button.                                                                                     | Dense records, tables, and reading pages should not gain a filled action just to fill hierarchy.                        | Carbon's secondary-button pairing rules are stricter than every NosLog workflow requires.                                                                |
|   6 | [GitHub Primer Button](https://primer.style/product/components/button/)                                                                                                                                                                                    | Primary is highest priority, used sparingly, never more than one in a button group and rarely more than one per page.                                                                                          | Supports restrained commit emphasis in dense technical interfaces.                                                      | GitHub's green primary surface is not a NosLog color source.                                                                                             |
|   7 | [Shopify Button](https://shopify.dev/docs/api/app-home/web-components/actions/button)                                                                                                                                                                      | Primary is a high-emphasis page action used sparingly; examples are Save, Create, and Apply. Loading prevents duplicate submission and preserves hierarchy.                                                    | Relevant to Settings and administrative commits, including explicit loading behavior.                                   | Merchant administration has more transactional Save/Create actions than public NosLog browsing.                                                          |
|   8 | [GOV.UK Button](https://design-system.service.gov.uk/components/button/)                                                                                                                                                                                   | Default button advances a service task; start button is reserved for the main service-entry CTA; destructive warning is separate and sparse.                                                                   | Distinguishes task progression, service entry, and destruction instead of styling every navigation link as a button.    | GOV.UK has no Dark theme and its green value is not portable.                                                                                            |
|   9 | [NHS Buttons](https://service-manual.nhs.uk/design-system/components/buttons)                                                                                                                                                                              | Use one primary per page for the main CTA, avoid multiple buttons, expand on mobile, and use reverse treatment only on verified dark backgrounds.                                                              | Strong evidence for one clear compact/mobile action and explicit background contrast checks.                            | NHS brand and healthcare transaction patterns are not NosLog visual authority.                                                                           |
|  10 | [Canada.ca Buttons](https://design.canada.ca/common-design-patterns/buttons.html)                                                                                                                                                                          | One primary for likely page actions; `supertask` is only for an evidence-backed top task; ordinary page links should remain links.                                                                             | A rare strong action needs verified top-task evidence, not promotional importance.                                      | The guide is Light-first and its supertask style is government-specific.                                                                                 |
|  11 | [U.S. Web Design System Button](https://designsystem.digital.gov/components/button/)                                                                                                                                                                       | Buttons draw attention to important actions; less important actions may be links; avoid too many buttons and distinguish the most likely next step.                                                            | Supports importance-based eligibility and a neutral downgrade path.                                                     | USWDS offers several accent variants rather than one strict Light/Dark product mapping.                                                                  |
|  12 | [SAP Fiori Action Placement](https://experience.sap.com/fiori-design-web/action-placement/) and [Action/Button guidance](https://experience.sap.com/fiori-design-web/explore_group/action/)                                                                | One emphasized primary per page; if a page primary already exists, content-toolbar actions remain ghost/transparent. Workflow, business, content, layout, and negative-path actions are classified separately. | Directly supports keeping editor/tool actions neutral when one workflow commit is emphasized.                           | Enterprise toolbar density and SAP semantic colors are not direct NosLog values.                                                                         |
|  13 | [Ant Design Button](https://ant.design/components/button/)                                                                                                                                                                                                 | At most one primary per section; multiple actions use one primary plus secondary actions, with overflow after several operations.                                                                              | Supports one-per-bounded-region rather than a global count detached from composition.                                   | Ant automatically derives a palette from `colorPrimary`, which would violate the no-interpolation rule.                                                  |
|  14 | [Android Material 3 Button](https://developer.android.com/develop/ui/compose/quick-guides/content/create-button)                                                                                                                                           | Filled buttons carry high emphasis for primary actions; outlined and text buttons carry secondary and low emphasis.                                                                                            | Confirms the general high-emphasis meaning of a solid fill.                                                             | Mobile application guidance and generated Material color schemes are not NosLog web color authority.                                                     |

The matrix contains fourteen independent maintained or governmental sources. Radix
and Spectrum are included for exact source behavior; the other twelve are role and
frequency evidence only.

## Convergence, Disagreement, and NosLog Fit

### Strong convergence

1. A primary treatment represents the most important next action in a bounded page,
   area, or temporary flow; it is not the default button style.
2. One is the common maximum. Multiple equal actions should be reduced to neutral or
   secondary treatment rather than all becoming primary.
3. Not every page needs a filled primary action. Reading, comparison, filtering,
   navigation, and dense tool pages commonly remain neutral.
4. Destructive actions require their own semantic treatment and confirmation.
5. Loading/busy behavior must prevent duplicate submission without erasing the action's
   accessible meaning.
6. A button label, placement, and state semantics remain necessary; color cannot be
   the only cue.

### Material disagreement

- Radix Themes, Material, Atlassian, Carbon, Primer, Shopify, public-service systems,
  SAP, and Ant commonly use a chromatic or brand-associated high-emphasis surface.
- Spectrum uniquely distinguishes an essential colored `accent` action from a neutral
  `primary` action in the same component family.
- Fluent explicitly recommends neutral backgrounds when several actions have equal
  priority.

NosLog's approved `ITA-C`, neutral ordinary-interaction rule, dense record/editor
contexts, and strong jacket/domain colors make Spectrum's two-tier distinction more
applicable than Radix Themes' automatic accent propagation. That does not by itself
prove that NosLog needs the colored tier.

## Exact NosLog Candidate Inputs

At the research stage, no value below was approved as an action alias. Document `51`
later approved the Spectrum neutral row through `RPA-A`; the Radix row remains rejected
for action use. Values remain fixed and may not be adjusted to look more NosLog-like.

| Input                              | Light default / hover / pressed                                                         | Light foreground                  | Dark default / hover / pressed                                                          | Dark foreground                   | Provenance                                                                                                                               |
| ---------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Spectrum neutral-primary candidate | `#292929 / #131313 / #131313`                                                           | `#FFFFFF`                         | `#DBDBDB / #F2F2F2 / #F2F2F2`                                                           | `#111111`                         | Spectrum primary uses `gray-800`; approved `F-A` interactive strengthening uses `gray-900`; exact S2 values from documents `34` and `37` |
| Radix Indigo solid candidate       | `#3E63DD / #3358D4 / #3358D4`                                                           | `#FFFFFF`                         | `#3E63DD / #5472E4 / #5472E4`                                                           | `#FFFFFF`                         | Approved intact `SS-08` source in document `47`; Radix solid step `9/10` usage                                                           |
| No-filled control                  | Transparent with approved neutral content and measured `NB-A` boundary only when needed | Approved adaptive neutral content | Transparent with approved neutral content and measured `NB-A` boundary only when needed | Approved adaptive neutral content | Approved `F-A`, `NB-A`, and `NI-A`; no new palette value                                                                                 |

The Spectrum row was a comparison candidate based on the published component-to-scale
relationship and approved S2 values. Document `51` verified and approved its semantic
mapping through `RPA-A`; final production token naming remains later work. The specimen
verified contrast and source fidelity without altering label or state values.

## Candidate Policy Bundles

| ID      | Policy                                                                                                                                                                                                                     | Filled-action ownership                                                                                                                                    | Strength                                                                                   | Risk                                                                                                                                                            | Gate status                                                       |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `RPA-A` | **Achromatic primary.** Use the Spectrum neutral-primary candidate for one proven task action; keep Radix without an action alias.                                                                                         | Spectrum neutral only                                                                                                                                      | Strong hierarchy without introducing chromatic action ownership; aligns with `ITA-C`       | May feel insufficient in a dedicated recovery or first-run state if placement and scale do not provide enough prominence                                        | `Approved in document 51 — 2026-08-10`                            |
| `RPA-B` | **Dedicated essential-action exception.** Use Spectrum neutral-primary for ordinary page/form commits and exact Radix fill only when the entire low-density view exists to move the user through one essential transition. | Radix only in dedicated onboarding, sync-state, or recovery-style contexts; never routine Save, toolbar, navigation, external brand, or destructive action | Preserves a very small color budget and follows Spectrum's accent-versus-primary hierarchy | Eligibility wording may become subjective; mixed role ownership must be proven across real contexts and documented as an explicit whitelist                     | `Rejected in document 51; measured 4.28:1`                        |
| `RPA-C` | **Every legitimate page primary.** Use exact Radix fill for the one highest-priority action in every page or temporary flow that has a true primary.                                                                       | Radix page-primary alias                                                                                                                                   | Simple component rule and strong next-step recognition                                     | Would propagate Indigo across Settings, admin, editor, recovery, and contribution workflows; risks turning signature color into routine UI chrome               | `Rejected in document 51; measured 4.28:1 and spread`             |
| `RPA-D` | **No filled primary.** Use neutral outline/text/placement for every non-destructive internal action.                                                                                                                       | No solid fill                                                                                                                                              | Maximum restraint and no chromatic propagation                                             | Forms, onboarding, sync, and recovery may lack a sufficiently clear next action; diverges from the broad reference convergence on one high-emphasis task action | `Control; advance only if user wants to test zero-fill hierarchy` |

## Proposed Visual-Comparison Gate — Completed in Document `51`

The next specimen should compare `RPA-A`, `RPA-B`, and `RPA-C` with identical action
geometry, labels, layout, neutral surfaces, focus, and state behavior. `RPA-D` can be
added only if the user explicitly wants a zero-fill control; otherwise it adds a fourth
policy without resolving the main color-eligibility question.

Use these representative fragments:

1. **Routine Settings Save:** content-dense form with secondary navigation and success/
   failure messaging.
2. **Dedicated Data Sync state:** exactly one current-state action such as install,
   open NOSTALGIA, reinstall, or retry.
3. **Recoverable system error:** one `Try again` action plus a secondary Home link.
4. **Dense editor/contribution footer:** routine Save plus a rarer `Submit for review`
   transition, with validation and permission state.

Exclude Discord Login because external-brand ownership would obscure the comparison.
Exclude destructive confirmation because danger color and confirmation semantics are a
different gate.

Required measurements:

- exact Light/Dark default, hover, pressed, focus-visible, loading, disabled, and
  forced-colors behavior;
- one and only one high-emphasis action per bounded fragment;
- `320 CSS px`, `390px`, intermediate, and desktop reflow with Korean, Japanese, and
  English labels;
- no action below a `44px` target and no label truncation that hides the outcome;
- no color-only distinction between ordinary and essential actions;
- contrast against every approved surface and alongside representative jacket/domain
  colors;
- no Indigo on Home navigation, search, filters, selection, routine editor tools, or
  the `ITA-C` identity.

## Research Outcome and Recommendation

The evidence supports a measured comparison of `RPA-A`, `RPA-B`, and `RPA-C` rather
than immediately assigning Radix to `primary-action`. The most relevant question is
whether the dedicated essential-action exception in `RPA-B` creates useful hierarchy
over the achromatic `RPA-A` without becoming a subjective or spreading whitelist.

Do not approve `RPA-C` merely because most references offer a brand-colored primary
button. NosLog has already approved a stricter neutral ordinary-interaction budget and
an achromatic identity. Conversely, do not assume `RPA-A` is sufficient until a real
sync, recovery, and editor comparison shows that the next action remains unmistakable.

This was the recommendation for the next comparison scope. Document `51` completed
that work, and the user approved `RPA-A`. Production implementation remains a later
gate.

## Decision Log

| ID       | Item                                                                                                    | Status                                   |
| -------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `RPA-01` | Inventory actual NosLog action classes before defining a color alias.                                   | `Observed — 2026-08-10`                  |
| `RPA-02` | Compare fourteen independent official systems by equivalent primary-action role and frequency.          | `Research complete — 2026-08-10`         |
| `RPA-03` | Keep Discord, destructive actions, routine interaction, navigation, and identity outside this gate.     | `Required`                               |
| `RPA-04` | Preserve exact Spectrum neutral and Radix Indigo inputs without interpolation or Tailwind substitution. | `Required`                               |
| `RPA-05` | Compare `RPA-A`, `RPA-B`, and `RPA-C` in four actual NosLog action contexts.                            | `Completed in document 51 — 2026-08-10`  |
| `RPA-06` | Add `RPA-D` zero-fill control.                                                                          | `Not advanced; RPA-A approved`           |
| `RPA-07` | Approve any Radix filled primary-action alias.                                                          | `Not approved; RPA-B/C measured failure` |
| `RPA-08` | Approve `RPA-A` as the achromatic filled primary-action policy.                                         | `Approved — 2026-08-10`                  |

## Sources

- [C5 finalist actual-content comparison](./47-foundation-c5-finalist-noslog-context-comparison.md)
- [C5 identity alias visual comparison](./49-foundation-c5-identity-touchpoint-alias-visual-comparison.md)
- [Rare primary-action policy visual comparison](./51-foundation-c5-rare-primary-action-policy-visual-comparison.md)
- [Foundation semantic role map](./25-foundation-semantic-role-map.md)
- [Spectrum semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.md)
- [Spectrum foreground validation](./37-foundation-c5-foreground-specimen-validation.md)
- [Spectrum Button](https://spectrum.adobe.com/page/button/)
- [Radix Themes Color](https://www.radix-ui.com/themes/docs/theme/color)
- [Microsoft Fluent 2 Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)
- [Atlassian Button](https://atlassian.design/guidelines/product/components/buttons)
- [IBM Carbon Button](https://carbondesignsystem.com/components/button/usage/)
- [GitHub Primer Button](https://primer.style/product/components/button/)
- [Shopify Button](https://shopify.dev/docs/api/app-home/web-components/actions/button)
- [GOV.UK Button](https://design-system.service.gov.uk/components/button/)
- [NHS Buttons](https://service-manual.nhs.uk/design-system/components/buttons)
- [Canada.ca Buttons](https://design.canada.ca/common-design-patterns/buttons.html)
- [USWDS Button](https://designsystem.digital.gov/components/button/)
- [SAP Fiori Action Placement](https://experience.sap.com/fiori-design-web/action-placement/)
- [Ant Design Button](https://ant.design/components/button/)
- [Android Material 3 Button](https://developer.android.com/develop/ui/compose/quick-guides/content/create-button)
