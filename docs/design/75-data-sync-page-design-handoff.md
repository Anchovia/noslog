# 75 · Data Sync — High-Fidelity Design Handoff

**Page family** P8 · Data Sync
**Governing brief** [13-data-sync-page-brief.md](13-data-sync-page-brief.md)
**Figma page** `P8 · Data Sync 조립` (file `NosLog v2.0.0`, `cVbWCxhkfxFfHmAKLCyKrD`)
**Built** 2026-08-28 – 2026-08-30

---

## 1. What is in the file

12 sections, 62 frames, no page-level stray nodes.

| Section                                   | Frames | Contents                                          |
| ----------------------------------------- | ------ | ------------------------------------------------- |
| `Data Sync · Compact 390`                 | 14     | Every state the brief's status model defines      |
| `Data Sync · Compact 390 · Dark`          | 14     | Same, Dark mode                                   |
| `Data Sync · 320` / `· Dark`              | 3 + 3  | 완료 · 전체 기록 / 첫 사용 · 설치 펼침 / 미로그인 |
| `Data Sync · 768` / `· Dark`              | 3 + 3  | Same three, one column                            |
| `Data Sync · 1280` / `· Dark`             | 3 + 3  | Same three, two-area composition                  |
| `Data Sync · 390 · JA · Light` / `· Dark` | 4 + 4  | 완료 · 전체 / 완료 · 최근 30 / 첫 사용 / 미로그인 |
| `Data Sync · 390 · EN · Light` / `· Dark` | 4 + 4  | Same four                                         |

The fourteen Compact states are: 완료(전체 기록 · 최근 30플레이 · 일부 제외) · 처리 중 ·
지연 · 시간 초과 · 대기 중 · 실패 3종 · 미로그인 · 첫 사용(설치 펼침) · 동기화 이력 펼침 ·
무효화 확인 모달.

### Zone order

The returning-user source order from the brief, in every width:

`zone · 상태` → `zone · 최근 동기화 결과` → `zone · NosLog 보유 현황` →
`zone · 변경 미리보기` → `zone · 설치 · 이력` → `zone · 도움말 · 보안`

At `1280` these are distributed across `col 805` (main) and `col 395` (supporting).

---

## 2. Approved decisions realised here

| Decision                                                                            | Where                                   | Record                                                                                          |
| ----------------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Copy for every state — 5 superseded keys, 12 new labels, 6 state messages           | all frames                              | brief § _Korean, Japanese and English Copy_                                                     |
| Two labels shortened on measurement (`북마클릿 등록`, `갱신된 베스트 기록`)         | setup disclosure, metric 3              | brief § _Two labels shortened on measurement_                                                   |
| **`SYNC-26` — wide areas follow the state, not fixed slots**                        | `1280 · 첫 사용`                        | brief § _Wide first-use composition_; Z1 board `P8 · Wide 첫 사용 조성`                         |
| **`SYNC-27` — Compact primary action spans the column; Wide keeps intrinsic width** | `320` / `390` status zone, 32 instances | brief § _Compact primary-action width_; Z1 boards `P8 · 주 액션 폭 (Compact)` and `(Wide 1280)` |
| Locale sources for guidance and modal strings                                       | JA/EN frames                            | brief § _Locale sources …_                                                                      |
| Help and security copy — 3 headings, 2 sentences, approved 2026-08-30               | 도움말 · 보안 zone                      | brief § _Help and security section_                                                             |

### `SYNC-26` in one line

When a state has no result, installation guidance becomes the main `805` area and
help/security the supporting `395` one. Before the fix the main area was `48` pixels
tall beside a `1116` pixel supporting column.

The rejected alternatives are kept in Z1 as `폐기 · …` panels with annotations. The
one-column `reading 768` option was rejected because `768` is used only by P7's
minimal recovery shells; every ordinary page uses the full `1216` container at `1280`.

---

## 3. A correction worth carrying forward

The guidance media placeholders originally rendered `{label} GIF 자리` as **visible**
text. In [`components/bookmarklet/guideMediaPlaceholder.tsx`](../../components/bookmarklet/guideMediaPlaceholder.tsx)
that string is the `aria-label`; the visible text is `sync.gifPending`
(`예시 GIF 준비 중` / `サンプルGIF準備中` / `Example GIF coming soon`). All 70 placeholder
texts were corrected and each holder frame now records its accessible name in its node
name (`media placeholder · aria=…`), sourced from the existing `sync.*Alt` keys.

This removed what had been logged as an unresolved copy item: no new string is needed.

---

## 3b. Typographic role correction — 2026-08-30

A first review of this page reported "Text Style 100%", which counted only whether a
style was _applied_. It did not check whether the applied style's **role** was correct,
and two were not.

| Node                                                           | Was                                  | Now                             | Why                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------------------------------- | ------------------------------------ | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PC에서 등록하는 방법`, `모바일에서 등록하는 방법` (and ja/en) | `emphasis-label` `14/20 · 600`       | `component-title` `16/24 · 600` | Document 24 bounds `emphasis-label` to two things: a StatusMessage title and a selected segment label. These are neither — they are the identity of a grouped module inside the install section, which is what `component-title` is for. P1 uses it the same way for `점수 분포`. The old ladder also skipped the `16` step entirely, leaving sub-heading and body at the same size |
| The five installation and execution step lines (and ja/en)     | `body-secondary` + `content/subdued` | `body` + `content/default`      | `body-secondary` is defined as _"간결한 보조 맥락. 유일한 핵심 의미 금지."_ For a first-time user these steps are the page's core meaning and its only carrier. This brief also calls the page **text-led**; the text-led content cannot be its dimmest style                                                                                                                       |

`28` sub-headings and `70` step lines were changed across all locales and both modes.
The first-use frame grew from `1520` to `1548`.

**Deliberately unchanged:** the signed-out screen's three-line process _preview_
(`1. 북마클릿 등록` …) stays `body-secondary`, because the brief calls it a _concise
preview_ and the primary action on that screen is signing in; status chips (`완료`,
`실패`, `처리 중` …) and scope labels (`전체 기록`) keep `emphasis-label`, which is a
separate question this correction does not reopen; `예시 GIF 준비 중` stays `metadata`;
button labels stay `control`; the invalidation dialog title keeps `component-title`.

## 4. Validation

Run across all 62 frames after the final composition change.

```
A 레이아웃  spacing 위반 0 · 가로 넘침 0 · 섹션 이탈 0 · 페이지 직속 stray 0
            자식 대 자식 겹침 0 · 폭별 프레임 320:6 · 390:28 · 768:6 · 1280:6
B 타이포    Text Style 미적용 0 · 로케일 접미사 불일치 0 (일본어 곡명 4곳 `*/ja` 로 정정)
            역할 감사 실행 — emphasis-label 2건 · body-secondary 5건 정정 (§3b)
C 색        바인딩 100%(하드코딩 0)
            Light 840건 측정 · 최저 6.53:1 · 실패 0
            Dark  840건 측정 · 최저 7.25:1 · 실패 0
시각        1x 렌더 확인 — JA 완료 · EN 첫 사용 · KO Dark 완료 · 1280 첫 사용
```

**Not executed — not a pass:**

- 200% text zoom reflow (brief § _Short and Zoomed Viewports_)
- Keyboard order and focus-return through the invalidation modal
- Media enlargement behaviour; the frames carry placeholders, not real GIFs
- Intermediate widths between `390` and `768`

---

## 5. Open items

1. **`e-amusement ベーシックコース（Basic Pass）`** — the brief requires "the localized
   equivalent", and the repository has no precedent for this term in any locale. The
   Japanese rendering used here follows the standard katakana form but has not been
   checked against the official Japanese site. Confirm before shipping.
2. **Cooldown countdown** renders `12초` as representative data. The value comes from
   the server response; no fixed number is implied.
