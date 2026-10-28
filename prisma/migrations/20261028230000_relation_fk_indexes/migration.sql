-- 관계 열 인덱스 4개 — prisma-lint require-field-index 가 요구한다. 표 · 열 · 데이터는 바꾸지 않는다.
-- 앞 마이그레이션과 같은 이유로 오프라인 비교(prisma migrate diff)로 만들었다.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- 네 표 모두 20261020 마이그레이션이 만든 새 표라 줄이 거의 없어, 쓰기를 잠깐 막는 일반 CREATE INDEX 로 충분하다
-- squawk-ignore require-concurrent-index-creation
CREATE INDEX "arcade_external_ids_verified_by_id_idx" ON "arcade_external_ids"("verified_by_id");

-- squawk-ignore require-concurrent-index-creation
CREATE INDEX "musecat_cabinet_notes_updated_by_id_idx" ON "musecat_cabinet_notes"("updated_by_id");

-- squawk-ignore require-concurrent-index-creation
CREATE INDEX "oauth_subjects_client_id_idx" ON "oauth_subjects"("client_id");

-- squawk-ignore require-concurrent-index-creation
CREATE INDEX "partner_outbox_messages_client_id_idx" ON "partner_outbox_messages"("client_id");

COMMIT;
