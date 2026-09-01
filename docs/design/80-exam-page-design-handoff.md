# 80 · Exam Reference and Certification — High-Fidelity Design Handoff

**Page family** P13 · Exams
**Governing brief** [11-exam-page-brief.md](11-exam-page-brief.md)
**Figma page** `P13 · Exams 조립` (file `NosLog v2.0.0`, `cVbWCxhkfxFfHmAKLCyKrD`, page `2824:2`)
**Built** 2026-09-02

---

## 1. What is in the file

12 sections, 54 frames, no page-level stray nodes.

| Section                                        | Frames  |
| ---------------------------------------------- | ------- |
| `Exams · Compact 390` / `· Dark`               | 6 + 6   |
| `Exams · Compact 390 · 상태 스위트` / `· Dark` | 13 + 13 |
| `Exams · 검증 320 (KO)` / `· Dark`             | 2 + 2   |
| `Exams · Intermediate 768 (KO)` / `· Dark`     | 2 + 2   |
| `Exams · Wide 1280 (KO)` / `· Dark`            | 2 + 2   |
| `Exams · Compact 390 · JA`, `· EN`             | 2 + 2   |

**Base 390 — 6 screens.** Basic 8급 로그인 기본 · 연습 분석 펼침 · 검정 선택기
열림(`EXAM-25` 팝오버) · Recital 10급(채점 설명 + 분석 생략) · Event 7th KAC(다중
채보 · 인증 없음) · 로그아웃(공식 참조 + 로그인 액션 1개, `AppHeader Auth=SignedOut`).

**State suite — 13 screens.** Proof flow (파일 선택 준비 — 미리보기 + 5요소
체크리스트 + 보존·이름 동기화 안내 + 제출/교체/취소, 업로드 중 busy, 심사 중, 완료,
반려 + 사유 + 재제출, 업로드 오류, 형식 오류), personal states (Grd. 부족 — Basic
7급 실데이터, 동기화 데이터 없음), and page states (초기 로딩 스켈레톤 + 낭독 문구,
모드 빈 상태, 연습 분석 갱신 중 `content/pending` + `aria-busy`, Event
recital_point형 — `EXAM-10` 분석 생략).

### Shell and measures

Ordinary shell (`AppHeader` + `main` + `OrdinaryFooter`), 844 viewport floor,
content-driven heights. `768` is the one-column rendition (m24, mode control and
selector at their 358 spec width). `1280` is the `EXAM-29` composition: **Grade
rail 292** (mode `SegmentedControl` + all ten Grades with per-row state, current
row `interaction/menu-set` + `emphasis-label`) beside **content 908**; the popover
selector exists only below wide. Footer `Layout=Wide` at 1280.

---

## 2. Decisions realised here

| Decision                                                                                                                     | Record                                     |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `EXAM-25` — popover-listbox exam selector (DestinationPanel contract)                                                        | brief Decision Log                         |
| `EXAM-26` — connected stage cards with scope-explicit condition text                                                         | brief Decision Log                         |
| `EXAM-27` — Practice analysis as one collapsed Disclosure card                                                               | brief Decision Log                         |
| `EXAM-28` — the Korean copy set (two batches) + ja/en drafts                                                                 | brief Decision Log                         |
| `EXAM-29` — wide = Grade rail 292 + content 908 (after the first 805/395 build was rejected; seven 1280 references measured) | brief Decision Log                         |
| `EXAM-30` — stages are a jacket tracklist at every width                                                                     | brief Decision Log                         |
| `EXAM-31` — entry facts as label-over-value clusters in the exam head card                                                   | brief Decision Log                         |
| `EXAM-32` — difficulty labels are coloured text (`difficulty/text-*`)                                                        | brief Decision Log; doc 24 `DU-01` amended |

**New in the design system:**

- `difficulty/text-{normal,hard,expert,real}` alias tokens + five new primitives
  (`difficulty/09834A`, `219563`, `BA5500`, `D85C4F`, `9452CE`) — the `DU-01`
  **text ramp**: same hue, `≥4.5:1` in both modes (doc 24 § _Difficulty text
  ramp_). Non-text `DU-01` marker values are untouched.
- **C3 `DifficultyMarker` revised**: the 12px dot is removed; the
  `{Difficulty} {level}` texts are filled with `difficulty/text-*`. Instance
  consumers at revision time were C3 (4) and P13 (90) only — no other page
  changed.
- C2 `SegmentedControl` gained `Segments=Three, Selected=Third` (the set had no
  third-selected variant, so the Event mode state could not be expressed).

### Stage row anatomy (`EXAM-30`/`EXAM-32`)

Jacket 64 bleeding the card's left edge (`border/empty-slot` 1px on the empty
slot — visible in Dark only, per the 2026-08-13 rule) · sequence `1st/2nd/Fin`
(`metadata`) · one coloured `DifficultyMarker` per allowed chart (multi-chart
Event stages wrap; `head`/`markers` are `FILL` so the wrap constraint exists) ·
original title (`entity-title`, wraps, never truncates) · right-aligned condition
scope + value (`metadata` + `metric-value` tabular) · 2×16 connectors between
rows. The whole row is the Music-detail link affordance, as in C6 rows.

---

## 3. Fixtures and their boundaries

- All exam data is real seeded data from `prisma/import-op3-exams.mjs`: Basic 8급
  (요구 Grd. 2,000 · 1,500 nos · 900,000/1,825,000/2,775,000), Basic 7급, Recital
  10급 (24/52/84점, ペツォールト artist line), Event 7th KAC and 초절기교 2024
  RECITAL (multi-chart sets, music-unlock rewards).
- The official screen anatomy was verified against the Op.3 howto captures
  (`exam_00–03`): top mode tabs → per-tune rows (jacket · difficulty · pass
  condition) → cumulative total — the tracklist structure matches. Event stages
  list **every** allowed difficulty; the game makes the choice at play time and
  `EXAM-12` forbids implying a default.
- 연습 분석 fixture (912,340 / 891,220 / 기록 없음, 누적 1,803,560/2,775,000) sums
  only available stages — no fabricated zero for Fin.
- The rejected-proof reason is representative moderator input, not approved copy.
- JA/EN frames: catalog values are reused where they exist (`exams.*` is complete
  in all three locales); en Grade naming follows the catalog `{mode} Class
{exam}`. New-string drafts were approved 2026-09-02 — native review pending.

---

## 4. Validation

```
A 레이아웃  spacing 위반 0 · 가로 넘침 0 · 섹션 이탈 0 · 섹션 간/형제 겹침 0 · stray 0
            844 바닥 · 마커 wrap 폭 제약 확인 · 타겟 44(선택기·레일 행)
B 타이포    Text Style 미적용 0 · 역할 재검(조건→metric-value · 핵심 문장→body) ·
            로케일 스타일 스위치 · JA/EN 잔여 한국어 0
C 색        하드코딩 0(증빙 미리보기 = media render 규약 제외) · 난이도 text-* 램프
            양모드 4.5:1+ (문서 24 표) · empty-slot 규약 적용(69 슬롯)
시각        1x 렌더 — 390 기본 6장 · 상태 전수 대표 · 320/768/1280 · Dark(기본·1280·
            반려) · JA 기본 · EN Event(4색 마커 wrap)
```

**Not executed — not a pass:**

- Full WCAG contrast sweep in both modes beyond the difficulty ramp and the new
  tokens (deep-verification phase)
- Alignment (centerY) and padding-role audits beyond the compact mechanical audit
- 200–400% zoom, keyboard order, screen-reader semantics (tabs/listbox/status
  announcements are implementation contracts in the brief)
- JA/EN at widths other than 390; JA/EN state-suite variants
- Wide-frame states (the state suite is compact-only)

---

## 5. Open items

1. **Two StatusMessage instances hide their embedded action slot** by
   `visible=false` override (반려 · 업로드 오류, Light and Dark) because the
   frames carry their own explicit buttons — same P10 open item; the durable fix
   is a boolean component property on C4.
2. **ja/en drafts have not had a native review** (standing P9–P12 caveat).
3. **Jackets are empty-slot placeholders**; runtime art comes from the music
   catalog. The photo/preview in the proof-preparation frame is a `media render`
   placeholder excluded from token audits.
4. **The proof-flow states beyond the drawn seven** (e.g., authorization expiry
   mid-upload) follow the brief's behavior contract, not dedicated frames.
5. **URL/history behavior** (`EXAM-04` slug routes, Back restoration), server
   validation, retention jobs, and the moderator interface are implementation
   contracts in document 11 — not drawn.
6. **Practice-analysis note-type cue** (weak-note line in the current product) was
   not drawn; the brief permits it where data is valid, and it can join the
   analysis rows without changing the card contract.
