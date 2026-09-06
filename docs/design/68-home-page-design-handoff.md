# 68 · Home Page Design Handoff — 2026-08-19

Figma 파일 `NosLog v2.0.0` (`cVbWCxhkfxFfHmAKLCyKrD`) 의 Home 하이파이 디자인 인수인계다.
이 문서 하나로 Home 을 구현하거나 이어서 설계할 수 있게 썼다.

권위 순서는 바뀌지 않는다: ① 사용자의 최신 결정 → ② `AGENTS.md` → ③ `README.md`·문서 57 →
④ 문서 07 → ⑤ 문서 24 → ⑥ 문서 25 → ⑦ **문서 03(Home Page Brief)** → ⑧ 문서 22·63.
이 문서는 문서 03 이 downstream 으로 넘긴 값들을 확정한 기록이지 문서 03 을 대체하지 않는다.

---

## 1. Figma 노드 맵

페이지 **`P2 · Home 조립`** (`1114:2`) · 7 섹션 · 57 프레임.

| 섹션                               | id           | 프레임 |
| ---------------------------------- | ------------ | -----: |
| `Home · Compact 390`               | `1114:3`     |     11 |
| `Home · Compact 390 · Dark`        | `1134:983`   |     11 |
| `Home · 검증 · 320px / 로케일`     | `1137:1935`  |      7 |
| `Home · Wide 1280`                 | `1158:2285`  |     11 |
| `Home · Wide 1280 · Dark`          | `1161:15946` |     11 |
| `Home · Intermediate 768 / 1024`   | `1164:5818`  |      4 |
| `Home · 1440 (컨테이너 상한 초과)` | `1167:6238`  |      2 |

### Compact 390 (Light `1114:3` / Dark `1134:983`)

| 상태                                 | Light      | Dark        |
| ------------------------------------ | ---------- | ----------- |
| 기본                                 | `1114:4`   | `1134:984`  |
| 중대 공지 있음                       | `1117:85`  | `1134:1046` |
| 검색 프리뷰 · 5건                    | `1117:180` | `1134:1109` |
| 검색 프리뷰 · 용량 초과              | `1117:417` | `1134:1177` |
| 검색 프리뷰 · 매치 없음              | `1122:449` | `1134:1247` |
| 검색 프리뷰 · 로딩                   | `1122:551` | `1134:1312` |
| 검색 프리뷰 · 검색 실패              | `1122:653` | `1134:1377` |
| 공지 없음                            | `1123:674` | `1134:1443` |
| 공식 소식 없음                       | `1123:796` | `1134:1491` |
| 공식 소식 로드 실패                  | `1123:919` | `1134:1551` |
| 키보드 · 프리뷰 동적 행 수(최악 2행) | `1133:884` | `1134:1611` |

### Wide 1280 (Light `1158:2285` / Dark `1161:15946`)

기본 `1158:2286` / `1161:15947` · 중대 공지 `1159:2359` / `1161:16009` ·
프리뷰 5건 `1159:2450` / `1161:16072` · 용량 초과 `1159:2675` / `1161:16140` ·
매치 없음 `1160:2707` / `1161:16210` · 로딩 `1160:2809` / `1161:16275` ·
검색 실패 `1160:2911` / `1161:16340` · 공지 없음 `1161:2932` / `1161:16406` ·
공식 소식 없음 `1161:3054` / `1161:16454` · 공식 소식 실패 `1161:3177` / `1161:16515` ·
**목적지 패널 열림** `1161:3300` / `1161:16576`

### 검증 · 반응형 / 로케일

`Home · 320 · 한국어` `1137:1936` · `390 · 日本語` `1140:2005` · `320 · 日本語` `1140:2144` ·
`390 · English` `1142:2145` · `320 · English` `1142:2284` ·
`1280 · 日本語` `1168:4340` · `1280 · English` `1168:4480` ·
`768 · 기본` `1164:5819` (Dark `1164:5880`) · `1024 · 기본` `1164:5941` (Dark `1164:6002`) ·
`1440 · 기본` `1167:6239` (Dark `1167:6302`)

---

## 2. 확정값

### 2.1 폭별 골격

| 폭   | 그리드    | 여백 |   1열 | 목적지 | 타일   | 타일 inset | 편집영역          |
| ---- | --------- | ---: | ----: | ------ | ------ | ---------: | ----------------- |
| 320  | 4col g12  |   16 |     — | 3×3    | 88×72  |         12 | 세로              |
| 390  | 4col g12  |   16 |     — | 3×3    | 111×72 |         12 | 세로              |
| 768  | 8col g16  |   24 |    76 | 4×2    | 168×72 |         12 | 세로              |
| 1024 | 8col g16  |   24 |   108 | 4×2    | 232×72 |         12 | 세로              |
| 1280 | 12col g16 |   32 | 86.67 | 4×2    | 292×96 |         24 | **8:4 = 805/395** |
| 1440 | 12col g16 |   32 | 86.67 | 4×2    | 292×96 |         24 | 8:4               |

- `span(n) = n × 86.67 + (n−1) × 16` (12열 기준)
- 목적지 3×3↔4×2 전환은 **목적지 영역 폭 448** 임계값(문서 03 기승인). 320·390 만 3×3 이다
- 3×3 의 아홉 번째 칸은 **비운다**(문서 03: 마지막 행 세 번째 칸 유지)
- 편집영역 나란히↔세로 전환은 **문서 24 의 Intermediate/Wide 경계 1056** 과 일치시킨다

### 2.2 간격 체계

구역 사이 `32`(section) · 구역 내부 `24`/`12` · 컴포넌트 inset `12`/`16` ·
목적지 그리드 gutter 는 그 폭의 그리드 gutter 를 따른다(compact 12 · intermediate/wide 16).

### 2.3 정체성 + 검색

- 마크 `N` — 원형 **1px INSIDE 링** + 글자, 면 투명. 색 `identity/mark`(Light `#292929` / Dark `#DBDBDB`).
  지름 40 과 글자 스타일은 **잠정 대역**이다. 문서 24 가 final logo drawing 을 제외했으므로 최종 마크는
  아트워크로 별도 확정한다
- Wide 이상에서 검색 구역은 **640 중앙 bounded**
- `NosLog` 는 Wide 이상에서 **`page-title-promoted` 32/40**, 그 미만에서는 `page-title` 24/32
- ⚠️ **640 은 승격 임계값과 정확히 같다.** 이 폭을 줄이면 승격이 무효가 되어 24/32 로 되돌려야 한다

### 2.4 검색 프리뷰 팝오버

- 면 `surface/overlay` · 경계 `border/default` 1px INSIDE · radius `10` ·
  그림자 **`elevation/overlay-light`** · inset `16` · 행 gap `8` · 앵커 오프셋 `8`
- 폭은 앵커(검색 필드)와 같다. compact 358 · wide 640
- 행 = C6 `ResultCollection · Music List` (`171:11`) 인스턴스에서 **`difficulty-group` 만 `visible=false`**.
  행 높이 64
- 최대 5행. **데스크톱이라고 늘리지 않는다**(문서 03)
- 용량 초과일 때만 `전체 결과 N개 보기` 핸드오프 행(44)을 마지막에 둔다. 매치 없음 상태에는 두지 않는다
- 포커스 시 **화면을 스크롤시키지 않는다.** 행 수만 가용 높이에서 동적으로 유도하고, 남은 매치가 있으면
  핸드오프를 항상 유지한다. 390×844 + 키보드 336(검증값) 최악이 2행 + 핸드오프
- 로딩은 팝오버가 소유한다. 입력 필드에는 로딩 표시를 두지 않는다

### 2.5 목적지 타일

- 면 `surface/surface` · radius `8` · 아이콘 20 · 라벨 `control 14/20`
- 라벨 fit 캐스케이드(문서 15 순서): `control 14/20` → 안 들어가면 **`nav-fit 12/16`** →
  그래도 안 되면 승인된 축약 문구 → 두 줄은 최후. 셀이 허용하면 `14/20` 으로 복귀
- 문구는 **320px 기준으로 정하고 넓어져도 바뀌지 않는다**
- 실제 발동은 **320px 에서만** 일어난다: JA `ランキング`·`データ連携`, EN `Data Sync` 가 12/16.
  390 이상에서는 세 로케일 모두 14/20 한 줄

| 순서 | 한국어    | 日本語     | English   | 아이콘                |
| ---: | --------- | ---------- | --------- | --------------------- |
|    1 | 악곡      | 楽曲       | Music     | `Icon/music`          |
|    2 | 채보 뷰어 | 譜面       | Charts    | `Icon/list-music`     |
|    3 | 서열      | 難易度表   | Tiers     | `Icon/layers`         |
|    4 | 랭킹      | ランキング | Rankings  | `Icon/trophy`         |
|    5 | 빙고      | ビンゴ     | Bingo     | `Icon/grid-3x3`       |
|    6 | 검정      | 検定       | Exams     | `Icon/graduation-cap` |
|    7 | 오락실    | 店舗       | Arcades   | `Icon/map-pin`        |
|    8 | 동기화    | データ連携 | Data Sync | `Icon/refresh-cw`     |

`데이터 동기화 → 동기화` 와 `譜面ビューア → 譜面` 은 2026-08-18 에 신규 승인한 축약이다.
영문 `Chart Viewer → Charts` 는 `HOME-20` 기승인.

### 2.6 셸

- 헤더는 C8 `AppHeader`(`247:58`) 인스턴스를 폭에 맞춰 늘리고 **패딩 16/8 을 유지**한다(32 로 바꾸지 않는다)
- **컨테이너 상한을 넘는 폭에서는 헤더·푸터가 뷰포트 전체, 본문만 1280 중앙**
  (문서 15 `SHELL-34`). 좌측 키라인이 어긋나는 것은 의도된 것이다
- 목적지 패널은 `DestinationPanel · Wide`(`531:4015`) 를 우측 정렬 x784 · y68(헤더 60 + 오프셋 8).
  비모달이라 스크림도 본문 스크롤 잠금도 없다
- 푸터는 `OrdinaryFooter`(`535:3947`) `Layout=Compact` / `Layout=Wide`

### 2.7 편집 영역

- 공지 행 = 제목(`body`) 위 · 날짜(`metadata`) 아래, 패딩 12, 행 사이 `border/divider` 1px(마지막 행 제외).
  Wide 에서는 제목과 날짜가 한 줄에 `SPACE_BETWEEN`
- 공지 3건 고정. 0건이면 **구역 통째로 생략**(빈 카드·제목·여백 없음)
- 공식 소식은 제목 행 오른쪽에 **공식 X 링크를 항상** 두고, 상태에 따라 임베드만 사라진다
- 임베드 자리의 **높이를 고정하지 않는다.** 렌더는 X 가 소유한다
- 중대 공지는 C4 `StatusMessage`(`100:41`) `Severity=Warning` 인스턴스를 그대로 쓴다.
  **링크·액션 슬롯을 추가하지 않는다.** 공지가 없으면 컨테이너도 여백도 남기지 않는다

---

## 3. 결정 기록 (Z1 `268:2` · 보류 0건)

전부 `✅ 승인 완료` 섹션(`268:3`)에 있고 미채택안은 `폐기 · …` 로 표시했다.

| 결정                                              | 노드        |
| ------------------------------------------------- | ----------- |
| 검색 로딩 표시 = 앵커 팝오버 소유                 | `1088:4013` |
| N 마크 = 원형 1px 링                              | `1089:4068` |
| 검색 프리뷰 행 = C6 인스턴스 · 난이도 접기        | `1090:4068` |
| 타일 라벨 폭 측정 (근거)                          | `1080:3705` |
| 타일 fit = 여백 12 + nav-fit 12/16 · 문서 15 순서 | `1096:4248` |
| 중대 공지 = C4 StatusMessage 그대로               | `1105:4677` |
| 공식 뉴스 = 공식 X 링크 상시 노출                 | `1106:4746` |
| Wide 편집영역 분할 = 8:4                          | `1107:4766` |
| 목적지 타일 면 = surface/surface + radius 8       | `1128:4766` |
| 키보드 제약 = 스크롤 없이 동적 행 수              | `1129:4883` |
| 320px placeholder = 말줄임 수용                   | `1148:5258` |
| Wide 구성 = 검색 640 · 목적지 12열 전체           | `1153:5324` |
| 편집영역은 Wide(1056+)에서만 나란히               | `1163:5538` |
| 컨테이너 초과 폭에서 셸은 뷰포트 전체             | `1166:6098` |
| 공식 소식 부재·실패를 다른 문구로                 | `1172:6378` |

문서에 반영한 개정: 문서 03 `HOME-21`(compact 라벨 fit) · 03:306 · 03:553 ·
문서 15:423(`nav-fit` 스코프) · 15 `SHELL-29` · 15 **`SHELL-34`**(컨테이너 초과 폭 셸).

---

## 4. 문구 인벤토리

### 4.1 대표 데이터 — 승인 대상 아님

공지 3건 제목·날짜, 중대 공지 본문. **런타임에 DB 레코드로 대체되는 자리다.**
구현 시 실제 공지로 교체하며 승인 절차가 필요 없다.

|   # | 한국어                                       | 日本語                                         | English                                                     | 날짜       |
| --: | -------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------- | ---------- |
|   1 | v1.6.0 업데이트 — 악곡 검색과 번역 곡명 개선 | v1.6.0 アップデート — 楽曲検索と訳題表示の改善 | v1.6.0 update — improved music search and translated titles | 2026-08-15 |
|   2 | 데이터 연동 북마클릿 점검 완료               | データ連携ブックマークレットのメンテナンス完了 | Data Sync bookmarklet maintenance complete                  | 2026-08-09 |
|   3 | Op.3 검정 과제곡과 서열표 시즌 반영          | Op.3 検定課題曲と難易度表シーズンを反映        | Op.3 exam charts and tier list season updated               | 2026-08-02 |

날짜 표기: ko `2026. 8. 15.` · ja `2026年8月15日` · en `Aug 15, 2026`

### 4.2 저장소에 이미 3로케일이 있는 키 — 재사용

`common.retry` · `common.login` · `home.announcements` · `home.officialNews` ·
`home.officialX` · `home.searchPlaceholder` · `footer.privacy`

### 4.3 신규 키 7개 — 한국어 확정 · ja/en 작성 필요

1. `전체 공지`
2. `검색 중…` (`common.loading` "로딩 중..." 과 문맥이 다르다)
3. `일치하는 악곡이 없습니다.` (`music.empty` 는 필터 문맥이라 재사용 부적절)
4. `검색 결과를 불러오지 못했습니다.`
5. `전체 결과 N개 보기`
6. `표시할 공식 소식이 아직 없습니다.`
7. `공식 소식을 불러오지 못했습니다.`

문서 03 Phase Approval 이 `localized production copy` 를 downstream 작업으로 명시했으므로
ja/en 작성은 구현·콘텐츠 단계의 일이다. **6·7 은 서로 다른 문구여야 한다** — 문서 03 이
`No official news` 와 `Official-news load failure` 를 별도 상태로 승인했다.

---

## 5. 구현 시 주의점

### 5.1 이번에 고친 공유 컴포넌트 2건

- **C8 `OrdinaryFooter`(`535:3947`)** — Compact 의 `service-notice` 가 폭 358 FIXED 라
  320px 에서 54px 이탈했다. `FILL` + `textAutoResize=HEIGHT` 로 수정(2줄 흡수). Wide 는 HUG 유지
- **C5 `SearchField`(`107:70`)** — 값·placeholder 가 줄바꿈돼 좁은 폭에서 필드 높이가 52 를 넘었다.
  전 variant `maxLines=1` + `textTruncation=ENDING` 으로 수정

두 건 모두 Home 만의 문제가 아니라 **모든 페이지의 320px 위반**이었다. 컴포넌트에 수정 사유를
annotation 으로 남겼다.

### 5.2 신설한 Text Style 3개

**`page-title-promoted/ko·ja·latin`** — 32/40 · 700 · proportional. Text Style 45 → 48.
문서 24 에 **이미 승인돼 있던 승격 규칙**의 구현이므로 문서 24 개정은 없었다.
적용 조건 3개를 모두 만족할 때만 쓴다 — ① 12열 컨테이너 1056px 이상 ② 구역이 8트랙 이상이거나
측정 인라인 폭 640px 이상 ③ `reading` 조성이 아님. **뷰포트가 넓다는 이유만으로 쓰지 않는다.**
`metric-display` 도 32/40 이지만 tabular 라 제목에 쓰면 역할 오용이다.

### 5.3 아직 없는 제품 기능

- **공지 데이터 모델** — 현재 `Announcement` 는 `title`/`content` 단일 필드다.
  문서 03 이 요구한 locale 3벌 · slug · severity · 시작/만료 시각 · 발행 준비 검사가 전부 미구현이다
- **공지 상세·아카이브 라우트** — Home 의 각 행과 `전체 공지` 가 가리킬 대상이 없다
- **공식 X 임베드** — 현재 구현은 검증 브라우저에서 `0×0` 숨김 iframe 이 된다.
  문서 03 이 "디버깅이 필요한 증거이지 그대로 복사할 구현이 아니다" 라고 명시했다
- **한국어 줄바꿈** — 공지 제목이 어절 단위로 끊기려면 `word-break: keep-all` 이 필요하다.
  이 디자인의 렌더는 문자 단위 줄바꿈 결과다

### 5.4 Figma 작업 시 함정

`CLAUDE.md` §구조 변경 함정에 정리해 뒀다. 이번 Home 작업에서 실제로 당한 것만 적었다 —
생성 API 전부가 `figma.currentPage` 에 붙는 것(`createSection` 포함), `ABSOLUTE` 자식의 좌표가
부모 기준인 것, `findAll` 이 INSTANCE 내부로 안 내려가는 것, `appendChild` 가 폰트 로드를 요구하는 것,
그리고 **인스턴스를 배치하기 전에 그 컴포넌트의 컨테이너 계약을 읽어야 한다**는 것.

---

## 6. 검증 결과와 미실행

### ⚠️ 정정 (2026-08-19) — 페이지 레벨 배치는 검증되지 않았었다

아래 표의 「프레임 이탈 0」은 **각 프레임 내부** 기준이었고, **섹션 자식이 자기 섹션 안에 있는지는
검사하지 않았다.** 2026-08-19 P3 작업 중 같은 결함을 추적하다 P2 도 같은 상태였음이 드러났다.

Figma 섹션 자식의 `x`·`y` 는 섹션 기준 상대좌표인데 절대 캔버스 좌표가 들어가 있어,
`y=0` 인 `Home · Compact 390` 을 제외한 **6개 섹션의 프레임 46개**가 섹션 y 만큼 한 번 더 아래로
밀려 다른 섹션 영역을 덮고 있었다. 개별 프레임 스크린샷과 프레임 내부 감사로는 잡히지 않는다.

- 정정 대상: `Home · Compact 390 · Dark`(11) · `Home · 검증 · 320px / 로케일`(7) ·
  `Home · Wide 1280`(11) · `Home · Wide 1280 · Dark`(11) ·
  `Home · Intermediate 768 / 1024`(4) · `Home · 1440`(2)
- 조치: **좌표만** 섹션 상대값으로 정정했다. 크기·색·타이포·구조·자식 순서는 변경 없음
- 정정 후: 섹션 밖 자식 **0** · 섹션 간 bounding box 교차 **0**
- ⚠️ 이 정정은 **수치로만 확인했고 페이지 전체 렌더는 확인하지 못했다.** 다음 세션이
  P2 를 한 장으로 렌더해 눈으로 확인해야 한다

따라서 아래 표의 결과는 **프레임 내부 한정으로 유효**하다. 프레임 안의 레이아웃·타이포·색·대비
결과 자체는 이 정정으로 달라지지 않는다(좌표만 바뀌었기 때문이다).

### 실행하고 통과한 것

| 검사                             | 범위                                      | 결과                                     |
| -------------------------------- | ----------------------------------------- | ---------------------------------------- |
| spacing · radius · stroke · icon | 전 섹션                                   | 위반 0                                   |
| 프레임 이탈 · 텍스트 넘침        | 전 섹션                                   | 0                                        |
| Text Style 적용 · raw 값         | 전 섹션                                   | 100% · raw 0                             |
| 로케일 Text Style 일치           | 전 섹션                                   | 불일치 0                                 |
| 색 변수 바인딩                   | 전 섹션                                   | 하드코딩 0                               |
| Dark 모드 명시 적용              | Dark 전 프레임                            | 전부 적용                                |
| WCAG 대비 전수 계산              | Compact·Wide·Intermediate·1440 Light/Dark | **실패 0** (최저 Light 6.64 / Dark 7.25) |
| 320px reflow                     | 320 KO/JA/EN                              | 이탈 0                                   |
| 로케일                           | KO/JA/EN × 320·390·1280                   | 통과                                     |
| Light↔Dark 대칭                  | Compact·Wide                              | 프레임 크기·노드 수 완전 일치            |

### 미실행 (통과 아님)

- `audit.js` 전체 실행 — 신규 프레임 범위의 항목별 감사로 대체했다
- Intermediate·1440 의 **상태 화면** — 기본 화면만 있다. 상태별 구성은 폭에 따라 구조가 달라지지
  않고 Compact·Wide 에 11종씩 있어 만들지 않기로 했다
- Intermediate·1440 의 **로케일 프레임** — 타일 라벨 여백이 144~244 로 가장 긴 라벨(70)의 3배
  이상이라 fit 단계가 발동하지 않음을 계산으로 확인했으나 프레임은 만들지 않았다
- **Pretendard 교체 후 재검수** — 현재 렌더는 IBM Plex Sans KR/JP/Latin 이다.
  `font/family/ko·ja·latin` 변수 3개를 바꾸면 전환되지만 교체 후 레이아웃을 다시 봐야 한다
- 브라우저 실측 — 이 문서의 모든 수치는 Figma 렌더 기준이다
- **P2 페이지 전체 렌더 확인** — 위 정정 후 수치 검사만 돌렸다. 눈으로 본 것은 P3 뿐이다

---

## 7. 다음 페이지로 갈 때

Home 은 이 파일의 **첫 데스크톱 조립**이었다. 여기서 정한 셸 규칙 두 가지는 Home 만의 것이 아니라
셸을 쓰는 모든 페이지에 적용된다.

1. 컨테이너 상한을 넘는 폭에서 헤더·푸터는 뷰포트 전체, 본문만 컨테이너 폭으로 중앙 정렬(`SHELL-34`)
2. 헤더는 폭과 무관하게 자기 패딩 16/8 을 유지한다

`nav-fit 12/16` 은 DestinationPanel 과 Home 목적지 컬렉션에만 승인돼 있다.
**다른 화면으로 자동 확장하지 않는다.** 확장하려면 별도 결정이 필요하다.

`page-title-promoted` 도 마찬가지로 조건 3개를 만족하는 구역에만 쓴다.

남은 페이지 패밀리는 문서 04 · 06 · 08 · 09 · 10 · 11 · 12 · 13 · 14 · 16 · 17 · 18 · 19 이다.

---

## 정정 — 2026-08-28 · 푸터 문구

`OrdinaryFooter` 컴포넌트 기본값이 저장소에 없는 문자열을 담고 있었고, 이 페이지의 인스턴스가
그 값을 상속하고 있었다. 컴포넌트 정의 두 variant 를 저장소 정값으로 고쳐 상속 인스턴스가
전부 따라왔다.

| 슬롯             | 고치기 전                                                       | 고친 뒤 (저장소 키)                                     |
| ---------------- | --------------------------------------------------------------- | ------------------------------------------------------- |
| `footer.privacy` | `Privacy` · `control/latin`                                     | `개인정보처리방침` · `control/ko`                       |
| `home.tagline`   | `© 2026 NosLog · NOSTALGIA 기록·랭킹·아카이브 비공식 팬 서비스` | `© 2026 NosLog · NOSTALGIA 기록 · 랭킹 · 서열 아카이브` |

파일 전체 반영 결과: 상속 인스턴스 `135`개(C8 `2` · P1 `10` · P2 `51` · P3 `22` · P4 `50` ·
Z1 `61` 중 상속분)가 컴포넌트 수정만으로 정정됐고, P2 의 JA·EN 오버라이드 `6`개는 개별로 고쳤다.
푸터 넘침 `0`. `service-notice` 가 `320` 에서 두 줄로 감기는 것은 그 텍스트가 `FILL` + 높이 hug 로
설계된 의도된 동작이며 이번 변경의 회귀가 아니다.

---

## 재정정 — 2026-08-28 · 푸터 서비스 고지 복구

위 「푸터 문구」 정정은 **틀렸다.** 내가 바꾼 세 문자열은 지어낸 값이 아니라
[문서 15](./15-shared-shell-navigation-brief.md) Footer Contract 에 승인돼 있는 서비스 고지였고,
`SHELL-32` 는 「불특정 팬 서비스 표기를 세 로케일 모두에 유지하고 줄이지 말 것」 을 명시한다.
런타임 카탈로그에 없다는 이유로 미승인 문자열이라고 단정한 것이 오판이었다 — 이 고지는 아직
구현되지 않은 2.0 신규 문구다(현재 `components/layout/footer.tsx` 는 `© 2026 NosLog` 만 렌더한다).

**복구값(문서 15 그대로):**

| 로케일 | 서비스 고지                                                                            |
| ------ | -------------------------------------------------------------------------------------- |
| 한국어 | `© 2026 NosLog · NOSTALGIA 기록·랭킹·아카이브 비공식 팬 서비스`                        |
| 일본어 | `© 2026 NosLog · NOSTALGIA の記録・ランキング・アーカイブ非公式ファンサービス`         |
| 영어   | `© 2026 NosLog · Unofficial fan service for NOSTALGIA records, rankings, and archives` |

컴포넌트 기본값 `2` 곳과 인스턴스 `154` 곳을 되돌렸다. **`footer.privacy` 정정은 유지한다** —
`Privacy`/`control/latin` 을 로케일에 맞는 `개인정보처리방침`·`プライバシーポリシー`·`Privacy Policy`
로 바꾼 부분은 저장소 키와 일치하고 문서 15 와도 충돌하지 않는다.
딸림 수정: `OrdinaryFooter` `Layout=Wide` 의 `service-notice` 를 `HUG` → `FILL` 로 바꿨다.
복구한 일본어 고지가 `768` 에서 `546` 이라 한 줄에 안 들어가 넘치고 있었다. 이제 두 줄로 감기며
그 폭에서만 푸터가 `52 → 72` 가 된다. 파일 전체 푸터 넘침 `0`.

---

## Correction — 2026-08-28 · footer layout variant threshold

The `Layout=Wide` / `Layout=Compact` choice was inconsistent across page families:
`P1`, `P4`, and `P5` used Wide at both `768` and `1024`, while `P6` used Compact at both.
[Document 15](./15-shared-shell-navigation-brief.md)'s Footer Contract sets the footer's
content but no width rule, so the inconsistency had no governing decision.

The threshold is now derived rather than assumed, in the same way the Music-detail tab
threshold was: measure what the single row actually needs. A Wide footer row needs
`padding 24 + links + gap 24 + service notice + padding 24`, which resolves to `648` in
Korean, `780` in English, and **`840` in Japanese** — Japanese binds, because its links
group is `222` and its notice is `546`.

**A footer uses `Layout=Wide` at `840` and above, and `Layout=Compact` below it.** This is
a container-query threshold, not a tier boundary: `840` sits inside the Intermediate tier.

Applied file-wide: `24` frames changed variant — `P1` `8`, `P2` `2`, `P4` `4`, and `P5` `8`
moved from Wide to Compact at `768`; `P6` `2` moved from Compact to Wide at `1024`. Every
product page now follows one rule. Footer overflow is `0`, and no frame escapes its
section afterwards.

## Post-handoff correction — 2026-09-01

The four `공지 없음` frames had no viewport floor: `390`/`390 Dark` sat at 804 and
`1280`/`1280 Dark` at 724 with the footer directly under the shortened editorial area.
The 390 pair now holds the 844 floor and the 1280 pair holds **820** — the uniform
height of the twenty other Wide frames, which this page family uses as its desktop
fixture — with `main` filling the remainder. The two 1440 frames were touched in
error during the sweep and restored byte-identically (820, `container standard 1280`
HUG).

## Deep-verification amendment — 2026-09-04

- Destination tiles rebuilt as horizontal icon + label tiles (`HOME-22`): 2 columns on compact
  (173×44 / 138×44 at 320), 4×2 at 768/1024 (inset 12) and 1280 (inset 24, 292×68). 53 zones,
  424 tiles; every label fits at `control` in all locales and widths; zone height 212 at 390.
- Search-preview popover edge now uses `border/overlay` (Light invisible, Dark visible).

## Amendment — 2026-09-06 · `HOME-23` grid restored

All 57 Home frames: the destination zone is again an icon-over-label grid — 3 columns at
compact (111×72 at 390, 88×72 at 320), 4 columns of 148×96 inside a 640 bounded column at
768 / 1024 / 1280 / 1440. Tiles are FIXED-width columns with HUG height; the short last row is
left-aligned. Labels re-ran the `HOME-21` cascade (control 453 · nav-fit 3 · wrap 0, overflow 0).
Section containment 0 · overlap 0 · scoped audits (Compact 390, Wide 1280, 320/locale) clean.
Knock-on to re-check in implementation: the keyboard-state dynamic-row worst case — the zone is
now three rows (240) instead of four short rows (212) at 390, so the number of preview rows that
fit above the handoff changes.
