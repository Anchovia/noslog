# NosLog 2.0 Foundation Typography and Layout Candidates

## Document Control

- Status: `In progress — physical type scale, lower and upper line-height, weight, and tracking axes approved; remaining composite and layout values unresolved`
- Research date: 2026-08-04
- Last decision update: 2026-08-04
- Canonical language: English
- Korean companion:
  [26-foundation-typography-layout-candidates.ko.md](./26-foundation-typography-layout-candidates.ko.md)
- Scope: Batch B physical typography, metric typography, spacing, grid, container,
  density, and target-geometry candidates for NosLog 2.0 Foundation v0.1
- Inputs: approved documents `01`–`25`, current repository typography evidence,
  maintained design systems and standards, rhythm-game domain products, and explicit
  user approval on 2026-08-04
- Excluded at this decision point: responsive type behavior, role-to-step assignments
  beyond the approved size-, line-height-, and weight-usage boundaries,
  metric-display composites, spacing, grid, containers, component dimensions, color,
  material treatment, final Figma styles, production screens, and application
  implementation

This document records the bounded decisions made during Batch B. A value becomes
authoritative only when its decision-log entry is `Approved`. Unresolved values,
external reference values, and current-code values remain evidence rather than NosLog
requirements.

## Related Documents

- [Foundation v0.1 research brief](./24-foundation-v0.1-research-brief.md)
- [Foundation semantic role map](./25-foundation-semantic-role-map.md)
- [Cross-cutting reference matrix](./22-cross-cutting-reference-matrix.md)
- [Specialized pattern and exception register](./23-specialized-pattern-exception-register.md)
- [Shared discovery page brief](./04-shared-discovery-page-brief.md)
- [Music Detail page brief](./05-music-detail-page-brief.md)
- [Global Rankings page brief](./08-global-rankings-page-brief.md)

## Approval Method

- Research and discuss one bounded material decision at a time.
- Record observations separately from proposals and approved requirements.
- Do not infer approval of responsive behavior, metric composites, exact
  composite-role mapping, or layout from approval of the physical size, line-height,
  weight, and tracking axes.
- Validate the eventual composite styles with the approved `S1`–`S6` multilingual and
  responsive specimens before Foundation v0.1 promotion.
- Update this English source and its Korean companion in the same task.

## Current NosLog Evidence

The current application is a functional and usability baseline, not a future visual
authority. Its existing utilities demonstrate the typography drift that Batch B must
prevent.

| Current utility   | Current value                                      | Observed usage | Interpretation                                                                                  |
| ----------------- | -------------------------------------------------- | -------------: | ----------------------------------------------------------------------------------------------- |
| `text-body`       | `14px` with relaxed line height and medium weight  |             41 | A current value to revalidate, not an approved body token                                       |
| `text-body-muted` | `14px` with relaxed line height and regular weight |             60 | Color and role are currently coupled and must be separated                                      |
| `text-caption`    | `12px`                                             |            294 | Small supporting type is already widespread and cannot automatically become approved `metadata` |
| `text-micro`      | `10px`                                             |             95 | Conflicts with the approved shared user-facing floor and has no default successor role          |
| `text-label`      | `14px`                                             |             71 | Supports a compact control candidate but does not approve its weight or line height             |
| `text-input`      | `16px`                                             |             32 | Supports readable input content but does not determine every control label                      |

The key problem is not the existence of `14px`. It is the broad use of tiny text and
the lack of enforceable boundaries between reading, compact interface, and tertiary
supporting content.

A repository scan of user-facing source, excluding `app/admin/**`, found `153`
`font-semibold` uses, `102` `font-bold` uses, `12` `font-extrabold` uses, and `7`
`font-black` uses, compared with only `6` `font-normal` and `4` `font-medium` uses.
These are raw utility occurrences rather than rendered-element counts, but they show
that emphasis weights have effectively become the current default. The approved 2.0
weight vocabulary must reverse that hierarchy rather than preserve the current usage
ratio.

The same user-facing scan found only two explicit tracking utilities:
`tracking-normal` on the Header wordmark and `tracking-wide` on a rotated `10px`
Bingo-board decoration. The latter is both decorative and below the approved type
floor, so it cannot justify a shared positive-tracking token. The current application
therefore provides no stable role-level tracking system to preserve.

## Focused Research Convergence

The lower-core decision compared more than fifteen independent standards, maintained
systems, production references, and domain products. Exact values differ by task and
platform, but the following pattern is stable.

| Evidence group                                                                                                                                        | Transferable finding                                                                                                                | NosLog use                                                                  | Limitation                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [Atlassian Typography](https://atlassian.design/foundations/typography/)                                                                              | Default component body is `14/20`, long-form body is `16/24`, and small body is `12/16` used sparingly                              | Supports distinct reading, compact UI, and supporting steps                 | Atlassian density and font metrics are not NosLog values               |
| [Carbon type sets](https://carbondesignsystem.com/elements/typography/type-sets/)                                                                     | Productive UI uses a `14px` base, expressive reading uses `16px`, and `12px` is limited to labels and helper text                   | Supports a semantic hybrid rather than one universal base                   | IBM's dual-set implementation is not a NosLog template                 |
| [Fluent 2 Typography](https://fluent2.microsoft.design/typography)                                                                                    | Platform ramps retain semantic hierarchy and mobile body styles are not compressed below web product text                           | Supports avoiding mobile-only type reduction                                | Native points do not map directly to CSS pixels                        |
| [Primer Typography](https://primer.style/product/getting-started/foundations/typography/)                                                             | Composite semantic styles and relative units prevent arbitrary local styling                                                        | Supports role-driven authoring and later `rem` mapping                      | It does not select NosLog values                                       |
| [USWDS Typography](https://designsystem.digital.gov/components/typography/)                                                                           | Most running text should have an effective size of at least `16px`; smaller text is reserved for specialized short uses             | Supports a readable ordinary body and restricted support type               | Government reading defaults are more spacious than dense rankings      |
| [GOV.UK type scale](https://design-system.service.gov.uk/styles/type-scale/)                                                                          | Restrained, readable body styles use `19px` and `16px` rather than compact microcopy                                                | Confirms that ordinary reading should not be normalized at the floor        | Public-service content is not a dense music archive                    |
| [Ant Design Font](https://ant.design/docs/spec/font/)                                                                                                 | Product base is `14px`; non-display systems should restrain the selected physical scale to roughly three to five sizes              | Supports a small shared physical core                                       | Its exact logarithmic ramp is not selected                             |
| [GitLab type fundamentals](https://design.gitlab.com/product-foundations/type-fundamentals/)                                                          | `12px` is meta/small-label type, `14px` is body and input-label type, and larger roles use managed steps                            | Supports a restricted floor and compact product step                        | GitLab includes a `13px` step that NosLog has not selected             |
| [SAP Fiori Typography](https://experience.sap.com/fiori-design-web/typography/)                                                                       | `14px` is the default control size, `12px` is exceptional small text, and `16px` is large readable text                             | Supports compact controls without making `12px` the default                 | Enterprise controls and its proprietary font differ                    |
| [Adobe Spectrum typography data](https://opensource.adobe.com/spectrum-design-data/tokens/typography/)                                                | CJK body sizes become larger on mobile rather than smaller                                                                          | Supports retaining the lower core across widths and testing CJK readability | Spectrum's mobile scale is too large to copy without NosLog specimens  |
| [Shopify Polaris typography tokens](https://polaris-react.shopify.com/design/typography/typography-tokens)                                            | Primitive sizes compose into semantic text tokens                                                                                   | Supports a limited physical scale behind the twelve approved roles          | Commerce semantics do not determine NosLog role mapping                |
| [Apple Typography](https://developer.apple.com/design/human-interface-guidelines/typography)                                                          | Readable text, restrained weights, scalable hierarchy, and few typefaces are more important than fitting every item at a small size | Supports readable body and no mobile compression                            | Native point-size guidance is directional only for web                 |
| [W3C Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) and [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Text must survive `200%` enlargement and required content must reflow at `320 CSS px`                                               | Makes responsive composition, not type reduction, the fit strategy          | WCAG does not prescribe a numeric minimum                              |
| [Tailwind font size](https://tailwindcss.com/docs/font-size)                                                                                          | The existing stack already provides `12`, `14`, and `16px` relative implementation steps                                            | Simplifies later implementation mapping                                     | Tailwind defaults are implementation conveniences, not design evidence |
| [Pretendard](https://github.com/orioncactus/pretendard/blob/main/packages/pretendard/docs/en/README.md)                                               | Pretendard JP provides the approved multilingual family and must be tested with real mixed-script content                           | Keeps the lower core within one family                                      | The project description does not replace NosLog browser validation     |
| [osu! Beatmap listing](https://osu.ppy.sh/beatmapsets) and [V-ARCHIVE](https://v-archive.net/)                                                        | Rhythm-game discovery and record products require compact identity, difficulty, and metric layers                                   | Confirms the need for a compact product step alongside readable body        | Public tokens are unavailable, so their visual values are not copied   |

The sources disagree between `14px` and `16px` only when their tasks differ. Dense
product controls commonly use `14px`; actual reading commonly uses `16px` or larger;
and `12px` is consistently supporting or exceptional. That disagreement supports a
semantic three-step lower core rather than one universal base.

## Approved Lower Type Core

### Physical steps

The approved lower physical size core is:

| Step                                   | Approved boundary                                                                                                                | Not yet approved                                                                                                             |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `12px` (`0.75rem` at the default root) | Lowest shared user-facing step; only eligible for short, genuinely tertiary metadata, captions, or comparable supporting content | It is not automatically assigned to the `metadata` or `entity-companion` role; line height, weight, and tracking remain open |
| `14px` (`0.875rem`)                    | Compact product-UI step for controls, dense results and rows, and most secondary information where specimens confirm readability | It is not the universal body size and no role mapping is automatic yet                                                       |
| `16px` (`1rem`)                        | Ordinary reading/body step and the upper step of the shared lower core                                                           | It does not force every entity title, control, ranking row, or metric to use `16px`                                          |

### Usage constraints

- No ordinary shared HTML user-facing typography may resolve below `12px`.
- `12px` must not carry a primary action, primary search result identity, essential
  comparison value, or long explanatory copy.
- A semantic role does not automatically inherit a step because its common name sounds
  small. `metadata` and `entity-companion` may resolve above `12px` when importance,
  language, or composition requires it.
- `14px` is the compact product step, not permission to compress all body copy.
- `16px` is the ordinary reading step, not permission to inflate every dense row.
- The `12/14/16px` lower core remains numerically stable across compact and wide
  viewports. A layout must not reduce a role on mobile or desktop merely to make it fit.
- Future responsive changes may apply to approved upper title or display roles only
  after separate discussion and specimen validation.
- Production implementation must use relative units and preserve browser text scaling.
  The `rem` mappings above assume the default `16px` root and must not be defeated by
  shrinking the root size.
- Canvas and WebGL text continue to require the explicit exception process in document
  `23`; this lower-core decision creates no automatic renderer exemption.

### Approved lower line-height axis

The approved lower line-height primitives and default pairings are:

| Font size | Default line height | Relative pairing | Intended boundary                                                      |
| --------- | ------------------- | ---------------- | ---------------------------------------------------------------------- |
| `12px`    | `16px` (`1rem`)     | `12/16`          | Short, genuinely tertiary supporting text only                         |
| `14px`    | `20px` (`1.25rem`)  | `14/20`          | Compact product UI, controls, dense results, and short supporting copy |
| `16px`    | `24px` (`1.5rem`)   | `16/24`          | Ordinary body, wrapped explanation, and reading text                   |

The lower shared line-height primitive axis is therefore `16/20/24px`. The pairings
above are the default composite lower styles, not permission to select arbitrary
font-size and line-height combinations locally.

#### Line-height constraints

- `12/16` and `14/20` must not be used for long-running reading text. Ordinary
  multi-line body copy defaults to `16/24`.
- Component target height is not determined by line height. Buttons, inputs, rows, and
  other controls must reach their later-approved target geometry through container
  size and padding rather than by compressing text leading.
- Do not introduce `18px`, `21px`, or `22px` line-height primitives merely to make a
  local component tighter. A later compact heading or metric style must first test
  whether an approved `16px`, `20px`, or `24px` line height can serve its semantic
  role; any new primitive requires a documented exception and user approval.
- These values remain stable across compact and wide viewports. Responsive fit is
  solved through reflow, hierarchy, and content behavior rather than mobile-only
  leading compression.
- WCAG Text Spacing override testing must confirm that content and functionality remain
  intact when users increase line spacing to at least `1.5` times the font size. The
  authored `12/16` and `14/20` styles do not waive that requirement.
- Korean, Japanese, English, mixed-script, long-title, and wrapped-body specimens must
  validate these pairings in Pretendard JP at `390px`, down to `320 CSS px`, and at
  representative wide widths. Failure in those specimens requires superseding this
  decision before Foundation v0.1 promotion rather than adding an undocumented local
  value.

### Approved shared weight vocabulary

The approved shared weight primitives are:

| Token      | Numeric value | Usage boundary                                                                                                              |
| ---------- | ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `regular`  | `400`         | Default for body, explanation, metadata, and other ordinary reading or supporting content                                   |
| `medium`   | `500`         | Interactive labels, input and control text, and text aligned with interface icons when the composite role later approves it |
| `semibold` | `600`         | Entity identity, section titles, compact headings, and controlled strong emphasis                                           |
| `bold`     | `700`         | Page-title, major-metric, and rare highest-emphasis uses only                                                               |

#### Weight constraints

- Shared user-facing typography must not use `100`–`300` or `800`–`900`.
- Pretendard JP variable-font support does not permit arbitrary intermediate values
  such as `450`, `550`, or `650`. Only the four approved named primitives may appear
  in shared styles.
- The expected system-wide frequency is `regular > medium > semibold > bold`. This is
  a hierarchy rule, not a fixed quota, and must be checked across representative page
  families rather than enforced independently on each component.
- Ordinary buttons, cards, rows, badges, and labels must not become bold by default.
- Weight alone must not communicate selection, interactivity, success, warning,
  danger, disabled state, or heading semantics. Structure, size, position, text,
  accessible semantics, and later-approved color or shape cues must carry the complete
  meaning.
- Weight values remain stable across compact and wide viewports. Responsive fit must
  not make text lighter or heavier.
- Exact weight assignment for each of the twelve semantic roles remains open until
  composite styles are reviewed. The boundaries above prevent misuse but do not make
  every entity title `600` or every page title `700` automatically.
- Pretendard JP and every production fallback must be tested for Korean, Japanese,
  English, mixed-script, numeric, small-size, dark-surface, and Bold Text or equivalent
  accessibility behavior. Browser-synthesized weights must not silently replace the
  approved delivered faces.

## Approved Shared Tracking Behavior

### Focused tracking research

The tracking review compared typeface guidance, accessibility and CSS standards, CJK
composition requirements, maintained design systems, implementation utilities, and
current NosLog evidence. It does not support importing a generic tight/wide scale.

| Independent source                                                                                           | Transferable finding                                                                                                                   | NosLog implication                                                                                            | Limitation                                                                   |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [Pretendard](https://github.com/orioncactus/pretendard/blob/main/packages/pretendard/docs/en/README.md)      | The family explicitly targets legibility without additional scaling, letter-spacing, or optical adjustment                             | Start from the typeface's natural spacing rather than compensating for a problem the approved family avoids   | Production delivery and fallbacks still require specimens                    |
| [W3C CSS Fonts 4](https://www.w3.org/TR/css-fonts-4/#font-kerning-prop)                                      | Kerning is a typeface-aware glyph-pair adjustment; explicit letter spacing is added after kerning                                      | Preserve proper kerning and do not confuse it with a generic tracking value                                   | The specification defines behavior, not NosLog art direction                 |
| [W3C WCAG 2.2 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)                   | Users must be able to raise letter spacing to at least `0.12em` without losing content or function                                     | Every composite style and component must survive user spacing overrides                                       | This is an override tolerance requirement, not an authored default           |
| [W3C KLReq](https://www.w3.org/TR/klreq/)                                                                    | Hangul composition has language-specific character-frame and inter-character behavior                                                  | Validate actual Korean and mixed-script content instead of applying a Latin-derived wide/tight correction     | It documents composition requirements rather than a product token            |
| [W3C JLReq](https://www.w3.org/TR/jlreq/)                                                                    | Japanese spacing depends on character classes, punctuation, line adjustment, and Japanese/Western transitions                          | A single handcrafted tracking correction is too crude to replace Japanese layout behavior                     | Print and vertical-writing requirements transfer only where relevant         |
| [W3C CSS Text 4](https://www.w3.org/TR/css-text-4/)                                                          | Script-aware inter-script, punctuation, and justification behavior is distinct from author-applied tracking                            | Keep script layout to standards and the font rather than simulating it with letter spacing                    | Some newer properties still have uneven browser support                      |
| [MDN `letter-spacing`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/letter-spacing) | Tracking is added to natural spacing, its legibility is font-specific, and large positive or negative values can make text unreadable  | There is no universal corrective value that can safely span Pretendard JP, fallbacks, sizes, and scripts      | MDN explains CSS behavior rather than selecting a product style              |
| [Carbon type sets](https://carbondesignsystem.com/elements/typography/type-sets/)                            | Carbon uses role- and IBM-Plex-specific values such as `.32px`, `.16px`, and `0px`                                                     | Managed tracking can be valid, but Carbon's values cannot be detached from its font and composite styles      | IBM Plex metrics and dual type sets differ from NosLog                       |
| [Material 3 in Compose](https://developer.android.com/develop/ui/compose/designsystems/material3)            | Material uses different tracking across its Roboto-specific type-scale roles                                                           | Confirms that nonzero tracking belongs to a tested font/style composite, not a universal product utility      | Android `sp` and Roboto values do not transfer to Pretendard JP web UI       |
| [Apple Typography](https://developer.apple.com/design/human-interface-guidelines/typography)                 | The system dynamically adjusts tracking by point size and recommends mockup adjustment only when reproducing those system-font metrics | Do not copy SF Pro's optical-size table into a custom web family                                              | Native system-font behavior is not a Pretendard JP token source              |
| [USWDS Letterspacing](https://designsystem.digital.gov/design-tokens/typesetting/letterspacing/)             | USWDS exposes bounded negative and positive values, while its typography guidance reserves tighter spacing for very large text         | Demonstrates a valid governed scale but not a need for it in NosLog Foundation v0.1                           | Government display typography and its fonts differ                           |
| [Adobe Spectrum typography data](https://opensource.adobe.com/spectrum-design-data/tokens/typography/)       | Spectrum encodes tracking inside font-, role-, and script-aware composite typography data                                              | Reinforces testing tracking only as part of a whole Pretendard JP composite                                   | Spectrum's Adobe Clean and CJK systems are not NosLog's family               |
| [Atlassian Typography](https://atlassian.design/foundations/typography/)                                     | Public product styles expose optimized semantic composites instead of inviting local tracking choices                                  | Keep authors on approved composite roles and avoid page-level tuning                                          | Its public overview does not expose a directly transferable tracking value   |
| [Primer Typography](https://primer.style/product/getting-started/foundations/typography/)                    | Primer promotes opinionated semantic shorthand styles and discourages reconstructing typography from local properties                  | Supports one governed default rather than raw tracking utilities                                              | GitHub's font stack and content differ                                       |
| [Ant Design Font](https://ant.design/docs/spec/font/)                                                        | Ant's public foundation centers family, base size, scale/line height, weight, and color while emphasizing restraint                    | Tracking is not necessary merely to make a typography system feel complete                                    | Omission in its overview is not proof that no component ever adjusts spacing |
| [SAP Fiori Typography](https://experience.sap.com/fiori-design-web/typography/)                              | SAP solves legibility and fit through the font's glyph design and compatible metrics                                                   | Prefer the approved family's metrics over routine manual compensation                                         | SAP 72 and enterprise controls differ                                        |
| [Tailwind letter spacing](https://tailwindcss.com/docs/letter-spacing)                                       | The stack offers tight, normal, wide, and arbitrary utilities as implementation capability                                             | Available utilities must not be mistaken for approved NosLog design tokens                                    | Tailwind documents how to apply values, not when NosLog needs them           |
| Current NosLog source                                                                                        | Only one ordinary `tracking-normal` use and one decorative `tracking-wide` use exist in user-facing source                             | There is no coherent current system or migration dependency that requires multiple shared tracking primitives | Static source occurrences are not rendered-element counts                    |

The converging principle is not that tracking never matters. It is that tracking is
font-, size-, role-, and sometimes script-specific. Pretendard JP's own design claim
removes the strongest reason to add correction at Foundation v0.1, while NosLog's
three-language and mixed-script requirement increases the cost and risk of doing so.

### Candidate comparison

| Candidate                                                          | Benefit                                                                                                    | Cost and risk                                                                                                                              | Recommendation                    |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| `A` — Natural/default spacing for all shared UI roles              | Smallest rule set; respects Pretendard JP metrics; stable across Korean, Japanese, English, and mixed text | Requires hierarchy to come from approved size, weight, color, and composition rather than cosmetic tightening or widening                  | `Approved`                        |
| `B` — Shared compact/default/wide tracking primitives              | Could create extra contrast between titles, body, and small labels                                         | Adds values before specimens prove a need; repeats font-specific Carbon/Material choices without their fonts; encourages local utility use | `Not recommended for v0.1`        |
| `C` — Different Korean, Japanese, English, and mixed-script values | Could theoretically tune each script                                                                       | Destabilizes line wraps and localization layouts, multiplies QA, and substitutes broad tracking for script-aware typography                | `Rejected as an initial strategy` |

### Approved constraints for candidate A

- Shared HTML UI roles use the typeface's natural spacing: Figma specimens use `0%`
  added tracking and production CSS uses `letter-spacing: normal` rather than a
  positive or negative design token.
- Proper pair kerning remains enabled through `font-kerning: normal`; zero added
  tracking must not be implemented by disabling kerning or OpenType language behavior.
- No shared `tight`, `wide`, or arbitrary tracking primitive is exposed to page or
  component authors. Local utilities such as `tracking-tight`, `tracking-wide`,
  `-0.01em`, or `0.02em` are prohibited in ordinary shared UI.
- The rule is stable across compact and wide viewports and across Korean, Japanese,
  English, mixed-script, and numeric content. Tracking must not change to make a line
  fit.
- Official uppercase content such as `NOSTALGIA` remains uppercase because that is
  its correct name, but receives no automatic extra tracking and must not be produced
  through CSS `text-transform`.
- Wordmark artwork, a future rare display treatment, canvas/WebGL renderer text, or a
  demonstrated fallback-font mismatch may request an explicit documented exception.
  None is approved by this decision, and an exception must include multilingual
  specimens and user approval.
- Components must retain all content and operation when user styles increase letter
  spacing to at least `0.12em` under WCAG 2.2 Text Spacing. This override must not be
  blocked with `!important`.
- Pretendard JP and the approved fallback stack must still be compared at `320px`,
  `390px`, intermediate widths, and wide viewports. If natural spacing fails a
  validated composite role, the role returns to discussion instead of receiving an
  undocumented local correction.

### Representative specimen implications

- `S1` Music discovery can use the compact step for controls and dense supporting
  rows while retaining a readable step for actual descriptions. Exact title and
  companion-title mapping remains open.
- `S2` Music Detail can retain a readable body without forcing every judgement,
  difficulty, and history row to the same size.
- `S3` Global Rankings can remain dense through composition and a compact product step
  rather than returning to `10px` microcopy.

These are consequences to test, not final role assignments or page layouts.

## Approved Upper Type Scale

### Focused upper-scale research

This review compared fifteen independent maintained systems and standards plus current
NosLog code evidence. It did not treat the largest scale offered by any system as a
requirement. The comparison instead asked which small set can distinguish ordinary
product headings, page identity, a dominant metric or title, and a genuinely rare
display moment without recreating local size drift.

| Independent source                                                                                                                                    | Transferable finding                                                                                                                                                | NosLog implication                                                                                    | Limitation                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [Atlassian app type scale](https://atlassian.design/foundations/typography/product-typefaces-and-scale)                                               | Uses a minor-third ramp rounded to multiples of four; its product hierarchy places common upper roles around `20px` and `24px`, with larger title levels above them | Supports a four-aligned, restrained product ramp rather than one-off values                           | Atlassian font metrics and role names are not NosLog values              |
| [Fluent 2 Typography](https://fluent2.microsoft.design/typography)                                                                                    | Web roles progress through `20`, `24`, `28`, `32`, and `40px` before a much larger display                                                                          | Confirms the functional zones of compact title, page title, dominant title, and rare large title      | NosLog does not need every intermediate Fluent step                      |
| [Primer Typography](https://primer.style/product/primitives/typography/)                                                                              | Current product composites use `20px` title medium, `32px` title large, and `40px` display                                                                          | Demonstrates that a product system can omit adjacent upper sizes and still preserve hierarchy         | GitHub content and Mona Sans metrics differ                              |
| [USWDS font tokens](https://designsystem.digital.gov/design-tokens/typesetting/font/)                                                                 | Its nine-step theme ramp includes `24`, `32`, and `40px`, while `20` and `28px` remain available only in the broader system ramp                                    | Supports curating a smaller theme-facing subset from a larger physical possibility space              | Government content does not select NosLog roles                          |
| [GOV.UK type scale](https://design-system.service.gov.uk/styles/type-scale/)                                                                          | New components must align to an existing scale; common heading points change responsively rather than creating arbitrary local values                               | Supports governed scale points and later explicit responsive composites                               | Its `19/24/36/48px` content-service ramp is intentionally more editorial |
| [Ant Design Font](https://ant.design/docs/spec/font/)                                                                                                 | Recommends controlling non-display systems to roughly three to five selected font sizes and avoiding unnecessary style waste                                        | Directly supports a small upper core and exceptional display treatment                                | It leaves exact project-specific choices to the product                  |
| [SAP Fiori Typography](https://experience.sap.com/fiori-design-web/typography/)                                                                       | Product headings use `20`, `24`, and `36px` above the general `12/14/16px` sizes                                                                                    | Confirms a sparse product-heading progression above the approved lower core                           | SAP 72 and enterprise layouts differ from Pretendard JP and NosLog       |
| [Material 3 type scale](https://developer.android.com/develop/ui/compose/designsystems/material3)                                                     | Separates `22px` title, `24/28/32px` headline, and `36px+` display roles                                                                                            | Supports separating medium-emphasis titles, important headings or numerals, and display               | The full thirteen-style Android ramp is too broad to copy                |
| [GitLab type fundamentals](https://design.gitlab.com/product-foundations/type-fundamentals)                                                           | Uses managed dynamic ranges around `18–20`, `21–25`, `24–30`, and `28–36px`; the largest display is limited to one per page                                         | Supports a restrained ordinary hierarchy and a separately gated display role                          | Fluid ranges and GitLab Sans are not direct NosLog tokens                |
| [Adobe Spectrum Heading](https://spectrum.adobe.com/page/heading/) and [platform scale](https://spectrum.adobe.com/page/platform-scale/)              | Separates application headings from larger content headings and requires platform-scale validation                                                                  | Supports keeping ordinary product titles modest while testing a rare display at representative widths | Public T-shirt names do not provide Pretendard JP pixel values           |
| [Shopify Polaris font tokens](https://polaris-react.shopify.com/tokens/font)                                                                          | Offers many primitives including `20`, `24`, `30`, `32`, `36`, and `40px`, then maps only selected values into semantic composites                                  | Confirms that available primitives must not become page-author choices automatically                  | Commerce composites do not determine NosLog hierarchy                    |
| [Apple Typography](https://developer.apple.com/design/human-interface-guidelines/typography)                                                          | Recommends a stable relative hierarchy, minimal typeface variation, and layouts that survive user text enlargement                                                  | Supports testing hierarchy and reflow rather than shrinking upper roles to fit                        | Native point sizes and Dynamic Type are directional for web              |
| [Carbon type sets](https://carbondesignsystem.com/elements/typography/type-sets/)                                                                     | Keeps productive product headings fixed and reserves fluid expressive scales for contexts that need them                                                            | Supports fixed ordinary product steps and a separately reviewed expressive/display behavior           | NosLog will not copy Carbon's two complete type sets                     |
| [LINE Messenger Typography](https://designsystem.line.me/LDSM/foundation/typography-ex-en)                                                            | East-Asian product titles cluster around `19`, `23`, and `24` while sizes below `12` are discouraged                                                                | Supports modest mobile product titles and validates avoiding an inflated default page heading         | Messenger content and native point sizing differ from responsive web     |
| [W3C Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) and [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Required text must survive `200%` enlargement and reflow at `320 CSS px`                                                                                            | Upper roles must be validated through responsive composition rather than ad hoc size reduction        | WCAG does not prescribe the upper numeric ramp                           |
| Current NosLog source                                                                                                                                 | Existing user-facing utilities use `18px` wordmark, `20px` title, `24px` display, and `36px` score display, with direct upper-size utilities scattered outside them | Shows a real need for governed upper primitives but no coherent current scale that must be preserved  | Current values are usability evidence, not 2.0 visual authority          |

The converging pattern is functional rather than numerically identical. Product titles
cluster around `20–24px`; `32px` regularly anchors a dominant title or metric; and
`36–40px` is treated as display or exceptional emphasis. Systems that expose both
`18/20px`, `28/32px`, or `36/40px` do so because they support much broader product
families. NosLog does not yet have evidence that those adjacent pairs create distinct
shared meanings.

### Candidate comparison

| Candidate                                                        | Benefit                                                                                                                                                            | Cost and risk                                                                                                                                     | Recommendation               |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `A` — `20/24/32px` ordinary upper core plus gated `40px` display | Creates distinct compact-title, page-identity, dominant, and rare-display zones; aligns to four-pixel increments; keeps the complete physical scale to seven sizes | Requires disciplined role mapping so `40px` does not become an ordinary page-title shortcut                                                       | `Approved`                   |
| `B` — `20/24/32px` only                                          | Smallest possible upper scale and strong protection against drift                                                                                                  | Makes the approved `display` role share its maximum with ordinary dominant metrics or titles, weakening its exceptional meaning                   | `Viable but not recommended` |
| `C` — `18/20/24/28/32/40px`                                      | Offers fine-grained control for many page contexts                                                                                                                 | Reintroduces ambiguous adjacent choices, increases multilingual and responsive QA, and recreates the current path toward page-specific type sizes | `Not recommended`            |

### Approved boundaries for candidate A

- The ordinary upper physical core is `20px`, `24px`, and `32px`. The complete shared
  physical ramp is therefore `12/14/16/20/24/32px`, plus the gated display step below.
- `20px` is eligible for compact section, component, and entity-title composites. It
  is not automatically assigned to all three roles.
- `24px` is eligible for principal page identity and high-priority section or entity
  identity. It is not automatically the visual style of every semantic `h1`.
- `32px` is eligible for a dominant short title or major metric. It must not become an
  ordinary card, dialog, or section heading.
- `40px` is a gated display primitive, not part of routine title selection. Only the
  `display` or `metric-display` role may be considered for it, and either mapping still
  requires separate specimen review and approval.
- `18px`, `28px`, and `36px` are not shared Foundation v0.1 primitives. A validated
  multilingual specimen must demonstrate a missing semantic distinction before one
  can be proposed.
- The scale is lean and revisable rather than permanently immutable. A new shared size
  can be proposed only after a representative multilingual and responsive specimen
  demonstrates that the approved steps cannot express a necessary semantic
  distinction. A page or component author must never add a local size preemptively.
- Approval of the physical sizes alone did not approve their line heights, weights,
  responsive substitutions, exact role mapping, maximum line count, truncation, or
  metric behavior. The subsequent section approves only the default upper
  size-to-line-height pairings and its stated boundaries; the remaining concerns stay
  unresolved.
- `20px` as a font-size primitive and `20px` as an already approved line-height
  primitive remain distinct token namespaces and must not be conflated in Figma or
  code.
- No upper role may shrink on mobile merely to fit. Any future responsive change to a
  `32px` or `40px` composite must be approved as part of that composite after Korean,
  Japanese, English, mixed-script, `320px`, `390px`, intermediate-width, and wide
  specimens.

## Approved Upper Line-height Axis

### Focused line-height research

This review compared fifteen independent maintained design systems plus W3C
accessibility and Korean/Japanese composition guidance. It evaluated authored heading
leading separately from the WCAG requirement to survive user spacing overrides. The
systems differ in typeface, platform, and density, but converge on progressively
tighter leading as title size increases, with additional room retained for smaller
headings that may wrap.

| Independent source                                                                                          | Transferable finding                                                                                                  | NosLog implication                                                                                       | Limitation                                                                    |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [Tailwind CSS font size](https://tailwindcss.com/docs/font-size)                                            | The existing stack pairs `20/28` and `24/32` by default                                                               | Provides implementation-aligned candidates for the two upper sizes most likely to wrap                   | Tailwind defaults are conveniences, not design authority                      |
| [Material 3 typography](https://developer.android.com/develop/ui/compose/designsystems/material3)           | Uses `24/32` and `32/40` for headline styles and reduces relative leading as sizes rise                               | Directly supports the middle of the proposed progression                                                 | Roboto and native `sp` values are not Pretendard JP CSS tokens                |
| [Fluent 2 typography](https://fluent2.microsoft.design/typography)                                          | Web titles include `20/26`, `24/32`, `32/40`, and `40/52`                                                             | Confirms stable functional zones while showing that the largest display leading remains product-specific | Segoe UI metrics and Fluent's `40/52` do not determine NosLog display density |
| [Carbon type sets](https://carbondesignsystem.com/elements/typography/type-sets/)                           | Product headings include `20/28` and `32/40`, while larger expressive roles tighten further                           | Supports room for wrapping at `20px` and tighter dominant headings                                       | IBM Plex and Carbon's productive/expressive split are not copied              |
| [Atlassian product type scale](https://atlassian.design/foundations/typography/product-typefaces-and-scale) | Heading leading targets about `1.2` and rounds to four-pixel rhythm                                                   | Supports `40/48` for a rare short display and four-pixel alignment                                       | Applying `1.2` to every smaller multilingual title would be too tight         |
| [GOV.UK type scale](https://design-system.service.gov.uk/styles/type-scale/)                                | Uses tested size/line-height pairs such as `24/30` and `36/40`, with explicit responsive behavior                     | Confirms that title leading is a governed composite rather than a local choice                           | Its font, public-service reading context, and five-pixel rhythm differ        |
| [USWDS typography](https://designsystem.digital.gov/components/typography/)                                 | Recommends roughly `1–1.35` for headings no longer than one or two lines                                              | Supports reducing relative leading as titles become larger and shorter                                   | It provides a range rather than Pretendard JP values                          |
| [Primer typography primitives](https://primer.style/product/primitives/typography/)                         | Couples size and line height in semantic shorthand tokens and gives medium titles more room than display              | Supports composite governance and content-dependent density                                              | Primer's current title ratios are roomier than NosLog needs to copy           |
| [Shopify Polaris Text](https://polaris-react.shopify.com/components/typography/text)                        | Responsive heading variants map predetermined size and line-height tokens                                             | Supports preventing arbitrary per-page pairings                                                          | Commerce roles and token values do not define NosLog semantics                |
| [Ant Design font system](https://ant.design/docs/spec/font/)                                                | Treats size and line height as one ordered system and recommends only three to five non-display sizes                 | Supports a small approved axis rather than generic tight/normal utilities                                | The public page does not expose every upper numeric pair as text              |
| [GitLab type fundamentals](https://design.gitlab.com/product-foundations/type-fundamentals)                 | Governs dynamic heading sizes and exposes a heading line-height token around `1.25`                                   | Supports `32/40` and keeping responsive behavior separate from the fixed default pairing                 | GitLab Sans and its fluid scale are not direct NosLog mappings                |
| [Adobe Spectrum typography data](https://opensource.adobe.com/spectrum-design-data/tokens/typography/)      | Maintains coordinated font-size and line-height scale sets and validates platform differences                         | Supports explicit primitive namespaces and later specimen testing                                        | Adobe Clean metrics and Spectrum's larger mobile scale differ                 |
| [Apple typography](https://developer.apple.com/design/human-interface-guidelines/typography)                | Default title styles become relatively tighter as size grows and tight leading is discouraged for three or more lines | Supports a gradual ratio and a line-count boundary                                                       | Native point sizes and Dynamic Type are directional for responsive web        |
| [LINE Global typography](https://designsystem.line.me/LDSG/foundation/typography-en)                        | Separates tighter title styles from more readable text styles and provides language packs including Japanese          | Supports validating the same pairings in actual East-Asian scripts                                       | Public tokens do not provide Pretendard JP measurements                       |
| [SAP Fiori typography](https://experience.sap.com/fiori-design-web/typography/)                             | Treats titles as controlled UI roles and explicitly accounts for language fallback and truncation                     | Supports real localized title testing instead of Latin-only specimens                                    | SAP 72 metrics and enterprise controls differ                                 |
| [WCAG Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)                          | Requires no content or functionality loss when users override line height to at least `1.5` times the font size       | Requires resilient containers and reflow without making authored headings `1.5` by default               | It is an override-survival criterion, not a default heading scale             |
| [W3C KLReq](https://www.w3.org/TR/klreq/) and [JLReq](https://www.w3.org/TR/jlreq/)                         | Hangul, Kana, Kanji, Latin mixtures, punctuation, and line composition require script-aware testing                   | Requires real Korean/Japanese/mixed-script specimens before promotion                                    | Print and vertical-writing material transfers only where relevant             |

The numerical convergence is strongest at `20/28`, `24/32`, and `32/40`. For the
gated `40px` display step, systems range from roughly `1.2` to `1.3`; NosLog's
approved requirement that this step remain rare and short supports the tighter
`40/48` default, subject to actual Pretendard JP specimens.

### Candidate comparison

| Candidate                              | Pairings                           | Benefit                                                                                                                                   | Cost and risk                                                                                                    | Recommendation |
| -------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------- |
| `A` — progressively tighter upper axis | `20/28`, `24/32`, `32/40`, `40/48` | Protects wrap-prone multilingual titles at `20–24px`, then tightens dominant and rare display text gradually; preserves four-pixel rhythm | Requires the `40px` gate and line-count constraints to remain enforced                                           | `Approved`     |
| `B` — tight small headings             | `20/24`, `24/28`, `32/40`, `40/48` | Produces compact single-line UI headings                                                                                                  | `20/24` and `24/28` are too tight for long Japanese Music titles and mixed-script wrapping                       | `Rejected`     |
| `C` — relaxed display                  | `20/28`, `24/32`, `32/40`, `40/52` | Gives a multi-line editorial display more room                                                                                            | Adds a `52px` primitive and weakens the approved short, rare display boundary without a demonstrated NosLog need | `Rejected`     |

### Approved pairings and boundaries

| Font size | Default line height | Relative pairing   | Intended boundary                                                                              |
| --------- | ------------------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| `20px`    | `28px` (`1.75rem`)  | `20/28` (`1.4`)    | Compact or entity-title candidates that may wrap in Korean, Japanese, English, or mixed script |
| `24px`    | `32px` (`2rem`)     | `24/32` (`1.333…`) | Principal identity candidates that may require a controlled second line                        |
| `32px`    | `40px` (`2.5rem`)   | `32/40` (`1.25`)   | Dominant short title or major-metric candidates                                                |
| `40px`    | `48px` (`3rem`)     | `40/48` (`1.2`)    | Gated, rare, short display or metric-display candidates only                                   |

The complete shared line-height primitive axis is therefore
`16/20/24/28/32/40/48px`. These are default pairings, not a public menu for arbitrary
font-size and line-height combinations.

- `20/28` and `24/32` protect titles that can legitimately reach two lines. They do
  not approve unlimited line counts or the final wrap/truncation policy.
- `32/40` and `40/48` are intended for short dominant content. A specimen requiring
  three or more lines must not keep a tight upper style merely because it fits the
  hierarchy; its content priority, width, size, role, or composition must return to
  review.
- `36px`, `44px`, and `52px` are not shared Foundation v0.1 line-height primitives.
  A new value requires representative multilingual and responsive evidence plus
  explicit user approval; page and component authors may not add local leading.
- The pairings remain in relative implementation units and must preserve browser text
  scaling. Pixel notation documents the design target only.
- This decision does not assign semantic roles, weights, maximum line counts,
  truncation rules, responsive size substitutions, or metric-display behavior.
- No mobile-only line-height compression is approved. Responsive role substitutions
  remain a later bounded decision after composite-role mapping.
- Pretendard JP specimens must test original Japanese Music titles, localized/read
  titles, long artist credits, Korean and English page identity, tabular metrics, and
  mixed punctuation at `320px`, `390px`, intermediate widths, wide layouts, `200%`
  text enlargement, and WCAG Text Spacing overrides before Foundation promotion.

## Alternatives Not Selected

| Alternative                                                                  | Status     | Reason                                                                                                                                                                                   |
| ---------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Use `14px` as the universal body and interface base                          | `Rejected` | Repeats the current tendency to compress reading and CJK content, and does not create a clear boundary against overused small text                                                       |
| Use `16px` for every ordinary body, result, control, and dense row           | `Rejected` | Protects reading but unnecessarily expands rankings, discovery results, and professional-tool surfaces                                                                                   |
| Use a smaller mobile scale to preserve density                               | `Rejected` | Conflicts with mobile-first readability, CJK evidence, and the approved strategy of solving fit through reflow and content hierarchy                                                     |
| Use separate unrelated mobile and desktop lower scales                       | `Rejected` | Makes shared role meaning unstable and risks recreating page- and breakpoint-specific typography drift                                                                                   |
| Add separate compact `14/18` and `16/22` pairings alongside reading pairings | `Rejected` | Carbon demonstrates a valid dual system, but it would expand the initial lower line-height axis from three to five values before NosLog specimens show that the distinction is necessary |
| Apply a universal `1.5` ratio as `12/18`, `14/21`, and `16/24`               | `Rejected` | It protects long reading but makes short tertiary and product-interface text unnecessarily loose and introduces non-system `18px` and `21px` steps                                       |
| Use only `400` and `700`                                                     | `Rejected` | It is simple but creates too large a jump between ordinary reading, interactive controls, entity identity, and top emphasis                                                              |
| Use `400`, `500`, and `700`                                                  | `Rejected` | It supports subtle controls but forces compact headings and entity identity to choose between a weak medium and a heavy bold                                                             |
| Use `400`, `600`, and `700`                                                  | `Rejected` | It supports strong hierarchy but omits the restrained interactive step and risks preserving the current overuse of semibold                                                              |
| Expose every Pretendard JP weight or arbitrary variable values               | `Rejected` | Font capability is not a semantic need and would recreate uncontrolled page-specific emphasis                                                                                            |
| Import Carbon, Material, Apple, or USWDS tracking values                     | `Rejected` | Their values are coupled to different fonts, platforms, sizes, and composite roles                                                                                                       |
| Publish generic `tight`, `normal`, and `wide` utilities for shared UI        | `Rejected` | It would create an uncontrolled local styling axis before a NosLog specimen demonstrates a semantic need                                                                                 |
| Adjust tracking by locale or viewport as an initial strategy                 | `Rejected` | It multiplies wrapping and QA variation and conflicts with stable localized composition                                                                                                  |
| Add `18px`, `28px`, or `36px` to the initial shared ramp preemptively        | `Rejected` | These adjacent steps add author choice and validation cost before a representative specimen demonstrates a missing semantic distinction                                                  |
| Allow `40px` as a routine page, card, dialog, or section title               | `Rejected` | It would collapse the approved rare-display boundary and recreate page-level emphasis drift                                                                                              |
| Use tight `20/24` and `24/28` upper pairings                                 | `Rejected` | The ratios suit short single-line UI labels but do not protect long Japanese Music titles or mixed-script identity when they wrap                                                        |
| Add `52px` leading for the gated `40px` display by default                   | `Rejected` | It assumes multi-line editorial display behavior that NosLog has not approved and adds another primitive without specimen evidence                                                       |

## Decision Log

| ID       | Decision                                                                                                                                                                | Status                             |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `FTL-01` | Use `12px`, `14px`, and `16px` as the shared lower physical type core with the role boundaries and responsive constraints above                                         | `Approved`                         |
| `FTL-02` | Use `16px`, `20px`, and `24px` as the lower line-height primitives, defaulting to `12/16`, `14/20`, and `16/24`, subject to the validation constraints above            | `Approved`                         |
| `FTL-03` | Use only `400`, `500`, `600`, and `700` as shared weight primitives with the semantic, frequency, responsive, and validation constraints above                          | `Approved`                         |
| `FTL-04` | Use natural/default spacing for every shared UI role, keep kerning enabled, expose no positive or negative shared tracking token, and govern rare exceptions explicitly | `Approved`                         |
| `FTL-05` | Use `20px`, `24px`, and `32px` as the ordinary upper core and gate `40px` to separately approved display or metric-display composites                                   | `Approved`                         |
| `FTL-06` | Use `28px`, `32px`, `40px`, and `48px` as upper line-height primitives, defaulting to `20/28`, `24/32`, `32/40`, and `40/48`, with the boundaries above                 | `Approved`                         |
| `FTL-07` | Map the twelve semantic roles, including metric roles, to complete composite styles                                                                                     | `Observed need — not yet proposed` |
| `FTL-08` | Select spacing, grid, container, density, and target geometry values                                                                                                    | `Observed need — not yet proposed` |
| `FTL-09` | Select responsive title and display substitutions after composite-role mapping                                                                                          | `Observed need — not yet proposed` |

## Next Approval Gate

The next bounded decision is the exact composite mapping of the twelve semantic roles,
including the boundary between heading-like roles and `metric-inline` or
`metric-display`. That gate must use the approved physical axes without silently
approving responsive substitutions, line-count policy, truncation, or component
geometry.
