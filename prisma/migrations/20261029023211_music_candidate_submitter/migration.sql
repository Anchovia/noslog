-- 곡 후보 제출자 열과 사람별 24시간 상한을 세는 인덱스. 기존 줄의 제출자는 비워(NULL) 둔다.
-- 제출자 열은 users.id 와 같은 Prisma 기본형(Int)에 맞춘다.
-- squawk-ignore-file prefer-bigint-over-int
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- AlterTable
ALTER TABLE "music_catalog_candidates" ADD COLUMN     "submitted_by_id" INTEGER;

-- 후보 표는 줄이 많지 않아(공식 곡 목록 변경 · 처리 이력) 쓰기를 잠깐 막는 일반 CREATE INDEX 로 충분하다
-- squawk-ignore require-concurrent-index-creation
CREATE INDEX "music_catalog_candidates_submitted_by_id_created_at_idx" ON "music_catalog_candidates"("submitted_by_id", "created_at");

-- 새 열은 모두 NULL 이라 확인할 참조가 없고, 파일 하나가 한 트랜잭션이라 NOT VALID 로 나눠도 잠금은 같다
-- squawk-ignore constraint-missing-not-valid, adding-foreign-key-constraint
ALTER TABLE "music_catalog_candidates" ADD CONSTRAINT "music_catalog_candidates_submitted_by_id_fkey" FOREIGN KEY ("submitted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
