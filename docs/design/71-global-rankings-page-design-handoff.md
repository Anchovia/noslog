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
- retained successful rows keep the committed `Grd {value}` unit until the new
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
- Rating values use `{grouped integer} pt`; Grd values use `Grd {grouped integer}`.
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
