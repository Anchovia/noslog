# NosLog 2.0 Foundation v0.1

## Document control

- Status: `Approved — Foundation v0.1 normative authority`
- Language: English
- Last updated: 2026-08-14
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
| `emphasis-label`   | `14/20 · 600` | Proportional | Compact message title or persistent selected label in an approved component      |
| `body`             | `16/24 · 400` | Proportional | Ordinary reading, explanation, and system-message copy                           |
| `body-secondary`   | `14/20 · 400` | Proportional | Concise supporting context, never the only critical meaning                      |
| `control`          | `14/20 · 500` | Proportional | Visible action, choice, field-label, or navigation label                         |
| `metadata`         | `12/16 · 400` | Proportional | Short genuinely tertiary fact only                                               |
| `metric-display`   | `32/40 · 700` | Tabular      | One dominant quantitative result with visible label, unit, and scope             |
| `metric-value`     | `14/20 · 500` | Tabular      | Comparable quantitative value in a row, group, or visualization                  |

Focused entities use `page-title` while retaining correct HTML heading semantics.
Entered and selected field values use `body`, while the label/action uses `control`.
Only metric roles enable tabular figures by default.

`emphasis-label` is not a general-purpose bold-body role. Use it only where the
component contract needs a compact non-color distinction, including an approved
selected label or `StatusMessage` title. Ordinary controls remain `control`.

Music Detail has one approved content-fit exception for its `96px` identity row.
Choose the largest composite that keeps the original title, the `4px` title-to-artist
gap, and artist text within the row: `page-title`, then `section-title`, then
`component-title`. Preserve the title's heading semantics, translation trigger, and
full accessible name. This measured ladder is not a locale-specific assignment or
permission to shrink other page titles.

`DestinationPanel` has one separate approved content-fit exception for compact
localized navigation labels. Start with `control` at `14/20`; if the real label does
not fit on one line in its measured cell, step only that label to `12/16` while
preserving its existing `500` ordinary or `600` current-state weight. Restore
`14/20` whenever the measured cell fits it. If `12/16` still wraps, use only
separately approved concise copy that preserves the destination meaning; a maximum
of two lines is the final reflow fallback. Never resolve below `12px`, truncate,
clip, hide, or change the icon, target, padding, row, column, or destination order to
force one line. This exception does not create a general small-control role.

The composite inventory contains no `12/16 · 500` or `12/16 · 600` entry, so this step
is carried by two dedicated bounded styles rather than by raw type values or by
`metadata`: one ordinary fit style at `12/16 · 500` and one current-destination fit
style at `12/16 · 600`, each provided per locale so a later font-family change still
propagates to them. Raw type values are not acceptable here, because a label that
carries its size and family directly is silently skipped when the family variables are
repointed. These two styles are valid only inside this exception.

### Joined overlay edge — approved 2026-08-14

An overlay that is deliberately joined to the edge of a persistent surface, such as the
compact navigation panel opening directly below the header, treats the joined edge as
structure rather than as its own boundary:

- The joined edge sits flush against the persistent surface with no offset.
- The two corner radii on the joined edge resolve to `0`. The remaining corners keep
  the overlay radius, so the shape reads as an extension of the surface it joins.
- The overlay does not draw its own border on the joined edge, because the persistent
  surface already draws that line. Two adjacent one-pixel borders would render as a
  doubled two-pixel line that belongs to neither element.
- An overlay that is _not_ joined — an anchored non-modal popover — keeps the overlay
  radius on all four corners and is offset from its anchor, so that it reads as
  floating rather than attached.

Joining is a property of the usage site, not of the overlay component, so it is applied
where the overlay is placed rather than by adding a variant to the component.

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

### Edge icon-only control optical padding — approved 2026-08-13

An icon-only control keeps its `44×44` mobile or `40×40` desktop target, so the icon
sits inside that target with `(target − icon) / 2` of internal space on every side.
When such a control is the first or last child of a container whose two edges are
pinned, subtract that internal space from the container padding on that side so the
icon reads as optically aligned with the opposite edge.

- Both values stay on the spacing scale. `AppHeader` uses `16px` left and `8px` right
  because its trailing `44` target holds a `24` icon (`10px` internal space): the icon
  box then lands `18px` from the edge against the `17.6px` left text ink.
- The declared padding may therefore be asymmetric on purpose. Record the reason,
  because a symmetric declaration is what produces the visible imbalance here.
- Do not reduce the padding below the point where the target itself touches the
  container edge. `SearchField` keeps `8px` right padding for this reason: applying the
  subtraction would leave `0`, and its optical error is only `4px`.
- This corrects padding only. Never shrink the target, the icon, or the icon's own
  internal space to make an edge look tighter.

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

| Role          | Light          | Dark           | Contract                                                                             |
| ------------- | -------------- | -------------- | ------------------------------------------------------------------------------------ |
| `canvas`      | `#FFFFFF`      | `#111111`      | Page and shell baseline                                                              |
| `surface`     | `#F8F8F8`      | `#1B1B1B`      | Flat grouped content; ordinary cards remain unraised                                 |
| `sunken`      | `#E9E9E9`      | `#111111`      | An intentionally receding ordinary data or work well                                 |
| `raised`      | `#FFFFFF`      | `#222222`      | Content with real lift, movement, overlap, or justified emphasis                     |
| `overlay`     | `#FFFFFF`      | `#222222`      | Menu, popover, tooltip, sheet, dialog; placement/boundary also communicates stacking |
| `scrim`       | black at `40%` | black at `60%` | Modal background suppression only                                                    |
| `media-scrim` | black at `60%` | black at `60%` | Legibility ground for text placed over uncontrolled artwork only                     |

`media-scrim` is a legibility device, not a state device. It exists because artwork
luminance is not controlled: a jacket may be near-white or near-black, so text placed
directly on it has no guaranteed contrast. `60%` is the value at which a white
foreground clears `4.5:1` even over pure white artwork (`5.74`); the calculated minimum
is `55%`, and `40%` fails (`2.85` over white artwork, `3.37` over an empty slot). The
same `60%` already serves Dark `scrim`, so this role introduces no new primitive value.

It is distinct from `scrim`, which suppresses a modal background, and it must never be
used to weaken content — that remains `content-pending`, `content-subdued`, or
`content-disabled`. Use a flat band, not a gradient: gradient is not a Foundation
mechanism. A `media-scrim` band takes its height from its content rather than a fixed
number.

### Foregrounds — `F-A`

| Role                          | Light     | Dark      | Contract                                                       |
| ----------------------------- | --------- | --------- | -------------------------------------------------------------- |
| `content-default`             | `#292929` | `#DBDBDB` | Headings, body, primary icons, important labels/values         |
| `content-subdued`             | `#505050` | `#AFAFAF` | Metadata, helpers, timestamps, secondary icons                 |
| `content-interactive`         | `#131313` | `#F2F2F2` | Default interactive content during hover/pressed/content-focus |
| `content-subdued-interactive` | `#292929` | `#DBDBDB` | Subdued interaction during hover/pressed/focus/selected        |
| `content-disabled`            | `#C6C6C6` | `#444444` | Genuinely unavailable nonessential content only                |
| `content-pending`             | `#717171` | `#8A8A8A` | Valid content held while its request is in flight only         |
| `content-on-media`            | `#FFFFFF` | `#FFFFFF` | Foreground on `media-scrim` only; identical in both modes      |

Static headings remain `content-default`; do not use the higher state value for
decorative emphasis. Disabled information needs an available explanation elsewhere.

`content-pending` marks valid content that is temporarily held while a request is in
flight, such as retained results during a slow replacement. Use `content-subdued` for
ordinarily secondary content and `content-disabled` for genuinely unavailable content;
`content-pending` is neither. It is the lightest neutral step that still clears `4.5:1`
for body text on `canvas` and `surface`, and it must not be used for text on `sunken`,
where it measures `4.02` in Light. The colour never carries the state alone: a progress
indication, the region's busy state, and blocked activation accompany it. Content
opacity is not a Foundation mechanism and must not be used to express this state.

`content-on-media` is the only foreground approved for a `media-scrim` band. It does not
change between modes because the band is dark in both. The existing foregrounds cannot
serve this position: `primary/on-primary` inverts to `#111111` in Dark, and
`content-default` measures `4.10` in Dark over a scrimmed near-white jacket. Use it only
where `media-scrim` is present; on any ordinary surface the normal foregrounds apply.

### Neutral boundaries — `NB-A`

| Role                | Light                        | Dark                        | Contract                                                                                  |
| ------------------- | ---------------------------- | --------------------------- | ----------------------------------------------------------------------------------------- |
| `divider`           | `#E1E1E1`                    | `#323232`                   | Decorative rhythm only                                                                    |
| `border-subtle`     | `#DADADA`                    | `#393939`                   | Nonessential framing and disabled boundary                                                |
| `border-default`    | `#C6C6C6`                    | `#444444`                   | Ordinary edge when another cue already identifies the object                              |
| `border-strong`     | `#717171`                    | `#8A8A8A`                   | Necessary neutral control or graphic boundary that must independently remain identifiable |
| `border/empty-slot` | `surface/sunken` → `#E9E9E9` | `border-subtle` → `#393939` | `1px` inside edge for an artwork or image slot only while no image is available           |

The quiet roles are intentionally below `3:1` on some surfaces and must never become
the sole necessary cue. Do not outline every Dark container or selected row.
`border/empty-slot` is a bounded appearance alias, not a new neutral primitive. Its
Light edge intentionally disappears into the approved sunken fill; its Dark edge
keeps an otherwise canvas-matching empty jacket or avatar slot locatable. Remove the
edge when real imagery fills the slot, and keep the approved icon/text fallback as
the semantic cue.

### Input control boundary — amended 2026-09-04 (deep verification, user decision)

`FormField` · `TextArea` · `SearchField` · `Select` · `FilterSortControl` draw their resting
boundary with **`border/strong`** (Light 4.88:1 · Dark 5.47:1 on `surface/canvas`), not
`border/default` (1.71 / 1.94). For these controls the boundary is the only visual cue that
a control exists — the label above a field describes it but does not delimit it — so WCAG
1.4.11 non-text contrast (3:1) applies. `border/default` remains the decorative rhythm
boundary (dividers, card edges, chart grids, tinted status containers) where a text label or
fill already carries the meaning. Focus (`FOCUS-1B`), invalid, and disabled boundaries are
unchanged. Same reasoning as the Neutral button move to `border/strong` (CONFLICT-18).

### Overlay boundary — `border/overlay` — approved 2026-09-04 (AI-generic check, decision ①)

Floating surfaces (popover, listbox, menu, sheet, dialog, tooltip — the C8 overlay contract)
take their 1 px edge from **`border/overlay`**: Light = alias of `surface/overlay` (the edge
disappears; the `elevation/overlay-light` shadow lifts the face), Dark = alias of
`border/default` (shadows are invisible on dark canvases, so the edge carries the face). Same
mechanism as `border/empty-slot`. Reason: "1 px hairline + wide soft shadow" on a light popover
is the shadcn/Radix default that AI-slop detectors list as a generated-UI signature, and every
major system (Spectrum, Material, Carbon, Atlassian) lifts light overlays with shadow alone.
Radius 10 and `elevation/overlay-*` are unchanged. 50 nodes rebound (C8 components + P2/P9/
P12/P13/P14 instances and frames).

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
white Dark-theme outline and do not promote to `border-strong` automatically.

**Approved exception — segmented selection, 2026-08-13.** Where an approved segmented
control would otherwise identify its selected segment by fill alone, that selected
segment carries a `1px` inside `border-strong` boundary as its persistent non-fill
cue. This is a named audited exception, not an automatic promotion: it covers the
selected segment of `ViewModeSwitch` and `DifficultySelector` only, keeps the approved
`surface/raised` selected fill on the `surface/sunken` track, and changes no hover or
pressed recipe. Measured non-text contrast against the selected fill is `4.88:1`
Light and `4.61:1` Dark, replacing a fill-only difference of `1.21:1` and `1.19:1`.
Any further segmented family needs its own decision rather than inheriting this one.

### Keyboard focus — `FI-C` polarity with single-border geometry

Revised 2026-08-13 by user decision; see `FOCUS-1B` in document `22`.

- Light focus color: `#000000`. Dark focus color: `#FFFFFF`.
- Geometry: **one `1px` inside border on the focused control itself**. Stroke alignment
  is inside, so a focused control never changes size, position, or surrounding layout,
  and no ring is drawn outside the object.
- A control that already carries a resting `1px` boundary keeps that boundary and only
  exchanges its color for the focus color, exactly as the invalid state exchanges it
  for `feedback/destructive-border`.
- A control with no resting boundary gains the `1px` focus border only while focused.
  Its resting appearance is unchanged.
- The focus border must reach at least `3:1` against the surface it is drawn on. Where
  the focus color cannot (a filled control such as `RPA-A` primary), use the approved
  on-fill color for that surface instead of the polarity color.
- Show only for keyboard-visible focus; pointer focus does not leave a persistent
  border.
- Do not recolor the component, selection, identity, or semantic state beyond that
  single boundary.
- In forced colors, use system `Highlight` for the focus border.
- Prevent clipping at scroll, rounded, sticky, and frame boundaries.

Known consequence recorded with the decision: a `1px` color-only indicator satisfies
WCAG 2.2 SC 2.4.7 but not the `2px` minimum in SC 2.4.13. The user accepted this
after review, preferring a single border consistent with ordinary state coloring.

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

## Third-party brand color — `BR-A` — approved 2026-08-30

`RPA-A` above already reserves external-brand actions for _their own semantics_ without
naming any. This section names the first one.

| Token              | Light     | Dark      | Scopes                     |
| ------------------ | --------- | --------- | -------------------------- |
| `brand/discord`    | `#5865F2` | `#5865F2` | `FRAME_FILL`, `SHAPE_FILL` |
| `brand/on-discord` | `#FFFFFF` | `#FFFFFF` | `SHAPE_FILL`, `TEXT_FILL`  |

- **The value is not new to the product.** `app/globals.css` already defines
  `--color-discord: #5865f2` and the current login button already uses it. Document 17
  requires one **Discord-branded** action.
- **Brand color does not invert.** Both modes carry the same value, for the same reason
  `content/on-media` is fixed white in both: the surface is owned by the brand, not by
  the page. A mode-flipped Discord blurple would no longer be Discord's color.
- **`brand/on-discord` cannot be replaced by `content/default`.** White on blurple
  measures `4.61:1`; `content/default` `#111111` on blurple measures `4.10:1` and fails
  normal-text AA. The current product's `text-text-primary` on `bg-discord` is therefore
  a live contrast defect that this token fixes.
- `4.61:1` clears AA for normal text with little headroom. The value is fixed by Discord
  and is not ours to adjust; the label is `control 14/20`, and no smaller step is used on
  this surface.
- **Scope: one federated authentication action per provider.** Not for ordinary actions,
  navigation, status, links, or decoration. Adding another provider requires its own
  token pair and its own approval — there is no generic `brand/*` ramp.

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
| `media-scrim`       | Black at `0.6` in both modes                                                                                                          |

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

### Filled destructive action — approved 2026-09-01

Permanent-destruction entry and final-confirmation buttons (the first user-approved
case is P10 account deletion) use a filled red button, `Button · Style=Destructive
Filled`, alongside the existing outline `Style=Destructive`, which remains unchanged
for every existing instance. Three alias tokens implement it with **zero new
primitives**:

- `feedback/destructive-surface` — Light `#C9372C` (white label `5.16:1`) / Dark
  `#AE2E24` (white label `6.53:1`). The Dark marker `#F15B50` fails white text at
  `3.31:1` and is not used as a face.
- `feedback/destructive-surface-hover` — `#AE2E24` in both modes; also the pressed
  face. Dark hover/pressed are therefore invisible color-wise — the ramp holds no
  darker red — which follows the accepted Primary/Destructive pressed-residue
  precedent above.
- `feedback/on-destructive` — white in both modes (alias of `neutral/FFFFFF`),
  scoped to the destructive face only. Same fixed-polarity structure as
  `content/on-media`, different role.

Focus follows `FI-C` unchanged: the face passes `3:1` against both focus polarities
(Light `#000000` `4.07:1`, Dark `#FFFFFF` `6.53:1`), so the ordinary focus color
gains a 1px inside border and no on-fill substitution is needed. Disabled mirrors
the neutral disabled treatment of the other button styles.

## Difficulty markers — `DU-01`, Adobe Spectrum S2

| Role   | Light     | Dark      |
| ------ | --------- | --------- |
| Normal | `#0BA45D` | `#068850` |
| Hard   | `#E86A00` | `#E06400` |
| Expert | `#F03823` | `#CD2E1D` |
| Real   | `#A65CE7` | `#AD69E9` |

These colors appear only on compact persistent difficulty markers in eligible
repeated-scanning ordinary DOM UI. Names, levels, order, and pattern/selected cues
remain visible. Do not color difficulty backgrounds, containers, selection,
focus, feedback, or actions.

The approved compressed result marker is exactly `20×20px`: a `12×2px`
`radius-full` difficulty-color line, a `2px` optical gap, and a neutral `metadata`
level value. It has no fill or container. Four markers use fixed
Normal → Hard → Expert → Real order with `4px` gaps for a total `92px` group. The
number and fixed order remain the non-color cues.

### Difficulty text ramp — amended 2026-09-02 (user decision, P13)

The original "do not color difficulty text" clause is lifted for **difficulty
name + level labels** only: colored difficulty text is the game's and the current
product's native convention, and the P13 exam stage rows adopt it. Because the
`DU-01` marker values fail `4.5:1` as text (`3.05–3.73` on Light surfaces), a
dedicated **text ramp** exists as `difficulty/text-{normal,hard,expert,real}`
aliases — same hue, adjusted lightness, all `≥4.5:1` on both `surface/canvas`
and `surface/surface` in their mode:

| Role   | Light                      | Dark                       |
| ------ | -------------------------- | -------------------------- |
| Normal | `#09834A` (new, 4.53)      | `#219563` (new, 4.55)      |
| Hard   | `#BA5500` (new, 4.52)      | `#E06400` (existing, 4.91) |
| Expert | `#CD2E1D` (existing, 4.94) | `#D85C4F` (new, 4.56)      |
| Real   | `#9452CE` (new, 4.55)      | `#AD69E9` (existing, 4.90) |

Five new primitives (`difficulty/09834A`, `219563`, `BA5500`, `D85C4F`,
`9452CE`); three sides reuse existing `DU-01` primitives. Rules: the text ramp is
for **text fills only** (label + level as one run, `metric-value` weight); the
name text itself stays the non-color cue, so color is never the only signal; the
`DU-01` marker values remain unchanged for non-text markers (2×20 bars, 12×2
lines). Note the contrast reference plane: `difficulty/068850` reads `4.52` on
canvas but only `4.26` on `surface/surface`, which is why the Light Normal text
value is new. The C3 `DifficultyMarker` component was revised to this colored-text
form (dot removed); its only instance consumers are C3 and P13.

**Consumer extension — 2026-09-05 (B · 난이도 표기 통일, Z1 ㉒).** The text ramp is now
the single grammar for difficulty level numbers in result and play rows as well:
C6 `ResultCollection` Music List / Music Grid / Chart grouped cells, P3 result rows,
P4 tier cards and P6 play rows set each level as `metric-value` 14/20 in
`difficulty/text-*`; the 12×2 colour bars under the numbers were removed. The
2×20 selected-chart accent bar and other non-text markers keep the `DU-01` marker
values. Applied: C6 24 component cells, 736 instance cells, P6 370 texts.

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

## Achievement marks — `AC-01`, SAP Fiori Horizon — approved 2026-08-14

A player's clear achievement on a chart is its own domain role, distinct from system
feedback and from data-visualization series:

| Role         | Source value                        | Applies to                              |
| ------------ | ----------------------------------- | --------------------------------------- |
| `full-combo` | SAP Fiori Horizon categorical green | The Full Combo clear mark, labeled `FC` |

- The value is an already-approved `LD-03` primitive, so no new source enters the
  system. The role is new; the primitive is not. A categorical palette is deliberately
  non-semantic, which is why reusing its value here creates no meaning collision.
- The mark always carries its short `FC` label. Colour never conveys the achievement
  alone.
- **The `FC` label text is `content/default`, not the achievement colour; the mark's
  `1px` border carries `full-combo`. Approved 2026-08-28.** At `#75980B` the Light value
  reaches only `3.36:1` on `canvas`, `3.16:1` on `surface`, and `2.77:1` on `sunken`,
  so it clears the `3:1` non-text threshold a border needs but not the `4.5:1` a label
  needs. Dark passes on its own at `9.70:1`–`10.63:1`, but the label is one treatment
  across both modes. With `content/default` the label reads `11.98:1`–`14.55:1` in Light
  and `12.44:1`–`13.64:1` in Dark. The role is unchanged and no value moves: the colour
  still identifies the mark, on the border, and the label it always carries is what
  states the achievement.
- Do not use this role for series, buckets, difficulty, judgement, or feedback, and do
  not introduce further achievement colours without a new approved role.
- The current implementation's clear-mark colour is a framework default with no recorded
  source and is superseded by this role.

**Correction — 2026-08-27.** Pianist was previously listed here as a second achievement
colour role labelled `P`. That was wrong and is removed. Pianist is a perfect result
(`score >= 1,000,000` or `fc_type === 3`) and therefore sits at the top of the
score-grade ladder above `S`, not beside Full Combo: the ladder is
`Pianist > S > A+ > A > B+ > B > C > D`. It is delivered as the official `P` grade
image in the score-grade slot, exactly like every other grade, and is never repeated in
the Full Combo column. Full Combo remains a separate combo-based axis, so the two are
not alternatives — a Pianist result also satisfies Full Combo and still shows the `FC`
mark. The `achievement/pianist` variable is retained unchanged so no resolved colour
moves; it currently carries no assigned role and its disposition is a later colour
cleanup item. The governing row contract is the resolved composition in
[document 05](./05-music-detail-page-brief.md).

Score grade — including Pianist — is **not** a colour role. It is delivered as the official grade image,
self-hosted from the game's published grade assets rather than hot-linked, so a
third-party outage cannot blank the column. Grade therefore needs an image slot and an
accessible name, not a token.

## Iconography — `IC-06`, Lucide

- Use `lucide-react` as the single ordinary-UI icon family and review changed glyphs
  when upgrading the source package.
- **Third-party brand marks are a bounded exception, approved 2026-08-27.** A brand such
  as Discord has no Lucide equivalent, and substituting a generic glyph would misname the
  service. Use the brand's own published symbol, vendored from the product source rather
  than redrawn, sized to the same render step as the icon it sits with, and given the same
  accessible treatment. A brand mark is filled artwork, not a `2px` stroked outline, so the
  stroke rules above do not apply to it.
- **Amended 2026-08-30.** The exception previously read _"it does not admit brand marks
  into actions, navigation, or status."_ That wording was written for identity metadata
  and did not anticipate federated authentication. Document 17 requires one
  **Discord-branded** action, and the product already ships `--color-discord: #5865f2`
  on its login button. The exception therefore also covers **a federated authentication
  action that launches the named provider** — one action per provider, carrying the
  provider's mark and its brand surface. It still does not admit brand marks into
  navigation, status, or any ordinary product action.
- Preserve the published `24×24` viewBox, `2px` stroke, round linecaps/linejoins, and
  outline treatment.
- Render routine action/wayfinding glyphs at `20px`. Use `16px` only for compact
  supporting/metadata icons beside a visible label. Reserve `24px` for a proven
  prominent standalone affordance or empty state.
- **Inline term-trigger icon `14px` — bounded exception, approved 2026-09-02 (P14).**
  A domain-term tooltip trigger rendered inside running text (underlined term +
  `Icon/circle-help` immediately after, `2px` gap, the current product's own
  convention) sizes the icon to the **surrounding font size** so it reads as part of
  the line: `14px` beside `14px` text. At `16px` the glyph visibly outweighs the
  words (compared at 16/14/12 before approval). This exception exists only for
  in-sentence term triggers; it is not a general small-icon size, and the trigger's
  touch behavior belongs to the whole term group, not the icon alone.
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

### Pressed feedback scale — approved 2026-08-13

A pressed small control uses `transform: scale(0.98)` on the existing `100ms`
`Pressed feedback` row (`out.practical` on press, `in.practical` on release). The
constant is `motion/press-scale`.

- This is a transform, so the control's box, layout, and surrounding flow do not
  change. Do not implement the reduced footprint as a layout size.
- Eligible: small controls only — buttons, icon-only buttons, and page-number
  controls. Do not scale list rows, grid cards, tables, panels, or page regions.
- Under `prefers-reduced-motion: reduce` the scale is removed with the rest of
  nonessential transforms. `Neutral` and `Ghost` still change fill
  (`interaction/hover` to `interaction/selected-pressed`); `RPA-A` primary and the
  destructive action then have no pressed change, which is accepted.
- Why a NosLog-local constant: `primary/hover` already sits at `#131313`, one step from
  the end of the Spectrum neutral ramp, so every remaining step differs from hover by
  only `1.02:1` to `1.17:1`. The destructive red ramp is equally tight at `1.26:1`.
  Colour alone cannot express pressed for those two styles, and the approved motion
  source publishes no press-scale token, so the amount is recorded here rather than
  invented per component. `primary/pressed` and
  `feedback/destructive-border-pressed` remain as the reduced-motion residue only.

## Progress indication — approved 2026-09-04 (user decision, Z1 ⑯ · 24 references)

The file had no loading contract; busy was expressed by label text alone. This section
closes that gap. Four surfaces, each with one approved form:

| Surface                                                      | Form                                                               | Spec                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Content area whose layout is known (list, card, chart frame) | **Skeleton, pulse**                                                | Bones `surface/sunken` on the real container surface, geometry = the column ratios of the loaded content (Z1 2026-08-19). Motion: opacity `1 → 0.5 → 1`, ~2 s ease-in-out. `prefers-reduced-motion` → static bones. Never a spinner for a full page or a known layout.                                                                                                                                                                                                                     |
| Control performing its own action (button)                   | **`Button · State=Busy`** — spinner 16 leading + progressive label | Spinner colour = the label colour of that Style (`currentColor`), so Primary shows `primary/on-primary`, Neutral `content/default`, Ghost `content/interactive`, Destructive `feedback/error-text`, Destructive Filled `feedback/on-destructive`. Label stays visible and changes to the progressive form (`다시 시도 중`, `저장 중`, `Retrying`) — doc 19 rule. Width grows by 24 (16 + gap 8); height 40 unchanged. Not disabled: contrast stays; repeat activation is blocked by state. |
| Section refreshing in place (data already on screen)         | **`content/pending` only** (`DISC-44`)                             | No spinner, no sentence. `aria-busy` + live status for assistive tech.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Route transition                                             | **`RouteProgressBar`** (C8)                                        | 2 px bar at the very top of the viewport, `primary/default`, no track, indeterminate (30 % width sweeping left → right). The new page then renders its skeleton.                                                                                                                                                                                                                                                                                                                           |

**Spinner geometry** (the only spinner in the system): arc 270° · stroke 2 (fixed, does not
scale) · sizes on the icon scale 16 (inline, button) / 24 (section) / 48 (whole-view, only
where no layout is known yet — expected to be rare) · one rotation ≈ 1 s · neutral, no track.
Dots and shimmer are not used — one loading language.

**Timing** — nothing is shown for waits under 1 s (Primer 300/1000 ms delay, Spectrum 1 s
delay, Atlassian "> 1 s"); 1–3 s indeterminate; over 3 s determinate where the total is
known (Primer, Apple HIG). At most one spinner per page (Atlassian). Reduced motion: the
skeleton stops pulsing; a spinner keeps rotating (Atlassian exception — a frozen spinner
reads as a stalled process).

Rejected: spinner replacing the label (Atlassian LoadingButton / Spectrum pending / Polaris —
conflicts with doc 19), shimmer skeleton (extra gradient layer, NN/g distraction note), a
spinner beside every refreshing section title (violates one-spinner-per-page), static
skeleton (library defaults are animated: shadcn, Chakra, MUI, Carbon).

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

## Approved component weight exception — 2026-09-05 · D-1

P5 PlayerRankingRow's published shared-rank numeral is emphasised for displayed
ranks 1–3. The user explicitly approved this limited emphasis in document 86
item 5.1. Other ranks and other metric-value consumers are unchanged.

**Correction — 2026-09-06.** The first application (2026-09-05, parallel Codex
session) set the 231 numerals to a raw IBM Plex Sans Bold 700 face, which cleared
their Text Style and left 231 `B1_noTextStyle_raw` audit hits. That is not a
weight exception this Foundation grants: raw font assignment is forbidden
file-wide. The approved Z1 ㉒ specimen (b) uses the existing composite
**`emphasis-label/latin` 14/20 · 600** (a Text Style), and the 231 nodes were
re-bound to it. Geometry, the 28×20 rank box and colour bindings are unchanged;
proportional figures replace tabular for these single-digit numerals, which does
not move the column. No 700 exception exists.

## Overlay width — 2026-09-06 (Z1 ㉔)

Dialogs have two widths, both existing values: **Compact 334** (the DeleteConfirmDialog
width, `390 − 2×28`) and **Wide 768**, which reuses the `reading` container measure as the
dialog width when the dialog carries a media preview that must stay legible (the profile
share card: 720×378 inside 768). The user chose 768 over 640 (the Home bounded width) and
334 on a drawn comparison. This is a bounded reuse of the reading measure for an overlay
box, not a new primitive; dialogs that carry only text and actions stay at 334 in every
width.

## Exam tier ramp and plate face — 2026-09-06 (Z1 ㉗, `PROF-56`)

Six aliases, no new primitives:

| Token            | Light                     | Dark                  | Role                                                                                                                                                       |
| ---------------- | ------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `surface/plate`  | `#E9E9E9` (neutral)       | `#2C2C2C` (neutral)   | small badge/plate face on the canvas — 1.21 / 1.35 against canvas, visible in both modes (`surface/sunken` disappears in Dark, `surface/surface` in Light) |
| `exam/tier-low`  | `#717171`                 | `#8A8A8A`             | 10–8급 band                                                                                                                                                |
| `exam/tier-mid`  | `#0074E2`                 | `#3FA2FF`             | 7–5급 band                                                                                                                                                 |
| `exam/tier-high` | `#9452CE` (= text-real)   | `#AD69E9`             | 4–3급 band                                                                                                                                                 |
| `exam/tier-top`  | `#CD2E1D` (= text-expert) | `#D85C4F`             | 2급 band                                                                                                                                                   |
| `exam/tier-peak` | `#BA5500` (= text-hard)   | `#F2A634` (= pianist) | 1급 band                                                                                                                                                   |

Band vs plate face (non-text 3:1): Light 4.02 / 3.76 / 3.97 / 4.32 / 3.94 · Dark 4.05 / 5.20 / 3.97 / 3.70 / 6.84. The tier colours are **not** for text on the plate — as 12 px text they range 2.75–4.32 in Light — so the plate's text stays `content/default`. `surface/plate` is a resting face (not an interaction fill) and may be reused by other small badges that must read on the canvas in both modes.
