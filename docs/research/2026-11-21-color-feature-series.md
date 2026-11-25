# 그래프 계열 · 비교 색 — 기능 6개 따로 실측 (C 무리)

2026-11-21–22. 공통 층 3단계 색 파운데이션의 차트 색을 기능별로 다시 짜는 일의 C 무리(그래프 계열 · 비교) 재료다. 기능 여섯을 따로 쟀다: P1 성장 추이 선 · D17 최근 판정 추이(고른 지표 한 줄) · D18 FAST · SLOW 두 줄 비교 · D20 점수 향상 선 · T5 서열표 가중치 선 · E2 검정 「합격까지」 곡별 조각 막대. 잰 값과 곳 수만 둔다. 추천 · 판단은 적지 않는다.

## 재는 법

- 실제 서비스: headless Playwright 1.61.1(Chromium), 1440×900, `colorScheme: 'dark'`, `permissions: []`, `locale: ko-KR`, 로그인 없음. 열기 전마다 `~/noslog-research/wait-capacity.sh`, 브라우저 하나에 페이지 하나.
- 값: SVG 는 `getComputedStyle`, 캔버스는 `fillStyle` · `strokeStyle` 설정자를 감싸 모은 값, 못 잡으면 캡처 픽셀(「픽셀」). 대비는 WCAG 2, 차트 면 기준, 투명은 섞은 색.
- 디자인 시스템: 공식 문서 · 공식 패키지 파일을 읽음(코드 실행 없음). 팔레트 값은 [차트 색](./2026-11-20-color-chart.md)에 있어 다시 적지 않고 기능별 지침만 모았다.
- 이미 잰 곳은 다시 재지 않았다. [차트 색](./2026-11-20-color-chart.md)의 개인 추이 선 9곳(OP.GG 롤 티어 그래프 · DEEPLOL · YOUR.GG · osu! · Chess.com · Quaver · Mobalytics · Blitz · TETR.IO)과 두 계열 비교 3곳(YOUR.GG 나 · 평균 · Cloudflare Radar 지난 기간 · CoinMarketCap 두 줄)은 그 기록의 값을 그대로 셌다.
- 캡처 · 원문: 공유 메모 폴더 `common-layer/stage3/color/feature-research/C-series/`(`caps/p1-korea/` · `caps/p1-global/` · `caps/d17-d18/` · `caps/t5-e2/`, 원문 `parts/*.md`). 커밋하지 않는다.
- 캡처를 직접 열어 대조한 곳(이 기록을 쓴 세션): EloBoard(ELO 선 보라 = 「로그인」 버튼) · 메이플 히스토리(누적 경험치 선 노랑 = 「정보 갱신」 버튼) · ScoreSaber(순위 선 파랑) · V-ARCHIVE(흰 바탕 그림 위 주황 곡선) · GitHub 언어 막대(6조각 + 원 점 범례). SAP Horizon 다크 `sapChart_OrderedColor_1–5` 는 공식 테마 CSS 1579–1583행을 직접 열어 확인했다. 나머지 곳의 「캡처 확인」 은 잰 서브에이전트가 연 것이다.
- D17 · D18 실측은 master 지시로 2026-11-22 에 멈췄다. 멈출 때까지 기록된 곳만 센다.

## 센 곳

| 기능                 | 국내 다크 | 해외 다크 | 합  | 디자인 시스템 · 라이브러리           | 라이트만 · 막힘(세지 않음) |
| -------------------- | --------- | --------- | --- | ------------------------------------ | -------------------------- |
| P1 성장 추이 선      | 8         | 18        | 26  | DS 11 · 라이브러리 3                 | 라이트만 24 · 막힘 29      |
| D20 점수 향상 선     | 0         | 0         | 0   | (P1 지침과 같음)                     | ScoreSaber Reloaded 막힘   |
| D17 고른 지표 한 줄  | 0         | 13        | 13  | DS 6                                 | 막힘 4(Kamaitachi 등)      |
| D18 두 계열 비교     | 0         | 14        | 14  | DS 13                                | 같음                       |
| T5 설명 속 계산 곡선 | 1         | 3         | 4   | DS 3 · 라이브러리 8 · 참고선 지침 10 | 열어 본 곳 21              |
| E2 항목별 조각 막대  | 0         | 7         | 7   | 여러 조각 부품 5 · 지침 12           | 열어 본 곳 67(국내 22)     |

- 모든 기능이 목표(실제 서비스 30곳 · 국내 15곳)에 못 미친다. P1 은 26곳, 나머지는 「근거 약함」.
- 국내 다크 전적 · 기록 사이트는 대부분 라이트만이거나(롤체지지 · 메이플지지 · 닥지지 · FOW.LOL 등) 다크여도 시간 선이 없었다(solved.ac · OP.GG 발로란트 등).

## P1 성장 추이 선 (내 값 한 줄)

26곳의 꼴:

| 꼴                                  | 곳 수 | 곳                                                                                                                                                                                                     |
| ----------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 유채색 한 색 = 브랜드색(주 버튼) 값 | 7     | 국내 4(OP.GG 롤토체스 종합 탭 `rgba(60,123,255,.9)` · EloBoard `#8b6bff` · 메이플 히스토리 `#ffc107` · YOUR.GG `#fd6505`) · 해외 3(ScoreSaber `#3aa6e4` · AccSaber `#f5b800` · gatari `#66b5ff`)       |
| 유채색 한 색 · 브랜드색과 다른 값   | 9     | OP.GG 롤 `#fa576f` · osu! `#ffcc22` · Chess.com `#83defc` · Quaver `#44d6f5`(링크색과 같음) · Mobalytics `#40c0de` · TETR.IO `#a3d391` · Bokutachi `#4974a5` · tactics.tools `#52a9ff` · OGS `#329be0` |
| 유채색 한 색 · 브랜드색 미확인      | 3     | 츄츄지지 `rgba(75,192,192,.8)` · Hitbloq `#0099db` · Akatsuki `#a517f7`(버튼이 무채색)                                                                                                                 |
| 회색 선 + 점만 강조색               | 1     | Blitz(선 `#353940` · 점 `#f4c874`)                                                                                                                                                                     |
| 구간(티어) 색으로 선을 나눠 칠함    | 2     | DEEPLOL(티어 11색) · MetaTFT(점마다 티어 색)                                                                                                                                                           |
| 차트 · 계열마다 다른 색             | 4     | 메이플로드(전투력 주황 · 유니온 청록 · 등급 점수 보라) · BeatLeader(Rank `#3e95cd` · PP `#007100`) · SC2 Pulse(종족 색) · lishogi(종목마다 Okabe–Ito 색)                                               |

- 흰색 · 글자색 한 색으로 선을 그린 곳은 0곳이다(무채색 선은 Blitz 회색 선 하나, 이때도 점은 금색).
- 같은 서비스 안 짝: OP.GG 롤토체스는 같은 쪽 두 선이 브랜드 파랑 · 하늘색으로 다르다. AccSaber 는 AP 선이 분류 탭 색(노랑 · 초록 · 빨강)을 따라간다. tactics.tools 는 선은 파랑, 점은 등수 색.
- 대비(차트 면 기준): 2.17(DEEPLOL 아이언 구간)–13.15(Chess.com). 3:1 아래는 Bokutachi 2.97 · DEEPLOL 낮은 티어 · SC2 Pulse 테란 · 저그.

디자인 시스템 지침(11곳 + 라이브러리 3):

- 브랜드색: Atlassian `color.chart.brand`(다크 `#4688EC`) 1곳.
- 계열 하나 전용 값: Polaris Viz `single`(다크 `#3672bb`) · Carbon 「1-Color group」(purple-30 · blue-50 · cyan-40 · teal-40 중 하나) 2곳.
- 범주 1번: Fluent `#637cef` · Elastic `#16C5C0` · Grafana `#73BF69` · G2 `#1783FF` · ONS `#206095` · GitLab `data-blue.500`, 라이브러리 ECharts `#5070dd` · Highcharts `#2caffe` · Chart.js 파랑.
- 같은 측정값은 한 색: Salesforce. 일반 그래프에 브랜드 · UI 색을 쓰지 말라: Warp.

## D20 점수 향상 선 (곡 하나의 내 점수 한 줄)

- 다크 실제 서비스 0곳. 곡 · 맵 단위 점수 추이를 로그인 없이 보여 주는 화면을 국내 · 해외 모두 찾지 못했다. Bokutachi 의 곡 「Play History」 는 표 목록, ScoreSaber Reloaded(맵별 점수 기록 그래프가 있다고 알려진 곳)는 막힘, BeatLeader 점수 상세에는 기록 추이가 없음(미확인).
- 그래서 P1 선과 같은 색인지 다른 색인지 짝은 미확인이다. 지침은 P1 과 같은 「계열 하나」 지침뿐.

## D17 고른 지표 한 줄

13곳(모두 해외). 지표를 고르는 방식이 둘로 나뉜다.

| 방식                                | 곳 수 | 지표를 바꿀 때 선 색                                                                                                                                                                                                                                                                                                 |
| ----------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 하나만 고름(탭 · 칸 · 드롭다운)     | 7     | 한 색 그대로 4(Token Terminal `#1affab` · OpenPanel `#2563eb` · GitHub Contributors `#0576ff` · Liwan `#a6cee3`) · 지표마다 색 2(ScoreSaber 순위 `#3aa6e4` · PP `#5048e5` · 정확도 `#16a249` · 플레이 수 `#2a9d90` / Akatsuki Rank `#a517f7` · PP `#2c97fb`) · 지표가 아니라 오름 · 내림 색 1(CoinGecko 빨강 · 초록) |
| 여러 개를 켜고 끔(범례 · 체크 · 칸) | 6     | 6곳 모두 지표마다 고정 색(BeatLeader · Fathom · Simple Analytics · AccSaber · Swetrix · Databuddy)                                                                                                                                                                                                                   |

- 지표마다 색인 곳은 고른 칸 면 · 탭 글자 · 축 이름 글자도 그 지표 색으로 칠했다(ScoreSaber 탭 면 · 축 이름, AccSaber 탭 글자, Simple Analytics 체크 상자).
- 국내: 메이플 히스토리는 지표 60여 개를 골라 보는 선이지만 바꿨을 때 색은 재지 않았다(미확인). 국내에서 지표를 바꿔 본 곳은 0.
- 리듬게임 판정 추이(◆JUST 수 · MISS 수 같은 판정 지표)를 고르는 그래프는 찾지 못했다. 리듬게임 쪽 근거는 ScoreSaber · Akatsuki · AccSaber · BeatLeader 의 순위 · PP · 정확도 지표다.
- 디자인 시스템 6곳: 지표 전환을 직접 다룬 곳 0. 「같은 지표는 모든 차트에서 같은 색」(Salesforce · ONS · Elastic · Carbon 순서 고정 · Warp 주색 하나 · Grafana 이름마다 고정 방식).

## D18 두 계열 비교 + 범례

14곳(모두 해외, 새로 잰 11 + 기록 3).

| 짝의 꼴                                 | 곳 수 | 곳 · 값                                                                                                                                                                                               |
| --------------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 주 계열 유채색 + 다른 쪽 회색 · 흐린 색 | 5     | Fathom(이번 지표색 / 지난 기간 `#2f3631`) · OpenPanel(`#2563eb` / 흰 40%) · Monkeytype(wpm `#e2b714` / raw `#646669`) · YOUR.GG(나 `#fd6505` / 평균 `#999999`) · CoinMarketCap(`#3861fb` / `#a6b0c3`) |
| 같은 색, 다른 쪽은 투명도 · 점선        | 2     | Swetrix(같은 파랑 40%) · Cloudflare Radar(같은 색 점선)                                                                                                                                               |
| 범주색 두 개                            | 3     | CoinGecko(BTC `#f09d4e` / ETH `#963487`) · Token Terminal(`#1affab` / `#4869ef`) · mempool(해시레이트 `#ffb300` / 난이도 `#d81b60`)                                                                   |
| 빨강 · 파랑 짝(왼손 / 오른손)           | 2     | BeatLeader(선 `#ff8888` / `#8888ff`) · ScoreSaber(`#ef4444` / `#3b82f6`). 두 곳 모두 리듬게임(Beat Saber) 점수 상세                                                                                   |
| 증감 초록 · 빨강(0 위아래 막대)         | 1     | GitHub Code frequency(`#2f6f37` / `#eb3342`)                                                                                                                                                          |
| 짝이 데이터에서 옴(팀색)                | 1     | FotMob(두 팀 팀색)                                                                                                                                                                                    |

- 범례(새로 잰 11곳): 점 + 글자 4(CoinGecko · Token Terminal · Swetrix · mempool 칩) · 네모 + 글자 1(GitHub) · 차트 안 범례 없음 6(BeatLeader · Fathom · OpenPanel · Monkeytype · FotMob · ScoreSaber, 옆 숫자 · 원형 점수 · 글로 읽음).
- 리듬게임 FAST · SLOW(EARLY · LATE) 색은 재지 못했다. Kamaitachi(IIDX FAST/SLOW)는 로그인 벽. 리듬게임 두 방향 짝으로 잰 것은 위 왼손 · 오른손 빨강 · 파랑 2곳뿐(미확인 · 근거 약함).
- 국내: 메이플로드 등급 점수 선 옆 비교 점선 `rgba(147,197,253,.8)` · 메이플 히스토리 둘째 계열 `#26a69a` 가 있으나 무엇의 비교인지 미확인이라 세지 않았다.
- 디자인 시스템 13곳: 비교 계열 회청색 점선 · 면 없음(Polaris Viz 다크 `rgba(144,176,223,.8)`) · 지난 기간 회색(SAP IBCS 다크 `#576f86` · Warp `Line/Secondary` 점선 · Atlassian `chart.neutral` `#7E8188`) · 강조 하나만 색 · 나머지 회색(ONS) · 명도가 다른 짝(Terra) · 선 모양으로 가름(Primer) · 발산 팔레트(Carbon · GitLab · Elastic · Grafana).

## T5 설명 속 계산 곡선 한 줄

- 다크 쪽에서 잰 곳 4(국내 1 · 해외 3), 모두 그림(png). 선 하나는 2곳: V-ARCHIVE 티어 안내 「획득 포인트」(흰 바탕 그림 위 주황, 픽셀 `#c7824d`) · Chunithm English Guide 「Gain vs. Score」(흰 바탕 그림 위 `#4285f4`). 두 계열 2곳: Chess.com Elo 설명 그림(주황 · 노랑 면) · osu! 뉴스 별점 계산식(Before `#66ccff` / After `#ff9966`).
- 다크 화면 안에 흰 바탕 그림을 그대로 박은 곳이 선 하나짜리 2곳 모두다.
- 라이브러리 첫 계열 기본값 8: Recharts `#3182bd` · ECharts `#5070dd` · Chart.js `rgb(54,162,235)` · Highcharts `#2caffe` · Plotly `#1f77b4` · Vega `#4c78a8` · MUI X 다크 `#495AFB` · Nivo `#e8c1a0`(파랑 계열 7).
- 참고선 · 주석선 지침 10곳: 회색(Atlassian `#7E8188` · Polaris Viz `#909099` · Elastic `#98A2B3` · Highcharts 다크 `#727272` · G2 `#416180` 45% · Spectrum gray-500 점선) · 임계선 빨강 점선(Carbon `#fa4d56`) · 계열 색을 이어받음(ECharts · Spectrum 추세선) · 색 지정 없음(Primer · Codex).
- 근거 약함(실제 서비스 4곳, 열어 본 곳 21).

## E2 항목별 조각 막대 + 범례

- 다크 실제 서비스 7곳(국내 0, 열어 본 곳 67 중 국내 22).

| 조각 색의 출처             | 곳 수 | 곳                                                                                                       |
| -------------------------- | ----- | -------------------------------------------------------------------------------------------------------- |
| 항목마다 정해진 색(언어색) | 4     | GitHub · Codeberg · Gitea · GitLab(모두 Linguist 언어색, 예 JavaScript `#f1e05a` · TypeScript `#3178c6`) |
| 범주 팔레트 순서           | 1     | ewgf.gg(`#199e70` · `#c98500` · `#3987e5` · `#d95926` · `#9085e9` · 나머지 회색)                         |
| 뜻 색(평가 등급)           | 1     | RAWG(초록 · 파랑 · 주황 · 빨강, 조각마다 그라데이션)                                                     |
| 상태 분류 색               | 1     | Pontoon(번역 상태 5색)                                                                                   |

- 조각 사이: 틈 약 2px 3(GitHub · Gitea · ewgf.gg) · 틈 없음 1(Codeberg) · 미확인 3(GitLab · RAWG · Pontoon). 범례: 원 점 + 이름 + % 3(GitHub · Codeberg · Gitea) · 둥근 네모 + 수 + % 1(ewgf.gg) · 원 점 + 개수 1(RAWG) · 머리에 네모 색칸 1(Pontoon) · 범례 없음 툴팁만 1(GitLab).
- 높이 3–11px(RAWG 50 은 큰 막대).
- 디자인 시스템 · 부품: 여러 조각 부품 5(Primer `ProgressBar.Item` 틈 2 · 빈 칸 `#3d444d` / Carbon 비례 미터 구분 2 · 빈 칸 `#262626` / Mantine 복합 / Tremor CategoryBar 틈 2 / Ant Design 2조각). 지침 12곳: 조각 틈 2px(Carbon · Primer · Polaris Viz) · 3px(Fluent) · 1px 면색(GitLab · Highcharts) · 틈 또는 반전 테두리(Atlassian) · 범례 · 색 5개까지(Codex · ONS · Salesforce) · 나머지 조각 회색(Spectrum).
- 근거 약함(7곳, 국내 0).

### 합격선 · 초과 표현(가벼운 실측, 2026-11-23)

- 목표선이 있는 다크 공개 화면은 못 찾았다. 실제 서비스 다크 1곳(Grafana), 디자인 시스템 4곳(캡처 확인, 문서 사이트라 라이트 3). 근거 약함.
- 갈래 셋(곳 수는 캡처로 확인한 것만).
    - 조각 + 눈금 글자, 선 없음 3곳: Tremor Category Bar(0 · 55 · 85 · 100 글자를 막대 위에, 조각 사이 약 1px 틈) · Dubai Digital 기대 수준 막대(5조각 틈 약 2px, 단계 이름 위 글자) · Hightouch 단계 막대(조각 4, 사이 틈 약 4px, 조각 안은 완료 · 대기 두 톤). Primer 여러 조각(1px 틈 + 범례)도 같은 갈래.
    - 임계값 구간 색 1곳: Grafana Play 막대 게이지(임계값마다 막대 색이 바뀌고 선은 없음. 값이 끝을 넘으면 막대는 가득 차고 숫자만 큼).
    - 목표 마커 선: 문서 글로만 확인, 캡처 미확인. Looker · Qlik 불릿 차트는 목표를 막대 위 마커 선으로 그림.
- 초과분: 막대가 선을 지나 이어지는 실측은 없음. Crowdfunder 도움말만 목표 초과분을 다른 색으로 칠한다고 적음(캡처 미확인).
- 조각 경계와 목표선이 겹치는 곳: 캡처에서 못 봄(조각 막대는 경계가 곧 단계 표시). Dynatrace 미터 막대는 임계값을 막대 아래 구간 막대로 그린다고 문서에 적혀 있으나 데모가 headless 에서 그려지지 않아 미확인.
- 캡처: `side-session-notes/…/feature-research/exam-bar/` 의 `grafana-*` · `tremor-categorybar` · `hightouch-tiered` · `dubai-levels` · `primer-segments`.

## 같은 값이 나온 곳 (사실)

- SAP Horizon 다크 `sapChart_OrderedColor_1–5` = `#3278be` · `#f2a634` · `#b4ce35` · `#fa4f96` · `#8b47d7`. NosLog 지금 E2 다섯 색과 순서까지 같고, T5 `#3278be` · P1 · D20 · D18 SLOW `#f2a634` 와도 같다. 출처 SAP 공식 GitHub `theming-base-content` 다크 테마 CSS 1579–1583행. 라이트 값은 다르다(`#168eff` · `#c87b00` · `#75980b` · `#df1278` · `#8b47d7`).
- ewgf.gg 조각 다섯 색은 CoinGlass 변수 `--glass-chart-s1…s5`([차트 색](./2026-11-20-color-chart.md) CoinGlass 줄)과 같은 값이다.
- BeatLeader Rank 선 `#3e95cd` 는 Chart.js 예제 기본값과 같은 값이다(잰 서브에이전트 보고, 미확인).

## 당근 SEED 3.2.1 다크 · 이미 정한 값으로 옮길 때의 사실

- 이미 정한 역할이 쓰는 SEED 700 단계: blue-700 `#41a2f9` = 상태 안내 · green-700 `#22b27f` = 성공 · yellow-700 `#ca901c` = 경고 · red-700 `#ff6e60` = 위험 · `map-pin`. 이미 정한 강조 면은 neutralSolid `#f3f4f5`(유채 브랜드색을 쓰지 않음). 결정되지 않은 SEED 유채 단계: carrot 전 단계(SEED 안의 `fg-brand` 는 carrot-700 `#f60`) · purple 전 단계 · 나머지 갈래의 600 · 800 등.
- 회색: gray-600 `#868b94`(자리표시자) · gray-700 `#b0b3ba`(글자 3단) · gray-500 `#5b606a`(비활성) 이 이미 역할이 있다.
- 같은 단계 6갈래끼리 대비는 1.00–1.09(600 · 700 · 800, [차트 색](./2026-11-20-color-chart.md) 12-3 절). SEED 에는 청록 · 분홍 · 연두 갈래가 없다.
- 기능별로 꼴을 옮길 때:
    - P1 · D20 「브랜드색 한 색」 꼴: NosLog 의 강조는 `#f3f4f5` 라 이 꼴을 옮기면 흰 선이 된다. 흰 · 글자색 선을 쓴 실제 서비스는 0곳(26곳 중).
    - P1 · D20 「유채 한 색」 꼴: SEED 유채 단계로 새 값 없이 그릴 수 있다. 결정되지 않은 갈래는 carrot · purple.
    - P1 「구간 색」 꼴: NosLog 등급 구간 색(B 무리 P3 `grade-band-*`)을 빌리는 꼴이라 B 무리 결과에 달렸다.
    - D17 「지표마다 색」 꼴: ◆JUST · MISS 는 판정 색(게임 색, 그대로 두기로 정함)이 있다. 판정 토큰 MISS 는 `#b4b4b4` 회색이고, 지금 D17 MISS 선은 판정 토큰이 아니라 `feedback-destructive` 를 쓴다(FEATURES.md D17 줄).
    - D18 「주 계열 + 회색」 꼴: SEED 회색 단계로 새 값 없이 된다. 「같은 색 투명도」 꼴: SEED 에 유채색 투명 단계가 없다(투명은 gray-alpha 만).
    - D18 「빨강 · 파랑 짝」 꼴: SEED red-700 · blue-700 은 위험 · 안내로 이미 쓰인다. 600 · 800 단계는 비어 있다.
    - T5 「참고선 회색」 꼴: SEED 회색으로 새 값 없이 된다.
    - E2 「범주 팔레트」 꼴: 곡 다섯에 SEED 갈래 여섯을 쓸 수 있으나 같은 단계끼리 명도가 거의 같다(대비 1.00–1.09). 「항목마다 정해진 색」 꼴은 NosLog 곡에 정해진 색이 없어 옮길 대상이 없다.

## 근거 약함 · 미확인

- 근거 약함: 여섯 기능 모두(30곳 목표 미달). 특히 D20(0곳) · T5(4곳, 모두 그림) · E2(7곳, 국내 0) · D17 · D18(국내 0).
- 미확인: 리듬게임 FAST · SLOW 색(Kamaitachi 로그인 벽) · 곡 단위 점수 추이 색(D20) · 메이플 히스토리 지표를 바꿀 때 색 · 메이플로드 비교 점선의 뜻 · 로고 브랜드색(모든 곳, 주 버튼 값만 잼) · Swetrix Session duration 선 · AccSaber Ranked Plays 선 · Adobe Spectrum · SAP Fiori · Material 데이터 시각화 지침 원문(막힘).
- 조사 중 실수 하나: T5 · E2 후보 목록에 개인 계정 주소가 하나 잘못 들어갔다가 실행 전에 빠졌다(열지 않음, 결과에 0건).

## 곳마다

아래는 결과 원문 다섯 파일을 제목 단계만 내려 그대로 옮긴 것이다(캡처 경로는 공유 메모 폴더 `common-layer/stage3/color/feature-research/C-series/` 기준).

### P1 · D20 국내 실측 (2026-11-22)

#### 머리

- 다크로 잰 곳(국내): P1 5곳 — OP.GG 롤토체스 · EloBoard · 츄츄지지 · 메이플 히스토리 · 메이플로드. D20 0곳(곡 · 맵 · 문제 하나의 내 점수 추이를 공개로 보여 주는 국내 다크 화면을 찾지 못함). 해외 0(이 묶음은 국내만).
- 목표 15곳에 못 미침. 국내 전적 사이트 대부분이 라이트이거나, 다크여도 시간 선이 없거나, 막혔다(아래 목록).
- 다크인데 P1 · D20 이 없어 세지 않은 곳(10): OP.GG 발로란트(Rating 카드 · 액트 칸만, 랭크 선 없음) · OP.GG 오버워치(표 · 숫자) · OP.GG 마블 라이벌즈(연 프로필 2곳 모두 「비공개 프로필입니다」) · DAK.GG 발로란트(최근 승패 칸) · DAK.GG 데드락(공개 프로필 링크를 못 찾음) · solved.ac(새 다크 화면, 「레이팅」 탭은 숫자 · 상위 100문제 칸 · 태그 레이더 · 난이도 원, 시간 선 없음) · 메애기(성향 레이더만) · 메소지지(장비 · 수치만) · 던담(캐릭터 쪽 차트 없음) · 펌프 잇 업 공식(다크, 개인 기록 쪽은 로그인)
- 라이트만(10, 차트 색을 재지 않음): OP.GG 배틀그라운드 프로필 · 닥지지 이터널 리턴 플레이어(RP 캔버스 선 있음, 다크 전환 없음) · 롤체지지 프로필(LP 그래프 있음) · 메이플지지 캐릭터(캔버스 2) · 포로지지 · 한국기원 기사랭킹 · oj.uz 프로필 · 서든어택 병영수첩 · 로펙 · LoaCalc
- 막힘(3): fconline.gg 공식경기 선수 쪽(「잠시 접속을 확인할게요」 확인 창) · 메이플스카우터 캐릭터(Cloudflare 보안 확인) · 펌프 잇 업 펌빌리티 랭킹(로그인 벽). solved.ac 는 한 번 Cloudflare 확인 창이 떴고(`caps/p1-korea/solvedac-captcha.png`) 다른 때는 열려 「다크인데 없음」 으로 셈(`solvedac.png` · `solvedac-rating.png` · `solvedac-full.png`)
- 주소가 죽었거나 다른 사이트로 넘어감(세지 않음): tod.gg(도박 사이트로 넘어감) · mapleutils.com(설문 사이트) · kart.gg(도메인 판매) · karing.kr · maplehub.kr · erbs.kr · lolog.me · kartdrift.gg(주소 없음) · loa.gg(주소 없음) · lostark.gg · mokoko.gg(시간 초과)
- 국내가 아니라 뺀 곳: fifaaddict.com(태국어) · rewind.lol(해외 롤 서비스)

#### 곳마다

##### 1. OP.GG 롤토체스(TFT) 소환사 (국내 · 다크)

- URL: https://op.gg/ko/tft/summoners/kr/클레스메이트-KR1 · 확인 2026-11-22 · 늘 다크(`html.dark.opgg-kit-dark`)
- 바탕 `rgb(28,28,31)` · 차트 면(카드) `rgba(40,40,48,0.8)` → 섞인 색 픽셀 `rgb(38,38,45)`
- 브랜드색: 「전적 갱신」 주 버튼 `rgba(60,123,255,0.9)`
- 기능: P1 두 군데. (가) 종합 탭 「랭크」 카드 LP 추이 영역 선(Recharts) (나) 「티어 그래프」 탭 큰 선 그래프
- (가) 꼴: 브랜드색 한 색. 선 `rgba(60,123,255,0.9)` 2px(버튼과 같은 값) · 아래 면 그라데이션 같은 색 불투명 0.25 → 0, 면 `fill-opacity 0.6`. 격자 세로 점선 `rgba(255,255,255,0.05)` 1px `2px 3px`. 축 글자 없음. 가리킴: 흰 점 + 검정 말풍선 「챌린저 1,877 LP」. 대비(카드 섞인 색 대비): 3.43 : 1
- (나) 꼴: 브랜드와 다른 밝은 하늘색 한 색. 선 · 점 테두리 `rgb(91,191,255)` 2px(선은 픽셀, 점은 계산값), 점 속 카드색 `rgba(40,40,48,0.8)`, 점마다 티어 아이콘 + 「C 1698 LP」 글자, 아래 축 날짜 · 게임 수. 가리킴: 캡처상 바뀐 것 없음(미확인). 대비 7.40 : 1
- 같은 서비스 안 짝: 순위 분포 막대는 등수 색(1위 `rgb(235,156,0)` 금 · 2위 `rgb(154,164,175)` 은 · 3위 `rgb(168,138,103)` 동 · 나머지 회색). 같은 쪽 안 두 LP 선 색이 다르다(파랑 · 하늘)
- 범례 없음. 빈 값 미확인
- 캡처: `caps/p1-korea/opgg-tft.png` · `opgg-tft-hover.png` · `opgg-tft-tiergraph.png` · `opgg-tft-tiergraph-hover.png` (캡처 확인)

##### 2. EloBoard 스타크래프트 선수 (국내 · 다크)

- URL: https://eloboard.com/players/32 (이재호) · 확인 2026-11-22 · `colorScheme: dark` 로 `html[data-theme=dark]`(머리에 달 전환 단추 있음)
- 바탕 `rgb(13,17,19)` · 차트 면(카드) `rgb(22,27,30)`
- 브랜드색: 「로그인」 · 검색 단추 `rgb(139,107,255)` = 변수 `--brand-500 #8b6bff`. 차트 변수 `--chart-up #5b87e4` · `--chart-down #d65a66` · `--chart-flat #6e7b85`(이 선에는 안 씀)
- 기능: P1 「ELO 추이 · 최근 30경기」 (SVG polyline)
- 꼴: 브랜드색 한 색. 선 `rgb(139,107,255)` 3.5px(= `--brand-500`), 면 없음. 점은 처음 · 가운데 · 끝 3개만 테두리 `rgb(139,107,255)` 2.5px · 속 카드색 `rgb(22,27,30)` · r5. 격자 가로 실선 `rgb(32,38,41)` 1px. 축 글자 `rgb(124,136,145)`(ELO 4칸 · 날짜 3칸). 가리킴: 마우스를 올려도 캡처상 바뀐 것 없음
- 대비(카드 대비): 선 4.67 : 1 · 축 글자 4.78 : 1 · 격자 1.13 : 1
- 같은 서비스 안 짝: 승 · 패 숫자와 최근 10경기 칸은 승 파랑 · 패 빨강 계열(캡처). 개인 선만 브랜드 보라
- 범례 없음. 빈 값 미확인
- 캡처: `caps/p1-korea/eloboard.png` · `eloboard-chart.png` · `eloboard-hover.png` (캡처 확인)

##### 3. 츄츄지지 chuchu.gg 메이플 캐릭터 「히스토리」 (국내 · 다크)

- URL: https://chuchu.gg/char/오지환 → 「히스토리」 탭 · 확인 2026-11-22 · 늘 다크(MUI 다크, 전환 못 찾음)
- 바탕 `rgb(21,23,27)` · 차트 면(카드) 계산값 `rgb(26,32,39)`, 캡처 픽셀 `rgb(38,43,50)`(MUI 겹침 밝기)
- 브랜드색: 로고 「.gg」 · 주 버튼에 유채색 없음(「로그인」 `rgb(189,189,189)` 회색 면). 브랜드 유채색 미확인
- 기능: P1 네 개(Chart.js 캔버스) — 경험치 히스토리(막대 · 이 캐릭터는 Lv.300 이라 0%) · 레벨 히스토리 · 전투력 히스토리 · 유니온 히스토리
- 꼴: 유채색 한 색, 모든 히스토리 차트가 같은 색. 선 `rgba(75,192,192,0.8)` 3px · 점 `rgb(75,192,192)`(Chart.js 문서 예시 청록과 같은 값) · 점마다 값 글자. 격자 · 축 선 `#555` 1px · 글자 `#bdbdbd`. 면 없음. 가리킴: 캡처상 말풍선 안 뜸(미확인)
- 대비(카드 픽셀 대비): 선 픽셀 `rgb(68,163,164)` 4.76 : 1 · 글자 7.58 : 1 · 격자 1.91 : 1
- 같은 서비스 안 짝: 네 히스토리 모두 한 색. 범례 없음. 빈 값: 경험치 0% 칸이 막대 없이 「0.000%」 글자만
- 캡처: `caps/p1-korea/chuchu.png` · `chuchu-history.png` · `chuchu-history-hover.png` (캡처 확인)

##### 4. 메이플 히스토리 maplehistory.kr 캐릭터 「히스토리」 (국내 · 다크)

- URL: https://maplehistory.kr/character/e39f3066e9e969f077e0e2419dee386d (오지환) · 확인 2026-11-22 · 늘 다크(Bootstrap 다크, 전환 못 찾음). 쪽 위에 흰 광고 상자가 끼어 있음
- 바탕 `rgb(0,0,0)` · 카드 `rgb(33,37,41)` · 차트 면(캔버스) `#000000`
- 브랜드색: 「정보 갱신」 · 「히스토리 갱신」 주 버튼 `rgb(255,193,7)`(Bootstrap warning 값) · 글자 검정
- 기능: P1 — 고른 지표 하나의 날짜별 선(TradingView lightweight-charts 캔버스). 아래 고르기 칸에서 지표 60여 개(레벨 · 누적 경험치 · 인기도 · 무릉 · 유니온 · 랭킹 · 심볼 · 스탯 등)를 바꿔 봄. 기본 「누적 경험치」
- 꼴: 브랜드색 한 색. 선 `#ffc107` 3px(버튼과 같은 값, 픽셀도 `rgb(255,193,7)`). 둘째 계열 `#26a69a` 청록(오른쪽 값 표 「0」, lightweight-charts 기본 막대색과 같은 값) — 이 캐릭터는 0 이라 막대 안 보임. 격자 가로 · 세로 `#495057` 1px. 축 글자 `#dee2e6`, 차트 안 큰 글자 「누적 경험치」. 가리킴: 세로 점선 십자선 + 선 위 노란 점 + 아래 날짜표 「2026/09/21」 + 오른쪽 값표(면 `#2B2B43`)
- 지표를 바꾸면 선 색이 바뀌는지: 미확인(고르기 칸을 바꾸지 않음)
- 대비(차트 면 `#000` 대비): 선 12.88 : 1 · 청록 7.00 : 1 · 글자 16.13 : 1 · 격자 2.57 : 1
- 범례 없음(차트 안 지표 이름 글자로 대신). 빈 값 미확인. 아래 날짜별 표가 같은 값을 숫자로 보여 줌
- 캡처: `caps/p1-korea/maplehistory.png` · `maplehistory-chart.png` · `maplehistory-hover.png` (캡처 확인)

##### 5. 메이플로드 mapleroad.kr 캐릭터 (국내 · 다크)

- URL: https://mapleroad.kr/character/갸루동숙 → 「히스토리」 탭 · 확인 2026-11-22 · `colorScheme: dark` 로 다크(머리에 해 · 달 전환 단추, 켜진 상태 주황 `rgb(255,152,0)`)
- 바탕 `rgb(34,34,34)` + 배경 그림 · 차트 면 픽셀 `rgb(38,43,49)`(계산값 `rgba(0,0,0,0.2)` 겹침)
- 브랜드색: 로고 「로드」 글자 픽셀 `rgb(255,127,80)` 산호 · 「OnAir」 산호 테두리. 주 버튼은 Bootstrap 기본(「새로고침」 `rgb(25,135,84)` 초록 · 「링크복사」 `rgb(13,110,253)` 파랑)
- 기능: P1 여러 개(Chart.js 계열 캔버스). 전투력 히스토리(선) · 유니온 레벨 히스토리(선) · 등급 추이(자체 점수 선 + 비교 점선) · 경험치 히스토리 / 레벨 히스토리 / 일일 경험치(알약 단추로 바꿔 보는 막대) · 요약 탭 경험치 히스토리(최근 10일 막대)
- 꼴: 차트마다 다른 유채색 한 색(계열마다 색). 전투력 선 `rgb(255,168,76)` 주황 + 같은 색 옅은 면 · 유니온 선 `rgb(89,196,160)` 초록 + 옅은 면 · 등급 점수 선 `rgb(196,132,252)` 보라 + 옅은 면, 비교선 「다이아몬드 컷」 `rgba(147,197,253,0.8)` 점선 · 경험치 막대 `rgb(242,250,0)` 노랑. 선 두께는 캔버스 기록상 2px · 1.5px(어느 선인지 미확인). 점마다 흰 테두리 점 + 값 글자. 격자 `rgba(255,255,255,0.12)` · `0.08`, 축 글자 `rgb(190,198,210)` · `rgb(180,180,180)`. 범례: 등급 추이만 네모 + 점선 네모 「점수 · 다이아몬드 컷」
- 경험치 히스토리를 바꿔 보는 단추(경험치 · 레벨 · 일일)는 고른 것이 청록 알약 면, 막대 색은 노랑 그대로(일일은 미확인)
- 대비(면 픽셀 대비): 주황 7.44 · 초록 6.68 · 보라 5.47 · 노랑 12.53 · 비교 점선 5.64 · 격자 1.46 : 1
- 같은 서비스 안 짝: 요일별 활동 막대는 빨강 계열(가장 큰 날 진한 주황), 축 레이더는 하늘 `rgb(125,211,252)` 내 캐릭터 · 호박 `rgba(251,191,36,0.85)` 평균 점선
- 빈 값: 닉네임 · 월드 리프 칸 「~ 기록이 없습니다.」 글자(차트 빈 값은 미확인). 가리킴 미확인(겹친 광고 영상 때문에 시험 안 함)
- 캡처: `caps/p1-korea/mapleroad.png` · `mapleroad-top.png` · `mapleroad-exp.png` · `mapleroad-exp-hover.png` · `mapleroad-history-1.png` · `mapleroad-history-2.png` · `mapleroad-history-3.png` (캡처 확인)

### P1 · D20 해외 실측 (2026-11-22)

#### 요약(끝날 때 고침)

- P1 다크로 잰 곳 — 해외 12곳(국내 0, 이 묶음은 해외만): Bokutachi · ScoreSaber · BeatLeader · AccSaber · Hitbloq · gatari · Akatsuki(이상 7곳 리듬게임 기록) · tactics.tools · MetaTFT · SC2 Pulse · OGS · lishogi. 목표 15곳에 3곳 모자람.
- D20 다크로 잰 곳 — 0곳. 곡 · 맵 단위 점수 추이를 공개 화면에서 찾지 못함(Bokutachi 는 표 목록, ScoreSaber Reloaded 는 막힘, BeatLeader 미확인).
- P1 꼴 세기(12곳): 선이 유채색 한 색 8(Bokutachi · ScoreSaber · AccSaber · Hitbloq · gatari · Akatsuki · OGS · tactics.tools[점만 등수 색]) — 그중 브랜드색과 같은 값 3(ScoreSaber #3aa6e4 · AccSaber #f5b800 · gatari #66b5ff) / 계열마다 색 3(BeatLeader · SC2 Pulse · lishogi) / 구간 색 1(MetaTFT 티어 색).
- 라이트만 14: osu!track · osu!daily · clist.by · AtCoder · osu!Stats · chunirec · stat.ink · osu!Skills · lidraughts · playstrategy · Wavu Wank · Puddle Farm(차트 상자 흰색) · W3Champions · 雀魂牌谱屋.
- 막힘 26: Kamaitachi(로그인) · LeetCode · Lichess · csstats.gg · League of Graphs · u.gg · Speedrun.com · Codeforces · therun.gg · RoyaleAPI · rlstats · LeetCode CN · FACEIT · StatsRoyale · ScoreSaber Reloaded · Brawlify · Clash of Stats · STRATZ · Porofessor · aoe4world · Jstris · Leafapp · steamladder · HSGuru · TETR.IO(사용자 에이전트 거부) · Dotabuff.
- 오류 · 해당 없음 · 기능 없음은 아래 목록(세지 않음).

방법: METHOD.md 그대로. headless Playwright · colorScheme dark · 1440×900 · 로그인 없음. 값은 SVG getComputedStyle 또는 캔버스 fillStyle/strokeStyle 설정자 기록. 대비는 WCAG 2, 차트 면 기준.

#### 막힘 · 라이트만 (재는 대로 덧붙임)

- 막힘: Kamaitachi(kamai.tachi.ac) — 사용자 프로필 `/u/zkldi/games/iidx/SP` 가 로그인 창으로 넘어감. 캡처 `kamaitachi-profile.png`.
- 제외(잘못된 주소 404, 세지 않음): EtternaOnline `/users/Ulti` — 아래 다시 잼.

#### 곳마다

##### Bokutachi — 게임 프로필 History(Ratings)

- URL: https://boku.tachi.ac/u/zkldi/games/bms-7k · 확인 2026-11-22 · 해외(리듬게임 기록, Tachi) · 다크(사이트 기본)
- 바탕 body #131313 · 차트 면 카드 #2b292b
- 브랜드색: 고른 탭 · 주 버튼 #527acc(rgb 82,122,204). 로고 계산값 미확인.
- 기능: P1(Sieglinde ★ 레이팅 추이, Past Week–All Time · Ranking · Playcount · Ratings 탭)
- 꼴: 유채색 한 색(파랑) · 브랜드색과 비슷하나 다름(#4974a5 vs #527acc)
- 선: SVG path stroke #4974a5(rgb 73,116,165) · 2px · 면 없음 · 점 없음(계단식 선)
- 가리킴: 세로 점선(검정 rgb 0,0,0 · stroke-opacity .75 · 1px) + 어두운 말풍선(「★17.26 Sieglinde · 24일 전」). 점 표시 없음.
- 격자: 가로 · 세로 rgba(247,247,247,.5) 1px · 축 글자 흰색 작게
- 대비: 선 #4974a5 / 면 #2b292b = 2.97 : 1 (브랜드 #527acc 는 3.45)
- 범례: 없음(탭으로 지표 고름)
- 짝: Ranking 탭으로 바꿔도 같은 선 색인지는 미확인(클릭이 다른 글자에 걸림).
- 캡처: `bokutachi-bms7k.png` · `bokutachi-bms7k-chart.png` · `bokutachi-bms7k-hover.png` (캡처 확인)

##### ScoreSaber — 프로필 순위 그래프

- URL: https://scoresaber.com/u/76561198988695829 (→ /u/matty) · 확인 2026-11-22 · 해외(Beat Saber 기록) · 다크(사이트 기본)
- 바탕 body #09090b · 차트 면 카드 #020203(테두리 있는 카드)
- 브랜드색: 주 버튼 · 고른 탭 계산값 #3aa6e4(1개), 노랑 #facc15 버튼 2개(용도 미확인). 로고 계산값 미확인.
- 기능: P1(전 세계 순위 추이, 최근 90일, 탭 「순위 · 일평균 · 최고 기록」)
- 꼴: 유채색 한 색 = 브랜드색과 같음(#3aa6e4, CSS 변수 `--chart-primary` · `--chart-metric-rank`)
- 선: 캔버스 strokeStyle rgba(58,166,228,1) · 3px(Chart.js), 가리킴 구간 뒤 면 rgba(58,166,228,.1)
- 지표별 변수(사이트 CSS): `--chart-metric-rank #3aa6e4` · `--chart-metric-pp #5048e5` · `--chart-metric-acc #16a249` · `--chart-metric-plays #2a9d90` — 지표마다 다른 색으로 정의됨. 탭을 실제로 눌러 색이 바뀌는지는 미확인.
- 가리킴: 선 위 점(채움 #3aa6e4 · 흰 테두리 3px), 검정 말풍선(rgba(0,0,0,.8)) 「28일 전 · 순위: #4」 + 색 네모 범례. 끝점에 늘 점.
- 격자: `--chart-grid #fafaf9` 를 strokeStyle rgba(250,250,249,.1) 로 · 축 글자 #666 · 축 제목 「전 세계 순위」 은 선과 같은 파랑
- 대비: #3aa6e4 / #020203 = 7.66 : 1 (pp #5048e5 3.36 · acc #16a249 6.22)
- 캡처: `scoresaber-profile.png` · `scoresaber-profile-chart.png` · `scoresaber-profile-hover.png` (캡처 확인)

##### BeatLeader — 프로필 「Rank & PP」 그래프

- URL: https://beatleader.com/u/bytesy (→ /u/bytesy/ranked) · 확인 2026-11-22 · 해외(Beat Saber 기록) · 다크(사이트 기본)
- 바탕 html #222222 · 차트 면 #121212(cards-wrapper darkened-background)
- 브랜드색: 고른 탭 버튼 #3273dc · 탭 밑줄 변수 `--tab-line #7a4fd6`. 로고 계산값 미확인.
- 기능: P1(순위 · pp 시간 추이, 두 축) · 탭 「Rank & PP · Maps Graphs · Acc history · Skill triangle」
- 꼴: 계열마다 색(Chart.js 범례 칩, 눌러 끄고 켬)
    - Rank #3e95cd 3px(왼쪽 축) · PP #007100 2px(오른쪽 축) · Country rank #8992e8 2px(기본 꺼짐) · Ranked play count #3e3e3e(꺼짐) · Total play count #fff(꺼짐)
    - 막대: Ranked scores #eb008c · Ranked improved #f04dae · Unranked scores #333 · Unranked improved #474747
    - 점: 날마다 작은 점, 세로 회색 선 「R」 표시(#777777)
- 가리킴: 검정 말풍선 「26. 11. 14. 오전 9:00 · Rank: #3 · PP: 21,349.57pp …」 + 계열 색 네모
- 격자 #2a2a2a 1px · 축 글자 흰색
- 대비: Rank #3e95cd / #121212 = 5.70 : 1 · PP #007100 = 3.00 · 고른 탭 #3273dc = 4.12
- 브랜드색과: Rank 선 #3e95cd 는 고른 탭 #3273dc 와 비슷한 파랑이나 다른 값(Chart.js 예제 기본색과 같은 값).
- 캡처: `beatleader-profile.png`(첫 화면) · `beatleader-profile-chart.png` · `beatleader-profile-hover.png` (캡처 확인)

- 제외: EtternaOnline `/users/Kiraito` — 프로필에 기록 · 그래프 없음(점수 0). 다른 사용자로 다시 잼.

- 기능 없음(세지 않음): EtternaOnline 프로필 `/users/witchfynde` — 실력 분해 · 최근 기록 표만 있고 시간 추이 선 없음. 바탕 #16141a · 주 버튼 #8f60f6. 캡처 `etterna-profile.png`.
- 라이트만: osu!track(ameobea.me/osutrack/user/mrekk) — 흰 패널(#fff) Highcharts, 다크 설정 없음. 캡처 `osutrack.png`.
- 라이트만: osu!daily(osudaily.net/profile.php?u=mrekk) — 분홍 바탕 #f3d8f7 · 흰 차트, pp 선 #1f77b4 2px. 캡처 `osudaily.png`.
- 막힘: LeetCode 프로필(leetcode.com/u/lee215) — Cloudflare 보안 확인(403). 캡처 `leetcode.png`.
- 라이트만: clist.by(clist.by/coder/tourist) — 흰 body, 레이팅 선 계정마다 색(#ff0029 · #377eb8 · #66a61e …). 캡처 `clist.png`.
- 막힘: Lichess 프로필(lichess.org/@/DrNykterstein) — Cloudflare 보안 확인(403). 캡처 `lichess.png`.
- 막힘: csstats.gg · League of Graphs · u.gg — 셋 다 Cloudflare 보안 확인(403). 캡처 `csstats.png` · `leagueofgraphs.png` · `ugg.png`.

##### tactics.tools — TFT 플레이어 LP 그래프

- URL: https://tactics.tools/player/kr/클레스메이트/KR1 · 확인 2026-11-22 · 해외(TFT 분석) · 다크(사이트 기본)
- 바탕 body #0f1720 · 차트 면 rgba(14,45,84,.9) → 섞은 색 약 #0e2b4f
- 브랜드색: 버튼 면 #392c72 · #5842c3(보라 계열). 로고 · 고른 탭 계산값 미확인(고른 탭 「STATS」 글자 · 밑줄 파랑은 캡처 픽셀로만 봄).
- 기능: P1(최근 50판 LP 추이, Last 50 고름)
- 꼴: 선은 유채색 한 색(파랑) + 점은 판 등수마다 색(구간 색)
- 선: SVG path stroke #52a9ff · 1.5px · 면 없음
- 점 · 등수 표시: 1등 #f1c555 · 2등 #dc38c3 · 3등 #6eccff · 4등 #37d488 · 5등 이하 #bbbbbb(점 위 짧은 막대 1.75px + 등수 숫자 같은 색)
- 가리킴: 흰 점선 세로줄 + 남색 말풍선 「■ Rank 1887 LP」(네모 = 선 파랑)
- 격자: rgba(255,255,255,.2–.24) 1px · 축 글자 흰색, 날짜 축 월 이름은 파랑
- 대비: 선 #52a9ff / #0e2b4f = 5.74 : 1
- 브랜드색과: 다름(선 파랑 · 버튼 보라).
- 캡처: `tacticstools.png` · `tacticstools-chart.png` · `tacticstools-hover.png` (캡처 확인)

##### MetaTFT — 플레이어 「LP History Ranked」

- URL: https://www.metatft.com/player/kr/클레스메이트-KR1 · 확인 2026-11-22 · 해외(TFT 분석) · 다크(사이트 기본)
- 바탕 body #1d1e20 · 차트 카드 면 #27282b 계열(rect stroke 값, 픽셀 확인은 안 함)
- 브랜드색: 빨강 버튼 #be0505(2개). 로고 계산값 미확인.
- 기능: P1(최근 100판 LP 추이, Last 100 고름)
- 꼴: 구간 색 — 선 stroke 가 `url(#line-gradient)` 이고 점마다 그 판의 티어 색 stop(이 플레이어는 Challenger 구간 전부 #F4C874 금색)
- 선: 1px · 아래 면 fill #f4c874 opacity .07 · 점 작은 원 #f4c874
- 가리킴: 검정 말풍선 「2026. 10. 23. 오후 07:21 · Rating: CHALLENGER I 1645 LP」
- 격자 · 축: 축선 #a5a5a5 1px · 축 글자 #e6e6e6
- 대비: #f4c874 / #27282b = 9.38 : 1 (body #1d1e20 기준 10.61)
- 브랜드색과: 다름(선은 티어 색, 브랜드 빨강).
- 캡처: `metatft.png` · `metatft-chart.png` · `metatft-hover.png` (캡처 확인)
- 막힘: Speedrun.com(/sm64) · Codeforces(/profile/tourist) — Cloudflare 보안 확인(403). therun.gg — Cloudflare 차단 페이지. 캡처 `speedrun.png` · `codeforces.png` · `x-therun.png`.
- 라이트만: AtCoder(/users/tourist, 흰 body, 레이팅 캔버스 등급 띠 · 선 #84e6ff 는 등급색) · osu!Stats(osustats.ppy.sh/u/mrekk, 보라 바탕 #8f8fff · 밝은 면) · chunirec(chunirec.net, 흰 body, 기록은 로그인 뒤라 막힘도 겹침). 캡처 `atcoder.png` · `osustats.png` · `chunirec.png`.
- 오류: Hitbloq(hitbloq.com/ladder/1) — 500 Internal Server Error. 세지 않음. 캡처 `x-hitbloq.png`.

##### AccSaber — 프로필 Statistics 「AP」 추이

- URL: https://accsaber.com/players/76561199866655859 (lap1s, Statistics 탭) · 확인 2026-11-22 · 해외(Beat Saber 정확도 랭킹) · 다크(사이트 기본)
- 바탕 body #08080d · 차트 면 = body(카드 면 없음)
- 브랜드색: 주 버튼 계산값 #f5b800(노랑) · 레벨 배지도 노랑. 아이콘 분홍 #ec69ff 도 씀. 로고 계산값 미확인.
- 기능: P1(총 AP 시간 추이, 24h · 7d · 2w · 30d · 90d · 1y · All)
- 꼴: 유채색 한 색 = 브랜드색과 같음(#f5b800)
- 선: 캔버스 strokeStyle #f5b800 · 2px(계단 곡선) · 아래 면 `color-mix(in srgb, #f5b800 10%, transparent)`
- 가리킴: 흰 점선 세로줄(위 끝 작은 네모) + 선 위 빈 원 + 검정 말풍선(rgba(0,0,0,.8)) 「2026년 11월 13일 · ■ 33047.99」
- 격자 rgba(255,255,255,.06) 1px · 축 글자 #8888a0 · CSS 변수 `--chart-text #6a6a82` · `--chart-grid rgba(0,0,0,.08)`
- 대비: #f5b800 / #08080d = 11.17 : 1
- 같은 쪽 다른 차트: 「Top 20/50/100 Nth score」 곡선은 계열마다 색 — True Acc #22c55e · Standard Acc #3b82f6 · Tech Acc #ef4444(Tailwind 기본 팔레트), 2px + 점. 개인 추이 선(노랑)과 다른 색 묶음.
- 캡처: `accsaber-profile.png` · `accsaber-profile-chart.png` · `accsaber-profile-hover.png` · 짝 `accsaber-profile-2-hover.png` (캡처 확인)

##### OGS(Online Go Server) — 플레이어 레이팅 그래프

- URL: https://online-go.com/player/1 · 확인 2026-11-22 · 해외(바둑 대국) · 다크(prefers-color-scheme 따라감)
- 바탕 body · 차트 면 #1a1a1a(면 구분 없음)
- 브랜드색: 주 버튼 #1d66cc. 로고 계산값 미확인.
- 기능: P1(종합 레이팅 2013–2026 추이, 오른쪽 축에 급 · 단)
- 꼴: 유채색 한 색(파랑) + 불확실 띠(어두운 청록 면)
- 선: SVG path stroke #329be0 · 2px · 레이팅 편차 띠 fill #092d3e. 아래 기간 고르는 미니맵 선 #3587bc · 면 #092d3e
- 같은 쪽 다른 차트: 승패 막대 · 원그래프 — 고수에게 승 #65a353 · 고수에게 패 #9d5a83 · 하수에게 승 #223718 · 하수에게 패 #391829(승 초록 · 패 분홍 짝)
- 가리킴: 차트 70% 지점에 마우스를 올려도 말풍선 · 점이 보이지 않음(미확인)
- 격자 · 축: 축선 #545454 1px · 축 글자 회색
- 대비: #329be0 / #1a1a1a = 5.72 : 1 (주 버튼 #1d66cc 는 3.17)
- 브랜드색과: 비슷한 파랑이나 다른 값.
- 캡처: `ogs.png` · `ogs-chart.png` · `ogs-hover.png` (캡처 확인)

- 기능 미확인: Leetify(leetify.com/@s1mple) — 다크(#19171e)로 열리나 첫 화면 · 자동 탐색에 시간 추이 차트 없음. 세지 않음. 캡처 `leetify.png`.
- 막힘: RoyaleAPI — Cloudflare 403. brawlace — 520 오류. Faceit Analyser — s1mple 이름이 없음(404). Splits.io — 서비스 종료. 캡처 `x-royaleapi.png` · `x-brawlace.png` · `x-faceitanalyser.png` · `x-splits.png`.
- D20 없음(세지 않음, P1 항목은 위 Bokutachi): Bokutachi 곡 단위 — PB 펼침 탭 「PB Info · Lowest BP · Best Score · Play History(23)」 중 Play History 는 표 목록이고 추이 선 없음. 캡처 `bokutachi-d20-history.png`.
- 막힘: ScoreSaber Reloaded(ssr.fascinated.cc, 맵마다 점수 기록 그래프가 있다고 문서에 적힌 곳) — Cloudflare 403. 캡처 `ssr-profile.png`.
- 해당 없음: beatscore.eu — 음악 차트 사이트(주황 바탕), 개인 기록 아님. 캡처 `beatscore.png`.
- 막힘: chessmonitor(/u/hikaru 사용자 없음) · Apex Legends Status(가짜 uid 로 연 탓, 세지 않음) · Brawlify(보안 차단) · Clash of Stats · STRATZ · Porofessor(Cloudflare 403). Monkeytype 공개 프로필은 추이 차트 없음.
- 막힘: rlstats · LeetCode CN · FACEIT · StatsRoyale — Cloudflare 403. 해당 없음: Overbuff(서비스 종료 안내) · TypeGG · keybr(잘못된 주소 404) · score.respektive.pw(JSON API, 화면 없음) · tetrio.team2xh.net(다크 #15191c 이나 2023-11-29 이후 갱신 멈춤, 선수 그래프 비어 있음).
- 라이트만: stat.ink(@fetus_hina, 흰 body) · osu!Skills(하늘색 바탕 #afe4ff). 캡처 `x-statink.png` · `x-osuskills.png`.
- 기능 미확인(다크인데 추이 차트를 못 찾음, 세지 않음): Akatsuki(akatsuki.gg/u/1001, html #151117) · LOLPros(lolpros.gg/player/faker, html #1c2025) · Brawl Time Ninja(자동 추적 꺼진 선수라 추이 없음) · Statlocker(첫 화면만). 캡처 `akatsuki.png` · `lolpros.png` · `brawltime.png` · `x-statlocker.png`.

##### gatari(osu! 사설 서버) — 프로필 Performance 그래프

- URL: https://osu.gatari.pw/u/1000 · 확인 2026-11-22 · 해외(osu! 서버 · 기록) · 다크(사이트 기본)
- 바탕 body #171a1c · 차트 면 #22262a(profile-block-body)
- 브랜드색: 주 버튼 계산값 #66b5ff(rgb 102,181,255) · 강조 글자 「8,751pp (#521)」 도 같은 파랑. 로고 미확인.
- 기능: P1(pp · 순위 시간 추이 두 줄)
- 꼴: 브랜드색 한 색 + 같은 색상의 탁한 점선
    - Performance: 캔버스 strokeStyle hsl(209,100%,70%) = #66b5ff · 3px 실선 = 브랜드색과 같음
    - Rank: hsla(209,30%,50%,.7)(≈#5981a6 70%) · 3px 점선
- 범례: 위 가운데, 선 모양 네모(실선 · 점선) + 회색 글자
- 가리킴: 탁한 파랑 말풍선 「18 days ago · Rank: 518」, 점 표시 없음
- 격자 · 축: 축 글자 #666 · 격자 rgba(0,0,0,.1)
- 대비: #66b5ff / #22262a = 6.98 : 1
- 캡처: `gatari.png` · `gatari-chart.png` · `gatari-hover.png` (캡처 확인)

##### lishogi — 프로필 레이팅 기록(장기, Lichess 계열 소프트웨어)

- URL: https://lishogi.org/@/Beniiro · 확인 2026-11-22 · 해외(장기 대국) · 다크(사이트 기본)
- 바탕 body #161512 · 차트 면 #262421(rating-history-container)
- 브랜드색: 주 버튼(회원 가입 · 전송) #3692e7 · 고른 기간 버튼(3M) #d64f00 · 로고 글자 #bfbfbf
- 기능: P1(종목별 레이팅 추이, 1M · 3M · 6M · YTD · 1Y · ALL)
- 꼴: 계열마다 색(종목마다 다른 색 · 선 모양) — 색맹 안전 팔레트(Okabe–Ito 값과 같음)
    - Shogi #009E73 실선 2px · 퍼즐 #0072B2 파선 2px · 다른 종목 #E69F00(점선) · #CC79A7 · #66558C · #558c60 · 미니맵용 반투명 #459f3b5e · #009e7471 · #0071b269 · #56b3e942
- 가리킴: 선 위 색 네모 점(흰 테두리), 밝은 테두리 말풍선(면 #24221e) 「2026. 10. 26. · ■ Shogi: 2550 · ■ 퍼즐: 2819」
- 격자 #404040 1px · 축 글자 #666(오른쪽 축)
- 대비: Shogi #009e73 / #262421 = 4.52 : 1 · 퍼즐 #0072b2 = 2.98 · #e69f00 = 6.87
- 브랜드색과: 다름(선은 종목 팔레트, 버튼 파랑 · 기간 주황).
- 캡처: `lishogi.png` · `lishogi-chart.png` · `lishogi-hover.png` (캡처 확인)

- 해당 없음: trackmania.io 선수 쪽 — SPA 가 「please use …」 안내만 띄움(내용 없음). Ripple — 사용자 없음(흰 바탕, 라이트만으로도 볼 수 있음). raider.io 캐릭터 쪽 — 다크(#111111)이나 점수 추이 선 못 찾음(세지 않음). 캡처 `tmio-player.png` · `ripple.png` · `raiderio.png`.
- 라이트만: lidraughts(@Guepard) · playstrategy(@AGARJ) — Lichess 계열, 익명 기본이 밝은 바탕(#edebe9, 흰 상자). 사이트에 다크 배경 설정은 있으나 익명 전환은 설정 저장(폼 제출)이라 시도 안 함. playstrategy 레이팅 선은 종목마다 색(#ff7f00 · #1f78b4 · #33a02c · #e31a1c … ColorBrewer Paired). 캡처 `lidraughts.png` · `playstrategy.png`.
- 라이트만: Wavu Wank(철권 8 레이팅, 종이색 면) · Puddle Farm(GGST, body #262a2c 이나 차트 상자 흰색 #fff, 레이팅 선 rgb(75,192,192) 2px + 면 .2 = Chart.js 기본 청록). 캡처 `wavu.png` · `puddlefarm-hover.png`.
- 막힘: aoe4world · Jstris — Cloudflare 403. 기능 없음: Arrow Cloud(ITG, 다크 oklch(.15 …)) 사용자 · 차트 쪽에 추이 선 없음, GrooveStats 첫 화면만. 캡처 `arrowcloud-user.png` · `arrowcloud-chart.png`.

##### Hitbloq — 프로필 순위 기록(rank history)

- URL: https://hitbloq.com/user/1 · 확인 2026-11-22 · 해외(Beat Saber 맵 풀 랭킹) · 다크(사이트 기본)
- 바탕 body #0d0d0e · 상자 rgba(40,42,54,.7) · 차트 면 = 캔버스 자체 배경 #000000(둥근 모서리)
- 브랜드색: 버튼 면 #282a36(무채색). 유채 브랜드색 · 로고 계산값 미확인.
- 기능: P1(맵 풀 안 순위 추이)
- 꼴: 유채색 한 색(파랑) · 축 · 격자 · 범례 없음
- 선: 캔버스 strokeStyle rgb(0,153,219) = #0099db · 1px · 면 없음
- 가리킴: 같은 파랑 세로줄 + 빈 원(파랑 테두리, 검정 채움) + 흰 테두리 검정 말풍선 「Rank: #642 · 18 days ago」
- 대비: #0099db / #000000 = 6.58 : 1
- 캡처: `hitbloq.png` · `hitbloq-chart.png` · `hitbloq-hover.png` (캡처 확인)

##### SC2 Pulse — 선수 MMR history

- URL: https://sc2pulse.nephest.com/sc2/?type=character&id=5124994&m=1#player-stats-mmr · 확인 2026-11-22 · 해외(스타크래프트 2 래더 기록) · 다크(사이트 기본)
- 바탕 body #191d21 · 차트 면 = 모달 면 #191d21
- 브랜드색: 주 버튼 #007bff(Bootstrap 기본 파랑, 14개). 로고 미확인.
- 기능: P1(MMR 시간 추이, 시즌 번호 띠 · 확대/이동)
- 꼴: 계열마다 색 = 종족 색(종족을 바꿔 쓴 선수라 한 그래프에 여러 줄)
    - terran rgba(1,90,145) = #015a91 · protoss rgba(222,201,62) = #dec93e · zerg rgba(136,41,145) = #882991 · 모두 1.25px · 면 없음
- 범례: 위 가운데 Chart.js 네모(테두리만, 종족 이름)
- 가리킴: 점선 세로줄 + 선 색 점 + 검정 표 말풍선(rgba(0,0,0,.8)) — 날짜 · 종족 · 시즌 · 리그 · MMR · 승률 · 순위
- 격자 rgba(127,127,127,.3) · #242a30 1px · 축 글자 #666 · 시즌 번호 흰 글자 검정 칩
- 대비: terran #015a91 / #191d21 = 2.32 : 1 · protoss #dec93e = 10.11 · zerg #882991 = 2.24 (주 버튼 #007bff 4.26)
- 브랜드색과: 다름(종족 색).
- 캡처: `sc2pulse.png` · `sc2pulse-chart.png` · `sc2pulse-hover.png` (캡처 확인)
- 해당 없음: osu!chan(다크 #17171c, 차트는 상위 100 기록 pp 분포 = 시간 추이 아님, 점 #3a3acc) · ballchasing(다크 #17181c, 첫 차트는 원그래프) · W3Champions(기본 「human」 테마 밝음, 종족 테마 메뉴로만 바뀜 = 라이트만) · AoE II Companion(잘못된 주소 404) · ppy.sb · EZPPFarm(다크이나 추이 차트 못 찾음) · rankedftw(연결 오류). 막힘: Leafapp(Anubis 봇 차단) · steamladder · HSGuru(Cloudflare 403) · TETR.IO 프로필(ch.tetr.io, 헤드리스 사용자 에이전트 거부).
- 기능 미확인 정정: 위 「Akatsuki 추이 차트 못 찾음」 은 비활성 사용자(u/1001) 기준. 상위 선수로 다시 재서 아래에 기록.

##### Akatsuki(osu! 사설 서버) — 프로필 Rank · PP 그래프

- URL: https://akatsuki.gg/u/101966?mode=0&rx=0 · 확인 2026-11-22 · 해외(osu! 서버 · 기록) · 다크(사이트 기본)
- 바탕 html #151117 · 상자 #1a1a1a · 차트 면 rgba(0,0,0,.15) → 섞은 색 약 #161616
- 브랜드색: 버튼 면 #262626(무채색). 유채 브랜드색 · 로고 계산값 미확인.
- 기능: P1(최근 90일 전 세계 순위 추이, 탭 「Rank · PP」)
- 꼴: 유채색 한 색(보라)
- 선: SVG path stroke #a517f7 · 3px(ApexCharts) · 아래 면 세로 그라데이션 rgba(165,23,247,.35) → 0
- 가리킴: 같은 보라 점선 세로줄 + 흰 테두리 보라 점 + 어두운 말풍선(머리 검정) 「26 days ago · Global Rank: #1 · Country Rank: #1」
- 격자 rgba(255,255,255,.06) 1px · 축 글자 회색
- 대비: #a517f7 / #161616 = 3.50 : 1
- 캡처: `akatsuki.png` · `akatsuki-chart.png` · `akatsuki-hover.png` (캡처 확인)
- Akatsuki 「PP」 탭: 클릭이 다른 「PP」 글자에 걸려 탭 전환 색은 미확인(`akatsuki-pp-hover.png` 은 Rank 그대로).
- 라이트만: 雀魂牌谱屋 amae-koromo(작혼 통계, 흰 body, 순위 선 #28a745 · #17a2b8 · #6c757d · #dc3545 = 등수별 Bootstrap 색). 캡처 `amaekoromo.png`.
- 기능 없음: pychess(다크 #161512, 프로필 · /perf/xiangqi 에 추이 차트 없음) · sendou.ink(다크 oklch(.17 …), 시즌 기록 없음, 사이트 변수 `--color-chart-alpha` 등은 대전 통계용) · ppy.sb 상위 선수 쪽(추이 차트 없음). 막힘: Dotabuff(Cloudflare 403). 캡처 `pychess.png` · `sendou.png` · `ppysb.png` · `x-dotabuff.png`.
- D20 추가 시도: BeatLeader 프로필 점수 「Show details」 를 열어도 점수 기록 추이 탭 · 글자 없음(미확인, 클릭이 맞는 줄에 걸렸는지 확인 못 함).

### D17 · D18 실측 (2026-11-22)

방법: `METHOD.md`(공유 메모 폴더). headless Playwright · colorScheme dark · 1440×900 · 로그인 없음. 캡처 `caps/d17-d18/`.
값은 계산값(캔버스 fillStyle · strokeStyle 설정자, SVG getComputedStyle). 차트 면 · 대비는 캡처 픽셀(「픽셀」 표시가 없어도 면 색은 픽셀로 땀). 대비는 WCAG 2, 차트 면 기준.

#### D17 고른 지표 한 줄

##### BeatLeader 프로필 그래프 (해외 · 리듬게임)

- URL https://beatleader.com/u/bytesy · 2026-11-22 · 다크(사이트 기본, html #222222) · 차트 면 #121212 · 로고 빨강 · 분홍 · 파랑 세 칸, 고른 탭 버튼 파랑.
- 꼴: 위 탭(Rank & PP · Maps Graphs · Acc history · Skill triangle)으로 그래프 종류를 바꾸고, 그 안에서 범례 칸을 눌러 계열을 켜고 끔. 한 줄만 고르는 꼴은 아니고 여러 줄 · 계열마다 고정 색.
- Rank & PP 탭(눌러 확인): Rank #3e95cd(5.70:1) · PP #007100(3.00:1) · Country rank #8992e8(기본 꺼짐) · Total play count #fff(꺼짐) · Ranked scores #eb008c(4.38:1) 막대 · Ranked improved #f04dae(5.69:1) · Unranked #333 / #474747. 격자 #2a2a2a. 범례 = 테두리 사각형, 꺼진 계열은 취소선.
- Acc history 탭(눌러 확인): Average #3273dc(4.12:1) · Average ranked #3e95cd(5.70:1) · Median #8992e8(6.55:1) · Median ranked #565b92(2.95:1). 파랑 · 보라 네 줄.
- 탭을 바꿀 때 색: 계열마다 고정 색. 같은 #3e95cd 가 두 탭에 다시 나옴.
- 캡처: beatleader-profile-rankpp.png · beatleader-profile-acchist.png · beatleader-profile-maps.png (캡처 확인)

##### Fathom Analytics 공개 데모 (해외 · 분석 도구)

- URL https://usefathom.com/demo · 2026-11-22 · 다크(사이트가 colorScheme 따라감, Highcharts light-dark 변수) · 차트 면 #0b0e0c · 쪽 바탕 #181b19.
- 꼴: 위 숫자 칸(Site visitors · Pageviews · Avg time on site · Bounce rate)을 눌러 계열을 켜고 끔. 여러 개를 함께 켤 수 있고, 켠 칸 숫자 옆 작은 점이 범례. 지표마다 고정 색.
- 지표별 선(눌러 확인, 2px, 면 채움 fill-opacity 0.2, 오늘 칸은 점선 2px 6px): Site visitors #c7bcff(11.15:1) · Pageviews #947fff(6.23:1) · Avg time on site #f45b3d(5.92:1) · Bounce rate #26d8d8(10.99:1).
- 지표를 바꿀 때 색: 바뀜(지표마다 다른 색). 방문 · 조회는 보라 두 단계, 시간 · 이탈은 주황 · 청록.
- 격자 점선 rgb(47,54,49) 1px 1px/3px · 축 글자 회색.
- 캡처: fathom.png(기본 둘) · fathom-avgtime.png · fathom-bounce.png · fathom-visitors.png · fathom-pageviews.png (캡처 확인: pageviews · 기본)

##### Simple Analytics 공개 대시보드 (해외 · 분석 도구)

- URL https://dashboard.simpleanalytics.com/simpleanalytics.com · 2026-11-22 · 다크(colorScheme 따라감) · 쪽 · 차트 면 #20292a · 브랜드 빨강(로고 · Sign up 버튼).
- 꼴: 차트 아래 오른쪽 체크 상자(Trend lines · Annotations · Pageviews · Visitors)로 계열을 켜고 끔. 체크 상자 색이 그 계열 색이라 범례 노릇(Visitors 체크 픽셀 #00859c · Pageviews 체크 #5b85c6).
- 계열(캔버스, 눌러 확인): Visitors 선 #09abc6(5.42:1) · Pageviews 선 #729ee7(5.50:1). 면은 회청 반투명(Visitors 면 픽셀 #67878d · Pageviews 와 겹친 위쪽 면 보라 회색). 격자 #2a3638 · 주석 세로선 #3e4e51. Trend lines 를 켜면 #09abc64D(30%) 추세선.
- 지표를 바꿀 때 색: 바뀜(Visitors 청록 · Pageviews 파랑). 둘 다 켜면 두 줄.
- 캡처: simpleanalytics.png · simpleanalytics-pv-on.png (캡처 확인) · simpleanalytics-vis-off.png

##### ScoreSaber 프로필 그래프 (해외 · 리듬게임, 한국어 화면)

- URL https://scoresaber.com/u/76561199471863419 · 2026-11-22 · 다크(html class "dark", 바탕 #09090b) · 차트 카드 면 #020203 · 브랜드 노랑(로고 · PP 배지).
- 꼴: 차트 위 탭 버튼(순위 · PP · 평균 정확도 · 플레이 수) 중 하나를 고르면 같은 자리에 한 줄. 고른 탭 버튼 면이 그 지표 색(순위일 때 파랑 면). y축 이름 글자도 지표 색. 범례 없음.
- CSS 변수: --chart-metric-rank #3aa6e4 · --chart-metric-pp #5048e5 · --chart-metric-acc #16a249 · --chart-metric-plays #2a9d90 · --chart-primary #3aa6e4 · --chart-grid #fafaf9.
- 지표별 선(캔버스, 눌러 확인): 순위 rgba(58,166,228,1) #3aa6e4(7.66:1) · PP #5048e5(3.36:1) · 평균 정확도 #16a249(6.22:1) · 플레이 수 #2a9d90(6.25:1). 선 밑 면은 같은 색 0.1. 격자 rgba(250,250,249,0.1). 대비는 카드 면 #020203 기준.
- 지표를 바꿀 때 색: 바뀜(지표마다 색).
- 가리킴: 같은 색 점 + 검정 0.8 말풍선.
- 캡처: scoresaber-profile.png · scoresaber-profile-rank.png (캡처 확인: 순위 상태) · scoresaber-profile-pp.png · scoresaber-profile-acc.png · scoresaber-profile-plays.png · scoresaber-profile-hover.png

##### CoinGecko 코인 차트 (해외 · 코인)

- URL https://www.coingecko.com/en/coins/bitcoin · 2026-11-22 · 다크(사이트 다크 설정: localStorage is_dark=true 로 켬, 로그인 없음) · 차트 면 #0d1217 · 브랜드 초록(Sign up 버튼).
- 꼴: 차트 위 「Price ▾」 드롭다운(올리면 열림)에서 Price · Market Cap 을 고르면 같은 자리에 한 줄. 범례 없음.
- 지표별 선(눌러 확인, SVG 2px + 같은 색 그라데이션 면 0.75): 24H 에서 Price · Market Cap 모두 #ff3a33(5.29:1) / Max 에서 Price · Market Cap 모두 #32ca5b(8.72:1).
- 지표를 바꿀 때 색: 안 바뀜. 색은 지표가 아니라 기간 안 오름 · 내림(초록 · 빨강)으로 정해짐.
- 격자 rgb(27,35,45) · 축 글자 회색.
- 캡처: coingecko-menu.png(가격 24H, 캡처 확인) · coingecko-mcap7d.png(시가총액, 캡처 확인) · coingecko-max-price-max.png · coingecko-max-mcap-max.png · coingecko-max-cmpmenu.png(시가총액 Max 초록, 캡처 확인)

##### AccSaber 선수 「History」 (해외 · 리듬게임)

- URL https://accsaber.com/players/76561199866655859 → Statistics 탭 · 2026-11-22 · 다크(사이트 기본, 바탕 #08080d) · 차트 면 #08080d · 브랜드 노랑(Log in 테두리).
- 꼴: History 위 지표 탭(AP · Avg Accuracy · Ranked Plays · Rank)을 눌러 켜고 끔. 여러 개를 함께 켜면 같은 자리에 여러 줄 + 축이 양쪽에 생김. 켜진 탭의 글자색이 그 줄 색이라 범례 노릇. 그 위 분류 탭(Overall · True Acc · Standard Acc · Tech Acc)은 AP 줄 색을 바꿈.
- 지표별 선(캔버스, 눌러 확인): AP = 분류 색(Overall #f5b800 11.18:1 · True Acc #22c55e 8.77:1 · Tech Acc #ef4444 5.31:1, Standard Acc 는 같은 쪽 AP Curve 의 #3b82f6) · Avg Accuracy #36cfb0(10.19:1) · Rank #a855f7(5.05:1) · Ranked Plays 미확인(그려지지 않음). AP 줄 밑 면은 같은 색 옅게. 격자 rgba(255,255,255,.06) · 축 글자 #8888a0(--chart-text) · 왼쪽 축 글자는 AP 색, 오른쪽 축 글자는 Avg Accuracy 색.
- 지표를 바꿀 때 색: 바뀜(지표마다 색, AP 는 분류 색을 따라감).
- 같은 쪽 다른 차트: AP Curve 는 True 초록 · Standard 파랑 · Tech 빨강 세 줄(점 + 선), Skill Level 삼각형도 같은 세 색.
- 캡처: accsaber-stats.png(전체, 캡처 확인) · accsaber-avgacc.png(AP + Avg Accuracy, 캡처 확인) · accsaber-rank.png · accsaber-cat-true.png(캡처 확인: 분류 바꾼 뒤 탭 글자색) · accsaber-cat-tech.png

##### Token Terminal 프로젝트 차트 (해외 · 코인 분석)

- URL https://tokenterminal.com/explorer/projects/uniswap · 2026-11-22 · 다크(사이트 기본, 바탕 #060606) · 차트 카드 면 #0d0d0d · 브랜드 초록(Accept 버튼 · 로고 밑줄).
- 꼴: 카드 제목 「Fully diluted market cap ▾」 드롭다운(검색 + 목록)에서 지표를 고르면 같은 자리에 한 줄. 범례는 왼쪽 위 「● Uniswap $4.0B Latest」 점 + 값 칸.
- 지표별 선(눌러 확인, SVG 2px): Fully diluted market cap · Total value locked · Token holders · Trading volume 모두 rgb(26,255,171) #1affab(14.75:1). 범례 점도 같은 색.
- 지표를 바꿀 때 색: 안 바뀜(한 색). 색은 지표가 아니라 프로젝트(계열) 순서를 따름(비교를 켜면 둘째 프로젝트가 파랑, D18 참고).
- 격자 rgba(229,229,229,0.06) · 축 글자 회색.
- 캡처: tokenterminal-addmenu.png(FDV, 캡처 확인) · tokenterminal-switch-menu.png(캡처 확인) · tokenterminal-switch-tvl.png · tokenterminal-switch-holders.png(TVL 고른 상태로 찍힘, 캡처 확인) · tokenterminal-switch-tradingvol.png

##### OpenPanel 공개 공유 대시보드 (해외 · 분석 도구)

- URL https://dashboard.openpanel.dev/share/overview/zef2XC · 2026-11-22 · 다크(html class "dark system", colorScheme 따라감) · 차트 카드 면 #1a1a1a · 쪽 바탕 #141414 · 브랜드 파랑(로고).
- 꼴: 위 지표 칸(Unique visitors · Sessions · Pageviews · Pages per session · Bounce rate · Session duration)을 누르면 아래 큰 차트가 그 지표 한 줄로 바뀜(하나만 고름). 고른 칸은 왼쪽 파랑 세로 막대. 칸 안 작은 막대도 모두 파랑.
- 지표별 선(눌러 확인, SVG 2px + 점 + 면 그라데이션 #2563eb 0.18→0): Unique visitors · Sessions · Bounce rate · Session duration 모두 rgb(37,99,235) #2563eb(3.37:1). CSS 변수 --chart-line-primary oklch(54.6% .22 263)(= --chart-0), --chart-line-secondary oklch(72.2% .17 33.7).
- 지표를 바꿀 때 색: 안 바뀜(한 색).
- 격자 oklch(0.271 0 0) 4px 4px 점선 · 축 글자 --chart-label oklch(72.4% 0 0). 가리킴: 같은 색 점 + 면색 테두리 2px.
- 캡처: openpanel.png(캡처 확인) · openpanel-sessions.png · openpanel-bounce.png · openpanel-duration.png · openpanel-hover.png

##### Akatsuki osu! 사설 서버 프로필 (해외 · 리듬게임)

- URL https://akatsuki.gg/u/101966?mode=0&rx=0 · 2026-11-22 · 다크(사이트 기본, html #151117) · 차트 면 #161616 · 브랜드 분홍 · 보라 · 파랑 로고.
- 꼴: 차트 위 두 칸 버튼(Rank · PP) 중 하나를 고르면 같은 자리에 한 줄(90일). 고른 버튼 면 rgb(77,77,77) 글자 흰, 안 고른 버튼 rgb(38,38,38) 글자 흰 69%. 범례 없음.
- 지표별 선(눌러 확인, ApexCharts SVG 3px + 같은 색 그라데이션 면): Rank rgb(165,23,247) #a517f7(3.50:1) · PP rgb(44,151,251) #2c97fb(5.97:1). 가리킴 세로 점선도 지표 색 1px 3px.
- 지표를 바꿀 때 색: 바뀜(Rank 보라 · PP 파랑).
- 격자 rgba(255,255,255,0.06) · 축 글자 회색.
- 캡처: akatsuki-rank.png · akatsuki-pp.png (캡처 확인)

##### Swetrix 공개 데모 (해외 · 분석 도구)

- URL https://swetrix.com/projects/STEzHcB1rALV · 2026-11-22 · 다크(사이트의 Switch theme → Dark, 쿠키 colour-theme=dark, 로그인 없음) · 차트 카드 면 #050a1d · 쪽 바탕 #020618.
- 꼴: 기본은 Sessions 한 줄. 오른쪽 위 눈 아이콘 「METRICS VISUALISATION」 메뉴에서 Show all views · Revenue · Session duration · Bounce rate · Views per session · Trend lines 등을 켜고 끔(여러 개 함께). 차트 아래 가운데 범례 「● Sessions ● Total page views ● Bounce rate (%)」 점 + 글자. 비율 지표는 오른쪽 축.
- 지표별 선(눌러 확인, billboard.js SVG 1.5px, 마지막 칸은 6px 2px 점선, Sessions 밑 면 그라데이션 0.2): Sessions rgb(37,99,235) #2563eb(3.81:1) · Total page views rgb(217,119,6) #d97706(6.17:1) · Bounce rate rgb(42,196,179) #2ac4b3(9.03:1). Session duration 은 눌렀지만 줄이 보이지 않아 미확인.
- 지표를 바꿀 때 색: 바뀜(지표마다 색).
- 격자 oklch(0.279 0.041 260) 3px 3px 점선 · 축선 oklch(0.446 0.043 257).
- 캡처: swetrix.png(Sessions 하나, 캡처 확인) · swetrix-metrics-menu.png · swetrix-metrics-bounce-on.png · swetrix-metrics-views-on.png · swetrix-metrics-closed.png(세 줄, 캡처 확인)

##### GitHub 저장소 Insights 「Contributors」 (해외 · 개발)

- URL https://github.com/sindresorhus/ky/graphs/contributors · 2026-11-22 · 다크(로그아웃 상태에서 colorScheme 따라감) · 쪽 · 차트 면 #0d1117.
- 꼴: 오른쪽 위 「Contributions: Commits ▾」 메뉴(Commits · Additions · Deletions)로 지표를 고르면 같은 자리(「Commits over time」 → 「Deletions over time」)와 사람별 작은 차트가 바뀜. 선이 아니라 막대(아래 범위 선택 미니 차트는 선 1px). 범례 없음.
- 지표별 색(눌러 확인, Highcharts SVG): Commits · Additions · Deletions 모두 rgb(5,118,255) #0576ff(4.54:1), 막대 테두리 면색 #0d1117 1px, 미니 차트 면 같은 색 0.05.
- 지표를 바꿀 때 색: 안 바뀜(한 색). 같은 쪽 글자 「20,894 ++」 초록 · 「4,229 --」 빨강은 따로 있으나 차트는 파랑 그대로.
- 격자 rgba(61,68,77,0.7) 4px 3px 점선.
- 참고: facebook/react 처럼 커밋이 10,000 넘는 저장소는 이 메뉴가 없음(github-contrib.png).
- 캡처: github-contrib-menu.png · github-contrib-additions.png · github-contrib-deletions.png (캡처 확인)

##### Liwan 공개 데모 (해외 · 분석 도구)

- URL https://demo.liwan.dev/ · 2026-11-22 · 다크(colorScheme 따라감, 바탕 #0a0c10) · 차트 카드 면 #1b212c · 브랜드 무채색(로고 흰).
- 꼴: 카드 위 지표 칸(Total Views · Unique Visitors · Avg. Time on Site · Bounce Rate) 중 하나를 누르면 아래 같은 자리에 그 지표 한 줄. 고른 칸은 옅은 면 + 흰 글자. 범례 없음. 칸 안 증감은 초록 ↗ · 빨강 ↘ 글자.
- 지표별 선(눌러 확인, SVG 1.75px + 면 rgba(166,206,227,0.1), 마지막 칸은 5px 5px 점선): Total Views · Unique Visitors · Avg. Time on Site · Bounce Rate 모두 rgb(166,206,227) #a6cee3(9.66:1).
- 지표를 바꿀 때 색: 안 바뀜(한 색).
- 격자 rgb(82,95,122) 0.5px 2px 2px 점선 · 축 글자 회색.
- 캡처: liwan-unique.png · liwan-avgtime.png · liwan-bounce.png (캡처 확인)

##### Databuddy 공개 데모 (해외 · 분석 도구)

- URL https://app.databuddy.cc/demo/OXmNQsViBT-FOS_wZCTHc (www.databuddy.cc/demo 안 iframe 주소) · 2026-11-22 · 다크(바탕 rgb(25,25,29)) · 차트 카드 면 #1e1e23.
- 꼴: 「Traffic trends」 차트 아래 범례(Bounce rate · Pageviews · Session duration · Sessions · Visitors)를 눌러 계열을 켜고 끔(여러 개 함께). 기본은 Pageviews · Visitors 두 줄. 켜진 범례 점 · 글자색이 그 계열 색, 꺼진 항목은 회색 rgb(204,204,204) 점.
- 지표별 선(눌러 확인, SVG 2.5px + 면 그라데이션 0.6, 마지막 칸 5px 3px 점선): Pageviews rgb(46,39,245) #2e27f5(2.15:1) · Visitors rgb(64,188,247) #40bcf7(7.71:1) · Bounce rate rgb(245,158,11) #f59e0b(7.73:1) · Session duration rgb(239,68,68) #ef4444(4.41:1) · Sessions rgb(139,92,246) #8b5cf6(3.92:1).
- 지표를 바꿀 때 색: 바뀜(지표마다 색).
- 같은 쪽 다른 차트: 위 숫자 칸 작은 선은 지표와 상관없이 모두 rgb(139,128,191) #8b80bf(4.69:1) 1.5px.
- 격자 rgb(59,59,69) 0.35 2px 4px 점선.
- 캡처: databuddy-default.png · databuddy-bounce-on.png · databuddy-duration-on.png · databuddy-sessions-on.png (캡처 확인)

#### D18 두 계열 비교 선 + 범례

##### BeatLeader 점수 상세 왼손 · 오른손 (해외 · 리듬게임)

- URL https://beatleader.com/score/15841789 · 2026-11-22 · 다크 · 차트 면 #151515.
- 짝: 왼손 = 빨강, 오른손 = 파랑. 같은 짝을 원형 점수(SVG stroke rgb(168,32,32) / rgb(32,100,168), 12px) · TD · PRE · POST 칸 면 · 구간별 정확도 선 · 막대에 모두 씀.
- 구간 그래프(캔버스): 선 #ff8888(7.94:1) / #8888ff(6.10:1) + 회색 선 #ffffff88, 막대 #ee5555(5.27:1) / #5555ee(3.41:1). 차트 안 범례 없음(색 짝은 위 원형 · 칸 면으로 읽음).
- 정확도 추이 한 줄은 #72a8ff(7.62:1).
- 캡처: beatleader-score.png (캡처 확인)

##### Fathom Analytics 데모 「지난 기간」 비교 (해외 · 분석 도구)

- URL https://usefathom.com/demo → 「+ Add comparison」 → 「Previous period」(눌러 확인) · 2026-11-22 · 다크 · 차트 면 #0b0e0c.
- 짝: 이번 기간 = 지표 색 그대로(Site visitors #c7bcff 2px, 면 0.2) / 지난 기간 = 어두운 회녹 rgb(47,54,49) #2f3631 2px 실선(1.56:1). 지난 기간은 점선이 아니라 면 바로 위 옅은 실선.
- 비교를 켜면 지표 칸은 하나만 켜짐(Pageviews 를 누르면 Site visitors 와 바뀜). 범례 대신 위 줄에 「compared to Previous period: Nov 8 to Nov 14」 글과 칸마다 +35 같은 증감(초록 · 빨강 글자).
- 캡처: fathom-cmp-prev.png (캡처 확인) · fathom-cmp-prev-visitorsonly.png · fathom-cmp-hover.png

##### CoinGecko 코인 비교 (해외 · 코인)

- URL https://www.coingecko.com/en/coins/bitcoin → 「Compare ▾」 → Ethereum → Done(눌러 확인) · 2026-11-22 · 다크(is_dark) · 차트 면 #0d1217.
- 짝: 기준 코인 BTC = 주황 rgb(240,157,78) #f09d4e(8.64:1) / 비교 코인 ETH = 자주 rgb(150,52,135) #963487(2.81:1). 둘 다 2px 실선, 면 없음, y축은 % 변화로 바뀜.
- 범례: 차트 왼쪽 위 「● BTC ● ETH」 점 + 글자. 혼자 볼 때 쓰던 오름 · 내림 빨강 · 초록은 비교를 켜면 사라짐.
- 캡처: coingecko-cmp-eth.png · coingecko-cmp-hover.png (캡처 확인) · coingecko-cmp-menu.png

##### Token Terminal 「Compare with」 (해외 · 코인 분석)

- URL https://tokenterminal.com/explorer/projects/uniswap → Compare with → Aave(눌러 확인) · 2026-11-22 · 다크 · 차트 면 #0d0d0d.
- 짝: 기준 Uniswap = 초록 #1affab(14.75:1, 비교 뒤 3px) / 비교 Aave = 파랑 rgb(72,105,239) #4869ef(4.20:1, 2px). 둘 다 실선 · 면 없음.
- 범례: 위 칸 두 개 「● Uniswap $4.0B Latest」 「● Aave $1.6B Latest ×」(점 + 값, 비교 칸에 지우기 ×). 같은 쪽 체인 막대 범례 첫 두 색도 #1affab · #4869ef.
- 캡처: tokenterminal-cmp-aave.png (캡처 확인) · tokenterminal-cmp-search.png

##### OpenPanel 공유 대시보드 「지난 기간」 (해외 · 분석 도구)

- URL https://dashboard.openpanel.dev/share/overview/zef2XC · 2026-11-22 · 다크 · 차트 면 #1a1a1a. 따로 켜지 않아도 기본으로 두 줄.
- 짝: 이번 기간 = 파랑 #2563eb 2px + 점 + 면(3.37:1) / 지난 기간 = 흰 oklch(0.985 0 0 / 0.4)(면과 섞어 #747474, 3.72:1) 2px 실선 + 회색 점, 면 없음. 선 양 끝 15% 는 투명으로 흐려지는 그라데이션(두 줄 모두).
- 범례 없음. 차트 이름(UNIQUE VISITORS)과 칸의 증감 %(빨강 ↓ · 초록 ↑ 글자)로 읽음. 지표를 바꿔도 짝은 그대로(파랑 / 흰 40%).
- 캡처: openpanel.png (캡처 확인) · openpanel-hover.png

##### Swetrix 데모 「vs Previous period」 (해외 · 분석 도구)

- URL https://swetrix.com/projects/STEzHcB1rALV → 날짜 메뉴 → Compare(눌러 확인) · 2026-11-22 · 다크(colour-theme=dark) · 차트 면 #050a1d.
- 짝: 이번 기간 = rgb(37,99,235) #2563eb 1.5px + 면 그라데이션(3.81:1) / 지난 기간 = 같은 색 40% rgba(37,99,235,0.4)(면과 섞어 #122e6f, 1.54:1) 1.5px 실선, 면 없음. 색상은 같고 투명도만 다름.
- 범례: 아래 「● Sessions」 하나뿐(지난 기간 항목 없음). 위 막대에 「Last 7 days vs Previous period」 글.
- 캡처: swetrix-cmp-cmp1.png (캡처 확인) · swetrix-cmp-datemenu.png

##### mempool.space 「해시레이트 & 난이도」 (해외 · 코인, 한국어 화면)

- URL https://mempool.space/graphs/mining/hashrate-difficulty · 2026-11-22 · 다크(사이트 기본) · 차트 면 #000000 · 브랜드 보라(검색 버튼 · 고른 메뉴 칸).
- 짝(같은 지표 비교가 아니라 단위가 다른 두 지표, 왼쪽 · 오른쪽 축): 해시레이트 = 노랑 계열(범례 칩 #ffb300 11.70:1, 날값 선은 그라데이션 #F4511E→#FB8C00→#FFB300→#FDD835→#7CB342 의 60% 1px, 이동 평균은 같은 그라데이션 3px) / 난이도 = 진분홍 rgb(216,27,96) #d81b60 3px 계단선(4.25:1).
- 범례: 차트 위 가운데 둥근 사각 칩 + 글자 「해시레이트 · 난이도 · 해시레이트 (이동 평균)」. 칩 색은 이동 평균 줄의 시간에 따라 바뀌는 색과 달리 #ffb300 하나.
- 격자 rgba(255,255,255,0.733) 투명도 0.25 점선.
- 캡처: mempool-hashrate.png (캡처 확인) · mempool-hashrate-hover.png

##### Monkeytype 시험 결과 「wpm · raw」 (해외 · 타자 기록)

- URL https://monkeytype.com/ · 2026-11-22 · 다크(기본 테마 serika dark) · 쪽 바탕 #323437 · 차트 면 픽셀 #2f3134 · 브랜드 노랑 #e2b714(--main-color).
- 실제로 15초 시험을 쳐서(로그인 없음, 쿠키는 「reject non-essential」) 결과 쪽을 잼. 저장 · 제출 없음.
- 짝: wpm(내 속도) = 노랑 --main-color #e2b714(6.84:1, 픽셀 #e2b713) 선 + 점 / raw(오타 포함 속도) = 회색 --sub-color #646669(2.27:1, 픽셀 #646669) 선. 오류는 --error-color #ca4754 ×(이번 시험은 오류 0 이라 안 그려짐).
- 범례: 차트 안 범례 없음. 왼쪽 큰 「wpm 244」 노랑 숫자와 아래 「raw 244」 노랑 숫자, 라벨은 회색 #646669. 오른쪽 축 이름 「Errors」.
- 캔버스 값은 따로 잡지 않고 테마 CSS 변수 + 캡처 픽셀로 맞춤(픽셀).
- 캡처: monkeytype-result.png (캡처 확인)

##### GitHub 저장소 Insights 「Code frequency」 (해외 · 개발)

- URL https://github.com/sindresorhus/ky/graphs/code-frequency · 2026-11-22 · 다크 · 차트 면 #0d1117.
- 짝: Additions = 초록 rgb(47,111,55) #2f6f37(3.11:1) 위쪽 막대 / Deletions = 빨강 rgb(235,51,66) #eb3342(4.58:1) 0 아래 막대. 선이 아니라 위아래로 갈라진 막대.
- 범례: 차트 오른쪽 세로 「■ Additions ■ Deletions」 네모 + 글자.
- 같은 서비스의 Contributors 쪽 글자 「++」 초록 · 「--」 빨강과 같은 짝.
- 캡처: github-contrib-codefreq.png (캡처 확인)

##### FotMob 경기 「Momentum」 (해외 · 스포츠 기록)

- URL https://www.fotmob.com/matches/leeds-united-vs-arsenal/2rkmmx#5795465 (끝난 경기 Arsenal 2–1 Leeds) · 2026-11-22 · 다크(사이트 기본, 바탕 #000) · 카드 면 #1d1d1d.
- 짝: 홈 Arsenal = 팀색 빨강 #bd0510(2.56:1, 면 픽셀 #a10913) 0 위쪽 면 / 원정 Leeds = 팀색 흰 #ffffff(16.86:1) 0 아래쪽 면. 한 path 를 splitColor 그라데이션(같은 offset 에서 색이 끊김)으로 위아래 두 색으로 나눔. 선이 아니라 위아래 면.
- 범례 없음. 팀 이름 · 엠블럼이 위에 있고, 옆 「Top stats」 점유율 막대 · 수치 칩도 같은 짝(Arsenal 빨강 칩, Leeds 흰). 짝 색은 고정이 아니라 두 팀 팀색에서 옴.
- 축: 0' · HT · FT 글자, 가운데 HT 점선.
- 캡처: fotmob-momentum-momentum.png (캡처 확인) · fotmob-match.png

##### ScoreSaber 점수 「세부 정보」 왼손 · 오른손 (해외 · 리듬게임, 한국어 화면)

- URL https://scoresaber.com/u/76561199471863419 → 첫 점수 「세부 정보 보기」(눌러 확인) · 2026-11-22 · 다크 · 차트 면 #020203.
- 짝: 왼손 = 빨강 rgba(239,68,68) #ef4444(5.58:1) / 오른손 = 파랑 rgba(59,130,246) #3b82f6(5.71:1). 원형 점수 테두리(113.28 빨강 · 113.57 파랑), TD 칩, 구간 그래프 선(1 투명도) · 점 · 막대(0.85)에 모두 같은 짝. 둘 사이 회색 선 rgba(235,235,235,0.8). 막대 아래 면 0.12.
- 범례 없음(원형 점수 두 개가 왼쪽 빨강 · 오른쪽 파랑으로 놓여 범례 노릇). 같은 쪽 정확도 추이 한 줄은 초록 rgba(22,162,73,1) #16a249(= 프로필 「평균 정확도」 지표 색).
- BeatLeader(D18 첫 곳)와 같은 빨강 왼손 · 파랑 오른손 짝.
- 캡처: scoresaber-score-detail.png(전체) · scoresaber-score-detail-crop.png (캡처 확인)

#### 라이트만

#### 막힘

- Kamaitachi (kamai.tachi.ac/u/zkldi/games/iidx/SP) — 로그인 벽. IIDX FAST/SLOW 쪽도 같은 사이트라 못 봄.
- Lichess 프로필 — 보안 확인(봇 검사) 쪽.
- Pirsch 대시보드 데모 · Ackee 데모 — 로그인 쪽으로 넘어감.
- 빗썸 거래 쪽 — net::ERR_HTTP2_PROTOCOL_ERROR 로 안 열림.

### T5 · E2 실측 (2026-11-22)

- T5(설명 · 안내 속 계산 곡선): 다크 쪽에서 잰 곳 4(국내 1 · 해외 3) — 모두 그림(png). 그중 선 하나는 2곳(V-ARCHIVE · Chunithm English Guide, 둘 다 흰 바탕 그림), 두 계열 2곳(Chess.com 면 2개 · osu! 뉴스 선 2개). 디자인 시스템 지침 3(Atlassian · Carbon · Polaris Viz, 값은 리포 기록) + 차트 라이브러리 기본값 8(Recharts · ECharts · Chart.js · Highcharts · Plotly · Vega · MUI X · Nivo). 열어 본 서비스 21곳 — 드묾, 15곳 목표 못 채움.
- E2(항목별 조각 막대 + 범례): 다크로 잰 곳 7(국내 0 · 해외 7: GitHub · Codeberg · Gitea · GitLab · RAWG · ewgf.gg · Pontoon) + 꼴 다름 2(Weblate · Tangled). 디자인 시스템 5(Primer · Carbon Charts · Mantine · Tremor · Ant Design) + 한 조각만 3. 열어 본 서비스 67곳(국내 22) — 국내 다크에서 찾지 못함, 15곳 목표 못 채움.
- 라이트만 · 막힘 · 미확인: 맨 아래 「열어 봤지만 기능 없음 · 라이트만 · 막힘」 절.

방법: METHOD.md 그대로(headless Playwright · colorScheme dark · 1440×900 · ko-KR · 로그인 없음). 대비는 WCAG 2, 투명은 차트 면과 섞은 색. 캡처는 `caps/t5-e2/`. 「캡처 확인」 = 캡처 파일을 직접 열어 본 곳.

#### T5 설명 · 안내 속 계산 곡선 한 줄

##### V-ARCHIVE 티어 안내 「포인트 획득 수식」 곡선 (국내)

- URL https://v-archive.net/info/manual/tier · 2026-11-22 · 다크(사이트 다크 전환 = 쿠키 `theme=dark`, 켜고 잼) · 쪽 바탕 oklch(0.24 0 0) ≈ #1f1f1f(픽셀) · 캡처 `varchive-tier.png`(쪽 전체) · `varchive-tier-curve-img.png`(그림 원본) (캡처 확인)
- 꼴: 그림(png, 526×903). 흰 바탕 #ffffff 의 표 계산기식 그래프가 다크 쪽에 그대로 박힘. 제목 「획득 포인트」, x 정확도 93.40%–100.00%(0.3% 눈금, 세로 글자), y 76–100, 촘촘한 회색 격자(#f1f1f1–#f5f5f5 픽셀).
- 선: 주황 한 줄, 두께 약 2px(픽셀). 선 한가운데 픽셀 #c7824d–#d0926b(가는 선이라 흰 바탕과 섞임, 평균 #c7824d), 순색 값은 미확인. 끝(100%) 에 점 하나. 범례 없음, 그래프 아래 정확도-포인트 표.
- 같은 쪽 다른 그래프: 「6버튼 TOP50 히스토리」 그림(내 기록 성장 선, 주황 굵은 선 + 큰 점, 흰 바탕 모달 캡처) — 개인 기록이라 T5 아님.
- 대비: 그림 안 흰 바탕 기준 선 #c7824d 3.12 · #d0926b 2.62(픽셀). 그림 흰 바탕 대 쪽 바탕 #1f1f1f 16.48.

##### Chunithm English Guide 「Gain vs. Score」 점수→레이팅 곡선 (해외)

- URL https://chunithm-org.pages.dev/intermediate/rating · 2026-11-22 · 다크(MkDocs Material `slate`, 시스템 다크를 따름) · 쪽 바탕 #1e2129 · 위 막대(브랜드) #4051b5 · 캡처 `chuniorg-rating.png`(쪽) · `chuniorg-score-rating-gain-img.png`(그림 원본) (캡처 확인)
- 꼴: 그림(png, 1017×474). 스프레드시트 차트를 잘라 붙인 흰 바탕 #ffffff 그림, 왼쪽에 점수-가산 표.
- 선: 파란 한 색 #4285f4(픽셀 최빈, 959px) 꺾은선 + 같은 색 원 점 5개(데이터 점마다). 선 두께 약 2px(픽셀). 대비 흰 바탕 기준 3.56. 그림 흰 바탕 대 쪽 바탕 16.09.
- 격자 · 축: 회색 세로 · 가로 격자, 축 글자 회색, 제목 「Gain vs. Score」 회색 큰 글자. 범례 없음.
- 같은 쪽 다른 그림: `rating-calc.png` 는 표(차트 아님).

##### Chess.com 용어 「Elo Rating System」 머리 그림 (해외, 프로필 차트와 다른 쪽)

- URL https://www.chess.com/terms/elo-rating-chess · 2026-11-22 · 다크(사이트 기본) · 쪽 바탕 #302e2b · 글 상자 면 흰 10% → #454340 · 브랜드 주 버튼(Sign Up) 초록 · 캡처 `chesscom-elo.png`(쪽, 아래 앱 홍보 띠가 떠 있으나 그림은 가리지 않음) · `chesscom-elo-curve-img.png`(그림 요소 캡처) (캡처 확인)
- 꼴: 그림(png). 선 하나가 아니라 두 계열 분포 곡선 면: 「Higher Rated Player」 #f05a2a · 「Lower Rated Player」 #fcd157, 겹친 곳 #f48043, 그림 바탕 주황 #f1ab22(픽셀 최빈). 외곽선 없음, 면만.
- 범례: 그림 왼쪽 위 네모 색칸 2개 + 진한 빨강 글자(#b23330 근처 픽셀). 축은 「Probability」 · 「Performance ▸」 글자와 눈금만, 격자 없음.
- 대비: 그림 바탕 #f1ab22 기준 #f05a2a 1.71 · #fcd157 1.36 · 겹침 1.32. 그림 바탕 대 쪽 바탕 6.83.
- T5 「선 하나」 와 꼴이 다름(설명용이지만 두 계열 면). 같은 글의 나머지 그림 5장은 화면 캡처라 차트 아님.

##### osu! 뉴스 「Performance Points & Star Rating Updates」(2021-11-09) 별점 계산 그래프 (해외, 위키와 다른 쪽)

- URL https://osu.ppy.sh/home/news/2021-11-09-performance-points-star-rating-updates · 2026-11-22 · 다크(사이트 기본) · 쪽 바탕 #18171c · 캡처 `osunews-sr-graph.png`(그림 요소 캡처) (캡처 확인)
- 꼴: 그림(png, 504×577). 다크 바탕 그래프 #24222a(쪽 바탕 대비 1.14). 계산식 변경 전후를 보여 주는 두 선: 「Before change」 #66ccff · 「After change」 #ff9966(픽셀 최빈). 선 하나가 아니라 두 계열.
- 범례: 오른쪽 위 상자(#373440 면) 안에 짧은 선 견본 + 이름(흰색 계열). 격자 #393642(1.33) 가로세로, 축 글자 #d2d2d3 근처, 제목 · 부제 흰 글자.
- 대비: #24222a 기준 #66ccff 8.71 · #ff9966 7.48.
- 같은 사이트 위키 「Performance points」 · 「Weighting system」 쪽은 그래프가 없음(열어 봄, 그림 0).

##### T5 디자인 시스템 · 차트 라이브러리 — 단일 계열 · 설명용 차트 기본색 지침 (2026-11-22)

DS 범주 팔레트 값은 리포 `docs/research/2026-11-20-color-chart.md` 623–815행에 있어 다시 재지 않았다. 여기는 「계열 하나일 때 무슨 색」 지침만. 차트 라이브러리는 공식 npm 패키지 tarball 을 받아 코드를 읽기만 함(실행 안 함), 문서는 Playwright 로 본문 글만 읽음. 받은 패키지 `scratchpad/t5e2/pkgs/`.

- Atlassian(문서 https://atlassian.design/foundations/color/data-visualization-color): 「Single-color charts」 절이 따로 있음. 색 하나만 필요하면 `color.chart.brand` 를 기본으로, 상태 · 위험 데이터면 상태 토큰, 하나만 드러내려면 나머지를 `color.chart.neutral`. Do 「단일 색을 기본으로, 범주를 가를 때만 색을 더함」. 값(다크 #4688EC · neutral #7E8188)은 리포 기록 654행.
- IBM Carbon(문서 https://carbondesignsystem.com/data-visualization/color-palettes/ → building-blocks 쪽으로 넘어감): 범주 수가 정해져 있으면 순서 팔레트 대신 「1-Color group」 등 묶음을 쓰라는 지침, 1색 묶음 선택지 4개(라이트 Purple 70 #6929c4 · Blue 80 #002d9c · Cyan 50 #1192e8 · Teal 70 #005d5d). 다크 1색 값은 리포 기록(Carbon 절). 그라데이션은 「단일 범주 차트에서 필요할 때만」.
- Shopify Polaris Viz: 테마에 `seriesColors.single` 키가 있음(다크 blue90 #3672bb). 리포 기록 709행에 이미 있음.
- Recharts 3.11.0(`es6/cartesian/Line.js` · `Area.js` · `Bar.js`): 계열 색을 안 주면 Line · Area stroke #3182bd, Area · Bar fill #3182bd. 다크 테마 없음(바탕 정의 없음).
- Apache ECharts 6.1.0(`lib/visual/tokens.js` 52 · `lib/theme/dark.js`): 첫 계열 #5070dd, 다크 테마도 계열색을 바꾸지 않음(코드 주석 「Don't modify theme colors」). 다크 바탕 #040810(리포 기록 1786행 계산값) 대비 4.49.
- Chart.js 4.6.1(`dist/chart.js` 7421–7440, colors 플러그인): 첫 데이터셋 선 rgb(54,162,235) · 면 같은 색 50% 투명. 기본 바탕 · 다크 테마 없음.
- Highcharts 13.1.1(`highcharts.src.js` 1597 · `themes/adaptive.src.js` 135 · 219 · 247): 첫 계열 #2caffe. adaptive 테마는 `prefers-color-scheme: dark` 에서 바탕 #141414 로 바뀌고 계열색은 그대로, 대비 7.61.
- Plotly.js 4.3.0(`plotly.min.js` colorway defaults): 첫 계열 #1f77b4. 다크 템플릿은 plotly.js 패키지에 없음(미확인).
- Vega 6.4.0(`build/vega.js` 41946 · 14812): 기본 색 #4c78a8(tableau10 첫 색). 다크 테마는 별도 패키지(vega-themes, 안 받음 — 미확인).
- MUI X Charts 9.18.1(`ChartsDataProvider` 기본 `rainbowSurgePalette`, `colorPalettes/categorical/rainbowSurge.mjs`): 첫 계열 라이트 #4254FB · 다크 #495AFB(다크 값이 따로 있음). 바탕은 MUI 테마가 정함(미확인).
- Nivo 0.99(`@nivo/colors` 기본 scheme `nivo`): 첫 색 #e8c1a0. 다크 테마 없음.
- 문서 지침 못 찾음 · 안 읽음: Spectrum(리포 기록대로 문서가 Hub 첫 쪽으로 넘어감), Fluent · Primer · Material 문서 쪽 단일 계열 지침은 안 읽음.

#### E2 항목별 조각 막대 + 범례 점

##### GitHub 저장소 언어 막대 (해외)

- URL https://github.com/vercel/next.js · 2026-11-22 · 다크(로그아웃 `data-color-mode=auto` 가 시스템 다크를 따름) · 바탕 #0d1117 · 막대가 놓인 면 = 바탕(투명) · 캡처 `github-langbar.png` (캡처 확인)
- 꼴: 항목마다 색. 색은 언어마다 정해진 GitHub Linguist 색(테마와 무관한 고정 값). 조각 6개(JavaScript #f1e05a 14.01 · TypeScript #3178c6 4.17 · Rust #dea584 8.85 · MDX #fcb32c 10.47 · CSS #663399 2.25 · Go #00add8 7.18, 대비는 #0d1117 기준).
- 막대: Primer `ProgressBar` 여러 항목(`prc-ProgressBar-ProgressBarItem`), 높이 8 · 조각 사이 gap 2 · 바깥 모서리 반경 3 · 트랙 #3d444d(1.92) · 투명 1px outline.
- 범례: 막대 아래 줄바꿈 목록, 점은 8×8 원(`languageDot`, 배경 = 조각 색) + 이름(#f0f6fc 600 12px) + 몫(#9198a1 400 12px, 예 「46.7%」). 이름 · 몫은 링크.
- 같은 쪽 CSS 변수: 데이터 색 `--data-<이름>-color-emphasis/muted` 18쌍(예 blue #0576ff · red #eb3342 · purple #975bf1) 과 ProgressBar 상태 색(`--progressBar-bgColor-accent` #1f6feb · success #238636 · attention #9e6a03 · danger #da3633 · done #8957e5 · severe #bd561d · sponsors #bf4b8a · neutral #656c76, 트랙 #3d444d). 언어 막대는 이 변수가 아닌 Linguist 색을 인라인으로 씀.
- 브랜드색: 미확인(로그아웃 쪽 주 버튼 없음).

##### Codeberg (Forgejo) 저장소 언어 막대 (해외)

- URL https://codeberg.org/forgejo/forgejo · 2026-11-22 · 다크(테마 `codeberg-auto` 가 시스템 다크를 따름) · 바탕 #171e26 · 막대가 놓인 통계 상자 면 #1d262f · 브랜드색 주 버튼 oklch(0.758 0.153 245.9) ≈ #50b8ff, 위 막대 #2185d0 · 캡처 `codeberg-page.png` · `codeberg-langbar-open.png` (캡처 확인)
- 꼴: 항목마다 색(Linguist 색, GitHub 과 같은 값). 조각 6개: Go #00add8 5.81 · go-html-template #cccccc 9.54 · TypeScript #3178c6 3.38 · JavaScript #f1e05a 11.35 · CSS #663399 1.82 · 기타 #cccccc 9.54(대비는 #1d262f 기준). 색 없는 언어와 「기타」 는 같은 회색 #cccccc.
- 막대: 통계 상자 아래 끝에 붙은 전폭 띠 높이 11, 조각 사이 틈 없음 · 모서리 0 · 트랙 없음.
- 범례: 평소 숨김. 막대를 누르면(`<details>` 열림) 아래 한 줄에 점 14×14 원(`color-icon`) + 이름(#d2e0f0 600 14px) + 몫(400 14px, 예 「81.7%」) 6개가 고르게 퍼짐.

##### Gitea.com 저장소 언어 막대 (해외)

- URL https://gitea.com/gitea/act_runner · 2026-11-22 · 다크(`gitea-auto`) · 바탕 #1e1f20 · 막대 면 = 바탕(오른쪽 사이드바) · 브랜드색 주 버튼 #4183c4 · 캡처 `gitea-page.png` (캡처 확인)
- 꼴: 항목마다 색(Linguist 색). 조각 5개: Go #00add8 6.26 · JavaScript #f1e05a 12.22 · Shell #89e051 10.10 · Makefile #427819 3.09 · PowerShell #012456 1.09(#1e1f20 기준).
- 막대: 높이 10 · 바깥 모서리 반경 5 · 조각 사이 틈 약 2(폭 합 272 / 전체 280 에서 셈) · 트랙 없음.
- 범례: 막대 아래 늘 보임, 줄바꿈 꼴. 점 14×14 원(`color-icon`) + 이름(#d2d4d8 600 14px) + 몫(400 14px).

##### GitLab.com 프로젝트 언어 막대 (해외)

- URL https://gitlab.com/gitlab-org/gitlab-runner · 2026-11-22 · 다크(로그아웃도 `gl-system` → `gl-dark`) · 바탕 #050506 · 막대가 놓인 본문 패널 #18171d(픽셀) · 캡처 `gitlab-page.png` (캡처 확인)
- 꼴: 항목마다 색(Linguist 색). 조각 5개: Go #00add8 6.76 · Shell #89e051 10.89 · Makefile #427819 3.33 · HCL #844fba 3.23 · PowerShell #012456 1.18(#18171d 기준). 언어 이름 · 몫은 조각의 툴팁 속성에서 읽음(Go 98.5% · Shell 0.9% · Makefile 0.4% · HCL 0.1% · PowerShell 0.1%).
- 막대: `progress repository-languages-bar`, 높이 8 · 반경 4 · 트랙 #28272d · 조각 사이 틈 없음 · 작은 몫은 최소 8px 로 보임.
- 범례: 없음. 조각에 마우스를 올리면 툴팁(`has-tooltip`)만.

##### RAWG 게임 평가 분포 막대 (해외)

- URL https://rawg.io/games/the-witcher-3-wild-hunt · 2026-11-22 · 다크(사이트 기본 다크) · 바탕 #151515 · 막대 면 = 바탕 · 캡처 `rawg-ratings.png` · `rawg-page.png` (캡처 확인). 아래 쿠키 안내 띠는 닫기 버튼만 있는 알림이라 누르지 않음, 막대는 가리지 않음.
- 꼴: 항목마다 색, 조각마다 세로 그라데이션. 조각 4개(평가 4단계): Exceptional #b4ec51→#429321 · Recommended #649bff→#4354b9(0deg) · Meh #fad961→#f76b1c · Skip #ff5764→#f11a2a. #151515 대비: 13.09/4.72 · 6.67/2.79 · 13.19/6.15 · 5.91/4.28(그라데이션 두 끝).
- 막대: 높이 50 · 바깥 모서리 반경 4(첫 조각 왼쪽 · 끝 조각 오른쪽만) · 조각 사이 틈 없음 · 트랙 없음. 가장 큰 조각과 둘째 조각 안에 단계 이모지 그림(65 · 50px).
- 범례: 막대 아래 줄바꿈, 점 10×10 원(조각과 같은 그라데이션) + 이름(#ffffff 700 14px) + 개수(흰 40% → #737373, 3.83, 400 14px, 예 「5664」). 몫 % 표기 없음.

##### ewgf.gg 「Recently Active Players」 지역 몫 막대 (해외, 철권 8 통계)

- URL https://www.ewgf.gg/ · 2026-11-22 · 다크(사이트 기본) · 바탕 body #1c1f26 · 칸 면 = 흰 3.5%→1% 그라데이션 + 테두리 흰 6%, 픽셀 #1d2433 · 캡처 `ewgf-bar.png` · `ewgf-page.png` (캡처 확인)
- 꼴: 항목(지역)마다 색. 조각 6개: Americas #199e70 · Europe #c98500 · Asia #3987e5 · Oceania #d95926 · Middle East #9085e9 · Region Not Set #4b5563(회색). 칸 픽셀 #1d2433 대비 4.56 · 5.06 · 4.27 · 4.00 · 4.97 · 2.05. 막대 안 순서와 범례 순서가 다름(막대는 고정 순서, 범례는 몫 큰 순).
- 막대: 높이 10 · 끝 둥근 알약(rounded-full, 첫 · 끝 조각만) · 조각 사이 gap 2 · 트랙 없음.
- 범례: 막대 아래 세로 목록, 점은 10×10 둥근 네모(반경 4) + 이름(#d1d5db 14px) + 수(#ffffff 14px) + 몫(#6b7280 14px, 「41.8 %」) 오른쪽 정렬.
- 같은 칸 위: 큰 숫자 「6,962 players」 + 「LIVE」 초록 배지(#34d399 점).

##### E2 디자인 시스템 — 여러 조각 막대 부품

문서 쪽은 Playwright 다크(사이트 다크 전환이 localStorage 면 켬)로 재고, 패키지 값은 npm tarball 을 받아 읽기만 함(`scratchpad/t5e2/pkgs/`).

- GitHub Primer `ProgressBar` + `ProgressBar.Item`(`@primer/react@38.46.0` `dist/ProgressBar/ProgressBar-3d1db6c7.css`): 한 컨테이너에 Item 여럿, Item 마다 `bg` 로 색. 컨테이너 flex · gap 2px · 반경 `--borderRadius-small`(3px) · 트랙 `--progressBar-track-bgColor`(다크 실측 #3d444d) · 투명 1px outline. 높이 default 8 · small 5 · large 10. Item 기본색 `--bgColor-success-emphasis`. 다크 상태 색(github.com 실측 CSS 변수): accent #1f6feb 4.08 · success #238636 4.09 · attention #9e6a03 4.07 · danger #da3633 4.11 · done #8957e5 4.11(#0d1117 기준). 범례는 부품에 없음(GitHub 언어 막대는 따로 목록을 둠). 문서 primer.style 은 다크로 열리지 않아(흰 바탕) 실제 쓰임은 위 GitHub 언어 막대로 잼.
- IBM Carbon Charts 「Proportional meter」(`@carbon/charts@1.27.27` `dist/index.mjs` meter 설정 · `scss/graphs/_meter.scss`): 높이 proportional 16(기본 8) · 조각 사이 divider 2 · 트랙 `rect.container` = 테마 `$layer-01`(g100 #262626, #161616 대비 1.20). 조각 색은 범주 팔레트를 순서대로(다크 1–5: #8a3ffc 3.62 · #33b1ff 7.65 · #007d79 3.63 · #ff7eb6 7.68 · #fa4d56 5.40, 리포 기록 Carbon 절 값). 범례 꼴 · 문서 쪽 렌더는 미확인(스토리북 주소가 소개 쪽으로 넘어감).
- Mantine `Progress` 복합(Progress.Root + Section 여럿)(문서 https://mantine.dev/core/progress/ , localStorage `mantine-color-scheme-value=dark`): 데모 3조각 Documents #0c8599 · Photos #c2255c · Other #e8590c, 트랙 dark-4 #424242, 높이 16(md 8 · xl 16), 반경 8(첫 · 끝 조각만 둥금), 조각 사이 틈 없음. 범례 없음 — 조각 안에 이름 글자(Progress.Label, 흰색 계열). 쪽 바탕 #242424 대비 3.57 · 2.74 · 4.34, 트랙 1.54. 캡처 `ds-mantine-progress.png` (캡처 확인)
- Tremor `CategoryBar`(문서 https://tremor.so/docs/visualizations/category-bar , localStorage `theme=dark`): 3조각 blue-500 #2b7fff · emerald-500 #00bc7d · violet-500 #8e51ff(둘째 데모 pink-500 #f6339a · amber-500 #fe9a00 · emerald), 높이 8 · gap 0.5(2px) · 끝 둥금. 범례 없음 — 막대 위에 누적 경계 숫자(0 · 55 · 85 · 100). 데모 면 #090e1a(픽셀) 대비 5.12 · 7.79 · 4.38 · 5.38 · 9.03. 캡처 `ds-tremor-categorybar.png` (캡처 확인)
- Ant Design `Progress` `success` 조각(문서 https://ant.design/components/progress , 다크 기본 #141414): 두 조각만 — 전체 진행 #1668dc(3.55) 위에 성공 몫 #49aa19(6.18)를 왼쪽부터 겹침, 트랙 흰 12% → #303030(1.40), 높이 8 · 반경 100. `steps` 꼴은 칸 나눔(14×8 칸, 같은 색)이라 항목별 색 아님. 범례 없음, 끝에 「60%」.
- 한 조각만 있는 부품(여러 항목 몫 없음, 패키지 props 로 확인): Atlassian `@atlaskit/progress-bar@5.3.7`(value 하나) · Microsoft Fluent `@fluentui/react-progress@9.5.7`(value · max) · Adobe `@spectrum-css/meter@1.2.0`(fill 하나). Shopify Polaris ProgressBar 는 패키지를 안 받음(미확인).

##### Mozilla Pontoon 번역 진행 몫 막대 (해외)

- URL https://pontoon.mozilla.org/projects/firefox/ (목록 https://pontoon.mozilla.org/projects/ 도 같은 막대) · 2026-11-22 · 다크(사이트 기본) · 바탕 #272a2f · 머리 면 #333941 · 캡처 `pontoon-firefox.png`(머리 범례 · 도넛) · `pontoon-firefox-list.png`(줄마다 막대) (캡처 확인)
- 꼴: 항목이 아니라 상태 분류마다 색(번역됨 · 미리 번역 · 경고 · 오류 · 빠짐). 조각 최대 5개: Translated #7bc876 · Pretranslated #c0ff00 · Warnings #ffa10f · Errors #ff3366(범례 픽셀) · Missing #5f7285. #272a2f 대비 7.11 · 12.03 · 7.10 · 4.06(오류, 픽셀값) · 2.90. 빠짐(회색)이 남은 몫 트랙 역할.
- 막대: 표 줄마다 폭 295 · 높이 3 의 얇은 막대(`.chart` div 조각), 조각 사이 틈 없음 · 모서리 없음, 오른쪽에 「62%」 같은 몫 글자. 머리에는 같은 분류의 도넛(캔버스 130×130) + 큰 「62 %」.
- 범례: 머리 한 곳에만, 네모 색칸(약 12px, 픽셀로 확인) + 대문자 이름(#aaaaaa) + 개수 오른쪽 정렬. 줄마다 막대에는 범례 없음.

##### Hosted Weblate 언어별 번역 막대 (해외) — 꼴 다름(한 색조 명도 2단)

- URL https://hosted.weblate.org/projects/weblate/ · 2026-11-22 · 다크(시스템 다크를 따름) · 바탕 #1a1d1e · 캡처 `weblate-page.png` (캡처 확인)
- 꼴: 항목마다 다른 색이 아님. 한 막대를 승인됨 #124437(진한 청록) · 번역됨 #256d5f(밝은 청록) 으로 나누고 남은 몫은 트랙 #343a40(픽셀). #1a1d1e 대비 1.54 · 2.77 · 트랙 1.47. 표 줄 아래 전폭 얇은 막대, 범례 없음(열 머리 「승인됨 · 번역됨」 글자가 대신함). E2 꼴(항목마다 다른 색 + 범례 점)과 달라 참고로만 적음.

##### Tangled 저장소 언어 (해외) — 꼴 다름(언어마다 따로 막대)

- URL https://tangled.org/tangled.org/core · 2026-11-22 · 다크(사이트 기본) · 바탕 #141414 · 캡처 `tangled-page.png`(캡처 열어 보지 않음)
- 한 막대를 나누지 않고 언어마다 줄 하나: 점 10×10 원 + 이름(#fafafa 12px) + 몫(#a4a4a4 12px) 아래에 높이 4 · 둥근 막대(트랙 #1f1f1f, 채움 Linguist 색 Rust #dea584 · Go #00add8 · TypeScript #3178c6 · Svelte #ff3e00 · #7e7eff · #cccccc). E2 꼴이 아니라 참고로만.

#### 열어 봤지만 기능 없음 · 라이트만 · 막힘 (세지 않음)

##### T5

- 다크, 계산 곡선 그래프 없음: osu! 위키 Performance points · Weighting system(그림 0) · Gameplay/Accuracy(그림 1장, 열어 보지 않음 — 미확인) · BSMG Wiki Ranking & Scoring Guide(그림 3장, 파일 이름이 pp 화면 · 히트박스 — 열어 보지 않음, 미확인) · RG Stats 문서 CHUNITHM Rating(그림 0) · Tachi 문서 첫 쪽(그림 0, 하위 쪽 안 봄) · Quaver 위키 Gameplay(그래프 그림 0) · 한국어 위키백과 「엘로 평점 시스템」 다크 모드(그림 0) · V-ARCHIVE 성과표 안내 · 난이도 비교 안내(곡선 아님, 그림은 화면 캡처로 보이나 다 열어 보지는 않음) · Chunithm English Guide `rating-calc.png`(표).
- 라이트만: SilentBlue RemyWiki 「オンゲキ Rating」(#f8f9fa) · calculator.net 복리 계산기(#ffffff, 그래프 그림도 없음).
- 막힘: Arcaea Fandom 「Potential」(보안 확인 창) · RoyaleAPI 도움말(보안 확인) · Patreon ScoreSaber 곡선 글(보안 확인) · investor.gov 복리 계산기(Access Denied) · ScoreSaber Reloaded 문서(Page gone) · fluXis 문서(404).
- 열어 본 곳: T5 후보 서비스 21곳(위 4곳 잼 + 기능 없음 10 + 라이트만 2 + 막힘 6, osu! 위키 세 쪽은 한 곳으로 셈) + DS · 라이브러리 13곳(지침 · 기본값 잼 11, Spectrum · 문서 안 읽은 곳 제외).

##### E2

- 다크, 조각 막대 탐지 0(DOM · SVG 자동 탐지 + 일부 캡처로 확인): OSS Insight · Can I use · tactics.tools · Lolalytics · MetaTFT · Backloggd · Hugging Face 데이터셋 · ProtonDB · Untapped.gg(MARVEL SNAP) · Sekai Viewer · Manifold · OpenRouter 순위 · State of JS 2024 프레임워크 쪽 · Bundlephobia(react-dom · @mui/material) · GitHub Pulse · Pikalytics · Bokutachi 첫 쪽 · 닥지지 발로란트 첫 쪽 · 닥지지 발로란트 요원 통계(국내) · fconline.gg(국내) · 나무위키 대통령 선거 문서(국내, 다크 localStorage) · V-ARCHIVE 서열표 · MAX DJPOWER(국내).
- 라이트만: 롤체지지 메타(국내) · 포로지지(국내) · 네이버페이 증권 종목(국내) · 메이플지지(국내) · 닥지지 배그(국내) · 닥지지 이터널 리턴(국내) · FOW.LOL(국내) · 업비트 거래소(국내) · 쟁글(국내) · AniList(localStorage `site-theme=dark` 를 넣어도 흰 바탕) · Bestdori · Artificial Analysis · Gitee. (Mantine · Tremor · Primer 문서는 기본 흰 바탕, Mantine · Tremor 는 다크 전환을 켜고 잼.)
- 막힘: solved.ac 프로필(국내, 보안 확인) · 로아와(국내, 보안 확인) · 키노라이츠(국내, 403) · OP.GG 롤 챔피언 · TFT · 발로란트 · 배그(국내, CloudFront 오류) · 빗썸(국내, HTTP2 오류) · Kamaitachi 프로필(로그인 벽) · u.gg · Dotabuff · STRATZ · PSNProfiles · Exophase · RetroAchievements · HSReplay · tracker.gg · LeetCode · Lichess 오프닝 탐색기 · Electricity Maps(보안 확인 · Cloudflare) · Polymarket(법적 사유로 이용 불가) · Google Trends(429) · Schale.gg(점검) · sourcehut(502) · github-readme-stats(쪽 오류) · STATIZ(주소 못 찾음).
- 미확인: 던담(국내, 바탕 투명으로 잡혀 다크 여부 미확인) · 로스트아크 공식 첫 쪽(국내, 같음) · V-ARCHIVE 성과표(공개 성과표 주소를 못 찾아 못 엶) · WakaTime(공개 프로필 주소가 404).
- 열어 본 곳: E2 후보 서비스 67곳(국내 22 · 해외 45), 그중 다크로 잰 곳 7(모두 해외) + 꼴 다름 2.

### C 묶음 — 디자인 시스템 · 차트 라이브러리 기능별 색 지침 (2026-11-21)

조사만 한다. 추천 · 판단 없음. 팔레트 값 자체는 리포 `docs/research/2026-11-20-color-chart.md` 623–815행에 있고 여기서는 다시 적지 않는다(지침에 딸린 값만).
출처는 공식 문서(WebFetch) 또는 공식 npm 패키지 파일(이전 세션에 받은 tarball, 코드 실행 없이 읽기). 인용은 15단어 넘지 않게 요약.

#### 기능별 요약 (곳 수 = 그 기능에 지침 문장이나 기본값을 찾은 곳. 「없음 · 미확인」 만 나온 곳은 세지 않음)

디자인 시스템 18곳 + 차트 라이브러리 3곳(ECharts · Highcharts · Chart.js)을 봤다. 다크 값은 패키지 · 테마 파일에 있는 곳만 적었다(Atlassian · Carbon · Primer · Polaris Viz · SAP · Fluent · Elastic · Grafana · G2 · Highcharts · ECharts · GitLab 일부).

##### P1 · D20 계열 하나 기본색 — DS 11 · 라이브러리 3

- Atlassian: 한 색 차트는 `color.chart.brand`(다크 #4688EC), 상태 데이터면 상태 토큰. (재확인됨)
- Carbon: 범주 순서 대신 1색 묶음에서 한 색(다크 purple-30 · blue-50 · cyan-40 · teal-40 중). 브랜드색 문장 없음.
- Polaris Viz: 계열 1개면 따로 정한 `seriesColors.single` 다크 #3672bb(범주 1번 · 브랜드 아님).
- Salesforce(옛 판): 같은 측정값의 모든 값은 한 색, 기본 팔레트 1번 #52B7D8.
- Fluent: 색을 비우면 범주 1번(다크 #637cef).
- Elastic: `defaultVizColor` #16C5C0(범주 1번), 일반 요소는 중립 · 찾는 것만 강조색.
- Grafana: 시계열 기본 클래식 팔레트 → 1번 green #73BF69, 「Single color」 방식 따로 있음.
- G2: `colorDefault` #1783FF(범주 1번 = antd primary 파랑).
- GitLab: 한 범위 차트 기본 색조 파랑 `data-blue.500`(다크 · 라이트 공통 단계).
- ONS: 한 색이면 Ocean blue #206095(범주 1번).
- Warp: 선 하나면 `Line/Primary`(파랑), 브랜드 · UI 색은 일반 그래프에 쓰지 말라.
- 라이브러리: ECharts 팔레트 1번 #5070dd(다크 같음) · Highcharts color-0 #2caffe(다크 같음) · Chart.js rgb(54,162,235).

##### D17 지표를 바꿔 볼 때 색 — DS 6 (지표 전환을 직접 말한 곳 0)

- Salesforce: 같은 지표는 모든 차트에서 같은 색, 같은 지표에 다른 색 금지.
- Elastic: 대시보드 색 일관, Metric 차트와 선 차트 색을 맞춤. 한 계열 여러 지표는 같은 갈래 변형 묶음(`rotations` · `group`).
- Grafana: 순서 기반 팔레트는 순서가 바뀌면 색이 바뀜, 「by series name」 은 이름마다 색 고정.
- ONS: 한 묶음 차트에서 같은 범주는 같은 색 · 같은 순서.
- Warp: 한 주색을 그래프 전체에, 무늬 · 색 짝은 그래프 사이 일관.
- Carbon: 범주 색은 정한 순서대로만(배정 일관).
- 나머지(Atlassian · Primer · Polaris · Fluent · GitLab · Codex · Terra · 라이브러리)는 지침 없음.

##### D18 두 계열 비교 — DS 13

- Polaris Viz: 비교(`isComparison`) 계열 다크 rgba(144,176,223,0.8) · 면 없음 · 점선은 데이터로, 짝지은 비교 계열은 원 계열 색 그대로. 증감 표시는 상승 초록 · 하락 회색.
- SAP(토큰만, 지침 막힘): IBCS 실적 다크 #eaeef2 · 지난 기간 #576f86.
- Terra: 비교 짝은 명도가 다른 두 색(예 #887EFC + 회색 #989DA4), 양 #A3D982 · 음 회색, 빨강 · 초록 함께 금지.
- Warp: 주된 선 실선, 보조 선 점선 + `Line/Secondary` 회색.
- Primer: 첫 선 실선, 다음 선은 다른 모양, 점 표시도 선마다 다르게(원부터).
- Atlassian: 덜 중요한 쪽을 `chart.neutral`(다크 #7E8188), 발산 미지원.
- ONS: 강조할 것만 다른 색(기본 강조 주황 #f39431), 덜 중요한 것은 회색.
- GitLab: 발산은 좋고 나쁨 있으면 차가운→따뜻한, 없으면 차가운→차가운. 상태 짝 green + magenta.
- Carbon: 발산 red-cyan 은 온도 뜻, purple-teal 은 온도 뜻 없는 데이터.
- Elastic: 범주 10색 = 다섯 갈래 진한 · 옅은 짝, 발산 Temperature · Complementary.
- Grafana: 값 기준 발산형(Green-Yellow-Red 등).
- Fluent: 점선은 계열마다 `strokeDasharray`, 다른 계열 고르면 나머지 0.1.
- Salesforce: 빨강 = 나쁨 · 초록 = 좋음은 문화마다 다름. Codex: 색 + 기호 순서.

##### T5 참고선 · 주석 · 임계선 — DS 10 · 라이브러리 3

- Atlassian: 임계 · 참고선 `chart.neutral` 다크 #7E8188.
- Carbon: 임계선 기본 red-50 #fa4d56 1px 점선 4, 불릿 목표선 다크 #ffffff, 미터 범위선 다크 #6f6f6f.
- Polaris Viz: 주석 선 다크 gray80 #909099, 목표선은 비교 색 1.5px 둥근 점선.
- Spectrum(라이브러리): 추세선 색 기본 = 그 계열 색, 예시 gray-500 + 점선, 참고선 보조색 gray-600.
- Fluent: 기준값 삼각 표시 다크 #5caae5.
- Elastic: 선 주석 #98A2B3 1px, 면 주석 #98A2B3 25%.
- Grafana: 임계값 Base 초록 · 80 빨강, 선 · 점선 · 면 표시 고름.
- G2: 참고선 다크 #416180 45% 1px, 참고 구간 15%.
- Primer: plot line 2px(색 지정 없음).
- Codex: 참고선은 목표 · 특정 값용(색 지정 없음).
- 라이브러리: ECharts markLine 점선 · 계열 색 이어받음 / Highcharts plotLine 다크 #727272 1px 실선, plotBand 다크 #16242b / Chart.js 주석 선 2px 실선 · 기본 글자색.

##### E2 몫 막대 · 범례 · 색 순서 · 틈 — DS 12 · 라이브러리 1

- Atlassian: 이웃 색 사이 틈 또는 `border.inverse`(다크 #18191A) 테두리, 번호 순서, 5–6색으로 묶음.
- Carbon: 비례 미터 높이 16 · 조각 사이 2px, 범주 순서대로만.
- Primer: ProgressBar 여러 조각 2px 틈 · 빈 칸 다크 #3d444d, 범례 점 + 이름 가로 줄, 이웃 면은 틈 또는 3:1 선, 조각 5개 이하.
- Polaris Viz: 누적 막대 조각 틈 2px, `seriesColors.all` 차례.
- Fluent: 한 줄 몫 막대 조각 틈 3px · 기본 다섯 색(다크 #a9d3f2 · #c8d1fa · #9ad29a · #a3b2e8 · #f4bfab), 세로 누적은 기본 틈 0.
- Elastic: 막대 테두리 기본 꺼짐(틈 없음), 색 위 글자는 밝힌 판 팔레트.
- GitLab: 요소 사이 면 색 1px 틈 또는 1px 테두리.
- Warp: 색 사이 흰 틈(조각마다 1px 씩 빼서 합계 맞춤).
- Codex: 범례 5색까지 · 가로 · 차트 가까이.
- ONS: 조각마다 다른 색, 5색 이하, 한 차트에 같은 색 두 번 금지.
- Salesforce: 숫자에 묶는 팔레트는 5색 정도까지, 색 + 기호 · 글자.
- Spectrum(라이브러리): 불리언 도넛 나머지 조각 gray-400.
- 라이브러리: Highcharts 막대 테두리 = 바탕색 1px(빽빽하면 0) — 누적 조각이 바탕색 선으로 갈림.
- Toss(리포 기록): 자동 색칠 오른쪽부터 blue → green → yellow → orange → red → grey.

사실 메모: SAP Horizon 다크 `--sapChart_OrderedColor_1–5` = #3278be · #f2a634 · #b4ce35 · #fa4f96 · #8b47d7 이고, NosLog 지금 E2 다섯 색 · T5 · P1/D18 색과 hex 가 같다.

#### 원본 기록 (곳마다, 찾은 순서)

##### Atlassian (재확인)

- 문서 https://atlassian.design/foundations/color/data-visualization-color (2026-11-21 WebFetch). 다크 값 `@atlaskit/tokens@20.14.0` `dist/cjs/artifacts/themes/atlassian-dark.js`.
- P1 · D20: 「Single-color charts」 절 — 한 색 차트는 `color.chart.brand` 가 기본. 데이터가 상태 · 심각도면 그 상태 토큰으로. 다크 `--ds-chart-brand` #4688EC(올림 `-hovered` #669DF1). 재확인됨.
- D17: 지표를 바꿀 때 색 지침 없음(미확인).
- D18: 이번 · 지난 기간 · 점선 · 짝 팔레트 지침 없음. 「단계 · 발산 차트 색은 지금 지원하지 않는다」. 한 계열을 드러내려면 덜 중요한 쪽을 `color.chart.neutral`(다크 #7E8188, 올림 #96999E). 두 개 이상 서로 관계없는 범주는 `categorical.1–8` 번호 순서.
- T5: 「Applying color」 표 — 임계선 · 참고선은 `color.chart.neutral`(다크 #7E8188), 격자선 `color.border`, 제목 · 범례 `color.text`, 눈금 글자 `color.text.subtle`. 글자는 차트 색 위에 두지 말고 옆에(차트 색은 4.5:1 미달).
- E2: 누적 · 몫 차트를 따로 말하지는 않음. 번호 순서를 지켜 이웃 색이 갈리게, 이웃한 색 사이에 틈 또는 `color.border.inverse` 테두리(다크 #18191A). 범주는 5–6색으로 묶어 줄임. 범례 순서 지침 없음(미확인).

##### IBM Carbon

- 문서 https://carbondesignsystem.com/data-visualization/color-palettes/ (2026-11-21 WebFetch). 패키지 `@carbon/charts@1.27.27` `scss/components/_threshold.scss` 6–33 · `scss/graphs/_meter.scss` 5–35 · `scss/graphs/_bullet.scss` 4–33 · `scss/_tokens.scss` 74–94 · 142–162 · 211–252 · `dist/color-scale-utils-C1aV7-HR.mjs` 3916–3931.
- P1 · D20: 범주 수가 정해져 있으면 범주 순서 대신 한 색 고르기(1색 묶음: 라이트 문서 값 purple-70 #6929c4 · blue-80 #002d9c · cyan-50 #1192e8 · teal-70 #005d5d, 다크 1색 묶음은 리포 기록대로 purple-30 #d4bbff · blue-50 #4589ff · cyan-40 #33b1ff · teal-40 #08bdba). 그라데이션은 한 범주에만, 진행을 나타내는 데 쓰지 않음. 브랜드색을 쓰라는 문장은 없음.
- D17: 지표 전환 색 지침 없음(미확인). 범주 색은 정한 순서대로만.
- D18: 짝 · 이번/지난 기간 지침 없음. 발산 1 red-cyan 은 뜨거움 · 차가움이 있는 데이터, 발산 2 purple-teal 은 온도 뜻이 없는 데이터(성과 · 판매 · 변화율). 발산은 라이트 · 다크 같은 값.
- T5: 문서에 참고선 지침 없음. 패키지 기본 임계선(threshold) = red-50 #fa4d56, 1px, 점선 4(올리면 2px), 라벨 면도 red-50(사용자가 `fillColor` 로 바꿀 수 있음 — 설정 이름은 패키지 타입에서 확인 안 함, 미확인). 불릿 차트 구역 면 다크 gray-90 #262626 · 구역 선 gray-60 #6f6f6f, 목표 표시 · 사분위 선 다크 #ffffff 1.5px. 미터 범위 표시선 다크 gray-60 #6f6f6f 1px, 최고값 선 `border-inverse` 2px.
- E2: 비례 미터(proportional meter) — 높이 16px(보통 미터 8px), 조각 사이 `dividerWidth: 2`(2px). 미터 빈 칸 면 `layer-01`. 상태 미터 조각은 support-error · warning · success. 몫 조각 색 순서는 범주 순서(문서: 순서대로만). 범례 지침 문서 본문 미확인(Legends 쪽 따로 있음, 안 읽음).

##### GitHub Primer

- 문서 https://primer.style/product/ui-patterns/data-visualization/ · https://primer.style/product/components/progress-bar/ (2026-11-21 WebFetch, 둘 다 본문 일부 잘림). 코드 `primer/react` main `packages/react/src/ProgressBar/ProgressBar.module.css` 12–56(2026-11-22 raw 받음). 다크 값 `@primer/primitives@11.10.0` `dist/css/functional/themes/dark.css` 650 · 873.
- P1 · D20: 한 계열 기본색 지침 없음(미확인). 항목이 하나면 범례 대신 제목이 그 항목을 설명해도 된다. 모든 마크는 바탕 대비 3:1.
- D17: 지표 전환 · 차트 사이 색 유지 지침 없음(미확인).
- D18: 선이 여럿이면 선 모양을 달리, 첫 선은 늘 실선(다음 선 모양 이름은 적지 않음). 점 표시를 쓰면 선마다 다르게, 원부터. 회색 · 짝 · 발산 지침 없음. 명도가 다른 색을 고르면 가르기 쉽다는 문장 있음. muted 색은 3:1 미달이라 테두리와 함께만.
- T5: 「plot line」 = x · y 축에 특정 값(최댓값 · 중요한 날)을 긋는 선택 요소. 마크 선 · plot line 굵기 2px. 색 지침 없음(미확인). 축은 `--borderColor-default`(다크 #3d444d).
- E2: 막대 · 열 누적은 조각 5개 이하 · 막대 10개 이하. 이웃한 면(진행 막대 · 파이)은 틈이나 3:1 구분선으로 가른다. 범례: 항목이 둘 이상이면 범례 필수(직접 라벨이면 생략). ProgressBar 여러 조각: 「전체의 여러 몫」 용도, 가르기 쉬운 색, 예시는 `--bgColor-success-emphasis`(완료) · `--bgColor-accent-emphasis`(진행 중) · `--bgColor-danger-emphasis`(닫힘) 순서 — 색 순서 규칙 문장은 없음. 범례는 `DotFillIcon`(점) + 이름을 가로로 감싼 줄(`gap="condensed"`). 좁은 막대에 조각이 많으면 다른 차트를 권함. 코드: 조각 사이 `gap: 2px`, 빈 칸 바탕 `--progressBar-track-bgColor` = 다크 `--borderColor-default` #3d444d, 둘레 `--progressBar-track-borderColor` 다크 #00000000(투명), 모서리 `--borderRadius-small`. 조각 기본색 prop `bg` = `success.emphasis`.

##### Shopify Polaris Viz

- 패키지 `@shopify/polaris-viz-core@16.16.0` `build/esm/constants.js` 104 · 115–200 · 311–313 · 422–423, `hooks/useThemeSeriesColors.js` 8–47, `utilities/getSeriesColors.js` 1–22, `utilities/getComparisonSeriesIndexes.js` 1–12, `components/LineSeries/LineSeries.js` 83 · 101 · 197, `components/LineSeries/components/Area/Area.js` 10–12, `components/SparkBarSeries/SparkBarSeries.js` 121–133, 값 `styles/shared/_variables.scss.js`. 문서 사이트(polaris-viz.shopify.com)는 WebFetch 소켓 끊김 — 문서 문장 미확인, 아래는 코드 규칙.
- P1 · D20: 계열이 하나면 범주 팔레트 대신 `seriesColors.single`(다크 blue90 #3672bb) — 브랜드색 · 범주 1번(teal90 #33798c)이 아닌 따로 정한 「한 계열」 색. 선 굵기 기본 2, 선 아래 면 기본 켬(`hasArea: true`), 곡선(spline) 기본 켬. 점 테두리 `pointStroke` = 차트 면 gray160 #1f1f25.
- D17: 지표 전환 지침 없음(미확인). 코드상 계열 수가 1이면 늘 같은 `single` 색.
- D18: 비교(`isComparison: true`) 계열 = `seriesColors.comparison` 다크 rgba(144,176,223,0.8), 비교 선은 면을 그리지 않고, 점선은 데이터의 `strokeDasharray` 로 받음(기본 'none'). `metadata.comparisonIndex` 로 원 계열과 짝지은 비교 계열은 원 계열과 같은 색을 받음(useThemeSeriesColors 38–46). 범례 증감 표시: 상승 #078d4e · 하락 #616161 · 중립 #8a8a8a. 범례에 올리면 나머지 투명도 0.3.
- T5: 주석(annotations) 다크 — 선 `lineColor` gray80 #909099, 축 라벨 gray80 #909099, 알약 면 gray140 #43434e(투명도 0.6), 글자 gray30, 제목 흰색. 스파크 막대 목표선(target line) = `seriesColors.comparison` 색, 1.5px, 점선 '0.1 4'(둥근 끝 점), 투명도 0.9. 십자선 gray70 #9d9da5 1px.
- E2: 누적 막대 조각 사이 `STACKED_BAR_GAP = 2`(2px). 색 순서 = `seriesColors.all` 차례(14색 넘으면 처음으로 돌아감). 막대 0값 gray80 #909099, 빈 값 gray140 #43434e. 범례 글자 gray30 · 값 gray70 · 면 gray150.

##### Adobe Spectrum (차트 라이브러리 쪽만)

- 문서 `spectrum.adobe.com/page/color-for-data-visualization/` 는 2026-11-21 에도 Spectrum Hub 첫 쪽으로 넘어감(막힘, 리포 기록과 같음). 대신 공식 라이브러리: 위키 https://github.com/adobe/react-spectrum-charts/wiki/Trendline (2026-11-21 WebFetch), 패키지 `@spectrum-charts/constants`(받은 판, `dist/@types/constants.d.ts` 1–5 · 274–299, `dist/index.js` 참고선 표 `tA` · `VA`).
- P1 · D20: 한 계열 기본색 지침 미확인(문서 막힘). 라이브러리 기본 `DEFAULT_COLOR = "series"`(계열 차원으로 범주 색 배정).
- D17 · D18: 문서 막힘(미확인). 짝 상수 `DEFAULT_SECONDARY_COLOR = "subSeries"`(하위 계열 색 차원) — 뜻 풀이 문장은 패키지에 없음.
- T5: 추세선(Trendline) `color` 기본값 없음 — 정하지 않으면 그 추세선이 나타내는 계열 색을 따름. 위키 예시는 평균선에 `color="gray-500"`, 이동평균에 `lineType="dashed"`. `lineType` 기본 'solid', `lineWidth` 기본 'M'. 참고선(reference line) 굵기 XS 1 · S 1.5 · M 1.5 · L 2.5, 보조 선 1px, 보조 색 XS = gray-600, S · M · L 은 변수 `M` 을 씀(같은 파일의 `M="gray-800"` 로 보이나 축소 코드 범위가 확실하지 않아 미확인). 축 주석 기본색 `DEFAULT_AXIS_ANNOTATION_COLOR = "gray-600"`, 주석 글자 12px bold. 다크 hex(Spectrum 2): gray-600 · gray-800 값은 `@adobe/spectrum-tokens` 에서 이번에 다시 찾지 않음(미확인).
- E2: 누적 막대 색 순서 · 틈 지침 미확인. 불리언 도넛 두 번째 조각 `DONUT_BOOLEAN_SECONDARY_COLOR = "gray-400"`(몫의 나머지를 회색으로).

##### SAP Fiori (Horizon) — 지침 본문 막힘, 토큰만

- 지침 쪽 `www.sap.com/design-system/fiori-design-web/v1-148/.../chart-semantic-pattern/usage` · `.../color-palettes/usage` · `v1-151/.../reference-lines/usage` 는 WebFetch 403, headless Playwright 도 「Access Denied」(Akamai) — 막힘, 지침 문장은 세지 않음. 검색 결과 요약에만 「실제값 · 참고값 짝은 같은 색, 참고값은 점선 + 빈 원」 「참고선은 중립 짙은 회색」 「단순 참고선은 한 색, 의미 참고선은 negative · critical · positive · neutral 네 색까지」 가 보였으나 본문을 열어 확인하지 못함(미확인).
- 토큰(공식 GitHub `SAP/theming-base-content` master `content/Base/baseLib/sap_horizon_dark/css_variables.css` 1561–1594 · 1940–2021, 2026-11-22 raw 받음): 차트 면 `--sapChart_Background` #1d232a. 범주 `--sapChart_OrderedColor_1–5` 다크 = #3278be · #f2a634 · #b4ce35 · #fa4f96 · #8b47d7(… 12까지). 사실 메모: NosLog E2 지금 다섯 색 · T5 #3278be · P1/D18 #f2a634 와 같은 hex 다(라이트 `sap_horizon` 은 #168eff · #c87b00 · #75980b · #df1278 · #8b47d7 로 다름).
- D18 관련 토큰: IBCS(국제 업무 보고 표기) 짝 — 다크 `--sapChart_IBCS_Actual` #eaeef2(실적, 밝은 회색) · `--sapChart_IBCS_Previous` #576f86(지난 기간, 어두운 청회색) · `IBCS_Good` #30914c · `IBCS_Bad` #f83030. 라이트는 Actual #233649 · Previous #758ca4.
- T5 관련 토큰: `--sapChart_Neutral` 다크 #6f89a1(라이트 #758ca4), 의미색 Bad #f83030 · Critical #dd6100 · Good #30914c. 선 색 `--sapChart_LineColor_1` #313941 · `_2` #a9b3be · `_3` #fff — 어느 선(격자 · 참고선)에 쓰는지는 본문 막혀 미확인.
- E2: 범주 순서 = OrderedColor 1→12 차례(이름 뜻). 조각 틈 · 범례 지침 미확인.

##### Salesforce Lightning (SLDS 1, spring-20 판 문서)

- 문서 https://spring-20.lightningdesignsystem.com/guidelines/data-visualization/charts/ (2026-11-21 WebFetch). 지금 lightningdesignsystem.com 쪽은 제목만 받아짐(SLDS 2, 본문 없음 — 막힘). 옛 판 문서이며 다크 값 없음(「Dark」 이름 팔레트는 있으나 다크 모드 값이 아님).
- P1 · D20: 같은 측정값에 비교되는 모든 값은 한 색으로(막대 · 열 차트 절). 연속값의 높낮이는 한 색 또는 그 색의 그라데이션. 기본 팔레트 1번 #52B7D8(중간 톤 색상환 6색: #52B7D8 · #E16032 · #FFB03B · #54A77B · #4FD2D2 · #E287B2). 브랜드색을 쓰라는 문장 없음.
- D17: 같은 지표는 모든 차트에서 같은 색, 같은 지표에 다른 색을 쓰지 말라(「Color Best Practices」). — 지표를 바꿔 보는 경우를 따로 말하지는 않음.
- D18: 두 계열 · 지난 기간 짝 지침 없음. 선 차트는 겹친 값 4개까지. 빨강 = 나쁨 · 초록 = 좋음은 서양 관습이고 문화마다 다르다는 주의. 발산 지침 없음.
- T5: 평점 · 납작 게이지에 목표 · 평균을 나타내는 참고점을 더하라는 문장, 색은 적지 않음(미확인).
- E2: 누적 막대 예시만, 조각 순서 · 범례 · 틈 지침 없음(미확인). 숫자에 색을 묶을 때 팔레트는 5색 정도까지. 색으로 가를 때 늘 기호나 글자를 함께.

##### Microsoft Fluent 2 (react-charts)

- 문서 https://microsoft.github.io/fluentui-charting-contrib/docs/colors (2026-11-21 WebFetch). fluent2.microsoft.design 에 차트 지침 쪽 없음(`/charts` 404). 패키지 `@fluentui/react-charts@9.3.29` `lib/components/HorizontalBarChart/HorizontalBarChart.js` 184–190 · 298–301, `useHorizontalBarChartStyles.styles.raw.js` 71–85, `lib/components/VerticalStackedBarChart/VerticalStackedBarChart.js` 13–14 · 571–593, `lib/components/LineChart/LineChart.js` 535 · 558. 다크 값 `@fluentui/tokens` `lib/alias/darkColorPalette.js` 4–16 · `lib/global/colors.js`(blue 501–).
- P1 · D20: 한 계열은 CSS 색을 직접 주거나, 색을 비우면 기본 범주 팔레트에서 차례로(1번 = `DataVizPalette.color1`, 다크 #637cef — 리포 기록). 브랜드색 지침 없음.
- D17: 지표 사이 색 유지 지침 없음(미확인). 의미색 7개(`highError · error · warning · success · highSuccess · disabled · info`)는 「어디서나 같은 기본 뜻」.
- D18: 두 계열 · 지난 기간 지침 없음(미확인). 점선은 계열마다 `lineOptions.strokeDasharray` 로 받음(기본 없음). 범례로 다른 계열을 고르면 나머지 선 투명도 0.1. 이웃 계열 대비 · 라이트/다크 조정은 쓰는 쪽 책임이라고 문서에 적음.
- T5: 참고선 전용 색 지침 없음(미확인). 가로 막대의 기준값(benchmark) 표시 = 막대 위 삼각형 4·4·7px, 색 `colorPaletteBlueBorderActive`(다크 blue tint30 #5caae5). 선 차트 색 띠(`colorFillBars`)는 색을 사용자가 주고 범례에 함께 올라감.
- E2: 한 줄 몫 막대(HorizontalBarChart) 조각 기본색 다섯 = `colorPalette{Blue · Cornflower · DarkGreen · Navy · DarkOrange}Foreground2`, 다크 tint40 #a9d3f2 · #c8d1fa · #9ad29a · #a3b2e8 · #f4bfab. 조각 사이 틈 3px(`MARGIN_WIDTH_IN_PX = 3`), 막대 높이 기본 12. 세로 누적 막대(VerticalStackedBarChart) 조각 틈은 `barGapMax` 기본 0(틈 없음), 주면 max(1px, min(barGapMax, 막대 높이 20% ÷ 틈 수)).

##### Elastic EUI · Elastic Charts

- 문서(headless Playwright 로 본문 받음, 2026-11-22, 텍스트 사본 스크래치 `ds/text/eui-*.txt`): https://eui.elastic.co/docs/utilities/color-palettes/ · https://eui.elastic.co/docs/dataviz/dashboard-good-practices/ · https://eui.elastic.co/docs/dataviz/ . 패키지 `@elastic/charts@73.4.1` `dist/cjs/utils/themes/dark_theme.js` 165–178 · 291–293 · 569–581, `dist/cjs/chart_types/bullet_graph/theme.js` 69–82, `dist/cjs/utils/themes/theme.d.ts` 376–379.
- P1 · D20: 다크 테마 `colors.defaultVizColor` = #16C5C0(범주 팔레트 1번과 같은 값, 브랜드 primary #61A2FF 와 다름). 대시보드 지침 「Relevance」: 일반 요소는 중립색, 찾으려는 것에만 강조색. 브랜드 맞춤이 필요하면 아주 적은 색만, 차트끼리 일관되게.
- D17: 「Colors · Consistency」 — EUI 시각화 색을 그대로 써서 대시보드 전체를 일관되게. 관련 Metric 차트와 선 차트의 색을 맞추면 선 차트 범례를 뺄 수 있다는 예. 팔레트 쪽: 한 계열에 지표가 여럿이면 색이 서로 어울리되 가를 수 있게 `euiPaletteColorBlind({rotations: 3, order: 'group', direction: 'both'})`(같은 갈래의 밝고 어두운 변형을 묶음). 지표를 바꿀 때 색을 바꾸라/두라는 문장은 없음(미확인).
- D18: 범주 팔레트는 이산 계열 비교용(`euiPaletteColorBlind()`, 10색 넘으면 반복 대신 `rotations` 로 변형 묶음 추가). 10색은 다섯 갈래의 진한 · 옅은 짝(리포 기록). 이번 · 지난 기간 · 점선 지침 없음(미확인). 발산 팔레트는 리포 기록(Temperature · Complementary).
- T5: 선 주석(lineAnnotation) 다크 = #98A2B3 1px 투명도 1, 면 주석(rectAnnotation) #98A2B3 투명도 0.25 테두리 0. 불릿 그래프 다크 색 띠 #6092C0 · #3F4E61, 막대 바탕 · 글자 `textParagraph`, 테두리 `borderBaseSubdued`. 문서 지침 문장 없음.
- E2: 막대 조각 테두리 `rectBorder.visible: false`(기본 틈 · 테두리 없음, 켜면 1px). 범주 순서 = 팔레트 0→9. 색 위에 글자를 올릴 때는 `euiPaletteColorBlindBehindText()`(밝힌 판). 범례 지침 미확인.

##### Grafana

- 문서 https://grafana.com/docs/grafana/latest/panels-visualizations/configure-standard-options/ (Color scheme) · https://grafana.com/docs/grafana/latest/panels-visualizations/configure-thresholds/ (2026-11-21 WebFetch). 패키지 `@grafana/data@13.3.1` `dist/esm/panel/getPanelOptionsWithDefaults.mjs` 88–113 · `dist/esm/field/fieldColor.mjs` 421–431. 다크 hex 는 리포 기록(namedColorsPalette).
- P1 · D20: 색 방식 「Single color」(한 색 지정) · 「Shades of a color」 이 따로 있음. 기본 방식 문장은 문서에 없음. 코드: 계열별 색을 지원하는 패널(시계열 등)로 바꾸면 `PaletteClassic`(클래식 팔레트 차례) — 한 계열이면 클래식 1번 green #73BF69(다크), 브랜드 primary #3d71d9 와 다름. 색 모드가 없으면 `Thresholds`(임계값 색)로 떨어짐(fieldColor 423).
- D17: 「Classic palette」 은 필드 · 계열 순서로 색을 줘서 쿼리 순서가 바뀌면 색도 바뀐다는 경고. 「Classic palette (by series name)」 는 이름 해시로 색을 줘 계열이 바뀌어도 이름마다 색이 고정(`getColorByStringHash`). 범례 색 점을 눌러 계열별 고정색 덮어쓰기 가능.
- D18: 두 계열 · 지난 기간 · 짝 지침 없음(미확인). 값 기준 연속 색 묶음에 발산형(Green-Yellow-Red · Red-Yellow-Green · Blue-Yellow-Red) 있음.
- T5: 임계값 기본 = Base(-∞) 초록(문서: 대개 「좋음」 색), 80 빨강, 모드 Absolute. 시계열 임계값 표시: Off · 선 · 점선 · 면 · 면+선 · 면+점선(일부 패널 기본 Off). 임계값 색은 격자선 · 면 · 계열 선에도 칠할 수 있음. 다크 hex: green #73BF69 · red #F2495C(리포 기록 이름 색). 주석(annotation) 기본색은 이번에 패키지에서 찾지 못함(미확인).
- E2: 누적 막대 색 순서 · 틈 · 범례 지침 미확인(클래식 팔레트 차례).

##### Apache ECharts (차트 라이브러리, 기본값만 — 지침 문서 없음)

- 소스 `apache/echarts` master(2026-11-22 raw): `src/model/globalDefault.ts` 39–41 · `src/visual/tokens.ts` 112–122 · 204–207 · `src/theme/dark.ts` 22 · 71 · `src/component/marker/MarkLineModel.ts` 115–136 · `src/component/marker/MarkLineView.ts` 363–365. 옵션 문서(option.html)는 WebFetch 로 본문이 오지 않음.
- P1 · D20: `colorBy: 'series'`, 계열 하나면 팔레트 1번 #5070dd. 팔레트 9색 #5070dd · #b6d634 · #505372 · #ff994d · #0ca8df · #ffd10a · #fb628b · #785db0 · #3fbe95, 다크 테마는 같은 배열을 복사(tokens 204).
- D17 · D18: 지침 없음(라이브러리). 두 계열이면 팔레트 차례.
- T5: 참고선(markLine) 기본 `lineStyle.type: 'dashed'`, 끝 기호 원 · 화살표, 라벨 끝에 표시. 색을 정하지 않으면 그 계열의 색을 이어받음(MarkLineView 363–365).
- E2: 누적 막대 틈 기본값은 이번에 읽지 않음(미확인).

##### Highcharts (차트 라이브러리, 기본값만)

- 소스 `highcharts/highcharts` master(2026-11-22 raw): `css/highcharts.css` 17–26 · 47 · 79 · 99–124 · 727–735, `ts/Core/Defaults.ts` 107–109, `ts/Core/Axis/PlotLineOrBand/PlotLineOrBand.ts` 229–231 · 306–313, `ts/Series/Column/ColumnSeriesDefaults.ts` 59 · 340–371.
- P1 · D20: 계열 하나면 `--highcharts-color-0` #2caffe(라이트 · 다크 같음). 다크(`light-dark()`)에서 1번 #544fc5→#00e272, 2번 #00e272→#efdf00 로 바뀌고 나머지는 같음. 다크 바탕 #141414.
- D17 · D18: 지침 없음(라이브러리).
- T5: 참고선(plotLine) 색을 비우면 `--highcharts-neutral-color-40`(라이트 #999999 · 다크 #727272), 굵기 1, 점선은 `dashStyle` 줄 때만. 참고 띠(plotBand) 면 `--highcharts-highlight-color-10`(라이트 #e6e9ff · 다크 #16242b).
- E2: 열 · 막대 테두리 = 바탕색(`--highcharts-background-color`, 다크 #141414), 굵기는 자리가 있으면 1 · 빽빽하면 0 — 누적 조각 사이가 바탕색 1px 로 갈림. 모서리 3.

##### Chart.js (차트 라이브러리, 기본값만)

- 소스 `chartjs/Chart.js` master `src/plugins/plugin.colors.ts` 14–40 · `chartjs/chartjs-plugin-annotation` master `src/types/line.js` 133–151 · 213–215(2026-11-22 raw). 다크 기본값 없음.
- P1 · D20: 색 플러그인 — 데이터셋 하나면 1번 선 rgb(54,162,235)(파랑), 면은 같은 색 50% 투명. 7색 차례 파랑 · 빨강 · 주황 · 노랑 · 초록 · 보라 · 회색 rgb(201,203,207).
- D17 · D18: 지침 없음.
- T5: 주석 플러그인 선 기본 굵기 2 · 실선(`borderDash: []`), 색은 `Chart.defaults.color` 로 이어짐(defaultRoutes). 라벨 면 rgba(0,0,0,0.8).
- E2: 누적 틈 기본값 미확인.

##### AntV G2 (Ant Design 차트, 기본값만)

- 패키지 `@antv/g2@5.4.8` `src/theme/dark.ts` 9–12 · `src/theme/create.ts` 27 · 81–89 · 168–195. 지침 문서: https://charts.ant.design/en/options/plots/color 는 색 넣는 방법(API)만 있고 한 계열 · 비교 · 참고선 지침 없음(2026-11-21 WebFetch). AntV 설계 언어 색판 쪽(antv.antgroup.com · antv.vision `/specification/language/palette`)은 404 — 막힘.
- P1 · D20: 다크 `colorDefault` #1783FF(= category10 1번, antd 기본 primary 와 같은 파랑). 마크 기본 `color: colorDefault`.
- D17 · D18: 지침 없음(미확인).
- T5: 참고선 `lineX` · `lineY` 다크 = `colorStroke` #416180, 투명도 0.45, 1px(실선). 참고 구간 `rangeX` · `rangeY` 면 #416180 투명도 0.15, 테두리 0.
- E2: 막대(interval) 면 투명도 0.95. 누적 조각 틈 기본값 없음(테마에 없음). 색 순서 category10 차례.

##### GitLab Pajamas

- 문서 https://design.gitlab.com/data-visualization/color (2026-11-22 WebFetch). 다크 hex 는 문서 본문에 없음(토큰 이름만) — 미확인.
- P1 · D20: 한 범위 차트의 기본 색조는 파랑, `color.data-blue.500` 이 라이트 · 다크 공통 기준 단계. 범주 순서는 늘 파랑부터(Blue · Orange · Aqua · Green · Magenta).
- D17: 차트 사이 규칙 없음(미확인). 모든 시각화는 `background.color.default` 위에.
- D18: 이번 · 지난 기간 · 짝 지침 없음. 발산: 증가 · 감소처럼 좋고 나쁨이 있으면 차가운색→따뜻한색, 양 끝에 좋고 나쁨이 없으면 차가운색→차가운색. 기본은 11단계 중 한 칸씩 건너뜀(가운데 포함). 상태 짝: 일반 데이터 `data-blue.500` + 성공 `data-green.700`, 성공 · 실패 함께면 `data-green.500` + `data-magenta.600`(다크 UI 는 `data-green.500` + `data-magenta.400`).
- T5: 참고선 · 임계선 지침 없음(미확인).
- E2: 요소 사이를 면 색 1px 틈 또는 면 색 1px 테두리로 가름. 대비가 모자란 옅은 면은 같은 색조 `500` 테두리. 다크 면 기준 `color.neutral.950` #18171d, 다크에서는 50–500 단계가 3:1 이상이고 값이 클수록 밝게(500→50).

##### Wikimedia Codex

- 문서 https://doc.wikimedia.org/codex/latest/style-guide/data-visualization.html (2026-11-22 WebFetch). 다크 값 없음.
- P1 · D20: 기본 한 색 지정 없음. 한 색 단계 예시는 blue600 #4b77d6(어느 팔레트 색이든 같은 방식이라고 적음).
- D17: 지침 없음(미확인).
- D18: 범주 색은 차례대로(1 blue600 #4b77d6 · 2 yellow300 #edb537 …, 10번 gray400 #a2a9b1 — 중립 지정은 아님). 발산 「Blue Red」 #4b77d6 … #d74032, 가운데는 중립 단계. 색만으로 가르지 말고 기호(원 · 십자 · 삼각 · 사각 … 순서)나 무늬를 함께.
- T5: 참고선은 특정 값 · 목표를 드러내는 용도, 색 지정 없음. 축 기준선 · 눈금 `@border-color-emphasized`, 격자선 `@border-color-muted`.
- E2: 범례는 차트 가까이, 5색까지, 가로로 줄 안에 두고 넘치면 감쌈(파이 · 도넛은 세로 허용). 누적 막대는 복잡해지지 않게 조심. 순서 · 틈 지침 없음.

##### VTS Terra

- 문서 https://terra.vts.com/patterns/data-charts/color-guidance (2026-11-22 WebFetch). 다크 값 없음.
- P1 · D20: 한 계열 기본색 지침 없음. 「색은 차트 종류가 아니라 정보로 고른다」, 색은 최소로.
- D17: 지침 없음(미확인).
- D18: 비교 짝 토큰 — 명도가 다른 두 색으로, 명도가 비슷한 짝 금지. `$color-dataviz-comparison-combo1-a` #887EFC(indigo-500) + `combo1-b` #989DA4(neutral-500, 회색) · `combo2-a` #E17605(yellow-600) + `combo2-b` #096290(blue-700) · `combo3-a` #247F7E(aqua-800) + `combo3-b` #E17605. 양 · 음: `comparison-positive` #A3D982(green-400) · `comparison-negative` #989DA4(neutral-500, 회색) — 빨강 · 초록을 함께 쓰지 말라.
- T5 · E2: 지침 없음(미확인).

##### ONS 서비스 매뉴얼(영국 통계청)

- 문서 https://service-manual.ons.gov.uk/data-visualisation/colours/using-colours-in-charts (2026-11-22 WebFetch). 다크 값 없음.
- P1 · D20: 한 색만 필요하면 Ocean blue #206095(`--ons-color-ocean-blue`, 범주 1번과 같은 색).
- D17: 한 묶음 차트들에서 같은 범주는 같은 색, 범주 순서도 같게. 차트빌더는 데이터 순서로 색을 줌.
- D18: 강조 · 회색 — 주색에 대해 강조할 범주만 다른 색(차트빌더 기본 강조 Highlight orange #f39431), 다른 도구에서는 덜 중요한 범주 회색 + 중요한 범주 Ocean blue. 여러 계열은 기본 팔레트의 다른 색. 지난 기간 · 짝 지침 없음. 순서 있는 발산 범주: 양 끝에 하나씩 색 단계 + 선택적 중립 가운데(값 없음).
- T5: 지침 없음(미확인).
- E2: 누적 막대 예시는 조각마다 다른 색, 5색 이하. 한 차트에서 같은 색을 두 범주에 쓰지 않음. 순서 · 범례 · 틈 지침 없음.

##### Warp (FINN · Vend)

- 문서 https://warp-ds.github.io/docs/foundations/data-visualization/color/introduction · `/lines-points/` · `/bars-areas/` · `/chart-colors/` · `/tokens/line/` (2026-11-22 WebFetch). hex 값은 문서 글에 없음(그림만) — 라이트 · 다크 값 미확인.
- P1 · D20: 선이 하나면 `Line/Primary`(파랑, `--w-dv-s-color-line-primary`), 선 3px 이상. 파랑은 대부분 브랜드의 중심이고 좋고 나쁨 뜻이 없어서 골랐다는 설명. 일반 그래프에 Warp 브랜드 · UI 색을 쓰지 말라(슬라이더 같은 조작 부품만 예외).
- D17: 한 주색을 그래프 전체에 써서 쪽을 조화롭게(지표 전환을 따로 말하지는 않음). 무늬 · 색 짝은 그래프 사이 일관되게.
- D18: 여러 선은 `Line/Category1–8`. 주된 선은 실선, 보조 선은 점선(점선이 덜 중요해 보인다는 이유) + `Line/Secondary`(회색). 중립 `Line/Neutral`(회색), 의미 `Line/Positive` · `Negative` · `Warning`. 토큰마다 `-highlight` 짝.
- T5: 참고선 · 임계선 지침 없음. 축 기준선 · 눈금 `ChartLine/Default`, 격자선 `ChartLine/Subtle`. 예측 구간은 `border-secondary` 사선 무늬.
- E2: 누적 막대는 색 사이에 흰 틈(각 조각에서 같은 양, 예 1px 씩 빼서 합계 비교를 맞춤). 덜 중요한 막대는 `background-primary-subtle` + `border-primary` 3px 테두리. 색 순서 · 범례 지침 없음.

##### Toss TDS (리포 기록 재인용, 이번에 다시 열지 않음)

- 출처: 리포 `docs/research/2026-11-20-color-chart.md` 735–741(문서 https://tossmini-docs.toss.im/tds-mobile/components/Chart/bar-chart/ · `@toss/tds-mobile@2.5.1`). 차트 부품은 Bar Chart 하나, 선 차트 없음.
- P1 · D20 · D17 · D18 · T5: 해당 부품 없음(미확인).
- E2 관련: 자동 색칠 순서 「오른쪽부터 blue → green → yellow → orange → red → grey」. 한 막대 강조(`single-bar`)는 고른 막대만 theme 색, 나머지 default(grey100). 다크 값 미확인.

##### 당근 SEED (확인만)

- 리포 기록 745 — `@seed-design/css@3.2.1` 차트 토큰 · 클래스 0건. 여섯 기능 모두 지침 없음.

#### 막힘 · 못 읽음

- Adobe Spectrum 데이터 시각화 색 문서(Hub 첫 쪽으로 넘어감) — 라이브러리 기본값만 적음.
- SAP Fiori 지침 쪽(www.sap.com, WebFetch 403 · Playwright Access Denied) — 토큰만 적음.
- Morningstar(design.morningstar.com 본문이 그려지지 않음 · 옛 판 designsystem.morningstar.com AccessDenied).
- Salesforce 지금 판(SLDS 2) 차트 쪽 — 제목만. spring-20 옛 판으로 적음.
- AntV 설계 언어 색판 쪽 404. Material Design(M2 쪽 본문 없음, M3 차트 지침 쪽 찾지 못함). Fluent 2 디자인 사이트 차트 쪽 404(라이브러리 문서 · 패키지로 적음). Dialpad Dialtone 차트 색 쪽 404. Polaris Viz 문서 사이트 소켓 끊김(패키지로 적음).
