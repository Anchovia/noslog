# 파운데이션 구성 — 토큰 2층 · 종류별 토큰 파일 · 부품마다 CSS 파일

- 상태: 유효
- 날짜: 2026-11-11
- 분야: 구조
- 고른 사람: 사용자(시안 14판과 이름 3건을 안마다 고름)

## 맥락

토큰이 `tokens.css` 한 파일에 글자 클래스 규칙과 함께 있었고, 공용 부품 CSS 는 `foundation-*.css` 10파일과 `search.css` · `filters.css` · `data-charts.css` 에 흩어져 있었다. 쓰는 곳이 없는 토큰 · Tailwind 별칭, 같은 선언을 되풀이하는 화면 클래스, 코드와 다른 주석도 남아 있었다.

## 결정

- 지움: 참조 없는 토큰 8개(`--nl-interaction-hover` · `--nl-type-line-height-detail` · `--nl-type-size-25` · `-28` · `-36` · `--nl-type-line-height-36` · `-38` · `-42`)와 쓰는 곳 없는 Tailwind 별칭 18개. `--nl-type-size-28` 은 프로필 공유 카드의 「NosLog」 글자만 값 사본으로 쓰고 있어, 그 글자를 24 로 바꾸고 지웠다.
- 모음: `nl-body` · `nl-body-secondary` 는 선택자를 묶어 선언 한 번. 순위 변수 4개는 `global-rankings.css` 한 규칙. 동기화 미리보기 줄은 `nl-bleed-row`(키 포커스 선이 넓힌 면 안쪽으로 옮겨 간다). 프로필 기록 줄과 관리자 목록 3곳은 제 규칙 그대로.
- 모음: 레이아웃만 하던 화면 클래스 42개를 도우미 클래스로. 세로 쌓기는 `nl-stack` 에 `nl-stack--4` · `--8` · `--12` · `--24` · `--32` · `--section` 을 함께 붙이고, 가로 줄은 `nl-inline`, 말줄임은 `nl-truncate`. 다른 선택자 · 테스트가 부르거나 딸린 요소 클래스가 있는 21개는 이름을 남기고 도우미 클래스를 더했다.
- 토큰 층: 무채색 역할 토큰이 회색 단계 토큰 `--nl-gray-25` … `--nl-gray-1000`(Spectrum 2 다크 13단계)을 가리킨다. 화면 · 부품 CSS 는 단계 토큰을 직접 쓰지 않는다. 도메인 색(난이도 · 판정 · 차트 · 등급)과 툴팁 면 · 가림막은 값 그대로.
- 토큰 파일: `app/styles/tokens/` 에 `colors` · `typography` · `size` · `borders` · `shadow` · `animations` · `levels` 일곱 파일(Elastic EUI 의 이름 한 벌). 글자 클래스는 `app/styles/typography.css`.
- 부품 파일: 공용 부품 CSS 는 `app/styles/components/` 에 클래스 블록마다 파일 하나. 고대비 · 움직임 규칙도 그 부품 파일에 둔다. 셸 기본값 · 포커스 · 여러 부품에 걸친 규칙은 `base.css`, 여러 부품에 걸친 고대비 규칙은 `forced-colors.css`, 도우미 클래스는 `utilities.css`. 기능 한 곳만 쓰는 규칙(`nl-my-best` · `nl-grade-progress` · `nl-step-bar` 고대비 등)은 화면 CSS 로.
- 순서: `@layer` 를 들이지 않고 `app/globals.css` 의 import 순서로 우선순위를 정한다. `forced-colors.css` 와 `components/search.css` · `unit-input.css` 는 옮기기 전과 같은 차례가 되는 자리에 둔다.
- 검사: 참조 없는 토큰이 있으면 테스트가 실패한다. 이름을 조합해 쓰는 토큰 3개만 이유와 함께 예외 목록에 둔다.

## 고르지 않은 안

- 토큰 한 파일 유지 — 조사 세션 추천이었지만 사용자가 종류별 파일을 골랐다
- 토큰 파일 Primer 한 벌(6파일) · Polaris 한 벌(9파일) — 색 · 글자 파일 이름이 조사에서 가장 흔한 쪽인 EUI 한 벌을 골랐다
- 회색 단계 12단계 · 1–12 번호 — 흰색을 쓰는 역할이 단계를 가리키지 못하거나, 주석의 Spectrum 단계 이름과 어긋난다
- 도우미 클래스 숫자 접미사(`nl-stack-8`) — 지금 공용 클래스의 변형 표기(`--`)와 다르다
- `@layer` 도입 — 조사한 디자인 시스템 28곳 중 11곳이 import 순서 · 변수만으로 정한다

## 근거

- 조사: [파운데이션 구성 조사](../research/2026-11-11-foundation-structure.md) — 디자인 시스템 28곳 · 실제 서비스 63곳, 파일 이름은 디자인 시스템 16곳 · 공개 서비스 9곳
- 파일 이름: 색 `colors` 13곳 · `color` 6곳, 글자 `typography` 9곳 · `font(s)` 7곳, 모서리 · 테두리 파일을 따로 두는 곳 12곳
- 측정: 컴파일한 CSS 를 선언 단위로 앞뒤 대조해 달라진 것이 위 항목뿐임을 확인했다. 부품 파일로 옮기기 앞뒤는 화면 42개에서, 도우미 클래스 앞뒤는 화면 70개(요소 47,124개)에서 계산값 · 위치 · 크기가 같았다

## 바뀌는 곳

- 문서: `docs/design/foundations.md` 의 머리말 · 「색」 · 「토큰 · 공용 부품으로만」 · 「포커스」 · 「움직임」, `docs/design/README.md` 「어디에 무엇이」, `docs/ui/README.md`, `AGENTS.md`
- 코드: `app/styles/tokens/` · `app/styles/typography.css` · `app/styles/base.css` · `app/styles/utilities.css` · `app/styles/components/` · `app/globals.css`, 도우미 클래스로 바꾼 화면 CSS 와 TSX
- 테스트: `tests/design-foundation.test.ts`(회색 단계 · 참조 없는 토큰), `tests/helpers/design-tokens.ts`
