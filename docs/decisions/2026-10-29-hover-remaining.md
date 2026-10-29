# 필터 목록 · 고르기 창 · 고대비 · 악곡 카드 · 관리자 올림

- 상태: 유효
- 날짜: 2026-10-29
- 분야: 디자인 · 기초값
- 고른 사람: 사용자(추천대로 — 판 11–15 모두 안 A)

## 맥락

올림 전수 조사에서 가이드에 규칙이 없거나 문서끼리 다른 곳 다섯이 남았다. 필터 레일 체크 목록(줄 면이 체크 상자에 붙음), 고르기 창 줄(안쪽 4), 고대비 모드(올림이 보이지 않음), 악곡 카드(누르는 카드인데 반응 없음, foundations.md 와 surface-card.md 가 다름), 관리자 화면 9곳(올림이 제각각)이다.

## 결정

1. 필터 레일 체크 목록(`SelectionList`)은 줄에 올림 면을 깔지 않는다. 올림 · 누름 · 키 포커스에 체크 상자 경계와 글자만 `content/strong`, 체크한 상자는 `primary/hover` 다. 체크 상자는 그룹 제목 선에 그대로 둔다.
2. 고르기 창 줄은 안쪽 좌우 12 다. 키보드 위치 면은 키보드로 움직일 때만 칠한다.
3. 고대비 모드에서 버튼 · 메뉴 항목 · 누르는 줄은 올림 · 누름에 면 `Highlight` · 글자 `HighlightText` 다(평소 면과 글자색을 맞바꿈).
4. 악곡 카드 · 채보 줄은 홈 이동 칸과 같은 한 단계 면이라 올림 · 누름 · 키 포커스에 `surface/control-hover` 다. foundations.md 올림 표의 「누르는 카드(악곡)」 를 면 있는 것 줄로 옮긴다.
5. 관리자 화면은 모양 · 배치를 바꾸지 않고 올림 · 누름 · 키 포커스만 공개 가이드 값에 맞춘다.
    - 대시보드 수치 칸 · 셀렉트 · 번역 칸 · 「채보 추가」 칸은 면 `surface/control-hover` · 글자 `content/strong`, 처리할 일 줄 · 공지 목록 줄 · 펼침 줄은 좌우를 넓힌 줄 면, 고른 탭은 글자 `content/strong`, 신고 카드 · CSV 링크는 단독 링크(밑줄 + `content/strong`)다.
    - 맨 체크박스는 브라우저 기본 부품이라 CSS 로 경계 색을 바꿀 수 없어 그대로 둔다(공용 체크박스로 바꾸는 것은 재설계라 하지 않음).

## 고르지 않은 안

- 판 11 B 줄 폭 면 · 안쪽 8(Steam), C 둥근 면 · 안쪽 12(Thunderstore · Spectrum 2 ListView).
- 판 12 B 열자마자 첫 줄 칠함(문서 검색 창 다수 · Atlassian · Ant Design), C 안쪽 16 · 모서리 0(MUI · Carbon).
- 판 13 B Highlight 테두리(GOV.UK · Carbon), C 변화 없음(Steam · Apple 등).
- 판 14 B 그림자(Spectrum 2 Card · Ant), C 변화 없음(멜론 · 벅스 · AllMusic · itch.io).
- 판 15 B 관리자는 그대로.

## 근거

- 판 11: 실제 서비스 33곳 중 29곳, 디자인 시스템 9곳 중 6곳이 줄 면 없이 체크 상자 · 글자만 반응(Amazon · Metacritic · Spectrum 2 CheckboxGroup · Carbon). 면 있는 표본은 적어 여백 값은 근거 약함.
- 판 12: 실제 서비스 33곳 · 디자인 시스템 9곳 중 안쪽 12 가 가장 많음(실제 16 · 디자인 시스템 3). 마우스로 열 때 첫 줄 칠하기는 실제 다수(대부분 같은 문서 검색 부품), 디자인 시스템 5/9 는 칠하지 않음(Spectrum 2 ComboBox · Carbon · MUI). 기존 셀렉트 목록 규칙(foundations.md 「포커스」)과 같게 했다.
- 판 13: 실제 서비스 34곳 · 디자인 시스템 6곳, 요소 127개. 디자인 시스템 대부분이 고대비 올림을 남김(Spectrum 2 버튼 · Fluent 2 메뉴는 시스템 색 면). Fluent 문서는 올림 · 누름에서 평소 면과 글자색을 맞바꾼다고 적는다.
- 판 14: 실제 서비스 30곳 · 디자인 시스템 8곳. 반응하는 곳 가운데 면 한 단계가 가장 많음(Steam · Spotify · Deezer). 면 있는 카드 표본은 8곳이라 근거 약함.

## 바뀌는 곳

- 문서: `docs/design/components/filter.md` · `docs/design/components/dialog.md` · `docs/design/foundations.md`(올림 표 · 고대비 줄) · `docs/design/components/surface-card.md`
- 코드: `app/styles/foundation.css`(SelectionList 올림 · 고르기 줄 안쪽 · 고대비 올림), `app/styles/entity.css`(악곡 카드 올림), `app/styles/admin.css` · 관리자 화면 tsx 9개(관리자 올림)
