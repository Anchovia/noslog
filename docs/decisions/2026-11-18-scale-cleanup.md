# 규모에 비해 없어도 되는 코드 정리

- 상태: 일부 대체됨(고르지 않은 안 관리자 재설계가 남긴 코드) → [관리자 재설계가 남긴 코드 정리](./2026-11-18-admin-leftover-cleanup.md), (고르지 않은 안 Playwright e2e · Storybook 줄이기 · 손 이름 검사를 맡긴 e2e axe) → [CI · e2e 덜어내기](./2026-11-18-ci-e2e-trim.md)
- 날짜: 2026-11-18
- 분야: 구조
- 고른 사람: 사용자(추천대로)

## 맥락

「NosLog 가 과설계다」 라는 지적을 받아, 사용자 약 1,000명 · 월 함수 호출 15만 건 규모에서 없어도 같은 결과가 나오는 코드 · 의존성 · 개발 도구를 찾았다. 코드 · 의존성 · 서버 · 개발 도구 네 갈래에서 후보 64개(겹침 포함)를 모아 고를 판 11개와 그대로 목록 36개로 나눴다.

## 결정

- 지움: 쓰는 곳이 없는 의존성 `nuqs` 와 `AppProviders` 의 `NuqsAdapter` 감싸기.
- 지움: 앱이 부르지 않는 `GET /api/tiers/[slug]/bands/[bandId]` 라우트와 `features/tiers/api/tier-bands.ts`, 이 라우트만 쓰던 서버 함수 · 응답 타입과 그 테스트.
- 지움: 테스트만 부르던 `features/sync/server/sync-summary-data.ts` · `lib/music/judgement-stats.ts` · `getUserTierListProgress` · `getBingoEditorCellPrefix` 와 그 테스트.
- 바꿈: `Badge` 의 변형 클래스를 객체 맵으로 바꾸고 의존성 `class-variance-authority` 를 뺐다. 나오는 클래스는 같다.
- 지움: 쓰는 곳 없는 상수 `BASIC_RATING_TIER_MODE` · `BASIC_RATING_TIER_GOAL`, 자기 파일 안에서만 쓰는 스키마 · 상수 3개의 `export`, `AdminFieldError` 를 다시 내보내기만 하던 `bingo-field-error.tsx` · `exam-field-error.tsx`, `Avatar` 의 `fallbackInitial` · `initialClassName`, 코드가 읽지 않는 env 스키마 칸 `BLOB_STORE_ID` · `BLOB_WEBHOOK_PUBLIC_KEY`.
- 지움: e2e 도우미 `expectAccessiblePageStructure` 의 손 이름 검사. 링크 · 버튼 이름은 axe 규칙이 본다.

## 고르지 않은 안

- 관리자 재설계(2026-11-17)가 남긴 카드 7개 · `Badge` · `listAdminMusic` · `AdminSubmitButton` 지우기 — 일부러 남겼는지 리포에 적혀 있지 않아 추천 없이 두었고 고르지 않았다
- Playwright e2e · Storybook 줄이기 — 이 판에서는 그대로를 추천했다. 다른 서비스 구현을 보고 다시 고르는 판을 따로 만든다
- Server Action 넘김 래퍼 95개를 서비스로 합치기 — 서비스 export 전체가 공개 POST 입구가 된다
- 응답 Zod 스키마의 브라우저 쪽 검사 빼기 — 배포 사이 응답 모양이 어긋날 때 오류 상태 대신 깨진 화면이 보인다

## 근거

- 측정: 앱 코드(`app` · `features` · `components` · `lib`) 141,083줄 가운데 지워도 결과가 같은 코드는 약 1,300줄이었다. `nuqs` 는 git 기록 전체에서 훅을 쓴 적이 없다. 서열표 구간 API 를 불러오는 앱 코드는 2026-10-08 뒤로 없다.
- 측정: 손 이름 검사는 svg `aria-label` 을 읽지 못해 2026-11-17 CI 두 번에서 20개씩 잘못 실패했고, 실제 문제를 잡은 기록은 없었다.
- 캐시 · 한도 · 집계 표 · 상태 도구 · 마이그레이션 검사는 규모가 아니라 정확성 · 남용 방지 · 외부 약속 때문에 있어 그대로 둔다.

## 바뀌는 곳

- 코드: `components/providers/app-providers.tsx` · `components/ui/badge.tsx` · `components/ui/avatar.tsx` · `features/tiers/server/public-tier-data.ts` · `lib/tiers/tier-scope.ts` · `lib/env/server.ts` · `e2e/helpers.ts` · `package.json`
- 리포 밖에서 `/api/tiers/[slug]/bands/[bandId]` 를 부르면 404 를 받는다. 관리자 통계의 라벨 줄은 지난 90일 호출 수를 보여 주려고 남겼다.
