# 78 · Announcements Archive and Detail — High-Fidelity Design Handoff

**Page family** P11 · Announcements
**Governing brief** [14-announcements-page-brief.md](14-announcements-page-brief.md)
**Figma page** `P11 · Announcements 조립` (file `NosLog v2.0.0`, `cVbWCxhkfxFfHmAKLCyKrD`)
**Built** 2026-09-01

---

## 1. What is in the file

10 sections, 30 frames, no page-level stray nodes.

| Section                                            | Frames |
| -------------------------------------------------- | ------ |
| `Announcements · Compact 390` / `· Dark`           | 7 + 7  |
| `Announcements · 검증 320 (KO)` / `· Dark`         | 2 + 2  |
| `Announcements · Intermediate 768 (KO)` / `· Dark` | 2 + 2  |
| `Announcements · Wide 1280 (KO)` / `· Dark`        | 2 + 2  |
| `Announcements · Compact 390 · JA`, `· EN`         | 2 + 2  |

**Archive — 4 states.** 1페이지(다수 레코드 대표 · 20행 + `Pagination` FirstPage) ·
마지막 페이지(1행 + LastPage) · 3건(페이지네이션 없음, `ANN-08`) · 빈 상태(`공지사항이
없습니다.`). The Home surfaces (critical notice, routine three) live in P2 and are not
duplicated here.

**Detail — 3 states.** 기본(제한 Markdown 본문 전체) · 수정됨(`수정일` 추가, `ANN-23`) ·
80자 제목(**exactly 80 characters**, the per-locale limit boundary).

### Shell and measures

Ordinary shell (`AppHeader` + `main` + `OrdinaryFooter`), 844 viewport floor,
content-driven heights above it. `768` uses a `720` measure; `1280` uses a
**centered** `container/reading 768` column, footer `Layout=Wide`. The Detail return
control is the `SET-42` back pattern (`Icon/chevron-left` 16 + `공지사항`, 44 target).

**Corrected 2026-09-01 (user report):** the wide frames were first built with the
reading column **left-aligned**, copied from the P7 handoff — but that precedent is
the minimal recovery shell only (the P8 decision record explicitly flags P7's `MIN`
alignment as shell-specific). The ordinary-shell convention in this file is a centered
bounded column (Home 640, the 1440 shell's centered 1280), and every news-archive
reference composes a centered reading column. All four wide frames now center the
column; nothing else changed.

---

## 2. Decisions realised here

| Decision                                                                                                                                                                                                  | Record                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `ANN-28` — body typography: h2 `section-title`, h3 `component-title`, p `body`; **strong is not drawn** (no `body-strong` composite; implementation renders weight 600; the spans are named on the nodes) | brief Decision Log                          |
| `ANN-29` — inline links: `content/interactive` + underline; external links add `Icon/external-link` 16                                                                                                    | brief Decision Log                          |
| `ANN-30` — Archive rows reuse the P2 Home announcement-row anatomy (`1115:76`: title `body`, date `metadata` subdued, divider, 12/0 padding, title as the only link, wrap not truncate)                   | brief Decision Log                          |
| Copy — `공지사항이 없습니다.` · `게시일` · `수정일` (+ ja/en), everything else reused (`home.announcements`, footer strings, Pagination labels)                                                           | brief § _Korean, Japanese and English Copy_ |

A material finding recorded with `ANN-29`: this neutral system has **no chromatic link
color** — `content/interactive` is `#131313`/`#F2F2F2`, about `1.13:1` against body
text, so inline the underline is the working cue, not the color. The standalone-link
precedents (`전체 공지`, `공식 X`) worked because placement was the cue.

---

## 3. Fixtures and their boundaries

- Titles and dates are representative runtime data. The three newest reuse the **P2
  Home rows verbatim** in all three locales, so Home and Archive show the same records.
- The 80-character title is exactly 80 (first attempt was 92 and over the limit; the
  second was 80 but cut mid-word; the final string is natural at exactly 80) and
  appears in both the Archive list (wrap demo) and its own Detail frame.
- Pagination page numbers come from the C7 component's approved fixtures; the 20/21
  threshold itself is data behavior (`ANN-08`, annotated on the frame).
- The JA/EN sections carry the 3-row Archive and the base Detail with fully translated
  fixture content — the brief's translation gate means a public locale page never
  shows Korean fallback, so locale frames translate the representative data too.
- The Korean-only-correction fixture (`ANN-21`: ko shows `수정일`, ja/en do not) is
  expressed by annotation on the 수정됨 frame, not drawn per locale.

---

## 4. Validation

```
A 레이아웃  spacing 위반 0 · 가로 넘침 0 · 섹션 이탈 0 · 프레임 겹침 0 · stray 0
            844 바닥 · 내용 유도 높이 · 복귀 컨트롤 타겟 44
B 타이포    Text Style 미적용 0 · 로케일 스타일 스위치 적용 · JA/EN 잔여 한국어 0
C 색        하드코딩 0 · 링크 = content/interactive 바인딩 + 밑줄
시각        1x 렌더 확인 — Archive 1페이지·마지막·빈 상태 · Detail 기본·80자 ·
            1280 Archive · Dark Detail · JA Detail · EN Archive
```

**Not executed — not a pass:**

- Full contrast sweep in both modes (deep-verification phase)
- 200–400% zoom, keyboard order, screen-reader semantics (`time`, `aria-current`,
  list semantics are implementation contracts in the brief)
- A near-5,000-character body fixture (the drawn body is representative but short)
- Middle-page pagination state; JA/EN at widths other than 390

---

## 5. Open items

1. **Inline external-link icons cannot be drawn inside a Figma text run.** In-sentence
   external links show color + underline only; the icon-adjacent form is drawn on the
   standalone link line and the inline contract lives in the frame annotation.
2. **The strong spans are invisible in Figma** by decision `ANN-28`; implementers must
   read the node names (`p · strong 구간: …`) for the 600-weight ranges.
3. **A near-limit 5,000-character body** and the middle pagination page were not drawn;
   both are data-scale variations of drawn states.
4. **ja/en fixture translations have not had a native review** (same caveat as P9/P10).

## Applied critique amendment — 2026-09-05 · D-3

Localized year/month headings are applied to all 14 non-empty Archive frames:
54 headings with 54 auto-layout wrappers. Korean Light/Dark 320, 390, 768, and
1280 specimens, last-page/three-record states, and Japanese/English specimens
are covered. The existing section-title 20/28 at 600, content/default, and
approved 0/8/24 spacing variables are reused.

Eight long frames gained 336px height each. Eight canvas sections were spaced
to accommodate the growth; some Detail frames moved on the canvas only.
Both empty archives retain no group headings. All 14 Detail frames retain
their internal content and dimensions.

Verification preserved all 174 archive row IDs, row order, titles, and dates.
Existing text and pagination across all 30 page frames matched the baseline.
Frame, list, and canvas-section overflow/overlap checks returned zero findings.
Screenshots were inspected at 390 Light/Dark, 320 Light/Dark, 1280 Light,
Japanese, and English. This is static Figma verification; runtime reflow,
keyboard behavior, and application implementation remain separate.
