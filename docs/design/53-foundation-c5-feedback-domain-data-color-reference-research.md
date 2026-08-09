# NosLog 2.0 C5 Feedback, Domain, and Data Color Reference Research

## Document control

- Status: `13A approved as FS-BN; 13B domain and 13C data-color gates pending`
- Canonical language: English
- Korean companion:
  [53-foundation-c5-feedback-domain-data-color-reference-research.ko.md](./53-foundation-c5-feedback-domain-data-color-reference-research.ko.md)
- Date: 2026-08-10
- Controlled visual comparison:
  [document 54](./54-foundation-c5-feedback-status-source-visual-comparison.md) and
  [interactive artifact](./specimens/c5-feedback-status-source-comparison.html)
- Scope: Package `13` research for universal feedback/status color,
  NOSTALGIA-domain color ownership, data-visualization color ownership, and the
  collision contract between them
- Inputs: approved documents `24`, `26`, `32`, and `34`–`52`; current NosLog
  token and component evidence; seventeen independent official accessibility,
  design-system, production-service, and domain sources
- Excludes: approval of exact domain or data values; component anatomy beyond the
  approved `FS-BN` role boundary; iconography and motion; production implementation;
  final high-fidelity pages

This document starts the fixed work package `13` without reopening any completed
package. It records the research basis and the approved `13A` result. A source or
value is not approved merely because it appears below; only the explicit `FS-BN`
approval record is authoritative for universal feedback/status color.

## Locked upstream authority

The following decisions remain fixed:

1. Adobe Spectrum S2 is the exclusive Dark/Light neutral primitive source.
2. Ordinary containers, links, filters, selections, and domain labels are neutral
   by default.
3. `SS-08` Radix Colors Indigo owns identity, not generic feedback, domain, or data.
4. Rare filled primary actions use the approved achromatic `RPA-A` mapping.
5. Focus remains independently owned by the approved Fluent-derived focus mapping.
6. Feedback, domain, and data colors have separate semantic ownership and require
   visible non-color cues wherever meanings can collide.
7. Published source values must be adopted intact for the role family they own.
   Tailwind colors, interpolated steps, and unsourced hybrids are not authority.
8. The over-accented `FCM-11` and `SIG-07` examples remain `Rejected` and cannot be
   used as evidence or targets.

## Why this package has three approval gates

One palette cannot safely own every chromatic role in NosLog:

| Gate  | Owner                     | Meanings covered                                                        | Why it must remain separate                                                                                            |
| ----- | ------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `13A` | Universal feedback/status | information, success, warning, danger/error, destructive consequence    | These meanings must remain consistent across every page and component.                                                 |
| `13B` | NOSTALGIA domain          | left/right hand, difficulty, mode, rank, achievement, score band, genre | These meanings come from the game and NosLog tasks, not generic UI conventions.                                        |
| `13C` | Comparison-local data     | categorical, sequential, diverging, threshold, selection, grid, axis    | A series hue identifies data only within a chart or comparison and must not inherit UI or domain meaning accidentally. |

Approval of one gate will not approve another. Package `13` becomes complete only
after all three gates are approved and their collision tests pass.

## Current NosLog migration audit

The current application is functional evidence, not NosLog 2.0 palette authority.
The audit found these roles and collisions:

| Current evidence                   | Current use                                               | Migration finding                                                                                                        |
| ---------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `--success`                        | successful sync, admin health, positive state             | A useful semantic role exists, but the current Tailwind-like green values are not approved provenance.                   |
| `--danger`                         | errors, destructive meaning, and `FAST` judgment          | Generic error and rhythm judgment share one hue, so the owner is ambiguous.                                              |
| `--score`                          | score emphasis and warning/attention in sync health       | Domain score and generic warning share one hue, so a status change can resemble a score highlight.                       |
| `--chart`                          | chart series, links, and `SLOW` judgment in some contexts | Data, interaction, and rhythm judgment are not reliably separated.                                                       |
| difficulty colors                  | Normal, Hard, Expert, Real badges and text                | The roles must remain available, but ordinary list/grid labels are not automatically eligible for visible color.         |
| Basic/Recital                      | mode labels and controls                                  | Mode is domain meaning; it cannot silently reuse success, warning, or identity ownership.                                |
| rank, achievement, score band      | status-like badges and metrics                            | These are domain outcomes, not universal success/warning states. Text, order, icon, or shape must carry the meaning too. |
| genre colors                       | category presentation                                     | Category color is optional and must prove a scanning benefit; neutral genre labels remain the default.                   |
| Canvas/WebGL and literal utilities | renderer and isolated component styling                   | Hard-coded values require later implementation mapping after the guide role is approved.                                 |

No existing literal or CSS variable is grandfathered into 2.0 by this audit.

## Research method and finalist eligibility

Sources were compared by equivalent role rather than by visually similar swatches.
A universal-feedback finalist must provide:

1. maintained official guidance or a maintained official token artifact;
2. a complete information, success/positive, warning/notice, and danger/negative set;
3. explicit Light and Dark behavior;
4. foreground/icon plus subtle surface treatment, or an exact component recipe that
   intentionally keeps body text neutral;
5. enough published mapping to adopt the set without inventing NosLog-only steps;
6. a viable contrast and non-color-cue contract on the already approved NosLog
   Spectrum surfaces.

A useful principle source may fail finalist eligibility and still inform the rules.
An archived or deprecated source cannot be the primary adoption authority.

## Seventeen-source comparison

|   # | Official source                                                                                                                                                                                                                                                                    | Transferable evidence                                                                                                                                                | NosLog applicability                                                                               | Limitation or gate result                                                                                                                                       |
| --: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   1 | [W3C WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), [Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html), and [Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) | Color cannot be the only visible carrier; dynamic status must be programmatically determinable; errors must be described in text.                                    | Governs all three gates and the eventual ARIA/live-region contract.                                | Does not choose values or art direction.                                                                                                                        |
|   2 | [Adobe Spectrum S2 tokens](https://opensource.adobe.com/spectrum-design-data/tokens/) and [semantic variants](https://opensource.adobe.com/spectrum-design-data/registry/variants/)                                                                                                | Publishes informative, positive, notice, and negative semantic families with Light/Dark visual and background aliases.                                               | Strong provenance continuity with the approved neutral source and a complete four-role vocabulary. | Published visual colors are not automatically normal-text colors; exact component contrast must be tested.                                                      |
|   3 | [Atlassian color foundations](https://atlassian.design/foundations/color/)                                                                                                                                                                                                         | Publishes distinct information, success, warning, and danger text, icon, border, and background tokens for Light/Dark themes.                                        | Complete role coverage and direct semantic aliasing make it a strong `13A` finalist.               | Its neutral and brand system cannot replace already approved NosLog ownership.                                                                                  |
|   4 | [Microsoft Fluent 2 color](https://fluent2.microsoft.design/color) and [Web alias tokens](https://fluent2.microsoft.design/color-tokens/)                                                                                                                                          | Semantic colors are reserved for feedback, status, or urgency and must be accompanied by other indicators; exact success, warning, and danger aliases vary by mode.  | Strong model for semantic restraint and separate text/background roles.                            | Fluent Web lacks an equally explicit four-family information set in the extracted status aliases, so adopting a full NosLog set would require an extra mapping. |
|   5 | [IBM Carbon notifications](https://carbondesignsystem.com/components/notification/style/)                                                                                                                                                                                          | Low-contrast notifications combine semantic icon/border with a subtle background; high-contrast variants use inverse neutral text/background plus a semantic marker. | Shows that readable status content need not make all body text chromatic.                          | Exact current theme values and the intended low/high recipe must be version-pinned before finalist comparison.                                                  |
|   6 | [SAP Fiori semantic colors](https://experience.sap.com/fiori-design-web/explore_category/look-feel-wording/)                                                                                                                                                                       | Separates neutral, positive, critical, negative, and information; status color is for meaning, not decoration, and is paired with text.                              | Particularly relevant to dense records and status-heavy information UI.                            | Its business value-state vocabulary does not directly define game-domain outcomes.                                                                              |
|   7 | [GitHub Primer color usage](https://primer.style/product/getting-started/foundations/color-usage/)                                                                                                                                                                                 | Foreground, muted background/border, and emphasis tokens are separated for success, attention, danger, and other semantic roles.                                     | Supports restrained, role-specific status treatments and neutral ordinary content.                 | `information` is expressed through accent rather than a symmetrical four-status family.                                                                         |
|   8 | [GitLab Pajamas UI color](https://design.gitlab.com/product-foundations/color/)                                                                                                                                                                                                    | UI and data-visualization palettes are separate; dark UI needs less color; semantic hues must be combined with other feedback.                                       | Direct evidence for the three-owner model and restrained Dark treatment.                           | It publishes ramps more directly than a single universal status-component recipe.                                                                               |
|   9 | [PatternFly tokens](https://www.patternfly.org/tokens/all-patternfly-tokens/) and [Alert guidance](https://www.patternfly.org/components/alert/design-guidelines/)                                                                                                                 | Separate text, icon, border, and general status aliases exist for success, warning, danger, information, and Dark mode.                                              | Complete semantic architecture and enterprise-density evidence.                                    | The very broad token set is heavier than NosLog's intended lean alias layer; exact adoption subset must not be improvised.                                      |
|  10 | [USWDS state color tokens](https://designsystem.digital.gov/design-tokens/color/state-tokens/)                                                                                                                                                                                     | Publishes role-based info, error, warning, success, emergency, and disabled families with multiple grades.                                                           | Strong government-service evidence for role naming and accessible alert use.                       | The default system is Light-first and does not provide a paired Dark status recipe suitable for intact adoption.                                                |
|  11 | [Wikimedia Codex colors](https://doc.wikimedia.org/codex/latest/design-tokens/color.html) and [accessibility](https://doc.wikimedia.org/codex/latest/style-guide/accessibility.html)                                                                                               | Semantic error, warning, success, and notice roles support Light/Dark modes; color is never the only carrier.                                                        | Relevant to a multilingual, dense information service.                                             | `notice` is neutral and the family is not symmetrical with NosLog's required colored information role.                                                          |
|  12 | [Material 3 ColorScheme](https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme)                                                                                                                                                                    | Uses semantic role pairs such as `error`, `onError`, `errorContainer`, and `onErrorContainer` across Light/Dark schemes.                                             | Strong evidence for content/container pairing and invariant role names.                            | Only error is a first-class status family; success, warning, and information would require custom roles.                                                        |
|  13 | [Ant Design color](https://ant.design/docs/spec/colors) and [theme tokens](https://ant.design/docs/react/customize-theme/)                                                                                                                                                         | Functional colors are meant for stable success, error, warning, and link meaning; UI color should remain restrained.                                                 | Useful production evidence for functional-color discipline and component alias breadth.            | Brand, interaction, and information can share blue; copying it would reopen already separated NosLog ownership.                                                 |
|  14 | [GOV.UK colour](https://design-system.service.gov.uk/styles/colour/)                                                                                                                                                                                                               | Functional error and success variables are used only in their designed contexts; focus, brand, and surface colors are distinct.                                      | Strong role-ownership discipline and content-first service precedent.                              | Incomplete four-status set and no paired Dark theme.                                                                                                            |
|  15 | [NHS colour](https://service-manual.nhs.uk/design-system/styles/colour) and [notification banners](https://service-manual.nhs.uk/design-system/components/notification-banners)                                                                                                    | Context-specific error/success tokens are separate from palette colors used for data; banners name the status so color is redundant.                                 | Strong evidence against reusing generic status variables for chart/domain colors.                  | Incomplete four-status Dark/Light set and NHS brand context is not transferable.                                                                                |
|  16 | [Shopify Polaris tokens](https://github.com/Shopify/polaris-tokens)                                                                                                                                                                                                                | Historically provides semantic, component-oriented product color tokens.                                                                                             | Retained as provenance for the earlier comparison and the user's visual reference.                 | The repository labels itself `LEGACY`, is deprecated, and is not eligible as current primary adoption authority.                                                |
|  17 | [Official NOSTALGIA product guide](https://www.konami.com/arcadegames/products/am_nostalgia/)                                                                                                                                                                                      | Blue notes guide the left hand and red notes guide the right hand.                                                                                                   | Direct domain authority for preserving explicit left/right roles under `13B`.                      | Marketing/game guidance does not define accessible web values, other domain roles, or UI status colors.                                                         |

The set includes broad system coverage without counting multiple pages from one
system as separate independent references.

## Cross-source convergence

The research has stabilized around six patterns:

1. Universal feedback is a semantic role family, not a decorative palette.
2. Text/icon, subtle background, border, and solid/on-solid roles are distinct.
3. Light and Dark values must be deliberately mapped; inversion or one shared hex
   is not sufficient.
4. Semantic status always has a redundant visible cue and correct programmatic state.
5. Domain or industry color remains separate when its meaning differs from generic
   status.
6. Data visualization owns a separate palette selected by data type, not by whichever
   UI colors are still unused.

There is meaningful disagreement about whether ordinary status body text should be
chromatic. Spectrum emphasizes semantic visuals, Atlassian publishes semantic text,
and Carbon offers both subtle semantic and inverse-neutral notification recipes.
The controlled specimen must compare equivalent component recipes rather than only
four isolated swatches.

## Exact `13A` source extraction

The following values were extracted from current official published artifacts. The
tables remain source evidence; values become approved aliases only through the
explicit `FS-BN` mapping recorded below and in document `54`.

### `FS-A` — Adobe Spectrum S2 semantic visual plus subtle background

| Role        | Light visual             | Light subtle background  | Dark visual              | Dark subtle background   |
| ----------- | ------------------------ | ------------------------ | ------------------------ | ------------------------ |
| Information | `#4B75FF` (`blue-800`)   | `#E5F0FE` (`blue-200`)   | `#5681FF` (`blue-900`)   | `#0C2175` (`blue-300`)   |
| Positive    | `#079355` (`green-800`)  | `#D7F7E1` (`green-200`)  | `#099D59` (`green-900`)  | `#003326` (`green-300`)  |
| Notice      | `#D45B00` (`orange-800`) | `#FFECCF` (`orange-200`) | `#E06400` (`orange-900`) | `#501B00` (`orange-300`) |
| Negative    | `#F03823` (`red-800`)    | `#FFEBE8` (`red-200`)    | `#FC432E` (`red-900`)    | `#571107` (`red-300`)    |

Required test: determine which values are visual/icon roles and whether message text
must remain approved neutral foreground on each Spectrum surface.

### `FS-B` — Atlassian semantic text, icon, and background

| Role        | Light text / icon / background    | Dark text / icon / background     |
| ----------- | --------------------------------- | --------------------------------- |
| Information | `#1558BC` / `#357DE8` / `#E9F2FE` | `#8FB8F6` / `#4688EC` / `#1C2B42` |
| Success     | `#4C6B1F` / `#6A9A23` / `#EFFFD6` | `#B3DF72` / `#82B536` / `#28311B` |
| Warning     | `#9E4C00` / `#E06C00` / `#FFF5DB` | `#FBC828` / `#FBC828` / `#3A2C1F` |
| Danger      | `#AE2E24` / `#C9372C` / `#FFECEB` | `#FD9891` / `#F15B50` / `#42221F` |

Required test: verify these semantic colors on NosLog's approved Spectrum surfaces
without importing Atlassian neutrals, elevation, or brand colors.

### `FS-C` — IBM Carbon notification recipe

Carbon was version-pinned to `@carbon/themes@11.78.0`. White uses support/background
pairs info `#0043CE/#EDF5FF`, success `#24A148/#DEFBE6`, warning
`#F1C21B/#FCF4D6`, and error `#DA1E28/#FFF1F1`. Dark `g100` uses the shared neutral
notification background `#262626` with support info `#4589FF`, success `#42BE65`,
warning `#F1C21B`, and error `#FA4D56`. Document `54` records the exact extraction,
controlled specimen, and measured limitation of the Light warning pair.

### Comparison-only evidence — Microsoft Fluent Web

Fluent's extracted Light/Dark success, warning, and danger text/background aliases
are complete and published, but the equivalent Web status group lacks a symmetrical
information family. It remains valuable architecture evidence but is not currently
eligible as an intact four-role adoption candidate.

## Approved `13A` result

| Candidate                                                     | Final status            | Reason                                                                                                                                                                                                         |
| ------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FS-BN` Atlassian semantic color + neutral message typography | `Approved — 2026-08-10` | Preserves Atlassian's exact Light/Dark semantic backgrounds and markers, assigns dense message title/body copy to the approved Spectrum neutral owner, and retains Atlassian danger text for field validation. |
| `FS-A` Adobe Spectrum S2                                      | `Not selected`          | Stable contrast evidence is preserved, but the user preferred Atlassian's semantic color character.                                                                                                            |
| `FS-B` Atlassian                                              | `Superseded by FS-BN`   | Its exact chromatic roles remain the `FS-BN` source, but colored message titles were intentionally replaced by approved neutral message typography.                                                            |
| `FS-C` IBM Carbon                                             | `Not selected`          | Its neutral-typography restraint informed `FS-BN`, but no Carbon color value enters the approved mapping.                                                                                                      |

This role split is not an unsourced palette hybrid. Atlassian exclusively owns the
approved feedback chromatics, while the already approved Spectrum S2 source continues
to own neutral text. Document `54` records the exact values, measurements, component
boundary, and explicit user approval.

## Proposed `13B` domain ownership inventory

This inventory preserves required meanings while keeping visible color eligibility
unapproved:

| Domain family        | Required semantic roles            | Default presentation before approval                                             | Evidence still required                                                                               |
| -------------------- | ---------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Hand                 | `hand-left`, `hand-right`          | Explicit `L`/`R` or localized label plus position/shape; color may supplement it | Validate accessible values derived from official blue/red meaning without colliding with info/danger. |
| Difficulty           | `normal`, `hard`, `expert`, `real` | Text label and level remain primary; ordinary cards stay neutral                 | Compare official game evidence and real list/detail scanning tasks before allowing color.             |
| Mode                 | `basic`, `recital`                 | Text or icon-plus-text; neutral selector by default                              | Prove whether persistent color improves mode recognition.                                             |
| Rank and achievement | ordered rank/achievement states    | Name, symbol, and order carry meaning                                            | Separate achievement from universal success and verify artwork ownership.                             |
| Score band           | thresholds or grade outcomes       | Numeric score and named band carry meaning                                       | Define threshold truth and avoid warning/status collision.                                            |
| Genre                | category identity                  | Neutral label                                                                    | Demonstrate a measurable scan or comparison benefit before adding color.                              |

Existing 1.x values are migration evidence only. Exact `13B` candidates require their
own broad official/domain research and user approval after `13A` is resolved.

## Proposed `13C` data ownership model

Data color is local to a visualization or comparison and does not become a global
meaning merely because the same hex appears elsewhere.

| Data family      | Intended use                                       | Required non-color support                                                                      |
| ---------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Single-series    | one measure or trend                               | direct label, value, axis, or tooltip; selection has a separate state cue                       |
| Categorical      | unordered, independent series                      | direct labels or legend, stable order, marker/line-style option where needed                    |
| Sequential       | low-to-high magnitude                              | ordered legend, numeric labels, lightness progression, missing-data treatment                   |
| Diverging        | two directions around a meaningful midpoint        | explicit midpoint and direction labels; do not imply good/bad unless the data owns that meaning |
| Semantic data    | threshold states that truly mean good/critical/bad | status text or symbol and threshold definition; not generic red/green alone                     |
| Structural chart | grid, axis, reference, selection, hover            | approved neutral/interaction roles unless a separately defined data meaning applies             |

Carbon, GitLab Pajamas, SAP Fiori, and Atlassian are the leading `13C` principle
sources because they distinguish chart roles, data types, surfaces, and accessibility.
No exact data palette is shortlisted yet.

## Collision contract to validate

1. A hue name never determines ownership; the semantic token and context do.
2. Universal `danger` cannot represent `FAST`, a difficulty, rank loss, or a red data
   series unless danger is the actual meaning.
3. Universal `warning` cannot represent score emphasis or a generic yellow category.
4. Universal `information` and identity Indigo remain distinguishable by component
   anatomy, label, and context even when both are blue-family.
5. Left/right hand color always has a visible label, icon, position, or shape cue.
6. Rank, achievement, difficulty, and mode always retain their explicit names.
7. Data series use direct labels, legends, markers, patterns/line styles, boundaries,
   or spacing as appropriate; adjacent marks must remain perceivable.
8. Dynamic feedback uses the correct `role=status`, `role=alert`, `aria-live`, form
   description, or equivalent semantics based on urgency and interaction.
9. Forced-colors/high-contrast and representative color-vision-deficiency checks are
   mandatory before any gate is approved.

## Decision log

| ID       | Entry                                                                                                                                   | Status                                         |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `FDD-01` | Treat current Tailwind-like literals and CSS variables as migration evidence, not 2.0 palette authority.                                | `Observed`                                     |
| `FDD-02` | Preserve the already approved separation of feedback, domain, and data ownership with non-color cues.                                   | `Approved upstream`                            |
| `FDD-03` | Resolve package `13` through separate `13A`, `13B`, and `13C` approval gates.                                                           | `Proposed`                                     |
| `FDD-04` | Advance `FS-A` Spectrum S2 and `FS-B` Atlassian to a controlled feedback specimen; admit `FS-C` Carbon only after exact extraction.     | `Completed evidence`                           |
| `FDD-05` | Keep ordinary domain labels neutral until a representative NosLog task proves visible color improves comprehension.                     | `Proposed from approved restraint rule`        |
| `FDD-06` | Select data colors by data type and local comparison semantics, independently from UI status and domain colors.                         | `Proposed`                                     |
| `FDD-07` | Do not use Tailwind palette defaults, unused hues, generated ramps, or an unsourced hybrid for any of the three owners.                 | `Rejected approach under governing provenance` |
| `FDD-08` | Exclude the deprecated legacy Shopify Polaris token repository as the primary source for a new adoption decision.                       | `Observed limitation`                          |
| `FDD-09` | Approve `FS-BN`: exact Atlassian feedback chromatics with approved Spectrum neutral message typography and Atlassian danger field text. | `Approved — 2026-08-10`                        |

## Controlled review artifact

Document `54` and its interactive artifact now provide the controlled `13A` NosLog
feedback comparison using real content:

- sync success and partial-failure summaries;
- form validation error and field association;
- non-blocking information notice;
- warning that requires attention but is not an error;
- destructive confirmation consequence;
- compact inline status, page-level notice, and toast/live-region cases;
- Light and Dark appearances on the approved Spectrum surfaces;
- `320px`, `390px`, and desktop widths;
- color-disabled, forced-colors, and representative color-vision-deficiency views;
- measured text, icon, boundary, and adjacent-color contrast.

The artifact preserves `FS-A`, original `FS-B`, and version-pinned `FS-C` as comparison
evidence and records `FS-BN` as the approved `13A` result. Package `13` now proceeds to
the separate `13B` NOSTALGIA-domain color gate; `13C` remains pending after that gate.
