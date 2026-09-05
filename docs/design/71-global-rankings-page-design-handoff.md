# 71 · Global-Rankings Page Design Handoff — 2026-08-26

This document hands the approved Global-rankings high-fidelity design and its
Figma verification evidence to a later implementation session. It does **not**
replace [document 08](./08-global-rankings-page-brief.md), which remains the
normative product and behavior brief. If this handoff conflicts with document 08,
document 08 governs and this document is wrong.

- Status: `Approved high-fidelity Figma design and design validation complete`
- Implementation status: `Not started in this design session`
- Figma file: `NosLog v2.0.0` — `cVbWCxhkfxFfHmAKLCyKrD`
- Product page: `P5 · Global Rankings 조립` — `1602:2`
- Decision page: `Z1 · 결정 기록` — `268:2`
- Preserved exclusion: the chart viewer and editor remain untouched.

---

## 1. Figma node map

### 1.1 Product and verification sections

The P5 page contains `102` product and verification frames across five review
widths. The `390px` frames include the complete state suites; the other widths
prove compact, intermediate, wide, and locale reflow contracts without inventing
page-local breakpoints.

| Section                                                          | Node         | Frames |
| ---------------------------------------------------------------- | ------------ | -----: |
| `Rankings · Compact 390`                                         | `1602:3`     |     13 |
| `Rankings · Compact 390 · 25-row evidence`                       | `1691:910`   |      2 |
| `Rankings · Compact 320 · Approved A · Light + Dark`             | `1798:2505`  |      2 |
| `Rankings · Wide 1280 · Approved B · Light + Dark`               | `1801:2791`  |      2 |
| `Rankings · Compact 390 · Dark state suite`                      | `1806:5`     |     13 |
| `Rankings · Compact 390 · Dark · 25-row evidence`                | `1806:260`   |      2 |
| `Rankings · Compact 390 · page-boundary tie evidence`            | `1935:5263`  |      2 |
| `Rankings · Intermediate 768 / 1024 · Approved A · Light + Dark` | `1956:5776`  |      4 |
| `Rankings · Locale QA · 320 · KO JA EN · Light Dark`             | `2000:6353`  |      6 |
| `Rankings · Locale QA · 390 · KO JA EN · Light Dark`             | `2000:7362`  |      6 |
| `Rankings · Locale QA · 768 · KO JA EN · Light Dark`             | `2000:8395`  |      6 |
| `Rankings · Locale QA · 1024 · KO JA EN · Light Dark`            | `2000:9428`  |      6 |
| `Rankings · Locale QA · 1280 · KO JA EN · Light Dark`            | `2000:10461` |      6 |
| `Rankings · Locale State QA · JA · 390 · Light Dark`             | `2014:10679` |     16 |
| `Rankings · Locale State QA · EN · 390 · Light Dark`             | `2014:12414` |     16 |

Width and theme distribution:

|  Width | Frames |
| -----: | -----: |
|  `320` |      8 |
|  `390` |     70 |
|  `768` |      8 |
| `1024` |      8 |
| `1280` |      8 |

There are `52` Light and `50` Dark frames. The two extra Light frames are the
page-boundary shared-rank fixtures for page 1 and page 2; they are evidence-only,
not missing Dark product states. The remaining `50` Light/Dark pairs have exact
semantic geometry and content parity.

### 1.2 Reusable components used by P5

| Component                 | Node         | Contract                                                       |
| ------------------------- | ------------ | -------------------------------------------------------------- |
| `MetricSwitch`            | `1624:295`   | 8 variants: Regular/Compact × Grd/Rating × Default/Focus       |
| `PlayerRankingRow`        | `1600:31479` | 4 variants: Peer/CurrentUser × Default/Focus; fixed `60px` row |
| Other-region globe marker | `1595:2`     | approved ordinary-UI icon geometry and accessible label        |

`MetricSwitch` is Compact below `396px` and uses visible `Grd` / `Rating` labels.
At `396px` and above it uses the approved full locale labels. Focus changes the
keyboard-focused metric segment without changing which result is selected.

`PlayerRankingRow` keeps rank, avatar, username, country marker, exam, and value in
the approved integrated anatomy. Only the username's actual link boundary receives
profile-link Focus. The current-user marker does not enter the country-marker column.

### 1.3 Decision records

Both final P5 decisions were moved from the Z1 pending section to the approved
section `268:3` on 2026-08-26:

| Decision                                  | Node         | Approved result |
| ----------------------------------------- | ------------ | --------------- |
| P5 single-line locale copy                | `2142:14554` | A               |
| P5 Updating pending/committed distinction | `2145:14562` | A               |

The pending section `1998:14169` remains in the right column at `x=3488` and is
empty (`⏸ 보류 항목 — 현재 없음`). The two approved boards were appended to the
bottom of the approved column with `48px` separation. The approved section contains
`119` boards with no direct-child overlap or section escape.

---

## 2. Final approved P5 decisions

### 2.1 Exact compact state copy

The type scale is unchanged. The approved A copy removes redundant wording so the
state remains one line instead of shrinking type or allowing two-line reflow.

| Role                       | Korean                                           | Japanese                             | English                                          |
| -------------------------- | ------------------------------------------------ | ------------------------------------ | ------------------------------------------------ |
| Personal unavailable       | `내 순위 없음`                                   | `自分の順位なし`                     | `My rank unavailable`                            |
| Signed-out personal prompt | `로그인 후 내 랭킹을 확인할 수 있습니다.`        | `ログインして順位を確認`             | `Log in to view your ranking.`                   |
| Ranking-load error         | `랭킹을 불러오지 못했습니다. 다시 시도해주세요.` | `ランキングを読み込めませんでした。` | `Could not load the rankings. Please try again.` |

The ten previously wrapping JA/EN text nodes now remain `14px`, one line, and
`20px` high. This is recorded as `RANK-30` in document 08.

### 2.2 Updating pending and committed context

The updating fixture applies approved A:

- the control immediately shows the newest pending `Rating` selection;
- retained successful rows keep the committed `{value} Grd` unit until the new
  response commits;
- the existing generic centered updating message remains unchanged;
- no new status copy, retained-content dimming, or pending-only color is added.

This behavior is represented in six KO/JA/EN Light/Dark Updating frames and is
recorded as `RANK-31` in document 08.

### 2.3 Other decisions that implementation must preserve

- Compact at `320px` uses approved A; Wide at `1280px` uses approved B.
- Intermediate `768px` and `1024px` use approved A.
- Mode is the full-width segmented control; metric and region use `space-between`
  on the secondary row.
- The personal-position container is inset rather than full-width. Its unavailable
  state is inside the same container and center-aligned.
- Personal position omits the duplicated active metric value and stays one line.
- All result-status messages are centered.
- Error and Rating-unavailable recovery actions use the approved `24px` subsection
  gap, never an invented `8px` or `16px` value.
- Ranking rows are fixed at `60px`.
- Both metrics put the unit after the grouped integer: `{value} pt` and `{value} Grd`.
  Revised 2026-08-27 (`RANK-32`); Grd previously used a `Grd {value}` prefix. The Figma
  `PlayerRankingRow` instances still carry the old prefix and are being updated.
- The persistent Rating source/top-70 basis sentence is removed.
- Page size is `25`; shared ranks use competition ranking, including page-boundary
  ties.

---

## 3. Final Figma validation

The final read-only audit traversed `15,707` P5 descendant nodes, all `102` frames,
`3,813` text nodes, and `2,419` component instances.

| Check                                                     | Result                                                |
| --------------------------------------------------------- | ----------------------------------------------------- |
| Screen widths                                             | `320: 8`, `390: 70`, `768: 8`, `1024: 8`, `1280: 8`   |
| Screen-level overlap / boundary escape                    | `0 / 0`                                               |
| Unstyled text nodes                                       | `0`                                                   |
| Script/style mismatches, including mixed-script usernames | `0 / 3,813`                                           |
| Non-footer multiline text                                 | `0`                                                   |
| Exact approved compact-copy failures                      | `0 / 10`                                              |
| Light text contrast                                       | minimum `6.64:1`, failures `0`                        |
| Dark text contrast                                        | minimum `8.61:1`, failures `0`                        |
| Light/Dark semantic pairs                                 | `50`, mismatches `0`                                  |
| MetricSwitch instances                                    | `102`; compact `78`, regular `24`; label failures `0` |
| PlayerRankingRow instances                                | `558`; non-`60px` rows `0`                            |
| Button instances                                          | `64`; padding `0/16/0/16` for all                     |
| Select instances                                          | `102`; padding `0/12/0/12` for all                    |
| SegmentedControl instances                                | `102`; padding `4/4/4/4` for all                      |
| State-role center alignment                               | `36 / 36`                                             |
| Recovery message-to-action spacing                        | `18 / 18` at exactly `24px`                           |
| Initial Loading stable result region                      | `6 / 6`; `360px` result area in `800px` frame         |
| Updating pending Rating / committed Grd fixtures          | `6 / 6`                                               |
| Forbidden persistent Rating-basis copy                    | `0`                                                   |

### Revision — 2026-08-28

Three defect classes were found and corrected after this document was first written.
The original table above measured overlap and escape at screen level only; these were
inside frames and so were not covered by it.

| Correction                            | Frames / nodes | Result                                                                                                                                                                       |
| ------------------------------------- | -------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Untranslated Korean footer            |             40 | `Privacy` and an invented notice string replaced with `footer.privacy` and `home.tagline`; style `control/latin` → `control/ko`. The other `62` frames were already correct. |
| Child-level overflow                  |             82 | `0`                                                                                                                                                                          |
| Text style locale vs displayed script |             30 | `0`                                                                                                                                                                          |

The overflow corrections were:

- The personal-position zone drew its surface as a full-width `RECTANGLE` inside the
  zone's own padded flow, so the backdrop overran the content box by `16px` on each
  side in `46` zones. The rectangle is now absolutely positioned at the zone's size.
  Every sibling's position is unchanged, so the render is pixel-identical.
- The region `Select` was fixed-width, so longer Korean and Japanese labels pushed the
  value and chevron past the control edge in `30` places. All `102` instances now hug
  their content.
- A long username crowded the country marker out of its line in `4` places; the
  username link now yields space and truncates.
- At `320` in Japanese the personal-position row needed `309px` in a `288px` zone. The
  summary group now fills the remainder; the label still fits without truncating.

Post-correction validation: child-level overflow `0`, locale mismatches `0`,
unstyled text `0`, `558` ranking rows all `60px`, Light contrast minimum `6.64:1` and
Dark `8.61:1` with `0` failures — the contrast figures are unchanged from the original
audit.

Representative content evidence also covers zero, one, exactly `25`, `26`, and
larger populations; current user on-page, off-page, ineligible, and signed out;
initial loading, updating, empty, error, and Rating-source unavailable; KO/JA/EN;
long Korean, Japanese, Latin, and mixed-script usernames; and a shared rank crossing
the page boundary.

The Figma renderer uses the established local fallback fonts for inspection. The
implementation authority remains Foundation v0.1 and its approved Pretendard JP
delivery/fallback contract; the Figma fallback is not a new product font decision.

---

## 4. Runtime checks deferred to implementation

Figma can prove visible composition and static state coverage, but it cannot execute
the following requirements. They are explicitly **not passed** by this design audit:

- real `aria-busy`, ordered-list, link, button, Select, pagination, and live-region
  semantics;
- request cancellation and stale-response protection;
- URL normalization, navigable history, Back/Forward restoration, refresh, copied
  links, and no-JavaScript pagination;
- My-position navigation, focus movement, and useful scroll restoration;
- the full accessible username when visual truncation occurs;
- keyboard-only traversal and browser-rendered Focus visibility;
- actual locale catalog wiring and production-font loading;
- browser reflow, browser console errors, and automated accessibility checks;
- live data equality, page-boundary shared ranks, and Rating-source failures.

The implementation session must run repository lint, typecheck, tests, build, and
proportionate Playwright/browser checks. It must distinguish pre-existing failures
from regressions and compare the implemented page against both document 08 and this
approved P5 Figma page.

---

## 5. Scope boundary

This handoff completes the Global-rankings design stage only. It does not authorize
production implementation in this session, redesign of the locked chart viewer or
editor, or Public Profile design. The user explicitly excluded Public Profile from
this Codex design session.

---

## Re-correction — 2026-08-28 · footer service notice restored

The footer-copy correction above was **wrong**. The three strings it replaced were not
invented: they are the service notice approved in
[document 15](./15-shared-shell-navigation-brief.md)'s Footer Contract, and `SHELL-32`
requires that the unofficial-fan-service qualifier be kept in all three locales and not
reduced to a copyright line. Treating "absent from the runtime catalog" as "unapproved"
was the error — this notice is 2.0 copy that has not been implemented yet, since the
current `components/layout/footer.tsx` renders only `© 2026 NosLog` and the links.

**Restored values, exactly as document 15 states them:**

| Locale   | Service notice                                                                         |
| -------- | -------------------------------------------------------------------------------------- |
| Korean   | `© 2026 NosLog · NOSTALGIA 기록·랭킹·아카이브 비공식 팬 서비스`                        |
| Japanese | `© 2026 NosLog · NOSTALGIA の記録・ランキング・アーカイブ非公式ファンサービス`         |
| English  | `© 2026 NosLog · Unofficial fan service for NOSTALGIA records, rankings, and archives` |

Two component defaults and `154` instances were reverted. **The `footer.privacy`
correction stands** — replacing `Privacy` in `control/latin` with the locale's own
`개인정보처리방침` / `プライバシーポリシー` / `Privacy Policy` matches the repository key
and does not conflict with document 15. One consequential fix: the `Layout=Wide`
`service-notice` moved from `HUG` to `FILL`, because the restored Japanese notice is
`546` wide and overran the single row at `768`. It now wraps to two lines, which raises
the footer from `52` to `72` at that width only. File-wide footer overflow is `0`.

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

Twenty-five 390 state/QA frames (Initial loading · Empty · Rating unavailable ·
Initial error · page-2 fixture, across Light/Dark/JA/EN) had no viewport floor — the
footer sat directly under short content at heights of 460–800. All now hold the 844
floor with `main` filling the remainder (the P8/P10/P1 shell convention), and the
affected sections were reflowed column-wise (overlap 0). Separately, `Rankings ·
Intermediate 1024 · Dark · Approved A` had been placed on row 1 of its section,
overlapping the 768 Dark frame by 512px; it now sits on row 2 beside its Light pair.

## Deep-verification amendment — 2026-09-04

- `RANK-33`: 1 px `border/divider` between rows on every list ≥720 wide (Intermediate, Wide,
  locale QA) — 24 lists, 120 dividers. Compact lists unchanged.

## Applied critique amendment — 2026-09-05 · D-1

The user-approved bold-rank treatment is applied on P5 only: 231 published-rank
text instances across 77 frames (77 displayed rank 1 and 154 displayed rank 2).
The current fixtures contain no displayed rank 3; the implementation condition
is still published rank 1–3, including all tied players.

A final sweep covered all 558 published-rank texts. Eligible nodes resolve to
700; the remaining 327 retain 500. The original 14/20 typography, 28×20 rank
box, and fill/family/size/line-height bindings passed the preservation checks.

Figma uses IBM Plex Sans Bold plus the existing type/weight/bold binding.
Assigning this instance-level font face clears textStyleId on those 231 nodes;
this is the explicit scoped weight override approved in document 24, not a
change to the shared metric style. C7 and other page families were not modified.

Visual verification passed for 390 Light/Dark (1602:4, 1806:6), 320 Light/Dark
(1798:2506, 1798:2703), and 1280 Light/Dark (1801:2792, 1801:2978).
Runtime tabular-figure rendering, keyboard behavior, and Pretendard remain
implementation-stage checks; no application code was changed.

## Correction — 2026-09-06 · D-1 re-bound to a Text Style

The 231 rank numerals described above had been given a raw IBM Plex Sans Bold face,
which cleared their Text Style (231 `B1_noTextStyle_raw` audit hits on P5). They
are now bound to `emphasis-label/latin` (14/20 · 600), the composite drawn on the
approved Z1 ㉒ specimen (b). Remaining 327 numerals stay `metric-value/latin`.
P5 scoped re-audit (Compact 390 · Wide 1280): clean; raw-text count 0.
