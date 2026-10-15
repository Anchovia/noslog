-- 투표는 공지 또는 이벤트 글 하나에만 딸린다(2026-09-23 V2). 두 칸이 모두 nullable 이라 DB 는 이 규칙을 몰랐다(2026-10-16 DB 재설계 C4).
-- 저장은 savePollWithPost 가 늘 한쪽만 채우고 글을 지우면 투표도 같이 지워지므로 어기는 행은 없어야 한다.
-- 배포 전 확인: SELECT count(*) FROM "Poll" WHERE num_nonnulls("announcement_id", "event_id") <> 1;  → 0
SET lock_timeout = '5s';

ALTER TABLE "Poll" ADD CONSTRAINT "Poll_single_owner_check"
  CHECK (num_nonnulls("announcement_id", "event_id") = 1) NOT VALID;
ALTER TABLE "Poll" VALIDATE CONSTRAINT "Poll_single_owner_check";
