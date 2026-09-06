# 72 · Public-Profile Page Design Handoff — 2026-08-28

This document hands the approved Public-profile high-fidelity design and its Figma
verification evidence to a later implementation session. It does **not** replace
[document 09](./09-profile-page-brief.md), which remains the normative product and
behavior brief. If this handoff conflicts with document 09, document 09 governs and
this document is wrong.

- Status: `Approved high-fidelity Figma design and design validation complete`
- Implementation status: `Not started in this design session`
- Figma file: `NosLog v2.0.0` — `cVbWCxhkfxFfHmAKLCyKrD`
- Product page: `P6 · Profile 조립` — `2267:2`
- Decision page: `Z1 · 결정 기록` — `268:2`
- Preserved exclusion: the chart viewer and editor remain untouched.
- Deferred by the user: the Profile share card. No approved share-card design exists
  yet; see section 5.

---

## 1. Figma node map

### 1.1 Product and verification sections

The P6 page contains `46` product and verification frames. The `390px` frames carry the
complete state suites in both themes; the other widths prove compact, intermediate, and
wide reflow without inventing page-local breakpoints.

| Section                                            | Node        | Frames |
| -------------------------------------------------- | ----------- | -----: |
| `Profile · Wide 1280 · Light + Dark`               | `2267:3`    |      2 |
| `Profile · Compact 390 · Light + Dark`             | `2277:272`  |      2 |
| `Profile · Compact 320 · Light + Dark`             | `2296:536`  |      2 |
| `Profile · Intermediate 768 / 1024 · Light + Dark` | `2301:796`  |      4 |
| `Profile · Locale JA · 1280 / 390 / 320 · L + D`   | `2354:1316` |      6 |
| `Profile · Locale EN · 1280 / 390 / 320 · L + D`   | `2354:3797` |      6 |
| `Profile · 상태 · 390 · Light`                     | `2390:2876` |     12 |
| `Profile · 상태 · 390 · Dark`                      | `2407:4101` |     12 |

Width, theme, and locale distribution:

|  Width | Frames |     | Theme | Frames |     | Locale | Frames |
| -----: | -----: | --- | ----- | -----: | --- | ------ | -----: |
|  `320` |      6 |     | Light |     23 |     | `ko`   |     34 |
|  `390` |     30 |     | Dark  |     23 |     | `ja`   |      6 |
|  `768` |      2 |     |       |        |     | `en`   |      6 |
| `1024` |      2 |     |       |        |     |        |        |
| `1280` |      6 |     |       |        |     |        |        |

All `23` Light frames have an exact Dark counterpart; there are no unpaired frames.

### 1.2 Reusable components used by P6

| Component          | Node       | Instances | Note                                                           |
| ------------------ | ---------- | --------: | -------------------------------------------------------------- |
| `AppHeader`        | `247:58`   |        46 | one per frame; `Auth=SignedOut` only in the signed-out state   |
| `OrdinaryFooter`   | `535:3947` |        46 | `Layout=Wide` at `1280`, `Layout=Compact` at every other width |
| `MetricSummary`    | `224:476`  |       160 | the four competitive-summary cells                             |
| `JudgementMarker`  | `90:34`    |       200 | judgement summary rows                                         |
| `Button`           | `88:46`    |        86 | More, Retry, Data sync, Go home                                |
| `MetricSwitch`     | `1624:295` |        80 | Progress and Best Plays metric tabs                            |
| `SegmentedControl` | `1307:277` |        40 | Basic / Recital mode selector                                  |
| `Select`           | `1305:102` |        40 | Progress range                                                 |
| `StatusMessage`    | `100:41`   |         8 | empty, error, not-found, section error                         |

`StatusMessage` gained a boolean component property `Body#2404:0` in this session,
bound to the body text layer's visibility on all four severity variants. The variant
axis is unchanged at four. Every pre-existing instance defaults to `true`, so P2, C7,
and the earlier P6 instances render pixel-identically; a full before/after snapshot
comparison confirmed zero change. See `PROF-48`.

Two icons are used that other pages do not: `Icon/discord` (the vendored official brand
mark, document 24 `IC-06` bounded exception) and `Icon/globe` for the Other-regions
country marker.

### 1.3 Decision records

`24` approved P6 decision boards sit in the Z1 approved section `268:3`. The pending
section `1998:14169` is empty (`⏸ 보류 항목 — 현재 없음`). The approved section holds
`144` boards in four order-preserving columns with no overlap or section escape.

| Decision                                          | Node         | Result                                      |
| ------------------------------------------------- | ------------ | ------------------------------------------- |
| Recital NosLog Rating exposure                    | `2169:15170` | A — shown (`PROF-33`)                       |
| Mode selector form                                | `2170:15230` | A — `SegmentedControl` `358×44` (`PROF-34`) |
| Progress controls                                 | `2171:15244` | A — underline tabs + compact Select         |
| Avatar fallback                                   | `2173:15270` | C — username initial (`PROF-36`)            |
| Initial derivation rule                           | `2177:15298` | A — first letter grapheme, uppercased       |
| Owner actions placement                           | `2185:15546` | B — right of the identity row               |
| Rank distribution rows                            | `2188:15605` | **Superseded** by `PROF-49`                 |
| Judgement summary                                 | `2188:15794` | D — stacked bar + five exact values         |
| Best Plays row layout                             | `2202:15663` | B — contribution-first two axes             |
| Pianist is a grade, FC is a combo axis            | `2211:15743` | approved; document 24 `AC-01` corrected     |
| Best Plays row composition                        | `2221:15683` | A — default metric is Official Grd          |
| Best Plays metric switch                          | `2223:15719` | A — dedicated switch (`PROF-38`)            |
| Complete-list behavior                            | `2246:15893` | ② — in-place expansion (`PROF-39`)          |
| Wide two-column split                             | `2225:15781` | left ③④ / right ⑤⑥                          |
| Wide 1280 body                                    | `2226:15781` | approved                                    |
| Off-scale spacing correction                      | `2271:16264` | inset 24 · item 12 · between 24             |
| Compact 390 derived values                        | `2290:17377` | six values (`PROF-43`)                      |
| `320` Progress controls                           | `2304:17722` | B — short labels, one row (`PROF-44`)       |
| Owner-action optical padding                      | `2346:17790` | keep as is; `A17` false positive            |
| JA wide Recent timestamp                          | `2358:19513` | A — short JA date form (`PROF-45`)          |
| State copy, four strings                          | `2381:16582` | all A (`PROF-47`)                           |
| Initial loading treatment                         | `2386:25880` | A — list skeletons only (`PROF-46`)         |
| Section error vessel and section-update treatment | `2401:20582` | B + pending colour (`PROF-48`)              |
| Trend plot height                                 | `2416:22137` | width at `16:9`, capped `344` (`PROF-50`)   |
| Rank distribution count column                    | `2422:57299` | keep bars, one derived width (`PROF-51`)    |

---

## 2. Final approved P6 decisions

### 2.1 Copy

Reused from the repository catalogs without change:

`common.retry` · `common.notFoundTitle` · `common.notFoundDescription` · `common.goHome`
· `sync.none` · `sync.processing` · `sync.failed` · `sync.last` · `sync.title`
· `profile.lastPlayed` · `profile.bestPlays` · `profile.recentPlays`
· `profile.rankDistribution` · `profile.judgementBasis` · `profile.globalRank`
· `profile.private` · `profile.playCountPrivate` · `profile.noRank` · `profile.all`
· `profile.collapse` · `rankings.metric.grade` · `rankings.metric.rating`
· `rankings.examBadge` · `footer.privacy` · `home.tagline`

Deliberately **not** used: `profile.bestEmpty`, `profile.recentEmpty`,
`profile.judgementEmpty`, `profile.gradeTrendEmpty`. Document 09 replaces per-card empty
states with one record-empty outcome in the performance area, which supersedes the
current implementation.

Korean is approved for the strings below. Japanese and English are **design proposals,
not approved production copy**; document 09 defers localized production copy downstream.

| Role                    | Korean (approved)                | Japanese (proposed)      | English (proposed)               |
| ----------------------- | -------------------------------- | ------------------------ | -------------------------------- |
| Country rank label      | `국가 순위`                      | `国内順位`               | `Country Rank`                   |
| Progress section        | `성장 추이`                      | `成長推移`               | `Progress over time`             |
| Record overview section | `기록 개요`                      | `記録概要`               | `Record overview`                |
| Judgement section       | `판정 요약`                      | `判定サマリー`           | `Judgement summary`              |
| Expand grade list       | `전체 랭크 보기`                 | `すべてのランクを表示`   | `Show all ranks`                 |
| Play count label        | `플레이 횟수`                    | `プレー回数`             | `Play count`                     |
| Expand list             | `더 보기`                        | `もっと見る`             | `Show more`                      |
| Trend summary labels    | `시작` · `현재` · `변화`         | `開始` · `現在` · `変化` | `Start` · `Current` · `Change`   |
| Trend ranges            | `30일` · `90일` · `1년`          | `30日` · `90日` · `1年`  | `30 days` · `90 days` · `1 year` |
| Sync partial            | `일부 기록만 동기화됐습니다.`    | —                        | —                                |
| No records              | `아직 동기화된 기록이 없습니다.` | —                        | —                                |
| Initial loading         | `프로필을 불러오는 중입니다.`    | —                        | —                                |
| Initial error           | `프로필을 불러오지 못했습니다.`  | —                        | —                                |
| Section error           | `내용을 불러오지 못했습니다.`    | —                        | —                                |
| Short metric labels     | `Grd` · `Rating`                 | same                     | same                             |

`국가 순위` replaces the existing `profile.countryRank` pattern `{country} 순위`. The
value is a position inside a country category, so the label does not name the country
(`PROF-42`).

The short metric labels are the same pair the Rankings metric switch already ships. They
appear only where the full labels do not fit — at `320` in every locale, and at `390` in
Japanese and English (`PROF-44`). The rule is content-driven, not width-driven.

### 2.2 Layout rules implementation must preserve

- **Source order** is identity → competitive summary → Progress → Best Plays → Record
  overview → Recent Plays, at every width. The wide two-column split places ③④ left and
  ⑤⑥ right, which reads down the same order.
- **Card and region insets** follow the grid margin: `24` at wide and intermediate, `16`
  at compact (`PROF-43`). At compact the larger inset does not leave room for a play
  row's difficulty, level, score, and grade image.
- **Trend plot height** is its own width at `16:9`, capped at `344` (`PROF-50`):
  `320 → 144`, `390 → 183`, `672/928/757 → 344`. The cap is the height the wide row
  parity already derives, so wide is unchanged.
- **Identity** at every non-wide width is three rows: avatar beside the name and exam
  group, then wrapping public metadata, then the owner-only sync line paired with the
  owner-only actions. The avatar is square and derives its size from the group beside it
  (`PROF-41`); at compact that is `64`.
- **Competitive summary** is one row of four at wide, two rows of two at `390`, and one
  column of four at `320`. Rows share one left keyline.
- **Play rows** are fixed at `64px` with a one-line, end-truncated title. Recent Plays put
  the timestamp at the end of the title line rather than in a trailing column.
- **Rank distribution** shows the score-grade ladder only — Full Combo is a combo axis and
  is not a bar (`PROF-49`). The count column takes one width from the largest count so
  every bar track is the same length (`PROF-51`).
- **Metric values** are value-then-unit with a `#` rank prefix: `5,713 Grd`, `6,240 pt`,
  `#2`. All four competitive-summary values share one dominant size (`PROF-42`).
- **Section updates** show no visible status line; retained values take `content/pending`
  and the region is marked busy programmatically. Weakening is colour only — opacity was
  rejected for content weakening when that colour was approved (`PROF-48`).
- **Initial loading** pairs list skeletons — the approved Discovery `skeleton row`, hidden
  from the accessibility tree — with one status line, and reserves geometry without
  skeleton content for the chart, summary, and distribution (`PROF-46`).

---

## 3. Final Figma validation

The final read-only audit traversed `16,160` P6 descendant nodes, all `46` frames,
`4,602` visible text nodes, and `1,502` component instances.

| Check                                       | Result                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------- |
| Screen widths                               | `320: 6`, `390: 30`, `768: 2`, `1024: 2`, `1280: 6`                       |
| Light / Dark frame pairs                    | `23`, unpaired `0`                                                        |
| Section escape / sibling overlap            | `0 / 0`                                                                   |
| Horizontal and vertical overflow            | `0`                                                                       |
| Spacing values outside the approved scale   | `0`                                                                       |
| Unstyled text nodes                         | `0 / 4,602`                                                               |
| Locale style vs displayed script mismatches | `0 / 4,602` (`188` corrected in this session)                             |
| Type composites outside the approved 13     | `0`                                                                       |
| Colour bindings, hardcoded fills            | `0`                                                                       |
| Raw colour vs resolved variable mismatches  | `0`                                                                       |
| `NI-A` interaction-fill misuse              | `0`                                                                       |
| Play rows                                   | `370`; non-`64px` rows `0`                                                |
| Play titles                                 | `370`; multi-line `0`                                                     |
| Trend plots                                 | `757×344` ×6, `326×183` ×24, `256×144` ×6, `672×344` ×2, `928×344` ×2     |
| Dark text contrast                          | checked `2,301`, minimum `4.99:1`, failures `0`                           |
| Light text contrast                         | checked `2,301`, minimum `14.55:1`, failures `0` after the 3.1 correction |

### 3.1 The `FC` label contrast finding — resolved 2026-08-28

At the time of the audit all `111` Light failures were the same element: the `FC` mark's
label, drawn in `achievement/full-combo`.

| Backdrop          |  Light |    Dark |
| ----------------- | -----: | ------: |
| `surface/canvas`  | `3.36` | `10.63` |
| `surface/surface` | `3.16` |  `9.70` |
| `surface/sunken`  | `2.77` | `10.63` |

`achievement/full-combo` resolves to `#75980B` in Light and `#B4CE35` in Dark. Dark passes
everywhere; Light fails `4.5:1` on every approved surface and passes the `3:1` non-text
threshold only.

**This is not introduced by P6.** The same label and colour pairing exists on the approved
`LeaderboardRow` in `C7` (`36` instances) and on `P1` (`6` instances). Document 24 `AC-01`
records the role and requires the `FC` label so colour is never the sole cue, but records
no contrast figure for the label text itself.

Deciding this was a Foundation matter, not a Profile one. It was resolved on 2026-08-28:
**the label text takes `content/default` and the mark's `1px` border keeps
`achievement/full-combo`.** The colour role and every resolved value are unchanged; only
the label's fill moves. The label now reads `11.98:1`-`14.55:1` in Light and
`12.44:1`-`13.64:1` in Dark.

Moving the Light ramp step was rejected: the only green inside the approved set that
clears `4.5:1` in Light is `difficulty/068850` at `4.52`, which falls back to `3.72` on
`sunken`, and borrowing a difficulty colour for an achievement role is role misuse.
Filling the mark and inverting the foreground also passes, but it would require a new
mode-invariant dark role token as the counterpart to `content/on-media`, and it makes the
mark considerably louder over jacket art.

Applied to `222` nodes on P6 and to the `3` `C7` component definitions, which propagated
to `35` `C7`, `6` `P1`, and `30` `Z1` instances with no override blocking it. Recorded in
document 24 `AC-01` and on the approved Z1 board
`FC 라벨 = A안` (`2459:16905`). The Z1 boards predating the decision keep the old
treatment as a record.

---

## 4. Runtime checks deferred to implementation

Figma proves visible composition and static state coverage. It cannot execute the
following, which are explicitly **not** passed by this design audit:

- real `aria-busy`, live-region, list, link, button, Select, and disclosure semantics;
- request cancellation and stale-response protection on mode, metric, range, and
  list-expansion changes;
- URL behavior — shareable localized profile URLs, Back/Forward, refresh, and the fact
  that list expansion is view state that does not survive a reload;
- the privacy contract in the real payload: hidden fields absent from HTML, metadata,
  client payloads, analytics labels, accessible names, and generated share artifacts;
- cache invalidation and Open Graph image versioning on a privacy-setting change;
- the full accessible song title when the visible title truncates;
- keyboard-only traversal and browser-rendered Focus visibility;
- actual locale catalog wiring and production-font loading;
- browser reflow at `320 CSS px`, console errors, and automated accessibility checks;
- live data — Recital rating source availability, partial records, single-point trends,
  and rank ties.

The implementation session must run repository lint, typecheck, tests, build, and
proportionate browser checks, distinguish pre-existing failures from regressions, and
compare the implemented page against both document 09 and this approved P6 Figma page.

---

## 5. Scope boundary and open items

This handoff completes the Public-profile page design stage only. It does not authorize
production implementation, redesign of the locked chart viewer or editor, or any change
to the shared shell beyond the one recorded `StatusMessage` property addition.

Open items carried out of this session:

1. **Profile share card — deferred by the user, and scheduled last.** On 2026-08-28 the
   user fixed its position in the queue: it is taken up only after every remaining page
   family is finished, and is not to be proposed earlier. No approved design exists.
   Document 09's Share Card Contract still governs its content; only the visual design is
   outstanding. Reference research and the user's stated constraints are recorded in the
   design-state `RESUME.md`.
2. ~~`FC` label contrast in Light~~ — resolved on 2026-08-28; see section 3.1.
3. **Japanese and English production copy** for the strings in section 2.1.
4. ~~`P5` footer~~ — resolved on 2026-08-28. The `40` affected P5 Korean frames were
   corrected to `footer.privacy` + `home.tagline`, matching the `46` P6 frames. Fixing it
   surfaced `82` child-level overflows and `30` locale-style mismatches on P5, all of
   which were also corrected; see the `2026-08-28` revision in
   [document 71](./71-global-rankings-page-design-handoff.md).

---

## Correction — 2026-08-28 · footer layout variant threshold

The `Layout=Wide` / `Layout=Compact` choice was inconsistent across page families:
`P1`, `P4`, and `P5` used Wide at both `768` and `1024`, while `P6` used Compact at both.
[Document 15](./15-shared-shell-navigation-brief.md)'s Footer Contract sets the footer's
content but no width rule, so the inconsistency had no governing decision.

The threshold is now derived rather than assumed, in the same way the Music-detail tab
threshold was: measure what the single row actually needs. A Wide footer row needs
`padding 24 + links + gap 24 + service notice + padding 24`, which resolves to `648` in
Korean, `780` in English, and **`840` in Japanese** — Japanese binds, because its links
group is `222` and its notice is `546`.

**A footer uses `Layout=Wide` at `840` and above, and `Layout=Compact` below it.** This is
a container-query threshold, not a tier boundary: `840` sits inside the Intermediate tier.

Applied file-wide: `24` frames changed variant — `P1` `8`, `P2` `2`, `P4` `4`, and `P5` `8`
moved from Wide to Compact at `768`; `P6` `2` moved from Compact to Wide at `1024`. Every
product page now follows one rule. Footer overflow is `0`, and no frame escapes its
section afterwards.

## Post-handoff correction — 2026-09-01

Six state frames (초기 오류 · 기록 없음 · 없는 사용자, Light and Dark) had no viewport
floor (heights 308–600, footer directly under content). All now hold the 844 floor
with the content region filling the remainder, matching the P8/P10/P1 shell convention.

## Amendment — 2026-09-05 / 06 · difficulty grammar and representative art

- Best Plays / Recent Plays level text follows `DISC-45` (370 texts re-tagged to the
  `difficulty/text-*` ramp, bars removed).
- `Profile · 390/1280 · Light/Dark · SignedIn · Owner · Basic` show real jacket art
  (10 jackets each); the FC mark stays. Other frames keep placeholders.

## Amendment — 2026-09-06 · share dialog (`PROF-52`)

The dialog between the header share trigger and the P16 card did not exist in the file.
It is now C8 `ProfileShareDialog` (component set, `Layout` Compact 334 / Wide 768 ×
`State` Default · Preparing · Copied · ImageError · CardError) and twelve P6 frames:
`Profile · 390 · Light/Dark · 공유 다이얼로그 · {열림 · 준비 중 · 클립보드 복사 완료 · 이미지 처리 실패 · 카드 생성 실패}`
in the two 상태 sections, and `Profile · 1280 · Light/Dark · 공유 다이얼로그 · 열림` in the
Wide section. Each is the owner Basic frame at its full content height with a full-height `surface/scrim`
rectangle and the dialog instance centred in the first 844 viewport (absolute), the P10 탈퇴
dialog precedent. (A first pass capped the shells at 844, which the A16 pad audit read as
1,865 px of squeezed content; full height removes the finding without a new convention.)

- Actions: **이미지 저장** primary, **클립보드 복사**, **공유** (system share sheet). The user
  chose the current product's three-button composition over the document 09 ordering
  (share sheet as primary) and replaced the third label `X 공유` with `공유`; on a browser without
  the share sheet the same slot falls back to the X Web Intent (`profile.shareX`), which is the
  contract's own fallback. Compact stacks primary full-width over a two-up secondary row; Wide
  right-aligns the three, primary last (DeleteConfirmDialog order).
- Preparing: preview slot as a `surface/sunken` skeleton (pulse per the 2026-09-04 progress
  contract), `이미지를 준비하고 있습니다.` in `body-secondary` `content/subdued`, all three
  buttons `State=Disabled` (no image to act on yet — this is disabled, not busy).
- Copied / ImageError: C4 `StatusMessage` Success / Danger with `Body=false` and the inline
  action hidden; actions stay. CardError: `StatusMessage` Danger + a primary **다시 시도** in
  the actions row (the inline action does not fit at 286 with the sentence, so the row pattern
  of this dialog is used in both layouts).
- Strings: all nine keys exist in the catalog (`profile.shareTitle` … `profile.cardError`);
  no new copy. Preview `aria` = `profile.cardPreview`; close = Esc + button.
- Checks: spacing all in scale · text styles 100% · hard-coded fills 0 (preview is an image
  paint, skeleton is `surface/sunken`) · buttons 40 · close ink 26 from the edge vs title 24
  (A17 within 2) · section containment 0 · overlap 0. Wide 768 was approved on Z1 ㉔
  (2026-09-06; 640 and 334 drawn and rejected) and is recorded in document 24 "Overlay width".

## Amendment — 2026-09-06 · surfaces, mode selector, metadata chips (`PROF-53`–`55`)

Applied to all 54 Profile frames that carry the identity block (every width, mode, locale
and state, including the share-dialog shells):

- Identity block and body sections ③④⑤⑥: fill removed, inset 0 (was 16 compact / 24
  wide); body stack spacing 32 → 48; 1280 grid row spacing 24 → 48, column gap 16 kept
  (8:4 = 805/395 unchanged). Grid row heights re-derived from the taller card. Judgement
  stacked bars re-scaled to the new full width by largest remainder (sum check = width, 0 misses).
- `② 모드 선택기 + 경쟁 요약` split into a wrapper (gap 16): SegmentedControl at content
  width, then the summary card unchanged (`surface/surface`, radius 8, inset 16/24).
- Public metadata: 214 chips (4 per frame, 3 where a field is hidden), 44 high, wrap gap 8.
- Checks: section containment 0 · overlap 0 · text overflow 0 · scoped audits (Compact 390,
  Wide 1280, 상태 Light) clean. Frame heights shrank (390: 2709 → 2641; 1280: 1654 → 1558).
- Codex drew the original comparison (Z1 V05, 390 Dark); Light 390 and 1280 pairs were added
  before approval. The two user modifications (selector outside, chips) are not on the Codex
  board — the applied frames are the authority.

## Amendment — 2026-09-06 · exam grade badges (`PROF-56`)

The two `exam · Basic` / `exam · Recital` frames in every identity block are replaced by
C3 `ExamBadge` instances (`Mode` × `Tier`, grade text overridden from the fixture:
Basic 2급 → `Tier=top`, Recital 3급 → `Tier=high`). Plate 24 high (inset 4, gap 8), band 6, radius
`radius/control`, face `surface/plate`. Frames without exam badges (signed-out, not-found)
are untouched. A DARK VERIFICATION plate sits in the new C3 `ExamBadge` section.

Knock-on fits: the badge is 24 high (was 20), so the compact identity stack (name 32 +
badges) needed 68 inside the 64 avatar row — the stack gap went 12 → 8 (46 stacks) and the
64 avatar rule (`PROF-43` ②) holds. On 1280 the avatar follows the stack (`PROF-41`): the
stack is now 40 + 12 + 24 + 12 + 44 (chips) + 12 + 20 = 164, so the eight Wide avatars are
164 (was 136). Scoped audits after the change: Compact 390, Wide 1280, 상태 Light — clean.

## Amendment — 2026-09-06 · identity block tidy-up (`PROF-57`–`59`)

Applied to all 54 identity blocks: owner actions moved into 행 1 (top-aligned, stack FILL);
a `meta line` text row inserted after 행 1 (`마지막 플레이 2026.08.01 · 동기화 3일 전`, JA/EN
forms `最終プレー … · 同期 3日前` / `Last played … · Synced 3 days ago`); 행 3 and the
last-played chip removed; the chip container became a vertical pair — NOSTALGIA ID chip FILL,
then a row of two FILL chips for Discord and the arcade (stacked at 320 where 153 > 140). Owner
actions are 32×32 (`PROF-57`), row gap 16; the exam-badge row wraps as a safety. On 1280 the identity block became the same two-row structure as compact: row 1 = avatar |
name · badges · meta line | owner actions, with the avatar re-derived from the name stack
(108, was 164 with the chips inside the stack); the chip pair sits below the row at full width. Checks: containment 0 · overlap 0 ·
text overflow 0 · scoped audits (Compact 390, Wide 1280) clean. `sync.last` copy needs a
catalogue change (`마지막 동기화 {rel}` → `동기화 {rel}`; ja/en likewise).
