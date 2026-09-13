-- 기체 메모를 위치 메모(note)와 상태 이유(condition_note)로 나눈다. 기존 메모는 옮기지 않는다
ALTER TABLE "ArcadeCabinet" ADD COLUMN "condition_note" TEXT;
