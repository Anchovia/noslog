# 66 · 디자인 세션 인수인계 (2026-08-14)

> 이 문서가 **현재 권위**다. `docs/design/65-design-session-handoff-2026-08-13.md` 는
> 역사 기록이며 그 안의 "미착수 / 미결 / 노드 수"를 현재 사실로 쓰지 않는다.
> 이 문서와 실제 Figma 파일, 그리고 각 Page Brief 가 판단 근거다.

---

## 0. 이 단계가 무엇인지

디자인 가이드(문서 01~25, 57, 63, 64)는 완료됐다. 지금은 **기존 Figma 파일 위에서
최종 high-fidelity 화면을 완성하는 단계**다.

- 기존 Figma 가 베이스라인이다. 처음부터 다시 만들지 않는다.
- 아직 만들어지지 않은 부분만 이어서 만든다.
- 화면 하나 때문에 전역 타이포·색·간격 토큰을 바꾸지 않는다.
- 구현 코드는 아직 쓰지 않는다. (에셋 추가는 했다 — §4.6)
- 중요한 변경은 Before → After 로 보여주고 승인받은 뒤 적용한다.
- 승인 없이 여러 페이지로 패턴을 전파하지 않는다.

### 권위 순서

① 사용자의 최신 결정 → ② `AGENTS.md` → ③ `README.md` · 문서 57 → ④ 문서 64
→ ⑤ **문서 07(뷰어/에디터 절대 보존)** → ⑥ 문서 24 → ⑦ 문서 25 → ⑧ 해당 Page Brief
→ ⑨ 문서 22 · 63

`CLAUDE.md` 는 작업 규칙 파일이다. **작업 시작 전 매번 읽는다.**

---

## 1. 절대 보존 경계

- **채보 viewer/editor 전체 잠금**(문서 07) — 재설계·recolor·재배치·Foundation 적용 금지.
  새 variant/specimen 생성 금지. PixiJS/WebGL·palette·geometry·animation·chart math 불변.
  **진입 링크만** 다룬다.
- 관리자 `/admin/*` 광범위 재설계 없음. 신규 user chart-contribution/editor 흐름 없음.
- 로컬 MP3 는 브라우저에 머무르며 업로드하지 않는다.
- raw sync token 을 단독 텍스트로 렌더·복사·로깅하지 않는다.
- 시험 증빙 이미지는 비공개 Blob, 공개 URL 없음.
- p.eagate 비밀번호·세션 쿠키는 NosLog 로 전송하지 않는다.
- 레거시 NOSTORY Figma 는 현재 권위가 아니다.
- 문서 63 regression harness 를 최종 구성으로 복사하지 않는다.
- 문서 18 개인정보 release blocker 를 해결된 UI 로 위장하지 않는다.

---

## 2. 작업 환경

**Figma**: `NosLog v2.0.0` · key `cVbWCxhkfxFfHmAKLCyKrD`

| 페이지                 | id          | 상태                                                |
| ---------------------- | ----------- | --------------------------------------------------- |
| 01~03 Foundation       | `70:238` 외 | ✅                                                  |
| C1 Icons               | `86:3`      | ✅ Lucide 36                                        |
| C2 Actions             | `86:4`      | ✅                                                  |
| C3 Markers             | `86:5`      | ✅                                                  |
| C4 Forms & Feedback    | `86:6`      | ✅                                                  |
| C5 Search & Refinement | `86:7`      | ✅                                                  |
| C6 Entity & Result     | `86:8`      | ✅                                                  |
| C7 Dense Data          | `86:9`      | ✅ **감사 위반 0**                                  |
| C8 Overlays & Shell    | `86:10`     | ✅ 셸·Focus·모달/팝오버 조립 완료 (푸터 focus 제외) |
| P1 Music Detail 조립   | `242:2`     | 4영역 Light·Dark 완료. **서열·평가는 부분 조립**    |
| Z1 결정 기록           | `268:2`     | 승인 `268:3` / 보류 `268:11` — **보류 0건**         |

- Color 컬렉션 `VariableCollectionId:70:3` · 모드 Light `70:1` / Dark `70:2`
- **Text Style 45개** = 13 composite × ko/ja/latin(39) + `nav-fit/*`·`nav-fit-current/*`(6)
- 폰트: 규범은 `Pretendard JP Variable`, 현재 렌더는 `IBM Plex Sans KR/JP/Latin`.
  교체는 `font/family/ko·ja·latin` 3개만 바꾸면 전파된다. **교체 후 레이아웃 재검수 필요.**

**상태 파일**(레포 밖, 참고용): `~/.claude/projects/-Users-carol-Desktop-project-noslog/design-state/`
— `audit.js`(A/B/C 전수 감사) · `R2-conflicts.md` · `state.json` · `brief-contracts-notes.md`.
현재 사실은 이 문서와 Figma 로 확인한다.

---

## 3. 반드시 지킬 작업 규칙 (어긴 이력이 있음)

1. 사용자가 **"시작"** 이라고 말하기 전에 만들지 않는다.
2. 만들기 전에 해당 Page Brief 를 **끝까지** 읽는다.
3. 문서에 없는 값(패딩·정렬·색·구조·컬럼·라벨)을 감으로 정하지 않는다.
4. 근거 없는 시각 결정은 **Z1 에 비교 시안을 그려서** 묻는다. 말로만 묻지 않는다.
5. 만든 직후 A/B/C 전수 감사를 돌린다. 스크립트가 에러 없이 돈 것은 검증이 아니다.
6. **안 돌린 검사를 "검증했다"고 말하지 않는다.**
7. Light·Dark 양쪽을 만든다.
8. 값은 문서 24 집합 안에서만 고른다. 근사값·중간값을 만들지 않는다.
9. 결정이 끝난 Z1 시안은 즉시 승인 섹션으로 옮기고 미채택 칸은 `폐기 · …` 로 표시한다.
10. 설명 문장은 보이는 텍스트가 아니라 **dev 주석(annotations)** 에 넣는다.
11. 폐기·비교 보드는 제품 컴포넌트 페이지(C1~C8·P1)에 두지 않고 Z1 로 옮긴다.

### Figma API 함정 (이번 세션에 실제로 당한 것)

- **auto-layout 부모에서 `appendChild` 는 z-순서뿐 아니라 flow 위치를 바꾼다.**
  P1 셸에서 헤더가 flow 끝으로 밀려 화면에서 사라졌다. 오버레이 z 는
  `layoutPositioning='ABSOLUTE'` 로 풀고 flow 순서는 건드리지 않는다.
- **인스턴스 서브레이어를 `visible=false` 로 숨기면 이 API 의 `children` 에서 사라진다.**
  게다가 auto-layout 에서 열이 붕괴한다. "값 없음"은 숨기지 말고 **내용만 비운다**
  (텍스트 `''` + `strokes = []`).
- `vectorPaths` 를 넣으면 경로가 노드 bbox 기준으로 재정렬된다. 좌표계를 유지하려면
  할당 후 노드 `x/y` 를 의도한 bbox 최소점으로 되돌린다.
- 절대배치 오버레이(focus-border 등)는 부모 크기 변경을 따라가지 않는다.
  `constraints = STRETCH/STRETCH` 를 걸고, 부모 크기를 바꾸면 반드시 재확인한다.
- 클론할 원본이 `DARK VERIFICATION` 안에 있으면 Dark 색이 딸려온다. 원본의 실효 모드를 먼저 본다.
- 복제 후에는 바인딩 paint 의 raw 값을 **실효 모드 값으로 다시 기록**한다.
  특히 `surface/scrim` 은 알파가 paint opacity 에 저장된다(Light 0.4 / Dark 0.6).
- `createImageAsync` 는 이 API 버전에 없다. 플러그인은 로컬 파일도 못 읽는다.
  → Figma 안에 비트맵을 넣을 수 없다. 이미지 자리는 **슬롯 + 자리표시**로 둔다.
- 노드 삭제는 id 를 먼저 모으고 나중에 지운다. 순회 중 삭제하면 크래시한다.
- 폰트는 쓰기 전에 항상 `loadFontAsync`. `textAutoResize` 변경에도 필요하다.

---

## 4. 이번 세션(2026-08-14)에 한 일

### 4.1 로케일 Text Style 전면 정정 — 268곳

`*/ko·ja·latin` 은 **폰트 패밀리 스위치이자 폭 측정 전제**다. 일본어에 `*/ko` 가 걸리면
한자 폭이 절반으로 측정된다(`楽曲` 14px vs 28px). 이 때문에 이전 세션의 "320px 에서
6개 라벨이 12/16 필요" 라는 결론이 틀렸다. 파일 전체를 정정했고 **현재 잔여 0**이다.

### 4.2 내비 라벨 fit — 전용 스타일 6개

`12/16 · 500` 은 13 composite 에 없으므로 raw 값 대신 전용 스타일로 처리한다.
`nav-fit/ko·ja·latin`(500) · `nav-fit-current/ko·ja·latin`(600). 전부 `font/family/*` 에
바인딩돼 폰트 교체가 전파된다. **320px 에서 fit 이 필요한 라벨은 4개**(`데이터 동기화` ·
`譜面ビューア` · `ご意見・報告` · `Chart Viewer`). `店舗` 와 `Feedback` 은 근거가 없어
`14/20` 으로 복귀시켰다. 390·Wide 에서는 전부 `14/20`.

### 4.3 C8 셸 Focus — `State=Focus` 5개 추가

AppHeader · DestinationPanel Compact/Wide · AreaSwitcher Compact/Wide.
FOCUS-1B(컨트롤 자신의 1px INSIDE 경계). 평상시 경계가 있으면 색만 교체(AreaSwitcher 트리거),
없으면 포커스에서만 부여. **세트당 대표 컨트롤 하나만** variant 로 남기고 나머지 대상은
같은 규칙임을 컴포넌트 설명에 적었다(SHELL-30·31). 실측 대비 Light 19.77~~21.0 / Dark 15.91~~18.88.
**푸터 링크 focus 는 사용자 결정으로 이번 범위에서 제외.**

### 4.4 C8 모달 / 팝오버 조립 + 접합 규칙

- Compact modal 390·320, Wide popover 1280 을 Light·Dark 로 조립(섹션 `596:1389`).
- **접합 규칙(문서 24 `Joined overlay edge`)**: 모달은 헤더에 gap 0 으로 붙이고 접합 변
  radius 0, 접합 변의 자기 경계는 그리지 않는다(2px 이중선 방지). 비모달 팝오버는 트리거
  아래 8 오프셋 + 네 모서리 radius 유지. **성격별로 다르고 하나의 숫자를 공유하지 않는다**(SHELL-33).
- 320px reflow 검증 포함(가용 폭 288, 셀 134, 텍스트 슬롯 78).
- 동작(스크롤 잠금·포커스 containment·Escape·외부 클릭)은 Figma 로 표현할 수 없어 **dev 주석**에만 있다.

### 4.5 푸터 3로케일 문구 (문서 15 `SHELL-32`)

| 로케일 | 문구                                                                                   |
| ------ | -------------------------------------------------------------------------------------- |
| KO     | `© 2026 NosLog · NOSTALGIA 기록·랭킹·아카이브 비공식 팬 서비스`                        |
| JA     | `© 2026 NosLog · NOSTALGIA の記録・ランキング・アーカイブ非公式ファンサービス`         |
| EN     | `© 2026 NosLog · Unofficial fan service for NOSTALGIA records, rankings, and archives` |

상표 귀속 문장은 **어느 로케일에도 승인된 것이 없다.** 추가는 3로케일 동시 결정 사안.

### 4.6 등급 이미지 정적화 — **레포 변경 있음**

`public/grade/` 에 공식 등급 이미지 8종을 저장했다(`grade_p·s·a2·a·b2·b·c·d.png`, 40×40).
기존 구현은 `p.eagate.573.jp` 를 hotlink 하고 있었고, 서버 장애 시 표시가 사라지므로
자체 호스팅으로 바꾸기로 했다.

**아직 안 한 것**: `components/music/ranking/rankImage.tsx` 는 여전히 원격 URL 을 본다.
구현 단계에서 `public/grade/` 로 바꿔야 한다. 이번 세션은 구현 코드를 건드리지 않았다.

### 4.7 성취 색 역할 신설 — 문서 24 `AC-01`

`achievement/full-combo`(초록) · `achievement/pianist`(앰버). 값은 **SAP Fiori Horizon**
primitive 별칭(LD-03 과 같은 승인 출처). categorical 은 비의미 팔레트라 값 재사용에서
의미 충돌이 없다. 현재 제품의 Tailwind lime `#a3e635` 는 **출처가 없어 채택하지 않았다.**
`FC`·`P` 라벨을 항상 함께 둔다(색만으로 전달 금지).

### 4.8 랭킹 행 전면 재구성 (문서 05 `MDET-84`)

한 줄 + 고정 열. **파일 전체 68행이 단일 열 패턴**:

```
순위 0:28 | 프로필 36:24 | 이름 68:130 | 등급 206:18 | 점수 232:68 | 성취 308:26   (간격 8)
```

- 이름만 FILL. **값이 없어도 열이 유지된다**(성취 없는 행에서 점수가 밀리지 않는다).
- 점수 열은 최대 점수폭(`1,000,000` 계열 67px)에 맞췄고 헤더 `점수` 는 그 열 중앙.
- 보이는 헤더는 `순위`·`플레이어`·`점수` 뿐. 프로필·등급·성취는 **접근성 이름만**.
- 등급은 18px **이미지 슬롯**(Figma 는 자리표시 글자, 실제는 `public/grade/`).
- `MyRankSummary` 3 state 도 같은 열 좌표·같은 마크 문법. 컨테이너 recipe 는 표와 동일
  (`surface/surface` + `radius/container` + 패딩 12 · **경계선 없음** — 넣으면 요약이 표보다 강해진다).
- 플레이어 이름의 로케일 스타일은 **이름 문자 체계를 따른다**(한·일·라틴 혼재).

### 4.9 P1 4영역 조립 + Dark

Information · 내 기록 · **랭킹** · **서열·평가** · 목적지 패널 열림 — **Light·Dark 각 5셸**.
영역 패널 안 블록 간격은 **32** 로 통일. AreaSwitcher 는 영역별 variant 로 전환.

### 4.10 사용자가 잡아낸 결함들 (전부 수정 완료)

- 그리드 카드 **죽은 여백 20px**(297 고정 vs 내용 277) → 카드·body HUG 로 277
- 그리드 카드 **이중 갭**(카드 gap 8 + body padding 12 = 상단 20 / 하단 12) →
  카드 gap 0 · 패딩 0, body 패딩 12 사방 → **상하 12 대칭**, 카드 269
- **포커스링이 카드보다 20px 초과** → 부모에 맞추고 `STRETCH` 로 고정
- **자켓 배지가 음표 아이콘에 가려짐** → `category` 를 z 최상단으로 (C6 12곳 + Z1 6곳)
- **헤더가 사라짐**(P1) → auto-layout flow 순서 복구
- **점수 열 붕괴** → 빈 마크를 숨기지 않고 내용만 비우도록 변경
- 설명 문장이 보이는 텍스트로 들어감(C2·C6·C7) → dev 주석으로 이동

---

## 5. 지금 레포 상태

```
 M CLAUDE.md
 M docs/design/05-music-detail-page-brief.md
 M docs/design/15-shared-shell-navigation-brief.md
 M docs/design/24-foundation-v0.1.md
?? public/grade/            (신규 · 등급 이미지 8종)
```

**커밋하지 않았다.** `prettier --check` 통과 · `git diff --check` 통과.
직전 커밋은 `9b0cdc0 docs: 로케일 텍스트 스타일 전제와 내비 fit 전용 스타일 확정`.

추천 커밋 제목: `docs: 랭킹 행 열 계약과 성취 색 역할 확정`

---

## 6. 다음에 할 일 — 순서대로

### 1단계 · P1 서열·평가 영역 완성 (문서 05 · 926-942)

현재 ①②③ 만 조립돼 있고 **④⑤ 가 없다.** 해당 셸 dev 주석에 "부분 조립"이라고 적혀 있다.

**④ 현재 사용자의 투표·평가 폼**

- 6범위 투표: Basic/Recital × S/Full Combo/Pianist, 값 `1.0`–`14.5` `0.1` 단위,
  사용자·채보·모드·목표당 1개, 범위별 독립 수정·삭제
- 자격 상태 5종: 로그인 안 됨 / 해당 채보 검증 기록 없음 / Recital 미참가 / 자격 있음 / 이미 투표함
  — **자격 없는 이유를 접근 가능하게 보여줘야 한다.** disabled 만 두고 설명 생략 금지
- Basic: S ≥ 950,000 · Full Combo `fc_type >= 2` 또는 1,000,000 · Pianist `fc_type === 3` 또는 1,000,000
- Recital: 같은 목표 조건 + `grade_recital > 0`
- 5축 패턴 평가: `계단·연타·폴리리듬·즈레·동시치기`, **`미평가`(결측) ≠ `0`(없음)**,
  누락 축을 0 으로 prefill 금지, 명시적 `미평가` 상태 제공
- 삭제 범위 3종(의견만 / 일반 평가 전체 / 범위별 투표)이 서로 독립

**⑤ 커뮤니티 의견** — Helpful · 정렬 2종 · Load more · 삭제 2종 · overflow 는 상시 버튼이
아니라 메뉴. **의견 행마다 5축 값을 반복하지 않는다**(집계는 레이더가 소유).

### 2단계 · 나머지 Page Brief (13개 미착수)

03 Home · 04 Shared Discovery · 06 Tier List · 08 Global Rankings · 09 Profile ·
10 Bingo · 11 Exam · 12 Arcade Discovery · 13 Data Sync · 14 Announcements ·
16 Settings & Account · 17 Authentication & Onboarding · 19 System Recovery States

문서 07 은 제작 대상이 아니라 보존 계약. 문서 18 은 release blocker 라 UI 로 위장 금지.

### 3단계 · 밀린 공용 항목

- pressed `scale(0.98)` 을 나머지 작은 컨트롤(아이콘 버튼·페이지 번호)로 전파
- 데스크톱 랭킹 컬럼 분해(`05:757`) · Wide 레이아웃 일반
- C8 푸터 링크 focus (이번엔 제외 결정 — 필요해지면 그때)
- Pretendard 교체 후 전체 레이아웃 재검수

---

## 7. 미결·미승인 목록

**미승인 문구**

- 랭킹: `순위` · `플레이어` · `점수` (ko 임시)
- 서열: `평균` · `투표 N명` · `Basic 풀콤보 분포`
- 레이더: `패턴 성향` · `패턴 성향 기준` · `평가 N명`
- 참가자 0명 `ScoreDistribution` 문구
- **위 전부 ja/en 미확정**. 푸터 문구만 3로케일 확정됐다(§4.5)

**미결 CONFLICT** — 11(시각코어 PDF 표현) · 12(C5 `A2_padSym` 19건 근거) ·
15 후속(`채보 보기` 일본어) · 16(번역 팝오버 로케일 라벨) · 참고-25(unavailable 문구) ·
참고-26(사용자 기록 픽스처 부재)

**보류** — 선택 세그먼트 표시: 사용자는 `border/strong` 을 골랐으나 문서 24 NI-A 가
"selection … automatically promote to border-strong" 를 명시 금지한다. **재확인 필요.**

**만들지 않기로 한 것**(근거 있음, 누락 아님)

- 레이더 계열 반투명 채움 — 승인된 불투명도 값 없음
- 분포 색의 4단 순위 표현 — 램프 폭 3.31:1 로 물리적 불가
- 서열 하위 컴포넌트의 Error/Loading — 실패 문구는 섹션 레벨 1회 원칙
- Primary·Destructive 의 pressed 색 구분 — 승인 램프에 여유 없음(scale 로 해결)
- 등급 아이콘 자체 제작 — 공식 이미지를 쓰기로 함

**감사 도구의 알려진 오탐 2종**

- `A1_spacing2` 판정 정규식이 경로 문자열 기반이라 새 한글 경로에서 오탐 가능
- NI-A 분류기가 `State=Hover` 형식만 인식해 `cells / Hover / Button` 같은 경로를 놓침

---

## 8. 마지막 감사 결과 (2026-08-14)

```
C6 (1401 노드 · Dark 642)   위반: 패딩 비대칭 6 = Music List 0/12 (자켓 bleed 구조상 의도)
C7 (2025 노드 · Dark 878)   위반 0
P1 (2035 노드 · Dark 1017)  위반: 패딩 비대칭 10 = AppHeader 16/8 (승인된 광학 패딩)
C8 (3253 노드 · Dark 1271)  위반: 패딩 비대칭 24 = 동일 사유
전 페이지 공통: 하드코딩 0 · raw 불일치 0 · RAW 텍스트 0 · 로케일 불일치 0 ·
                죽은 여백 0 · 겹침 0 · 섹션 이탈 0 · 포커스링 불일치 0
리더보드 열 패턴: 68행 전부 단일 패턴
Z1 보류 섹션: 0건
```

`A2_padSym` 은 전부 **의도된 비대칭**이다 — AppHeader 16/8 은 가장자리 아이콘 광학 패딩
(문서 24), Music List 0/12 는 자켓이 좌측 경계까지 bleed 하는 구조다.

---

## 9. 새 세션 첫 행동

1. `AGENTS.md` · `README.md` · 문서 64 · 문서 24 · 해당 Page Brief 를 직접 읽는다.
2. `CLAUDE.md` 를 읽는다.
3. `git status` 로 §5 의 미커밋 변경을 확인한다. **reset·checkout·덮어쓰기 금지.**
4. Figma 에서 P1 `242:2` 의 서열·평가 셸과 그 dev 주석을 읽는다(부분 조립 표시).
5. 문서 05 의 926-942 와 1041-1250 을 끝까지 읽는다.
6. 무엇을 어떻게 만들지 Before → After 로 제안한다.
7. 사용자가 **"시작"** 이라고 한 뒤 작업하고, 만든 직후 감사를 돌려 항목별로 보고한다.
