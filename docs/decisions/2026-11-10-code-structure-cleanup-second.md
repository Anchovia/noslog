# 코드 구조 정리 둘째 묶음

- 상태: 유효
- 날짜: 2026-11-10
- 분야: 구조
- 고른 사람: 사용자(항목마다 안을 고름)

## 맥락

[코드 구조 정리 30항목](./2026-11-10-code-structure-cleanup.md)에서 남긴 20개 가운데 사용자가 14개의 안을 골랐다. 테스트가 없는 채보 에디터 파일, 여러 세션이 함께 고치는 공용 스타일 파일, 동작이 바뀌는 항목이 들어 있어 항목마다 원본과 대조해 확인했다.

## 결정

- 지움: `FilterChips` 의 `hideLabel`, `LineChart` 의 `plotHeight` · `showGrid`, 관리자 확인 뒤에만 그려지는 옛 헤더의 로그인 버튼 분기와 `LocaleSwitcher`.
- 나눔: `LineChart` 좌표 계산, 채보 에디터의 Pixi 그리기와 제스처 빌더, 낙하 뷰어의 그리기와 재생 경로 계산, 영상 가져오기 패널의 표시용 함수. 본문은 그대로 옮겼다.
- 나눔: `foundation.css` 를 묶음 경계대로 `foundation-*.css` 10파일로. 규칙 본문과 순서는 그대로고 `app/globals.css` 가 같은 자리에서 같은 순서로 불러온다.
- 모음: `SegmentedControl` · `MetricSwitch` 의 키 이동 계산, 기여 화면의 Query 키(`features/contributions/api/contribution-query-keys.ts`). 키 값은 그대로다.
- 옮김: `lib` 최상위의 도메인 값 파일 8개. 오락실 · 빙고만 쓰는 4개는 `features/arcades` · `features/bingos` 로, 여러 도메인이 쓰는 4개는 `lib/music` · `lib/profile` · `lib/tiers` 로. `lib/tiers` 의 자켓 주소 재수출은 없앴다.
- 옮김: 설정 서비스 3개와 동기화 토큰 스키마를 `features/profile` 에서 `features/settings` 로. 최근 Discord 재인증 판정은 `lib/recent-discord-verification.ts` 로 옮기고 이름을 뜻에 맞췄다. 세션 칸 이름 `deletionVerification` 은 진행 중인 재인증이 깨지지 않게 그대로 둔다.
- 동작 변경: 악곡 커뮤니티 번역이 홈 공식 소식 번역과 같은 판정으로 다음 모델에 넘어간다. 403 · 404 · 시간 초과 · 네트워크 오류에서도 넘어간다.
- 동작 변경: `scripts/backfill-pattern-metrics.ts` · `scripts/simulate-basic-tier-rating.ts` 가 `prisma/script-env.mjs` 로 환경을 읽는다. 로컬이 아닌 `DATABASE_URL` 은 `DATABASE_EXPECTED_HOST` 가 같은 호스트일 때만 돈다.

## 고르지 않은 안

- 채보 에디터 · 뷰어의 맞히기 판정과 재생 상태까지 나누기 — 테스트가 없는 파일이라 이동만 했다
- `foundation.css` 를 색인 파일로 남기기 — 파일 이름을 든 테스트와 문서를 새 이름으로 맞추는 쪽을 골랐다
- 배포 빌드의 `prisma migrate deploy` 에 호스트 확인 걸기 — `DATABASE_MIGRATION_URL` 을 무엇과 견줄지 규칙이 없어 하지 않았다

## 근거

- 대조: 옮긴 선언 64개가 원본과 토큰 단위로 같다. `lib` 값 파일 8개는 바이트 단위로 같고 import 213항목의 이름 · 별칭 · type 여부가 같다. `foundation-*.css` 를 불러오는 순서대로 이으면 원본과 빈 줄 4개만 다르다.
- 대조: 기여 Query 키는 `hashKey` · `partialMatchKey` 로 바꾸기 전과 같다. 키 이동 계산은 1,080가지 조합, 선 그래프 좌표 계산은 무작위 입력 60,000개에서 옛 코드와 같은 답을 낸다.
- 측정: `npm test` 222파일 · 1,796개 통과(커뮤니티 번역 판정 테스트 11개 더함), `npm run lint` 경고 282개로 같음, `npm run build` · `npm run test:storybook` 통과.
- 실측: 공개 화면 10곳이 바꾸기 전 캡처와 픽셀 단위로 같다(1440 · 다크).

## 바뀌는 곳

- 커뮤니티 「번역 보기」 는 모든 모델이 시간 초과할 때 기다리는 시간이 20초에서 모델 수 × 20초로 늘어난다.
- 배포 환경에 `DATABASE_EXPECTED_HOST` 가 없으면 `vercel-build` 의 패턴 경향 채우기 단계에서 빌드가 멈춘다.
- 공용 스타일을 고칠 때 `foundation.css` 대신 묶음에 맞는 `foundation-*.css` 를 고친다.
