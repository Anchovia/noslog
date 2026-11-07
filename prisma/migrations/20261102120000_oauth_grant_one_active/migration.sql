BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- 만료만 되고 닫히지 않은 연결은 새 연결을 막지 않게 먼저 닫는다
UPDATE "oauth_grants" SET "revoked_at" = now() WHERE "revoked_at" IS NULL AND "family_expires_at" <= now();

-- 사용자 · 클라이언트마다 활성 연결 하나. 부분 인덱스는 Prisma 스키마로 적을 수 없어 SQL 로만 둔다
-- CONCURRENTLY 는 트랜잭션 안에서 돌 수 없고, 위 UPDATE 와 한 번에 되돌아가야 한다. 행이 적어 쓰기를 막는 시간도 짧다
-- squawk-ignore require-concurrent-index-creation
CREATE UNIQUE INDEX "oauth_grants_one_active" ON "oauth_grants"("user_id", "client_id") WHERE "revoked_at" IS NULL;

COMMIT;
