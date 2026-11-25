# 등급 · 구간 색 기능별 실측 — 레이팅 구간 · 진행 · 난이도 사다리 · 업적 단계

2026-11-21–22. 공통 층 3단계 색 파운데이션, 차트 · 게임 색 기능별 조사의 「B NosLog 등급 · 구간」 무리(P3 · R2 · D3 · D4 · D5 · D7 · P14 · T1 · P16 · P17)다. 기능 뜻과 지금 NosLog 색은 세션 공유 폴더 `color-feature-map/FEATURES.md`. 기능마다 같은 기능을 가진 서비스에서 따로 잰 값과 곳 수만 둔다. 추천 · 판단은 적지 않는다. 난이도 · 판정 · 점수 등급 색(게임이 정함)은 이 조사 밖이다.

## 재는 법

headless Playwright 1.61.1 Chromium, `colorScheme: 'dark'` · 권한 없음 · `ko-KR` · 1440×900, 로그인 없음, 열기 전마다 `~/noslog-research/wait-capacity.sh`. 값은 `getComputedStyle` 계산값(그림은 캡처 화소 표본이라고 적음), 대비는 WCAG 2(투명도는 바탕과 섞어 잼). 서비스 갈래 넷(경쟁 프로그래밍 · 리듬게임 기록 · 게임 전적 · 업적 단계)과 디자인 시스템 하나로 나눠 쟀다. 캡처 · 원문은 세션 공유 폴더 `common-layer/stage3/color/feature-research/B-grade/`(`caps/<묶음>/` · `parts/<묶음>.md`). 아래 「곳마다」 의 `caps/…` 경로는 그 폴더 기준이다.

## 센 곳

- 다크 실제 서비스 57곳(서로 다른 곳) = 국내 17 · 해외 40. 같은 서비스가 두 묶음에 나오면(Exophase · Quaver · Codewars · Cytoid · Chess.com · 클로아) 한 곳으로 셌다.
    - 국내 17: solved.ac · 정올 JUNGOL · V-ARCHIVE · 전일 아카이브 · OP.GG · DEEPLOL · LOL.PS · YOUR.GG · 로아와 · 클로아(KLOA) · 던담 · 일로아 · 던파기어 · fconline.gg · 로펙 · 당근 · 로스트아크 전투정보실.
    - 해외 40: LeetCode · Codewars · AtCoder Problems · yukicoder · Luogu · Boot.dev · Edabit · Advent of Code · osu! · Quaver · EtternaOnline · ScoreSaber · BeatLeader · DXRating.net · 3icecream · piucenter · sdvx.in · AccSaber · Cytoid · SNJ@KMZS · MetaTFT · Lichess · Chess.com · TETR.IO · U.GG · Blitz · Tracker.gg · Raider.IO · LoLalytics · OpenDota · Leetify · Exophase · Steam · GitHub · Discourse Meta · Game Jolt · Kongregate · SEELIE.me · Genshin Center · Paimon.moe.
- 라이트만(꼴만 적고 세지 않음) 16곳: CodeUp · 프로그래머스 스쿨 · AtCoder 공식 · CodeChef · Kaggle · chunirec · gsv.fun · Bestdori · Satellite BMS 표 · DAK.GG 묶음 · FC온라인 데이터센터 · 서든어택 병영수첩 · HSReplay · 올리브영 · 뽐뿌 · Stack Overflow.
- 디자인 시스템 15곳: 패키지 다크 값까지 13(Spectrum · Carbon(+Carbon Charts) · Primer · Atlassian · Fluent 2 · Material 3 · Ant Design · Chakra · Mantine · Polaris · 당근 SEED · Toss TDS · EUI) · D4 문서만 2(GitLab Pajamas · Semrush Intergalactic).
- 막힘(세지 않음) 주요: Codeforces · DMOJ · Faceit · Dotabuff · PSNProfiles · TrueAchievements · RetroAchievements · Mobalytics 티어 리스트 · 오버로그 · 메이플스카우터 · ongeki-score(확인 화면), solved.ac 프로필 · 문제 쪽(확인 화면), 백준 사용자 · Kamaitachi · piugame 랭킹 · STRATZ · 무신사 · Reddit · Xbox(로그인 벽). 묶음마다 전체 목록은 아래 「곳마다」 각 묶음 머리.
- 목표(기능마다 다크 30곳 · 국내 15곳)는 R2 만 채웠다. 나머지는 아래 기능별 곳 수대로이고, 30곳 아래는 「근거 약함」 으로 본다. 국내 대표 서비스 대부분(백준 · 프로그래머스 · 코드트리 · 국내 커뮤니티 레벨 · 쇼핑 등급)은 라이트만이거나 로그인 뒤에 있었다.

## 기능별 결과

곳 수는 다크 실제 서비스. 꼴 갈래는 서비스 실측 그대로 묶었다. 한 곳이 두 꼴에 걸치면 둘 다 셌다.

### P3 프로필 머리 레이팅 · 등급 숫자 — 28곳(국내 11 · 해외 17)

- 숫자는 무색(또는 고정 한 색)이고 구간은 옆 아이콘 · 엠블럼 · 배지 · 직함으로만 — 약 17곳(OP.GG · YOUR.GG · TETR.IO · U.GG · OpenDota · 로펙 · LeetCode · Codewars · JUNGOL · Boot.dev · Etterna · AccSaber · Quaver · ScoreSaber · Cytoid · 클로아 · 로아와 등).
- 숫자 · 티어 이름 글자 자체를 구간 색으로 — 6곳: 전일 아카이브(레이팅 숫자 글자 그라데이션 9단) · osu!(순위 숫자 8단) · DEEPLOL · Blitz(티어 이름 글자) · AtCoder Problems · Luogu(이름 글자).
- 등급 단계 글자색 10단(유채색 이어짐) — 1곳: 당근 매너온도(화면 값이 SEED `manner-temp-l1…l10-text` 다크 값과 같음, 본 단계 l4–l8).
- 테두리 원 · 육각 테 10단위 색 — 2곳: Steam 레벨 원 `.lvl_0…90` 10색 · Codewars kyu 묶음 육각.
- 역할 · 항목 고정색 — 2곳: 일로아 · 로아와.
- 근거 약함. 숫자 글자색 구간은 6곳.

### R2 랭킹 표 값 숫자 — 33곳(국내 11 · 해외 22)

- 값 숫자 무색 또는 한 고정색(브랜드 · 링크색) — 약 22곳(LeetCode · yukicoder · Edabit · Advent of Code · LOL.PS · 클로아 · 던담 · 던파기어 · 로펙 · Lichess · Chess.com · TETR.IO · OP.GG 4위부터 · 리듬게임 7곳 모두 등).
- 1–3위만 금 · 은 · 동(메달 · 면 · 글자) — 6곳: OP.GG · fconline.gg · 로아와 · Tracker.gg · BeatLeader · AccSaber(이 꼴은 A 순위 무리와 겹침).
- 이름만 구간 색 — 3곳: AtCoder Problems · Luogu · U.GG(티어 이름).
- 값 숫자를 구간 색으로 — 4곳: solved.ac(숫자 글자 + 번개 아이콘, Master rgb(193,0,233) 바탕 위 4.21) · Luogu(점수 칸 4색) · Raider.IO(166단계 연속 사다리, 공개 API) · Leetify(7구간 배지).
- 아이콘 · 배지만 — 3곳: Codewars · JUNGOL · Boot.dev.
- 같은 서비스 안에서 프로필은 구간 색, 랭킹 표는 링크색으로 다르게 칠한 곳: 전일 아카이브.

### D3 항목 상세 「내 점수」 색 — 0곳

- 문제 · 곡 상세의 내 기록 자리는 모두 로그인 뒤라 못 봤다(solved.ac · 리듬게임 기록 사이트 전부). 게임 전적 사이트에는 같은 자리가 없다. 미확인.

### D4 같은 자리의 빈 값 — 4곳 + DS 3곳

- 서비스: 무색 「-」(V-ARCHIVE) · 자리 숨김(LeetCode 로그아웃) · 회색 「?」 랭크 그림(TETR.IO) · 회색 글자 「Unranked」(Blitz, DEEPLOL 자유 랭크도 같은 꼴).
- DS: 빈 칸 그대로, 「-」 쓰지 말 것(Primer) · 글 라벨 또는 촘촘한 표에서는 em dash + 까닭 툴팁(GitLab) · 「n/a」 를 `--text-secondary` 색 + 툴팁(Semrush). Carbon · Atlassian · Polaris 는 칸 단위 지침 없음.
- 근거 약함.

### D5 진행 막대 — 8곳 + DS 13곳

- 지금 단계 → 다음 단계 색 그라데이션 — 1곳: DEEPLOL(Master → GM, 캡처 확인).
- 지금 단계 색 한 색 — 3곳: Blitz(지금 티어 글자색) · LeetCode 고리(난이도 색 채움 + 같은 색 20% 트랙) · AtCoder Problems(원 채움 높이 = 구간 안 위치, 구간 색).
- 단계와 무관한 한 색 · 브랜드색 — 3곳: 로펙(파랑 → 보라 그라데이션 30%) · JUNGOL 고리(브랜드색) · Boot.dev(금속 금 그라데이션 6px).
- 트랙만 보임 — 1곳: Edabit.
- 관련(같은 기능 아님): osu! 레벨 막대 브랜드 분홍 한 색 · AccSaber 레벨 막대 칭호 단계색 그라데이션.
- DS: 13곳 모두 진행 막대 · 미터 있음(SEED 는 원형만). 채움은 한 색이 기본이고 상태별 채움 토큰 8곳. 값 구간에 따라 색이 저절로 바뀌는 것은 Carbon Charts MeterChart `status.ranges` 하나(danger · warning · success), antd 는 100% 에서 success. 그라데이션 채움 옵션은 antd `strokeColor` 하나. 트랙 대비 1.1–1.9 : 1.
- 근거 약함.

### D7 항목 난이도 · 레벨 숫자 사다리 — 18곳

- 값 사다리 연속 색 — 3곳: osu!(별 난이도 11지점 연속 색 면 배지, osu-web 소스 값) · AccSaber(연속 6지점 글자 + 미니 막대) · AtCoder Problems(구간 글자 + 원).
- 값 사다리 구간 색(계단) — 5곳: V-ARCHIVE(3구간 × 일반 · SC 2계열 글자) · Luogu(9단 면 배지 + 흰 글자) · Edabit(6단 글자) · Codewars(육각 배지) · JUNGOL(티어 그림, solved.ac 티어 색).
- 난이도 이름 종류색(3–8가지) — 7곳: LeetCode 3단 · Quaver 8구간 · ScoreSaber · BeatLeader(같은 5색 면) · Etterna · Cytoid · MetaTFT 3단.
- 무색 — 2곳: DXRating · yukicoder(별).
- 품질 값 면 배지 — 1곳: 클로아(0–100, 3구간만 봄).
- DS: 여러 색상이 이어지는 순차 색표는 Spectrum(viridis 등) · AntV G2(ylGnBu) 둘, 등급 표시용이라는 문서 문구는 못 찾음(미확인). 값은 [차트 색 기록](./2026-11-20-color-chart.md) 623–815행.
- 근거 약함.

### P14 프로필 레벨별 표 줄 머리 — 5곳

- 줄 머리를 사다리 색으로 — 3곳: LeetCode(글자) · Luogu(면 배지) · AtCoder Problems(도넛 조각, 글자용과 다른 원색 사다리).
- 점 + 무색 이름 — 1곳: JUNGOL(칸 면 농도는 따로).
- 무색 — 1곳: 전일 아카이브.
- 근거 약함.

### T1 서열표 · 티어 리스트 구간 제목 — 16곳

- 구간마다 다른 색(테두리 · 머리 칸 · 글자) — 4곳: 전일 아카이브(왼쪽 5px 테두리 7단, 높을수록 빨강 · 낮을수록 청록, 캡처 확인) · piucenter(제목 글자 4단) · Blitz(구간 머리 칸 5색) · 라이트 HSReplay(머리 칸 그라데이션 4색, 세지 않음).
- 줄마다 티어 배지 · 글자 색(구간 머리 대신) — 5곳: OP.GG(방패 5색) · DEEPLOL(육각 5색) · LOL.PS(육각 + 줄 면 5색) · MetaTFT(글자 칸 + 왼쪽 테두리 5색) · U.GG(글자 6색).
- 맨 위 한 구간만 다른 색 — 1곳: V-ARCHIVE(16.1 만 빨강 테두리, 나머지 45구간 남색).
- 무색 — 4곳: DXRating · 3icecream · SNJ@KMZS · LoLalytics.
- 그림 아이콘 — 1곳: sdvx.in. 랭크 분포 막대(구간 색 막대) — 2곳: TETR.IO 18색 · Tracker.gg 9색.
- 근거 약함.

### P16 업적 단계 색 · 못 얻은 것 — 16곳 + DS 0곳

- 금속 3단 동 · 은 · 금 — 2곳: GitHub(칩 면 rgb(249,191,167) · (225,228,228) · (250,229,126), 캡처 확인) · Discourse(`--bronze #cd7f32` · `--silver #c0c0c0` · `--gold rgb(231,195,0)`). 라이트 Stack Overflow 도 같은 꼴.
- 금속 4단(백금 추가) — 2곳: Exophase · Game Jolt(그림).
- 금속 + 유채색 이어 붙인 6단 — 2곳: Quaver(금속 3 + 유채 3 틀) · TETR.IO(육각 테 6단 + 순위 6단).
- 금 · 은 2색 — 1곳: Advent of Code(별).
- 단계 색 없음(그림 고유색 · 글자 · 한 색 체크) — 9곳: Steam 배지 · Kongregate · Chess.com · Cytoid · Genshin Center · Paimon.moe · LeetCode · AtCoder Problems · Boot.dev.
- 못 얻은 것: 흑백 그림(Steam) · 따로 만든 회색 그림(Quaver 틀 rgb(88,88,88)) · 물음표 그림 + 설명 숨김(Game Jolt) · 다음 단계 줄 opacity 0.5(Genshin Center) · 빈 체크칸 · 딴 것만 보여 줌 5곳(GitHub · Discourse · Kongregate · Cytoid · Chess.com).
- DS: 금속 · tier 뜻 토큰 0곳. 등급 단계 색 토큰은 SEED 매너온도 l1–l10(금속 아님) 하나.
- 근거 약함(금속 단계 색은 7곳).

### P17 업적 진행 막대 — 6곳

- 모두 단계 색이 아닌 한 색: Steam 레벨 XP 회색 · 로스트아크 수집 노랑 rgb(255,210,0) · KLOA 브랜드 보라 카드 채움 · SEELIE 브랜드 보라 알약 · AccSaber 브랜드 호박 2px · Exophase(진행 중 초록 · 100% 노랑).
- 근거 약함.

## 당근 SEED 3.2.1 다크로 옮길 수 있나 (사실)

- 등급 단계 색 토큰: `manner-temp-l1…l10`(글자 · 면 20개, 회색 → 노랑 → 주황 → 빨강, 당근 화면에서 매너온도 글자에 그대로 쓰임). 온도를 단계로 바꾸는 규칙은 패키지에 없다.
- 팔레트 유채색 6갈래(carrot · blue · red · green · yellow · purple) × 10단 + gray. 청록 · 분홍 갈래는 없다. 레이팅 사다리가 청록 · 분홍을 쓰는 서비스 꼴(Codeforces · AtCoder 계열, osu! 끝 구간)은 그 칸이 SEED 에 없다.
- 금속 이름 토큰은 없다. 실측 금속색과 가장 가까운 SEED 칸(ΔE2000, #16171b 위 대비):
    - Discourse 동 #cd7f32 → yellow-600 #b6720d ΔE 7.0(4.61) · 은 #c0c0c0 → gray-700 #b0b3ba ΔE 5.0(8.53) · 금 #e7c300 → yellow-800 #dab156 ΔE 9.6(8.87).
    - GitHub 동 칩 #f9bfa7 → carrot-900 #eecebc ΔE 7.2 · 은 칩 #e1e4e4 → gray-900 #e9eaec ΔE 2.2 · 금 칩 #fae57e → yellow-900 #e5d49b ΔE 8.6.
    - 비교용 지금 NosLog: 동 #b98b67 → yellow-600 ΔE 13.3 · 은 #c4c8ce → gray-800 ΔE 5.4 · 금 #d6b56d → yellow-800 ΔE 3.5.
- 진행 막대: SEED 는 원형 진행만 있고 가로 막대 부품은 없다.
- 이미 정한 값(공유 폴더 DECISIONS.md)과 겹치는 칸: 상태색 성공 green-700 #22b27f · 안내 blue-700 #41a2f9 · 경고 yellow-700 #ca901c · 위험 red-700 #ff6e60, 지도 핀 red-700. 같은 칸을 등급 색으로 쓰면 뜻이 겹친다는 사실만 적는다.

### 같은 표시 자리별 색 — Pianist · 등급 B (다크 5곳 · DS 7곳, 근거 약함)

확인 2026-11-24. 다크 · 로그인 없음. 사실만, 추천 없음. 원문 · 캡처는 세션 공유 폴더 `common-layer/stage3/color/rules5/r5-game-colors/`(`REPORT.md` · `caps/`).

- 게임 공식 색: RemyWiki 에 랭크 이름 · 점수 기준(Pianist 1,000,000 · S 950,000 · A+ 900,000 · A 850,000 · B+ 800,000 · B 750,000 · C 700,000)만 있고 색 설명 없음. 공식 e-amusement 쪽은 소개 셸뿐, 일본어 위키 주소 404. Pianist · B 의 게임 표시 색은 미확인.
- NosLog 지금: Pianist 는 점수 목표 · 랭크 분포 · 레벨 누적 막대 · 서열표 테두리에서 #ff8dcc(`score-goal-pianist`), 악곡 목록 필터 칩 · 적용 토큰에서 #f2a634(`achievement-pianist`). 등급 B 막대는 `score-grade-b` = 차트 단색 `local-data-single` #3278be 별칭이라 차트 색이 바뀌면 같이 바뀐다.
- 같은 등급 · 급수를 자리마다 같은 색으로 쓰는 곳 3: osu!(프로필 머리 · 기록 목록이 같은 등급 SVG 한 벌) · Codewars(급수 배지가 순위표 · 문제 검색에서 같은 4색: 1–2 kyu 보라 rgb(134,108,199) · 3–4 파랑 · 5–6 노랑 · 7–8 흰색, dan 회색) · Luogu(문제 목록 난이도 면 배지와 필터 줄 글자가 같은 8색, 통과율 막대는 난이도 색과 별개의 파랑).
- 등급 글자를 무색으로 두는 곳 2: Cytoid(등급 칩 전부 회색, 색은 난이도 칩) · LoLalytics(티어 글자 무색 rgb(204,204,204)). 같은 서비스 안 자리마다 다른 곳은 기존 기록의 전일 아카이브 1곳.
- 등급 색을 차트 단색 갈래에서 가져오는 서비스는 본 5곳에서 0곳. LeetCode · solved.ac · U.GG · OP.GG · TETR.IO · Raider.IO 는 값이 비어(클라이언트 렌더) 못 셌다.
- DS(문서 읽음 4 · 일부 2 · 미확인 1): 뜻 색과 차트 범주 색을 따로 둠 — Carbon(Categorical · Alert 절 분리, 값은 겹침) · Atlassian(`color.chart.categorical.*` 와 `color.chart.success` 등, accent 에 뜻 있는 색 금지 문장) · Primer(`--fgColor-success` 와 `--data-*`) · SEED(역할 토큰과 팔레트 분리, 차트 문서 없음). 같은 뜻을 부품마다 같은 토큰: Atlassian 역할 이름 공통 · Polaris `tone` 공통 · SEED 역할 공통, Carbon 은 컴포넌트 고유 토큰 원칙, Primer 는 공통과 부품 전용 혼재. Spectrum 2 · Polaris 일부, Material 3 미확인.

### D7 끝 색 — 난이도 사다리 맨 위를 어떻게 칠하나 (다크 38곳 · DS 5곳)

2026-11-24. 서열 값 계단이 난이도 색 네 단계가 된 뒤 그 위 칸(14.5 이상)을 따로 칠할지의 재료다. 새로 잰 것은 Sekai Viewer · BeatSaver 2곳(headless Playwright, 다크 · 권한 없음 · ko-KR · 1440×900, 계산값)과 디자인 시스템 패키지 값뿐이고, 나머지 36곳은 위 D7 · T1 · P3 · R2 기록과 「곳마다」 에서 맨 위 단 칸만 읽었다(다시 재지 않음, 캡처는 세션 공유 폴더 `rules5/r5-end-color/` · `feature-research/B-grade/caps/`). 추천은 없다.

- 새 색 한 칸 14곳(국내 5 · 해외 9): 맨 위 단만 앞 단과 다른 계열 한 색이다.
    - solved.ac(국내) Master 숫자 rgb(193,0,233) 보라, 아래 Ruby rgb(255,0,98)(JUNGOL 계산값) · 정올 JUNGOL(국내) Master 빛 rgb(137,119,173) · V-ARCHIVE(국내) 서열 16.1 만 테두리 rgb(255,32,86) 빨강, 나머지 45구간 rgb(97,95,255) 남색 · DEEPLOL(국내) LP 선 Challenger rgb(238,122,0) 주황, 아래 Grandmaster rgb(194,52,73) · 클로아(국내) 품질 100 rgb(235,167,12) 금, 90–99 #8045dd 보라.
    - Codewars black(dan) 육각 rgb(85,85,85) · 글자 rgb(153,153,153), 아래 purple rgb(134,108,199) · Luogu NOI/NOI+/CTS 면 rgb(8,17,60) 짙은 남색, 아래 rgb(128,43,174) 보라 · Quaver master #b7b7b7 회색, extreme #7b61eb · ScoreSaber · BeatLeader Expert+ rgb(143,72,219) 보라, Expert rgb(191,42,66) · TETR.IO 분포 막대 U rgb(255,56,19) → X rgb(255,69,255) → X+ rgb(167,99,234) · U.GG 지난 시즌 태그 Challenger rgb(244,200,116) 금, Grandmaster rgb(205,69,69) · Blitz challenger #f4c874 금, grandmaster #ef4f4f.
    - BeatSaver(새 실측, 곡 목록 난이도 알약 면 · 글자 rgb(221,221,221)): Expert+ rgb(118,70,175) 보라 대비 4.73 · Expert rgb(181,42,28) 4.67 · Hard rgb(189,85,0) 3.46 · Normal rgb(18,104,161) 4.39 · Easy rgb(0,128,85) 3.66. 캡처 `rules5/r5-end-color/caps/beatsaver-home.png`.
- 같은 사다리 마지막 색 그대로 6곳(국내 1 · 해외 5): 전일 아카이브(서열 13 rgb(237,120,126)까지 청록 → 빨강 7단, 새 색 없음) · Edabit Expert rgb(219,40,40) · LeetCode Hard · piucenter Expert rgb(237,71,149) · AtCoder Problems red rgb(255,103,103)(2800 이상 같은 색) · osu! 별 난이도 연속 색 끝 #18158E 짙은 남색(면 대비 1.30).
- 그라데이션 · 금속 끝 화면 3곳 + 문서 1곳: osu! 세계 순위 lustrous `linear-gradient(rgb(255,230,0), rgb(237,130,255))` · AtCoder Problems 3200 이상 금속 3단(bronze · silver · gold 3색 그라데이션) · 전일 아카이브 레이팅 숫자 글자 그라데이션 9단 · AccSaber CSS apex #a855f7(문서 값).
- 맨 위 색 없음 15곳(국내 9 · 해외 6): OP.GG · YOUR.GG · LOL.PS · 로펙 · fconline.gg · 던담 · 던파기어 · 로아와 · 일로아(역할 색이라 값 구간 색 아님) · DXRating · 3icecream · SNJ@KMZS · Lichess · Chess.com · Sekai Viewer(새 실측: 난이도 탭 Easy–Append 6개 글자 모두 rgba(255,255,255,.7), 고른 Append 만 rgb(41,138,123), 레벨 숫자 무색, 캡처 `rules5/r5-end-color/caps/sekai-tabs.png` · `sekai-diff3.png`).
- 종류 사다리(난이도 이름마다 색이라 맨 위가 늘 자기 색): Etterna · Cytoid. 위 곳 수에 넣지 않음.
- DS 5곳은 가장 높은 심각도를 따로 끝 색으로 두지 않고 danger · critical 한 색으로 끝낸다. Primer 다크 danger #f85149 · severe #db6d28 · attention #d29922 · Atlassian 다크 danger bold #F87168 · warning bold #FBC828 · Carbon support-error #da1e28 · caution-major #ff832b · caution-minor #f1c21b(흰 테마 값, 다크 미확인) · Polaris critical rgba(199,10,36,1) · caution rgba(255,230,0,1)(라이트 토큰) · Spectrum negative · notice 시각 색 별칭만 확인(값 미확인).
- 미확인 · 막힘(세지 않음): Codeforces · Warcraft Logs · dpm.lol · LeagueOfGraphs · csstats.gg · Rocket League Tracker · RoyaleAPI · Liquipedia · WACCA fandom(Cloudflare 확인 창), OP.GG 발로란트 · 오버워치(403), solved.ac 티어 그림 SVG, 14.5 에 해당하는 값을 쓰는 서비스의 맨 위 칸 실제 표시.
- 근거 약함: 새 실측이 2곳이라 곳 수는 기존 기록 읽기에 기대고, 값 하나하나는 위 「곳마다」 원문으로 확인해야 한다.

## 근거 약함 · 미확인

- 기능마다 30곳을 채운 것은 R2 하나. D3 은 0곳(모두 로그인 뒤).
- 미확인: solved.ac 공식 티어 색표 · AtCoder 공식 색 규칙 문서(이번에 열지 않음, solved.ac 색은 JUNGOL 계산값으로 대신) · 전일 아카이브 레이팅 9단 경계(표본 25명) · Quaver 난이도 경계 · 로스트아크 아이템 레벨 글자가 구간마다 바뀌는지 · 그림 아이콘 색(Exophase · Game Jolt · Quaver · TETR.IO)은 화소 표본 · Chess.com 메달 · Stack Overflow 점 계산값 · antd colorError 다크 값 · Spectrum 진행 막대 트랙 토큰 연결.
- SEED 부품 동작은 3.2.1 이 아닌 npm `@seed-design/react@3.4.0` · `@seed-design/css@3.4.0` 으로 확인했다(매너온도 값은 3.2.1 정본 표와 같음).
- 캡처 직접 대조: 전일 아카이브 서열표 · osu! 곡 상세 · solved.ac 랭킹 · GitHub 업적 · 당근 매너온도 · DEEPLOL 진행 막대 · OP.GG 티어 리스트, 모두 기록과 맞음.

## 곳마다

묶음별 원문을 그대로 옮긴다. 제목 단계만 한 칸씩 내렸다.

### 경쟁 프로그래밍 · 코딩 학습 (`parts/cp.md`)

2026-11-22 확인. headless Playwright 1.61.1 Chromium, colorScheme dark · 권한 없음 · ko-KR · 1440×900, 로그인 없음. 캡처 `caps/cp/`. 대비는 WCAG 2(투명도는 바탕과 섞어 잼). 잰 사실만 적는다.

#### 센 곳

- 다크로 화면을 잰 곳 10곳: 국내 2(solved.ac — 랭킹만 · 정올 JUNGOL) · 해외 8(LeetCode · Codewars · AtCoder Problems · yukicoder · 洛谷 Luogu · Boot.dev · Edabit · Advent of Code). 이 가운데 늘 다크 1(Advent of Code), 단추로 켠 다크 2(AtCoder Problems 「Theme → Dark (Beta)」 · JUNGOL 「다크 테마」), 나머지는 prefers-color-scheme 따라감.
- 라이트만(꼴만 적음) 5곳: 국내 2(CodeUp · 프로그래머스 스쿨) · 해외 3(AtCoder 공식 · CodeChef · Kaggle). 기능 자리를 못 본 라이트 곳은 세지 않고 아래 목록에만.
- 기능별 다크 곳 수: P3 7(LeetCode · Codewars · AtCoder Problems · yukicoder · Luogu · Boot.dev · JUNGOL) · R2 10(위 10곳 모두) · D3 0 · D4 1(LeetCode 로그아웃 숨김) · D5 5(LeetCode 고리 · AtCoder Problems 원 채움 · Boot.dev XP 막대 · Edabit 막대 트랙만 · JUNGOL 고리) · D7 7(LeetCode · Codewars · AtCoder Problems · yukicoder · Luogu · Edabit · JUNGOL) · P14 4(LeetCode · AtCoder Problems · Luogu · JUNGOL) · T1 0 · P16 4(LeetCode 그림 · AtCoder Problems 트로피 · Boot.dev · Advent of Code 금은 별) · P17 0.
- 기능별 라이트만 곳 수: P3 1(AtCoder) · R2 4(AtCoder · CodeChef · Kaggle · CodeUp) · D7 1(프로그래머스) · P16 1(Kaggle 메달).
- 문서 · CSS 공개값(화면 곳 수와 따로): Luogu `--lcolor--*` 12색 × 5단 변수 · Codewars `is-<색>-rank` 클래스 5색 · AtCoder Problems `difficulty-<색>` 클래스 · JUNGOL 이 solved.ac 티어 색과 같다고 쪽에 적음(색 값은 JUNGOL 계산값). solved.ac 공식 색표 · AtCoder 공식 색 규칙 문서는 이번에 열지 않음(미확인).
- 막힌 곳: solved.ac 프로필 · 문제 쪽(Cloudflare 확인 창, 같은 날 여러 번), solved.ac 랭킹 21쪽부터(로그인 벽) · Codeforces(Cloudflare 403) · DMOJ(Cloudflare 403) · Project Euler(보안 확인 401) · 백준 사용자 쪽(로그인 벽) · Hack The Box(동의 창 + 404) · Sololearn(동의 창) · CodinGame · TryHackMe · HackerRank(쿠키 창이 덮음, 라이트) · codedex.io(오류 화면) · 구름LEVEL(2026-10-30 서비스 종료 공지) · SW Expert Academy(시스템 오류 404) · career.programmers · softeer.ai(주소 못 찾음) · Root Me(다크지만 랭킹 화면을 찾지 못해 안 잼) · freeCodeCamp(다크, 등급 · 레이팅 화면 없음).
- 이 묶음에 국내 다크 곳이 적다: 국내 경쟁 프로그래밍 · 학습 서비스 대부분이 라이트만이거나(백준 · 프로그래머스 · 코드트리 · CodeUp · 엘리스 · 코딩도장) 닫혔다(구름LEVEL).

---

#### solved.ac — https://solved.ac/ranking/tier

- 확인 2026-11-22 · 국내 · 다크(prefers-color-scheme 따라감, html 바탕 rgb(9,9,11)) · 글자 rgb(249,250,251) · 브랜드색 로고 면 rgb(23,206,58).
- 같은 날 Cloudflare 확인 창이 들쭉날쭉 떴다. 랭킹 1–20쪽만 열림. 프로필(/profile/koosaga) · 문제 목록(/problems/level)은 확인 창(Turnstile) 또는 「문제 목록을 불러오지 못했습니다」 로 막힘. 21쪽부터는 「로그인이 필요합니다」 벽.
- R2 랭킹 표: 레이팅 숫자 글자색 + 앞 번개 아이콘 stroke 를 티어 색으로 칠함. 이름은 칠하지 않음(rgb(249,250,251)). 아바타 둘레 고리는 티어 2색 그라데이션.
    - Master(1쪽): 숫자 rgb(193,0,233) 18px 대 바탕 4.21, 고리 `linear-gradient(to top, rgb(140,145,255), rgb(193,0,233))`.
    - Diamond(20쪽): 숫자 rgb(83,135,255) 대 바탕 5.95, 고리 `linear-gradient(to top, rgb(0,180,252), rgb(83,135,255))`.
    - 티어 아이콘 이미지(이름 앞)는 headless 에서 그림이 깨져 미확인. 다른 티어 색은 로그인 벽 때문에 미확인.
    - 캡처 `caps/cp/solvedac-R2.png`(Master), `caps/cp/solvedac-R2-mid.png`(21쪽 로그인 벽).
- P3 · D3 · D4 · D5 · D7 · P14 · T1 · P16 · P17: 막힘(프로필 · 문제 쪽 Cloudflare 확인 창). 막힘 캡처 `caps/cp/solvedac-P3.png`(확인 창) · `caps/cp/solvedac-T1.png`(목록 불러오기 실패). 같은 티어 색은 정올 JUNGOL 항목에 계산값으로 있다.
- 공개 API `https://solved.ac/api/v3/user/show?handle=koosaga` 는 200 으로 tier 31 · rating 3340 · classDecoration "gold" 같은 숫자만 준다. 색 값은 API 에 없음(문서 값 미확인).

#### LeetCode — https://leetcode.com/u/lee215/

- 확인 2026-11-22 · 해외 · 다크(color-scheme dark, body rgb(26,26,26), 카드 rgb(40,40,40)) · 브랜드색 rgb(255,161,22)(로고 · Premium).
- P3 프로필 머리: Contest Rating 숫자 「2,204」 rgb(255,255,255) 24px 400 — 구간 색 없음(대비 14.74). 옆 Level 글자 「Guardian」 rgb(10,132,255) 14px(대비 4.04) + 배지 그림. 구간 이름 Knight · Guardian(공식 2단, Guardian 만 화면 확인, Knight 글자색 미확인). 캡처 `caps/cp/leetcode-P3.png`.
- R2 Global Ranking(https://leetcode.com/contest/globalranking/): 이름 · Score(레이팅) 모두 흰 글자, 구간 색 없음. 1–3위만 금 · 은 · 동 원 그라데이션(`linear-gradient(to right bottom, rgb(253,224,71), rgb(234,179,8))` · `(203,213,225)→(148,163,184)` · `(253,186,116)→(251,146,60)`, A 무리 자리). 캡처 `caps/cp/leetcode-R2.png`.
- D3 · D4: 로그아웃 상태 문제 상세에 내 기록 자리 없음(숨김). 내 기록 표시 미확인.
- D7 문제 상세 난이도: 3단(Easy · Medium · Hard) 글자색 + 옅은 면 알약(rgba(255,255,255,0.1) 위). Easy rgb(70,198,194) 대비 7.20, Hard rgb(248,97,92) 대비 4.88(바탕 rgb(15,15,15) 위 면). 같은 쪽 비슷한 문제 목록은 면 없이 글자만: Easy rgb(0,184,163) 7.65 · Medium rgb(255,192,30) 11.69 · Hard rgb(255,55,95) 5.44. 문제 목록(/problemset/)은 「Easy · Med. · Hard」 글자만: rgb(28,186,186) 7.28 · rgb(255,183,0) 9.97 · rgb(246,55,55) 4.58(바탕 26). 같은 3단인데 쪽마다 값이 다름. 캡처 `caps/cp/leetcode-D7.png` · `caps/cp/leetcode-D7-list.png`.
- P14 프로필 난이도별 풀이: 줄 머리 「Easy · Med. · Hard」 글자색(rgb(28,186,186) 5.14 · rgb(255,183,0) 7.03 · rgb(246,55,55) 3.23, 바탕 rgba(255,255,255,0.06) 위 카드 40) + 숫자는 흰 글자. 둥근 진행 고리도 같은 3색 stroke, 빈 트랙은 같은 색 20%(rgba(28,186,186,0.2) 등).
- D5 진행: 위 고리가 「푼 수 ÷ 전체」 진행. 채움 = 난이도 색 한 색씩, 트랙 = 같은 색 20% 투명. 다음 구간 진행 막대는 없음.
- T1: 티어 리스트 없음.
- P16 배지: 그림(육각 · 방패 일러스트)만, 글자 · 테두리 색 단계 없음. 「Badges 3」 숫자 흰 글자, 「Most Recent Badge」 이름 흰 글자. 못 얻은 배지 표시는 로그아웃 상태에서 미확인.
- P17: 업적 진행 막대 없음(미확인).
- 같은 서비스 안 짝: 레이팅 숫자 무색 · Level 이름만 파랑, 난이도는 청록 · 노랑 · 빨강 3단, 배지는 그림만.

#### Codewars — https://www.codewars.com/users/g964

- 확인 2026-11-22 · 해외 · 다크(color-scheme dark, body rgb(22,23,27)) · 브랜드색 rgb(187,67,44)(Sign Up 면 · 로고 빨강).
- 단계(kyu/dan) 사다리 하나를 사용자 순위 · 문제 난이도에 함께 쓴다. 육각 배지 꼴: 바깥 육각 면 = 단계 색(테두리처럼 보임), 안 육각 rgb(24,25,25), 글자 = 단계 색.
    - 5색 · 10단: white(8–7 kyu) rgb(230,230,230) 대비 14.12 · yellow(6–5 kyu) rgb(236,182,19) 9.45 · blue(4–3 kyu) rgb(31,135,231) 4.76 · purple(2–1 kyu) rgb(134,108,199) 4.18 · black(1–8 dan) 바깥 rgb(85,85,85) · 글자 rgb(153,153,153) 6.18(안 육각 위). CSS 클래스 `is-white-rank · is-yellow-rank · is-blue-rank · is-purple-rank · is-black-rank`.
- P3 프로필 머리: 단계 육각 + 이름 + Honor 가 서버가 만든 SVG 그림 하나(`/users/g964/badges/large`). 그림 안 값: 육각 테두리 · 「1 kyu」 글자 #866CC7, 이름 #E8E8E8, Honor 숫자 「490,140」 #AAA(무색). 아래 Stats 의 「Rank: 1 kyu」 · Honor 는 rgb(239,239,239) 무색. 캡처 `caps/cp/codewars-P3.png`.
- R2 리더보드(https://www.codewars.com/users/leaderboard): 이름 앞 단계 육각만 칠함. 이름 · Honor 숫자 무색(흰 글자). 캡처 `caps/cp/codewars-R2.png`.
- D7 문제(카타) 목록(https://www.codewars.com/kata/search/): 제목 앞 같은 단계 육각(6 kyu 노랑 · 7 kyu 흰색 · 5 kyu 노랑), 베타 문제는 회색 「Beta」 면 + 「Estimated Rank」 육각. 캡처 `caps/cp/codewars-D7.png`.
- D3 · D4 · D5 · P14 · T1 · P16 · P17: 로그아웃 공개 화면에서 해당 자리 미확인(다음 단계 진행 막대는 로그인 뒤 대시보드).
- 같은 서비스 안 짝: 사용자 단계와 문제 난이도가 같은 사다리 · 같은 육각 꼴. 숫자(Honor)는 어디서나 무색.

#### AtCoder Problems — https://kenkoooo.com/atcoder/#/user/tourist

- 확인 2026-11-22 · 해외(일본, 비공식 도구) · 다크: 기본은 라이트, 위 막대 「Theme → Dark (Beta)」 를 눌러 다크로 봄(Auto 도 있음). 다크 body rgb(18,18,18), 글자 rgb(173,175,174) · 브랜드색 없음(링크 rgb(54,170,224) 계열, 고른 탭 면 rgb(14,122,172)).
- 사다리: AtCoder 레이팅 8구간(400 간격) + 3200 이상 금속 3단. 다크 테마 글자색(클래스 `difficulty-<색>`): grey rgb(192,192,192) 10.30 · brown rgb(176,140,86) 6.01 · green rgb(63,175,63) 6.61 · cyan rgb(66,224,224) 11.57 · blue rgb(136,136,255) 6.26 · yellow rgb(255,255,86) 17.57 · orange rgb(255,184,54) 10.85 · red rgb(255,103,103) 6.59(바탕 18 대비). 금속: bronze `linear-gradient(to right, rgb(150,92,44), rgb(255,218,189), rgb(150,92,44))` · silver `(128,128,128)→(255,255,255)→(128,128,128)` · gold `(255,215,0)→(255,255,255)→(255,215,0)`.
- 「topcoder-like circle」: 지름 12px(프로필 36px) 원, 테두리 1px(프로필 3px) = 구간 색, 안을 아래에서부터 구간 안 진행 비율만큼 채움(`linear-gradient(to top, <구간 색> 57.5%, rgba(0,0,0,0) 57.5%)`). 구간 안 위치를 원 채움 높이로 보여 주는 꼴.
- P3 프로필 머리: 이름 「tourist」 글자색 = 구간 색(red rgb(255,103,103) 6.59) + 앞 36px 원(3200+ 라 gold 금속 그라데이션). 레이팅 숫자는 머리에 없음. 캡처 `caps/cp/atcoderproblems-P3.png`.
- R2 랭킹(AC Count, https://kenkoooo.com/atcoder/#/ac): 기본은 이름 무색, 「Show Rating」 을 켜면 이름 글자색 = 구간 색 + 앞 12px 진행 원. 숫자(AC 수)는 무색. 캡처 `caps/cp/atcoderproblems-R2.png`.
- D7 문제 목록(https://kenkoooo.com/atcoder/#/list): 문제 이름 글자색 = 난이도 구간 색 + 앞 12px 진행 원(같은 사다리 · 같은 원). 난이도 미정 문제는 무색. 캡처 `caps/cp/atcoderproblems-D7.png`.
- D5 대응: 위 진행 원(구간 안 비율, 채움 = 지금 구간 색 한 색, 빈 곳 투명 + 같은 색 테두리). 막대 꼴은 없음.
- P14 Difficulty Pies(사용자 쪽 탭): 구간마다 도넛 하나, AC 조각 = 구간 차트 색(라이트 · 다크 같은 원색: grey 회색 · brown rgb(128,64,0) · green rgb(0,128,0) · cyan rgb(0,192,192) · blue rgb(0,0,255) · yellow rgb(192,192,0) · orange rgb(255,128,0) · red rgb(255,0,0)), Non-AC rgb(255,221,153), NoSub 회색 트랙. 도넛 아래 구간 이름 「0-399 … 2800-」 은 흰 글자(무색). 글자용 다크 색과 차트 색이 다른 값. 캡처 `caps/cp/atcoderproblems-P14.png`.
- T1: 티어 리스트 없음(Table 보기는 대회 × 문제 격자).
- P16 Trophy(사용자 쪽 탭): 얻은 트로피만 목록, 앞 초록 체크 아이콘 rgb(75,112,0)(줄 바탕 대비 2.66), 금속 단계 없음 · 못 얻은 것 표시 없음. 캡처 `caps/cp/atcoderproblems-P16.png`.
- D3 · D4 · P17: 해당 자리 없음.
- 같은 서비스 안 짝: 사용자 이름 · 문제 이름 · 진행 원이 한 사다리, 도넛 차트만 다른 원색 사다리, 트로피는 초록 체크 한 색.

#### yukicoder — https://yukicoder.me/ranking

- 확인 2026-11-22 · 해외(일본) · 다크(prefers-color-scheme 따라감, body rgb(33,37,41), 글자 rgb(222,226,230)) · 브랜드색 없음(링크 rgb(110,168,254)).
- R2 랭킹: 이름은 링크 파랑 rgb(110,168,254)(대비 6.39) 한 색, 숫자(AC 수 · 스코어 · ユーザーLv.) 무색. 구간 색 없음. 서포터만 왕관 이모지. 캡처 `caps/cp/yukicoder-R2.png`.
- D7 문제 목록 「レベル」: 별 개수(반 별 포함)로 표시, 별 색 rgb(255,255,255) 한 색 — 사다리 색 없음. 옆 「AI推定難易度」 숫자(예 3375)도 무색. 캡처 `caps/cp/yukicoder-D7.png`.
- P3 사용자 쪽: 「ユーザーLv. 0 (レベルアップまで★ * 99)」 무색 글자 줄, 값 0 도 같은 무색(빈 값 따로 없음). 캡처 `caps/cp/yukicoder-P3.png`(활동 없는 사용자 1번).
- D3 · D4 · D5 · P14 · T1 · P16 · P17: 해당 자리 없음 또는 미확인.
- 같은 서비스 안 짝: 등급 · 난이도 어디에도 유채색을 쓰지 않음(별 개수 · 숫자만).

#### 洛谷 Luogu — https://www.luogu.com.cn/ranking

- 확인 2026-11-22 · 해외(중국) · 다크(prefers-color-scheme 따라감, color-scheme dark, 카드 rgb(13,16,24) · rgb(29,32,37) · rgb(40,43,48)) · 브랜드색 파랑 rgb(33,125,187)(고른 탭 · 링크).
- 공개 색 변수: `--lcolor--<색>-1…5`(lapis · blue · cyan · green · lgreen · yellow · orange · gold · purple · pink · red · grey, 각 5단) 이 CSS 에 있다. 다크에서는 계산값이 라이트 기본값과 다르다(예 pink-3 기본 254,76,97 → 다크 계산 rgb(254,25,52), green-3 기본 82,196,26 → 다크 rgb(64,151,20)).
- 사용자 이름 색(관리자가 정하는 등급, 6색): 회색 rgb(165,165,165) 7.72 · 파랑 rgb(33,125,187) 4.27 · 초록 rgb(64,151,20) 5.12 · 주황 rgb(199,127,10) 5.86 · 빨강 rgb(254,25,52) 4.89 · 보라 rgb(128,43,174) 2.60(관리자). 바탕 rgb(13,16,24) 기준. 이름 뒤 꼬리표 면도 같은 색(예 「bj菜鸡」 면 rgb(254,25,52) + 흰 글자). 캡처 `caps/cp/luogu-names.png`(토론 목록).
- R2 咕值 랭킹: 이름 글자색 = 사용자 색. 점수 칸 숫자는 값 구간 4색 글자(`lcolor--green-3` rgb(64,151,20) 5.12 · `yellow-3` rgb(214,186,5) 9.86 · `orange-3` rgb(199,127,10) 5.86 · `red-3` rgb(214,45,26) 3.85). 관찰한 값: 초록 ≥80대 · 노랑 60–70대 · 주황 30–50대 · 빨강 0–26(경계값 공식 미확인). 「比赛」 칸 100 은 무색으로 보였다(미확인). 캡처 `caps/cp/luogu-R2.png`.
- P3 프로필 머리(https://www.luogu.com.cn/user/377873): 배너 위 이름 흰 글자(랭킹에서는 빨강인 사용자도 배너에서는 흰색) + 꼬리표 면(사용자 색). 머리 오른쪽 「等级分 2261」 숫자 무색. 오른쪽 「咕值」 상자 숫자도 무색(랭킹 쪽과 달리 구간 색 없음). 캡처 `caps/cp/luogu-P3.png`(kkksc03) · `caps/cp/luogu-P3b.png`(EricWan).
- D7 문제 목록(https://www.luogu.com.cn/problem/list): 난이도 9단 면 배지(둥글기 2px, 테두리 1px = 면보다 어두운 같은 색, 흰 글자). 暂无评定 rgb(165,165,165)+글자 rgb(17,17,17) 7.67 · 入门 rgb(254,25,52) 흰 글자 3.89 · 普及− rgb(199,127,10) 3.25 · 普及 rgb(226,166,0) 2.17 · 普及+/提高− rgb(64,151,20) 3.71 · 提高 rgb(14,148,148) 3.70 · 提高+/省选− rgb(33,125,187) 4.45 · 省选/NOI− rgb(128,43,174) 7.31 · NOI/NOI+/CTS rgb(8,17,60) 18.17. 난이도 거르기 목록에서는 같은 색을 글자색으로만 씀(NOI/NOI+/CTS 글자 rgb(8,17,60) 은 바탕 rgb(40,43,48) 위 1.11). 캡처 `caps/cp/luogu-D7.png`.
- P14 프로필 「练习 → 难易度统计」(https://www.luogu.com.cn/user/377873/practice): 줄 머리 = D7 과 같은 9단 면 배지, 개수(「320题」) 흰 글자. 캡처 `caps/cp/luogu-P14.png`.
- 같은 쪽 「比赛等级分趋势图」 선은 파랑 rgb(33,125,187) 한 색, 마지막 점만 빨강(C 무리 자리).
- D3 · D4 · D5 · T1 · P16 · P17: 해당 자리 없음 또는 로그인 뒤(미확인).
- 같은 서비스 안 짝: 이름 6색(관리 등급) · 문제 난이도 9단 면 배지 · 咕值 점수 4색 글자는 서로 다른 사다리지만 같은 `--lcolor` 팔레트에서 뽑음. 레이팅(等级分) 숫자는 어디서나 무색.

#### Boot.dev — https://www.boot.dev/u/labil_one

- 확인 2026-11-22 · 해외 · 다크(color-scheme dark, body rgb(37,41,54), 카드 rgb(28,30,41), 배경 지도 질감 그림 + `linear-gradient(rgb(18,22,32), rgb(24,27,38))`) · 브랜드색 금색(로그인 버튼 테두리 rgb(253,223,143), 금속 질감 그림).
- P3 프로필 머리: 「LEVEL 108」 숫자 rgb(215,222,230) 36px 무색(대비 12.22), 옆 직함 알약 「ARCHMAGE」 회색 테두리 알약(무색). 단계는 아바타 둘레 그림 틀(금 · 청록 장식 일러스트)로 보여 줌. 캡처 `caps/cp/bootdev-P3.png`.
- D5/P17 대응(다음 레벨 XP 막대): 두께 6px · 완전 둥근 막대. 채움 = 금속 금 그라데이션 `linear-gradient(0deg, rgb(253,223,143) 3.13%, rgb(238,178,63) 41.12%, rgb(193,133,0) 60.62%, rgb(238,178,63) 103.12%)` + 돌 질감 그림 + 끝에 흰 빛 `radial-gradient(circle at 100% 100%, rgb(245,247,249) 10%, rgb(18,22,32) 70%)`, 테두리 2px rgb(253,223,143). 트랙 rgb(37,41,54)(카드 rgb(28,30,41) 보다 밝은 면). 아래 양 끝 「5,733 XP · 8,960 XP」 rgb(163,179,199) 7.76. 채움 밝은 끝 rgb(253,223,143) 대 트랙 11.13 · 어두운 띠 rgb(193,133,0) 대 트랙 4.57. 레벨과 상관없이 같은 금색(다른 레벨 미확인).
- R2 리더보드(https://www.boot.dev/leaderboard): 카드형 3열 격자. 이름 흰 글자 · XP 숫자 rgb(163,179,199) 무색, 단계는 아바타 둘레 그림 틀(동 · 은 · 금 · 보석 장식)로만. 오른쪽 활동 줄의 이름 뒤 작은 단계 그림. 캡처 `caps/cp/bootdev-R2.png`.
- P16 업적(같은 쪽 Achievements): 「Sharpshooter: Platinum」 처럼 이름 뒤 단계 이름을 rgb(163,179,199) 12px 회색 글자로 적고, 단계는 원형 그림(일러스트)이 가짐. 단계 이름에 색 없음. 리그 기록(League Placements)에도 「Bronze」 같은 회색 글자. 못 얻은 것 표시 미확인. 캡처 `caps/cp/bootdev-P16.png`.
- D3 · D4 · D7 · P14 · T1: 공개 프로필에 해당 자리 없음(미확인).
- 같은 서비스 안 짝: 숫자 · 단계 이름은 모두 무색 글자, 단계 색은 그림(아바타 틀 · 업적 원)과 금색 XP 막대에만.

#### Edabit — https://www.edabit.com/challenges

- 확인 2026-11-22 · 해외 · 다크(`:root[data-ed-theme="dark"]`, prefers-color-scheme 따라감, body rgb(16,24,19), 글자 rgb(200,211,203)) · 브랜드색 초록 rgb(45,184,75)(위 막대 면).
- D7 문제 난이도 6단: 목록 오른쪽 글자색(`--ed-browse-difficulty`), 거르기 목록은 글자 무색 + 앞 10px 색 점. Very Easy rgb(45,184,75) 6.94 · Easy rgb(66,178,173) 7.06 · Medium rgb(41,135,205) 4.68 · Hard rgb(250,188,46) 10.58 · Very Hard rgb(232,120,52) 6.17 · Expert rgb(219,40,40) 3.74(바탕 rgb(16,24,19) 대비). 로그아웃 목록에는 Very Easy 만 보여 다른 단계의 목록 글자색은 점 색과 같은지 미확인. 캡처 `caps/cp/edabit-D7.png`.
- D5/P17 대응(왼쪽 「Level 1 · 50 XP to Level 2」 막대): 트랙 rgb(48,64,56)(바탕 대비 1.65) 7px 완전 둥근, 로그아웃이라 채움 0(채움 색 미확인). 「Level 1」 rgb(240,244,241) · 남은 XP 글자 rgb(158,172,162).
- R2 XP 리더보드(같은 쪽 왼쪽): 이름 흰 글자 · XP 숫자 무색, 구간 색 없음. 고른 기간 탭 「Week」 글자만 초록.
- P3 · D3 · D4 · P14 · T1 · P16: 로그아웃 공개 화면에서 미확인.

#### Advent of Code — https://adventofcode.com/2024/stats

- 확인 2026-11-22 · 해외 · 늘 다크(body rgb(15,15,35), 글자 rgb(204,204,204), color-scheme 지정 없음) · 브랜드색 초록 rgb(0,204,0)(제목) · 링크 rgb(0,153,0).
- P16 대응(퍼즐 별 2단): 두 부분 다 푼 것 「Gold」 rgb(255,255,102) 대비 17.74, 첫 부분만 「silver」 rgb(153,153,204) 6.99. 별 「*」 글자와 수 숫자를 같은 두 색으로 칠함(`.stats-both` · `.stats-firstonly`). 막대 대신 별표 글자 개수로 비율을 보임. 못 푼 것은 표시 없음. 캡처 `caps/cp/aoc-P16.png`.
- R2 리더보드(https://adventofcode.com/2024/leaderboard): 점수 · 이름 무색(rgb(204,204,204)), 등급 색 없음. 후원 표식만 「(AoC++)」 rgb(255,255,102) · 「(Sponsor)」 rgb(121,162,216). 캡처 `caps/cp/aoc-R2.png`.
- P3 · D3 · D4 · D5 · D7 · P14 · T1 · P17: 해당 자리 없음(레이팅 · 난이도 없음).
- 같은 서비스 안 짝: 금 · 은 2색이 별(완료 단계)과 후원 표식에 같이 쓰임.

#### 정올 JUNGOL — https://jungol.co.kr/account/24964

- 확인 2026-11-22 · 국내 · 다크: 왼쪽 아래 테마 단추가 「시스템 → 밝은 → 다크」 로 돈다. colorScheme dark 로 열면 `data-theme=dark` 인데 바탕은 밝게 보였고(body rgb(246,247,249)), 단추로 「다크 테마」 를 고르면 body rgb(16,16,16) · 카드 rgb(26,26,26) · 글자 rgb(209,209,211). 브랜드색 남보라 rgb(80,82,226)(로그인 · 고른 메뉴), 제목 글자 rgb(128,130,247).
- 사다리: 쪽 아래 「사용자의 티어는 solved.ac 의 AC 레이팅 기준으로 계산돼요」 라고 적고 solved.ac 티어 그림(번호 1–31 SVG)과 같은 색을 쓴다. 티어 색(점 · 빛 · 막대 조각 계산값): Bronze rgb(173,86,0) 3.40 · Silver rgb(67,95,122) 2.62 · Gold rgb(236,154,0) 7.62 · Platinum rgb(39,226,164) 10.36 · Diamond rgb(0,180,252) 7.40 · Ruby rgb(255,0,98) 4.50 · Master 빛 rgb(137,119,173) 4.40 · Unranked rgb(92,98,108) 2.83(카드 rgb(26,26,26) 대비).
- P3 프로필 머리: 이름 「@donghyien」 앞에 티어 방패 그림(숫자 든 SVG) + 뒤에 티어 색 `radial-gradient(circle, rgb(0,180,252) 0px, rgba(0,0,0,0) 55%)` 빛. 이름 글자는 브랜드 제목색 rgb(128,130,247)(티어와 무관). 「레이팅 구성」 상자의 큰 숫자 「2,450」 36px 700 rgb(209,209,211) 무색(11.41) + 옆 티어 색 점 + 「Diamond III」 무색 글자. 캡처 `caps/cp/jungol-P3.png`.
- D5 대응(요약 상자 「3 → 2 · 50점 남음 · 50% 진행」): 지금 · 다음 티어 그림 두 개 사이 화살표 + 17px 진행 고리. 고리 채움 = 브랜드 rgb(128,130,247)(티어 색 아님) 굵기 8, 레일 rgb(138,145,157) 3px. 남은 점수 글자 무색.
- R2 랭킹(https://jungol.co.kr/ranking): 이름 앞 티어 그림 + 빛만. 이름 · 「AC 레이팅 2.53K」 숫자 무색 rgb(209,209,211), 옆 보너스 「+249」 rgb(232,116,136). 캡처 `caps/cp/jungol-R2.png`.
- D7 문제 목록(https://jungol.co.kr/problem): 문제 번호 앞 티어 그림 + 빛, 번호 · 제목 무색. 캡처 `caps/cp/jungol-D7.png`.
- P14 프로필 「해결한 문제 · 틀린 문제」: 티어 비율 가로 막대(높이 10px, 조각 사이 1px, 트랙 rgb(50,50,50), 완전 둥근) + 아래 줄 머리 = 티어 색 점 + 티어 이름 회색 글자 rgb(160,166,176) 12px(7.11) + 수 무색. 「분야별 풀이 기록」 표는 열 머리 = 티어 색 점 + 무색 이름, 칸 면 = 티어 색을 수만큼 진하게 섞은 면(예 Diamond 28 → rgb(21,57,71), Gold 67 → rgb(97,69,17)), 0 칸 rgb(35,35,35) + 회색 글자.
- D3 · D4: 로그아웃 문제 상세의 내 기록 자리 미확인. T1 · P16 · P17: 해당 자리 미확인.
- 같은 서비스 안 짝: 티어 색은 그림 · 점 · 빛 · 막대 조각 · 표 칸 면에만, 숫자 · 티어 이름은 무색 글자, 진행 고리는 브랜드색.

---

#### 라이트만 (colorScheme dark 로 열어도 밝은 바탕 — 꼴만 적고 따로 셈)

- AtCoder 공식(https://atcoder.jp/users/tourist · /ranking) · 해외: 이름 글자색 = 레이팅 구간 색(빨강 `user-red` rgb(255,0,0)), 랭킹 이름도 같은 꼴. 랭킹 상위에서는 표준 8색 밖 이름 색(rgb(248,170,229) · rgb(255,0,255) · rgb(128,0,128) · rgb(102,204,255) 등)도 보였다(까닭 미확인). Rating · Highest 숫자는 굵은 무색. 이름 앞 왕관 · 단 그림. 캡처 `caps/cp/atcoder-P3.png` · `caps/cp/atcoder-R2.png`.
- CodeChef(https://www.codechef.com/ratings/all) · 해외: 별 단계 면 배지 + 흰 글자 — 7★ rgb(208,1,27) · 3★ rgb(51,102,204) · 1★ rgb(102,102,102)(나머지 단계 미확인). 캡처 `caps/cp/codechef-R2.png`.
- Kaggle(https://www.kaggle.com/rankings) · 해외: 티어는 선 그림 아이콘 색(Grandmaster 금 · Master 주황 · Expert 보라) + 아바타 둘레 고리 색, 이름 · 점수 무색. 메달 열은 금 · 은 · 동 원 그림 + 수(P16 금속 3단 꼴). 쿠키 창은 아래 띠라 화면을 가리지 않음. 캡처 `caps/cp/kaggle-R2.png`.
- CodeUp(https://codeup.kr/ranklist.php) · 국내: 이름 글자색 = 푼 문제 수 12단(1100 · 1000 빨강, 900 주황, 800 보라, 700 파랑, 500 청록, 400 초록, 300 연두, 200 금, 100 올리브, 50 검정, 기타 회색), 맨 위 단은 첫 글자만 검정(Codeforces 꼴). 범례를 표 위에 색 면 칩으로 둠. 숫자 무색. 캡처 `caps/cp/codeup-R2.png`.
- 프로그래머스 스쿨(https://school.programmers.co.kr/learn/challenges) · 국내: 문제 난이도 「Lv.1–5」 글자색 — Lv.1 rgb(27,186,255) · Lv.2 rgb(71,200,76) · Lv.3 rgb(255,168,0) · Lv.4 rgb(255,107,24) · Lv.5 rgb(198,88,225)(Lv.0 미확인). 캡처 `caps/cp/programmers-D7.png`.
- 백준 BOJ(https://www.acmicpc.net/problem/1000) · 국내: 로그아웃 문제 쪽에 티어 표시 없음. 사용자 쪽(/user/koosaga)은 로그인 벽, 랭킹 주소(/ranklist)는 404.
- clist.by(https://clist.by/coders/) · 해외: Coders 목록은 이름 링크 파랑 rgb(51,122,183) 한 색 · 레이팅 열 없음. 레이팅 색 사다리 화면은 미확인. 캡처 `caps/cp/clist-R2.png`.
- 이 밖에 라이트로만 열린 곳(기능 자리 못 봄): 코드트리(홈) · 엘리스(홈) · Exercism(프로필) · HackerRank(쿠키 창 · 메달 없음 사용자) · TopCoder(프로필, 레이팅 4051) · NowCoder(레이팅 표) · CodinGame(쿠키 창) · TryHackMe(쿠키 창) · DACON(랭킹 202 응답) · Frontend Mentor · CS Academy(불러오는 중).

### 리듬게임 기록 · 랭킹 · 서열표 (`parts/rhythm.md`)

확인 2026-11-22. 잰 사실만, 추천 · 판단 없음.

센 곳(다크로 기능을 본 실제 서비스) 14곳 — 국내 2(V-ARCHIVE · 전일 아카이브, 둘 다 토글 다크) · 해외 12(osu! · Quaver · EtternaOnline · ScoreSaber · BeatLeader · DXRating.net · 3icecream · piucenter · sdvx.in · AccSaber · Cytoid · SNJ@KMZS). 3icecream 은 홈 · 고르기 판이 라이트이고 난이도 목록 판만 늘 짙은 색이라 다크로 셈.
라이트만(첫 화면만 보고 기능 꼴은 미확인, 곳 수에 넣지 않음) 4곳: chunirec(가입 · 로그인 첫 화면), Gitadora Skill Viewer gsv.fun, Bestdori(곡 상세), Satellite BMS 표(BeMusicSeeker 등록용 빈 쪽).
문서 값(곳 수와 따로): osu-web 소스(레벨 · 순위 8단 그라데이션, 별 난이도 연속 색 지점) · AccSaber CSS 변수(금속 6단 · 칭호 15단 · 업적 상태 섞기) · 전일 아카이브 CSS(레이팅 9단).

기능별 본 곳 수(14곳 중):

- P3 프로필 레이팅 숫자 6 — 구간 색 칠함 2(전일 아카이브 글자 그라데이션 9단, osu! 순위 숫자 그라데이션 8단) · 한 색 브랜드 2(Quaver 금 · ScoreSaber 노랑) · 무색 2(Etterna · AccSaber AP, 단 AccSaber 레벨 칭호는 단계색)
- R2 랭킹 표 레이팅 7 — 7곳 모두 값에 구간 색 없음(한 색 브랜드 4 · 무색 · 링크색 3). 순위 1–3위만 금 · 은 · 동 2(BeatLeader 면 배지, AccSaber 글자)
- D3 곡 상세 내 점수 0(모두 로그인 필요) · D4 빈 값 1(V-ARCHIVE 「-」 무색) · D5 진행 막대 0(관련: osu! 레벨 막대 브랜드 분홍 한 색, AccSaber 레벨 막대 단계색 그라데이션 · Complexity 미니 막대 사다리 그라데이션)
- D7 곡 난이도 숫자 9 — 값 사다리 색 3(osu! 연속 11지점 면 배지, AccSaber 연속 6지점 글자 + 미니 막대, V-ARCHIVE 3구간 × 2계열 글자) · 난이도 이름 종류색 5(Quaver 8구간 글자, ScoreSaber · BeatLeader 5종 면, Etterna 면, Cytoid 3종 그라데이션 면) · 무색 1(DXRating, 옆 종류 배지만)
- P14 레벨별 표 줄 머리 1(전일 아카이브, 무색)
- T1 서열표 구간 제목 7 — 값 사다리 색 2(전일 아카이브 왼쪽 5px 테두리 7단, piucenter 레벨 묶음 제목 글자 4단 + 곡 이름 4단) · 맨 위 한 구간만 다른 색 1(V-ARCHIVE 왼쪽 테두리) · 무색 3(DXRating · 3icecream · SNJ@KMZS) · 그림 아이콘 1(sdvx.in)
- P16 업적 단계 화면 0(AccSaber 는 문서 값만, osu! 메달은 단계 없는 그림) · P17 업적 진행 막대 1(AccSaber, 브랜드 호박 한 색 2px)

막힌 곳(세지 않음): Kamaitachi · Tachi(공개 프로필 · 게임 쪽 모두 로그인 벽), piugame.com PUMBILITY 랭킹(로그인 벽), ongeki-score.net(Cloudflare 확인 창), MuseDash.moe(20초 기다려도 데이터 안 불러옴), racla.app(주소 없음). 못 찾음: ノスしるべ 등 NOSTALGIA 기록 사이트, V-ARCHIVE 공개 기록표 주소. 기능 없음: Sekai Viewer(곡 상세에 레벨 색 표시 없음).

측정: headless Playwright 1.61.1 Chromium, `colorScheme: 'dark'`, 1440×900, 로그인 없음. 색은 `getComputedStyle` 값(oklch 등은 캔버스로 rgb 환산). 대비는 WCAG 2, 투명도는 바로 아래 바탕과 섞어 계산. 캡처 `caps/rhythm/`.

---

#### 1. V-ARCHIVE (DJMAX RESPECT V 기록 · 서열표)

- URL: https://v-archive.net (서열표 /grade/4, MAX DJPOWER /djpower/4, 곡 상세 /db/title/553 · /1 · /30) · 확인 2026-11-22 · 국내
- 다크: 토글(머리 「다크모드 토글」 단추, prefers-color-scheme 를 따르지 않음 — 기본은 라이트 `#ffffff`). 다크 바탕 body `rgb(31,31,31)` #1f1f1f · 브랜드색 따로 없음(안내 띠 글자 `rgb(163,179,255)`)
- T1 서열표 구간 제목: 꼴 = 왼쪽 5px 색 테두리 + 옅은 색 면 띠(오른쪽 모서리 8px 둥금), 제목 숫자 글자는 무색 `rgb(250,250,250)` 20px 700. 구간 46개(16.1 → 1.1) 중 맨 위 16.1 만 테두리 `rgb(255,32,86)` · 면 `rgba(75,0,25,.20)`, 나머지 45개 모두 테두리 `rgb(97,95,255)` · 면 `rgba(30,25,75,.20)` — 값 사다리 따라 바뀌지 않고 최상단 한 구간만 다른 색. 아래 선 `1px rgba(245,255,255,.10)`. 대비: 테두리 빨강 4.39 · 남색 3.60(바탕 #1f1f1f). 캡처 `varchive-T1.png`
    - 서열표 안 곡 칸의 난이도 배지(「SC 15」 등): 면 배지, 흰 글자 14px 700, 면은 난이도 종류색 — NM `rgba(240,184,0,.87)` · HD `rgba(245,94,7,.87)` · MX `rgba(244,0,80,.87)` · SC `rgba(102,60,223,.87)`. 흰 글자 대비(면 아래 회색 #52525c 섞음) NM 2.13 · HD 3.67 · MX 4.88 · SC 6.70. 곡 그림 위에 겹침
    - MAX DJPOWER 쪽(이론치 대상곡)도 같은 배지, 구간 제목 「SC15」 는 무색 큰 글자 가운데. 캡처 `varchive-djpower-T1.png`
- D7 곡 상세 레벨 숫자: 꼴 = 글자색 + 같은 색 별(×꼴) 아이콘, 23px 700. 색은 레벨 3구간 × 패턴 계열 2벌(게임 별 색과 같은 묶음): 일반 패턴 1–5 `#f7b401aa`(노랑) · 6–10 `#f95b08aa`(주황) · 11–15 `#f30253aa`(빨강), SC 패턴 1–5 `#df0074`(자홍) · 6–10 `#c604e4`(보라) · 11–15 `#3d66ff`(파랑). 옆 서열 값 「(16.1F)」 는 같은 색 14px 300. 난이도 열 머리 글자색은 종류색(NORMAL `rgba(240,184,0,.87)` · HARD `rgba(245,94,7,.87)` · MAXIMUM `rgba(244,0,80,.87)` · SC `rgba(102,60,223,.87)`). 칸 바탕 `rgba(9,9,11,.9)`(곡 DLC 그라데이션 위). 대비(#1f1f1f 위 섞음 기준): 노랑 5.19 · 주황 3.23 · 빨강 2.53 · 파랑 4.25 · 보라 4.25 · 자홍 4.11. 캡처 `varchive-D7.png` · `varchive-D7-1.png` · `varchive-D7-30.png`
- D3 · D4 · D5 곡 상세 내 기록: 로그아웃 상태에서 각 버튼 줄 아래 칸이 「-」 무색(D4 = 대시). 내 점수 색 · 진행 막대는 로그인 필요라 미확인
- P3 · R2 · P14 · P16 · P17: 공개 플레이어 랭킹 쪽 없음(DJPOWER 는 곡 목록), 공개 기록표 주소를 찾지 못해 미확인

#### 2. osu! (공식 사이트 osu-web)

- URL: https://osu.ppy.sh (프로필 /users/7562902, 랭킹 /rankings/osu/performance, 비트맵 목록 /beatmapsets, 상세 /beatmapsets/39804) · 확인 2026-11-22 · 해외
- 다크: 늘 다크(쪽마다 색상 hue 가 다름). 프로필 body `rgb(28,23,25)`, 머리 판 `rgb(42,34,38)` · 랭킹 쪽 바탕 `rgb(35,42,34)`(초록 hue) · 브랜드색 분홍 `#ff66ab`
- 문서 값(osu-web 소스, 화면 곳 수와 따로): `resources/css/layout.less` 「level tier gradients」 8단 — iron `#bab3ab,#bab3ab` · bronze `#b88f7a,#855c47` · silver `#e0e0eb,#a3a3c2` · gold `#f0e4a8,#e0c952` · platinum `#a8f0ef,#52e0df` · rhodium `#d9f8d3,#a0cf96` · radiant `#97dcff,#ed82ff` · lustrous `#ffe600,#ed82ff`(위→아래 두 색 그라데이션). 같은 8단을 세 곳에 씀: 세계 순위(`profile-page/rank.tsx`: 100위 안 lustrous, 상위 0.05% radiant · 0.15% rhodium · 0.5% platinum · 1.5% gold · 5% silver · 15% bronze · 50% iron, 그 밖은 base 무색), 레벨 배지(`user-level.tsx`: 110+ lustrous · 105 radiant · 100 rhodium · 80 platinum · 60 gold · 40 silver · 20 bronze · 그 아래 iron), 데일리 챌린지 연속 일수(360 · 240 · 120 · 60 · 30 · 10 · 5일). 별 난이도 색(`utils/beatmap-helper.ts`): 지점 0.1 `#4290FB` · 1.25 `#4FC0FF` · 2 `#4FFFD5` · 2.5 `#7CFF4F` · 3.3 `#F6F05C` · 4.2 `#FF8068` · 4.9 `#FF4E6F` · 5.8 `#C645B8` · 6.7 `#6563DE` · 7.7 `#18158E` · 9 `#000000` 사이를 gamma 2.2 RGB 보간(연속), 0.1 미만 `#AAAAAA`. 배지 글자색: 6.5 미만 `#000000` · 6.5–9 `#F6F05C` · 9 넘으면 9 `#F6F05C` → 12.4 `#18158E` 사이 보간
- P3 프로필 머리 순위 숫자: 꼴 = 글자 그라데이션(background-clip:text, 위→아래 2색). 세계 순위 「#1」 = lustrous `linear-gradient(rgb(255,230,0), rgb(237,130,255))` 30px 700, 국가 순위는 base `rgb(240,219,228)` 단색 400. 구간 8 + 무색. pp 숫자(32,269)는 무색 `rgb(240,219,228)` 16px 300 — pp 에는 색 없음, 순위에만. 대비(판 rgb(42,34,38)): lustrous 위 12.23 · 아래 6.82, 8단 아래쪽 끝 중 가장 낮은 bronze `#855c47` 2.67. 캡처 `osu-P3.png` · `osu-P3-stats.png`
    - 레벨 배지(110): 육각 테두리 아이콘 면 = 같은 lustrous 그라데이션, 숫자 흰색 20px 700. 레벨 진행 막대: 채움 `#ff66ab` 브랜드 분홍 한 색(티어 색 아님), 트랙 `rgb(28,23,25)`, 높이 6px · 둥금 10000px, 대비 6.53
    - 등급 개수 배지(SS · S · A): 등급마다 다른 면 배지(분홍 · 청록 · 초록), 이 묶음 D 기능과 별개
- R2 랭킹 표: 순위 · 이름 · pp 모두 흰 글자 `rgb(255,255,255)` 400, 나머지 열 `rgb(145,163,143)` — 구간 색 없음(줄 바탕 hue 만 쪽 색). 캡처 `osu-R2.png`
- D7 비트맵 난이도: 꼴 = 면 배지(알약, 둥금 10000px) 면이 별 난이도 연속 색, 글자는 위 규칙. 실측 FREEDOM DiVE 7.80 → 면 `rgb(23,20,137)` · 글자 `rgb(246,240,92)` 13px 700, 대비 11.71. 목록 카드의 난이도 점(6×12px)도 같은 연속 색(`rgb(128,255,79)` · `rgb(249,216,95)` · `rgb(255,86,110)` · `rgb(203,70,180)` · `rgb(134,93,213)` · `rgb(37,35,149)` · `rgb(21,19,126)` 등). 난이도 아이콘(원) 글자색도 같은 색. 짙은 끝 `#18158E` 은 바탕 대비 1.30. 상세의 별 난이도 막대 채움 `rgb(255,204,34)` 노랑 한 색(다른 속성 막대는 흰색). 캡처 `osu-D7.png` · `osu-D7-list.png`
- D3 · D4 · D5: 비트맵 상세 내 기록은 로그인 필요, 미확인
- P14: 해당 표 없음(등급 개수 배지만)
- P16 · P17: 메달은 그림 아이콘이고 단계(금속) 없음. 못 얻은 메달 표시 미확인

#### 3. Quaver

- URL: https://quavergame.com (프로필 /users/1, 리더보드 /leaderboard, 맵 /mapsets/46986) · 확인 2026-11-22 · 해외
- 다크: 늘 다크. html 바탕 `rgb(21,21,21)`, 판 `rgb(36,36,36)` · 표 줄 `rgb(54,54,54)` · 브랜드색 파랑 `rgb(5,135,229)`
- P3 프로필 머리 Overall Rating 숫자: 글자색 한 색 `text-gold` `rgb(242,201,76)` 20px 700 — 값 구간 없이 늘 같은 금색(706.64 도 1,031 도 같음). 순위(#2,433) 무색 흰 글자. 대비 10.33. 캡처 `quaver-P3.png`
- R2 리더보드: 레이팅 열 모두 같은 `rgb(242,201,76)` 600 — 구간 색 없음. 이름은 흰색, 클랜 태그만 클랜이 고른 색(`rgb(157,34,255)` 등). 대비 7.62(줄 `rgb(54,54,54)`). 캡처 `quaver-R2.png`
- D7 맵 상세 난이도 수치(41.23): 글자색 = 난이도 구간 색, 같은 줄의 난이도 이름 글자도 같은 색, 16px 600. 구간 8개 CSS 변수(`--color-d-*`): beginner `#d1fffa` · easy `#5eff75` · normal `#5ec4ff` · hard `#f5b25b` · insane `#f9645d` · expert `#d761eb` · extreme `#7b61eb` · master `#b7b7b7`. 구간 경계 수치는 미확인. 대비(`rgb(54,54,54)` 위): 11.16 · 9.23 · 6.22 · 6.56 · 4.03 · 3.91 · 2.73 · 6.03. 캡처 `quaver-D7.png`
    - 같은 서비스 다른 짝: 판정 글자색 PERF `rgb(255,231,107)` · GREAT `rgb(86,254,110)` · GOOD `rgb(0,209,255)` · OKAY `rgb(217,107,206)` · MISS `rgb(249,100,93)`; 맵 상세 BPM · 길이 숫자도 `text-gold` 금색; 점수표 레이팅 열 금색
- D3 · D4 · D5 · P14 · P16 · P17: 로그인 필요 또는 화면 없음, 미확인(업적 탭은 열지 않음)

#### 4. EtternaOnline

- URL: https://etternaonline.com (리더보드 /leaderboards/global, 프로필 /users/satori, 곡 /songs/164223/) · 확인 2026-11-22 · 해외
- 다크: 늘 다크. body `rgb(22,20,26)`, 판 `rgb(41,37,49)` · 표 줄 `rgb(66,61,77)` / `rgb(89,83,101)` 번갈아 · 브랜드색 보라 `rgb(143,96,246)`(링크 `rgb(175,139,253)`)
- P3 프로필 Overall 레이팅(40.32): 무색 흰 글자, 구간 색 없음. 아래 스킬셋 막대 8줄은 막대 길이 = 값, 막대 색 = 스킬셋 종류색(구간 아님): Overall · Stream `rgb(124,106,144)` · Jumpstream `rgb(134,127,218)` · Handstream `rgb(150,93,162)` · Jacks `rgb(239,180,249)` · Chordjacks `rgb(112,150,157)` · Stamina `rgb(173,249,212)` · Technical `rgb(178,206,194)`. 높이 10px, 오른쪽 끝만 둥금 10px, 빈 트랙 없음(판 바탕 그대로). 대비(판 위) Stream 3.08 · Jacks 8.96 · Stamina 12.31. 캡처 `etterna-P3.png`
- R2 리더보드: 순위 · 이름 · 레이팅 · 스킬셋 모두 흰 글자 700 16px, 구간 색 없음. 캡처 `etterna-R2.png`
- D7 곡 상세 / 프로필 점수표 난이도: 꼴 = 면 배지(약칭 「HD」 「IN」, 둥금 4px) 면이 난이도 이름 종류색(Hard `rgb(228,94,107)` · Challenge `rgb(175,139,253)`), 흰 글자 13–16px 700 — 수치 사다리 아님. MSD · 레이팅 숫자는 흰 글자. 흰 글자 대비 Hard 3.44 · Challenge 2.65. 캡처 `etterna-D7.png`
- D3 · D4 · D5 · P14 · P16 · P17: 화면 없음 또는 로그인 필요, 미확인

#### 5. ScoreSaber (Beat Saber)

- URL: https://scoresaber.com (랭킹 /rankings, 프로필 /u/76561198988695829) · 확인 2026-11-22 · 해외
- 다크: 다크(시스템 다크에서 다크로 열림). body `rgb(9,9,11)` · 카드 `rgb(2,2,3)` · 브랜드색 노랑 `rgb(250,204,21)`. 아래 쿠키 안내(필수 쿠키 고지)는 기능을 가리지 않음
- P3 프로필 머리 pp(20,791.66): 꼴 = 알약 면 배지(면 `rgba(248,201,20,.15)` · 글자 `rgb(250,204,21)` 600 15.75px), 값 구간 없이 늘 브랜드 노랑. 세계 · 국가 순위 「#5」 「#1」 도 같은 노랑. 대비 9.86. 캡처 `scoresaber-P3.png`
- R2 랭킹 표 pp 열: 글자색 한 색 `rgb(80,72,229)`(남보라) 400, 모든 줄 같음 — 구간 색 없음. 이름은 역할색(서포터 `rgb(249,102,83)`), 그 밖 흰색. 줄 면 `rgba(40,37,35,.40)`. 대비 2.97. 캡처 `scoresaber-R2.png`
- D7 점수 목록의 별 난이도 배지(「9.32★」): 꼴 = 면 배지(둥금 4.5px, 곡 그림 위에 겹침), 흰 글자 10px 500. 면 색은 별 수치가 아니라 난이도 이름 종류색 — Expert+ `rgb(143,72,219)` · Expert `rgb(191,42,66)` · Hard `rgb(255,99,71)` · Normal `rgb(89,176,244)` (10.50★ 가 빨강, 9.70★ 가 토마토, 7.83★ 가 파랑으로 수치 순서와 무관). 흰 글자 대비 5.10 · 5.79 · 2.95 · 2.35. 캡처 `scoresaber-D7.png`
    - 같은 목록의 점수별 pp 는 남보라 테두리 배지, 정확도는 노랑 테두리 배지, FC 는 초록 테두리 배지
- D3 · D4 · D5 · P14 · P16 · P17: 미확인(로그인 · 화면 없음)

#### 6. BeatLeader (Beat Saber)

- URL: https://beatleader.com (랭킹 /ranking/1, 랭크 맵 /maps/ranked/1) · 확인 2026-11-22 · 해외
- 다크: 늘 다크. html `rgb(34,34,34)` · 줄 `rgb(33,33,33)` · 브랜드색 파랑 `rgb(50,115,220)`(탭) · 분홍 `rgb(212,20,74)`(이벤트 단추)
- R2 랭킹 표: 순위 칸이 면 배지(둥금 3px, 글자 `rgb(238,238,238)` 500) — 1위 금 `rgb(184,134,11)` · 2위 은 `rgb(136,136,136)` · 3위 동 `rgb(139,69,19)` · 4위부터 회색 `rgb(62,62,62)`. 국가 순위 배지도 같은 규칙(국가 1위 금 등). pp 값 `rgb(238,238,238)` 500 무색 — 레이팅 구간 색 없음, 순위 3위까지만 금속색. 이름 옆 클랜 태그는 클랜색 면 배지. 글자 대비 금 2.80 · 은 3.06 · 동 6.12 · 회색 9.22. 캡처 `beatleader-R2.png`
- D7 랭크 맵 별 난이도(「10.6★」): 꼴 = 면 배지(둥금 9px), 흰 글자 11.2px 600, 면 색은 난이도 이름 종류색 — Easy `rgb(60,179,113)` · Normal `rgb(89,176,244)` · Hard `rgb(255,99,71)` · Expert `rgb(191,42,66)` · Expert+ `rgb(143,72,219)`(ScoreSaber 와 같은 값). 별 수치와 무관(Lichen 4.4★ 가 Hard 토마토, Garakuta 12.3★ 가 Expert+ 보라). 흰 글자 대비 Easy 2.67 · 나머지는 ScoreSaber 줄과 같음. 캡처 `beatleader-D7.png`
- P3 · D3 · D4 · D5 · P14 · P16 · P17: 프로필은 열지 않음, 미확인

#### 7. DXRating.net (maimai DX)

- URL: https://dxrating.net/ko (상수표 /ko/constants · /ko/constants/14, 채보 상세 /ko/songs/dsng_xccgf566bb/dx/master) · 확인 2026-11-22 · 해외(한국어 화면 있음)
- 다크: 다크(청록 회색 바탕 + 배경 그림). body `rgb(58,70,68)`, 판 `rgba(28,37,39,.54)` 반투명 유리 · 브랜드색 청록 `rgb(65,169,142)`
- T1 상수표 구간 제목(「상수 14.5」): 무색 글자 `rgb(231,231,234)` 18px 600, 띠 = 반투명 면 `rgba(28,37,39,.54)` + 1px `rgba(255,255,255,.1)` 테두리, 둥금 12px, 위에 붙음(sticky). 구간마다 같은 모양 — 값 사다리 색 없음. 레벨 고르기 카드(Lv.15 ~ Lv.10)도 무색. 대비 10.36. 캡처 `dxrating-T1.png` · `dxrating-T1b.png`
    - 같은 쪽 곡 칸: 그림 위 난이도 이름 면 배지(MAS `rgb(158,69,226)`, Re:MAS `rgb(159,75,219)`, 흰 글자 10px 700, 둥금 4px)와 그림 아래 4px 난이도색 띠(MAS `rgb(158,69,226)` · Re:MAS `rgb(186,103,248)`) — 색은 난이도 종류, 상수 값과 무관
- D7 채보 상세 상수(「14.5」): 무색 큰 글자, 왼쪽 난이도 면 배지 「MAS」 `rgb(158,69,226)`(흰 글자 대비 4.77). 탭 밑줄도 같은 보라 3px. 내부 레벨 변경 이력 숫자도 무색, 오르면 노랑 위 화살표 그림. 캡처 `dxrating-D7.png`
- P3 · R2 · D3 · D4 · D5 · P14: 「내 Rating」 은 기록 가져오기가 있어야 보임, 미확인. 공개 랭킹 없음
- P16 · P17: 화면 없음

#### 8. 3icecream / Sanbai Ice Cream (DDR 난이도표)

- URL: https://3icecream.com/difficulty_list/18 · 확인 2026-11-22 · 해외
- 다크: 섞임 — 왼쪽 곡 고르기 판과 홈은 라이트(body `rgb(224,245,255)`), 난이도 목록 판은 늘 짙은 색(줄 `rgb(41,42,51)` 과 더 짙은 줄 번갈아). colorScheme 과 무관. 브랜드색 자주 `rgb(153,77,120)`
- T1 난이도표 구간 머리(「18.95」 ~ 「18.75」, 0.05 간격): 무색 큰 글자 `rgb(222,222,227)` 44px 400, 구간마다 같은 색, 띠는 줄 바탕 번갈아(구분용)만. 값 사다리 색 없음. 대비 10.63(줄 `rgb(41,42,51)` 위), 테두리 CHALLENGE 4.01 · EXPERT 7.44. 구간 안 곡 그림 테두리 4px = 난이도 종류색(CHALLENGE `rgb(233,0,255)` 111개 · EXPERT `rgb(48,216,30)` 19개). 캡처 `3icecream-T1.png`
- 다른 기능: 로그인 필요 또는 화면 없음, 미확인

#### 9. piucenter (펌프 잇 업 채보 분석 · 난이도표)

- URL: https://www.piucenter.com (난이도표 목록 /articles/difficultytierlists, 레벨별 표 /difficulty/S20) · 확인 2026-11-22 · 해외(펌프 잇 업은 국내 게임)
- 다크: 늘 다크. body `rgb(46,46,46)`, 머리 막대 `rgb(68,68,68)` · 브랜드색 노랑 `#efb920`(로고), 링크 파랑 `rgb(0,160,220)`
- T1 난이도표 목록의 레벨 묶음 제목: 글자색 4구간 — Beginner (Lv. 1-9) `rgb(124,184,47)` 초록 · Intermediate (Lv. 10-19) `rgb(239,185,32)` 노랑 · Advanced (Lv. 20-22) `rgb(236,67,57)` 빨강 · Expert (Lv. 23-28) `rgb(237,71,149)` 분홍, 20px 600. 묶음 안 레벨 링크(S20 등)는 파랑 한 색. 캡처 `piucenter-T1.png`
- T1 레벨 하나의 난이도표(S20): 구간 머리(「11.77+ NPS」 등 속도 구간)는 무색 글자. 곡 이름 링크 글자색이 같은 레벨 안 상대 난이도 4단(범례 「■」 붙음) — Very hard `rgb(226,36,127)` · Hard `rgb(236,67,57)` · Moderate `rgb(239,185,32)` · Easier `rgb(124,184,47)`, 16px 400 밑줄. 묶음 제목 4구간과 같은 색 묶음을 다시 씀. 대비(`rgb(46,46,46)` 위): 분홍 3.10 · 빨강 3.51 · 노랑 7.52 · 초록 5.66 · Expert 분홍 3.84. 캡처 `piucenter-T1b.png`
- 다른 기능: 플레이어 기록 · 랭킹 없음

#### 10. 전일 아카이브 (DJMAX RESPECT V 하드 판정 · 전일 기록 · 레이팅)

- URL: https://hard-archive.com (레이팅 랭킹 /ranking/rating, 서열표 /tier/board/4B, 유저 /user/19, 유저 레이팅 /rating/19/4B) · 확인 2026-11-22 · 국내
- 다크: 토글(머리 전구 메뉴 「다크 모드」, Bootstrap `data-bs-theme`; 기본 라이트 `#ffffff`, prefers-color-scheme 를 따르지 않음). 다크 body `rgb(33,37,41)`, 옆 막대 더 짙음 · 브랜드색 Bootstrap 파랑 `rgb(13,110,253)`(링크 `rgb(110,168,254)`)
- P3 유저 레이팅 쪽 큰 숫자(「17.12」, 100px 700 Lato): 꼴 = 글자 그라데이션(background-clip:text) + 검정 외곽선 0.02em(`rt-outline`). 구간 9벌 CSS(`--rt-color`): default `#fff` · green `linear-gradient(to top, #63d41f, #bef3a9)` · yellow `(#d4d21f, #f4f2ae)` · orange `(#d4851f, #f4d8b0)` · red `(#d41f1f, #f3a9a9)` · brown `(#c37759, #ac5e40)` · silver(클래스 이름 `rt-sliver`) `(#b1b1b1, #cbcbcb)` · gold `(#fecb02, #fee401)` · rainbow `linear-gradient(to right, #f76cf5, #a892ff, #929cff, #87b8ff, #7fd8f6, #f2e819, #ffb47b, #ff6559)`. 4B 랭킹 표본 25명 실측: 7.3 이하 default 흰색 · 8.5–9.3 yellow · 9.76–10.2 orange · 11.25 red · 14.08 silver · 16.02 이상 rainbow(green · brown · gold 표본 없음, 경계 수치 미확인). 대비(바탕 위, 그라데이션 짙은 끝): green 8.06 · yellow 9.58 · orange 5.27 · red 2.95 · brown 3.25 · silver 7.19 · gold 10.11 · rainbow 5.33(`#ff6559`) ~ 12.00(`#f2e819`). 캡처 `hardarchive-P3-rating.png`
    - 같은 쪽 곡별 레이팅 열(20.00 등)은 무색, 수록 팩 칸은 DLC 팩 색 그라데이션 면
- R2 레이팅 랭킹 표: 레이팅 값은 링크 파랑 `rgb(110,168,254)` 한 색 밑줄(대비 6.39), 구간 색 없음 — 같은 값이 유저 레이팅 쪽에서만 구간 색. 캡처 `hardarchive-R2.png`
- T1 서열표 구간 제목(「13」 ~ 「1」): 꼴 = 왼쪽 5px 색 테두리, 제목 숫자는 무색 `rgb(222,226,230)` 32px 700. 테두리 색 값 사다리 7단: 13 `rgb(237,120,126)` · 12 `rgb(227,13,1)` · 11–10 `rgb(180,21,4)` · 9–8 `rgb(249,176,55)` · 7–6 `rgb(255,189,41)` · 5–4 `rgb(122,162,144)` · 3–1 `rgb(101,174,158)` (높을수록 빨강, 낮을수록 청록). 구간 상자는 테두리 상자(카드). 대비 5.57 · 3.18 · 2.24 · 8.30 · 9.23 · 5.43 · 5.95. 캡처 `hardarchive-T1.png`
- P14 유저 쪽 「보유 퍼펙트 개수」 표 줄 머리(SC15 ~ SC8): 무색 굵은 글자, 열 머리(4B · 5B · 6B · 8B)에 버튼 종류색 밑줄(4B `rgb(165,222,118)` 등). 버튼 비율 막대는 버튼 종류색 면(4B `rgb(165,222,118)` · 5B `rgb(139,196,213)` · 6B `rgb(255,199,138)` · 8B `rgb(118,183,172)`) — 레벨 사다리 색 아님. 캡처 `hardarchive-P3.png`
- D3 · D4 · D5 · D7 · P16 · P17: 곡 상세 · 업적은 열지 않음, 미확인

#### 11. SDVX譜面保管所 (sdvx.in, SOUND VOLTEX 채보 보관소)

- URL: https://sdvx.in/sdvx.php · 확인 2026-11-22 · 해외
- 다크: 늘 다크. body `rgb(0,0,0)` + 게임 배경 그림, 목록 판 반투명 짙은 회색 · 강조 노랑 `rgb(255,215,0)`(즐겨찾기 단추)
- T1 레벨 고르기(1 ~ 20.9): 꼴 = 레벨 숫자가 든 원형 그림 아이콘(`_19.png` 등 이미지, 계산 색 없음). 눈으로 본 모양: 낮은 레벨 짙은 남색 작은 원, 12–17 짙은 빨강 원, 18 이상 짙은 회색 원, 고른 레벨은 흰 테두리. 레벨 목록 머리는 무색 글자 띠. 계산값 없음(그림), 대비 미확인. 캡처 `sdvxin.png` · `sdvxin-T1.png`
- 다른 기능: 기록 · 랭킹 없음

#### 12. AccSaber (Beat Saber 정확도 랭킹)

- URL: https://accsaber.com (리더보드 /leaderboards, 프로필 /players/76561199866655859, 같은 쪽 Milestones 탭) · 확인 2026-11-22 · 해외
- 다크: 다크(라이트 변수도 따로 있음). body `rgb(8,8,13)`, 판 · 표 줄 `rgb(17,17,28)` / `rgb(26,25,41)` · 브랜드색 호박 `rgb(245,184,0)`
- 문서 값(사이트 CSS 변수, 화면 곳 수와 따로): 순위 · 업적 금속 `--tier-bronze #cd7f32` · `--tier-silver #c0c0c0` · `--tier-gold #ffd700` · `--tier-platinum #36cfb0` · `--tier-diamond #b9f2ff` · `--tier-apex #a855f7`(라이트 테마는 gold `#9a6700` · silver `#6b7280` · bronze `#92400e` 로 바뀜). 레벨 칭호 15단 `--tier-newcomer #6b7280` · apprentice `#3b82f6` · adept `#10b981` · skilled `#cd7f32` · expert `#c0c0d0` · master `#fbbf24` · grandmaster `#8b5cf6` · legend `#f97316` · transcendent `#22d3ee` · mythic `#ef4444` · ascendant `#f472b6` · fabled `#62d98a` · exalted `#e9e7f4` · titanic `#8da3c0` · promethean `#ff5c33` · supreme `#ffffff`. 업적 배지 상태 섞기: 못 얻음(idle) 테두리 = 단계색 8% + 바탕, 글자 6%; 진행 중 테두리 42% · 글자 28%; 얻음 테두리 · 글자 = 단계색 100%, 판 = 단계색 16% + 바탕(라이트 값은 각각 12 · 9 · 45 · 32 · 78 · 60 · 26%)
- P3 프로필 머리: Total AP 큰 숫자 무색 흰 글자. 왼쪽 레벨 영역 「Lv. 82 TRANSCENDENT」 칭호 글자가 칭호 단계색 그라데이션(`linear-gradient(90deg, rgb(8,145,178), rgb(165,243,252), rgb(8,145,178))` 글자 채움, 12px 700), 그 아래 레벨 진행 막대(4px, 둥금 2px)도 같은 단계색 그라데이션 `linear-gradient(0deg, rgb(8,145,178) 0%, rgb(34,211,238) 25%, rgb(165,243,252) 50%, …)`, 트랙 `rgb(45,42,60)`. 순위(1)는 무색. 캡처 `accsaber-P3.png`
- R2 리더보드: 순위 글자색 1위 `rgb(255,215,0)` · 2위 `rgb(192,192,192)` · 3위 `rgb(205,127,50)` 700, 4위부터 `rgb(166,161,187)`. AP 값은 모두 브랜드 호박 `rgb(245,184,0)` 600 한 색 — 구간 색 없음. 대비 금 13.36 · 은 10.30 · 동 5.96 · 기본 7.53 · AP 10.47. 캡처 `accsaber-R2.png`
- D7 맵 난이도 「Complexity」 숫자: 글자색이 값에 따라 연속으로 바뀜(4.9 `rgb(161,186,40)` · 8.6 `rgb(246,101,36)` · 10.3 `rgb(234,69,81)`), 14px 600. 숫자 아래 미니 막대(높이 3px, 둥금 2px): 트랙 = 전체 사다리 그라데이션 16% 투명, 채움 = `linear-gradient(90deg, rgb(74,144,217) 0%, rgb(34,197,94) 21.4%, rgb(234,179,8) 42.9%, rgb(249,115,22) 57.1%, rgb(239,68,68) 71.4%, rgb(168,85,247) 100%)` 를 값 위치까지 — 숫자 색은 채움 끝 지점 색. 같은 줄 난이도 이름(Easy · Normal · Hard · Expert+)은 따로 종류색 글자(Easy `rgb(60,179,113)` · Normal `rgb(74,144,217)` · Hard `rgb(249,115,22)`). 대비(`rgb(17,17,28)` 위) 4.9 → 8.54 · 8.6 → 6.07 · 10.3 → 4.88, 사다리 양끝 파랑 5.61 · 보라 4.74. 캡처 `accsaber-P3.png`(고정 카드 · 점수표)
- P16 · P17 Milestones 탭: 세트 줄마다 진행 막대 2px(둥금 2px) — 채움 브랜드 호박 `rgb(245,184,0)` 한 색, 트랙 `rgb(45,42,60)`, 0개면 트랙만. 채움 대비(트랙 위) 7.78. 세트 이름은 무색, 「14 of 14」 회색. 개별 업적 배지의 단계색은 줄을 펼쳐야 보여 화면 실측 안 함(위 문서 값만). 캡처 `accsaber-P16.png`

#### 13. Cytoid (커뮤니티 리듬게임 레벨 사이트)

- URL: https://cytoid.io/levels · 확인 2026-11-22 · 해외(한국어 화면)
- 다크: 늘 다크. html `rgb(40,42,54)`, 판 더 밝은 남회색 · 브랜드색 연보라 `rgb(165,180,252)`(검색 단추)
- D7 레벨 카드 난이도 배지(「Extreme 15」 「Hard 9」 「Easy 7」): 꼴 = 알약 면 배지(둥금 30.4px, 흰 글자 16px) 면이 난이도 이름 종류별 그라데이션 3벌 — Easy `linear-gradient(to right bottom, rgb(76,162,205), rgb(103,178,111))` · Hard `linear-gradient(to left top, rgb(176,106,179), rgb(69,104,220))` · Extreme `linear-gradient(to left top, rgb(111,0,0), rgb(32,1,34))`. 숫자 값(3 ~ 15+)과 무관하게 이름 종류로만 바뀜. 흰 글자 대비(그라데이션 양끝) Easy 2.85 · 2.57, Hard 3.78 · 4.92, Extreme 12.53 · 19.29. 곡 그림 위에 겹침. 캡처 `cytoid-D7.png`
- 다른 기능: 프로필은 열지 않음, 미확인

#### 14. SNJ@KMZS (beatmania IIDX DP 비공식 난이도표)

- URL: https://zasa.sakura.ne.jp/dp/rank.php (「表示」 단추로 표를 불러옴, 조회만) · 확인 2026-11-22 · 해외
- 다크: 늘 다크. 본문 `rgb(34,34,34)`, 옆 막대 `rgb(51,51,51)` · 브랜드색 짙은 빨강 `rgb(153,0,0)`(머리 띠 · 표 머리), 링크 `rgb(204,0,0)`
- T1 난이도표 줄 머리(비공식 난이도 「5.9」 「6.0」 「6.5」 …): 무색 `rgb(238,238,238)` 13px, 줄 바탕이 `rgb(34,34,34)` / `rgb(68,68,68)` 번갈아 — 값 사다리 색 없음. 열 머리(1st · sub · 2nd … 버전)는 빨강 면 `rgb(153,0,0)` 흰 글자. 칸 안 곡 이름 글자색 = 채보 종류(HYPER `[H]` `rgb(238,238,136)` · ANOTHER `[A]` `rgb(238,136,136)`, LEGGENDARIA 는 고르기 칸에서 보라). 대비 줄 머리 13.71 · HYPER 13.05 · ANOTHER 6.45. 캡처 `zasa-T1.png`
- 다른 기능: 로그인 필요, 미확인

### 게임 전적 · 티어 리스트 · 체스 (`parts/gamestats.md`)

2026-11-22 실측. headless Playwright(Chromium, colorScheme dark, ko-KR, 1440×900, 권한 없음, 로그인 없음). 추천 · 판단 없음, 잰 사실만.
대비는 WCAG 2 상대 휘도, 투명도는 바로 밑 바탕과 섞어 잼. 캡처는 `caps/gamestats/<곳>-<기능>.png`.

#### 센 곳 (끝날 때 고침)

- 다크로 본 실제 서비스 23곳 — 국내 11(OP.GG · DEEPLOL · LOL.PS · YOUR.GG · 로아와 · 클로아 · 던담 · 일로아 · 던파기어 · fconline.gg · 로펙) · 해외 12(MetaTFT · Lichess · Chess.com · TETR.IO · U.GG · Blitz · Tracker.gg · Raider.IO · LoLalytics · OpenDota · Leetify · Exophase). 다크 방식: 시스템 다크를 따름 4(OP.GG · LOL.PS · 일로아 · Chess.com) · 사이트 기본 다크 · 늘 다크 16 · 단추로 전환해서 봄 3(던담 · 로펙 · 로아와 첫 창).
- 라이트만(꼴만 적고 다크 수에 넣지 않음) 4곳 — 국내 3(DAK.GG 묶음: 롤체지지 · 메이플지지 · 포로지지 · 이터널리턴 / FC온라인 데이터센터 / 서든어택 병영수첩) · 해외 1(HSReplay). 국내는 다크 11 + 라이트 3 = 14곳(목표 15에 1곳 모자람).
- 디자인 시스템: 이 묶음에서는 세지 않음(실제 서비스만). 공개 색 변수 · 색표를 읽은 곳 4: Blitz(`--rank-*` 10티어 면 · 글자 짝, `--tier1–5`) · 일로아(`--color-role-*`) · Leetify(`.cs-rating.--tier-0…6`) · Raider.IO(점수 색표 API 166단계).
- 기능별 본 곳(다크만):
    - P3 프로필 레이팅 · 티어 숫자: 11(국내 7 · 해외 4). 아이콘만 + 무색 글자 6(OP.GG · YOUR.GG · TETR.IO · U.GG · OpenDota · 로펙은 점수 한 색 + 엠블럼), 티어 이름 글자색 2(DEEPLOL · Blitz), 역할 색 1(일로아), 항목 고정색 1(로아와), 직업 색 그림 카드 위 흰 글자 1(클로아).
    - R2 랭킹 표 값: 16(국내 9 · 해외 7). 숫자 무색 또는 한 고정색 9(LOL.PS · 클로아 · 던담 · 던파기어 · 로펙 · Lichess · Chess.com · TETR.IO · OP.GG 4위부터), 1–3위만 금속색 · 메달 · 줄 면 4(OP.GG 그라데이션 · fconline.gg · 로아와 메달 · Tracker.gg), 티어 이름 글자색 1(U.GG), 값 구간 색 2(Raider.IO 연속 사다리 · Leetify 7구간 배지), 역할 색 2(로아와 · 일로아). 한 곳이 두 꼴에 걸치면(OP.GG · 로아와) 둘 다 셈.
    - D3 항목 상세 「내 점수」 색: 0(이 묶음에 같은 자리 없음).
    - D4 빈 값: 2(TETR.IO 회색 「?」 랭크 그림 · Blitz 「Unranked」 회색 글자).
    - D5 다음 티어 진행 막대: 3(DEEPLOL 지금 → 다음 티어 색 그라데이션 · Blitz 지금 티어 글자색 한 색 · 로펙 티어와 무관한 파랑 → 보라 그라데이션 30%). 막대 없음 확인 3(OP.GG · YOUR.GG · U.GG).
    - D7 항목 난이도 · 값 사다리: 2(클로아 장비 품질 0–100 면 배지, 3구간만 봄 · MetaTFT 덱 난이도 3단 알약).
    - P14 레벨별 표 줄 머리 색: 0.
    - T1 티어 리스트 구간 색: 9(국내 3 · 해외 6). 줄마다 배지 · 글자 5(OP.GG 방패 5색 · DEEPLOL 육각 5색 · LOL.PS 육각 + 줄 면 5색 · MetaTFT 글자 칸 + 왼쪽 테두리 5색 · U.GG 글자 6색), 구간 머리 칸 1(Blitz 5색), 무색 1(LoLalytics), 랭크 분포 막대 2(TETR.IO 18색 · Tracker.gg 9색). 라이트 HSReplay 는 구간 머리 칸 그라데이션 4색.
    - P16 업적 단계: 2(TETR.IO 육각 테 그림 절대 6단 + 순위 6단 · Exophase 트로피 그림 구리 · 은 · 금 · 플래티넘).
    - P17 업적 진행 막대: 1(Exophase 진행 중 초록 · 100% 노랑).
- 막힌 곳(세지 않음): DEEPLOL 랭킹 쪽(Internal Server Error, DEEPLOL 은 다른 쪽으로 셈) · 오버로그 overlog.gg(Cloudflare 「Attention Required」) · Lichess 프로필(확인 화면에서 멈춤, 리더보드로 셈) · Faceit(Cloudflare 사람 확인) · Mobalytics 티어 리스트(확인 화면) · Dotabuff(확인 화면) · STRATZ(토큰 한도 · Steam 로그인 벽) · Warcraft Logs(확인 화면) · 메이플스카우터(Cloudflare 사람 확인) · xdx.gg(확인 화면) · PSNProfiles(확인 화면).
- 기능 없어 세지 않음: 로아차트(미터기 · 계산기만) · 메랜지지(거래 사이트). 접속 안 됨: kart.gg · bser.gg · tmi.nexon.com · lolog.me(주소 없음 · 주차 도메인).
- 이미 잰 값 옮김(다시 재지 않음, 출처 리포 `docs/research/2026-11-20-color-chart.md`): OP.GG · DEEPLOL(티어 구간 11색 그래프) · LOL.PS · YOUR.GG · 일로아 · 클로아 · 던파기어 · Blitz · TETR.IO · Chess.com · OpenDota 는 곳마다 「앞선 기록」 줄. Mobalytics 는 이번에 막혀 새로 못 잼(앞선 기록: LP 선 #40c0de · 금 #f2bf43 · 이김 #18bd9b / 짐 #e54787).

#### 곳마다

##### 1. OP.GG (국내 · 다크)

- URL: https://op.gg/ko/lol/summoners/kr/Hide%20on%20bush-KR1 · https://op.gg/ko/lol/leaderboards/tier?region=kr · https://op.gg/ko/lol/champions · 2026-11-22
- 다크: 다크(`html.dark.opgg-kit-dark`, 시스템 다크를 따름). 쪽 바탕 html `rgb(28,28,31)` #1c1c1f, 상자 · 표 줄 `rgb(49,49,60)` #31313c, 표 머리 `rgb(40,40,48)`.
- 브랜드색: #5383e8(전적 갱신 버튼 · 위 검색 띠, 2026-11-20 차트 기록과 같음).
- 앞선 기록(다시 재지 않음): 티어 그래프 선 #fa576f · 승 #5383e8 / 패 #e84057 — 리포 `docs/research/2026-11-20-color-chart.md` 「2. OP.GG」.
- P3 프로필 티어 · LP: 꼴 = 아이콘만(티어 엠블럼 그림). 티어 이름 「마스터」 `#ffffff` 20px 700 → 12.84, 「606 LP」 `#9e9eb1` 12px → 4.88(상자 #31313c 대비). 최고 티어 「챌린저」 줄도 같은 흰색 · 회색, 옆에 「최고 티어」 파랑 알약 배지. 시즌별 표의 티어 이름도 `#9e9eb1` + 작은 엠블럼. 티어마다 글자색이 바뀌지 않음. 캡처 `opgg-P3.png`
- D5 티어 진행(LP) 막대: 없음(프로필에 LP 막대 없음, 숫자만).
- R2 랭킹 표: 티어 칸 글자 「챌린저」 `#9e9eb1` 12px(무색) → 4.88. LP 숫자: 1–3위 줄은 글자에 그라데이션 `linear-gradient(94deg, rgb(125,89,234) 0.83%, rgb(0,147,255) 79.97%)` + `bg-clip-text` 700(이 세 줄은 이름에도 같은 그라데이션 · 「OP」 표지가 있어 순위 때문인지 표지 때문인지 미확인), 4위부터 `#9e9eb1` 400. 위 요약 띠의 컷 「1,866 LP」 는 `#ffffff` 700 + 티어 엠블럼. 캡처 `opgg-R2.png`
- T1 챔피언 티어 리스트: 꼴 = 티어 칸의 방패 모양 면 배지(SVG 24×24, 흰 숫자). 5구간, 1→5 순서: 1 `#0093FF` 파랑 · 2 `#00BBA3` 청록 · 3 `#FFB900` 노랑 · 4 `#9AA4AF` 회색 · 5 `#A88A67` 갈색. 줄 바탕 #31313c 대비 4.05 · 5.28 · 7.46 · 5.08 · 3.97, 배지 위 흰 숫자 3.17 · 2.43 · 1.72 · 2.53 · 3.23. 구간 머리(제목 줄)는 없고 줄마다 배지. 캡처 `opgg-T1.png`
- D3 · D4 · D7 · P14 · P16 · P17: 해당 기능 없음.
- 같은 서비스 다른 게임(따로 세지 않음): 발로란트 랭킹 https://op.gg/ko/valorant/leaderboards — 위 띠가 브랜드 파랑 대신 발로란트 빨강 면, 표의 티어 칸은 엠블럼 + 「레디언트」 흰 글자(무색), 포인트 「1053」 무색. 캡처 `opgg-val-R2.png`

##### 2. DEEPLOL (국내 · 다크)

- URL: https://www.deeplol.gg/summoner/kr/Hide%20on%20bush-KR1 · https://www.deeplol.gg/champions · 2026-11-22
- 다크: 다크로 열림(`color-scheme: normal`, 사이트 기본 다크, 위 막대에 달 아이콘). body `rgb(25,25,25)` #191919, 상자 `rgb(38,38,38)` #262626.
- 브랜드색: 「전적 갱신」 #696fea(2026-11-20 차트 기록과 같음), 고른 탭 민트 `rgb(83,198,170)`.
- 앞선 기록(다시 재지 않음): 최근 30일 LP 선의 티어 구간 11색(아이언 `rgb(90,89,89)` … 마스터 `rgb(134,61,161)` · 그랜드마스터 `rgb(194,52,73)` · 챌린저 `rgb(238,122,0)`) — 리포 `docs/research/2026-11-20-color-chart.md` 「3. DEEPLOL」.
- P3 프로필 티어 · LP: 꼴 = 글자색(티어 색) + 엠블럼. 「Master」 `rgb(134,61,161)` #863da1 20px 700 → 2.30(상자 #262626 대비). 「681 LP」 `rgb(178,178,194)` #b2b2c2 12px → 7.24(무색). 티어 이름 글자색 = 앞선 기록의 LP 그래프 구간 색과 같은 값. 시즌 이력 배지(머리 위 「2025 Master」 등): 면 배지 = 옅은 티어 색 면 + 진한 티어 색 글자 — Master 면 `rgb(211,179,234)` · 글자 `rgb(141,65,169)` 3.30, Grandmaster 면 `rgb(235,180,196)` · 글자 `rgb(185,53,74)` 3.23, Diamond 는 하늘색 면(캡처, 값 미측정). 캡처 `deeplol-P3.png` · `deeplol-D5.png`
- D5 티어 진행(LP) 막대: 꼴 = 막대 + 양 끝 점. 트랙 `rgb(21,21,21)` #151515 246×8 둥글기 10px, 채움 `linear-gradient(90deg, rgb(141,65,169) 0%, rgb(194,52,73) 100%)`(지금 티어 Master 색 → 다음 티어 Grandmaster 색 그라데이션) 높이 5px 둥글기 0. 막대 위 지금 값 「681 LP」 `rgb(211,179,234)` #d3b3ea(지금 티어의 옅은 색) → 8.22, 아래 양 끝 「M | 0 LP」(Master 색 글자) · 「GM | 1371 LP」 `rgb(235,180,196)` #ebb4c4 → 8.55. 끝 점은 지금 티어 보라 체크 원 · 다음 티어 빨강 원. 채움 끝 대 트랙: Master 색 3.01 · Grandmaster 색 3.38. 캡처 `deeplol-D5.png`
- T1 챔피언 티어 리스트: 꼴 = 티어 칸의 육각 면 배지(SVG 그림 `/images/ico_tier_rank_N.svg`, 흰 숫자). 5구간, 1→5: 1 그라데이션 `#EF7F00`→`#FCCA7F` 주황 · 2 `#379DD2` 파랑 · 3 `#3ABDAB` 청록 · 4 `#838CA7` 회청 · 5 `#B19142` 황토(그 밖 `ico_tier_rank_0.svg` `#666666`, 화면에서 쓰임 미확인). 줄 바탕 #262626 대비 5.55(주황 끝) · 4.98 · 6.52 · 4.52 · 5.04, 흰 숫자 대비 2.73 · 3.04 · 2.32 · 3.35 · 3.00. 순위 변동 「▲2」 초록 `rgb(28,164,132)` · 「▼2」 빨강 `rgb(233,103,103)`. 캡처 `deeplol-T1.png`
- R2 랭킹 표: 막힘(https://www.deeplol.gg/ranking/kr/1 이 「Internal Server Error」, 캡처 `deeplol-R2.png`). 미확인.
- 같은 서비스 안 짝: 티어 이름 · LP 막대 · LP 그래프 = LoL 티어 색(11구간), 챔피언 티어 = 다른 5색 사다리(주황 · 파랑 · 청록 · 회청 · 황토).
- D3 · D4 · D7 · P14 · P16 · P17: 해당 기능 없음.

##### 3. LOL.PS (국내 · 다크)

- URL: https://lol.ps/statistics(라인별 챔피언 티어) · https://lol.ps/ranking?lane=-1&page=1&region=kr · 2026-11-22
- 다크: 다크(`html.dark`, 시스템 다크를 따름, 위 막대 해 아이콘 전환). body `rgb(16,19,28)` #10131c, 랭킹 표 줄 `rgb(23,27,47)` #171b2f.
- 브랜드색: #3254ce(고른 탭, `theme-blue`, 2026-11-20 차트 기록과 같음). 첫 쪽 멤버십 홍보 창은 「닫기」 로 닫고 봄.
- 앞선 기록(다시 재지 않음): 통계 선 그래프 5색 `#4379d3 · #00a777 · #ffc030 · #f47440 · #d72719` — 리포 `docs/research/2026-11-20-color-chart.md` 「4. LOL.PS」.
- T1 챔피언 티어 리스트: 꼴 = 줄 전체 옅은 면 + 챔피언 그림 위 작은 육각 면 배지(SVG 18×20, 흰 숫자). 5구간, 1→5: 1 `#EB5757` 빨강 · 2 `#F97C49` 주황 · 3 `#FAB519` 노랑 · 4 `#00B480` 초록 · 5 `#2793CF` 파랑. 줄 면은 같은 색 10%(`rgba(235,87,87,.1)` 등) → 섞은 색 #261a22 · #271e21 · #27231c · #0e2326 · #12202e, 쪽 바탕 대비 1.11 · 1.14 · 1.19 · 1.14 · 1.12. 배지 대 줄 면 4.81 · 6.19 · 8.70 · 6.09 · 4.84, 흰 숫자 대 배지 3.48 · 2.62 · 1.80 · 2.68 · 3.41. 구간 머리 줄은 없고 줄마다 색. 순위 변동 칩 ▲ `rgb(0,166,118)` · ▼ `rgb(227,70,70)` · 변동 없음 `rgb(130,139,149)`(각 20% 면). 캡처 `lolps-T1.png`
- R2 소환사 랭킹 표: 꼴 = 아이콘만(티어 엠블럼). LP 숫자 「2701 LP」 `rgb(218,223,231)` #dadfe7 16px 500(무색) → 12.71(줄 #171b2f 대비). 티어 이름 글자 없음. 캡처 `lolps-R2.png`
- 같은 서비스 안 짝: 챔피언 티어는 빨강→파랑 5색(1이 빨강), 통계 선 그래프 5색과 다른 값.
- P3 · D3 · D4 · D5 · D7 · P14 · P16 · P17: 이번에 보지 않음(소환사 프로필 쪽은 미확인).

##### 4. YOUR.GG (국내 · 다크)

- URL: https://your.gg/ko/kr/profile/Hide%20on%20bush-KR1 · 2026-11-22
- 다크: 다크로 열림(`color-scheme: normal`, 사이트 기본). body `rgb(36,37,38)` #242526.
- 브랜드색: #fd6505 주황(2026-11-20 차트 기록과 같음).
- 앞선 기록(다시 재지 않음): 시즌 LP 선 · 능력 오각형 = 브랜드 주황, 평균 회색 — 리포 `docs/research/2026-11-20-color-chart.md` 「5. YOUR.GG」.
- P3 프로필 티어 · LP: 꼴 = 아이콘만(엠블럼). 「Master」 `rgb(249,249,249)` 22px 700 → 14.58, 「681 LP」 `rgb(153,153,153)` 12px 500 → 5.39. 티어마다 글자색 바뀜 없음. LP 그래프 끝 값 글자 「Master」 「681 LP」 는 브랜드 주황 `rgb(253,101,5)` 11px 600(티어 색이 아니라 브랜드색). 캡처 `yourgg-P3.png`
- D5 LP 막대: 없음(막대 모양 요소는 승률 칩 `rgba(138,212,115,.14)` 면뿐).
- R2 · T1 · 그 밖: 이번에 보지 않음.

##### 5. 닥지지 DAK.GG · 롤체지지(lolchess.gg) · 메이플지지(maple.gg) · 포로지지(poro.gg) (국내 · 라이트만 — 꼴만, 다크 수에 넣지 않음)

- URL: https://lolchess.gg/meta · https://lolchess.gg/leaderboards?region=kr · https://dak.gg/er/leaderboard · 2026-11-22
- 다크: 라이트만. 롤체지지는 DAK.GG 로 합쳐져 위 막대 · 머리 그림만 어둡고 표 · 목록 면은 흰색(html `b-dakgg`, body `rgb(242,242,242)`, 표 `#ffffff` · `#f6f6f6`). 이터널 리턴 랭킹도 body `rgb(245,245,245)`. 다크 전환 단추 못 찾음.
- R2 랭킹 표(TFT): 꼴 = 아이콘만. 티어 이름 탭 글자 `#000000`, 「2008 LP」 `rgb(33,37,41)`(무색). 위 컷 띠의 「858 LP」 만 어두운 면 `rgb(34,34,34)` 위 흰 글자. 캡처 `lolchess-R2.png`
- R2 랭킹 표(이터널 리턴): 꼴 = 아이콘만. 티어 이름 「이터니티」 · 「미스릴」 `#000000`, RP 「8303 RP」 `#000000` 700(무색). 위 티어 안내 줄도 검은 글자 + 티어 그림. 캡처 `dakgg-er-R2.png`
- 메이플지지(maple.gg)도 DAK.GG 로 합쳐져 같은 꼴: https://maple.gg/ranks/total 랭킹 표 면 흰색(body `rgb(248,249,250)`), 라이트만. 캡처 `maplegg-R2.png`
- 포로지지(poro.gg)도 DAK.GG(라이트, body `rgb(245,245,245)`): 소환사 프로필 https://poro.gg/summoner/kr/Hide%20on%20bush-KR1 의 P3 꼴 = 티어 이름 글자색 「마스터」 `rgb(91,75,165)` 보라 16px 700(흰 면 위), 「681 LP」 검정 무색. 라이트라 다크 수에 넣지 않음. 캡처 `poro-P3.png`
- T1: 롤체지지 추천 메타 쪽은 덱 목록(티어 S · A 머리 없음), 챔피언 그림 테두리가 코스트 색. 캡처 `lolchess-T1.png`

##### 6. MetaTFT (해외 · 다크)

- URL: https://www.metatft.com/comps · 2026-11-22 (요청 목록의 국내 칸에 있었으나 영어 서비스라 해외로 셈)
- 다크: 다크로 열림(`color-scheme: normal`, 사이트 기본, 전환 못 찾음). body `rgb(29,30,32)` #1d1e20.
- 브랜드색: 로고 금색 육각 · 「Download Now!」 금색 글자(픽셀, 계산값 미측정), 「Download App」 빨강 버튼.
- T1 덱 티어 리스트: 꼴 = 글자 칸 면 배지(S · A · B · C · D, 18px, 글자 `#222222`) + 덱 카드 왼쪽 5px 색 테두리(같은 색). 5구간 S→D: S `rgb(255,126,131)` #ff7e83 · A `#ffbf7f` · B `#ffdf80` · C `#feff7f` · D `#bffe7f`(빨강→주황→노랑→연두, 티어 메이커식). 쪽 바탕 대비 6.80 · 10.34 · 12.80 · 15.75 · 14.06, 배지 위 `#222222` 글자 6.49 · 9.86 · 12.21 · 15.02 · 13.41. 구간 머리 줄은 없고 카드마다 배지 · 테두리. 캡처 `metatft-T1.png`
- D7 비슷한 자리(덱 난이도): 꼴 = 테두리 알약(1px 테두리 + 같은 색 12% 면 + 같은 색 글자), 3단 Easy `rgb(87,158,86)` 5.11 · Medium `rgb(185,98,60)` 3.87 · Hard `rgb(181,89,92)` 3.61(쪽 바탕 대비, 면 섞기 전). 티어 배지와 다른 색 묶음(초록 · 갈색 · 빨강).
- P3 · R2 · D5 · P16 · P17: 이번에 보지 않음.

##### 7. 로아와 LOAWA (국내 · 다크)

- URL: https://loawa.com/char/%EB%8B%A4%EB%AF%B8 · https://loawa.com/rank · 2026-11-22
- 다크: 다크(`html.dark`, 첫 방문 때 「화면 모드를 선택해 주세요」 창이 떠 「다크 모드」 를 눌러 닫음 — 테마 선택이라 동의 창 아님). body `oklch(0.1955 0.0043 264.5)` = #141517, 카드 `oklch(0.2393 0 0)` = #1f1f1f, 캐릭터 정보 상자 `rgb(21,24,29)` #15181d.
- 브랜드색: 로고 「LOAWA」 · 고른 메뉴 「순위」 · 「회원가입」 버튼 산호 분홍(픽셀, 계산값 미측정).
- P3 캐릭터 머리 레벨 숫자: 꼴 = 글자색, 값마다 고정색(구간에 따라 바뀌는지 미확인 — 클래스가 고정 `dark:text-orange-300` · `dark:text-red-400`). 「아이템 1795.83」 `oklch(0.837 0.128 66.29)` = #ffb86a 주황 14px 500 → 10.44, 「전투력 1,682.22」 `oklch(0.704 0.191 22.216)` = #ff6467 빨강 → 6.16, 명예 「1,373」 주황 같은 값, 라벨 `oklch(0.75 0 0)` = #aeaeae → 8.02(상자 #15181d 대비). 캡처 `loawa-P3.png`
- R2 아이템 레벨 랭킹: 꼴 = 순위 1–3 메달 아이콘(금 · 은 · 동 그림) + 전투력 숫자 역할 색. 아이템 레벨 「1805.00」 `#e8e8e8` 14px 500(무색) → 13.45. 전투력 숫자 13px 700: 딜러 `oklch(0.852 0.199 91.936)` = #fdc700 노랑, 서포터(바드 줄) `oklch(0.792 0.209 151.711)` = #05df72 초록(카드 대비 10.48 · 9.27) — 값 구간이 아니라 역할로 색이 갈림(캡처로 바드 줄 확인). 캐릭터 이름은 빨강 계열 글자(픽셀). 캡처 `loawa-R2.png`
- 같은 서비스 안 짝: 장비 이름은 게임 등급색(유물 주황 · 고대 노랑 등, 그림 · 글자), 각인 단계 칩은 숫자별 면(4 갈색 · 2 파랑 · 0 초록, 캡처).
- D5 · T1 · P16 · P17: 해당 기능 못 봄.

##### 8. 클로아 KLOA (국내 · 다크)

- URL: https://kloa.gg/characters/%ED%83%80%EB%A5%B4 · https://kloa.gg/ranking/combat-power · 2026-11-22
- 다크: 다크로 열림(위 막대 해 아이콘 전환, 2026-11-20 기록은 `html[data-theme=dark]`). html 바탕 `oklch(0.1904 0.0302 283.16)` = #121221, 카드 `oklch(0.2626 0.0261 284.46)` = #232331.
- 브랜드색: 「로그인」 #c9bbf7 연보라(2026-11-20 차트 기록과 같음), 로고 보라 그림.
- 앞선 기록(다시 재지 않음): 시세 캔들 상승 #ef5350 · 하락 #3182f6 — 리포 `docs/research/2026-11-20-color-chart.md` 「14. 클로아」.
- P3 캐릭터 머리: 꼴 = 직업별 색 그림 카드(이 캐릭터는 청록 그림) 위 흰 글자. 아이템 레벨 「1,805.00」 · 전투력 「12,638.07」 `#ffffff` 24px 600, 글자 그림자. 값 구간마다 색 바뀜 없음. 캡처 `kloa-P3.png`
- D7 비슷한 자리(장비 품질 0–100 값 사다리): 꼴 = 숫자 칸 면 배지(흰 숫자 12px). 이번 화면에서 본 3구간: 100 `rgb(235,167,12)` #eba70c 주황노랑 · 90–99(99 · 97 · 91) `oklch(0.5449 0.218 296.13)` = #8045dd 보라 · 84 `rgb(42,177,246)` #2ab1f6 하늘. 카드 대비 7.42 · 2.81 · 6.43, 흰 숫자 대 배지 2.09 · 5.51 · 2.41. 더 낮은 구간 색은 이 화면에 없어 미확인. 캡처 `kloa-P3.png`
- R2 전투력 랭킹: 꼴 = 숫자 글자색 한 색. 전투력 「12638.07」 `oklch(0.808 0.114 19.571)` = #ffa2a2 연빨강 14px 600 → 8.07(모든 줄 같은 색, 구간 없음), 아이템 레벨 「1805」 `oklch(1 0 0 / .87)` → 섞은 색 #e2e2e4 11.97. 캡처 `kloa-R2.png`
- 같은 서비스 안 짝: 품질 = 게임 품질 사다리 면 색, 전투력 = 고정 연빨강 글자, 각인 단계 칩 3 주황 `oklch(0.7468 0.1668 65.19)` · 2 자주 `oklch(0.6085 0.3027 313.15)` · 0 무색 면.
- D5 · T1 · P16 · P17: 해당 기능 못 봄.

##### 9. 던담 DUNDAM (국내 · 다크 전환)

- URL: https://dundam.xyz/ · 딜러 랭킹 https://dundam.xyz/damage_ranking?page=1&type=7&… · 2026-11-22
- 다크: 처음엔 라이트, 위 오른쪽 해 아이콘 단추로 다크(`html.dark`) 전환해서 봄. html `rgb(23,23,23)` #171717, 랭킹 카드 `rgb(39,40,41)` #272829, 첫 쪽 카드 `rgb(33,33,33)`.
- 브랜드색: 고른 필터 단추 「랭킹」 베이지 금색 면(픽셀), 로고 남색 D.
- R2 딜러 랭킹: 꼴 = 카드 격자(줄 표가 아님) + 숫자 글자 한 색 + 왕관 아이콘. 명성 값 「136585」 `rgb(193,172,149)` #c1ac95 14px → 6.75(카드 대비, 모든 카드 같은 색). 순위 숫자 「1」 `rgb(68,68,68)` 35px 700 기울임 → 1.52(카드와 거의 같은 회색, 1–3위도 같은 색). 서버 이름은 붉은 갈색 글자(픽셀). 캡처 `dundam-R2.png`
- 첫 쪽 「오늘의 등급」: 꼴 = 글자색, 「상급」 `rgb(250,194,19)` #fac213 30px 700 → 9.81(카드 #212121 대비). 다른 등급 이름의 색은 이날 화면에 없어 미확인.
- P3 · D5 · T1 · P16 · P17: 못 봄(캐릭터 검색은 이름 입력이 필요해 열지 않음).

##### 10. 일로아 ILOA.GG (국내 · 다크)

- URL: https://iloa.gg/ranks · https://iloa.gg/character/%EB%85%BC%EB%AC%B8%EC%9A%94%EC%A0%95 · 2026-11-22
- 다크: 다크(`html.dark`, 시스템 다크를 따름). body `rgb(15,17,20)` #0f1114, 랭킹 줄 번갈아 `rgb(22,24,29)` #16181d · `rgb(27,29,34)` #1b1d22.
- 브랜드색: 초록 #50ce97(2026-11-20 차트 기록과 같음).
- 앞선 기록(다시 재지 않음): 직업군 분포 막대 회색 한 색 — 리포 `docs/research/2026-11-20-color-chart.md` 「13. 일로아」.
- 공개 색 변수(:root 계산값): `--color-role-dealer: #ff716e` · `--color-role-hybrid: #ffa9a7` · `--color-role-support: #8fd850` · `--color-gold: oklch(85.2% .199 91.936)`(= #fdc700).
- P3 캐릭터 머리: 꼴 = 숫자 글자색(역할 색). 아이템 레벨 「1805.0」 `#f7f7f7` 20px 600(무색), 전투력 「10110.86」 `#8fd850` 서포터 초록 20px 600 → 바탕 #0f1114 대비 10.90. 값 구간이 아니라 역할(딜러 · 하이브리드 · 서포터)로 색이 갈림. 캡처 `iloa-P3.png`
- R2 전투력 랭킹: 꼴 = 숫자 글자색(역할 색). 아이템 레벨 「1805」 `#f7f7f7` 14px → 16.58, 전투력 「12,638.07」 딜러 `#ff716e` 12px → 6.63(줄 #16181d 대비). 캡처 `iloa-R2.png`
- 같은 서비스 안 짝: 캐릭터 쪽 각인 · 카드 레벨 「Lv.55」 은 `--color-gold` 글자 12px 500 → 10.72(줄 #1b1d22 대비).
- D5 · T1 · P16 · P17: 해당 기능 못 봄.

##### 11. 던파기어 DFGEAR (국내 · 늘 다크)

- URL: https://dfgear.xyz/lucky(태초 획득 랭킹) · 2026-11-22
- 다크: 늘 다크(`color-scheme: dark`, 전환 없음). body `rgb(13,13,28)` #0d0d1c.
- 브랜드색: #bb86fc 보라(로고, 2026-11-20 차트 기록과 같음).
- 앞선 기록(다시 재지 않음): 태초 서약 획득분포 원그래프 6색 단계(`#5ec273` … `#999999`) — 리포 `docs/research/2026-11-20-color-chart.md` 「15. 던파기어」.
- R2 획득 랭킹 표: 꼴 = 없음(무색). 다크 쪽 안에 표만 흰 면(TOAST UI Grid 기본, 칸 `#ffffff`, 글자 `rgb(51,51,51)` 13px → 12.63). 1–3위도 같은 색, 순위 · 개수에 색 없음. 캡처 `dfgear-R2.png`
- 그 밖 기능: 해당 없음.

##### 12. fconline.gg · VOLTA.gg (국내 · 다크)

- URL: https://fconline.gg/volta/rank(볼타 랭킹 TOP 20) · 2026-11-22
- 다크: 다크로 열림(`color-scheme: normal`, 사이트 기본, 전환 못 찾음). body `rgb(26,26,26)` #1a1a1a. 2026-11-20 차트 조사 때는 볼타 기록 쪽이 불러오기에서 멈췄으나 이번 랭킹 쪽은 열림.
- 브랜드색: 초록(「로그인」 · 고른 탭 「전체」 면, 로고 형광 초록, 픽셀).
- R2 볼타 랭킹 표: 꼴 = 1–3위만 메달 아이콘(금 · 은 · 동 그림) + 이름 글자 금속색, 4위부터 흰 이름. 1위 `rgb(245,197,66)` #f5c542 금 → 10.73 · 2위 `rgb(184,196,208)` #b8c4d0 은 → 9.82 · 3위 `rgb(212,149,106)` #d4956a 동 → 6.88(바탕 #1a1a1a 대비), 4위부터 `#ffffff`. 포인트 「3,248.68」 `rgb(224,224,224)` 12.8px → 13.18(모든 줄 같은 색, 점수 구간 색 없음). 전적 승 `rgb(83,131,232)` 파랑 · 무 `rgb(158,158,177)` · 패 `rgb(232,64,87)` 빨강(OP.GG 승패 값과 같음). 줄 구분선 `rgba(255,255,255,.05)` 1px. 캡처 `fcgg-R2.png`
- 그 밖 기능: 못 봄(전적은 닉네임 검색이 필요).

##### 13. 로펙 LOPEC (국내 · 다크 전환)

- URL: https://lopec.kr/character/specPoint/%EB%8B%A4%EB%AF%B8 · https://lopec.kr/character/specPoint/%ED%95%84%EB%A1%80 · https://lopec.kr/rank/specPoint · 2026-11-22
- 다크: 처음엔 `html.light-mode`(시스템 다크를 따르지 않음), 위 오른쪽 「다크모드 변환」 단추로 `html.dark-mode` 로 바꿔서 봄. 이전 안내 창(TransferNotice)은 닫기 단추로 닫음. body `rgb(15,20,26)` #0f141a, 카드 `rgb(21,24,29)` #15181d(랭킹 쪽 1–3위 상자에서 잰 값, 프로필 카드 대비는 이 값으로 계산 — 프로필 카드 계산값은 미확인), 랭킹 줄 `rgb(26,33,42)` · `rgb(30,42,54)`.
- 브랜드색: 로고 파랑 「lp」 · 검색 단추 하늘 면(픽셀, 계산값 미측정).
- P3 캐릭터 머리 「로펙 점수」: 꼴 = 큰 숫자 한 색 + 티어 칸(엠블럼 + 무색 이름). 점수 「4204.75」 · 「10044.49」 `rgb(133,177,255)` #85b1ff 26px 700 → 8.24(카드 #15181d 대비, 골드 · 에스더 두 캐릭터 모두 같은 색 — 점수 구간마다 바뀌지 않음). 티어 이름 「골드」 · 「에스더」 `rgb(237,241,247)` #edf1f7 18px 700 → 15.70 + 티어 엠블럼 그림(골드 금색 · 에스더 청록 그림). 레벨 「1,795.83」 무색. 캡처 `lopec-D5.png` · `lopec-P3.png`
- D5 다음 티어까지 진행 막대: 꼴 = 막대 안에 문구. 트랙 `rgb(49,90,127)` #315a7f 534×26 둥글기 6px(카드 대비 2.46), 채움 = 막대 요소 불투명도 .3 + `::before` `linear-gradient(90deg, rgb(37,99,235), rgb(139,92,246))`(파랑→보라, 1440px 폭 고정이라 채움 길이만큼 앞부분만 보임), 오른쪽 끝 둥글기 `0 50px 50px 0`, 폭 `width:33%`. 섞은 채움 색 #2d5d9f–#315ca0 → 트랙 대비 1.09–1.10. 막대 안 문구 「다이아 티어까지 795점 남았습니다.」 `#ffffff` 12px → 트랙 대비 7.24. 최고 티어(에스더)는 채움 100% · 문구 「최고티어에 도달했습니다.」. 채움 색은 지금 티어 · 다음 티어와 관계없이 같은 그라데이션(골드 캐릭터에서 확인, 다른 티어는 에스더만 봄). 캡처 `lopec-D5.png` · `lopec-P3.png`
- R2 전투력 랭킹: 꼴 = 점수 숫자 칩(면 + 글자) 한 색. 「10218.17」 `rgb(121,192,255)` #79c0ff 16px 700 on `rgb(33,69,98)` #214562 → 5.16(칩 대 줄 1.62), 모든 줄 같은 색(정렬 기준 칸 강조 클래스 `accentText`). 아이템 레벨 「1805.00」 `rgb(214,220,229)` 무색. 위 1–3위 카드 점수 `#ffffff` 16px 700. 캡처 `lopec-R2.png`
- T1 · P16 · P17: 못 봄.

##### 14. Lichess (해외 · 다크)

- URL: https://lichess.org/player · 2026-11-22
- 다크: 다크(`html.dark`, 사이트 기본). body `rgb(22,21,18)` #161512, 표 상자 `rgb(38,36,33)` #262421.
- 브랜드색: 미측정(로고 흰색 · 링크 파랑 계열).
- R2 리더보드(종목별 상위 10): 꼴 = 없음(레이팅 숫자 무색) + 칭호 글자만 한 색. 레이팅 「3359」 `rgb(186,186,186)` #bababa 14px → 7.98(잠정 레이팅 「3208?」 도 같은 색). 칭호 「GM」 · 「IM」 · 「FM」 `rgb(191,129,29)` #bf811d 14px 700 → 4.70, 칭호 등급과 관계없이 같은 색. 캡처 `lichess-R2.png`
- P3 프로필: 막힘(https://lichess.org/@/DrNykterstein 이 「잠시만 기다리십시오…」 확인 화면에서 15초 넘게 멈춤).

##### 15. Chess.com (해외 · 다크)

- URL: https://www.chess.com/leaderboard/live/rapid · 2026-11-22
- 다크: 다크(`html.dark-mode`, 시스템 다크를 따름). body `rgb(48,46,43)` #302e2b, 리더보드 상자 `rgba(0,0,0,.2)` → #262522, 짝수 줄 `rgba(255,255,255,.02)`.
- 브랜드색: 초록 #81b64c(2026-11-20 차트 기록과 같음).
- 앞선 기록(다시 재지 않음): 레이팅 변화 선 `--color-chart-line: #83DEFC` — 리포 `docs/research/2026-11-20-color-chart.md` 「Chess.com — 레이팅 통계」.
- R2 리더보드: 꼴 = 없음(레이팅 숫자 무색) + 칭호 면 배지 한 색. 레이팅 「2941」 `rgba(255,255,255,.72)` 14px 600 → 섞은 색 #c2c2c1 8.60. 칭호 「GM」 · 「FM」 면 `rgb(124,41,41)` #7c2929 + 흰 글자 10px 600 → 9.52(면 대 상자 1.61), 칭호 등급과 관계없이 같은 면. 캡처 `chesscom-R2.png`
- P3 프로필 레이팅: 이번에 보지 않음.

##### 16. TETR.IO · TETRA CHANNEL (해외 · 늘 다크)

- URL: https://ch.tetr.io/u/czsmall0402 · https://ch.tetr.io/lb/league · https://ch.tetr.io/league/ · 2026-11-22
- 다크: 늘 다크(전환 없음). body `rgb(15,22,13)` #0f160d, 카드 `rgb(22,33,19)` #162113. 쪽 전체가 초록 기운(글자 · 선도 초록 계열).
- 브랜드색: 쪽 갈래색 초록(리그 #a3d391 계열, 2026-11-20 차트 기록과 같음).
- 앞선 기록(다시 재지 않음): TR 변화 선 #a3d391 · 점 #ffa742 — 리포 `docs/research/2026-11-20-color-chart.md` 「TETR.IO」.
- P3 프로필 TR 숫자: 꼴 = 아이콘만(랭크 그림 `league-ranks/<랭크>.png`). 「24,535.03」 정수부 `rgb(226,252,222)` #e2fcde 900 → 15.24, 소수부 `.03` `rgb(156,202,149)` 28px, 단위 「TR」 · 「Glicko:」 `rgb(92,132,86)` #5c8456 → 3.88(카드 대비). 랭크마다 숫자 색 바뀜 없음. 불확실도 「±125.71」 만 `rgb(255,34,34)` 빨강(`highrd`). 「Probably around」 + 랭크 아이콘 칩 `rgb(10,15,9)` 면. 캡처 `tetrio-P3.png` · `tetrio-full.png`
- D4 비슷한 자리(이번 시즌 랭크 없음): 랭크 칸에 회색 「?」 그림(랭크 그림 대신), 숫자 TR 은 그대로 보임. 캡처 `tetrio-P3.png`
- R2 테트라 리그 리더보드: 꼴 = 아이콘만(TR 숫자 오른쪽 랭크 그림). 순위 · 이름 · TR 숫자 무색(초록 기운 흰 글자, 캡처). 이름 옆 국기 · 주황 별(서포터). 캡처 `tetrio-R2.png`
- T1 비슷한 자리(리그 상태 = 랭크 구간 분포 막대): 꼴 = 구간마다 다른 색 면 18칸 + 각 칸 위 랭크 글자 그림. 낮은 순 D → X+: D `rgb(144,117,145)` · D+ `rgb(142,96,145)` · C- `rgb(121,85,140)` · C `rgb(115,62,143)` · C+ `rgb(85,40,131)` · B- `rgb(86,80,199)` · B `rgb(79,100,201)` · B+ `rgb(79,153,192)` · A- `rgb(59,182,135)` · A `rgb(70,173,81)` · A+ `rgb(31,168,52)` · S- `rgb(178,151,43)` · S `rgb(224,167,27)` · S+ `rgb(216,175,14)` · SS `rgb(219,139,31)` · U `rgb(255,56,19)` · X `rgb(255,69,255)` · X+ `rgb(167,99,234)`(회보라 → 보라 → 파랑 → 하늘 → 청록 → 초록 → 황토 → 금 → 주황 → 빨강 → 자홍 → 보라). 쪽 바탕 대비 예: D 4.50 · C+ 1.77 · B- 2.95 · B+ 5.83 · A+ 5.88 · S+ 8.82 · SS 6.77 · U 5.11 · X 6.62 · X+ 4.92. 목표보다 낮거나 높은 칸 끝은 빗금 그림(`deflated.png` · `inflated.png`). 아래 「RANK BREAKDOWN」 표는 랭크 그림 + 무색 숫자. 캡처 `tetrio-T1.png`
- P16 업적: 꼴 = 육각 테 그림(`achievements/frames/<단계>.png`) — 계산값 없음, 그림 색(캡처로 봄). 절대 단계 6: issued(분홍 흰) · bronze(구리) · silver(회청) · gold(주황 금) · platinum(청록) · diamond(보라), 순위 단계 6: t100(갈빨강) · t50(회청) · t25(금) · t10(초록) · t5(파랑) · t3(빨강 · 자홍). 프로필 「ACHIEVEMENTS 361 AR」 줄에 단계마다 개수 + 테 그림을 낮은 순이 아니라 순위 단계 t3 → 절대 단계 issued 순으로 늘어놓음. 머리 사진 아래 대표 업적 3개는 큰 육각(diamond 테 = 보라). 못 얻은 단계 표시는 이 화면에 없음(미확인). 캡처 `tetrio-full.png`
- 같은 서비스 안 짝: 랭크 = 18색 사다리(분포 막대), 업적 = 금속 · 보석 테 그림, 모드 머리띠 = 모드별 색(40 LINES 주황 · BLITZ 빨강 · ZEN 자주 · 리그 초록), 레벨 태그 「4082」 보라 면(`lt_badge_color_8`).
- D5 · P17: XP 막대만 있음(268×3, `linear-gradient(to right, rgb(163,211,145) 0% 90%, rgb(10,15,9) 90% 100%)` — 초록 채움 · 거의 검정 트랙, 다음 레벨까지 90%). 랭크 진행 막대 · 업적 진행 막대 없음.

##### 17. U.GG (해외 · 늘 다크)

- URL: https://u.gg/lol/tier-list · https://u.gg/lol/profile/kr/hide%20on%20bush-kr1/overview · https://u.gg/lol/leaderboards/ranking?region=kr · 2026-11-22
- 다크: 늘 다크(전환 못 찾음). body `rgb(7,7,32)` #070720, 표 줄 `rgb(17,17,42)` #11112a · `rgb(25,25,55)` #191937, 시즌 태그 칸 `rgb(37,37,75)`.
- 브랜드색: 파랑 「Log In」 버튼 면(픽셀) — 티어 S 글자 `rgb(50,115,250)` 와 같은 계열(값 같음은 미확인).
- T1 챔피언 티어 리스트: 꼴 = 티어 칸 글자색(굵은 13px 700). 6구간 S+ → D: S+ `rgb(255,155,0)` #ff9b00 주황 8.74 · S `rgb(50,115,250)` #3273fa 파랑 4.37 · A `rgb(126,164,244)` #7ea4f4 연파랑 7.48 · B `#ffffff` 18.46 · C `rgb(252,177,178)` #fcb1b2 연분홍 10.61 · D `rgb(255,78,80)` #ff4e50 빨강 5.68(줄 #11112a 대비). 위 상위 3 카드는 같은 색 1px 테두리 + 옅은 면 알약(S+ 면 `rgb(40,30,38)`). 구간 머리 줄은 없고 줄마다 글자. 캡처 `ugg-T1.png`
- P3 프로필 랭크: 꼴 = 아이콘(엠블럼) + 무색 큰 글자. 「Master」 `#ffffff` 18px 700 → 17.00, 「681 LP」 `rgb(205,220,254)` #cddcfe 12px → 12.35(카드 #191937 대비). 지난 시즌 태그만 티어 글자색 10px 500: Master `rgb(164,88,78)` 2.83 · Grandmaster `rgb(205,69,69)` 3.14 · Challenger `rgb(244,200,116)` 9.25(태그 칸 대비). LP 진행 막대 없음. 캡처 `ugg-P3.png`
- R2 리더보드: 꼴 = 티어 이름 글자색 + LP 무색. 「Challenger」 `rgb(244,200,116)` #f4c874 굵게 → 11.75(줄 #11112a 대비, 프로필 시즌 태그의 Challenger 와 같은 값), 「2,701 LP」 `#cddcfe` → 13.42. 캡처 `ugg-R2.png`
- 같은 서비스 안 짝: LoL 티어(Master · GM · Challenger) 글자색 = 갈빨강 · 빨강 · 금, 챔피언 티어 = 다른 6색 사다리(S+ 주황 · S 파랑 …).
- D5 · D7 · P16 · P17: 해당 없음.

##### 18. Blitz (해외 · 늘 다크)

- URL: https://blitz.gg/lol/tierlist · https://blitz.gg/lol/profile/kr/Hide%20on%20bush-KR1 · 2026-11-22
- 다크: 늘 다크(전환 못 찾음). body `rgb(14,16,21)` #0e1015, 카드 `rgb(21,24,30)` #15181e.
- 브랜드색: 금색 강조 `--gold: oklch(87% .14 73.52)`(「Go Ad-Free」), 「Download Blitz」 분홍빨강 면(2026-11-20 차트 기록과 같음).
- 앞선 기록(다시 재지 않음): LP 변화 점선 그래프 점 #f4c874 — 리포 `docs/research/2026-11-20-color-chart.md` 「Blitz」.
- 공개 색 변수(:root 계산값): 랭크 면 · 글자 짝 — iron `#817678`/`#a29294` · bronze `#9f6347`/`#b97452` · silver `#80989d`/`#a2c1c7` · gold `#cd8837`/`#f1a64e` · platinum `#1c91b6`/`#14c0f5` · emerald `#519847`/`#56d744` · diamond `#8141eb`/`#9556ff` · master `#9d48e0`/`#a952e5` · grandmaster `#d94444`/`#ef4f4f` · challenger `#f4c874`/`#f4c874`, 비어 있음 `--rank-none`. 글자 짝 대비(카드 #15181e): 5.99 · 4.81 · 9.30 · 8.72 · 8.37 · 9.48 · 4.28 · 4.25 · 5.00 · 11.31. 챔피언 티어 `--tier1: #f4af25` · `--tier2: #30d9d3` · `--tier3: #9dd5d7` · `--tier4: #c0d4d8` · `--tier5: #585c65` · `--tierNone: #34363d`.
- P3 프로필 랭크: 꼴 = 티어 이름 글자색(`color: var(--rank-master-text)`) + 엠블럼. 「Master」 `rgb(169,82,229)` #a952e5 14px 600 → 4.25, 「606 LP」 `rgb(137,141,148)` #898d94 12px 600(무색) → 5.33. 캡처 `blitz-D5.png`
- D5 랭크 진행(LP) 막대: 꼴 = 막대, 채움 = 지금 티어 글자색. 트랙 `rgb(24,26,32)` #181a20 192×8 둥글기 5px(카드 대비 1.02), 채움 `::before` 면 `--bar-color: var(--rank-master-text)` = #a952e5(트랙 대비 4.16), 길이 `--bar-fill: 6.06`(606 LP ÷ 100, 마스터는 100 넘어 가득 참). 막대 아래 「54.7% WR · 448W - 371L」 무색 회색. 캡처 `blitz-D5.png`
- D4 비슷한 자리(자유 랭크 기록 없음): 「Ranked Flex」 줄 오른쪽에 「Unranked」 회색 글자, 막대 · 엠블럼 없음(캡처, 계산값 미측정). 캡처 `blitz-D5.png`
- T1 챔피언 티어 리스트: 꼴 = 구간마다 왼쪽 머리 칸(티어 방패 아이콘 + 색 면) + 오른쪽 챔피언 묶음 칸(같은 색 8% 면, 둥글기 16px). 5구간 1 → 5: `--tier1` #f4af25 금 · `--tier2` #30d9d3 청록 · `--tier3` #9dd5d7 옅은 청록 · `--tier4` #c0d4d8 회청 · `--tier5` #585c65 회색. 머리 칸 면 = `::before` 티어색 불투명도 .5 + 위쪽 흰 빛 `radial-gradient(circle at 50% 0%, rgba(235,236,240,.5), transparent 160px)` → 섞은 색 #81601d · #1f7574 · #567376 · #677277 · #33363d(쪽 바탕 대비 3.28 · 3.49 · 3.72 · 3.85 · 1.57). 묶음 칸 8% 면 → #201d16 · #112024 · #192025 · #1c2025 · #14161b(대비 1.13–1.16, 5구간 1.05). 챔피언 그림 테두리도 구간 색(캡처). 캡처 `blitz-T1.png`
- 같은 서비스 안 짝: LoL 랭크 = 면 · 글자 두 벌 10색, 챔피언 티어 = 금 → 회색 5단(랭크 색과 다른 묶음).
- R2 · D7 · P16 · P17: 이번에 보지 않음.

##### 19. Tracker.gg — 발로란트 (해외 · 늘 다크)

- URL: https://tracker.gg/valorant/leaderboards/ranked/all/default?platform=pc&region=ap · 2026-11-22
- 다크: 늘 다크(전환 못 찾음, html · body 계산값은 투명, 4위부터 줄 `rgb(27,39,51)` #1b2733).
- 브랜드색: 빨강(「TRN」 로고 · 「Sign In」 · 필터 단추 면, 픽셀).
- R2 리더보드: 꼴 = 1–3위만 줄 면 색 + 순위 육각 그림(1위 금 테), 4위부터 같은 남색 줄. 1위 줄 `color(srgb .169 .191 .176)` = rgb(43,49,45) 올리브 · 2위 rgb(36,48,60) 푸른 · 3위 rgb(38,36,40) 갈보라, 4위부터 `rgb(27,39,51)`. 레이팅 「1,169」 · 티어 이름 「Radiant」 흰 글자 + 랭크 엠블럼(무색, 캡처), 24시간 변동 ▲ 초록 · ▼ 빨강. 캡처 `trackergg-R2.png`
- T1 비슷한 자리(랭크 분포 막대 그래프): 꼴 = 랭크마다 다른 색 막대(같은 랭크의 1 · 2 · 3 단계는 같은 색). 9구간 낮은 순: Iron `rgb(79,81,79)` 회색 · Bronze `rgb(165,133,93)` 갈색 · Silver `rgb(187,194,194)` 은회 · Gold `rgb(236,207,86)` 노랑 · Platinum `rgb(89,169,182)` 청록 · Diamond `rgb(180,137,196)` 연보라 · Ascendant `rgb(106,226,175)` 민트 · Immortal `rgb(187,61,101)` 자주빨강 · Radiant `rgb(255,255,170)` 연노랑. 남색 #1b2733 대비 1.89 · 4.41 · 8.38 · 9.84 · 5.62 · 5.28 · 9.47 · 2.87 · 14.54. 캡처 `trackergg-R2.png`
- P3 · D5: 프로필은 이번에 보지 않음.

##### 20. Raider.IO — 월드 오브 워크래프트 쐐기 점수 (해외 · 늘 다크)

- URL: https://raider.io/mythic-plus-character-rankings/season-tww-3/world/all/all · 공개 색표 https://raider.io/api/v1/mythic-plus/score-tiers · 2026-11-22
- 다크: 늘 다크(전환 못 찾음). body · html `rgb(17,17,17)` #111111. 개인정보 동의 창은 「DISAGREE」, 쿠키 띠는 「Reject」 로 닫고 봄.
- 브랜드색: 주황 톱니 로고 · 「Sign Up」 파랑 면(픽셀, 계산값 미측정).
- R2 점수 색(「Mythic+ Score」, 캐릭터 프로필 P3 는 이번에 열지 않아 미확인): 꼴 = 숫자 글자색, 값 사다리를 따라 거의 연속으로 바뀜. 공식 색표(API 공개, 166단계, 점수 문턱마다 rgbHex): 4325 이상 `#ff8000` 주황 → 4000 `#ee656b` → 3715 `#d14baf` 분홍 → 3410 `#9d3ced` 보라 → 3290 `#7c55e7` → 3120 `#396bdf` 파랑 → 2800 `#5597b3` → 2510 `#5dc87c` → 2225 `#2cfb1f` 초록 → 1925 `#62ff46` → 1325 `#a8ff8d` → 725 `#daffcb` → 200 `#ffffff` 흰색(낮을수록 흰색에 가까워짐). 문턱 간격 대개 20–30점. 바탕 #111111 대비 예: #ff8000 7.50 · #d14baf 4.80 · #7c55e7 3.88 · #396bdf 3.90 · #5597b3 5.81 · #35f62e(2245 단계) 12.92 · #ffffff 18.88.
- R2 랭킹 표에서 확인: 「4406.6」 ~ 「4329.2」 `rgb(255,128,0)` 17.6px 700, 「4319.8」 부터 `rgb(254,126,18)`(색표 4265 단계 `#fe7e16` 근처 값 — 화면 값과 색표 값이 조금 다름, 화면 계산값 그대로 적음). 순위 숫자도 주황 글자(캡처). 캡처 `raiderio-R2.png`
- 같은 서비스 안 짝: 쐐기 던전별 단계 칩(「24 ARAK」 등)은 회색 · 금 테두리 그림(캡처).
- D5 · T1 · P16 · P17: 이번에 보지 않음.

##### 21. LoLalytics (해외 · 늘 다크)

- URL: https://lolalytics.com/lol/tierlist/ · 2026-11-22
- 다크: 늘 다크(전환 못 찾음). html `rgb(0,0,0)`, 표 줄은 어두운 회색 면(캡처, 계산값 미측정).
- 브랜드색: 로고 금색(그림).
- T1 챔피언 티어 리스트: 꼴 = 없음(무색). 티어 칸 「S+ · S · S- · A+ · A · A- · B+ · B …」 모두 `rgb(204,204,204)` #cccccc(html #000000 대비 13.08), 15단계 글자가 같은 색. 구간 머리 줄 없음. 승률 숫자만 초록 글자(캡처). 오른쪽 「Elo」 칸은 LoL 랭크 엠블럼 그림 + 「GM」 흰 글자. 캡처 `lolalytics-T1.png`
- 그 밖 기능: 이번에 보지 않음.

##### 22. OpenDota (해외 · 늘 다크)

- URL: https://www.opendota.com/players/86745912 · 2026-11-22
- 다크: 늘 다크. 머리 띠 짙은 청록 남색, 본문 남색(캡처, html · body 계산값 투명).
- 브랜드색: MUI 다크 기본 #90caf9(2026-11-20 차트 기록과 같음).
- 앞선 기록(다시 재지 않음): 히스토그램 막대 5색 — 리포 `docs/research/2026-11-20-color-chart.md` 「OpenDota」.
- P3 프로필 랭크: 꼴 = 아이콘만(Dota 메달 그림, 순위 「69」 `rgb(236,217,200)` 글자가 그림 위). 승률 「55%」 `rgba(255,255,255,.87)` 무색. 평균 칸 숫자는 항목별 고정색(킬 `rgb(102,187,106)` 초록 · 데스 `rgb(255,76,76)` 빨강 · 어시스트 `rgb(127,147,252)` 파랑 · 분당 골드 `rgb(201,175,29)` 금) — 값 구간이 아니라 항목 종류로 갈림. 캡처 `opendota-P3.png`
- 그 밖 기능: 이번에 보지 않음.

##### 23. Leetify — CS2 (해외 · 늘 다크)

- URL: https://leetify.com/public/premier-leaderboards/valve · 2026-11-22
- 다크: 늘 다크(전환 못 찾음). body `rgb(25,23,30)` #19171e, 표 줄 `rgb(32,30,37)` #201e25.
- 브랜드색: 분홍 「Sign Up」 면 · 로고 분홍(픽셀).
- R2 Valve 프리미어 리더보드: 꼴 = 레이팅 숫자를 감싼 면 배지(기울어진 빗금 2개 + 테두리 상자, 기울임 숫자) — 레이팅 구간마다 배지 색이 바뀜(CS2 프리미어 등급색). 스타일시트 7구간 `.cs-rating.--tier-0…6`: 빗금 fill / 상자 면 / 테두리(60%) / 글자 — 0 `rgb(177,196,217)` / `rgb(44,47,55)` / 같은 색 .6 / `rgb(238,242,247)` 회청 · 1 `rgb(94,152,217)` / `rgb(6,28,54)` / `rgb(139,193,255)` 하늘 · 2 `rgb(76,106,255)` / `rgb(6,14,55)` / `rgb(138,157,254)` 파랑 · 3 `rgb(136,71,255)` / `rgb(24,6,56)` / `rgb(180,139,255)` 보라 · 4 `rgb(211,44,230)` / `rgb(50,6,56)` / `rgb(241,119,255)` 자홍 · 5 `rgb(235,75,75)` / `rgb(56,6,6)` / `rgb(255,134,134)` 빨강 · 6 `gold` / `rgb(56,48,6)` / `rgb(255,223,53)` 금. 글자 대 상자 면 11.91 · 9.10 · 7.40 · 7.20 · 7.24 · 7.53 · 9.95. 이번 화면 상위 줄은 모두 6구간(금, 「38,065」 등). 이름 · 승수 · 승률 무색, 지역 「EU · AS · AF · NA」 글자만 지역별 색. 캡처 `leetify-R2.png`
- 그 밖 기능: 이번에 보지 않음(업적 쪽은 로그인 필요로 보임, 미확인).

##### 24. Exophase — 게임 업적 · 트로피 기록 (해외 · 다크)

- URL: https://www.exophase.com/user/Roughdawg4/ · 2026-11-22
- 다크: 다크(`color-scheme: dark`, 사이트 기본). body `rgb(34,34,34)` #222222, 게임 카드 남회색 면(캡처, 계산값 미측정).
- 브랜드색: 로고 하늘 「exo」 · 「LOG IN」 파랑 면(픽셀), 프로필 레벨 막대 `rgb(0,162,210)` #00a2d2.
- P16 업적(트로피) 단계: 꼴 = 아이콘 그림(`exo-icon-trophy-bronze · silver · gold · platinum`, 스프라이트 그림이라 계산값 없음) + 개수 흰 글자. 4단계 구리 · 은 · 금 · 플래티넘(파랑 기운), 게임 줄마다 「🏆 11 🏆 3」 꼴로 단계별 개수. 얻은 업적 그림은 아래 줄에 썸네일로 늘어놓음(못 얻은 것 표시는 이 화면에 없음, 미확인). 다 얻은 게임은 게임 그림에 노란 테두리 + 노란 별 원 표지(캡처). 캡처 `exophase-P16.png`
- P17 업적 진행 막대(게임별 달성률): 꼴 = 막대, 채움은 완료 여부로 두 색. 트랙 `rgb(41,43,46)` #292b2e 199×8 둥글기 6px, 진행 중 채움 `rgb(93,194,30)` #5dc21e 초록 → 트랙 대비 6.22, 100% 채움 `rgb(255,225,30)` #ffe11e 노랑 → 10.84. 단계(구리 · 은 · 금) 색을 쓰지 않음. 막대 위 「14/37」 흰 글자. 프로필 머리 전체 달성률 막대는 하늘 `#00a2d2` 80×8(트랙 같은 값) → 4.80. 캡처 `exophase-P16.png`
- 그 밖 기능: 해당 없음.

##### 25. HSReplay.net — 하스스톤 (해외 · 라이트만 — 꼴만, 다크 수에 넣지 않음)

- URL: https://hsreplay.net/meta/ · 2026-11-22
- 다크: 라이트만(body `rgb(251,247,246)`, 왼쪽 메뉴 · 위 막대만 남색). 다크 전환 못 찾음.
- T1 메타 티어 리스트: 꼴 = 구간 머리 칸(표 왼쪽 세로 띠, 구간 안 줄을 묶음) 세로 그라데이션 면 + 흰 큰 글자. 4구간 A → D: A `linear-gradient(rgb(107,160,54), rgb(88,121,55))` 초록 · B `(rgb(146,160,54), rgb(104,121,55))` 올리브 · C `(rgb(160,124,54), rgb(121,95,55))` 황토 · D `(rgb(160,72,54), rgb(121,66,55))` 붉은 갈색(초록 → 빨강 사다리). 승률 숫자는 초록 글자. 캡처 `hsreplay-T1.png`

##### 26. FC온라인 데이터센터(공식) (국내 · 라이트만 — 꼴만)

- URL: https://fconline.nexon.com/datacenter/rank · 2026-11-22
- 다크: 라이트만(흰 면, 하늘색 머리 띠). 랭킹 표 자리는 첫 화면에서 검색 · 필터만 보여 표 색은 미확인. 캡처 `fcdc-R2.png`

##### 27. 서든어택 병영수첩(공식) (국내 · 라이트만 — 꼴만)

- URL: https://barracks.sa.nexon.com/ · 2026-11-22
- 다크: 머리 그림 영역만 어둡고 랭커 표 면은 흰색 · 옅은 회색 줄(라이트).
- R2 랭크전 랭커 · 공식클랜 랭커: 꼴 = 1–3위 순위 방패 그림(금 · 은 · 동 면에 숫자), 4위부터 숫자. RP 「4,902」 · 시즌점수 검정 굵은 글자(무색), 계급 그림 + 이름. 캡처 `sa-home.png`

### 업적 단계 · 회원 등급 (`parts/achieve.md`)

센 곳(2026-11-22 끝): 다크로 본 실제 서비스 16곳(국내 3 · 해외 13), 라이트만 3곳(국내 2 · 해외 1, 꼴만). 목표 다크 20곳 · 국내 12곳에 못 미침(근거 약함, 특히 국내 다크 3곳).

- 국내 다크: 당근 · 로스트아크 전투정보실 · KLOA. 국내 라이트만: 올리브영 · 뽐뿌.
- 해외 다크: Steam · GitHub · Exophase · Discourse Meta · Game Jolt · Quaver · Kongregate · Chess.com · SEELIE.me · Codewars · Cytoid · Genshin Center · Paimon.moe. 해외 라이트만: Stack Overflow.

기능별 본 곳(다크 / 라이트만):

- P16 업적 단계 색 · 못 얻은 것: 다크 11(Steam · GitHub · Exophase · Discourse · Game Jolt · Quaver · Kongregate · Chess.com · Cytoid · Genshin Center · Paimon.moe) / 라이트 2(Stack Overflow · 올리브영 등급 단추). SEELIE 는 단계 화면 미확인.
    - 단계 꼴: 금속 3단 동 · 은 · 금(GitHub 칩 면 · Discourse 아이콘 · Stack Overflow 점) 3곳, 금속 4단 동 · 은 · 금 · 백금(Exophase 아이콘 · Game Jolt 그림) 2곳, 금속 3 + 유채 3 의 6단(Quaver 틀) 1곳, 단계 색 없음(그림 고유색 · 글자 · 숫자: Steam 배지 · Kongregate · Chess.com 업적 · Cytoid · Genshin Center · Paimon.moe) 6곳.
    - 못 얻은 것: 흑백 그림(Steam) · 따로 만든 회색 그림(Quaver) · 물음표 그림 + 설명 숨김(Game Jolt) · 다음 단계 줄 opacity 0.5 / 0.25(Genshin Center · Paimon.moe) · 빈 체크칸(Genshin Center · Paimon.moe) · 딴 것만 보여 줌(GitHub · Discourse 사용자 · Kongregate · Cytoid · Chess.com).
- P17 진행 막대: 다크 4(Steam 레벨 XP 회색 · 로스트아크 노랑 한 색 · KLOA 브랜드 보라 카드 채움 · SEELIE 브랜드 보라 알약). 넷 모두 단계 색이 아닌 한 색(회색 · 노랑 · 브랜드색). 근거 약함.
- P3 회원 · 활동 등급 색(숫자 · 칩): 다크 5(당근 매너온도 10단 글자색 · Steam 레벨 10단위 테두리 원 · Codewars kyu 묶음 육각 테두리 · Cytoid 레벨 칩 한 색 · 로스트아크 아이템 레벨 분홍 글자, 구간 여부 미확인) / 라이트 2(올리브영 등급 면 · 뽐뿌 레벨 그림).
- 이 묶음에서 R2 · D3 · D4 · D5 · D7 · P14 · T1 은 보지 않음(다른 묶음).

막힘 · 세지 않음:

- Cloudflare 「잠시만 기다리십시오…」: PSNProfiles(사용자 · 트로피) · TrueAchievements · RetroAchievements(사용자 · 게임) · Exophase 리더보드 · solved.ac.
- 403 · 404: 오늘의집 멤버십(Access Denied) · 지식iN 명예의전당 등급 · 순위(404) · Strava 사용자(404) · MetaGamerScore 사용자(404).
- 로그인 벽: 무신사 등급 혜택 · 펌프잇업 펌빌리티 랭킹 · Reddit 사용자 트로피 · Xbox(play.xbox.com) · Habitica.
- 팝업: loawa.com(화면 모드 고르기 창이 가림, 누르지 않음).
- 기능 못 찾음: Duolingo 한국어(첫 화면만, 공개 프로필 없음) · Trackmania.io(불러오는 중 막대만) · stardb.gg(희귀도 줄 채움만, 진행 막대 아님) · FFXIV Collect(비로그인 진행 없음) · OKKY · 루리웹 · 인벤 · 에펨코리아(라이트, 레벨 아이콘 · 활동 점수 색을 화면에서 못 잡음) · V-Archive(라이트 첫 화면만) · 치지직 · SOOP · velog(공개 등급 화면 없음).
- 지시로 뺌: Kaggle · osu!(다른 묶음).

방법: `../METHOD.md`. headless Playwright 1.61.1 Chromium · `colorScheme: 'dark'` · `locale: 'ko-KR'` · 1440×900 · 권한 없음 · 로그인 없음. 대비는 WCAG 2(투명도는 바탕과 섞어 잼). 값은 `getComputedStyle` 계산값. 스크립트 · 원자료: `/private/tmp/claude-501/b-grade-achieve/`(run.js · out/*.json).

#### 곳마다

##### 당근 (daangn.com 중고거래 글 판매자 매너온도)

- URL: https://www.daangn.com/kr/buy-sell/ 의 글 8개(예 `.../buy-sell/스피리테일-...-fhkeig2ptgvo/`) · 확인 2026-11-22 · 국내 · 다크(시스템 따라감) · 쪽 바탕 rgb(0,0,0), 글 상세 패널 rgb(22,23,27) · 브랜드색 주황(로고 · 「앱에서 보기」 단추)
- P3(회원 활동 수치에 구간 색): 글자색만. 판매자 이름 줄 오른쪽 끝 숫자 「63.6°C」(span 80×24, class `seed-manner-temp seed-manner-temp--level_lN`) 글자색이 구간마다 바뀜 + 오른쪽에 구간별 얼굴 그림 22×22. 면 · 테두리 · 막대 없음(웹 글 화면에서 막대 요소 없음 확인). 아래 「매너온도」 밑줄 링크 rgb(176,179,186) 8.53:1.
    - 본 값(8개 글): 36.8 → l4 rgb(251,190,85) #fbbe55 10.74:1 · 37.2 → l5 #faac4b 9.44:1 · 42.4 · 42.7 → l6 #fc9855 8.33:1 · 49 · 50.3 · 53.9 → l7 #f97a25 6.69:1 · 63.6 → l8 #fe6a34 6.25:1 (대비 바탕 rgb(22,23,27)).
    - SEED 3.4.0(`@seed-design/css` all.css) `--seed-color-manner-temp-l1…l10-text` 다크(`data-seed-color-mode="dark-only"`) 값과 화면 값이 모두 같음: l1 #b8b8b9 · l2 #f5db97 · l3 #fdda65 · l4 #fbbe55 · l5 #faac4b · l6 #fc9855 · l7 #f97a25 · l8 #fe6a34 · l9 #fe6a5d · l10 #fb6f82. 라이트: #757b85 · #ab863f · #e08a00 · #f57e00 · #ff7300 · #f60 · #ff5100 · #f30 · #e82c45 · #cb0123. 같은 단계의 `-bg`(배지 면용) 다크: #292929 · #332605 · #372b01 · #372301 · #371f01 · #351b03 · #371701 · #380f00 · #380500 · #34040a(웹 글 화면에서는 면을 쓰지 않음, `seed-manner-temp-badge` 클래스는 CSS 에만 있음).
    - 구간 순서: 낮음 회색(l1) → 노랑 → 주황 → 빨강 → 분홍빨강(l10), 10단. 구간 경계 온도는 미확인(본 값으로 36.8=l4, 37.2=l5, 42.x=l6, 49–53.9=l7, 63.6=l8).
    - 쓰인 상황: 평소(남의 글). 빈 값 · 내 것 미확인.
    - 캡처: `caps/achieve/daangn-3.png`(63.6 l8) · `daangn-detail.png`(37.2 l5) · `daangn-1.png`…`daangn-8.png`
- P16 · P17: 해당 기능 없음(웹 공개 화면).

##### Steam (커뮤니티 공개 프로필 · 배지 · 게임 도전 과제)

- URL: https://steamcommunity.com/id/robinwalker/ · `/badges/` · `/achievements/620`(Portal 2) · 확인 2026-11-22 · 해외 · 늘 다크 · 배지 쪽 바탕 rgb(27,40,56), 레벨 상자 rgb(29,30,32) · 브랜드색 파랑(머리 「커뮤니티」 고른 메뉴 · 「상점 페이지」 단추), 설치 단추 초록
- P3(회원 레벨 숫자): 테두리 원. 레벨 숫자 #e5e5e5(바탕과 상관없이 같음) 둘레 원 테두리 2px 둥글기 16(28×28)의 색이 10단위 구간마다 바뀜. 공개 CSS `shared_global.css` `.friendPlayerLevel.lvl_N { border-color }` 전부: lvl_0 #9b9b9b 6.0:1 · lvl_10 #c02942 2.89 · lvl_20 #d95b43 4.39 · lvl_30 #fecc23 11.02 · lvl_40 #467a3c 3.26 · lvl_50 #4e8ddb 4.89 · lvl_60 #7652c9 3.04 · lvl_70 #c252c9 4.25 · lvl_80 #542437 1.34 · lvl_90 #997c52 4.26(대비 바탕 rgb(29,30,32)). 100 이상은 테두리 대신 100 단위마다 그림(`levels_hexagons.png` 100 · `levels_shields.png` 200 · books 300 … 5000 까지 이어짐) 위 10 단위 위치(`lvl_plus_N`) 바꿈. 화면 본 값: robinwalker Level 32 테두리 rgb(254,204,35) = lvl_30. 친구 목록의 203 · 160 · 146 등은 그림 방패 · 육각.
    - 구간 순서: 회색 → 빨강 → 주황 → 노랑 → 초록 → 파랑 → 보라 → 자주 → 진한 자주 → 갈색, 그 뒤 그림 모양. 유채색 10색(금속색 아님).
    - 쓰인 상황: 평소(남의 프로필 · 배지 쪽 머리 「Level 32」) · 친구 목록 작은 원.
- P17(회원 레벨 진행 막대, 배지 쪽 머리 「198 XP to reach Level 33」): 막대 641×10 둥글기 5. 트랙 rgb(88,89,94) 2.39:1, 채움 rgb(114,110,111) 바탕 + 세로 1×10 회색 그라데이션 PNG(`background-image: url(data:image/png…)`) 3.32:1. 레벨 구간 색(노랑)과 상관없는 회색 한 색.
- P16(배지 · 도전 과제 단계): 배지 그림 자체가 색(예 Community Ambassador 금 메달 그림, Years of Service 주황 숫자 판). 단계 색 체계 없음, 「Level 5, 500 XP」 글로 단계. 배지 제목 #fff, 설명 rgb(143,152,160). 게임 도전 과제(비로그인 화면): 모든 그림이 흑백(`_BW` 그림)으로 나옴, 단계 없음, 희귀는 「(희귀 22개)」 노란 글. 개인 진행 막대는 비로그인 화면에 없음(미확인).
- 같은 서비스 짝: 회원 레벨 = 10단위 유채색 테두리 원 / 레벨 진행 막대 = 회색 / 배지 = 그림마다 고유색 / 도전 과제 못 얻음 = 흑백 그림.
- 캡처: `caps/achieve/steam-badges.png` · `steam-profile.png` · `steam-ach.png`

##### GitHub (공개 프로필 업적)

- URL: https://github.com/torvalds?tab=achievements · 확인 2026-11-22 · 해외 · 다크(시스템 따라감) · 쪽 바탕 rgb(13,17,23) · 브랜드색 없음(흰 Sign up 단추, 링크 파랑 rgb(68,147,248))
- P16(업적 단계): 면 배지 + 그림색. 업적 그림(128 카드 · 64 옆열) 자체가 단계마다 동 · 은 · 금 메달 그림으로 바뀌고, 이름 옆 알약 칩 「x2 · x3 · x4」(32×20, 둥글기 9999, 테두리 1px 같은 색)이 단계 색 면. CSS 원문: `.achievement-tier-label--bronze { background-color: rgb(249,191,167) }` · `--silver rgb(225,228,228)` · `--gold rgb(250,229,126)`, 글자 `var(--fgColor-black)` = rgb(1,4,9). 화면 본 값: x2 bronze(Pull Shark) · x4 gold(Pair Extraordinaire · Starstruck). silver 는 CSS 값만(화면 미확인). 1단계(x1)는 칩 없음.
    - 3단(동 → 은 → 금, 숫자는 x2 → x3 → x4). 단계 면 대비 바탕 rgb(13,17,23): bronze 11.75:1 · silver 14.8 · gold 14.94. 칩 안 글자 대비: bronze 12.75 · silver 16.06 · gold 16.21.
    - 칩 색은 다크 · 라이트 같은 고정 rgb(테마 변수 아님).
    - 못 얻은 업적: 보이지 않음(딴 것만 나열). 단계 없는 업적(Mars 2020 · Arctic Code Vault)은 고유 그림, 칩 없음.
    - 카드: 면 rgb(13,17,23)(쪽과 같음) · 테두리 1px rgba(61,68,77,.7) · 둥글기 6, 그림에 drop-shadow.
- P17: 진행 막대 없음.
- 캡처: `caps/achieve/github-ach.png`

##### Exophase (게임 트로피 · 도전 과제 목록)

- URL: https://www.exophase.com/game/hollow-knight-psn/trophies/ · `.../hollow-knight-steam/achievements/` · 확인 2026-11-22 · 해외 · 늘 다크 · 쪽 바탕 rgb(34,34,34), 목록 판 rgb(49,53,62), 줄 면 rgb(49,53,62) / rgb(52,57,67) 번갈아 · 브랜드색 하늘 rgb(0,162,210)(LOG IN · 고른 탭 밑줄 · 링크)
- P16(트로피 단계): 아이콘만. 「Points」 열에 트로피 그림 16×16(`exo-icon-trophy-platinum|gold|silver|bronze` PNG). 그림 주색(1배 캡처 표본, 8단계 양자화): platinum rgb(120,144,200) 3.87:1 · gold rgb(216,168,72) 5.62 · silver rgb(200,200,200) 7.34 · bronze rgb(192,96,48) 2.9(대비 바탕 rgb(49,53,62)). 4단(동 → 은 → 금 → 백금), 백금은 푸른 회색. 이름 · 희귀 % 글자는 단계와 상관없이 흰색(설명 opacity .8). Steam 게임은 단계 없음(그림 아이콘 자리 없음).
    - 못 얻은 것: 비로그인이라 모든 줄 class `locked`, 줄 모양 차이 없음(미확인). 숨긴 트로피는 class `secret`(줄 모양은 같음).
- P17: 「Sign In to View Progress & Stats」 로 막힘(진행 막대 미확인). 리더보드 쪽은 Cloudflare 확인 화면(403).
- 캡처: `caps/achieve/exo-psn-rows.png` · `exo-psn.png` · `exo-game.png`

##### Discourse Meta (meta.discourse.org 배지 목록)

- URL: https://meta.discourse.org/badges · 확인 2026-11-22 · 해외 · 다크(시스템 따라감) · 쪽 바탕 rgb(26,26,26), 카드 면도 같은 어두운 면 + 테두리 · 브랜드색 보라(「회원가입」 · 「로그인」 단추)
- P16(배지 단계): 아이콘만. 카드 왼쪽 선 아이콘 56×56(`.badge-icon.badge-type-gold|silver|bronze` 안 svg) 의 fill · color 가 단계색. 이름 · 설명 · 「3.9천 awarded」 글자는 단계와 상관없음(흰 · 회색). 쪽 루트 CSS 변수: `--gold: rgb(231,195,0)` 10.11:1 · `--silver: #c0c0c0` 9.57 · `--bronze: #cd7f32` 5.53(대비 바탕 rgb(26,26,26)). 3단(동 → 은 → 금), 쪽은 금 · 은 · 동 묶음 제목으로 나눔.
    - 못 얻은 것: 전체 배지 목록은 상태 없음(자료 목록). 사용자 배지 쪽은 딴 것만.
- P17: 없음.
- 캡처: `caps/achieve/discourse-badges-cards.png` · `discourse-badges.png`

##### Game Jolt (게임 트로피 목록)

- URL: https://gamejolt.com/games/trophy-clicker/196972/trophies · 확인 2026-11-22 · 해외 · 늘 다크 · 쪽 바탕 rgb(42,39,49) · 브랜드색 연두(고른 탭 「Trophies」 글자 · 밑줄, Follow 숫자)
- P16(트로피 단계): 그림색 + 단계 이름 글자. 검정 틀(rgb(0,0,0) 둥글기 12, 100×119) 안 트로피 픽셀 그림 색이 단계마다 다름 + 그림 아래 「GOLD · PLATINUM」 11px 글자 rgb(240,240,240)(단계와 상관없이 흰색). 그림 주색 표본: GOLD rgb(248,200,32) + 그림자 rgb(200,88,24) · PLATINUM rgb(184,208,216) + 그림자 rgb(72,88,160). Bronze · Silver 는 이 게임에 없음(미확인). 단계 4(동 · 은 · 금 · 백금, 이름은 Game Jolt 공통).
    - 못 얻은 것: 트로피 그림 안에 「?」, 설명 자리에 「Achieve this trophy to view the description.」 rgb(123,120,131) 3.39:1 대비 쪽 바탕. 그림은 색 그대로(흐림 없음).
- P17: 없음(비로그인).
- 캡처: `caps/achieve/gamejolt-rows.png` · `gamejolt.png`

##### Quaver (리듬게임 공개 프로필 업적)

- URL: https://quavergame.com/users/1#achievements · 확인 2026-11-22 · 해외 · 늘 다크 · 쪽 바탕 rgb(21,21,21), 쪽 가운데 rgb(34,34,34) · 브랜드색 하늘(4K 고른 탭 면 · 로고)
- P16(업적 단계): 그림(테두리 틀) 색. 72×72 정사각 그림마다 두꺼운 틀 + 안 기호 색이 단계를 나타냄(그림 자체 PNG, CSS 색 아님). 같은 업적 줄의 단계가 따로 칸(25 · 150 · 300 · 500 · 600 · 700 · 800 · 900 · 1000 처럼 숫자만 다른 칸). 틀 주색 표본(밝은 화소만, 8단계 양자화): 1단 주황 rgb(208,120,32) 4.84:1 · 2단 흰 rgb(232,232,232) 12.98 · 3단 노랑 rgb(248,200,48) 10.07 · 4단 청록 rgb(104,224,232) 10.16 · 5단 분홍 rgb(232,104,176) 5.33 · 6단 빨강 rgb(224,80,104) 4.18(대비 바탕 rgb(34,34,34)). 단계 없는 업적은 브랜드 하늘 rgb(0,216,248) 9.23 틀.
    - 6단 순서: 동(주황) → 은(흰) → 금 → 청록 → 분홍 → 빨강. 금속 3색 뒤에 유채색 3색.
    - 못 얻은 것: 같은 칸에 회색 그림(`achievements/12-locked.png` 같은 따로 만든 잠김 그림), 틀 rgb(88,88,88) 2.24:1. opacity · filter 는 1 · none(그림을 바꿈).
- P17: 없음.
- 캡처: `caps/achieve/quaver-ach.png`

##### Kongregate (사용자 획득 배지)

- URL: https://www.kongregate.com/en/accounts/jimgreer/badges · 확인 2026-11-22 · 해외 · 다크(시스템 따라감, 머리에 해 모양 전환 단추) · 쪽 바탕 rgb(38,38,38), 카드 rgb(29,41,57) 테두리 1px rgb(52,64,84) 둥글기 12 · 브랜드색 빨강(로고 · 고른 거르기 「All Badges」 면)
- P16(배지 난이도 단계 Easy · Medium · Hard · Impossible): 글자만, 색 구분 없음. 카드 안 「5 pts」 rgb(250,197,21) 9.14:1(난이도와 상관없이 같은 노랑) 옆 「Easy」 「Medium」 회색 작은 글(화면으로 두 단계 같은 회색 확인, 계산값 미측정). 배지 그림은 게임마다 고유 그림, 단계 색 없음. 위 거르기 칩(Easy · Medium · Hard · Impossible)도 같은 남색 면 + 하늘 글자.
    - 못 얻은 것: 딴 배지만 나열.
- P17: 없음.
- 캡처: `caps/achieve/kongregate.png`

##### Chess.com (공개 프로필 Awards)

- URL: https://www.chess.com/member/hikaru/awards · 확인 2026-11-22 · 해외 · 늘 다크 · 쪽 바탕 rgb(49,46,43)(본문 판 남색 면) · 브랜드색 초록(Sign Up · Play on Your Phone 단추)
- P16(메달 · 업적 단계): 그림만. 「Medals」 구역 1st Place 금 메달 · 2nd Place 은 메달 그림(540×540 PNG, `award-item-legacy-img` filter none · opacity 1). 그림 색 계산값 없음(그림 지연 로딩으로 표본 못 잼, 화면 눈으로 금 · 은). 그림 오른쪽 아래 횟수 원 35×35 rgba(255,255,255,.72) 면 + 글자 rgb(49,46,43). 「Achievements」 는 업적마다 고유 색 그림(초록 달력 · 노랑 시계 · 하늘 말풍선), 단계 이름은 숫자(Happy Anniversary 12). 이름 rgba(255,255,255,.72) 7.79:1.
    - 3단 이상 금속색은 메달(순위)에만, 업적 단계는 그림 안 숫자.
    - 못 얻은 것: 이 쪽은 딴 것만(옛 조사 11-07 은 업적 펼침에서 자물쇠 그림 기록, 이번 미확인).
- P17: 없음.
- 캡처: `caps/achieve/chess-awards.png`

##### Stack Overflow (공개 프로필 배지) — 라이트만

- URL: https://stackoverflow.com/users/22656/jon-skeet?tab=badges · 확인 2026-11-22 · 해외 · 라이트만(비로그인은 `colorScheme: dark` 에서도 body rgb(255,255,255)) · 쿠키 창은 닫지 않고 아래 구석에 뜬 채 잼
- P16 꼴만: 배지 칩 면은 단계와 상관없이 같은 회색(태그 배지 rgb(241,242,243) 면 · 테두리 rgb(214,217,220) · 글자 rgb(59,64,69), 둥글기 4), 칩 앞 6×14 점 그림(`badge1` 금 · `badge2` 은 · `badge3` 동, `sprites.svg` 조각)이 단계 색. 쪽 위 「895 gold badges · 9,325 silver badges」 처럼 단계별 큰 그림 + 개수 묶음. 점 색 계산값은 그림 조각이라 미측정. 3단(동 · 은 · 금).
- P17: 「다음 배지」 진행은 로그인 뒤 화면이라 미확인.
- 캡처: `caps/achieve/so-user.png`(두 번째 열람에서 CSS 가 덜 불러와져 맨 글자 화면으로 찍힘, 값은 첫 열람 `out/so-user.json`)

##### 올리브영 (멤버십 등급 안내 공개 쪽) — 라이트만

- URL: https://www.oliveyoung.co.kr/store/main/getMembership.do · 확인 2026-11-22 · 국내 · 라이트만(`colorScheme: dark` 에서도 흰 쪽) · 브랜드색 연두 · 초록
- P16 · P3 꼴만(회원 등급 5단): 등급 고르기 단추가 계단처럼 높이가 늘어나는 면 막대(122 폭, 높이 46 · 56 · 64 · 74 · 82, 둥글기 4). 고른 단추만 등급 색 면 + 흰 글자, 나머지는 rgb(240,241,244) 회색 면. 하나씩 눌러 잰 고른 면: BABY rgb(207,211,26) · PINK rgb(235,109,154) · GREEN rgb(1,187,86) · BLACK rgb(51,51,51) · GOLD rgb(197,171,78). 흰 글자 대비: 1.62 · 2.92 · 2.55 · 12.63 · 2.26. 순서 BABY → PINK → GREEN → BLACK → GOLD(맨 위가 금색, 금속색은 맨 위 하나뿐).
- 캡처: `caps/achieve/oliveyoung.png`(전체 쪽)

##### 뽐뿌 (자유게시판 글 목록 회원 레벨 아이콘) — 라이트만

- URL: https://www.ppomppu.co.kr/zboard/zboard.php?id=freeboard · 확인 2026-11-22 · 국내 · 라이트만 · 쪽 바탕 rgb(248,248,248)
- P3 꼴만(회원 레벨 아이콘): 글쓴이 이름 앞 20×20 그림(`.nlevel.lvN`, `icon_level_N.png`). 그림 주색 표본: lv2 주황 rgb(216,136,72) · lv4 연두 rgb(136,200,112) · lv6 파랑 rgb(104,120,240) · lv8 회색 rgb(152,152,152)+파랑 점 · lv9 주황 rgb(224,128,40) · 관리자 lvP 보라 rgb(200,112,232). 레벨마다 다른 유채색 그림, 숫자 글자색 구간 없음. 이름 글자색은 레벨과 상관없이 같음.
- 캡처: `caps/achieve/ppomppu.png`

##### 로스트아크 전투정보실 (공식 캐릭터 프로필 · 수집형 포인트)

- URL: https://lostark.game.onstove.com/Profile/Character/쥬쥬 (캐릭터 이름은 팬 사이트 loawa.com 랭킹 링크에서 얻음) · 확인 2026-11-22 · 국내 · 늘 다크 · 판 바탕 rgb(22,25,29), 왼쪽 열 rgb(21,23,28) · 브랜드색 보라(고른 탭 「수집형 포인트」 면 · 밑줄)
- P17(수집 진행 막대, 「수집형 포인트」 탭 → 항목마다): 막대 334×30 직각(둥글기 0). 트랙 rgb(0,0,0) 1.19:1(판 바탕 대비), 채움 rgb(255,210,0) 12.15:1 한 색(항목과 진행률 상관없이 같음: 거인의 심장 100% · 크림스네일의 해도 100% · 모코코 씨앗 98% · 섬의 마음 89% 모두 같은 노랑). 막대 오른쪽 끝 안쪽에 「89%」 흰 글자(채움 위 흰 글자 1.45:1, 빈 트랙 위는 검정 바탕 흰 글자). 위 「섬의 마음 포인트 93」 숫자 rgb(255,176,0) 9.62:1, 오른쪽 목록 머리 「94 / 104」 rgb(255,176,0).
    - 획득 목록: 얻은 줄 class `complete` + 오른쪽 「획득」 rgb(255,210,0), 못 얻은 줄은 「획득」 글자 없음 + 이름 회색(화면 확인, 계산값 미측정). 번호 칸 흰 글자 회색 면.
- P3(캐릭터 수치 숫자 색): 「장착 아이템 레벨 Lv.1,805.00」 rgb(255,0,155) 4.81:1 · 「전투력 10,893.33」 rgb(247,184,56), 원정대 · 전투 레벨은 흰색. 아이템 레벨 색이 구간마다 바뀌는지는 미확인(한 캐릭터만 봄). 라벨 rgb(102,102,102) 알약 면.
- P16: 해당 없음(이 화면에 업적 단계 배지 없음).
- 캡처: `caps/achieve/lostark-collect-섬의마음.png`(89%) · `lostark-collect-모코코씨앗.png`(98%) · `lostark-collect-크림스네일의해도.png`(100%) · `la-char.png`(능력치 탭)

##### KLOA 클로아 (kloa.gg 로스트아크 캐릭터 · 수집형 포인트)

- URL: https://kloa.gg/characters/쥬쥬 → 「수집형 포인트」 탭 · 확인 2026-11-22 · 국내 · 다크(시스템 따라감, 머리에 해 모양 전환 단추) · 쪽 바탕 oklch(0.1904 0.0302 283.16)(남보라 검정), 카드 면 rgb(35,35,49)(화소) · 브랜드색 보라(로고 · 고른 탭 밑줄 · 라벨 알약)
- P17(수집 진행): 카드 전체가 막대. 항목 카드(346×75, 둥글기 약 8) 안쪽을 진행률만큼 보라로 채우고 나머지는 카드 면 그대로. 채움 화소: 왼쪽 rgb(59,53,116) → 오른쪽 rgb(67,47,109)(가로로 조금 바뀜, CSS 요소로 못 잡아 화소로 잼), 빈 쪽 rgb(35,35,49), 채움/빈 쪽 대비 1.38–1.44:1. 100% 카드는 끝까지 채움. 진행률 「90.4%」 oklch(1 0 0 / .87) · 「94/104」 oklch(1 0 0 / .6), 단계 · 진행률과 상관없이 같은 색.
    - 공식 전투정보실(같은 데이터)은 노랑 rgb(255,210,0) 얇은 막대, 이 팬 사이트는 브랜드 보라 카드 채움.
- P3: 왼쪽 큰 카드의 아이템 레벨 「1,805.00」 · 전투력 「10,893.33」 은 흰 · 연두 글자(구간 색 여부 미확인).
- 캡처: `caps/achieve/kloa-collect.png` · `kloa.png`

##### SEELIE.me (원신 업적 추적기)

- URL: https://seelie.me/achievements · 확인 2026-11-22 · 해외 · 늘 다크 · 쪽 바탕 rgb(13,26,43), 카드 면 남색 그라데이션 · 브랜드색 보라 · 금(로고, 왼쪽 메뉴 사이 금 점 장식)
- P17(업적 묶음 진행 막대): 카테고리 카드 · 지역 카드 아래 막대. 트랙 class `bg-gray-600/80` rgba(68,87,111,.8) 높이 8 둥글기 9999(알약), 채움 class `bg-purple-500` rgb(139,92,246) 한 색(`style="width: 0%"`). 대비 바탕 rgb(13,26,43): 채움 4.13:1 · 트랙 1.96:1. 비로그인 · 저장 없음이라 모든 진행이 0% → 화면에서 채움은 안 보임(색은 요소 계산값), 진행률 글 「0% (0/1026)」 흰 굵은 글.
- P16: 원신 업적은 같은 업적의 1–3단계를 한 카드 안 줄로 두고 다음 단계 줄을 흐리게(옛 조사 11-07 `p12-achievement-row` 기록), 이번 열람은 카테고리 안 목록이 「LOADING 업적…」 에서 멈춰 미확인.
- 캡처: `caps/achieve/seelie-bars.png` · `seelie-category.png`

##### Codewars (공개 사용자 프로필 등급 kyu · dan)

- URL: https://www.codewars.com/users/g964 · 확인 2026-11-22 · 해외 · 다크(`html.dark.sl-theme-dark`, 머리에 달 모양 전환) · 쪽 바탕 rgb(22,23,27) · 브랜드색 빨강(SIGN UP 단추 · 로고 · 구역 아이콘)
- P3(회원 등급 표시, 이름 앞 「1 kyu」): 육각 테두리 칩(테두리 선 + 같은 색 글자, 면 없음). 등급 묶음 색은 루트 CSS 변수: `--color-rank-white #e6e6e6`(8–7 kyu) 14.35:1 · `--color-rank-yellow #ecb613`(6–5) 9.61 · `--color-rank-blue #1f87e7`(4–3) 4.84 · `--color-rank-purple #866cc7`(2–1) 4.25 · `--color-rank-black-hex #555`(dan) 2.4, 글자 `--color-rank-black-text #999` 6.29 · `--color-rank-red #bb432c` 3.37(대비 바탕 rgb(22,23,27)). `.small-hex.is-*-rank` 는 면 칠 + 글자 `--color-legacy-blackout-txt`(작은 칩 꼴), 프로필 머리는 테두리 꼴. 화면 본 값: 1 kyu 보라.
    - 묶음 순서: 흰 → 노랑 → 파랑 → 보라 → 검정(dan) → 빨강(특수). 2단계씩 한 색, 유채색(금속색 아님).
- P16 · P17: 「View Profile Badges」 따로 쪽(이번 미확인). Honor 숫자 「490,140」 흰 글.
- 캡처: `caps/achieve/codewars-p.png`

##### Cytoid (리듬게임 공개 프로필 배지 · 레벨)

- URL: https://cytoid.io/profile/tigerhix · 확인 2026-11-22 · 해외 · 늘 다크(daisyUI 테마) · 쪽 바탕 oklch(0.288 0.022 277.5) 계열 남색 · 브랜드색 연보라(primary oklch(0.785 0.104 274.7))
- P3(회원 레벨): 면 배지 한 색. 이름 아래 「Lv. 139」 class `badge badge-primary` 면 oklch(0.785 0.104 274.7) + 글자 oklch(0.157 0.021 274.7), 「rt 9.28」 `badge-neutral` 면 oklch(0.394 0.033 275.5) + 글자 oklch(0.879 0.007 275.5). 레벨 값에 따라 색이 바뀌는지는 미확인(한 사용자, 브랜드 primary 를 그대로 씀).
- P16: 단계 색 없음. 옆열 「BADGES」 는 그림 칩 5개 + 목록(아이콘 24 + 이름 + 설명), 아이콘마다 고유색(주황 · 파랑 · 노랑 · 흰). 단계는 다른 이름(Maxed Out → Max Expert, Dedication → Diligence → Determination)으로 따로 줄, 색 차이 없음. 딴 것만 나열.
- P17: 없음.
- 캡처: `caps/achieve/cytoid-p.png`(전체 쪽)

##### Genshin Center (원신 업적 추적기)

- URL: https://genshin-center.com/achievements · 확인 2026-11-22 · 해외 · 늘 다크 · 쪽 바탕 rgb(0,0,0)/남색, 묶음 카드 rgb(30,34,49) 둥글기 5 · 브랜드색 없음(고른 메뉴 하늘 밑줄 · 노란 이름)
- P16(같은 업적의 단계 1–3, 보상 5 · 10 · 20 원석): 한 카드 안 줄 셋, 단계 색 없음. 업적 이름은 단계와 상관없이 rgb(255,215,128) 노랑 11.51:1, 설명 · 보상 숫자 rgb(204,204,204). 아직 순서가 안 온 다음 단계 줄은 안쪽 요소 opacity 0.5(이름 3.92:1 · 설명 3.54:1 로 흐려짐), 첫 단계만 1. 줄마다 오른쪽 빈 원 체크칸(못 얻음 = 빈 원).
- P17: 왼쪽 묶음 카드 「0/1026 (0%)」 숫자만, 막대 없음(이 화면).
- 캡처: `caps/achieve/gcenter.png`(아래 광고 띠가 덮였지만 업적 줄은 보임)

##### Paimon.moe (원신 업적 추적기)

- URL: https://paimon.moe/achievement · 확인 2026-11-22 · 해외 · 늘 다크 · 쪽 바탕 rgb(37,41,74), 업적 카드 rgb(45,50,90) 둥글기 12 · 브랜드색 파랑 rgb(78,124,255)(고른 카테고리 「천지만물」 면 · 고른 메뉴)
- P16(같은 업적 단계 1–3): Genshin Center 와 같은 꼴. 한 카드 안 줄 셋, 단계 색 없음(이름 · 보상 원석 5 · 10 · 20 은 같은 흰 글자), 다음 단계 줄은 흐림(화면 확인. 옛 조사 11-07 DOM: 둘째 줄부터 `.border-t.opacity-25`, 줄 사이 1px rgb(74,85,104)). 이번 열람은 한국어 화면에서 해당 요소를 다시 못 잡아 opacity 는 옛 기록 값. 못 얻음 = 오른쪽 빈 네모 체크칸. 버전 칩 「2.3」 회색 알약.
- P17: 카테고리 카드 「0/1026 (0%)」 숫자만, 막대 없음.
- 캡처: `caps/achieve/paimon-p.png`

### 디자인 시스템 공식 값 (`parts/ds.md`)

#### 머리 요약

- 본 디자인 시스템 15곳(모두 해외 13 · 국내 2). 패키지 값까지 읽은 곳 13: Adobe Spectrum · IBM Carbon(+Carbon Charts) · GitHub Primer · Atlassian · Microsoft Fluent 2 · Material 3(Material Web) · Ant Design · Chakra UI · Mantine · Shopify Polaris · 당근 SEED(국내) · Toss TDS Mobile(국내) · Elastic EUI. 문서만 본 곳 2(D4 만): GitLab Pajamas · Semrush Intergalactic.
- 다크: 13곳 모두 다크 값 있음. Polaris 다크는 이름이 `dark-experimental` 이고 상태 채움색은 라이트 값 그대로. Toss 진행 막대 채움은 고정 팔레트라 다크에서도 같은 값.
- 게임 · 플랫폼 공개 가이드: Discord 브랜드 1곳 봄(등급 색 없음). Xbox · Riot · PlayStation 은 공개 DS 못 찾음, Duolingo 는 옛 가이드 주소가 넘어가 막힘.
- 막힘: Spectrum 표 문서(spectrum.adobe.com/page/table 404), Duolingo 디자인 색 쪽(301). 캡처 없음(페이지 렌더가 필요한 곳이 없었음, `caps/ds/` 안 만듦).
- 기능별 수(DS 13곳 패키지 기준, D4 는 문서 포함):
    - D5 · P17 진행 막대 · 미터: 있음 13(SEED 는 원형만, 가로 막대 없음). 상태별 채움 토큰 있음 8(Spectrum · Carbon(ProgressBar 와 Charts MeterChart 둘 다) · Primer · Atlassian · Fluent · antd · Polaris · EUI), 한 색 + 갈래 고르기 4(Material · Chakra · Mantine · Toss). 값 구간에 따라 색이 저절로 바뀌는 것 1(Carbon Charts MeterChart `status.ranges`), 부분 1(antd 100% 에서 success). 그라데이션 채움 옵션 1(antd `strokeColor` from/to · 여러 지점). 칸마다 다른 색 steps 1(antd), 한 막대 여러 구간 3(Primer Item · Mantine Section · antd success).
    - P16 등급 · 금속 토큰: 등급 단계 색 토큰 있음 1(SEED 매너온도 l1–l10, 금속색 아님). 금속 · tier 뜻 토큰 0. 이름만 같은 것 3(Fluent gold · platinum 아바타 색, antd gold 갈래, Spectrum silver 아이콘 갈래). 업적 토큰 0(Primer 는 sponsors 분홍만).
    - D7 · P14 · T1 순차 색표: 여러 색상 이어지는 순차 색표 있음 2(Spectrum viridis 등 5갈래 · AntV G2 ylGnBu, 값은 리포 chart 문서). 한 색 명도 단계만 3(Carbon · Atlassian 3단 · EUI). 차트 색 없음 4(Material · Chakra · SEED · Mantine 본체). 나머지는 리포 chart 문서 참조. 등급 표시용이라고 쓴 문서 문구 0(미확인).
    - D4 빈 값: 칸 단위 지침 있음 3(Primer 빈 칸 · GitLab 글 또는 em dash + 툴팁 · Semrush n/a + `--text-secondary`), 없음 확인 3(Carbon · Atlassian · Polaris 문서) + 패키지에 규칙 없음 3(Chakra · SEED · EUI), 막힘 1(Spectrum).

2026-11-22 확인. 공식 npm tarball(받아서 읽기만, 설치 · 실행 없음, 패키지마다 빈 폴더 `/private/tmp/claude-501/b-grade-ds/pkgs/<이름>/`)과 공식 문서를 읽었다. 대비 비는 WCAG 2, 스크립트 `/private/tmp/claude-501/b-grade-ds/bin/cr.py`. 추천 · 판단 없음.
D7 · P14 · T1 의 차트 순차 색표 값은 리포 `docs/research/2026-11-20-color-chart.md` 에 이미 잰 것이 있어 다시 재지 않고 줄 번호만 적는다.

#### 1. Adobe Spectrum (Spectrum 2 토큰)

- 출처: `@adobe/spectrum-tokens@15.9.0` `src/color-aliases.json` · `src/color-palette.json` · `src/meter.json` · `src/progress-bar.json`, `@spectrum-css/meter@1.2.0` `index.css` 14–44, `@spectrum-css/progressbar@6.2.0` `index.css` 81–87 · 181 · 192.
- 다크 바탕: `background-base-color` = gray-25, 다크 rgb(17,17,17)(color-aliases.json 132 · color-palette.json 2551–2553).
- D5 · P17 진행 막대 · 미터: 있음.
    - 진행 막대 채움 기본 `accent-color-900` = blue-900, 다크 rgb(86,129,255) 5.38 : 1(progressbar index.css 81).
    - 미터 채움은 클래스로 고르는 4가지: 기본(진행 막대와 같은 accent) · `.is-positive` → `positive-visual-color` = green-900 다크 rgb(9,157,89) 5.38 · `.is-notice` → `notice-visual-color` = orange-900 다크 rgb(224,100,0) 5.39 · `.is-negative` → `negative-visual-color` = red-900 다크 rgb(252,67,46) 5.38(meter index.css 33–43, color-aliases.json 1532 · 1810 · 2162). `informative-visual-color` = blue-900(1314). 라이트는 같은 갈래 800 단계.
    - 값 구간에 따라 색을 자동으로 바꾸는 규칙은 CSS 에 없음. 클래스(상태)를 쓰는 쪽이 고른다. React Spectrum Meter 문서(https://react-spectrum.adobe.com/react-spectrum/Meter.html, 2026-11-22)도 variant 4가지(informative 기본 · positive · warning · critical)를 「The visual style of the Meter」 로만 설명하고 값 구간과 묶는 문구는 없음.
    - 트랙: 컴포넌트는 `--spectrum-progressbar-track-color` → `--system-progress-bar-track-color`(progressbar dist/index-theme.css). 토큰 `track-color` = gray-300 다크 rgb(57,57,57) 1.64 : 1(color-aliases.json 2485). system 변수가 `track-color` 로 이어지는 줄은 미확인.
    - 두께 토큰 4 · 6 · 8 · 10px(meter.json · progress-bar.json), 모서리 `corner-radius-100`, 미터 기본 폭 192px.
- P16 금속 · 등급 토큰: 없음. `silver-*` 는 아이콘 색 갈래 이름(`icon-color-silver-*`, icons.json 1109–1160)이고 gold · bronze · tier · medal · achievement 이름은 src 전체 0건.
- D7 · P14 · T1 순차 색표: 이미 잰 값 — 리포 chart 문서 668–679행(viridis · magma · rose · cerulean · forest 5갈래 × 16단, vega 기본 ramp = viridis16). 등급 표시용이라는 문서 문구는 패키지에서 못 찾음(미확인).
- D4 빈 값: 토큰 · 컴포넌트 CSS 에 빈 값 표시 규칙 없음(meter · progressbar 패키지 확인). 문서 쪽 미확인.

#### 2. IBM Carbon (g100 · g90)

- 출처: `@carbon/styles@1.120.0` `scss/components/progress-bar/_progress-bar.scss` 47–48 · 59–73 · 136–151, `scss/layer/_layer-sets.scss` 67–71, `@carbon/themes@11.86.0` `scss/generated/_themes.scss`(g90 503– · g100 747–), `@carbon/charts@1.27.27` `scss/graphs/_meter.scss` 5–35 · `scss/_tokens.scss` 30–60 · 141–170 · `dist/interfaces/charts.d.ts` 381–399 · `dist/model/meter.d.ts` 9–17.
- 다크 바탕: g100 `background` #161616, g90 #262626. 대비는 #161616 기준.
- D5 · P17 진행 막대(ProgressBar 부품): 있음.
    - 채움 `$interactive` g100 · g90 #4589ff 5.41 : 1(_progress-bar.scss 68–70). 끝남 `--finished` → `$support-success` #42be65 7.57, 오류 `--error` → `$support-error` g100 #fa4d56 5.40 · g90 #ff8389(136–143). 상태는 쓰는 쪽이 `status` 로 고름.
    - 트랙 `$border-subtle`(층 맥락 토큰: 바탕 위 00 · layer-01 위 01 …, _layer-sets.scss 67–71). g100 00 #393939 1.57 · 01 #525252, g90 00 #525252 · 01 #6f6f6f.
    - 두께 8px 기본 · 4px 작게(48 · 59–63), 모서리 `$border-radius-max`(54 · 73).
- D5 미터(Carbon Charts MeterChart): 있음, 값 구간 색 전환이 옵션으로 있음.
    - `meter.status.ranges: [{ range: [a, b], status }]` — 값이 든 구간의 status 로 막대 색을 고른다(charts.d.ts 391–398, meter.d.ts 「Get the associated status for the data by checking the ranges」). status 없으면 범주 색 기본.
    - 값 막대: danger → `$support-error` · warning → `$support-warning` #f1c21b 10.75(g90 · g100 테두리 `alert-stroke` none, 라이트는 yellow-50 테두리) · success → `$support-success` #42be65(_meter.scss 15–28).
    - 트랙(container) `$layer-01` g100 #262626 1.20(7–9). 구간 표시선 `meter-range-indicator` g90 · g100 gray-60 #6f6f6f 3.60(_tokens.scss 141–170). 최고점 선 `$border-inverse` 2px.
    - 구간은 3상태(danger · warning · success)뿐, 단계 수 늘리는 색표 없음.
- P16 금속 · 등급 토큰: 없음(`@carbon/themes` 생성 토큰 · styles 에 gold · silver · bronze · tier · medal 0건).
- D7 · P14 · T1 순차 색표: 이미 잰 값 — 리포 chart 문서 634–645행(한 색 명도 4갈래 × 11단, 여러 색상 이어지는 순차 색표 없음). 등급 표시용 문구 미확인.

#### 3. GitHub Primer (dark)

- 출처: `@primer/primitives@11.10.0` `dist/css/functional/themes/dark.css` 35–70 · 474–479 · 650 · 865–873, 원본 `src/tokens/component/progressBar.json5`, `@primer/react@38.46.0` `dist/ProgressBar/ProgressBar-3d1db6c7.css` · `ProgressBar.js` 69–70.
- 다크 바탕: `bgColor-default` #0d1117.
- D5 · P17 진행 막대: 있음. 상태별 채움 토큰 8개(dark.css 865–872, 모두 `bgColor-*-emphasis` 를 가리킴):
  accent #1f6feb 4.08 · success #238636 4.09 · attention #9e6a03 4.07 · severe #bd561d 4.07 · danger #da3633 4.11 · done #8957e5 4.11 · sponsors #bf4b8a 4.14 · neutral #656c76 3.57.
    - 부품 기본 채움은 `bg` 를 안 주면 `--bgColor-success-emphasis`(초록)(ProgressBar.js 70). `bg="accent.emphasis"` 꼴로 쓰는 쪽이 고름. 값 구간 자동 전환 없음.
    - 여러 칸(ProgressBar.Item 여러 개)을 2px 사이로 이어 붙이는 쌓음 막대를 지원(CSS `gap:2px`).
    - 트랙 `progressBar-track-bgColor` = `borderColor-default` #3d444d 1.92(873 · 62), 트랙 테두리 #00000000(650). 높이 small 5 · default 8 · large 10px, 모서리 `borderRadius-small` .1875rem.
- P16 금속 · 등급 토큰: 없음. 「sponsors」 는 GitHub Sponsors 제품 색(분홍) 한 벌: `fgColor-sponsors` #db61a2 5.63(479) · `bgColor-sponsors-emphasis` #bf4b8a(51) · `-muted` #db61a21a(52) · `borderColor-sponsors-*`(69–70). 「achievement · gold · silver · bronze · tier」 는 dark.css 에서 0건(GitHub 업적 배지는 토큰이 아니라 그림).
- D7 · P14 · T1 순차 색표: 이미 잰 값 — 리포 chart 문서 680–690행. 여러 색상 순차 색표 미확인.

#### 4. Atlassian (atlassian-dark)

- 출처: `@atlaskit/progress-bar@5.3.7` `dist/esm/components/progress-bar.js` 11–18 · 35–61 · `progress-bar.compiled.css`, `@atlaskit/tokens@20.14.0` `dist/esm/artifacts/themes/atlassian-dark.js`.
- 다크 바탕: `surface` #1F1F21.
- D5 · P17 진행 막대: 있음. appearance 3가지(default · success · inverse), 쓰는 쪽이 고름.
    - 채움: default `background-neutral-bold` #CECFD2 10.56 : 1(회색, 브랜드 파랑 아님) · success `background-success-bold` #94C748 8.24 · inverse `surface`(progress-bar.js 16–18).
    - 트랙: default · success `background-neutral` #CECED912 1.17 · inverse `background-inverse-subtle` #FFFFFF29 1.67(11–13).
    - 높이 6px, 모서리 `radius-full` 9999px, 폭 전환 .2s.
    - 값 구간 색 전환 · 미터 부품 없음(패키지 진입점은 progress-bar · success-progress-bar · transparent-progress-bar 셋).
- P16 금속 · 등급 토큰: 없음(atlassian-dark.js 에 gold · silver · bronze · tier · medal 0건).
- D7 · P14 · T1 순차 색표: 이미 잰 값 — 리포 chart 문서 646–657행(「단계 · 발산 차트 색은 지원하지 않는다」, 갈래별 bold · bolder · boldest 3단).

#### 5. Microsoft Fluent 2 (webDarkTheme)

- 출처: `@fluentui/react-progress@9.5.7` `lib/components/ProgressBar/useProgressBarStyles.styles.raw.js` 20–31 · 60–79 · `useProgressBarStyles.styles.js` 124, `@fluentui/tokens@1.0.0-alpha.24`(npm latest) `lib/alias/darkColor.js` 62 · 82 · 123 · `lib/alias/darkColorPalette.js` 1–43 · `lib/sharedColorNames.js` · `lib/global/colors.js` · `lib/global/brandColors.js` 11.
- 다크 바탕: `colorNeutralBackground1` grey[16] #292929(darkColor.js 62).
- D5 · P17 진행 막대: 있음. `color` prop 4가지(brand 기본 · error · warning · success), 값이 있을 때만 적용(styles.js 124), 쓰는 쪽이 고름.
    - 채움: brand `colorCompoundBrandBackground` = brandWeb[100] #479ef5 5.18 · error `colorPaletteRedBackground3` = red.primary #d13438 2.95 · warning `colorPaletteDarkOrangeBackground3` = darkOrange.primary #da3b01 3.19 · success `colorPaletteGreenBackground3` = green.primary #107c10 2.71(raw.js 70–79, darkColorPalette.js 9).
    - 트랙 `colorNeutralBackground6` grey[20] #333333 1.15(raw.js 20, darkColor.js 82). 두께 2px(medium) · 4px(large), 모서리 `borderRadiusMedium` 또는 square 일 때 None.
    - 값 구간 자동 전환 없음.
- P16 금속 · 등급 토큰: 등급 뜻 토큰 없음. 이름만 같은 것 — `gold` · `platinum` 은 사람(아바타) 색 28갈래 중 둘(sharedColorNames.js personaSharedColorNames), 다크 토큰 `colorPaletteGoldBackground2` = shade30 #6c5700 · `Foreground2` = tint40 #ecdfa5 10.85 · `BorderActive` = tint30 #dac157, `colorPalettePlatinumBackground2` #3b4447 · `Foreground2` #cdd6d8 9.84(darkColorPalette.js 29–36). `silver` #859599 · `bronze` #a74109 는 global 색에만 있고 alias 토큰 없음. tier · medal · achievement 이름 0건.
- D7 · P14 · T1 순차 색표: 이미 잰 값 — 리포 chart 문서 714–724행.

#### 6. Google Material 3 (Material Web, 기준 보라 팔레트 다크)

- 출처: `@material/web@2.5.0` `tokens/versions/v0_192/_md-comp-linear-progress-indicator.scss` 28–41 · `_md-sys-color.scss` 19–72(다크) · `_md-ref-palette.scss` 50–103 · `progress/internal/linear-progress-styles.css`.
- 다크 바탕: `surface` neutral6 #141218.
- D5 · P17 진행 막대(linear progress): 있음.
    - 채움 `active-indicator-color` = `primary`(다크 primary80 #d0bcff 10.91 : 1). 상태별(오류 · 성공) 채움 토큰 없음.
    - 트랙 `track-color` = `surface-container-highest`(다크 neutral22 #36343b 1.52). 두께 4px · 트랙 모양 corner-none 0px.
    - 「four-color」 4색은 진행 값이 아니라 불확정(indeterminate) 움직임에서 시간 순서로 바뀌는 색: primary #d0bcff → primary-container #4f378b 1.99 → tertiary #efb8c8 10.94 → tertiary-container #633b48 1.99(scss 31–38, CSS `@keyframes four-color`). 값 구간 색 전환 없음.
    - 쓰는 팔레트는 동적 색(사용자 · 앱 바탕색)에 따라 바뀜, 위 값은 패키지 기본(기준 보라).
- P16 금속 · 등급 토큰: 없음(md-sys-color · md-ref-palette 에 gold · silver · bronze · tier 0건).
- D7 · P14 · T1 순차 색표: 패키지에 차트 · 순차 색표 없음. 리포 chart 문서는 Material 3 를 「안 함」 으로 둠(632행 머리 목록).

#### 7. Ant Design (antd 6, darkAlgorithm)

- 출처: `antd@6.7.1` `es/progress/style/index.js` 49–54 · 80–121 · 167–242 · 269–272, `es/progress/progress.d.ts` 23–31 · 60 · 76–79, `es/progress/Line.js` 20–65 · 104–126, `es/progress/Steps.js` 21–38, `es/theme/themes/seed.js` 23–27 · `dark/colors.js` 3–45 · `shared/genColorMapToken.js` 84. 다크 팔레트 `@ant-design/colors@8.0.1` `es/presets.js` 60 · 72 · 76.
- 다크 바탕: `colorBgContainer` = #000 을 8 밝힘(#141414로 알려진 값, 코드는 실행하지 않아 계산식만 확인 — dark/colors.js 41), `colorBgLayout` #000.
- D5 · P17 진행 막대(Progress line · circle · steps): 있음.
    - 기본 채움 `defaultColor` = `colorInfo`(style 270), 다크 = blue 다크 6번 #1668dc 3.55 : 1(presets.js 76, genColorMapToken.js 84). 상태 `status`: normal · active · success → `colorSuccess` 다크 #49aa19 6.18(greenDark[5], presets.js 72) · exception → `colorError`(seed #ff4d4f 의 다크 생성값, 패키지에 고정 값 없음 — 미확인)(style 105–121).
    - 트랙 `remainingColor` = `colorFillSecondary` = 흰 12%(rgba(255,255,255,0.12), dark/colors.js 33) #141414 위 1.40. 둥글기 `lineBorderRadius` 100.
    - 그라데이션: `strokeColor` 에 `{ from, to }` 또는 `{ '0%': c1, '50%': c2, '100%': c3 }` 를 주면 `linear-gradient(to right, …)` 로 채움(Line.js 20–65, progress.d.ts 30–31). 그라데이션은 채움 막대(폭 = percent%) 안에서 그려진다(Line.js 115–120 — 채움이 짧으면 그라데이션도 그 폭에 눌림). 원형은 `-circle-gradient` 클래스.
    - steps: `steps` 칸 수 · `strokeColor` 배열로 칸마다 다른 색(Steps.js 33–38), 빈 칸 `remainingColor`, 찬 칸 기본 `defaultColor`(style 239–242).
    - `success.percent` · `success.strokeColor` 로 한 막대 안에 두 번째(성공) 구간을 겹쳐 그림(Line.js 121–126).
    - 값 구간에 따라 자동으로 색을 바꾸는 규칙은 없음(색 · 그라데이션 · 칸 색은 쓰는 쪽이 줌). status 를 주지 않고 percent ≥ 100 이면 상태가 success 로 바뀌어 초록이 됨(progress.js 60).
- P16 금속 · 등급 토큰: 없음. `gold` 는 프리셋 색 이름(노랑 갈래, goldDark #2b2111 … #faedb5 10단, presets.js 66)이고 메달 뜻 없음. silver · bronze · tier 0건.
- D7 · P14 · T1 순차 색표: 이미 잰 값 — 리포 chart 문서 658–667행(AntV G2 연속 기본 `ylGnBu`).

#### 8. Chakra UI v3 (dark)

- 출처: `@chakra-ui/react@3.38.0` `dist/esm/theme/recipes/progress.js` 13–124 · `semantic-tokens/colors.js` 5–125 · 196–225 · `tokens/colors.js` 35–130 · `global-css.js` 47 · `recipes/empty-state.js` 22 · 32 · `recipes/stat.js` 20–55.
- 다크 바탕: `bg` = black #000000(semantic-tokens 7).
- D5 · P17 진행 막대: 있음. 색은 `colorPalette`(기본 gray, global-css.js 47)를 따름, 쓰는 쪽이 갈래를 고름(상태 · 값 구간 자동 전환 없음).
    - 기본 variant outline: 채움 `colorPalette.solid`(gray 다크 = white #ffffff 21.00) · 트랙 `bg.muted`(다크 gray.900 #18181b 1.19) + 안쪽 그림자(recipe 50–56, semantic 12–14 · 108–110).
    - subtle: 채움 `colorPalette.solid/72`(72% 불투명) · 트랙 `colorPalette.muted`. 예 blue 갈래 다크: solid blue.600 #2563eb 4.06 · muted blue.800 #1a3478 1.81.
    - 높이 xs 1.5 · sm 2 · md 2.5(기본) · lg 3 · xl 4(스페이싱 단위), 모양 square · rounded(l1, 기본) · full. 줄무늬 `striped` 는 45도 반복 그라데이션(진행 값과 무관한 무늬).
- P16 금속 · 등급 토큰: 없음(tokens · semantic-tokens 에 gold · silver · bronze · tier 0건).
- D4 빈 값: 표 · 통계 부품에 빈 값 표시 규칙 없음. EmptyState 부품(목록 · 화면 전체가 빈 경우)은 아이콘 `fg.subtle`(다크 gray.500 #71717a) · 제목 기본 글자 · 설명 `fg.muted`(다크 gray.400 #a1a1aa) — empty-state.js 22 · 32. 값 하나가 빈 자리용 기호 규칙은 미확인.
- D7 · P14 · T1 순차 색표: 없음(차트 테마 토큰 없음).

#### 9. Mantine (dark)

- 출처: `@mantine/core@9.8.2` `styles/Progress.css` 22–75, `esm/components/Progress/ProgressSection/ProgressSection.mjs` 40, `esm/core/MantineProvider/default-colors.mjs` 3–14 · 87–98, `default-theme.mjs` 13–17, `MantineCssVariables/default-css-variables-resolver.mjs` 65.
- 다크 바탕: `--mantine-color-body` = dark-7 #242424.
- D5 · P17 진행 막대: 있음.
    - 채움 `--progress-section-color` = `getThemeColor(color)`, 색을 안 주면 기본 primaryColor blue 의 다크 단계 8(primaryShade dark 8) #1971c2 3.09 : 1. 상태별 채움 토큰 없음, 쓰는 쪽이 갈래를 고름.
    - 트랙 다크 `--mantine-color-dark-4` #424242 1.54(Progress.css 43–45, 라이트 gray-2).
    - 높이 xs 3 · sm 5 · md 8(기본) · lg 12 · xl 16px, 모서리 `radius-default`. `Progress.Section` 여러 개로 한 막대를 여러 색 구간으로 나눠 그림(구간마다 color 지정). 줄무늬는 흰 15% 45도 무늬.
    - 값 구간 자동 색 전환 · 그라데이션 채움 옵션 없음.
- P16 금속 · 등급 토큰: 없음(기본 색 14갈래에 gold · silver · bronze 0건).
- D7 · P14 · T1 순차 색표: 없음(`@mantine/charts` 는 이번에 안 봄 — 미확인).

#### 10. Shopify Polaris (p-theme-dark-experimental)

- 출처: `@shopify/polaris@13.9.5` `build/esm/styles.css` 13791–13860(ProgressBar) · `build/esm/components/ProgressBar/ProgressBar.js` 11 · `build/ts/src/components/ProgressBar/ProgressBar.d.ts` 3, `@shopify/polaris-tokens@9.4.2` `dist/css/styles.css` 1(라이트 · 기본) · 4(`.p-theme-dark-experimental`).
- 다크 바탕: Polaris 다크는 이름에 「experimental」 이 붙은 테마. `color-bg` #1a1a1a · `color-bg-surface` #303030. 다크 블록에 없는 토큰은 라이트 값을 그대로 씀.
- D5 · P17 진행 막대: 있음. `tone` 4가지(highlight 기본 · primary · success · critical), 쓰는 쪽이 고름.
    - 채움: highlight `color-bg-fill-info` rgba(145,208,255) · primary `color-bg-fill-brand`(다크 #ffffff) · success `color-bg-fill-success` rgba(4,123,93) · critical `color-bg-fill-critical` rgba(199,10,36)(styles.css 13823–13840). info · success · critical 은 다크 블록에 없어 라이트 값. 면 #303030 위 대비: info 7.96 · brand 13.20 · success 2.51 · critical 2.20.
    - 트랙 네 tone 모두 `color-bg-fill-tertiary`(다크 #303030 — 면 #303030 과 같은 값, 바탕 #1a1a1a 위 1.32).
    - 높이 small 8 · medium 16(기본 1rem) · large 32px, 모서리 `border-radius-100` 4px.
    - 값 구간 자동 색 전환 없음.
- P16 금속 · 등급 토큰: 없음(polaris-tokens 에 gold · silver · bronze · tier 0건). `color-avatar-one … seven-bg-fill` 7색은 아바타 구분색.
- D7 · P14 · T1 순차 색표: 이미 잰 값 — 리포 chart 문서 703–713행(Polaris Viz).

#### 11. 당근 SEED 3.2.1 (다크)

- 출처: 정본 `stage3/daangn-tokens.md`(읽기만) 26 · 29 · 53 · 134 · 178 · 192 · 253–272행(값은 `@seed-design/css@3.2.1` base.css 816 · 819 · 836 · 910 · 940 · 954 · 1001–1020). 부품 recipe 는 같은 판 `@seed-design/css@3.2.1` `recipes/progress-circle.css` 9–45 · `recipes/manner-temp.css` · `recipes/manner-temp-badge.css`, 부품 동작은 `@seed-design/react@3.4.0`(npm latest) `lib/components/MannerTemp/MannerTemp.js` 13 · `MannerTempEmote.js` · `MannerTempBadge/MannerTempBadge.js`.
- 다크 바탕: `color-bg-layer-default` #16171b.
- D5 · P17 진행 막대: 가로 진행 막대 부품 없음(recipes 에 progress-circle 만, linear · meter 0건). 원형 진행(progress-circle):
    - tone neutral: 채움 `palette-gray-500` #5b606a 2.84 · 트랙 `palette-gray-200` #1d2025 1.10. tone brand: 채움 `bg-brand-solid` #f60 6.10 · 트랙 `palette-carrot-200` #4b291c 1.39. tone staticWhite: 채움 흰 · 트랙 흰 18%(#ffffff2e)(progress-circle.css 25–36).
    - 굵기 size 24 → 3px · size 40 → 5px, 끝 모양 둥금(stroke-linecap round). 값 구간 색 전환 없음.
- P16 등급 단계 색 토큰: 있음(금속색이 아니라 온도 단계 색). 매너온도 `color-manner-temp-l1 … l10` 의 `-text` · `-bg` 20토큰. 부품 둘: `manner-temp`(글자색만, `--level_lN` → `-text`) · `manner-temp-badge`(면 + 글자, 모서리 full, 굵게 t1).
    - 다크 값(글자 / 면, 바탕 #16171b 위 · 자기 면 위 대비): l1 #b8b8b9 / #292929 9.04 · 7.34 — l2 #f5db97 / #332605 13.19 · 10.89 — l3 #fdda65 / #372b01 13.13 · 10.20 — l4 #fbbe55 / #372301 10.74 · 8.98 — l5 #faac4b / #371f01 9.44 · 8.14 — l6 #fc9855 / #351b03 8.33 · 7.45 — l7 #f97a25 / #371701 6.69 · 6.10 — l8 #fe6a34 / #380f00 6.25 · 5.92 — l9 #fe6a5d / #380500 6.34 · 6.25 — l10 #fb6f82 / #34040a 6.57 · 6.59.
    - 단계 순서: l1 회색 → l2–l6 노랑 · 주황 → l7–l9 주황 · 빨강 → l10 분홍빨강(색상이 이어지는 10단). l1 만 무채색.
    - 온도 값 → 단계 매핑은 패키지에 없음(`level` 을 쓰는 쪽이 넘김, MannerTemp.js 13). 단계마다 표정 그림(emote) 이미지가 따로 있음(MannerTempEmote.js l1–l10).
- D7 · P14 · T1 순차 색표: 차트 토큰 0건(리포 chart 문서 743–747행). 매너온도 10단이 SEED 안에서 유일한 단계 색표.
- D4 빈 값: 빈 값 기호 규칙 없음. 자리표시 글자 `color-fg-placeholder` #868b94(정본 166행)는 입력칸 placeholder 용.

#### 12. Toss TDS Mobile (다크)

- 출처: `@toss/tds-mobile@2.5.1` `dist/esm/index.js`(한 파일 번들, 글자 위치로 적음): ProgressBar 본문 864587 근처(`function h6` · 크기표 `ale` · 스타일 `sle`), 색 묶음 정의 16710(`m3` = `var(--adaptive*)`) · 22371(`wc` = [라이트, 다크] 짝) · 24374(`Pa` = 고정 팔레트), 테마 적용 43456–43800(`H={...Pa}`, `b={...m3}`) · 323206–323700(`HP={light: 짝[0], dark: 짝[1]}`). 타입 `dist/esm/index.d.ts` 11882–11887 · 14040–14071.
- 다크 바탕: `adaptiveBackground` 다크 #17171c(`wc.background` = ["#ffffff","#17171c"]).
- D5 · P17 진행 막대(ProgressBar): 있음.
    - 채움 기본 `H.blue400` = 고정 팔레트 #4593fc(다크에서도 같은 값, 적응형 아님) 5.81 : 1. `color` prop 으로 바꿈(문서 주석 「@default colors.blue400」). 상태별 색 · 값 구간 전환 없음.
    - 트랙 `b.grey200` = `var(--adaptiveGrey200)`, 다크 #3c3c47 1.64(라이트 #e5e8eb).
    - 굵기 light 2px · normal 5px(기본) · bold 8px, 모서리 2.5 · 2.5 · 4px. 채움은 translateX 로 0.5s ease-in-out 이동.
    - 여러 단계 표시는 따로 `ProgressStepper` · `ProgressStep` 부품(단계 번호, 색 미확인).
- P16 금속 · 등급 토큰: 없음(번들 안 gold · silver · bronze 는 CSS 색 이름표 안 글자뿐, 토큰 이름 0건).
- D7 · P14 · T1 순차 색표: 리포 chart 문서 735–742행(BarChart 다크 값 미확인).

#### 13. Elastic EUI (Borealis 다크)

- 출처: `@elastic/eui@123.5.0` `es/components/progress/progress.styles.js` 32–35 · 64–70 · 92–110 · 115–131 · 169–172, `@elastic/eui-theme-borealis@8.2.0` `lib/esm/variables/colors/_colors_dark.js` 14–19 · 48 · 55 · 57 · 75 · `_semantic_colors.js` · `_primitive_colors.js` 12–145.
- 다크 바탕: `backgroundBasePlain` shade140 #111C2C(쪽 body plainDark #07101F).
- D5 · P17 진행 막대(EuiProgress): 있음. `color` 17가지 이름 + 사용자 색, 쓰는 쪽이 고름.
    - 채움(다크): primary #61A2FF 6.62 · success #24C292 7.51 · warning #FACB3D 11.15 · danger #F6726A 6.14 · accent #EE72A6 6.19 · subdued(textSubdued) #98A8C3 7.11 · accentSecondary · vis0–vis9(데이터 시각화 범주 색 10개 — 값은 리포 chart 문서 691–702행).
    - 트랙 `lightShade` shade125 #243147 1.31(고대비 모드는 emptyShade)(styles 64).
    - 높이 xs 2(size.xxs) · s 4 · m 8 · l 12px(styles 92–110 의 size.xxs · xs · s · m). 값 구간 자동 전환 없음.
- P16 금속 · 등급 토큰: 없음(borealis 색 파일에 gold · silver · bronze · tier 0건).
- D7 · P14 · T1 순차 색표: 이미 잰 값 — 리포 chart 문서 691–702행(2 · 3점 보간 단계 색, 여러 색상 이어지는 것은 미확인).
- D4 빈 값: 패키지 컴포넌트 코드에서 빈 값 기호 규칙을 찾지 못함(미확인).

#### 14. D4 빈 값 — 문서 지침 모음 (2026-11-22 WebFetch)

| DS                           | 지침                                                                                                                                                                                               | 색                            | 출처                                                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| GitHub Primer                | 「By default, leave empty cells blank」. 비어 있는 까닭을 글로 설명해도 됨. 「x」 「-」 같은 글자 · 아이콘 · 이모지로 빈 칸을 표시하지 말라(화면 읽기 도구에 혼란)                                 | 지정 없음                     | https://primer.style/product/components/data-table/guidelines/ (Best practices · Do's and Don'ts)                       |
| GitLab Pajamas               | 경우마다 정함, 「왜」 비었는지 알리는 쪽을 권함. 1) 글 라벨(Unassigned · Not applicable · No value) 2) 숫자 열 · 촘촘한 표는 em dash(—) + 까닭 툴팁 3) 빈 칸은 마지막 수단, 화면 읽기용 숨은 글 짝 | 지정 없음                     | https://design.gitlab.com/components/table (Content › Null values)                                                      |
| Semrush Intergalactic        | 칸에 「n/a」, 글자색 `--text-secondary`, 데이터가 없는 까닭 툴팁                                                                                                                                   | `--text-secondary`(값 미확인) | https://developer.semrush.com/intergalactic/table-group/table-states/table-states (Table cell states › No data in cell) |
| Adobe Spectrum               | 검색 결과 요약에 「gaps in the data 는 en dash(–)로 null · N/A 표시」 문구가 보였으나 spectrum.adobe.com/page/table 이 404 라 원문 확인 못함                                                       | 미확인                        | 막힘(404)                                                                                                               |
| IBM Carbon                   | Data table 사용 문서에 빈 칸 · 결측 지침 없음(Content 절은 제목 · 열 제목 · 버튼만)                                                                                                                | —                             | https://carbondesignsystem.com/components/data-table/usage/                                                             |
| Atlassian                    | Dynamic table 사용 문서에 칸 단위 빈 값 지침 없음, 표 전체 빈 상태는 Empty state 부품으로 넘김                                                                                                     | —                             | https://atlassian.design/components/dynamic-table/usage                                                                 |
| Shopify Polaris              | 칸 단위 지침 못 찾음. 표 전체가 비면 행 대신 메시지 · 표 본문에 empty state(웹 컴포넌트 table 문서 검색 결과). 옛 polaris-react data-table 쪽은 shopify.dev 로 넘어감                              | —                             | shopify.dev/docs/api/app-home/polaris-web-components/layout-and-structure/table(검색 요약, 원문 미열람)                 |
| Chakra · SEED · 그 밖 패키지 | 코드 · 토큰에 칸 단위 빈 값 기호 규칙 없음(위 각 절)                                                                                                                                               | —                             | 패키지                                                                                                                  |

- 셈: 칸 단위 빈 값 지침이 있는 곳 3(Primer 빈 칸 · GitLab em dash 또는 글 · Semrush n/a), 없음 확인 3(Carbon · Atlassian · Polaris 칸 단위), 막힘 1(Spectrum).
- 빈 값에 쓸 색 토큰을 지정한 곳은 Semrush(`--text-secondary`) 하나.

#### 15. P16 — 게임 · 플랫폼 회사 공개 디자인 가이드 (2026-11-22)

| 곳                       | 결과                                                                                                                                                                                                   | 출처                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Discord 브랜드           | 공식 색 3개뿐: Blurple #5865F2 · Light Blurple #E0E3FF · Black #000000. Nitro 등급 · 부스트 레벨 · 배지 색 없음                                                                                        | https://discord.com/branding                                            |
| Xbox                     | 공개 디자인 시스템 · 색 토큰 문서 못 찾음(브랜드 지침은 파트너 포털 전용이라는 2차 출처). 업적은 사용자가 고르는 개인 색이 알림에 쓰인다는 보도만 있음. 공식 문서는 Gamerscore 규칙(XR-055)뿐, 색 없음 | https://devdocs.xbox.com/publishing/certification/xr/xr-055 · 검색 요약 |
| Duolingo                 | 옛 공개 디자인 가이드(design.duolingo.com/identity/color)가 blog.duolingo.com/hub/design 으로 넘어가 색 목록을 못 봄 — 막힘                                                                            | 301 넘김                                                                |
| Riot Games · PlayStation | 공식 공개 디자인 시스템 · 등급 색 토큰 문서 못 찾음(검색에 나온 Valorant 등급 색은 제3자 추출 사이트라 세지 않음)                                                                                      | 검색                                                                    |
| (참고, 세지 않음)        | 개인 GitHub 의 카지노 화이트라벨 토큰 예 `color/vip/bronze` #CD7F32 … `diamond` #B9F2FF — 공식 DS 아님                                                                                                 | zlatkolazarov-rgb.github.io/design-tokens                               |

- DS 패키지 쪽 결과(위 각 절): 등급 단계 색을 토큰으로 둔 곳은 당근 SEED 매너온도 l1–l10 하나. 금속 이름 토큰은 Fluent 의 `gold` · `platinum`(아바타 색, 등급 뜻 없음) · antd `gold`(색 갈래 이름) · Spectrum `silver`(아이콘 색 갈래)뿐. Primer 는 sponsors 분홍 한 벌, 업적 토큰 없음.
