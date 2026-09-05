# 73 · Music-Detail Page Design Handoff — 2026-08-28

This document hands the approved Music-detail high-fidelity design and its Figma
verification evidence to a later implementation session. It does **not** replace
[document 05](./05-music-detail-page-brief.md), which remains the normative product and
behaviour brief. Where this handoff conflicts with document 05, document 05 governs and
this document is wrong.

- Status: `Approved high-fidelity Figma design and design validation complete`
- Implementation status: `Not started in this design session`
- Figma file: `NosLog v2.0.0` — `cVbWCxhkfxFfHmAKLCyKrD`
- Product page: `P1 · Music Detail 조립`
- Decision page: `Z1 · 결정 기록` — approved `149`, pending `0`
- Preserved exclusion: the chart viewer and editor remain untouched (document 07).

---

## 1. Figma node map

### 1.1 Sections

`16` sections, `111` frames, `9,555` text nodes, `32,558` nodes.

| Section                                           | Node         | Frames |  Width |
| ------------------------------------------------- | ------------ | -----: | -----: |
| `Music Detail · Compact 320`                      | `2534:61889` |      4 |  `320` |
| `Music Detail · Compact 320 · Dark`               | `2543:24270` |      4 |  `320` |
| `Music Detail · Compact 390`                      | `270:740`    |      5 |  `390` |
| `Music Detail · Compact 390 · Dark`               | `613:495`    |      5 |  `390` |
| `Music Detail · Intermediate 768`                 | `2534:7635`  |      4 |  `768` |
| `Music Detail · Intermediate 768 · Dark`          | `2543:23976` |      4 |  `768` |
| `Music Detail · Intermediate 1024`                | `2534:6941`  |      4 | `1024` |
| `Music Detail · Intermediate 1024 · Dark`         | `2543:23682` |      4 | `1024` |
| `Music Detail · Wide 1280`                        | `2532:2274`  |      4 | `1280` |
| `Music Detail · Wide 1280 · Dark`                 | `2543:23376` |      4 | `1280` |
| `Music Detail · Compact 390 · 상태 스위트`        | `2563:9286`  |     24 |  `390` |
| `Music Detail · Compact 390 · 상태 스위트 · Dark` | `2572:14714` |     24 |  `390` |
| `Music Detail · Compact 390 · JA · Light`         | `2579:19994` |      5 |  `390` |
| `Music Detail · Compact 390 · JA · Dark`          | `2579:21417` |      5 |  `390` |
| `Music Detail · Compact 390 · EN · Light`         | `2579:22840` |      5 |  `390` |
| `Music Detail · Compact 390 · EN · Dark`          | `2579:24263` |      5 |  `390` |

Document 05 names eight verification widths. Five are built here — `320`, `390`, `768`,
`1024`, `1280` — matching what every other page family in this file uses. `360` and `430`
sit in the same Compact tier as `390` and differ only by reflow; `1440` is already fixed
by `SHELL-34`. **All three remain implementation browser checks and are not covered by
this design audit.**

### 1.2 Components created or changed for this page

| Component                                                                                       | Change                                                                                                                                             |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CommunityPatternRadar · Compact 320 · State=Data`                                              | **New.** The `320` geometry at scale `0.80`; see section 2.3                                                                                       |
| `CommunityPatternRadar · Compact 320 · State=Aggregating`                                       | **New.** Same geometry for the aggregating state                                                                                                   |
| `TierPlacementGrid`                                                                             | **New `State=NoHistory` variant** — the disclosure is replaced by a single `변경 이력 없음` line, `284` → `268`                                    |
| `CommunityPatternRadar`                                                                         | Plot children moved from `MIN` to `CENTER` horizontal constraints so the polygon stays centred at any width                                        |
| `OrdinaryDataChart`                                                                             | Gridlines, line frame and its vector set to `STRETCH`; the three points set to `MIN` / `CENTER` / `MAX`, so the series spans the plot at any width |
| `PatternAxisRow`                                                                                | `choices` and its five buttons set to `FILL`; the previous fixed `57` was a value derived from the `390` row width and had been frozen             |
| `Icon/languages`, `graduation-cap`, `grid-3x3`, `layers`, `trophy`, `list-music`, `shield-user` | Inner frame constraints `MIN` → `SCALE`; see section 3.2                                                                                           |
| `OrdinaryFooter`                                                                                | `Layout=Wide` service notice `HUG` → `FILL`, row alignment `SPACE_BETWEEN` → `MIN` with `gap 24` and right-aligned text                            |

Every change above was verified to leave existing instances pixel-identical at their
current widths before it was accepted.

### 1.3 Decision boards

Five boards were approved on 2026-08-28 and moved into the Z1 approved section:

| Decision                             | Node         | Result                                      |
| ------------------------------------ | ------------ | ------------------------------------------- |
| `FC` label contrast                  | `2459:16905` | A — neutral label, `full-combo` border kept |
| Wide `1280` composition, four panels | `2499:19699` | See section 2.1                             |
| Chart-Info facts column heading      | `2513:17849` | C — `기본 정보`                             |
| Pattern-profile radar at `320`       | `2539:17855` | D — scale `0.80`                            |
| Footer layout variant threshold      | `2557:17827` | Option 2 — threshold `840`                  |

---

## 2. Final approved decisions

### 2.1 Wide `1280` composition

Content width is `1216` — main padding `[24, 32, 48, 32]`, matching P5 and P6. `768` and
`1024` stack in source order, as every other page family does; only `1280` splits.

| Panel             | Composition                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| Chart Info        | Radar `805` / facts `395`; the facts column carries `기본 정보`             |
| Ranking           | Full width `1216`                                                           |
| My Record         | `8:4` in two rows preserving source order, judgement analysis full width    |
| Tier & Evaluation | Placements full width, then votes + contributor form `805` / opinions `395` |

Ranking is full width because P5 already renders `1216` ranking rows with a `1044`
player column at this width. Capping P1 would give two ranking screens two rules.

### 2.2 Area switcher threshold

The compact combobox becomes the wide tab list when the switcher's available inline size
reaches **`424`**, which is what the widest localized label set needs: item padding
`16 + 16` per tab plus labels of `65 · 68 · 52 · 109` in English. Korean needs `303` and
Japanese `408`; English binds. This is a container-query threshold, not a device width.
At the built widths that resolves to combobox at `320` and `390`, tabs at `768` and above.

### 2.3 Pattern-profile radar at `320`

At `320` the plot is `264` and the fixed polygon plus labels do not fit. Scaling the
polygon, grid and series to **`0.80`** while leaving label type size alone clears every
locale: measured side margins are `23.3` in Korean, `19.9` in Japanese and `8.2` in
English. English binds, not Japanese.

Applies at `320` only; from `390` (plot `334`) the radar renders at scale `1`.

### 2.4 Footer layout variant

A footer uses `Layout=Wide` at **`840`** and above and `Layout=Compact` below. The single
row needs `padding 24 + links + gap 24 + notice + padding 24`, which is `648` in Korean,
`780` in English and `840` in Japanese. This resolved an inconsistency in which P1, P4 and
P5 used Wide at `768` while P6 used Compact; `24` frames across five pages were changed so
every family now follows one rule.

### 2.5 Copy

Document 05's approved copy table now carries Japanese and English for the previously
Korean-only strings. Two facts are worth carrying forward:

- The **Japanese View-chart label was never actually open.** `music.info.viewChart` holds
  `譜面を見る` and `View Chart`. Only the Korean changed, to `채보 보기`.
- The footer service notice is the one in [document 15](./15-shared-shell-navigation-brief.md),
  including the unofficial-fan-service qualifier that `SHELL-32` requires. It is **not**
  `home.tagline`, and it is absent from the runtime catalogs only because it is 2.0 copy
  that has not been implemented yet.

---

## 3. Final Figma validation

### 3.1 Executed and passed

| Check                         | Result                                                            |
| ----------------------------- | ----------------------------------------------------------------- |
| Frames by width               | `320: 8`, `390: 58`, `768: 8`, `1024: 8`, `1280: 8`               |
| Spacing outside the scale     | `0`                                                               |
| Text nodes without a style    | `0`                                                               |
| Hardcoded fills and strokes   | `0`                                                               |
| Horizontal overflow           | `0`                                                               |
| Section escape / overlap      | `0` / `0`                                                         |
| Nodes loose on the page       | `0`                                                               |
| Light contrast, base sections | `1,845` measured, minimum `6.64:1`, failures `0`                  |
| Dark contrast, base sections  | `1,845` measured, minimum `7.25:1`, failures `0`                  |
| Light contrast, state suite   | `2,094` measured, minimum `4.60:1`, failures `0`                  |
| Dark contrast, state suite    | `2,094` measured, minimum `4.99:1`, failures `0`                  |
| Locale sections               | Spacing `0`, unstyled `0`, hardcoded `0`, overflow `0`            |
| Remaining Korean in JA/EN     | Representative data only — a Korean username and one opinion body |

The state-suite minimum of `4.60` / `4.99` is `content/pending` on `surface`, which is
exactly the pair `DISC-44` recorded when that token was approved.

Korean text surviving in the Japanese and English frames is correct, not a gap: document
05's leaderboard contract requires a player name to follow the writing system of the name
itself rather than the page locale. Those nodes carry `/ko` styles deliberately.

### 3.2 Defects found in shared components while building this page

Three were introduced elsewhere and would have shipped:

- **`770` icon instances rendered `4px` larger than declared.** Seven icon components had
  `MIN` inner-frame constraints, so resizing an instance from `24` to `20` left the artwork
  at `24` with clipping off. Correct icons such as `Icon/globe` used `SCALE`. Fixing the
  seven brought the file from `770` mismatches to `0`, across C6 `14`, C8 `139`, P1 `20`,
  P2 `295` and Z1 `302`. Instances already at `24` are unchanged.
- **P1 never assembled the contributor's vote and evaluation form.** Document 05's Tier &
  Evaluation reading order lists it fourth, between the vote aggregates and the opinions,
  and it is where an opinion is written. The components existed in C7 the whole time. The
  form and the `TierVoteContribution` row are now in all base frames.
- **The footer service notice had been replaced with `home.tagline`,** dropping the
  qualifier `SHELL-32` requires. `154` instances were restored.

### 3.3 Not executed — not a pass

- `360`, `430` and `1440` widths.
- The state suite exists at `390` only; other widths carry the default state.
- Japanese and English frames exist at `390` only.
- The `series` bottom gridline overhangs its parent by `1px`. This predates this session —
  it is present in the original `390` frames — and was left alone.

---

## 4. Runtime checks deferred to implementation

Figma proves visible composition and static state coverage. It cannot execute these, and
they are explicitly **not** passed by this audit:

- `tablist` / `tab` / `tabpanel` semantics at wide widths and select-only `combobox` /
  `listbox` semantics at compact widths, including the requirement that the inactive
  representation is absent from the accessibility tree;
- manual tab activation, arrow-key traversal, and focus staying on the activated control;
- `aria-busy`, the single polite status region, and announcement of target-specific
  progress without narrating each skeleton change;
- URL state for difficulty, content area and ranking page; Back and Forward restoration;
  source-aware entry; and the authentication return path back to the exact Record area;
- request cancellation, deduplication, the `60`-second freshness interval, and background
  revalidation that keeps exact-target content readable;
- server-side enforcement of vote eligibility per chart, mode and goal;
- real locale catalog wiring and the Pretendard JP delivery contract;
- browser reflow, console errors, and automated accessibility checks.

---

## 5. Scope boundary and open items

This handoff completes the Music-detail design stage only. It does not authorize
implementation, redesign of the locked chart viewer or editor, or any other page family.

**Post-handoff correction (2026-09-01).** Sixteen state-suite frames (미로그인 ·
기록 없음 · 오류 · 라우트 오류 · Not Found families, Light and Dark) had no viewport
floor — the footer sat directly under short content at heights of 332–678. All sixteen
now hold the 844 floor with the content region filling the remainder, matching the
P8/P10 shell convention, and both state-suite sections were reflowed (overlap 0,
escape 0).

Open items carried out of this session:

1. **Four new state strings** need three-locale approval. Each follows an existing
   repository pattern: `채보 정보를 불러오는 중입니다.`, `내 기록을 불러오는 중입니다.` and
   `랭킹을 불러오는 중입니다.` follow `tiers.loading` and `arcades.mapLoading`;
   `악곡 정보를 불러오지 못했습니다.` follows `arcades.mapLoadError`; and
   `악곡 검색으로 돌아가기` follows `chart.back` with the destination named by `music.title`.
2. **The edited indicator.** Document 05 requires one but names no wording, and the
   repository has none. The frames carry `수정됨` / `編集済み` / `Edited` as a proposal.
   Because `music.tier.edit` renders the action as `更新` / `Update`, an approved indicator
   may prefer `更新済み` / `Updated`.
3. **The reaction label.** Document 05 calls it equivalently **Helpful**, the frames show
   `추천`, and the repository still carries the superseded `의견 추천` / `의견 비추천` pair.
   Naming the single positive reaction is a three-locale decision.
4. **`TierVoteContribution` placement.** The C7 assembly puts one contribution row after
   both mode groups, and this page follows it. Document 05 also says each goal-specific
   vote has its own edit and delete action in its exact scope, which would mean one row per
   expanded scope. The two readings were not reconciled in this session.

## Amendment — 2026-09-06 · representative art

`Music Detail · 390 · Information` and `Music Detail · 1280 · 채보 정보` (Light + Dark)
show a real 96 px jacket; the category badge stays, the empty-slot icon is hidden.
Document 86 §2 (jacket-led hero) remains rejected — this is a fixture, not a layout change.
