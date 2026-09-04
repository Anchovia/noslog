# 79 · Arcade Discovery and Detail — High-Fidelity Design Handoff

**Page family** P12 · Arcades
**Governing brief** [12-arcade-discovery-page-brief.md](12-arcade-discovery-page-brief.md)
**Figma page** `P12 · Arcades 조립` (file `NosLog v2.0.0`, `cVbWCxhkfxFfHmAKLCyKrD`, page `2767:18938`)
**Built** 2026-09-01 – 2026-09-02

---

## 1. What is in the file

12 sections, 54 frames, no page-level stray nodes.

| Section                                          | Frames  |
| ------------------------------------------------ | ------- |
| `Arcades · Compact 390` / `· Dark`               | 6 + 6   |
| `Arcades · Compact 390 · 상태 스위트` / `· Dark` | 13 + 13 |
| `Arcades · 검증 320 (KO)` / `· Dark`             | 2 + 2   |
| `Arcades · Intermediate 768 (KO)` / `· Dark`     | 2 + 2   |
| `Arcades · Wide 1280 (KO)` / `· Dark`            | 2 + 2   |
| `Arcades · Compact 390 · JA`, `· EN`             | 2 + 2   |

**Discovery — base 390 states.** 기본(지도 프리뷰 180 + 카드 목록) · 지도 뷰(전체 지도) ·
마커 선택(프리뷰 시트) · 결과 없음 · 필터·정렬 레이어.

**Detail — base 390.** back+상호 → 사진 캐러셀 358×220(`1/3` 카운터 =
`surface/media-scrim` + `content/on-media`) → 영업·거리 → 길찾기(Primary) →
위치·영업시간 카드(지도 + 밑줄 주소 + 인라인 `Icon/copy` + 주간표) → 기체 카드(머리 =
가동 요약 + 범위 한정 검증 문구) → 요금·연락·비고 카드 → 선호 집계 → 정보 제보.

**State suite — 13 frames.** Discovery(로딩 · 위치 실패 · 위치 거부 · 느린 교체 ·
목록 오류) and Detail(가동 전부 미확인 · 영업시간 미확인 · 사진 없음(히어로 생략) ·
선호 지정 중/완료/실패 · 미로그인 · 제보 레이어).

### Shell and measures

Ordinary shell (`AppHeader` + `main` + `OrdinaryFooter`), 844 viewport floor,
content-driven heights above it. `768` is the **one-column rendition of the same
cards** (m24), never a separate structure; `1280` Discovery splits 목록 395 / 지도
805, Detail is 2A (photo grid, body cards 805 + sticky action rail 395), footer
`Layout=Wide` (`ARCADE-34`).

---

## 2. Decisions realised here

| Decision                                                                                                                                                                                                            | Record             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `ARCADE-28` — result rows are independent cards on the C6 surface/radius-8 contract                                                                                                                                 | brief Decision Log |
| `ARCADE-29` — map symbol system: dark square cluster `{n}곳` · `local-data/single` area-proportional preference bubbles (20/28/38) + white count · subdued dot below threshold · 2px selection ring · legend always | brief Decision Log |
| `ARCADE-30` / `ARCADE-33` — the Korean copy set (first and second pass)                                                                                                                                             | brief Decision Log |
| `ARCADE-32` — compact discovery opens with a fixed-height interactive map preview above the list (supersedes `ARCADE-04` composition and the `ARCADE-31` floating button)                                           | brief Decision Log |
| `ARCADE-34` — the cross-width card system: compact 1B · wide 2A · discovery 3A/4A · photos as the default fixture · identity-band duplicate lines removed · address copy = inline icon                              | brief Decision Log |
| `ARCADE-25` (pre-existing) — native official name primary, reviewed localized identity secondary — **drawn in the JA/EN detail frames**                                                                             | brief Decision Log |

New in the design system: `Icon/copy` (C1, `2792:2`, lucide 1.24.0 geometry, 24 box,
stroke 2, `SCALE` constraints — the P5 `Icon/globe` precedent).

### Map and photo placeholders

The map canvas is the runtime Kakao render and photos are venue uploads — both
external media. Figma draws representative placeholders in **raw hex by design**,
named `map render (Kakao 대표 · 외부 렌더 · 토큰 비대상)` / `media render (사진 대표
· 토큰 비대상)`; the token audit exempts those subtrees, and they intentionally stay
light in Dark frames (an external render does not invert).

---

## 3. Fixtures and their boundaries

- The Korean catalog (6 venues, regions, distances, machine counts) is representative
  runtime data shared across Discovery widths and modes.
- **JA/EN Discovery keeps Korean venue names and regions in the original script**
  (`ARCADE-25`: identity is not translated); only UI strings switch. **JA/EN Detail
  uses a Japanese-venue fixture** — native `ラウンドワン 梅田店` as the h1, the
  reviewed alias below it (`라운드원 우메다점` in ko style on the JA frame,
  `Round1 Umeda` in latin on the EN frame), a Japanese address, `100円 / 1クレジット`
  (`ARCADE-26`: local currency, no conversion).
- The photoless venue is a **state variant** (hero omitted per the brief's
  omit-empty-region clause); the base fixture has three photos.
- Weekly-hours rows, phone, and website are representative; the `기체 정보 {n}일 전
확인` verification line is scoped to the cabinet card it describes.

---

## 4. Validation

```
A 레이아웃  spacing 위반 0 · 가로 넘침 0 · 섹션 이탈 0 · 섹션 간 겹침 0 · 형제 겹침 0
            stray 0 · 844 바닥 · 복사 컨트롤 타겟 44/40(잉크 갭 4)
B 타이포    Text Style 미적용 0 · 로케일 스타일 스위치 적용(/ko→/ja·/latin) ·
            JA/EN 잔여 한국어 0(원어 유지분 제외)
C 색        하드코딩 0(map/media render 제외 규약) · 신설 토큰 없음(media-scrim 재사용)
시각        1x 렌더 확인 — 390 기본 6장 · 상태 스위트 · 320/768/1280 · Dark ·
            JA Discovery/Detail · EN Discovery/Detail · 기본 섹션 전체 한 장
```

**Not executed — not a pass:**

- Full WCAG contrast sweep in both modes (deep-verification phase)
- Alignment (centerY) and padding-role audits beyond the compact mechanical audit
- 200–400% zoom, keyboard order, screen-reader semantics (map alternative list,
  `aria-busy`, live regions are implementation contracts in the brief)
- JA/EN at widths other than 390; JA/EN state-suite variants

---

## 5. Open items

1. **ja/en strings for the `ARCADE-30`/`ARCADE-33` Korean set are build drafts** —
   written for these frames, no native review yet (the standing P9–P11 caveat). The
   draft table is in the working log and the session report; catalog keys that
   already exist (`arcades.*`, `feedback.*`, footer, common) were reused as-is.
2. **The map is drawn as a placeholder.** The symbol system (`ARCADE-29`) is the
   design contract; clustering thresholds, the fixed national scale for bubble
   areas, and the legend layer behavior are implementation work on the Kakao SDK.
3. **Localisation trap recorded for implementers of no consequence, but for future
   Figma passes:** cloned text nodes keep their Korean-era fixed widths
   (`textAutoResize: HEIGHT`), so translated labels wrap mid-word until widths are
   released — 111 nodes were reset to `WIDTH_AND_HEIGHT` in the locale frames.
4. **The report layer's seven report types** render from the approved copy; their
   submission flow states (busy/success/failure beyond the drawn three) follow the
   P10 form-state patterns rather than dedicated frames.
5. **Photo carousel interaction** (swipe, counter advance, full-screen view) is
   annotated, not drawn; only the `1/3` resting state exists.

## 6. Deep-verification amendments — 2026-09-04

- `Arcades · 1280 · Detail (2A …)` (Light and Dark) was a FIXED 1236 frame whose main
  column measured 1404 — the footer sat 280px outside the frame. Both frames are now
  content-driven (1516) and the Wide sections were reflowed (no overlap).
- Cluster count bubbles: `local-data/single` → `primary/default` (`ARC-DV-01`, brief 12).
  The label stays `primary/on-primary`. Note for the contrast sweep: the bubble is a sibling
  ellipse, so the automated background lookup reports the map placeholder instead —
  the 52 P12 "cluster label" failures in the sweep are false positives.
- Dark overlay shadow style swapped to `elevation/overlay-dark` on 1 node.
