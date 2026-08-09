# NosLog 2.0 Foundation Color and Material Candidates

## Document Control

- Status: `Research complete — C1–C4 role architecture, exact Spectrum S2 neutral
mappings, Fluent focus, and SS-08 Radix Indigo identity source approved; exact
material dimensions and component aliases pending`
- Canonical language: English
- Korean companion:
  [32-foundation-color-material-candidates.ko.md](./32-foundation-color-material-candidates.ko.md)
- Started: 2026-08-08
- Scope: Foundation v0.1 appearance architecture for neutral surfaces, text,
  interaction, focus, status, domain-color ownership, borders, radius, elevation,
  scrims, and Dark/Light/System behavior
- Inputs: approved documents `01`–`31`, current repository color implementation,
  current `/ko` browser evidence at `390 × 844`, and the focused reference matrix
  below
- Excludes: feedback and data-visualization colors, exact radius and shadow dimensions,
  final identity/action component aliases and styling, illustration, icon grammar,
  motion, Figma production screens, and application implementation

This document records evidence, candidate architectures, tradeoffs, and proposed
decision batches. Nothing marked `Proposed` is an approved NosLog 2.0 visual rule
until the user explicitly accepts it.

## Related Documents

- [Foundation v0.1 research brief](./24-foundation-v0.1-research-brief.md)
- [Foundation semantic role map](./25-foundation-semantic-role-map.md)
- [Foundation typography and layout candidates](./26-foundation-typography-layout-candidates.md)
- [C5 Spectrum S2 semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.md)
- [C5 Fluent focus validation](./44-foundation-c5-fluent-focus-specimen-validation.md)
- [C5 exact signature-system comparison](./45-foundation-c5-signature-system-reference-comparison.md)
- [S1 discovery validation](./27-foundation-s1-discovery-structural-validation.md)
- [S2 music-detail validation](./28-foundation-s2-music-detail-structural-validation.md)
- [S3 rankings validation](./29-foundation-s3-global-rankings-structural-validation.md)
- [S4 chart-viewer validation](./30-foundation-s4-chart-viewer-structural-validation.md)
- [S5 Home validation](./31-foundation-s5-home-structural-validation.md)
- [Cross-cutting reference matrix](./22-cross-cutting-reference-matrix.md)
- [Settings and account brief](./16-settings-account-page-brief.md)
- [Signature color research](./33-foundation-signature-color-research.md)

## Approval Boundary

The following contracts already govern this work and are not reopened here:

- Dark is the representative NosLog art-direction anchor, while System, Dark, and
  Light are complete supported appearance choices.
- New users default to System; explicit existing Dark or Light choices migrate and
  remain device-local.
- Color cannot be the only cue for state, rank, difficulty, hand, mode, or data.
- Jacket art, music identity, score, and NOSTALGIA meaning may carry expression;
  brand color does not need to dominate every surface.
- Structural decisions approved in S1–S5 remain stable. Appearance must serve those
  structures rather than silently redesign them.
- WCAG 2.2 AA is the production baseline. Contrast must be verified on the actual
  adjacent surface and state, not inferred from an isolated swatch.

## Current NosLog Evidence

### Browser observation

The signed-in current Home was inspected at `390 × 844` on 2026-08-08. This is
migration evidence, not a 2.0 appearance authority.

- The page uses `#0b0b10`; the sticky header, footer, announcement, destination
  cards, and official-news region mostly use the same `#121218` surface.
- Flat-card hierarchy is therefore carried mainly by spacing, a small value shift,
  and occasional borders. Most repeated cards do not have a distinct semantic layer.
- Primary and focus treatments are near-white rather than a recognizable NosLog
  action accent.
- Content art is not yet used as a controlled source of local expression on Home.
- The calm neutral shell is reusable evidence. The lack of explicit surface,
  interaction, and domain ownership is not.

### Repository observation

`app/globals.css` currently defines Dark and Light values for background, surface,
text, interaction, status, chart, score, rank, difficulty, Basic/Recital, genre, and
Discord roles. The inventory is a useful migration seed, but the ownership model is
incomplete.

- Dark neutral roles are `bg`, `surface`, `surface-muted`, `divider`, and `border`.
- One `interactive` color also supplies the main filled action; `focus` currently
  shares the same near-white value in Dark.
- Status currently includes only `success` and `danger`; warning and information
  families are absent.
- Rank, difficulty, mode, genre, generic chart, score, and hand colors can coexist in
  one screen without a collision policy.
- Canvas/WebGL, profile-card rendering, bookmarklet UI, and editor utilities still
  contain hard-coded colors or direct Tailwind palette utilities.
- Current source scanning found repeated literal copies of core neutrals and domain
  colors in addition to semantic-token use. This is evidence for a primitive →
  semantic → component-alias mapping, not permission to preserve those exact values.

### Measured current contrast

The following ratios were calculated from current sRGB values. They describe only the
named pair and do not approve the value.

| Pair                           | Current ratio | Interpretation                                       |
| ------------------------------ | ------------: | ---------------------------------------------------- |
| Dark primary text / page       |     `17.57:1` | Strong text contrast                                 |
| Dark secondary text / page     |      `7.58:1` | Strong text contrast                                 |
| Dark disabled text / page      |      `3.48:1` | Must remain nonessential and genuinely inactive      |
| Dark surface / page            |      `1.05:1` | Too subtle to carry required grouping by itself      |
| Dark muted surface / surface   |      `1.08:1` | Too subtle to carry required state by itself         |
| Dark divider / surface         |      `1.16:1` | Decorative separation only unless another cue exists |
| Dark border / surface          |      `1.32:1` | Cannot identify a required control boundary alone    |
| Light primary text / page      |     `15.02:1` | Strong text contrast                                 |
| Light secondary text / surface |      `7.11:1` | Strong text contrast                                 |
| Light disabled text / surface  |      `3.04:1` | Must remain nonessential and genuinely inactive      |

The low neutral-to-neutral ratios are not automatically failures: decorative card
boundaries do not always need `3:1`. They become failures when that boundary is the
only information required to identify a control, state, focus indicator, or meaningful
graphic.

## Focused Reference Matrix

The comparison uses seventeen independent source groups. Several groups contain more
than one page, but each row is counted once so the source total is not inflated.

| Source group                                                                                                                                                                                                          | Transferable evidence                                                                                                                                                                 | NosLog use                                                                                                        | Limitation                                                                                       |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | Normal text needs `4.5:1`; meaningful component/graphic cues need `3:1`; hue alone cannot carry meaning.                                                                              | Governs text, controls, focus, difficulty, hand, rank, mode, chart, and status validation.                        | Does not choose art direction or palette values.                                                 |
| [Apple Color](https://developer.apple.com/design/human-interface-guidelines/color), [Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)                                              | Semantic adaptive colors, separate base/elevated dark backgrounds, and non-inverted appearance values preserve hierarchy.                                                             | Supports complete System/Dark/Light behavior and brighter foreground layers in Dark.                              | Native Apple material and component styling are not web authority.                               |
| [Material 3 theme and brand](https://developer.android.com/codelabs/m3-design-theming)                                                                                                                                | Role-based `surface`/`on-surface` and container pairs separate purpose from raw swatches.                                                                                             | Supports paired foreground/background roles and ordered surface containers.                                       | Material's default hue and expressive component styling are not adopted.                         |
| [Fluent 2 design tokens](https://fluent2.microsoft.design/design-tokens), [Elevation](https://fluent2.microsoft.design/elevation)                                                                                     | Global primitives map to semantic aliases; themes cover light, dark, high contrast, and brand; elevation is a controlled system.                                                      | Supports primitive → semantic → component alias and explicit elevation roles.                                     | Fluent's shadow ramp is larger than NosLog needs.                                                |
| [Atlassian elevation](https://atlassian.design/foundations/elevation), [Border](https://atlassian.design/foundations/border)                                                                                          | Sunken, default, raised, and overlay surfaces have distinct intent; Dark uses surface color because shadows weaken; border width and color pair by state.                             | Strong fit for page, viewer/editor well, flat region, movable/raised content, overlay, selected, and focus roles. | Enterprise board examples do not determine NosLog density or visual tone.                        |
| [Carbon color](https://carbondesignsystem.com/elements/color/overview/)                                                                                                                                               | Neutral gray dominates; subtle value shifts organize content; role names stay stable across themes while values change.                                                               | Supports a quiet shell, sparse accent, and invariant semantic tokens.                                             | Carbon's exact blue accent and alternating layers are not adopted.                               |
| [Adobe Spectrum color system](https://spectrum.adobe.com/page/color-system/), [Object styles](https://spectrum.adobe.com/page/object-styles/)                                                                         | Color is sparse and intentional; status needs text/icon support; most components use contrast or overlay rather than shadows; shadows are reserved for transient dismissible content. | Supports restrained status, limited shadows, and content-first hierarchy.                                         | Creative-tool density and semantic assignments do not define NosLog values.                      |
| [Radix Colors use cases](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale), [Aliasing](https://www.radix-ui.com/colors/docs/overview/aliasing)                                        | Separate steps exist for backgrounds, interactive states, borders, solid fills, and text; aliases remap Light/Dark without component-specific raw names.                              | Highly relevant to the existing Radix stack and state-ramp design.                                                | APCA claims do not replace NosLog's WCAG 2.2 AA acceptance tests.                                |
| [Shopify Polaris color tokens](https://polaris-react.shopify.com/design/colors/color-tokens)                                                                                                                          | Semantic names combine element, role, prominence, and state.                                                                                                                          | Supports `background/action/subtle/hover` style ownership rather than hue names in components.                    | Commerce tasks and current Polaris packaging do not govern NosLog visuals.                       |
| [GitHub Primer color usage](https://www.primer.style/product/getting-started/foundations/color-usage/)                                                                                                                | Light/Dark neutral scales share functional roles; backgrounds, borders, text, and state roles have measured contrast responsibilities.                                                | Supports multi-theme token stability, subdued/emphasis variants, and contrast adjustment.                         | GitHub's dense developer UI is only a structural comparison.                                     |
| [USWDS theme color tokens](https://designsystem.digital.gov/design-tokens/color/theme-tokens/), [Using color](https://designsystem.digital.gov/design-tokens/color/overview/)                                         | Theme tokens map to system colors and contrast is evaluated as a relationship, not a swatch property.                                                                                 | Supports automatic pair testing and explicit foreground/background contracts.                                     | Government branding proportions and exact palette are not applicable.                            |
| [GOV.UK focus states](https://design-system.service.gov.uk/get-started/focus-states/)                                                                                                                                 | A two-color, sufficiently thick focus treatment can stay visible across varied surfaces.                                                                                              | Supports a focus role independent from brand/action color and tested on every surface.                            | The yellow/black treatment is evidence, not a required NosLog appearance.                        |
| [VA Design System color](https://design.va.gov/foundation/design-tokens/color)                                                                                                                                        | Primitive, semantic, and component tokens are separated; action and feedback provide on-light/on-dark roles.                                                                          | Supports context-aware foregrounds and limits component aliases to real exceptions.                               | Its public-service palette and component scope are unrelated to NosLog identity.                 |
| [Spotify design](https://spotify.design/article/better-in-black-rethinking-our-most-important-buttons), [Web player](https://webplayer.byspotify.com/)                                                                | A dark, content-led music product can keep the shell restrained while art and one functional accent carry identity; button changes are accessibility-tested.                          | Supports `PR-08`: jacket/content expression plus a limited action accent.                                         | Spotify is playback-first and permanently dark; NosLog also supports Light and analytical tasks. |
| [NOSTALGIA official product guide](https://www.konami.com/arcadegames/products/am_nostalgia/)                                                                                                                         | Officially, blue notes guide the left hand and red notes guide the right hand.                                                                                                        | Preserves left/right hand semantics as domain colors, not generic action/status colors.                           | Official marketing presentation is not a web accessibility or layout standard.                   |
| Current NosLog browser evidence                                                                                                                                                                                       | The neutral shell is calm, but a single surface and near-white interaction treatment provide weak material and brand distinction.                                                     | Supplies migration baseline, real content, and state stress cases.                                                | Current UI is not the 2.0 visual authority.                                                      |
| Current NosLog code and approved briefs                                                                                                                                                                               | Existing tokens cover many domain roles and complete System/Dark/Light is already approved; hard-coded renderer and utility values reveal drift.                                      | Supplies implementation mapping and the complete domain-collision inventory.                                      | Existing values and names are not automatically retained.                                        |

## Research Convergence

The sources differ in exact neutral values, hue, radius, and shadow depth. They
converge on the following transferable rules:

1. Components author semantic roles; themes map those roles to appearance-specific
   values.
2. Dark is not a numeric inversion of Light. Dark depth needs controlled surface-value
   changes because shadows alone become weak.
3. Neutral surfaces should dominate; saturated color is reserved for action, status,
   domain meaning, data, or limited expression.
4. Foreground, background, border, and interaction-state colors form tested pairs.
5. Focus is a functional accessibility signal and must remain visible on every
   supported surface, image edge, and appearance.
6. Status and domain color always receive text, icon, shape, position, pattern, or
   another non-color cue.
7. Not every grouped block is a raised card. Whitespace, flat regions, dividers, and
   borders remain valid grouping tools.
8. Shadows are most justified by transient stacking, movement, overlap, or scroll
   boundaries; they are not default decoration for every card.
9. A small, purpose-named radius vocabulary is more governable than page-local corner
   values. Full rounding is a specialized control/indicator shape, not a universal
   container style.
10. Contrast must be tested in real states and compositions, including Dark, Light,
    System changes, `200%` text, forced colors/high contrast, and bright/dark artwork.

## Disagreement and Limits

- Systems disagree on the number of surface levels. Apple uses a compact base/elevated
  distinction; Atlassian exposes sunken/default/raised/overlay; Material offers a
  larger container range. NosLog should choose the smallest inventory that covers its
  verified page, viewer/editor, card, menu, and dialog needs.
- Systems disagree on shadow prominence. Fluent provides a broad ramp, while Spectrum
  reserves one shadow mainly for transient surfaces. NosLog's dark, dense, content-led
  direction favors restraint, but exact levels require specimens.
- Music products demonstrate content-led color, but jacket-derived background tint can
  destabilize contrast and produce bright flashes. It remains optional and local, not
  a default Foundation rule.
- A brand accent can also mark selected state, but focus must not become invisible when
  that same accent appears in artwork, domain colors, or filled controls.
- Domain hues may resemble status hues. Token separation alone is insufficient; when
  meanings co-occur, labels and other cues must prevent ambiguity.

## Candidate Architecture

### Candidate C1 — Neutral surface model

| Option                  | Model                                                       | Advantages                                                                                     | Risks                                                                                                                      |
| ----------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `C1-A` Minimal          | `canvas`, `surface`, `overlay`, `scrim`                     | Calm and lean                                                                                  | Cannot name viewer/editor wells or distinguish flat grouped content from genuinely raised content without local exceptions |
| `C1-B` Purpose-complete | `canvas`, `surface`, `sunken`, `raised`, `overlay`, `scrim` | Covers all verified NosLog spatial roles; values can stay close while purpose remains explicit | Requires strict rules so normal cards do not all become raised                                                             |
| `C1-C` Large tonal ramp | Multiple numbered containers plus all C1-B roles            | Fine-grained theming                                                                           | Encourages arbitrary local choice and exceeds v0.1 needs                                                                   |

**Proposed recommendation:** `C1-B`. It is the smallest model that covers current
page canvas, flat groups, chart viewer/editor wells, movable or emphasized raised
content, menus/dialogs, and modal scrims without overloading one `surface` token.

Proposed usage boundaries:

- `canvas`: page and shell baseline;
- `surface`: flat grouped content and standard component background;
- `sunken`: bounded visualization, editor, code/data, or media wells that visually
  recede;
- `raised`: content whose priority, movement, or overlap genuinely places it above
  `surface`;
- `overlay`: menu, popover, tooltip, sheet, dialog, and other transient top layer;
- `scrim`: modality/background suppression only, never a content surface.

### Candidate C2 — Accent and focus ownership

| Option                   | Model                                                                                                                                                                                              | Advantages                                                           | Risks                                                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `C2-A` Unified           | One accent owns primary action, link, selected, and focus                                                                                                                                          | Small vocabulary                                                     | Focus can disappear against accent fills, artwork, and domain hues; brand and accessibility become coupled |
| `C2-B` Separated focus   | A separately governed signature/accent family is available only for approved identity or rare action emphasis; neutral interaction remains the default; a dedicated focus pair owns keyboard focus | Reliable focus, restrained color use, and easier future brand tuning | Requires explicit component-level governance instead of automatically recoloring every interaction         |
| `C2-C` Achromatic action | Near-white/near-black actions, with color used only for domain/status                                                                                                                              | Very restrained                                                      | Weak NosLog action identity and limited selected-state affordance                                          |

**Approved interpretation:** `C2-B` separates the possible signature/accent family
from keyboard focus; it does not require that family to color every primary action,
link, selected state, or interactive control. Neutral treatment is the default. A
component may use the signature family only when its identity or truly primary action
role has been separately demonstrated and approved. The accent must not own success,
danger, hand, difficulty, rank, score, or chart series. Focus is tested independently
and may use a two-color treatment when one outline cannot stay visible across every
surface.

### Proposed semantic color families

This is a role inventory, not a value list.

| Family                       | Proposed roles                                                                                                                            | Boundary                                                                                                                                                                                                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neutral surface              | `canvas`, `surface`, `sunken`, `raised`, `overlay`, `scrim`                                                                               | Spatial/material relationship only                                                                                                                                                                                                                            |
| Neutral foreground           | `text-primary`, `text-secondary`, `text-tertiary`, `text-disabled`, `icon-primary`, `icon-secondary`, `on-accent`, `on-status`, `inverse` | Disabled is not a substitute for secondary copy                                                                                                                                                                                                               |
| Neutral boundary             | `divider`, `border-subtle`, `border-default`, `border-strong`                                                                             | Required controls cannot rely on a decorative low-contrast divider                                                                                                                                                                                            |
| Signature/accent eligibility | Candidate roles such as `accent-solid`, `accent-solid-hover`, `accent-solid-pressed`, `accent-text`, and `accent-border`                  | Tokens describe eligible treatments, not mandatory propagation. Use is limited to separately approved identity touchpoints and rare primary-action emphasis; ordinary links, filters, selection, containers, and difficulty labels remain neutral by default. |
| Focus                        | `focus-outer`, optional `focus-inner`                                                                                                     | Keyboard focus only; independent from selected/error                                                                                                                                                                                                          |
| Feedback                     | For each of `info`, `success`, `warning`, `danger`: `foreground`, `surface`, `border`, optional `solid`, `on-solid`                       | Always paired with text/icon and correct ARIA/state semantics                                                                                                                                                                                                 |
| Domain                       | `hand-left`, `hand-right`, four difficulties, `mode-basic`, `mode-recital`, rank/achievement roles, score emphasis                        | Preserves NOSTALGIA meaning; never reused by component intent                                                                                                                                                                                                 |
| Data                         | Sequential, diverging, categorical, threshold, grid, axis, selection roles                                                                | Values deferred to Batch D; cannot silently reuse domain/status colors                                                                                                                                                                                        |
| External brand               | `discord` and any later approved external brand role                                                                                      | Only where external identity is required                                                                                                                                                                                                                      |

### Candidate C3 — Domain collision policy

**Proposed policy:** semantic ownership takes priority over hue identity.

- Left/right hand remain explicit labeled cyan/red-family domain roles based on
  official NOSTALGIA meaning. They are not `info`/`danger`.
- Difficulty, mode, rank, achievement, score, genre, status, and chart roles receive
  separate semantic names even when two approved values later share a nearby hue.
- When two meanings occur in one component or chart, color is supplemented by visible
  abbreviation, label, icon, pattern, position, line style, or shape.
- Genre color is not assumed necessary merely because current code defines it. Its
  usefulness and collision cost must be reviewed in a later focused decision.
- Data series cannot take arbitrary unused domain colors. Batch D must build an
  accessible visualization palette after Batch C ownership is approved.

### Candidate C4 — Border, radius, and elevation model

#### Border proposal

- `1px` is the proposed default structural border/divider primitive.
- `2px` is reserved as a candidate for selected, focused, or strongly emphasized
  boundaries where measured contrast and area require it.
- Border visibility and width must be paired by semantic state; width alone or hue
  alone cannot carry selection/focus/error.
- Hairlines below one CSS pixel are not shared v0.1 tokens.

The exact primitives remain unapproved until specimens confirm them.

#### Radius alternatives

| Option                           | Model                                                                 | Advantages                                                    | Risks                                                           |
| -------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- |
| `R-A` One radius + full          | One standard container radius and full rounding                       | Very lean                                                     | Does not distinguish nested controls, cards, and large overlays |
| `R-B` Three purpose roles + full | `radius-control`, `radius-container`, `radius-overlay`, `radius-full` | Small but expressive; supports nesting and material hierarchy | Exact values and component mapping require specimen review      |
| `R-C` Broad size ramp            | Five or more corner sizes plus full                                   | Flexible                                                      | Recreates arbitrary page-local styling and weakens identity     |

**Proposed recommendation:** `R-B`, with exact values deferred. A child control must
not visually exceed the containing surface radius unless it is intentionally full.
Full rounding is limited to circular controls, avatar/status dots, compact chips, and
controls whose shape has a documented purpose.

#### Elevation proposal

- Flat `canvas`, `surface`, and `sunken` use value, spacing, and border without default
  shadow.
- `raised` may use a restrained shadow only when lift, movement, overlap, or emphasis
  is real.
- `overlay` uses surface value plus boundary and shadow; Dark must not rely on shadow
  alone.
- `scrim` indicates modality but does not replace focus trapping, dialog semantics,
  Escape/close behavior, or background inertness.
- A scroll-boundary shadow is a separate directional affordance, not a general
  elevation level.
- Viewer and editor renderers may define internal visual depth, but their surrounding
  shell still maps to these shared roles.

## Appearance Contract

- `System` resolves from the operating-system preference and responds to a preference
  change without losing current task state.
- Explicit `Dark` and `Light` override System on the current device.
- Semantic token names and component authorship remain identical across appearances;
  only mapped values and appearance-specific assets change.
- Dark layers generally become lighter as they rise. Light hierarchy can use surface,
  border, and restrained shadow; it is not a direct inversion of Dark.
- Text, icon, control, focus, status, domain, visualization, image edge, and overlay
  contrast are verified separately in both appearances.
- Browser `forced-colors` and high-contrast behavior must preserve boundaries, focus,
  selection, and status. Decorative shadows and background tints are not trusted.
- Jacket and avatar assets need edge treatment only when their boundary is necessary
  to understand or operate the component.

## Approved C5 Neutral Primitive Source

The user approved [Adobe Spectrum S2 grayscale token data](https://opensource.adobe.com/spectrum-design-data/tokens/color-palette/)
as the governing primitive source for the NosLog 2.0 Dark/Light neutral foundation
on 2026-08-08. The review compared the same C5 role
order and Dark/Light structure across ten production systems: IBM Carbon, GitHub
Primer, Adobe Spectrum S2, Microsoft Fluent 2, Atlassian, SAP Fiori Horizon, Radix
Slate, Material 3, Ant Design, and Red Hat PatternFly. Current NosLog values remained
rejected migration evidence rather than a continuity candidate, and the over-accented
`FCM-11`/`SIG-07` specimen was excluded.

The approval has the following exact boundary:

1. Use the published Spectrum S2 grayscale values as the only neutral primitive
   source for both Dark and Light.
2. Preserve the source values exactly. Do not substitute Tailwind colors, merge the
   current custom Dark values, retain the TDS-derived Light values, or introduce a
   local hue shift to make a role look more “NosLog-like.”
3. Adopt the neutral primitive source, not Adobe component styling, spacing,
   typography, accent colors, brand expression, radius, shadow, or page composition.
4. Map these primitives to the approved NosLog roles through the invariant primitive
   → semantic → component-alias architecture. The exact role assignment remains
   `Proposed` until measured representative specimens are reviewed.
5. If a direct source-primitive mapping cannot satisfy contrast, state distinction,
   artwork adjacency, or forced-colors requirements, do not silently alter the
   primitive. Report the conflict and reopen the mapping or source decision.

### Approved source primitives

The following values are copied from the published Spectrum S2 grayscale data. Their
membership in the source ramp is `Approved`; assigning any row to a NosLog semantic
role is still pending.

| Spectrum S2 primitive | Light     | Dark      |
| --------------------- | --------- | --------- |
| `gray-25`             | `#ffffff` | `#111111` |
| `gray-50`             | `#f8f8f8` | `#1b1b1b` |
| `gray-75`             | `#f3f3f3` | `#222222` |
| `gray-100`            | `#e9e9e9` | `#2c2c2c` |
| `gray-200`            | `#e1e1e1` | `#323232` |
| `gray-300`            | `#dadada` | `#393939` |
| `gray-400`            | `#c6c6c6` | `#444444` |
| `gray-500`            | `#8f8f8f` | `#6d6d6d` |
| `gray-600`            | `#717171` | `#8a8a8a` |
| `gray-700`            | `#505050` | `#afafaf` |
| `gray-800`            | `#292929` | `#dbdbdb` |
| `gray-900`            | `#131313` | `#f2f2f2` |
| `gray-1000`           | `#000000` | `#ffffff` |

This source approval advanced C5 without completing it. Documents `34`–`44`
subsequently assigned and validated the exact `M-A` surface, `F-A` foreground,
`NB-A` boundary, `NI-A` interaction, and `FI-C` focus mappings. Signature color,
feedback and visualization color, exact material dimensions, component aliases, and
application implementation remain separate gates.

## Approved Restrained-Color Budget

The user approved the following boundary after rejecting an over-accented specimen on
2026-08-08. This decision supersedes any earlier wording that could be read as
automatically assigning the signature family to every link, selected state, filter,
or primary-looking control.

1. The shared UI is overwhelmingly neutral. Typography, spacing, alignment, value,
   and thin boundaries establish normal hierarchy before color is considered.
2. Ordinary containers do not receive signature-colored fills, tints, or borders.
3. Applied filters remain neutral and communicate state through copy, checkmarks,
   count, weight, or structure rather than a colored container.
4. Selection remains neutral by default and uses checkmarks, border weight, type
   weight, position, or other non-color cues. A tinted selected container is not the
   default pattern.
5. Difficulty and other domain colors are not automatically shown in ordinary list,
   grid, filter, or navigation text. Each visible domain-color use must prove a real
   scanning or comprehension benefit in its own decision.
6. A future signature color is reserved first for stable identity touchpoints. A rare
   truly primary action may use it only after that specific use is compared against a
   neutral treatment and approved.
7. Repeated accent marks competing within one viewport are a validation failure, not
   a stronger brand treatment.
8. The signature family never becomes a shortcut for missing hierarchy, unclear
   grouping, or weak affordance.

## Required Candidate Specimens

No palette value is eligible for approval from swatches alone. A later visual specimen
must include:

1. S1 list and grid result with light, dark, saturated, and missing jacket art;
2. S2 best score, rank, FC/Pianist, judgement, trend, and partial/empty states;
3. S3 dense ranking rows, current-user selection, tie, disabled/ineligible state, and
   pagination;
4. S4 falling/full-sheet viewer with hand cues, renderer boundary, controls, error,
   fullscreen, and local-audio states;
5. S5 Home with search preview, destination collection, service notice, routine news,
   official news, empty/error states, and N mark;
6. flat content, sunken well, raised content, menu/popover, dialog, scrim, and scroll
   boundary in one controlled comparison;
7. default, hover, pressed, selected, focus-visible, disabled, loading, info, success,
   warning, and danger states;
8. Korean, Japanese, and English at default and `200%` text across `320`, `390`,
   intermediate, and wide content regions;
9. Dark, Light, System changes, forced colors/high contrast, and representative color
   vision deficiency simulation;
10. automated contrast-pair report plus manual visual and keyboard review.

## Decision Batches

| Batch | Decision                                                                                             | Current status                                                                                     |
| ----- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `C1`  | Neutral surface inventory and purpose                                                                | `Approved — C1-B`                                                                                  |
| `C2`  | Restrained signature/accent eligibility and independent focus ownership                              | `Approved — C2-B as separation only; neutral interaction remains default`                          |
| `C3`  | Feedback/domain/data collision policy                                                                | `Approved — semantic ownership and non-color cues`                                                 |
| `C4`  | Border, radius, elevation, and scrim architecture                                                    | `Approved architecture — exact values pending C5`                                                  |
| `C5`  | Restrained color-use boundary, exact Dark/Light values, and signature hue through measured specimens | `Neutral/focus mapping and SS-08 identity source approved; material and component aliases pending` |
| `C6`  | Integrated S1–S5 appearance validation and Foundation promotion                                      | `Blocked by C5`                                                                                    |

Approval of one batch does not approve another. Exact values cannot be chosen until
the role architecture they instantiate is approved.

## Decision Log

| ID       | Entry                                                                                                                                                                                                   | Status                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `FCM-01` | Treat the current neutral shell and token inventory as migration evidence, not the 2.0 palette.                                                                                                         | `Observed`                                                                                               |
| `FCM-02` | Preserve complete System/Dark/Light support and Dark as the representative art-direction anchor.                                                                                                        | `Approved upstream`                                                                                      |
| `FCM-03` | Use a primitive → semantic → component-alias architecture with invariant semantic names across appearances.                                                                                             | `Proposed`                                                                                               |
| `FCM-04` | Adopt the purpose-complete C1-B neutral surface inventory.                                                                                                                                              | `Approved — 2026-08-08`                                                                                  |
| `FCM-05` | Separate possible signature/accent ownership from focus through C2-B without requiring color on ordinary interactions.                                                                                  | `Approved; clarified — 2026-08-08`                                                                       |
| `FCM-06` | Preserve NOSTALGIA domain colors under separate roles and require non-color cues and collision review.                                                                                                  | `Approved — 2026-08-08`                                                                                  |
| `FCM-07` | Use R-B's three purpose radius roles plus full rounding, with exact values deferred.                                                                                                                    | `Approved — 2026-08-08`                                                                                  |
| `FCM-08` | Keep shadows off default flat content and reserve them for justified raised, overlay, or scroll-boundary relationships.                                                                                 | `Approved — 2026-08-08`                                                                                  |
| `FCM-09` | Defer semantic role mapping, signature hue, and visualization colors until approved-role specimens; FCM-12 resolves only the neutral primitive source.                                                  | `Partially superseded; signature resolved in document 47; visualization and material remainder proposed` |
| `FCM-10` | Make neutral treatment the default for containers, links, filters, selection, and ordinary domain labels; reserve signature color first for identity and only separately approved rare primary actions. | `Approved — 2026-08-08`                                                                                  |
| `FCM-11` | Reject the over-accented signature-color comparison that colored selected containers, filter state, links, and multiple competing elements. It is not guide or production authority.                    | `Rejected — 2026-08-08`                                                                                  |
| `FCM-12` | Adopt the published Adobe Spectrum S2 grayscale values as the sole Dark/Light neutral primitive source; this source approval does not itself approve a semantic mapping.                                | `Approved — 2026-08-08; mapping approved later in documents 34–44`                                       |
| `FCM-13` | Adopt intact `SS-08` Radix Colors Indigo as the NosLog identity source while keeping exact identity/action component aliases and rare-action eligibility as later gates.                                | `Approved — 2026-08-10`                                                                                  |

## Approved First Review — 2026-08-08

After reviewing an interactive role specimen, the user approved the following:

1. `C1-B`: use `canvas`, `surface`, `sunken`, `raised`, `overlay`, and `scrim`, while
   ordinary cards remain flat `surface` unless a real depth relationship exists;
2. `C2-B`: keep a still-unselected signature/accent family semantically separate from
   keyboard focus; its exact eligible uses remained unresolved at this review;
   and
3. reserve shadow for justified `raised`, `overlay`, and scroll-boundary relationships
   instead of decorating every card.

This approval establishes role ownership only. The specimen's temporary colors,
geometry, radii, border values, shadow values, typography, and page composition are
not approved production styling. The signature hue, exact neutral values, radius
values, and border/shadow dimensions remain intentionally undecided.

## Approved Second Review — 2026-08-08

The user approved the remaining C3 and C4 architecture recommendations:

1. preserve hand, difficulty, mode, rank, achievement, score, feedback, and later data
   colors under separate semantic ownership, with visible non-color cues wherever
   meanings can collide;
2. use `1px` as the default structural border/divider primitive, reserve `2px` for
   selected, focused, or strongly emphasized boundaries when the measured state needs
   it, and do not create a shared sub-CSS-pixel hairline token; and
3. use R-B's `radius-control`, `radius-container`, `radius-overlay`, and
   `radius-full` roles, while deferring their exact values to measured specimens.

Together with the first review, this completes C1–C4 role architecture. It does not
approve a signature hue, neutral palette, exact Dark/Light values, border colors,
radius dimensions, shadow dimensions, or visualization palette. Those decisions move
to C5 research and specimen review.

## Approved Third Review — Restrained Color Use — 2026-08-08

The user rejected a later comparison specimen because it spread candidate accent
color across selected-chart containers, filter state, links, difficulty text, and
other repeated elements. That specimen is historical rejected evidence only and must
not be used by Claude Design or implementation as a visual source.

The replacement decision is the **Approved Restrained-Color Budget** above. C2-B now
means separation of signature/accent from focus, not automatic colored ownership of
all interaction states. Exact neutral values, the existence and hue of a canonical
master color, and any rare primary-action exception remain C5 questions for a new
review. No color specimen is approved at this checkpoint.

## Approved Fourth Review — Spectrum S2 Neutral Source — 2026-08-08

After requesting a broader comparison because neutral color occupies most of the
interface, the user reviewed ten production-system Dark/Light sources under the same
C5 role order. The user selected Adobe Spectrum S2 and explicitly approved the scope
recorded in `FCM-12`: preserve its published grayscale primitive values exactly and
map them to NosLog semantic roles without importing Adobe's component language or
other visual-system decisions.

This is approval of the master neutral primitive source and its published values. It
is not approval of the provisional role mapping shown during comparison, nor of
signature, focus, feedback, domain, data-visualization, border, shadow, radius, or
component values. Those remain separate measured decisions.
