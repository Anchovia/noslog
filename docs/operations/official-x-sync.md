# 공식 X 소식 수집 운영

2026-09-19 사용자 결정: 최신 글 ID 이후만 12시간 주기로 확인하고, 홈 요청에서는 X·Gemini를 호출하지 않는다.

## 구조와 비용

- 홈의 `getOfficialXLatestPost()` 계약은 그대로다. `OfficialXFeed` 한 행의 최신 원문·번역을 Next 데이터 캐시로 읽는다. 캐시가 비거나 공지 저장으로 무효화돼도 DB 읽기만 수행한다.
- 수집 주소는 `GET /api/cron/official-x`. 별도 `OFFICIAL_X_SYNC_SECRET` Bearer 인증이 필수다. 로그인·관리자 세션과 무관하며 개인정보 Cron의 비밀키를 공유하지 않는다.
- 최초에는 최근 5개(API 최소값)를 요청해 최신 1개만 보관한다. 이후 `since_id`로 저장된 최신 ID보다 새 글만 요청한다. 과거 글 아카이브·페이지네이션은 하지 않는다.
- 새 글 원문을 먼저 저장하고 번역한다. 성공한 한국어·영어 번역은 원문과 함께 보관하며 기간 만료로 재번역하지 않는다. 번역이 없으면 원문 표시를 유지하며 다음 예약 실행에서 재시도한다. Gemini 키가 없으면 원문만 저장한다.
- 변동 없는 게시글·번역문은 UPDATE하지 않는다. 중복 실행을 막는 `last_attempt_at`은 주기당 한 번 기록하고, 기존 X 호출 통계 기록도 남긴다. 따라서 변경 없을 때 **DB 쓰기 0회**라는 뜻은 아니다.
- UTC 00–12시 / 12–24시 구간마다 DB의 원자적 UPSERT로 한 작업만 허용한다. 같은 구간의 중복 호출은 API 호출 전에 종료한다. 오류·시간초과도 해당 구간을 소비해 다음 구간까지 자동 재호출하지 않는다. 경계 직전 실행은 3분 간격 보호를 추가하고, 내용 저장 시 실행 소유권을 다시 확인한다.
- X 실패 시 기존 저장 내용을 지우지 않는다. DB/수집 미초기화는 기존 오류 상태, 수집에 성공했지만 글이 없는 경우만 기존 빈 상태로 표시한다.
- Gemini SDK 자체 재시도는 끈다. 기존 3개 모델 전환은 429/5xx에서만 순서대로 시도하고, 모델별 20초 제한을 둔다. 수집 API 최대 실행 시간은 120초다.

## 배포 준비 — 사용자가 수행

1. 이 변경의 마이그레이션 `prisma/migrations/20260919120000_official_x_feed/migration.sql`을 검토한다. 기존 운영 배포는 `prisma migrate deploy` 후 빌드하는 구성이다. 에이전트는 운영 마이그레이션·수집을 실행하지 않았다.
2. Vercel Production에 기존 `X_BEARER_TOKEN`, 선택 `GEMINI_API_KEY`, 새 **32자 이상 무작위 `OFFICIAL_X_SYNC_SECRET`**을 설정하고 배포한다. 기존 개인정보 정리의 `CRON_SECRET`과 다른 값을 쓴다.
3. GitHub 저장소 Settings → Secrets and variables → Actions에 Secret `OFFICIAL_X_SYNC_SECRET`을 같은 값으로 등록한다. 변수 `OFFICIAL_X_SYNC_URL`은 **운영 배포가 준비된 후** `https://noslog.app/api/cron/official-x`로 등록한다(운영 도메인이 다르면 바꾼다). URL을 비워 두면 작업은 건너뛴다. 비밀키를 URL에 넣지 않는다.
4. `Sync official X news` 워크플로를 기본 브랜치에 반영한다. 한국 시각 **09:17·21:17** 예약이며, GitHub 실행 지연이 있을 수 있다. Vercel Hobby의 일 1회 Cron 제한 때문에 GitHub Actions를 쓴다. `vercel.json`의 개인정보 Cron은 바꾸지 않는다. GitHub Actions 사용량은 해당 저장소 요금제 적용 대상이다.
5. 배포 후 Actions → 해당 워크플로 → **Run workflow**를 한 번 실행해 최초 자료를 준비한다. 이미 같은 UTC 반일 구간에 실행했다면 `skipped`가 정상이다. 초기 적재 전에는 홈 공식 소식이 기존 오류 안내를 표시한다. 수집 성공 후 홈의 한국어·일본어·영어와 원문 링크를 확인한다.
6. 로컬에서도 새 Prisma 모델을 읽도록 `prisma generate` 후 기존 dev 서버를 재시작한다. 운영 DB를 쓰는 localhost에서는 수집 API를 실행하지 않는다.

예약 작업의 HTTP 503은 X/DB 오류 또는 번역 미완료를 뜻한다. 워크플로가 실패로 표시되므로 Vercel의 `official-x.sync.failed` 로그를 확인한다. 같은 구간의 재실행은 과금 보호 때문에 건너뛰며, 강제 실행 우회 옵션은 없다.

## 읽기 전용 확인 SQL

적용 전 테이블 존재 확인:

```sql
SELECT to_regclass('public."OfficialXFeed"') AS table_name;
```

적용 및 최초 수집 후 확인(본문·비밀키는 출력하지 않음):

```sql
SELECT id,
       content->>'id' AS post_id,
       content->>'createdAt' AS posted_at,
       jsonb_typeof(content->'translations') = 'object' AS translated,
       last_attempt_at,
       last_success_at
FROM "OfficialXFeed";
```

새 테이블 추가이므로 기존 운영 데이터 수정 UPDATE는 필요 없다. 수동 SQL로 먼저 테이블을 만들면 Prisma migration 이력과 어긋날 수 있으므로 기존 배포 마이그레이션 경로를 사용한다.

## 한계

- `since_id`만으로 이미 저장된 글의 삭제·비공개 전환은 감지하지 못한다. 기존 ID의 내용 변경도 응답으로 돌아오지 않으면 감지하지 못한다. 정기 전체 재조회는 추가 과금·정책 결정이라 이 변경에 넣지 않았다. 자동 수정·삭제 동기화를 완료했다고 간주하지 않는다.
- 계정에 새 글이 여러 개 있어도 기존 홈과 같이 최신 하나만 보관한다. 이 서비스는 X 기록 보관소가 아니다.
- 예약 실행은 기본 브랜치에서 동작하고 지연·누락될 수 있다. 공개 저장소는 60일간 활동이 없으면 GitHub가 예약 작업을 비활성화할 수 있다. 홈 방문은 수집의 대체 트리거가 아니다.
- 기존 Next 캐시는 DB로 자동 이관하지 않는다. 최초 수집 때 최신 원문 1개를 다시 번역할 수 있다.

## 근거

- [X 사용자 게시글 API — since_id, max_results 최소 5](https://docs.x.com/x-api/users/get-posts)
- [Vercel Hobby Cron 제한](https://vercel.com/docs/cron-jobs/usage-and-pricing)
- [GitHub schedule 실행 조건](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)

## 이번 변경 검증 기록

- 전체 Vitest: 142개 파일 통과, 1,112개 테스트 통과(기존 skip 3개 파일·13개 테스트). 공식 X 관련 43개 테스트 포함.
- 전체 ESLint, TypeScript, Prisma schema validate, 변경 코드 Prettier 검사 통과.
- 별도 임시 폴더에서 `next build --webpack` 통과. 운영 환경변수를 복사하지 않고 도달 불가능한 로컬 DB 주소를 사용해 사이트맵 DB 조회 경고가 발생했다. 운영 DB 기반 사이트맵은 검증하지 않았다.
- 임시 로컬 PostgreSQL에서 마이그레이션 및 실제 claim SQL 검증: 동시 4건 중 1건만 실행권 획득, 같은 구간 재호출 차단, 다음 반일 구간 허용, 본문 보존, 구간 경계 중복 차단 통과. 테스트 DB는 종료·삭제했다.
- 실제 X·Gemini 호출, 운영 DB 마이그레이션·수집, 배포, GitHub Secret 등록, 게시 후 브라우저 재현, E2E는 실행하지 않았다.
- 초기 검증 실패는 테스트용 HTTP 헤더 입력 오류 및 테스트 DB 호스트 설정 불일치였다. 둘 다 검증 설정을 고친 뒤 통과했다.

## 커밋 묶음

제목: `perf: 공식 X 소식 수집과 번역을 홈 요청에서 분리`

서버·저장·예약 실행:

```bash
git add .env.example lib/env/server.ts prisma/schema.prisma prisma/migrations/20260919120000_official_x_feed/migration.sql
git add features/home/server/officialXPostService.ts features/home/server/officialXPostTranslation.ts features/home/server/officialXTimeline.ts features/home/server/officialXSync.ts features/home/schemas/officialXPostSchema.ts
git add app/api/cron/official-x/route.ts .github/workflows/official-x-sync.yml
```

회귀 테스트:

```bash
git add tests/official-x-post-service.test.ts tests/official-x-post-translation.test.ts tests/official-x-timeline.test.ts tests/official-x-sync.test.ts tests/official-x-cron.test.ts tests/fixtures/officialX.ts
```

문서(공용 문서는 Claude 변경이 섞였으면 공식 X 부분만 선택):

```bash
git add docs/operations/official-x-sync.md
git add -p README.md docs/design/README.md docs/design/decisions.md docs/design/product-rules.md
```
