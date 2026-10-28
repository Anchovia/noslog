# 글자 계층은 본문 16 계열 · 세그먼트 · 전체 화면 창 · 칩 · 필터 창 글자

- 상태: 유효
- 날짜: 2026-10-28
- 분야: 디자인 · 기초값
- 고른 사람: 사용자(시안 5판 · 6판)

## 맥락

[운영보다 나빠진 자리](./2026-10-27-production-regression-fixes.md)에 이어지는 결정이다. 그 결정에서 보기 전환 세그먼트는 따로 정하기로 했다.
[부품 토큰 Spectrum 2](./2026-10-27-spectrum-components.md)의 글자 단계는 쪽 제목 36(한국어 · 일본어 32) · 구역 제목 28(25) · 상자 제목 24 에 본문 14 였다. 필터 전체 화면 창은 창 제목과 필터 묶음 제목이 같은 24 였다.
세그먼트 · 전체 화면 창은 Spectrum 2 모양, 칩은 2026-10-26 모양이었다. 시안 5판 · 6판에서 자리마다 골랐다.

## 결정

1. 글자 계층은 본문 16 계열이다. 값은 모두 기존 토큰이고 `tokens.css` 글자 클래스에 있다.
    - 쪽 제목 24/32 bold, 1056 이상 32/40. 한국어 · 일본어도 같다.
    - 절 제목 20/28 bold. 헤더 이름 「NosLog」 도 절 제목을 쓴다.
    - 부품 제목(`nl-component-title`) 16/24 semibold. 개체 제목은 16/24 semibold 그대로다.
    - 본문 · 보조 본문 16/24. 읽기 본문은 16 이고 줄 높이는 그대로다.
    - 메타 12/16 regular. 컨트롤은 14 그대로다.
    - 쪽 제목 바로 아래 설명 줄(`p` 또는 `nl-metadata`)은 16/24 regular 다.
2. 보기 전환 · 세그먼트는 MangaDex 방식이다. 판은 `surface/surface` · 모서리 `radius/control` · 선 없음, 칸은 모서리 `radius/small` 이다. 고른 칸은 `surface/control` 면 + `content/strong` 글자이고, 안 고른 칸은 `content/subdued` 다. 2px 흰 링과 경계는 없앤다.
3. 전체 화면 창(`FullScreenDialog`, 필터 · 피드백 등)은 GitHub 필터 창 방식이다. 창 면은 `surface/canvas` 이고, 머리 아래 · 발 위에 1px `border/divider` 선을 둔다. 폰에서 입력 칸이 있는 `ModalDialog` 가 전체 화면으로 열릴 때도 같은 면 · 구분선 · 창 제목 글자(5번)를 쓴다.
4. 칩은 `surface/control` 면 · 둘레 없음 · 모서리 `radius/control` 이다. 고른 칩은 `surface/tag` 면 + `content/strong` 이고, 올림 · 누름도 같은 면이다. 비활성 칩은 글자만 `content/disabled` 다.
5. 필터 창 글자는 야놀자 필터 시트를 그대로 옮긴다. 전체 창 제목 20/24 bold, 필터 묶음 제목(`.nl-filter-group__head .nl-component-title`) 16/20 bold, 칩 글자 14/18 regular 다.
6. 자켓이 있는 목록 카드(악곡 · 과제곡 · 빙고 등)의 면은 검토했고 그대로 둔다. 한 덩어리로 누르는 카드라 [면 카드](../design/components/surface-card.md)의 쓰는 곳에 맞고, 면은 [운영보다 나빠진 자리](./2026-10-27-production-regression-fixes.md) 1번 값이다.

## 고르지 않은 안

- 세그먼트 고른 칸 = 입력 면 + 2px 흰 링(Spectrum 2) — 사용자가 MangaDex 방식으로 바꿨다.
- 전체 화면 창 = 대화상자와 같은 떠 있는 면 · 구분선 없음(Spectrum 2) — 사용자가 GitHub 필터 창 방식으로 바꿨다.
- 칩 = 바탕 면 + 1px 둘레 · 알약, 고른 칩 `surface/control`(2026-10-26) — 사용자가 GitHub 필터 창 방식으로 바꿨다.
- 필터 창 글자 창 16–18 > 구역 13–14 굵게 — 실측에서 가장 많았으나(24곳 중 12곳) 사용자가 야놀자 관계를 골랐다.
- 필터 창 글자 창 = 구역 = 24(직전 개발 상태) — 실측 24곳 중 0곳이다.

## 근거

- 글자 계층: 시안 5판의 출처는 Spectrum 2 Body M(디자인 시스템) · 당근 · velog · note(실제 서비스)다. 표본 수는 이 파일에 옮기지 않았다(미확인).
- 세그먼트: MangaDex 보기 전환 한 곳의 구현이다. 근거 약함.
- 전체 화면 창 · 칩: GitHub 필터 창 한 곳의 구현이다. 근거 약함.
- 필터 창 글자 실측 50곳: 실제 서비스 한국 16 · 해외 19 · 일본 · 게임 15곳, 디자인 시스템 10곳. 390 시트에서 창 제목과 구역 제목이 함께 있는 24곳의 관계는 다음과 같다.
    - 창 16–18 > 구역 13–14 굵게: 12곳
    - 창 18–20 > 구역 15–17: 6곳(야놀자 · 원티드 · Coursera · Shopify · Udemy · Indeed)
    - 창 = 구역: 4곳
    - 창 22 > 구역 20: 1곳(당근)
    - 구역 > 창: 1곳(Airbnb)
    - 창 = 구역 = 24: 0곳

## 바뀌는 곳

- 문서: [기초값](../design/foundations.md) 색 · 색 규칙 · 글자 · 모서리, 부품 [세그먼트](../design/components/segmented-control.md) · [필터](../design/components/filter.md) · [대화상자](../design/components/dialog.md), 화면 [악곡 목록](../design/pages/music-list.md)
- 코드(CSS): `app/styles/tokens.css` · `app/styles/foundation.css` · `app/styles/discovery.css` · `app/styles/filters.css`
