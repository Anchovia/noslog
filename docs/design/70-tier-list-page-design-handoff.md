# 70 · Tier-List Page Design Handoff — 2026-08-20

This document hands the approved Tier-list design and its verification results to
implementation. It does **not** replace document 06, which remains the normative brief.
Where the two differ, document 06 governs and this document is wrong.

Figma file: `NosLog v2.0.0` — `cVbWCxhkfxFfHmAKLCyKrD`
Page: `P4 · Tier List 조립` — `1291:2`

---

## 1. Figma node map

### 1.1 Product frames

| Section                        | Node         | Frames                                                                                                                                                                                                    |
| ------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Tier · Compact 390`           | `1291:3`     | Signed-out base `1291:4` (390×1102) · Signed-in compact `1321:104` (390×1174) · Detailed two-column `1323:191` (390×1599) · Filter layer `1334:267` (390×844) · Band selection open `1343:274` (390×1174) |
| `Tier · 결과 영역 상태`        | `1344:359`   | State board `1344:360` (1950×339, five states)                                                                                                                                                            |
| `Tier · Wide 1280`             | `1348:371`   | Rail exposed `1348:372` (1280×1184)                                                                                                                                                                       |
| `Tier · Compact 390 · Dark`    | `1352:492`   | `1352:493` · `1352:536` · `1352:613` · `1352:696` · `1352:764`                                                                                                                                            |
| `Tier · 결과 영역 상태 · Dark` | `1352:26219` | `1352:26220`                                                                                                                                                                                              |
| `Tier · Wide 1280 · Dark`      | `1352:26270` | `1352:26271`                                                                                                                                                                                              |

Dark frames are clones with `setExplicitVariableModeForCollection(Color, '70:2')`.
Frame sizes and text-node counts are identical between modes.

### 1.2 Verification frames

Section `Tier · 320 검증` — `1356:954` (3536×4778). Three rows of six frames. These test
320px reflow and locale fit. They are **not** product states.

| Row      | Base        | Signed-in   | Detailed    | Filter layer | Band open   | State board |
| -------- | ----------- | ----------- | ----------- | ------------ | ----------- | ----------- |
| KO Light | `1356:955`  | `1356:1082` | `1356:1242` | `1356:1399`  | `1358:1202` | `1358:1390` |
| JA Light | `1360:1299` | `1360:1426` | `1360:1586` | `1360:1743`  | `1360:1818` | `1360:2006` |
| EN Light | `1361:1644` | `1361:1771` | `1361:1931` | `1361:2088`  | `1361:2163` | `1361:2351` |

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

| Board                                                 | Node        |
| ----------------------------------------------------- | ----------- |
| Tier controls = SegmentedControl · Select · Checkbox  | `1294:7665` |
| Detailed card score band = right aligned              | `1330:7677` |
| Jacket score = `media-scrim` 60% + `content/on-media` | `1280:7674` |

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
official level → official Grd contribution. The NosLog rating contribution is **omitted**
here because it is defined only for `Basic · Pianist` and the frame shows `Basic · S`;
document 06 requires omitting the inapplicable metric rather than printing an
unavailable notice on every card.

Long titles wrap and the information region grows. The jacket stays square.

### 4.3 Desktop columns are derived, not fixed

At 1280 the rail takes `292` (3/12) and the result region `908` (9/12) with a `16`
gutter, matching the Discovery Wide shell. Column count then comes from the container:

```
largest n where (n + 1) × 111.33 + n × 16 ≤ 908   →   n = 7
card = (908 − 6 × 16) / 7 = 116
```

`TIER-19` requires exactly this: desktop density is container-driven, not one fixed
product number. Mobile's 3 and desktop's 7 come from the same minimum card width.

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

|                 | Compact                                                              | Wide                                                    |
| --------------- | -------------------------------------------------------------------- | ------------------------------------------------------- |
| Band navigation | trigger opens an anchored overlay list                               | ordered navigator always visible in the rail            |
| Filters         | staged in a dedicated layer, committed by one result-labelled action | visible in the rail, applied immediately, no Apply step |
| Targets         | 44                                                                   | 40                                                      |
| Result columns  | 3                                                                    | derived from the container (7 at 1280)                  |

The band overlay follows the approved overlay contract — `surface/overlay`,
`border/default` 1px, `radius/overlay` 10, **`elevation/overlay-light`**, padding 8,
gap 4, rows 48. The current band is marked with `interaction/menu-set` plus a check, not
colour alone.

Selecting a band replaces the result collection without resetting mode, goal, filters,
view preference or page context.

---

## 8. Verification

### 8.1 Executed and passed

Final audit over the whole page — 7 sections, 32 frames, 4,486 nodes, 1,087 text nodes:

| Check                                               | Result                                                                 |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| spacing scale                                       | 0 off-scale                                                            |
| radius / stroke weight                              | 0 / 0                                                                  |
| Section-child containment · section overlap         | 0 / 0                                                                  |
| Page-level non-section nodes                        | 0                                                                      |
| Clipping · frame escape                             | 0 / 0                                                                  |
| Jacket squareness                                   | 0 non-square                                                           |
| Text styles: raw values, composites, sub-12px       | 0 / 0 / 0                                                              |
| Locale text-style mapping                           | 0 mismatches                                                           |
| Variable binding                                    | 0 hardcoded fills or strokes                                           |
| WCAG contrast, per effective mode, scrim composited | **0 failures**; minimum `4.88` (`content/pending` on `surface/canvas`) |
| Target sizes                                        | compact 44, desktop 40; 0 undersized                                   |
| Light↔Dark symmetry                                 | identical frame sizes and text counts                                  |
| 320 reflow                                          | 3-column and 2-column layouts hold; no column-count change             |
| Locale fit                                          | KO / JA / EN at 320, 56 strings swapped per locale                     |

### 8.2 Not executed — not a pass

- **`fc` and `pianist` goal frames.** Only `Basic · S` is drawn. Full Combo and Pianist
  appear inside that frame as ring plus label (§5.3), but no frame shows those goals
  selected, and the NosLog rating contribution row for `Basic · Pianist` has no specimen. The achievement marks
  in §5.3 and the NosLog rating contribution row for `Basic · Pianist` have no specimen.
- **`Recital` mode frames.** The segmented control shows the state; no Recital content
  exists.
- **Dark 320 verification.** Dark exists at 390 and 1280 only.
- **Intermediate widths (672–1055).** Not built for this page.
- **Wide state screens.** The state board is shell-independent and applies at both
  widths, but no Wide-specific specimen was made.
- **Calculation guide expanded.** Only the collapsed disclosure is drawn; the rating-weight
  chart described by `tiers.weight.*` is not laid out.
- **Browser measurement, Pretendard re-check, runtime behaviour** (`aria-busy`, blocked
  activation, focus retention, Back restoration). These cannot be executed in Figma.

### 8.3 Defects found and fixed

| Defect                                                                                                     | Found by                                  | Fix                                                                                                         |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| State messages could not wrap (`WIDTH_AND_HEIGHT`), so JA overflowed its 288 region by 32px and EN by 10px | JA/EN 320 scan                            | 25 texts set to fill width with automatic height, originals included. Korean measured 248 and hid the fault |
| `S` and `Detailed view` bound to `*/ko` text styles although both are Latin                                | locale mapping scan                       | 42 nodes rebound to `*/latin`; rendered width unchanged, but the binding matters for the Pretendard swap    |
| Cards squared along with jackets, collapsing signed-in cards to 88×88 and pushing the score out            | height compared against the sibling frame | auto-layout cards restored to hug; only jackets squared                                                     |
| `Checkbox` fixed at 200 wide with 134px of dead space, defeating `SPACE_BETWEEN`                           | user observation                          | component set to hug its content (66)                                                                       |
| Compact section box 1800×384 while children reached 2190×1647                                              | section containment check                 | sections resized to their content                                                                           |

---

## 9. Copy

`tiers.*` provides 42 keys in all three locales, so this page is far better supplied than
Discovery. Nineteen distinct strings were verified present in ko/ja/en and used directly:
`tiers.title` · `tiers.guide` · `tiers.goal` · `tiers.bands` · `tiers.achieved` ·
`tiers.songCount` · `tiers.unplayed` · `tiers.conditions` · `tiers.difficulty` ·
`tiers.officialLevel` · `tiers.selectAll` · `tiers.noPublished` · `tiers.noCharts` ·
`tiers.retry` · `tiers.loading` · `tiers.level` · `common.login` · `music.filter` ·
`rankings.metric.grade`.

Three items are **not** approved copy and are marked on their nodes:

1. **`Detailed view`** — document 06's own wording. No catalogue key exists; Korean is
   undecided. `music.listView` / `music.gridView` are Discovery's accessible names and
   are not a substitute.
2. **Band-request failure body** — `tiers.*` has `loading` and `retry` but no failure
   sentence.
3. **Tier-list description** — `official-tier-lists.json` stores one Korean string per
   list (`Basic 모드에서 S 달성을 목표로 하는 통합 서열표`). It is real data, but it has no
   ja/en value, so it stays Korean in the JA and EN frames.

`tiers.conditions` is currently an `aria-label` in the shipped controls; the design
promotes it to the visible filter-layer title.

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
   already exist, and add the missing `grade_fc_bg.png` (§5.2).
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
