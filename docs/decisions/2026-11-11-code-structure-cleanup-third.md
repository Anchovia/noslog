# 코드 구조 정리 셋째 묶음

- 상태: 유효
- 날짜: 2026-11-11
- 분야: 구조
- 고른 사람: 사용자(항목마다 안을 고름)

## 맥락

[코드 구조 정리 둘째 묶음](./2026-11-10-code-structure-cleanup-second.md) 뒤에 남은 7개의 안을 사용자가 모두 골랐다. 공용 스타일의 선택자 목록, API 응답 본문, 파일 삭제가 들어 있어 항목마다 바꾸기 전과 대조했다.

## 결정

- 지움: 재수출만 하던 `app/(site)/tiers/data.ts` · `app/(site)/profile/[id]/data.ts`. 라우트는 `features/tiers/server/public-tier-data` · `features/profile/server/public-profile-data` 를 바로 불러온다.
- 동작 변경: `GET /api/tiers/[slug]/bands/[bandId]` 응답 본문에서 최상위 `band` 를 뺐다. `data.band` 만 남는다.
- 지움: 한 번 쓰고 끝난 스크립트 4개(`prisma/import-op3-exams.mjs` · `prisma/import-op3-bingos.mjs` · `prisma/import-official-tiers.mjs` · `scripts/simulate-basic-tier-rating.ts`)와 `package.json` 의 명령 4줄, 이 스크립트만 읽던 `prisma/data` 의 JSON 2개와 그 테스트 2개.
- 옮김: `ExamBadge` · `ExamBadgeGroup` 과 스토리를 `components/ui` 에서 `features/exams/components` 로. 계정 결과 알림 훅은 `AppToaster` 에서 빼 `app/account-result-notice.tsx` 가 부른다. `components/ui` 가 `features` 를 불러오는 예외 목록은 ESLint 설정에서 없앴다.
- 모음: 빙고 · 오락실 목록의 검색 입력을 `lib/hooks/use-url-search-field.ts` 로.
- 모음: 셀렉트 4곳의 Radix 뼈대를 `components/ui/select-frame.tsx` 로.
- 모음: 이미지 업로드 토큰 발급 6곳의 한도 확인 · 발급 · 반납을 `lib/uploads/image-upload-token.ts` 로.
- 모음: 공용 스타일이 화면 클래스 이름을 나열하던 규칙을 역할 클래스 `nl-focus-inset` · `nl-bleed-row` · `nl-forced-press` 로. 화면의 줄 요소가 이 클래스를 달고, 화면 CSS 4곳에 되풀이되던 넓힌 면 `::before` 는 지웠다. 쓰는 법은 [기초값](../design/foundations.md)에 있다.
- 더함: 훅 테스트용 개발 의존성 `@testing-library/react` · `jsdom`.

## 고르지 않은 안

- 서열표 검색 입력도 훅으로 모으기 — 서열표는 밖에서 바뀐 검색어를 받는 방식이 빙고 · 오락실과 달라, 한 훅으로 합치면 반영 순간에 입력 값이 덮였다. 서열표는 그대로 둔다
- 악곡 목록 검색 입력을 훅으로 옮기기 — react-hook-form 과 스키마로 값을 들고 있어 옮기면 동작이 달라진다
- 역할 클래스 하나로 합치기 — 옛 목록 셋이 서로 다른 요소 집합이라 합치면 걸리지 않던 규칙이 새로 걸린다
- 관리자 2곳 · 동기화 1곳의 넓힌 면 — 색과 포커스 처리가 달라 그대로 둔다
- 이벤트 이미지 업로드(`features/events/server/event-service.ts`) — 고른 범위 밖이라 그대로 둔다

## 근거

- 대조: 역할 클래스로 바꾼 자리는 48줄 · 30파일이고 옛 선택자를 내던 자리 수와 같다. 같은 DOM 에 바꾸기 전 · 후 CSS 를 번갈아 넣어 요소 844개 · 상태 3,376개의 계산된 스타일을 견줬고 차이가 없다(다크, 1440 · 390, 보통 · 고대비, 기본 · 올림 · 누름 · 키 포커스). 역할 클래스만 떼면 차이가 3,099건 나온다.
- 대조: 업로드 토큰 6곳은 한도 키 · 경로 · 공개 여부 · 반납 실패 처리가 바꾸기 전과 같다. 셀렉트 4곳은 Root · Portal · Content 에 주는 값이 같다.
- 측정: `npm test` 222파일 · 1,812개 통과(검색 훅 9개 · 업로드 토큰 13개 더함, 지운 테스트 2파일 뺌), `npm run lint` 경고 282개로 같음, `npm run build` · `npm run test:storybook` 통과.
- 실측: 공개 화면 10곳 가운데 9곳이 바꾸기 전 캡처와 픽셀 단위로 같고, 오락실 목록은 영업 상태 글자만 다르다(1440 · 다크). 빙고 · 오락실 · 서열표 검색 칸에 영문 · 끝 공백 · 한글 조합을 쳐 입력 값과 주소를 확인했다.

## 바뀌는 곳

- 서열표 밴드 API 를 부르는 쪽은 `data.band` 를 읽는다. 리포 안에서 이 응답을 읽는 화면은 없다.
- 화면에 누르는 줄을 새로 만들 때 공용 스타일의 목록에 클래스를 더하지 않고 그 요소에 역할 클래스를 붙인다.
- `npm run db:import:exams:op3` · `db:import:bingos:op3` · `db:import:tiers:official` · `simulate:rating:basic` 명령이 없다.
