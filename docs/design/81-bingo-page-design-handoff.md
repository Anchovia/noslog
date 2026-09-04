# 81 · Bingo Catalog and Detail — High-Fidelity Design Handoff

**Page family** P14 · Bingo
**Governing brief** [10-bingo-page-brief.md](10-bingo-page-brief.md)
**Figma page** `P14 · Bingo 조립` (file `NosLog v2.0.0`, `cVbWCxhkfxFfHmAKLCyKrD`, page `2897:19406`)
**Built** 2026-09-02

---

## 1. What is in the file

12 sections, 46 frames, no page-level stray nodes.

| Section                                        | Frames  |
| ---------------------------------------------- | ------- |
| `Bingo · Compact 390` / `· Dark`               | 4 + 4   |
| `Bingo · Compact 390 · 상태 스위트` / `· Dark` | 11 + 11 |
| `Bingo · 검증 320 (KO)` / `· Dark`             | 2 + 2   |
| `Bingo · Intermediate 768 (KO)` / `· Dark`     | 2 + 2   |
| `Bingo · Wide 1280 (KO)` / `· Dark`            | 2 + 2   |
| `Bingo · Compact 390 · JA`, `· EN`             | 2 + 2   |

**Base 390 — 4 screens.** 리스트 로그인(최근 기록한 빙고 + 필터·정렬 + 실데이터 12보드
그리드 + 더 보기) · 리스트 로그아웃(개인 요소 전부 생략) · 디테일 로그인(실미션 25행 ·
B4 선택 동기화 · C1 찬스 · 리셋) · 디테일 로그아웃(로그인 프롬프트 1개).

**State suite — 11 screens.** 리스트(로딩 스켈레톤 · 필터 무결과 · 더 보기 busy ·
커버 없음 폴백) · 디테일(풀보드 완료 · 셀 저장 중 `content/pending`+`aria-busy` ·
저장 실패 롤백+재시도 · 리셋 확인 모달(P8 계약, 삭제 칸 수 명시, 취소 우선) · 리셋
실패(기록 보존) · 미션 JA 폴백 `lang="ja"` · 용어 도움말 열림).

### Shell and measures

Ordinary shell, 844 floor, content-driven heights. `320` = 리스트 1열 288 붕괴(브리프의
content-driven 조항) · 보드 셀 54. `768` = 리스트 3열 232 · 디테일 1열판(m24, 보드
스펙 유지). `1280` = 리스트 4열 292 · 디테일 **좌 보드·컨텍스트 열 395(스티키 주석) +
우 미션 열 805**, footer `Layout=Wide`.

---

## 2. Decisions realised here

| Decision                                                                                                                                                                                                                                               | Record               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| `BINGO-21` — list card inherits the current product's anatomy (full-bleed cover, mini-board scrim chip top-right, title/divider/meta)                                                                                                                  | brief Decision Log   |
| `BINGO-22` — cover bottom edge doubles as the progress bar (user idea; YouTube grammar): track white 30%, fill `local-data/single`, cells/25                                                                                                           | brief Decision Log   |
| `BINGO-23` — cell completion = background-fill grammar (Bingosync·Bingo Blitz measured): ink fill, coordinate stays in place in `on-primary`; selection 2px, chance dashed; `A1–E5` coordinates                                                        | brief Decision Log   |
| `BINGO-24` — detail keeps the current product's bones with four repairs (square 68 cells, duplicate counter removed, reward structure exposed, board↔mission sync via `menu-set`); the catalog-summary sentence was removed under the copy-budget rule | brief Decision Log   |
| Term tooltips (user request) — `◆Just` renders underlined + `Icon/circle-help` **14** inline (doc 24 `IC-06` bounded exception), tooltip on the overlay contract, `bingo.term.*`/`bingo.termAria` reused                                               | doc 24 § Iconography |

**New in the design system:** `Icon/circle-help` (C1 `2910:2`, lucide geometry, the
`Icon/copy` precedent) and the **inline-icon workaround**: sentence text tokenized
word-by-word into a `layoutWrap` container (gap 4) so a term group (underlined term +
2px gap + icon in a 14×20 box) wraps as one unit — true inline flow. This resolves
the P11 "no icons inside a text run" open item and is a retrofit candidate for P13's
◆JUST and P11's inline external links.

---

## 3. Fixtures and their boundaries

- All boards are real seed data (`prisma/data/op3-bingos.json`): おもちゃの兵隊の行進
  (FORTE · req 2 · 250/3,000/6,000) as the detail fixture, plus the first-12 catalog
  with real titles, versions, and reward tuples. All 25 detail missions are the real
  cell strings of that board.
- Covers are the cover-music jackets → warm `media render` placeholders (token-audit
  exempt), staying light in Dark (external art). The empty-cover state uses the
  `border/empty-slot` convention.
- Progress fixtures vary across cards (0/3/5/7/8/12/20/25 cells) so the chip, edge
  bar, and state labels (`해금 완료`·`풀보드 완료`) are all exercised.
- **JA missions are representative drafts.** `BINGO-16` makes verified official
  Japanese canonical and forbids presenting reverse-translated Korean as official —
  implementation must source the official text; these frames only demonstrate layout.
  EN missions are drafts pending review, like all P9–P14 locale drafts.

---

## 4. Validation

```
A 레이아웃  spacing 위반 0 · 가로 넘침 0 · 섹션 이탈 0 · 겹침 0 · stray 0 · 844 바닥
            그리드 행 등고(측정→고정→FILL 2패스) · 체크 글리프 잉크 중심 오차 max 0.00
B 타이포    Text Style 미적용 0 · 좌표·수치 metric-value(tabular) · 로케일 스위치 ·
            JA/EN 잔여 한국어 0
C 색        하드코딩 0(자켓 평면 위 scrim 칩·흰 트랙 = on-media 오버레이 규약) ·
            에지 바 fill = local-data/single 바인딩 · Dark 21장 + 오버레이 그림자
            light→dark 스왑 · 보상값 3자리 콤마 74곳
시각        1x 렌더 — 기본 4장 · 상태 대표 · 320/768/1280 · Dark 리스트·디테일 ·
            JA 디테일 · 리셋 모달 · 툴팁 2x
```

**Not executed — not a pass:**

- Full WCAG contrast sweep both modes (deep-verification phase) — including the
  white-30% edge-bar track on arbitrary art and dashed-chance visibility
- Alignment/padding-role audits beyond the mechanical audit + glyph-center check
- 200–400% zoom, keyboard order, screen-reader semantics (board composite pattern,
  checkbox announcements, live regions are implementation contracts in the brief)
- JA/EN at widths other than 390; JA/EN state variants

---

## 5. Open items

1. **The 5×5 board's keyboard pattern** (roving grid vs 25 buttons) is deliberately
   left to component-design per the brief — the frames draw cells as buttons.
2. **Dotted underline** for term triggers is the product convention; Figma renders a
   solid underline approximation (annotated). Implementation: dotted underline +
   `circle-help` 14, target = the whole term group.
3. **ja mission text must come from verified official Japanese** (`BINGO-16`); the
   drawn JA strings are layout fixtures only. All new-string ja/en drafts pend native
   review (standing P9–P14 caveat).
4. **Earlier Dark clones (P10–P13) did not swap overlay shadow styles** to
   `elevation/overlay-dark`; P14 does. Retrofit the older pages during the
   deep-verification phase.
5. **`bingo.continue` and `bingo.unavailable`** in the current catalog conflict with
   the approved contract (`최근 기록한 빙고` replaces continue semantics; no
   unavailable state exists) — catalogue cleanup at implementation.
6. **Sticky behavior** (wide board column) is annotated, gated on the brief's
   keyboard/zoom validation; 12-line chance calculation, batching restoration, and
   optimistic-save guards are implementation contracts in document 10.

## 6. Deep-verification amendments — 2026-09-04

- `셀 저장 중` state: the B4 row no longer carries `interaction/menu-set` while busy
  (`BINGO-DV-01`, brief 10) — pending text on `surface/surface` measures 4.6 / 4.99.
- Sweep exemptions confirmed as intended: `media render` covers (full-bleed, token-exempt),
  `mini board chip` / `edge progress` internals (2px optical), `Icon/circle-help` 14 (IC-06
  bounded exception). `audit.js` now whitelists these by name.
