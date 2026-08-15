# 67 · Design Session Handoff — 2026-08-15

이 문서 하나만 읽고 이어서 작업할 수 있게 쓴 인수인계다. Figma 파일 `NosLog v2.0.0`
(`cVbWCxhkfxFfHmAKLCyKrD`) 의 하이파이 디자인 작업이며, 이전 인수인계는 문서 65(08-13)와
문서 66(08-14)이다. 이 문서가 최신이다.

---

## 0. 시작 전에 반드시

1. `CLAUDE.md` 를 **끝까지** 읽는다. 반복해서 어긴 규칙만 남겨 둔 파일이다.
2. 만들 대상의 Page Brief 를 **끝까지** 읽는다. 상위 문서만 읽고 시작하지 않는다.
3. 사용자가 **"시작"** 이라고 말하기 전에는 아무것도 만들지 않는다.
4. **커밋하지 않는다.** 커밋은 사용자가 직접 한다. (예전에 임의로 커밋해서 되돌린 적 있음)
5. 문서에 근거 없는 시각 결정이 나오면 **만들지 말고 비교 시안을 그려서 묻는다.**

권위 순서: ① 사용자의 최신 결정 → ② `AGENTS.md` → ③ `README.md`·문서 57 →
④ 문서 07(뷰어/에디터 절대 보존) → ⑤ 문서 24(Foundation) → ⑥ 문서 25 → ⑦ 해당 Page Brief →
⑧ 문서 22·63

상태 파일(영구 경로, 세션 스크래치패드에 쓰지 말 것):
`~/.claude/projects/-Users-carol-Desktop-project-noslog/design-state/`
→ `RESUME.md` · `state.json` · `R2-conflicts.md` · `audit.js` · `brief-contracts-notes.md`

---

## 1. Figma 페이지·노드 맵

| 페이지                   | id      | 내용                                                                                                                                                     |
| ------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1 · Icons               | `86:3`  | Lucide 36개. 이름은 `Icon/chevron-down` 형식                                                                                                             |
| C2 · Actions             | `86:4`  | `88:46` Button (Style Primary/Neutral/Ghost/Destructive × State 5)                                                                                       |
| C3 · Markers             | `86:5`  | 난이도·판정 마커                                                                                                                                         |
| C4 · Forms & Feedback    | `86:6`  | **`92:48` FormField**(Default/Focus/Filled/Invalid/Disabled/ReadOnly · 360×96) · **`100:41` StatusMessage**(Information/Success/Warning/Danger · 520×76) |
| C5 · Search & Refinement | `86:7`  | SearchField · ContentScopeSwitch · FilterSortControl · ViewModeSwitch · Disclosure                                                                       |
| C6 · Entity & Result     | `86:8`  | ResultCollection · MusicEntityHeader · DifficultySelector · MetricSummary                                                                                |
| C7 · Dense Data          | `86:9`  | OrdinaryDataChart · DataTable/Pagination · TierPlacement · **ContributionForms(신규)**                                                                   |
| C8 · Overlays & Shell    | `86:10` | AppHeader · DestinationPanel · AreaSwitcher · 셸 조립 `596:1389`                                                                                         |
| P1 · Music Detail 조립   | `242:2` | 셸 3종                                                                                                                                                   |
| Z1 · 결정 기록           | `268:2` | `268:3` ✅승인 완료 / `268:11` ⏸보류 — **현재 보류 0건**                                                                                                 |

C7 주요 섹션: `270:74` OrdinaryDataChart · `357:74` DataTable·Pagination ·
`471:765` TierPlacement(서열) · **`668:1340` ContributionForms(이번에 신설)**

---

## 2. 지금까지 완료된 것

- **Foundation** 문서 24 정확값 반영 완료(위반 973 → 0). 색 변수(Light `70:1`/Dark `70:2`,
  컬렉션 `VariableCollectionId:70:3`) · Text Style **45개** = 13 composite × ko/ja/latin(39)
  더하기 `nav-fit/*`·`nav-fit-current/*`(6)
- **C1~C7 완료**, C8·P1 부분 완료
- Music Detail 서열·평가 영역: ① 서열 배치 · ② 커뮤니티 투표 분포 · ③ 패턴 레이더 완료
- 랭킹: LeaderboardRow 열 고정 + 성취 마크(FC·P) · MyRankSummary · Pagination · 점수 분포
- 공식 등급 이미지 8종을 `public/grade/` 에 **자체 호스팅**으로 내려받아 둠
  (`components/music/ranking/rankImage.tsx` 는 아직 원격 URL 핫링크 — 구현 단계 작업)

---

## 3. 2026-08-15 세션에 한 일

### 3.1 문서 05 오염값 정정

Codex 가 커밋 없이 덮어쓴 값 중 문서 24와 충돌하는 두 개를 제거했다.

- 마커~숫자 간격 `6px`(스케일 밖) → "inseparable-detail gap"(= `4` 역할)
- 축 행 높이 `109px`(부분 합 132과 불일치) → "구성요소의 합이 곧 행 높이"
- `MDET-90` 등록 행도 같은 방식으로 정정

나머지 4개 항목(분포 삽입 위치·지시자, 선택 구분 방식, 12/12/12/16 간격, 문구 정정)은
문서 24와 충돌이 없어 유지.

### 3.2 사용자 결정 2건 (시안을 그려서 받음)

| 항목               | 채택                                                                                                      | 기각 사유                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **미평가 표현**    | **B안** — 선택지는 `0`–`4` 다섯 개뿐, 미평가 = **선택 없음**. 값이 있을 때만 축 헤더 오른쪽에 `선택 해제` | A안(`미평가`를 여섯 번째 선택지로)은 척도 안에 데이터 없음 상태를 섞는다        |
| **투표 값 컨트롤** | **A안 단일 드롭다운** — 1.0–14.5 · 0.1 단위 136개를 한 목록                                               | B(정수+소수 2단계)는 한쪽만 고른 중간 상태 발생 · C(스텝퍼)는 1.0→13.2 가 122탭 |

Z1 `268:3` 에 기록 완료. 폐기안은 `폐기 · …` 로 이름을 바꾸고 주석에
"채택되지 않았다 · 구현 근거로 쓰지 말 것 · 채택안은 X" 를 넣었다. **보류 섹션은 0건이다.**

### 3.3 만든 컴포넌트 — C7 `668:1340` ContributionForms

| 노드                         | id          | 내용                                                                                                                         |
| ---------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `PatternRatingChoice`        | `668:1339`  | Selected False/True × State Default/Hover/Focus/Disabled = 8 variant. **폭 57 = 12+20(마커)+4+9(숫자)+12 로 유도** · 높이 48 |
| `PatternAxisRow`             | `668:1402`  | State Unrated/Rated. **두 variant 모두 높이 132** = 12(divider→제목) + 44(헤더) + 12 + 48(선택지) + 16                       |
| `PatternEvaluationForm` 조립 | `669:1332`  | 358 폭 패널 · 5축(계단 2 · 연타 미평가 · 폴리리듬 3 · 즈레 미평가 · 동시치기 0)                                              |
| `TierVoteContribution`       | `671:1455`  | SignedOut / NoRecord / NotEligible / Eligible / Voted — 공개 집계는 그대로 두고 **기여 영역만** 교체                         |
| `TierVoteEditForm`           | `674:1473`  | Default / Error. 값 드롭다운 → 범위 도움말 12 → 액션 12 · 오류 시 도움말→패널 12 · 패널→액션 16                              |
| `DARK VERIFICATION`          | `674:10261` | 위 전부의 Dark 플레이트                                                                                                      |

선택지 표기: 미선택 = `surface/sunken` 면 + `content/subdued` 텍스트 + `border/default` 링 /
선택 = `surface/surface` 면 + `border/default` 1px INSIDE + 마커 점 + `content/default`.
Focus 는 FOCUS-1B — 평상시 경계가 있으면 색만 `focus/ring` 으로 교체, 없으면 포커스에서만 부여.

### 3.4 이번에 잡은 사고 (반복 금지)

**`figma.createAutoLayout()` 이 만드는 프레임은 바인딩 없는 흰 fill 을 기본으로 갖는다.**
Light 에서는 흰 배경에 묻혀 안 보이고 **Dark 플레이트에서만 흰 상자로 드러난다.**
이번에 래퍼 19개가 해당돼 전부 `fills=[]` 로 정리했다. 앞으로 `createAutoLayout` 직후
fill 을 명시적으로 정한다(면이 필요 없으면 `fills=[]`).

C1 아이콘 컴포넌트 내부 프레임에도 흰 fill 이 있지만 **`visible:false` 라 위반이 아니다.**
건드리지 말 것(건드리면 인스턴스에 불필요한 override 가 생긴다).

### 3.5 `audit.js` 수정 2건

- `A1` 광학 예외 정규식에 `\bmark\b` 추가 — 승인된 `mark FC` 의 2px 광학 패딩 76건이
  위반으로 잡히던 오탐 제거
- `A13_legacyRing` 에서 존재하지 않는 `findings.push` 를 `add()` 로 교체 — 구형 focus ring 이
  하나라도 있으면 감사 전체가 ReferenceError 로 죽던 버그

### 3.6 검수 결과 (audit.js 전수 · 페이지 C7 · 2451 노드 · Dark 1055)

```
A 레이아웃  spacing 위반 0 · 패딩역할 OK · variant 높이 일치(132/132) · 겹침 0 · 섹션 이탈 0
            텍스트 넘침 0 · A15/A16 압착 0 · centerY 오차 0 · stroke 1px OK
            radius: COMPONENT_SET 컨테이너 r=5 14건 — Figma 기본 chrome(기존 10건 포함)
B 타이포    Text Style 100% · composite 13종 내 · weight OK · 12px 미만 0 · tabular 위치 OK
C 색        하드코딩 0 · raw 불일치 0 · NI-A 위반 0(interaction 24건 전부 상태 variant 내)
            Light/Dark 양쪽 실행
```

**미실행(통과 아님)**: 320px reflow · WCAG 대비 계산(미선택 sunken vs 선택 surface 면 차이) ·
최장 KO/JA/EN 콘텐츠 잘림 · ja/en 로케일 표본.

### 3.7 변경된 파일 (전부 **미커밋**)

- `docs/design/05-music-detail-page-brief.md` — 오염값 정정 + 미평가 표현 결정 근거 +
  `MDET-90` 상태를 `Approved — 2026-08-15` 로
- `CLAUDE.md` — 결정 기록에 "미평가 표현" · "서열 투표 값 컨트롤" 두 행 추가
- `docs/design/66-…handoff-2026-08-14.md` — 이전 세션에서 사용자가 영어로 번역한 것(내가 안 건드림)
- 상태 파일 `RESUME.md` · `audit.js` (레포 밖)

---

## 4. 바로 이어서 할 작업 — ④ 투표·평가 폼의 남은 부분

문서 05 `1121-1310` 이 근거다. 위 3.3 에서 만든 것 외에 남은 것:

0. **⚠️ 먼저 고칠 것 — 기존 컴포넌트 재사용 누락.** 내가 C4 를 잘못된 페이지 id 로 조회해서
   "FormField·StatusMessage 가 없다" 고 판단하고 손으로 다시 만들었다. 실제로는 **C4 `86:6` 에
   `92:48` FormField 와 `100:41` StatusMessage 가 이미 있다.** 다음을 교체해야 한다.
    - `TierVoteEditForm` `674:1473` 의 오류 패널 → **`StatusMessage · Severity=Danger` 인스턴스**
    - `TierVoteEditForm` 의 값 드롭다운 → **`FormField`** 로 대체 가능한지 먼저 확인
      (FormField 는 360×96 이라 라벨·도움말을 포함한 구성일 가능성이 높다. 구조를 읽고 판단할 것)
    - `TierVoteContribution` `671:1455` 의 자격 설명문도 StatusMessage 로 표현하는 게 맞는지 검토
      (다만 문서 05 는 "권한 메시지를 데이터 부재의 대체물로 쓰지 말라" 고 하므로 그대로 텍스트가
      맞을 수도 있다 — 판단 후 사용자에게 확인)
1. **서술형 의견 입력 필드** — 일반 채보 평가에는 선택적 서술 의견이 있다. C4 에 TextArea 계열이
   있는지 **`86:6` 에서 직접 확인**하고, 없으면 새로 만들되 상태와 글자 수 처리는 문서에 없으므로
   **만들기 전에 물어볼 것.**
2. **삭제 범위 3종** — 목적별 투표 삭제 / 일반 평가 삭제 / 의견 삭제가 서로 독립이다.
   각각의 확인 대화와 결과 문구가 필요하다. 확인 대화 컴포넌트도 아직 없다.
3. **6범위 압축 행과의 조립** — `481:975` CommunityTierVoteRow(C안 압축 행) 와
   `493:981` 분포, 그리고 이번 `671:1455` 기여 영역을 하나의 서열·평가 패널로 조립.
   펼친 범위 바로 아래에 분포가 오고, 지시자는 오른쪽→아래로 바뀐다(문서 05 MDET-87).
4. **미승인 문구 확정** — `내 패턴 평가` · `선택 해제` · `투표 저장` · `투표 삭제` · `평가 삭제` ·
   자격 설명문 4개. 전부 임시값이며 노드 이름에 `(문구 미승인)` 으로 표시해 뒀다.
5. **Dark 플레이트 갱신** — 위 항목을 추가할 때마다 `674:10261` 에도 반영.

---

## 5. 그 다음 — ⑤ 커뮤니티 의견 (문서 05 `1312-1450`)

- 행 구성: 작성자 · 시각 · 본문 · Helpful 반응. **행마다 패턴 축 값을 넣지 않는다.**
- Helpful 반응과 그 자격 조건
- 정렬 2종 + 명시적 **더 보기**(무한 스크롤 아님)
- 작성자 편집 + 삭제 범위 2종
- 신고·모더레이션 · 접근성 결과

---

## 6. 그 뒤로 남은 전체 작업

- **손대지 않은 Page Brief 13개**: 03 · 04 · 06 · 08 · 09 · 10 · 11 · 12 · 13 · 14 · 16 · 17 · 19
- pressed `scale(0.98)` 를 남은 작은 컨트롤에 전파 (MO-02)
- 데스크톱 랭킹 열 분해
- **Pretendard 교체 후 전면 재검수** — `font/family/ko·ja·latin` 3개만 바꾸면 되지만
  바꾼 뒤 레이아웃을 다시 봐야 한다
- P1 Dark 셸 · C8 Focus variant 잔여
- 미결 CONFLICT: 11 · 12 · 15 후속 · 16 · 참고-25 · 참고-26
- 보류: 선택 세그먼트의 `border/strong` 과 문서 24 NI-A 관계 정리
- 문서 24 개정 필요 4건(역할 확장 · 레이더 반투명 채움 불투명도 등)

---

## 7. 절대 건드리면 안 되는 것

- **채보 viewer/editor 전체 잠금**(문서 07) — 재설계·recolor·Foundation 적용·신규 variant 금지.
  진입 링크만 다룬다
- 관리자 `/admin/*` 광범위 재설계 없음
- user chart-contribution 흐름 **신규 생성 금지**
- 레거시 NOSTORY Figma 를 현재 권위로 쓰지 않는다
- 문서 63 regression harness 를 최종 구성으로 복사하지 않는다
- 문서 18 개인정보 release blocker 를 해결된 UI 로 위장하지 않는다
- 로컬 MP3 는 브라우저 안에 머물고 업로드되지 않는다 · raw 동기화 토큰을 텍스트로 렌더/복사/로깅
  하지 않는다 · 시험 증빙 이미지는 비공개 Blob 에 두고 공개 URL 을 만들지 않는다 ·
  p.eagate 비밀번호와 세션 쿠키는 NosLog 로 보내지 않는다

---

## 8. Figma API 함정 (실제로 당한 것만)

- `use_figma` 호출 전 **매번** `figma-use` 스킬을 로드한다
- `figma.currentPage = page` 는 던진다 → `await figma.setCurrentPageAsync(page)`.
  한 스크립트에서 **한 번만** 페이지를 바꾼다
- **auto-layout 부모에서 `appendChild` 는 z 뿐 아니라 flow 위치를 바꾼다.** P1 헤더가 flow 끝으로
  밀려 사라진 적 있다. 오버레이 z 는 `layoutPositioning='ABSOLUTE'` 로 푼다
- 인스턴스 하위 레이어에 `visible=false` 를 주면 **`children` 에서 사라져** auto-layout 이 접힌다.
  열을 비우려면 숨기지 말고 텍스트를 `''` 로, `strokes=[]` 로 비운다
- 텍스트는 **폰트 로드 → await → 변경** 순서. Text Style 적용 전에 그 스타일의 `fontName` 을 로드
- `setBoundVariableForPaint` 는 **새 paint 를 반환** — 반드시 받아서 재대입.
  raw 색을 `{0,0,0}` 으로 두면 바인딩 해석 실패 시 전부 검정으로 렌더된다
- `resize()` 는 sizing mode 를 FIXED 로 되돌린다 → resize 먼저, sizing 나중
- `swapComponentAsync` · `createImageAsync` 없음 · SECTION 에는 `annotations` 없음 ·
  순회 중 삭제하면 크래시 · Figma 댓글 API 는 Plugin API 에 없다(`annotations` 로 대체)
- `vectorPaths` 는 경로를 노드 bbox 기준으로 재배치한다 — x/y 를 0 으로 두면 격자가 어긋난다

---

## 9. 검수 방법

`~/.claude/projects/-Users-carol-Desktop-project-noslog/design-state/audit.js` 의 `__PAGE_ID__`
만 대상 페이지 id 로 바꿔 `use_figma` 의 `code` 로 그대로 실행한다. 읽기 전용이다.
A 레이아웃 / B 타이포 / C 색 세 블록을 **항목별 결과와 함께** 보고하고,
안 돌린 검사는 통과가 아니라 **미실행**으로 적는다. "감사 통과" 같은 뭉뚱그린 문장은 금지.

---

## 10. Music Detail correction pass — 2026-08-15

The user approved and the Figma file now reflects the following corrections:

- C8 Korean navigation uses `검정`, not `시험`, across Compact, Wide, Focus, Dark,
  and locale-stress sources.
- P1 Chart Info owns the existing five-axis pattern-tendency radar; it appears
  immediately after the section heading and before BPM/factual rows, and Tier &
  Evaluation no longer duplicates it.
- P1 My Record keeps the progress graph and date-to-Best-score table while removing
  the redundant chart header/date range and Current/Start/Change summary.
- P1 Best performance keeps the Best score value but removes the repeated grade,
  achievement, participant-total, and placement comparison line.
- P1 Recent plays use the self-hosted official S and A+ images in a fixed `18px` slot
  before a fixed-width score column.
- P1 Ranking starts with the visible title `점수 분포`, followed by My rank and the
  leaderboard. The S-or-higher denominator remains an accessibility and structured-
  data requirement.
- P1 Ranking uses the same self-hosted official P/S/A+/A grade images as Recent plays
  and keeps the rightmost column FC-only. A Pianist result is represented by its `P`
  grade image and must not be repeated as `P` in the Full Combo column.
- `PatternRatingChoice` is number-only; all radio rings and dots were removed from its
  selected, unselected, hover, focus, and disabled variants.
- Z1 moved the approved TextArea/DeleteConfirmDialog plate from Pending to Approved;
  the Pending section is empty.

These changes supersede the older ownership and ordering sentences in document 05.
They do not reopen or affect the locked chart viewer/editor.
