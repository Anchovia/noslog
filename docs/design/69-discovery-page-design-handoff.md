# 69 · Discovery Page Design Handoff — 2026-08-19

This document hands the approved Discovery design and its verification results to
implementation. It does **not** replace document 04, which remains the normative brief.
Where the two differ, document 04 governs and this document is wrong.

Figma file: `NosLog v2.0.0` — `cVbWCxhkfxFfHmAKLCyKrD`
Page: `P3 · Discovery 조립` — `1193:2`

---

## 1. Figma node map

### 1.1 Product frames

| Section                             | Node         | Frames                                                                                                                                       |
| ----------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `Discovery · Compact 390`           | `1193:3`     | Music base `1193:4` (390×1116) · Filter/sort layer `1194:262` (390×844) · Grid view `1201:268` (390×1660) · Chart base `1204:525` (390×1276) |
| `Discovery · Wide 1280`             | `1207:658`   | Music rail `1207:659` (1280×968) · Chart rail `1212:860` (1280×1160)                                                                         |
| `Discovery · 결과 영역 상태`        | `1213:982`   | Result-state board `1213:983` (2400×688, nine states)                                                                                        |
| `Discovery · Compact 390 · Dark`    | `1215:1198`  | `1215:1199` · `1215:1223` · `1215:1280` · `1215:1308`                                                                                        |
| `Discovery · Wide 1280 · Dark`      | `1215:21215` | `1215:21216` · `1215:21280`                                                                                                                  |
| `Discovery · 결과 영역 상태 · Dark` | `1215:21340` | `1215:21341`                                                                                                                                 |

Dark frames are clones of their Light counterparts with
`setExplicitVariableModeForCollection(Color, '70:2')` applied. Frame sizes and node
counts are identical between modes.

### 1.2 Verification frames

Section `Discovery · 320 검증` — `1237:2343` (3480×6368). Four rows of five frames.
These exist to test 320px reflow and locale fit. They are **not** additional product
screens and must not be implemented as separate states.

| Row      | Music base  | Filter layer | Grid        | Chart base  | Result states |
| -------- | ----------- | ------------ | ----------- | ----------- | ------------- |
| KO Light | `1237:2344` | `1237:2368`  | `1237:2420` | `1237:2448` | `1238:2959`   |
| KO Dark  | `1262:3175` | `1262:3436`  | `1262:3493` | `1262:3774` | `1263:23064`  |
| JA Light | `1271:4007` | `1271:4268`  | `1271:4326` | `1271:4607` | `1271:4745`   |
| EN Light | `1272:4839` | `1272:5100`  | `1272:5158` | `1272:5439` | `1272:5577`   |

Compact frames are 320 wide. Result-state cells are **288** wide, derived as
`320 − 2 × 16` (the compact page margin), not chosen for appearance.

### 1.3 Decision boards

Page `Z1 · 결정 기록` — `268:2`, section `✅ 승인 완료` — `268:3`. Pending section
`268:11` holds **0** items.

| Board                                                       | Node        |
| ----------------------------------------------------------- | ----------- |
| Level-range slider tracks its container width               | `1249:7665` |
| Skeleton bars declared as column ratios                     | `1250:7665` |
| Wide rail slider track 260 → 292 (correction, not a choice) | `1257:7665` |

---

## 2. Scope model

Discovery serves two scopes behind one shell. The scope switch sits left of the search
field and changes what is searched, what the filter layer offers, and what a result row
links to.

|                    | Music scope                                                              | Chart scope                                       |
| ------------------ | ------------------------------------------------------------------------ | ------------------------------------------------- |
| Unit               | one song                                                                 | one published chart                               |
| Result composition | List (one row per song, trailing difficulty levels) or Grid (jacket-led) | grouped by song, one row per published difficulty |
| Result view switch | List / Grid                                                              | none — grouped only                               |
| Destination        | Music Detail                                                             | the published chart                               |
| Empty message      | no song matches                                                          | no published chart                                |

Chart scope covers **search and entry into published charts only**. It does not open,
restyle, or extend the chart viewer or editor. Those remain fully locked (§10).

---

## 3. Result composition contracts

### 3.1 List — one column at every width (`DISC-42`)

The List card spans the whole result region at every width. The former two-column
allowance above a per-card threshold of 440–460px is superseded, together with that
threshold. At 1440 a row stretches to roughly 1216px; this is accepted.

Rationale recorded with the decision: one row per song is the ordinary behaviour of a
list, List and Grid then divide cleanly by role, and removing the second column also
removes a 2→1 column discontinuity that appeared when the filter rail opened.

### 3.2 Grid — result-container capacity

Column count derives from the width of the **result container**, not the viewport:

| Columns | Container width |
| ------- | --------------- |
| 2       | 288 – 535       |
| 3       | 536 +           |
| 4       | 720 +           |
| 5       | 904 + (cap)     |

A new column opens at `n × 168 + (n − 1) × 16`. The two-column lower bound of 288 comes
from `2 × 138 + 12` using the compact gutter of 12. Verified by measurement: at 320 the
result container is 288 and the grid renders exactly two 138px cards.

### 3.3 Chart grouped

One group per song, one row per published difficulty inside it. The difficulty label is
`content/default` text; the difficulty itself is carried by a non-text marker and by the
level number, never by coloured text (§7.3).

---

## 4. Filter and sort layer

Composition, top to bottom: **Sort first**, then filter groups, all staged; one sticky
action commits and closes.

- **Categories** — all six are exposed, in `lib/musicCategories.ts` order:
  `pops · anime · BM · Org · Var · Cl/Jz`. `pops` (1 song) and `anime` (2 songs) are
  genuine data, not an import error (confirmed 2026-08-19).
- **Level range** — a two-handle slider, one set per selected difficulty. Track 4,
  handle 24, step 1. The handle diameter is 24 to satisfy the WCAG 2.2 target minimum.
- **Per-difficulty upper bounds come from real data**: Normal 8 · Hard 11 · Expert 12 ·
  Real 3. There is no single shared range.
- **No standing OR hint** (`DISC-43`). Group headings, the multi-select controls, and
  the staged result count carry that meaning. `music.filter.anyMatch` exists in the
  catalogue in all three locales but is **not placed on this surface**. This removes a
  hint that the current product renders; the user decided this knowingly.
- Signed-out: the personal-record group is omitted entirely, not disabled.
- Newest-release sort is omitted — the release-date gate is unmet.

### 4.1 Slider geometry — derived, not authored

The track spans the container. Handle centres inset 12 from each track end because the
handle is 24 wide. Therefore:

```
centreX(v) = 12 + (v − 1) / (max − 1) × (trackWidth − 24)
handleX    = centreX − 12
selected range spans centreX(min) … centreX(max)
```

Checked against the file: at track 358 the formula reproduces the authored values
exactly (handles 213 / 334, range x225 w121). At 288 it gives handles 168 / 264,
range x180 w96; at 292 handles 171 / 268, range x183 w97.

**Implementations must compute these positions from the value.** The Figma frames are
static snapshots at particular widths. A snapshot that disagrees with this formula is a
snapshot error, not a design variant — that is exactly what the Wide rail correction in
§9 was.

---

## 5. Result-area states (nine)

Held on one board per mode; the shell is not repeated. Cell width 288 in the 320
verification copies, 358 in the 390 originals.

| State                      | Content                                           |
| -------------------------- | ------------------------------------------------- |
| Slow initial request       | skeleton rows, hidden from the accessibility tree |
| Slow replacement           | previous results retained and weakened (§6)       |
| Empty · text mismatch      | no song matches the query                         |
| Empty · filter constraint  | no song matches the conditions                    |
| Empty · no published chart | Chart scope only                                  |
| Fetch failure              | message plus retry action                         |
| Load more · pending        | existing results plus a busy trigger              |
| Load more · failure        | existing results plus failure message and retry   |
| Load more · complete       | existing results plus an end-of-results line      |

Skeleton placeholder bars are declared as **ratios of the identity column**: first bar
100%, second bar 75/166. At a 166 column that renders 166 / 75; at 96 it renders 96 / 43.
No fixed pixel width is authored, so no width needs re-deciding when the container
changes. Skeleton fills use `surface/sunken` on `surface/surface` — Light 1.14 : 1,
Dark 1.10 : 1. This is intentional and permitted: the rows are decorative and hidden
from the accessibility tree.

---

## 6. `content/pending` contract (`DISC-44`, foundation `F-A`)

Weakening for a slow replacement uses a foreground role, never reduced opacity.

- Light `#717171` · Dark `#8A8A8A`, both aliases of `neutral/*` at the same ramp step as
  `border/strong`. **No new primitive value was introduced.**
- `scopes` = `TEXT_FILL`, `SHAPE_FILL`.
- Applies only to **valid content held while its request is in flight**. Low importance
  is `content/subdued`; unavailable is `content/disabled`.
- **Never on a `surface/sunken` ground** — Light measures 4.02 : 1 there.
- The colour never carries the state alone. It travels with the progress indication,
  the busy region, and blocked activation.

Content opacity was rejected outright: document 24 has no content-opacity mechanism
(opacity appears only as shadow alpha), document 04's only mention of opacity is a
prohibition on relying on it alone, no reference prescribes it, and the codebase uses it
zero times in `components/`. A surface-demotion alternative was also rejected —
`surface/surface` against `surface/canvas` measures Light 1.06 / Dark 1.10, invisible.

Measured in the file (40 occurrences across the verification frames):

| Ground            | Light | Dark |
| ----------------- | ----- | ---- |
| `surface/surface` | 4.60  | 4.99 |
| `surface/overlay` | 4.88  | 4.61 |

All clear 4.5 : 1. The next ramp step measures 3.25 / 3.53, so this is the lightest value
that still passes. Zero text nodes carry opacity below 1 — the earlier temporary 0.4 is
fully removed.

Reuse this role for the same state on other pages.

---

## 7. Data, colour and typography rules that bit us

### 7.1 Real data vs representative data

- Songs, artists, categories and difficulty levels come from
  `prisma/data/nosdata-musics.json` (578 songs). They are real.
- **Chart scope group composition and the count `34곡` are representative data.** The
  local dataset contains **zero** published `ChartPattern` rows, so the grouping is a
  structural demonstration. Frame annotations say so. Do not report 34 as a real count.
- Announcement-style body copy inside state cells is representative.

### 7.2 Locale text styles are a measurement premise

`*/ko`, `*/ja`, `*/latin` are font-family switches. A style whose suffix disagrees with
the writing system of its content makes every width measurement on that node wrong.

Fixed this session — 14 nodes in the product frames (plus 10 in verification clones):
`Normal · Hard · Expert · Real` were on `control/ko` and `8 – 12` on `metric-value/ko`;
all are Latin-script and are now on `control/latin` and `metric-value/latin`. The same
strings in the Chart frames were already correct, so this region was the outlier.
Rendered width did not change (delta 0 on all 24), but the binding matters for the
planned Pretendard swap, which re-points `font/family/ko·ja·latin`.

### 7.3 Difficulty colour is non-text only

The `difficulty/*` ramp is built for the 3 : 1 non-text threshold and cannot reach 4.5 : 1
for body text — Expert measures Light 3.97 / Dark 3.60. Difficulty labels use
`content/default`; the difficulty is conveyed by markers and range fills.

---

## 8. Verification results

### 8.1 Executed and passed

| Check                             | Scope                                    | Result                                                                                                |
| --------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Section-child containment         | all 7 P3 sections                        | 0 outside their section                                                                               |
| Section overlap                   | page top level                           | 0 intersections                                                                                       |
| Frame escape / clipping           | 20 verification frames                   | 0 / 0                                                                                                 |
| Text overflow                     | all P3 sections, 1360 texts              | 0                                                                                                     |
| Locale text-style mapping         | all P3 sections                          | 0 mismatches, 0 raw styles                                                                            |
| spacing scale                     | 7050 nodes                               | 0 off-scale (`2` appears only on `category` badges and difficulty markers, the permitted optical use) |
| radius                            | 7050 nodes                               | 0 violations (768 full-radius pills)                                                                  |
| stroke weight / icon size         | 7050 nodes                               | 0 / 0                                                                                                 |
| Typography composites             | 1964 text nodes                          | 0 outside the 13 composites, 0 bad weights, 0 below 12px                                              |
| WCAG contrast, per effective mode | 1112 texts across 20 verification frames | **0 failures**; minimum Light 4.60, Dark 4.61, both `content/pending`                                 |
| Light↔Dark symmetry               | Compact, Grid, Chart, state board        | identical frame sizes and text-node counts (67 / 21 / 67 / 41 / 82)                                   |
| 320 reflow                        | KO Light, KO Dark, JA, EN                | Grid resolves to exactly 2 columns at the 288 container, matching the documented lower bound          |
| Full-page render                  | P3                                       | inspected visually after the coordinate repair                                                        |

### 8.2 Not executed — not a pass

- **JA and EN fit for Discovery-specific copy.** 24 strings have no approved
  translation (§11). The JA and EN frames swap only the six strings that exist in all
  three catalogues; every other Korean string is left in place and its text node is
  named `⏸ ja 미승인` / `⏸ en 미승인`. Fit for those strings is unverified.
- **EN/JA search placeholder at 320.** The scope chip widens with locale
  (`악곡` 25 → `Music` 38) and takes that width directly from the search field, so the
  placeholder truncates earlier. The real EN and JA placeholder strings do not exist, so
  the actual truncation point was not measured. Home already accepted placeholder
  truncation at 320 for JA and EN; this is the same mechanism.
- **Intermediate (672–1055) frames** — not built for Discovery. The shell rule is
  inherited from `SHELL-34` and the Home session.
- **`audit.js` full run** — replaced by the itemised checks above over the new scope.
- **Pretendard re-check** — the file renders with IBM Plex Sans KR/JP/Latin.
- **Browser measurement** — every number here is from the Figma renderer.
- **Runtime behaviour of the pending state** — `aria-busy`, blocked activation, focus
  retention and stale-response discard cannot be executed in Figma. They are recorded as
  implementation requirements (§12), not as verified behaviour.

### 8.3 Defects found and fixed this session

| Defect                                                                                                                                                               | Where                                      | Fix                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Section children carried absolute canvas coordinates, so six of seven sections had their content pushed down by the section's own `y` and overlapping other sections | P3 (10 frames) and **P2 Home** (46 frames) | coordinates converted to section-relative; sizes, colours, type, structure and child order untouched |
| Level-range slider children fixed at 358-based coordinates; overflowed by 70px at a 288 container and were not clipped                                               | Compact Light/Dark                         | track now follows the container; Compact originals unchanged in pixels                               |
| Wide rail slider track 260 inside a 292 column, leaving 32px unused                                                                                                  | 4 Wide frames                              | track 292, handles 171 / 268, range x183 w97                                                         |
| Skeleton bars at fixed 116/75 clipped inside a 96 column                                                                                                             | 9 skeleton rows                            | declared as column ratios                                                                            |
| Latin strings bound to `*/ko` text styles                                                                                                                            | 24 nodes                                   | rebound to `*/latin`                                                                                 |

The P2 repair is recorded as an amendment in document 68. It was verified numerically
(0 children outside their section, 0 section intersections) but **its full-page render
was not inspected**; the next session should look at P2 as one image.

---

## 9. Shared components

No shared component was changed in this session. The slider and the skeleton rows are
local frames inside P3, so P1 and P2 are unaffected by §8.3 rows 2–4.

Earlier Discovery work did change shared components, and those changes stand:

- `C5` control radius 6 → 4, bound to `radius/control` — `FilterSortControl` (4 variants)
  and `ViewModeSwitch` (2 variants), 10 corners. The value 6 was hardcoded to no
  variable, so a radius-scale change would have skipped exactly these two.
- `C6` responsive fixes — Music Grid jacket `FIXED 173` → `FILL` with a 1:1 lock (and
  the jacket's absolutely-positioned children re-constrained), Chart grouped
  `target/*` → `FILL`. Existing instances kept their original widths, so pixel change
  was zero.

---

## 10. Locked boundary

The chart viewer and editor are locked in full — page, DOM shell, controls,
accessibility behaviour, responsive composition, PixiJS/WebGL renderer, Canvas renderer,
palette, geometry, animation, chart mathematics and editor rendering model. Discovery's
Chart scope only searches published charts and links into them.

---

## 11. Copy inventory

Verified against `lib/i18n/messageCatalogs/{ko,ja,en}.ts` (708 keys each, no locale gaps).

### 11.1 Reused as-is — all three locales exist

`header.music` · `common.login` · `common.retry` · `music.category` ·
`music.difficulty` · `music.empty`

### 11.2 New keys — Korean settled, ja/en required downstream

Eighteen strings have no catalogue entry:

sort heading · level range · chart (scope label) · chart viewer · song-and-artist search
placeholder · published-chart search placeholder · no matching song · no published chart ·
could not load songs · could not load the next batch · all results shown · loading… ·
show N more results · showing N of M · show N results · song count with sort ·
published chart count with sort · Expert level

Six more exist under keys whose **wording differs** from the design. Do **not** overwrite
those keys — the existing values are in use and several are accessible names rather than
visible labels. Treat these as additional new keys:

| Design string  | Existing key        | Existing Korean | Why both are needed                    |
| -------------- | ------------------- | --------------- | -------------------------------------- |
| 필터 및 정렬   | `music.filter`      | 필터            | the layer now contains sort as well    |
| 목록           | `music.listView`    | 리스트 보기     | short visible label vs accessible name |
| 격자           | `music.gridView`    | 그리드 보기     | same                                   |
| 일본어 읽기 순 | `music.sort.name`   | 이름            | menu label is more explicit            |
| 레벨 순        | `music.sort.level`  | 레벨            | same                                   |
| 최근 플레이 순 | `music.sort.recent` | 최근            | same                                   |

Following the Home precedent (document 68 §4.3), Korean is settled and ja/en production
copy is downstream work.

### 11.3 Observation outside Discovery scope

The shared footer renders `Privacy` and `GitHub` in Korean frames while
`footer.privacy` resolves to `개인정보처리방침`. This comes from the P2 shell and was not
changed here. It may be deliberate English wordmarking; it needs a decision from whoever
owns the shell.

---

## 12. Implementation requirements

1. Compute slider track width and handle positions from the value, per §4.1.
2. Declare skeleton bar widths as ratios of their column, per §5.
3. The pending state must set `aria-busy` on the result region, block activation of the
   retained results, keep focus where it is, and discard stale responses. Colour alone
   must never signal it.
4. If a replacement settles within 300ms, the pending state must not render at all.
5. Grid column count derives from the result container width, per §3.2. List is always
   one column.
6. Difficulty is never conveyed by coloured text.
7. Locale font family follows the content's writing system.

---

## 13. Remaining page families

Documents 06, 08, 09, 10, 11, 12, 13, 14, 16, 17, 18, 19.

Two checks belong in every one of them, both learned the hard way here:

- **Render the whole page as one image.** Per-frame screenshots and per-frame audits
  cannot see a section whose children sit outside it.
- **Before raising a decision, ask whether the value is chosen by a person or derived by
  the implementation.** A snapshot that disagrees with a derived rule is an error to
  correct, not an option to choose.
