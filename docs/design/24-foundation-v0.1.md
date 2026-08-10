# NosLog 2.0 Foundation v0.1

## Document control

- Status: `Approved — Foundation v0.1 normative authority`
- Language: English
- Last updated: 2026-08-11
- Scope: default Foundation for eligible ordinary NosLog 2.0 UI
- Provenance and decision history:
  [document 25](./25-foundation-v0.1-provenance.md)
- Current promotion gate:
  [document 63](./63-foundation-v0.1-reusable-ui-regression.md)
- Excluded: the complete chart viewer/editor, final high-fidelity composition,
  production implementation, and final logo drawing

This is the single normative source for approved Foundation values and role contracts.
Do not reconstruct tokens from old comparison documents, specimens, Tailwind defaults,
or Git history.

## Scope and source rules

1. Neutral hierarchy is the default. Chroma appears only for an approved semantic or
   domain role.
2. Use exact published values and mappings from the selected source. Do not mix,
   interpolate, shift, or create a “NosLog-like” replacement.
3. A source approval does not imply a component alias. A primitive, role mapping,
   component alias, and implementation are distinct gates.
4. Tailwind CSS may implement approved values and responsive behavior. Its defaults are
   not source values.
5. The entire chart viewer/editor remains unchanged under
   [document 07](./07-chart-viewer-editor-preservation.md). Nothing below applies
   inside it.

## Typography

### Family and language behavior

- Primary family: `Pretendard JP Variable`, with the official Pretendard JP fallback
  order.
- Keep kerning and the typeface's natural tracking. Shared roles add no default
  letter-spacing.
- Apply the approved Korean glyph feature `ss05` only inside `lang="ko"`; do not force
  it onto Japanese or English.
- Delivery uses the official Pretendard JP `1.3.9` variable dynamic-subset CSS and
  referenced WOFF2 slices, version-pinned and first-party self-hosted on the NosLog
  origin. Preserve the upstream font data, license, `font-display: swap`, and official
  fallback order; only asset URLs may be repackaged for the same origin.
- Do not preload the complete `5.35 MB` variable file. A critical slice may be
  preloaded only after later performance evidence justifies it.
- The current bundled standard Pretendard file does not satisfy this family and stays
  only until the future implementation migration passes multilingual and fallback
  verification.

### Physical core

- Size primitives: `12`, `14`, `16`, `20`, `24`, and `32px`, plus gated `40px`.
- Line-height primitives: `16`, `20`, `24`, `28`, `32`, `40`, and `48px`.
- Weights: `regular 400`, `medium 500`, `semibold 600`, `bold 700`.
- Shared user-facing HTML text never resolves below `12px`.
- Do not use shared weights `100–300`, `800–900`, or unnamed intermediate values.

### Semantic composites

| Role               | Composite     | Figures      | Boundary                                                                         |
| ------------------ | ------------- | ------------ | -------------------------------------------------------------------------------- |
| `display`          | `40/48 · 700` | Proportional | Rare, short, separately approved expressive moment; no automatic page assignment |
| `page-title`       | `24/32 · 700` | Proportional | Compact/default page or focused-task identity                                    |
| `section-title`    | `20/28 · 600` | Proportional | Real major content boundary, not a decorative card label                         |
| `component-title`  | `16/24 · 600` | Proportional | Dialog, drawer, panel, or grouped-module identity                                |
| `entity-title`     | `16/24 · 600` | Proportional | Ordinary list/card entity identity                                               |
| `entity-companion` | `14/20 · 400` | Proportional | Optional localized/read identity in the approved Music Detail popover            |
| `body`             | `16/24 · 400` | Proportional | Ordinary reading, explanation, and system-message copy                           |
| `body-secondary`   | `14/20 · 400` | Proportional | Concise supporting context, never the only critical meaning                      |
| `control`          | `14/20 · 500` | Proportional | Visible action, choice, field-label, or navigation label                         |
| `metadata`         | `12/16 · 400` | Proportional | Short genuinely tertiary fact only                                               |
| `metric-display`   | `32/40 · 700` | Tabular      | One dominant quantitative result with visible label, unit, and scope             |
| `metric-value`     | `14/20 · 500` | Tabular      | Comparable quantitative value in a row, group, or visualization                  |

Focused entities use `page-title` while retaining correct HTML heading semantics.
Entered and selected field values use `body`, while the label/action uses `control`.
Only metric roles enable tabular figures by default.

At a twelve-column page-layout container of at least `1056 CSS px`, `page-title` may
step to `32/40 · 700` only when its governed region spans at least eight tracks or has
at least `640 CSS px` of measured inline space and is not a `reading` composition.
There is no fluid interpolation, locale-specific size, or page-local title size.

## Spacing, grid, and containers

### Spacing primitives

| Value  | Role boundary                                                                          |
| ------ | -------------------------------------------------------------------------------------- |
| `0px`  | Intentional absence of space                                                           |
| `2px`  | Documented optical correction inside an icon, badge, or specialized visualization only |
| `4px`  | Internally inseparable details                                                         |
| `8px`  | Inline peers and tightly related controls                                              |
| `12px` | Compact component inset and dense control groups                                       |
| `16px` | Default component inset and related content blocks                                     |
| `24px` | Subsection separation                                                                  |
| `32px` | Section separation                                                                     |
| `48px` | Major page-region separation                                                           |
| `64px` | Rare large page boundary with a proven hierarchy need                                  |

Do not use `2px` for ordinary layout spacing. Do not introduce arbitrary local values
or use `48/64px` merely to make a sparse surface appear premium.

### Page alignment

| Tier         | Query-container width | Columns | Gutter |   Minimum inline margin |
| ------------ | --------------------- | ------: | -----: | ----------------------: |
| Compact      | below `672px`         |       4 | `12px` | `16px`, safe-area aware |
| Intermediate | `672–1055px`          |       8 | `16px` | `24px`, safe-area aware |
| Wide         | `1056px+`             |      12 | `16px` | `32px`, safe-area aware |

Use the available page-layout query container, not a device name. The compact
validation contract covers `320–479 CSS px`; `390px` is representative only. At
`320px` the `16px` margins remain intact and ordinary content reflows without
page-level horizontal scrolling.

| Container   | Maximum / measure                                | Default task family                                                          |
| ----------- | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| `reading`   | `768px` shell; continuous prose capped at `68ex` | Guidance, policy, onboarding, settings/help                                  |
| `standard`  | `1280px`                                         | Home, discovery, Tiers, Bingo, Exams                                         |
| `wide`      | `1440px`                                         | Music analysis, Rankings, Profile, Arcade                                    |
| `workspace` | Fluid inside approved margins                    | Ordinary administrative or meaning-dependent professional visualization only |

Container maximums are ceilings, never fixed canvases. Component recomposition uses
its own measured failure point and a container query when nested.

## Neutral color — Adobe Spectrum S2

Adobe Spectrum S2 is the exclusive neutral primitive and semantic source. Use the
published exact values below.

### Surfaces — `M-A`

| Role      | Light          | Dark           | Contract                                                                             |
| --------- | -------------- | -------------- | ------------------------------------------------------------------------------------ |
| `canvas`  | `#FFFFFF`      | `#111111`      | Page and shell baseline                                                              |
| `surface` | `#F8F8F8`      | `#1B1B1B`      | Flat grouped content; ordinary cards remain unraised                                 |
| `sunken`  | `#E9E9E9`      | `#111111`      | An intentionally receding ordinary data or work well                                 |
| `raised`  | `#FFFFFF`      | `#222222`      | Content with real lift, movement, overlap, or justified emphasis                     |
| `overlay` | `#FFFFFF`      | `#222222`      | Menu, popover, tooltip, sheet, dialog; placement/boundary also communicates stacking |
| `scrim`   | black at `40%` | black at `60%` | Modal background suppression only                                                    |

### Foregrounds — `F-A`

| Role                          | Light     | Dark      | Contract                                                       |
| ----------------------------- | --------- | --------- | -------------------------------------------------------------- |
| `content-default`             | `#292929` | `#DBDBDB` | Headings, body, primary icons, important labels/values         |
| `content-subdued`             | `#505050` | `#AFAFAF` | Metadata, helpers, timestamps, secondary icons                 |
| `content-interactive`         | `#131313` | `#F2F2F2` | Default interactive content during hover/pressed/content-focus |
| `content-subdued-interactive` | `#292929` | `#DBDBDB` | Subdued interaction during hover/pressed/focus/selected        |
| `content-disabled`            | `#C6C6C6` | `#444444` | Genuinely unavailable nonessential content only                |

Static headings remain `content-default`; do not use the higher state value for
decorative emphasis. Disabled information needs an available explanation elsewhere.

### Neutral boundaries — `NB-A`

| Role             | Light     | Dark      | Contract                                                                                  |
| ---------------- | --------- | --------- | ----------------------------------------------------------------------------------------- |
| `divider`        | `#E1E1E1` | `#323232` | Decorative rhythm only                                                                    |
| `border-subtle`  | `#DADADA` | `#393939` | Nonessential framing and disabled boundary                                                |
| `border-default` | `#C6C6C6` | `#444444` | Ordinary edge when another cue already identifies the object                              |
| `border-strong`  | `#717171` | `#8A8A8A` | Necessary neutral control or graphic boundary that must independently remain identifiable |

The quiet roles are intentionally below `3:1` on some surfaces and must never become
the sole necessary cue. Do not outline every Dark container or selected row.

### Neutral interaction — `NI-A`

There is no universal neutral hover, pressed, or selected fill. Preserve the approved
Spectrum component-family recipes:

| Family state                                    | Light     | Dark      |
| ----------------------------------------------- | --------- | --------- |
| Stack/Tree hover or neutral selected            | `#E9E9E9` | `#2C2C2C` |
| Stack selected hover / equivalent keyboard fill | `#E1E1E1` | `#323232` |
| Stack selected pressed                          | `#DADADA` | `#393939` |
| Menu state set                                  | `#E9E9E9` | `#323232` |
| Disabled background                             | `#E9E9E9` | `#2C2C2C` |
| Disabled border                                 | `#DADADA` | `#393939` |
| Disabled content                                | `#C6C6C6` | `#444444` |

Selection requires programmatic state plus a persistent non-fill cue such as a
checkmark, current indicator, or explicit label. Hover and selection do not add a
white Dark-theme outline or automatically promote to `border-strong`.

### Keyboard focus — `FI-C`, Fluent 2

- Light focus color: `#000000`.
- Dark focus color: `#FFFFFF`.
- Width: `2px`.
- Geometry: zero-gap perimeter rendered outside the focused object with a
  pseudo-element extent of `-2px`.
- Show only for keyboard-visible focus; pointer focus does not leave a persistent
  outline.
- Do not recolor the component, selection, identity, or semantic state.
- In forced colors, use the system `Highlight` color and preserve a visible perimeter.
- Prevent clipping at scroll, rounded, sticky, and frame boundaries.

## Identity and primary action

### Signature source and shell identity

- `SS-08 · Radix Colors Indigo` is the approved reserved signature source.
- It currently has **no approved ordinary-UI, shell, logo, navigation, selection, or
  action alias**. Do not invent a placement merely because the source was selected.
- `ITA-C · Achromatic` is the approved shell identity alias: graphical NosLog mark and
  visible wordmark use `content-default` for the active appearance on a transparent
  field. No default white outline or Indigo field is allowed.

### Filled primary action — `RPA-A`

Use at most one proven non-destructive internal primary action per page, bounded
region, or temporary flow; many views need none.

| Appearance | Default   | Hover / pressed | Foreground |
| ---------- | --------- | --------------- | ---------- |
| Light      | `#292929` | `#131313`       | `#FFFFFF`  |
| Dark       | `#DBDBDB` | `#F2F2F2`       | `#111111`  |

Ordinary actions, navigation, links, tools, and equal-priority choices remain lower
neutral hierarchy. External-brand and destructive actions use their own semantics.
Radix has no filled-action alias.

## Material geometry — `MG-A`, Adobe Spectrum S2

| Role                | Exact approved source alias/value                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `radius-control`    | `corner-radius-small-default` → `4px`                                                                                                 |
| `radius-container`  | `corner-radius-medium-default` → `8px`                                                                                                |
| `radius-overlay`    | `corner-radius-large-default` → `10px`                                                                                                |
| `radius-full`       | `corner-radius-full` → `50%` of the relevant box                                                                                      |
| `elevation-raised`  | `drop-shadow-emphasized`: `0 2px 8px` ambient + `0 1px 4px` transition + `0 0 1px` key                                                |
| `elevation-overlay` | `drop-shadow-elevated`: `0 4px 12px` ambient + `0 2px 6px` transition + `0 0 2px` key                                                 |
| `elevation-dragged` | `drop-shadow-dragged`: `0 12px 16px` ambient + `0 6px 8px` transition + `0 0 6px` key                                                 |
| Shadow colors       | Use the exact appearance-specific published alias; ambient Light/Dark `.08/.24`, transition `.04/.12`, and source-defined key opacity |
| `scrim`             | Black at Light `0.4`, Dark `0.6`                                                                                                      |

Flat `canvas`, `surface`, and `sunken` have no default shadow. Dark depth needs surface
or boundary support in addition to shadow. Directional scroll boundaries retain the
approved `1px` boundary and add no invented fourth shadow. Full rounding is a shape
contract, not the default for buttons or containers.

## Feedback and status — `FS-BN`

Atlassian owns semantic chroma; Spectrum owns message-container title/body typography.

| Role        | Light background / marker | Dark background / marker |
| ----------- | ------------------------- | ------------------------ |
| Information | `#E9F2FE / #357DE8`       | `#1C2B42 / #4688EC`      |
| Success     | `#EFFFD6 / #6A9A23`       | `#28311B / #82B536`      |
| Warning     | `#FFF5DB / #E06C00`       | `#3A2C1F / #FBC828`      |
| Danger      | `#FFECEB / #C9372C`       | `#42221F / #F15B50`      |

Message title/body use `#292929/#DBDBDB`. Field-error and destructive text use
Atlassian danger text `#AE2E24/#FD9891`; invalid/destructive boundary uses
`#C9372C/#F15B50`. Every state retains explicit title, copy, symbol/shape, and
programmatic semantics. Carbon contributed only the restraint observation; no Carbon
color is part of the mapping.

## Difficulty markers — `DU-01`, Adobe Spectrum S2

| Role   | Light     | Dark      |
| ------ | --------- | --------- |
| Normal | `#0BA45D` | `#068850` |
| Hard   | `#E86A00` | `#E06400` |
| Expert | `#F03823` | `#CD2E1D` |
| Real   | `#A65CE7` | `#AD69E9` |

These colors appear only on compact persistent difficulty markers in eligible
repeated-scanning ordinary DOM UI. Names, levels, order, and pattern/selected cues
remain visible. Do not color difficulty text, backgrounds, containers, selection,
focus, feedback, or actions.

## Local data color — `LD-03`, SAP Fiori Horizon

Use exact `sap_horizon` / `sap_horizon_dark` chart tokens.

| Role                      | Light                                                            | Dark                                                             |
| ------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Single series             | `#168EFF`                                                        | `#3278BE`                                                        |
| Score buckets, low → high | `#62B3FF`, `#3FA2FF`, `#168EFF`, `#0074E2`, `#0065C3`, `#0055A5` | `#1D456D`, `#275E96`, `#3278BE`, `#5291D1`, `#7AABDC`, `#A2C4E7` |
| FAST / SLOW               | `#168EFF / #C87B00`                                              | `#3278BE / #F2A634`                                              |
| Generic categorical 1–5   | `#168EFF`, `#C87B00`, `#75980B`, `#DF1278`, `#8B47D7`            | `#3278BE`, `#F2A634`, `#B4CE35`, `#FA4F96`, `#8B47D7`            |

Score buckets retain number, label, and fixed order. FAST/SLOW retain direct labels,
solid/circle versus dashed/square treatment, and are never good/bad semantics. Numeric
thresholds remain neutral unless separately promoted to feedback meaning. The narrower
judgement mapping below supersedes SAP only for `judgement.*`.

## Judgement markers — `JD-02`, Radix Colors 3.0.0

| Role   | Light             | Dark      |
| ------ | ----------------- | --------- |
| S-Just | `pink11 #C2298A`  | `#FF8DCC` |
| Just   | `amber11 #AB6400` | `#FFCA16` |
| Good   | `cyan11 #107D98`  | `#4CCCE6` |
| Near   | `blue11 #0D74CE`  | `#70B8FF` |
| Miss   | `gray11 #646464`  | `#B4B4B4` |

The five colors apply only to local judgement markers/bars. Labels, counts,
percentages, surfaces, and containers remain neutral. Radix `gray11` is a
judgement-domain color, not a Foundation neutral. **JD-02 does not own FAST/SLOW**;
that pair remains `LD-03` SAP.

## Iconography — `IC-06`, Lucide

- Use `lucide-react` as the single ordinary-UI icon family and review changed glyphs
  when upgrading the source package.
- Preserve the published `24×24` viewBox, `2px` stroke, round linecaps/linejoins, and
  outline treatment.
- Render routine action/wayfinding glyphs at `20px`. Use `16px` only for compact
  supporting/metadata icons beside a visible label. Reserve `24px` for a proven
  prominent standalone affordance or empty state.
- Primary, unfamiliar, destructive, and low-frequency actions retain visible text.
  Icon-only controls are limited to universally understood contextual actions and
  require an explicit accessible name.
- Mobile icon-only target: at least `44×44px`; eligible desktop target: at least
  `40×40px`.
- Icons inherit the control foreground and never gain signature, status, difficulty,
  judgement, or data color merely for emphasis.
- Decorative icons beside text are hidden from the accessibility tree. Tooltips do
  not replace accessible names or required persistent labels.

## Motion — `MO-02`, Atlassian

| Role                                                  | Duration | Easing / boundary                                                |
| ----------------------------------------------------- | -------: | ---------------------------------------------------------------- |
| Immediate state, focus, error, critical status        |    `0ms` | No delayed semantics                                             |
| Routine high-frequency hover                          |   `50ms` | `out.practical cubic-bezier(.4,1,.6,1)`                          |
| Pressed feedback / quick exit                         |  `100ms` | `out.practical` / `in.practical cubic-bezier(.6,0,.8,.6)`        |
| Persistent selection / small entrance                 |  `150ms` | `out.practical`; popup may use `out.bold cubic-bezier(0,.4,0,1)` |
| Modal or large exit                                   |  `200ms` | `in.practical`                                                   |
| Modal entrance or justified in-place scale/reposition |  `250ms` | `inout.bold cubic-bezier(.4,0,0,1)`                              |
| Proven large ordinary transition ceiling              |  `400ms` | Not a default                                                    |

`600ms`, bounce, stagger, celebration, parallax, and page choreography are unassigned.
Under `prefers-reduced-motion: reduce`, remove nonessential translate/scale/rotate,
parallax, stagger, and auto-scrolling motion rather than slowing it. Apply visible and
programmatic state immediately. Replace spinner motion with a static cue, persistent
localized busy text, and `aria-busy`.

## Ordinary data visualization — `DV-05`, GitHub Primer

1. Provide a visible localized title and enough subtitle context to identify measure,
   dimension, date range, and unit.
2. Show axes and units by default. Compact tick density may reduce; numeric meaning may
   not disappear.
3. Use collision-free direct labels or a persistent legend in plot order. Never hide
   the only legend behind hover.
4. Pointer, keyboard focus, and touch expose the same localized dimension, series,
   exact value, and unit. Arrow keys move points; `Home`/`End` move to series ends.
5. Keep the conclusion and current/latest exact value visible without interaction.
6. Every analytical chart exposes the active same-data semantic table. CSV is optional
   reuse support and never replaces the table.
7. Loading reserves plot geometry and supplies busy text; empty/error/partial states
   name cause and recovery.
8. At `320px`, `390px`, and desktop, legends and toolbars recompose without page-level
   overflow. An inherently wide data table may use a labeled contained scroller.
9. Use `LD-03`, `JD-02`, and `DU-01`; Primer anatomy does not import Primer colors.
10. Personal versus benchmark uses an outlined blue circle with a solid line versus a
    filled orange circle with a dashed line. This does not alter FAST/SLOW's separate
    circle/square contract.

## Foundation acceptance

Eligible ordinary UI must retain all meaning and operation under:

- Light, Dark, and device/System appearance;
- Korean, Japanese, English, mixed script, long real content, and locale formatting;
- `320px`, representative `390px`, intermediate thresholds, wide layouts, zoom, and
  `200%` text resize;
- keyboard, touch, pointer, screen reader, text-spacing override, forced colors,
  reduced motion, and color-disabled conditions;
- loading, empty, partial, error, disabled, permission, and destructive states.

`FPR-03` promoted these contracts together as the approved Foundation v0.1 normative
authority on 2026-08-11. Reusable component and pattern responsibilities remain a
separate `FPR-04` gate in document `63`; they do not reopen this Foundation.
