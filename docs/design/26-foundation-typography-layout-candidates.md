# NosLog 2.0 Foundation Typography and Layout Candidates

## Document Control

- Status: `In progress — typography and layout contracts approved through measured grid and page-title transitions; integrated specimen validation remains open`
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
- Excluded at this decision point: maximum line counts, wrapping and truncation policy,
  component dimensions beyond the
  approved control-height and target contract, color, material treatment, final Figma
  styles, production screens, and application implementation

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
- Apply responsive behavior only through the bounded `page-title` substitution in
  `FTL-09`; do not infer any other substitution, line-count policy, truncation,
  component geometry, or layout from the approved physical axes and exact semantic
  composite mapping.
- Validate the approved composite styles with the `S1`–`S6` multilingual and
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

| Step                                   | Approved boundary                                                                                                                | Approved role resolution recorded later in this document                         |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `12px` (`0.75rem` at the default root) | Lowest shared user-facing step; only eligible for short, genuinely tertiary metadata, captions, or comparable supporting content | `metadata` resolves to `12/16 · 400`; `entity-companion` does not use this floor |
| `14px` (`0.875rem`)                    | Compact product-UI step for controls, dense results and rows, and most secondary information where specimens confirm readability | Supports the approved `14/20 · 400` and `14/20 · 500` composites                 |
| `16px` (`1rem`)                        | Ordinary reading/body step and the upper step of the shared lower core                                                           | Supports the approved `16/24 · 400` and `16/24 · 600` composites                 |

### Usage constraints

- No ordinary shared HTML user-facing typography may resolve below `12px`.
- `12px` must not carry a primary action, primary search result identity, essential
  comparison value, or long explanatory copy.
- A page or component author does not choose a step because a role sounds small. The
  approved composite map resolves `metadata` to `12px` and `entity-companion` to
  `14px`; changing either requires the explicit exception process.
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
- The exact role-to-weight assignments are approved in the semantic composite section
  below. The frequency and misuse boundaries above still apply across the complete
  system rather than authorizing local weight changes.
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
- `20px` resolves to the approved `section-title` composite. Component and ordinary
  entity titles use `16px`; authors must not promote them locally.
- `24px` resolves to `page-title`, including the focused-entity precedence rule. It
  does not automatically determine the semantic HTML heading level.
- `32px` resolves to `metric-display`. It must not become an ordinary title, card,
  dialog, or section heading.
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
  metric behavior. The subsequent sections approve the default upper
  size-to-line-height pairings, exact semantic mapping, and the single `page-title`
  substitution within their stated boundaries; every concern not explicitly approved
  there remains unresolved.
- `20px` as a font-size primitive and `20px` as an already approved line-height
  primitive remain distinct token namespaces and must not be conflated in Figma or
  code.
- No upper role may shrink on mobile merely to fit. Apart from the later approved
  `page-title` substitution in `FTL-09`, any further responsive change to a `32px` or
  `40px` composite must be approved as part of that composite after Korean, Japanese,
  English, mixed-script, `320px`, `390px`, intermediate-width, and wide specimens.

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
- The subsequent semantic composite decision assigns roles, weights, and metric
  behavior. Maximum line counts, truncation rules, and any responsive size
  substitution beyond the approved `page-title` step remain unresolved.
- No mobile-only line-height compression is approved. `FTL-09` is the only approved
  responsive role substitution; any additional substitution requires a later bounded
  decision.
- Pretendard JP specimens must test original Japanese Music titles, localized/read
  titles, long artist credits, Korean and English page identity, tabular metrics, and
  mixed punctuation at `320px`, `390px`, intermediate widths, wide layouts, `200%`
  text enlargement, and WCAG Text Spacing overrides before Foundation promotion.

## Approved Semantic Composite Map

### Focused role-mapping research

The exact mapping review compared sixteen independent official or maintained systems.
The systems use different fonts, platforms, and naming schemes, so their surface
tokens were not copied. The stable transferable pattern is that semantic roles may
outnumber physical composites, ordinary product hierarchy often combines a restrained
size ramp with weight, metrics deserve purpose-built numeral behavior, and visual
heading treatment remains independent from document semantics.

| Independent source                                                                                    | Transferable finding                                                                                              | NosLog implication                                                                                  | Limitation                                                                |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [Material 3 typography](https://developer.android.com/develop/ui/compose/designsystems/material3)     | Its full type scale is optional; product themes may keep only the styles they need                                | Twelve NosLog meanings do not require twelve independent physical styles                            | Native `sp`, Roboto, and Material role names are not NosLog values        |
| [Fluent 2 typography](https://fluent2.microsoft.design/typography)                                    | Shared body sizes use weight and hierarchy changes instead of a new size for every use                            | Supports shared composites for `body`, `control`, identity, and supporting roles                    | Segoe UI metrics and Fluent platform ramps do not transfer directly       |
| [Carbon type sets](https://carbondesignsystem.com/elements/typography/type-sets/)                     | Productive and expressive styles reuse coordinated physical values across semantic contexts                       | Supports a lean physical vocabulary with rare display treatment                                     | IBM Plex and Carbon's productive/expressive split are not copied          |
| [Atlassian Typography](https://atlassian.design/foundations/typography/)                              | Distinguishes body, heading, and metric use while reusing a constrained system                                    | Supports distinct metric roles without treating them as headings                                    | Atlassian density and font metrics are not NosLog values                  |
| [Primer Typography](https://primer.style/product/getting-started/foundations/typography/)             | Composite tokens and semantic markup prevent arbitrary local selection                                            | Supports fixed role-to-composite mapping and semantic heading independence                          | GitHub's content hierarchy is not a NosLog page template                  |
| [GitLab type fundamentals](https://design.gitlab.com/product-foundations/type-fundamentals/)          | Body and label hierarchy can share sizes and differ through governed weight and context                           | Supports `14/20` regular and medium variants without adding another size                            | GitLab includes physical steps that NosLog intentionally omitted          |
| [Ant Design Font](https://ant.design/docs/spec/font/)                                                 | Ordinary product interfaces should restrain the active size count, commonly to about three to five                | Supports nine composites built from seven approved pairings rather than role-specific proliferation | Its logarithmic scale and `14px` base are not copied                      |
| [USWDS Typography](https://designsystem.digital.gov/components/typography/)                           | Readable body, restrained small text, and tabular numbers solve different jobs                                    | Supports `16/24` body, exceptional `12/16` metadata, and tabular metrics                            | Government reading defaults are roomier than dense score surfaces         |
| [GOV.UK Typography](https://design-system.service.gov.uk/styles/typography/)                          | A small, content-first hierarchy and semantic HTML remain separate concerns                                       | Supports visual-role consistency without making every visual title the matching HTML heading level  | Public-service tone and responsive values do not determine NosLog styling |
| [SAP Fiori Typography](https://experience.sap.com/fiori-design-web/typography/)                       | Object, list, control, chart, and KPI contexts share governed styles; KPI values retain labels and units          | Supports entity, control, metadata, and metric distinctions within one restrained system            | Enterprise control density and SAP 72 metrics differ                      |
| [Apple Typography](https://developer.apple.com/design/human-interface-guidelines/typography)          | Text styles communicate hierarchy while larger accessibility sizes require recomposition                          | Supports stable role meaning and later responsive/accessibility gates rather than local shrinkage   | Native Dynamic Type does not map directly to CSS composites               |
| [Japan Digital Agency Design System typography](https://design.digital.go.jp/foundations/typography/) | Japanese body/UI text prioritizes legibility; smaller text is constrained and heading semantics remain structured | Supports `16/24` ordinary reading, restrained `14/20`, and real Japanese specimen validation        | Its font family and government content do not determine NosLog identity   |
| [LINE Design System typography](https://designsystem.line.me/LDSG/foundation/typography-en)           | Consistent role families span Japanese and other language packs while accounting for script metrics               | Supports one semantic map across Korean, Japanese, English, and mixed-script content                | LINE's exact public tokens are not Pretendard JP measurements             |
| [Radix Themes typography](https://www.radix-ui.com/themes/docs/theme/typography)                      | A concise size scale combines with weight and semantic component APIs                                             | Supports composing a small physical ramp rather than exposing page-local values                     | Radix defaults are implementation options, not NosLog design evidence     |
| [Tailwind CSS font size](https://tailwindcss.com/docs/font-size)                                      | Size and line height can be paired and implemented as relative, reusable tokens                                   | Supports deterministic code mapping for the approved composites                                     | Framework defaults are conveniences rather than design authority          |
| [VA Design System typography](https://design.va.gov/foundation/typography)                            | Visual typography style and accessible heading level are related but not interchangeable                          | Supports applying `page-title` or other composites while preserving correct document outline        | Its public-service content and font do not determine NosLog role priority |

The strongest convergence is architectural rather than numerical: use semantic names
for authoring, reuse a small number of complete physical treatments, use weight only as
part of a governed composite, keep comparable numbers tabular, and preserve correct
HTML heading order independently from visual style. The approved NosLog values below
come from the already approved physical axes plus the user-reviewed product hierarchy,
not from copying any one source.

### Approved role-to-composite mapping

Every shared role resolves to the following complete default composite. Natural or
default tracking and retained kerning apply throughout.

| Semantic role      | Approved default composite | Numeric feature | Governing boundary                                                                                                  |
| ------------------ | -------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------- |
| `display`          | `40/48 · 700`              | Proportional    | Rare, short, separately justified expressive moment; no automatic page assignment                                   |
| `page-title`       | `24/32 · 700`              | Proportional    | Compact/default page or focused-task identity; the approved wide substitution is governed separately below          |
| `section-title`    | `20/28 · 600`              | Proportional    | A real major content boundary, not a decorative card label                                                          |
| `component-title`  | `16/24 · 600`              | Proportional    | Dialog, drawer, panel, or grouped-module identity subordinate to its section                                        |
| `entity-title`     | `16/24 · 600`              | Proportional    | Ordinary list/card entity identity; focused-page entity identity follows the precedence rule below                  |
| `entity-companion` | `14/20 · 400`              | Proportional    | Optional localized/read identity; subordinate to but legible beside the canonical entity title                      |
| `body`             | `16/24 · 400`              | Proportional    | Ordinary reading, explanation, and system message                                                                   |
| `body-secondary`   | `14/20 · 400`              | Proportional    | Supporting identity or concise contextual text; not the only carrier of task-critical meaning                       |
| `control`          | `14/20 · 500`              | Proportional    | Visible action or choice label; entered and selected field values follow the precedence rule below                  |
| `metadata`         | `12/16 · 400`              | Proportional    | Short, genuinely tertiary fact or annotation only                                                                   |
| `metric-display`   | `32/40 · 700`              | Tabular figures | One locally dominant approved quantitative result with an explicit label, unit, and scope                           |
| `metric-value`     | `14/20 · 500`              | Tabular figures | Comparable quantitative value in a row, group, control, or visualization; never an unlabeled number without context |

The twelve roles intentionally share nine physical composites:

1. `40/48 · 700`;
2. `32/40 · 700`;
3. `24/32 · 700`;
4. `20/28 · 600`;
5. `16/24 · 600`;
6. `16/24 · 400`;
7. `14/20 · 500`;
8. `14/20 · 400`; and
9. `12/16 · 400`.

These are governed composite styles, not a menu of independent size, leading, and
weight values. A page or component author selects a semantic role or approved alias,
not a physical combination.

### Approved precedence and alias rules

1. **Focused entity identity:** when a domain entity is the identity of the focused
   page or task, its visible primary heading uses the `page-title` role while
   retaining the entity's semantic meaning and canonical name. It resolves to
   `24/32 · 700` in compact/default composition and follows the approved wide
   substitution below when that composition is active.
   Examples include the original Music title on Music Detail, a username on Profile,
   and the primary arcade or exam identity where that entity owns the page. The same
   entity in an ordinary list or card uses `entity-title` at `16/24 · 600`. This is a
   governed precedence rule, not a thirteenth role or a new physical style.
2. **Action labels versus field values:** text that names an action or available
   choice—button, tab, filter, menu item, field label—uses `control` at
   `14/20 · 500`. A user's entered value or the selected value displayed inside a
   text-like field uses the existing `body` composite `16/24 · 400`. This preserves
   readable content and avoids inventing a separate input-value style.
3. **Metric numerals:** `metric-display` and `metric-value` enable tabular figures for
   comparable numerals. Other roles remain proportional by default and do not inherit
   tabular figures merely because they contain a date or occasional number.
4. **Display gate:** the physical `40/48 · 700` composite exists, but `display` remains
   rare and has no automatic page-family assignment. A normative specimen and explicit
   approval are still required before a production surface uses it.
5. **Semantic outline:** visual composite selection never changes the required HTML
   heading level. A `page-title` treatment may appear on an entity, while the document
   outline and accessible name remain correct for the actual page structure.

### Approved responsive `page-title` substitution

The responsive comparison covered eighteen independent official or maintained
sources across dense product systems, stepped upper scales, fluid expressive scales,
multilingual systems, accessibility standards, and responsive implementation:
[Carbon](https://carbondesignsystem.com/elements/typography/type-sets/),
[Material 3](https://developer.android.com/develop/ui/compose/designsystems/material3),
[Atlassian](https://atlassian.design/foundations/typography),
[GOV.UK](https://design-system.service.gov.uk/styles/type-scale/),
[Primer](https://primer.style/product/css-utilities/typography/),
[USWDS](https://designsystem.digital.gov/components/typography/),
[GitLab Pajamas](https://design.gitlab.com/product-foundations/type-fundamentals/),
[Japan Digital Agency](https://design.digital.go.jp/dads/foundations/typography/),
[LINE](https://designsystem.line.me/LDSG/foundation/typography-en),
[Adobe Spectrum](https://spectrum.adobe.com/page/platform-scale/),
[Ant Design](https://ant.design/docs/spec/font/),
[Fluent 2](https://fluent2.microsoft.design/typography),
[SAP Fiori](https://experience.sap.com/fiori-design-web/typography/),
[Apple](https://developer.apple.com/design/human-interface-guidelines/typography),
[VA Design System](https://design.va.gov/foundation/typography),
[WCAG](https://www.w3.org/TR/WCAG21/),
[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp), and
[Tailwind CSS](https://tailwindcss.com/docs/responsive-design).

The sources do not support enlarging every role on a wide viewport. Dense product
systems commonly keep functional text stable; systems that do change size generally
limit the change to upper hierarchy, while fluid interpolation is concentrated in
expressive or editorial contexts. NosLog also needs a stronger page identity in an
intentional desktop composition without reopening the lower scale or producing
arbitrary intermediate values. The approved result is therefore a single stepped
substitution:

| Semantic role or group                  | Compact/default composition | Content-driven wide composition | Numeric feature |
| --------------------------------------- | --------------------------- | ------------------------------- | --------------- |
| `page-title`                            | `24/32 · 700`               | `32/40 · 700`                   | Proportional    |
| `display`                               | `40/48 · 700`               | unchanged                       | Proportional    |
| `metric-display`                        | `32/40 · 700`               | unchanged                       | Tabular figures |
| `section-title` and every lower UI role | approved default composite  | unchanged                       | role default    |

The substitution is governed as follows:

1. `24/32 · 700` remains the mobile-first and compact/default `page-title` treatment.
2. When the page enters the approved content-driven wide composition, every ordinary
   `page-title` on that page uses `32/40 · 700`. Page authors cannot opt in or out by
   preference, and focused entities inherit the same rule.
3. The exact transition threshold is selected with `FTL-08` from the available title
   region and surrounding layout constraints. It must not be inferred from a device
   name, copied from a framework breakpoint, or implemented merely because the client
   is a desktop browser.
4. The transition is stepped. No viewport-fluid `clamp()` interpolation, intermediate
   font size, locale-specific size, or page-local responsive value is approved.
5. `display`, `metric-display`, and every role below `page-title` remain at their
   approved composites across layout widths. Wide space is used for comparison,
   analysis, columns, and composition rather than global type enlargement.
6. The wide variant reuses the approved `32/40 · 700` physical size, leading, and
   weight primitives with proportional figures. It is a governed responsive variant
   of `page-title`, not a general tenth style that authors may select directly.
7. Responsive composition does not replace accessibility scaling. Relative units,
   `200%` text resize, `320 CSS px` reflow, text-spacing overrides, and Korean,
   Japanese, English, and mixed-script validation remain required.

### Boundaries not approved by this mapping and substitution

This decision does not approve:

- the exact viewport or container threshold for the approved `page-title`
  substitution;
- responsive substitution for any role other than `page-title`, including wide-screen
  enlargement of `metric-display` or `display`;
- fluid interpolation or arbitrary intermediate typography values;
- maximum line counts, wrapping priority, or truncation behavior;
- component height, padding, target geometry, or surrounding spacing;
- color, opacity, material, alignment, or final layout;
- automatic `display` placement; or
- final Figma/token naming beyond the semantic role identifiers recorded here.

Those values remain separate gates and must be validated with the integrated
multilingual specimens before Foundation v0.1 promotion.

### Approved spacing primitives and role boundaries

The spacing comparison covered seventeen independent official or maintained sources
across product systems, responsive grids, multilingual services, public-sector
systems, platform guidance, accessibility standards, and the current implementation:
[Material 3](https://m3.material.io/foundations/layout/canonical-examples/overview),
[Carbon](https://carbondesignsystem.com/elements/spacing/overview/),
[Atlassian](https://atlassian.design/foundations/grid-beta/applying-grid/),
[Primer](https://www.primer.style/product/primitives/),
[SAP Fiori](https://experience.sap.com/fiori-design-web/spacing/),
[Fluent 2](https://fluent2.microsoft.design/layout),
[Adobe Spectrum](https://spectrum.adobe.com/page/spacing/),
[Ant Design](https://ant.design/docs/spec/layout/),
[Japan Digital Agency](https://design.digital.go.jp/dads/foundations/spacing/),
[USWDS](https://designsystem.digital.gov/utilities/layout-grid/),
[GOV.UK](https://design-system.service.gov.uk/styles/spacing/),
[LINE](https://designsystem.line.me/LDSG/foundation/layout-en/),
[Apple](https://developer.apple.com/design/human-interface-guidelines/layout),
[WCAG Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum),
[WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html),
[MDN Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries),
and [Tailwind CSS](https://tailwindcss.com/docs/responsive-design).

The systems differ in how many values they expose and in the density of their target
platforms. They nevertheless converge on a four-pixel fine unit, an eight-pixel
working rhythm, a restrained intermediate step around twelve pixels for compact
components, and larger gaps chosen from a limited sequence. LINE explicitly reserves
two pixels as an exception to its four-pixel rhythm, while Spectrum exposes the same
small sequence and Primer concentrates common stack gaps at eight, sixteen, and
twenty-four pixels. NosLog therefore adopts a lean product-spacing vocabulary rather
than importing every large editorial or platform value.

| Primitive value | Approved role boundary                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| `0px`           | Intentional absence of space                                                                                  |
| `2px`           | Optical correction inside icons, badges, or specialized visualization only; never ordinary layout spacing     |
| `4px`           | Internally inseparable details                                                                                |
| `8px`           | Inline peers and tightly related controls                                                                     |
| `12px`          | Compact component inset and dense control groups                                                              |
| `16px`          | Default component inset and related content blocks                                                            |
| `24px`          | Subsection separation                                                                                         |
| `32px`          | Section separation                                                                                            |
| `48px`          | Major page-region separation                                                                                  |
| `64px`          | Rare large page boundary whose hierarchy cannot be expressed by an existing component or section relationship |

The primitives are governed as follows:

1. Product authors use semantic spacing roles rather than choosing a primitive by
   visual preference. Final token names are assigned after grid, container, density,
   and target geometry are approved.
2. `2px` is not available to ordinary `gap`, padding, margin, page layout, or control
   layout. It exists only for documented optical correction or specialized renderer
   geometry that cannot express the same result through alignment.
3. `40px`, `80px`, and `96px` are not shared spacing primitives in Foundation v0.1.
   New adjacent or large values require a representative specimen showing that the
   approved relationships cannot express a necessary hierarchy.
4. Arbitrary application spacing such as `gap-[13px]` or `margin-top: 18px` is not
   permitted. A domain visualization may register a measured exception when its
   meaning genuinely depends on geometry rather than application layout rhythm.
5. A large separation must still communicate a real relationship. Page authors must
   not use `48px` or `64px` merely to make a sparse composition look premium.
6. This approval selects only the primitive axis and role boundaries. It does not yet
   assign page margins, grid gutters, container padding, responsive section steps,
   control heights, hit areas, or the wide `page-title` threshold.

### Approved compact page-grid geometry

The compact comparison did not reveal one universal industry column count. LINE uses
four columns at `375px`, while Atlassian uses two columns from `320px` through `479px`;
both independently use `16px` inline margins and `12px` gutters. Fluent also treats
`320–479px` as its smallest responsive validation range, while WCAG Reflow establishes
`320 CSS px` as the ordinary no-two-dimensional-scrolling test width. NosLog needs
single-column reading, two-up square jacket discovery, and nested three-item quick
navigation without treating `390px` as a fixed shell. Four logical columns provide
those spans with the least page-level author variation.

| Compact geometry item | Approved value or behavior                                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Validation range      | `320–479 CSS px`; this is a compact test contract, not an automatic transition at `480px`                                  |
| Representative canvas | `390px`; never a fixed application width, minimum width, or universal breakpoint                                           |
| Inline page margin    | `16px` minimum, protected with `max(16px, env(safe-area-inset-left/right))` where a full-width surface reaches a safe area |
| Logical columns       | Four equal fluid columns                                                                                                   |
| Column gutter         | `12px`                                                                                                                     |
| Ordinary page content | Spans all four columns                                                                                                     |
| Two-up jacket grid    | Each item spans two columns; the item remains square when the approved card pattern requires a `1:1` jacket                |
| Three-up quick group  | The group spans all four page columns and creates its own three-item internal layout; it does not distort the page grid    |
| Horizontal overflow   | Prohibited for ordinary pages; only meaning-dependent two-dimensional content may use a documented contained overflow path |

The measured geometry is:

| Viewport | Content width | One logical column | Two-column item |
| -------- | ------------- | ------------------ | --------------- |
| `320px`  | `288px`       | `63px`             | `138px`         |
| `390px`  | `358px`       | `80.5px`           | `173px`         |
| `479px`  | `447px`       | `102.75px`         | `217.5px`       |

The compact grid is governed as follows:

1. The four columns are an alignment contract, not a requirement that every wrapper
   use CSS Grid or that four independent content columns appear on a phone.
2. Page backgrounds, dividers, Header surfaces, and other approved full-bleed
   treatments may reach the viewport edge, but their ordinary content aligns to the
   safe `16px` page margin.
3. Page margin does not shrink below `16px` at `320 CSS px`. Content must reflow,
   wrap, stack, or use approved progressive disclosure instead of reclaiming the
   margin or shrinking typography and targets.
4. Component inset is separate from page margin. A card or control does not inherit
   `16px` padding merely because it sits on the page grid; its semantic component role
   selects an approved inset later.
5. The upper bound `479px` does not approve `480px` as a viewport breakpoint. A later
   composition changes only at a measured content or container failure point.
6. The chart viewer, sheet renderer, charts, maps, and editor may register contained
   two-dimensional behavior only when the domain meaning genuinely requires it and an
   accessible summary or alternate operation remains available.
7. The approved geometry was reviewed in a width-switching example at `320px`,
   `390px`, and `479px`. Final Foundation promotion still requires the integrated
   `S1`–`S6` multilingual specimens and zoom/text-spacing checks.

### Approved container classes and medium/wide grid model

The container comparison used the same broad evidence set as the compact geometry,
including [Material 3 canonical layouts](https://m3.material.io/foundations/layout/canonical-examples/overview),
[Carbon Grid](https://carbondesignsystem.com/elements/2x-grid/overview/),
[Atlassian Grid](https://atlassian.design/foundations/grid-beta/applying-grid/),
[Fluent 2 Layout](https://fluent2.microsoft.design/layout),
[Adobe Spectrum](https://spectrum.adobe.com/page/responsive-grid/),
[Ant Design Layout](https://ant.design/docs/spec/layout/),
[Japan Digital Agency](https://design.digital.go.jp/dads/foundations/layout/),
[USWDS Layout Grid](https://designsystem.digital.gov/utilities/layout-grid/),
[GOV.UK Width Container](https://design-system.service.gov.uk/styles/layout/#page-wrappers),
[LINE Layout](https://designsystem.line.me/LDSG/foundation/layout-en/),
[Apple Layout](https://developer.apple.com/design/human-interface-guidelines/layout),
[Primer Breakpoints](https://primer.style/product/primitives/breakpoints/),
[Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design),
[MDN Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries),
and [WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html),
alongside current NosLog page-family requirements. The evidence converges on bounded
reading and application regions, deliberate wider analysis surfaces, and fluid
professional workspaces rather than one universal maximum width.

Container class and grid tier are separate contracts. A container class describes
how much horizontal space a product task may use; the grid tier provides shared
alignment within the currently available space. A route chooses a default class from
its primary task, while a nested region may use a narrower class when its content job
changes. Pages must not invent local maximum widths merely to make a composition look
balanced.

| Container class | Approved maximum and inner measure                                                     | Default product role and representative page families                         |
| --------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `reading`       | `768px` shell maximum; continuous prose is further constrained to `68ex`               | Guidance, policy, onboarding explanation, and settings/help reading regions   |
| `standard`      | `1280px` maximum                                                                       | Home, Music discovery, Tiers, Bingo, and Exams                                |
| `wide`          | `1440px` maximum                                                                       | Music-detail analysis, Rankings, Profile, and Arcade discovery/detail         |
| `workspace`     | No fixed maximum; remains fluid inside the approved page margin and safe-area contract | Chart Viewer, Chart Editor, and meaning-dependent professional visualizations |

The shared page-alignment models are:

| Grid tier    | Logical columns | Gutter | Minimum inline page margin | Approval boundary                                                                                                          |
| ------------ | --------------- | ------ | -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Compact      | 4               | `12px` | `16px`, safe-aware         | Active below a `672 CSS px` page-layout query container; the `320–479 CSS px` compact validation contract remains required |
| Intermediate | 8               | `16px` | `24px`, safe-aware         | Activates at a `672 CSS px` page-layout query container and remains active below `1056 CSS px`                             |
| Wide         | 12              | `16px` | `32px`, safe-aware         | Activates at a `1056 CSS px` page-layout query container                                                                   |

#### Approved measured transition thresholds

The threshold review compared sixteen independent official or maintained sources:
[WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html),
[MDN Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries),
[Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design),
[Atlassian Grid](https://atlassian.design/foundations/grid-beta/applying-grid/),
[Material 3 canonical layouts](https://m3.material.io/foundations/layout/canonical-examples/overview),
[Fluent 2 Layout](https://fluent2.microsoft.design/layout),
[Carbon Grid](https://carbondesignsystem.com/elements/2x-grid/overview/),
[Primer breakpoints](https://primer.style/product/primitives/breakpoints/),
[Shopify Polaris breakpoints](https://polaris-react.shopify.com/tokens/breakpoints),
[GitLab Pajamas Layout](https://design.gitlab.com/product-foundations/layout/),
[SAP Fiori Flexible Grid](https://experience.sap.com/fiori-design-web/flexible-grid/),
[USWDS Layout Grid](https://designsystem.digital.gov/utilities/layout-grid/),
[GOV.UK Layout](https://design-system.service.gov.uk/styles/layout/),
[Singapore Government Design System Responsive Grid](https://www.designsystem.tech.gov.sg/foundations/layout/responsive-grid),
[Japan Digital Agency Layout](https://design.digital.go.jp/dads/foundations/layout/),
and [Apple Layout](https://developer.apple.com/design/human-interface-guidelines/layout).

The systems cluster meaningful intermediate transitions between approximately
`600px` and `768px`, and wide transitions between approximately `992px` and
`1056px`, but they disagree on exact values. Their transferable convergence is that
page alignment may use stable tiers while nested components recompose from their own
available container space. Framework numbers therefore remain comparison evidence,
not the reason for NosLog's values.

Current-browser inspection at `320`, `390`, `479`, `600`, `768`, `900`, `1024`,
`1280`, and `1440 CSS px` found that the implemented Home, Music discovery,
Rankings, and Music Detail user shell stops growing at approximately `390px` from
`479px` upward. Page titles and internal compositions also remain effectively
unchanged at wide viewports. This is observed failure evidence, not 2.0 layout
authority: the current breakpoints do not reveal a usable transition threshold.

NosLog's approved margins and gutters produce the following entry geometry:

| Entry canvas         | Calculation                  | Logical track width |
| -------------------- | ---------------------------- | ------------------- |
| `320px`, 4 columns   | `(320 − 2×16 − 3×12) ÷ 4`    | `63px`              |
| `672px`, 8 columns   | `(672 − 2×24 − 7×16) ÷ 8`    | `64px`              |
| `1056px`, 12 columns | `(1056 − 2×32 − 11×16) ÷ 12` | `68px`              |

The resulting `63→64→68px` track continuity supplies a NosLog-specific measured
reason for the two thresholds. The approved contract is:

1. A page-layout query container below `672 CSS px` uses the four-column alignment
   model.
2. At `672 CSS px` through `1055 CSS px`, it uses the eight-column alignment model.
3. At `1056 CSS px` and above, it uses the twelve-column alignment model.
4. The query subject is the available page-layout canvas before its internal page
   margins, not a device name. A bounded workspace main region or other governed
   nested layout queries its own available inline size rather than the physical
   display or browser width.
5. These values switch shared page alignment only. They do not automatically change
   card count, row anatomy, pane count, filter arrangement, or any component shape.
   Components must use their separately measured content-failure point and, when
   nested, a container query.
6. The `reading` container remains capped at `768px`, so it never becomes a
   twelve-column reading surface merely because the browser is wide.
7. Browser zoom and window tiling naturally reduce the query-container size and may
   return a composition to a lower tier without loss of information or function.

#### Approved wide `page-title` activation

The default `page-title` remains proportional `24/32 · 700`. It steps to proportional
`32/40 · 700` only when all of the following are true:

1. the owning page-layout query container is in the twelve-column tier at
   `1056 CSS px` or wider;
2. the title text region either spans at least eight of the twelve alignment tracks
   or is another governed title region with at least `640 CSS px` of measured inline
   space; and
3. the title is not inside a `reading` composition.

At the twelve-column entry canvas, eight tracks plus seven gutters provide
approximately `656px`, which satisfies the measured title-space condition. A title
region reduced to six tracks provides only about `488px` and therefore retains the
default `24/32 · 700` composite even on a wide browser. Focused Music and other entity
titles inherit the same rule. Long titles may wrap; this decision does not impose a
maximum line count, truncation, or a one-line requirement.

The repository's
[NOSTALGIA Music source data](../../prisma/data/nosdata-musics.json) contains original
titles up to approximately 54 characters, Japanese readings up to 49 characters, and
artists up to 67 characters. Integrated specimens must therefore include real long
Latin, Korean, and Japanese identities rather than short placeholder headings.

Threshold verification must include `671/672/673` and `1055/1056/1057 CSS px` in
addition to `320`, representative `390`, `479`, `480`, `768`, `1024`, `1280`, and
`1440 CSS px`; it must also cover `200%` browser zoom, Korean/Japanese/English long
content, safe areas, and workspace-panel changes. Passing one `390px` canvas or one
desktop viewport does not validate the contract.

The container and grid model is governed as follows:

1. Maximum width is a ceiling, not a fixed canvas. Every class remains fluid below its
   maximum and must preserve the approved smaller-width page margins and reflow rules.
2. `reading` constrains sustained prose independently from its shell. Forms, summaries,
   and contextual controls may use the `768px` shell while paragraphs remain at or
   below `68ex`; authors must not stretch prose merely to occupy desktop space.
3. `standard` is the default application container for ordinary discovery and task
   completion. It does not make every section three columns or require all child
   components to fill the full `1280px`.
4. `wide` is reserved for tasks that materially benefit from simultaneous comparison,
   analysis, ranking context, maps, or profile evidence. It is not a prestige variant
   for visually enlarging an otherwise standard page.
5. `workspace` uses available width for domain canvas and adjustable tools. Its lack of
   a fixed maximum does not permit ordinary text, controls, or inspectors to become
   unbounded; those subregions retain their own readable or component constraints.
6. At a wide viewport, a `reading` region may remain on an eight-column internal
   alignment while `standard`, `wide`, and `workspace` compositions may use the
   twelve-column page model. At compact widths, all ordinary page content returns to
   the approved four-column alignment contract.
7. Grid columns are alignment tracks, not a mandate for the visible number of cards,
   panels, or content columns. Collection column counts follow approved minimum item
   width, content length, and task requirements.
8. The approved `672px` and `1056px` transitions must be implemented against the
   page-layout query container and verified at the adjacent boundary widths above.
   Framework breakpoints, device labels, or an illustrative comparison canvas do not
   replace those checks.
9. The approved wide `page-title` substitution requires both the twelve-column tier
   and the measured title-region condition above. Container name or desktop-browser
   detection alone is insufficient.
10. This approval does not set component padding, panel ratios, card counts, sidebar
    presence, resizable-tool dimensions, target sizes, or final screen composition.

### Approved density and target-geometry contract

The density and target comparison covered official accessibility criteria, platform
guidance, product systems, dense professional interfaces, rhythm-game discovery, and
current NosLog evidence. The primary sources included
[WCAG 2.2 Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum),
[WCAG Target Size Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced),
[Apple Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility),
[Apple Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons),
[Android View Accessibility](https://developer.android.com/guide/topics/ui/accessibility/views/apps-views),
[Android Mobile Accessibility](https://developer.android.com/design/ui/mobile/guides/foundations/accessibility),
[Fluent 2 Layout](https://fluent2.microsoft.design/layout),
[Japan Digital Agency Button](https://design.digital.go.jp/dads/components/button/),
[Japan Digital Agency Button Accessibility](https://design.digital.go.jp/dads/components/button/accessibility/),
[USWDS Search Accessibility Tests](https://designsystem.digital.gov/components/search/accessibility-tests/),
[Adobe Spectrum Platform Scale](https://spectrum.adobe.com/page/platform-scale/),
[Adobe Spectrum Button](https://spectrum.adobe.com/page/button/),
[Carbon Button Style](https://carbondesignsystem.com/components/button/style/),
[Carbon Button Usage](https://carbondesignsystem.com/components/button/usage/),
[Primer Size Primitives](https://primer.style/product/primitives/size/),
[Ant Design Theme Tokens](https://ant.design/docs/react/customize-theme/),
[SAP Fiori Content Density](https://experience.sap.com/fiori-design-web/cozy-compact/),
[osu! beatmap filter guidance](https://osu.ppy.sh/wiki/en/Beatmap/Genre_and_language),
and [V-ARCHIVE grade guidance](https://v-archive.net/info/manual/grade).

The standards distinguish a conformance floor from a comfortable operating target.
WCAG establishes a `24 × 24 CSS px` Level AA minimum with defined exceptions and a
`44 × 44 CSS px` enhanced target. Apple, Android, Fluent, the Japan Digital Agency,
and USWDS converge around `44–48px` for touch-oriented interaction. Spectrum explicitly
separates visible control geometry from cursor and touch hit areas. Carbon, Primer,
Ant Design, and SAP separately demonstrate that `32px`, `40px`, and `44–48px` controls
can support compact, ordinary, and touch-oriented product contexts without exposing an
arbitrary continuum of local heights.

Current NosLog evidence reinforces the need for a constrained contract rather than a
global enlargement rule. The shared
[`Button`](../../components/ui/Button.tsx) already uses `32px`, `40px`, and `48px`,
while route-local controls repeat `24px`, `28px`, `36px`, and `44px` heights. Browser
inspection found approximately `22px` sort and view targets in Music discovery,
alongside `32px`, `40px`, and `44px` controls in the same user shell. These measurements
are observations of the current product, not approved 2.0 geometry. Rhythm-game
references confirm the need for dense filters and comparison surfaces, but do not
justify shrinking the entire public interface or transferring their visual treatment.

#### Shared visible control-height steps

| Step          | Visible height | Approved use boundary                                                                                                                                                    |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Compact`     | `32px`         | Repeated controls in an explicitly approved dense data region, Rankings comparison, Viewer toolbar, or Editor workspace; never the ordinary touch-first page default     |
| `Standard`    | `40px`         | Default visible height for ordinary public and authenticated application controls                                                                                        |
| `Comfortable` | `48px`         | Prominent mobile actions, Search and other high-frequency touch controls, and important sequential, confirmatory, destructive, or otherwise error-sensitive interactions |

These labels are Foundation role names, not final implementation-token names. The
implementation mapping may adopt code-convention-compatible names later, but it must
preserve the three values and their role boundaries.

#### Effective target contract

1. `44px` is an effective interaction-target contract, not a fourth shared visible
   control-height token. A `40px` visible control ordinarily occupies or receives at
   least a `44 × 44px` effective target.
2. An authored interactive target must never fall below the WCAG `24 × 24 CSS px`
   Level AA floor unless a documented WCAG exception genuinely applies. The spacing
   exception is not a routine method for retaining undersized repeated controls.
3. Ordinary public and authenticated controls use at least a `44 × 44px` effective
   target. `48px` remains the preferred visible and effective size for prominent,
   frequent, sequential, destructive, or error-sensitive touch actions when the
   composition can support it.
4. A `32px` visible Compact control exposed to coarse-pointer or touch operation must
   use layout spacing, a wrapper, or non-overlapping hit-area expansion to reach at
   least `44 × 44px`. Expanded targets must not overlap or make adjacent actions
   ambiguous.
5. A specialized Viewer or Editor workspace may use a `32 × 32px` effective target
   only as a governed fine-pointer exception. The region must still satisfy the WCAG
   minimum and target-spacing contract, provide visible keyboard focus and an
   equivalent keyboard or alternate operation, and switch to a `44px` target or a
   Standard/Comfortable presentation for coarse-pointer use.
6. The fine-pointer exception is prohibited for primary, destructive, difficult-to-
   reverse, high-frequency sequential, or safety-critical actions. Viewport width
   alone must not be used as evidence that a fine pointer is present.
7. Visible label typography follows the approved semantic `control-label` role. A
   smaller target or type size must not be introduced merely to keep one row from
   wrapping; the composition must reflow, group, or disclose secondary controls.

#### Density governance

1. Density is assigned by product task and bounded region, not by arbitrary page-local
   preference. Peer controls in one group use one visible-height step unless a
   separately documented hierarchy requires a different treatment.
2. Mobile-first does not mean every visible control is `48px`. Ordinary controls may
   remain visually `40px`, and visually compact controls may remain `32px`, while the
   effective touch target and spacing contract is preserved.
3. Foundation v0.1 does not provide a global user-facing density preference. An
   approved view-specific presentation choice may remain when it changes an actual
   content task, such as an explicitly approved compact/detailed collection view; it
   must not become an unrestricted application-wide Compact switch.
4. `24px`, `28px`, `36px`, and `44px` are not shared visible control-height steps.
   `44px` belongs to target geometry. Current `28px` and `36px` Editor controls remain
   implementation evidence until the later user-facing Editor mapping either adopts
   `32/40/48px` or registers a measured specialized exception.
5. This decision does not redesign or immediately migrate the current application. It
   defines the authoritative geometry for downstream Claude Design work and the later
   NosLog 2.0 implementation session.

#### Validation contract

- Validate the three visible steps and effective targets in the integrated `S1`–`S6`
  Korean, Japanese, English, and mixed-script specimens at `320px`, representative
  `390px`, measured intermediate widths, and wide desktop compositions.
- Inspect target rectangles rather than inferring usability from visible button
  bounds. Verify that expanded targets do not overlap and that adjacent actions remain
  distinguishable at zoom and with text-spacing overrides.
- Test keyboard order, visible focus, coarse and fine pointers, hybrid input, and
  `200%` text resize. A pointer media query alone is not proof that the physical device
  supports only one input method.
- Treat the current `22–48px` range as migration evidence. Foundation promotion must
  demonstrate that representative discovery, ranking, Viewer, and Editor compositions
  can use the approved contract without hiding a high-frequency action or creating
  two-dimensional overflow on an ordinary page.

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
| Give every semantic role an independent physical composite                   | `Rejected` | It mistakes semantic precision for visual variety and recreates the local-style drift the Foundation is intended to prevent                                                              |
| Make `page-title` use `32/40 · 700` by default                               | `Rejected` | It overstates routine page identity on compact screens and consumes the dominant step needed for major quantitative results                                                              |
| Keep `page-title` at `24/32 · 700` in every composition                      | `Rejected` | It maximizes consistency but can understate page identity when NosLog intentionally recomposes into a wide desktop workspace                                                             |
| Fluidly interpolate `page-title` between `24px` and `32px`                   | `Rejected` | It creates unapproved intermediate values, continuous multilingual wrapping variation, and a broader QA surface without a product-task benefit                                           |
| Enlarge body, metadata, controls, or repeated entity titles on wide screens  | `Rejected` | It spends desktop space on global magnification instead of comparison and analysis, and makes dense product hierarchy unstable                                                           |
| Use `20/28 · 600` for every `entity-title`                                   | `Rejected` | It would over-expand repeated discovery, ranking, and archive surfaces; focused entities already receive the governed `page-title` precedence                                            |
| Reduce `entity-companion` to `12/16 · 400`                                   | `Rejected` | Localized/read identity remains useful content rather than tertiary metadata and must stay legible in Korean, Japanese, English, and mixed-script results                                |
| Use one composite for both action labels and entered field values            | `Rejected` | The jobs differ: compact medium-weight labels signal interaction, while entered or selected content benefits from ordinary readable body treatment                                       |
| Use `40/48 · 700` for dominant metrics                                       | `Rejected` | It would collapse the boundary between a rare expressive display moment and the bounded quantitative hierarchy provided by `metric-display` at `32/40 · 700`                             |
| Style metric values with heading roles                                       | `Rejected` | Metrics need tabular alignment, explicit labels and units, and stable comparison behavior rather than document-heading semantics                                                         |
| Expose the full large ramps from Spectrum, Fluent, or a marketing system     | `Rejected` | NosLog is a dense product surface; additional `40/80/96px` choices increase local author discretion before a representative composition proves a missing relationship                    |
| Use a strict eight-pixel scale without `4px` or `12px`                       | `Rejected` | It removes useful compact CJK and control relationships and would force optical or dense component needs into arbitrary exceptions                                                       |
| Treat `2px` as an ordinary layout step                                       | `Rejected` | It would create imperceptible hierarchy differences and recreate the current proliferation of page-local micro-spacing                                                                   |
| Reduce compact page margins to `12px` or a viewport percentage               | `Rejected` | The small width gain weakens stable edge rhythm and safe-area behavior; NosLog must solve fit through reflow rather than margin erosion                                                  |
| Use `16px` compact gutters by default                                        | `Rejected` | It remains viable but gives up useful square-card and CJK control width without a stronger hierarchy benefit than the convergent `12px` gutter                                           |
| Treat the compact four-column contract as four visible content columns       | `Rejected` | It mistakes an alignment system for content density and would produce unreadable repeated regions on narrow screens                                                                      |
| Make `480px` the automatic next composition breakpoint                       | `Rejected` | The reference ranges are validation evidence, not proof that NosLog content needs to recompose at that exact viewport width                                                              |
| Use one maximum width for every NosLog page                                  | `Rejected` | Reading, discovery, comparison, mapping, and chart-editing tasks have materially different horizontal-space needs                                                                        |
| Let every desktop page expand without a maximum                              | `Rejected` | It degrades prose measure and relationship clarity while recreating the current stretched-mobile-column problem                                                                          |
| Allow each page to choose an arbitrary local maximum width                   | `Rejected` | It would reproduce inconsistent keylines and page-specific layout drift instead of a governed reusable system                                                                            |
| Treat `768px`, `1280px`, or `1440px` as fixed canvases                       | `Rejected` | The values are ceilings; fixed canvases would conflict with mobile-first reflow, intermediate widths, safe areas, and zoom                                                               |
| Copy framework breakpoints as the 4-to-8 and 8-to-12 transitions             | `Rejected` | Framework defaults do not prove where NosLog's multilingual content, controls, or domain visualizations require recomposition                                                            |
| Use conventional `640px` and `1024px` values without NosLog geometry         | `Rejected` | They are viable reference clusters but do not preserve the approved page-margin, gutter, and logical-track geometry as consistently as the measured `672px` and `1056px` entries         |
| Delay the shared grid transitions to `768px` and `1280px`                    | `Rejected` | It leaves useful intermediate and comparison space underused and creates disproportionately wide logical tracks before each transition                                                   |
| Make every component recompose at the shared page-grid thresholds            | `Rejected` | Page alignment and component anatomy solve different constraints; nested cards, filters, panes, and tools must respond to their own measured container failures                          |
| Activate the wide `page-title` from browser width or container class alone   | `Rejected` | A wide browser can still provide a narrow title region because of actions, media, side panes, zoom, or window tiling; the title needs its approved measured space                        |
| Use `workspace` merely to make a standard page feel more spacious            | `Rejected` | The unbounded class is justified only by meaning-dependent canvas, visualization, and adjustable-tool tasks                                                                              |
| Use one universal `48px` visible height for every control                    | `Rejected` | Protects touch operation but unnecessarily expands dense comparison and professional-tool regions; the target contract can protect touch without making every visible control identical  |
| Preserve every current `22–48px` local control height                        | `Rejected` | Retains accidental page-specific drift, leaves undersized targets, and prevents reusable component mapping                                                                               |
| Add `44px` as a fourth shared visible control height                         | `Rejected` | Confuses touch-target geometry with visual component hierarchy and expands author choice without a distinct product role                                                                 |
| Make Compact density the mobile default                                      | `Rejected` | Reclaims space by weakening touch operation and repeats the current tendency to solve fit through small controls instead of reflow and hierarchy                                         |
| Provide an unrestricted global density preference in Foundation v0.1         | `Rejected` | Multiplies responsive, localization, accessibility, and QA states before a cross-product user need has been established                                                                  |
| Permit overlapping invisible hit areas around adjacent Compact controls      | `Rejected` | Creates ambiguous activation even when each nominal rectangle is large enough                                                                                                            |
| Treat viewport width as proof of mouse or touch input                        | `Rejected` | Fails hybrid devices and confuses available layout space with actual input capability                                                                                                    |

## Decision Log

| ID        | Decision                                                                                                                                                                                                                                                                                                                                                                              | Status     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `FTL-01`  | Use `12px`, `14px`, and `16px` as the shared lower physical type core with the role boundaries and responsive constraints above                                                                                                                                                                                                                                                       | `Approved` |
| `FTL-02`  | Use `16px`, `20px`, and `24px` as the lower line-height primitives, defaulting to `12/16`, `14/20`, and `16/24`, subject to the validation constraints above                                                                                                                                                                                                                          | `Approved` |
| `FTL-03`  | Use only `400`, `500`, `600`, and `700` as shared weight primitives with the semantic, frequency, responsive, and validation constraints above                                                                                                                                                                                                                                        | `Approved` |
| `FTL-04`  | Use natural/default spacing for every shared UI role, keep kerning enabled, expose no positive or negative shared tracking token, and govern rare exceptions explicitly                                                                                                                                                                                                               | `Approved` |
| `FTL-05`  | Use `20px`, `24px`, and `32px` as the ordinary upper core and gate `40px` to a separately approved composite; the final map assigns it only to `display`                                                                                                                                                                                                                              | `Approved` |
| `FTL-06`  | Use `28px`, `32px`, `40px`, and `48px` as upper line-height primitives, defaulting to `20/28`, `24/32`, `32/40`, and `40/48`, with the boundaries above                                                                                                                                                                                                                               | `Approved` |
| `FTL-07`  | Map the twelve semantic roles to the nine approved composites above, including focused-entity and field-value precedence, metric tabular figures, and the display gate                                                                                                                                                                                                                | `Approved` |
| `FTL-08`  | Select spacing, grid, container, density, target geometry, and measured responsive-transition values                                                                                                                                                                                                                                                                                  | `Approved` |
| `FTL-08A` | Use `0/2/4/8/12/16/24/32/48/64px` as the constrained spacing primitive axis, reserve `2px` for governed optical or specialized-visualization correction, require semantic roles, and prohibit arbitrary shared application spacing                                                                                                                                                    | `Approved` |
| `FTL-08B` | Use a compact `320–479 CSS px` validation contract with a `16px` safe-aware inline page margin, four equal logical columns, and `12px` gutters; preserve ordinary no-horizontal-overflow reflow and do not infer a `480px` transition breakpoint                                                                                                                                      | `Approved` |
| `FTL-08C` | Use `reading`, `standard`, `wide`, and `workspace` container classes with respective `768px`, `1280px`, `1440px`, and fluid maximum behavior; use 4/8/12-column compact/intermediate/wide alignment models with `12/16/16px` gutters and `16/24/32px` safe-aware margins                                                                                                              | `Approved` |
| `FTL-08D` | Use `32/40/48px` as the constrained Compact/Standard/Comfortable visible control-height steps; treat `44px` as the ordinary effective target contract rather than a fourth visible step; permit `32px` effective targets only as governed fine-pointer Viewer/Editor exceptions; and provide no unrestricted global density preference                                                | `Approved` |
| `FTL-08E` | Activate the shared 8-column alignment at a `672 CSS px` page-layout query container and the 12-column alignment at `1056 CSS px`; keep component recomposition on separately measured container failures; activate wide `page-title` only in the 12-column tier when its text region spans at least eight tracks or measures at least `640 CSS px`, excluding `reading` compositions | `Approved` |
| `FTL-09`  | Keep every role fixed across widths except `page-title`, which steps from `24/32 · 700` to proportional `32/40 · 700` only under the `FTL-08E` twelve-column and measured-title-region conditions; prohibit fluid interpolation                                                                                                                                                       | `Approved` |

## Next Approval Gate

The next bounded gate is integrated `S1`–`S6` multilingual specimen validation of the
approved typography and layout contracts, including the adjacent transition widths,
`320 CSS px` reflow, `200%` zoom, safe areas, long real content, control targets, and
workspace-panel changes. Passing this gate may refine component-specific failure
points but must not silently change `FTL-08E`, approve maximum line counts,
truncation, color, material, panel ratios, or final component layout. Any conflict
must return to the user as an explicit revision decision before Foundation v0.1
promotion.
