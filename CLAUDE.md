# CLAUDE.md — NosLog 2.0 디자인 작업 규칙

> **이 파일을 모든 작업 시작 전에 반드시 먼저 읽는다.** 세션이 바뀌어도, 대화가 길어져도,
> 작업을 재개할 때마다 다시 읽는다. 여기 적힌 규칙은 사용자가 반복해서 지시한 것이며
> 어긴 적이 있는 항목만 남겨 두었다.

---

## 0. 절대 규칙 (어긴 이력이 있음 — 반복 금지)

1. **시작 게이트** — 사용자가 명시적으로 "시작"이라고 말하기 전에는 아무것도 만들지 않는다.
   스킬 로딩이나 "phase 진입"도 시작으로 간주된다.
2. **문서 우선** — 만들기 전에 해당 Page Brief를 끝까지 읽는다. 상위 문서만 읽고 시작하지 않는다.
3. **추측 금지** — 문서에 없는 값(패딩·정렬·색·구조·컬럼·라벨)을 감으로 정하지 않는다.
   `AGENTS.md`에 이미 명시: _"Do not make ambiguous decisions from assumptions."_
4. **애매하면 멈추고 질문** — 문서에 근거가 없는 시각 결정이 나오면 **만들지 말고 먼저 묻는다.**
   질문할 때는 말로만 하지 말고 **비교 시안을 그려서** 보여준다.
5. **만든 직후 전수 검증** — 아래 §2 체크리스트를 예외 없이 전부 돌린다.
   "스크립트가 에러 없이 돌았다" ≠ "결과가 맞다".
6. **실행한 검사만 보고** — 안 돌린 검사를 "검증했다"고 말하지 않는다.
7. **Light/Dark 둘 다** — 문서 24는 Light·Dark 양쪽을 요구한다. 한쪽만 만들고 끝내지 않는다.

---

## 1. 권위 순서

① 사용자의 최신 결정 → ② `AGENTS.md` → ③ `README.md` · 문서 57 → ④ 문서 07(뷰어/에디터 절대 보존)
→ ⑤ 문서 24(Foundation 정확값) → ⑥ 문서 25 → ⑦ 해당 Page Brief → ⑧ 문서 22 · 63

- 시각 언어 기준: `output/pdf/noslog-2.0-visual-core-review.pdf` (승인된 편집 언어)
- 실제 콘텐츠: `prisma/data/nosdata-musics.json` (578곡) — 콘텐츠를 지어내지 않는다

---

## 2. 검증 체크리스트 (만들 때마다 전부)

### 자동 감사 (스크립트)

- [ ] **페이지 겹침** — top-level 노드 간 bounding box 교차 0
- [ ] **spacing** — padding/itemSpacing이 `0·2·4·8·12·16·24·32·48·64` 중 하나
- [ ] **색 바인딩** — 모든 fill/stroke가 변수 바인딩. 하드코딩 0
- [ ] **타이포** — size는 `12·14·16·20·24·32·40`(+mono 11), line-height는 `16·20·24·28·32·40·48`
- [ ] **radius** — `4·8·10·full` (focus ring 파생값 5/6/7/9/11만 예외)
- [ ] **strokeWeight** — 1 또는 2
- [ ] **텍스트 넘침** — 부모 가용폭 초과 0
- [ ] **아이콘 클리핑** — 인스턴스 크기 = 내부 프레임 크기, clip 해제
- [ ] **세로 중앙정렬** — `counterAxisAlignItems=CENTER` 선언한 곳의 자식 centerY 오차 ≤0.5px
- [ ] **좌우 패딩 대칭** — 비대칭이면 의도된 것인지 확인
- [ ] **원형 요소** — 원이어야 하는 것(배지·dot·아바타)은 width=height 고정

### 색 바인딩 함정 (실제로 파일을 망가뜨린 적 있음)

- 변수 바인딩 paint를 만들 때 **raw 색을 반드시 실제 값으로 채운다.**
  `{r:0,g:0,b:0}`으로 두고 `setBoundVariableForPaint`만 걸면, 바인딩 해석이 안 되는 순간
  **전부 검정으로 렌더**된다. Dark 플레이트가 통째로 검게 변한 사고의 원인.
- Dark 노드는 `explicitVariableModes`로 모드가 걸려 있다. 검사·수정 시 **노드의 실효 모드**
  (자신 또는 조상의 explicit mode)를 기준으로 값을 해석한다. Light 기준으로 비교하면
  Dark 노드가 전부 "불일치"로 오판되고, 그걸 고친다며 덮어쓰면 파일이 깨진다.
- **대량 변경(수십 개 이상) 전에는 반드시 소수로 시험하고 눈으로 확인한 뒤 확대 적용한다.**

### 시각 검증

- [ ] **1x 배율** 스크린샷 (축소본만 보고 판단 금지)
- [ ] **실제 사용 크기로 확대** (예: 20px 아이콘을 8배 확대해 잘림 확인)
- [ ] **Light + Dark 양쪽** 실제 배경 위에서 확인
- [ ] **320px reflow** (반응형 주장을 하는 화면일 때)
- [ ] **최장 실제 KO/JA/EN 콘텐츠**로 잘림 확인

### 의미 검증

- [ ] 브리프가 요구한 항목 누락 없음 (예: 난이도별 레벨 숫자)
- [ ] 도메인 용어 정확 (**◆JUST**(S-Just 아님), **기타 지역**(Global 아님), Not listed/Not published 구분)
- [ ] 색만으로 상태 전달 금지 — 형태·라벨·순서 같은 비색 단서 병행
- [ ] WCAG 대비 계산 (텍스트 4.5:1, 비텍스트 3:1)

---

## 3. Foundation 핵심 값 (문서 24)

- 중립 = **Adobe Spectrum S2 정확값** (Tailwind 금지)
- focus = **FI-C** Light `#000000` / Dark `#FFFFFF`, **2px**, 객체 바깥
    - **승인된 예외**: 컨트롤 경계와 ring 사이 **1px 분리 띠**(R2 CONFLICT-01, 2026-08-11 승인)
- **NI-A**: 보편적 hover/selected 배경은 **없다**. interaction fill은
  hover / selected / menu-set / disabled **에만** 사용. 평상시(resting) 요소에 칠하지 않는다.
- 아이콘 = **Lucide** 실제 geometry (`node_modules/lucide-react` 1.24.0에서 추출, 손으로 그리지 않음)
    - 렌더 20px(일반 액션) / 16px(라벨 옆 보조) / 24px(강조)
    - **아이콘 전용 컨트롤 타겟: 모바일 44×44, 데스크톱 40×40**
- 도메인 색: DU-01 난이도 4 / JD-02 판정 5(FAST/SLOW 아님) / LD-03 SAP / FS-BN 피드백
- grid: Compact <672(4col g12 m16) / Intermediate 672–1055(8col g16 m24) / Wide 1056+(12col g16 m32)
- container: reading 768 / standard 1280 / wide 1440 / workspace fluid

---

## 4. 보존 경계 (절대)

- **채보 viewer/editor 전체 잠금**(문서 07) — 재설계·recolor·Foundation 적용 금지, 진입 링크만
- **관리자 `/admin/*`** 광범위 재설계 없음
- **user chart-contribution 흐름** 신규 생성 금지
- **레거시 NOSTORY Figma**를 현재 권위로 사용 금지
- **문서 63 regression harness**를 최종 구성으로 복사 금지
- **개인정보 release blocker**(문서 18)를 해결된 UI로 위장 금지
- PDF의 GitHub Primer 편집 색은 **제품 색이 아님**

---

## 5. 현재 작업 환경

- Figma 파일: `NosLog v2.0.0` (`cVbWCxhkfxFfHmAKLCyKrD`)
- **폰트**: 규범값은 `Pretendard JP Variable`이나 이 Figma 렌더러가 로드 불가
  → 렌더는 `IBM Plex Sans KR/JP/Latin` + 수치는 `IBM Plex Mono`
  → 교체는 `font/family/ko·ja·latin` 변수 3개만 바꾸면 됨 (교체 후 레이아웃 재검수 필요)
- 상태 파일: 스크래치패드 `state.json`, `R2-conflicts.md`, `audit.js`, `brief-contracts-notes.md`

---

## 6. 사용자 결정 기록

| 항목             | 결정                                                           | 일자       |
| ---------------- | -------------------------------------------------------------- | ---------- |
| focus indicator  | **2겹 ring**(1px 분리 띠 + 2px focus ring) — 문서 24 개정 필요 | 2026-08-11 |
| 필터 적용 표시   | **배경 없음** + 배지 + `border/strong`                         | 2026-08-11 |
| 뷰모드 선택 표시 | **surface/raised 세그먼트**(sunken 트랙 위)                    | 2026-08-11 |
| 대체 폰트        | IBM Plex 사용, 완성 후 사용자가 Pretendard로 교체              | 2026-08-11 |
