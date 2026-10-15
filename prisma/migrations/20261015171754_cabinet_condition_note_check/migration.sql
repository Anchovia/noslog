-- 2026-09-13 기체 메모를 위치 메모(note)와 상태 이유(condition_note)로 나눴지만 상태 검사 제약은 계속 note 를 봤다.
-- 그래서 보통 · 주의 기체를 위치 메모 없이 상태 이유만 적어 저장하면 DB 가 거절했다(2026-10-16 DB 재설계 B1).
-- 앱 규칙(features/arcades/schemas/arcade-schema.ts)과 같게 condition_note 를 보게 바꾼다. 나머지 조건은 그대로다.
-- NOT VALID — 09-13 전에 저장돼 상태 이유가 비어 있는 보통 · 주의 기체가 있어(개발 DB 1대) 옛 행은 검사하지 않고,
-- 새로 쓰거나 고치는 행부터 검사한다. 옛 행을 관리자 화면에서 고친 뒤 VALIDATE 는 따로 한다.
SET lock_timeout = '5s';

ALTER TABLE "ArcadeCabinet" DROP CONSTRAINT IF EXISTS "ArcadeCabinet_state_check";
ALTER TABLE "ArcadeCabinet" ADD CONSTRAINT "ArcadeCabinet_state_check" CHECK (
  "availability" IN ('unknown', 'available', 'unavailable')
  AND "condition" IN ('unknown', 'good', 'normal', 'caution')
  AND ("availability" = 'available' OR "condition" = 'unknown')
  AND ("condition" NOT IN ('normal', 'caution') OR length(btrim(COALESCE("condition_note", ''))) > 0)
  AND "position" >= 0
) NOT VALID;
