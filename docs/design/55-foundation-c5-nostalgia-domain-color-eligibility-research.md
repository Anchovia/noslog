# NosLog 2.0 C5 NOSTALGIA Domain Color Eligibility Research

## Document control

- Status: `Corrected — renderer hand colors preserved; UI difficulty mapping pending`
- Canonical language: English
- Korean companion:
  [55-foundation-c5-nostalgia-domain-color-eligibility-research.ko.md](./55-foundation-c5-nostalgia-domain-color-eligibility-research.ko.md)
- Date: 2026-08-10
- Parent research:
  [document 53](./53-foundation-c5-feedback-domain-data-color-reference-research.md)
- Scope: Package `13B` eligibility for visible NOSTALGIA-domain color outside the
  locked chart viewer/editor renderers
- Inputs: official NOSTALGIA guidance; six rhythm-game production systems; five
  accessibility/design authorities; three data-color systems; current NosLog code
  and approved NosLog 2.0 Foundation decisions
- Excludes: approval of exact domain hex values; `13C` chart/data palettes; final
  iconography; production implementation; reopening `13A` feedback, identity,
  interaction, neutral, or focus ownership; any redesign or recoloring of the
  existing PixiJS/WebGL or Canvas chart renderers and editor rendering model

This document determines which domain roles have enough evidence to enter a later
exact-value comparison. Appearance in this document does not approve a color, and
the current NosLog 1.x values remain migration evidence only.

## Locked upstream authority

1. Spectrum S2 owns all neutral surfaces and foregrounds.
2. `FS-BN` owns information, success, warning, danger, and destructive feedback.
3. Radix Indigo owns signature identity only and has no generic domain alias.
4. Ordinary labels, selectors, cards, links, and data remain neutral unless a
   separate role proves that color materially improves recognition.
5. Tailwind colors, current custom values, sampled marketing gradients, and
   interpolated ramps are not source authority.
6. Domain color must retain a visible name, number, symbol, shape, position, or
   pattern so color is never the only carrier.
7. Approved chart-viewer decision `VIEW-07` locks the existing renderer and chart
   mathematics outside redesign scope. Its current note and hand palette is a
   preserved implementation exception, not a Foundation token candidate.

## Question being resolved

The `13B` gate is not a request for one decorative palette. It asks two sequential
questions:

1. Which NOSTALGIA meanings are eligible for persistent visible color in NosLog?
2. For eligible meanings only, is there an exact, attributable Light/Dark source
   that can be adopted without inventing values?

This document answers only the first question. The second requires a later
source-value comparison and explicit user approval.

## Current NosLog migration audit

| Current evidence                        | Observed use                                                                      | 2.0 finding                                                                                                                                  |
| --------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/globals.css` difficulty variables  | Custom Normal green, Hard ochre, Expert red, and Real purple in both appearances  | The values have no recorded NOSTALGIA or maintained-system provenance. They cannot be promoted by familiarity.                               |
| `app/globals.css` mode variables        | Custom Basic blue and Recital pink                                                | The official product distinguishes the modes by task and scoring, but no stable official color contract was found.                           |
| `app/globals.css` rank variables        | P gradient, FC green, S gold, and A-family reds                                   | Rank and achievement are being treated like decorative status colors and can collide with `FS-BN` success, warning, and danger.              |
| `app/globals.css` genre variables       | Six persistent category hues                                                      | No current task evidence proves that genre color improves scanning beyond the visible category label.                                        |
| `components/tiers/tierRecordDetail.tsx` | `FAST` reuses `text-chart`; `SLOW` reuses `text-hard`                             | Timing direction, data series, and Hard difficulty have ambiguous ownership.                                                                 |
| Chart viewer/editor renderers           | Existing PixiJS and Canvas note/hand colors, geometry, animation, and mathematics | Locked by `VIEW-07` and the user's 2026-08-10 correction. Preserve exactly; do not promote, replace, compare, or remap as Foundation tokens. |
| Music list and grid cards               | Colored difficulty text/subtle fills and colored genre labels                     | Dense repeated color competes with title, record, selection, and feedback hierarchy.                                                         |

No audited non-renderer literal or CSS variable is grandfathered into 2.0. The chart
viewer/editor renderer constants are not grandfathered Foundation values; they are a
separate locked implementation exception that remains unchanged.

## Research method

Sources were counted by independent product or guidance system, not by page count.
Multiple pages from one product are one reference. The set covers:

- direct NOSTALGIA authority;
- production rhythm-game conventions;
- game and web accessibility requirements;
- UI/domain/data ownership separation; and
- current NosLog task evidence.

The research continued until additional sources no longer changed the role-eligibility
patterns: direct gameplay cues can use redundant color; difficulty can use restrained
color when it improves repeated chart scanning; other domain labels remain text-first
unless a stronger product-specific contract exists.

## Fourteen independent systems across fifteen source groups

|   # | Source group                                                                                                                                                                                                                  | Transferable evidence                                                                                                                                                   | NosLog applicability                                                                                                     | Limitation                                                                                                        |
| --: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
|   1 | [Official NOSTALGIA Op.3 how-to](https://p.eagate.573.jp/game/nostalgia/op3/howto/entrance.html)                                                                                                                              | Explicitly says blue notes guide the left hand and red notes guide the right hand; names Normal, Hard, Expert, optional Real, Basic, Recital, Grade, and exams in text. | Direct authority for hand semantics and the complete domain vocabulary.                                                  | Publishes no accessible web token values and does not state that every named domain role owns a persistent color. |
|   2 | [Official NOSTALGIA KAC](https://p.eagate.573.jp/game/kac/kac9th/nostalgia/index.html)                                                                                                                                        | Basic and Recital are separate competition divisions; difficulty and score are shown as explicit text and numbers in dense tables.                                      | Shows that mode, difficulty, rank, and score remain understandable in information-heavy contexts without relying on hue. | Tournament presentation is not the cabinet UI and does not define a Light/Dark palette.                           |
|   3 | [Official beatmania IIDX difficulty guidance](https://p.eagate.573.jp/game/2dx/26/howto/play/tenkey.html) and [play-data states](https://p.eagate.573.jp/game/2dx/26/howto/epass/play_data.html)                              | Explicitly maps Normal blue, Hyper yellow, and Another red while retaining names, order, level, and separate clear-state labels.                                        | Strong production precedent for redundant difficulty color in high-frequency rhythm-game scanning.                       | It is a different game, has no Real equivalent, and its palette cannot be copied as NOSTALGIA authority.          |
|   4 | [Official DanceDanceRevolution play guidance](https://p.eagate.573.jp/game/ddr/ddra/p/howto/how_basic.html)                                                                                                                   | Beginner, Basic, Difficult, Expert, and Challenge are always named and explained as an ordered set.                                                                     | Supports labels, order, and level as the durable difficulty contract.                                                    | The page does not publish an adoptable Light/Dark web palette.                                                    |
|   5 | [Official SOUND VOLTEX play guidance](https://p.eagate.573.jp/game/sdvx/vii/howto/play.html)                                                                                                                                  | Novice, Advanced, Exhaust, and Maximum use persistent names and progression descriptions.                                                                               | Confirms that difficulty comprehension cannot depend on hue alone.                                                       | Surface art and game-specific hues are not transferable NosLog tokens.                                            |
|   6 | [Official CHUNITHM play guidance](https://chunithm.sega.jp/play/)                                                                                                                                                             | Note types use several colors with distinct actions; difficulty retains explicit Advanced/Expert names and level context.                                               | Separates gameplay-object color from difficulty and ordinary UI labels.                                                  | Different controls and note semantics; no NosLog role values.                                                     |
|   7 | [osu! difficulty guidance](https://osu.ppy.sh/wiki/en/Beatmap/Difficulty) and [grade guidance](https://osu.ppy.sh/wiki/en/Gameplay/Grade)                                                                                     | Difficulty color follows a continuous star-rating spectrum while names and numeric ratings remain visible; grades are ordered letters shown with scores.                | Demonstrates restrained color tied to a numeric model rather than arbitrary named swatches; outcomes remain label-first. | Its continuous star model does not match NOSTALGIA's four named chart types.                                      |
|   8 | [W3C WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) and [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)                                                  | Color may reinforce meaning but cannot be the only visual carrier; meaningful graphical cues need sufficient adjacent contrast.                                         | Governs all hand, difficulty, result, and timing treatments.                                                             | Does not choose domain ownership or values.                                                                       |
|   9 | [Xbox Accessibility Guidelines 102](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/102) and [103](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103) | Gameplay cues need contrast and additional sensory/visual channels; color-dependent elements should support alternate cues or configurable colors.                      | Directly relevant to left/right chart guidance and color-vision-deficiency testing.                                      | Game guidance does not supply NOSTALGIA defaults.                                                                 |
|  10 | [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility/)                                                                                                                  | Use shapes/icons/text in addition to color and test both appearances.                                                                                                   | Accessibility evidence only; it does not reopen the locked renderer or authorize a hand-color override.                  | Apple system colors are not NOSTALGIA source values.                                                              |
|  11 | [GitLab Pajamas color](https://design.gitlab.com/product-foundations/color/)                                                                                                                                                  | UI and data-visualization palettes are separate, and Dark UI generally needs less color.                                                                                | Supports keeping domain labels restrained and preventing chart or status colors from leaking into them.                  | Not a game-domain palette.                                                                                        |
|  12 | [SAP Fiori data visualization](https://experience.sap.com/fiori-design-web/explore_group/data-visualization/)                                                                                                                 | Qualitative, sequential, and semantic palettes have different jobs; one palette is used per chart and labels/patterns remain available.                                 | Moves score bands and FAST/SLOW charts to `13C` instead of treating them as global domain colors.                        | Business semantics and values are not NOSTALGIA authority.                                                        |
|  13 | [Atlassian data-visualization color](https://atlassian.design/foundations/color/data-visualization-color)                                                                                                                     | Default to one chart color; add categories only when differentiation is required; provide borders, spacing, and alternate formats.                                      | Prevents the approved `FS-BN` feedback colors from becoming arbitrary game/data colors.                                  | `13A` adoption does not authorize Atlassian chart colors for `13B`.                                               |
|  14 | [IBM Carbon data-visualization palettes](https://carbondesignsystem.com/data-visualization/color-palettes/)                                                                                                                   | Categorical colors are a distinct, ordered visualization subset intended for adjacent differentiation.                                                                  | Reinforces that genre, score bands, and timing charts need local data ownership rather than global label colors.         | The palette remains a `13C` candidate, not a `13B` source.                                                        |
|  15 | [Adobe Spectrum S2 tokens](https://opensource.adobe.com/spectrum-design-data/tokens/)                                                                                                                                         | Maintains adaptive neutral and semantic role families instead of making every label chromatic.                                                                          | Preserves approved neutral ownership around any future domain marker.                                                    | Spectrum primitives do not automatically approve a NOSTALGIA domain alias.                                        |

## Cross-source convergence

The sources converge on seven findings:

1. Gameplay-critical cues may use color when another visible cue carries the same
   meaning.
2. Rhythm-game difficulty frequently uses color for repeated scanning, but it always
   retains a name, level, order, or icon.
3. Another game's difficulty colors are evidence for the pattern, not values that can
   be copied into NOSTALGIA.
4. Mode is a task/scoring distinction; no stable cross-product pattern requires a
   persistent Basic/Recital hue.
5. Rank and achievement remain understandable through explicit names, numbers,
   symbols, order, and authentic result artwork.
6. Score bands and FAST/SLOW trends are threshold or diverging data, so their colors
   belong to local `13C` visualization contracts.
7. Genre color is optional decoration unless a real scanning test proves otherwise.

## Proposed role eligibility

This table records the approved eligibility policy. It does not approve exact values.

| Domain family              | Proposed visible-color eligibility                                         | Required non-color contract                                                                                                  | Exact-source status                                                                                      |
| -------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Renderer hand guidance     | `Excluded — preserve current implementation`                               | Existing renderer and paired legend retain their current text/color contract                                                 | No exact-source Gate; current PixiJS/Canvas values remain unchanged                                      |
| Difficulty                 | `Conditionally eligible` only in repeated-scanning UI outside the renderer | Full Normal/Hard/Expert/Real name or an unambiguous abbreviation, numeric level, fixed order, and independent selected state | Official vocabulary exists; exact web values are not published and remain unresolved                     |
| Basic/Recital mode         | `Not eligible` for persistent hue by default                               | Full mode label and neutral exclusive-selection state                                                                        | No stable official color ownership found                                                                 |
| Rank and achievement       | `Not eligible` for a generated global palette                              | Rank/achievement name, score/criterion, order, and optional authentic asset/icon                                             | Existing official artwork may retain literal artwork color, but no generated service palette is approved |
| Score band                 | `Move to 13C`                                                              | Numeric threshold, named band, ordered axis or table                                                                         | Requires sequential/threshold data research, not a global domain token                                   |
| Genre                      | `Not eligible` by default                                                  | Visible category label                                                                                                       | No measured scanning benefit or official ownership found                                                 |
| FAST/SLOW timing direction | `Move to 13C` for charts; neutral in ordinary copy                         | Explicit FAST/SLOW label, signed magnitude, midpoint and direction                                                           | Requires a diverging local-data comparison; cannot reuse chart, Hard, info, or danger colors             |

## Policy alternatives for review

| Candidate                                | Visible domain color                                                                                   | Benefit                                                                                 | Cost/risk                                                                                 | Status                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- |
| `DE-A · Official minimum`                | No new non-renderer domain color                                                                       | Maximum restraint and no new mapping                                                    | Gives up possible difficulty scanning benefit                                             | `Not selected`                        |
| `DE-BR · Renderer-preserving task limit` | Difficulty markers only in proven repeated-scanning UI; existing renderer hand colors remain untouched | Preserves the locked viewer/editor while retaining the only unresolved UI scanning case | Requires one difficulty-only exact-source Gate and careful context boundaries             | `Approved correction — 2026-08-10`    |
| `DE-C · Broad legacy-like`               | Difficulty, mode, rank, achievement, score, and genre                                                  | Maximum visible categorization                                                          | Recreates current collisions, competes with content hierarchy, and lacks source ownership | `Rejected by approved DE-BR boundary` |

`DE-BR` supersedes the earlier `DE-B` wording. The earlier wording incorrectly allowed
the locked renderer hand palette to enter a new exact-source comparison. The user's
2026-08-10 correction resolves that conflict in favor of `VIEW-07`: only difficulty
markers outside the renderer remain open. No exact color is approved.

## Next exact-source gate under corrected `DE-BR`

1. Collect official NOSTALGIA difficulty evidence and record what is observable
   separately from what is published as a token.
2. Do not treat screenshot sampling as a published design token. If sampling is used
   for a visual-fidelity candidate, label its uncertainty and compare it against a
   neutral fallback.
3. Build actual NosLog content comparisons for repeated difficulty scanning outside
   the renderer in Light/Dark at desktop, `390px`, and `320px`.
4. Measure text, marker, boundary, and adjacent-color contrast; test color-disabled,
   forced-colors, protanopia, deuteranopia, and tritanopia views.
5. Obtain user approval for the difficulty mapping. Do not open a hand-color Gate.

If no exact attributable mapping survives these checks, the role remains neutral
rather than receiving an invented NosLog palette.

## Decision log

| ID       | Entry                                                                                                                    | Status                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `DCE-01` | Treat all current 1.x domain values as migration evidence, not 2.0 authority.                                            | `Observed`                         |
| `DCE-02` | Preserve the existing renderer hand palette exactly; do not treat it as a Foundation token or open an exact-source Gate. | `Approved correction — 2026-08-10` |
| `DCE-03` | Keep difficulty names, levels, order, and selection independent from color.                                              | `Approved — DE-BR`                 |
| `DCE-04` | Keep Basic/Recital, rank/achievement, and genre neutral by default.                                                      | `Approved — DE-BR`                 |
| `DCE-05` | Move score-band and FAST/SLOW visualization color to `13C`.                                                              | `Approved — DE-BR`                 |
| `DCE-06` | Supersede `DE-B` with renderer-preserving `DE-BR`; compare only UI difficulty values.                                    | `Approved correction — 2026-08-10` |

## Approval record and boundary

On 2026-08-10 the user corrected the Package `13B` boundary: the existing chart
viewer/editor renderer, including its note and left/right-hand palette, must remain
exactly as implemented and must not enter NosLog 2.0 Foundation redesign. `DE-BR`
supersedes the earlier `DE-B` wording. Only difficulty markers in repeated-scanning UI
outside the renderer may proceed to an exact-source comparison. Basic/Recital,
rank/achievement, and genre remain neutral by default; score bands and FAST/SLOW move
to `13C`. No exact difficulty value or production implementation is approved.
