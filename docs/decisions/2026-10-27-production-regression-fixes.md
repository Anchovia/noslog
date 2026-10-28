# 운영보다 나빠진 자리 — 면 단계 · 헤더 · 푸터 · 버튼 · 고른 줄 · 탭

- 상태: 일부 대체됨(3 큰 버튼 줄의 아이콘 버튼 높이) → [2026-10-28 전수 검수](./2026-10-28-audit-fixes.md)
- 날짜: 2026-10-27
- 분야: 디자인 · 기초값
- 고른 사람: 사용자(1 · 2 · 3 · 4 추천대로, 5 는 추천 대신 운영 방식)

## 맥락

[부품 토큰 Spectrum 2](./2026-10-27-spectrum-components.md)로 부품마다 S2 기본값을 붙이면서 운영(noslog.app)보다 나빠진 자리가 생겼다. 홈 이동 칸 · 악곡 카드가 #2c2c2c · #222 + 그림자로 밝아지고 카드 안 난이도 칩까지 면이 생겼다. 헤더는 바탕과 같은 면에 선이 없는데 푸터만 위 선이 있었다. 버튼은 원 끝인데 세그먼트 · 고스트는 사각이라 한 줄 안 모서리가 엇갈렸고, 보조 버튼은 1280 에서 40 에서 32 로 낮아졌다. ≡ 창에서 지금 화면 칸 강조가 사라졌고, 1280 더 보기 메뉴는 판 위쪽이 헤더 밑에 잘렸다. 1단 탭은 줄 아래 선이 없고 고른 탭도 400 이라 고름이 약했다.

운영과 지금 개발 화면을 같은 폭으로 나란히 찍고, 실측한 서비스 규칙을 지금 `tokens.css` 토큰만으로 입혀 비교한 시안에서 골랐다. 새 색 · 모서리 · 크기는 만들지 않았다.

## 결정

1. 면 단계(한 단계 면): 홈 이동 칸 · 악곡 카드 · 홈 공식 소식 카드(와 그 자리를 대신하는 소식 상태 상자)는 면 `surface/surface` · 둘레 · 그림자 없음 · 모서리 `radius/control` 이다. 홈 이동 칸의 올림 · 누름은 `surface/control-hover` 그대로다. 카드 안 난이도 판 `nl-level` 은 면 없이 난이도 글자색만이다.
2. 헤더 · 푸터(Steam): 헤더와 푸터는 둘 다 면 `surface/surface` 이고, 헤더 아래 · 푸터 위에 선이 없다.
3. 버튼(사각 통일): 버튼은 모든 변형(주 · 보조 · 고스트 · 위험 · 아이콘 버튼 · 필터 아이콘 트리거) 모서리 `radius/control` 이다. 주 · 보조 · 위험 버튼의 기본 크기는 모든 폭 `--nl-control-height-large`(Spectrum 2 Button L)이고, 고스트 · 아이콘 버튼은 줄의 `--nl-control-height` 그대로다. 고스트 글자는 `content/strong` 이다. 검색칸은 원 끝 그대로 두고, 보기 전환 세그먼트는 따로 정한다.
4. 지금 위치 · 고른 줄(Apple Music 사이드바): ≡ 창(넓은 폭 더 보기 메뉴 포함)의 지금 화면 줄과 메뉴(셀렉트 목록 · 정렬 메뉴 · 검정 선택 목록)의 고른 줄은 면 `surface/control` · 굵기 600 · 모서리 `radius/control` 이다. 체크 표시는 그대로 둔다. 넓은 폭 더 보기 메뉴는 중간 폭과 같이 헤더 아래 8 에 열린다(판 위쪽이 헤더 밑에 잘리던 오류).
5. 밑줄 탭(운영 방식): 1단 탭은 줄 폭을 똑같이 나눠 채우고(항목 좌우 안쪽 8 · 표시선 = 항목 폭) 줄 아래에 1px `border/divider` 선을 둔다. 탭 글자는 고른 것 `content/default` · 600 + 밑 표시, 안 고른 것 `content/subdued` · medium 이다(2단 탭도 같은 굵기).

## 고르지 않은 안

- 1 선으로 나눔(GitHub · Linear · Raycast) — 칸 · 카드 면을 바탕과 같게 두고 1px 선으로 나눈다. 칸 구분은 면으로 하기로 한 [무채색 Spectrum 2](./2026-10-27-spectrum-neutrals.md) 7번과 맞지 않는다.
- 2 GitHub(헤더만 면 + 아래 1px 선, 푸터는 바탕 · 선 없음) — 헤더와 푸터의 규칙이 다시 갈린다.
- 3 원 끝 통일(YouTube · Spotify) — 검색칸 · 필터 · 칩 · 버튼 모두 원 끝, 고른 칩은 반전 면. 세그먼트 · 메뉴 항목 · 입력의 사각 모서리와 화면 전체가 갈린다.
- 5 SoundCloud(글자 폭 탭 · 줄 아래 선 · 모두 semibold) — 사용자가 운영 방식(줄 폭 나눔 · 고름만 600)을 골랐다.

## 근거

- 실제 서비스(다크 · 1280, 시안 원자료): 카드를 바탕보다 밝은 면으로 나눔 두 묶음 15곳 중 6곳 · 10곳 중 5곳(Lichess · osu! · op.gg · Apple Music · Vercel · Spotify 등), 선으로 나눔 0곳 · 4곳(GitHub · Linear · Raycast · Apple TV). 카드 안 회색 칩 면은 9곳 중 1곳(Twitch).
- 헤더 · 푸터: 헤더와 푸터가 같은 규칙인 곳은 Steam 하나(둘 다 면, 선 없음). 푸터 위 선은 16곳 중 1곳(Linear). 디자인 시스템 6곳 중 5곳은 헤더 아래 선. 근거 약함.
- 모서리: 실측한 곳 모두 한 줄 안 모서리 규칙이 같았다(사각 GitHub · Steam · op.gg · Carbon · shadcn, 원 끝 YouTube · Spotify).
- 고른 줄: 세로 내비 3곳(Lichess · Apple Music · ScoreSaber) 모두 면 채움. 근거 약함.
- 운영 실측(Playwright, noslog.app, 2026-10-27): 1단 탭 = 줄 폭 4등분 · 높이 48 · 항목 좌우 8 · 줄 아래 1px #323232(inset) · 고름 #dbdbdb 600 · 안 고름 #afafaf 500 · 표시선 2px. 2단 탭은 같은 굵기에 줄 아래 선 없음. 1280 버튼 · 검색칸 · ≡ 40, 더 보기 메뉴 판 위 = 헤더 아래 8.
- 시안: [운영 대비 대조](https://claude.ai/artifact/PHVuJHWzPyRKfsecTRaAhd)(비공개 · 위 숫자를 옮겨 적음).

## 바뀌는 곳

- 문서: [기초값](../design/foundations.md) 색 · 색 규칙 · 글자 · 모서리 · 높이 · 셸 · 헤더 메뉴, 부품 [버튼](../design/components/button.md) · [밑줄 탭](../design/components/tabs.md) · [목록 · 메뉴](../design/components/menu.md) · [면 카드](../design/components/surface-card.md), 화면 [악곡 목록](../design/pages/music-list.md)
- 코드(CSS): `app/styles/foundation.css` · `app/styles/layout.css` · `app/styles/home.css` · `app/styles/entity.css` · `app/styles/filters.css` · `app/styles/search.css` · `app/styles/exams.css`
