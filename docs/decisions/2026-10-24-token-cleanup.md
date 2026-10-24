# 토큰 정리 — 무채색은 shadcn/ui 그대로 · 포커스 한 겹 · 덧붙인 접근성 정리

- 상태: 유효
- 날짜: 2026-10-24
- 분야: 디자인 · 기초값
- 고른 사람: 사용자(시안 판 1 D · 판 2 B · 판 3 · 판 4 B 추천대로)

## 맥락

회색 이름 38개가 값 16개를 나눠 썼고, 다른 토큰을 그대로 가리키는 별칭이 15개였다. 포커스는 부품마다 일곱 가지 모양이었다(2px 경계 + 바깥 후광 4, 슬라이더 후광 6, 안쪽 1px 더하기 등). 회색 값 13개 중 12개는 Adobe Spectrum 2 다크 회색 단계와 같았고, 늘어난 것은 그 위에 덧붙인 역할 · 별칭이었다.

## 결정

1. 무채색 · 위험 색은 shadcn/ui 기본 neutral 다크 값을 그대로 쓴다. 바탕 #0a0a0a · 카드와 떠 있는 면 #171717 · 누르는 면 #262626 · 입력 면 input/30(흰 4.5%) · 글자 #fafafa · #a1a1a1 · 선 흰 10% · ring #737373 · 주 면 #e5e5e5 · destructive oklch(0.704 0.191 22.216). 대화상자 면은 shadcn dialog 처럼 바탕색이다.
2. 상태도 shadcn 방식이다. 올림은 제 면 색을 낮추거나(secondary/80 · primary/90 · destructive/90) 면 없는 줄에 accent/50 을 겹친다. 고른 목록 줄은 accent, 고른 세그먼트 칸은 input/30 + input 경계. 누름 전용 색은 없다. 비활성은 불투명도 50%.
3. 별칭 · 같은 값 이름을 지운다(`content-interactive · strong · pending · tertiary · placeholder` → default · subdued, `surface-sunken · raised · overlay`, `border-default · subtle · overlay · empty-slot`, `interaction-menu-set · selected-pressed · disabled-*`, `primary-pressed`, `feedback-error-text · destructive-border · danger-marker · message-text`).
4. 포커스는 공용 규칙 하나 — 2px 흰 선 한 겹. 떨어진 요소는 바깥 간격 2, 폭이 꽉 찬 줄 · 탭 · 메뉴 항목 · 칩은 안쪽 −2. 후광 토큰(`--nl-halo-*` · `--nl-state-halo`)과 부품별 포커스 규칙을 지운다.
5. 접근성 항목은 WCAG 2.2 AA 가 요구하거나 시스템 31곳 중 절반 이상이 하는 것만 남긴다. 남김: 글자 4.5 : 1 · 비텍스트 3 : 1 · 포커스 보임 · 머리글에 가리지 않음 · 고대비 모드 · 동작 줄이기 · 글자용 색 따로. 뺌: 버튼 · 입력 후광 4 · 슬라이더 후광 6 · 부품별 포커스 모양. `lib/input-modality.ts` 는 조사하지 않아 그대로 둔다.
6. 예외 하나 — 입력 · 체크박스 · 라디오 경계와 꺼진 스위치 트랙(`border/input`)은 Spectrum 2 입력칸 경계 gray-500 #6d6d6d 를 쓴다(판 4 B). shadcn 의 흰 15% 는 바탕 1.47 : 1 · 카드 1.57 : 1 로 5번에서 남긴 1.4.11(3 : 1)을 못 채운다. #6d6d6d 는 바탕 3.83 · 카드 3.46.
7. 게임에서 온 색(난이도 · 판정 · 분류 · 검정 · 차트)과 고양이 아이콘 색 `identity-mark` 는 이번에 바꾸지 않는다.

## 고르지 않은 안

- 판 1 A Spectrum 2 그대로 — 지금 화면과 거의 같지만 글자 5단계 · 회색 12개라 개수가 크게 줄지 않는다.
- 판 1 B Carbon g100 · C Primer — 주 버튼이 파랑 · 초록이라 새 색이 들어온다.
- 판 4 A shadcn 입력 경계 그대로 — 1.4.11 미달.
- 판 2 A 간격 0 · C 반투명 후광(shadcn · Bootstrap) · D 이중 링(Geist) — 한 겹 + 바깥 간격이 시스템에서 가장 많았다.

## 근거

- 디자인 시스템 31곳(npm 원본 토큰 파일): 읽는 글자 단계 2단계 10곳 · 3단계 9곳 · 4단계 5곳. 포커스 한 겹 20곳(그중 2px 14곳) · 두 겹 4 · 반투명 후광 2 · 섞음 2 · 없음/미확인 3. 올림 다음 단계 색 16 · 반투명 겹침 5 · 섞음 7. forced-colors 있음 13 · 일부 3. 동작 줄이기 있음 17 · 일부 4.
- 실제 서비스 44곳(52곳 시도, 캡차 · 차단 8곳 제외, 헤드리스 1280 실측): 다크 28곳 무채색 수 중앙값 8 · 글자 회색 3 · 선 2. 포커스 직접 만든 한 겹 18 · 브라우저 기본 17 · 안 보임 8 · 두 색(GOV.UK) 1 · 선 + 바깥 후광 0.
- WCAG 2.2: 1.4.3 · 1.4.11 · 2.4.7 · 2.4.11 은 AA, 2.4.13 · 2.3.3 은 AAA.
- shadcn/ui 원본: `apps/v4/registry/themes.ts` · `registry/new-york-v4/ui/*.tsx`(커밋 ffd2257).

## 바뀌는 곳

- 문서: [기초값](../design/foundations.md)의 색 · 색 규칙 · 포커스 · 올림 · 떠 있는 창 · 로딩 · 셸, 부품 문서(버튼 · 입력칸 · 세그먼트 · 폼 컨트롤 · 마크다운 입력 · 수치 띠 · 대화상자 · 태그), 화면 문서(업적 · 악곡 상세 · 프로필)
- 코드: `app/styles/tokens.css` · `foundation.css` 와 화면 CSS, `tailwind-theme.css`, 이미지 색 상수(`lib/metadata/brand-image.tsx` · `features/profile/profile-card-colors.ts` · `lib/music/score-tone.ts`), `app/favicon.ico` · `manifest.ts` · `layout.tsx` · `globals.css`
