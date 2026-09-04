# 84 · Deep Verification Report — NosLog 2.0 Figma file

**Scope** file `NosLog v2.0.0` (`cVbWCxhkfxFfHmAKLCyKrD`) — Foundation 00–03, components C1–C8, assemblies P1–P16. Z1 (decision records) excluded. 28 pages · 1,091 top-level frames.
**Run** 2026-09-03 ~ 2026-09-04 · CLAUDE.md §2 A/B/C + contrast sweep + structural traps.

---

## 1. Method

- `audit.js` (design-state) stored in the file's shared plugin data (`noslog.audit/src`, `src_scoped`) and executed per page or per section through a runner. P1 (32,557 nodes) exceeded the MCP call budget as one page and was run per section; all P pages then used the section-scoped runner.
- New contrast sweep (`noslog.audit/contrast`, `contrast_scoped`): every visible TEXT against its nearest solid ancestor fill, resolved per effective variable mode (Light `70:1` / Dark `70:2`); 4.5:1, or 3:1 for ≥24px / ≥18.66px bold; `content/disabled` exempt. Non-text: `border/*` strokes against background at 3:1, with `divider` / `subtle` / `empty-slot` exempt by contract.
- Structural checks beyond the script: section containment and sibling overlap via absolute boxes, FIXED-vs-content clipping (A16), dead space (FIXED parent + FILL child, MIN alignment), typography role survey (emphasis-label / section-title / page-title / metric-display / display usage classified by context), spot renders of every repaired region.

## 2. Defects found and fixed

| Area                 | Defect                                                                                                                              | Fix                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| C1                   | `Icon/copy`, `Icon/circle-help` were page-direct, overlapping the icon section                                                      | Moved into the section (42 icons), section renamed/resized                          |
| C4                   | `DARK VERIFICATION · Radio` label hard-coded `#000000`                                                                              | Bound to `content/subdued`                                                          |
| C5                   | Dark verification instances of SearchField/FilterSortControl carried stroke overrides                                               | Overrides re-bound (9)                                                              |
| C7                   | `TierPlacementGrid` (1640 wide) exceeded its 1458 section and overlapped ContributionForms; DARK plate covered two 320 radar frames | Section widened to 1736, radars moved beside the plate, later sections shifted +278 |
| C7                   | `Pagination · Layout=Compact, State=Focus` had no `focus/ring` border                                                               | `page 1` given the same 1px INSIDE focus stroke as Regular                          |
| C7/C8                | `DeleteConfirmDialog` radius 16 (outside the approved set)                                                                          | Component → `radius/overlay` 10; 12 instances followed                              |
| C8                   | `SkipLink` sat outside the AppHeader section; review board 1512 wide held a 1608 child                                              | Section resized; board set to HUG                                                   |
| C1–C8                | 44 component sets carried Figma's default radius 5                                                                                  | Reset to 0 (cosmetic)                                                               |
| C1/P1                | `Icon/thumbs-up` was the only stroked icon; at 16px its stroke scaled to 1.333 (200 hits in P1)                                     | Strokes outlined to fills like the other icons                                      |
| P3                   | Slider tracks r=2 unbound                                                                                                           | Bound to `radius/full` (20)                                                         |
| P6                   | Five Dark frames left at y=48 (new-node trap) → 9 overlapping pairs across Intermediate / JA / EN sections                          | Re-placed to their rows                                                             |
| P8                   | Preview rows used gap 2 as layout spacing (32)                                                                                      | Gap 4 (indivisible detail)                                                          |
| P8                   | Seven bound fills carried the Light raw colour inside Dark frames                                                                   | Raw synced to the resolved mode value                                               |
| P12                  | `Arcades · 1280 · Detail (2A)` FIXED 1236 with 1516 of content — footer outside the frame (Light + Dark)                            | Content-driven; Wide sections reflowed                                              |
| P15                  | `toc disclosure · open` FIXED 48 with 624 of content — the open TOC rendered collapsed (Light + Dark)                               | HUG; screens 5,147 → 5,723; Compact sections reflowed                               |
| P16/Z1               | Card bottom row FIXED 50 with 54 of content                                                                                         | HUG, re-anchored (10 cards)                                                         |
| P1, P2, P12, P13, C8 | Dark frames still using `elevation/overlay-light`                                                                                   | Swapped to `overlay-dark` (3 · 12 · 1 · 1 · 10)                                     |
| P5                   | `personal summary` label in `emphasis-label`, value in `body-secondary` — inverted hierarchy vs `CONFLICT-24`                       | label `control`, value `metric-value` (40 nodes)                                    |

## 3. Decisions taken (user, 2026-09-04) — Z1 board ⑮

1. **Input control boundary → `border/strong`** — FormField · TextArea · SearchField · Select · FilterSortControl. `border/default` (1.71 / 1.94) failed WCAG 1.4.11 where the boundary is the only cue that a control exists. Doc 24 § _Input control boundary_ added. 14 component strokes + 2 local frames + 9 instance overrides.
2. **P12 cluster bubble → `primary/default`** with `primary/on-primary` label (14.55 / 13.64). `ARC-DV-01`.
3. **P14 saving row drops `interaction/menu-set`**; pending text on `surface/surface` (4.6 / 4.99). `BINGO-DV-01`.

## 4. Results after fixes

```
A 레이아웃  섹션 이탈 0 · 섹션/형제 겹침 0 · stray 0 · 텍스트 넘침 0 · FIXED 내용 클립 0(A16) ·
            spacing 스케일 위반 0 · radius 집합 밖 0 · stroke 1/2 · 아이콘 정사각·크기 위반 0 ·
            죽은 여백: P6 Wide 2×2 행 파리티 잔여 14px 8건(의도된 등고 — 결함 아님)
B 타이포    Text Style 미적용 0(P16 raw 카드 제외) · composite 13종 + nav-fit 밖 0 · 12px 미만 0 ·
            역할 조사: ViewModeSwitch 선택/비선택 정상 · P5 개인 요약 정정 · 나머지 emphasis-label
            사용처는 SM 제목·선택 세그먼트·승인된 PRIV-36 그룹 제목·상태 헤드라인(P8)
C 색        하드코딩 0(예외 규약: media/map render · P16 raw 팔레트 · 인쇄 시편) · raw 불일치 0 ·
            NI-A 위반 0 · 텍스트 대비 실패 0 (전 페이지, 최저 4.51 P13) ·
            비텍스트: 입력 경계 border/strong 적용 후 잔여 실패 = 장식 경계뿐
            (StatusMessage 틴트 컨테이너 · AppHeader 하단선 · 레이더 격자 — 전부 계약 예외)
Dark        전 페이지 Dark 노드 실효 모드 해석 · 오버레이 그림자 스왑 완료
```

## 5. Documented exemptions (not defects)

AppHeader 16/8 optical padding · SearchField A17 diff 4 (8 kept by decision) · Music List `[0,12,0,0]` jacket bleed · scroll-body overflow convention (P3/P4 filter layers) · `Icon/copy` inner rect r=2 (Lucide geometry) · `nav-fit` styles · `Icon/circle-help` 14 (IC-06) · P2 nested canvas screen inside the keyboard demo wrapper · P6 Wide row-parity remainder · P16 `#666674` meta (3.15 worst case — image asset, WCAG basis undecided, handoff 83 §5) · P12 cluster label sweep false positives (sibling ellipse).

`audit.js` was corrected for four false-positive classes found here: A5 skips `layoutWrap=WRAP`; A16 bleed includes `media render` / `map render`; B2 accepts `nav-fit*` styles; A10 accepts `Icon/circle-help` 14.

## 6. Stale carry-over items closed

- "C4 StatusMessage action-slot boolean property" — the component has no action slot and P10/P13 show 0 hidden overrides; the earlier note was wrong.
- "P13 ◆JUST inline-icon retrofit" — P13 contains no `JUST` text; nothing to retrofit.
- "P11 inline external-link retrofit" — external links are their own rows (`p · 외부 링크`: text + `Icon/external-link`), not icons inside a text run; internal links are range-underlined text. No retrofit needed.

## 7. Not executed — not a pass

- Page-level single-image renders were replaced by numeric containment/overlap checks on every section plus renders of each repaired region; a human eyeball pass over every page has not been done.
- 200–400 % zoom, keyboard order, screen-reader semantics (implementation contracts).
- Locale variants beyond the frames that exist (JA/EN at non-390 widths on most pages).
- Share-card WCAG basis (image asset) — open in handoff 83.

## 8. Font handoff — Pretendard verification deferred to implementation (user decision, 2026-09-04)

The Figma file stays on the substitute family (`IBM Plex Sans KR / JP / Latin`, via
`font/family/ko·ja·latin`). The normative family is `Pretendard JP` (doc 24). The MCP
renderer cannot load it without Figma shared fonts (Professional plan), and the user chose
not to upgrade — the real-font check happens in the browser during implementation, which
is also where the product actually renders.

**Every judgment below was measured with IBM Plex widths and must be re-measured with
Pretendard before it is treated as final.** Where the product string does not fit, the
approved fallback order applies — do not invent a new size.

| Where                                | Font-dependent judgment                                                                                                                                                                                          | Re-check                                                                                                                       |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Shell / Home (`HOME-21`, `SHELL-29`) | Destination label cascade `control 14/20 → nav-fit 12/16 → approved abbreviation → two lines`. At 320 the IBM Plex fit set was JA `ランキング`·`データ連携`, EN `Data Sync` (nav-fit); everything else `control` | Re-run the fit per label at 320/390 and record which tier each lands on                                                        |
| Home / SearchField                   | 320 placeholder truncation accepted for JA (208/163) and EN (164/153); KO fits (156/166)                                                                                                                         | Confirm which locales truncate at 320; 390+ must show all three in full                                                        |
| Music Detail (`긴 제목 맞추기` A안)  | Title composite budget beside the 96 jacket: `page-title → section-title → component-title`                                                                                                                      | Re-run with the longest real KO/JA/EN titles                                                                                   |
| Music Detail P1                      | Area switcher combobox→tabs at inline width **424** (EN labels 65·68·52·109 + pad 16/16)                                                                                                                         | Re-measure EN label widths; threshold moves with them                                                                          |
| Music Detail P1                      | 320 radar plot scale 0.80 — limiting locale was **latin** (`Repetition` 56 · `Polyrhythm` 62)                                                                                                                    | Re-measure axis labels; scale is derived, not fixed                                                                            |
| Footer (`SHELL-3x`)                  | Wide layout from **840** (`pad24 + links + gap24 + notice + pad24`; ja 840 widest)                                                                                                                               | Re-measure; breakpoint follows the widest locale                                                                               |
| Profile P6 (`PROF-45`)               | JA date shortened to `8/27 21:40` because `8月27日 21:40` overflowed the 395 card by 1px                                                                                                                         | Re-measure; if Pretendard JP is narrower the short form may be unnecessary — but keep it unless the full form fits with margin |
| Profile P6 (`PROF-44`)               | 320 control labels shortened (`Grd` / `Rating`) so `206 + 8 + 74` fits in 256                                                                                                                                    | Re-measure the tab labels at 320                                                                                               |
| Rankings P5 / Profile P6             | `metric-value` / `metric-display` tabular figures — Pretendard's tabular feature (`tnum`) must be enabled in CSS                                                                                                 | Verify `font-variant-numeric: tabular-nums` is applied where the composite says tabular                                        |
| Everywhere                           | Line heights are fixed per composite (e.g. 14/20, 16/24); Pretendard's ascent/descent differ from Plex, so vertical centring inside 40/44 targets must be re-checked visually at 1×                              | Spot-check buttons, chips, segment labels                                                                                      |
| Share card P16                       | Card weights (700 in Figma vs 800/900 in the current route) — open item 83 §5-1                                                                                                                                  | Decide at implementation                                                                                                       |

Rule for implementation: when a re-measured string breaks a fit, apply the approved
cascade for that surface (documented in the relevant brief) and record the new tier in the
handoff; a new size, a new abbreviation, or a locale-specific composite is a design decision
and goes back through the brief.
