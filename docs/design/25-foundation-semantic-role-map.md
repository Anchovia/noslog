# NosLog 2.0 Foundation Semantic Role Map

## Document Control

- Status: `Approved semantic-role architecture, exact default composite mapping, and bounded page-title substitution — integrated validation remains open`
- Approval date: 2026-08-03
- Last decision update: 2026-08-04
- Canonical language: English
- Korean companion:
  [25-foundation-semantic-role-map.ko.md](./25-foundation-semantic-role-map.ko.md)
- Scope: the shared typography-role architecture, role usage, aliases, metric
  behavior, multilingual constraints, exception governance, current-code migration
  map, and Batch B entry criteria for NosLog 2.0 Foundation v0.1
- Inputs: approved documents `01`–`24`, current repository typography utilities,
  current-browser evidence recorded in document `24`, the reference comparison below,
  and explicit user approval on 2026-08-03
- Excluded: the exact content-driven wide-layout threshold, maximum line counts,
  wrapping and truncation policy, fallback and delivery details, color, spacing,
  grid, component dimensions, final Figma styles, production screens, and application
  implementation

This document approves what each shared typography role means, how it is governed,
the shared family, and the global lower bound. Batch B document `26` subsequently
approves the bounded `12/14/16/20/24/32px` ordinary physical ramp, gated `40px`
display step, `16/20/24px` lower and `28/32/40/48px` upper line-height primitive
axes, `400/500/600/700` shared weight vocabulary, natural/default tracking rule,
the exact role-to-composite mapping, and its precedence rules. A role name appearing
here is the authoring API: it resolves to the approved composite and must not be used
as permission to select arbitrary primitive values or reuse a current implementation
value.

## Related Documents

- [Foundation v0.1 research brief](./24-foundation-v0.1-research-brief.md)
- [Foundation typography and layout candidates](./26-foundation-typography-layout-candidates.md)
- [Cross-cutting reference matrix](./22-cross-cutting-reference-matrix.md)
- [Design-guide consistency audit](./21-design-guide-consistency-audit.md)
- [Shared discovery page brief](./04-shared-discovery-page-brief.md)
- [Music Detail page brief](./05-music-detail-page-brief.md)
- [Chart Viewer page brief](./07-chart-viewer-page-brief.md)
- [Global Rankings page brief](./08-global-rankings-page-brief.md)
- [Profile page brief](./09-profile-page-brief.md)
- [Shared shell and navigation brief](./15-shared-shell-navigation-brief.md)
- [Chart Editor and contribution page brief](./20-chart-editor-contribution-page-brief.md)

## Purpose

NosLog currently combines semantic utilities with numerous local size decisions. The
2.0 Foundation must prevent the same drift from returning while still supporting
music identity, multilingual titles, dense records, exact metrics, system controls,
the Viewer, and the future user-facing Editor.

The approved model therefore separates four concerns:

1. **primitives** hold future physical font values;
2. **composite styles** combine primitives into a limited set of tested physical
   treatments;
3. **semantic roles** describe why text exists and are the required authoring API; and
4. **component aliases** give domain or component names to existing semantic roles
   without creating new physical values.

The semantic roles, alias-governance model, Pretendard JP family selection, and global
`12px` shared user-facing floor are approved in this document. Batch B document `26`
later approves the restrained physical axes, exact default mapping of the twelve roles
to nine composites, and the single stepped `page-title` substitution. Integrated
specimen promotion, the exact wide-layout threshold, and the other excluded boundaries
remain later decisions.

## Research Convergence

The comparison included more than fifteen independent standards, maintained systems,
production products, and domain references. The sources disagree on exact sizes,
families, scales, and platform density. They converge on the following transferable
principles:

- name and apply text by purpose rather than by a raw numeric size;
- keep the physical scale restrained even when semantic roles are specific;
- use shared roles across pages and specialize only through governed aliases;
- reserve display treatment for rare high-impact moments;
- distinguish metric emphasis from headings and body copy;
- use small text sparingly and never as the ordinary control or reading default;
- preserve semantic heading structure independently from visual styling;
- test real content, language, width, zoom, and spacing instead of alphabet samples;
- use relative, scalable implementation values after visual validation; and
- allow Korean, Japanese, and English to reflow without creating separate information
  hierarchies for each locale.

NosLog adds domain constraints that general systems do not define: the original Music
title remains the primary identity, an enabled translated title or Japanese reading
appears above it at lower visual prominence, performance values need stable numeric
comparison, and BPM, time, measure, difficulty, hand, Grd, and Rating retain exact
NOSTALGIA meaning.

## Approved Architecture

### Approved family and global floor

- Pretendard JP is the shared font family for Korean, Japanese, and English NosLog 2.0
  user interfaces.
- Correct `lang` metadata, mixed-script behavior, font delivery, fallback metrics,
  loading, and layout stability remain mandatory Batch B validation. Validation may
  refine delivery and fallback implementation but does not reopen the family choice.
- No ordinary shared user-facing typography token may resolve below `12px` at the
  default root size. This is a global lower bound, not an assignment of `12px` to
  `metadata`, `entity-companion`, or any other role.
- The approved lower physical core is `12px`, `14px`, and `16px`. `12px` is restricted
  to eligible short tertiary support, `14px` is the compact product-UI step, and
  `16px` is the ordinary reading/body step. The exact role resolutions are recorded
  in Layer 2 and are not selected locally.
- The approved ordinary upper physical core is `20px`, `24px`, and `32px`; `40px` is
  a gated primitive assigned only to rare `display`; `metric-display` resolves to
  `32px`. `18px`, `28px`, and `36px` are not shared v0.1 primitives. A new shared size
  requires representative multilingual and responsive specimen evidence and explicit
  approval rather than local page-level use.
- The default upper pairings are `20/28`, `24/32`, `32/40`, and `40/48`. Exact role
  mappings and weight assignments are approved in Layer 2. `page-title` alone steps
  from proportional `24/32 · 700` in compact/default composition to proportional
  `32/40 · 700` in content-driven wide composition; every other role stays fixed.
  Natural/default tracking and retained kerning apply to every shared role unless a
  later explicit exception is approved.
- Space pressure must be solved through content priority, wrapping, reflow, spacing,
  progressive disclosure, or component composition before reducing type.
- Canvas or WebGL text has no automatic exception. A smaller rendered value requires
  the existing explicit exception process and an equivalent readable presentation of
  essential information.

### Layer 1 — Primitive values

Document `26` approves the `12/14/16/20/24/32px` ordinary physical ramp, gated `40px`
display step, `16/20/24px` lower and `28/32/40/48px` upper line-height axes,
`400/500/600/700` shared weight vocabulary, and natural/default tracking. Future
primitives may include approved OpenType features under the Pretendard JP family; all
other primitive names and values remain unresolved. Product authors and downstream
designers must not apply primitives directly to page content.

### Layer 2 — Composite physical styles

Document `26` approves nine complete physical composites for the twelve semantic
roles. Several roles intentionally share a treatment; semantic precision does not
require twelve font sizes or twelve independent styles.

| Semantic role      | Approved default composite | Numeric feature |
| ------------------ | -------------------------- | --------------- |
| `display`          | `40/48 · 700`              | Proportional    |
| `page-title`       | `24/32 · 700`              | Proportional    |
| `section-title`    | `20/28 · 600`              | Proportional    |
| `component-title`  | `16/24 · 600`              | Proportional    |
| `entity-title`     | `16/24 · 600`              | Proportional    |
| `entity-companion` | `14/20 · 400`              | Proportional    |
| `body`             | `16/24 · 400`              | Proportional    |
| `body-secondary`   | `14/20 · 400`              | Proportional    |
| `control`          | `14/20 · 500`              | Proportional    |
| `metadata`         | `12/16 · 400`              | Proportional    |
| `metric-display`   | `32/40 · 700`              | Tabular figures |
| `metric-value`     | `14/20 · 500`              | Tabular figures |

Natural/default tracking and retained kerning apply to every composite. These values
must be consumed through the semantic roles or approved aliases, not as page-local
size, leading, weight, or tracking choices. The only approved responsive variant is
the `page-title` step to proportional `32/40 · 700` in content-driven wide
composition. Its exact threshold and integrated specimen promotion remain later
gates.

### Approved responsive role behavior

- `page-title` uses `24/32 · 700` in mobile-first compact/default composition and
  `32/40 · 700` in the content-driven wide composition.
- The exact threshold is selected with spacing, grid, and container work in `FTL-08`;
  it is not a device-name rule or a copied framework breakpoint.
- The transition is stepped, not fluid. `clamp()` interpolation, intermediate values,
  locale-specific sizes, and page-local opt-in or opt-out are not approved.
- `display`, `metric-display`, `section-title`, and every lower role retain their
  approved composites across widths.
- Focused entity identities inherit the same `page-title` behavior while retaining
  their domain meaning and correct semantic heading structure.

### Layer 3 — Shared semantic roles

The following twelve roles are the approved shared role inventory.

| Role               | Meaning                                                                      | Typical NosLog use                                                                      | Required constraint                                                                        |
| ------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `display`          | Rare expressive text that creates one deliberate high-impact moment          | A bounded Home identity or exceptional editorial lead, if a later specimen justifies it | Never the default page heading, card title, metric, or empty-state treatment               |
| `page-title`       | Primary heading that identifies the current page or focused task             | Music, Rankings, Tier list, Profile, Viewer, Settings                                   | One clear page-level identity; visual style does not replace correct heading semantics     |
| `section-title`    | Heading for a major region within a page                                     | Recent plays, Community evaluation, Performance history                                 | Must express a real content boundary, not decorate an arbitrary card                       |
| `component-title`  | Heading inside a contained component or transient layer                      | Dialog, drawer, panel, grouped result module                                            | Must remain subordinate to the page and enclosing section                                  |
| `entity-title`     | Primary identity of a domain object                                          | Original Music title, username, arcade name, exam name                                  | Preserves the canonical object identity and supports real long content                     |
| `entity-companion` | Optional supporting identity paired with an entity title                     | Approved Korean/English Music title or Japanese reading                                 | May appear above the original title but remains visually subordinate and never replaces it |
| `body`             | Default readable content and ordinary system message                         | Descriptions, instructions, announcement body, empty/error message                      | Must remain comfortable for multi-line reading and text resizing                           |
| `body-secondary`   | Supporting explanation or secondary identity                                 | Artist, concise supporting description, contextual note                                 | Must not become the only location for task-critical meaning through low prominence         |
| `control`          | Visible text that names an action or available choice                        | Button, tab, filter, menu item, field label                                             | Must remain readable, localized, and aligned with its control and icon                     |
| `metadata`         | Compact secondary fact or short status descriptor                            | Date, category, level context, timestamp, badge text, chart axis or measure annotation  | Not a replacement for body copy or ordinary controls; small treatment remains exceptional  |
| `metric-display`   | One locally dominant quantitative result                                     | Best score, Official Grd, NosLog Rating, another approved summary metric                | Emphasizes a value without masquerading as a page heading or losing its label and unit     |
| `metric-value`     | Comparable quantitative value within a row, group, control, or visualization | Rank value, score row, BPM, time, measure, Play count, judgement value                  | Uses stable numeric alignment and retains explicit context, unit, and scope                |

### Layer 4 — Component aliases

Aliases improve mapping clarity but do not create independent styles. The following
initial aliases are approved:

| Alias or content                                        | Maps to                        | Notes                                                                              |
| ------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------- |
| Header wordmark                                         | Bounded brand-component alias  | It may have brand-specific treatment but does not create a general text-scale step |
| Artist                                                  | `body-secondary`               | Remains separated from the paired title group by composition, not a new type role  |
| Button, tab, filter, menu, and field label              | `control`                      | Visible action and available-choice labels use `14/20 · 500`                       |
| Entered or selected value inside a text-like field      | `body`                         | Readable content uses `16/24 · 400`; this does not create an input-value style     |
| Focused page entity identity                            | `page-title`                   | Retains entity semantics while its visible primary heading uses `24/32 · 700`      |
| Badge and short status                                  | `metadata` or `control`        | Interactive badges use `control`; descriptive badges use `metadata`                |
| Metric label and unit                                   | `metadata` or `body-secondary` | The value uses a metric role; its context remains readable and explicit            |
| Chart axis, tick, legend label, measure number          | `metadata`                     | Exact values remain available without relying on hover alone                       |
| Viewer time, BPM, time signature, measure value         | `metric-value`                 | Numeric treatment is shared even when renderer placement is specialized            |
| Empty, loading, error, permission, and recovery message | `body` or `body-secondary`     | State meaning comes from content and semantic state, not a unique font size        |
| Code, JSON, or technical identifier                     | Bounded technical alias        | Monospace may be evaluated only for genuinely technical text, not ordinary metrics |

## Role Application by Product Family

### Shared shell and Home

- NosLog wordmark uses the bounded brand alias.
- Each page destination and More-panel action uses `control`.
- A page or Home identity uses `page-title` unless a later validated specimen proves
  that one rare `display` moment is necessary.
- Announcement titles use an appropriate title role according to their actual
  container; dates use `metadata`; announcement bodies use `body`.
- Empty, maintenance, and recovery messages do not become display typography merely
  to attract attention.

### Music discovery and Music Detail

- Enabled translated title or Japanese reading: `entity-companion`.
- Original Music title: `entity-title`.
- Artist: `body-secondary`.
- Category, difficulty context, level, release data, and dates: `metadata`, except
  interactive selectors, which use `control`.
- Best score or another locally dominant result: `metric-display`.
- Score rows, judgement values, percentages, rank, combo, and Play count:
  `metric-value` with visible contextual labels.
- Existing page-brief rules for line count, wrapping, hover, mobile disclosure, and
  accessibility remain authoritative; this map does not reopen them.

### Rankings, Tier lists, and Profile

- Username, Tier target, and other canonical object names use `entity-title`.
- Country, exam, mode, difficulty, achievement, and status facts normally use
  `metadata` unless they are interactive controls.
- Official Grd, NosLog Rating, score, rank, distribution band, and Play count use the
  appropriate metric role.
- A metric value must remain paired with its label, mode, population, unit, or scope.
  Size alone must never carry the distinction between Official Grd and NosLog Rating.
- Dense rows may share one physical composite style across several semantic roles if
  spacing, position, weight, and labeling preserve the approved hierarchy.

### Chart Viewer and Chart Editor

- Focused Music identity retains the `entity-companion` → `entity-title` hierarchy.
- Transport, mode, metronome, strict-performance, tool, property, and submission
  labels use `control`.
- Time, BPM, time signature, measure number, lane value, offset, width, and numeric
  property values use `metric-value` or a `metadata` label paired with it.
- Canvas/WebGL geometry may require renderer-specific placement, but it does not
  authorize a separate page-wide scale.
- If Canvas or WebGL text cannot consume the shared token directly, its renderer alias
  must document the shared role it represents and be validated at the actual rendered
  size and display area.

## Multilingual Contract

Korean, Japanese, and English use the same twelve semantic roles and the same content
priority. Locale may affect font fallback, glyph metrics, line height, wrapping,
punctuation, and occupied space; it does not create a different semantic hierarchy.

Required behavior:

- mark text with the correct language where content language differs from the page;
- preserve the original Music title as `entity-title` in every locale;
- when enabled, place the localized title or Japanese reading above the original as
  `entity-companion`, while keeping it smaller or otherwise less prominent in the
  future validated composite system;
- test mixed Hangul, Kana, Kanji, Latin, numerals, punctuation, symbols, and long
  classical titles using real records;
- allow role containers to grow or recompose instead of clipping required content to
  preserve a fixed card height;
- avoid relying on italics or all-caps as the sole distinction for Korean/Japanese
  hierarchy;
- preserve semantic order and useful content under text resizing and spacing
  adjustment; and
- evaluate fallback metrics and slow font loading so a font swap does not break the
  approved hierarchy or controls.

## Metric and Numeral Contract

`metric-display` and `metric-value` are semantic metric roles, not permission to use a
decorative display face.

Approved behavior:

- use tabular figures where changing digit width would disrupt comparison or layout;
- retain the current domain value rather than abbreviating away meaningful precision;
- preserve separators, decimals, percentages, signs, units, rank symbols, time
  punctuation, BPM, and time signatures according to the approved content contract;
- align comparable values consistently within their local comparison region;
- keep the label, unit, denominator, mode, or scope visible or programmatically
  associated; and
- use ordinary language typography with numeric features for metrics by default.

Monospaced typography is not approved for ordinary score, rank, time, BPM, Grd,
Rating, Play count, or judgement values. It remains a bounded candidate only for real
code, JSON, exported technical data, or identifiers where fixed character width is
meaningful.

## Mandatory Use and Exception Governance

### Default rule

Every ordinary text element must use one of the approved semantic roles. Downstream
Figma work and production implementation must not introduce page-specific font sizes,
weights, line heights, tracking, or font families merely because a mockup appears to
need more emphasis or fit.

No ordinary shared user-facing text may be made smaller than `12px` to make a layout
fit. The role assignment and approved composition must be corrected instead.

The following are not valid reasons for an exception:

- a title is long;
- the viewport is narrow;
- a card has limited height;
- a designer wants more variety;
- an external reference uses another size;
- a one-off state feels insufficiently prominent; or
- an existing arbitrary value is convenient to preserve.

These cases must first be solved through the approved role, wrapping, reflow,
composition, spacing, progressive disclosure, or component layout.

### Alias versus exception

An **alias** gives a component-specific name to an existing semantic role and resolves
to the same approved composite style. It does not require a new visual value.

An **exception** changes one or more physical values outside the approved composite
styles. It is allowed only when all of the following are satisfied:

1. the exact product or renderer need is documented;
2. every existing role has been tested and shown to fail that need;
3. the exception is bounded to a named component or specialized contract;
4. Korean, Japanese, English, `320 CSS px`, representative mobile, desktop, zoom,
   contrast, and text-spacing impact are tested where applicable;
5. the fallback and implementation mapping are documented;
6. it does not introduce a parallel page hierarchy; and
7. the user explicitly approves the exception and its scope.

A repeated need across multiple unrelated components is evidence that the shared role
map may need revision; it must not be copied as repeated local exceptions.

### Approved precedence rules

- A Music title, username, arcade name, exam name, or other domain entity uses
  `entity-title` in an ordinary list or card. When that entity owns the focused page
  or task, its primary visible identity uses the `page-title` composite while retaining
  its canonical entity meaning. This is an alias precedence rule, not a new role.
- A visible action or available choice uses `control`. A user's entered value or the
  selected value shown inside a text-like field uses `body`. Component state, icon,
  border, and geometry may communicate interactivity but may not invent another text
  composite.
- Metric roles use tabular figures. A heading role that happens to contain a number
  remains proportional unless its semantic job is actually a comparable metric.
- Correct HTML heading order is independent from the visual composite selected.

### Initially recognized bounded candidates

The following areas may justify a bounded alias or later exception review, but no
physical exception is approved yet:

- the NosLog wordmark;
- actual code, JSON, or technical export text;
- Canvas/WebGL renderer labels whose rasterization or projection produces a verified
  legibility constraint; and
- a rare `display` moment validated in an integrated specimen.

## Current-Code Migration Map

Current utilities provide inventory evidence only. Their current values do not carry
forward automatically.

| Current utility or pattern                     | Foundation destination                                              | Migration rule                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `text-display`                                 | `display`                                                           | Re-evaluate every use; retain only rare approved moments           |
| `text-score-display`                           | `metric-display`                                                    | Replace score-specific naming with the shared metric role          |
| `text-title`                                   | `page-title`, `section-title`, `component-title`, or `entity-title` | Classify by meaning instead of retaining one ambiguous title style |
| `text-wordmark`                                | Header wordmark alias                                               | Keep bounded to the brand component                                |
| `text-section`                                 | `section-title` or `component-title`                                | Select according to actual document hierarchy                      |
| `text-body`                                    | `body`                                                              | Physical value must be revalidated                                 |
| `text-body-muted`                              | `body-secondary`                                                    | Muted color is not inherent to every supporting text use           |
| `text-label`                                   | `control`                                                           | Visible action or field labels use the approved control composite  |
| `text-input`                                   | `body`                                                              | Entered or selected values use the approved body composite         |
| `text-caption`                                 | `metadata`                                                          | Confirm that content is genuinely secondary and compact            |
| `text-badge`                                   | `metadata` or `control`                                             | Choose by descriptive versus interactive behavior                  |
| `text-micro` and direct `10px` values          | No default successor                                                | Audit and remove; any retained case requires the exception process |
| Local `text-xs`, `text-sm`, or arbitrary sizes | Classify into a semantic role                                       | Do not translate raw current sizes into future semantic tokens     |

## Accessibility and Responsive Requirements

- Semantic heading order and accessible names must remain correct regardless of the
  visual role selected.
- Text must support browser zoom and at least `200%` text resizing without loss of
  required content or operation.
- At the `320 CSS px` reflow target, ordinary text must not require document-level
  two-dimensional scrolling; specialized two-dimensional Viewer or Editor content
  follows its approved bounded contract.
- User text-spacing adjustments must not overlap, clip, or hide text.
- Small metadata must meet the applicable text contrast requirement in every approved
  appearance; disabled-state exceptions cannot be reused for active supporting text.
- Weight, color, and size may work together, but no required distinction may depend on
  color or font size alone.
- Long labels, titles, names, and translated content should wrap or cause intentional
  layout recomposition before truncation removes the only useful version.
- Touch target geometry is governed by component foundations; reducing type does not
  authorize a smaller target.

## Batch B Entry and Validation

The role architecture is ready for physical candidate work. Batch B must compare font,
metric typography, size, line height, weight, tracking, spacing, layout, container,
density, and target geometry together rather than approving isolated type swatches.

The approved minimum specimens remain:

| Specimen                         | Required role stress                                                                                        |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `S1` Music discovery             | `entity-companion`, long `entity-title`, artist, metadata, controls, dense levels, empty and loading states |
| `S2` Music Detail                | Page and section hierarchy, dominant and inline metrics, chart labels, long multilingual identity           |
| `S3` Global Rankings             | Repeated identity, rank and metric alignment, country/exam metadata, pagination and selectors               |
| `S4` Chart Viewer                | Focused identity, transport controls, BPM/time/measure data, renderer labels and Full-sheet annotations     |
| `S5` Home                        | Restrained page identity, search control, destinations, notices, editorial content, recovery state          |
| `S6` User-facing Editor fragment | Dense tool labels, property values, timing data, panel resizing, validation and submission states           |

Before any physical type value is approved, candidates must be compared with real
Korean, Japanese, English, mixed-script, long, dense, empty, error, disabled,
permission, and destructive fixtures at `320px`, `390px`, intermediate widths,
`1280px`, and `1440px`, plus text resize and spacing conditions.

## Reference Matrix

| Independent source                                                                                                                       | Transferable principle                                                                                       | NosLog application                                                                 | Limitation                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                                                            | Contrast, resize, reflow, and text-spacing requirements constrain every role                                 | Makes legibility and reflow blocking validation conditions                         | Does not select typeface or hierarchy values                                |
| [W3C KLReq](https://www.w3.org/TR/klreq/) and [JLReq](https://www.w3.org/TR/jlreq/)                                                      | Korean/Japanese composition, punctuation, mixed-script, and line-breaking differ from Latin defaults         | Requires real Hangul, Kana, Kanji, Latin, numeral, and punctuation specimens       | Print and vertical-writing details transfer only where relevant             |
| [Atlassian Typography](https://atlassian.design/foundations/typography/)                                                                 | Heading, body, metric, and code styles use coordinated semantic tokens                                       | Supports separate metric roles and restrained small body use                       | Enterprise values are not NosLog values                                     |
| [Fluent 2 Typography](https://fluent2.microsoft.design/typography)                                                                       | A semantic type ramp creates scannable hierarchy across platforms                                            | Supports shared roles with platform-aware testing                                  | Its exact ramp and Segoe identity do not transfer                           |
| [Carbon type strategies](https://carbondesignsystem.com/elements/typography/style-strategies/)                                           | Productive and expressive moments should match the task and stay consistent within a region                  | Supports rare display use and denser task typography without page-specific scales  | IBM's two type sets are not a NosLog template                               |
| [Primer Typography](https://primer.style/product/getting-started/foundations/typography/)                                                | Semantic markup, rem tokens, restrained hierarchy, and readable alignment work in a dense web product        | Supports semantic-role authoring and later relative values                         | GitHub content and brand differ                                             |
| [Adobe Spectrum International Design](https://spectrum.adobe.com/page/international-design/)                                             | CJK scripts can need different metrics and emphasis behavior while preserving meaning                        | Requires multilingual composition rather than Latin-only substitution              | Adobe platform scales do not decide NosLog values                           |
| [Apple Typography](https://developer.apple.com/design/human-interface-guidelines/typography)                                             | Text styles convey hierarchy and must adapt to larger accessibility sizes                                    | Supports role consistency, reflow, and avoiding thin small text                    | Native point sizes and system fonts are not web tokens                      |
| [USWDS Typography](https://designsystem.digital.gov/components/typography/)                                                              | Comfortable body text, restrained small text, measure, line height, and tabular numerals support readability | Supports reserving compact metadata and aligning metrics                           | Government reading defaults differ from dense score views                   |
| [GOV.UK Typography](https://design-system.service.gov.uk/styles/typography/)                                                             | A limited content-first hierarchy reduces inconsistency                                                      | Supports mandatory shared roles instead of local visual invention                  | Public-service tone and sizes do not define NosLog identity                 |
| [Ant Design Font](https://ant.design/docs/spec/font/)                                                                                    | Limit the physical scale and plan primary, secondary, title, and display uses systematically                 | Supports many semantic roles resolving to few physical styles                      | Its 14px base and exact scale are not approved                              |
| [SAP Fiori Typography](https://experience.sap.com/fiori-design-web/typography/)                                                          | Page, object, list, form, table, chart, and KPI contexts share governed styles; small text is exceptional    | Supports entity, control, metadata, and metric distinctions                        | Enterprise controls and proprietary font do not transfer                    |
| [GitLab design tokens](https://design.gitlab.com/product-foundations/design-tokens/)                                                     | Semantic token names codify intent across tools                                                              | Supports aliases and future Figma/code mapping                                     | It does not define NosLog role priority                                     |
| [Figma UI design principles](https://www.figma.com/resource-library/ui-design-principles/)                                               | Hierarchy, contrast, proximity, consistency, and progressive disclosure must reflect user priority           | Provides specimen-review language for detecting competing text                     | It is not a token specification                                             |
| [Shopify Polaris typography tokens](https://polaris-react.shopify.com/design/typography/typography-tokens)                               | Primitive values can compose semantic text tokens                                                            | Supports the approved layered architecture                                         | Commerce roles do not determine music or score hierarchy                    |
| [Pretendard](https://github.com/orioncactus/pretendard)                                                                                  | Pretendard JP provides one variable family for Korean, Latin, and Japanese with practical web delivery       | Supports the approved shared-family direction and required real-content validation | Project claims do not replace NosLog delivery, fallback, and layout testing |
| [osu! beatmap information](https://osu.ppy.sh/wiki/en/Beatmap_information) and [Taiko.wiki song search](https://taiko.wiki/song?lang=en) | Rhythm-game discovery must preserve song identity, difficulty, metadata, and comparable performance context  | Confirms the need for entity and metric roles in compact domain surfaces           | Their terminology, hierarchy, and visual styling cannot be copied           |

## Rejected Alternatives

| Alternative                                                                                                      | Decision   | Reason                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------- |
| Give each page its own type scale                                                                                | `Rejected` | It recreates the current inconsistency and weakens cross-page hierarchy                                     |
| Use raw size names as the page-authoring API                                                                     | `Rejected` | Authors would choose appearance instead of content meaning                                                  |
| Create twelve independent physical sizes for twelve roles                                                        | `Rejected` | Semantic specificity does not require visual-style proliferation                                            |
| Preserve `micro` as an ordinary shared UI role                                                                   | `Rejected` | It would normalize unreadably small metadata and controls                                                   |
| Use monospace for all scores and timing values                                                                   | `Rejected` | Tabular figures provide alignment without making ordinary domain data look like code                        |
| Promote every component label to a new typography token                                                          | `Rejected` | Governed aliases provide mapping clarity without parallel scales                                            |
| Permit local exceptions when text does not fit                                                                   | `Rejected` | Fit problems must first be solved through content and responsive composition                                |
| Treat the current Pretendard implementation as equivalent to approved Pretendard JP without migration validation | `Rejected` | The family is selected, but delivery, fallback, and mixed-script migration still require integrated testing |

## Decision Log

| ID       | Decision                                                                                                                                                              | Status       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `FSR-01` | Use the twelve shared semantic roles defined in this document                                                                                                         | `Approved`   |
| `FSR-02` | Keep all physical type values unresolved until Batch B integrated specimen review                                                                                     | `Superseded` |
| `FSR-03` | Require ordinary text to use approved roles and govern every physical exception explicitly                                                                            | `Approved`   |
| `FSR-04` | Keep `display` rare and prohibit it as the default page, card, metric, or state style                                                                                 | `Approved`   |
| `FSR-05` | Do not retain a global ordinary-UI `micro` role                                                                                                                       | `Approved`   |
| `FSR-06` | Use tabular figures for comparable metrics and do not use monospace for ordinary domain values                                                                        | `Approved`   |
| `FSR-07` | Keep enabled localized/read title above but visually subordinate to the original Music title                                                                          | `Approved`   |
| `FSR-08` | Treat wordmark, artist, controls, badges, chart labels, and renderer data as governed aliases rather than new shared scales                                           | `Approved`   |
| `FSR-09` | Keep Pretendard as an incumbent candidate without selecting the final font                                                                                            | `Superseded` |
| `FSR-10` | Select Pretendard JP as the shared Korean, Japanese, and English NosLog 2.0 font family while retaining production validation                                         | `Approved`   |
| `FSR-11` | Prohibit ordinary shared user-facing typography below `12px`; treat `12px` as a floor rather than a role assignment                                                   | `Approved`   |
| `FSR-12` | Keep role sizes, line heights, weights, tracking, responsive behavior, fallback, and delivery unresolved until Batch B                                                | `Superseded` |
| `FSR-13` | Recognize document `26`'s approved `12/14/16px` lower physical core without automatically assigning semantic roles                                                    | `Approved`   |
| `FSR-14` | Recognize document `26`'s approved `16/20/24px` lower line-height axis and default lower pairings without assigning full semantic composite styles                    | `Approved`   |
| `FSR-15` | Recognize document `26`'s approved `400/500/600/700` shared weight vocabulary without assigning every semantic role a final composite style                           | `Approved`   |
| `FSR-16` | Recognize document `26`'s approved natural/default tracking and retained kerning across shared roles while governing every rare exception explicitly                  | `Approved`   |
| `FSR-17` | Recognize document `26`'s approved `20/24/32px` ordinary upper core and gated `40px` display step without assigning final semantic composites                         | `Approved`   |
| `FSR-18` | Recognize document `26`'s approved `28/32/40/48px` upper line-height axis and default upper pairings without assigning final semantic composites                      | `Approved`   |
| `FSR-19` | Use document `26`'s exact twelve-role-to-nine-composite map, focused-entity and field-value precedence, tabular metric behavior, and rare display gate                | `Approved`   |
| `FSR-20` | Recognize document `26`'s bounded stepped `page-title` substitution while keeping every other role fixed and deferring the exact content-driven threshold to `FTL-08` | `Approved`   |

## Completion Checklist

- [x] Gate 0 approval recorded in document `24`.
- [x] More than fifteen independent evidence sources compared.
- [x] Twelve shared semantic roles approved.
- [x] Alias and physical-exception governance approved.
- [x] Multilingual title hierarchy and metric behavior mapped.
- [x] Current typography utilities mapped without carrying forward their values.
- [x] English canonical and Korean companion written together.
- [x] Pretendard JP selected as the shared family; production delivery and fallback
      validation remain in Batch B.
- [x] `12px` approved as the shared user-facing floor without assigning it to a role.
- [x] Restrained `12/14/16px` lower physical core approved without automatic role
      assignment.
- [x] Restrained `16/20/24px` lower line-height axis and default lower pairings
      approved with validation constraints.
- [x] Restrained `400/500/600/700` shared weight vocabulary approved with semantic,
      frequency, responsive, and validation constraints.
- [x] Natural/default tracking and retained kerning approved with no shared positive
      or negative tracking tokens and explicit exception governance.
- [x] Restrained `20/24/32px` ordinary upper physical core and gated `40px` display
      step approved without final semantic-role assignment.
- [x] Restrained `28/32/40/48px` upper line-height axis and default `20/28`, `24/32`,
      `32/40`, and `40/48` pairings approved without final semantic-role assignment.
- [x] Twelve semantic roles mapped to nine complete default composites with focused
      entity, field-value, metric, display, and semantic-heading precedence rules.
- [x] Responsive title and display substitutions compared; only the stepped wide
      `page-title` variant was approved.
- [ ] Integrated `S1`–`S6` specimens reviewed with the user.
- [ ] Approved physical values promoted to Foundation v0.1.
