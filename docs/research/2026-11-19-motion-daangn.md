# 움직임 — 당근(daangn.com) 실제 화면 실측

2026-11-19 확인. 공통 층 3단계 움직임 판의 「당근 안」 재료다. headless Playwright Chromium, 다크(`colorScheme: dark`), PC 1440 · 폰 390. 공개 쪽만 열었다(로그인 화면은 세지 않음). 결정은 하지 않았다.

값 표 전체 · 캡처 · 영상 · 원자료 · 사이트 CSS 사본은 리포 밖 `~/Library/Application Support/Claude/side-session-notes/local_62d468e3-9e48-4bc0-92b1-5b453d512d25/common-layer/stage3/motion/mo-daangn/`(`MEASURE.md` · `cap/` · `vid/` · `raw/` · `css/`)에 있다. 아래는 요약이다.

## 연 곳

| 쪽             | URL                                                                                                         | 폭         |
| -------------- | ----------------------------------------------------------------------------------------------------------- | ---------- |
| 홈             | https://www.daangn.com/kr/                                                                                  | 1440 · 390 |
| 중고거래 목록  | https://www.daangn.com/kr/buy-sell/                                                                         | 1440 · 390 |
| 중고거래 상세  | https://www.daangn.com/kr/buy-sell/ 아래 상품 하나                                                          | 1440       |
| 동네생활 상세  | https://www.daangn.com/kr/community/ 아래 글 하나                                                           | 1440 · 390 |
| 동네업체 상세  | https://www.daangn.com/kr/local-profile/ 아래 업체 하나                                                     | 1440       |
| SEED 공식 문서 | https://seed-design.io/llms/foundations/motion.txt · feedback.txt · feedback/color.txt · feedback/scale.txt |            |

사이트 CSS 는 `_remix/global-DB_WFVbM.css`(SEED 부품 전체 + 옛 체계 carotene) · `_remix/style-6daOogLG.css`(사이트 고유 부품) 두 파일이다.

## 잰 값 요약

| 자리                    | 열림 · 들어감                                                                                                                      | 닫힘 · 나감                 | 실제 화면          |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------ |
| 버튼 올림 · 누름 색     | 배경색만 `.15s` easing(.35,0,.35,1)                                                                                                | 같음                        | 봄                 |
| 눌림 축소               | action-button 만. xsmall .95 · small .97 · medium .97 · large .98, `.15s` (0,0,.15,1)                                              | 놓으면 같은 값으로 1        | 봄(xsmall · small) |
| 메뉴(SEED)              | 150ms enter, 불투명 0 → 1, scale .95 → 1                                                                                           | 100ms exit, scale → .95     | 봄                 |
| 드롭다운(사이트 고유)   | 150ms enter, 위 8px 에서 내려옴                                                                                                    | 150ms exit, 위로 8px        | 봄                 |
| 말풍선                  | 200ms enter, scale .9 → 1                                                                                                          | 200ms easing, 사라짐만      | 봄                 |
| 대화상자(SEED)          | 덮개 100ms enter · 본체 200ms enter-expressive(.03,.4,.1,1), scale 1.3 → 1                                                         | 둘 다 100ms exit(.35,0,1,1) | 봄                 |
| 대화상자(옛 carotene)   | 150ms, scale .95 → 1                                                                                                               | 150ms (.35,0,.95,.55)       | 봄                 |
| 바텀시트(폰)            | 덮개 300ms enter · 시트 300ms enter-expressive, 아래 100% 에서                                                                     | 200ms exit                  | 봄                 |
| 스낵바                  | 150ms enter, scale .8 → 1                                                                                                          | 100ms exit, scale → .8      | 못 봄(CSS 만)      |
| 사이드 패널             | 300ms enter-expressive, 옆 100% 에서                                                                                               | 300ms exit-expressive       | 못 봄(CSS 만)      |
| 탭 밑줄 · 세그먼트 표시 | `.2s` easing 으로 미끄러짐                                                                                                         |                             | 못 봄(CSS 만)      |
| 아코디언                | 높이 · 불투명 `.3s` easing                                                                                                         |                             | 못 봄(CSS 만)      |
| 스켈레톤                | 반짝임 1.5s 무한                                                                                                                   |                             | 못 봄(CSS 만)      |
| 쪽 이동                 | 위 3px 진행 막대(.2s ease), 전환 연출 없음                                                                                         | 막대 `.2s linear` 로 사라짐 | 봄                 |
| 머리 띠                 | PC · 목록은 고정 또는 같이 올라감(움직임 없음). 폰 상세는 내리면 숨고(300ms exit-expressive) 올리면 나타남(300ms enter-expressive) |                             | 봄                 |
| 카드 그림 올림          | 그림 scale 1.05, `.3s` ease                                                                                                        |                             | 봄                 |

PC 의 대화상자 단추가 폰에서는 바텀시트를 연다(같은 「필터」 · 「지역 변경」).

## 공식 문서와 다른 곳

- 눌림 축소: 문서는 세로 2px 거리로 정하고 배율을 `max(높이, 폭÷4, 24)` 에서 계산한다. 사이트는 크기마다 고정 배율이고 action-button 에만 있다. SEED 패키지 base.css 는 `(높이−2)÷높이` 로 또 다르다.
- 문서는 마이크로 모션을 0.2초 이하로 둔다. 사이트 고유 부품에는 토큰 밖 값(ease · ease-out · .18s · .24s · .42s · .55s · (.22,1,.36,1))이 섞여 있다.

## 못 본 것

스낵바 · SEED 셀렉트 · 탭 · 세그먼트 · 아코디언 · 스켈레톤 · 원형 진행 · 사이드 패널 · 알림 대화상자의 실제 재생, View Transitions 를 쓰는 이동, 사진 넘김 곡선, 라이트박스 재생. 공개 쪽에서 해당 부품을 띄우는 곳을 찾지 못했거나 headless 에서 누르지 못했다.
