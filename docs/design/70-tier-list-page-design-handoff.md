# 70 · Tier-List Page Design Handoff — 2026-08-20

This document hands the approved Tier-list design and its verification results to
implementation. It does **not** replace document 06, which remains the normative brief.
Where the two differ, document 06 governs and this document is wrong.

Figma file: `NosLog v2.0.0` — `cVbWCxhkfxFfHmAKLCyKrD`
Page: `P4 · Tier List 조립` — `1291:2`

> ⚠️ **The band model changed after these frames were built.** On 2026-08-20 the band
> contract was replaced (`TIER-26`–`TIER-28`, §7.1): bands became a multi-select filter and
> the result region became a stack under sticky band headers. **No P4 frame implements this
> yet.** Every frame in §1 still shows the superseded single-active-band model with a
> six-row navigator. Read §7.1 for the decided contract and treat the frames as pending
> rework for anything band-related. Everything else in this document — composition, score
> and achievement, the calculation guide, copy, contrast — is current.

---

## 1. Figma node map

### 1.1 Product frames

| Section                                 | Node         | Frames                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Tier · Compact 390`                    | `1291:3`     | Signed-out base `1291:4` (390×1114) · Signed-in compact `1321:104` (390×1186) · Detailed two-column `1323:191` (390×1695) · Filter layer `1334:267` (390×844) · Band selection open `1343:274` (390×1186) · Guide expanded Basic·S `1394:1989` (390×1599) · Basic·Full Combo `1397:2068` · Basic·Pianist `1397:2225` · Guide expanded Basic·Pianist `1397:27469` (390×1691) · Recital·S `1398:2313` · Guide expanded Recital·S `1398:2474` |
| `Tier · Intermediate 768 / 1024`        | `1428:2973`  | 768 five-column `1428:2974` (768×1198) · 1024 seven-column `1428:3120` (1024×1181)                                                                                                                                                                                                                                                                                                                                                         |
| `Tier · Wide 1280`                      | `1348:371`   | Rail exposed `1348:372` (1280×1252)                                                                                                                                                                                                                                                                                                                                                                                                        |
| `Tier · 결과 영역 상태 (셸 반복 없음)`  | `1344:359`   | Compact state board `1344:360` (1950×339, five states)                                                                                                                                                                                                                                                                                                                                                                                     |
| `Tier · 결과 영역 상태 · Wide 908`      | `1429:29791` | Light `1429:29792` · Dark `1429:29882` (both 4700×344, same five states at the Wide result-region width)                                                                                                                                                                                                                                                                                                                                   |
| `Tier · Compact 390 · Dark`             | `1352:492`   | `1352:493` · `1352:536` · `1352:613` · `1352:696` · `1352:764` · `1398:27749` · `1398:27854` · `1398:27928` · `1398:28247` · `1398:28371` · `1398:28445`                                                                                                                                                                                                                                                                                   |
| `Tier · Intermediate 768 / 1024 · Dark` | `1429:3211`  | `1429:3212` · `1429:3319`                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `Tier · Wide 1280 · Dark`               | `1352:26270` | `1352:26271` (1280×1252)                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `Tier · 결과 영역 상태 · Dark`          | `1352:26219` | `1352:26220`                                                                                                                                                                                                                                                                                                                                                                                                                               |

Light and Dark sections hold eleven frames each in Compact and two each in Intermediate.
Dark frames are clones with `setExplicitVariableModeForCollection(Color, '70:2')`.
Frame sizes and text-node counts are identical between modes.

Sections are laid out top to bottom in reading order: Light (Compact → Intermediate →
Wide → state boards), then Dark in the same order, then the 320 verification rows.

### 1.2 Verification frames

Section `Tier · 320 검증` — `1356:954` (3536×5126). Three locale rows of six frames, and
`Tier · 320 검증 · Dark (KO)` — `1429:29025` (3536×1710) for the Korean row in Dark. These
test 320px reflow and locale fit. They are **not** product states.

| Row      | Base         | Signed-in    | Detailed     | Filter layer | Band open    | State board  |
| -------- | ------------ | ------------ | ------------ | ------------ | ------------ | ------------ |
| KO Light | `1356:955`   | `1356:1082`  | `1356:1242`  | `1356:1399`  | `1358:1202`  | `1358:1390`  |
| JA Light | `1360:1299`  | `1360:1426`  | `1360:1586`  | `1360:1743`  | `1360:1818`  | `1360:2006`  |
| EN Light | `1361:1644`  | `1361:1771`  | `1361:1931`  | `1361:2088`  | `1361:2163`  | `1361:2351`  |
| KO Dark  | `1429:29026` | `1429:29069` | `1429:29143` | `1429:29228` | `1429:29296` | `1429:29396` |

Only the Korean row is duplicated in Dark. Locale fit is a metric property and does not
change with colour mode; the Dark row exists to prove nothing collapses at the minimum
width in Dark, not to re-test JA and EN wrapping.

### 1.3 Components created for this page

| Component          | Page                     | Node       | Variants                                |
| ------------------ | ------------------------ | ---------- | --------------------------------------- |
| `Checkbox`         | C4 · Forms & Feedback    | `1300:103` | 6 (`Checked` × `State`)                 |
| `Select`           | C4 · Forms & Feedback    | `1305:102` | 4 (Default / Filled / Focus / Disabled) |
| `SegmentedControl` | C5 · Search & Refinement | `1307:277` | 6 (`Segments` 2·3 × `Selected` × Focus) |

All three carry Light and Dark verification plates on their component pages.
`Select` derives every state colour from the matching `FormField` variant rather than
choosing its own. `SegmentedControl` reproduces the approved `ViewModeSwitch`
construction. `ViewModeSwitch` and `ContentScopeSwitch` remain their own components with
their own domain labels; `SegmentedControl` does not replace them.

### 1.4 Decision boards

Page `Z1 · 결정 기록` — `268:2`, approved section `268:3`. Pending section holds **0**.

| Board                                                                     | Node        |
| ------------------------------------------------------------------------- | ----------- |
| Tier controls = SegmentedControl · Select · Checkbox                      | `1294:7665` |
| Detailed card score band = right aligned                                  | `1330:7677` |
| Jacket score = `media-scrim` 60% + `content/on-media`                     | `1280:7674` |
| Achievement = grade icon + ring + `FC` label; unplayed unchanged          | `1367:7689` |
| Guide composition = C; weight chart per tier list; rating scope = all six | `1379:7745` |
| Guide body inset = none (flush); description and guide after mode+goal    | `1412:7757` |
| Band model = scroll multi-select, sticky header stack, default all        | `1434:8002` |
| Band checkbox arrival state = empty means unconstrained                   | `1445:8129` |

---

## 2. Three different "level" concepts

This is the single most confusable part of the page. All three are numeric, two are
floats, and they appear on the same screen. They are not interchangeable.

| Concept                          | Values                                                                                      | Source of truth                                                                                        | Where it appears                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| **Official level** (`공식 레벨`) | integers `1–12`; Real uses `1–3`                                                            | `nosdata-musics.json` → `levels[].level`; `TIER_REGULAR_LEVELS` / `TIER_REAL_LEVELS` in `lib/tiers.ts` | the level **filter**, and the detailed card's `Expert 12` line                                    |
| **Level constant** (`레벨 상수`) | float. The shipped dataset carries 7 values — `12.5`, `13`, `13.5` — all on **Real** charts | `levels[].constant`; schema `chart.level_constant` + `ChartLevelConstantHistory`                       | **not on this page.** It is a chart attribute and belongs to Music Detail (`music.levelConstant`) |
| **Tier constant** (`서열 상수`)  | `1.0 – 14.5`                                                                                | `TierBand.value` (Float); range stated by `tiers.weight.chartAria`                                     | the **band navigator** — a band _is_ the tier constant                                            |

Consequences that must survive implementation:

- The band navigator already exposes the tier constant. Do not add a second control for
  it; that would show the same number twice.
- The level filter must not be widened to level constants. Document 06 fixes the filter
  scope at difficulty and official level only.
- The two visible labels are deliberately different words and both exist in the
  catalogue: `tiers.officialLevel` (`공식 레벨`) and `tiers.bands` (`서열표 구간`).

---

## 3. Filter controls — why chips, not a slider

The official-level filter is a **set**, not a range, and it spans **two discontinuous
scales**:

```
regular scale   Normal · Hard · Expert   →  1 – 12
Real scale      Real                     →  1 – 3
```

The current product already encodes this as a comma list (`level=1,5,12`) and renders a
six-column chip grid split by scale. A two-handle slider expresses one continuous
interval and cannot select `Expert 12` together with `Real 3`, nor span two scales on one
track.

Discovery reached the opposite conclusion for its own level filter because that one is an
**inclusive range** with a per-difficulty cap. The rule that reconciles both:
**continuous interval → slider; discontinuous set → chips.**

Chip anatomy: unselected is `surface/canvas` with a `border/strong` 1px inside edge;
selected is a `primary/default` field with a check mark and `primary/on-primary` label.
The check mark is the non-colour cue. Targets are 44 on compact and 40 on desktop.

---

## 4. Result composition

### 4.1 Compact view — the default

Three columns at 390, derived as `(358 − 2 × 12) / 3 = 111.33`. At 320 the same rule
gives `(288 − 24) / 3 = 88`; the column count does not change.

| Auth state          | Card contents                                         |
| ------------------- | ----------------------------------------------------- |
| Signed out          | jacket only                                           |
| Signed in, played   | jacket + grade image slot + best score below, centred |
| Signed in, unplayed | jacket + `tiers.unplayed` below                       |

Signed-out cards carry no score, progress, Grd or achievement state. Document 06 forbids
placeholders there, and it also forbids repeating title, difficulty, Grd or rating
contribution inside the compact card — that information lives in the accessible name.

### 4.2 Detailed view — two columns

Two columns at 390 gives cards of exactly `173`, the same square as the C6 Music Grid
jacket. Below the jacket, in document 06's order: original title → difficulty and
official level → official Grd contribution → NosLog rating contribution.

The rating row is present on every played card, because each list defines its own rating
(`TIER-25`, §11.1). It is omitted where no contribution exists — an unplayed chart shows
`tiers.unplayed` and no rows below it — which is document 06's instruction to omit an
inapplicable metric rather than print an unavailable notice on every card.

Contribution values in the frames are computed, not invented: `constant² ÷ theoretical
max × 10,000` with the mastery curve's linear interpolation from `lib/tiers/basicRating.ts`,
over band `13.0` and a representative theoretical max of `11,830`. A score of `962,340`
yields `+36.5` and `984,600` yields `+85.9`.

Long titles wrap and the information region grows. The jacket stays square.

### 4.3 Column counts are derived, not fixed

The compact card has a measured minimum width of `111.33` — the value the 390 canvas
produces at three columns (`(358 − 2 × 12) / 3`). Every wider layout keeps that minimum
and adds columns only while it still holds:

```
largest n where  (content − (n − 1) × gutter) / n  ≥  111.33
```

| Width | Container | Margin | Gutter | Content | Columns | Card   |
| ----- | --------- | ------ | ------ | ------- | ------- | ------ |
| 390   | compact   | 16     | 12     | 358     | 3       | 111.33 |
| 320   | compact   | 16     | 12     | 288     | 3       | 88     |
| 768   | 8 col     | 24     | 16     | 720     | 5       | 131.2  |
| 1024  | 8 col     | 24     | 16     | 976     | 7       | 125.71 |
| 1280  | 12 col    | 32     | 16     | 908\*   | 7       | 116    |

\* At 1280 the rail takes `292` (3/12) and the result region `908` (9/12) with a `16`
gutter, matching the Discovery Wide shell.

Six columns at 768 would give `106.7` and eight at 1024 would give `108`; both fall under
the minimum, so the counts stop at five and seven. `TIER-19` requires exactly this:
density is container-driven, not one fixed product number. Mobile's 3 and desktop's 7
come from the same minimum card width.

Jackets are `1:1` and are re-squared in a second pass after all siblings are placed —
a `FILL` child does not have its final width until the row is complete.

### 4.4 Intermediate widths use the Compact contract

Between `672` and `1055` the page keeps the Compact interaction contract — band trigger
plus staged filter layer — and only the derived column count changes. The rail opens at
`1056`, the document 24 Intermediate/Wide boundary, with no page-local threshold invented.
This follows the 2026-08-19 shell decision, which aligned every page family's side-by-side
threshold with that boundary.

`OrdinaryFooter` uses `Layout=Wide` from `672` upward. Document 15's footer contract does
not state a width at which the variant switches, so this was derived by measurement: the
Wide single row needs roughly `547` and the Intermediate lower bound leaves `624`. See
§11.3 — the missing threshold is an open item for document 15, not a value this design
invented.

### 4.5 The calculation guide

The guide is one `Disclosure`. Collapsed it is a `36` high trigger row; expanded it adds,
in order:

1. `tiers.filterHelp`;
2. `tiers.updated`;
3. the rating-weight chart, when the selected list has a rating.

The list description is **not** repeated inside the guide — it sits directly above the
trigger, after the goal selector. The chart is last because it is the heaviest block and
the only one that appears and disappears with the goal; keeping it at the tail means the
top of the body is identical across all six mode-goal combinations.

The body carries **no horizontal inset**: its left edge is the trigger's left edge. The
C4 `Disclosure` component's own body inset (`padding-left 32`, aligning under the chevron)
is not used here, so this composition follows the component's contract without being an
instance of it. Verified precedent: Bootstrap 5.3 gives the accordion button and body the
same `$accordion-padding-x`, and Carbon's `indented` and `flush` variants both keep title
and content on one left edge. USWDS, GOV.UK, Spectrum and MUI were not verified.

The chart itself is carried over from the shipped `TierRatingWeightChart`, not invented:
line series, x axis of tier constants `1–14.5`, y axis of maximum contribution, a formula
footnote, and a goal-dependent footer (`sRequirement` / `fcRequirement`, or the score-ratio
table for Pianist). Tokens: panel `surface/surface` + `radius/container 8` and grid/axis
`border/default`, the pair approved for the pattern radar on 2026-08-13; series
`local-data/single`.

Two measured notes:

- **Y axis labels are required, not decorative.** Without them the gridlines would be the
  only carrier of magnitude, and `border/default` measures `1.61` (Light) / `1.77` (Dark)
  against `surface/surface` — below the `3:1` non-text threshold. With the axis labelled,
  magnitude is carried by text at `7.59` / `7.85` and the gridlines are alignment support.
  This reading differs from the pattern-radar decision, which called its grid "not
  decorative"; whether that component needs the same review is left open, see §11.3.
- **Tick density is derived.** The tick set is the densest of a candidate list that places
  without label collision at the settled plot width. At `284` this is
  `1 · 3 · 5 · 7 · 9 · 11 · 14.5`; only `13` has to drop, because `13` and `14.5` are
  `1.5` apart on a `1–14.5` axis.

The chart's scale uses a representative theoretical maximum of `11,830` (`13.0² × 70`),
because no band data is seeded in the repository. The y axis is therefore labelled
`0–200` and the top constant `14.5` lands at `177.7`. These are representative values, not
product values.

---

## 5. Score, grade and achievement

### 5.1 The jacket score band (`media-scrim`)

The detailed card places the personal best score in a translucent band across the bottom
of the jacket, using the roles approved on 2026-08-19:

- Ground `surface/media-scrim` — black at **60% in both modes**
- Foreground `content/on-media` — `#FFFFFF` in both modes
- Band height **36 = 20 line-height + 8 + 8**, derived from content
- Score right-aligned inside the band
- Flat band, never a gradient

`60%` is the value at which a white foreground clears `4.5:1` even over pure white
artwork (`5.74`). The calculated minimum is `55%`; the previously existing `scrim` at
`40%` fails in Light (`2.85` over white artwork, `3.37` over an empty slot). Because
artwork luminance is uncontrolled, no single foreground colour works without the band.

Measured in the assembled frames: `6.56 : 1` over the empty-slot jacket.

### 5.2 Grade is an image slot, not a colour

Document 24 `AC-01` states that score grade is **not** a colour role: it is the official
grade image, self-hosted from the game's published assets, and it needs an image slot
plus an accessible name. The frames therefore show a `24 × 24` slot at the jacket's
top-right, with `S` standing in for the artwork.

The frames now carry the **real asset**: `public/grade/grade_s.png`, uploaded into the
Figma file and applied to all 129 grade slots. The letter `S` that previously stood in for
the artwork is gone.

The self-hosted set already exists in the repository — `grade_s`, `grade_p`, `grade_a`,
`grade_a2`, `grade_b`, `grade_b2`, `grade_c`, `grade_d`, each `40 × 40`. **The code does
not use it.** These five call sites still hot-link
`p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade`:

- `components/tiers/tierChartCard.tsx`
- `components/music/ranking/rankImage.tsx`
- `components/music/recentPlayRow.tsx`
- `components/music/musicRecordTab.tsx`
- `lib/constants.ts`

So the change required by document 06 and `AC-01` is smaller than it looks: repoint the
references, not source new assets.

The code maps `FC → fc_bg`, but `public/grade/` has no `grade_fc_bg.png`. Under the
design in §5.3 this no longer blocks anything, because Full Combo is reported by the
ring and the `FC` label rather than by an icon. Add the asset only if the icon is
wanted elsewhere.

### 5.3 Two independent axes: rank icon and achievement ring

Score rank and combo achievement are **different axes**. A chart can be `S` _and_ Full
Combo at the same time, so they cannot share one slot:

| Axis              | Carrier                                           | Values                                                                 |
| ----------------- | ------------------------------------------------- | ---------------------------------------------------------------------- |
| Score rank        | the official grade image, top-right of the jacket | `S` `A+` `A` `B+` `B` `C` `D` and `P`                                  |
| Combo achievement | a 2px ring on the jacket border                   | Full Combo → `achievement/full-combo`; Pianist → `achievement/pianist` |

The current implementation collapses this with a priority chain
(`pianist > fc > s > a_plus > rank`) and shows only one icon. The design shows both: the
`S` image stays in the icon slot while a green ring reports the Full Combo.

`AC-01` requires that the mark always carries a short label and that colour never conveys
the achievement alone. That label sits **next to the score**, not over the icon:

- Detailed card — the `media-scrim` band runs the full jacket width, so `FC` sits at its
  left and the score at its right.
- Compact card — `FC` follows the score. Placing it first would move the score's start
  position from card to card, since not every card has it.

The label uses a **neutral** foreground, not the achievement colour: `content/on-media` on
the band, `content/subdued` under the jacket. `achievement/full-combo` measures `3.36`
against `surface/canvas` and cannot carry text at `4.5:1`. Colour therefore lives on the
ring, and the letters carry the meaning — which is exactly what `AC-01` asks for.

Measured: `FC` label Light `8.06` on the card and `6.56` on the band; Dark `8.61` and
`20.17`. Ring against the jacket, Light `2.77` and Dark `10.63` — the ring is supportive,
so the 3:1 non-text threshold does not gate it.

Pianist needs no label: `grade_p.png` occupies the icon slot and is itself the non-colour
cue. This also removes the earlier blocker — a missing `grade_fc_bg.png` no longer
prevents identifying Full Combo, because the `FC` letters do that.

### 5.4 Unplayed keeps its current treatment

An unplayed chart is distinguished by two non-colour cues: **no rank icon**, and the
`tiers.unplayed` value in place of a score. Document 06 requires that value — "present a
truthful concise unplayed value rather than a fabricated zero score" — so the text stays;
an empty slot would read as loading or missing data.

Two alternatives were rejected:

- **Disabled tokens.** Document 24 reserves `disabled` for genuinely unavailable content,
  and an unplayed card opens normally. It also has almost no visual effect: in Light,
  `surface/sunken` and `interaction/disabled-bg` are both `#E9E9E9`, so only the border
  changes, and it becomes _darker_.
- **Weakening the jacket's placeholder icon.** That music glyph appears only when no
  artwork is available. In production `getJacketUrl` resolves real jacket art for played
  and unplayed charts alike, so the treatment would do nothing. It only looked effective
  in the specimen because the specimens use empty slots.

### 5.5 What was deliberately not carried over

The current product dims unachieved cards with `opacity-55`. Content opacity is not a
Foundation mechanism, so the design does not reproduce it. Where a state genuinely needs
weakening, use the approved foreground roles.

## 6. States

Held on one board per mode; the shell is not repeated.

| State                | Copy                                         | Behaviour                                                         |
| -------------------- | -------------------------------------------- | ----------------------------------------------------------------- |
| No published list    | `tiers.noPublished`                          | page-level absence; mode and goal controls stay                   |
| No matching charts   | `tiers.noCharts` + `tiers.selectAll`         | result-level; committed filters stay visible with direct clearing |
| Band request failure | retry is `tiers.retry`; body copy unapproved | contained to the result region; planning state not reset          |
| Initial loading      | `tiers.loading`                              | geometry-preserving placeholders, region marked busy              |
| Slow replacement     | `tiers.loading`                              | previous results retained and weakened with `content/pending`     |

`content/pending` is reused here exactly as its `DISC-44` contract allows: valid content
held while a request is in flight, never on a `sunken` ground, and never the only cue —
the progress line accompanies it. Measured `4.88 : 1` on `surface/canvas` in Light and
Dark. This is the role's first reuse outside Discovery.

Signed-out, signed-in-unplayed and omitted-metric states are shown in the full frames
rather than on the board.

---

## 7. Mobile and desktop differ by contract

|                 | Compact (< 672)                                                      | Intermediate (672–1055)       | Wide (1056+)                                            |
| --------------- | -------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------- |
| Band navigation | trigger opens an anchored overlay list                               | same as Compact               | ordered navigator always visible in the rail            |
| Filters         | staged in a dedicated layer, committed by one result-labelled action | same as Compact               | visible in the rail, applied immediately, no Apply step |
| Targets         | 44                                                                   | 44                            | 40                                                      |
| Result columns  | 3                                                                    | derived (5 at 768, 7 at 1024) | derived (7 at 1280)                                     |
| Footer          | `Layout=Compact`                                                     | `Layout=Wide`                 | `Layout=Wide`                                           |

Intermediate is not a third contract. It is the Compact contract with a different derived
column count; only the rail threshold separates it from Wide (§4.4).

The band overlay follows the approved overlay contract — `surface/overlay`,
`border/default` 1px, `radius/overlay` 10, **`elevation/overlay-light`**, padding 8,
gap 4, rows 48. The current band is marked with `interaction/menu-set` plus a check, not
colour alone.

Selecting a band replaces the result collection without resetting mode, goal, filters,
view preference or page context.

---

### 7.1 Band model — decided 2026-08-20, not yet drawn

The contract below supersedes `TIER-05`. The frames in §1 predate it.

**Why it changed.** Band values run `1.0`–`14.5` in `0.1` steps, so a list holds up to
`136` bands, and `2,159` charts across `578` musics average about `16` charts per band.
The built navigator shows six rows with no scroll affordance — it cannot hold the real
band count. Separately, the planning question is a range scan, and one-band-at-a-time made
every neighbouring band a separate interaction.

**The contract.**

| Aspect          | Decided                                                                                                  |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| Selection       | multi-select; **empty selection = no band constraint**                                                   |
| Clearing        | clearing the last band returns to unconstrained, never to an empty result                                |
| Composition     | band selection `AND` difficulty `AND` level                                                              |
| URL             | absent band parameter means unconstrained, matching the existing filter parameters                       |
| Navigator       | scrolls the full count; row height `44`; band value is the checkbox's own label; per-band counts shown   |
| Result region   | selected bands stacked in published order, each under a sticky band header                               |
| Band header     | `section-title` band value + `metric-value` achieved count, `surface/canvas`, 1px `border/default` below |
| Arrival default | all bands matching the committed filters                                                                 |

**Measured consequence of the default.** At 390px in three columns: unfiltered `2,159`
charts is roughly `112,000px`, about 133 phone screens; Expert alone (`578`) about
`28,400px`; Expert 12 (`169`) about `9,300px`. The stack is excellent once filtered and
unusable unfiltered, which is why progressive loading and scroll restoration are load
bearing rather than optional. The user accepted this length knowingly.

**A grid consequence to implement carefully.** Cards must hold the derived column width
even when a row is not full. In a stack, every band ends with a partial row, so a `FILL`
card in a one-item row expands to the full region and its jacket stops being `1:1`. Pin
cards to the column width and left-align short rows.

**Not settled here.** The sticky header's final surface and border treatment; the form and
wording of the range-select control. The board's `전체 표시` / `범위로 선택` / `전체 해제`
labels are placeholders, not catalogue strings — `tiers.selectAll` exists but has no
counterpart for these, so new keys are required.

**Rework scope.** Band trigger, band overlay, Wide rail band list, the `밴드 선택 열림`
state frames, and every result region. `TIER-24` (page order), `TIER-25` (rating scope) and
the guide inset decision are unaffected.

---

## 8. Verification

### 8.1 Executed and passed

Final audit over the whole page — 11 sections, 56 frames, 1,922 text nodes:

| Check                                               | Result                                           |
| --------------------------------------------------- | ------------------------------------------------ |
| spacing scale                                       | 0 off-scale                                      |
| radius / stroke weight                              | 0 / 0 on product nodes                           |
| Section-child containment · section overlap         | 0 / 0                                            |
| **Child-to-child overlap inside a section**         | **0**                                            |
| Page-level non-section nodes                        | 0                                                |
| Clipping · frame escape · text overflow             | 0 / 0 / 0                                        |
| Jacket squareness                                   | 430 jackets, 0 non-square                        |
| Target sizes                                        | compact 44, desktop 40; 0 undersized             |
| Text styles: raw values, composites, sub-12px       | 0 / 0 / 0                                        |
| Locale text-style mapping                           | 0 mismatches                                     |
| Variable binding                                    | 0 unbound visible fills or strokes               |
| WCAG contrast, per effective mode, scrim composited | 1,890 texts, **0 failures**; minimum `4.88`      |
| Light↔Dark symmetry                                 | identical frame sizes and text counts            |
| 320 reflow                                          | column counts hold in KO/JA/EN Light and KO Dark |
| Intermediate 672–1055                               | 768 and 1024 built and measured                  |

The minimum `4.88` is `content/pending` on `surface/canvas` in the state boards, matching
the value calculated when that token was approved.

Two checks that earlier revisions of this document reported as passing were **not actually
being run**, and both hid real defects:

- **Child-to-child overlap.** The earlier audit compared each child against its section
  box only. Row pitch inside the 320 section was a fixed `1582`, so when the detailed
  frames grew the Korean row overlapped the Japanese row by `20px` and the Japanese row
  overlapped the English row by `80px`. Rows are now flowed from measured row height.
- **Curve geometry.** Assigning `vectorPaths` renormalises the node's bounding box; the
  node's `x`/`y` must be reset to the path minimum afterwards. Without that the curve was
  displaced and read `~145` at constant `14.5` where the value is `177.7`.

### 8.2 Not executed — not a pass

- **Locale rows in Dark at 320 for JA and EN.** Only Korean is duplicated in Dark (§1.2).
- **`Recital` beyond `Recital · S`.** Recital Full Combo and Recital Pianist have no frame.
- **Intermediate in the filter-layer, band-open and detailed states.** Only the signed-in
  compact state is built at 768 and 1024.
- **The entire band model of §7.1.** No frame shows the multi-select navigator, the sticky
  band header, or a stacked result region. This is the largest outstanding item.
- **Browser measurement, Pretendard re-check, runtime behaviour** (`aria-busy`, blocked
  activation, focus retention, Back restoration). These cannot be executed in Figma.

### 8.3 Defects found and fixed

| Defect                                                                                                     | Found by                        | Fix                                                                           |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------- |
| State messages could not wrap (`WIDTH_AND_HEIGHT`), so JA overflowed its 288 region by 32px and EN by 10px | JA/EN 320 scan                  | 25 texts set to fill width with automatic height                              |
| `S` and `Detailed view` bound to `*/ko` text styles although both are Latin                                | locale mapping scan             | 42 nodes rebound to `*/latin`                                                 |
| Cards squared along with jackets, collapsing signed-in cards to 88×88                                      | height compared against sibling | auto-layout cards restored to hug; only jackets squared                       |
| `Checkbox` fixed at 200 wide with 134px of dead space                                                      | user observation                | component set to hug its content (66)                                         |
| Compact section box 1800×384 while children reached 2190×1647                                              | section containment check       | sections resized to their content                                             |
| **320 locale rows overlapped after the rating row was added**                                              | **user observation**            | row pitch derived from measured row height instead of a constant              |
| **Curve vector displaced after `vectorPaths` reassignment**                                                | comparison board render         | node origin set to the path minimum in all chart panels                       |
| **JA and EN 320 state boards showed the Korean failure sentence**                                          | applying `tiers.loadError`      | localised to `難易度データを…` and `Could not load the tier data.`            |
| **Guide body inset one-sided (`left 32 / right 0`)**                                                       | user observation                | inset removed; body shares the trigger's left edge (§4.5)                     |
| **Description and guide sat above the mode and goal controls**                                             | user observation                | both moved below the goal selector across 32 frames plus the Wide rail (§4.5) |
| Chart tick set over-reduced to five ticks                                                                  | automated collision check       | restored to seven; only `13` collides                                         |

---

## 9. Copy

`tiers.*` provides 42 keys in all three locales, so this page is far better supplied than
Discovery. Nineteen distinct strings were verified present in ko/ja/en and used directly:
`tiers.title` · `tiers.guide` · `tiers.goal` · `tiers.bands` · `tiers.achieved` ·
`tiers.songCount` · `tiers.unplayed` · `tiers.conditions` · `tiers.difficulty` ·
`tiers.officialLevel` · `tiers.selectAll` · `tiers.noPublished` · `tiers.noCharts` ·
`tiers.retry` · `tiers.loading` · `tiers.level` · `common.login` · `music.filter` ·
`rankings.metric.grade`.

The expanded guide adds the ten `tiers.weight.*` keys, all present in ko/ja/en, so the
chart needed no invented wording. The detailed card's rating row reuses
`rankings.metric.rating`, matching the sibling Grd row's use of `rankings.metric.grade`.

Two strings were undecided when this page was first assembled and are now approved
(2026-08-20). They are **new keys** and do not exist in the catalogue yet — see §11.2:

- `tiers.detailedView` — the checkbox label. `music.listView` / `music.gridView` set the
  Korean and Japanese pattern (`리스트 보기` / `リスト表示`), which `상세 보기` /
  `詳細表示` follows.
- `tiers.loadError` — the band-request failure sentence, phrased as the counterpart of
  `tiers.loading` rather than repeating the visible retry action.

One item is **not** a copy decision: the tier-list description. `official-tier-lists.json`
stores one Korean string per list and the schema has no locale variants, so the JA and EN
frames show Korean. That is a data-model gap recorded in §11.3.

`tiers.conditions` is currently an `aria-label` in the shipped controls; the design
promotes it to the visible filter-layer title.

Scaffolding labels on verification frames are identification names, not product copy, and
are not part of any approval.

---

## 10. Real data versus representative data

- Songs, artists, difficulties and official levels come from `nosdata-musics.json`. The
  detailed frame uses six real Expert 12 charts — `Ave`, `Barbara`,
  `Battle Against a True Hero / 本物のヒーローとの戦い`, `Be a Hero!`, `Bonetrousle`,
  `Carezza` — out of 169 that exist at that level.
- The six tier lists in `official-tier-lists.json` are real, including their slugs,
  titles and descriptions.
- **Band values, per-band counts, achievement counts and scores are representative.** The
  repository contains list definitions only — no `TierBand` rows and no `TierEntry` rows.
  Scores are set at or above 950,000 because `tiers.weight.sRequirement` states that is
  the S threshold.

---

## 11. Implementation requirements

1. Repoint the five hot-linking call sites to the self-hosted `public/grade/` assets that
   already exist (§5.2). **Do not source `grade_fc_bg.png`.** The grade slot carries the
   score rank only; Full Combo is reported by the ring and the `FC` label, so the asset is
   not required by this design. An earlier revision of this document asked for it in both
   places; that request is withdrawn and §5.2 governs.
2. Do not dim unachieved cards with opacity (§5.4).
3. Derive desktop column count from the result container, not a fixed number (§4.3).
   3a. Keep rank and combo achievement on separate axes. Do not collapse them with the
   current `pianist > fc > s > a_plus` priority chain — a chart that is `S` and Full
   Combo must show both (§5.3).
4. Keep the three level concepts distinct in code and copy (§2).
5. Mobile stages filters and commits once; desktop applies immediately (§7).
6. The pending state needs `aria-busy`, blocked activation on retained results, focus
   retention, and discarding of stale responses. Colour alone must never signal it.
7. Browser Back restores mode, goal, committed filters, active band, view preference,
   density and practical scroll position.
8. The whole card is one link to the exact Music difficulty with Tier & Evaluation
   selected; no intermediate modal, popover or expansion.

### 11.1 Rating scope — the largest downstream change

The 2026-08-20 decision is that **every one of the six published tier lists defines its own
NosLog rating**, each normalising `10,000` points over its own top `70` tier constants. The
single-list gate in the shipped code is scaffolding, not policy.

| Site                                 | Current                                      | Required                               |
| ------------------------------------ | -------------------------------------------- | -------------------------------------- |
| `lib/rankings.ts:200-201`            | `mode = 'basic' AND goal = 'pianist'`        | resolve per selected list              |
| `app/(nevigation)/tiers/page.tsx:72` | `showRatingWeight = mode === 'basic'`        | remove the mode gate                   |
| `app/(nevigation)/tiers/data.ts:123` | rejects lists whose `mode !== 'basic'`       | accept any published list              |
| `tiers.weight.perSong`               | `Basic {goal} · 1곡 기준` — mode hard-coded  | parameterise the mode                  |
| `rankings.ratingBasis`               | `현재 Basic Pianist 서열 상수 · 상위 70곡 …` | state the selected list instead        |
| Detailed card row 4                  | Basic·Pianist only                           | present wherever a contribution exists |

Because a chart's constant differs between lists, the same chart contributes different
points in each list. That is the reason the weight chart is per list rather than one shared
curve.

### 11.2 New catalogue keys

| Key                  | ko                                   | ja                                     | en                              |
| -------------------- | ------------------------------------ | -------------------------------------- | ------------------------------- |
| `tiers.detailedView` | `상세 보기`                          | `詳細表示`                             | `Detailed view`                 |
| `tiers.loadError`    | `서열 데이터를 불러오지 못했습니다.` | `難易度データを読み込めませんでした。` | `Could not load the tier data.` |

`tiers.retry` already exists and stays a separate action, so neither sentence repeats a
"try again" instruction.

### 11.3 Open items this design did not settle

- **`TierList.description` has no locale variants.** `prisma/schema.prisma:412` stores one
  `String?`, and `official-tier-lists.json` holds Korean only for all six lists. The JA and
  EN frames therefore show Korean. This is a data-model gap, not undecided copy.
- **Document 15 does not state a width for the `OrdinaryFooter` Compact/Wide switch** (§4.4).
- **Chart gridlines and the `3:1` threshold.** Resolved here by labelling the y axis (§4.5).
  The pattern-radar decision of 2026-08-13 described its grid as load-bearing while using
  the same `border/default`; whether that component needs the same treatment is not decided.
- **JA at 320 wraps the rating row.** `NosLogレーティング +36.5` does not fit the `138`
  detailed card and breaks inside the katakana label. No shorter approved JA string exists.
  Nothing is clipped and the card hugs, so this is accepted rather than fixed.

---

## 12. Figma authoring notes

Two traps hit repeatedly while building this page; both are now recorded in `CLAUDE.md`.

- `resize()` resets `primaryAxisSizingMode` to `FIXED`. Any axis meant to hug must be
  restored immediately afterwards, or the dimension freezes at an arbitrary number.
- A `FILL` child's width is only final once all its siblings exist. Squaring a jacket
  while cards are still being appended gives the first card the whole row. Square in a
  second pass.

This renderer does not support `targetAspectRatio`, so jacket squareness is maintained
manually and must be re-applied whenever a frame is cloned to a different width.

---

## 13. Locked boundary and remaining families

The chart viewer and editor remain fully locked. Tier cards link into Music Detail; they
do not open or restyle the viewer.

Remaining page families: documents 08, 09, 10, 11, 12, 13, 14, 16, 17, 18, 19.
Document 06 unblocks 08, which unblocks 09, which unblocks 11, 12, 16, 17 and 18.
Document 19 needs only 14.
