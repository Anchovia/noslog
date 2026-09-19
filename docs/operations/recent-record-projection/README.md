# 최근 플레이 기반 개인 기록 갱신

2026-09-20. 코드 연결 완료. 운영 DB 적용과 실제 사용자 연동은 사용자가 진행한다.

## 동작

전체 응답이 없으면 DB에 누적된 최근 플레이를 개인 기록에 반영한다. Pass 가입 이력으로 사용자를 나누지 않는다. 이전 전체 연동이 있으면 기존 값을 기준으로 이어 간다. 점수·Basic Grd·콤보·FC는 각각 최고값을 유지하고, 점수 상승 시 해당 플레이의 판정과 날짜를 사용한다. 최근 응답에 없는 Recital·노트별 성공률·클리어 관련 값은 보존하며, 처음부터 없으면 null이다.

채보별 플레이 횟수와 확인된 FC/P 횟수는 새로 반영한 플레이만 더한다. 전체 플레이 횟수는 기존 player_info의 공식 값을 사용한다. 최근만 수집한 채보의 횟수는 수집한 플레이의 누적값이다. 전체 응답이 다시 들어오면 공식 값으로 보정한다. 기존 최근 플레이와 성장 이력은 지우지 않는다.

Grd 상위 50개·기존 Rating 계산식·등급 분포·서열 달성·랭킹에 저장된 개인 기록을 사용한다. Recital이 없으면 해당 Grd와 Rating은 null이다. 악곡 성장선은 날짜순 최근 플레이와 기존 최고점 이력을 합쳐 같은 연동의 중간 최고점도 남긴다. Grd·Rating은 실제 연동 관측 시점의 계산값을 저장한다. 기존 화면과 개인정보 공개 규칙을 유지하며 출처 배지를 추가하지 않는다.

## 운영 적용

1. [적용 전 SELECT](./before.sql)로 상태를 확인한다.
2. [Prisma 마이그레이션](../../../prisma/migrations/20260920010000_recent_record_projection/migration.sql)을 적용한다. 기존 최고 기록 값은 변경하지 않고, 마지막 전체 기록의 기준 시각만 초기화한다.

프로젝트 폴더에서 사용자가 실행:

```bash
npx prisma migrate deploy
npx prisma generate
```

`migrate deploy`는 현재 환경의 DATABASE_URL을 사용한다. 운영 배포도 기존 `vercel-build`에서 같은 마이그레이션을 적용한다. 개발 서버는 적용 후 사용자가 재시작한다. 새 클라이언트는 새 열을 사용하므로 DB 적용 전에 실제 연동을 검수하지 않는다.

Neon SQL Editor로 직접 적용할 때는 위 migration.sql의 전체 내용을 트랜잭션 안에서 한 번 실행하고, 성공한 경우에만 아래 명령으로 Prisma 이력을 맞춘다. `migrate deploy`로 이미 적용했다면 수동 SQL이나 아래 명령은 필요 없다.

```bash
npx prisma migrate resolve --applied 20260920010000_recent_record_projection
npx prisma generate
```

3. [적용 후 SELECT](./after.sql)로 새 열과 기준 시각을 확인한다.
4. 실제 연동 시 최초 최근 연동, 같은 기록 재연동, 전체 연동 후 최근 연동, 전체 재연동 순서로 확인한다. 반복 연동은 횟수가 늘지 않아야 하며 전체 연동에서 공식 횟수로 보정돼야 한다.

과거 최근 기록만 저장했던 사용자도 다음 최근 연동에서 미반영 이력을 함께 반영한다. 에이전트가 운영 DB를 일괄 수정하지 않았다.

## 중복과 실패 처리

`ChartPlayHistory.record_applied`가 반영 여부를 보관한다. 개인 최고 기록·스냅샷·등급 분포와 이 표시가 같은 트랜잭션으로 커밋된다. 실패하면 함께 롤백한다. `User.last_full_record_at`은 뒤늦게 수집된 이전 플레이를 공식 횟수에 다시 더하지 않도록 한다. 전체 연동에서는 공식 기록과 기준 시각·반영 표시를 함께 커밋한다. 중단된 동기화는 기록 변경 전에 거부한다.

Grd·Rating 계산만 실패한 경우 다음 최근 연동은 새 플레이가 없어도 파생 값 계산을 재시도한다. 최근·전체 연동 모두 개인 기록 관련 캐시를 갱신한다.

## 날짜 경계

공식 플레이 시각은 분 단위다. 전체 연동 시각과 같은 분의 뒤늦게 수집된 플레이는 보수적으로 이미 포함된 것으로 취급한다. 이 경계에서 정확한 선후를 확인할 수 없어 횟수가 부족하게 집계될 수 있으며 다음 전체 연동에서 보정된다. 파싱할 수 없는 날짜는 병합을 실패시켜 조용히 반영 완료로 표시하지 않는다.

## 검증

- 순수 병합: 중복·독립 최고값·날짜·Pass 전환 24개 테스트.
- 서비스: 메모리 트랜잭션 대역으로 반복 연동·실패 롤백·전체/최근 전환 검증.
- 실제 임시 PostgreSQL: 전체 마이그레이션, 최근 기록 수집/중복 제거, Grd/랭킹·악곡 성장선, 제약조건 실패의 실제 롤백과 재시도, 전체→최근→전체 전환 검증.
- 운영 DB 변경·실제 사용자 연동·로그인 상태 제출 검수는 수행하지 않았다.

로컬 DB 통합 테스트는 명시적으로 localhost 또는 127.0.0.1의 `noslog_recent_test` 데이터베이스만 허용한다:

```bash
NOSLOG_RECENT_TEST_DATABASE_URL='postgresql://사용자@127.0.0.1:포트/noslog_recent_test' npx vitest run tests/recent-record-database.test.ts
```

## 검증 결과와 커밋

타입검사·ESLint·전체 Vitest 통과. 임시 로컬 PostgreSQL 통합 테스트 3개 별도 통과. 사용자 개발 서버의 `.next`를 건드리지 않고, 비밀 환경파일이 없는 임시 소스 복사본과 로컬 테스트 DB로 `next build --webpack` 프로덕션 빌드도 통과했다. 브라우저 실제 연동 검수는 운영 DB 적용 전이므로 수행하지 않았다.

커밋 제목: `feat: 최근 플레이로 개인 기록과 랭킹 누적 갱신`

서버·스키마:

```bash
git add \
  app/api/receivePlayerData/route.ts \
  'app/(nevigation)/profile/[id]/data.ts' \
  lib/services/user/recentRecordMerge.ts \
  lib/services/user/updateRecentBestRecords.ts \
  lib/services/user/updatePlayData.ts \
  lib/services/user/updateGrade.ts \
  prisma/schema.prisma \
  prisma/migrations/20260920010000_recent_record_projection/
```

조회·결측값·안내:

```bash
git add \
  components/music/musicDetailTypes.ts \
  components/profile/dashboard/profileTypes.ts \
  features/music/lib/community.ts \
  features/music/server/musicDetailData.ts \
  features/profile/server/profilePlaysService.ts \
  features/profile/server/profileProgressService.ts \
  features/tiers/server/tierBrowserData.ts \
  lib/i18n/messageCatalogs/ko.ts \
  lib/i18n/messageCatalogs/ja.ts \
  lib/i18n/messageCatalogs/en.ts
```

테스트·문서:

```bash
git add \
  tests/recent-record-merge.test.ts \
  tests/recent-record-sync.test.ts \
  tests/recent-record-database.test.ts \
  tests/profile-grade-retention.test.ts \
  tests/profile-plays-service.test.ts \
  tests/sync-api.test.ts \
  docs/design/README.md \
  docs/design/decisions.md \
  docs/design/product-rules.md \
  docs/operations/recent-record-projection/
```
