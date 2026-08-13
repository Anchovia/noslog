# 65 · 디자인 세션 인수인계 (2026-08-13)

> **Stale reference — not current authority.** This historical handoff mixes states
> from several 2026-08-13 checkpoints. Use the current authority order in
> `AGENTS.md`, document `24`, and the verified Figma file instead of treating pending
> or document-update notes below as current facts.

> **다음 작업자(Codex 또는 다른 세션)가 이 문서만 읽고 이어받을 수 있도록 쓴 인수인계 기록이다.**
> 산출물은 Figma 파일 `NosLog v2.0.0`(key `cVbWCxhkfxFfHmAKLCyKrD`)에 있고, 이 문서는
> 그 안의 무엇이 승인됐고 무엇이 미결인지, 무엇을 건드리면 안 되는지를 정리한다.

---

## 0. 먼저 읽을 것 · 권위 순서

작업 전 반드시 이 순서로 읽는다. 아래 순서가 충돌 시 판단 기준이다.

① 사용자의 최신 결정 → ② `AGENTS.md` → ③ `README.md` · 문서 57 → ④ **문서 07(뷰어/에디터 절대 보존)**
→ ⑤ 문서 24(Foundation 정확값) → ⑥ 문서 25 → ⑦ 해당 Page Brief → ⑧ 문서 22 · 63

- `CLAUDE.md` — 절대 규칙 9개 + 검증 체크리스트 + Foundation 핵심값 + 사용자 결정 기록표.
  **작업 시작 전 매번 읽는 파일이다.**
- 시각 언어 기준: `output/pdf/noslog-2.0-visual-core-review.pdf` (승인된 편집 언어).
  단 **PDF의 GitHub Primer 편집 색은 제품 색이 아니다.**
- 실제 콘텐츠: `prisma/data/nosdata-musics.json` (578곡). **콘텐츠를 지어내지 않는다.**

### 반복해서 어겼던 규칙 (같은 실수 금지)

1. 사용자가 "시작"이라고 말하기 전에 만들지 않는다.
2. 만들기 전에 해당 Page Brief를 **끝까지** 읽는다. 상위 문서만 읽고 시작하지 않는다.
3. 문서에 없는 값(패딩·정렬·색·구조·컬럼·라벨)을 감으로 정하지 않는다.
4. 근거 없는 시각 결정이 나오면 **만들지 말고 Z1에 비교 시안을 그려서 묻는다.**
5. 만든 직후 A/B/C 전수 감사를 예외 없이 돌린다. "스크립트가 에러 없이 돌았다" ≠ "결과가 맞다".
6. **안 돌린 검사를 "검증했다"고 말하지 않는다.** 미실행은 미실행으로 보고한다.
7. Light·Dark 양쪽을 만든다. 한쪽만 만들고 끝내지 않는다.
8. 레이아웃·색·타이포는 문서 24의 값 집합 **안에서만** 고른다. 근사값·중간값을 만들지 않는다.
9. 결정이 끝난 Z1 시안은 즉시 `✅ 승인 완료` 섹션으로 옮기고, 미채택 칸은 `폐기 · …`로
   이름을 바꾸고 "구현 근거로 쓰지 말 것 · 채택안은 X" 주석을 단다.
   **표시 없는 폐기안을 남기면 다음 세션이 승인된 패턴으로 착각한다.**

---

## 1. 작업 환경

### Figma 파일 구조

| 페이지                        | node id  | 상태                                                |
| ----------------------------- | -------- | --------------------------------------------------- |
| 00 · README                   | `67:3`   | —                                                   |
| 01 · Foundation / Tokens      | `70:238` | ✅                                                  |
| 02 · Foundation / Type & Grid | `70:239` | ✅                                                  |
| 03 · Foundation / Guardrails  | `70:240` | ✅                                                  |
| C1 · Icons                    | `86:3`   | ✅ 감사 CLEAN                                       |
| C2 · Actions                  | `86:4`   | ✅ (Dark 플레이트 `414:2`)                          |
| C3 · Markers                  | `86:5`   | ✅                                                  |
| C4 · Forms & Feedback         | `86:6`   | ✅                                                  |
| C5 · Search & Refinement      | `86:7`   | ✅                                                  |
| C6 · Entity & Result          | `86:8`   | ✅                                                  |
| C7 · Dense Data               | `86:9`   | ✅ 차트·표·랭킹·서열 (사용자 검토 대기)             |
| C8 · Overlays & Shell         | `86:10`  | 부분 — Wide 팝오버·푸터·focus 미착수                |
| P1 · Music Detail 조립        | `242:2`  | 부분 — Compact 390 셸 3개, **Dark 없음**            |
| Z1 · 결정 기록 (Decisions)    | `268:2`  | ✅ 승인 섹션 `268:3` / 보류 섹션 `268:11`(현재 0건) |

- 변수 컬렉션: Color `VariableCollectionId:70:3` (모드 Light `70:1` / Dark `70:2`) · Scale · Typography · Primitives
- Text Style **39개** = 13 composite × ko/ja/latin
- **폰트**: 규범값은 `Pretendard JP Variable`이나 이 렌더러가 로드 불가 →
  현재 `IBM Plex Sans KR/JP/Latin` + 수치는 tabular. 교체는 `font/family/ko·ja·latin`
  변수 3개만 바꾸면 전파된다(소급 적용 완료). **교체 후 레이아웃 재검수 필요.**

### 상태 파일 (레포 밖 · 절대 경로)

```
~/.claude/projects/-Users-carol-Desktop-project-noslog/design-state/
```

| 파일                       | 내용                                                                    |
| -------------------------- | ----------------------------------------------------------------------- |
| `state.json`               | 노드 id · 결정 · 픽스처 · 함정 · 진행도. 42개 키                        |
| `R2-conflicts.md`          | 충돌/미해결 레지스터. **맨 위 상태 요약표부터 읽을 것.** CONFLICT-01~31 |
| `brief-contracts-notes.md` | 브리프 구속 조항 전체 (file:line + 원문 인용) §0~23                     |
| `audit.js`                 | A/B/C 전수 감사 스크립트. `PAGE_ID`만 바꿔 `use_figma`의 code로 실행    |
| `RESUME.md`                | 세션 재개용 요약                                                        |

> ⚠️ **세션 스크래치패드에 쓰지 말 것** — 2026-08-12에 작업 중 통째로 삭제된 사고가 있었다.

---

## 2. 보존 경계 (절대 · 위반 금지)

- **채보 viewer/editor 전체 잠금**(문서 07) — 재설계·recolor·Foundation 적용 금지. **진입 링크만.**
- **관리자 `/admin/*`** 광범위 재설계 없음
- **user chart-contribution 흐름** 신규 생성 금지
- 로컬 MP3는 브라우저에 머무르며 **업로드하지 않는다**
- raw sync token을 단독 텍스트로 **렌더·복사·로깅하지 않는다**
- 시험 증빙 이미지는 비공개 Blob, **공개 URL 없음**
- p.eagate 비밀번호·세션 쿠키는 NosLog로 **전송하지 않는다**
- 레거시 NOSTORY Figma를 현재 권위로 사용 금지
- 문서 63 regression harness를 최종 구성으로 복사 금지
- 문서 18 개인정보 release blocker를 **해결된 UI로 위장 금지**

---

## 3. 지금까지 완료된 것

### Foundation

문서 24 기준 소급 적용 완료 — **위반 973건 → 0**. 색 바인딩 100%, Text Style 100%.

핵심 값(문서 24 · `CLAUDE.md` §3에 요약):

- 타이포 **13 composite** (`display` 40/48·700 … `metadata` 12/16·400 ·
  `metric-display` 32/40·700 tabular · `metric-value` 14/20·500 tabular ·
  `emphasis-label` 14/20·600 ⭑2026-08-11 신규 승인 → **문서 24 개정 필요**)
- spacing `0·4·8·12·16·24·32·48·64` — `2`는 아이콘/배지/시각화 **내부 광학보정 전용**
- radius control `4` / container `8` / overlay `10` / full `50%`
- 중립 = Adobe Spectrum S2 정확값 (**Tailwind 금지**)
- 아이콘 = Lucide 실제 geometry (`node_modules/lucide-react` 1.24.0 추출). 렌더 20/16/24.
  아이콘 전용 컨트롤 타겟 **모바일 44×44 · 데스크톱 40×40**
- **NI-A**: 보편적 hover/selected 배경은 **없다**. interaction fill은
  hover / selected / menu-set / disabled **에만**
- grid: Compact <672(4col g12 m16) / Intermediate 672–1055(8col g16 m24) / Wide 1056+(12col g16 m32)

### 컴포넌트 (C1–C8)

- **C1 Icons** — Lucide 36개 추출 완료
- **C2 Actions** — Button(Primary/Neutral/Ghost/Destructive × 상태) + Dark 플레이트 `414:2`
- **C3 Markers** — 난이도 마커 · JudgementMarker(28×10 알약 `radius/full`)
- **C4 Forms & Feedback** — FormField · StatusMessage
- **C5 Search & Refinement** — SearchField · FilterSortControl · ViewModeSwitch
- **C6 Entity & Result** — ResultCollection 3종 · MusicEntityHeader ·
  LocalizedTitleDisclosure · DifficultySelector 7 · MetricSummary 4. Dark 전부 재생성
- **C7 Dense Data** — OrdinaryDataChart 5상태 · DataTable+Pagination ·
  랭킹 영역(MyRankSummary · ScoreDistribution · 패널 조립 · focus) ·
  **서열·평가 영역**(§4 참조). Dark 플레이트 포함
- **C8 Overlays & Shell** — AppHeader `247:58` · DestinationPanel `256:205` ·
  AreaSwitcher Compact `240:44` / Wide `241:78` · Dark `266:196`.
  **미착수: Wide 팝오버 · 푸터 · 셸 3종의 Focus variant 전무**

### P1 · Music Detail 조립

Compact 390 셸 3개(Information · 내 기록 · 패널 열림). **랭킹·서열 패널 미착수 · Dark 셸 없음.**

---

## 4. 최근 작업 (2026-08-13 이 세션)

시간순. 각 항목은 Z1에 결정 기록이 있고 `R2-conflicts.md`에 근거가 있다.

### 4.1 Focus 표시 전면 교체 — `FOCUS-1B`

현재 계약:

- 포커스는 **컨트롤 자신의 1px INSIDE 경계 색**으로만 표시
- 평상시 경계가 있으면 **그 색만** focus 색으로 교체 (invalid가 빨강으로 바뀌는 것과 같은 방식)
- 평상시 경계가 없으면 **포커스에서만** 1px 경계를 부여. 평상시 외형은 그대로
- INSIDE라서 크기·위치·주변 레이아웃 불변. **두께를 바꾸지 않는다**
- 면이 진해 3:1을 못 맞추면 그 면의 on-fill 색(`primary/on-primary`) 사용
- 자켓처럼 bleed 자식이 경계를 덮는 카드는 최상단 절대배치 `focus-border` 오버레이
- focus 색 = `focus/ring` Light `#000000` / Dark `#FFFFFF`
- 실측 대비: canvas 21 / 18.88 · surface 19.77 / 17.22 · on-fill 14.55 / 13.64 · 평상시 경계 4.3 / 3.45
- ⚠️ 1px 색상 단서는 **WCAG 2.2 SC 2.4.13(2px 최소)를 못 맞춘다 — 사용자가 알고 승인함**
- **hover는 면(fill), focus는 경계(stroke)** — 축이 달라 동시 표시되며 서로 대체하지 않는다
- 포커스에 면 변화를 함께 주는 보조안은 **제안했으나 미채택**

문서 22·24·25·63 개정 완료. `audit.js` `A13`이 레거시 ring 잔존과 focus 경계 누락을 잡는다.

### 4.2 Pressed = `scale(0.98)`

- `motion/press-scale` = 0.98 신규 상수 · `100ms` (MO-02 Pressed feedback 슬롯)
- transform이라 **박스 크기·레이아웃 불변**. 축소값을 레이아웃 크기로 만들지 않는다
- 작은 컨트롤(버튼·아이콘 버튼·페이지 번호)만. **리스트 행·그리드 카드에는 쓰지 않는다**
- `prefers-reduced-motion`에서 제거되고 Neutral·Ghost는 색 단계가 남는다
- ⚠️ Primary·Destructive의 pressed **색** 차이는 1.13~1.26:1로 비가시 —
  승인 램프에 여유가 없어서이며 `primary/pressed`·`feedback/destructive-border-pressed`는
  reduced-motion 잔여 단서로만 존재한다
- **미완**: 이 계약을 아이콘 버튼·페이지 번호 등 나머지 작은 컨트롤로 전파하는 작업이 남았다

### 4.3 가장자리 아이콘 컨트롤 광학 패딩

선언 패딩이 16/16으로 대칭인데 **보이는 결과가 11.4px 비대칭**이던 AppHeader 사고에서 나온 규칙.

- 양쪽 끝이 고정된 컨테이너의 첫/마지막 자식이 아이콘 전용 컨트롤이면,
  그 컨트롤의 내부 여백 `(타겟−아이콘)/2`를 컨테이너 패딩에서 뺀다
- AppHeader = 왼쪽 16 / **오른쪽 8** (44 타겟 안 24 아이콘 = 내부 10). **선언 비대칭이 정상이다**
- 타겟이 컨테이너 경계에 닿을 만큼 줄이지 않는다 (SearchField는 그래서 8 유지)
- 검사 = `audit.js` `A17_edgeIconOptical` — 잉크·아이콘 박스 기준. 전수조사에서 실제 11건/오탐 23건 분리
- 문서 24에 `### Edge icon-only control optical padding` 추가

### 4.4 Z1 폐기안 표시 체계

- 미채택 칸 이름을 `폐기 · …` / `미채택 · …`로 바꾸고 주석에
  "채택되지 않았다 · 구현 근거로 쓰지 말 것 · 채택안은 X"를 적는다. 채택 칸은 `채택 · …`
- `audit.js`가 `폐기·미채택` 조상 아래 위반을 `rejectedSpecimenCounts` 버킷으로 분리
  (Z1에서 57건이 본 카운트에서 빠졌다)
- `Z1_decidedLeftInPending` 검사 신설 — 결정 끝난 시안이 보류에 남으면 잡는다

### 4.5 서열·평가 영역 (문서 05 · 917–1010, 1041–1229)

**① 서열 배치**

- `TierPlacementCell` `471:782` — State=Value / NotListed / NotPublished / Loading
- `TierPlacementGrid` `472:863` — Basic/Recital × S/풀콤보/Pianist 6칸 + 서열 변경 이력 disclosure
- 실패 문구 `불러오지 못했습니다`는 **섹션 레벨에서 한 번만** 쓴다(사용자 결정).
  하위 컴포넌트마다 반복하지 않는다 → 그래서 이 영역 컴포넌트에 Error/Loading을 남발하지 않았다
- 서열 상수 범위 = **`1.0`–`14.5`, 0.1 단위**. 중립 표기는 **`—`(대시)**
- 대표값은 **평균(arithmetic mean)** — 중앙값 아님. 문서 05의 median 규정을 mean으로 개정 완료(9곳)

**② 커뮤니티 투표**

- `CommunityTierVoteRow` `481:975` — Default / Hover / Selected / Focus / Aggregating (5상태, 44px 행)
- `CommunityTierVoteDistribution` `493:981` — **Paging=Available / Paging=Unavailable** (358×144)
- 조립 C안 `482:855` — 6범위를 압축 행으로 나열하고 **선택한 범위만** 분포를 펼친다
- 분포 계약(사용자 결정 · `MDET-82`):
  ① 투표가 존재하는 값만 칸을 만든다 — **0표 값은 렌더하지 않는다**(축이 연속이 아니어서 13.1 다음이 13.3일 수 있다)
  ② 높이는 **범위 전체**의 최대 표수 기준 — 창을 옮겨도 기준 불변
  ③ 기본 창은 **평균에 가장 가까운 관측값을 가운데** 두고 좌우로 펼친다
  ④ 이동은 관측값 한 칸 단위. 관측값이 5종 이하면 컨트롤 비활성
  ⑤ **0.5 밴드로 묶지 않는다** — `13.0`(20표)과 `13.1`(21표)은 서로 다른 서열 주장이다
- 막대 색(B안): 최고 표수 = `local-data/bucket-6` **단독**, 나머지는 `bucket-3 → bucket-2`를
  **위에서부터**(2등은 항상 bucket-3). 실측 최고값 vs 2등 Light **2.23** / Dark **2.54**
- ⚠️ 램프 총 폭이 Light **3.31:1**뿐이라 4단 순위를 색으로 표현하는 것은 **불가능**하다.
  색은 최고값 강조만 담당하고 순위는 막대 높이 + 위에 적힌 표수가 전달한다.
  더 큰 격차가 필요하면 **새 차트 토큰 = 문서 24 개정** 사안
- 폐기: 0.5 밴드 분포 · 0.5 정렬 고정 창(0표 칸 유지) · dot plot · 선그래프 ·
  표수 **비율** 반올림 색 매핑(20표와 21표가 뭉쳤다) · 평균 표시용 2px 밑줄(열 높이를 밀었다)

**③ 커뮤니티 패턴 레이더** — `CommunityPatternRadar` `503:1240` (State=Data / Aggregating, 358×416)

- 5축 고정 순서 `계단`·`연타`·`폴리리듬`·`즈레`·`동시치기`. **Glissando는 커뮤니티 축이 아니다**
- 고정 `0–4` 스케일 = **1단위가 격자 한 겹 24px**, 최대 반경 96.
  정오각형 실측 182.6×173.67 · 정점 오차 0.0px · 라벨 여백 8 · 라벨 5개 전부 플롯 안
- **커뮤니티 평균 한 계열만** — 사용자 프로필을 같은 레이더에 겹치지 않는다
- 축별 정확 평균 + 유효 개수를 구조화 텍스트로 병기 (2차 시각화 아님)
- **축 하나라도 유효 3개 미만이면 폴리곤을 그리지 않는다**(State=Aggregating).
  3개 이상인 축은 평균 유지, 미달 축은 `집계 중`
- 도움말은 축마다가 아니라 **공유 1개**(`패턴 성향 기준`)
- 대비 결정(CONFLICT-31): 패널 면을 `surface/surface`로 → 계열 대 면 **Light 3.12 / Dark 3.74**
  (`surface/sunken` 위에서는 2.73으로 **3:1 미달**이었다) · 격자·축선은 `border/default`
- **계열 반투명 면 채움 미제작** — 승인된 불투명도 값이 없어 만들지 않았다. 필요하면 문서 24 개정
- 문서 05에 `Resolved specimen values` + `MDET-83` 추가

**Dark 플레이트** `496:915` — 위 4개 컴포넌트 전 variant(총 16 인스턴스)를 Dark 실효 모드로 재확인 완료

### 4.6 문서 소유권 문구 정정

`AGENTS.md` · `README.md` · 문서 64 · 57 · 22에서 **현재 디자인 단계는 Claude**로 정정.
단 "Completed Codex guide stage"와 "Later separate Codex implementation session"은 **그대로 유지**.

---

## 5. 다음 작업 — ④ 현재 사용자의 투표·평가 폼 (미착수)

브리프 근거: 문서 05 `#### Contribution Eligibility`(1071–1082) ·
`### General Chart Evaluation Input and Eligibility`(1231–1250) · `MDET-77` · `MDET-78`

### ④-1 6범위 투표 입력

- 6범위 = **Basic S · Basic 풀콤보 · Basic Pianist · Recital S · Recital 풀콤보 · Recital Pianist**
- 값은 `1.0`–`14.5`, **0.1 단위**
- **한 사용자·선택 채보·모드·목표당 투표 1개.** 각 범위를 독립적으로 수정·삭제 가능
- 자격(서버에서 강제. 비활성 컨트롤은 인증이 아니다):
    - 로그인 + 해당 **정확한 채보**의 검증된 기록 필요
    - Basic — S: `950,000` 이상 / 풀콤보: `fc_type >= 2` 또는 `1,000,000` / Pianist: `fc_type === 3` 또는 `1,000,000`
    - Recital — 같은 목표 조건 + `grade_recital > 0`.
      현재 데이터는 Recital 참가와 목표 달성을 **따로** 증명하므로 같은 플레이임을 증명하지 못한다.
      이것이 최소 검증 규칙이고 나중에만 강화한다
- **로그아웃·자격 없는 사용자도 발행된 집계는 모두 읽을 수 있다.** 자격은 기여만 통제한다
- 필요한 상태(최소): 자격 있음(입력 가능) · 이미 투표함(수정/삭제) · 로그인 안 됨 ·
  기록 없음 · Recital 미참가. **자격 없는 이유를 접근 가능하게 알려야 한다**
  (문서 05의 disabled-control 참고 자료 참조 — 이유 없는 비활성 금지)

### ④-2 5축 패턴 평가 입력

- **각 축 개별 선택 사항**이며 `미평가`는 **결측**으로 저장한다.
  유효값 `0`(= None/없음)과 **절대 섞지 않는다**
- 폼은 **명시적 `Not rated` 상태를 제공**해야 하고, 생략된 축을 `0`으로 **prefill 금지**
- 서술 의견도 선택 사항. 일반 평가에 필수 체감 난이도 필드는 **없다**
- 한 사용자·채보당 일반 평가 1개. 수정·삭제 가능
- ⚠️ 현재 Prisma 스키마/폼은 레거시 패턴 필드와 댓글을 **전부 필수**로 요구한다.
  2.0은 6개 범위 투표와 1개 목표중립 평가를 **명시적으로 분리**해야 한다

### ④-3 삭제·중재 범위 (`MDET-78`)

- 의견만 삭제 / 일반 평가 전체 삭제 / 범위별 투표 삭제 — **세 결과가 서로 독립**
- 중재는 무관한 기여를 조용히 지우지 않는다
- 평가 전체 삭제는 의견만 삭제보다 **결과 문구가 더 강해야 한다**

### ⑤ 커뮤니티 의견 (④ 다음)

- Helpful · 정렬 2종 · Load more · 삭제 범위 2종
- **개별 평가자의 5축 값을 의견 행마다 반복하지 않는다** — 집계는 레이더가 소유한다
- 각 의견의 overflow 액션은 상시 버튼을 늘리지 않고 메뉴로 (WAI-ARIA Menu Button)

---

## 6. 남은 전체 작업

### 6.1 페이지 브리프 (13개 미착수)

| 문서 | 페이지                      |
| ---- | --------------------------- |
| 03   | Home                        |
| 04   | Shared Discovery            |
| 06   | Tier List                   |
| 08   | Global Rankings             |
| 09   | Profile                     |
| 10   | Bingo                       |
| 11   | Exam                        |
| 12   | Arcade Discovery            |
| 13   | Data Sync                   |
| 14   | Announcements               |
| 16   | Settings & Account          |
| 17   | Authentication & Onboarding |
| 19   | System Recovery States      |

문서 **07**(채보 뷰어/에디터)과 **18**(개인정보)은 제작 대상이 아니다 —
07은 절대 보존, 18은 release blocker를 UI로 위장하면 안 된다.

문서 05(Music Detail)는 §5의 ④⑤가 남았다.

### 6.2 밀린 공용 항목 (페이지보다 먼저 닫는 것이 유리)

이 항목들은 **모든 페이지에 들어가는 부품**이라 나중에 고치면 페이지 13곳을 다시 손대야 한다.

1. **P1 Dark 셸** — P1은 현재 Light 전용 (규칙 7 위반 상태)
2. **C8 셸 3종의 Focus variant 전무** — AppHeader · DestinationPanel · AreaSwitcher
3. **C8 Wide 팝오버 · 푸터** 미착수
4. **pressed `scale(0.98)` 전파** — 아이콘 버튼 · 페이지 번호 등 나머지 작은 컨트롤
5. **P1 랭킹 패널 · 서열 패널 조립**
6. **데스크톱 컬럼 분해** (리더보드 `05:757`) · 320/360/430 검증 폭

---

## 7. 미결정 · 미승인 · 의도적으로 패스한 것

### 7.1 미결 CONFLICT

| ID               | 내용                                                                                                    | 상태 |
| ---------------- | ------------------------------------------------------------------------------------------------------- | ---- |
| CONFLICT-11      | `CLAUDE.md` §1의 시각코어 PDF 표현                                                                      | 미결 |
| CONFLICT-12      | C5 `A2_padSym` 19건 근거 미기록                                                                         | 미결 |
| CONFLICT-15 후속 | `채보 보기`의 **일본어** 라벨 미확정 (한국어는 승인)                                                    | 미결 |
| CONFLICT-16      | 번역 팝오버 로케일 라벨 문구 미승인                                                                     | 미결 |
| 참고-25          | unavailable 문구 미확정 (현재 em dash)                                                                  | 미결 |
| 참고-26          | 사용자 기록 픽스처 부재 — C7에서도 문제됨                                                               | 미결 |
| 미배치           | `MusicEntityHeader`를 페이지에서 `DifficultySelector` 앞/뒤 어디에 둘지 (`05:208`은 ①이후 ③이전만 규정) | 미결 |

### 7.2 사용자가 "보류"로 남긴 것

- **선택 세그먼트 표시** — 사용자는 A(`border/strong`)를 골랐으나 문서 24 NI-A가
  "selection … automatically promote to `border-strong`"를 **명시 금지**한다.
  문서는 checkmark·current indicator·explicit label을 요구 → B(2px underline)가 문구에 부합.
  **재확인 필요.** (문서 24에 NI-A 세그먼트 예외를 추가해 둔 상태)

### 7.3 미승인 문구 (ko 임시 · ja/en 전부 미확정)

- 랭킹 컬럼 라벨 `순위` · `플레이어` · `기록`
- `평균` · `투표 N명` · `Basic 풀콤보 분포`
- `패턴 성향` · `패턴 성향 기준` · `평가 N명`
- 참가자 0명 `ScoreDistribution` 문구
- **모든 페이지의 ja/en 로케일 문구 전부**

승인된 ko 문구는 `state.json`의 `approvedCopy_ko_2026_08_12` 참조 (문서 05 개정 필요).

### 7.4 만들지 않기로 한 것 (근거 있음)

- **레이더 계열 반투명 면 채움** — 승인된 불투명도 값 없음 → 문서 24 개정 사안
- **분포 색의 4단 순위 표현** — 램프 총 폭 3.31:1로 물리적 불가 → 새 토큰 = 문서 24 개정
- **서열 영역 하위 컴포넌트의 Error/Loading 남발** — 실패 문구는 섹션 레벨 1회 원칙
- **Primary·Destructive의 pressed 색 구분** — 승인 램프에 여유 없음. scale로 해결

### 7.5 문서 24 개정이 필요한 승인 항목 (아직 문서에 없거나 확장 필요)

1. `emphasis-label` 14/20·600 — 13번째 composite (2026-08-11 승인)
2. `border/empty-slot` 별칭 토큰 (2026-08-13 승인, CONFLICT-17)
3. 긴 제목 맞추기 A안 — `page-title` → `section-title` → `component-title` 역할 확장
4. `motion/press-scale` (문서 24에 `### Pressed feedback scale`로 추가는 했으나 MO-02 표와 정합 확인 필요)

### 7.6 사용자 지시로 그대로 둔 것

- Z1 승인 측 헤더 사본 내부의 `A16`/`A1` findings — "그대로 두고" 지시
- 랭킹 `column-header / h-player` 좌우 패딩 32/0 — 데스크톱 컬럼 분해가 미결이라 손대지 않음
- Z1 채택 C안 칸 안의 옛 0.5 밴드 그림 — **"밴드 그림은 폐기됐다 · 구현 근거로 쓰지 말 것"
  주석을 달아** 남겨둠(비교 기록으로서의 가치)

---

## 8. 검증 절차 (만들 때마다 전부)

`audit.js`를 `use_figma`의 code로 붙여 실행하고(`PAGE_ID`만 교체), 결과를 **항목별로** 보고한다.
"감사 통과"·"이상 없음" 같은 뭉뚱그린 문장으로 대체하지 않는다.

```
A 레이아웃  spacing 0위반 · 패딩역할 OK · 크기일관 OK · 아이콘 20/16 OK · 타겟 40×40 OK
            정렬 centerY 최대오차 0.0px · 겹침 0 · 넘침 0 · radius OK · stroke OK
B 타이포    Text Style 100% · composite 13종 내 · weight OK · tabular 위치 OK
C 색        바인딩 100%(하드코딩 0) · NI-A 위반 0 · Light/Dark 양쪽 확인
```

주요 검사 키: `A1_spacing` · `A2_padSym` · `A5_centerY` · `A9_overlapAbs` ·
`A9_childOutsideSection` · `A13_legacyRing`/`A13_focusBorderMissing` · `A14_jacketAspect` ·
`A15_vPadSqueezed` · `A16_padSqueezed` · `A17_edgeIconOptical` · `B1_noTextStyle` ·
`B2_composite` · `C1_hardcoded` · `C4_rawMismatch` · `C3_interaction_NIA_CHECK` ·
`Z1_decidedLeftInPending`

### 시각·의미 검증 (기계 감사로 안 잡힘)

- **1x 배율** 스크린샷 (축소본만 보고 판단 금지) · 실제 사용 크기로 확대 · Light+Dark 실제 배경 위
- 320px reflow · **최장 실제 KO/JA/EN 콘텐츠**로 잘림 확인
- 도메인 용어: **◆JUST**(S-Just 아님) · **기타 지역**(Global 아님) · Not listed/Not published 구분
- 색만으로 상태 전달 금지 — 형태·라벨·순서 병행
- WCAG 대비 계산 (텍스트 4.5:1, 비텍스트 3:1)

> ⚠️ **`audit.js`의 한계**: 브리프 조항 위반은 잡지 못한다. 표면 층위·레벨 상수·헤더 중복·
> RecordPreview 모두 기계 감사를 통과한 뒤 사용자가 발견했다.
> **컴포넌트 description의 인용문과 구현을 한 줄씩 대조하는 절차가 필요하다.**

---

## 9. Figma Plugin API 함정 (전부 실제로 겪은 것)

1. `layoutMode`를 `resize` **뒤에** 설정하면 sizing이 HUG로 되돌아간다 →
   순서: `layoutMode` → `resize()` → `layoutSizing*`. 이 규칙을 4번 어겼다
2. top-level 배치는 좌표 하드코딩 금지. 기존 노드 extent 계산 후 배치하고 **직후 A9 겹침 검사**
3. `maxWidth`는 인스턴스에서 오버라이드 불가 — 메인 컴포넌트에서 상속시킬 것
4. `cornerRadius`도 토큰 바인딩이 기본. raw `9999`로 찍으면 A3 위반(17노드 실제 발생)
5. **변수 바인딩 paint는 raw 색을 실효 모드의 실제 값으로 채운 뒤** `setBoundVariableForPaint`.
   `{r:0,g:0,b:0}`으로 두면 바인딩 해석 실패 시 **전부 검정으로 렌더**된다(Dark 플레이트 사고 원인)
6. 넘침은 부모 폭이 아니라 **배정폭**(형제 고정폭·간격 차감 후) 기준
7. clone 직후 `findAll()`은 INSTANCE 자식 내부를 못 본다 —
   `copy.children.find(c => c.type === 'INSTANCE')`로 먼저 잡고 그 위에서 검색
8. `figma.createAutoLayout()` 프레임은 **미바인딩 흰 fill을 갖고 태어난다** → 구조 래퍼는 `fills = []`
9. `combineAsVariants`는 COMPONENT만 받는다 — `createComponentFromNode`로 먼저 변환(id 변경)
10. Lucide `Icon/*` 인스턴스 내부 Frame에 **숨겨진 흰 fill**이 있다. 덮으면 꽉 찬 사각형이
    렌더된다 — **VECTOR stroke만** 칠하고 그 Frame은 `fills = []`
11. `createAutoLayout` 프레임은 `clipsContent = true` — 음수 좌표 절대배치 자식이 사라진다
12. **`vectorPaths`를 넣으면 경로가 노드 bbox 기준으로 재정렬된다.**
    좌표계를 유지하려면 할당 후 노드 `x`/`y`를 **내가 의도한 bbox 최소점**으로 되돌린다.
    (레이더 격자·계열이 어긋난 원인. `x=0,y=0`으로 밀면 틀린다)
13. 노드 삭제 중 `findAll` 순회는 크래시 — id를 먼저 모으고 나중에 삭제
14. INSTANCE에 `insertChild`는 불가 — 소유권을 조립 프레임으로 올린다
15. Dark 노드는 `explicitVariableModes`로 모드가 걸려 있다. 검사·수정 시 **노드의 실효 모드**
    (자신 또는 조상의 explicit mode) 기준으로 값을 해석한다. Light 기준으로 비교하면
    Dark 노드가 전부 "불일치"로 오판되고, 그걸 고친다며 덮어쓰면 파일이 깨진다
16. **대량 변경(수십 개 이상) 전에는 반드시 소수로 시험하고 눈으로 확인한 뒤 확대 적용**

---

## 10. 다음 세션 시작 절차

1. `CLAUDE.md`를 읽는다 (절대 규칙 + §6 결정 기록표)
2. `~/.claude/projects/-Users-carol-Desktop-project-noslog/design-state/R2-conflicts.md`의
   **맨 위 상태 요약표**와 `state.json`의 `progress`를 읽는다
3. 착수할 대상의 **Page Brief를 끝까지** 읽는다 (상위 문서만 읽고 시작하지 않는다)
4. 사용자가 **"시작"**이라고 말할 때까지 만들지 않는다
5. 만들면 즉시 `audit.js`를 돌리고 §8 형식으로 항목별 보고한다
6. 결정이 필요하면 말로 묻지 말고 **Z1 보류 섹션에 비교 시안을 그려서** 묻는다
7. 결정이 끝나면 **같은 턴에** ✅ 승인 섹션으로 옮기고 미채택 칸을 `폐기 ·`로 표시한다

### 권장 순서

§6.2의 밀린 공용 항목(P1 Dark 셸 · C8 Focus variant · pressed 전파)을 **페이지 13개보다 먼저**
닫는 것을 권한다. 모든 페이지에 들어가는 부품이라 나중에 고치면 13곳을 다시 손대야 한다.

그다음 문서 05의 ④⑤로 Music Detail을 닫고, 이후 페이지 브리프로 넘어간다.
