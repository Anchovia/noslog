# 부품 모서리를 당근 기준선으로 — 상자 16 · 입력칸 12 · 칩 · 셀렉트 · 쪽 번호 원

- 상태: 유효
- 날짜: 2026-11-26
- 분야: 디자인 · 기초값
- 고른 사람: 사용자(공통 층 3단계 부품 기준선, 2026-11-13 판)

## 맥락

부품 모서리는 2026-11-13 에 당근 실제 화면 계산값을 기준선으로 정했고 Figma 에는 반영됐다. 코드와 가이드는 옛 Spectrum 값(4 · 8 · 10 · 16 · 원) 그대로였다. 색 반영이 끝나 같은 파일을 고칠 수 있게 됐다.

## 결정

1. 상자(둥근 면 묶음)는 16, 입력칸은 12, 보조 버튼은 8로 둔다.
2. 칩 · 고르는 칸 그릇과 안 칸 · 셀렉트 · 검색칸 · 쪽 번호 숫자와 앞뒤는 끝까지 둥글게 한다.
3. 토큰은 `--nl-radius-box` 16 · `--nl-radius-field` 12 두 개만 더한다. 기존 다섯 토큰의 값은 바꾸지 않는다. 값을 바꾸면 메뉴 판 · 팝오버 · 토스트 · 대화상자 · 악곡 카드 같은 결정 밖 자리가 함께 바뀐다.
4. 결정 밖 자리는 지금 값을 그대로 둔다. 떠 있는 창은 `radius/large` 10, 대화상자는 `radius/overlay` 16, 악곡 카드 · 홈 소식 카드 · 수치 띠 · 상자 안 판은 `radius/control` 8이다.
5. 주 버튼 large 52 의 모서리 12 는 큰 크기가 생길 때 적용한다. 지금 코드에 52 주 버튼이 없어 이번 반영에서 12 를 쓰는 버튼은 없다.

## 고르지 않은 안

- 기존 토큰 값을 바꾸기 — 결정 밖 자리가 함께 바뀐다
- `nl-button--primary` 전부 12 — 12 는 변형이 아니라 크기를 따르는 값이고 한 줄 짝 주 버튼은 8이다

## 근거

- 당근 실제 화면 계산값: 상자 16 · 입력칸 12 · 보조 버튼 8 · 칩 · 셀렉트 · 검색칸 · 쪽 번호 원([조사 기록](../research/2026-11-25-lone-control-height.md)은 주 버튼 12 만 다룬다)
- 이 폴더 밖 공유 노트의 `RADIUS-CHECK.md` · `AUDIT-baseline.md` 는 비공개라 값만 위에 옮겼다.

## 바뀌는 곳

- 문서: `docs/design/foundations.md` 「모서리」 표, 부품 문서의 모서리 줄(surface-card · segmented-control · pagination · filter · field), 화면 문서의 상자 모서리 줄(exams · arcades · bingo · chart-viewer · sync · music-detail)
- 코드: `app/styles/tokens/borders.css`, `lib/design-token-values.ts`, `app/styles/components/{input,select,compact-select,chip,segments,pagination,surface-card,disclosure}.css`, 상자 모서리를 쓰는 화면 CSS(community · home · music-detail · exams · arcades · chartViewer · bingos · sync)
