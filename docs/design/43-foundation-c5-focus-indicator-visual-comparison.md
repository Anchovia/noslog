# NosLog 2.0 C5 Focus-Indicator Visual Comparison

[한국어 companion](43-foundation-c5-focus-indicator-visual-comparison.ko.md)

## Document Control

| Field               | Value                                                                  |
| ------------------- | ---------------------------------------------------------------------- |
| Status              | `Technically verified — FI-C selected for validation; focus gate open` |
| Date                | `2026-08-09`                                                           |
| Canonical language  | English                                                                |
| Decision gate       | `C5F-04` same-condition comparison before source selection             |
| Inherited approvals | `M-A` surfaces, `F-A` foregrounds, `NB-A` boundaries, `NI-A` states    |

This document records the visual comparison required by
[document 42](42-foundation-c5-focus-indicator-reference-comparison.md). The user
selected Fluent 2 `FI-C` for dedicated measured validation on 2026-08-09. It does not
approve a production token, component alias, signature color, feedback color, final
component geometry, or application implementation.

## Artifact

The editable comparison is the
[C5 focus-indicator comparison specimen](specimens/c5-focus-indicator-comparison.html).
It is a guide research fixture, not a production component library or a final Claude
Design screen.

The artifact has three scenes:

| Scene                   | Evidence                                                                                                 | Decision use                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `10-source lineup`      | Ten maintained references in the same card structure, with Light and Dark evidence shown separately      | Shows the actual breadth of research and exposes missing static evidence instead of filling it in |
| `Complete-pair context` | Spectrum S2, Fluent 2, and Carbon treatments on the same action, selected row, and field                 | Compares the three references that publish usable Light/Dark color direction                      |
| `Selection limits`      | Eligibility, missing-source, accent-coupling, browser-instability, and downstream-validation constraints | Prevents a visual preference from being mistaken for an approved implementation contract          |

Scene, appearance, review width, and text-scale controls are specimen presentation
controls only. They do not propose new NosLog product controls.

## Ten-Reference Lineup

| #   | Reference          | Visual evidence rendered                                                                | Coverage classification                        | Selection consequence                                                                                      |
| --- | ------------------ | --------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 01  | Adobe Spectrum S2  | Light `#4b75ff`, Dark `#4069fd`, `2px` indicator, `2px` gap                             | Complete Light/Dark semantic pair and geometry | Can proceed directly to user selection and, if selected, measured validation                               |
| 02  | Microsoft Fluent 2 | Light black, Dark white, common `2px` focus helper                                      | Complete color polarity; recipe varies         | A selection must retain Fluent component-owned multi-stroke behavior rather than inventing one global ring |
| 03  | IBM Carbon         | Light `#0f62fe`, Dark white, common `2px` focus border                                  | Common dual-mode pair; component exceptions    | A selection imports Carbon focus and inset governance, not only its blue value                             |
| 04  | Atlassian          | Light fallback `#388bff`, `2px` ring, `2px` gap                                         | Light exact; stable static Dark value missing  | Requires targeted official theme-artifact research before it can be selected intact                        |
| 05  | GitHub Primer      | Light `#0969da`, `2px` outline, `-2px` offset                                           | Light exact; standard Dark value missing       | Requires targeted official theme-artifact research before it can be selected intact                        |
| 06  | GOV.UK             | Yellow `#ffdd00`, black `#0b0c0c`, `3px` width shown as exact color and method evidence | Complete service-theme method; no normal Dark  | Cannot be treated as an intact dual-mode product mapping                                                   |
| 07  | USWDS              | Default `#2491ff`, `4px`, zero offset                                                   | One static default; no fixed Dark pair         | Cannot be treated as an intact dual-mode product mapping                                                   |
| 08  | VA.gov             | On-light gold `#face00`; numerical geometry deliberately not rendered                   | Light color only; geometry and Dark incomplete | Requires missing geometry and Dark evidence before intact selection                                        |
| 09  | Radix Themes       | No swatch inferred; both modes are accent-derived                                       | Theme-dependent, no independent pair           | Conflicts with the approved independent `focus-outer` ownership                                            |
| 10  | Current Chrome UA  | Document `41` Dark observation `rgb(153, 200, 255)`, `1px`                              | One browser observation, not a stable mapping  | Remains fallback and forced-colors evidence, not a design-guide source                                     |

WCAG and WAI-ARIA APG remain the acceptance baseline from document `42`. They are not
repeated as palette candidates because they publish criteria, not a focus palette.
Material, SAP Fiori, PatternFly, and Salesforce remain valid governance evidence in
document `42`; their public evidence did not supply an additional intact static pair
to render without inference.

## Missing-Evidence Rule

The specimen deliberately displays an unrendered dashed field when a source does not
publish a stable static mode value or complete geometry in the evidence collected by
document `42`.

It does not:

1. reuse a Light value as an invented Dark value;
2. derive a missing value from Tailwind or the current application palette;
3. interpolate another system's gray, blue, yellow, or geometry;
4. combine one system's color with another system's gap, offset, inner band, or
   component exception; or
5. treat an accent-derived system as an independent focus source.

If the user prefers a partial reference such as Atlassian or Primer, the next step is
targeted upstream theme-artifact research. It is not silent completion of the missing
pair.

## Same-Condition Contract

The comparison holds these NosLog inputs constant:

- approved `M-A` Light and Dark surfaces;
- approved `F-A` readable content;
- approved `NB-A` neutral boundaries;
- approved neutral `NI-A` selected treatment in the shared row fixture;
- identical Korean, Japanese, and English mixed content; and
- square, measurement-only fixture geometry with no signature, feedback, gradient,
  glow, shadow, or Tailwind color.

The `Complete-pair context` scene uses each source's published common color direction
and common geometry as comparison evidence. It is not a claim that every upstream
system assigns one identical recipe to buttons, rows, and fields. Component-specific
exceptions remain source-owned and must be preserved or reopened if that direction is
selected.

## Browser Measurement Record — 2026-08-09

The in-app test browser exercised:

`2 appearances × 4 requested widths × 2 text scales × 3 scenes = 48 states`.

| Dimension       | Values                                          |
| --------------- | ----------------------------------------------- |
| Appearance      | Dark, Light                                     |
| Requested width | `320px`, `390px`, `768px`, `1120px`             |
| Text scale      | `100%`, `200%` specimen text-pressure control   |
| Scene           | Lineup, complete-pair context, selection limits |

| Assertion                                                       | Result               |
| --------------------------------------------------------------- | -------------------- |
| Specimen-frame horizontal overflow                              | `0 / 48` fails       |
| Document horizontal overflow                                    | `0 / 48` fails       |
| Visible content escaping the specimen inline boundary           | `0 / 48` fails       |
| Active-scene mismatch                                           | `0 / 48` fails       |
| Reference count differs from `10` or dual-mode context from `3` | `0 / 48` fails       |
| Minimum review-control target                                   | `44px`               |
| Exact observed specimen widths                                  | `320/390/768/1120px` |

The real browser viewport was then set to `320px`, `390px`, and `1280px` with the
corresponding `320px`, `390px`, and `1120px` review canvases.

| Browser viewport | Requested specimen | Observed frame | Document overflow | Frame overflow |
| ---------------: | -----------------: | -------------: | ----------------: | -------------: |
|          `320px` |            `320px` |        `320px` |              None |           None |
|          `390px` |            `390px` |        `390px` |              None |           None |
|         `1280px` |           `1120px` |       `1120px` |              None |           None |

This verifies the comparison harness and reflow only. It does not verify a selected
focus treatment against the full component, state-coexistence, clipping, zoom,
keyboard, or forced-colors matrix required by document `42`.

## Interpretation

1. Spectrum S2 is the only compared reference that supplies a complete independent
   Light/Dark semantic pair and exact global thickness plus gap while also matching
   the approved neutral provenance.
2. Fluent and Carbon make the previously questioned white normal-Dark focus visually
   explicit. The user selected Fluent because its Light-black/Dark-white polarity is
   achromatic and does not introduce another chromatic accent. The white Dark signal
   is allowed only for transient keyboard-visible focus, not persistent boundaries.
3. Atlassian and Primer remain visually relevant, but the missing static Dark evidence
   prevents intact source adoption at this gate.
4. GOV.UK, USWDS, and VA.gov demonstrate robust visibility-first alternatives. Their
   incomplete normal dual-mode product mappings prevent direct adoption without a new
   source decision.
5. Radix and Chrome remain useful contrast cases, not intact design-guide candidates.

These are research findings, not an autonomous selection.

## Decision Record

| ID       | Statement                                                                                                                                                    | Status                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| `C5V-01` | Compare ten maintained references in one visual artifact while keeping approved neutral inputs fixed.                                                        | `Completed`                     |
| `C5V-02` | Withhold missing Dark values and geometry rather than infer, interpolate, hybridize, or use Tailwind defaults.                                               | `Applied research rule`         |
| `C5V-03` | Treat Spectrum, Fluent, and Carbon as dual-mode visual directions; do not mislabel component-specific exceptions as a universal recipe.                      | `Observed`                      |
| `C5V-04` | Keep Atlassian, Primer, GOV.UK, USWDS, VA.gov, Radix, and Chrome visible with their exact eligibility limitations.                                           | `Observed`                      |
| `C5V-05` | Select one direction or request targeted missing-source research before any candidate proceeds to the dedicated measured validation required by document 42. | `Closed — FI-C selected`        |
| `C5V-06` | Take Fluent 2 achromatic polarity into measured validation without authorizing persistent white Dark boundaries or production tokens.                        | `Selected by user — 2026-08-09` |

## User Selection Gate

The user selected Fluent 2 `FI-C`.
[Document 44](44-foundation-c5-fluent-focus-specimen-validation.md) records the
dedicated validation now in progress. This authorizes validation and nothing further.
Production tokens, component aliases, signature color, feedback color, and application
implementation remain unapproved.
